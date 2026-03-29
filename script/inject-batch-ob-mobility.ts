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
  "mobility-decline-rpn": {
    title: "Mobility Decline and Immobility Complications for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Immobility and Mobility Decline",
      content: "Mobility is a fundamental human function that depends on the coordinated interaction of the musculoskeletal, neurological, and cardiovascular systems. When a patient becomes immobile -- whether due to illness, injury, surgery, or age-related decline -- every organ system is affected through predictable pathophysiological mechanisms. The musculoskeletal system begins to deteriorate rapidly: skeletal muscle loses approximately 1-3% of its strength per day of complete bedrest, a process called disuse atrophy. Type II (fast-twitch) muscle fibers atrophy first, reducing the patient's ability to perform quick movements needed for balance and fall prevention. Collagen fibers in tendons, ligaments, and joint capsules begin to shorten and cross-link within 48-72 hours of immobility, forming contractures that can become permanent if not addressed. The most common contracture sites are the hips (flexion contracture from prolonged sitting), knees, ankles (foot drop from plantar flexion), and shoulders. Bone remodeling shifts toward resorption as mechanical stress is removed; osteoclast activity increases while osteoblast activity decreases, leading to disuse osteoporosis and increasing fracture risk. Calcium mobilized from bone enters the bloodstream, increasing the risk of hypercalcemia, renal calculi, and pathological fractures. The cardiovascular system responds to immobility with orthostatic intolerance: the baroreceptor reflex becomes less responsive, cardiac output decreases by approximately 0.8% per day, and plasma volume decreases by up to 10% within the first week. Venous stasis in the lower extremities increases the risk of deep vein thrombosis (DVT) through Virchow triad: stasis, endothelial injury, and hypercoagulability. The respiratory system is compromised as diaphragm excursion decreases in the supine position, functional residual capacity drops, and secretions pool in dependent lung segments. Hypostatic pneumonia develops when these pooled secretions become infected. Atelectasis occurs as small airways collapse without the benefit of deep breathing and position changes. The integumentary system is vulnerable to pressure injury formation: sustained pressure exceeding capillary closing pressure (approximately 32 mmHg) compresses blood vessels between the skin and underlying bone, causing tissue ischemia and necrosis. The most common pressure injury sites are the sacrum, heels, ischial tuberosities, greater trochanters, and occiput. The gastrointestinal system slows with decreased peristalsis, leading to constipation and potential fecal impaction. The urinary system develops urinary stasis, increasing the risk of urinary tract infection (UTI) and renal calculi. Psychologically, immobility contributes to depression, social isolation, altered sleep patterns, and cognitive decline, particularly in older adults. The practical nurse plays a critical role in preventing these complications through early mobilization, regular repositioning, range-of-motion exercises, and vigilant monitoring of all body systems affected by immobility."
    },
    riskFactors: [
      "Advanced age (sarcopenia, decreased bone density, reduced proprioception, slower recovery from illness)",
      "Recent surgery or hospitalization (post-operative pain limits movement, anesthesia effects reduce mobility drive)",
      "Neurological disorders (stroke, spinal cord injury, Parkinson disease, multiple sclerosis affecting motor pathways)",
      "Chronic pain conditions (osteoarthritis, chronic back pain, fibromyalgia discouraging movement)",
      "Obesity (excessive body weight increases joint stress, reduces exercise tolerance, impairs balance)",
      "Depression and cognitive impairment (decreased motivation to mobilize, inability to follow mobility instructions)",
      "Use of sedating medications (opioids, benzodiazepines, antihistamines reducing alertness and coordination)"
    ],
    diagnostics: [
      "Doppler ultrasound of lower extremities: first-line for suspected DVT; detects venous thrombosis through absence of compressibility and altered blood flow patterns",
      "D-dimer blood test: elevated levels suggest active clot formation; useful for ruling out DVT/PE when negative; not specific (elevated in infection, surgery, pregnancy)",
      "Braden Scale assessment: standardized tool scored every shift to predict pressure injury risk; scores 18 or below indicate at-risk status requiring preventive interventions",
      "Bone density scan (DEXA): identifies disuse osteoporosis from prolonged immobility; T-score of -2.5 or less indicates osteoporosis",
      "Serum calcium and phosphorus levels: monitor for hypercalcemia from bone resorption; elevated calcium above 2.6 mmol/L requires physician notification",
      "Chest X-ray: identifies atelectasis (areas of lung collapse) and hypostatic pneumonia in immobile patients; compare with baseline imaging"
    ],
    management: [
      "Implement progressive early mobilization protocol: dangle at bedside, stand with assistance, ambulate with gait belt as tolerated; increase activity incrementally each day",
      "Reposition immobile patients at minimum every 2 hours using a turning schedule; document position and time with each turn to prevent pressure injury",
      "Apply sequential compression devices (SCDs) or anti-embolism stockings as ordered to prevent DVT; remove briefly each shift to assess skin integrity",
      "Perform passive and active range-of-motion (ROM) exercises at least twice daily to prevent contractures and maintain joint flexibility",
      "Maintain high-fiber diet with adequate fluid intake (minimum 1500-2000 mL daily unless fluid restricted) to prevent constipation from decreased GI motility",
      "Elevate head of bed 30 degrees or higher during meals and for 30 minutes after to prevent aspiration; maintain semi-Fowler position to improve lung expansion",
      "Implement fall prevention measures: bed in lowest position, call light within reach, non-slip footwear, clear pathways, bed alarm if indicated"
    ],
    nursingActions: [
      "Assess mobility status using a standardized mobility scale at admission and every shift; document functional ability including transfers, ambulation distance, and assistance needed",
      "Perform Braden Scale assessment every shift for hospitalized patients; initiate pressure injury prevention protocol for scores of 18 or below",
      "Assess bilateral lower extremities every shift for signs of DVT: calf tenderness, unilateral swelling, warmth, redness; measure calf circumference if DVT suspected and report findings",
      "Monitor respiratory status every 4 hours: auscultate lung sounds, encourage incentive spirometry (10 repetitions every 1-2 hours while awake), report diminished or adventitious sounds",
      "Assess skin integrity with each repositioning: inspect bony prominences for redness, blanching, breakdown; use pressure-relieving devices (specialty mattresses, heel protectors, foam wedges)",
      "Monitor bowel function: document frequency and consistency of bowel movements; report no bowel movement for 3 or more days; administer stool softeners as ordered",
      "Assess for orthostatic hypotension before ambulation: check blood pressure lying, sitting, and standing; report systolic drop greater than 20 mmHg or diastolic drop greater than 10 mmHg"
    ],
    assessmentFindings: [
      "Muscle weakness and decreased muscle mass (visible atrophy in quadriceps, hand grip, and shoulder muscles within days of immobility)",
      "Joint stiffness and reduced range of motion (particularly hip flexion, knee extension, and ankle dorsiflexion)",
      "Skin redness over bony prominences that does not blanch with fingertip pressure (Stage 1 pressure injury indicating tissue damage)",
      "Unilateral leg swelling with calf tenderness and warmth (positive Homans sign is no longer recommended but unilateral edema requires DVT workup)",
      "Diminished breath sounds in dependent lung bases with fine crackles (indicating atelectasis or early hypostatic pneumonia)",
      "Constipation with decreased or absent bowel sounds, abdominal distension, and patient report of no bowel movement for 3 or more days",
      "Orthostatic hypotension with dizziness, lightheadedness, and near-syncope when transitioning from lying to sitting or standing position"
    ],
    signs: {
      left: [
        "Decreased muscle strength and endurance with activity",
        "Joint stiffness and reluctance to move affected limbs",
        "Non-blanching redness over sacrum or heels",
        "Mild bilateral ankle edema after prolonged sitting",
        "Decreased appetite and mild constipation",
        "Low mood and decreased motivation to participate in care"
      ],
      right: [
        "Acute unilateral leg swelling with calf pain (possible DVT requiring urgent assessment)",
        "Sudden dyspnea with chest pain and tachycardia (possible pulmonary embolism)",
        "Stage 3 or 4 pressure injury with tissue necrosis or exposed bone",
        "Severe orthostatic hypotension with syncope and fall",
        "High fever with productive cough and hypoxia (hypostatic pneumonia)",
        "Fixed joint contracture preventing functional positioning"
      ]
    },
    medications: [
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low-molecular-weight heparin (LMWH) anticoagulant",
        action: "Binds to antithrombin III and preferentially inhibits Factor Xa, preventing the conversion of prothrombin to thrombin and disrupting the coagulation cascade; provides DVT prophylaxis in immobile patients by preventing new clot formation in areas of venous stasis",
        sideEffects: "Bleeding (gingival, epistaxis, GI, intracranial), injection site bruising and hematomas, thrombocytopenia (HIT less common than with unfractionated heparin), elevated liver enzymes",
        contra: "Active major bleeding; history of heparin-induced thrombocytopenia (HIT); severe thrombocytopenia (platelets below 50,000); epidural catheter in situ (risk of spinal hematoma)",
        pearl: "Administer subcutaneously in the abdomen rotating sites; do NOT rub the injection site after administration as this increases bruising; monitor platelet count baseline and periodically; prophylactic dose (40 mg daily) is different from treatment dose (1 mg/kg every 12 hours)"
      },
      {
        name: "Bisacodyl (Dulcolax)",
        type: "Stimulant laxative",
        action: "Directly stimulates the myenteric nerve plexus in the colonic wall, increasing peristaltic contractions and promoting fluid and electrolyte accumulation in the intestinal lumen; effective for immobility-related constipation within 6-12 hours orally or 15-60 minutes rectally",
        sideEffects: "Abdominal cramping, diarrhea, nausea, electrolyte imbalances (hypokalemia with chronic use), rectal irritation with suppository form",
        contra: "Intestinal obstruction; acute abdominal conditions (appendicitis, peritonitis); severe dehydration; fecal impaction requiring manual disimpaction first",
        pearl: "Oral tablets are enteric-coated and must NOT be crushed, chewed, or given with milk or antacids (premature coating dissolution causes gastric irritation); encourage adequate fluid intake during use; not intended for daily long-term use -- address underlying cause of constipation"
      },
      {
        name: "Calcium Carbonate (Tums/Os-Cal)",
        type: "Calcium supplement and antacid",
        action: "Provides elemental calcium to replace losses from bone resorption during immobility; supports osteoblast activity and bone mineralization; also neutralizes gastric acid when used as antacid; requires vitamin D for optimal intestinal absorption",
        sideEffects: "Constipation, gas and bloating, hypercalcemia (with excessive supplementation), renal calculi (calcium oxalate stones in susceptible patients), milk-alkali syndrome with high doses",
        contra: "Hypercalcemia; history of calcium-containing renal calculi; hyperparathyroidism; severe renal impairment (impaired calcium excretion)",
        pearl: "Take with food for best absorption (stomach acid required); separate from other medications by at least 2 hours (calcium decreases absorption of tetracyclines, fluoroquinolones, levothyroxine, and iron); maximum single dose 500 mg elemental calcium (higher doses reduce absorption efficiency); ensure adequate vitamin D intake for calcium utilization"
      }
    ],
    pearls: [
      "Muscle strength decreases approximately 1-3% per day of complete bedrest -- early mobilization within 24 hours of admission (when medically stable) is the single most important intervention to prevent immobility complications",
      "The Braden Scale has six subscales: sensory perception, moisture, activity, mobility, nutrition, and friction/shear -- a total score of 18 or below identifies patients at risk for pressure injury requiring preventive interventions",
      "Repositioning every 2 hours is the minimum standard; patients on pressure-relieving mattresses still require regular repositioning because no surface eliminates all pressure",
      "DVT prophylaxis is essential for immobile patients: sequential compression devices provide mechanical prevention, and pharmacological prophylaxis (enoxaparin or heparin) is added based on risk assessment; both methods are complementary",
      "Contractures can begin forming within 48-72 hours of immobility; foot drop (plantar flexion contracture) is prevented by using footboards, high-top sneakers, or ankle-foot orthoses to maintain 90-degree ankle positioning",
      "Incentive spirometry should be performed 10 times every 1-2 hours while awake to prevent atelectasis; the patient should sustain inhalation for at least 3-5 seconds with each use",
      "Orthostatic hypotension is assessed by measuring blood pressure in lying, sitting, and standing positions; a systolic drop of 20 mmHg or more, or a diastolic drop of 10 mmHg or more, is considered positive and requires gradual position changes and physician notification"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient who has been on bedrest for 5 days following surgery. Which assessment finding should the nurse report immediately?",
        options: [
          "Bilateral ankle edema that improves with elevation",
          "Mild constipation with last bowel movement 2 days ago",
          "Unilateral left calf swelling with tenderness and warmth",
          "Decreased appetite and fatigue with activity"
        ],
        correct: 2,
        rationale: "Unilateral calf swelling with tenderness and warmth are classic signs of deep vein thrombosis (DVT), which is a serious and potentially life-threatening complication of immobility requiring immediate assessment and intervention. Bilateral edema, mild constipation, and decreased appetite are expected findings with immobility but are not emergent."
      },
      {
        question: "The practical nurse is implementing a pressure injury prevention plan for an immobile patient. Which intervention is most important?",
        options: [
          "Massaging reddened areas over bony prominences to improve circulation",
          "Repositioning the patient at least every 2 hours and documenting the position",
          "Keeping the head of bed elevated at 60 degrees at all times",
          "Applying barrier cream to all skin surfaces once per shift"
        ],
        correct: 1,
        rationale: "Repositioning at least every 2 hours is the cornerstone of pressure injury prevention as it relieves sustained pressure on bony prominences. Massaging reddened areas is contraindicated because it can cause further tissue damage. Keeping the head elevated at 60 degrees increases shear forces on the sacrum. Barrier cream is used selectively for moisture-related skin issues, not all surfaces."
      },
      {
        question: "A patient on prolonged bedrest reports feeling dizzy when sitting up. The practical nurse checks blood pressure: lying 130/80 mmHg, sitting 104/60 mmHg. What action should the nurse take first?",
        options: [
          "Assist the patient to stand immediately and encourage walking",
          "Return the patient to a lying position and report the findings",
          "Administer a dose of the prescribed antihypertensive medication",
          "Document the findings and recheck the blood pressure in 4 hours"
        ],
        correct: 1,
        rationale: "The patient is demonstrating orthostatic hypotension (systolic drop greater than 20 mmHg from lying to sitting) with symptoms. The nurse should return the patient to a safe lying position to prevent syncope and falls, then report the findings to the physician. Ambulating a symptomatic hypotensive patient risks falls and injury."
      }
    ]
  },

  "molar-pregnancy-rpn": {
    title: "Molar Pregnancy (Hydatidiform Mole) for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Gestational Trophoblastic Disease",
      content: "A molar pregnancy, also known as hydatidiform mole, is a form of gestational trophoblastic disease (GTD) in which abnormal fertilization leads to the development of nonfunctional placental tissue instead of a viable embryo. The condition arises from errors in fertilization that produce an abnormal chromosomal complement in the conceptus. There are two distinct types: complete mole and partial mole. In a complete hydatidiform mole, an empty ovum (with absent or inactivated maternal chromosomes) is fertilized by one sperm that duplicates its chromosomal material, resulting in a 46,XX diploid karyotype that is entirely paternal in origin (androgenetic). Alternatively, two sperm may fertilize the empty ovum producing a 46,XX or 46,XY complement. In a complete mole, no fetal tissue develops; instead, all chorionic villi undergo hydropic swelling and form characteristic grape-like vesicles that fill the uterine cavity. The trophoblastic tissue proliferates excessively and produces extremely elevated levels of human chorionic gonadotropin (hCG), often exceeding 100,000 mIU/mL, which is far higher than normal pregnancy levels at equivalent gestational ages. In a partial hydatidiform mole, a normal ovum is fertilized by two sperm simultaneously, producing a triploid karyotype (69,XXY or 69,XXX). Some fetal tissue may develop but is always abnormal and nonviable. The chorionic villi show focal (partial) hydropic changes, and hCG levels are elevated but typically lower than in complete moles. The clinical presentation of molar pregnancy includes vaginal bleeding in the first trimester (most common presenting symptom), uterine size larger than expected for gestational age (in complete moles), passage of grape-like vesicles through the vagina, absence of fetal heart tones, and exaggerated pregnancy symptoms including severe hyperemesis gravidarum. The abnormally high hCG levels can also stimulate the thyroid gland (because the alpha subunit of hCG is structurally similar to TSH), causing hyperthyroidism with tachycardia, tremor, and heat intolerance. Additionally, the high hCG can stimulate ovarian theca-lutein cysts that enlarge the ovaries. The most serious concern with molar pregnancy is the risk of malignant transformation: complete moles carry a 15-20% risk of progressing to gestational trophoblastic neoplasia (GTN), which includes invasive mole, choriocarcinoma, and placental site trophoblastic tumor. Partial moles have a lower malignant potential of approximately 1-5%. Treatment involves evacuation of the uterine contents by suction curettage, followed by serial hCG monitoring for 6-12 months to detect persistent or rising levels that would indicate malignant transformation. Reliable contraception is essential during the monitoring period because a new pregnancy would make hCG tracking impossible. The practical nurse must understand the physical and emotional impact of molar pregnancy, as patients experience not only a pregnancy loss but also anxiety about potential cancer and the requirement to delay future pregnancies during the monitoring period."
    },
    riskFactors: [
      "Extremes of maternal age (under 20 years or over 35 years, with risk increasing significantly after age 40)",
      "Previous molar pregnancy (recurrence risk 1-2% after one molar pregnancy, up to 15-20% after two molar pregnancies)",
      "History of spontaneous abortion (two or more previous miscarriages increase GTD risk)",
      "Diet low in carotene and animal fat (deficiency in beta-carotene and protein associated with increased risk in some populations)",
      "Blood type A or AB (some studies show association with higher risk of complete mole and malignant transformation)",
      "Asian ethnicity (higher incidence reported in Southeast Asian populations compared to Western populations)",
      "Infertility treatment and use of oral contraceptives prior to conception (possible association with trophoblastic abnormalities)"
    ],
    diagnostics: [
      "Serum quantitative beta-hCG: markedly elevated for gestational age (complete mole often exceeds 100,000 mIU/mL); serial levels monitored weekly after evacuation until undetectable, then monthly for 6-12 months",
      "Pelvic ultrasound: classic 'snowstorm' appearance (complete mole shows diffuse hydropic villi without fetal structures); partial mole may show abnormal fetal tissue with focal cystic changes in the placenta",
      "Complete blood count (CBC): assess for anemia from vaginal bleeding; baseline platelet count before any surgical procedure",
      "Thyroid function tests (TSH, free T4): assess for hCG-induced hyperthyroidism; hCG alpha subunit cross-reacts with TSH receptors causing thyroid stimulation",
      "Blood type and Rh factor: Rh-negative patients require Rho(D) immune globulin (RhoGAM) after evacuation to prevent Rh sensitization",
      "Chest X-ray: baseline imaging to rule out pulmonary metastasis; trophoblastic tissue has high affinity for lung parenchyma and is the most common metastatic site"
    ],
    management: [
      "Prepare patient for suction curettage (uterine evacuation): the primary treatment for molar pregnancy; performed under anesthesia with oxytocin infusion to reduce bleeding",
      "Administer Rho(D) immune globulin (RhoGAM) to Rh-negative patients within 72 hours of evacuation to prevent maternal Rh sensitization",
      "Initiate serial hCG monitoring: weekly quantitative beta-hCG levels until undetectable for 3 consecutive weeks, then monthly for 6 months (partial mole) or 12 months (complete mole)",
      "Ensure reliable contraception during entire hCG monitoring period: oral contraceptives are acceptable; intrauterine devices should not be inserted until hCG is undetectable; pregnancy would confound hCG surveillance",
      "Monitor for signs of gestational trophoblastic neoplasia (GTN): plateauing or rising hCG levels, persistent vaginal bleeding, new pulmonary symptoms, or irregular vaginal bleeding after evacuation",
      "Provide referral to gynecologic oncology if hCG levels plateau for 3 or more weeks, rise over 2 consecutive weeks, or remain detectable at 6 months post-evacuation",
      "Support emotional well-being: molar pregnancy involves pregnancy loss, fear of cancer, and enforced delay of future conception -- provide referrals to counseling and support groups"
    ],
    nursingActions: [
      "Monitor vaginal bleeding: assess volume (pad count per hour), color, presence of clots or grape-like vesicles; report heavy bleeding (soaking more than 1 pad per hour) or passage of tissue immediately",
      "Obtain and document serial vital signs every 15 minutes during and immediately after suction curettage; monitor for hemorrhage (tachycardia, hypotension, pallor)",
      "Assess for signs of hyperthyroidism caused by elevated hCG: tachycardia, tremor, heat intolerance, weight loss, anxiety, diaphoresis; report findings to physician",
      "Monitor for pre-eclampsia symptoms: report blood pressure above 140/90 mmHg, proteinuria, headache, visual disturbances, or epigastric pain (pre-eclampsia before 20 weeks gestation suggests molar pregnancy)",
      "Reinforce patient education on the importance of serial hCG follow-up: explain that rising or plateauing levels may indicate malignant transformation requiring chemotherapy",
      "Document emotional status and coping: assess for grief, anxiety, and depression; provide therapeutic communication and validate the patient's experience of pregnancy loss",
      "Verify contraception plan with patient before discharge: confirm understanding that pregnancy must be avoided during the entire monitoring period to allow accurate hCG surveillance"
    ],
    assessmentFindings: [
      "Vaginal bleeding in the first trimester (most common presenting symptom; ranges from spotting to heavy hemorrhage with passage of dark brown or bright red blood)",
      "Uterine size larger than expected for gestational age (in complete mole, due to rapid trophoblastic proliferation and accumulation of hydropic villi)",
      "Absence of fetal heart tones on Doppler assessment (no viable fetus develops in complete mole)",
      "Severe nausea and vomiting (hyperemesis gravidarum) due to markedly elevated hCG levels stimulating the vomiting center",
      "Passage of grape-like vesicles through the vagina (hydropic chorionic villi that resemble small clusters of grapes; pathognomonic finding)",
      "Signs of hyperthyroidism: resting tachycardia, fine tremor, heat intolerance, warm moist skin (hCG cross-stimulates thyroid TSH receptors)",
      "Elevated blood pressure before 20 weeks gestation with proteinuria (early-onset pre-eclampsia strongly associated with molar pregnancy)"
    ],
    signs: {
      left: [
        "Intermittent vaginal spotting or light bleeding in early pregnancy",
        "Nausea and vomiting more severe than typical morning sickness",
        "Uterine size slightly larger than expected for dates",
        "Mild pelvic cramping or pressure",
        "Elevated hCG levels higher than expected for gestational age",
        "Fatigue and breast tenderness greater than expected"
      ],
      right: [
        "Hemorrhage with passage of grape-like vesicles (requires immediate intervention)",
        "Signs of thyroid storm: severe tachycardia, hyperthermia, altered mental status",
        "Pre-eclampsia before 20 weeks: severe hypertension, seizures (eclampsia)",
        "Respiratory distress from trophoblastic embolization to lungs",
        "Rising hCG levels after evacuation indicating malignant transformation",
        "Disseminated intravascular coagulation (DIC) with uncontrolled bleeding"
      ]
    },
    medications: [
      {
        name: "Rho(D) Immune Globulin (RhoGAM)",
        type: "Immune globulin / Rh sensitization prophylaxis",
        action: "Contains anti-D antibodies that bind to and destroy any fetal Rh-positive red blood cells that have entered the maternal circulation, preventing the mother's immune system from forming anti-D antibodies that would attack Rh-positive red blood cells in future pregnancies",
        sideEffects: "Injection site pain and tenderness, low-grade fever, mild headache, myalgia; rare allergic reactions including anaphylaxis",
        contra: "Rh-positive patients (not indicated); prior severe hypersensitivity to human immune globulin products; IgA deficiency with anti-IgA antibodies (risk of anaphylaxis)",
        pearl: "Must be administered within 72 hours of any potentially sensitizing event (molar evacuation, miscarriage, ectopic pregnancy, amniocentesis); given by intramuscular injection in the deltoid; verify patient is Rh-negative before administration; document lot number and administration site"
      },
      {
        name: "Methotrexate",
        type: "Antimetabolite / folic acid antagonist chemotherapeutic agent",
        action: "Inhibits dihydrofolate reductase (DHFR), blocking the conversion of dihydrofolate to tetrahydrofolate, which is essential for DNA synthesis and cell division; selectively toxic to rapidly dividing trophoblastic cells; used when hCG levels indicate persistent or malignant gestational trophoblastic disease",
        sideEffects: "Bone marrow suppression (neutropenia, thrombocytopenia, anemia), mucositis and stomatitis, nausea and vomiting, hepatotoxicity (monitor liver enzymes), nephrotoxicity, photosensitivity, alopecia",
        contra: "Pregnancy (Category X -- absolutely contraindicated; highly teratogenic); breastfeeding; severe hepatic or renal impairment; pre-existing bone marrow suppression; active infection; immunodeficiency",
        pearl: "Used for gestational trophoblastic neoplasia (GTN) when hCG levels plateau or rise after evacuation; leucovorin (folinic acid) rescue may be given 24 hours after methotrexate to protect normal cells; patients must avoid alcohol, NSAIDs, and folic acid supplements during treatment; strict pregnancy prevention required"
      },
      {
        name: "Oxytocin (Pitocin)",
        type: "Uterotonic agent / synthetic posterior pituitary hormone",
        action: "Binds to oxytocin receptors on uterine myometrial cells, stimulating rhythmic contractions and increasing uterine tone; promotes uterine involution and compression of spiral arteries to reduce postpartum or post-evacuation hemorrhage",
        sideEffects: "Uterine hyperstimulation (tetanic contractions), water intoxication and hyponatremia (ADH-like effect at high doses), hypotension (rapid IV bolus), tachycardia, nausea",
        contra: "Undiluted IV bolus (causes severe hypotension); fetal distress when used in labor; hypertonic uterine patterns; hypersensitivity to oxytocin",
        pearl: "In molar pregnancy evacuation, oxytocin is infused AFTER the cervix is dilated and evacuation has begun (not before, to avoid trophoblastic embolization); administered via IV pump with precise dose titration; monitor uterine tone, vaginal bleeding, and vital signs continuously during infusion"
      }
    ],
    pearls: [
      "Complete molar pregnancy has NO fetal tissue (entirely paternal chromosomes, 46XX or 46XY); partial molar pregnancy has SOME fetal tissue but is always triploid (69 chromosomes) and nonviable -- understanding this distinction is essential for patient education",
      "The classic ultrasound finding of complete mole is a 'snowstorm' pattern: diffuse echogenic material filling the uterus with multiple small cystic spaces representing hydropic villi, with no identifiable fetal structures",
      "Pre-eclampsia occurring BEFORE 20 weeks of gestation is a red flag for molar pregnancy -- pre-eclampsia in a normal pregnancy typically does not develop until after 20 weeks",
      "Serial hCG monitoring is the cornerstone of post-evacuation follow-up: levels should decline steadily to undetectable; any plateau for 3 or more weeks, or rise over 2 or more weeks, triggers evaluation for gestational trophoblastic neoplasia",
      "Reliable contraception during the entire hCG monitoring period (6-12 months) is critical because a new pregnancy would elevate hCG and make it impossible to distinguish normal pregnancy from malignant transformation",
      "The lungs are the most common site of metastasis from gestational trophoblastic neoplasia -- a baseline chest X-ray is obtained after diagnosis, and any new respiratory symptoms during follow-up require urgent evaluation",
      "Patients with molar pregnancy experience a unique form of grief: the loss of an expected pregnancy combined with anxiety about cancer risk and the enforced delay of future conception -- compassionate nursing care addresses all dimensions of this experience"
    ],
    quiz: [
      {
        question: "A patient diagnosed with a complete molar pregnancy asks the practical nurse why she cannot try to become pregnant again right away after the evacuation. What is the best response?",
        options: [
          "Your body needs time to heal physically before another pregnancy is safe",
          "The uterus needs at least one year to recover from the surgical procedure",
          "Your hCG levels must be monitored to ensure there is no malignant transformation, and a new pregnancy would make tracking impossible",
          "You need to wait until your menstrual cycle returns to normal before conception"
        ],
        correct: 2,
        rationale: "The primary reason for delaying pregnancy after molar evacuation is to allow accurate serial hCG monitoring. Rising or plateauing hCG levels indicate possible gestational trophoblastic neoplasia (malignant transformation). A new pregnancy would produce hCG and make it impossible to distinguish between normal pregnancy and malignant disease."
      },
      {
        question: "A practical nurse is monitoring a patient after suction curettage for molar pregnancy. Which finding should the nurse report immediately?",
        options: [
          "Mild cramping and light vaginal bleeding",
          "Temperature of 36.8 degrees Celsius",
          "Blood pressure of 158/96 mmHg with headache and blurred vision",
          "Emotional distress and tearfulness about the pregnancy loss"
        ],
        correct: 2,
        rationale: "Elevated blood pressure with headache and visual changes are signs of pre-eclampsia or hypertensive emergency, which can occur with molar pregnancy due to elevated hCG levels. This requires immediate medical evaluation. Mild cramping and light bleeding are expected after evacuation. Normal temperature is reassuring. Emotional distress requires therapeutic support but is not an emergency."
      },
      {
        question: "The practical nurse is providing discharge education after molar pregnancy evacuation. Which statement by the patient demonstrates correct understanding?",
        options: [
          "I can stop getting blood tests once my hCG level drops below 1000",
          "I should use reliable contraception and have my hCG levels checked regularly until they are undetectable and remain so for the recommended monitoring period",
          "If I have any vaginal bleeding, I should assume it is a normal period and not worry",
          "I only need to follow up if I develop symptoms of a new pregnancy"
        ],
        correct: 1,
        rationale: "Correct understanding includes using reliable contraception during the monitoring period and continuing serial hCG testing until levels are undetectable for the recommended duration (6 months for partial mole, 12 months for complete mole). Stopping testing prematurely, ignoring vaginal bleeding, or only following up with symptoms could miss signs of malignant transformation."
      }
    ]
  },

  "mononucleosis-rpn": {
    title: "Infectious Mononucleosis for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Epstein-Barr Virus and Infectious Mononucleosis",
      content: "Infectious mononucleosis (commonly called 'mono' or the 'kissing disease') is an acute viral infection caused primarily by the Epstein-Barr virus (EBV), a member of the herpesvirus family (Human Herpesvirus 4). EBV is one of the most common human viruses, infecting approximately 95% of the world's adult population. The virus is transmitted through intimate contact with oropharyngeal secretions, most commonly through saliva (kissing, sharing utensils, drinking containers, or toothbrushes). After entering the oropharynx, EBV initially infects and replicates within the epithelial cells of the pharynx and salivary glands. The virus then crosses into the underlying lymphoid tissue and specifically targets B lymphocytes by binding to the CD21 receptor (complement receptor 2) on the B cell surface. Once inside the B lymphocyte, EBV can follow one of two pathways: lytic infection (active viral replication that kills the host cell and releases new viral particles) or latent infection (the viral genome integrates into the B cell DNA and persists indefinitely without active replication). During the acute phase of mononucleosis, EBV-infected B lymphocytes proliferate rapidly and circulate throughout the lymphoreticular system, including the lymph nodes, spleen, liver, and tonsils. The immune system mounts a robust T lymphocyte response: cytotoxic T cells (CD8+) attack the infected B cells, and this vigorous immune response is actually responsible for most of the clinical symptoms rather than direct viral damage. The characteristic atypical lymphocytes seen on peripheral blood smear are actually reactive T lymphocytes responding to EBV-infected B cells, not the infected B cells themselves. The incubation period is 4-6 weeks, followed by a prodromal phase of fatigue, malaise, and headache lasting 1-2 weeks before the classic triad appears: pharyngitis (severe sore throat with exudative tonsillitis), lymphadenopathy (particularly posterior cervical nodes), and fever. Splenomegaly occurs in approximately 50-60% of cases due to lymphocytic infiltration and is the source of the most serious acute complication: splenic rupture, which occurs in approximately 0.1-0.5% of cases and can be spontaneous or trauma-induced. The spleen is most vulnerable to rupture during weeks 2-4 of illness when it is maximally enlarged and congested. Hepatomegaly with mildly elevated liver enzymes occurs in up to 80% of cases, though clinical hepatitis with jaundice is seen in only 5-10%. A characteristic finding in mononucleosis is the development of a diffuse maculopapular rash (occurring in 70-100% of patients) if ampicillin or amoxicillin is administered during the infection -- this is not a true allergy but rather an immune-mediated reaction that does not necessarily predict future penicillin allergy. EBV establishes lifelong latent infection in B lymphocytes after the acute phase resolves. The virus can periodically reactivate and be shed in saliva, allowing transmission even from asymptomatic individuals. Full recovery typically takes 2-4 weeks for acute symptoms, though fatigue may persist for several months. The practical nurse must monitor for complications including splenic rupture, airway obstruction from tonsillar hypertrophy, hepatitis, and rare but serious neurological complications including Guillain-Barre syndrome and meningoencephalitis."
    },
    riskFactors: [
      "Adolescents and young adults aged 15-25 years (highest incidence due to primary EBV exposure through intimate social contact)",
      "Close interpersonal contact through kissing, sharing utensils, or drinking containers (primary transmission route through saliva)",
      "Living in close quarters (college dormitories, military barracks, boarding schools increasing exposure risk)",
      "Immunocompromised state (HIV/AIDS, transplant recipients, chemotherapy patients may develop severe or atypical presentations)",
      "Lack of prior EBV exposure (infection in early childhood is often asymptomatic; delayed primary infection in adolescence produces classic mononucleosis syndrome)",
      "Healthcare workers with frequent exposure to oropharyngeal secretions (occupational risk without appropriate precautions)",
      "Daycare attendance in young children (fecal-oral and salivary transmission among toddlers, though clinical disease is rare in this age group)"
    ],
    diagnostics: [
      "Heterophile antibody test (Monospot): rapid point-of-care test detecting heterophile antibodies produced during EBV infection; positive in 70-90% of cases by week 2; false negatives common in children under 4 years and in the first week of illness",
      "Complete blood count with differential: lymphocytosis (greater than 50% lymphocytes) with at least 10% atypical lymphocytes (large reactive T cells with vacuolated cytoplasm and irregular nuclei); mild thrombocytopenia in some cases",
      "EBV-specific antibody panel: viral capsid antigen (VCA) IgM (positive in acute infection), VCA IgG (appears during acute phase and persists for life), early antigen (EA) IgG (positive in acute phase), nuclear antigen (EBNA) IgG (appears 6-12 weeks after onset and indicates past infection)",
      "Liver function tests (AST, ALT, ALP, bilirubin): elevated transaminases in up to 80% of cases; significant elevation (greater than 3 times normal) indicates hepatic involvement requiring activity modification",
      "Abdominal ultrasound: indicated when splenomegaly is suspected; measures splenic size and identifies subcapsular hemorrhage; used to guide return-to-activity decisions",
      "Throat culture: to rule out concurrent Group A streptococcal pharyngitis, which coexists with EBV in up to 30% of mononucleosis cases and requires antibiotic treatment"
    ],
    management: [
      "Supportive care is the mainstay of treatment: adequate rest, hydration (minimum 2-3 liters of fluids daily), and symptomatic management of fever and pain",
      "Restrict activity and avoid contact sports, heavy lifting, and strenuous exercise for minimum 3-4 weeks (or until spleen is confirmed to have returned to normal size) to prevent splenic rupture",
      "Administer analgesics and antipyretics as prescribed for fever and pharyngitis pain; avoid aspirin in children and adolescents (Reye syndrome risk)",
      "Provide throat comfort measures: warm saline gargles, cool liquids, popsicles, soft foods; some patients may require IV hydration if unable to swallow due to severe tonsillar swelling",
      "Avoid ampicillin and amoxicillin if antibiotic therapy is being considered (for concurrent streptococcal infection): these cause a characteristic diffuse rash in 70-100% of EBV patients",
      "Corticosteroids (prednisone) may be prescribed short-term for severe complications: impending airway obstruction from tonsillar hypertrophy, severe thrombocytopenia, or hemolytic anemia",
      "Educate patient on infection prevention: avoid kissing, sharing utensils or drinking containers, and donating blood during acute illness and for at least 6 months after"
    ],
    nursingActions: [
      "Assess for signs of splenic enlargement: palpate abdomen gently (avoid deep palpation of left upper quadrant), monitor for left upper quadrant or left shoulder pain (Kehr sign suggesting diaphragmatic irritation from splenic hemorrhage)",
      "Monitor airway patency: assess for stridor, drooling, dysphagia, or voice changes indicating tonsillar hypertrophy compromising the airway; report immediately if present",
      "Obtain vital signs every 4-8 hours: monitor temperature trends, heart rate (tachycardia may indicate dehydration, anemia, or splenic rupture), and respiratory status",
      "Monitor fluid intake and output: encourage oral hydration; assess for dehydration (dry mucous membranes, decreased urine output, tachycardia, orthostatic changes)",
      "Assess skin and mucous membranes: inspect for petechiae or purpura (indicating thrombocytopenia), jaundice (hepatic involvement), and maculopapular rash (especially if antibiotics were given)",
      "Educate patient and family on activity restrictions: no contact sports or heavy lifting for a minimum of 3-4 weeks; gradual return to activity only after physician clearance",
      "Reinforce infection prevention teaching: virus is shed in saliva for months after acute illness; avoid intimate contact and sharing personal items until cleared by physician"
    ],
    assessmentFindings: [
      "Severe pharyngitis with exudative tonsillitis (white or grayish membrane covering enlarged tonsils; rated as one of the most painful sore throats patients experience)",
      "Lymphadenopathy especially posterior cervical chains (symmetrical, tender, mobile nodes; may also involve anterior cervical, axillary, and inguinal chains)",
      "Fever typically 38.3-40 degrees Celsius (101-104 degrees Fahrenheit) lasting 1-2 weeks; often highest in the evening",
      "Profound fatigue and malaise disproportionate to other symptoms (may persist for weeks to months after acute phase resolves)",
      "Splenomegaly (palpable spleen below left costal margin in 50-60% of cases; maximally enlarged at weeks 2-4)",
      "Hepatomegaly with tenderness to percussion over the liver (right upper quadrant); mild jaundice in 5-10% of cases",
      "Periorbital edema (puffiness around the eyes, particularly in the morning; present in approximately 30% of cases)"
    ],
    signs: {
      left: [
        "Sore throat with mild tonsillar swelling and exudate",
        "Tender cervical lymph nodes bilaterally",
        "Low-grade fever and progressive fatigue",
        "Mild headache and myalgia",
        "Decreased appetite and mild nausea",
        "Periorbital puffiness noted in the morning"
      ],
      right: [
        "Severe dyspnea or stridor from tonsillar obstruction of airway (emergency)",
        "Sudden severe left upper quadrant pain with Kehr sign (possible splenic rupture)",
        "Hypotension and tachycardia following abdominal trauma (splenic hemorrhage)",
        "Petechiae and spontaneous bleeding (severe thrombocytopenia)",
        "Jaundice with markedly elevated liver enzymes (EBV hepatitis)",
        "Neurological changes: nuchal rigidity, seizures, facial palsy (meningoencephalitis)"
      ]
    },
    medications: [
      {
        name: "Acetaminophen (Tylenol)",
        type: "Analgesic and antipyretic (non-opioid)",
        action: "Inhibits cyclooxygenase (COX) enzymes primarily in the central nervous system, reducing prostaglandin synthesis in the hypothalamic heat-regulating center to lower fever, and modulating pain perception pathways; does not have significant anti-inflammatory effects at standard doses",
        sideEffects: "Hepatotoxicity (dose-dependent, particularly with doses exceeding 4 grams per day or in patients with liver disease); nausea, rash (rare); acute liver failure with overdose",
        contra: "Severe hepatic impairment or active liver disease; chronic alcohol use (increased hepatotoxicity risk); known hypersensitivity; caution with EBV-related hepatitis as liver function is already compromised",
        pearl: "Preferred over NSAIDs and aspirin for fever and pain management in mononucleosis because it does not affect platelet function (important given thrombocytopenia risk) and aspirin carries Reye syndrome risk in children and adolescents; maximum 4 g/day in healthy adults, reduce to 2 g/day if liver enzymes are elevated; check all combination medications for hidden acetaminophen content"
      },
      {
        name: "Prednisone",
        type: "Systemic corticosteroid (glucocorticoid)",
        action: "Binds to intracellular glucocorticoid receptors, modulating gene transcription to suppress inflammatory cytokines and reduce lymphocyte proliferation; decreases tonsillar and lymphoid tissue swelling; used short-term in mononucleosis only for specific complications (airway compromise, severe thrombocytopenia, hemolytic anemia)",
        sideEffects: "Hyperglycemia, increased appetite and weight gain, mood changes (euphoria, insomnia, irritability), immunosuppression, gastric irritation, fluid retention, adrenal suppression with prolonged use",
        contra: "Active untreated infections (may worsen); systemic fungal infections; live vaccine administration during treatment; uncontrolled diabetes (hyperglycemia worsens); not used routinely in uncomplicated mononucleosis (may prolong viral shedding)",
        pearl: "Reserved ONLY for severe complications of mononucleosis: impending airway obstruction from massive tonsillar swelling, platelet count below 20,000 with active bleeding, or autoimmune hemolytic anemia; typical course is short (5-7 days with taper); must taper if used longer than 5-7 days to prevent adrenal crisis; monitor blood glucose during therapy"
      },
      {
        name: "Acyclovir (Zovirax)",
        type: "Antiviral agent (nucleoside analog)",
        action: "Converted to acyclovir triphosphate by viral thymidine kinase, which then inhibits viral DNA polymerase, terminating DNA chain elongation and blocking viral replication; active against several herpesviruses; has in vitro activity against EBV but limited clinical benefit in uncomplicated mononucleosis",
        sideEffects: "Nausea and vomiting, diarrhea, headache, nephrotoxicity (crystal deposition in renal tubules, especially with dehydration or rapid IV infusion), neurotoxicity (tremor, confusion) at high doses, phlebitis with IV formulation",
        contra: "Known hypersensitivity to acyclovir or valacyclovir; severe renal impairment (dose adjustment required); dehydration (increases nephrotoxicity risk)",
        pearl: "Not routinely recommended for uncomplicated mononucleosis because EBV symptoms are primarily immune-mediated rather than caused by active viral replication; may be considered in severe or complicated cases (oral hairy leukoplakia, immunocompromised patients with EBV reactivation); adequate hydration is essential during IV administration to prevent crystalluria and nephrotoxicity"
      }
    ],
    pearls: [
      "The Monospot (heterophile antibody) test may be negative in the first week of illness and in children under 4 years -- if clinical suspicion is high and Monospot is negative, repeat testing in 1-2 weeks or order EBV-specific antibodies (VCA IgM is most sensitive for acute infection)",
      "NEVER administer ampicillin or amoxicillin to a patient with suspected mononucleosis: 70-100% of EBV patients develop a characteristic diffuse maculopapular rash that is immune-mediated (not a true penicillin allergy) but is uncomfortable and alarming",
      "Splenic rupture is the most life-threatening acute complication: restrict all contact sports, heavy lifting, and strenuous exercise for a minimum of 3-4 weeks; Kehr sign (left shoulder pain from diaphragmatic irritation) with sudden left upper quadrant pain suggests splenic hemorrhage requiring emergency intervention",
      "The atypical lymphocytes on blood smear (Downey cells) are reactive T lymphocytes responding to EBV-infected B cells, NOT the infected B cells themselves -- this is a commonly tested concept",
      "Concurrent Group A streptococcal pharyngitis occurs in up to 30% of mononucleosis cases -- always obtain a throat culture because strep requires antibiotic treatment (use azithromycin or a cephalosporin, NOT amoxicillin)",
      "EBV establishes lifelong latent infection in B lymphocytes and can be shed intermittently in saliva for months to years -- patients should understand they may be contagious even after feeling well, and there is no need to feel stigmatized as the virus is nearly universal in adults",
      "Fatigue is often the most debilitating and longest-lasting symptom, persisting for weeks to months after acute illness resolves; patients should be counseled to expect this and plan for gradual return to full activity rather than attempting to resume normal schedule prematurely"
    ],
    quiz: [
      {
        question: "A 17-year-old patient diagnosed with infectious mononucleosis asks the practical nurse when they can return to playing football. What is the most appropriate response?",
        options: [
          "You can return to sports once your fever resolves",
          "Contact sports must be avoided for at least 3-4 weeks because of the risk of splenic rupture, and you need physician clearance before returning",
          "You can participate in light practice but avoid full-contact drills for 1 week",
          "There are no activity restrictions as long as you feel up to it"
        ],
        correct: 1,
        rationale: "Splenomegaly in mononucleosis makes the spleen vulnerable to rupture, which is a life-threatening surgical emergency. Contact sports and strenuous activity must be avoided for at least 3-4 weeks (or until the spleen returns to normal size as confirmed by physical examination or ultrasound). Return to sports requires physician clearance."
      },
      {
        question: "A practical nurse is reviewing medication orders for a patient with mononucleosis and concurrent streptococcal pharyngitis. The physician orders amoxicillin 500 mg PO three times daily. What should the nurse do?",
        options: [
          "Administer the medication as ordered since it treats streptococcal infection",
          "Contact the physician to question the order because amoxicillin causes a characteristic rash in most patients with mononucleosis",
          "Hold the medication and document that it is contraindicated",
          "Administer the first dose and monitor for allergic reaction before continuing"
        ],
        correct: 1,
        rationale: "Amoxicillin and ampicillin cause a diffuse maculopapular rash in 70-100% of patients with active EBV infection. The nurse should contact the prescriber to question the order and suggest an alternative antibiotic (such as azithromycin or a cephalosporin) for the streptococcal infection. The nurse should not unilaterally hold a medication without physician communication."
      },
      {
        question: "A patient with mononucleosis develops sudden severe left upper quadrant pain with left shoulder pain and becomes tachycardic and diaphoretic. What is the priority nursing action?",
        options: [
          "Administer prescribed acetaminophen for pain and reposition the patient",
          "Call for immediate emergency assistance as these findings suggest splenic rupture",
          "Apply a heating pad to the left upper quadrant and encourage deep breathing",
          "Document the findings and inform the physician at the next scheduled rounding time"
        ],
        correct: 1,
        rationale: "Sudden left upper quadrant pain with referred left shoulder pain (Kehr sign from diaphragmatic irritation), tachycardia, and diaphoresis in a mononucleosis patient are classic signs of splenic rupture, a life-threatening surgical emergency. The nurse must call for immediate emergency assistance. This requires emergent surgical intervention and hemodynamic stabilization."
      }
    ]
  },

  "mrsa-rpn": {
    title: "MRSA Infection and Contact Precautions for Practical Nurses",
    cellular: {
      title: "Microbiology and Pathophysiology of Methicillin-Resistant Staphylococcus aureus",
      content: "Methicillin-resistant Staphylococcus aureus (MRSA) is a strain of Staphylococcus aureus that has acquired resistance to methicillin and all other beta-lactam antibiotics (penicillins, cephalosporins, and carbapenems) through the acquisition of the mecA gene. This gene encodes an altered penicillin-binding protein (PBP2a or PBP2') that has low affinity for beta-lactam antibiotics, rendering these drugs ineffective at inhibiting bacterial cell wall synthesis. Staphylococcus aureus is a gram-positive coccus that normally colonizes the skin and nares (anterior nostrils) of approximately 30% of the general population; MRSA colonizes approximately 2-5% of the population. The distinction between colonization and infection is clinically critical: colonization means the organism is present on the body without causing disease, while infection means the organism has invaded tissue and is causing an inflammatory response with clinical signs and symptoms. MRSA infections are categorized as either community-acquired (CA-MRSA) or hospital-acquired (HA-MRSA), and these categories differ in their epidemiology, virulence factors, and antibiotic susceptibility patterns. CA-MRSA typically affects young, healthy individuals and most commonly presents as skin and soft tissue infections (SSTIs): boils, abscesses, carbuncles, and cellulitis. CA-MRSA strains frequently carry the Panton-Valentine leukocidin (PVL) gene, which produces a toxin that destroys white blood cells and causes tissue necrosis, leading to the characteristic painful, deep-seated abscesses that patients often initially mistake for spider bites. HA-MRSA infections occur in healthcare settings (hospitals, long-term care facilities, dialysis centers) and tend to cause more invasive and severe infections: surgical site infections, bloodstream infections (bacteremia), pneumonia, urinary tract infections, and device-related infections (central line-associated bloodstream infections, ventilator-associated pneumonia). HA-MRSA is transmitted primarily through direct contact with colonized or infected individuals, or through contact with contaminated surfaces, equipment, and healthcare worker hands. The organism can survive on inanimate surfaces (bedrails, doorknobs, stethoscopes, blood pressure cuffs) for days to weeks, making environmental cleaning essential for prevention. Contact precautions are the primary infection control strategy for MRSA: this includes wearing gloves and gown upon entry to the patient's room, performing hand hygiene before donning and after removing personal protective equipment (PPE), dedicating patient care equipment when possible, and placing the patient in a private room or cohorting with another MRSA patient. Nasal decolonization with mupirocin ointment and chlorhexidine gluconate (CHG) body washes may be used to eliminate MRSA colonization, particularly before surgical procedures or in ICU settings. The practical nurse must understand that MRSA is not inherently more virulent than methicillin-sensitive Staphylococcus aureus (MSSA); its danger lies in the limited antibiotic options available for treatment, making infections more difficult and expensive to manage. Vancomycin remains the primary IV antibiotic for serious MRSA infections, while trimethoprim-sulfamethoxazole (TMP-SMX), doxycycline, and clindamycin are oral options for less severe infections."
    },
    riskFactors: [
      "Recent hospitalization or surgery within the past 12 months (exposure to healthcare environment where MRSA transmission is highest)",
      "Residence in long-term care facility or nursing home (close quarters, shared equipment, frequent healthcare worker contact, high antibiotic use)",
      "Presence of invasive devices (central venous catheters, urinary catheters, endotracheal tubes creating portals of entry for bacteria)",
      "Previous antibiotic use especially broad-spectrum agents (disrupts normal flora and selects for resistant organisms including MRSA)",
      "Chronic wounds or skin breakdown (provides entry point for bacterial invasion; diabetic ulcers and surgical wounds are particularly vulnerable)",
      "Close contact with known MRSA carrier or infected individual (household members, athletic teams sharing equipment, incarcerated individuals)",
      "Immunocompromised state (diabetes mellitus, HIV/AIDS, chronic kidney disease, chemotherapy reducing the body's ability to clear infection)"
    ],
    diagnostics: [
      "Wound culture and sensitivity: gold standard for identifying MRSA; collect specimen from the wound base after cleaning surface debris; results guide targeted antibiotic therapy and confirm methicillin resistance",
      "Blood cultures (2 sets from separate sites): essential for suspected MRSA bacteremia; collect before initiating antibiotics; positive results require 4-6 weeks of IV antibiotic therapy with repeat cultures to confirm clearance",
      "Nasal swab culture (anterior nares): screens for MRSA colonization; polymerase chain reaction (PCR) testing provides results in 1-2 hours; used for pre-surgical screening and surveillance programs",
      "Complete blood count (CBC) with differential: elevated white blood cell count with left shift (increased bands/immature neutrophils) indicates active bacterial infection; monitor for leukocytosis trending",
      "C-reactive protein (CRP) and erythrocyte sedimentation rate (ESR): elevated inflammatory markers supporting diagnosis of active infection; useful for monitoring treatment response (should trend downward with effective therapy)",
      "Imaging studies as indicated: CT scan or MRI for deep tissue abscess localization; echocardiography for suspected endocarditis in MRSA bacteremia; chest X-ray for pneumonia evaluation"
    ],
    management: [
      "Implement contact precautions immediately upon confirmed or suspected MRSA: gown and gloves on room entry, dedicated equipment, private room or cohorting, hand hygiene before and after all patient contact",
      "Administer prescribed antibiotics on time and for the full prescribed course: vancomycin IV for serious infections (monitor trough levels), TMP-SMX or doxycycline PO for outpatient skin infections",
      "Perform wound care with appropriate technique: incision and drainage (I&D) of abscesses by physician, followed by wound packing and dressing changes as ordered; use aseptic technique for all wound care",
      "Initiate nasal decolonization protocol as ordered: mupirocin 2% ointment applied to bilateral anterior nares twice daily for 5 days, combined with CHG body washes daily for 5 days",
      "Clean and disinfect patient environment daily with hospital-grade disinfectant effective against MRSA; pay particular attention to high-touch surfaces (bedrails, overbed tables, call lights, door handles)",
      "Monitor for treatment response: assess wound healing, trending vital signs (fever should decrease within 48-72 hours of appropriate antibiotic therapy), decreasing WBC count and inflammatory markers",
      "Educate patient and family on contact precautions, hand hygiene, wound care, and prevention of transmission to household contacts; provide written discharge instructions for home wound care"
    ],
    nursingActions: [
      "Don gloves and gown before entering the patient's room and remove before exiting; perform hand hygiene with alcohol-based hand rub or antimicrobial soap immediately after PPE removal",
      "Assess wound characteristics at each dressing change: measure wound dimensions, document color and amount of drainage, assess wound edges and surrounding tissue for signs of spreading infection (expanding erythema, warmth, induration)",
      "Monitor vital signs every 4 hours (or more frequently if acutely ill): fever, tachycardia, and hypotension may indicate progression to sepsis; report temperature above 38.3 degrees Celsius or hemodynamic instability immediately",
      "Obtain trough vancomycin levels as ordered (typically 30 minutes before the fourth or fifth dose): therapeutic trough range is 15-20 mcg/mL for serious infections; report subtherapeutic or supratherapeutic levels for dose adjustment",
      "Assess IV site every shift when administering vancomycin: monitor for phlebitis (pain, redness, swelling along the vein) and extravasation; infuse over at least 60 minutes to prevent Red Man syndrome",
      "Educate patient on proper hand hygiene technique: demonstrate handwashing with soap and water for at least 20 seconds; instruct patient to wash hands after touching wound or dressings and before eating",
      "Coordinate with infection prevention and control team: report new MRSA cases per facility protocol, ensure appropriate signage on patient door, communicate MRSA status during patient transfers and handoffs"
    ],
    assessmentFindings: [
      "Skin lesions: painful erythematous nodules or abscesses, often with central necrosis or purulent drainage; patients frequently describe initial lesion as resembling a spider bite",
      "Wound infection signs: purulent drainage (thick, yellow-green), wound erythema extending beyond wound margins, increasing wound pain, warmth and induration of surrounding tissue",
      "Fever (temperature above 38.0 degrees Celsius) with chills and malaise indicating systemic infection; persistent or recurring fever despite antibiotics suggests inadequate source control or antibiotic resistance",
      "Cellulitis: diffuse erythema, swelling, warmth, and tenderness of affected skin area; advancing erythema margin should be marked with a skin marker and timed to track progression or regression",
      "Signs of bacteremia: high fever with rigors (shaking chills), tachycardia, hypotension, altered mental status, elevated WBC count; may progress to sepsis requiring intensive care",
      "Nasal vestibulitis in colonized patients: crusting, redness, and tenderness inside the nostrils (anterior nares where MRSA colonization is most common)"
    ],
    signs: {
      left: [
        "Small, localized skin abscess with surrounding erythema",
        "Low-grade fever (below 38.5 degrees Celsius) with wound redness",
        "Purulent drainage from a wound or incision site",
        "Positive nasal swab for MRSA colonization without active infection",
        "Mild cellulitis with localized warmth and tenderness",
        "Elevated WBC count with mild left shift on CBC"
      ],
      right: [
        "Rapidly spreading cellulitis with expanding erythema and crepitus (necrotizing fasciitis)",
        "Signs of sepsis: temperature above 38.3 or below 36.0, heart rate above 90, respiratory rate above 20, altered mental status",
        "Positive blood cultures with hemodynamic instability (MRSA bacteremia progressing to septic shock)",
        "New heart murmur with MRSA bacteremia (possible endocarditis)",
        "Respiratory deterioration with consolidation on chest X-ray (MRSA pneumonia)",
        "Acute kidney injury with elevated creatinine during vancomycin therapy (nephrotoxicity)"
      ]
    },
    medications: [
      {
        name: "Vancomycin (Vancocin)",
        type: "Glycopeptide antibiotic",
        action: "Inhibits bacterial cell wall synthesis by binding to the D-alanyl-D-alanine terminus of cell wall precursor units, preventing their incorporation into the growing peptidoglycan chain; this mechanism is distinct from beta-lactams and remains effective against MRSA because it does not require binding to penicillin-binding proteins",
        sideEffects: "Nephrotoxicity (monitor serum creatinine and BUN), ototoxicity (hearing loss, tinnitus), Red Man syndrome (histamine-mediated flushing of face, neck, and upper torso from rapid infusion), thrombocytopenia, phlebitis at IV site",
        contra: "Known hypersensitivity to vancomycin; use with caution in renal impairment (dose adjustment based on creatinine clearance); concurrent use with other nephrotoxic or ototoxic agents (aminoglycosides, loop diuretics)",
        pearl: "MUST infuse over at least 60 minutes (10 mg per minute maximum) to prevent Red Man syndrome; if Red Man syndrome occurs, stop infusion, administer diphenhydramine as ordered, then restart at slower rate; monitor trough levels (target 15-20 mcg/mL for serious MRSA infections); assess renal function at baseline and every 48-72 hours during therapy"
      },
      {
        name: "Trimethoprim-Sulfamethoxazole (TMP-SMX / Bactrim / Septra)",
        type: "Sulfonamide combination antibiotic (folate synthesis inhibitor)",
        action: "Trimethoprim inhibits dihydrofolate reductase and sulfamethoxazole inhibits dihydropteroate synthase, creating a sequential double blockade of bacterial folate synthesis; folate is essential for DNA synthesis and cell division; this combination is bactericidal and effective against most CA-MRSA strains",
        sideEffects: "Nausea, vomiting, diarrhea, photosensitivity, rash (including rare Stevens-Johnson syndrome), hyperkalemia, bone marrow suppression (thrombocytopenia, leukopenia, megaloblastic anemia), crystalluria",
        contra: "Sulfonamide allergy; severe hepatic or renal impairment; megaloblastic anemia due to folate deficiency; pregnancy (particularly third trimester -- risk of kernicterus in newborn); glucose-6-phosphate dehydrogenase (G6PD) deficiency (risk of hemolytic anemia)",
        pearl: "First-line oral antibiotic for outpatient CA-MRSA skin infections; patient must maintain adequate fluid intake (at least 1500 mL daily) to prevent crystalluria; monitor potassium levels (TMP-SMX can cause hyperkalemia especially with ACE inhibitors or potassium-sparing diuretics); advise sun protection due to photosensitivity; report any rash immediately as it may progress to Stevens-Johnson syndrome"
      },
      {
        name: "Mupirocin (Bactroban)",
        type: "Topical antibiotic for nasal decolonization",
        action: "Inhibits bacterial protein synthesis by binding to bacterial isoleucyl-tRNA synthetase, preventing incorporation of isoleucine into bacterial proteins; this unique mechanism provides activity against Staphylococcus aureus including MRSA; used topically in the anterior nares to eliminate nasal MRSA colonization",
        sideEffects: "Nasal burning and stinging, headache, rhinitis, altered taste; rarely causes contact dermatitis; minimal systemic absorption with topical use",
        contra: "Known hypersensitivity to mupirocin or polyethylene glycol base; not for ophthalmic use; not for use on large open wounds (polyethylene glycol base can be absorbed and cause nephrotoxicity in patients with renal impairment)",
        pearl: "Applied to the anterior nares (inside both nostrils) twice daily for 5 days as part of the MRSA decolonization protocol; instruct patient to apply a small amount (approximately rice grain-sized) to each nostril using a cotton-tipped applicator, then pinch nostrils together and massage gently to distribute; combine with CHG body washes for complete decolonization; effectiveness decreases with repeated use courses (resistance can develop)"
      }
    ],
    pearls: [
      "MRSA colonization and MRSA infection are different: colonization means the bacteria are present (usually in the nares) without causing disease, while infection means bacteria have invaded tissue and are causing symptoms -- colonized patients can transmit MRSA to others even without symptoms",
      "Contact precautions for MRSA include gown and gloves on room entry, hand hygiene before and after all contact, dedicated equipment, and private room or cohorting -- these precautions prevent transmission to other patients through healthcare worker hands and contaminated surfaces",
      "Red Man syndrome from vancomycin is NOT a true allergy -- it is a histamine-mediated reaction caused by rapid infusion; prevention requires infusing over at least 60 minutes; pre-treatment with diphenhydramine may be ordered for patients with a history of this reaction",
      "CA-MRSA skin abscesses require incision and drainage (I&D) as the primary treatment; antibiotics alone are often insufficient because the thick abscess wall prevents adequate antibiotic penetration into the purulent cavity",
      "Vancomycin trough levels should be drawn 30 minutes before the fourth or fifth dose; therapeutic target for serious MRSA infections is 15-20 mcg/mL; subtherapeutic levels lead to treatment failure and resistance development, while supratherapeutic levels increase nephrotoxicity risk",
      "Mark the borders of cellulitis with a skin marker and document the date and time: this allows objective assessment of whether the infection is responding to treatment (margins receding) or progressing (margins advancing beyond the marked line)",
      "MRSA can survive on environmental surfaces for days to weeks: thorough daily cleaning of high-touch surfaces (bedrails, call lights, overbed tables, doorknobs, bathroom fixtures) with hospital-grade disinfectant is essential for preventing transmission"
    ],
    quiz: [
      {
        question: "A practical nurse is assigned to care for a patient with confirmed MRSA wound infection. Which personal protective equipment (PPE) should the nurse don before entering the patient's room?",
        options: [
          "Surgical mask and eye protection only",
          "Gown and gloves",
          "N95 respirator, gown, and gloves",
          "Gloves only with hand hygiene after removal"
        ],
        correct: 1,
        rationale: "MRSA requires contact precautions, which include gown and gloves upon room entry. MRSA is transmitted through direct contact, not airborne transmission, so an N95 respirator is not required. A surgical mask is needed only if the patient has MRSA pneumonia and there is risk of respiratory droplet exposure. Gloves alone are insufficient; a gown is needed to prevent contamination of the nurse's clothing."
      },
      {
        question: "The practical nurse is infusing vancomycin and the patient develops flushing and redness of the face, neck, and chest. What should the nurse do first?",
        options: [
          "Document the allergic reaction and discontinue the vancomycin permanently",
          "Stop the infusion, assess the patient, and notify the physician as this may be Red Man syndrome",
          "Increase the infusion rate to finish the dose more quickly",
          "Apply a cold compress to the affected areas and continue the infusion"
        ],
        correct: 1,
        rationale: "Flushing of the face, neck, and chest during vancomycin infusion is characteristic of Red Man syndrome, a histamine-mediated reaction caused by rapid infusion. The nurse should stop the infusion, assess the patient, and notify the physician. This is not a true allergy but requires the infusion to be restarted at a slower rate after symptoms resolve, often with diphenhydramine pre-treatment."
      },
      {
        question: "A patient with MRSA colonization of the anterior nares is prescribed mupirocin ointment for nasal decolonization. Which instruction should the practical nurse provide?",
        options: [
          "Apply a generous amount of ointment into each nostril four times daily for 14 days",
          "Apply a small amount (approximately rice grain-sized) into each nostril twice daily for 5 days, then pinch and massage nostrils to distribute",
          "Inhale the ointment deeply through the nose to reach the sinuses",
          "Apply the ointment around the outside of the nostrils only to prevent spread"
        ],
        correct: 1,
        rationale: "Mupirocin nasal decolonization protocol involves applying a small amount (rice grain-sized) to the inside of each nostril twice daily for 5 days. After application, the patient should pinch the nostrils together and massage gently to distribute the ointment over the nasal mucosa. It is applied inside the anterior nares where MRSA colonizes, not externally or deeply inhaled."
      }
    ]
  },

  "mumps-rpn": {
    title: "Mumps (Parotitis) for Practical Nurses",
    cellular: {
      title: "Virology and Pathophysiology of Mumps Infection",
      content: "Mumps is an acute, systemic viral infection caused by the mumps virus, a member of the Paramyxoviridae family and the genus Rubulavirus. The mumps virus is a single-stranded, negative-sense RNA virus with an envelope containing hemagglutinin-neuraminidase (HN) and fusion (F) glycoproteins that facilitate viral attachment to and entry into host cells. Transmission occurs through respiratory droplets (coughing, sneezing, talking) and direct contact with infected saliva. The virus is highly contagious, with a secondary attack rate of approximately 50-60% among susceptible household contacts. After inhalation, the mumps virus initially infects and replicates in the respiratory epithelium of the nasopharynx and regional lymph nodes. A primary viremia follows within 2-3 days, disseminating the virus through the bloodstream to target organs, including the salivary glands (particularly the parotid glands), central nervous system, pancreas, testes, ovaries, and other glandular tissues. A secondary viremia occurs 5-7 days later, amplifying viral dissemination and corresponding with the onset of clinical symptoms. The incubation period is 12-25 days (average 16-18 days), and patients are infectious from approximately 2 days before symptom onset until 5 days after parotid swelling appears. The hallmark clinical feature is parotitis (inflammation and swelling of the parotid glands), which occurs in 60-70% of symptomatic infections. The parotid glands are the largest salivary glands, located bilaterally in front of and below each ear. When inflamed, the parotid gland swells and pushes the earlobe upward and outward, producing the characteristic 'chipmunk cheek' appearance. Parotitis is initially unilateral in 25% of cases but becomes bilateral in approximately 75% within 1-5 days. The swelling is tender to palpation and worsened by chewing, swallowing, or consuming acidic foods and beverages that stimulate salivary flow. The opening of the Stensen duct (parotid duct) on the buccal mucosa opposite the second upper molar may appear erythematous and edematous. Approximately 20-40% of mumps infections are asymptomatic or present with nonspecific respiratory symptoms without recognizable parotitis. The most clinically significant complications of mumps include orchitis (testicular inflammation), which occurs in 15-30% of post-pubertal males and presents with severe testicular pain, swelling, and tenderness; it is usually unilateral and carries a small risk of testicular atrophy and subfertility but rarely causes complete sterility. Oophoritis (ovarian inflammation) occurs in approximately 5% of post-pubertal females and is generally milder than orchitis. Aseptic meningitis occurs in up to 10% of mumps cases and is usually self-limiting, while encephalitis is rare (less than 0.1%) but can cause permanent neurological sequelae. Pancreatitis occurs in approximately 4% of cases and may contribute to the development of type 1 diabetes in rare instances. Sensorineural hearing loss is the most common permanent complication, occurring in approximately 1 in 20,000 cases, and is usually unilateral. Prevention through the measles-mumps-rubella (MMR) vaccine is the primary public health strategy; two doses of MMR vaccine provide approximately 88% effectiveness against mumps. The practical nurse must recognize mumps presentations, implement appropriate droplet precautions, monitor for complications, and support patient comfort during the course of illness."
    },
    riskFactors: [
      "Unvaccinated or incompletely vaccinated individuals (lacking two doses of MMR vaccine; most significant modifiable risk factor)",
      "Close contact with infected individual especially in crowded settings (college dormitories, military barracks, athletic teams, correctional facilities)",
      "Post-pubertal males (higher risk of orchitis complication, occurring in 15-30% of affected males after puberty)",
      "International travel to endemic areas (mumps remains common in many countries where vaccination coverage is suboptimal)",
      "Waning vaccine-induced immunity (antibody levels may decline over time, contributing to outbreaks in previously vaccinated young adults)",
      "Immunocompromised individuals (may have inadequate vaccine response or more severe disease course; cannot receive live MMR vaccine)",
      "Healthcare workers without documented immunity (occupational exposure risk through respiratory droplets from infected patients)"
    ],
    diagnostics: [
      "Buccal or oral swab for mumps virus PCR (polymerase chain reaction): most sensitive diagnostic test; collect within 3-5 days of parotitis onset; swab the area around the Stensen duct opening",
      "Serum mumps IgM antibody: detectable within 5 days of symptom onset; may be negative early in illness or in previously vaccinated individuals with breakthrough infection",
      "Serum mumps IgG antibody (acute and convalescent titers): four-fold rise between acute (at symptom onset) and convalescent (2-4 weeks later) confirms recent infection",
      "Serum amylase and lipase: amylase is elevated in both parotitis (salivary amylase) and pancreatitis (pancreatic amylase); lipase elevation is specific for pancreatic involvement",
      "Complete blood count (CBC): may show leukopenia with relative lymphocytosis; normal or mildly elevated WBC count",
      "Lumbar puncture (if meningitis suspected): CSF shows lymphocytic pleocytosis, elevated protein, normal or mildly decreased glucose consistent with viral (aseptic) meningitis pattern"
    ],
    management: [
      "Implement droplet precautions for hospitalized patients: surgical mask within 6 feet of patient, private room preferred, mask on patient during transport; maintain precautions until 5 days after parotitis onset",
      "Provide supportive care for parotitis: apply warm or cool compresses to the parotid glands based on patient comfort preference, provide soft bland diet avoiding acidic or tart foods that stimulate painful salivary flow",
      "Manage fever and pain with analgesics and antipyretics as prescribed: acetaminophen or ibuprofen on a scheduled basis during acute illness; avoid aspirin in children and adolescents (Reye syndrome risk)",
      "Ensure adequate hydration: encourage oral fluids (water, broth, non-acidic juices); monitor for dehydration if patient has difficulty swallowing or has concurrent pancreatitis with vomiting",
      "Monitor for orchitis in post-pubertal males: provide scrotal support (athletic supporter or rolled towel), apply ice packs wrapped in cloth for 15-20 minutes on and 15-20 minutes off, bed rest during acute swelling",
      "Report to public health authorities: mumps is a reportable communicable disease; notify the local health department within 24 hours of confirmed or suspected case",
      "Advise isolation from school, work, and public settings until 5 days after onset of parotid swelling to prevent transmission during the infectious period"
    ],
    nursingActions: [
      "Assess parotid gland swelling bilaterally: measure and document the degree of swelling (noting whether earlobe is displaced), tenderness to palpation, and whether swelling is unilateral or bilateral",
      "Monitor temperature every 4-6 hours: fever typically ranges from 37.8-39.4 degrees Celsius (100-103 degrees Fahrenheit); persistent high fever beyond the expected 3-4 day course may indicate secondary bacterial infection or complication",
      "Assess nutritional intake and hydration status: provide soft, bland, non-acidic foods (mashed potatoes, soup, yogurt, scrambled eggs); avoid citrus, vinegar, and sour foods that stimulate salivary flow and increase parotid pain",
      "Monitor post-pubertal males for signs of orchitis: ask about testicular pain or swelling beginning 4-8 days after parotitis onset; report findings promptly; orchitis occurs in 15-30% of affected post-pubertal males",
      "Assess for signs of meningeal irritation: headache, stiff neck, photophobia, nausea and vomiting, Brudzinski sign, Kernig sign; report neurological changes immediately",
      "Verify immunization status of patient and close contacts: recommend MMR vaccine for non-immune contacts as post-exposure prophylaxis (may prevent or modify disease if given within 72 hours of exposure)",
      "Document and report the case to infection prevention and control: ensure proper documentation of onset date, symptoms, vaccination history, and contacts for public health notification and contact tracing"
    ],
    assessmentFindings: [
      "Bilateral or unilateral parotid gland swelling with characteristic 'chipmunk cheek' appearance; earlobe pushed upward and outward by the swollen gland",
      "Tenderness and pain over the parotid gland area worsened by chewing, swallowing, or eating acidic/sour foods that stimulate salivary secretion",
      "Erythema and edema at the opening of the Stensen duct (parotid duct) on the buccal mucosa opposite the second upper molar",
      "Fever (typically 37.8-39.4 degrees Celsius) with headache, malaise, myalgia, and anorexia preceding parotitis by 1-2 days",
      "Dry mouth (xerostomia) and altered taste due to inflammatory involvement of salivary gland tissue and reduced saliva production",
      "Submandibular and sublingual gland involvement in some cases, producing diffuse neck swelling that can be mistaken for other conditions",
      "Earache (otalgia) referred from parotid inflammation and pressure on the external auditory canal"
    ],
    signs: {
      left: [
        "Mild parotid swelling with low-grade fever and malaise",
        "Discomfort with chewing and eating that limits food intake",
        "Tender cervical and preauricular lymphadenopathy",
        "Mild headache and generalized myalgia",
        "Decreased appetite with mild nausea",
        "Fatigue and irritability especially in children"
      ],
      right: [
        "Severe testicular pain and swelling in post-pubertal male (orchitis requiring urgent assessment)",
        "Signs of meningitis: severe headache, nuchal rigidity, photophobia, vomiting",
        "Severe abdominal pain with elevated lipase (pancreatitis)",
        "Acute sensorineural hearing loss (usually unilateral, potentially permanent)",
        "Signs of encephalitis: altered consciousness, seizures, focal neurological deficits",
        "Severe respiratory distress or airway compromise from massive parotid and cervical swelling"
      ]
    },
    medications: [
      {
        name: "Acetaminophen (Tylenol)",
        type: "Analgesic and antipyretic (non-opioid)",
        action: "Inhibits prostaglandin synthesis primarily in the central nervous system by acting on the cyclooxygenase pathway, reducing the hypothalamic set-point for temperature regulation (antipyretic effect) and modulating pain perception pathways; provides relief of fever and parotid pain without anti-inflammatory effects",
        sideEffects: "Hepatotoxicity with doses exceeding recommended maximum (4 g/day in adults, 2 g/day with liver disease); nausea; rash (rare); acute liver failure with overdose",
        contra: "Severe hepatic impairment or active liver disease; chronic alcohol use disorder (synergistic hepatotoxicity); known hypersensitivity",
        pearl: "First-line antipyretic and analgesic for mumps in all age groups including children; preferred over aspirin (contraindicated in children due to Reye syndrome risk); dose by weight in pediatric patients (10-15 mg/kg every 4-6 hours); check all combination medications for hidden acetaminophen content to prevent inadvertent overdose"
      },
      {
        name: "Ibuprofen (Advil/Motrin)",
        type: "Nonsteroidal anti-inflammatory drug (NSAID)",
        action: "Non-selectively inhibits cyclooxygenase-1 (COX-1) and cyclooxygenase-2 (COX-2) enzymes, reducing prostaglandin synthesis throughout the body; provides analgesic, antipyretic, and anti-inflammatory effects; the anti-inflammatory action is beneficial for reducing parotid gland swelling and orchitis-related testicular inflammation",
        sideEffects: "GI irritation (nausea, dyspepsia, gastric ulceration, GI bleeding), renal impairment (decreased renal blood flow, particularly with dehydration), increased bleeding risk (platelet inhibition), cardiovascular risk with prolonged use, hypersensitivity reactions",
        contra: "Active GI bleeding or peptic ulcer disease; severe renal impairment; aspirin-sensitive asthma (cross-reactivity with NSAIDs); third trimester of pregnancy; dehydration (increased nephrotoxicity risk); children under 6 months",
        pearl: "Useful adjunct to acetaminophen for mumps-related pain, especially orchitis where the anti-inflammatory effect helps reduce testicular swelling; can be alternated with acetaminophen for sustained fever and pain control; administer with food to reduce GI irritation; ensure adequate hydration during use to protect renal function; pediatric dose 5-10 mg/kg every 6-8 hours"
      },
      {
        name: "Intravenous Fluids (0.9% Normal Saline or Lactated Ringer)",
        type: "Isotonic crystalloid solution for fluid replacement",
        action: "Restores intravascular volume and maintains hydration in patients unable to tolerate adequate oral intake due to painful swallowing from parotitis, nausea and vomiting from pancreatitis, or fever-related increased insensible fluid losses; provides vehicle for IV medication administration",
        sideEffects: "Fluid overload (pulmonary edema, peripheral edema, elevated blood pressure) with excessive administration; hypernatremia and hyperchloremic metabolic acidosis (with excessive 0.9% NS); phlebitis at IV insertion site",
        contra: "Unmonitored administration in patients with heart failure or renal failure (fluid overload risk); hypernatremia (for 0.9% NS); hyperkalemia (for Lactated Ringer); fluid restriction orders",
        pearl: "Assess hydration status before and during IV fluid administration: monitor intake and output, daily weight, mucous membrane moisture, skin turgor, urine specific gravity; infuse at prescribed rate using an infusion pump; reassess fluid status every 4-8 hours and report signs of overload (crackles, jugular vein distension, weight gain exceeding 1 kg/day) or continued dehydration"
      }
    ],
    pearls: [
      "Mumps is transmitted via respiratory droplets and requires DROPLET precautions (not contact or airborne): surgical mask within 6 feet of patient, private room, mask on patient during transport; precautions continue until 5 days after onset of parotid swelling",
      "The parotid gland swelling of mumps pushes the earlobe UPWARD and OUTWARD -- this distinctive displacement helps differentiate mumps parotitis from cervical lymphadenopathy or other causes of facial swelling",
      "Orchitis is the most common complication in post-pubertal males (15-30%) and typically occurs 4-8 days after parotitis onset; while testicular atrophy may occur in affected testes, bilateral orchitis with complete sterility is rare -- provide reassurance to anxious patients",
      "Acidic and sour foods (citrus fruits, vinegar, pickles, sour candies) stimulate salivary secretion and dramatically worsen parotid pain -- provide soft, bland, non-acidic diet during the acute phase",
      "Aspirin must NEVER be given to children or adolescents with viral infections due to the risk of Reye syndrome (acute hepatic encephalopathy) -- use acetaminophen or ibuprofen for fever and pain management",
      "Mumps is a REPORTABLE communicable disease in all jurisdictions -- notify the local public health department within 24 hours of confirmed or suspected case for surveillance and contact tracing",
      "Two doses of MMR vaccine provide approximately 88% protection against mumps, but waning immunity can lead to breakthrough infections in previously vaccinated individuals -- these cases are typically milder with fewer complications than in unvaccinated individuals"
    ],
    quiz: [
      {
        question: "A practical nurse is providing dietary guidance to a patient with mumps parotitis. Which food selection is most appropriate?",
        options: [
          "Fresh orange juice and toast with marmalade",
          "Scrambled eggs, mashed potatoes, and milk",
          "Lemonade with a grilled cheese sandwich",
          "Vinaigrette salad dressing on a green salad"
        ],
        correct: 1,
        rationale: "Soft, bland foods such as scrambled eggs, mashed potatoes, and milk are appropriate for patients with mumps parotitis because they require minimal chewing and do not stimulate salivary flow. Acidic foods and beverages (orange juice, lemonade, vinaigrette) stimulate the parotid glands and dramatically increase pain."
      },
      {
        question: "The practical nurse is caring for a 16-year-old male with mumps who reports sudden severe right testicular pain and swelling 5 days after parotitis onset. What is the priority nursing action?",
        options: [
          "Apply warm compresses to the scrotum and encourage ambulation",
          "Provide scrotal support, apply ice packs, and report findings to the physician immediately",
          "Administer aspirin for pain and inflammation as it is the preferred anti-inflammatory for adolescents",
          "Reassure the patient that testicular pain is a normal finding in mumps and requires no intervention"
        ],
        correct: 1,
        rationale: "Orchitis is a serious complication of mumps in post-pubertal males requiring prompt medical evaluation. The nurse should provide scrotal support (athletic supporter or rolled towel), apply ice packs (not warm compresses) to reduce swelling, and report to the physician immediately. Aspirin is contraindicated in adolescents with viral infections due to Reye syndrome risk."
      },
      {
        question: "Which infection control precautions should the practical nurse implement for a hospitalized patient with confirmed mumps?",
        options: [
          "Airborne precautions with N95 respirator and negative pressure room",
          "Contact precautions with gown and gloves on room entry",
          "Droplet precautions with surgical mask when within 6 feet of the patient",
          "Standard precautions only with routine hand hygiene"
        ],
        correct: 2,
        rationale: "Mumps is transmitted through respiratory droplets, requiring droplet precautions: surgical mask when within 6 feet of the patient, private room preferred, and mask on the patient during transport. Airborne precautions (N95 respirator, negative pressure room) are not required because mumps is not transmitted through airborne nuclei. Standard precautions alone are insufficient for this communicable disease."
      }
    ]
  }
};

let injected = 0;
let total = Object.keys(lessons).length;
console.log(`Injecting ${total} OB/Mobility/Infection lessons...`);
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) injected++;
}
console.log(`Done: ${injected}/${total} injected.`);
