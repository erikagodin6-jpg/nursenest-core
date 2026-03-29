import { getAssetUrl } from "@/lib/asset-url";
import type { LessonContent } from "./types";

export const clinicalConditionsBatchFLessons: Record<string, LessonContent> = {
  "placenta-previa-management-rpn": {
    title: "Placenta Previa",
    cellular: {
      title: "Placental Implantation Abnormality",
      content: "Placenta previa occurs when the placenta abnormally implants over or near the internal cervical os. As the cervix dilates and effaces during pregnancy or labor, placental blood vessels are disrupted, causing painless vaginal bleeding that can progress to massive hemorrhage. The placenta may partially or completely cover the os. As pregnancy advances, the placenta may migrate away from the cervical opening, potentially resolving the previa. The nurse monitors maternal vital signs, bleeding patterns, and fetal heart rate, reporting all changes to the nursing team immediately."
    },
    riskFactors: [
      "Prior cesarean birth or uterine surgery",
      "Multiparity",
      "Advanced maternal age (>35 years)",
      "Prior placenta previa",
      "Multiple gestation",
      "Smoking during pregnancy",
      "Cocaine use",
      "Assisted reproductive technology"
    ],
    diagnostics: [
      "Monitor vital signs frequently, reporting hypotension or tachycardia",
      "Count and weigh perineal pads to quantify blood loss",
      "Report any increase in vaginal bleeding immediately",
      "Assist with continuous electronic fetal monitoring as directed",
      "Monitor urine output and report if <30 mL/hr",
      "Report changes in fetal heart rate patterns to the RN"
    ],
    management: [
      "Maintain bed rest as ordered (modified or strict)",
      "Maintain large-bore IV access as directed",
      "Keep environment calm to reduce anxiety",
      "Ensure NPO status if cesarean birth is anticipated",
      "Avoid vaginal examinations, douching, or vaginal intercourse",
      "Prepare patient for possible emergency cesarean delivery as directed"
    ],
    nursingActions: [
      "Assess vaginal bleeding: color, amount, presence of clots",
      "Monitor vital signs every 15 minutes during active bleeding episodes",
      "Report any sudden increase in bleeding immediately to the RN",
      "Maintain patient on continuous electronic fetal monitoring",
      "Provide emotional support and reassurance to the patient and family",
      "Reinforce education on activity restrictions and when to call for help",
      "Assist with positioning for patient comfort (left lateral preferred)"
    ],
    signs: {
      left: [
        "Painless bright red vaginal bleeding after 20 weeks",
        "Bleeding may be intermittent or continuous",
        "Soft, non-tender uterus on palpation",
        "Normal fetal heart rate tracing initially"
      ],
      right: [
        "Sudden massive hemorrhage",
        "Maternal tachycardia and hypotension",
        "Fetal heart rate decelerations",
        "Signs of hypovolemic shock (pallor, diaphoresis, altered LOC)"
      ]
    },
    medications: [
      { name: "Betamethasone", type: "Corticosteroid", action: "Accelerates fetal lung maturity by stimulating surfactant production in type II pneumocytes", sideEffects: "Maternal hyperglycemia, insomnia, increased infection risk", contra: "Active systemic infection, gestational age >37 weeks", pearl: "Administered IM in two doses 24 hours apart when preterm delivery is anticipated between 24-34 weeks. Administer as ordered and report maternal blood glucose changes." }
    ],
    pearls: [
      "Painless bright red vaginal bleeding after 20 weeks is the hallmark of placenta previa",
      "Never perform a vaginal exam on a patient with suspected placenta previa",
      "Placenta previa is diagnosed by ultrasound, not by palpation",
      "A stable patient with no active bleeding may be managed as an outpatient with strict precautions",
      "Cesarean birth is planned after 36 weeks and before the onset of labor"
    ],
    quiz: [
      { question: "Which assessment finding is most characteristic of placenta previa?", options: ["Severe abdominal pain with rigid uterus", "Painless bright red vaginal bleeding after 20 weeks", "Dark red vaginal bleeding with uterine tenderness", "Green-tinged amniotic fluid"], correct: 1, rationale: "Placenta previa presents with painless bright red vaginal bleeding after 20 weeks. Abdominal pain with a rigid uterus is characteristic of placental abruption." },
      { question: "What action is contraindicated in a patient with known placenta previa?", options: ["Continuous fetal monitoring", "Left lateral positioning", "Vaginal examination", "IV fluid administration"], correct: 2, rationale: "Vaginal examinations are contraindicated in placenta previa because they can disrupt placental vessels and cause massive hemorrhage." },
      { question: "The nurse observes a sudden increase in vaginal bleeding in a patient with placenta previa. What is the priority action?", options: ["Change the perineal pad and document", "Report to the nurse immediately", "Encourage the patient to ambulate", "Administer oral fluids"], correct: 1, rationale: "A sudden increase in bleeding may indicate hemorrhage and requires immediate notification of the nurse for further assessment and intervention." }
    ]
  },

  "placenta-previa-management-rn": {
    title: "Placenta Previa",
    cellular: {
      title: "Pathophysiology of Abnormal Placentation",
      content: "Placenta previa results from implantation of the blastocyst in the lower uterine segment, causing the placenta to partially or completely cover the internal cervical os. As the lower uterine segment thins and the cervix begins to efface in the third trimester, the anchoring placental villi are disrupted from the decidua basalis, exposing maternal spiral arteries and causing hemorrhage. The severity of bleeding depends on the degree of placental separation and the vascularity of the implantation site. Complete previa carries the highest risk of life-threatening hemorrhage. The nurse must perform comprehensive hemorrhage assessment, manage fluid resuscitation, coordinate blood product availability, maintain continuous fetal surveillance, and prepare for emergency cesarean delivery."
    },
    riskFactors: [
      "Prior cesarean delivery (risk increases with number of prior cesareans)",
      "Prior uterine surgery (myomectomy, D&C)",
      "Multiparity (≥5 pregnancies)",
      "Advanced maternal age (>35 years)",
      "Previous placenta previa (recurrence rate 4-8%)",
      "Multiple gestation",
      "Smoking and cocaine use",
      "In vitro fertilization"
    ],
    diagnostics: [
      "Interpret transvaginal or transabdominal ultrasound confirming placental location relative to the internal os",
      "Classify previa: complete (covers entire os), partial (partially covers os), marginal (edge within 2 cm of os)",
      "Monitor serial CBC for hemoglobin and hematocrit trends indicating blood loss",
      "Ensure type and crossmatch is current with 2 units PRBCs available",
      "Evaluate coagulation studies (PT, PTT, fibrinogen) to rule out coagulopathy",
      "Perform continuous electronic fetal monitoring to assess fetal well-being",
      "Monitor Kleihauer-Betke test if Rh-negative to assess fetomaternal hemorrhage"
    ],
    management: [
      "Establish two large-bore IV lines (16-18 gauge) for fluid resuscitation",
      "Administer IV crystalloids (Lactated Ringer's or NS) to maintain hemodynamic stability",
      "Transfuse PRBCs as ordered if hemoglobin drops below threshold or active hemorrhage",
      "Administer Rh immune globulin (RhoGAM) if patient is Rh-negative",
      "Administer betamethasone for fetal lung maturity if between 24-34 weeks",
      "Maintain strict bed rest with bathroom privileges only if stable",
      "Coordinate with obstetric team for planned cesarean delivery after 36 weeks",
      "Prepare OR and neonatal team for emergency cesarean if hemorrhage is uncontrolled"
    ],
    nursingActions: [
      "Perform systematic hemorrhage assessment: vital signs, pad counts, fundal assessment",
      "Quantify blood loss by weighing saturated pads (1g = 1 mL blood)",
      "Assess for signs of hypovolemic shock: tachycardia, hypotension, pallor, decreased urine output",
      "Maintain continuous electronic fetal monitoring and interpret tracings",
      "Implement nothing per vagina (no vaginal exams, no tampons, no intercourse)",
      "Educate patient on activity restrictions, bleeding precautions, and when to seek emergency care",
      "Coordinate blood bank availability and ensure type and crossmatch is current",
      "Provide emotional support for anxiety related to pregnancy complications and potential preterm delivery"
    ],
    signs: {
      left: [
        "Painless bright red vaginal bleeding (hallmark)",
        "Bleeding typically occurs after 20 weeks",
        "Soft, relaxed, non-tender uterus",
        "Normal fetal heart rate initially",
        "Bleeding may be intermittent with recurrent episodes",
        "High-lying fetal presenting part"
      ],
      right: [
        "Sudden massive hemorrhage",
        "Maternal shock (tachycardia >110, SBP <90)",
        "Fetal heart rate decelerations or bradycardia",
        "Disseminated intravascular coagulation (DIC)",
        "Anuria or oliguria",
        "Altered level of consciousness"
      ]
    },
    medications: [
      { name: "Betamethasone", type: "Corticosteroid", action: "Stimulates fetal surfactant production to accelerate lung maturity", sideEffects: "Maternal hyperglycemia, insomnia, immunosuppression", contra: "Active systemic infection, chorioamnionitis", pearl: "Two IM doses given 24 hours apart between 24-34 weeks. Maximum benefit occurs 48 hours after first dose. Repeat course may be considered if >14 days since initial course." },
      { name: "Oxytocin (Pitocin)", type: "Uterotonic", action: "Stimulates uterine contractions and controls postpartum hemorrhage", sideEffects: "Water intoxication, uterine hyperstimulation, neonatal jaundice", contra: "Do not use to induce labor with placenta previa", pearl: "Used postpartum after cesarean delivery to contract the uterus and reduce bleeding. Administer as IV infusion per protocol." },
      { name: "Terbutaline", type: "Beta-2 agonist tocolytic", action: "Relaxes uterine smooth muscle to suppress contractions", sideEffects: "Tachycardia, tremor, hyperglycemia, pulmonary edema", contra: "Maternal cardiac disease, uncontrolled diabetes", pearl: "May be used short-term to suppress contractions while preparing for cesarean. Monitor maternal heart rate and fetal heart rate closely." }
    ],
    pearls: [
      "Placenta previa is diagnosed by ultrasound and confirmed by repeat ultrasound around 36 weeks",
      "Vaginal exams are absolutely contraindicated in known or suspected placenta previa",
      "A type and crossmatch with at least 2 units of PRBCs should always be available",
      "Painless bleeding distinguishes placenta previa from placental abruption (painful, rigid uterus)",
      "Outpatient management is possible for stable patients with no active bleeding and reassuring fetal status"
    ],
    quiz: [
      { question: "A patient at 32 weeks with placenta previa presents with active bright red vaginal bleeding. What is the RN's priority action?", options: ["Perform a vaginal exam to assess cervical dilation", "Establish two large-bore IV lines and begin fluid resuscitation", "Administer oxytocin to control bleeding", "Position the patient in lithotomy position"], correct: 1, rationale: "The priority is establishing IV access and beginning fluid resuscitation for potential hemorrhage. Vaginal exams are contraindicated in placenta previa." },
      { question: "Which finding differentiates placenta previa from placental abruption?", options: ["Painless bright red bleeding vs. painful dark red bleeding with rigid uterus", "Both present with painful bleeding", "Previa causes dark bleeding while abruption causes bright red bleeding", "Neither condition causes vaginal bleeding"], correct: 0, rationale: "Placenta previa presents with painless bright red vaginal bleeding, while placental abruption presents with painful dark red bleeding and a rigid, board-like uterus." },
      { question: "An Rh-negative patient with placenta previa has an episode of vaginal bleeding. What additional intervention should the nurse anticipate?", options: ["Administration of magnesium sulfate", "Administration of Rh immune globulin (RhoGAM)", "Administration of calcium gluconate", "Administration of vitamin K"], correct: 1, rationale: "Rh-negative patients who experience bleeding during pregnancy require RhoGAM to prevent Rh sensitization from fetomaternal hemorrhage." }
    ]
  },

  "placenta-previa-management-np": {
    title: "Placenta Previa",
    cellular: {
      title: "Advanced Pathophysiology of Placenta Previa",
      content: "Placenta previa involves ectopic implantation in the lower uterine segment where the decidua basalis is thinner and less vascularized than the fundal region. This results in abnormal trophoblastic invasion and a higher rate of placenta accreta spectrum disorders (accreta, increta, percreta), particularly in patients with prior uterine scars. The lower segment's limited contractile ability after placental separation contributes to hemorrhage that is unresponsive to uterotonics alone. The clinician must integrate diagnostic imaging, classify the previa, manage expectant versus active management protocols, prescribe corticosteroids for fetal lung maturity, order blood products, and determine delivery timing in consultation with maternal-fetal medicine."
    },
    riskFactors: [
      "Prior cesarean delivery (strongest risk factor; risk increases exponentially with each repeat cesarean)",
      "Placenta accreta spectrum increases with combination of prior cesarean + previa",
      "Prior uterine surgery (myomectomy, septoplasty)",
      "Advanced maternal age (>35 years)",
      "Grand multiparity",
      "Assisted reproductive technology (IVF)",
      "Cocaine and tobacco use",
      "Prior placenta previa (4-8% recurrence)"
    ],
    diagnostics: [
      "Order transvaginal ultrasound for definitive diagnosis (superior to transabdominal for os-placenta distance)",
      "Classify: complete previa (covers os), marginal previa (edge within 2 cm), low-lying placenta (edge 2-3.5 cm from os)",
      "Order MRI if placenta accreta spectrum is suspected (loss of retroplacental clear space, myometrial thinning)",
      "Order serial CBC every 4-6 hours during active bleeding to track hemoglobin trends",
      "Order comprehensive coagulation panel (PT, PTT, fibrinogen, D-dimer) to assess for DIC",
      "Order type and crossmatch with 4 units PRBCs available for complete previa",
      "Order Kleihauer-Betke test for Rh-negative patients to calculate RhoGAM dosing",
      "Schedule follow-up transvaginal ultrasound at 32 and 36 weeks to reassess placental location"
    ],
    management: [
      "Prescribe betamethasone 12 mg IM x2 doses 24 hours apart for fetal lung maturity (24-34 weeks)",
      "Prescribe tocolytics (nifedipine or terbutaline) for short-term contraction suppression while stabilizing",
      "Order massive transfusion protocol activation for hemorrhage >1500 mL or hemodynamic instability",
      "Prescribe RhoGAM 300 mcg IM for Rh-negative patients after bleeding episodes",
      "Schedule planned cesarean delivery at 36-37 weeks for uncomplicated complete previa",
      "Arrange delivery at a facility with blood bank, interventional radiology, and NICU capability",
      "Consult maternal-fetal medicine and gynecologic oncology if accreta spectrum is suspected",
      "Consider interventional radiology for prophylactic balloon catheter placement in high-risk cases"
    ],
    nursingActions: [
      "Establish evidence-based management plan: expectant management for stable patients vs. emergent delivery for unstable",
      "Prescribe iron supplementation for chronic anemia from recurrent bleeding episodes",
      "Counsel patient on preterm delivery risks, NICU stay, and potential need for hysterectomy if accreta",
      "Order antenatal testing (NST, BPP) twice weekly starting at 32 weeks for ongoing fetal surveillance",
      "Coordinate multidisciplinary team: MFM, anesthesia, neonatology, blood bank, interventional radiology",
      "Develop hemorrhage response plan with escalation protocols specific to placenta previa",
      "Assess psychological impact and provide referrals for perinatal mental health support",
      "Document shared decision-making regarding delivery timing and surgical approach"
    ],
    signs: {
      left: [
        "Painless bright red vaginal bleeding (sentinel bleed)",
        "Recurrent intermittent bleeding episodes",
        "Soft, non-tender, relaxed uterus",
        "High-lying fetal presenting part or malpresentation",
        "Normal fetal heart rate tracing between bleeding episodes",
        "Ultrasound showing placenta covering or near the internal os"
      ],
      right: [
        "Uncontrollable hemorrhage requiring emergency cesarean",
        "Hemorrhagic shock (tachycardia, hypotension, altered consciousness)",
        "DIC (prolonged PT/PTT, low fibrinogen, elevated D-dimer)",
        "Fetal bradycardia or absent variability",
        "Placenta accreta with inability to separate placenta",
        "Postpartum hemorrhage unresponsive to uterotonics"
      ]
    },
    medications: [
      { name: "Betamethasone", type: "Antenatal corticosteroid", action: "Induces fetal surfactant synthesis via glucocorticoid receptor activation in type II pneumocytes", sideEffects: "Maternal hyperglycemia, immunosuppression, insomnia", contra: "Active chorioamnionitis, gestational age >37 weeks", pearl: "Prescribe 12 mg IM q24h x2 doses. Optimal benefit 48 hours to 7 days after administration. Consider rescue course if >14 days from initial course and still preterm." },
      { name: "Nifedipine", type: "Calcium channel blocker tocolytic", action: "Inhibits calcium influx in smooth muscle cells, reducing uterine contractility", sideEffects: "Maternal hypotension, flushing, headache, tachycardia", contra: "Maternal hypotension (SBP <90), concurrent magnesium sulfate (cardiac depression risk)", pearl: "Preferred first-line tocolytic. Loading dose 20-30 mg PO, then 10-20 mg q4-6h. Use for 48-hour window to allow steroid effect." },
      { name: "Tranexamic Acid", type: "Antifibrinolytic", action: "Inhibits plasminogen activation, stabilizing fibrin clots and reducing hemorrhage", sideEffects: "Nausea, diarrhea, thromboembolic events", contra: "Active thromboembolic disease, subarachnoid hemorrhage", pearl: "1g IV over 10 minutes for postpartum hemorrhage. WOMAN trial showed reduced bleeding-related mortality when given within 3 hours of hemorrhage onset." },
      { name: "RhoGAM (Rh Immune Globulin)", type: "Anti-D immunoglobulin", action: "Prevents maternal Rh sensitization by binding to fetal Rh-positive RBCs in maternal circulation", sideEffects: "Injection site pain, low-grade fever, myalgia", contra: "Known Rh-positive patient, prior Rh sensitization (positive indirect Coombs)", pearl: "Standard dose 300 mcg covers 30 mL of fetal whole blood. Order Kleihauer-Betke to determine if additional doses are needed after large fetomaternal hemorrhage." }
    ],
    pearls: [
      "Complete previa with prior cesarean has 40-60% risk of placenta accreta spectrum",
      "Planned cesarean delivery is typically at 36-37 weeks for complete previa or 37-38 weeks for marginal previa",
      "The sentinel bleed (first bleed) is often self-limited but subsequent bleeds are typically more severe",
      "Low-lying placentas (edge 2-3.5 cm from os) may resolve by 36 weeks and allow trial of labor",
      "Tranexamic acid given within 3 hours of hemorrhage onset reduces mortality per the WOMAN trial"
    ],
    quiz: [
      { question: "A patient with complete placenta previa and two prior cesarean deliveries is at highest risk for which complication?", options: ["Gestational diabetes", "Placenta accreta spectrum", "Preeclampsia", "Gestational hypertension"], correct: 1, rationale: "The combination of placenta previa and prior cesarean delivery dramatically increases the risk of placenta accreta spectrum due to abnormal trophoblastic invasion into the scarred myometrium." },
      { question: "At what gestational age should the clinician schedule planned cesarean delivery for uncomplicated complete placenta previa?", options: ["32-34 weeks", "34-35 weeks", "36-37 weeks", "39-40 weeks"], correct: 2, rationale: "Guidelines recommend planned cesarean delivery at 36-37 weeks for complete placenta previa to balance fetal maturity against the risk of unplanned hemorrhage." },
      { question: "Which medication should the clinician prescribe to an Rh-negative patient with placenta previa after a bleeding episode?", options: ["Magnesium sulfate", "Terbutaline", "Rh immune globulin (RhoGAM)", "Oxytocin"], correct: 2, rationale: "Rh-negative patients require RhoGAM after any bleeding episode to prevent Rh alloimmunization from fetomaternal hemorrhage. A Kleihauer-Betke test determines if additional dosing is needed." }
    ]
  },

  "umbilical-cord-prolapse-rpn": {
    title: "Umbilical Cord Prolapse",
    cellular: {
      title: "Cord Compression Pathophysiology",
      content: "Umbilical cord prolapse occurs when the umbilical cord slips ahead of or alongside the fetal presenting part after rupture of membranes. The cord contains two umbilical arteries and one umbilical vein that carry all oxygen and nutrients to the fetus. When the uterus contracts, the presenting part compresses the prolapsed cord against the pelvis, occluding blood flow and oxygen delivery to the fetus. This results in fetal bradycardia, variable decelerations, and if not rapidly corrected, fetal hypoxia, acidosis, and death. The nurse must recognize this emergency, call for help, and assist with emergency interventions as directed."
    },
    riskFactors: [
      "Malpresentation (breech, transverse lie)",
      "Polyhydramnios (excess amniotic fluid)",
      "Premature rupture of membranes",
      "Unengaged fetal presenting part",
      "Low birth weight or preterm fetus",
      "Long umbilical cord",
      "Multiparity",
      "Amniotomy (artificial rupture of membranes)"
    ],
    diagnostics: [
      "Observe for visible cord protruding from the vagina",
      "Assist with continuous electronic fetal monitoring as directed",
      "Report sudden fetal heart rate changes: bradycardia or severe variable decelerations",
      "Monitor maternal vital signs during emergency response",
      "Report any palpation of cord during perineal care"
    ],
    management: [
      "Call for help immediately and notify the healthcare provider",
      "Assist with positioning mother in knee-chest or Trendelenburg position as directed",
      "Do not attempt to push the cord back into the vagina",
      "Wrap any visible cord with sterile towel soaked in warm saline as directed",
      "Prepare for emergency cesarean delivery",
      "Request neonatal resuscitation team at delivery"
    ],
    nursingActions: [
      "Call for help immediately upon suspicion of cord prolapse",
      "Assist with knee-chest positioning to relieve pressure on the cord",
      "Do not manipulate the cord",
      "Keep exposed cord moist with warm saline-soaked sterile towels",
      "Monitor fetal heart rate continuously and report changes",
      "Prepare for rapid transport to the operating room",
      "Provide emotional support and explain actions being taken to the patient"
    ],
    signs: {
      left: [
        "Visible cord protruding from the vagina",
        "Palpable cord during vaginal examination",
        "Sudden onset of fetal bradycardia",
        "Moderate to severe variable decelerations on fetal monitor"
      ],
      right: [
        "Prolonged fetal bradycardia (<110 bpm for >10 minutes)",
        "Loss of fetal heart rate variability",
        "Absent fetal heart tones (fetal demise)",
        "Maternal distress and anxiety"
      ]
    },
    medications: [
      { name: "Terbutaline", type: "Beta-2 agonist tocolytic", action: "Relaxes uterine smooth muscle to reduce contractions and decrease cord compression", sideEffects: "Maternal tachycardia, tremor, hyperglycemia", contra: "Maternal cardiac disease", pearl: "May be given as a subcutaneous injection to temporarily stop contractions while preparing for emergency cesarean. Administer as ordered." }
    ],
    pearls: [
      "Umbilical cord prolapse is an obstetric emergency requiring immediate intervention",
      "Knee-chest position lifts the fetal presenting part off the compressed cord",
      "Never attempt to replace the cord into the vagina",
      "Keep any exposed cord moist and warm to prevent vasospasm",
      "Time is critical: the goal is emergency cesarean delivery within minutes"
    ],
    quiz: [
      { question: "A patient's membranes rupture and the fetal heart rate suddenly drops to 70 bpm. The nurse suspects cord prolapse. What is the priority action?", options: ["Document the finding and reassess in 15 minutes", "Call for help immediately and assist with knee-chest positioning", "Encourage the patient to push", "Administer oxygen by nasal cannula"], correct: 1, rationale: "Cord prolapse is an emergency. The priority is calling for help and positioning the mother in knee-chest position to relieve cord compression while preparing for emergency cesarean." },
      { question: "Which position relieves pressure on a prolapsed umbilical cord?", options: ["Supine with legs flat", "Knee-chest position", "High Fowler's position", "Right lateral position"], correct: 1, rationale: "The knee-chest position uses gravity to lift the fetal presenting part off the prolapsed cord, relieving compression and restoring blood flow." },
      { question: "If the umbilical cord is visible outside the vagina, the nurse should:", options: ["Push the cord back into the vagina", "Cover it with a dry sterile towel", "Wrap it with a sterile towel soaked in warm saline", "Leave it exposed to air"], correct: 2, rationale: "Exposed cord should be wrapped in warm saline-soaked sterile towels to prevent vasospasm and drying. The cord should never be pushed back in." }
    ]
  },

  "umbilical-cord-prolapse-rn": {
    title: "Umbilical Cord Prolapse",
    cellular: {
      title: "Cord Compression and Fetal Hypoxia",
      content: "Umbilical cord prolapse creates an acute interruption of fetoplacental circulation. The cord's two arteries carry deoxygenated blood from the fetus to the placenta, while the single vein returns oxygenated blood. When the presenting part compresses the prolapsed cord during contractions, fetal PaO2 drops rapidly, triggering chemoreceptor-mediated bradycardia. Sustained compression leads to progressive metabolic acidosis, hypoxic-ischemic injury to the fetal brain and myocardium, and potential fetal death within minutes. The nurse must immediately recognize the emergency, initiate cord decompression maneuvers, manage the team response, and coordinate emergency cesarean delivery."
    },
    riskFactors: [
      "Fetal malpresentation (breech, transverse, oblique lie)",
      "Polyhydramnios (sudden fluid release carries the cord)",
      "Artificial rupture of membranes with unengaged presenting part",
      "Preterm premature rupture of membranes",
      "Long umbilical cord (>75 cm)",
      "Low birth weight or preterm fetus",
      "Second twin after delivery of first twin",
      "External cephalic version"
    ],
    diagnostics: [
      "Immediately assess for visible or palpable cord at the introitus or on vaginal exam",
      "Interpret continuous fetal monitoring: identify sudden severe variable decelerations or prolonged bradycardia",
      "Differentiate overt prolapse (cord visible/palpable below presenting part) from occult prolapse (cord compressed but not visible)",
      "Assess fetal heart rate response to position changes and intrauterine resuscitation",
      "Monitor maternal vital signs during emergency management",
      "Assess cervical dilation to determine delivery feasibility"
    ],
    management: [
      "Activate obstetric emergency protocol and call for immediate help",
      "Apply upward manual pressure to the fetal presenting part to lift it off the cord (do not release until surgical delivery)",
      "Position patient in exaggerated Trendelenburg or knee-chest position",
      "Administer terbutaline 0.25 mg subcutaneous to suppress contractions if ordered",
      "Rapidly infuse 500-1000 mL IV bolus of warmed crystalloid",
      "Fill the bladder with 500-700 mL saline via Foley catheter to elevate the presenting part (if cesarean is delayed)",
      "Prepare for emergency cesarean delivery with goal of delivery within 10 minutes",
      "Ensure neonatal resuscitation team is present at delivery"
    ],
    nursingActions: [
      "Maintain continuous manual elevation of the presenting part off the cord until surgical delivery",
      "Apply warm saline-soaked sterile towels to any exposed cord segment to prevent vasospasm",
      "Administer high-flow oxygen via non-rebreather mask at 10 L/min to optimize maternal-fetal oxygenation",
      "Coordinate rapid transport to the operating room while maintaining manual cord decompression",
      "Communicate clearly with the team: time of prolapse discovery, fetal heart rate, interventions initiated",
      "Administer IV fluids and medications as ordered during transport",
      "Document exact timing of all events and interventions",
      "Provide calm, reassuring communication to the patient during the emergency"
    ],
    signs: {
      left: [
        "Visible loop of umbilical cord at the introitus",
        "Palpable cord alongside or below the presenting part on vaginal exam",
        "Sudden severe variable decelerations on fetal monitor",
        "Fetal bradycardia (<110 bpm) following membrane rupture"
      ],
      right: [
        "Prolonged fetal bradycardia unresponsive to position changes",
        "Loss of fetal heart rate variability",
        "Cord vasospasm (cord becomes pale, pulseless if dried out)",
        "Late signs of fetal compromise (sinusoidal pattern, absent heart tones)"
      ]
    },
    medications: [
      { name: "Terbutaline", type: "Beta-2 agonist tocolytic", action: "Relaxes uterine smooth muscle to reduce contractions and relieve intermittent cord compression", sideEffects: "Maternal tachycardia, tremor, palpitations, hyperglycemia", contra: "Maternal cardiac disease, tachyarrhythmias", pearl: "0.25 mg subcutaneous injection provides rapid tocolysis within 5 minutes. Used to suppress contractions while preparing for emergency cesarean." },
      { name: "Epinephrine (Neonatal)", type: "Catecholamine", action: "Increases heart rate and contractility for neonatal resuscitation", sideEffects: "Tachycardia, hypertension", contra: "None in neonatal resuscitation emergency", pearl: "0.01-0.03 mg/kg IV or 0.05-0.1 mg/kg endotracheal for neonatal resuscitation. The neonatal team should have this drawn up and ready at delivery." }
    ],
    pearls: [
      "Goal is delivery within 10 minutes of cord prolapse discovery",
      "Manual elevation of the presenting part must be maintained continuously until surgical delivery",
      "Bladder filling with 500-700 mL saline can elevate the presenting part if there is any delay to cesarean",
      "Occult cord prolapse presents with fetal heart rate changes without visible or palpable cord",
      "After delivery, anticipate neonatal resuscitation for potential fetal asphyxia"
    ],
    quiz: [
      { question: "During a vaginal exam after spontaneous rupture of membranes, the nurse palpates the umbilical cord alongside the fetal head. What is the immediate priority?", options: ["Document the finding and notify the provider", "Apply upward pressure on the fetal presenting part and call for emergency cesarean", "Reposition the patient to left lateral and recheck in 5 minutes", "Apply fundal pressure to advance delivery"], correct: 1, rationale: "The immediate priority is manually elevating the fetal head off the cord to relieve compression and calling for emergency cesarean delivery. This is a time-critical emergency." },
      { question: "Which intervention can temporarily relieve cord compression if emergency cesarean is delayed?", options: ["Administer oxytocin to speed delivery", "Fill the bladder with 500-700 mL normal saline via Foley catheter", "Apply external cephalic version", "Perform amnioinfusion"], correct: 1, rationale: "Bladder filling with 500-700 mL of saline can temporarily elevate the presenting part off the compressed cord when there is a delay in getting to the operating room." },
      { question: "Exposed umbilical cord should be kept moist with warm saline-soaked towels primarily to prevent:", options: ["Maternal infection", "Umbilical cord vasospasm", "Fetal hypothermia", "Maternal hemorrhage"], correct: 1, rationale: "Keeping the exposed cord warm and moist prevents vasospasm of the umbilical vessels, which would further compromise fetal blood flow." }
    ]
  },

  "umbilical-cord-prolapse-np": {
    title: "Umbilical Cord Prolapse",
    cellular: {
      title: "Advanced Pathophysiology and Decision-Making",
      content: "Umbilical cord prolapse constitutes an acute interruption of the fetal lifeline. The umbilical vein (carrying oxygenated blood at PaO2 ~30 mmHg) is the sole source of fetal oxygenation. Complete occlusion produces fetal bradycardia within seconds via vagal reflex, followed by metabolic acidosis (pH drop of 0.04/min of total occlusion). At 10 minutes of complete occlusion, fetal pH approaches 7.0 with base excess exceeding -12 mEq/L, producing irreversible hypoxic-ischemic encephalopathy. Partial intermittent compression during contractions produces variable decelerations that worsen progressively. The clinician must recognize risk factors preemptively, order controlled amniotomy when indicated, manage the acute emergency pharmacologically, and determine delivery timing and method based on clinical urgency and fetal status."
    },
    riskFactors: [
      "Unengaged presenting part at time of membrane rupture (strongest modifiable risk factor)",
      "Fetal malpresentation (breech, transverse, oblique lie)",
      "Polyhydramnios (AFI >24 cm)",
      "Preterm gestation with low birth weight",
      "Multiparity with lax uterine musculature",
      "Amniotomy performed with high station",
      "Multiple gestation (especially second twin)",
      "Abnormally long umbilical cord"
    ],
    diagnostics: [
      "Order and interpret continuous electronic fetal monitoring pre- and post-amniotomy",
      "Verify fetal station and presentation by ultrasound before performing amniotomy",
      "Assess cervical dilation, effacement, and station to determine delivery route",
      "Order stat umbilical cord blood gases after delivery to assess degree of fetal acidosis",
      "Interpret cord gas results: pH <7.00, base excess >-12, and pCO2 >100 indicate severe asphyxia",
      "Order neonatal head ultrasound and neurological assessment within 24 hours for hypoxic-ischemic injury assessment"
    ],
    management: [
      "Prescribe terbutaline 0.25 mg subcutaneous stat for acute tocolysis",
      "Order emergency cesarean delivery with goal of skin incision within 5-10 minutes",
      "Order general anesthesia if regional anesthesia is not in place (faster induction)",
      "Prescribe IV crystalloid bolus 1000 mL for maternal volume resuscitation",
      "Order bladder filling with 500-700 mL sterile normal saline if cesarean is delayed",
      "Prescribe neonatal resuscitation standing orders including epinephrine and volume resuscitation",
      "Order therapeutic hypothermia consultation for neonates with evidence of hypoxic-ischemic encephalopathy",
      "Implement prevention: confirm fetal engagement before amniotomy, use controlled amniotomy technique"
    ],
    nursingActions: [
      "Lead the emergency response team and assign roles clearly",
      "Determine delivery route based on cervical dilation: if fully dilated with vertex at low station, operative vaginal delivery may be faster than cesarean",
      "Order and interpret stat cord blood gases upon delivery",
      "Evaluate neonatal Apgar scores and initiate resuscitation protocol as needed",
      "Assess for and manage postpartum complications: uterine atony, hemorrhage from rapid surgical delivery",
      "Debrief with the team and patient/family after the emergency",
      "Document detailed timeline of events, decision-making rationale, and outcomes",
      "Arrange follow-up neonatal neurology assessment if cord gases indicate significant acidosis"
    ],
    signs: {
      left: [
        "Visible or palpable cord prolapse",
        "Sudden severe variable decelerations after ROM",
        "Fetal bradycardia (<110 bpm) following amniotomy",
        "Occult prolapse: recurrent variables without visible cord"
      ],
      right: [
        "Sustained bradycardia unresponsive to intrauterine resuscitation",
        "Sinusoidal fetal heart rate pattern (severe fetal anemia/hypoxia)",
        "Absent fetal heart tones",
        "Cord gas pH <7.00 at delivery (severe metabolic acidosis)"
      ]
    },
    medications: [
      { name: "Terbutaline", type: "Beta-2 agonist tocolytic", action: "Relaxes myometrial smooth muscle via beta-2 receptor stimulation and cAMP increase", sideEffects: "Maternal tachycardia, tremor, hypokalemia, pulmonary edema (rare with single dose)", contra: "Maternal cardiac disease, tachyarrhythmias", pearl: "Single 0.25 mg subcutaneous dose provides rapid tocolysis within 5 minutes. Duration 15-30 minutes. Adequate time window to achieve surgical delivery." },
      { name: "Epinephrine (Neonatal)", type: "Catecholamine", action: "Increases neonatal heart rate and systemic vascular resistance via alpha and beta receptor stimulation", sideEffects: "Tachyarrhythmias, hypertension", contra: "None in resuscitation setting", pearl: "NRP dosing: 0.01-0.03 mg/kg IV (preferred) or 0.05-0.1 mg/kg via endotracheal tube. Use 1:10,000 concentration. IV route preferred for faster onset." },
      { name: "Sodium Bicarbonate (Neonatal)", type: "Buffer", action: "Corrects metabolic acidosis by buffering hydrogen ions", sideEffects: "Hypernatremia, hyperosmolality, intraventricular hemorrhage in preterm", contra: "Inadequate ventilation (must correct respiratory acidosis first)", pearl: "1-2 mEq/kg IV slow push only after effective ventilation is established. Rapid infusion increases risk of IVH in preterm neonates." }
    ],
    pearls: [
      "Prevention: always confirm fetal engagement (0 station or below) before performing amniotomy",
      "Decision-to-delivery interval goal is <10 minutes for cord prolapse",
      "If fully dilated with vertex at +2 station or below, vacuum-assisted vaginal delivery may be faster than cesarean",
      "Cord gas pH <7.00 with base excess >-12 mEq/L meets criteria for therapeutic hypothermia referral",
      "Controlled amniotomy technique: use amnihook with slow drainage and continuous fetal monitoring to detect cord prolapse early"
    ],
    quiz: [
      { question: "Before performing an amniotomy, the clinician should confirm which finding to reduce the risk of cord prolapse?", options: ["Fetal heart rate is reactive", "Fetal presenting part is engaged at 0 station or below", "Maternal cervix is at least 4 cm dilated", "Amniotic fluid index is normal"], correct: 1, rationale: "Fetal engagement at 0 station or below means the presenting part fills the pelvis, reducing the space for the cord to slip past. Amniotomy with an unengaged presenting part significantly increases prolapse risk." },
      { question: "Cord blood gas results show pH 6.92, pCO2 110, base excess -16. These findings indicate:", options: ["Normal fetal acid-base status", "Mild respiratory acidosis", "Severe mixed acidosis with likely hypoxic-ischemic injury", "Isolated metabolic alkalosis"], correct: 2, rationale: "pH <7.00 with elevated pCO2 and significant base deficit indicates severe mixed acidosis consistent with significant fetal hypoxia. This neonate should be evaluated for therapeutic hypothermia." },
      { question: "A patient is fully dilated with vertex at +3 station when cord prolapse is discovered. The clinician should:", options: ["Order emergency cesarean delivery", "Consider operative vaginal delivery as it may be faster than cesarean", "Order oxytocin augmentation", "Observe and recheck in 5 minutes"], correct: 1, rationale: "When the fetus is at +3 station with full dilation, operative vaginal delivery (vacuum or forceps) may achieve delivery faster than cesarean. The fastest route to delivery should be chosen." }
    ]
  },

  "hyperemesis-gravidarum-rpn": {
    title: "Hyperemesis Gravidarum",
    image: getAssetUrl("hyperemesisgravidarum_1773340513136.png"),
    cellular: {
      title: "Severe Pregnancy-Related Nausea and Vomiting",
      content: "Hyperemesis gravidarum is a severe form of morning sickness characterized by persistent, intractable nausea and vomiting during pregnancy that leads to significant weight loss (>5% of pre-pregnancy weight), dehydration, electrolyte imbalances, and ketonuria. It is thought to be caused by rapidly rising levels of human chorionic gonadotropin (hCG), estrogen, and progesterone. Unlike normal morning sickness which resolves by 12-14 weeks, hyperemesis can persist throughout pregnancy. The nurse monitors vital signs, intake and output, and dietary tolerance, reporting changes to the nursing team."
    },
    riskFactors: [
      "First pregnancy (primiparous)",
      "Multiple gestation (higher hCG levels)",
      "Molar pregnancy (hydatidiform mole)",
      "History of hyperemesis in previous pregnancy",
      "History of motion sickness or migraines",
      "Family history of hyperemesis gravidarum",
      "Obesity",
      "Hyperthyroidism"
    ],
    diagnostics: [
      "Monitor vital signs for tachycardia and hypotension indicating dehydration",
      "Record strict intake and output",
      "Monitor daily weights and report significant weight loss",
      "Report inability to tolerate oral fluids for more than 24 hours",
      "Observe for signs of dehydration: dry mucous membranes, poor skin turgor, concentrated urine",
      "Report ketone odor on breath"
    ],
    management: [
      "Maintain IV fluid therapy as ordered",
      "Administer antiemetics as ordered and on schedule",
      "Provide small, frequent, bland meals when tolerated",
      "Encourage dry crackers or toast before rising in the morning",
      "Maintain a calm, odor-free environment",
      "Encourage fluids between meals, not with meals"
    ],
    nursingActions: [
      "Assess frequency and severity of nausea and vomiting episodes",
      "Monitor for signs of dehydration and report promptly",
      "Weigh patient daily and report weight loss trends",
      "Provide oral hygiene after vomiting episodes",
      "Offer ginger-containing foods or beverages as tolerated",
      "Educate patient on foods high in vitamin B6 (nuts, seeds, legumes)",
      "Provide emotional support and reassurance that the condition typically improves",
      "Report inability to tolerate any oral intake to the RN"
    ],
    signs: {
      left: [
        "Persistent nausea and vomiting beyond the first trimester",
        "Weight loss >5% of pre-pregnancy weight",
        "Inability to tolerate oral food or fluids",
        "Fatigue and weakness"
      ],
      right: [
        "Severe dehydration (dry mucous membranes, poor skin turgor)",
        "Tachycardia and orthostatic hypotension",
        "Ketonuria (fruity odor to breath)",
        "Electrolyte imbalances (hypokalemia, hyponatremia)"
      ]
    },
    medications: [
      { name: "Ondansetron (Zofran)", type: "5-HT3 receptor antagonist antiemetic", action: "Blocks serotonin receptors in the chemoreceptor trigger zone and vagal nerve to reduce nausea and vomiting", sideEffects: "Headache, constipation, QT prolongation", contra: "Known QT prolongation, concomitant QT-prolonging drugs", pearl: "Administer as ordered. May be given IV, IM, or oral. Report headaches or palpitations." },
      { name: "Pyridoxine (Vitamin B6)", type: "Vitamin supplement", action: "Reduces nausea through unclear mechanism, possibly by supporting amino acid metabolism", sideEffects: "Peripheral neuropathy with high doses", contra: "None at recommended doses", pearl: "First-line treatment for pregnancy nausea. 10-25 mg three times daily. Can be combined with doxylamine for enhanced effect." }
    ],
    pearls: [
      "Hyperemesis gravidarum is different from normal morning sickness due to its severity and potential for complications",
      "Weight loss >5% of pre-pregnancy weight is a key diagnostic criterion",
      "Encourage small, frequent meals of bland, high-carbohydrate foods",
      "Fluids should be consumed between meals, not with meals",
      "Ginger-containing foods and vitamin B6 are first-line interventions for pregnancy nausea"
    ],
    quiz: [
      { question: "Which finding differentiates hyperemesis gravidarum from normal morning sickness?", options: ["Nausea in the first trimester", "Weight loss greater than 5% of pre-pregnancy weight", "Mild food aversions", "Nausea relieved by eating"], correct: 1, rationale: "Weight loss >5% of pre-pregnancy weight, along with dehydration and ketonuria, distinguishes hyperemesis gravidarum from normal morning sickness." },
      { question: "What dietary instruction should the nurse reinforce for a patient with hyperemesis gravidarum?", options: ["Eat three large meals daily", "Drink fluids with every meal", "Eat small, frequent, bland meals and drink fluids between meals", "Follow a high-fat diet"], correct: 2, rationale: "Small, frequent, bland meals minimize gastric distension, and drinking fluids between meals rather than with meals reduces nausea." },
      { question: "Which sign should the nurse report immediately in a patient with hyperemesis gravidarum?", options: ["Mild nausea in the morning", "Inability to tolerate any oral fluids for 24 hours", "Food aversion to spicy foods", "Preference for bland foods"], correct: 1, rationale: "Inability to tolerate any oral fluids for 24 hours indicates severe dehydration risk and requires immediate intervention with IV fluids." }
    ]
  },

  "hyperemesis-gravidarum-rn": {
    title: "Hyperemesis Gravidarum",
    image: getAssetUrl("hyperemesisgravidarum_1773340513136.png"),
    cellular: {
      title: "Intractable Pregnancy Emesis",
      content: "Hyperemesis gravidarum results from exaggerated physiological responses to pregnancy hormones, primarily hCG, which peaks at 8-12 weeks gestation. Elevated hCG stimulates the chemoreceptor trigger zone (CTZ) in the area postrema and increases thyroid hormone levels (hCG shares structural homology with TSH). Persistent vomiting depletes intravascular volume, causes electrolyte derangements (hypokalemia, hypochloremic metabolic alkalosis, hyponatremia), and shifts metabolism to fat catabolism with resultant ketonemia. Severe, prolonged cases can lead to Wernicke encephalopathy from thiamine (vitamin B1) depletion, hepatic dysfunction, and renal impairment. The nurse must manage fluid and electrolyte replacement, administer antiemetics, monitor nutritional status, and coordinate multidisciplinary care."
    },
    riskFactors: [
      "Elevated hCG levels (molar pregnancy, multiple gestation)",
      "Primiparous women",
      "History of hyperemesis in prior pregnancy (15-20% recurrence)",
      "History of motion sickness, migraines, or GI disorders",
      "Hyperthyroidism (hCG-mediated)",
      "Helicobacter pylori infection",
      "Female fetus (associated with higher hCG levels)",
      "Psychological stress and eating disorders"
    ],
    diagnostics: [
      "Evaluate BMP for electrolyte imbalances: hypokalemia, hyponatremia, hypochloremic metabolic alkalosis",
      "Assess urinalysis for ketonuria (indicates fat catabolism from starvation)",
      "Monitor serum BUN/creatinine for prerenal azotemia from dehydration",
      "Evaluate liver function tests (ALT/AST may be mildly elevated in severe cases)",
      "Assess thyroid function: hCG-mediated transient hyperthyroidism is common",
      "Monitor urine specific gravity (>1.030 indicates significant dehydration)",
      "Assess weight trend: >5% loss from pre-pregnancy weight is diagnostic criterion"
    ],
    management: [
      "Initiate IV fluid resuscitation with D5-normal saline or Lactated Ringer's with potassium replacement as ordered",
      "Administer thiamine (vitamin B1) 100 mg IV before dextrose-containing fluids to prevent Wernicke encephalopathy",
      "Administer antiemetic therapy in stepwise approach: pyridoxine/doxylamine → ondansetron → metoclopramide → promethazine",
      "Correct electrolyte imbalances: potassium, magnesium, phosphorus replacement as indicated",
      "Advance diet gradually: clear liquids → BRAT diet → small frequent meals as tolerated",
      "Consider enteral nutrition via nasogastric tube if unable to tolerate oral intake for >72 hours",
      "Monitor and replace fluid deficit: calculate based on weight loss and urine output",
      "Coordinate social work and psychology referral for emotional support"
    ],
    nursingActions: [
      "Perform comprehensive assessment: VS, mucous membranes, skin turgor, capillary refill, daily weight",
      "Maintain strict intake and output with hourly urine output monitoring",
      "Administer antiemetics 30 minutes before meals to optimize oral tolerance",
      "Provide oral hygiene after each emesis episode to prevent dental erosion",
      "Create a low-stimulation environment: minimize strong odors, dim lighting, reduce noise",
      "Educate patient on dietary modifications: cold foods (less odor), dry carbohydrates, ginger, avoiding triggers",
      "Monitor for signs of Wernicke encephalopathy: confusion, ataxia, ophthalmoplegia",
      "Assess psychological well-being and screen for perinatal depression"
    ],
    signs: {
      left: [
        "Persistent nausea and vomiting (>3 episodes/day)",
        "Weight loss >5% of pre-pregnancy weight",
        "Ketonuria on urinalysis",
        "Inability to tolerate oral intake",
        "Ptyalism (excessive salivation)",
        "Fatigue, weakness, dizziness"
      ],
      right: [
        "Severe dehydration with orthostatic hypotension",
        "Hypokalemia (risk for cardiac arrhythmias)",
        "Metabolic alkalosis from loss of gastric HCl",
        "Wernicke encephalopathy triad (confusion, ataxia, ophthalmoplegia)",
        "Mallory-Weiss tears from forceful vomiting",
        "Prerenal acute kidney injury"
      ]
    },
    medications: [
      { name: "Pyridoxine + Doxylamine", type: "Vitamin B6 + Antihistamine", action: "Pyridoxine reduces nausea centrally; doxylamine blocks H1 histamine and muscarinic receptors in the vomiting center", sideEffects: "Drowsiness, dry mouth, constipation", contra: "Concurrent MAOIs", pearl: "First-line combination for pregnancy nausea (FDA Category A). Doxylamine 12.5 mg + pyridoxine 10 mg, taken at bedtime initially, can increase to TID." },
      { name: "Ondansetron (Zofran)", type: "5-HT3 receptor antagonist", action: "Blocks serotonin receptors in the CTZ and vagal afferents, reducing nausea and vomiting signals", sideEffects: "Headache, constipation, QT prolongation, serotonin syndrome (rare)", contra: "Known QT prolongation, concurrent QT-prolonging drugs, first trimester (relative)", pearl: "Second-line after pyridoxine/doxylamine failure. 4 mg IV/PO every 8 hours. Obtain baseline ECG if QT prolongation risk factors present." },
      { name: "Thiamine (Vitamin B1)", type: "Water-soluble vitamin", action: "Essential cofactor for carbohydrate metabolism; prevents Wernicke encephalopathy", sideEffects: "Anaphylaxis (rare with IV), injection site irritation", contra: "None", pearl: "MUST administer 100 mg IV before dextrose-containing fluids. Dextrose increases thiamine demand and can precipitate Wernicke encephalopathy in depleted patients." },
      { name: "Metoclopramide", type: "Dopamine antagonist/prokinetic", action: "Blocks D2 receptors in the CTZ and enhances gastric motility", sideEffects: "Drowsiness, dystonia, tardive dyskinesia (long-term)", contra: "GI obstruction, pheochromocytoma, seizure disorder", pearl: "Third-line antiemetic. 5-10 mg PO/IV every 6-8 hours. Limit use to <12 weeks to minimize tardive dyskinesia risk. Black box warning for neurological side effects." }
    ],
    pearls: [
      "Always administer thiamine BEFORE dextrose-containing IV fluids to prevent Wernicke encephalopathy",
      "Wernicke encephalopathy triad: confusion, ataxia, ophthalmoplegia (nystagmus)",
      "Hypokalemia from vomiting is the most dangerous electrolyte imbalance: risk for cardiac arrhythmias",
      "hCG-mediated transient hyperthyroidism occurs in up to 60% of hyperemesis patients and resolves spontaneously",
      "Cold foods produce fewer nauseating odors than hot foods and are better tolerated"
    ],
    quiz: [
      { question: "Before administering D5NS to a patient with severe hyperemesis gravidarum, the nurse should first administer:", options: ["Ondansetron 4 mg IV", "Thiamine 100 mg IV", "Potassium chloride 20 mEq IV", "Metoclopramide 10 mg IV"], correct: 1, rationale: "Thiamine must be given before dextrose-containing fluids because dextrose increases thiamine demand and can precipitate Wernicke encephalopathy in thiamine-depleted patients." },
      { question: "A patient with hyperemesis gravidarum is confused, unsteady on her feet, and has abnormal eye movements. The nurse should suspect:", options: ["Preeclampsia", "Wernicke encephalopathy", "Eclampsia", "Gestational diabetes"], correct: 1, rationale: "Confusion, ataxia, and ophthalmoplegia (abnormal eye movements) are the classic triad of Wernicke encephalopathy, caused by thiamine deficiency from prolonged vomiting." },
      { question: "Which electrolyte imbalance is most concerning in a patient with persistent vomiting?", options: ["Hypernatremia", "Hypokalemia", "Hypermagnesemia", "Hypercalcemia"], correct: 1, rationale: "Hypokalemia from loss of gastric contents is the most dangerous imbalance, as it can cause life-threatening cardiac arrhythmias." }
    ]
  },

  "hyperemesis-gravidarum-np": {
    title: "Hyperemesis Gravidarum",
    image: getAssetUrl("hyperemesisgravidarum_1773340513136.png"),
    cellular: {
      title: "Pathophysiology and Pharmacotherapeutics",
      content: "Hyperemesis gravidarum involves a complex interplay of hormonal, immunological, and gastrointestinal factors. The primary trigger is rapidly rising hCG, which peaks at 8-12 weeks and stimulates the CTZ via vagal afferents. hCG structural homology with TSH activates thyroid receptors, causing gestational thyrotoxicosis in up to 60% of cases. Estrogen slows gastric motility and relaxes the lower esophageal sphincter. Progesterone reduces smooth muscle tone throughout the GI tract. Severe, prolonged emesis causes dehydration, leading to hemoconcentration, reduced GFR, and prerenal azotemia. Metabolic consequences include hypochloremic hypokalemic metabolic alkalosis from gastric HCl loss, thiamine depletion from impaired intake and increased metabolic demand, and ketosis from fat catabolism. The clinician must prescribe evidence-based stepwise antiemetic therapy, manage fluid and electrolyte replacement, prevent Wernicke encephalopathy, and determine when parenteral or enteral nutrition is required."
    },
    riskFactors: [
      "Gestational trophoblastic disease (molar pregnancy with very high hCG)",
      "Multiple gestation",
      "Prior hyperemesis gravidarum (15-20% recurrence)",
      "Helicobacter pylori infection (2x increased risk)",
      "History of migraines or motion sickness",
      "Female fetus (associated with higher hCG)",
      "Genetic predisposition (GDF15 gene variants)",
      "Preexisting GI disorders (GERD, gastroparesis)"
    ],
    diagnostics: [
      "Order CMP: assess sodium, potassium, chloride, bicarbonate, BUN, creatinine, glucose, calcium, magnesium, phosphorus",
      "Order urinalysis with specific gravity and ketones: specific gravity >1.030 and ketonuria confirm dehydration",
      "Order TSH and free T4: expect suppressed TSH and mildly elevated free T4 in hCG-mediated thyrotoxicosis",
      "Order liver function tests: mild transaminase elevation (<300 U/L) occurs in severe cases",
      "Order amylase and lipase to rule out pancreatitis if persistent epigastric pain",
      "Order thiamine level if prolonged course (>3 weeks) or neurological symptoms present",
      "Consider abdominal ultrasound if biliary disease or molar pregnancy is suspected",
      "Order quantitative hCG if gestational trophoblastic disease is a concern"
    ],
    management: [
      "Prescribe stepwise antiemetic therapy: Step 1: pyridoxine 25 mg TID ± doxylamine 12.5 mg TID; Step 2: add ondansetron 4 mg q8h; Step 3: add metoclopramide 5-10 mg q6h or promethazine 12.5-25 mg q6h",
      "Prescribe IV fluid resuscitation: NS or LR at 200 mL/hr initially, then titrate to maintain UOP >0.5 mL/kg/hr",
      "Prescribe thiamine 100 mg IV daily for 3-5 days, then 100 mg PO daily until oral intake is adequate",
      "Prescribe electrolyte replacement: KCl 10-40 mEq/L in IV fluids for hypokalemia; magnesium sulfate 2g IV for hypomagnesemia",
      "Order total parenteral nutrition (TPN) or peripheral parenteral nutrition (PPN) if unable to tolerate oral or enteral feeds for >5-7 days",
      "Do NOT prescribe antithyroid medications for hCG-mediated gestational thyrotoxicosis (self-limiting)",
      "Consider corticosteroids (methylprednisolone 16 mg TID tapered over 2 weeks) for refractory cases after first trimester",
      "Prescribe acid suppression (famotidine 20 mg BID) for concurrent esophagitis from frequent vomiting"
    ],
    nursingActions: [
      "Develop individualized management plan based on severity scoring (PUQE score: Pregnancy-Unique Quantification of Emesis)",
      "Prescribe dietary modifications: small meals every 1-2 hours, protein-dominant snacks, cold foods, avoidance of triggers",
      "Order outpatient IV hydration sessions for patients who can be managed without hospitalization",
      "Assess for Wernicke encephalopathy at every encounter: mental status, gait, eye movements",
      "Evaluate for signs of esophageal injury: hematemesis suggesting Mallory-Weiss tear",
      "Provide anticipatory guidance: condition typically improves by 20 weeks; 10% persist to delivery",
      "Screen for perinatal depression and anxiety, which are significantly increased in hyperemesis",
      "Discuss future pregnancy planning: 15-20% recurrence risk, pre-conception pyridoxine supplementation may reduce severity"
    ],
    signs: {
      left: [
        "Intractable nausea and vomiting (>3 episodes/day for >2 weeks)",
        "Weight loss >5% of pre-pregnancy weight (diagnostic criterion)",
        "Ketonuria ≥2+ on urinalysis",
        "Ptyalism (excessive salivation)",
        "Dehydration signs: dry mucous membranes, poor turgor, tachycardia"
      ],
      right: [
        "Wernicke encephalopathy (confusion, ataxia, nystagmus/ophthalmoplegia)",
        "Severe hypokalemia (<3.0 mEq/L) with ECG changes",
        "Prerenal AKI (BUN:creatinine ratio >20:1)",
        "Mallory-Weiss tear (hematemesis from forceful vomiting)",
        "Central pontine myelinolysis (from rapid sodium correction)",
        "Hepatic dysfunction (transaminases >300)"
      ]
    },
    medications: [
      { name: "Pyridoxine + Doxylamine (Diclegis/Diclectin)", type: "Vitamin B6 + H1 antihistamine", action: "Pyridoxine supports amino acid metabolism; doxylamine blocks H1 receptors in the vomiting center and vestibular system", sideEffects: "Drowsiness, dry mouth, constipation", contra: "MAOIs, severe hepatic impairment", pearl: "Only FDA-approved medication for nausea/vomiting of pregnancy (Category A). Start with 2 tablets at bedtime, can increase to 4 tablets daily (1 AM, 1 mid-day, 2 PM)." },
      { name: "Ondansetron", type: "5-HT3 antagonist", action: "Blocks serotonin at CTZ and vagal afferents", sideEffects: "Constipation, headache, QT prolongation, possible small increased risk of cleft palate in first trimester", contra: "QT prolongation, concurrent QT-prolonging drugs, apomorphine use", pearl: "Most commonly used rescue antiemetic. Prescribe 4 mg PO/IV q8h PRN. Obtain baseline ECG if patient has cardiac risk factors. Avoid in first trimester if possible due to uncertain teratogenic risk." },
      { name: "Methylprednisolone", type: "Corticosteroid", action: "Suppresses prostaglandin synthesis and reduces CTZ sensitivity; anti-inflammatory effects on GI tract", sideEffects: "Hyperglycemia, insomnia, immunosuppression, adrenal suppression", contra: "First trimester (possible cleft palate risk), active infection", pearl: "Reserved for refractory hyperemesis after 10 weeks. Start 16 mg PO TID x3 days, then taper over 2 weeks. Avoid in first trimester due to possible oral cleft association." },
      { name: "Thiamine (B1)", type: "Water-soluble vitamin", action: "Essential cofactor for pyruvate dehydrogenase and alpha-ketoglutarate dehydrogenase in carbohydrate metabolism", sideEffects: "Rare anaphylaxis with IV (give test dose if concern)", contra: "None", pearl: "Prescribe 100 mg IV before any dextrose infusion. Body stores of thiamine deplete in 2-3 weeks of inadequate intake. Wernicke encephalopathy is preventable but irreversible once established." }
    ],
    pearls: [
      "Gestational thyrotoxicosis from hCG does NOT require antithyroid treatment; it resolves as hCG declines after 12 weeks",
      "PUQE score (Pregnancy-Unique Quantification of Emesis) helps classify severity and guide treatment escalation",
      "Thiamine body stores deplete within 2-3 weeks: any patient vomiting >2 weeks needs supplementation",
      "Correct hyponatremia slowly (<8 mEq/L per 24 hours) to prevent central pontine myelinolysis",
      "GDF15 gene variants have been identified as a major genetic risk factor for hyperemesis gravidarum"
    ],
    quiz: [
      { question: "A patient with hyperemesis gravidarum has suppressed TSH and elevated free T4. The clinician should:", options: ["Prescribe methimazole immediately", "Recognize this as hCG-mediated gestational thyrotoxicosis requiring no antithyroid treatment", "Order radioactive iodine uptake", "Start propranolol for thyroid storm"], correct: 1, rationale: "Gestational thyrotoxicosis from hCG's structural similarity to TSH is self-limiting and resolves as hCG levels decline after the first trimester. Antithyroid medications are not indicated." },
      { question: "Which medication is FDA Category A for pregnancy nausea and should be prescribed as first-line therapy?", options: ["Ondansetron", "Promethazine", "Pyridoxine + doxylamine (Diclegis)", "Methylprednisolone"], correct: 2, rationale: "Pyridoxine + doxylamine combination (Diclegis/Diclectin) is the only FDA Category A medication for nausea and vomiting of pregnancy, making it the appropriate first-line prescription." },
      { question: "A patient has been vomiting for 3 weeks and presents with confusion and unsteady gait. Before starting IV fluids with dextrose, the clinician must first prescribe:", options: ["Ondansetron 4 mg IV", "Thiamine 100 mg IV", "Magnesium sulfate 2g IV", "Methylprednisolone 16 mg IV"], correct: 1, rationale: "Thiamine must be administered before dextrose because glucose metabolism increases thiamine demand. In a depleted patient, dextrose without thiamine can precipitate or worsen Wernicke encephalopathy." }
    ]
  },

  "rh-alloimmunization-rpn": {
    title: "Rh Alloimmunization",
    cellular: {
      title: "Rh Incompatibility Basics",
      content: "Rh alloimmunization occurs when a pregnant patient with Rh-negative blood is exposed to Rh-positive fetal red blood cells. This exposure triggers the maternal immune system to produce anti-D antibodies because it does not recognize the Rh (D) antigen on fetal RBCs. In a first pregnancy, the response is typically mild (IgM). However, in subsequent pregnancies with an Rh-positive fetus, the sensitized immune system mounts a rapid IgG response that crosses the placenta and destroys fetal RBCs, causing hemolytic disease of the fetus and newborn (HDFN). Prevention involves administering Rh immune globulin (RhoGAM) to unsensitized Rh-negative patients. The nurse assists with monitoring and supports the care plan as directed."
    },
    riskFactors: [
      "Rh-negative mother with Rh-positive partner",
      "Prior pregnancy with Rh-positive fetus without RhoGAM prophylaxis",
      "Trauma during pregnancy (placental disruption)",
      "Invasive procedures (amniocentesis, chorionic villus sampling)",
      "Ectopic pregnancy, miscarriage, or elective termination",
      "Placental abruption or placenta previa",
      "Manual removal of placenta",
      "External cephalic version"
    ],
    diagnostics: [
      "Report patient blood type and Rh status as documented",
      "Assist with blood draw for antibody screening as directed",
      "Monitor newborn for signs of jaundice (yellow skin, scleral icterus)",
      "Report any trauma or vaginal bleeding during pregnancy to the RN",
      "Monitor newborn vital signs and feeding patterns as directed"
    ],
    management: [
      "Ensure RhoGAM is administered as ordered at 28 weeks gestation",
      "Ensure RhoGAM is administered within 72 hours after delivery if newborn is Rh-positive",
      "Assist with blood specimen collection for type and screen",
      "Report any sensitizing events (trauma, bleeding, procedures) to the RN",
      "Support patient education on the importance of RhoGAM in current and future pregnancies"
    ],
    nursingActions: [
      "Verify patient's blood type and Rh status on admission",
      "Confirm RhoGAM administration at 28 weeks gestation",
      "Confirm RhoGAM administration within 72 hours postpartum",
      "Monitor newborn for signs of hemolytic disease: jaundice, pallor, lethargy",
      "Report significant jaundice within the first 24 hours (pathological jaundice)",
      "Assist with newborn blood type and Coombs testing as directed",
      "Educate patient on the importance of Rh status identification in future pregnancies"
    ],
    signs: {
      left: [
        "Maternal Rh-negative blood type identified on prenatal labs",
        "Negative indirect Coombs test (not yet sensitized)",
        "No maternal symptoms from Rh incompatibility"
      ],
      right: [
        "Positive indirect Coombs test (maternal sensitization has occurred)",
        "Newborn jaundice within first 24 hours (hemolytic disease)",
        "Newborn pallor, anemia, hepatosplenomegaly",
        "Hydrops fetalis in severe cases (generalized fetal edema)"
      ]
    },
    medications: [
      { name: "Rh Immune Globulin (RhoGAM)", type: "Anti-D immunoglobulin", action: "Binds to Rh-positive fetal RBCs in maternal circulation, preventing maternal immune recognition and antibody formation", sideEffects: "Injection site pain, low-grade fever, myalgia", contra: "Known Rh-positive patient, prior Rh sensitization", pearl: "Administered IM at 28 weeks gestation and within 72 hours postpartum if newborn is Rh-positive. Administer as ordered and confirm correct patient identification." }
    ],
    pearls: [
      "RhoGAM prevents sensitization but cannot treat an already sensitized patient",
      "RhoGAM must be given at 28 weeks AND within 72 hours after delivery",
      "Any event that could cause fetomaternal hemorrhage (trauma, bleeding, procedures) requires RhoGAM evaluation",
      "Jaundice within the first 24 hours of life is always pathological and requires immediate reporting",
      "The father's Rh status determines if the fetus could be Rh-positive"
    ],
    quiz: [
      { question: "When should RhoGAM be administered to an unsensitized Rh-negative pregnant patient?", options: ["Only at delivery", "At 28 weeks gestation and within 72 hours postpartum", "Monthly throughout pregnancy", "Only if the father is Rh-negative"], correct: 1, rationale: "RhoGAM is administered prophylactically at 28 weeks gestation and again within 72 hours after delivery if the newborn is Rh-positive." },
      { question: "An Rh-negative patient experiences a fall at 30 weeks gestation. What should the nurse report?", options: ["No action needed if the patient feels fine", "Report the trauma to the nurse as an additional dose of RhoGAM may be needed", "Only report if there is visible bleeding", "Document and reassess at the next visit"], correct: 1, rationale: "Any trauma during pregnancy can cause fetomaternal hemorrhage, requiring evaluation for additional RhoGAM administration." },
      { question: "Jaundice in a newborn within the first 24 hours of life suggests:", options: ["Normal physiological jaundice", "Breastfeeding jaundice", "Pathological jaundice requiring immediate evaluation", "Dehydration"], correct: 2, rationale: "Jaundice within the first 24 hours is always pathological and may indicate hemolytic disease. It requires immediate reporting and evaluation." }
    ]
  },

  "rh-alloimmunization-rn": {
    title: "Rh Alloimmunization",
    cellular: {
      title: "Immunological Pathophysiology of Rh",
      content: "Rh alloimmunization is an immune-mediated process triggered when Rh-negative maternal blood is exposed to Rh-positive fetal erythrocytes during fetomaternal hemorrhage (FMH). Initial exposure produces a primary immune response with IgM anti-D antibodies that are too large to cross the placenta. Subsequent exposure in a future pregnancy elicits a rapid anamnestic IgG response. These IgG anti-D antibodies cross the placenta and bind to Rh (D) antigens on fetal RBCs, marking them for destruction by the fetal reticuloendothelial system. Progressive hemolysis causes fetal anemia, extramedullary hematopoiesis (hepatosplenomegaly), hyperbilirubinemia, hypoalbuminemia, and in severe cases, hydrops fetalis with high-output cardiac failure. The nurse must monitor antibody titers, coordinate fetal surveillance, administer RhoGAM prophylaxis, and manage the newborn with hemolytic disease."
    },
    riskFactors: [
      "Rh-negative mother with Rh-positive partner (50-100% chance of Rh-positive fetus)",
      "Previous pregnancy without RhoGAM prophylaxis",
      "Fetomaternal hemorrhage from trauma, placental abruption, or previa",
      "Invasive procedures: amniocentesis, CVS, cordocentesis",
      "Miscarriage, ectopic pregnancy, or therapeutic abortion",
      "Manual placental removal or cesarean delivery",
      "External cephalic version",
      "Significant antepartum bleeding"
    ],
    diagnostics: [
      "Perform and interpret indirect Coombs test (antibody screen): detects maternal anti-D antibodies",
      "Monitor anti-D antibody titers serially: critical titer is typically ≥1:16 (indicates risk for fetal hemolysis)",
      "Interpret direct Coombs test on newborn cord blood: positive indicates antibodies coating fetal RBCs",
      "Evaluate newborn bilirubin levels: rising indirect bilirubin indicates ongoing hemolysis",
      "Monitor newborn CBC: anemia, elevated reticulocyte count, nucleated RBCs indicate hemolytic disease",
      "Evaluate Kleihauer-Betke test to quantify fetomaternal hemorrhage volume",
      "Coordinate middle cerebral artery (MCA) Doppler studies ordered by provider to assess fetal anemia"
    ],
    management: [
      "Administer RhoGAM 300 mcg IM at 28 weeks gestation for unsensitized Rh-negative patients",
      "Administer RhoGAM within 72 hours postpartum if newborn blood type is Rh-positive",
      "Administer additional RhoGAM after any sensitizing event: trauma, bleeding, invasive procedures",
      "Calculate additional RhoGAM dosing based on Kleihauer-Betke results (300 mcg covers 30 mL fetal whole blood)",
      "For sensitized mothers: coordinate serial MCA Doppler and antibody titer monitoring",
      "Prepare for possible intrauterine transfusion if severe fetal anemia is detected",
      "Initiate phototherapy for newborn hyperbilirubinemia per protocol",
      "Prepare for exchange transfusion if bilirubin exceeds critical threshold despite phototherapy"
    ],
    nursingActions: [
      "Verify maternal blood type and Rh status on admission to prenatal care and labor unit",
      "Confirm antibody screen (indirect Coombs) results and report positive findings",
      "Administer RhoGAM following correct blood bank procedures: verify patient ID, product match, expiration",
      "Assess newborn for hemolytic disease: jaundice onset timing, pallor, hepatosplenomegaly, lethargy",
      "Implement and monitor phototherapy: eye protection, skin exposure, temperature, hydration",
      "Monitor bilirubin levels every 4-8 hours during phototherapy per protocol",
      "Educate patient on Rh incompatibility, importance of RhoGAM in all pregnancies, and reporting trauma or bleeding",
      "Coordinate with blood bank for immediate newborn blood type and Coombs testing at delivery"
    ],
    signs: {
      left: [
        "Maternal Rh-negative status identified on initial prenatal labs",
        "Negative indirect Coombs test (unsensitized)",
        "Routine antibody screen at 28 weeks confirms eligibility for RhoGAM",
        "No maternal clinical signs (Rh incompatibility is asymptomatic in the mother)"
      ],
      right: [
        "Positive indirect Coombs (maternal sensitization confirmed)",
        "Rising anti-D titers ≥1:16 (critical threshold for fetal risk)",
        "Newborn with jaundice within first 24 hours",
        "Newborn anemia, hepatosplenomegaly, positive direct Coombs",
        "Elevated MCA peak systolic velocity (>1.5 MoM indicates fetal anemia)",
        "Hydrops fetalis: ascites, pleural effusion, skin edema, scalp edema on ultrasound"
      ]
    },
    medications: [
      { name: "Rh Immune Globulin (RhoGAM)", type: "Anti-D immunoglobulin", action: "Binds Rh-positive fetal RBCs in maternal circulation, triggering their removal before maternal immune recognition occurs", sideEffects: "Injection site soreness, low-grade fever, mild hemolysis at injection site", contra: "Rh-positive patient, previously sensitized (positive antibody screen), IgA deficiency (some formulations)", pearl: "Standard dose 300 mcg covers 30 mL of fetal whole blood (15 mL of fetal packed RBCs). Administer within 72 hours of sensitizing event. For FMH >30 mL, calculate additional vials from Kleihauer-Betke results." },
      { name: "Phototherapy", type: "Bilirubin reduction", action: "Converts unconjugated bilirubin in the skin to water-soluble photoisomers that can be excreted without hepatic conjugation", sideEffects: "Dehydration, temperature instability, bronze baby syndrome, retinal damage if eyes unprotected", contra: "Conjugated hyperbilirubinemia (direct bilirubin elevation)", pearl: "Eye shields must remain in place during treatment. Maximize skin exposure. Monitor temperature and hydration every 2-4 hours. Rebound bilirubin should be checked 12-24 hours after discontinuation." },
      { name: "Intravenous Immunoglobulin (IVIG)", type: "Immune modulator", action: "Saturates Fc receptors on fetal/neonatal reticuloendothelial cells, reducing antibody-mediated RBC destruction", sideEffects: "Headache, flushing, hypotension, risk of renal impairment", contra: "IgA deficiency (anaphylaxis risk)", pearl: "Used as adjunct to phototherapy in neonatal hemolytic disease to reduce the need for exchange transfusion. Dose: 0.5-1 g/kg IV over 2 hours." }
    ],
    pearls: [
      "The indirect Coombs test screens maternal serum for anti-D antibodies; the direct Coombs test checks if antibodies are coating the newborn's RBCs",
      "Critical anti-D titer ≥1:16 warrants referral for serial MCA Doppler assessment of fetal anemia",
      "Kleihauer-Betke test detects fetal hemoglobin in maternal blood and quantifies the volume of fetomaternal hemorrhage",
      "Jaundice within the first 24 hours is ALWAYS pathological and suggests hemolytic disease",
      "RhoGAM is ineffective once sensitization has occurred (positive indirect Coombs); management shifts to fetal surveillance"
    ],
    quiz: [
      { question: "Which test detects maternal anti-D antibodies indicating Rh sensitization?", options: ["Direct Coombs test", "Indirect Coombs test", "Kleihauer-Betke test", "Complete blood count"], correct: 1, rationale: "The indirect Coombs test screens maternal serum for anti-D antibodies. A positive result indicates sensitization has occurred. The direct Coombs is performed on the newborn's cord blood." },
      { question: "A Kleihauer-Betke test shows significant fetomaternal hemorrhage. How does the nurse calculate the RhoGAM dose?", options: ["One vial regardless of hemorrhage volume", "300 mcg for every 30 mL of fetal whole blood detected", "Two vials given 24 hours apart", "Based on maternal weight"], correct: 1, rationale: "Each 300 mcg vial of RhoGAM covers 30 mL of fetal whole blood (15 mL fetal packed RBCs). The Kleihauer-Betke quantifies the hemorrhage to determine if additional vials are needed." },
      { question: "A newborn with a positive direct Coombs test develops jaundice at 6 hours of life. What intervention should the nurse anticipate?", options: ["Continue routine monitoring", "Initiate phototherapy immediately", "Increase formula feeding only", "Apply sunlight exposure through the window"], correct: 1, rationale: "Jaundice within the first 24 hours with a positive direct Coombs indicates immune-mediated hemolytic disease. Phototherapy should be initiated promptly to prevent bilirubin neurotoxicity." }
    ]
  },

  "rh-alloimmunization-np": {
    title: "Rh Alloimmunization",
    cellular: {
      title: "Immunopathophysiology and Fetal Management",
      content: "Rh alloimmunization triggers a Type II hypersensitivity reaction in which maternal IgG anti-D antibodies cross the placenta and opsonize fetal Rh-positive erythrocytes. These opsonized cells are destroyed by Fc receptor-bearing macrophages in the fetal spleen and liver (extravascular hemolysis). Fetal anemia triggers compensatory extramedullary hematopoiesis in the liver and spleen (hepatosplenomegaly), while hyperbilirubinemia from hemolysis causes unconjugated bilirubin accumulation. In utero, unconjugated bilirubin is cleared by the placenta; after birth, it rapidly rises, potentially causing kernicterus (bilirubin encephalopathy). Severe anemia leads to high-output cardiac failure, hypoalbuminemia from impaired hepatic protein synthesis, and hydrops fetalis (effusions, ascites, generalized edema). The clinician must manage the alloimmunized pregnancy with serial antibody titers, MCA Doppler surveillance, coordinate intrauterine transfusion when indicated, and manage neonatal hemolytic disease with phototherapy, IVIG, and possible exchange transfusion."
    },
    riskFactors: [
      "Prior sensitized pregnancy with rising antibody titers",
      "History of hydrops fetalis or neonatal exchange transfusion in prior pregnancy",
      "Rh-positive fetal genotype (confirmed by cell-free fetal DNA in maternal blood)",
      "Large-volume fetomaternal hemorrhage (placental abruption, trauma)",
      "Failed or missed RhoGAM prophylaxis in prior pregnancy",
      "Multiple sensitizing events (repeat amniocentesis, prior ectopic)",
      "Maternal anti-D titer ≥1:16 (critical titer indicating active hemolysis risk)",
      "Known paternal Rh-positive homozygosity (100% chance of Rh-positive fetus)"
    ],
    diagnostics: [
      "Order cell-free fetal DNA (cffDNA) from maternal blood to determine fetal Rh(D) status non-invasively",
      "Order serial indirect Coombs with anti-D antibody titers monthly until 24 weeks, then every 2 weeks",
      "Order MCA Doppler peak systolic velocity (PSV) every 1-2 weeks when titers reach critical threshold (≥1:16)",
      "Interpret MCA PSV: >1.5 multiples of the median (MoM) indicates moderate-to-severe fetal anemia",
      "Order amniocentesis for delta OD450 (Liley curve) if MCA Doppler is equivocal",
      "Order percutaneous umbilical blood sampling (cordocentesis) to directly measure fetal hematocrit before intrauterine transfusion",
      "Order serial fetal ultrasound for signs of hydrops: ascites, pleural effusion, skin edema, placentomegaly, polyhydramnios",
      "Order cord blood at delivery: type, Rh, direct Coombs, bilirubin, hemoglobin, reticulocyte count"
    ],
    management: [
      "Prescribe RhoGAM 300 mcg IM at 28 weeks for unsensitized Rh-negative patients (prevention)",
      "For sensitized pregnancies: do NOT administer RhoGAM (ineffective once sensitized); shift to surveillance-based management",
      "Refer to maternal-fetal medicine for intrauterine transfusion (IUT) when MCA PSV >1.5 MoM or fetal hematocrit <30%",
      "Prescribe IVIG 1 g/kg weekly to the mother starting at 10-12 weeks for patients with prior severely affected pregnancy (delays onset of fetal anemia)",
      "Plan delivery timing: 37-38 weeks for mild alloimmunization; 34-37 weeks for moderate; earlier if IUT-dependent",
      "Order neonatal phototherapy for total serum bilirubin (TSB) exceeding hour-specific thresholds per AAP guidelines",
      "Prescribe IVIG 0.5-1 g/kg to the neonate if TSB is rising despite intensive phototherapy and approaching exchange transfusion threshold",
      "Order double-volume exchange transfusion for severe neonatal hyperbilirubinemia (TSB within 2 mg/dL of exchange threshold) or signs of acute bilirubin encephalopathy"
    ],
    nursingActions: [
      "Develop comprehensive management plan based on sensitization status, antibody titer trajectory, and fetal assessment",
      "Counsel patient on the difference between prevention (RhoGAM) and management of established sensitization",
      "Coordinate MFM referral for patients with critical titers or ultrasound findings of fetal compromise",
      "Order and interpret neonatal labs: total and direct bilirubin, CBC, reticulocyte count, blood type, direct Coombs",
      "Prescribe phototherapy parameters: irradiance level, distance from skin, body surface area exposure",
      "Determine when to escalate from phototherapy to exchange transfusion based on bilirubin trajectory and clinical signs",
      "Provide genetic counseling: discuss paternal Rh genotype testing and implications for future pregnancies",
      "Educate on importance of carrying Rh-negative identification and informing all healthcare providers of sensitization status"
    ],
    signs: {
      left: [
        "Rising anti-D titers on serial indirect Coombs testing",
        "MCA PSV approaching 1.5 MoM (moderate fetal anemia developing)",
        "Ultrasound evidence of hepatosplenomegaly",
        "Maternal Rh-negative status with confirmed Rh-positive fetal genotype"
      ],
      right: [
        "MCA PSV >1.5 MoM (severe fetal anemia requiring IUT)",
        "Hydrops fetalis (ascites, effusions, scalp/skin edema, placentomegaly)",
        "Fetal hematocrit <20% on cordocentesis",
        "Neonatal TSB >25 mg/dL (risk of kernicterus)",
        "Acute bilirubin encephalopathy signs: lethargy, hypotonia, high-pitched cry, opisthotonus",
        "Sinusoidal fetal heart rate pattern (severe fetal anemia)"
      ]
    },
    medications: [
      { name: "Rh Immune Globulin (RhoGAM)", type: "Anti-D immunoglobulin", action: "Prevents primary alloimmunization by destroying Rh-positive fetal cells before maternal immune recognition", sideEffects: "Injection site soreness, fever, myalgia", contra: "Already sensitized (positive indirect Coombs), Rh-positive patient", pearl: "Prevention only. 300 mcg covers 30 mL fetal whole blood. Order Kleihauer-Betke for events with potential large FMH. MiniRhoGAM (50 mcg) is used for first-trimester events (miscarriage, ectopic, CVS)." },
      { name: "Intravenous Immunoglobulin (IVIG) - Maternal", type: "Immune modulator", action: "Saturates placental Fc receptors, reducing transplacental transfer of anti-D IgG to the fetus", sideEffects: "Headache, fever, chills, renal impairment, thrombotic events", contra: "IgA deficiency (anaphylaxis risk)", pearl: "1 g/kg weekly starting at 10-12 weeks in severely affected patients. Delays onset of fetal anemia and may reduce need for early IUT. Expensive but effective." },
      { name: "IVIG - Neonatal", type: "Immune modulator", action: "Saturates Fc receptors on neonatal macrophages, reducing antibody-mediated RBC destruction", sideEffects: "Volume overload, necrotizing enterocolitis risk in preterm", contra: "IgA deficiency", pearl: "0.5-1 g/kg IV over 2 hours. Used as adjunct to intensive phototherapy to avoid exchange transfusion. Can repeat once if TSB continues to rise." },
      { name: "Albumin", type: "Plasma volume expander/bilirubin binder", action: "Binds unconjugated bilirubin in plasma, reducing free bilirubin available to cross the blood-brain barrier", sideEffects: "Volume overload, allergic reaction", contra: "Heart failure", pearl: "1 g/kg IV may be given before exchange transfusion to enhance bilirubin removal. Free bilirubin (unbound to albumin) is the toxic fraction that causes kernicterus." }
    ],
    pearls: [
      "Cell-free fetal DNA from maternal blood can determine fetal Rh(D) status as early as 10 weeks, avoiding unnecessary interventions if fetus is Rh-negative",
      "MCA PSV >1.5 MoM has 100% sensitivity for moderate-to-severe fetal anemia (most reliable non-invasive test)",
      "Intrauterine transfusion (IUT) can be performed serially starting from 18-20 weeks and has >90% survival rate",
      "Kernicterus (bilirubin encephalopathy) causes permanent neurological damage: choreoathetoid cerebral palsy, hearing loss, upward gaze palsy",
      "MiniRhoGAM (50 mcg) is sufficient for first-trimester sensitizing events when fetal blood volume is <2.5 mL"
    ],
    quiz: [
      { question: "Which non-invasive test is most reliable for detecting moderate-to-severe fetal anemia in Rh alloimmunization?", options: ["Non-stress test", "Biophysical profile", "Middle cerebral artery Doppler peak systolic velocity", "Maternal indirect Coombs titer"], correct: 2, rationale: "MCA Doppler PSV >1.5 MoM has nearly 100% sensitivity for moderate-to-severe fetal anemia. It has largely replaced amniocentesis (delta OD450) as the primary surveillance tool." },
      { question: "An NP orders cell-free fetal DNA from maternal blood at 12 weeks. What is the purpose of this test in Rh management?", options: ["To determine maternal Rh status", "To determine fetal Rh(D) genotype non-invasively", "To measure anti-D antibody titers", "To detect fetal structural anomalies"], correct: 1, rationale: "Cell-free fetal DNA analysis determines fetal Rh(D) status from a maternal blood draw. If the fetus is Rh-negative, no further surveillance or RhoGAM is needed." },
      { question: "A neonate with hemolytic disease has total serum bilirubin approaching exchange transfusion threshold despite intensive phototherapy. What should the clinician prescribe?", options: ["Oral phenobarbital", "IVIG 0.5-1 g/kg IV", "Increase phototherapy wattage only", "Oral ursodiol"], correct: 1, rationale: "IVIG reduces antibody-mediated hemolysis by saturating Fc receptors on neonatal macrophages. It is used as an adjunct to phototherapy to avoid the risks of exchange transfusion." }
    ]
  }
};
