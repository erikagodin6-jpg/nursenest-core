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
  console.log(`  SKIP: ${id} (no placeholder found)`);
  return false;
}

const lessons: Record<string, any> = {
  "infection-control-rpn": {
    title: "Infection Control and Prevention for Practical Nurses",
    cellular: {
      title: "The Chain of Infection and Pathogen Transmission",
      content: "Infection control is the cornerstone of patient safety in every healthcare setting. Understanding how infections develop and spread requires knowledge of the chain of infection, a model consisting of six interconnected links: the infectious agent (pathogen), the reservoir (where the pathogen lives and multiplies), the portal of exit (how the pathogen leaves the reservoir), the mode of transmission (how it travels to a new host), the portal of entry (how it enters the new host), and the susceptible host (an individual whose immune defenses cannot effectively resist the pathogen). Breaking any single link in this chain prevents infection transmission. Infectious agents include bacteria (such as Staphylococcus aureus, Escherichia coli, and Clostridioides difficile), viruses (influenza, SARS-CoV-2, norovirus), fungi (Candida species), and parasites (Giardia, head lice). Reservoirs can be human (patients, healthcare workers, visitors), animal, or environmental (contaminated surfaces, water, medical equipment). Portals of exit include the respiratory tract (coughing, sneezing), gastrointestinal tract (feces, vomitus), genitourinary tract (urine, genital secretions), skin and mucous membranes (wound drainage, blood), and the placenta (transplacental transmission). Modes of transmission are classified as contact (direct person-to-person or indirect via contaminated objects called fomites), droplet (large respiratory particles traveling less than 2 meters), and airborne (small droplet nuclei remaining suspended in air for extended periods and traveling beyond 2 meters). The portal of entry mirrors the portal of exit and includes breaks in skin integrity, mucous membranes, respiratory and urinary tracts, and parenteral routes (needlestick injuries). Susceptible host factors include extremes of age, immunosuppression, chronic disease, malnutrition, invasive devices (urinary catheters, central lines, endotracheal tubes), and surgical wounds. Standard precautions represent the minimum infection prevention practices applied to ALL patient care regardless of suspected or confirmed infection status. These include hand hygiene, use of personal protective equipment (PPE) based on anticipated exposure, safe injection practices, safe handling of contaminated equipment and surfaces, respiratory hygiene and cough etiquette, and safe sharps disposal. Transmission-based precautions are used IN ADDITION to standard precautions when a patient is known or suspected to have a pathogen requiring additional measures: contact precautions (gown and gloves for organisms like MRSA, VRE, C. difficile, scabies), droplet precautions (surgical mask within 2 meters for influenza, pertussis, meningococcal meningitis), and airborne precautions (N95 respirator and negative-pressure airborne infection isolation room for tuberculosis, measles, varicella, and disseminated herpes zoster). Hand hygiene is the single most effective measure for preventing healthcare-associated infections and must be performed using either alcohol-based hand rub (minimum 60% alcohol, applied for 20 seconds until dry) or soap and water (for at least 20 seconds when hands are visibly soiled or when caring for patients with C. difficile or norovirus, as alcohol does not kill spores). The practical nurse plays a critical role in infection surveillance, proper PPE use, environmental cleaning, patient and family education, and prompt reporting of suspected outbreaks to infection prevention and control teams."
    },
    riskFactors: [
      "Extremes of age (neonates have immature immune systems; older adults have immunosenescence with decreased T-cell function)",
      "Invasive devices (urinary catheters, central venous catheters, endotracheal tubes, surgical drains) provide direct portal of entry for pathogens",
      "Immunosuppression from chemotherapy, corticosteroid therapy, HIV/AIDS, organ transplant anti-rejection medications",
      "Chronic diseases (diabetes mellitus impairs neutrophil function; chronic kidney disease reduces immune response)",
      "Surgical wounds and skin integrity disruption (burns, pressure injuries, traumatic wounds)",
      "Malnutrition and protein deficiency (impaired antibody production and wound healing)",
      "Prolonged hospitalization and antibiotic exposure (increased risk of healthcare-associated infections and antibiotic-resistant organisms)"
    ],
    diagnostics: [
      "Complete blood count (CBC) with differential: elevated WBC (leukocytosis above 11,000/mcL) with left shift (increased bands/immature neutrophils above 10%) indicates acute bacterial infection",
      "Blood cultures (minimum 2 sets from different sites): drawn BEFORE antibiotic administration to identify causative organism and guide targeted therapy; report positive results immediately",
      "Wound culture and sensitivity: collect specimen from wound bed (not surface drainage) using sterile technique; identifies pathogen and effective antibiotics",
      "Urinalysis and urine culture: positive leukocyte esterase and nitrites suggest urinary tract infection; culture confirms organism and sensitivity",
      "C-reactive protein (CRP) and procalcitonin: CRP is a nonspecific inflammatory marker; procalcitonin is more specific for bacterial infection and useful for monitoring antibiotic response",
      "Chest X-ray: identifies pulmonary infiltrates consistent with pneumonia; compare to baseline imaging when available"
    ],
    management: [
      "Implement appropriate transmission-based precautions immediately upon suspicion of communicable infection -- do not wait for confirmatory test results",
      "Administer prescribed antibiotics within 1 hour of order for suspected sepsis; ensure blood cultures are drawn BEFORE first antibiotic dose",
      "Perform hand hygiene using the 5 Moments framework: before patient contact, before aseptic procedure, after body fluid exposure, after patient contact, and after contact with patient surroundings",
      "Don and doff PPE in correct sequence: don gown, mask/respirator, eye protection, gloves; doff gloves, eye protection, gown, mask/respirator with hand hygiene between steps",
      "Maintain environmental cleaning using facility-approved disinfectants; use sporicidal agents (sodium hypochlorite/bleach-based products) for C. difficile contamination",
      "Implement catheter-associated urinary tract infection (CAUTI) prevention bundle: assess daily need for catheter, maintain closed drainage system, secure catheter to prevent traction, keep drainage bag below bladder level",
      "Educate patients and families on hand hygiene, respiratory hygiene, and the importance of completing prescribed antibiotic courses"
    ],
    nursingActions: [
      "Perform hand hygiene before and after every patient contact -- this is the single most important action to prevent infection transmission in healthcare settings",
      "Assess patients for signs and symptoms of infection at every shift: fever, localized redness/warmth/swelling/drainage, elevated WBC, changes in mental status",
      "Apply transmission-based precautions correctly: contact (gown + gloves), droplet (surgical mask within 2 meters), airborne (N95 respirator + negative-pressure room)",
      "Monitor and document wound healing progress and characteristics of any drainage (color, amount, odor, consistency) using standardized wound assessment tools",
      "Ensure proper sharps disposal in puncture-resistant containers at point of use; never recap needles using two-handed technique",
      "Report clusters of similar infections or unusual organisms to the charge nurse and infection prevention team immediately for outbreak investigation",
      "Maintain sterile technique during invasive procedures including urinary catheter insertion, wound care with sterile dressings, and IV site care"
    ],
    assessmentFindings: [
      "Localized signs of infection: rubor (redness), calor (warmth), tumor (swelling), dolor (pain), and functio laesa (loss of function) at the affected site",
      "Systemic signs of infection: fever (temperature above 38.0C/100.4F), tachycardia, tachypnea, hypotension, altered level of consciousness",
      "Wound infection indicators: purulent drainage (yellow, green, or foul-smelling), wound margin erythema extending beyond 2 cm, wound dehiscence, delayed healing",
      "Respiratory infection indicators: productive cough with colored sputum, adventitious breath sounds (crackles, rhonchi), dyspnea, chest pain with inspiration",
      "Urinary tract infection indicators: dysuria, frequency, urgency, cloudy or foul-smelling urine, suprapubic tenderness, new-onset confusion in elderly patients",
      "Laboratory indicators: leukocytosis with left shift, elevated CRP, elevated procalcitonin, positive cultures, elevated erythrocyte sedimentation rate (ESR)",
      "Older adult atypical presentation: infection may present WITHOUT fever; instead watch for acute confusion, functional decline, falls, decreased appetite, or new incontinence"
    ],
    signs: {
      left: [
        "Low-grade fever (37.5-38.0C) with mild malaise",
        "Localized redness and warmth at wound or catheter site",
        "Mild increase in white blood cell count",
        "Increased respiratory secretions or mild cough",
        "Slight change in urine clarity or odor",
        "Mild fatigue and decreased appetite"
      ],
      right: [
        "High fever with rigors (shaking chills) suggesting bacteremia",
        "Sepsis triad: temperature above 38.3C or below 36C, heart rate above 90, respiratory rate above 20",
        "Purulent wound drainage with expanding cellulitis and crepitus (gas gangrene)",
        "Altered level of consciousness or acute confusion (septic encephalopathy)",
        "Hypotension unresponsive to fluid bolus (septic shock)",
        "Disseminated intravascular coagulation (petechiae, bleeding, oozing from puncture sites)"
      ]
    },
    medications: [
      {
        name: "Chlorhexidine Gluconate (CHG) 2% or 4% solution",
        type: "Antiseptic / Infection Control Agent",
        action: "Disrupts bacterial cell membranes causing cell lysis and death; provides immediate bactericidal activity and sustained residual antimicrobial effect on the skin for up to 24 hours after application due to binding with the stratum corneum",
        sideEffects: "Skin irritation, contact dermatitis, rare allergic reactions including anaphylaxis; ototoxicity if instilled into the middle ear; corneal damage if applied to eyes",
        contra: "Known hypersensitivity to chlorhexidine; avoid contact with eyes, ears (perforated tympanic membrane), and meninges; use with caution on neonates under 2 months (skin absorption risk)",
        pearl: "Used for preoperative skin preparation, central line dressing changes, and daily CHG bathing in ICU patients to reduce CLABSI rates; allow to air dry completely for full antimicrobial effect -- do not blot or wipe off"
      },
      {
        name: "Alcohol-Based Hand Rub (ABHR) 60-95% ethanol or isopropanol",
        type: "Hand Antiseptic / Infection Control Agent",
        action: "Denatures proteins and dissolves lipid membranes of bacteria, viruses, and fungi on contact; rapidly kills most transient flora within 15-30 seconds of proper application",
        sideEffects: "Skin dryness and irritation with frequent use (emollients in formulations help mitigate this); flammable -- must be stored away from heat sources and open flames",
        contra: "Hands visibly soiled with blood, body fluids, or organic matter (use soap and water instead); care of patients with Clostridioides difficile or norovirus infection (alcohol does not kill spores or norovirus effectively)",
        pearl: "Apply a palmful (approximately 1-2 mL) and rub all surfaces of hands including between fingers and around nail beds for at least 20 seconds until completely dry; if hands feel dry before 15 seconds, insufficient product was applied"
      },
      {
        name: "Sodium Hypochlorite (Bleach) 0.5-1% solution",
        type: "Environmental Disinfectant / Infection Control Agent",
        action: "Releases hypochlorous acid (HOCl) that oxidizes microbial enzymes and structural proteins, providing broad-spectrum antimicrobial activity against bacteria, viruses, fungi, and critically, bacterial spores including Clostridioides difficile",
        sideEffects: "Respiratory irritation if aerosolized in poorly ventilated areas, skin irritation and burns at concentrated levels, corrosive to metals and some surfaces with prolonged exposure, fabric bleaching",
        contra: "Never mix with ammonia-containing products (produces toxic chloramine gas); never mix with acids (releases chlorine gas); use appropriate dilution per manufacturer guidelines",
        pearl: "Essential for terminal cleaning of rooms occupied by patients with C. difficile -- standard quaternary ammonium disinfectants do NOT kill C. difficile spores; prepare fresh dilutions daily as efficacy decreases with age; ensure minimum wet contact time of 10 minutes for sporicidal activity"
      }
    ],
    pearls: [
      "Hand hygiene is the single most effective intervention to prevent healthcare-associated infections -- compliance should be practiced before and after EVERY patient contact without exception",
      "For C. difficile and norovirus, soap and water is REQUIRED because alcohol-based hand rub does not kill spores or norovirus; mechanical friction during handwashing physically removes spores",
      "PPE donning order: gown FIRST, then mask/respirator, then eye protection, then gloves LAST; doffing order: gloves FIRST (most contaminated), then eye protection, then gown, then mask/respirator LAST, with hand hygiene between each removal step",
      "Contact precautions require a dedicated stethoscope and blood pressure cuff for the patient room; if shared equipment must be used, disinfect between patients with facility-approved disinfectant",
      "Airborne precautions require an N95 respirator (must be fit-tested annually) AND a negative-pressure airborne infection isolation room (AIIR) with at least 6-12 air exchanges per hour",
      "The most common healthcare-associated infections are catheter-associated urinary tract infections (CAUTI), central line-associated bloodstream infections (CLABSI), surgical site infections (SSI), and ventilator-associated pneumonia (VAP) -- prevention bundles exist for each",
      "Older adults may present with atypical infection signs: acute confusion, falls, or functional decline WITHOUT fever -- always consider infection in the differential for sudden behavioral changes in elderly patients"
    ],
    quiz: [
      {
        question: "A practical nurse is preparing to provide care for a patient diagnosed with Clostridioides difficile infection. Which hand hygiene method is most appropriate after removing gloves?",
        options: [
          "Alcohol-based hand rub for 20 seconds",
          "Soap and water for at least 20 seconds",
          "Chlorhexidine gluconate surgical scrub",
          "Alcohol-based hand rub followed by glove reapplication"
        ],
        correct: 1,
        rationale: "Soap and water is required for C. difficile because alcohol-based hand rub does not kill bacterial spores. The mechanical friction of handwashing physically removes C. difficile spores from the hands. This applies to norovirus as well."
      },
      {
        question: "A practical nurse is caring for a patient placed on airborne precautions. Which combination of protective measures is required before entering the room?",
        options: [
          "Surgical mask and gown",
          "N95 respirator and the patient placed in a negative-pressure room",
          "Surgical mask and gloves only",
          "Face shield and gown with standard ventilation"
        ],
        correct: 1,
        rationale: "Airborne precautions require an N95 respirator (fit-tested) and a negative-pressure airborne infection isolation room (AIIR). This prevents inhalation of small droplet nuclei that remain suspended in air, as occurs with tuberculosis, measles, and varicella."
      },
      {
        question: "The practical nurse observes a colleague recapping a used needle using two hands. What is the most appropriate immediate action?",
        options: [
          "Report the colleague to the nursing regulatory body",
          "Inform the colleague that two-handed recapping is unsafe and needles should be disposed of directly into a sharps container",
          "Wait until the shift ends to discuss the concern privately",
          "Document the incident in the patient chart"
        ],
        correct: 1,
        rationale: "Two-handed needle recapping is a leading cause of needlestick injuries and is prohibited by safe injection practices. The practical nurse should intervene immediately by informing the colleague that used needles must be disposed of directly into puncture-resistant sharps containers at the point of use without recapping."
      }
    ]
  },

  "influenza-rpn": {
    title: "Influenza Infection and Management for Practical Nurses",
    cellular: {
      title: "Virology and Pathophysiology of Influenza",
      content: "Influenza is an acute respiratory illness caused by influenza viruses, which are RNA viruses belonging to the Orthomyxoviridae family. Three types cause disease in humans: influenza A (the most clinically significant, responsible for pandemics), influenza B (causes seasonal epidemics but generally milder), and influenza C (causes mild upper respiratory illness). The influenza virus structure includes two critical surface glycoproteins: hemagglutinin (H) binds to sialic acid receptors on respiratory epithelial cells, facilitating viral entry into host cells, while neuraminidase (N) cleaves sialic acid residues to release newly formed viral particles from infected cells, enabling spread to adjacent cells. Influenza A viruses are classified by their H and N subtypes (for example, H1N1 and H3N2 are the current circulating subtypes). Two key mechanisms drive influenza evolution and epidemic behavior. Antigenic drift involves gradual accumulation of point mutations in the H and N genes during viral replication, producing minor changes in surface proteins that allow the virus to partially evade existing immunity. Antigenic drift is the reason seasonal influenza vaccines must be reformulated annually. Antigenic shift is a major, abrupt change in the H or N proteins that occurs when two different influenza A subtypes co-infect the same cell (often in an animal host such as pigs, which have receptors for both avian and human influenza) and exchange genetic segments through reassortment. Antigenic shift creates a novel virus to which the human population has little or no pre-existing immunity, potentially causing a pandemic. After inhalation of respiratory droplets or contact with contaminated surfaces followed by touching the eyes, nose, or mouth, the virus attaches to and penetrates respiratory epithelial cells of the nasopharynx and tracheobronchial tree. Viral replication destroys ciliated epithelial cells, compromising the mucociliary escalator defense mechanism and exposing the underlying basement membrane. This damage predisposes the patient to secondary bacterial infections, particularly Streptococcus pneumoniae, Staphylococcus aureus (including MRSA), and Haemophilus influenzae. The incubation period is typically 1 to 4 days, with viral shedding beginning approximately 1 day before symptom onset and continuing for 5 to 7 days in adults (longer in children and immunocompromised individuals). The systemic symptoms of influenza (fever, myalgia, headache, fatigue) are caused primarily by the host immune response, specifically the release of pro-inflammatory cytokines including interleukin-6, tumor necrosis factor-alpha, and interferons, rather than direct viral damage to distant organs. High-risk groups for influenza complications include adults aged 65 and older, children under 5 years (especially under 2 years), pregnant women, immunocompromised individuals, residents of long-term care facilities, individuals with chronic medical conditions (asthma, COPD, heart disease, diabetes, chronic kidney disease), and Indigenous populations. A critical concern in pediatric patients is Reye syndrome, a rare but potentially fatal condition involving acute encephalopathy and fatty liver degeneration, strongly associated with the use of acetylsalicylic acid (ASA/aspirin) during viral illnesses including influenza and varicella. For this reason, ASA must NEVER be administered to children or adolescents under 18 years with suspected or confirmed influenza."
    },
    riskFactors: [
      "Age extremes: adults 65 years and older (immunosenescence) and children under 5 years (immature immune system, especially under 2 years)",
      "Chronic respiratory disease (asthma, COPD, cystic fibrosis) increasing susceptibility to lower respiratory tract involvement",
      "Cardiovascular disease (heart failure, coronary artery disease) with increased risk of myocarditis and acute cardiac events during infection",
      "Immunosuppression from chemotherapy, organ transplant, HIV/AIDS, or chronic corticosteroid use",
      "Pregnancy and up to 2 weeks postpartum (altered immune function and increased oxygen demand)",
      "Residents of long-term care facilities and congregate living settings (high transmission risk)",
      "Morbid obesity (BMI 40 or greater) associated with impaired respiratory mechanics and immune function"
    ],
    diagnostics: [
      "Rapid influenza diagnostic test (RIDT): detects viral nucleoprotein antigens from nasopharyngeal swab; results in 15-30 minutes; sensitivity 50-70% (false negatives possible); positive result confirms but negative does not rule out influenza",
      "Reverse transcription polymerase chain reaction (RT-PCR): gold standard with sensitivity above 95%; identifies influenza type and subtype; results within 1-6 hours; preferred for hospitalized patients and outbreak investigations",
      "Chest X-ray: indicated when pneumonia is suspected; may show bilateral interstitial infiltrates (viral) or lobar consolidation (secondary bacterial pneumonia)",
      "Complete blood count (CBC): may show leukopenia or normal WBC in uncomplicated influenza; leukocytosis with left shift suggests secondary bacterial infection",
      "Blood cultures: obtain if secondary bacterial pneumonia or sepsis is suspected, especially with sustained high fever, productive purulent sputum, or clinical deterioration after initial improvement",
      "Basic metabolic panel (BMP): assess renal function and electrolytes, especially in elderly or dehydrated patients; monitor for hyponatremia from SIADH in severe cases"
    ],
    management: [
      "Initiate antiviral therapy within 48 hours of symptom onset for maximum benefit; treatment can still be considered beyond 48 hours in hospitalized patients or those at high risk for complications",
      "Implement droplet precautions: surgical mask within 2 meters, private room preferred or cohort with other influenza patients; maintain precautions for 5 days after symptom onset (longer if immunocompromised)",
      "Encourage oral fluid intake of at least 2-3 liters per day to maintain hydration; monitor for signs of dehydration (decreased urine output, dry mucous membranes, orthostatic hypotension)",
      "Administer acetaminophen for fever and myalgia as prescribed; NEVER administer ASA (aspirin) to children or adolescents under 18 due to risk of Reye syndrome",
      "Monitor oxygen saturation continuously or every 4 hours; administer supplemental oxygen to maintain SpO2 above 92% as ordered",
      "Assess for complications including secondary bacterial pneumonia (new fever spike after initial improvement, productive purulent cough), myocarditis, and encephalitis",
      "Promote annual influenza vaccination for all individuals aged 6 months and older as the primary prevention strategy; educate patients that the inactivated vaccine cannot cause influenza"
    ],
    nursingActions: [
      "Perform respiratory assessment every 4 hours including respiratory rate, depth, pattern, oxygen saturation, and auscultation of lung sounds in all fields",
      "Implement and maintain droplet precautions: don surgical mask before entering patient room, provide patient with mask for transport, maintain spatial separation of at least 2 meters from other patients",
      "Monitor temperature every 4 hours and administer antipyretics as prescribed; report sustained fever above 39C or fever recurrence after initial defervescence (may indicate secondary bacterial infection)",
      "Educate patient on respiratory hygiene: cover mouth and nose with tissue when coughing or sneezing, dispose of tissues immediately, perform hand hygiene after contact with respiratory secretions",
      "Monitor fluid balance with strict intake and output recording; encourage oral fluids and report urine output below 30 mL/hour or signs of dehydration",
      "Report clinical deterioration including increased work of breathing, declining oxygen saturation, new onset confusion, or hemodynamic instability to the physician immediately",
      "Verify influenza vaccination status and educate patient and family on importance of annual vaccination; document vaccination history and any contraindications"
    ],
    assessmentFindings: [
      "Abrupt onset of high fever (38.5-40C/101-104F), rigors, severe myalgia (muscle aches), headache, and profound fatigue distinguishing influenza from common cold",
      "Dry nonproductive cough that may become productive over several days; sore throat and rhinorrhea more common in early illness",
      "Tachypnea and dyspnea indicating lower respiratory tract involvement; crackles on auscultation suggesting viral or secondary bacterial pneumonia",
      "Children may present with additional symptoms including otitis media, nausea, vomiting, diarrhea, febrile seizures, and croup-like symptoms",
      "Elderly patients may present atypically with confusion, functional decline, falls, or exacerbation of chronic conditions WITHOUT prominent fever",
      "Signs of dehydration: decreased urine output, concentrated urine, dry mucous membranes, poor skin turgor, tachycardia, orthostatic hypotension"
    ],
    signs: {
      left: [
        "Acute onset of fever with chills and myalgia",
        "Dry nonproductive cough and sore throat",
        "Rhinorrhea and nasal congestion",
        "Headache and fatigue",
        "Mild tachycardia proportional to fever",
        "Decreased appetite and mild malaise"
      ],
      right: [
        "Severe dyspnea with oxygen saturation below 90% (respiratory failure)",
        "Cyanosis of lips and nail beds indicating hypoxemia",
        "Signs of secondary bacterial pneumonia (new fever spike, purulent sputum, lobar consolidation)",
        "Altered level of consciousness or seizures (encephalitis or Reye syndrome)",
        "Hemodynamic instability with persistent hypotension (sepsis from secondary infection)",
        "Chest pain with ST changes on ECG (myocarditis complication)"
      ]
    },
    medications: [
      {
        name: "Oseltamivir (Tamiflu)",
        type: "Neuraminidase inhibitor / Antiviral",
        action: "Selectively inhibits influenza neuraminidase enzyme, preventing cleavage of sialic acid residues on host cell surfaces and trapping newly formed viral particles within infected cells, thereby blocking viral release and spread to uninfected respiratory epithelial cells",
        sideEffects: "Nausea and vomiting (most common, reduced by taking with food), headache, diarrhea; rare reports of neuropsychiatric events (self-harm, delirium) primarily in pediatric patients in Japan",
        contra: "Known hypersensitivity to oseltamivir; dose adjustment required in renal impairment (creatinine clearance below 30 mL/min); not a substitute for annual influenza vaccination",
        pearl: "Most effective when started within 48 hours of symptom onset but can still be given beyond 48 hours in hospitalized or high-risk patients; treatment dose is 75 mg twice daily for 5 days in adults; prophylaxis dose is 75 mg once daily for 10 days after exposure; administer with food to reduce GI side effects"
      },
      {
        name: "Zanamivir (Relenza)",
        type: "Neuraminidase inhibitor / Inhaled antiviral",
        action: "Inhibits influenza A and B neuraminidase at the respiratory epithelial surface through direct delivery to the site of infection via oral inhalation; prevents viral particle release from infected cells in the upper and lower respiratory tract",
        sideEffects: "Bronchospasm (especially in patients with underlying airways disease), cough, nasal congestion, headache, dizziness; oropharyngeal discomfort",
        contra: "History of allergy to milk proteins (lactose in formulation contains milk protein); NOT recommended for patients with underlying airways disease (asthma, COPD) due to risk of severe bronchospasm; avoid in patients unable to use inhaler device properly",
        pearl: "Administered via Diskhaler inhalation device: 2 inhalations (10 mg total) twice daily for 5 days; instruct patient to inhale deeply and hold breath; if patient is also using a bronchodilator inhaler, the bronchodilator should be administered BEFORE zanamivir; not recommended for children under 7 years for treatment"
      },
      {
        name: "Acetaminophen (Tylenol)",
        type: "Analgesic / Antipyretic",
        action: "Inhibits cyclooxygenase (COX) enzymes primarily in the central nervous system, reducing prostaglandin synthesis in the hypothalamic thermoregulatory center to lower fever; provides analgesia through central pain pathway modulation without significant peripheral anti-inflammatory activity",
        sideEffects: "Hepatotoxicity is the primary concern, especially at doses exceeding 4 g/day or with concurrent alcohol use; nausea, rash (rare); allergic reactions (rare)",
        contra: "Severe hepatic impairment or active liver disease; chronic alcohol use disorder (maximum 2 g/day); must account for acetaminophen in ALL combination products (cold medications, opioid combinations) to avoid unintentional overdose",
        pearl: "Preferred antipyretic in influenza for ALL age groups because it does NOT carry the risk of Reye syndrome; ASA (aspirin) and other salicylates are CONTRAINDICATED in children and adolescents under 18 years with influenza; N-acetylcysteine is the antidote for acetaminophen overdose and must be started within 8 hours of ingestion for maximum hepatoprotection"
      }
    ],
    pearls: [
      "Antigenic DRIFT (minor mutations causing seasonal epidemics) vs antigenic SHIFT (major reassortment causing pandemics) -- drift is like a gradual costume change, shift is like wearing an entirely new disguise",
      "NEVER give aspirin (ASA) to children or adolescents under 18 with influenza or varicella due to the risk of Reye syndrome, a potentially fatal condition causing acute hepatic failure and encephalopathy",
      "Influenza is spread by DROPLET transmission (large particles traveling less than 2 meters) -- use surgical mask within 2 meters of the patient; droplet precautions differ from airborne precautions which require N95 and negative-pressure room",
      "Oseltamivir is most effective within 48 hours of symptom onset but is still recommended for hospitalized patients or those at high risk for complications regardless of timing; the mantra is 'treat first, test second' in high-risk patients during influenza season",
      "A new fever spike or clinical deterioration after initial improvement (days 3-5) is a red flag for secondary bacterial pneumonia -- the most common and most dangerous complication of influenza",
      "Annual influenza vaccination is recommended for ALL individuals aged 6 months and older; the inactivated injectable vaccine CANNOT cause influenza -- educate patients who express this common misconception",
      "Elderly patients may present with atypical influenza: confusion, falls, or functional decline WITHOUT fever -- always maintain a high index of suspicion during influenza season in long-term care facilities"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a 6-year-old child with confirmed influenza who is febrile at 39.2C. The parent asks if they can give the child aspirin for the fever. What is the most appropriate response?",
        options: [
          "Yes, aspirin is safe for children with influenza at age-appropriate doses",
          "Aspirin must not be given to children with influenza because it can cause Reye syndrome; acetaminophen is the safe alternative",
          "Aspirin is only contraindicated in children under 2 years of age",
          "Aspirin can be given if the fever is above 39C to prevent febrile seizures"
        ],
        correct: 1,
        rationale: "Aspirin (ASA) is strictly contraindicated in children and adolescents under 18 years with influenza or varicella due to the strong association with Reye syndrome, a rare but potentially fatal condition causing acute hepatic failure and encephalopathy. Acetaminophen is the recommended antipyretic."
      },
      {
        question: "A practical nurse is admitting a patient with suspected influenza to a medical unit. Which transmission-based precautions should be implemented?",
        options: [
          "Airborne precautions with N95 respirator and negative-pressure room",
          "Contact precautions with gown and gloves",
          "Droplet precautions with surgical mask when within 2 meters of the patient",
          "Standard precautions only with no additional measures needed"
        ],
        correct: 2,
        rationale: "Influenza is transmitted via large respiratory droplets that travel less than 2 meters. Droplet precautions require wearing a surgical mask when within 2 meters of the patient, placing the patient in a private room (or cohorting with other influenza patients), and providing the patient with a mask during transport."
      },
      {
        question: "A patient with influenza was improving on day 3 but now presents with a new fever of 39.5C, productive cough with yellow-green sputum, and right lower lobe crackles. What complication should the practical nurse suspect and report?",
        options: [
          "Viral exacerbation of influenza requiring increased antiviral dosing",
          "Secondary bacterial pneumonia requiring urgent physician notification",
          "Medication side effect from oseltamivir therapy",
          "Expected normal progression of influenza illness"
        ],
        correct: 1,
        rationale: "A new fever spike with purulent sputum production and focal lung findings after initial improvement is the classic presentation of secondary bacterial pneumonia, the most common and serious complication of influenza. This requires immediate physician notification for blood cultures, chest X-ray, and empiric antibiotic therapy."
      }
    ]
  },

  "informed-consent-rpn": {
    title: "Informed Consent and Capacity Assessment for Practical Nurses",
    cellular: {
      title: "Legal and Ethical Foundations of Informed Consent",
      content: "Informed consent is a legal and ethical process that ensures patients have the right to make autonomous decisions about their healthcare based on adequate information, understanding, and voluntariness. The doctrine of informed consent is rooted in the ethical principles of autonomy (the right of competent individuals to make decisions about their own bodies), beneficence (acting in the patient's best interest), and nonmaleficence (doing no harm). In Canadian and American common law, providing treatment without valid informed consent constitutes battery (unwanted touching) and may also constitute negligence if the healthcare provider failed to disclose material risks that a reasonable person would want to know before making a decision. There are five essential elements of valid informed consent. First, disclosure: the healthcare provider must explain the diagnosis, the nature and purpose of the proposed treatment or procedure, the expected benefits, the material risks and potential complications, alternative treatments (including the option of no treatment), and the consequences of refusing treatment. Second, comprehension: the information must be presented in language and format that the patient can understand, avoiding medical jargon, using interpreters when necessary, and verifying understanding through teach-back methods. Third, voluntariness: the decision must be made freely without coercion, undue influence, or manipulation from healthcare providers, family members, or institutional pressures. Fourth, capacity: the patient must have the cognitive ability to understand the information provided, appreciate how it applies to their personal situation, reason about the options, and express a choice. Capacity is decision-specific (a patient may have capacity for some decisions but not others) and time-specific (capacity can fluctuate, particularly in patients with delirium or cognitive impairment). Capacity is assessed by healthcare providers and is a clinical determination, whereas competence is a legal determination made by a court. Fifth, authorization: the patient voluntarily agrees to the proposed treatment and this agreement is documented. In Canada, when an adult patient lacks capacity to consent, a substitute decision-maker (SDM) provides consent on the patient's behalf. The hierarchy of SDMs varies by province but generally follows: court-appointed guardian, person with power of attorney for personal care, spouse or common-law partner, adult child, parent, sibling, then other relatives. The SDM must make decisions based on the patient's previously expressed wishes (if known) or, if no wishes were expressed, in the patient's best interest. Therapeutic privilege is a narrow and rarely justified exception that allows a healthcare provider to withhold information if disclosure would directly and seriously harm the patient (for example, causing immediate psychological harm that would prevent rational decision-making). This exception is extremely limited and must be carefully documented. In emergencies where the patient lacks capacity and no SDM is available, treatment necessary to prevent death or serious harm may be provided under the emergency exception to informed consent. The practical nurse's role in informed consent includes witnessing the consent process (verifying that the patient signed voluntarily and appeared to understand), documenting the consent process, ensuring consent forms are completed before procedures, recognizing when a patient may lack capacity (and reporting this concern), and advocating for patients who appear to be under duress or who do not understand what they are consenting to. The practical nurse does NOT obtain informed consent for medical procedures or surgeries -- this is the responsibility of the practitioner performing the procedure. However, the practical nurse does obtain consent for nursing procedures within their scope of practice (wound care, catheter insertion, medication administration)."
    },
    riskFactors: [
      "Cognitive impairment from dementia, delirium, traumatic brain injury, or intellectual disability affecting capacity to understand and process information",
      "Language barriers without access to qualified medical interpreters leading to inadequate comprehension of disclosed information",
      "Acute illness with altered consciousness, pain, or medication effects (sedatives, opioids, anesthetics) temporarily impairing decision-making capacity",
      "Age extremes: minors require parental/guardian consent; elderly patients may have fluctuating capacity requiring repeated assessment",
      "Mental health conditions (psychosis, severe depression, mania) that may impair appreciation of consequences or ability to reason about treatment options",
      "Cultural and religious factors that influence health beliefs, decision-making processes, and family involvement in consent",
      "Power imbalance between healthcare providers and patients that may create subtle coercion or inhibit patients from asking questions or refusing treatment"
    ],
    diagnostics: [
      "Capacity assessment using four criteria: ability to understand information, appreciate its relevance to personal situation, reason about options and consequences, and express a consistent choice",
      "Mini-Mental State Examination (MMSE) or Montreal Cognitive Assessment (MoCA): screens for cognitive impairment but does NOT independently determine capacity; score provides supporting data",
      "Assessment of decision-making ability: ask patient to explain in their own words what procedure is planned, why it is recommended, what the risks are, and what alternatives exist (teach-back method)",
      "Review of advance directives, living will, or power of attorney for personal care documents to identify previously expressed wishes and designated substitute decision-makers",
      "Psychiatric consultation when capacity determination is complex, contested by family members, or involves refusal of life-sustaining treatment by a patient with mental illness",
      "Documentation review: verify all required elements of consent are present in the medical record including signed consent form, identity verification, and documentation of information disclosed"
    ],
    management: [
      "Ensure the practitioner performing the procedure obtains informed consent by explaining the procedure, risks, benefits, and alternatives in language the patient understands",
      "Verify patient identity using two identifiers and confirm the correct procedure and site before obtaining consent signature",
      "Provide written materials, visual aids, or interpreter services to support patient comprehension when language, literacy, or sensory barriers exist",
      "Document the consent process including what information was provided, patient questions and responses, assessment of patient understanding, and any concerns raised",
      "If the patient expresses uncertainty, anxiety, or signs of coercion, pause the consent process and notify the responsible practitioner immediately",
      "For patients lacking capacity, identify and contact the appropriate substitute decision-maker according to the jurisdictional hierarchy; document the SDM relationship and contact information",
      "Store completed consent forms in the patient's permanent medical record; ensure copies are available in the operative or procedural area as required by facility policy"
    ],
    nursingActions: [
      "Verify that the consent form is signed, dated, and witnessed BEFORE the patient receives any preoperative sedation or anxiolytic medication that could impair decision-making capacity",
      "Serve as a patient advocate by ensuring the patient had the opportunity to ask questions and received answers before signing; report concerns about inadequate consent to the charge nurse",
      "Assess for signs that the patient may lack capacity: inability to repeat back key information, confusion about the procedure, inconsistent responses, or inability to appreciate personal relevance",
      "Recognize situations requiring special consent considerations: emergency situations, minors, patients with cognitive impairment, advance directive conflicts, and patients refusing treatment",
      "Document the witnessing role accurately: state that the patient appeared to understand, signed voluntarily, and was not visibly under duress or impaired; do NOT document that consent was 'obtained' if you were only the witness",
      "Report immediately if a patient withdraws consent at any point before or during a procedure -- consent can be revoked at any time and this must be communicated to the procedural team",
      "Ensure consent is obtained for nursing-specific procedures within scope of practice: wound care involving debridement, urinary catheter insertion, nasogastric tube insertion, and restraint application"
    ],
    assessmentFindings: [
      "Patient demonstrates understanding by accurately describing the proposed procedure, expected outcomes, and key risks using their own words (teach-back method confirms comprehension)",
      "Patient demonstrates appreciation by explaining how the information relates to their personal health situation and expressing awareness of potential personal consequences",
      "Signs of inadequate comprehension: patient unable to explain the procedure or its purpose, appears confused, asks unrelated questions, or provides inconsistent responses when asked the same question in different ways",
      "Signs of potential coercion: patient avoids eye contact, looks to family member before answering, expresses reluctance, or states 'they told me I have to' without demonstrating personal understanding",
      "Fluctuating capacity indicators: periods of lucidity alternating with confusion, time-of-day variations (sundowner pattern), inconsistent responses across assessment sessions",
      "Cultural considerations: some patients defer decision-making to family elders or religious leaders as a cultural norm rather than due to lack of capacity; assess whether this reflects autonomous choice"
    ],
    signs: {
      left: [
        "Patient asks clarifying questions about the procedure",
        "Patient requests additional time to consider options",
        "Mild anxiety about the procedure (normal and expected)",
        "Patient asks to speak with family before deciding",
        "Patient requests written information or second opinion",
        "Patient appears uncertain but engaged in discussion"
      ],
      right: [
        "Patient unable to state what procedure is planned despite repeated explanation",
        "Patient visibly frightened, crying, or stating they are being forced",
        "Patient appears heavily sedated or disoriented and is being asked to sign consent",
        "Family member signing consent without legal authority as substitute decision-maker",
        "Patient explicitly withdrawing previously given consent before or during procedure",
        "Consent obtained without interpreter for patient with limited English proficiency"
      ]
    },
    medications: [
      {
        name: "Consent Form (Standardized Documentation Tool)",
        type: "Legal Documentation Tool",
        action: "Provides a structured written record of the informed consent process, documenting that the patient received disclosure of the procedure name, purpose, risks, benefits, alternatives, and consequences of refusal; captures patient signature, date, and witness signature as evidence of voluntary authorization",
        sideEffects: "Incomplete documentation may result in legal liability; form alone does not prove adequate consent process occurred; over-reliance on form signature without ensuring genuine understanding creates false sense of legal protection",
        contra: "Must not be signed by patient who is under influence of sedative medications, lacks decision-making capacity, or is under coercion; form is invalid if signed by unauthorized person; must not replace the verbal consent discussion between practitioner and patient",
        pearl: "The consent FORM is documentation of the consent PROCESS -- a signed form without a genuine informed discussion is legally and ethically insufficient; the practical nurse's role as witness confirms the patient appeared to understand and signed voluntarily, not that the nurse performed the consent discussion"
      },
      {
        name: "Capacity Assessment Tool (Structured Clinical Assessment)",
        type: "Clinical Assessment Documentation Tool",
        action: "Guides systematic evaluation of a patient's decision-making capacity by assessing four functional abilities: understanding of disclosed information, appreciation of how information applies personally, reasoning about treatment options and consequences, and ability to express a consistent choice",
        sideEffects: "False-positive (incorrectly concluding patient lacks capacity) may override patient autonomy; false-negative (incorrectly concluding capacity exists) may result in uninformed decision-making; cultural and language bias may affect results if not accounted for",
        contra: "Should not be used as sole determinant of capacity without clinical judgment; does not replace formal psychiatric evaluation when capacity is contested or when refusal of life-sustaining treatment is involved; cognitive screening tools (MMSE, MoCA) assess cognition, not capacity specifically",
        pearl: "Capacity is decision-specific and time-specific: a patient with moderate dementia may have capacity to consent to blood work but lack capacity to consent to cardiac surgery; reassess capacity if clinical status changes (delirium resolution, medication effects, pain management)"
      },
      {
        name: "Witness Documentation (Formal Attestation Record)",
        type: "Legal Documentation Tool",
        action: "Records that a designated witness (often the practical nurse) observed the patient signing the consent form, confirmed the patient's identity, and attests that the patient appeared to understand the information provided and signed voluntarily without visible duress or impairment",
        sideEffects: "Witness may face legal scrutiny if consent process was inadequate; witnessing does not imply the nurse verified the adequacy of information disclosed by the practitioner; liability risk if witness signed without being present during the actual signing",
        contra: "Nurse must NOT serve as witness if they were not physically present when the patient signed; must not witness consent if they believe the patient lacks capacity, is under coercion, or did not understand the information; must not witness if they have a conflict of interest",
        pearl: "The witness signature attests to three things: the patient is the person who signed, the patient appeared to understand, and the signing appeared voluntary; if the practical nurse has concerns about any of these elements, they must REFUSE to witness and escalate to the charge nurse"
      }
    ],
    pearls: [
      "Informed consent is a PROCESS, not a form -- a signed consent form without genuine disclosure, comprehension, and voluntariness is legally and ethically invalid",
      "Capacity is decision-specific and time-specific: a patient may have capacity for simple decisions (accepting blood work) but lack capacity for complex decisions (consenting to surgery) -- always assess capacity relative to the specific decision at hand",
      "The practitioner performing the procedure is responsible for obtaining informed consent by explaining the procedure, risks, benefits, and alternatives; the practical nurse WITNESSES the consent but does not obtain it for medical procedures",
      "Consent can be withdrawn at ANY time, even during a procedure -- if a patient states they want to stop, the practical nurse must immediately communicate this to the procedural team and advocate for the patient",
      "In emergencies where the patient lacks capacity and no substitute decision-maker is available, treatment necessary to prevent death or serious bodily harm may proceed without consent under the emergency exception",
      "Verify consent is signed BEFORE preoperative sedation is administered -- consent obtained after sedation may be considered invalid because the patient's capacity to understand and reason was pharmacologically impaired",
      "Use the teach-back method to verify understanding: ask the patient to explain in their own words what procedure is planned, why it is being done, and what the main risks are -- this is more reliable than asking 'Do you understand?'"
    ],
    quiz: [
      {
        question: "A patient scheduled for surgery tells the practical nurse, 'I signed the form, but I really do not understand what they are going to do to me.' What is the most appropriate nursing action?",
        options: [
          "Reassure the patient that the surgeon will explain everything in the operating room",
          "Explain the procedure to the patient in detail as the nurse's responsibility",
          "Notify the surgeon that the patient does not understand the procedure and the consent process needs to be repeated",
          "Proceed with preoperative preparation since the consent form is already signed"
        ],
        correct: 2,
        rationale: "A signed consent form is invalid if the patient does not understand the information. The practical nurse must advocate for the patient by notifying the surgeon that the consent process needs to be repeated. The practitioner performing the procedure is responsible for ensuring the patient understands before valid consent can be obtained."
      },
      {
        question: "A practical nurse is asked to witness a consent form for a patient who received IV midazolam (a benzodiazepine) 30 minutes ago for anxiety. What is the appropriate action?",
        options: [
          "Witness the form since the patient is alert and cooperative",
          "Refuse to witness the consent and report that the patient received sedation prior to signing, which may impair capacity",
          "Ask the patient if they feel capable of signing and proceed if they say yes",
          "Have a family member co-sign the form as additional verification"
        ],
        correct: 1,
        rationale: "Consent should be obtained BEFORE administration of sedative medications that may impair cognitive function and decision-making capacity. The practical nurse should refuse to witness consent obtained after sedation and report the concern to the charge nurse and the responsible practitioner to ensure valid consent is obtained."
      },
      {
        question: "An elderly patient with moderate dementia is admitted for a hip fracture requiring surgical repair. The patient cannot explain what surgery is planned when asked. Which action is most appropriate regarding consent?",
        options: [
          "Obtain consent from the patient since all patients have the right to consent for themselves",
          "Cancel the surgery since the patient cannot provide consent",
          "Contact the patient's substitute decision-maker to provide consent based on the patient's best interests",
          "Have two nurses sign the consent form on the patient's behalf"
        ],
        correct: 2,
        rationale: "When a patient lacks capacity to provide informed consent (inability to understand and explain the proposed procedure), the substitute decision-maker must be contacted to provide consent. The SDM should make decisions based on the patient's previously expressed wishes or, if unknown, in the patient's best interest. Two nurses cannot consent on behalf of a patient."
      }
    ]
  },

  "intake-output-rpn": {
    title: "Intake and Output Monitoring for Practical Nurses",
    cellular: {
      title: "Physiology of Fluid Balance and Intake-Output Monitoring",
      content: "Fluid balance is a fundamental concept in nursing care that reflects the relationship between fluid intake (all sources of fluid entering the body) and fluid output (all sources of fluid leaving the body). The human body is approximately 60% water in adult males and 55% in adult females, distributed between two major compartments: the intracellular fluid (ICF) compartment containing approximately two-thirds of total body water within cells, and the extracellular fluid (ECF) compartment containing the remaining one-third, which is further divided into intravascular fluid (plasma, approximately 3 liters), interstitial fluid (fluid between cells, approximately 11 liters), and transcellular fluid (cerebrospinal fluid, synovial fluid, pleural fluid, peritoneal fluid, approximately 1 liter). The kidneys are the primary regulators of fluid balance, filtering approximately 180 liters of plasma daily through the glomeruli and reabsorbing approximately 99% of this filtrate back into the blood. Normal urine output in adults is 0.5 to 1.0 mL/kg/hour, meaning a 70 kg adult should produce approximately 35 to 70 mL of urine per hour, or roughly 1,500 to 2,000 mL per day. Urine output below 30 mL/hour (oliguria) in an adult may indicate decreased renal perfusion, dehydration, or acute kidney injury and must be reported promptly. Anuria (urine output below 100 mL in 24 hours) is a medical emergency suggesting renal failure or complete urinary obstruction. Fluid intake includes all oral liquids (water, juice, coffee, tea, soup broth, gelatin, ice chips -- remember that ice chips count as approximately half their volume when melted), intravenous fluids and IV medications (including piggyback infusions and flushes), tube feeding (nasogastric, gastrostomy, or jejunostomy), blood products, and irrigation fluids that are not recovered. Fluid output includes urine (measured by collection hat, urometer, catheter drainage bag, or weighing diapers in infants), emesis (vomiting), diarrheal stool (measured or estimated), wound drainage (surgical drains, wound VAC canisters), nasogastric tube drainage, chest tube drainage, and blood loss. Insensible fluid losses are fluid losses that cannot be directly measured and include water lost through respiration (approximately 300-400 mL/day), perspiration through intact skin (approximately 300-600 mL/day), and evaporation from open wounds or burns. Insensible losses increase significantly with fever (approximately 100-150 mL additional loss per degree Celsius above 37), tachypnea, mechanical ventilation with non-humidified air, burns, and diaphoresis. A positive fluid balance (intake exceeds output) may indicate fluid retention from heart failure, renal failure, or excessive IV fluid administration, and can manifest as peripheral edema, weight gain, pulmonary crackles, and jugular venous distension. A negative fluid balance (output exceeds intake) may indicate dehydration from inadequate oral intake, excessive diuresis, hemorrhage, or third-spacing of fluid, manifesting as weight loss, decreased skin turgor, dry mucous membranes, concentrated urine, tachycardia, and hypotension. Strict intake and output monitoring is ordered for patients with heart failure, renal disease, post-surgical patients, patients receiving IV fluid therapy, patients with burns, patients on diuretic therapy, critically ill patients, and patients with fluid and electrolyte imbalances. Accurate measurement and documentation are essential for guiding fluid management decisions."
    },
    riskFactors: [
      "Heart failure (impaired cardiac output leads to fluid retention, pulmonary edema, and positive fluid balance requiring careful monitoring)",
      "Acute or chronic kidney disease (impaired ability to regulate fluid excretion, electrolyte balance, and acid-base status)",
      "Post-surgical status (third-spacing of fluids, blood loss, NPO status, and IV fluid administration all affect fluid balance)",
      "Severe burns (massive fluid shifts from intravascular to interstitial space, dramatically increased insensible losses through damaged skin)",
      "Diuretic therapy (loop diuretics such as furosemide can cause excessive fluid and electrolyte losses if not monitored carefully)",
      "Extremes of age (neonates have higher body water content and limited renal concentrating ability; elderly have decreased thirst sensation and renal function)",
      "Fever, tachypnea, and diaphoresis (significantly increase insensible fluid losses that are not captured in standard output measurements)"
    ],
    diagnostics: [
      "24-hour intake and output record: comprehensive documentation of all fluid sources entering and leaving the body; calculate net balance (intake minus output) at end of each 24-hour period",
      "Daily weight: most accurate indicator of fluid status changes; 1 kg weight change equals approximately 1 liter of fluid gain or loss; weigh at same time daily, same scale, same clothing",
      "Serum electrolytes (sodium, potassium, chloride, bicarbonate): sodium reflects fluid balance (hypernatremia with dehydration, hyponatremia with fluid overload or dilution); potassium critical for cardiac function",
      "Blood urea nitrogen (BUN) and creatinine: BUN-to-creatinine ratio above 20:1 suggests prerenal azotemia (dehydration/decreased renal perfusion); both elevated in intrinsic renal disease",
      "Urine specific gravity: normal 1.005-1.030; elevated (above 1.030) indicates concentrated urine (dehydration); low (below 1.005) indicates dilute urine (fluid overload or diabetes insipidus)",
      "Serum osmolality: normal 275-295 mOsm/kg; elevated with dehydration, decreased with fluid overload; helps guide IV fluid selection (isotonic, hypotonic, or hypertonic)"
    ],
    management: [
      "Implement strict intake and output monitoring as ordered; ensure all nursing staff, including night shift, are aware of the order and maintain consistent measurement techniques",
      "Administer IV fluids at prescribed rate using an infusion pump; verify fluid type and rate against the order at each handover and at least every 4 hours during infusion",
      "Administer diuretics as prescribed and monitor response by measuring urine output within 1-2 hours after administration; report inadequate diuretic response (less than expected urine output)",
      "Restrict fluid intake as ordered (typically 1,000-1,500 mL/day for heart failure or SIADH); distribute allowance across meals and shifts; explain rationale to patient and family",
      "Encourage oral fluid intake as prescribed for patients who are dehydrated; offer preferred fluids, provide fresh water at bedside, and assist patients with limited mobility to drink regularly",
      "Weigh patient daily at the same time (usually before breakfast), using the same scale, wearing similar clothing; report weight changes of 1 kg or more in 24 hours",
      "Monitor for signs of fluid overload (peripheral edema, pulmonary crackles, jugular venous distension, weight gain, dyspnea) and dehydration (poor skin turgor, dry mucous membranes, concentrated urine, weight loss, tachycardia)"
    ],
    nursingActions: [
      "Measure and record ALL fluid intake: oral liquids, IV fluids (including piggybacks and flushes), tube feedings, blood products, and irrigation fluids not recovered; record ice chips at half volume",
      "Measure and record ALL fluid output: urine (using graduated container or urometer), emesis, diarrheal stool (estimate or weigh), wound drainage, nasogastric tube output, chest tube drainage",
      "Calculate and document the net fluid balance (intake minus output) at the end of each shift and cumulatively for 24 hours; report imbalances exceeding 500 mL positive or negative",
      "Assess urine characteristics each time output is measured: color (pale yellow is normal; dark amber suggests concentration/dehydration; red/brown may indicate hematuria or myoglobinuria), clarity, and odor",
      "Report urine output below 30 mL/hour or below 0.5 mL/kg/hour in adults immediately as this may indicate acute kidney injury, hypovolemia, or urinary obstruction",
      "Weigh diapers for incontinent patients and infants: 1 gram of weight gain equals 1 mL of urine output; subtract dry diaper weight from wet diaper weight",
      "Monitor IV insertion site every 1-2 hours for signs of infiltration (swelling, coolness, pallor) or phlebitis (redness, warmth, pain, palpable cord along the vein) and document findings"
    ],
    assessmentFindings: [
      "Fluid overload: peripheral pitting edema (graded 1+ through 4+), weight gain greater than 1 kg in 24 hours, pulmonary crackles (especially bibasilar), jugular venous distension, bounding pulse, elevated blood pressure",
      "Dehydration: poor skin turgor (tenting when pinched on sternum or forehead), dry cracked mucous membranes, sunken eyes, flat neck veins in supine position, orthostatic hypotension, tachycardia",
      "Concentrated urine: dark amber color, specific gravity above 1.030, strong odor; indicates inadequate fluid intake or excessive fluid loss",
      "Dilute urine: pale to colorless, specific gravity below 1.005; may indicate fluid overload, excessive IV fluid administration, or diabetes insipidus",
      "Third-spacing: fluid shifts from intravascular space to interstitial or transcellular spaces (ascites, pleural effusion, tissue edema); patient may appear edematous while simultaneously being intravascularly depleted",
      "Electrolyte imbalance indicators: muscle weakness and ECG changes (potassium), confusion and seizures (sodium), Chvostek and Trousseau signs (calcium/magnesium)"
    ],
    signs: {
      left: [
        "Mild decrease in urine output (400-500 mL below expected)",
        "Slight weight change (0.5 kg in 24 hours)",
        "Mild thirst or dry mouth",
        "Trace to 1+ peripheral edema",
        "Slightly concentrated or dilute urine",
        "Mild fatigue or restlessness"
      ],
      right: [
        "Urine output below 30 mL/hour for 2 consecutive hours (oliguria)",
        "Anuria (less than 100 mL in 24 hours indicating renal failure or obstruction)",
        "Acute pulmonary edema (severe dyspnea, pink frothy sputum, crackles throughout lung fields)",
        "Severe dehydration with hemodynamic instability (hypotension, tachycardia above 120, altered consciousness)",
        "Rapid weight gain of 2+ kg in 24 hours with respiratory distress",
        "Signs of fluid compartment shift with concurrent edema and hypovolemic shock"
      ]
    },
    medications: [
      {
        name: "Furosemide (Lasix)",
        type: "Loop diuretic",
        action: "Inhibits the sodium-potassium-2-chloride (Na+/K+/2Cl-) cotransporter in the thick ascending limb of the loop of Henle, blocking reabsorption of approximately 25% of filtered sodium and producing potent diuresis with loss of water, sodium, potassium, chloride, calcium, and magnesium",
        sideEffects: "Hypokalemia (most clinically significant), hyponatremia, hypomagnesemia, hypocalcemia, dehydration, orthostatic hypotension, ototoxicity (especially with rapid IV administration or concurrent aminoglycosides), hyperuricemia, hyperglycemia",
        contra: "Anuria (no urine output indicates kidneys cannot respond to diuretic); severe hypovolemia or dehydration; known hypersensitivity (sulfonamide cross-reactivity is possible); hepatic coma or severe electrolyte depletion",
        pearl: "Monitor potassium level before and during therapy -- hypokalemia below 3.5 mEq/L increases risk of cardiac dysrhythmias (especially digoxin toxicity); IV furosemide should be pushed slowly (no faster than 20 mg/min) to prevent ototoxicity; expected onset of action is 5 minutes IV, 30 minutes oral; expect increased urine output within 1-2 hours"
      },
      {
        name: "0.9% Sodium Chloride (Normal Saline)",
        type: "Isotonic crystalloid IV fluid",
        action: "Provides isotonic fluid replacement that remains primarily in the extracellular fluid compartment (intravascular and interstitial spaces); osmolarity of 308 mOsm/L approximates normal plasma osmolarity, preventing fluid shifts between compartments; expands intravascular volume without causing cellular swelling or shrinkage",
        sideEffects: "Hyperchloremic metabolic acidosis with large volume infusion (chloride content of 154 mEq/L exceeds plasma chloride); fluid overload with pulmonary edema if infused too rapidly or in excess; peripheral edema; dilutional hyponatremia with concurrent free water intake",
        contra: "Fluid overload states (decompensated heart failure, pulmonary edema) unless specifically ordered for targeted therapy; hypernatremia; conditions requiring free water replacement (use hypotonic solutions instead)",
        pearl: "First-line fluid for acute volume resuscitation, medication dilution, and blood product compatibility; one liter of normal saline expands intravascular volume by approximately 250-300 mL (the remaining distributes to interstitial space); monitor for signs of fluid overload especially in patients with heart failure or renal disease"
      },
      {
        name: "Potassium Chloride (KCl) IV/Oral supplement",
        type: "Electrolyte replacement",
        action: "Replaces potassium deficit caused by diuretic therapy, GI losses, or inadequate intake; potassium is the primary intracellular cation essential for maintaining resting membrane potential, cardiac conduction, skeletal muscle contraction, and acid-base balance",
        sideEffects: "Hyperkalemia (life-threatening with IV administration): peaked T waves, widened QRS, cardiac arrest; GI irritation with oral forms (nausea, vomiting, abdominal pain, diarrhea); phlebitis and pain at IV infusion site; tissue necrosis with IV extravasation",
        contra: "Hyperkalemia (serum potassium above 5.0 mEq/L); severe renal impairment (inability to excrete potassium); concurrent potassium-sparing diuretics (spironolactone, triamterene); untreated Addison disease (impaired aldosterone-mediated potassium excretion)",
        pearl: "NEVER give IV potassium as a rapid bolus -- always dilute and infuse via pump at a maximum rate of 10-20 mEq/hour on a regular unit (higher rates only in ICU with continuous cardiac monitoring); verify serum potassium level before each dose; oral KCl should be taken with food and a full glass of water to reduce GI irritation; monitor ECG during IV infusion"
      }
    ],
    pearls: [
      "The most accurate indicator of fluid balance is daily weight -- 1 kg weight change equals approximately 1 liter of fluid gained or lost; weigh at the same time daily, same scale, same clothing for consistency",
      "Minimum acceptable urine output for adults is 0.5 mL/kg/hour (approximately 30 mL/hour for a 60 kg patient) -- output below this threshold for 2 or more consecutive hours requires immediate physician notification as it may indicate acute kidney injury",
      "Ice chips count as approximately HALF their volume when recording fluid intake (200 mL of ice chips equals approximately 100 mL of fluid intake); gelatin, popsicles, and soup broth all count as fluid intake",
      "Insensible losses (respiratory and skin evaporation) are approximately 500-1,000 mL/day but increase significantly with fever (add 100-150 mL per degree Celsius above 37C), tachypnea, diaphoresis, and open wounds or burns",
      "For incontinent patients and infants, weigh diapers to measure urine output: 1 gram of weight increase equals 1 mL of urine; subtract the dry diaper weight from the wet diaper weight",
      "A net positive fluid balance of 500 mL or more should be reported, especially in patients with heart failure; conversely, a net negative balance with signs of dehydration requires prompt intervention",
      "When a patient is on both IV fluids and a diuretic, the practical nurse must monitor that urine output reflects an appropriate diuretic response; report inadequate response (less than expected output within 1-2 hours of loop diuretic administration) to the physician"
    ],
    quiz: [
      {
        question: "A practical nurse is monitoring strict intake and output for a postoperative patient. The patient consumed 240 mL of water, 180 mL of juice, received 1,000 mL of IV normal saline, and ate 150 mL of gelatin. Urine output was 950 mL and wound drainage was 75 mL. What is the net fluid balance?",
        options: [
          "Positive 545 mL",
          "Positive 395 mL",
          "Negative 545 mL",
          "Positive 1,570 mL"
        ],
        correct: 0,
        rationale: "Total intake: 240 + 180 + 1,000 + 150 (gelatin counts as fluid) = 1,570 mL. Total output: 950 + 75 = 1,025 mL. Net balance: 1,570 - 1,025 = positive 545 mL. This positive balance should be documented and monitored for ongoing fluid retention."
      },
      {
        question: "A practical nurse notes that a patient's urine output has been 20 mL/hour for the past 3 hours. The patient weighs 70 kg. What is the priority nursing action?",
        options: [
          "Continue monitoring and reassess in 2 hours",
          "Encourage the patient to increase oral fluid intake",
          "Report the finding to the physician immediately as the output is below the minimum acceptable threshold",
          "Restrict fluid intake to prevent fluid overload"
        ],
        correct: 2,
        rationale: "Minimum acceptable urine output for adults is 0.5 mL/kg/hour. For a 70 kg patient, this is 35 mL/hour. Output of 20 mL/hour for 3 consecutive hours represents significant oliguria and must be reported immediately as it may indicate decreased renal perfusion, hypovolemia, or acute kidney injury requiring urgent intervention."
      },
      {
        question: "A patient with heart failure gained 2.3 kg overnight. The practical nurse recognizes this weight gain most likely represents which fluid change?",
        options: [
          "Increased muscle mass from physical therapy exercises",
          "Fluid retention of approximately 2.3 liters",
          "Normal daily weight variation within expected parameters",
          "Measurement error requiring recalibration of the scale"
        ],
        correct: 1,
        rationale: "A 1 kg weight change equals approximately 1 liter of fluid. A 2.3 kg weight gain overnight in a heart failure patient represents approximately 2.3 liters of fluid retention, which is a clinically significant finding requiring immediate physician notification and likely adjustment of diuretic therapy. Normal daily weight variation is typically less than 0.5 kg."
      }
    ]
  },

  "intestinal-malrotation-rpn": {
    title: "Intestinal Malrotation and Midgut Volvulus for Practical Nurses",
    cellular: {
      title: "Embryology and Pathophysiology of Intestinal Malrotation",
      content: "Intestinal malrotation is a congenital anomaly resulting from incomplete or abnormal rotation and fixation of the midgut during embryological development. During the 4th to 12th week of gestation, the midgut (which will become the distal duodenum, jejunum, ileum, cecum, appendix, ascending colon, and proximal two-thirds of the transverse colon) herniates out of the abdominal cavity through the umbilical ring into the extraembryonic coelom due to rapid growth of the intestine outpacing the growth of the abdominal cavity. During its return to the abdomen between the 10th and 12th week, the midgut normally undergoes a 270-degree counterclockwise rotation around the axis of the superior mesenteric artery (SMA). After rotation is complete, the mesentery anchors broadly across the posterior abdominal wall from the ligament of Treitz (duodenojejunal junction in the left upper quadrant) to the ileocecal junction (cecum in the right lower quadrant). This broad-based mesenteric attachment prevents the bowel from twisting on its vascular pedicle. When rotation is incomplete, arrested, or reversed, the mesentery has a narrow pedicle attachment rather than a broad base. This narrow mesenteric pedicle creates a critical risk: the entire midgut can twist around the SMA axis, producing a midgut volvulus. Volvulus compromises blood flow through the superior mesenteric artery and vein, causing intestinal ischemia, necrosis, and potentially catastrophic short bowel syndrome or death if not surgically corrected within hours. Additionally, with malrotation, peritoneal fibrous bands called Ladd bands may extend from the malpositioned cecum across the duodenum, causing extrinsic duodenal obstruction independent of volvulus. Approximately 75-85% of patients with symptomatic malrotation present within the first month of life, with most presenting in the first week. The hallmark presentation is bilious (green) vomiting in an otherwise healthy neonate. Bilious vomiting in a newborn is a surgical emergency until proven otherwise because it indicates obstruction DISTAL to the ampulla of Vater where bile enters the duodenum, and malrotation with volvulus is the most time-critical diagnosis to exclude. The incidence of malrotation is estimated at approximately 1 in 500 live births based on autopsy and radiological studies, though many cases remain asymptomatic. Older children and adults with malrotation may present with chronic intermittent abdominal pain, recurrent vomiting, failure to thrive, or chronic diarrhea from intermittent volvulus or lymphatic and venous obstruction. The definitive surgical repair is the Ladd procedure, which involves detorsion of the volvulus (if present), division of Ladd bands, widening the mesenteric base, positioning the small bowel on the right and the colon on the left of the abdomen, and appendectomy (because the appendix will be in an abnormal position, complicating future appendicitis diagnosis). The practical nurse plays a critical role in recognizing the cardinal sign of bilious vomiting in neonates, maintaining NPO status, providing nasogastric decompression, monitoring for signs of bowel ischemia and hemodynamic instability, and supporting the family through an emergent surgical situation."
    },
    riskFactors: [
      "Congenital anomaly occurring during embryological midgut rotation (4th to 12th week of gestation) with no modifiable risk factors",
      "Associated congenital anomalies: omphalocele, gastroschisis, congenital diaphragmatic hernia (30-60% of CDH patients have malrotation)",
      "Congenital heart disease (heterotaxy syndromes including asplenia and polysplenia are strongly associated with malrotation)",
      "Prematurity and low birth weight (higher incidence of associated congenital anomalies including malrotation)",
      "Duodenal atresia and other intestinal atresias (association with abnormal intestinal rotation during development)",
      "Hirschsprung disease (may co-occur with malrotation and complicates surgical management)",
      "Prior abdominal surgery in an infant with known malrotation may increase risk of adhesive bowel obstruction"
    ],
    diagnostics: [
      "Upper gastrointestinal (UGI) series with oral contrast: gold standard diagnostic study for malrotation; normal study shows the duodenojejunal junction (ligament of Treitz) positioned to the LEFT of the spine at the level of the pylorus; malrotation shows the DJ junction displaced to the right or inferiorly",
      "Abdominal X-ray (KUB): may show double bubble sign (dilated stomach and proximal duodenum with distal gasless abdomen) in complete duodenal obstruction from Ladd bands or volvulus; may appear normal in early or intermittent malrotation",
      "Abdominal ultrasound with Doppler: may show abnormal relationship of the superior mesenteric artery (SMA) and superior mesenteric vein (SMV) -- normally SMV is to the right of SMA; inversion or anterior positioning suggests malrotation; whirlpool sign indicates volvulus",
      "Complete blood count (CBC): leukocytosis suggests bowel ischemia or perforation; thrombocytopenia may indicate disseminated intravascular coagulation (DIC) from intestinal necrosis",
      "Serum lactate: elevated lactate indicates tissue hypoperfusion and bowel ischemia; rising lactate levels are an ominous sign of progressive intestinal necrosis",
      "Electrolytes and blood gas: metabolic acidosis suggests bowel ischemia; hyponatremia and hypokalemia from vomiting and third-spacing of fluids"
    ],
    management: [
      "Recognize bilious (green) vomiting in a neonate as a SURGICAL EMERGENCY requiring immediate physician notification -- do not delay for additional assessment; this presentation is malrotation with volvulus until proven otherwise",
      "Establish and maintain NPO status immediately upon suspicion of intestinal obstruction; do not offer any oral feeds or breast/bottle feeding",
      "Insert nasogastric tube (NGT) as ordered for gastric decompression; connect to low intermittent suction; document amount, color, and character of drainage (bilious aspirate supports the diagnosis)",
      "Establish IV access with large-bore catheter and administer isotonic fluid resuscitation (normal saline 20 mL/kg bolus) as ordered to restore intravascular volume; repeat as needed based on hemodynamic response",
      "Prepare for urgent surgical intervention (Ladd procedure): ensure consent obtained from parents/guardians, blood products typed and crossmatched, surgical site marking per protocol",
      "Monitor for signs of intestinal ischemia and necrosis: increasing abdominal distension, abdominal wall erythema or discoloration, bloody stool, metabolic acidosis, and hemodynamic instability",
      "Provide family support and education: explain the emergent nature of the situation, anticipated surgical procedure, expected postoperative course, and allow parents to be with the infant as much as safely possible"
    ],
    nursingActions: [
      "Assess abdomen every 1-2 hours: measure abdominal girth at umbilicus, assess for distension, tenderness, discoloration (dusky or erythematous skin may indicate underlying ischemia), and presence or absence of bowel sounds",
      "Monitor vital signs every 15-30 minutes in acute presentation: tachycardia and hypotension indicate hypovolemia or sepsis; fever suggests peritonitis; bradycardia in a neonate is a late and ominous sign of cardiovascular compromise",
      "Maintain strict intake and output with emphasis on nasogastric output (amount, color, character) and urine output (minimum 1-2 mL/kg/hour in neonates); report decreased urine output immediately",
      "Monitor nasogastric tube patency and position: irrigate with normal saline as ordered to maintain patency; secure tube properly to prevent displacement; document output characteristics each shift",
      "Assess for signs of shock in the neonate: tachycardia, weak peripheral pulses, prolonged capillary refill time (greater than 3 seconds), mottled skin, cool extremities, altered level of consciousness (lethargy or irritability)",
      "Administer IV antibiotics as prescribed preoperatively to cover enteric organisms; ensure doses are weight-based and verify calculation for neonatal dosing",
      "Provide postoperative monitoring including wound assessment, pain management, advancement of feeds as ordered, and parent education on signs of recurrent obstruction that require emergency evaluation"
    ],
    assessmentFindings: [
      "Bilious (green) vomiting in a neonate: the cardinal sign of intestinal obstruction distal to the ampulla of Vater; this presentation demands immediate surgical consultation regardless of other findings",
      "Abdominal distension with visible loops of bowel or distended veins indicating increased intra-abdominal pressure from obstruction",
      "Bloody stools (hematochezia) or currant jelly stool indicating mucosal ischemia from vascular compromise of the mesenteric vessels",
      "Signs of dehydration in the neonate: sunken fontanelle, dry mucous membranes, decreased urine output, poor skin turgor, and weight loss exceeding 10% of birth weight",
      "Progressive lethargy, poor feeding, and irritability in the neonate indicating systemic illness from bowel ischemia, peritonitis, or sepsis",
      "Abdominal wall erythema or discoloration (bruised appearance) suggesting underlying bowel necrosis or perforation with peritonitis",
      "Hemodynamic instability: tachycardia, hypotension, weak pulses, prolonged capillary refill, and mottled skin indicating hypovolemic or septic shock"
    ],
    signs: {
      left: [
        "Intermittent, nonbilious vomiting after feeds",
        "Mild abdominal distension with soft abdomen",
        "Fussiness or irritability with feeding",
        "Slightly decreased oral intake or feeding intolerance",
        "Mild dehydration (slightly dry mucous membranes)",
        "Normal vital signs with intermittent symptoms"
      ],
      right: [
        "Bilious (green) vomiting -- surgical emergency in a neonate",
        "Rigid, distended abdomen with absent bowel sounds",
        "Bloody or currant jelly stool indicating bowel ischemia",
        "Signs of shock: tachycardia, hypotension, mottled skin, poor perfusion",
        "Abdominal wall discoloration suggesting bowel necrosis or perforation",
        "Metabolic acidosis with rising serum lactate indicating tissue ischemia"
      ]
    },
    medications: [
      {
        name: "0.9% Sodium Chloride (Normal Saline) IV bolus",
        type: "Isotonic crystalloid / Volume resuscitation fluid",
        action: "Provides isotonic fluid expansion of the intravascular compartment to restore circulating blood volume in the dehydrated or hemodynamically unstable neonate; sodium and chloride concentrations approximate physiological plasma levels, preventing osmotic shifts between fluid compartments",
        sideEffects: "Hyperchloremic metabolic acidosis with large-volume resuscitation (high chloride content 154 mEq/L); fluid overload and pulmonary edema if administered too rapidly or in excessive volume; peripheral edema; dilutional coagulopathy with massive resuscitation",
        contra: "Known fluid overload states (decompensated heart failure, pulmonary edema); hypernatremia; use with caution in premature neonates (rapid volume shifts can increase risk of intraventricular hemorrhage)",
        pearl: "Standard resuscitation bolus in neonates is 10-20 mL/kg given over 10-20 minutes; reassess hemodynamic status (heart rate, blood pressure, capillary refill, urine output) after each bolus before repeating; warm fluids to body temperature before administration to prevent hypothermia in neonates"
      },
      {
        name: "Metoclopramide (Reglan/Maxeran)",
        type: "Prokinetic / Antiemetic (dopamine D2 antagonist)",
        action: "Enhances upper gastrointestinal motility by increasing acetylcholine release from myenteric neurons and blocks dopamine D2 receptors in the chemoreceptor trigger zone to reduce nausea and vomiting; accelerates gastric emptying and small bowel transit",
        sideEffects: "Extrapyramidal symptoms (dystonia, akathisia, oculogyric crisis -- especially in children and young adults), drowsiness, restlessness, diarrhea; tardive dyskinesia with prolonged use (may be irreversible); neuroleptic malignant syndrome (rare)",
        contra: "Mechanical bowel obstruction or perforation (MUST be ruled out before administration -- contraindicated in the acute malrotation/volvulus setting); pheochromocytoma; seizure disorder; concurrent use with other dopamine antagonists; GI hemorrhage",
        pearl: "NOT indicated in acute malrotation or volvulus because mechanical obstruction is a contraindication -- prokinetics cannot overcome a physical blockage and may worsen perforation risk; may be used postoperatively AFTER surgical correction to promote gastric motility during feed advancement; use for shortest duration possible due to tardive dyskinesia risk"
      },
      {
        name: "Ampicillin IV",
        type: "Aminopenicillin / Broad-spectrum antibiotic",
        action: "Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins (PBPs) in the bacterial cell wall, preventing cross-linking of peptidoglycan polymers, leading to osmotic instability and cell lysis; active against many gram-positive organisms (Streptococcus, Enterococcus) and some gram-negative organisms (E. coli, Proteus mirabilis, Haemophilus influenzae)",
        sideEffects: "Allergic reactions (rash, urticaria, anaphylaxis in penicillin-allergic patients), diarrhea (disruption of normal gut flora), superinfection (Clostridioides difficile colitis), interstitial nephritis (rare), maculopapular rash (especially with concurrent Epstein-Barr virus infection)",
        contra: "Known penicillin allergy (cross-reactivity with other beta-lactams possible); history of ampicillin-associated cholestatic jaundice or hepatic dysfunction; infectious mononucleosis (high incidence of maculopapular rash)",
        pearl: "Commonly used in neonates as part of empiric broad-spectrum coverage (ampicillin + gentamicin) for suspected peritonitis or sepsis secondary to bowel ischemia or perforation; neonatal dosing is weight-based and interval depends on gestational and postnatal age; monitor renal function when combined with aminoglycosides; verify allergy status before first dose"
      }
    ],
    pearls: [
      "Bilious (GREEN) vomiting in a neonate is a SURGICAL EMERGENCY until proven otherwise -- the most critical diagnosis to exclude is malrotation with midgut volvulus because delayed intervention leads to extensive bowel necrosis and short bowel syndrome or death",
      "The upper GI series (with oral contrast) is the gold standard for diagnosing malrotation; it confirms the position of the duodenojejunal junction (ligament of Treitz), which should be to the LEFT of the spine at the level of the pylorus",
      "Ladd bands are fibrous peritoneal bands that extend from the malpositioned cecum across the duodenum, causing extrinsic compression and obstruction; they are divided during the Ladd procedure",
      "The narrow mesenteric pedicle in malrotation is the reason the entire midgut can twist (volvulus): normally, the broad mesenteric attachment from ligament of Treitz to ileocecal valve prevents torsion",
      "Time is bowel: midgut volvulus can progress from ischemia to full-thickness necrosis within hours -- every minute of delay from recognition to surgical detorsion increases the risk of massive bowel loss",
      "Appendectomy is performed during the Ladd procedure because the appendix will be in an abnormal anatomical position (typically left-sided), which would complicate diagnosis of appendicitis in the future",
      "Postoperatively, monitor for recurrent obstruction (vomiting, abdominal distension, feeding intolerance) and educate parents to seek emergency care immediately if bilious vomiting recurs -- recurrence rate of volvulus after Ladd procedure is approximately 2-8%"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a 5-day-old neonate who suddenly begins vomiting bright green (bilious) emesis. What is the priority nursing action?",
        options: [
          "Offer a smaller volume of formula and observe for improvement",
          "Position the infant on the right side and document the emesis",
          "Immediately make the infant NPO and notify the physician as this is a potential surgical emergency",
          "Administer an antiemetic as prescribed and reassess in 30 minutes"
        ],
        correct: 2,
        rationale: "Bilious vomiting in a neonate is a surgical emergency until proven otherwise, with malrotation and midgut volvulus being the most critical diagnosis to exclude. The infant must be made NPO immediately, and the physician must be notified urgently for surgical consultation and diagnostic imaging. Delaying intervention can result in bowel necrosis."
      },
      {
        question: "Which diagnostic study is considered the gold standard for confirming intestinal malrotation?",
        options: [
          "Abdominal ultrasound with Doppler",
          "Abdominal X-ray (KUB series)",
          "Upper gastrointestinal series with oral contrast",
          "CT scan of the abdomen with IV contrast"
        ],
        correct: 2,
        rationale: "The upper GI series with oral contrast is the gold standard for diagnosing malrotation. It identifies the position of the duodenojejunal junction (ligament of Treitz), which normally should be to the left of the spine at the level of the pylorus. Abnormal positioning confirms malrotation. Ultrasound can support the diagnosis but is not definitive."
      },
      {
        question: "A neonate with suspected midgut volvulus is being prepared for emergency surgery. Which nursing intervention is essential during the preoperative period?",
        options: [
          "Continue breastfeeding to maintain the infant's glucose levels",
          "Insert a nasogastric tube for decompression, establish IV access, and administer fluid resuscitation as ordered",
          "Administer a prokinetic medication to improve intestinal motility",
          "Delay IV access until the infant is in the operating room"
        ],
        correct: 1,
        rationale: "Preoperative management of suspected volvulus includes making the infant NPO, inserting a nasogastric tube for gastric decompression, establishing IV access for fluid resuscitation (normal saline bolus 10-20 mL/kg), and administering broad-spectrum antibiotics as ordered. Prokinetic agents are contraindicated in mechanical bowel obstruction. IV access must be established before transfer to the OR."
      }
    ]
  }
};

let injected = 0;
let skipped = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) injected++;
  else skipped++;
}
console.log(`\nDone: ${injected} injected, ${skipped} skipped`);
