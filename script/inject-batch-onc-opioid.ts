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
  "oncological-emergencies-rpn": {
    title: "Oncological Emergencies Awareness for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Oncological Emergencies",
      content: "Oncological emergencies are acute, life-threatening complications that arise either from the cancer itself or from its treatment. These emergencies require rapid recognition and immediate intervention to prevent irreversible organ damage or death. The four most critical oncological emergencies that practical nurses must recognize are tumor lysis syndrome (TLS), superior vena cava syndrome (SVCS), malignant spinal cord compression (MSCC), and hypercalcemia of malignancy. Tumor lysis syndrome occurs when large numbers of cancer cells are destroyed rapidly, most commonly within 12 to 72 hours after initiating chemotherapy for highly proliferative cancers such as acute leukemia or high-grade lymphomas. When tumor cells lyse, they release their intracellular contents into the bloodstream: potassium (causing hyperkalemia), phosphorus (causing hyperphosphatemia), uric acid (from nucleic acid breakdown), and nucleic acids. Hyperphosphatemia binds with calcium, causing secondary hypocalcemia. Uric acid crystallizes in the renal tubules, leading to acute kidney injury. The combination of hyperkalemia and hypocalcemia creates a high risk for fatal cardiac dysrhythmias. Superior vena cava syndrome results from compression or obstruction of the superior vena cava (SVC) by a mediastinal tumor, most commonly lung cancer or lymphoma. The SVC carries venous blood from the head, neck, upper extremities, and upper thorax back to the right atrium. When compressed, venous pressure increases dramatically in the upper body, causing facial and upper extremity edema, jugular venous distension, dyspnea, and in severe cases, cerebral edema and airway compromise. Malignant spinal cord compression occurs when a tumor (primary or metastatic) compresses the spinal cord or cauda equina. The most common primary sites that metastasize to the spine are breast, lung, and prostate cancers. Compression causes progressive neurological deficits beginning with back pain (often the first symptom), followed by motor weakness, sensory changes, and autonomic dysfunction including bladder and bowel incontinence. This is a true neurological emergency because once paraplegia develops, it is rarely reversible. Hypercalcemia of malignancy is the most common metabolic emergency in cancer patients, affecting up to 30 percent of patients with advanced disease. It occurs through three mechanisms: osteolytic metastases that directly destroy bone and release calcium, tumor secretion of parathyroid hormone-related protein (PTHrP) that mimics parathyroid hormone and increases calcium reabsorption, and tumor production of calcitriol (active vitamin D) that increases intestinal calcium absorption. Serum calcium levels above 12 mg/dL produce symptoms; levels above 14 mg/dL are severe and life-threatening. The practical nurse plays a critical role in early recognition of these emergencies through vigilant monitoring, accurate assessment documentation, and immediate reporting of concerning findings to the registered nurse or physician."
    },
    riskFactors: [
      "High tumor burden or rapidly proliferating cancers (leukemia, lymphoma, small cell lung cancer)",
      "Initiation of cytotoxic chemotherapy, radiation therapy, or immunotherapy within preceding 72 hours",
      "Pre-existing renal impairment (reduced ability to clear uric acid, potassium, and phosphorus)",
      "Dehydration or inadequate fluid intake (concentrates metabolic byproducts and electrolytes)",
      "Mediastinal mass or lung cancer near the superior vena cava (risk for SVCS)",
      "Known bone metastases from breast, lung, or prostate cancer (risk for spinal cord compression and hypercalcemia)",
      "Elevated baseline lactate dehydrogenase (LDH) indicating high cell turnover and increased TLS risk"
    ],
    diagnostics: [
      "Serum electrolytes panel: potassium (hyperkalemia in TLS), phosphorus (hyperphosphatemia), calcium (hypocalcemia in TLS or hypercalcemia of malignancy), magnesium; monitor every 6-8 hours during high-risk periods",
      "Serum uric acid level: elevated above 8 mg/dL indicates TLS risk; monitor before and after chemotherapy initiation",
      "Serum calcium (corrected for albumin): total calcium above 12 mg/dL is significant; ionized calcium is more accurate in hypoalbuminemia",
      "Renal function panel (BUN, creatinine, GFR): assess for acute kidney injury from uric acid crystallization or hypercalcemia-induced nephropathy",
      "CT scan of chest with contrast: gold standard for evaluating SVC obstruction and identifying the causative mass",
      "MRI of the spine: urgent imaging for suspected spinal cord compression; identifies level and extent of compression to guide treatment planning"
    ],
    management: [
      "Aggressive IV hydration with normal saline (0.9% NaCl) at 200-300 mL/hour as ordered to maintain urine output above 2 mL/kg/hour in TLS and to dilute calcium in hypercalcemia",
      "Administer rasburicase as prescribed for TLS prevention or treatment; this enzyme converts uric acid to allantoin which is readily excreted by the kidneys",
      "Administer dexamethasone as ordered for SVCS and spinal cord compression to reduce peritumoral edema and inflammatory swelling",
      "Administer zoledronic acid (bisphosphonate) IV over 15 minutes as prescribed for hypercalcemia of malignancy to inhibit osteoclast activity",
      "Maintain strict intake and output monitoring with goal urine output above 100 mL/hour during TLS management",
      "Elevate head of bed to 30-45 degrees for patients with SVCS to promote venous drainage from the head and reduce facial edema",
      "Prepare for emergency radiation therapy consultation for SVCS or spinal cord compression as these may require urgent intervention within 24 hours"
    ],
    nursingActions: [
      "Monitor serum potassium levels every 6 hours during TLS risk period and report values above 5.0 mEq/L immediately due to cardiac dysrhythmia risk",
      "Place patient on continuous cardiac monitoring during TLS management because hyperkalemia and hypocalcemia cause ECG changes (peaked T waves, widened QRS, prolonged QT)",
      "Assess neurological status every 2-4 hours in patients at risk for spinal cord compression: motor strength in all extremities, sensation, reflexes, bladder function, and bowel continence",
      "Report new-onset back pain in any cancer patient immediately as this may be the first sign of spinal cord compression and early treatment preserves function",
      "Monitor facial symmetry, neck circumference, and upper extremity edema in patients with mediastinal masses; report progressive swelling or stridor indicating SVCS",
      "Assess for signs of hypercalcemia: polyuria, polydipsia, constipation, muscle weakness, lethargy, confusion, nausea, and shortened QT interval on ECG",
      "Document and report all fluid intake and urine output hourly during active TLS management; calculate fluid balance every 4 hours to prevent fluid overload"
    ],
    assessmentFindings: [
      "TLS findings: muscle cramps, tetany (from hypocalcemia), nausea, vomiting, diarrhea, oliguria, flank pain, cardiac dysrhythmias, and seizures",
      "SVCS findings: facial plethora (redness and swelling), periorbital edema, distended neck and chest wall veins, dyspnea worsened by lying flat, cough, and hoarseness",
      "Spinal cord compression findings: progressive back pain (worse when lying down), motor weakness starting in lower extremities, saddle anesthesia, urinary retention, and loss of rectal tone",
      "Hypercalcemia findings: lethargy, confusion, muscle weakness, decreased deep tendon reflexes, polyuria, constipation, nausea, shortened QT on ECG, and coma in severe cases",
      "Acute kidney injury in TLS: decreased urine output below 0.5 mL/kg/hour, elevated creatinine, dark concentrated urine, peripheral edema",
      "ECG changes in TLS: peaked T waves (hyperkalemia), prolonged QT interval (hypocalcemia), widened QRS complex, and potential ventricular fibrillation",
      "Pemberton sign in SVCS: facial congestion and cyanosis worsening when patient raises both arms above the head simultaneously"
    ],
    signs: {
      left: [
        "Fatigue, malaise, and general weakness",
        "Nausea, vomiting, or decreased appetite",
        "Mild back pain or discomfort",
        "Subtle facial puffiness or periorbital edema",
        "Increased thirst and frequent urination (early hypercalcemia)",
        "Muscle twitching or cramping"
      ],
      right: [
        "Cardiac dysrhythmias or cardiac arrest (hyperkalemia in TLS)",
        "Seizures or loss of consciousness (severe TLS or hypercalcemia)",
        "Stridor or severe dyspnea (airway compromise in SVCS)",
        "Paraplegia or loss of bladder/bowel function (spinal cord compression)",
        "Oliguria or anuria (acute kidney injury from TLS)",
        "Coma (severe hypercalcemia with calcium above 14 mg/dL)"
      ]
    },
    medications: [
      {
        name: "Rasburicase (Elitek)",
        type: "Recombinant urate oxidase enzyme",
        action: "Converts uric acid to allantoin, a water-soluble compound that is 5-10 times more soluble than uric acid and is easily excreted by the kidneys, rapidly reducing serum uric acid levels within 4 hours of administration",
        sideEffects: "Hypersensitivity reactions (anaphylaxis), methemoglobinemia, hemolytic anemia in G6PD-deficient patients, fever, nausea, headache",
        contra: "Glucose-6-phosphate dehydrogenase (G6PD) deficiency (causes severe hemolytic anemia); history of anaphylaxis to rasburicase; pregnancy",
        pearl: "Blood samples for uric acid measurement must be placed on ice immediately and processed within 4 hours because rasburicase continues to degrade uric acid in the sample tube at room temperature, producing falsely low results"
      },
      {
        name: "Dexamethasone (Decadron)",
        type: "Corticosteroid (glucocorticoid)",
        action: "Reduces peritumoral edema and inflammation by stabilizing cell membranes, decreasing capillary permeability, and suppressing inflammatory cytokine production; in SVCS and spinal cord compression, this reduces swelling around the tumor to relieve pressure on adjacent structures",
        sideEffects: "Hyperglycemia (monitor blood glucose every 6 hours), immunosuppression and infection risk, GI irritation and peptic ulcer formation, insomnia, mood changes, fluid retention, adrenal suppression with prolonged use",
        contra: "Systemic fungal infections; active untreated infections; live vaccine administration during therapy; caution in diabetes mellitus and peptic ulcer disease",
        pearl: "Administer with food or proton pump inhibitor to prevent GI ulceration; taper gradually after prolonged use (more than 7 days) to prevent adrenal crisis; monitor blood glucose frequently as corticosteroids cause significant hyperglycemia even in non-diabetic patients"
      },
      {
        name: "Zoledronic Acid (Zometa)",
        type: "Bisphosphonate (osteoclast inhibitor)",
        action: "Binds to hydroxyapatite in bone and inhibits osteoclast-mediated bone resorption by inducing osteoclast apoptosis; reduces calcium release from bone into the bloodstream, lowering serum calcium levels over 24-72 hours",
        sideEffects: "Acute phase reaction (fever, myalgia, arthralgia within 24-72 hours of infusion), renal toxicity (monitor creatinine before each dose), osteonecrosis of the jaw (ONJ) with prolonged use, hypocalcemia, electrolyte disturbances",
        contra: "Severe renal impairment (creatinine clearance below 35 mL/min); hypocalcemia (correct before administration); pregnancy and breastfeeding",
        pearl: "Infuse IV over at least 15 minutes (rapid infusion increases renal toxicity risk); ensure patient is well-hydrated with normal saline before and after infusion; advise patients to have dental examination before starting therapy because ONJ risk increases with invasive dental procedures during treatment"
      }
    ],
    pearls: [
      "Tumor lysis syndrome is most common with hematologic malignancies (leukemia, lymphoma) that have high tumor burden and rapid cell turnover -- it typically occurs 12-72 hours after chemotherapy initiation",
      "The classic electrolyte pattern in TLS is: HIGH potassium, HIGH phosphorus, HIGH uric acid, LOW calcium -- remember this as 'three highs and one low'",
      "Superior vena cava syndrome is primarily a clinical diagnosis -- look for the triad of facial swelling, dyspnea, and dilated chest wall veins in any patient with a mediastinal mass",
      "Back pain is the earliest and most common symptom of malignant spinal cord compression -- any cancer patient reporting new or worsening back pain needs urgent neurological assessment and imaging",
      "Hypercalcemia of malignancy causes renal concentrating defect leading to polyuria, which causes dehydration, which worsens hypercalcemia -- this is a dangerous positive feedback cycle that requires aggressive IV hydration to break",
      "Blood samples for uric acid during rasburicase therapy must be placed on ICE immediately -- the enzyme continues to work in the tube at room temperature and will produce falsely low results",
      "The mnemonic 'Stones, Bones, Groans, and Psychiatric Overtones' helps remember hypercalcemia symptoms: kidney stones, bone pain, abdominal groaning (constipation/nausea), and confusion/lethargy"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient who began chemotherapy for acute leukemia 24 hours ago. The patient develops muscle cramping, nausea, and oliguria. Laboratory results show potassium 6.2 mEq/L, phosphorus 7.1 mg/dL, uric acid 12 mg/dL, and calcium 7.0 mg/dL. Which oncological emergency does this presentation suggest?",
        options: [
          "Superior vena cava syndrome",
          "Tumor lysis syndrome",
          "Hypercalcemia of malignancy",
          "Malignant spinal cord compression"
        ],
        correct: 1,
        rationale: "This presentation is classic tumor lysis syndrome (TLS): the timing (24 hours post-chemotherapy for acute leukemia), the electrolyte pattern (hyperkalemia, hyperphosphatemia, hyperuricemia, hypocalcemia), and the clinical findings (muscle cramps from hypocalcemia, oliguria from uric acid nephropathy) all point to TLS. The three highs and one low electrolyte pattern is the hallmark of TLS."
      },
      {
        question: "A patient with lung cancer reports new-onset severe back pain that worsens when lying down and progressive leg weakness over the past 48 hours. Which action by the practical nurse is the highest priority?",
        options: [
          "Administer prescribed analgesics and reassess pain in 30 minutes",
          "Report findings immediately to the physician as a potential spinal cord compression emergency",
          "Encourage the patient to perform range-of-motion exercises to maintain mobility",
          "Apply a heating pad to the patient's back and elevate the lower extremities"
        ],
        correct: 1,
        rationale: "New-onset back pain worsened by lying down combined with progressive motor weakness in a cancer patient is the classic presentation of malignant spinal cord compression (MSCC). This is a neurological emergency requiring immediate reporting because neurological deficits that progress to paraplegia are rarely reversible. Urgent MRI and treatment (dexamethasone and radiation) must be initiated within 24 hours."
      },
      {
        question: "The practical nurse is preparing to send a blood sample for uric acid level measurement in a patient receiving rasburicase for tumor lysis syndrome prevention. Which specimen handling instruction is essential?",
        options: [
          "Transport the sample at room temperature and process within 24 hours",
          "Place the sample on ice immediately and transport to the laboratory for processing within 4 hours",
          "Wrap the sample in aluminum foil to protect from light and refrigerate",
          "Allow the sample to sit at room temperature for 30 minutes before processing"
        ],
        correct: 1,
        rationale: "Rasburicase continues to degrade uric acid in the blood sample tube at room temperature, which produces falsely low uric acid results. The sample must be placed on ice immediately after collection and processed within 4 hours to obtain an accurate measurement. This is a critical nursing action specific to rasburicase therapy."
      }
    ]
  },

  "oncology-rpn": {
    title: "Cancer Pathophysiology and Staging for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Cancer and the TNM Staging System",
      content: "Cancer is a group of diseases characterized by uncontrolled proliferation of abnormal cells that have the ability to invade surrounding tissues and metastasize to distant sites. Normal cell growth is tightly regulated by proto-oncogenes (genes that promote cell growth), tumor suppressor genes (genes that inhibit cell growth), and apoptosis (programmed cell death). Cancer develops when mutations accumulate in these regulatory genes, transforming a proto-oncogene into an oncogene (permanently activated growth signal) or inactivating tumor suppressor genes (removing growth brakes). The most well-known tumor suppressor gene is p53, which is mutated in approximately 50 percent of all human cancers. The cell cycle consists of four phases: G1 (cell growth), S (DNA synthesis), G2 (preparation for division), and M (mitosis). Chemotherapy agents target cells at different phases of this cycle; understanding this is essential for safe drug administration. Cancer cells differ from normal cells in several key ways: they ignore growth-inhibiting signals, produce their own growth factors, avoid apoptosis, develop unlimited replicative potential (telomerase activation), induce angiogenesis (new blood vessel formation to supply the tumor), and acquire the ability to invade and metastasize. Metastasis occurs through a cascade of events: local invasion through the basement membrane, intravasation into blood or lymphatic vessels, survival in circulation, extravasation at a distant site, and colonization of the new tissue. Certain cancers have predictable metastatic patterns: breast cancer commonly metastasizes to bone, lung, liver, and brain; lung cancer to brain, bone, liver, and adrenal glands; colon cancer to the liver; and prostate cancer to bone. The TNM staging system is the universal language for describing cancer extent: T (Tumor) describes the primary tumor size and local invasion (T1-T4), N (Nodes) describes regional lymph node involvement (N0-N3), and M (Metastasis) indicates the presence or absence of distant metastasis (M0 or M1). Staging determines treatment options and prognosis. Cancer grading (G1-G4) describes how differentiated the cells appear under microscopy: G1 (well-differentiated, resembles normal tissue, better prognosis) to G4 (undifferentiated, aggressive, worse prognosis). Chemotherapy agents are classified by their mechanism: alkylating agents (damage DNA directly), antimetabolites (mimic normal cell building blocks), plant alkaloids (disrupt mitotic spindle), antitumor antibiotics (interfere with DNA replication), and targeted therapies (attack specific molecular targets). The practical nurse must understand chemotherapy safety principles including closed-system transfer devices (CSTDs) for drug preparation, personal protective equipment (PPE) requirements during administration, and safe handling of cytotoxic waste and patient body fluids for 48 hours after treatment. Radiation therapy uses ionizing radiation to damage cancer cell DNA; the practical nurse must understand time, distance, and shielding principles for radiation safety, and must recognize common side effects including skin reactions, fatigue, and site-specific complications."
    },
    riskFactors: [
      "Tobacco use (responsible for approximately 30 percent of all cancer deaths; linked to lung, oral, esophageal, bladder, and pancreatic cancers)",
      "Family history of cancer or known genetic mutations (BRCA1/BRCA2 for breast and ovarian cancer, Lynch syndrome for colorectal cancer)",
      "Prolonged exposure to ultraviolet radiation or ionizing radiation (melanoma, basal cell carcinoma, thyroid cancer)",
      "Chronic viral infections (HPV linked to cervical cancer, Hepatitis B and C linked to hepatocellular carcinoma, EBV linked to Burkitt lymphoma)",
      "Immunosuppression (organ transplant recipients and HIV/AIDS patients have increased risk for Kaposi sarcoma, lymphoma, and other cancers)",
      "Occupational exposure to carcinogens (asbestos linked to mesothelioma, benzene linked to leukemia, vinyl chloride linked to hepatic angiosarcoma)",
      "Obesity and sedentary lifestyle (associated with increased risk of breast, colon, endometrial, kidney, and esophageal cancers)"
    ],
    diagnostics: [
      "Complete blood count with differential: baseline assessment before chemotherapy; monitor for bone marrow suppression (neutropenia, anemia, thrombocytopenia) which is the most common dose-limiting toxicity",
      "Tumor markers: PSA (prostate cancer), CA-125 (ovarian cancer), CEA (colorectal cancer), AFP (hepatocellular and testicular), CA 19-9 (pancreatic cancer); used for monitoring treatment response, not definitive diagnosis",
      "Tissue biopsy with histopathology: the gold standard for cancer diagnosis; determines cell type, grade, and molecular markers that guide treatment selection",
      "CT scan with contrast (chest, abdomen, pelvis): primary imaging modality for staging; identifies tumor size, lymph node enlargement, and distant metastases",
      "PET scan (positron emission tomography): detects metabolically active cancer cells throughout the body; used for staging and monitoring treatment response; patient must fast 4-6 hours before scan and avoid strenuous exercise 24 hours prior",
      "Bone scan (nuclear scintigraphy): detects bone metastases; areas of increased uptake (hot spots) indicate active bone metabolism from tumor involvement"
    ],
    management: [
      "Administer chemotherapy agents as ordered using closed-system transfer devices (CSTDs) and full PPE (double chemotherapy-rated gloves, gown, eye protection, and N95 mask if aerosolization risk exists)",
      "Implement neutropenic precautions when absolute neutrophil count (ANC) falls below 1500 cells/mm3: private room, no fresh flowers or plants, no raw fruits or vegetables, strict hand hygiene for all visitors",
      "Administer prescribed antiemetics (ondansetron, dexamethasone) 30-60 minutes before chemotherapy to prevent chemotherapy-induced nausea and vomiting (CINV)",
      "Monitor for and manage chemotherapy extravasation: stop infusion immediately, aspirate residual drug, apply appropriate antidote (cold compress for most agents, warm compress for vinca alkaloids), notify physician immediately",
      "Implement radiation safety principles: minimize time near sealed radiation sources, maximize distance, use shielding when available; never touch a dislodged implant with bare hands",
      "Provide meticulous oral care (soft toothbrush, saline or bicarbonate rinses) to prevent and manage mucositis, a common side effect of chemotherapy and head/neck radiation",
      "Manage cancer-related fatigue through energy conservation techniques: prioritize activities, schedule rest periods, cluster nursing care to allow uninterrupted rest"
    ],
    nursingActions: [
      "Verify chemotherapy orders against two independent sources (order and protocol) including drug name, dose, route, rate, and patient identifiers before administration",
      "Monitor absolute neutrophil count (ANC) daily during chemotherapy: ANC = WBC x (percentage of neutrophils + percentage of bands) / 100; report ANC below 1000 immediately as this indicates severe neutropenia",
      "Assess for signs of infection in neutropenic patients: temperature above 38.3 degrees Celsius (100.9 degrees Fahrenheit) is a medical emergency requiring blood cultures and immediate broad-spectrum antibiotics",
      "Handle all chemotherapy waste, contaminated linens, and patient body fluids (urine, stool, emesis) with chemotherapy-rated gloves and gown for 48 hours after drug administration",
      "Monitor IV site every 15 minutes during vesicant chemotherapy administration for signs of extravasation: pain, burning, swelling, redness, or slowed infusion rate",
      "Assess skin integrity in radiation treatment fields daily: document erythema, desquamation, or moist desquamation; apply prescribed topical agents; never remove radiation field markings",
      "Provide psychosocial support and facilitate referrals to social work, palliative care, and cancer support groups; assess for depression and anxiety at each visit using validated screening tools"
    ],
    assessmentFindings: [
      "General cancer warning signs (CAUTION): Change in bowel or bladder habits, A sore that does not heal, Unusual bleeding or discharge, Thickening or lump, Indigestion or difficulty swallowing, Obvious change in wart or mole, Nagging cough or hoarseness",
      "Chemotherapy-induced bone marrow suppression: fatigue and pallor (anemia), petechiae and bruising (thrombocytopenia), fever and infection (neutropenia) -- nadir typically occurs 7-14 days after chemotherapy",
      "Mucositis: oral pain, difficulty swallowing, erythema and ulceration of oral mucosa, usually developing 5-10 days after chemotherapy initiation",
      "Chemotherapy-induced peripheral neuropathy: numbness, tingling, or burning in hands and feet (stocking-glove distribution), decreased grip strength, difficulty with fine motor tasks",
      "Tumor lysis syndrome risk indicators: elevated LDH, elevated uric acid, elevated potassium, elevated phosphorus, decreased calcium; most common in hematologic malignancies",
      "Radiation skin reactions: erythema (like sunburn), dry desquamation (flaking skin), moist desquamation (blistering, weeping skin), and in severe cases, necrosis",
      "Cancer cachexia: progressive weight loss exceeding 5 percent in 6 months, muscle wasting, anorexia, fatigue, and elevated inflammatory markers"
    ],
    signs: {
      left: [
        "Unexplained fatigue persisting beyond 2 weeks",
        "Unintentional weight loss exceeding 5 percent in 6 months",
        "Persistent low-grade fever without identified infection source",
        "New-onset night sweats",
        "Mild nausea or decreased appetite during treatment",
        "Skin changes in radiation field (mild erythema)"
      ],
      right: [
        "Febrile neutropenia (temperature above 38.3 degrees Celsius with ANC below 1000)",
        "Chemotherapy extravasation with tissue necrosis",
        "Massive hemorrhage from thrombocytopenia (platelet count below 20,000)",
        "Tumor lysis syndrome (cardiac dysrhythmias from hyperkalemia)",
        "Superior vena cava syndrome (facial edema, stridor, dyspnea)",
        "Spinal cord compression (progressive motor weakness, urinary retention)"
      ]
    },
    medications: [
      {
        name: "Ondansetron (Zofran)",
        type: "Antiemetic (5-HT3 receptor antagonist)",
        action: "Selectively blocks serotonin (5-HT3) receptors in the chemoreceptor trigger zone and on vagal nerve terminals in the gastrointestinal tract, preventing chemotherapy-induced nausea and vomiting by interrupting the emetic reflex arc",
        sideEffects: "Headache (most common), constipation, dizziness, dose-dependent QT prolongation on ECG, transient elevation of liver enzymes",
        contra: "Congenital long QT syndrome; concurrent use with apomorphine; caution with other QT-prolonging medications and in patients with electrolyte imbalances (hypokalemia, hypomagnesemia)",
        pearl: "Administer 30 minutes before chemotherapy for maximum effectiveness; maximum single IV dose is 16 mg to minimize QT prolongation risk; most effective when combined with dexamethasone for moderate-to-high emetogenic chemotherapy regimens"
      },
      {
        name: "Filgrastim (Neupogen)",
        type: "Granulocyte colony-stimulating factor (G-CSF)",
        action: "Stimulates the bone marrow to produce and release neutrophils by binding to G-CSF receptors on neutrophil precursor cells, accelerating their maturation and release into the bloodstream; reduces the duration and severity of chemotherapy-induced neutropenia",
        sideEffects: "Bone pain (most common, occurs in 20-30 percent of patients from bone marrow expansion), injection site reactions, splenic enlargement (rare rupture risk), leukocytosis, headache, fatigue",
        contra: "Known hypersensitivity to filgrastim or E. coli-derived proteins; do not administer within 24 hours before or after chemotherapy (the rapidly dividing neutrophil precursors would be killed by the chemotherapy)",
        pearl: "Administered as subcutaneous injection; bone pain is managed with acetaminophen or NSAIDs; monitor CBC with differential to assess response; discontinue when ANC recovers above 10,000 after the expected nadir; do not shake the vial as this denatures the protein"
      },
      {
        name: "Dexamethasone (Decadron)",
        type: "Corticosteroid (glucocorticoid)",
        action: "Potent anti-inflammatory and immunosuppressive effects; in oncology, used as an antiemetic adjunct (enhances 5-HT3 antagonist effectiveness), to reduce peritumoral edema in brain and spinal cord metastases, and as a component of lymphoma treatment protocols",
        sideEffects: "Hyperglycemia (check blood glucose every 6 hours), immunosuppression and increased infection risk, GI irritation and peptic ulcer risk, insomnia, mood lability, fluid retention, muscle weakness with prolonged use, adrenal suppression",
        contra: "Systemic fungal infections; active untreated infections; live vaccine administration; caution in diabetes mellitus, peptic ulcer disease, osteoporosis, and psychiatric conditions",
        pearl: "When used as an antiemetic, give before chemotherapy and for 2-3 days after; always administer with food or a proton pump inhibitor to protect gastric mucosa; taper gradually after more than 7 days of use to prevent adrenal crisis; monitor for oral candidiasis (thrush) during prolonged therapy"
      }
    ],
    pearls: [
      "The CAUTION mnemonic for cancer warning signs: Change in bowel/bladder habits, A sore that does not heal, Unusual bleeding/discharge, Thickening/lump, Indigestion/difficulty swallowing, Obvious change in wart/mole, Nagging cough/hoarseness",
      "Nadir is the lowest point of blood cell counts after chemotherapy, typically occurring 7-14 days after treatment -- this is when the patient is most vulnerable to infection, bleeding, and anemia",
      "Febrile neutropenia (temperature above 38.3 degrees Celsius with ANC below 1000) is a medical emergency -- obtain blood cultures and begin broad-spectrum antibiotics within ONE HOUR of recognition",
      "Chemotherapy extravasation of vesicant drugs causes tissue necrosis -- stop the infusion immediately, aspirate residual drug, and apply the correct antidote (cold for most agents, WARM for vinca alkaloids and epipodophyllotoxins)",
      "Handle all body fluids from chemotherapy patients as cytotoxic waste for 48 hours after treatment -- use chemotherapy-rated double gloves and gowns; flush the toilet twice with the lid down",
      "Never apply tape, adhesive, deodorant, lotion, or extreme temperatures to skin within a radiation treatment field -- these can intensify radiation dermatitis and compromise treatment delivery",
      "TNM staging: T describes tumor size (T1=small to T4=large/invasive), N describes lymph node involvement (N0=none to N3=extensive), M describes distant metastasis (M0=none, M1=present) -- higher numbers indicate more advanced disease"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient receiving chemotherapy. The laboratory results show WBC 2,100 cells/mm3 with 40 percent neutrophils and 5 percent bands. What is the absolute neutrophil count (ANC) and what does it indicate?",
        options: [
          "ANC is 945 cells/mm3, indicating severe neutropenia requiring immediate protective isolation",
          "ANC is 2,100 cells/mm3, indicating a normal immune status",
          "ANC is 840 cells/mm3, indicating mild neutropenia requiring hand hygiene only",
          "ANC is 1,500 cells/mm3, indicating borderline neutropenia requiring monitoring only"
        ],
        correct: 0,
        rationale: "ANC = WBC x (percentage of neutrophils + percentage of bands) / 100 = 2,100 x (40 + 5) / 100 = 2,100 x 0.45 = 945 cells/mm3. An ANC below 1,000 indicates severe neutropenia, and the patient requires immediate neutropenic precautions including private room, no fresh flowers or raw foods, strict hand hygiene, and monitoring for any signs of infection."
      },
      {
        question: "During administration of a vesicant chemotherapy agent, the practical nurse notices the patient reports burning pain at the IV site, and the area appears swollen with slowed infusion rate. What is the priority action?",
        options: [
          "Apply a warm compress to the site and continue the infusion at a slower rate",
          "Flush the IV line with normal saline to verify patency before continuing",
          "Stop the infusion immediately, aspirate residual drug from the catheter, and notify the physician",
          "Increase the infusion rate to complete the treatment and then assess the site"
        ],
        correct: 2,
        rationale: "These findings (pain, burning, swelling, slowed rate) indicate chemotherapy extravasation -- leakage of the vesicant agent into surrounding tissue. The priority is to stop the infusion immediately to prevent further tissue damage, aspirate any residual drug from the catheter, and notify the physician. Vesicant extravasation causes tissue necrosis that can require surgical debridement if not managed promptly."
      },
      {
        question: "A practical nurse is caring for a patient who completed chemotherapy 12 hours ago. The patient's family member asks to help the patient to the bathroom. Which instruction should the nurse provide regarding safety precautions?",
        options: [
          "No special precautions are needed because the chemotherapy has already been infused",
          "Wear chemotherapy-rated gloves when handling any body fluids and flush the toilet twice with the lid down",
          "Only urine requires special handling; other body fluids are safe to handle without gloves",
          "Wait until 24 hours after treatment before allowing the patient to use the bathroom"
        ],
        correct: 1,
        rationale: "Chemotherapy drugs and their metabolites are excreted in body fluids (urine, stool, emesis, sweat) for up to 48 hours after treatment. All body fluids must be handled as cytotoxic waste during this period. The family member should wear chemotherapy-rated gloves when assisting with any body fluid contact, and the toilet should be flushed twice with the lid down to minimize aerosolization of cytotoxic waste."
      }
    ]
  },

  "opioid-overdose-rpn": {
    title: "Opioid Overdose Recognition and Response for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Opioid Overdose",
      content: "Opioid overdose is a life-threatening medical emergency caused by excessive activation of mu-opioid receptors in the central nervous system, resulting in profound respiratory depression, central nervous system depression, and cardiovascular collapse. Opioids include both prescription medications (morphine, hydromorphone, oxycodone, fentanyl, codeine, methadone) and illicit substances (heroin, illicitly manufactured fentanyl). Opioids exert their effects by binding to three primary receptor types: mu receptors (responsible for analgesia, euphoria, respiratory depression, and miosis), kappa receptors (analgesia, sedation, dysphoria), and delta receptors (analgesia, mood modulation). In overdose, excessive mu receptor activation in the brainstem respiratory centers (the pre-Botzinger complex and the nucleus tractus solitarius) suppresses the medullary response to rising CO2 levels, causing the respiratory drive to diminish and eventually cease. Normal breathing is driven by chemoreceptors that detect elevated carbon dioxide (PaCO2) in the blood; opioids raise the threshold at which these chemoreceptors trigger a breath, meaning higher and higher CO2 levels are required to stimulate breathing until the threshold becomes unreachable and apnea occurs. The classic opioid toxidrome consists of three clinical findings: pinpoint pupils (miosis from parasympathetic stimulation of the Edinger-Westphal nucleus), respiratory depression (rate below 12 breaths per minute progressing to apnea), and decreased level of consciousness (ranging from sedation to unresponsiveness). As respiratory depression progresses, hypoxemia develops, which in turn causes hypoxic brain injury, cardiac dysrhythmias, and eventually cardiac arrest if not reversed. The progression from respiratory depression to death can occur within minutes, particularly with potent synthetic opioids like fentanyl (which is 50-100 times more potent than morphine) and carfentanil (10,000 times more potent than morphine). Naloxone (Narcan) is the specific antidote for opioid overdose. It is a competitive antagonist that binds to opioid receptors with higher affinity than most opioids, displacing the opioid molecule and rapidly reversing respiratory depression. The critical clinical consideration with naloxone is that its duration of action (30-90 minutes) is often shorter than the duration of many opioids (especially long-acting agents like methadone with a half-life of 24-36 hours), creating a risk for renarcotization -- the return of opioid toxicity after naloxone wears off. This is why patients who receive naloxone must be monitored for a minimum of 2 hours and potentially much longer depending on the opioid involved. Additionally, naloxone administration in opioid-dependent individuals can precipitate acute withdrawal syndrome, which while extremely uncomfortable, is not life-threatening in most cases. However, in rare instances, abrupt reversal can cause acute pulmonary edema or severe sympathetic activation."
    },
    riskFactors: [
      "History of opioid use disorder or previous overdose (the strongest single predictor of future overdose)",
      "Recent opioid dose escalation or return to use after a period of abstinence (tolerance is lost rapidly during abstinence)",
      "Concurrent use of benzodiazepines, alcohol, or other CNS depressants (synergistic respiratory depression dramatically increases overdose risk)",
      "Use of illicit opioids contaminated with fentanyl or its analogs (potency is unpredictable and lethal doses are microscopic)",
      "Chronic obstructive pulmonary disease, sleep apnea, or other respiratory compromise (reduced baseline respiratory reserve)",
      "Advanced age (decreased hepatic and renal clearance of opioids, increased receptor sensitivity)",
      "Recent hospital discharge or release from incarceration (loss of tolerance combined with access to usual pre-abstinence doses)"
    ],
    diagnostics: [
      "Arterial blood gas (ABG): reveals respiratory acidosis (elevated PaCO2 above 45 mmHg, decreased pH below 7.35) from hypoventilation; PaO2 decreased indicating hypoxemia",
      "Continuous pulse oximetry: SpO2 monitoring detects desaturation; however, SpO2 may remain normal initially despite dangerous hypoventilation if supplemental oxygen is being administered -- respiratory rate is a more reliable early indicator",
      "Urine drug screen (immunoassay): detects opioid metabolites; note that synthetic opioids (fentanyl, methadone, tramadol) may NOT be detected on standard urine drug screens and require specific testing",
      "Serum glucose: rule out hypoglycemia as a cause of altered consciousness; always check glucose in any patient with altered mental status",
      "Basic metabolic panel: assess renal function, electrolytes, and acid-base status; prolonged immobilization during overdose can cause rhabdomyolysis with elevated creatinine and potassium",
      "Creatine kinase (CK): elevated in rhabdomyolysis from prolonged immobilization during overdose; levels above 5,000 U/L indicate significant muscle breakdown with acute kidney injury risk"
    ],
    management: [
      "Administer naloxone (Narcan) immediately when opioid overdose is suspected: initial dose 0.4-2 mg IV, IM, SC, or intranasal; may repeat every 2-3 minutes up to 10 mg total; titrate to restore adequate breathing (respiratory rate above 12) rather than full consciousness",
      "Establish and maintain airway: head-tilt chin-lift, jaw thrust if spinal injury suspected; insert oropharyngeal airway if patient has no gag reflex; prepare for bag-valve-mask ventilation",
      "Provide rescue breathing with bag-valve-mask at rate of 10-12 breaths per minute if respiratory rate is below 8 or SpO2 is below 90 percent while waiting for naloxone to take effect",
      "Position patient in the recovery position (lateral decubitus) if unconscious but breathing adequately to prevent aspiration of vomitus",
      "Establish IV access and administer normal saline bolus for hypotension; avoid vasopressors as first-line therapy -- most hypotension resolves with naloxone and fluid resuscitation",
      "Monitor continuously for renarcotization for minimum 2 hours after last naloxone dose (longer for long-acting opioids like methadone -- monitor for 24 hours minimum)",
      "Obtain 12-lead ECG to assess for QT prolongation (methadone), cardiac ischemia from prolonged hypoxia, or dysrhythmias"
    ],
    nursingActions: [
      "Assess and document the opioid toxidrome triad: pinpoint pupils (miosis), respiratory depression (rate below 12 breaths/minute), and decreased level of consciousness -- the presence of all three strongly suggests opioid overdose",
      "Monitor respiratory rate, depth, and pattern every 5 minutes during acute management and every 15 minutes for 2 hours after naloxone administration; respiratory rate is the most sensitive indicator of opioid toxicity",
      "Administer naloxone as ordered and titrate to effect: the goal is adequate breathing (respiratory rate above 12 breaths/minute), NOT full alertness -- over-reversal precipitates severe withdrawal, vomiting, and aspiration risk",
      "Monitor for signs of renarcotization after naloxone wears off (typically 30-90 minutes): return of sedation, decreasing respiratory rate, pinpoint pupils -- naloxone may need to be re-dosed",
      "Assess for complications of prolonged immobilization: rhabdomyolysis (dark brown urine, muscle tenderness), pressure injuries, compartment syndrome (tense swelling, pain with passive stretch), and hypothermia",
      "Maintain a non-judgmental therapeutic relationship; provide overdose prevention education and naloxone take-home kit information when the patient is stable and receptive",
      "Document the time of naloxone administration, dose, route, and the patient's response (respiratory rate, SpO2, level of consciousness, pupil size) at baseline and at 5, 15, 30, 60, and 120 minutes after each dose"
    ],
    assessmentFindings: [
      "Classic opioid toxidrome: pinpoint pupils (miosis), respiratory rate below 12 breaths per minute (may progress to apnea), decreased level of consciousness (drowsiness to unresponsiveness)",
      "Cyanosis: bluish discoloration of lips, nail beds, and mucous membranes indicating significant hypoxemia (SpO2 typically below 85 percent)",
      "Hypotension and bradycardia: opioids decrease sympathetic tone and cause peripheral vasodilation; systolic blood pressure may fall below 90 mmHg",
      "Pulmonary edema: bilateral crackles on auscultation, pink frothy sputum; can occur as a direct opioid effect or as a complication of naloxone-induced reversal",
      "Hypothermia: body temperature below 36 degrees Celsius from prolonged immobilization and opioid-mediated impairment of thermoregulation",
      "Absent or diminished bowel sounds: opioids cause smooth muscle relaxation and decreased gastrointestinal motility",
      "Needle track marks, skin popping scars, or nasal septal perforation: may indicate route of opioid administration and chronicity of use"
    ],
    signs: {
      left: [
        "Drowsiness and difficulty staying awake",
        "Slowed speech and delayed responses",
        "Constricted (pinpoint) pupils",
        "Mild nausea or vomiting",
        "Slight decrease in respiratory rate (12-16 breaths per minute)",
        "Constipation and decreased bowel sounds"
      ],
      right: [
        "Respiratory rate below 8 breaths per minute or apnea",
        "Unresponsiveness to verbal or painful stimuli (GCS 3-6)",
        "Cyanosis of lips and extremities (SpO2 below 85 percent)",
        "Agonal breathing (gasping, irregular respirations before cessation)",
        "Cardiac arrest (pulseless electrical activity or asystole)",
        "Pulmonary edema (pink frothy sputum, bilateral crackles)"
      ]
    },
    medications: [
      {
        name: "Naloxone (Narcan)",
        type: "Opioid antagonist (competitive mu-receptor antagonist)",
        action: "Competitively binds to mu, kappa, and delta opioid receptors with higher affinity than most opioids, displacing opioid molecules and rapidly reversing respiratory depression, sedation, and hypotension within 1-2 minutes IV or 3-5 minutes IM/intranasal",
        sideEffects: "Acute opioid withdrawal syndrome in dependent individuals (agitation, vomiting, diarrhea, tachycardia, diaphoresis, piloerection), rare acute pulmonary edema, hypertension, ventricular dysrhythmias from sudden sympathetic surge",
        contra: "Known hypersensitivity to naloxone (rare); use with caution in patients with known cardiac disease (abrupt reversal can precipitate sympathetic surge); use with extreme caution in neonates of opioid-dependent mothers",
        pearl: "Duration of action is only 30-90 minutes -- shorter than most opioids -- so patients MUST be monitored for renarcotization; titrate to respiratory rate above 12, not full alertness, to minimize withdrawal severity; intranasal formulation (4 mg spray) is available for community and first-responder use"
      },
      {
        name: "Activated Charcoal",
        type: "Adsorbent / gastrointestinal decontaminant",
        action: "Binds to ingested substances in the gastrointestinal tract through adsorption, forming a charcoal-drug complex that is not absorbed systemically and is eliminated in the stool; most effective when administered within 1-2 hours of ingestion",
        sideEffects: "Black stools (expected, not harmful), vomiting (can cause aspiration if patient has impaired consciousness or absent gag reflex), constipation, bowel obstruction (rare)",
        contra: "Decreased level of consciousness without protected airway (high aspiration risk); ingestion of corrosive substances (acids, alkalis); ileus or bowel obstruction; substances not adsorbed by charcoal (lithium, iron, alcohols, cyanide, potassium)",
        pearl: "NEVER administer to a patient with decreased consciousness or absent gag reflex without a protected airway (endotracheal intubation) due to aspiration risk; in opioid overdose, charcoal is only useful for recent oral opioid ingestion and must be given early; it does not adsorb opioids administered by injection, inhalation, or transdermal routes"
      },
      {
        name: "Atropine",
        type: "Anticholinergic (muscarinic receptor antagonist)",
        action: "Blocks acetylcholine at muscarinic receptors in the heart, increasing heart rate by removing vagal (parasympathetic) tone on the sinoatrial node; used in opioid overdose when symptomatic bradycardia persists despite naloxone administration",
        sideEffects: "Tachycardia (dose-related), dry mouth, urinary retention, blurred vision, mydriasis, hyperthermia, delirium in elderly patients (anticholinergic toxicity)",
        contra: "Acute angle-closure glaucoma; obstructive uropathy; myasthenia gravis (worsens muscle weakness); tachyarrhythmias (further increases rate); use with caution in patients with coronary artery disease",
        pearl: "In opioid overdose, bradycardia usually resolves with naloxone alone; atropine is reserved for persistent symptomatic bradycardia (heart rate below 50 with hypotension or hemodynamic instability); standard dose is 0.5 mg IV, may repeat every 3-5 minutes to a maximum of 3 mg total"
      }
    ],
    pearls: [
      "The opioid toxidrome triad is: pinpoint pupils (miosis) + respiratory depression + decreased level of consciousness -- if all three are present, treat as opioid overdose and administer naloxone immediately",
      "Respiratory rate is the MOST SENSITIVE early indicator of opioid toxicity -- a rate below 12 breaths per minute in a patient receiving opioids requires immediate assessment and possible intervention, even if SpO2 is still normal",
      "Naloxone duration of action (30-90 minutes) is SHORTER than most opioids -- always monitor for renarcotization for at least 2 hours after naloxone administration; methadone overdose requires monitoring for 24 hours minimum",
      "Titrate naloxone to restore adequate breathing (respiratory rate above 12), NOT to full consciousness -- over-reversal in opioid-dependent patients causes severe withdrawal, projectile vomiting, and aspiration risk",
      "Fentanyl is 50-100 times more potent than morphine and may require HIGHER or REPEATED doses of naloxone for effective reversal; fentanyl is not reliably detected on standard urine drug screens",
      "After stabilization, offer overdose prevention education, naloxone take-home kits, and referral to substance use treatment -- overdose is a teachable moment and a critical opportunity for harm reduction intervention",
      "The recovery position (left lateral decubitus) protects the airway in unconscious patients who are breathing adequately by allowing vomitus to drain from the mouth rather than being aspirated into the lungs"
    ],
    quiz: [
      {
        question: "A practical nurse finds a patient unresponsive with pinpoint pupils, a respiratory rate of 4 breaths per minute, and SpO2 of 78 percent. Naloxone 0.4 mg IV is administered. After 3 minutes, the respiratory rate increases to 14 breaths per minute and SpO2 is 95 percent, but the patient remains drowsy. What is the most appropriate next action?",
        options: [
          "Administer another dose of naloxone to achieve full alertness",
          "Continue monitoring respiratory rate, SpO2, and level of consciousness every 15 minutes for at least 2 hours",
          "Discontinue monitoring since the naloxone has reversed the overdose",
          "Administer a stimulant medication to improve the patient's alertness"
        ],
        correct: 1,
        rationale: "The naloxone has achieved its goal: adequate respiratory function (rate above 12 breaths/minute, SpO2 above 92%). The patient does not need to be fully alert. The critical next step is continued monitoring for renarcotization because naloxone's duration (30-90 minutes) may be shorter than the opioid's duration. Administering more naloxone to achieve full alertness risks precipitating severe withdrawal with vomiting and aspiration."
      },
      {
        question: "A patient who received naloxone for opioid overdose 45 minutes ago begins to show decreasing respiratory rate (from 16 to 10 breaths per minute), increasing drowsiness, and pupil constriction. What does this clinical picture indicate?",
        options: [
          "The patient is experiencing a new medical emergency unrelated to the overdose",
          "Renarcotization is occurring as the naloxone wears off and the opioid effects are returning",
          "The patient is experiencing naloxone side effects that will resolve spontaneously",
          "The patient is developing opioid withdrawal syndrome"
        ],
        correct: 1,
        rationale: "Renarcotization occurs when naloxone wears off (duration 30-90 minutes) but the opioid is still present in the body. The return of the classic opioid toxidrome (respiratory depression, sedation, miosis) 45 minutes after naloxone administration is textbook renarcotization. The patient requires re-dosing of naloxone and extended monitoring. This is why patients must be observed for at least 2 hours after naloxone."
      },
      {
        question: "Which assessment finding is the MOST SENSITIVE early indicator of opioid toxicity in a hospitalized patient receiving IV morphine for pain management?",
        options: [
          "Pinpoint pupils",
          "Decreasing respiratory rate",
          "Decreasing oxygen saturation on pulse oximetry",
          "Hypotension"
        ],
        correct: 1,
        rationale: "Respiratory rate is the most sensitive early indicator of opioid toxicity because opioids suppress the medullary respiratory centers before causing significant changes in oxygen saturation, blood pressure, or other parameters. SpO2 may remain normal initially despite dangerous hypoventilation, especially if the patient is receiving supplemental oxygen. A declining respiratory rate should prompt immediate assessment and potential intervention before other signs of overdose develop."
      }
    ]
  },

  "opioid-safety-rpn": {
    title: "Opioid Safety and Monitoring for Practical Nurses",
    cellular: {
      title: "Pharmacology and Safety Principles of Opioid Therapy",
      content: "Opioid analgesics are the cornerstone of moderate to severe pain management, but their narrow therapeutic index and significant adverse effect profile require meticulous nursing monitoring to ensure patient safety. Understanding the pharmacological principles of opioid therapy is essential for every practical nurse involved in pain management. Opioids produce analgesia by binding to mu receptors in the dorsal horn of the spinal cord and in the periaqueductal gray matter of the brainstem, modifying both the transmission and the perception of pain signals. The concept of equianalgesic dosing is fundamental to safe opioid therapy. Equianalgesic tables provide conversion ratios between different opioids, allowing clinicians to switch from one agent to another while maintaining equivalent pain relief. The reference standard is morphine 10 mg IV or 30 mg PO, against which all other opioids are compared. For example, hydromorphone (Dilaudid) is approximately 5-7 times more potent than morphine (hydromorphone 1.5 mg IV is equianalgesic to morphine 10 mg IV), making dosing errors with hydromorphone potentially fatal. When converting between opioids, a dose reduction of 25-50 percent from the calculated equianalgesic dose is standard practice to account for incomplete cross-tolerance, meaning that tolerance developed to one opioid does not fully transfer to another. The Pasero Opioid-Induced Sedation Scale (POSS) and the Richmond Agitation-Sedation Scale (RASS) are validated tools for monitoring sedation levels in patients receiving opioids. The POSS uses a scale from S (sleep, easy to arouse) to 4 (somnolent, minimal or no response), with level 3 (frequent drowsiness, arousable, drifts off during conversation) being the level at which nursing intervention is required. The RASS ranges from +4 (combative) to -5 (unarousable), with -3 or lower in a patient receiving opioids indicating excessive sedation requiring dose reduction or naloxone consideration. Sedation always precedes respiratory depression in opioid toxicity; therefore, sedation level monitoring is the most proactive safety measure. Opioid tolerance develops with repeated exposure: the same dose produces less analgesic effect over time, requiring dose escalation to maintain pain relief. Physical dependence is an expected physiological adaptation that causes withdrawal symptoms upon abrupt discontinuation; it is NOT the same as addiction. Addiction (opioid use disorder) is a neurobiological disease characterized by compulsive use despite harm, loss of control, and continued use despite negative consequences. The practical nurse must understand these distinctions to avoid undertreating pain due to unfounded fears of addiction. Respiratory monitoring protocols require assessment of respiratory rate, depth, and pattern, as well as sedation level, at minimum every 1-2 hours for the first 24 hours of opioid therapy, after any dose increase, and after route changes. Patients at highest risk for opioid-induced respiratory depression include those with sleep apnea, obesity (BMI above 35), concurrent benzodiazepine use, advanced age (above 65 years), renal impairment (decreased opioid clearance), and those who are opioid-naive (no recent opioid exposure). Naloxone must be immediately available at the bedside or unit level whenever opioids are administered."
    },
    riskFactors: [
      "Opioid-naive status (no recent opioid exposure within the past 7 days increases sensitivity to respiratory depression)",
      "Concurrent use of benzodiazepines, sedative-hypnotics, or other CNS depressants (FDA boxed warning for synergistic respiratory depression)",
      "Obstructive sleep apnea or obesity hypoventilation syndrome (baseline respiratory compromise amplified by opioid effects)",
      "Advanced age above 65 years (decreased hepatic metabolism, reduced renal clearance, increased receptor sensitivity)",
      "Renal impairment (accumulation of active metabolites, particularly morphine-6-glucuronide which is more potent than morphine itself)",
      "Hepatic impairment (decreased first-pass metabolism leads to higher bioavailability and prolonged drug half-life)",
      "History of substance use disorder (increased risk of misuse, diversion, and overdose; does NOT mean the patient should be denied pain treatment)"
    ],
    diagnostics: [
      "Pasero Opioid-Induced Sedation Scale (POSS): S = sleep/easy to arouse, 1 = awake/alert, 2 = slightly drowsy/easily aroused, 3 = frequently drowsy/arousable but drifts off (UNACCEPTABLE -- intervene), 4 = somnolent/minimal response (EMERGENCY)",
      "Richmond Agitation-Sedation Scale (RASS): ranges from +4 (combative) through 0 (alert/calm) to -5 (unarousable); in opioid therapy, RASS of -3 or lower indicates excessive sedation requiring immediate dose reduction or reversal",
      "Pain assessment tools: Numeric Rating Scale (NRS 0-10), Wong-Baker FACES scale (pediatric/nonverbal), FLACC scale (infants/young children), CPOT or BPS (critically ill/intubated patients)",
      "End-tidal CO2 monitoring (capnography): most reliable continuous monitoring for respiratory depression; elevated ETCO2 above 50 mmHg indicates hypoventilation before SpO2 changes",
      "Renal function panel (BUN, creatinine, GFR): essential before initiating morphine therapy because active metabolite morphine-6-glucuronide accumulates in renal impairment",
      "Hepatic function tests (AST, ALT, INR, albumin): impaired liver function decreases opioid metabolism and increases drug half-life, requiring dose adjustments"
    ],
    management: [
      "Start opioid-naive patients at the lowest effective dose and titrate gradually (start low, go slow); typical starting dose for opioid-naive adults: morphine 2-4 mg IV or 10-15 mg PO",
      "Apply equianalgesic dosing tables when converting between opioids and ALWAYS reduce the calculated equianalgesic dose by 25-50 percent to account for incomplete cross-tolerance",
      "Implement multimodal analgesia: combine opioids with non-opioid analgesics (acetaminophen, NSAIDs, gabapentin) and non-pharmacological methods (ice, positioning, relaxation) to reduce opioid requirements",
      "Administer prescribed bowel regimen prophylactically with all opioid orders: stimulant laxative (senna) plus stool softener (docusate) because tolerance does NOT develop to opioid-induced constipation",
      "Maintain naloxone accessibility: ensure naloxone is readily available at the bedside or unit level for any patient receiving opioids; know the location, dose, and route for your unit",
      "Implement fall prevention measures: opioids cause dizziness, sedation, and orthostatic hypotension; assess fall risk at each shift and after each dose change",
      "For patients on patient-controlled analgesia (PCA): verify correct programming with a second nurse (drug, concentration, demand dose, lockout interval, continuous rate if applicable); only the PATIENT should press the PCA button (family-activated dosing bypasses the safety of sedation-limited demand)"
    ],
    nursingActions: [
      "Assess and document respiratory rate, depth, quality, sedation level (POSS or RASS), and pain level before EVERY opioid dose and at peak effect (15-30 minutes after IV, 60 minutes after PO)",
      "Hold opioid administration and notify the physician if respiratory rate is below 12 breaths per minute, POSS is 3 or higher, or RASS is -3 or lower",
      "Verify two patient identifiers, drug name, dose, route, and timing against the medication order before each opioid administration; opioids are high-alert medications requiring independent double-check at many facilities",
      "Monitor bowel function daily: document last bowel movement, administer prophylactic bowel regimen as ordered; opioid-induced constipation is the most common persistent side effect and does NOT resolve with continued use",
      "Educate patients to report any of the following immediately: difficulty breathing, excessive drowsiness, dizziness, itching, nausea, or difficulty urinating",
      "Count and reconcile controlled substance inventory at every shift change per facility policy; document waste with a witness; report any discrepancies immediately",
      "Assess for signs of opioid withdrawal in patients who have been receiving opioids regularly and whose therapy is being tapered or discontinued: yawning, rhinorrhea, piloerection, lacrimation, diaphoresis, tachycardia, abdominal cramping, diarrhea"
    ],
    assessmentFindings: [
      "Adequate pain control with acceptable sedation: patient reports pain at tolerable level (typically NRS 4 or below), POSS 1-2, respiratory rate 12-20, able to participate in recovery activities",
      "Excessive sedation preceding respiratory depression: POSS level 3 (frequently drowsy, drifts off during conversation) or RASS -3 (moderate sedation, movement or eye opening to voice)",
      "Respiratory depression: respiratory rate below 12 breaths per minute, shallow breathing, SpO2 below 92 percent, elevated ETCO2 above 50 mmHg on capnography",
      "Opioid-induced constipation: no bowel movement for 3 or more days, abdominal distension, decreased bowel sounds, patient reports straining, hard stools, abdominal discomfort",
      "Urinary retention: inability to void, suprapubic distension, bladder scan showing residual volume above 300 mL; more common in males and postoperative patients",
      "Pruritus (itching): generalized itching without rash, caused by opioid-induced histamine release; most common with morphine; treated with diphenhydramine or low-dose nalbuphine"
    ],
    signs: {
      left: [
        "Mild drowsiness after opioid administration (POSS level 2)",
        "Nausea without vomiting (common initial side effect, often resolves in 2-3 days)",
        "Mild constipation managed with bowel regimen",
        "Mild pruritus (itching) without rash",
        "Slightly decreased respiratory rate (12-14 breaths per minute)",
        "Mild dizziness or lightheadedness with position changes"
      ],
      right: [
        "Respiratory rate below 8 breaths per minute or apnea (requires immediate naloxone)",
        "POSS level 4: somnolent with minimal or no response to stimulation",
        "Oxygen saturation below 90 percent despite supplemental oxygen",
        "Severe myoclonus (involuntary muscle jerking from opioid metabolite accumulation)",
        "Acute urinary retention with bladder distension above 500 mL",
        "Anaphylaxis (urticaria, angioedema, bronchospasm, hypotension -- rare but life-threatening)"
      ]
    },
    medications: [
      {
        name: "Morphine Sulfate",
        type: "Opioid agonist (mu-receptor agonist)",
        action: "Binds to mu-opioid receptors in the CNS dorsal horn and brainstem periaqueductal gray matter, modulating pain signal transmission and perception; produces dose-dependent analgesia, sedation, euphoria, respiratory depression, and decreased gastrointestinal motility",
        sideEffects: "Respiratory depression (most dangerous), constipation (most common persistent effect, tolerance does not develop), nausea/vomiting, sedation, pruritus (histamine release), urinary retention, orthostatic hypotension",
        contra: "Severe respiratory depression or acute/severe bronchial asthma without monitoring equipment; paralytic ileus; concurrent MAOI use within 14 days; significant renal impairment (active metabolite morphine-6-glucuronide accumulates and is more potent than morphine)",
        pearl: "Morphine-6-glucuronide is an active metabolite that is 2-4 times more potent than morphine and is renally cleared -- patients with GFR below 30 should receive hydromorphone or fentanyl instead; onset IV 5-10 minutes, peak 15-30 minutes, duration 3-5 hours"
      },
      {
        name: "Hydromorphone (Dilaudid)",
        type: "Opioid agonist (semi-synthetic mu-receptor agonist)",
        action: "Binds to mu-opioid receptors with approximately 5-7 times the potency of morphine; provides analgesia through the same mechanism as morphine but with fewer histamine-release effects and a more favorable profile in renal impairment because its metabolites are less active",
        sideEffects: "Respiratory depression, sedation, constipation, nausea, pruritus (less than morphine), dizziness, hypotension; same spectrum as morphine but potency difference makes dosing errors more dangerous",
        contra: "Same contraindications as morphine; critical to note that 1 mg hydromorphone IV is NOT equivalent to 1 mg morphine IV -- it is approximately 5-7 times more potent; many fatal medication errors occur from this confusion",
        pearl: "The morphine-to-hydromorphone conversion is the most error-prone opioid calculation: hydromorphone 1.5 mg IV = morphine 10 mg IV; always verify calculations with a second nurse and use facility-approved equianalgesic tables; preferred over morphine in renal impairment"
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid antagonist (competitive mu-receptor antagonist)",
        action: "Competitively displaces opioid molecules from mu, kappa, and delta receptors, rapidly reversing respiratory depression, sedation, and hypotension caused by opioid overdose; onset IV 1-2 minutes, IM/SC 2-5 minutes, intranasal 3-5 minutes",
        sideEffects: "Acute opioid withdrawal in dependent patients (agitation, diaphoresis, tachycardia, vomiting, diarrhea, abdominal cramps, piloerection), rare pulmonary edema, hypertension, ventricular tachycardia from sudden sympathetic activation",
        contra: "Known hypersensitivity (rare); use cautiously in patients with cardiovascular disease (abrupt reversal may cause sympathetic surge); in chronic opioid patients, titrate carefully to restore respiration without precipitating severe withdrawal",
        pearl: "Titrate to respiratory rate above 12, not full alertness; duration of action is only 30-90 minutes so the opioid may outlast naloxone causing renarcotization; for in-hospital opioid-induced respiratory depression, dilute 0.4 mg in 10 mL NS and give 1 mL (0.04 mg) at a time to avoid precipitating full withdrawal in opioid-tolerant patients"
      }
    ],
    pearls: [
      "Sedation ALWAYS precedes respiratory depression in opioid toxicity -- monitoring sedation level (POSS or RASS) is the most proactive safety measure because it identifies patients at risk BEFORE respiratory compromise develops",
      "The equianalgesic conversion between morphine and hydromorphone is the most common source of fatal opioid medication errors: hydromorphone is 5-7 times more potent than morphine; ALWAYS verify calculations with a second nurse",
      "Tolerance develops to most opioid side effects (sedation, nausea, respiratory depression) but NEVER develops to opioid-induced constipation -- every patient on opioids needs a prophylactic bowel regimen throughout therapy",
      "Only the PATIENT should press the PCA button -- family members or visitors pressing the button (PCA by proxy) bypasses the critical safety mechanism where excessive sedation prevents the patient from pressing for more doses",
      "Physical dependence and withdrawal are normal physiological responses to chronic opioid use -- they are NOT the same as addiction; conflating these concepts leads to undertreatment of pain",
      "For in-hospital opioid-induced respiratory depression in a patient with chronic opioid use, dilute naloxone 0.4 mg in 10 mL NS and administer 0.04 mg (1 mL) at a time to titrate reversal without precipitating severe withdrawal",
      "Respiratory rate is not the only indicator -- assess the QUALITY of respirations (depth, pattern, regularity); a patient breathing at 14 breaths per minute with very shallow breaths and long pauses is at higher risk than the rate alone suggests"
    ],
    quiz: [
      {
        question: "A practical nurse assesses a postoperative patient receiving IV morphine via PCA pump. The patient's POSS score is 3 (frequently drowsy, arousable, drifts off during conversation) with a respiratory rate of 14 breaths per minute. What is the priority nursing action?",
        options: [
          "Continue monitoring because the respiratory rate is within normal limits",
          "Hold further opioid doses, stimulate the patient, elevate the head of bed, and notify the physician immediately",
          "Administer naloxone 2 mg IV push immediately",
          "Increase the supplemental oxygen flow rate and continue the PCA"
        ],
        correct: 1,
        rationale: "A POSS score of 3 (frequently drowsy, drifts off during conversation) is an UNACCEPTABLE level of sedation that precedes respiratory depression. Even though the respiratory rate is currently 14, this sedation level indicates the patient is trending toward respiratory compromise. The priority is to hold further opioid doses, stimulate the patient, elevate the head of bed, and notify the physician for dose adjustment. Naloxone is not indicated at this point because respiration is adequate."
      },
      {
        question: "A physician orders hydromorphone 2 mg IV every 4 hours PRN for a patient who was previously receiving morphine 10 mg IV every 4 hours. The practical nurse should recognize that this order represents which potential concern?",
        options: [
          "The doses are equivalent and the order is safe to administer",
          "The hydromorphone dose is approximately 2-3 times the equianalgesic dose, creating a significant overdose risk",
          "Hydromorphone is less potent than morphine, so this represents a dose reduction",
          "The hydromorphone dose is subtherapeutic and will not provide adequate pain relief"
        ],
        correct: 1,
        rationale: "Using equianalgesic tables, morphine 10 mg IV is approximately equivalent to hydromorphone 1.5 mg IV. The ordered dose of hydromorphone 2 mg IV is about 33 percent higher than the equianalgesic dose. Additionally, when converting between opioids, a 25-50 percent reduction from the equianalgesic dose is standard practice to account for incomplete cross-tolerance. This order should be clarified with the physician before administration."
      },
      {
        question: "A practical nurse is educating a family member of a patient using a PCA pump. The family member states they will press the PCA button for the patient whenever the patient falls asleep to stay ahead of the pain. How should the nurse respond?",
        options: [
          "Thank the family member for their attentiveness and encourage them to continue",
          "Explain that only the PATIENT should press the PCA button because sedation-induced inability to press the button is a critical safety mechanism that prevents overdose",
          "Instruct the family member to press the button only once every 2 hours",
          "Suggest the family member wake the patient up before pressing the button each time"
        ],
        correct: 1,
        rationale: "PCA by proxy (anyone other than the patient pressing the PCA button) is a recognized patient safety hazard. The fundamental safety mechanism of PCA is that a patient who is too sedated to press the button will not receive additional doses, preventing escalation to respiratory depression. When a family member presses the button for a sleeping patient, this safety mechanism is bypassed, putting the patient at significant risk for opioid overdose."
      }
    ]
  },

  "osteogenesis-imperfecta-rpn": {
    title: "Osteogenesis Imperfecta for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Osteogenesis Imperfecta",
      content: "Osteogenesis imperfecta (OI), commonly known as brittle bone disease, is a group of genetic connective tissue disorders caused by defects in the synthesis, structure, or processing of type I collagen. Type I collagen is the most abundant protein in the human body and is a major structural component of bone, skin, tendons, ligaments, sclera of the eyes, dentin of the teeth, and blood vessel walls. Because type I collagen is so widely distributed, OI affects multiple organ systems, although its most prominent clinical feature is bone fragility with recurrent fractures. The molecular basis of OI involves mutations in one of several genes, most commonly COL1A1 and COL1A2, which encode the alpha-1 and alpha-2 chains of type I procollagen, respectively. These mutations produce either quantitatively deficient collagen (less collagen of normal quality) or qualitatively abnormal collagen (normal amounts of structurally defective collagen). The Sillence classification system divides OI into four main types based on clinical severity. Type I (mild, most common, accounting for approximately 50 percent of cases) produces collagen of normal quality but in reduced quantity; patients have blue sclera, mild to moderate bone fragility, and normal or near-normal stature. Type II (perinatal lethal) is the most severe form; multiple fractures occur in utero, and most affected infants die during the neonatal period from respiratory failure due to a small, malformed thoracic cage. Type III (progressively deforming) causes severe bone fragility with hundreds of fractures throughout life, progressive skeletal deformity, very short stature, triangular facies, and severe scoliosis; sclera may be blue at birth but often become white with age. Type IV (moderately severe) presents with moderate bone fragility, variable short stature, and normal or slightly blue sclera. The pathogenesis of bone fragility in OI relates directly to the role of type I collagen in bone formation. Bone is composed of an organic matrix (primarily type I collagen fibers that provide tensile strength and flexibility) and an inorganic mineral phase (hydroxyapatite crystals that provide compressive strength and rigidity). In OI, defective collagen produces a disorganized organic matrix that cannot properly support mineralization, resulting in bones that are thin, porous, and structurally weak. The bones fracture easily, often from minimal or no apparent trauma, which is a distinguishing clinical feature. Blue sclera, one of the hallmark findings in OI Type I, occurs because the thin, defective collagen in the sclera allows the underlying choroidal vasculature to show through, producing a characteristic blue-gray appearance. Dentinogenesis imperfecta (opalescent, discolored teeth prone to cracking and wearing) occurs because type I collagen is also a major component of dentin. Hearing loss develops in approximately 50 percent of adults with OI, caused by otosclerosis (abnormal bone remodeling in the middle ear ossicles). Joint hypermobility, thin translucent skin with easy bruising, and short stature are additional findings related to the widespread collagen deficiency. The practical nurse must understand that OI patients require exceptionally gentle handling during all care activities. Fractures can occur during routine activities such as diaper changing in infants, repositioning, blood pressure cuff inflation, or physical therapy. Non-accidental injury (child abuse) must be carefully distinguished from OI in children presenting with multiple fractures, making accurate genetic diagnosis essential."
    },
    riskFactors: [
      "Autosomal dominant inheritance pattern (most common; one affected parent confers a 50 percent chance of passing the mutation to each child)",
      "De novo (spontaneous) genetic mutation (approximately 25 percent of OI cases occur without family history)",
      "Family history of OI or unexplained recurrent fractures in childhood",
      "Prematurity and low birth weight (exacerbates bone fragility in affected neonates)",
      "Vitamin D deficiency (compounds existing bone fragility; inadequate vitamin D impairs calcium absorption and bone mineralization)",
      "Immobility or reduced weight-bearing activity (disuse osteopenia superimposed on already fragile bones accelerates bone loss)",
      "History of corticosteroid therapy (further reduces bone mineral density in patients with baseline collagen deficiency)"
    ],
    diagnostics: [
      "Genetic testing (DNA sequencing of COL1A1 and COL1A2 genes): definitive diagnosis; identifies the specific mutation and helps predict disease severity and inheritance pattern",
      "Dual-energy X-ray absorptiometry (DEXA scan): measures bone mineral density (BMD); OI patients typically have significantly reduced BMD for age; used to monitor treatment response",
      "Skeletal radiographs: reveal osteopenia (diffusely thinned bones), fractures in various stages of healing, bowing deformities of long bones, wormian bones (extra sutural bones in the skull), and codfish vertebrae (biconcave compression)",
      "Serum calcium, phosphorus, alkaline phosphatase, and vitamin D levels: usually normal in OI (differentiates from rickets and other metabolic bone diseases); elevated alkaline phosphatase during active bone growth or fracture healing",
      "Type I collagen analysis (skin biopsy with fibroblast culture): analyzes the quantity and quality of type I collagen produced by the patient's cells; used when genetic testing is inconclusive",
      "Complete blood count and coagulation studies: assess for anemia from chronic illness and screen for easy bruising etiology; platelet function may be affected in some OI variants"
    ],
    management: [
      "Administer cyclical IV pamidronate (bisphosphonate) as prescribed: standard protocol is every 3-4 months; this is the primary pharmacological treatment that increases bone density, reduces fracture frequency, and decreases bone pain",
      "Ensure adequate daily calcium intake (age-appropriate: 700-1300 mg/day) and vitamin D supplementation (600-1000 IU/day) to optimize bone mineralization alongside bisphosphonate therapy",
      "Implement gentle weight-bearing physical therapy and aquatic therapy to strengthen muscles without excessive stress on bones; strong muscles act as shock absorbers protecting fragile bones",
      "Apply splints, braces, or lightweight casts as ordered for fracture management; avoid heavy casts that add weight and promote further disuse osteopenia",
      "Coordinate with orthopedic surgery for rodding procedures (intramedullary rod insertion) in severe cases to internally splint long bones and reduce fracture frequency and deformity",
      "Provide acetaminophen for pain management during acute fractures; avoid NSAIDs in children under 6 months and use with caution in those receiving bisphosphonates",
      "Implement comprehensive fall prevention strategies: padded crib rails, non-slip surfaces, adaptive equipment, and environmental modifications to minimize injury risk"
    ],
    nursingActions: [
      "Handle OI patients with extreme gentleness: support the entire limb when lifting or repositioning; NEVER pull on an arm or leg, and NEVER use a limb as a lever during turning or transfers",
      "Use the palms of both hands spread wide to lift infants (not under the armpits or by grasping the rib cage); distribute pressure over the largest possible surface area to minimize point-loading on fragile bones",
      "Perform blood pressure assessment using the widest cuff that fits the limb and inflate slowly; excessive cuff pressure can cause fractures in patients with severe OI",
      "Assess for new fractures at every encounter: sudden crying in infants, refusal to move a limb, swelling, deformity, crepitus, or localized warmth and tenderness",
      "Monitor for signs of basilar skull involvement: hearing changes (progressive hearing loss is common), headache, cranial nerve deficits",
      "Reinforce family education on safe handling techniques, signs of fracture, activity modifications, and the importance of maintaining prescribed bisphosphonate and vitamin D therapy",
      "Document skin integrity carefully at each assessment: OI patients have thin, easily bruised skin; differentiate OI-related bruising from potential non-accidental injury, especially in pediatric patients"
    ],
    assessmentFindings: [
      "Blue sclera: characteristic blue-gray discoloration of the whites of the eyes caused by thin, translucent scleral collagen allowing choroidal vasculature to show through (most prominent in Type I)",
      "Recurrent fractures from minimal or no apparent trauma: long bone fractures from routine handling, compression fractures of vertebrae from sitting or coughing",
      "Dentinogenesis imperfecta: teeth appear opalescent or translucent with amber, blue-gray, or brown discoloration; prone to cracking, wearing, and early loss",
      "Joint hypermobility and ligament laxity: increased range of motion beyond normal limits, frequent joint subluxations, flat feet",
      "Short stature and skeletal deformities: bowing of long bones (especially femur and tibia), scoliosis, kyphosis, barrel-shaped chest, triangular facies",
      "Progressive hearing loss: typically conductive (middle ear ossicle involvement) beginning in second or third decade; may progress to mixed or sensorineural pattern",
      "Easy bruising and thin, translucent skin: bruises appear with minimal contact due to defective collagen in blood vessel walls and dermal connective tissue"
    ],
    signs: {
      left: [
        "Blue sclera visible on eye examination",
        "Mild joint hypermobility and flat feet",
        "Discolored or opalescent teeth",
        "Easy bruising from minor contact",
        "Mild short stature for age and family",
        "Previous fracture history with complete healing"
      ],
      right: [
        "Acute fracture with limb deformity, swelling, and crepitus",
        "Respiratory distress from rib fractures or severe scoliosis (reduced thoracic capacity)",
        "Basilar impression (skull base compressing brainstem) causing headache, cranial nerve deficits, and ataxia",
        "Multiple fractures in various stages of healing (differentiate from non-accidental injury)",
        "Severe progressive scoliosis compromising cardiopulmonary function",
        "Hemorrhage from vascular fragility during surgical procedures"
      ]
    },
    medications: [
      {
        name: "Pamidronate (Aredia)",
        type: "Bisphosphonate (IV osteoclast inhibitor)",
        action: "Binds to hydroxyapatite crystals on bone surfaces and is internalized by osteoclasts during bone resorption; once inside the osteoclast, it disrupts the mevalonate pathway essential for osteoclast function, inducing apoptosis; net effect is reduced bone resorption, increased bone mineral density, and decreased fracture frequency",
        sideEffects: "Acute phase reaction within 24-72 hours of infusion (fever, myalgia, bone pain, flu-like symptoms -- most common during first infusion), hypocalcemia (especially if vitamin D deficient), renal toxicity, osteonecrosis of the jaw (ONJ) with prolonged use, GI upset",
        contra: "Hypocalcemia (must be corrected before administration); severe renal impairment (creatinine clearance below 30 mL/min); known hypersensitivity to bisphosphonates; pregnancy (Category D -- teratogenic to fetal skeleton)",
        pearl: "First infusion commonly causes fever and bone pain (acute phase reaction) -- premedicate with acetaminophen; ensure calcium and vitamin D supplementation throughout therapy; dental examination before starting long-term therapy to reduce osteonecrosis of the jaw risk; infuse slowly over 2-4 hours with adequate IV hydration"
      },
      {
        name: "Calcium with Vitamin D (Calcium Carbonate + Cholecalciferol)",
        type: "Mineral and vitamin supplement (bone health support)",
        action: "Calcium provides the essential mineral substrate for hydroxyapatite crystal formation in bone matrix; vitamin D (cholecalciferol) is converted to its active form calcitriol (1,25-dihydroxyvitamin D) in the kidneys, which increases intestinal calcium absorption from 10-15 percent to 30-40 percent and promotes calcium incorporation into bone",
        sideEffects: "Constipation, bloating, gas (calcium carbonate), hypercalcemia with excessive dosing (fatigue, nausea, polyuria, kidney stones), hypercalciuria",
        contra: "Hypercalcemia; hyperparathyroidism; severe renal impairment (impaired vitamin D activation); calcium-containing kidney stones; digoxin therapy (hypercalcemia potentiates digoxin toxicity)",
        pearl: "Calcium carbonate requires stomach acid for absorption -- take with meals; calcium citrate does not require acid and is better absorbed in patients on proton pump inhibitors; maximum absorption occurs at doses of 500 mg elemental calcium or less per dose (split daily requirement into 2-3 doses); vitamin D levels should be monitored and maintained above 30 ng/mL"
      },
      {
        name: "Acetaminophen (Tylenol)",
        type: "Non-opioid analgesic and antipyretic",
        action: "Inhibits cyclooxygenase (COX) enzymes primarily in the central nervous system, reducing prostaglandin synthesis in the hypothalamic thermoregulatory center (antipyretic effect) and modulating descending pain inhibitory pathways (analgesic effect); does not have significant peripheral anti-inflammatory activity",
        sideEffects: "Hepatotoxicity at supratherapeutic doses (most common cause of acute liver failure in North America), nausea, rash (rare), allergic reactions (rare)",
        contra: "Severe hepatic impairment or active liver disease; alcohol use disorder (increased hepatotoxicity risk); allergy to acetaminophen",
        pearl: "Maximum daily dose is 75 mg/kg/day in children (not to exceed 4 g/day) and 4 g/day in healthy adults (2 g/day in patients with liver disease or alcohol use); check ALL medications for hidden acetaminophen (combination products such as opioid-acetaminophen formulations) to prevent accidental overdose; preferred first-line analgesic in OI because it does not affect platelet function (important given easy bruising/bleeding tendency)"
      }
    ],
    pearls: [
      "Blue sclera is the hallmark visual finding of OI Type I -- the thin, defective scleral collagen allows the underlying choroidal vasculature to show through, producing a distinctive blue-gray color",
      "NEVER pull on the limbs of an OI patient or use a limb as a lever during repositioning -- fractures can occur from forces that would be harmless in patients with normal bone structure; always support the whole body with spread palms",
      "Fractures in OI heal at a normal rate but with weaker callus formation -- lightweight splints or casts are preferred over heavy casts to minimize disuse osteopenia during immobilization",
      "Dentinogenesis imperfecta (opalescent, discolored teeth) is an important diagnostic clue -- refer for early dental evaluation because affected teeth are prone to cracking and early loss, requiring protective dental interventions",
      "Cyclical IV pamidronate (bisphosphonate) is the primary pharmacological treatment for OI -- it reduces fracture frequency by up to 65 percent and decreases bone pain; premedicate with acetaminophen for first infusion to manage acute phase reaction",
      "Always differentiate OI from non-accidental injury (child abuse) when a child presents with multiple fractures -- genetic testing and collagen analysis provide definitive diagnosis; blue sclera, dentinogenesis imperfecta, family history, and wormian bones support OI diagnosis",
      "Hearing loss is progressive in approximately 50 percent of adults with OI due to otosclerosis of the middle ear ossicles -- assess hearing at regular intervals and refer for audiology evaluation when changes are detected"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for an infant diagnosed with osteogenesis imperfecta Type I. Which assessment finding is MOST characteristic of this condition?",
        options: [
          "Yellow sclera and jaundice",
          "Blue sclera and history of fractures from minimal trauma",
          "Red sclera and conjunctival hemorrhage",
          "Normal sclera with pathological fractures only after major trauma"
        ],
        correct: 1,
        rationale: "Blue sclera is the hallmark finding of osteogenesis imperfecta Type I. The scleral collagen is thin and defective, allowing the underlying choroidal vasculature to show through as a blue-gray color. Combined with fractures from minimal or no apparent trauma, these findings are highly characteristic of OI. Yellow sclera suggests liver disease, and red sclera suggests conjunctivitis or subconjunctival hemorrhage."
      },
      {
        question: "The practical nurse needs to reposition an infant with osteogenesis imperfecta in the crib. Which technique is SAFEST for preventing iatrogenic fractures?",
        options: [
          "Grasp the infant under the armpits and lift quickly to minimize handling time",
          "Use both palms spread wide under the infant's body to distribute pressure evenly over the largest possible surface area",
          "Hold the infant by one arm and one leg to maintain control during repositioning",
          "Use a mechanical lift with standard straps to avoid manual handling"
        ],
        correct: 1,
        rationale: "OI patients have extremely fragile bones that can fracture from minimal force. Using both palms spread wide distributes the lifting force over the largest possible surface area, minimizing point-loading on any single bone. Grasping under the armpits compresses the rib cage (fracture risk), holding by limbs creates leverage forces on fragile bones, and standard mechanical lift straps may create excessive pressure points."
      },
      {
        question: "A child with osteogenesis imperfecta is scheduled for cyclical IV pamidronate infusion. The practical nurse is preparing the child for the first treatment. Which pre-treatment education is MOST important for the parent?",
        options: [
          "The child should fast for 12 hours before the infusion",
          "Fever, bone pain, and flu-like symptoms are common after the first infusion and can be managed with acetaminophen",
          "The child will need to remain on strict bedrest for 48 hours after the infusion",
          "The infusion will cure osteogenesis imperfecta and prevent all future fractures"
        ],
        correct: 1,
        rationale: "The acute phase reaction (fever, bone pain, myalgia, flu-like symptoms) is the most common side effect of pamidronate and occurs most frequently after the first infusion. Parents should be informed that this is expected, self-limiting (resolves within 24-72 hours), and manageable with acetaminophen. Fasting is not required, bedrest is not necessary, and pamidronate does not cure OI -- it reduces fracture frequency and improves bone density but requires ongoing cyclical treatment."
      }
    ]
  }
};

let ok = 0;
let skip = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) ok++;
  else skip++;
}
console.log(`\nDone: ${ok} injected, ${skip} skipped`);
