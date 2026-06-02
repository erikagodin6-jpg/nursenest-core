import { getAssetUrl } from "@/lib/asset-url";
import type { LessonContent } from "./types";

const imgDecels = getAssetUrl("decels_1773517432559.png");

const stagesOfLabor: LessonContent = {
  title: "Stages of Labor",
  cellular: {
    title: "Labor Physiology",
    content: "Labor is the process by which the fetus, placenta, and membranes are expelled from the uterus. It involves coordinated uterine contractions that progressively dilate and efface the cervix. At the cellular level, oxytocin binds to receptors on myometrial smooth muscle cells, triggering calcium influx through voltage-gated channels. The increase in intracellular calcium activates calmodulin, which stimulates myosin light chain kinase (MLCK) to phosphorylate myosin. This allows myosin to interact with actin, producing the rhythmic contractions of labor. Prostaglandins (PGE2, PGF2-alpha) produced by fetal membranes and decidua soften and ripen the cervix by degrading collagen fibers. Gap junctions between myometrial cells increase near term, allowing synchronized contractions. Labor is divided into four stages: First stage (cervical dilation from 0-10 cm with three phases: latent, active, and transition), Second stage (complete dilation to delivery of the infant), Third stage (delivery of the placenta), and Fourth stage (the first 1-2 hours postpartum focusing on recovery and hemostasis)."
  },
  signs: {
    left: [
      "Latent phase: irregular contractions, cervix 0-6 cm, mild discomfort",
      "Active phase: regular contractions q3-5 min, cervix 6-8 cm, stronger pain",
      "Transition phase: contractions q2-3 min, cervix 8-10 cm, intense pressure",
      "Second stage: urge to push, perineal bulging, crowning",
      "Third stage: gush of blood, cord lengthening, uterine firmness"
    ],
    right: [
      "Prolonged latent phase: >20 hrs nullipara, >14 hrs multipara",
      "Arrest of active phase: no cervical change >4 hrs with adequate contractions",
      "Prolonged second stage: >3 hrs nullipara with epidural, >2 hrs without",
      "Retained placenta: third stage >30 minutes",
      "Postpartum hemorrhage in fourth stage: >500 mL vaginal, >1000 mL cesarean"
    ]
  },
  medications: [
    { name: "Oxytocin (Pitocin)", type: "Uterotonic", action: "Stimulates uterine contractions by binding myometrial oxytocin receptors", sideEffects: "Uterine hyperstimulation, water intoxication, fetal distress", contra: "Unfavorable fetal position, placenta previa, vasa previa, prior classical uterine incision", pearl: "Always titrate to achieve contractions q2-3 minutes lasting 60-90 seconds; have terbutaline available as tocolytic rescue" },
    { name: "Misoprostol (Cytotec)", type: "Prostaglandin E1", action: "Cervical ripening and uterine contraction stimulation", sideEffects: "Uterine hyperstimulation, nausea, diarrhea, fever", contra: "Prior cesarean or uterine surgery (risk of rupture)", pearl: "Cannot be reversed once administered; used for cervical ripening before oxytocin induction" }
  ],
  pearls: [
    "Friedman's curve: expect ~1.2 cm/hr dilation in active labor for nulliparas, ~1.5 cm/hr for multiparas",
    "Transition is the most intense but shortest phase: reassure the patient",
    "The '5-1-1 rule' for hospital presentation: contractions every 5 min, lasting 1 min, for 1 hour",
    "Bloody show (mucus plug passage) indicates cervical changes but does not mean imminent delivery",
    "Assess fetal heart tones with every contraction change and after rupture of membranes",
    "Document BUBBLE-HE in fourth stage: Breasts, Uterus, Bladder, Bowel, Lochia, Episiotomy, Homan's sign, Emotional status"
  ],
  quiz: [
    { question: "During which phase of labor does the cervix dilate from 6 to 10 cm?", options: ["Latent phase", "Active phase and transition", "Second stage", "Third stage"], correct: 1, rationale: "The active phase begins at 6 cm and continues through transition (8-10 cm) until complete dilation at 10 cm." },
    { question: "A nulliparous patient has been in active labor for 5 hours with no cervical change despite adequate contractions. What is this called?", options: ["Prolonged latent phase", "Arrest of active phase", "Failed induction", "Precipitous labor"], correct: 1, rationale: "Arrest of active phase is defined as no cervical change for 4+ hours with adequate contractions (or 6+ hours with inadequate contractions)." }
  ]
};

const fetalHeartRateMonitoring: LessonContent = {
  title: "Electronic Fetal Heart Rate Monitoring",
  image: imgDecels,
  cellular: {
    title: "Fetal Heart Rate Physiology",
    content: "Electronic fetal monitoring (EFM) assesses fetal well-being during labor by evaluating the fetal heart rate (FHR) pattern in relation to uterine contractions. The fetal heart rate is regulated by the autonomic nervous system: the sympathetic nervous system accelerates the heart rate while the parasympathetic (vagal) system decelerates it. Normal baseline FHR is 110-160 bpm. Variability reflects the interplay between sympathetic and parasympathetic inputs and is the most important indicator of fetal oxygenation. Moderate variability (6-25 bpm fluctuations) indicates an intact fetal autonomic nervous system with adequate cerebral oxygenation. Absent or minimal variability may indicate fetal acidemia, sleep cycle, or medication effects. Accelerations (transient increases ≥15 bpm for ≥15 seconds) are reassuring and indicate fetal well-being. Decelerations are classified by their timing relative to contractions: early (head compression, mirror contractions), late (uteroplacental insufficiency, begin after contraction peak), and variable (cord compression, abrupt onset and offset). Category I tracings are normal, Category II are indeterminate, and Category III are abnormal requiring immediate intervention."
  },
  signs: {
    left: [
      "Normal baseline: 110-160 bpm",
      "Moderate variability: 6-25 bpm fluctuation (reassuring)",
      "Accelerations: ≥15 bpm above baseline for ≥15 sec (reassuring)",
      "Early decelerations: mirror contractions, caused by head compression (benign)",
      "Category I tracing: normal baseline, moderate variability, no late/variable decels"
    ],
    right: [
      "Fetal tachycardia: >160 bpm (infection, maternal fever, medications)",
      "Fetal bradycardia: <110 bpm (cord prolapse, uterine rupture, prolonged)",
      "Late decelerations: begin after contraction peak (uteroplacental insufficiency)",
      "Variable decelerations: abrupt drops (cord compression)",
      "Absent variability with recurrent late decels: Category III — emergent delivery"
    ]
  },
  medications: [
    { name: "Terbutaline", type: "Beta-2 agonist tocolytic", action: "Relaxes uterine smooth muscle to resolve hyperstimulation and improve fetal perfusion", sideEffects: "Maternal tachycardia, tremor, hyperglycemia, hypokalemia", contra: "Maternal cardiac disease, uncontrolled hyperthyroidism", pearl: "Given as rescue tocolytic for Category III tracings caused by uterine hyperstimulation; 0.25 mg SQ" },
    { name: "Amnioinfusion (Normal Saline)", type: "Intrauterine fluid replacement", action: "Relieves cord compression by restoring amniotic fluid volume during variable decelerations", sideEffects: "Uterine overdistension, infection risk", contra: "Active vaginal bleeding, placenta previa", pearl: "Indicated for recurrent variable decelerations; NS infused through intrauterine pressure catheter" }
  ],
  pearls: [
    "VEAL CHOP mnemonic: Variable-Cord, Early-Head, Accelerations-OK, Late-Placental insufficiency",
    "Moderate variability is THE most reassuring sign of fetal well-being",
    "Absent variability + recurrent late decelerations = Category III = emergent intervention",
    "Intrauterine resuscitation: left lateral position, IV fluid bolus, O2, stop oxytocin, notify provider",
    "Early decelerations are benign and do not require intervention",
    "Variable decelerations: change maternal position, amnioinfusion if recurrent",
    "Always document the category classification and report Category II and III findings immediately"
  ],
  quiz: [
    { question: "Which fetal heart rate finding is the MOST reassuring indicator of fetal well-being?", options: ["Baseline of 140 bpm", "Moderate variability", "Presence of early decelerations", "Absence of accelerations"], correct: 1, rationale: "Moderate variability (6-25 bpm) is the single most important indicator of adequate fetal oxygenation and an intact autonomic nervous system." },
    { question: "A nurse observes a fetal heart rate pattern with abrupt decelerations that vary in timing, duration, and depth. What is the most likely cause?", options: ["Head compression", "Uteroplacental insufficiency", "Umbilical cord compression", "Maternal hypotension"], correct: 2, rationale: "Variable decelerations are caused by umbilical cord compression. They are characterized by abrupt onset, variable timing relative to contractions, and variable depth and duration." }
  ]
};

const preeclampsia: LessonContent = {
  title: "Preeclampsia and Eclampsia",
  cellular: {
    title: "Preeclampsia Pathophysiology",
    content: "Preeclampsia is a multisystem hypertensive disorder of pregnancy characterized by new-onset hypertension (≥140/90 mmHg) and proteinuria (or other end-organ damage) after 20 weeks gestation. The underlying pathology begins with abnormal placentation: the trophoblast fails to adequately remodel the spiral arteries of the uterus, resulting in reduced uteroplacental blood flow. This placental ischemia triggers the release of antiangiogenic factors (soluble fms-like tyrosine kinase-1, or sFlt-1) into the maternal circulation, which bind and neutralize vascular endothelial growth factor (VEGF) and placental growth factor (PlGF). The resulting endothelial dysfunction causes widespread vasospasm, increased vascular permeability, and activation of the coagulation cascade. Vasospasm reduces organ perfusion (brain, liver, kidneys, placenta). Increased capillary permeability causes edema, including cerebral edema (headaches, visual changes, seizures). Glomerular endotheliosis in the kidneys causes proteinuria. Hepatic involvement manifests as elevated liver enzymes and right upper quadrant pain. HELLP syndrome (Hemolysis, Elevated Liver enzymes, Low Platelets) represents a severe form. Eclampsia is the occurrence of seizures in a patient with preeclampsia."
  },
  signs: {
    left: [
      "Blood pressure ≥140/90 mmHg on two occasions 4 hours apart",
      "Proteinuria: ≥300 mg/24 hr or protein/creatinine ratio ≥0.3",
      "Headache that does not resolve with analgesics",
      "Visual disturbances: scotomata, blurred vision, photophobia",
      "Right upper quadrant or epigastric pain (hepatic involvement)"
    ],
    right: [
      "Severe features: BP ≥160/110, platelets <100,000, creatinine >1.1",
      "HELLP syndrome: Hemolysis, Elevated Liver enzymes, Low Platelets",
      "Eclampsia: tonic-clonic seizures — medical emergency",
      "Placental abruption from vasospasm",
      "Pulmonary edema, DIC, stroke, hepatic rupture"
    ]
  },
  medications: [
    { name: "Magnesium Sulfate", type: "Anticonvulsant/Tocolytic", action: "Prevents and treats eclamptic seizures by blocking neuromuscular transmission and cerebral vasodilation", sideEffects: "Flushing, hypotension, respiratory depression, loss of deep tendon reflexes", contra: "Myasthenia gravis, renal failure (accumulates)", pearl: "Therapeutic level 4-7 mEq/L; monitor DTRs (first sign of toxicity is loss of reflexes), respiratory rate ≥12, urine output ≥30 mL/hr; antidote is CALCIUM GLUCONATE" },
    { name: "Labetalol IV", type: "Alpha/Beta blocker", action: "Reduces blood pressure by blocking alpha and beta adrenergic receptors", sideEffects: "Bradycardia, bronchospasm, dizziness", contra: "Asthma, heart block, severe bradycardia", pearl: "First-line for acute severe hypertension in preeclampsia; give IV push 20 mg, then 40 mg, then 80 mg q10 min" },
    { name: "Hydralazine IV", type: "Direct vasodilator", action: "Directly relaxes arteriolar smooth muscle to reduce blood pressure", sideEffects: "Reflex tachycardia, headache, hypotension", contra: "Lupus, tachycardia, coronary artery disease", pearl: "Alternative to labetalol for acute hypertension; give 5-10 mg IV q20 min; preload with 500 mL NS to prevent precipitous hypotension" },
    { name: "Calcium Gluconate", type: "Magnesium antidote", action: "Antagonizes magnesium at the neuromuscular junction to reverse toxicity", sideEffects: "Bradycardia, hypotension (rapid IV push)", contra: "Digoxin therapy (risk of fatal arrhythmia)", pearl: "ALWAYS have at bedside during magnesium sulfate infusion; give 1 g IV over 3 minutes for mag toxicity" }
  ],
  pearls: [
    "The ONLY cure for preeclampsia is delivery of the placenta",
    "Magnesium sulfate: monitor DTRs, respiratory rate ≥12, urine output ≥30 mL/hr — antidote is calcium gluconate",
    "HELLP syndrome can occur WITHOUT significant hypertension — always assess for RUQ pain and labs",
    "Seizure precautions: dim lights, quiet environment, padded side rails, suction at bedside",
    "Preeclampsia can develop up to 6 weeks POSTPARTUM — educate all patients on warning signs",
    "Severe headache, visual changes, and RUQ pain in a pregnant/postpartum patient = emergency evaluation",
    "Do NOT give NSAIDs for headache in preeclampsia — can worsen renal function and platelet dysfunction"
  ],
  quiz: [
    { question: "A patient at 34 weeks gestation has a blood pressure of 168/112 mmHg, 3+ proteinuria, and a severe headache. What medication is the priority?", options: ["Oxytocin to induce labor", "Magnesium sulfate for seizure prophylaxis", "Nifedipine for blood pressure", "Dexamethasone for fetal lung maturity"], correct: 1, rationale: "Magnesium sulfate is the priority to prevent eclamptic seizures in severe preeclampsia. Antihypertensives and delivery planning follow, but seizure prevention is the immediate priority." },
    { question: "A patient receiving magnesium sulfate has absent deep tendon reflexes and a respiratory rate of 10. What is the nurse's first action?", options: ["Continue the infusion and monitor", "Stop the magnesium infusion and prepare calcium gluconate", "Increase the IV rate", "Administer naloxone"], correct: 1, rationale: "Absent DTRs and respiratory depression indicate magnesium toxicity. The nurse must stop the infusion immediately and prepare to administer the antidote, calcium gluconate." }
  ]
};

const gestationalDiabetes: LessonContent = {
  title: "Gestational Diabetes Mellitus",
  cellular: {
    title: "GDM Pathophysiology",
    content: "Gestational diabetes mellitus (GDM) is glucose intolerance first recognized during pregnancy, typically developing in the second or third trimester. During normal pregnancy, human placental lactogen (hPL), cortisol, progesterone, and estrogen create a state of progressive insulin resistance to ensure adequate glucose supply to the growing fetus. In GDM, the maternal pancreatic beta cells cannot compensate for this increased insulin demand. The resulting hyperglycemia crosses the placenta via facilitated diffusion (glucose transporter proteins GLUT1), exposing the fetus to elevated glucose levels. The fetal pancreas responds by producing excess insulin (fetal hyperinsulinemia), which acts as a growth hormone causing macrosomia (excessive fetal growth, >4000-4500g). Macrosomia increases the risk of shoulder dystocia, birth trauma, and cesarean delivery. Fetal hyperinsulinemia also causes neonatal hypoglycemia after birth when the maternal glucose supply is abruptly cut. Other fetal complications include polycythemia, hyperbilirubinemia, respiratory distress syndrome, and hypocalcemia."
  },
  signs: {
    left: [
      "Polyuria, polydipsia, polyphagia (classic diabetes symptoms)",
      "Excessive weight gain during pregnancy",
      "Fundal height greater than expected for gestational age (macrosomia)",
      "Recurrent vaginal candidiasis or urinary tract infections",
      "Family history of diabetes or previous GDM"
    ],
    right: [
      "Macrosomia: fetal weight >4000-4500g, shoulder dystocia risk",
      "Neonatal hypoglycemia within hours after birth",
      "Polyhydramnios (excessive amniotic fluid from fetal polyuria)",
      "Preeclampsia (increased risk with GDM)",
      "Neonatal polycythemia, hyperbilirubinemia, respiratory distress"
    ]
  },
  medications: [
    { name: "Insulin (various)", type: "Hormone", action: "Lowers blood glucose by facilitating cellular glucose uptake; does not cross the placenta", sideEffects: "Hypoglycemia, injection site reactions, weight gain", contra: "Hypoglycemia", pearl: "Insulin is the gold standard for GDM requiring pharmacotherapy; it does NOT cross the placenta, making it safe for the fetus" },
    { name: "Glyburide", type: "Sulfonylurea", action: "Stimulates pancreatic beta cell insulin secretion", sideEffects: "Hypoglycemia, nausea, weight gain", contra: "Severe renal or hepatic impairment", pearl: "Oral alternative to insulin in GDM; minimal placental transfer but higher neonatal hypoglycemia risk than insulin" },
    { name: "Metformin", type: "Biguanide", action: "Decreases hepatic glucose production and increases insulin sensitivity", sideEffects: "GI upset, diarrhea, nausea, vitamin B12 deficiency", contra: "Renal impairment (lactic acidosis risk)", pearl: "Crosses the placenta; used as alternative when insulin is refused; long-term fetal effects still being studied" }
  ],
  pearls: [
    "Screen all pregnant women for GDM at 24-28 weeks with glucose challenge test (50g GCT) or 75g OGTT",
    "Insulin does NOT cross the placenta; glucose DOES cross via facilitated diffusion",
    "Fetal macrosomia is the hallmark complication: assess fundal height, ultrasound for estimated fetal weight",
    "After delivery, the neonate loses the maternal glucose supply: monitor for hypoglycemia (feed within 1 hour)",
    "GDM usually resolves after delivery, but these women have 50% lifetime risk of developing Type 2 DM",
    "Blood glucose targets in GDM: fasting <95, 1-hr postprandial <140, 2-hr postprandial <120",
    "Dietary management is first-line: small frequent meals, complex carbohydrates, balanced protein and fats"
  ],
  quiz: [
    { question: "Why does neonatal hypoglycemia occur after delivery in infants of mothers with gestational diabetes?", options: ["The placenta produced too much insulin", "The neonate's hyperinsulinemia persists after the maternal glucose supply stops", "Maternal insulin crosses the placenta", "The neonate has Type 1 diabetes"], correct: 1, rationale: "During pregnancy, maternal hyperglycemia causes fetal hyperinsulinemia. After birth, the maternal glucose supply stops abruptly, but the neonate continues producing excess insulin, resulting in hypoglycemia." },
    { question: "At what gestational age is screening for gestational diabetes routinely performed?", options: ["8-12 weeks", "16-20 weeks", "24-28 weeks", "36-40 weeks"], correct: 2, rationale: "Universal screening for GDM is performed at 24-28 weeks when insulin resistance from placental hormones peaks. Women with high-risk factors may be screened earlier." }
  ]
};

