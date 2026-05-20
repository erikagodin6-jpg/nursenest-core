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
  "leukemia-basics-rpn": {
    title: "Leukemia Basics for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Leukemia",
      content: "Leukemia is a group of malignant neoplasms affecting the blood-forming tissues of the bone marrow, resulting in the uncontrolled proliferation of abnormal white blood cells (blasts) that crowd out normal hematopoietic cells. Under normal conditions, hematopoietic stem cells in the bone marrow differentiate along two primary lineages: the myeloid lineage (producing red blood cells, platelets, monocytes, granulocytes) and the lymphoid lineage (producing B lymphocytes, T lymphocytes, natural killer cells). In leukemia, a genetic mutation occurs in a precursor cell, causing it to replicate without proper differentiation. These immature blast cells accumulate in the bone marrow and eventually spill into the peripheral blood, infiltrate the spleen, liver, lymph nodes, and central nervous system. Leukemia is classified by the cell lineage affected and by the speed of disease progression. Acute leukemias (acute lymphoblastic leukemia [ALL] and acute myeloid leukemia [AML]) involve rapidly proliferating immature blast cells that do not mature into functional cells; these diseases progress rapidly and are life-threatening without treatment. ALL is the most common childhood malignancy, with peak incidence between 2 and 5 years of age, while AML is more common in adults over age 60. Chronic leukemias (chronic lymphocytic leukemia [CLL] and chronic myeloid leukemia [CML]) involve more mature but still abnormal cells that accumulate slowly; patients may be asymptomatic for years before diagnosis. CML is characterized by the Philadelphia chromosome (a translocation between chromosomes 9 and 22 creating the BCR-ABL fusion gene), which produces an abnormal tyrosine kinase that drives cell proliferation. The bone marrow failure caused by blast cell accumulation leads to three critical consequences: anemia (from decreased red blood cell production), thrombocytopenia (from decreased platelet production causing bleeding), and neutropenia (from decreased functional white blood cell production causing immunosuppression and infection risk). The practical nurse must understand that the patient with leukemia is at simultaneous risk for fatigue from anemia, hemorrhage from thrombocytopenia, and overwhelming infection from neutropenia -- these three complications drive the majority of nursing assessment priorities and interventions."
    },
    riskFactors: [
      "Prior exposure to ionizing radiation (atomic bomb survivors, therapeutic radiation for other cancers)",
      "Previous chemotherapy with alkylating agents or topoisomerase II inhibitors (treatment-related AML)",
      "Genetic predisposition including Down syndrome (20-fold increased risk of ALL and AML)",
      "Exposure to benzene and other industrial chemicals (petrochemical workers, painters)",
      "Tobacco smoking (increases AML risk by 40% due to benzene and other carcinogens in cigarette smoke)",
      "Family history of leukemia or myelodysplastic syndrome in first-degree relatives",
      "Pre-existing hematologic disorders including myelodysplastic syndrome and myeloproliferative neoplasms"
    ],
    diagnostics: [
      "Complete blood count (CBC) with differential: may show elevated WBC (leukocytosis) or decreased WBC (leukopenia), anemia, thrombocytopenia; presence of blast cells on peripheral smear is hallmark",
      "Bone marrow aspiration and biopsy: definitive diagnostic test; blast percentage greater than 20% confirms acute leukemia; performed at the posterior iliac crest under local anesthesia",
      "Flow cytometry: identifies specific cell surface markers (CD antigens) to classify leukemia subtype; critical for determining treatment protocol",
      "Cytogenetic analysis and fluorescence in situ hybridization (FISH): detects chromosomal abnormalities including Philadelphia chromosome (BCR-ABL) in CML and specific translocations that guide prognosis",
      "Lumbar puncture with cerebrospinal fluid analysis: performed in ALL to detect CNS involvement; presence of blast cells in CSF indicates CNS leukemia requiring intrathecal chemotherapy",
      "Comprehensive metabolic panel: assesses renal function (BUN, creatinine), liver function (AST, ALT), electrolytes, uric acid (elevated from rapid cell turnover), and LDH (elevated as marker of cell destruction)"
    ],
    management: [
      "Induction chemotherapy: intensive multi-drug regimen to achieve complete remission (less than 5% blasts in bone marrow); requires hospitalization for 4-6 weeks",
      "Consolidation therapy: additional chemotherapy cycles after remission to eliminate residual leukemia cells and prevent relapse",
      "Hematopoietic stem cell transplant (HSCT): allogeneic transplant from matched donor for high-risk or relapsed disease; requires myeloablative conditioning",
      "Targeted therapy: tyrosine kinase inhibitors (imatinib) for CML with Philadelphia chromosome; monoclonal antibodies for specific subtypes",
      "Supportive care: packed red blood cell transfusions for anemia (maintain hemoglobin above 70-80 g/L), platelet transfusions for thrombocytopenia (maintain platelets above 10,000/microL to prevent spontaneous bleeding)",
      "Tumor lysis syndrome prevention: aggressive IV hydration, allopurinol or rasburicase to reduce uric acid, monitor potassium, phosphorus, calcium, and uric acid every 6-8 hours during induction",
      "Infection prevention protocol: neutropenic precautions when absolute neutrophil count (ANC) below 500/microL; private room, hand hygiene, no fresh flowers or raw foods"
    ],
    nursingActions: [
      "Monitor CBC with differential daily during chemotherapy; report ANC below 500/microL (severe neutropenia) and platelet count below 20,000/microL immediately",
      "Assess for bleeding at least every 4 hours: check for petechiae, ecchymosis, gingival bleeding, epistaxis, hematuria, melena, and prolonged bleeding from venipuncture sites",
      "Implement neutropenic precautions: private room, strict hand hygiene, no fresh fruits/vegetables/flowers, limit visitors, monitor temperature every 4 hours",
      "Report any temperature of 38.3 degrees Celsius or higher (or 38.0 degrees Celsius sustained over one hour) in a neutropenic patient immediately -- this constitutes a medical emergency requiring blood cultures and empiric antibiotics within 60 minutes",
      "Monitor for signs of tumor lysis syndrome: hyperkalemia (peaked T waves, muscle weakness), hyperphosphatemia, hypocalcemia (tetany, Chvostek/Trousseau signs), hyperuricemia, oliguria",
      "Provide meticulous oral care using soft-bristle toothbrush and non-alcohol-based mouthwash every 4 hours to prevent mucositis and oral infection",
      "Assess central venous access device (CVAD) site every shift for signs of infection, thrombosis, or displacement; maintain sterile dressing per facility protocol"
    ],
    assessmentFindings: [
      "Fatigue, pallor, and dyspnea on exertion from anemia (decreased functional red blood cells)",
      "Petechiae, ecchymosis, gingival bleeding, and prolonged bleeding from minor cuts due to thrombocytopenia",
      "Recurrent infections, fever, and oral ulcers from neutropenia and immunosuppression",
      "Bone pain and joint pain (especially in children with ALL) from marrow expansion by blast cells",
      "Hepatosplenomegaly and lymphadenopathy from infiltration of blast cells into organs",
      "Weight loss, night sweats, and anorexia as systemic manifestations of malignancy",
      "Headache, vomiting, and cranial nerve palsies if CNS involvement is present (particularly in ALL)"
    ],
    signs: {
      left: [
        "Progressive fatigue and exercise intolerance",
        "Easy bruising with minor trauma",
        "Mild gingival bleeding during oral care",
        "Low-grade fever (temperature 37.5-38.0 degrees Celsius)",
        "Palpable lymph nodes in cervical or axillary chains",
        "Bone or joint discomfort reported by patient"
      ],
      right: [
        "Febrile neutropenia (temperature 38.3 degrees Celsius or higher with ANC below 500)",
        "Uncontrolled hemorrhage (epistaxis, hematemesis, or melena not responding to local measures)",
        "Disseminated intravascular coagulation (DIC) with diffuse bleeding and oozing",
        "Tumor lysis syndrome (hyperkalemia with cardiac dysrhythmias, acute kidney injury)",
        "Septic shock (hypotension, tachycardia, altered mental status in neutropenic patient)",
        "Leukostasis (WBC above 100,000 with respiratory distress, altered consciousness, priapism)"
      ]
    },
    medications: [
      {
        name: "Cytarabine (Ara-C)",
        type: "Antimetabolite chemotherapy agent (pyrimidine analog)",
        action: "Incorporates into DNA during the S-phase of cell division, inhibiting DNA polymerase and causing chain termination; this prevents DNA replication and induces apoptosis of rapidly dividing leukemia cells in the bone marrow",
        sideEffects: "Severe myelosuppression (neutropenia, anemia, thrombocytopenia), nausea and vomiting, mucositis, cerebellar toxicity at high doses (ataxia, dysarthria, nystagmus), conjunctivitis (with high-dose therapy), hepatotoxicity",
        contra: "Active uncontrolled infection; severe hepatic impairment; known hypersensitivity; pregnancy (teratogenic)",
        pearl: "High-dose cytarabine requires prophylactic corticosteroid eye drops (dexamethasone 0.1%) to prevent chemical conjunctivitis; monitor cerebellar function before each high-dose cycle by assessing coordination, speech, and gait"
      },
      {
        name: "Vincristine (Oncovin)",
        type: "Vinca alkaloid chemotherapy agent (plant alkaloid from periwinkle)",
        action: "Binds to tubulin protein and prevents microtubule formation during the M-phase (mitosis) of the cell cycle, arresting cell division in metaphase; particularly effective against lymphoblastic leukemia cells",
        sideEffects: "Peripheral neuropathy (numbness, tingling, foot drop, constipation from autonomic neuropathy), jaw pain, alopecia, SIADH (syndrome of inappropriate antidiuretic hormone), vesicant causing severe tissue necrosis if extravasation occurs",
        contra: "Demyelinating Charcot-Marie-Tooth disease; intrathecal administration is FATAL (must only be given IV); severe neurotoxicity from prior doses",
        pearl: "NEVER administer intrathecally -- intrathecal vincristine is universally fatal; always verify route is IV before administration; assess for peripheral neuropathy (numbness, tingling, constipation) before each dose; implement bowel regimen prophylactically due to autonomic neuropathy"
      },
      {
        name: "Allopurinol (Zyloprim)",
        type: "Xanthine oxidase inhibitor (antigout / uric acid lowering agent)",
        action: "Inhibits xanthine oxidase enzyme, blocking the conversion of hypoxanthine to xanthine and xanthine to uric acid; reduces uric acid production to prevent urate crystal deposition in renal tubules during tumor lysis syndrome",
        sideEffects: "Skin rash (discontinue immediately if rash develops -- may progress to Stevens-Johnson syndrome), nausea, diarrhea, elevated liver enzymes, drowsiness",
        contra: "Known hypersensitivity; concurrent use with azathioprine or mercaptopurine (allopurinol inhibits their metabolism, causing toxicity); HLA-B*5801 positive patients (high risk of severe hypersensitivity)",
        pearl: "Start allopurinol 24-48 hours BEFORE initiating chemotherapy to prevent tumor lysis syndrome; ensure adequate hydration (at least 2-3 liters per day) to promote uric acid excretion; monitor uric acid levels, renal function, and liver enzymes; discontinue immediately if any rash appears"
      }
    ],
    pearls: [
      "The three hallmark consequences of bone marrow failure in leukemia are anemia (fatigue, pallor), thrombocytopenia (bleeding), and neutropenia (infection) -- assess for all three at every patient encounter",
      "Febrile neutropenia is a medical emergency: a single temperature reading of 38.3 degrees Celsius or sustained temperature of 38.0 degrees Celsius for one hour in a patient with ANC below 500 requires immediate blood cultures and empiric broad-spectrum antibiotics within 60 minutes",
      "NEVER administer vincristine intrathecally -- this error is universally fatal; always verify the route is intravenous before administration and confirm with a second nurse",
      "Tumor lysis syndrome occurs when rapid destruction of cancer cells releases intracellular contents (potassium, phosphorus, uric acid) into the blood -- monitor labs every 6-8 hours during induction chemotherapy and ensure aggressive IV hydration",
      "The Philadelphia chromosome (BCR-ABL fusion gene from translocation between chromosomes 9 and 22) is the genetic hallmark of CML and is the target for tyrosine kinase inhibitor therapy such as imatinib",
      "Platelet count below 10,000/microL increases risk of spontaneous intracranial hemorrhage -- implement bleeding precautions including no rectal temperatures, no intramuscular injections, use electric razor only, and soft-bristle toothbrush",
      "ALL is the most common childhood cancer with peak incidence at ages 2-5; children with Down syndrome have a 20-fold increased risk of developing leukemia compared to the general population"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient receiving induction chemotherapy for acute myeloid leukemia. The morning CBC shows an absolute neutrophil count (ANC) of 300/microL and a temperature of 38.4 degrees Celsius. What is the priority nursing action?",
        options: [
          "Administer acetaminophen for fever and recheck temperature in one hour",
          "Notify the physician immediately for blood cultures and empiric antibiotic orders",
          "Apply a cooling blanket and increase oral fluid intake",
          "Document the findings and continue routine monitoring every 4 hours"
        ],
        correct: 1,
        rationale: "Febrile neutropenia (temperature 38.3 degrees Celsius or higher with ANC below 500/microL) is a medical emergency. The priority is immediate physician notification for blood cultures and empiric broad-spectrum antibiotic administration within 60 minutes, as sepsis can progress rapidly in immunocompromised patients."
      },
      {
        question: "A patient with newly diagnosed acute lymphoblastic leukemia is scheduled to begin induction chemotherapy tomorrow. Which medication should the practical nurse expect to be started today to prevent a metabolic complication?",
        options: [
          "Ondansetron to prevent chemotherapy-induced nausea",
          "Filgrastim to stimulate white blood cell production",
          "Allopurinol to prevent tumor lysis syndrome",
          "Dexamethasone eye drops to prevent conjunctivitis"
        ],
        correct: 2,
        rationale: "Allopurinol should be started 24-48 hours before chemotherapy begins to inhibit xanthine oxidase and reduce uric acid production, preventing tumor lysis syndrome. When leukemia cells are rapidly destroyed by chemotherapy, intracellular contents (potassium, phosphorus, uric acid) are released into the bloodstream, and uric acid can crystallize in the renal tubules causing acute kidney injury."
      },
      {
        question: "A practical nurse observes petechiae on the chest and arms of a patient with leukemia. The most recent platelet count is 15,000/microL. Which nursing intervention is most appropriate?",
        options: [
          "Apply firm pressure to all petechiae sites to promote reabsorption",
          "Implement bleeding precautions including no rectal temperatures and use of electric razor",
          "Encourage the patient to perform vigorous oral hygiene to prevent gingival infection",
          "Administer aspirin for any discomfort associated with the petechiae"
        ],
        correct: 1,
        rationale: "With a platelet count of 15,000/microL, the patient is at high risk for spontaneous bleeding. Bleeding precautions include avoiding rectal temperatures, using an electric razor instead of a blade, using a soft-bristle toothbrush, avoiding intramuscular injections, and applying prolonged pressure to venipuncture sites. Aspirin is contraindicated because it impairs platelet function and increases bleeding risk."
      }
    ]
  },

  "lochia-assessment-rpn": {
    title: "Lochia Assessment for Practical Nurses",
    cellular: {
      title: "Physiology of Postpartum Uterine Involution and Lochia",
      content: "Lochia is the vaginal discharge that occurs following childbirth, composed of blood, decidual tissue (the endometrial lining that supported the pregnancy), white blood cells, mucus, and bacteria. This discharge is a normal physiological process that reflects the healing of the placental attachment site on the uterine wall. During pregnancy, the uterus enlarges from approximately 60 grams to nearly 1,000 grams at term. After delivery of the placenta, the process of involution begins -- the uterus contracts and progressively returns to its pre-pregnant size over approximately 6 weeks. The placental site, which was richly vascularized to support fetal circulation, now represents a large wound approximately 8-10 centimeters in diameter on the inner uterine wall. Hemostasis at this site is achieved primarily through myometrial contraction, which compresses the spiral arteries that previously supplied the placenta. These uterine contractions, often called afterpains, are the primary mechanism preventing postpartum hemorrhage. Oxytocin released from the posterior pituitary gland (and administered therapeutically) stimulates these contractions. The lochia progresses through three predictable stages that reflect the healing process: lochia rubra (red, blood-heavy discharge occurring days 1-3 postpartum), lochia serosa (pinkish-brown, serosanguinous discharge occurring days 4-10), and lochia alba (whitish-yellow, mucoid discharge occurring from day 10 to approximately 6 weeks postpartum). Any deviation from this expected progression -- particularly a return to bright red bleeding after lochia has transitioned to serosa, passage of large clots (greater than a golf ball), saturation of a perineal pad in less than one hour, or foul-smelling discharge -- requires immediate assessment and reporting. Subinvolution occurs when the uterus fails to return to its pre-pregnant size and position, often caused by retained placental fragments, uterine infection (endometritis), or uterine fibroids. A boggy (soft, poorly contracted) uterine fundus is the most significant physical finding associated with uterine atony and represents the leading cause of early postpartum hemorrhage, accounting for approximately 70-80% of cases."
    },
    riskFactors: [
      "Uterine overdistension (multiple gestation, polyhydramnios, macrosomia greater than 4,000 grams)",
      "Prolonged labor or precipitous delivery (uterine muscle fatigue impairs contraction)",
      "Grand multiparity (5 or more previous births with decreased uterine muscle tone)",
      "Chorioamnionitis (intra-amniotic infection weakens uterine contractility)",
      "Retained placental fragments (prevent complete uterine contraction and seal of blood vessels)",
      "Use of magnesium sulfate for preeclampsia management (smooth muscle relaxant reduces uterine tone)",
      "General anesthesia for cesarean section (halogenated agents cause uterine relaxation)"
    ],
    diagnostics: [
      "Fundal height assessment: measure distance from symphysis pubis to uterine fundus; immediately postpartum the fundus is at the umbilicus, then descends approximately 1 centimeter per day",
      "Uterine tone assessment: palpate fundus through the abdominal wall; a firm, contracted uterus (like a grapefruit) is normal; a soft, boggy uterus indicates atony and hemorrhage risk",
      "Lochia assessment: evaluate color (rubra/serosa/alba), amount (scant/light/moderate/heavy), odor (normal or foul), and presence of clots using standardized pad saturation methods",
      "Complete blood count: monitor hemoglobin and hematocrit for blood loss; hemoglobin below 70 g/L may require transfusion; compare with prenatal baseline values",
      "Pelvic ultrasound: indicated when subinvolution is suspected to evaluate for retained products of conception, endometrial thickening, or uterine blood clots",
      "Coagulation studies (PT, PTT, fibrinogen, D-dimer): indicated when disseminated intravascular coagulation is suspected; fibrinogen below 200 mg/dL in pregnancy is critically low"
    ],
    management: [
      "Fundal massage for uterine atony: apply firm, circular pressure over the uterine fundus through the abdominal wall while supporting the lower uterine segment with the other hand above the symphysis pubis",
      "Administer uterotonic medications as ordered: oxytocin (first-line), methylergonovine (second-line for sustained contraction), carboprost (prostaglandin F2-alpha for refractory atony)",
      "Encourage early and frequent breastfeeding: infant suckling stimulates endogenous oxytocin release from the posterior pituitary, promoting uterine contraction",
      "Encourage frequent bladder emptying: a distended bladder displaces the uterus and prevents effective contraction; catheterize if the patient cannot void within 6 hours postpartum",
      "Perineal pad monitoring: weigh pads to quantify blood loss (1 gram = approximately 1 mL blood); saturating more than one pad per hour is excessive and requires immediate intervention",
      "Prepare for surgical intervention if conservative measures fail: uterine tamponade (balloon), uterine compression sutures (B-Lynch), uterine artery embolization, or hysterectomy as last resort",
      "Monitor vital signs every 15 minutes during active hemorrhage: tachycardia is often the FIRST sign of hemorrhage (before hypotension); report heart rate above 110 bpm"
    ],
    nursingActions: [
      "Assess fundal position, tone, and height every 15 minutes for the first hour postpartum, then every 30 minutes for the next hour, then every 4 hours for 24 hours",
      "Document lochia characteristics using standardized terminology: color (rubra/serosa/alba), amount (scant = less than 2.5 cm stain, light = less than 10 cm, moderate = less than 15 cm, heavy = pad saturated within 1 hour), odor, and clots",
      "Report any of the following immediately: return to bright red bleeding after lochia has progressed past rubra stage, passage of clots larger than a golf ball, saturating more than one pad per hour, foul-smelling lochia, or boggy uterus not responding to fundal massage",
      "Perform fundal massage using proper technique if uterus is boggy: support the lower uterine segment with one hand while applying firm circular pressure to the fundus with the other hand until the uterus firms",
      "Monitor for signs of hypovolemic shock: tachycardia (often first sign), hypotension (late sign), pallor, cold clammy skin, restlessness, decreased urine output, altered mental status",
      "Ensure the patient voids within 6 hours postpartum and document volume; a full bladder prevents uterine contraction and contributes to postpartum hemorrhage",
      "Reinforce patient education on expected lochia progression, when to seek medical attention (soaking a pad in less than 1 hour, large clots, fever, foul odor), and the importance of continued uterine assessment at home"
    ],
    assessmentFindings: [
      "Lochia rubra (days 1-3): dark red to bright red discharge containing blood, decidual tissue, and small clots; moderate amount is normal; heavy flow or large clots are abnormal",
      "Lochia serosa (days 4-10): pinkish-brown to serosanguinous discharge; contains old blood, serous fluid, leukocytes, and cervical mucus; scant to moderate amount",
      "Lochia alba (days 10 to 6 weeks): whitish-yellow to cream-colored discharge; contains leukocytes, decidual cells, epithelial cells, mucus, and bacteria; scant amount",
      "Boggy uterus: soft, poorly contracted fundus palpated above expected height; indicates uterine atony and is the leading cause of early postpartum hemorrhage",
      "Subinvolution: uterus remains larger than expected for the postpartum day; fundal height does not descend at expected rate of 1 cm per day; often accompanied by persistent red lochia",
      "Afterpains: cramping abdominal pain worsened by breastfeeding (oxytocin release); more common and more intense in multiparous women"
    ],
    signs: {
      left: [
        "Moderate lochia rubra in the first 24-72 hours postpartum",
        "Mild afterpains during breastfeeding",
        "Gradual lightening of lochia color over first week",
        "Firm uterine fundus at or just below the umbilicus",
        "Small clots (less than 2 centimeters) in the first 24 hours",
        "Mild perineal discomfort or swelling"
      ],
      right: [
        "Saturating more than one perineal pad per hour (postpartum hemorrhage)",
        "Boggy uterus not responding to fundal massage",
        "Passage of clots larger than a golf ball",
        "Return to bright red bleeding after progression to serosa or alba",
        "Foul-smelling lochia with fever (indicates endometritis)",
        "Tachycardia above 110 bpm with pallor, cold clammy skin, and hypotension (hypovolemic shock)"
      ]
    },
    medications: [
      {
        name: "Oxytocin (Pitocin)",
        type: "Uterotonic hormone (posterior pituitary hormone analog)",
        action: "Binds to oxytocin receptors on uterine smooth muscle cells, increasing intracellular calcium and stimulating rhythmic uterine contractions that compress spiral arteries at the placental site, achieving hemostasis and preventing postpartum hemorrhage",
        sideEffects: "Uterine hyperstimulation, water intoxication and hyponatremia (due to antidiuretic effect at high doses), nausea, vomiting, hypotension with rapid IV bolus",
        contra: "Contraindicated for labor induction when vaginal delivery is not indicated (e.g., complete placenta previa, vasa previa, active genital herpes, cord prolapse); use with caution in patients with cardiac disease",
        pearl: "For postpartum hemorrhage, the typical dose is 10-40 units in 1 liter of IV fluid infused at a rate to control bleeding; NEVER give undiluted IV push (can cause fatal hypotension and cardiac arrest); also used as a continuous infusion during the immediate postpartum period to maintain uterine tone"
      },
      {
        name: "Methylergonovine (Methergine)",
        type: "Ergot alkaloid uterotonic agent",
        action: "Directly stimulates sustained contraction of uterine smooth muscle by acting on alpha-adrenergic and serotonin receptors, producing a firm, tetanic contraction that compresses uterine blood vessels and controls hemorrhage",
        sideEffects: "Hypertension (can cause severe hypertensive crisis), nausea, vomiting, headache, dizziness, peripheral vasoconstriction, chest pain",
        contra: "Hypertension or preeclampsia (can cause severe hypertensive crisis, stroke, or seizure); coronary artery disease; peripheral vascular disease; concurrent use with potent CYP3A4 inhibitors",
        pearl: "ALWAYS check blood pressure BEFORE administering methylergonovine -- do NOT give if BP is above 140/90 mmHg; typically given IM 0.2 mg and can be repeated every 2-4 hours; can also be given orally for sustained uterine contraction after the acute phase"
      },
      {
        name: "Ibuprofen (Advil/Motrin)",
        type: "Nonsteroidal anti-inflammatory drug (NSAID / nonselective COX inhibitor)",
        action: "Inhibits cyclooxygenase-1 and cyclooxygenase-2 enzymes, blocking the synthesis of prostaglandins that mediate pain, inflammation, and uterine cramping; provides analgesic and anti-inflammatory effects for afterpains and perineal discomfort",
        sideEffects: "GI irritation (nausea, dyspepsia, gastric ulceration), headache, dizziness, renal impairment with prolonged use, increased bleeding risk through platelet inhibition",
        contra: "Active GI bleeding or peptic ulcer disease; severe renal impairment; third trimester of pregnancy (causes premature closure of ductus arteriosus); aspirin-exacerbated respiratory disease; immediately after coronary artery bypass graft surgery",
        pearl: "Ibuprofen is the preferred analgesic for afterpains because its anti-prostaglandin action directly targets the mechanism of uterine cramping; take with food to reduce GI side effects; safe for breastfeeding mothers as minimal transfer occurs to breast milk"
      }
    ],
    pearls: [
      "The progression of lochia follows a predictable pattern: rubra (red, days 1-3), serosa (pinkish-brown, days 4-10), alba (whitish-yellow, days 10-6 weeks) -- any regression (return to a previous stage) is abnormal and must be reported",
      "A boggy uterus is the number one cause of early postpartum hemorrhage (uterine atony accounts for 70-80% of cases) -- always check fundal tone when assessing lochia, as the two findings are directly related",
      "ALWAYS check blood pressure before administering methylergonovine -- this ergot alkaloid causes vasoconstriction and is contraindicated in patients with hypertension or preeclampsia due to risk of hypertensive crisis",
      "Tachycardia is often the FIRST sign of postpartum hemorrhage, appearing before hypotension -- a rising heart rate with increasing lochia flow should trigger immediate assessment and intervention",
      "A full bladder displaces the uterus and prevents effective contraction -- if the fundus is displaced to one side (usually the right) and is boggy, have the patient void or catheterize before performing further assessment",
      "Saturating one perineal pad per hour is the threshold for excessive bleeding -- teach patients to monitor pad saturation and report this finding immediately during their postpartum stay and after discharge",
      "Breastfeeding promotes uterine involution because infant suckling triggers endogenous oxytocin release from the posterior pituitary gland -- this is why multiparous breastfeeding mothers often report more intense afterpains"
    ],
    quiz: [
      {
        question: "A practical nurse assesses a postpartum patient 2 hours after vaginal delivery and finds the uterine fundus is soft and boggy, displaced to the right of midline. What is the priority nursing action?",
        options: [
          "Administer methylergonovine IM immediately",
          "Have the patient void or catheterize, then reassess fundal tone",
          "Apply an ice pack to the lower abdomen",
          "Document findings and reassess in one hour"
        ],
        correct: 1,
        rationale: "A uterus displaced to one side (usually the right) with a boggy consistency most commonly indicates a distended bladder. A full bladder prevents the uterus from contracting effectively. The priority is to empty the bladder first, then reassess fundal tone. If the uterus remains boggy after bladder emptying, fundal massage and uterotonic medications are indicated."
      },
      {
        question: "A postpartum patient is on day 7 and reports a return to bright red vaginal bleeding after her discharge had been pinkish-brown. What does this finding suggest?",
        options: [
          "Normal progression of lochia from serosa back to rubra",
          "Subinvolution or retained placental fragments requiring further assessment",
          "Expected response to increased physical activity",
          "Beginning of the first postpartum menstrual period"
        ],
        correct: 1,
        rationale: "A return to bright red bleeding (lochia rubra) after the expected progression to lochia serosa is abnormal and may indicate subinvolution, retained placental fragments, or excessive activity. This finding requires further assessment including fundal height measurement, uterine tone evaluation, and potential pelvic ultrasound. Lochia should progress in one direction only: rubra to serosa to alba."
      },
      {
        question: "The physician orders methylergonovine 0.2 mg IM for a postpartum patient with uterine atony not responding to fundal massage. The patient's blood pressure is 148/96 mmHg. What should the practical nurse do?",
        options: [
          "Administer the medication as ordered since uterine atony is the priority",
          "Hold the medication and notify the physician that the blood pressure is elevated",
          "Give half the ordered dose to reduce the risk of hypertension",
          "Administer the medication and recheck the blood pressure in 30 minutes"
        ],
        correct: 1,
        rationale: "Methylergonovine is contraindicated in patients with hypertension (BP above 140/90 mmHg) because it causes vasoconstriction and can precipitate a hypertensive crisis, stroke, or seizure. The practical nurse must hold the medication and notify the physician, who may order an alternative uterotonic such as oxytocin or carboprost."
      }
    ]
  },

  "lyme-disease-basics-rpn": {
    title: "Lyme Disease Basics for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Lyme Disease",
      content: "Lyme disease is a tick-borne infectious disease caused by the spirochete bacterium Borrelia burgdorferi (in North America) and transmitted to humans through the bite of infected Ixodes (black-legged or deer) ticks. It is the most common vector-borne disease in North America and Europe. The Ixodes tick has a two-year life cycle with three feeding stages (larva, nymph, adult), and each stage requires a blood meal. The primary reservoir hosts are white-footed mice (for larvae and nymphs) and white-tailed deer (for adult ticks). Nymphal ticks are responsible for most human infections because they are very small (approximately 1-2 mm, the size of a poppy seed) and often go undetected. After the tick attaches and begins feeding, it takes approximately 36-48 hours of attachment for the spirochete to be transmitted from the tick's midgut to its salivary glands and into the host. This critical window means that early tick removal significantly reduces transmission risk. Once inoculated into the skin, Borrelia burgdorferi multiplies locally and produces outer surface proteins that facilitate tissue invasion. The organism disseminates through the bloodstream and lymphatics to distant organs including the heart, joints, and central nervous system. The immune response to the spirochete, rather than the organism itself, is largely responsible for the tissue damage observed in later stages. Lyme disease progresses through three clinical stages if untreated. Stage 1 (early localized, 3-30 days after bite) is characterized by erythema migrans (EM), the classic expanding bull's-eye rash that occurs at the tick bite site in approximately 70-80% of infected individuals. The rash expands centrifugally, often clearing centrally, and is typically at least 5 centimeters in diameter. Stage 2 (early disseminated, weeks to months) involves hematogenous spread causing multiple EM lesions, carditis (particularly heart block), facial nerve (Bell) palsy, and meningitis. Stage 3 (late disseminated, months to years) is dominated by Lyme arthritis (large joint involvement, especially the knee) and chronic neurological manifestations including encephalopathy and peripheral neuropathy."
    },
    riskFactors: [
      "Living in or visiting endemic areas (northeastern United States, upper Midwest, southern Canada, northern Europe)",
      "Outdoor activities in wooded or grassy areas during tick season (late spring through early fall, May to September)",
      "Occupational exposure (forestry workers, park rangers, landscapers, farmers, outdoor construction workers)",
      "Failure to use protective measures (long sleeves, tick repellent containing DEET or permethrin-treated clothing)",
      "Delayed tick removal (transmission risk increases significantly after 36-48 hours of tick attachment)",
      "Residential proximity to deer habitat (deer are the primary host for adult Ixodes ticks)",
      "Pet ownership without tick prevention (dogs and cats can carry infected ticks into the home environment)"
    ],
    diagnostics: [
      "Clinical diagnosis of early localized Lyme disease: erythema migrans rash (at least 5 cm, expanding, often with central clearing) in a patient with tick exposure history is diagnostic; no serologic testing needed for classic EM",
      "Two-tier serologic testing (for disseminated or late disease): first-tier enzyme immunoassay (EIA/ELISA) for Borrelia antibodies, followed by confirmatory Western blot (IgM and IgG) if EIA is positive or equivocal",
      "Complete blood count (CBC): may show mild leukocytosis; often normal in early disease; helpful to rule out co-infections",
      "Erythrocyte sedimentation rate (ESR) and C-reactive protein (CRP): may be elevated, indicating systemic inflammation; useful for monitoring treatment response",
      "Electrocardiogram (ECG): indicated when cardiac involvement is suspected; Lyme carditis causes varying degrees of atrioventricular (AV) block, most commonly first-degree progressing to high-grade or complete heart block",
      "Lumbar puncture with cerebrospinal fluid analysis: indicated when neuroborreliosis is suspected; may show lymphocytic pleocytosis, elevated protein, and intrathecal Borrelia antibody production"
    ],
    management: [
      "Early localized disease: oral doxycycline 100 mg twice daily for 10-21 days (first-line for adults and children over 8 years); amoxicillin for children under 8 and pregnant women",
      "Early disseminated disease with neurological involvement: IV ceftriaxone 2 grams daily for 14-28 days for meningitis or significant CNS involvement",
      "Lyme carditis: hospitalization for cardiac monitoring; temporary pacemaker may be needed for high-grade AV block; IV ceftriaxone followed by oral antibiotics",
      "Lyme arthritis: oral doxycycline or amoxicillin for 28 days; if arthritis persists after one course, repeat oral antibiotics or switch to IV ceftriaxone",
      "Tick removal: use fine-tipped tweezers to grasp the tick as close to the skin surface as possible, pull upward with steady even pressure; do NOT twist, squeeze the body, or apply petroleum jelly, nail polish, or heat",
      "Prevention education: wear long sleeves and pants in wooded areas, use DEET-containing repellent on skin, treat clothing with permethrin, perform full-body tick checks within 2 hours of outdoor activity",
      "Post-exposure prophylaxis: a single dose of doxycycline 200 mg within 72 hours of tick removal may be offered in endemic areas when the tick was attached for 36 hours or more"
    ],
    nursingActions: [
      "Perform thorough skin assessment for tick bites and rashes in patients presenting with flu-like symptoms during tick season, especially in endemic areas",
      "Document rash characteristics precisely: location, size (measure in centimeters), shape (annular/oval), color pattern (central clearing, uniform erythema), borders (expanding vs static), and photograph if possible",
      "Educate patients and families on proper tick removal technique: use fine-tipped tweezers, grasp close to skin, pull straight up with steady pressure, clean the bite site with soap and water or alcohol",
      "Monitor for signs of disseminated disease: report new-onset facial droop (Bell palsy), irregular heart rhythm or palpitations, joint swelling, severe headache with neck stiffness, or numbness and tingling",
      "Reinforce antibiotic adherence: doxycycline must be taken for the full prescribed course even after symptoms improve; take with a full glass of water in an upright position to prevent esophageal irritation",
      "Monitor for Jarisch-Herxheimer reaction: fever, chills, myalgia, and worsening of symptoms within 24 hours of starting antibiotic treatment due to spirochete die-off releasing inflammatory mediators",
      "Provide prevention education: tick checks after outdoor activity (check behind ears, hairline, axillae, groin, behind knees), use of protective clothing, environmental management to reduce tick habitat"
    ],
    assessmentFindings: [
      "Erythema migrans (EM): expanding annular erythematous rash with or without central clearing (bull's-eye appearance), at least 5 cm in diameter, warm to touch, usually painless, appearing 3-30 days after tick bite",
      "Flu-like symptoms in early disease: fatigue, myalgia, arthralgia, headache, mild fever, cervical lymphadenopathy (often misdiagnosed as viral illness)",
      "Facial nerve palsy (Bell palsy): unilateral facial droop, inability to close eye, loss of nasolabial fold; may be bilateral in Lyme disease (bilateral Bell palsy should raise strong suspicion for Lyme)",
      "Cardiac findings in Lyme carditis: palpitations, dizziness, syncope, varying degrees of AV block on ECG (PR interval prolongation to complete heart block)",
      "Lyme arthritis: intermittent or persistent swelling of large joints (especially the knee), warm and erythematous, effusion present; typically occurs months after initial infection if untreated",
      "Neuroborreliosis findings: meningismus (headache, neck stiffness, photophobia), radiculopathy (shooting pains along nerve distributions), peripheral neuropathy (numbness, tingling in extremities)"
    ],
    signs: {
      left: [
        "Expanding erythematous rash at tick bite site (erythema migrans)",
        "Fatigue and generalized malaise",
        "Mild headache and myalgia",
        "Low-grade fever (temperature 37.5-38.5 degrees Celsius)",
        "Mild joint stiffness without visible swelling",
        "Regional lymphadenopathy near the tick bite"
      ],
      right: [
        "Bilateral facial nerve palsy (strong indicator of neuroborreliosis)",
        "Complete heart block or high-grade AV block (Lyme carditis requiring pacemaker)",
        "Meningitis signs (severe headache, neck rigidity, photophobia, altered consciousness)",
        "Acute large joint arthritis with significant effusion and limited mobility",
        "Syncope or presyncope from cardiac conduction abnormalities",
        "Progressive peripheral neuropathy with motor weakness and sensory loss"
      ]
    },
    medications: [
      {
        name: "Doxycycline (Vibramycin)",
        type: "Tetracycline antibiotic (bacteriostatic protein synthesis inhibitor)",
        action: "Binds to the 30S ribosomal subunit of Borrelia burgdorferi, preventing aminoacyl-tRNA from attaching to the mRNA-ribosome complex, thereby inhibiting bacterial protein synthesis and halting spirochete replication and dissemination",
        sideEffects: "Photosensitivity (severe sunburn risk), GI disturbance (nausea, esophageal ulceration if taken lying down), vaginal candidiasis, permanent tooth discoloration in children under 8 years",
        contra: "Pregnancy (category D -- causes fetal tooth discoloration and impaired bone growth); children under 8 years for courses longer than 21 days; severe hepatic impairment; concurrent use with isotretinoin (increased intracranial pressure)",
        pearl: "First-line treatment for Lyme disease in non-pregnant adults; must be taken upright with a full glass of water to prevent esophageal ulceration; advise strict sun protection during therapy; also provides coverage against co-infections (Anaplasma, Ehrlichia)"
      },
      {
        name: "Amoxicillin (Amoxil)",
        type: "Aminopenicillin antibiotic (bactericidal cell wall synthesis inhibitor)",
        action: "Binds to penicillin-binding proteins (PBPs) on the bacterial cell wall, inhibiting transpeptidase-mediated cross-linking of peptidoglycan layers, weakening the cell wall and causing osmotic lysis of Borrelia burgdorferi",
        sideEffects: "Diarrhea, nausea, skin rash (maculopapular rash in patients with mononucleosis), hypersensitivity reactions (urticaria to anaphylaxis), Clostridioides difficile-associated diarrhea",
        contra: "Known penicillin allergy or severe cephalosporin allergy (cross-reactivity); history of amoxicillin-associated cholestatic jaundice; concurrent use with allopurinol increases rash risk",
        pearl: "Preferred alternative to doxycycline for children under 8 years and pregnant women with Lyme disease; dose for Lyme is 500 mg three times daily for 14-21 days; always ask about penicillin allergy before administration"
      },
      {
        name: "Ceftriaxone (Rocephin)",
        type: "Third-generation cephalosporin antibiotic (bactericidal cell wall synthesis inhibitor)",
        action: "Binds to penicillin-binding proteins and disrupts bacterial cell wall synthesis; has excellent penetration across the blood-brain barrier, making it effective for neuroborreliosis and Lyme meningitis where oral antibiotics have insufficient CNS penetration",
        sideEffects: "Diarrhea, biliary sludging and pseudolithiasis (especially in children), injection site pain, rash, Clostridioides difficile-associated diarrhea, elevated liver enzymes",
        contra: "Known severe cephalosporin allergy; neonates with hyperbilirubinemia (displaces bilirubin from albumin); do NOT mix or administer simultaneously with calcium-containing IV solutions (precipitation risk)",
        pearl: "Reserved for disseminated Lyme disease with neurological or cardiac involvement; IV dose is 2 grams once daily for 14-28 days; can be administered via PICC line for outpatient IV therapy; monitor for gallbladder complications with prolonged courses"
      }
    ],
    pearls: [
      "Erythema migrans (the bull's-eye rash) is the hallmark of early Lyme disease and is present in approximately 70-80% of cases -- its presence with a compatible exposure history is diagnostic; serologic testing is NOT needed and may be falsely negative in early disease",
      "The critical tick attachment time for Borrelia transmission is 36-48 hours -- early tick removal within this window significantly reduces infection risk, which is why daily tick checks after outdoor activity are essential prevention",
      "Doxycycline is contraindicated in pregnancy and in children under 8 years for extended courses due to permanent tooth discoloration -- amoxicillin is the safe alternative for these populations",
      "Bilateral Bell palsy (facial nerve palsy affecting both sides) is unusual in most conditions but is a strong clinical indicator of Lyme disease and should prompt immediate serologic testing",
      "Lyme carditis can cause rapidly progressive heart block from first-degree to complete (third-degree) AV block -- any patient with Lyme disease who reports palpitations, dizziness, or syncope needs immediate ECG evaluation",
      "The Jarisch-Herxheimer reaction (fever, chills, worsening symptoms within 24 hours of starting antibiotics) is caused by inflammatory mediators released from dying spirochetes and is a self-limited process, not an allergic reaction -- do NOT discontinue antibiotics",
      "Post-treatment Lyme disease syndrome (persistent fatigue, pain, cognitive difficulties after completing appropriate antibiotic therapy) occurs in 10-20% of patients; prolonged or repeated antibiotic courses have NOT been shown to be beneficial and may cause harm"
    ],
    quiz: [
      {
        question: "A patient presents with a 7-centimeter expanding red rash with central clearing on the left thigh, 10 days after a camping trip in an endemic area. What is the most appropriate next step?",
        options: [
          "Order a two-tier serologic test (ELISA and Western blot) before starting treatment",
          "Recognize the rash as erythema migrans and anticipate orders for doxycycline",
          "Apply a topical antifungal cream and reassess in one week",
          "Order a complete blood count and blood cultures to rule out cellulitis"
        ],
        correct: 1,
        rationale: "An expanding rash of at least 5 cm with central clearing (erythema migrans) in a patient with tick exposure in an endemic area is diagnostic of early localized Lyme disease. Serologic testing is not needed and may be falsely negative in early disease because antibodies have not yet developed. Treatment with doxycycline should begin promptly based on the clinical diagnosis."
      },
      {
        question: "A practical nurse is educating a family about tick prevention. Which instruction is most important for reducing Lyme disease transmission after a tick is found attached?",
        options: [
          "Apply petroleum jelly to suffocate the tick and wait for it to detach",
          "Use fine-tipped tweezers to grasp the tick close to the skin and pull straight up with steady pressure",
          "Burn the tick with a match to force it to release its hold",
          "Crush the tick body between the fingers and wipe the area with alcohol"
        ],
        correct: 1,
        rationale: "The correct method for tick removal is to use fine-tipped tweezers, grasp the tick as close to the skin surface as possible, and pull upward with steady, even pressure. Folk remedies such as petroleum jelly, nail polish, or heat are ineffective and may cause the tick to regurgitate infectious material. Squeezing the tick body can also force bacteria into the skin."
      },
      {
        question: "A patient being treated for Lyme disease with doxycycline develops fever, chills, and worsening muscle aches 12 hours after the first dose. What does this reaction most likely represent?",
        options: [
          "An allergic reaction to doxycycline requiring immediate discontinuation",
          "A Jarisch-Herxheimer reaction from spirochete die-off",
          "A secondary bacterial infection requiring broader antibiotic coverage",
          "Treatment failure indicating the need to switch to intravenous antibiotics"
        ],
        correct: 1,
        rationale: "The Jarisch-Herxheimer reaction occurs within 24 hours of initiating antibiotic therapy for spirochetal infections. It is caused by inflammatory mediators released from dying organisms, not by drug allergy. The reaction is self-limited and resolves within 24-48 hours. Antibiotics should NOT be discontinued. Supportive care with antipyretics and fluids is appropriate."
      }
    ]
  },

  "lymphoma-basics-onc-rpn": {
    title: "Lymphoma Oncology Basics for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Hodgkin and Non-Hodgkin Lymphoma",
      content: "Lymphomas are a diverse group of malignant neoplasms arising from lymphocytes within the lymphatic system. The lymphatic system is a network of lymph nodes, lymphatic vessels, the spleen, thymus, tonsils, and bone marrow that functions as a critical component of the immune system. Lymphomas are broadly classified into two major categories: Hodgkin lymphoma (HL) and non-Hodgkin lymphoma (NHL), which differ in their cellular origin, pathological features, clinical behavior, and treatment approach. Hodgkin lymphoma is characterized by the presence of the Reed-Sternberg cell, a large binucleated or multinucleated cell with prominent eosinophilic nucleoli that give it a distinctive owl-eye appearance on microscopy. Reed-Sternberg cells are derived from germinal center B lymphocytes that have undergone malignant transformation. These cells typically comprise only 1-2% of the tumor mass; the remainder consists of a reactive inflammatory infiltrate of normal T cells, B cells, macrophages, eosinophils, and fibrotic tissue. Hodgkin lymphoma has a bimodal age distribution with peaks in young adults (15-35 years) and older adults (over 55 years), and it typically spreads in a predictable, contiguous pattern from one lymph node group to adjacent groups along lymphatic pathways. Non-Hodgkin lymphoma encompasses more than 60 subtypes arising from either B lymphocytes (85%) or T lymphocytes (15%) at various stages of differentiation. Unlike Hodgkin lymphoma, NHL tends to spread in a non-contiguous pattern and is more likely to involve extranodal sites (GI tract, skin, bone, brain) at presentation. NHL is further classified as indolent (low-grade, slow-growing such as follicular lymphoma) or aggressive (high-grade, rapidly growing such as diffuse large B-cell lymphoma [DLBCL]). Paradoxically, aggressive lymphomas are often more curable than indolent lymphomas because rapidly dividing cells are more susceptible to chemotherapy. Both HL and NHL are staged using the Ann Arbor staging system: Stage I (single lymph node region), Stage II (two or more regions on the same side of the diaphragm), Stage III (regions on both sides of the diaphragm), and Stage IV (disseminated involvement of extralymphatic organs such as liver, bone marrow, or lungs). Each stage is further designated A (no systemic symptoms) or B (presence of B symptoms: unexplained fever above 38 degrees Celsius, drenching night sweats, and unintentional weight loss greater than 10% of body weight in 6 months). B symptoms indicate more advanced disease and carry a worse prognosis."
    },
    riskFactors: [
      "Immunodeficiency or immunosuppression (HIV/AIDS, organ transplant recipients on immunosuppressive therapy)",
      "Prior Epstein-Barr virus (EBV) infection (associated with Hodgkin lymphoma and Burkitt lymphoma)",
      "Autoimmune diseases (Sjogren syndrome, rheumatoid arthritis, celiac disease increase NHL risk)",
      "Family history of lymphoma in first-degree relatives (2-3 fold increased risk)",
      "Chronic Helicobacter pylori infection (associated with gastric MALT lymphoma)",
      "Exposure to certain pesticides, herbicides, and industrial chemicals (benzene, Agent Orange)",
      "Age over 60 years (NHL incidence increases with age; HL has bimodal distribution with peak at 15-35 and over 55)"
    ],
    diagnostics: [
      "Excisional lymph node biopsy: the GOLD STANDARD for lymphoma diagnosis; provides tissue architecture needed to differentiate HL from NHL and identify specific subtypes; fine-needle aspiration is INSUFFICIENT for initial diagnosis",
      "CT scan of chest, abdomen, and pelvis with contrast: standard imaging for staging; identifies enlarged lymph nodes and organ involvement above and below the diaphragm",
      "PET/CT scan (positron emission tomography): identifies metabolically active disease that may appear normal on CT; essential for staging, treatment response assessment, and detecting residual disease after therapy",
      "Bone marrow aspiration and biopsy: required for complete staging; determines whether lymphoma has infiltrated the bone marrow (Stage IV disease); performed bilaterally from posterior iliac crests",
      "Complete blood count with differential: may show anemia, lymphocytopenia, eosinophilia (in HL), or circulating lymphoma cells; elevated WBC may indicate bone marrow involvement",
      "Lactate dehydrogenase (LDH) and erythrocyte sedimentation rate (ESR): LDH reflects tumor burden and cell turnover; ESR is a prognostic marker, especially in HL; both are used for risk stratification"
    ],
    management: [
      "Hodgkin lymphoma treatment: ABVD regimen (Adriamycin/doxorubicin, Bleomycin, Vinblastine, Dacarbazine) is the standard first-line chemotherapy; cure rates exceed 80% overall",
      "Radiation therapy: may be used alone for early-stage HL (involved-field radiation) or combined with chemotherapy; side effects include skin changes, fatigue, and long-term risk of secondary malignancies",
      "Non-Hodgkin lymphoma treatment: varies by subtype; aggressive NHL (DLBCL) treated with R-CHOP (Rituximab, Cyclophosphamide, Doxorubicin, Vincristine, Prednisone); indolent NHL may be monitored with watchful waiting",
      "Autologous or allogeneic stem cell transplant: for relapsed or refractory disease; involves high-dose chemotherapy followed by infusion of stored stem cells to rescue bone marrow function",
      "Tumor lysis syndrome prevention: aggressive IV hydration and allopurinol or rasburicase before starting chemotherapy for high tumor burden; monitor potassium, phosphorus, calcium, and uric acid",
      "Supportive care: antiemetics for chemotherapy-induced nausea, growth factors (filgrastim) for neutropenia, blood product transfusions, nutritional support, psychosocial support",
      "Long-term survivorship monitoring: surveillance for relapse, secondary malignancies (breast cancer after chest radiation, leukemia after chemotherapy), cardiac toxicity (anthracycline-related), pulmonary fibrosis (bleomycin-related), infertility"
    ],
    nursingActions: [
      "Assess lymph nodes systematically during each patient encounter: palpate cervical, supraclavicular, axillary, and inguinal chains; document size (centimeters), consistency (firm/rubbery/hard), mobility, and tenderness",
      "Monitor for B symptoms and document: measure temperature every 4 hours, ask about night sweats (severity, frequency, need to change bedding), weigh patient at same time daily with same clothing to track weight loss",
      "Implement infection prevention protocols during chemotherapy: monitor ANC, enforce hand hygiene, limit visitors with active infections, avoid live vaccines, report fever 38.3 degrees Celsius or higher immediately",
      "Monitor for chemotherapy-specific toxicities: cardiac function (LVEF) before each doxorubicin cycle, pulmonary function (DLCO) before each bleomycin cycle, neurological assessment for vincristine neuropathy",
      "Provide emotional support and address psychosocial needs: lymphoma diagnosis creates significant anxiety, especially in young adults; facilitate referrals to social work, psychology, and fertility preservation counseling",
      "Educate patient on signs requiring immediate medical attention: fever, bleeding, severe mouth sores, difficulty breathing, chest pain, uncontrolled nausea/vomiting, and numbness/tingling in extremities",
      "Coordinate discharge planning and follow-up: ensure patient understands treatment schedule, laboratory monitoring requirements, medication side effects, and long-term survivorship care plan"
    ],
    assessmentFindings: [
      "Painless lymphadenopathy: enlarged, firm, rubbery, non-tender lymph nodes, most commonly in the cervical, supraclavicular, or axillary regions; classic presenting sign of lymphoma",
      "B symptoms triad: unexplained fever above 38 degrees Celsius, drenching night sweats requiring bedding changes, unintentional weight loss greater than 10% of body weight in 6 months",
      "Mediastinal mass: large anterior mediastinal lymph node enlargement may cause superior vena cava syndrome (facial swelling, jugular venous distension, dyspnea) or cough and chest discomfort",
      "Hepatosplenomegaly: liver and spleen enlargement from lymphoma infiltration; may cause early satiety, left upper quadrant fullness, and abdominal discomfort",
      "Pruritus: generalized itching without visible rash, particularly common in Hodgkin lymphoma; may be severe and debilitating",
      "Alcohol-induced lymph node pain: pain in affected lymph nodes shortly after consuming alcohol; uncommon but pathognomonic for Hodgkin lymphoma when present"
    ],
    signs: {
      left: [
        "Single painless enlarged lymph node in cervical or axillary region",
        "Mild fatigue and decreased energy level",
        "Intermittent low-grade fever",
        "Mild generalized pruritus without rash",
        "Decreased appetite with minimal weight change",
        "Occasional night sweats not requiring clothing or bedding change"
      ],
      right: [
        "Superior vena cava syndrome (facial/neck swelling, dyspnea, jugular venous distension)",
        "Febrile neutropenia during chemotherapy (temperature 38.3 degrees Celsius or higher with ANC below 500)",
        "Spinal cord compression from epidural lymphoma (back pain, motor weakness, bowel/bladder dysfunction)",
        "Tumor lysis syndrome (hyperkalemia, hyperphosphatemia, hypocalcemia, hyperuricemia, acute kidney injury)",
        "Cardiac tamponade from pericardial effusion (hypotension, distended neck veins, muffled heart sounds)",
        "Massive splenomegaly with risk of splenic rupture (severe left upper quadrant pain, hemodynamic instability)"
      ]
    },
    medications: [
      {
        name: "ABVD Protocol (Doxorubicin/Adriamycin component)",
        type: "Anthracycline antineoplastic agent (topoisomerase II inhibitor)",
        action: "Intercalates into DNA strands and inhibits topoisomerase II enzyme, preventing DNA unwinding and replication; generates free radicals that cause direct DNA damage and apoptosis of lymphoma cells; the backbone of Hodgkin lymphoma treatment",
        sideEffects: "Cumulative dose-dependent cardiotoxicity (cardiomyopathy, heart failure -- lifetime maximum dose 550 mg/m2), myelosuppression, nausea and vomiting, alopecia, red-orange discoloration of urine, vesicant causing severe tissue necrosis if extravasation occurs",
        contra: "Severe cardiac disease or baseline LVEF below 50%; cumulative lifetime dose exceeded; severe hepatic impairment; active infection; pregnancy",
        pearl: "Monitor cardiac function with echocardiogram (LVEF) before EACH cycle -- hold if LVEF drops below 50% or decreases by more than 10% from baseline; red-orange urine is expected (not hematuria) -- educate patients to avoid alarm; ensure patent IV access before infusion as doxorubicin is a vesicant"
      },
      {
        name: "Rituximab (Rituxan)",
        type: "Monoclonal antibody (anti-CD20 chimeric antibody / targeted biologic therapy)",
        action: "Binds specifically to the CD20 antigen on the surface of B lymphocytes, triggering cell death through complement-dependent cytotoxicity (CDC), antibody-dependent cellular cytotoxicity (ADCC), and direct induction of apoptosis; selectively targets B-cell lymphomas expressing CD20",
        sideEffects: "Infusion-related reactions (fever, chills, rigors, hypotension, bronchospasm -- most common during first infusion), tumor lysis syndrome, progressive multifocal leukoencephalopathy (PML, rare but fatal), hepatitis B reactivation, prolonged B-cell depletion with increased infection risk",
        contra: "Severe active infections; known hepatitis B (screen before initiating -- can cause fatal reactivation); history of severe infusion reactions; PML; live vaccines during treatment",
        pearl: "Pre-medicate with acetaminophen, diphenhydramine, and corticosteroid 30 minutes before first infusion to reduce infusion reactions; start infusion at slow rate (50 mg/hour) and escalate gradually; monitor vital signs every 15 minutes during first infusion; have emergency resuscitation equipment immediately available"
      },
      {
        name: "Prednisone",
        type: "Synthetic glucocorticoid (systemic corticosteroid / anti-inflammatory and lympholytic agent)",
        action: "Binds to intracellular glucocorticoid receptors and modulates gene transcription, suppressing inflammatory cytokine production; has direct lympholytic (cell-killing) effects on lymphoma cells by inducing apoptosis; reduces tumor-associated edema and inflammation; component of CHOP and other NHL regimens",
        sideEffects: "Hyperglycemia (monitor blood glucose, especially in diabetic patients), immunosuppression and infection risk, insomnia and mood changes (irritability, euphoria, psychosis), gastric irritation and peptic ulcer risk, muscle weakness and proximal myopathy, osteoporosis with long-term use, adrenal suppression",
        contra: "Active systemic fungal infection; concurrent live vaccine administration; uncontrolled diabetes without close monitoring; active peptic ulcer disease without gastroprotection",
        pearl: "High-dose prednisone in lymphoma treatment can cause dramatic blood glucose elevation -- check blood glucose every 6 hours and anticipate insulin sliding scale orders; taper dose gradually after prolonged courses to prevent adrenal crisis; administer with food and consider PPI for GI protection; monitor for mood and behavioral changes"
      }
    ],
    pearls: [
      "The Reed-Sternberg cell (large binucleated cell with owl-eye appearance) is the pathognomonic finding of Hodgkin lymphoma and MUST be identified on biopsy for diagnosis -- excisional biopsy is required; fine-needle aspiration is insufficient",
      "B symptoms (fever above 38 degrees, drenching night sweats, weight loss greater than 10% in 6 months) indicate systemic disease and carry worse prognosis -- always assess and document these at every encounter",
      "Hodgkin lymphoma spreads in a CONTIGUOUS pattern (from one lymph node group to the next adjacent group), while non-Hodgkin lymphoma spreads NON-CONTIGUOUSLY (can skip node groups and involve extranodal sites) -- this difference affects staging and treatment",
      "Doxorubicin (Adriamycin) has a cumulative lifetime dose limit of 550 mg/m2 due to irreversible cardiotoxicity -- cardiac function (LVEF by echocardiogram) must be monitored before each cycle",
      "Rituximab infusion reactions are most common during the FIRST infusion -- pre-medicate with acetaminophen, diphenhydramine, and corticosteroid; start at slow rate; have emergency equipment available; subsequent infusions are usually better tolerated",
      "Alcohol-induced pain in lymph nodes is rare but pathognomonic for Hodgkin lymphoma -- if a patient reports pain in a swollen lymph node after drinking alcohol, this finding should be documented and reported immediately",
      "Screen ALL patients for hepatitis B before starting rituximab -- rituximab can cause fatal hepatitis B reactivation even in patients with resolved past infection (HBsAg negative, anti-HBc positive)"
    ],
    quiz: [
      {
        question: "A practical nurse is assessing a 25-year-old patient who presents with painless, firm, rubbery cervical lymphadenopathy, drenching night sweats, and 12% weight loss over the past 4 months. Which diagnostic test is required to confirm the suspected diagnosis?",
        options: [
          "Fine-needle aspiration of the cervical lymph node",
          "Complete blood count with differential and peripheral smear",
          "Excisional lymph node biopsy with histopathological examination",
          "CT scan of the chest, abdomen, and pelvis"
        ],
        correct: 2,
        rationale: "Excisional lymph node biopsy is the gold standard for lymphoma diagnosis because it preserves the tissue architecture needed to identify Reed-Sternberg cells (for Hodgkin lymphoma) or classify NHL subtypes. Fine-needle aspiration is insufficient because it does not preserve nodal architecture. CBC and CT are part of the workup but cannot confirm the diagnosis."
      },
      {
        question: "A patient with Hodgkin lymphoma is scheduled for ABVD chemotherapy. Before administering the doxorubicin (Adriamycin) component, which test result must the practical nurse verify?",
        options: [
          "Serum creatinine and blood urea nitrogen",
          "Left ventricular ejection fraction (LVEF) on echocardiogram",
          "Prothrombin time and international normalized ratio",
          "Thyroid-stimulating hormone level"
        ],
        correct: 1,
        rationale: "Doxorubicin causes cumulative dose-dependent cardiotoxicity (cardiomyopathy and heart failure). Left ventricular ejection fraction must be monitored before each cycle, and the drug should be held if LVEF drops below 50% or decreases more than 10% from baseline. The lifetime cumulative dose should not exceed 550 mg/m2."
      },
      {
        question: "During the first rituximab infusion, a patient develops fever, chills, and rigors. The practical nurse should recognize this as which type of reaction?",
        options: [
          "Anaphylaxis requiring immediate epinephrine administration",
          "Expected infusion-related reaction managed by slowing the rate and administering supportive medications",
          "Tumor lysis syndrome requiring aggressive IV hydration",
          "Sepsis from an undetected infection requiring broad-spectrum antibiotics"
        ],
        correct: 1,
        rationale: "Infusion-related reactions (fever, chills, rigors, sometimes hypotension and bronchospasm) are common during the first rituximab infusion and occur in up to 77% of patients. Management includes temporarily stopping or slowing the infusion rate and administering additional diphenhydramine, acetaminophen, and corticosteroids. This is different from true anaphylaxis. Subsequent infusions are usually better tolerated."
      }
    ]
  },

  "lymphoma-basics-rpn": {
    title: "Lymphatic System and Lymphoma Assessment for Practical Nurses",
    cellular: {
      title: "Anatomy of the Lymphatic System and Lymphoma Overview",
      content: "The lymphatic system is an extensive network of vessels, nodes, and organs that serves three critical functions: immune surveillance and defense, fluid balance maintenance, and absorption of dietary fats. Unlike the cardiovascular system, the lymphatic system is a one-way system that collects excess interstitial fluid (lymph) from tissues and returns it to the venous circulation via the thoracic duct (which drains into the left subclavian vein) and the right lymphatic duct (which drains the right arm, right side of head, and right thorax into the right subclavian vein). Lymph nodes are small, bean-shaped structures ranging from 1 to 25 millimeters that are distributed throughout the body, with major clusters in the cervical, axillary, inguinal, mediastinal, and mesenteric regions. Each lymph node contains organized zones of B lymphocytes (in follicles), T lymphocytes (in the paracortex), and macrophages that filter lymph fluid, trap and destroy pathogens, and initiate adaptive immune responses. The spleen, the largest lymphatic organ, filters blood rather than lymph and serves as a reservoir for platelets and a site for removal of old or damaged red blood cells. The thymus (most active during childhood) is where T lymphocytes mature and undergo selection. Lymphoma develops when lymphocytes undergo malignant transformation and proliferate uncontrollably within the lymphatic system. The term lymphadenopathy refers to any enlargement of lymph nodes and has many causes including infection (reactive lymphadenopathy), autoimmune disease, and malignancy. When assessing lymph nodes, the practical nurse must document specific characteristics that help differentiate benign from malignant enlargement. Benign (reactive) lymph nodes are typically tender, soft, mobile, and less than 1 centimeter. Malignant lymph nodes are typically painless, firm or rubbery (in lymphoma) or hard and fixed (in metastatic carcinoma), greater than 2 centimeters, and progressively enlarging. Supraclavicular lymphadenopathy is particularly concerning and should always be reported, as it has a high association with malignancy (Virchow node on the left supraclavicular area may indicate gastric or abdominal malignancy). The practical nurse plays a vital role in systematic lymph node assessment, accurate documentation, monitoring for disease progression, managing treatment side effects, and providing patient education and emotional support."
    },
    riskFactors: [
      "Immunodeficiency states (HIV infection, congenital immunodeficiency, chronic immunosuppressive therapy)",
      "Prior organ transplantation with long-term immunosuppression (increased risk of post-transplant lymphoproliferative disorder)",
      "Viral infections: Epstein-Barr virus (Hodgkin and Burkitt lymphoma), HTLV-1 (adult T-cell lymphoma), HHV-8 (primary effusion lymphoma)",
      "Chronic inflammatory or autoimmune conditions (Hashimoto thyroiditis, celiac disease, Sjogren syndrome)",
      "Chemical and radiation exposure (agricultural pesticides, benzene, prior radiation therapy for other malignancies)",
      "Age over 60 years for non-Hodgkin lymphoma (incidence increases progressively with age)",
      "Chronic infection with Helicobacter pylori (associated with gastric mucosa-associated lymphoid tissue [MALT] lymphoma)"
    ],
    diagnostics: [
      "Lymph node palpation and systematic assessment: evaluate all accessible lymph node groups (cervical, preauricular, postauricular, occipital, supraclavicular, axillary, epitrochlear, inguinal) documenting size, consistency, mobility, tenderness, and distribution",
      "Excisional biopsy of the most abnormal lymph node: provides complete tissue architecture for histopathological analysis; allows identification of lymphoma subtype, grade, and immunophenotype; fine-needle aspiration alone is inadequate for initial lymphoma diagnosis",
      "CT scan with contrast (chest, abdomen, pelvis): identifies enlarged lymph nodes above and below the diaphragm and evaluates organ involvement for Ann Arbor staging",
      "PET/CT scan: detects metabolically active lymphoma tissue; used for initial staging, interim response assessment, and end-of-treatment evaluation; SUV (standardized uptake value) quantifies metabolic activity",
      "Bone marrow biopsy (bilateral posterior iliac crest): determines bone marrow involvement (Stage IV); essential for complete staging in NHL; may not be required for all HL patients with negative PET scan",
      "Blood work panel: CBC with differential (cytopenias suggest marrow involvement), LDH (correlates with tumor burden), ESR (prognostic in HL), beta-2 microglobulin (prognostic in NHL), hepatitis B serology (required before rituximab), HIV testing"
    ],
    management: [
      "Staging-dependent treatment: early-stage disease (I-II) may require abbreviated chemotherapy with or without radiation; advanced-stage (III-IV) requires full-course systemic chemotherapy",
      "Chemotherapy regimens: ABVD for Hodgkin lymphoma (doxorubicin, bleomycin, vinblastine, dacarbazine); R-CHOP for aggressive NHL (rituximab, cyclophosphamide, doxorubicin, vincristine, prednisone)",
      "Radiation therapy: involved-site radiation for early-stage HL; palliative radiation for symptom control; long-term risks include secondary malignancies and hypothyroidism if neck field is included",
      "Immunotherapy: rituximab (anti-CD20) for B-cell NHL; brentuximab vedotin (anti-CD30) for relapsed HL; checkpoint inhibitors (nivolumab, pembrolizumab) for refractory HL",
      "Stem cell transplantation: autologous transplant for relapsed or refractory disease; allogeneic transplant for select high-risk patients; requires intensive pre-transplant conditioning",
      "Watchful waiting (for indolent NHL): some low-grade lymphomas do not require immediate treatment; regular monitoring with physical examination, bloodwork, and imaging at defined intervals",
      "Supportive care throughout treatment: antiemetics, growth factors for neutropenia, transfusions, infection prophylaxis, fertility preservation counseling before treatment, psychosocial support"
    ],
    nursingActions: [
      "Perform systematic lymph node assessment at each visit: palpate all accessible node groups using the pads of the fingers in a gentle circular motion; document size in centimeters, location, consistency, mobility, tenderness, and any changes from baseline",
      "Assess for B symptoms at every encounter: measure temperature, weigh patient on the same scale with same clothing, and specifically ask about night sweats (frequency, severity, need to change clothing or bedding)",
      "Monitor for complications of chemotherapy: check CBC results before each cycle, assess oral mucosa for mucositis, evaluate IV access site for extravasation signs, monitor for peripheral neuropathy (vincristine), and assess respiratory status (bleomycin pulmonary toxicity)",
      "Implement neutropenic precautions when ANC is below 500/microL: private room, strict hand hygiene, no fresh flowers or raw foods, limit visitors, monitor temperature every 4 hours, report fever immediately",
      "Provide pre-infusion care for rituximab: verify hepatitis B screening is documented, pre-medicate with acetaminophen, diphenhydramine, and corticosteroid; monitor vital signs every 15 minutes during first infusion; have emergency equipment at bedside",
      "Support patient through biopsy procedures: explain the procedure (excisional biopsy under local or general anesthesia), provide pre- and post-procedure instructions, monitor the incision site for bleeding and infection signs",
      "Coordinate follow-up care and long-term surveillance: ensure patient understands the surveillance schedule (regular imaging, bloodwork, physical examination), late effects of treatment, and when to seek immediate medical attention"
    ],
    assessmentFindings: [
      "Lymphadenopathy characteristics suggesting malignancy: painless, firm, rubbery, non-tender, greater than 2 centimeters, progressively enlarging, fixed or matted (multiple nodes fused together)",
      "Systemic symptoms of lymphoma: unexplained persistent fatigue, generalized pruritus (especially in HL), recurrent infections from immune dysfunction, early satiety from splenomegaly",
      "B symptoms indicating advanced disease: fever above 38 degrees Celsius (recurrent, unexplained), drenching night sweats (soaking bedding), unintentional weight loss exceeding 10% of body weight within 6 months",
      "Superior vena cava syndrome: facial and upper extremity edema, dilated chest wall veins (collateral circulation), dyspnea, cough, headache worsened by bending forward -- caused by mediastinal lymph node mass compressing the SVC",
      "Splenomegaly: palpable spleen below the left costal margin (normally not palpable), left upper quadrant fullness or discomfort, early satiety due to gastric compression",
      "Cytopenias from bone marrow involvement: pallor and fatigue (anemia), petechiae and bleeding (thrombocytopenia), recurrent infections (neutropenia)"
    ],
    signs: {
      left: [
        "Painless enlarged lymph node detected during routine assessment",
        "Mild fatigue not fully explained by other factors",
        "Intermittent pruritus without visible skin rash",
        "Occasional low-grade fever that resolves spontaneously",
        "Mild unintentional weight loss (less than 5% in 6 months)",
        "Single mildly enlarged lymph node region"
      ],
      right: [
        "Rapidly enlarging lymph node mass causing airway or vascular compression",
        "Superior vena cava syndrome (facial swelling, dyspnea, distended neck and chest veins)",
        "Spinal cord compression from epidural lymphoma (acute back pain with progressive leg weakness and bowel/bladder dysfunction)",
        "Febrile neutropenia during chemotherapy (ANC below 500 with fever 38.3 degrees Celsius or higher)",
        "Tumor lysis syndrome after treatment initiation (hyperkalemia with cardiac dysrhythmias, acute renal failure)",
        "Severe bleeding or spontaneous hemorrhage from profound thrombocytopenia (platelet count below 10,000)"
      ]
    },
    medications: [
      {
        name: "Cyclophosphamide (Cytoxan)",
        type: "Alkylating agent (nitrogen mustard derivative / antineoplastic chemotherapy)",
        action: "Metabolized by the liver into active metabolites (phosphoramide mustard) that cross-link DNA strands, preventing DNA replication and transcription, ultimately leading to cell death in rapidly dividing lymphoma cells during any phase of the cell cycle",
        sideEffects: "Myelosuppression (neutropenia nadir at 7-14 days), nausea and vomiting, alopecia, hemorrhagic cystitis (from toxic metabolite acrolein irritating bladder mucosa), infertility, secondary malignancy risk with long-term use, immunosuppression",
        contra: "Severe bone marrow suppression; active urinary tract infection or hemorrhagic cystitis; severely impaired renal function; pregnancy and breastfeeding",
        pearl: "Hemorrhagic cystitis prevention is essential: ensure aggressive IV hydration, encourage frequent voiding (every 2 hours during and for 24 hours after infusion), and administer mesna (uroprotectant) as ordered to neutralize acrolein in the bladder; monitor urine for hematuria"
      },
      {
        name: "Doxorubicin (Adriamycin)",
        type: "Anthracycline antineoplastic agent (topoisomerase II inhibitor / DNA intercalator)",
        action: "Intercalates between DNA base pairs and inhibits topoisomerase II, preventing DNA strand re-ligation after unwinding; generates reactive oxygen species (free radicals) that directly damage DNA and cell membranes; effective against both rapidly and slowly dividing lymphoma cells",
        sideEffects: "Cardiotoxicity (acute: dysrhythmias, pericarditis; chronic: dilated cardiomyopathy, heart failure -- cumulative dose-dependent, maximum 550 mg/m2), severe myelosuppression, mucositis, nausea, alopecia (nearly universal), red-orange urine discoloration, vesicant causing tissue necrosis on extravasation",
        contra: "Baseline left ventricular ejection fraction below 50%; cumulative lifetime dose exceeded (550 mg/m2, or 450 mg/m2 if prior chest radiation); severe hepatic impairment; recent myocardial infarction; severe persistent myelosuppression",
        pearl: "Monitor LVEF by echocardiogram before each cycle; warn patients about red-orange urine (not blood) for 1-2 days after treatment; as a vesicant, ensure blood return from IV before and during infusion; if extravasation occurs, stop infusion immediately and apply cold compresses (NOT heat); administer dexrazoxane if available for extravasation treatment"
      },
      {
        name: "Vincristine (Oncovin)",
        type: "Vinca alkaloid antineoplastic agent (mitotic spindle inhibitor / plant alkaloid)",
        action: "Binds to tubulin protein dimers, preventing their polymerization into microtubules needed for mitotic spindle formation during cell division (M-phase); without the mitotic spindle, the cell cannot segregate chromosomes and undergoes mitotic arrest and apoptosis",
        sideEffects: "Peripheral neuropathy (most common dose-limiting toxicity: numbness, tingling, foot drop, loss of deep tendon reflexes), constipation and paralytic ileus (autonomic neuropathy), jaw pain, alopecia, SIADH, vesicant",
        contra: "Demyelinating form of Charcot-Marie-Tooth disease; NEVER give intrathecally (universally fatal -- causes ascending paralysis and death); significant pre-existing neurotoxicity",
        pearl: "Intrathecal vincristine is ALWAYS FATAL -- verify route is IV at every administration; assess deep tendon reflexes and peripheral sensation before each dose; institute prophylactic bowel regimen (stool softeners and stimulant laxatives) to prevent severe constipation from autonomic neuropathy; maximum single dose typically capped at 2 mg"
      }
    ],
    pearls: [
      "When palpating lymph nodes, characteristics suggesting malignancy include: painless, firm or rubbery, non-tender, greater than 2 cm, progressive enlargement, fixed or matted -- benign reactive nodes are typically tender, soft, mobile, and less than 1 cm",
      "Supraclavicular lymphadenopathy has the highest association with malignancy of any lymph node location -- a palpable left supraclavicular node (Virchow node) may indicate abdominal malignancy (particularly gastric cancer) and should ALWAYS be reported and investigated",
      "The Ann Arbor staging system determines treatment approach: Stage I (single node region), Stage II (two or more regions same side of diaphragm), Stage III (both sides of diaphragm), Stage IV (extranodal organ involvement such as liver, bone marrow, lung)",
      "NEVER administer vincristine intrathecally -- this error is universally fatal; always verify the route is intravenous and confirm with a second nurse before administration; many institutions have implemented specific safety protocols to prevent this error",
      "Cyclophosphamide causes hemorrhagic cystitis from its toxic metabolite acrolein -- prevent by ensuring aggressive hydration, frequent voiding every 2 hours, and mesna administration as ordered; teach patients to report any blood in urine immediately",
      "Doxorubicin (Adriamycin) has a lifetime cumulative dose limit of 550 mg/m2 due to irreversible cardiac damage -- always verify cumulative dose before administration and monitor LVEF by echocardiogram before each cycle",
      "Fine-needle aspiration is NEVER sufficient for initial lymphoma diagnosis because it does not preserve the nodal architecture needed to differentiate lymphoma subtypes and identify Reed-Sternberg cells -- excisional biopsy of the entire lymph node is required"
    ],
    quiz: [
      {
        question: "A practical nurse palpates a 3-centimeter, firm, non-tender, fixed cervical lymph node in a patient who has been experiencing night sweats and unintentional weight loss. Which characteristic of this lymph node is MOST concerning for malignancy?",
        options: [
          "Location in the cervical region",
          "Size of 3 centimeters with firm consistency and fixation",
          "Association with weight loss symptoms",
          "Presence in a patient who appears otherwise well"
        ],
        correct: 1,
        rationale: "While all findings are important in the clinical picture, the node characteristics most suggestive of malignancy are its large size (greater than 2 cm), firm consistency, and fixation (non-mobile). Benign reactive lymph nodes are typically less than 1 cm, soft, tender, and mobile. Fixed or matted nodes suggest invasion into surrounding tissue, which is a hallmark of malignant disease."
      },
      {
        question: "A patient receiving cyclophosphamide chemotherapy for non-Hodgkin lymphoma reports pink-tinged urine 6 hours after infusion. What complication should the practical nurse suspect?",
        options: [
          "Normal discoloration from the chemotherapy drug",
          "Hemorrhagic cystitis from the toxic metabolite acrolein",
          "Urinary tract infection requiring antibiotic treatment",
          "Dehydration causing concentrated urine"
        ],
        correct: 1,
        rationale: "Hemorrhagic cystitis is a known complication of cyclophosphamide caused by its toxic metabolite acrolein, which irritates the bladder mucosa and causes bleeding. Pink-tinged or bloody urine after cyclophosphamide infusion should be reported immediately. Prevention includes aggressive IV hydration, frequent voiding every 2 hours, and administration of the uroprotectant mesna. Note: red-orange urine is associated with doxorubicin, not cyclophosphamide."
      },
      {
        question: "A practical nurse is preparing to administer vincristine to a lymphoma patient. Which safety measure is the HIGHEST priority before administration?",
        options: [
          "Checking the patient's serum creatinine level",
          "Verifying the route is intravenous and NOT intrathecal",
          "Ensuring the patient has eaten within the past 2 hours",
          "Confirming the patient's most recent weight for dose calculation"
        ],
        correct: 1,
        rationale: "The highest priority safety measure for vincristine is verifying the route is intravenous. Intrathecal administration of vincristine is universally fatal, causing ascending paralysis and death. This is considered a never event in healthcare. Many institutions have implemented specific safety protocols including special labeling, dual verification, and physical separation from intrathecal medications to prevent this error."
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
console.log(`Done: ${ok} injected, ${skip} skipped`);
