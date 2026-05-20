import type { LessonContent } from "./types";

export const maternalNewbornAdvancedLessons: Record<string, LessonContent> = {
  "maternal-newborn-edge-rpn": {
    title: "Maternal-Newborn Essentials",
    cellular: {
      title: "Maternal-Newborn Physiology Foundations",
      content:
        "The process of labor involves coordinated uterine contractions driven by oxytocin release from the posterior pituitary, acting on myometrial smooth muscle receptors to produce rhythmic contractions that dilate the cervix and expel the fetus. Fetal heart rate regulation depends on autonomic nervous system maturation, with the parasympathetic system maintaining a baseline rate of 110 to 160 beats per minute and accelerations reflecting adequate oxygenation and intact neurological function. Postpartum uterine involution is mediated by sustained myometrial contraction compressing spiral arteries at the placental site, preventing hemorrhage through a physiological tourniquet effect. Neonatal transition at birth requires rapid clearance of lung fluid, initiation of air breathing, and closure of fetal circulatory shunts including the ductus arteriosus and foramen ovale."
    },
    riskFactors: [
      "Grand multiparity increasing risk for uterine atony",
      "Precipitous labor or prolonged labor",
      "Overdistended uterus from polyhydramnios, macrosomia, or multiples",
      "History of postpartum hemorrhage",
      "Maternal age extremes (under 17 or over 35)",
      "Gestational hypertension or preeclampsia"
    ],
    diagnostics: [
      "Assess fundal height and firmness: a firm fundus at or below the umbilicus is normal postpartum; a boggy or displaced fundus requires intervention",
      "Monitor lochia amount, color, and odor: rubra (red, days 1-3), serosa (pink-brown, days 4-10), alba (white-yellow, days 11-21); saturation of more than one pad per hour is excessive",
      "Perform APGAR scoring at 1 and 5 minutes after birth: appearance, pulse, grimace, activity, respiration (0-2 each, total 0-10)",
      "Interpret fetal heart rate tracings: baseline 110-160 bpm, moderate variability and accelerations are reassuring; late decelerations and absent variability are non-reassuring",
      "Assess newborn vital signs: heart rate 120-160, respiratory rate 30-60, temperature 36.5-37.5 degrees Celsius, blood glucose above 2.6 mmol/L",
      "Monitor maternal vital signs for signs of hemorrhage: tachycardia is often the earliest sign, followed by hypotension and decreased urine output",
    ],
    management: [
      "Perform fundal massage for uterine atony: place one hand on the fundus and massage firmly in a circular motion until the uterus becomes firm",
      "Administer oxytocin as ordered for postpartum hemorrhage prevention and treatment",
      "Initiate skin-to-skin contact and early breastfeeding within the first hour after birth to promote bonding and stimulate oxytocin release",
      "Monitor newborn for signs of hypoglycemia: jitteriness, poor feeding, lethargy, hypothermia, seizures",
      "Position newborn on back for sleep (ABCs of safe sleep: Alone, on Back, in Crib) to reduce SIDS risk",
      "Educate mother on perineal care, breast care, and warning signs requiring immediate medical attention (heavy bleeding, fever, foul-smelling discharge, severe headache, visual changes)",
    ],
    assessmentFindings: [
      "Boggy uterus on fundal palpation indicating atony",
      "Lochia rubra saturating more than one pad per hour",
      "Rising maternal heart rate with falling blood pressure",
      "Fundus deviated to one side suggesting bladder distension",
      "Newborn APGAR score below 7 at 5 minutes requiring intervention"
    ],
    signs: {
      left: [
        "Normal fetal heart rate 110 to 160 bpm",
        "Accelerations present on fetal monitor (reassuring)",
        "Firm fundus at or below umbilicus postpartum",
        "Lochia rubra progressing to serosa then alba",
        "Newborn active cry, flexed posture, pink color"
      ],
      right: [
        "Fetal heart rate below 110 or above 160 bpm (abnormal)",
        "Late decelerations indicating uteroplacental insufficiency",
        "Boggy uterus with heavy bleeding (postpartum hemorrhage)",
        "Foul-smelling lochia suggesting endometritis",
        "Newborn flaccid, cyanotic, absent cry (compromised transition)"
      ]
    },
    nursingActions: [
      "Perform fundal massage for boggy uterus and monitor response",
      "Monitor lochia amount, color, odor, and presence of clots",
      "Assess maternal vital signs every 15 minutes in early postpartum",
      "Encourage skin-to-skin contact and early breastfeeding initiation",
      "Educate on safe sleep practices: supine position, firm mattress, no loose bedding",
      "Verify car seat installation and proper positioning before discharge",
      "Assess newborn reflexes: Moro, rooting, sucking, grasp, Babinski"
    ],
    medications: [
      {
        name: "Oxytocin (Pitocin)",
        type: "Uterotonic",
        action: "Stimulates uterine smooth muscle contraction to prevent or treat postpartum hemorrhage by compressing blood vessels at the placental site",
        sideEffects: "Water intoxication with prolonged IV infusion, uterine hyperstimulation, nausea, vomiting",
        contra: "Hypersensitivity; caution with hypertonic uterine patterns",
        pearl: "First-line agent for postpartum hemorrhage prevention; always administered after delivery of the placenta"
      }
    ],
    pearls: [
      "The uterus should feel firm like a grapefruit at or below the umbilicus after delivery; a boggy uterus is the number one cause of postpartum hemorrhage",
      "APGAR scoring (Appearance, Pulse, Grimace, Activity, Respiration) is assessed at 1 and 5 minutes; scores below 7 at 5 minutes warrant continued resuscitation",
      "Accelerations on fetal monitoring are reassuring and indicate fetal well-being; the absence of accelerations requires further evaluation",
      "Safe sleep teaching is critical: place infant supine on a firm flat surface with no pillows, blankets, or stuffed animals in the crib",
      "Breastfeeding should be initiated within the first hour of life; early feeding cues include lip smacking, rooting, and hand-to-mouth movements"
    ],
    quiz: [
      {
        question: "A nurse assesses a postpartum client and finds the uterus is boggy and displaced to the right. What is the priority nursing action?",
        options: [
          "Massage the fundus and have the client empty her bladder",
          "Administer methylergonovine immediately",
          "Apply ice packs to the perineum",
          "Elevate the head of bed and encourage ambulation"
        ],
        correct: 0,
        rationale: "A boggy uterus displaced to the right suggests a full bladder preventing proper contraction. The priority is to massage the fundus to stimulate contraction and have the client void to allow the uterus to contract effectively."
      },
      {
        question: "What is the normal fetal heart rate baseline range?",
        options: [
          "80 to 100 beats per minute",
          "100 to 120 beats per minute",
          "110 to 160 beats per minute",
          "160 to 200 beats per minute"
        ],
        correct: 2,
        rationale: "The normal fetal heart rate baseline is 110 to 160 beats per minute. Rates below 110 (bradycardia) or above 160 (tachycardia) require further assessment and intervention."
      },
      {
        question: "A newborn has an APGAR score of 4 at 1 minute. Which finding is most consistent with this score?",
        options: [
          "Active crying, flexed extremities, heart rate 140",
          "Weak cry, some flexion, heart rate 90, blue extremities",
          "Strong cry, pink body, heart rate 150, active movement",
          "Vigorous cry, pink all over, heart rate 130"
        ],
        correct: 1,
        rationale: "An APGAR score of 4 indicates moderate depression. A weak cry (1), some flexion (1), heart rate below 100 (1), and acrocyanosis (1) totals 4 points, indicating the need for resuscitative measures."
      }
    ]
  },

  "maternal-newborn-edge-rn": {
    title: "Maternal-Newborn Advanced Edge Cases",
    cellular: {
      title: "Fetal Monitoring",
      content:
        "Fetal heart rate variability reflects the interplay between the sympathetic and parasympathetic nervous systems, with moderate variability (6 to 25 bpm fluctuation) indicating adequate oxygenation and intact central nervous system function. Late decelerations result from uteroplacental insufficiency causing transient fetal hypoxemia during contractions, triggering a chemoreceptor-mediated vagal response that slows the heart rate after the peak of the contraction. Postpartum hemorrhage pathophysiology centers on failure of the myometrium to contract adequately after placental separation, leaving spiral arteries at the placental site open and bleeding; this accounts for approximately 80 percent of cases attributed to uterine atony. Eclamptic seizures arise from cerebral vasospasm and endothelial dysfunction in the setting of severe preeclampsia, with magnesium sulfate acting as a central nervous system depressant and vasodilator to raise the seizure threshold."
    },
    riskFactors: [
      "Uteroplacental insufficiency from chronic hypertension or preeclampsia",
      "Chorioamnionitis increasing risk for fetal tachycardia and infection",
      "Retained placental fragments preventing complete uterine contraction",
      "Coagulopathy including DIC complicating hemorrhage management",
      "Gestational diabetes with macrosomic fetus increasing shoulder dystocia risk",
      "Previous cesarean section with risk for uterine rupture"
    ],
    diagnostics: [
      "Continuous electronic fetal monitoring with assessment of baseline, variability, accelerations, and decelerations",
      "Category I tracing: normal baseline, moderate variability, no late or variable decelerations",
      "Category II tracing: indeterminate, requires evaluation and continued surveillance",
      "Category III tracing: absent variability with recurrent late decelerations, sinusoidal pattern, or recurrent variable decelerations; requires immediate intervention",
      "Quantitative blood loss measurement during delivery replacing visual estimation",
      "Serum magnesium levels (therapeutic range 4 to 7 mEq/L) during magnesium sulfate infusion"
    ],
    management: [
      "Intrauterine resuscitation: reposition maternal left lateral, administer oxygen, increase IV fluids, discontinue oxytocin",
      "Postpartum hemorrhage protocol: bimanual uterine massage, oxytocin infusion, methylergonovine IM, carboprost IM, misoprostol rectal, tranexamic acid IV within 3 hours",
      "Massive transfusion protocol activation for estimated blood loss exceeding 1500 mL or hemodynamic instability",
      "Eclampsia management: magnesium sulfate 4 to 6 g IV loading dose over 20 minutes followed by 1 to 2 g per hour maintenance",
      "Shoulder dystocia HELPERR mnemonic: call for Help, Evaluate for episiotomy, Legs in McRoberts, suprapubic Pressure, Enter for rotational maneuvers, Remove posterior arm, Roll to all fours (Gaskin)",
      "NRP algorithm: warm dry stimulate, clear airway, positive pressure ventilation, chest compressions at 3:1 ratio with ventilation, epinephrine via umbilical vein"
    ],
    signs: {
      left: [
        "Category I tracing with moderate variability and accelerations",
        "Firm fundus with decreasing lochia volume",
        "Deep tendon reflexes 2+ with magnesium sulfate therapy",
        "Spontaneous resolution of variable decelerations with repositioning",
        "Adequate urine output greater than 30 mL per hour on magnesium"
      ],
      right: [
        "Category III tracing with absent variability and recurrent late decelerations",
        "Boggy uterus unresponsive to massage with continuous heavy bleeding",
        "Absent deep tendon reflexes indicating magnesium toxicity",
        "Respiratory rate below 12 suggesting magnesium overdose",
        "Turtle sign at perineum indicating shoulder dystocia"
      ]
    },
    nursingActions: [
      "Continuously monitor fetal heart tracing and categorize as I, II, or III",
      "Perform intrauterine resuscitation maneuvers for non-reassuring patterns",
      "Maintain seizure precautions: padded side rails, suction at bedside, dim lighting",
      "Monitor deep tendon reflexes, respiratory rate, and urine output hourly during magnesium infusion",
      "Keep calcium gluconate at bedside as antidote for magnesium toxicity",
      "Activate rapid response for Category III tracings or hemorrhage exceeding 1000 mL",
      "Document quantitative blood loss using calibrated drapes and graduated containers"
    ],
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant and tocolytic",
        action: "Depresses central nervous system excitability and blocks neuromuscular transmission, raising seizure threshold in eclampsia and providing neuroprotection for preterm fetus",
        sideEffects: "Flushing, diaphoresis, hypotension, decreased deep tendon reflexes, respiratory depression, cardiac arrest at toxic levels",
        contra: "Myasthenia gravis, severe renal impairment (requires dose adjustment), heart block",
        pearl: "Therapeutic range is 4 to 7 mEq/L; loss of deep tendon reflexes occurs at 7 to 10 mEq/L; respiratory arrest at 12 to 15 mEq/L; always have calcium gluconate at bedside"
      },
      {
        name: "Methylergonovine (Methergine)",
        type: "Ergot alkaloid uterotonic",
        action: "Produces sustained uterine contraction by directly stimulating smooth muscle, constricting uterine blood vessels to control postpartum hemorrhage",
        sideEffects: "Severe hypertension, nausea, vomiting, peripheral vasoconstriction, headache",
        contra: "Hypertension, preeclampsia, Raynaud disease; never give IV due to risk of severe hypertension and stroke",
        pearl: "Contraindicated in hypertensive patients; always check blood pressure before administration; given IM only"
      },
      {
        name: "Carboprost (Hemabate)",
        type: "Prostaglandin F2-alpha analog",
        action: "Stimulates myometrial contraction to control hemorrhage refractory to oxytocin and methylergonovine",
        sideEffects: "Diarrhea, nausea, vomiting, fever, bronchospasm, hypertension",
        contra: "Asthma (can cause severe bronchospasm), active cardiac, pulmonary, renal, or hepatic disease",
        pearl: "Contraindicated in asthmatic patients due to bronchospasm risk; remember 'Carbo-prostaglandin causes Constriction of bronchioles'"
      }
    ],
    pearls: [
      "Late decelerations mirror contractions but begin after the contraction peak and return to baseline after the contraction ends; they always indicate uteroplacental insufficiency and require immediate intervention",
      "Variable decelerations are abrupt drops caused by cord compression; they vary in shape, timing, and depth and often resolve with maternal repositioning",
      "The HELPERR mnemonic for shoulder dystocia is one of the most tested obstetric emergencies: never apply fundal pressure as it worsens impaction",
      "Magnesium sulfate toxicity progresses predictably: loss of DTRs at 7 to 10 mEq/L, respiratory depression at 12 to 15 mEq/L, cardiac arrest at greater than 25 mEq/L",
      "Tranexamic acid must be administered within 3 hours of hemorrhage onset for maximum effectiveness; it inhibits fibrinolysis to stabilize clot formation",
      "In NRP, the compression to ventilation ratio is 3:1 (not 15:2 or 30:2 as in adult or pediatric BLS); this ratio prioritizes ventilation because most neonatal arrests are respiratory in origin"
    ],
    quiz: [
      {
        question: "A laboring client's fetal monitor shows a heart rate of 145 bpm with absent variability and recurrent late decelerations. How should the nurse categorize this tracing?",
        options: [
          "Category I - normal, continue routine monitoring",
          "Category II - indeterminate, increase surveillance",
          "Category III - abnormal, prepare for immediate delivery",
          "Category I - reassuring if accelerations are present"
        ],
        correct: 2,
        rationale: "Absent variability with recurrent late decelerations is a Category III tracing, which is abnormal and requires immediate evaluation for expeditious delivery. This pattern indicates significant fetal compromise."
      },
      {
        question: "A nurse is caring for a client receiving magnesium sulfate for severe preeclampsia. Which assessment finding requires the nurse to hold the infusion and notify the provider immediately?",
        options: [
          "Flushing and feeling warm",
          "Urine output of 40 mL per hour",
          "Deep tendon reflexes absent bilaterally",
          "Serum magnesium level of 5 mEq/L"
        ],
        correct: 2,
        rationale: "Absent deep tendon reflexes indicate magnesium toxicity (occurs at 7 to 10 mEq/L). The infusion must be stopped and calcium gluconate administered as the antidote. Flushing is an expected side effect, adequate urine output is reassuring, and 5 mEq/L is within the therapeutic range."
      },
      {
        question: "During delivery, the nurse observes the fetal head retract against the perineum after crowning (turtle sign). What is the priority nursing action?",
        options: [
          "Apply fundal pressure to assist delivery",
          "Call for help and assist with McRoberts positioning",
          "Prepare for immediate cesarean section",
          "Administer oxytocin to strengthen contractions"
        ],
        correct: 1,
        rationale: "The turtle sign indicates shoulder dystocia. The first steps in the HELPERR mnemonic are to call for Help and position the client in McRoberts (hyperflexion of thighs against abdomen). Fundal pressure is contraindicated as it worsens impaction."
      }
    ]
  },

  "maternal-newborn-edge-np": {
    title: "Maternal-Newborn and Reproductive Health",
    cellular: {
      title: "Prenatal Pathophysiology",
      content:
        "Preeclampsia originates from abnormal placental implantation with deficient trophoblastic invasion of spiral arteries, leading to placental ischemia and release of antiangiogenic factors such as soluble fms-like tyrosine kinase-1 that cause widespread endothelial dysfunction, hypertension, proteinuria, and multiorgan damage. Gestational diabetes mellitus results from progressive insulin resistance driven by placental hormones including human placental lactogen, cortisol, and progesterone, which overwhelm pancreatic beta-cell compensation in susceptible individuals, producing maternal hyperglycemia that crosses the placenta and causes fetal macrosomia and hyperinsulinemia. Reproductive endocrinology governing contraception and fertility depends on the hypothalamic-pituitary-ovarian axis, where gonadotropin-releasing hormone pulses regulate FSH and LH secretion to control folliculogenesis, ovulation, and corpus luteum function. Anti-Mullerian hormone produced by granulosa cells of small antral follicles serves as a reliable marker of ovarian reserve and is used in infertility evaluation alongside day-3 FSH and estradiol levels."
    },
    riskFactors: [
      "Chronic hypertension increasing risk for superimposed preeclampsia",
      "BMI greater than 30 increasing gestational diabetes risk",
      "Previous pregnancy with preeclampsia or gestational diabetes",
      "Rh-negative maternal blood type with Rh-positive fetus risk for alloimmunization",
      "Advanced maternal age over 35 associated with infertility and chromosomal abnormalities",
      "Polycystic ovary syndrome contributing to anovulatory infertility",
      "Family history of thromboembolic disease affecting contraception selection"
    ],
    diagnostics: [
      "First prenatal visit: CBC, blood type and Rh, antibody screen, rubella titer, hepatitis B surface antigen, HIV, syphilis, urinalysis and culture, Pap smear, chlamydia and gonorrhea screening",
      "Gestational diabetes screening: 1-hour glucose challenge test at 24 to 28 weeks (threshold 130 or 140 mg/dL); confirmatory 3-hour glucose tolerance test",
      "Preeclampsia diagnosis: systolic BP 140 or greater or diastolic 90 or greater on two occasions 4 hours apart with proteinuria 300 mg or greater in 24 hours or protein-creatinine ratio 0.3 or greater",
      "Severe features: systolic 160 or greater, diastolic 110 or greater, thrombocytopenia below 100000, liver transaminases twice normal, renal insufficiency creatinine greater than 1.1, pulmonary edema, cerebral or visual disturbances",
      "Infertility workup: AMH level, day-3 FSH and estradiol, transvaginal ultrasound for antral follicle count, semen analysis, hysterosalpingography for tubal patency",
      "Edinburgh Postnatal Depression Scale screening at postpartum visits with score of 10 or greater indicating possible depression"
    ],
    management: [
      "Gestational diabetes: medical nutrition therapy first, self-monitoring of blood glucose 4 times daily, insulin therapy if fasting glucose exceeds 95 mg/dL or postprandial exceeds 120 at 2 hours; metformin as alternative if insulin refused",
      "Preeclampsia without severe features: delivery at 37 weeks, antihypertensive therapy if BP consistently 150/100 or greater, close maternal and fetal surveillance",
      "Preeclampsia with severe features: delivery at 34 weeks or earlier if maternal or fetal deterioration, magnesium sulfate for seizure prophylaxis, antihypertensives for acute BP management",
      "RhoGAM 300 mcg IM at 28 weeks and within 72 hours postpartum for Rh-negative unsensitized mothers with Rh-positive newborns",
      "Contraception prescribing using CDC Medical Eligibility Criteria: combined hormonal methods category 4 (contraindicated) in migraine with aura, uncontrolled hypertension, history of VTE, and first 21 days postpartum with breastfeeding",
      "Postpartum depression: SSRI initiation with sertraline preferred during breastfeeding due to minimal infant exposure; referral for psychotherapy; safety assessment"
    ],
    signs: {
      left: [
        "Blood pressure below 140/90 throughout pregnancy",
        "Fasting glucose below 95 mg/dL in gestational diabetes on diet therapy",
        "Normal AMH 1.0 to 3.5 ng/mL indicating adequate ovarian reserve",
        "Edinburgh Postnatal Depression Scale score below 10",
        "Negative indirect Coombs test in Rh-negative mother"
      ],
      right: [
        "Blood pressure 160/110 or greater with headache and visual changes (severe preeclampsia)",
        "Fasting glucose exceeding 95 mg/dL requiring insulin initiation",
        "AMH below 1.0 ng/mL indicating diminished ovarian reserve",
        "Edinburgh score 13 or greater with suicidal ideation requiring urgent referral",
        "Positive indirect Coombs test indicating Rh sensitization has occurred"
      ]
    },
    nursingActions: [
      "Order and interpret first prenatal visit laboratory panel",
      "Counsel on gestational diabetes dietary modifications and blood glucose monitoring schedule",
      "Prescribe antihypertensive therapy per guidelines for preeclampsia with persistent severe-range BPs",
      "Evaluate contraception eligibility using CDC MEC categories before prescribing",
      "Screen for postpartum depression at every postpartum visit using validated EPDS tool",
      "Initiate RhoGAM prophylaxis at 28 weeks and postpartum for eligible Rh-negative patients",
      "Refer for infertility evaluation when conception has not occurred after 12 months in women under 35 or 6 months in women 35 and older"
    ],
    medications: [
      {
        name: "Insulin (various formulations)",
        type: "Antidiabetic hormone",
        action: "Facilitates cellular glucose uptake and suppresses hepatic glucose production to maintain euglycemia in gestational diabetes uncontrolled by diet",
        sideEffects: "Hypoglycemia, injection site reactions, weight gain, hypokalemia",
        contra: "Hypersensitivity to specific insulin formulation; requires dose adjustment with renal impairment",
        pearl: "Insulin does not cross the placenta and is the gold standard for gestational diabetes pharmacotherapy; dosing needs increase throughout pregnancy due to rising insulin resistance"
      },
      {
        name: "Sertraline (Zoloft)",
        type: "Selective serotonin reuptake inhibitor",
        action: "Inhibits serotonin reuptake in the synaptic cleft to increase serotonergic neurotransmission, treating depressive and anxiety symptoms",
        sideEffects: "Nausea, diarrhea, insomnia, sexual dysfunction, headache, neonatal adaptation syndrome if used in third trimester",
        contra: "Concurrent MAOI use, caution with bleeding disorders or anticoagulant therapy",
        pearl: "Sertraline has the lowest breast milk transfer of all SSRIs making it the preferred first-line antidepressant for breastfeeding mothers with postpartum depression"
      },
      {
        name: "RhoGAM (Rho D Immune Globulin)",
        type: "Immune globulin",
        action: "Provides passive anti-D antibodies that bind and destroy fetal Rh-positive red blood cells in maternal circulation before the maternal immune system can produce its own antibodies, preventing alloimmunization",
        sideEffects: "Injection site pain, low-grade fever, mild allergic reactions, rarely anaphylaxis",
        contra: "Rh-positive mothers (not indicated), prior Rh sensitization (antibodies already formed, RhoGAM is ineffective)",
        pearl: "Must be given within 72 hours of delivery or any sensitizing event (amniocentesis, trauma, miscarriage); Kleihauer-Betke test determines if additional doses are needed for large fetomaternal hemorrhage"
      }
    ],
    pearls: [
      "Preeclampsia can develop up to 6 weeks postpartum; patients should be educated to report severe headaches, visual changes, epigastric pain, and shortness of breath after discharge",
      "The only cure for preeclampsia is delivery of the placenta; all other interventions are temporizing measures to prolong pregnancy and promote fetal maturity",
      "CDC MEC Category 4 means the contraceptive method poses unacceptable health risk; combined oral contraceptives are Category 4 for women with migraine with aura due to stroke risk",
      "Gestational diabetes screening should occur at 24 to 28 weeks in all pregnancies; early screening at the first visit is recommended for women with BMI over 25 and additional risk factors",
      "An Edinburgh Postnatal Depression Scale score of 10 or greater warrants further clinical assessment; any positive response to question 10 about self-harm requires immediate safety evaluation",
      "Infertility evaluation should begin after 12 months of unprotected intercourse for women under 35 and after 6 months for women 35 and older; initial workup includes AMH, day-3 FSH, semen analysis, and HSG"
    ],
    quiz: [
      {
        question: "A nurse practitioner is evaluating a 32-week pregnant client with a blood pressure of 162/108 mmHg, platelet count of 85,000, and AST three times the upper limit of normal. What is the most appropriate management?",
        options: [
          "Continue expectant management until 37 weeks and recheck labs weekly",
          "Start magnesium sulfate for seizure prophylaxis and plan delivery",
          "Prescribe oral nifedipine and follow up in one week",
          "Order a 24-hour urine protein collection before making any decisions"
        ],
        correct: 1,
        rationale: "This client has preeclampsia with severe features (BP 160 or greater, thrombocytopenia below 100,000, elevated liver enzymes). Management includes magnesium sulfate for seizure prophylaxis and planning for delivery regardless of gestational age when severe features are present at or beyond viability."
      },
      {
        question: "Which contraceptive method is classified as CDC MEC Category 4 (unacceptable health risk) for a 28-year-old woman who experiences migraine with aura?",
        options: [
          "Copper intrauterine device",
          "Levonorgestrel intrauterine system",
          "Combined oral contraceptive pill",
          "Etonogestrel subdermal implant"
        ],
        correct: 2,
        rationale: "Combined hormonal contraceptives (containing estrogen) are Category 4 for women with migraine with aura due to significantly increased stroke risk. Progestin-only methods and IUDs are safe alternatives classified as Category 1 or 2 for this population."
      },
      {
        question: "A postpartum client scores 14 on the Edinburgh Postnatal Depression Scale and endorses thoughts of self-harm. What is the priority action by the clinician?",
        options: [
          "Recommend increasing physical activity and follow up in 2 weeks",
          "Prescribe sertraline and schedule a follow-up in one month",
          "Conduct an immediate safety assessment and arrange urgent psychiatric evaluation",
          "Refer to a support group for new mothers"
        ],
        correct: 2,
        rationale: "A score of 14 with endorsed self-harm thoughts constitutes an acute psychiatric emergency requiring immediate safety assessment and urgent mental health referral. While sertraline may be appropriate later, the priority is ensuring patient safety before any other intervention."
      }
    ]
  }
};
