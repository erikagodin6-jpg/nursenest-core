import type { LessonContent } from "./types";

export const obMedicationsLessons: Record<string, LessonContent> = {
  "betamethasone-dexamethasone": {
    title: "Antenatal Corticosteroids (Betamethasone",
    cellular: {
      title: "Mechanism of Action & Fetal Lung Maturity",
      content: "Antenatal corticosteroids such as betamethasone and dexamethasone are synthetic glucocorticoids administered to pregnant individuals at risk for preterm delivery between 24 and 34 weeks of gestation. These medications cross the placental barrier and bind to glucocorticoid receptors within the fetal lung tissue, specifically targeting type II pneumocytes. This receptor activation stimulates the production and release of pulmonary surfactant, a phospholipid-protein complex that reduces alveolar surface tension and prevents alveolar collapse during expiration. Without adequate surfactant, premature neonates develop respiratory distress syndrome (RDS), a leading cause of neonatal morbidity and mortality.\n\nAt the cellular level, corticosteroids accelerate the structural maturation of the fetal lungs by promoting thinning of the alveolar septa, increasing the number of type II pneumocytes, and enhancing the synthesis of surfactant proteins (SP-A, SP-B, SP-C, SP-D). The medications also promote fluid reabsorption from the fetal lung through upregulation of epithelial sodium channels, facilitating the transition from fluid-filled to air-filled lungs at birth. Additionally, antenatal corticosteroids reduce the incidence of intraventricular hemorrhage (IVH), necrotizing enterocolitis (NEC), and neonatal death when administered within the optimal therapeutic window.\n\nBetamethasone is typically administered as two intramuscular (IM) injections of 12 mg given 24 hours apart, while dexamethasone is given as four IM injections of 6 mg every 12 hours. Maximum benefit is achieved between 24 hours and 7 days after the first dose. A single rescue course may be considered if the initial course was given more than 14 days prior and delivery remains imminent before 34 weeks. Repeated courses beyond a single rescue are not recommended due to potential adverse effects on fetal brain growth and adrenal suppression."
    },
    riskFactors: [
      "Preterm labor between 24-34 weeks gestation",
      "Preterm premature rupture of membranes (PPROM)",
      "Placenta previa with anticipated preterm delivery",
      "Preeclampsia requiring early delivery",
      "Multiple gestation with threatened preterm birth",
      "Cervical insufficiency with cervical dilation",
      "History of prior preterm birth",
      "Maternal infection (chorioamnionitis) threatening preterm delivery"
    ],
    diagnostics: [
      "Gestational age confirmation via ultrasound dating",
      "Fetal fibronectin (fFN) testing for preterm labor risk",
      "Cervical length measurement via transvaginal ultrasound",
      "Lecithin-to-sphingomyelin (L/S) ratio for fetal lung maturity (if amniocentesis performed)",
      "Maternal blood glucose monitoring (corticosteroids cause transient hyperglycemia)",
      "Nonstress test (NST) to assess fetal well-being"
    ],
    management: [
      "Administer betamethasone 12 mg IM × 2 doses 24 hours apart as ordered",
      "Alternatively, administer dexamethasone 6 mg IM × 4 doses every 12 hours as ordered",
      "Monitor maternal blood glucose levels every 4-6 hours following administration",
      "Administer tocolytics as ordered to delay delivery for 48 hours to allow steroid effect",
      "Monitor for signs of maternal infection if membranes are ruptured",
      "Coordinate with neonatal team for anticipated preterm delivery"
    ],
    nursingActions: [
      "Verify gestational age prior to administration to ensure within recommended window",
      "Administer IM injection into deep gluteal muscle using Z-track technique",
      "Monitor maternal blood glucose levels and report hyperglycemia to the provider",
      "Educate the client about the purpose of the medication and expected timeline for benefit",
      "Document the time and date of each dose to track the optimal therapeutic window",
      "Monitor fetal heart rate pattern before and after administration",
      "Assess for signs of infection including maternal temperature, fetal tachycardia, and uterine tenderness"
    ],
    signs: {
      left: [
        "Expected maternal effects: transient hyperglycemia",
        "Mild injection site discomfort",
        "Temporary increase in white blood cell count (leukocytosis)"
      ],
      right: [
        "Maternal signs of infection: fever, tachycardia, purulent vaginal discharge",
        "Neonatal adrenal suppression with repeated courses",
        "Fetal growth restriction with excessive repeat dosing"
      ]
    },
    medications: [
      {
        name: "Betamethasone",
        type: "Synthetic Glucocorticoid",
        action: "Crosses placenta and stimulates type II pneumocyte surfactant production, accelerating fetal lung maturity and reducing risk of neonatal RDS",
        sideEffects: "Transient maternal hyperglycemia, leukocytosis, insomnia, injection site pain, decreased fetal movement for 24-48 hours",
        contra: "Active chorioamnionitis with plan for immediate delivery, systemic fungal infection, gestational age beyond 37 weeks",
        pearl: "Maximum benefit occurs 24 hours to 7 days after the first dose: time administration to optimize the therapeutic window before anticipated delivery"
      },
      {
        name: "Dexamethasone",
        type: "Synthetic Glucocorticoid",
        action: "Same mechanism as betamethasone; promotes surfactant production, lung structural maturation, and fluid reabsorption from fetal airways",
        sideEffects: "Maternal hyperglycemia, insomnia, immunosuppression, injection site pain, transient fetal heart rate changes",
        contra: "Active systemic infection, gestational age >37 weeks, known hypersensitivity to corticosteroids",
        pearl: "Given as 4 doses of 6 mg IM every 12 hours; shorter half-life than betamethasone so strict timing adherence is essential"
      }
    ],
    pearls: [
      "A single rescue course may be given if ≥14 days have passed since the initial course and delivery remains imminent before 34 weeks",
      "Corticosteroids cause a transient decrease in fetal movement and heart rate variability for 24-48 hours: this is expected and should not be confused with fetal distress",
      "Late preterm steroid administration (34-36+6 weeks) may be considered but carries a higher risk of neonatal hypoglycemia",
      "Betamethasone is generally preferred over dexamethasone due to its longer half-life and simpler dosing schedule"
    ],
    quiz: [
      {
        question: "A client at 29 weeks gestation is admitted with preterm contractions. Betamethasone 12 mg IM is administered. What is the priority nursing action following administration?",
        options: [
          "Monitor fetal heart rate continuously for 24 hours",
          "Monitor maternal blood glucose levels every 4-6 hours",
          "Restrict maternal fluid intake to 1000 mL/day",
          "Prepare for immediate cesarean delivery"
        ],
        correct: 1,
        rationale: "Corticosteroids cause transient maternal hyperglycemia. Monitoring blood glucose levels is a priority nursing action to detect and report significant elevations to the provider. Continuous FHR monitoring may be indicated but is not specific to corticosteroid administration."
      }
    ]
  },

  "opioid-analgesics-ob": {
    title: "Opioid Analgesics in Labor",
    cellular: {
      title: "Opioid Use in Labor: Pharmacology & Timing",
      content: "Opioid analgesics are systemic medications administered during labor to provide pain relief by binding to mu (μ), kappa (κ), and delta (δ) opioid receptors in the central nervous system. Common opioids used in obstetric settings include morphine, fentanyl, butorphanol (Stadol), and nalbuphine (Nubain). These medications reduce the perception of pain by inhibiting the transmission of nociceptive signals in the spinal cord and altering pain processing in the brain. They also produce sedation, anxiolysis, and euphoria, which can help the laboring client cope between contractions.\n\nTiming of administration is a critical consideration. Systemic opioids should ideally be administered during the active phase of labor (typically 4-7 cm dilation) and should be avoided within 1-2 hours of anticipated delivery. Administration too close to delivery increases the risk of neonatal respiratory depression because the medication crosses the placenta and affects the fetal central nervous system. If neonatal respiratory depression occurs, naloxone (Narcan) can be administered to the neonate to reverse opioid effects. The nurse must have naloxone readily available whenever opioids are administered during labor.\n\nButorphanol and nalbuphine are mixed agonist-antagonist opioids commonly used in labor because they provide adequate analgesia with a ceiling effect on respiratory depression, offering a slightly improved safety profile compared to pure agonists. However, these agents should not be administered to opioid-dependent clients, as the antagonist component can precipitate acute withdrawal. Fentanyl is favored for its rapid onset (2-3 minutes IV) and short duration (30-60 minutes), making it easier to titrate during the dynamic process of labor. Morphine has a slower onset and longer duration and is sometimes used in early or prodromal labor to promote rest."
    },
    riskFactors: [
      "Preterm labor (increased neonatal sensitivity to respiratory depression)",
      "History of substance use disorder",
      "Maternal respiratory conditions (asthma, obesity hypoventilation)",
      "Anticipated precipitous delivery (risk of administering too close to birth)",
      "Maternal hepatic or renal impairment (altered drug metabolism)",
      "Polyhydramnios or fetal compromise (reduced fetal drug tolerance)",
      "Multiple gestation with preterm risk",
      "Maternal use of other CNS depressants"
    ],
    diagnostics: [
      "Baseline maternal vital signs including respiratory rate, blood pressure, and oxygen saturation",
      "Fetal heart rate assessment and contraction pattern via electronic fetal monitoring (EFM)",
      "Cervical exam to determine stage of labor and estimate time to delivery",
      "Pain assessment using a validated scale",
      "Maternal urine drug screen if substance use history is suspected",
      "Assessment of maternal sedation level using standardized sedation scale"
    ],
    management: [
      "Administer opioid analgesics IV or IM as ordered during active labor",
      "Avoid administration within 1-2 hours of expected delivery to minimize neonatal respiratory depression",
      "Have naloxone (Narcan) readily available at the bedside for neonatal resuscitation",
      "Position client on side (lateral position) to prevent supine hypotension and optimize placental perfusion",
      "Administer antiemetics (ondansetron, promethazine) as ordered for opioid-induced nausea",
      "Monitor maternal and fetal status continuously during and after administration"
    ],
    nursingActions: [
      "Assess maternal vital signs (especially respiratory rate and O2 saturation) every 5 minutes for 15 minutes after IV administration",
      "Monitor fetal heart rate tracing for decreased variability or decelerations following administration",
      "Raise side rails and ensure call light is within reach due to sedation risk",
      "Document time of administration relative to expected delivery time",
      "Report respiratory rate <12 breaths/min or oxygen saturation <95% to the provider immediately",
      "Assess for urinary retention, as opioids can decrease bladder tone"
    ],
    signs: {
      left: [
        "Therapeutic effects: reduced pain perception, relaxation between contractions, ability to rest",
        "Mild sedation and drowsiness",
        "Decreased anxiety and improved coping"
      ],
      right: [
        "Maternal respiratory depression (RR <12), hypotension, excessive sedation",
        "Neonatal respiratory depression: poor cry, weak respirations, low Apgar scores",
        "Nausea, vomiting, pruritus, urinary retention"
      ]
    },
    medications: [
      {
        name: "Fentanyl (IV/IM)",
        type: "Pure Opioid Agonist",
        action: "Binds to mu opioid receptors in the CNS to produce rapid-onset analgesia; short duration allows easier titration during labor",
        sideEffects: "Respiratory depression, nausea, pruritus, dizziness, neonatal respiratory depression if given close to delivery",
        contra: "Known hypersensitivity, severe respiratory depression, use within 1 hour of anticipated delivery",
        pearl: "Onset is 2-3 minutes IV with duration of 30-60 minutes: ideal for titration during active labor; always have naloxone at bedside"
      },
      {
        name: "Butorphanol (Stadol)",
        type: "Mixed Agonist-Antagonist Opioid",
        action: "Provides analgesia via kappa receptor agonism with partial mu antagonism; ceiling effect on respiratory depression improves safety profile",
        sideEffects: "Sedation, dizziness, nausea, diaphoresis, transient sinusoidal-like fetal heart rate pattern",
        contra: "Opioid-dependent clients (may precipitate withdrawal), severe respiratory depression, administration close to delivery",
        pearl: "Do NOT administer to opioid-dependent clients: the antagonist component can trigger acute withdrawal syndrome"
      }
    ],
    pearls: [
      "Time opioid administration carefully: avoid giving within 1-2 hours of anticipated delivery to reduce neonatal respiratory depression risk",
      "Butorphanol may cause a transient sinusoidal-like FHR pattern that should not be confused with true sinusoidal pattern indicating fetal anemia",
      "Naloxone reverses opioid effects in the neonate but has a shorter half-life than most opioids: monitor for re-sedation",
      "Mixed agonist-antagonists (butorphanol, nalbuphine) should never be given to opioid-dependent clients as they precipitate withdrawal"
    ],
    quiz: [
      {
        question: "A laboring client received butorphanol (Stadol) 1 mg IV 30 minutes ago and is now 9 cm dilated with rapid progression. The neonate is delivered with weak respiratory effort. What is the priority nursing action?",
        options: [
          "Administer naloxone (Narcan) to the neonate as ordered",
          "Suction the neonate aggressively to stimulate breathing",
          "Place the neonate skin-to-skin to promote warmth",
          "Administer oxygen to the mother via nasal cannula"
        ],
        correct: 0,
        rationale: "Naloxone (Narcan) is the antidote for opioid-induced neonatal respiratory depression. The weak respiratory effort in the context of recent maternal opioid administration strongly suggests opioid effect on the neonate, making naloxone the priority intervention."
      }
    ]
  },

  "prostaglandins-ob": {
    title: "Prostaglandins for Cervical Ripening",
    cellular: {
      title: "Prostaglandin-Mediated Cervical Ripening",
      content: "Prostaglandins are naturally occurring lipid compounds derived from arachidonic acid that play a critical role in cervical ripening and uterine contraction. In obstetric pharmacology, synthetic prostaglandin E1 (misoprostol/Cytotec) and prostaglandin E2 (dinoprostone/Cervidil, Prepidil) are administered to soften, efface, and dilate the cervix in preparation for labor induction. At the cellular level, prostaglandins activate collagenase and elastase enzymes within the cervical stroma, breaking down the collagen fiber network that maintains cervical rigidity. This enzymatic remodeling transforms the firm, closed cervix into a soft, compliant structure capable of dilating during labor.\n\nMisoprostol (PGE1) can be administered intravaginally, orally, buccally, or sublingually. It is highly effective for cervical ripening but carries a higher risk of uterine tachysystole (more than 5 contractions in 10 minutes) and uterine hyperstimulation. Misoprostol is contraindicated in clients with a prior uterine scar (e.g., previous cesarean section) due to the increased risk of uterine rupture. Dinoprostone (PGE2) is available as a vaginal insert (Cervidil, which contains 10 mg released at 0.3 mg/hour) or a cervical gel (Prepidil, 0.5 mg). The Cervidil insert has a retrieval string that allows removal if tachysystole or hyperstimulation occurs.\n\nNursing assessment during prostaglandin administration focuses on continuous electronic fetal monitoring and contraction assessment. The nurse must differentiate between desired cervical ripening and potentially dangerous tachysystole. If tachysystole develops with or without fetal heart rate changes, the nurse should remove the Cervidil insert (if applicable), position the client in a lateral position, administer IV fluids, provide oxygen as ordered, and report findings to the provider immediately. Terbutaline 0.25 mg subcutaneous may be administered as ordered as a tocolytic to relax the uterus. Oxytocin augmentation should not begin until at least 4 hours after the last misoprostol dose or 30 minutes after Cervidil removal."
    },
    riskFactors: [
      "Previous cesarean section or uterine surgery (contraindication for misoprostol)",
      "Grand multiparity (increased uterine sensitivity to prostaglandins)",
      "Overdistended uterus (polyhydramnios, multiple gestation)",
      "Non-reassuring fetal heart rate pattern prior to administration",
      "History of asthma (prostaglandins may trigger bronchospasm)",
      "Active genital herpes infection",
      "Placenta previa or unexplained vaginal bleeding",
      "Prior hypersensitivity to prostaglandins"
    ],
    diagnostics: [
      "Bishop score assessment to evaluate cervical readiness (score <6 indicates need for ripening)",
      "Continuous electronic fetal monitoring (EFM) to establish baseline FHR and contraction pattern",
      "Baseline maternal vital signs including temperature, blood pressure, pulse, and respiratory rate",
      "Ultrasound confirmation of fetal presentation and placental location",
      "Group B Streptococcus (GBS) status review",
      "Review of prior cesarean section history or uterine surgery"
    ],
    management: [
      "Administer misoprostol 25 mcg intravaginally every 4-6 hours as ordered (do NOT administer to clients with prior uterine scar)",
      "Insert Cervidil (dinoprostone) into the posterior fornix of the vagina as ordered; instruct client to remain supine for 2 hours",
      "Maintain continuous electronic fetal monitoring throughout prostaglandin administration",
      "Wait at least 4 hours after the last misoprostol dose before initiating oxytocin",
      "Remove Cervidil insert and report to provider if tachysystole or non-reassuring FHR develops",
      "Administer terbutaline 0.25 mg subcutaneous as ordered for tachysystole"
    ],
    nursingActions: [
      "Verify absence of contraindications (prior uterine scar for misoprostol, active bleeding, allergy) before administration",
      "Maintain client in supine or lateral position for 30 minutes to 2 hours after vaginal prostaglandin placement",
      "Assess contraction frequency, duration, and resting tone every 15-30 minutes",
      "Monitor FHR continuously for decelerations, decreased variability, or tachycardia",
      "Report tachysystole (>5 contractions in 10 minutes) or uterine hyperstimulation to the provider immediately",
      "Keep terbutaline readily available as a tocolytic for emergency uterine relaxation"
    ],
    signs: {
      left: [
        "Desired effects: progressive cervical softening, effacement, and early dilation",
        "Mild cramping and regular contractions developing",
        "Improved Bishop score after administration"
      ],
      right: [
        "Tachysystole: >5 contractions in 10 minutes",
        "Uterine hyperstimulation: tachysystole with non-reassuring FHR changes",
        "Uterine rupture signs: sudden sharp abdominal pain, loss of contraction pattern, fetal bradycardia, vaginal bleeding"
      ]
    },
    medications: [
      {
        name: "Misoprostol (Cytotec)",
        type: "Prostaglandin E1 Analog",
        action: "Activates cervical collagenase to soften and efface the cervix; stimulates uterine smooth muscle contraction via prostaglandin receptors",
        sideEffects: "Tachysystole, uterine hyperstimulation, nausea, vomiting, diarrhea, fever, uterine rupture (especially with prior uterine scar)",
        contra: "Prior cesarean section or uterine surgery, active asthma, known hypersensitivity, placenta previa",
        pearl: "ABSOLUTELY contraindicated in clients with prior uterine scar: high risk of uterine rupture; wait 4 hours after last dose before starting oxytocin"
      },
      {
        name: "Dinoprostone (Cervidil/Prepidil)",
        type: "Prostaglandin E2",
        action: "Promotes cervical ripening through collagen degradation and increases uterine smooth muscle tone to initiate contractions",
        sideEffects: "Tachysystole, nausea, vomiting, diarrhea, fever, back pain",
        contra: "Active vaginal bleeding, non-reassuring FHR, client already in active labor, hypersensitivity to prostaglandins",
        pearl: "Cervidil has a retrieval string allowing quick removal if tachysystole occurs: a major safety advantage over misoprostol"
      }
    ],
    pearls: [
      "Bishop score <6 indicates an unfavorable cervix that will benefit from prostaglandin ripening before oxytocin induction",
      "Misoprostol is CONTRAINDICATED in clients with a prior uterine scar: always verify surgical history before administration",
      "Cervidil can be removed if tachysystole develops; misoprostol cannot be retrieved once administered: this is a key safety distinction",
      "Allow at least 4 hours after misoprostol or 30 minutes after Cervidil removal before initiating oxytocin infusion"
    ],
    quiz: [
      {
        question: "A client with a prior cesarean section is scheduled for labor induction. Which cervical ripening agent should the nurse question if ordered?",
        options: [
          "Dinoprostone (Cervidil) vaginal insert",
          "Misoprostol (Cytotec) intravaginal",
          "Mechanical cervical balloon catheter",
          "Oxytocin (Pitocin) low-dose infusion"
        ],
        correct: 1,
        rationale: "Misoprostol is contraindicated in clients with a prior uterine scar (cesarean section) due to the significantly increased risk of uterine rupture. The nurse should question this order and report to the provider. Dinoprostone and mechanical methods may be used with caution, and oxytocin can be carefully titrated."
      }
    ]
  },

  "oxytocin-ob": {
    title: "Oxytocin (Pitocin) for Labor Induction",
    cellular: {
      title: "Oxytocin Pharmacology in Labor Management",
      content: "Oxytocin (Pitocin) is a synthetic form of the naturally occurring posterior pituitary hormone that stimulates uterine smooth muscle contraction. It is the most commonly used pharmacologic agent for labor induction and augmentation. At the cellular level, oxytocin binds to oxytocin receptors (OTRs) on the myometrial cell surface, activating a G-protein-coupled signaling cascade that increases intracellular calcium concentrations. Elevated calcium binds to calmodulin, activating myosin light-chain kinase (MLCK), which phosphorylates myosin and initiates actin-myosin cross-bridge cycling, producing rhythmic uterine contractions.\n\nThe number of oxytocin receptors on the myometrium increases dramatically during pregnancy, reaching peak density near term. This explains why oxytocin is most effective when administered at or near term and why it is less effective in early gestation. Oxytocin is administered as a continuous IV infusion using an infusion pump, starting at a low dose (typically 0.5-2 milliunits/min) and titrated upward every 15-30 minutes until an adequate contraction pattern is achieved (contractions every 2-3 minutes, lasting 60-90 seconds, with adequate resting tone between contractions). The goal is to mimic the natural labor contraction pattern while avoiding tachysystole and uterine hyperstimulation.\n\nOxytocin has a short half-life of approximately 3-5 minutes, which means its effects diminish rapidly when the infusion is discontinued. This is a critical safety feature: if tachysystole or non-reassuring fetal heart rate patterns develop, stopping the infusion leads to rapid resolution. Oxytocin also has an antidiuretic effect at high doses, which can lead to water intoxication and hyponatremia if large volumes of hypotonic IV solutions are co-administered. Postpartum, oxytocin is administered to promote uterine contraction and prevent postpartum hemorrhage by compressing the blood vessels at the former placental site."
    },
    riskFactors: [
      "Grand multiparity (uterus more sensitive to oxytocin, higher rupture risk)",
      "Overdistended uterus (polyhydramnios, macrosomia, multiple gestation)",
      "Prior cesarean section or uterine surgery",
      "Malpresentation (breech, transverse lie)",
      "Placenta previa or vasa previa",
      "Non-reassuring fetal status prior to induction",
      "Cephalopelvic disproportion (CPD)",
      "Umbilical cord prolapse"
    ],
    diagnostics: [
      "Bishop score ≥6 indicating cervical readiness for induction",
      "Continuous electronic fetal monitoring with documentation every 15 minutes in active labor",
      "Contraction monitoring: frequency, duration, intensity, and resting tone",
      "Intake and output monitoring (risk of water intoxication with prolonged infusion)",
      "Serum sodium levels if prolonged high-dose infusion (monitor for hyponatremia)",
      "Assessment of cervical change every 1-2 hours during induction"
    ],
    management: [
      "Administer oxytocin via infusion pump starting at 0.5-2 milliunits/min and titrate every 15-30 minutes as ordered",
      "Goal contraction pattern: every 2-3 minutes, lasting 60-90 seconds, moderate to strong intensity with adequate resting tone",
      "Discontinue oxytocin immediately if tachysystole, uterine hyperstimulation, or non-reassuring FHR develops",
      "Administer IV lactated Ringer's or normal saline (avoid hypotonic solutions to prevent water intoxication)",
      "Position client in lateral position to optimize uteroplacental perfusion",
      "Administer oxytocin 10-40 units in IV solution postpartum as ordered for hemorrhage prevention"
    ],
    nursingActions: [
      "Always administer oxytocin via infusion pump as a secondary (piggyback) infusion: never as a primary line bolus",
      "Monitor and document contraction pattern and FHR every 15 minutes during first stage and every 5 minutes during second stage",
      "Discontinue oxytocin and notify the provider immediately for tachysystole or non-reassuring FHR",
      "Maintain strict intake and output records to detect fluid overload",
      "Position client in lateral position if supine hypotension or FHR changes occur",
      "Have terbutaline available at bedside for emergency tocolysis"
    ],
    signs: {
      left: [
        "Adequate labor pattern: contractions every 2-3 min, 60-90 sec duration, moderate-strong intensity",
        "Progressive cervical dilation and effacement",
        "Reassuring FHR with moderate variability and accelerations"
      ],
      right: [
        "Tachysystole: >5 contractions in 10 minutes",
        "Uterine hyperstimulation with non-reassuring FHR (late decelerations, prolonged decelerations, minimal variability)",
        "Signs of water intoxication: headache, confusion, nausea, decreased urine output, seizures",
        "Signs of uterine rupture: sudden sharp pain, loss of contractions, fetal bradycardia, maternal hemorrhage"
      ]
    },
    medications: [
      {
        name: "Oxytocin (Pitocin)",
        type: "Uterotonic / Synthetic Posterior Pituitary Hormone",
        action: "Binds to myometrial oxytocin receptors, increasing intracellular calcium to stimulate rhythmic uterine contractions; postpartum promotes uterine involution and hemostasis",
        sideEffects: "Tachysystole, uterine hyperstimulation, water intoxication (hyponatremia), nausea, hypotension with rapid IV bolus, uterine rupture (rare)",
        contra: "Placenta previa, vasa previa, cord prolapse, transverse lie, active genital herpes with vaginal lesions, prior classical cesarean incision",
        pearl: "Administer via infusion pump as a piggyback to a primary IV line so it can be immediately discontinued without interrupting IV access: short 3-5 min half-life allows rapid effect reversal"
      }
    ],
    pearls: [
      "Oxytocin must ALWAYS be administered via infusion pump as a secondary (piggyback) line: never bolused during labor",
      "The short half-life (3-5 minutes) is a safety advantage: discontinue the infusion and effects resolve quickly",
      "Water intoxication risk increases with prolonged infusion and hypotonic IV fluids: use isotonic solutions and monitor I&O",
      "Postpartum: oxytocin is the first-line uterotonic for preventing and treating postpartum hemorrhage"
    ],
    quiz: [
      {
        question: "A client receiving oxytocin (Pitocin) infusion is having contractions every 90 seconds lasting 95 seconds with increased resting tone. What is the nurse's priority action?",
        options: [
          "Increase the oxytocin rate to strengthen contractions",
          "Discontinue the oxytocin infusion and position the client laterally",
          "Administer an IV fluid bolus and continue oxytocin",
          "Notify the provider and continue current rate"
        ],
        correct: 1,
        rationale: "Contractions every 90 seconds lasting 95 seconds with increased resting tone indicates tachysystole and uterine hyperstimulation. The priority is to discontinue the oxytocin immediately, position the client laterally to improve uteroplacental perfusion, and notify the provider. Due to the short half-life, stopping the infusion should rapidly reduce uterine activity."
      }
    ]
  },

  "pph-medications": {
    title: "Postpartum Hemorrhage (PPH) Medications",
    cellular: {
      title: "Pharmacologic Management of Postpartum",
      content: "Postpartum hemorrhage (PPH) is defined as blood loss ≥1000 mL or blood loss accompanied by signs of hypovolemia within 24 hours after birth. The most common cause is uterine atony, accounting for approximately 80% of PPH cases. Pharmacologic management targets the underlying pathophysiology by promoting sustained myometrial contraction to compress the spiral arteries at the former placental site. A coordinated, stepwise approach to medication administration is essential, beginning with uterine massage and oxytocin as first-line therapy and escalating to second-line uterotonics as needed.\n\nOxytocin (Pitocin) is the first-line medication for both prevention and treatment of PPH due to uterine atony. When oxytocin alone is insufficient, methylergonovine (Methergine) may be administered intramuscularly to produce sustained uterine tetanic contraction through direct smooth muscle stimulation. Methylergonovine is contraindicated in clients with hypertension or preeclampsia because it causes systemic vasoconstriction that can dangerously elevate blood pressure. Carboprost (Hemabate/15-methyl PGF2α) is a synthetic prostaglandin that produces powerful myometrial contractions and is administered intramuscularly. It is contraindicated in clients with asthma because it can cause severe bronchospasm.\n\nMisoprostol (Cytotec) can be administered rectally (800-1000 mcg) as an adjunct uterotonic in PPH management. It is advantageous because it does not require refrigeration and can be administered by multiple routes. Tranexamic acid (TXA) is an antifibrinolytic agent that inhibits plasminogen activation, reducing fibrinolysis and stabilizing blood clots. It should be administered within 3 hours of hemorrhage onset for maximum efficacy. The nurse must recognize PPH early, initiate fundal massage, administer uterotonics as ordered, maintain IV access with large-bore catheters, and prepare for potential blood transfusion or surgical intervention."
    },
    riskFactors: [
      "Uterine atony (most common cause: overdistended uterus, prolonged labor, chorioamnionitis)",
      "Retained placental fragments or membranes",
      "Genital tract lacerations (cervical, vaginal, perineal)",
      "Uterine inversion",
      "Coagulation disorders (DIC, von Willebrand disease, thrombocytopenia)",
      "Grand multiparity",
      "Precipitous labor",
      "Use of uterine relaxants (magnesium sulfate, general anesthesia)",
      "Placenta accreta spectrum disorders"
    ],
    diagnostics: [
      "Quantitative blood loss (QBL) measurement using graduated drapes and weighing blood-soaked materials",
      "Fundal assessment: height, firmness, and position (boggy uterus indicates atony)",
      "Complete blood count (CBC) with hemoglobin, hematocrit, and platelet count",
      "Coagulation studies: PT, PTT, INR, fibrinogen",
      "Type and crossmatch for potential blood transfusion",
      "Vital signs monitoring for signs of hypovolemic shock (tachycardia, hypotension, decreased urine output)"
    ],
    management: [
      "Perform continuous fundal massage for uterine atony as the initial intervention",
      "Administer oxytocin 10-40 units IV infusion as ordered (first-line uterotonic)",
      "Administer methylergonovine (Methergine) 0.2 mg IM as ordered if oxytocin is ineffective (contraindicated in hypertension)",
      "Administer carboprost (Hemabate) 0.25 mg IM as ordered if other uterotonics fail (contraindicated in asthma)",
      "Administer misoprostol 800-1000 mcg rectally as ordered as adjunct therapy",
      "Administer tranexamic acid (TXA) 1 g IV over 10 minutes as ordered within 3 hours of hemorrhage onset",
      "Establish two large-bore IV lines and infuse isotonic crystalloid for volume replacement",
      "Prepare for blood product administration as ordered"
    ],
    nursingActions: [
      "Assess fundal tone and lochia every 15 minutes during the first hour postpartum and report a boggy uterus immediately",
      "Perform fundal massage firmly and continuously until the uterus becomes firm and contracted",
      "Administer uterotonics as ordered in the correct sequence: oxytocin first, then escalate as needed",
      "Monitor vital signs every 5-15 minutes during active hemorrhage and report signs of shock",
      "Maintain strict intake and output including accurate quantitative blood loss measurement",
      "Verify contraindications before administering each medication: blood pressure for Methergine, respiratory status for Hemabate",
      "Keep the client warm to prevent hypothermia associated with massive hemorrhage"
    ],
    signs: {
      left: [
        "Effective treatment: firm fundus at or below umbilicus, decreased lochia, stable vital signs",
        "Adequate urine output >30 mL/hour indicating perfusion",
        "Client alert, oriented, and hemodynamically stable"
      ],
      right: [
        "Boggy uterus, heavy lochia with clots, fundus above umbilicus or displaced",
        "Hypovolemic shock: tachycardia, hypotension, pallor, diaphoresis, altered consciousness",
        "DIC signs: oozing from IV sites, petechiae, hematuria, uncontrolled bleeding"
      ]
    },
    medications: [
      {
        name: "Methylergonovine (Methergine)",
        type: "Ergot Alkaloid Uterotonic",
        action: "Produces sustained tetanic uterine contraction through direct smooth muscle stimulation, compressing spiral arteries to reduce bleeding",
        sideEffects: "Hypertension, nausea, vomiting, headache, dizziness, peripheral vasoconstriction, chest pain",
        contra: "HYPERTENSION, preeclampsia/eclampsia, coronary artery disease: causes dangerous vasoconstriction and blood pressure elevation",
        pearl: "ALWAYS check blood pressure before administration: contraindicated if BP is elevated; given IM (never IV except in life-threatening emergencies due to risk of severe hypertension and stroke)"
      },
      {
        name: "Carboprost (Hemabate / 15-methyl PGF2α)",
        type: "Prostaglandin F2-alpha Analog",
        action: "Stimulates intense myometrial contraction through prostaglandin receptor activation, effective for refractory uterine atony",
        sideEffects: "Nausea, vomiting, diarrhea, fever, bronchospasm, hypertension, flushing",
        contra: "ASTHMA or reactive airway disease: can cause severe life-threatening bronchospasm; also contraindicated in active hepatic, renal, or cardiac disease",
        pearl: "ALWAYS assess respiratory status before administration: absolutely contraindicated in clients with asthma; may be given IM or directly into the myometrium"
      }
    ],
    pearls: [
      "Remember the PPH medication contraindications: Methergine = hypertension, Hemabate = asthma (mnemonic: 'M for Methergine, M for elevated BP'; 'H for Hemabate, H for hard to breathe')",
      "Oxytocin is always the FIRST-LINE treatment for PPH due to uterine atony: escalate to other uterotonics only when it is ineffective",
      "Tranexamic acid (TXA) should be administered within 3 hours of hemorrhage onset for maximum benefit: do not delay",
      "The 4 T's of PPH etiology: Tone (atony), Tissue (retained placenta), Trauma (lacerations), Thrombin (coagulopathy)"
    ],
    quiz: [
      {
        question: "A postpartum client with a history of chronic hypertension is experiencing heavy bleeding with a boggy uterus. Oxytocin infusion has been ineffective. Which medication should the nurse question if ordered?",
        options: [
          "Carboprost (Hemabate) 0.25 mg IM",
          "Misoprostol (Cytotec) 800 mcg rectally",
          "Methylergonovine (Methergine) 0.2 mg IM",
          "Tranexamic acid (TXA) 1 g IV"
        ],
        correct: 2,
        rationale: "Methylergonovine (Methergine) is an ergot alkaloid that causes systemic vasoconstriction and is CONTRAINDICATED in clients with hypertension or preeclampsia. Administration could cause a dangerous hypertensive crisis. The nurse should question this order and request an alternative uterotonic."
      }
    ]
  },

  "rh-immune-globulin": {
    title: "Rh Immune Globulin (RhoGAM)",
    cellular: {
      title: "Prevention of Rh Sensitization",
      content: "Rh immune globulin (RhIG), commonly known by the brand name RhoGAM, is a blood product containing anti-D immunoglobulin (IgG) antibodies that prevent Rh sensitization (alloimmunization) in Rh-negative individuals exposed to Rh-positive blood. When an Rh-negative mother carries an Rh-positive fetus, fetal red blood cells carrying the D antigen may cross the placenta into the maternal circulation during pregnancy, delivery, or any fetomaternal hemorrhage event. Without intervention, the mother's immune system recognizes the D antigen as foreign and produces anti-D antibodies (IgG), which can cross the placenta in subsequent pregnancies and attack Rh-positive fetal red blood cells, causing hemolytic disease of the fetus and newborn (HDFN).\n\nRhIG works by passively binding to and destroying any fetal Rh-positive red blood cells that have entered the maternal circulation before the mother's immune system can mount an active immune response. By eliminating the antigenic stimulus, RhIG prevents the formation of maternal anti-D antibodies. This mechanism is known as antibody-mediated immune suppression. RhIG is a passive immunization: it does not stimulate the mother's immune system to produce her own antibodies. Because the passively administered antibodies are gradually cleared, repeated doses are necessary for each pregnancy and sensitizing event.\n\nThe standard protocol involves administering RhIG 300 mcg intramuscularly at 28 weeks of gestation (antepartum prophylaxis) and again within 72 hours after delivery if the newborn is confirmed Rh-positive (postpartum prophylaxis). Additional doses are administered as ordered after any sensitizing event, including amniocentesis, chorionic villus sampling (CVS), abdominal trauma, ectopic pregnancy, spontaneous or elective abortion, external cephalic version, or any episode of vaginal bleeding during pregnancy. A Kleihauer-Betke (KB) test may be performed to quantify the volume of fetomaternal hemorrhage and determine if additional RhIG doses are needed beyond the standard 300 mcg dose."
    },
    riskFactors: [
      "Rh-negative mother with Rh-positive partner",
      "Previous pregnancy with Rh-positive fetus without adequate RhIG prophylaxis",
      "Amniocentesis, CVS, or other invasive prenatal procedures",
      "Abdominal trauma during pregnancy",
      "Vaginal bleeding during pregnancy (threatened abortion, placental abruption)",
      "Ectopic pregnancy in Rh-negative individual",
      "Spontaneous or elective abortion",
      "External cephalic version attempt"
    ],
    diagnostics: [
      "Maternal blood type and Rh factor (ABO/Rh typing)",
      "Indirect Coombs test (antibody screen) to detect existing anti-D antibodies",
      "Newborn blood type and Rh factor after delivery",
      "Direct Coombs test on newborn cord blood",
      "Kleihauer-Betke (KB) test to quantify fetomaternal hemorrhage volume",
      "Paternal Rh typing if unknown (to determine fetal Rh risk)"
    ],
    management: [
      "Administer RhIG 300 mcg IM at 28 weeks gestation as ordered for antepartum prophylaxis",
      "Administer RhIG 300 mcg IM within 72 hours after delivery of an Rh-positive newborn as ordered",
      "Administer RhIG as ordered after any sensitizing event during pregnancy",
      "Obtain Kleihauer-Betke test for suspected large fetomaternal hemorrhage to determine if additional RhIG is needed",
      "Verify negative indirect Coombs test before administration (if already sensitized, RhIG will not be effective)",
      "RhIG is NOT indicated if the newborn is Rh-negative"
    ],
    nursingActions: [
      "Verify maternal Rh-negative status and negative indirect Coombs test before administration",
      "Confirm correct product identification and verify with a second nurse (blood product protocol)",
      "Administer RhIG intramuscularly into the deltoid or gluteal muscle",
      "Document the lot number, expiration date, and administration site",
      "Educate the client about the purpose of RhIG and the need for repeat doses in future pregnancies",
      "Monitor for adverse reactions: injection site pain, low-grade fever, allergic reaction"
    ],
    signs: {
      left: [
        "Expected: mild injection site soreness and low-grade temperature",
        "Negative antibody screen after prophylaxis indicating successful prevention",
        "Healthy newborn without signs of hemolytic disease"
      ],
      right: [
        "Failed prophylaxis: positive indirect Coombs in subsequent pregnancy (Rh sensitization occurred)",
        "Neonatal jaundice and anemia from hemolytic disease (HDFN)",
        "Allergic reaction: urticaria, pruritus, anaphylaxis (rare)"
      ]
    },
    medications: [
      {
        name: "Rh Immune Globulin (RhoGAM)",
        type: "Blood Product / Passive Immunoglobulin",
        action: "Passively administered anti-D antibodies bind to and destroy Rh-positive fetal red blood cells in maternal circulation, preventing maternal immune system from producing anti-D antibodies",
        sideEffects: "Injection site pain, low-grade fever, myalgia, lethargy, rare allergic reaction",
        contra: "Rh-positive mother (not needed), prior Rh sensitization (positive indirect Coombs: RhIG is no longer effective), known IgA deficiency with anti-IgA antibodies (anaphylaxis risk)",
        pearl: "Must be administered within 72 hours postpartum for effectiveness: earlier is better; always verify Rh status and antibody screen before giving"
      }
    ],
    pearls: [
      "RhoGAM is given at 28 weeks antepartum AND within 72 hours postpartum if the newborn is Rh-positive: both doses are essential",
      "RhIG is a blood product: follow institutional blood product administration protocols including dual verification",
      "If the mother is already sensitized (positive indirect Coombs), RhIG will NOT be effective: it can only prevent sensitization, not reverse it",
      "A standard 300 mcg dose covers approximately 30 mL of fetal whole blood: Kleihauer-Betke testing determines if additional doses are needed for large hemorrhages"
    ],
    quiz: [
      {
        question: "An Rh-negative client delivers an Rh-positive newborn. The indirect Coombs test is negative. When should the nurse plan to administer RhoGAM?",
        options: [
          "Within 2 weeks postpartum",
          "Within 72 hours postpartum",
          "At the 6-week postpartum visit",
          "Only if the client plans future pregnancies"
        ],
        correct: 1,
        rationale: "RhoGAM must be administered within 72 hours after delivery of an Rh-positive newborn to prevent Rh sensitization. The negative indirect Coombs test confirms the mother has not yet been sensitized, making RhIG prophylaxis appropriate and effective."
      }
    ]
  },

  "rubella-vaccine": {
    title: "Rubella Vaccine (MMR) Postpartum",
    cellular: {
      title: "Postpartum Rubella Immunization",
      content: "Rubella (German measles) is a teratogenic viral infection that can cause devastating congenital rubella syndrome (CRS) when maternal infection occurs during the first trimester of pregnancy. CRS manifestations include sensorineural deafness, congenital heart defects (patent ductus arteriosus, pulmonary stenosis), cataracts, intellectual disability, hepatosplenomegaly, and thrombocytopenic purpura. Prenatal screening identifies non-immune mothers through rubella IgG antibody titer; a titer <1:8 or negative IgG indicates susceptibility to infection.\n\nThe measles-mumps-rubella (MMR) vaccine is a live attenuated virus vaccine that stimulates active immunity by exposing the immune system to weakened viral antigens, triggering both humoral (antibody) and cell-mediated immune responses. Because it is a live vaccine, MMR is CONTRAINDICATED during pregnancy due to the theoretical risk of fetal infection. Therefore, non-immune mothers are vaccinated in the immediate postpartum period before hospital discharge. Seroconversion typically occurs within 2-6 weeks after vaccination, providing protection for future pregnancies.\n\nAfter postpartum MMR administration, the client must be counseled to avoid pregnancy for at least 28 days (1 month) following vaccination. The nurse should educate the client about reliable contraception during this period. Breastfeeding is NOT a contraindication to MMR vaccination: the vaccine can be safely administered to lactating mothers. The vaccine virus may be detected in breast milk, but this does not pose a risk to the nursing infant. Common side effects include mild injection site soreness, low-grade fever, and a transient rash 7-10 days after vaccination. The nurse should also verify that the client does not have a severe allergy to neomycin or gelatin, which are components of the vaccine."
    },
    riskFactors: [
      "Non-immune rubella status identified during prenatal screening (titer <1:8)",
      "Incomplete or unknown childhood immunization history",
      "Immigration from countries without universal rubella vaccination programs",
      "Exposure to rubella during pregnancy (cannot vaccinate until postpartum)",
      "Healthcare workers with non-immune status",
      "Close contact with young children who may transmit rubella",
      "First trimester exposure carries highest teratogenic risk for CRS"
    ],
    diagnostics: [
      "Rubella IgG antibody titer during prenatal screening (non-immune if <1:8 or negative)",
      "Prenatal serologic testing as part of routine initial labs",
      "Postpartum verification of rubella status before discharge",
      "Assessment of allergy history (neomycin, gelatin, egg sensitivity)",
      "Pregnancy test if timing of vaccination is uncertain"
    ],
    management: [
      "Administer MMR vaccine subcutaneously before hospital discharge to non-immune postpartum clients as ordered",
      "Educate client to avoid pregnancy for at least 28 days after MMR vaccination",
      "Provide contraceptive counseling and ensure reliable contraception plan",
      "Document vaccine lot number, expiration date, site, and route of administration",
      "Report rubella immunity status in medical record for future pregnancy planning"
    ],
    nursingActions: [
      "Verify rubella non-immune status from prenatal labs before administration",
      "Screen for contraindications: immunocompromised state, severe neomycin or gelatin allergy, current pregnancy",
      "Administer MMR vaccine 0.5 mL subcutaneously in the upper outer arm",
      "Educate the client that breastfeeding is safe and NOT a contraindication to MMR",
      "Counsel the client to avoid pregnancy for at least 28 days after vaccination",
      "Advise client to expect mild side effects: low-grade fever, injection site soreness, possible rash in 7-10 days"
    ],
    signs: {
      left: [
        "Expected post-vaccination: mild injection site soreness, low-grade fever",
        "Transient rash 7-10 days after vaccination",
        "Positive rubella titer on follow-up indicating seroconversion and immunity"
      ],
      right: [
        "Severe allergic reaction or anaphylaxis (rare)",
        "High fever, arthralgia, or lymphadenopathy",
        "Congenital rubella syndrome in fetus if inadvertently vaccinated during pregnancy"
      ]
    },
    medications: [
      {
        name: "MMR Vaccine (Measles-Mumps-Rubella)",
        type: "Live Attenuated Virus Vaccine",
        action: "Introduces weakened rubella, measles, and mumps viral antigens to stimulate active humoral and cell-mediated immunity without causing disease",
        sideEffects: "Injection site soreness, low-grade fever, transient rash, arthralgias (especially in adult women), lymphadenopathy, rare thrombocytopenia",
        contra: "PREGNANCY (live vaccine: teratogenic risk), severe immunosuppression, severe allergy to neomycin or gelatin, recent blood product administration (wait 3 months)",
        pearl: "Administer postpartum BEFORE discharge: this is often the only opportunity to immunize; breastfeeding is NOT a contraindication"
      }
    ],
    pearls: [
      "MMR is a LIVE vaccine: absolutely contraindicated during pregnancy; administer only in the postpartum period",
      "Instruct client to avoid pregnancy for at least 28 days after MMR vaccination",
      "Breastfeeding is safe and NOT a contraindication to MMR administration",
      "If RhoGAM and MMR are both needed postpartum, they can be given at the same time but at different sites: however, rubella titer should be rechecked in 3 months as the blood product may interfere with seroconversion"
    ],
    quiz: [
      {
        question: "A postpartum client who is breastfeeding is found to be rubella non-immune. The client asks if the MMR vaccine is safe while nursing. What is the best nursing response?",
        options: [
          "The vaccine should be delayed until breastfeeding is discontinued",
          "The MMR vaccine is safe during breastfeeding and will be given before discharge",
          "The vaccine cannot be given until 6 weeks postpartum",
          "Breastfeeding must be interrupted for 48 hours after vaccination"
        ],
        correct: 1,
        rationale: "Breastfeeding is NOT a contraindication to MMR vaccination. The vaccine should be administered before discharge to ensure the client is protected before a future pregnancy. Although vaccine virus may be detected in breast milk, it does not pose a risk to the nursing infant."
      }
    ]
  },

  "lung-surfactants": {
    title: "Exogenous Lung Surfactants for Neonates",
    cellular: {
      title: "Surfactant Replacement Therapy for",
      content: "Exogenous lung surfactants are administered to premature neonates to treat or prevent respiratory distress syndrome (RDS), which results from inadequate endogenous surfactant production by immature type II pneumocytes. Pulmonary surfactant is a complex mixture of phospholipids (primarily dipalmitoylphosphatidylcholine/DPPC) and surfactant proteins that lines the alveolar surface, reducing surface tension at the air-liquid interface. By lowering surface tension, surfactant prevents alveolar collapse (atelectasis) at end-expiration and reduces the work of breathing. Premature neonates born before 34-36 weeks typically have insufficient surfactant, leading to progressive atelectasis, ventilation-perfusion mismatch, hypoxemia, and respiratory failure.\n\nNatural surfactant preparations derived from animal sources include beractant (Survanta, bovine), calfactant (Infasurf, calf), and poractant alfa (Curosurf, porcine). These preparations contain both phospholipids and surfactant proteins that more closely mimic endogenous human surfactant. Synthetic surfactants such as lucinactant (Surfaxin) are also available. Natural surfactants generally demonstrate faster onset and improved outcomes compared to earlier synthetic formulations. Surfactant is administered directly into the lungs via an endotracheal (ET) tube in aliquots, with the neonate repositioned between doses to promote even distribution throughout both lungs.\n\nAdministration technique is critical for effectiveness. The surfactant is warmed to room temperature before instillation. The neonate is intubated, and the surfactant is administered in divided doses (typically 2-4 aliquots) through a catheter placed into the ET tube or via specialized delivery devices. Between aliquots, the neonate is repositioned (right lateral, left lateral, head up, head down) to facilitate gravitational distribution of surfactant to all lung segments. The nurse monitors the neonate's oxygen saturation, heart rate, and breath sounds throughout the procedure. Rapid improvements in oxygenation are expected, and ventilator settings may need to be quickly adjusted to prevent hyperoxia and air leak syndromes (pneumothorax). Suctioning should be avoided for at least 1-2 hours after administration to prevent removal of the surfactant from the airways."
    },
    riskFactors: [
      "Prematurity (<34 weeks gestation): primary risk factor for RDS",
      "Low birth weight (<2500 g), very low birth weight (<1500 g)",
      "Male sex (delayed lung maturity compared to females)",
      "Maternal diabetes (hyperinsulinemia inhibits surfactant production)",
      "Cesarean birth without labor (lack of catecholamine surge that promotes fluid clearance)",
      "Perinatal asphyxia",
      "Second-born twin",
      "White race (higher incidence than other races)"
    ],
    diagnostics: [
      "Chest X-ray showing bilateral ground-glass opacities with air bronchograms (classic RDS finding)",
      "Arterial blood gas (ABG) showing hypoxemia, hypercapnia, and respiratory acidosis",
      "Continuous pulse oximetry monitoring",
      "Lecithin-to-sphingomyelin (L/S) ratio <2:1 from amniotic fluid (prenatal indicator of lung immaturity)",
      "Clinical assessment: tachypnea, nasal flaring, grunting, intercostal/subcostal retractions, cyanosis",
      "Gestational age assessment (Ballard or Dubowitz scoring)"
    ],
    management: [
      "Administer exogenous surfactant via endotracheal tube as ordered (prophylactic within 15-30 minutes of birth, or rescue within first few hours)",
      "Warm surfactant to room temperature before administration: do not shake",
      "Administer in divided aliquots with position changes between each dose",
      "Avoid suctioning ET tube for 1-2 hours after surfactant administration",
      "Adjust ventilator settings promptly as oxygenation improves to prevent hyperoxia and air leak",
      "Repeat surfactant doses may be administered every 6-12 hours as ordered (up to 3-4 doses)"
    ],
    nursingActions: [
      "Verify correct ET tube placement before surfactant administration (auscultate bilateral breath sounds, confirm with X-ray)",
      "Warm surfactant vial to room temperature; gently swirl to mix: do NOT shake vigorously",
      "Monitor oxygen saturation, heart rate, and skin color continuously during and after administration",
      "Reposition neonate between aliquots to promote even pulmonary distribution",
      "Observe for acute complications: bradycardia, desaturation, ET tube obstruction during administration",
      "Avoid ET tube suctioning for 1-2 hours post-administration unless clinically necessary for tube patency",
      "Report rapid improvement in oxygenation to the provider so ventilator settings can be adjusted"
    ],
    signs: {
      left: [
        "Therapeutic response: improved oxygenation, reduced work of breathing, improved breath sounds",
        "Decreased FiO2 requirements within minutes to hours",
        "Improved chest X-ray appearance (resolution of ground-glass opacities)"
      ],
      right: [
        "ET tube obstruction during administration (bradycardia, desaturation)",
        "Pulmonary hemorrhage (rare but serious complication)",
        "Pneumothorax from uneven distribution or rapid lung compliance changes",
        "No improvement after multiple doses suggesting severe disease or alternative diagnosis"
      ]
    },
    medications: [
      {
        name: "Beractant (Survanta)",
        type: "Natural Bovine Surfactant",
        action: "Replaces deficient pulmonary surfactant, reducing alveolar surface tension, preventing atelectasis, and improving lung compliance and gas exchange",
        sideEffects: "Transient bradycardia, oxygen desaturation during administration, ET tube reflux or obstruction, pulmonary hemorrhage (rare)",
        contra: "None absolute; use with caution in neonates with active pulmonary hemorrhage",
        pearl: "Administer within 15 minutes of birth for prophylaxis in extremely premature neonates; do NOT shake the vial: gently swirl to resuspend"
      },
      {
        name: "Poractant alfa (Curosurf)",
        type: "Natural Porcine Surfactant",
        action: "Rapidly adsorbs to the alveolar surface to restore surfactant function, lowering surface tension and preventing end-expiratory alveolar collapse",
        sideEffects: "Transient bradycardia and desaturation during instillation, ET tube reflux, rare pulmonary hemorrhage",
        contra: "No absolute contraindications; relative caution with active pulmonary hemorrhage",
        pearl: "Has a higher phospholipid concentration per mL than beractant, allowing a smaller instillation volume: may reduce airway flooding during administration"
      }
    ],
    pearls: [
      "Do NOT suction the ET tube for 1-2 hours after surfactant administration: suctioning removes surfactant from the airways and reduces effectiveness",
      "Rapid improvement in oxygenation after surfactant is expected: adjust ventilator settings promptly to prevent hyperoxia and air leak",
      "Natural (animal-derived) surfactants are generally preferred over older synthetic formulations due to the presence of surfactant proteins",
      "INSURE technique (INtubate-SURfactant-Extubate) allows surfactant delivery with minimal ventilator time in stable preterm neonates"
    ],
    quiz: [
      {
        question: "A premature neonate received surfactant (Survanta) via ET tube 20 minutes ago. Oxygen saturation has rapidly improved from 82% to 97%. What is the priority nursing action?",
        options: [
          "Suction the ET tube to ensure airway patency",
          "Notify the provider to adjust ventilator settings to prevent hyperoxia",
          "Administer a second dose of surfactant immediately",
          "Place the neonate in a prone position to improve drainage"
        ],
        correct: 1,
        rationale: "Rapid improvement in oxygenation after surfactant administration requires prompt adjustment of ventilator settings (reducing FiO2 and pressures) to prevent hyperoxia, which can lead to retinopathy of prematurity and oxygen toxicity. Suctioning should be avoided for 1-2 hours post-administration."
      }
    ]
  },

  "eye-prophylaxis-newborn": {
    title: "Erythromycin Eye Prophylaxis for Newborns",
    cellular: {
      title: "Prevention of Ophthalmia Neonatorum",
      content: "Erythromycin ophthalmic ointment 0.5% is the standard prophylactic agent administered to all newborns shortly after birth to prevent ophthalmia neonatorum, a serious neonatal eye infection primarily caused by Neisseria gonorrhoeae and Chlamydia trachomatis. These organisms can be transmitted from an infected birth canal to the neonate's conjunctivae during vaginal delivery. Gonococcal ophthalmia can progress rapidly within 2-5 days of birth, causing purulent conjunctivitis that can lead to corneal ulceration, perforation, and permanent blindness if untreated. Chlamydial conjunctivitis typically presents later (5-14 days) with milder symptoms but can still cause corneal scarring and pneumonia.\n\nErythromycin is a macrolide antibiotic that inhibits bacterial protein synthesis by binding to the 50S ribosomal subunit, blocking the translocation step of protein synthesis. This bacteriostatic action prevents the proliferation of susceptible organisms on the conjunctival surface. Erythromycin provides coverage against both N. gonorrhoeae and C. trachomatis, although its efficacy against chlamydia is limited compared to systemic therapy. Silver nitrate solution, which was previously used for prophylaxis, has largely been replaced by erythromycin because silver nitrate does not cover Chlamydia and causes significant chemical conjunctivitis.\n\nAdministration should occur within the first 1-2 hours after birth, but may be delayed up to 1 hour to facilitate initial bonding and breastfeeding. A thin ribbon (approximately 1-2 cm) of erythromycin 0.5% ophthalmic ointment is applied to the lower conjunctival sac of each eye, moving from the inner canthus to the outer canthus. The nurse should not flush or wipe the ointment from the eyes after application. The ointment may cause temporary blurred vision, and parents should be informed that this is expected and will resolve. Eye prophylaxis is required by law in most jurisdictions, regardless of the mother's STI status or method of delivery (vaginal or cesarean)."
    },
    riskFactors: [
      "Maternal gonorrhea or chlamydia infection (known or unknown)",
      "Lack of prenatal care or STI screening",
      "Vaginal delivery through an infected birth canal",
      "Premature rupture of membranes with prolonged exposure",
      "History of sexually transmitted infections in the mother",
      "Mother with multiple sexual partners"
    ],
    diagnostics: [
      "Maternal prenatal GC/chlamydia screening results review",
      "Newborn eye assessment: redness, swelling, discharge",
      "Conjunctival culture if ophthalmia neonatorum is suspected despite prophylaxis",
      "Gram stain of eye discharge (gram-negative intracellular diplococci suggest N. gonorrhoeae)"
    ],
    management: [
      "Administer erythromycin 0.5% ophthalmic ointment to both eyes within 1-2 hours of birth as ordered",
      "Apply a 1-2 cm ribbon of ointment to the lower conjunctival sac of each eye from inner to outer canthus",
      "Do NOT flush or wipe the ointment from the eyes after application",
      "Document administration including time, medication, lot number, and site",
      "Monitor for signs of conjunctivitis despite prophylaxis and report to the provider"
    ],
    nursingActions: [
      "Delay administration for up to 1 hour after birth to allow initial parent-infant bonding and first breastfeed",
      "Gently open the neonate's eyelid by applying slight pressure to the lower lid to expose the conjunctival sac",
      "Apply ointment from inner canthus to outer canthus in a thin ribbon",
      "Do NOT irrigate or wipe the eyes after application: the ointment must remain in contact with conjunctiva",
      "Inform parents that temporary blurred vision and mild eye swelling are expected and will resolve",
      "Assess eyes for signs of infection at each subsequent assessment (redness, edema, purulent discharge)"
    ],
    signs: {
      left: [
        "Expected: temporary blurred vision from ointment, mild eyelid swelling",
        "Chemical conjunctivitis: mild redness that resolves within 24-48 hours",
        "Clear, non-purulent eyes after initial ointment absorption"
      ],
      right: [
        "Gonococcal ophthalmia: thick purulent discharge, severe eyelid edema, appearing 2-5 days after birth",
        "Chlamydial conjunctivitis: watery then mucopurulent discharge, eyelid swelling, appearing 5-14 days",
        "Corneal ulceration or clouding indicating advanced infection"
      ]
    },
    medications: [
      {
        name: "Erythromycin Ophthalmic Ointment 0.5%",
        type: "Macrolide Antibiotic (Ophthalmic)",
        action: "Inhibits bacterial protein synthesis by binding to the 50S ribosomal subunit; provides prophylaxis against N. gonorrhoeae and C. trachomatis conjunctival infection",
        sideEffects: "Temporary blurred vision, mild chemical conjunctivitis (redness, swelling), transient irritation",
        contra: "Known hypersensitivity to erythromycin or any macrolide antibiotic",
        pearl: "Required by law in most jurisdictions for ALL newborns regardless of delivery method or maternal STI status: may delay up to 1 hour for bonding but do not omit"
      }
    ],
    pearls: [
      "Erythromycin eye prophylaxis is legally mandated in most jurisdictions for ALL newborns: do not omit even for cesarean births",
      "May delay administration up to 1 hour to allow initial bonding and breastfeeding, but do not exceed the time window",
      "Do NOT wipe or irrigate ointment from the eyes: it must remain to be effective",
      "Parents should be reassured that the temporary blurriness from the ointment does not affect the newborn's long-term vision"
    ],
    quiz: [
      {
        question: "A new parent asks why the baby needs eye ointment even though the mother tested negative for STIs. What is the best nursing response?",
        options: [
          "The ointment is optional and can be declined if the mother has negative STI results",
          "Eye prophylaxis is required by law for all newborns to prevent potential eye infection, regardless of maternal STI status",
          "The ointment prevents viral eye infections that are unrelated to STIs",
          "The ointment is given only to babies born vaginally"
        ],
        correct: 1,
        rationale: "Erythromycin eye prophylaxis is legally mandated for all newborns in most jurisdictions, regardless of maternal STI status or method of delivery. This is because some infections may be undetected, and the prophylaxis provides broad protection against ophthalmia neonatorum."
      }
    ]
  },

  "phytonadione": {
    title: "Phytonadione (Vitamin K) for Newborns",
    cellular: {
      title: "Vitamin K and Prevention of Hemorrhagic",
      content: "Phytonadione (vitamin K1) is administered intramuscularly to all newborns within the first hour of life to prevent vitamin K deficiency bleeding (VKDB), formerly known as hemorrhagic disease of the newborn. Newborns are born with low stores of vitamin K because the vitamin does not cross the placenta efficiently, the neonatal gut is sterile at birth (vitamin K is normally synthesized by intestinal bacteria), and breast milk contains low levels of vitamin K. Without prophylaxis, neonates are at risk for spontaneous bleeding, which can manifest as early VKDB (within 24 hours, usually related to maternal medications), classic VKDB (days 2-7), or late VKDB (2-12 weeks, often presenting as intracranial hemorrhage).\n\nAt the molecular level, vitamin K is an essential cofactor for the hepatic enzyme gamma-glutamyl carboxylase, which catalyzes the post-translational carboxylation of glutamic acid residues on clotting factors II (prothrombin), VII, IX, and X, as well as proteins C and S. This carboxylation reaction converts inactive precursor proteins into their biologically active forms, which are capable of binding calcium and assembling on phospholipid surfaces to participate in the coagulation cascade. Without adequate vitamin K, these clotting factors remain in their non-functional, undercarboxylated forms (called PIVKAs: Proteins Induced by Vitamin K Absence), and the neonate cannot form stable blood clots.\n\nThe standard dose is phytonadione 0.5-1 mg (0.5 mg for neonates <1500 g, 1 mg for term neonates) administered intramuscularly into the anterolateral aspect of the vastus lateralis muscle within the first hour of birth. The IM route is preferred over oral administration because it provides more reliable absorption, sustained blood levels, and superior protection against late VKDB. Oral vitamin K regimens require multiple doses and have higher failure rates, particularly for late-onset VKDB. The nurse should use a 25-gauge, 5/8-inch needle and apply gentle pressure without massaging the site after injection to minimize bruising in the vitamin K-deficient neonate."
    },
    riskFactors: [
      "All newborns are at risk (universal prophylaxis is standard of care)",
      "Exclusively breastfed infants (breast milk is low in vitamin K compared to formula)",
      "Maternal use of anticonvulsants (phenytoin, carbamazepine, phenobarbital) that interfere with vitamin K metabolism",
      "Maternal use of warfarin or other anticoagulants during pregnancy",
      "Prematurity (lower hepatic stores of vitamin K-dependent factors)",
      "Hepatic disease or biliary atresia in the neonate (impaired vitamin K absorption)",
      "Delayed or refused vitamin K prophylaxis (late VKDB risk increases significantly)"
    ],
    diagnostics: [
      "Baseline assessment for signs of bleeding: petechiae, ecchymosis, oozing from umbilical cord or circumcision site",
      "PT/INR if bleeding is suspected (prolonged in vitamin K deficiency)",
      "Hemoglobin and hematocrit if significant bleeding occurs",
      "Cranial ultrasound if late VKDB with intracranial hemorrhage is suspected",
      "PIVKA-II levels (undercarboxylated prothrombin) as a sensitive marker of vitamin K deficiency"
    ],
    management: [
      "Administer phytonadione 1 mg IM to term neonates (0.5 mg for <1500 g) within the first hour of birth as ordered",
      "Inject into the anterolateral aspect of the vastus lateralis (middle third of the thigh)",
      "Use a 25-gauge, 5/8-inch needle for IM injection",
      "Apply gentle pressure to the injection site; do NOT massage (to prevent tissue damage and bruising)",
      "Document administration time, dose, route, lot number, and injection site"
    ],
    nursingActions: [
      "Administer vitamin K within the first hour of life: do not delay unless medically necessary",
      "Select the vastus lateralis muscle as the preferred injection site in neonates",
      "Stabilize the neonate's leg securely before injection to ensure accurate placement",
      "Monitor the injection site for hematoma, swelling, or excessive bleeding",
      "Educate parents about the importance of vitamin K and the risks of VKDB if they express hesitancy",
      "Document the injection and monitor the neonate for any signs of bleeding at circumcision site, umbilical cord, or puncture sites"
    ],
    signs: {
      left: [
        "Normal response: no bleeding episodes, normal coagulation function",
        "Mild injection site redness that resolves quickly",
        "Normal PT/INR values on any subsequent testing"
      ],
      right: [
        "Early VKDB: cephalohematoma, intracranial hemorrhage, umbilical bleeding within 24 hours",
        "Classic VKDB: GI bleeding (bloody stools), bruising, oozing from circumcision or heel stick sites (days 2-7)",
        "Late VKDB: sudden intracranial hemorrhage presenting as seizures, bulging fontanelle, lethargy (2-12 weeks, especially if prophylaxis was refused)"
      ]
    },
    medications: [
      {
        name: "Phytonadione (Vitamin K1 / AquaMEPHYTON)",
        type: "Fat-Soluble Vitamin / Coagulation Cofactor",
        action: "Serves as essential cofactor for gamma-glutamyl carboxylase, enabling carboxylation and activation of clotting factors II, VII, IX, and X, restoring normal coagulation capability",
        sideEffects: "Injection site pain, erythema, rare allergic reaction, very rare anaphylactoid reaction with IV administration",
        contra: "Known hypersensitivity to phytonadione or any component; IV route carries risk of anaphylactoid reaction and is reserved for emergencies",
        pearl: "IM route is strongly preferred over oral: IM provides sustained levels and superior protection against late VKDB; counsel hesitant parents that the risk of intracranial hemorrhage without vitamin K far outweighs injection discomfort"
      }
    ],
    pearls: [
      "Vitamin K is a universal newborn prophylaxis: ALL neonates should receive it within the first hour of life regardless of feeding method",
      "IM route is superior to oral route for preventing late VKDB: always advocate for IM administration",
      "Late VKDB (2-12 weeks) often presents as sudden intracranial hemorrhage with devastating neurological consequences: most cases occur in infants who did not receive IM vitamin K",
      "Do NOT massage the injection site after administration: this increases bruising risk in the vitamin K-deficient neonate"
    ],
    quiz: [
      {
        question: "Parents of a healthy term newborn request oral vitamin K instead of the injection. What is the most appropriate nursing response?",
        options: [
          "Oral vitamin K is an acceptable alternative with equal protection",
          "The IM injection is strongly recommended because it provides superior and more reliable protection against all forms of VKDB, including late-onset intracranial hemorrhage",
          "Vitamin K is optional and can be declined without significant risk",
          "Oral vitamin K is preferred because it is less painful and equally effective"
        ],
        correct: 1,
        rationale: "The IM route is strongly recommended over oral administration because it provides more reliable absorption, sustained blood levels, and superior protection against late VKDB. Oral regimens require multiple doses, have higher failure rates, and provide less protection against late-onset intracranial hemorrhage."
      }
    ]
  },

  "hep-b-vaccine-newborn": {
    title: "Hepatitis B Vaccine & HBIG for Newborns",
    cellular: {
      title: "Neonatal Hepatitis B Immunization",
      content: "Hepatitis B virus (HBV) is a double-stranded DNA virus that causes acute and chronic hepatitis, cirrhosis, and hepatocellular carcinoma. Perinatal transmission from an HBsAg-positive mother to the neonate during delivery is the most common route of transmission in endemic areas and carries a 90% risk of the infant developing chronic HBV infection if untreated. Chronic HBV infection acquired perinatally leads to a 25% lifetime risk of death from cirrhosis or liver cancer. Universal hepatitis B vaccination of all newborns, combined with hepatitis B immune globulin (HBIG) for infants born to HBsAg-positive mothers, is the cornerstone of perinatal HBV prevention.\n\nThe hepatitis B vaccine is a recombinant subunit vaccine containing hepatitis B surface antigen (HBsAg) produced in yeast cells using recombinant DNA technology. It does NOT contain live virus and cannot cause hepatitis B infection. When administered, the vaccine stimulates the neonate's immune system to produce anti-HBs antibodies, providing active immunity against HBV. The vaccination series requires three doses: the first dose within 12 hours of birth, the second dose at 1 month of age, and the third dose at 6 months of age. For infants born to HBsAg-positive mothers, HBIG 0.5 mL is also administered intramuscularly within 12 hours of birth at a different anatomical site than the vaccine.\n\nHBIG provides immediate passive immunity by supplying preformed anti-HBs antibodies that neutralize circulating HBV viral particles. This passive immunity provides temporary protection while the infant's immune system responds to the vaccine and generates active immunity. The combination of HBIG (passive immunity) and hepatitis B vaccine (active immunity) administered within 12 hours of birth is approximately 85-95% effective in preventing perinatal HBV transmission. The nurse must verify the mother's HBsAg status before the first dose and ensure that both HBIG and the vaccine are administered within the critical 12-hour window for infants born to HBsAg-positive or status-unknown mothers."
    },
    riskFactors: [
      "Mother is HBsAg-positive (hepatitis B surface antigen positive)",
      "Maternal HBsAg status unknown at time of delivery",
      "Mother with acute hepatitis B infection during pregnancy",
      "Mother from endemic region with high HBV prevalence",
      "Household contact with HBV-infected individual",
      "Mother who did not receive prenatal care or HBV screening",
      "Mother who is HBeAg-positive (high viral load, increased transmission risk)"
    ],
    diagnostics: [
      "Maternal HBsAg status (must be determined for every pregnancy)",
      "Maternal HBeAg and HBV DNA viral load if HBsAg-positive (indicates level of infectivity)",
      "Newborn HBsAg and anti-HBs testing at 9-12 months of age after completing vaccine series",
      "Post-vaccination serology to confirm infant seroconversion (anti-HBs ≥10 mIU/mL indicates immunity)"
    ],
    management: [
      "Administer hepatitis B vaccine 0.5 mL IM to ALL newborns within 12 hours of birth as ordered (universal vaccination)",
      "For infants of HBsAg-positive mothers: administer HBIG 0.5 mL IM within 12 hours of birth at a DIFFERENT site than the vaccine",
      "For infants of mothers with unknown HBsAg status: administer vaccine within 12 hours; obtain maternal HBsAg testing and administer HBIG within 7 days if positive",
      "Complete the 3-dose vaccine series: birth, 1 month, and 6 months of age",
      "Test infant for HBsAg and anti-HBs at 9-12 months to confirm protection"
    ],
    nursingActions: [
      "Verify maternal HBsAg status from prenatal records before first vaccine dose",
      "Administer hepatitis B vaccine IM in the vastus lateralis within 12 hours of birth",
      "For HBsAg-positive mothers: administer HBIG at a separate anatomical site within 12 hours",
      "Document vaccine and HBIG administration including lot numbers, expiration dates, sites, and times",
      "Educate parents about the importance of completing the full 3-dose vaccination series",
      "Schedule follow-up appointments for the remaining vaccine doses and post-vaccination serology testing"
    ],
    signs: {
      left: [
        "Expected: mild injection site redness, swelling, or tenderness",
        "Low-grade fever within 24-48 hours of vaccination",
        "Positive anti-HBs titer ≥10 mIU/mL indicating successful seroconversion"
      ],
      right: [
        "Severe allergic reaction or anaphylaxis (extremely rare)",
        "Infant HBsAg-positive at 9-12 months indicating perinatal transmission despite prophylaxis",
        "Inadequate anti-HBs titer indicating need for revaccination"
      ]
    },
    medications: [
      {
        name: "Hepatitis B Vaccine (Recombivax HB / Engerix-B)",
        type: "Recombinant Subunit Vaccine",
        action: "Contains recombinant HBsAg that stimulates active immunity by inducing anti-HBs antibody production; does NOT contain live virus",
        sideEffects: "Injection site pain, redness, swelling, low-grade fever, irritability, rare anaphylaxis",
        contra: "Known severe allergic reaction (anaphylaxis) to a previous dose or vaccine component (yeast hypersensitivity)",
        pearl: "Universal newborn vaccination is recommended regardless of maternal HBsAg status: the first dose should be given within 12 hours of birth"
      },
      {
        name: "Hepatitis B Immune Globulin (HBIG)",
        type: "Passive Immunoglobulin (Blood Product)",
        action: "Provides immediate passive immunity with preformed anti-HBs antibodies that neutralize HBV particles, preventing perinatal transmission while active immunity develops",
        sideEffects: "Injection site pain, low-grade fever, headache, rare allergic reaction",
        contra: "Known severe hypersensitivity to immune globulin products, IgA deficiency with anti-IgA antibodies",
        pearl: "Must be given within 12 hours of birth to infants of HBsAg-positive mothers at a SEPARATE injection site from the vaccine: time is critical for effectiveness"
      }
    ],
    pearls: [
      "The 12-hour window is CRITICAL: both HBIG and first vaccine dose must be given within 12 hours of birth for infants of HBsAg-positive mothers",
      "HBIG and hepatitis B vaccine are given at DIFFERENT anatomical sites (e.g., right and left vastus lateralis): never mix in the same syringe",
      "The hepatitis B vaccine is NOT a live vaccine: it is safe for all newborns including immunocompromised infants",
      "Post-vaccination testing (HBsAg and anti-HBs) at 9-12 months confirms whether the infant is protected or was infected despite prophylaxis"
    ],
    quiz: [
      {
        question: "A newborn is delivered to an HBsAg-positive mother. The birth occurred 2 hours ago. What is the priority nursing action?",
        options: [
          "Administer hepatitis B vaccine and HBIG within 12 hours at separate sites",
          "Administer only the hepatitis B vaccine and schedule HBIG for the 1-month visit",
          "Delay vaccination until the infant's immune system is more mature at 2 months",
          "Administer HBIG only and begin the vaccine series at 1 month"
        ],
        correct: 0,
        rationale: "For infants born to HBsAg-positive mothers, BOTH hepatitis B vaccine AND HBIG must be administered within 12 hours of birth at separate anatomical sites. This dual approach provides both immediate passive immunity (HBIG) and stimulates active immunity (vaccine), achieving 85-95% effectiveness in preventing perinatal HBV transmission."
      }
    ]
  },

  "contraceptives": {
    title: "Contraceptive Methods",
    cellular: {
      title: "Mechanisms of Action",
      content: "Contraceptive methods are pharmacologic and non-pharmacologic interventions designed to prevent pregnancy through various mechanisms including suppression of ovulation, alteration of cervical mucus, prevention of fertilization, and inhibition of implantation. Combined oral contraceptives (COCs) contain both estrogen (ethinyl estradiol) and progestin and work primarily by suppressing the hypothalamic-pituitary-ovarian (HPO) axis. Estrogen suppresses follicle-stimulating hormone (FSH) secretion, preventing follicular development, while progestin suppresses the luteinizing hormone (LH) surge, preventing ovulation. Additionally, progestin thickens cervical mucus (creating a barrier to sperm penetration) and thins the endometrial lining, making it less receptive to implantation.\n\nProgestin-only methods include the progestin-only pill (minipill), depot medroxyprogesterone acetate (Depo-Provera injection), the etonogestrel implant (Nexplanon), and the levonorgestrel-releasing intrauterine device (Mirena, Kyleena, Liletta). These methods are particularly important for individuals who have contraindications to estrogen, such as those with a history of thromboembolic events, migraine with aura, smokers over 35 years of age, or women who are breastfeeding in the early postpartum period. The copper IUD (Paragard) is a non-hormonal intrauterine device that creates a local inflammatory response within the uterus, producing an environment that is toxic to both sperm and ova. It can also be used as emergency contraception when inserted within 5 days of unprotected intercourse.\n\nBarrier methods include male and female condoms, diaphragms, and cervical caps, which physically prevent sperm from reaching the ovum. Condoms have the added benefit of providing protection against sexually transmitted infections (STIs). Emergency contraception options include levonorgestrel (Plan B, effective up to 72 hours), ulipristal acetate (Ella, effective up to 120 hours), and the copper IUD (most effective, up to 5 days). The nurse's role includes educating clients about the mechanism of action, proper use, potential side effects, warning signs (ACHES mnemonic for COCs: Abdominal pain, Chest pain, Headaches, Eye problems, Severe leg pain), and the importance of consistent and correct use for maximum effectiveness."
    },
    riskFactors: [
      "History of deep vein thrombosis (DVT) or pulmonary embolism (PE): contraindication for estrogen-containing methods",
      "Smoking and age >35 years (increased thromboembolic risk with estrogen)",
      "Migraine with aura (increased stroke risk with combined hormonal contraceptives)",
      "Uncontrolled hypertension",
      "History of breast cancer (hormone-sensitive tumors)",
      "Active liver disease or hepatic tumors",
      "Breastfeeding within the first 21 days postpartum (estrogen suppresses lactation)",
      "History of stroke or coronary artery disease"
    ],
    diagnostics: [
      "Baseline blood pressure measurement before initiating hormonal contraception",
      "Pregnancy test to rule out existing pregnancy before initiation",
      "Breast examination and cervical cancer screening per age-appropriate guidelines",
      "Lipid panel and liver function tests if clinically indicated",
      "STI screening if indicated by sexual history",
      "Assessment of migraine history (with or without aura) for estrogen contraindication determination"
    ],
    management: [
      "Educate clients on all available contraceptive options appropriate for their health history and preferences",
      "Administer depot medroxyprogesterone acetate (Depo-Provera) 150 mg IM every 11-13 weeks as ordered",
      "Educate on proper COC use: take at the same time daily, what to do for missed pills",
      "Provide anticipatory guidance on common side effects: breakthrough bleeding, headache, breast tenderness, nausea",
      "Teach the ACHES warning signs for combined hormonal contraceptives and instruct to seek immediate care",
      "Educate on emergency contraception options and availability"
    ],
    nursingActions: [
      "Obtain thorough health history focusing on contraindications to estrogen-containing methods before administration",
      "Measure and document baseline blood pressure before initiating combined hormonal contraception",
      "Educate the client on the ACHES warning signs: Abdominal pain, Chest pain, Headaches (severe), Eye problems (visual changes), Severe leg pain",
      "Teach proper use of chosen method: timing, storage, missed dose protocol, and backup method use",
      "Counsel on STI prevention: hormonal methods do NOT protect against STIs; advise condom use",
      "For Depo-Provera: advise client to return every 11-13 weeks; educate about potential bone density loss with prolonged use",
      "For IUD: educate client to check for strings monthly and report if strings are absent, shorter, or longer"
    ],
    signs: {
      left: [
        "Therapeutic effects: absence of pregnancy, regulation of menstrual cycle, reduced dysmenorrhea",
        "Reduced menstrual flow with hormonal methods",
        "Improved acne with combined oral contraceptives containing anti-androgenic progestins"
      ],
      right: [
        "ACHES warning signs indicating potential thromboembolism: severe Abdominal pain, Chest pain, Headache, Eye changes, Severe leg pain",
        "Breakthrough bleeding, amenorrhea (especially with progestin-only methods)",
        "IUD complications: expulsion, perforation, pelvic inflammatory disease (PID)",
        "Signs of ectopic pregnancy: unilateral pelvic pain, vaginal bleeding, positive pregnancy test with IUD in place"
      ]
    },
    medications: [
      {
        name: "Combined Oral Contraceptives (COCs)",
        type: "Estrogen-Progestin Hormonal Contraceptive",
        action: "Suppresses ovulation by inhibiting FSH and LH secretion; thickens cervical mucus to block sperm; thins endometrial lining to reduce implantation receptivity",
        sideEffects: "Nausea, breast tenderness, breakthrough bleeding, headache, mood changes, weight changes, increased risk of thromboembolic events (DVT, PE, stroke)",
        contra: "History of DVT/PE, stroke, coronary artery disease, migraine with aura, smoking + age >35, breast cancer, uncontrolled hypertension, active liver disease, breastfeeding <21 days postpartum",
        pearl: "Teach ACHES warning signs for thromboembolic complications: if any ACHES symptom occurs, instruct the client to stop the medication and seek immediate medical attention"
      },
      {
        name: "Depot Medroxyprogesterone Acetate (Depo-Provera)",
        type: "Progestin-Only Injectable Contraceptive",
        action: "Suppresses ovulation by inhibiting LH surge; thickens cervical mucus; thins the endometrium; safe for use in clients with estrogen contraindications",
        sideEffects: "Irregular bleeding, amenorrhea, weight gain, mood changes, headache, decreased bone mineral density with prolonged use (>2 years), delayed return to fertility (up to 12-18 months after discontinuation)",
        contra: "Known or suspected pregnancy, undiagnosed vaginal bleeding, breast cancer, severe liver disease",
        pearl: "Administer IM or subcutaneously every 11-13 weeks; advise clients that return to fertility may be delayed up to 12-18 months after discontinuation; calcium and vitamin D supplementation recommended with prolonged use"
      }
    ],
    pearls: [
      "ACHES mnemonic for combined hormonal contraceptive danger signs: Abdominal pain, Chest pain, Headaches (severe), Eye problems, Severe leg pain: seek immediate care",
      "Progestin-only methods are safe for breastfeeding clients and those with estrogen contraindications (DVT history, migraine with aura, smokers >35)",
      "The copper IUD (Paragard) is the most effective form of emergency contraception when inserted within 5 days of unprotected intercourse",
      "Depo-Provera may cause bone density loss with use >2 years: recommend calcium/vitamin D supplementation and periodic reassessment"
    ],
    quiz: [
      {
        question: "A 37-year-old client who smokes 1 pack per day requests oral contraceptives. Which response by the nurse is most appropriate?",
        options: [
          "Combined oral contraceptives are safe at any age and can be started today",
          "Smoking does not affect contraceptive safety or effectiveness",
          "Combined oral contraceptives are contraindicated in smokers over age 35 due to increased risk of thromboembolic events; progestin-only methods are safer alternatives",
          "The client must quit smoking for 24 hours before starting oral contraceptives"
        ],
        correct: 2,
        rationale: "Combined oral contraceptives containing estrogen are contraindicated in smokers over age 35 due to a significantly increased risk of thromboembolic events including DVT, PE, stroke, and myocardial infarction. Progestin-only methods (minipill, implant, IUD, Depo-Provera) are safer alternatives for this client."
      }
    ]
  }
};
