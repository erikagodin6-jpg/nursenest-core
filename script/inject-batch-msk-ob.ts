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
  "osteomyelitis-basics-rpn": {
    title: "Osteomyelitis for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Bone Infection",
      content: "Osteomyelitis is an infection of the bone that can involve the cortex, medullary canal, and periosteum. The most common causative organism is Staphylococcus aureus, which accounts for approximately 70-80% of all cases. The infection reaches bone through three primary routes: hematogenous spread (bloodstream seeding from a distant infection site, most common in children and older adults), contiguous spread (direct extension from an adjacent soft tissue infection such as a diabetic foot ulcer or surgical wound), and direct inoculation (penetrating trauma, open fracture, or surgical contamination). Once bacteria reach the bone, they adhere to the bone matrix using surface adhesion molecules and produce biofilm, a protective polysaccharide layer that shields the organisms from both the immune system and antibiotics. The inflammatory response triggers vascular congestion, thrombosis of local blood vessels, and subsequent ischemia of the surrounding bone tissue. As the infection progresses, pus accumulates within the rigid bony structure, increasing intramedullary pressure and further compromising blood flow. Devitalized bone separates from living tissue and forms a sequestrum -- a segment of dead, infected bone that acts as a persistent reservoir for bacteria. The periosteum responds by laying down new bone around the infected area, forming an involucrum (a sleeve of reactive new bone surrounding the sequestrum). The formation of a sequestrum is clinically significant because antibiotics cannot penetrate dead bone, making surgical debridement necessary in chronic osteomyelitis. Acute osteomyelitis develops over days to weeks and is characterized by local pain, warmth, swelling, and systemic signs of infection including fever and elevated inflammatory markers. If not adequately treated, acute osteomyelitis can progress to chronic osteomyelitis, which is defined as infection persisting for more than six weeks or the presence of sequestrum on imaging. Chronic osteomyelitis may feature draining sinus tracts that connect the bone to the skin surface, intermittent flares of infection, and progressive bone destruction. In children, hematogenous osteomyelitis typically affects the metaphysis of long bones (the highly vascular growth plate region) because the sluggish blood flow in metaphyseal sinusoidal veins allows bacterial seeding. In adults, the vertebral bodies are the most common site for hematogenous osteomyelitis, while the feet are the most common site for contiguous osteomyelitis, particularly in patients with diabetes mellitus and peripheral neuropathy."
    },
    riskFactors: [
      "Diabetes mellitus with peripheral neuropathy and vascular disease (most significant risk factor for contiguous osteomyelitis from foot ulcers)",
      "Peripheral vascular disease (compromised blood flow impairs immune response and antibiotic delivery to bone)",
      "Intravenous drug use (bacteremia from non-sterile injection introduces organisms that seed bone hematogenously)",
      "Recent orthopedic surgery or internal fixation hardware (biofilm formation on prosthetic material provides bacterial sanctuary)",
      "Open fractures or penetrating trauma (direct inoculation of skin flora into bone)",
      "Immunocompromised states including HIV, chronic corticosteroid use, and chemotherapy (impaired neutrophil and macrophage function)",
      "Sickle cell disease (Salmonella osteomyelitis is uniquely associated; functional asplenia and vaso-occlusion create favorable environment)"
    ],
    diagnostics: [
      "CBC with differential: leukocytosis with left shift (increased bands/immature neutrophils) supports active infection; WBC may be normal in chronic osteomyelitis",
      "Erythrocyte sedimentation rate (ESR): elevated in osteomyelitis (often greater than 70 mm/hr); useful for monitoring treatment response over weeks",
      "C-reactive protein (CRP): rises rapidly with acute infection and normalizes faster than ESR; serial CRP is the best laboratory marker for monitoring antibiotic response",
      "Blood cultures: obtain two sets from separate sites BEFORE starting antibiotics; positive in 50-60% of hematogenous osteomyelitis cases and may identify the organism without bone biopsy",
      "MRI with gadolinium: gold standard imaging study for osteomyelitis; sensitivity 90-100%; shows bone marrow edema, abscess formation, and soft tissue involvement",
      "Bone biopsy with culture and sensitivity: definitive diagnostic procedure; identifies the specific organism and guides targeted antibiotic therapy; essential when blood cultures are negative"
    ],
    management: [
      "Administer IV antibiotics as ordered for 4-6 weeks minimum; empiric therapy typically includes nafcillin or oxacillin for MSSA; vancomycin for suspected MRSA; adjust based on culture results",
      "Maintain strict IV access site care and monitor for signs of line infection (redness, swelling, drainage at insertion site) since prolonged IV therapy is required",
      "Implement wound care for open wounds or draining sinus tracts using sterile technique; document wound size, depth, drainage characteristics, and odor",
      "Elevate the affected extremity to reduce edema and promote venous return; position for comfort while maintaining proper alignment",
      "Maintain non-weight-bearing or partial weight-bearing status as ordered to prevent pathologic fracture of weakened bone",
      "Monitor surgical drain output if postoperative (debridement); report output exceeding 100 mL per shift or changes in drainage color",
      "Coordinate PICC line care and home IV antibiotic therapy education for patients transitioning to outpatient parenteral antibiotic therapy (OPAT)"
    ],
    nursingActions: [
      "Assess the affected area every shift for the five cardinal signs of infection: redness (rubor), warmth (calor), swelling (tumor), pain (dolor), and loss of function (functio laesa)",
      "Monitor temperature every 4 hours; report fever above 38.3 degrees Celsius (101 degrees Fahrenheit) or new-onset chills and rigors to the physician immediately",
      "Perform neurovascular checks (5 Ps: Pain, Pulse, Pallor, Paresthesia, Paralysis) on the affected limb every 4 hours to detect compartment syndrome or vascular compromise",
      "Administer analgesics as ordered and reassess pain 30 minutes after IV medication and 60 minutes after oral medication using a validated pain scale",
      "Maintain strict intake and output records; monitor renal function (BUN, creatinine) at least weekly during prolonged antibiotic therapy as nephrotoxicity is a risk with vancomycin and aminoglycosides",
      "Draw vancomycin trough levels as ordered (target 15-20 mcg/mL for osteomyelitis); hold the dose and notify the physician if the trough is above 20 mcg/mL",
      "Report any new drainage from the wound, development of sinus tracts, or worsening pain despite adequate analgesia as these may indicate treatment failure or abscess formation"
    ],
    assessmentFindings: [
      "Localized bone pain that is deep, constant, and worsens with weight-bearing or movement of the affected area; pain may be disproportionate to visible findings",
      "Warmth, erythema, and edema over the affected bone; may extend to surrounding soft tissue in severe cases",
      "Fever (may be intermittent in chronic osteomyelitis), chills, malaise, and night sweats indicating systemic infection",
      "Draining sinus tract with purulent or serosanguineous drainage in chronic osteomyelitis; probe-to-bone test positive (sterile probe inserted into wound reaches bone)",
      "Limited range of motion and muscle guarding over the affected area; child may refuse to bear weight or use the affected limb (pseudoparalysis)",
      "Elevated inflammatory markers: WBC above 11,000, ESR above 70 mm/hr, CRP above 10 mg/L; serial decreases indicate treatment response",
      "Adjacent joint effusion may develop if infection is near a joint; distinguish from septic arthritis which requires emergent joint aspiration"
    ],
    signs: {
      left: [
        "Localized bone tenderness on palpation",
        "Low-grade fever (below 38.3 degrees Celsius)",
        "Mild edema over the affected area",
        "Fatigue and general malaise",
        "Slightly elevated ESR or CRP",
        "Reduced range of motion in adjacent joint"
      ],
      right: [
        "High fever with rigors (above 39 degrees Celsius) suggesting bacteremia",
        "Purulent drainage from sinus tract or wound site",
        "Sepsis signs: tachycardia, hypotension, altered mental status",
        "Acute compartment syndrome (severe pain, tense swelling, paresthesias)",
        "Pathologic fracture through weakened infected bone",
        "Rapidly spreading cellulitis with crepitus (gas gangrene risk)"
      ]
    },
    medications: [
      {
        name: "Nafcillin",
        type: "Penicillinase-resistant penicillin (antistaphylococcal)",
        action: "Binds to penicillin-binding proteins (PBPs) in the bacterial cell wall, inhibiting transpeptidase-mediated cross-linking of peptidoglycan chains. This disrupts cell wall synthesis and causes osmotic lysis. Nafcillin is resistant to staphylococcal beta-lactamase (penicillinase), making it effective against methicillin-sensitive Staphylococcus aureus (MSSA), the most common osteomyelitis pathogen.",
        sideEffects: "Phlebitis at IV infusion site (very common -- rotate peripheral IV sites every 72 hours or use PICC/midline), interstitial nephritis (monitor BUN/creatinine weekly), hepatotoxicity (monitor liver enzymes), neutropenia with prolonged therapy (check CBC weekly), rash",
        contra: "Known penicillin allergy (assess for anaphylaxis history vs. non-severe rash); not effective against MRSA; use vancomycin if MRSA suspected or confirmed",
        pearl: "Nafcillin is the drug of choice for MSSA osteomyelitis; administer over 30-60 minutes IV to reduce phlebitis risk; does NOT require renal dose adjustment as it is primarily hepatically cleared; total treatment duration is typically 4-6 weeks IV"
      },
      {
        name: "Vancomycin",
        type: "Glycopeptide antibiotic",
        action: "Inhibits bacterial cell wall synthesis by binding to the D-alanyl-D-alanine terminal of peptidoglycan precursors, preventing incorporation into the growing cell wall. This mechanism is different from beta-lactams and provides activity against methicillin-resistant Staphylococcus aureus (MRSA) and other gram-positive organisms resistant to beta-lactam antibiotics.",
        sideEffects: "Nephrotoxicity (monitor serum creatinine and vancomycin trough levels), ototoxicity (hearing loss, tinnitus -- risk increases with concurrent aminoglycosides), Red Man Syndrome (histamine-mediated flushing and hypotension from rapid infusion -- NOT a true allergy), thrombocytopenia with prolonged use",
        contra: "Previous serious hypersensitivity reaction to vancomycin; use with extreme caution in renal impairment (dose adjustment required based on creatinine clearance and trough levels)",
        pearl: "Infuse over at least 60 minutes (or 10 mg/minute) to prevent Red Man Syndrome; target trough level 15-20 mcg/mL for osteomyelitis (higher than for skin infections); draw trough 30 minutes BEFORE the fourth dose; if Red Man Syndrome occurs, stop infusion, administer diphenhydramine, and restart at a slower rate"
      },
      {
        name: "Rifampin (Rifampicin)",
        type: "RNA synthesis inhibitor / antimycobacterial",
        action: "Inhibits DNA-dependent RNA polymerase in bacteria, blocking RNA transcription and subsequent protein synthesis. Rifampin has excellent biofilm penetration, making it uniquely valuable in osteomyelitis involving prosthetic hardware or implants where bacteria form biofilm colonies that other antibiotics cannot reach. Rifampin also achieves high intracellular concentrations, killing bacteria sequestered within macrophages.",
        sideEffects: "Hepatotoxicity (monitor liver function tests every 2-4 weeks), orange-red discoloration of body fluids (urine, tears, sweat, saliva -- warn patients that contact lenses may be permanently stained), GI upset (nausea, vomiting, diarrhea), drug interactions via CYP450 enzyme induction (reduces levels of warfarin, oral contraceptives, and many other medications)",
        contra: "Active hepatic disease or jaundice; concurrent use with protease inhibitors (HIV medications); NEVER use as monotherapy (resistance develops within days -- always combine with another antistaphylococcal agent)",
        pearl: "Rifampin must NEVER be used alone due to rapid resistance development; always pair with a primary agent (vancomycin, nafcillin, or fluoroquinolone); warn patients about orange discoloration of urine and tears; advise women on hormonal contraceptives to use an additional backup method"
      }
    ],
    pearls: [
      "Staphylococcus aureus is responsible for 70-80% of osteomyelitis cases -- always suspect it first and ensure antibiotic coverage includes antistaphylococcal activity",
      "The sequestrum (dead infected bone) acts as a foreign body that antibiotics cannot penetrate -- surgical debridement is essential when a sequestrum is present on imaging",
      "Blood cultures must be obtained BEFORE starting antibiotics because a positive blood culture can identify the organism and may eliminate the need for an invasive bone biopsy",
      "Vancomycin trough levels for osteomyelitis are targeted at 15-20 mcg/mL, which is higher than the 10-15 mcg/mL target used for less severe infections",
      "In children, hematogenous osteomyelitis favors the metaphysis of long bones (femur, tibia, humerus) because the sluggish blood flow in metaphyseal sinusoidal veins allows bacterial lodging",
      "A positive probe-to-bone test in a diabetic foot ulcer (sterile probe inserted into wound contacts bone) has a positive predictive value of approximately 89% for osteomyelitis",
      "Rifampin is the only antibiotic with reliable biofilm penetration, making it essential for osteomyelitis involving prosthetic hardware -- but it must NEVER be used alone due to rapid resistance"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient receiving IV vancomycin for osteomyelitis. The patient develops facial flushing, pruritus, and an erythematous rash on the upper body during the infusion. What is the priority nursing action?",
        options: [
          "Document the reaction and administer the next dose",
          "Stop the infusion, notify the physician, and administer diphenhydramine as ordered",
          "Increase the infusion rate to complete the dose faster",
          "Apply cold compresses and continue the infusion at the same rate"
        ],
        correct: 1,
        rationale: "These symptoms are consistent with Red Man Syndrome, a histamine-mediated reaction caused by rapid vancomycin infusion. The infusion must be stopped immediately. Diphenhydramine is administered to counteract the histamine release. This is NOT a true allergy -- the medication can usually be restarted at a slower infusion rate after symptoms resolve."
      },
      {
        question: "A patient with chronic osteomyelitis has a draining sinus tract on the lower leg. Which assessment finding should the practical nurse report to the physician immediately?",
        options: [
          "Small amount of serosanguineous drainage from the sinus tract",
          "Patient reports a dull ache rated 3/10 at the affected site",
          "New-onset crepitus and rapidly spreading erythema around the wound",
          "Slightly elevated ESR on the most recent laboratory results"
        ],
        correct: 2,
        rationale: "New-onset crepitus (crackling sensation in tissue) with rapidly spreading erythema suggests gas gangrene or necrotizing fasciitis, which are life-threatening surgical emergencies requiring immediate intervention. Serosanguineous drainage from a chronic sinus tract, mild pain, and slightly elevated ESR are expected findings in chronic osteomyelitis."
      },
      {
        question: "The practical nurse is reinforcing discharge teaching for a patient going home on IV antibiotics through a PICC line for osteomyelitis. Which statement by the patient indicates correct understanding?",
        options: [
          "I can stop the antibiotics once my pain goes away and I feel better",
          "I should complete the full 4 to 6 weeks of antibiotics even if I feel well",
          "I only need to take the antibiotics for 7 to 10 days like a regular infection",
          "I can switch to oral antibiotics on my own if the IV becomes uncomfortable"
        ],
        correct: 1,
        rationale: "Osteomyelitis requires prolonged antibiotic therapy, typically 4-6 weeks of IV antibiotics, because bone tissue has relatively poor blood supply and antibiotics penetrate bone slowly. Stopping antibiotics early based on symptom improvement leads to treatment failure, relapse, and development of chronic osteomyelitis. The transition from IV to oral therapy must be directed by the physician."
      }
    ]
  },

  "ovarian-hyperstimulation-rpn": {
    title: "Ovarian Hyperstimulation Syndrome for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Ovarian Hyperstimulation Syndrome",
      content: "Ovarian hyperstimulation syndrome (OHSS) is a potentially life-threatening iatrogenic complication of controlled ovarian stimulation used in assisted reproductive technologies such as in vitro fertilization (IVF). The condition occurs when the ovaries respond excessively to gonadotropin hormones (follicle-stimulating hormone and human chorionic gonadotropin), leading to the development of multiple enlarged follicles and markedly elevated estradiol levels. The pathophysiology centers on massive vascular endothelial growth factor (VEGF) release from the hyperstimulated ovarian tissue. VEGF dramatically increases capillary permeability throughout the body, causing a systemic capillary leak syndrome. This increased vascular permeability causes protein-rich fluid to shift from the intravascular space into the interstitial and third spaces (peritoneal cavity, pleural space, and pericardial space). The resulting third-spacing of fluid leads to two simultaneous and paradoxical problems: intravascular volume depletion (hemoconcentration, hypotension, tachycardia, oliguria) and extravascular fluid accumulation (ascites, pleural effusions, peripheral edema). The ovaries become massively enlarged, sometimes reaching 10-12 centimeters in diameter (normal ovary is approximately 3 centimeters), and are at high risk for torsion (twisting on the ovarian pedicle, which compromises blood supply) and rupture. Hemoconcentration from intravascular fluid loss increases blood viscosity, creating a hypercoagulable state that significantly increases the risk of venous thromboembolism (deep vein thrombosis and pulmonary embolism). Electrolyte imbalances develop as fluid and protein shift out of the vascular space, including hyponatremia (dilutional, from third-space fluid), hypoalbuminemia (protein loss into third space), and hyperkalemia (from hemoconcentration and renal hypoperfusion). OHSS is classified by severity: mild (abdominal bloating, mild pain, ovarian enlargement 5-8 cm), moderate (nausea, vomiting, ultrasonographic evidence of ascites, ovarian enlargement 8-12 cm), and severe (clinical ascites, hydrothorax, hemoconcentration with hematocrit above 45%, oliguria below 500 mL per 24 hours, creatinine above 1.6 mg/dL, or thromboembolic events). Critical OHSS includes renal failure, acute respiratory distress syndrome (ARDS), and thromboembolic events. The condition is typically self-limiting and resolves within 7-10 days if pregnancy does not occur, but may persist or worsen for several weeks if pregnancy is established because rising hCG levels perpetuate the ovarian stimulation."
    },
    riskFactors: [
      "Young age (under 35 years) with high ovarian reserve and robust follicular response to gonadotropins",
      "Low body weight or low BMI (higher circulating gonadotropin concentration per kilogram leads to exaggerated ovarian response)",
      "Polycystic ovary syndrome (PCOS) -- the single greatest risk factor due to high antral follicle count and exaggerated sensitivity to gonadotropins",
      "Previous episode of OHSS (recurrence rate is approximately 50% in subsequent stimulation cycles without preventive measures)",
      "High serum estradiol levels during stimulation (above 3,500 pg/mL) indicating excessive follicular development",
      "Large number of developing follicles on ultrasound (more than 20 follicles of any size, or more than 14 follicles above 11 mm)",
      "Use of hCG trigger for final oocyte maturation rather than GnRH agonist trigger (hCG has a longer half-life and sustains luteal ovarian stimulation)"
    ],
    diagnostics: [
      "Serial serum estradiol levels: rising levels above 3,500 pg/mL during stimulation indicate high risk; used to guide dose adjustments or cycle cancellation",
      "Transvaginal ultrasound: monitors follicle number and size during stimulation; detects ovarian enlargement and free fluid (ascites) in the pelvis",
      "Complete blood count: hematocrit above 45% indicates hemoconcentration from intravascular fluid depletion; WBC may be elevated (leukocytosis from stress response)",
      "Basic metabolic panel: monitor sodium (hyponatremia from dilution), potassium (hyperkalemia from hemoconcentration), BUN and creatinine (rising values indicate prerenal azotemia from volume depletion)",
      "Serum albumin: decreased (below 3.0 g/dL) due to protein loss into third spaces; guides albumin replacement therapy",
      "Coagulation studies (PT, PTT, D-dimer, fibrinogen): assess for hypercoagulable state and disseminated intravascular coagulation (DIC); D-dimer may be elevated"
    ],
    management: [
      "Maintain strict bed rest with bathroom privileges for moderate to severe cases; avoid vigorous activity, abdominal palpation, and intercourse to prevent ovarian torsion or rupture",
      "Administer IV isotonic crystalloids (normal saline or lactated Ringer) for intravascular volume expansion; avoid overhydration which worsens third-spacing and ascites",
      "Administer IV albumin 25% as ordered for severe hypoalbuminemia (albumin below 2.5 g/dL) to restore oncotic pressure and pull fluid back into the vascular space",
      "Monitor strict intake and output with hourly urine measurements in severe cases; report urine output below 30 mL/hour (indicates inadequate renal perfusion)",
      "Administer prophylactic anticoagulation (enoxaparin subcutaneously) as ordered to prevent thromboembolic events in patients with hemoconcentration",
      "Perform therapeutic paracentesis as ordered for symptomatic ascites causing respiratory compromise or severe abdominal pain; monitor vital signs during and after procedure",
      "Provide antiemetic therapy as ordered for nausea and vomiting; monitor electrolytes daily and replace as needed"
    ],
    nursingActions: [
      "Weigh patient daily at the same time using the same scale; report weight gain exceeding 1 kg (2.2 pounds) per day as this indicates worsening fluid accumulation",
      "Measure abdominal girth daily at the umbilicus using consistent technique; increasing girth suggests worsening ascites",
      "Assess respiratory status every 4 hours: auscultate lung sounds, monitor respiratory rate, SpO2, and report dyspnea or diminished breath sounds at bases (pleural effusion)",
      "Monitor for signs of ovarian torsion: sudden severe unilateral pelvic pain, nausea, vomiting -- report immediately as torsion requires emergent surgical intervention",
      "Assess bilateral lower extremities each shift for signs of deep vein thrombosis: unilateral calf pain, warmth, swelling, positive Homans sign (though unreliable, report if present)",
      "Maintain IV access and administer fluids at prescribed rate; avoid fluid boluses unless specifically ordered as rapid volume expansion can worsen third-spacing",
      "Provide emotional support and education about the self-limiting nature of the condition; anxiety is common and may be compounded by concerns about fertility outcomes"
    ],
    assessmentFindings: [
      "Abdominal distension and bloating with diffuse tenderness; shifting dullness on percussion indicates ascites; ovaries may be palpable (avoid deep palpation to prevent rupture)",
      "Rapid weight gain (1-2 kg per day) from fluid accumulation in the peritoneal cavity and interstitial spaces",
      "Nausea, vomiting, and decreased appetite from abdominal distension and pressure on the stomach",
      "Dyspnea and orthopnea from diaphragmatic elevation by massive ascites or concurrent pleural effusion; decreased breath sounds at lung bases",
      "Oliguria (urine output below 500 mL per 24 hours) despite adequate oral intake, indicating prerenal azotemia from intravascular volume depletion",
      "Tachycardia and orthostatic hypotension reflecting intravascular volume depletion despite total body fluid excess",
      "Laboratory findings: hematocrit above 45%, elevated WBC (15,000-25,000), hyponatremia, elevated creatinine, hypoalbuminemia"
    ],
    signs: {
      left: [
        "Mild abdominal bloating and discomfort",
        "Nausea without vomiting",
        "Weight gain of 0.5-1 kg per day",
        "Mild ovarian enlargement (5-8 cm on ultrasound)",
        "Fatigue and decreased appetite",
        "Mildly elevated estradiol levels"
      ],
      right: [
        "Tense ascites with respiratory compromise (dyspnea at rest)",
        "Hematocrit above 55% (severe hemoconcentration and thrombosis risk)",
        "Oliguria or anuria (renal failure from severe volume depletion)",
        "Sudden severe unilateral pelvic pain (ovarian torsion -- surgical emergency)",
        "Signs of pulmonary embolism: acute chest pain, tachypnea, hemoptysis",
        "Hypotension with tachycardia (hemodynamic instability from critical volume depletion)"
      ]
    },
    medications: [
      {
        name: "Albumin 25% (Human Albumin Solution)",
        type: "Plasma volume expander / colloid solution",
        action: "Provides exogenous albumin protein that increases intravascular colloid osmotic (oncotic) pressure, drawing fluid from the interstitial and third spaces back into the vascular compartment. Each gram of albumin holds approximately 18 mL of fluid within the vascular space. In OHSS, albumin counteracts the capillary leak caused by VEGF, restoring effective circulating volume and improving renal perfusion.",
        sideEffects: "Fluid overload and pulmonary edema (if administered too rapidly or in excessive amounts), allergic reactions (fever, chills, urticaria), hypertension from rapid volume expansion, nausea",
        contra: "Severe anemia (albumin does not carry oxygen), decompensated heart failure (risk of volume overload), known allergy to human albumin products",
        pearl: "Administer slowly over 2-4 hours as ordered; monitor vital signs every 15 minutes during infusion; watch for signs of fluid overload (crackles in lungs, JVD, rising blood pressure); albumin is typically reserved for severe OHSS with albumin below 2.5 g/dL"
      },
      {
        name: "Cabergoline (Dostinex)",
        type: "Dopamine D2 receptor agonist",
        action: "Activates dopamine D2 receptors on ovarian endothelial cells, which inhibits VEGF receptor-2 phosphorylation and downstream signaling. By reducing VEGF-mediated capillary permeability, cabergoline decreases the vascular leak that drives fluid third-spacing in OHSS. This mechanism directly targets the core pathophysiology of OHSS rather than treating symptoms. Cabergoline is used prophylactically starting on the day of oocyte retrieval in high-risk patients.",
        sideEffects: "Nausea, dizziness, headache, orthostatic hypotension (from dopaminergic vasodilation), fatigue, nasal congestion",
        contra: "Uncontrolled hypertension, known hypersensitivity to ergot derivatives, history of cardiac valvulopathy (long-term high-dose use is associated with valvular fibrosis, though short-course OHSS prophylaxis does not carry this risk)",
        pearl: "Typically given as 0.5 mg orally daily for 8 days starting on the day of oocyte retrieval or hCG trigger; advise patients to change positions slowly due to orthostatic hypotension risk; most effective when started early as prevention rather than treatment of established OHSS"
      },
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low-molecular-weight heparin (LMWH) anticoagulant",
        action: "Binds to and potentiates antithrombin III, which preferentially inhibits activated Factor Xa in the coagulation cascade. By inhibiting Factor Xa, enoxaparin reduces thrombin generation and prevents clot formation. In OHSS, the hypercoagulable state from hemoconcentration, immobility, and elevated estrogen creates significant thromboembolism risk, making prophylactic anticoagulation essential in moderate to severe cases.",
        sideEffects: "Bleeding (monitor for bruising, hematuria, blood in stool, gingival bleeding), injection site bruising and hematoma, thrombocytopenia (HIT -- check platelet count at baseline and periodically), elevated liver enzymes",
        contra: "Active major bleeding, history of heparin-induced thrombocytopenia (HIT), severe thrombocytopenia (platelets below 50,000), epidural catheter in place (risk of spinal hematoma)",
        pearl: "Inject subcutaneously into the abdominal fatty tissue (alternate sides); do NOT rub the injection site after administration as this increases bruising; hold pressure for 1-2 minutes; prophylactic dose is typically 40 mg subcutaneously daily; continue until patient is ambulatory and hemoconcentration has resolved"
      }
    ],
    pearls: [
      "OHSS is a PARADOX: the patient has too much total body fluid (ascites, edema) but too little intravascular volume (hemoconcentration, tachycardia, oliguria) -- treatment focuses on expanding vascular volume, not restricting fluids",
      "Daily weights are the single most reliable indicator of OHSS progression or resolution -- weight gain exceeding 1 kg per day indicates worsening fluid accumulation",
      "Polycystic ovary syndrome (PCOS) is the strongest risk factor for OHSS because these patients have many antral follicles that respond excessively to gonadotropin stimulation",
      "Avoid deep abdominal palpation of the enlarged ovaries -- ovaries in OHSS can reach the size of grapefruits and are at high risk for torsion and rupture with manipulation",
      "Hematocrit above 45% in a young woman with OHSS indicates significant hemoconcentration and places her at high risk for venous thromboembolism -- report immediately for anticoagulation consideration",
      "The condition is self-limiting in 7-10 days if no pregnancy occurs, but may persist for weeks if pregnancy is established because rising hCG continues to stimulate the ovaries",
      "Enoxaparin injections should be given in abdominal subcutaneous tissue, rotating sites, and the injection site should NOT be rubbed after administration"
    ],
    quiz: [
      {
        question: "A patient with moderate OHSS has a documented weight gain of 1.5 kg since yesterday. Her hematocrit has risen from 40% to 48%, and urine output over the last 8 hours is 180 mL. Which finding is most concerning and requires immediate physician notification?",
        options: [
          "Weight gain of 1.5 kg in 24 hours",
          "Hematocrit rising from 40% to 48% indicating significant hemoconcentration",
          "Urine output of 180 mL over 8 hours",
          "All of these findings together indicate worsening OHSS and should be reported as a constellation"
        ],
        correct: 3,
        rationale: "All three findings together represent a worsening pattern: rapid weight gain indicates progressive fluid accumulation, rising hematocrit indicates intravascular volume depletion (hemoconcentration), and decreasing urine output (22.5 mL/hour) indicates inadequate renal perfusion. These findings collectively signal progression from moderate to severe OHSS requiring escalation of treatment."
      },
      {
        question: "The practical nurse is caring for a patient with severe OHSS who reports sudden, severe right-sided lower abdominal pain with nausea and vomiting. What complication should the nurse suspect?",
        options: [
          "Worsening ascites from continued fluid third-spacing",
          "Ovarian torsion requiring emergent surgical evaluation",
          "Normal progression of ovarian hyperstimulation syndrome",
          "Urinary tract infection from Foley catheter placement"
        ],
        correct: 1,
        rationale: "Sudden severe unilateral pelvic pain in a patient with enlarged ovaries from OHSS is highly suspicious for ovarian torsion -- twisting of the ovary on its vascular pedicle that compromises blood supply. This is a surgical emergency that requires immediate physician notification and likely emergent laparoscopic detorsion to preserve the ovary."
      },
      {
        question: "A patient with OHSS asks the practical nurse why she is receiving an enoxaparin injection daily. Which response best explains the rationale?",
        options: [
          "The injection helps reduce the size of your enlarged ovaries",
          "Your blood has become more concentrated, which increases the risk of blood clots, so this medication helps prevent that",
          "The medication helps remove the excess fluid from your abdomen",
          "This injection is a routine fertility treatment given to all IVF patients"
        ],
        correct: 1,
        rationale: "In OHSS, fluid shifts out of the blood vessels into the abdominal cavity, causing the remaining blood to become concentrated (hemoconcentration). This thicker, more concentrated blood is prone to clotting. Enoxaparin is a blood thinner given to prevent deep vein thrombosis and pulmonary embolism, which are serious complications of the hypercoagulable state in OHSS."
      }
    ]
  },

  "overhydration-rpn": {
    title: "Overhydration and Fluid Volume Excess for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Fluid Volume Excess",
      content: "Fluid volume excess (FVE), also called hypervolemia or overhydration, occurs when the body retains more fluid than it can excrete, leading to expansion of the extracellular fluid compartment. The regulation of fluid balance depends on three interconnected mechanisms: the renin-angiotensin-aldosterone system (RAAS), antidiuretic hormone (ADH) from the posterior pituitary, and atrial natriuretic peptide (ANP) from the cardiac atria. In normal physiology, when blood volume increases, stretch receptors in the atrial walls detect the increased pressure and release ANP, which promotes sodium and water excretion by the kidneys. Simultaneously, the RAAS is suppressed, reducing aldosterone-mediated sodium reabsorption. ADH secretion decreases, reducing water reabsorption in the renal collecting ducts. However, when these regulatory mechanisms fail (as in heart failure, liver cirrhosis, or renal failure) or are overwhelmed (as with excessive IV fluid administration or excessive sodium intake), fluid accumulates in the vascular and interstitial spaces. The excess fluid increases hydrostatic pressure within the capillaries, pushing fluid out of the vascular space and into the interstitial tissues (edema). When hydrostatic pressure exceeds oncotic pressure in the pulmonary capillaries, fluid moves into the alveolar spaces, producing pulmonary edema -- the most dangerous immediate consequence of FVE. Pulmonary edema impairs gas exchange, causing hypoxemia, dyspnea, orthopnea, and if untreated, respiratory failure. Dilutional hyponatremia occurs when the excess retained fluid is hypotonic (more water than sodium), diluting the serum sodium concentration below 135 mEq/L. This is particularly dangerous because hyponatremia can cause cerebral edema, confusion, seizures, and in severe cases (sodium below 120 mEq/L), coma and death. The heart responds to increased preload (volume overload) by increasing contractile force initially (Frank-Starling mechanism), but prolonged volume overload leads to cardiac dilation, increased myocardial oxygen demand, and eventual heart failure. Jugular vein distension (JVD) results from elevated central venous pressure as the right heart struggles to manage the excess volume. Peripheral edema develops in dependent areas (feet, ankles, sacrum in supine patients) as excess fluid follows gravity. In severe cases, generalized edema (anasarca) occurs throughout the body. The practical nurse plays a critical role in early detection of FVE through daily weights, intake and output monitoring, and systematic assessment for edema and respiratory compromise."
    },
    riskFactors: [
      "Heart failure (impaired cardiac output activates RAAS and ADH, causing sodium and water retention despite already elevated volume)",
      "Chronic kidney disease or acute kidney injury (impaired glomerular filtration reduces the kidney's ability to excrete excess fluid and sodium)",
      "Liver cirrhosis with portal hypertension (decreased albumin production reduces oncotic pressure; portal hypertension increases splanchnic capillary pressure causing ascites)",
      "Excessive IV fluid administration, especially isotonic saline (iatrogenic cause, particularly in elderly patients or those with impaired renal function)",
      "Excessive dietary sodium intake (sodium holds water in the extracellular space; more than 2,000 mg/day can worsen fluid retention in susceptible individuals)",
      "Corticosteroid therapy (mineralocorticoid effects promote sodium and water retention by the kidneys)",
      "Pregnancy (normal plasma volume expansion of 40-50% combined with decreased albumin concentration predisposes to edema)"
    ],
    diagnostics: [
      "Serum sodium: may be decreased (dilutional hyponatremia below 135 mEq/L) when excess water is retained proportionally more than sodium",
      "Serum osmolality: decreased (below 275 mOsm/kg) in dilutional states, indicating excess free water relative to solutes",
      "BUN and creatinine: may be decreased due to hemodilution, or elevated if the underlying cause is renal failure",
      "BNP (brain natriuretic peptide) or NT-proBNP: elevated levels (BNP above 100 pg/mL) indicate cardiac volume overload and help differentiate cardiac from non-cardiac causes of dyspnea",
      "Chest X-ray: shows pulmonary vascular congestion, interstitial edema (Kerley B lines), pleural effusions, and alveolar edema (butterfly pattern) in pulmonary edema",
      "Serum albumin: decreased albumin (below 3.5 g/dL) reduces oncotic pressure, contributing to fluid shift from vascular to interstitial space (edema)"
    ],
    management: [
      "Restrict fluid intake as ordered (typically 1,000-1,500 mL per 24 hours); distribute allowed fluids across meals and medication times; use small cups and ice chips to help manage thirst",
      "Implement sodium-restricted diet as ordered (typically 2,000 mg or less per day); educate about hidden sodium in processed foods, canned goods, and condiments",
      "Administer diuretics as ordered and monitor output closely; expect significant diuresis within 30-60 minutes of IV furosemide; goal is typically 1-2 kg weight loss per day",
      "Position patient in high Fowler position (60-90 degrees) to reduce preload, decrease pulmonary congestion, and improve respiratory effort",
      "Administer supplemental oxygen as ordered to maintain SpO2 above 92%; anticipate need for higher flow rates if pulmonary edema is present",
      "Apply compression stockings or sequential compression devices as ordered to reduce peripheral edema and promote venous return",
      "Monitor daily weights, intake and output, and serum electrolytes; adjust fluid restriction and diuretic doses based on response"
    ],
    nursingActions: [
      "Weigh the patient daily at the same time, on the same scale, wearing similar clothing; report weight gain of 1 kg (2.2 lbs) or more in 24 hours as this represents approximately 1 liter of fluid retention",
      "Maintain strict intake and output records; include all oral fluids, IV fluids, tube feeding flushes as intake; include urine, wound drainage, emesis, and diarrhea as output",
      "Assess lung sounds every 4 hours and report crackles (rales), especially in the bases -- crackles indicate fluid in the alveoli (pulmonary edema) and may require urgent diuretic administration",
      "Assess for jugular vein distension (JVD) with the head of bed elevated to 45 degrees; JVD indicates elevated central venous pressure and right-sided heart congestion",
      "Perform edema assessment using the pitting edema scale (1+ to 4+) and document location, extent, and any changes from previous assessments; measure extremity circumference for objective trending",
      "Monitor serum potassium levels when loop diuretics are administered; hypokalemia (below 3.5 mEq/L) is the most common electrolyte complication of loop diuretic therapy and can cause fatal cardiac dysrhythmias",
      "Assess skin integrity in edematous areas; edematous tissue is fragile, poorly perfused, and prone to breakdown -- use pressure-relieving surfaces and reposition every 2 hours"
    ],
    assessmentFindings: [
      "Weight gain (1 kg equals approximately 1 liter of fluid retained); rapid weight gain over 1-3 days is the earliest and most reliable indicator of FVE",
      "Peripheral edema: starts in dependent areas (ankles, feet when upright; sacrum and flanks when supine); pitting edema graded 1+ (2 mm depth) to 4+ (8 mm depth, lasting over 30 seconds)",
      "Pulmonary edema signs: dyspnea, orthopnea (needs multiple pillows to breathe), paroxysmal nocturnal dyspnea (wakes from sleep gasping), crackles on auscultation, frothy pink-tinged sputum (severe)",
      "Jugular vein distension (JVD) visible with head of bed at 45 degrees indicates elevated central venous pressure; normally veins flatten above the sternal angle in this position",
      "Bounding pulse with elevated blood pressure from increased circulating volume; S3 heart sound (ventricular gallop) on auscultation indicates volume overload",
      "Dilutional laboratory findings: decreased serum sodium (below 135 mEq/L), decreased hematocrit and hemoglobin, decreased serum osmolality (below 275 mOsm/kg)",
      "Altered mental status (confusion, lethargy, headache) if dilutional hyponatremia develops; seizures may occur if sodium drops below 120 mEq/L"
    ],
    signs: {
      left: [
        "Mild peripheral edema (1+ pitting in ankles or feet)",
        "Weight gain of 0.5-1 kg per day",
        "Mild dyspnea on exertion",
        "Slightly elevated blood pressure",
        "Decreased urine specific gravity (dilute urine)",
        "Increased urinary output initially (body attempting to compensate)"
      ],
      right: [
        "Acute pulmonary edema: severe dyspnea at rest, frothy pink sputum, cyanosis",
        "Severe hyponatremia (sodium below 120 mEq/L) with seizures or coma",
        "Jugular vein distension with bounding pulse and S3 gallop",
        "Anasarca (generalized massive edema) with skin breakdown risk",
        "Respiratory failure requiring emergent intubation",
        "New-onset cardiac dysrhythmias from electrolyte imbalance"
      ]
    },
    medications: [
      {
        name: "Furosemide (Lasix)",
        type: "Loop diuretic",
        action: "Inhibits the sodium-potassium-2 chloride (Na-K-2Cl) cotransporter in the thick ascending limb of the loop of Henle, blocking reabsorption of approximately 25% of filtered sodium. This produces powerful diuresis (large volume of dilute urine) and reduces extracellular fluid volume. Furosemide also causes venodilation within 5 minutes of IV administration, reducing preload before diuresis begins, which provides immediate hemodynamic relief in acute pulmonary edema.",
        sideEffects: "Hypokalemia (most important -- can cause fatal dysrhythmias), hyponatremia, hypomagnesemia, hypocalcemia, dehydration, orthostatic hypotension, ototoxicity (especially with rapid IV push or concurrent aminoglycoside use), hyperuricemia (gout exacerbation), hyperglycemia",
        contra: "Anuria (kidneys must be functional for diuretics to work), severe electrolyte depletion, hepatic coma, known sulfonamide allergy (cross-sensitivity possible)",
        pearl: "IV onset is 5 minutes, peak 30 minutes; oral onset 30-60 minutes, peak 1-2 hours; administer in the morning to avoid nocturia; monitor potassium BEFORE and AFTER each dose; IV push rate should not exceed 4 mg/minute to reduce ototoxicity risk; weigh patient before and after diuresis to assess response"
      },
      {
        name: "Spironolactone (Aldactone)",
        type: "Potassium-sparing diuretic / aldosterone antagonist",
        action: "Competitively blocks aldosterone receptors in the distal convoluted tubule and collecting duct of the nephron, preventing aldosterone-mediated sodium reabsorption and potassium excretion. This produces mild diuresis while preserving potassium. In heart failure, spironolactone also blocks aldosterone's deleterious effects on cardiac remodeling (fibrosis and hypertrophy), providing mortality benefit beyond its diuretic effect.",
        sideEffects: "Hyperkalemia (most dangerous -- can cause fatal cardiac arrest), gynecomastia and breast tenderness in males (antiandrogen effect), menstrual irregularities in females, GI upset (nausea, diarrhea), dizziness, headache",
        contra: "Hyperkalemia (potassium above 5.0 mEq/L), severe renal failure (GFR below 30 mL/min), concurrent use with other potassium-sparing agents or potassium supplements, Addison disease",
        pearl: "Monitor serum potassium closely -- check within 1 week of starting and after any dose change; do NOT combine with potassium supplements unless specifically ordered with close monitoring; often used in combination with furosemide (the furosemide depletes potassium while spironolactone conserves it); onset of action is slow (24-48 hours) making it unsuitable for acute situations"
      },
      {
        name: "Fluid Restriction Protocol",
        type: "Documentation Tools",
        action: "A structured nursing documentation and management tool that tracks and limits total daily fluid intake to a prescribed volume (typically 1,000-1,500 mL per 24 hours). The protocol includes dividing the total allowance across shifts (day shift receives approximately 50-60% of total, evening 25-30%, night 15-20%), documenting all fluid sources (oral intake, IV medications, tube feeding flushes, IV fluid), and communicating the restriction to all caregivers, dietary services, and the patient and family.",
        sideEffects: "Patient discomfort from thirst (provide oral care, ice chips counted as fluid, lip moisturizer), non-compliance if patient and family are not educated about the rationale, risk of medication errors if large-volume IV piggybacks are not accounted for in the fluid restriction total",
        contra: "Should not be implemented without a physician order; inappropriate in patients who are dehydrated or at risk for dehydration; requires modification when patient has fever (increased insensible losses)",
        pearl: "Teach patients to spread fluid allowance throughout the day rather than consuming it all at once; ice chips are counted as half their volume in fluid (100 mL of ice chips equals approximately 50 mL of water); encourage mouth rinsing without swallowing to manage thirst; post fluid restriction signs at the bedside to alert all staff"
      }
    ],
    pearls: [
      "Daily weight is the MOST reliable indicator of fluid balance changes -- a 1 kg weight gain equals approximately 1 liter of retained fluid; weigh at the same time daily with same scale and similar clothing",
      "Lung crackles (rales) that do not clear with coughing indicate pulmonary edema -- this finding requires immediate physician notification and likely urgent diuretic administration",
      "When administering loop diuretics like furosemide, ALWAYS check the potassium level first -- hypokalemia (below 3.5 mEq/L) can cause life-threatening cardiac dysrhythmias including ventricular tachycardia and fibrillation",
      "Jugular vein distension (JVD) is assessed with the patient at 45 degrees -- veins that remain distended above the sternal angle in this position indicate elevated central venous pressure (right-sided heart congestion)",
      "Patients on fluid restriction should have their allowed volume distributed across the day: approximately 50% during day shift, 30% during evening shift, and 20% during night shift",
      "Edematous skin is fragile, poorly oxygenated, and heals slowly -- reposition every 2 hours, use pressure-relieving devices, and handle edematous extremities gently to prevent skin breakdown",
      "Frothy pink-tinged sputum is a hallmark of severe pulmonary edema and represents a medical emergency -- position patient upright, apply high-flow oxygen, and notify the physician immediately"
    ],
    quiz: [
      {
        question: "A practical nurse obtains a patient's morning weight and finds it has increased by 2 kg since yesterday. The patient's ankles are more edematous than the previous assessment. What should the nurse do first?",
        options: [
          "Restrict the patient's breakfast fluids and apply compression stockings",
          "Document the findings and report the weight gain and increased edema to the physician",
          "Administer an extra dose of furosemide from the PRN medication orders",
          "Reassess the weight in 4 hours to see if it was an error"
        ],
        correct: 1,
        rationale: "A 2 kg weight gain in 24 hours represents approximately 2 liters of fluid retention and, combined with worsening edema, indicates significant FVE progression. The practical nurse must document the findings and notify the physician promptly so that the treatment plan (diuretic dose, fluid restriction) can be adjusted. Independently restricting fluids or delaying reassessment is not appropriate."
      },
      {
        question: "A patient with fluid volume excess is receiving IV furosemide. Which laboratory value must the practical nurse check before administering the next dose?",
        options: [
          "Serum calcium level",
          "Serum potassium level",
          "Hemoglobin A1C",
          "Prothrombin time (PT/INR)"
        ],
        correct: 1,
        rationale: "Furosemide (a loop diuretic) causes significant potassium loss in the urine. Hypokalemia (potassium below 3.5 mEq/L) can cause life-threatening cardiac dysrhythmias including ventricular tachycardia and ventricular fibrillation. The potassium level must be checked before each dose, and if low, potassium replacement must be given before or concurrent with the diuretic."
      },
      {
        question: "A patient on a 1,200 mL fluid restriction asks the practical nurse for a glass of water after taking afternoon medications. The intake record shows 950 mL consumed so far today with the evening and night shifts remaining. What is the most appropriate response?",
        options: [
          "Give the patient a full glass of water since they still have 250 mL remaining",
          "Offer a small amount of water (about 60 mL) and explain the need to save the remaining allowance for the evening and night shifts",
          "Tell the patient they cannot have any more fluids today",
          "Ignore the fluid restriction since the patient is thirsty"
        ],
        correct: 1,
        rationale: "With 250 mL remaining for the rest of the day (evening and night shifts), a small amount of water can be provided while preserving fluid for medications and essential intake during later shifts. The fluid allowance should be distributed across the day. Completely denying fluids is inappropriate, and providing a full glass would leave almost nothing for the remaining 12+ hours."
      }
    ]
  },

  "pain-pathways-rpn": {
    title: "Pain Pathways and Nociception for Practical Nurses",
    cellular: {
      title: "Neurophysiology of Pain Processing",
      content: "Pain is a complex sensory and emotional experience that serves as a protective warning system alerting the body to actual or potential tissue damage. The process of converting a noxious stimulus into the conscious experience of pain is called nociception and involves four distinct phases: transduction, transmission, perception, and modulation. Transduction is the first phase and occurs at the peripheral nerve endings (nociceptors) in the skin, muscles, joints, and visceral organs. When tissue damage occurs (from mechanical, thermal, or chemical stimuli), injured cells release inflammatory mediators including prostaglandins, bradykinin, histamine, substance P, and potassium ions. These chemical mediators activate nociceptors by depolarizing the nerve ending, converting the noxious stimulus into an electrical nerve impulse (action potential). Non-steroidal anti-inflammatory drugs (NSAIDs) work at this phase by inhibiting cyclooxygenase enzymes and blocking prostaglandin production. Transmission is the second phase, during which the electrical impulse travels from the peripheral nociceptor along afferent nerve fibers to the spinal cord and then to the brain. Two types of primary afferent fibers carry pain signals: A-delta fibers are thinly myelinated, conduct rapidly (5-30 meters per second), and carry sharp, well-localized first pain (the immediate pricking sensation when you step on a tack); C fibers are unmyelinated, conduct slowly (0.5-2 meters per second), and carry dull, aching, poorly localized second pain (the throbbing ache that follows). These afferent fibers synapse in the dorsal horn of the spinal cord (specifically in the substantia gelatinosa, laminae I and II), where neurotransmitters including substance P and glutamate cross the synapse to activate second-order neurons. These second-order neurons cross to the opposite side of the spinal cord and ascend to the brain via the spinothalamic tract. Perception occurs when the pain signals reach the brain. The thalamus acts as the relay station, directing pain signals to the somatosensory cortex (which localizes pain and determines its intensity), the limbic system (which generates the emotional and affective component of pain -- suffering, fear, anxiety), and the frontal cortex (which provides cognitive interpretation and decision-making about the pain). This is why the same intensity of noxious stimulus can produce vastly different pain experiences in different individuals or in the same individual under different circumstances. Modulation is the fourth phase, in which the body activates descending inhibitory pathways from the brainstem (periaqueductal gray matter) that release endogenous opioids (endorphins, enkephalins, dynorphins), serotonin, and norepinephrine. These descending neurotransmitters inhibit pain signal transmission in the dorsal horn, effectively closing the gate on pain signals. The Gate Control Theory of Pain (Melzack and Wall, 1965) explains why rubbing a painful area provides relief: stimulation of large-diameter A-beta fibers (which carry touch, pressure, and vibration) activates inhibitory interneurons in the dorsal horn that close the gate to pain signals traveling on smaller A-delta and C fibers. This theory provides the scientific basis for many non-pharmacological pain interventions including massage, transcutaneous electrical nerve stimulation (TENS), heat application, and cold therapy. Understanding these four phases allows nurses to understand where different analgesic medications and non-pharmacological interventions act: NSAIDs and local anesthetics work at transduction, regional nerve blocks work at transmission, cognitive-behavioral strategies work at perception, and opioids and antidepressants work at modulation."
    },
    riskFactors: [
      "Chronic pain conditions (fibromyalgia, arthritis, neuropathic pain) that cause central sensitization and wind-up phenomenon (spinal cord neurons become hyperexcitable and amplify pain signals)",
      "Previous inadequately treated pain episodes (pain memory in the nervous system lowers the threshold for future pain perception through neuroplastic changes)",
      "Anxiety, depression, and psychological distress (negative emotions activate the limbic system, amplifying the affective component of pain perception)",
      "Sleep deprivation (reduces descending inhibitory pathway activity, lowering pain threshold and increasing pain sensitivity)",
      "Age extremes: neonates have immature descending inhibitory pathways; older adults may have altered pain processing and atypical presentations",
      "Substance use disorder (opioid tolerance reduces endogenous opioid system effectiveness; opioid-induced hyperalgesia paradoxically increases pain sensitivity)",
      "Cultural and learned beliefs about pain expression (some patients may underreport pain due to cultural stoicism, fear of addiction, or belief that pain is expected)"
    ],
    diagnostics: [
      "Numeric Rating Scale (NRS): patient rates pain from 0 (no pain) to 10 (worst possible pain); valid for adults and children over 8 years; most commonly used in clinical practice",
      "Wong-Baker FACES Pain Rating Scale: uses facial expressions from smiling (no pain) to crying (worst pain); appropriate for children ages 3-7 and adults with communication or cognitive barriers",
      "FLACC Scale (Face, Legs, Activity, Cry, Consolability): behavioral pain assessment tool for infants and preverbal children; each category scored 0-2, total score 0-10",
      "CPOT (Critical-Care Pain Observation Tool): used for intubated or unconscious patients who cannot self-report; assesses facial expression, body movements, muscle tension, and ventilator compliance",
      "PQRST pain assessment: Provocation (what makes it worse/better), Quality (sharp, dull, burning, aching), Region and Radiation (where is it, does it spread), Severity (0-10 scale), Timing (onset, duration, pattern)",
      "Imaging studies as ordered: X-ray for fractures, MRI for soft tissue and nerve compression, CT scan for acute pathology; correlate imaging findings with clinical presentation"
    ],
    management: [
      "Implement the WHO analgesic ladder: Step 1 -- non-opioids (acetaminophen, NSAIDs) for mild pain; Step 2 -- weak opioids plus non-opioids for moderate pain; Step 3 -- strong opioids plus non-opioids for severe pain",
      "Administer analgesics using the around-the-clock (ATC) scheduling approach for persistent pain rather than waiting for pain to become severe before treating",
      "Apply non-pharmacological interventions based on gate control theory: cold therapy (reduces inflammation and slows nerve conduction), heat therapy (relaxes muscles and increases blood flow), massage, TENS, repositioning",
      "Implement multimodal analgesia as ordered: combining medications with different mechanisms (e.g., NSAID at transduction plus opioid at modulation) provides synergistic pain relief with lower doses of each agent",
      "Monitor for opioid side effects using sedation scale; respiratory rate below 8 per minute or sedation score indicating excessive drowsiness requires holding the opioid dose and notifying the physician",
      "Position patient for comfort: elevate injured extremities, support surgical sites with pillows, assist with position changes every 2 hours",
      "Reassess pain using the same validated tool 30 minutes after IV medication, 60 minutes after oral medication, and 30 minutes after non-pharmacological interventions"
    ],
    nursingActions: [
      "Assess pain as the fifth vital sign at every vital sign check; use age-appropriate, validated pain assessment tools; document location, quality, severity, onset, duration, and aggravating and alleviating factors",
      "Believe the patient's self-report of pain -- pain is subjective and the patient is the authority on their own pain experience; do not judge pain based on visible behaviors alone",
      "Administer prescribed analgesics promptly; premedicate before painful procedures (dressing changes, physical therapy, ambulation) to prevent pain rather than chasing pain after it develops",
      "Monitor respiratory rate, depth, and sedation level before AND after opioid administration; hold the dose and notify the physician if respiratory rate is below 12 (or below 8 in palliative care settings as ordered)",
      "Teach patients and families about the pain scale being used, the importance of reporting pain early, and the safety of prescribed medications; address fears about opioid addiction when appropriate (addiction is rare in acute pain settings)",
      "Document pain assessment, interventions performed (pharmacological and non-pharmacological), and reassessment findings to demonstrate the effectiveness of the pain management plan",
      "Report uncontrolled pain (pain not responding to prescribed medications or consistently above the patient's comfort goal) to the physician for analgesic plan adjustment"
    ],
    assessmentFindings: [
      "Physiological responses to acute pain: tachycardia, hypertension, tachypnea, diaphoresis, pupil dilation (sympathetic nervous system activation); note that chronic pain may NOT produce these autonomic responses",
      "Behavioral indicators: guarding (protecting the painful area), grimacing, moaning, restlessness, inability to sleep, decreased appetite, withdrawal from activities",
      "Neuropathic pain descriptors: burning, tingling, electric shock-like, shooting, numbness; suggests nerve damage or dysfunction and may require adjuvant analgesics (gabapentin, pregabalin)",
      "Somatic pain descriptors: sharp, aching, throbbing, well-localized; arises from skin, muscle, bone, or joint structures and typically responds well to NSAIDs and opioids",
      "Visceral pain descriptors: deep, cramping, pressure-like, poorly localized; arises from internal organs; often accompanied by autonomic symptoms (nausea, vomiting, diaphoresis)",
      "Referred pain patterns: myocardial infarction pain may refer to the jaw, left arm, or back; gallbladder pain may refer to the right shoulder; renal colic may refer to the groin",
      "Functional assessment: impact of pain on mobility, sleep, appetite, mood, social interaction, and ability to perform activities of daily living"
    ],
    signs: {
      left: [
        "Pain rated 1-3 on numeric scale (mild)",
        "Patient able to perform activities of daily living with mild discomfort",
        "Vital signs within normal limits",
        "Patient able to sleep with minor interruptions",
        "Responding to non-pharmacological interventions",
        "Mild guarding or splinting with movement"
      ],
      right: [
        "Pain rated 8-10 on numeric scale unresponsive to prescribed analgesics",
        "Respiratory depression (rate below 8 per minute) after opioid administration",
        "Signs of opioid toxicity: pinpoint pupils, extreme sedation, respiratory depression",
        "Sudden onset of severe pain with new neurological deficits (possible spinal cord compression)",
        "Chest pain with diaphoresis and radiation (possible myocardial infarction)",
        "Compartment syndrome: severe pain disproportionate to injury, pain with passive stretch, paresthesias"
      ]
    },
    medications: [
      {
        name: "Morphine Sulfate",
        type: "Opioid analgesic (mu-receptor agonist)",
        action: "Binds to mu-opioid receptors in the dorsal horn of the spinal cord and brainstem, mimicking endogenous endorphins. At the spinal cord level, morphine inhibits the release of substance P and other excitatory neurotransmitters, blocking pain signal transmission (modulation phase). At the brainstem level, morphine activates descending inhibitory pathways that further suppress pain transmission. In the limbic system, morphine reduces the emotional and affective component of pain, producing analgesia and a sense of well-being.",
        sideEffects: "Respiratory depression (most dangerous -- monitor respiratory rate before each dose), constipation (occurs in nearly all patients -- initiate bowel regimen prophylactically), nausea and vomiting (especially with initial doses), sedation, pruritus, urinary retention, hypotension (from histamine release and venodilation)",
        contra: "Respiratory depression (rate below 12 per minute), severe bronchial asthma without monitoring, paralytic ileus, head injury with elevated intracranial pressure (masks neurological assessment), concurrent use of MAO inhibitors within 14 days",
        pearl: "Always have naloxone (Narcan) readily available when administering morphine; assess respiratory rate BEFORE each dose; the antidote for opioid overdose is naloxone 0.4-2 mg IV, which reverses respiratory depression within 1-2 minutes but has a shorter duration than morphine (may need repeat doses); start a bowel protocol (docusate plus senna) with the first opioid dose"
      },
      {
        name: "Gabapentin (Neurontin)",
        type: "Anticonvulsant / neuropathic pain adjuvant",
        action: "Binds to the alpha-2-delta subunit of voltage-gated calcium channels in the dorsal horn of the spinal cord, reducing the influx of calcium into presynaptic nerve terminals. This decreases the release of excitatory neurotransmitters (glutamate, substance P, norepinephrine) in the dorsal horn, reducing pain signal transmission. Gabapentin is particularly effective for neuropathic pain because it targets the central sensitization and wind-up phenomenon that occurs with nerve injury.",
        sideEffects: "Drowsiness and sedation (most common -- dose at bedtime initially), dizziness, peripheral edema, weight gain, ataxia (unsteady gait), blurred vision; CNS depression is additive with opioids (increased respiratory depression risk)",
        contra: "Known hypersensitivity; use cautiously in renal impairment (gabapentin is renally excreted -- dose must be reduced based on creatinine clearance); do not discontinue abruptly (taper over 1 week minimum to prevent withdrawal seizures)",
        pearl: "Gabapentin is first-line for neuropathic pain (diabetic neuropathy, postherpetic neuralgia, phantom limb pain); takes 1-2 weeks to reach full therapeutic effect -- patients need to know it is not a PRN medication; start low and titrate slowly to minimize sedation; when combined with opioids, the opioid dose can often be reduced (opioid-sparing effect)"
      },
      {
        name: "Ketamine (Ketalar)",
        type: "NMDA receptor antagonist / dissociative analgesic",
        action: "Blocks N-methyl-D-aspartate (NMDA) receptors in the dorsal horn of the spinal cord and brain, preventing glutamate from binding. NMDA receptors play a central role in central sensitization (wind-up phenomenon) and opioid tolerance. By blocking NMDA receptors, subanesthetic ketamine reduces central sensitization, reverses opioid tolerance, and provides analgesia through a mechanism completely independent of opioid receptors. This makes it valuable for patients with opioid-resistant pain or opioid tolerance.",
        sideEffects: "Dissociative symptoms (feeling disconnected from body), vivid dreams or nightmares, hallucinations, nystagmus, increased salivation, dizziness, nausea, transient elevation of blood pressure and heart rate; emergence reactions (dysphoria, agitation) typically dose-dependent",
        contra: "Uncontrolled hypertension, elevated intracranial pressure (ketamine may further increase ICP), active psychosis or severe psychiatric disorder, known hypersensitivity",
        pearl: "Subanesthetic doses (0.1-0.3 mg/kg/hour IV infusion) provide analgesia without full dissociation; used as adjunct for acute pain crises, opioid-tolerant patients, and chronic pain refractory to conventional therapy; the practical nurse monitors for dissociative effects and vital sign changes during infusion; co-administration of a low-dose benzodiazepine may reduce emergence reactions"
      }
    ],
    pearls: [
      "The four phases of nociception are Transduction (stimulus to nerve impulse), Transmission (impulse travels to spinal cord and brain), Perception (brain interprets pain), and Modulation (descending pathways inhibit pain) -- understanding these helps explain where each analgesic works",
      "Pain is whatever the patient says it is -- the patient's self-report is the most reliable indicator of pain; behavioral signs alone are not reliable because patients may mask pain or chronic pain may not produce visible autonomic responses",
      "A-delta fibers carry fast, sharp, well-localized first pain; C fibers carry slow, dull, aching, poorly localized second pain -- this explains why a new injury produces an initial sharp pain followed by a prolonged dull ache",
      "Gate Control Theory explains why rubbing a painful area helps: stimulating large A-beta touch fibers activates inhibitory interneurons in the dorsal horn that close the gate to smaller pain-carrying A-delta and C fibers",
      "Multimodal analgesia (combining drugs that act at different phases of nociception) provides better pain control with lower doses of each drug, reducing side effects -- this is the foundation of modern pain management",
      "Always assess respiratory rate before administering opioids -- a rate below 12 per minute requires holding the dose and notifying the physician; keep naloxone readily available whenever opioids are in use",
      "Neuropathic pain (burning, tingling, electric shock sensation) does not respond well to opioids alone -- adjuvant medications like gabapentin or pregabalin that target central sensitization are essential for effective management"
    ],
    quiz: [
      {
        question: "A practical nurse applies an ice pack to a patient's swollen, painful knee after surgery. Which phase of nociception does cold therapy primarily target?",
        options: [
          "Transduction -- cold reduces the release of inflammatory mediators and slows nerve impulse generation at the injury site",
          "Transmission -- cold blocks the nerve impulse from traveling along the spinal cord",
          "Perception -- cold changes how the brain interprets the pain signal",
          "Modulation -- cold activates descending inhibitory pathways from the brainstem"
        ],
        correct: 0,
        rationale: "Cold therapy primarily acts at the transduction phase by reducing local inflammation (vasoconstriction decreases edema and inflammatory mediator release) and slowing nerve conduction velocity in peripheral nociceptors. This decreases the generation of pain impulses at the site of tissue injury."
      },
      {
        question: "A patient describes their pain as burning, tingling, and like electric shocks shooting down the leg. The practical nurse recognizes these descriptors as characteristic of which type of pain?",
        options: [
          "Somatic pain from musculoskeletal injury",
          "Visceral pain from internal organ involvement",
          "Neuropathic pain from nerve damage or dysfunction",
          "Referred pain from a distant organ"
        ],
        correct: 2,
        rationale: "Burning, tingling, electric shock-like, and shooting sensations are classic descriptors of neuropathic pain, which results from damage or dysfunction of the peripheral or central nervous system. Neuropathic pain requires adjuvant analgesics such as gabapentin or pregabalin because it does not respond adequately to conventional analgesics alone."
      },
      {
        question: "A patient receiving IV morphine for postoperative pain has a respiratory rate of 8 breaths per minute, is difficult to arouse, and has pinpoint pupils. What should the practical nurse do first?",
        options: [
          "Document the findings and continue monitoring every 4 hours",
          "Administer the next scheduled dose of morphine as ordered",
          "Stop the morphine, stimulate the patient, and call for help to administer naloxone",
          "Reposition the patient and encourage deep breathing exercises"
        ],
        correct: 2,
        rationale: "Respiratory rate of 8, excessive sedation, and pinpoint pupils (miosis) are the classic triad of opioid toxicity. This is a medical emergency requiring immediate intervention: stop the opioid, stimulate the patient (call name, sternal rub), maintain the airway, and administer the opioid antagonist naloxone (Narcan) as ordered. Delayed intervention can result in respiratory arrest and death."
      }
    ]
  },

  "palliative-chemo-concepts-rpn": {
    title: "Palliative Chemotherapy Concepts for Practical Nurses",
    cellular: {
      title: "Principles of Palliative Versus Curative Chemotherapy",
      content: "Palliative chemotherapy is the administration of cytotoxic or targeted antineoplastic agents with the explicit goal of improving quality of life, managing symptoms, and potentially extending survival in patients with advanced or metastatic cancer that is not curable. This stands in contrast to curative chemotherapy, where the intent is to eliminate the cancer entirely and achieve long-term remission or cure. Understanding this distinction is fundamental because it changes the entire framework of care: in curative treatment, significant toxicity may be acceptable because the endpoint is cure; in palliative treatment, the benefit of tumor shrinkage must be weighed against the burden of treatment side effects, and the primary goal shifts from tumor eradication to comfort and quality of life. Chemotherapy works by interfering with cellular division and DNA replication. Because cancer cells divide more rapidly and uncontrollably than most normal cells, they are preferentially affected by chemotherapy. However, normal cells with high turnover rates are also damaged, producing the well-known side effects: bone marrow suppression (neutropenia, anemia, thrombocytopenia from damage to hematopoietic stem cells), mucositis and stomatitis (damage to rapidly dividing mucosal epithelium of the mouth and GI tract), alopecia (damage to rapidly dividing hair follicle cells), nausea and vomiting (chemotherapy triggers serotonin release from enterochromaffin cells in the GI tract, which activates 5-HT3 receptors on vagal afferent nerves, sending emetic signals to the chemoreceptor trigger zone in the medulla), and immunosuppression. In the palliative setting, symptom burden assessment becomes the central focus of nursing care. The Edmonton Symptom Assessment System (ESAS) is a validated tool that evaluates nine common cancer-related symptoms: pain, tiredness, nausea, depression, anxiety, drowsiness, appetite, well-being, and shortness of breath, each rated on a 0-10 scale. Quality of life instruments such as the EORTC QLQ-C30 (European Organisation for Research and Treatment of Cancer Quality of Life Questionnaire) and the FACT-G (Functional Assessment of Cancer Therapy - General) provide comprehensive evaluation of physical, emotional, social, and functional well-being. The decision to initiate, continue, or discontinue palliative chemotherapy involves ongoing assessment of the risk-benefit balance: if the treatment causes more suffering than the disease symptoms it was intended to control, the treatment should be reconsidered. Performance status assessment using the Eastern Cooperative Oncology Group (ECOG) scale or the Karnofsky Performance Status (KPS) scale helps determine whether a patient is well enough to tolerate and potentially benefit from chemotherapy. Patients with ECOG performance status of 3-4 (in bed more than 50% of the day or completely bedbound) generally do not benefit from palliative chemotherapy and may be better served by symptom management alone. Informed consent for palliative chemotherapy requires particularly thorough discussion because the patient must understand that the treatment will not cure the cancer, the expected benefits in terms of symptom relief and potential survival extension, the likely side effects and their management, and the alternative of foregoing chemotherapy in favor of comfort-focused care (hospice). The practical nurse plays a vital role in reinforcing this education, assessing the patient's understanding, monitoring for treatment side effects, managing symptoms, and supporting the patient and family through the complex emotional journey of living with advanced cancer."
    },
    riskFactors: [
      "Poor performance status (ECOG 3-4 or Karnofsky below 50%) -- patients who are bedbound or need significant assistance have higher treatment toxicity risk and less potential benefit",
      "Advanced age with multiple comorbidities (diminished organ reserve reduces ability to metabolize and excrete cytotoxic drugs, increasing toxicity risk)",
      "Pre-existing bone marrow suppression from prior chemotherapy or radiation (reduced hematopoietic reserve increases risk of severe myelosuppression and neutropenic sepsis)",
      "Malnutrition and hypoalbuminemia (impaired drug binding, altered drug distribution, poor wound healing, and decreased immune function)",
      "Hepatic or renal impairment (altered drug metabolism and excretion increase drug levels and toxicity; many chemotherapy agents require dose adjustment based on organ function)",
      "Psychosocial vulnerability including lack of social support, uncontrolled depression, or unrealistic expectations about treatment outcomes",
      "Prior severe adverse reactions to chemotherapy (grade 3-4 toxicities) that required treatment delays, dose reductions, or hospitalization"
    ],
    diagnostics: [
      "Complete blood count (CBC) with differential: checked before each chemotherapy cycle; absolute neutrophil count (ANC) must be above 1,500 and platelets above 100,000 before administering most chemotherapy regimens",
      "Comprehensive metabolic panel (CMP): monitor renal function (BUN, creatinine, GFR) and hepatic function (AST, ALT, bilirubin, albumin) before each cycle as impaired organ function requires dose adjustment or treatment delay",
      "Performance status assessment (ECOG or Karnofsky scale): evaluated at each visit to determine if the patient's functional status supports continued treatment; declining performance status may indicate treatment should be discontinued",
      "Edmonton Symptom Assessment System (ESAS): patient rates 9 symptoms on 0-10 scale at each visit; scores above 4 require targeted intervention; trending scores over time reveals treatment impact on symptom burden",
      "CT scan or other imaging: performed every 2-3 cycles to assess tumor response; stable disease or partial response supports continued treatment; progressive disease despite treatment indicates treatment failure",
      "Tumor markers (when applicable): CA-125 (ovarian), CEA (colorectal), CA 19-9 (pancreatic), PSA (prostate); trending levels help assess treatment response between imaging studies"
    ],
    management: [
      "Administer antiemetics prophylactically as ordered BEFORE chemotherapy: high-emetic-risk regimens require a three-drug regimen (5-HT3 antagonist plus corticosteroid plus NK-1 antagonist)",
      "Monitor for and manage neutropenic precautions when ANC drops below 1,500: private room, strict hand hygiene, no fresh flowers or raw foods, avoid rectal temperatures or suppositories, report temperature above 38.3 degrees Celsius immediately",
      "Implement mucositis prevention and management: oral care every 4 hours with soft toothbrush, alcohol-free mouthwash, oral cryotherapy during high-risk infusions; assess using WHO mucositis grading scale",
      "Administer breakthrough pain medications promptly; palliative patients may require higher opioid doses than typical postoperative patients due to chronic pain and opioid tolerance",
      "Coordinate with the interdisciplinary palliative care team (physician, nurse, social worker, chaplain, pharmacist) to address physical, psychosocial, and spiritual needs holistically",
      "Facilitate advance care planning discussions and ensure advance directives, code status, and goals of care are documented and communicated to all team members",
      "Monitor for chemotherapy extravasation during IV administration: stop infusion immediately if patient reports burning, swelling, or redness at IV site; follow facility-specific extravasation protocol"
    ],
    nursingActions: [
      "Verify informed consent is documented before each chemotherapy cycle; ensure the patient demonstrates understanding that the treatment goal is palliation, not cure",
      "Perform pre-chemotherapy assessment: vital signs, weight, symptom assessment (ESAS), oral mucosa examination, IV site inspection, and review of laboratory values to confirm treatment eligibility",
      "Administer chemotherapy only through a verified patent IV line or central venous access device; perform blood return check before and during vesicant administration; never leave the bedside during vesicant push medications",
      "Monitor the patient continuously during chemotherapy infusion for hypersensitivity reactions: assess for urticaria, flushing, dyspnea, wheezing, hypotension, chest tightness; stop infusion immediately if anaphylaxis is suspected",
      "Educate the patient and family about expected side effects and when to seek emergency care: fever above 38.3 degrees Celsius, uncontrolled vomiting, bleeding, severe mouth sores preventing eating or drinking, signs of infection",
      "Assess psychosocial well-being at each visit using open-ended questions; screen for depression, anxiety, caregiver burden, and spiritual distress; refer to appropriate support services",
      "Document all assessments, medications administered, patient education provided, and patient responses; communicate findings to the oncology team using SBAR format"
    ],
    assessmentFindings: [
      "Fatigue: most common and debilitating symptom in palliative chemotherapy patients; assess using 0-10 scale; often multifactorial (anemia, deconditioning, depression, sleep disturbance, medication effects)",
      "Chemotherapy-induced nausea and vomiting (CINV): may be acute (within 24 hours), delayed (24-120 hours after treatment), or anticipatory (conditioned response before treatment); assess pattern and severity",
      "Neutropenia: ANC below 1,500 increases infection risk; ANC below 500 (severe neutropenia) creates high risk for neutropenic fever and sepsis -- the leading cause of chemotherapy-related death",
      "Mucositis: redness, edema, ulceration of oral mucosa; WHO grading: Grade 1 (soreness), Grade 2 (erythema, can eat solids), Grade 3 (ulcers, liquid diet only), Grade 4 (unable to eat or drink)",
      "Thrombocytopenia: platelet count below 100,000; assess for petechiae, easy bruising, gingival bleeding, epistaxis, blood in stool or urine; bleeding precautions when platelets below 50,000",
      "Peripheral neuropathy from neurotoxic agents (cisplatin, vincristine, taxanes): numbness, tingling, burning in hands and feet; assess using monofilament testing; may persist after treatment ends",
      "Psychosocial distress: grief, anticipatory mourning, existential distress, fear of dying, concerns about being a burden to family; assess with validated distress screening tools"
    ],
    signs: {
      left: [
        "Mild fatigue manageable with rest periods",
        "Mild nausea controlled with prescribed antiemetics",
        "ANC above 1,500 and platelets above 100,000",
        "Mild peripheral neuropathy (tingling in fingertips)",
        "Grade 1 mucositis (oral soreness without ulceration)",
        "Stable performance status maintaining daily activities"
      ],
      right: [
        "Neutropenic fever: temperature above 38.3 degrees Celsius with ANC below 500 (medical emergency requiring immediate broad-spectrum antibiotics)",
        "Severe mucositis (Grade 3-4) preventing oral intake, risking dehydration and malnutrition",
        "Active bleeding with thrombocytopenia (platelets below 20,000) -- intracranial hemorrhage risk",
        "Chemotherapy extravasation of vesicant agent causing tissue necrosis",
        "Anaphylactic reaction during infusion (urticaria, bronchospasm, hypotension, cardiovascular collapse)",
        "Rapid decline in performance status (ECOG 3-4) indicating treatment should be discontinued"
      ]
    },
    medications: [
      {
        name: "Ondansetron (Zofran)",
        type: "Antiemetic (5-HT3 serotonin receptor antagonist)",
        action: "Selectively blocks serotonin (5-HT3) receptors on vagal afferent nerves in the gastrointestinal tract and in the chemoreceptor trigger zone (CTZ) of the medulla oblongata. Chemotherapy damages enterochromaffin cells in the intestinal mucosa, causing massive serotonin release that activates 5-HT3 receptors and triggers the vomiting reflex. By blocking these receptors, ondansetron prevents the emetic signal from reaching the vomiting center. It is most effective against acute chemotherapy-induced nausea and vomiting (within 24 hours of treatment).",
        sideEffects: "Headache (most common), constipation (serotonin plays a role in GI motility), dizziness, fatigue, QT prolongation (dose-dependent -- risk of torsades de pointes at high doses)",
        contra: "Congenital long QT syndrome; use with caution in patients taking other QT-prolonging medications or those with electrolyte imbalances (hypokalemia, hypomagnesemia increase QT prolongation risk)",
        pearl: "Administer 30 minutes before chemotherapy for optimal protection; maximum single IV dose is 16 mg (reduced from 32 mg due to QT prolongation concerns); for high-emetic-risk regimens, combine with dexamethasone and an NK-1 antagonist for superior protection; check ECG if patient has cardiac history"
      },
      {
        name: "Dexamethasone (Decadron)",
        type: "Corticosteroid / antiemetic adjunct / anti-inflammatory",
        action: "In palliative chemotherapy, dexamethasone serves multiple roles: as an antiemetic, it reduces inflammation in the CTZ and GI tract and enhances the efficacy of 5-HT3 antagonists through unclear synergistic mechanisms. It also reduces cerebral edema (for brain metastases), improves appetite and energy levels, reduces inflammation-related pain, and can be used to manage chemotherapy-induced hypersensitivity reactions. Its broad anti-inflammatory action suppresses prostaglandin and leukotriene synthesis.",
        sideEffects: "Hyperglycemia (check blood glucose every 6 hours in diabetic patients and report values above 200 mg/dL), insomnia (administer early in the day when possible), mood changes (euphoria, irritability, anxiety), increased appetite and weight gain, immunosuppression (increased infection risk), GI irritation (administer with food or PPI), muscle weakness with prolonged use",
        contra: "Active systemic fungal infection, uncontrolled diabetes (relative -- may use with close glucose monitoring), active GI bleeding, known hypersensitivity",
        pearl: "In antiemetic regimens, dexamethasone is given on the day of chemotherapy and for 2-3 days after for delayed nausea prevention; when used for brain metastases, taper gradually rather than stopping abruptly to prevent adrenal crisis; monitor blood glucose closely in diabetic patients -- insulin doses may need temporary increase during dexamethasone treatment"
      },
      {
        name: "Oxycodone (OxyContin, Supeudol)",
        type: "Opioid analgesic (mu-receptor agonist)",
        action: "Binds to mu-opioid receptors in the central nervous system (dorsal horn of spinal cord, brainstem, and limbic system), mimicking endogenous endorphins to alter pain perception and emotional response to pain. Oxycodone is a semi-synthetic opioid with good oral bioavailability (approximately 60-87%), making it a preferred oral opioid for moderate to severe cancer pain. Available in immediate-release formulations for breakthrough pain and extended-release formulations for around-the-clock baseline pain control.",
        sideEffects: "Constipation (universal with chronic use -- initiate bowel protocol with first dose: docusate plus senna), nausea and vomiting (usually resolves within 3-5 days), sedation (monitor level of consciousness), respiratory depression (dose-related, monitor respiratory rate), pruritus, urinary retention, physical dependence with chronic use (expected and distinct from addiction)",
        contra: "Significant respiratory depression, severe bronchial asthma without monitoring, known or suspected GI obstruction including paralytic ileus, concurrent use of MAO inhibitors within 14 days",
        pearl: "For cancer pain, use immediate-release oxycodone for dose titration and breakthrough pain (onset 15-30 minutes, duration 3-4 hours); once daily requirements are stable, convert to extended-release formulation for convenience; always maintain immediate-release formulation availability for breakthrough pain (typically 10-15% of total 24-hour dose); tolerance to respiratory depression and sedation develops faster than tolerance to constipation -- bowel regimen is always needed"
      }
    ],
    pearls: [
      "The fundamental distinction: curative chemotherapy aims to eliminate cancer and tolerates significant toxicity for that goal; palliative chemotherapy aims to improve quality of life and must be stopped if the treatment burden exceeds the symptom relief benefit",
      "Neutropenic fever (temperature above 38.3 degrees Celsius with ANC below 500) is a medical emergency -- broad-spectrum antibiotics must be administered within 60 minutes of recognition because neutropenic patients can progress to septic shock rapidly",
      "Always administer antiemetics BEFORE chemotherapy, not after nausea develops -- preventive antiemetic therapy is far more effective than treating established nausea and vomiting",
      "The Edmonton Symptom Assessment System (ESAS) provides a standardized way to track nine key symptoms over time -- trending scores reveals whether treatment is improving or worsening the patient's symptom burden",
      "Performance status (ECOG scale) is the strongest predictor of chemotherapy benefit -- patients with ECOG 3-4 (in bed more than 50% of the day) generally do not benefit from palliative chemotherapy",
      "Constipation from opioids does NOT resolve with tolerance -- a bowel regimen (stimulant laxative plus stool softener) must be started with the first opioid dose and continued throughout treatment",
      "Palliative care is not the same as end-of-life care -- palliative chemotherapy may extend survival by months or years while managing symptoms; hospice care focuses on comfort when active treatment is no longer beneficial"
    ],
    quiz: [
      {
        question: "A patient receiving palliative chemotherapy has a temperature of 38.5 degrees Celsius and a complete blood count showing an absolute neutrophil count (ANC) of 400. What should the practical nurse recognize and report?",
        options: [
          "This is an expected side effect that can be managed with acetaminophen and monitoring",
          "This is neutropenic fever, a medical emergency requiring immediate physician notification for broad-spectrum antibiotics",
          "The patient should take the temperature again in 1 hour to confirm the reading",
          "The patient should receive their next scheduled chemotherapy dose to boost immune function"
        ],
        correct: 1,
        rationale: "A temperature above 38.3 degrees Celsius combined with an ANC below 500 defines neutropenic fever, which is a medical emergency. Without functioning neutrophils to fight infection, the patient is at extreme risk for rapidly progressive sepsis. Broad-spectrum antibiotics must be initiated within 60 minutes. Delaying treatment or waiting to recheck temperature can be fatal."
      },
      {
        question: "A patient receiving palliative chemotherapy tells the practical nurse that they thought the treatment would cure their cancer. What is the most appropriate nursing response?",
        options: [
          "Reassure the patient that the chemotherapy might cure the cancer",
          "Clarify the patient's understanding and reinforce that the treatment goal is to manage symptoms and improve quality of life, then notify the oncology team",
          "Tell the patient to discuss this with their family members",
          "Avoid the conversation to prevent causing the patient emotional distress"
        ],
        correct: 1,
        rationale: "This indicates a gap in the patient's understanding of the treatment goals, which is an informed consent issue. The practical nurse should assess what the patient currently understands, gently clarify that palliative chemotherapy is intended to manage symptoms and improve quality of life rather than cure the cancer, and notify the oncology team so that a formal goals-of-care discussion can be arranged. Avoiding the conversation or providing false reassurance is not ethical."
      },
      {
        question: "A patient on palliative oxycodone for cancer pain has not had a bowel movement in 4 days. The practical nurse should recognize this is most likely caused by which factor?",
        options: [
          "Inadequate fluid intake from chemotherapy-related nausea",
          "Opioid-induced constipation, which requires a stimulant laxative plus stool softener",
          "Progression of the underlying cancer causing bowel obstruction",
          "A side effect of the antiemetic medication ondansetron"
        ],
        correct: 1,
        rationale: "Constipation is a universal side effect of chronic opioid therapy because opioids bind to mu receptors in the GI tract, reducing peristalsis, increasing water absorption, and increasing sphincter tone. Unlike other opioid side effects, tolerance to constipation does NOT develop. A scheduled bowel regimen combining a stimulant laxative (senna) and stool softener (docusate) should be initiated with the first opioid dose and continued throughout therapy."
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
console.log(`\nDone. Injected: ${injected}, Skipped: ${skipped}`);