const placentaPrevia: LessonContent = {
  title: "Placenta Previa",
  cellular: {
    title: "Placenta Previa Pathophysiology",
    content: "Placenta previa occurs when the placenta implants over or near the internal cervical os, partially or completely covering it. As the cervix dilates and effaces in late pregnancy or labor, the placenta separates from the decidua at the cervical os, disrupting the uteroplacental blood supply and causing hemorrhage. The placenta cannot stretch as the cervix dilates, so the separation exposes open maternal sinuses at the placental site. The bleeding is maternal in origin (not fetal), arising from the torn decidual vessels at the placental edge. Risk factors include prior cesarean section (scarring alters decidual vascularity), multiparity, multiple gestation, prior placenta previa, advanced maternal age, and smoking. Classification includes complete (totally covers the os), partial (partially covers), marginal (edge reaches the os margin), and low-lying (within 2 cm of the os but not covering it). The hallmark presentation is painless, bright red vaginal bleeding in the second or third trimester, often triggered by cervical changes."
  },
  signs: {
    left: [
      "Painless bright red vaginal bleeding (hallmark)",
      "Bleeding often occurs in third trimester without warning",
      "Soft, non-tender uterus (contrast with abruption)",
      "Bleeding may be triggered by intercourse or cervical exam",
      "Diagnosis confirmed by ultrasound showing placental position"
    ],
    right: [
      "Hemorrhagic shock from massive bleeding",
      "Preterm delivery if bleeding is uncontrolled",
      "Placenta accreta spectrum (especially with prior cesarean scar)",
      "Fetal malpresentation due to low-lying placenta",
      "Emergency cesarean section if complete previa"
    ]
  },
  medications: [
    { name: "Betamethasone", type: "Corticosteroid", action: "Accelerates fetal lung maturity by stimulating surfactant production", sideEffects: "Maternal hyperglycemia, immunosuppression", contra: "Active systemic infection", pearl: "Given when preterm delivery is anticipated (24-34 weeks); two doses IM 24 hours apart" },
    { name: "Rho(D) Immune Globulin (RhoGAM)", type: "Anti-D immunoglobulin", action: "Prevents Rh sensitization in Rh-negative mothers after fetal-maternal hemorrhage", sideEffects: "Injection site pain, mild fever", contra: "Rh-positive mother", pearl: "Administer to Rh-negative mothers after any bleeding episode to prevent isoimmunization" }
  ],
  pearls: [
    "NEVER perform a digital cervical exam on a patient with suspected placenta previa — can trigger massive hemorrhage",
    "Placenta previa = painless bleeding; Placental abruption = painful bleeding with rigid uterus",
    "Diagnosis is made by ultrasound, NOT manual examination",
    "Complete placenta previa = mandatory cesarean delivery",
    "Pelvic rest: no intercourse, no vaginal exams, no tampons",
    "Monitor for signs of hemorrhagic shock: tachycardia, hypotension, pallor",
    "Type and crossmatch should be on file for all patients with known previa",
    "Low-lying placenta in second trimester may resolve as the uterus grows (placental migration)"
  ],
  quiz: [
    { question: "A patient at 32 weeks presents with sudden painless bright red vaginal bleeding. What should the nurse avoid?", options: ["Applying external fetal monitor", "Performing a digital cervical examination", "Starting a large-bore IV", "Placing the patient on bed rest"], correct: 1, rationale: "Digital cervical examination in placenta previa can disrupt the placenta further and cause life-threatening hemorrhage. Diagnosis is confirmed by ultrasound." },
    { question: "What is the primary difference between placenta previa and placental abruption?", options: ["Previa causes painless bleeding; abruption causes painful bleeding with a rigid uterus", "Previa causes dark blood; abruption causes bright red blood", "Previa occurs in the first trimester only", "Abruption is always painless"], correct: 0, rationale: "Placenta previa classically presents with painless, bright red vaginal bleeding. Placental abruption presents with painful bleeding, a rigid board-like uterus, and may have concealed hemorrhage." }
  ]
};

const placentalAbruption: LessonContent = {
  title: "Placental Abruption (Abruptio Placentae)",
  cellular: {
    title: "Abruption Pathophysiology",
    content: "Placental abruption is the premature separation of a normally implanted placenta from the uterine wall before delivery. The separation disrupts maternal-fetal blood exchange, compromising fetal oxygenation and causing maternal hemorrhage. At the cellular level, the separation begins with rupture of maternal decidual arterioles, creating a retroplacental hematoma. As the hematoma expands, it further shears the placenta from the uterine wall, creating a vicious cycle. Blood may track between membranes and present as vaginal bleeding (revealed hemorrhage, 80% of cases), remain concealed behind the placenta (concealed hemorrhage, 20%), or be a combination. Concealed hemorrhage is particularly dangerous because the degree of shock may be disproportionate to visible bleeding. Risk factors include hypertension (the leading risk factor), trauma (motor vehicle accident, domestic violence), cocaine use, cigarette smoking, premature rupture of membranes, polyhydramnios with rapid decompression, and thrombophilia. Severe abruption can trigger disseminated intravascular coagulation (DIC) as thromboplastin released from the damaged placenta enters the maternal circulation."
  },
  signs: {
    left: [
      "Painful vaginal bleeding (dark red) — hallmark",
      "Rigid, board-like uterus (hypertonic, tender)",
      "Uterine tenderness on palpation",
      "High-frequency contractions or uterine tetany",
      "Fetal distress on monitoring (late decelerations, bradycardia)"
    ],
    right: [
      "Concealed hemorrhage: shock disproportionate to visible bleeding",
      "DIC: petechiae, prolonged bleeding, lab changes (low fibrinogen, elevated D-dimer)",
      "Fetal death if >50% of placenta separates",
      "Couvelaire uterus: blood infiltrates myometrium causing uterine atony",
      "Maternal hemorrhagic shock and multiorgan failure"
    ]
  },
  medications: [
    { name: "IV Crystalloid (Lactated Ringer's)", type: "Volume replacement", action: "Restores intravascular volume in hemorrhagic shock", sideEffects: "Fluid overload, dilutional coagulopathy", contra: "None in emergency resuscitation", pearl: "Two large-bore IVs (16-18 gauge); initial bolus 1-2L, then blood products as available" },
    { name: "Packed Red Blood Cells", type: "Blood product", action: "Replaces oxygen-carrying capacity lost to hemorrhage", sideEffects: "Transfusion reactions, hypothermia, citrate toxicity", contra: "Type and crossmatch when possible; O-negative in emergency", pearl: "Massive transfusion protocol: 1:1:1 ratio of PRBCs:FFP:Platelets in severe hemorrhage" }
  ],
  pearls: [
    "Abruption = painful, dark red bleeding + rigid uterus; Previa = painless, bright red bleeding + soft uterus",
    "Concealed hemorrhage is the most dangerous form: shock without visible bleeding",
    "Cocaine use causes vasospasm and sudden hypertension, leading to abruption",
    "ALWAYS ask about domestic violence when abruption is diagnosed — trauma is a leading cause",
    "Monitor fibrinogen levels: falling fibrinogen is an early sign of DIC",
    "Fetal monitoring is essential: late decelerations and bradycardia indicate fetal compromise",
    "Prepare for emergency cesarean if fetal distress or maternal hemorrhagic instability",
    "Two large-bore IVs, type and crossmatch, activate massive transfusion protocol for severe abruption"
  ],
  quiz: [
    { question: "A patient at 36 weeks presents with severe abdominal pain, dark vaginal bleeding, and a rigid uterus. The fetal heart rate shows late decelerations. What is the priority intervention?", options: ["Administer tocolytics", "Prepare for emergency cesarean section", "Perform a digital cervical exam", "Administer magnesium sulfate"], correct: 1, rationale: "This presentation is classic for severe placental abruption with fetal distress. Emergency cesarean section is indicated when there is significant fetal compromise or maternal instability." },
    { question: "Which substance use is most strongly associated with placental abruption?", options: ["Marijuana", "Cocaine", "Alcohol", "Opioids"], correct: 1, rationale: "Cocaine causes sudden vasospasm and acute hypertension, which can cause shearing of the placenta from the uterine wall. Cocaine use is a major risk factor for placental abruption." }
  ]
};

const shoulderDystocia: LessonContent = {
  title: "Shoulder Dystocia",
  cellular: {
    title: "Shoulder Dystocia Mechanics",
    content: "Shoulder dystocia is an obstetric emergency that occurs when the fetal head delivers but the anterior shoulder becomes impacted behind the maternal pubic symphysis. The fetus is unable to deliver with gentle downward traction and the usual maneuvers. At the mechanical level, the bisacromial diameter (the distance between the fetal shoulders) is too large to pass through the maternal pelvic outlet in the anteroposterior dimension. This traps the anterior shoulder behind the symphysis pubis. The compression of the umbilical cord between the fetal body and the birth canal reduces fetal blood flow and oxygenation. There is a critical window of approximately 5-7 minutes to deliver the body before permanent neurological injury from hypoxia occurs. Risk factors include macrosomia (>4000g), gestational diabetes, maternal obesity, previous shoulder dystocia, prolonged second stage, and operative vaginal delivery (forceps or vacuum). The McRoberts maneuver (hyperflexion of maternal hips) is the first-line intervention, followed by suprapubic pressure, delivery of the posterior arm, and Gaskin maneuver (all-fours position)."
  },
  signs: {
    left: [
      "Turtle sign: fetal head delivers then retracts against the perineum",
      "Fetal head delivered but shoulders do not follow with normal traction",
      "Fetal head remains tightly applied to the vulva",
      "No progress despite routine delivery maneuvers",
      "Time-critical emergency: clock starts when head delivers"
    ],
    right: [
      "Brachial plexus injury (Erb's palsy): damage to C5-C6 nerves",
      "Fractured clavicle or humerus during delivery maneuvers",
      "Fetal hypoxia and potential brain injury if prolonged (>5-7 minutes)",
      "Maternal complications: fourth-degree laceration, hemorrhage, uterine rupture",
      "Neonatal asphyxia if not resolved promptly"
    ]
  },
  medications: [],
  pearls: [
    "HELPERR mnemonic: call for Help, Evaluate for Episiotomy, Legs (McRoberts), Pressure (suprapubic), Enter (rotational maneuvers), Remove posterior arm, Roll to all fours",
    "McRoberts maneuver is FIRST: sharply flex maternal thighs to abdomen — flattens the sacrum and widens the pelvic outlet",
    "Apply SUPRAPUBIC pressure (NOT fundal pressure) — fundal pressure worsens impaction",
    "NEVER apply excessive downward traction on the fetal head — causes brachial plexus injury",
    "Document the time the head delivered, maneuvers used, and time of body delivery",
    "Shoulder dystocia cannot be reliably predicted — every L&D nurse must know the maneuvers",
    "After delivery, assess the neonate for Erb's palsy: arm hangs limply, internally rotated, 'waiter's tip' position",
    "Debrief the team and family after the event"
  ],
  quiz: [
    { question: "During delivery, the fetal head delivers but then retracts against the perineum (turtle sign). What is the first maneuver the nurse should assist with?", options: ["Apply fundal pressure", "McRoberts maneuver: hyperflexion of maternal hips", "Perform emergency cesarean section", "Apply traction to the fetal head"], correct: 1, rationale: "McRoberts maneuver (hyperflexion of the maternal thighs against the abdomen) is the first-line intervention for shoulder dystocia. It flattens the sacrum and rotates the pubic symphysis, increasing the pelvic outlet diameter." },
    { question: "What type of pressure should be applied during shoulder dystocia?", options: ["Fundal pressure", "Suprapubic pressure", "Cricoid pressure", "Lower back pressure"], correct: 1, rationale: "Suprapubic pressure is applied to push the anterior shoulder down and under the pubic symphysis. Fundal pressure is NEVER applied as it worsens the impaction and can cause uterine rupture." }
  ]
};

const cordProlapse: LessonContent = {
  title: "Umbilical Cord Prolapse",
  cellular: {
    title: "Cord Prolapse Emergency",
    content: "Umbilical cord prolapse occurs when the umbilical cord descends through the cervix ahead of or alongside the presenting part after rupture of membranes. The presenting part then compresses the cord against the bony pelvis, occluding fetal blood flow. The umbilical cord carries oxygenated blood from the placenta to the fetus via one vein and returns deoxygenated blood via two arteries. Compression or occlusion of these vessels causes acute fetal hypoxia, bradycardia, and potentially fetal death within minutes if not relieved. Overt prolapse is when the cord is visible or palpable in the vagina. Occult prolapse is when the cord is compressed alongside the presenting part but not visible. Risk factors include unengaged presenting part, polyhydramnios (excessive amniotic fluid), premature rupture of membranes, preterm fetus, malpresentation (transverse lie, breech, footling), and artificial rupture of membranes (amniotomy). The critical intervention is immediate manual elevation of the presenting part off the cord while preparing for emergent cesarean delivery."
  },
  signs: {
    left: [
      "Cord visible at the introitus or palpable in the vagina",
      "Sudden severe fetal bradycardia after rupture of membranes",
      "Variable or prolonged decelerations on fetal monitor",
      "Occult prolapse: non-reassuring fetal heart rate without visible cord",
      "Risk increases with amniotomy if presenting part is not engaged"
    ],
    right: [
      "Fetal death if cord compression is not relieved within minutes",
      "Fetal hypoxic-ischemic encephalopathy from prolonged hypoxia",
      "Neonatal complications from emergency preterm delivery",
      "Cord vasospasm from exposure to air and temperature changes",
      "Maternal surgical complications from emergency cesarean"
    ]
  },
  medications: [
    { name: "Terbutaline", type: "Tocolytic (beta-2 agonist)", action: "Reduces uterine contractions to decrease cord compression during transport to OR", sideEffects: "Maternal tachycardia, tremor, hyperglycemia", contra: "Maternal cardiac disease", pearl: "Given 0.25 mg SQ to relax the uterus while preparing for emergency cesarean" }
  ],
  pearls: [
    "Cord prolapse is a TRUE obstetric emergency: prepare for emergency cesarean immediately",
    "Nurse inserts gloved hand into vagina and lifts the presenting part OFF the cord — do NOT remove hand until delivery",
    "Place patient in Trendelenburg or knee-chest position to use gravity to reduce cord compression",
    "Keep the cord warm and moist with saline-soaked gauze if exposed — cold causes vasospasm",
    "Do NOT attempt to push the cord back into the uterus",
    "After amniotomy, ALWAYS immediately assess fetal heart rate",
    "Continuous fetal monitoring after rupture of membranes, especially if presenting part is not engaged",
    "Call for STAT cesarean while maintaining manual elevation of presenting part"
  ],
  quiz: [
    { question: "After spontaneous rupture of membranes, the nurse palpates the umbilical cord in the vagina. What is the FIRST action?", options: ["Push the cord back into the uterus", "Call for a cesarean section", "Insert a gloved hand and lift the presenting part off the cord", "Begin oxytocin to speed delivery"], correct: 2, rationale: "The immediate priority is to relieve cord compression by manually elevating the presenting part off the cord. This must be maintained continuously while preparing for emergency cesarean section." },
    { question: "Which position best reduces cord compression while awaiting emergency delivery?", options: ["Supine with legs elevated", "Trendelenburg or knee-chest position", "Sitting upright", "Left lateral with head elevated"], correct: 1, rationale: "Trendelenburg (head-down) or knee-chest position uses gravity to shift the presenting part away from the compressed cord, improving fetal perfusion." }
  ]
};

const inductionAugmentation: LessonContent = {
  title: "Induction and Augmentation of Labor",
  cellular: {
    title: "Labor Induction Physiology",
    content: "Labor induction is the artificial initiation of uterine contractions before spontaneous labor onset. Augmentation is the stimulation of contractions that have already begun but are inadequate. Both processes aim to produce effective uterine contractions (adequate frequency, duration, and intensity) to achieve progressive cervical dilation and fetal descent. The Bishop score assesses cervical readiness for induction: it evaluates cervical dilation, effacement, station, consistency, and position. A Bishop score ≥8 is considered favorable and predicts successful induction. When the Bishop score is low (<6), cervical ripening is performed first using mechanical methods (Foley balloon catheter, laminaria) or pharmacological agents (misoprostol, dinoprostone). Oxytocin is then used to initiate or augment contractions. Indications for induction include post-term pregnancy (≥41-42 weeks), preeclampsia, gestational diabetes with poor control, premature rupture of membranes without labor, oligohydramnios, intrauterine growth restriction, and chorioamnionitis. Contraindications include complete placenta previa, vasa previa, transverse fetal lie, active genital herpes, and prior classical (vertical) uterine incision."
  },
  signs: {
    left: [
      "Bishop score assessment: dilation, effacement, station, consistency, position",
      "Bishop score ≥8: favorable cervix, likely successful induction",
      "Progressive cervical change with regular contractions = effective induction",
      "Adequate contractions: q2-3 min, lasting 60-90 sec, moderate-strong intensity",
      "Montevideo units ≥200 indicate adequate labor (with IUPC)"
    ],
    right: [
      "Uterine tachysystole: >5 contractions in 10 minutes",
      "Uterine hyperstimulation: tachysystole + non-reassuring FHR",
      "Failed induction: no cervical change after adequate trial",
      "Uterine rupture: especially with prior cesarean scar",
      "Water intoxication from prolonged high-dose oxytocin"
    ]
  },
  medications: [
    { name: "Oxytocin (Pitocin)", type: "Uterotonic", action: "Stimulates uterine contractions by binding myometrial oxytocin receptors", sideEffects: "Uterine hyperstimulation, fetal distress, water intoxication", contra: "Placenta previa, vasa previa, prior classical cesarean, unfavorable fetal position", pearl: "Titrate by 1-2 mU/min every 15-30 minutes; goal is contractions q2-3 min; always use an infusion pump and piggyback to mainline so it can be stopped immediately" },
    { name: "Dinoprostone (Cervidil/Prepidil)", type: "Prostaglandin E2", action: "Softens and ripens the cervix by degrading collagen; can stimulate mild contractions", sideEffects: "Uterine hyperstimulation, nausea, diarrhea, fever", contra: "Prior cesarean or uterine surgery, active asthma (relative)", pearl: "Cervidil insert can be REMOVED if hyperstimulation occurs (advantage over misoprostol)" },
    { name: "Misoprostol (Cytotec)", type: "Prostaglandin E1", action: "Cervical ripening and contraction stimulation", sideEffects: "Uterine hyperstimulation, nausea, diarrhea, fever", contra: "Prior cesarean section or uterine surgery (risk of rupture)", pearl: "CANNOT be removed once administered; wait 4 hours after last dose before starting oxytocin" }
  ],
  pearls: [
    "Bishop score determines cervical readiness: ≥8 = favorable, <6 = needs ripening first",
    "Oxytocin is always administered via infusion pump as a secondary (piggyback) line",
    "Cervidil can be removed (advantage over misoprostol) if hyperstimulation occurs",
    "Never use misoprostol in patients with prior cesarean — risk of uterine rupture",
    "Tachysystole (>5 contractions in 10 min): stop oxytocin, position left lateral, IV bolus, notify provider",
    "Continuous fetal monitoring is mandatory during oxytocin administration",
    "Document contraction pattern, FHR, oxytocin dose changes, and maternal vital signs q15-30 min",
    "Amniotomy (AROM) may augment labor but increases infection risk and cord prolapse risk"
  ],
  quiz: [
    { question: "A patient's Bishop score is 3. What does the nurse anticipate before oxytocin induction?", options: ["Immediate high-dose oxytocin", "Cervical ripening with prostaglandins or mechanical dilation", "Emergency cesarean section", "Expectant management only"], correct: 1, rationale: "A Bishop score of 3 is unfavorable. Cervical ripening (prostaglandins or Foley bulb) should be performed first to improve the cervix before starting oxytocin to increase the likelihood of successful induction." },
    { question: "A patient on oxytocin has 6 contractions in 10 minutes and the fetal heart rate shows late decelerations. What is the first nursing action?", options: ["Increase the oxytocin", "Stop the oxytocin infusion", "Prepare for cesarean immediately", "Administer misoprostol"], correct: 1, rationale: "This is uterine hyperstimulation (tachysystole + non-reassuring FHR). The first action is to stop the oxytocin. Then reposition the patient, administer IV fluid bolus, consider terbutaline, and notify the provider." }
  ]
};

