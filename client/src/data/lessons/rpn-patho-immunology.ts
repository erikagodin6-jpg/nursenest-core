import type { LessonContent } from "./types";

export const rpnPathoImmunologyLessons: Record<string, LessonContent> = {
  "rpn-sepsis": {
    title: "Sepsis and Septic Shock",
    cellular: {
      title: "Dysregulated Host Response to Infection",
      content: "Sepsis is defined as a life-threatening organ dysfunction caused by a dysregulated host response to infection (Sepsis-3 definition, 2016). It represents the body's own immune response causing more harm than the infection itself. The pathophysiology involves massive and uncontrolled activation of the innate immune system. When pathogen-associated molecular patterns (PAMPs — such as bacterial lipopolysaccharide/endotoxin from gram-negatives, lipoteichoic acid from gram-positives, or fungal cell wall components) bind to pattern recognition receptors (toll-like receptors, TLR-2, TLR-4) on innate immune cells (macrophages, monocytes, neutrophils, dendritic cells), they trigger an overwhelming inflammatory cascade. These activated immune cells release a massive 'cytokine storm' of pro-inflammatory mediators: TNF-α, IL-1β, IL-6, IL-8, and interferons. This cytokine storm produces three pathological hallmarks. First, widespread endothelial damage and increased vascular permeability allow plasma to leak into the interstitial space, causing distributive hypovolemia (intravascular volume depletion despite normal or elevated total body fluid). Second, pathological vasodilation occurs as excessive nitric oxide production by inducible nitric oxide synthase (iNOS) in endothelial and smooth muscle cells relaxes vascular tone, producing refractory hypotension (the hallmark of septic shock — MAP <65 mmHg despite fluid resuscitation requiring vasopressors). Third, the coagulation system is activated by tissue factor expression on damaged endothelium and monocytes, while natural anticoagulants (protein C, antithrombin III) are consumed, creating a procoagulant state that can progress to DIC. Organ dysfunction results from the combination of microvascular thrombosis, cellular hypoxia (despite often-normal or elevated cardiac output in early septic shock), mitochondrial dysfunction (cytopathic hypoxia — cells cannot utilize oxygen even when delivered), and direct cytokine-mediated cellular injury. The SOFA score (Sequential Organ Failure Assessment) quantifies organ dysfunction across six systems: respiratory (PaO2/FiO2), coagulation (platelets), liver (bilirubin), cardiovascular (MAP/vasopressors), CNS (GCS), and renal (creatinine/urine output). Septic shock is defined as sepsis with persistent hypotension requiring vasopressors to maintain MAP ≥65 mmHg AND serum lactate >2 mmol/L despite adequate fluid resuscitation — carrying mortality rates of 40-50%."
    },
    riskFactors: [
      "Age extremes (<1 year and >65 years)",
      "Immunocompromised state (chemotherapy, HIV, chronic steroids, transplant recipients)",
      "Chronic diseases (diabetes, liver cirrhosis, chronic kidney disease, heart failure)",
      "Indwelling devices (central lines, urinary catheters, endotracheal tubes)",
      "Recent surgery or invasive procedure",
      "Malnutrition",
      "Hospitalization (nosocomial infections — especially ICU patients)",
      "Skin breakdown (burns, pressure injuries, surgical wounds)"
    ],
    diagnostics: [
      "Serum lactate: >2 mmol/L indicates tissue hypoperfusion (>4 mmol/L = severe, associated with high mortality)",
      "Blood cultures (at least 2 sets from different sites) BEFORE antibiotics",
      "CBC: WBC may be elevated (leukocytosis) or decreased (leukopenia — worse prognosis)",
      "Procalcitonin: elevated in bacterial infection; useful for monitoring treatment response and guiding antibiotic duration",
      "Coagulation studies: PT/INR, aPTT, fibrinogen, D-dimer (assess for DIC)",
      "Comprehensive metabolic panel: renal function, liver function, glucose",
      "ABG for acid-base status and PaO2/FiO2 ratio",
      "Source identification: urinalysis, chest X-ray, wound cultures, imaging as indicated"
    ],
    management: [
      "HOUR-1 BUNDLE (Surviving Sepsis Campaign): measure lactate, obtain blood cultures before antibiotics, administer broad-spectrum antibiotics, begin rapid fluid resuscitation (30 mL/kg crystalloid for hypotension or lactate ≥4), apply vasopressors for MAP <65 despite fluids",
      "Broad-spectrum antibiotics WITHIN 1 HOUR — each hour of delay increases mortality by 7-8%",
      "IV fluid resuscitation: 30 mL/kg of crystalloid (NS or lactated Ringer's) within first 3 hours for sepsis-induced hypoperfusion",
      "Norepinephrine as first-line vasopressor if hypotension persists after fluid resuscitation",
      "Source control: remove infected catheters, drain abscesses, debride infected tissue",
      "Reassess volume status and tissue perfusion frequently using dynamic assessment (not CVP alone)"
    ],
    nursingActions: [
      "Recognize early signs: assess for qSOFA criteria (altered mentation, RR ≥22, SBP ≤100)",
      "Obtain blood cultures BEFORE antibiotic administration — but do NOT delay antibiotics to obtain cultures if there will be a delay",
      "Administer broad-spectrum antibiotics within 1 HOUR of sepsis recognition — TIME IS CRITICAL",
      "Initiate and monitor IV fluid resuscitation — assess for response (MAP, urine output, lactate clearance)",
      "Monitor vital signs frequently: MAP target ≥65 mmHg, urine output ≥0.5 mL/kg/hr",
      "Monitor and trend lactate levels — decreasing lactate indicates improving tissue perfusion",
      "Assess for signs of organ dysfunction: altered LOC (brain), decreased UO (kidney), jaundice (liver), coagulopathy (blood), respiratory distress (lungs)",
      "Monitor I&O strictly — fluid overload can worsen respiratory function",
      "Maintain normoglycemia: target blood glucose 140-180 mg/dL with insulin infusion if needed"
    ],
    assessmentFindings: [
      "Early (warm) septic shock: fever, tachycardia, bounding pulses, warm flushed skin, widened pulse pressure",
      "Late (cold) septic shock: hypothermia, weak thready pulses, cool mottled clammy skin, narrow pulse pressure",
      "Tachypnea (often the earliest clinical sign — RR ≥22)",
      "Altered mental status (confusion, agitation, obtundation)",
      "Hypotension (SBP ≤100 or MAP <65 mmHg despite fluids)",
      "Oliguria (<0.5 mL/kg/hr)",
      "Elevated lactate (>2 mmol/L)"
    ],
    signs: {
      left: ["Fever/hypothermia", "Tachycardia", "Tachypnea (RR ≥22)", "Altered mental status"],
      right: ["Hypotension (MAP <65)", "Elevated lactate", "Warm then cold/mottled skin", "Oliguria"]
    },
    medications: [
      { name: "Norepinephrine", type: "First-Line Vasopressor (Alpha-1 > Beta-1)", action: "Potent vasoconstriction (alpha-1) to restore SVR and MAP; mild inotropic effect (beta-1) supports cardiac output", sideEffects: "Peripheral ischemia, tissue necrosis with extravasation, dysrhythmias, limb ischemia", contra: "Uncorrected hypovolemia (must fluid-resuscitate first)", pearl: "FIRST-LINE vasopressor for septic shock. Administer via CENTRAL LINE. Target MAP ≥65 mmHg. Have phentolamine available for extravasation. Titrate to response." },
      { name: "Piperacillin-Tazobactam (Zosyn)", type: "Broad-Spectrum Penicillin + Beta-Lactamase Inhibitor", action: "Broad-spectrum coverage for gram-positive, gram-negative, and anaerobic organisms; extended infusion improves pharmacokinetics", sideEffects: "Diarrhea, C. difficile, hypersensitivity, thrombocytopenia", contra: "Penicillin allergy", pearl: "Common empiric choice for sepsis of unknown source. Extended infusion (4 hours) achieves better time above MIC. De-escalate to narrower spectrum once cultures and sensitivities available." },
      { name: "Hydrocortisone IV", type: "Stress-Dose Corticosteroid", action: "Restores vascular sensitivity to catecholamines, reduces inflammation, addresses possible relative adrenal insufficiency in septic shock", sideEffects: "Hyperglycemia, immunosuppression, sodium/water retention", contra: "Active fungal infection", pearl: "Reserved for REFRACTORY septic shock not responding to adequate fluids + vasopressors. Dose: 200 mg IV daily (50 mg q6h). Evidence most supportive when given with fludrocortisone." }
    ],
    pearls: [
      "SEPSIS KILLS FAST: each hour of antibiotic delay increases mortality by 7-8% — antibiotics within 1 HOUR is the standard",
      "Lactate >2 mmol/L = tissue hypoperfusion. Lactate >4 mmol/L = severe sepsis with high mortality. TREND the lactate — clearance indicates response.",
      "qSOFA at the bedside: altered mentation + RR ≥22 + SBP ≤100 — any 2 of 3 suggests sepsis outside ICU",
      "Early septic shock is WARM and hyperdynamic (vasodilation); late septic shock is COLD (cardiovascular collapse)",
      "Source control is as important as antibiotics — infected catheters must be removed, abscesses drained",
      "Sepsis bundles save lives: measure lactate, blood cultures, antibiotics, 30 mL/kg fluids, vasopressors — ALL within the first hour"
    ],
    quiz: [
      { question: "A client with sepsis has a MAP of 58 mmHg despite receiving 2 liters of NS. Lactate is 4.8 mmol/L. What does the nurse anticipate next?", options: ["Continue IV fluids only", "Initiate norepinephrine vasopressor infusion to achieve MAP ≥65 mmHg", "Administer oral antibiotics", "Decrease IV fluid rate to prevent overload"], correct: 1, rationale: "With MAP <65 mmHg despite adequate fluid resuscitation (30 mL/kg crystalloid), the patient meets criteria for septic shock. Norepinephrine is the first-line vasopressor to restore vascular tone and achieve the target MAP ≥65 mmHg. The elevated lactate confirms severe tissue hypoperfusion." },
      { question: "What is the mortality impact of a 3-hour delay in antibiotic administration in sepsis?", options: ["No impact", "Approximately 20-24% increase in mortality", "Only a 1% increase", "Delays are acceptable if blood cultures are obtained first"], correct: 1, rationale: "Each hour of antibiotic delay in sepsis increases mortality by approximately 7-8%. A 3-hour delay therefore increases mortality by approximately 21-24%. While obtaining blood cultures before antibiotics is ideal, antibiotics should NEVER be delayed more than minutes for culture collection. If cultures cannot be obtained quickly, start antibiotics immediately." }
    ]
  },

  "rpn-pneumonia-standalone": {
    title: "Pneumonia (RPN Pathophysiology)",
    cellular: {
      title: "Pulmonary Parenchymal Infection and Inflammation",
      content: "Pneumonia is an acute infection of the lung parenchyma (alveoli and surrounding interstitial tissue) that impairs gas exchange. The pathophysiology involves microbial invasion of normally sterile lower airways, triggering an intense inflammatory response. The respiratory tract has multiple defense mechanisms: nasal hair filtration, mucociliary escalator (ciliated epithelium propelling mucus-trapped particles upward), cough reflex, IgA secretion, and alveolar macrophages. Pneumonia develops when these defenses are overwhelmed (aspiration, immunosuppression) or when a particularly virulent organism is inhaled. Community-acquired pneumonia (CAP) is most commonly caused by Streptococcus pneumoniae (pneumococcus), followed by Mycoplasma pneumoniae, Haemophilus influenzae, respiratory viruses (influenza, SARS-CoV-2, RSV), and Legionella. Hospital-acquired pneumonia (HAP) and ventilator-associated pneumonia (VAP) involve more resistant organisms: MRSA, Pseudomonas aeruginosa, Acinetobacter, and gram-negative bacilli. When pathogens reach the alveoli, alveolar macrophages initiate the immune response by releasing chemokines that recruit neutrophils. These inflammatory cells, along with fibrin and edema fluid, fill the alveoli — the hallmark pathological finding of pneumonia is alveolar consolidation (the air-filled alveoli become filled with inflammatory exudate). This consolidation impairs gas exchange by creating ventilation-perfusion (V/Q) mismatch: blood perfuses the consolidated lung but no gas exchange occurs (intrapulmonary shunt), producing hypoxemia. Clinically, consolidation produces characteristic physical findings: bronchial breath sounds (normally heard only over large airways, now transmitted through solid tissue), egophony (E-to-A change), increased tactile fremitus, and dullness to percussion. Lobar pneumonia (S. pneumoniae typically) involves consolidation of an entire lobe, while bronchopneumonia (S. aureus, gram-negatives) produces patchy consolidation around bronchioles."
    },
    riskFactors: [
      "Age extremes (<2 years and >65 years)",
      "Smoking (damages mucociliary clearance and impairs macrophage function)",
      "Chronic lung disease (COPD, asthma, bronchiectasis)",
      "Immunocompromised state (HIV, chemotherapy, chronic steroids)",
      "Dysphagia or impaired gag reflex (aspiration risk)",
      "Mechanical ventilation (VAP — bypasses upper airway defenses)",
      "Chronic illness (diabetes, heart failure, liver/kidney disease)",
      "Recent hospitalization or long-term care residence",
      "Alcohol use disorder (impairs cough reflex, immune function)"
    ],
    diagnostics: [
      "Chest X-ray: infiltrates or consolidation (lobar, bronchopneumonia, or interstitial pattern)",
      "Pulse oximetry and ABG if hypoxemia suspected",
      "CBC: elevated WBC with left shift (neutrophilia) in bacterial; may be normal or lymphocytic in viral",
      "Blood cultures (before antibiotics) for hospitalized patients",
      "Sputum Gram stain and culture (for hospitalized patients)",
      "Procalcitonin: helps distinguish bacterial (elevated) from viral (low) pneumonia",
      "Pneumococcal and Legionella urinary antigens for rapid diagnosis"
    ],
    management: [
      "Empiric antibiotic therapy based on setting (CAP vs HAP/VAP) and severity",
      "CAP outpatient: amoxicillin or macrolide (azithromycin); inpatient: ceftriaxone + azithromycin or respiratory fluoroquinolone",
      "HAP/VAP: broad-spectrum coverage including anti-pseudomonal agents",
      "Supplemental oxygen to maintain SpO2 ≥92% (≥88% for COPD patients)",
      "Adequate hydration to thin secretions",
      "Incentive spirometry and deep breathing exercises",
      "Chest physiotherapy (postural drainage, percussion) if significant secretion retention",
      "Pneumococcal and influenza vaccination for prevention"
    ],
    nursingActions: [
      "Monitor respiratory status: RR, SpO2, work of breathing, lung sounds q2-4h",
      "Administer antibiotics as prescribed — timing of first dose is critical",
      "Administer supplemental oxygen as ordered — titrate to target SpO2",
      "Encourage deep breathing exercises, incentive spirometry q1-2h while awake",
      "Position in semi-Fowler's or high Fowler's to maximize lung expansion",
      "Encourage adequate fluid intake (2-3 L/day unless restricted) to thin secretions",
      "Monitor sputum characteristics: amount, color, consistency",
      "Implement aspiration precautions for at-risk patients (elevated HOB, swallowing assessment)",
      "Educate on vaccination: pneumococcal (PCV20 or PPSV23) and annual influenza vaccine"
    ],
    assessmentFindings: [
      "Productive cough with purulent sputum (rust-colored sputum classic for pneumococcal pneumonia)",
      "Fever, chills, rigors",
      "Dyspnea, tachypnea, pleuritic chest pain (sharp pain with breathing)",
      "Crackles or bronchial breath sounds on auscultation over affected area",
      "Increased tactile fremitus, dullness to percussion over consolidation",
      "Tachycardia, hypoxemia (SpO2 <92%)",
      "Elderly may present atypically: confusion, falls, functional decline without classic respiratory symptoms"
    ],
    signs: {
      left: ["Productive cough", "Fever/chills", "Dyspnea/tachypnea", "Pleuritic chest pain"],
      right: ["Crackles/bronchial breath sounds", "Elevated WBC", "Chest X-ray infiltrates", "Hypoxemia"]
    },
    medications: [
      { name: "Ceftriaxone + Azithromycin", type: "Cephalosporin + Macrolide (CAP Inpatient)", action: "Ceftriaxone covers typical bacteria (S. pneumoniae, H. influenzae); azithromycin covers atypicals (Mycoplasma, Legionella, Chlamydophila)", sideEffects: "Ceftriaxone: diarrhea, hypersensitivity. Azithromycin: QT prolongation, GI upset, hepatotoxicity", contra: "Ceftriaxone: severe penicillin allergy. Azithromycin: liver disease, QT prolongation", pearl: "Standard empiric regimen for hospitalized CAP. The combination covers both typical and atypical pathogens — important because clinical presentation alone cannot reliably distinguish them." },
      { name: "Levofloxacin", type: "Respiratory Fluoroquinolone", action: "Inhibits bacterial DNA gyrase and topoisomerase IV; broad coverage of typical and atypical pneumonia pathogens", sideEffects: "Tendon rupture (especially Achilles), QT prolongation, C. difficile, photosensitivity, peripheral neuropathy, aortic aneurysm", contra: "Myasthenia gravis (worsens weakness), concurrent QT-prolonging drugs, children <18 (cartilage damage)", pearl: "Used as monotherapy alternative for CAP. BLACK BOX WARNING for tendon rupture — risk increased with age >60, corticosteroid use, and renal/heart/lung transplant. Stop immediately if tendon pain develops." }
    ],
    pearls: [
      "S. pneumoniae is the #1 cause of community-acquired pneumonia — RUST-COLORED sputum is classic",
      "Elderly patients with pneumonia may present with CONFUSION and functional decline rather than classic fever/cough — always consider pneumonia in acute delirium",
      "Incentive spirometry is PREVENTIVE and THERAPEUTIC — 10 breaths q1-2h while awake prevents atelectasis and clears secretions",
      "Aspiration pneumonia is common in stroke, dementia, and post-anesthesia patients — HOB elevation and swallowing assessment are critical",
      "Vaccination prevents pneumonia: PCV20 for adults ≥65 or high-risk, annual influenza vaccine for all ≥6 months",
      "CURB-65 score helps determine disposition: Confusion, Urea >7, RR ≥30, BP <90/60, age ≥65 — score ≥2 suggests hospital admission"
    ],
    quiz: [
      { question: "A 78-year-old client from a long-term care facility presents with acute confusion, tachypnea, and low-grade fever. Chest X-ray shows right lower lobe infiltrate. What is the most likely diagnosis?", options: ["Stroke", "Urinary tract infection", "Pneumonia with atypical presentation", "Medication side effect"], correct: 2, rationale: "Elderly patients often present with atypical pneumonia symptoms: confusion (due to hypoxemia), tachypnea, and functional decline may be the only signs, without classic productive cough or high fever. The chest X-ray infiltrate confirms pneumonia. Always consider pneumonia in elderly patients with acute confusion." },
      { question: "Which nursing intervention is most important for preventing hospital-acquired pneumonia?", options: ["Administering prophylactic antibiotics", "Elevating the head of bed 30-45 degrees and providing oral care", "Keeping the client in strict bed rest", "Restricting fluids to prevent aspiration"], correct: 1, rationale: "Elevating the HOB to 30-45 degrees reduces aspiration risk (the leading cause of HAP), and oral care with chlorhexidine reduces oropharyngeal bacterial colonization. These are evidence-based interventions in the ventilator-associated pneumonia (VAP) prevention bundle. Prophylactic antibiotics promote resistance. Bed rest increases atelectasis risk. Adequate hydration thins secretions." }
    ]
  },

  "rpn-c-difficile": {
    title: "Clostridioides difficile Infection (CDI)",
    cellular: {
      title: "Toxin-Mediated Colonic Inflammation",
      content: "Clostridioides difficile (C. difficile) infection is the most common cause of healthcare-associated infectious diarrhea. C. difficile is a gram-positive, spore-forming, obligate anaerobic bacillus that produces two primary exotoxins — toxin A (enterotoxin) and toxin B (cytotoxin) — which are responsible for the clinical disease. The pathogenesis requires disruption of the normal intestinal microbiome, typically by antibiotic exposure. Broad-spectrum antibiotics (fluoroquinolones, clindamycin, cephalosporins, carbapenems) kill beneficial commensal bacteria that normally occupy ecological niches in the colon and provide 'colonization resistance' against C. difficile. With the normal flora suppressed, C. difficile spores (which are resistant to antibiotics, heat, acid, and alcohol-based hand sanitizers) germinate in the favorable anaerobic environment of the colon, and the vegetative cells proliferate and produce toxins. Toxin A and toxin B bind to receptors on colonic epithelial cells and are internalized. Inside the cell, they inactivate Rho GTPases by glucosylation, disrupting the actin cytoskeleton. This causes cell rounding, loss of tight junctions between epithelial cells, increased mucosal permeability, and ultimately epithelial cell apoptosis and necrosis. The damaged epithelium triggers a robust inflammatory response with neutrophil infiltration, edema, and mucus production. In severe cases, this produces pseudomembranous colitis — characterized by raised yellow-white plaques (pseudomembranes) composed of fibrin, mucus, dead epithelial cells, and neutrophils overlying areas of mucosal necrosis. Complications include toxic megacolon (colonic dilation >6 cm with systemic toxicity), colonic perforation, and fulminant colitis requiring emergent colectomy. The NAP1/BI/027 hypervirulent strain produces 15-20 times more toxin than standard strains and is associated with more severe disease, higher recurrence rates, and increased mortality."
    },
    riskFactors: [
      "Antibiotic exposure (STRONGEST risk factor — fluoroquinolones, clindamycin, broad-spectrum cephalosporins, carbapenems)",
      "Hospitalization or long-term care facility residence",
      "Age >65 years",
      "Proton pump inhibitor (PPI) use (reduces gastric acid barrier)",
      "Immunocompromised state",
      "Recent GI surgery or procedures",
      "Tube feeding (disrupts normal flora)",
      "Prolonged hospital stay",
      "Prior CDI (20-30% recurrence rate after first episode)"
    ],
    diagnostics: [
      "Stool toxin testing: GDH screen followed by toxin A/B EIA, or PCR (NAAT) for toxigenic C. difficile",
      "Do NOT test formed stools — test only liquid/unformed stools (Bristol type 5-7)",
      "Do NOT repeat testing within 7 days if negative (not indicated for 'test of cure' either)",
      "Stool leukocytes may be present",
      "WBC: may be markedly elevated (leukemoid reaction WBC >15,000-40,000 in severe disease)",
      "Serum albumin: decreased in severe disease",
      "CT abdomen: colonic wall thickening, 'accordion sign' in severe cases",
      "Colonoscopy may show pseudomembranes (not routinely needed for diagnosis)"
    ],
    management: [
      "STOP the offending antibiotic if possible (or switch to narrower spectrum)",
      "Mild-moderate CDI: oral vancomycin 125 mg QID × 10 days (FIRST-LINE, not IV — must be ORAL for colonic action)",
      "Alternative: fidaxomicin 200 mg BID × 10 days (lower recurrence rate than vancomycin)",
      "Severe CDI (WBC >15,000, Cr >1.5x baseline): oral vancomycin 125 mg QID; if ileus, add IV metronidazole",
      "Fulminant CDI: oral vancomycin 500 mg QID + rectal vancomycin + IV metronidazole; surgical consultation",
      "First recurrence: fidaxomicin or vancomycin taper/pulse regimen",
      "Multiple recurrences: fecal microbiota transplant (FMT) — restores normal intestinal flora with 80-90% cure rate"
    ],
    nursingActions: [
      "Implement CONTACT PRECAUTIONS: gown and gloves for ALL room entry",
      "HAND WASHING with SOAP AND WATER — alcohol-based sanitizers do NOT kill C. difficile spores",
      "Private room with dedicated equipment (stethoscope, BP cuff, thermometer)",
      "Monitor stool frequency, consistency, and volume — document on Bristol Stool Scale",
      "Monitor for dehydration: I&O, weight, electrolytes, skin turgor",
      "Administer oral vancomycin as prescribed — ensure it is ORAL (not IV) for CDI",
      "Assess for complications: abdominal distension (toxic megacolon), rebound tenderness (perforation), increasing pain",
      "Educate on antibiotic stewardship — CDI risk with unnecessary antibiotic use"
    ],
    assessmentFindings: [
      "Watery diarrhea (≥3 unformed stools in 24 hours) — may be profuse (10-15 stools/day in severe disease)",
      "Foul-smelling stool",
      "Abdominal cramping and tenderness",
      "Fever (may be low-grade or high in severe disease)",
      "Leukocytosis (WBC often >15,000; may exceed 40,000 in severe cases)",
      "Signs of dehydration: tachycardia, hypotension, decreased urine output",
      "Abdominal distension (suggests toxic megacolon — EMERGENCY)"
    ],
    signs: {
      left: ["Watery foul-smelling diarrhea", "Abdominal cramping", "Fever", "Leukocytosis"],
      right: ["Recent antibiotic exposure", "Positive stool toxin", "Dehydration signs", "Abdominal distension (severe)"]
    },
    medications: [
      { name: "Vancomycin ORAL", type: "Glycopeptide Antibiotic (Oral for Colonic Action)", action: "Kills C. difficile vegetative cells directly in the colonic lumen — poorly absorbed orally, so achieves very high intraluminal concentrations", sideEffects: "Generally well-tolerated orally (minimal systemic absorption)", contra: "Known hypersensitivity", pearl: "MUST be ORAL for CDI — IV vancomycin does NOT reach the colonic lumen in therapeutic concentrations. This is the opposite of using IV vancomycin for systemic infections. Do NOT confuse routes." },
      { name: "Fidaxomicin (Dificid)", type: "Macrocyclic Antibiotic", action: "Narrow-spectrum — kills C. difficile while sparing normal gut flora, reducing recurrence risk compared to vancomycin", sideEffects: "Nausea, abdominal pain", contra: "Hypersensitivity", pearl: "LOWER RECURRENCE RATE than vancomycin — preferred for recurrent CDI. Much more expensive, which limits first-line use in some settings." },
      { name: "Metronidazole IV", type: "Nitroimidazole Antibiotic", action: "Enters C. difficile cells where it is activated by reduction, damaging DNA and causing bacterial cell death; IV form is secreted into the colonic lumen through inflamed mucosa", sideEffects: "Metallic taste, nausea, disulfiram reaction with alcohol, peripheral neuropathy with prolonged use", contra: "First trimester pregnancy, concurrent alcohol use", pearl: "Only used as ADJUNCT IV therapy in fulminant CDI when ileus prevents oral vancomycin from reaching the colon. No longer recommended as sole therapy due to inferiority to vancomycin." }
    ],
    pearls: [
      "C. difficile spores are NOT killed by alcohol-based hand sanitizers — SOAP AND WATER hand washing is mandatory",
      "Oral vancomycin for CDI (NOT IV) — this is a common and dangerous confusion. IV vancomycin does not reach the colon.",
      "The most important prevention strategy is antibiotic stewardship — avoid unnecessary antibiotics",
      "Contact precautions continue until diarrhea resolves (not based on negative stool test)",
      "20-30% recurrence rate after first episode — fecal microbiota transplant (FMT) is highly effective for multiple recurrences",
      "Avoid antidiarrheals (loperamide) in CDI — they mask symptoms, delay toxin clearance, and increase toxic megacolon risk"
    ],
    quiz: [
      { question: "Which hand hygiene method is required when caring for a client with C. difficile infection?", options: ["Alcohol-based hand sanitizer for 20 seconds", "Soap and water hand washing for at least 20 seconds", "Either method is equally effective", "Hand hygiene is only needed after direct patient contact"], correct: 1, rationale: "C. difficile produces spores that are resistant to alcohol-based hand sanitizers. Only mechanical removal through friction with soap and water effectively removes spores from hands. This is a critical infection control distinction — alcohol sanitizers are adequate for most pathogens but NOT for C. difficile." },
      { question: "A nurse receives an order for IV vancomycin 125 mg QID for a client diagnosed with C. difficile colitis. What should the nurse do?", options: ["Administer as ordered via IV", "Clarify the order — CDI requires ORAL vancomycin, not IV, to achieve therapeutic concentrations in the colon", "Give the medication both IV and orally", "Switch to IV metronidazole instead"], correct: 1, rationale: "This order contains a critical error. For C. difficile infection, vancomycin must be given ORALLY because it is poorly absorbed from the GI tract, achieving high concentrations directly in the colon where C. difficile resides. IV vancomycin does not reach the colonic lumen in therapeutic concentrations and is ineffective for CDI." }
    ]
  },

  "rpn-mrsa-vre": {
    title: "MRSA and VRE (Antibiotic-Resistant Organisms)",
    cellular: {
      title: "Mechanisms of Antimicrobial Resistance",
      content: "Methicillin-resistant Staphylococcus aureus (MRSA) and vancomycin-resistant Enterococcus (VRE) are among the most clinically significant antibiotic-resistant organisms (AROs), posing major challenges in healthcare settings. MRSA acquires resistance through the mecA gene, which encodes an altered penicillin-binding protein (PBP2a) with low affinity for all beta-lactam antibiotics (penicillins, cephalosporins, and carbapenems). PBPs are enzymes essential for peptidoglycan cross-linking in bacterial cell wall synthesis — beta-lactams normally bind to PBPs and inhibit this process, causing cell death. PBP2a can continue peptidoglycan synthesis even in the presence of beta-lactams, rendering all these antibiotics ineffective. The mecA gene is carried on a mobile genetic element called the staphylococcal cassette chromosome mec (SCCmec), which can be transferred between S. aureus strains. MRSA strains are classified as healthcare-associated (HA-MRSA — typically multidrug-resistant, causing bloodstream infections, pneumonia, surgical site infections) or community-associated (CA-MRSA — often causing skin and soft tissue infections, particularly abscesses and cellulitis, and occasionally necrotizing pneumonia). VRE acquires resistance through the vanA or vanB gene clusters, which alter the target of vancomycin from the normal D-alanine-D-alanine (D-Ala-D-Ala) terminus of peptidoglycan precursors to D-alanine-D-lactate (D-Ala-D-Lac). Vancomycin binds D-Ala-D-Ala with high affinity to inhibit cell wall cross-linking, but binds D-Ala-D-Lac with 1,000-fold reduced affinity, rendering the drug ineffective. VRE is particularly concerning in immunocompromised and critically ill patients. The genes for both MRSA and VRE resistance are transferable — there is concern about transfer of vanA from VRE to MRSA, which would create vancomycin-resistant S. aureus (VRSA), a potentially untreatable pathogen. Antibiotic resistance develops through selective pressure: when antibiotics kill susceptible bacteria, resistant organisms survive and proliferate in the ecological niche vacated by the killed susceptible organisms. This is why antibiotic stewardship — using the right antibiotic, at the right dose, for the right duration — is critical to slowing resistance development."
    },
    riskFactors: [
      "MRSA: healthcare exposure (hospitalization, dialysis, long-term care), indwelling devices (catheters, lines), recent antibiotics, skin breakdown, crowded living conditions (prisons, shelters, military), contact sports",
      "VRE: prolonged hospitalization, ICU stay, immunosuppression, prior antibiotic exposure (especially vancomycin, cephalosporins), GI colonization, organ transplant recipients",
      "Both: antibiotic exposure (strongest modifiable risk factor), immunocompromised state, invasive devices"
    ],
    diagnostics: [
      "Wound culture or blood culture with susceptibility testing (identifies organism and resistance pattern)",
      "Active surveillance cultures (nasal swab for MRSA, rectal swab for VRE) in high-risk patients or during outbreaks",
      "MRSA PCR nasal swab for rapid screening (results in 1-2 hours)",
      "Antibiogram review (hospital-specific resistance patterns guide empiric therapy)"
    ],
    management: [
      "MRSA infections: vancomycin IV, daptomycin, linezolid, trimethoprim-sulfamethoxazole (TMP-SMX) for SSTI, clindamycin",
      "VRE infections: linezolid, daptomycin, tigecycline depending on infection site",
      "MRSA skin abscesses: incision and drainage ± antibiotics (I&D is often sufficient for simple abscesses)",
      "MRSA decolonization in select patients: mupirocin nasal ointment + chlorhexidine body wash",
      "Antibiotic stewardship: narrow-spectrum antibiotics when possible, appropriate duration, de-escalation based on cultures",
      "Environmental cleaning with hospital-grade disinfectant (MRSA survives on surfaces for days to weeks)"
    ],
    nursingActions: [
      "Implement CONTACT PRECAUTIONS: gown and gloves for room entry, dedicated equipment",
      "Hand hygiene before and after every patient contact (soap and water or alcohol-based sanitizer — both effective for MRSA/VRE unlike C. diff)",
      "Place patient in private room or cohort with another MRSA/VRE patient",
      "Clean environment with hospital-grade disinfectant — MRSA survives on surfaces for extended periods",
      "Administer prescribed antibiotics on schedule — monitor for side effects (vancomycin: nephrotoxicity, red man syndrome)",
      "Educate patient and visitors about contact precautions and hand hygiene",
      "Promote antibiotic stewardship: do not pressure providers for unnecessary antibiotics",
      "Assess wounds: monitor for healing or worsening despite appropriate antibiotic therapy"
    ],
    assessmentFindings: [
      "MRSA skin infections: boils, abscesses (often mistaken for 'spider bites'), cellulitis, wound infections",
      "MRSA bloodstream infection: fever, chills, tachycardia, hypotension, signs of metastatic infection (endocarditis, osteomyelitis, septic arthritis)",
      "VRE: often colonizes GI tract asymptomatically; clinical infections include UTI, bloodstream infection, wound infection in immunocompromised",
      "Both may be identified on surveillance cultures in asymptomatic carriers"
    ],
    signs: {
      left: ["MRSA: skin abscesses/boils", "Wound infections not responding to beta-lactams", "Fever/bacteremia", "Cellulitis with purulent drainage"],
      right: ["VRE: UTI/bloodstream infection", "Immunocompromised host", "Contact precautions flag", "Positive surveillance culture"]
    },
    medications: [
      { name: "Vancomycin IV", type: "Glycopeptide (MRSA Treatment)", action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala; effective against MRSA but NOT VRE", sideEffects: "Red man syndrome (infuse slowly), nephrotoxicity, ototoxicity", contra: "VRE infection (VRE is resistant to vancomycin by definition)", pearl: "Standard treatment for serious MRSA infections. Monitor trough levels (target 15-20 mcg/mL for serious infections). AUC/MIC-based dosing increasingly preferred. Does NOT work against VRE." },
      { name: "Linezolid", type: "Oxazolidinone Antibiotic", action: "Inhibits bacterial protein synthesis by binding to the 50S ribosomal subunit; active against BOTH MRSA and VRE", sideEffects: "Thrombocytopenia (monitor CBC weekly), serotonin syndrome with SSRIs/MAOIs, peripheral neuropathy (long-term)", contra: "Concurrent SSRI/MAOI use (serotonin syndrome risk), uncontrolled hypertension", pearl: "One of few drugs effective against BOTH MRSA and VRE. Available in IV and oral forms (100% bioavailability orally). Monitor platelets weekly — thrombocytopenia occurs after >2 weeks of therapy." },
      { name: "Mupirocin (Bactroban)", type: "Topical Antibiotic (Nasal Decolonization)", action: "Inhibits bacterial isoleucyl-tRNA synthetase, blocking protein synthesis; applied intranasally to eradicate nasal MRSA colonization", sideEffects: "Nasal irritation, headache", contra: "Known hypersensitivity", pearl: "Used for MRSA nasal decolonization (applied BID × 5 days) combined with chlorhexidine body washes. Reduces risk of subsequent MRSA infection in colonized patients, particularly pre-operatively." }
    ],
    pearls: [
      "MRSA = resistant to ALL beta-lactams (penicillins, cephalosporins, carbapenems). VRE = resistant to vancomycin.",
      "Contact precautions for BOTH: gown + gloves + dedicated equipment + hand hygiene",
      "Alcohol-based sanitizers ARE effective for MRSA and VRE (unlike C. difficile which requires soap and water)",
      "Antibiotic stewardship is the MOST important strategy to prevent emergence and spread of resistant organisms",
      "Community-associated MRSA commonly causes skin abscesses often mistaken for 'spider bites'",
      "Environmental cleaning is critical — MRSA can survive on surfaces for days to weeks"
    ],
    quiz: [
      { question: "A client has a wound culture positive for MRSA. Which antibiotic class is definitely INEFFECTIVE?", options: ["Glycopeptides", "Oxazolidinones", "Beta-lactams (penicillins, cephalosporins)", "Lipopeptides"], correct: 2, rationale: "MRSA by definition is resistant to methicillin and ALL beta-lactam antibiotics, including penicillins, cephalosporins, and carbapenems. This resistance is mediated by the mecA gene encoding PBP2a, which has low affinity for all beta-lactams. Treatment requires alternative agents such as vancomycin, linezolid, or daptomycin." }
    ]
  },

  "rpn-wound-infection": {
    title: "Wound Infection and Healing",
    cellular: {
      title: "Inflammatory Response and Tissue Repair Disruption",
      content: "Wound infection occurs when microorganisms invade wound tissue, overwhelm local host defenses, and cause tissue damage that disrupts the normal healing process. Normal wound healing progresses through four overlapping phases: hemostasis (seconds to hours — platelet aggregation and fibrin clot formation creating a provisional wound matrix), inflammation (hours to days — neutrophils and macrophages clear debris and bacteria, release growth factors), proliferation (days to weeks — fibroblast migration, collagen deposition, angiogenesis, granulation tissue formation, and epithelial cell migration), and remodeling (weeks to months — collagen cross-linking and reorganization, wound contraction, scar maturation). Wound infection disrupts this orderly process by perpetuating the inflammatory phase. Bacteria in the wound exist on a continuum: contamination (bacteria present but not multiplying, no host response), colonization (bacteria multiplying but not causing tissue damage), critical colonization (increasing bacterial burden delaying healing but without overt infection signs), and infection (bacteria invading tissue, causing damage, with local and/or systemic host response). Infection is generally considered present when bacterial burden exceeds 10⁵ (100,000) colony-forming units per gram of tissue. The most common wound pathogens include S. aureus (including MRSA), Streptococcus pyogenes (Group A Streptococcus), Pseudomonas aeruginosa (produces green-blue pigment and a fruity/grape-like odor), E. coli, and Bacteroides (anaerobes in deep or bite wounds). Biofilm — a structured community of bacteria enclosed in a self-produced polymeric matrix adhering to the wound surface — is present in 60-80% of chronic wounds and is a major barrier to healing. Biofilm bacteria are 100-1,000 times more resistant to antibiotics than planktonic (free-floating) bacteria and require physical disruption (debridement) for effective management."
    },
    riskFactors: [
      "Diabetes mellitus (impaired immune function, peripheral neuropathy, vascular insufficiency)",
      "Immunosuppression (chronic steroids, chemotherapy, HIV)",
      "Malnutrition (protein, vitamin C, and zinc deficiency impair healing)",
      "Obesity (reduced blood flow to adipose tissue, larger wound surface area)",
      "Smoking (nicotine causes vasoconstriction, carbon monoxide reduces oxygen delivery, impairs immune cells)",
      "Peripheral vascular disease (inadequate tissue perfusion)",
      "Foreign bodies in wound",
      "Prolonged surgical time, poor surgical technique",
      "Poor wound care technique (break in aseptic technique)"
    ],
    diagnostics: [
      "Clinical assessment is primary: increasing pain, erythema spreading beyond wound edges, warmth, swelling, purulent drainage",
      "Wound culture (tissue biopsy preferred over swab for accuracy — Levine technique for swab if needed)",
      "WBC count and differential",
      "Blood cultures if systemic infection suspected",
      "Procalcitonin and CRP for systemic infection markers",
      "Wound measurement and documentation (length, width, depth, tunneling, undermining)"
    ],
    management: [
      "Wound assessment and documentation at each dressing change",
      "Wound cleansing with normal saline or prescribed wound cleanser",
      "Debridement of necrotic tissue (sharp, enzymatic, autolytic, or mechanical)",
      "Appropriate wound dressing selection based on wound characteristics",
      "Systemic antibiotics for cellulitis, deep tissue infection, or systemic signs",
      "Topical antimicrobials (silver dressings, cadexomer iodine) for critically colonized wounds",
      "Nutritional optimization: adequate protein, vitamin C, zinc",
      "Offloading for diabetic foot wounds (total contact casting or specialized footwear)"
    ],
    nursingActions: [
      "Perform wound assessment at every dressing change: size, depth, tissue type, exudate, odor, periwound skin",
      "Use consistent measurement technique and document accurately (photograph when possible)",
      "Maintain aseptic or clean technique as appropriate for wound type",
      "Assess for signs of infection: increasing pain, expanding erythema, warmth, purulent drainage, fever, odor change",
      "Mark the borders of erythema with a skin marker to track progression or resolution",
      "Educate patient on signs of infection requiring medical attention",
      "Ensure adequate nutrition — consult dietitian for wounds not healing",
      "Monitor blood glucose in diabetic patients — hyperglycemia impairs healing and immune function"
    ],
    assessmentFindings: [
      "Local signs: increasing pain, spreading erythema, warmth, swelling, purulent/malodorous drainage",
      "Wound bed changes: increased necrotic tissue, friable/bleeding granulation tissue, wound size not decreasing",
      "Systemic signs: fever, tachycardia, elevated WBC, malaise",
      "Delayed healing: wound not progressing through healing phases as expected",
      "Surrounding skin changes: maceration, satellite lesions (fungal superinfection)"
    ],
    signs: {
      left: ["Increasing wound pain", "Spreading erythema", "Purulent drainage", "Malodorous wound"],
      right: ["Fever/elevated WBC", "Delayed healing", "Friable granulation tissue", "Wound enlargement"]
    },
    medications: [
      { name: "Cephalexin", type: "First-Generation Cephalosporin (Oral)", action: "Inhibits bacterial cell wall synthesis; effective against common skin pathogens (MSSA, Streptococcus)", sideEffects: "GI upset, diarrhea, hypersensitivity", contra: "Severe penicillin allergy", pearl: "First-line oral antibiotic for non-MRSA wound cellulitis. Does NOT cover MRSA — add TMP-SMX or doxycycline if MRSA suspected." },
      { name: "Silver Sulfadiazine Cream (Silvadene)", type: "Topical Antimicrobial", action: "Silver ions disrupt bacterial cell membranes and DNA; broad-spectrum coverage for wound pathogens including Pseudomonas", sideEffects: "Transient leukopenia (monitor WBC), local burning, skin discoloration", contra: "Sulfa allergy, pregnancy near term, newborns <2 months", pearl: "Commonly used for burn wounds. Apply 1/16 inch thickness. Pseudomonas produces green-blue drainage and fruity odor — silver sulfadiazine provides coverage." }
    ],
    pearls: [
      "Wound infection PROLONGS the inflammatory phase, preventing progression to proliferation and healing",
      "Mark erythema borders with skin marker — expanding borders indicate worsening infection, retreating borders indicate response to treatment",
      "Biofilm is present in 60-80% of chronic wounds — debridement is essential because biofilm bacteria are 100-1,000× more antibiotic-resistant",
      "Nutritional status directly impacts wound healing — protein, vitamin C, and zinc are critical nutrients",
      "Green-blue drainage with fruity odor = Pseudomonas aeruginosa until proven otherwise",
      "Diabetic patients need glycemic control (target glucose <10 mmol/L) for optimal wound healing"
    ],
    quiz: [
      { question: "Which nursing assessment finding most strongly suggests a wound has progressed from colonization to infection?", options: ["Presence of bacteria on wound culture", "Spreading erythema beyond wound edges with increasing pain and purulent drainage", "Moist wound bed with granulation tissue", "Serosanguineous drainage"], correct: 1, rationale: "While all wounds harbor some bacteria (colonization), infection is distinguished by tissue invasion causing host response: spreading erythema (cellulitis), increasing pain, purulent/malodorous drainage, warmth, and swelling. Granulation tissue and serosanguineous drainage are signs of normal healing." }
    ]
  }
};
