import type { LessonContent } from "./types";

export const rnInfectiousDiseaseExpansionLessons: Record<string, LessonContent> = {
  "bacterial-cell-structure-rn": {
    title: "Bacterial Cell Structure",
    cellular: {
      title: "Gram-Positive vs Gram-Negative Cell Wall Architecture",
      content: "Bacterial cell structure is foundational to understanding antibiotic mechanisms and resistance. The cell envelope differs dramatically between gram-positive and gram-negative organisms, directly impacting treatment strategies.\n\nGram-positive bacteria possess a thick peptidoglycan layer (20-80 nm) composed of alternating N-acetylglucosamine (NAG) and N-acetylmuramic acid (NAM) residues cross-linked by short peptide bridges. This thick mesh provides structural rigidity but is porous to large molecules, making gram-positive organisms accessible to many antibiotics. Teichoic acids (wall teichoic acids and lipoteichoic acids) thread through the peptidoglycan and anchor to the cytoplasmic membrane, contributing to cell wall charge, cation homeostasis, and phage receptor function. Teichoic acids also serve as adhesins for host tissue colonization and stimulate inflammatory cytokine release.\n\nGram-negative bacteria have a thin peptidoglycan layer (1-3 nm) sandwiched between an inner (cytoplasmic) membrane and an outer membrane. The outer membrane is an asymmetric lipid bilayer: the inner leaflet contains phospholipids while the outer leaflet is composed primarily of lipopolysaccharide (LPS). LPS consists of three domains: Lipid A (the endotoxin component embedded in the outer membrane that triggers TLR4-mediated septic shock signaling via the NF-kB pathway), the core oligosaccharide, and the O-antigen polysaccharide (the outermost region providing serotype specificity). The outer membrane acts as a permeability barrier, restricting entry of hydrophobic antibiotics and large molecules. Porins (OmpC, OmpF in E. coli) are transmembrane channel proteins that allow selective diffusion of hydrophilic molecules including some antibiotics — porin mutations are a key resistance mechanism.\n\nThe periplasmic space between the inner and outer membranes in gram-negative bacteria contains degradative enzymes including beta-lactamases that hydrolyze beta-lactam antibiotics before they reach their penicillin-binding protein (PBP) targets on the inner membrane.\n\nVirulence factors extend beyond cell wall components. Capsules (polysaccharide layers) inhibit phagocytosis and complement deposition. Pili and fimbriae mediate adhesion to host epithelial surfaces. Type III and Type IV secretion systems inject effector proteins directly into host cells, subverting immune responses. Flagella provide motility for tissue invasion.\n\nBiofilm formation represents a critical virulence strategy. Bacteria attach to surfaces (medical devices, damaged tissue), produce an extracellular polymeric substance (EPS) matrix of polysaccharides, proteins, and extracellular DNA, and form structured communities. Biofilm bacteria are 100-1000 times more resistant to antibiotics than planktonic (free-floating) bacteria due to: reduced antibiotic penetration through the EPS matrix, metabolically dormant persister cells within the biofilm, horizontal gene transfer of resistance genes within the biofilm community, and altered microenvironment (pH, oxygen gradients) that inactivate some antibiotics.\n\nClinical relevance: Gram stain results (available within 1 hour) guide initial empiric antibiotic selection before culture results return. Gram-positive cocci in clusters suggest Staphylococcus; gram-positive cocci in chains suggest Streptococcus; gram-negative rods suggest Enterobacterales or Pseudomonas. Understanding cell wall structure explains why vancomycin (targets D-Ala-D-Ala in peptidoglycan) works against gram-positive but not gram-negative organisms (cannot penetrate outer membrane), and why polymyxins (disrupt outer membrane LPS) are reserved for resistant gram-negative infections."
    },
    riskFactors: [
      "Immunocompromised status (chemotherapy, HIV/AIDS, organ transplant, chronic corticosteroid use)",
      "Indwelling medical devices (central lines, urinary catheters, prosthetic joints, mechanical heart valves)",
      "Disrupted skin or mucosal barriers (surgical wounds, burns, pressure injuries, IV sites)",
      "Prolonged hospitalization with exposure to healthcare-associated organisms",
      "Extremes of age (neonates with immature immune systems, elderly with immunosenescence)",
      "Chronic diseases (diabetes mellitus, chronic kidney disease, liver cirrhosis, COPD)",
      "Malnutrition and protein-calorie deficiency impairing immune function",
      "Recent broad-spectrum antibiotic exposure selecting for resistant organisms"
    ],
    diagnostics: [
      "Obtain blood cultures (2 sets from 2 separate sites) before initiating antibiotics — Gram stain results guide empiric therapy within 1 hour",
      "Collect wound, sputum, or urine cultures using aseptic technique to avoid contamination",
      "Monitor culture and sensitivity reports: MIC (minimum inhibitory concentration) values determine antibiotic effectiveness",
      "Assess inflammatory markers: WBC with differential (left shift indicates acute bacterial infection), CRP, procalcitonin (elevated >0.5 ng/mL suggests bacterial etiology)",
      "Monitor lactate levels in suspected sepsis (>2 mmol/L indicates tissue hypoperfusion)",
      "Assess for biofilm-related infections in patients with medical devices: chronic low-grade fever, persistent positive cultures despite appropriate antibiotics",
      "Expect imaging studies (CT, ultrasound) to identify abscess formation requiring drainage"
    ],
    management: [
      "Initiate empiric antibiotics within 1 hour of sepsis recognition per Surviving Sepsis guidelines",
      "Select empiric therapy based on Gram stain and suspected source: gram-positive coverage (vancomycin for MRSA risk) vs gram-negative coverage (piperacillin-tazobactam, cefepime, or meropenem)",
      "De-escalate to narrow-spectrum antibiotics within 48-72 hours based on culture and sensitivity results",
      "Implement source control: drain abscesses, remove infected devices, debride necrotic tissue",
      "For biofilm-related device infections: device removal is often necessary as antibiotics alone cannot eradicate biofilm",
      "Administer combination therapy for Pseudomonas aeruginosa infections to prevent resistance emergence",
      "Monitor therapeutic drug levels for vancomycin (AUC/MIC 400-600), aminoglycosides (peak/trough), and adjust for renal function"
    ],
    nursingActions: [
      "Collect all cultures using strict aseptic technique BEFORE first antibiotic dose — this is critical for organism identification",
      "Administer antibiotics within prescribed timeframes: time-dependent antibiotics (beta-lactams) require consistent dosing intervals; concentration-dependent (aminoglycosides) require precise peak timing",
      "Monitor IV access sites for phlebitis, infiltration, and extravasation — particularly with vesicant antibiotics",
      "Implement appropriate isolation precautions based on organism: contact precautions for MRSA/VRE/ESBL, droplet for meningococcus, airborne for TB",
      "Assess for signs of sepsis progression: altered mental status, hypotension, tachycardia, oliguria, mottled skin",
      "Monitor for antibiotic adverse effects: nephrotoxicity (vancomycin, aminoglycosides), ototoxicity, C. difficile (new watery diarrhea), allergic reactions",
      "Perform meticulous catheter and wound care using aseptic technique to prevent biofilm formation on medical devices",
      "Educate patients on completing full antibiotic courses and hand hygiene"
    ],
    signs: {
      left: [
        "Gram-positive infections: localized abscess formation, cellulitis with well-defined borders, purulent drainage",
        "Staphylococcal: golden-yellow purulent drainage, abscess with central necrosis",
        "Streptococcal: rapid-spreading erythema, lymphangitic streaking, systemic toxicity",
        "Biofilm infection: chronic low-grade inflammation, recurrent positive cultures, device malfunction"
      ],
      right: [
        "Gram-negative infections: systemic sepsis risk, endotoxin-mediated shock (hypotension, fever, rigors)",
        "Pseudomonas: green-blue purulent drainage, fruity odor, ecthyma gangrenosum (necrotic skin lesions)",
        "E. coli/Klebsiella: UTI progressing to pyelonephritis or urosepsis, pneumonia in ventilated patients",
        "Endotoxin release: sudden hemodynamic collapse during antibiotic treatment of gram-negative bacteremia (Jarisch-Herxheimer-like reaction)"
      ]
    },
    medications: [
      { name: "Vancomycin", type: "Glycopeptide Antibiotic", action: "Binds D-Ala-D-Ala terminus of peptidoglycan precursors, blocking cell wall synthesis in gram-positive bacteria. Cannot penetrate gram-negative outer membrane", sideEffects: "Nephrotoxicity, ototoxicity, red man syndrome (histamine-mediated from rapid infusion), thrombocytopenia", contra: "No absolute contraindications; dose-adjust for renal impairment", pearl: "AUC-guided dosing (target 400-600 mg*hr/L) has replaced trough-based monitoring. Infuse over ≥1 hour. Red man syndrome is NOT an allergy — slow the infusion rate." },
      { name: "Piperacillin-Tazobactam", type: "Extended-spectrum penicillin + beta-lactamase inhibitor", action: "Piperacillin inhibits PBP-mediated peptidoglycan cross-linking; tazobactam inhibits class A beta-lactamases. Covers gram-positive, gram-negative, and anaerobes", sideEffects: "Hypersensitivity, seizures (high dose), leukopenia, C. difficile, hypokalemia", contra: "Severe penicillin allergy (anaphylaxis history)", pearl: "Extended infusion over 4 hours maximizes time above MIC. First-line empiric for many hospital-acquired infections. De-escalate within 48-72 hours." },
      { name: "Meropenem", type: "Carbapenem", action: "Binds PBPs with high affinity; resists most beta-lactamases except carbapenemases (KPC, NDM). Broadest gram-negative coverage", sideEffects: "Seizures (lower risk than imipenem), C. difficile, hypersensitivity", contra: "Anaphylaxis to carbapenems; caution with severe penicillin allergy (1% cross-reactivity)", pearl: "Reserve for ESBL-producing organisms and serious MDR gram-negative infections. Carbapenem-resistant organisms (CRE) are an emerging threat requiring ceftazidime-avibactam or polymyxins." }
    ],
    pearls: [
      "Gram stain is the most important rapid diagnostic — results in 1 hour guide empiric therapy: purple = gram-positive (thick peptidoglycan), pink = gram-negative (thin peptidoglycan + outer membrane)",
      "Endotoxin (Lipid A of LPS) from gram-negative bacteria triggers TLR4/NF-kB signaling cascade leading to septic shock — this is why gram-negative bacteremia carries higher mortality than gram-positive",
      "Biofilm on medical devices requires device removal in most cases — antibiotics penetrate biofilm poorly and cannot reach persister cells",
      "Understanding porin mutations explains why some gram-negative bacteria become resistant to carbapenems — the antibiotic cannot enter the cell through narrowed or absent porins",
      "NEVER delay antibiotics to wait for culture results in sepsis — collect cultures, then give antibiotics immediately"
    ],
    quiz: [
      { question: "Why is vancomycin ineffective against gram-negative bacteria?", options: ["Gram-negative bacteria lack peptidoglycan", "Vancomycin cannot penetrate the gram-negative outer membrane to reach its peptidoglycan target", "Gram-negative bacteria have efflux pumps that remove vancomycin", "Vancomycin is inactivated by gram-negative beta-lactamases"], correct: 1, rationale: "Vancomycin is a large glycopeptide molecule that cannot penetrate the outer membrane of gram-negative bacteria. Its target (the D-Ala-D-Ala terminus of peptidoglycan precursors) is inaccessible behind this barrier, even though gram-negative bacteria do have peptidoglycan." },
      { question: "A patient with a central line develops recurrent Staphylococcus epidermidis bacteremia despite appropriate vancomycin therapy. What is the most likely explanation?", options: ["Vancomycin resistance has developed", "Biofilm formation on the central line is protecting the bacteria from antibiotic penetration", "The patient is non-compliant with treatment", "The wrong organism was identified on culture"], correct: 1, rationale: "S. epidermidis is a prolific biofilm producer on medical devices. Biofilm-embedded bacteria are 100-1000x more resistant to antibiotics. Recurrent bacteremia despite appropriate therapy strongly suggests biofilm-related infection requiring line removal." },
      { question: "Which component of gram-negative bacteria is responsible for triggering septic shock?", options: ["Peptidoglycan", "Teichoic acid", "Lipid A component of lipopolysaccharide (LPS/endotoxin)", "Capsular polysaccharide"], correct: 2, rationale: "Lipid A is the endotoxin component of LPS. When released during bacterial lysis, it activates TLR4 receptors on macrophages, triggering massive cytokine release (TNF-alpha, IL-1, IL-6) leading to vasodilation, increased vascular permeability, and septic shock." }
    ]
  },

  "vaccine-mechanisms-rn": {
    title: "Vaccine Mechanisms",
    cellular: {
      title: "Immunological Basis of Vaccination",
      content: "Vaccines exploit the adaptive immune system's capacity for immunological memory to provide long-lasting protection against infectious diseases. Understanding vaccine mechanisms at the cellular level is essential for nursing education, administration safety, and patient counseling.\n\nActive immunity through vaccination begins with antigen presentation. When a vaccine antigen enters the body (via injection, oral, or intranasal route), it is captured by antigen-presenting cells (APCs) — primarily dendritic cells at the injection site. APCs process the antigen into peptide fragments and present them on MHC class II molecules to naive CD4+ T-helper cells in regional lymph nodes. This triggers the adaptive immune cascade.\n\nCD4+ T-helper cell activation is the central event. Th1 cells release IFN-gamma, activating macrophages and supporting cell-mediated immunity (critical for intracellular pathogens like TB and viruses). Th2 cells produce IL-4, IL-5, and IL-13, driving B-cell differentiation and antibody production (humoral immunity). The Th1/Th2 balance influenced by the vaccine formulation and adjuvant determines the immune response profile.\n\nB-cell activation requires two signals: antigen binding to the B-cell receptor (BCR) and co-stimulation from Th2 cells. Activated B-cells undergo clonal expansion and affinity maturation in germinal centers of lymph nodes. They differentiate into: (1) Plasma cells that produce large quantities of antigen-specific antibodies (IgM first, then class-switched to IgG, IgA, or IgE), and (2) Memory B-cells that persist for years to decades and mount a rapid, high-affinity secondary response upon re-exposure.\n\nCD8+ cytotoxic T-lymphocyte (CTL) activation occurs when vaccine antigens are presented on MHC class I molecules (achieved through cross-presentation or live/mRNA vaccine platforms). CTLs directly kill virus-infected cells by releasing perforin and granzymes. Memory CD8+ T-cells provide long-term cell-mediated protection.\n\nPassive immunity (maternal antibodies, immunoglobulin therapy) provides immediate but temporary protection through transfer of pre-formed antibodies. Maternal IgG crosses the placenta (especially in third trimester), protecting neonates for 3-6 months. Breast milk IgA protects mucosal surfaces. Passive immunity does not generate memory cells.\n\nVaccine platforms differ in how they deliver antigens:\n- Live attenuated vaccines (MMR, varicella, rotavirus): weakened organisms that replicate briefly, stimulating robust humoral and cell-mediated immunity. Contraindicated in immunocompromised patients and pregnancy.\n- Inactivated vaccines (hepatitis A, IPV, influenza injection): killed organisms that cannot replicate. Require multiple doses and adjuvants. Safe in immunocompromised patients.\n- Subunit/recombinant vaccines (hepatitis B, HPV, pertussis component of DTaP): purified protein antigens. Strong safety profile, require adjuvants.\n- Toxoid vaccines (tetanus, diphtheria): inactivated bacterial toxins. Stimulate antitoxin antibodies.\n- mRNA vaccines (COVID-19 Pfizer/Moderna): lipid nanoparticle-encapsulated mRNA encoding the target antigen. Host cells translate the mRNA into protein antigen, triggering immune response. mRNA is degraded within hours and never enters the nucleus or alters DNA.\n- Viral vector vaccines (COVID-19 J&J/AstraZeneca, Ebola): modified adenovirus carrying genetic instructions for the target antigen. The vector cannot replicate.\n- Conjugate vaccines (PCV13, Hib, meningococcal): polysaccharide antigens conjugated to carrier proteins to generate T-cell-dependent responses in children under 2 years.\n\nHerd immunity occurs when a sufficient proportion of the population is immune, reducing transmission to levels that protect unvaccinated individuals (those who cannot be vaccinated due to age, immunosuppression, or contraindications). Herd immunity thresholds vary by pathogen: measles requires 93-95% coverage (R0=12-18), polio requires 80-86%, and influenza requires 33-44%.\n\nAdjuvants (aluminum salts, AS04, MF59) are substances added to vaccines to enhance the immune response by activating innate immunity at the injection site, recruiting APCs, and promoting antigen depot formation."
    },
    riskFactors: [
      "Immunocompromised patients: live vaccines contraindicated (chemotherapy, high-dose corticosteroids ≥20mg prednisone/day for ≥14 days, HIV with CD4 <200)",
      "Pregnancy: live vaccines contraindicated (MMR, varicella, live influenza); inactivated vaccines are safe (Tdap recommended at 27-36 weeks, influenza at any trimester)",
      "Severe allergic reaction (anaphylaxis) to a previous dose of the same vaccine or vaccine component",
      "Egg allergy history: assess severity before administering egg-cultured vaccines (influenza, yellow fever); cell-based or recombinant alternatives available",
      "Age-specific considerations: rotavirus must be initiated before 15 weeks; live vaccines generally not given before 12 months due to maternal antibody interference",
      "Moderate or severe acute illness: defer vaccination until recovery (mild illness is NOT a contraindication)",
      "History of Guillain-Barre syndrome within 6 weeks of previous influenza vaccination",
      "Blood product administration: defer live vaccines (MMR, varicella) for 3-11 months depending on product type (antibodies in blood products neutralize live vaccine)"
    ],
    diagnostics: [
      "Review immunization records and assess vaccination status using CDC/NACI recommended schedules",
      "Assess immune status before live vaccine administration: CD4 count for HIV patients, absolute lymphocyte count for chemotherapy patients",
      "Screen for contraindications using standardized pre-vaccination screening questionnaires",
      "Monitor for immediate adverse reactions for 15-30 minutes post-vaccination (anaphylaxis risk highest in first 15 minutes)",
      "Assess titer levels (IgG) for healthcare workers to confirm immunity (hepatitis B surface antibody, varicella IgG, measles IgG, rubella IgG)",
      "Monitor temperature and injection site for expected local and systemic reactions in the 24-72 hours post-vaccination",
      "Report adverse events to VAERS (Vaccine Adverse Event Reporting System) or CAEFISS (Canadian equivalent)"
    ],
    management: [
      "Administer vaccines using proper technique: IM injection at 90-degree angle into vastus lateralis (infants <12 months) or deltoid (≥12 months and adults)",
      "Use proper needle length: 5/8 inch for neonates, 1 inch for infants, 1-1.5 inches for adults depending on body habitus",
      "Store vaccines according to manufacturer requirements: refrigerator (2-8°C) for most vaccines; freezer (-50 to -15°C) for varicella, MMRV, some COVID-19 vaccines",
      "Multiple vaccines may be administered simultaneously at different anatomic sites — this is safe and recommended to improve completion rates",
      "Live vaccines not given simultaneously must be separated by ≥28 days to prevent immune interference",
      "For patients with egg allergy: recombinant influenza vaccine (Flublok) or cell-based vaccine contains no egg protein",
      "Post-exposure prophylaxis protocols: hepatitis B (HBIG + vaccine within 24 hours), rabies (RIG + vaccine series), varicella (vaccine within 3-5 days of exposure)"
    ],
    nursingActions: [
      "Verify correct vaccine, dose, route, and patient identity using two identifiers before administration",
      "Screen for contraindications and precautions using standardized questionnaire at EVERY visit",
      "Ensure emergency equipment is available: epinephrine auto-injector (1:1000 concentration, 0.01 mg/kg IM for anaphylaxis), oxygen, suction",
      "Observe patients for 15 minutes post-vaccination (30 minutes if history of severe allergic reaction or receiving allergy immunotherapy)",
      "Administer epinephrine 0.01 mg/kg IM (max 0.5 mg adult) in the anterolateral thigh immediately for anaphylaxis — do NOT delay",
      "Document vaccine name, manufacturer, lot number, expiration date, dose, route, site, and administrator in the patient record and immunization registry",
      "Provide Vaccine Information Statements (VIS) before each vaccination as federally required",
      "Educate patients on expected side effects: injection site soreness, low-grade fever, myalgia — these indicate immune activation and typically resolve in 24-72 hours",
      "Counsel vaccine-hesitant patients using motivational interviewing: acknowledge concerns, provide evidence-based information, recommend vaccination without being dismissive"
    ],
    signs: {
      left: [
        "Expected local reactions (not complications): injection site pain, redness, swelling within 24-48 hours",
        "Expected systemic reactions: low-grade fever (37.5-38.5°C), myalgia, fatigue, headache for 1-3 days",
        "MMR: mild rash and fever 7-12 days post-vaccination (mini measles — not infectious, not a contraindication to future doses)",
        "Varicella vaccine: small vesicular rash 2-4 weeks post-vaccination (cover lesions if present)"
      ],
      right: [
        "Anaphylaxis (EMERGENCY): onset within minutes — urticaria, angioedema, bronchospasm, hypotension, tachycardia",
        "Vaccine-associated shoulder injury (SIRVA): persistent shoulder pain and limited ROM from injection too high in deltoid",
        "Febrile seizure: temperature-related seizure in children 6 months-5 years — benign, does NOT contraindicate future vaccination",
        "Intussusception risk with rotavirus vaccine: monitor for bloody stool, bilious vomiting, episodic crying in infants post-vaccination"
      ]
    },
    medications: [
      { name: "Epinephrine 1:1000 (1 mg/mL)", type: "Sympathomimetic (Emergency)", action: "Alpha-1 vasoconstriction reverses hypotension; beta-1 increases heart rate and contractility; beta-2 bronchodilation reverses bronchospasm", sideEffects: "Tachycardia, hypertension, tremor, anxiety, headache", contra: "No absolute contraindications in anaphylaxis — always administer", pearl: "FIRST-LINE for vaccine-induced anaphylaxis. Give 0.01 mg/kg IM (max 0.5 mg adult, 0.3 mg child) in the ANTEROLATERAL THIGH. May repeat every 5-15 minutes. Do NOT give IV epinephrine for anaphylaxis outside ICU setting." },
      { name: "Diphenhydramine", type: "H1 Antihistamine", action: "Blocks histamine H1 receptors reducing urticaria, pruritus, and angioedema", sideEffects: "Drowsiness, dry mouth, urinary retention", contra: "Not a substitute for epinephrine in anaphylaxis", pearl: "Adjunct therapy AFTER epinephrine for anaphylaxis. Treats urticaria and pruritus. Never delay epinephrine to give antihistamine — epinephrine is the only life-saving intervention." },
      { name: "Acetaminophen", type: "Antipyretic/Analgesic", action: "Inhibits central prostaglandin synthesis reducing fever and pain", sideEffects: "Hepatotoxicity in overdose", contra: "Severe hepatic impairment", pearl: "May be used for post-vaccination fever and injection site discomfort. Do NOT give prophylactically before vaccination — may blunt the immune response. Use only if symptoms develop." }
    ],
    pearls: [
      "Live vaccines are contraindicated in immunocompromised patients — the attenuated organism can cause disseminated infection (e.g., vaccine-strain varicella in chemotherapy patients)",
      "Herd immunity for measles requires 93-95% vaccination coverage — even small drops in coverage can trigger outbreaks in susceptible populations",
      "mRNA vaccines do NOT alter DNA — mRNA is translated in the cytoplasm, never enters the nucleus, and is degraded by normal cellular processes within hours",
      "Anaphylaxis is the ONLY true contraindication common to all vaccines — always have epinephrine immediately available",
      "Tdap at 27-36 weeks gestation is safe and recommended: maternal IgG antibodies cross the placenta, protecting the newborn during the vulnerable period before their own DTaP series begins",
      "Egg allergy is no longer a contraindication to most influenza vaccines — recombinant and cell-based options contain no egg protein"
    ],
    quiz: [
      { question: "A nurse is preparing to administer the MMR vaccine to a 4-year-old child. Which finding would contraindicate administration?", options: ["Runny nose and mild cough", "Currently receiving chemotherapy for leukemia", "History of mild rash after first MMR dose", "Low-grade fever of 37.8°C"], correct: 1, rationale: "MMR is a live attenuated vaccine contraindicated in immunocompromised patients. Chemotherapy causes immunosuppression, and live vaccine organisms could cause disseminated infection. Mild illness (runny nose, low-grade fever) is NOT a contraindication." },
      { question: "A patient develops urticaria, wheezing, and hypotension 5 minutes after receiving an influenza vaccine. What is the priority nursing action?", options: ["Administer diphenhydramine 50 mg IV", "Administer epinephrine 0.3 mg IM in the anterolateral thigh", "Elevate the head of bed and administer oxygen", "Call the provider and wait for orders"], correct: 1, rationale: "This is anaphylaxis — a medical emergency. Epinephrine IM is the FIRST-LINE treatment and must be administered immediately without waiting for provider orders. Antihistamines and oxygen are adjuncts given AFTER epinephrine. Delay in epinephrine administration increases mortality." },
      { question: "Which statement about herd immunity is accurate?", options: ["Herd immunity eliminates the need for vaccination entirely", "Herd immunity protects individuals who cannot be vaccinated when enough of the population is immune", "Herd immunity is only achieved through natural infection, not vaccination", "All diseases require the same percentage of immune individuals for herd immunity"], correct: 1, rationale: "Herd immunity occurs when sufficient population immunity reduces transmission to levels that indirectly protect unvaccinated individuals (immunocompromised, infants too young for vaccination). The threshold varies by pathogen: measles 93-95%, polio 80-86%." }
    ]
  }
};