const cesareanSection: LessonContent = {
  title: "Cesarean Section Care",
  cellular: {
    title: "Cesarean Birth Pathophysiology",
    content: "Cesarean section (C-section) is the delivery of the fetus through surgical incisions in the abdominal wall (laparotomy) and uterus (hysterotomy). It is the most common major abdominal surgery performed worldwide. The procedure involves either a low transverse uterine incision (most common, lower risk of rupture in future pregnancies) or a classical vertical incision (used in emergencies, preterm deliveries, or certain placental abnormalities). Indications include failure to progress in labor, non-reassuring fetal status, malpresentation (breech, transverse), placenta previa, prior classical uterine incision, active herpes simplex virus, and umbilical cord prolapse. Anesthesia options include regional (spinal or epidural, preferred) or general anesthesia (for emergencies). Surgical risks include hemorrhage, infection (endometritis, wound infection), thromboembolic events, bladder or bowel injury, and anesthesia complications. Future pregnancy risks include uterine rupture, placenta accreta spectrum, and repeat cesarean. The newborn may experience transient tachypnea (lack of thoracic squeeze) and delayed skin-to-skin bonding."
  },
  signs: {
    left: [
      "Preoperative: consent, NPO status, lab results (CBC, type and screen)",
      "Intraoperative: regional anesthesia, Foley catheter, safety checks",
      "Postoperative: fundal assessment, lochia monitoring, incision assessment",
      "Pain management: scheduled analgesics, progression from IV to oral",
      "Early ambulation within 6-8 hours to prevent complications"
    ],
    right: [
      "Hemorrhage: monitor fundus, lochia, vital signs, H&H postoperatively",
      "Endometritis: fever, uterine tenderness, foul lochia within 48 hours",
      "Wound infection or dehiscence: redness, drainage, separation",
      "VTE: increased risk due to surgery + pregnancy + immobility",
      "Ileus: absent bowel sounds, abdominal distension, nausea/vomiting"
    ]
  },
  medications: [
    { name: "Cefazolin (Ancef)", type: "First-generation cephalosporin", action: "Prophylactic antibiotic to prevent surgical site infection", sideEffects: "Allergic reaction, GI upset", contra: "Severe cephalosporin allergy", pearl: "Given IV within 60 minutes before skin incision; reduces endometritis and wound infection by 60-70%" },
    { name: "Ketorolac (Toradol)", type: "NSAID", action: "Provides post-cesarean analgesia by inhibiting prostaglandin synthesis", sideEffects: "GI bleeding, platelet dysfunction, renal impairment", contra: "Renal impairment, active bleeding, aspirin-sensitive asthma", pearl: "Excellent for post-cesarean multimodal pain management; reduces opioid requirements significantly" },
    { name: "Enoxaparin (Lovenox)", type: "Low molecular weight heparin", action: "Prophylactic anticoagulation to prevent venous thromboembolism", sideEffects: "Bleeding, injection site bruising, HIT (rare)", contra: "Active hemorrhage, severe thrombocytopenia", pearl: "Started 6-12 hours post-cesarean for high-risk patients; safe during breastfeeding" }
  ],
  pearls: [
    "Surgical safety checklist: correct patient, procedure, site; consent; allergies; blood available",
    "Prophylactic antibiotics BEFORE skin incision reduce infection rates by 60-70%",
    "Assess fundus and lochia q15 min x1 hr, then q30 min x2 hr, then q1 hr postoperatively",
    "Post-cesarean patients can eat when hungry and ambulate within 6-8 hours (ERAS protocols)",
    "Encourage breastfeeding and skin-to-skin as soon as possible, even in the OR",
    "VTE prophylaxis: SCDs intraoperatively, early ambulation, pharmacological prophylaxis for high-risk",
    "Transient tachypnea of the newborn (TTN) is more common after cesarean: monitor neonatal respirations",
    "Patient education: call provider for fever >100.4°F, increasing pain, wound redness/drainage, heavy bleeding"
  ],
  quiz: [
    { question: "When should prophylactic antibiotics be administered for cesarean section?", options: ["After delivery of the infant", "Within 60 minutes before skin incision", "In the recovery room after surgery", "Only if the patient develops fever"], correct: 1, rationale: "Current evidence-based guidelines recommend administering prophylactic antibiotics (typically cefazolin) within 60 minutes before skin incision to maximize tissue levels at the time of incision and reduce surgical site infection." },
    { question: "A postoperative cesarean patient develops fever of 101.5°F, uterine tenderness, and foul-smelling lochia on day 2. What is the likely complication?", options: ["Urinary tract infection", "Endometritis", "Pulmonary embolism", "Wound dehiscence"], correct: 1, rationale: "The triad of fever, uterine tenderness, and foul-smelling lochia after cesarean delivery is the classic presentation of endometritis (uterine infection), a common post-cesarean complication." }
  ]
};

const epiduralManagement: LessonContent = {
  title: "Epidural Anesthesia Management in Labor",
  cellular: {
    title: "Epidural Pharmacology",
    content: "Epidural anesthesia provides pain relief during labor by injecting local anesthetic (with or without opioid adjuncts) into the epidural space surrounding the spinal cord. The epidural space lies between the ligamentum flavum and the dura mater, containing fat, blood vessels, and nerve roots. Local anesthetics (bupivacaine, ropivacaine) work by blocking sodium channels in nerve fibers, preventing the generation and conduction of nerve impulses. Sensory nerve fibers (pain) are blocked first because they are smaller and unmyelinated, allowing pain relief while preserving some motor function (walking epidurals). The level of the block typically targets T10-L1 for first-stage labor pain (uterine contractions) and S2-S4 for second-stage pain (perineal stretching). The epidural catheter allows continuous infusion or patient-controlled dosing throughout labor. Complications include hypotension (sympathetic blockade causing vasodilation and decreased venous return), motor block (affecting mobility and pushing efforts), fever, pruritus (from opioid additives), post-dural puncture headache (accidental dural puncture), and rarely epidural hematoma or abscess."
  },
  signs: {
    left: [
      "Pain relief within 15-20 minutes of administration",
      "Decreased blood pressure from sympathetic blockade (expect)",
      "Decreased sensation in lower body (test with ice or pinprick)",
      "Warm, dry legs from vasodilation below the block level",
      "Motor block varies: some patients can ambulate (walking epidural)"
    ],
    right: [
      "Maternal hypotension: treat with IV bolus and left lateral positioning",
      "High spinal/total spinal: respiratory compromise, apnea if block rises too high",
      "Post-dural puncture headache: severe positional headache, may need blood patch",
      "Urinary retention: monitor bladder distension, may need catheterization",
      "Fever: epidural-associated maternal temperature elevation (not necessarily infection)"
    ]
  },
  medications: [
    { name: "Bupivacaine 0.0625-0.125%", type: "Amide local anesthetic", action: "Blocks sodium channels in nerve fibers, preventing pain signal transmission", sideEffects: "Hypotension, motor block, systemic toxicity if intravascular injection", contra: "Local infection at insertion site, coagulopathy, patient refusal", pearl: "Low concentration provides sensory block with minimal motor block: the 'walking epidural' concept" },
    { name: "Fentanyl (epidural)", type: "Synthetic opioid adjunct", action: "Enhances analgesia by binding to opioid receptors in the dorsal horn of the spinal cord", sideEffects: "Pruritus (most common), nausea, respiratory depression (rare at epidural doses)", contra: "Opioid allergy", pearl: "Added to epidural local anesthetic to provide superior pain relief at lower local anesthetic concentrations, reducing motor block" },
    { name: "Ephedrine", type: "Mixed sympathomimetic", action: "Treats epidural-induced hypotension by increasing heart rate and vasoconstriction", sideEffects: "Tachycardia, hypertension, anxiety", contra: "Severe hypertension, tachyarrhythmias", pearl: "First-line vasopressor for epidural hypotension; phenylephrine is an alternative" }
  ],
  pearls: [
    "Pre-hydrate with 500-1000 mL IV bolus before epidural placement to prevent hypotension",
    "After epidural placement: monitor BP every 5 min x 20 min, then every 15-30 min",
    "Left lateral or wedge positioning prevents aortocaval compression (supine hypotensive syndrome)",
    "Monitor bladder: loss of sensation may cause urinary retention and bladder distension",
    "Continuous fetal monitoring is required after epidural placement",
    "Post-dural puncture headache: worse when upright, relieved lying flat — epidural blood patch is definitive treatment",
    "Assess motor function and sensation level regularly: block should not rise above T4",
    "Epidural does NOT increase cesarean rate but may prolong the second stage of labor"
  ],
  quiz: [
    { question: "A laboring patient receives an epidural and her blood pressure drops from 120/80 to 85/50 mmHg. What is the priority intervention?", options: ["Elevate the head of bed", "Position left lateral and administer IV fluid bolus", "Remove the epidural catheter", "Administer oxytocin"], correct: 1, rationale: "Epidural-induced hypotension is treated by positioning the patient on her left side (preventing aortocaval compression), administering an IV fluid bolus, and if needed, vasopressors (ephedrine). The epidural catheter is not removed." },
    { question: "A post-epidural patient complains of a severe headache that worsens when sitting up and resolves when lying flat. What is the most likely cause?", options: ["Preeclampsia", "Post-dural puncture headache from accidental dural puncture", "Tension headache from labor stress", "Migraine"], correct: 1, rationale: "A positional headache (worse upright, better lying flat) after epidural is classic for post-dural puncture headache from accidental dural puncture. CSF leak causes low intracranial pressure when upright. Treatment includes hydration, caffeine, and if persistent, epidural blood patch." }
  ]
};

const fetalMalpresentation: LessonContent = {
  title: "Fetal Malpresentation",
  cellular: {
    title: "Fetal Lie and Presentation",
    content: "Fetal malpresentation refers to any fetal position other than vertex (cephalic with occiput anterior). Normal presentation is vertex with the occiput anterior (OA), where the fetal head is flexed and the smallest diameter of the skull presents to the birth canal. Malpresentations include breech (frank, complete, footling), face, brow, transverse lie, and occiput posterior. Breech presentation occurs in 3-4% of term pregnancies and is classified as frank breech (hips flexed, knees extended — most common), complete breech (hips and knees flexed — 'sitting'), or footling breech (one or both feet presenting — highest cord prolapse risk). Occiput posterior (OP or 'sunny side up') is the most common malposition and causes prolonged, painful back labor because the fetal occiput presses against the maternal sacrum. Transverse lie requires cesarean delivery as vaginal delivery is impossible. Risk factors for malpresentation include prematurity, polyhydramnios, uterine anomalies, placenta previa, multiparity, and multiple gestation."
  },
  signs: {
    left: [
      "Breech: fundal palpation reveals hard, round head at top (Leopold's maneuvers)",
      "OP (occiput posterior): intense lower back pain during contractions",
      "Transverse lie: fundus wider than expected, no presenting part in pelvis",
      "Face presentation: face palpated on vaginal exam instead of scalp",
      "Footling breech: foot or feet palpable at cervix"
    ],
    right: [
      "Cord prolapse: highest risk with footling breech and transverse lie",
      "Prolonged labor with OP: persistent back labor, slow descent",
      "Head entrapment in breech: body delivers but after-coming head trapped",
      "Birth trauma: brachial plexus injury, cervical spine injury with breech",
      "Increased cesarean delivery rates for most malpresentations"
    ]
  },
  medications: [
    { name: "Terbutaline", type: "Tocolytic", action: "Relaxes uterine smooth muscle to facilitate external cephalic version (ECV)", sideEffects: "Maternal tachycardia, tremor, hyperglycemia", contra: "Maternal cardiac disease, placental abruption", pearl: "Given before ECV attempt to relax the uterus and improve success rate of turning the fetus" }
  ],
  pearls: [
    "Leopold's maneuvers: systematic abdominal palpation to determine fetal lie, presentation, and position",
    "External cephalic version (ECV): attempt to turn breech to vertex at 37+ weeks under ultrasound guidance",
    "Footling breech has the HIGHEST risk of cord prolapse — cesarean delivery is standard",
    "OP position: encourage hands-and-knees position, pelvic rocking to rotate the fetus",
    "Always confirm fetal presentation with ultrasound before labor management decisions",
    "Breech delivery vaginally is rarely performed today — cesarean is standard of care in most settings",
    "Transverse lie at term = cesarean delivery (vaginal delivery is not possible)",
    "After ECV, monitor fetal heart rate for at least 30 minutes and administer RhoGAM if Rh-negative"
  ],
  quiz: [
    { question: "A nurse performing Leopold's maneuvers palpates a hard, round, ballottable mass in the uterine fundus. What does this suggest?", options: ["Vertex presentation (normal)", "Breech presentation (head is at the top)", "Transverse lie", "Polyhydramnios"], correct: 1, rationale: "A hard, round, ballottable mass at the fundus is the fetal head. In normal vertex presentation, the head should be in the pelvis. Finding the head at the fundus indicates breech presentation." },
    { question: "Which breech presentation carries the highest risk of umbilical cord prolapse?", options: ["Frank breech", "Complete breech", "Footling breech", "All carry equal risk"], correct: 2, rationale: "Footling breech has the highest cord prolapse risk because the small presenting foot does not fill the cervix adequately, leaving space for the cord to slip past." }
  ]
};

const postpartumHemorrhage: LessonContent = {
  title: "Postpartum Hemorrhage Management",
  cellular: {
    title: "PPH Pathophysiology and Management",
    content: "Postpartum hemorrhage (PPH) is defined as blood loss ≥500 mL after vaginal delivery or ≥1000 mL after cesarean delivery, or any blood loss that causes hemodynamic instability. PPH is classified as early (primary, within 24 hours of delivery) or late (secondary, 24 hours to 12 weeks postpartum). The 'Four Ts' framework identifies the causes: Tone (uterine atony, 70-80% of cases — the uterus fails to contract adequately), Tissue (retained placental fragments or membranes, 10%), Trauma (lacerations, hematomas, uterine rupture or inversion, 10%), and Thrombin (coagulation disorders including DIC, 1%). Uterine atony is the leading cause: the uterine muscle fibers are designed to compress the spiral arteries at the placental site through contraction. When the myometrium fails to contract, these vessels remain open, causing rapid blood loss. Risk factors include overdistended uterus (macrosomia, multiples, polyhydramnios), prolonged labor, rapid labor, chorioamnionitis, magnesium sulfate use, and grand multiparity."
  },
  signs: {
    left: [
      "Boggy, soft uterus on palpation (uterine atony — most common cause)",
      "Excessive or continuous vaginal bleeding (steady flow or gush)",
      "Large blood clots passed vaginally",
      "Perineal, vaginal, or cervical lacerations",
      "Uterus higher than expected or displaced (retained clots)"
    ],
    right: [
      "Tachycardia (may be late sign due to pregnancy blood volume expansion)",
      "Hypotension, pallor, diaphoresis, altered mental status",
      "DIC: oozing from IV sites, petechiae, prolonged clotting times",
      "Uterine inversion: severe pain, fundus not palpable, hemorrhage",
      "Hypovolemic shock with end-organ hypoperfusion"
    ]
  },
  medications: [
    { name: "Oxytocin (Pitocin)", type: "Uterotonic", action: "First-line: stimulates uterine contraction to compress placental site vessels", sideEffects: "Water intoxication (high doses), hypotension (IV bolus), nausea", contra: "None absolute in PPH emergency", pearl: "Begin immediately with fundal massage; 10-40 units in 1L NS infusion; never give undiluted IV push" },
    { name: "Methylergonovine (Methergine)", type: "Ergot alkaloid", action: "Produces sustained uterine contraction", sideEffects: "Severe hypertension, nausea, vomiting, peripheral vasoconstriction", contra: "HYPERTENSION: absolute contraindication", pearl: "0.2 mg IM; NEVER give to hypertensive patients — risk of stroke or seizure" },
    { name: "Carboprost (Hemabate)", type: "Prostaglandin F2-alpha", action: "Stimulates strong uterine contractions when other uterotonics fail", sideEffects: "Bronchospasm, diarrhea, fever, nausea", contra: "ASTHMA: absolute contraindication", pearl: "0.25 mg IM; NEVER give to patients with asthma — causes severe bronchospasm" },
    { name: "Misoprostol (Cytotec)", type: "Prostaglandin E1", action: "Stimulates uterine contraction; can be given rectally, sublingually, or buccally", sideEffects: "Fever, chills, diarrhea", contra: "Few absolute contraindications", pearl: "800-1000 mcg rectally; versatile route options useful when IV access is limited" },
    { name: "Tranexamic Acid (TXA)", type: "Antifibrinolytic", action: "Inhibits fibrinolysis to stabilize clots and reduce bleeding", sideEffects: "Nausea, diarrhea, thromboembolic events (rare)", contra: "Active thromboembolic disease", pearl: "1g IV within 3 hours of delivery reduces death from PPH; WHO-recommended for all PPH" }
  ],
  pearls: [
    "Four Ts of PPH: Tone (atony, most common), Tissue, Trauma, Thrombin",
    "First intervention for boggy uterus: bimanual uterine massage",
    "Methergine is CONTRAINDICATED in hypertension; Hemabate is CONTRAINDICATED in asthma",
    "Quantitative blood loss (QBL): weigh pads, drapes, and linens — more accurate than visual estimation",
    "Pregnancy masks early shock signs: tachycardia and hypotension appear LATE",
    "Two large-bore IVs (16-18 gauge), rapid crystalloid, type and crossmatch immediately",
    "Tranexamic acid (TXA) within 3 hours reduces mortality — part of updated PPH protocols",
    "Massive transfusion protocol: 1:1:1 ratio PRBCs:FFP:Platelets for severe hemorrhage"
  ],
  quiz: [
    { question: "Which medication for PPH is absolutely contraindicated in a patient with asthma?", options: ["Oxytocin", "Methylergonovine", "Carboprost (Hemabate)", "Misoprostol"], correct: 2, rationale: "Carboprost (Hemabate/prostaglandin F2-alpha) causes bronchospasm and is absolutely contraindicated in patients with asthma." },
    { question: "What is the recommended first nursing intervention for a postpartum patient with a boggy uterus?", options: ["Administer Methergine IM", "Perform bimanual uterine massage", "Prepare for surgical intervention", "Administer IV fluids only"], correct: 1, rationale: "Bimanual uterine massage is the immediate first intervention for uterine atony. This stimulates myometrial contraction to compress the open blood vessels at the placental site." }
  ]
};

