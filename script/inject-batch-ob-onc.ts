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
  "antepartum-complications-rpn": {
    title: "Antepartum Complications for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Antepartum Complications",
      content: "Antepartum complications encompass a range of pregnancy-related disorders that threaten maternal and fetal well-being before the onset of labor. Understanding the underlying pathophysiology of the three most critical antepartum emergencies -- placenta previa, placental abruption, and preeclampsia -- is essential for practical nurses who must recognize warning signs and initiate timely interventions within their scope of practice.\n\nPlacenta previa occurs when the placenta implants partially or completely over the internal cervical os rather than in the normal upper uterine segment. During normal implantation, the blastocyst embeds in the well-vascularized fundal region of the uterus where the endometrium (decidua) is thickest. In placenta previa, abnormal implantation in the lower uterine segment places the placenta directly over the cervix. As the lower uterine segment thins and stretches during the second and third trimesters, the placental villi are torn from the uterine wall, exposing the maternal blood sinuses at the implantation site. This results in painless, bright red vaginal bleeding that is the hallmark of placenta previa. The bleeding is painless because the placenta separates passively as the lower segment stretches -- there is no uterine muscle contraction or concealed hemorrhage causing pain. Risk factors include prior cesarean section (the scar disrupts normal endometrial vascularity), multiparity, advanced maternal age, prior placenta previa, multiple gestation, and tobacco use.\n\nPlacental abruption (abruptio placentae) is the premature separation of a normally implanted placenta from the uterine wall before delivery. The pathophysiology begins with rupture of maternal decidual arteries, creating a retroplacental hematoma (blood collection behind the placenta). As the hematoma expands, it further separates the placenta from the uterine wall, compromising the exchange surface area for oxygen and nutrient transfer to the fetus. Abruption can be classified as partial or complete, and as revealed (vaginal bleeding is visible) or concealed (blood is trapped behind the placenta with no external bleeding). Concealed abruption is particularly dangerous because the degree of hemorrhage is underestimated. In severe cases, blood infiltrates the myometrium (Couvelaire uterus), impairing uterine contractility and increasing the risk of postpartum hemorrhage. The massive release of thromboplastin from the damaged placental tissue can trigger disseminated intravascular coagulation (DIC), a life-threatening coagulopathy. Risk factors include chronic hypertension, preeclampsia, trauma to the abdomen, cocaine use, cigarette smoking, premature rupture of membranes, short umbilical cord, and prior abruption.\n\nPreeclampsia is a multisystem disorder unique to pregnancy, characterized by new-onset hypertension (systolic blood pressure 140 mmHg or greater, or diastolic 90 mmHg or greater on two occasions at least 4 hours apart) and proteinuria (300 mg or more in a 24-hour urine collection) occurring after 20 weeks of gestation. The pathophysiology originates from abnormal placentation during the first trimester. In normal pregnancy, trophoblast cells invade the spiral arteries of the uterus, remodeling them into large, low-resistance vessels that provide adequate blood flow to the placenta. In preeclampsia, this trophoblast invasion is shallow and incomplete, leaving the spiral arteries as narrow, high-resistance vessels. The resulting placental ischemia triggers the release of antiangiogenic factors (soluble fms-like tyrosine kinase-1, or sFlt-1) and inflammatory cytokines into the maternal circulation. These substances cause widespread endothelial dysfunction throughout the maternal vasculature, leading to vasospasm (hypertension), increased vascular permeability (edema, proteinuria), and activation of the coagulation cascade. End-organ damage can affect the liver (HELLP syndrome: Hemolysis, Elevated Liver enzymes, Low Platelets), kidneys (glomerular endotheliosis causing proteinuria and oliguria), brain (cerebral edema causing headache, visual changes, and seizures in eclampsia), and the coagulation system. Preeclampsia can rapidly progress to eclampsia (seizures) or HELLP syndrome, both of which are obstetric emergencies requiring immediate delivery."
    },
    riskFactors: [
      "Chronic hypertension (increases risk of preeclampsia 5-fold and abruption 2-3-fold)",
      "Prior cesarean delivery (scar tissue disrupts normal placental implantation, increasing placenta previa risk)",
      "Nulliparity for preeclampsia (first pregnancies have higher risk due to initial immune exposure to paternal antigens)",
      "Advanced maternal age over 35 years (increased risk of all three major antepartum complications)",
      "Multiple gestation (twins, triplets increase demands on placental circulation and risk of preeclampsia)",
      "Cocaine or methamphetamine use (causes acute vasospasm leading to placental abruption)",
      "Tobacco use (chronic vasoconstriction damages decidual vessels, increasing abruption and previa risk)",
      "History of preeclampsia in prior pregnancy (recurrence risk 15-25% in subsequent pregnancies)",
      "Obesity with BMI over 30 (chronic inflammatory state increases endothelial dysfunction and preeclampsia risk)",
      "Diabetes mellitus (vascular disease affects placental perfusion)"
    ],
    diagnostics: [
      "Blood pressure monitoring: serial measurements using appropriate cuff size; preeclampsia diagnosed at systolic 140 or greater or diastolic 90 or greater on two readings at least 4 hours apart after 20 weeks gestation",
      "24-hour urine collection or urine protein-to-creatinine ratio: proteinuria 300 mg or greater in 24 hours confirms preeclampsia; dipstick 2+ or greater prompts further testing",
      "Complete blood count (CBC): decreased platelets below 100,000 suggest HELLP syndrome; decreased hemoglobin may indicate hemorrhage from abruption or previa",
      "Liver function tests (AST, ALT): elevation twice normal upper limit is a criterion for HELLP syndrome; monitor in all preeclampsia patients",
      "Coagulation studies (PT, PTT, fibrinogen, D-dimer): fibrinogen below 200 mg/dL and elevated D-dimer suggest DIC from placental abruption",
      "Ultrasound: first-line imaging for placenta previa (identifies placental location relative to cervical os); may show retroplacental hematoma in abruption though sensitivity is limited",
      "Non-stress test (NST) and biophysical profile (BPP): assess fetal well-being; non-reassuring patterns (late decelerations, absent variability) indicate fetal compromise",
      "Kleihauer-Betke test: detects fetal blood cells in maternal circulation; used in Rh-negative mothers with abruption to determine RhoGAM dose"
    ],
    management: [
      "Placenta previa: strict pelvic rest (no vaginal exams, no intercourse), bedrest as ordered, prepare for cesarean delivery; vaginal delivery is contraindicated with complete previa",
      "Placental abruption: immediate IV access with two large-bore catheters, aggressive fluid resuscitation, continuous fetal monitoring, prepare for emergency cesarean if fetal distress or maternal hemodynamic instability",
      "Preeclampsia: magnesium sulfate for seizure prophylaxis (loading dose 4-6 g IV over 20-30 minutes, then maintenance 1-2 g/hour), antihypertensive therapy if systolic 160 or greater or diastolic 110 or greater",
      "Administer betamethasone 12 mg IM x 2 doses 24 hours apart if preterm delivery anticipated (24-34 weeks) to accelerate fetal lung maturity",
      "Type and crossmatch blood products for all patients with active bleeding; maintain at least 2 units packed red blood cells available",
      "Definitive treatment for severe preeclampsia and eclampsia is DELIVERY of the fetus and placenta -- this is the only cure",
      "Monitor strict intake and output; insert Foley catheter; report urine output less than 30 mL/hour (indicates renal compromise in preeclampsia)"
    ],
    nursingActions: [
      "Monitor blood pressure every 15 minutes during acute episodes of hypertension or active bleeding; report systolic 160 or greater or diastolic 110 or greater immediately",
      "Assess for signs of magnesium toxicity every 1-2 hours: loss of deep tendon reflexes (first sign), respiratory depression (below 12 breaths/minute), decreased urine output, cardiac arrest -- keep calcium gluconate at bedside as antidote",
      "Monitor fetal heart rate continuously with electronic fetal monitoring; report late decelerations, prolonged decelerations, or absent variability immediately",
      "Maintain the patient on strict bedrest in left lateral position to optimize uteroplacental perfusion and prevent vena cava compression",
      "Weigh and save all perineal pads to estimate blood loss; report saturating more than one pad per hour",
      "Maintain seizure precautions for all preeclampsia patients: padded side rails, suction equipment at bedside, oxygen and airway management equipment ready, dim lights, minimize stimulation",
      "Report headache, visual disturbances (scotomata, blurred vision), epigastric or right upper quadrant pain, and hyperreflexia immediately -- these are warning signs of impending eclampsia or HELLP syndrome",
      "Never perform digital vaginal examination on a patient with known or suspected placenta previa -- this can precipitate massive hemorrhage"
    ],
    assessmentFindings: [
      "Placenta previa: painless, bright red vaginal bleeding (usually in third trimester); soft, non-tender uterus; normal fetal heart tones unless hemorrhage is severe",
      "Placental abruption: painful, dark red vaginal bleeding (may be concealed); rigid, board-like uterus with severe tenderness; uterine hypertonicity; fetal distress or absent fetal heart tones in complete abruption",
      "Preeclampsia: elevated blood pressure, proteinuria, generalized edema (especially facial and periorbital), rapid weight gain (more than 2 pounds per week), headache, visual changes",
      "Severe preeclampsia or impending eclampsia: severe persistent headache unrelieved by acetaminophen, visual disturbances (flashing lights, scotomata), epigastric or RUQ pain (liver capsule distension), hyperreflexia with clonus",
      "HELLP syndrome: right upper quadrant or epigastric pain, nausea, vomiting, malaise; labs show hemolysis (elevated LDH, schistocytes on smear), elevated liver enzymes, platelets below 100,000",
      "Signs of hypovolemic shock from hemorrhage: tachycardia, hypotension, pallor, diaphoresis, altered level of consciousness, decreased urine output",
      "Fetal compromise: non-reassuring fetal heart rate patterns including late decelerations (uteroplacental insufficiency), decreased variability, and bradycardia"
    ],
    signs: {
      left: [
        "Mild hypertension (BP 140-159/90-109 mmHg)",
        "Trace to 1+ proteinuria on dipstick",
        "Mild peripheral edema (ankles, feet)",
        "Rapid weight gain (more than 2 lbs/week)",
        "Mild vaginal spotting or single episode of painless bleeding",
        "Mild headache responsive to acetaminophen"
      ],
      right: [
        "Severe hypertension (BP 160/110 mmHg or higher)",
        "Active bright red vaginal hemorrhage soaking more than 1 pad/hour",
        "Rigid, board-like, tender uterus (abruption)",
        "Seizure activity (eclampsia)",
        "Loss of deep tendon reflexes during magnesium therapy (toxicity)",
        "Non-reassuring fetal heart rate (late decelerations, bradycardia)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / tocolytic",
        action: "Blocks neuromuscular transmission by competing with calcium at the motor end plate, reducing acetylcholine release and raising the seizure threshold; also causes smooth muscle relaxation and mild vasodilation which can reduce blood pressure slightly",
        sideEffects: "Flushing, warmth, sweating, nausea, hypotension, decreased deep tendon reflexes, respiratory depression, cardiac arrest at toxic levels",
        contra: "Myasthenia gravis (worsens neuromuscular blockade); severe renal impairment (magnesium excreted by kidneys -- requires dose adjustment); heart block",
        pearl: "Therapeutic serum level is 4-7 mEq/L; monitor reflexes (loss of patellar reflex is the FIRST sign of toxicity), respiratory rate (hold if below 12), and urine output (hold if below 30 mL/hour); ALWAYS keep calcium gluconate 1 g IV at bedside as the direct antidote for magnesium toxicity"
      },
      {
        name: "Labetalol (Trandate)",
        type: "Combined alpha-1 and beta-adrenergic blocker / antihypertensive",
        action: "Blocks both alpha-1 adrenergic receptors (causing peripheral vasodilation and decreased systemic vascular resistance) and beta-1 receptors (decreasing heart rate and cardiac output); lowers blood pressure without significantly reducing uteroplacental blood flow",
        sideEffects: "Orthostatic hypotension, dizziness, fatigue, bradycardia, nausea, bronchospasm (beta-blockade effect), neonatal hypoglycemia and bradycardia if given close to delivery",
        contra: "Asthma or severe reactive airway disease (beta-blockade causes bronchospasm); heart block greater than first degree; cardiogenic shock; decompensated heart failure",
        pearl: "First-line IV antihypertensive for severe hypertension in pregnancy (systolic 160 or greater or diastolic 110 or greater); give 20 mg IV push over 2 minutes, may repeat with escalating doses (40 mg, then 80 mg) every 10 minutes; maximum 300 mg total; keep patient supine during administration and monitor for orthostatic hypotension"
      },
      {
        name: "Betamethasone",
        type: "Corticosteroid / fetal lung maturation agent",
        action: "Crosses the placenta and binds to glucocorticoid receptors in fetal type II pneumocytes, stimulating production of surfactant (a mixture of phospholipids and proteins that reduces alveolar surface tension and prevents alveolar collapse at birth); accelerates fetal lung maturation to reduce the risk and severity of neonatal respiratory distress syndrome",
        sideEffects: "Maternal hyperglycemia (significant in diabetic patients -- monitor blood glucose closely), transient leukocytosis (white blood cell count may rise, mimicking infection), insomnia, increased appetite; temporary decrease in fetal heart rate variability (non-reassuring NST pattern for 24-48 hours after administration)",
        contra: "Active systemic fungal infection; generally avoided after 37 weeks gestation (fetal lungs are mature); use with caution in maternal diabetes (requires insulin adjustment)",
        pearl: "Administer 12 mg IM, two doses 24 hours apart, when preterm delivery is anticipated between 24-34 weeks gestation; maximum benefit occurs 48 hours after the second dose; a single rescue course may be considered if more than 14 days have elapsed since the initial course and preterm delivery remains likely"
      }
    ],
    pearls: [
      "NEVER perform a digital vaginal examination on a patient with suspected placenta previa -- this can rupture placental vessels overlying the cervix and cause catastrophic hemorrhage; use ultrasound to confirm placental location first",
      "The classic presentation of placenta previa is PAINLESS bright red bleeding; abruption presents with PAINFUL dark red bleeding and a rigid uterus -- this distinction is critical for rapid differential diagnosis",
      "Magnesium sulfate toxicity progresses in a predictable sequence: loss of deep tendon reflexes (8-12 mEq/L), respiratory depression (12-15 mEq/L), cardiac arrest (greater than 15 mEq/L) -- assess patellar reflexes before EVERY dose",
      "Calcium gluconate 1 g IV is the direct antidote for magnesium toxicity -- it must be immediately available at the bedside of any patient receiving magnesium sulfate infusion",
      "The ONLY cure for preeclampsia is delivery of the fetus and placenta -- all other interventions (antihypertensives, magnesium sulfate) are temporizing measures to prevent maternal complications while optimizing fetal maturity",
      "HELLP syndrome can occur WITHOUT significant hypertension or proteinuria -- always consider HELLP when a pregnant patient presents with epigastric or RUQ pain, nausea, and malaise, even with normal blood pressure",
      "After betamethasone administration, expect temporarily decreased fetal heart rate variability on the non-stress test for 24-48 hours -- this is a known pharmacological effect, not necessarily fetal distress, but must be documented and communicated to the healthcare team"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient at 32 weeks gestation who presents with sudden-onset painless bright red vaginal bleeding. Which action should the practical nurse perform FIRST?",
        options: [
          "Perform a sterile vaginal examination to assess cervical dilation",
          "Apply the electronic fetal monitor and notify the physician immediately",
          "Administer oxytocin to stimulate uterine contractions",
          "Encourage the patient to ambulate to determine the source of bleeding"
        ],
        correct: 1,
        rationale: "Painless bright red bleeding in the third trimester is the classic presentation of placenta previa. The priority is to assess fetal well-being with continuous electronic fetal monitoring and notify the physician immediately. A vaginal examination is CONTRAINDICATED in suspected placenta previa because it can cause massive hemorrhage by disrupting placental vessels over the cervix."
      },
      {
        question: "A patient receiving magnesium sulfate for preeclampsia has a respiratory rate of 10 breaths per minute and absent patellar reflexes. Which intervention should the practical nurse perform FIRST?",
        options: [
          "Increase the magnesium sulfate infusion rate",
          "Stop the magnesium sulfate infusion and notify the physician",
          "Reposition the patient to the left lateral position",
          "Administer a bolus of IV normal saline"
        ],
        correct: 1,
        rationale: "Respiratory depression (below 12 breaths/minute) and loss of deep tendon reflexes are signs of magnesium toxicity. The immediate action is to STOP the infusion and notify the physician. Calcium gluconate should be available as the antidote. Continuing or increasing the infusion could cause respiratory arrest and cardiac arrest."
      },
      {
        question: "A pregnant patient at 30 weeks gestation with severe preeclampsia is prescribed betamethasone. The practical nurse understands that the primary purpose of this medication is to:",
        options: [
          "Lower the maternal blood pressure",
          "Prevent seizures in the mother",
          "Accelerate fetal lung maturity in case of preterm delivery",
          "Stop uterine contractions to prolong the pregnancy"
        ],
        correct: 2,
        rationale: "Betamethasone is a corticosteroid administered to stimulate fetal surfactant production and accelerate lung maturity when preterm delivery is anticipated between 24-34 weeks gestation. It does not lower blood pressure (antihypertensives do that), prevent seizures (magnesium sulfate does that), or stop contractions (tocolytics do that)."
      }
    ]
  },

  "apgar-assessment-rpn": {
    title: "APGAR Scoring and Neonatal Assessment for Practical Nurses",
    cellular: {
      title: "Physiology of Neonatal Transition and the APGAR Scoring System",
      content: "The transition from intrauterine to extrauterine life is the most complex physiological adaptation a human being undergoes. Within seconds to minutes of birth, the neonate must transition from dependence on the placenta for gas exchange to independent pulmonary respiration, and the cardiovascular system must convert from a parallel fetal circulation to a series adult circulation. Understanding these transition mechanisms is essential to appreciating what the APGAR score measures and why rapid assessment is critical.\n\nIn utero, the fetal lungs are filled with approximately 30 mL/kg of lung fluid produced by the pulmonary epithelium. The fetal pulmonary vascular resistance is very high (because the fluid-filled alveoli compress the capillaries), so only about 10% of cardiac output flows through the fetal lungs. The majority of oxygenated blood from the placenta bypasses the lungs through two shunts: the foramen ovale (an opening between the right and left atria) and the ductus arteriosus (a vessel connecting the pulmonary artery to the aorta). At birth, the first breath generates a negative intrathoracic pressure of -40 to -100 cmH2O, which draws air into the alveoli, displaces lung fluid, and establishes the functional residual capacity. The air-liquid interface in the alveoli activates surfactant (produced by type II pneumocytes beginning around 24-28 weeks and reaching adequate levels by 34-36 weeks), which reduces surface tension and prevents alveolar collapse during expiration. As the alveoli inflate and oxygen enters the pulmonary capillaries, pulmonary vascular resistance drops dramatically, increasing pulmonary blood flow from 10% to nearly 100% of cardiac output. Simultaneously, clamping the umbilical cord removes the low-resistance placental circulation, increasing systemic vascular resistance. The combination of increased left atrial pressure (from increased pulmonary venous return) and decreased right atrial pressure causes functional closure of the foramen ovale. The increased PaO2 in arterial blood triggers constriction and eventual closure of the ductus arteriosus (this process is mediated by decreased prostaglandin E2 and increased oxygen levels).\n\nThe APGAR scoring system, developed by Dr. Virginia Apgar in 1952, provides a rapid, standardized method for evaluating a newborn's condition at 1 and 5 minutes after birth. The acronym represents five assessment parameters: Appearance (skin color), Pulse (heart rate), Grimace (reflex irritability), Activity (muscle tone), and Respiration (respiratory effort). Each parameter is scored 0, 1, or 2, with a maximum total score of 10. The 1-minute APGAR reflects the newborn's immediate transition and the need for resuscitation. The 5-minute APGAR evaluates the response to any interventions and ongoing adaptation. If the 5-minute score is below 7, additional assessments are performed every 5 minutes for up to 20 minutes. A score of 7-10 indicates a vigorous, well-adapted newborn; 4-6 indicates moderate depression requiring some intervention; 0-3 indicates severe depression requiring immediate resuscitation.\n\nNeonatal resuscitation follows the Neonatal Resuscitation Program (NRP) algorithm. The initial steps include providing warmth (radiant warmer), positioning the head in a neutral sniffing position to open the airway, clearing secretions only if needed (routine suctioning is no longer recommended), drying the infant thoroughly, and stimulating by rubbing the back or flicking the soles of the feet. If the newborn remains apneic or has a heart rate below 100 beats per minute after initial steps, positive pressure ventilation (PPV) with room air or blended oxygen is initiated. Ventilation is the single most important step in neonatal resuscitation because the vast majority of newborns who need resuscitation respond to effective ventilation alone. If the heart rate remains below 60 beats per minute despite 30 seconds of effective PPV, chest compressions are initiated (3:1 ratio of compressions to ventilations, or 90 compressions and 30 breaths per minute). Epinephrine is indicated if the heart rate remains below 60 beats per minute despite adequate ventilation and chest compressions."
    },
    riskFactors: [
      "Preterm birth (less than 37 weeks): immature lungs with insufficient surfactant production, weak respiratory muscles, and immature thermoregulation",
      "Meconium-stained amniotic fluid: risk of meconium aspiration syndrome if the newborn aspirates thick meconium into the airways before or during delivery",
      "Maternal opioid administration within 4 hours of delivery: opioids cross the placenta and can cause neonatal respiratory depression",
      "Prolonged or difficult labor: increased risk of fetal hypoxia from prolonged cord compression, uterine tachysystole, or placental insufficiency",
      "Maternal diabetes: macrosomic infants at risk for birth trauma, hypoglycemia, and polycythemia; infants of diabetic mothers may have delayed surfactant maturation",
      "Multiple gestation: second twin and subsequent neonates have higher risk of birth asphyxia and need for resuscitation",
      "Placental abruption or placenta previa: reduced placental blood flow causes fetal hypoxia before delivery",
      "Maternal general anesthesia: anesthetic agents cross the placenta and may depress neonatal respiratory drive and muscle tone",
      "Congenital anomalies: structural abnormalities (diaphragmatic hernia, cardiac defects, airway malformations) can impair neonatal transition"
    ],
    diagnostics: [
      "APGAR scoring at 1 and 5 minutes: assess Appearance, Pulse, Grimace, Activity, Respiration; each scored 0-2; total score guides level of intervention needed",
      "Pulse oximetry: apply to right hand (pre-ductal) within first minutes of life; normal SpO2 at 1 minute is 60-65%, rising to 85-95% by 10 minutes; pre-ductal and post-ductal comparison screens for critical congenital heart disease",
      "Blood glucose testing: heel stick capillary glucose within first 1-2 hours for at-risk neonates (preterm, LGA, SGA, infants of diabetic mothers); hypoglycemia defined as below 40 mg/dL in first 4 hours, below 45 mg/dL after 4 hours",
      "Arterial blood gas from umbilical cord: pH below 7.0 and base deficit greater than 12 indicate significant birth asphyxia; obtained when resuscitation is required",
      "Complete blood count: evaluate for polycythemia (hematocrit above 65%), anemia, infection (elevated or depressed WBC with immature-to-total neutrophil ratio)",
      "Newborn screening tests: state-mandated metabolic screening (PKU, congenital hypothyroidism, galactosemia, sickle cell disease) collected at 24-48 hours of age",
      "Critical congenital heart disease screening: pulse oximetry on right hand and either foot at 24-48 hours; fail if SpO2 below 90% in either extremity or difference greater than 3% between pre-ductal and post-ductal"
    ],
    management: [
      "Maintain thermoregulation: dry the newborn immediately and thoroughly, skin-to-skin contact with the mother or place under radiant warmer, apply hat to reduce heat loss from the head (the head represents a large percentage of neonatal body surface area)",
      "Initiate NRP algorithm if the newborn does not cry, breathe, or has poor tone: warm, dry, stimulate, position airway, suction only if needed, and reassess within 30 seconds",
      "Begin positive pressure ventilation (PPV) at 21-30% FiO2 if the newborn is apneic or has heart rate below 100 bpm after initial steps; ventilation is the most important intervention in neonatal resuscitation",
      "Initiate chest compressions if heart rate remains below 60 bpm after 30 seconds of effective PPV; use two-thumb encircling technique, compress one-third of the anterior-posterior chest diameter, at 3:1 compression-to-ventilation ratio",
      "Administer epinephrine 0.01-0.03 mg/kg IV (via umbilical venous catheter preferred) if heart rate remains below 60 bpm despite adequate ventilation and chest compressions",
      "Monitor blood glucose and initiate early feeding or IV dextrose for at-risk neonates to prevent hypoglycemia",
      "Administer vitamin K (phytonadione) 0.5-1 mg IM within first hour to prevent hemorrhagic disease of the newborn; apply erythromycin 0.5% ophthalmic ointment for ophthalmia neonatorum prophylaxis"
    ],
    nursingActions: [
      "Prepare the resuscitation area BEFORE every delivery: check radiant warmer is on, suction equipment functioning, bag-mask device with appropriate size mask available, oxygen source connected, and medications drawn up for high-risk deliveries",
      "Perform APGAR assessment at exactly 1 minute and 5 minutes after birth; if 5-minute score is below 7, repeat every 5 minutes until 20 minutes or until two consecutive scores of 7 or above",
      "Assess heart rate by auscultating the apical pulse or palpating the base of the umbilical cord -- heart rate is the most important indicator of successful resuscitation and guides all subsequent interventions",
      "Maintain strict thermoregulation: dry thoroughly, remove wet linens, skin-to-skin or radiant warmer, cover the head; preterm infants below 32 weeks should be placed in a polyethylene bag without drying to prevent hypothermia",
      "Monitor respiratory effort continuously during the first hours: note rate (normal 30-60 breaths/minute), rhythm, presence of retractions (subcostal, intercostal, suprasternal), nasal flaring, or grunting",
      "Apply identification bands to the newborn and mother before separation; verify two identifiers at every transfer of care",
      "Document all resuscitation efforts with exact times: when PPV started, medications administered, heart rate responses, and APGAR scores",
      "Monitor for signs of neonatal distress in the first 2-4 hours: tachypnea (above 60/min), grunting, nasal flaring, retractions, central cyanosis, temperature instability, poor feeding, or lethargy"
    ],
    assessmentFindings: [
      "Normal newborn: vigorous cry at birth, flexed posture (good muscle tone), heart rate above 100 bpm (normal 120-160 bpm), pink body color (acrocyanosis of hands and feet is normal in first 24-48 hours), strong reflex response to stimulation",
      "Mildly depressed newborn (APGAR 4-6): weak or irregular respiratory effort, some muscle tone but reduced flexion, heart rate above 100 bpm, body pink with cyanotic extremities, grimace or weak cry with stimulation",
      "Severely depressed newborn (APGAR 0-3): absent respiratory effort (apneic), limp with no muscle tone, heart rate absent or below 100 bpm, pale or cyanotic throughout, no response to stimulation",
      "Signs of respiratory distress: tachypnea (above 60 breaths/min), nasal flaring, intercostal and subcostal retractions, expiratory grunting (infant is creating auto-PEEP to keep alveoli open), see-saw breathing pattern",
      "Signs of cold stress: central cyanosis, poor feeding, lethargy, hypoglycemia (cold stress depletes glycogen stores), metabolic acidosis (shivering is not a reliable sign in neonates -- they use non-shivering thermogenesis via brown fat metabolism)",
      "Jitteriness vs. seizure: jitteriness is stimulus-sensitive, ceases with gentle flexion of the affected limb, and involves bilateral tremors; seizures are not stimulus-dependent, cannot be stopped with flexion, and may involve abnormal eye movements"
    ],
    signs: {
      left: [
        "Acrocyanosis (blue hands and feet with pink trunk -- normal in first 24-48 hours)",
        "Mild nasal flaring or periodic breathing (pauses less than 20 seconds)",
        "Jitteriness or tremors in the first 24 hours",
        "Capillary refill 2-3 seconds",
        "Mild tachypnea (60-70 breaths/min) that resolves within 4-6 hours (transient tachypnea of the newborn)",
        "Slightly decreased muscle tone in extremities"
      ],
      right: [
        "Central cyanosis (blue trunk, lips, tongue -- indicates hypoxemia)",
        "Apnea (cessation of breathing for 20 seconds or more, or any pause with bradycardia or desaturation)",
        "Heart rate below 100 bpm (bradycardia -- indicates severe compromise)",
        "Severe retractions with grunting (signs of significant respiratory distress)",
        "Flaccid tone (limp body -- indicates severe depression)",
        "Seizure activity (rhythmic movements not suppressible by flexion)"
      ]
    },
    medications: [
      {
        name: "Epinephrine (Adrenaline)",
        type: "Sympathomimetic / catecholamine",
        action: "Stimulates alpha-1 adrenergic receptors causing vasoconstriction which increases aortic diastolic pressure and improves coronary and cerebral perfusion; stimulates beta-1 receptors increasing heart rate and contractility; the primary goal in neonatal resuscitation is to increase coronary perfusion pressure to restart the heart",
        sideEffects: "Tachycardia, hypertension, cardiac arrhythmias, tissue necrosis if extravasation occurs, hyperglycemia",
        contra: "No absolute contraindications in neonatal cardiac arrest; hypovolemia should be corrected simultaneously with volume expansion",
        pearl: "Used ONLY when heart rate remains below 60 bpm despite 30 seconds of effective ventilation AND chest compressions; preferred route is IV via umbilical venous catheter (0.01-0.03 mg/kg of 1:10,000 concentration); endotracheal dose is higher (0.05-0.1 mg/kg) but absorption is unreliable -- IV is always preferred"
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid antagonist",
        action: "Competitively binds to mu, kappa, and delta opioid receptors throughout the central and peripheral nervous system, displacing opioid agonists and rapidly reversing their effects including respiratory depression, sedation, and decreased muscle tone; crosses the blood-brain barrier rapidly",
        sideEffects: "Acute opioid withdrawal in opioid-dependent neonates (tremors, seizures, irritability, vomiting, diarrhea, tachycardia), tachycardia, hypertension, pulmonary edema (rare)",
        contra: "CONTRAINDICATED in neonates born to opioid-dependent mothers -- naloxone will precipitate acute withdrawal syndrome which can cause seizures and death; do NOT use as a substitute for adequate ventilatory support",
        pearl: "No longer routinely recommended in the NRP algorithm; if used, administer 0.1 mg/kg IV or IM; duration of action (30-90 minutes) may be shorter than the opioid causing depression, so the neonate must be monitored for recurrent respiratory depression and may need repeat doses; ventilatory support is ALWAYS the priority over naloxone administration"
      },
      {
        name: "Surfactant (Beractant / Calfactant / Poractant alfa)",
        type: "Pulmonary surfactant replacement",
        action: "Replaces deficient or dysfunctional endogenous surfactant in the premature lung; surfactant is a complex mixture of phospholipids (primarily dipalmitoylphosphatidylcholine) and surfactant proteins (SP-A, SP-B, SP-C, SP-D) that reduces alveolar surface tension at the air-liquid interface, preventing alveolar collapse during expiration and maintaining functional residual capacity",
        sideEffects: "Transient bradycardia and oxygen desaturation during administration (due to airway obstruction by the liquid bolus), pulmonary hemorrhage (rare), mucus plugging of the endotracheal tube",
        contra: "No absolute contraindications in premature infants with respiratory distress syndrome; use with caution in infants with active pulmonary hemorrhage",
        pearl: "Administered via endotracheal tube as a liquid bolus directly into the lungs; given as prophylaxis in extremely premature infants (less than 26-28 weeks) or as rescue therapy when respiratory distress develops; rapid improvement in oxygenation and compliance typically occurs within minutes -- the ventilator settings must be reduced promptly to avoid pneumothorax from over-distension"
      }
    ],
    pearls: [
      "The APGAR score is an ASSESSMENT tool, not a predictor of long-term neurological outcome -- it guides immediate resuscitation needs; a single low score does not predict cerebral palsy or developmental delay",
      "Heart rate is the MOST IMPORTANT indicator of effective neonatal resuscitation -- all decisions in the NRP algorithm are driven by the heart rate response; auscultate the apical pulse or use pulse oximetry for continuous monitoring",
      "Ventilation is the SINGLE MOST IMPORTANT intervention in neonatal resuscitation -- the vast majority of neonates who fail to transition respond to effective positive pressure ventilation; always ensure ventilation is adequate before moving to chest compressions",
      "The mnemonic for APGAR is: A = Appearance (skin color), P = Pulse (heart rate), G = Grimace (reflex irritability), A = Activity (muscle tone), R = Respiration (respiratory effort) -- score each parameter 0, 1, or 2",
      "Normal SpO2 targets in the first 10 minutes of life are LOWER than adult values: 60-65% at 1 minute, 65-70% at 2 minutes, 70-75% at 3 minutes, 75-80% at 4 minutes, 80-85% at 5 minutes, and 85-95% at 10 minutes -- do not overreact to seemingly low saturations immediately after birth",
      "Neonates do NOT shiver to generate heat -- they rely on non-shivering thermogenesis through metabolism of brown fat (brown adipose tissue); cold stress depletes glycogen stores and causes hypoglycemia, metabolic acidosis, and increased oxygen consumption",
      "NEVER administer naloxone to a neonate born to a mother with known or suspected opioid dependence -- this will precipitate acute withdrawal syndrome with potentially fatal seizures; provide ventilatory support instead"
    ],
    quiz: [
      {
        question: "A newborn at 1 minute of age has a heart rate of 80 bpm, slow irregular respirations, some muscle flexion, a grimace with suctioning, and a blue body with blue extremities. What is the 1-minute APGAR score?",
        options: [
          "3",
          "4",
          "5",
          "6"
        ],
        correct: 1,
        rationale: "Scoring: Heart rate 80 bpm (below 100) = 1; Slow irregular respirations = 1; Some flexion = 1; Grimace = 1; Blue body = 0. Total APGAR = 4. This newborn is moderately depressed and requires stimulation and likely positive pressure ventilation."
      },
      {
        question: "During neonatal resuscitation, a practical nurse has dried and stimulated a newborn who remains apneic with a heart rate of 90 bpm. What is the MOST important next intervention?",
        options: [
          "Administer epinephrine via the umbilical vein",
          "Begin chest compressions at a 3:1 ratio",
          "Initiate positive pressure ventilation with room air or blended oxygen",
          "Administer naloxone to reverse possible maternal opioid effects"
        ],
        correct: 2,
        rationale: "Positive pressure ventilation (PPV) is the single most important intervention in neonatal resuscitation. When a newborn remains apneic after initial steps (warm, dry, stimulate), PPV should be initiated immediately. Epinephrine and chest compressions are reserved for heart rate below 60 bpm despite effective ventilation. Naloxone is no longer routinely recommended in the NRP algorithm."
      },
      {
        question: "A practical nurse is monitoring a preterm newborn under a radiant warmer. Which finding indicates the newborn is experiencing cold stress?",
        options: [
          "Shivering and visible tremors",
          "Flushed skin with diaphoresis",
          "Hypoglycemia, central cyanosis, and metabolic acidosis",
          "Tachycardia with warm extremities"
        ],
        correct: 2,
        rationale: "Cold stress in neonates presents with hypoglycemia (brown fat metabolism depletes glycogen), central cyanosis (increased oxygen consumption), and metabolic acidosis. Neonates do NOT shiver -- they use non-shivering thermogenesis via brown fat. Flushed skin with sweating would suggest hyperthermia."
      }
    ]
  },

  "cancer-basics-staging-rpn": {
    title: "Cancer Basics and Staging for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Cancer and the Cellular Basis of Malignancy",
      content: "Cancer is fundamentally a disease of uncontrolled cellular proliferation arising from accumulated genetic mutations that disrupt the normal regulatory mechanisms governing cell growth, differentiation, and death. Understanding the cellular basis of malignancy is essential for practical nurses who care for oncology patients across all clinical settings.\n\nNormal cells progress through the cell cycle -- a tightly regulated series of phases (G1, S, G2, and M phase) governed by cyclins, cyclin-dependent kinases (CDKs), and checkpoint proteins. Tumor suppressor genes (most notably p53, the so-called guardian of the genome, and Rb, the retinoblastoma protein) act as brakes on the cell cycle, halting progression when DNA damage is detected and triggering either DNA repair or apoptosis (programmed cell death). Proto-oncogenes are normal genes that code for proteins promoting cell growth and division; when mutated, they become oncogenes that produce constitutively active growth signals, driving uncontrolled proliferation. Cancer develops when the balance between growth-promoting oncogenes and growth-inhibiting tumor suppressor genes is disrupted, typically requiring multiple mutations (the multi-hit hypothesis).\n\nThe hallmarks of cancer describe the acquired capabilities that distinguish malignant cells from normal cells: sustained proliferative signaling (oncogene activation), evasion of growth suppressors (tumor suppressor inactivation), resistance to cell death (defective apoptosis pathways), replicative immortality (activation of telomerase, which prevents the shortening of telomeres that normally limits cell division), induction of angiogenesis (tumors stimulate new blood vessel formation through vascular endothelial growth factor, or VEGF, to supply nutrients and oxygen), and activation of invasion and metastasis (cancer cells break through basement membranes, enter blood vessels or lymphatics, and establish secondary tumors at distant sites).\n\nMetastasis is the process by which cancer cells spread from the primary tumor to distant organs and is responsible for approximately 90% of cancer-related deaths. The metastatic cascade involves local invasion (cancer cells secrete matrix metalloproteinases that degrade the extracellular matrix and basement membrane), intravasation (cancer cells enter blood vessels or lymphatic channels), survival in circulation (cancer cells must evade immune surveillance and withstand shear forces in the bloodstream), extravasation (cancer cells exit the vasculature at a distant site), and colonization (cancer cells proliferate at the new site, establishing a secondary tumor with its own blood supply). Common patterns of metastasis include breast cancer spreading to bone, brain, liver, and lungs; lung cancer spreading to brain, bone, liver, and adrenal glands; colon cancer spreading to liver and lungs; and prostate cancer spreading to bone.\n\nCancer staging is the standardized process of determining the extent of cancer spread at the time of diagnosis. The TNM staging system is the most widely used classification: T (Tumor) describes the size and extent of the primary tumor (T0 = no evidence of primary tumor, T1-T4 = increasing size or local extension); N (Nodes) describes the extent of regional lymph node involvement (N0 = no regional lymph node metastasis, N1-N3 = increasing lymph node involvement); and M (Metastasis) describes the presence or absence of distant metastasis (M0 = no distant metastasis, M1 = distant metastasis present). The TNM values are combined to assign an overall stage (Stage 0 through Stage IV), with Stage 0 representing carcinoma in situ (pre-invasive), Stage I-II representing localized disease, Stage III representing locally advanced disease with regional spread, and Stage IV representing distant metastatic disease. Accurate staging guides treatment decisions, determines prognosis, and enables standardized communication among healthcare providers.\n\nThe American Cancer Society uses the mnemonic CAUTION UP to teach early warning signs of cancer: Change in bowel or bladder habits, A sore that does not heal, Unusual bleeding or discharge, Thickening or lump in the breast or elsewhere, Indigestion or difficulty swallowing, Obvious change in a wart or mole, Nagging cough or hoarseness, Unexplained weight loss, and Pernicious anemia or persistent fatigue. Recognizing these warning signs enables early detection, which significantly improves survival for most cancers."
    },
    riskFactors: [
      "Tobacco use: the single most preventable cause of cancer; linked to lung, mouth, throat, esophageal, bladder, kidney, pancreatic, and cervical cancers through carcinogenic compounds (polycyclic aromatic hydrocarbons, nitrosamines) that cause direct DNA damage",
      "Excessive alcohol consumption: increases risk of liver, breast, colorectal, oral, and esophageal cancers; alcohol is metabolized to acetaldehyde, a known carcinogen that damages DNA and interferes with DNA repair",
      "Obesity and physical inactivity: associated with increased risk of breast, colon, endometrial, kidney, and esophageal cancers through chronic inflammation, elevated insulin and IGF-1 levels, and increased estrogen production from adipose tissue",
      "Family history and genetic predisposition: BRCA1/BRCA2 mutations increase breast and ovarian cancer risk; Lynch syndrome increases colorectal and endometrial cancer risk; Li-Fraumeni syndrome (p53 mutation) increases risk of multiple cancer types",
      "Chronic infections: HPV (cervical, oropharyngeal cancers), Hepatitis B and C (hepatocellular carcinoma), H. pylori (gastric cancer), EBV (Burkitt lymphoma, nasopharyngeal carcinoma), HIV (Kaposi sarcoma, non-Hodgkin lymphoma)",
      "Environmental and occupational exposures: UV radiation (melanoma, basal cell and squamous cell skin cancers), asbestos (mesothelioma, lung cancer), radon (lung cancer), benzene (leukemia), formaldehyde (nasopharyngeal cancer)",
      "Immunosuppression: organ transplant recipients on chronic immunosuppressive therapy and HIV/AIDS patients have significantly increased cancer risk due to impaired immune surveillance",
      "Age: cancer incidence increases with age due to accumulated genetic mutations, decreased DNA repair efficiency, and prolonged exposure to carcinogens; median age at cancer diagnosis is 66 years",
      "Hormonal factors: prolonged estrogen exposure (early menarche, late menopause, nulliparity, hormone replacement therapy) increases breast and endometrial cancer risk"
    ],
    diagnostics: [
      "Biopsy (definitive diagnostic test): tissue sample obtained by excision, incision, core needle, or fine needle aspiration; examined histologically to determine cell type, grade, and molecular markers; only a biopsy can confirm cancer diagnosis",
      "Imaging studies: CT scan (identifies tumor size, location, and lymph node involvement), MRI (superior soft tissue contrast, especially for brain and spine tumors), PET scan (uses radioactive glucose tracer to identify metabolically active cancer cells throughout the body -- used for staging and monitoring treatment response)",
      "Tumor markers (blood tests): PSA (prostate cancer screening and monitoring), CA-125 (ovarian cancer), CEA (colorectal cancer), AFP (liver cancer and testicular cancer), CA 19-9 (pancreatic cancer); tumor markers are used for monitoring treatment response and recurrence, NOT for definitive diagnosis",
      "Complete blood count with differential: may reveal anemia (chronic disease, bone marrow infiltration), thrombocytopenia (bone marrow suppression), or leukocytosis; abnormal cells (blasts) on peripheral smear suggest hematologic malignancy",
      "Comprehensive metabolic panel: assess liver function (metastatic liver involvement), renal function (baseline before nephrotoxic chemotherapy), calcium (hypercalcemia is a common paraneoplastic syndrome, especially in squamous cell lung cancer and breast cancer with bone metastases)",
      "Chest X-ray: baseline screening for lung masses, mediastinal lymphadenopathy, pleural effusion, and pulmonary metastases",
      "Bone scan: nuclear medicine study using technetium-99m to detect skeletal metastases; indicated for cancers with high propensity for bone spread (breast, prostate, lung)"
    ],
    management: [
      "Surgery: primary treatment for many solid tumors; goal is complete resection with clear surgical margins; may be curative for early-stage localized disease or palliative to relieve symptoms in advanced disease",
      "Chemotherapy: systemic drug therapy that targets rapidly dividing cells; administered in cycles (treatment period followed by recovery period to allow normal cell regeneration); may be neoadjuvant (before surgery to shrink tumor), adjuvant (after surgery to eliminate microscopic disease), or palliative",
      "Radiation therapy: uses ionizing radiation to damage cancer cell DNA; can be external beam (delivered from outside the body) or brachytherapy (radioactive source placed inside or near the tumor); may be curative or palliative",
      "Immunotherapy: harnesses the patient's immune system to recognize and destroy cancer cells; includes checkpoint inhibitors (pembrolizumab, nivolumab), monoclonal antibodies, and CAR-T cell therapy",
      "Targeted therapy: drugs designed to interfere with specific molecular targets involved in cancer growth and progression (HER2 inhibitors for HER2-positive breast cancer, EGFR inhibitors for certain lung cancers, BCR-ABL inhibitors for chronic myeloid leukemia)",
      "Hormonal therapy: blocks or removes hormones that fuel certain cancers (tamoxifen and aromatase inhibitors for estrogen receptor-positive breast cancer, androgen deprivation therapy for prostate cancer)",
      "Palliative care: symptom management and quality of life optimization for patients with advanced disease; includes pain management, nutritional support, psychosocial support, and hospice referral when appropriate"
    ],
    nursingActions: [
      "Monitor for signs and symptoms of oncologic emergencies: superior vena cava syndrome (facial edema, dyspnea), tumor lysis syndrome (hyperkalemia, hyperuricemia, hyperphosphatemia), spinal cord compression (back pain, motor weakness, bowel/bladder dysfunction), hypercalcemia (confusion, constipation, polyuria)",
      "Perform comprehensive pain assessment using validated tools (numeric rating scale, Wong-Baker FACES); cancer pain often requires multimodal management including opioids, non-opioid analgesics, and adjuvant medications",
      "Monitor for signs of infection in immunocompromised patients: check temperature every 4 hours; a single temperature of 38.3 C or sustained 38.0 C for 1 hour in a neutropenic patient is a medical emergency requiring blood cultures and antibiotics within 1 hour",
      "Assess nutritional status at each encounter: weight trends, appetite, oral mucosa integrity, swallowing ability; cancer and its treatments frequently cause anorexia, mucositis, nausea, and altered taste",
      "Provide emotional support and therapeutic communication: cancer diagnosis causes significant psychological distress; assess for anxiety, depression, and coping mechanisms; refer to social work, chaplaincy, or psychology as appropriate",
      "Educate patients about cancer screening recommendations: mammography, colonoscopy, Pap smear/HPV testing, low-dose CT for lung cancer screening in high-risk populations; reinforce the importance of early detection",
      "Document staging information accurately using TNM classification; ensure all team members are using consistent staging terminology for care coordination"
    ],
    assessmentFindings: [
      "Unexplained weight loss of 10% or more of body weight over 6 months (cancer cachexia from increased metabolic demands and tumor-produced cytokines including TNF-alpha and IL-6)",
      "Persistent pain that is progressive, not relieved by usual measures, or worse at night (bone metastases often cause deep, aching pain that worsens at night and is not relieved by rest)",
      "Palpable mass or thickening: breast lump (usually painless, irregular borders, fixed to underlying tissue), testicular mass (painless, firm), lymphadenopathy (hard, fixed, non-tender nodes suggest malignancy)",
      "Skin changes: non-healing ulcer, change in size/shape/color of a mole (ABCDE criteria for melanoma: Asymmetry, Border irregularity, Color variation, Diameter greater than 6mm, Evolving), jaundice (liver metastases or pancreatic head tumor obstructing bile duct)",
      "Constitutional symptoms: persistent fatigue unrelieved by rest, night sweats (especially lymphoma), fever of unknown origin, anorexia and early satiety",
      "Bleeding: hemoptysis (lung cancer), hematuria (bladder or kidney cancer), rectal bleeding (colorectal cancer), postmenopausal vaginal bleeding (endometrial cancer), hematemesis (gastric cancer)",
      "Neurological changes: new-onset headache with neurological deficits (brain metastases), back pain with lower extremity weakness or bowel/bladder dysfunction (spinal cord compression -- oncologic emergency)"
    ],
    signs: {
      left: [
        "Unexplained fatigue persisting for more than 2 weeks",
        "Unintentional weight loss of 5% or more over 1-3 months",
        "Palpable lymph node enlargement (firm, non-tender)",
        "Change in bowel or bladder habits",
        "Non-healing sore or wound lasting more than 3 weeks",
        "Persistent cough or hoarseness for more than 3 weeks"
      ],
      right: [
        "Superior vena cava syndrome (facial/upper extremity edema, dyspnea, distended neck veins)",
        "Spinal cord compression (back pain, progressive motor weakness, bowel/bladder incontinence)",
        "Tumor lysis syndrome (hyperkalemia with cardiac arrhythmias, acute kidney injury)",
        "Hypercalcemia of malignancy (confusion, lethargy, cardiac arrhythmias, polyuria)",
        "Neutropenic fever (temperature 38.3 C or greater with ANC below 500)",
        "Massive hemorrhage from tumor erosion into blood vessel"
      ]
    },
    medications: [
      {
        name: "Tamoxifen (Nolvadex)",
        type: "Selective estrogen receptor modulator (SERM) / antineoplastic hormonal agent",
        action: "Competitively binds to estrogen receptors on breast cancer cells, blocking estrogen from binding and stimulating tumor growth; acts as an estrogen antagonist in breast tissue while acting as a partial agonist in bone (protective) and endometrium (increases endometrial cancer risk)",
        sideEffects: "Hot flashes, vaginal dryness or discharge, nausea, increased risk of endometrial cancer (estrogen agonist effect on uterus), thromboembolic events (deep vein thrombosis, pulmonary embolism), cataracts",
        contra: "History of deep vein thrombosis or pulmonary embolism; concurrent use of warfarin (increased bleeding risk); pregnancy (teratogenic -- Category D)",
        pearl: "Standard adjuvant therapy for estrogen receptor-positive (ER+) breast cancer in premenopausal women; taken daily for 5-10 years; patients must report any abnormal vaginal bleeding immediately (endometrial cancer screening); annual gynecological examination is required during therapy"
      },
      {
        name: "Cyclophosphamide (Cytoxan)",
        type: "Alkylating agent / antineoplastic",
        action: "Forms covalent bonds (cross-links) with DNA strands, preventing DNA replication and transcription; this is a cell-cycle non-specific agent, meaning it kills cells in all phases of the cell cycle, including resting cells; particularly effective against rapidly dividing cells but also damages normal rapidly dividing cells (bone marrow, GI mucosa, hair follicles)",
        sideEffects: "Myelosuppression (nadir 7-14 days, especially neutropenia and thrombocytopenia), nausea and vomiting (highly emetogenic), alopecia, hemorrhagic cystitis (from the toxic metabolite acrolein irritating the bladder mucosa), immunosuppression, secondary malignancies with long-term use",
        contra: "Active infection (profound immunosuppression worsens infection); severely depressed bone marrow function; pregnancy (teratogenic); urinary outflow obstruction (increases hemorrhagic cystitis risk)",
        pearl: "Aggressive hydration (at least 2-3 liters per day) and frequent voiding are essential to prevent hemorrhagic cystitis; mesna (sodium 2-mercaptoethane sulfonate) is administered concurrently as a uroprotective agent that binds acrolein in the bladder; monitor CBC before each cycle -- hold treatment if ANC below 1500 or platelets below 100,000"
      },
      {
        name: "Ondansetron (Zofran)",
        type: "Antiemetic (5-HT3 serotonin receptor antagonist)",
        action: "Selectively blocks serotonin 5-HT3 receptors in the chemoreceptor trigger zone (CTZ) of the medulla and on vagal nerve terminals in the gastrointestinal tract, preventing chemotherapy-induced nausea and vomiting (CINV); serotonin is released from enterochromaffin cells in the gut when damaged by chemotherapy, and blocking its action prevents emetic signaling",
        sideEffects: "Headache, constipation, dizziness, fatigue, QT prolongation (dose-dependent -- can cause torsades de pointes at high doses)",
        contra: "Congenital long QT syndrome; concurrent use of other QT-prolonging medications (increases risk of fatal arrhythmia); known hypersensitivity to 5-HT3 antagonists",
        pearl: "Administer 30 minutes BEFORE chemotherapy for maximum antiemetic effect; often combined with dexamethasone (a corticosteroid that enhances antiemetic efficacy) for highly emetogenic regimens; maximum single IV dose is 16 mg to minimize QT prolongation risk; monitor ECG in patients with cardiac history"
      }
    ],
    pearls: [
      "The CAUTION UP mnemonic for cancer warning signs: Change in bowel/bladder habits, A sore that does not heal, Unusual bleeding/discharge, Thickening or lump, Indigestion/difficulty swallowing, Obvious change in wart/mole, Nagging cough/hoarseness, Unexplained weight loss, Pernicious anemia/persistent fatigue",
      "TNM staging: T = primary Tumor size/extent, N = regional lymph Nodes, M = distant Metastasis; Stage I-II is localized, Stage III is regional, Stage IV is distant metastatic disease -- staging determines treatment approach and prognosis",
      "Neutropenic fever (temperature 38.3 C or above with ANC below 500) is an oncologic emergency -- blood cultures must be drawn and broad-spectrum antibiotics started within 1 HOUR; delays in antibiotic administration significantly increase mortality",
      "Hemorrhagic cystitis from cyclophosphamide is prevented by aggressive hydration (2-3 L/day), frequent voiding, and concurrent mesna administration -- teach patients to report any blood in urine, dysuria, or urinary frequency immediately",
      "Tamoxifen increases the risk of endometrial cancer because it acts as an estrogen AGONIST in the uterus -- all patients must report abnormal vaginal bleeding and undergo annual gynecological examinations",
      "Tumor lysis syndrome (TLS) occurs when rapid cancer cell death releases intracellular contents (potassium, phosphate, uric acid) into the bloodstream -- most common with hematologic malignancies; prevent with aggressive hydration and allopurinol or rasburicase before initiating treatment",
      "Cancer pain should be treated proactively using the WHO analgesic ladder: mild pain (non-opioids), moderate pain (weak opioids plus non-opioids), severe pain (strong opioids plus non-opioids plus adjuvants); there is no ceiling dose for pure opioid agonists (morphine, hydromorphone) in cancer pain"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient who has just been diagnosed with Stage III breast cancer. The patient asks what Stage III means. Which response by the practical nurse is most accurate?",
        options: [
          "The cancer is only in the breast and has not spread anywhere",
          "The cancer has spread to nearby lymph nodes or tissues but not to distant organs",
          "The cancer has spread to distant organs such as the lungs or bones",
          "The cancer is a pre-cancerous condition that has not yet become invasive"
        ],
        correct: 1,
        rationale: "Stage III cancer indicates locally advanced disease with regional spread (typically to nearby lymph nodes or adjacent structures) but WITHOUT distant organ metastasis. Stage I-II represents localized disease, Stage IV represents distant metastatic disease, and Stage 0 represents carcinoma in situ (pre-invasive)."
      },
      {
        question: "A patient receiving cyclophosphamide reports burning with urination and pink-tinged urine. The practical nurse recognizes this most likely indicates:",
        options: [
          "A normal side effect of chemotherapy that requires no intervention",
          "Hemorrhagic cystitis caused by the toxic metabolite acrolein",
          "An allergic reaction to cyclophosphamide requiring epinephrine",
          "A urinary tract infection requiring antibiotics"
        ],
        correct: 1,
        rationale: "Hemorrhagic cystitis is a serious adverse effect of cyclophosphamide caused by acrolein, a toxic metabolite that irritates the bladder mucosa. Symptoms include dysuria, hematuria, and urinary frequency. Prevention includes aggressive hydration, frequent voiding, and mesna administration. This finding must be reported to the physician immediately."
      },
      {
        question: "A practical nurse is teaching a community health class about cancer warning signs. Which mnemonic should the nurse use to educate the public about early cancer detection?",
        options: [
          "FAST (Face, Arms, Speech, Time)",
          "ABCDE (Airway, Breathing, Circulation, Disability, Exposure)",
          "CAUTION UP (Change in bowel/bladder, A sore, Unusual bleeding, Thickening, Indigestion, Obvious change, Nagging cough, Unexplained weight loss, Pernicious anemia)",
          "RACE (Rescue, Alarm, Contain, Extinguish)"
        ],
        correct: 2,
        rationale: "CAUTION UP is the American Cancer Society mnemonic for early warning signs of cancer. FAST is used for stroke recognition, ABCDE is a primary survey mnemonic for trauma assessment, and RACE is a fire safety mnemonic. Early recognition of cancer warning signs improves outcomes through earlier diagnosis and treatment."
      }
    ]
  },

  "chemotherapy-basics-rpn": {
    title: "Chemotherapy Basics for Practical Nurses",
    cellular: {
      title: "Cellular Pharmacology of Chemotherapy and the Cell Cycle",
      content: "Chemotherapy is the systemic administration of cytotoxic drugs designed to destroy cancer cells or inhibit their growth and division. The fundamental principle underlying chemotherapy is that cancer cells divide more rapidly and less controllably than most normal cells, making them more susceptible to drugs that interfere with cell division. However, because chemotherapy targets the mechanisms of cell division rather than cancer-specific markers, it also damages normal rapidly dividing cells -- particularly bone marrow stem cells, gastrointestinal epithelial cells, and hair follicle cells -- producing the characteristic side effects of myelosuppression, mucositis, and alopecia.\n\nThe cell cycle is the ordered sequence of events by which a cell duplicates its contents and divides into two daughter cells. It consists of four distinct phases: G1 (Gap 1, the cell grows and prepares for DNA synthesis), S phase (Synthesis, where DNA is replicated), G2 (Gap 2, the cell prepares for mitosis by synthesizing proteins needed for cell division), and M phase (Mitosis, where the cell physically divides into two daughter cells). Cells that are not actively dividing enter a resting state called G0. Chemotherapy agents are classified based on their relationship to the cell cycle. Cell-cycle-specific agents are most effective against cells that are actively dividing in a specific phase: antimetabolites (methotrexate, 5-fluorouracil) interfere with DNA or RNA synthesis during S phase; vinca alkaloids (vincristine, vinblastine) disrupt the mitotic spindle during M phase; and topoisomerase inhibitors (irinotecan, etoposide) interfere with DNA unwinding during S phase. Cell-cycle-nonspecific agents can kill cells in any phase of the cycle, including resting cells in G0: alkylating agents (cyclophosphamide, cisplatin) form cross-links in DNA strands that prevent replication regardless of the cell cycle phase; and antitumor antibiotics (doxorubicin, bleomycin) intercalate into DNA and generate free radicals that damage cellular components.\n\nChemotherapy is typically administered in cycles consisting of a treatment period followed by a rest period (usually 2-4 weeks). The rest period allows normal cells, particularly bone marrow cells, to recover before the next treatment cycle. The nadir is the point at which blood cell counts reach their lowest level after chemotherapy, typically occurring 7-14 days after administration, depending on the specific drug. This is the period of greatest risk for infection (neutropenia), bleeding (thrombocytopenia), and fatigue (anemia). Understanding the nadir timing is critical for practical nurses who must monitor patients during this vulnerable period.\n\nExtravasation is the accidental leakage of a vesicant chemotherapy drug from the vein into the surrounding tissue, causing severe tissue damage, necrosis, and potentially loss of the affected limb if not managed immediately. Vesicant drugs (doxorubicin, vincristine, vinblastine, mechlorethamine) cause the most severe tissue damage. Irritant drugs (carboplatin, etoposide) cause inflammation and discomfort but not necrosis. If extravasation is suspected, the infusion must be stopped immediately, the IV line left in place to aspirate residual drug, and the specific antidote administered according to institutional protocol. For anthracycline extravasation (doxorubicin), dexrazoxane is the antidote; for vinca alkaloid extravasation, warm compresses and hyaluronidase are used.\n\nSafe handling of chemotherapy drugs is essential to protect healthcare workers from occupational exposure. Chemotherapy agents are classified as hazardous drugs because even small exposures through skin absorption, inhalation, or accidental ingestion can cause mutagenic, teratogenic, and carcinogenic effects. Practical nurses must understand that chemotherapy-contaminated body fluids (urine, stool, vomit, blood, sweat) require special handling for 48 hours after treatment. Personal protective equipment (PPE) including chemotherapy-rated gloves (double gloving), impervious gown, face shield or goggles, and a respirator (for aerosolized agents) must be worn when handling chemotherapy drugs or contaminated materials. Spill kits must be readily available in all areas where chemotherapy is administered."
    },
    riskFactors: [
      "Myelosuppression risk factors: pre-existing low blood counts, prior radiation to bone marrow-bearing areas (pelvis, spine, sternum), advanced age, poor nutritional status, hepatic or renal impairment affecting drug clearance",
      "Cardiotoxicity risk: cumulative dose of anthracyclines (doxorubicin lifetime maximum 550 mg/m2), pre-existing cardiac disease, concurrent cardiotoxic drugs, age extremes (very young and elderly)",
      "Nephrotoxicity risk: concurrent nephrotoxic drugs (aminoglycosides, NSAIDs), pre-existing renal impairment, dehydration, cisplatin-based regimens",
      "Pulmonary toxicity risk: bleomycin (cumulative dose-dependent), high-dose oxygen exposure during or after bleomycin (synergistic lung damage), smoking history, prior lung radiation",
      "Tumor lysis syndrome risk: large tumor burden, rapidly proliferating tumors (high-grade lymphomas, acute leukemias), elevated pre-treatment LDH and uric acid, inadequate hydration",
      "Extravasation risk: peripheral IV access (versus central line), small or fragile veins, multiple prior venipunctures in the same area, restless or confused patients, obesity making vein visualization difficult",
      "Neurotoxicity risk: vinca alkaloids and platinum agents (cisplatin), pre-existing peripheral neuropathy (diabetes), concurrent neurotoxic medications",
      "Reproductive toxicity: chemotherapy is teratogenic in pregnancy; both male and female patients of reproductive age should receive fertility counseling before treatment"
    ],
    diagnostics: [
      "Complete blood count (CBC) with differential: the most critical monitoring test; obtained before EVERY chemotherapy cycle; treatment is held if ANC below 1500/microL or platelets below 100,000/microL; nadir values are expected 7-14 days after treatment",
      "Comprehensive metabolic panel (CMP): monitors renal function (BUN, creatinine -- essential before nephrotoxic agents like cisplatin), liver function (AST, ALT, bilirubin -- hepatic metabolism of many chemotherapy drugs), electrolytes (potassium, magnesium, calcium -- depleted by many regimens)",
      "Echocardiogram or MUGA scan: baseline and periodic assessment of left ventricular ejection fraction (LVEF) for patients receiving anthracyclines (doxorubicin); treatment held if LVEF drops below 50% or decreases by more than 10% from baseline",
      "Serum uric acid, LDH, potassium, phosphorus, calcium: monitor for tumor lysis syndrome (elevated uric acid, potassium, phosphorus; decreased calcium); obtain baseline before treatment of high-risk tumors",
      "Pulmonary function tests: baseline and periodic monitoring for patients receiving bleomycin; decline in DLCO (diffusing capacity) indicates pulmonary toxicity",
      "Audiometry: baseline and periodic monitoring for patients receiving cisplatin (ototoxicity causes high-frequency hearing loss)",
      "Pregnancy test: required before initiating chemotherapy in all women of childbearing potential; chemotherapy is teratogenic and pregnancy must be ruled out"
    ],
    management: [
      "Administer antiemetics BEFORE chemotherapy as prescribed: ondansetron (5-HT3 antagonist) plus dexamethasone for moderate-to-highly emetogenic regimens; NK-1 receptor antagonist (aprepitant) added for highly emetogenic regimens",
      "Ensure adequate hydration before, during, and after treatment: pre-hydration with normal saline is mandatory for cisplatin (prevents nephrotoxicity); general hydration supports renal clearance of drug metabolites",
      "Administer growth factors as prescribed: filgrastim (G-CSF) stimulates neutrophil production and is given to reduce the duration and severity of neutropenia; typically started 24-72 hours after chemotherapy and continued until ANC recovers",
      "Monitor for and manage extravasation immediately: stop infusion, aspirate residual drug through existing IV, administer specific antidote per institutional protocol, apply appropriate compresses, elevate the extremity, document with photographs",
      "Manage mucositis with oral care protocol: gentle brushing with soft toothbrush, saline or sodium bicarbonate mouth rinses every 2-4 hours, avoid alcohol-based mouthwashes, assess oral cavity daily using validated grading scale",
      "Institute neutropenic precautions when ANC falls below 1000: private room, strict hand hygiene, limit visitors, no fresh flowers or plants, neutropenic diet (no raw foods), monitor temperature every 4 hours",
      "Provide scalp cooling (cryotherapy) if available and appropriate to reduce alopecia; counsel patients that alopecia is usually temporary and hair typically regrows 3-6 months after completion of therapy"
    ],
    nursingActions: [
      "Verify chemotherapy orders against the treatment protocol before administration: correct drug, dose, route, rate, sequence, and diluent; chemotherapy dosing errors can be fatal -- independent double-check by two qualified nurses is mandatory",
      "Assess IV site continuously during vesicant chemotherapy administration: check for blood return every 5-10 minutes, observe for swelling/redness/pain at the site; instruct the patient to report ANY burning, stinging, or discomfort immediately",
      "Use chemotherapy-rated personal protective equipment (PPE) when handling drugs or contaminated materials: double chemotherapy-rated gloves, impervious gown, face shield or goggles; change gloves every 30 minutes or immediately if damaged",
      "Handle chemotherapy-contaminated body fluids with PPE for 48 hours after treatment: urine, stool, vomit, blood, and sweat may contain active drug metabolites; linen soiled with body fluids should be placed in labeled chemotherapy waste bags",
      "Monitor for signs of anaphylaxis during and immediately after infusion: urticaria, bronchospasm, hypotension, facial/throat swelling; have emergency equipment (epinephrine, diphenhydramine, corticosteroids, oxygen, suction) at bedside",
      "Assess for peripheral neuropathy at each visit: ask about numbness, tingling, or burning in hands and feet; test grip strength and ability to perform fine motor tasks (buttoning, writing); report progression to the physician as dose modification may be needed",
      "Educate patients and families about home safety during the 48-hour post-treatment period: flush toilet twice after use, wash soiled linens separately in hot water, use condoms during sexual activity, avoid pregnancy during and for appropriate time after treatment",
      "Document the chemotherapy administration record completely: drug name, dose, route, start and stop times, IV site assessment, patient response, and any adverse events"
    ],
    assessmentFindings: [
      "Myelosuppression: fatigue and pallor (anemia), fever and infection signs (neutropenia -- note that classic inflammation signs may be absent without neutrophils), petechiae/bruising/bleeding (thrombocytopenia)",
      "Gastrointestinal toxicity: nausea and vomiting (acute within 24 hours, delayed 24-120 hours after treatment), mucositis (oral erythema, ulceration, pain, difficulty eating), diarrhea (can cause severe dehydration and electrolyte imbalance), anorexia and taste changes (metallic taste is common)",
      "Alopecia: hair thinning or complete hair loss beginning 2-3 weeks after first treatment; affects scalp, eyebrows, eyelashes, and body hair; usually reversible 3-6 months after treatment completion",
      "Peripheral neuropathy: bilateral symmetric numbness, tingling, or burning in hands and feet (glove-and-stocking distribution); decreased deep tendon reflexes; difficulty with fine motor skills; may be irreversible if severe",
      "Cardiotoxicity (anthracyclines): dyspnea, peripheral edema, tachycardia, irregular heart rhythm, decreased exercise tolerance; may present acutely during treatment or years after treatment completion",
      "Extravasation: pain, burning, or stinging at IV site; swelling, redness, or induration around the IV site; vesicant extravasation can cause tissue necrosis, blistering, and ulceration that may require surgical debridement",
      "Tumor lysis syndrome: nausea, vomiting, diarrhea, muscle cramps (hyperkalemia), tetany (hypocalcemia), decreased urine output (uric acid nephropathy), cardiac arrhythmias"
    ],
    signs: {
      left: [
        "Mild nausea managed with antiemetics",
        "Grade 1 mucositis (oral erythema without ulceration)",
        "Mild fatigue (able to perform activities of daily living)",
        "Hair thinning beginning 2-3 weeks after treatment",
        "Mild peripheral tingling in fingertips and toes",
        "Mildly decreased appetite with metallic taste"
      ],
      right: [
        "Neutropenic fever (temperature 38.3 C or above with ANC below 500 -- oncologic emergency)",
        "Active hemorrhage or widespread petechiae with platelets below 20,000",
        "Extravasation of vesicant drug with tissue blanching or blistering",
        "Anaphylaxis (urticaria, bronchospasm, hypotension, airway edema)",
        "Cardiac arrhythmia or acute heart failure symptoms during anthracycline infusion",
        "Tumor lysis syndrome (hyperkalemia with ECG changes, oliguria, seizures)"
      ]
    },
    medications: [
      {
        name: "Ondansetron (Zofran)",
        type: "Antiemetic (5-HT3 serotonin receptor antagonist)",
        action: "Selectively blocks serotonin 5-HT3 receptors in the chemoreceptor trigger zone of the medulla and on peripheral vagal nerve terminals in the GI tract; chemotherapy damages enterochromaffin cells in the gut mucosa causing massive serotonin release, which triggers the emetic reflex -- ondansetron blocks this pathway",
        sideEffects: "Headache (most common), constipation, dizziness, fatigue, dose-dependent QT interval prolongation on ECG",
        contra: "Congenital long QT syndrome; concurrent use with apomorphine (severe hypotension risk); caution with other QT-prolonging drugs",
        pearl: "Administer 30 minutes BEFORE chemotherapy begins for maximum antiemetic protection; often combined with dexamethasone for enhanced efficacy; maximum single IV dose is 16 mg to reduce QT prolongation risk; available in oral, IV, and orally disintegrating tablet formulations"
      },
      {
        name: "Filgrastim (Neupogen) / Pegfilgrastim (Neulasta)",
        type: "Granulocyte colony-stimulating factor (G-CSF)",
        action: "Binds to G-CSF receptors on neutrophil precursor cells in the bone marrow, stimulating proliferation, differentiation, and maturation of neutrophils; also enhances the phagocytic and bactericidal function of mature neutrophils; reduces the depth and duration of chemotherapy-induced neutropenia",
        sideEffects: "Bone pain (most common -- caused by rapid marrow expansion; treat with acetaminophen or NSAIDs), injection site reactions, splenic rupture (rare but serious -- report left upper quadrant or shoulder pain), leukocytosis",
        contra: "Known hypersensitivity to E. coli-derived proteins (filgrastim is produced in E. coli); do NOT administer within 24 hours before or after chemotherapy (stimulating marrow during chemotherapy makes dividing cells more vulnerable to cytotoxic drugs)",
        pearl: "Filgrastim is given as daily subcutaneous injections starting 24-72 hours AFTER chemotherapy until ANC recovers above 10,000; pegfilgrastim is a long-acting formulation given as a SINGLE dose per chemotherapy cycle; bone pain is expected and can be managed with over-the-counter analgesics -- reassure patients this is a sign the medication is working"
      },
      {
        name: "Dexamethasone (Decadron)",
        type: "Corticosteroid / antiemetic adjunct / anti-inflammatory",
        action: "Multifaceted antiemetic mechanism: inhibits prostaglandin synthesis in the brain (reducing emetic signaling), decreases serotonin release from the GI tract, and reduces inflammation of the chemoreceptor trigger zone; also used for its anti-inflammatory and immunosuppressive properties in cancer treatment protocols",
        sideEffects: "Hyperglycemia (significant -- monitor blood glucose closely, especially in diabetic patients), insomnia, mood changes (euphoria, irritability, anxiety), increased appetite, fluid retention, immunosuppression, GI irritation (take with food)",
        contra: "Active systemic fungal infection; uncontrolled diabetes (relative -- requires insulin adjustment); active peptic ulcer disease without GI protection",
        pearl: "Synergistic antiemetic effect when combined with ondansetron -- the combination is more effective than either drug alone; typically given as 8-20 mg IV or PO before chemotherapy and continued for 2-4 days after; warn patients about insomnia (administer morning doses when possible) and increased appetite; monitor blood glucose in all patients during dexamethasone therapy"
      }
    ],
    pearls: [
      "The nadir (lowest blood count) typically occurs 7-14 days after chemotherapy administration -- this is the period of GREATEST risk for infection, bleeding, and severe fatigue; patients should avoid crowds, practice hand hygiene, and monitor temperature during this window",
      "Neutropenic fever is an ONCOLOGIC EMERGENCY: a single temperature of 38.3 C (101 F) or sustained 38.0 C (100.4 F) for 1 hour in a patient with ANC below 500 requires blood cultures and IV broad-spectrum antibiotics within 1 HOUR -- delays increase mortality",
      "NEVER give filgrastim (G-CSF) within 24 hours before or after chemotherapy -- stimulating bone marrow proliferation during chemotherapy exposure makes the rapidly dividing marrow cells more vulnerable to cytotoxic drug damage, worsening myelosuppression",
      "Extravasation of vesicant chemotherapy requires IMMEDIATE intervention: stop the infusion, do NOT remove the IV catheter, aspirate residual drug, administer the appropriate antidote, and document with photographs -- tissue necrosis can occur within hours",
      "Chemotherapy-contaminated body fluids require special handling for 48 HOURS after treatment: double flush the toilet, wash contaminated linens separately, use PPE when handling body fluids -- this protects family members and healthcare workers from exposure",
      "Safe handling of chemotherapy drugs requires chemotherapy-rated double gloves, impervious gown, face shield, and a closed-system transfer device -- standard nursing gloves are NOT sufficient; a single exposure can cause mutagenic effects",
      "Cyclophosphamide causes hemorrhagic cystitis through its toxic metabolite acrolein -- prevention requires aggressive hydration (2-3 L/day), frequent voiding, and mesna administration; teach patients to report any hematuria, dysuria, or urinary frequency immediately"
    ],
    quiz: [
      {
        question: "A patient receiving chemotherapy has an absolute neutrophil count (ANC) of 400/microL and a temperature of 38.5 C. What is the PRIORITY nursing action?",
        options: [
          "Administer acetaminophen and recheck the temperature in 1 hour",
          "Obtain blood cultures and initiate IV broad-spectrum antibiotics within 1 hour",
          "Encourage oral fluids and apply a cooling blanket",
          "Administer filgrastim to stimulate neutrophil production"
        ],
        correct: 1,
        rationale: "Neutropenic fever (ANC below 500 with temperature 38.3 C or above) is an oncologic emergency. Blood cultures must be obtained and IV broad-spectrum antibiotics started within 1 hour. Delays in antibiotic administration significantly increase mortality. Filgrastim should not be initiated during an acute infection without concurrent antibiotic coverage."
      },
      {
        question: "During vesicant chemotherapy administration, a patient reports burning pain at the IV site, and the practical nurse observes swelling around the insertion point. What should the practical nurse do FIRST?",
        options: [
          "Slow the infusion rate and continue monitoring",
          "Apply a warm compress to the area and continue the infusion",
          "Stop the infusion immediately and do NOT remove the IV catheter",
          "Flush the IV line with normal saline to check for patency"
        ],
        correct: 2,
        rationale: "Burning pain and swelling at the IV site during vesicant chemotherapy administration indicate possible extravasation. The infusion must be stopped immediately. The IV catheter is left in place to allow aspiration of residual drug before removal. The specific antidote is then administered according to institutional protocol. Continuing the infusion would cause further tissue damage."
      },
      {
        question: "A practical nurse is caring for a patient who received chemotherapy yesterday. Which personal protective equipment (PPE) should the practical nurse wear when emptying the patient's urinal?",
        options: [
          "Standard nursing gloves only",
          "Chemotherapy-rated double gloves and impervious gown",
          "No PPE is needed if the chemotherapy was administered more than 12 hours ago",
          "Surgical mask and standard gloves"
        ],
        correct: 1,
        rationale: "Chemotherapy-contaminated body fluids (urine, stool, vomit, blood) contain active drug metabolites for 48 hours after treatment. Healthcare workers must wear chemotherapy-rated double gloves and an impervious gown when handling these fluids. Standard nursing gloves are NOT sufficient protection against chemotherapy agents."
      }
    ]
  },

  "chest-physiotherapy-rpn": {
    title: "Chest Physiotherapy for Practical Nurses",
    cellular: {
      title: "Respiratory Physiology and Mucus Clearance Mechanisms",
      content: "Chest physiotherapy (CPT) encompasses a group of airway clearance techniques designed to mobilize and remove retained pulmonary secretions, improve ventilation, and prevent or treat atelectasis. Understanding the normal mechanisms of mucus clearance and the pathophysiology of conditions that impair these mechanisms is essential for practical nurses who perform and assist with CPT.\n\nThe respiratory tract is lined with pseudostratified ciliated columnar epithelium from the trachea to the terminal bronchioles. This epithelium contains two critical components of the mucociliary escalator, the body's primary defense mechanism for clearing inhaled particles and pathogens from the airways. Goblet cells and submucosal glands produce mucus, a complex viscoelastic gel composed of water (approximately 95%), glycoproteins called mucins (which give mucus its sticky, gel-like consistency), electrolytes, immunoglobulins (IgA), lysozyme, and lactoferrin. Normal mucus production is approximately 100 mL per day. The mucus layer consists of two phases: the sol layer (a thin, watery layer closest to the epithelial surface in which the cilia beat) and the gel layer (a thicker, more viscous layer on top that traps particles). Ciliated cells have approximately 200 cilia per cell, each beating in a coordinated metachronal wave at 12-15 beats per second. During the effective stroke, the cilia tips engage with the gel layer and propel it toward the pharynx at approximately 1-2 cm per minute. During the recovery stroke, the cilia bend and move through the sol layer without contacting the gel layer. This continuous escalator moves trapped particles, bacteria, and debris upward from the lower respiratory tract to the pharynx, where they are swallowed or expectorated.\n\nWhen the mucociliary escalator is impaired, secretions accumulate in the airways, creating several pathological consequences. Mucus plugging obstructs smaller airways, preventing ventilation of the alveoli distal to the plug. This creates areas of ventilation-perfusion (V/Q) mismatch where blood continues to flow through the pulmonary capillaries surrounding the collapsed alveoli but no gas exchange occurs (intrapulmonary shunting), leading to hypoxemia. Retained secretions provide an ideal medium for bacterial growth, increasing the risk of nosocomial pneumonia. Atelectasis (alveolar collapse) occurs when the obstructed alveoli absorb their trapped gas and collapse, further reducing the surface area available for gas exchange. In patients with chronic obstructive pulmonary disease (COPD) or cystic fibrosis, the mucus is abnormally thick and tenacious due to goblet cell hyperplasia, submucosal gland hypertrophy, and (in cystic fibrosis) defective chloride ion transport across the epithelium caused by mutations in the CFTR protein, which reduces the water content of the airway surface liquid.\n\nChest physiotherapy techniques work by applying mechanical forces to the chest wall that are transmitted to the airways, loosening adherent secretions from the bronchial walls and moving them toward the larger central airways where they can be coughed out or suctioned. Postural drainage uses gravity to facilitate secretion movement from specific lung segments to the central airways by positioning the patient so that the affected lung segment is uppermost (the bronchus draining that segment points downward). There are 12 postural drainage positions corresponding to the 18 segments of the lungs. Percussion (clapping) involves rhythmically striking the chest wall over the affected lung segment with cupped hands, creating a wave of energy that dislodges secretions from the bronchial walls. The hands must be cupped (not flat) to create an air cushion that transmits energy to the lung tissue without causing pain or injury. Vibration involves applying a fine trembling pressure to the chest wall during exhalation, when the airways are naturally narrowing, which helps propel loosened secretions toward the central airways. Incentive spirometry is a technique that encourages deep breathing by having the patient inhale slowly and deeply through a mouthpiece connected to a visual feedback device; sustained maximal inspiration opens collapsed alveoli (reversing atelectasis) and mobilizes secretions through the deep breathing effect."
    },
    riskFactors: [
      "Post-surgical patients (especially thoracic and upper abdominal surgery): pain limits deep breathing and coughing, anesthesia depresses ciliary function, and immobility promotes secretion pooling",
      "Chronic obstructive pulmonary disease (COPD): goblet cell hyperplasia and submucosal gland hypertrophy produce excessive thick mucus; impaired ciliary function and airway narrowing trap secretions",
      "Cystic fibrosis: defective CFTR protein causes thick, dehydrated mucus that is extremely difficult to clear; chronic bacterial colonization (Pseudomonas aeruginosa) further increases mucus production",
      "Neuromuscular diseases (spinal cord injury, muscular dystrophy, myasthenia gravis): weakness of the diaphragm and accessory muscles impairs cough effectiveness and deep breathing",
      "Prolonged immobility or bedrest: secretions pool in dependent lung segments due to gravity; reduced tidal volume decreases the ability to mobilize secretions",
      "Mechanical ventilation: endotracheal tube bypasses the upper airway humidification system, impairs mucociliary clearance, and depresses the cough reflex",
      "Dehydration: inadequate systemic hydration decreases the water content of airway mucus, making it thick and difficult to mobilize",
      "Advanced age: decreased cough strength, reduced ciliary function, decreased elastic recoil of the lungs, and decreased respiratory muscle strength",
      "Level of consciousness impairment (sedation, brain injury): depressed cough reflex and inability to participate in deep breathing exercises"
    ],
    diagnostics: [
      "Chest X-ray: identifies areas of atelectasis (opacification with volume loss, shift of fissures toward the affected area), infiltrates suggesting pneumonia, or pleural effusion; used before and after CPT to evaluate effectiveness",
      "Pulse oximetry (SpO2): continuous or intermittent monitoring of oxygen saturation; desaturation below 92% during or after CPT may indicate bronchospasm, fatigue, or inadequate technique",
      "Arterial blood gas (ABG): provides definitive assessment of oxygenation (PaO2), ventilation (PaCO2), and acid-base status; obtained when SpO2 alone does not provide sufficient clinical information",
      "Sputum culture and sensitivity: obtained to identify causative organisms in suspected respiratory infection; collect specimen AFTER CPT and before antibiotic administration for best yield",
      "Auscultation of lung sounds: performed before and after CPT to evaluate effectiveness; crackles (rales) and rhonchi suggest retained secretions; diminished or absent breath sounds suggest atelectasis or mucus plugging",
      "Peak expiratory flow rate (PEFR): measures the maximum speed of expiration; decreased PEFR may indicate bronchospasm or retained secretions limiting airflow"
    ],
    management: [
      "Perform postural drainage by positioning the patient with the affected lung segment uppermost, allowing gravity to assist secretion drainage toward the central airways; maintain each position for 10-15 minutes as tolerated",
      "Perform chest percussion with cupped hands over the affected lung segment for 3-5 minutes per position; always place a thin towel or hospital gown over the skin to prevent discomfort; never percuss over the spine, sternum, kidneys, or areas of surgical incision",
      "Apply chest vibration during exhalation by placing both hands flat against the chest wall over the affected segment and applying a fine trembling pressure throughout the expiratory phase",
      "Teach and encourage incentive spirometry: patient should sit upright, exhale normally, then inhale slowly and deeply through the mouthpiece, sustaining maximum inspiration for 3-5 seconds; perform 10 repetitions every 1-2 hours while awake",
      "Encourage effective coughing techniques: huff coughing (forced exhalation with an open glottis, producing a 'huff' sound) is less tiring than traditional coughing and equally effective; splinting the surgical incision with a pillow during coughing reduces pain",
      "Administer bronchodilators (albuterol) 15-20 minutes BEFORE chest physiotherapy to open airways and facilitate secretion mobilization",
      "Ensure adequate systemic hydration (at least 2-3 liters per day unless fluid-restricted) to thin respiratory secretions and enhance mucociliary clearance"
    ],
    nursingActions: [
      "Perform respiratory assessment before and after CPT: respiratory rate, depth, and pattern; SpO2; auscultation of all lung fields bilaterally; presence and characteristics of cough and sputum (color, consistency, volume, odor)",
      "Schedule CPT sessions 1 hour before meals or 2 hours after meals to prevent aspiration and nausea; coordinate with the respiratory therapist for optimal timing",
      "Administer prescribed bronchodilator (albuterol nebulizer) 15-20 minutes before CPT to maximize airway opening and facilitate secretion mobilization",
      "Monitor SpO2 continuously during CPT; stop the procedure and position the patient upright if SpO2 drops below 90%, if the patient becomes dyspneic, or if hemoptysis occurs",
      "Position the patient appropriately for each lung segment being treated; modified positions (no Trendelenburg) may be needed for patients with increased intracranial pressure, uncontrolled hypertension, or recent abdominal surgery",
      "Encourage the patient to cough or huff-cough after each position change and after percussion/vibration to expectorate mobilized secretions; provide a sputum cup and tissues",
      "Document the CPT session: positions used, duration, patient tolerance, SpO2 before and after, sputum characteristics (amount, color, consistency), and lung sound changes",
      "Report any complications immediately: hemoptysis (blood-tinged or frank blood in sputum), persistent desaturation, chest pain, cardiac arrhythmias, or vomiting during CPT"
    ],
    assessmentFindings: [
      "Retained secretions: coarse crackles (rhonchi) heard on auscultation that may clear or change with coughing; productive cough with thick, tenacious sputum; gurgling or rattling respirations",
      "Atelectasis: diminished or absent breath sounds over the affected area, bronchial breath sounds heard over peripheral lung fields (sound transmission through consolidated tissue), decreased SpO2, tachypnea, shallow breathing",
      "Effective CPT response: lung sounds clearer after treatment, improved SpO2, productive cough with secretion expectoration, patient reports easier breathing, improved air entry on auscultation",
      "Respiratory distress during CPT: tachypnea (above 30/min), use of accessory muscles (sternocleidomastoid, intercostals), nasal flaring, SpO2 dropping below 90%, diaphoresis, agitation, inability to speak in full sentences",
      "Pneumonia-related findings: fever, purulent (yellow-green) sputum, crackles that do not clear with coughing, increased work of breathing, leukocytosis on CBC",
      "Post-surgical splinting: patient guarding the incision site, shallow rapid breathing to avoid pain, reluctance to cough or take deep breaths, diminished breath sounds bilaterally at the bases"
    ],
    signs: {
      left: [
        "Mildly diminished breath sounds at lung bases",
        "Occasional crackles clearing with cough",
        "SpO2 92-95% on room air",
        "Productive cough with small amounts of clear or white sputum",
        "Mild tachypnea (20-24 breaths/min) at rest",
        "Slight decrease in incentive spirometry volume compared to baseline"
      ],
      right: [
        "SpO2 below 90% despite supplemental oxygen",
        "Absent breath sounds over an entire lobe (complete atelectasis or mucus plug)",
        "Hemoptysis (blood in sputum -- stop CPT immediately)",
        "Severe respiratory distress with accessory muscle use and inability to speak",
        "Cardiac arrhythmias during percussion or positioning",
        "Frank desaturation and cyanosis during postural drainage"
      ]
    },
    medications: [
      {
        name: "Albuterol (Ventolin/Proventil)",
        type: "Short-acting beta-2 adrenergic agonist (SABA) / bronchodilator",
        action: "Selectively binds to beta-2 adrenergic receptors on bronchial smooth muscle cells, activating adenylyl cyclase, increasing intracellular cyclic AMP (cAMP), and causing smooth muscle relaxation; this dilates the bronchi and bronchioles, reducing airway resistance and improving airflow; also increases mucociliary clearance by stimulating ciliary beat frequency",
        sideEffects: "Tachycardia, palpitations, tremor (especially fine hand tremor), nervousness, headache, hypokalemia (beta-2 stimulation drives potassium into cells), paradoxical bronchospasm (rare)",
        contra: "Known hypersensitivity; use with caution in patients with cardiac arrhythmias, hyperthyroidism, and hypokalemia",
        pearl: "Administer 15-20 minutes BEFORE chest physiotherapy to maximize airway opening and facilitate secretion removal; onset of action is 5-15 minutes with duration of 4-6 hours; teach patients to use a spacer with metered-dose inhalers to improve drug delivery to the lungs; rinse mouth after use to prevent oral thrush"
      },
      {
        name: "Acetylcysteine (Mucomyst)",
        type: "Mucolytic agent",
        action: "Breaks disulfide bonds in mucus glycoproteins, reducing the viscosity and elasticity of respiratory mucus; this liquefies thick, tenacious secretions, making them easier to mobilize and expectorate through coughing and chest physiotherapy; also acts as a precursor to glutathione, providing antioxidant protection to the respiratory epithelium",
        sideEffects: "Bronchospasm (the mucolytic effect releases large volumes of thin secretions that can trigger coughing and bronchospasm), nausea and vomiting (the sulfur content produces a strong, unpleasant odor like rotten eggs), rhinorrhea, stomatitis",
        contra: "Known hypersensitivity; asthma or severe bronchospasm (can worsen airway reactivity unless preceded by bronchodilator administration)",
        pearl: "ALWAYS administer a bronchodilator (albuterol) BEFORE acetylcysteine to prevent bronchospasm from the sudden thinning and release of retained secretions; available as nebulized solution (inhaled) or oral solution; the sulfurous odor may cause nausea -- mixing with cola or juice improves palatability for oral use; also used as the antidote for acetaminophen toxicity via oral or IV route"
      },
      {
        name: "Ipratropium Bromide (Atrovent)",
        type: "Anticholinergic bronchodilator (muscarinic antagonist)",
        action: "Blocks acetylcholine at muscarinic M3 receptors on bronchial smooth muscle, preventing parasympathetic-mediated bronchoconstriction and reducing mucus secretion from submucosal glands; produces bronchodilation by inhibiting the vagal cholinergic tone that normally causes baseline bronchoconstriction; particularly effective in COPD where vagal tone is a major contributor to airway narrowing",
        sideEffects: "Dry mouth (most common -- anticholinergic effect), headache, dizziness, cough, blurred vision (if sprayed into eyes), urinary retention (rare, anticholinergic effect), paradoxical bronchospasm (rare)",
        contra: "Known hypersensitivity to atropine or its derivatives; soy or peanut allergy (some formulations contain soy lecithin as a propellant); caution in narrow-angle glaucoma (anticholinergic effects can increase intraocular pressure) and benign prostatic hyperplasia (urinary retention risk)",
        pearl: "Slower onset than albuterol (15-30 minutes vs. 5-15 minutes) but longer duration of action (4-8 hours); often used in combination with albuterol (Combivent/DuoNeb) for synergistic bronchodilation in COPD; teach patients to avoid spraying into eyes (can cause pupil dilation and blurred vision); not recommended as rescue inhaler for acute bronchospasm -- albuterol is preferred for acute episodes"
      }
    ],
    pearls: [
      "Administer bronchodilators 15-20 minutes BEFORE chest physiotherapy -- opening the airways FIRST allows the CPT techniques to more effectively mobilize secretions from the peripheral airways to the central airways for expectoration",
      "Schedule CPT sessions 1 hour before meals or 2 hours after meals to reduce the risk of nausea, vomiting, and aspiration; an empty or near-empty stomach is safest during positioning and percussion",
      "NEVER percuss directly over the spine, sternum, kidneys, breasts, or surgical incisions -- percussion over these areas can cause pain, organ injury, or wound dehiscence; always percuss over the rib cage with a thin layer of protection (towel or gown)",
      "Cupped hands during percussion create an air cushion between the hand and chest wall -- this transmits energy to the lung tissue without causing pain; a hollow popping sound (not a slapping sound) indicates correct technique",
      "Incentive spirometry is effective ONLY with proper technique: the patient must inhale slowly and deeply (not rapidly), sustain the maximum inspiration for 3-5 seconds, and perform 10 repetitions every 1-2 hours while awake; rapid shallow breaths defeat the purpose",
      "Modified postural drainage positions (no Trendelenburg) are used for patients with increased intracranial pressure, uncontrolled hypertension, distended abdomen, recent esophageal or abdominal surgery, or acute heart failure -- head-down positioning in these patients can worsen their condition",
      "Acetylcysteine (Mucomyst) has an extremely strong sulfurous odor that may cause nausea and vomiting -- always warn the patient, and administer a bronchodilator BEFORE acetylcysteine to prevent bronchospasm from the sudden thinning and mobilization of thick secretions"
    ],
    quiz: [
      {
        question: "A practical nurse is planning chest physiotherapy for a post-operative patient. Which action should be performed FIRST before beginning percussion and postural drainage?",
        options: [
          "Position the patient in the Trendelenburg position",
          "Administer the prescribed bronchodilator 15-20 minutes before CPT",
          "Have the patient eat a meal to maintain energy for the procedure",
          "Begin percussion on the chest wall without any preparation"
        ],
        correct: 1,
        rationale: "A bronchodilator should be administered 15-20 minutes before chest physiotherapy to open the airways and facilitate secretion mobilization. Opening the airways first allows percussion and postural drainage techniques to be more effective. CPT should be performed on an empty stomach (1 hour before or 2 hours after meals) to prevent aspiration."
      },
      {
        question: "During chest physiotherapy, the practical nurse notices that the patient's SpO2 has dropped to 88% and the patient is becoming increasingly dyspneic. What is the PRIORITY action?",
        options: [
          "Continue CPT and monitor the SpO2 closely",
          "Increase the force of percussion to mobilize secretions faster",
          "Stop CPT immediately, position the patient upright, and apply supplemental oxygen",
          "Have the patient perform incentive spirometry before continuing CPT"
        ],
        correct: 2,
        rationale: "An SpO2 below 90% with increasing dyspnea indicates that the patient is not tolerating the CPT procedure. The practical nurse must stop immediately, position the patient upright to optimize ventilation, apply supplemental oxygen, and notify the physician. Continuing or intensifying CPT could worsen respiratory compromise."
      },
      {
        question: "A practical nurse is teaching a patient how to use an incentive spirometer after abdominal surgery. Which instruction is correct?",
        options: [
          "Inhale as quickly as possible to raise the indicator to the highest level",
          "Exhale forcefully into the mouthpiece to exercise the expiratory muscles",
          "Inhale slowly and deeply through the mouthpiece and hold the breath for 3-5 seconds at maximum inspiration",
          "Use the incentive spirometer once a day before bedtime"
        ],
        correct: 2,
        rationale: "The correct technique for incentive spirometry is slow, deep inhalation through the mouthpiece followed by a sustained maximum inspiration hold for 3-5 seconds. This opens collapsed alveoli and prevents atelectasis. Rapid inhalation is less effective. The device requires inhalation (not exhalation), and it should be used 10 times every 1-2 hours while awake, not once daily."
      }
    ]
  }
};

let ok = 0;
let fail = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) ok++;
  else fail++;
}
console.log(`\nDone: ${ok} injected, ${fail} skipped`);
if (fail > 0) process.exit(1);
