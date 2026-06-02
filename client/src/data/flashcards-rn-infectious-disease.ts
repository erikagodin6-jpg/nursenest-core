import type { FlashcardData } from "./flashcards-rpn";

export const rnInfectiousDiseaseFlashcards: FlashcardData[] = [
  // ============================================================
  // BACTERIAL CELL STRUCTURE (25 cards)
  // ============================================================
  {
    id: "rn-bcs-1",
    type: "question",
    question: "What is the primary structural difference between gram-positive and gram-negative bacterial cell walls?",
    options: ["Gram-positive have flagella; gram-negative do not", "Gram-positive have a thick peptidoglycan layer; gram-negative have a thin peptidoglycan layer plus an outer membrane", "Gram-positive have an outer membrane; gram-negative do not", "Gram-negative bacteria lack peptidoglycan entirely"],
    correctIndex: 1,
    answer: "Gram-positive bacteria have a thick peptidoglycan layer (20-80 nm), while gram-negative bacteria have a thin peptidoglycan layer (1-3 nm) plus an outer membrane containing LPS. This structural difference determines antibiotic susceptibility and Gram stain appearance (purple vs. pink).",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-bcs-2",
    type: "question",
    question: "What is the clinical significance of Lipid A in gram-negative bacteria?",
    options: ["It provides structural support to the cell wall", "It is the endotoxin component of LPS that triggers septic shock via TLR4 activation", "It serves as a nutrient source for the bacteria", "It mediates antibiotic resistance"],
    correctIndex: 1,
    answer: "Lipid A is the endotoxin component of lipopolysaccharide (LPS) in the gram-negative outer membrane. When released during bacterial lysis, it activates TLR4 receptors on macrophages, triggering massive cytokine release (TNF-alpha, IL-1, IL-6) leading to the vasodilation, increased vascular permeability, and organ dysfunction characteristic of septic shock.",
    category: "Infectious Disease",
    difficulty: 3
  },
  {
    id: "rn-bcs-3",
    type: "question",
    question: "Why is vancomycin ineffective against gram-negative bacteria?",
    options: ["Gram-negative bacteria degrade vancomycin enzymatically", "Vancomycin is too large to penetrate the gram-negative outer membrane", "Gram-negative bacteria lack the D-Ala-D-Ala target", "Vancomycin is inactivated at the pH of gram-negative periplasm"],
    correctIndex: 1,
    answer: "Vancomycin is a large glycopeptide that cannot penetrate the outer membrane barrier of gram-negative bacteria. Its peptidoglycan target (D-Ala-D-Ala) exists in gram-negative organisms but is inaccessible behind the outer membrane. This is why gram-negative infections require antibiotics that can penetrate or bypass this barrier.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-bcs-4",
    type: "question",
    question: "What role do porins play in gram-negative bacteria, and how do they relate to antibiotic resistance?",
    options: ["Porins are toxins that damage host cells", "Porins are outer membrane channels that allow antibiotic entry; mutations reducing porins cause resistance", "Porins produce beta-lactamase enzymes", "Porins anchor the bacteria to host tissues"],
    correctIndex: 1,
    answer: "Porins (OmpC, OmpF) are transmembrane channel proteins in the gram-negative outer membrane that allow selective diffusion of hydrophilic molecules, including some antibiotics. Mutations that reduce or eliminate porin expression prevent antibiotic entry into the cell. Loss of OprD porin in Pseudomonas specifically eliminates carbapenem entry.",
    category: "Infectious Disease",
    difficulty: 3
  },
  {
    id: "rn-bcs-5",
    type: "question",
    question: "A patient with a central venous catheter has recurrent Staphylococcus epidermidis bacteremia despite appropriate antibiotic therapy. What is the most likely cause?",
    options: ["Antibiotic resistance has developed", "Biofilm formation on the catheter protects bacteria from antibiotics", "The wrong antibiotic was selected", "The patient is immunocompromised"],
    correctIndex: 1,
    answer: "S. epidermidis is a prolific biofilm producer on medical devices. Biofilm bacteria are protected by an extracellular polymeric substance (EPS) matrix that blocks antibiotic penetration and shields organisms from immune cells. Biofilm-embedded bacteria are 100-1000 times more resistant to antibiotics than free-floating (planktonic) bacteria, often requiring device removal.",
    category: "Infectious Disease",
    difficulty: 3
  },
  {
    id: "rn-bcs-6",
    type: "question",
    question: "What does peptidoglycan consist of, and why is it an antibiotic target?",
    options: ["Lipids and proteins; targeted because it's essential for metabolism", "Alternating NAG and NAM residues cross-linked by peptide bridges; targeted because it's essential for cell wall integrity", "DNA and RNA molecules; targeted to prevent replication", "Polysaccharides only; targeted because it stores energy"],
    correctIndex: 1,
    answer: "Peptidoglycan is composed of alternating N-acetylglucosamine (NAG) and N-acetylmuramic acid (NAM) residues cross-linked by short peptide bridges. This mesh provides structural rigidity and osmotic protection. Beta-lactam antibiotics inhibit transpeptidases (PBPs) that form these cross-links, causing cell lysis. Human cells lack peptidoglycan, making it a selective target.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-bcs-7",
    type: "question",
    question: "Gram stain results show gram-positive cocci in clusters from a wound culture. Which organism is most likely?",
    options: ["Streptococcus pyogenes", "Escherichia coli", "Staphylococcus aureus", "Enterococcus faecalis"],
    correctIndex: 2,
    answer: "Gram-positive cocci in clusters is the characteristic microscopic appearance of Staphylococcus species, most commonly S. aureus in clinical infections. Streptococcus appears in chains, Enterococcus in pairs/short chains, and E. coli is a gram-negative rod. Gram stain results guide empiric antibiotic selection within 1 hour.",
    category: "Infectious Disease",
    difficulty: 1
  },
  {
    id: "rn-bcs-8",
    type: "question",
    question: "What is the function of bacterial capsules in evading host immunity?",
    options: ["Capsules produce toxins that kill immune cells", "Capsules are polysaccharide layers that inhibit phagocytosis and complement deposition", "Capsules digest antibodies", "Capsules prevent bacterial attachment to host cells"],
    correctIndex: 1,
    answer: "Bacterial capsules are polysaccharide layers surrounding the cell wall that inhibit opsonization and phagocytosis by neutrophils and macrophages. Encapsulated organisms (S. pneumoniae, N. meningitidis, H. influenzae, Klebsiella) are particularly virulent. Conjugate vaccines work by targeting capsular polysaccharides to generate protective antibodies.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-bcs-9",
    type: "question",
    question: "Which component of gram-negative bacteria is responsible for the green-blue drainage characteristic of Pseudomonas infections?",
    options: ["Lipopolysaccharide", "Pyocyanin pigment produced by the organism", "Outer membrane porins", "Peptidoglycan breakdown products"],
    correctIndex: 1,
    answer: "Pseudomonas aeruginosa produces pyocyanin, a blue-green pigment that gives the characteristic appearance to wound drainage and sputum. Pyocyanin also functions as a virulence factor by generating reactive oxygen species that damage host tissues and impair neutrophil function. The fruity, grape-like odor is from another metabolite (2-aminoacetophenone).",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-bcs-10",
    type: "question",
    question: "What is the periplasmic space and why is it clinically important?",
    options: ["The space inside the nucleus containing DNA", "The space between inner and outer membranes of gram-negative bacteria containing beta-lactamases", "The space between two layers of peptidoglycan in gram-positive bacteria", "The space within the bacterial capsule"],
    correctIndex: 1,
    answer: "The periplasmic space exists between the inner cytoplasmic membrane and outer membrane of gram-negative bacteria. It contains beta-lactamase enzymes that can hydrolyze beta-lactam antibiotics before they reach their PBP targets on the inner membrane. This is a key resistance mechanism in gram-negative organisms.",
    category: "Infectious Disease",
    difficulty: 3
  },
  {
    id: "rn-bcs-11",
    type: "question",
    question: "Type III secretion systems in gram-negative bacteria are significant because they:",
    options: ["Produce antibiotic resistance enzymes", "Inject virulence effector proteins directly into host cells, subverting immune responses", "Facilitate nutrient absorption", "Enable bacterial reproduction"],
    correctIndex: 1,
    answer: "Type III secretion systems (T3SS) are needle-like protein complexes that inject bacterial effector proteins directly into host cells, bypassing extracellular immune defenses. These effectors can disrupt cytoskeletal function, inhibit phagocytosis, trigger apoptosis, or manipulate inflammatory signaling. T3SS is found in Pseudomonas, Salmonella, Shigella, and Yersinia.",
    category: "Infectious Disease",
    difficulty: 3
  },
  {
    id: "rn-bcs-12",
    type: "question",
    question: "What is the clinical significance of teichoic acids in gram-positive bacterial cell walls?",
    options: ["They provide antibiotic resistance", "They serve as adhesins for host tissue colonization and stimulate inflammatory cytokine release", "They prevent complement activation", "They are only present in gram-negative bacteria"],
    correctIndex: 1,
    answer: "Teichoic acids (wall teichoic acids and lipoteichoic acids) are polymers that thread through gram-positive peptidoglycan. They contribute to adhesion to host tissues, regulate cation homeostasis, serve as phage receptors, and stimulate inflammatory responses by activating TLR2 on immune cells, contributing to the inflammatory response during gram-positive infections.",
    category: "Infectious Disease",
    difficulty: 3
  },
  {
    id: "rn-bcs-13",
    type: "question",
    question: "A nurse collects blood cultures and Gram stain shows gram-negative rods. Which empiric antibiotic coverage is most appropriate?",
    options: ["Vancomycin monotherapy", "Piperacillin-tazobactam or cefepime for broad gram-negative coverage", "Oral amoxicillin", "Clindamycin"],
    correctIndex: 1,
    answer: "Gram-negative rods suggest Enterobacterales (E. coli, Klebsiella) or Pseudomonas. Empiric coverage requires broad-spectrum agents that penetrate the outer membrane: piperacillin-tazobactam or cefepime. Vancomycin cannot penetrate the gram-negative outer membrane. Oral amoxicillin is too narrow. Clindamycin primarily covers gram-positive organisms and anaerobes.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-bcs-14",
    type: "question",
    question: "Why must blood cultures be collected BEFORE administering antibiotics?",
    options: ["Antibiotics interfere with the blood draw technique", "Antibiotics kill organisms in the sample, potentially resulting in false-negative cultures and inability to identify the pathogen or test susceptibility", "Blood cultures are invalid if drawn after antibiotics due to regulatory requirements", "Antibiotics change the color of blood samples"],
    correctIndex: 1,
    answer: "Antibiotics in the bloodstream kill or suppress bacterial growth in culture media, producing false-negative results. Without organism identification and sensitivity testing, clinicians cannot narrow antibiotic therapy or identify resistance patterns. Always collect 2 sets from 2 separate sites before the first antibiotic dose — but NEVER delay antibiotics in sepsis to wait for cultures.",
    category: "Infectious Disease",
    difficulty: 1
  },
  {
    id: "rn-bcs-15",
    type: "question",
    question: "Which biofilm prevention strategy is most important for the nurse to implement?",
    options: ["Administering prophylactic antibiotics to all patients with medical devices", "Meticulous aseptic technique during insertion and maintenance of all invasive devices", "Replacing all IV lines every 12 hours", "Using only metal medical devices instead of plastic"],
    correctIndex: 1,
    answer: "Meticulous aseptic technique during device insertion and ongoing care (catheter bundles, central line maintenance protocols) is the cornerstone of biofilm prevention. Once biofilm forms, it is extremely difficult to eradicate. Prevention focuses on minimizing contamination at insertion and removing devices as soon as they are no longer clinically needed.",
    category: "Infectious Disease",
    difficulty: 1
  },
  {
    id: "rn-bcs-16",
    type: "question",
    question: "What is the clinical relevance of the O-antigen in gram-negative LPS?",
    options: ["It provides antibiotic resistance", "It provides serotype specificity used for epidemiological tracking and vaccine development", "It directly causes septic shock", "It inhibits phagocytosis like a capsule"],
    correctIndex: 1,
    answer: "The O-antigen is the outermost polysaccharide domain of LPS, extending from the bacterial surface. It provides serotype specificity — different O-antigen structures define E. coli serotypes (e.g., O157:H7). This is used for epidemiological tracking of outbreaks and has implications for vaccine development targeting specific serotypes.",
    category: "Infectious Disease",
    difficulty: 3
  },
  {
    id: "rn-bcs-17",
    type: "question",
    question: "Which type of bacteria is more likely to cause severe septic shock with hemodynamic collapse?",
    options: ["Gram-positive bacteria due to their thick cell wall", "Gram-negative bacteria due to LPS/endotoxin release triggering massive cytokine storms", "Both types cause identical sepsis presentations", "Neither type causes septic shock"],
    correctIndex: 1,
    answer: "Gram-negative bacteremia carries higher mortality than gram-positive due to endotoxin (Lipid A of LPS). When gram-negative bacteria lyse (including during antibiotic treatment), LPS is released, activating TLR4/NF-kB signaling in macrophages and triggering massive cytokine release (cytokine storm) leading to vasodilation, DIC, and multi-organ failure.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-bcs-18",
    type: "question",
    question: "What are fimbriae (pili) and what is their clinical significance?",
    options: ["Flagella used for swimming motility", "Hair-like surface appendages that mediate adhesion to host epithelial surfaces, enabling colonization", "Structures that store genetic material", "Enzymes that degrade antibiotics"],
    correctIndex: 1,
    answer: "Fimbriae (pili) are thin, hair-like protein appendages on the bacterial surface that mediate adhesion to host epithelial cells. Type 1 pili in E. coli bind to uroepithelial receptors, enabling urinary tract colonization. P pili bind to kidney epithelium, facilitating pyelonephritis. Pili also mediate biofilm formation on medical devices.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-bcs-19",
    type: "question",
    question: "Ecthyma gangrenosum is a necrotic skin lesion specifically associated with which organism?",
    options: ["Staphylococcus aureus", "Pseudomonas aeruginosa", "Streptococcus pyogenes", "Clostridium perfringens"],
    correctIndex: 1,
    answer: "Ecthyma gangrenosum is a characteristic necrotic skin lesion (painless, red-to-black, with necrotic center) associated with Pseudomonas aeruginosa bacteremia, typically in immunocompromised or neutropenic patients. It results from bacterial invasion of blood vessel walls causing thrombosis and tissue necrosis. Its presence in a febrile patient warrants immediate anti-pseudomonal therapy.",
    category: "Infectious Disease",
    difficulty: 3
  },
  {
    id: "rn-bcs-20",
    type: "question",
    question: "What is the function of flagella in bacterial pathogenesis?",
    options: ["They produce toxins", "They provide motility for tissue invasion and trigger innate immune responses via TLR5", "They form biofilms", "They transfer antibiotic resistance genes"],
    correctIndex: 1,
    answer: "Flagella are whip-like appendages that enable bacterial motility, facilitating tissue invasion and spread within the host. Flagellin protein is recognized by TLR5 on host immune cells, triggering innate inflammatory responses. Motile organisms (Proteus, Pseudomonas, E. coli) can ascend urinary catheters and spread through tissues more rapidly than non-motile organisms.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-bcs-21",
    type: "question",
    question: "What is the Gram stain appearance of Streptococcus pneumoniae?",
    options: ["Gram-negative rods", "Gram-positive cocci in clusters", "Gram-positive lancet-shaped diplococci", "Gram-negative intracellular diplococci"],
    correctIndex: 2,
    answer: "S. pneumoniae appears as gram-positive lancet-shaped (elongated) diplococci (pairs). This morphology is distinctive and helps differentiate it from S. aureus (clusters) and other streptococci (chains). S. pneumoniae is the most common cause of community-acquired pneumonia, bacterial meningitis in adults, and otitis media in children.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-bcs-22",
    type: "question",
    question: "Why is hand hygiene with soap and water required instead of alcohol-based sanitizer for C. difficile?",
    options: ["Alcohol-based sanitizers cause skin irritation with C. diff", "C. difficile forms spores that are resistant to alcohol — soap and water physically remove spores through friction", "C. diff is a virus that requires soap and water", "Hospital policy requires it but either method is equally effective"],
    correctIndex: 1,
    answer: "C. difficile forms endospores that are resistant to alcohol, heat, and many disinfectants. Alcohol-based hand sanitizers do NOT kill or remove C. diff spores. Soap and water combined with mechanical friction physically removes spores from hands. This is why contact precautions for C. diff specifically require soap and water hand hygiene and bleach-based surface cleaning.",
    category: "Infectious Disease",
    difficulty: 1
  },
  {
    id: "rn-bcs-23",
    type: "question",
    question: "What structural feature enables spore-forming bacteria (Clostridioides, Bacillus) to survive harsh conditions?",
    options: ["Their thick capsule", "A dormant endospore with a multilayered coat resistant to heat, chemicals, radiation, and desiccation", "Their outer membrane LPS", "Enhanced efflux pump activity"],
    correctIndex: 1,
    answer: "Endospores are metabolically dormant structures with a dehydrated core surrounded by multiple protective layers (cortex, spore coat, exosporium). They can survive boiling, UV radiation, chemical disinfectants, and years of desiccation. When conditions improve, spores germinate back into vegetative cells. This explains why C. difficile persists in hospital environments and requires bleach-based cleaning.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-bcs-24",
    type: "question",
    question: "What is the significance of beta-lactamase enzymes in the periplasmic space of gram-negative bacteria?",
    options: ["They help with nutrient absorption", "They hydrolyze beta-lactam antibiotics before they can reach their PBP targets, conferring resistance", "They produce energy for the cell", "They are non-functional remnants of evolution"],
    correctIndex: 1,
    answer: "Beta-lactamases in the periplasmic space enzymatically cleave the beta-lactam ring of penicillins, cephalosporins, and carbapenems, inactivating them before they reach penicillin-binding proteins (PBPs) on the inner membrane. This is the most common resistance mechanism in gram-negative bacteria. Beta-lactamase inhibitors (tazobactam, clavulanate, avibactam) are combined with beta-lactams to overcome this.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-bcs-25",
    type: "question",
    question: "Why do polymyxin antibiotics (colistin) work against multidrug-resistant gram-negative bacteria but have significant toxicity?",
    options: ["They target gram-positive peptidoglycan", "They disrupt the gram-negative outer membrane by binding to LPS/Lipid A, but also damage human cell membranes causing nephrotoxicity and neurotoxicity", "They inhibit protein synthesis like aminoglycosides", "They are prodrugs activated only in gram-negative cells"],
    correctIndex: 1,
    answer: "Polymyxins bind to the Lipid A component of LPS in the gram-negative outer membrane, disrupting membrane integrity and causing cell lysis. This mechanism makes them effective even against CRE. However, they also interact with eukaryotic cell membranes, causing dose-limiting nephrotoxicity (in up to 60% of patients) and neurotoxicity. They are reserved as last-resort agents.",
    category: "Infectious Disease",
    difficulty: 3
  },

  // ============================================================
  // ANTIBIOTIC RESISTANCE (25 cards)
  // ============================================================
  {
    id: "rn-abr-1",
    type: "question",
    question: "What is the mechanism of methicillin resistance in MRSA?",
    options: ["MRSA produces an enzyme that destroys methicillin", "The mecA gene encodes PBP2a, an altered penicillin-binding protein with low affinity for ALL beta-lactam antibiotics", "MRSA has enhanced efflux pumps for methicillin", "MRSA modifies methicillin into an inactive form"],
    correctIndex: 1,
    answer: "MRSA carries the mecA gene, which encodes PBP2a — an altered penicillin-binding protein with dramatically reduced affinity for all beta-lactam antibiotics (penicillins, cephalosporins, carbapenems). Since beta-lactams cannot bind PBP2a, they cannot inhibit cell wall synthesis. This is why MRSA requires vancomycin, daptomycin, or linezolid for treatment.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-abr-2",
    type: "question",
    question: "How does vancomycin-resistant Enterococcus (VRE) evade vancomycin?",
    options: ["VRE produces enzymes that degrade vancomycin", "The vanA gene cluster modifies the peptidoglycan precursor from D-Ala-D-Ala to D-Ala-D-Lac, preventing vancomycin binding", "VRE pumps vancomycin out of the cell", "VRE produces a biofilm that blocks vancomycin"],
    correctIndex: 1,
    answer: "VRE carries the vanA (high-level resistance) or vanB gene cluster, which modifies the terminus of the peptidoglycan precursor from D-Ala-D-Ala to D-Ala-D-Lac. This single amino acid change reduces vancomycin binding affinity by 1000-fold, rendering it ineffective. Treatment requires linezolid or daptomycin. VRE requires contact precautions.",
    category: "Infectious Disease",
    difficulty: 3
  },
  {
    id: "rn-abr-3",
    type: "question",
    question: "What is an extended-spectrum beta-lactamase (ESBL) and which antibiotics remain effective?",
    options: ["An enzyme that confers resistance to all antibiotics; no treatment available", "A plasmid-mediated enzyme that hydrolyzes third-generation cephalosporins; carbapenems remain effective", "A chromosomal mutation that enhances bacterial growth; fluoroquinolones are first-line", "An enzyme found only in gram-positive bacteria; vancomycin is the treatment"],
    correctIndex: 1,
    answer: "ESBLs (primarily CTX-M enzymes) are plasmid-mediated beta-lactamases that hydrolyze penicillins AND third-generation cephalosporins (ceftriaxone, ceftazidime). Carbapenems (meropenem, ertapenem) remain the treatment of choice because they resist ESBL hydrolysis. ESBL genes are carried on mobile plasmids that transfer between bacterial species via conjugation.",
    category: "Infectious Disease",
    difficulty: 3
  },
  {
    id: "rn-abr-4",
    type: "question",
    question: "What makes CRE (carbapenem-resistant Enterobacterales) so dangerous?",
    options: ["CRE infections are highly contagious via airborne spread", "CRE produce carbapenemases that destroy carbapenems — the antibiotics of last resort — leaving very few treatment options and carrying 40-50% mortality", "CRE only infect immunocompromised patients", "CRE are easily treated with oral antibiotics"],
    correctIndex: 1,
    answer: "CRE produce carbapenemases (KPC, NDM-1, OXA-48) that hydrolyze carbapenems, the broadest-spectrum beta-lactam antibiotics traditionally reserved for MDR infections. With carbapenems eliminated, treatment options are limited to ceftazidime-avibactam, polymyxins (colistin), or tigecycline — all with significant toxicity profiles. CRE infections carry 40-50% mortality.",
    category: "Infectious Disease",
    difficulty: 3
  },
  {
    id: "rn-abr-5",
    type: "question",
    question: "What is horizontal gene transfer and why is it significant for antibiotic resistance?",
    options: ["Genes passing from parent to offspring during cell division", "Transfer of resistance genes between bacteria via conjugation, transformation, or transduction, allowing rapid spread of resistance across species", "Mutation of existing genes during DNA replication", "Genetic recombination during sexual reproduction"],
    correctIndex: 1,
    answer: "Horizontal gene transfer (HGT) allows bacteria to share resistance genes with unrelated species. Conjugation (direct cell-to-cell transfer via pili) is the most clinically significant mechanism, transferring resistance plasmids carrying ESBL, carbapenemase, and vanA genes. A single conjugation event can transfer multiple resistance genes simultaneously, creating MDR organisms.",
    category: "Infectious Disease",
    difficulty: 3
  },
  {
    id: "rn-abr-6",
    type: "question",
    question: "How do efflux pumps contribute to multidrug resistance?",
    options: ["They break down antibiotics into inactive components", "They actively pump antibiotics out of the bacterial cell before they reach their targets, with a single pump system able to expel multiple antibiotic classes", "They prevent antibiotics from being absorbed by the patient", "They only affect one specific antibiotic class"],
    correctIndex: 1,
    answer: "Efflux pumps are transmembrane protein complexes that actively transport antibiotics out of the bacterial cell. A single pump system (e.g., MexAB-OprM in Pseudomonas) can expel multiple antibiotic classes simultaneously (beta-lactams, fluoroquinolones, chloramphenicol), contributing to multidrug resistance with a single genetic change.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-abr-7",
    type: "question",
    question: "Which isolation precaution is required for a patient with MRSA?",
    options: ["Airborne precautions with N95 respirator", "Contact precautions with gown and gloves", "Droplet precautions with surgical mask", "Standard precautions only"],
    correctIndex: 1,
    answer: "MRSA requires contact precautions: gown and gloves for all patient contact, dedicated equipment, and hand hygiene with soap and water or alcohol-based sanitizer (MRSA is not spore-forming, so alcohol is effective). The patient should be in a private room or cohorted with other MRSA patients. MRSA is spread by direct contact, not airborne or droplet transmission.",
    category: "Infectious Disease",
    difficulty: 1
  },
  {
    id: "rn-abr-8",
    type: "question",
    question: "A nurse notes that a patient's wound culture shows 'ESBL-producing E. coli sensitive to meropenem.' What does this mean for treatment?",
    options: ["Any penicillin or cephalosporin will work", "Meropenem (a carbapenem) is needed because ESBLs destroy penicillins and cephalosporins", "Only vancomycin will be effective", "Oral antibiotics are sufficient"],
    correctIndex: 1,
    answer: "ESBL-producing E. coli are resistant to penicillins and cephalosporins (including third-generation like ceftriaxone) due to ESBL enzymes. Carbapenems like meropenem resist ESBL hydrolysis and are the treatment of choice. The sensitivity report confirms meropenem will be effective against this specific isolate.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-abr-9",
    type: "question",
    question: "What is the purpose of antibiotic stewardship programs?",
    options: ["To reduce hospital pharmacy costs as the primary goal", "To optimize antibiotic use, improve patient outcomes, and slow the emergence of resistance through evidence-based prescribing", "To eliminate all antibiotic prescribing", "To ensure every patient receives the broadest-spectrum antibiotic available"],
    correctIndex: 1,
    answer: "Antibiotic stewardship programs aim to optimize antimicrobial use through evidence-based prescribing: selecting the right drug, right dose, right duration. Goals include improving patient outcomes, reducing adverse effects (C. difficile), and slowing resistance emergence. Key strategies include the 48-72 hour antibiotic timeout, culture-guided de-escalation, and IV-to-oral conversion protocols.",
    category: "Infectious Disease",
    difficulty: 1
  },
  {
    id: "rn-abr-10",
    type: "question",
    question: "What is the 48-72 hour antibiotic timeout?",
    options: ["A mandatory break from antibiotic therapy every 48-72 hours", "A structured reassessment at 48-72 hours to evaluate if antibiotics are still indicated, if spectrum can be narrowed, and to set a stop date", "A cooling period before antibiotics can be restarted", "A regulatory requirement to pause all medications"],
    correctIndex: 1,
    answer: "The antibiotic timeout is a stewardship cornerstone: at 48-72 hours after initiation, the team reassesses whether antibiotics are still indicated, whether the spectrum can be narrowed based on culture results (de-escalation), and sets a planned stop date. This prevents unnecessarily prolonged broad-spectrum therapy and reduces C. difficile risk and resistance selection.",
    category: "Infectious Disease",
    difficulty: 1
  },
  {
    id: "rn-abr-11",
    type: "question",
    question: "Why is procalcitonin useful in antibiotic stewardship?",
    options: ["It directly measures antibiotic levels in the blood", "Procalcitonin levels rise specifically in bacterial infections and can guide safe antibiotic discontinuation when levels fall below 0.25 ng/mL", "It identifies the specific bacterial species causing infection", "It measures antibiotic resistance patterns"],
    correctIndex: 1,
    answer: "Procalcitonin is a biomarker that rises specifically in bacterial infections (produced by thyroid C cells in response to bacterial endotoxins). Levels <0.25 ng/mL support safe antibiotic discontinuation in lower respiratory infections. Procalcitonin-guided therapy has been shown to reduce antibiotic exposure by 2-3 days without worsening outcomes.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-abr-12",
    type: "question",
    question: "What is the MRSA nasal swab PCR used for in stewardship?",
    options: ["Diagnosing MRSA pneumonia definitively", "Screening to guide de-escalation of empiric vancomycin — a negative result (NPV >95%) supports discontinuing vancomycin", "Determining vancomycin dosing", "Identifying all resistant organisms in the patient"],
    correctIndex: 1,
    answer: "MRSA nasal swab PCR has a negative predictive value >95% for MRSA pneumonia. A negative nasal swab allows de-escalation by discontinuing empiric vancomycin with high confidence that the pneumonia is not caused by MRSA. This is an important stewardship tool that reduces unnecessary vancomycin use and its associated nephrotoxicity.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-abr-13",
    type: "question",
    question: "A patient on vancomycin develops new watery diarrhea (10 stools/day). What should the nurse suspect and do?",
    options: ["Normal antibiotic side effect; continue current therapy", "Possible C. difficile infection; implement contact precautions, collect stool for C. diff toxin, notify provider", "Viral gastroenteritis; standard precautions only", "Lactose intolerance; switch to a dairy-free diet"],
    correctIndex: 1,
    answer: "New-onset watery diarrhea (≥3 unformed stools/24 hours) during or after antibiotic therapy is C. difficile until proven otherwise. The nurse should implement contact precautions immediately, collect stool for C. diff toxin testing, use soap and water hand hygiene (alcohol doesn't kill spores), and notify the provider. C. diff is the most common healthcare-associated infection.",
    category: "Infectious Disease",
    difficulty: 1
  },
  {
    id: "rn-abr-14",
    type: "question",
    question: "What is the difference between bacteriostatic and bactericidal antibiotics?",
    options: ["Both kill bacteria equally", "Bacteriostatic inhibit bacterial growth (the immune system must clear infection); bactericidal directly kill bacteria", "Bacteriostatic work faster than bactericidal", "Bactericidal are always preferred in all infections"],
    correctIndex: 1,
    answer: "Bacteriostatic antibiotics (tetracyclines, macrolides, chloramphenicol) inhibit bacterial growth and reproduction but do not kill organisms — the host immune system must clear the infection. Bactericidal antibiotics (beta-lactams, aminoglycosides, fluoroquinolones) directly kill bacteria. Bactericidal agents are preferred for immunocompromised patients, endocarditis, and meningitis.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-abr-15",
    type: "question",
    question: "Why is extended-infusion (4-hour) piperacillin-tazobactam preferred over standard 30-minute infusion?",
    options: ["It reduces medication cost", "It maximizes the time that drug concentration stays above the MIC for this time-dependent antibiotic, improving clinical outcomes", "It reduces allergic reactions", "It increases the drug's spectrum of activity"],
    correctIndex: 1,
    answer: "Beta-lactams are time-dependent antibiotics — their efficacy depends on the duration that drug concentration exceeds the MIC (fT>MIC). Extended infusion over 4 hours maintains therapeutic levels above the MIC for a longer percentage of the dosing interval compared to a rapid 30-minute infusion, significantly improving clinical outcomes in serious infections.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-abr-16",
    type: "question",
    question: "What is red man syndrome and how should the nurse manage it?",
    options: ["A true allergic reaction to vancomycin requiring permanent discontinuation", "A histamine-mediated reaction from rapid vancomycin infusion causing flushing and pruritus; managed by slowing the infusion rate and administering diphenhydramine", "An infection caused by vancomycin-resistant organisms", "A sign of vancomycin toxicity requiring immediate discontinuation"],
    correctIndex: 1,
    answer: "Red man syndrome is NOT a true allergy — it is a histamine-mediated reaction triggered by rapid vancomycin infusion. It presents as diffuse flushing, pruritus, and erythema of the upper body. Management: slow the infusion rate (infuse over ≥1 hour, ≥2 hours for doses >1g) and administer diphenhydramine. It does NOT contraindicate future vancomycin use.",
    category: "Infectious Disease",
    difficulty: 1
  },
  {
    id: "rn-abr-17",
    type: "question",
    question: "What is AUC-guided vancomycin dosing?",
    options: ["Dosing based on the patient's age only", "Dosing optimized to achieve an AUC/MIC ratio of 400-600, replacing older trough-based monitoring to improve efficacy and reduce nephrotoxicity", "Giving a fixed dose regardless of renal function", "Dosing based on weight alone without blood level monitoring"],
    correctIndex: 1,
    answer: "AUC (area under the curve)-guided vancomycin dosing targets an AUC/MIC ratio of 400-600 mg*hr/L. This approach has replaced trough-based monitoring (which targeted 15-20 mcg/mL). AUC-guided dosing more accurately predicts clinical efficacy while reducing nephrotoxicity risk. It requires at least two serum vancomycin levels for Bayesian pharmacokinetic calculation.",
    category: "Infectious Disease",
    difficulty: 3
  },
  {
    id: "rn-abr-18",
    type: "question",
    question: "A patient with a UTI is prescribed ciprofloxacin despite culture showing E. coli susceptibility to nitrofurantoin. What stewardship concern exists?",
    options: ["No concern — ciprofloxacin is a better antibiotic", "Ciprofloxacin is unnecessary broad-spectrum therapy when a narrower agent (nitrofurantoin) would be effective, increasing resistance risk and adverse effects", "Nitrofurantoin is too expensive", "Both antibiotics are equally appropriate"],
    correctIndex: 1,
    answer: "Using broader-spectrum ciprofloxacin when narrower nitrofurantoin is effective violates stewardship principles. Fluoroquinolone overuse drives C. difficile risk, resistance development, and carries FDA black-box warnings for tendon rupture and peripheral neuropathy. Stewardship advocates for the narrowest effective agent to minimize collateral damage.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-abr-19",
    type: "question",
    question: "What is the nurse's role in IV-to-oral antibiotic conversion?",
    options: ["Nurses have no role in IV-to-oral conversion decisions", "Assess readiness criteria (tolerating oral intake, improving clinically, afebrile) and advocate for conversion to reduce IV complications and hospital stay", "Switch all IV antibiotics to oral at 24 hours regardless of clinical status", "Only pharmacists can recommend IV-to-oral conversion"],
    correctIndex: 1,
    answer: "Nurses play a critical role in IV-to-oral conversion by assessing readiness criteria: patient tolerating oral intake, clinically improving (afebrile, decreasing WBC, resolving infection signs), and functioning GI tract. Early IV-to-oral switch reduces IV-related complications (phlebitis, CLABSI), decreases hospital stay, and is a key stewardship strategy.",
    category: "Infectious Disease",
    difficulty: 1
  },
  {
    id: "rn-abr-20",
    type: "question",
    question: "Which antibiotic class is most strongly associated with C. difficile infection?",
    options: ["Aminoglycosides", "Fluoroquinolones, clindamycin, and broad-spectrum cephalosporins", "Nitrofurantoin", "Trimethoprim-sulfamethoxazole"],
    correctIndex: 1,
    answer: "Fluoroquinolones (ciprofloxacin, levofloxacin), clindamycin, and broad-spectrum cephalosporins are the antibiotics most strongly associated with C. difficile infection. These agents significantly disrupt normal colonic flora, allowing C. difficile overgrowth. Narrow-spectrum agents like nitrofurantoin and TMP-SMX carry much lower C. diff risk.",
    category: "Infectious Disease",
    difficulty: 1
  },
  {
    id: "rn-abr-21",
    type: "question",
    question: "What is the significance of the minimum inhibitory concentration (MIC)?",
    options: ["The highest dose a patient can safely receive", "The lowest concentration of antibiotic that inhibits visible bacterial growth — lower MIC values indicate greater susceptibility", "The minimum number of doses needed to cure an infection", "The minimum time antibiotics must be given"],
    correctIndex: 1,
    answer: "MIC is the lowest antibiotic concentration that inhibits visible bacterial growth in laboratory testing. Lower MIC values indicate the organism is more susceptible (easier to treat). MIC breakpoints define whether an organism is 'susceptible,' 'intermediate,' or 'resistant.' MIC values guide antibiotic selection and dosing optimization in stewardship.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-abr-22",
    type: "question",
    question: "What isolation precautions are required for CRE-colonized patients?",
    options: ["Standard precautions only", "Enhanced contact precautions: gown, gloves, dedicated equipment, private room, and enhanced environmental cleaning", "Airborne precautions with negative pressure room", "Droplet precautions with surgical mask"],
    correctIndex: 1,
    answer: "CRE requires enhanced contact precautions: gown and gloves, dedicated patient equipment (stethoscope, BP cuff), private room (no cohorting with non-CRE patients), enhanced environmental cleaning with EPA-registered disinfectants, and strict hand hygiene. Some facilities implement active surveillance cultures for CRE in high-risk patients.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-abr-23",
    type: "question",
    question: "How does conjugation spread antibiotic resistance between bacteria?",
    options: ["Through airborne transmission between patients", "Direct cell-to-cell transfer of resistance-carrying plasmids through pili, allowing resistance genes to spread between bacterial species", "Through viral particles that carry resistance genes", "Through absorption of free DNA from the environment"],
    correctIndex: 1,
    answer: "Conjugation involves direct cell-to-cell contact via a sex pilus, through which a donor bacterium transfers a resistance-carrying plasmid to a recipient. This is the most clinically significant form of horizontal gene transfer because: plasmids can carry multiple resistance genes simultaneously, transfer occurs between different bacterial species, and it happens at high rates in environments with antibiotic pressure.",
    category: "Infectious Disease",
    difficulty: 3
  },
  {
    id: "rn-abr-24",
    type: "question",
    question: "A patient has been on meropenem for 5 days. Cultures now show the organism is susceptible to ceftriaxone. What stewardship action should occur?",
    options: ["Continue meropenem since it's working", "De-escalate to ceftriaxone — a narrower-spectrum agent that is effective based on susceptibility, preserving carbapenems and reducing resistance pressure", "Add a second antibiotic for synergy", "Stop all antibiotics immediately"],
    correctIndex: 1,
    answer: "De-escalation from broad-spectrum (meropenem) to narrower-spectrum (ceftriaxone) when culture susceptibility supports it is a cornerstone of antibiotic stewardship. This preserves carbapenems for truly resistant organisms, reduces the selection pressure for CRE development, and decreases adverse effects and C. difficile risk.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-abr-25",
    type: "question",
    question: "Why should aminoglycoside trough levels be kept below 1 mcg/mL?",
    options: ["Higher troughs indicate treatment success", "Elevated trough levels indicate drug accumulation and increase the risk of nephrotoxicity and ototoxicity", "Troughs below 1 indicate the drug is ineffective", "Trough levels have no clinical significance for aminoglycosides"],
    correctIndex: 1,
    answer: "Aminoglycosides exhibit concentration-dependent killing but time-dependent toxicity. Elevated trough levels (>1 mcg/mL) indicate the drug is not being cleared between doses, accumulating in the renal cortex and cochlear hair cells, causing irreversible nephrotoxicity and ototoxicity. Extended-interval (once-daily) dosing maximizes peak-to-MIC ratios while allowing troughs to fall below toxic levels.",
    category: "Infectious Disease",
    difficulty: 2
  },

  // ============================================================
  // VACCINE MECHANISMS (25 cards)
  // ============================================================
  {
    id: "rn-vax-1",
    type: "question",
    question: "What is the difference between active and passive immunity?",
    options: ["Active immunity is always artificial; passive is always natural", "Active immunity involves the host generating their own immune response and memory cells; passive immunity involves receiving pre-formed antibodies (temporary, no memory)", "Active immunity lasts days; passive immunity lasts years", "There is no meaningful clinical difference"],
    correctIndex: 1,
    answer: "Active immunity (vaccination or natural infection) stimulates the host's own immune system to produce antibodies and memory cells, providing long-lasting protection. Passive immunity (maternal antibodies, immunoglobulin therapy) transfers pre-formed antibodies providing immediate but temporary protection (weeks to months) without generating memory cells.",
    category: "Infectious Disease",
    difficulty: 1
  },
  {
    id: "rn-vax-2",
    type: "question",
    question: "Why are live attenuated vaccines contraindicated in immunocompromised patients?",
    options: ["They contain too much antigen", "The weakened but living organisms can replicate uncontrollably in immunocompromised patients, potentially causing disseminated infection", "They cause severe allergic reactions more frequently", "They interfere with chemotherapy drugs"],
    correctIndex: 1,
    answer: "Live attenuated vaccines (MMR, varicella, rotavirus, live influenza) contain weakened organisms that replicate briefly in immunocompetent hosts, stimulating robust immunity. In immunocompromised patients (chemotherapy, high-dose steroids, HIV with CD4 <200), the impaired immune system cannot control even attenuated organisms, risking disseminated, potentially fatal vaccine-strain infection.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-vax-3",
    type: "question",
    question: "What is herd immunity and what vaccination coverage is needed for measles?",
    options: ["Herd immunity means everyone must be vaccinated; 100% coverage required", "When enough people are immune, transmission drops below sustainability, protecting unvaccinated individuals; measles requires 93-95% coverage due to its high R0 of 12-18", "Herd immunity only applies to animal diseases", "50% coverage is sufficient for all diseases"],
    correctIndex: 1,
    answer: "Herd immunity occurs when a sufficient proportion of the population is immune, reducing transmission to levels that protect unvaccinated individuals (infants, immunocompromised). Measles requires 93-95% coverage because of its extremely high R0 (12-18), meaning each infected person can infect 12-18 others. Even small drops below this threshold can trigger outbreaks.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-vax-4",
    type: "question",
    question: "How do mRNA vaccines (Pfizer/Moderna COVID-19) work?",
    options: ["They inject weakened live virus into the body", "Lipid nanoparticle-encapsulated mRNA instructs host cells to produce the target antigen protein, triggering an immune response. mRNA never enters the nucleus or alters DNA", "They directly inject antibodies for immediate protection", "They use inactivated whole virus particles"],
    correctIndex: 1,
    answer: "mRNA vaccines deliver synthetic mRNA encoding the target antigen (e.g., spike protein) encapsulated in lipid nanoparticles. After injection, host cells translate the mRNA into the antigen protein, which is displayed on the cell surface, triggering both humoral (antibody) and cell-mediated immune responses. The mRNA is degraded within hours and never enters the nucleus or integrates into DNA.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-vax-5",
    type: "question",
    question: "A patient develops urticaria, wheezing, and hypotension 5 minutes after vaccination. What is the priority intervention?",
    options: ["Administer diphenhydramine IV", "Administer epinephrine 0.3 mg IM in the anterolateral thigh immediately", "Start oxygen and call for help", "Position the patient flat and elevate legs"],
    correctIndex: 1,
    answer: "This is anaphylaxis — a life-threatening allergic emergency. Epinephrine IM is the FIRST-LINE intervention (0.01 mg/kg, max 0.5 mg adult) given in the anterolateral thigh. Do NOT delay for other interventions. Epinephrine reverses bronchospasm, vasodilation, and increased vascular permeability. Antihistamines, oxygen, and positioning are adjuncts given AFTER epinephrine.",
    category: "Infectious Disease",
    difficulty: 1
  },
  {
    id: "rn-vax-6",
    type: "question",
    question: "Why is Tdap recommended during pregnancy at 27-36 weeks gestation?",
    options: ["To protect the mother from tetanus exposure", "Maternal IgG antibodies cross the placenta in the third trimester, providing passive immunity to the newborn against pertussis during the vulnerable period before their own DTaP series begins", "To boost the mother's immunity after delivery", "It is only recommended for high-risk pregnancies"],
    correctIndex: 1,
    answer: "Tdap at 27-36 weeks allows maximum maternal antibody production during the peak period of placental IgG transfer (third trimester). These passive antibodies protect the newborn against pertussis (whooping cough) during the critical first 2-3 months of life before they receive their own DTaP series. Pertussis in young infants carries significant morbidity and mortality.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-vax-7",
    type: "question",
    question: "What is the role of adjuvants in vaccines?",
    options: ["They are preservatives that prevent vaccine contamination", "They are substances added to enhance the immune response by activating innate immunity, recruiting antigen-presenting cells, and promoting antigen depot formation", "They weaken the virus in live vaccines", "They are coloring agents for identification purposes"],
    correctIndex: 1,
    answer: "Adjuvants (aluminum salts, AS04, MF59) are immunostimulatory substances added to vaccines to boost the adaptive immune response. They work by: creating an antigen depot at the injection site for prolonged antigen exposure, activating innate immune cells (dendritic cells, macrophages), enhancing antigen presentation to T cells, and promoting stronger antibody production with fewer doses.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-vax-8",
    type: "question",
    question: "Why must live vaccines not given simultaneously be separated by at least 28 days?",
    options: ["To reduce injection site reactions", "The immune response to the first live vaccine can interfere with the replication and immunogenicity of the second live vaccine if given too close together", "To prevent overwhelming the immune system", "To allow time for the first vaccine to be fully absorbed"],
    correctIndex: 1,
    answer: "When two live vaccines are given within 28 days (but not simultaneously), the interferon and immune activation from the first vaccine can suppress replication of the second live vaccine, reducing its immunogenicity. When given simultaneously at different sites, this interference does not occur because both vaccines begin replicating before the immune response to either is established.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-vax-9",
    type: "question",
    question: "Why are conjugate vaccines (PCV13, Hib) necessary for children under 2 years?",
    options: ["Children under 2 cannot receive any type of vaccine", "Young children's immature immune systems cannot mount T-cell-dependent responses to polysaccharide antigens alone; conjugation to a carrier protein converts the response to T-cell-dependent, enabling effective immunity", "Conjugate vaccines are less expensive", "Only conjugate vaccines can be given orally"],
    correctIndex: 1,
    answer: "Children under 2 years have immature B-cells that cannot respond to pure polysaccharide antigens (T-cell-independent response). Conjugating the polysaccharide to a carrier protein (e.g., CRM197, tetanus toxoid) recruits T-helper cells, converting the response to T-cell-dependent and enabling memory B-cell formation. This is why PCV13 (pneumococcal) and Hib vaccines are effective in infants.",
    category: "Infectious Disease",
    difficulty: 3
  },
  {
    id: "rn-vax-10",
    type: "question",
    question: "What observation period is required after vaccine administration?",
    options: ["No observation is required", "15 minutes for routine vaccinations; 30 minutes if history of severe allergic reactions or allergy immunotherapy", "60 minutes for all vaccines", "24-hour hospital admission for observation"],
    correctIndex: 1,
    answer: "All patients should be observed for at least 15 minutes post-vaccination for anaphylaxis (which typically occurs within 15 minutes). Patients with a history of severe allergic reactions to any cause, or those receiving allergy immunotherapy, should be observed for 30 minutes. Emergency equipment including epinephrine must be immediately available.",
    category: "Infectious Disease",
    difficulty: 1
  },
  {
    id: "rn-vax-11",
    type: "question",
    question: "What is the correct injection site for IM vaccination in infants under 12 months?",
    options: ["Deltoid muscle", "Vastus lateralis (anterolateral thigh)", "Gluteus maximus (buttock)", "Forearm"],
    correctIndex: 1,
    answer: "The vastus lateralis (anterolateral thigh) is the preferred IM injection site for infants under 12 months. This large muscle mass ensures adequate absorption and avoids the risk of sciatic nerve injury (gluteal injections). The deltoid muscle is too small in infants. For children ≥12 months and adults, the deltoid is the preferred site.",
    category: "Infectious Disease",
    difficulty: 1
  },
  {
    id: "rn-vax-12",
    type: "question",
    question: "A parent reports their child developed a mild rash and low-grade fever 10 days after MMR vaccination. What should the nurse advise?",
    options: ["Go to the emergency department immediately", "This is a normal immune response (mini-measles); the child is not infectious, and future MMR doses are not contraindicated", "The child should never receive MMR again", "Administer antihistamines and antipyretics continuously for 2 weeks"],
    correctIndex: 1,
    answer: "A mild rash and low-grade fever 7-12 days after MMR vaccination is a normal immune response sometimes called 'mini-measles.' It represents the immune system responding to the attenuated measles component. The child is NOT infectious to others, and this reaction does NOT contraindicate future MMR doses. Supportive care with acetaminophen for fever is sufficient.",
    category: "Infectious Disease",
    difficulty: 1
  },
  {
    id: "rn-vax-13",
    type: "question",
    question: "What is Vaccine Information Statement (VIS) and when must it be provided?",
    options: ["A marketing brochure provided at patient request", "A federally required document explaining the vaccine's benefits, risks, and adverse events that must be given to the patient/guardian before EVERY vaccination", "A consent form that replaces verbal consent", "An optional handout for healthcare workers only"],
    correctIndex: 1,
    answer: "The Vaccine Information Statement (VIS) is a federally mandated document that must be provided before every vaccination for vaccines covered under the National Childhood Vaccine Injury Act. It explains the disease, vaccine benefits, risks, and what to do if adverse events occur. Documentation must include the VIS date and the date it was given to the patient.",
    category: "Infectious Disease",
    difficulty: 1
  },
  {
    id: "rn-vax-14",
    type: "question",
    question: "What is VAERS and when should a nurse report to it?",
    options: ["A vaccine distribution system", "The Vaccine Adverse Event Reporting System — nurses should report any clinically significant adverse event following vaccination, including anaphylaxis, hospitalization, or death", "A vaccine scheduling app", "An insurance billing code system for vaccines"],
    correctIndex: 1,
    answer: "VAERS (Vaccine Adverse Event Reporting System) is a national passive surveillance system for monitoring vaccine safety. Healthcare providers are required to report certain adverse events (anaphylaxis, hospitalization, death, events listed in the VAERS Table of Reportable Events) and are encouraged to report any clinically significant adverse event following vaccination.",
    category: "Infectious Disease",
    difficulty: 1
  },
  {
    id: "rn-vax-15",
    type: "question",
    question: "Which of the following is NOT a contraindication to vaccination?",
    options: ["Anaphylaxis to a previous dose of the same vaccine", "Mild upper respiratory infection with low-grade fever", "Severe immunocompromise for live vaccines", "Known severe allergy to a vaccine component"],
    correctIndex: 1,
    answer: "Mild acute illness (runny nose, mild cough, low-grade fever, mild diarrhea) is NOT a contraindication to vaccination. Delaying vaccination for mild illness is a common cause of missed immunizations. True contraindications include: anaphylaxis to a previous dose or vaccine component, severe immunocompromise for live vaccines, and encephalopathy within 7 days of pertussis vaccine.",
    category: "Infectious Disease",
    difficulty: 1
  },
  {
    id: "rn-vax-16",
    type: "question",
    question: "How do memory B-cells provide long-term vaccine protection?",
    options: ["They continuously produce antibodies for the rest of the person's life", "They persist in lymphoid tissue for years and rapidly differentiate into antibody-producing plasma cells upon re-exposure, mounting a faster and stronger secondary immune response", "They directly kill infected cells like cytotoxic T-cells", "They produce interferon to prevent viral entry"],
    correctIndex: 1,
    answer: "Memory B-cells formed during the primary immune response to vaccination persist in lymphoid tissue for years to decades. Upon re-exposure to the pathogen, they rapidly proliferate and differentiate into plasma cells, producing high-affinity, class-switched antibodies (IgG) within 1-3 days — much faster than the 7-14 day primary response. This is why booster doses enhance and extend protection.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-vax-17",
    type: "question",
    question: "Why is egg allergy no longer a contraindication to most influenza vaccines?",
    options: ["Eggs are no longer used in vaccine production", "Recombinant (Flublok) and cell-based influenza vaccines contain no egg protein; even egg-cultured vaccines contain negligible egg protein deemed safe for most egg-allergic patients", "Egg allergy never causes vaccine reactions", "All patients receive desensitization before vaccination"],
    correctIndex: 1,
    answer: "Recombinant influenza vaccine (Flublok) is produced without eggs entirely. Cell-based vaccines (Flucelvax) use mammalian cell culture. Even traditional egg-cultured vaccines contain minimal residual egg protein (<1 mcg/dose) — studies show these are safe for patients with egg allergy, including those with a history of hives. Only patients with severe anaphylaxis to eggs should receive egg-free alternatives.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-vax-18",
    type: "question",
    question: "What is the correct needle length for IM vaccination in an average-weight adult?",
    options: ["5/8 inch", "1 inch", "1 to 1.5 inches", "2 inches"],
    correctIndex: 2,
    answer: "For IM injection in average-weight adults, a 1 to 1.5 inch needle ensures proper intramuscular deposition in the deltoid. For obese patients, a 1.5 inch needle may be needed to reach muscle tissue. Needle too short deposits vaccine in subcutaneous tissue, potentially reducing immunogenicity and increasing local reactions. For infants, 5/8 to 1 inch is appropriate for the vastus lateralis.",
    category: "Infectious Disease",
    difficulty: 1
  },
  {
    id: "rn-vax-19",
    type: "question",
    question: "Why should blood products be separated from live vaccines by 3-11 months?",
    options: ["Blood products cause allergic reactions to vaccines", "Passive antibodies in blood products can neutralize live vaccine organisms before they replicate enough to generate an immune response", "Blood products and vaccines are chemically incompatible", "Regulatory requirements without clinical basis"],
    correctIndex: 1,
    answer: "Blood products (immune globulin, packed RBCs, plasma) contain passive antibodies that can neutralize live vaccine organisms (MMR, varicella) before they replicate sufficiently to stimulate the immune system. The deferral period (3-11 months depending on the product and dose) allows passive antibody levels to decline. Inactivated vaccines are NOT affected by blood products.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-vax-20",
    type: "question",
    question: "What is SIRVA (Shoulder Injury Related to Vaccine Administration) and how is it prevented?",
    options: ["A vaccine component allergy", "Persistent shoulder pain and limited range of motion from injecting too high on the deltoid, causing inadvertent injection into the subdeltoid bursa or rotator cuff structures", "A nerve injury from using too large a needle", "An infection at the injection site"],
    correctIndex: 1,
    answer: "SIRVA occurs when the vaccine is injected too high on the deltoid, entering the subdeltoid bursa, rotator cuff tendons, or joint capsule. This causes an inflammatory response with persistent shoulder pain, bursitis, and limited ROM lasting weeks to months. Prevention: identify the proper injection site (2-3 fingerbreadths below the acromion process) and use appropriate needle length.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-vax-21",
    type: "question",
    question: "Which vaccines are recommended during pregnancy?",
    options: ["MMR and varicella", "Tdap (27-36 weeks) and influenza (any trimester) — both inactivated and safe in pregnancy", "No vaccines should be given during pregnancy", "Only live vaccines are safe during pregnancy"],
    correctIndex: 1,
    answer: "Tdap (27-36 weeks for passive pertussis protection of the newborn) and inactivated influenza (any trimester — pregnant women are high-risk for influenza complications) are specifically recommended during pregnancy. COVID-19 vaccination is also recommended. Live vaccines (MMR, varicella, live influenza) are CONTRAINDICATED in pregnancy due to theoretical fetal risk.",
    category: "Infectious Disease",
    difficulty: 1
  },
  {
    id: "rn-vax-22",
    type: "question",
    question: "What type of immune response does a toxoid vaccine (tetanus, diphtheria) generate?",
    options: ["Cell-mediated immunity that directly kills bacteria", "Antitoxin antibodies that neutralize bacterial toxins, preventing disease even if bacteria are present", "Innate immune activation only", "Antibodies that prevent bacterial colonization"],
    correctIndex: 1,
    answer: "Toxoid vaccines contain inactivated bacterial toxins (toxoids). They stimulate production of antitoxin antibodies (IgG) that bind and neutralize the active toxin, preventing disease manifestations. The bacteria themselves may still colonize, but the toxin — which causes the clinical disease — is neutralized. This is why tetanus requires wound cleaning even in vaccinated individuals.",
    category: "Infectious Disease",
    difficulty: 2
  },
  {
    id: "rn-vax-23",
    type: "question",
    question: "What is the correct vaccine storage temperature for most refrigerated vaccines?",
    options: ["Room temperature (20-25°C)", "2-8°C (36-46°F) — standard refrigerator temperature", "Below 0°C (freezer temperature)", "Any cool, dark location"],
    correctIndex: 1,
    answer: "Most vaccines must be stored at 2-8°C (36-46°F). Temperature excursions above or below this range can damage vaccines: freezing can destroy adjuvant structure in inactivated vaccines, while excessive heat denatures proteins. Digital thermometers with min/max recording should be checked twice daily. Some vaccines (varicella, MMRV, certain COVID-19) require frozen storage.",
    category: "Infectious Disease",
    difficulty: 1
  },
  {
    id: "rn-vax-24",
    type: "question",
    question: "What documentation is required after administering a vaccine?",
    options: ["Only the vaccine name and date", "Vaccine name, manufacturer, lot number, expiration date, dose, route, site, date, administrator's name, and VIS date given — recorded in both the patient chart and immunization registry", "Only charting in the patient's personal health record", "Documentation is optional for adult vaccines"],
    correctIndex: 1,
    answer: "Complete vaccine documentation includes: vaccine name, manufacturer, lot number, expiration date, dose administered, route and site of injection, date and time, name and title of the person administering, VIS edition date and date provided, and any adverse reactions. This must be recorded in both the medical record and the appropriate immunization information system (registry).",
    category: "Infectious Disease",
    difficulty: 1
  },
  {
    id: "rn-vax-25",
    type: "question",
    question: "How do viral vector vaccines (J&J COVID-19) differ from mRNA vaccines?",
    options: ["Viral vector vaccines use live COVID-19 virus; mRNA does not", "Viral vector vaccines use a modified adenovirus to deliver genetic instructions for the target antigen; mRNA vaccines use lipid nanoparticle-encapsulated mRNA. Both instruct host cells to produce the antigen, but use different delivery systems", "They are identical in mechanism", "Viral vector vaccines provide passive immunity only"],
    correctIndex: 1,
    answer: "Viral vector vaccines use a modified, non-replicating adenovirus as a carrier to deliver DNA encoding the target antigen into host cells. The DNA is transcribed to mRNA, then translated to protein antigen. mRNA vaccines skip the DNA step, delivering mRNA directly. Both platforms result in host cells producing the target antigen and generating immune responses. Neither alters the host genome.",
    category: "Infectious Disease",
    difficulty: 2
  }
];
