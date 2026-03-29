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
  "aortic-root-dilation-rn": {
    title: "Aortic Root Dilation",
    cellular: {
      title: "Structural Pathology of Aortic Root Dilation",
      content: "Aortic root dilation refers to progressive enlargement of the aortic root, the segment of the ascending aorta that extends from the aortic annulus to the sinotubular junction, encompassing the sinuses of Valsalva and the coronary artery ostia. The normal aortic root diameter ranges from 2.0 to 3.7 cm, with dilation defined as measurements exceeding the upper limit of normal for age, sex, and body surface area, typically above 4.0 cm. The aortic root wall consists of three layers: the tunica intima (endothelial cells providing a smooth blood-flow surface), the tunica media (smooth muscle cells and elastic lamellae embedded in an extracellular matrix of collagen, elastin, and glycosaminoglycans that provides tensile strength and elasticity), and the tunica adventitia (connective tissue, vasa vasorum, and nerve fibers). Aortic root dilation results from degeneration of the tunica media, a process historically called cystic medial necrosis or cystic medial degeneration. In this process, smooth muscle cell apoptosis occurs alongside fragmentation and loss of elastic fibers, accumulation of mucoid ground substance (pools of basophilic proteoglycans that replace the normal organized lamellar structure), and disorganization of collagen fibrils. These changes weaken the aortic wall, reducing its ability to withstand the hemodynamic stress of pulsatile blood flow, leading to progressive dilation.\n\nThe pathogenesis varies by etiology. In heritable connective tissue disorders such as Marfan syndrome (mutations in FBN1 encoding fibrillin-1), the deficiency of fibrillin-1 disrupts microfibrillar scaffolding that normally sequesters transforming growth factor-beta (TGF-beta) in the extracellular matrix. Excess free TGF-beta signaling activates matrix metalloproteinases (MMPs), particularly MMP-2 and MMP-9, which degrade elastin and collagen, accelerating medial degeneration. In Loeys-Dietz syndrome (mutations in TGFBR1 or TGFBR2), paradoxical upregulation of TGF-beta signaling occurs despite receptor dysfunction, producing aggressive aortic dilation with a high risk of dissection at relatively small aortic diameters. In Ehlers-Danlos syndrome (vascular type, COL3A1 mutations), defective type III collagen synthesis compromises vascular wall integrity, predisposing to spontaneous arterial rupture and dissection. Turner syndrome (45,X karyotype) is associated with aortic root dilation and bicuspid aortic valve, with the risk of dissection disproportionately high relative to the degree of dilation.\n\nNon-heritable causes include bicuspid aortic valve (present in 1-2% of the population), which causes altered flow patterns that generate increased wall shear stress on the ascending aorta, promoting medial degeneration independent of valve stenosis or regurgitation. Chronic hypertension increases wall stress via LaPlace's law (wall tension equals pressure multiplied by radius divided by wall thickness), creating a positive feedback loop as the aorta dilates. Atherosclerosis, aging, and inflammatory conditions such as giant cell arteritis and Takayasu arteritis also contribute. The clinical significance of aortic root dilation lies in its association with life-threatening complications: aortic dissection (a tear in the intimal layer allowing blood to dissect into the media), aortic rupture (complete transmural disruption), and progressive aortic regurgitation (dilation of the aortic annulus distorting the coaptation of the aortic valve leaflets). The rate of dilation varies: Marfan syndrome averages 0.5 to 1.0 mm per year, while bicuspid aortic valve averages 0.2 to 0.5 mm per year. Dissection risk increases sharply when the aortic root exceeds 5.0 cm in most patients, or 4.0 to 4.5 cm in Marfan or Loeys-Dietz patients. Surgical intervention (composite valve-graft replacement or valve-sparing root replacement) is recommended when thresholds are reached or when the rate of dilation exceeds 0.5 cm per year."
    },
    riskFactors: [
      "Marfan syndrome (FBN1 mutation, most common heritable cause)",
      "Loeys-Dietz syndrome (TGFBR1/TGFBR2 mutations, aggressive dilation at small diameters)",
      "Ehlers-Danlos syndrome vascular type (COL3A1 mutation, spontaneous rupture risk)",
      "Bicuspid aortic valve (1-2% population prevalence, altered hemodynamic flow)",
      "Turner syndrome (45,X karyotype, disproportionate dissection risk)",
      "Chronic uncontrolled hypertension (increased wall stress via LaPlace's law)",
      "Family history of thoracic aortic aneurysm or dissection (familial TAAD)"
    ],
    diagnostics: [
      "Transthoracic echocardiography (TTE) with measurement at sinuses of Valsalva, sinotubular junction, and ascending aorta at standardized points using leading-edge technique",
      "CT angiography (CTA) of the chest for precise measurement of aortic dimensions, evaluating extent of dilation and relationship to branch vessels",
      "MRI/MRA for serial surveillance without radiation exposure, preferred in young patients requiring lifelong monitoring",
      "Genetic testing and counseling for suspected heritable connective tissue disorders (FBN1, TGFBR1/2, COL3A1, ACTA2 mutations)",
      "Serial monitoring: baseline then every 6 months until stable, then annually; more frequent if rate of growth exceeds 0.3 cm/year",
      "Assessment of aortic valve function (regurgitation severity) on echocardiography as root dilates"
    ],
    management: [
      "Strict blood pressure control targeting less than 130/80 mmHg to reduce aortic wall stress",
      "Beta-blocker therapy (first-line) to reduce heart rate, blood pressure, and dP/dt (rate of aortic pressure rise)",
      "Angiotensin receptor blockers (ARBs) for TGF-beta modulation, particularly in Marfan syndrome",
      "Activity modification: avoid isometric exercise, heavy lifting (more than 20 kg), competitive contact sports, and Valsalva maneuvers that acutely raise aortic pressure",
      "Surgical referral when aortic root reaches 5.0 cm (general) or 4.0 to 4.5 cm (Marfan/Loeys-Dietz) or rate of growth exceeds 0.5 cm per year",
      "Preconception counseling for women with heritable aortopathy due to increased dissection risk during pregnancy (hemodynamic stress of pregnancy)",
      "Endocarditis prophylaxis if aortic regurgitation with prosthetic material is present"
    ],
    nursingActions: [
      "Assess blood pressure in both arms at each encounter to detect differences that may indicate subclavian involvement or evolving dissection; target less than 130/80 mmHg in most patients with aortopathy",
      "Auscultate for aortic regurgitation murmur (early diastolic, high-pitched, best heard along left sternal border with patient sitting up, leaning forward, and in full expiration) and note any change from baseline",
      "Monitor for signs of acute aortic dissection requiring emergency intervention: sudden tearing chest pain radiating to the back, pulse deficits between extremities, new aortic regurgitation murmur, hypotension, widened mediastinum on chest radiograph",
      "Educate patient on lifelong surveillance schedule and importance of adherence to serial imaging even when asymptomatic, as dilation is typically painless until complications occur",
      "Reinforce activity restrictions: no competitive athletics, no heavy isometric exercises (weightlifting), avoid straining and Valsalva maneuvers; recommend moderate aerobic activity (walking, cycling at moderate intensity) as tolerated",
      "Coordinate genetic counseling referral and facilitate family screening for first-degree relatives of patients with heritable aortopathy (50% transmission risk in autosomal dominant conditions)",
      "Ensure patient carries medical identification indicating aortopathy diagnosis and anticoagulant or beta-blocker use if applicable, to guide emergency management if acute event occurs"
    ],
    assessmentFindings: [
      "Aortic root diameter exceeding 4.0 cm on echocardiography or CT angiography",
      "Early diastolic murmur of aortic regurgitation along left sternal border",
      "Widened pulse pressure (systolic minus diastolic greater than 40 mmHg) indicating significant aortic regurgitation",
      "Marfanoid habitus: tall stature, arm span exceeding height, arachnodactyly (positive wrist and thumb signs), pectus deformity, high-arched palate",
      "Lens subluxation (ectopia lentis) on slit-lamp examination in Marfan syndrome",
      "Skin hyperextensibility, easy bruising, translucent skin, visible veins in Ehlers-Danlos vascular type"
    ],
    signs: {
      left: [
        "Asymptomatic dilation found on screening imaging",
        "Soft early diastolic murmur at left sternal border",
        "Mild widened pulse pressure",
        "Family history of aortopathy or connective tissue disorder",
        "Marfanoid features on physical examination"
      ],
      right: [
        "Sudden severe tearing chest or back pain (dissection)",
        "Pulse deficit between upper extremities",
        "Hypotension with tachycardia (rupture or tamponade)",
        "New or rapidly worsening aortic regurgitation murmur",
        "Syncope or altered level of consciousness (hemodynamic collapse)"
      ]
    },
    medications: [
      {
        name: "Losartan",
        type: "Angiotensin II Receptor Blocker (ARB)",
        action: "Blocks angiotensin II at the AT1 receptor, reducing blood pressure, aortic wall stress, and TGF-beta signaling that drives medial degeneration in Marfan syndrome and other connective tissue disorders",
        sideEffects: "Hypotension, dizziness, hyperkalemia, fatigue, headache, elevated serum creatinine",
        contra: "Pregnancy (teratogenic - causes renal agenesis and oligohydramnios), bilateral renal artery stenosis, hyperkalemia above 5.5 mEq/L, concomitant use with aliskiren in diabetic patients",
        pearl: "Losartan has shown benefit in Marfan syndrome by modulating TGF-beta signaling beyond simple blood pressure reduction; monitor potassium and creatinine 1 to 2 weeks after initiation or dose change; contraindicated in pregnancy so preconception counseling is essential in reproductive-age women"
      },
      {
        name: "Atenolol",
        type: "Cardioselective Beta-1 Blocker",
        action: "Reduces heart rate, blood pressure, and dP/dt (the rate of rise of aortic pressure during systole), decreasing hemodynamic stress on the dilated aortic root and slowing the rate of dilation",
        sideEffects: "Bradycardia, hypotension, fatigue, cold extremities, exercise intolerance, bronchospasm at high doses, masking of hypoglycemia symptoms",
        contra: "Severe bradycardia (heart rate less than 50 bpm), second or third-degree heart block without pacemaker, decompensated heart failure, severe reactive airway disease, cardiogenic shock",
        pearl: "Beta-blockers are the cornerstone of medical therapy for aortic root dilation; target resting heart rate of 60 to 70 bpm; do not abruptly discontinue as rebound tachycardia can acutely increase aortic wall stress; preferred over non-selective beta-blockers due to cardioselectivity"
      },
      {
        name: "Amlodipine",
        type: "Dihydropyridine Calcium Channel Blocker",
        action: "Inhibits L-type calcium channels in vascular smooth muscle, producing peripheral vasodilation and reducing systemic vascular resistance and blood pressure without significant negative chronotropic effect",
        sideEffects: "Peripheral edema (dose-dependent, up to 10%), headache, flushing, dizziness, palpitations, gingival hyperplasia with long-term use",
        contra: "Severe aortic stenosis (may cause dangerous hypotension), cardiogenic shock, unstable angina, known hypersensitivity to dihydropyridines",
        pearl: "Used as adjunctive antihypertensive when beta-blocker alone does not achieve target blood pressure; the peripheral edema is due to precapillary arteriolar dilation (not fluid overload) and does not respond to diuretics; may cause reflex tachycardia if used without concurrent beta-blocker"
      }
    ],
    pearls: [
      "The sinuses of Valsalva measurement is the most important aortic root dimension for surveillance because this is where dilation typically begins and dissection originates in connective tissue disorders",
      "Loeys-Dietz syndrome patients can dissect at aortic diameters as small as 4.0 cm, so surgical thresholds are lower (4.0 to 4.2 cm) compared to Marfan (4.5 to 5.0 cm) or degenerative aneurysms (5.0 to 5.5 cm)",
      "Pregnancy increases dissection risk in aortopathy patients due to hemodynamic changes: cardiac output increases 30 to 50%, blood volume expands 40%, and hormonal changes (estrogen, relaxin) weaken the aortic wall; pre-pregnancy aortic root should ideally be less than 4.0 cm",
      "Bicuspid aortic valve-associated aortopathy is an intrinsic wall defect, not purely hemodynamic; dilation can progress even after valve replacement, so continued surveillance is mandatory",
      "The rate of aortic growth is as important as absolute diameter; growth exceeding 0.5 cm per year indicates accelerated degeneration and warrants surgical consultation regardless of current diameter",
      "Fluoroquinolone antibiotics (ciprofloxacin, levofloxacin) are associated with increased risk of aortic aneurysm and dissection due to collagen degradation; avoid in patients with aortopathy",
      "Family screening with echocardiography is recommended for all first-degree relatives of patients with heritable thoracic aortic disease, as many carriers are asymptomatic until catastrophic dissection"
    ],
    quiz: [
      {
        question: "A 28-year-old tall male with a family history of sudden death presents with an aortic root diameter of 4.6 cm on echocardiography. Genetic testing confirms FBN1 mutation. What is the priority nursing action?",
        options: [
          "Encourage the patient to continue regular weightlifting to strengthen cardiovascular fitness",
          "Educate the patient about surgical referral criteria and the importance of strict blood pressure control",
          "Reassure the patient that surgical intervention is not needed until the aorta reaches 6.0 cm",
          "Administer IV nitroprusside to rapidly reduce blood pressure"
        ],
        correct: 1,
        rationale: "In Marfan syndrome (FBN1 mutation), surgical intervention is recommended at 4.5 to 5.0 cm, so this patient is approaching the threshold. Priority nursing actions include education about surgical referral, strict blood pressure control (target less than 130/80), and activity restrictions. Weightlifting is contraindicated. The 6.0 cm threshold is incorrect for Marfan. IV nitroprusside is used in acute dissection, not chronic management."
      },
      {
        question: "A nurse is monitoring a patient with Loeys-Dietz syndrome who suddenly develops severe tearing chest pain radiating to the back with a blood pressure of 200/110 mmHg in the right arm and 160/90 mmHg in the left arm. What should the nurse do first?",
        options: [
          "Administer oral atenolol and recheck blood pressure in 30 minutes",
          "Activate the emergency response system and prepare for emergent IV antihypertensive therapy and surgical consultation",
          "Apply oxygen via nasal cannula and elevate the head of bed",
          "Obtain a 12-lead ECG to rule out myocardial infarction before intervening"
        ],
        correct: 1,
        rationale: "Sudden tearing chest/back pain with pulse deficit between arms in a patient with known aortopathy is classic for acute aortic dissection, a life-threatening emergency. The nurse must activate the emergency response system immediately, prepare for IV esmolol or labetalol to rapidly reduce heart rate and blood pressure (target heart rate less than 60 bpm, SBP 100 to 120 mmHg), and facilitate emergent surgical consultation. Oral medications are too slow. While oxygen and ECG are important, they do not address the emergency."
      },
      {
        question: "A patient with bicuspid aortic valve undergoes successful aortic valve replacement. The patient asks the nurse if they still need echocardiographic surveillance of the aorta. What is the correct response?",
        options: [
          "No, once the valve is replaced, the risk of aortic complications is eliminated",
          "Yes, bicuspid aortic valve aortopathy is an intrinsic wall defect that can progress even after valve replacement, so continued surveillance is needed",
          "Surveillance is only needed if the patient develops hypertension",
          "Only CT angiography can monitor the aorta after surgery; echocardiography is insufficient"
        ],
        correct: 1,
        rationale: "Bicuspid aortic valve aortopathy is caused by an intrinsic defect in the aortic wall (medial degeneration), not solely by the hemodynamic effects of the abnormal valve. Therefore, dilation can continue to progress even after valve replacement, and lifelong surveillance with imaging is mandatory. Both echocardiography and CT angiography can be used for monitoring."
      }
    ]
  },

  "apl-rn": {
    title: "Acute Promyelocytic Leukemia (APL)",
    cellular: {
      title: "Molecular Pathogenesis and Coagulopathy of APL",
      content: "Acute promyelocytic leukemia (APL) is a distinct subtype of acute myeloid leukemia (AML-M3 in the FAB classification) characterized by the accumulation of abnormal promyelocytes in the bone marrow and a uniquely dangerous coagulopathy. APL accounts for approximately 5 to 8% of all AML cases and is defined by the balanced reciprocal translocation t(15;17)(q24.1;q21.2), which fuses the promyelocytic leukemia gene (PML) on chromosome 15 with the retinoic acid receptor alpha gene (RARA) on chromosome 17, creating the PML-RARA fusion oncoprotein.\n\nUnder normal hematopoiesis, retinoic acid receptor alpha (RARA) binds retinoic acid and functions as a transcription factor that drives myeloid differentiation. The PML-RARA fusion protein acts as a dominant-negative transcriptional repressor: it recruits nuclear co-repressor complexes (N-CoR and SMRT) and histone deacetylases (HDACs) to retinoic acid response elements (RAREs) in the promoter regions of genes essential for myeloid differentiation. This epigenetic silencing blocks the differentiation of promyelocytes into mature granulocytes, causing accumulation of malignant promyelocytes arrested at the promyelocytic stage. The PML-RARA fusion protein also disrupts PML nuclear bodies (PML-NBs), which normally function as tumor suppressors involved in apoptosis, DNA repair, senescence, and antiviral defense, further contributing to leukemogenesis.\n\nThe hallmark clinical feature of APL is a severe, life-threatening coagulopathy that distinguishes it from all other AML subtypes. This coagulopathy is driven by three simultaneous mechanisms. First, disseminated intravascular coagulation (DIC): the abnormal promyelocytes express and release tissue factor (TF) and cancer procoagulant (CP, a cysteine protease that directly activates factor X), triggering systemic activation of the coagulation cascade with consumption of clotting factors and platelets. Second, hyperfibrinolysis: the malignant promyelocytes overexpress annexin II on their cell surface, which serves as a receptor for tissue plasminogen activator (tPA), markedly increasing plasmin generation and fibrinolysis. They also produce urokinase-type plasminogen activator (uPA) and release elastase, which degrades fibrinogen and other coagulation proteins. Third, proteolysis: granules within the abnormal promyelocytes release elastase and other proteases upon cell lysis, directly degrading fibrinogen, von Willebrand factor, and other hemostatic proteins. The combination of DIC with superimposed hyperfibrinolysis creates a catastrophic bleeding diathesis that is the leading cause of early death in APL, accounting for the majority of fatalities within the first 30 days of diagnosis.\n\nLaboratory findings in APL include pancytopenia (though the WBC can be elevated in the high-risk variant), circulating promyelocytes with characteristic heavy azurophilic granulation, Auer rods (often in bundles called faggot cells), and the coagulopathy triad: prolonged PT and aPTT, decreased fibrinogen (often below 150 mg/dL), elevated D-dimer, and thrombocytopenia. Flow cytometry shows a characteristic immunophenotype: CD13+, CD33+, CD117+, and characteristically HLA-DR negative (unlike most other AML subtypes). Definitive diagnosis requires demonstration of the PML-RARA fusion by FISH or RT-PCR.\n\nAPL is unique among leukemias because it is curable in over 90% of patients with targeted therapy. All-trans retinoic acid (ATRA) overcomes the transcriptional block by binding to the RARA moiety of the PML-RARA fusion at pharmacologic concentrations, causing a conformational change that displaces co-repressors and recruits co-activators, restoring transcription of differentiation genes and inducing terminal differentiation of the leukemic promyelocytes into mature granulocytes. Arsenic trioxide (ATO) binds to the PML moiety, inducing degradation of the PML-RARA fusion protein through SUMOylation and proteasomal degradation, and also promotes apoptosis through reactive oxygen species generation and mitochondrial membrane depolarization. The combination of ATRA plus ATO is now standard of care for low-to-intermediate-risk APL (WBC less than 10,000), achieving cure rates exceeding 95% without conventional chemotherapy."
    },
    riskFactors: [
      "Prior exposure to topoisomerase II inhibitors (etoposide, doxorubicin) - therapy-related APL",
      "Prior radiation therapy (increased risk of secondary leukemias including APL)",
      "Peak incidence in young adults aged 20 to 40 years (bimodal with second peak in older adults)",
      "Hispanic/Latino ethnicity (higher incidence and prevalence compared to other populations)",
      "Obesity (associated with increased incidence of AML subtypes including APL)",
      "Environmental exposure to benzene and petroleum products",
      "No strong hereditary predisposition identified unlike some other leukemia subtypes"
    ],
    diagnostics: [
      "Stat complete blood count with differential revealing pancytopenia or leukocytosis; circulating abnormal promyelocytes with heavy granulation and Auer rods (faggot cells) on peripheral smear",
      "Coagulation panel: prolonged PT and aPTT, markedly decreased fibrinogen (often below 100 mg/dL), elevated D-dimer, low antithrombin III confirming DIC",
      "Bone marrow biopsy and aspirate showing hypercellular marrow packed with abnormal promyelocytes; flow cytometry demonstrating CD13+, CD33+, HLA-DR negative immunophenotype",
      "FISH for PML-RARA fusion confirming t(15;17) translocation; RT-PCR for PML-RARA transcript for diagnosis and quantitative monitoring of minimal residual disease",
      "Monitor serial fibrinogen levels every 6 to 8 hours during initial treatment, maintaining above 150 mg/dL with cryoprecipitate replacement",
      "Baseline hepatic function panel and triglycerides before ATRA initiation (ATRA causes hypertriglyceridemia and hepatotoxicity)"
    ],
    management: [
      "Begin ATRA immediately upon clinical suspicion of APL based on morphology, even before genetic confirmation, because early treatment reduces hemorrhagic death",
      "Low-to-intermediate risk (WBC less than 10,000): ATRA plus arsenic trioxide (ATO) without chemotherapy; achieves greater than 95% cure rate",
      "High-risk (WBC greater than 10,000): ATRA plus ATO plus idarubicin or ATRA plus anthracycline-based chemotherapy",
      "Aggressive supportive care for coagulopathy: maintain fibrinogen above 150 mg/dL with cryoprecipitate, maintain platelets above 30,000 to 50,000 with platelet transfusions, fresh frozen plasma for coagulation factor replacement",
      "Monitor for and treat differentiation syndrome (formerly ATRA syndrome): dexamethasone 10 mg IV every 12 hours at first sign of symptoms",
      "Consolidation therapy followed by maintenance (in chemotherapy-containing regimens) or ATRA/ATO cycles per protocol",
      "Molecular monitoring with RT-PCR for PML-RARA at end of consolidation and periodically thereafter; persistent positivity requires additional therapy"
    ],
    nursingActions: [
      "Administer ATRA with a fatty meal to enhance absorption (fat-soluble vitamin A derivative); monitor for early signs of differentiation syndrome every 4 hours: unexplained fever, dyspnea, weight gain greater than 5% of body weight, peripheral edema, pleural or pericardial effusions, and hypotension",
      "Maintain strict bleeding precautions: soft toothbrush, electric razor only, avoid IM injections and rectal temperatures, apply prolonged pressure to venipuncture sites for at least 5 minutes, test stool and urine for occult blood, monitor for headache (may indicate intracranial hemorrhage)",
      "Monitor coagulation labs (fibrinogen, PT, aPTT, D-dimer, platelet count) every 6 to 8 hours during acute phase; notify provider immediately if fibrinogen drops below 150 mg/dL for cryoprecipitate replacement or platelets drop below 30,000 for transfusion",
      "Assess for signs of DIC: petechiae, ecchymoses, oozing from IV sites and mucous membranes, hematuria, melena, prolonged bleeding from minor wounds, altered mental status suggesting intracranial bleeding",
      "Monitor for arsenic trioxide side effects: QTc prolongation (obtain baseline ECG, maintain potassium above 4.0 mEq/L and magnesium above 2.0 mg/dL), hepatotoxicity (monitor LFTs twice weekly), hyperglycemia, and peripheral neuropathy",
      "Implement neutropenic precautions during treatment-induced pancytopenia: private room, strict hand hygiene, no fresh flowers or raw foods, monitor temperature every 4 hours, report fever above 38.0 C immediately for blood cultures and empiric antibiotics",
      "Educate patient that APL has the highest cure rate of any adult acute leukemia when treated appropriately; reinforce importance of completing all treatment cycles and follow-up molecular monitoring"
    ],
    assessmentFindings: [
      "Fatigue, pallor, and dyspnea on exertion from anemia (decreased RBC production due to marrow replacement)",
      "Petechiae, ecchymoses, mucosal bleeding (gingival, epistaxis), and heavy menstrual bleeding from combined thrombocytopenia and DIC-driven coagulopathy",
      "Fever and recurrent or unusual infections from neutropenia",
      "Disseminated intravascular coagulation: oozing from venipuncture sites, central line sites, and surgical wounds simultaneously",
      "Bone pain from expanding leukemic cell mass in the marrow",
      "Hepatosplenomegaly from extramedullary infiltration of leukemic cells"
    ],
    signs: {
      left: [
        "Fatigue and exercise intolerance (anemia)",
        "Easy bruising and petechiae (thrombocytopenia/DIC)",
        "Recurrent minor infections (neutropenia)",
        "Mild gingival bleeding when brushing teeth",
        "Bone or joint pain"
      ],
      right: [
        "Massive hemorrhage (intracranial, pulmonary, GI) from DIC",
        "Differentiation syndrome: fever, dyspnea, pulmonary infiltrates, weight gain, hypotension",
        "Tumor lysis syndrome: hyperkalemia, hyperuricemia, hyperphosphatemia, hypocalcemia, acute kidney injury",
        "QTc prolongation and cardiac arrhythmia from arsenic trioxide",
        "Septic shock from severe neutropenia with fever"
      ]
    },
    medications: [
      {
        name: "All-Trans Retinoic Acid (ATRA/Tretinoin)",
        type: "Differentiation Agent (Vitamin A Derivative)",
        action: "Binds to the RARA portion of the PML-RARA fusion protein at pharmacologic doses, displacing co-repressors and recruiting co-activators, thereby restoring transcription of myeloid differentiation genes and inducing terminal differentiation of leukemic promyelocytes into mature granulocytes",
        sideEffects: "Differentiation syndrome (fever, dyspnea, pulmonary infiltrates, weight gain, pleural/pericardial effusions - can be fatal if untreated), headache (pseudotumor cerebri), dry skin and mucous membranes, hypertriglyceridemia, hepatotoxicity, teratogenicity",
        contra: "Pregnancy (Category X - severe teratogenicity), breastfeeding, hypersensitivity to retinoids, severe hepatic impairment, concurrent vitamin A supplementation",
        pearl: "Administer with fatty food to optimize absorption; at the first sign of differentiation syndrome (unexplained fever plus dyspnea or weight gain), start dexamethasone 10 mg IV every 12 hours immediately without waiting for confirmation; obtain two negative pregnancy tests before starting in women of childbearing potential"
      },
      {
        name: "Arsenic Trioxide (ATO)",
        type: "Targeted Antileukemic Agent",
        action: "Binds to the PML moiety of the PML-RARA fusion protein, inducing SUMOylation and proteasomal degradation of the oncoprotein; also promotes apoptosis through reactive oxygen species generation, mitochondrial membrane depolarization, and caspase activation",
        sideEffects: "QTc prolongation (risk of torsades de pointes), hepatotoxicity (elevated transaminases), hyperglycemia, hypokalemia, hypomagnesemia, peripheral neuropathy, fatigue, differentiation syndrome (lower incidence than ATRA alone)",
        contra: "Baseline QTc greater than 500 msec, hypokalemia below 4.0 mEq/L or hypomagnesemia below 2.0 mg/dL (must be corrected before dosing), severe hepatic impairment, pregnancy",
        pearl: "Obtain baseline ECG and correct electrolytes before each dose; maintain potassium above 4.0 mEq/L and magnesium above 2.0 mg/dL throughout therapy to prevent fatal arrhythmia; monitor ECG weekly during induction; infuse over 1 to 2 hours IV, never as a bolus"
      },
      {
        name: "Dexamethasone",
        type: "Glucocorticoid (Anti-inflammatory)",
        action: "Potent anti-inflammatory that suppresses the cytokine storm and inflammatory cascade driving differentiation syndrome; reduces capillary leak, pulmonary edema, and systemic inflammation caused by rapid differentiation and lysis of leukemic promyelocytes",
        sideEffects: "Hyperglycemia (monitor blood glucose every 6 hours), hypertension, immunosuppression with infection risk, insomnia, mood changes, gastric irritation, myopathy with prolonged use, adrenal suppression",
        contra: "Active uncontrolled systemic infection (relative - benefit usually outweighs risk in differentiation syndrome), known hypersensitivity to dexamethasone, active GI bleeding (use with caution)",
        pearl: "In APL, dexamethasone 10 mg IV every 12 hours is initiated at the first sign of differentiation syndrome and continued until resolution; do not delay treatment waiting for confirmation; prophylactic dexamethasone may be given in high-risk APL (WBC greater than 10,000) to prevent differentiation syndrome"
      }
    ],
    pearls: [
      "APL is a hematologic emergency: start ATRA immediately on morphologic suspicion (abnormal promyelocytes with Auer rods) without waiting for genetic confirmation, as delays increase hemorrhagic death risk",
      "The most common cause of death in APL is hemorrhage from the unique DIC-hyperfibrinolysis coagulopathy, particularly intracranial hemorrhage in the first 30 days; aggressive blood product support is lifesaving",
      "Differentiation syndrome occurs in 25 to 30% of patients, typically between days 2 and 21 of ATRA therapy; the classic triad is unexplained fever, dyspnea, and weight gain; it can be fatal if dexamethasone is delayed",
      "The WBC count is the most important prognostic factor in APL: WBC greater than 10,000 at diagnosis defines high-risk disease requiring addition of chemotherapy to ATRA/ATO",
      "APL is the most curable adult acute leukemia with greater than 90% overall survival when treated with ATRA-based regimens; however, early death (within 30 days) from hemorrhage remains 5 to 10%",
      "Arsenic trioxide causes QTc prolongation through potassium and magnesium depletion and direct cardiac ion channel effects; fatal torsades de pointes has been reported; electrolyte repletion is mandatory before each dose",
      "Faggot cells (promyelocytes with bundles of Auer rods) are pathognomonic for APL and should trigger immediate ATRA initiation; the microgranular variant (M3v) has bilobed nuclei and fewer visible granules but carries the same t(15;17) translocation"
    ],
    quiz: [
      {
        question: "A patient newly diagnosed with APL develops fever of 38.5 C, dyspnea, and a 3 kg weight gain on day 5 of ATRA therapy. The SpO2 is 89% on room air. What is the priority nursing intervention?",
        options: [
          "Discontinue ATRA immediately and notify the provider",
          "Administer dexamethasone 10 mg IV and notify the provider while continuing ATRA",
          "Administer acetaminophen for fever and monitor SpO2",
          "Obtain blood cultures and start empiric antibiotics"
        ],
        correct: 1,
        rationale: "This presentation (fever, dyspnea, weight gain, hypoxia on day 5 of ATRA) is classic differentiation syndrome. The priority is dexamethasone 10 mg IV every 12 hours started immediately, as delays increase mortality. ATRA is usually continued unless the syndrome is severe/life-threatening. While blood cultures may be obtained, differentiation syndrome must be treated presumptively without delay."
      },
      {
        question: "A nurse is caring for a patient with APL whose fibrinogen level is 95 mg/dL (normal 200-400 mg/dL). The patient has petechiae and oozing from an IV site. What is the most appropriate action?",
        options: [
          "Document the findings and recheck in 4 hours",
          "Administer vitamin K 10 mg IV as ordered",
          "Notify the provider and prepare to administer cryoprecipitate to maintain fibrinogen above 150 mg/dL",
          "Apply pressure dressings and elevate the extremity"
        ],
        correct: 2,
        rationale: "In APL, fibrinogen must be maintained above 150 mg/dL to prevent life-threatening hemorrhage from the DIC-hyperfibrinolysis coagulopathy. A level of 95 mg/dL with active bleeding signs requires urgent cryoprecipitate transfusion (each unit raises fibrinogen approximately 5 to 10 mg/dL). Vitamin K addresses vitamin K-dependent factor deficiency, not fibrinogen depletion. Waiting 4 hours risks catastrophic hemorrhage."
      },
      {
        question: "Before administering arsenic trioxide to a patient with APL, which laboratory value must the nurse verify is within acceptable range?",
        options: [
          "Serum albumin level",
          "Serum potassium level (must be above 4.0 mEq/L)",
          "Hemoglobin A1c",
          "Serum iron and ferritin levels"
        ],
        correct: 1,
        rationale: "Arsenic trioxide causes QTc prolongation that can lead to fatal torsades de pointes. Hypokalemia and hypomagnesemia dramatically increase this risk. Before each dose, potassium must be above 4.0 mEq/L and magnesium above 2.0 mg/dL. The nurse must verify electrolytes and withhold the dose if they are subtherapeutic until corrected."
      }
    ]
  },

  "ards-phenotypes-rn": {
    title: "ARDS Phenotypes (Focal vs Diffuse)",
    cellular: {
      title: "Pathophysiology of ARDS Phenotypes and Ventilatory Implications",
      content: "Acute Respiratory Distress Syndrome (ARDS) is a syndrome of non-cardiogenic pulmonary edema and refractory hypoxemia caused by diffuse alveolar damage. The Berlin definition classifies ARDS by severity based on the PaO2/FiO2 ratio: mild (200 to 300 mmHg), moderate (100 to 200 mmHg), and severe (less than 100 mmHg), all with bilateral opacities on chest imaging not fully explained by cardiac failure or fluid overload. While the Berlin definition treats ARDS as a single entity, accumulating evidence demonstrates that ARDS comprises distinct phenotypes with different pathobiology, treatment responses, and outcomes, making phenotype recognition increasingly important for nursing care.\n\nThe most clinically actionable phenotypic distinction is between focal and diffuse ARDS, identified by CT morphology. Focal ARDS (approximately 30% of cases) is characterized by heterogeneous lung involvement: areas of consolidation and atelectasis concentrated in the dependent (posterior in supine patients) lung regions, with relatively preserved aeration in non-dependent (anterior) regions. Diffuse ARDS (approximately 70% of cases) shows homogeneous bilateral involvement with widespread ground-glass opacities and consolidation throughout all lung regions. This distinction matters because the mechanical behavior of the lungs differs fundamentally between phenotypes, directly affecting how ventilator management should be optimized.\n\nThe pathophysiology of diffuse ARDS involves widespread injury to the alveolar-capillary membrane across both lungs. The alveolar epithelial barrier (composed of flat type I pneumocytes covering 95% of the alveolar surface and cuboidal type II pneumocytes that produce surfactant) is damaged by direct insults (pneumonia, aspiration, inhalation injury) or indirect insults (sepsis, pancreatitis, transfusion-related acute lung injury). Neutrophils are recruited to the alveolar space where they release reactive oxygen species, proteases, and neutrophil extracellular traps (NETs) that further damage the epithelium. The resultant increased permeability allows protein-rich edema fluid to flood the alveoli, inactivating surfactant and causing alveolar collapse. Because the injury is widespread, most lung units are recruited or recruitable, and the lung behaves like a small, stiff (low compliance) but relatively homogeneous organ.\n\nIn focal ARDS, the injury is concentrated in dependent lung regions. Gravitational forces, the weight of the overlying edematous lung, and the compressive effect of abdominal contents (especially in obesity or abdominal hypertension) cause dependent atelectasis and consolidation. Non-dependent lung regions remain aerated and relatively compliant. This creates significant heterogeneity: the lung behaves as a small aerated portion (the baby lung) that receives all tidal volume, surrounded by non-aerated dependent regions. If inappropriate ventilatory strategies are applied, the aerated regions can be subjected to overdistension (volutrauma) while collapsed regions remain unrecruited.\n\nTwo biologic sub-phenotypes have also been identified through latent class analysis of clinical trial data: hyperinflammatory (phenotype 2) and hypoinflammatory (phenotype 1). The hyperinflammatory phenotype is characterized by higher plasma levels of inflammatory biomarkers (interleukin-6, interleukin-8, soluble TNF receptor-1, plasminogen activator inhibitor-1), lower serum bicarbonate, higher prevalence of sepsis as the inciting cause, more vasopressor use, higher mortality (approximately 44% vs 23%), and, critically, different responses to interventions. Hyperinflammatory patients benefit from higher PEEP strategies and conservative fluid management, while hypoinflammatory patients may not benefit from or may even be harmed by the same interventions.\n\nVentilatory management differs by phenotype. Lung-protective ventilation (tidal volume 6 mL/kg predicted body weight, plateau pressure less than 30 cmH2O) remains standard for all ARDS. However, the optimal PEEP differs: in diffuse ARDS, higher PEEP (12 to 20 cmH2O) recruits collapsed alveoli across the widespread injury, improving oxygenation and reducing atelectrauma (cyclic opening and closing of unstable alveoli). In focal ARDS, higher PEEP may overdistend the already-aerated non-dependent regions without recruiting the consolidated dependent regions, potentially causing hemodynamic compromise and volutrauma. The driving pressure (plateau pressure minus PEEP) has emerged as the variable most strongly associated with mortality; keeping driving pressure below 15 cmH2O is a key target.\n\nProne positioning for at least 16 hours per day has demonstrated mortality benefit in moderate-to-severe ARDS (PaO2/FiO2 less than 150 mmHg). The physiologic rationale differs by phenotype: in focal ARDS, pronation redistributes ventilation to the dorsal (previously dependent) consolidated regions, improving V/Q matching and recruitment. In diffuse ARDS, pronation creates more homogeneous distribution of transpulmonary pressure, reducing overdistension of ventral alveoli. Neuromuscular blockade with cisatracurium improves oxygenation by eliminating patient-ventilator dyssynchrony and reducing oxygen consumption by the respiratory muscles, though its mortality benefit remains debated."
    },
    riskFactors: [
      "Sepsis (most common indirect cause, accounts for approximately 40% of ARDS cases, often hyperinflammatory phenotype)",
      "Pneumonia (most common direct cause: bacterial, viral including COVID-19, aspiration)",
      "Aspiration of gastric contents (chemical pneumonitis causing direct alveolar epithelial injury)",
      "Multiple blood transfusions (transfusion-related acute lung injury, TRALI, or transfusion-associated circulatory overload, TACO)",
      "Pancreatitis (systemic inflammatory response triggering indirect lung injury)",
      "Trauma with pulmonary contusion, long bone fractures (fat embolism), or massive transfusion",
      "Inhalation injury (smoke, chemical gases, near-drowning causing direct epithelial damage)"
    ],
    diagnostics: [
      "Arterial blood gas: calculate PaO2/FiO2 ratio to classify severity (mild 200-300, moderate 100-200, severe less than 100); monitor serial ABGs to assess response to ventilatory changes",
      "Chest CT to distinguish focal versus diffuse morphology: focal shows dependent consolidation with non-dependent aeration; diffuse shows bilateral ground-glass opacities throughout all regions",
      "Echocardiography to exclude cardiogenic pulmonary edema (left atrial pressure less than 18 mmHg or absence of left ventricular dysfunction) per Berlin criteria",
      "Inflammatory biomarkers (IL-6, IL-8, procalcitonin, CRP, ferritin) to help characterize hyperinflammatory versus hypoinflammatory phenotype",
      "Ventilator mechanics: monitor plateau pressure (goal less than 30 cmH2O), driving pressure (plateau minus PEEP, goal less than 15 cmH2O), static compliance, and auto-PEEP",
      "Daily assessment of lung recruitment potential: response to incremental PEEP trials, change in compliance and oxygenation with PEEP adjustments"
    ],
    management: [
      "Lung-protective ventilation for all ARDS: tidal volume 4 to 6 mL/kg predicted body weight (PBW), plateau pressure less than 30 cmH2O, driving pressure less than 15 cmH2O",
      "PEEP titration based on phenotype: higher PEEP (12 to 20 cmH2O) for diffuse ARDS with widespread recruitability; moderate PEEP (8 to 12 cmH2O) for focal ARDS to avoid overdistension of aerated regions",
      "Prone positioning for 16 or more hours per day in moderate-to-severe ARDS (PaO2/FiO2 less than 150 mmHg); demonstrated 16% absolute mortality reduction in PROSEVA trial",
      "Conservative fluid management once hemodynamically stable (target CVP less than 4 mmHg or PAOP less than 8 mmHg) to minimize pulmonary edema without compromising organ perfusion",
      "Neuromuscular blockade (cisatracurium) considered in severe ARDS with PaO2/FiO2 less than 150 mmHg for the first 48 hours to reduce oxygen consumption and improve ventilator synchrony",
      "Treat underlying cause aggressively: antibiotics for sepsis/pneumonia, source control for intra-abdominal pathology, cessation of offending transfusion",
      "ECMO referral for refractory severe ARDS (PaO2/FiO2 less than 80 mmHg despite optimized ventilator settings and prone positioning)"
    ],
    nursingActions: [
      "Calculate and verify tidal volume using predicted body weight (PBW) based on patient height, not actual weight: PBW for males equals 50 plus 2.3 times (height in inches minus 60); PBW for females equals 45.5 plus 2.3 times (height in inches minus 60); target 6 mL/kg PBW",
      "Monitor ventilator waveforms for auto-PEEP (flow not returning to zero before next breath), patient-ventilator dyssynchrony (double-triggering, breath stacking, flow starvation), and escalating peak pressures indicating worsening compliance or secretion plugging",
      "Perform prone positioning protocol: minimum 16 hours prone per day; secure endotracheal tube and all lines before turning; ensure pressure-point protection (face, chest, knees, iliac crests); continuous hemodynamic and SpO2 monitoring during and after turn; assess for facial edema, pressure injuries, and accidental extubation",
      "Monitor and trend ventilator parameters every 1 to 2 hours: FiO2, PEEP level, tidal volume delivered, respiratory rate, plateau pressure (inspiratory hold maneuver), driving pressure (plateau minus PEEP), and minute ventilation; notify provider if plateau exceeds 30 cmH2O or driving pressure exceeds 15 cmH2O",
      "Assess for signs of barotrauma every shift: subcutaneous emphysema (crepitus on palpation of neck, chest, or axillae), sudden drop in SpO2 with rising peak pressures, unilateral absent breath sounds (pneumothorax), hemodynamic instability suggesting tension pneumothorax",
      "Implement sedation management using validated scales (RASS target -1 to -2 for mechanically ventilated ARDS patients) with daily sedation assessment; deeper sedation (RASS -4 to -5) during neuromuscular blockade with train-of-four monitoring to prevent awareness",
      "Maintain strict intake and output records with hourly urine output monitoring; target conservative fluid balance (net negative or even) once hemodynamically stable; administer diuretics as ordered and monitor electrolytes, particularly potassium and magnesium in patients receiving neuromuscular blockade"
    ],
    assessmentFindings: [
      "Severe hypoxemia refractory to supplemental oxygen (SpO2 less than 88% on high-flow oxygen or FiO2 greater than 0.6)",
      "Bilateral crackles on auscultation, diminished breath sounds in dependent regions",
      "Increased work of breathing: accessory muscle use, nasal flaring, intercostal retractions, tachypnea (respiratory rate greater than 30)",
      "Tachycardia and possible hypotension from positive-pressure ventilation and PEEP reducing venous return",
      "Bilateral opacities on chest radiograph not explained by effusions, lobar collapse, or nodules",
      "Decreased lung compliance (high pressures required to deliver tidal volume on ventilator)"
    ],
    signs: {
      left: [
        "Progressive dyspnea and tachypnea over 6 to 72 hours after inciting event",
        "Mild hypoxemia responsive to supplemental oxygen initially",
        "Bilateral fine crackles on auscultation",
        "Tachycardia and mild respiratory alkalosis on ABG",
        "Bilateral hazy opacities on chest radiograph"
      ],
      right: [
        "Severe refractory hypoxemia (PaO2/FiO2 less than 100 despite high FiO2 and PEEP)",
        "Hemodynamic instability with high PEEP requirements",
        "Subcutaneous emphysema or pneumothorax (barotrauma)",
        "Multi-organ dysfunction syndrome (MODS) with rising lactate",
        "Ventilator dyssynchrony requiring deep sedation and paralysis"
      ]
    },
    medications: [
      {
        name: "Cisatracurium",
        type: "Non-depolarizing Neuromuscular Blocking Agent (Benzylisoquinolinium)",
        action: "Competitively blocks nicotinic acetylcholine receptors at the neuromuscular junction, preventing muscle contraction; eliminates respiratory muscle effort to improve ventilator synchrony, reduce oxygen consumption, and allow optimal lung-protective ventilation in severe ARDS",
        sideEffects: "Prolonged paralysis (especially with renal or hepatic dysfunction), ICU-acquired weakness with prolonged use, inability to assess neurologic examination, corneal abrasion from absent blink reflex, deep vein thrombosis from immobility, psychological distress if inadequately sedated",
        contra: "Known hypersensitivity to cisatracurium or benzylisoquinolinium compounds, inadequate sedation and analgesia (must ensure patient is deeply sedated before and during paralysis to prevent awareness), inability to provide mechanical ventilation",
        pearl: "Always ensure adequate sedation (RASS -4 to -5) and analgesia BEFORE initiating neuromuscular blockade; monitor depth of blockade with train-of-four (TOF) stimulation targeting 1-2 of 4 twitches; preferred over vecuronium/pancuronium due to organ-independent Hofmann elimination; provide eye care (artificial tears, taping eyelids) to prevent corneal injury"
      },
      {
        name: "Fentanyl",
        type: "Synthetic Opioid Analgesic (Mu-Receptor Agonist)",
        action: "Binds mu-opioid receptors in the CNS to provide potent analgesia and sedation; reduces sympathetic response to endotracheal tube and mechanical ventilation; onset 1 to 2 minutes IV with short duration (30 to 60 minutes single dose) but accumulates with continuous infusion",
        sideEffects: "Respiratory depression (managed by mechanical ventilation in ARDS), hypotension (histamine-sparing but may cause bradycardia-mediated hypotension), ileus, urinary retention, chest wall rigidity with rapid high-dose bolus (wooden chest syndrome), tolerance and physical dependence with prolonged use",
        contra: "Known hypersensitivity, concurrent use of MAO inhibitors (risk of serotonin syndrome and hypertensive crisis), severe respiratory depression in non-intubated patients, paralytic ileus",
        pearl: "In ARDS patients receiving neuromuscular blockade, fentanyl provides analgesia-first sedation to prevent awareness during paralysis; titrate to BPS (Behavioral Pain Scale) less than 5 when patient is not paralyzed; watch for chest wall rigidity with rapid bolus doses greater than 5 mcg/kg; taper gradually after more than 5 days to prevent withdrawal"
      },
      {
        name: "Furosemide",
        type: "Loop Diuretic",
        action: "Inhibits sodium-potassium-chloride cotransporter (NKCC2) in the thick ascending limb of the loop of Henle, blocking reabsorption of sodium, potassium, and chloride; produces potent diuresis to reduce pulmonary edema, improve lung compliance, and enhance oxygenation in hemodynamically stable ARDS patients",
        sideEffects: "Hypokalemia, hyponatremia, hypomagnesemia, hypocalcemia, metabolic alkalosis (contraction alkalosis), dehydration, hypotension, ototoxicity (with rapid IV bolus or high doses), hyperuricemia, hyperglycemia",
        contra: "Anuria unresponsive to fluid challenge, severe hypovolemia or dehydration, hepatic coma, uncorrected hypokalemia (below 3.0 mEq/L) or hyponatremia",
        pearl: "Conservative fluid management with furosemide in ARDS reduces ventilator days and ICU length of stay (FACTT trial); target net negative fluid balance once hemodynamically stable; monitor potassium every 4 to 6 hours during aggressive diuresis as hypokalemia is common and dangerous in patients receiving neuromuscular blockade (potentiates paralysis); infuse IV bolus slowly over 1 to 2 minutes to reduce ototoxicity risk"
      }
    ],
    pearls: [
      "Always calculate tidal volume using predicted body weight based on height, never actual body weight; in obese patients, using actual weight would result in dangerously large tidal volumes that cause volutrauma and worsen ARDS mortality",
      "Driving pressure (plateau pressure minus PEEP) below 15 cmH2O is the ventilator variable most strongly associated with survival in ARDS; if increasing PEEP raises driving pressure without improving oxygenation, the lung is not recruitable at that level and PEEP should be reduced",
      "Prone positioning works best when initiated early (within 36 hours of moderate-to-severe ARDS) and maintained for at least 16 continuous hours; the mortality benefit is approximately 16% absolute reduction and is one of the most powerful interventions in critical care",
      "The most dangerous complication during prone positioning is unplanned extubation; secure the endotracheal tube with waterproof tape, mark tube depth at the lip, and verify tube position immediately after each turn with bilateral breath sounds and end-tidal CO2",
      "Patients receiving neuromuscular blockade must have adequate sedation verified before paralysis; using train-of-four monitoring alone is insufficient because it assesses motor blockade, not awareness; target RASS -4 to -5 with both analgesic and sedative infusions",
      "The baby lung concept explains why standard tidal volumes (10-12 mL/kg) are harmful in ARDS: the functional lung available for ventilation may be only 200-500 mL instead of the normal 3000+ mL, so even 6 mL/kg of actual lung may be overdistending the available alveoli",
      "Hyperinflammatory ARDS phenotype (identified by elevated IL-6, metabolic acidosis, vasopressor requirement, and higher mortality) responds differently to PEEP and fluid strategies than hypoinflammatory phenotype; research is moving toward phenotype-specific treatment protocols"
    ],
    quiz: [
      {
        question: "A nurse is caring for a patient with severe ARDS who weighs 100 kg with a height of 178 cm (5 feet 10 inches, male). The current tidal volume is set at 600 mL. Is this appropriate?",
        options: [
          "Yes, 6 mL/kg of actual body weight (600 mL) is lung-protective",
          "No, tidal volume should be calculated using predicted body weight; PBW for this patient is approximately 73 kg, so target TV should be approximately 438 mL",
          "No, tidal volume should be 8 to 10 mL/kg of actual body weight (800-1000 mL) to improve oxygenation",
          "Yes, but only if plateau pressure is less than 40 cmH2O"
        ],
        correct: 1,
        rationale: "Tidal volume in ARDS must be calculated using predicted body weight (PBW), not actual weight. PBW for a male 5 feet 10 inches = 50 + 2.3(70-60) = 73 kg. Target tidal volume at 6 mL/kg PBW = 438 mL. The set 600 mL is 8.2 mL/kg PBW, which is excessive and increases volutrauma and mortality risk. Plateau pressure target is less than 30 cmH2O, not 40."
      },
      {
        question: "During prone positioning of a patient with ARDS, the nurse notes sudden desaturation from SpO2 94% to 78%, rising peak inspiratory pressures, and absent breath sounds on the right side. What should the nurse suspect and do first?",
        options: [
          "Suspect mucus plugging and perform endotracheal suctioning",
          "Suspect right pneumothorax (barotrauma) and notify the provider immediately for emergent chest tube placement while returning patient to supine position",
          "Increase FiO2 to 100% and continue prone positioning",
          "Suspect the patient needs higher PEEP and increase PEEP by 5 cmH2O"
        ],
        correct: 1,
        rationale: "Sudden desaturation with rising peak pressures and unilateral absent breath sounds in a mechanically ventilated ARDS patient is classic for pneumothorax, a known complication of positive-pressure ventilation (barotrauma). The nurse should immediately notify the provider, prepare for emergent chest tube insertion, and return the patient to supine position to facilitate the procedure. Increasing PEEP would worsen a pneumothorax. Suctioning would not explain unilateral absent breath sounds."
      },
      {
        question: "A nurse is reviewing the ventilator settings of a patient with diffuse ARDS. The plateau pressure is 28 cmH2O and PEEP is 16 cmH2O. What is the driving pressure, and is it within the acceptable range?",
        options: [
          "Driving pressure is 44 cmH2O (plateau plus PEEP); this is dangerously high",
          "Driving pressure is 12 cmH2O (plateau minus PEEP); this is within the goal of less than 15 cmH2O",
          "Driving pressure is 28 cmH2O (same as plateau pressure); this needs to be reduced",
          "Driving pressure cannot be calculated without knowing tidal volume"
        ],
        correct: 1,
        rationale: "Driving pressure equals plateau pressure minus PEEP: 28 - 16 = 12 cmH2O. This is within the goal of less than 15 cmH2O, which is the ventilator variable most strongly associated with survival in ARDS. A driving pressure above 15 cmH2O is associated with increased mortality and indicates either overdistension or insufficient recruitment."
      }
    ]
  },

  "arrhythmias-rn": {
    title: "Cardiac Arrhythmias and ACLS Management",
    cellular: {
      title: "Electrophysiology of Cardiac Rhythm Disturbances",
      content: "Cardiac arrhythmias are disorders of the heart's electrical conduction system that alter the rate, rhythm, or sequence of cardiac activation. Understanding the cellular electrophysiology underlying both normal conduction and arrhythmia generation is essential for the RN to interpret rhythm strips, anticipate clinical deterioration, and implement ACLS protocols effectively.\n\nNormal cardiac electrical activity originates in the sinoatrial (SA) node, a crescent-shaped cluster of specialized pacemaker cells in the right atrial wall near the junction of the superior vena cava. SA node cells exhibit automaticity: they spontaneously depolarize during diastole (phase 4 depolarization) due to the funny current (If), a mixed sodium-potassium inward current activated by hyperpolarization. When the membrane potential reaches threshold (approximately -40 mV), slow calcium channels (L-type Ca2+) open, generating the action potential upstroke. The SA node fires at an intrinsic rate of 60 to 100 beats per minute, establishing normal sinus rhythm.\n\nThe impulse propagates through atrial myocytes to the atrioventricular (AV) node, located in the triangle of Koch at the base of the right atrial septum. The AV node introduces a critical delay of 0.12 to 0.20 seconds (represented by the PR interval on ECG), allowing atrial contraction to complete before ventricular activation begins (the atrial kick contributes approximately 20 to 30% of cardiac output). The impulse then travels rapidly through the bundle of His, which splits into the right bundle branch and left bundle branch (the left further dividing into left anterior and left posterior fascicles), and finally through the Purkinje fibers, which deliver the impulse to ventricular myocytes for coordinated contraction from apex to base.\n\nArrhythmias arise through three fundamental mechanisms. Abnormal automaticity occurs when cells outside the SA node develop enhanced phase 4 depolarization, creating ectopic pacemaker foci that fire faster than the SA node. This occurs in ischemia, electrolyte imbalances (hypokalemia, hypomagnesemia), sympathetic stimulation, and digitalis toxicity. Triggered activity results from afterdepolarizations: early afterdepolarizations (EADs) occur during phase 2 or 3 of the action potential when repolarization is prolonged (as in long QT syndrome, hypokalemia, or certain drugs) and can trigger polymorphic ventricular tachycardia (torsades de pointes). Delayed afterdepolarizations (DADs) occur after full repolarization, caused by intracellular calcium overload (digitalis toxicity, catecholamine excess), and can trigger focal ventricular and atrial tachycardias.\n\nReentry is the most common mechanism of sustained arrhythmias. It requires three conditions: two functionally distinct pathways connected at both ends (forming a circuit), unidirectional block in one pathway (typically the fast pathway, due to its longer refractory period), and slow conduction through the alternate pathway (providing enough time for the blocked pathway to recover excitability). The impulse then reenters the recovered pathway in a retrograde direction, establishing a self-sustaining circuit. AV nodal reentrant tachycardia (AVNRT), atrial flutter, and many ventricular tachycardias are reentrant.\n\nSupraventricular arrhythmias originate above or at the AV node and typically produce narrow QRS complexes (less than 0.12 seconds) because ventricular activation proceeds normally through the His-Purkinje system. These include atrial fibrillation (disorganized chaotic atrial activity at 350 to 600 impulses per minute with irregularly irregular ventricular response), atrial flutter (organized macro-reentrant circuit in the right atrium generating sawtooth flutter waves at approximately 300 per minute with variable AV block, typically 2:1 producing ventricular rate of 150), AVNRT (reentry within dual AV nodal pathways producing regular tachycardia at 150 to 250 bpm), and Wolff-Parkinson-White syndrome (accessory pathway creating an alternate conduction route).\n\nVentricular arrhythmias originate below the AV node and produce wide QRS complexes (greater than 0.12 seconds) because ventricular activation occurs through slower myocardial cell-to-cell conduction rather than the rapid Purkinje system. Ventricular tachycardia (VT) is three or more consecutive premature ventricular complexes at a rate greater than 100 bpm; it can be monomorphic (uniform QRS morphology, often reentry around a myocardial scar from prior infarction) or polymorphic (varying QRS morphology, including torsades de pointes associated with prolonged QTc). Ventricular fibrillation (VF) is chaotic, disorganized ventricular electrical activity producing no effective cardiac output; it is the most common initial rhythm in sudden cardiac arrest and requires immediate defibrillation for survival.\n\nACLS management follows evidence-based algorithms. For pulseless VT/VF: immediate CPR and defibrillation (120 to 200 J biphasic for first shock, maximum energy for subsequent shocks), followed by epinephrine 1 mg IV every 3 to 5 minutes and amiodarone 300 mg IV bolus for refractory VF/pulseless VT. For unstable tachycardia with a pulse: synchronized cardioversion (50 to 100 J for narrow regular, 120 to 200 J for wide regular, 120 to 200 J for irregular). For stable narrow-complex tachycardia: vagal maneuvers followed by adenosine 6 mg rapid IV push (may repeat 12 mg). For symptomatic bradycardia: atropine 1 mg IV every 3 to 5 minutes (maximum 3 mg), transcutaneous pacing if unresponsive."
    },
    riskFactors: [
      "Acute myocardial ischemia or infarction (ischemia disrupts ion channel function and creates reentry substrates from scar tissue)",
      "Electrolyte imbalances: hypokalemia and hypomagnesemia (increase automaticity and prolong repolarization), hyperkalemia (slows conduction, widens QRS, can cause asystole)",
      "Structural heart disease: heart failure with reduced ejection fraction, valvular disease, hypertrophic cardiomyopathy, arrhythmogenic right ventricular cardiomyopathy",
      "Medications that prolong QTc interval: antiarrhythmics (sotalol, dofetilide), antibiotics (azithromycin, fluoroquinolones), antipsychotics (haloperidol, ziprasidone), methadone",
      "Sympathetic activation: pain, anxiety, sepsis, hypovolemia, thyrotoxicosis, pheochromocytoma, stimulant drugs (cocaine, methamphetamine)",
      "Advanced age with degenerative conduction system disease (fibrosis of SA and AV nodes)",
      "Genetic channelopathies: long QT syndrome, Brugada syndrome, catecholaminergic polymorphic VT"
    ],
    diagnostics: [
      "Continuous cardiac monitoring with telemetry: identify rhythm, rate, regularity, P-wave morphology and relationship to QRS, QRS width, and QT/QTc interval",
      "12-lead ECG: systematically evaluate rate, rhythm, axis, intervals (PR, QRS, QT/QTc), ST segments, T waves, and morphology; compare with prior ECGs for new changes",
      "Stat electrolyte panel: potassium (3.5 to 5.0 mEq/L), magnesium (1.5 to 2.5 mg/dL), calcium (8.5 to 10.5 mg/dL); correct abnormalities before or concurrent with antiarrhythmic therapy",
      "Troponin levels to evaluate for myocardial ischemia as the precipitating cause of the arrhythmia",
      "Thyroid function tests (TSH, free T4) to evaluate for thyrotoxicosis as a reversible cause of atrial fibrillation and tachyarrhythmias",
      "Echocardiography to assess structural heart disease, ejection fraction, and valvular pathology that influences arrhythmia management and anticoagulation decisions"
    ],
    management: [
      "Pulseless VT/VF: high-quality CPR (rate 100 to 120, depth 5 to 6 cm, full recoil, minimize interruptions), defibrillation (120 to 200 J biphasic), epinephrine 1 mg IV every 3 to 5 minutes, amiodarone 300 mg IV first dose then 150 mg IV for refractory VF/pulseless VT",
      "Unstable tachycardia (hypotension, altered consciousness, ischemic chest pain, acute heart failure): immediate synchronized cardioversion regardless of rhythm width",
      "Stable narrow-complex regular tachycardia (suspected SVT/AVNRT): vagal maneuvers (modified Valsalva, carotid sinus massage) followed by adenosine 6 mg rapid IV push via proximal port with immediate 20 mL NS flush",
      "Stable atrial fibrillation: rate control with IV diltiazem or metoprolol; assess CHA2DS2-VASc score for anticoagulation decision; cardioversion if duration less than 48 hours or TEE-confirmed no thrombus",
      "Symptomatic bradycardia: atropine 1 mg IV (may repeat every 3 to 5 minutes, max 3 mg); transcutaneous pacing if atropine ineffective; dopamine or epinephrine infusion as bridge",
      "Identify and correct reversible causes (Hs and Ts): hypovolemia, hypoxia, hydrogen ion (acidosis), hypo/hyperkalemia, hypothermia, tension pneumothorax, tamponade, toxins, thrombosis (PE), thrombosis (MI)",
      "Torsades de pointes: IV magnesium sulfate 1 to 2 grams IV over 5 to 20 minutes; overdrive pacing; discontinue QTc-prolonging medications; isoproterenol to increase heart rate"
    ],
    nursingActions: [
      "Assess hemodynamic stability immediately when any arrhythmia is identified: check level of consciousness, blood pressure, heart rate, respiratory status, and symptoms (chest pain, dyspnea, diaphoresis, syncope); unstable patients require immediate intervention per ACLS algorithm",
      "Obtain and interpret a 12-lead ECG within 10 minutes of new arrhythmia onset; measure PR interval, QRS duration, and QTc interval; identify P-wave morphology and P:QRS relationship; compare with prior ECG for acute changes",
      "For adenosine administration: use the two-syringe technique (6 mg in one syringe connected to proximal IV port via stopcock, 20 mL normal saline flush in second syringe); push adenosine as rapidly as possible followed immediately by NS flush; warn patient they will feel brief chest tightness, flushing, and sense of impending doom lasting 10 to 15 seconds",
      "During synchronized cardioversion: ensure the sync button is activated and verify sync markers are tracking R waves on the monitor (avoid shocking on T wave which can induce VF); apply conductive pads in anterior-lateral or anterior-posterior position; sedate the conscious patient before delivering shock; clear all personnel from the bed",
      "Monitor and replace electrolytes aggressively in patients with arrhythmias: maintain potassium 4.0 to 5.0 mEq/L and magnesium above 2.0 mg/dL; administer IV potassium at maximum rate of 10 to 20 mEq/hour on a cardiac monitor (never by IV push); magnesium sulfate 1 to 2 grams IV over 15 to 60 minutes",
      "Assess for signs of decreased cardiac output from arrhythmia: hypotension (SBP less than 90 mmHg), altered mental status, cool mottled extremities, decreased urine output (less than 0.5 mL/kg/hour), rising serum lactate, and new or worsening heart failure symptoms",
      "Maintain and verify defibrillator and emergency equipment readiness every shift: check defibrillator function, ensure correct pad placement and size, verify suction equipment, bag-valve mask, and emergency medications (epinephrine, amiodarone, adenosine, atropine) are immediately available"
    ],
    assessmentFindings: [
      "Irregular or abnormal pulse: irregularly irregular (atrial fibrillation), regular and rapid (SVT, atrial flutter), slow and regular (heart block), absent (cardiac arrest)",
      "Hemodynamic changes: hypotension, widened or narrowed pulse pressure, jugular venous distension, peripheral edema",
      "Symptoms of decreased cardiac output: dizziness, syncope, presyncope, chest pain, dyspnea, diaphoresis, confusion",
      "ECG changes: wide QRS (ventricular origin), narrow QRS (supraventricular), prolonged QTc (torsades risk), ST changes (ischemia triggering arrhythmia)",
      "Palpitations: awareness of heartbeat, described as fluttering, racing, skipping, or pounding",
      "Signs of heart failure: crackles on lung auscultation, S3 gallop, peripheral edema from poor cardiac output due to loss of AV synchrony"
    ],
    signs: {
      left: [
        "Occasional palpitations or skipped beats (PVCs, PACs)",
        "Mild dizziness with position changes",
        "Irregular pulse on palpation",
        "Asymptomatic atrial fibrillation on monitor",
        "Mild fatigue or exercise intolerance"
      ],
      right: [
        "Pulseless: VF or pulseless VT requiring immediate CPR and defibrillation",
        "Unstable tachycardia with hypotension, chest pain, altered consciousness",
        "Symptomatic bradycardia with hemodynamic compromise",
        "Torsades de pointes (polymorphic VT with prolonged QTc)",
        "Cardiac arrest with asystole or pulseless electrical activity"
      ]
    },
    medications: [
      {
        name: "Amiodarone",
        type: "Class III Antiarrhythmic (Multichannel Blocker)",
        action: "Blocks potassium channels (prolonging repolarization and refractory period), sodium channels (slowing conduction), calcium channels (suppressing AV conduction), and beta-adrenergic receptors (reducing sympathetic stimulation); effective against both supraventricular and ventricular arrhythmias",
        sideEffects: "Hypotension (especially with IV bolus), bradycardia, QTc prolongation, pulmonary toxicity (interstitial pneumonitis/fibrosis with chronic use), thyroid dysfunction (hypo or hyperthyroidism due to high iodine content), hepatotoxicity, corneal microdeposits, photosensitivity, blue-gray skin discoloration",
        contra: "Severe sinus node dysfunction or second/third-degree heart block without pacemaker, cardiogenic shock, severe hepatic dysfunction, baseline QTc greater than 500 msec, known hypersensitivity, concomitant use with other QTc-prolonging drugs",
        pearl: "In cardiac arrest (VF/pulseless VT), give 300 mg IV push followed by 150 mg for refractory VF; for stable VT, load 150 mg IV over 10 minutes then 1 mg/min infusion for 6 hours then 0.5 mg/min for 18 hours; monitor thyroid and pulmonary function with chronic use; has extremely long half-life (40 to 55 days) so effects persist weeks after discontinuation"
      },
      {
        name: "Adenosine",
        type: "Endogenous Purine Nucleoside (AV Node Blocker)",
        action: "Activates adenosine A1 receptors on AV nodal cells, opening potassium channels (IKAdo) that hyperpolarize the cell membrane, dramatically slowing AV nodal conduction and briefly interrupting reentry circuits that depend on AV nodal conduction; ultra-short half-life of less than 10 seconds",
        sideEffects: "Transient chest tightness and dyspnea (bronchospasm), facial flushing, sense of impending doom, brief asystole (2 to 6 seconds is normal), headache, nausea; all effects resolve within 30 to 60 seconds due to rapid metabolism by adenosine deaminase",
        contra: "Second or third-degree heart block or sick sinus syndrome without pacemaker, known wide-complex tachycardia of ventricular origin (may cause hemodynamic collapse), severe reactive airway disease (asthma - causes bronchospasm), heart transplant patients (hypersensitive - use reduced dose of 3 mg)",
        pearl: "Must be given as a rapid IV push through the most proximal IV port (antecubital preferred) followed by immediate 20 mL NS flush using the two-syringe stopcock technique; the drug is metabolized in seconds so slow administration renders it ineffective; caffeine and theophylline block adenosine receptors (requiring higher doses); dipyridamole and carbamazepine potentiate effects (use lower doses)"
      },
      {
        name: "Atropine",
        type: "Anticholinergic (Muscarinic Receptor Antagonist)",
        action: "Blocks acetylcholine at muscarinic receptors in the SA and AV nodes, counteracting vagal (parasympathetic) tone; increases SA node firing rate and enhances AV nodal conduction velocity, thereby increasing heart rate in symptomatic bradycardia",
        sideEffects: "Tachycardia (excessive dose), dry mouth, urinary retention, blurred vision (cycloplegia, mydriasis), constipation, hyperthermia (inhibits sweating), confusion and delirium in elderly patients (anticholinergic toxicity)",
        contra: "Glaucoma (narrow-angle), obstructive uropathy, myasthenia gravis, tachyarrhythmias, thyrotoxicosis; not effective in infranodal (Mobitz type II) or third-degree heart block (because the block is below the AV node where vagal tone has no influence); pacing is required for these blocks",
        pearl: "Dose for symptomatic bradycardia is 1 mg IV every 3 to 5 minutes, maximum total dose 3 mg (0.04 mg/kg); doses less than 0.5 mg can paradoxically worsen bradycardia; atropine is ineffective for Mobitz type II and complete heart block because the pathology is infranodal - transcutaneous pacing is required; not recommended for bradycardia in cardiac transplant patients (denervated heart does not respond to anticholinergics)"
      }
    ],
    pearls: [
      "The most important initial assessment for any arrhythmia is hemodynamic stability, not rhythm identification; an unstable patient needs immediate intervention (cardioversion for tachycardia, pacing for bradycardia) regardless of the specific rhythm diagnosis",
      "A ventricular rate of exactly 150 bpm should raise suspicion for atrial flutter with 2:1 block; the sawtooth flutter waves may be hidden in the QRS or T waves and become visible with adenosine administration (which slows AV conduction, unmasking flutter waves)",
      "Adenosine is both a diagnostic and therapeutic drug: in SVT, it terminates the arrhythmia by interrupting the reentry circuit; in atrial flutter or atrial fibrillation, it transiently slows the ventricular rate, revealing the underlying atrial activity for diagnosis without terminating the arrhythmia",
      "Never cardiovert atrial fibrillation of unknown or greater than 48 hours duration without prior anticoagulation for at least 3 weeks or TEE-confirmed absence of left atrial thrombus; cardioversion can dislodge atrial thrombus causing embolic stroke",
      "Hypokalemia and hypomagnesemia are the most common reversible causes of drug-resistant arrhythmias in hospitalized patients; always check and correct electrolytes before escalating antiarrhythmic therapy",
      "In cardiac arrest, the quality of CPR is more important than any drug: push hard (5 to 6 cm depth), push fast (100 to 120 per minute), allow full chest recoil, minimize interruptions (less than 10 seconds for rhythm checks), and rotate compressors every 2 minutes to prevent fatigue",
      "Wide-complex tachycardia should be treated as ventricular tachycardia until proven otherwise; misidentifying VT as SVT with aberrancy and administering AV nodal blockers (diltiazem, verapamil) can cause cardiovascular collapse and death"
    ],
    quiz: [
      {
        question: "A nurse is administering adenosine 6 mg to a patient with regular narrow-complex tachycardia at 180 bpm. Which administration technique is correct?",
        options: [
          "Dilute in 100 mL normal saline and infuse over 10 minutes via distal IV",
          "Push slowly over 1 to 2 minutes through any available IV access",
          "Rapid IV push through the most proximal port followed immediately by 20 mL normal saline flush",
          "Administer intramuscularly in the deltoid for sustained effect"
        ],
        correct: 2,
        rationale: "Adenosine has an ultra-short half-life of less than 10 seconds due to rapid metabolism by adenosine deaminase. It must be given as a rapid IV push through the most proximal IV port (antecubital or central line preferred) followed immediately by a 20 mL normal saline flush to ensure the drug reaches the heart before it is metabolized. Slow administration or distal IV sites render the drug ineffective."
      },
      {
        question: "A patient on telemetry develops a wide-complex tachycardia at 160 bpm with blood pressure 80/50 mmHg, diaphoresis, and altered mental status. What is the priority nursing intervention?",
        options: [
          "Administer IV diltiazem to slow the ventricular rate",
          "Perform vagal maneuvers and prepare adenosine",
          "Prepare for immediate synchronized cardioversion and ensure the defibrillator sync mode is activated",
          "Obtain a 12-lead ECG to differentiate SVT with aberrancy from VT before intervening"
        ],
        correct: 2,
        rationale: "This patient has an unstable tachycardia (wide-complex, hypotension, altered mental status, diaphoresis). Per ACLS, unstable tachycardia with a pulse requires immediate synchronized cardioversion regardless of whether the rhythm is SVT with aberrancy or VT. Delaying treatment for ECG interpretation risks cardiac arrest. Diltiazem is contraindicated in wide-complex tachycardia. Vagal maneuvers and adenosine are for stable narrow-complex tachycardia."
      },
      {
        question: "A patient with symptomatic bradycardia (heart rate 35 bpm, BP 78/50) receives atropine 1 mg IV with no response. The rhythm shows complete (third-degree) heart block. What should the nurse prepare next?",
        options: [
          "Repeat atropine 1 mg IV every 3 to 5 minutes up to maximum of 3 mg total",
          "Initiate transcutaneous pacing immediately, as atropine is ineffective for complete heart block",
          "Administer adenosine 6 mg rapid IV push to restore AV conduction",
          "Apply a 12-lead ECG and wait for cardiology consultation before further intervention"
        ],
        correct: 1,
        rationale: "Complete (third-degree) heart block involves dissociation between atrial and ventricular activity with the block at the infranodal level. Atropine works by blocking vagal tone at the AV node, so it is ineffective when the block is below the AV node. Transcutaneous pacing is the appropriate next intervention to provide external pacemaker capture. Adenosine would worsen AV block. Waiting for consultation risks cardiac arrest."
      }
    ]
  }
};

let count = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) count++;
}
console.log(`\nDone. Injected ${count}/${Object.keys(lessons).length} lessons.`);