const uterineRupture: LessonContent = {
  title: "Uterine Rupture",
  cellular: {
    title: "Uterine Rupture Pathophysiology",
    content: "Uterine rupture is a catastrophic obstetric emergency involving a full-thickness tear through the uterine wall, allowing communication between the uterine cavity and the peritoneal cavity. It most commonly occurs along a previous cesarean scar during labor (trial of labor after cesarean, TOLAC). The prior uterine incision creates a line of relative weakness in the myometrium. During strong contractions, the force exceeds the tensile strength of the scar tissue, causing it to separate. The classical (vertical) incision has a 4-9% rupture risk, while the low transverse incision has a 0.5-1% risk. Rupture results in massive maternal hemorrhage into the peritoneal cavity, extrusion of the fetus and/or placenta through the defect, loss of fetal perfusion, and potentially maternal and fetal death. Complete rupture involves all layers of the uterine wall. Dehiscence (incomplete rupture) involves separation of the scar without extending through the serosa and may be an incidental finding at repeat cesarean. Risk factors include prior classical cesarean, induction or augmentation with oxytocin or prostaglandins in a scarred uterus, multiple prior cesareans, short inter-pregnancy interval, uterine anomalies, and obstructed labor."
  },
  signs: {
    left: [
      "Sudden severe abdominal pain (often described as 'tearing' or 'ripping')",
      "Sudden cessation of contractions after intense pain",
      "Change in uterine contour: fetal parts palpable through abdomen",
      "Loss of fetal station: presenting part recedes",
      "Vaginal bleeding (may be minimal if hemorrhage is intraperitoneal)"
    ],
    right: [
      "Fetal bradycardia: sudden, prolonged, often the first sign on monitor",
      "Maternal hemorrhagic shock: tachycardia, hypotension, pallor",
      "Fetal death if delivery is delayed",
      "Maternal death from uncontrolled hemorrhage",
      "Emergency hysterectomy may be required to control bleeding"
    ]
  },
  medications: [
    { name: "IV Crystalloid and Blood Products", type: "Volume resuscitation", action: "Restores intravascular volume in hemorrhagic shock", sideEffects: "Fluid overload, dilutional coagulopathy", contra: "None in emergency", pearl: "Massive transfusion protocol: immediate type and crossmatch; O-negative blood if cross-match unavailable" }
  ],
  pearls: [
    "Classical (vertical) cesarean scar: 4-9% rupture risk — TOLAC is CONTRAINDICATED",
    "Low transverse scar: 0.5-1% rupture risk — TOLAC may be offered (VBAC candidate)",
    "Sudden prolonged fetal bradycardia during TOLAC = uterine rupture until proven otherwise",
    "Misoprostol is CONTRAINDICATED for induction in patients with prior cesarean scar",
    "Continuous fetal monitoring is mandatory during TOLAC",
    "TOLAC should only occur in facilities with immediate cesarean capability",
    "The classic triad: sudden pain, cessation of contractions, non-reassuring FHR",
    "Prepare for emergency laparotomy and possible hysterectomy"
  ],
  quiz: [
    { question: "A patient undergoing TOLAC suddenly develops severe abdominal pain, the contractions stop, and the fetal heart rate drops to 60 bpm. What should the nurse suspect?", options: ["Normal labor progression", "Uterine rupture", "Placental abruption only", "Epidural complication"], correct: 1, rationale: "The classic presentation of uterine rupture during TOLAC: sudden severe pain, cessation of contractions, and acute fetal bradycardia. This requires emergency cesarean delivery." },
    { question: "Which type of prior uterine incision is a contraindication for trial of labor after cesarean (TOLAC)?", options: ["Low transverse incision", "Low vertical incision", "Classical (high vertical) incision", "J-incision"], correct: 2, rationale: "Classical (high vertical) uterine incision has a 4-9% risk of rupture during labor and is an absolute contraindication for TOLAC. Only low transverse incisions are considered candidates for VBAC." }
  ]
};

const fetalAssessment: LessonContent = {
  title: "Antepartum Fetal Assessment",
  cellular: {
    title: "Fetal Surveillance Methods",
    content: "Antepartum fetal assessment evaluates fetal well-being before labor through various testing modalities. The non-stress test (NST) evaluates fetal heart rate (FHR) reactivity: a reactive NST shows ≥2 accelerations (≥15 bpm above baseline for ≥15 seconds) within a 20-minute window, indicating intact fetal autonomic nervous system and adequate oxygenation. The contraction stress test (CST) evaluates fetal response to uterine contractions: a negative CST (no late decelerations) is reassuring, while a positive CST (late decelerations with >50% of contractions) indicates uteroplacental insufficiency. The biophysical profile (BPP) assigns scores (0 or 2) for five parameters: fetal breathing movements, gross body movement, fetal tone, amniotic fluid volume, and NST reactivity. A score of 8-10 is normal, 6 is equivocal, and ≤4 is abnormal requiring delivery. Modified BPP combines NST with amniotic fluid index (AFI). Doppler velocimetry of the umbilical artery assesses placental vascular resistance: absent or reversed end-diastolic flow indicates severe placental dysfunction and high fetal mortality risk."
  },
  signs: {
    left: [
      "Reactive NST: ≥2 accelerations in 20 minutes (reassuring)",
      "Negative CST: no late decelerations with contractions (reassuring)",
      "Normal BPP: score 8-10/10",
      "Normal AFI: 5-25 cm (adequate amniotic fluid)",
      "Normal umbilical artery Doppler: positive end-diastolic flow"
    ],
    right: [
      "Non-reactive NST: insufficient accelerations (may need extended monitoring or further testing)",
      "Positive CST: late decelerations with >50% contractions (uteroplacental insufficiency)",
      "Low BPP: score ≤4 (consider delivery)",
      "Oligohydramnios: AFI <5 cm (reduced fetal urine production = placental insufficiency)",
      "Absent/reversed end-diastolic flow: severe compromise, high mortality risk"
    ]
  },
  medications: [],
  pearls: [
    "NST: reactive = reassuring (2 accels in 20 min); non-reactive = needs further evaluation (not necessarily bad)",
    "If NST is non-reactive, try vibroacoustic stimulation to wake a sleeping fetus before declaring non-reactive",
    "BPP scoring: each parameter gets 0 or 2 points (never 1); total score out of 10",
    "Amniotic fluid index is the most important component of the BPP for long-term fetal well-being",
    "CST: contractions needed — may use nipple stimulation or oxytocin challenge test",
    "Fetal kick counts: instruct patients to count 10 movements in 2 hours; report decreased movement immediately",
    "Absent end-diastolic flow on umbilical artery Doppler = consider immediate delivery",
    "High-risk pregnancies may require testing 1-2 times per week starting at 32 weeks"
  ],
  quiz: [
    { question: "A non-stress test shows only 1 acceleration in 40 minutes. What is the interpretation?", options: ["Reactive: reassuring", "Non-reactive: needs further evaluation", "Positive: fetal distress", "Equivocal: repeat tomorrow"], correct: 1, rationale: "A reactive NST requires at least 2 accelerations (≥15 bpm for ≥15 seconds) within a 20-minute window. One acceleration in 40 minutes is non-reactive, requiring further evaluation such as extended monitoring, vibroacoustic stimulation, or BPP." },
    { question: "A biophysical profile scores: fetal breathing 2, movement 2, tone 2, AFI 0, NST non-reactive 0. What is the score and significance?", options: ["6/10: equivocal, needs further testing", "8/10: normal", "4/10: abnormal, consider delivery", "10/10: reassuring"], correct: 0, rationale: "The BPP score is 6/10 (equivocal). The concerning findings are oligohydramnios (AFI 0) and non-reactive NST. Further evaluation and possible delivery should be considered based on gestational age and clinical context." }
  ]
};

const highRiskPregnancy: LessonContent = {
  title: "High-Risk Pregnancy Overview",
  cellular: {
    title: "Risk Factors and Complications",
    content: "A high-risk pregnancy is one in which the mother, fetus, or newborn has an increased chance of adverse outcomes compared to a normal pregnancy. Risk factors may be pre-existing (chronic hypertension, diabetes mellitus, autoimmune disorders, cardiac disease, renal disease, obesity, advanced maternal age >35, adolescent pregnancy) or pregnancy-related (preeclampsia, gestational diabetes, placenta previa, placental abruption, multiple gestation, preterm labor, premature rupture of membranes, intrauterine growth restriction). Substance use (tobacco, alcohol, opioids, cocaine, methamphetamine) significantly increases maternal and fetal risks. Advanced maternal age increases the risk of chromosomal abnormalities (Down syndrome), preeclampsia, gestational diabetes, and cesarean delivery. Multiple gestation increases risks of preterm birth, preeclampsia, gestational diabetes, twin-to-twin transfusion syndrome, and postpartum hemorrhage. Comprehensive prenatal care with increased surveillance, early intervention, and multidisciplinary collaboration improves outcomes for high-risk pregnancies."
  },
  signs: {
    left: [
      "Pre-existing conditions: diabetes, hypertension, cardiac disease, autoimmune disorders",
      "Pregnancy-related conditions: preeclampsia, GDM, IUGR, placental abnormalities",
      "Demographic risk factors: age >35, BMI >30, substance use, multiple gestation",
      "History: prior cesarean, prior preterm birth, recurrent pregnancy loss",
      "Infectious risks: HIV, hepatitis B/C, group B streptococcus, syphilis, Zika"
    ],
    right: [
      "Preterm birth: leading cause of neonatal morbidity and mortality",
      "Intrauterine growth restriction: fetal weight <10th percentile",
      "Stillbirth: fetal death after 20 weeks gestation",
      "Maternal mortality: hemorrhage, hypertensive disorders, infection, cardiomyopathy",
      "Neonatal complications: prematurity, hypoglycemia, hyperbilirubinemia, RDS"
    ]
  },
  medications: [
    { name: "Progesterone (17-alpha hydroxyprogesterone caproate)", type: "Progestational hormone", action: "Prevents recurrent preterm birth by maintaining uterine quiescence", sideEffects: "Injection site pain/swelling, nausea, headache", contra: "Active thromboembolic disease, breast cancer, liver disease", pearl: "Given weekly IM injections starting at 16-24 weeks in women with prior spontaneous preterm birth" },
    { name: "Low-dose Aspirin (81 mg)", type: "Antiplatelet", action: "Reduces risk of preeclampsia in high-risk women by inhibiting thromboxane A2", sideEffects: "GI irritation, bleeding risk", contra: "Aspirin allergy, active bleeding", pearl: "Recommended starting at 12-28 weeks (ideally before 16 weeks) for women at high risk for preeclampsia; reduces risk by 24%" }
  ],
  pearls: [
    "Identify high-risk factors at the FIRST prenatal visit and develop a surveillance plan",
    "Advanced maternal age (≥35): offer genetic counseling and screening (cell-free DNA, amniocentesis)",
    "Low-dose aspirin starting before 16 weeks reduces preeclampsia risk in high-risk women by 24%",
    "Women with prior preterm birth may benefit from progesterone supplementation and cervical length monitoring",
    "Substance use screening should be universal, non-judgmental, and connected to treatment resources",
    "Group B Streptococcus screening at 36-37 weeks; treat with intrapartum penicillin to prevent neonatal sepsis",
    "Rh-negative mothers: RhoGAM at 28 weeks and within 72 hours after delivery of Rh-positive infant",
    "Multidisciplinary team approach: OB, MFM, anesthesia, neonatology, social work, nutrition"
  ],
  quiz: [
    { question: "At what age is a pregnancy considered 'advanced maternal age' with increased risk for chromosomal abnormalities?", options: ["30 years", "35 years", "40 years", "28 years"], correct: 1, rationale: "Advanced maternal age is defined as ≥35 years at the time of delivery. This age threshold is associated with significantly increased risk of chromosomal abnormalities such as trisomy 21 (Down syndrome)." },
    { question: "When should low-dose aspirin be initiated in high-risk women for preeclampsia prevention?", options: ["At the first positive pregnancy test", "Between 12-16 weeks gestation (before 16 weeks ideal)", "At 28 weeks gestation", "During labor"], correct: 1, rationale: "ACOG recommends initiating low-dose aspirin (81 mg) between 12-28 weeks, ideally before 16 weeks, for women at high risk for preeclampsia. Starting early maximizes the preventive benefit." }
  ]
};

const amnioticFluidDisorders: LessonContent = {
  title: "Amniotic Fluid Disorders",
  cellular: {
    title: "Amniotic Fluid Dynamics",
    content: "Amniotic fluid serves multiple critical functions: cushioning the fetus, allowing fetal movement for musculoskeletal development, maintaining temperature stability, preventing cord compression, and facilitating fetal lung development. Amniotic fluid volume changes throughout pregnancy: it is primarily produced by the amnion in early pregnancy, then increasingly by fetal urination (the major source by the second trimester), and is regulated by fetal swallowing, lung fluid secretion, and transmembranous absorption. The amniotic fluid index (AFI) measures fluid volume: normal is 5-25 cm. Polyhydramnios (AFI >25 cm or deepest vertical pocket >8 cm) results from increased production or decreased removal: causes include fetal anomalies that impair swallowing (esophageal atresia, anencephaly), maternal diabetes (fetal polyuria from hyperglycemia), multiple gestation, and idiopathic. Oligohydramnios (AFI <5 cm or deepest pocket <2 cm) results from decreased production or increased loss: causes include fetal renal anomalies (renal agenesis, obstructive uropathy), uteroplacental insufficiency, premature rupture of membranes, and post-term pregnancy. Oligohydramnios increases risk of cord compression, pulmonary hypoplasia, and limb deformities (Potter sequence)."
  },
  signs: {
    left: [
      "Polyhydramnios: fundal height greater than expected, difficulty palpating fetal parts",
      "Polyhydramnios: maternal dyspnea from diaphragm elevation, lower extremity edema",
      "Oligohydramnios: fundal height less than expected, fetal parts easily palpated",
      "Oligohydramnios: variable decelerations on FHR monitoring (cord compression)",
      "AFI measurement by ultrasound: normal 5-25 cm"
    ],
    right: [
      "Polyhydramnios: preterm labor, premature rupture of membranes, cord prolapse, placental abruption",
      "Polyhydramnios: postpartum hemorrhage from uterine overdistension",
      "Oligohydramnios: cord compression, fetal distress during labor",
      "Oligohydramnios: pulmonary hypoplasia (inadequate lung development)",
      "Potter sequence: renal agenesis leading to severe oligohydramnios, lung and limb abnormalities"
    ]
  },
  medications: [
    { name: "Indomethacin", type: "NSAID/prostaglandin synthesis inhibitor", action: "Reduces fetal urine production and amniotic fluid volume in polyhydramnios", sideEffects: "Premature ductus arteriosus closure, oligohydramnios, neonatal renal impairment", contra: "Gestational age >32 weeks (risk of premature DA closure), renal dysfunction", pearl: "Used short-term to reduce amniotic fluid volume in symptomatic polyhydramnios before 32 weeks" }
  ],
  pearls: [
    "AFI normal range: 5-25 cm; <5 = oligohydramnios, >25 = polyhydramnios",
    "Oligohydramnios: assess for PROM (nitrazine test, ferning, pooling), renal anomalies, IUGR",
    "Polyhydramnios: evaluate for maternal diabetes, fetal anomalies (esophageal atresia, neural tube defects)",
    "Amnioreduction (therapeutic amniocentesis) may relieve symptoms in severe polyhydramnios",
    "Oligohydramnios in labor increases variable decelerations: amnioinfusion may help",
    "Post-term pregnancies commonly develop oligohydramnios as placental function declines",
    "Adequate amniotic fluid is essential for fetal lung development: oligohydramnios before 22 weeks = lethal pulmonary hypoplasia",
    "Always correlate AFI findings with gestational age and clinical context"
  ],
  quiz: [
    { question: "A pregnant patient with gestational diabetes has an amniotic fluid index of 28 cm. What condition is present?", options: ["Normal amniotic fluid", "Oligohydramnios", "Polyhydramnios", "Meconium-stained fluid"], correct: 2, rationale: "An AFI >25 cm indicates polyhydramnios. Gestational diabetes causes fetal hyperglycemia leading to osmotic diuresis and increased fetal urine production, which is the major source of amniotic fluid." },
    { question: "What fetal complication is most associated with severe, prolonged oligohydramnios?", options: ["Macrosomia", "Pulmonary hypoplasia", "Polyhydramnios", "Fetal tachycardia"], correct: 1, rationale: "Adequate amniotic fluid is essential for fetal lung development. Severe oligohydramnios, especially before 22 weeks, leads to pulmonary hypoplasia because the lungs cannot expand properly without adequate amniotic fluid." }
  ]
};

