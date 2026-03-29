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
    let c = fs.readFileSync(fp, "utf8");
    const marker = `"${id}":`;
    const idx = c.indexOf(marker);
    if (idx === -1) continue;
    if (!c.slice(idx, idx + 300).includes("[WRITE YOUR")) continue;
    let bc = 0, es = idx + marker.length;
    while (es < c.length && c[es] !== "{") es++;
    let start = es;
    for (let i = start; i < c.length; i++) {
      if (c[i] === "{") bc++;
      else if (c[i] === "}") { bc--; if (bc === 0) { es = i + 1; break; } }
    }
    const newBlock = `{\n    ${buildLS(lesson)}\n  }`;
    c = c.slice(0, start) + newBlock + c.slice(es);
    fs.writeFileSync(fp, c, "utf8");
    console.log(`Injected ${id} in ${file}`);
    return true;
  }
  console.log(`NOT FOUND: ${id}`);
  return false;
}

const lessons: Record<string, any> = {

"sepsis-basics-rpn": {
  title: "Sepsis Basics",
  cellular: {
    title: "Pathophysiology of Sepsis",
    content: "Sepsis is defined as life-threatening organ dysfunction caused by a dysregulated host response to infection. It represents a continuum from infection to sepsis to septic shock, with increasing mortality at each stage. Septic shock is defined as sepsis with persistent hypotension requiring vasopressors to maintain MAP greater than or equal to 65 mmHg AND serum lactate greater than 2 mmol/L despite adequate volume resuscitation.\n\nThe pathophysiology begins with an infectious trigger (most commonly bacterial, but also fungal, viral, or parasitic). Pattern recognition receptors (toll-like receptors) on innate immune cells detect pathogen-associated molecular patterns (PAMPs) from the invading organism. This triggers a massive, dysregulated inflammatory cascade - the host response becomes the problem rather than the solution.\n\nPro-inflammatory mediators (TNF-alpha, IL-1, IL-6) are released in overwhelming quantities, activating the complement system, coagulation cascade, and further immune cell recruitment. This systemic inflammatory response causes widespread endothelial damage and increased capillary permeability, resulting in fluid shifting from the intravascular space into the interstitium (third-spacing). The resulting hypovolemia reduces cardiac preload and cardiac output.\n\nSimultaneously, excessive nitric oxide production causes profound vasodilation, reducing systemic vascular resistance and contributing to distributive shock. Despite adequate or even increased cardiac output, tissue perfusion is impaired because blood flow is maldistributed - some capillary beds are over-perfused while others are under-perfused.\n\nMicrovascular thrombosis from activation of the coagulation cascade (disseminated intravascular coagulation, DIC) further compromises organ perfusion. Microthrombi obstruct capillaries, causing ischemic organ damage. Consumption of clotting factors and platelets paradoxically leads to bleeding tendency.\n\nCellular hypoxia results from poor oxygen delivery AND impaired cellular oxygen utilisation (mitochondrial dysfunction). Cells switch to anaerobic metabolism, producing lactic acid - hence elevated serum lactate is both a marker of tissue hypoperfusion and a prognostic indicator. Persistent lactic acidosis despite resuscitation indicates ongoing cellular hypoxia and carries high mortality.\n\nOrgan dysfunction is the defining feature of sepsis. The lungs are often first affected (acute respiratory distress syndrome), followed by kidneys (acute kidney injury from hypoperfusion), liver (elevated enzymes, coagulopathy), brain (septic encephalopathy), heart (septic cardiomyopathy), and GI tract (ileus, stress ulceration). Multi-organ dysfunction syndrome (MODS) carries mortality rates of 60-80%.\n\nThe Sequential Organ Failure Assessment (SOFA) score quantifies organ dysfunction across six systems (respiratory, coagulation, liver, cardiovascular, neurological, renal). An acute change in SOFA score of 2 or more points from baseline in the setting of infection defines sepsis. The quick SOFA (qSOFA) is a bedside screening tool using three criteria: respiratory rate greater than or equal to 22, altered mentation, and systolic blood pressure less than or equal to 100 mmHg."
  },
  riskFactors: [
    "Extremes of age (neonates/infants and elderly >65 have highest sepsis incidence and mortality)",
    "Immunocompromised state: HIV/AIDS, chemotherapy, organ transplant recipients, chronic corticosteroid use, asplenia",
    "Chronic diseases: diabetes mellitus, chronic kidney disease, liver cirrhosis, heart failure, COPD",
    "Invasive devices: central venous catheters, urinary catheters, endotracheal tubes, surgical drains (portals of entry for pathogens)",
    "Recent surgery or invasive procedures",
    "Healthcare-associated infections (hospital-acquired pneumonia, CAUTI, CLABSI, surgical site infections)",
    "Malnutrition and poor functional status",
    "Community-acquired pneumonia (most common source of sepsis), urinary tract infections, abdominal infections, skin and soft tissue infections",
    "Previous episode of sepsis (increased risk of recurrence)"
  ],
  diagnostics: [
    "Blood cultures (at least 2 sets from different sites): obtain BEFORE starting antibiotics if possible without delaying treatment; identifies organism and guides antibiotic therapy",
    "Serum lactate: critical marker of tissue hypoperfusion; >2 mmol/L is concerning; >4 mmol/L indicates severe tissue hypoxia with high mortality; serial levels monitor treatment response",
    "CBC with differential: leukocytosis (or leukopenia in overwhelming sepsis), bandemia (left shift indicates acute infection), thrombocytopenia (consumption in DIC)",
    "Comprehensive metabolic panel: BUN/creatinine (acute kidney injury), liver enzymes and bilirubin (hepatic dysfunction), glucose (hyper- or hypoglycemia)",
    "Procalcitonin: biomarker more specific for bacterial infection than CRP; useful for guiding antibiotic duration (decreasing levels support discontinuation)",
    "Coagulation studies: PT/INR, PTT, fibrinogen, D-dimer (assess for DIC: prolonged PT/PTT, low fibrinogen, elevated D-dimer, low platelets)",
    "Arterial blood gas: metabolic acidosis (lactic acidosis), respiratory alkalosis initially (compensatory hyperventilation), assess oxygenation",
    "Source-specific cultures: urine culture, sputum culture, wound culture, peritoneal fluid culture based on suspected source",
    "Imaging: chest X-ray (pneumonia), CT abdomen (intra-abdominal source), CT head (if altered mental status)"
  ],
  management: [
    "Hour-1 Bundle (Surviving Sepsis Campaign): (1) measure lactate and remeasure if initial >2; (2) obtain blood cultures before antibiotics; (3) administer broad-spectrum antibiotics within 1 hour of recognition; (4) begin rapid IV crystalloid 30 mL/kg for hypotension or lactate >4; (5) apply vasopressors for persistent hypotension during or after fluid resuscitation to maintain MAP >=65",
    "Antibiotic therapy: broad-spectrum empiric coverage within 1 HOUR of sepsis recognition (each hour of delay increases mortality by approximately 7%); narrow once culture results available (antibiotic stewardship); reassess daily",
    "Fluid resuscitation: initial crystalloid bolus of 30 mL/kg within 3 hours; reassess fluid responsiveness with dynamic measures (passive leg raise, pulse pressure variation); avoid excessive fluid administration (fluid overload worsens outcomes)",
    "Vasopressor therapy: norepinephrine is first-line for septic shock; target MAP >=65 mmHg; add vasopressin as second-line agent; consider dobutamine if evidence of cardiac dysfunction despite adequate volume and vasopressor",
    "Source control: identify and control the source of infection (drain abscess, remove infected device, debride infected tissue, repair perforated viscus) as soon as medically and surgically feasible",
    "Glucose management: target blood glucose 140-180 mg/dL (avoid both hyperglycemia and hypoglycemia)",
    "DVT prophylaxis: LMWH unless contraindicated (high VTE risk in sepsis)",
    "Stress ulcer prophylaxis: PPI or H2 blocker for patients with risk factors",
    "Reassess and de-escalate: daily antibiotic reassessment, wean vasopressors as tolerated, transition to oral antibiotics when clinically appropriate"
  ],
  nursingActions: [
    "Recognise sepsis early using screening tools: assess for qSOFA criteria (RR >=22, altered mentation, SBP <=100) and SIRS criteria (temp >38 or <36, HR >90, RR >20, WBC >12,000 or <4,000) in patients with suspected infection",
    "Initiate the sepsis bundle promptly: obtain blood cultures, draw serum lactate, ensure IV access (preferably 2 large-bore lines), begin prescribed fluid resuscitation and antibiotics within 1 hour",
    "Monitor vital signs continuously or at minimum every 15 minutes during acute phase: heart rate, blood pressure (arterial line for continuous monitoring), respiratory rate, oxygen saturation, temperature",
    "Monitor urine output hourly via Foley catheter: target >=0.5 mL/kg/hour; report oliguria (<0.5 mL/kg/hour) as it indicates inadequate renal perfusion",
    "Assess tissue perfusion: capillary refill time (>3 seconds is prolonged), skin colour and temperature (mottling indicates severe hypoperfusion), mental status (confusion, agitation = early signs of poor cerebral perfusion)",
    "Monitor and trend serum lactate every 2-4 hours: decreasing lactate indicates improving tissue perfusion; persistent or rising lactate despite treatment indicates treatment failure and requires escalation",
    "Manage vasopressor infusions: administer via central line preferably (peripheral norepinephrine can cause tissue necrosis if extravasation); titrate to MAP target; check line site frequently for infiltration",
    "Assess for fluid overload during resuscitation: auscultate lung sounds (crackles), monitor oxygen requirements, assess JVD and peripheral edema; report findings suggesting over-resuscitation",
    "Monitor for organ dysfunction: neuro (GCS, confusion), respiratory (SpO2, work of breathing), renal (urine output, creatinine), hepatic (jaundice, coagulopathy), haematologic (bleeding, petechiae from DIC)"
  ],
  assessmentFindings: [
    "Fever (>38.3 C) or hypothermia (<36 C - hypothermia in sepsis carries worse prognosis than fever)",
    "Tachycardia (>90 bpm) and tachypnea (>22 breaths/min)",
    "Hypotension (SBP <100 mmHg or MAP <65 mmHg) - may be refractory to IV fluids (septic shock)",
    "Altered mental status: confusion, agitation, decreased level of consciousness (septic encephalopathy)",
    "Warm, flushed skin (early/warm distributive shock from vasodilation) or cool, mottled, cyanotic skin (late/cold shock from cardiovascular decompensation)",
    "Decreased urine output (<0.5 mL/kg/hour indicating acute kidney injury)",
    "Elevated serum lactate (>2 mmol/L indicating tissue hypoperfusion)"
  ],
  signs: {
    left: [
      "Fever or hypothermia with tachycardia",
      "Tachypnea (RR >22) and hypotension",
      "Warm flushed skin (early distributive shock)",
      "Altered mental status (confusion, agitation)",
      "Elevated lactate (>2 mmol/L)"
    ],
    right: [
      "Refractory hypotension despite fluid resuscitation (septic shock)",
      "Cool, mottled skin with delayed capillary refill (late shock)",
      "Anuria (renal failure)",
      "DIC (petechiae, bleeding from IV sites, oozing from wounds)",
      "Multi-organ dysfunction (ARDS, AKI, hepatic failure, coagulopathy)"
    ]
  },
  medications: [
    {
      name: "Norepinephrine (Levophed)",
      type: "First-Line Vasopressor (Alpha-1 and Beta-1 Agonist)",
      action: "Primarily stimulates alpha-1 adrenergic receptors causing potent arterial vasoconstriction, increasing systemic vascular resistance and mean arterial pressure; mild beta-1 stimulation maintains cardiac output; the preferred vasopressor for septic shock",
      sideEffects: "Tissue necrosis if extravasation occurs (especially via peripheral IV), cardiac arrhythmias, hypertension if dose excessive, peripheral ischemia (digits, skin), reflex bradycardia",
      contra: "Hypovolemia (must volume-resuscitate first - vasopressors without adequate volume are ineffective and dangerous), mesenteric or peripheral vascular thrombosis",
      pearl: "FIRST-LINE vasopressor for septic shock per Surviving Sepsis Campaign guidelines; administer via central line whenever possible (peripheral administration acceptable temporarily for urgent need but extravasation causes tissue necrosis); titrate to MAP >=65 mmHg; if escalating doses needed, add vasopressin as second agent rather than further increasing norepinephrine"
    },
    {
      name: "Piperacillin-Tazobactam (Zosyn)",
      type: "Extended-Spectrum Penicillin with Beta-Lactamase Inhibitor",
      action: "Piperacillin inhibits bacterial cell wall synthesis; tazobactam inhibits many beta-lactamase enzymes that would otherwise destroy piperacillin; provides broad-spectrum coverage against gram-positive, gram-negative (including Pseudomonas), and anaerobic organisms",
      sideEffects: "Diarrhea, rash, nausea, C. difficile-associated diarrhea, thrombocytopenia (rare), interstitial nephritis, seizures at high doses in renal impairment",
      contra: "Penicillin allergy with history of anaphylaxis, severe cephalosporin allergy (cross-reactivity)",
      pearl: "Common empiric choice for sepsis of unknown source due to broad spectrum; extended infusion (over 3-4 hours rather than 30 minutes) improves time above MIC and clinical outcomes; dose adjustment needed for renal impairment; does NOT cover MRSA - add vancomycin if MRSA suspected"
    },
    {
      name: "Vancomycin",
      type: "Glycopeptide Antibiotic",
      action: "Inhibits bacterial cell wall synthesis by binding to D-Ala-D-Ala terminus of peptidoglycan precursors; active against gram-positive organisms including methicillin-resistant Staphylococcus aureus (MRSA) and Enterococcus",
      sideEffects: "Red man syndrome (histamine-mediated flushing, pruritus, hypotension from rapid infusion - NOT a true allergy), nephrotoxicity (monitor trough levels and renal function), ototoxicity (rare), thrombocytopenia",
      contra: "Known hypersensitivity to vancomycin; dose adjustment required in renal impairment",
      pearl: "Added to empiric sepsis coverage when MRSA is suspected (healthcare-associated infection, indwelling devices, prior MRSA colonisation, IV drug use); infuse over minimum 60 minutes (1 gram) to prevent red man syndrome - if reaction occurs, slow the infusion; red man syndrome is NOT an allergy; monitor vancomycin trough levels (target 15-20 mcg/mL for serious infections) and serum creatinine"
    }
  ],
  pearls: [
    "Every HOUR of delay in antibiotic administration increases sepsis mortality by approximately 7% - time to antibiotics is the single most critical intervention; aim for administration within 1 hour of sepsis recognition",
    "Blood cultures should be obtained BEFORE antibiotics but should NEVER delay antibiotic administration - if cultures cannot be drawn within minutes, start antibiotics and draw cultures as soon as possible afterward",
    "Lactate is not just a number - it represents tissue-level oxygen debt; a rising or persistently elevated lactate despite treatment is one of the most ominous signs in sepsis management",
    "Hypothermia (<36 C) in sepsis carries a WORSE prognosis than fever - the absence of fever does not mean the patient is not septic; it may indicate immune system exhaustion",
    "Norepinephrine is first-line vasopressor, NOT dopamine; norepinephrine has superior outcomes with fewer arrhythmias and better mortality in randomised trials",
    "Sepsis bundle elements must be completed within specific timeframes: blood cultures, lactate, and antibiotics within 1 hour; initial 30 mL/kg crystalloid bolus within 3 hours for hypotension or lactate >4",
    "Mottled skin (livedo reticularis pattern over the knees) is a clinical sign of severe microcirculatory dysfunction and predicts high mortality in septic shock",
    "qSOFA is a SCREENING tool, not diagnostic: RR >=22, altered mentation, SBP <=100 - 2 of 3 criteria should prompt further assessment for sepsis in a patient with suspected infection"
  ],
  quiz: [
    {
      question: "A patient in the emergency department has a suspected urinary tract infection with vital signs: T 39.2 C, HR 118, RR 26, BP 82/48, SpO2 94%. Serum lactate is 4.8 mmol/L. What is the FIRST priority nursing action?",
      options: [
        "Obtain a clean-catch urine specimen for culture and sensitivity",
        "Initiate the sepsis bundle: blood cultures, serum lactate (already drawn), administer broad-spectrum antibiotics, and begin 30 mL/kg crystalloid bolus",
        "Apply supplemental oxygen and position the patient comfortably",
        "Contact the patient's primary care provider for antibiotic recommendations"
      ],
      correct: 1,
      rationale: "This patient meets criteria for septic shock (suspected infection + hypotension + elevated lactate >4). The sepsis hour-1 bundle must be initiated immediately: blood cultures obtained, broad-spectrum antibiotics administered within 1 hour, and rapid crystalloid bolus (30 mL/kg) started. Each hour of delay increases mortality by approximately 7%. While oxygen and urine culture are appropriate, they are secondary to the sepsis bundle."
    },
    {
      question: "During vancomycin infusion, a patient develops flushing, pruritus, and redness of the face and upper body. What should the nurse do?",
      options: [
        "Stop the infusion permanently and document a vancomycin allergy",
        "Slow or temporarily stop the infusion, notify the provider, and administer diphenhydramine if ordered; this is likely red man syndrome, not a true allergy",
        "Administer epinephrine immediately for anaphylaxis",
        "Increase the infusion rate to complete the dose more quickly"
      ],
      correct: 1,
      rationale: "Red man syndrome is a histamine-mediated reaction to rapid vancomycin infusion, NOT a true allergy. It is managed by slowing or temporarily stopping the infusion and pre-medicating with antihistamines (diphenhydramine) before subsequent doses. It does NOT contraindicate future vancomycin use. True anaphylaxis would present with hypotension, bronchospasm, and angioedema. The infusion should never be increased during a reaction."
    },
    {
      question: "A nurse is monitoring a patient with sepsis. Initial serum lactate was 3.8 mmol/L. After 2 hours of fluid resuscitation and antibiotics, the repeat lactate is 5.2 mmol/L. What does this indicate?",
      options: [
        "The antibiotics are working and the lactate will decrease on its own",
        "The IV fluids are causing the lactate to rise and should be stopped",
        "Rising lactate despite treatment indicates worsening tissue hypoperfusion; the nurse should escalate care and notify the provider immediately",
        "A lactate of 5.2 is within normal limits and requires no action"
      ],
      correct: 2,
      rationale: "A rising lactate despite resuscitation efforts indicates worsening tissue hypoperfusion and cellular oxygen debt. This is one of the most concerning trends in sepsis management and requires immediate escalation: reassess fluid status, consider vasopressor initiation or dose increase, verify adequate antibiotic coverage, and search for uncontrolled source of infection. Normal lactate is <2 mmol/L; 5.2 is critically elevated."
    }
  ]
},

"cdiff-management-rpn": {
  title: "Clostridioides difficile (C. difficile) Management",
  cellular: {
    title: "Pathophysiology of C. difficile Infection",
    content: "Clostridioides difficile (formerly Clostridium difficile) is a gram-positive, spore-forming, anaerobic bacterium that is the most common cause of healthcare-associated infectious diarrhea. It is responsible for nearly all cases of pseudomembranous colitis and a significant proportion of antibiotic-associated diarrhea. C. difficile infection (CDI) ranges from mild diarrhea to fulminant colitis with toxic megacolon and death.\n\nThe pathogenesis requires two key events: disruption of the normal colonic microbiome (usually by antibiotics) and acquisition of toxigenic C. difficile organisms. The normal intestinal flora provides colonisation resistance - a diverse community of bacteria that competitively excludes pathogens. Antibiotics disrupt this protective barrier, creating an ecological niche for C. difficile colonisation.\n\nVirtually any antibiotic can cause CDI, but the highest-risk agents are fluoroquinolones (ciprofloxacin, levofloxacin), clindamycin, broad-spectrum cephalosporins, and carbapenems. Even a single dose of a high-risk antibiotic can predispose to CDI. The risk persists for up to 3 months after antibiotic exposure as the microbiome recovers.\n\nC. difficile is transmitted via the fecal-oral route, primarily through spores. The vegetative bacteria are killed by oxygen and gastric acid, but the spores are extraordinarily resistant: they survive on environmental surfaces for months, are resistant to heat, drying, and critically, to alcohol-based hand sanitisers. This spore resistance makes C. difficile particularly challenging to control in healthcare settings.\n\nOnce C. difficile colonises the disrupted colon, toxigenic strains produce two exotoxins: toxin A (enterotoxin) and toxin B (cytotoxin). Both toxins enter colonocytes by receptor-mediated endocytosis and inactivate Rho GTPases, which are essential for maintaining the actin cytoskeleton. This causes loss of cell shape, disruption of tight junctions, increased mucosal permeability, and cell death. The toxins also trigger intense mucosal inflammation with neutrophil recruitment, creating the characteristic inflammatory exudate.\n\nIn severe cases, the inflammatory exudate forms pseudomembranes - raised, yellowish-white plaques composed of fibrin, mucin, dead epithelial cells, and inflammatory cells adhering to the colonic mucosa. These are pathognomonic for C. difficile pseudomembranous colitis.\n\nThe hypervirulent strain BI/NAP1/027 (ribotype 027) emerged in the 2000s, producing 15-20 times more toxin A and B and an additional binary toxin (CDT). It is associated with more severe disease, higher recurrence rates, and higher mortality. It is often fluoroquinolone-resistant, which may explain its spread in healthcare facilities with high fluoroquinolone use.\n\nRecurrence is a major challenge: 20-25% of patients experience at least one recurrence after initial treatment, and the risk increases to 40-65% after a second episode. Recurrence occurs because antibiotic treatment for CDI further disrupts the microbiome, and persistent spores in the environment or the patient's own GI tract germinate when treatment ends."
  },
  riskFactors: [
    "Antibiotic use within the past 3 months (most important risk factor; highest risk: fluoroquinolones, clindamycin, cephalosporins, carbapenems)",
    "Age greater than 65 years (age-related immune decline, increased antibiotic exposure, more frequent hospitalisation)",
    "Hospitalisation or residence in a healthcare facility (nosocomial exposure to spores in the environment)",
    "Proton pump inhibitor (PPI) use (reduced gastric acid barrier against ingested organisms)",
    "Immunocompromised state: chemotherapy, organ transplant, HIV, inflammatory bowel disease treated with immunosuppressants",
    "Prior episode of CDI (20-25% recurrence after first episode; risk increases with each subsequent recurrence)",
    "Inflammatory bowel disease (both increased susceptibility and worse outcomes with CDI)",
    "Recent gastrointestinal surgery or nasogastric tube placement",
    "Enteral tube feeding (altered intestinal flora, reduced colonisation resistance)"
  ],
  diagnostics: [
    "Stool PCR (nucleic acid amplification test, NAAT): highly sensitive for detecting toxigenic C. difficile DNA; can detect colonisation without active infection (false positives in asymptomatic carriers); increasingly used as part of two-step testing",
    "Enzyme immunoassay (EIA) for toxin A and B: less sensitive than PCR but more specific for active toxin-producing infection; used in multi-step algorithms",
    "Two-step testing algorithm: initial screening with glutamate dehydrogenase (GDH) antigen (sensitive) followed by toxin EIA (specific); discordant results resolved with PCR",
    "Test only UNFORMED (liquid or semi-formed) stool - formed stool should NOT be tested for C. difficile; do NOT test for 'test of cure' after treatment",
    "Complete blood count: leukocytosis (WBC may reach 30,000-50,000 or higher in severe CDI); leukemoid reaction (WBC >40,000) is associated with very poor prognosis",
    "Basic metabolic panel: assess for acute kidney injury (elevated creatinine from dehydration or sepsis), electrolyte derangements from diarrhea",
    "Serum lactate and albumin: markers of severity; elevated lactate indicates tissue hypoperfusion; low albumin (<2.5 g/dL) is a severity marker",
    "Abdominal X-ray or CT: indicated for suspected complications - ileus, megacolon (>6 cm colonic diameter), perforation (free air), bowel wall thickening; CT may show colonic wall thickening with pericolonic stranding (accordion sign)"
  ],
  management: [
    "STOP the offending antibiotic if possible - this is the single most important initial intervention; if the antibiotic cannot be stopped, switch to a narrower-spectrum agent with lower CDI risk",
    "Non-severe initial episode: oral vancomycin 125 mg four times daily for 10 days (first-line) OR fidaxomicin 200 mg twice daily for 10 days (preferred if available due to lower recurrence risk)",
    "Severe CDI (WBC >15,000, creatinine >1.5x baseline, albumin <3): oral vancomycin 125 mg four times daily for 10 days; fidaxomicin is an alternative",
    "Fulminant CDI (hypotension, ileus, megacolon, organ failure): oral vancomycin 500 mg four times daily PLUS IV metronidazole 500 mg every 8 hours; consider vancomycin per rectum (retention enema) if ileus prevents oral delivery; early surgical consultation for potential colectomy",
    "First recurrence: fidaxomicin 200 mg twice daily for 10 days (preferred - lower recurrence rate), OR prolonged vancomycin taper (e.g., 125 mg QID x 14 days, then BID x 7 days, then daily x 7 days, then every other day x 7 days, then every 3 days x 14 days)",
    "Multiple recurrences: fecal microbiota transplant (FMT) after a minimum of two completed courses of standard therapy; FMT restores normal colonic microbiome and has 80-90% success rate",
    "Bezlotoxumab: monoclonal antibody against C. difficile toxin B administered as single IV infusion during CDI treatment to reduce recurrence risk in high-risk patients",
    "Do NOT use anti-diarrheal agents (loperamide) - they impair toxin clearance and can precipitate toxic megacolon"
  ],
  nursingActions: [
    "Implement CONTACT PRECAUTIONS immediately: private room, gown and gloves for all room entry, dedicated equipment (stethoscope, thermometer, blood pressure cuff)",
    "HAND WASHING with SOAP and WATER - alcohol-based hand sanitisers do NOT kill C. difficile spores; mechanical friction with soap and water physically removes spores",
    "Monitor stool output: frequency, volume, consistency (must be unformed to test); document all episodes; report increasing frequency or signs of severity",
    "Monitor for severe or fulminant disease: abdominal distension, increasing pain, high fever, WBC >15,000, rising creatinine, hypotension, absent bowel sounds, peritoneal signs - escalate immediately",
    "Administer oral vancomycin as prescribed: it acts LOCALLY in the GI tract and is NOT absorbed systemically; ensure the patient takes it orally (not IV vancomycin for CDI)",
    "Maintain fluid and electrolyte balance: encourage oral fluids, administer IV fluids as ordered, monitor electrolytes (potassium, magnesium lost in diarrhea), strict intake and output",
    "Perineal skin care: frequent cleansing with gentle wipes, moisture barrier cream, proper absorbent products to prevent incontinence-associated dermatitis",
    "Environmental cleaning: C. difficile spores survive standard cleaning; use bleach-based (sodium hypochlorite) disinfectant for terminal and daily room cleaning; ensure environmental services follow CDI protocols",
    "Educate about antibiotic stewardship: explain the connection between antibiotic use and CDI; encourage patients to question whether antibiotics are truly necessary for future illnesses and to never self-medicate with leftover antibiotics"
  ],
  assessmentFindings: [
    "Watery diarrhea (3 or more unformed stools in 24 hours) - hallmark symptom; may be profuse (10-15 episodes/day in severe cases)",
    "Abdominal cramping and lower abdominal tenderness",
    "Low-grade fever (more common in mild-moderate disease)",
    "Foul-smelling stool with distinctive sweet odour (experienced nurses can often recognise CDI by stool odour)",
    "Stool may contain mucus but frank blood is uncommon in uncomplicated CDI (bloody stool suggests alternative or concurrent diagnosis)",
    "Leukocytosis (often pronounced; WBC >20,000 is a severity marker)",
    "Signs of dehydration: tachycardia, hypotension, decreased urine output, dry mucous membranes"
  ],
  signs: {
    left: [
      "Watery diarrhea (3+ unformed stools/day)",
      "Lower abdominal cramping and tenderness",
      "Low-grade fever",
      "Foul-smelling stool",
      "Leukocytosis"
    ],
    right: [
      "Fulminant colitis: high fever, severe abdominal pain, distension",
      "Toxic megacolon: colonic dilation >6 cm with systemic toxicity",
      "WBC >40,000 (leukemoid reaction - very high mortality)",
      "Paralytic ileus (absent diarrhea despite severe colitis - paradoxical 'improvement')",
      "Septic shock: hypotension, tachycardia, altered mental status, elevated lactate"
    ]
  },
  medications: [
    {
      name: "Oral Vancomycin (for C. difficile)",
      type: "Glycopeptide Antibiotic (Oral/Non-Absorbed)",
      action: "Inhibits bacterial cell wall synthesis; when given ORALLY, vancomycin is NOT absorbed systemically and achieves very high intraluminal concentrations in the colon, directly killing C. difficile vegetative cells at the site of infection",
      sideEffects: "Nausea, abdominal discomfort, dysgeusia (altered taste); minimal systemic side effects because oral vancomycin is not absorbed; no nephrotoxicity or ototoxicity risk (unlike IV vancomycin)",
      contra: "Known hypersensitivity to vancomycin",
      pearl: "CRITICAL: oral vancomycin for C. difficile is COMPLETELY DIFFERENT from IV vancomycin for systemic infections; IV vancomycin does NOT reach the colon in therapeutic concentrations and is NOT effective for CDI; conversely, oral vancomycin does not treat systemic infections; first-line for initial and recurrent CDI; dose is 125 mg QID for 10 days (NOT the higher IV doses)"
    },
    {
      name: "Fidaxomicin (Dificid)",
      type: "Macrocyclic Antibiotic (Narrow-Spectrum)",
      action: "Inhibits bacterial RNA polymerase, preventing transcription; narrow-spectrum activity primarily against C. difficile with minimal disruption of normal colonic flora; this microbiome-sparing property reduces recurrence rates compared to vancomycin",
      sideEffects: "Nausea, vomiting, abdominal pain, GI bleeding (rare), anaemia (rare); generally well tolerated",
      contra: "Known hypersensitivity to fidaxomicin; not systemically absorbed so minimal systemic concerns",
      pearl: "Preferred over vancomycin when available, especially for first recurrence, because it has 50% lower recurrence rate due to its narrow spectrum sparing normal gut flora; more expensive than vancomycin; take with or without food; 200 mg twice daily for 10 days"
    },
    {
      name: "IV Metronidazole (for Fulminant CDI)",
      type: "Nitroimidazole Antibiotic",
      action: "Enters bacterial cells where it is reduced to reactive intermediates that damage DNA; the IV formulation is used in fulminant CDI because it is secreted into the intestinal lumen via biliary and intestinal mucosal secretion, reaching the colon even when oral medications cannot (ileus)",
      sideEffects: "Metallic taste, nausea, disulfiram-like reaction with alcohol, peripheral neuropathy (prolonged use), dark urine, headache",
      contra: "First trimester of pregnancy, concurrent alcohol consumption",
      pearl: "In fulminant CDI, IV metronidazole is given IN ADDITION TO oral vancomycin (not as replacement); it provides an alternative delivery route when ileus prevents oral vancomycin from reaching the colon; IV metronidazole ALONE is no longer recommended for any severity of CDI (inferior to oral vancomycin); avoid alcohol during and for 48-72 hours after treatment"
    }
  ],
  pearls: [
    "Alcohol-based hand sanitisers do NOT kill C. difficile spores - SOAP and WATER with mechanical friction is the ONLY effective hand hygiene method for CDI contact precautions",
    "IV vancomycin does NOT treat C. difficile - only ORAL vancomycin reaches therapeutic concentrations in the colon; this is one of the most commonly confused clinical facts",
    "Do NOT test formed stool for C. difficile and do NOT perform test-of-cure after treatment - testing should only be done on unformed stool from symptomatic patients",
    "Sudden cessation of diarrhea in a patient with severe CDI is NOT improvement - it may indicate ileus or toxic megacolon, which are life-threatening complications",
    "Loperamide and other anti-diarrheal agents are CONTRAINDICATED in CDI - they trap toxins in the colon and can precipitate toxic megacolon",
    "C. difficile spores survive on environmental surfaces for MONTHS and resist standard cleaning agents - only bleach-based disinfectants are effective for environmental decontamination",
    "Fecal microbiota transplant (FMT) has an 80-90% success rate for recurrent CDI by restoring the protective normal colonic microbiome - it is recommended after 2+ recurrences",
    "Proton pump inhibitors independently increase CDI risk by reducing the gastric acid barrier - reassess PPI necessity in patients with CDI or CDI risk factors"
  ],
  quiz: [
    {
      question: "A nurse caring for a patient with C. difficile infection uses alcohol-based hand sanitiser when exiting the patient's room. What should the charge nurse address?",
      options: [
        "This is appropriate hand hygiene for any infectious patient",
        "Alcohol-based sanitiser does not kill C. difficile spores; soap and water hand washing with friction is required",
        "Double-gloving eliminates the need for hand hygiene",
        "Hand hygiene is only needed before entering the room, not when leaving"
      ],
      correct: 1,
      rationale: "C. difficile spores are resistant to alcohol-based hand sanitisers. Only soap and water with mechanical friction physically removes spores from the hands. This is a critical infection control principle for CDI. Hand hygiene is required both when entering and leaving the room. Gloves reduce but do not eliminate hand contamination."
    },
    {
      question: "A patient receiving IV antibiotics for a wound infection develops watery diarrhea (8 episodes in 24 hours), abdominal cramping, and a temperature of 38.5 C. C. difficile toxin test is positive. The physician orders loperamide for symptom control. What should the nurse do?",
      options: [
        "Administer the loperamide as ordered to reduce the patient's discomfort",
        "Question the order because loperamide is contraindicated in C. difficile infection as it can precipitate toxic megacolon",
        "Administer the loperamide with a dose of oral vancomycin",
        "Hold the loperamide only if the patient has a fever"
      ],
      correct: 1,
      rationale: "Anti-diarrheal agents such as loperamide are CONTRAINDICATED in C. difficile infection. Loperamide slows intestinal motility, trapping toxin-producing bacteria and their toxins in the colon, which can precipitate toxic megacolon - a life-threatening complication. The nurse should question this order and discuss with the prescriber."
    },
    {
      question: "Which antibiotic regimen is first-line for a non-severe initial episode of C. difficile infection?",
      options: [
        "IV vancomycin 1 gram every 12 hours for 14 days",
        "Oral metronidazole 500 mg three times daily for 10 days",
        "Oral vancomycin 125 mg four times daily for 10 days",
        "Oral ciprofloxacin 500 mg twice daily for 7 days"
      ],
      correct: 2,
      rationale: "Oral vancomycin 125 mg four times daily for 10 days is the current first-line treatment for initial non-severe CDI. IV vancomycin does not reach the colon in therapeutic concentrations. Oral metronidazole is no longer recommended as first-line due to inferior efficacy. Ciprofloxacin is an antibiotic that actually INCREASES CDI risk and would not be used to treat it."
    }
  ]
},

"covid-basics-rpn": {
  title: "COVID-19 Basics",
  cellular: {
    title: "Pathophysiology of COVID-19",
    content: "COVID-19 is the disease caused by severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2), a positive-sense single-stranded RNA virus belonging to the Betacoronavirus genus. The virus emerged in late 2019 and was declared a pandemic by the WHO in March 2020. Understanding the pathophysiology remains essential for clinical nursing practice as COVID-19 has become an endemic respiratory illness.\n\nSARS-CoV-2 enters human cells through the angiotensin-converting enzyme 2 (ACE2) receptor, which is widely expressed on type II alveolar pneumocytes, endothelial cells, cardiac myocytes, enterocytes, and renal tubular cells. The viral spike protein binds to ACE2, and the serine protease TMPRSS2 facilitates viral-cell membrane fusion, allowing viral RNA entry. ACE2 distribution explains the multi-organ tropism of SARS-CoV-2.\n\nIn the respiratory tract, the virus initially infects upper airway epithelial cells, causing symptoms similar to the common cold (rhinorrhea, sore throat, cough). In most individuals, the immune response contains the infection at this stage. However, in a subset of patients, the virus spreads to the lower respiratory tract, infecting type II alveolar pneumocytes. These cells are critical for surfactant production and alveolar repair. Their destruction triggers inflammatory cascades that recruit neutrophils and macrophages, causing diffuse alveolar damage (DAD) - the pathological hallmark of COVID-19 pneumonia and the basis for acute respiratory distress syndrome (ARDS).\n\nThe cytokine storm (hyperinflammatory response) is a key driver of severe COVID-19. Dysregulated release of pro-inflammatory cytokines (IL-6, IL-1beta, TNF-alpha, interferon-gamma) and chemokines causes systemic inflammation, endothelial activation, and capillary leak. This mirrors the inflammatory cascade seen in sepsis and contributes to multi-organ failure.\n\nCOVID-19-associated coagulopathy is a distinctive feature. Endothelial damage, platelet activation, and complement activation create a prothrombotic state. Elevated D-dimer is a hallmark finding, and venous thromboembolism (DVT, PE), arterial thrombosis (stroke, myocardial infarction), and microvascular thrombosis are significantly increased. Pulmonary microvascular thrombosis likely contributes to the profound hypoxemia seen in severe cases.\n\nA striking clinical feature of COVID-19 is 'happy hypoxemia' - some patients tolerate extremely low oxygen saturations (SpO2 60-70%) with minimal dyspnea. This is thought to result from preserved lung compliance (the lungs initially remain easy to ventilate despite poor gas exchange) and a shift in the oxygen-hemoglobin dissociation curve.\n\nLong COVID (post-acute sequelae of SARS-CoV-2, PASC) affects an estimated 10-30% of infected individuals, with persistent symptoms lasting weeks to months after acute infection. Common manifestations include fatigue, brain fog, dyspnea, palpitations, chest pain, and exercise intolerance. Proposed mechanisms include persistent viral reservoirs, autoimmunity, microbiome disruption, endothelial dysfunction, and autonomic dysregulation."
  },
  riskFactors: [
    "Age greater than 65 years (strongest risk factor for severe disease and death)",
    "Obesity (BMI >30, particularly >40; increases risk of hospitalisation, ICU admission, and death)",
    "Diabetes mellitus (both type 1 and type 2; poor glycemic control increases severity)",
    "Cardiovascular disease (heart failure, coronary artery disease, cardiomyopathy)",
    "Chronic lung disease (COPD, asthma, interstitial lung disease, cystic fibrosis)",
    "Immunocompromised states: organ transplant, cancer treatment, HIV (CD4 <200), immunosuppressive medications",
    "Chronic kidney disease (especially dialysis patients)",
    "Pregnancy (increased ICU admission, preterm delivery, and maternal mortality risk)",
    "Smoking (both current and former) and substance use disorders",
    "Unvaccinated status (vaccination dramatically reduces severe disease, hospitalisation, and death)"
  ],
  diagnostics: [
    "RT-PCR (reverse transcription polymerase chain reaction): gold standard for diagnosis; detects SARS-CoV-2 RNA from nasopharyngeal swab; highly sensitive and specific; results typically in hours to 1 day",
    "Rapid antigen test: detects viral nucleocapsid protein; results in 15-30 minutes; less sensitive than PCR (higher false negative rate, especially in early infection or asymptomatic individuals); positive results are highly specific",
    "Chest X-ray: bilateral peripheral ground-glass opacities and consolidation in COVID-19 pneumonia; may be normal in early or mild disease",
    "CT chest: more sensitive than X-ray; bilateral ground-glass opacities, crazy-paving pattern, peripheral and basal predominance; useful for assessing severity and complications (PE on CT pulmonary angiogram)",
    "Blood work: lymphopenia (most characteristic lab finding), elevated CRP, elevated ferritin, elevated D-dimer (indicates coagulopathy/thrombosis risk), elevated LDH, elevated IL-6",
    "Procalcitonin: typically low in pure viral infection; elevation suggests bacterial co-infection",
    "Arterial blood gas: assess oxygenation and acid-base status; P/F ratio (PaO2/FiO2) classifies ARDS severity",
    "D-dimer: markedly elevated levels (>1 mcg/mL) associated with increased thrombotic events and mortality"
  ],
  management: [
    "Mild disease (no pneumonia, SpO2 >94%): supportive care, symptom management, monitoring for deterioration; high-risk patients may receive antivirals (nirmatrelvir/ritonavir within 5 days of symptom onset)",
    "Moderate disease (pneumonia without hypoxemia): supplemental oxygen to maintain SpO2 92-96%; prone positioning while awake (improves oxygenation); monitor for progression",
    "Severe disease (SpO2 <94%, respiratory rate >30, PaO2/FiO2 <300): high-flow nasal cannula, dexamethasone 6 mg daily for up to 10 days (reduces mortality in those requiring supplemental oxygen), remdesivir (antiviral), consider tocilizumab or baricitinib for inflammatory markers",
    "Critical disease (ARDS, septic shock, multi-organ failure): mechanical ventilation with lung-protective strategy (low tidal volume 6 mL/kg, PEEP optimisation, plateau pressure <30), prone positioning (16+ hours/day improves mortality in moderate-severe ARDS), neuromuscular blockade if needed",
    "Anticoagulation: prophylactic dose anticoagulation for all hospitalised patients (higher thrombotic risk); therapeutic dose anticoagulation considered for non-critically ill patients with elevated D-dimer per institutional protocol",
    "Corticosteroids: dexamethasone 6 mg daily for 10 days ONLY for patients requiring supplemental oxygen (RECOVERY trial showed mortality benefit); do NOT use in patients NOT requiring oxygen (may worsen outcomes)",
    "Vaccination: remains the most effective strategy for preventing severe disease, hospitalisation, and death; recommended for all eligible individuals with updated boosters"
  ],
  nursingActions: [
    "Implement appropriate isolation: airborne + contact precautions; N95 or higher respirator (or PAPR), eye protection (goggles or face shield), gown, and gloves for all patient contact; negative pressure room preferred for aerosol-generating procedures",
    "Monitor respiratory status continuously: SpO2 (target 92-96%), respiratory rate, work of breathing (accessory muscle use, nasal flaring, paradoxical breathing), ability to speak in full sentences",
    "Implement awake prone positioning for patients on supplemental oxygen: encourage lying face-down for 1-2 hours at a time, alternating positions, for a total of 8-16 hours daily when tolerated; improves V/Q matching and oxygenation",
    "Monitor for clinical deterioration: increasing oxygen requirements, tachypnea (RR >30), SpO2 consistently <92% despite supplemental oxygen, altered mental status, hemodynamic instability",
    "Administer dexamethasone as prescribed for patients requiring oxygen: ensure blood glucose monitoring (steroid-induced hyperglycemia); do NOT initiate in patients not requiring supplemental oxygen",
    "DVT prevention: pharmacological prophylaxis as ordered (LMWH), sequential compression devices, early mobilisation when safe; monitor for VTE signs (leg swelling, pain, sudden dyspnea, pleuritic chest pain)",
    "Monitor coagulation markers as ordered: trending D-dimer helps identify patients at highest thrombotic risk",
    "Provide psychological support: isolation, communication barriers from PPE, fear, separation from family cause significant distress; facilitate virtual family visits, maintain human connection despite barriers",
    "Post-discharge education: ongoing monitoring of symptoms, recognition of worsening (return to ED for increasing dyspnea, SpO2 <92%, chest pain, confusion), follow-up appointments, and long COVID awareness"
  ],
  assessmentFindings: [
    "Fever (present in ~80%), cough (usually dry), dyspnea (hallmark of progression to pneumonia), fatigue and myalgia",
    "Anosmia and ageusia (loss of smell and taste - relatively specific for COVID-19, more common in earlier variants)",
    "Tachypnea (RR >22) and tachycardia; 'happy hypoxemia' (low SpO2 with minimal distress) is characteristic",
    "Bilateral crackles on auscultation (pneumonia); may progress to decreased breath sounds (consolidation or effusion)",
    "GI symptoms: nausea, diarrhea, abdominal pain (present in 10-20%)",
    "Skin findings: COVID toes (pernio-like lesions), morbilliform rash, urticaria",
    "Neurological: headache, confusion (especially elderly), dizziness, anosmia"
  ],
  signs: {
    left: [
      "Fever, dry cough, and fatigue",
      "Dyspnea with tachypnea",
      "Anosmia and ageusia",
      "Happy hypoxemia (low SpO2 without proportionate distress)",
      "Bilateral crackles on auscultation"
    ],
    right: [
      "ARDS (severe hypoxemia, bilateral infiltrates, mechanical ventilation needed)",
      "Pulmonary embolism (sudden worsening dyspnea, pleuritic chest pain, hemodynamic instability)",
      "Cytokine storm (high fever, multi-organ dysfunction, markedly elevated inflammatory markers)",
      "Cardiac complications (myocarditis, arrhythmias, acute coronary syndrome)",
      "Acute kidney injury (oliguria, rising creatinine)"
    ]
  },
  medications: [
    {
      name: "Dexamethasone",
      type: "Corticosteroid",
      action: "Potent anti-inflammatory and immunosuppressive corticosteroid that suppresses the hyperinflammatory cytokine response driving severe COVID-19 pneumonia and ARDS; reduces endothelial activation, capillary leak, and fibroproliferative response in damaged lungs",
      sideEffects: "Hyperglycemia (most common, especially in diabetics - monitor glucose every 4-6 hours), immunosuppression (increased secondary infection risk), insomnia, mood changes, GI upset, adrenal suppression if prolonged use",
      contra: "COVID-19 patients NOT requiring supplemental oxygen (RECOVERY trial showed potential harm in this group); active untreated bacterial or fungal infection; use caution in uncontrolled diabetes",
      pearl: "The RECOVERY trial demonstrated 35% mortality reduction in mechanically ventilated patients and 20% reduction in those on supplemental oxygen; 6 mg daily (oral or IV) for up to 10 days; do NOT give to patients who do NOT require oxygen as it may impair viral clearance in the early immune response phase; monitor blood glucose closely"
    },
    {
      name: "Nirmatrelvir/Ritonavir (Paxlovid)",
      type: "Protease Inhibitor Antiviral Combination",
      action: "Nirmatrelvir inhibits SARS-CoV-2 main protease (Mpro/3CLpro), preventing viral polyprotein processing essential for viral replication; ritonavir is a CYP3A4 inhibitor that boosts nirmatrelvir levels by slowing its hepatic metabolism (pharmacokinetic enhancer, not directly antiviral)",
      sideEffects: "Dysgeusia (metallic/altered taste - most common), diarrhea, myalgia, hypertension; numerous drug interactions via CYP3A4 inhibition by ritonavir (statins, calcium channel blockers, immunosuppressants, anticoagulants - MUST review all medications)",
      contra: "Severe hepatic impairment, severe renal impairment (eGFR <30), concurrent medications with dangerous CYP3A4 interactions (certain statins, ergot alkaloids, some sedatives); requires dose adjustment for moderate renal impairment",
      pearl: "Must be started within 5 days of symptom onset for benefit; indicated for mild-moderate COVID in high-risk patients to prevent progression to severe disease; ritonavir's CYP3A4 inhibition creates MANY drug interactions - a comprehensive medication review is MANDATORY before prescribing; viral rebound (symptom recurrence after completion) occurs in some patients but is usually self-limited"
    },
    {
      name: "Enoxaparin (Lovenox)",
      type: "Low-Molecular-Weight Heparin (VTE Prophylaxis)",
      action: "Binds antithrombin III and preferentially inhibits Factor Xa (more selective than unfractionated heparin), preventing thrombin generation and clot formation; used for VTE prophylaxis in the prothrombotic state of COVID-19",
      sideEffects: "Bleeding (most significant), injection site hematoma, thrombocytopenia (less HIT risk than UFH), elevated liver enzymes",
      contra: "Active major bleeding, HIT with positive antibodies, severe thrombocytopenia (<50,000), severe renal impairment (eGFR <30 - use unfractionated heparin instead or adjust dose)",
      pearl: "All hospitalised COVID-19 patients should receive thromboprophylaxis (prophylactic enoxaparin 40 mg SC daily or weight-based dosing); the ATTACC and REMAP-CAP trials showed therapeutic-dose anticoagulation improved outcomes in non-critically ill patients with elevated D-dimer; monitor anti-Xa levels in renal impairment and extremes of body weight; teach patients proper subcutaneous injection technique for post-discharge prophylaxis if prescribed"
    }
  ],
  pearls: [
    "Dexamethasone reduces COVID-19 mortality ONLY in patients requiring supplemental oxygen - do NOT give to patients breathing room air as it may impair viral clearance and worsen outcomes",
    "Happy hypoxemia is characteristic of COVID-19: patients may have SpO2 of 70-80% with minimal respiratory distress; do not rely solely on patient appearance to assess severity - continuous pulse oximetry is essential",
    "COVID-19 is a prothrombotic disease: ALL hospitalised patients require VTE prophylaxis; D-dimer trending helps identify those at highest risk for thrombotic complications",
    "Prone positioning (lying face-down) improves oxygenation by redistributing perfusion to better-ventilated lung regions; can be done in awake, non-intubated patients and should be encouraged for 8-16 hours daily",
    "Lymphopenia is the most characteristic laboratory finding in COVID-19 and correlates with disease severity - a decreasing lymphocyte count is a concerning trend",
    "Rapid antigen tests are less sensitive than PCR - a negative rapid test does NOT rule out COVID-19, especially in symptomatic patients; PCR confirmation should be considered if clinical suspicion remains high",
    "Nirmatrelvir/ritonavir (Paxlovid) has extensive drug interactions due to ritonavir's CYP3A4 inhibition - medication reconciliation is critical before prescribing",
    "Long COVID affects an estimated 10-30% of infected individuals; symptoms can persist for months and significantly impact quality of life; validate patient symptoms and refer to appropriate follow-up"
  ],
  quiz: [
    {
      question: "A hospitalised COVID-19 patient on 4 L/min nasal cannula has SpO2 of 91%. The provider orders dexamethasone 6 mg daily. What is the rationale?",
      options: [
        "Dexamethasone treats the viral infection directly by killing SARS-CoV-2",
        "Dexamethasone suppresses the hyperinflammatory response that drives severe COVID-19 pneumonia and has proven mortality benefit in patients requiring supplemental oxygen",
        "Dexamethasone is given to all COVID-19 patients regardless of oxygen requirement",
        "Dexamethasone prevents future COVID-19 reinfection"
      ],
      correct: 1,
      rationale: "The RECOVERY trial demonstrated that dexamethasone reduces mortality in COVID-19 patients requiring supplemental oxygen by suppressing the damaging hyperinflammatory cytokine response. It does not have direct antiviral activity. Importantly, it should NOT be given to patients not requiring oxygen as it may impair the early immune response needed for viral clearance."
    },
    {
      question: "A nurse notices a COVID-19 patient has SpO2 of 78% but appears comfortable, speaking in full sentences, with minimal respiratory distress. What should the nurse recognise?",
      options: [
        "The pulse oximeter is malfunctioning and should be replaced",
        "The patient is fine since they appear comfortable and do not need intervention",
        "This may be 'happy hypoxemia' characteristic of COVID-19; the patient needs immediate supplemental oxygen and provider notification despite their comfortable appearance",
        "Low SpO2 without distress indicates the patient is recovering well"
      ],
      correct: 2,
      rationale: "Happy hypoxemia is a well-described phenomenon in COVID-19 where patients tolerate extremely low oxygen saturations with minimal distress. Despite the patient's comfortable appearance, an SpO2 of 78% represents dangerous hypoxemia that requires immediate supplemental oxygen and provider notification. The comfortable appearance is deceptive and should not delay intervention."
    },
    {
      question: "A COVID-19 patient is breathing room air with SpO2 98% and no respiratory symptoms. A colleague suggests starting dexamethasone prophylactically. What is the correct response?",
      options: [
        "Agree and administer dexamethasone 6 mg daily to prevent deterioration",
        "Disagree because dexamethasone is only beneficial in patients requiring supplemental oxygen; in those breathing room air, it may impair viral clearance and worsen outcomes",
        "Administer a reduced dose of dexamethasone 2 mg daily for prevention",
        "Give dexamethasone only if the patient develops a fever"
      ],
      correct: 1,
      rationale: "The RECOVERY trial showed that dexamethasone's mortality benefit is limited to patients requiring supplemental oxygen. In patients breathing room air (not hypoxemic), dexamethasone may impair the early immune response needed for viral clearance, potentially worsening outcomes. It should not be given prophylactically to non-hypoxemic patients."
    }
  ]
},

"hiv-basics-rpn": {
  title: "HIV/AIDS Basics",
  cellular: {
    title: "Pathophysiology of HIV Infection",
    content: "Human immunodeficiency virus (HIV) is a retrovirus that specifically targets and destroys CD4+ T-helper lymphocytes, which are the central coordinators of the adaptive immune system. Without these cells, the body becomes progressively unable to mount effective immune responses, eventually leading to acquired immunodeficiency syndrome (AIDS) - defined as a CD4 count below 200 cells/microlitre or the presence of an AIDS-defining opportunistic infection.\n\nHIV exists as two types: HIV-1 (responsible for >95% of infections worldwide) and HIV-2 (less virulent, primarily in West Africa). The virus is transmitted through three main routes: sexual contact (most common globally), percutaneous exposure to infected blood (needlestick injuries, injection drug use with shared equipment), and vertical (mother-to-child) transmission during pregnancy, delivery, or breastfeeding.\n\nThe viral lifecycle begins with HIV binding to the CD4 receptor and a co-receptor (CCR5 or CXCR4) on the target cell surface. The viral envelope fuses with the cell membrane, and viral RNA and enzymes enter the cell. Reverse transcriptase (an RNA-dependent DNA polymerase unique to retroviruses) converts viral RNA into double-stranded DNA. This viral DNA is transported to the nucleus where integrase incorporates it into the host genome (provirus). The integrated provirus uses host cell machinery to produce new viral RNA and proteins. Protease cleaves viral polyproteins into functional components, and new viral particles assemble and bud from the cell surface, ready to infect more CD4 cells.\n\nThe natural history of untreated HIV progresses through three stages. Acute HIV infection (2-4 weeks after exposure) presents as an acute retroviral syndrome in 40-90% of patients: fever, lymphadenopathy, pharyngitis, rash (maculopapular), myalgia, and sometimes aseptic meningitis. During this phase, viral load is extremely high (millions of copies/mL) and CD4 count drops sharply. The patient is highly infectious. Antibody tests may still be negative (window period), making diagnosis reliant on HIV RNA viral load or p24 antigen testing.\n\nClinical latency (chronic HIV) follows, lasting an average of 8-10 years without treatment. The immune system partially controls viral replication, viral load reaches a set point, and CD4 count gradually declines (approximately 50-70 cells/year). Patients are typically asymptomatic or have persistent generalised lymphadenopathy but remain infectious.\n\nAIDS develops when CD4 count falls below 200 cells/microlitre or when AIDS-defining conditions occur. These include opportunistic infections (Pneumocystis jirovecii pneumonia, cerebral toxoplasmosis, cryptococcal meningitis, esophageal candidiasis, CMV retinitis, Mycobacterium avium complex), opportunistic malignancies (Kaposi sarcoma, primary CNS lymphoma, invasive cervical cancer, non-Hodgkin lymphoma), and HIV wasting syndrome.\n\nAntiretroviral therapy (ART) has transformed HIV from a fatal disease to a manageable chronic condition. ART suppresses viral replication to undetectable levels (<50 copies/mL), allowing CD4 immune reconstitution. The principle of U=U (Undetectable equals Untransmittable) is now established: patients with sustained undetectable viral loads do not transmit HIV sexually."
  },
  riskFactors: [
    "Unprotected sexual intercourse (receptive anal sex carries highest per-act risk, followed by receptive vaginal sex)",
    "Multiple sexual partners and concurrent partnerships",
    "Injection drug use with shared needles or equipment",
    "Other sexually transmitted infections (especially ulcerative - herpes, syphilis - which disrupt mucosal barriers)",
    "Occupational exposure: healthcare workers with needlestick injuries (risk approximately 0.3% per percutaneous exposure to HIV-positive blood)",
    "Perinatal transmission: mother-to-child without antiretroviral therapy or preventive measures (15-30% transmission rate without intervention; <1% with ART)",
    "Male-to-male sexual contact (highest prevalence group in developed countries)",
    "Commercial sex work",
    "Geographic location: sub-Saharan Africa has highest global HIV prevalence"
  ],
  diagnostics: [
    "4th-generation combination antigen/antibody test: detects both HIV-1/2 antibodies AND p24 antigen; positive as early as 2 weeks post-infection (can detect acute infection before antibodies develop); recommended initial screening test",
    "HIV-1/2 antibody differentiation assay: confirms initial reactive screening test and differentiates HIV-1 from HIV-2",
    "HIV RNA viral load (quantitative PCR): detects and quantifies viral RNA; used to confirm acute infection (when antibody may be negative), monitor treatment response, and detect treatment failure; target is undetectable (<50 copies/mL) on ART",
    "CD4+ T-cell count: quantifies immune function; guides prophylaxis decisions and monitors immune reconstitution; AIDS defined as <200 cells/mcL",
    "HIV resistance testing (genotypic): performed at diagnosis and at treatment failure to identify drug resistance mutations and guide antiretroviral selection",
    "Baseline labs at diagnosis: CBC, CMP, lipid panel, HbA1c, hepatitis A/B/C serology, syphilis screening, toxoplasma IgG, CMV IgG, tuberculosis testing (IGRA), Pap smear in women, urinalysis"
  ],
  management: [
    "Antiretroviral therapy (ART): recommended for ALL HIV-positive individuals regardless of CD4 count; early treatment improves outcomes and prevents transmission; current first-line regimens typically include 2 NRTIs + 1 INSTI (e.g., tenofovir/emtricitabine + dolutegravir or bictegravir)",
    "Treatment adherence: >95% adherence is needed to maintain viral suppression and prevent drug resistance; missed doses allow viral replication and emergence of resistant mutations",
    "Opportunistic infection prophylaxis: Pneumocystis (PCP) prophylaxis with TMP-SMX when CD4 <200; Mycobacterium avium complex (MAC) prophylaxis with azithromycin when CD4 <50; toxoplasmosis prophylaxis (TMP-SMX covers both PCP and toxo)",
    "Viral load monitoring: every 4-8 weeks after starting ART until undetectable, then every 3-6 months; CD4 count every 3-6 months until immune reconstitution",
    "Pre-exposure prophylaxis (PrEP): tenofovir/emtricitabine (Truvada) or tenofovir alafenamide/emtricitabine (Descovy) for HIV-negative individuals at high risk; reduces acquisition by >99% when taken consistently; injectable cabotegravir (Apretude) every 2 months is an alternative",
    "Post-exposure prophylaxis (PEP): 3-drug ART regimen started within 72 hours of potential HIV exposure (ideally within 2 hours); continued for 28 days; indicated for needlestick injuries, sexual assault, and high-risk sexual exposure",
    "Prevention of mother-to-child transmission: ART throughout pregnancy, IV zidovudine during delivery, neonatal ART prophylaxis; formula feeding in resource-rich settings (avoid breastfeeding if alternatives are safe and available)"
  ],
  nursingActions: [
    "Implement standard precautions (blood and body fluid precautions) for all patients: proper sharps disposal, PPE when contact with blood/body fluids anticipated; HIV is NOT transmitted through casual contact, coughing, sharing utensils, or intact skin",
    "Administer antiretroviral medications as prescribed: ensure correct timing and food requirements; educate that ART must be taken consistently and is a lifelong commitment",
    "Emphasise medication adherence: >95% adherence is required for viral suppression; discuss barriers (side effects, cost, stigma, complex regimens); offer adherence support tools (pill organisers, phone alarms, directly observed therapy)",
    "Monitor for ART side effects: nausea, diarrhea, rash (common early and often resolve); metabolic complications with long-term use (dyslipidemia, insulin resistance, lipodystrophy, renal toxicity with tenofovir, bone density loss)",
    "Monitor labs as ordered: viral load and CD4 count trends, renal function (especially with tenofovir), lipid panel, liver function, HbA1c",
    "Assess for opportunistic infections: oral thrush (candidiasis), unexplained weight loss, chronic diarrhea, night sweats, persistent lymphadenopathy, skin lesions (Kaposi sarcoma), neurological changes (confusion, headache), respiratory symptoms (PCP)",
    "Provide confidential psychosocial support: HIV diagnosis causes profound emotional distress; address depression, anxiety, stigma, disclosure concerns, relationship impacts; connect with social workers, support groups, and mental health services",
    "Educate on transmission prevention: consistent condom use, PrEP for serodiscordant partners, U=U principle (undetectable viral load = untransmittable), avoid sharing needles, notify sexual partners",
    "Needlestick injury management: immediate wound care (wash with soap and water), baseline testing, initiate PEP within 72 hours (ideally within 2 hours), follow-up testing at 6 weeks, 3 months, and 6 months"
  ],
  assessmentFindings: [
    "Acute retroviral syndrome (2-4 weeks after infection): fever, lymphadenopathy, pharyngitis, diffuse maculopapular rash, myalgia, headache - often mistaken for mononucleosis or influenza",
    "Clinical latency: often asymptomatic; persistent generalised lymphadenopathy may be the only finding",
    "Progressive disease: unexplained weight loss (>10%), chronic diarrhea, persistent fever, night sweats, recurrent infections",
    "Oral findings: oral candidiasis (thrush - white patches on tongue and buccal mucosa), oral hairy leukoplakia (white corrugated patches on lateral tongue, associated with EBV)",
    "Skin findings: seborrheic dermatitis, herpes zoster (shingles in younger patients), Kaposi sarcoma (purple-violet raised lesions), molluscum contagiosum",
    "Respiratory: Pneumocystis pneumonia (PCP) - dry cough, progressive dyspnea, bilateral diffuse infiltrates; most common AIDS-defining illness",
    "Neurological: cognitive decline, headache, focal deficits (toxoplasmosis), progressive multifocal leukoencephalopathy (PML)"
  ],
  signs: {
    left: [
      "Persistent generalised lymphadenopathy",
      "Oral candidiasis (thrush)",
      "Unexplained weight loss and fatigue",
      "Recurrent infections or prolonged healing",
      "Night sweats and persistent fever"
    ],
    right: [
      "Pneumocystis pneumonia (dry cough, bilateral infiltrates, hypoxemia)",
      "Kaposi sarcoma (purple-violet skin lesions)",
      "Cryptococcal meningitis (headache, fever, altered mental status)",
      "CMV retinitis (vision loss, floaters - 'pizza pie' fundoscopy)",
      "HIV wasting syndrome (>10% weight loss with chronic diarrhea or fever)"
    ]
  },
  medications: [
    {
      name: "Tenofovir Disoproxil/Emtricitabine (Truvada)",
      type: "NRTI Combination (Nucleoside/Nucleotide Reverse Transcriptase Inhibitors)",
      action: "Both drugs are incorporated into the growing viral DNA chain by reverse transcriptase and act as chain terminators, preventing completion of viral DNA synthesis; tenofovir is a nucleotide analogue of adenine, emtricitabine is a nucleoside analogue of cytidine; backbone of many ART regimens and used for PrEP",
      sideEffects: "Nausea, headache, fatigue; tenofovir-specific: nephrotoxicity (proximal renal tubular dysfunction, Fanconi syndrome), decreased bone mineral density; emtricitabine: skin hyperpigmentation (palms/soles in dark-skinned patients)",
      contra: "Renal impairment (CrCl <50 for disoproxil form; alafenamide form - TAF - preferred for renal concerns), chronic hepatitis B (abrupt discontinuation can cause severe HBV flare from immune reconstitution), concurrent nephrotoxic drugs",
      pearl: "Also approved for PrEP (pre-exposure prophylaxis) in HIV-negative individuals at high risk; check HBV status before starting (both drugs are active against HBV; stopping in HBV-coinfected patients causes severe hepatitis flare); monitor renal function and bone density with long-term tenofovir disoproxil use; TAF (tenofovir alafenamide) formulation has less renal and bone toxicity"
    },
    {
      name: "Dolutegravir (Tivicay)",
      type: "Integrase Strand Transfer Inhibitor (INSTI)",
      action: "Binds to HIV integrase enzyme and blocks the strand transfer step of viral DNA integration into the host cell genome, preventing the establishment of proviral DNA; integrase inhibitors have rapid viral load decline and high barrier to resistance",
      sideEffects: "Insomnia, headache, weight gain (class effect of INSTIs), nausea; rare: hypersensitivity reaction, hepatotoxicity, elevated creatine kinase",
      contra: "Co-administration with dofetilide (cardiac arrhythmia risk); dose adjustment with rifampin (enzyme induction); periconception period (initial concern for neural tube defects has been largely resolved with larger studies, but discuss with provider)",
      pearl: "Preferred third agent in first-line ART regimens due to high efficacy, high resistance barrier, once-daily dosing, and good tolerability; can be taken with or without food; weight gain (5-10 kg) is an emerging concern with all INSTIs; available as single-tablet regimens combined with NRTIs (e.g., Triumeq = dolutegravir + abacavir + lamivudine; Dovato = dolutegravir + lamivudine)"
    },
    {
      name: "Trimethoprim-Sulfamethoxazole (TMP-SMX, Bactrim) for PCP Prophylaxis",
      type: "Antifolate Combination (Opportunistic Infection Prophylaxis)",
      action: "Sequential blockade of bacterial folate synthesis pathway; prevents Pneumocystis jirovecii pneumonia (PCP), which is the most common AIDS-defining illness; also provides prophylaxis against toxoplasmosis and certain bacterial infections",
      sideEffects: "Rash (including Stevens-Johnson syndrome - more common in HIV patients), nausea, bone marrow suppression (leukopenia, thrombocytopenia), hyperkalemia, photosensitivity, hepatotoxicity",
      contra: "Sulfonamide allergy (consider desensitisation in HIV patients or use alternative: dapsone or atovaquone), severe hepatic impairment, megaloblastic anemia from folate deficiency, pregnancy (first trimester)",
      pearl: "Start PCP prophylaxis when CD4 count falls below 200 cells/mcL (or CD4 percentage <14%, or history of oropharyngeal candidiasis); can be discontinued when CD4 rises above 200 and is sustained for >3 months on ART; one single-strength tablet daily also prevents toxoplasmosis (need double-strength for toxo prophylaxis if toxo IgG positive); higher rate of sulfa hypersensitivity in HIV patients (up to 50%)"
    }
  ],
  pearls: [
    "U=U (Undetectable = Untransmittable): persons living with HIV who achieve and maintain an undetectable viral load (<50 copies/mL) on ART effectively do NOT transmit HIV sexually - this message is transformative for reducing stigma and promoting treatment adherence",
    "ART is recommended for ALL HIV-positive individuals regardless of CD4 count - early treatment prevents transmission, preserves immune function, and improves outcomes; there is no CD4 threshold below which treatment is withheld",
    "PEP (post-exposure prophylaxis) must be started within 72 HOURS of exposure (ideally within 2 hours) and continued for 28 days; do NOT delay PEP for baseline testing results",
    "The window period (time between infection and detectable test): 4th-generation antigen/antibody tests can detect HIV as early as 2 weeks; antibody-only tests may not be positive until 4-12 weeks; during this window, the patient may be highly infectious with a very high viral load",
    "HIV is NOT transmitted through casual contact, sharing food, coughing, sneezing, mosquito bites, toilet seats, or swimming pools - combating misinformation and stigma is a nursing responsibility",
    "Standard precautions (not isolation) are used for HIV - the same precautions used for ALL patients are sufficient; HIV is fragile outside the body and is killed by common disinfectants",
    "PCP prophylaxis (TMP-SMX) is started when CD4 drops below 200 - PCP is the most common AIDS-defining illness and is preventable with prophylaxis",
    "Medication adherence of >95% is critical for viral suppression; even small lapses allow viral replication, resistance development, and treatment failure"
  ],
  quiz: [
    {
      question: "A healthcare worker sustains a needlestick injury from a patient confirmed HIV-positive. It has been 4 hours since the injury. What is the priority action?",
      options: [
        "Wait for the healthcare worker's baseline HIV test results before starting any medication",
        "Initiate post-exposure prophylaxis (PEP) with a 3-drug ART regimen immediately; PEP should ideally start within 2 hours and must begin within 72 hours",
        "Reassure the healthcare worker that needlestick injuries never transmit HIV",
        "Start pre-exposure prophylaxis (PrEP) and continue indefinitely"
      ],
      correct: 1,
      rationale: "PEP should be initiated as soon as possible after HIV exposure, ideally within 2 hours and no later than 72 hours. At 4 hours, PEP is still within the effective window. A 3-drug ART regimen is taken for 28 days. Baseline testing is performed but should NEVER delay PEP initiation. The risk of HIV transmission from a needlestick is approximately 0.3%, not zero. PrEP is for pre-exposure prevention, not post-exposure management."
    },
    {
      question: "A patient with HIV has a CD4 count of 180 cells/mcL. Which medication should the nurse ensure is prescribed for prophylaxis?",
      options: [
        "Azithromycin for MAC prophylaxis",
        "Fluconazole for fungal prophylaxis",
        "Trimethoprim-sulfamethoxazole for Pneumocystis (PCP) prophylaxis",
        "Acyclovir for herpes prophylaxis"
      ],
      correct: 2,
      rationale: "PCP prophylaxis with TMP-SMX is indicated when the CD4 count falls below 200 cells/mcL. PCP is the most common AIDS-defining opportunistic infection and is preventable. MAC prophylaxis (azithromycin) is not started until CD4 drops below 50. Routine fluconazole and acyclovir prophylaxis are not standard recommendations at this CD4 level."
    },
    {
      question: "A patient on ART has maintained an undetectable viral load (<50 copies/mL) for 8 months. Their partner asks if they can stop using condoms. What information should the nurse provide?",
      options: [
        "Condoms should always be used regardless of viral load because HIV can always be transmitted",
        "The U=U principle (Undetectable = Untransmittable) means a sustained undetectable viral load effectively eliminates sexual transmission risk; however, condoms still protect against other STIs and the partner may consider PrEP as additional protection",
        "The viral load must be undetectable for at least 5 years before considering condom discontinuation",
        "Only female condoms can be discontinued; male condoms must still be used"
      ],
      correct: 1,
      rationale: "The U=U principle is supported by large landmark studies (PARTNER, HPTN 052) showing zero linked HIV transmissions from partners with sustained undetectable viral loads. While HIV transmission risk is effectively eliminated, condoms continue to protect against other STIs. PrEP for the negative partner provides additional reassurance. The nurse should provide this evidence-based information while supporting the couple's informed decision-making."
    }
  ]
},

"anaphylaxis-basics-rpn": {
  title: "Anaphylaxis Basics",
  cellular: {
    title: "Pathophysiology of Anaphylaxis",
    content: "Anaphylaxis is a severe, potentially fatal systemic hypersensitivity reaction that is rapid in onset and can cause death within minutes if not treated promptly. It is the most extreme form of a type I (IgE-mediated) immediate hypersensitivity reaction, though non-IgE-mediated mechanisms can also produce identical clinical presentations (anaphylactoid reactions).\n\nIn classic IgE-mediated anaphylaxis, prior sensitisation to an allergen is required. During initial exposure, the immune system produces allergen-specific IgE antibodies that bind to high-affinity Fc-epsilon receptors on mast cells and basophils. On subsequent re-exposure, the allergen cross-links these surface-bound IgE molecules, triggering massive mast cell and basophil degranulation. This releases a flood of preformed and newly synthesised mediators.\n\nHistamine is the primary mediator, causing vasodilation, increased vascular permeability, smooth muscle contraction (bronchospasm, GI cramps), and mucus hypersecretion. Tryptase (a protease from mast cells) causes tissue damage and can be measured as a serum marker of mast cell activation. Prostaglandins (especially PGD2) and leukotrienes (LTC4, LTD4, LTE4) amplify and prolong the inflammatory response. Leukotrienes are 1000 times more potent than histamine at causing bronchospasm, explaining why antihistamines alone are insufficient to treat anaphylaxis.\n\nPlatelet-activating factor (PAF) promotes further vascular permeability, platelet aggregation, and hypotension. The severity of PAF levels correlates with the severity of anaphylaxis. Cytokines (TNF-alpha, IL-4, IL-13) are released in a secondary wave, contributing to the late-phase reaction.\n\nThe most common triggers are foods (peanuts, tree nuts, shellfish, milk, eggs), medications (penicillin and other beta-lactams, NSAIDs, neuromuscular blocking agents), insect stings (Hymenoptera - bees, wasps, hornets), and latex. In the healthcare setting, medications and latex are the most common triggers. In some cases, no trigger is identified (idiopathic anaphylaxis).\n\nThe clinical manifestations reflect widespread mediator release affecting multiple organ systems. Cutaneous (skin): urticaria (hives), angioedema, flushing, pruritus - present in 80-90% of cases and often the first sign. Respiratory: laryngeal edema (stridor, hoarseness, throat tightness - can rapidly cause complete airway obstruction), bronchospasm (wheezing, dyspnea, chest tightness). Cardiovascular: vasodilation causing hypotension, tachycardia, distributive shock; cardiac output falls from reduced preload (third-spacing) and vasodilation. Gastrointestinal: nausea, vomiting, abdominal cramping, diarrhea.\n\nBiphasic anaphylaxis occurs in 1-20% of cases, where symptoms recur 1-72 hours after the initial reaction has resolved, even without re-exposure to the trigger. This is mediated by the late-phase inflammatory response and is the reason patients require observation (typically 4-6 hours, or longer for severe reactions) after initial stabilisation.\n\nExercise-induced anaphylaxis is a unique variant triggered by physical exertion, sometimes only when exercise occurs within 2-6 hours of eating a specific food (food-dependent exercise-induced anaphylaxis)."
  },
  riskFactors: [
    "Prior history of anaphylaxis (the strongest predictor of future anaphylactic reactions)",
    "Known allergies to common anaphylaxis triggers (foods, medications, insect stings)",
    "Asthma (especially poorly controlled asthma increases the risk of fatal anaphylaxis from bronchospasm)",
    "Age: adolescents and young adults have higher rates of food-triggered fatal anaphylaxis (risk-taking behaviour, failure to carry epinephrine)",
    "Concurrent beta-blocker or ACE inhibitor use (beta-blockers reduce the effectiveness of epinephrine and can worsen anaphylaxis; ACE inhibitors predispose to angioedema)",
    "Mastocytosis or elevated baseline tryptase (increased mast cell burden)",
    "Healthcare exposures: medication administration, blood transfusion, contrast media, latex exposure in surgical settings",
    "Atopy (history of allergic rhinitis, eczema, asthma) increases risk for some triggers"
  ],
  diagnostics: [
    "Clinical diagnosis based on rapid onset of characteristic symptoms (minutes to hours) after exposure to a known or likely allergen; do NOT delay treatment for diagnostic testing",
    "Diagnostic criteria (any one of three): (1) Acute onset affecting skin/mucosal tissue PLUS respiratory compromise OR hypotension; (2) Two or more of skin/mucosal, respiratory, hypotension, or GI symptoms after exposure to a LIKELY allergen; (3) Hypotension after exposure to a KNOWN allergen",
    "Serum tryptase: peaks 1-2 hours after symptom onset; elevated tryptase (>11.4 ng/mL or >2x baseline + 2 ng/mL) supports the diagnosis; most useful for non-food anaphylaxis; normal tryptase does NOT exclude anaphylaxis (often normal in food-triggered anaphylaxis)",
    "Post-event allergy testing: skin prick testing and allergen-specific IgE blood tests performed 4-6 weeks after the acute event to identify the causative allergen and guide avoidance",
    "Monitor ECG: tachycardia is expected; myocardial ischemia can occur from coronary vasospasm and hypoperfusion (Kounis syndrome)"
  ],
  management: [
    "EPINEPHRINE is the FIRST and MOST IMPORTANT treatment: administer IM (NOT SC) into the lateral thigh (vastus lateralis) immediately; adult dose 0.3-0.5 mg of 1:1,000 (1 mg/mL); paediatric dose 0.01 mg/kg up to 0.3 mg; may repeat every 5-15 minutes if no improvement",
    "Position patient supine with legs elevated (optimises venous return to the heart); if respiratory distress predominates, allow to sit upright; do NOT allow patient to stand or sit upright suddenly (can cause cardiovascular collapse - empty ventricle syndrome)",
    "Call for emergency assistance (code/rapid response) immediately",
    "Establish IV access with large-bore cannula; IV crystalloid bolus (1-2 litres normal saline) for persistent hypotension",
    "Supplemental oxygen: high-flow via non-rebreather mask (15 L/min); prepare for advanced airway management if laryngeal edema threatens airway",
    "Adjunctive medications (DO NOT REPLACE epinephrine): H1 antihistamine (diphenhydramine 25-50 mg IV/IM), H2 antihistamine (ranitidine/famotidine IV), bronchodilator (salbutamol nebulised for persistent bronchospasm), corticosteroid (methylprednisolone or dexamethasone - may help prevent biphasic reaction but NOT effective acutely)",
    "Refractory anaphylaxis: IV epinephrine infusion (titrated), glucagon for patients on beta-blockers (bypasses beta-receptor blockade), vasopressin for refractory hypotension",
    "Observation period: minimum 4-6 hours after resolution for mild-moderate reactions; 12-24 hours for severe reactions due to risk of biphasic anaphylaxis"
  ],
  nursingActions: [
    "Recognise anaphylaxis: rapid onset (minutes) of skin changes (urticaria, flushing, angioedema) with respiratory symptoms (stridor, wheezing, dyspnea) and/or cardiovascular compromise (hypotension, tachycardia) after allergen exposure",
    "Administer epinephrine IM into lateral thigh IMMEDIATELY - this is the single most critical intervention; do NOT delay for other treatments; do NOT substitute antihistamines for epinephrine",
    "Remove the allergen source if possible: stop IV medication infusion, remove insect stinger (scrape rather than squeeze), note the suspected trigger",
    "Position appropriately: supine with legs elevated for hypotension; sitting upright if respiratory distress predominates; NEVER allow the patient to stand (risk of fatal cardiovascular collapse)",
    "Establish large-bore IV access and begin crystalloid infusion for hypotension; administer adjunct medications as ordered (antihistamines, bronchodilators, corticosteroids)",
    "Monitor continuously: vital signs every 5 minutes during acute phase, continuous pulse oximetry, cardiac monitoring; assess airway patency (stridor, voice changes indicate laryngeal edema)",
    "Prepare for airway management: have intubation equipment and suction at bedside; laryngeal edema can progress rapidly to complete obstruction",
    "After stabilisation: observe for minimum 4-6 hours for biphasic reaction; educate on epinephrine auto-injector use and ensure prescription provided",
    "Discharge education: allergen avoidance, carrying TWO epinephrine auto-injectors at all times, medical alert identification, follow-up with allergist for definitive testing, action plan for future reactions"
  ],
  assessmentFindings: [
    "Cutaneous (often first signs): generalised urticaria (hives), angioedema (swelling of face, lips, tongue, throat), intense pruritus, flushing, warmth",
    "Respiratory: throat tightness, hoarseness, stridor (laryngeal edema - airway emergency), cough, wheezing, dyspnea, chest tightness, tachypnea",
    "Cardiovascular: tachycardia, hypotension (systolic <90 or >30% drop from baseline), dizziness, syncope, pallor, weak pulse",
    "Gastrointestinal: nausea, vomiting, abdominal cramping, diarrhea",
    "Neurological: anxiety, sense of impending doom (highly characteristic and should not be dismissed), confusion, loss of consciousness",
    "Onset is typically within minutes (5-30 minutes for most triggers; can be seconds for IV medications)"
  ],
  signs: {
    left: [
      "Urticaria (hives) and angioedema",
      "Stridor or hoarseness (laryngeal edema)",
      "Wheezing and dyspnea (bronchospasm)",
      "Tachycardia and hypotension",
      "Sense of impending doom"
    ],
    right: [
      "Complete airway obstruction (silent chest, unable to speak)",
      "Cardiovascular collapse (unresponsive shock)",
      "Cardiac arrest (PEA or asystole from distributive shock)",
      "Biphasic reaction (recurrence 1-72 hours after initial resolution)",
      "Refractory anaphylaxis unresponsive to IM epinephrine"
    ]
  },
  medications: [
    {
      name: "Epinephrine (Adrenaline)",
      type: "Sympathomimetic (Alpha and Beta Agonist)",
      action: "Alpha-1 agonist: vasoconstriction reverses hypotension and reduces mucosal edema (including laryngeal edema). Beta-1 agonist: increases heart rate and contractility. Beta-2 agonist: bronchodilation reverses bronchospasm and inhibits further mast cell mediator release. Epinephrine is the ONLY medication that addresses ALL pathophysiologic mechanisms of anaphylaxis simultaneously",
      sideEffects: "Tachycardia, palpitations, tremor, anxiety, headache, hypertension (transient), nausea; serious: cardiac arrhythmias (rare at IM doses), myocardial ischemia (in patients with coronary disease)",
      contra: "There are NO absolute contraindications to epinephrine in anaphylaxis - the risk of NOT giving it far outweighs any risks of the medication, even in patients with cardiac disease or pregnancy",
      pearl: "ALWAYS give IM (intramuscular) into the LATERAL THIGH (vastus lateralis) - this provides the fastest absorption and peak blood levels; NEVER give SC (too slow absorption) or IV push (risk of fatal arrhythmia - IV epinephrine is only for cardiac arrest or as a controlled infusion in refractory anaphylaxis); the thigh has superior vascularity compared to the deltoid; auto-injectors (EpiPen) deliver a fixed 0.3 mg adult dose"
    },
    {
      name: "Diphenhydramine (Benadryl)",
      type: "First-Generation H1 Antihistamine",
      action: "Competitively blocks H1 histamine receptors, reducing urticaria, pruritus, and flushing; does NOT reverse bronchospasm, hypotension, or laryngeal edema - these are mediated by leukotrienes, prostaglandins, and other mediators, not just histamine",
      sideEffects: "Sedation (significant), dry mouth, urinary retention, blurred vision, confusion in elderly (anticholinergic effects)",
      contra: "Narrow-angle glaucoma, urinary retention, concurrent MAO inhibitors; caution in elderly (Beers Criteria)",
      pearl: "An ADJUNCT to epinephrine, NEVER a replacement; primarily treats cutaneous symptoms (hives, itching); does NOT prevent or treat the life-threatening components of anaphylaxis (airway edema, bronchospasm, cardiovascular collapse); giving diphenhydramine instead of epinephrine is a common and potentially fatal error"
    },
    {
      name: "Salbutamol (Albuterol) Nebulised",
      type: "Short-Acting Beta-2 Agonist (Bronchodilator)",
      action: "Selectively stimulates beta-2 adrenergic receptors on bronchial smooth muscle, causing rapid bronchodilation; reduces airway resistance and relieves wheezing; complementary to epinephrine's beta-2 effects for persistent bronchospasm",
      sideEffects: "Tachycardia, tremor, palpitations, headache, hypokalemia (with repeated doses)",
      contra: "No absolute contraindications in anaphylaxis with bronchospasm; caution in severe tachycardia",
      pearl: "Used as adjunct for persistent wheezing/bronchospasm that does not fully resolve with epinephrine; administer via nebuliser (2.5-5 mg) for continuous delivery; does NOT address the vascular or laryngeal components of anaphylaxis - epinephrine remains the primary treatment; particularly important in patients with underlying asthma who develop anaphylaxis"
    }
  ],
  pearls: [
    "EPINEPHRINE IS THE FIRST AND ONLY DEFINITIVE TREATMENT FOR ANAPHYLAXIS - there are NO absolute contraindications; antihistamines, corticosteroids, and bronchodilators are adjuncts that do NOT replace epinephrine",
    "Give epinephrine IM into the LATERAL THIGH (not deltoid, not subcutaneous, not IV push) - the thigh provides fastest absorption; may repeat every 5-15 minutes if no improvement",
    "A patient's sense of impending doom should NEVER be dismissed - it is a characteristic symptom of anaphylaxis and should trigger immediate assessment and intervention",
    "Never allow an anaphylactic patient to stand or sit upright suddenly - even patients who appear stable can experience fatal cardiovascular collapse (empty ventricle syndrome) from abrupt position change",
    "Biphasic anaphylaxis can occur up to 72 hours after the initial reaction - this is why observation periods of 4-6+ hours are necessary; patients must be educated about this risk",
    "Patients on beta-blockers may have refractory anaphylaxis because epinephrine cannot effectively stimulate blocked beta receptors - glucagon (which works through non-adrenergic mechanisms) is the rescue agent",
    "Two epinephrine auto-injectors should be prescribed because up to 20-30% of anaphylaxis episodes require a second dose, and auto-injectors can misfire or be used incorrectly",
    "The most common error in anaphylaxis management is DELAY in epinephrine administration - studies show the majority of anaphylaxis deaths occur because epinephrine was given too late or not at all"
  ],
  quiz: [
    {
      question: "A patient develops urticaria, wheezing, throat tightness, and hypotension 10 minutes after receiving IV penicillin. What is the FIRST action?",
      options: [
        "Administer IV diphenhydramine 50 mg",
        "Stop the penicillin infusion and administer epinephrine 0.3-0.5 mg IM into the lateral thigh",
        "Position the patient supine and start an IV normal saline bolus",
        "Nebulise salbutamol for the wheezing"
      ],
      correct: 1,
      rationale: "This presentation is anaphylaxis (urticaria + respiratory symptoms + cardiovascular compromise after a known allergen). The FIRST actions are to stop the offending agent and administer epinephrine IM immediately. Epinephrine is the only medication that addresses all pathophysiologic mechanisms simultaneously. While the other interventions are appropriate, they are adjunctive and should not delay epinephrine. Antihistamines alone cannot treat the life-threatening components."
    },
    {
      question: "A nurse is about to administer epinephrine for anaphylaxis. Which site and route is correct?",
      options: [
        "Subcutaneous injection into the upper arm (deltoid)",
        "Intravenous push of 1 mg (1:1,000 concentration)",
        "Intramuscular injection into the lateral thigh (vastus lateralis)",
        "Sublingual tablet placed under the tongue"
      ],
      correct: 2,
      rationale: "Epinephrine for anaphylaxis must be given IM (intramuscular) into the lateral thigh (vastus lateralis). This site provides the fastest absorption and peak blood levels. Subcutaneous injection is too slow. IV push of 1:1,000 concentration can cause fatal cardiac arrhythmias (IV epinephrine is reserved for cardiac arrest or as a diluted, controlled infusion). Sublingual epinephrine is not a standard formulation for anaphylaxis."
    },
    {
      question: "An anaphylaxis patient has been stabilised with epinephrine and is now asymptomatic after 1 hour. The patient asks to go home. What is the appropriate nursing response?",
      options: [
        "Discharge the patient since symptoms have resolved",
        "The patient must be observed for a minimum of 4-6 hours due to the risk of biphasic anaphylaxis, where symptoms can recur hours after initial resolution",
        "Discharge with a prescription for oral antihistamines and instructions to return if symptoms recur",
        "Observation is only needed if the patient had severe symptoms"
      ],
      correct: 1,
      rationale: "Biphasic anaphylaxis occurs in up to 20% of cases, with symptom recurrence 1-72 hours after the initial reaction, even without re-exposure to the trigger. A minimum observation period of 4-6 hours is recommended for mild-moderate reactions, with longer observation (12-24 hours) for severe reactions. Premature discharge puts the patient at risk for a recurrent reaction without immediate access to care."
    }
  ]
}

};

let injected = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) injected++;
}
console.log(`\nDone: injected ${injected}/${Object.keys(lessons).length} lessons`);
