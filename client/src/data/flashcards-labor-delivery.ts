import type { FlashcardData } from "./flashcards-rpn";

export const laborDeliveryFlashcards: FlashcardData[] = [
  {
    id: "ld-q1",
    type: "question",
    question: "A laboring client's cervix is 6 cm dilated, 80% effaced, and the fetus is at 0 station. What phase of labor is this?",
    options: ["Latent phase", "Active phase", "Transition phase", "Second stage"],
    correctIndex: 1,
    answer: "Active phase of labor is characterized by cervical dilation from 4-7 cm with regular, stronger contractions. Latent phase is 0-3 cm, transition is 8-10 cm, and the second stage begins at full dilation.",
    category: "Stages of Labor",
    difficulty: 1
  },
  {
    id: "ld-q2",
    type: "question",
    question: "Which fetal heart rate pattern is most concerning and requires immediate intervention?",
    options: ["Early decelerations", "Variable decelerations with quick return to baseline", "Late decelerations with absent variability", "Accelerations with moderate variability"],
    correctIndex: 2,
    answer: "Late decelerations with absent variability indicate uteroplacental insufficiency and fetal compromise. This is a Category III tracing requiring immediate intervention including positioning, oxygen, IV fluids, stopping oxytocin, and preparing for possible emergent delivery.",
    category: "Fetal Monitoring",
    difficulty: 3
  },
  {
    id: "ld-q3",
    type: "question",
    question: "What is the normal baseline fetal heart rate range?",
    options: ["100-120 bpm", "110-160 bpm", "120-180 bpm", "140-200 bpm"],
    correctIndex: 1,
    answer: "The normal fetal heart rate baseline is 110-160 bpm. Tachycardia is >160 bpm (may indicate maternal fever, fetal infection, or medication effects). Bradycardia is <110 bpm (may indicate cord compression or fetal distress).",
    category: "Fetal Monitoring",
    difficulty: 1
  },
  {
    id: "ld-q4",
    type: "question",
    question: "A client at 38 weeks gestation presents with painless, bright red vaginal bleeding. What is the most likely diagnosis?",
    options: ["Placental abruption", "Placenta previa", "Bloody show", "Uterine rupture"],
    correctIndex: 1,
    answer: "Placenta previa presents with painless, bright red vaginal bleeding. The placenta implants over or near the cervical os. NEVER perform a digital cervical exam. Diagnosis is confirmed by ultrasound.",
    category: "Antepartum Complications",
    difficulty: 2
  },
  {
    id: "ld-q5",
    type: "question",
    question: "What medication is given to prevent neonatal respiratory distress syndrome in preterm labor between 24-34 weeks?",
    options: ["Magnesium sulfate", "Betamethasone", "Terbutaline", "Oxytocin"],
    correctIndex: 1,
    answer: "Betamethasone (a corticosteroid) is given IM to accelerate fetal lung maturity by stimulating surfactant production. Two doses are given 24 hours apart. Maximum benefit occurs 48 hours after the first dose.",
    category: "OB Pharmacology",
    difficulty: 2
  },
  {
    id: "ld-q6",
    type: "question",
    question: "During labor, the nurse notes the umbilical cord protruding from the vagina. What is the priority action?",
    options: ["Push the cord back into the vagina", "Place the client in Trendelenburg or knee-chest position", "Clamp and cut the cord", "Begin oxytocin infusion"],
    correctIndex: 1,
    answer: "Umbilical cord prolapse requires immediate positioning (Trendelenburg or knee-chest) to relieve pressure on the cord. Apply a sterile saline-soaked gloved hand to hold the presenting part off the cord. Prepare for emergent cesarean delivery.",
    category: "Intrapartum Emergencies",
    difficulty: 3
  },
  {
    id: "ld-q7",
    type: "question",
    question: "What does a Bishop score assess?",
    options: ["Fetal well-being", "Maternal readiness for labor induction", "Postpartum hemorrhage risk", "Gestational age"],
    correctIndex: 1,
    answer: "The Bishop score evaluates cervical readiness for induction by assessing dilation, effacement, station, consistency, and position. A score ≥8 indicates a favorable cervix with high likelihood of successful induction.",
    category: "Intrapartum Assessment",
    difficulty: 2
  },
  {
    id: "ld-q8",
    type: "question",
    question: "A client receiving oxytocin for labor augmentation develops contractions lasting 90 seconds with only 30 seconds of rest between them. What should the nurse do first?",
    options: ["Increase the oxytocin rate", "Stop the oxytocin infusion", "Administer terbutaline", "Perform an amniotomy"],
    correctIndex: 1,
    answer: "Tachysystole (contractions >5 in 10 minutes or lasting >90 seconds) requires stopping oxytocin immediately. Position the client on her left side, administer oxygen, and increase IV fluids. Notify the provider.",
    category: "OB Pharmacology",
    difficulty: 2
  },
  {
    id: "ld-q9",
    type: "question",
    question: "What is the antidote for magnesium sulfate toxicity?",
    options: ["Naloxone", "Calcium gluconate", "Protamine sulfate", "Vitamin K"],
    correctIndex: 1,
    answer: "Calcium gluconate 10% IV is the antidote for magnesium sulfate toxicity. Signs of toxicity include loss of deep tendon reflexes, respiratory depression (<12/min), urine output <30 mL/hr, and cardiac arrest. Keep calcium gluconate at the bedside during MgSO4 infusion.",
    category: "OB Pharmacology",
    difficulty: 2
  },
  {
    id: "ld-q10",
    type: "question",
    question: "A client at 34 weeks gestation has a blood pressure of 160/110 mmHg, proteinuria 3+, and reports a severe headache. What is the priority concern?",
    options: ["Gestational hypertension", "Chronic hypertension", "Preeclampsia with severe features", "Eclampsia"],
    correctIndex: 2,
    answer: "Preeclampsia with severe features is diagnosed with BP ≥160/110 on two occasions, proteinuria, and symptoms such as severe headache, visual disturbances, or epigastric pain. This requires immediate intervention including magnesium sulfate for seizure prophylaxis.",
    category: "Antepartum Complications",
    difficulty: 3
  },
  {
    id: "ld-q11",
    type: "term",
    question: "What is the definition of a term pregnancy?",
    answer: "A term pregnancy is between 37 0/7 weeks and 41 6/7 weeks of gestation. Early term is 37 0/7 to 38 6/7, full term is 39 0/7 to 40 6/7, and late term is 41 0/7 to 41 6/7 weeks.",
    category: "Antepartum",
    difficulty: 1
  },
  {
    id: "ld-q12",
    type: "question",
    question: "Which Leopold maneuver determines fetal presentation?",
    options: ["First maneuver", "Second maneuver", "Third maneuver", "Fourth maneuver"],
    correctIndex: 0,
    answer: "The first Leopold maneuver (fundal grip) determines what occupies the fundus. If the buttocks are in the fundus, the presentation is cephalic (head down). If the head is in the fundus, the presentation is breech.",
    category: "Intrapartum Assessment",
    difficulty: 2
  },
  {
    id: "ld-q13",
    type: "question",
    question: "A laboring client's amniotic fluid is green-tinged. What does this indicate?",
    options: ["Normal amniotic fluid", "Meconium-stained fluid", "Blood-tinged fluid", "Infection"],
    correctIndex: 1,
    answer: "Green-tinged amniotic fluid indicates meconium staining, which means the fetus has passed stool in utero. This is associated with fetal distress. The neonatal team should be present at delivery for potential meconium aspiration syndrome.",
    category: "Intrapartum Complications",
    difficulty: 2
  },
  {
    id: "ld-q14",
    type: "question",
    question: "What is the recommended fetal position for optimal labor progress?",
    options: ["Occiput posterior (OP)", "Occiput anterior (OA)", "Occiput transverse (OT)", "Brow presentation"],
    correctIndex: 1,
    answer: "Occiput anterior (OA) is the optimal fetal position for vaginal delivery. The fetal occiput faces the maternal pubic symphysis, allowing the smallest diameter of the head to pass through the pelvis. OP position causes back labor and prolonged labor.",
    category: "Intrapartum",
    difficulty: 2
  },
  {
    id: "ld-q15",
    type: "question",
    question: "During electronic fetal monitoring, what do early decelerations indicate?",
    options: ["Uteroplacental insufficiency", "Head compression", "Cord compression", "Fetal hypoxia"],
    correctIndex: 1,
    answer: "Early decelerations mirror contractions (onset, nadir, and recovery correspond with contractions) and are caused by fetal head compression during descent. They are benign and require no intervention.",
    category: "Fetal Monitoring",
    difficulty: 1
  },
  {
    id: "ld-q16",
    type: "question",
    question: "A client in labor has a cervical dilation of 10 cm but does not feel the urge to push. What stage of labor has she entered?",
    options: ["First stage - active phase", "First stage - transition", "Second stage", "Third stage"],
    correctIndex: 2,
    answer: "The second stage of labor begins at complete cervical dilation (10 cm) and ends with the birth of the baby. Laboring down (resting at complete dilation without pushing) may be appropriate, especially with epidural anesthesia.",
    category: "Stages of Labor",
    difficulty: 1
  },
  {
    id: "ld-q17",
    type: "question",
    question: "What is the most common cause of postpartum hemorrhage?",
    options: ["Cervical lacerations", "Uterine atony", "Retained placenta", "Coagulation disorders"],
    correctIndex: 1,
    answer: "Uterine atony (failure of the uterus to contract after delivery) accounts for approximately 80% of postpartum hemorrhages. Risk factors include overdistended uterus, prolonged labor, magnesium sulfate use, and grand multiparity. First intervention: fundal massage.",
    category: "Postpartum Complications",
    difficulty: 2
  },
  {
    id: "ld-q18",
    type: "question",
    question: "Which assessment finding after amniotomy requires immediate nursing action?",
    options: ["Clear amniotic fluid", "Fetal heart rate of 150 bpm", "Fetal heart rate deceleration to 80 bpm", "Mild increase in contraction frequency"],
    correctIndex: 2,
    answer: "A sudden fetal heart rate deceleration to 80 bpm after amniotomy suggests cord prolapse or cord compression. Immediately assess for a visible or palpable cord, position the client in Trendelenburg, and notify the provider.",
    category: "Intrapartum Emergencies",
    difficulty: 3
  },
  {
    id: "ld-q19",
    type: "question",
    question: "A pregnant client at 28 weeks is Rh-negative. When should she receive RhoGAM?",
    options: ["At 20 weeks only", "At 28 weeks and within 72 hours postpartum if the infant is Rh-positive", "Only after delivery", "At every prenatal visit"],
    correctIndex: 1,
    answer: "RhoGAM (Rh immune globulin) is given at 28 weeks gestation and within 72 hours after delivery if the newborn is Rh-positive. It prevents maternal sensitization and hemolytic disease of the newborn in subsequent pregnancies.",
    category: "Antepartum",
    difficulty: 2
  },
  {
    id: "ld-q20",
    type: "question",
    question: "What is the primary purpose of a nonstress test (NST)?",
    options: ["Assess cervical dilation", "Evaluate fetal heart rate response to fetal movement", "Determine fetal lung maturity", "Measure amniotic fluid volume"],
    correctIndex: 1,
    answer: "A nonstress test evaluates fetal well-being by monitoring the fetal heart rate in response to fetal movement. A reactive (normal) NST shows 2 or more accelerations of ≥15 bpm lasting ≥15 seconds in a 20-minute period.",
    category: "Antepartum Testing",
    difficulty: 1
  },
  {
    id: "ld-q21",
    type: "question",
    question: "During a contraction stress test, late decelerations are noted with most contractions. How is this result interpreted?",
    options: ["Negative - reassuring", "Positive - non-reassuring", "Equivocal - needs repeat", "Unsatisfactory"],
    correctIndex: 1,
    answer: "A positive contraction stress test (late decelerations with ≥50% of contractions) is non-reassuring and indicates uteroplacental insufficiency. Further evaluation is needed, and delivery may be indicated.",
    category: "Antepartum Testing",
    difficulty: 3
  },
  {
    id: "ld-q22",
    type: "term",
    question: "Define gravida and para (GTPAL).",
    answer: "Gravida = total number of pregnancies. Para uses TPAL: T = term deliveries (≥37 weeks), P = preterm deliveries (20-36 weeks), A = abortions/miscarriages (<20 weeks), L = living children. Example: G3P1011 = 3 pregnancies, 1 term, 0 preterm, 1 abortion, 1 living child.",
    category: "Obstetric Terminology",
    difficulty: 1
  },
  {
    id: "ld-q23",
    type: "question",
    question: "A client is prescribed misoprostol (Cytotec) for cervical ripening. What is a contraindication for this medication?",
    options: ["Nulliparity", "Post-dates pregnancy", "Previous cesarean delivery", "Gestational age >39 weeks"],
    correctIndex: 2,
    answer: "Misoprostol is contraindicated in clients with a previous cesarean delivery or uterine surgery due to the risk of uterine rupture. Dinoprostone (Cervidil) or a mechanical cervical ripening method (Foley balloon) may be safer alternatives.",
    category: "OB Pharmacology",
    difficulty: 2
  },
  {
    id: "ld-q24",
    type: "question",
    question: "What are the signs of placental separation during the third stage of labor?",
    options: ["Decreased maternal blood pressure", "Sudden gush of blood, lengthening of the umbilical cord, and globular uterine shape", "Fetal heart rate decelerations", "Maternal bradycardia"],
    correctIndex: 1,
    answer: "Signs of placental separation include: sudden gush of dark blood, lengthening of the umbilical cord at the introitus, the uterus rising in the abdomen and becoming firm and globular (Schultze mechanism), and a brief increase in vaginal bleeding.",
    category: "Intrapartum",
    difficulty: 2
  },
  {
    id: "ld-q25",
    type: "question",
    question: "A client at 32 weeks gestation presents with dark red vaginal bleeding, a rigid boardlike abdomen, and severe abdominal pain. What is the most likely diagnosis?",
    options: ["Placenta previa", "Placental abruption", "Uterine rupture", "Ectopic pregnancy"],
    correctIndex: 1,
    answer: "Placental abruption presents with painful, dark red vaginal bleeding (may be concealed), rigid boardlike abdomen, and uterine tenderness. It is a medical emergency. Risk factors include hypertension, trauma, cocaine use, and advanced maternal age.",
    category: "Antepartum Complications",
    difficulty: 2
  },
  {
    id: "ld-q26",
    type: "question",
    question: "What is the recommended initial dose and titration for oxytocin (Pitocin) induction?",
    options: ["Start at 10 mU/min, increase by 5 mU every 15 min", "Start at 0.5-2 mU/min, increase by 1-2 mU every 30-60 min", "Start at 20 mU/min, increase by 10 mU every 10 min", "Start at 5 mU/min, increase by 5 mU every 5 min"],
    correctIndex: 1,
    answer: "Oxytocin is started at 0.5-2 mU/min and increased by 1-2 mU/min every 30-60 minutes until adequate contractions are achieved (typically 3-5 contractions in 10 minutes). It must be administered via infusion pump with continuous fetal monitoring.",
    category: "OB Pharmacology",
    difficulty: 2
  },
  {
    id: "ld-q27",
    type: "question",
    question: "A client reports her 'water broke' at home. What should the nurse assess first upon arrival to the hospital?",
    options: ["Cervical dilation", "Fetal heart rate", "Maternal blood pressure", "Contraction frequency"],
    correctIndex: 1,
    answer: "After spontaneous rupture of membranes (SROM), the priority is assessing fetal heart rate to rule out cord prolapse or compression. Document the color, odor, amount, and time of rupture. Nitrazine (turns blue) and ferning tests confirm amniotic fluid.",
    category: "Intrapartum Assessment",
    difficulty: 2
  },
  {
    id: "ld-q28",
    type: "question",
    question: "What is the purpose of amnioinfusion during labor?",
    options: ["To induce labor", "To replace amniotic fluid and cushion the umbilical cord", "To assess fetal lung maturity", "To administer antibiotics"],
    correctIndex: 1,
    answer: "Amnioinfusion involves infusing warmed normal saline into the uterine cavity through an intrauterine pressure catheter (IUPC). It is used to relieve variable decelerations caused by cord compression and to dilute meconium-stained fluid.",
    category: "Intrapartum Interventions",
    difficulty: 2
  },
  {
    id: "ld-q29",
    type: "question",
    question: "A multipara client in active labor suddenly reports sharp, tearing abdominal pain. Her contractions stop and she shows signs of shock. What is the most likely complication?",
    options: ["Placental abruption", "Uterine rupture", "Amniotic fluid embolism", "Cervical laceration"],
    correctIndex: 1,
    answer: "Uterine rupture presents with sudden sharp tearing pain, cessation of contractions, signs of shock (tachycardia, hypotension), change in abdominal contour, and fetal distress. Risk factors include previous uterine surgery, grand multiparity, and oxytocin use. Requires emergent surgery.",
    category: "Intrapartum Emergencies",
    difficulty: 3
  },
  {
    id: "ld-q30",
    type: "question",
    question: "What does moderate variability in fetal heart rate indicate?",
    options: ["Fetal sleep cycle", "Adequate fetal oxygenation and intact autonomic nervous system", "Fetal distress", "Cord compression"],
    correctIndex: 1,
    answer: "Moderate variability (6-25 bpm fluctuation from baseline) is the most reassuring sign of fetal well-being, indicating an intact autonomic nervous system with adequate oxygenation. Absent variability (<2 bpm) is the most concerning finding.",
    category: "Fetal Monitoring",
    difficulty: 1
  },
  {
    id: "ld-q31",
    type: "question",
    question: "A client with preeclampsia is receiving magnesium sulfate. Which finding requires the nurse to hold the infusion?",
    options: ["Blood pressure 140/90", "Urine output 60 mL/hr", "Respiratory rate of 10 breaths/min", "Deep tendon reflexes 2+"],
    correctIndex: 2,
    answer: "A respiratory rate <12 breaths/min indicates magnesium toxicity. Hold the infusion, notify the provider, and have calcium gluconate available. Normal MgSO4 monitoring: respirations ≥12/min, DTRs present, urine output ≥30 mL/hr.",
    category: "OB Pharmacology",
    difficulty: 2
  },
  {
    id: "ld-q32",
    type: "question",
    question: "What is the purpose of the biophysical profile (BPP)?",
    options: ["Assess maternal fitness for delivery", "Evaluate five parameters of fetal well-being", "Determine the baby's sex", "Measure cervical length"],
    correctIndex: 1,
    answer: "The BPP evaluates 5 parameters: fetal breathing movements, gross body movements, fetal tone, amniotic fluid volume (AFI), and reactive NST. Each scored 0 or 2 (max 10). Score 8-10 is normal; ≤4 may require delivery.",
    category: "Antepartum Testing",
    difficulty: 2
  },
  {
    id: "ld-q33",
    type: "question",
    question: "A client is 3 cm dilated with intact membranes and contractions every 8 minutes. She asks to walk. What is the best nursing response?",
    options: ["Walking is not allowed during labor", "Walking is encouraged during the latent phase to promote labor progress", "She must remain on continuous monitoring", "Walking is only safe in the second stage"],
    correctIndex: 1,
    answer: "Ambulation during the latent phase of labor is encouraged to promote labor progress through gravity and pelvic movement. Intermittent monitoring (every 30 minutes in low-risk labor) is appropriate. Walking may help reduce pain perception.",
    category: "Intrapartum",
    difficulty: 1
  },
  {
    id: "ld-q34",
    type: "question",
    question: "What is shoulder dystocia and what is the primary nursing intervention?",
    options: ["Breech presentation; external cephalic version", "Anterior shoulder impacted behind pubic symphysis; McRoberts maneuver", "Posterior shoulder stuck; fundal pressure", "Cord around neck; amniotomy"],
    correctIndex: 1,
    answer: "Shoulder dystocia occurs when the anterior fetal shoulder impacts behind the maternal pubic symphysis after delivery of the head. McRoberts maneuver (hyperflexion of maternal thighs) is the first intervention. NEVER apply fundal pressure. Suprapubic pressure may be applied.",
    category: "Intrapartum Emergencies",
    difficulty: 3
  },
  {
    id: "ld-q35",
    type: "question",
    question: "What is the lecithin/sphingomyelin (L/S) ratio that indicates fetal lung maturity?",
    options: ["1:1", "1.5:1", "2:1 or greater", "3:1"],
    correctIndex: 2,
    answer: "An L/S ratio of 2:1 or greater indicates fetal lung maturity with adequate surfactant production. This test is performed on amniotic fluid obtained via amniocentesis. The presence of phosphatidylglycerol (PG) further confirms lung maturity.",
    category: "Antepartum Testing",
    difficulty: 2
  },
  {
    id: "ld-q36",
    type: "question",
    question: "A pregnant client at 16 weeks gestation has an elevated maternal serum alpha-fetoprotein (MSAFP). What might this indicate?",
    options: ["Down syndrome", "Neural tube defect", "Gestational diabetes", "Preeclampsia"],
    correctIndex: 1,
    answer: "Elevated MSAFP may indicate neural tube defects (spina bifida, anencephaly), abdominal wall defects, or multiple gestation. Low MSAFP may indicate Down syndrome (trisomy 21) or trisomy 18. Follow-up with ultrasound and possibly amniocentesis.",
    category: "Antepartum Testing",
    difficulty: 2
  },
  {
    id: "ld-q37",
    type: "question",
    question: "What is the expected duration of the third stage of labor?",
    options: ["5-30 minutes", "1-2 hours", "30-60 minutes", "Less than 5 minutes"],
    correctIndex: 0,
    answer: "The third stage (placental delivery) normally lasts 5-30 minutes. If the placenta has not delivered within 30 minutes, it is considered retained. Manual removal or surgical intervention may be needed. Retained placenta is a cause of postpartum hemorrhage.",
    category: "Stages of Labor",
    difficulty: 1
  },
  {
    id: "ld-q38",
    type: "question",
    question: "A client receiving epidural anesthesia suddenly develops hypotension. What is the first nursing action?",
    options: ["Administer epinephrine", "Position the client on her left side and increase IV fluids", "Remove the epidural catheter", "Administer oxygen by face mask"],
    correctIndex: 1,
    answer: "Epidural-induced hypotension is managed by left lateral positioning to prevent vena cava compression and bolus IV fluid administration. A preload of 500-1000 mL IV fluid is typically given before epidural placement to prevent hypotension. Ephedrine may be given if fluids and positioning are ineffective.",
    category: "Intrapartum Interventions",
    difficulty: 2
  },
  {
    id: "ld-q39",
    type: "question",
    question: "What is the hallmark sign of amniotic fluid embolism?",
    options: ["Gradual onset of dyspnea", "Sudden cardiovascular collapse with DIC", "Slow-rising blood pressure", "Gradual decrease in fetal heart rate"],
    correctIndex: 1,
    answer: "Amniotic fluid embolism (AFE) presents with sudden onset of respiratory distress, cardiovascular collapse, hypotension, hypoxia, and DIC (disseminated intravascular coagulation). It typically occurs during or shortly after delivery and has a high mortality rate.",
    category: "Intrapartum Emergencies",
    difficulty: 3
  },
  {
    id: "ld-q40",
    type: "question",
    question: "Which client is a candidate for vaginal birth after cesarean (VBAC)?",
    options: ["Client with a previous classical (vertical) uterine incision", "Client with a previous low transverse uterine incision", "Client with a previous uterine rupture", "Client with placenta previa"],
    correctIndex: 1,
    answer: "Clients with a previous low transverse uterine incision are candidates for VBAC (trial of labor after cesarean - TOLAC). A classical vertical incision has a much higher risk of uterine rupture. The facility must be capable of emergent cesarean delivery.",
    category: "Intrapartum",
    difficulty: 2
  },
  {
    id: "ld-q41",
    type: "question",
    question: "What is the normal amniotic fluid index (AFI) at term?",
    options: ["2-4 cm", "5-25 cm", "30-40 cm", "1-2 cm"],
    correctIndex: 1,
    answer: "Normal AFI is 5-25 cm. Oligohydramnios (AFI <5 cm) may indicate renal abnormalities, IUGR, or post-term pregnancy. Polyhydramnios (AFI >25 cm) may indicate GI obstruction, neural tube defects, or gestational diabetes.",
    category: "Antepartum Assessment",
    difficulty: 2
  },
  {
    id: "ld-q42",
    type: "question",
    question: "A laboring client has a temperature of 38.5°C and foul-smelling amniotic fluid. What is the most likely diagnosis?",
    options: ["Normal labor", "Chorioamnionitis", "Preeclampsia", "Gestational diabetes"],
    correctIndex: 1,
    answer: "Chorioamnionitis (intra-amniotic infection) presents with maternal fever ≥38°C, foul-smelling amniotic fluid, maternal and fetal tachycardia, and uterine tenderness. Treatment includes IV antibiotics and expedited delivery. It is a leading cause of neonatal sepsis.",
    category: "Intrapartum Complications",
    difficulty: 2
  },
  {
    id: "ld-q43",
    type: "term",
    question: "What is Naegele's rule for calculating the estimated due date?",
    answer: "Naegele's rule: Take the first day of the last menstrual period (LMP), subtract 3 months, and add 7 days. Example: LMP January 15 → EDD = October 22. This assumes a regular 28-day menstrual cycle.",
    category: "Antepartum",
    difficulty: 1
  },
  {
    id: "ld-q44",
    type: "question",
    question: "A laboring client has contractions every 2 minutes lasting 60 seconds. She is irritable, nauseous, and reports intense rectal pressure. What phase is she in?",
    options: ["Latent phase", "Active phase", "Transition phase", "Second stage"],
    correctIndex: 2,
    answer: "Transition phase (8-10 cm) is characterized by intense contractions every 1.5-2 minutes lasting 60-90 seconds, nausea/vomiting, irritability, rectal pressure, and an overwhelming urge to push. This is the shortest but most intense phase of labor.",
    category: "Stages of Labor",
    difficulty: 1
  },
  {
    id: "ld-q45",
    type: "question",
    question: "What is the role of prostaglandin E2 (dinoprostone/Cervidil) in labor?",
    options: ["Pain management", "Cervical ripening", "Uterine relaxation", "Fetal lung maturation"],
    correctIndex: 1,
    answer: "Dinoprostone (Cervidil) is a prostaglandin E2 analogue used for cervical ripening before induction. It softens and thins the cervix. The vaginal insert can be removed if hyperstimulation occurs. It should not be used with asthma.",
    category: "OB Pharmacology",
    difficulty: 1
  },
  {
    id: "ld-q46",
    type: "question",
    question: "A client at 26 weeks gestation presents with regular contractions and cervical change. She is diagnosed with preterm labor. What tocolytic may be used?",
    options: ["Oxytocin", "Nifedipine", "Misoprostol", "Methylergonovine"],
    correctIndex: 1,
    answer: "Nifedipine (a calcium channel blocker) is commonly used as a tocolytic to inhibit uterine contractions in preterm labor. Other tocolytics include indomethacin (<32 weeks) and magnesium sulfate. The goal is to delay delivery 48 hours for corticosteroid administration.",
    category: "OB Pharmacology",
    difficulty: 2
  },
  {
    id: "ld-q47",
    type: "question",
    question: "Which fetal heart rate pattern is associated with cord compression?",
    options: ["Early decelerations", "Late decelerations", "Variable decelerations", "Sinusoidal pattern"],
    correctIndex: 2,
    answer: "Variable decelerations are abrupt drops in FHR (≥15 bpm below baseline lasting ≥15 seconds but <2 minutes) caused by umbilical cord compression. They vary in shape, timing, and duration. Nursing interventions: reposition, amnioinfusion if recurrent.",
    category: "Fetal Monitoring",
    difficulty: 2
  },
  {
    id: "ld-q48",
    type: "question",
    question: "What is the significance of a sinusoidal fetal heart rate pattern?",
    options: ["Normal variation", "Fetal sleep", "Severe fetal anemia or hypoxia", "Maternal medication effect"],
    correctIndex: 2,
    answer: "A sinusoidal pattern (smooth, undulating sine wave with fixed periodicity, absent variability) is a Category III tracing indicating severe fetal anemia (Rh isoimmunization, fetomaternal hemorrhage), chronic hypoxia, or fetal distress. Requires immediate intervention and possible emergent delivery.",
    category: "Fetal Monitoring",
    difficulty: 3
  },
  {
    id: "ld-q49",
    type: "question",
    question: "A pregnant client is Group B Streptococcus (GBS) positive. When should prophylactic antibiotics be administered?",
    options: ["At 36 weeks gestation", "When labor begins or membranes rupture", "Immediately after delivery", "At the first prenatal visit"],
    correctIndex: 1,
    answer: "GBS-positive clients receive IV penicillin (or ampicillin) when labor begins or membranes rupture. Ideally administered ≥4 hours before delivery for adequate prophylaxis. If penicillin-allergic, clindamycin or vancomycin may be used based on sensitivity.",
    category: "Intrapartum Interventions",
    difficulty: 2
  },
  {
    id: "ld-q50",
    type: "question",
    question: "What position should a laboring client avoid, and why?",
    options: ["Left lateral - decreases blood flow", "Supine - causes vena cava compression", "Semi-Fowler's - increases intracranial pressure", "Trendelenburg - causes aspiration"],
    correctIndex: 1,
    answer: "Supine position should be avoided because the gravid uterus compresses the inferior vena cava (supine hypotensive syndrome), reducing venous return, cardiac output, and uteroplacental perfusion. Position the client on her left side or with a wedge under her right hip.",
    category: "Intrapartum",
    difficulty: 1
  },
  {
    id: "ld-q51",
    type: "question",
    question: "What are the expected contraction characteristics during active labor?",
    options: ["Every 10-20 minutes, mild intensity", "Every 2-5 minutes, lasting 45-60 seconds, moderate to strong", "Every 1-2 minutes, lasting 90 seconds", "Irregular timing, mild to moderate"],
    correctIndex: 1,
    answer: "Active labor contractions occur every 2-5 minutes, last 45-60 seconds, and are moderate to strong in intensity. Cervical dilation progresses at approximately 1.2 cm/hr in nulliparas and 1.5 cm/hr in multiparas (though newer data suggests slower rates may be normal).",
    category: "Stages of Labor",
    difficulty: 1
  },
  {
    id: "ld-q52",
    type: "question",
    question: "A client at 41 weeks gestation is scheduled for induction. What test confirms fetal lung maturity if needed?",
    options: ["Biophysical profile", "Amniocentesis for L/S ratio and PG", "Nonstress test", "Contraction stress test"],
    correctIndex: 1,
    answer: "Amniocentesis can evaluate fetal lung maturity via L/S ratio (≥2:1 is mature) and presence of phosphatidylglycerol (PG). At 41 weeks, lung maturity is generally assumed. Fetal lung maturity testing is more relevant for early term or preterm deliveries.",
    category: "Antepartum Testing",
    difficulty: 2
  },
  {
    id: "ld-q53",
    type: "question",
    question: "What is the purpose of an episiotomy?",
    options: ["To speed up first stage of labor", "To enlarge the vaginal opening to facilitate delivery", "To prevent cesarean delivery", "To reduce postpartum bleeding"],
    correctIndex: 1,
    answer: "An episiotomy is a surgical incision in the perineum to enlarge the vaginal opening during delivery. It may be mediolateral or midline. Current evidence does not support routine episiotomy; it is reserved for situations like shoulder dystocia or fetal distress.",
    category: "Intrapartum Interventions",
    difficulty: 1
  },
  {
    id: "ld-q54",
    type: "question",
    question: "A client at 35 weeks gestation has a fetal fibronectin (fFN) test that is negative. What does this indicate?",
    options: ["High risk for preterm delivery within 2 weeks", "Low risk for preterm delivery within 2 weeks", "Fetal lung immaturity", "Cervical infection"],
    correctIndex: 1,
    answer: "A negative fetal fibronectin test has a >99% negative predictive value, meaning delivery within the next 2 weeks is very unlikely. A positive result is less specific. fFN is a protein found between the chorion and decidua; its presence in vaginal secretions after 22 weeks may indicate preterm labor risk.",
    category: "Antepartum Testing",
    difficulty: 2
  },
  {
    id: "ld-q55",
    type: "term",
    question: "What are the cardinal movements of labor?",
    answer: "The cardinal movements (mechanisms of labor) are: 1) Engagement, 2) Descent, 3) Flexion, 4) Internal rotation, 5) Extension, 6) External rotation (restitution), 7) Expulsion. These describe how the fetus navigates through the maternal pelvis during delivery.",
    category: "Intrapartum",
    difficulty: 2
  },
  {
    id: "ld-q56",
    type: "question",
    question: "What is the priority nursing intervention for a client with eclamptic seizure?",
    options: ["Insert an oral airway during the seizure", "Restrain the client", "Maintain airway, protect from injury, administer magnesium sulfate", "Immediately prepare for cesarean delivery"],
    correctIndex: 2,
    answer: "During an eclamptic seizure: maintain airway (turn to side), protect from injury, administer oxygen, and give magnesium sulfate IV loading dose (4-6g over 20-30 min) followed by maintenance infusion (1-2g/hr). Do NOT insert anything into the mouth during the seizure.",
    category: "Antepartum Emergencies",
    difficulty: 3
  },
  {
    id: "ld-q57",
    type: "question",
    question: "A client presents at 14 weeks with a uterine size consistent with 20 weeks, extremely elevated hCG levels, and grape-like vesicles on ultrasound. What is the diagnosis?",
    options: ["Twin pregnancy", "Hydatidiform mole (molar pregnancy)", "Ectopic pregnancy", "Placenta accreta"],
    correctIndex: 1,
    answer: "A hydatidiform mole (molar pregnancy) presents with abnormally elevated hCG, uterus larger than expected for gestational age, snowstorm or grape-like cluster appearance on ultrasound, and no fetal heart tones. Treatment is evacuation by suction curettage and hCG monitoring for 1 year.",
    category: "Antepartum Complications",
    difficulty: 2
  },
  {
    id: "ld-q58",
    type: "question",
    question: "What is the recommended frequency of fetal heart rate monitoring during active labor for a low-risk client?",
    options: ["Continuously", "Every 5 minutes", "Every 15-30 minutes", "Every hour"],
    correctIndex: 2,
    answer: "For low-risk clients in active labor, FHR should be auscultated every 15-30 minutes during the first stage and every 5-15 minutes during the second stage. High-risk clients require more frequent monitoring or continuous electronic fetal monitoring.",
    category: "Fetal Monitoring",
    difficulty: 1
  },
  {
    id: "ld-q59",
    type: "question",
    question: "A client has a cervical cerclage in place. At what gestational age is it typically removed?",
    options: ["34-35 weeks", "36-37 weeks", "38-39 weeks", "At the onset of labor"],
    correctIndex: 1,
    answer: "A cervical cerclage (McDonald or Shirodkar) is placed for cervical insufficiency and is typically removed at 36-37 weeks gestation. If preterm labor occurs before removal, an emergent cerclage removal is performed to prevent cervical laceration.",
    category: "Antepartum Interventions",
    difficulty: 2
  },
  {
    id: "ld-q60",
    type: "question",
    question: "What is the Montevideo unit (MVU) and what value indicates adequate labor?",
    options: ["Fetal heart rate measurement; >100 bpm", "Contraction intensity measurement; >200 MVU", "Cervical dilation rate; >1 cm/hr", "Amniotic fluid measurement; >10 cm"],
    correctIndex: 1,
    answer: "Montevideo units measure contraction adequacy by summing the peak intensity minus baseline of all contractions in a 10-minute window (measured via IUPC). Adequate labor is generally ≥200 MVU. If contractions are inadequate, oxytocin augmentation may be indicated.",
    category: "Intrapartum Assessment",
    difficulty: 3
  }
];
