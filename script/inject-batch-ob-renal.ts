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
  "placental-abruption-basics-rpn": {
    title: "Placental Abruption for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Placental Abruption",
      content: "Placental abruption (abruptio placentae) is the premature separation of a normally implanted placenta from the uterine wall before delivery. The placenta normally attaches to the upper segment of the uterus and serves as the interface for oxygen, nutrient, and waste exchange between maternal and fetal circulations. During normal pregnancy, spiral arteries in the decidua basalis are remodeled to provide high-volume, low-resistance blood flow to the intervillous space. In placental abruption, rupture of maternal decidual arteries initiates bleeding at the decidual-placental interface, forming a retroplacental hematoma that progressively separates the placenta from the uterine wall. This separation disrupts the exchange surface area, compromising fetal oxygenation and nutrition in proportion to the percentage of placenta that detaches. Abruption is classified by the pattern of hemorrhage: revealed (external, visible vaginal bleeding occurs when blood dissects between the membranes and escapes through the cervical os, accounting for approximately 80 percent of cases), concealed (blood is trapped behind the placenta with no external bleeding, accounting for approximately 20 percent of cases and considered more dangerous because the degree of hemorrhage is underestimated), and mixed (combination of both). The severity is graded from mild (Grade 1, less than 25 percent separation with minimal bleeding), to moderate (Grade 2, 25 to 50 percent separation with fetal distress), to severe (Grade 3, greater than 50 percent separation with fetal demise and maternal coagulopathy). Couvelaire uterus (uteroplacental apoplexy) is a serious complication in which blood infiltrates the myometrium, causing a dark, purplish, boggy uterus that cannot contract effectively, leading to uterine atony and uncontrolled postpartum hemorrhage. Disseminated intravascular coagulation (DIC) is a life-threatening complication that develops when tissue thromboplastin from the damaged placenta enters the maternal circulation, triggering widespread activation of the clotting cascade. This consumes clotting factors and platelets faster than they can be replaced, resulting in paradoxical hemorrhage from multiple sites despite the initial clot formation. The practical nurse must recognize that placental abruption is an obstetric emergency requiring continuous fetal monitoring, large-bore IV access, and immediate notification of the physician because maternal and fetal mortality increase significantly with delayed intervention."
    },
    riskFactors: [
      "Hypertensive disorders of pregnancy (chronic hypertension, preeclampsia, HELLP syndrome -- strongest associated risk factor)",
      "Previous placental abruption (recurrence risk increases 5 to 15 percent with each prior episode)",
      "Maternal trauma (motor vehicle accident, physical abuse, falls -- accounts for significant percentage of abruptions)",
      "Cocaine or methamphetamine use (causes acute vasospasm and hypertension, leading to vessel rupture in the decidua)",
      "Cigarette smoking (damages uteroplacental blood vessels, leading to decidual necrosis and susceptibility to hemorrhage)",
      "Premature rupture of membranes (rapid decompression of the uterus can cause mechanical shearing of the placenta)",
      "Advanced maternal age (greater than 35 years), multiparity (grand multiparity increases risk), and short umbilical cord"
    ],
    diagnostics: [
      "Transabdominal ultrasound: may identify retroplacental hematoma as a hyperechoic collection behind the placenta, though sensitivity is only 25 to 50 percent; absence of ultrasound findings does NOT rule out abruption",
      "Continuous electronic fetal monitoring (EFM): assess for fetal distress including late decelerations, decreased variability, tachycardia, or sinusoidal pattern; monitoring is more sensitive than ultrasound for detecting fetal compromise",
      "Complete blood count (CBC): monitor hemoglobin and hematocrit trends (may be falsely normal initially due to hemoconcentration); platelet count decreases in DIC",
      "Coagulation panel (PT, PTT, INR, fibrinogen, D-dimer): fibrinogen less than 200 mg/dL is concerning for DIC; less than 100 mg/dL is critical; D-dimer is elevated but less specific in pregnancy",
      "Kleihauer-Betke test: detects fetal red blood cells in maternal circulation, indicating fetomaternal hemorrhage; used to calculate Rho(D) immune globulin dose in Rh-negative mothers",
      "Type and crossmatch: essential for potential massive transfusion; order at least 4 units of packed red blood cells in severe abruption"
    ],
    management: [
      "Establish two large-bore IV lines (16 or 18 gauge) immediately for rapid volume resuscitation with crystalloid solution (normal saline or lactated Ringer)",
      "Maintain continuous electronic fetal monitoring to detect signs of fetal distress; notify the physician of any non-reassuring fetal heart rate pattern",
      "Administer oxygen via non-rebreather mask at 10 to 15 L/min to maximize maternal and fetal oxygenation",
      "Position patient in left lateral position to prevent aortocaval compression and maximize uteroplacental blood flow",
      "Prepare for emergency cesarean delivery if fetal distress is present or maternal hemodynamic status is deteriorating",
      "Monitor intake and output strictly with an indwelling urinary catheter; urine output less than 30 mL/hour indicates inadequate renal perfusion",
      "Administer blood products as ordered (packed RBCs, fresh frozen plasma, cryoprecipitate, platelets) for massive hemorrhage or DIC"
    ],
    nursingActions: [
      "Perform continuous assessment of vaginal bleeding: note color (dark red/port wine suggests retroplacental origin), amount (weigh pads: 1 gram equals approximately 1 mL blood), and presence of clots",
      "Assess uterine tone by palpation: a rigid, tender (board-like) uterus that does not relax between contractions is characteristic of significant abruption with concealed hemorrhage",
      "Monitor vital signs every 5 to 15 minutes in acute abruption; tachycardia is often the earliest sign of hemorrhagic shock before blood pressure decreases",
      "Report immediately: sudden onset of severe abdominal pain, rigid uterus, fetal heart rate abnormalities, signs of hypovolemic shock (tachycardia, hypotension, cool clammy skin)",
      "Avoid performing digital cervical examinations until placenta previa has been definitively ruled out by ultrasound",
      "Document fetal heart rate patterns, uterine activity, bleeding characteristics, vital signs, and all interventions with precise timing",
      "Provide emotional support to the patient and family during this obstetric emergency; explain procedures and keep them informed of the clinical status"
    ],
    assessmentFindings: [
      "Sudden onset of severe abdominal pain or back pain, often described as tearing or knife-like (in contrast to placenta previa which is painless)",
      "Dark red or port wine colored vaginal bleeding (revealed abruption); NOTE: absence of visible bleeding does not rule out abruption (concealed type)",
      "Uterine hypertonicity: board-like rigid uterus that does not relax, extremely tender to palpation, fundal height may increase if blood is trapped",
      "Signs of fetal distress on EFM: late decelerations, decreased beat-to-beat variability, fetal tachycardia, or absent fetal heart tones in severe abruption",
      "Signs of hypovolemic shock: maternal tachycardia (often first sign), hypotension, pallor, diaphoresis, altered level of consciousness, oliguria",
      "Increased uterine size over baseline measurements indicating concealed hemorrhage (measure fundal height serially)",
      "Evidence of DIC: oozing from IV sites, petechiae, ecchymoses, hematuria, bleeding gums, prolonged bleeding from puncture sites"
    ],
    signs: {
      left: [
        "Mild abdominal tenderness or cramping",
        "Small amount of dark vaginal bleeding",
        "Uterine irritability with frequent mild contractions",
        "Fetal heart rate within normal limits with occasional variable decelerations",
        "Stable maternal vital signs",
        "Mild anxiety and restlessness"
      ],
      right: [
        "Severe constant abdominal pain with rigid board-like uterus",
        "Absent fetal heart tones or persistent late decelerations",
        "Signs of hypovolemic shock (tachycardia, hypotension, pallor, diaphoresis)",
        "Rapidly increasing fundal height (concealed hemorrhage)",
        "Evidence of DIC (oozing from IV sites, petechiae, bleeding from mucous membranes)",
        "Maternal loss of consciousness or altered mental status"
      ]
    },
    medications: [
      {
        name: "Oxytocin (Pitocin)",
        type: "Uterotonic agent (synthetic posterior pituitary hormone)",
        action: "Binds to oxytocin receptors on uterine myometrial cells, increasing intracellular calcium release and stimulating rhythmic uterine contractions. After delivery, continuous low-dose infusion maintains uterine tone to compress bleeding vessels at the placental site and prevent postpartum hemorrhage.",
        sideEffects: "Uterine hyperstimulation (tachysystole, tetanic contractions), water intoxication with hyponatremia (antidiuretic effect at high doses), hypotension with rapid IV bolus, nausea, vomiting",
        contra: "Active placenta previa, vasa previa, or cord prolapse where vaginal delivery is contraindicated; prior classical uterine incision; active genital herpes; cephalopelvic disproportion",
        pearl: "In abruption, oxytocin is used AFTER delivery to maintain uterine tone and prevent postpartum hemorrhage; always administered via infusion pump with continuous fetal monitoring during labor; never given as undiluted IV push"
      },
      {
        name: "Rho(D) Immune Globulin (RhoGAM/WinRho)",
        type: "Immune globulin (anti-D antibody preparation)",
        action: "Contains preformed anti-D immunoglobulin that binds to Rh-positive fetal red blood cells that have entered the Rh-negative maternal circulation during fetomaternal hemorrhage, preventing maternal immune sensitization (isoimmunization) and formation of anti-D antibodies that would attack fetal red blood cells in subsequent pregnancies.",
        sideEffects: "Injection site pain or tenderness, low-grade fever, mild myalgia, lethargy, rarely allergic reaction",
        contra: "Rh-positive mother (unnecessary); prior sensitization with existing anti-D antibodies (too late for prevention); known anaphylactic reaction to human immune globulin products",
        pearl: "Administer within 72 hours of any potential fetomaternal hemorrhage event; standard dose covers up to 30 mL of fetal whole blood; if Kleihauer-Betke test indicates larger fetomaternal hemorrhage, additional doses are calculated; verify Rh status before administration"
      },
      {
        name: "Normal Saline (0.9% Sodium Chloride)",
        type: "Isotonic crystalloid solution for volume resuscitation",
        action: "Provides isotonic fluid that expands intravascular volume without causing fluid shifts between compartments. The sodium and chloride concentrations approximate plasma, maintaining osmotic balance while replacing circulating volume lost through hemorrhage. Rapid infusion restores preload, cardiac output, and tissue perfusion.",
        sideEffects: "Hyperchloremic metabolic acidosis with large volumes (excess chloride displaces bicarbonate), fluid overload (pulmonary edema, peripheral edema), dilutional coagulopathy with massive resuscitation, hypernatremia",
        contra: "Caution in heart failure (volume overload risk); significant hypernatremia; use balanced crystalloids (lactated Ringer) when large volumes anticipated to avoid hyperchloremic acidosis",
        pearl: "In hemorrhagic shock from abruption, rapid infusion through large-bore IV (16-18 gauge) is the first-line intervention while awaiting blood products; use pressure bags or rapid infusers for life-threatening hemorrhage; warm fluids to prevent hypothermia which worsens coagulopathy"
      }
    ],
    pearls: [
      "Placental abruption is painful with dark red bleeding; placenta previa is PAINLESS with bright red bleeding -- this clinical distinction is critical for rapid differentiation in the acute setting",
      "A rigid, board-like uterus is the hallmark physical finding of significant placental abruption -- if you palpate this, notify the physician IMMEDIATELY as it indicates substantial concealed hemorrhage",
      "Concealed abruption (no visible bleeding) is MORE dangerous than revealed abruption because the degree of hemorrhage is underestimated -- always monitor for signs of shock even without visible bleeding",
      "Couvelaire uterus occurs when blood infiltrates the myometrium, producing a dark purple uterus that cannot contract -- this leads to uterine atony and may require hysterectomy to control hemorrhage",
      "DIC is a life-threatening complication of severe abruption: watch for oozing from IV sites, petechiae, and falling fibrinogen levels (less than 200 mg/dL is concerning, less than 100 mg/dL is critical)",
      "Tachycardia is often the FIRST sign of maternal hemorrhagic shock -- blood pressure may remain normal initially due to compensatory vasoconstriction; do not wait for hypotension to act",
      "Always perform the Kleihauer-Betke test in Rh-negative mothers after abruption to quantify fetomaternal hemorrhage and calculate the appropriate dose of Rho(D) immune globulin"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a 32-week pregnant patient who presents with sudden onset of severe abdominal pain and dark red vaginal bleeding. On palpation, the uterus feels rigid and board-like. Which condition does this presentation most strongly suggest?",
        options: [
          "Placenta previa",
          "Placental abruption",
          "Uterine rupture",
          "Preterm labor"
        ],
        correct: 1,
        rationale: "Placental abruption characteristically presents with sudden severe abdominal pain, dark red vaginal bleeding, and a rigid (board-like) tender uterus. Placenta previa presents with painless bright red bleeding and a soft, nontender uterus. The combination of pain plus rigid uterus is the hallmark of abruption."
      },
      {
        question: "A patient with suspected placental abruption has no visible vaginal bleeding, but the practical nurse notes increasing fundal height measurements over the past hour. What does this finding suggest?",
        options: [
          "Normal fetal growth acceleration",
          "Polyhydramnios development",
          "Concealed retroplacental hemorrhage",
          "Bladder distension"
        ],
        correct: 2,
        rationale: "Increasing fundal height without visible vaginal bleeding is characteristic of concealed placental abruption, where blood accumulates behind the placenta and within the uterine cavity. This type is more dangerous because the severity of hemorrhage is underestimated. The practical nurse should report this finding immediately."
      },
      {
        question: "A practical nurse observes oozing from the IV insertion site and fresh petechiae on the chest of a patient with severe placental abruption. Which complication should the nurse suspect and report immediately?",
        options: [
          "Allergic reaction to IV fluids",
          "Disseminated intravascular coagulation (DIC)",
          "Heparin-induced thrombocytopenia",
          "Gestational thrombocytopenia"
        ],
        correct: 1,
        rationale: "Oozing from IV sites, petechiae, and bleeding from multiple sites are classic signs of disseminated intravascular coagulation (DIC), a life-threatening complication of severe placental abruption. Tissue thromboplastin from the damaged placenta triggers widespread clotting that consumes clotting factors and platelets, paradoxically causing hemorrhage."
      }
    ]
  },

  "placenta-previa-basics-rpn": {
    title: "Placenta Previa for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Placenta Previa",
      content: "Placenta previa is a condition in which the placenta implants in the lower uterine segment, partially or completely covering the internal cervical os. During normal pregnancy, the blastocyst implants in the upper segment (fundus) of the uterus where the myometrium is thickest and blood supply is most abundant. In placenta previa, implantation occurs in the lower uterine segment, which thins and stretches progressively during the second and third trimesters. As the lower uterine segment develops and the cervix begins to efface and dilate in preparation for labor, the placental attachment site is mechanically disrupted, causing bleeding from exposed maternal sinuses. Placenta previa is classified by the relationship of the placental edge to the internal cervical os: low-lying placenta (placental edge is within 2 centimeters of the internal os but does not cover it), marginal previa (placental edge reaches the internal os margin but does not cross it), partial previa (placenta partially covers the internal os), and complete previa (placenta entirely covers the internal os). The lower uterine segment contains fewer muscle fibers than the fundus, which means the exposed vessels at the placental site cannot be effectively compressed by myometrial contraction after separation, making hemorrhage more difficult to control. The hallmark clinical presentation is painless, bright red vaginal bleeding, most commonly occurring in the late second or third trimester. The bleeding is painless because the placental separation is caused by the mechanical stretching of the lower uterine segment rather than by the painful retroplacental hematoma formation seen in abruption. A critically important clinical rule is that digital cervical examination must NEVER be performed when placenta previa has not been ruled out, because a finger through the cervix can puncture the placenta and cause catastrophic hemorrhage. Diagnosis is confirmed by transabdominal ultrasound, which can accurately localize the placenta relative to the internal cervical os. Some cases of low-lying placenta identified on second-trimester ultrasound may resolve by the third trimester as the lower uterine segment develops (placental migration), but complete previa rarely resolves. Vasa previa, a related but distinct condition in which fetal blood vessels cross the internal cervical os unsupported by placental tissue or umbilical cord, carries extremely high fetal mortality if ruptured and should be distinguished from placenta previa."
    },
    riskFactors: [
      "Previous cesarean delivery (scarred uterus alters implantation patterns; risk increases with each subsequent cesarean section)",
      "Previous placenta previa (recurrence rate approximately 4 to 8 percent in subsequent pregnancies)",
      "Multiple gestation (twins, triplets -- larger placental surface area increases probability of lower segment coverage)",
      "Grand multiparity (repeated pregnancies cause endometrial changes that predispose to abnormal implantation)",
      "Advanced maternal age (greater than 35 years increases risk due to age-related endometrial changes)",
      "Prior uterine surgery or procedures (myomectomy, dilation and curettage, endometrial ablation alter the uterine lining)",
      "Cigarette smoking (causes compensatory placental enlargement due to hypoxia, increasing the likelihood of reaching the lower segment)"
    ],
    diagnostics: [
      "Transabdominal ultrasound: primary diagnostic tool to confirm placental location relative to the internal cervical os; accuracy exceeds 95 percent in third trimester",
      "Transvaginal ultrasound: provides more precise measurement of the distance between placental edge and internal os; safe when performed by trained sonographer (probe does not enter the cervix)",
      "Complete blood count (CBC): baseline hemoglobin/hematocrit to assess degree of blood loss; serial measurements to track ongoing hemorrhage",
      "Type and crossmatch: essential for all patients with placenta previa; ensure blood products are available for potential massive transfusion",
      "Coagulation studies (PT, PTT, fibrinogen): baseline assessment; DIC is less common in previa than abruption but can occur with massive hemorrhage",
      "Fetal non-stress test (NST) or biophysical profile (BPP): assess fetal well-being after any bleeding episode"
    ],
    management: [
      "Absolute pelvic rest: no vaginal examinations, no intercourse, no tampons, no douching -- any cervical manipulation can precipitate hemorrhage",
      "Bedrest or activity restriction as prescribed; hospitalization for active or recurrent bleeding episodes",
      "Administer betamethasone if preterm delivery is anticipated (between 24-34 weeks gestation) to promote fetal lung maturity",
      "Establish IV access with large-bore catheter and maintain with isotonic crystalloid solution; keep type and crossmatch current",
      "Planned cesarean delivery: scheduled at 36 to 37 weeks gestation for complete previa (or sooner if hemorrhage is uncontrolled)",
      "Monitor fetal heart rate continuously during active bleeding episodes; report any non-reassuring patterns immediately",
      "Prepare for potential emergency cesarean delivery at any time; ensure operating room team is notified of the diagnosis"
    ],
    nursingActions: [
      "NEVER perform digital cervical examination until placenta previa has been ruled out by ultrasound -- a finger through the cervix can cause life-threatening hemorrhage by disrupting the placenta",
      "Assess and document all vaginal bleeding: amount (count and weigh pads), color (bright red is typical of previa), presence of clots, and associated symptoms",
      "Monitor maternal vital signs every 15 minutes during active bleeding; tachycardia may precede hypotension in hemorrhagic shock",
      "Maintain continuous electronic fetal monitoring during any bleeding episode; report fetal heart rate abnormalities immediately",
      "Position patient in left lateral position to optimize uteroplacental blood flow and prevent aortocaval compression",
      "Educate the patient on activity restrictions, pelvic rest, and when to seek emergency care (any vaginal bleeding, contractions, decreased fetal movement)",
      "Maintain strict intake and output records; insert indwelling urinary catheter as ordered for accurate measurement"
    ],
    assessmentFindings: [
      "Painless, bright red vaginal bleeding (hallmark finding): typically occurs after 28 weeks gestation, often without warning or provocation",
      "Soft, nontender, relaxed uterus on palpation (in contrast to the rigid, painful uterus of placental abruption)",
      "Fetal malpresentation (breech, transverse lie) due to the placenta occupying the lower uterine segment and preventing the fetal head from engaging",
      "High-presenting fetal part: the fetus cannot descend into the pelvis because the placenta blocks the pelvic inlet",
      "Recurrent bleeding episodes: first episode (sentinel bleed) may be self-limiting, but subsequent episodes often become progressively heavier",
      "Normal fetal heart rate pattern in mild to moderate bleeding; fetal distress may develop only with massive maternal hemorrhage",
      "Maternal hemodynamic stability in early or mild cases; tachycardia, hypotension, and pallor indicate significant blood loss"
    ],
    signs: {
      left: [
        "Small amount of painless bright red vaginal bleeding",
        "Soft, nontender uterus",
        "Stable maternal vital signs",
        "Reassuring fetal heart rate pattern",
        "Mild anxiety related to bleeding",
        "Hemoglobin stable near baseline"
      ],
      right: [
        "Profuse bright red vaginal bleeding soaking pads continuously",
        "Maternal tachycardia and hypotension (hemorrhagic shock)",
        "Fetal tachycardia or late decelerations on monitoring",
        "Falling hemoglobin/hematocrit on serial labs",
        "Maternal pallor, diaphoresis, altered consciousness",
        "Coagulopathy signs (oozing from sites, prolonged clotting times)"
      ]
    },
    medications: [
      {
        name: "Betamethasone (Celestone Soluspan)",
        type: "Antenatal corticosteroid (glucocorticoid)",
        action: "Crosses the placenta and binds to glucocorticoid receptors in fetal type II alveolar pneumocytes, stimulating surfactant production (phosphatidylcholine synthesis) and accelerating structural maturation of the fetal lungs. Also accelerates maturation of the fetal gastrointestinal tract, cardiovascular system, and brain, reducing the incidence and severity of respiratory distress syndrome, intraventricular hemorrhage, and necrotizing enterocolitis in premature neonates.",
        sideEffects: "Maternal hyperglycemia (monitor blood glucose especially in gestational diabetes), insomnia, increased appetite, transient fetal heart rate changes (decreased variability for 24-48 hours), rare maternal immunosuppression",
        contra: "Active systemic fungal infection; relative contraindication in maternal active tuberculosis; use with caution in maternal diabetes (requires close glucose monitoring and insulin adjustment)",
        pearl: "Given as 12 mg intramuscular injection, 2 doses 24 hours apart; maximum benefit occurs 48 hours after the first dose; effective between 24-34 weeks gestation; a rescue course may be considered if delivery has not occurred within 7-14 days of initial course"
      },
      {
        name: "Terbutaline (Brethine)",
        type: "Beta-2 adrenergic agonist (tocolytic agent)",
        action: "Selectively stimulates beta-2 adrenergic receptors on uterine smooth muscle cells, activating adenylyl cyclase and increasing intracellular cyclic AMP (cAMP), which decreases intracellular calcium and relaxes the myometrium. This suppresses uterine contractions to allow time for corticosteroid administration or maternal transport to a facility with neonatal intensive care capabilities.",
        sideEffects: "Maternal tachycardia, palpitations, tremor, headache, hyperglycemia, hypokalemia, pulmonary edema (rare but serious), fetal tachycardia",
        contra: "Maternal heart disease, uncontrolled hyperthyroidism, cardiac arrhythmias; use beyond 48-72 hours or as maintenance tocolysis is not recommended due to safety concerns; contraindicated in gestational age beyond 34 weeks",
        pearl: "Used for acute short-term tocolysis (up to 48-72 hours) to allow corticosteroid effect; monitor maternal heart rate (hold if greater than 120 bpm), check blood glucose and potassium; subcutaneous administration common for acute management; oral maintenance is no longer recommended"
      },
      {
        name: "Rho(D) Immune Globulin (RhoGAM/WinRho)",
        type: "Immune globulin (anti-D antibody preparation)",
        action: "Contains preformed anti-D immunoglobulin that coats any Rh-positive fetal red blood cells present in the Rh-negative maternal circulation, targeting them for destruction by the maternal reticuloendothelial system before the maternal immune system can mount its own antibody response. This prevents maternal alloimmunization (sensitization) and protects Rh-positive fetuses in future pregnancies from hemolytic disease of the newborn.",
        sideEffects: "Injection site pain, low-grade fever, mild myalgia, lethargy; rarely anaphylactic reaction in IgA-deficient individuals",
        contra: "Rh-positive mother (not indicated); previously sensitized Rh-negative mother with existing anti-D antibodies (too late for prevention); documented anaphylaxis to human immune globulin",
        pearl: "Must be administered within 72 hours of any bleeding episode in Rh-negative mothers to prevent sensitization; standard 300 mcg dose protects against up to 30 mL of fetal whole blood exposure; additional doses calculated based on Kleihauer-Betke results if larger hemorrhage is suspected"
      }
    ],
    pearls: [
      "NEVER perform a digital cervical exam when placenta previa has not been ruled out -- this is the single most critical safety rule; a finger through the cervix can cause catastrophic, uncontrollable hemorrhage",
      "Placenta previa presents with PAINLESS, bright red bleeding and a soft uterus; abruption presents with PAINFUL, dark red bleeding and a rigid uterus -- this distinction is essential for rapid clinical differentiation",
      "The first bleeding episode (sentinel bleed) in placenta previa is often small and self-limiting, but subsequent episodes typically become progressively more severe -- never dismiss even minor bleeding",
      "Complete placenta previa is an absolute indication for cesarean delivery -- vaginal delivery is impossible and attempted labor would cause fatal hemorrhage from tearing the placenta",
      "Fetal malpresentation (breech, transverse) is common with placenta previa because the placenta occupying the lower segment prevents the fetal head from engaging in the pelvis",
      "Previous cesarean delivery is the strongest risk factor for placenta previa in subsequent pregnancies, and the risk increases with each additional cesarean section",
      "Low-lying placenta identified on mid-pregnancy ultrasound may resolve by the third trimester as the lower uterine segment develops (placental migration), but complete previa identified after 28 weeks rarely resolves"
    ],
    quiz: [
      {
        question: "A 34-week pregnant patient arrives at the unit with sudden, painless, bright red vaginal bleeding. The uterus is soft and nontender on palpation. What should the practical nurse do FIRST?",
        options: [
          "Perform a digital cervical examination to check dilation",
          "Apply continuous electronic fetal monitoring and notify the physician",
          "Administer oxytocin to stimulate contractions",
          "Position the patient in Trendelenburg position"
        ],
        correct: 1,
        rationale: "Painless bright red bleeding with a soft uterus is the hallmark of placenta previa. The priority is to apply electronic fetal monitoring and notify the physician. Digital cervical examination is absolutely CONTRAINDICATED until previa is ruled out because it can cause catastrophic hemorrhage by disrupting the placenta."
      },
      {
        question: "A practical nurse is caring for a patient diagnosed with complete placenta previa at 30 weeks gestation. Which instruction is most important to include in patient education?",
        options: [
          "Resume light exercise once bleeding has stopped for 24 hours",
          "Maintain strict pelvic rest: no intercourse, no douching, no vaginal examinations",
          "Continue regular prenatal appointments but no other restrictions",
          "Begin perineal massage to prepare for vaginal delivery"
        ],
        correct: 1,
        rationale: "Strict pelvic rest is essential in placenta previa to prevent cervical manipulation that could disrupt the placenta and cause hemorrhage. Complete previa requires cesarean delivery (vaginal delivery is contraindicated), so perineal massage is inappropriate. Activity restrictions and vigilant monitoring are necessary."
      },
      {
        question: "A practical nurse notes that a patient with placenta previa is Rh-negative and has experienced a bleeding episode at 28 weeks. Which medication should the nurse anticipate administering?",
        options: [
          "Methylergonovine (Methergine)",
          "Misoprostol (Cytotec)",
          "Rho(D) immune globulin (RhoGAM)",
          "Magnesium sulfate"
        ],
        correct: 2,
        rationale: "Rho(D) immune globulin must be administered to Rh-negative mothers within 72 hours of any bleeding episode to prevent maternal sensitization from fetomaternal hemorrhage. Methylergonovine and misoprostol are uterotonics used postpartum, not during antepartum bleeding. Magnesium sulfate is used for preeclampsia or neuroprotection."
      }
    ]
  },

  "pleurisy-rpn": {
    title: "Pleurisy for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Pleurisy and Pleural Inflammation",
      content: "Pleurisy (pleuritis) is inflammation of the pleural membranes that line the thoracic cavity and cover the surface of the lungs. The pleura consists of two layers: the parietal pleura, which lines the inner surface of the chest wall, diaphragm, and mediastinum, and the visceral pleura, which directly covers the lung parenchyma. Between these two layers lies the pleural space, a potential space that normally contains approximately 5 to 15 milliliters of serous fluid produced by the mesothelial cells. This thin layer of fluid serves as a lubricant that allows the two pleural surfaces to glide smoothly against each other during the respiratory cycle. When the pleura becomes inflamed, the normally smooth and glistening pleural surfaces become roughened, edematous, and covered with a fibrinous exudate. As these inflamed surfaces rub against each other during respiration, they produce friction that causes the characteristic sharp, stabbing chest pain of pleurisy (pleuritic chest pain). This pain is distinctly worsened by deep inspiration, coughing, and sneezing because these movements increase the excursion of the pleural surfaces against each other. Patients often splint the affected side by limiting respiratory depth, which reduces pain but also promotes atelectasis and potentially pneumonia. The pleural inflammation can be caused by numerous conditions including viral infection (most common cause of isolated pleurisy), bacterial pneumonia (parapneumonic pleurisy), pulmonary embolism, autoimmune diseases (systemic lupus erythematosus, rheumatoid arthritis), tuberculosis, malignancy, and trauma. A pleural friction rub, the hallmark auscultatory finding of pleurisy, is a coarse, grating, or creaking sound heard during both inspiration and expiration, most commonly at the lower lung bases. The friction rub disappears if pleural effusion develops, because fluid separates the inflamed pleural surfaces and eliminates the friction. Pleural effusion is the accumulation of excess fluid in the pleural space, which can be transudative (due to systemic conditions affecting hydrostatic or oncotic pressure, such as heart failure or liver cirrhosis) or exudative (due to local pleural disease increasing capillary permeability, such as infection, malignancy, or autoimmune pleurisy). Large pleural effusions compress the underlying lung parenchyma, causing dyspnea, decreased breath sounds, and dullness to percussion over the affected area. The practical nurse must differentiate pleuritic chest pain from cardiac chest pain because the management differs significantly: pleuritic pain is sharp and worsens with breathing, while cardiac pain is typically described as pressure or squeezing that does not change with respiration."
    },
    riskFactors: [
      "Bacterial or viral respiratory infections (pneumonia, influenza, tuberculosis -- most common predisposing conditions)",
      "Pulmonary embolism (pleural inflammation occurs due to pulmonary infarction in the lung tissue adjacent to the pleura)",
      "Autoimmune diseases (systemic lupus erythematosus, rheumatoid arthritis -- pleural involvement occurs in up to 50 percent of SLE patients)",
      "Thoracic surgery or chest trauma (direct mechanical irritation or infection of the pleura)",
      "Malignancy (lung cancer, mesothelioma, metastatic disease to the pleura from breast, ovarian, or lymphoma)",
      "Chronic kidney disease and uremia (uremic pleuritis from circulating toxins irritating the pleural membranes)",
      "Medications (hydralazine, procainamide, isoniazid can cause drug-induced lupus with pleural involvement)"
    ],
    diagnostics: [
      "Chest X-ray (PA and lateral): may show pleural effusion (blunting of costophrenic angle with as little as 250-300 mL of fluid), underlying pneumonia, or mass; may be normal in early dry pleurisy",
      "CT scan of chest with contrast: identifies loculated effusions, pleural thickening, underlying pulmonary pathology, and pulmonary embolism (CT pulmonary angiography)",
      "Thoracentesis with pleural fluid analysis: Light criteria differentiate transudative from exudative effusion; send for cell count, protein, LDH, glucose, pH, culture, cytology",
      "Complete blood count (CBC): elevated WBC with left shift suggests bacterial infection; lymphocyte predominance may indicate tuberculosis or malignancy",
      "Erythrocyte sedimentation rate (ESR) and C-reactive protein (CRP): elevated in inflammatory conditions; useful for monitoring treatment response",
      "D-dimer and CT pulmonary angiography: when pulmonary embolism is suspected as the cause of pleuritic chest pain"
    ],
    management: [
      "Treat the underlying cause: antibiotics for bacterial infection, anticoagulation for pulmonary embolism, disease-modifying therapy for autoimmune conditions",
      "Administer anti-inflammatory medications as prescribed (NSAIDs are first-line for pain and inflammation in pleurisy)",
      "Position patient on the affected side (splinting the painful area reduces pleural surface movement and decreases pain)",
      "Encourage deep breathing exercises and incentive spirometry despite pain to prevent atelectasis and pneumonia",
      "Apply warm compresses to the affected chest wall for comfort (heat relaxes intercostal muscles and reduces pain perception)",
      "Thoracentesis may be performed for large pleural effusions causing respiratory distress (removes fluid and sends for diagnostic analysis)",
      "Monitor respiratory status closely: oxygen saturation, respiratory rate and depth, breath sounds, work of breathing"
    ],
    nursingActions: [
      "Assess pain characteristics using PQRST: pleuritic pain is sharp, knife-like, worsens with inspiration and coughing, and localizes to one area of the chest wall",
      "Auscultate lung fields bilaterally: listen for pleural friction rub (coarse grating sound during inspiration AND expiration), decreased breath sounds (effusion), or crackles (pneumonia)",
      "Monitor respiratory rate, depth, and oxygen saturation continuously or at least every 4 hours; report SpO2 less than 92 percent",
      "Administer prescribed analgesics and assess effectiveness 30-60 minutes after administration; adequate pain control is essential for breathing exercises",
      "Teach and encourage splinted coughing technique: hold a pillow firmly against the affected side while coughing to reduce pain and maintain airway clearance",
      "Monitor for signs of increasing pleural effusion: progressive dyspnea, decreased breath sounds, dullness to percussion, tracheal deviation (large effusion)",
      "Document respiratory assessment findings including breath sounds, pain rating, oxygen saturation, and respiratory effort at each assessment"
    ],
    assessmentFindings: [
      "Sharp, stabbing, or knife-like chest pain that is distinctly pleuritic: worsens with deep inspiration, coughing, sneezing, and movement; improves with breath-holding or shallow breathing",
      "Pleural friction rub on auscultation: coarse, grating, or leather-creaking sound heard in late inspiration and early expiration; best heard with diaphragm of stethoscope at lower anterolateral chest wall",
      "Splinting behavior: patient voluntarily limits respiratory depth on the affected side to minimize pain, leading to shallow rapid breathing",
      "Tachypnea (rapid shallow breathing as pain limits inspiratory depth) and possible dyspnea with exertion",
      "Diminished breath sounds and dullness to percussion over the affected area if pleural effusion has developed",
      "Low-grade fever may be present (especially with infectious or autoimmune etiology)",
      "Referred pain to the shoulder (diaphragmatic pleurisy irritates the phrenic nerve, which refers pain to the ipsilateral shoulder via C3-C5 dermatome)"
    ],
    signs: {
      left: [
        "Mild chest pain with deep breathing rated 3-5/10",
        "Audible pleural friction rub on auscultation",
        "Respiratory rate mildly elevated (20-24 breaths/minute)",
        "Oxygen saturation above 94 percent on room air",
        "Low-grade fever (37.5-38.3 degrees Celsius)",
        "Patient splinting affected side but able to perform deep breathing exercises"
      ],
      right: [
        "Severe pleuritic chest pain limiting all respiratory effort",
        "Progressive dyspnea with oxygen saturation below 90 percent",
        "Absent breath sounds with dullness to percussion (large effusion)",
        "Tracheal deviation away from affected side (tension effusion)",
        "High fever with rigors suggesting empyema (infected pleural fluid)",
        "Signs of respiratory failure: accessory muscle use, cyanosis, altered consciousness"
      ]
    },
    medications: [
      {
        name: "Ibuprofen (Advil/Motrin)",
        type: "Nonsteroidal anti-inflammatory drug (NSAID)",
        action: "Non-selectively inhibits cyclooxygenase-1 (COX-1) and cyclooxygenase-2 (COX-2) enzymes, blocking the conversion of arachidonic acid to prostaglandins, prostacyclin, and thromboxane. This reduces prostaglandin-mediated inflammation, pain, and fever at the pleural surfaces. The anti-inflammatory effect is more important than the analgesic effect in pleurisy because it directly addresses the pleural inflammation driving the pain.",
        sideEffects: "GI irritation (dyspepsia, gastritis, ulceration, GI bleeding), renal impairment (decreased renal blood flow, interstitial nephritis), platelet dysfunction (increased bleeding time), cardiovascular risk with prolonged use",
        contra: "Active peptic ulcer disease or GI bleeding; severe renal impairment (CrCl less than 30 mL/min); third trimester of pregnancy (risk of premature closure of ductus arteriosus); NSAID or aspirin allergy; concurrent anticoagulant therapy",
        pearl: "First-line therapy for pleuritic pain -- take with food and a full glass of water to minimize GI effects; typical dose is 400-800 mg every 6-8 hours; assess renal function before and during prolonged use; often more effective than opioids for pleuritic pain because it addresses the inflammatory component"
      },
      {
        name: "Colchicine (Colcrys)",
        type: "Anti-inflammatory (microtubule inhibitor)",
        action: "Binds to tubulin and inhibits microtubule polymerization in neutrophils and other inflammatory cells, preventing chemotaxis, phagocytosis, and release of inflammatory mediators. Also inhibits the NLRP3 inflammasome, reducing interleukin-1-beta production. In pleurisy, this decreases neutrophil-mediated pleural inflammation and reduces the fibrinous exudate formation that causes friction and pain.",
        sideEffects: "Diarrhea (most common dose-limiting side effect), nausea, vomiting, abdominal cramping; rare but serious: bone marrow suppression, myopathy, neuropathy, rhabdomyolysis (especially with renal impairment or drug interactions)",
        contra: "Severe renal impairment (CrCl less than 30 mL/min) without dose reduction; severe hepatic impairment; concurrent use of strong CYP3A4 inhibitors (clarithromycin, ketoconazole) or P-glycoprotein inhibitors (cyclosporine)",
        pearl: "Particularly effective for recurrent pleurisy and pericarditis; typically given at 0.5 mg once or twice daily for 3-6 months to prevent recurrence; lower GI side effects than previously used higher doses; monitor CBC and hepatic/renal function during prolonged therapy"
      },
      {
        name: "Codeine Phosphate",
        type: "Opioid analgesic and antitussive",
        action: "Prodrug that is converted to morphine by hepatic CYP2D6 enzyme; morphine binds to mu-opioid receptors in the central nervous system, modulating pain transmission and perception. At lower doses, codeine suppresses the cough reflex by acting on the cough center in the medulla oblongata. In pleurisy, cough suppression reduces the repetitive pleural surface friction that exacerbates pleuritic pain.",
        sideEffects: "Constipation (most common, implement bowel regimen), nausea, drowsiness, dizziness, respiratory depression (dose-dependent), urinary retention, physical dependence with prolonged use",
        contra: "Respiratory depression or severe COPD; paralytic ileus; known CYP2D6 ultra-rapid metabolizer status (excessive morphine conversion causing respiratory depression); concurrent use of MAO inhibitors; post-tonsillectomy pain in children",
        pearl: "Used primarily for cough suppression in pleurisy rather than as primary analgesic; assess respiratory rate before each dose (hold if less than 12 breaths/minute); approximately 10 percent of the population are poor CYP2D6 metabolizers and will have minimal analgesic response; prescribe a concurrent bowel regimen (stool softener) to prevent opioid-induced constipation"
      }
    ],
    pearls: [
      "Pleuritic chest pain is SHARP and WORSENS with inspiration -- cardiac chest pain is PRESSURE-like and does NOT change with breathing; this distinction is critical for differentiating the two clinical emergencies",
      "The pleural friction rub is heard during BOTH inspiration AND expiration (unlike crackles which are predominantly inspiratory); it sounds like two pieces of leather rubbing together and is best heard at lower anterolateral chest wall",
      "If a pleural friction rub disappears, suspect pleural effusion development -- the fluid separates the inflamed surfaces and eliminates friction, but the underlying problem may be worsening",
      "Position the patient on the AFFECTED side to splint the painful area and reduce pleural surface movement -- this is counter-intuitive but reduces pain and allows better expansion of the unaffected lung",
      "Shoulder pain in pleurisy indicates diaphragmatic involvement -- the phrenic nerve (C3-C5) innervates the diaphragm, and irritation refers pain to the ipsilateral shoulder",
      "NSAIDs (ibuprofen) are more effective than opioids for pleuritic pain because they directly reduce the pleural inflammation causing the pain, not just mask the pain signal",
      "Always encourage deep breathing exercises and incentive spirometry despite pain -- adequate analgesia should be given FIRST, then breathing exercises performed; shallow breathing leads to atelectasis and pneumonia"
    ],
    quiz: [
      {
        question: "A patient reports sharp chest pain that significantly worsens when taking a deep breath and is relieved by breath-holding. The practical nurse auscultates a coarse grating sound during both inspiration and expiration at the left lower chest. What is this auscultatory finding?",
        options: [
          "Fine crackles (rales)",
          "Wheezing",
          "Pleural friction rub",
          "Rhonchi"
        ],
        correct: 2,
        rationale: "A pleural friction rub is a coarse, grating sound heard during both inspiration and expiration, caused by inflamed pleural surfaces rubbing against each other. It is the hallmark auscultatory finding of pleurisy. Crackles are typically inspiratory, wheezes are high-pitched musical sounds from airway narrowing, and rhonchi are low-pitched sounds from secretions."
      },
      {
        question: "A practical nurse is caring for a patient with pleurisy. Which position should the nurse recommend to help manage the patient's pain?",
        options: [
          "Supine with legs elevated",
          "Lying on the unaffected side",
          "Lying on the affected side",
          "High Fowler position sitting upright"
        ],
        correct: 2,
        rationale: "Positioning the patient on the affected side splints the inflamed pleura by limiting the movement of that chest wall during respiration, which reduces the friction between the pleural surfaces and decreases pain. Lying on the unaffected side would allow maximum movement of the affected side, worsening pain."
      },
      {
        question: "A patient with pleurisy previously had an audible friction rub, but on reassessment the friction rub is no longer heard and the practical nurse notices decreased breath sounds and dullness to percussion at the base. What complication should the nurse suspect?",
        options: [
          "Resolution of the pleurisy",
          "Development of pleural effusion",
          "Pneumothorax",
          "Bronchospasm"
        ],
        correct: 1,
        rationale: "Disappearance of a friction rub accompanied by decreased breath sounds and dullness to percussion indicates pleural effusion. Fluid accumulating in the pleural space separates the inflamed surfaces (eliminating the rub) and compresses the underlying lung (causing decreased breath sounds and dullness). This is not resolution of disease but progression."
      }
    ]
  },

  "polycystic-kidney-disease-rpn": {
    title: "Polycystic Kidney Disease for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Polycystic Kidney Disease",
      content: "Polycystic kidney disease (PKD) is a genetic disorder characterized by the progressive development of multiple fluid-filled cysts within the renal parenchyma, leading to massive bilateral kidney enlargement and eventual renal failure. There are two primary forms: autosomal dominant polycystic kidney disease (ADPKD), which is the most common inherited kidney disease (affecting approximately 1 in 400 to 1,000 individuals), and autosomal recessive polycystic kidney disease (ARPKD), which is much rarer and typically presents in infancy or childhood with a more severe prognosis. ADPKD is caused by mutations in the PKD1 gene (chromosome 16, accounting for approximately 85 percent of cases) or the PKD2 gene (chromosome 4, accounting for approximately 15 percent of cases). These genes encode polycystin-1 and polycystin-2 proteins, respectively, which are located on the primary cilia of renal tubular epithelial cells and function as mechanosensors that regulate intracellular calcium signaling. When these proteins are dysfunctional, the disrupted calcium signaling activates cyclic AMP (cAMP) pathways that stimulate excessive fluid secretion into the tubular lumen and uncontrolled proliferation of tubular epithelial cells. Over time, these proliferating cells form fluid-filled cysts that progressively enlarge, compressing and replacing normal renal parenchyma. The cysts can range from millimeters to several centimeters in diameter, and the kidneys can grow to enormous size (up to 40 centimeters in length, compared to normal 10-12 centimeters), weighing several kilograms. The expanding cysts compress renal vasculature, activating the renin-angiotensin-aldosterone system (RAAS) and causing hypertension, which is one of the earliest and most common complications (present in approximately 60 percent of patients before any decline in GFR). Hypertension accelerates further kidney damage, creating a destructive cycle. ADPKD is a systemic disease with extrarenal manifestations including hepatic cysts (most common extrarenal finding, present in up to 80 percent of patients), intracranial (berry) aneurysms (present in approximately 5 to 10 percent and carrying risk of subarachnoid hemorrhage), cardiac valve abnormalities (mitral valve prolapse), colonic diverticula, and abdominal wall hernias. ARPKD is caused by mutations in the PKHD1 gene, which encodes fibrocystin/polyductin, and presents with bilateral massive kidney enlargement at birth, often with associated congenital hepatic fibrosis. The kidneys in ARPKD show dilated collecting ducts (fusiform cyst pattern) compared to the spherical cysts from all nephron segments seen in ADPKD. Renal failure in ADPKD typically develops between the fourth and sixth decades of life, with PKD1 mutations progressing to end-stage renal disease approximately 10 years earlier than PKD2 mutations. The practical nurse must understand that management focuses on slowing disease progression through blood pressure control, hydration, and the vasopressin V2 receptor antagonist tolvaptan, which is the first disease-modifying therapy approved specifically for ADPKD."
    },
    riskFactors: [
      "Family history of ADPKD (autosomal dominant inheritance -- each child of an affected parent has a 50 percent chance of inheriting the mutation)",
      "PKD1 gene mutation versus PKD2 (PKD1 causes earlier onset and faster progression to end-stage renal disease, by approximately 10 years)",
      "Hypertension (both a complication and an accelerating factor -- uncontrolled blood pressure hastens kidney deterioration)",
      "Male sex (males with ADPKD tend to progress to renal failure faster than females)",
      "Early onset of hypertension, hematuria, or proteinuria (these clinical markers predict faster disease progression)",
      "Larger kidney volume and rapid kidney volume growth (total kidney volume is the strongest predictor of renal function decline)",
      "ARPKD risk: both parents must carry the autosomal recessive PKHD1 mutation (25 percent chance with two carrier parents)"
    ],
    diagnostics: [
      "Renal ultrasound: primary screening and diagnostic tool; diagnostic criteria for ADPKD depend on age and number of cysts (age 15-39: at least 3 cysts total; age 40-59: at least 2 cysts in each kidney; age 60 and older: at least 4 cysts in each kidney in at-risk individuals)",
      "CT scan or MRI of abdomen: more sensitive than ultrasound for detecting small cysts and measuring total kidney volume; MRI preferred to avoid radiation exposure with serial monitoring",
      "Serum creatinine and estimated GFR (eGFR): monitor renal function progression; GFR may remain normal for decades despite significant cyst burden, then decline rapidly",
      "Urinalysis: check for hematuria (cyst rupture or hemorrhage), proteinuria (marker of progression), and signs of urinary tract infection",
      "Liver function tests and abdominal imaging: assess for hepatic cysts, the most common extrarenal manifestation",
      "Genetic testing (PKD1/PKD2 mutation analysis): confirmatory when imaging is inconclusive; essential for potential living kidney donors from affected families"
    ],
    management: [
      "Aggressive blood pressure control: target less than 130/80 mmHg (or less than 110/75 for younger patients with rapid progression); ACE inhibitors or ARBs are first-line agents",
      "Increased water intake (2.5 to 3 liters daily) to suppress vasopressin (ADH) secretion and reduce cAMP-driven cyst growth",
      "Tolvaptan therapy for patients with rapidly progressive ADPKD (CKD stages 1-4) to slow kidney volume growth and GFR decline",
      "Low-sodium diet (less than 2,300 mg daily) to support blood pressure control and reduce RAAS activation",
      "Treat urinary tract infections promptly with antibiotics that penetrate cyst walls (fluoroquinolones, trimethoprim-sulfamethoxazole)",
      "Monitor and manage chronic kidney disease complications: anemia (erythropoietin), bone mineral disease (phosphate binders, vitamin D), metabolic acidosis (sodium bicarbonate)",
      "Prepare for renal replacement therapy (dialysis or transplantation) when approaching end-stage renal disease (eGFR less than 15 mL/min)"
    ],
    nursingActions: [
      "Monitor blood pressure at every encounter; ADPKD patients require consistent BP control to slow disease progression; report readings above target to the physician",
      "Assess for flank or abdominal pain: dull constant ache suggests cyst enlargement or compression; acute severe pain may indicate cyst rupture, hemorrhage, or infection",
      "Monitor intake and output; encourage adequate daily fluid intake (2.5-3 L) to suppress vasopressin and slow cyst growth; educate about evenly distributing fluid throughout the day",
      "Obtain and monitor laboratory values: serum creatinine, BUN, electrolytes, urinalysis; report rising creatinine or new proteinuria immediately",
      "Assess abdomen for increasing size or palpable kidney masses; enlarged kidneys may be visible and easily palpable; document abdominal girth measurements",
      "Report new-onset hematuria (may indicate cyst rupture) or signs of urinary tract infection (dysuria, fever, cloudy urine) -- UTIs in PKD can become complicated cyst infections",
      "Educate patient to avoid contact sports and activities with risk of abdominal trauma (enlarged kidneys are vulnerable to traumatic rupture)"
    ],
    assessmentFindings: [
      "Bilateral flank pain or dull aching abdominal pain (most common presenting symptom; caused by cyst expansion stretching the renal capsule)",
      "Palpable, enlarged kidneys on abdominal examination (kidneys may be massive, extending below the costal margin bilaterally)",
      "Hypertension (often the earliest clinical finding, present before any measurable decline in renal function)",
      "Gross or microscopic hematuria (resulting from cyst rupture into the collecting system or from passage of kidney stones)",
      "Recurrent urinary tract infections or infected cysts (fever, chills, localized flank tenderness, pyuria)",
      "Kidney stones (occur in approximately 20-30 percent of ADPKD patients due to urinary stasis and altered urine composition)",
      "Progressive decline in renal function (rising creatinine, decreasing GFR, uremic symptoms in advanced disease: fatigue, nausea, pruritis, cognitive changes)"
    ],
    signs: {
      left: [
        "Mild intermittent flank discomfort",
        "Blood pressure slightly above target despite medication",
        "Microscopic hematuria on urinalysis",
        "Stable serum creatinine near baseline",
        "Mild fatigue reported by patient",
        "Small palpable kidney mass on deep palpation"
      ],
      right: [
        "Severe acute flank pain (cyst rupture or hemorrhage)",
        "Gross hematuria with clot formation",
        "Rapidly rising serum creatinine indicating accelerated renal decline",
        "Fever with localized flank tenderness (infected cyst or pyelonephritis)",
        "Sudden severe headache (may indicate ruptured intracranial aneurysm -- medical emergency)",
        "Uremic symptoms: confusion, nausea, peripheral neuropathy, pericardial friction rub"
      ]
    },
    medications: [
      {
        name: "Tolvaptan (Jinarc/Samsca)",
        type: "Vasopressin V2 receptor antagonist",
        action: "Selectively blocks vasopressin (antidiuretic hormone) V2 receptors on the basolateral membrane of collecting duct principal cells. This prevents vasopressin-stimulated insertion of aquaporin-2 water channels and blocks the intracellular cAMP increase that drives cyst cell proliferation and fluid secretion. By reducing cAMP levels in cyst-lining epithelial cells, tolvaptan directly slows cyst growth and total kidney volume expansion, which is the primary mechanism of disease progression in ADPKD.",
        sideEffects: "Aquaretic effects (polyuria, polydipsia, nocturia -- patients may urinate 4-6 liters daily), hepatotoxicity (elevated ALT/AST, requiring monthly liver function monitoring for first 18 months), thirst, dry mouth, hypernatremia, dehydration if fluid intake is insufficient",
        contra: "Inability to perceive or respond to thirst (patients must drink adequate water to compensate for aquaretic effect); liver disease or elevated hepatic enzymes; concurrent use of strong CYP3A4 inhibitors; hypovolemia or hypernatremia; anuria",
        pearl: "First disease-modifying drug approved for ADPKD; patients MUST drink large volumes of water (matching urine output) to prevent dehydration and hypernatremia; liver function tests (ALT, AST, bilirubin) must be monitored monthly for the first 18 months then every 3 months; available through restricted access programs due to hepatotoxicity risk"
      },
      {
        name: "Lisinopril (Prinivil/Zestril)",
        type: "Angiotensin-converting enzyme (ACE) inhibitor",
        action: "Inhibits angiotensin-converting enzyme, preventing the conversion of angiotensin I to the potent vasoconstrictor angiotensin II. This reduces peripheral vascular resistance and blood pressure while also decreasing aldosterone secretion (reducing sodium and water retention). In ADPKD, ACE inhibitors provide renal protection beyond blood pressure lowering by reducing intraglomerular pressure, decreasing proteinuria, and slowing the fibrotic renal remodeling driven by angiotensin II.",
        sideEffects: "Dry persistent cough (due to bradykinin accumulation, occurs in 5-20 percent of patients), hyperkalemia, hypotension (especially first dose), angioedema (rare but potentially life-threatening), dizziness, renal function decline in bilateral renal artery stenosis",
        contra: "Pregnancy (teratogenic -- causes fetal renal agenesis, oligohydramnios, and skull ossification defects); bilateral renal artery stenosis; history of angioedema with ACE inhibitor use; serum potassium above 5.5 mEq/L",
        pearl: "First-line antihypertensive for ADPKD due to renoprotective effects; monitor serum creatinine and potassium 1-2 weeks after initiation or dose increase; an initial rise in creatinine up to 30 percent is acceptable and expected; switch to ARB if intolerable cough develops; ALWAYS counsel women of childbearing age about contraception"
      },
      {
        name: "Acetaminophen (Tylenol)",
        type: "Analgesic and antipyretic (non-opioid)",
        action: "Inhibits cyclooxygenase enzymes primarily in the central nervous system (proposed COX-3 pathway), reducing prostaglandin synthesis in the thermoregulatory center (antipyretic effect) and modulating pain perception through descending serotonergic pain pathways. Unlike NSAIDs, acetaminophen has no significant peripheral anti-inflammatory activity and does not affect platelet function or gastric mucosa.",
        sideEffects: "Hepatotoxicity at supratherapeutic doses (the N-acetyl-p-benzoquinone imine metabolite, NAPQI, depletes hepatic glutathione and causes direct hepatocellular necrosis); nausea; rare hypersensitivity reactions",
        contra: "Severe hepatic impairment or active liver disease; chronic alcohol use disorder (increased susceptibility to hepatotoxicity); dose must be reduced in liver disease or malnutrition (depleted glutathione stores)",
        pearl: "Preferred analgesic over NSAIDs in PKD patients because NSAIDs can worsen renal function by reducing renal blood flow and are associated with hypertension exacerbation; maximum dose is 4 grams per day in healthy adults, reduced to 2 grams per day in patients with liver disease; remind patients to check all over-the-counter medications for hidden acetaminophen content"
      }
    ],
    pearls: [
      "ADPKD is autosomal DOMINANT (50 percent inheritance risk from one affected parent); ARPKD is autosomal RECESSIVE (25 percent risk when both parents are carriers) -- this distinction matters for genetic counseling",
      "Hypertension is often the EARLIEST clinical finding in ADPKD, developing before any measurable decline in GFR -- aggressive blood pressure control with ACE inhibitors or ARBs is the cornerstone of management",
      "Avoid NSAIDs in PKD patients -- they reduce renal blood flow, worsen hypertension, and accelerate kidney function decline; acetaminophen is the preferred analgesic for flank pain",
      "Tolvaptan is the FIRST disease-modifying therapy for ADPKD and works by blocking vasopressin receptors to reduce cAMP-driven cyst growth; patients produce massive amounts of dilute urine and MUST drink adequate water to compensate",
      "Intracranial (berry) aneurysms occur in 5-10 percent of ADPKD patients -- screen with MR angiography if there is a family history of aneurysm or subarachnoid hemorrhage; sudden severe headache is an emergency",
      "Hepatic cysts are the most common extrarenal manifestation of ADPKD (up to 80 percent of patients) but rarely cause liver failure because cysts replace hepatocytes without destroying bile ducts",
      "Patients with PKD should avoid contact sports and activities with abdominal trauma risk because the massively enlarged kidneys are vulnerable to traumatic rupture and hemorrhage"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient newly diagnosed with ADPKD. Which finding is most likely to be the earliest clinical manifestation of this disease?",
        options: [
          "Elevated serum creatinine",
          "Gross hematuria",
          "Hypertension",
          "Bilateral flank pain"
        ],
        correct: 2,
        rationale: "Hypertension is the earliest and most common clinical finding in ADPKD, often developing years before any measurable decline in kidney function. The expanding cysts compress renal vasculature and activate the renin-angiotensin-aldosterone system, causing blood pressure elevation. Elevated creatinine, hematuria, and flank pain typically develop later."
      },
      {
        question: "A patient with ADPKD asks the practical nurse which pain medication is safest for managing flank discomfort. Which medication should the nurse anticipate being recommended?",
        options: [
          "Ibuprofen (Advil)",
          "Naproxen (Aleve)",
          "Acetaminophen (Tylenol)",
          "Ketorolac (Toradol)"
        ],
        correct: 2,
        rationale: "Acetaminophen is the preferred analgesic for PKD patients because NSAIDs (ibuprofen, naproxen, ketorolac) reduce renal blood flow, worsen hypertension, and can accelerate the decline in kidney function. NSAIDs should be avoided in patients with chronic kidney disease whenever possible."
      },
      {
        question: "A practical nurse is monitoring a patient who recently started tolvaptan for ADPKD. Which laboratory test is most critical to monitor during the first 18 months of therapy?",
        options: [
          "Serum glucose levels",
          "Thyroid function tests",
          "Liver function tests (ALT, AST)",
          "Serum calcium levels"
        ],
        correct: 2,
        rationale: "Tolvaptan carries a significant risk of hepatotoxicity, and liver function tests (ALT, AST, bilirubin) must be monitored monthly for the first 18 months of therapy, then every 3 months thereafter. If hepatic enzymes become significantly elevated, the medication must be discontinued. This monitoring requirement is part of the restricted access program for tolvaptan."
      }
    ]
  },

  "polycythemia-basics-rpn": {
    title: "Polycythemia for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Polycythemia",
      content: "Polycythemia refers to an abnormal increase in the total red blood cell (RBC) mass, resulting in elevated hemoglobin and hematocrit levels. The condition is classified into two main categories based on etiology: primary polycythemia (polycythemia vera) and secondary polycythemia. Polycythemia vera (PV) is a myeloproliferative neoplasm caused by an acquired somatic mutation in the Janus kinase 2 (JAK2) gene, present in approximately 95 percent of patients. The JAK2 V617F mutation causes the JAK2 tyrosine kinase to become constitutively active (always turned on), leading to uncontrolled proliferation of erythroid progenitor cells in the bone marrow independent of normal erythropoietin (EPO) stimulation. This autonomous clonal expansion results in overproduction of red blood cells (and often white blood cells and platelets as well, a condition called panmyelosis). Serum erythropoietin levels are characteristically LOW or undetectable in polycythemia vera because the elevated red cell mass suppresses EPO production by the kidneys through negative feedback. Secondary polycythemia results from appropriately elevated EPO production in response to chronic tissue hypoxia (physiologically appropriate response) or from autonomous EPO secretion by tumors (inappropriate response). Common causes of secondary polycythemia include chronic obstructive pulmonary disease, high-altitude living, obstructive sleep apnea, chronic carbon monoxide exposure (heavy smoking), cyanotic congenital heart disease, and EPO-secreting tumors (renal cell carcinoma, hepatocellular carcinoma, cerebellar hemangioblastoma). In secondary polycythemia, the bone marrow is responding normally to elevated EPO, and the JAK2 mutation is absent. The primary clinical consequence of polycythemia is hyperviscosity of the blood. As the hematocrit rises above 45 to 50 percent, blood viscosity increases exponentially, impairing microcirculatory flow and creating a prothrombotic state. Sluggish blood flow through small vessels promotes thrombus formation in both arterial and venous circulations, placing patients at high risk for stroke, myocardial infarction, deep vein thrombosis, pulmonary embolism, and portal vein thrombosis. Paradoxically, despite the increased clotting tendency, patients with very high platelet counts (greater than 1,500,000/microL) may also experience bleeding due to acquired von Willebrand syndrome (platelet-mediated degradation of von Willebrand factor). Additional complications include gout (from increased nucleic acid turnover producing excess uric acid), aquagenic pruritus (intense itching after warm bathing, caused by histamine release from increased basophils), and erythromelalgia (burning pain and redness in the hands and feet from microvascular platelet aggregation). The cornerstone of treatment for polycythemia vera is therapeutic phlebotomy (bloodletting) to maintain the hematocrit below 45 percent, combined with low-dose aspirin and cytoreductive therapy (hydroxyurea) in high-risk patients. The practical nurse plays an essential role in monitoring symptoms of hyperviscosity, assisting with phlebotomy procedures, and educating patients about hydration, recognizing signs of thrombotic events, and medication compliance."
    },
    riskFactors: [
      "Age greater than 60 years (polycythemia vera incidence increases with age; median age at diagnosis is 60-65 years)",
      "JAK2 V617F mutation (present in approximately 95 percent of polycythemia vera cases; the defining molecular driver of the disease)",
      "Male sex (polycythemia vera has a slight male predominance with male-to-female ratio of approximately 1.2:1)",
      "Chronic hypoxic conditions for secondary polycythemia (COPD, obstructive sleep apnea, high-altitude residence, cyanotic heart disease)",
      "Heavy cigarette smoking (chronic carbon monoxide exposure reduces oxygen-carrying capacity, stimulating compensatory EPO production)",
      "Prior history of thrombotic events (strongest predictor of future thrombosis in PV patients)",
      "EPO-secreting tumors (renal cell carcinoma, hepatocellular carcinoma -- cause inappropriate secondary polycythemia)"
    ],
    diagnostics: [
      "Complete blood count (CBC): elevated hemoglobin (greater than 16.5 g/dL in men, greater than 16 g/dL in women) and hematocrit (greater than 49 percent in men, greater than 48 percent in women); may also show leukocytosis and thrombocytosis in PV",
      "JAK2 mutation testing: JAK2 V617F is positive in approximately 95 percent of PV; JAK2 exon 12 mutations account for most remaining cases; essential for distinguishing primary from secondary polycythemia",
      "Serum erythropoietin (EPO) level: LOW or undetectable in polycythemia vera (autonomous marrow proliferation suppresses EPO); ELEVATED in secondary polycythemia (appropriate response to hypoxia)",
      "Bone marrow biopsy: shows hypercellular marrow with trilineage hyperplasia (panmyelosis: increased erythroid, granulocytic, and megakaryocytic precursors); distinguishes PV from other myeloproliferative neoplasms",
      "Serum uric acid: frequently elevated due to increased cell turnover and nucleic acid degradation; risk factor for gout",
      "Iron studies (serum ferritin, iron, TIBC): often show iron deficiency secondary to repeated phlebotomy or increased iron utilization for erythropoiesis"
    ],
    management: [
      "Therapeutic phlebotomy (venesection): cornerstone of PV treatment -- remove 250-500 mL of blood to maintain hematocrit below 45 percent; initially performed weekly or biweekly until target is reached, then as needed",
      "Low-dose aspirin (81-100 mg daily): reduces thrombotic risk by inhibiting platelet aggregation; standard therapy for all PV patients unless contraindicated",
      "Hydroxyurea for high-risk patients (age greater than 60 years OR prior thrombotic event): cytoreductive therapy that reduces all blood cell lines and decreases thrombotic risk",
      "Adequate hydration (at least 2-3 liters daily): reduces blood viscosity and promotes renal excretion of uric acid; dehydration exacerbates hyperviscosity",
      "Allopurinol for symptomatic hyperuricemia or gout: reduces uric acid production by inhibiting xanthine oxidase",
      "Monitor and manage cardiovascular risk factors: hypertension, hyperlipidemia, diabetes, smoking cessation",
      "Avoid iron supplementation unless severe iron deficiency with symptoms (iron supplementation can fuel erythropoiesis and raise hematocrit)"
    ],
    nursingActions: [
      "Monitor hematocrit and hemoglobin levels regularly; report hematocrit above 45 percent to the physician as phlebotomy may be indicated",
      "Assist with therapeutic phlebotomy: verify physician order, perform patient identification, monitor vital signs before/during/after procedure, ensure adequate hydration post-procedure",
      "Assess for signs and symptoms of hyperviscosity: headache, dizziness, visual disturbances, tinnitus, facial plethora (ruddy red facial complexion), feeling of fullness in the head",
      "Monitor for thrombotic complications: assess for signs of stroke (FAST: Face drooping, Arm weakness, Speech difficulty, Time to call emergency), DVT (unilateral leg swelling, warmth, pain), chest pain, dyspnea",
      "Encourage adequate fluid intake throughout the day (at least 2-3 liters) to maintain blood fluidity and prevent dehydration-induced hyperviscosity",
      "Assess for aquagenic pruritus (intense itching after warm bath or shower); advise using cool water, pat-drying (not rubbing), and applying emollients after bathing",
      "Monitor for signs of bleeding despite the prothrombotic state: epistaxis, gingival bleeding, easy bruising, petechiae (paradoxical bleeding can occur with very high platelet counts)"
    ],
    assessmentFindings: [
      "Facial plethora (ruddy, flushed, or reddish-purple facial complexion due to engorgement of superficial blood vessels with excess red blood cells)",
      "Headache, dizziness, and visual disturbances (blurred vision, scotomata) caused by impaired cerebral microcirculation from hyperviscous blood",
      "Splenomegaly (often massive; the spleen is a site of extramedullary hematopoiesis and red blood cell sequestration; palpable below the left costal margin)",
      "Aquagenic pruritus (intense itching occurring within minutes of contact with warm water, caused by histamine release from increased basophils and mast cells)",
      "Erythromelalgia (burning pain and erythema in the hands and feet caused by microvascular platelet aggregation; dramatically relieved by aspirin)",
      "Hypertension (from increased blood volume and viscosity), tinnitus, and feeling of fullness or pressure in the head",
      "Gout symptoms (acute joint inflammation, particularly of the great toe metatarsophalangeal joint) from hyperuricemia"
    ],
    signs: {
      left: [
        "Mild headache and dizziness",
        "Facial redness (plethora) more noticeable than usual",
        "Itching after warm showers (aquagenic pruritus)",
        "Mild fatigue or feeling of head fullness",
        "Hematocrit trending upward but below 45 percent",
        "Intermittent burning sensation in hands or feet"
      ],
      right: [
        "Sudden severe headache with neurological deficits (possible stroke)",
        "Unilateral leg swelling with warmth and pain (possible DVT)",
        "Chest pain or acute dyspnea (possible MI or PE)",
        "Hematocrit above 55 percent with severe hyperviscosity symptoms",
        "Massive splenomegaly with left upper quadrant pain (splenic infarction)",
        "Significant bleeding from multiple sites despite elevated blood counts (acquired von Willebrand syndrome)"
      ]
    },
    medications: [
      {
        name: "Hydroxyurea (Hydrea)",
        type: "Antimetabolite / cytoreductive agent",
        action: "Inhibits the enzyme ribonucleotide reductase, which converts ribonucleotides to deoxyribonucleotides required for DNA synthesis. By blocking this rate-limiting step in DNA replication, hydroxyurea suppresses the proliferation of rapidly dividing bone marrow progenitor cells, reducing the overproduction of red blood cells, white blood cells, and platelets characteristic of polycythemia vera. This cytoreduction lowers blood viscosity and reduces thrombotic risk.",
        sideEffects: "Bone marrow suppression (leukopenia, anemia, thrombocytopenia -- dose-limiting toxicity), macrocytosis (elevated MCV), skin hyperpigmentation, leg ulcers with long-term use, nail changes, nausea, GI upset, possible increased risk of secondary leukemia (debated)",
        contra: "Severe bone marrow suppression (WBC less than 2,500/microL, platelets less than 100,000/microL); pregnancy (teratogenic Category D); severe hepatic or renal impairment; lactation",
        pearl: "Monitor CBC every 2 weeks initially until stable dose established, then monthly; dose is titrated to maintain hematocrit below 45 percent and WBC above 3,000/microL; macrocytosis (high MCV) is expected and indicates medication compliance, not vitamin B12 deficiency; handle with gloves (cytotoxic agent)"
      },
      {
        name: "Aspirin (Acetylsalicylic Acid)",
        type: "Antiplatelet agent / NSAID (low-dose)",
        action: "Irreversibly acetylates cyclooxygenase-1 (COX-1) in platelets, permanently inhibiting thromboxane A2 synthesis for the entire lifespan of the platelet (7-10 days). Thromboxane A2 is a potent platelet activator and vasoconstrictor, so its inhibition reduces platelet aggregation and vasoconstriction, decreasing the risk of arterial thrombotic events. In polycythemia vera, low-dose aspirin dramatically reduces the incidence of thrombosis and provides rapid relief of erythromelalgia symptoms.",
        sideEffects: "GI irritation, dyspepsia, gastric erosions, GI bleeding (risk increases with higher doses), tinnitus at higher doses, bruising, allergic reactions in aspirin-sensitive individuals",
        contra: "Active GI bleeding or peptic ulcer disease; aspirin or NSAID allergy (including aspirin-exacerbated respiratory disease); concurrent anticoagulant therapy without clear indication; very high platelet counts (greater than 1,500,000/microL) due to risk of acquired von Willebrand syndrome with paradoxical bleeding",
        pearl: "Low-dose aspirin (81-100 mg daily) is standard for ALL polycythemia vera patients without contraindications; provides dramatic relief of erythromelalgia (burning hands and feet) within hours; take with food to minimize GI effects; withhold if platelet count exceeds 1,500,000/microL until cytoreduction brings platelets down"
      },
      {
        name: "Allopurinol (Zyloprim)",
        type: "Xanthine oxidase inhibitor (uric acid lowering agent)",
        action: "Competitively inhibits the enzyme xanthine oxidase, which catalyzes the oxidation of hypoxanthine to xanthine and xanthine to uric acid (the final step in purine metabolism). By blocking this enzyme, allopurinol reduces the production of uric acid, lowering serum urate levels and preventing the formation and deposition of monosodium urate crystals in joints (gout) and kidneys (urate nephropathy, kidney stones).",
        sideEffects: "Skin rash (most common; discontinue immediately if rash develops as it may herald Stevens-Johnson syndrome), GI upset (nausea, diarrhea), elevated liver enzymes, rare but serious hypersensitivity syndrome (allopurinol hypersensitivity syndrome: fever, rash, eosinophilia, hepatic and renal failure)",
        contra: "History of allopurinol hypersensitivity reaction; concurrent azathioprine or mercaptopurine use without dose reduction (allopurinol inhibits their metabolism, causing toxic accumulation and severe bone marrow suppression); HLA-B*5801 allele carriers (higher risk of severe hypersensitivity -- screen in high-risk populations)",
        pearl: "Start at low dose (100 mg daily) and titrate slowly to target serum uric acid below 6 mg/dL; do NOT start during an acute gout attack (can worsen the attack); adequate hydration is essential to prevent xanthine stone formation; if a rash develops, STOP immediately and notify the physician as it may progress to life-threatening Stevens-Johnson syndrome"
      }
    ],
    pearls: [
      "Polycythemia vera is a JAK2-driven myeloproliferative neoplasm with LOW EPO levels; secondary polycythemia is an EPO-driven response to chronic hypoxia with HIGH EPO levels -- EPO level is the key distinguishing test",
      "The target hematocrit in polycythemia vera is BELOW 45 PERCENT -- this is the threshold above which thrombotic risk increases dramatically; phlebotomy is performed to maintain hematocrit below this target",
      "Facial plethora (ruddy red face) is the most visible clinical sign of polycythemia -- the flushed appearance results from engorgement of superficial blood vessels with excess red blood cells",
      "Aquagenic pruritus (intense itching after warm bathing) is a hallmark symptom that may precede the diagnosis by years -- it is caused by degranulation of increased basophils and mast cells releasing histamine upon contact with warm water",
      "Erythromelalgia (burning pain and redness of hands and feet) in PV is dramatically and specifically relieved by low-dose aspirin -- this response is so characteristic that it can be diagnostic",
      "Paradoxical bleeding can occur in PV patients with extremely high platelet counts (above 1,500,000/microL) due to acquired von Willebrand syndrome -- withhold aspirin until platelets are reduced",
      "Adequate hydration (2-3 liters daily) is essential to reduce blood viscosity and promote uric acid excretion -- dehydration in a polycythemia patient can precipitate thrombotic events"
    ],
    quiz: [
      {
        question: "A practical nurse is reviewing laboratory results for a patient with suspected polycythemia vera. Which combination of findings is most consistent with this diagnosis?",
        options: [
          "Elevated hematocrit with elevated erythropoietin (EPO) level",
          "Elevated hematocrit with low or undetectable erythropoietin (EPO) level",
          "Low hematocrit with elevated erythropoietin (EPO) level",
          "Normal hematocrit with elevated white blood cell count"
        ],
        correct: 1,
        rationale: "Polycythemia vera is characterized by elevated hematocrit with LOW or undetectable EPO because the bone marrow is proliferating autonomously due to the JAK2 mutation, independent of EPO stimulation. The elevated red cell mass suppresses EPO through negative feedback. Elevated EPO with elevated hematocrit would suggest secondary polycythemia (appropriate EPO response to hypoxia)."
      },
      {
        question: "A patient with polycythemia vera reports intense itching that occurs every time they take a warm shower. How should the practical nurse document and address this symptom?",
        options: [
          "Document as allergic dermatitis and suggest switching soaps",
          "Document as aquagenic pruritus (a known PV symptom) and advise using cooler water temperature",
          "Document as contact dermatitis and apply hydrocortisone cream",
          "Document as normal variation and reassure the patient it will resolve spontaneously"
        ],
        correct: 1,
        rationale: "Aquagenic pruritus is a hallmark symptom of polycythemia vera, caused by histamine release from increased basophils and mast cells upon contact with warm water. Management includes bathing in cooler water, pat-drying, applying emollients, and antihistamines. It is NOT an allergic reaction to soap or contact dermatitis."
      },
      {
        question: "A practical nurse is assisting with therapeutic phlebotomy for a patient with polycythemia vera. What is the target hematocrit that guides the frequency of phlebotomy?",
        options: [
          "Below 55 percent",
          "Below 50 percent",
          "Below 45 percent",
          "Below 40 percent"
        ],
        correct: 2,
        rationale: "The target hematocrit in polycythemia vera is below 45 percent. Large clinical trials have demonstrated that maintaining hematocrit below 45 percent significantly reduces the rate of cardiovascular death and major thrombotic events compared to a target of 45 to 50 percent. Phlebotomy frequency is adjusted to maintain this target."
      }
    ]
  }
};

console.log("Injecting OB/Renal/Resp batch lessons...");
let ok = 0;
let fail = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) ok++;
  else fail++;
}
console.log(`Done: ${ok} injected, ${fail} skipped`);
if (fail > 0) process.exit(1);
