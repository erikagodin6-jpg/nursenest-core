import type { CareerQuestion } from "./rrt-questions";

export const mltQuestionsBatch4: CareerQuestion[] = [
  {
    id: "mlt-batch-101",
    stem: "A urine culture on MacConkey agar grows pink, mucoid colonies. The Gram stain shows gram-negative rods. The most likely organism is:",
    options: ["Proteus mirabilis", "Klebsiella pneumoniae", "Pseudomonas aeruginosa", "Staphylococcus saprophyticus"],
    correctIndex: 1,
    rationale: "Klebsiella pneumoniae is a lactose fermenter (pink on MacConkey) and produces mucoid colonies due to its large polysaccharide capsule. Proteus is a non-lactose fermenter and swarms on blood agar.",
    difficulty: 4,
    category: "Microbiology",
    topic: "gram-negative identification"
  },
  {
    id: "mlt-batch-102",
    stem: "Which organism is identified by a positive coagulase test?",
    options: ["Staphylococcus epidermidis", "Staphylococcus aureus", "Streptococcus pyogenes", "Enterococcus faecalis"],
    correctIndex: 1,
    rationale: "Staphylococcus aureus is the only clinically significant coagulase-positive staphylococcus. Coagulase converts fibrinogen to fibrin, forming clots. All other staphylococci are coagulase-negative.",
    difficulty: 5,
    category: "Microbiology",
    topic: "staphylococcal identification"
  },
  {
    id: "mlt-batch-103",
    stem: "A patient's blood type is determined to be group AB, Rh-positive. Which antibodies are present in this patient's serum?",
    options: ["Anti-A only", "Anti-B only", "Both anti-A and anti-B", "Neither anti-A nor anti-B"],
    correctIndex: 3,
    rationale: "Group AB individuals have both A and B antigens on their red cells and therefore produce neither anti-A nor anti-B antibodies. They are universal plasma recipients.",
    difficulty: 5,
    category: "Blood Bank",
    topic: "ABO blood group system"
  },
  {
    id: "mlt-batch-104",
    stem: "A stool culture grows non-lactose-fermenting colonies on MacConkey agar that are H2S-positive on TSI. The most likely pathogen is:",
    options: ["Escherichia coli O157:H7", "Salmonella enterica", "Shigella sonnei", "Vibrio cholerae"],
    correctIndex: 1,
    rationale: "Salmonella is a non-lactose fermenter that produces H2S on TSI (black butt). Shigella is also a non-lactose fermenter but is H2S-negative. E. coli ferments lactose.",
    difficulty: 4,
    category: "Microbiology",
    topic: "enteric pathogen identification"
  },
  {
    id: "mlt-batch-105",
    stem: "Which blood component must be ABO-identical when transfused?",
    options: ["Platelets", "Fresh frozen plasma", "Red blood cells", "Cryoprecipitate"],
    correctIndex: 2,
    rationale: "Red blood cells must be ABO-compatible (ideally identical) because ABO antibodies in the recipient can cause acute hemolytic transfusion reactions. Platelets and plasma have different compatibility rules.",
    difficulty: 5,
    category: "Blood Bank",
    topic: "component therapy"
  },
  {
    id: "mlt-batch-106",
    stem: "An organism grows on chocolate agar but not on blood agar in a CO2 environment. It is gram-negative coccobacilli, oxidase-positive. The most likely organism is:",
    options: ["Neisseria meningitidis", "Haemophilus influenzae", "Moraxella catarrhalis", "Bordetella pertussis"],
    correctIndex: 1,
    rationale: "Haemophilus influenzae requires factors X (hemin) and V (NAD), both present in chocolate agar (heated blood agar releases factor V). It will not grow on regular blood agar because factor V is trapped inside intact RBCs.",
    difficulty: 4,
    category: "Microbiology",
    topic: "fastidious gram-negative organisms"
  },
  {
    id: "mlt-batch-107",
    stem: "During antibody screening, a patient's serum reacts with all screening cells and the autocontrol is positive. This pattern is most consistent with:",
    options: ["An alloantibody to a high-frequency antigen", "A warm autoantibody", "A cold agglutinin", "Rouleaux formation"],
    correctIndex: 1,
    rationale: "A warm autoantibody reacts with all panel cells AND the autocontrol (patient's own cells) is positive. An antibody to a high-frequency antigen would react with all panel cells but the autocontrol would typically be negative.",
    difficulty: 3,
    category: "Blood Bank",
    topic: "antibody identification"
  },
  {
    id: "mlt-batch-108",
    stem: "Which selective medium is used specifically for the isolation of group A Streptococcus from throat cultures?",
    options: ["Chocolate agar", "MacConkey agar", "Blood agar with trimethoprim-sulfamethoxazole (SXT)", "Mannitol salt agar"],
    correctIndex: 2,
    rationale: "Blood agar with SXT is selective for group A Streptococcus (Streptococcus pyogenes) because SXT inhibits normal respiratory flora while GAS is inherently resistant. This enhances recovery from throat specimens.",
    difficulty: 4,
    category: "Microbiology",
    topic: "selective media"
  },
  {
    id: "mlt-batch-109",
    stem: "A crossmatch is incompatible at the AHG (indirect antiglobulin) phase. The most likely cause is:",
    options: ["ABO incompatibility", "Presence of an unexpected alloantibody in the patient's serum", "Bacterial contamination of the donor unit", "Cold agglutinin interference"],
    correctIndex: 1,
    rationale: "Incompatibility at the AHG phase indicates an IgG antibody coating the donor cells. This is typically an unexpected alloantibody (e.g., anti-K, anti-Fy^a) in the patient's serum. ABO incompatibility causes immediate spin incompatibility.",
    difficulty: 3,
    category: "Blood Bank",
    topic: "crossmatch procedures"
  },
  {
    id: "mlt-batch-110",
    stem: "A gram-positive cocci in chains is catalase-negative and beta-hemolytic on blood agar. Bacitracin sensitivity testing shows a zone of inhibition. The organism is most likely:",
    options: ["Streptococcus agalactiae (Group B)", "Streptococcus pyogenes (Group A)", "Enterococcus faecalis", "Streptococcus pneumoniae"],
    correctIndex: 1,
    rationale: "Streptococcus pyogenes (GAS) is bacitracin-sensitive (zone of inhibition ≥10 mm) and beta-hemolytic. Group B Strep is bacitracin-resistant. PYR test is also positive for GAS.",
    difficulty: 5,
    category: "Microbiology",
    topic: "streptococcal identification"
  },
  {
    id: "mlt-batch-111",
    stem: "A newborn has a positive DAT with anti-IgG and the mother is type O Rh-positive. The most likely cause of the positive DAT is:",
    options: ["Anti-D from Rh incompatibility", "ABO hemolytic disease of the fetus and newborn due to maternal anti-A or anti-B IgG", "Cold autoantibody", "Drug-induced antibody"],
    correctIndex: 1,
    rationale: "With an Rh-positive mother, anti-D HDFN is excluded. Type O mothers produce IgG anti-A and anti-B that can cross the placenta and coat fetal A or B red cells, causing ABO HDFN. This is the most common cause of HDFN overall.",
    difficulty: 4,
    category: "Blood Bank",
    topic: "hemolytic disease of newborn"
  },
  {
    id: "mlt-batch-112",
    stem: "An organism isolated from a wound culture produces a green pigment and a grape-like odor. It is oxidase-positive and grows at 42°C. The organism is:",
    options: ["Escherichia coli", "Pseudomonas aeruginosa", "Acinetobacter baumannii", "Serratia marcescens"],
    correctIndex: 1,
    rationale: "Pseudomonas aeruginosa produces pyocyanin (blue-green pigment), has a fruity grape-like odor, is oxidase-positive, and grows at 42°C. It is an important nosocomial pathogen, especially in burn and wound infections.",
    difficulty: 4,
    category: "Microbiology",
    topic: "non-fermenter identification"
  },
  {
    id: "mlt-batch-113",
    stem: "Which of the following is the most common cause of hemolytic disease of the fetus and newborn (HDFN)?",
    options: ["Anti-M", "Anti-D", "Anti-Lewis^a", "Anti-P1"],
    correctIndex: 1,
    rationale: "Anti-D (Rh) is the most clinically significant cause of HDFN. Anti-Lewis and anti-P1 are IgM antibodies that do not cross the placenta. Anti-M can occasionally cause HDFN but is much less common.",
    difficulty: 4,
    category: "Blood Bank",
    topic: "hemolytic disease of the newborn"
  },
  {
    id: "mlt-batch-114",
    stem: "A CSF Gram stain from a neonate shows gram-positive short rods. The organism grows on blood agar with a narrow zone of beta-hemolysis and is motile at 25°C but not at 37°C. The pathogen is:",
    options: ["Corynebacterium diphtheriae", "Listeria monocytogenes", "Bacillus cereus", "Erysipelothrix rhusiopathiae"],
    correctIndex: 1,
    rationale: "Listeria monocytogenes is a gram-positive rod that exhibits tumbling motility at 25°C (room temperature) but not at 37°C. It causes neonatal meningitis and is associated with contaminated dairy products.",
    difficulty: 3,
    category: "Microbiology",
    topic: "gram-positive rod identification"
  },
  {
    id: "mlt-batch-115",
    stem: "RhIG (RhD immune globulin) is indicated in which of the following situations?",
    options: ["An Rh-negative mother who delivers an Rh-negative baby", "An Rh-positive mother who delivers an Rh-negative baby", "An Rh-negative mother who delivers an Rh-positive baby", "An Rh-positive mother who delivers an Rh-positive baby"],
    correctIndex: 2,
    rationale: "RhIG is given to Rh-negative mothers who deliver Rh-positive babies to prevent formation of anti-D antibodies that could cause HDFN in future pregnancies. It works by destroying fetal Rh-positive cells before the mother mounts an immune response.",
    difficulty: 5,
    category: "Blood Bank",
    topic: "RhIG prophylaxis"
  },
  {
    id: "mlt-batch-116",
    stem: "Which organism is the most common cause of bacterial meningitis in adults aged 18-50 years?",
    options: ["Haemophilus influenzae", "Streptococcus pneumoniae", "Neisseria meningitidis", "Listeria monocytogenes"],
    correctIndex: 1,
    rationale: "Streptococcus pneumoniae is the most common cause of bacterial meningitis in adults. It appears as gram-positive lancet-shaped diplococci, is alpha-hemolytic, bile soluble, and optochin-sensitive.",
    difficulty: 3,
    category: "Microbiology",
    topic: "CSF pathogens"
  },
  {
    id: "mlt-batch-117",
    stem: "An antibody panel shows reactivity at the IAT phase with cells positive for the Fy^a antigen but not with Fy^a-negative cells. What antibody has been identified?",
    options: ["Anti-K", "Anti-Fy^a", "Anti-Jk^a", "Anti-S"],
    correctIndex: 1,
    rationale: "When serum reacts only with cells possessing the Fy^a antigen, the antibody is anti-Fy^a (Duffy system). Duffy antibodies are clinically significant IgG antibodies that can cause delayed hemolytic transfusion reactions and HDFN.",
    difficulty: 3,
    category: "Blood Bank",
    topic: "antibody identification"
  },
  {
    id: "mlt-batch-118",
    stem: "A sputum culture grows an organism that produces rust-colored (mucoid) colonies on blood agar with alpha-hemolysis. It is bile-soluble and optochin-sensitive. The organism is:",
    options: ["Streptococcus pyogenes", "Streptococcus pneumoniae", "Moraxella catarrhalis", "Klebsiella pneumoniae"],
    correctIndex: 1,
    rationale: "Streptococcus pneumoniae is alpha-hemolytic, bile-soluble (deoxycholate), and optochin-sensitive. These two tests differentiate it from other alpha-hemolytic streptococci (viridans group), which are optochin-resistant and bile-insoluble.",
    difficulty: 5,
    category: "Microbiology",
    topic: "streptococcal identification"
  },
  {
    id: "mlt-batch-119",
    stem: "A patient with type O blood needs an emergency transfusion but type O blood is unavailable. Which ABO type of packed red blood cells could be safely transfused?",
    options: ["Type A", "Type B", "Type AB", "None; only type O is compatible"],
    correctIndex: 3,
    rationale: "Type O recipients have both anti-A and anti-B antibodies and can only receive type O red blood cells. Transfusing any other ABO type would cause an acute hemolytic transfusion reaction.",
    difficulty: 5,
    category: "Blood Bank",
    topic: "ABO compatibility"
  },
  {
    id: "mlt-batch-120",
    stem: "Which biochemical test differentiates Staphylococcus aureus from Staphylococcus epidermidis?",
    options: ["Catalase test", "Gram stain morphology", "Coagulase test", "Oxidase test"],
    correctIndex: 2,
    rationale: "The coagulase test (tube or slide) differentiates S. aureus (coagulase-positive) from coagulase-negative staphylococci like S. epidermidis. Both are catalase-positive and appear as gram-positive cocci in clusters.",
    difficulty: 5,
    category: "Microbiology",
    topic: "staphylococcal identification"
  },
  {
    id: "mlt-batch-121",
    stem: "A massively transfused trauma patient develops oozing from venipuncture sites. Laboratory results show prolonged PT/aPTT, low fibrinogen, and thrombocytopenia. The most likely cause is:",
    options: ["Heparin contamination", "Dilutional coagulopathy", "Vitamin K deficiency", "Lupus anticoagulant"],
    correctIndex: 1,
    rationale: "Massive transfusion with packed RBCs dilutes platelets and coagulation factors, leading to dilutional coagulopathy. Treatment includes FFP, platelets, and cryoprecipitate (for fibrinogen replacement).",
    difficulty: 3,
    category: "Blood Bank",
    topic: "massive transfusion complications"
  },
  {
    id: "mlt-batch-122",
    stem: "A Gram stain of a vaginal swab from a pregnant woman shows gram-positive cocci in chains. The organism is CAMP test positive and hippurate hydrolysis positive. The organism is:",
    options: ["Streptococcus pyogenes (GAS)", "Streptococcus agalactiae (GBS)", "Enterococcus faecalis", "Streptococcus pneumoniae"],
    correctIndex: 1,
    rationale: "Streptococcus agalactiae (Group B Strep) is CAMP test positive and hippurate hydrolysis positive. GBS screening is performed on pregnant women at 35-37 weeks to prevent neonatal sepsis.",
    difficulty: 3,
    category: "Microbiology",
    topic: "streptococcal identification"
  },
  {
    id: "mlt-batch-123",
    stem: "The Kleihauer-Betke test is used to:",
    options: ["Detect ABO incompatibility", "Quantify fetal-maternal hemorrhage", "Identify irregular antibodies", "Determine Rh type of the fetus"],
    correctIndex: 1,
    rationale: "The Kleihauer-Betke acid elution test quantifies fetal red blood cells in maternal circulation. Fetal hemoglobin (HbF) is resistant to acid elution and stains pink, while adult HbA appears as ghost cells. Results determine the dose of RhIG needed.",
    difficulty: 3,
    category: "Blood Bank",
    topic: "fetal-maternal hemorrhage"
  },
  {
    id: "mlt-batch-124",
    stem: "Which organism causes rice-water stools and is identified by its darting motility on wet mount?",
    options: ["Campylobacter jejuni", "Vibrio cholerae", "Clostridium difficile", "Yersinia enterocolitica"],
    correctIndex: 1,
    rationale: "Vibrio cholerae causes profuse, watery rice-water stools. It demonstrates characteristic darting (shooting star) motility. It grows on TCBS (thiosulfate-citrate-bile salts-sucrose) agar as yellow colonies.",
    difficulty: 3,
    category: "Microbiology",
    topic: "enteric pathogen identification"
  },
  {
    id: "mlt-batch-125",
    stem: "Platelets should be stored at what temperature and with what type of agitation?",
    options: ["1-6°C without agitation", "20-24°C with continuous gentle agitation", "Frozen at -18°C or below", "-65°C or below"],
    correctIndex: 1,
    rationale: "Platelets are stored at 20-24°C (room temperature) with continuous gentle agitation to maintain viability and prevent aggregation. Shelf life is 5 days. Cold storage causes irreversible platelet shape change and rapid clearance.",
    difficulty: 3,
    category: "Blood Bank",
    topic: "component storage"
  },
  {
    id: "mlt-batch-126",
    stem: "A stool culture on Campy-BAP (blood agar with antibiotics) incubated at 42°C in a microaerophilic environment grows small, gray, flat colonies. Gram stain shows curved gram-negative rods. The organism is:",
    options: ["Helicobacter pylori", "Campylobacter jejuni", "Vibrio parahaemolyticus", "Arcobacter butzleri"],
    correctIndex: 1,
    rationale: "Campylobacter jejuni grows at 42°C (thermophilic) under microaerophilic conditions (5% O2, 10% CO2). It appears as curved or S-shaped (gull-wing) gram-negative rods and is a leading cause of bacterial gastroenteritis.",
    difficulty: 3,
    category: "Microbiology",
    topic: "curved gram-negative rods"
  },
  {
    id: "mlt-batch-127",
    stem: "Which of the following transfusion reactions presents with fever, flank pain, hemoglobinuria, and hypotension occurring within minutes of starting a transfusion?",
    options: ["Febrile non-hemolytic reaction", "Acute hemolytic transfusion reaction", "Allergic transfusion reaction", "Transfusion-related acute lung injury (TRALI)"],
    correctIndex: 1,
    rationale: "Acute hemolytic transfusion reactions (AHTR) are caused by ABO incompatibility, leading to intravascular hemolysis. Signs include fever, chills, flank/back pain, hemoglobinuria, DIC, and shock. It is the most dangerous type of transfusion reaction.",
    difficulty: 3,
    category: "Blood Bank",
    topic: "transfusion reactions"
  },
  {
    id: "mlt-batch-128",
    stem: "An acid-fast stain of a sputum specimen shows red (acid-fast) bacilli against a blue background. This finding is most consistent with:",
    options: ["Streptococcus pneumoniae", "Mycobacterium tuberculosis", "Nocardia asteroides", "Legionella pneumophila"],
    correctIndex: 1,
    rationale: "Mycobacterium tuberculosis is acid-fast due to mycolic acids in its cell wall. Acid-fast organisms retain carbolfuchsin (red) after acid-alcohol decolorization. The Ziehl-Neelsen and Kinyoun stains are used for AFB detection.",
    difficulty: 1,
    category: "Microbiology",
    topic: "acid-fast organisms"
  },
  {
    id: "mlt-batch-129",
    stem: "Fresh frozen plasma (FFP) must be transfused within what time period after thawing?",
    options: ["4 hours", "24 hours", "48 hours", "5 days"],
    correctIndex: 1,
    rationale: "Thawed FFP must be transfused within 24 hours if stored at 1-6°C. If relabeled as thawed plasma, it can be stored up to 5 days but with reduced levels of labile factors V and VIII. Once thawed, FFP should never be refrozen.",
    difficulty: 3,
    category: "Blood Bank",
    topic: "component storage"
  },
  {
    id: "mlt-batch-130",
    stem: "Which zone of inhibition interpretation indicates susceptibility in the Kirby-Bauer disk diffusion method?",
    options: ["No zone of inhibition", "Zone smaller than the breakpoint", "Zone equal to or greater than the susceptible breakpoint", "Zone within the intermediate range"],
    correctIndex: 2,
    rationale: "In the Kirby-Bauer method, susceptibility is determined by measuring the zone of inhibition and comparing it to CLSI breakpoints. A zone equal to or greater than the susceptible breakpoint indicates the organism is susceptible to that antibiotic.",
    difficulty: 3,
    category: "Microbiology",
    topic: "antimicrobial susceptibility testing"
  },
  {
    id: "mlt-batch-131",
    stem: "Cryoprecipitate is the primary source for which of the following coagulation factors?",
    options: ["Factor VII", "Factor VIII, fibrinogen, and von Willebrand factor", "Factor IX and Factor X", "Protein C and Protein S"],
    correctIndex: 1,
    rationale: "Cryoprecipitate contains concentrated fibrinogen (150-250 mg), Factor VIII (80-120 IU), von Willebrand factor, Factor XIII, and fibronectin. It is indicated for hypofibrinogenemia, DIC, and von Willebrand disease when specific concentrates are unavailable.",
    difficulty: 3,
    category: "Blood Bank",
    topic: "component therapy"
  },
  {
    id: "mlt-batch-132",
    stem: "An organism produces a double zone of beta-hemolysis on blood agar and is identified as a large gram-positive rod with a positive Nagler reaction. The organism is:",
    options: ["Bacillus anthracis", "Clostridium perfringens", "Clostridium tetani", "Bacillus cereus"],
    correctIndex: 1,
    rationale: "Clostridium perfringens produces a double zone of beta-hemolysis (inner zone from theta toxin, outer zone from alpha toxin/lecithinase). The Nagler reaction detects lecithinase (alpha toxin) production. It causes gas gangrene and food poisoning.",
    difficulty: 3,
    category: "Microbiology",
    topic: "anaerobic identification"
  },
  {
    id: "mlt-batch-133",
    stem: "A patient has a positive antibody screen. The antibody reacts with enzyme-treated cells but not with untreated cells. Which antibody is most likely?",
    options: ["Anti-Fy^a", "Anti-Rh (anti-D, anti-E, anti-c)", "Anti-M", "Anti-S"],
    correctIndex: 1,
    rationale: "Rh antibodies show enhanced reactivity with enzyme-treated (ficin/papain) cells. Enzymes destroy Duffy (Fy^a, Fy^b), MNS (M, N, S, s), and some other antigens while enhancing Rh, Kidd, Lewis, and P1 reactivity.",
    difficulty: 4,
    category: "Blood Bank",
    topic: "enzyme treatment effects"
  },
  {
    id: "mlt-batch-134",
    stem: "Which agar is used for the primary isolation of Neisseria gonorrhoeae from genital specimens?",
    options: ["Blood agar", "MacConkey agar", "Modified Thayer-Martin agar", "Sabouraud dextrose agar"],
    correctIndex: 2,
    rationale: "Modified Thayer-Martin agar is a selective chocolate agar containing vancomycin (inhibits gram-positives), colistin (inhibits gram-negatives), nystatin (inhibits fungi), and trimethoprim. This selects for pathogenic Neisseria from mixed flora sites.",
    difficulty: 3,
    category: "Microbiology",
    topic: "selective media"
  },
  {
    id: "mlt-batch-135",
    stem: "Irradiation of blood products is performed to prevent which complication?",
    options: ["Bacterial contamination", "Transfusion-associated graft-versus-host disease (TA-GVHD)", "Febrile non-hemolytic reactions", "Allergic reactions"],
    correctIndex: 1,
    rationale: "Irradiation (25 Gy minimum) inactivates donor T-lymphocytes to prevent TA-GVHD, a fatal complication where donor lymphocytes attack immunocompromised recipient tissues. Indicated for immunocompromised patients, directed donations from blood relatives, and HLA-matched products.",
    difficulty: 3,
    category: "Blood Bank",
    topic: "blood product modifications"
  },
  {
    id: "mlt-batch-136",
    stem: "A rapid urease test is positive within 2 hours from a gastric biopsy specimen. The most likely organism is:",
    options: ["Proteus mirabilis", "Helicobacter pylori", "Klebsiella pneumoniae", "Morganella morganii"],
    correctIndex: 1,
    rationale: "Helicobacter pylori produces large amounts of urease, which converts urea to ammonia and CO2, allowing it to survive in the acidic gastric environment. The rapid urease test (CLOtest) is commonly used for diagnosis from biopsy specimens.",
    difficulty: 3,
    category: "Microbiology",
    topic: "urease-positive organisms"
  },
  {
    id: "mlt-batch-137",
    stem: "Which of the following is true regarding the Rh blood group system?",
    options: ["Rh antibodies are naturally occurring", "The D antigen is the most immunogenic Rh antigen", "Rh antigens are carbohydrate in nature", "Rh antibodies are predominantly IgM"],
    correctIndex: 1,
    rationale: "The D antigen is the most immunogenic antigen after A and B. Rh antibodies are immune-stimulated (not naturally occurring), predominantly IgG, and react at 37°C/AHG phase. Rh antigens are protein (not carbohydrate) in nature.",
    difficulty: 3,
    category: "Blood Bank",
    topic: "Rh blood group system"
  },
  {
    id: "mlt-batch-138",
    stem: "A fungal culture from a skin scraping grows within 5-7 days, producing a white cottony colony that turns red on the reverse. Microscopy shows tear-shaped microconidia. The organism is:",
    options: ["Microsporum canis", "Trichophyton rubrum", "Epidermophyton floccosum", "Aspergillus fumigatus"],
    correctIndex: 1,
    rationale: "Trichophyton rubrum is the most common dermatophyte causing tinea infections. It produces a characteristic red pigment on the reverse of the colony (wine-red) and tear-shaped (pyriform) microconidia along the hyphae.",
    difficulty: 3,
    category: "Microbiology",
    topic: "mycology"
  },
  {
    id: "mlt-batch-139",
    stem: "A patient types as group A on forward typing but group O on reverse typing. This ABO discrepancy is most likely due to:",
    options: ["Subgroup of A (A2) with anti-A1 in serum", "Technical error in forward typing", "Cold autoantibody interference", "Bombay phenotype"],
    correctIndex: 0,
    rationale: "A2 subgroup patients may have weak A antigen expression. Their serum may contain anti-A1, which does not react with A2 cells but reacts with A1 cells. Forward typing shows A, but reverse typing may show extra reactivity. This is a common ABO discrepancy.",
    difficulty: 4,
    category: "Blood Bank",
    topic: "ABO discrepancies"
  },
  {
    id: "mlt-batch-140",
    stem: "Which organism is the most common cause of hospital-acquired (nosocomial) urinary tract infections?",
    options: ["Staphylococcus aureus", "Escherichia coli", "Pseudomonas aeruginosa", "Enterococcus faecalis"],
    correctIndex: 1,
    rationale: "Escherichia coli is the most common cause of both community-acquired and nosocomial UTIs. It is a lactose-fermenting gram-negative rod that produces pink colonies on MacConkey agar and is indole-positive.",
    difficulty: 1,
    category: "Microbiology",
    topic: "urinary pathogens"
  },
  {
    id: "mlt-batch-141",
    stem: "Leukocyte-reduced (leukoreduced) blood products are indicated to prevent all of the following EXCEPT:",
    options: ["Febrile non-hemolytic transfusion reactions", "CMV transmission", "HLA alloimmunization", "Acute hemolytic transfusion reactions"],
    correctIndex: 3,
    rationale: "Leukoreduction prevents febrile non-hemolytic reactions (caused by cytokines from donor WBCs), CMV transmission (CMV resides in WBCs), and HLA alloimmunization. It does NOT prevent ABO-mediated acute hemolytic reactions, which are caused by RBC antigen-antibody incompatibility.",
    difficulty: 3,
    category: "Blood Bank",
    topic: "blood product modifications"
  },
  {
    id: "mlt-batch-142",
    stem: "A blood culture grows gram-positive cocci in clusters that are catalase-positive and coagulase-negative. The organism is novobiocin-resistant. The most likely organism is:",
    options: ["Staphylococcus epidermidis", "Staphylococcus saprophyticus", "Staphylococcus lugdunensis", "Micrococcus luteus"],
    correctIndex: 1,
    rationale: "Staphylococcus saprophyticus is coagulase-negative and novobiocin-resistant, differentiating it from S. epidermidis (novobiocin-sensitive). S. saprophyticus is a common cause of UTIs in young sexually active women.",
    difficulty: 3,
    category: "Microbiology",
    topic: "staphylococcal identification"
  },
  {
    id: "mlt-batch-143",
    stem: "Which immunoglobulin class is associated with ABO antibodies?",
    options: ["IgG only", "IgM only", "IgA only", "Predominantly IgM with some IgG"],
    correctIndex: 3,
    rationale: "ABO antibodies are predominantly IgM (naturally occurring), which cause immediate agglutination at room temperature. However, some individuals (especially group O) also produce IgG anti-A,B that can cross the placenta and cause ABO-HDFN.",
    difficulty: 3,
    category: "Blood Bank",
    topic: "ABO immunology"
  },
  {
    id: "mlt-batch-144",
    stem: "An organism is isolated from a blood culture that grows as yeast on Sabouraud dextrose agar, forms germ tubes in serum at 37°C, and produces chlamydospores on cornmeal agar. The organism is:",
    options: ["Candida glabrata", "Candida albicans", "Cryptococcus neoformans", "Candida tropicalis"],
    correctIndex: 1,
    rationale: "Candida albicans is uniquely identified by positive germ tube test (within 2-3 hours in serum at 37°C) and chlamydospore production on cornmeal agar with Tween 80. These two tests are definitive for C. albicans identification.",
    difficulty: 2,
    category: "Microbiology",
    topic: "mycology"
  },
  {
    id: "mlt-batch-145",
    stem: "A newborn's DAT is positive. The eluate from the baby's red cells contains anti-D. The mother is most likely:",
    options: ["Group O, Rh-positive", "Group A, Rh-positive", "Group O, Rh-negative with anti-D", "Group AB, Rh-positive"],
    correctIndex: 2,
    rationale: "If the eluate shows anti-D, the mother must be Rh-negative and has formed anti-D (IgG) that crossed the placenta and coated the baby's Rh-positive red cells. This is classic Rh-HDFN.",
    difficulty: 3,
    category: "Blood Bank",
    topic: "hemolytic disease of the newborn"
  },
  {
    id: "mlt-batch-146",
    stem: "India ink preparation of CSF shows encapsulated yeast cells with a wide clear halo. The most likely organism is:",
    options: ["Candida albicans", "Cryptococcus neoformans", "Histoplasma capsulatum", "Blastomyces dermatitidis"],
    correctIndex: 1,
    rationale: "Cryptococcus neoformans has a large polysaccharide capsule visible as a clear halo on India ink staining. Cryptococcal antigen (CrAg) latex agglutination test is more sensitive. It commonly causes meningitis in immunocompromised patients.",
    difficulty: 2,
    category: "Microbiology",
    topic: "mycology"
  },
  {
    id: "mlt-batch-147",
    stem: "A type and screen reveals an antibody that shows dosage effect (reacts stronger with homozygous cells). Which antibody system is most commonly associated with dosage?",
    options: ["ABO", "Rh", "Kidd", "Lewis"],
    correctIndex: 2,
    rationale: "Kidd antibodies (anti-Jk^a, anti-Jk^b) classically show dosage—reacting more strongly with homozygous (Jk^a/Jk^a) cells than heterozygous (Jk^a/Jk^b) cells. Rh, Duffy, and MNS also show dosage, but Kidd is the classic example on exams.",
    difficulty: 4,
    category: "Blood Bank",
    topic: "antibody characteristics"
  },
  {
    id: "mlt-batch-148",
    stem: "Chocolate agar is prepared by heating blood agar to release which growth factors?",
    options: ["Factor X (hemin) only", "Factor V (NAD) only", "Both Factor X (hemin) and Factor V (NAD)", "Neither Factor X nor Factor V"],
    correctIndex: 2,
    rationale: "Heating blood agar to 80°C lyses RBCs, releasing intracellular Factor V (NAD) and making Factor X (hemin) more available. This is essential for growing Haemophilus influenzae, which requires both factors.",
    difficulty: 1,
    category: "Microbiology",
    topic: "culture media"
  },
  {
    id: "mlt-batch-149",
    stem: "Which of the following antibodies is capable of fixing complement and causing intravascular hemolysis?",
    options: ["Anti-Fy^a", "Anti-Jk^a", "Anti-M", "Anti-Le^a"],
    correctIndex: 1,
    rationale: "Kidd antibodies (anti-Jk^a, anti-Jk^b) are notorious for complement activation and can cause both acute and delayed hemolytic transfusion reactions with intravascular hemolysis. They are also known for showing dosage and evanescent behavior (disappearing over time).",
    difficulty: 4,
    category: "Blood Bank",
    topic: "Kidd blood group system"
  },
  {
    id: "mlt-batch-150",
    stem: "A beta-hemolytic organism on blood agar is PYR (pyrrolidonyl arylamidase) positive. This finding identifies the organism as either:",
    options: ["Staphylococcus aureus or Streptococcus pneumoniae", "Streptococcus pyogenes (Group A) or Enterococcus spp.", "Streptococcus agalactiae (Group B) or Staphylococcus epidermidis", "Listeria monocytogenes or Bacillus cereus"],
    correctIndex: 1,
    rationale: "PYR test is positive for Group A Streptococcus (S. pyogenes) and Enterococcus species. This differentiates GAS from other beta-hemolytic streptococci and helps identify enterococci from other catalase-negative gram-positive cocci.",
    difficulty: 2,
    category: "Microbiology",
    topic: "rapid identification tests"
  },
  {
    id: "mlt-batch-151",
    stem: "The antibody screening test (indirect antiglobulin test) is performed at which phase?",
    options: ["Immediate spin only", "37°C and AHG (antihuman globulin) phase", "Room temperature only", "4°C cold incubation"],
    correctIndex: 1,
    rationale: "The antibody screen is performed at 37°C (to detect clinically significant IgG antibodies) followed by the AHG phase (addition of antihuman globulin to detect IgG coating the screening cells). Immediate spin detects only IgM antibodies.",
    difficulty: 2,
    category: "Blood Bank",
    topic: "antibody screening"
  },
  {
    id: "mlt-batch-152",
    stem: "Which organism is MOST commonly associated with pseudomembranous colitis following antibiotic therapy?",
    options: ["Clostridium perfringens", "Clostridioides difficile", "Bacteroides fragilis", "Fusobacterium nucleatum"],
    correctIndex: 1,
    rationale: "Clostridioides (Clostridium) difficile produces toxins A (enterotoxin) and B (cytotoxin) that cause pseudomembranous colitis. It occurs after disruption of normal gut flora by antibiotics, especially clindamycin, fluoroquinolones, and broad-spectrum cephalosporins.",
    difficulty: 1,
    category: "Microbiology",
    topic: "anaerobic pathogens"
  },
  {
    id: "mlt-batch-153",
    stem: "The immediate spin crossmatch detects which type of incompatibility?",
    options: ["ABO incompatibility", "Rh incompatibility", "Kidd antibody incompatibility", "Duffy antibody incompatibility"],
    correctIndex: 0,
    rationale: "The immediate spin (IS) crossmatch detects ABO incompatibility because ABO antibodies are IgM and agglutinate at room temperature. IgG antibodies (anti-Rh, anti-Kell, anti-Kidd, anti-Duffy) require the AHG phase for detection.",
    difficulty: 2,
    category: "Blood Bank",
    topic: "crossmatch procedures"
  },
  {
    id: "mlt-batch-154",
    stem: "An organism isolated from a skin lesion grows as a mold at 25°C and as yeast at 37°C. This thermal dimorphism is characteristic of:",
    options: ["Aspergillus fumigatus", "Candida albicans", "Histoplasma capsulatum", "Mucor species"],
    correctIndex: 2,
    rationale: "Histoplasma capsulatum is a dimorphic fungus: mold at 25°C (tuberculate macroconidia) and yeast at 37°C (small intracellular yeast within macrophages). Other dimorphic fungi include Blastomyces, Coccidioides, Sporothrix, and Talaromyces.",
    difficulty: 3,
    category: "Microbiology",
    topic: "dimorphic fungi"
  },
  {
    id: "mlt-batch-155",
    stem: "Washed red blood cells are indicated for patients with:",
    options: ["Iron deficiency anemia", "IgA deficiency with anti-IgA antibodies", "Thrombocytopenia", "Factor VIII deficiency"],
    correctIndex: 1,
    rationale: "Washed RBCs remove plasma proteins including IgA. Patients with IgA deficiency who have formed anti-IgA antibodies can experience severe anaphylactic transfusion reactions from plasma-containing products. Washing removes >99% of plasma.",
    difficulty: 3,
    category: "Blood Bank",
    topic: "blood product modifications"
  },
  {
    id: "mlt-batch-156",
    stem: "MRSA (methicillin-resistant Staphylococcus aureus) resistance is mediated by which mechanism?",
    options: ["Beta-lactamase production", "Altered penicillin-binding protein (PBP2a) encoded by mecA gene", "Efflux pump mechanism", "Enzymatic inactivation of the antibiotic"],
    correctIndex: 1,
    rationale: "MRSA resistance is mediated by the mecA gene, which encodes an altered penicillin-binding protein (PBP2a) with low affinity for all beta-lactam antibiotics. This confers resistance to all penicillins, cephalosporins, and carbapenems.",
    difficulty: 3,
    category: "Microbiology",
    topic: "antimicrobial resistance"
  },
  {
    id: "mlt-batch-157",
    stem: "A delayed hemolytic transfusion reaction typically occurs how many days after transfusion?",
    options: ["Within 1 hour", "1-2 days", "3-14 days", "30-60 days"],
    correctIndex: 2,
    rationale: "Delayed hemolytic transfusion reactions (DHTR) occur 3-14 days post-transfusion due to an anamnestic (secondary) immune response. The antibody titer was too low to detect at time of crossmatch but rises after re-exposure to the antigen. Kidd antibodies are the most common cause.",
    difficulty: 3,
    category: "Blood Bank",
    topic: "transfusion reactions"
  },
  {
    id: "mlt-batch-158",
    stem: "Lowenstein-Jensen (LJ) medium is used for the isolation of which organism?",
    options: ["Legionella pneumophila", "Mycobacterium tuberculosis", "Bordetella pertussis", "Francisella tularensis"],
    correctIndex: 1,
    rationale: "Lowenstein-Jensen medium is an egg-based medium used for primary isolation of mycobacteria. M. tuberculosis grows slowly (2-6 weeks) producing rough, buff-colored colonies described as having a cauliflower-like appearance.",
    difficulty: 1,
    category: "Microbiology",
    topic: "mycobacteriology"
  },
  {
    id: "mlt-batch-159",
    stem: "In the Gel column technology (gel test) for blood bank testing, a positive result is indicated by:",
    options: ["Red cells settling to the bottom of the gel column", "Red cells trapped at the top of or within the gel column", "Clear supernatant above the gel", "Hemolysis in the reaction chamber"],
    correctIndex: 1,
    rationale: "In gel technology, agglutinated RBCs are too large to pass through the gel matrix and are trapped at the top or distributed throughout the column (positive). Non-agglutinated cells pass through to the bottom (negative).",
    difficulty: 3,
    category: "Blood Bank",
    topic: "serologic techniques"
  },
  {
    id: "mlt-batch-160",
    stem: "An organism produces a green metallic sheen on EMB (eosin methylene blue) agar. This is characteristic of:",
    options: ["Klebsiella pneumoniae", "Escherichia coli", "Proteus mirabilis", "Pseudomonas aeruginosa"],
    correctIndex: 1,
    rationale: "Escherichia coli produces a characteristic green metallic sheen on EMB agar due to strong acid production from vigorous lactose fermentation. Other lactose fermenters like Klebsiella produce mucoid pink-purple colonies without the metallic sheen.",
    difficulty: 1,
    category: "Microbiology",
    topic: "differential media"
  },
  {
    id: "mlt-batch-161",
    stem: "The Bombay (Oh) phenotype is characterized by:",
    options: ["Absence of A and B antigens with normal H antigen", "Absence of A, B, and H antigens with anti-A, anti-B, and anti-H in serum", "Presence of all blood group antigens", "Excess H antigen on red blood cells"],
    correctIndex: 1,
    rationale: "Bombay phenotype individuals lack the H gene (FUT1), so they cannot produce H antigen (the precursor for A and B antigens). They type as group O but also have anti-H in their serum, making them incompatible with all ABO types. They can only receive Bombay blood.",
    difficulty: 5,
    category: "Blood Bank",
    topic: "rare blood types"
  },
  {
    id: "mlt-batch-162",
    stem: "Which mechanism of antibiotic resistance involves the production of enzymes that break the beta-lactam ring?",
    options: ["Altered target site", "Beta-lactamase production", "Decreased permeability", "Active efflux"],
    correctIndex: 1,
    rationale: "Beta-lactamases are enzymes that hydrolyze the beta-lactam ring, inactivating penicillins, cephalosporins, and other beta-lactam antibiotics. Extended-spectrum beta-lactamases (ESBLs) can hydrolyze third-generation cephalosporins.",
    difficulty: 1,
    category: "Microbiology",
    topic: "antimicrobial resistance"
  },
  {
    id: "mlt-batch-163",
    stem: "TRALI (transfusion-related acute lung injury) is characterized by:",
    options: ["Gradual onset of fluid overload over 24 hours", "Acute respiratory distress within 6 hours of transfusion with bilateral pulmonary infiltrates", "Hemoglobinuria and renal failure", "Urticaria and bronchospasm"],
    correctIndex: 1,
    rationale: "TRALI presents with acute onset (within 6 hours) of non-cardiogenic pulmonary edema with bilateral infiltrates on chest X-ray, hypoxemia, and no evidence of circulatory overload. It is often caused by donor antibodies against recipient HLA or neutrophil antigens.",
    difficulty: 4,
    category: "Blood Bank",
    topic: "transfusion reactions"
  },
  {
    id: "mlt-batch-164",
    stem: "Which test is used to differentiate Neisseria meningitidis from Neisseria gonorrhoeae?",
    options: ["Oxidase test", "Gram stain", "Carbohydrate utilization test", "Catalase test"],
    correctIndex: 2,
    rationale: "Both Neisseria species are oxidase-positive, gram-negative diplococci. Carbohydrate utilization differentiates them: N. meningitidis utilizes glucose and maltose, while N. gonorrhoeae utilizes only glucose.",
    difficulty: 2,
    category: "Microbiology",
    topic: "Neisseria identification"
  },
  {
    id: "mlt-batch-165",
    stem: "An elution is performed on a patient's red cells with a positive DAT. The primary purpose of the elution is to:",
    options: ["Identify the antigen on the red cells", "Remove and identify the antibody coating the red cells", "Determine the patient's ABO type", "Test for complement activation"],
    correctIndex: 1,
    rationale: "Elution strips antibodies from the red cell surface so they can be tested against a panel of reagent cells for identification. This is essential in workup of positive DATs, HDFN, and hemolytic transfusion reactions.",
    difficulty: 3,
    category: "Blood Bank",
    topic: "elution techniques"
  },
  {
    id: "mlt-batch-166",
    stem: "A throat culture grows gray-black colonies with dark brown/black halos on cystine-tellurite agar. The Gram stain shows gram-positive rods arranged in V and L formations (Chinese letter pattern). The organism is:",
    options: ["Corynebacterium diphtheriae", "Bacillus anthracis", "Listeria monocytogenes", "Actinomyces israelii"],
    correctIndex: 0,
    rationale: "Corynebacterium diphtheriae grows as gray-black colonies on cystine-tellurite agar and shows Chinese letter (palisade) arrangement. Confirmation requires demonstration of diphtheria toxin production by the Elek test.",
    difficulty: 3,
    category: "Microbiology",
    topic: "gram-positive rod identification"
  },
  {
    id: "mlt-batch-167",
    stem: "The maximum storage time for packed red blood cells preserved in CPDA-1 is:",
    options: ["21 days at 1-6°C", "35 days at 1-6°C", "42 days at 1-6°C", "5 days at 20-24°C"],
    correctIndex: 1,
    rationale: "CPDA-1 (citrate-phosphate-dextrose-adenine) preserves RBCs for 35 days at 1-6°C. Additive solutions (AS-1, AS-3, AS-5) extend storage to 42 days. ACD and CPD allow 21 days of storage.",
    difficulty: 2,
    category: "Blood Bank",
    topic: "component storage"
  },
  {
    id: "mlt-batch-168",
    stem: "The string test (positive when mucoid string >5 mm forms) is characteristic of which gram-negative organism?",
    options: ["Escherichia coli", "Klebsiella pneumoniae", "Proteus mirabilis", "Salmonella typhi"],
    correctIndex: 1,
    rationale: "The string test (hypermucoviscosity phenotype) is positive when a colony can be stretched into a string >5 mm using an inoculating loop. This is characteristic of hypervirulent Klebsiella pneumoniae (hvKp), associated with liver abscess and invasive infections.",
    difficulty: 4,
    category: "Microbiology",
    topic: "gram-negative identification"
  },
  {
    id: "mlt-batch-169",
    stem: "Which antibody characteristically demonstrates in vitro hemolysis in the test tube rather than agglutination?",
    options: ["Anti-D", "Anti-K", "Anti-Le^a", "Anti-Fy^a"],
    correctIndex: 2,
    rationale: "Lewis antibodies (anti-Le^a, anti-Le^b) are IgM antibodies that can activate complement, sometimes causing in vitro hemolysis rather than visible agglutination. Lewis antibodies are generally clinically insignificant and do not cause HDFN.",
    difficulty: 4,
    category: "Blood Bank",
    topic: "Lewis blood group system"
  },
  {
    id: "mlt-batch-170",
    stem: "Bordetella pertussis is best isolated on which culture medium?",
    options: ["MacConkey agar", "Regan-Lowe or Bordet-Gengou agar", "Chocolate agar", "Sabouraud dextrose agar"],
    correctIndex: 1,
    rationale: "Bordetella pertussis grows best on Bordet-Gengou (potato-glycerol-blood agar) or Regan-Lowe (charcoal-blood agar with cephalexin) media. Charcoal and blood absorb fatty acids and other inhibitory substances. PCR has largely replaced culture for diagnosis.",
    difficulty: 2,
    category: "Microbiology",
    topic: "fastidious organism culture"
  },
  {
    id: "mlt-batch-171",
    stem: "A patient's antibody panel shows reactivity at IAT with all Jk(a+) cells but not with Jk(a-) cells. This antibody is clinically significant because:",
    options: ["It only reacts at cold temperatures", "It can cause delayed hemolytic transfusion reactions and shows evanescent behavior", "It is always IgM and does not cross the placenta", "It only reacts with enzyme-treated cells"],
    correctIndex: 1,
    rationale: "Anti-Jk^a (Kidd) antibodies are notorious for causing delayed hemolytic transfusion reactions. They show evanescent behavior (titers drop below detectable levels), dosage, and complement activation. They are a leading cause of DHTR.",
    difficulty: 4,
    category: "Blood Bank",
    topic: "Kidd blood group system"
  },
  {
    id: "mlt-batch-172",
    stem: "Vancomycin-resistant enterococci (VRE) are most commonly which species?",
    options: ["Enterococcus faecalis", "Enterococcus faecium", "Enterococcus gallinarum", "Enterococcus casseliflavus"],
    correctIndex: 1,
    rationale: "Enterococcus faecium is the most common species associated with clinically significant vancomycin resistance (VanA and VanB phenotypes). E. faecalis is more common overall but less frequently vancomycin-resistant. E. gallinarum and E. casseliflavus have intrinsic low-level resistance (VanC).",
    difficulty: 3,
    category: "Microbiology",
    topic: "antimicrobial resistance"
  },
  {
    id: "mlt-batch-173",
    stem: "What is the purpose of the antiglobulin control cells (Coombs control cells) added after a negative AHG test?",
    options: ["To confirm a positive result", "To verify that the AHG reagent is active and was not neutralized", "To identify the specific antibody present", "To determine the patient's Rh type"],
    correctIndex: 1,
    rationale: "Coombs control cells (IgG-coated RBCs) are added to validate negative AHG results. If the AHG reagent was inadvertently neutralized (e.g., not washed adequately), the control cells will not agglutinate, indicating a false-negative result. A negative check cell invalidates the test.",
    difficulty: 3,
    category: "Blood Bank",
    topic: "antiglobulin testing"
  },
  {
    id: "mlt-batch-174",
    stem: "Which test differentiates Streptococcus pneumoniae from viridans group streptococci?",
    options: ["Catalase test", "Coagulase test", "Optochin sensitivity and bile solubility", "CAMP test"],
    correctIndex: 2,
    rationale: "S. pneumoniae is optochin-sensitive (≥14 mm zone) and bile-soluble (lysed by sodium deoxycholate). Viridans streptococci are optochin-resistant and bile-insoluble. Both are alpha-hemolytic and catalase-negative.",
    difficulty: 1,
    category: "Microbiology",
    topic: "streptococcal identification"
  },
  {
    id: "mlt-batch-175",
    stem: "Donor blood is tested for all of the following infectious agents EXCEPT:",
    options: ["HIV-1/2", "Hepatitis B", "Staphylococcus aureus", "West Nile virus"],
    correctIndex: 2,
    rationale: "Donor blood is routinely tested for HIV-1/2, hepatitis B (HBsAg), hepatitis C, HTLV-I/II, syphilis, West Nile virus, Zika virus, and Babesia. Bacterial testing is performed on platelets but routine S. aureus culture is not a standard donor screening test.",
    difficulty: 2,
    category: "Blood Bank",
    topic: "donor testing"
  },
  {
    id: "mlt-batch-176",
    stem: "Swarming motility on blood agar is characteristic of which organism?",
    options: ["Escherichia coli", "Proteus mirabilis", "Klebsiella pneumoniae", "Citrobacter freundii"],
    correctIndex: 1,
    rationale: "Proteus mirabilis produces characteristic swarming motility on blood agar, creating concentric rings. It is urease-positive, produces H2S, and is a common cause of catheter-associated UTIs and struvite kidney stones.",
    difficulty: 1,
    category: "Microbiology",
    topic: "gram-negative identification"
  },
  {
    id: "mlt-batch-177",
    stem: "A patient's serum contains anti-K (Kell). What percentage of random donor units would be compatible?",
    options: ["9%", "91%", "50%", "99%"],
    correctIndex: 1,
    rationale: "The K (Kell) antigen is present in approximately 9% of the population, so 91% of random donors would be K-negative and compatible. Anti-K is a clinically significant IgG antibody that can cause both HTR and HDFN.",
    difficulty: 3,
    category: "Blood Bank",
    topic: "Kell blood group system"
  },
  {
    id: "mlt-batch-178",
    stem: "A laboratory receives a CSF specimen. The Gram stain shows gram-negative diplococci inside neutrophils. The most likely organism is:",
    options: ["Streptococcus pneumoniae", "Neisseria meningitidis", "Haemophilus influenzae", "Listeria monocytogenes"],
    correctIndex: 1,
    rationale: "Neisseria meningitidis appears as gram-negative kidney bean-shaped diplococci, often found within neutrophils (intracellular) on CSF Gram stain. It is a leading cause of bacterial meningitis in adolescents and young adults.",
    difficulty: 1,
    category: "Microbiology",
    topic: "CSF pathogens"
  },
  {
    id: "mlt-batch-179",
    stem: "Electronic (computer) crossmatch can be performed when the following conditions are met:",
    options: ["The patient has a current positive antibody screen", "The patient has no clinically significant antibodies on current and historical records, and ABO/Rh is confirmed on two occasions", "The patient has received a transfusion within the last 3 days", "The patient is a neonate with maternal antibodies"],
    correctIndex: 1,
    rationale: "Electronic crossmatch requires: (1) two concordant ABO/Rh typings on the patient, (2) negative antibody screen with no history of clinically significant antibodies, and (3) validated computer system. It eliminates the serologic crossmatch for eligible patients.",
    difficulty: 4,
    category: "Blood Bank",
    topic: "crossmatch procedures"
  },
  {
    id: "mlt-batch-180",
    stem: "An ESBL (extended-spectrum beta-lactamase) producing organism shows resistance to which of the following?",
    options: ["Carbapenems", "Third-generation cephalosporins", "Vancomycin", "Aminoglycosides only"],
    correctIndex: 1,
    rationale: "ESBLs hydrolyze third-generation cephalosporins (ceftriaxone, ceftazidime, cefotaxime) and aztreonam but are inhibited by beta-lactamase inhibitors (clavulanic acid). Carbapenems remain effective against ESBL producers and are the treatment of choice.",
    difficulty: 3,
    category: "Microbiology",
    topic: "antimicrobial resistance"
  },
  {
    id: "mlt-batch-181",
    stem: "Transfusion-associated circulatory overload (TACO) is differentiated from TRALI by:",
    options: ["Presence of bilateral infiltrates on chest X-ray", "Elevated BNP (brain natriuretic peptide) and response to diuretics", "Hypotension and fever", "Positive DAT"],
    correctIndex: 1,
    rationale: "TACO is cardiogenic pulmonary edema with elevated BNP, hypertension, and response to diuretics. TRALI is non-cardiogenic pulmonary edema with normal BNP and no response to diuretics. TACO is more common than TRALI and is now the leading cause of transfusion-related fatalities.",
    difficulty: 4,
    category: "Blood Bank",
    topic: "transfusion reactions"
  },
  {
    id: "mlt-batch-182",
    stem: "Which stain is used to detect Mycobacterium species in clinical specimens?",
    options: ["Gram stain", "Ziehl-Neelsen (acid-fast) stain", "Wright stain", "Periodic acid-Schiff stain"],
    correctIndex: 1,
    rationale: "The Ziehl-Neelsen (hot) and Kinyoun (cold) acid-fast stains detect mycobacteria. Mycolic acids in the cell wall retain carbolfuchsin dye after acid-alcohol decolorization. Auramine-rhodamine fluorescent stain is also used for screening.",
    difficulty: 1,
    category: "Microbiology",
    topic: "staining techniques"
  },
  {
    id: "mlt-batch-183",
    stem: "A pretransfusion specimen must be collected within what time frame if the patient has been transfused or pregnant within the past 3 months?",
    options: ["24 hours", "3 days", "7 days", "30 days"],
    correctIndex: 1,
    rationale: "If a patient has been transfused or pregnant within the past 3 months, a new specimen must be collected within 3 days of the intended transfusion. This ensures detection of newly formed antibodies from recent antigenic stimulation.",
    difficulty: 3,
    category: "Blood Bank",
    topic: "pretransfusion testing"
  },
  {
    id: "mlt-batch-184",
    stem: "Which Clostridium species is associated with infant botulism from contaminated honey?",
    options: ["Clostridium perfringens", "Clostridium tetani", "Clostridium botulinum", "Clostridioides difficile"],
    correctIndex: 2,
    rationale: "Clostridium botulinum spores in honey germinate in the infant's immature GI tract, producing botulinum toxin. This neurotoxin blocks acetylcholine release at neuromuscular junctions, causing flaccid paralysis. Honey should not be given to children under 1 year.",
    difficulty: 1,
    category: "Microbiology",
    topic: "anaerobic pathogens"
  },
  {
    id: "mlt-batch-185",
    stem: "Which blood group system antibodies are neutralized by soluble substances in plasma and are NOT clinically significant in transfusion?",
    options: ["Rh antibodies", "Kell antibodies", "Lewis antibodies", "Kidd antibodies"],
    correctIndex: 2,
    rationale: "Lewis antigens (Le^a, Le^b) are not intrinsic red cell antigens but are adsorbed from plasma. Lewis antibodies are IgM, do not cross the placenta, and are neutralized by soluble Lewis substance in plasma. They are clinically insignificant for transfusion and HDFN.",
    difficulty: 3,
    category: "Blood Bank",
    topic: "Lewis blood group system"
  },
  {
    id: "mlt-batch-186",
    stem: "A culture from a diabetic foot ulcer grows a gram-negative rod that produces a red pigment at 25°C. The organism is:",
    options: ["Pseudomonas aeruginosa", "Serratia marcescens", "Escherichia coli", "Klebsiella oxytoca"],
    correctIndex: 1,
    rationale: "Serratia marcescens produces prodigiosin, a characteristic red pigment, especially when grown at room temperature (25°C). It is an opportunistic pathogen associated with nosocomial infections, UTIs, and wound infections.",
    difficulty: 2,
    category: "Microbiology",
    topic: "gram-negative identification"
  },
  {
    id: "mlt-batch-187",
    stem: "The type of crossmatch that includes immediate spin, 37°C incubation, and AHG phases is called:",
    options: ["Electronic crossmatch", "Immediate spin crossmatch", "Full (complete) serologic crossmatch", "Abbreviated crossmatch"],
    correctIndex: 2,
    rationale: "The full serologic crossmatch includes immediate spin (IS), 37°C incubation, and AHG phases to detect ABO incompatibility (IS) and clinically significant IgG antibodies (37°C/AHG). It is required when the antibody screen is positive.",
    difficulty: 2,
    category: "Blood Bank",
    topic: "crossmatch procedures"
  },
  {
    id: "mlt-batch-188",
    stem: "Legionella pneumophila is best isolated on which medium?",
    options: ["Blood agar", "MacConkey agar", "Buffered charcoal yeast extract (BCYE) agar", "Chocolate agar"],
    correctIndex: 2,
    rationale: "BCYE agar supplemented with L-cysteine and iron is required for Legionella growth. L-cysteine is an essential amino acid for Legionella. The organism does not grow on routine media. Urinary antigen testing is the most common diagnostic method.",
    difficulty: 2,
    category: "Microbiology",
    topic: "fastidious organism culture"
  },
  {
    id: "mlt-batch-189",
    stem: "Anti-I is a cold autoantibody most commonly associated with which infection?",
    options: ["Epstein-Barr virus (infectious mononucleosis)", "Mycoplasma pneumoniae", "Cytomegalovirus", "Hepatitis C"],
    correctIndex: 1,
    rationale: "Anti-I is a cold autoantibody (IgM, reacts below 37°C) associated with Mycoplasma pneumoniae infection. Anti-i is associated with infectious mononucleosis (EBV). Cold autoantibodies can cause cold agglutinin disease with extravascular hemolysis.",
    difficulty: 4,
    category: "Blood Bank",
    topic: "cold autoantibodies"
  },
  {
    id: "mlt-batch-190",
    stem: "The oxidase test detects the presence of which enzyme?",
    options: ["Catalase", "Cytochrome c oxidase", "Coagulase", "Urease"],
    correctIndex: 1,
    rationale: "The oxidase test detects cytochrome c oxidase, the terminal enzyme in the electron transport chain. Oxidase-positive organisms include Neisseria, Pseudomonas, Vibrio, Campylobacter, and Aeromonas. Enterobacteriaceae are oxidase-negative.",
    difficulty: 1,
    category: "Microbiology",
    topic: "biochemical tests"
  },
  {
    id: "mlt-batch-191",
    stem: "For exchange transfusion in a neonate with Rh-HDFN, what type of blood should be used?",
    options: ["ABO-compatible with the mother, Rh-positive", "ABO-compatible with the baby, Rh-positive", "Group O, Rh-negative, crossmatch-compatible with maternal serum", "Group AB, Rh-positive"],
    correctIndex: 2,
    rationale: "For Rh-HDFN exchange transfusion, use group O (to avoid ABO issues), Rh-negative (to prevent further hemolysis by maternal anti-D), and crossmatch-compatible with maternal serum. The blood should be fresh (<7 days) and irradiated.",
    difficulty: 5,
    category: "Blood Bank",
    topic: "neonatal transfusion"
  },
  {
    id: "mlt-batch-192",
    stem: "Which test is used to confirm the identification of Mycobacterium tuberculosis complex?",
    options: ["Catalase test", "Niacin accumulation test", "Oxidase test", "Coagulase test"],
    correctIndex: 1,
    rationale: "M. tuberculosis accumulates niacin (nicotinic acid) because it lacks the enzyme to convert niacin to NAD. The niacin test combined with nitrate reduction and heat-stable catalase differentiates M. tuberculosis from other mycobacteria. Molecular methods (PCR, probes) are now preferred.",
    difficulty: 3,
    category: "Microbiology",
    topic: "mycobacteriology"
  },
  {
    id: "mlt-batch-193",
    stem: "Polyspecific AHG reagent contains antibodies to:",
    options: ["IgG only", "IgM only", "IgG and C3d", "IgA and IgE"],
    correctIndex: 2,
    rationale: "Polyspecific AHG contains anti-IgG and anti-C3d (complement). It detects both IgG antibody coating and complement deposition on red cells. Monospecific AHG reagents (anti-IgG or anti-C3d separately) are used for further characterization.",
    difficulty: 2,
    category: "Blood Bank",
    topic: "antiglobulin testing"
  },
  {
    id: "mlt-batch-194",
    stem: "Enterobacteriaceae are differentiated from non-fermenters by their ability to:",
    options: ["Grow on blood agar", "Ferment glucose", "Produce catalase", "Grow aerobically"],
    correctIndex: 1,
    rationale: "Enterobacteriaceae ferment glucose (producing acid ± gas), are oxidase-negative, and reduce nitrate to nitrite. Non-fermenters (Pseudomonas, Acinetobacter) oxidize glucose or are inert. TSI/KIA patterns help differentiate these groups.",
    difficulty: 1,
    category: "Microbiology",
    topic: "gram-negative classification"
  },
  {
    id: "mlt-batch-195",
    stem: "A patient with sickle cell disease requires chronic transfusions. The most important blood group matching beyond ABO/Rh(D) includes:",
    options: ["Lewis and P antigens", "C, E, and K (Kell) antigens", "MNS antigens only", "Duffy antigens only"],
    correctIndex: 1,
    rationale: "Chronically transfused sickle cell patients should receive extended phenotype-matched blood for C, E, and K antigens (at minimum) to prevent alloimmunization. These antigens are the most immunogenic after D and most commonly cause alloantibodies.",
    difficulty: 4,
    category: "Blood Bank",
    topic: "extended phenotype matching"
  },
  {
    id: "mlt-batch-196",
    stem: "XLD (xylose-lysine-deoxycholate) agar is used for the selective isolation of:",
    options: ["Staphylococcus aureus", "Salmonella and Shigella", "Pseudomonas aeruginosa", "Streptococcus pneumoniae"],
    correctIndex: 1,
    rationale: "XLD agar is a selective and differential medium for isolation of Salmonella (red colonies with black centers from H2S production) and Shigella (red colonies without black centers) from stool specimens. Lactose fermenters appear yellow.",
    difficulty: 2,
    category: "Microbiology",
    topic: "selective media"
  },
  {
    id: "mlt-batch-197",
    stem: "Autologous blood donation refers to:",
    options: ["Receiving blood from a family member", "Donating blood for one's own future use", "Receiving blood from a volunteer donor", "Directed donation from a specific individual"],
    correctIndex: 1,
    rationale: "Autologous donation is when patients donate their own blood before a planned surgery. This eliminates the risk of alloimmunization, most transfusion-transmitted infections, and transfusion reactions. The blood must still be tested and properly labeled.",
    difficulty: 1,
    category: "Blood Bank",
    topic: "autologous donation"
  },
  {
    id: "mlt-batch-198",
    stem: "The quellung reaction (capsular swelling test) is used to identify serotypes of which organism?",
    options: ["Staphylococcus aureus", "Streptococcus pneumoniae", "Escherichia coli", "Pseudomonas aeruginosa"],
    correctIndex: 1,
    rationale: "The quellung reaction uses type-specific anticapsular antibodies that bind to the pneumococcal capsule, causing it to appear swollen under microscopy. Over 90 serotypes of S. pneumoniae have been identified. This test is now rarely performed clinically.",
    difficulty: 3,
    category: "Microbiology",
    topic: "serological identification"
  },
  {
    id: "mlt-batch-199",
    stem: "Which antigen system is most commonly associated with platelet refractoriness?",
    options: ["ABO antigens", "HLA (human leukocyte antigen) class I antigens", "Rh antigens", "Kell antigens"],
    correctIndex: 1,
    rationale: "HLA class I antigens on platelets are the most common cause of immune-mediated platelet refractoriness. Patients develop HLA antibodies from previous transfusions or pregnancies. Treatment includes HLA-matched or crossmatch-compatible platelets.",
    difficulty: 4,
    category: "Blood Bank",
    topic: "platelet refractoriness"
  },
  {
    id: "mlt-batch-200",
    stem: "Which dermatophyte genus infects hair, skin, and nails?",
    options: ["Epidermophyton (skin and nails only)", "Trichophyton (hair, skin, and nails)", "Microsporum (hair and skin only)", "Malassezia (skin only)"],
    correctIndex: 1,
    rationale: "Trichophyton is the only dermatophyte genus that infects all three: hair, skin, and nails. Microsporum infects hair and skin but NOT nails. Epidermophyton infects skin and nails but NOT hair. Malassezia is not a dermatophyte.",
    difficulty: 2,
    category: "Microbiology",
    topic: "mycology"
  }
];
