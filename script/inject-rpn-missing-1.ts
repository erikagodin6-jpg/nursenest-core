import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LESSONS_DIR = path.join(__dirname, "../client/src/data/lessons");

function escapeStr(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function buildLS(l: any): string {
  const li: string[] = [];
  li.push(`    title: "${escapeStr(l.title)}",`);
  li.push(`    cellular: { title: "${escapeStr(l.cellular.title)}", content: "${escapeStr(l.cellular.content)}" },`);
  li.push(`    riskFactors: [${l.riskFactors.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    diagnostics: [${l.diagnostics.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    management: [${l.management.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    nursingActions: [${l.nursingActions.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    assessmentFindings: [${l.assessmentFindings.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    signs: { left: [${l.signs.left.map((r:string) => `"${escapeStr(r)}"`).join(",")}], right: [${l.signs.right.map((r:string) => `"${escapeStr(r)}"`).join(",")}] },`);
  li.push(`    medications: [${l.medications.map((m:any) => `{ name: "${escapeStr(m.name)}", type: "${escapeStr(m.type)}", action: "${escapeStr(m.action)}", sideEffects: "${escapeStr(m.sideEffects)}", contra: "${escapeStr(m.contra)}", pearl: "${escapeStr(m.pearl)}" }`).join(",")}],`);
  li.push(`    pearls: [${l.pearls.map((r:string) => `"${escapeStr(r)}"`).join(",")}],`);
  li.push(`    quiz: [${l.quiz.map((q:any) => `{ question: "${escapeStr(q.question)}", options: [${q.options.map((o:string) => `"${escapeStr(o)}"`).join(",")}], correct: ${q.correct}, rationale: "${escapeStr(q.rationale)}" }`).join(",")}]`);
  return li.join("\n    ");
}

function inject(id: string, lesson: any): boolean {
  const files = fs.readdirSync(LESSONS_DIR).filter(f => f.endsWith(".ts") && f !== "index.ts" && f !== "types.ts");
  for (const file of files) {
    const fp = path.join(LESSONS_DIR, file);
    let src = fs.readFileSync(fp, "utf-8");
    const re = new RegExp(`"${id}":\\s*\\{[\\s\\S]*?\\[WRITE YOUR[\\s\\S]*?\\n  \\}`, "m");
    if (re.test(src)) {
      const replacement = `"${id}": {\n    ${buildLS(lesson)}\n  }`;
      src = src.replace(re, replacement);
      fs.writeFileSync(fp, src, "utf-8");
      console.log(`  Injected: ${id} -> ${file}`);
      return true;
    }
  }
  console.log(`  NOT FOUND: ${id}`);
  return false;
}

const lessons: Record<string, any> = {
  "cauti-prevention": {
    title: "CAUTI Prevention",
    cellular: {
      title: "Pathophysiology of Catheter-Associated Urinary Tract Infections",
      content: "Catheter-associated urinary tract infections (CAUTIs) represent one of the most common healthcare-associated infections, accounting for approximately 75% of all hospital-acquired urinary tract infections in acute care settings. Understanding the pathophysiology of CAUTI requires knowledge of normal urinary tract defense mechanisms and how indwelling urinary catheters circumvent these protections. The healthy urinary tract maintains sterility through several innate defense mechanisms. The unidirectional flow of urine mechanically flushes bacteria from the urethra, preventing ascending colonization. The urethral mucosa produces antimicrobial peptides including defensins and cathelicidins that directly kill or inhibit bacterial growth. Urine itself has antibacterial properties: its low pH (typically 5.0 to 6.0), high urea concentration, high osmolality, and presence of Tamm-Horsfall protein (uromodulin) all inhibit bacterial adhesion and proliferation. The glycosaminoglycan (GAG) layer lining the bladder epithelium acts as a physical barrier preventing bacterial attachment to uroepithelial cells. Additionally, the periodic complete emptying of the bladder during normal voiding removes any bacteria that have entered the system. An indwelling urinary catheter fundamentally disrupts every one of these protective mechanisms. The catheter provides a direct conduit from the external environment into the bladder, bypassing the urethral defense mechanisms entirely. Within hours of catheter insertion, bacteria begin to colonize the catheter surface through two primary routes: the extraluminal route (ascending between the catheter exterior and the urethral mucosa, accounting for approximately 66% of CAUTIs in women) and the intraluminal route (ascending through the catheter lumen from contaminated drainage systems, more common in men). Bacterial colonization of the catheter surface leads to biofilm formation, which is the central pathological feature of CAUTI. Biofilm formation begins when free-floating (planktonic) bacteria adhere to the catheter surface and secrete extracellular polymeric substances (EPS) -- a matrix composed of polysaccharides, proteins, and extracellular DNA that encases the bacterial community. This biofilm matrix provides extraordinary protection to embedded bacteria: it impedes penetration of antibiotics (bacteria within biofilms can be 100 to 1000 times more resistant to antimicrobials than planktonic bacteria), shields organisms from host immune cells (neutrophils and macrophages cannot effectively penetrate the matrix), and creates microenvironments with altered pH and oxygen levels that further promote bacterial survival. Biofilm can form on both the inner and outer catheter surfaces within 24 to 48 hours of insertion. The most common causative organisms in CAUTI differ from those in community-acquired UTIs. While Escherichia coli remains the most frequent pathogen, catheter-associated infections have a much broader microbial spectrum including Klebsiella pneumoniae, Proteus mirabilis, Pseudomonas aeruginosa, Enterococcus species, Candida species, and coagulase-negative staphylococci. Proteus mirabilis is particularly problematic because it produces urease, an enzyme that hydrolyzes urea into ammonia and carbon dioxide, raising urine pH above 7.0 and promoting precipitation of calcium and magnesium phosphate crystals. These mineral deposits encrust the catheter surface, creating rough surfaces that enhance further biofilm attachment and can cause catheter obstruction. The risk of CAUTI increases by approximately 3 to 7 percent per day of catheterization, making duration the single most important modifiable risk factor. By day 30 of catheterization, virtually 100% of patients will have bacteriuria. It is critically important for the practical nurse to distinguish between catheter-associated asymptomatic bacteriuria (CA-ASB) and true CAUTI. CA-ASB is defined as the presence of bacteria in catheter-obtained urine without signs or symptoms of urinary tract infection. CA-ASB does NOT require antibiotic treatment (treating it promotes antimicrobial resistance without patient benefit). True CAUTI requires both bacteriuria AND compatible signs/symptoms such as fever greater than 38 degrees Celsius, suprapubic tenderness, costovertebral angle tenderness, urgency/frequency/dysuria (in recently decatheterized patients), altered mental status in elderly patients, or hemodynamic instability. Prevention of CAUTI follows evidence-based bundles that address each step in the pathophysiology: avoiding unnecessary catheter insertion, maintaining aseptic technique during insertion, ensuring proper catheter maintenance to minimize biofilm formation, and removing catheters as early as possible."
    },
    riskFactors: [
      "Duration of catheterization (single most important risk factor -- risk increases 3-7% per day)",
      "Female sex (shorter urethra facilitates extraluminal bacterial migration)",
      "Advanced age (weakened immune defenses, increased comorbidities)",
      "Diabetes mellitus (glycosuria promotes bacterial growth, impaired immune function)",
      "Immunocompromised state (chemotherapy, corticosteroids, HIV/AIDS)",
      "Breaks in closed drainage system (disconnection of tubing, contaminated sampling)",
      "Catheter insertion outside of operating room (higher contamination risk than sterile OR environment)"
    ],
    diagnostics: [
      "Urine culture and sensitivity (obtain specimen from sampling port using aseptic technique, NEVER from drainage bag)",
      "Urinalysis with microscopy (pyuria >10 WBC/hpf suggests infection but is nonspecific in catheterized patients)",
      "Complete blood count (leukocytosis with left shift suggests systemic infection)",
      "Blood cultures (obtain if fever >38.5C or signs of urosepsis -- bacteremia occurs in 1-4% of CAUTIs)",
      "Basic metabolic panel (assess renal function, electrolytes if sepsis suspected)",
      "Monitor vital signs for signs of systemic inflammatory response (temperature, heart rate, blood pressure)",
      "Assess catheter for encrustation, obstruction, or discoloration indicating biofilm"
    ],
    management: [
      "Remove or replace indwelling catheter BEFORE initiating antibiotic therapy (old catheter harbors biofilm that renders antibiotics ineffective)",
      "Initiate appropriate antibiotics based on culture and sensitivity results (empiric coverage for gram-negatives pending culture)",
      "Evaluate daily for catheter necessity using nurse-driven removal protocols (HOUDINI criteria: Hematuria, Obstruction, Urologic surgery, Decubitus ulcer, Input/output monitoring, No mobility, Imminent death)",
      "Consider intermittent catheterization as alternative to indwelling catheter when ongoing catheterization is required",
      "Do NOT treat asymptomatic bacteriuria in catheterized patients (exception: pregnant patients and those undergoing urologic procedures)",
      "Implement antimicrobial stewardship principles in CAUTI treatment (shortest effective course, narrow-spectrum when possible)"
    ],
    nursingActions: [
      "Maintain closed drainage system at all times -- never disconnect catheter from drainage tubing",
      "Keep drainage bag below level of bladder at all times to prevent retrograde flow (never place on floor)",
      "Perform hand hygiene before and after any catheter manipulation",
      "Clean periurethral area with soap and water during routine hygiene (no special antiseptic cleansers needed)",
      "Secure catheter to prevent traction and urethral trauma (to thigh for women, to abdomen or thigh for men)",
      "Empty drainage bag regularly using individual collection containers (never share containers between patients)",
      "Assess for catheter necessity every shift and advocate for removal when no longer indicated",
      "Document catheter insertion date, size, balloon volume, and daily assessments"
    ],
    assessmentFindings: [
      "Cloudy or foul-smelling urine (may indicate infection but is NOT diagnostic alone)",
      "Fever greater than 38 degrees Celsius (100.4F) -- most reliable sign of true CAUTI",
      "Suprapubic tenderness or discomfort on palpation",
      "Costovertebral angle tenderness (suggests upper tract involvement/pyelonephritis)",
      "New-onset confusion or altered mental status (may be only sign in elderly patients)",
      "Hematuria (visible blood in urine or positive on dipstick)",
      "Decreased urine output or catheter obstruction from encrustation"
    ],
    signs: {
      left: [
        "Low-grade fever (early sign of developing infection)",
        "Mild suprapubic discomfort",
        "Subtle change in urine color or clarity",
        "Mild increase in heart rate",
        "New restlessness or confusion in elderly patients"
      ],
      right: [
        "High fever with rigors (suggests bacteremia/urosepsis)",
        "Hemodynamic instability (hypotension, tachycardia)",
        "Flank pain with costovertebral angle tenderness",
        "Gross hematuria",
        "Septic shock (requires immediate intervention)"
      ]
    },
    medications: [
      {
        name: "Ciprofloxacin (Cipro)",
        type: "Fluoroquinolone antibiotic",
        action: "Inhibits bacterial DNA gyrase and topoisomerase IV, preventing DNA replication, transcription, and repair in susceptible bacteria; provides excellent urinary tract penetration with high concentrations achieved in urine; effective against most gram-negative uropathogens including E. coli, Klebsiella, and Proteus species",
        sideEffects: "Tendinitis and tendon rupture (especially Achilles tendon), peripheral neuropathy, QT prolongation, photosensitivity, GI upset (nausea, diarrhea), Clostridioides difficile-associated diarrhea, CNS effects (dizziness, headache, insomnia)",
        contra: "Known hypersensitivity to fluoroquinolones; concurrent use with tizanidine; myasthenia gravis (may exacerbate muscle weakness); history of tendon disorders related to fluoroquinolone use; children under 18 (risk of cartilage damage except in specific indications)",
        pearl: "FDA black box warning for tendinitis, tendon rupture, peripheral neuropathy, and CNS effects -- reserve for infections without other treatment options; avoid in patients taking corticosteroids (increased tendon rupture risk); must separate administration from antacids, iron, calcium, and dairy products by at least 2 hours (chelation reduces absorption); increasing fluoroquinolone resistance limits empiric use in many regions"
      },
      {
        name: "Nitrofurantoin (Macrobid)",
        type: "Urinary antiseptic (nitrofuran derivative)",
        action: "Reduced by bacterial flavoproteins to reactive intermediates that damage bacterial DNA, RNA, proteins, and cell wall synthesis; mechanism produces multiple simultaneous targets making resistance development uncommon; achieves therapeutic concentrations ONLY in urine (not effective for systemic infections or upper tract UTIs)",
        sideEffects: "GI upset (nausea, most common -- reduced with macrocrystalline formulation taken with food), pulmonary toxicity (acute pneumonitis or chronic pulmonary fibrosis with prolonged use), peripheral neuropathy, hepatotoxicity, hemolytic anemia in G6PD-deficient patients",
        contra: "Creatinine clearance less than 30 mL/min (inadequate urinary drug concentration and increased systemic toxicity risk); G6PD deficiency (hemolytic anemia risk); pregnancy at term (38-42 weeks -- risk of neonatal hemolytic anemia); pyelonephritis or systemic infection (does not achieve therapeutic serum levels)",
        pearl: "Excellent first-line choice for uncomplicated lower UTIs due to low resistance rates and narrow spectrum preserving gut flora; NOT appropriate for CAUTI with systemic signs because it only works in the urine; macrocrystalline formulation (Macrobid) better tolerated than microcrystalline; must be taken with food to improve absorption and reduce nausea; typically prescribed for 5-7 days for acute cystitis"
      },
      {
        name: "Ceftriaxone (Rocephin)",
        type: "Third-generation cephalosporin (broad-spectrum beta-lactam)",
        action: "Binds to penicillin-binding proteins (PBPs) in bacterial cell walls, inhibiting transpeptidation and cross-linking of peptidoglycan polymers, leading to cell wall instability, osmotic lysis, and bacterial death; broad gram-negative coverage including many extended-spectrum organisms; achieves excellent urinary concentrations",
        sideEffects: "Diarrhea (including Clostridioides difficile-associated diarrhea), injection site reactions (pain with IM, phlebitis with IV), rash, eosinophilia, elevated liver enzymes, biliary sludging or pseudocholelithiasis (especially in neonates and with prolonged use), hypoprothrombinemia",
        contra: "Known severe hypersensitivity to cephalosporins or penicillins (cross-reactivity approximately 1-2%); neonates with hyperbilirubinemia (displaces bilirubin from albumin); must NOT be co-administered with calcium-containing IV solutions in neonates (fatal precipitation in lungs and kidneys)",
        pearl: "Preferred empiric parenteral antibiotic for complicated UTI and urosepsis pending culture results; once-daily dosing (1-2g IV/IM) due to long half-life improves compliance and allows outpatient parenteral therapy; always obtain cultures before first dose; consider ESBL-producing organism coverage (meropenem) if risk factors present or local resistance rates are high"
      }
    ],
    pearls: [
      "The single most effective intervention to prevent CAUTI is to avoid unnecessary catheter insertion -- always question catheter necessity and use alternatives (condom catheter, intermittent catheterization, bladder scanner) when possible",
      "Duration of catheterization is the strongest predictor of CAUTI -- implement nurse-driven catheter removal protocols using HOUDINI criteria to ensure catheters are removed at the earliest appropriate time",
      "NEVER treat catheter-associated asymptomatic bacteriuria with antibiotics (except in pregnant patients or before urologic procedures) -- doing so promotes resistance without clinical benefit and is a key antimicrobial stewardship principle",
      "Always replace the catheter BEFORE starting antibiotics for CAUTI -- the biofilm on the old catheter acts as a reservoir of resistant organisms and impairs antibiotic efficacy",
      "Catheter care does NOT require special antiseptic solutions for periurethral cleaning -- routine soap and water during daily hygiene is recommended by CDC guidelines; antiseptic solutions have not shown benefit and may promote resistance",
      "Use aseptic technique for urine specimen collection: clamp tubing distal to sampling port, clean port with alcohol, and aspirate with sterile syringe -- NEVER collect from the drainage bag (contamination rates exceed 50%)",
      "Report and document urine output accurately -- a sudden decrease in output may indicate catheter obstruction from biofilm encrustation (especially with Proteus mirabilis infections) rather than decreased renal function"
    ],
    quiz: [
      {
        question: "A patient has had an indwelling urinary catheter for 5 days following surgery. The urine culture shows 100,000 CFU/mL of Escherichia coli, but the patient is afebrile with no urinary symptoms. What is the most appropriate nursing action?",
        options: [
          "Administer prescribed antibiotics and monitor for side effects",
          "Document findings and continue monitoring without antibiotic treatment",
          "Obtain a repeat urine culture to confirm the results",
          "Irrigate the catheter with antibiotic solution"
        ],
        correct: 1,
        rationale: "This describes catheter-associated asymptomatic bacteriuria (CA-ASB), which does NOT require antibiotic treatment. Evidence-based guidelines clearly state that treating CA-ASB does not improve outcomes and promotes antimicrobial resistance. The nurse should document the finding and continue monitoring for signs and symptoms of true infection (fever, suprapubic tenderness, altered mental status)."
      },
      {
        question: "When collecting a urine specimen from a patient with an indwelling urinary catheter, the practical nurse should:",
        options: [
          "Empty urine from the drainage bag into a sterile container",
          "Disconnect the catheter from the drainage tubing and collect from the catheter tip",
          "Clamp the tubing, clean the sampling port with alcohol, and aspirate with a sterile syringe",
          "Remove the catheter and collect a midstream clean-catch specimen"
        ],
        correct: 2,
        rationale: "The correct technique is to clamp the tubing below the sampling port, clean the port with alcohol, and use a sterile syringe to aspirate the specimen. Collecting from the drainage bag introduces contamination (bag contents are not representative of bladder urine). Disconnecting the tubing breaks the closed system and increases infection risk. The catheter should not be removed solely for specimen collection."
      },
      {
        question: "Which criterion from the HOUDINI mnemonic would indicate a valid reason to CONTINUE an indwelling urinary catheter?",
        options: [
          "The patient is ambulatory and requesting catheter removal",
          "The patient is on strict intake and output monitoring during acute heart failure management",
          "The urine culture shows bacterial growth",
          "The patient had the catheter inserted five days ago"
        ],
        correct: 1,
        rationale: "The HOUDINI criteria (Hematuria management, Obstruction, Urologic surgery, Decubitus ulcer management in sacral/perineal wounds, Input/output monitoring in critical illness, No mobility/immobility, Imminent death/comfort care) provide valid indications for catheter continuation. Strict I&O monitoring during acute heart failure management falls under the 'I' criterion. Being ambulatory, having bacterial colonization, or duration of catheterization are NOT valid reasons to continue catheterization."
      }
    ]
  },

  "innate-immunity": {
    title: "Innate Immunity and Barriers",
    cellular: {
      title: "Pathophysiology of Innate Immunity and Physical Defense Barriers",
      content: "The immune system is broadly divided into two interconnected arms: innate (nonspecific) immunity and adaptive (specific) immunity. Innate immunity represents the body's first and second lines of defense against pathogens and is present from birth, requiring no prior exposure to a specific antigen to mount a response. Unlike adaptive immunity, which develops memory and specificity over time, innate immune responses are immediate (activated within minutes to hours), nonspecific (respond the same way regardless of the pathogen), and lack immunological memory (do not improve with repeated exposures to the same pathogen). The first line of defense consists of physical and chemical barriers that prevent pathogen entry into the body. The skin is the largest and most important barrier, providing a continuous keratinized epithelial surface that is virtually impenetrable to most microorganisms when intact. The outermost layer (stratum corneum) consists of dead, tightly packed keratinocytes filled with the waterproof protein keratin and coated with antimicrobial lipids from sebaceous glands. Sebum (produced by sebaceous glands) contains fatty acids that create an acidic environment (pH 3-5) on the skin surface, inhibiting bacterial and fungal growth -- this is called the acid mantle. Sweat glands produce perspiration containing lysozyme (an enzyme that cleaves peptidoglycan in bacterial cell walls), dermcidin (an antimicrobial peptide), and salt (creating a hyperosmotic environment hostile to many pathogens). Normal skin flora (commensal bacteria such as Staphylococcus epidermidis) compete with pathogenic organisms for nutrients and attachment sites through competitive exclusion. Mucous membranes line all body cavities that open to the external environment (respiratory, gastrointestinal, urogenital, and conjunctival). Unlike skin, mucous membranes are not keratinized but instead produce mucus -- a sticky glycoprotein secretion that traps microorganisms, particulate matter, and debris. In the respiratory tract, the mucociliary escalator represents a critical defense mechanism: goblet cells and submucosal glands produce mucus that traps inhaled particles, while ciliated pseudostratified columnar epithelial cells beat in coordinated waves (approximately 1000 times per minute) to propel the mucus blanket upward toward the pharynx where it is swallowed and destroyed by gastric acid. Smoking, anesthesia, and certain medications paralyze or damage cilia, dramatically increasing infection susceptibility. The gastrointestinal tract employs multiple defense mechanisms: saliva contains lysozyme, lactoferrin (which binds iron, starving bacteria), and secretory immunoglobulin A (sIgA, bridging innate and adaptive immunity). Gastric acid (pH 1.5-3.5) kills the vast majority of ingested microorganisms. The small intestine produces Paneth cells that secrete alpha-defensins and cryptdins with direct antimicrobial activity. The large intestine maintains a diverse microbiome of commensal bacteria (approximately 10 to the 14th organisms) that prevent pathogen colonization through competitive exclusion, production of bacteriocins, and maintenance of an acidic environment through fermentation of dietary fiber. The urinary tract relies on the unidirectional flow of urine, urethral length, Tamm-Horsfall protein (prevents bacterial adhesion), and the acidic pH of urine. The vagina maintains a low pH (3.8-4.5) through lactic acid production by Lactobacillus species. The second line of defense activates when pathogens breach the physical barriers and consists of cellular and chemical responses. Phagocytosis is the primary cellular mechanism: neutrophils (the most abundant white blood cells, first responders arriving within minutes) and macrophages (tissue-resident phagocytes derived from monocytes) engulf and destroy pathogens through a series of steps: chemotaxis (migration toward the pathogen guided by chemical signals), adhesion (attachment to the pathogen surface, enhanced by opsonization with complement proteins C3b or antibodies), ingestion (engulfment into a phagosome), killing (fusion with lysosomes to form phagolysosomes containing reactive oxygen species, hydrogen peroxide, hypochlorous acid, and digestive enzymes), and exocytosis (expulsion of debris). Natural killer (NK) cells are large granular lymphocytes that provide innate surveillance against virus-infected cells and tumor cells. Unlike cytotoxic T cells, NK cells do NOT require prior antigen presentation or MHC recognition -- they identify targets through the 'missing self' hypothesis: normal cells express MHC class I molecules that send inhibitory signals to NK cells, while virus-infected or transformed cells downregulate MHC I, releasing NK cells from inhibition and allowing them to kill the target through perforin and granzyme release. The inflammatory response is a critical second-line defense triggered by tissue injury or pathogen invasion. It follows a predictable sequence: tissue injury causes damaged cells and resident mast cells to release histamine, prostaglandins, leukotrienes, and cytokines (IL-1, IL-6, TNF-alpha). These mediators cause vasodilation (increased blood flow producing redness and warmth), increased vascular permeability (plasma exudation producing swelling/edema), and chemotaxis (attracting neutrophils, monocytes, and other immune cells to the site). The five cardinal signs of inflammation are rubor (redness), calor (heat), tumor (swelling), dolor (pain), and functio laesa (loss of function). Fever represents a systemic inflammatory response: pyrogens (both exogenous bacterial products like lipopolysaccharide and endogenous cytokines like IL-1 and IL-6) act on the hypothalamic thermoregulatory center, raising the set point for body temperature. Moderate fever (38-39 degrees C) is beneficial: it increases phagocytic activity, accelerates metabolic processes, inhibits growth of some temperature-sensitive pathogens, and enhances interferon production. The complement system consists of over 30 plasma proteins (produced primarily by the liver) that circulate in inactive form and activate through a cascade of proteolytic cleavages via three pathways: the classical pathway (triggered by antigen-antibody complexes, linking innate and adaptive immunity), the alternative pathway (triggered directly by microbial surfaces without antibody, purely innate), and the lectin pathway (triggered by mannose-binding lectin recognizing microbial surface carbohydrates). All three pathways converge at C3 convertase, which cleaves C3 into C3a (anaphylatoxin causing mast cell degranulation and inflammation) and C3b (opsonin that coats pathogen surfaces enhancing phagocytosis). The cascade continues through C5 convertase to form C5a (potent chemotactic factor attracting neutrophils) and C5b, which initiates assembly of the membrane attack complex (MAC, composed of C5b-C6-C7-C8-C9) -- a pore-forming structure that inserts into pathogen cell membranes causing osmotic lysis. Interferons are proteins produced by virus-infected cells that alert neighboring uninfected cells to prepare antiviral defenses. Type I interferons (IFN-alpha and IFN-beta) induce an 'antiviral state' in surrounding cells by activating enzymes that degrade viral RNA and inhibit viral protein synthesis, while also activating NK cells and enhancing antigen presentation to cytotoxic T cells."
    },
    riskFactors: [
      "Breaks in skin integrity (surgical wounds, burns, IV insertion sites, pressure injuries, skin tears)",
      "Impaired mucosal barriers (endotracheal intubation bypasses upper airway defenses, proton pump inhibitors reduce gastric acid barrier)",
      "Extremes of age (neonates have immature innate immune responses; elderly have immunosenescence with decreased phagocytic efficiency)",
      "Malnutrition and protein-calorie deficiency (impairs phagocyte function, complement production, and barrier integrity)",
      "Chronic diseases (diabetes mellitus impairs neutrophil chemotaxis and phagocytosis; chronic kidney disease reduces complement production)",
      "Immunosuppressive medications (corticosteroids suppress inflammatory response and phagocyte function; chemotherapy causes neutropenia)",
      "Smoking (paralyzes mucociliary escalator, damages alveolar macrophages, reduces secretory IgA in respiratory tract)"
    ],
    diagnostics: [
      "Complete blood count with differential (elevated WBC with neutrophilia indicates acute bacterial infection; left shift with bands indicates bone marrow releasing immature neutrophils to meet demand)",
      "C-reactive protein (CRP) -- acute phase protein produced by liver in response to IL-6; rises within 6-8 hours of inflammation, peaks at 48 hours; nonspecific but useful for monitoring inflammatory response",
      "Erythrocyte sedimentation rate (ESR) -- measures rate of red blood cell settling; elevated in inflammation due to increased fibrinogen and immunoglobulins; slower to rise and fall than CRP",
      "Procalcitonin (PCT) -- more specific marker for bacterial infection than CRP; helps differentiate bacterial from viral infections; useful for antibiotic stewardship decisions",
      "Complement levels (C3, C4, CH50) -- decreased levels may indicate complement consumption during active infection or complement deficiency predisposing to infection",
      "Temperature monitoring (fever pattern assessment: intermittent, remittent, sustained, or relapsing patterns may suggest different etiologies)",
      "Wound assessment and culture when barrier breach is identified (assess for signs of local infection: erythema, warmth, edema, purulent drainage)"
    ],
    management: [
      "Support and maintain physical barriers (meticulous skin care, wound management, oral hygiene to preserve mucosal integrity)",
      "Implement evidence-based infection prevention practices (hand hygiene, standard precautions, aseptic technique for invasive procedures)",
      "Optimize nutritional status to support immune function (adequate protein intake for phagocyte production, vitamins A, C, D, and zinc for barrier and cellular immunity)",
      "Manage fever appropriately (avoid aggressive antipyretic therapy for moderate fevers unless patient is hemodynamically compromised, has cardiac disease, or is experiencing discomfort; fever supports immune function)",
      "Administer prescribed antimicrobials based on culture and sensitivity when infection is confirmed",
      "Minimize use of immunosuppressive medications when possible and monitor for signs of infection during immunosuppressive therapy"
    ],
    nursingActions: [
      "Perform thorough skin assessment every shift, documenting any breaks in integrity, moisture-associated skin damage, or pressure injury risk",
      "Maintain meticulous hand hygiene using WHO five moments approach (before patient contact, before aseptic procedures, after body fluid exposure, after patient contact, after touching patient surroundings)",
      "Implement aseptic technique for all invasive procedures including IV insertion, urinary catheterization, wound care, and central line dressing changes",
      "Monitor and document vital signs with focus on temperature trends (report new fever onset promptly)",
      "Assess and document white blood cell count trends and report significant elevations or neutropenia",
      "Provide oral care every 2-4 hours for intubated patients to maintain mucosal barrier integrity and prevent ventilator-associated pneumonia",
      "Educate patients about importance of nutrition, hydration, hand hygiene, and recognizing signs of infection",
      "Implement isolation precautions as indicated based on suspected or confirmed pathogen transmission route"
    ],
    assessmentFindings: [
      "Elevated temperature (fever >38C/100.4F indicates activation of inflammatory response and hypothalamic set point elevation)",
      "Elevated WBC count with neutrophilia (>10,000/microL with >70% neutrophils suggests acute bacterial infection)",
      "Presence of bands (immature neutrophils >6% -- 'left shift' indicates bone marrow stress response to infection)",
      "Local inflammatory signs at barrier breach sites (erythema, warmth, swelling, pain, purulent drainage)",
      "Elevated C-reactive protein and/or procalcitonin levels",
      "Lymphadenopathy (enlarged, tender lymph nodes near site of infection indicate immune cell activation)",
      "Altered skin integrity findings (surgical wound dehiscence, pressure injuries, IV site inflammation)"
    ],
    signs: {
      left: [
        "Localized redness (rubor) at injury/infection site",
        "Warmth (calor) at affected area",
        "Mild swelling (tumor/edema)",
        "Low-grade fever (38-38.5C)",
        "Mild leukocytosis (WBC 10,000-15,000)"
      ],
      right: [
        "High fever with rigors (>39C/102.2F)",
        "Significant leukocytosis (>20,000) or leukopenia (<4,000)",
        "Purulent drainage from wound sites",
        "Systemic inflammatory response (tachycardia, tachypnea, hypotension)",
        "Sepsis progression (altered mental status, organ dysfunction)"
      ]
    },
    medications: [
      {
        name: "Acetaminophen (Tylenol)",
        type: "Antipyretic/Analgesic (non-opioid)",
        action: "Inhibits cyclooxygenase (COX) enzymes in the central nervous system, reducing prostaglandin E2 synthesis in the hypothalamic thermoregulatory center, thereby lowering the elevated temperature set point back toward normal; provides analgesia through central COX inhibition but has minimal peripheral anti-inflammatory activity unlike NSAIDs",
        sideEffects: "Hepatotoxicity (dose-dependent, most common cause of acute liver failure in North America), rare allergic reactions, rare thrombocytopenia; generally well-tolerated at therapeutic doses",
        contra: "Severe hepatic impairment or active liver disease; known hypersensitivity; caution in chronic alcohol use (increased hepatotoxicity risk due to CYP2E1 induction and depleted glutathione stores); dose adjustment required in renal impairment",
        pearl: "Maximum adult dose is 4g/day for healthy adults but many institutions cap at 3g/day; remind patients to check ALL over-the-counter medications for hidden acetaminophen content (combination cold/flu products are a common source of accidental overdose); N-acetylcysteine (NAC) is the antidote for overdose -- it replenishes hepatic glutathione stores; use fever assessment guidelines: moderate fever (38-39C) may not require treatment as it supports immune function"
      },
      {
        name: "Cephalexin (Keflex)",
        type: "First-generation cephalosporin (beta-lactam antibiotic)",
        action: "Binds to penicillin-binding proteins (PBPs) in bacterial cell walls, inhibiting the transpeptidation step of peptidoglycan cross-linking during cell wall synthesis; this weakens the cell wall structure, and combined with ongoing autolytic enzyme activity, leads to osmotic instability and bacterial cell lysis; excellent coverage against gram-positive organisms (Staphylococcus aureus, Streptococcus species) commonly involved in skin and soft tissue infections from barrier breaches",
        sideEffects: "GI upset (nausea, diarrhea, abdominal pain), hypersensitivity reactions (rash, urticaria, rare anaphylaxis), Clostridioides difficile-associated diarrhea, vaginal candidiasis (disruption of normal flora), elevated liver enzymes",
        contra: "Known severe hypersensitivity to cephalosporins; use with caution in patients with penicillin allergy (cross-reactivity approximately 1-2% with first-generation cephalosporins); dose adjustment required in renal impairment (CrCl <30 mL/min)",
        pearl: "First-line oral antibiotic for uncomplicated cellulitis and skin/soft tissue infections resulting from barrier breaches; take with food to reduce GI side effects; complete the full prescribed course even if symptoms improve to prevent resistance development; monitor for signs of superinfection (oral thrush, vaginal candidiasis) especially with prolonged courses"
      },
      {
        name: "Filgrastim (Neupogen)",
        type: "Granulocyte colony-stimulating factor (G-CSF)",
        action: "Recombinant human G-CSF that binds to specific receptors on neutrophil precursors in the bone marrow, stimulating proliferation, differentiation, and maturation of neutrophils; also enhances the functional activity of mature neutrophils including chemotaxis, phagocytosis, and oxidative burst capacity; reduces the duration and severity of chemotherapy-induced neutropenia by accelerating neutrophil recovery",
        sideEffects: "Bone pain (most common, 20-30% of patients -- caused by marrow expansion; managed with acetaminophen or NSAIDs), injection site reactions, splenomegaly (rare but can lead to splenic rupture), leukocytosis, elevated LDH and alkaline phosphatase",
        contra: "Known hypersensitivity to filgrastim or E. coli-derived proteins; do not administer within 24 hours before or after chemotherapy (stimulating rapidly dividing neutrophil precursors during chemotherapy may increase myelotoxicity); caution in patients with sickle cell disease (may precipitate sickle cell crisis)",
        pearl: "Administered subcutaneously (preferred for outpatient use) or intravenously; typical dose 5 mcg/kg/day starting 24-72 hours after last chemotherapy dose and continuing until absolute neutrophil count (ANC) recovers above 10,000/microL; monitor CBC with differential daily during therapy; instruct patients to report left upper quadrant or shoulder pain (may indicate splenic enlargement); store refrigerated, allow to reach room temperature before injection to reduce discomfort"
      }
    ],
    pearls: [
      "The skin is the single most important physical barrier -- meticulous skin integrity maintenance and wound care are among the most impactful nursing interventions for infection prevention",
      "Handwashing remains the single most effective infection prevention measure across all healthcare settings -- proper technique requires a minimum of 20 seconds with soap and water; alcohol-based hand rub is acceptable when hands are not visibly soiled",
      "Moderate fever (38-39C) actually SUPPORTS immune function by increasing phagocytic activity, enhancing interferon production, and inhibiting pathogen replication -- aggressive antipyretic therapy is not always appropriate and should be guided by patient symptoms and clinical status",
      "A 'left shift' on the CBC differential (bands >6%) indicates the bone marrow is releasing immature neutrophils to meet infectious demand -- this is a significant clinical finding that should be reported promptly as it suggests acute bacterial infection",
      "Patients on proton pump inhibitors lose the gastric acid barrier (pH rises from 1.5-3.5 to 4-6), increasing susceptibility to enteric infections including Clostridioides difficile and Salmonella -- this is a medication side effect with direct immune implications",
      "The mucociliary escalator in the respiratory tract is paralyzed by smoking, general anesthesia, and anticholinergic medications -- postoperative patients and smokers require aggressive pulmonary hygiene (incentive spirometry, deep breathing, early ambulation) to compensate",
      "Neutropenia (ANC <1500) is defined by absolute neutrophil count, not total WBC -- calculate ANC by multiplying total WBC by the percentage of neutrophils plus bands; an ANC below 500 places the patient at severe infection risk requiring neutropenic precautions"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a postoperative patient who develops a temperature of 38.3C (100.9F) on postoperative day one. The patient has no other signs of infection and reports feeling comfortable. What is the most appropriate initial nursing action?",
        options: [
          "Administer acetaminophen 1000mg immediately to normalize the temperature",
          "Obtain blood cultures from two separate sites",
          "Document the finding, continue monitoring vital signs, and report to the physician",
          "Apply cooling blankets to reduce the fever quickly"
        ],
        correct: 2,
        rationale: "A low-grade fever on postoperative day one is often a normal inflammatory response to surgical tissue injury and may not require immediate aggressive treatment. Moderate fever supports immune function by enhancing phagocytosis and interferon production. The appropriate action is to document the finding, continue monitoring, and report to the physician for clinical decision-making. Aggressive antipyretic therapy is not indicated for a comfortable patient with a low-grade fever."
      },
      {
        question: "Which laboratory finding most specifically indicates an acute bacterial infection activating the innate immune response?",
        options: [
          "Elevated erythrocyte sedimentation rate (ESR)",
          "Elevated C-reactive protein (CRP)",
          "WBC of 18,000/microL with 15% bands (left shift)",
          "Elevated lymphocyte count"
        ],
        correct: 2,
        rationale: "An elevated WBC with increased bands (left shift) is the most specific indicator of acute bacterial infection among the options. Bands are immature neutrophils released prematurely from bone marrow in response to acute bacterial demand. ESR and CRP are elevated in any inflammatory state (infection, autoimmune disease, tissue injury) and are less specific. Elevated lymphocytes are more characteristic of viral infections or chronic conditions."
      },
      {
        question: "A patient with chronic obstructive pulmonary disease (COPD) who smokes is admitted with pneumonia. Which innate immune defense mechanism is MOST impaired by the patient's smoking history?",
        options: [
          "Gastric acid barrier in the stomach",
          "Complement system activation in the blood",
          "Mucociliary escalator in the respiratory tract",
          "Natural killer cell activity against virus-infected cells"
        ],
        correct: 2,
        rationale: "Smoking directly damages the mucociliary escalator, the primary innate defense mechanism of the respiratory tract. Cigarette smoke paralyzes cilia, damages ciliated epithelial cells, causes goblet cell hyperplasia with excess mucus production, and impairs alveolar macrophage function. This combination creates an environment where inhaled pathogens cannot be effectively cleared, significantly increasing susceptibility to respiratory infections including pneumonia."
      }
    ]
  },

  "hormonal-regulation": {
    title: "Mechanisms of Hormonal Regulation",
    cellular: {
      title: "Pathophysiology of Hormonal Regulation and Endocrine Feedback Mechanisms",
      content: "Hormonal regulation is the process by which the endocrine system maintains homeostasis through the secretion of chemical messengers (hormones) into the bloodstream. Hormones are produced by specialized endocrine glands and travel through the circulation to act on distant target cells that express specific receptors for that hormone. Understanding hormonal regulation is fundamental to nursing practice because disruptions in endocrine function affect virtually every organ system and are among the most common chronic conditions encountered in clinical practice. Hormones are classified into three major chemical categories based on their molecular structure, which determines how they are transported, how they interact with target cells, and their duration of action. Peptide/protein hormones (including insulin, growth hormone, antidiuretic hormone, oxytocin, parathyroid hormone, and calcitonin) are water-soluble, circulate freely in plasma, have a short half-life (minutes), cannot cross cell membranes, and must bind to receptors on the cell surface. These surface receptors activate intracellular second messenger systems (primarily cyclic AMP/cAMP, inositol triphosphate/IP3, or calcium ion cascades) that amplify the hormonal signal inside the cell. Because they use pre-formed second messenger pathways, peptide hormones typically produce rapid but short-lived effects. Steroid hormones (including cortisol, aldosterone, estrogen, progesterone, and testosterone) are derived from cholesterol, are lipid-soluble, require carrier proteins for transport in blood (such as cortisol-binding globulin, sex hormone-binding globulin, and albumin), have a longer half-life (hours to days), and CAN cross cell membranes directly. They bind to intracellular receptors (typically in the cytoplasm or nucleus), forming hormone-receptor complexes that act as transcription factors, binding to specific DNA sequences and altering gene expression. Because they modify protein synthesis at the genetic level, steroid hormones produce slower-onset but longer-lasting effects. Amine hormones (including thyroid hormones T3/T4, epinephrine, norepinephrine, and dopamine) are derived from amino acids (tyrosine or tryptophan). Catecholamines (epinephrine and norepinephrine) are water-soluble and behave like peptide hormones (surface receptors, second messengers, rapid effects). Thyroid hormones are unique: despite being amine-derived, they are lipid-soluble and behave more like steroid hormones (crossing cell membranes, binding nuclear receptors, modifying gene expression). The hypothalamic-pituitary axis serves as the master control center of the endocrine system. The hypothalamus, located at the base of the brain, integrates neural and hormonal signals and releases regulatory hormones that control the anterior pituitary gland. These hypothalamic hormones travel through a specialized portal venous system (the hypothalamic-hypophyseal portal system) directly to the anterior pituitary, where they stimulate or inhibit the release of specific anterior pituitary hormones. The anterior pituitary (adenohypophysis) produces six major hormones: growth hormone (GH), thyroid-stimulating hormone (TSH), adrenocorticotropic hormone (ACTH), follicle-stimulating hormone (FSH), luteinizing hormone (LH), and prolactin (PRL). Each of these hormones targets a specific endocrine gland or tissue, which in turn produces its own hormones. The posterior pituitary (neurohypophysis) does not synthesize hormones but stores and releases two hormones produced by hypothalamic neurons: antidiuretic hormone (ADH/vasopressin, synthesized in supraoptic nuclei) and oxytocin (synthesized in paraventricular nuclei). These hormones travel down neuronal axons via the hypothalamic-hypophyseal tract and are released directly into the bloodstream from the posterior pituitary in response to neural stimulation. The negative feedback mechanism is the primary regulatory system controlling hormone levels and is essential for maintaining homeostasis. In a typical negative feedback loop, the hypothalamus releases a stimulating hormone (e.g., thyrotropin-releasing hormone/TRH), which stimulates the anterior pituitary to release a tropic hormone (e.g., TSH), which stimulates the target endocrine gland (e.g., thyroid) to produce its hormone (e.g., T3/T4). When circulating levels of the end hormone (T3/T4) rise to adequate levels, they feed back to both the hypothalamus and anterior pituitary to suppress further release of TRH and TSH, thereby reducing thyroid hormone production. When levels fall, the inhibition is released and the cycle restarts. This feedback mechanism operates continuously, maintaining hormone levels within a narrow physiological range. Disruption at any level of the feedback loop produces characteristic patterns that help clinicians localize the problem: primary disorders affect the target endocrine gland itself (e.g., primary hypothyroidism: thyroid gland failure produces low T3/T4 with compensatory HIGH TSH because the pituitary is trying harder to stimulate the failing gland); secondary disorders affect the pituitary (e.g., secondary hypothyroidism: pituitary failure produces low TSH leading to low T3/T4); tertiary disorders affect the hypothalamus (e.g., low TRH leading to low TSH and low T3/T4). Understanding this primary versus secondary distinction is critical for interpreting endocrine laboratory results and guiding treatment. Positive feedback mechanisms are rare in endocrinology but occur in specific physiological situations where amplification rather than homeostatic balance is needed. The most clinically significant examples include the LH surge in ovulation (rising estrogen levels stimulate rather than inhibit LH release from the pituitary, creating a rapid spike that triggers ovulation) and oxytocin during labor (uterine contractions stimulate oxytocin release, which stimulates stronger contractions, which stimulate more oxytocin, until delivery terminates the cycle). Hormone secretion patterns also influence clinical assessment and treatment timing. Circadian rhythms affect cortisol (highest at 6-8 AM, lowest at midnight -- cortisol levels must be drawn at specific times for accurate interpretation), growth hormone (primarily secreted during deep sleep stages 3-4), and melatonin (highest at night). Pulsatile secretion affects gonadotropins (FSH, LH) and growth hormone (released in bursts rather than continuously). Ultradian rhythms (cycles shorter than 24 hours) affect insulin (secreted in pulses every 5-15 minutes with larger boluses triggered by meals). The practical nurse must understand these patterns because they affect when laboratory specimens should be drawn, when medications should be administered, and how to interpret results. Hormonal permissiveness is the concept that some hormones require the presence of another hormone to exert their full effect. For example, thyroid hormones are permissive for the cardiovascular effects of catecholamines: in hyperthyroidism, the normal amount of catecholamines produces exaggerated cardiovascular effects (tachycardia, palpitations, hypertension) because excess thyroid hormone upregulates beta-adrenergic receptors on cardiac cells. This is why beta-blockers (propranolol) are given to manage symptoms while treating the underlying thyroid disorder. Similarly, cortisol is permissive for the vasoconstrictive effects of catecholamines on blood vessels -- in adrenal insufficiency (cortisol deficiency), patients develop profound hypotension partly because blood vessels cannot respond normally to catecholamines without adequate cortisol."
    },
    riskFactors: [
      "Autoimmune destruction of endocrine glands (Hashimoto thyroiditis, Graves disease, type 1 diabetes, Addison disease -- most common cause of endocrine disorders in developed countries)",
      "Pituitary adenomas or other tumors affecting hormone-producing glands (can cause hormone excess from oversecretion or deficiency from mass effect compression)",
      "Surgical removal or radiation of endocrine glands (thyroidectomy, adrenalectomy, hypophysectomy -- requires lifelong hormone replacement)",
      "Medications that affect hormonal regulation (corticosteroids suppress HPA axis, lithium affects thyroid, opioids suppress gonadotropins, dopamine agonists suppress prolactin)",
      "Iodine deficiency or excess (affects thyroid hormone synthesis -- deficiency causes goiter/hypothyroidism; excess can cause Wolff-Chaikoff effect or Jod-Basedow phenomenon)",
      "Genetic mutations affecting hormone receptors or signaling pathways (congenital adrenal hyperplasia, familial hypocalciuric hypercalcemia, pseudohypoparathyroidism)",
      "Aging-related decline in endocrine function (decreased growth hormone secretion, menopause/andropause, decreased vitamin D activation, reduced insulin sensitivity)"
    ],
    diagnostics: [
      "Serum hormone level measurement (draw at appropriate times considering circadian rhythms: cortisol at 8 AM, growth hormone provocative testing due to pulsatile secretion)",
      "Tropic hormone assessment to localize disorder level (TSH for thyroid axis, ACTH for adrenal axis, FSH/LH for gonadal axis -- compare tropic hormone level with target gland hormone level)",
      "Stimulation tests when deficiency is suspected (ACTH stimulation test for adrenal insufficiency, insulin tolerance test for growth hormone deficiency, TRH stimulation test for TSH deficiency)",
      "Suppression tests when excess is suspected (dexamethasone suppression test for Cushing syndrome, oral glucose tolerance test for acromegaly, saline infusion test for primary aldosteronism)",
      "Thyroid function panel (TSH with reflex free T4 and free T3 -- TSH is the most sensitive screening test for thyroid dysfunction)",
      "24-hour urine collections for hormone metabolites (24-hour urine free cortisol, urinary catecholamines and metanephrines, urinary calcium)",
      "Imaging studies (MRI of pituitary/sella turcica, thyroid ultrasound, CT of adrenal glands, nuclear medicine scans for functional assessment)"
    ],
    management: [
      "Hormone replacement therapy for deficiency states (levothyroxine for hypothyroidism, hydrocortisone for adrenal insufficiency, insulin for diabetes, estrogen/progesterone for menopause)",
      "Hormone suppression or ablation for excess states (antithyroid drugs for hyperthyroidism, somatostatin analogues for acromegaly, surgical removal of hormone-producing tumors)",
      "Monitor laboratory values at appropriate intervals to guide dose adjustment (TSH every 6-8 weeks after levothyroxine dose changes, HbA1c every 3 months for diabetes management)",
      "Patient education regarding lifelong medication requirements, signs of over-replacement versus under-replacement, and sick-day management rules",
      "Coordinate with endocrinology for complex multi-hormone disorders and specialized testing",
      "Stress dose management for patients on chronic corticosteroids or with known adrenal insufficiency (double or triple dose during illness, surgery, or physiological stress)"
    ],
    nursingActions: [
      "Ensure laboratory specimens are drawn at appropriate times based on hormone circadian rhythms (cortisol at 8 AM, fasting glucose in morning, TSH any time of day)",
      "Monitor vital signs for signs of endocrine dysfunction (tachycardia/bradycardia with thyroid disorders, hypertension with Cushing syndrome or pheochromocytoma, orthostatic hypotension with adrenal insufficiency)",
      "Assess for clinical signs of hormone excess or deficiency (weight changes, skin changes, energy levels, menstrual irregularities, temperature intolerance)",
      "Administer hormone replacement medications according to correct timing and route (levothyroxine on empty stomach 30-60 minutes before breakfast, insulin per sliding scale or carb counting)",
      "Educate patients about medication interactions that affect hormonal therapy (calcium and iron supplements reduce levothyroxine absorption, phenytoin increases thyroid hormone metabolism)",
      "Monitor for signs of endocrine emergencies (thyroid storm, myxedema coma, adrenal crisis, diabetic ketoacidosis, hyperosmolar hyperglycemic state)",
      "Assess and document daily weights, intake and output, blood glucose trends, and vital sign patterns to identify developing endocrine abnormalities",
      "Ensure patients with adrenal insufficiency or chronic steroid use have medical alert identification and understand stress-dose protocols"
    ],
    assessmentFindings: [
      "Vital sign patterns indicating endocrine dysfunction (resting tachycardia with hyperthyroidism, bradycardia with hypothyroidism, hypertension with Cushing syndrome)",
      "Weight changes (unexplained weight gain with hypothyroidism or Cushing syndrome, weight loss with hyperthyroidism or Addison disease)",
      "Skin and integumentary changes (dry coarse skin with hypothyroidism, warm moist skin with hyperthyroidism, hyperpigmentation with Addison disease, striae with Cushing syndrome)",
      "Temperature intolerance (cold intolerance with hypothyroidism, heat intolerance with hyperthyroidism)",
      "Altered energy levels and mental status (fatigue and depression with hypothyroidism, anxiety and agitation with hyperthyroidism)",
      "Abnormal laboratory values in characteristic patterns (high TSH/low T4 in primary hypothyroidism, low TSH/high T4 in hyperthyroidism)",
      "Growth abnormalities (gigantism in children or acromegaly in adults from growth hormone excess, short stature from growth hormone deficiency)"
    ],
    signs: {
      left: [
        "Subtle fatigue or energy level changes",
        "Mild weight fluctuation (gain or loss)",
        "Temperature intolerance (feeling cold or warm)",
        "Mood changes (irritability, mild depression)",
        "Menstrual irregularities in women"
      ],
      right: [
        "Thyroid storm (fever >40C, extreme tachycardia, delirium)",
        "Adrenal crisis (severe hypotension, hyponatremia, hyperkalemia)",
        "Myxedema coma (hypothermia, bradycardia, altered consciousness)",
        "Diabetic ketoacidosis (Kussmaul breathing, fruity breath, dehydration)",
        "Pheochromocytoma crisis (severe hypertension, pounding headache, diaphoresis)"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic thyroid hormone replacement (T4)",
        action: "Synthetic form of thyroxine (T4) that is converted to the active form triiodothyronine (T3) by deiodinase enzymes in peripheral tissues; T3 enters target cell nuclei, binds to thyroid hormone receptors, and modulates gene expression affecting metabolism, protein synthesis, growth, and development in virtually every tissue; restores normal metabolic rate, cardiac function, neurological function, and growth in hypothyroid patients",
        sideEffects: "Signs of over-replacement mimic hyperthyroidism: tachycardia, palpitations, tremor, weight loss, heat intolerance, diarrhea, insomnia, anxiety, osteoporosis with prolonged excessive dosing, atrial fibrillation in elderly patients",
        contra: "Uncorrected adrenal insufficiency (thyroid hormone replacement increases cortisol metabolism and can precipitate adrenal crisis -- always replace cortisol BEFORE starting levothyroxine); acute myocardial infarction; thyrotoxicosis",
        pearl: "Take on empty stomach 30-60 minutes before breakfast or at bedtime (at least 3 hours after last meal) for consistent absorption; separate from calcium, iron, antacids, and proton pump inhibitors by at least 4 hours (these reduce absorption by 20-40%); TSH is the primary monitoring parameter -- check 6-8 weeks after any dose change; start low and go slow in elderly patients and those with cardiac disease (12.5-25 mcg initially) to avoid cardiac complications"
      },
      {
        name: "Hydrocortisone (Cortef)",
        type: "Glucocorticoid replacement (synthetic cortisol)",
        action: "Synthetic form of cortisol that replaces deficient endogenous glucocorticoid; binds to intracellular glucocorticoid receptors, modulating gene expression to maintain glucose homeostasis (stimulates gluconeogenesis and glycogenolysis), support cardiovascular function (permissive effect on catecholamine vasoconstriction), suppress excessive inflammatory and immune responses, and maintain stress response capability; at physiologic replacement doses, provides both glucocorticoid and some mineralocorticoid activity",
        sideEffects: "At replacement doses: minimal; at supraphysiologic doses or with chronic use: weight gain, moon facies, buffalo hump, central obesity, glucose intolerance/diabetes, osteoporosis, thin fragile skin, delayed wound healing, immunosuppression, cataracts, glaucoma, mood disturbances, adrenal suppression",
        contra: "Systemic fungal infections (at supraphysiologic doses); no absolute contraindications for replacement therapy in confirmed adrenal insufficiency; use lowest effective dose",
        pearl: "Divide daily dose to mimic normal circadian cortisol rhythm: two-thirds of dose in the morning on waking (largest dose), one-third in early afternoon; NEVER take at bedtime as this disrupts the natural cortisol nadir and impairs sleep; CRITICAL: during physiological stress (fever, illness, surgery, trauma), dose must be doubled or tripled immediately (stress dosing) -- patients must carry emergency injection kit and medical alert identification; for adrenal crisis: 100mg IV hydrocortisone stat, then 50mg every 6-8 hours"
      },
      {
        name: "Propranolol (Inderal)",
        type: "Non-selective beta-adrenergic blocker",
        action: "Blocks both beta-1 (cardiac) and beta-2 (vascular, bronchial, metabolic) adrenergic receptors; in the context of endocrine disorders, particularly important for managing the cardiovascular effects of thyroid hormone excess -- excess T3/T4 upregulates beta-adrenergic receptors on cardiac cells (permissive effect), causing exaggerated sympathetic responses; propranolol controls tachycardia, palpitations, tremor, and anxiety; additionally inhibits peripheral conversion of T4 to T3 by deiodinase enzymes, providing some direct thyroid hormone reduction",
        sideEffects: "Bradycardia, hypotension, fatigue, dizziness, bronchospasm (due to beta-2 blockade), masking of hypoglycemia symptoms (tachycardia), cold extremities, depression, vivid dreams, sexual dysfunction",
        contra: "Asthma or severe reactive airway disease (beta-2 blockade causes bronchospasm); decompensated heart failure; second or third-degree heart block; severe bradycardia (<50 bpm); pheochromocytoma (without prior alpha-blockade -- unopposed alpha stimulation can cause hypertensive crisis)",
        pearl: "In thyroid storm, propranolol is first-line for cardiovascular symptom control while definitive antithyroid treatment takes effect; unique among beta-blockers in also blocking T4-to-T3 conversion; must NEVER be used in pheochromocytoma without first establishing alpha-blockade (phenoxybenzamine) -- blocking beta-receptors alone allows unopposed alpha-mediated vasoconstriction causing severe hypertension; when discontinuing after chronic use, taper gradually over 1-2 weeks to avoid rebound tachycardia and hypertension"
      }
    ],
    pearls: [
      "The pattern of tropic hormone versus target hormone levels localizes the endocrine disorder: high tropic hormone + low target hormone = primary gland failure (e.g., high TSH + low T4 = primary hypothyroidism); low tropic hormone + low target hormone = secondary/pituitary failure",
      "Always correct adrenal insufficiency BEFORE starting thyroid hormone replacement -- levothyroxine increases cortisol metabolism, and initiating it in a cortisol-deficient patient can precipitate life-threatening adrenal crisis",
      "Cortisol levels must be drawn at 8 AM for accurate interpretation due to circadian rhythm -- a 'normal' cortisol level drawn at midnight is actually abnormally elevated and suggests Cushing syndrome",
      "Thyroid storm and myxedema coma are endocrine emergencies with high mortality rates -- recognize the cardinal signs: thyroid storm presents with fever >40C, extreme tachycardia, agitation/delirium; myxedema coma presents with hypothermia, bradycardia, altered mental status",
      "Patients on chronic corticosteroids develop HPA axis suppression and CANNOT mount an appropriate stress response -- they require stress-dose steroids during illness, surgery, or trauma; abrupt discontinuation can cause fatal adrenal crisis",
      "The concept of hormonal permissiveness explains why hyperthyroid patients have exaggerated sympathetic responses -- thyroid hormones upregulate cardiac beta-receptors, making the heart more responsive to normal catecholamine levels; this is why beta-blockers are first-line symptom management",
      "Negative feedback is the dominant regulatory mechanism in endocrinology -- disruption at any level (hypothalamus, pituitary, or target gland) produces predictable and interpretable laboratory patterns that guide diagnosis and treatment"
    ],
    quiz: [
      {
        question: "A patient with known Addison disease (primary adrenal insufficiency) is being started on levothyroxine for newly diagnosed hypothyroidism. Which nursing action is MOST important before initiating levothyroxine therapy?",
        options: [
          "Obtain a baseline ECG to monitor for cardiac effects",
          "Ensure adequate cortisol replacement is established and stable before starting levothyroxine",
          "Schedule a follow-up TSH level for 2 weeks after starting therapy",
          "Educate the patient to take levothyroxine with food to improve absorption"
        ],
        correct: 1,
        rationale: "It is essential to ensure adequate cortisol replacement before starting levothyroxine because thyroid hormones increase cortisol metabolism. In a patient with adrenal insufficiency who is not adequately replaced with cortisol, starting levothyroxine can accelerate cortisol clearance and precipitate a life-threatening adrenal crisis. The cortisol replacement must be stable before thyroid hormone replacement begins."
      },
      {
        question: "A patient's laboratory results show: TSH 0.1 mIU/L (low), Free T4 3.8 ng/dL (high), Free T3 8.2 pg/mL (high). These results are consistent with which condition?",
        options: [
          "Primary hypothyroidism",
          "Secondary hypothyroidism",
          "Hyperthyroidism (primary)",
          "Pituitary TSH-secreting adenoma"
        ],
        correct: 2,
        rationale: "Low TSH with elevated T4 and T3 indicates primary hyperthyroidism. The thyroid gland is overproducing thyroid hormones, and the elevated T4/T3 levels are feeding back to suppress TSH secretion through the negative feedback mechanism. In primary hypothyroidism, TSH would be high with low T4/T3. In secondary hypothyroidism, both TSH and T4/T3 would be low. A TSH-secreting pituitary adenoma would show high TSH with high T4/T3 (inappropriate TSH elevation)."
      },
      {
        question: "A practical nurse is preparing to draw blood for a cortisol level on a patient being evaluated for Cushing syndrome. When should the specimen be drawn for the most diagnostically useful result?",
        options: [
          "Early morning (8 AM) when cortisol should be at its highest",
          "Late evening (11 PM-midnight) when cortisol should be at its lowest",
          "Immediately after the patient eats breakfast",
          "Any time of day since cortisol levels remain constant"
        ],
        correct: 1,
        rationale: "For evaluating Cushing syndrome (cortisol excess), a late-evening or midnight cortisol level is most diagnostically useful because cortisol should normally be at its lowest point (nadir) at midnight due to circadian rhythm. In Cushing syndrome, the normal diurnal variation is lost, and midnight cortisol levels remain inappropriately elevated. An elevated midnight cortisol is one of the screening tests for Cushing syndrome. Morning cortisol is useful for diagnosing adrenal insufficiency, not excess."
      }
    ]
  },

  "adaptive-immunity": {
    title: "Adaptive Immunity",
    cellular: {
      title: "Pathophysiology of Adaptive (Acquired) Immunity",
      content: "Adaptive immunity (also called acquired or specific immunity) is the third line of defense that develops after exposure to specific antigens and provides targeted, long-lasting protection against particular pathogens. Unlike innate immunity, which responds identically to all threats, adaptive immunity is characterized by four hallmark features: specificity (each immune response targets a particular antigen through unique receptor recognition), diversity (the immune system can recognize virtually unlimited different antigens -- estimated at 10 to the 9th to 10 to the 11th different specificities), memory (following initial exposure, the immune system retains the ability to mount a faster, stronger response upon re-exposure -- the basis for vaccination), and self/non-self discrimination (the ability to distinguish the body's own molecules from foreign antigens, preventing autoimmune destruction of healthy tissues). Adaptive immunity is mediated by two types of lymphocytes: T lymphocytes (T cells) and B lymphocytes (B cells). Both originate from pluripotent hematopoietic stem cells in the bone marrow, but their maturation pathways differ fundamentally. B cells mature in the bone marrow, where they undergo V(D)J recombination to generate unique B cell receptors (BCRs, which are membrane-bound immunoglobulin molecules) capable of recognizing specific antigens. T cells, by contrast, migrate from the bone marrow to the thymus for maturation (the 'T' in T cell stands for thymus). In the thymus, T cells undergo two critical selection processes: positive selection (T cells that can moderately bind self-MHC molecules on thymic epithelial cells survive -- those that cannot are eliminated by apoptosis) and negative selection (T cells that bind self-MHC/self-antigen complexes TOO strongly are eliminated to prevent autoimmunity). This dual selection process ensures that mature T cells can interact with MHC molecules (necessary for function) but will not attack the body's own tissues (self-tolerance). Approximately 95-98% of developing T cells fail these selection processes and are eliminated -- only 2-5% survive to become mature, functional T cells. T cell-mediated immunity (cellular immunity) is carried out by two major T cell subtypes. Cytotoxic T cells (CD8+ T cells, also called killer T cells) directly destroy cells that display foreign antigens on their surface through MHC class I molecules. MHC class I molecules are expressed on the surface of ALL nucleated cells in the body and display fragments of proteins being produced inside the cell. When a cell is infected by a virus, viral proteins are processed and displayed on MHC I molecules, essentially 'advertising' the infection to passing CD8+ T cells. The cytotoxic T cell recognizes the foreign peptide/MHC I complex through its T cell receptor (TCR), becomes activated, and kills the infected cell through release of perforin (creates pores in the target cell membrane) and granzymes (enter through the pores and activate caspase cascades triggering apoptosis). This mechanism is critical for clearing intracellular pathogens (viruses, intracellular bacteria like Mycobacterium tuberculosis) and eliminating cancer cells. Helper T cells (CD4+ T cells) are the coordinators of the adaptive immune response. They recognize antigens presented by antigen-presenting cells (APCs) -- dendritic cells, macrophages, and B cells -- through MHC class II molecules. MHC class II molecules are expressed ONLY on APCs (not on all nucleated cells like MHC I) and display fragments of antigens that have been engulfed and processed from the extracellular environment. Upon activation, helper T cells differentiate into several functional subsets: Th1 cells (produce interferon-gamma and IL-2, promoting macrophage activation and cytotoxic T cell responses -- crucial for intracellular pathogen defense), Th2 cells (produce IL-4, IL-5, IL-10, and IL-13, promoting B cell differentiation, antibody production, and eosinophil recruitment -- crucial for parasitic defense and involved in allergic responses), Th17 cells (produce IL-17 and IL-22, recruiting neutrophils to sites of infection -- important for defense against extracellular bacteria and fungi), and regulatory T cells (Tregs, produce IL-10 and TGF-beta, suppressing immune responses to maintain self-tolerance and prevent autoimmunity). Humoral immunity (antibody-mediated immunity) is carried out by B cells and their differentiated form, plasma cells. When a B cell encounters an antigen that matches its BCR, it internalizes the antigen, processes it, and presents it on MHC II molecules to helper T cells. The helper T cell provides co-stimulatory signals (CD40 ligand binding to CD40 on the B cell) and cytokines that stimulate the B cell to proliferate and differentiate into either plasma cells (antibody-secreting factories that produce thousands of antibody molecules per second) or memory B cells (long-lived cells that persist for years to decades, providing rapid response upon re-exposure). There are five classes (isotypes) of immunoglobulins, each with specific functions: IgG is the most abundant antibody in serum (75-80%), the only immunoglobulin that crosses the placenta (providing passive immunity to the fetus), and the primary antibody of the secondary immune response; IgM is the largest antibody (pentamer structure), the first antibody produced during a primary immune response (its presence indicates recent or current infection), and the most efficient complement activator; IgA is found primarily in mucosal secretions (saliva, tears, breast milk, GI and respiratory secretions) and provides mucosal immunity -- in breast milk, it provides passive mucosal immunity to nursing infants; IgE is present in very low serum concentrations but plays a critical role in allergic reactions (binds to mast cells and basophils, causing degranulation and release of histamine, leukotrienes, and prostaglandins upon antigen cross-linking) and parasitic defense; IgD is found primarily on the surface of mature B cells as part of the BCR complex and plays a role in B cell activation. The primary immune response occurs upon first exposure to an antigen and follows a characteristic pattern: a lag phase of 5-10 days (during which antigen processing, T and B cell activation, and clonal expansion occur), followed by production of predominantly IgM antibodies, then isotype switching to IgG. The secondary immune response (upon re-exposure) is faster (1-3 days due to activation of memory cells), stronger (10 to 100 times higher antibody levels), longer-lasting, and dominated by IgG antibodies with higher affinity for the antigen (due to affinity maturation in germinal centers). This difference between primary and secondary responses is the immunological basis for vaccination: the vaccine provides a safe initial antigen exposure that primes the immune system, so that upon encountering the actual pathogen, the rapid and robust secondary response prevents disease. Active immunity refers to immune protection developed through the person's own immune response -- either naturally (through infection) or artificially (through vaccination). Active immunity takes time to develop but provides long-lasting (often lifelong) protection due to memory cell formation. Passive immunity refers to immune protection acquired by receiving pre-formed antibodies from an external source -- either naturally (maternal IgG crossing the placenta, IgA in breast milk) or artificially (injection of immune globulin preparations such as hepatitis B immune globulin or tetanus immune globulin). Passive immunity provides immediate but temporary protection (weeks to a few months) because the transferred antibodies are gradually catabolized without new production."
    },
    riskFactors: [
      "Primary immunodeficiency disorders (X-linked agammaglobulinemia, severe combined immunodeficiency/SCID, DiGeorge syndrome -- congenital defects in B cell, T cell, or combined immune development)",
      "HIV/AIDS (progressive CD4+ T cell destruction by HIV leads to loss of immune coordination, opportunistic infections, and malignancies)",
      "Immunosuppressive medications (corticosteroids, calcineurin inhibitors like tacrolimus and cyclosporine, antimetabolites like mycophenolate and azathioprine -- all impair T and B cell function)",
      "Chemotherapy and radiation therapy (destroy rapidly dividing lymphocytes along with cancer cells, causing profound immunosuppression)",
      "Extremes of age (neonates have immature adaptive immunity relying primarily on passive maternal antibodies; elderly have immunosenescence with decreased naive T cell production and impaired vaccine responses)",
      "Malnutrition (protein-calorie malnutrition impairs lymphocyte proliferation, antibody production, and cytokine signaling)",
      "Asplenia (surgical or functional, as in sickle cell disease -- the spleen is crucial for filtering encapsulated bacteria and producing opsonizing antibodies; asplenic patients are at high risk for overwhelming post-splenectomy infection/OPSI from Streptococcus pneumoniae, Neisseria meningitidis, and Haemophilus influenzae)"
    ],
    diagnostics: [
      "Complete blood count with differential (lymphocyte count -- lymphopenia <1000/microL suggests impaired adaptive immunity; CD4 count monitors HIV disease progression)",
      "Immunoglobulin levels (serum IgG, IgA, IgM -- decreased levels indicate humoral immunodeficiency; IgE levels elevated in allergic conditions and parasitic infections)",
      "Specific antibody titers (measure immune response to previous infections or vaccinations -- inability to produce adequate titers after vaccination suggests immunodeficiency)",
      "Flow cytometry for lymphocyte subsets (CD4+ and CD8+ T cell counts, B cell counts, NK cell counts -- essential for diagnosing and monitoring immunodeficiency states)",
      "Tuberculin skin test or interferon-gamma release assay (IGRA) -- tests T cell-mediated immunity to Mycobacterium tuberculosis antigens; anergy (failure to respond) may indicate impaired cellular immunity",
      "Serology (detect IgM for acute/recent infection, IgG for past infection or immunity -- IgM-to-IgG transition helps determine timing of infection)",
      "HIV testing (antibody/antigen combination test, confirmatory testing, CD4 count, and viral load for staging and treatment monitoring)"
    ],
    management: [
      "Immunoglobulin replacement therapy for humoral immunodeficiency (IVIG every 3-4 weeks or subcutaneous IG weekly to maintain IgG levels >500 mg/dL)",
      "Antiretroviral therapy (ART) for HIV -- multi-drug regimens that suppress viral replication, allow CD4 count recovery, and restore immune function",
      "Vaccination according to recommended schedules (live vaccines contraindicated in immunocompromised patients; inactivated vaccines may have reduced efficacy but are safe)",
      "Prophylactic antimicrobials for high-risk immunocompromised patients (TMP-SMX for Pneumocystis jirovecii prophylaxis when CD4 <200, penicillin prophylaxis for asplenic patients)",
      "Hematopoietic stem cell transplantation for severe primary immunodeficiency disorders (SCID, Wiskott-Aldrich syndrome)",
      "Minimize immunosuppressive medications to lowest effective doses when possible and monitor for infection complications"
    ],
    nursingActions: [
      "Implement strict infection prevention measures for immunocompromised patients (private room, hand hygiene, dietary restrictions for neutropenic patients, limit visitors with active infections)",
      "Monitor absolute lymphocyte count and CD4 count trends -- report declining values promptly as they indicate worsening immunodeficiency",
      "Administer immunoglobulin infusions according to protocol (monitor for infusion reactions: headache, chills, nausea, hypotension, anaphylaxis; start slowly and increase rate as tolerated)",
      "Assess vaccination status and ensure recommended immunizations are current (educate patients about which vaccines are safe and which are contraindicated based on immune status)",
      "Educate patients about signs and symptoms of infection that require immediate medical attention (fever, cough, diarrhea, skin lesions, mouth sores)",
      "Monitor for and report signs of opportunistic infections in immunocompromised patients (oral thrush, pneumonia, unusual skin lesions, persistent diarrhea)",
      "Document and report any allergic reactions or adverse immune responses (rash, urticaria, anaphylaxis) and maintain emergency equipment at bedside during immunoglobulin infusions",
      "Educate organ transplant recipients about the lifelong need for immunosuppressive medications and the importance of adherence to prevent rejection while monitoring for infection"
    ],
    assessmentFindings: [
      "Recurrent, severe, or unusual infections (suggests immunodeficiency -- frequency, severity, and type of infection help localize the immune defect)",
      "Lymphadenopathy (enlarged lymph nodes may indicate active immune response, lymphoma, or HIV infection)",
      "Oral thrush or esophageal candidiasis (suggests T cell deficiency, particularly CD4 depletion in HIV)",
      "Failure to thrive in infants (may indicate primary immunodeficiency with chronic infections)",
      "Absent or small tonsils/lymph nodes (suggests X-linked agammaglobulinemia or other B cell deficiency)",
      "Laboratory evidence: lymphopenia, decreased immunoglobulin levels, low CD4 count, absent antibody response to vaccination",
      "Allergic manifestations (urticaria, angioedema, anaphylaxis -- indicate overactive IgE-mediated immune response)"
    ],
    signs: {
      left: [
        "Mild recurrent infections (upper respiratory, sinusitis, otitis)",
        "Delayed wound healing",
        "Mild lymphadenopathy",
        "Chronic fatigue",
        "Seasonal allergy symptoms (IgE-mediated)"
      ],
      right: [
        "Severe opportunistic infections (Pneumocystis, CMV, Toxoplasma)",
        "Overwhelming sepsis in asplenic patients",
        "Anaphylaxis (severe IgE-mediated systemic response)",
        "Graft rejection in transplant recipients",
        "Graft-versus-host disease after stem cell transplant"
      ]
    },
    medications: [
      {
        name: "Intravenous Immunoglobulin (IVIG)",
        type: "Immunoglobulin replacement therapy (pooled human IgG)",
        action: "Provides exogenous polyclonal IgG antibodies pooled from thousands of donors, replacing deficient immunoglobulin in patients with humoral immunodeficiency; at higher doses, modulates the immune system through multiple mechanisms including Fc receptor blockade (preventing autoantibody-mediated cell destruction in ITP), complement consumption, and anti-idiotype antibody effects; provides passive immunity against a broad range of common pathogens",
        sideEffects: "Infusion-related reactions (headache, chills, fever, nausea, flushing -- occur in 5-15% of infusions, usually with first or fast infusions), aseptic meningitis (severe headache within 48 hours), renal dysfunction (particularly with sucrose-containing formulations), thromboembolic events (stroke, MI, DVT -- due to increased blood viscosity), rare anaphylaxis in IgA-deficient patients with anti-IgA antibodies",
        contra: "Severe IgA deficiency with documented anti-IgA antibodies (risk of anaphylaxis -- use IgA-depleted preparations); uncompensated heart failure (fluid volume risk with IV infusion); known hypersensitivity to immunoglobulin products",
        pearl: "Premedicate with acetaminophen, diphenhydramine, and sometimes hydrocortisone to reduce infusion reactions; start infusion slowly (0.5 mL/kg/hr) and increase gradually every 15-30 minutes as tolerated to target rate; ensure adequate hydration before and during infusion to reduce renal toxicity risk; IVIG interferes with live vaccine responses -- wait at least 3 months after IVIG before administering live vaccines (MMR, varicella); monitor IgG trough levels to guide dosing"
      },
      {
        name: "Tacrolimus (Prograf)",
        type: "Calcineurin inhibitor (immunosuppressant)",
        action: "Binds to FK-binding protein (FKBP-12) in the cytoplasm of T lymphocytes, forming a complex that inhibits calcineurin, a calcium-dependent phosphatase essential for T cell activation; calcineurin normally dephosphorylates nuclear factor of activated T cells (NFAT), allowing it to enter the nucleus and activate transcription of IL-2 and other cytokines; by blocking this pathway, tacrolimus prevents IL-2 production, inhibiting T cell proliferation and differentiation; 10-100 times more potent than cyclosporine",
        sideEffects: "Nephrotoxicity (dose-limiting, causes afferent arteriolar vasoconstriction reducing GFR), neurotoxicity (tremor, headache, seizures, posterior reversible encephalopathy syndrome/PRES), hyperglycemia (new-onset diabetes after transplant/NODAT), hyperkalemia, hypomagnesemia, alopecia, GI disturbances, hypertension, increased infection risk, increased malignancy risk (particularly post-transplant lymphoproliferative disorder)",
        contra: "Known hypersensitivity; use with extreme caution in renal impairment; avoid concurrent use with cyclosporine (synergistic nephrotoxicity); caution with potassium-sparing diuretics (hyperkalemia risk)",
        pearl: "Requires therapeutic drug monitoring (trough levels drawn immediately before next dose) -- target ranges vary by organ transplanted and time post-transplant; metabolized by CYP3A4 and P-glycoprotein with extensive drug interactions (azole antifungals, macrolide antibiotics, and grapefruit juice INCREASE levels; rifampin, phenytoin, and St. John's wort DECREASE levels); monitor renal function, blood glucose, potassium, and magnesium regularly; patients must take consistently with or without food at the same times daily"
      },
      {
        name: "Epinephrine (EpiPen)",
        type: "Sympathomimetic (non-selective adrenergic agonist) for anaphylaxis",
        action: "Stimulates alpha-1 receptors (vasoconstriction, reversing hypotension and reducing mucosal edema including laryngeal edema), beta-1 receptors (increased heart rate and contractility, improving cardiac output), and beta-2 receptors (bronchodilation, relieving bronchospasm; stabilizes mast cell membranes, inhibiting further histamine and mediator release); directly counteracts the pathophysiology of anaphylaxis -- the most severe manifestation of IgE-mediated adaptive immune response",
        sideEffects: "Tachycardia, palpitations, anxiety, tremor, headache, hypertension, cardiac arrhythmias, nausea; at IM injection doses for anaphylaxis, side effects are generally transient and outweighed by life-saving benefit",
        contra: "NO absolute contraindications in true anaphylaxis -- epinephrine is the ONLY first-line treatment and must NEVER be withheld for any reason in a life-threatening anaphylactic reaction; relative cautions include coronary artery disease, uncontrolled hypertension, and concurrent MAO inhibitor or tricyclic antidepressant use",
        pearl: "Administer IM in the anterolateral thigh (vastus lateralis) for fastest absorption -- NOT subcutaneously or intravenously for initial treatment; dose: 0.3-0.5 mg of 1:1000 (1 mg/mL) concentration for adults, 0.01 mg/kg for children; may repeat every 5-15 minutes if symptoms persist; ALWAYS position patient supine with legs elevated (Trendelenburg) during anaphylaxis unless respiratory distress requires upright positioning; biphasic anaphylaxis can occur 4-12 hours after initial reaction -- observe patients for at least 4-6 hours after treatment; prescribe and educate on EpiPen use for patients with history of anaphylaxis"
      }
    ],
    pearls: [
      "IgM is the first antibody produced in a primary immune response -- detecting IgM antibodies in serum indicates ACUTE or RECENT infection; IgG antibodies indicate PAST infection or immunity; this IgM-to-IgG transition is the basis for serological diagnosis timing",
      "IgG is the ONLY immunoglobulin that crosses the placenta -- maternal IgG provides passive immunity to the newborn for approximately 3-6 months; this is why most vaccine schedules begin at 2 months of age when passive immunity begins to wane",
      "Live vaccines (MMR, varicella, rotavirus, intranasal influenza, BCG) are CONTRAINDICATED in immunocompromised patients because the attenuated organisms can cause actual disease in patients who cannot mount an appropriate immune response",
      "CD4+ T cell count is the primary marker of immune function in HIV -- CD4 count <200 cells/microL defines AIDS, indicates severe immunodeficiency, and triggers prophylaxis against Pneumocystis jirovecii pneumonia (TMP-SMX) and other opportunistic infections",
      "Anaphylaxis is the most severe clinical manifestation of adaptive immunity (IgE-mediated Type I hypersensitivity) -- epinephrine IM is the ONLY first-line treatment; never withhold epinephrine for anaphylaxis regardless of patient comorbidities; antihistamines and steroids are adjunctive only",
      "Asplenic patients (surgical splenectomy or functional asplenia as in sickle cell disease) are at lifelong risk for overwhelming post-splenectomy infection (OPSI) with encapsulated organisms -- they require vaccination against S. pneumoniae, N. meningitidis, and H. influenzae type b, plus daily penicillin prophylaxis in children",
      "The concept of active versus passive immunity has direct clinical applications: active immunity (vaccines) takes 1-2 weeks to develop but provides lasting protection; passive immunity (immune globulin) provides immediate protection but is temporary -- in post-exposure prophylaxis (hepatitis B, rabies, tetanus), BOTH are given simultaneously to different injection sites"
    ],
    quiz: [
      {
        question: "A patient presents with recurrent sinopulmonary infections since childhood and is found to have very low IgG, IgA, and IgM levels with absent B cells on flow cytometry. T cell numbers and function are normal. Which type of immunodeficiency does this pattern suggest?",
        options: [
          "HIV/AIDS (acquired T cell deficiency)",
          "X-linked agammaglobulinemia (primary B cell deficiency)",
          "DiGeorge syndrome (primary T cell deficiency)",
          "Common variable immunodeficiency (CVID)"
        ],
        correct: 1,
        rationale: "The pattern of absent B cells with very low immunoglobulin levels (panhypogammaglobulinemia) and normal T cell function in a patient with childhood onset is classic for X-linked agammaglobulinemia (Bruton disease). This primary immunodeficiency is caused by a mutation in Bruton tyrosine kinase (BTK) gene, preventing B cell maturation. CVID also causes hypogammaglobulinemia but typically has detectable B cells. DiGeorge syndrome affects T cells. HIV causes acquired T cell deficiency."
      },
      {
        question: "A practical nurse is caring for a patient receiving IVIG therapy for primary immunodeficiency. Thirty minutes into the infusion, the patient reports a severe headache, chills, and nausea. What is the MOST appropriate initial nursing action?",
        options: [
          "Discontinue the infusion permanently and discard remaining solution",
          "Slow or temporarily stop the infusion, assess vital signs, and administer prescribed premedications",
          "Increase the infusion rate to complete the therapy more quickly",
          "Administer epinephrine IM immediately for suspected anaphylaxis"
        ],
        correct: 1,
        rationale: "Headache, chills, and nausea are common rate-related infusion reactions during IVIG therapy (not anaphylaxis, which would present with hypotension, bronchospasm, urticaria, and angioedema). The appropriate response is to slow or temporarily stop the infusion, assess vital signs, administer prescribed premedications (acetaminophen, diphenhydramine), and resume at a slower rate once symptoms resolve. These reactions are usually manageable and do not require permanent discontinuation."
      },
      {
        question: "Which statement correctly describes the difference between active and passive immunity?",
        options: [
          "Active immunity provides immediate protection while passive immunity takes weeks to develop",
          "Active immunity involves receiving pre-formed antibodies from an external source",
          "Passive immunity provides temporary protection because the recipient does not produce memory cells against the antigen",
          "Passive immunity provides lifelong protection against specific pathogens"
        ],
        correct: 2,
        rationale: "Passive immunity provides immediate but TEMPORARY protection because the recipient receives pre-formed antibodies from an external source (immune globulin, maternal IgG) without activating their own immune system. Since no memory B or T cells are generated, the transferred antibodies are gradually catabolized over weeks to months and protection wanes. Active immunity (through infection or vaccination) takes longer to develop but provides lasting protection because the recipient's immune system generates its own antibodies AND memory cells."
      }
    ]
  }
};

let ok = 0;
let fail = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) ok++;
  else fail++;
}
console.log(`\nDone: ${ok} injected, ${fail} failed`);