const pretermLabor: LessonContent = {
  title: "Preterm Labor and Tocolysis",
  cellular: {
    title: "Preterm Labor Pathophysiology",
    content: "Preterm labor is defined as regular uterine contractions causing cervical change between 20 and 36 weeks and 6 days of gestation. Preterm birth is the leading cause of neonatal morbidity and mortality worldwide. The pathophysiology is multifactorial and not fully understood. Proposed mechanisms include infection/inflammation (ascending bacterial infection triggers prostaglandin release and cytokine cascade, stimulating contractions and cervical ripening), decidual hemorrhage (placental abruption activates thrombin, which stimulates uterine contractions), uterine overdistension (multiple gestation, polyhydramnios stretch the myometrium, activating contraction pathways), and cervical insufficiency (structural weakness allows premature dilation without labor). At the molecular level, inflammatory cytokines (IL-1, IL-6, TNF-alpha) and prostaglandins (PGE2, PGF2-alpha) soften the cervix by degrading collagen and extracellular matrix, while simultaneously stimulating myometrial contractility. Risk factors include prior preterm birth (strongest predictor), multiple gestation, short cervical length, bacterial vaginosis, periodontal disease, smoking, substance use, uterine anomalies, and cervical procedures (LEEP, cone biopsy)."
  },
  signs: {
    left: [
      "Regular contractions (q10 min or more frequent) before 37 weeks",
      "Cervical change: dilation and/or effacement on examination",
      "Low back pain (constant or rhythmic), pelvic pressure",
      "Increased vaginal discharge or mucus plug passage",
      "Positive fetal fibronectin (fFN) test: elevated risk within 7-14 days"
    ],
    right: [
      "Preterm delivery: leading cause of neonatal mortality",
      "Respiratory distress syndrome from surfactant deficiency",
      "Intraventricular hemorrhage (IVH) in premature infants",
      "Necrotizing enterocolitis (NEC)",
      "Long-term developmental and neurological disabilities"
    ]
  },
  medications: [
    { name: "Magnesium Sulfate (tocolytic/neuroprotective)", type: "Tocolytic/Neuroprotective", action: "Neuroprotection for fetal brain when given before preterm delivery <32 weeks; also provides tocolysis", sideEffects: "Maternal flushing, nausea, respiratory depression, loss of DTRs", contra: "Myasthenia gravis, renal failure", pearl: "PRIMARY use in preterm labor is NEUROPROTECTION for the fetus <32 weeks: reduces risk of cerebral palsy by 30-40%; monitor DTRs, respirations, urine output" },
    { name: "Nifedipine", type: "Calcium channel blocker tocolytic", action: "Inhibits calcium influx into myometrial cells, reducing uterine contractions", sideEffects: "Maternal hypotension, headache, dizziness, flushing", contra: "Hypotension, cardiac disease, do not use with magnesium (additive hypotension)", pearl: "Preferred tocolytic in many settings: oral administration, fewer side effects than terbutaline; hold if SBP <90" },
    { name: "Betamethasone", type: "Corticosteroid", action: "Accelerates fetal lung maturity by stimulating surfactant production in type II pneumocytes", sideEffects: "Maternal hyperglycemia, immunosuppression, leukocytosis", contra: "Active systemic infection", pearl: "12 mg IM x 2 doses, 24 hours apart; given between 24-34 weeks; optimal benefit 48 hours after first dose through 7 days" },
    { name: "Indomethacin", type: "NSAID tocolytic", action: "Inhibits prostaglandin synthesis, reducing uterine contractility", sideEffects: "Premature ductus arteriosus closure, oligohydramnios, neonatal renal impairment", contra: "Gestational age >32 weeks (risk of premature ductal closure), renal dysfunction, bleeding disorders", pearl: "Most effective tocolytic but limited to <32 weeks due to fetal side effects; used as short-term bridge for steroid benefit" }
  ],
  pearls: [
    "Tocolytics buy TIME for steroids (48 hours) and magnesium neuroprotection — they do NOT prevent preterm birth",
    "Betamethasone (antenatal steroids) reduces RDS, IVH, and neonatal death by 50% when given 48 hrs before delivery",
    "Magnesium sulfate for neuroprotection <32 weeks reduces cerebral palsy risk by 30-40%",
    "Fetal fibronectin (fFN): negative result is highly reassuring (99% NPV for delivery within 7 days)",
    "Short cervical length (<25 mm) on transvaginal ultrasound increases preterm birth risk",
    "GBS screening and prophylaxis: treat with penicillin intrapartum if preterm and GBS status unknown",
    "Prior preterm birth is the strongest predictor of recurrent preterm birth",
    "After tocolysis: bed rest is NOT recommended; activity modification and hydration are reasonable"
  ],
  quiz: [
    { question: "What is the PRIMARY purpose of tocolytic therapy in preterm labor?", options: ["Prevent preterm birth entirely", "Delay delivery 48 hours for steroid benefit", "Treat the underlying cause of preterm labor", "Reduce neonatal infections"], correct: 1, rationale: "Tocolytics do not prevent preterm birth. Their primary purpose is to delay delivery for 48 hours to allow antenatal corticosteroids to achieve maximum benefit for fetal lung maturity." },
    { question: "At what gestational age is magnesium sulfate given for fetal neuroprotection?", options: ["<28 weeks only", "<32 weeks", "<36 weeks", "Any gestational age"], correct: 1, rationale: "Magnesium sulfate for fetal neuroprotection is given when preterm delivery is anticipated before 32 weeks of gestation. It reduces the risk of cerebral palsy in surviving premature infants by 30-40%." }
  ]
};

const prematureRuptureOfMembranes: LessonContent = {
  title: "Premature Rupture of Membranes (PROM/PPROM)",
  cellular: {
    title: "PROM Pathophysiology",
    content: "Premature rupture of membranes (PROM) is the rupture of the amniotic membranes before the onset of labor. When this occurs before 37 weeks, it is termed preterm premature rupture of membranes (PPROM). PROM at term accounts for approximately 8-10% of pregnancies and is usually followed by spontaneous labor onset within 24 hours. PPROM complicates 2-3% of pregnancies and is a leading cause of preterm birth. The amniotic membranes (amnion and chorion) are composed of extracellular matrix proteins including collagen and fibronectin. Membrane rupture occurs when mechanical forces (contractions, polyhydramnios) or biochemical degradation (matrix metalloproteinases, bacterial enzymes) weaken the membranes. Infection (ascending vaginal bacteria) is both a cause and complication of PROM. Chorioamnionitis (intra-amniotic infection) develops when bacteria ascend through the ruptured membranes, causing maternal fever, uterine tenderness, fetal tachycardia, and purulent amniotic fluid. Diagnosis relies on patient history (gush or constant leaking of fluid), nitrazine testing (amniotic fluid is alkaline, turning paper blue), ferning pattern on microscopy, and pooling of fluid in the posterior vaginal fornix. ROM may also be confirmed by amnio dye test or bedside AmniSure test."
  },
  signs: {
    left: [
      "Gush or constant leaking of clear fluid from the vagina",
      "Nitrazine test positive: paper turns blue (pH >6.5, amniotic fluid is alkaline)",
      "Fern test positive: crystalline ferning pattern on dried slide under microscopy",
      "Pooling of fluid in the posterior vaginal fornix on speculum exam",
      "AmniSure test positive (placental alpha microglobulin-1 protein)"
    ],
    right: [
      "Chorioamnionitis: maternal fever >100.4°F, uterine tenderness, fetal tachycardia",
      "Umbilical cord prolapse (risk increases with ruptured membranes)",
      "Preterm delivery (leading complication of PPROM)",
      "Placental abruption (10-15% of PPROM cases)",
      "Fetal complications: RDS, IVH, NEC, sepsis from prematurity"
    ]
  },
  medications: [
    { name: "Ampicillin + Erythromycin (Latency Antibiotics)", type: "Antibiotic regimen", action: "Prolongs latency period in PPROM by treating subclinical infection and preventing chorioamnionitis", sideEffects: "GI upset, allergic reaction, candidiasis", contra: "Known allergy to components", pearl: "IV ampicillin + erythromycin x 48 hrs, then oral amoxicillin + erythromycin x 5 days; prolongs pregnancy and reduces neonatal infection" },
    { name: "Betamethasone", type: "Corticosteroid", action: "Accelerates fetal lung maturity", sideEffects: "Maternal hyperglycemia, immunosuppression", contra: "Chorioamnionitis (relative — still given in many protocols)", pearl: "Given with PPROM between 24-34 weeks to accelerate fetal lung maturity before anticipated preterm delivery" },
    { name: "GBS Prophylaxis (Penicillin G)", type: "Antibiotic", action: "Prevents vertical transmission of Group B Streptococcus to the neonate during delivery", sideEffects: "Allergic reaction, GI upset", contra: "Penicillin allergy (use clindamycin or vancomycin)", pearl: "Administer during labor if GBS-positive or unknown status with PROM/PPROM; goal is ≥4 hours before delivery" }
  ],
  pearls: [
    "Diagnosis: pooling + nitrazine + ferning = confirmed ROM (any 2 of 3 is sufficient)",
    "False-positive nitrazine: blood, semen, vaginal infections can cause alkaline pH",
    "PROM at term (≥37 weeks): induce labor within 12-24 hours to reduce infection risk",
    "PPROM (<37 weeks): expectant management with antibiotics, steroids, monitoring until 34 weeks (then deliver)",
    "NO digital cervical exams with PPROM until active labor — increases infection risk",
    "Monitor for chorioamnionitis: maternal temp q4h, continuous fetal monitoring, daily CBC with differential",
    "Signs of chorioamnionitis require IMMEDIATE delivery regardless of gestational age",
    "Assess for cord prolapse after ROM: check FHR immediately"
  ],
  quiz: [
    { question: "A patient at 30 weeks presents with continuous clear fluid leaking vaginally. The nitrazine test is positive (blue). What additional test confirms the diagnosis?", options: ["Urine culture", "Ferning pattern on microscopy", "Blood glucose test", "Pap smear"], correct: 1, rationale: "The ferning test (crystalline ferning pattern of dried amniotic fluid under microscopy) is a confirmatory test for rupture of membranes, along with nitrazine testing and fluid pooling." },
    { question: "What is the primary management strategy for PPROM at 28 weeks without signs of infection or fetal distress?", options: ["Immediate cesarean section", "Expectant management with antibiotics and steroids", "Immediate vaginal induction", "Discharge home with pelvic rest"], correct: 1, rationale: "PPROM at 28 weeks without infection or fetal distress is managed expectantly: latency antibiotics to prolong pregnancy, betamethasone for fetal lung maturity, and close monitoring for infection and fetal well-being until 34 weeks or complications develop." }
  ]
};

const groupBStreptococcus: LessonContent = {
  title: "Group B Streptococcus (GBS) in Pregnancy",
  cellular: {
    title: "GBS Colonization and Neonatal Disease",
    content: "Group B Streptococcus (Streptococcus agalactiae) is a gram-positive bacterium that colonizes the vaginal and rectal flora in approximately 10-30% of pregnant women. While maternal colonization is usually asymptomatic, vertical transmission to the neonate during vaginal delivery can cause severe early-onset neonatal sepsis, pneumonia, and meningitis. GBS is the leading cause of neonatal bacterial infection. The bacterium possesses a polysaccharide capsule that resists phagocytosis and complement-mediated killing, allowing it to evade the neonatal immune system. Early-onset GBS disease (within the first 7 days of life, most within 24 hours) results from ascending infection after membrane rupture or exposure during passage through the birth canal. Late-onset GBS disease (7-90 days) may result from horizontal transmission in the community. Universal screening by rectovaginal culture at 36-37 weeks gestation identifies colonized women who then receive intrapartum antibiotic prophylaxis (IAP) to prevent vertical transmission. IAP has reduced early-onset GBS disease by 80-85%."
  },
  signs: {
    left: [
      "Maternal GBS colonization: usually asymptomatic",
      "Positive rectovaginal culture at 36-37 weeks screening",
      "GBS bacteriuria during pregnancy (indicates heavy colonization)",
      "Prior infant with GBS disease (no screening needed — automatic prophylaxis)",
      "Unknown GBS status at labor: treat if risk factors present"
    ],
    right: [
      "Early-onset neonatal GBS sepsis: respiratory distress, temperature instability, lethargy within 24 hours",
      "Neonatal GBS pneumonia: tachypnea, grunting, cyanosis",
      "Neonatal GBS meningitis: irritability, bulging fontanelle, seizures",
      "GBS-related chorioamnionitis in the mother",
      "Maternal GBS urinary tract infection or pyelonephritis"
    ]
  },
  medications: [
    { name: "Penicillin G", type: "Narrow-spectrum antibiotic", action: "First-line intrapartum prophylaxis: inhibits GBS cell wall synthesis", sideEffects: "Allergic reaction (rare anaphylaxis)", contra: "Penicillin allergy", pearl: "5 million units IV loading dose, then 2.5-3 million units IV q4h until delivery; goal is ≥4 hours before delivery for optimal protection" },
    { name: "Ampicillin", type: "Aminopenicillin", action: "Alternative first-line for GBS prophylaxis", sideEffects: "Allergic reaction, GI upset, rash", contra: "Penicillin allergy", pearl: "2g IV loading dose then 1g IV q4h; preferred if chorioamnionitis suspected (broader spectrum)" },
    { name: "Clindamycin", type: "Lincosamide antibiotic", action: "Alternative for penicillin-allergic patients if GBS isolate is susceptible", sideEffects: "Clostridioides difficile infection, rash", contra: "Prior C. difficile colitis", pearl: "900 mg IV q8h; used only if sensitivity testing confirms susceptibility — GBS resistance to clindamycin is increasing" },
    { name: "Vancomycin", type: "Glycopeptide antibiotic", action: "Alternative for severe penicillin allergy when GBS is clindamycin-resistant", sideEffects: "Red Man syndrome (infusion-related), nephrotoxicity", contra: "Must dose-adjust for renal function", pearl: "1g IV q12h (dose-adjusted); reserved for patients with severe penicillin allergy AND clindamycin-resistant GBS" }
  ],
  pearls: [
    "Universal GBS screening: rectovaginal culture at 36-37 weeks for ALL pregnant women",
    "GBS bacteriuria at ANY time during pregnancy = treat during pregnancy AND give IAP during labor",
    "Prior infant with GBS disease = automatic IAP during labor (no screening needed)",
    "Goal of IAP: ≥4 hours before delivery for adequate antibiotic levels to protect the neonate",
    "If GBS status is unknown at labor, give prophylaxis if: <37 weeks, ROM >18 hours, or maternal fever",
    "Inadequate IAP (<4 hours before delivery): neonate needs enhanced observation for 36-48 hours",
    "GBS prophylaxis is NOT indicated for planned cesarean delivery without labor or membrane rupture",
    "Intrapartum prophylaxis has reduced early-onset GBS disease by 80-85%"
  ],
  quiz: [
    { question: "At what gestational age should universal GBS screening be performed?", options: ["28-30 weeks", "32-34 weeks", "36-37 weeks", "At admission for labor"], correct: 2, rationale: "Current guidelines recommend universal GBS screening by rectovaginal culture at 36-37 weeks gestation. This timing allows results to be available before delivery while reflecting colonization status near the time of labor." },
    { question: "A GBS-positive patient in labor received penicillin G only 2 hours before delivery. What is the concern?", options: ["Antibiotic was given too early", "Inadequate prophylaxis: less than 4 hours before delivery", "Penicillin is the wrong antibiotic for GBS", "No concern, any amount of antibiotic is adequate"], correct: 1, rationale: "Adequate IAP requires at least 4 hours before delivery to achieve sufficient antibiotic levels in the fetal bloodstream and amniotic fluid. With only 2 hours of coverage, the neonate needs enhanced observation for signs of GBS infection." }
  ]
};

const obPharmacology: LessonContent = {
  title: "Obstetric Pharmacology Essentials",
  cellular: {
    title: "Medication Safety in Pregnancy",
    content: "Obstetric pharmacology requires understanding the unique pharmacokinetic changes of pregnancy that affect drug absorption, distribution, metabolism, and elimination. Pregnancy increases blood volume by 40-50%, cardiac output by 30-50%, and glomerular filtration rate by 50%, which dilutes drug concentrations and accelerates renal clearance. Progesterone reduces GI motility, slowing oral drug absorption. Increased albumin binding and expanded volume of distribution alter drug concentrations. The placenta is not a true barrier: most drugs cross by passive diffusion based on molecular weight, lipophilicity, and protein binding. The FDA pregnancy risk categories (A, B, C, D, X) have been replaced by the Pregnancy and Lactation Labeling Rule (PLLR) which provides narrative risk assessments. Key principles: avoid unnecessary medications, use the lowest effective dose, prefer drugs with established safety profiles, consider timing (organogenesis in first trimester is highest risk), and always weigh maternal benefit against fetal risk."
  },
  signs: {
    left: [
      "Teratogens: ACE inhibitors, warfarin, isotretinoin, valproic acid, methotrexate",
      "Generally safe: acetaminophen, penicillins, cephalosporins, insulin, labetalol",
      "First trimester is highest risk for structural teratogenesis (weeks 3-8)",
      "Third trimester risks: drug effects on fetal growth, labor, and neonatal adaptation",
      "Breastfeeding safety: most medications are compatible — check LactMed database"
    ],
    right: [
      "ACE inhibitors/ARBs: fetal renal agenesis, oligohydramnios, pulmonary hypoplasia",
      "Warfarin: nasal hypoplasia, stippled epiphyses, CNS abnormalities (especially weeks 6-12)",
      "Isotretinoin (Accutane): craniofacial, cardiac, and CNS malformations — absolute contraindication",
      "Valproic acid: neural tube defects (spina bifida), craniofacial abnormalities",
      "NSAIDs after 32 weeks: premature ductus arteriosus closure, oligohydramnios"
    ]
  },
  medications: [
    { name: "Acetaminophen", type: "Analgesic/Antipyretic", action: "Pain relief and fever reduction; inhibits COX enzymes centrally", sideEffects: "Hepatotoxicity at high doses", contra: "Hepatic disease, chronic alcohol use", pearl: "First-line analgesic and antipyretic in all trimesters of pregnancy; avoid NSAIDs especially after 32 weeks" },
    { name: "Labetalol", type: "Alpha/Beta blocker", action: "Treats chronic and acute hypertension in pregnancy", sideEffects: "Bradycardia, hypotension, bronchospasm", contra: "Asthma, heart block, severe bradycardia", pearl: "First-line antihypertensive in pregnancy; safe in all trimesters; preferred over ACE inhibitors which are teratogenic" },
    { name: "Ondansetron (Zofran)", type: "5-HT3 receptor antagonist", action: "Treats severe nausea/vomiting of pregnancy (hyperemesis gravidarum)", sideEffects: "Headache, constipation, QT prolongation", contra: "QT prolongation, congenital long QT syndrome", pearl: "Used for severe hyperemesis when first-line therapies (doxylamine/B6) fail; some concern about first-trimester cardiac defects at high doses" },
    { name: "Doxylamine + Pyridoxine (Diclegis/Diclectin)", type: "Antihistamine + Vitamin B6", action: "First-line treatment for nausea and vomiting of pregnancy", sideEffects: "Drowsiness, dry mouth", contra: "MAO inhibitor use", pearl: "Only FDA-approved medication for nausea/vomiting of pregnancy; category A — extensive safety data" }
  ],
  pearls: [
    "ACE inhibitors and ARBs are CONTRAINDICATED in ALL trimesters — cause fetal renal damage",
    "Warfarin is teratogenic (especially weeks 6-12): use LMWH (enoxaparin) for anticoagulation in pregnancy",
    "Acetaminophen is the preferred analgesic in pregnancy; NSAIDs are avoided especially after 32 weeks",
    "Labetalol, nifedipine, and methyldopa are safe antihypertensives in pregnancy",
    "Doxylamine/pyridoxine (Diclegis/Diclectin) is first-line for nausea/vomiting of pregnancy",
    "Live vaccines (MMR, varicella) are CONTRAINDICATED in pregnancy; inactivated vaccines (flu, Tdap) are safe",
    "Tdap vaccine is recommended in every pregnancy at 27-36 weeks for neonatal pertussis protection",
    "Metformin and glyburide may be used in GDM, but insulin is the gold standard"
  ],
  quiz: [
    { question: "Which class of antihypertensives is absolutely contraindicated in pregnancy?", options: ["Calcium channel blockers", "Beta-blockers", "ACE inhibitors", "Methyldopa"], correct: 2, rationale: "ACE inhibitors (and ARBs) are absolutely contraindicated in pregnancy. They cause fetal renal agenesis, oligohydramnios, pulmonary hypoplasia, and neonatal renal failure." },
    { question: "A pregnant patient asks for pain relief for a headache at 35 weeks. Which medication is safest?", options: ["Ibuprofen", "Aspirin", "Acetaminophen", "Naproxen"], correct: 2, rationale: "Acetaminophen is the preferred analgesic in pregnancy. NSAIDs (ibuprofen, aspirin, naproxen) should be avoided after 32 weeks because they can cause premature closure of the fetal ductus arteriosus and oligohydramnios." }
  ]
};

