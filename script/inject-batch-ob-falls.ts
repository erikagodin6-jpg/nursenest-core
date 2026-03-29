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
  "fetal-monitoring-basics-rpn": {
    title: "Electronic Fetal Monitoring for Practical Nurses",
    cellular: {
      title: "Physiology of Fetal Heart Rate Regulation and Uteroplacental Circulation",
      content: "Electronic fetal monitoring (EFM) is the continuous recording of the fetal heart rate (FHR) in relation to uterine contractions. The fetal heart rate is regulated by the autonomic nervous system through the interplay of the sympathetic and parasympathetic (vagal) divisions. The sympathetic nervous system increases heart rate and contractility, while the parasympathetic system, primarily via the vagus nerve (cranial nerve X), slows the heart rate. In a healthy, well-oxygenated fetus, these two systems create a balance that produces a baseline FHR between 110 and 160 beats per minute with moderate variability. Fetal oxygenation depends entirely on the uteroplacental circulation. Maternal blood enters the intervillous space of the placenta through the spiral arteries of the uterus. Oxygen and nutrients diffuse across the placental membrane into the fetal blood within the chorionic villi, while carbon dioxide and metabolic waste move in the opposite direction. Any condition that reduces maternal blood flow to the placenta (such as maternal hypotension, uterine tachysystole, or placental abruption) or impairs gas exchange at the placental membrane (such as placental insufficiency or infarction) will decrease fetal oxygenation. When fetal oxygen levels decline, chemoreceptors in the aortic arch and carotid bodies detect the change and trigger cardiovascular reflexes. Initially, the fetus compensates by redistributing blood flow to vital organs (brain, heart, adrenal glands) through peripheral vasoconstriction, which may cause a reflex increase in blood pressure and a vagal-mediated deceleration in heart rate. This is the mechanism behind late decelerations. The umbilical cord contains two arteries and one vein, surrounded by Wharton jelly. Compression of the cord during contractions or fetal movement can temporarily occlude the umbilical vessels, causing variable decelerations -- the most common type of periodic FHR change. Cord compression first occludes the thin-walled umbilical vein, reducing venous return and causing a brief compensatory acceleration (the shoulders of the deceleration), followed by occlusion of the thicker-walled umbilical arteries, which increases fetal systemic vascular resistance and triggers a vagal-mediated deceleration. Baseline FHR variability is the single most important indicator of fetal well-being. Moderate variability (6-25 bpm fluctuation around the baseline) reflects an intact autonomic nervous system with adequate cerebral oxygenation. Minimal or absent variability may indicate fetal acidemia, fetal sleep cycle (typically lasting 20-40 minutes), medication effect (opioids, magnesium sulfate), prematurity, or fetal neurological injury. The practical nurse must be able to identify and describe FHR patterns accurately, recognize category changes, and report concerning findings immediately. Understanding the physiological basis of each pattern transforms monitoring from pattern recognition into clinical reasoning."
    },
    riskFactors: [
      "Maternal diabetes (macrosomia, polyhydramnios, placental insufficiency)",
      "Pre-eclampsia or gestational hypertension (uteroplacental insufficiency from vasospasm)",
      "Post-term pregnancy beyond 42 weeks (placental aging and oligohydramnios)",
      "Intrauterine growth restriction (chronic placental insufficiency)",
      "Multiple gestation (cord entanglement, twin-to-twin transfusion)",
      "Maternal smoking or substance use (chronic fetal hypoxia, placental abruption)",
      "Oligohydramnios (increased risk of cord compression without protective fluid cushion)"
    ],
    diagnostics: [
      "Continuous electronic fetal monitoring (external or internal): external uses ultrasound transducer for FHR and tocodynamometer for contractions; internal uses fetal scalp electrode for precise FHR and intrauterine pressure catheter (IUPC) for contraction strength in Montevideo units",
      "Non-stress test (NST): reactive if 2 or more accelerations of at least 15 bpm lasting at least 15 seconds within a 20-minute window; nonreactive warrants further evaluation",
      "Biophysical profile (BPP): scores 5 components (FHR reactivity, fetal breathing, fetal movement, fetal tone, amniotic fluid volume) each 0 or 2 points; normal score 8-10; score of 6 is equivocal; score 4 or below may indicate fetal compromise",
      "Contraction stress test (CST): evaluates FHR response to contractions; negative (no late decelerations) is reassuring; positive (late decelerations with more than 50% of contractions) suggests uteroplacental insufficiency",
      "Umbilical artery Doppler velocimetry: assesses blood flow resistance in the umbilical artery; absent or reversed end-diastolic flow indicates severe placental insufficiency",
      "Fetal scalp stimulation: digital stimulation of fetal scalp during labor; an acceleration in response suggests fetal pH above 7.20 and is reassuring"
    ],
    management: [
      "Classify FHR tracing into Category I (normal -- reassuring baseline, moderate variability, no late or variable decelerations), Category II (indeterminate -- requires evaluation and continued monitoring), or Category III (abnormal -- absent variability with recurrent late or variable decelerations, bradycardia, or sinusoidal pattern; requires immediate intervention)",
      "For recurrent late decelerations: reposition mother to left lateral position, administer IV fluid bolus (500 mL lactated Ringer or normal saline), apply oxygen via non-rebreather mask at 10 L/min, discontinue oxytocin if infusing, notify physician immediately",
      "For recurrent variable decelerations: perform amnioinfusion as ordered (instillation of normal saline into the uterine cavity to cushion the cord), reposition mother, assess for cord prolapse",
      "For prolonged deceleration (lasting more than 2 minutes): initiate intrauterine resuscitation measures, prepare for possible emergency cesarean delivery if FHR does not recover within 10 minutes",
      "Administer terbutaline 0.25 mg subcutaneously as ordered for acute tocolysis to reduce uterine tachysystole (more than 5 contractions in 10 minutes)",
      "Monitor contraction frequency, duration, intensity, and resting tone; report tachysystole (more than 5 contractions in 10 minutes averaged over 30 minutes) immediately",
      "Document FHR baseline, variability, accelerations, decelerations (type, timing, duration, depth), and uterine activity at intervals per facility protocol (typically every 15-30 minutes in active labor, every 5 minutes during pushing)"
    ],
    nursingActions: [
      "Apply external fetal monitor correctly: place ultrasound transducer over the fetal back where the strongest FHR signal is obtained; place tocodynamometer on the uterine fundus",
      "Assess and document FHR tracing systematically using DR C BRAVADO mnemonic: Determine Risk, Contractions, Baseline Rate, Variability, Accelerations, Decelerations, Overall assessment",
      "Reposition maternal position (left lateral, right lateral, hands-and-knees) if non-reassuring FHR pattern is identified -- this relieves aortocaval compression and may resolve cord compression",
      "Perform vaginal examination if sudden prolonged deceleration occurs to assess for cord prolapse -- if cord is palpated, apply upward pressure to the presenting part and do NOT attempt to replace the cord",
      "Maintain continuous monitoring during oxytocin administration and report tachysystole or non-reassuring FHR patterns immediately; document discontinuation of oxytocin and notification of provider",
      "Report Category III tracings to the physician or midwife immediately and prepare for possible operative delivery; document the time of notification, provider response, and all interventions performed",
      "Educate the patient about the purpose of monitoring, the meaning of the sounds heard, and the importance of position changes; reduce anxiety by explaining that periodic adjustments are routine"
    ],
    assessmentFindings: [
      "Normal baseline FHR: 110-160 bpm; tachycardia (above 160 bpm) may indicate maternal fever, fetal infection, fetal anemia, or medication effects (terbutaline, atropine); bradycardia (below 110 bpm) may indicate vagal stimulation, cord compression, or fetal distress",
      "Moderate variability (6-25 bpm): the most reassuring finding; indicates intact fetal autonomic nervous system and adequate oxygenation",
      "Minimal variability (less than or equal to 5 bpm): may indicate fetal sleep cycle (should resolve within 40 minutes), CNS depressant effect (opioids, magnesium), fetal acidemia, or prematurity",
      "Absent variability (undetectable amplitude): in the presence of decelerations, this is a Category III tracing and constitutes an emergency",
      "Accelerations: transient increases in FHR of at least 15 bpm above baseline lasting at least 15 seconds (at least 10 bpm for 10 seconds if less than 32 weeks gestation); presence is reassuring",
      "Early decelerations: gradual decrease in FHR that mirrors contractions (onset to nadir 30 seconds or more); caused by fetal head compression during descent; benign finding that does not require intervention",
      "Late decelerations: gradual decrease in FHR beginning after the peak of the contraction with the nadir occurring after the contraction peak; caused by uteroplacental insufficiency; requires immediate intervention when recurrent",
      "Variable decelerations: abrupt decrease in FHR (onset to nadir less than 30 seconds) of at least 15 bpm lasting 15 seconds to 2 minutes; caused by umbilical cord compression; most common deceleration type"
    ],
    signs: {
      left: [
        "Mild fetal tachycardia (161-180 bpm) with moderate variability maintained",
        "Occasional variable decelerations that resolve quickly and return to baseline",
        "Minimal variability lasting less than 40 minutes (possible fetal sleep cycle)",
        "Early decelerations that mirror contraction pattern",
        "Isolated acceleration following fetal movement or stimulation",
        "Mild uterine tachysystole (6 contractions in 10 minutes) without FHR changes"
      ],
      right: [
        "Absent FHR variability with recurrent late or variable decelerations (Category III)",
        "Prolonged deceleration lasting more than 2 minutes without recovery",
        "Sinusoidal FHR pattern (smooth, undulating, sine-wave pattern suggesting severe fetal anemia)",
        "Fetal bradycardia below 110 bpm lasting more than 10 minutes",
        "Recurrent late decelerations with minimal or absent variability",
        "Cord prolapse with visible or palpable cord and acute FHR deceleration"
      ]
    },
    medications: [
      {
        name: "Terbutaline (Brethine)",
        type: "Beta-2 adrenergic agonist / acute tocolytic",
        action: "Stimulates beta-2 adrenergic receptors on uterine smooth muscle cells, increasing intracellular cyclic AMP which inhibits myosin light-chain kinase, resulting in uterine relaxation and cessation of contractions; used for acute tocolysis when uterine tachysystole causes non-reassuring FHR patterns",
        sideEffects: "Maternal tachycardia, palpitations, tremor, hyperglycemia, hypokalemia, pulmonary edema with prolonged use, neonatal tachycardia and hypoglycemia",
        contra: "Maternal heart disease, uncontrolled hyperthyroidism, poorly controlled diabetes, cardiac arrhythmias; not recommended for prolonged tocolysis beyond 48-72 hours due to cardiovascular risks",
        pearl: "Administered as a single subcutaneous dose of 0.25 mg for acute intrapartum tocolysis; maternal heart rate should be below 120 bpm before administration; onset of action is 5-15 minutes subcutaneously; hold dose and report if maternal HR exceeds 130 bpm"
      },
      {
        name: "Oxytocin (Pitocin)",
        type: "Uterotonic / synthetic posterior pituitary hormone",
        action: "Binds to oxytocin receptors on myometrial cells, activating phospholipase C pathway which increases intracellular calcium, causing rhythmic uterine contractions; also stimulates prostaglandin release which enhances myometrial sensitivity; at higher doses, promotes sustained contraction for postpartum hemorrhage prevention",
        sideEffects: "Uterine tachysystole (more than 5 contractions in 10 minutes), uterine rupture (rare, higher risk in prior cesarean), water intoxication and hyponatremia (antidiuretic effect at high doses), fetal distress from hyperstimulation, neonatal jaundice",
        contra: "Significant cephalopelvic disproportion, unfavorable fetal position (transverse lie), placenta previa, vasa previa, prior classical uterine incision, active genital herpes, cord prolapse",
        pearl: "Always administer via infusion pump with a dedicated IV line; standard protocol starts at 1-2 mU/min and increases by 1-2 mU/min every 30-40 minutes; MUST be discontinued immediately if tachysystole occurs or Category III FHR tracing is identified; have terbutaline readily available as rescue tocolytic"
      },
      {
        name: "Magnesium Sulfate",
        type: "Central nervous system depressant / tocolytic / anticonvulsant",
        action: "Blocks neuromuscular transmission by competing with calcium at the motor end plate and decreasing acetylcholine release; reduces myometrial contractility by inhibiting calcium influx into smooth muscle cells; in pre-eclampsia, raises seizure threshold by stabilizing neuronal membranes and reducing cerebral vasospasm; also provides fetal neuroprotection when given before 32 weeks gestation",
        sideEffects: "Flushing, diaphoresis, nausea, hypotension, decreased deep tendon reflexes (first sign of toxicity), respiratory depression, cardiac arrest at toxic levels (above 12 mg/dL), decreased FHR variability, neonatal hypotonia and respiratory depression",
        contra: "Myasthenia gravis, severe renal impairment (magnesium is renally excreted), heart block; use extreme caution with concurrent calcium channel blockers (severe hypotension risk)",
        pearl: "Monitor deep tendon reflexes (DTRs) every 1-2 hours -- loss of patellar reflex indicates early toxicity (serum level approximately 8-10 mg/dL); maintain urine output at least 30 mL/hour; keep calcium gluconate 1 g at bedside as the antidote for magnesium toxicity; therapeutic range for seizure prophylaxis is 4-7 mg/dL; may cause decreased FHR variability which is a medication effect, not necessarily fetal distress"
      }
    ],
    pearls: [
      "The single most important indicator of fetal well-being on the monitor strip is VARIABILITY -- moderate variability (6-25 bpm) is the most reassuring sign, even in the presence of decelerations",
      "Early decelerations mirror contractions (head compression), are benign, and do NOT require intervention -- remember 'Early = hEad compression = harmless' to distinguish from late decelerations",
      "Late decelerations begin AFTER the contraction peak and indicate uteroplacental insufficiency -- the first intervention is to reposition the mother to left lateral and administer an IV fluid bolus, then discontinue oxytocin if infusing",
      "Variable decelerations are the MOST COMMON type and are caused by cord compression -- they appear abrupt with a sharp drop and may have 'shoulders' (brief accelerations before and after the deceleration); amnioinfusion may help cushion the cord",
      "A sinusoidal FHR pattern (smooth, undulating, sine-wave appearance with absent short-term variability) is associated with severe fetal anemia from Rh isoimmunization, fetomaternal hemorrhage, or twin-to-twin transfusion -- this is always a Category III emergency",
      "DR C BRAVADO is the systematic approach to FHR interpretation: Determine Risk, Contractions, Baseline Rate, Variability, Accelerations, Decelerations, Overall assessment -- use this framework every time you evaluate a tracing",
      "If a cord prolapse is discovered (cord palpated on vaginal exam with acute prolonged deceleration), do NOT attempt to replace the cord -- instead, apply continuous upward pressure to the presenting part to relieve cord compression, position the patient in knee-chest or steep Trendelenburg, and prepare for emergency cesarean delivery"
    ],
    quiz: [
      {
        question: "A practical nurse is monitoring a patient in active labor. The fetal heart rate tracing shows a gradual decrease in FHR that begins after the peak of the contraction, with the lowest point occurring after the contraction ends. Which type of deceleration does this represent?",
        options: [
          "Early deceleration",
          "Late deceleration",
          "Variable deceleration",
          "Prolonged deceleration"
        ],
        correct: 1,
        rationale: "Late decelerations are characterized by a gradual decrease in FHR that begins after the contraction peak, with the nadir occurring after the contraction peak. They indicate uteroplacental insufficiency and require immediate intervention including maternal repositioning, IV fluid bolus, oxygen administration, and discontinuation of oxytocin."
      },
      {
        question: "A practical nurse notes that fetal heart rate variability has been minimal (less than 5 bpm) for the past 25 minutes. No decelerations are present. Which action should the nurse take FIRST?",
        options: [
          "Notify the physician of an emergency",
          "Prepare for immediate cesarean delivery",
          "Attempt to stimulate the fetus by repositioning the mother and performing scalp stimulation",
          "Document the finding and take no further action"
        ],
        correct: 2,
        rationale: "Minimal variability lasting less than 40 minutes may represent a fetal sleep cycle. The nurse should attempt to arouse the fetus through position change and scalp stimulation. If variability does not improve after stimulation or persists beyond 40 minutes, the physician should be notified. Without decelerations, this is not yet a Category III emergency requiring immediate cesarean."
      },
      {
        question: "During oxytocin administration, a practical nurse counts 7 contractions in a 10-minute window. The fetal heart rate tracing shows moderate variability with no decelerations. Which action is MOST appropriate?",
        options: [
          "Continue monitoring because the FHR tracing is reassuring",
          "Discontinue the oxytocin infusion and notify the provider",
          "Increase the oxytocin rate to establish a regular pattern",
          "Administer terbutaline 0.25 mg subcutaneously immediately"
        ],
        correct: 1,
        rationale: "Seven contractions in 10 minutes constitutes uterine tachysystole (defined as more than 5 contractions in 10 minutes). Even with a reassuring FHR tracing, oxytocin must be discontinued and the provider notified because continued tachysystole places the fetus at risk for hypoxia. Terbutaline is reserved for cases where tachysystole is accompanied by non-reassuring FHR patterns."
      }
    ]
  },

  "amniotic-fluid-imbalances-rpn": {
    title: "Amniotic Fluid Imbalances for Practical Nurses",
    cellular: {
      title: "Physiology of Amniotic Fluid Production, Circulation, and Regulation",
      content: "Amniotic fluid is a dynamic biological medium that surrounds the fetus within the amniotic membrane throughout pregnancy. Its volume is regulated by a continuous cycle of production and reabsorption involving multiple fetal organ systems. In early pregnancy (before 16 weeks), amniotic fluid is produced primarily by filtration across the fetal skin and the amniotic membrane from maternal plasma. After fetal skin keratinization occurs at approximately 20 weeks, the two primary sources of amniotic fluid become fetal urine production and fetal lung fluid secretion. The fetal kidneys begin producing urine by 10-12 weeks gestation, and by the third trimester, fetal urinary output accounts for the majority of amniotic fluid production, contributing approximately 800-1200 mL per day at term. Fetal lung fluid contributes approximately 170-200 mL per day. Amniotic fluid is removed primarily through fetal swallowing (approximately 500-1000 mL per day at term) and absorption through the fetal membranes and across the fetal surface of the placenta (intramembranous pathway). The balance between production and removal maintains a normal amniotic fluid volume that peaks at approximately 800-1000 mL at 36 weeks gestation, then gradually declines toward term. The amniotic fluid index (AFI) is the ultrasound measurement used to quantify fluid volume. It is calculated by dividing the uterus into four quadrants using the umbilicus and linea nigra as landmarks, measuring the deepest vertical pocket of fluid in each quadrant free of fetal parts and cord, and summing the four measurements. A normal AFI ranges from 5 to 24 cm. Polyhydramnios is defined as an AFI greater than 24 cm or a single deepest pocket (SDP) greater than 8 cm, and occurs in approximately 1-2% of pregnancies. Oligohydramnios is defined as an AFI less than 5 cm or an SDP less than 2 cm. Amniotic fluid serves multiple critical functions: it provides a protective cushion against physical trauma and umbilical cord compression, maintains a constant temperature, allows symmetric fetal growth and movement necessary for musculoskeletal development, permits fetal lung development through breathing movements and fluid exchange, and prevents adhesions between the fetal skin and the amniotic membrane. The practical nurse must understand these functions because deviations in fluid volume directly correlate with fetal and maternal complications. Polyhydramnios increases the risk of cord prolapse (excessive space allows the cord to descend ahead of the presenting part), placental abruption, preterm labor from uterine overdistension, and postpartum hemorrhage from uterine atony. Oligohydramnios increases the risk of cord compression (loss of the protective fluid cushion), fetal pulmonary hypoplasia (inadequate fluid for lung development if occurring before 24 weeks), limb contractures, and Potter sequence (a constellation of findings including flattened facial features, limb deformities, and pulmonary hypoplasia resulting from prolonged severe oligohydramnios)."
    },
    riskFactors: [
      "Maternal diabetes mellitus (polyhydramnios from fetal polyuria secondary to fetal hyperglycemia)",
      "Fetal gastrointestinal obstruction such as esophageal atresia or duodenal atresia (polyhydramnios from inability to swallow fluid)",
      "Fetal neural tube defects and anencephaly (polyhydramnios from impaired fetal swallowing reflex and transudation through exposed meninges)",
      "Fetal renal agenesis or bilateral renal obstruction (severe oligohydramnios from absence of fetal urine production -- Potter sequence)",
      "Premature rupture of membranes (PROM) -- the most common cause of oligohydramnios, leading to continuous leakage of amniotic fluid",
      "Uteroplacental insufficiency from pre-eclampsia, chronic hypertension, or smoking (oligohydramnios from shunting of fetal blood away from kidneys to vital organs)",
      "Post-term pregnancy beyond 42 weeks (oligohydramnios from declining placental function and reduced fetal urine output)"
    ],
    diagnostics: [
      "Amniotic fluid index (AFI): ultrasound measurement summing deepest vertical pockets in four uterine quadrants; normal 5-24 cm; less than 5 cm is oligohydramnios; greater than 24 cm is polyhydramnios",
      "Single deepest pocket (SDP): alternative measurement; less than 2 cm indicates oligohydramnios; greater than 8 cm indicates polyhydramnios; preferred method in twin gestations",
      "Detailed fetal anatomy ultrasound: evaluates for structural anomalies (GI obstruction, renal agenesis, neural tube defects) that may explain fluid volume abnormalities",
      "Maternal glucose screening: 1-hour glucose challenge test or 2-hour oral glucose tolerance test to identify gestational or pre-existing diabetes as a cause of polyhydramnios",
      "Fetal karyotype (amniocentesis): recommended when polyhydramnios or oligohydramnios is associated with structural anomalies; detects chromosomal abnormalities (trisomy 21, 18, 13)",
      "Sterile speculum examination with nitrazine and fern testing: evaluates for premature rupture of membranes when oligohydramnios is suspected; nitrazine turns blue (pH greater than 6.0) and ferning pattern on microscopy confirms amniotic fluid"
    ],
    management: [
      "Mild polyhydramnios (AFI 25-30 cm) without maternal symptoms: expectant management with serial ultrasound monitoring every 2-4 weeks and fetal surveillance (NST, BPP)",
      "Moderate to severe polyhydramnios with maternal dyspnea or preterm labor risk: administer indomethacin 25-50 mg orally every 6 hours as ordered (reduces fetal urine output by decreasing fetal renal blood flow); must be discontinued by 32 weeks to avoid premature closure of the ductus arteriosus",
      "Therapeutic amnioreduction: ultrasound-guided removal of large volumes of amniotic fluid (typically 1-2 liters) to relieve maternal respiratory distress and reduce uterine overdistension; monitor for complications including preterm labor, abruption, and infection",
      "Oligohydramnios management at term: assess fetal well-being with NST and BPP; strongly consider delivery if AFI remains below 5 cm at or beyond 37 weeks, as fetal risk increases with continued pregnancy",
      "Oligohydramnios preterm: maternal IV hydration (oral or IV normal saline bolus) may temporarily increase AFI; serial monitoring with ultrasound and fetal surveillance; administer betamethasone for fetal lung maturation if delivery before 37 weeks is anticipated",
      "For premature rupture of membranes causing oligohydramnios: administer antibiotics (ampicillin/erythromycin per GBS protocol), betamethasone for lung maturity if less than 34 weeks, and monitor for signs of chorioamnionitis (maternal fever, fetal tachycardia, uterine tenderness, purulent amniotic fluid)"
    ],
    nursingActions: [
      "Measure fundal height at each prenatal visit -- fundal height greater than expected for gestational age (more than 3 cm above the expected measurement) may indicate polyhydramnios, multiple gestation, or macrosomia",
      "Monitor maternal respiratory status in patients with polyhydramnios -- uterine overdistension can elevate the diaphragm, causing dyspnea; position in semi-Fowler to optimize breathing",
      "Perform continuous fetal monitoring during labor for patients with abnormal fluid volumes -- oligohydramnios increases cord compression risk (variable decelerations) and polyhydramnios increases cord prolapse risk",
      "After amniotomy or spontaneous rupture of membranes, immediately assess FHR and perform a vaginal examination to rule out cord prolapse, especially in polyhydramnios where the large fluid volume can wash the cord downward",
      "Monitor intake and output strictly in patients receiving IV fluid hydration for oligohydramnios; assess for signs of fluid overload (pulmonary edema, hypertension, peripheral edema)",
      "Educate patients with oligohydramnios about the importance of adequate oral hydration (at least 2-3 liters of water daily), left lateral positioning to optimize renal perfusion, and reporting decreased fetal movement",
      "Report any signs of chorioamnionitis immediately: maternal temperature above 38.0 C (100.4 F), maternal tachycardia above 100 bpm, fetal tachycardia above 160 bpm, uterine tenderness, foul-smelling amniotic fluid"
    ],
    assessmentFindings: [
      "Polyhydramnios: uterine size larger than dates (fundal height exceeding gestational age by more than 3 cm), difficulty palpating fetal parts on Leopold maneuvers, tense and shiny abdomen, fluid thrill on percussion",
      "Maternal respiratory compromise from polyhydramnios: dyspnea, orthopnea, inability to lie flat, decreased oxygen saturation, tachypnea",
      "Oligohydramnios: uterine size smaller than dates, fetal parts easily palpated (felt prominently through the abdominal wall), decreased fetal movement reported by mother",
      "Signs of premature rupture of membranes: patient reports a sudden gush or continuous slow leak of clear fluid from the vagina; pooling of fluid in the posterior vaginal fornix on speculum exam; positive nitrazine (blue) and positive fern test",
      "Fetal monitoring findings with oligohydramnios: recurrent variable decelerations from cord compression, particularly during contractions; may require amnioinfusion during labor",
      "Signs of chorioamnionitis: maternal fever above 38.0 C, tachycardia (maternal and fetal), uterine tenderness, purulent or foul-smelling vaginal discharge, elevated WBC count",
      "Preterm labor signs in polyhydramnios: regular uterine contractions, cervical dilation, pelvic pressure, lower back pain -- uterine overdistension triggers premature labor"
    ],
    signs: {
      left: [
        "Fundal height 2-3 cm above expected for gestational age",
        "Mild maternal dyspnea with activity only",
        "Occasional variable decelerations that resolve with position change",
        "Patient reports slight increase or decrease in fetal movement",
        "Mild peripheral edema in lower extremities",
        "Intermittent pelvic pressure without regular contractions"
      ],
      right: [
        "Absent fetal heart tones or prolonged fetal bradycardia (possible cord prolapse)",
        "Sudden gush of fluid with visible cord at introitus (overt cord prolapse emergency)",
        "Maternal fever above 38.0 C with fetal tachycardia and uterine tenderness (chorioamnionitis)",
        "Severe maternal dyspnea with oxygen saturation below 94% (respiratory compromise from massive polyhydramnios)",
        "Vaginal bleeding with rigid, board-like uterus and fetal distress (placental abruption)",
        "Persistent recurrent variable or late decelerations with minimal variability"
      ]
    },
    medications: [
      {
        name: "Indomethacin (Indocid/Indocin)",
        type: "Nonsteroidal anti-inflammatory drug (NSAID) / prostaglandin synthesis inhibitor",
        action: "Inhibits cyclooxygenase (COX) enzymes, blocking prostaglandin synthesis in the fetal kidney, which reduces fetal urine output and decreases amniotic fluid production; also reduces myometrial contractility by inhibiting prostaglandin-mediated uterine stimulation, providing a tocolytic effect",
        sideEffects: "Premature closure of the fetal ductus arteriosus (risk increases significantly after 32 weeks), oligohydramnios (therapeutic effect but can become excessive), neonatal pulmonary hypertension, necrotizing enterocolitis, renal impairment, maternal GI irritation",
        contra: "Gestational age beyond 32 weeks (high risk of ductus arteriosus closure), known fetal cardiac defects, maternal renal impairment, active peptic ulcer disease, platelet disorders, NSAID allergy or aspirin-sensitive asthma",
        pearl: "Used for polyhydramnios from 24-32 weeks gestation; must be discontinued by 32 weeks due to risk of premature ductus arteriosus closure; monitor fetal echocardiography and AFI every 48-72 hours during therapy; administer with food to reduce GI side effects"
      },
      {
        name: "Betamethasone (Celestone)",
        type: "Synthetic corticosteroid / antenatal fetal lung maturation agent",
        action: "Crosses the placenta and stimulates type II pneumocytes in the fetal lung to produce surfactant (a phospholipid mixture of dipalmitoylphosphatidylcholine and surfactant proteins that reduces alveolar surface tension and prevents alveolar collapse at end-expiration); also accelerates maturation of fetal organ systems including the brain, GI tract, and kidneys",
        sideEffects: "Maternal hyperglycemia (monitor blood glucose every 6 hours in diabetic patients), increased maternal infection risk, transient decrease in fetal movement and FHR variability for 24-48 hours after administration, insomnia, mood changes",
        contra: "Active systemic fungal infection; use with caution in maternal diabetes (significant hyperglycemia risk requiring insulin adjustment); relative contraindication if delivery is imminent (less than 2 hours away as full benefit requires 48 hours)",
        pearl: "Standard dosing is 12 mg IM every 24 hours for 2 doses (total 24 mg); maximum benefit occurs 48 hours after the first dose; indicated between 24+0 and 33+6 weeks when preterm delivery is anticipated within 7 days; a single rescue course may be given if more than 14 days have elapsed since the initial course and delivery risk persists"
      },
      {
        name: "Oxytocin (Pitocin)",
        type: "Uterotonic / synthetic posterior pituitary hormone",
        action: "Binds to oxytocin receptors on myometrial cells, activating phospholipase C and increasing intracellular calcium, which triggers rhythmic uterine contractions; used for labor induction when continued pregnancy poses greater risk than delivery, as in severe oligohydramnios at or beyond 37 weeks",
        sideEffects: "Uterine tachysystole (more than 5 contractions in 10 minutes), uterine rupture (rare), water intoxication and hyponatremia at high doses (antidiuretic effect), fetal distress from hyperstimulation, neonatal jaundice",
        contra: "Cephalopelvic disproportion, unfavorable fetal position, placenta previa, vasa previa, prior classical cesarean incision, active genital herpes, cord prolapse",
        pearl: "In the context of oligohydramnios, oxytocin induction requires heightened vigilance for variable decelerations from cord compression; amnioinfusion may be needed during labor; always administer via infusion pump on a dedicated line; titrate per protocol and discontinue immediately for tachysystole or non-reassuring FHR"
      }
    ],
    pearls: [
      "The amniotic fluid index (AFI) normal range is 5-24 cm -- below 5 cm is oligohydramnios and above 24 cm is polyhydramnios; these values must be correlated with gestational age and clinical context",
      "Fetal swallowing is the primary mechanism for amniotic fluid removal -- any condition that prevents fetal swallowing (esophageal atresia, anencephaly, neuromuscular disorders) will cause polyhydramnios",
      "Fetal urine production is the primary source of amniotic fluid after 16 weeks -- any condition that eliminates fetal urine output (bilateral renal agenesis, bilateral ureteral obstruction) will cause severe oligohydramnios and Potter sequence",
      "When membranes rupture in a patient with polyhydramnios, the risk of cord prolapse is significantly elevated due to the large volume of fluid that can carry the cord ahead of the presenting part -- immediately assess FHR and check for cord after ROM",
      "Maternal oral hydration (2-3 liters of water daily) has been shown to temporarily increase AFI in cases of mild oligohydramnios by improving maternal intravascular volume and renal-placental perfusion -- this is a simple, non-invasive first intervention",
      "Indomethacin is effective for reducing polyhydramnios but must NEVER be used beyond 32 weeks gestation due to the risk of premature closure of the fetal ductus arteriosus, which can cause fetal pulmonary hypertension and right heart failure",
      "Potter sequence (bilateral renal agenesis causing absent amniotic fluid) results in a characteristic constellation: flattened facial features (compressed against uterine wall), limb contractures, and lethal pulmonary hypoplasia -- this condition is incompatible with life"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient at 34 weeks gestation whose ultrasound reveals an amniotic fluid index (AFI) of 28 cm with no identified fetal anomalies. The patient reports increasing difficulty breathing when lying flat. Which nursing action is the priority?",
        options: [
          "Position the patient in semi-Fowler position and assess respiratory status including oxygen saturation",
          "Prepare for immediate cesarean delivery",
          "Restrict the patient's oral fluid intake to 500 mL per day",
          "Administer indomethacin 50 mg orally as a standing order"
        ],
        correct: 0,
        rationale: "Polyhydramnios (AFI above 24 cm) with maternal dyspnea requires immediate positioning in semi-Fowler to relieve diaphragmatic pressure and assessment of respiratory status. Cesarean delivery is not immediately indicated for polyhydramnios alone. Fluid restriction is not the treatment. Indomethacin requires a physician order and is used for moderate-to-severe polyhydramnios, but the priority is to address the respiratory compromise first."
      },
      {
        question: "A patient at 38 weeks gestation has an AFI of 3 cm. During labor, the fetal heart rate tracing shows recurrent variable decelerations. Which intervention should the practical nurse anticipate?",
        options: [
          "Administration of terbutaline to stop contractions",
          "Amnioinfusion to cushion the umbilical cord",
          "Immediate administration of betamethasone for fetal lung maturity",
          "Increasing the oxytocin infusion rate to accelerate delivery"
        ],
        correct: 1,
        rationale: "Oligohydramnios (AFI below 5 cm) removes the protective fluid cushion around the umbilical cord, making it susceptible to compression during contractions, which causes variable decelerations. Amnioinfusion (infusing normal saline into the uterine cavity) replaces the fluid cushion and reduces cord compression. Betamethasone is not indicated at 38 weeks. Increasing oxytocin would worsen the problem."
      },
      {
        question: "A practical nurse is assessing a patient at 30 weeks gestation with polyhydramnios who is receiving indomethacin. Which finding should the nurse report to the physician immediately?",
        options: [
          "Mild nausea after taking the medication with food",
          "A decrease in AFI from 30 cm to 22 cm",
          "Fetal echocardiogram showing narrowing of the ductus arteriosus",
          "Maternal blood pressure of 118/74 mmHg"
        ],
        correct: 2,
        rationale: "Narrowing of the fetal ductus arteriosus is the most serious complication of indomethacin therapy during pregnancy. Premature closure can lead to fetal pulmonary hypertension and right heart failure. This finding requires immediate discontinuation of indomethacin and notification of the physician. A decrease in AFI to 22 cm is the therapeutic goal. Mild nausea is a common side effect."
      }
    ]
  },

  "febrile-neutropenia-basics-rpn": {
    title: "Febrile Neutropenia for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Neutropenia and the Immune Response to Infection",
      content: "Febrile neutropenia is a medical emergency defined as a single oral temperature of 38.3 C (101.0 F) or higher, or a sustained temperature of 38.0 C (100.4 F) or higher for one hour, in a patient with an absolute neutrophil count (ANC) below 500 cells per microliter, or an ANC below 1000 cells per microliter with an expected decline to below 500 within 48 hours. Neutrophils are the most abundant type of white blood cell and serve as the first line of cellular defense against bacterial and fungal infections. They are produced in the bone marrow from myeloid stem cells through a process called granulopoiesis, which takes approximately 7-14 days from stem cell to mature neutrophil release into the bloodstream. Circulating neutrophils have a very short lifespan of approximately 6-12 hours in the blood before migrating into tissues. When pathogens breach the body's physical barriers (skin, mucous membranes), tissue macrophages and damaged cells release chemotactic factors (interleukins, complement fragments, bacterial products) that attract neutrophils to the site of infection through a process called chemotaxis. Neutrophils kill pathogens through phagocytosis (engulfing and digesting microorganisms), degranulation (releasing antimicrobial enzymes and reactive oxygen species from intracellular granules), and the formation of neutrophil extracellular traps (NETs), which are webs of DNA and antimicrobial proteins that capture and neutralize pathogens. In febrile neutropenia, the absence of adequate neutrophil numbers means the body cannot mount an effective inflammatory response. This has a critical clinical implication: the classic signs of infection -- redness (rubor), swelling (tumor), warmth (calor), and pus formation -- may be absent or significantly diminished because these signs depend on neutrophil migration and activity. Fever may be the ONLY sign of a potentially life-threatening infection in a neutropenic patient. Cytotoxic chemotherapy is the most common cause of febrile neutropenia. Chemotherapy agents target rapidly dividing cells, and the bone marrow is one of the most actively dividing tissues in the body. After chemotherapy administration, the WBC and ANC decline progressively, reaching a nadir (lowest point) typically 7-14 days after treatment, depending on the specific agent used. The nadir period represents the time of greatest infection risk. Recovery of neutrophil counts generally occurs 14-21 days after chemotherapy, assuming no dose-limiting complications. The absolute neutrophil count is calculated by multiplying the total white blood cell count by the percentage of neutrophils (segmented neutrophils plus bands): ANC = WBC x (% segs + % bands). For example, if WBC is 2000 and segmented neutrophils are 20% with 5% bands, ANC = 2000 x 0.25 = 500. Risk stratification classifies patients as having mild neutropenia (ANC 1000-1500), moderate neutropenia (ANC 500-1000), or severe neutropenia (ANC below 500). Profound neutropenia is defined as ANC below 100 and carries the highest risk of sepsis and death."
    },
    riskFactors: [
      "Cytotoxic chemotherapy (the most common cause; myelosuppressive agents such as cyclophosphamide, doxorubicin, and cisplatin carry the highest risk)",
      "Hematological malignancies (leukemia, lymphoma, myelodysplastic syndromes) -- disease itself suppresses normal bone marrow function",
      "Radiation therapy involving large bone marrow-bearing areas (pelvis, sternum, vertebrae, long bones)",
      "Prior bone marrow or stem cell transplantation (engraftment period with profoundly suppressed counts)",
      "Advanced age (older adults have reduced bone marrow reserve and diminished immune function)",
      "Poor nutritional status and low serum albumin (impairs immune cell production and function)",
      "Pre-existing renal or hepatic impairment (delayed clearance of chemotherapy drugs prolongs bone marrow suppression)"
    ],
    diagnostics: [
      "Complete blood count with differential: calculate ANC (WBC x [% segs + % bands]); ANC below 500 defines severe neutropenia; monitor CBC daily during nadir period",
      "Blood cultures (at least 2 sets from separate venipuncture sites, plus cultures from each lumen of central venous access device): must be obtained BEFORE initiating antibiotics; aerobic and anaerobic bottles",
      "Urinalysis and urine culture: even without urinary symptoms, as the inflammatory response may be blunted; pyuria may be absent despite urinary tract infection",
      "Chest X-ray: infiltrates may be subtle or absent in neutropenic patients due to lack of inflammatory exudate; CT may be needed for persistent fever with normal chest X-ray",
      "Serum lactate: elevated levels (above 2 mmol/L) suggest tissue hypoperfusion and sepsis; serial monitoring guides resuscitation adequacy",
      "C-reactive protein (CRP) and procalcitonin: inflammatory markers that may help differentiate bacterial infection from viral or non-infectious causes of fever; procalcitonin above 0.5 ng/mL supports bacterial infection"
    ],
    management: [
      "Initiate empiric broad-spectrum antibiotics within 60 minutes of fever onset -- every hour of delay in antibiotic administration increases mortality; cefepime is a common first-line monotherapy choice",
      "Administer filgrastim (G-CSF) as prescribed to stimulate neutrophil production from the bone marrow; typically started 24-72 hours after last chemotherapy dose for primary prophylaxis in high-risk patients, or therapeutically during established febrile neutropenia",
      "Obtain all cultures (blood, urine, sputum, wound) BEFORE starting antibiotics but do NOT delay antibiotics while waiting for culture results",
      "Add antifungal coverage (fluconazole or caspofungin) if fever persists beyond 4-7 days of appropriate antibiotic therapy, as invasive fungal infection (Candida, Aspergillus) becomes increasingly likely in prolonged neutropenia",
      "Implement neutropenic precautions: private room, strict hand hygiene, no fresh flowers or plants (Aspergillus risk), no raw fruits or vegetables, avoid rectal temperatures or suppositories, avoid IM injections when possible",
      "Monitor vital signs every 4 hours (or more frequently if unstable); report any signs of sepsis (tachycardia, hypotension, tachypnea, altered mental status) immediately",
      "Maintain meticulous oral hygiene with soft toothbrush and non-alcohol-based mouthwash every 4 hours; inspect oral mucosa daily for mucositis, candidiasis, and herpetic lesions"
    ],
    nursingActions: [
      "Calculate and trend the ANC daily: ANC = WBC x (% segmented neutrophils + % bands); report ANC below 500 to the physician immediately and implement neutropenic precautions",
      "Assess temperature every 4 hours; instruct the patient to report any chills, rigors, or feeling of warmth immediately -- a single temperature of 38.3 C or sustained 38.0 C for one hour requires immediate blood cultures and antibiotic initiation",
      "Perform a thorough skin and mucous membrane assessment every shift -- inspect the oral cavity, perianal area, IV insertion sites, and any skin breakdown for signs of infection; remember that redness and swelling may be absent due to neutropenia",
      "Maintain strict hand hygiene (the single most important infection prevention measure) and ensure all visitors and healthcare workers perform hand hygiene before entering the room",
      "Avoid invasive procedures when possible: no rectal thermometers, rectal examinations, or suppositories (risk of perianal abscess and bacteremia from disrupted rectal mucosa); use electric razors instead of blades to prevent skin breaks",
      "Monitor IV sites for signs of phlebitis or infection every shift; rotate peripheral IV sites per facility protocol; central line dressing changes per protocol with strict aseptic technique",
      "Educate the patient and family about neutropenic precautions: hand hygiene, avoiding crowds and sick contacts, reporting fever immediately, dietary restrictions (no raw foods, well-cooked meats only), wearing a mask in common areas"
    ],
    assessmentFindings: [
      "Fever (may be the ONLY sign of infection in neutropenic patients): single oral temperature of 38.3 C or sustained 38.0 C for one hour; absence of classic inflammatory signs does not rule out infection",
      "Oral mucositis: erythema, ulceration, white patches (candidiasis), pain with swallowing; the oral mucosa is a common portal of entry for bacteria in neutropenic patients",
      "Perianal tenderness or erythema: a perianal abscess in a neutropenic patient may present with only mild tenderness without fluctuance or erythema; this is a surgical emergency if it progresses",
      "Central line exit site: subtle warmth, minimal erythema, or tenderness at the site; tunnel infections present as erythema and tenderness along the subcutaneous tunnel",
      "Sepsis indicators: tachycardia (HR above 100 bpm), hypotension (SBP below 90 mmHg or MAP below 65 mmHg), tachypnea (RR above 20), altered mental status, warm/flushed skin (early sepsis) or cool/mottled skin (late sepsis)",
      "Pulmonary infiltrates on chest X-ray may be absent despite pneumonia (insufficient neutrophils to create visible inflammatory infiltrate); persistent cough or dyspnea in a neutropenic patient warrants CT evaluation",
      "Laboratory findings: WBC often below 1000 with ANC below 500; elevated CRP and procalcitonin; elevated serum lactate in sepsis; positive blood cultures (identified in approximately 20-30% of febrile neutropenia episodes)"
    ],
    signs: {
      left: [
        "Low-grade fever (38.0-38.3 C) with stable vital signs",
        "Mild oral mucositis with intact oral mucosa",
        "ANC between 500-1000 (moderate neutropenia) without fever",
        "Mild fatigue and malaise during nadir period",
        "Central line site with no signs of infection",
        "Mild nausea without vomiting or diarrhea"
      ],
      right: [
        "Temperature 38.3 C or higher with ANC below 500 (febrile neutropenia -- initiate antibiotics within 60 minutes)",
        "Hypotension (SBP below 90 mmHg) with tachycardia (neutropenic sepsis)",
        "Rigors (uncontrolled shaking chills) indicating bacteremia",
        "Altered mental status or confusion (septic encephalopathy)",
        "Perianal abscess with systemic signs of infection",
        "Respiratory distress with new cough or infiltrates in a neutropenic patient"
      ]
    },
    medications: [
      {
        name: "Cefepime (Maxipime)",
        type: "Fourth-generation cephalosporin / antipseudomonal beta-lactam",
        action: "Binds to penicillin-binding proteins (PBPs) on the bacterial cell wall, inhibiting transpeptidation and disrupting cell wall synthesis, leading to bacterial cell lysis and death; provides broad-spectrum coverage against gram-negative organisms (including Pseudomonas aeruginosa), gram-positive organisms (Staphylococcus, Streptococcus), and is stable against many beta-lactamase enzymes",
        sideEffects: "Diarrhea, nausea, rash, injection site reactions, elevated hepatic enzymes, neurotoxicity at high doses or in renal impairment (confusion, encephalopathy, seizures), Clostridioides difficile-associated diarrhea",
        contra: "Known severe allergy to cephalosporins; caution with penicillin allergy (approximately 1-2% cross-reactivity); dose adjustment required in renal impairment (creatinine clearance below 60 mL/min)",
        pearl: "First-line empiric monotherapy for febrile neutropenia in many protocols; must be initiated within 60 minutes of documented fever; standard dose is 2 g IV every 8 hours; adjust dose for renal function; monitor for neurotoxicity especially in elderly patients or those with renal impairment"
      },
      {
        name: "Filgrastim (Neupogen) / Granulocyte Colony-Stimulating Factor (G-CSF)",
        type: "Hematopoietic growth factor / colony-stimulating factor",
        action: "Binds to G-CSF receptors on neutrophil precursor cells in the bone marrow, stimulating proliferation, differentiation, and maturation of neutrophil progenitor cells; also enhances the function of mature neutrophils by increasing phagocytic activity, chemotaxis, and antibody-dependent cell-mediated cytotoxicity; accelerates neutrophil recovery after chemotherapy-induced myelosuppression",
        sideEffects: "Bone pain (most common, affecting 20-30% of patients -- from marrow expansion), injection site reactions, splenomegaly and rare splenic rupture, elevated alkaline phosphatase and LDH, leukocytosis (overshoot), capillary leak syndrome (rare)",
        contra: "Known hypersensitivity to filgrastim or E. coli-derived proteins; should not be administered within 24 hours before or after chemotherapy (stimulating marrow during chemotherapy increases toxicity to rapidly dividing cells)",
        pearl: "Administer subcutaneously; typical dose is 5 mcg/kg/day starting 24-72 hours after chemotherapy completion and continuing until ANC recovers above 1000-1500 for 2-3 consecutive days; bone pain can be managed with acetaminophen or non-sedating analgesics; pegfilgrastim (Neulasta) is a long-acting form given as a single injection per chemotherapy cycle"
      },
      {
        name: "Fluconazole (Diflucan)",
        type: "Triazole antifungal agent",
        action: "Inhibits the fungal cytochrome P450 enzyme lanosterol 14-alpha-demethylase, blocking the conversion of lanosterol to ergosterol, an essential component of the fungal cell membrane; depletion of ergosterol increases cell membrane permeability, disrupts cell function, and inhibits fungal growth; primarily effective against Candida species and Cryptococcus neoformans",
        sideEffects: "Nausea, headache, abdominal pain, diarrhea, hepatotoxicity (monitor liver function tests), QT prolongation, rash; rare but serious: Stevens-Johnson syndrome, anaphylaxis",
        contra: "Concurrent use with cisapride, pimozide, or quinidine (risk of fatal cardiac arrhythmias from QT prolongation); severe hepatic disease; caution with other QT-prolonging medications",
        pearl: "Used as antifungal prophylaxis in patients with prolonged neutropenia (expected duration more than 7 days) and as treatment for oropharyngeal or esophageal candidiasis; does NOT cover Aspergillus species -- if invasive aspergillosis is suspected, voriconazole or caspofungin is required; loading dose is typically double the maintenance dose on day 1; multiple drug interactions via CYP450 inhibition (check all concurrent medications)"
      }
    ],
    pearls: [
      "Febrile neutropenia is a medical emergency -- empiric antibiotics must be administered within 60 MINUTES of fever onset, even before culture results are available; mortality increases with every hour of delay",
      "Calculate ANC daily during the nadir period: ANC = WBC x (% segs + % bands); severe neutropenia is ANC below 500; profound neutropenia is ANC below 100, which carries the highest risk of overwhelming sepsis",
      "The nadir (lowest blood count) typically occurs 7-14 days after chemotherapy -- this is when patients are at greatest risk and should be educated to monitor temperature twice daily, avoid crowds, and seek immediate care for any fever",
      "In a neutropenic patient, fever may be the ONLY sign of infection -- classic inflammatory signs (redness, swelling, pus) depend on neutrophil activity and will be absent or muted; never assume a neutropenic patient without visible infection is uninfected",
      "NEVER take a rectal temperature in a neutropenic patient -- the rectal mucosa is fragile and any disruption can introduce gut bacteria (especially gram-negative organisms) directly into the bloodstream, causing potentially fatal bacteremia",
      "Filgrastim (G-CSF) must NOT be given within 24 hours before or after chemotherapy administration -- stimulating bone marrow proliferation during chemotherapy exposure would increase the number of rapidly dividing cells destroyed by the drug, worsening myelosuppression",
      "Hand hygiene is the single most important intervention to prevent infection in neutropenic patients -- all healthcare workers, visitors, and the patient themselves must perform meticulous hand washing before any patient contact"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a patient 10 days after chemotherapy. The patient's WBC is 1,200, segmented neutrophils are 15%, and bands are 5%. What is the absolute neutrophil count (ANC), and what does it indicate?",
        options: [
          "ANC is 240 -- the patient has severe neutropenia and is at high risk for infection",
          "ANC is 1,200 -- the patient has a normal neutrophil count",
          "ANC is 180 -- the patient has moderate neutropenia",
          "ANC is 600 -- the patient has mild neutropenia"
        ],
        correct: 0,
        rationale: "ANC is calculated as WBC x (% segs + % bands) = 1,200 x (0.15 + 0.05) = 1,200 x 0.20 = 240. An ANC below 500 is classified as severe neutropenia. At day 10 post-chemotherapy, this patient is likely at or near the nadir and is at very high risk for life-threatening infection."
      },
      {
        question: "A neutropenic patient develops a temperature of 38.5 C. Blood cultures have been drawn. Which nursing action is MOST critical?",
        options: [
          "Wait for culture results before administering antibiotics",
          "Ensure empiric antibiotics are administered within 60 minutes of fever onset",
          "Apply cooling measures and recheck the temperature in 30 minutes",
          "Administer acetaminophen and continue routine monitoring"
        ],
        correct: 1,
        rationale: "Febrile neutropenia is a medical emergency. Empiric broad-spectrum antibiotics (such as cefepime) must be administered within 60 minutes of documented fever. Delaying antibiotics to wait for culture results significantly increases mortality. While cultures should be obtained before antibiotics, the antibiotic should not be held for culture results."
      },
      {
        question: "A practical nurse is reinforcing discharge teaching for a patient who completed chemotherapy 3 days ago. Which instruction is MOST important to emphasize?",
        options: [
          "Resume a normal diet including fresh salads and raw fruits",
          "Take your temperature twice daily and go to the emergency department immediately if it reaches 38.3 C or higher",
          "You may return to work and normal social activities immediately",
          "Rectal thermometers provide the most accurate temperature readings"
        ],
        correct: 1,
        rationale: "Patients must be educated to monitor temperature twice daily during the nadir period (7-14 days post-chemotherapy) and to seek immediate emergency care for any temperature of 38.3 C or higher, as this constitutes febrile neutropenia. Fresh raw foods carry infection risk. Social activities with crowds should be avoided. Rectal thermometers are contraindicated in neutropenic patients."
      }
    ]
  },

  "fall-risk-assessment-rpn": {
    title: "Fall Risk Assessment for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Balance, Mobility, and Fall Risk Mechanisms",
      content: "Falls are the leading cause of injury-related morbidity and mortality in hospitalized patients and community-dwelling older adults. Understanding the physiology of balance maintenance is essential for recognizing why patients fall and how to prevent falls effectively. Postural stability (balance) depends on the coordinated integration of three sensory systems: the visual system, the vestibular system, and the proprioceptive (somatosensory) system. The visual system provides spatial orientation information about the body's position relative to the environment. The vestibular apparatus in the inner ear (semicircular canals and otolith organs) detects head position and angular and linear acceleration, providing information about motion and gravitational orientation. The proprioceptive system consists of mechanoreceptors (muscle spindles, Golgi tendon organs, joint receptors) located in muscles, tendons, ligaments, and joint capsules throughout the body, particularly concentrated in the feet and ankles, which detect joint position, muscle stretch, and pressure distribution. These three sensory inputs are integrated in the cerebellum, basal ganglia, and brainstem vestibular nuclei to generate coordinated motor responses that maintain upright posture and prevent falls. The motor response component requires adequate muscle strength (particularly in the lower extremities -- quadriceps, hip abductors, and ankle dorsiflexors), intact neuromuscular transmission, and normal joint range of motion. With aging, each component of balance deteriorates progressively. Visual acuity and depth perception decline. Vestibular hair cells degenerate, reducing sensitivity to position changes. Proprioceptive receptor density decreases, particularly in the feet. Muscle mass and strength decline (sarcopenia), with a 30-50% reduction in muscle mass between ages 30 and 80. Reaction time slows due to decreased nerve conduction velocity and central processing speed. Bone density decreases (osteoporosis), making fractures from falls more likely and more severe. Falls result from the interaction between intrinsic factors (patient-related conditions that impair balance) and extrinsic factors (environmental hazards that challenge balance). Intrinsic factors include orthostatic hypotension (a drop in systolic blood pressure of 20 mmHg or more, or diastolic of 10 mmHg or more, within 3 minutes of standing), which reduces cerebral perfusion and causes dizziness or syncope. Medications are a major modifiable risk factor: sedatives, opioids, antihypertensives, diuretics, antihistamines, and psychotropic medications all increase fall risk through mechanisms including sedation, orthostatic hypotension, impaired cognition, and altered gait. Polypharmacy (use of 4 or more medications) independently increases fall risk. Cognitive impairment from delirium, dementia, or acute illness reduces safety awareness and judgment. The practical nurse plays a critical role in fall prevention by conducting systematic risk assessments, implementing individualized fall prevention interventions, and reassessing risk whenever a patient's condition changes."
    },
    riskFactors: [
      "Age 65 years or older (the single strongest demographic risk factor for falls; risk doubles with each decade after 65)",
      "History of previous falls (the strongest predictor of future falls -- patients who have fallen once are 2-3 times more likely to fall again)",
      "Polypharmacy (4 or more medications), especially sedatives, opioids, antihypertensives, benzodiazepines, and diuretics",
      "Cognitive impairment from delirium, dementia, or acute illness (impaired safety awareness and judgment)",
      "Gait and balance disturbances from neurological conditions (stroke, Parkinson disease, peripheral neuropathy), musculoskeletal conditions (arthritis, foot deformities), or deconditioning",
      "Visual impairment (cataracts, glaucoma, macular degeneration, bifocal or multifocal lenses on stairs)",
      "Orthostatic hypotension (common in elderly patients, those on antihypertensives, and patients with dehydration or prolonged bedrest)"
    ],
    diagnostics: [
      "Morse Fall Scale (MFS): validated 6-item tool scoring 0-125 points; items include history of falling, secondary diagnosis, ambulatory aid use, IV therapy or heparin lock, gait quality, and mental status; score 0-24 low risk, 25-44 moderate risk, 45 or above high risk",
      "Hendrich II Fall Risk Model: validated tool using 8 risk factors including confusion/disorientation, depression, altered elimination, dizziness/vertigo, gender, prescribed antiepileptics or benzodiazepines, and Get-Up-and-Go test; score 5 or above indicates high risk",
      "Timed Get-Up-and-Go Test (TUG): patient rises from a chair, walks 3 meters, turns, walks back, and sits down; normal completion in less than 12 seconds; 12-20 seconds suggests moderate fall risk; more than 20 seconds indicates high fall risk and need for assistive device",
      "Orthostatic vital signs: measure blood pressure and heart rate in supine position, then after standing for 1 minute and 3 minutes; positive if SBP drops 20 mmHg or more, or DBP drops 10 mmHg or more, or symptoms (dizziness, lightheadedness) occur",
      "Medication review: systematic review of all medications (prescription, over-the-counter, supplements) for fall-risk-increasing drugs (FRIDs): benzodiazepines, opioids, antihypertensives, diuretics, antihistamines, antipsychotics, antidepressants",
      "Vision screening: assess visual acuity, depth perception, and peripheral vision; refer for ophthalmologic evaluation if deficits identified; ensure corrective lenses are worn and clean"
    ],
    management: [
      "Implement universal fall precautions for ALL patients: bed in lowest position with wheels locked, call bell within reach, non-skid footwear, clear pathways, adequate lighting, toilet accessibility",
      "Individualize fall prevention interventions based on identified risk factors: for orthostatic hypotension -- instruct sit-to-stand gradually, dangle legs at bedside before standing; for visual impairment -- ensure glasses are worn and clean, adequate lighting; for cognitive impairment -- frequent rounding, 1:1 sitter if needed",
      "Implement toileting schedule (offer assistance every 2 hours) for patients with urinary urgency or frequency, as unassisted trips to the bathroom are the most common activity associated with inpatient falls",
      "Use bed exit alarms and chair alarms for high-risk patients as per facility protocol; alarms alert staff to unassisted mobility attempts but are NOT a substitute for regular rounding",
      "Ensure assistive devices (walkers, canes, wheelchairs) are within reach and patients are educated on proper use; ensure devices are fitted correctly (walker height at wrist crease when arms hang naturally)",
      "Review and communicate fall risk status at every handoff using SBAR format and during interdisciplinary rounds; update the care plan whenever risk level changes",
      "For patients who have fallen: perform immediate post-fall assessment (head-to-toe with focus on head injury, fracture, neurological status), obtain diagnostic imaging as ordered, complete incident report, implement enhanced fall prevention interventions, and conduct a fall huddle to identify contributing factors and prevention strategies"
    ],
    nursingActions: [
      "Perform fall risk assessment on admission, every shift, after a fall, and with any change in patient condition (new medication, change in mental status, post-procedure, change in mobility) using the facility's validated tool (Morse or Hendrich II)",
      "Conduct purposeful hourly rounding addressing the 4 P's: Pain (assess and manage), Position (assist with repositioning), Personal needs (toileting, hydration), and Placement (call bell, personal items within reach)",
      "Measure orthostatic vital signs for all patients on antihypertensive medications, diuretics, or those reporting dizziness; educate patients to rise slowly (sit up, dangle, stand) and hold onto a stable surface",
      "Apply yellow fall risk identification band and post fall risk signage at the bedside and outside the room per facility protocol to alert all staff to the patient's risk status",
      "Assist with ambulation using proper body mechanics: stand on the patient's weaker side, use a gait belt for unsteady patients, walk alongside the patient, and have a wheelchair or chair available along the route for rest stops",
      "Educate patients and families about fall prevention: proper footwear (non-skid, flat, well-fitting), importance of using the call bell for assistance, avoiding reaching or bending without help, keeping the environment free of clutter, and using handrails",
      "Document fall risk score, interventions implemented, patient and family education provided, and patient response; communicate high-risk status during handoff reports"
    ],
    assessmentFindings: [
      "Unsteady gait: shuffling, wide-based stance, veering to one side, inability to maintain straight-line walking; may indicate neurological deficit, medication effect, or musculoskeletal impairment",
      "Orthostatic hypotension: drop in SBP of 20 mmHg or more or DBP of 10 mmHg or more within 3 minutes of standing; patient may report dizziness, lightheadedness, visual changes, or near-syncope",
      "Cognitive changes: confusion, disorientation to time/place/person, impaired judgment, inability to follow safety instructions, agitation, impulsivity (attempts to get out of bed without assistance)",
      "Lower extremity weakness: inability to rise from a chair without using arms (positive Get-Up-and-Go test concern), difficulty with heel-to-toe walking, foot drop, limited ankle dorsiflexion",
      "Environmental hazards: wet floors, loose cords, poor lighting, cluttered pathways, bed in elevated position, locked wheels on wheelchair not engaged, assistive device out of reach",
      "Medication effects: sedation, drowsiness, slurred speech, poor coordination, delayed reaction time; particularly concerning with new medication starts or dose changes in the past 24-48 hours",
      "Sensory deficits: uncorrected visual impairment, peripheral neuropathy (decreased sensation in feet, inability to feel floor surface), hearing impairment (cannot hear verbal safety warnings)"
    ],
    signs: {
      left: [
        "Morse Fall Scale score 25-44 (moderate risk requiring standard fall precautions)",
        "Mild unsteadiness when first standing that resolves with stabilization",
        "Orthostatic BP drop of 10-15 mmHg without symptoms",
        "Patient requesting assistance with ambulation appropriately",
        "Mild drowsiness from scheduled medications with maintained orientation",
        "Slight shuffling gait with correct use of assistive device"
      ],
      right: [
        "Morse Fall Scale score 45 or above (high risk requiring intensive fall prevention interventions)",
        "Patient found on the floor (fall has occurred -- assess for injury immediately)",
        "Sudden loss of consciousness or syncope",
        "New-onset severe confusion or agitation with attempts to climb over bedrails",
        "Orthostatic BP drop of 30 mmHg or more with dizziness and near-syncope",
        "Hip pain and shortened, externally rotated leg after a fall (suspected hip fracture -- do not ambulate)"
      ]
    },
    medications: [
      {
        name: "Acetaminophen (Tylenol)",
        type: "Non-opioid analgesic / antipyretic",
        action: "Inhibits cyclooxygenase (COX) enzymes primarily in the central nervous system, reducing prostaglandin synthesis in the hypothalamic thermoregulatory center (antipyretic effect) and modulating pain perception through central mechanisms including possible serotonergic pathway activation; preferred first-line analgesic in elderly patients because it does not cause sedation, orthostatic hypotension, or GI bleeding that increase fall risk",
        sideEffects: "Hepatotoxicity at doses exceeding 4 g/day (2 g/day maximum in patients with hepatic impairment or chronic alcohol use), nausea, rash (rare), acute liver failure with overdose",
        contra: "Severe hepatic impairment, active liver disease, alcohol use disorder (3 or more drinks daily); caution with warfarin (may potentiate anticoagulant effect at doses above 2 g/day)",
        pearl: "Preferred over NSAIDs and opioids for pain management in fall-risk patients because it does NOT cause sedation, dizziness, GI bleeding, or orthostatic hypotension; found in over 600 combination products (cold remedies, sleep aids) -- always check total daily acetaminophen intake from ALL sources to prevent inadvertent overdose"
      },
      {
        name: "Vitamin D (Cholecalciferol / Ergocalciferol)",
        type: "Fat-soluble vitamin / bone metabolism regulator",
        action: "Converted to 25-hydroxyvitamin D in the liver, then to active 1,25-dihydroxyvitamin D (calcitriol) in the kidneys; calcitriol promotes calcium and phosphate absorption from the intestine, maintains serum calcium levels, supports bone mineralization by osteoblasts, and has direct effects on skeletal muscle function through vitamin D receptors on muscle fibers, improving muscle strength and neuromuscular coordination",
        sideEffects: "Hypercalcemia at excessive doses (nausea, vomiting, constipation, confusion, polyuria, kidney stones), hypercalciuria, soft tissue calcification with chronic toxicity",
        contra: "Hypercalcemia, hypervitaminosis D, severe renal impairment (impaired conversion to active form), sarcoidosis and other granulomatous diseases (unregulated conversion to active form causing hypercalcemia)",
        pearl: "Vitamin D supplementation (800-1000 IU daily) combined with calcium reduces fall risk by 19-26% in elderly patients by improving proximal muscle strength and neuromuscular function; check serum 25-hydroxyvitamin D level -- deficiency is below 30 nmol/L; most elderly patients and those in long-term care facilities are deficient"
      },
      {
        name: "Alendronate (Fosamax)",
        type: "Bisphosphonate / bone resorption inhibitor",
        action: "Binds to hydroxyapatite crystals on the bone surface, where it is internalized by osteoclasts during bone resorption; within the osteoclast, it inhibits farnesyl pyrophosphate synthase (an enzyme in the mevalonate pathway), disrupting osteoclast function and inducing osteoclast apoptosis (programmed cell death); reduces bone resorption, increases bone mineral density, and decreases fracture risk when falls do occur",
        sideEffects: "Esophageal irritation and ulceration, abdominal pain, nausea, musculoskeletal pain, osteonecrosis of the jaw (rare, mainly with IV bisphosphonates and dental procedures), atypical femoral fractures with long-term use (more than 5 years)",
        contra: "Esophageal stricture or achalasia (inability to remain upright), hypocalcemia (must correct before starting), severe renal impairment (CrCl below 35 mL/min), inability to sit or stand upright for at least 30 minutes after administration",
        pearl: "Must be taken first thing in the morning on an empty stomach with a FULL glass (240 mL) of plain water -- no food, beverages, or other medications for at least 30 minutes after taking; patient must remain upright (sitting or standing) for 30 minutes to prevent esophageal irritation; weekly dosing (70 mg) improves adherence compared to daily dosing (10 mg)"
      }
    ],
    pearls: [
      "The Morse Fall Scale is one of the most widely used validated tools: scores of 0-24 indicate low risk, 25-44 indicate moderate risk, and 45 or above indicate high risk -- assessment must be repeated on admission, every shift, after a fall, and with any status change",
      "Previous fall history is the STRONGEST single predictor of future falls -- always ask patients about falls in the past 6-12 months, including near-falls (stumbles, grabbing furniture for support) during admission assessment",
      "Purposeful hourly rounding using the 4 P's (Pain, Position, Personal needs, Placement) reduces call bell use by 37% and patient falls by up to 50% according to published studies",
      "Medications are the most modifiable risk factor for falls -- conduct a thorough medication review and report to the RN or physician any combination of fall-risk-increasing drugs (FRIDs), especially benzodiazepines, opioids, and antihypertensives",
      "Bed alarms are an alert system, NOT a restraint or prevention device -- they notify staff of unassisted mobility attempts but cannot prevent falls; they must be used in conjunction with regular rounding and other prevention strategies",
      "After a fall occurs, the priority assessment follows the ABCs (airway, breathing, circulation), then a neurological assessment (level of consciousness, pupil response, orientation), then musculoskeletal assessment (pain, deformity, range of motion); do NOT move the patient if a spinal injury is suspected",
      "Orthostatic hypotension testing requires measurements in supine, then at 1 minute and 3 minutes after standing -- a positive result (SBP drop of 20 mmHg or more or DBP drop of 10 mmHg or more) is present in up to 30% of elderly hospitalized patients and is highly modifiable through medication adjustment and patient education"
    ],
    quiz: [
      {
        question: "A practical nurse is admitting an 82-year-old patient who takes metoprolol, furosemide, and lorazepam. The patient reports two falls in the past month. Using the Morse Fall Scale, this patient would most likely be classified as which fall risk level?",
        options: [
          "No risk (score 0-24)",
          "Low risk (score 0-24)",
          "Moderate risk (score 25-44)",
          "High risk (score 45 or above)"
        ],
        correct: 3,
        rationale: "This patient has multiple high-scoring Morse Fall Scale items: history of falling (25 points), secondary diagnoses (15 points), use of IV/heparin lock or ambulatory aid (likely contributing points), and the combination of three fall-risk-increasing medications (antihypertensive, diuretic, benzodiazepine). The fall history alone contributes 25 points, and with additional risk factors, the score would exceed 45, placing the patient in the high-risk category."
      },
      {
        question: "A practical nurse measures a patient's blood pressure as 142/88 mmHg while lying down. After standing for 2 minutes, the blood pressure is 116/72 mmHg and the patient reports feeling lightheaded. Which action should the nurse take FIRST?",
        options: [
          "Document the finding and continue morning care",
          "Assist the patient to sit down safely and report orthostatic hypotension to the RN or physician",
          "Administer the scheduled antihypertensive medication as ordered",
          "Encourage the patient to walk briskly to improve circulation"
        ],
        correct: 1,
        rationale: "This patient demonstrates orthostatic hypotension (SBP dropped 26 mmHg, DBP dropped 16 mmHg) with symptoms (lightheadedness). The immediate priority is patient safety -- assist to a seated position to prevent syncope and a fall. The finding must be reported to the RN or physician because medication adjustments may be needed. Administering the antihypertensive could worsen the hypotension."
      },
      {
        question: "A high-risk fall patient is found on the floor beside the bed. The patient is alert and oriented, denying loss of consciousness but reports right hip pain. Which nursing action is MOST appropriate?",
        options: [
          "Help the patient back to bed immediately and resume normal activities",
          "Perform a focused assessment including neurovascular status of the right leg, do NOT ambulate the patient, and notify the physician",
          "Apply ice to the right hip and recheck in one hour",
          "Complete the incident report before assessing the patient"
        ],
        correct: 1,
        rationale: "After a fall with hip pain, the priority is a focused assessment including neurovascular status of the affected extremity and assessment for signs of hip fracture (pain, shortening and external rotation of the leg, inability to bear weight). The patient should NOT be ambulated until fracture is ruled out. The physician must be notified for orders including possible imaging. The incident report is important but comes after patient assessment and care."
      }
    ]
  },

  "congenital-hypothyroidism-rpn": {
    title: "Congenital Hypothyroidism for Practical Nurses",
    cellular: {
      title: "Pathophysiology of Thyroid Hormone Deficiency in the Newborn",
      content: "Congenital hypothyroidism (CH) is one of the most common preventable causes of intellectual disability worldwide, occurring in approximately 1 in 2,000 to 4,000 live births. The condition results from insufficient production of thyroid hormones (thyroxine, T4, and triiodothyronine, T3) at or before birth. The thyroid gland develops from the foramen cecum at the base of the tongue during the third week of gestation and migrates to its final position in the anterior neck by the seventh week. Thyroid dysgenesis (abnormal gland development) accounts for approximately 85% of congenital hypothyroidism cases and includes thyroid agenesis (complete absence of the gland), thyroid ectopy (gland arrested at an abnormal location along the migration pathway, most commonly at the base of the tongue as a lingual thyroid), and thyroid hypoplasia (underdeveloped gland). The remaining 15% of cases result from dyshormonogenesis -- defects in any of the enzymatic steps of thyroid hormone synthesis, including iodide trapping, organification (iodination of tyrosine residues on thyroglobulin), coupling of iodotyrosines, or thyroglobulin synthesis and release. Thyroid hormones are essential for normal brain development, particularly during the first 2-3 years of life. They regulate neuronal migration, myelination of nerve fibers, synaptogenesis (formation of synaptic connections), and dendritic branching in the developing cerebral cortex, hippocampus, and cerebellum. Without adequate thyroid hormone, these processes are severely impaired, resulting in permanent neurological damage if treatment is not initiated within the first 2-4 weeks of life. The term historically used for severe untreated congenital hypothyroidism was cretinism, characterized by profound intellectual disability, short stature, coarse facial features, large protruding tongue, umbilical hernia, and constipation. The hypothalamic-pituitary-thyroid (HPT) axis regulates thyroid function through a negative feedback loop. The hypothalamus secretes thyrotropin-releasing hormone (TRH), which stimulates the anterior pituitary to release thyroid-stimulating hormone (TSH). TSH acts on the thyroid gland to stimulate synthesis and release of T4 and T3. When thyroid hormone levels are adequate, T4 and T3 inhibit further release of TRH and TSH (negative feedback). In primary congenital hypothyroidism (the most common form), the thyroid gland itself is defective, resulting in low T4 and elevated TSH (the pituitary is producing more TSH in an attempt to stimulate the non-functioning gland). In central (secondary/tertiary) hypothyroidism (rare, approximately 1 in 50,000-100,000), the defect is in the pituitary or hypothalamus, resulting in low T4 and inappropriately low or normal TSH. Newborn screening programs were established specifically to detect this condition before clinical signs become apparent, because by the time physical features of hypothyroidism are clinically visible, irreversible brain damage may already have occurred. In most jurisdictions, newborn screening is performed between 24 and 72 hours of life using a heel-prick blood sample collected on filter paper. The screening test measures TSH (and/or T4 depending on the program). An elevated TSH on screening triggers a confirmatory venous blood draw for serum TSH and free T4. Treatment with levothyroxine must begin immediately upon confirmation -- the goal is to normalize thyroid hormone levels within 2-4 weeks to prevent neurodevelopmental impairment."
    },
    riskFactors: [
      "Female sex (congenital hypothyroidism occurs approximately 2:1 female to male ratio)",
      "Family history of thyroid disorders, especially autoimmune thyroid disease or known dyshormonogenesis mutations",
      "Maternal iodine deficiency during pregnancy (iodine is essential for thyroid hormone synthesis; deficiency is the leading cause of preventable CH worldwide)",
      "Maternal Graves disease treated with antithyroid medications (propylthiouracil or methimazole) during pregnancy, which cross the placenta and suppress fetal thyroid function",
      "Down syndrome (trisomy 21) -- congenital hypothyroidism occurs 35 times more frequently in infants with Down syndrome",
      "Prematurity (immature HPT axis and reduced thyroid hormone production; transient hypothyroidism may occur)",
      "Maternal exposure to excess iodine (contrast dyes, amiodarone, iodine-containing antiseptics) during pregnancy, which can paradoxically suppress fetal thyroid function (Wolff-Chaikoff effect)"
    ],
    diagnostics: [
      "Newborn screening (heel-prick blood spot): performed between 24-72 hours of life; measures TSH and/or T4 on filter paper; elevated TSH (above cutoff, typically 20-25 mU/L) or low T4 triggers recall for confirmatory testing; screening must NOT be missed, delayed, or repeated too early (before 24 hours) as physiological TSH surge immediately after birth can cause false results",
      "Confirmatory venous blood draw: serum TSH and free T4; elevated TSH (typically above 10 mU/L) with low free T4 confirms primary congenital hypothyroidism; must be obtained as soon as abnormal screening is reported",
      "Thyroid ultrasound: identifies the presence, location, and size of the thyroid gland; differentiates thyroid agenesis (absent gland), ectopy (gland in abnormal position), and hypoplasia (small gland); can be performed without delaying treatment initiation",
      "Thyroid radionuclide scan (technetium-99m or iodine-123): provides functional imaging to determine if thyroid tissue is present and its location; helps differentiate dysgenesis from dyshormonogenesis; optional and should not delay treatment",
      "Serum thyroglobulin: low or undetectable in thyroid agenesis; elevated in dyshormonogenesis (gland is present but not producing hormone efficiently); helps determine the underlying etiology",
      "Bone age X-ray (knee radiograph at birth): delayed bone age (absent distal femoral and proximal tibial epiphyses at term) indicates in utero hypothyroidism and suggests more severe or prolonged prenatal thyroid hormone deficiency"
    ],
    management: [
      "Initiate levothyroxine (synthetic T4) immediately upon confirmatory diagnosis -- treatment should NOT be delayed for additional imaging or testing; starting dose is 10-15 mcg/kg/day for neonates",
      "Crush levothyroxine tablet and mix with a small amount (1-2 mL) of breast milk or water; administer using a syringe directly into the infant's mouth; do NOT mix with soy formula or iron supplements (impair absorption)",
      "Recheck serum TSH and free T4 two weeks after starting treatment, then at 4 weeks, every 1-2 months during the first 6 months, every 3-4 months from 6 months to 3 years, and every 6-12 months thereafter; adjust dose to maintain free T4 in the upper half of normal range and TSH between 0.5-2.0 mU/L",
      "Monitor growth (length, weight, head circumference) at every well-child visit and plot on standardized growth charts; linear growth acceleration is one of the earliest indicators of adequate treatment",
      "Refer to pediatric endocrinologist for ongoing management, dose adjustments, and determination of whether the condition is permanent or transient (reassessment trial off medication at age 3 if the etiology is uncertain)",
      "Ensure developmental screening at all recommended intervals using validated tools (Ages and Stages Questionnaire, Denver II); early referral to developmental services (speech therapy, occupational therapy) if delays are identified",
      "Educate parents about the critical importance of medication compliance -- even 1-2 weeks of missed doses can impair brain development in infants; provide clear written instructions on administration, storage, and when to seek medical attention"
    ],
    nursingActions: [
      "Ensure the newborn screening blood sample is collected between 24-72 hours of life per provincial or state protocol; document the time of collection and confirm the sample was sent to the laboratory; if the infant is discharged before 24 hours, ensure a follow-up screening appointment is scheduled",
      "Monitor the newborn for early signs of hypothyroidism: prolonged jaundice (unconjugated hyperbilirubinemia beyond 2 weeks), poor feeding, excessive sleepiness, constipation, hypothermia, large fontanelles, hoarse cry, and abdominal distension with umbilical hernia",
      "Administer levothyroxine at the same time each day, preferably in the morning 30-60 minutes before feeding; crush tablet and mix with small amount of breast milk or water; DO NOT mix with soy-based formula, calcium-fortified formula, or iron-containing supplements as these reduce absorption by 50% or more",
      "Teach parents to recognize signs of over-treatment (hyperthyroidism from excessive levothyroxine dose): irritability, difficulty sleeping, excessive sweating, diarrhea, tachycardia, poor weight gain despite adequate feeding, and tremors",
      "Weigh the infant at each visit and measure length and head circumference; plot measurements on growth charts; report failure to gain weight or stalled linear growth as these may indicate inadequate dosing",
      "Coordinate follow-up laboratory appointments for TSH and free T4 monitoring; emphasize to parents that laboratory follow-up is essential and non-negotiable for the first 3 years of life to ensure optimal brain development",
      "Provide emotional support to parents receiving the diagnosis; reassure them that with prompt and consistent treatment, children with congenital hypothyroidism achieve normal intelligence and development in the vast majority of cases"
    ],
    assessmentFindings: [
      "Prolonged neonatal jaundice: unconjugated hyperbilirubinemia persisting beyond 14 days of life; caused by delayed hepatic maturation of glucuronyl transferase due to thyroid hormone deficiency",
      "Large posterior fontanelle (greater than 1 cm) and wide anterior fontanelle: delayed ossification of skull bones from inadequate thyroid hormone-dependent bone maturation",
      "Macroglossia (large, protruding tongue): myxedematous infiltration of tongue tissue with glycosaminoglycans; may contribute to feeding difficulties and noisy breathing",
      "Umbilical hernia: from poor abdominal muscle tone and delayed closure of the umbilical ring due to thyroid hormone deficiency affecting connective tissue and muscle development",
      "Hypothermia and mottled skin: impaired thermogenesis from reduced metabolic rate; thyroid hormones regulate basal metabolic rate through mitochondrial stimulation of oxidative phosphorylation",
      "Constipation and abdominal distension: decreased gastrointestinal motility from reduced metabolic activity and impaired smooth muscle function",
      "Lethargy, poor feeding, and excessive sleepiness: reduced central nervous system stimulation from thyroid hormone deficiency; these are often the earliest clinical signs that prompt investigation"
    ],
    signs: {
      left: [
        "Mild feeding sluggishness or sleepiness in the newborn period",
        "Slightly prolonged jaundice (day 10-14 of life)",
        "Mildly decreased stooling frequency (one stool per day in a breastfed newborn)",
        "Slightly large posterior fontanelle on examination",
        "Mild constipation responsive to dietary adjustment",
        "Subtle hoarseness of cry noted on close examination"
      ],
      right: [
        "Persistent severe jaundice beyond 3 weeks with total bilirubin rising (risk of kernicterus if untreated)",
        "Severe hypothermia (temperature below 36.0 C) unresponsive to warming measures",
        "Respiratory distress from macroglossia obstructing the airway",
        "Complete refusal to feed with progressive weight loss",
        "Markedly delayed developmental milestones by 3-6 months (no social smile, poor head control, absent tracking)",
        "Myxedema coma (rare in neonates, severe hypothyroidism with respiratory failure, hypothermia, and unresponsiveness)"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (Synthroid / Eltroxin / Euthyrox)",
        type: "Synthetic thyroid hormone (T4) replacement",
        action: "Provides exogenous thyroxine (T4) which is converted to the active form triiodothyronine (T3) by deiodinase enzymes in peripheral tissues (liver, kidneys, brain); T3 enters the cell nucleus and binds to thyroid hormone receptors, activating transcription of genes essential for neuronal development (myelination, synaptogenesis), skeletal growth (chondrocyte proliferation and maturation), and metabolic regulation (mitochondrial oxygen consumption, protein synthesis, carbohydrate and lipid metabolism)",
        sideEffects: "Over-treatment causes hyperthyroid symptoms: tachycardia, irritability, diarrhea, weight loss, excessive sweating, restlessness, poor sleeping, premature craniosynostosis (accelerated bone age) with prolonged over-treatment; under-treatment allows continued neurodevelopmental impairment",
        contra: "Uncorrected adrenal insufficiency (thyroid hormone replacement increases cortisol clearance and can precipitate adrenal crisis); recent myocardial infarction (in adults); thyrotoxicosis",
        pearl: "Neonatal starting dose is 10-15 mcg/kg/day (much higher per-kg dose than adults because of rapid brain growth demands); tablets should be crushed and mixed with small amount of breast milk or water -- NEVER soy formula, calcium, or iron within 4 hours; goal is free T4 in upper half of normal range within 2 weeks of starting treatment; dose increases with weight gain throughout infancy"
      },
      {
        name: "Vitamin D (Cholecalciferol)",
        type: "Fat-soluble vitamin / bone metabolism regulator",
        action: "Converted to 25-hydroxyvitamin D in the liver, then to active 1,25-dihydroxyvitamin D (calcitriol) in the kidneys; calcitriol promotes intestinal calcium and phosphate absorption, supports bone mineralization, and works synergistically with thyroid hormone to promote normal skeletal growth and development; particularly important in hypothyroid infants who have delayed bone maturation and are at risk for rickets",
        sideEffects: "Hypercalcemia at excessive doses (vomiting, constipation, irritability, failure to thrive, nephrocalcinosis), hypercalciuria",
        contra: "Hypercalcemia, hypervitaminosis D, Williams syndrome (increased sensitivity to vitamin D causing hypercalcemia), severe renal impairment",
        pearl: "All breastfed infants should receive 400 IU vitamin D daily from birth regardless of thyroid status (Canadian Paediatric Society and AAP recommendation); infants with congenital hypothyroidism may require monitoring of vitamin D status (25-hydroxyvitamin D level) because thyroid hormones influence vitamin D metabolism; administer using the liquid dropper provided; formula-fed infants consuming at least 1 liter of vitamin D-fortified formula daily do not need supplementation"
      },
      {
        name: "Iron (Ferrous Sulfate / Fer-In-Sol)",
        type: "Iron supplement / hematopoietic mineral",
        action: "Provides elemental iron for incorporation into hemoglobin (oxygen transport), myoglobin (muscle oxygen storage), and iron-containing enzymes (cytochromes in the electron transport chain for cellular energy production); iron is also essential for myelination of the central nervous system, particularly during the first 2 years of life when brain growth is most rapid",
        sideEffects: "Constipation (common -- already a concern in hypothyroid infants), dark stools (harmless discoloration), nausea, GI upset, staining of teeth (liquid preparations -- administer with a syringe toward the back of the mouth and follow with water)",
        contra: "Iron overload states (hemochromatosis, hemosiderosis), hemolytic anemias (thalassemia major unless iron deficient), active GI ulceration or bleeding, repeated blood transfusions (transfusional iron overload)",
        pearl: "Must be given at least 4 HOURS apart from levothyroxine because iron binds to thyroid hormone in the gut and reduces absorption by 50% or more; administer between meals with vitamin C-containing juice to enhance absorption; liquid iron can stain teeth -- use a syringe to deliver medication toward the back of the mouth and follow with water; monitor CBC and ferritin to guide therapy duration"
      }
    ],
    pearls: [
      "Newborn screening for congenital hypothyroidism is one of the most important preventive health measures -- detection and treatment within the first 2-4 weeks of life prevents intellectual disability and allows normal neurodevelopment in the vast majority of cases",
      "Levothyroxine must NEVER be mixed with soy-based formula, calcium-fortified formula, or iron supplements -- these substances bind to levothyroxine in the gut and reduce absorption by 50% or more; iron must be given at least 4 hours apart from levothyroxine",
      "The goal of treatment is to normalize free T4 within 2 weeks and TSH within 4 weeks of starting levothyroxine -- the target free T4 should be in the upper half of the normal range for age, and TSH should be between 0.5-2.0 mU/L",
      "If the newborn screening blood sample is collected before 24 hours of life, results may be unreliable due to the physiological TSH surge that occurs immediately after birth -- a repeat screening should be obtained at the appropriate time",
      "Prolonged neonatal jaundice (beyond 14 days) in a full-term infant should always prompt evaluation for congenital hypothyroidism -- this is one of the earliest and most common clinical signs",
      "Parents must understand that congenital hypothyroidism requires lifelong medication in most cases -- even though the child appears healthy on treatment, discontinuing levothyroxine will cause recurrence of hypothyroid symptoms and potential developmental regression",
      "Monitor growth closely during the first 3 years of life -- linear growth acceleration (catch-up growth) is the best clinical indicator of adequate thyroid hormone replacement; stalled growth despite normal labs may indicate poor medication adherence or absorption issues"
    ],
    quiz: [
      {
        question: "A practical nurse is caring for a 3-week-old infant whose newborn screening has returned with an elevated TSH level. The confirmatory blood work shows TSH of 85 mU/L and free T4 of 5 pmol/L (low). Which action should the nurse anticipate as the HIGHEST priority?",
        options: [
          "Schedule a thyroid ultrasound before initiating any treatment",
          "Immediate initiation of levothyroxine replacement therapy",
          "Repeat the newborn screening test in 2 weeks to confirm",
          "Refer to genetics for karyotype analysis before treatment"
        ],
        correct: 1,
        rationale: "Confirmed congenital hypothyroidism (elevated TSH with low free T4) requires IMMEDIATE initiation of levothyroxine. Treatment must not be delayed for additional imaging or genetic testing because every week without adequate thyroid hormone during the critical brain development period increases the risk of permanent intellectual disability. Ultrasound and further testing can be performed after treatment has begun."
      },
      {
        question: "A parent asks the practical nurse how to administer levothyroxine to their 6-week-old infant who is exclusively breastfed. Which instruction is CORRECT?",
        options: [
          "Mix the crushed tablet into a full bottle of soy formula",
          "Crush the tablet and mix with a small amount of breast milk; give by syringe 30-60 minutes before the next feeding",
          "Dissolve the tablet in iron-fortified cereal",
          "Give the tablet whole with a sip of juice"
        ],
        correct: 1,
        rationale: "Levothyroxine tablets should be crushed and mixed with a small amount (1-2 mL) of breast milk or water and administered by syringe directly into the infant's mouth, ideally 30-60 minutes before feeding for optimal absorption. Soy formula, iron supplements, and calcium all significantly reduce levothyroxine absorption and must be avoided at the time of administration."
      },
      {
        question: "A practical nurse is assessing a 2-week-old full-term infant who appears excessively sleepy, has poor feeding, and continues to have jaundice. The nurse notes a large posterior fontanelle and an umbilical hernia. Which condition do these findings most strongly suggest?",
        options: [
          "Neonatal sepsis",
          "Congenital hypothyroidism",
          "Pyloric stenosis",
          "Galactosemia"
        ],
        correct: 1,
        rationale: "The combination of prolonged jaundice beyond 14 days, excessive sleepiness, poor feeding, large posterior fontanelle, and umbilical hernia is the classic presentation of congenital hypothyroidism. Neonatal sepsis would present with temperature instability, respiratory distress, and feeding intolerance but typically not umbilical hernia and large fontanelle. Pyloric stenosis presents with projectile vomiting at 3-6 weeks."
      }
    ]
  }
};

let count = 0;
for (const [id, lesson] of Object.entries(lessons)) {
  if (inject(id, lesson)) count++;
}
console.log(`\nDone: ${count}/${Object.keys(lessons).length} lessons injected.`);
