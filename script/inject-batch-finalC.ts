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
  "vre-rpn": {
    title: "Vancomycin-Resistant Enterococcus (VRE) for Practical Nurses",
    cellular: {
      title: "Microbiology and Pathophysiology of VRE",
      content: "Vancomycin-resistant Enterococcus (VRE) refers to strains of Enterococcus bacteria -- primarily Enterococcus faecium and Enterococcus faecalis -- that have acquired genetic mutations or mobile genetic elements (plasmids and transposons) conferring resistance to vancomycin, a glycopeptide antibiotic traditionally considered a last-resort treatment for gram-positive infections. Enterococci are gram-positive, facultatively anaerobic cocci that normally colonize the gastrointestinal tract, female genital tract, and oral cavity as part of the normal flora. These organisms are intrinsically resistant to many commonly used antibiotics, including cephalosporins, aminoglycosides (low-level), and clindamycin. Vancomycin resistance develops through acquisition of the vanA or vanB gene clusters, which alter the target site (D-alanyl-D-alanine terminus) on the bacterial cell wall precursor peptidoglycan, replacing the terminal D-alanine with D-lactate. This modification reduces vancomycin binding affinity by approximately 1000-fold, rendering the antibiotic ineffective. VRE causes healthcare-associated infections including urinary tract infections, bacteremia, wound infections, intra-abdominal infections, and rarely endocarditis. VRE can survive on environmental surfaces (bed rails, doorknobs, stethoscopes, blood pressure cuffs) for days to weeks, facilitating transmission in healthcare settings. Transmission occurs primarily through direct contact with colonized or infected patients, or through contact with contaminated surfaces and equipment. The practical nurse plays a critical role in preventing VRE transmission through strict adherence to contact precautions, meticulous hand hygiene, and proper environmental cleaning. Risk factors for VRE colonization and infection include prolonged hospitalization, prior antibiotic exposure (especially vancomycin, third-generation cephalosporins, and fluoroquinolones), immunosuppression, proximity to colonized patients, and residence in long-term care facilities. Patients may be colonized (carrying VRE without symptoms) or infected (VRE causing active disease). Colonized patients serve as reservoirs for transmission and may develop infection if they become immunocompromised or undergo invasive procedures."
    },
    riskFactors: [
      "Prolonged hospitalization or ICU stay (increased exposure to resistant organisms)",
      "Prior antibiotic use, especially vancomycin, cephalosporins, or fluoroquinolones (selective pressure for resistant strains)",
      "Immunosuppression from chemotherapy, transplant, or corticosteroid therapy",
      "Indwelling devices (urinary catheters, central venous catheters, feeding tubes)",
      "Chronic kidney disease or hemodialysis (frequent healthcare exposure)",
      "Residence in long-term care facilities or skilled nursing homes",
      "Close proximity to VRE-colonized or VRE-infected patients in shared rooms"
    ],
    diagnostics: [
      "Rectal swab culture: primary screening method for VRE colonization; swab inserted 1 cm past the anal sphincter and cultured on selective media containing vancomycin",
      "Blood cultures: essential when VRE bacteremia is suspected; obtain at least two sets from separate sites before antibiotic administration",
      "Wound culture: obtained from infected wounds using appropriate sterile technique; specify VRE testing on requisition",
      "Urine culture and sensitivity: for suspected VRE urinary tract infection; collect clean-catch or catheter specimen",
      "Complete blood count (CBC): elevated WBC with left shift suggests active infection; neutropenia increases infection risk",
      "C-reactive protein (CRP) and procalcitonin: inflammatory markers to monitor treatment response; procalcitonin helps differentiate bacterial from non-bacterial causes"
    ],
    management: [
      "Implement and maintain contact precautions: private room or cohorting with other VRE patients, gown and gloves for all room entry",
      "Perform hand hygiene with soap and water (preferred over alcohol-based rub for VRE as physical removal is important)",
      "Administer prescribed antibiotics: linezolid PO/IV or daptomycin IV as ordered; monitor for adverse effects",
      "Dedicate patient care equipment (stethoscope, blood pressure cuff, thermometer) to the VRE patient room",
      "Enhance environmental cleaning with hospital-grade disinfectant; ensure high-touch surfaces are cleaned at least twice daily",
      "Remove unnecessary invasive devices (urinary catheters, central lines) as soon as clinically appropriate to reduce infection risk",
      "Coordinate with infection prevention and control team regarding patient placement, surveillance, and outbreak management"
    ],
    nursingActions: [
      "Don gown and gloves BEFORE entering the VRE patient room and remove them BEFORE leaving; perform hand hygiene immediately after removal",
      "Place contact precaution signage on the patient door and ensure all staff and visitors are educated on requirements",
      "Monitor for signs and symptoms of VRE infection: fever, chills, wound drainage changes, dysuria, cloudy urine, or signs of sepsis",
      "Obtain cultures as ordered BEFORE initiating antibiotic therapy to ensure accurate susceptibility results",
      "Monitor linezolid patients for serotonin syndrome (agitation, tremor, diarrhea) and myelosuppression (check CBC weekly)",
      "Educate patient and family about VRE transmission prevention, the difference between colonization and infection, and the importance of hand hygiene",
      "Document isolation precautions, patient education provided, and any changes in clinical status accurately"
    ],
    assessmentFindings: [
      "Fever (temperature above 38.0 C) with or without chills and rigors indicating possible VRE bacteremia",
      "Wound infection signs: increased erythema, warmth, purulent drainage, delayed healing, pain at wound site",
      "Urinary tract infection signs: dysuria, frequency, urgency, suprapubic tenderness, cloudy or foul-smelling urine",
      "Sepsis indicators: tachycardia (HR above 90), hypotension (SBP below 90), tachypnea (RR above 20), altered mental status",
      "Catheter-related bloodstream infection: erythema, tenderness, or purulent drainage at central line insertion site",
      "Abdominal infection signs: abdominal pain, distension, guarding, fever following abdominal surgery or procedures"
    ],
    signs: {
      left: [
        "Low-grade fever (38.0-38.5 C)",
        "Mild wound erythema at surgical or wound site",
        "Cloudy urine without systemic symptoms",
        "Positive surveillance culture without infection symptoms (colonization)",
        "Mild fatigue and malaise",
        "Localized warmth at catheter insertion site"
      ],
      right: [
        "High fever with rigors (possible bacteremia or sepsis)",
        "Hypotension with tachycardia (septic shock)",
        "Purulent wound drainage with surrounding cellulitis",
        "Altered mental status (confusion, lethargy) in elderly patients",
        "Signs of endocarditis (new murmur, petechiae, splinter hemorrhages)",
        "Hemodynamic instability requiring vasopressor support"
      ]
    },
    medications: [
      {
        name: "Linezolid (Zyvox)",
        type: "Oxazolidinone antibiotic",
        action: "Inhibits bacterial protein synthesis by binding to the 23S ribosomal RNA of the 50S ribosomal subunit, preventing formation of the 70S initiation complex; bacteriostatic against enterococci; one of the few oral antibiotics effective against VRE",
        sideEffects: "Thrombocytopenia (dose-limiting, monitor CBC weekly), peripheral and optic neuropathy (prolonged use beyond 28 days), serotonin syndrome when combined with serotonergic drugs (SSRIs, MAOIs), lactic acidosis, nausea, diarrhea",
        contra: "Concurrent use with serotonergic agents (SSRIs, SNRIs, MAOIs, meperidine, tramadol) due to weak MAO inhibition; uncontrolled hypertension or pheochromocytoma",
        pearl: "Available in oral form with near 100% bioavailability allowing IV-to-oral switch; limit therapy to 28 days to reduce risk of myelosuppression and neuropathy; tyramine-rich foods (aged cheese, cured meats, draft beer) should be avoided due to weak MAO inhibition"
      },
      {
        name: "Daptomycin (Cubicin)",
        type: "Cyclic lipopeptide antibiotic",
        action: "Binds to bacterial cell membranes in a calcium-dependent manner, causing rapid depolarization of membrane potential and disruption of intracellular ion gradients; results in inhibition of DNA, RNA, and protein synthesis leading to bacterial cell death; bactericidal against VRE",
        sideEffects: "Elevated creatine phosphokinase (CPK) indicating myopathy, rhabdomyolysis (rare but serious), eosinophilic pneumonia, peripheral neuropathy, GI disturbances",
        contra: "Cannot be used for pneumonia (inactivated by pulmonary surfactant); monitor CPK levels weekly and discontinue if CPK exceeds 10x upper limit of normal with symptoms",
        pearl: "IV administration only (no oral formulation); give as 30-minute infusion; dose adjustment required in renal impairment (CrCl below 30 mL/min); avoid concurrent statin use due to additive myopathy risk; monitor CPK at baseline and weekly"
      },
      {
        name: "Chlorhexidine gluconate (CHG)",
        type: "Antiseptic / topical antimicrobial",
        action: "Disrupts bacterial cell membranes by binding to negatively charged bacterial cell wall components, causing leakage of intracellular contents; has residual antimicrobial activity that persists on the skin for hours after application; effective against gram-positive organisms including VRE",
        sideEffects: "Skin irritation, contact dermatitis, rarely anaphylaxis; avoid contact with eyes, ears, and mucous membranes; stains clothing and fabrics",
        contra: "Known allergy to chlorhexidine (rare but can cause severe anaphylaxis); avoid use on open wounds or near the meninges; do not use in infants under 2 months without specific protocol",
        pearl: "Daily CHG bathing of ICU patients reduces VRE and other healthcare-associated infections by up to 30%; use 2% CHG-impregnated cloths for daily patient bathing; allow to air dry for full antimicrobial effect; clean skin prior to central line dressing changes"
      }
    ],
    pearls: [
      "VRE is transmitted by CONTACT -- strict hand hygiene and contact precautions (gown and gloves for ALL room entry) are the cornerstone of prevention",
      "Soap and water handwashing is preferred over alcohol-based hand rub for VRE because it physically removes organisms from the hands",
      "VRE colonization (positive rectal swab without symptoms) does NOT require antibiotic treatment -- only active VRE infection requires antibiotics",
      "Linezolid is available orally with excellent bioavailability, making it the preferred option when IV-to-oral step-down is possible; monitor platelets weekly",
      "Daptomycin CANNOT be used for VRE pneumonia because pulmonary surfactant inactivates the drug -- this is a critical safety point",
      "Dedicated equipment for VRE patients (stethoscope, BP cuff, thermometer) prevents cross-contamination; clean shared equipment with hospital-grade disinfectant between patients",
      "Report all new VRE-positive cultures to infection prevention and control immediately -- VRE outbreaks require coordinated surveillance and intervention"
    ],
    quiz: [
      {
        question: "A practical nurse is assigned to care for a patient with VRE. Which precaution is MOST important to implement?",
        options: [
          "Airborne precautions with an N95 respirator",
          "Contact precautions with gown and gloves for all room entry",
          "Droplet precautions with a surgical mask within 2 meters",
          "Standard precautions only with hand hygiene"
        ],
        correct: 1,
        rationale: "VRE is transmitted through direct and indirect contact. Contact precautions require gown and gloves for all interactions with the patient or their environment. VRE is not transmitted via airborne or droplet routes."
      },
      {
        question: "The physician prescribes daptomycin for a patient with VRE bacteremia. Which laboratory value should the practical nurse monitor weekly?",
        options: [
          "Hemoglobin A1C",
          "Serum creatine phosphokinase (CPK)",
          "Thyroid-stimulating hormone (TSH)",
          "Serum iron and ferritin"
        ],
        correct: 1,
        rationale: "Daptomycin can cause myopathy and rhabdomyolysis. CPK levels should be monitored weekly, and the drug should be discontinued if CPK exceeds 10 times the upper limit of normal with symptoms of muscle pain or weakness."
      },
      {
        question: "A patient has a positive VRE rectal surveillance swab but no signs or symptoms of infection. What is the MOST appropriate nursing action?",
        options: [
          "Request an antibiotic prescription to treat the VRE colonization",
          "Implement contact precautions and continue monitoring for signs of infection",
          "Place the patient in airborne isolation with negative pressure",
          "Discontinue all current antibiotics immediately"
        ],
        correct: 1,
        rationale: "VRE colonization without active infection does not require antibiotic treatment. The patient should be placed on contact precautions to prevent transmission, and ongoing monitoring for signs of active infection should continue."
      }
    ]
  },

  "wilms-tumor-rpn": {
    title: "Wilms Tumor (Nephroblastoma) for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Wilms Tumor (Nephroblastoma)",
      content: "Wilms tumor (nephroblastoma) is the most common primary renal malignancy in children, typically diagnosed between 2 and 5 years of age. It arises from embryonic kidney tissue (metanephric blastema) that fails to differentiate normally during fetal development, resulting in persistent nephrogenic rests that can undergo malignant transformation. The tumor originates within the renal parenchyma and can grow to a very large size before detection because the retroperitoneal space accommodates significant expansion. Wilms tumor is classified based on histology into favorable histology (approximately 90% of cases, with a cure rate exceeding 90%) and unfavorable or anaplastic histology (approximately 10% of cases, associated with a poorer prognosis due to resistance to chemotherapy). The tumor may be unilateral (affecting one kidney, approximately 93% of cases) or bilateral (affecting both kidneys, approximately 5-7% of cases). Several genetic mutations are associated with Wilms tumor, including mutations in the WT1 gene on chromosome 11p13 and the WT2 gene on chromosome 11p15.5. Wilms tumor is also associated with congenital anomalies and syndromic conditions including WAGR syndrome (Wilms tumor, Aniridia, Genitourinary anomalies, and intellectual disability), Beckwith-Wiedemann syndrome (macroglossia, omphalocele, visceromegaly, and hemihypertrophy), and Denys-Drash syndrome (male pseudohermaphroditism and progressive nephropathy). The single most critical nursing safety point is that the abdomen of a child with suspected or confirmed Wilms tumor must NEVER be palpated because manipulation can cause tumor rupture, seeding of malignant cells into the peritoneal cavity, hemorrhage, and upstaging of the disease. A sign reading DO NOT PALPATE ABDOMEN should be prominently displayed at the bedside. Treatment follows a multimodal approach: surgical nephrectomy is the primary treatment, followed by chemotherapy (vincristine, dactinomycin, and doxorubicin depending on stage) and radiation therapy for advanced stages. The National Wilms Tumor Study Group (now Children's Oncology Group) staging system guides treatment decisions based on surgical findings and extent of disease spread."
    },
    riskFactors: [
      "Age between 2 and 5 years (peak incidence for Wilms tumor)",
      "WAGR syndrome (Wilms tumor, Aniridia, Genitourinary anomalies, intellectual disability)",
      "Beckwith-Wiedemann syndrome (macroglossia, omphalocele, hemihypertrophy)",
      "Denys-Drash syndrome (male pseudohermaphroditism, progressive nephropathy)",
      "Family history of Wilms tumor (familial cases account for 1-2%)",
      "Hemihypertrophy (asymmetric overgrowth of one side of the body)",
      "Cryptorchidism or hypospadias (genitourinary anomalies associated with WT1 mutations)"
    ],
    diagnostics: [
      "Abdominal ultrasound: first-line imaging study; identifies solid intrarenal mass, determines laterality (unilateral vs bilateral), and evaluates for renal vein or inferior vena cava tumor thrombus",
      "CT scan of abdomen and chest: staging workup; evaluates tumor extent, lymph node involvement, and pulmonary metastases (lungs are the most common site of distant metastasis)",
      "Complete blood count (CBC): may reveal anemia from tumor hemorrhage or hematuria; polycythemia occasionally from erythropoietin production by tumor",
      "Urinalysis: may show microscopic or gross hematuria indicating renal involvement",
      "Renal function tests (BUN, creatinine): baseline kidney function before nephrectomy; critical for surgical planning especially in bilateral disease",
      "Coagulation studies (PT, PTT, fibrinogen): von Willebrand disease is associated with Wilms tumor; acquired von Willebrand syndrome may cause bleeding complications"
    ],
    management: [
      "Place a prominent sign at the bedside: DO NOT PALPATE ABDOMEN -- tumor manipulation risks rupture, hemorrhage, and metastatic spread",
      "Prepare the child and family for surgical nephrectomy: preoperative education about the procedure, NPO status, and expected postoperative course",
      "Administer chemotherapy as prescribed (vincristine, dactinomycin, doxorubicin depending on stage); follow safe handling protocols for cytotoxic drugs",
      "Monitor for tumor lysis syndrome after initiation of chemotherapy: hyperkalemia, hyperphosphatemia, hypocalcemia, hyperuricemia, and acute kidney injury",
      "Maintain strict intake and output monitoring; report urine output below 1 mL/kg/hour in children",
      "Provide postoperative care: monitor surgical site, manage pain, advance diet as tolerated, and encourage early ambulation appropriate for age",
      "Support family coping through education about treatment plan, expected timeline, and available psychosocial resources"
    ],
    nursingActions: [
      "CRITICAL: Never palpate the abdomen of a child with suspected or confirmed Wilms tumor -- post DO NOT PALPATE ABDOMEN sign at bedside, on the chart, and communicate to all caregivers",
      "Handle the child gently during bathing, repositioning, and diaper changes to avoid inadvertent pressure on the abdomen",
      "Monitor vital signs every 4 hours; report sudden abdominal pain, abdominal distension, or signs of hemorrhage (tachycardia, hypotension, pallor)",
      "Monitor for chemotherapy side effects: vincristine (peripheral neuropathy, constipation, jaw pain), dactinomycin (myelosuppression, hepatotoxicity), doxorubicin (cardiotoxicity, myelosuppression)",
      "Assess for signs of infection during myelosuppressive chemotherapy: fever, sore throat, oral lesions; implement neutropenic precautions when ANC below 500",
      "Measure abdominal girth daily at the same level to monitor for tumor growth or postoperative complications",
      "Provide age-appropriate education and emotional support using play therapy, child life specialists, and family-centered care"
    ],
    assessmentFindings: [
      "Painless, smooth, firm abdominal mass discovered by parent during bathing or by healthcare provider during routine examination (most common presenting finding)",
      "Abdominal distension or asymmetry noticed by the parent or caregiver",
      "Hypertension (present in approximately 25% of cases, caused by renin secretion from the tumor or renal artery compression)",
      "Hematuria (gross or microscopic, present in approximately 18-25% of cases)",
      "Fever of unknown origin (may be the presenting complaint in some children)",
      "Anemia-related findings: pallor, fatigue, tachycardia, irritability"
    ],
    signs: {
      left: [
        "Painless abdominal mass (most common initial finding)",
        "Mild abdominal distension or asymmetry",
        "Microscopic hematuria on routine urinalysis",
        "Mild hypertension above age-appropriate norms",
        "Low-grade fever without identified source",
        "Mild fatigue or decreased activity level"
      ],
      right: [
        "Sudden severe abdominal pain (possible tumor rupture -- surgical emergency)",
        "Gross hematuria with hemodynamic changes",
        "Rapid abdominal distension with signs of hemorrhage",
        "Severe hypertension with headache or visual changes",
        "Signs of tumor lysis syndrome (hyperkalemia, cardiac dysrhythmias)",
        "Respiratory distress from pulmonary metastases or abdominal mass compression"
      ]
    },
    medications: [
      {
        name: "Vincristine",
        type: "Vinca alkaloid antineoplastic (cell-cycle specific, M phase)",
        action: "Binds to tubulin proteins and inhibits microtubule assembly during mitosis, arresting cell division at metaphase; disrupts the mitotic spindle formation preventing chromosomal separation and causing cell death in rapidly dividing tumor cells",
        sideEffects: "Peripheral neuropathy (dose-limiting; numbness, tingling, foot drop, decreased deep tendon reflexes), constipation and paralytic ileus (autonomic neuropathy), jaw pain, alopecia, SIADH (hyponatremia)",
        contra: "Demyelinating form of Charcot-Marie-Tooth disease (severe neurotoxicity risk); ONLY given IV -- intrathecal administration is FATAL",
        pearl: "Vincristine is a VESICANT -- if extravasation occurs, stop infusion immediately, aspirate residual drug, apply warm compresses, and administer hyaluronidase as antidote; monitor bowel function closely and implement a prophylactic bowel regimen to prevent constipation"
      },
      {
        name: "Dactinomycin (Actinomycin D)",
        type: "Antitumor antibiotic antineoplastic",
        action: "Intercalates between DNA base pairs and inhibits RNA polymerase, blocking RNA and protein synthesis; causes DNA strand breaks; cell-cycle nonspecific but most active in G1 and S phases",
        sideEffects: "Severe myelosuppression (nadir 7-14 days), nausea and vomiting (highly emetogenic), mucositis, hepatotoxicity (hepatic veno-occlusive disease, especially in young children), radiation recall (enhanced tissue damage in previously irradiated areas), alopecia",
        contra: "Active infection (due to immunosuppression); concurrent radiation therapy to the liver (increased hepatotoxicity risk); infants under 6 months (increased toxicity risk)",
        pearl: "Also a VESICANT -- handle with extreme caution; avoid extravasation; hepatic veno-occlusive disease (sinusoidal obstruction syndrome) is a particular risk in children under 3 years; monitor liver function tests closely throughout therapy"
      },
      {
        name: "Doxorubicin (Adriamycin)",
        type: "Anthracycline antineoplastic antibiotic",
        action: "Intercalates into DNA and inhibits topoisomerase II, preventing DNA replication and transcription; generates free radicals that cause DNA strand breaks and cell membrane damage; cell-cycle nonspecific",
        sideEffects: "Cardiotoxicity (dose-dependent, cumulative; dilated cardiomyopathy at cumulative doses exceeding 450-550 mg/m2), severe myelosuppression, nausea and vomiting, alopecia (nearly universal), red-orange discoloration of urine (harmless but alarming to patients/families)",
        contra: "Severe myocardial insufficiency or recent myocardial infarction; cumulative lifetime dose limit must be tracked; severe hepatic impairment (dose reduction required)",
        pearl: "Monitor cardiac function with echocardiogram or MUGA scan before, during, and after therapy; dexrazoxane may be used as a cardioprotectant in some protocols; urine may turn red-orange for 1-2 days after administration -- educate family that this is expected and not blood; also a VESICANT"
      }
    ],
    pearls: [
      "The NUMBER ONE safety priority in Wilms tumor care: DO NOT PALPATE THE ABDOMEN -- palpation can cause tumor rupture, peritoneal seeding, hemorrhage, and disease upstaging",
      "Post a prominent DO NOT PALPATE ABDOMEN sign at the bedside, on the medical record, and communicate this restriction to ALL caregivers including parents, volunteers, and ancillary staff",
      "Wilms tumor has an excellent prognosis with favorable histology -- the overall survival rate exceeds 90% with appropriate multimodal treatment",
      "All three chemotherapy agents used in Wilms tumor (vincristine, dactinomycin, doxorubicin) are VESICANTS -- verify IV patency before and during administration; extravasation is a medical emergency",
      "Vincristine is ONLY given IV -- intrathecal vincristine administration is uniformly FATAL; always verify route before administration",
      "Monitor for tumor lysis syndrome within 12-72 hours of initiating chemotherapy: hyperkalemia (cardiac risk), hyperphosphatemia, hypocalcemia, hyperuricemia, and acute kidney injury",
      "The most common site of Wilms tumor metastasis is the lungs -- chest CT or X-ray is essential for staging workup"
    ],
    quiz: [
      {
        question: "A 3-year-old child is admitted with a suspected Wilms tumor. Which nursing action takes the HIGHEST priority?",
        options: [
          "Obtain a urine sample for urinalysis",
          "Palpate the abdomen to assess mass characteristics",
          "Place a DO NOT PALPATE ABDOMEN sign at the bedside",
          "Administer prescribed chemotherapy immediately"
        ],
        correct: 2,
        rationale: "The abdomen of a child with suspected or confirmed Wilms tumor must NEVER be palpated. Palpation can cause tumor rupture, hemorrhage, and metastatic spread. A prominent sign must be placed at the bedside to alert all caregivers."
      },
      {
        question: "A child receiving vincristine for Wilms tumor reports tingling in the fingers and toes. The practical nurse recognizes this as which adverse effect?",
        options: [
          "Cardiotoxicity",
          "Peripheral neuropathy",
          "Hepatic veno-occlusive disease",
          "Tumor lysis syndrome"
        ],
        correct: 1,
        rationale: "Peripheral neuropathy is the dose-limiting toxicity of vincristine. It manifests as numbness, tingling, and decreased deep tendon reflexes. The nurse should document and report this finding for possible dose adjustment. Cardiotoxicity is associated with doxorubicin."
      },
      {
        question: "A parent asks why the child's urine turned red-orange after doxorubicin administration. What is the BEST response by the practical nurse?",
        options: [
          "This indicates kidney damage and needs immediate investigation",
          "This is a normal and expected effect of doxorubicin and should resolve in 1-2 days",
          "The child is experiencing hematuria from the Wilms tumor",
          "This is a sign of an allergic reaction to the chemotherapy"
        ],
        correct: 1,
        rationale: "Red-orange discoloration of urine is a normal, expected, and harmless effect of doxorubicin administration. Educating the family about this anticipated change reduces anxiety and prevents unnecessary alarm."
      }
    ]
  },

  "womens-health-rpn": {
    title: "Reproductive and Women's Health for Practical Nurses",
    cellular: {
      title: "Physiology of Female Reproductive Health",
      content: "Female reproductive health encompasses the anatomy, physiology, and clinical management of the female reproductive system across the lifespan, from puberty through menopause. The menstrual cycle is regulated by the hypothalamic-pituitary-ovarian (HPO) axis through a complex feedback loop involving gonadotropin-releasing hormone (GnRH) from the hypothalamus, follicle-stimulating hormone (FSH) and luteinizing hormone (LH) from the anterior pituitary, and estrogen and progesterone from the ovaries. The menstrual cycle averages 28 days and consists of four phases: the menstrual phase (days 1-5, shedding of the endometrial lining), the follicular phase (days 1-13, FSH stimulates follicle maturation and rising estrogen levels), ovulation (approximately day 14, triggered by the LH surge), and the luteal phase (days 15-28, the corpus luteum produces progesterone to maintain the endometrium for potential implantation). If fertilization does not occur, the corpus luteum degenerates, progesterone and estrogen levels drop, and menstruation begins. Estrogen has widespread effects beyond reproduction: it promotes bone density, cardiovascular protection through favorable lipid profiles, and vaginal mucosal integrity. Progesterone stabilizes the endometrium and has a thermogenic effect (raising basal body temperature after ovulation). Cervical cancer screening (Pap smear and HPV testing) is a cornerstone of preventive women's health. Current guidelines recommend initiating cervical screening at age 21 for average-risk individuals, with Pap smear every 3 years (ages 21-29) or co-testing (Pap plus HPV) every 5 years (ages 30-65). Common reproductive health concerns addressed by practical nurses include menstrual disorders (amenorrhea, dysmenorrhea, menorrhagia), contraception counseling, sexually transmitted infection screening, breast health awareness, and menopausal symptom management. The practical nurse plays an essential role in health education, screening facilitation, medication administration, and recognizing conditions requiring referral to a physician or nurse practitioner."
    },
    riskFactors: [
      "Early menarche (before age 12) or late menopause (after age 55) increasing lifetime estrogen exposure",
      "Nulliparity (never having given birth) associated with increased risk of ovarian and endometrial cancers",
      "Family history of breast, ovarian, or endometrial cancer (especially BRCA1/BRCA2 mutations)",
      "Obesity (peripheral conversion of androgens to estrogen in adipose tissue, increasing estrogen exposure)",
      "Tobacco use (associated with cervical cancer, early menopause, and decreased estrogen levels)",
      "Multiple sexual partners or early onset of sexual activity (increased risk of HPV and cervical dysplasia)",
      "Unprotected sexual intercourse (risk of sexually transmitted infections and unintended pregnancy)"
    ],
    diagnostics: [
      "Pap smear (Papanicolaou test): screens for cervical cytological abnormalities; begin at age 21, repeat every 3 years (ages 21-29); schedule when patient is NOT menstruating; avoid vaginal products 48 hours before test",
      "HPV co-testing: combined with Pap smear for ages 30-65 every 5 years; high-risk HPV strains (16 and 18) are most strongly associated with cervical cancer",
      "Clinical breast examination: systematic palpation of breast tissue and axillary lymph nodes; performed during routine health assessments",
      "Mammography: breast cancer screening; current guidelines vary but generally recommend initiating between ages 40-50 with annual or biennial screening",
      "Complete blood count (CBC): hemoglobin and hematocrit to assess for iron deficiency anemia from menorrhagia or abnormal uterine bleeding",
      "Serum beta-hCG: pregnancy test; obtain before prescribing contraception, performing radiological studies, or initiating teratogenic medications"
    ],
    management: [
      "Administer prescribed hormonal contraception and provide patient education on proper use, expected side effects, and warning signs",
      "Manage dysmenorrhea with prescribed NSAIDs (ibuprofen, naproxen) and non-pharmacological interventions (heat application, exercise, relaxation techniques)",
      "Administer iron supplementation as prescribed for iron deficiency anemia related to menorrhagia; take with vitamin C to enhance absorption",
      "Assist with cervical screening procedures: prepare equipment, position patient, provide emotional support, and ensure specimen handling per facility protocol",
      "Educate patients on breast self-awareness: know normal breast appearance and feel; report new lumps, skin changes, nipple discharge, or asymmetry",
      "Provide contraception education: discuss effectiveness, side effects, and proper use of prescribed methods; ensure informed consent is documented",
      "Screen for intimate partner violence using validated screening tools at every healthcare encounter; provide referral resources when indicated"
    ],
    nursingActions: [
      "Obtain menstrual history: last menstrual period (LMP), cycle regularity, duration, flow amount, associated symptoms (cramping, bloating, mood changes)",
      "Perform pregnancy test (serum or urine beta-hCG) before initiating teratogenic medications, hormonal contraception, or diagnostic imaging",
      "Educate patients on combined oral contraceptive pill (OCP) use: take at the same time daily, what to do if a dose is missed, and warning signs requiring immediate medical attention (ACHES: Abdominal pain, Chest pain, Headache severe, Eye problems, Severe leg pain)",
      "Monitor for side effects of hormonal contraception: breakthrough bleeding, headache, breast tenderness, mood changes, nausea; report signs of thromboembolism immediately",
      "Assess for menopausal symptoms: hot flashes, night sweats, vaginal dryness, mood changes, sleep disturbances; reinforce prescribed management strategies",
      "Provide culturally sensitive care during reproductive health assessments; ensure privacy, explain procedures thoroughly, and obtain informed consent",
      "Document menstrual history, contraceptive use, screening results, and patient education accurately in the health record"
    ],
    assessmentFindings: [
      "Amenorrhea (absence of menstruation): primary (no menses by age 15) or secondary (cessation of previously regular menses for 3 or more months); always rule out pregnancy first",
      "Dysmenorrhea: painful menstruation with cramping, lower abdominal pain, and possibly nausea, diarrhea, headache, and fatigue; primary (no underlying pathology) vs secondary (endometriosis, fibroids)",
      "Menorrhagia: heavy menstrual bleeding (soaking through a pad or tampon every hour for several consecutive hours, or bleeding lasting more than 7 days)",
      "Menopausal symptoms: vasomotor symptoms (hot flashes, night sweats), urogenital atrophy (vaginal dryness, dyspareunia), mood changes, and sleep disturbances",
      "Abnormal cervical screening results: atypical squamous cells of undetermined significance (ASC-US), low-grade or high-grade squamous intraepithelial lesion (LSIL, HSIL)",
      "Signs of sexually transmitted infection: abnormal vaginal discharge, pelvic pain, dysuria, vulvar lesions, genital warts"
    ],
    signs: {
      left: [
        "Mild dysmenorrhea managed with OTC analgesics",
        "Irregular menstrual cycles without systemic symptoms",
        "Mild menopausal vasomotor symptoms (occasional hot flashes)",
        "Breast tenderness related to menstrual cycle (cyclical mastalgia)",
        "Mild premenstrual mood changes",
        "Normal variations in menstrual flow"
      ],
      right: [
        "Severe menorrhagia with signs of hemodynamic instability (tachycardia, hypotension, pallor)",
        "Sudden severe pelvic pain (possible ectopic pregnancy rupture, ovarian torsion, or ruptured ovarian cyst)",
        "Postmenopausal bleeding (must be evaluated for endometrial cancer)",
        "New breast lump with skin dimpling, nipple retraction, or bloody nipple discharge",
        "Signs of ectopic pregnancy: missed period, unilateral pelvic pain, vaginal bleeding, positive pregnancy test",
        "Severe headache or visual changes in a patient taking combined oral contraceptives (possible stroke)"
      ]
    },
    medications: [
      {
        name: "Combined Oral Contraceptive Pill (e.g., Ethinyl estradiol/Levonorgestrel)",
        type: "Hormonal contraceptive (combined estrogen-progestin)",
        action: "Suppresses ovulation by inhibiting the midcycle LH surge through negative feedback on the hypothalamic-pituitary axis; thickens cervical mucus (preventing sperm penetration); thins the endometrial lining (reducing implantation potential); slows tubal motility",
        sideEffects: "Nausea, breast tenderness, breakthrough bleeding, headache, mood changes, weight fluctuation; serious: venous thromboembolism (DVT/PE), stroke, myocardial infarction (rare, risk increased with smoking)",
        contra: "Age over 35 AND smoking (more than 15 cigarettes/day); history of VTE, stroke, or MI; migraine with aura; breast cancer; uncontrolled hypertension; liver disease; pregnancy",
        pearl: "Use ACHES mnemonic for danger signs: Abdominal pain (hepatic vein thrombosis), Chest pain (PE/MI), Headache severe (stroke), Eye problems (retinal vein thrombosis), Severe leg pain (DVT); take at the same time daily for maximum effectiveness"
      },
      {
        name: "Medroxyprogesterone acetate (Depo-Provera)",
        type: "Progestin-only injectable contraceptive",
        action: "Suppresses ovulation by inhibiting LH surge and GnRH pulsatility; thickens cervical mucus; produces endometrial atrophy making it unsuitable for implantation; administered as deep intramuscular injection every 11-13 weeks",
        sideEffects: "Irregular bleeding or amenorrhea (most common), weight gain, headache, mood changes, decreased bone mineral density with long-term use (reversible after discontinuation), delayed return to fertility (average 10 months after last injection)",
        contra: "Known or suspected pregnancy; unexplained vaginal bleeding; breast cancer; active liver disease; osteoporosis with additional risk factors",
        pearl: "Black box warning regarding bone mineral density loss: limit use to 2 years unless other methods are inadequate; calcium and vitamin D supplementation recommended; injection must be given within 5 days of menstrual period onset for immediate effectiveness"
      },
      {
        name: "Ferrous sulfate (iron supplement)",
        type: "Iron replacement / hematinics",
        action: "Provides elemental iron for hemoglobin synthesis and restoration of depleted iron stores; iron is incorporated into heme groups of hemoglobin in developing red blood cells in the bone marrow; corrects iron deficiency anemia commonly caused by menorrhagia",
        sideEffects: "GI disturbances (nausea, constipation, abdominal cramping, black tarry stools), metallic taste, teeth staining with liquid formulations",
        contra: "Hemochromatosis or hemosiderosis (iron overload states); patients receiving regular blood transfusions; concurrent use with certain antibiotics (tetracyclines, fluoroquinolones) reduces absorption of both drugs",
        pearl: "Take on an empty stomach with vitamin C (orange juice) to enhance absorption; take 1 hour before or 2 hours after antacids, calcium, dairy, tea, or coffee which inhibit iron absorption; black stools are expected and harmless; iron is a leading cause of poisoning death in children -- keep out of reach"
      }
    ],
    pearls: [
      "Always obtain a pregnancy test (serum or urine beta-hCG) before prescribing hormonal contraception, performing imaging studies, or initiating potentially teratogenic medications",
      "ACHES mnemonic for combined OCP danger signs: Abdominal pain, Chest pain, Headache (severe), Eye problems, Severe leg pain -- any of these requires immediate medical evaluation",
      "Combined oral contraceptives are CONTRAINDICATED in women over 35 who smoke more than 15 cigarettes daily due to significantly increased risk of VTE, stroke, and MI",
      "Cervical cancer screening begins at age 21 regardless of sexual activity onset; Pap every 3 years (ages 21-29) or Pap plus HPV co-testing every 5 years (ages 30-65)",
      "Postmenopausal bleeding is ALWAYS abnormal and must be promptly evaluated to rule out endometrial cancer -- report this finding immediately",
      "Iron supplements should be taken with vitamin C to enhance absorption and avoided with calcium, dairy, tea, and antacids which inhibit absorption",
      "Depo-Provera (medroxyprogesterone) has a black box warning for bone mineral density loss -- limit use to 2 years and supplement with calcium and vitamin D"
    ],
    quiz: [
      {
        question: "A patient taking combined oral contraceptives reports sudden severe headache and blurred vision. What is the PRIORITY nursing action?",
        options: [
          "Administer acetaminophen as prescribed for the headache",
          "Instruct the patient to discontinue the OCP and seek immediate medical evaluation",
          "Reassure the patient that headaches are a common side effect",
          "Schedule a follow-up appointment for the next week"
        ],
        correct: 1,
        rationale: "Severe headache and visual changes in a patient taking combined OCPs may indicate stroke or retinal vein thrombosis (danger signs in the ACHES mnemonic). The patient should discontinue the medication and seek immediate medical evaluation."
      },
      {
        question: "A practical nurse is educating a patient about taking ferrous sulfate for iron deficiency anemia from menorrhagia. Which instruction is MOST important?",
        options: [
          "Take iron with milk to reduce stomach upset",
          "Take iron with orange juice on an empty stomach to enhance absorption",
          "Take iron with calcium supplements for better absorption",
          "Take iron with coffee to improve tolerance"
        ],
        correct: 1,
        rationale: "Vitamin C (found in orange juice) enhances iron absorption. Iron should be taken on an empty stomach when possible. Milk, calcium, coffee, and tea inhibit iron absorption and should be avoided within 1-2 hours of iron administration."
      },
      {
        question: "A 52-year-old postmenopausal patient reports vaginal bleeding that began 3 days ago. What is the MOST appropriate nursing action?",
        options: [
          "Reassure the patient that occasional bleeding after menopause is normal",
          "Schedule a routine appointment in 4-6 weeks",
          "Report the finding immediately as postmenopausal bleeding requires urgent evaluation",
          "Recommend over-the-counter hormonal supplements"
        ],
        correct: 2,
        rationale: "Postmenopausal bleeding is ALWAYS abnormal and requires prompt evaluation to rule out endometrial cancer, endometrial hyperplasia, or other pathology. This finding should be reported immediately for urgent diagnostic workup."
      }
    ]
  },

  "wound-assessment-rpn": {
    title: "Wound Assessment and Documentation for Practical Nurses",
    cellular: {
      title: "Anatomy and Physiology of Wound Assessment",
      content: "Wound assessment is a systematic, comprehensive evaluation of a wound and its surrounding tissue that guides treatment decisions, monitors healing progress, and identifies complications. The skin is the largest organ of the body and consists of three primary layers: the epidermis (outermost protective layer composed of keratinized stratified squamous epithelium), the dermis (connective tissue layer containing blood vessels, nerves, hair follicles, and sebaceous and sweat glands), and the hypodermis or subcutaneous tissue (adipose and connective tissue providing insulation and cushioning). Beneath the subcutaneous layer lies the fascia, muscle, and bone. Understanding these anatomical layers is essential for accurate wound depth assessment and staging. Wounds are classified by multiple parameters: etiology (surgical, traumatic, pressure injury, vascular, diabetic), depth (superficial, partial-thickness, full-thickness, and those extending into muscle or bone), chronicity (acute wounds heal within the expected timeframe; chronic wounds fail to progress through healing phases in an orderly and timely manner, typically defined as wounds not healing within 30 days), and wound bed tissue type (granulation tissue is healthy red/pink tissue indicating healing; slough is yellow/tan devitalized tissue; eschar is black/brown hard necrotic tissue; epithelial tissue is new pink/silver tissue growing from wound edges). The MEASURE framework provides a structured approach to wound assessment: M (Measure length, width, depth), E (Exudate amount, type, color, odor), A (Appearance of wound bed tissue), S (Suffering/pain level using validated pain scale), U (Undermining and tunneling, probed with sterile cotton-tipped applicator), R (Re-evaluate regularly and compare to baseline), E (Edge condition including epithelialization, maceration, callus, rolled edges). Wound measurement follows standardized techniques: length is measured head-to-toe (12 o'clock to 6 o'clock), width is measured side-to-side (3 o'clock to 9 o'clock), and depth is measured by inserting a sterile cotton-tipped applicator at the deepest point perpendicular to the wound surface. All measurements are documented in centimeters. Periwound skin assessment (the skin within 4 cm surrounding the wound) is equally important: assess for erythema, maceration, induration, temperature changes, edema, and skin breakdown. Changes in periwound skin can indicate infection, moisture imbalance, or contact irritation from wound products. Accurate, consistent wound documentation is a legal requirement and is essential for continuity of care, treatment planning, and evaluating outcomes."
    },
    riskFactors: [
      "Impaired mobility or immobility (pressure injuries from prolonged tissue compression)",
      "Poor nutritional status (protein-calorie malnutrition impairs collagen synthesis and immune function)",
      "Diabetes mellitus (peripheral neuropathy, microangiopathy, and impaired immune response delay wound healing)",
      "Peripheral vascular disease (arterial insufficiency reduces oxygen delivery; venous insufficiency causes edema and tissue congestion)",
      "Advanced age (thinner epidermis, decreased collagen production, reduced inflammatory response)",
      "Chronic corticosteroid use (suppresses inflammatory phase and collagen synthesis)",
      "Obesity (reduced tissue perfusion, increased mechanical stress on wounds, higher infection risk)"
    ],
    diagnostics: [
      "Wound measurement: length (head-to-toe), width (side-to-side), depth (deepest point), all in centimeters using sterile disposable ruler or measurement guide",
      "Wound culture (if infection suspected): use Levine technique -- cleanse wound first, rotate sterile swab over 1 cm2 area of clean granulation tissue with sufficient pressure to express fluid from wound tissue",
      "Wound photography: standardized photos with ruler, patient identifier, date, and consistent lighting/angle for objective comparison over time; follow facility consent policy",
      "Ankle-brachial index (ABI): ratio of ankle systolic pressure to brachial systolic pressure; ABI below 0.9 suggests arterial insufficiency; ABI above 1.3 suggests calcified vessels (common in diabetes)",
      "Serum albumin and prealbumin: nutritional markers; albumin below 3.5 g/dL and prealbumin below 15 mg/dL indicate protein malnutrition that impairs wound healing",
      "Complete blood count (CBC): WBC elevation suggests infection; hemoglobin below 10 g/dL impairs oxygen delivery to wound tissues"
    ],
    management: [
      "Perform comprehensive wound assessment using the MEASURE framework at each dressing change and document all findings",
      "Select appropriate wound dressing based on wound characteristics: moisture balance (too dry needs hydrogel; too wet needs absorbent foam or alginate), protection, and healing promotion",
      "Maintain moist wound healing environment: evidence shows moist wounds heal up to 50% faster than dry wounds; avoid letting wound bed desiccate",
      "Implement pressure redistribution strategies for pressure injuries: reposition every 2 hours, use pressure-relieving surfaces, keep head of bed below 30 degrees when possible",
      "Optimize nutrition: ensure adequate protein intake (1.25-1.5 g/kg/day for wound healing), vitamin C (250-500 mg twice daily), and zinc (40 mg daily for deficient patients)",
      "Manage wound pain: assess pain before, during, and after dressing changes; administer prescribed analgesics 30 minutes before painful procedures",
      "Refer to wound care specialist or enterostomal therapy nurse for complex wounds that fail to show improvement within 2-4 weeks"
    ],
    nursingActions: [
      "Measure wound dimensions using the clock method: length from 12 o'clock to 6 o'clock (head-to-toe), width from 3 o'clock to 9 o'clock (side-to-side); document in centimeters",
      "Assess and document wound bed tissue types as percentages: granulation (red, healthy), slough (yellow, devitalized), eschar (black, necrotic), epithelial (pink, new growth)",
      "Probe for undermining (tissue destruction under intact wound edges) and tunneling (narrow channel extending from wound) using sterile cotton-tipped applicator; document location using clock face method and depth in centimeters",
      "Assess and document exudate: amount (none, scant, small, moderate, large), type (serous/clear, sanguineous/bloody, serosanguineous/pink, purulent/yellow-green), and odor",
      "Evaluate periwound skin (4 cm surrounding wound): assess for erythema, maceration (white soggy tissue from excessive moisture), induration (firmness), warmth, edema, and skin breakdown",
      "Compare current wound assessment to baseline and previous assessments to determine if wound is improving, stable, or deteriorating; report deterioration to physician or wound care team",
      "Document wound assessment using standardized terminology and include wound location (anatomical landmark), dimensions, wound bed appearance, exudate, periwound skin condition, pain level, and current treatment"
    ],
    assessmentFindings: [
      "Granulation tissue: moist, red/pink, bumpy (granular) tissue in the wound bed indicating healthy healing and new capillary and connective tissue formation",
      "Slough: yellow, tan, or gray soft devitalized tissue in the wound bed that must be removed (debrided) for healing to progress",
      "Eschar: black or brown hard, dry, leathery necrotic tissue covering the wound; stable eschar on heels should NOT be removed unless signs of infection develop",
      "Undermining: tissue destruction beneath intact wound edges; measured by inserting sterile probe under wound edge and documenting depth and location using clock positions",
      "Tunneling: narrow channel or sinus tract extending from the wound bed into surrounding tissue; document direction (clock position) and depth in centimeters",
      "Wound edge characteristics: epithelialization (new pink tissue migrating inward from edges), rolled/epibole edges (indicate chronic wound stalling), maceration (white softened edges from excess moisture)"
    ],
    signs: {
      left: [
        "Wound with healthy red granulation tissue filling the wound bed",
        "Progressive decrease in wound dimensions over time",
        "Epithelialization advancing from wound edges",
        "Serous or serosanguineous exudate in moderate amounts",
        "Intact periwound skin without maceration or erythema",
        "Pain that is manageable and decreasing over time"
      ],
      right: [
        "Wound bed with increasing slough or necrotic tissue (healing regression)",
        "Expanding wound dimensions or new undermining or tunneling",
        "Purulent exudate with foul odor (possible wound infection)",
        "Periwound erythema, warmth, induration, and spreading cellulitis",
        "Wound dehiscence (separation of wound edges) or evisceration (protrusion of organs through wound)",
        "Systemic signs of wound infection: fever, elevated WBC, tachycardia"
      ]
    },
    medications: [
      {
        name: "Silver sulfadiazine cream (Silvadene/Flamazine)",
        type: "Topical antimicrobial / sulfonamide antibiotic",
        action: "Silver ions bind to bacterial DNA and disrupt the cell membrane, providing broad-spectrum antimicrobial activity against gram-positive and gram-negative bacteria, as well as yeast; sulfadiazine component inhibits bacterial folic acid synthesis",
        sideEffects: "Leukopenia (transient, usually resolves spontaneously), skin discoloration (gray-black), burning sensation on application, allergic contact dermatitis, delayed wound healing with prolonged use on clean granulating wounds",
        contra: "Sulfonamide allergy; premature infants or neonates under 2 months (risk of kernicterus); pregnancy near term (crosses placenta); G6PD deficiency; avoid on clean granulating wounds (silver can be cytotoxic to fibroblasts)",
        pearl: "Apply 1/16 inch thick layer with sterile gloved hand or tongue depressor; reapply every 12-24 hours after wound cleansing; monitor CBC weekly for leukopenia; primarily used for burn wounds and infected wounds; do NOT use on clean healing wounds as silver may impair granulation"
      },
      {
        name: "Medical-grade Manuka honey (Medihoney)",
        type: "Topical wound management product / osmotic debriding agent",
        action: "Creates a low-pH (acidic) wound environment that inhibits bacterial growth; high osmolarity draws moisture from tissues to promote autolytic debridement of devitalized tissue; hydrogen peroxide generated at low levels provides sustained antimicrobial activity; anti-inflammatory properties reduce wound edema",
        sideEffects: "Transient stinging or burning on application (usually diminishes within 30 minutes), possible increased exudate initially due to osmotic effect, allergic reaction in patients with bee product allergies",
        contra: "Known allergy to bee products or bee stings; use only medical-grade honey (NOT food-grade); caution in patients with diabetes (does not significantly affect blood glucose when used topically, but monitor glucose levels)",
        pearl: "Medical-grade Manuka honey has been validated for use on chronic wounds, burns, and surgical wounds; effective against biofilm-forming bacteria including MRSA and VRE; apply directly to wound bed or to dressing; does not require refrigeration; change dressing when honey is diluted by exudate"
      },
      {
        name: "Enzymatic debriding agent (Collagenase/Santyl)",
        type: "Topical enzymatic debriding agent",
        action: "Contains collagenase enzyme derived from Clostridium histolyticum that selectively digests collagen in necrotic tissue (slough and eschar) without damaging healthy granulation tissue; facilitates autolytic debridement by breaking down the collagen matrix anchoring devitalized tissue to the wound bed",
        sideEffects: "Transient burning or pain at application site, erythema of surrounding skin, possible minor bleeding from newly exposed granulation tissue",
        contra: "Known hypersensitivity to collagenase; avoid concurrent use with silver-containing products, povidone-iodine, or acidic wound cleansers (these inactivate the enzyme); avoid use on wounds with exposed bone, tendon, or joint capsule without specialist guidance",
        pearl: "Apply a thin layer (approximately 2 mm) directly to necrotic tissue only; crosshatch eschar with a scalpel before application to improve enzyme penetration; do NOT use with silver dressings or Dakin solution as these inactivate collagenase; keep wound moist with appropriate secondary dressing"
      }
    ],
    pearls: [
      "MEASURE framework for wound assessment: Measure (L x W x D in cm), Exudate (amount, type, color, odor), Appearance (tissue types as percentages), Suffering (pain level), Undermining/tunneling (location and depth), Re-evaluate (compare to baseline), Edge condition (epithelialization, maceration, rolled edges)",
      "Wound measurement uses the clock method: length is head-to-toe (12 to 6 o'clock), width is side-to-side (3 to 9 o'clock), depth measured with sterile probe at deepest point -- always document in centimeters",
      "Stable dry eschar on heels should NOT be removed unless there are signs of infection (erythema, warmth, tenderness, fluctuance, drainage) -- dry eschar acts as the body's natural biological dressing",
      "Moist wound healing is evidence-based: wounds heal up to 50% faster in a moist environment compared to a dry environment; select dressings that maintain moisture balance",
      "Periwound maceration (white, soggy tissue around wound edges) indicates excessive moisture -- switch to a more absorbent dressing or increase dressing change frequency",
      "The Levine technique for wound culture provides the most accurate results: cleanse wound first, press and rotate swab on 1 cm2 of clean viable tissue with enough pressure to express fluid from the wound bed",
      "Always compare current wound measurements to previous assessments -- a wound that is not progressing within 2-4 weeks of appropriate care should be referred to a wound care specialist for re-evaluation"
    ],
    quiz: [
      {
        question: "A practical nurse is measuring a wound using the clock method. Which measurement represents the wound LENGTH?",
        options: [
          "From 3 o'clock to 9 o'clock (side to side)",
          "From 12 o'clock to 6 o'clock (head to toe)",
          "The deepest point measured with a sterile probe",
          "The circumference of the wound edges"
        ],
        correct: 1,
        rationale: "Using the clock method, wound length is measured from 12 o'clock to 6 o'clock (head-to-toe direction). Width is measured from 3 o'clock to 9 o'clock (side-to-side). Depth is measured by inserting a sterile probe at the deepest point."
      },
      {
        question: "During wound assessment, a practical nurse observes moist, red, bumpy tissue in the wound bed. This tissue is BEST described as:",
        options: [
          "Slough indicating devitalized tissue",
          "Eschar indicating necrotic tissue",
          "Granulation tissue indicating healthy healing",
          "Epithelial tissue indicating wound closure"
        ],
        correct: 2,
        rationale: "Granulation tissue is moist, red/pink, and has a bumpy (granular) appearance. It indicates healthy wound healing with new capillary and connective tissue formation. Slough is yellow/tan, eschar is black/brown and hard, and epithelial tissue is pink/silver at wound edges."
      },
      {
        question: "A practical nurse assesses a pressure injury on the heel with intact, dry, stable black eschar and no signs of infection. What is the MOST appropriate action?",
        options: [
          "Remove the eschar immediately through sharp debridement",
          "Apply enzymatic debriding agent to dissolve the eschar",
          "Leave the eschar intact and monitor for signs of infection",
          "Apply a moist dressing to soften the eschar for removal"
        ],
        correct: 2,
        rationale: "Stable, dry, intact eschar on heels should NOT be removed unless signs of infection develop (erythema, warmth, tenderness, fluctuance, drainage). Dry eschar serves as the body's natural biological dressing and provides protection to the underlying tissue."
      }
    ]
  }
};

let ok = 0;
let skip = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) ok++; else skip++;
}
console.log(`\nDone: ${ok} injected, ${skip} skipped`);