const rhIncompatibility: LessonContent = {
  title: "Rh Incompatibility and Isoimmunization",
  cellular: {
    title: "Rh Sensitization Pathophysiology",
    content: "Rh incompatibility occurs when an Rh-negative mother carries an Rh-positive fetus. During pregnancy or delivery, fetal Rh-positive red blood cells may enter the maternal circulation (fetomaternal hemorrhage). The maternal immune system recognizes the Rh(D) antigen as foreign and produces anti-D IgG antibodies (sensitization/isoimmunization). In the first affected pregnancy, IgM antibodies are produced initially (too large to cross the placenta), so the first Rh-positive fetus is usually unaffected. However, in subsequent pregnancies with an Rh-positive fetus, the maternal immune system mounts a rapid IgG response (memory response). IgG antibodies are small enough to cross the placenta and bind to fetal Rh-positive red blood cells, marking them for destruction by the fetal reticuloendothelial system. This causes hemolytic disease of the fetus and newborn (HDFN): progressive fetal anemia, erythroblastosis fetalis, hyperbilirubinemia, and in severe cases, hydrops fetalis (generalized edema, ascites, pleural/pericardial effusions from severe anemia and heart failure). Prevention is achieved through Rho(D) immune globulin (RhoGAM) administration, which binds and clears fetal Rh-positive cells from the maternal circulation before sensitization occurs."
  },
  signs: {
    left: [
      "Maternal Rh-negative blood type with Rh-positive fetus",
      "Positive indirect Coombs test (maternal antibody screening positive)",
      "Rising maternal anti-D antibody titers during pregnancy",
      "Middle cerebral artery Doppler: increased peak systolic velocity (fetal anemia)",
      "Risk events: delivery, trauma, amniocentesis, ectopic pregnancy, abortion"
    ],
    right: [
      "Hemolytic disease of the fetus/newborn (HDFN): fetal/neonatal anemia",
      "Neonatal hyperbilirubinemia: jaundice, kernicterus risk",
      "Erythroblastosis fetalis: compensatory immature RBC production",
      "Hydrops fetalis: severe anemia causing heart failure, generalized edema, ascites",
      "Intrauterine fetal death in severe untreated cases"
    ]
  },
  medications: [
    { name: "Rho(D) Immune Globulin (RhoGAM)", type: "Anti-D immunoglobulin", action: "Binds and clears fetal Rh-positive RBCs from maternal circulation, preventing sensitization", sideEffects: "Injection site pain, mild fever, rare allergic reaction", contra: "Rh-positive mother (unnecessary), known sensitization (too late — already producing antibodies)", pearl: "300 mcg IM at 28 weeks gestation AND within 72 hours after delivery of Rh-positive infant; also after any sensitizing event (trauma, amniocentesis, ectopic, abortion)" }
  ],
  pearls: [
    "RhoGAM at 28 weeks AND within 72 hours postpartum for Rh-negative mothers with Rh-positive infants",
    "RhoGAM after ANY sensitizing event: trauma, amniocentesis, CVS, ectopic, miscarriage, abortion",
    "Kleihauer-Betke test: quantifies fetomaternal hemorrhage to determine if additional RhoGAM doses needed",
    "Once sensitized (antibodies present), RhoGAM is NO LONGER effective — the damage is done",
    "Monitor sensitized pregnancies with serial antibody titers and middle cerebral artery Doppler",
    "Hydrops fetalis is a late, ominous sign: severe fetal anemia causing heart failure",
    "Intrauterine transfusion may be performed for severe fetal anemia before viable gestational age",
    "Neonatal management: phototherapy for jaundice, exchange transfusion for severe hyperbilirubinemia/anemia"
  ],
  quiz: [
    { question: "When should RhoGAM be administered to an Rh-negative mother?", options: ["Only at delivery", "At 28 weeks gestation and within 72 hours after delivery of an Rh-positive infant", "Only if the mother has a positive antibody screen", "At every prenatal visit"], correct: 1, rationale: "RhoGAM is administered routinely at 28 weeks gestation (to prevent sensitization from late-pregnancy fetomaternal hemorrhage) and within 72 hours after delivery of an Rh-positive infant." },
    { question: "A nurse is caring for an Rh-negative mother who has already developed anti-D antibodies. Can RhoGAM prevent further complications?", options: ["Yes, RhoGAM will eliminate the antibodies", "No, once sensitization has occurred, RhoGAM is no longer effective", "Yes, but only if given in high doses", "RhoGAM is only for first pregnancies"], correct: 1, rationale: "RhoGAM prevents sensitization by clearing fetal cells before the immune system responds. Once the mother has already produced anti-D antibodies (sensitized), RhoGAM cannot remove existing antibodies. The pregnancy must be monitored for HDFN." }
  ]
};

const vbac: LessonContent = {
  title: "Vaginal Birth After Cesarean (VBAC/TOLAC)",
  cellular: {
    title: "TOLAC Risk Assessment",
    content: "Vaginal birth after cesarean (VBAC) refers to successful vaginal delivery in a woman with a prior cesarean scar. Trial of labor after cesarean (TOLAC) is the planned attempt at vaginal delivery. VBAC success rates range from 60-80% depending on the indication for prior cesarean, with the highest success rates in women with prior vaginal delivery, spontaneous labor onset, and a non-recurrent indication for the first cesarean (e.g., breech presentation). The primary risk of TOLAC is uterine rupture, which occurs in approximately 0.5-1% of women with a low transverse uterine incision. Uterine rupture can cause fetal death, maternal hemorrhage, and need for emergency hysterectomy. TOLAC candidates must have: one prior low transverse cesarean (possibly two in select cases), no contraindications to vaginal delivery, a clinically adequate pelvis, and the procedure must take place in a facility capable of performing an emergency cesarean within 30 minutes. Contraindications include prior classical or T-incision, prior uterine rupture, more than two prior cesareans (in most settings), and any other contraindication to vaginal delivery."
  },
  signs: {
    left: [
      "Good TOLAC candidate: 1 prior low transverse cesarean, non-recurrent indication",
      "Prior vaginal delivery increases VBAC success rate significantly",
      "Spontaneous labor onset (vs. induction) improves success",
      "Favorable Bishop score and adequate pelvis",
      "Normal fetal heart rate pattern throughout labor"
    ],
    right: [
      "Uterine rupture: sudden fetal bradycardia, severe pain, cessation of contractions",
      "Emergency cesarean for non-reassuring FHR",
      "Failed TOLAC: inability to achieve vaginal delivery, requires repeat cesarean",
      "Maternal hemorrhage requiring transfusion",
      "Neonatal morbidity from prolonged labor or rupture"
    ]
  },
  medications: [],
  pearls: [
    "VBAC success rate: 60-80% overall; highest with prior vaginal delivery and spontaneous labor",
    "Uterine rupture risk with low transverse scar: approximately 0.5-1%",
    "Classical (vertical) cesarean scar: TOLAC is CONTRAINDICATED (4-9% rupture risk)",
    "Continuous fetal monitoring is mandatory during TOLAC",
    "Facility must have capability for emergency cesarean within 30 minutes",
    "Misoprostol is CONTRAINDICATED for induction in TOLAC (significantly increases rupture risk)",
    "Oxytocin may be used cautiously for induction/augmentation during TOLAC",
    "Signs of rupture during TOLAC: sudden prolonged FHR deceleration is often the FIRST sign"
  ],
  quiz: [
    { question: "Which prior uterine incision type is acceptable for TOLAC?", options: ["Classical (high vertical)", "Inverted T", "Low transverse", "Fundal"], correct: 2, rationale: "Low transverse uterine incision has the lowest rupture risk (0.5-1%) and is the only routinely accepted incision type for TOLAC. Classical, T-incision, and fundal incisions have significantly higher rupture risk." },
    { question: "During TOLAC, the fetal heart rate suddenly drops to 70 bpm and does not recover. What should the nurse do?", options: ["Continue monitoring for 10 minutes", "Prepare for emergency cesarean section and suspect uterine rupture", "Increase oxytocin to strengthen contractions", "Encourage pushing to expedite delivery"], correct: 1, rationale: "Sudden prolonged fetal bradycardia during TOLAC is the most common presentation of uterine rupture. Emergency cesarean delivery is required immediately." }
  ]
};

const laborPainManagement: LessonContent = {
  title: "Labor Pain Management (Non-Pharmacological and Pharmacological)",
  cellular: {
    title: "Labor Pain Physiology",
    content: "Labor pain is a complex, multidimensional experience involving sensory, emotional, cognitive, and behavioral components. During the first stage of labor, pain originates primarily from cervical dilation and lower uterine segment distension, transmitted via visceral afferent fibers entering the spinal cord at T10-L1. During the second stage, somatic pain from vaginal and perineal stretching is transmitted via the pudendal nerve (S2-S4). Pain perception is modulated by the gate control theory: non-painful stimuli (touch, pressure, cold, movement) activate large-diameter nerve fibers that inhibit pain signal transmission at the spinal cord level. Endogenous endorphins (beta-endorphin, enkephalins) are natural pain modulators released during labor. Non-pharmacological pain management includes hydrotherapy (warm shower/bath), movement and positioning changes, breathing techniques, massage and counterpressure (for back labor), transcutaneous electrical nerve stimulation (TENS), aromatherapy, continuous labor support (doula), and hypnobirthing/visualization. Pharmacological options include systemic opioids (for early labor), nitrous oxide (50:50 N2O:O2), and neuraxial anesthesia (epidural, spinal, combined spinal-epidural)."
  },
  signs: {
    left: [
      "Non-pharmacological: hydrotherapy, positioning, breathing, massage, continuous support",
      "Systemic opioids: fentanyl, morphine, nalbuphine for early labor pain",
      "Nitrous oxide (50:50 N2O:O2): inhaled during contractions, self-administered",
      "Epidural anesthesia: gold standard for labor pain relief",
      "Combined spinal-epidural (CSE): rapid onset + continuous epidural catheter"
    ],
    right: [
      "Opioid side effects: neonatal respiratory depression if given too close to delivery",
      "Epidural: hypotension, motor block, urinary retention, prolonged second stage",
      "Post-dural puncture headache from accidental dural puncture (epidural)",
      "Total spinal: respiratory arrest if epidural medication enters subarachnoid space",
      "Inadequate pain relief with any method: requires reassessment and adjustment"
    ]
  },
  medications: [
    { name: "Fentanyl IV", type: "Synthetic opioid", action: "Provides systemic pain relief during early labor; rapid onset, short duration", sideEffects: "Neonatal respiratory depression, maternal drowsiness, nausea, pruritus", contra: "Respiratory depression, use within 1 hour of expected delivery", pearl: "Preferred systemic opioid in labor due to short duration (30-60 min); avoid within 1 hour of delivery to reduce neonatal respiratory depression" },
    { name: "Nalbuphine (Nubain)", type: "Mixed agonist-antagonist opioid", action: "Provides moderate pain relief with a ceiling effect on respiratory depression", sideEffects: "Sedation, nausea, dizziness", contra: "Prior opioid dependence (precipitates withdrawal)", pearl: "Ceiling effect on respiratory depression makes it safer than pure agonists; commonly used in labor" },
    { name: "Nitrous Oxide (50:50 N2O:O2)", type: "Inhaled analgesic", action: "Provides mild-moderate pain relief and anxiolysis during contractions", sideEffects: "Nausea, dizziness, lightheadedness (self-limited)", contra: "Pneumothorax, bowel obstruction, middle ear surgery", pearl: "Self-administered via demand valve mask; patient must hold own mask (safety feature — drops if sedated); rapidly cleared, no neonatal effects" }
  ],
  pearls: [
    "Pain management should be individualized: discuss options during prenatal care",
    "Continuous labor support (doula) reduces cesarean rates, epidural use, and improves satisfaction",
    "Hydrotherapy: warm shower/bath reduces pain and anxiety; contraindicated if membranes ruptured at some facilities",
    "Systemic opioids: give early in labor; avoid within 1-2 hours of expected delivery (neonatal depression risk)",
    "Naloxone (Narcan) should be available at delivery for neonatal opioid reversal",
    "Epidural timing: can be placed at any point in labor — there is no 'too early' or 'too late'",
    "Counterpressure on the sacrum is effective for OP (back labor) pain",
    "Respect patient autonomy: support the birth plan while maintaining safety flexibility"
  ],
  quiz: [
    { question: "A laboring patient with back labor requests non-pharmacological pain relief. Which intervention is most appropriate?", options: ["Administration of IV morphine", "Continuous sacral counterpressure and position changes", "Immediate epidural placement", "Oral acetaminophen"], correct: 1, rationale: "For back labor (occiput posterior position), counterpressure on the sacrum combined with position changes (hands and knees, side-lying) directly addresses the cause of back pain by reducing pressure of the fetal occiput on the sacrum." },
    { question: "Why should systemic opioids be avoided within 1-2 hours of expected delivery?", options: ["They slow labor progress", "Risk of neonatal respiratory depression", "They cause maternal hypotension", "They interfere with epidural placement"], correct: 1, rationale: "Systemic opioids given close to delivery can cause neonatal respiratory depression. The neonate lacks the mature enzyme systems to metabolize opioids effectively. Naloxone should be available at delivery." }
  ]
};

const multipleGestation: LessonContent = {
  title: "Multiple Gestation (Twins and Higher-Order Multiples)",
  cellular: {
    title: "Multiple Gestation Physiology and Risks",
    content: "Multiple gestation occurs when two or more fetuses develop simultaneously in the uterus. Twins occur in approximately 3% of pregnancies, with rates increasing due to assisted reproductive technology and advanced maternal age. Dizygotic (fraternal) twins result from fertilization of two separate ova by two sperm — they have separate placentas and chorions (dichorionic-diamniotic). Monozygotic (identical) twins result from splitting of a single fertilized ovum; the timing of splitting determines chorionicity: days 1-3 = dichorionic-diamniotic (separate placentas), days 4-8 = monochorionic-diamniotic (shared placenta, separate sacs), days 8-12 = monochorionic-monoamniotic (shared placenta and sac, high risk of cord entanglement), and >12 days = conjoined twins. Monochorionic twins share a placenta and are at risk for twin-to-twin transfusion syndrome (TTTS), where unbalanced arteriovenous anastomoses in the shared placenta cause one twin (recipient) to receive excessive blood flow while the other (donor) is deprived. Multiple gestations increase risk of preterm labor, preeclampsia, gestational diabetes, anemia, placental abruption, postpartum hemorrhage, and malpresentation."
  },
  signs: {
    left: [
      "Uterine size greater than expected for gestational age",
      "Elevated maternal serum hCG and AFP levels",
      "Multiple fetal heart tones detected",
      "Rapid maternal weight gain",
      "Confirmed by ultrasound: number of fetuses, chorionicity, amnionicity"
    ],
    right: [
      "Preterm labor and delivery: most common complication",
      "Twin-to-twin transfusion syndrome (TTTS) in monochorionic twins",
      "Preeclampsia (increased risk with multiples)",
      "Postpartum hemorrhage from uterine overdistension and atony",
      "Cord entanglement in monoamniotic twins (high mortality risk)"
    ]
  },
  medications: [
    { name: "Betamethasone", type: "Corticosteroid", action: "Fetal lung maturity when preterm delivery is anticipated", sideEffects: "Maternal hyperglycemia, immunosuppression", contra: "Systemic infection", pearl: "Given between 24-34 weeks if preterm delivery is anticipated; multiple gestations have higher preterm delivery rates" },
    { name: "Iron supplementation", type: "Mineral supplement", action: "Prevents iron deficiency anemia from increased blood volume demands of multiple fetuses", sideEffects: "Constipation, nausea, dark stools", contra: "Iron overload, hemochromatosis", pearl: "Multiple gestations have higher iron requirements; supplement 60-100 mg elemental iron daily" }
  ],
  pearls: [
    "Determine chorionicity/amnionicity by first-trimester ultrasound — critical for risk stratification",
    "Monochorionic twins (shared placenta) need more frequent monitoring than dichorionic twins",
    "TTTS: donor twin = small, oligohydramnios; recipient twin = large, polyhydramnios",
    "Multiple gestations: increased caloric needs (300-450 kcal/day above singleton), increased iron/folate",
    "Delivery timing: dichorionic twins at 38 weeks, monochorionic-diamniotic at 36 weeks, monoamniotic at 32-34 weeks",
    "Twin A vertex/Twin B vertex: vaginal delivery is an option",
    "Higher rates of cesarean delivery, particularly for malpresentation of second twin",
    "Postpartum hemorrhage risk is increased: have uterotonics and blood products available"
  ],
  quiz: [
    { question: "What is the most dangerous complication specific to monochorionic twins?", options: ["Gestational diabetes", "Twin-to-twin transfusion syndrome (TTTS)", "Placenta previa", "Rh incompatibility"], correct: 1, rationale: "TTTS occurs only in monochorionic twins (shared placenta) where unbalanced vascular anastomoses cause one twin to receive excessive blood flow (recipient) while the other is deprived (donor). It can be fatal without intervention." },
    { question: "How is chorionicity of twins best determined?", options: ["Maternal serum screening", "First-trimester ultrasound", "Amniocentesis", "Physical examination of the abdomen"], correct: 1, rationale: "First-trimester ultrasound is the most accurate method to determine chorionicity and amnionicity. The 'twin peak' (lambda) sign indicates dichorionic twins, while the 'T-sign' indicates monochorionic twins." }
  ]
};

