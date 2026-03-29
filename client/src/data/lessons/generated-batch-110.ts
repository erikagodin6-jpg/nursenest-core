import type { LessonContent } from "./types";

export const generatedBatch110Lessons: Record<string, LessonContent> = {
  "pre-eclampsia-management": {
    title: "Pre-eclampsia Management",
    cellular: {
      title: "Pathophysiology of Pre-eclampsia",
      content: "Pre-eclampsia is a multisystem hypertensive disorder of pregnancy characterized by new-onset hypertension (≥140/90 mmHg) and proteinuria or end-organ dysfunction after 20 weeks of gestation. The underlying pathology involves abnormal placentation with inadequate remodeling of the spiral arteries, leading to placental ischemia and widespread endothelial dysfunction.\n\nThe poorly perfused placenta releases anti-angiogenic factors such as soluble fms-like tyrosine kinase-1 (sFlt-1) and soluble endoglin into the maternal circulation. These factors antagonize vascular endothelial growth factor (VEGF) and placental growth factor (PlGF), disrupting normal endothelial function throughout the maternal vasculature.\n\nEndothelial damage leads to vasospasm, increased vascular permeability, and activation of the coagulation cascade. This results in hypertension from vasoconstriction, proteinuria from glomerular endotheliosis, edema from capillary leak, and potential progression to HELLP syndrome (Hemolysis, Elevated Liver enzymes, Low Platelets) or eclampsia (seizures).\n\nOrgan systems affected include the kidneys (decreased GFR, proteinuria), liver (periportal necrosis, subcapsular hematoma), brain (cerebral edema, seizures), and the hematologic system (microangiopathic hemolytic anemia, thrombocytopenia). The only definitive cure is delivery of the placenta."
    },
    riskFactors: [
      "Nulliparity or first pregnancy with a new partner",
      "Chronic hypertension or renal disease",
      "Multiple gestation (twins, triplets)",
      "Pre-existing diabetes mellitus",
      "Family history of pre-eclampsia",
      "Maternal age >35 or <20 years",
      "Obesity (BMI >30)",
      "Autoimmune disorders (SLE, antiphospholipid syndrome)"
    ],
    diagnostics: [
      "Blood pressure ≥140/90 mmHg on two occasions at least 4 hours apart after 20 weeks gestation",
      "24-hour urine protein ≥300 mg or protein/creatinine ratio ≥0.3",
      "Serum creatinine >1.1 mg/dL or doubling of baseline",
      "Elevated liver enzymes (AST/ALT) to twice normal",
      "Platelet count <100,000/µL",
      "Complete metabolic panel, CBC with differential, LDH, uric acid"
    ],
    management: [
      "Magnesium sulfate IV for seizure prophylaxis (loading dose 4-6g over 20 min, maintenance 1-2g/hr)",
      "Antihypertensive therapy for severe hypertension: labetalol IV, hydralazine IV, or oral nifedipine",
      "Delivery is the definitive treatment — timing depends on gestational age and severity",
      "Betamethasone for fetal lung maturity if <34 weeks and delivery anticipated within 7 days",
      "Continuous fetal monitoring and maternal assessment of neurological status"
    ],
    nursingActions: [
      "Monitor blood pressure every 15 minutes during acute treatment, then every 1-4 hours",
      "Assess for signs of magnesium toxicity: absent deep tendon reflexes, respiratory depression (<12/min), urine output <30 mL/hr",
      "Keep calcium gluconate at bedside as antidote for magnesium toxicity",
      "Monitor intake and output strictly; maintain urine output ≥30 mL/hr",
      "Assess for headache, visual changes, epigastric pain, and hyperreflexia",
      "Maintain seizure precautions: padded side rails, suction equipment, dim lighting, quiet environment"
    ],
    signs: {
      left: [
        "Hypertension ≥140/90 mmHg",
        "Proteinuria (foamy urine)",
        "Sudden weight gain (>2 lbs/week)",
        "Facial and hand edema",
        "Hyperreflexia with clonus"
      ],
      right: [
        "Severe persistent headache",
        "Visual disturbances (scotomata, blurred vision)",
        "Epigastric or right upper quadrant pain",
        "Oliguria (<500 mL/24hr)",
        "Pulmonary edema (dyspnea, crackles)"
      ]
    },
    medications: [
      { name: "Magnesium Sulfate", type: "Anticonvulsant/Tocolytic", action: "Blocks neuromuscular transmission and decreases CNS irritability; prevents and treats eclamptic seizures", sideEffects: "Flushing, hypotension, respiratory depression, decreased DTRs, cardiac arrest at toxic levels", contra: "Myasthenia gravis, heart block, renal failure (requires dose adjustment)", pearl: "Therapeutic range is 4-7 mEq/L; loss of DTRs occurs at 8-12 mEq/L; always have calcium gluconate at bedside" },
      { name: "Labetalol", type: "Combined alpha/beta blocker", action: "Reduces blood pressure through combined alpha-1 and beta-adrenergic blockade without reducing uteroplacental blood flow", sideEffects: "Bradycardia, hypotension, fatigue, bronchospasm", contra: "Asthma, heart block greater than first degree, severe bradycardia", pearl: "First-line IV antihypertensive for severe pre-eclampsia; can give escalating doses (20, 40, 80 mg)" }
    ],
    pearls: [
      "HELLP syndrome can occur without significant hypertension or proteinuria — always consider with RUQ pain and malaise",
      "Pre-eclampsia can develop up to 6 weeks postpartum; educate patients about warning signs after discharge",
      "Magnesium sulfate is continued for 24-48 hours postpartum to prevent eclamptic seizures",
      "Low-dose aspirin (81 mg daily) starting at 12-16 weeks is recommended for high-risk patients as prophylaxis"
    ],
    quiz: [
      { question: "A patient at 34 weeks gestation has a BP of 168/110 mmHg, 3+ proteinuria, and reports seeing spots. Which medication should the nurse anticipate administering first?", options: ["Oxytocin", "Magnesium sulfate", "Terbutaline", "Methylergonovine"], correct: 1, rationale: "Magnesium sulfate is the first-line medication for seizure prophylaxis in severe pre-eclampsia. The patient's symptoms (severe hypertension, proteinuria, visual disturbances) indicate severe pre-eclampsia with risk of eclamptic seizures." },
      { question: "While a patient is receiving magnesium sulfate, which finding requires the nurse to hold the infusion and notify the provider immediately?", options: ["Deep tendon reflexes 2+", "Respiratory rate of 10 breaths/min", "Urine output of 40 mL/hr", "Blood pressure of 148/92 mmHg"], correct: 1, rationale: "A respiratory rate below 12 breaths/min indicates magnesium toxicity and requires stopping the infusion. Normal DTRs (2+) and adequate urine output (>30 mL/hr) are expected findings. The BP is still elevated but not an indication to stop magnesium." },
      { question: "Which assessment finding in a postpartum patient should alert the nurse to the possibility of late-onset pre-eclampsia?", options: ["Lochia rubra on day 2", "Temperature of 100.2°F on day 1", "New-onset severe headache and blurred vision on day 4", "Breast engorgement on day 3"], correct: 2, rationale: "Pre-eclampsia can develop up to 6 weeks postpartum. New-onset severe headache and visual changes are classic warning signs that require immediate evaluation for blood pressure, proteinuria, and labs." }
    ]
  },

  "gestational-hypertension": {
    title: "Gestational Hypertension",
    cellular: {
      title: "Pathophysiology of Gestational Hypertension",
      content: "Gestational hypertension is defined as new-onset hypertension (systolic ≥140 mmHg or diastolic ≥90 mmHg) occurring after 20 weeks of gestation in a previously normotensive woman, without the presence of proteinuria or other features of pre-eclampsia.\n\nThe exact pathogenesis is not fully understood but is thought to involve an exaggerated cardiovascular response to pregnancy. Normal pregnancy involves significant hemodynamic changes including increased blood volume by 40-50%, increased cardiac output, and decreased systemic vascular resistance. In gestational hypertension, the decrease in vascular resistance is blunted.\n\nContributing factors include increased sensitivity to angiotensin II, impaired nitric oxide-mediated vasodilation, and altered prostaglandin balance favoring thromboxane A2 (vasoconstrictor) over prostacyclin (vasodilator). Unlike pre-eclampsia, gestational hypertension typically does not involve significant endothelial dysfunction or multi-organ involvement.\n\nHowever, gestational hypertension can progress to pre-eclampsia in up to 25-50% of cases, particularly when it develops before 34 weeks. Close surveillance is essential. Blood pressure typically normalizes within 12 weeks postpartum; persistent elevation suggests chronic hypertension that was masked by the physiologic vasodilation of early pregnancy."
    },
    riskFactors: [
      "Nulliparity",
      "Maternal age >40 years",
      "BMI >30 kg/m²",
      "History of gestational hypertension in prior pregnancy",
      "Family history of hypertension",
      "African American ethnicity",
      "Multiple gestation"
    ],
    diagnostics: [
      "BP ≥140/90 mmHg on two readings at least 4 hours apart after 20 weeks gestation",
      "Absence of proteinuria (urine protein/creatinine ratio <0.3)",
      "Normal platelet count, liver enzymes, and renal function",
      "Serial monitoring for progression to pre-eclampsia: weekly labs and urine protein",
      "Non-stress testing and ultrasound for fetal growth assessment"
    ],
    management: [
      "Antihypertensive medication if BP ≥160/110 mmHg (severe range): labetalol, nifedipine",
      "Close outpatient monitoring with twice-weekly BP checks for mild gestational hypertension",
      "Delivery at 37 weeks gestation if well-controlled without severe features",
      "Immediate delivery if severe features develop at any gestational age ≥34 weeks",
      "Postpartum monitoring for 72 hours; BP may worsen days 3-6 postpartum"
    ],
    nursingActions: [
      "Educate patient on home blood pressure monitoring technique and when to call provider",
      "Teach warning signs of progression: headache, visual changes, epigastric pain, sudden edema",
      "Ensure proper BP measurement: appropriate cuff size, sitting position, arm at heart level",
      "Monitor fetal status with kick counts education and scheduled non-stress tests",
      "Assess for medication side effects and compliance"
    ],
    signs: {
      left: [
        "Elevated blood pressure ≥140/90 mmHg",
        "No proteinuria",
        "Normal lab values initially",
        "Mild peripheral edema"
      ],
      right: [
        "Headache (may indicate progression)",
        "Visual disturbances (warning sign)",
        "Epigastric pain (suggests pre-eclampsia)",
        "Sudden weight gain from fluid retention"
      ]
    },
    medications: [
      { name: "Nifedipine", type: "Calcium channel blocker", action: "Relaxes vascular smooth muscle, reducing peripheral resistance and blood pressure without significantly affecting uteroplacental flow", sideEffects: "Headache, flushing, tachycardia, peripheral edema, dizziness", contra: "Concurrent use with magnesium sulfate requires caution (risk of severe hypotension); aortic stenosis", pearl: "Oral nifedipine (immediate-release 10 mg) can be used for acute severe hypertension; long-acting formulation for maintenance therapy" },
      { name: "Labetalol", type: "Combined alpha/beta blocker", action: "Lowers blood pressure through combined alpha and beta blockade; safe in pregnancy", sideEffects: "Bradycardia, fatigue, dizziness, bronchospasm", contra: "Asthma, severe bradycardia, greater than first-degree heart block", pearl: "Preferred oral antihypertensive in pregnancy; can be used both IV (acute) and PO (chronic)" }
    ],
    pearls: [
      "Gestational hypertension diagnosed before 34 weeks has a 50% chance of progressing to pre-eclampsia",
      "BP should be measured in the sitting position with appropriate cuff size; too-small cuffs give falsely high readings",
      "Women with gestational hypertension have increased cardiovascular risk later in life and should be counseled about long-term monitoring",
      "Methyldopa, while historically used, is less preferred due to sedation and slow onset"
    ],
    quiz: [
      { question: "Which finding distinguishes gestational hypertension from pre-eclampsia?", options: ["Blood pressure ≥140/90 mmHg", "Onset after 20 weeks gestation", "Absence of proteinuria and end-organ dysfunction", "Requiring antihypertensive medication"], correct: 2, rationale: "Gestational hypertension is differentiated from pre-eclampsia by the absence of proteinuria and other signs of end-organ dysfunction. Both conditions present with hypertension after 20 weeks gestation." },
      { question: "A nurse is caring for a patient at 30 weeks with gestational hypertension. Which finding requires immediate notification of the provider?", options: ["BP of 138/88 mmHg", "Trace edema in ankles", "New-onset epigastric pain and headache", "Fetal heart rate of 145 bpm"], correct: 2, rationale: "New-onset epigastric pain and headache suggest possible progression to pre-eclampsia or HELLP syndrome and require immediate evaluation including labs and assessment for severe features." }
    ]
  },

  "fetal-distress-recognition": {
    title: "Fetal Distress Recognition",
    cellular: {
      title: "Pathophysiology of Fetal Distress",
      content: "Fetal distress, more accurately termed non-reassuring fetal status, occurs when the fetus is unable to maintain adequate oxygenation. This can result from disruptions at any point in the oxygen delivery pathway: maternal oxygenation, uteroplacental blood flow, placental gas exchange, umbilical cord circulation, or fetal cardiovascular function.\n\nThe fetal heart rate (FHR) pattern reflects the balance between sympathetic and parasympathetic autonomic nervous system influences on the fetal heart. A well-oxygenated fetus demonstrates a normal baseline rate (110-160 bpm), moderate variability, presence of accelerations, and absence of concerning decelerations.\n\nWhen fetal hypoxemia develops, the fetus employs compensatory mechanisms including redistribution of blood flow to vital organs (brain, heart, adrenals), decreased fetal movements to conserve oxygen, and activation of the sympathetic nervous system. These compensatory responses manifest on the FHR tracing as changes in baseline, variability, and deceleration patterns.\n\nProlonged or severe hypoxemia overwhelms compensatory mechanisms, leading to metabolic acidosis from anaerobic metabolism. Lactic acid accumulation results in tissue damage. The brain is particularly vulnerable, and severe hypoxic-ischemic encephalopathy can result in cerebral palsy, seizures, or neonatal death. Meconium passage occurs as hypoxia stimulates vagal tone and relaxes the anal sphincter."
    },
    riskFactors: [
      "Placental insufficiency (pre-eclampsia, diabetes, post-term pregnancy)",
      "Umbilical cord compression or prolapse",
      "Placental abruption",
      "Maternal hypotension or hypoxia",
      "Uterine tachysystole (>5 contractions in 10 minutes)",
      "Intrauterine growth restriction (IUGR)",
      "Chorioamnionitis"
    ],
    diagnostics: [
      "Category III FHR tracing: absent variability with recurrent late decelerations, bradycardia, or sinusoidal pattern",
      "Fetal scalp pH <7.20 or lactate >4.8 mmol/L (when performed)",
      "Umbilical cord blood gas analysis after delivery: arterial pH <7.10",
      "Biophysical profile score ≤4 (when used antepartally)",
      "Meconium-stained amniotic fluid with abnormal FHR pattern"
    ],
    management: [
      "Intrauterine resuscitation: maternal repositioning (left lateral), IV fluid bolus, oxygen supplementation",
      "Discontinue oxytocin if uterine tachysystole is present",
      "Administer terbutaline 0.25 mg subcutaneously for tocolysis if tachysystole persists",
      "Amnioinfusion for recurrent variable decelerations from cord compression",
      "Expedite delivery (operative vaginal or cesarean) for persistent Category III tracings"
    ],
    nursingActions: [
      "Continuously monitor FHR and document pattern classification (Category I, II, or III)",
      "Reposition mother to left or right lateral to relieve cord compression and improve uteroplacental perfusion",
      "Administer IV fluid bolus (500-1000 mL lactated Ringer's) to improve maternal perfusion",
      "Notify provider immediately of Category III tracings or significant pattern changes",
      "Prepare for emergent delivery if intrauterine resuscitation is unsuccessful",
      "Document all interventions and fetal response"
    ],
    signs: {
      left: [
        "Late decelerations (mirror image of contractions)",
        "Absent or minimal FHR variability",
        "Fetal tachycardia (>160 bpm sustained)",
        "Prolonged deceleration (>2 minutes)"
      ],
      right: [
        "Meconium-stained amniotic fluid",
        "Loss of FHR accelerations",
        "Sinusoidal FHR pattern",
        "Fetal bradycardia (<110 bpm sustained)"
      ]
    },
    medications: [
      { name: "Terbutaline", type: "Beta-2 agonist tocolytic", action: "Relaxes uterine smooth muscle to reduce contraction frequency and allow improved uteroplacental blood flow during tachysystole", sideEffects: "Maternal tachycardia, tremor, hyperglycemia, hypokalemia, pulmonary edema", contra: "Maternal cardiac disease, uncontrolled hyperthyroidism, do not use for prolonged tocolysis", pearl: "Used as a single subcutaneous dose (0.25 mg) for acute tocolysis during fetal resuscitation; not for long-term use" }
    ],
    pearls: [
      "Category I FHR tracing (normal baseline, moderate variability, no late/variable decelerations) is reassuring and requires no intervention",
      "Late decelerations indicate uteroplacental insufficiency and reflect impaired oxygen exchange at the placenta",
      "Variable decelerations are the most common deceleration pattern and result from umbilical cord compression",
      "A sinusoidal pattern is ominous and may indicate severe fetal anemia (Rh isoimmunization, fetomaternal hemorrhage)"
    ],
    quiz: [
      { question: "A laboring patient's FHR tracing shows recurrent late decelerations with minimal variability. What is the nurse's priority action?", options: ["Increase the oxytocin infusion rate", "Reposition the patient and administer an IV fluid bolus", "Encourage the patient to push with the next contraction", "Prepare for a non-stress test"], correct: 1, rationale: "Recurrent late decelerations with minimal variability constitute a Category III tracing requiring immediate intrauterine resuscitation. Repositioning improves uteroplacental perfusion, and IV fluids improve maternal circulating volume. Oxytocin should be stopped, not increased." },
      { question: "Which FHR tracing pattern is most indicative of umbilical cord compression?", options: ["Late decelerations", "Variable decelerations", "Early decelerations", "Sinusoidal pattern"], correct: 1, rationale: "Variable decelerations are caused by umbilical cord compression. They are characterized by abrupt onset and variable timing relative to contractions. Late decelerations indicate uteroplacental insufficiency, early decelerations are benign (head compression), and sinusoidal patterns suggest severe fetal anemia." }
    ]
  },


  "umbilical-cord-complications": {
    title: "Umbilical Cord Complications",
    cellular: {
      title: "Umbilical Cord Complications",
      content: "The umbilical cord is the lifeline between the fetus and placenta, containing two arteries (carrying deoxygenated blood from fetus to placenta) and one vein (carrying oxygenated blood from placenta to fetus), all surrounded by Wharton's jelly, a gelatinous connective tissue that protects the vessels from compression.\n\nUmbilical cord prolapse occurs when the cord descends ahead of the presenting fetal part, either through the cervix (overt) or alongside the presenting part (occult/funic). When compressed between the fetus and the maternal pelvis or cervix, blood flow through the cord is obstructed, leading to acute fetal hypoxia and potentially fetal death within minutes if unrelieved.\n\nNuchal cord (cord wrapped around the fetal neck) occurs in 20-30% of deliveries. A loose nuchal cord usually causes no problems, but a tight nuchal cord can cause intermittent fetal heart rate decelerations from vagal stimulation and, if very tight, can restrict blood flow.\n\nVasa previa occurs when fetal blood vessels cross the internal cervical os, unsupported by the umbilical cord or placenta. Rupture of these vessels during membrane rupture causes fetal hemorrhage that can be rapidly fatal since the fetal blood volume is only 80-100 mL/kg. A true knot in the cord, while present in about 1% of deliveries, can tighten during labor and restrict blood flow."
    },
    riskFactors: [
      "Malpresentation (breech, transverse lie) for cord prolapse",
      "Premature rupture of membranes with unengaged presenting part",
      "Polyhydramnios (excessive amniotic fluid)",
      "Multiparity",
      "Long umbilical cord (>80 cm)",
      "Low-lying placenta or vasa previa",
      "Multiple gestation",
      "Artificial rupture of membranes (amniotomy)"
    ],
    diagnostics: [
      "Cord prolapse: visualization or palpation of cord at or below the presenting part on vaginal exam",
      "Sudden severe variable decelerations or prolonged fetal bradycardia after membrane rupture",
      "Vasa previa: transvaginal ultrasound with color Doppler identifying vessels over the internal os",
      "Apt test or Kleihauer-Betke test to differentiate fetal from maternal blood in vaginal bleeding",
      "Continuous electronic fetal monitoring showing cord compression patterns"
    ],
    management: [
      "Cord prolapse: immediately elevate the presenting part off the cord (examiner's hand in vagina lifting the fetal head), call for emergent cesarean delivery",
      "Knee-chest or Trendelenburg position to use gravity to relieve cord compression",
      "Fill the bladder with 500-700 mL normal saline via Foley catheter to elevate the presenting part",
      "Do NOT attempt to replace the cord into the uterus",
      "Vasa previa: planned cesarean delivery at 35-37 weeks before labor onset",
      "Nuchal cord: can often be reduced over the head during delivery or clamped and cut if tight"
    ],
    nursingActions: [
      "If cord prolapse detected: keep hand in vagina lifting the presenting part, do not remove hand until cesarean begins",
      "Position patient in knee-chest or steep Trendelenburg immediately",
      "Keep the exposed cord warm and moist with saline-soaked gauze (do not handle excessively)",
      "Notify the surgical team stat for emergency cesarean section",
      "Monitor FHR continuously and prepare for neonatal resuscitation",
      "Remain calm and communicate clearly with the patient and team"
    ],
    signs: {
      left: [
        "Visible or palpable cord at the introitus or cervix",
        "Sudden deep variable decelerations after ROM",
        "Prolonged fetal bradycardia",
        "Cord felt on vaginal exam during labor"
      ],
      right: [
        "Painless vaginal bleeding at ROM (vasa previa)",
        "FHR changes with contractions (nuchal cord)",
        "Sinusoidal FHR pattern (fetal anemia from vasa previa bleed)",
        "Fetal distress after amniotomy"
      ]
    },
    medications: [
      { name: "Terbutaline", type: "Beta-2 agonist tocolytic", action: "Inhibits uterine contractions to reduce pressure on the prolapsed cord while preparing for emergency cesarean", sideEffects: "Maternal tachycardia, tremor, palpitations, hyperglycemia", contra: "Should not delay preparation for cesarean; do not use if delivery is imminent", pearl: "A single dose (0.25 mg SQ) may be given to temporarily halt contractions during cord prolapse management" }
    ],
    pearls: [
      "Cord prolapse is one of the true obstetric emergencies with a goal of delivery within 10-15 minutes",
      "Always assess FHR immediately after spontaneous or artificial rupture of membranes",
      "Vasa previa has near 100% fetal mortality if undiagnosed and membranes rupture spontaneously",
      "Do not attempt to push the prolapsed cord back into the uterus — this causes vasospasm and worsens the situation"
    ],
    quiz: [
      { question: "After amniotomy, the nurse palpates the umbilical cord in the vagina. What is the priority nursing action?", options: ["Push the cord back into the uterus", "Apply gentle traction to the cord", "Elevate the presenting part off the cord with a gloved hand", "Place the patient in a supine position"], correct: 2, rationale: "The priority action in cord prolapse is to elevate the presenting part off the cord to relieve compression and maintain fetal oxygenation. The nurse should keep their hand in place until emergency cesarean delivery. Never attempt to replace the cord." },
      { question: "Which patient is at highest risk for umbilical cord prolapse?", options: ["Patient at 39 weeks with cephalic presentation and engaged head", "Patient at 35 weeks with frank breech presentation and ruptured membranes", "Patient at 40 weeks in active labor with vertex at +1 station", "Patient at 38 weeks with a well-engaged fetal head"], correct: 1, rationale: "Breech presentation with ruptured membranes is a significant risk factor for cord prolapse because the presenting part does not fill the pelvis completely, allowing the cord to slip past. An engaged vertex presentation leaves little room for cord prolapse." }
    ]
  },

  "placenta-accreta-spectrum": {
    title: "Placenta Accreta Spectrum",
    cellular: {
      title: "Pathophysiology of Placenta Accreta Spectrum",
      content: "Placenta accreta spectrum (PAS) disorders involve abnormal adherence of the placenta to the uterine wall due to a defective decidua basalis layer (Nitabuch's layer), which normally allows clean placental separation at delivery. The spectrum includes three variants of increasing severity based on the depth of placental invasion.\n\nIn placenta accreta (the most common, ~75% of cases), chorionic villi attach directly to the myometrium without invading it. In placenta increta (~15%), villi invade into the myometrium. In placenta percreta (~5%), villi penetrate through the full thickness of the myometrium and may invade adjacent organs such as the bladder or bowel.\n\nThe defect in the decidual layer is most commonly caused by uterine scarring from prior cesarean deliveries. The combination of placenta previa (placenta covering the cervical os) and prior cesarean scar dramatically increases risk. The incidence has risen sharply parallel to the increasing cesarean delivery rate.\n\nThe clinical significance is that the placenta cannot separate normally during the third stage of labor, leading to massive, life-threatening hemorrhage. Blood loss can exceed 3-5 liters. Without planned management, maternal mortality is significant. The standard treatment for severe PAS is planned cesarean hysterectomy with the placenta left in situ."
    },
    riskFactors: [
      "Prior cesarean delivery (risk increases with each subsequent cesarean)",
      "Placenta previa overlying a prior uterine scar",
      "Prior uterine surgery (myomectomy, D&C, Asherman's syndrome)",
      "Advanced maternal age (>35 years)",
      "Multiparity",
      "In vitro fertilization (IVF)",
      "Prior endometrial ablation"
    ],
    diagnostics: [
      "Prenatal ultrasound: loss of normal retroplacental clear zone, irregular vascular lacunae (Swiss cheese appearance), abnormal color Doppler flow",
      "MRI for assessment of depth of invasion and involvement of adjacent structures",
      "Elevated maternal serum AFP (unexplained) may be an incidental finding",
      "Intraoperative diagnosis: inability to separate placenta from uterine wall"
    ],
    management: [
      "Planned cesarean hysterectomy at 34-36 weeks with experienced multidisciplinary team",
      "Delivery at a tertiary care center with blood bank, interventional radiology, urology available",
      "Preoperative placement of ureteral stents if bladder involvement suspected (percreta)",
      "Massive transfusion protocol activation: type and cross for 6+ units PRBCs",
      "Leave the placenta in situ during hysterectomy — do NOT attempt manual removal",
      "Cell saver use for blood conservation during surgery"
    ],
    nursingActions: [
      "Ensure large-bore IV access (two 16-gauge or larger) before delivery",
      "Verify blood products are available and crossmatched prior to surgery",
      "Prepare for massive transfusion with blood warmer equipment ready",
      "Monitor vital signs every 5 minutes during active hemorrhage",
      "Maintain accurate intake and output including estimated blood loss",
      "Provide emotional support — unplanned hysterectomy has significant psychological impact"
    ],
    signs: {
      left: [
        "Placenta fails to separate during third stage of labor",
        "Retained placental tissue despite manual removal attempts",
        "Massive hemorrhage at delivery",
        "Ultrasound findings of abnormal placental appearance"
      ],
      right: [
        "Uterine rupture if undiagnosed percreta",
        "Hemorrhagic shock: tachycardia, hypotension, pallor",
        "DIC from massive hemorrhage",
        "Bladder invasion symptoms: hematuria (percreta)"
      ]
    },
    medications: [
      { name: "Oxytocin (Pitocin)", type: "Uterotonic", action: "Promotes uterine contraction to reduce hemorrhage; limited effectiveness in PAS since the placenta is abnormally adherent", sideEffects: "Water intoxication, hypotension with rapid IV administration", contra: "Will not resolve PAS pathology; primary management is surgical", pearl: "Used as part of hemorrhage management but definitive treatment is surgical (hysterectomy)" },
      { name: "Tranexamic Acid (TXA)", type: "Antifibrinolytic", action: "Inhibits fibrinolysis by blocking plasminogen activation, reducing blood loss during hemorrhage", sideEffects: "Nausea, vomiting, diarrhea, rare risk of thromboembolism", contra: "Active thromboembolic disease, history of seizures (high doses)", pearl: "WOMAN trial showed TXA reduces death from hemorrhage if given within 3 hours; dose is 1g IV over 10 minutes" }
    ],
    pearls: [
      "The combination of placenta previa + prior cesarean scar carries a PAS risk of 25-50% with 2+ prior cesareans",
      "NEVER attempt to manually remove a placenta in suspected PAS — this triggers uncontrollable hemorrhage",
      "Planned delivery at 34-36 weeks balances fetal maturity against the risk of emergent hemorrhage from labor onset",
      "Average blood loss in PAS cesarean hysterectomy is 2000-5000 mL — always prepare for massive transfusion"
    ],
    quiz: [
      { question: "A patient with placenta previa and two prior cesarean deliveries is at 33 weeks gestation. Ultrasound shows vascular lacunae and loss of the retroplacental clear zone. What is the most likely diagnosis?", options: ["Placental abruption", "Vasa previa", "Placenta accreta spectrum", "Gestational trophoblastic disease"], correct: 2, rationale: "Vascular lacunae and loss of the retroplacental clear zone on ultrasound in a patient with placenta previa and prior cesarean scars are classic findings of placenta accreta spectrum. The risk increases dramatically with each prior cesarean." },
      { question: "During a planned cesarean delivery for suspected placenta accreta, the surgeon confirms the placenta is invading the myometrium. What should the nurse anticipate?", options: ["Manual removal of the placenta", "Administration of misoprostol to detach the placenta", "Proceeding with cesarean hysterectomy with placenta left in situ", "Uterine massage and expectant management"], correct: 2, rationale: "The standard management for confirmed placenta accreta is cesarean hysterectomy with the placenta left in situ. Attempting manual removal causes massive, life-threatening hemorrhage." }
    ]
  },

  "postpartum-infection": {
    title: "Postpartum Infection",
    cellular: {
      title: "Pathophysiology of Postpartum Infection",
      content: "Postpartum infection (puerperal infection) encompasses any bacterial infection of the genital tract occurring after delivery. Endometritis (infection of the uterine lining) is the most common postpartum infection, followed by wound infections, urinary tract infections, mastitis, and septic pelvic thrombophlebitis.\n\nDuring delivery, the cervix is dilated and the uterine cavity is exposed to vaginal flora. The placental site provides a large, raw wound surface that is highly susceptible to bacterial colonization. Normal vaginal flora, including Group A and Group B Streptococcus, E. coli, anaerobic bacteria, and Staphylococcus, can ascend and establish infection.\n\nEndometritis is characterized by infection and inflammation of the decidua (endometrium), with potential extension to the myometrium (endomyometritis) or parametrial tissues (parametritis). Cesarean delivery is the single greatest risk factor, increasing the risk 5-20 fold compared to vaginal delivery due to surgical site contamination, tissue trauma, and the presence of foreign material (sutures).\n\nIf untreated, infection can progress to peritonitis, pelvic abscess, septic pelvic thrombophlebitis, or septic shock. Puerperal sepsis remains a leading cause of maternal mortality worldwide."
    },
    riskFactors: [
      "Cesarean delivery (greatest risk factor)",
      "Prolonged rupture of membranes (>18 hours)",
      "Prolonged labor with multiple vaginal examinations",
      "Internal fetal monitoring",
      "Chorioamnionitis during labor",
      "Manual removal of placenta or retained placental fragments",
      "Maternal anemia or immunosuppression",
      "Group B Streptococcus colonization without prophylaxis"
    ],
    diagnostics: [
      "Temperature ≥38.0°C (100.4°F) on any two of the first 10 postpartum days (excluding the first 24 hours)",
      "Elevated WBC (may be normal postpartum up to 25,000-30,000 — look for left shift or rising trend)",
      "Blood cultures if sepsis suspected",
      "Uterine tenderness on palpation",
      "Foul-smelling or purulent lochia",
      "Wound cultures for surgical site infections"
    ],
    management: [
      "Broad-spectrum IV antibiotics: clindamycin + gentamicin is the standard regimen for endometritis",
      "Add ampicillin if no improvement in 48 hours (to cover Enterococcus)",
      "Continue antibiotics until afebrile for 24-48 hours",
      "Wound infections: incision and drainage, wound care, antibiotics",
      "Imaging (CT/MRI) if septic pelvic thrombophlebitis suspected; add heparin anticoagulation",
      "Surgical intervention for pelvic abscess that does not respond to antibiotics"
    ],
    nursingActions: [
      "Monitor temperature every 4 hours and assess for trending fevers",
      "Assess lochia for amount, color, odor, and consistency at each assessment",
      "Palpate fundal height and uterine tenderness",
      "Ensure adequate hydration and nutrition for healing",
      "Administer antibiotics as prescribed and monitor for adverse reactions",
      "Educate patient on signs of worsening infection and when to seek emergency care after discharge"
    ],
    signs: {
      left: [
        "Fever ≥38°C (100.4°F) postpartum",
        "Uterine tenderness and subinvolution",
        "Foul-smelling or purulent lochia",
        "Tachycardia"
      ],
      right: [
        "Malaise and chills",
        "Erythema, warmth, or drainage from incision site",
        "Breast engorgement with localized warmth and erythema (mastitis)",
        "Lower abdominal pain"
      ]
    },
    medications: [
      { name: "Clindamycin", type: "Lincosamide antibiotic", action: "Inhibits bacterial protein synthesis by binding to the 50S ribosomal subunit; excellent anaerobic coverage for polymicrobial endometritis", sideEffects: "Diarrhea, Clostridioides difficile-associated colitis, rash, nausea", contra: "History of C. difficile infection, known hypersensitivity", pearl: "Clindamycin + gentamicin is the gold standard combination for postpartum endometritis" },
      { name: "Gentamicin", type: "Aminoglycoside antibiotic", action: "Inhibits bacterial protein synthesis by binding to the 30S ribosomal subunit; provides gram-negative coverage", sideEffects: "Nephrotoxicity, ototoxicity, neuromuscular blockade", contra: "Renal impairment (requires dose adjustment), myasthenia gravis", pearl: "Monitor trough levels to prevent toxicity; once-daily dosing is common for postpartum endometritis" }
    ],
    pearls: [
      "A single temperature elevation in the first 24 hours postpartum is usually from dehydration, not infection — reassess after hydration",
      "Prophylactic antibiotics before cesarean incision (not after cord clamp) reduce endometritis by 50%",
      "If fever persists after 72 hours of appropriate antibiotics, consider septic pelvic thrombophlebitis, wound abscess, or drug fever",
      "Breastfeeding should continue during mastitis treatment — emptying the breast aids recovery"
    ],
    quiz: [
      { question: "A patient who delivered via cesarean section 3 days ago has a temperature of 39°C, uterine tenderness, and foul-smelling lochia. Which antibiotic combination should the nurse anticipate?", options: ["Amoxicillin and metronidazole", "Clindamycin and gentamicin", "Cephalexin alone", "Vancomycin and meropenem"], correct: 1, rationale: "Clindamycin plus gentamicin is the standard empiric regimen for postpartum endometritis. This combination provides broad coverage against the polymicrobial organisms (aerobic and anaerobic) typically responsible." },
      { question: "Which assessment finding is most consistent with postpartum endometritis?", options: ["Temperature of 37.8°C at 12 hours postpartum", "Lochia rubra with a mild, fleshy odor on day 2", "Boggy, tender uterus with purulent foul-smelling lochia and fever on day 3", "Breast engorgement with low-grade fever on day 3"], correct: 2, rationale: "A boggy tender uterus with purulent foul-smelling lochia and fever after 24 hours postpartum is the classic presentation of endometritis. Mild early temperature elevation and normal lochia are expected findings." }
    ]
  },


  "croup-management": {
    title: "Croup Management",
    cellular: {
      title: "Pathophysiology of Croup",
      content: "Croup (laryngotracheobronchitis) is an acute viral infection of the upper airway that causes inflammation and edema of the subglottic region — the narrowest portion of the pediatric airway. It is most commonly caused by parainfluenza virus (types 1 and 3 account for ~75% of cases), though RSV, influenza, and adenovirus can also be causative.\n\nThe pediatric airway is anatomically different from the adult airway in critical ways that predispose to obstruction. The child's larynx is funnel-shaped (compared to cylindrical in adults), the cricoid ring is the narrowest point (vs. glottis in adults), and the subglottic tissue is loose and highly vascular, making it prone to rapid edema formation.\n\nAccording to Poiseuille's law, airway resistance is inversely proportional to the fourth power of the radius. Therefore, even 1 mm of edema in an infant's airway (which has a diameter of approximately 4 mm) reduces the cross-sectional area by 75% and increases resistance 16-fold. This explains why small amounts of swelling cause dramatic symptoms in young children.\n\nThe inflammatory edema of the subglottic tissues produces the characteristic \"steeple sign\" on anteroposterior neck radiograph (narrowing of the subglottic airway). Clinical manifestations include inspiratory stridor (turbulent airflow through the narrowed airway), a distinctive barky cough (from laryngeal inflammation), and hoarseness."
    },
    riskFactors: [
      "Age 6 months to 3 years (peak incidence at 2 years)",
      "Male sex (1.5:1 male-to-female ratio)",
      "Fall and early winter season",
      "Exposure to viral respiratory infections in daycare settings",
      "History of prior croup episodes",
      "Premature birth or congenital airway anomalies"
    ],
    diagnostics: [
      "Clinical diagnosis based on characteristic barky cough, inspiratory stridor, and hoarseness",
      "AP neck radiograph showing steeple sign (subglottic narrowing) — supportive but not required for diagnosis",
      "Westley croup score for severity assessment: stridor, retractions, air entry, cyanosis, level of consciousness",
      "Pulse oximetry to assess oxygenation",
      "Rule out epiglottitis: croup has gradual onset, low-grade fever; epiglottitis has acute onset, high fever, drooling, tripod positioning"
    ],
    management: [
      "Mild croup: cool mist humidifier, comfort measures, keep child calm (crying worsens obstruction)",
      "Moderate croup: single dose of oral dexamethasone (0.6 mg/kg, max 10 mg)",
      "Severe croup with stridor at rest: nebulized racemic epinephrine (0.5 mL of 2.25% in 3 mL NS) plus dexamethasone",
      "Observe for at least 2-4 hours after racemic epinephrine due to rebound effect",
      "Helium-oxygen mixture (heliox) may be considered for severe cases not responding to standard therapy",
      "Rarely, intubation with a smaller-than-age-appropriate ETT if complete obstruction imminent"
    ],
    nursingActions: [
      "Maintain a calm environment — agitation and crying increase oxygen demand and worsen obstruction",
      "Allow the child to remain in a position of comfort (usually upright in parent's lap)",
      "Monitor for signs of worsening respiratory distress: increasing stridor at rest, retractions, cyanosis, altered LOC",
      "Administer humidified oxygen if SpO2 <92%",
      "Observe for rebound stridor 2-4 hours after racemic epinephrine administration",
      "Educate parents that barky cough may persist for several days but should gradually improve"
    ],
    signs: {
      left: [
        "Barky (seal-like) cough",
        "Inspiratory stridor",
        "Hoarseness",
        "Low-grade fever (38-39°C)"
      ],
      right: [
        "Suprasternal and intercostal retractions",
        "Worsening symptoms at night",
        "Agitation or restlessness with severe obstruction",
        "Decreased air entry on auscultation"
      ]
    },
    medications: [
      { name: "Dexamethasone", type: "Corticosteroid", action: "Reduces subglottic inflammation and edema through anti-inflammatory effects; decreases capillary permeability and swelling", sideEffects: "Hyperglycemia, behavioral changes, increased appetite; single dose has minimal side effects", contra: "Active untreated infection (systemic fungal); single dose is safe in most patients", pearl: "Single oral dose (0.6 mg/kg, max 10 mg) is the cornerstone of croup treatment; effective within 2-4 hours, lasts 48-72 hours" },
      { name: "Racemic Epinephrine", type: "Adrenergic agonist", action: "Causes local vasoconstriction of subglottic mucosal blood vessels, rapidly reducing edema and improving airway patency", sideEffects: "Tachycardia, rebound edema (symptoms may worsen 2-4 hours after dose), tremor", contra: "Underlying cardiac conditions (use with caution)", pearl: "Effects last only 1-2 hours with risk of rebound edema; always observe child for at least 2-4 hours after administration" }
    ],
    pearls: [
      "Croup is a clinical diagnosis — X-rays are not routinely needed and should not delay treatment",
      "Cool night air often temporarily improves symptoms (explains why some children improve during the ride to the ER)",
      "Do not examine the throat with a tongue depressor in a child with suspected croup — this can cause laryngospasm",
      "Most children can be safely discharged after a single dose of dexamethasone; racemic epinephrine requires an observation period"
    ],
    quiz: [
      { question: "A 2-year-old presents with a barky cough, inspiratory stridor at rest, and moderate suprasternal retractions. What is the priority intervention?", options: ["Obtain a throat culture", "Administer nebulized racemic epinephrine and oral dexamethasone", "Start IV antibiotics", "Perform a lateral neck X-ray"], correct: 1, rationale: "Stridor at rest with retractions indicates moderate-to-severe croup requiring nebulized racemic epinephrine for rapid relief of airway edema and dexamethasone for sustained anti-inflammatory effect. Croup is viral, so antibiotics are not indicated." },
      { question: "After receiving racemic epinephrine, a child with croup appears to improve significantly. When is it safe to discharge the child?", options: ["Immediately after symptoms resolve", "After 30 minutes of observation", "After 2-4 hours of observation for rebound symptoms", "Only after 24 hours of observation"], correct: 2, rationale: "Racemic epinephrine provides temporary relief lasting 1-2 hours, after which rebound edema can occur. A minimum 2-4 hour observation period is required to ensure symptoms do not recur before safe discharge." }
    ]
  },

  "failure-to-thrive": {
    title: "Failure to Thrive",
    cellular: {
      title: "Pathophysiology of Failure to Thrive",
      content: "Failure to thrive (FTT) is not a specific disease but a descriptive term for inadequate physical growth in infants and young children, defined as weight below the 3rd percentile for age, weight-for-length below the 3rd percentile, or a downward crossing of two or more major percentile lines on the growth chart over time.\n\nThe fundamental mechanism is an imbalance between caloric intake and caloric requirements. This can result from inadequate caloric intake (most common), inadequate caloric absorption, excessive caloric expenditure, or a combination of these factors.\n\nOrganic causes include gastrointestinal conditions (GERD, celiac disease, pyloric stenosis, inflammatory bowel disease), endocrine disorders (hypothyroidism, growth hormone deficiency), chronic infections (HIV, tuberculosis), cardiac disease (congenital heart defects), neurological conditions (cerebral palsy affecting feeding), and metabolic disorders.\n\nNon-organic (psychosocial) causes include inadequate feeding knowledge, poverty/food insecurity, neglect or abuse, maternal depression, substance abuse in the household, and dysfunctional parent-child feeding interactions. Mixed causes are common.\n\nProlonged malnutrition during critical periods of brain development (first 2 years) can result in permanent cognitive deficits, impaired immune function, and long-term growth stunting. The brain grows most rapidly in the first year, reaching 70% of adult size."
    },
    riskFactors: [
      "Poverty and food insecurity",
      "Maternal depression or mental illness",
      "Substance abuse in the home",
      "Premature birth or low birth weight",
      "Chronic medical conditions (congenital heart disease, cystic fibrosis, GERD)",
      "Neglect or inadequate parenting skills",
      "Social isolation of the family",
      "Developmental delays affecting feeding ability"
    ],
    diagnostics: [
      "Serial growth measurements plotted on standardized growth charts (weight, length, head circumference)",
      "Weight below 3rd percentile or crossing 2+ percentile lines downward",
      "Detailed feeding history: type, frequency, volume, preparation of formula",
      "Complete metabolic panel, CBC, urinalysis, thyroid function tests",
      "Celiac panel, sweat chloride test if malabsorption suspected",
      "Observation of parent-child feeding interaction"
    ],
    management: [
      "Increase caloric density of feeds (concentrate formula from 20 to 24-27 kcal/oz, add MCT oil or fortifiers)",
      "Address underlying organic causes with appropriate medical treatment",
      "Nutritional counseling and feeding education for caregivers",
      "Social work involvement for assessment of home environment and resource needs",
      "Scheduled follow-up visits for weight checks (weekly to biweekly initially)",
      "Hospitalization for severe cases, diagnostic workup, or if neglect/abuse is suspected"
    ],
    nursingActions: [
      "Obtain accurate weight, length, and head circumference at each visit; plot on growth chart",
      "Perform thorough feeding assessment: observe a feeding, assess technique, latch, intake volume",
      "Assess parent-child interaction during feeding and other activities",
      "Screen for postpartum depression in the mother/primary caregiver",
      "Provide non-judgmental education on feeding techniques, schedules, and caloric requirements",
      "Connect family with community resources: WIC, food banks, home visiting programs"
    ],
    signs: {
      left: [
        "Weight <3rd percentile or falling off growth curve",
        "Wasted appearance with decreased subcutaneous fat",
        "Developmental delays (motor, language)",
        "Weak cry, poor muscle tone"
      ],
      right: [
        "Signs of neglect: poor hygiene, inappropriate clothing",
        "Irritability or apathy",
        "Avoidant or anxious behavior during feeding",
        "Thin, dull hair and poor skin turgor"
      ]
    },
    medications: [
      { name: "Iron Supplement (Ferrous Sulfate)", type: "Mineral supplement", action: "Replaces iron stores depleted from inadequate nutrition; essential for hemoglobin synthesis and cognitive development", sideEffects: "Constipation, dark stools, nausea, teeth staining with liquid formulations", contra: "Hemochromatosis, iron-loading anemias", pearl: "Give on an empty stomach with vitamin C (juice) to enhance absorption; use a straw for liquid forms to prevent teeth staining" },
      { name: "Multivitamin with Zinc", type: "Nutritional supplement", action: "Provides essential micronutrients commonly deficient in malnourished children; zinc is critical for immune function and growth", sideEffects: "GI upset if taken on empty stomach", contra: "Known hypersensitivity to components", pearl: "Zinc supplementation can reduce duration of diarrhea and improve appetite in malnourished children" }
    ],
    pearls: [
      "Weight is affected first, then length, then head circumference — head circumference is spared longest in malnutrition",
      "Catch-up growth in hospitalized children with non-organic FTT who gain weight on adequate calories confirms the diagnosis",
      "Always assess the caregiver's understanding of formula preparation — errors in dilution are a common cause",
      "FTT is a mandatory reporting concern when there is suspicion of neglect or abuse"
    ],
    quiz: [
      { question: "A 6-month-old infant is at the 2nd percentile for weight and has dropped from the 25th percentile over the past 3 months. The mother reports the infant takes only 2-3 ounces of formula every 5-6 hours. What is the nurse's priority assessment?", options: ["Obtain a sweat chloride test", "Observe a feeding and assess formula preparation", "Order a brain MRI", "Recommend switching to solid foods"], correct: 1, rationale: "The feeding pattern suggests inadequate caloric intake, which is the most common cause of FTT. Observing a feeding and assessing formula preparation can identify errors in mixing, feeding technique, or parent-child interaction that may be contributing." },
      { question: "Which growth pattern finding is most characteristic of failure to thrive?", options: ["Head circumference at the 5th percentile with weight at the 50th percentile", "Weight crossing downward across two major percentile lines over time", "Length and weight both tracking along the 10th percentile consistently", "Weight at the 50th percentile with length at the 5th percentile"], correct: 1, rationale: "FTT is defined by weight falling across two or more major percentile lines on the growth chart. A child tracking consistently at a lower percentile may simply be constitutionally small. FTT reflects a change from the child's previous growth trajectory." }
    ]
  },

  "sudden-infant-death-syndrome": {
    title: "Sudden Infant Death Syndrome",
    cellular: {
      title: "Sudden Infant Death Syndrome",
      content: "Sudden Infant Death Syndrome (SIDS) is defined as the sudden, unexplained death of an infant under one year of age that remains unexplained after thorough investigation, including a complete autopsy, examination of the death scene, and review of the clinical history. It is the leading cause of death in infants between 1 month and 1 year of age in developed countries.\n\nThe triple-risk model is the most widely accepted etiological framework. It proposes that SIDS occurs when three factors converge: (1) a vulnerable infant with an underlying brainstem abnormality in cardiorespiratory control, (2) a critical developmental period (2-4 months of age when autonomic control is immature), and (3) an exogenous stressor (prone sleeping, overheating, soft bedding, bed sharing).\n\nResearch has identified abnormalities in serotonin (5-HT) neurotransmission in the brainstem of many SIDS victims. Serotonergic neurons in the medullary raphe are critical for protective responses to hypoxia and hypercarbia during sleep, including arousal, head turning, and gasping. Infants with deficient serotonin signaling may fail to arouse or reposition when face-down or rebreathing exhaled CO2.\n\nProne sleeping increases SIDS risk through several mechanisms: rebreathing of exhaled CO2 from soft surfaces, upper airway obstruction, impaired heat dissipation, and altered autonomic cardiovascular control. The back-to-sleep campaign has reduced SIDS rates by >50% since its introduction in the 1990s."
    },
    riskFactors: [
      "Prone (face-down) sleeping position",
      "Soft sleep surfaces, loose bedding, pillows, bumper pads",
      "Bed sharing (co-sleeping) especially with smokers or intoxicated parents",
      "Prenatal and postnatal exposure to tobacco smoke",
      "Prematurity and low birth weight",
      "Overheating (excessive clothing or high room temperature)",
      "Male sex (60% of SIDS cases)",
      "Maternal factors: young age, substance use, late or no prenatal care"
    ],
    diagnostics: [
      "SIDS is a diagnosis of exclusion — made only after thorough investigation",
      "Complete autopsy to rule out other causes of death (cardiac anomalies, metabolic disorders, infection, abuse)",
      "Death scene investigation by trained personnel",
      "Review of infant's medical history and circumstances of death",
      "Toxicology and metabolic screening"
    ],
    management: [
      "Prevention is the primary management — there is no treatment for SIDS",
      "Safe Sleep guidelines (ABCs): Alone, on their Back, in a Crib with no loose items",
      "Firm, flat sleep surface with a fitted sheet only",
      "Room sharing without bed sharing for the first 6-12 months",
      "Offer a pacifier at nap and bedtime (protective — mechanism involves increased arousal)",
      "Maintain comfortable room temperature and avoid overheating",
      "Eliminate smoke exposure prenatally and postnatally"
    ],
    nursingActions: [
      "Educate ALL new parents and caregivers on safe sleep practices at every encounter",
      "Model safe sleep in the hospital: always place infants supine in the bassinet with no extra items",
      "Address cultural beliefs and family traditions that may conflict with safe sleep practices sensitively",
      "Provide grief support and resources if a SIDS death has occurred in the family",
      "Teach that tummy time should occur only when the infant is awake and supervised",
      "Educate on the dangers of bed sharing, especially with risk factors (smoking, alcohol, medications)"
    ],
    signs: {
      left: [
        "Infant found unresponsive in sleep environment",
        "No prior symptoms or illness (apparently healthy infant)",
        "No signs of struggle or external trauma",
        "Age typically 2-4 months (peak incidence)"
      ],
      right: [
        "Lividity and rigor mortis at scene",
        "Blood-tinged froth from nose/mouth (common postmortem finding)",
        "No identifiable cause of death on autopsy",
        "History of unsafe sleep environment"
      ]
    },
    medications: [
      { name: "Caffeine Citrate", type: "Methylxanthine stimulant", action: "Stimulates the central respiratory center in the brainstem to reduce apnea of prematurity, which is a separate condition from SIDS but shares risk factors in premature infants", sideEffects: "Tachycardia, jitteriness, feeding intolerance, insomnia", contra: "Seizure disorders; use with caution in cardiac arrhythmias", pearl: "Used in NICUs for apnea of prematurity, not SIDS directly; there is no medication that prevents SIDS — prevention is environmental" }
    ],
    pearls: [
      "The ABCs of safe sleep: Alone, Back, Crib — the most critical teaching for all new parents",
      "SIDS risk peaks at 2-4 months of age; 90% of cases occur before 6 months",
      "Home apnea monitors have NOT been shown to prevent SIDS and should not be recommended for this purpose",
      "Breastfeeding is associated with a 50% reduction in SIDS risk — mechanism may involve improved arousal responses"
    ],
    quiz: [
      { question: "A nurse is providing discharge teaching to new parents. Which statement by the parent indicates understanding of safe sleep practices?", options: ["I will place my baby on her tummy to prevent choking", "I will put my baby to sleep on her back in her own crib with just a fitted sheet", "I will use soft bumper pads to protect my baby in the crib", "I will bring my baby into bed with me for nighttime feedings"], correct: 1, rationale: "Placing the infant supine (on the back) in their own crib with only a fitted sheet follows all safe sleep guidelines. Prone positioning, bumper pads, and bed sharing all increase SIDS risk." },
      { question: "Which infant has the highest risk for SIDS?", options: ["A 6-month-old breastfed infant who sleeps in a crib in the parents' room", "A 3-month-old premature male infant whose mother smokes and sleeps in the parents' bed", "A 9-month-old infant who sleeps on their back with a pacifier", "A 4-month-old full-term infant who room-shares in a bassinet"], correct: 1, rationale: "This infant has multiple high-risk factors: age in the peak range (3 months), male sex, prematurity, maternal smoking, and bed sharing. Each of these independently increases risk, and the combination is synergistic." }
    ]
  },

  "pediatric-sepsis-recognition": {
    title: "Pediatric Sepsis Recognition",
    cellular: {
      title: "Pathophysiology of Pediatric Sepsis",
      content: "Pediatric sepsis is a life-threatening organ dysfunction caused by a dysregulated host response to infection. Unlike adults, children have unique physiological responses to sepsis. They can maintain blood pressure through intense vasoconstriction and tachycardia until late in the disease course, at which point they decompensate rapidly and catastrophically.\n\nThe infectious trigger activates the innate immune system, leading to release of pro-inflammatory cytokines (TNF-alpha, IL-1, IL-6) that cause widespread endothelial dysfunction, increased vascular permeability, and vasodilation. This results in capillary leak, third-spacing of fluids, and distributive shock.\n\nMyocardial dysfunction is more common in pediatric sepsis than in adults. Children typically develop a 'cold shock' phenotype characterized by decreased cardiac output with compensatory vasoconstriction (cold extremities, prolonged capillary refill, weak pulses) rather than the 'warm shock' seen more often in adults (vasodilated, bounding pulses).\n\nThe coagulation cascade is simultaneously activated, leading to microvascular thrombosis and consumption of clotting factors (DIC). Organ dysfunction follows as perfusion to vital organs decreases. Without aggressive fluid resuscitation and vasopressor support, multi-organ failure develops within hours. Mortality from pediatric septic shock ranges from 5-10% in developed countries but increases significantly with each hour of delayed treatment."
    },
    riskFactors: [
      "Age <1 year (especially neonates)",
      "Immunocompromised status (chemotherapy, HIV, immunodeficiency disorders)",
      "Indwelling central venous catheters or other invasive devices",
      "Recent surgery or trauma",
      "Sickle cell disease (functional asplenia)",
      "Congenital heart disease",
      "Chronic lung disease or other chronic medical conditions",
      "Malnutrition"
    ],
    diagnostics: [
      "SIRS criteria in children (age-specific vital sign ranges): fever or hypothermia, tachycardia, tachypnea, abnormal WBC",
      "Blood cultures (at least 2 sets) before antibiotic administration",
      "Complete blood count with differential: leukocytosis, leukopenia, bandemia, thrombocytopenia",
      "Serum lactate >2 mmol/L (marker of tissue hypoperfusion)",
      "C-reactive protein and procalcitonin (infection markers)",
      "Comprehensive metabolic panel, coagulation studies for organ dysfunction assessment",
      "Urinalysis, chest X-ray, CSF analysis based on clinical presentation"
    ],
    management: [
      "Aggressive fluid resuscitation: 20 mL/kg isotonic crystalloid bolus over 5-10 minutes, repeat up to 60 mL/kg in the first hour",
      "Broad-spectrum antibiotics within 1 hour of recognition (do not delay for cultures if unable to obtain promptly)",
      "Vasoactive medications if fluid-refractory shock: epinephrine for cold shock, norepinephrine for warm shock",
      "Correct hypoglycemia (common in children with sepsis) and electrolyte abnormalities",
      "Consider corticosteroids (hydrocortisone) for catecholamine-resistant shock",
      "Target-directed therapy: ScvO2 >70%, MAP appropriate for age, capillary refill <2 seconds"
    ],
    nursingActions: [
      "Obtain IV or IO access within 5 minutes; administer fluid boluses rapidly using push-pull technique",
      "Administer antibiotics within 1 hour of sepsis recognition — every hour of delay increases mortality",
      "Assess perfusion frequently: capillary refill, mental status, pulse quality, urine output",
      "Monitor point-of-care glucose and treat hypoglycemia (<60 mg/dL) with D10W or D25W",
      "Weigh the child for accurate medication and fluid dosing",
      "Use age-appropriate vital sign reference ranges — do not apply adult parameters to children"
    ],
    signs: {
      left: [
        "Tachycardia (earliest sign, age-specific)",
        "Fever >38.5°C or hypothermia <36°C",
        "Altered mental status (irritability, lethargy, inconsolable crying)",
        "Tachypnea"
      ],
      right: [
        "Prolonged capillary refill >2 seconds (cold shock)",
        "Mottled or pale skin, cool extremities",
        "Weak or thready peripheral pulses",
        "Decreased urine output (<1 mL/kg/hr)"
      ]
    },
    medications: [
      { name: "Epinephrine", type: "Catecholamine vasopressor/inotrope", action: "Alpha and beta-adrenergic agonist that increases cardiac contractility, heart rate, and peripheral vasoconstriction; first-line for pediatric cold septic shock", sideEffects: "Tachyarrhythmias, hypertension, tissue ischemia with extravasation, hyperglycemia", contra: "Requires central line for continuous infusion (peripheral acceptable in emergency for short term)", pearl: "First-line vasopressor for pediatric cold septic shock (cold extremities, poor perfusion); start at 0.05-0.1 mcg/kg/min" },
      { name: "Ceftriaxone", type: "Third-generation cephalosporin", action: "Broad-spectrum bactericidal antibiotic inhibiting cell wall synthesis; covers common pediatric pathogens including S. pneumoniae, N. meningitidis, E. coli", sideEffects: "Diarrhea, rash, biliary sludging, rarely Stevens-Johnson syndrome", contra: "Neonates with hyperbilirubinemia (displaces bilirubin from albumin); do not co-infuse with calcium-containing solutions in neonates", pearl: "Excellent empiric choice for pediatric sepsis; often combined with vancomycin if MRSA suspected" }
    ],
    pearls: [
      "Hypotension is a LATE sign in pediatric sepsis — children compensate with tachycardia and vasoconstriction; do not wait for hypotension to intervene",
      "The Sepsis Bundle: obtain cultures, give antibiotics, and start fluid resuscitation within 1 hour",
      "Cold shock (poor perfusion, vasoconstriction) is more common in children; warm shock (vasodilation) is more common in adults",
      "Point-of-care lactate >4 mmol/L is associated with significantly increased mortality and need for vasopressors"
    ],
    quiz: [
      { question: "A 3-year-old presents with fever of 39.5°C, heart rate of 180, capillary refill of 4 seconds, and cold mottled extremities. Blood pressure is 90/60 mmHg. What type of shock is this child most likely experiencing?", options: ["Cardiogenic shock", "Warm septic shock", "Cold septic shock", "Neurogenic shock"], correct: 2, rationale: "The combination of fever, tachycardia, prolonged capillary refill, and cold mottled extremities with maintained blood pressure is characteristic of compensated cold septic shock. The child is vasoconstricted to maintain BP despite inadequate cardiac output." },
      { question: "After administering 60 mL/kg of isotonic fluids to a septic child, the capillary refill remains 5 seconds and heart rate is unchanged. What should the nurse anticipate next?", options: ["Additional fluid boluses up to 100 mL/kg", "Initiation of vasopressor therapy (epinephrine infusion)", "Discontinuation of IV fluids due to fluid overload risk", "Oral rehydration therapy"], correct: 1, rationale: "Fluid-refractory shock (persistent signs after 40-60 mL/kg) requires vasopressor support. Epinephrine is the first-line vasopressor for pediatric cold septic shock. Further fluid boluses may be given but vasopressor initiation should not be delayed." }
    ]
  },

  "pediatric-respiratory-distress": {
    title: "Pediatric Respiratory Distress",
    cellular: {
      title: "Pediatric Respiratory Distress",
      content: "Respiratory distress is the most common reason for pediatric emergency department visits and the leading cause of cardiopulmonary arrest in children. Unlike adults, where cardiac arrest is typically primary, pediatric cardiac arrest is almost always secondary to respiratory failure, making early recognition and intervention critical.\n\nChildren are anatomically and physiologically predisposed to respiratory compromise. Their tongues are proportionally larger, airways are narrower with more compliant cartilage, and the epiglottis is floppy and omega-shaped. They have fewer alveoli (infants have ~50 million vs. 300 million in adults), less collateral ventilation, and a more compliant chest wall that makes work of breathing less efficient.\n\nPediatric respiratory distress can be categorized by the level of airway affected. Upper airway obstruction (croup, foreign body, epiglottitis) presents with inspiratory stridor. Lower airway obstruction (asthma, bronchiolitis) presents with expiratory wheezing and prolonged expiration. Parenchymal disease (pneumonia) presents with crackles, grunting, and hypoxemia.\n\nAs respiratory distress progresses to respiratory failure, compensatory mechanisms (tachypnea, accessory muscle use) become exhausted. Signs of decompensation include decreased or absent breath sounds, bradycardia (vagal response to hypoxia), altered mental status, cyanosis, and ultimately respiratory arrest followed rapidly by cardiac arrest."
    },
    riskFactors: [
      "Age <2 years (smaller airway, less respiratory reserve)",
      "Prematurity with chronic lung disease",
      "Congenital airway abnormalities",
      "Asthma or reactive airway disease",
      "Neuromuscular disorders affecting respiratory muscles",
      "Immunodeficiency increasing susceptibility to respiratory infections",
      "Environmental exposures (tobacco smoke, air pollution)",
      "Foreign body aspiration (peak age 1-3 years)"
    ],
    diagnostics: [
      "Clinical assessment: respiratory rate, work of breathing, air entry, mental status, SpO2",
      "Pediatric Assessment Triangle: appearance, work of breathing, circulation",
      "Chest X-ray to evaluate for pneumonia, foreign body, pneumothorax, cardiomegaly",
      "ABG or VBG for pH, PCO2, PO2 assessment in severe distress",
      "Peak flow measurement in children >5 years with known asthma",
      "RSV and influenza rapid testing when appropriate",
      "Capnography for monitoring ventilation trends"
    ],
    management: [
      "Position of comfort (usually upright); allow child to assume preferred position",
      "Supplemental oxygen to maintain SpO2 ≥94% (≥90% in bronchiolitis without risk factors)",
      "Nebulized albuterol for bronchospasm (0.15 mg/kg, minimum 2.5 mg)",
      "Nebulized ipratropium bromide for moderate-severe asthma exacerbations",
      "Systemic corticosteroids for asthma exacerbation (prednisolone 1-2 mg/kg)",
      "High-flow nasal cannula (HFNC) for escalating respiratory support before intubation",
      "Bag-mask ventilation and prepare for intubation if respiratory failure is imminent"
    ],
    nursingActions: [
      "Perform rapid assessment using the Pediatric Assessment Triangle upon arrival",
      "Minimize agitation — allow child to stay with parent; avoid unnecessary procedures that increase oxygen demand",
      "Apply continuous pulse oximetry and cardiorespiratory monitoring",
      "Suction nasal secretions gently with bulb syringe for infants with nasal congestion",
      "Assess and document respiratory rate, effort, breath sounds, color, and mental status frequently",
      "Have emergency equipment at bedside: appropriately sized bag-mask, suction, intubation supplies"
    ],
    signs: {
      left: [
        "Tachypnea (age-specific: >60 in infants, >40 in toddlers, >20 in school-age)",
        "Nasal flaring",
        "Intercostal, subcostal, and suprasternal retractions",
        "Head bobbing in infants"
      ],
      right: [
        "Grunting (indicating alveolar collapse)",
        "Stridor (upper airway obstruction)",
        "Wheezing (lower airway obstruction)",
        "Cyanosis (late, ominous sign)",
        "Decreased or absent breath sounds"
      ]
    },
    medications: [
      { name: "Albuterol", type: "Short-acting beta-2 agonist bronchodilator", action: "Relaxes bronchial smooth muscle by stimulating beta-2 receptors, opening narrowed airways and improving air flow", sideEffects: "Tachycardia, tremor, hyperactivity, hypokalemia, headache", contra: "Use with caution in cardiac arrhythmias; not effective in bronchiolitis (viral-induced)", pearl: "Nebulized albuterol is the first-line rescue medication for acute bronchospasm; can be given continuously in severe exacerbations" },
      { name: "Prednisolone", type: "Systemic corticosteroid", action: "Reduces airway inflammation, decreases mucus production, and potentiates the effects of beta-2 agonists", sideEffects: "Hyperglycemia, increased appetite, behavioral changes, immunosuppression with prolonged use", contra: "Active varicella or herpes infection; systemic fungal infection", pearl: "Give early in asthma exacerbations — onset of action is 4-6 hours; typical course is 3-5 days, no taper needed for short courses" }
    ],
    pearls: [
      "A quiet chest in a child with respiratory distress is an ominous sign — it means air movement is so poor that no sounds are generated",
      "Bradycardia in a child with respiratory distress indicates imminent respiratory arrest — prepare for intervention immediately",
      "Grunting is a compensatory mechanism to maintain positive end-expiratory pressure (auto-PEEP) and prevent alveolar collapse",
      "The Pediatric Assessment Triangle (Appearance, Work of Breathing, Circulation) can be completed in 30 seconds from the doorway"
    ],
    quiz: [
      { question: "A 10-month-old with bronchiolitis has a respiratory rate of 68, subcostal retractions, nasal flaring, and an SpO2 of 88% on room air. What is the nurse's priority action?", options: ["Administer nebulized albuterol", "Apply supplemental oxygen to maintain SpO2 ≥94%", "Obtain a chest X-ray", "Start IV antibiotics"], correct: 1, rationale: "The priority is to correct hypoxemia by applying supplemental oxygen. SpO2 of 88% indicates significant hypoxemia requiring immediate intervention. Albuterol is generally not effective in bronchiolitis (viral etiology). Diagnostic studies can be obtained after stabilization." },
      { question: "A child receiving albuterol nebulizer treatments for an asthma exacerbation becomes quiet, stops wheezing, and has significantly decreased breath sounds bilaterally. What does this indicate?", options: ["The asthma exacerbation has resolved", "The albuterol treatment is working effectively", "Air movement is critically reduced — imminent respiratory failure", "The child has developed a pneumothorax"], correct: 2, rationale: "Loss of wheezing with decreased breath sounds in a child who was previously wheezing indicates severely reduced air movement — a sign of impending respiratory failure. This is a clinical emergency requiring immediate escalation of care." }
    ]
  },


  "generalized-anxiety-disorder": {
    title: "Generalized Anxiety Disorder",
    cellular: {
      title: "Generalized Anxiety Disorder",
      content: "Generalized Anxiety Disorder (GAD) is characterized by excessive, uncontrollable worry about a variety of topics occurring more days than not for at least 6 months, accompanied by physical symptoms of anxiety. It is one of the most common psychiatric disorders, with a lifetime prevalence of approximately 5-6%.\n\nThe neurobiology of GAD involves dysregulation of several neurotransmitter systems and brain circuits. The amygdala, which processes threat detection and fear responses, shows hyperactivation in GAD patients. The prefrontal cortex, responsible for cognitive appraisal and emotional regulation, shows impaired connectivity with the amygdala, resulting in an inability to modulate excessive fear responses.\n\nGABA (gamma-aminobutyric acid), the primary inhibitory neurotransmitter, is functionally deficient in anxiety disorders. Reduced GABAergic activity in the amygdala and cortex leads to a state of neuronal hyperexcitability and heightened arousal. This is the basis for benzodiazepine efficacy — they enhance GABA-A receptor function.\n\nThe serotonin system is also dysregulated, with altered 5-HT1A receptor density in the amygdala, hippocampus, and raphe nuclei. The HPA axis shows a blunted cortisol response to stress (in contrast to the elevated cortisol seen in depression), suggesting chronic activation with subsequent downregulation. Genetic factors account for approximately 30% of the variance in GAD susceptibility, with environmental factors including childhood adversity, insecure attachment, and chronic stress contributing to the remainder."
    },
    riskFactors: [
      "Female sex (2:1 female-to-male ratio)",
      "Family history of anxiety disorders",
      "Childhood adversity or trauma",
      "Chronic medical conditions (particularly those with uncertain prognosis)",
      "Comorbid depression (frequently co-occurs)",
      "Temperamental inhibition (behavioral inhibition in childhood)",
      "Substance use, particularly caffeine, stimulants, or during withdrawal",
      "Major life transitions or chronic stress"
    ],
    diagnostics: [
      "DSM-5: Excessive worry about multiple domains for ≥6 months with ≥3 associated symptoms",
      "GAD-7 screening tool: scores ≥10 suggest moderate anxiety",
      "Associated symptoms include restlessness, fatigue, difficulty concentrating, irritability, muscle tension, and sleep disturbance",
      "Rule out medical causes: hyperthyroidism (TSH), pheochromocytoma, cardiac arrhythmias, medication side effects",
      "Rule out substance-induced anxiety: caffeine, stimulants, alcohol/benzodiazepine withdrawal",
      "Rule out other anxiety disorders: panic disorder, social anxiety, OCD, PTSD"
    ],
    management: [
      "First-line pharmacotherapy: SSRIs (sertraline, escitalopram) or SNRIs (venlafaxine, duloxetine)",
      "Buspirone as an alternative or adjunct — non-addictive anxiolytic",
      "Cognitive Behavioral Therapy (CBT): cognitive restructuring, exposure, relaxation training",
      "Short-term benzodiazepine use for acute symptoms while waiting for SSRI/SNRI to take effect (use with caution)",
      "Lifestyle modifications: regular exercise, sleep hygiene, caffeine reduction, mindfulness/meditation",
      "Avoid long-term benzodiazepine use due to dependence, tolerance, and cognitive effects"
    ],
    nursingActions: [
      "Create a calm, structured environment that reduces stimulation",
      "Use a calm, reassuring tone and provide clear, simple instructions during acute anxiety episodes",
      "Teach and practice relaxation techniques: deep breathing, progressive muscle relaxation, grounding exercises",
      "Educate about the nature of anxiety: it is not dangerous, it is time-limited, and it can be managed",
      "Monitor for medication side effects and therapeutic response over weeks",
      "Assess for comorbid depression and suicidal ideation"
    ],
    signs: {
      left: [
        "Excessive worry about multiple life areas",
        "Difficulty controlling worry",
        "Restlessness or feeling keyed up",
        "Muscle tension (jaw clenching, neck/shoulder tightness)"
      ],
      right: [
        "Fatigue",
        "Difficulty concentrating or mind going blank",
        "Irritability",
        "Sleep disturbance (difficulty falling/staying asleep)",
        "Somatic symptoms (headache, GI complaints, palpitations)"
      ]
    },
    medications: [
      { name: "Buspirone", type: "Azapirone anxiolytic (5-HT1A partial agonist)", action: "Partial agonist at serotonin 5-HT1A receptors in the brain; reduces anxiety without sedation, muscle relaxation, or dependence potential", sideEffects: "Dizziness, headache, nausea, nervousness initially, lightheadedness", contra: "Concurrent use with MAOIs; not effective for acute anxiety (takes 2-4 weeks for effect)", pearl: "Non-addictive and does not cause sedation or cognitive impairment; excellent option for patients with substance use history; must be taken daily — not effective on an as-needed basis" },
      { name: "Escitalopram (Lexapro)", type: "Selective Serotonin Reuptake Inhibitor (SSRI)", action: "Selectively inhibits serotonin reuptake, increasing serotonin availability; first-line for GAD with strong evidence base", sideEffects: "Nausea, insomnia, sexual dysfunction, headache, increased anxiety initially", contra: "Concurrent MAOI use, QT prolongation (dose-dependent at higher doses)", pearl: "Start at 5-10 mg to minimize initial anxiety exacerbation; therapeutic doses for anxiety are often higher than for depression" }
    ],
    pearls: [
      "GAD differs from normal worry by being excessive, pervasive, difficult to control, and causing significant distress or functional impairment",
      "SSRIs/SNRIs may initially worsen anxiety — start at low doses and titrate slowly; counsel patients about this",
      "Benzodiazepines should be bridge therapy only; long-term use leads to tolerance, dependence, and cognitive impairment in elderly patients",
      "GAD is highly comorbid with MDD — screen for both conditions simultaneously"
    ],
    quiz: [
      { question: "A patient with GAD asks why the provider prescribed an SSRI instead of a benzodiazepine. Which response by the nurse is most appropriate?", options: ["SSRIs work faster for anxiety than benzodiazepines", "SSRIs are preferred for long-term management because they don't cause dependence", "Benzodiazepines are never used for anxiety disorders", "SSRIs have no side effects compared to benzodiazepines"], correct: 1, rationale: "SSRIs are preferred first-line for GAD because they are effective long-term without the risks of physical dependence, tolerance, and cognitive impairment associated with benzodiazepines. SSRIs actually take longer to work (4-6 weeks) but are safer for ongoing treatment." },
      { question: "Which medication for GAD does NOT cause dependence and must be taken daily for therapeutic effect?", options: ["Lorazepam", "Buspirone", "Alprazolam", "Diazepam"], correct: 1, rationale: "Buspirone is a non-benzodiazepine anxiolytic that does not cause dependence, tolerance, or sedation. It must be taken daily and takes 2-4 weeks for full effect. It cannot be used PRN. The other options are all benzodiazepines with dependence potential." }
    ]
  },


  "obsessive-compulsive-disorder": {
    title: "Obsessive-Compulsive Disorder",
    cellular: {
      title: "Obsessive-Compulsive Disorder",
      content: "Obsessive-Compulsive Disorder (OCD) is characterized by recurrent, intrusive, unwanted thoughts (obsessions) and/or repetitive behaviors or mental acts (compulsions) performed to reduce the anxiety generated by the obsessions. It affects approximately 2-3% of the population and typically has onset in late adolescence or early adulthood.\n\nThe neuroanatomical model of OCD involves hyperactivity in the cortico-striato-thalamo-cortical (CSTC) circuit. Specifically, the orbitofrontal cortex (OFC), which detects errors and generates the feeling that 'something is wrong,' becomes hyperactive. This overactive error signal feeds into the caudate nucleus (part of the basal ganglia striatum), which normally acts as a gatekeeper to filter out irrelevant thoughts.\n\nIn OCD, the caudate nucleus fails to properly filter intrusive thoughts, allowing them to cycle repeatedly through the thalamus back to the cortex, creating a 'stuck' loop. PET and fMRI studies consistently show hypermetabolism in the OFC, caudate nucleus, and anterior cingulate cortex that normalizes with successful SSRI treatment or CBT.\n\nSerotonin dysfunction is central to OCD pathophysiology, evidenced by the specific efficacy of serotonergic medications (SSRIs and clomipramine) and lack of response to non-serotonergic antidepressants. Glutamate dysregulation has also been implicated, with elevated glutamate levels in the CSF and corticostriatal regions. Autoimmune mechanisms are relevant in pediatric cases (PANDAS), where group A streptococcal infection triggers antibodies that cross-react with basal ganglia neurons."
    },
    riskFactors: [
      "Family history of OCD (heritability estimated at 40-50%)",
      "First-degree relative with OCD increases risk 4-5 fold",
      "History of childhood trauma or abuse",
      "Comorbid tic disorders or Tourette syndrome",
      "Pediatric autoimmune neuropsychiatric disorders (PANDAS)",
      "Perfectionism and inflated sense of responsibility as personality traits",
      "Perinatal period (postpartum OCD with intrusive harm thoughts)",
      "Comorbid anxiety or depressive disorders"
    ],
    diagnostics: [
      "DSM-5: presence of obsessions, compulsions, or both that are time-consuming (>1 hr/day) or cause significant distress/impairment",
      "Yale-Brown Obsessive Compulsive Scale (Y-BOCS) for severity assessment and treatment monitoring",
      "Common obsession themes: contamination, symmetry/ordering, forbidden/taboo thoughts, harm",
      "Common compulsion themes: washing/cleaning, checking, counting, repeating, mental rituals",
      "Assess for insight: good, fair, poor, or absent/delusional beliefs about the irrationality of symptoms",
      "Rule out body dysmorphic disorder, hoarding disorder, trichotillomania (related conditions in DSM-5)"
    ],
    management: [
      "First-line: SSRIs at higher doses than used for depression (fluoxetine 40-80 mg, sertraline 100-200 mg, fluvoxamine)",
      "CBT with Exposure and Response Prevention (ERP) — gold standard psychotherapy for OCD",
      "Clomipramine (tricyclic with strong serotonergic action) for SSRI-refractory cases",
      "Augmentation with low-dose atypical antipsychotic (risperidone, aripiprazole) if partial SSRI response",
      "Duration of treatment: minimum 1-2 years; many patients require lifelong maintenance",
      "Deep brain stimulation (DBS) or neurosurgical intervention for severe, treatment-refractory cases"
    ],
    nursingActions: [
      "Allow extra time for patients to complete rituals initially while building therapeutic alliance",
      "Do not participate in compulsions or provide excessive reassurance (this reinforces the OCD cycle)",
      "Educate patient that intrusive thoughts do not reflect their character or intentions",
      "Support gradual ERP exercises: help patient tolerate anxiety without performing compulsions",
      "Monitor medication compliance — therapeutic doses for OCD are often higher than patients expect",
      "Assess impact on daily functioning: work, relationships, self-care"
    ],
    signs: {
      left: [
        "Repetitive hand washing (cracked, raw, bleeding hands)",
        "Excessive checking behaviors (locks, stove, appliances)",
        "Counting, ordering, or arranging rituals",
        "Avoidance of triggers (doorknobs, public surfaces)"
      ],
      right: [
        "Reports of intrusive, unwanted thoughts causing severe distress",
        "Recognition that obsessions/compulsions are excessive (with intact insight)",
        "Time consumed by rituals (>1 hour/day)",
        "Marked distress if rituals are interrupted or prevented",
        "Social and occupational impairment"
      ]
    },
    medications: [
      { name: "Fluvoxamine (Luvox)", type: "Selective Serotonin Reuptake Inhibitor (SSRI)", action: "Inhibits serotonin reuptake with strong selectivity; FDA-approved specifically for OCD in adults and children ≥8 years", sideEffects: "Nausea, somnolence, headache, insomnia, significant drug interactions via CYP1A2 and CYP2C19 inhibition", contra: "Concurrent MAOI use, concurrent use with tizanidine, thioridazine, or alosetron", pearl: "One of the most serotonin-selective SSRIs; has more drug interactions than other SSRIs due to CYP enzyme inhibition — check all concurrent medications" },
      { name: "Clomipramine (Anafranil)", type: "Tricyclic antidepressant (strong serotonergic)", action: "Potent serotonin reuptake inhibitor with some norepinephrine reuptake inhibition; most effective single agent for OCD", sideEffects: "Anticholinergic effects (dry mouth, constipation, urinary retention), sedation, weight gain, orthostatic hypotension, seizure risk, cardiac conduction delays", contra: "Recent MI, concurrent MAOI use, seizure disorder (lowers seizure threshold)", pearl: "Most effective single medication for OCD but limited by side effect profile; typically reserved for SSRI failures; requires ECG monitoring" }
    ],
    pearls: [
      "OCD requires higher SSRI doses and longer treatment duration (8-12 weeks) than depression before response is seen",
      "ERP (Exposure and Response Prevention) is the psychological treatment of choice and can be as effective as medication",
      "Intrusive thoughts of harm in OCD are ego-dystonic (unwanted, distressing) — these patients are NOT at risk of acting on them",
      "PANDAS should be suspected in a child with sudden-onset OCD symptoms following streptococcal infection"
    ],
    quiz: [
      { question: "A patient with OCD repeatedly asks the nurse, 'Are you sure the door is locked?' What is the most therapeutic nursing response?", options: ["Yes, I checked it for you — it is definitely locked", "Let me go check the door again to reassure you", "I understand you feel anxious. What strategies have you discussed with your therapist for managing this urge?", "Just stop worrying about it — the door is fine"], correct: 2, rationale: "Providing repeated reassurance reinforces the OCD cycle. Instead, redirect the patient to their coping strategies from therapy (ERP). This supports the therapeutic process while acknowledging their distress. Dismissing or repeatedly checking enables the compulsion." },
      { question: "A nurse is educating a patient about their new SSRI prescription for OCD. Which statement is accurate?", options: ["You should feel better within 1-2 days", "The dose for OCD is typically higher than for depression and may take 8-12 weeks to work", "You can stop the medication once you feel better", "This medication will eliminate all obsessive thoughts"], correct: 1, rationale: "OCD typically requires higher SSRI doses than depression and a longer trial period (8-12 weeks vs 4-6 weeks for depression). Patients should be counseled about this timeline to prevent premature discontinuation." }
    ]
  },

  "therapeutic-communication-advanced": {
    title: "Therapeutic Communication Advanced",
    cellular: {
      title: "Theory and Neuroscience of Therapeutic",
      content: "Therapeutic communication is a purposeful, goal-directed form of professional communication used by nurses to establish trust, promote healing, and facilitate patient-centered care. It is grounded in the nursing theories of Hildegard Peplau (interpersonal relations), Carl Rogers (person-centered approach), and the principles of motivational interviewing.\n\nFrom a neuroscience perspective, therapeutic communication activates the social engagement system mediated by the vagus nerve (polyvagal theory). When a patient perceives safety through the nurse's calm tone, appropriate eye contact, and empathic responses, the ventral vagal complex activates, promoting parasympathetic activity that reduces stress hormones, lowers heart rate, and creates a physiological state conducive to healing and information processing.\n\nConversely, non-therapeutic communication (judgment, dismissal, false reassurance, giving advice) activates the sympathetic fight-or-flight response or the dorsal vagal shutdown response, impairing the patient's ability to process information, make decisions, and engage in their care.\n\nActive listening involves not just hearing words but attending to nonverbal cues (body language, facial expressions, tone), emotional undertones, and what is left unsaid. Research shows that patients who feel heard by their healthcare providers have better medication adherence, fewer malpractice claims, improved pain management, and shorter hospital stays. Therapeutic communication is a clinical skill that directly affects patient outcomes."
    },
    riskFactors: [
      "Communication barriers: language differences, hearing impairment, cognitive impairment, intubation",
      "High stress or emotional distress impairing the patient's ability to process information",
      "Cultural differences in communication norms (eye contact, personal space, disclosure)",
      "Nurse burnout, compassion fatigue, or time pressure",
      "Patient mistrust of healthcare systems (historical trauma, negative past experiences)",
      "Power imbalance in the nurse-patient relationship",
      "Age-related considerations (pediatric, adolescent, geriatric communication needs)"
    ],
    diagnostics: [
      "Assessment of patient communication ability: language, hearing, cognition, emotional state",
      "Cultural assessment: preferred language, health beliefs, communication preferences",
      "Assessment of patient readiness to communicate and learn",
      "Evaluation of the nurse-patient therapeutic relationship quality",
      "Observation for nonverbal cues indicating comfort or distress"
    ],
    management: [
      "Establish trust through consistent, genuine, empathic interactions",
      "Use open-ended questions to explore patient experiences and feelings",
      "Practice active listening with reflection, clarification, and summarization",
      "Match communication approach to patient's developmental level and cultural background",
      "Set clear professional boundaries while maintaining warmth and therapeutic connection",
      "Use teach-back method to verify patient understanding"
    ],
    nursingActions: [
      "Introduce yourself, explain your role, and ask how the patient prefers to be addressed",
      "Use SOLER technique: Sit squarely, Open posture, Lean forward, Eye contact, Relax",
      "Provide periods of therapeutic silence to allow the patient to process and respond",
      "Avoid common non-therapeutic techniques: false reassurance, why questions, changing the subject, giving personal opinions",
      "Use broad opening statements: 'Tell me what brings you in today' rather than yes/no questions",
      "Document therapeutic interactions and patient responses in the nursing notes"
    ],
    signs: {
      left: [
        "Patient willing to share thoughts and feelings openly",
        "Patient demonstrates trust through disclosure of sensitive information",
        "Patient participates actively in care planning",
        "Decreased patient anxiety during interactions"
      ],
      right: [
        "Patient avoidance, withdrawal, or hostility (barriers to communication)",
        "Incongruence between verbal and nonverbal messages",
        "Resistance to care or non-adherence related to misunderstanding",
        "Family conflict or communication breakdown affecting care"
      ]
    },
    medications: [
      { name: "Lorazepam (Ativan)", type: "Benzodiazepine anxiolytic", action: "Used in psychiatric settings to reduce acute anxiety or agitation that may impair a patient's ability to engage in therapeutic communication; enhances GABA activity", sideEffects: "Sedation, cognitive impairment, respiratory depression, paradoxical agitation, dependence", contra: "Severe respiratory insufficiency, acute narrow-angle glaucoma, sleep apnea", pearl: "May be necessary before therapeutic communication can occur in acutely agitated patients; however, medication should support, not replace, therapeutic communication strategies" }
    ],
    pearls: [
      "Therapeutic silence is one of the most powerful communication tools — resist the urge to fill every pause",
      "Reflection ('It sounds like you're feeling frustrated') is more therapeutic than advice ('You should try...')",
      "Avoid 'why' questions — they sound judgmental and put patients on the defensive; use 'what' or 'tell me about' instead",
      "False reassurance ('Everything will be fine') dismisses patient concerns and destroys trust; instead, validate feelings and provide honest information",
      "Cultural humility, not just cultural competence, is essential — approach each patient as the expert on their own experience"
    ],
    quiz: [
      { question: "A patient who just received a cancer diagnosis is crying and says, 'I don't know what I'm going to do.' Which nurse response demonstrates the best therapeutic communication?", options: ["Don't worry, people survive cancer all the time. You'll be fine.", "I know exactly how you feel — my mother had cancer too.", "This must be very overwhelming for you. I'm here to listen whenever you're ready to talk.", "Let me call the chaplain for you — they can help with this better than I can."], correct: 2, rationale: "This response validates the patient's feelings, conveys empathic presence, and offers support without giving false reassurance, shifting focus to the nurse's experience, or deflecting to another provider. It demonstrates active listening and therapeutic presence." },
      { question: "A patient with schizophrenia tells the nurse, 'The CIA has implanted a tracking device in my brain.' Which response is most therapeutic?", options: ["That's not real. The CIA hasn't done anything to you.", "Tell me more about your experience. That must be very frightening for you.", "I'll call the doctor to increase your medication.", "Let's change the subject to something more pleasant."], correct: 1, rationale: "Acknowledging the patient's experience without reinforcing or challenging the delusion is therapeutic. Asking for more information shows genuine interest and helps assess the extent of the delusion. Directly confronting delusions is non-therapeutic and may increase agitation. Changing the subject avoids the patient's concern." }
    ]
  }
};
