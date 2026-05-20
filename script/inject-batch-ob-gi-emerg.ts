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
  "gestational-diabetes-rpn": {
    title: "Gestational Diabetes Mellitus for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Gestational Diabetes Mellitus",
      content: "Gestational diabetes mellitus (GDM) is a carbohydrate intolerance of variable severity that is first recognized during pregnancy. The condition affects approximately 3-9% of all pregnancies and is one of the most common metabolic complications of the antepartum period. During normal pregnancy, the placenta produces hormones that are essential for fetal growth, including human placental lactogen (hPL), cortisol, estrogen, and progesterone. These hormones create a progressive state of insulin resistance that begins around 20-24 weeks of gestation and intensifies throughout the third trimester. Human placental lactogen is the primary diabetogenic hormone; it acts as an insulin antagonist by decreasing maternal glucose uptake at the cellular level, effectively diverting glucose across the placenta to the developing fetus. In a healthy pregnancy, the maternal pancreas compensates by increasing insulin production two to three times above normal baseline. However, when the maternal pancreatic beta cells cannot produce sufficient insulin to overcome the placental hormone-mediated insulin resistance, blood glucose levels rise and gestational diabetes develops. At the cellular level, insulin resistance in GDM involves impaired post-receptor signaling in the insulin receptor substrate pathway, specifically reduced phosphorylation of IRS-1, which decreases GLUT4 transporter translocation to the cell membrane surface. This means that even though insulin is present and binding to its receptor, glucose cannot efficiently enter maternal skeletal muscle and adipose tissue cells. The persistent hyperglycemia that results has significant consequences for both mother and fetus. Glucose crosses the placenta freely via facilitated diffusion through GLUT1 transporters, but insulin does not cross the placenta. When maternal blood glucose is elevated, excess glucose reaches the fetus, stimulating the fetal pancreas to produce large amounts of insulin (fetal hyperinsulinemia). Fetal hyperinsulinemia acts as a growth hormone, promoting excessive fat deposition and organ growth, resulting in fetal macrosomia (birth weight above 4000 grams or above the 90th percentile for gestational age). Macrosomia increases the risk of birth trauma including shoulder dystocia, brachial plexus injury (Erb palsy), clavicle fracture, and the need for operative delivery (cesarean section or instrumental vaginal delivery). After delivery, the neonate loses the maternal glucose supply but continues to produce high levels of insulin, placing the newborn at immediate risk for neonatal hypoglycemia within the first 1-2 hours of life. Other neonatal complications include polycythemia (increased red blood cell production due to chronic fetal hypoxia), hyperbilirubinemia (from polycythemia and immature liver), respiratory distress syndrome (hyperinsulinemia inhibits surfactant production), and hypocalcemia. For the mother, uncontrolled GDM increases the risk of preeclampsia, polyhydramnios (excess amniotic fluid from fetal polyuria), recurrent urinary tract infections, and cesarean delivery. Women with GDM have a 50-60% lifetime risk of developing type 2 diabetes mellitus, typically within 5-10 years postpartum, making long-term follow-up and lifestyle modification essential. The practical nurse plays a critical role in monitoring blood glucose levels, reinforcing dietary education, administering insulin as ordered, and recognizing signs of both maternal hyperglycemia and hypoglycemia during the antepartum and intrapartum periods."
    },
    riskFactors: [
      "Maternal age above 25 years (risk increases significantly after age 35)",
      "Body mass index (BMI) above 30 before pregnancy (obesity is the strongest modifiable risk factor)",
      "Family history of type 2 diabetes mellitus in a first-degree relative (parent or sibling)",
      "Previous pregnancy with GDM (recurrence rate 30-70% in subsequent pregnancies)",
      "Previous delivery of an infant weighing more than 4000 grams (macrosomia)",
      "Polycystic ovary syndrome (PCOS) -- associated with baseline insulin resistance",
      "Ethnicity: higher prevalence in Indigenous, Hispanic, South Asian, African American, and Pacific Islander populations"
    ],
    diagnostics: [
      "One-step approach (IADPSG criteria): 75-gram oral glucose tolerance test (OGTT) at 24-28 weeks; fasting glucose 92 mg/dL or higher, 1-hour 180 mg/dL or higher, or 2-hour 153 mg/dL or higher (only one abnormal value needed for diagnosis)",
      "Two-step approach (most common in North America): Step 1 -- 50-gram glucose challenge test (GCT) as screening; if 1-hour value is 130-140 mg/dL or higher, proceed to Step 2 -- 100-gram 3-hour OGTT with four timed blood draws (fasting, 1-hour, 2-hour, 3-hour); two or more abnormal values required for diagnosis",
      "Fasting blood glucose: measured at first prenatal visit to screen for pre-existing diabetes; fasting glucose 126 mg/dL or higher suggests pre-gestational diabetes, not GDM",
      "Hemoglobin A1c (HbA1c): reflects average glucose over previous 8-12 weeks; used at first visit to detect undiagnosed pre-existing diabetes (HbA1c 6.5% or higher); less useful for GDM monitoring due to hemodilution in pregnancy",
      "Self-monitoring blood glucose (SMBG): patients check fasting and 1-hour or 2-hour postprandial glucose levels at least 4 times daily; targets typically fasting below 95 mg/dL, 1-hour post-meal below 140 mg/dL, 2-hour post-meal below 120 mg/dL",
      "Fetal surveillance: biophysical profile (BPP), non-stress test (NST) beginning at 32-36 weeks, and serial ultrasounds to monitor estimated fetal weight, amniotic fluid volume, and fetal growth trajectory"
    ],
    management: [
      "Medical nutrition therapy (MNT) is first-line treatment: individualized meal plan with 3 meals and 2-3 snacks daily, carbohydrate counting (175 grams minimum daily), complex carbohydrates distributed evenly, protein with each meal to slow glucose absorption",
      "Moderate physical activity as cleared by the obstetric provider: 30 minutes of moderate exercise (walking, swimming) most days of the week helps improve insulin sensitivity and postprandial glucose control",
      "Insulin therapy is initiated when blood glucose targets are not met with diet and exercise within 1-2 weeks; insulin does not cross the placenta and is considered safe for the fetus; dosing is adjusted throughout pregnancy as insulin resistance increases",
      "Antepartum fetal surveillance (non-stress tests, biophysical profiles) typically begins at 32-36 weeks gestation depending on glucose control and presence of complications",
      "Delivery timing: well-controlled GDM on diet alone may await spontaneous labor up to 40-41 weeks; GDM on insulin or with poor control may be induced at 39 weeks to reduce macrosomia and stillbirth risk",
      "Intrapartum glucose management: monitor blood glucose every 1-2 hours during labor; maintain glucose between 70-110 mg/dL; insulin requirements often decrease dramatically during active labor",
      "Postpartum follow-up: 75-gram OGTT at 4-12 weeks postpartum to screen for persistent diabetes; encourage breastfeeding (improves glucose metabolism); annual screening for type 2 diabetes mellitus thereafter"
    ],
    nursingActions: [
      "Teach and reinforce proper blood glucose self-monitoring technique: hand washing, correct lancet depth, adequate blood sample, proper meter calibration, and accurate recording of results",
      "Monitor and record blood glucose levels at prescribed times (fasting and postprandial) and report values outside target range to the registered nurse or physician promptly",
      "Administer insulin as ordered using correct technique: verify dose with another nurse, rotate injection sites (abdomen preferred in pregnancy), use subcutaneous injection at 90-degree angle",
      "Assess for signs of hypoglycemia (blood glucose below 60 mg/dL): tremor, diaphoresis, tachycardia, hunger, irritability, confusion; treat immediately with 15 grams of fast-acting carbohydrate (glucose tablets, juice) and recheck in 15 minutes",
      "Reinforce dietary education: consistent carbohydrate intake at each meal, avoid simple sugars and concentrated sweets, include protein and healthy fats with all meals and snacks",
      "Monitor fetal movement by teaching kick counts: instruct patient to count fetal movements after meals (when glucose is elevated, fetus is typically more active); report fewer than 6 movements in 2 hours",
      "Document all blood glucose values, insulin doses, dietary intake, and patient education in the medical record accurately and completely"
    ],
    assessmentFindings: [
      "Maternal hyperglycemia: blood glucose above target range (fasting above 95 mg/dL, postprandial above 140 mg/dL at 1 hour), polyuria, polydipsia, fatigue, recurrent vulvovaginal candidiasis",
      "Maternal hypoglycemia: tremor, diaphoresis, pallor, tachycardia, hunger, anxiety, confusion, headache, blurred vision; may occur if insulin dose is too high or meals are skipped",
      "Fundal height greater than expected for gestational age: may indicate macrosomia or polyhydramnios (excess amniotic fluid from fetal osmotic diuresis)",
      "Polyhydramnios: uterine distension, difficulty palpating fetal parts, maternal dyspnea, amniotic fluid index (AFI) greater than 24 cm on ultrasound",
      "Non-stress test findings: reactive pattern (reassuring) shows at least 2 accelerations of 15 beats per minute lasting 15 seconds in a 20-minute window; non-reactive pattern requires further evaluation",
      "Signs of preeclampsia (concurrent risk): blood pressure 140/90 mmHg or higher, proteinuria, headache, visual disturbances, right upper quadrant pain, edema of face and hands",
      "Neonatal assessment at delivery: large for gestational age (LGA) appearance, plethoric (ruddy) skin color suggesting polycythemia, jitteriness or tremors suggesting hypoglycemia, respiratory distress"
    ],
    signs: {
      left: [
        "Blood glucose values slightly above target (fasting 95-110 mg/dL)",
        "Increased thirst (polydipsia) and frequent urination (polyuria)",
        "Fatigue and generalized malaise",
        "Recurrent yeast infections (vulvovaginal candidiasis)",
        "Fundal height measuring 2-3 cm ahead of gestational age",
        "Mild dependent edema of lower extremities"
      ],
      right: [
        "Severe hyperglycemia (blood glucose above 200 mg/dL) with ketones in urine",
        "Signs of diabetic ketoacidosis: Kussmaul respirations, fruity breath, altered mental status",
        "Hypoglycemia with loss of consciousness or seizure activity",
        "Non-reactive non-stress test with absent variability and late decelerations",
        "Signs of preeclampsia: severe headache, visual changes, epigastric pain, blood pressure above 160/110",
        "Sudden decrease in fetal movement or absent fetal movement"
      ]
    },
    medications: [
      {
        name: "Insulin (Regular and NPH)",
        type: "Hormone / antihyperglycemic agent",
        action: "Binds to insulin receptors on target cell membranes, facilitating glucose uptake into skeletal muscle and adipose tissue by promoting GLUT4 transporter translocation to the cell surface; suppresses hepatic gluconeogenesis and glycogenolysis; promotes glycogen synthesis and lipogenesis. Regular insulin has onset 30-60 minutes, peak 2-4 hours, duration 6-8 hours. NPH insulin has onset 1-2 hours, peak 4-12 hours, duration 18-24 hours.",
        sideEffects: "Hypoglycemia (most common and most dangerous), injection site lipodystrophy with repeated use at same site, weight gain, hypokalemia (insulin drives potassium into cells)",
        contra: "Hypoglycemia (blood glucose below 60 mg/dL); known hypersensitivity to insulin product components; always verify correct insulin type and dose -- insulin errors are high-alert medication events",
        pearl: "Regular insulin is clear; NPH insulin is cloudy -- remember: clear before cloudy when mixing in one syringe. Always verify dose with a second nurse. Never shake NPH -- roll gently between palms. Insulin requirements increase progressively through pregnancy and drop sharply after placental delivery."
      },
      {
        name: "Metformin (Glucophage)",
        type: "Biguanide oral hypoglycemic agent",
        action: "Decreases hepatic glucose production by inhibiting gluconeogenesis, increases peripheral insulin sensitivity by enhancing glucose uptake at the cellular level, and reduces intestinal glucose absorption. Does not stimulate insulin secretion and therefore carries low risk of hypoglycemia when used alone.",
        sideEffects: "Gastrointestinal effects (nausea, diarrhea, abdominal cramping, metallic taste) are most common and often dose-related; vitamin B12 deficiency with long-term use; rare but serious risk of lactic acidosis",
        contra: "Renal impairment (eGFR below 30 mL/min -- increased risk of lactic acidosis); hepatic disease; conditions predisposing to lactic acidosis (sepsis, dehydration, acute heart failure); hold before and 48 hours after iodinated contrast procedures",
        pearl: "Metformin crosses the placenta and its use in pregnancy remains debated; some guidelines support its use when insulin is refused or not feasible, but insulin remains preferred first-line pharmacotherapy for GDM. Take with meals to reduce GI side effects. Monitor renal function and B12 levels."
      },
      {
        name: "Glyburide (Diabeta/Glynase)",
        type: "Sulfonylurea oral hypoglycemic agent",
        action: "Stimulates insulin secretion from functioning pancreatic beta cells by binding to sulfonylurea receptors on the beta cell membrane, closing ATP-sensitive potassium channels, which causes depolarization and subsequent calcium influx triggering insulin exocytosis. Also reduces hepatic glucose output and increases peripheral insulin sensitivity.",
        sideEffects: "Hypoglycemia (higher risk than metformin because it stimulates insulin release), weight gain, nausea, dizziness, photosensitivity, disulfiram-like reaction with alcohol",
        contra: "Type 1 diabetes (no functioning beta cells to stimulate), diabetic ketoacidosis, severe hepatic or renal impairment, sulfonamide allergy (cross-reactivity possible)",
        pearl: "Glyburide was previously widely used for GDM but recent evidence shows it crosses the placenta more than initially believed, and is associated with higher rates of neonatal hypoglycemia and macrosomia compared to insulin. Many centers have moved away from glyburide as first-line; insulin remains the gold standard. Administer 30 minutes before meals."
      }
    ],
    pearls: [
      "The 50-gram glucose challenge test (GCT) is a SCREENING test that does NOT require fasting; the 100-gram OGTT is a DIAGNOSTIC test that DOES require 8-14 hours of fasting -- do not confuse the two",
      "Insulin is the preferred pharmacotherapy for GDM because it does not cross the placenta -- the fetus is not exposed to exogenous insulin, only to maternal glucose that crosses via facilitated diffusion",
      "Blood glucose targets in GDM are TIGHTER than non-pregnant targets: fasting below 95 mg/dL and 1-hour postprandial below 140 mg/dL (or 2-hour below 120 mg/dL) -- memorize these values",
      "Fetal macrosomia (birth weight above 4000 grams) is the hallmark complication of poorly controlled GDM; it leads to shoulder dystocia, birth trauma, and neonatal hypoglycemia -- all directly caused by fetal hyperinsulinemia",
      "After delivery, insulin requirements DROP dramatically because the placenta (the source of diabetogenic hormones) has been removed -- monitor closely for maternal hypoglycemia in the immediate postpartum period",
      "Neonatal hypoglycemia occurs within the first 1-2 hours after birth because the newborn continues to produce high levels of insulin even though the maternal glucose supply has been cut off -- initiate early breastfeeding and monitor neonatal glucose per protocol",
      "Women with GDM have a 50-60% lifetime risk of developing type 2 diabetes -- postpartum OGTT at 4-12 weeks and annual screening thereafter is essential for early detection and intervention"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient diagnosed with gestational diabetes at 28 weeks gestation. The patient asks why she needs to check her blood glucose after meals. Which response by the nurse is most accurate?",
        options: [
          "Postprandial glucose levels determine whether your baby is getting enough nutrition",
          "Checking after meals helps identify if your blood glucose is rising above the target, which can cause your baby to grow too large",
          "We only need the fasting values, so you can skip the after-meal checks",
          "Postprandial glucose levels are used to calculate your insulin resistance score"
        ],
        correct: 1,
        rationale: "Postprandial glucose monitoring is essential in GDM because elevated glucose after meals leads to excess glucose transfer across the placenta, causing fetal hyperinsulinemia and macrosomia. The target is below 140 mg/dL at 1 hour or below 120 mg/dL at 2 hours postprandial. Monitoring these values helps determine if diet alone is controlling glucose or if pharmacotherapy is needed."
      },
      {
        question: "A patient with gestational diabetes on insulin therapy reports feeling shaky, sweaty, and hungry before lunch. Her blood glucose is 58 mg/dL. What should the practical nurse do FIRST?",
        options: [
          "Administer the next scheduled dose of insulin",
          "Give 15 grams of fast-acting carbohydrate such as 4 ounces of juice",
          "Hold all insulin and notify the physician immediately",
          "Instruct the patient to lie down and rest until the symptoms pass"
        ],
        correct: 1,
        rationale: "A blood glucose of 58 mg/dL with symptoms of tremor, diaphoresis, and hunger indicates hypoglycemia. The immediate action is to administer 15 grams of fast-acting carbohydrate (such as 4 ounces of juice or 3-4 glucose tablets) and recheck blood glucose in 15 minutes. This follows the 15-15 rule. Administering insulin would worsen hypoglycemia. The physician should be notified, but treating the hypoglycemia is the first priority."
      },
      {
        question: "A newborn delivered to a mother with poorly controlled gestational diabetes appears large, ruddy (plethoric), and jittery at 45 minutes of life. The practical nurse recognizes that the jitteriness is most likely caused by which condition?",
        options: [
          "Neonatal sepsis from prolonged rupture of membranes",
          "Neonatal hypoglycemia from continued fetal hyperinsulinemia",
          "Neonatal hypothermia from inadequate thermoregulation",
          "Neonatal drug withdrawal from maternal insulin use"
        ],
        correct: 1,
        rationale: "Jitteriness in a neonate born to a mother with poorly controlled GDM is most likely caused by neonatal hypoglycemia. During pregnancy, fetal hyperinsulinemia develops in response to chronic maternal hyperglycemia. After delivery, the maternal glucose supply is abruptly removed but the neonate continues to produce excess insulin, driving blood glucose dangerously low. LGA appearance and plethoric (ruddy) skin further support this diagnosis."
      }
    ]
  },

  "hellp-basics-rpn": {
    title: "HELLP Syndrome Awareness for Practical Nurses",
    cellular: {
      title: "Pathophysiology of HELLP Syndrome",
      content: "HELLP syndrome is a severe, life-threatening variant of preeclampsia characterized by three hallmark laboratory findings: Hemolysis (H), Elevated Liver enzymes (EL), and Low Platelets (LP). The syndrome typically develops after 27 weeks of gestation but can present as early as the second trimester or even postpartum (up to 7 days after delivery). HELLP affects approximately 0.5-0.9% of all pregnancies and 10-20% of pregnancies complicated by severe preeclampsia. The underlying pathophysiology begins with abnormal placentation. In a healthy pregnancy, trophoblast cells invade the spiral arteries of the uterus during the first trimester, remodeling these vessels from narrow, muscular arteries into wide, low-resistance channels that provide adequate blood flow to the developing placenta. In preeclampsia and HELLP, this trophoblastic invasion is incomplete, leaving the spiral arteries narrow and constricted. The resulting placental ischemia triggers the release of antiangiogenic factors (soluble fms-like tyrosine kinase 1, or sFlt-1) and inflammatory mediators into the maternal circulation. These substances cause widespread endothelial dysfunction -- the endothelial cells lining blood vessels throughout the maternal body become damaged and activated. Endothelial damage has three critical consequences that define the HELLP triad. First, hemolysis occurs as red blood cells are mechanically sheared and fragmented when they pass through damaged, narrowed small blood vessels. This microangiopathic hemolytic anemia produces schistocytes (fragmented red blood cells) visible on peripheral blood smear, elevated lactate dehydrogenase (LDH above 600 IU/L), elevated indirect bilirubin, and decreased haptoglobin (the protein that binds free hemoglobin released from lysed red blood cells). Second, liver involvement occurs when fibrin deposits in hepatic sinusoids obstruct blood flow, causing hepatocellular necrosis. This leads to elevated liver enzymes, particularly aspartate aminotransferase (AST above 70 IU/L) and alanine aminotransferase (ALT). In severe cases, subcapsular liver hematoma can form, and catastrophic hepatic rupture may occur -- a rare but often fatal complication. Patients may experience right upper quadrant (RUQ) or epigastric pain from liver capsule distension, which is a critical warning sign. Third, thrombocytopenia develops because platelets are consumed at sites of endothelial injury throughout the microvasculature. Platelet aggregation and activation at damaged endothelial surfaces lead to platelet counts falling below 100,000/mm3 (Class 1 HELLP: below 50,000; Class 2: 50,000-100,000; Class 3: 100,000-150,000 per the Mississippi classification). The consumptive coagulopathy can progress to disseminated intravascular coagulation (DIC) in 15-20% of HELLP cases, with simultaneous widespread clotting and bleeding. DIC is characterized by prolonged PT and PTT, elevated fibrin degradation products (FDP), elevated D-dimer, and decreased fibrinogen. HELLP syndrome can cause maternal complications including placental abruption (16%), acute kidney injury (8%), pulmonary edema, retinal detachment, stroke, and maternal death (1-3%). Fetal complications include intrauterine growth restriction (IUGR) from chronic placental insufficiency, preterm birth, and stillbirth. The definitive treatment is delivery of the fetus and placenta, which removes the source of the pathologic cascade. The practical nurse must recognize the subtle and often atypical presentation of HELLP (many patients present with nonspecific complaints such as malaise, nausea, and epigastric pain that may be mistaken for gastrointestinal illness) and report findings immediately, as rapid deterioration is characteristic of this syndrome."
    },
    riskFactors: [
      "Preeclampsia (HELLP develops in 10-20% of severe preeclampsia cases)",
      "Previous HELLP syndrome (recurrence risk 2-27% in subsequent pregnancies)",
      "Multiparity and maternal age above 25 years",
      "Caucasian race (higher incidence compared to other ethnic groups in some studies)",
      "History of chronic hypertension or renal disease",
      "Antiphospholipid syndrome or other thrombophilic conditions",
      "Multiple gestation (twins, triplets -- increased placental mass and demand)"
    ],
    diagnostics: [
      "Complete blood count (CBC) with peripheral blood smear: platelet count below 100,000/mm3 confirms thrombocytopenia; schistocytes (fragmented red blood cells) on smear confirm microangiopathic hemolysis",
      "Liver function tests: AST and ALT elevated (AST typically above 70 IU/L); elevated values indicate hepatocellular damage from fibrin deposition in hepatic sinusoids",
      "Lactate dehydrogenase (LDH): elevated above 600 IU/L; released from damaged red blood cells and hepatocytes; a marker of both hemolysis and liver injury",
      "Haptoglobin: decreased (below 25 mg/dL) because haptoglobin binds free hemoglobin released during hemolysis; low haptoglobin is a sensitive marker of intravascular hemolysis",
      "Coagulation studies (PT, PTT, fibrinogen, D-dimer): monitor for progression to DIC; fibrinogen below 300 mg/dL in pregnancy is concerning (normal pregnancy fibrinogen is elevated at 400-600 mg/dL)",
      "Renal function (BUN, creatinine, uric acid): elevated uric acid is an early marker of renal involvement in preeclampsia; creatinine above 1.1 mg/dL indicates renal compromise",
      "Liver ultrasound: ordered if subcapsular hematoma is suspected (severe RUQ pain, hemodynamic instability); CT may be used if hepatic rupture is suspected"
    ],
    management: [
      "Delivery is the definitive treatment: decision to deliver depends on gestational age, maternal condition severity, and fetal status; delivery is generally recommended at or beyond 34 weeks or immediately at any gestational age if maternal or fetal condition is deteriorating",
      "Magnesium sulfate IV: administered for seizure prophylaxis (prevention of eclampsia) and fetal neuroprotection if preterm delivery is anticipated; loading dose 4-6 grams IV over 20-30 minutes followed by maintenance infusion of 1-2 grams per hour",
      "Antihypertensive therapy for severe hypertension (systolic 160 or higher or diastolic 110 or higher): labetalol IV or hydralazine IV are first-line; goal is to reduce blood pressure to a safe range (below 150/100) without compromising uteroplacental perfusion",
      "Corticosteroids (betamethasone or dexamethasone): administered to accelerate fetal lung maturity if delivery is anticipated before 34 weeks; dexamethasone may also temporarily improve platelet count and liver function in HELLP",
      "Blood product replacement: platelet transfusion if count falls below 20,000/mm3 or below 50,000/mm3 before cesarean section; fresh frozen plasma and cryoprecipitate for DIC with active bleeding",
      "Continuous fetal monitoring: non-stress test and biophysical profile to assess fetal well-being; late decelerations or absent variability indicate fetal compromise and may necessitate emergent delivery",
      "Postpartum monitoring: HELLP can develop or worsen in the first 48-72 hours postpartum; continue monitoring CBC, liver enzymes, and platelets every 6-12 hours until values trend toward normal"
    ],
    nursingActions: [
      "Monitor blood pressure every 15 minutes during acute management and report systolic 160 or higher or diastolic 110 or higher immediately -- severe hypertension can cause stroke",
      "Assess for signs of magnesium sulfate toxicity: loss of deep tendon reflexes (first sign of toxicity), respiratory depression (rate below 12), decreased urine output (below 30 mL/hour), cardiac arrest; keep calcium gluconate at bedside as antidote",
      "Perform and document neurological assessments hourly: level of consciousness, headache (location, severity, onset), visual disturbances (blurred vision, scotomata, diplopia), hyperreflexia with clonus",
      "Monitor strict intake and output: insert indwelling urinary catheter as ordered; urine output should be maintained at 30 mL/hour or greater; report oliguria immediately as it indicates renal compromise",
      "Assess for bleeding from all sites: venipuncture sites, gingival bleeding, petechiae, ecchymosis, hematuria, vaginal bleeding -- thrombocytopenia increases bleeding risk significantly",
      "Report right upper quadrant or epigastric pain immediately -- this is a hallmark symptom of liver capsule distension and may precede hepatic rupture, a catastrophic and often fatal complication",
      "Maintain seizure precautions: dim lighting, minimize stimulation, pad side rails, suction equipment at bedside, oxygen ready, IV access secured; eclamptic seizures can occur before, during, or after delivery"
    ],
    assessmentFindings: [
      "Right upper quadrant (RUQ) or epigastric pain: reported by 40-90% of HELLP patients; caused by liver capsule distension from subcapsular edema or hematoma; may be mistaken for heartburn or gallbladder disease",
      "Malaise, nausea, and vomiting: nonspecific symptoms that may lead to delayed diagnosis; HELLP is sometimes initially misdiagnosed as gastroenteritis, hepatitis, or gallbladder disease",
      "Hypertension (may be absent in 15-20% of HELLP cases): blood pressure 140/90 or higher; severe range is 160/110 or higher",
      "Edema: may include facial edema, periorbital edema, and rapid weight gain (more than 2 kg per week) from fluid retention",
      "Petechiae, ecchymosis, and prolonged bleeding from venipuncture sites: visible signs of thrombocytopenia and coagulopathy",
      "Hyperreflexia with clonus: brisk deep tendon reflexes (3+ or 4+) and sustained rhythmic involuntary muscle contractions at the ankle; indicates central nervous system irritability and increased seizure risk",
      "Jaundice: may develop from hemolysis (elevated indirect bilirubin) and hepatocellular damage; typically a later finding"
    ],
    signs: {
      left: [
        "Mild right upper quadrant or epigastric discomfort",
        "Nausea with or without vomiting",
        "Generalized malaise and fatigue",
        "Mild edema of face, hands, or lower extremities",
        "Blood pressure 140/90 to 159/109 mmHg",
        "Platelet count 100,000-150,000/mm3 (Class 3 HELLP)"
      ],
      right: [
        "Severe right upper quadrant pain (possible subcapsular hematoma or hepatic rupture)",
        "Blood pressure 160/110 mmHg or higher (severe range -- stroke risk)",
        "Platelet count below 50,000/mm3 (Class 1 HELLP -- high risk of spontaneous bleeding and DIC)",
        "Visual disturbances (scotomata, blurred vision, diplopia) indicating cerebral edema",
        "Eclamptic seizure (tonic-clonic seizure in the setting of preeclampsia)",
        "Signs of DIC: uncontrollable bleeding from multiple sites, hematemesis, hematuria, vaginal hemorrhage"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate (MgSO4)",
        type: "Anticonvulsant / tocolytic / neuroprotective agent",
        action: "Acts as a central nervous system depressant by blocking neuromuscular transmission and decreasing acetylcholine release at the motor end plate; raises the seizure threshold by stabilizing neuronal cell membranes; promotes cerebral vasodilation and reduces cerebral vasospasm. Also provides fetal neuroprotection when given before preterm delivery (reduces risk of cerebral palsy).",
        sideEffects: "Flushing, warmth, sweating, nausea, hypotension, decreased deep tendon reflexes, respiratory depression, cardiac arrest (at toxic levels above 12 mg/dL); lethargy and decreased variability in fetal heart rate monitoring",
        contra: "Myasthenia gravis (increased sensitivity to neuromuscular blockade); severe renal impairment (magnesium is renally excreted -- dose reduction required); heart block",
        pearl: "Therapeutic serum magnesium level is 4-7 mg/dL. Monitor deep tendon reflexes (patellar reflex) hourly -- absent reflexes are the FIRST sign of toxicity. Check respiratory rate (must be 12 or higher) and urine output (must be 30 mL/hour or higher) before each dose. Keep calcium gluconate 1 gram at bedside as the antidote for magnesium toxicity."
      },
      {
        name: "Labetalol (Trandate)",
        type: "Combined alpha-1 and beta-adrenergic blocker / antihypertensive",
        action: "Blocks both alpha-1 adrenergic receptors (causing peripheral vasodilation and decreased systemic vascular resistance) and beta-adrenergic receptors (decreasing heart rate and cardiac output). The combined alpha/beta blockade lowers blood pressure without significantly reducing uteroplacental blood flow, making it preferred in obstetric emergencies.",
        sideEffects: "Orthostatic hypotension, bradycardia, fatigue, dizziness, nausea, bronchospasm (beta-blockade), neonatal bradycardia and hypoglycemia if given close to delivery",
        contra: "Asthma or severe reactive airway disease (beta-blockade can cause bronchospasm); heart block greater than first degree; cardiogenic shock; severe bradycardia",
        pearl: "For acute severe hypertension in pregnancy, IV labetalol is given in escalating doses (20 mg, then 40 mg, then 80 mg at 10-minute intervals). Keep patient supine or left lateral during IV administration to prevent orthostatic hypotension. Monitor fetal heart rate during antihypertensive administration. Goal is to lower blood pressure below 150/100 without causing fetal distress."
      },
      {
        name: "Dexamethasone (Decadron)",
        type: "Corticosteroid / anti-inflammatory / immunosuppressant",
        action: "Binds to intracellular glucocorticoid receptors and modulates gene transcription; in preterm pregnancies, crosses the placenta and stimulates fetal type II pneumocyte production of surfactant (accelerates fetal lung maturity). In HELLP syndrome specifically, dexamethasone may improve platelet count and liver function by reducing endothelial inflammation and stabilizing platelet aggregation.",
        sideEffects: "Hyperglycemia (monitor blood glucose closely in diabetic patients), fluid retention, increased infection risk, mood changes, insomnia, gastric irritation, adrenal suppression with prolonged use",
        contra: "Active systemic fungal infection; caution in patients with diabetes (will elevate blood glucose); caution in patients with active peptic ulcer disease",
        pearl: "For fetal lung maturity: two doses of 12 mg IM given 24 hours apart (or betamethasone 12 mg IM x 2 doses 24 hours apart). Maximum benefit occurs 48 hours after first dose. In HELLP, some protocols use higher-dose dexamethasone (10 mg IV every 12 hours) to temporarily improve platelet counts before delivery, although evidence for this practice remains debated."
      }
    ],
    pearls: [
      "HELLP stands for Hemolysis (schistocytes, elevated LDH, low haptoglobin), Elevated Liver enzymes (AST, ALT), and Low Platelets (below 100,000) -- all three components must be present for the diagnosis",
      "Right upper quadrant or epigastric pain is a RED FLAG in any pregnant patient beyond 20 weeks -- it may indicate liver capsule distension from HELLP and should NEVER be dismissed as heartburn or indigestion without proper evaluation",
      "Up to 15-20% of HELLP patients may NOT have hypertension or proteinuria at presentation -- do not rule out HELLP based on normal blood pressure alone; lab work is essential",
      "Magnesium sulfate is given for seizure PROPHYLAXIS, not to treat hypertension -- it prevents eclamptic seizures but does not lower blood pressure. Antihypertensives (labetalol, hydralazine) are given separately for blood pressure control",
      "Absent patellar reflexes are the FIRST clinical sign of magnesium toxicity -- always check deep tendon reflexes before administering any additional magnesium dose and hold the infusion if reflexes are absent",
      "HELLP can develop or WORSEN in the postpartum period (up to 48-72 hours after delivery) -- continued monitoring of platelets, liver enzymes, and symptoms is essential even after the baby has been delivered",
      "The Mississippi classification stratifies HELLP severity by platelet count: Class 1 (below 50,000 -- most severe), Class 2 (50,000-100,000), Class 3 (100,000-150,000) -- lower platelets indicate higher risk of DIC and hemorrhage"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient at 34 weeks gestation who reports severe epigastric pain and nausea. Laboratory results show platelets 68,000/mm3, AST 245 IU/L, and LDH 780 IU/L. Which condition do these findings most strongly suggest?",
        options: [
          "Acute cholecystitis",
          "HELLP syndrome",
          "Acute pancreatitis",
          "Hyperemesis gravidarum"
        ],
        correct: 1,
        rationale: "The combination of epigastric pain with the laboratory triad of thrombocytopenia (platelets 68,000), elevated liver enzymes (AST 245), and elevated LDH (780, indicating hemolysis) is the classic presentation of HELLP syndrome. While the symptoms may mimic cholecystitis or pancreatitis, the lab pattern is diagnostic. Hyperemesis gravidarum occurs in early pregnancy and does not cause this lab triad."
      },
      {
        question: "A patient receiving magnesium sulfate for HELLP syndrome with seizure prophylaxis is assessed by the practical nurse. Which finding should the nurse report IMMEDIATELY?",
        options: [
          "Patellar deep tendon reflexes are 2+ bilaterally",
          "Respiratory rate is 10 breaths per minute",
          "Urine output is 45 mL in the past hour",
          "Patient reports feeling flushed and warm"
        ],
        correct: 1,
        rationale: "A respiratory rate of 10 breaths per minute is below the safety threshold of 12 and indicates magnesium toxicity requiring immediate intervention. The infusion should be stopped and calcium gluconate should be available as the antidote. Patellar reflexes of 2+ are normal, urine output of 45 mL/hour is adequate (above 30 mL/hour threshold), and flushing/warmth is an expected side effect of magnesium sulfate."
      },
      {
        question: "A practical nurse is caring for a postpartum patient who delivered 36 hours ago after HELLP syndrome. The nurse notes new-onset petechiae on the patient's arms and bleeding from the IV site. What is the most appropriate action?",
        options: [
          "Document the findings and reassess in 4 hours",
          "Apply pressure to the IV site and continue routine monitoring",
          "Report findings immediately as they may indicate worsening thrombocytopenia or DIC",
          "Administer vitamin K as ordered for the bleeding"
        ],
        correct: 2,
        rationale: "Petechiae and bleeding from the IV site in a postpartum HELLP patient indicate worsening thrombocytopenia or progression to DIC. HELLP can worsen up to 48-72 hours postpartum. These findings require immediate reporting so that repeat CBC, coagulation studies, and potential platelet transfusion can be initiated. Delaying assessment or providing only local measures is unsafe in this context."
      }
    ]
  },

  "fetal-oxygenation-pushing-rpn": {
    title: "Fetal Oxygenation During Second Stage Pushing for Practical Nurses",
    cellular: {
      title: "Physiology of Fetal Oxygenation During the Second Stage of Labor",
      content: "The second stage of labor begins when the cervix is fully dilated (10 cm) and ends with the delivery of the infant. During this stage, the laboring patient actively bears down with contractions to push the fetus through the birth canal. Understanding fetal oxygenation during pushing requires knowledge of the uteroplacental oxygen transfer system and the physiologic stresses placed on the fetus during each contraction and pushing effort. Fetal oxygenation depends entirely on maternal blood flow through the uterine arteries to the intervillous spaces of the placenta. Oxygen-rich maternal blood enters the intervillous space, where oxygen diffuses across the placental membrane (syncytiotrophoblast layer) into fetal capillaries within the chorionic villi. Fetal hemoglobin (HbF) has a higher affinity for oxygen than adult hemoglobin (HbA) due to its reduced binding of 2,3-diphosphoglycerate (2,3-DPG), which shifts the oxygen-hemoglobin dissociation curve to the left. This allows the fetus to extract oxygen from maternal blood even at relatively low oxygen partial pressures. During each uterine contraction, the myometrial muscle fibers compress the spiral arteries and reduce or temporarily interrupt blood flow to the intervillous space. A normal contraction lasting 60-90 seconds followed by adequate resting tone (30-60 seconds between contractions) allows sufficient time for the intervillous space to refill with oxygenated maternal blood between contractions. During the second stage, when the patient performs a Valsalva maneuver (closed-glottis, sustained pushing for 10 or more seconds), several additional hemodynamic changes occur that further stress fetal oxygenation. The Valsalva maneuver increases intrathoracic pressure, which decreases venous return to the heart, reduces cardiac output, and can decrease uteroplacental perfusion. Simultaneously, the sustained bearing-down effort compresses the umbilical cord between the fetal presenting part and the bony pelvis, particularly during fetal descent. Head compression during passage through the birth canal stimulates a vagal response, which may cause early decelerations on the fetal heart rate tracing (a benign, symmetric decrease in heart rate that mirrors the contraction pattern). Variable decelerations (abrupt, sharp decreases in heart rate) may occur from intermittent umbilical cord compression. Late decelerations (gradual decreases that begin after the peak of the contraction and do not recover until after the contraction ends) are the most concerning pattern because they indicate uteroplacental insufficiency -- the placenta cannot deliver adequate oxygen during the stress of contractions. Tachysystole, defined as more than 5 contractions in 10 minutes averaged over 30 minutes, is particularly dangerous during the pushing phase because it reduces the recovery time between contractions, preventing adequate replenishment of the intervillous oxygen reserve. Fetal oxygen reserves are limited, and prolonged or excessive pushing without adequate recovery time can lead to progressive fetal acidemia (accumulation of lactic acid from anaerobic metabolism in fetal tissues). The practical nurse must understand two primary pushing techniques. Directed pushing (closed-glottis or Valsalva pushing) involves coaching the patient to take a deep breath, hold it, bear down for 10 seconds, and repeat three times per contraction. While effective for fetal descent, this technique can reduce fetal oxygenation with each prolonged push. Physiologic pushing (open-glottis or spontaneous pushing) allows the patient to follow her body's natural urge to push, using shorter pushing efforts (3-5 seconds) with breathing between efforts. Research suggests that physiologic pushing is associated with better fetal oxygenation, fewer abnormal fetal heart rate patterns, and less maternal exhaustion compared to directed Valsalva pushing. Delayed pushing (laboring down) involves waiting 1-2 hours after full dilation before beginning active pushing, allowing the fetus to descend passively with contractions. This technique may reduce pushing duration, decrease maternal fatigue, and improve fetal oxygenation, particularly in patients with epidural analgesia where the urge to push may be diminished."
    },
    riskFactors: [
      "Prolonged second stage of labor (nulliparous: more than 3 hours with epidural, 2 hours without; multiparous: more than 2 hours with epidural, 1 hour without)",
      "Tachysystole (more than 5 contractions in 10 minutes) -- reduces fetal recovery time between contractions",
      "Oxytocin (Pitocin) augmentation or induction -- increases contraction frequency and intensity",
      "Epidural analgesia -- may diminish pushing urge, prolong second stage, and necessitate directed pushing",
      "Maternal supine positioning -- vena cava compression by the gravid uterus reduces cardiac output and uteroplacental perfusion",
      "Oligohydramnios (decreased amniotic fluid) -- increases risk of umbilical cord compression during fetal descent",
      "Fetal conditions: intrauterine growth restriction (IUGR), postterm pregnancy (reduced placental reserve), congenital anomalies affecting cardiac output"
    ],
    diagnostics: [
      "Continuous electronic fetal monitoring (EFM): standard of care during the second stage; assess baseline heart rate (110-160 bpm), variability (moderate is reassuring), accelerations (present = reassuring), and decelerations (type, timing, duration, recovery)",
      "Fetal heart rate pattern categories: Category I (normal -- reassuring), Category II (indeterminate -- requires evaluation and continued monitoring), Category III (abnormal -- requires immediate intervention and preparation for delivery)",
      "Contraction monitoring (tocodynamometry or intrauterine pressure catheter): assess frequency, duration, intensity, and resting tone; identify tachysystole (more than 5 contractions in 10 minutes)",
      "Fetal scalp stimulation: vibroacoustic or digital scalp stimulation during labor; an acceleration in response indicates a fetal pH above 7.20 (reassuring acid-base status)",
      "Umbilical cord blood gas analysis: obtained immediately after delivery from a double-clamped segment of cord; arterial pH below 7.10 indicates significant metabolic acidosis; normal umbilical artery pH is 7.20-7.30",
      "Maternal vital signs: blood pressure, pulse, oxygen saturation; maternal hypotension or desaturation directly compromises fetal oxygenation"
    ],
    management: [
      "Encourage physiologic (open-glottis) pushing: allow the patient to push with her natural urge, using shorter efforts (3-5 seconds) with breathing between pushes; associated with better fetal oxygenation and less maternal fatigue",
      "Consider delayed pushing (laboring down) for patients with epidural analgesia: wait 1-2 hours after full dilation before initiating active pushing to allow passive fetal descent",
      "Position changes during pushing: upright positions (squatting, hands-and-knees, side-lying) improve pelvic diameter and reduce vena cava compression compared to supine lithotomy; lateral position improves uteroplacental blood flow",
      "Manage tachysystole: if more than 5 contractions in 10 minutes, reduce or discontinue oxytocin infusion, reposition patient to left lateral, administer IV fluid bolus, and notify the provider",
      "Intrauterine resuscitation for non-reassuring fetal heart rate patterns: stop oxytocin, position patient in left lateral, administer oxygen via non-rebreather mask at 10 L/min (if indicated), IV fluid bolus of 500 mL lactated Ringer solution",
      "Prepare for operative delivery (vacuum, forceps, or emergency cesarean section) if fetal heart rate pattern does not improve with resuscitative measures or if there is a prolonged deceleration below 60 bpm lasting more than 3 minutes",
      "Terbutaline 0.25 mg subcutaneous injection may be ordered as acute tocolysis to relax the uterus in cases of severe tachysystole or uterine tetany contributing to fetal distress"
    ],
    nursingActions: [
      "Continuously monitor and interpret fetal heart rate tracing during the second stage: assess baseline rate, variability, presence of accelerations, and type/severity of decelerations with each contraction",
      "Document fetal heart rate assessment at least every 15 minutes during the second stage for low-risk patients and every 5 minutes for high-risk patients",
      "Coach the patient in effective pushing technique: encourage spontaneous pushing efforts, avoid sustained Valsalva for more than 6-8 seconds, allow rest between contractions for fetal recovery",
      "Reposition patient immediately if late or prolonged decelerations occur: left lateral position reduces vena cava compression and improves uteroplacental blood flow",
      "Monitor contraction pattern: report tachysystole (more than 5 contractions in 10 minutes) or inadequate resting tone (uterus not relaxing between contractions) to the registered nurse or provider immediately",
      "Assess maternal vital signs every 15-30 minutes during the second stage: maternal hypotension, tachycardia, or fever can compromise fetal oxygenation",
      "Communicate fetal heart rate pattern changes using standardized terminology (NICHD categories I, II, III) to the healthcare team and document all interventions and responses"
    ],
    assessmentFindings: [
      "Normal (Category I) fetal heart rate: baseline 110-160 bpm, moderate variability (6-25 bpm fluctuations), accelerations present, no late or variable decelerations -- no intervention needed",
      "Early decelerations: gradual onset, mirror contraction shape, nadir at peak of contraction; caused by fetal head compression during descent -- benign, no intervention needed",
      "Variable decelerations: abrupt onset (drop of 15 bpm or more in less than 30 seconds), variable in shape and timing; caused by umbilical cord compression -- reposition patient, may resolve",
      "Late decelerations: gradual onset, begin after peak of contraction, do not recover until after contraction ends; caused by uteroplacental insufficiency -- ALWAYS concerning, requires immediate intervention",
      "Minimal or absent variability: less than 5 bpm fluctuation in baseline; may indicate fetal acidemia, sleep cycle (transient), or maternal medication effect (opioids, magnesium sulfate)",
      "Prolonged deceleration: decrease of 15 bpm or more below baseline lasting 2-10 minutes; caused by cord prolapse, maternal hypotension, uterine rupture, or severe tachysystole -- emergency intervention required",
      "Fetal tachycardia (baseline above 160 bpm): may indicate maternal fever, chorioamnionitis, fetal anemia, or medication effect (terbutaline)"
    ],
    signs: {
      left: [
        "Intermittent early decelerations with rapid recovery (fetal head compression -- benign)",
        "Occasional mild variable decelerations with moderate variability maintained",
        "Maternal fatigue and reduced pushing effectiveness",
        "Mild maternal tachycardia (heart rate 100-110 bpm) from exertion",
        "Contraction frequency 3-5 in 10 minutes with adequate resting tone",
        "Fetal heart rate baseline within normal range (110-160 bpm) with moderate variability"
      ],
      right: [
        "Recurrent late decelerations (uteroplacental insufficiency -- fetal hypoxemia)",
        "Prolonged deceleration below 60 bpm lasting more than 3 minutes",
        "Absent fetal heart rate variability with recurrent decelerations (Category III)",
        "Tachysystole (more than 5 contractions in 10 minutes) unresponsive to interventions",
        "Fetal bradycardia (sustained baseline below 110 bpm)",
        "Sinusoidal fetal heart rate pattern (smooth, sine-wave-like pattern suggesting severe fetal anemia)"
      ]
    },
    medications: [
      {
        name: "Terbutaline (Brethine)",
        type: "Beta-2 adrenergic agonist / acute tocolytic",
        action: "Stimulates beta-2 adrenergic receptors on uterine smooth muscle cells, activating adenylyl cyclase and increasing intracellular cyclic AMP (cAMP), which reduces intracellular calcium availability and causes uterine smooth muscle relaxation. This rapidly decreases contraction frequency and intensity, allowing uteroplacental blood flow to recover and improving fetal oxygenation.",
        sideEffects: "Maternal tachycardia (most common), palpitations, tremor, headache, hyperglycemia, hypokalemia, pulmonary edema (rare, with prolonged use), fetal tachycardia",
        contra: "Maternal cardiac disease (hypertrophic cardiomyopathy, significant arrhythmias), uncontrolled hyperthyroidism, prolonged use beyond 48-72 hours (FDA black box warning for injectable terbutaline beyond this duration)",
        pearl: "Used as ACUTE tocolysis for uterine tachysystole or tetanic contraction during labor -- given as a single dose of 0.25 mg subcutaneous injection. Effect onset is 5-15 minutes. This is a rescue medication for fetal distress caused by excessive uterine activity, NOT a long-term tocolytic. Monitor maternal heart rate closely -- expect tachycardia."
      },
      {
        name: "Oxytocin (Pitocin)",
        type: "Uterine stimulant / synthetic posterior pituitary hormone",
        action: "Binds to oxytocin receptors on myometrial smooth muscle cells, activating the phospholipase C second messenger pathway, which increases intracellular calcium release from the sarcoplasmic reticulum. The resulting increase in intracellular calcium activates the actin-myosin contractile proteins, producing rhythmic uterine contractions. Oxytocin receptor density increases throughout pregnancy, making the uterus most responsive at term.",
        sideEffects: "Uterine tachysystole and hypertonicity (most important -- can cause fetal distress), water intoxication and hyponatremia (antidiuretic effect at high doses), uterine rupture (rare, higher risk in patients with prior uterine surgery), neonatal jaundice",
        contra: "Active genital herpes with visible lesions, placenta previa or vasa previa, transverse fetal lie, umbilical cord prolapse, prior classical (vertical) cesarean incision, cephalopelvic disproportion",
        pearl: "Oxytocin must be administered via infusion pump with precise dosing. Start at a low dose (0.5-2 milliunits/minute) and titrate gradually. During the second stage, if tachysystole develops (more than 5 contractions in 10 minutes), REDUCE or DISCONTINUE oxytocin before adding terbutaline. Always have terbutaline available as a rescue tocolytic when running oxytocin."
      },
      {
        name: "Epinephrine (Adrenaline)",
        type: "Catecholamine / sympathomimetic / emergency resuscitation agent",
        action: "Stimulates alpha-1 adrenergic receptors (causing peripheral vasoconstriction and increased systemic vascular resistance), beta-1 receptors (increasing heart rate, contractility, and cardiac output), and beta-2 receptors (causing bronchodilation). In neonatal resuscitation, epinephrine is used when heart rate remains below 60 bpm despite effective ventilation and chest compressions. It increases coronary perfusion pressure and stimulates the neonatal heart.",
        sideEffects: "Tachycardia, hypertension, cardiac arrhythmias, tremor, anxiety, tissue necrosis if IV infiltration occurs, cerebral hemorrhage (in neonates with immature cerebral vasculature)",
        contra: "Not an absolute contraindication in cardiac arrest (always give if indicated); use with extreme caution in patients with cardiac arrhythmias, severe hypertension, or pheochromocytoma",
        pearl: "In neonatal resuscitation (NRP algorithm): epinephrine dose is 0.01-0.03 mg/kg IV/IO (or 0.05-0.1 mg/kg via endotracheal tube) for neonates with heart rate below 60 bpm after 30 seconds of effective ventilation with chest compressions. The IV route is preferred. This is a last-resort medication in the delivery room -- effective ventilation is the most critical intervention in neonatal resuscitation."
      }
    ],
    pearls: [
      "Late decelerations are ALWAYS concerning regardless of depth -- they indicate uteroplacental insufficiency meaning the placenta cannot deliver adequate oxygen during contractions. Even shallow late decelerations with absent variability represent a Category III tracing requiring immediate intervention.",
      "Tachysystole (more than 5 contractions in 10 minutes averaged over 30 minutes) reduces the time for oxygen-rich blood to refill the intervillous space between contractions -- the immediate intervention is to REDUCE or STOP oxytocin, reposition to left lateral, and administer IV fluid bolus",
      "Physiologic (open-glottis) pushing allows the patient to breathe between short pushing efforts and is associated with better fetal oxygenation compared to sustained Valsalva pushing -- coach patients to push with their natural urge rather than counting to ten",
      "The LEFT LATERAL position is the single most effective repositioning maneuver for improving uteroplacental perfusion -- it relieves aorto-caval compression by the gravid uterus, which can reduce cardiac output by up to 30% in the supine position",
      "Moderate fetal heart rate variability (6-25 bpm fluctuations) is the MOST reassuring indicator of fetal well-being -- it confirms adequate cerebral oxygenation and an intact autonomic nervous system. Loss of variability is more concerning than any type of deceleration",
      "Delayed pushing (laboring down) for 1-2 hours after full dilation in patients with epidural analgesia allows passive fetal descent, reduces active pushing time, and decreases the incidence of operative vaginal delivery without increasing adverse neonatal outcomes",
      "In neonatal resuscitation, the MOST important intervention is establishing effective ventilation -- approximately 90% of neonates requiring resuscitation respond to drying, stimulation, and positive pressure ventilation alone. Epinephrine is needed in fewer than 1% of deliveries."
    ],
    quiz: [
      {
        question: "During the second stage of labor, the practical nurse observes a gradual decrease in fetal heart rate that begins after the peak of the contraction and does not recover until after the contraction ends. This pattern is repeated with each contraction. Which type of deceleration does this represent?",
        options: [
          "Early deceleration (head compression)",
          "Variable deceleration (cord compression)",
          "Late deceleration (uteroplacental insufficiency)",
          "Prolonged deceleration (acute event)"
        ],
        correct: 2,
        rationale: "Late decelerations are characterized by a gradual onset, beginning after the peak of the contraction with the nadir occurring after the contraction peak, and recovery after the contraction ends. They are caused by uteroplacental insufficiency and indicate that the placenta cannot adequately oxygenate the fetus during contractions. Recurrent late decelerations require immediate intervention: stop oxytocin, reposition to left lateral, IV fluid bolus, and notify the provider."
      },
      {
        question: "A patient receiving oxytocin during the second stage of labor has 7 contractions in a 10-minute period. The fetal heart rate shows recurrent variable decelerations. What should the practical nurse do FIRST?",
        options: [
          "Increase the oxytocin rate to strengthen contractions and expedite delivery",
          "Reduce or discontinue the oxytocin infusion and reposition the patient to left lateral",
          "Administer terbutaline 0.25 mg subcutaneous immediately",
          "Prepare for emergency cesarean section"
        ],
        correct: 1,
        rationale: "Seven contractions in 10 minutes constitutes tachysystole (more than 5 in 10 minutes). The first intervention is to reduce or discontinue oxytocin and reposition to left lateral position to improve uteroplacental perfusion. Terbutaline may be ordered if tachysystole persists after stopping oxytocin. Increasing oxytocin would worsen the situation. Emergency cesarean may be needed if the pattern does not resolve, but reducing oxytocin and repositioning are the immediate first steps."
      },
      {
        question: "A practical nurse is coaching a primigravida patient during the pushing phase. Which pushing technique is most associated with improved fetal oxygenation?",
        options: [
          "Directed Valsalva pushing: deep breath, hold, push for 10 seconds, repeat 3 times per contraction",
          "Physiologic pushing: follow the natural urge to push with short efforts and breathing between pushes",
          "Sustained pushing: continuous bearing down throughout the entire contraction without breathing",
          "Delayed pushing until crowning is visible before any bearing-down effort"
        ],
        correct: 1,
        rationale: "Physiologic (open-glottis, spontaneous) pushing allows the patient to follow her body's natural urge to push using shorter efforts (3-5 seconds) with breathing between efforts. This technique maintains better fetal oxygenation because it avoids the sustained intrathoracic pressure increase of the Valsalva maneuver, which can reduce cardiac output and uteroplacental blood flow. Research supports physiologic pushing for improved fetal acid-base outcomes."
      }
    ]
  },

  "heat-stroke-rpn": {
    title: "Heat Stroke Recognition and Emergency Care for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Heat Stroke and Thermoregulatory Failure",
      content: "Heat stroke is a medical emergency defined by a core body temperature exceeding 40 degrees Celsius (104 degrees Fahrenheit) with associated central nervous system dysfunction (altered mental status, seizures, coma). It represents the most severe form of heat-related illness along a continuum that includes heat cramps, heat exhaustion, and heat stroke. The human body maintains core temperature within a narrow range (36.5-37.5 degrees Celsius) through a thermoregulatory system centered in the hypothalamus. The preoptic anterior hypothalamus functions as the body's thermostat, receiving input from peripheral and central thermoreceptors and coordinating heat dissipation mechanisms. When core temperature rises, the hypothalamus activates four primary cooling mechanisms: cutaneous vasodilation (redirecting blood flow from the core to the skin surface for radiative and convective heat loss), sweating (evaporative cooling, which can dissipate up to 600 kcal/hour under ideal conditions), behavioral responses (seeking shade, removing clothing), and increased respiratory rate (minor contribution through evaporative loss from the respiratory tract). Heat stroke develops when these thermoregulatory mechanisms fail or are overwhelmed, and heat production or environmental heat gain exceeds the body's capacity for heat dissipation. There are two clinical forms of heat stroke. Classic (nonexertional) heat stroke occurs in elderly, chronically ill, or homebound individuals during heat waves, particularly those lacking access to air conditioning, taking medications that impair sweating (anticholinergics, antihistamines, phenothiazines, beta-blockers, diuretics), or those with chronic conditions affecting thermoregulation (diabetes, cardiovascular disease, obesity, alcoholism). Classic heat stroke develops over hours to days and the skin is characteristically hot, dry, and flushed because the sweating mechanism has failed. Exertional heat stroke occurs in young, otherwise healthy individuals performing strenuous physical activity in hot and humid environments (military recruits, athletes, outdoor laborers). In exertional heat stroke, heat production from muscular work exceeds dissipation capacity even though the sweating mechanism may still be partially functional -- diaphoresis may still be present, which is an important clinical distinction from classic heat stroke. At the cellular level, extreme hyperthermia (above 40 degrees Celsius) causes direct thermal injury to cells and initiates a systemic inflammatory response similar to sepsis. Heat denatures proteins and disrupts cell membrane lipid bilayers, increasing cell membrane permeability and releasing intracellular contents (potassium, myoglobin, liver enzymes, lactate dehydrogenase) into the circulation. Damage to intestinal epithelial tight junctions allows bacterial endotoxin (lipopolysaccharide) to translocate from the gut lumen into the bloodstream, activating the systemic inflammatory cascade with massive cytokine release (interleukin-1, interleukin-6, tumor necrosis factor-alpha). This cytokine storm causes widespread endothelial damage, increased vascular permeability, activation of the coagulation cascade, and disseminated intravascular coagulation (DIC). Rhabdomyolysis (skeletal muscle breakdown) is common in exertional heat stroke: necrotic muscle releases myoglobin, which is nephrotoxic and can cause acute kidney injury when it precipitates in the renal tubules (myoglobinuric renal failure). Hepatic injury occurs from direct thermal damage and hypoperfusion, with liver failure developing in 5-10% of heat stroke cases, typically peaking 2-3 days after the initial event. Central nervous system damage occurs from both direct thermal injury to neurons and cerebral edema; cerebellar Purkinje cells are particularly vulnerable, which explains the persistent cerebellar ataxia seen in some survivors. The practical nurse plays a critical role in early recognition and initiation of rapid cooling, which is the single most important determinant of patient outcome. Every minute of delay in cooling increases the risk of irreversible organ damage and death. The mortality rate for heat stroke ranges from 10-80% depending on the speed and effectiveness of cooling, the peak core temperature achieved, and the duration of hyperthermia."
    },
    riskFactors: [
      "Extremes of age: elderly (impaired thermoregulation, decreased sweating, chronic illness) and young children (immature thermoregulation, higher metabolic rate, dependence on caregivers)",
      "Environmental exposure: ambient temperature above 35 degrees Celsius, high humidity (reduces evaporative cooling effectiveness), poor ventilation, lack of air conditioning",
      "Strenuous physical activity in hot conditions (exertional heat stroke): military training, competitive athletics, outdoor manual labor without adequate hydration and rest breaks",
      "Medications that impair thermoregulation: anticholinergics (reduce sweating), beta-blockers (limit cardiac output response), diuretics (volume depletion), antipsychotics (phenothiazines disrupt hypothalamic thermoregulation), stimulants (amphetamines, cocaine increase heat production)",
      "Chronic conditions: obesity (insulation effect and reduced heat dissipation), cardiovascular disease, diabetes mellitus, chronic kidney disease, hyperthyroidism",
      "Dehydration and inadequate fluid intake (reduces sweat volume and cardiac output for heat dissipation)",
      "Previous heat stroke (may have residual thermoregulatory damage increasing recurrence risk)"
    ],
    diagnostics: [
      "Core body temperature: rectal or esophageal temperature is the gold standard for accurate core temperature measurement; tympanic and axillary methods are unreliable in heat emergencies. Core temperature above 40 degrees Celsius (104 degrees Fahrenheit) with CNS dysfunction confirms heat stroke",
      "Complete blood count (CBC): elevated hematocrit from hemoconcentration (dehydration); later may show evidence of DIC (schistocytes, thrombocytopenia). Leukocytosis is common due to inflammatory response",
      "Comprehensive metabolic panel: hyperkalemia (from rhabdomyolysis and cell lysis), hypernatremia or hyponatremia (depending on fluid losses and intake), elevated BUN/creatinine (acute kidney injury), hypoglycemia (hepatic dysfunction), metabolic acidosis (lactic acid from tissue hypoperfusion)",
      "Creatine kinase (CK): markedly elevated in exertional heat stroke from rhabdomyolysis; levels above 5,000 IU/L indicate significant muscle breakdown; serial monitoring needed as CK peaks 24-72 hours after onset",
      "Coagulation studies (PT, PTT, INR, fibrinogen, D-dimer): prolonged PT/PTT, elevated D-dimer, decreased fibrinogen indicate DIC; DIC occurs in up to 45% of severe heat stroke cases",
      "Urinalysis: dark brown or tea-colored urine (myoglobinuria from rhabdomyolysis); positive for blood on dipstick but no red blood cells on microscopy confirms myoglobinuria",
      "Liver function tests (AST, ALT): typically elevated 24-72 hours after heat stroke onset; markedly elevated values (above 1000 IU/L) indicate severe hepatic injury and carry poor prognosis"
    ],
    management: [
      "RAPID COOLING is the cornerstone of treatment and must begin IMMEDIATELY -- every minute of delay increases mortality. Target is to reduce core temperature to 38.5-39 degrees Celsius within 30 minutes of presentation",
      "Cold water immersion (CWI): the gold standard for cooling in exertional heat stroke; immerse the patient in an ice water bath (1-3 degrees Celsius) with continuous stirring; cooling rate approximately 0.15-0.35 degrees Celsius per minute. Not practical for hospitalized patients or those with altered consciousness requiring airway management",
      "Evaporative cooling: undress the patient completely, spray or mist the skin with tepid water, and direct high-flow fans over the body to maximize evaporative heat loss; less effective than cold water immersion but feasible in most clinical settings",
      "Ice packs applied to areas of high vascular density: axillae, groin, neck, and behind the knees; supplement to other cooling methods but insufficient as sole cooling strategy",
      "Aggressive IV fluid resuscitation: normal saline (0.9% NaCl) bolus to correct dehydration, support cardiac output, and maintain renal perfusion; typical initial bolus 1-2 liters; avoid cold fluids directly into the bloodstream unless specifically ordered",
      "Manage complications: treat seizures (benzodiazepines), correct electrolyte imbalances, manage DIC (blood products as indicated), prevent and treat acute kidney injury (maintain urine output above 200-300 mL/hour with aggressive hydration if rhabdomyolysis is present)",
      "STOP cooling when core temperature reaches 38-39 degrees Celsius to prevent overshoot hypothermia; remove from ice bath or discontinue active cooling measures and continue monitoring temperature every 15-30 minutes"
    ],
    nursingActions: [
      "Remove the patient from the hot environment IMMEDIATELY and initiate cooling measures without delay -- time to cooling is the most important prognostic factor",
      "Remove all clothing to expose skin surface area for maximal heat dissipation through evaporation, radiation, and convection",
      "Monitor core body temperature using rectal probe continuously during active cooling; tympanic and oral temperatures are unreliable and should NOT be used to guide cooling decisions",
      "Monitor vital signs every 5-15 minutes during active cooling: assess for hypotension (volume depletion), tachycardia, respiratory distress, and changes in level of consciousness",
      "Monitor and record strict intake and output: insert indwelling urinary catheter as ordered; assess urine color (dark brown = myoglobinuria) and volume (maintain above 0.5-1 mL/kg/hour; goal above 200 mL/hour if rhabdomyolysis is suspected)",
      "Assess neurological status frequently: Glasgow Coma Scale (GCS), pupil reactivity, presence of seizure activity, orientation, and cognitive function -- persistent altered mental status after cooling suggests brain injury",
      "Report shivering during cooling to the registered nurse or physician immediately -- shivering generates heat and counteracts cooling efforts; benzodiazepines or chlorpromazine may be ordered to suppress the shivering response"
    ],
    assessmentFindings: [
      "Core body temperature above 40 degrees Celsius (104 degrees Fahrenheit) -- this is a DEFINING criterion of heat stroke",
      "Central nervous system dysfunction: confusion, agitation, delirium, ataxia (cerebellar involvement), slurred speech, seizures, loss of consciousness, coma",
      "Classic heat stroke: skin is hot, dry, and flushed (sweating mechanism has failed); exertional heat stroke: skin may still be diaphoretic (sweating mechanism still partially functional)",
      "Cardiovascular: tachycardia, hypotension (from volume depletion and vasodilation), widened pulse pressure initially (peripheral vasodilation), cardiovascular collapse in severe cases",
      "Respiratory: tachypnea, Kussmaul respirations (compensating for metabolic acidosis), possible pulmonary edema from fluid resuscitation or capillary leak",
      "Renal: oliguria progressing to anuria (acute kidney injury), dark brown urine (myoglobinuria from rhabdomyolysis)",
      "Musculoskeletal: muscle tenderness, rigidity, or cramping (rhabdomyolysis); hepatomegaly and right upper quadrant tenderness (hepatic injury)"
    ],
    signs: {
      left: [
        "Heat exhaustion prodrome: heavy sweating, weakness, nausea, headache, dizziness, muscle cramps",
        "Core temperature 38-40 degrees Celsius (heat exhaustion range, not yet heat stroke)",
        "Mild tachycardia (heart rate 100-120 bpm) and mild hypotension",
        "Fatigue, irritability, and difficulty concentrating",
        "Flushed, warm skin with profuse sweating",
        "Mild nausea and decreased appetite"
      ],
      right: [
        "Core temperature above 40 degrees Celsius with altered mental status (defines heat stroke)",
        "Seizure activity (generalized tonic-clonic seizures from direct cerebral thermal injury)",
        "Loss of consciousness or coma (Glasgow Coma Scale below 8)",
        "Hot, dry, flushed skin (classic heat stroke -- sweating mechanism failure)",
        "Cardiovascular collapse: severe hypotension, weak thready pulse, tachycardia above 140 bpm",
        "Dark brown urine (myoglobinuria indicating rhabdomyolysis with acute kidney injury risk)"
      ]
    },
    medications: [
      {
        name: "Dantrolene (Dantrium)",
        type: "Direct-acting skeletal muscle relaxant",
        action: "Acts directly on skeletal muscle by binding to ryanodine receptors (RyR1) on the sarcoplasmic reticulum, inhibiting calcium release into the cytoplasm. This reduces muscle contraction force and metabolic heat production from excessive muscle activity. Originally developed for malignant hyperthermia (a genetic condition of uncontrolled skeletal muscle metabolism triggered by volatile anesthetics), dantrolene may be considered in heat stroke cases with significant muscle rigidity or when cooling alone is insufficient.",
        sideEffects: "Hepatotoxicity (most serious -- monitor liver function tests), muscle weakness, drowsiness, dizziness, diarrhea, nausea, phlebitis at injection site (must reconstitute with sterile water and administer through large-bore IV)",
        contra: "Active hepatic disease (hepatotoxic); should not be used in conditions where muscle strength is essential for ventilation unless patient is mechanically ventilated",
        pearl: "Dantrolene is the definitive treatment for malignant hyperthermia but its role in heat stroke is debated and not considered first-line. It may be considered when aggressive external cooling fails or when there is significant muscle rigidity generating ongoing heat production. The focus in heat stroke management remains on RAPID EXTERNAL COOLING as the primary intervention."
      },
      {
        name: "Diazepam (Valium)",
        type: "Benzodiazepine / anticonvulsant / skeletal muscle relaxant / anxiolytic",
        action: "Enhances the inhibitory effect of gamma-aminobutyric acid (GABA) at the GABA-A receptor by increasing the frequency of chloride channel opening, resulting in neuronal hyperpolarization. This produces anticonvulsant, anxiolytic, sedative, and muscle relaxant effects. In heat stroke, diazepam is used to treat seizures and suppress shivering (which generates metabolic heat and counteracts cooling efforts).",
        sideEffects: "Respiratory depression (most dangerous -- can cause apnea especially when combined with opioids or alcohol), sedation, hypotension, anterograde amnesia, paradoxical excitation (rare), physical dependence with prolonged use",
        contra: "Severe respiratory insufficiency, acute narrow-angle glaucoma, sleep apnea syndrome; use with extreme caution in elderly patients (increased sensitivity) and those with hepatic impairment (prolonged half-life)",
        pearl: "In heat stroke, diazepam serves two purposes: treating active seizures (5-10 mg IV, may repeat every 10-15 minutes) and suppressing shivering during cooling. Shivering is a thermoregulatory response that GENERATES heat -- if the patient shivers during cooling, the cooling is less effective. Have airway equipment and flumazenil (benzodiazepine reversal agent) available when administering IV benzodiazepines."
      },
      {
        name: "Normal Saline (0.9% Sodium Chloride)",
        type: "Isotonic crystalloid solution / volume expander",
        action: "Provides isotonic volume expansion by distributing primarily within the extracellular fluid compartment (approximately 25% remains intravascular, 75% distributes to interstitial space). Restores intravascular volume, improves cardiac output and tissue perfusion, supports renal blood flow for myoglobin clearance, and helps maintain blood pressure. The sodium and chloride composition (154 mEq/L each) approximates the electrolyte concentration of plasma.",
        sideEffects: "Hyperchloremic metabolic acidosis (from excess chloride administration), fluid overload (monitor for crackles, jugular venous distension, peripheral edema), hypernatremia, dilutional coagulopathy with massive volumes",
        contra: "Use with caution in patients with congestive heart failure (risk of pulmonary edema), renal failure (impaired fluid excretion), and hypernatremia; monitor fluid balance closely",
        pearl: "In heat stroke with rhabdomyolysis, aggressive IV fluid resuscitation is critical to maintain urine output above 200-300 mL/hour and prevent myoglobin from precipitating in the renal tubules. Typical initial bolus is 1-2 liters, then titrate to maintain adequate urine output. Monitor for signs of fluid overload (crackles, increased work of breathing) especially in elderly patients. Avoid lactated Ringer solution if hyperkalemia is present from rhabdomyolysis."
      }
    ],
    pearls: [
      "Heat stroke is defined by TWO criteria: core temperature above 40 degrees Celsius AND central nervous system dysfunction (confusion, seizures, coma) -- elevated temperature alone without altered mental status is heat exhaustion, not heat stroke",
      "RAPID COOLING is the single most important treatment for heat stroke -- every minute of delay increases mortality. The goal is to reduce core temperature to 38.5-39 degrees Celsius within 30 minutes. Cool FIRST, transport SECOND.",
      "Classic heat stroke skin is hot, dry, and flushed (sweating failure); exertional heat stroke skin may still be DIAPHORETIC (sweating is present) -- do NOT rule out heat stroke just because the patient is sweating",
      "Rectal temperature is the GOLD STANDARD for core temperature measurement in heat emergencies -- tympanic, oral, and axillary methods are unreliable and may underestimate true core temperature by several degrees",
      "Stop active cooling when core temperature reaches 38-39 degrees Celsius to prevent OVERSHOOT HYPOTHERMIA -- the body continues to cool after active measures are stopped due to thermal afterdrop",
      "Shivering during cooling is COUNTERPRODUCTIVE because it generates metabolic heat -- report shivering immediately so benzodiazepines or other agents can be given to suppress the shivering response",
      "Dark brown or tea-colored urine in a heat stroke patient indicates MYOGLOBINURIA from rhabdomyolysis -- this is a renal emergency requiring aggressive IV hydration to flush myoglobin through the kidneys and prevent acute tubular necrosis"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for an elderly patient brought to the emergency department during a heat wave. The patient is confused, has hot dry skin, and a rectal temperature of 41.2 degrees Celsius. Which intervention takes the HIGHEST priority?",
        options: [
          "Establish IV access and draw blood for laboratory tests",
          "Begin rapid cooling measures immediately (evaporative cooling, ice packs to groin and axillae)",
          "Obtain a detailed medical history from family members",
          "Administer oral rehydration fluids and monitor for improvement"
        ],
        correct: 1,
        rationale: "Rapid cooling is the highest priority in heat stroke and the single most important determinant of patient outcome. Every minute of delay in cooling increases the risk of irreversible organ damage and death. While IV access and laboratory work are important, they should not delay the initiation of cooling. Oral fluids are inappropriate in a patient with altered mental status due to aspiration risk."
      },
      {
        question: "A patient undergoing active cooling for heat stroke begins to shiver vigorously. The practical nurse recognizes that shivering in this situation is concerning because it will:",
        options: [
          "Indicate that the patient's temperature has normalized",
          "Generate additional metabolic heat and counteract the cooling efforts",
          "Suggest that the patient is developing sepsis",
          "Confirm that the cooling method is effective and should continue unchanged"
        ],
        correct: 1,
        rationale: "Shivering is the body's thermoregulatory response to generate heat when cooling occurs. In heat stroke, shivering is counterproductive because it generates metabolic heat through muscle contraction, directly opposing the cooling efforts. The nurse should report shivering immediately so that medications (typically benzodiazepines such as diazepam) can be administered to suppress the shivering response and allow effective cooling to continue."
      },
      {
        question: "A practical nurse caring for a heat stroke patient notes that the urine in the collection bag appears dark brown. Which complication does this finding most likely indicate?",
        options: [
          "Concentrated urine from dehydration only",
          "Urinary tract infection from catheter insertion",
          "Rhabdomyolysis with myoglobinuria indicating risk of acute kidney injury",
          "Bilirubinuria from hepatic jaundice"
        ],
        correct: 2,
        rationale: "Dark brown (tea-colored or cola-colored) urine in a heat stroke patient strongly suggests myoglobinuria from rhabdomyolysis (skeletal muscle breakdown). Myoglobin released from damaged muscle is filtered by the kidneys and can precipitate in the renal tubules, causing acute tubular necrosis and acute kidney injury. This requires aggressive IV hydration to maintain urine output above 200-300 mL/hour and flush myoglobin through the kidneys."
      }
    ]
  },

  "barrett-esophagus-rpn": {
    title: "Barrett Esophagus for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Barrett Esophagus and Intestinal Metaplasia",
      content: "Barrett esophagus is a premalignant condition in which the normal stratified squamous epithelium lining the distal esophagus undergoes metaplastic transformation to specialized intestinal-type columnar epithelium containing goblet cells. This process, known as intestinal metaplasia, is the body's adaptive response to chronic injury from gastroesophageal reflux disease (GERD). Understanding the cellular progression from normal esophageal tissue to Barrett esophagus and potentially to esophageal adenocarcinoma requires knowledge of the underlying mechanisms at each stage. The normal esophagus is lined by nonkeratinized stratified squamous epithelium, which is designed to withstand mechanical abrasion from food bolus transit but is poorly equipped to resist chemical injury from gastric acid and bile salts. The gastroesophageal junction (GEJ), also called the Z-line or squamocolumnar junction, marks the transition point between the squamous epithelium of the esophagus and the columnar epithelium of the stomach. In GERD, the lower esophageal sphincter (LES) fails to maintain adequate pressure, allowing gastric contents (hydrochloric acid with pH 1-2, pepsin, and bile acids) to reflux into the distal esophagus. The LES is a physiologic sphincter rather than a true anatomic sphincter; its tone is maintained by smooth muscle contraction and is influenced by hormones, medications, food substances, and body position. Transient LES relaxations (TLESRs), which are inappropriate sphincter relaxations not associated with swallowing, are the primary mechanism of reflux in most patients. Hiatal hernia, in which the proximal stomach herniates through the diaphragmatic hiatus into the thorax, further compromises LES function and promotes reflux. When gastric acid and bile repeatedly contact the squamous epithelium of the distal esophagus, the cells are damaged and an inflammatory response (reflux esophagitis) develops. Over years of chronic inflammation, the esophageal stem cells at the base of the epithelium are reprogrammed through altered gene expression (specifically upregulation of CDX2, a transcription factor for intestinal differentiation). Instead of regenerating squamous epithelium, these stem cells differentiate into columnar epithelium with goblet cells -- the hallmark of intestinal metaplasia. This metaplastic columnar epithelium is more resistant to acid injury than squamous epithelium, representing an adaptive but pathologic response. Barrett esophagus is clinically significant because it is the only known precursor to esophageal adenocarcinoma, which has a poor prognosis (5-year survival approximately 20%). The metaplasia-dysplasia-carcinoma sequence proceeds through identifiable stages: nondysplastic Barrett (0.5% annual risk of cancer), low-grade dysplasia (1-1.5% annual risk), high-grade dysplasia (6-19% annual risk), and invasive adenocarcinoma. Barrett esophagus is found in approximately 10-15% of patients undergoing endoscopy for GERD symptoms. Risk factors include male sex (8:1 male to female ratio for esophageal adenocarcinoma), Caucasian race, age above 50, chronic GERD symptoms of 5 or more years duration, central obesity (increased intra-abdominal pressure promotes reflux), tobacco use (damages mucosal defenses), and family history of Barrett or esophageal adenocarcinoma. Protective factors include Helicobacter pylori infection (paradoxically protective because it reduces gastric acid output through atrophic gastritis), high dietary fiber intake, and frequent NSAID/aspirin use (anti-inflammatory and possible anti-proliferative effects). The practical nurse plays an important role in reinforcing the importance of endoscopic surveillance, medication adherence, and lifestyle modifications that reduce reflux and potentially decrease the risk of dysplastic progression."
    },
    riskFactors: [
      "Chronic gastroesophageal reflux disease (GERD) of 5 or more years duration (the primary and essential risk factor)",
      "Male sex (Barrett esophagus and esophageal adenocarcinoma are 2-3 times more common in males; adenocarcinoma has an 8:1 male-to-female ratio)",
      "Age above 50 years (risk increases with duration of reflux exposure)",
      "Caucasian race (significantly higher prevalence compared to African American, Asian, and Hispanic populations)",
      "Central (truncal) obesity: increases intra-abdominal pressure, promotes gastroesophageal reflux, and is independently associated with Barrett through metabolic and inflammatory mechanisms",
      "Tobacco use (damages esophageal mucosal defenses, reduces LES pressure, and increases acid reflux)",
      "Family history of Barrett esophagus or esophageal adenocarcinoma in a first-degree relative (genetic predisposition with 7-10 times increased risk)"
    ],
    diagnostics: [
      "Upper endoscopy (esophagogastroduodenoscopy/EGD) with biopsy: the GOLD STANDARD for diagnosis; visually identifies salmon-colored columnar mucosa extending above the gastroesophageal junction (replacing normal pale squamous mucosa); systematic four-quadrant biopsies taken every 1-2 cm (Seattle protocol)",
      "Histopathologic examination: confirms intestinal metaplasia by identifying goblet cells in biopsied tissue; pathologist grades dysplasia as none, indefinite, low-grade, or high-grade",
      "Surveillance endoscopy schedule: nondysplastic Barrett -- repeat EGD every 3-5 years; low-grade dysplasia -- repeat every 6-12 months; high-grade dysplasia -- intervention (endoscopic eradication therapy) or repeat every 3 months",
      "Esophageal pH monitoring (24-hour or 48-hour): measures acid exposure time in the distal esophagus; confirms pathologic reflux if DeMeester score above 14.7 or percent time pH below 4 exceeds 4.2%; useful when GERD diagnosis is uncertain",
      "High-resolution esophageal manometry: measures LES pressure and esophageal peristalsis; identifies motility disorders that contribute to reflux; LES resting pressure below 10 mmHg is associated with significant reflux",
      "CT scan or endoscopic ultrasound (EUS): used for staging if high-grade dysplasia or adenocarcinoma is detected; assesses depth of invasion and lymph node involvement"
    ],
    management: [
      "Aggressive acid suppression with proton pump inhibitor (PPI) therapy: high-dose PPI (pantoprazole 40 mg twice daily or equivalent) is the cornerstone of medical management; reduces acid exposure, may promote partial regression of metaplasia, and reduces inflammation",
      "Endoscopic surveillance: regular endoscopy with systematic biopsies at intervals determined by dysplasia grade; patients must understand that Barrett without surveillance carries a risk of undetected cancer progression",
      "Endoscopic eradication therapy for dysplastic Barrett: radiofrequency ablation (RFA) is first-line for flat dysplasia; endoscopic mucosal resection (EMR) for visible lesions or nodular Barrett; complete eradication of intestinal metaplasia (CE-IM) is the treatment goal",
      "Lifestyle modifications to reduce GERD: elevate head of bed 6-8 inches (gravity prevents reflux), avoid eating 2-3 hours before bedtime, weight loss if overweight or obese, avoid trigger foods (caffeine, chocolate, alcohol, fatty foods, citrus, tomato products, spicy foods)",
      "Smoking cessation: tobacco reduces LES pressure, increases acid reflux, damages mucosal defenses, and is an independent risk factor for progression to adenocarcinoma",
      "Surgical referral: Nissen fundoplication may be considered for patients who cannot tolerate PPI therapy or have large hiatal hernias; esophagectomy for confirmed invasive adenocarcinoma",
      "Patient education: Barrett esophagus is a chronic condition requiring lifelong surveillance; missing surveillance endoscopies increases the risk of undetected dysplastic progression; adherence to PPI therapy and lifestyle modifications is essential"
    ],
    nursingActions: [
      "Reinforce the importance of PPI medication adherence: take 30-60 minutes before the first meal of the day on an empty stomach for optimal acid suppression; do not crush or chew enteric-coated formulations",
      "Educate patient on GERD lifestyle modifications: elevate head of bed (not just extra pillows -- elevate the entire head of the bed frame), avoid lying down within 2-3 hours of eating, identify and avoid personal trigger foods",
      "Prepare patient for endoscopy procedures: confirm NPO status for 6-8 hours, review consent, ensure IV access for sedation, provide post-procedure instructions (no driving for 24 hours after sedation, sore throat is expected, report bleeding or severe pain)",
      "Monitor for alarm symptoms that require urgent referral: progressive dysphagia (difficulty swallowing), odynophagia (painful swallowing), unintentional weight loss, iron-deficiency anemia, hematemesis or melena -- these may indicate stricture, ulceration, or malignant transformation",
      "Document patient's GERD symptom frequency, severity, and response to treatment; use standardized symptom questionnaires (GERD-Q) when available",
      "Reinforce smoking cessation resources and strategies: tobacco use accelerates disease progression and reduces the effectiveness of PPI therapy",
      "Monitor for long-term PPI side effects: discuss with physician if patient reports bone pain (osteoporosis risk), diarrhea (Clostridioides difficile risk), or fatigue (possible B12 or magnesium deficiency)"
    ],
    assessmentFindings: [
      "Chronic heartburn (pyrosis): burning retrosternal pain that worsens after meals, with bending, or when lying down; the most common GERD symptom but may decrease in Barrett (metaplastic tissue is less pain-sensitive than squamous epithelium)",
      "Dysphagia (difficulty swallowing): may indicate esophageal stricture from chronic inflammation or, more concerning, a mass from adenocarcinoma -- always report new-onset dysphagia",
      "Regurgitation: backflow of sour or bitter-tasting gastric contents into the throat or mouth, especially when lying flat or bending forward",
      "Chronic cough, hoarseness, or laryngitis: extra-esophageal manifestations of GERD caused by microaspiration of gastric contents or vagal nerve-mediated reflex bronchospasm",
      "Epigastric or substernal discomfort: may be constant or intermittent; distinguish from cardiac chest pain (GERD pain typically burns, worsens with food, improves with antacids; cardiac pain is pressure-like, radiates to jaw or arm, associated with exertion)",
      "Dental erosion: loss of tooth enamel on the lingual surfaces from chronic acid exposure in the oral cavity",
      "Unintentional weight loss: a RED FLAG that may indicate progression to esophageal adenocarcinoma or severe dysphagia limiting oral intake"
    ],
    signs: {
      left: [
        "Intermittent heartburn controlled with PPI therapy",
        "Occasional regurgitation, especially after large meals",
        "Mild epigastric discomfort",
        "Chronic dry cough or throat clearing (extra-esophageal GERD)",
        "Endoscopy showing nondysplastic Barrett with stable segment length",
        "Stable weight and normal appetite"
      ],
      right: [
        "Progressive dysphagia (difficulty swallowing solids, then liquids) suggesting stricture or malignancy",
        "Odynophagia (painful swallowing) suggesting ulceration or erosive disease",
        "Unintentional weight loss of more than 5% body weight (possible malignant transformation)",
        "Hematemesis (vomiting blood) or melena (black tarry stools) indicating GI bleeding",
        "Iron-deficiency anemia of unknown origin (occult blood loss from ulceration or malignancy)",
        "Endoscopy revealing high-grade dysplasia or visible mass (immediate intervention required)"
      ]
    },
    medications: [
      {
        name: "Pantoprazole (Pantoloc/Protonix)",
        type: "Proton pump inhibitor (PPI)",
        action: "Irreversibly binds to and inhibits the hydrogen-potassium ATPase enzyme system (proton pump) on the apical surface of gastric parietal cells. This blocks the final common pathway of hydrochloric acid secretion, reducing gastric acid output by up to 90-95%. By raising intragastric pH, PPIs reduce the volume and acidity of refluxate reaching the esophageal mucosa, allowing healing of esophagitis and reducing the chemical stimulus that drives metaplastic transformation.",
        sideEffects: "Headache, nausea, diarrhea, abdominal pain; long-term use (beyond 1 year): vitamin B12 deficiency (reduced intrinsic factor activation), hypomagnesemia (can cause arrhythmias, tetany), increased fracture risk (reduced calcium absorption), Clostridioides difficile infection (loss of gastric acid barrier), fundic gland polyps (benign)",
        contra: "Known hypersensitivity to PPIs or benzimidazoles; concurrent use with rilpivirine or atazanavir (PPIs reduce absorption of these antiretroviral drugs); caution with clopidogrel (some PPIs may reduce antiplatelet effect through CYP2C19 inhibition -- pantoprazole has the least interaction)",
        pearl: "For Barrett esophagus, PPIs should be taken TWICE daily (morning and evening, 30-60 minutes before meals) for maximum acid suppression. The goal is to keep esophageal pH above 4 for as long as possible during the 24-hour period. Long-term PPI use requires periodic monitoring of magnesium, B12, and bone density. Do not discontinue abruptly -- taper gradually to avoid rebound acid hypersecretion."
      },
      {
        name: "Sucralfate (Carafate/Sulcrate)",
        type: "Mucosal protectant / cytoprotective agent",
        action: "In the acidic environment of the stomach and esophagus (pH below 4), sucralfate polymerizes and cross-links to form a viscous, sticky paste that selectively binds to ulcerated or inflamed mucosal surfaces. This paste forms a physical protective barrier over the damaged epithelium, preventing further contact with acid, pepsin, and bile salts. Sucralfate also stimulates local prostaglandin E2 synthesis (which promotes mucosal blood flow and bicarbonate secretion), increases mucus production, and binds epidermal growth factor (EGF) to the ulcer site to promote epithelial regeneration.",
        sideEffects: "Constipation (most common, due to aluminum content), dry mouth, nausea, gastric bezoar formation (rare, with concurrent gastroparesis), aluminum absorption (minimal but monitor in renal impairment)",
        contra: "Severe renal impairment (risk of aluminum accumulation and toxicity); dysphagia or GI obstruction (tablet may lodge in the esophagus); concurrent use with fluoroquinolones, phenytoin, digoxin, or warfarin (sucralfate binds these drugs in the GI tract and reduces their absorption -- separate by 2 hours)",
        pearl: "Sucralfate must be taken on an EMPTY stomach (1 hour before meals or 2 hours after meals) for optimal binding to damaged mucosa. It requires an acidic environment to activate, so avoid taking it with PPIs simultaneously -- stagger dosing by at least 30 minutes. Sucralfate does NOT reduce acid production; it only provides a physical barrier. It is used as adjunctive therapy to PPIs, not as monotherapy for Barrett esophagus."
      },
      {
        name: "Metoclopramide (Reglan/Maxeran)",
        type: "Prokinetic agent / dopamine D2 receptor antagonist / antiemetic",
        action: "Blocks dopamine D2 receptors in the chemoreceptor trigger zone (antiemetic effect) and enhances acetylcholine release from myenteric neurons in the upper GI tract (prokinetic effect). The prokinetic action increases LES tone (reducing reflux), accelerates gastric emptying, and improves antroduodenal coordination. By reducing gastric volume and increasing LES pressure, metoclopramide decreases the volume of refluxate available to reach the esophagus.",
        sideEffects: "Drowsiness, restlessness, fatigue, diarrhea; extrapyramidal symptoms (acute dystonia, akathisia, parkinsonism) from central dopamine blockade; tardive dyskinesia (involuntary facial movements -- may be IRREVERSIBLE with long-term use); hyperprolactinemia (galactorrhea, gynecomastia, menstrual irregularities)",
        contra: "GI obstruction, perforation, or hemorrhage; pheochromocytoma (may cause hypertensive crisis); epilepsy/seizure disorder (lowers seizure threshold); concurrent use with other dopamine antagonists; Parkinson disease (worsens dopaminergic deficiency)",
        pearl: "Use for the SHORTEST duration possible -- FDA black box warning limits use to a maximum of 12 weeks due to risk of tardive dyskinesia. Monitor for involuntary lip smacking, tongue protrusion, or facial grimacing at EVERY visit -- discontinue immediately if these develop as tardive dyskinesia may be irreversible. Administer 30 minutes before meals and at bedtime. Metoclopramide is adjunctive therapy for GERD/Barrett when PPI alone provides inadequate symptom relief."
      }
    ],
    pearls: [
      "Barrett esophagus is defined by the presence of GOBLET CELLS on biopsy (intestinal metaplasia) -- endoscopic visual appearance alone is insufficient for diagnosis. The salmon-colored mucosa must be confirmed histologically.",
      "Barrett esophagus is the ONLY known precursor to esophageal adenocarcinoma -- the risk of cancer increases with the degree of dysplasia: no dysplasia (0.5%/year), low-grade dysplasia (1%/year), high-grade dysplasia (6-19%/year)",
      "PPIs should be taken 30-60 minutes BEFORE meals on an empty stomach -- taking them with or after food reduces their effectiveness by up to 50% because the proton pumps are most active during meal-stimulated acid secretion",
      "New-onset dysphagia in a patient with known Barrett esophagus is a RED FLAG for stricture formation or malignant transformation -- this finding requires urgent endoscopic evaluation and should never be dismissed",
      "The surveillance interval for nondysplastic Barrett is every 3-5 years -- patients must understand that Barrett is a LIFELONG condition requiring periodic monitoring even when they feel asymptomatic",
      "Long-term PPI use requires monitoring for vitamin B12 deficiency (fatigue, neuropathy), hypomagnesemia (muscle cramps, arrhythmias), and bone health (fracture risk) -- discuss annual screening with the healthcare team",
      "Lifestyle modifications are ADJUNCTIVE to PPI therapy, not a replacement: elevate the head of the bed 6-8 inches (blocks use gravity to prevent nocturnal reflux), maintain healthy weight, avoid eating 2-3 hours before bed, eliminate tobacco use"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient newly diagnosed with Barrett esophagus after endoscopy with biopsy. The patient asks what Barrett esophagus means. Which response by the nurse is most accurate?",
        options: [
          "Barrett esophagus means you have esophageal cancer and will need surgery",
          "Barrett esophagus means the cells in your lower esophagus have changed from long-term acid reflux, and it needs to be monitored regularly because it can increase cancer risk over time",
          "Barrett esophagus is a temporary condition that will resolve once you take your medication",
          "Barrett esophagus means your esophagus is narrowed and you will have difficulty swallowing"
        ],
        correct: 1,
        rationale: "Barrett esophagus is intestinal metaplasia of the distal esophageal epithelium caused by chronic GERD. It is a premalignant condition that increases the risk of esophageal adenocarcinoma, but it is NOT cancer itself. It requires regular endoscopic surveillance to detect dysplastic progression early. It is a chronic, not temporary, condition. While strictures can occur in GERD, Barrett specifically refers to the cellular transformation."
      },
      {
        question: "A patient with Barrett esophagus tells the practical nurse that they take their pantoprazole with breakfast every morning. What education should the nurse provide?",
        options: [
          "Continue taking it with breakfast -- food helps absorption",
          "Take pantoprazole 30-60 minutes BEFORE breakfast on an empty stomach for best acid suppression",
          "Take pantoprazole at bedtime instead of in the morning",
          "Pantoprazole can be taken at any time without regard to food"
        ],
        correct: 1,
        rationale: "PPIs must be taken 30-60 minutes before the first meal of the day on an empty stomach. PPIs work by irreversibly binding to active proton pumps, and the pumps are most actively stimulated during meals. Taking the PPI before eating ensures that the drug is absorbed and circulating when the proton pumps are activated by food, providing maximum acid suppression. Taking it with food reduces effectiveness by up to 50%."
      },
      {
        question: "A patient with a 10-year history of Barrett esophagus reports to the practical nurse that they have developed progressive difficulty swallowing solid foods over the past 3 weeks and have lost 4 kg unintentionally. What should the nurse do?",
        options: [
          "Recommend eating softer foods and increasing fluid intake with meals",
          "Advise the patient to increase their PPI dose and follow up in 1 month",
          "Report these findings immediately as they are alarm symptoms requiring urgent endoscopic evaluation",
          "Reassure the patient that mild swallowing difficulty is common with Barrett esophagus"
        ],
        correct: 2,
        rationale: "Progressive dysphagia (difficulty swallowing solids) combined with unintentional weight loss in a patient with Barrett esophagus are alarm symptoms that may indicate stricture formation, dysplastic progression, or esophageal adenocarcinoma. These findings require urgent reporting and referral for endoscopic evaluation. Delaying evaluation, adjusting medication without investigation, or reassuring the patient without further workup could allow a potentially treatable malignancy to advance."
      }
    ]
  }
};

let count = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) count++;
}
console.log(`\nDone: ${count}/${Object.keys(lessons).length} lessons injected.`);