const precipitousLabor: LessonContent = {
  title: "Precipitous Labor and Delivery",
  cellular: {
    title: "Rapid Labor Physiology",
    content: "Precipitous labor is defined as labor and delivery occurring in less than 3 hours from the onset of contractions to complete delivery. This rapid progression occurs when uterine contractions are abnormally frequent and intense, often with rapid cervical dilation. While precipitous labor may seem desirable, it carries significant risks for both mother and neonate. The extremely strong, frequent contractions can cause uterine hyperstimulation, reducing placental blood flow and causing fetal distress. Rapid cervical dilation and fetal descent increase the risk of cervical, vaginal, and perineal lacerations. The rapid stretching of the birth canal without adequate time for tissue accommodation leads to more extensive soft tissue trauma. Neonatal risks include intracranial hemorrhage from rapid compression and decompression of the skull, birth trauma from uncontrolled delivery, and hypothermia from delivery in an uncontrolled environment. Precipitous labor is more common in multiparous women, those with small fetuses, women with history of precipitous delivery, and may be iatrogenic from excessive oxytocin use."
  },
  signs: {
    left: [
      "Extremely rapid cervical dilation (may go from 2 cm to complete in <1 hour)",
      "Strong, frequent contractions with minimal resting time",
      "Intense rectal and perineal pressure",
      "Rapid fetal descent with imminent delivery signs",
      "History of prior precipitous delivery (high recurrence risk)"
    ],
    right: [
      "Cervical, vaginal, and perineal lacerations from rapid delivery",
      "Uterine rupture from tetanic contractions",
      "Postpartum hemorrhage from uterine atony or lacerations",
      "Neonatal birth trauma and intracranial hemorrhage",
      "Delivery outside the hospital: uncontrolled environment risks"
    ]
  },
  medications: [],
  pearls: [
    "Precipitous labor: total labor and delivery in <3 hours",
    "Previous precipitous delivery is the strongest risk factor for recurrence",
    "Do NOT leave the patient alone — delivery may be imminent at any moment",
    "If delivery occurs before provider arrives: support the head, check for nuchal cord, control delivery",
    "Do NOT apply counter-pressure to delay delivery — can cause cervical damage",
    "After rapid delivery: assess for lacerations (common due to rapid stretching)",
    "Monitor for postpartum hemorrhage: uterine overdistension and rapid delivery increase atony risk",
    "Assess neonate for trauma: precipitous delivery increases risk of bruising and intracranial hemorrhage"
  ],
  quiz: [
    { question: "A multiparous patient arrives at L&D fully dilated with the baby crowning after only 2 hours of labor. What is this called?", options: ["Failed induction", "Prolonged labor", "Precipitous labor", "Arrested labor"], correct: 2, rationale: "Precipitous labor is defined as total labor (onset of contractions to delivery) lasting less than 3 hours. This is more common in multiparous women." },
    { question: "What is the primary maternal complication of precipitous delivery?", options: ["Cesarean delivery", "Cervical and perineal lacerations", "Epidural complications", "Prolonged postpartum recovery"], correct: 1, rationale: "The rapid stretching of the birth canal during precipitous delivery does not allow adequate time for tissue accommodation, resulting in cervical, vaginal, and perineal lacerations." }
  ]
};

const emergencyChildbirth: LessonContent = {
  title: "Emergency Out-of-Hospital Delivery",
  cellular: {
    title: "Emergency Delivery Management",
    content: "Emergency out-of-hospital delivery occurs when labor progresses too rapidly for transport to a healthcare facility, or when the infant is in the process of delivery upon arrival. Nurses, paramedics, and even bystanders may need to manage these deliveries. The key principles are: do NOT delay delivery if the baby is coming, maintain a calm environment, prevent contamination, support the delivery process without rushing it, and manage the immediate postpartum period. The delivery sequence involves: supporting the perineum as the head crowns, checking for nuchal cord (loop of cord around the neck), gentle delivery of the head allowing external rotation, delivery of the anterior shoulder with gentle downward traction, delivery of the posterior shoulder with gentle upward traction, and delivery of the body. After delivery, priorities are: dry and stimulate the newborn, clear the airway if needed, maintain warmth (skin-to-skin is ideal), clamp and cut the cord, deliver the placenta (do not pull on the cord), and assess for maternal bleeding. Initiate neonatal resuscitation (PPV, chest compressions) if the newborn does not breathe or has a heart rate <100 bpm."
  },
  signs: {
    left: [
      "Crowning: visible fetal scalp at the introitus during contractions",
      "Irresistible urge to push that cannot be suppressed",
      "Visible perineal bulging with bearing down",
      "Delivery is imminent and cannot be delayed",
      "Assess the situation: is there time for transport?"
    ],
    right: [
      "Nuchal cord: cord wrapped around the neck — slip over the head or clamp and cut",
      "Meconium-stained fluid: prepare for potential neonatal suction/resuscitation",
      "Postpartum hemorrhage: fundal massage, breastfeeding, uterotonic if available",
      "Neonatal distress: apnea, cyanosis, bradycardia — begin resuscitation",
      "Retained placenta: do NOT pull on the cord — transport to hospital"
    ]
  },
  medications: [],
  pearls: [
    "Do NOT try to delay a delivery that is in progress — support the natural process",
    "Support the perineum: gentle counterpressure to control the rate of head delivery",
    "Check for nuchal cord after the head delivers: if loose, slip over the head; if tight, clamp and cut",
    "Dry the newborn immediately, stimulate by rubbing the back, and provide warmth (skin-to-skin)",
    "Clamp the cord in two places (approximately 6-8 inches from the neonate) and cut between clamps",
    "The placenta usually delivers within 5-30 minutes: NEVER pull on the cord",
    "If the neonate does not cry or breathe within 30 seconds: begin gentle stimulation, suction, then PPV",
    "Call for emergency transport as soon as possible for both mother and newborn"
  ],
  quiz: [
    { question: "During an emergency delivery, the head delivers and you feel a loop of umbilical cord around the neck. What should you do?", options: ["Push the baby back in", "Try to slip the cord gently over the baby's head", "Pull forcefully on the cord", "Wait for the placenta to deliver"], correct: 1, rationale: "If a nuchal cord (cord around the neck) is felt, attempt to gently slip it over the baby's head. If it is too tight to slip over, clamp the cord in two places and cut between the clamps before delivering the shoulders." },
    { question: "After an emergency delivery, the placenta has not delivered after 15 minutes. What is the correct action?", options: ["Pull firmly on the umbilical cord", "Massage the fundus and transport to the hospital", "Cut the cord and remove the placenta manually", "Apply ice to the abdomen"], correct: 1, rationale: "The placenta usually delivers within 5-30 minutes. Gentle fundal massage may help. NEVER pull on the cord (risk of uterine inversion). Transport to the hospital for management if the placenta does not deliver spontaneously." }
  ]
};

const fetopelvicDisproportion: LessonContent = {
  title: "Cephalopelvic Disproportion (CPD)",
  cellular: {
    title: "CPD and Dystocia Mechanisms",
    content: "Cephalopelvic disproportion (CPD) occurs when the fetal head is too large to pass through the maternal pelvis, or the pelvis is too small or abnormally shaped to allow passage of the fetal head. True CPD is relatively rare; more commonly, labor dystocia results from malposition (occiput posterior), inadequate contractions, or the combination of a large baby and borderline pelvis. The maternal pelvis is classified by shape: gynecoid (round inlet, most favorable for vaginal delivery), android (heart-shaped, narrowed outlet), anthropoid (oval AP diameter, may accommodate OP position), and platypelloid (flat, transverse diameter wider, least favorable). Pelvic adequacy depends on the relationship between fetal head size and pelvic dimensions at three levels: the inlet, the midpelvis, and the outlet. True CPD is a diagnosis made retrospectively when adequate labor (contractions meeting Montevideo criteria) fails to produce cervical dilation or fetal descent. Risk factors include macrosomia, gestational diabetes, post-term pregnancy, short maternal stature, pelvic abnormalities from fracture or congenital conditions, and maternal obesity."
  },
  signs: {
    left: [
      "Arrest of cervical dilation despite adequate contractions",
      "Arrest of fetal descent in second stage",
      "Adequate contractions (>200 Montevideo units) without progress",
      "Excessive molding and caput succedaneum on the fetal head",
      "Suspected large fetus (fundal height greater than gestational age)"
    ],
    right: [
      "Failed vaginal delivery requiring cesarean section",
      "Prolonged labor with maternal exhaustion",
      "Fetal distress from prolonged labor",
      "Third/fourth-degree lacerations from difficult delivery",
      "Neonatal birth trauma (cephalohematoma, skull fractures)"
    ]
  },
  medications: [],
  pearls: [
    "True CPD is a diagnosis of EXCLUSION — made only after adequate labor trial fails",
    "Gynecoid pelvis is the most favorable shape for vaginal delivery (50% of women)",
    "Estimated fetal weight by ultrasound has a ±15% margin of error — not accurate enough to diagnose CPD prenatally",
    "Adequate labor: ≥200 Montevideo units with IUPC monitoring",
    "Arrest of dilation: no progress for ≥6 hours with adequate contractions",
    "Position changes, ambulation, and hydrotherapy may help with malposition-related 'failure to progress'",
    "History of prior vaginal delivery suggests adequate pelvis for similar-sized fetus",
    "CPD in one pregnancy does NOT necessarily mean CPD in future pregnancies (different fetal size, position)"
  ],
  quiz: [
    { question: "A patient in active labor has had adequate contractions (220 Montevideo units) for 6 hours with no cervical change. What is the likely diagnosis?", options: ["Precipitous labor", "Prodromal labor", "Arrest of active phase suggesting possible CPD", "Normal labor progress"], correct: 2, rationale: "No cervical change for 6+ hours despite adequate contractions (>200 Montevideo units) meets the criteria for arrest of active phase, suggesting cephalopelvic disproportion or malposition. Cesarean delivery is likely indicated." },
    { question: "Which pelvic shape is most favorable for vaginal delivery?", options: ["Android", "Anthropoid", "Platypelloid", "Gynecoid"], correct: 3, rationale: "The gynecoid pelvis (round inlet) is the most favorable shape for vaginal delivery, found in approximately 50% of women. It allows smooth fetal descent through all pelvic planes." }
  ]
};

const chorioamnionitis: LessonContent = {
  title: "Chorioamnionitis (Intra-Amniotic Infection)",
  cellular: {
    title: "Chorioamnionitis Pathophysiology",
    content: "Chorioamnionitis (intra-amniotic infection or intraamniotic inflammation) is infection of the chorion, amnion, and amniotic fluid, typically caused by ascending polymicrobial infection from the vaginal flora after rupture of membranes. The most common organisms include Ureaplasma urealyticum, Mycoplasma hominis, Gardnerella vaginalis, Group B Streptococcus, and Escherichia coli. Bacteria ascend through the cervix into the amniotic cavity, triggering an inflammatory cascade. Maternal neutrophils infiltrate the chorion and amnion (histological chorioamnionitis), while fetal neutrophils may infiltrate the umbilical cord (funisitis) and fetal membranes. The inflammatory response releases cytokines (IL-1, IL-6, TNF-alpha) and prostaglandins, which stimulate uterine contractions and may trigger preterm labor. Chorioamnionitis is the most common infection-related cause of preterm birth. Risk factors include prolonged rupture of membranes (>18 hours), prolonged labor, multiple vaginal examinations, internal fetal monitoring, GBS colonization, bacterial vaginosis, and nulliparity."
  },
  signs: {
    left: [
      "Maternal fever ≥100.4°F (38°C): hallmark sign",
      "Maternal tachycardia (heart rate >100 bpm)",
      "Fetal tachycardia (>160 bpm) on monitor",
      "Uterine tenderness on palpation",
      "Foul-smelling or purulent amniotic fluid"
    ],
    right: [
      "Neonatal sepsis: the most feared neonatal complication",
      "Neonatal pneumonia and meningitis",
      "Preterm delivery from infection-induced labor",
      "Maternal bacteremia and sepsis",
      "Postpartum endometritis and wound infection"
    ]
  },
  medications: [
    { name: "Ampicillin + Gentamicin", type: "Antibiotic combination", action: "Broad-spectrum coverage for polymicrobial intra-amniotic infection", sideEffects: "GI upset, nephrotoxicity (gentamicin), ototoxicity", contra: "Penicillin allergy (use alternative), renal impairment (adjust gentamicin)", pearl: "Standard intrapartum antibiotic regimen for chorioamnionitis; ampicillin 2g IV q6h + gentamicin 5 mg/kg IV daily; add clindamycin or metronidazole after cesarean delivery" }
  ],
  pearls: [
    "Maternal fever ≥100.4°F during labor + fetal tachycardia = suspect chorioamnionitis until proven otherwise",
    "Chorioamnionitis requires DELIVERY — antibiotics do NOT cure the infection without delivery",
    "Prolonged ROM (>18 hours) significantly increases chorioamnionitis risk",
    "Minimize vaginal examinations to reduce ascending infection risk",
    "Chorioamnionitis is NOT a contraindication to vaginal delivery — in fact, delivery should be expedited",
    "Continue antibiotics after delivery: additional dose after cesarean; may discontinue after vaginal delivery if afebrile",
    "Monitor the neonate closely for signs of sepsis: temperature instability, lethargy, poor feeding, respiratory distress",
    "Blood cultures before antibiotics when possible, but do NOT delay treatment"
  ],
  quiz: [
    { question: "A laboring patient has a temperature of 101°F, heart rate 112, and the fetal heart rate is 170 bpm. What is the most likely diagnosis?", options: ["Epidural fever", "Chorioamnionitis", "Normal labor findings", "Urinary tract infection"], correct: 1, rationale: "Maternal fever + maternal tachycardia + fetal tachycardia during labor is the classic presentation of chorioamnionitis. Treatment with antibiotics and expedited delivery is indicated." },
    { question: "What is the definitive treatment for chorioamnionitis?", options: ["Antibiotics alone", "Bed rest and monitoring", "Delivery of the fetus and placenta plus antibiotics", "Tocolytics to stop labor"], correct: 2, rationale: "Chorioamnionitis requires both antibiotics AND delivery. The infected amniotic cavity and membranes must be evacuated. Tocolytics are contraindicated because they would delay delivery and worsen the infection." }
  ]
};

const laborNursingAssessment: LessonContent = {
  title: "Labor and Delivery Nursing Assessment",
  cellular: {
    title: "Systematic Labor Assessment",
    content: "Comprehensive nursing assessment during labor and delivery involves systematic evaluation of maternal and fetal status through multiple parameters. Initial assessment includes maternal history (gravidity, parity, gestational age, prenatal course, allergies, GBS status, blood type, medical/surgical history), vital signs, contraction assessment (frequency, duration, intensity, resting tone), cervical examination (dilation, effacement, station, presentation, position), fetal heart rate assessment (baseline, variability, accelerations, decelerations, category classification), and status of membranes (intact or ruptured; if ruptured: time, color, odor, amount). Leopold's maneuvers determine fetal lie, presentation, and position through systematic abdominal palpation. The nurse monitors labor progress using the partograph/labor curve, assessing for normal patterns versus prolonged or arrested labor. GTPAL documentation captures Gravidity, Term deliveries, Preterm deliveries, Abortions/miscarriages, and Living children. Pain assessment includes location, quality, intensity, and coping strategies. Psychosocial assessment evaluates the patient's emotional state, support system, birth plan preferences, and cultural considerations."
  },
  signs: {
    left: [
      "GTPAL documentation: Gravidity, Term, Preterm, Abortions, Living",
      "Leopold's maneuvers: four systematic palpation steps to determine fetal position",
      "Cervical exam: dilation (0-10 cm), effacement (0-100%), station (-3 to +3)",
      "Contraction assessment: frequency, duration, intensity, resting tone",
      "FHR assessment: baseline, variability, periodic changes, category classification"
    ],
    right: [
      "Non-reassuring FHR patterns requiring immediate intervention",
      "Signs of labor complications: bleeding, fever, prolonged ROM, meconium-stained fluid",
      "Maternal hypertension or signs of preeclampsia during labor",
      "Abnormal labor progress: arrest of dilation or descent",
      "Umbilical cord abnormalities: prolapse, true knot, compression patterns"
    ]
  },
  medications: [],
  pearls: [
    "GTPAL: G=total pregnancies, T=term births (≥37 wks), P=preterm births (20-36 wks), A=abortions/losses (<20 wks), L=living children",
    "Station: relationship of presenting part to ischial spines; 0 station = engaged; +3 = crowning",
    "Leopold's: 1st maneuver (fundal grip), 2nd (lateral/umbilical grip), 3rd (Pawlik's grip), 4th (pelvic grip)",
    "Assess FHR for at least 30 minutes on admission; continuous monitoring if high-risk or oxytocin use",
    "Rupture of membranes: note time, color (clear, meconium-stained, bloody), amount, odor",
    "Frequent reassessment during labor: vitals, contractions, FHR, cervical change, coping, pain",
    "Always verify patient identification, allergies, GBS status, and blood type on admission",
    "Communication with the provider: use SBAR format for reporting changes in status"
  ],
  quiz: [
    { question: "A patient is G4P2012. What does this mean?", options: ["4 pregnancies, 2 term births, 0 preterm, 1 abortion, 2 living children", "4 pregnancies, 2 cesareans, 0 vaginal births, 1 stillbirth, 2 children", "4 children, 2 adopted, 0 miscarriages, 1 ectopic, 2 living", "4 pregnancies, 2 term, 0 preterm, 1 loss, 2 living — current pregnancy is the 4th"], correct: 0, rationale: "GTPAL: G4 = 4th pregnancy (including current), P2 = 2 term deliveries, 0 = 0 preterm deliveries, 1 = 1 abortion/miscarriage (<20 weeks), 2 = 2 living children." },
    { question: "On vaginal examination, the presenting part is palpated at the level of the ischial spines. What station is this?", options: ["-3 station", "-1 station", "0 station (engaged)", "+3 station"], correct: 2, rationale: "0 station means the presenting part is at the level of the ischial spines, indicating the fetal head is engaged in the pelvis. Negative numbers are above the spines, positive numbers are below." }
  ]
};

const fetalMonitoringStrips: LessonContent = {
  title: "Fetal Monitor Strip Interpretation",
  cellular: {
    title: "Advanced EFM Interpretation",
    content: "Systematic fetal monitor strip interpretation follows the DR C BRAVADO mnemonic: Determine Risk, Contractions, Baseline Rate, Variability, Accelerations, Decelerations, and Overall assessment. Contractions are assessed for frequency (onset to onset), duration (beginning to end), intensity (mild, moderate, strong by palpation or mmHg by IUPC), and resting tone (should be soft between contractions). Baseline FHR is determined over a 10-minute window, excluding periodic changes: normal is 110-160 bpm. Variability is classified as: absent (undetectable), minimal (<5 bpm), moderate (6-25 bpm, reassuring), and marked (>25 bpm). Accelerations are transient increases ≥15 bpm for ≥15 seconds (≥10 bpm for ≥10 seconds before 32 weeks). Decelerations are classified by shape and timing: early (gradual onset/offset, mirror contractions, benign), late (gradual onset, begin after contraction peak, uteroplacental insufficiency), variable (abrupt onset/offset, cord compression), and prolonged (≥2 minutes but <10 minutes). The three-tier NICHD classification system categorizes tracings: Category I (normal, strongly predictive of normal fetal acid-base status), Category II (indeterminate, requires evaluation and surveillance), Category III (abnormal, requires prompt evaluation and intervention)."
  },
  signs: {
    left: [
      "Category I: normal baseline, moderate variability, no late/variable decels, ±accels",
      "Early decelerations: mirror contractions, gradual onset, head compression — benign",
      "Accelerations: reactive pattern indicates fetal well-being",
      "Moderate variability (6-25 bpm): most reassuring sign of fetal oxygenation",
      "Normal contraction pattern: q2-5 min, lasting 45-90 sec, with adequate resting tone"
    ],
    right: [
      "Category III: absent variability + recurrent late/variable decels OR bradycardia",
      "Late decelerations: begin AFTER contraction peak — uteroplacental insufficiency",
      "Variable decelerations: abrupt onset/offset, V/W/U shapes — cord compression",
      "Prolonged deceleration: FHR below baseline for ≥2 min — various causes",
      "Sinusoidal pattern: smooth undulating wave — severe fetal anemia (emergency)"
    ]
  },
  medications: [],
  pearls: [
    "DR C BRAVADO: Determine Risk, Contractions, Baseline, Rate, Variability, Accelerations, Decelerations, Overall",
    "Moderate variability is THE most important reassuring sign — even with decelerations",
    "Sinusoidal pattern: smooth undulating sine wave — indicates severe fetal anemia (Rh disease, hemorrhage)",
    "Category III tracing: immediate intrauterine resuscitation AND preparation for delivery",
    "Intrauterine resuscitation: left lateral position, IV fluid bolus, oxygen, stop oxytocin, terbutaline if needed",
    "Early decelerations are the ONLY type that requires NO intervention",
    "Variable decelerations: reposition, amnioinfusion if recurrent",
    "Document FHR assessments per institutional protocol: typically q15-30 min in active labor, q5-15 min in second stage"
  ],
  quiz: [
    { question: "A fetal monitor tracing shows absent variability with recurrent late decelerations. What NICHD category is this?", options: ["Category I: normal", "Category II: indeterminate", "Category III: abnormal — requires immediate intervention", "Cannot be classified"], correct: 2, rationale: "Absent variability combined with recurrent late decelerations is a Category III tracing, which is abnormal and associated with abnormal fetal acid-base status. Immediate evaluation and intervention (intrauterine resuscitation, preparation for delivery) are required." },
    { question: "What is the single most important indicator of fetal well-being on a fetal monitor strip?", options: ["Baseline rate of 140 bpm", "Moderate variability (6-25 bpm)", "Presence of early decelerations", "Absence of any decelerations"], correct: 1, rationale: "Moderate variability (6-25 bpm fluctuation in the baseline) is the single most important and reassuring indicator of fetal neurological and cardiovascular well-being, reflecting an intact autonomic nervous system with adequate cerebral oxygenation." }
  ]
};

const ectopicPregnancy: LessonContent = {
  title: "Ectopic Pregnancy",
  cellular: {
    title: "Ectopic Implantation Pathophysiology",
    content: "Ectopic pregnancy occurs when a fertilized ovum implants outside the uterine cavity, most commonly in the fallopian tube (95-97% of cases, particularly the ampulla). Other sites include the ovary, cervix, cesarean scar, and abdominal cavity. The ectopic pregnancy cannot be sustained because the fallopian tube lacks the decidual layer and blood supply to support placental development. As the embryo grows, it stretches the tube, causing pain and eventually rupture with hemorrhage into the peritoneal cavity. Ruptured ectopic pregnancy is a life-threatening surgical emergency and a leading cause of first-trimester maternal death. Risk factors include prior ectopic pregnancy (10-25% recurrence), pelvic inflammatory disease (PID, especially from Chlamydia and gonorrhea), prior tubal surgery, endometriosis, IUD use, smoking, and assisted reproductive technology. Diagnosis relies on serial serum beta-hCG levels (which rise abnormally slowly — should double every 48-72 hours in normal pregnancy) and transvaginal ultrasound showing an empty uterus with an adnexal mass or free fluid."
  },
  signs: {
    left: [
      "Unilateral lower abdominal or pelvic pain (before rupture)",
      "Amenorrhea followed by abnormal vaginal bleeding (scant, dark)",
      "Positive pregnancy test with abnormally rising beta-hCG levels",
      "Adnexal tenderness and possible palpable mass on exam",
      "Transvaginal ultrasound: empty uterus with adnexal mass"
    ],
    right: [
      "Ruptured ectopic: sudden severe abdominal pain, peritoneal signs",
      "Hemorrhagic shock: tachycardia, hypotension, syncope, shoulder pain (diaphragm irritation from blood)",
      "Cullen sign: periumbilical ecchymosis from intraperitoneal hemorrhage",
      "Referred shoulder pain from diaphragmatic irritation (Kehr's sign)",
      "Death from uncontrolled hemorrhage if untreated"
    ]
  },
  medications: [
    { name: "Methotrexate", type: "Antimetabolite (folic acid antagonist)", action: "Inhibits DNA synthesis in rapidly dividing trophoblastic cells, causing resorption of the ectopic pregnancy", sideEffects: "Nausea, stomatitis, transient liver enzyme elevation, bone marrow suppression", contra: "Ruptured ectopic, hemodynamic instability, hepatic/renal disease, immunodeficiency, breastfeeding", pearl: "Single dose 50 mg/m² IM for unruptured ectopic with beta-hCG <5000; monitor beta-hCG until undetectable; avoid folate supplements, alcohol, NSAIDs, and intercourse during treatment" }
  ],
  pearls: [
    "Ectopic pregnancy is a leading cause of first-trimester maternal death — always consider it",
    "Classic triad: amenorrhea, abnormal vaginal bleeding, unilateral pelvic pain",
    "Beta-hCG should double every 48-72 hours: abnormally slow rise = suspect ectopic or non-viable pregnancy",
    "Ruptured ectopic = surgical emergency: immediate IV access, type and crossmatch, prepare for laparotomy/laparoscopy",
    "Shoulder pain in early pregnancy with abdominal pain = ruptured ectopic with diaphragmatic irritation",
    "Methotrexate: patient must avoid folate-containing vitamins, alcohol, NSAIDs, and sexual intercourse",
    "After methotrexate: serial beta-hCG monitoring until levels reach zero (may take 4-8 weeks)",
    "Rh-negative patients with ectopic pregnancy: administer RhoGAM"
  ],
  quiz: [
    { question: "A patient at 7 weeks gestation presents with right-sided pelvic pain, scant vaginal bleeding, and a beta-hCG level that has only increased 20% in 48 hours. What is the most likely diagnosis?", options: ["Normal pregnancy", "Threatened miscarriage", "Ectopic pregnancy", "Molar pregnancy"], correct: 2, rationale: "A suboptimal rise in beta-hCG (should double every 48-72 hours) combined with unilateral pelvic pain and vaginal bleeding strongly suggests ectopic pregnancy. Transvaginal ultrasound and serial hCG monitoring are indicated." },
    { question: "A patient with a confirmed ectopic pregnancy suddenly develops severe abdominal pain, tachycardia, and shoulder pain. What is the priority intervention?", options: ["Administer methotrexate", "Prepare for emergency surgery and initiate fluid resuscitation", "Schedule an outpatient follow-up", "Prescribe oral pain medication"], correct: 1, rationale: "Sudden severe pain with tachycardia and shoulder pain (diaphragmatic irritation from hemoperitoneum) indicates ruptured ectopic pregnancy. This is a surgical emergency requiring immediate intervention, IV access, blood products, and laparotomy/laparoscopy." }
  ]
};

const molarPregnancy: LessonContent = {
  title: "Gestational Trophoblastic Disease (Molar Pregnancy)",
  cellular: {
    title: "Molar Pregnancy Pathophysiology",
    content: "Gestational trophoblastic disease (GTD) encompasses a spectrum of conditions characterized by abnormal proliferation of trophoblastic tissue. Hydatidiform mole (molar pregnancy) is the most common form, classified as complete or partial. Complete mole results from fertilization of an empty ovum (no maternal chromosomes) by one sperm that duplicates (46,XX) or two sperm (46,XX or 46,XY): the result is a mass of swollen, grape-like chorionic villi with no fetal tissue. Partial mole results from fertilization of a normal ovum by two sperm, creating a triploid (69,XXX or 69,XXY) embryo with some fetal parts but abnormal villi. The proliferating trophoblastic tissue produces extremely high levels of human chorionic gonadotropin (hCG), causing severe hyperemesis, bilateral ovarian theca lutein cysts (from hCG stimulation), and in complete moles, early signs of preeclampsia before 20 weeks (which is otherwise essentially diagnostic of GTD). The primary concern is that GTD can progress to gestational trophoblastic neoplasia (GTN): invasive mole or choriocarcinoma, which are malignant conditions requiring chemotherapy. Risk factors include extremes of maternal age (<20 or >35), prior molar pregnancy, Southeast Asian ancestry, and folate deficiency."
  },
  signs: {
    left: [
      "Vaginal bleeding in first trimester (most common presenting symptom)",
      "Uterine size larger than expected for gestational age (complete mole)",
      "Extremely elevated beta-hCG levels (often >100,000 mIU/mL)",
      "Severe hyperemesis gravidarum from elevated hCG",
      "Ultrasound: 'snowstorm' or 'cluster of grapes' appearance (no fetus in complete mole)"
    ],
    right: [
      "Early-onset preeclampsia (before 20 weeks): highly suggestive of GTD",
      "Hyperthyroidism: hCG has structural similarity to TSH, stimulating the thyroid",
      "Bilateral theca lutein ovarian cysts from hCG overstimulation",
      "Gestational trophoblastic neoplasia (GTN): invasive mole or choriocarcinoma",
      "Respiratory complications: trophoblastic embolization to the lungs"
    ]
  },
  medications: [
    { name: "Methotrexate", type: "Antimetabolite", action: "First-line chemotherapy for low-risk GTN; inhibits dihydrofolate reductase disrupting DNA synthesis", sideEffects: "Bone marrow suppression, mucositis, hepatotoxicity, nausea", contra: "Hepatic/renal failure, immunosuppression, breastfeeding", pearl: "Used for malignant transformation (GTN) — not for the initial molar pregnancy itself (which is treated by evacuation)" }
  ],
  pearls: [
    "Complete mole: no fetus, snowstorm on ultrasound, very high hCG, higher malignancy risk",
    "Partial mole: some fetal parts present, triploid karyotype, lower but still elevated hCG",
    "Treatment: suction curettage (uterine evacuation) with careful monitoring for hemorrhage",
    "After evacuation: serial beta-hCG monitoring weekly until undetectable, then monthly for 6-12 months",
    "Reliable contraception for 6-12 months after treatment to avoid confusing rising hCG with new pregnancy vs. GTN",
    "Preeclampsia before 20 weeks gestation = think molar pregnancy",
    "Rising or plateauing hCG after evacuation = suspect GTN (malignant transformation)",
    "Rh-negative patients: administer RhoGAM after molar evacuation"
  ],
  quiz: [
    { question: "A patient at 12 weeks gestation has vaginal bleeding, a uterus measuring 20-week size, and a beta-hCG of 200,000 mIU/mL. Ultrasound shows a 'snowstorm' pattern with no fetus. What is the most likely diagnosis?", options: ["Normal twin pregnancy", "Complete hydatidiform mole", "Ectopic pregnancy", "Threatened miscarriage"], correct: 1, rationale: "The classic presentation of a complete mole: size-date discrepancy (larger than expected), extremely elevated hCG, snowstorm appearance on ultrasound with no fetal structures, and vaginal bleeding." },
    { question: "After evacuation of a molar pregnancy, why is reliable contraception essential for 6-12 months?", options: ["To prevent ectopic pregnancy", "To avoid confusing rising hCG from a new pregnancy with GTN (malignant transformation)", "Because the patient is infertile", "To allow the uterus to heal"], correct: 1, rationale: "After molar evacuation, serial hCG monitoring is critical to detect GTN (malignant transformation). A new pregnancy would cause hCG to rise normally, making it impossible to distinguish from malignant transformation." }
  ]
};

const hyperemesisGravidarum: LessonContent = {
  title: "Hyperemesis Gravidarum",
  cellular: {
    title: "Severe NVP Pathophysiology",
    content: "Hyperemesis gravidarum (HG) is the most severe form of nausea and vomiting of pregnancy (NVP), affecting 0.3-3% of pregnancies. It is characterized by persistent, intractable vomiting causing weight loss (>5% of pre-pregnancy weight), dehydration, electrolyte imbalances, and ketonuria. The pathophysiology is multifactorial and not fully understood but involves elevated hCG levels (which peak at 8-12 weeks, correlating with peak symptom severity), estrogen and progesterone effects on GI motility, altered serotonin signaling, Helicobacter pylori infection (associated in some studies), and genetic predisposition. At the cellular level, hCG stimulates the chemoreceptor trigger zone in the medulla and slows gastric emptying through progesterone-mediated smooth muscle relaxation. Persistent vomiting leads to volume depletion, metabolic alkalosis (from loss of gastric acid/HCl), hypokalemia, hyponatremia, and malnutrition. Severe cases may develop Wernicke encephalopathy from thiamine (vitamin B1) deficiency: ataxia, confusion, and ophthalmoplegia. Risk factors include molar pregnancy (very high hCG), multiple gestation, prior HG, obesity, and female fetus."
  },
  signs: {
    left: [
      "Persistent nausea and vomiting beyond typical NVP (beyond 12 weeks or severe)",
      "Weight loss >5% of pre-pregnancy weight",
      "Signs of dehydration: dry mucous membranes, decreased urine output, tachycardia",
      "Ketonuria on urinalysis (starvation ketosis)",
      "Metabolic alkalosis from gastric acid loss"
    ],
    right: [
      "Severe dehydration requiring IV fluid resuscitation",
      "Electrolyte imbalances: hypokalemia, hyponatremia, hypomagnesemia",
      "Wernicke encephalopathy: thiamine deficiency causing ataxia, confusion, ophthalmoplegia",
      "Mallory-Weiss tear from forceful vomiting (esophageal mucosal tear)",
      "Malnutrition affecting fetal growth (severe cases only)"
    ]
  },
  medications: [
    { name: "Doxylamine + Pyridoxine (Diclegis/Diclectin)", type: "Antihistamine + Vitamin B6", action: "First-line for NVP: antihistamine and vitamin B6 combination", sideEffects: "Drowsiness, dry mouth", contra: "MAO inhibitor use", pearl: "FDA category A; take at bedtime initially, add morning/afternoon doses as needed" },
    { name: "Ondansetron (Zofran)", type: "5-HT3 antagonist", action: "Second-line antiemetic for refractory vomiting", sideEffects: "Headache, constipation, QT prolongation", contra: "Long QT syndrome", pearl: "Used when first-line fails; some concern about first-trimester cardiac defects at high doses — weigh risk vs. benefit" },
    { name: "Thiamine (Vitamin B1)", type: "Water-soluble vitamin", action: "Prevents Wernicke encephalopathy from prolonged vomiting and malnutrition", sideEffects: "Rare allergic reactions", contra: "None significant", pearl: "ALWAYS give thiamine BEFORE dextrose-containing IV fluids to prevent precipitating Wernicke encephalopathy" },
    { name: "IV Fluid Resuscitation (NS or LR)", type: "Isotonic crystalloid", action: "Corrects dehydration and allows electrolyte repletion", sideEffects: "Fluid overload (monitor I&O)", contra: "None in dehydration", pearl: "Use NS or LR with potassium supplementation as needed; avoid dextrose until after thiamine administration" }
  ],
  pearls: [
    "ALWAYS give thiamine BEFORE dextrose IV fluids — dextrose without thiamine can precipitate Wernicke encephalopathy",
    "Hyperemesis gravidarum is a diagnosis of exclusion: rule out molar pregnancy, UTI, thyroid disease, appendicitis",
    "Weight loss >5%, ketonuria, and electrolyte abnormalities distinguish HG from normal NVP",
    "Small, frequent meals; avoid triggers; ginger supplements may help mild symptoms",
    "Assess for signs of Wernicke: confusion, ataxia, nystagmus/ophthalmoplegia — medical emergency",
    "Consider molar pregnancy if hCG is extremely elevated and vomiting is severe",
    "HG typically improves by 20 weeks but may persist throughout pregnancy in some women",
    "Emotional support is essential: HG causes significant psychological distress and may affect bonding"
  ],
  quiz: [
    { question: "Before administering dextrose-containing IV fluids to a patient with hyperemesis gravidarum, what must the nurse administer first?", options: ["Ondansetron", "Thiamine (vitamin B1)", "Potassium", "Magnesium"], correct: 1, rationale: "Thiamine must be administered before dextrose to prevent precipitating Wernicke encephalopathy. Glucose metabolism requires thiamine as a cofactor; giving dextrose to a thiamine-depleted patient can worsen the deficiency and trigger this neurological emergency." },
    { question: "What differentiates hyperemesis gravidarum from normal nausea and vomiting of pregnancy?", options: ["Onset in the first trimester", "Weight loss >5%, dehydration, ketonuria, and electrolyte imbalances", "Nausea worse in the morning", "Vomiting that occurs occasionally"], correct: 1, rationale: "Hyperemesis gravidarum is distinguished from normal NVP by the severity of symptoms: significant weight loss (>5%), dehydration requiring IV fluids, ketonuria, and electrolyte abnormalities." }
  ]
};

export const laborDeliveryLessons: Record<string, LessonContent> = {
  "stages-of-labor": stagesOfLabor,
  "fetal-heart-rate-monitoring": fetalHeartRateMonitoring,
  "preeclampsia-eclampsia": preeclampsia,
  "gestational-diabetes": gestationalDiabetes,
  "placenta-previa": placentaPrevia,
  "placental-abruption": placentalAbruption,
  "shoulder-dystocia": shoulderDystocia,
  "cord-prolapse": cordProlapse,
  "induction-augmentation": inductionAugmentation,
  "cesarean-section-care": cesareanSection,
  "epidural-management": epiduralManagement,
  "fetal-malpresentation": fetalMalpresentation,
  "postpartum-hemorrhage-ld": postpartumHemorrhage,
  "uterine-rupture": uterineRupture,
  "fetal-assessment-antepartum": fetalAssessment,
  "high-risk-pregnancy": highRiskPregnancy,
  "amniotic-fluid-disorders": amnioticFluidDisorders,
  "preterm-labor-tocolysis": pretermLabor,
  "prom-pprom": prematureRuptureOfMembranes,
  "group-b-streptococcus": groupBStreptococcus,
  "ob-pharmacology": obPharmacology,
  "rh-incompatibility": rhIncompatibility,
  "vbac-tolac": vbac,
  "labor-pain-management": laborPainManagement,
  "multiple-gestation": multipleGestation,
  "precipitous-labor": precipitousLabor,
  "emergency-childbirth": emergencyChildbirth,
  "cephalopelvic-disproportion": fetopelvicDisproportion,
  "chorioamnionitis": chorioamnionitis,
  "labor-nursing-assessment": laborNursingAssessment,
  "fetal-monitor-strip-interpretation": fetalMonitoringStrips,
  "ectopic-pregnancy": ectopicPregnancy,
  "molar-pregnancy": molarPregnancy,
  "hyperemesis-gravidarum": hyperemesisGravidarum,
};
