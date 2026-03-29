import type { LessonContent } from "./types";

export const rnIncompleteBatch4Lessons: Record<string, LessonContent> = {
  "cleft-lip-palate": {
    title: "Cleft Lip and Palate",
    cellular: { title: "Pathophysiology of Cleft Lip and Palate", content: "Cleft lip and cleft palate are congenital craniofacial malformations resulting from failure of fusion of the maxillary and medial nasal processes during embryologic development. Cleft lip occurs when the maxillary prominences fail to merge with the medial nasal prominence between weeks 5–8 of gestation. Cleft palate results from failure of the lateral palatine shelves to fuse with each other and/or the nasal septum between weeks 7–12 of gestation. Clefts may be unilateral or bilateral, complete (extending through the lip/palate into the nasal cavity) or incomplete. The defect disrupts the normal anatomy required for feeding (inability to create adequate suction), speech development (velopharyngeal insufficiency causing hypernasal speech), eustachian tube function (chronic otitis media from poor drainage), dental development (malalignment, missing teeth), and facial aesthetics. The etiology is multifactorial involving genetic predisposition (IRF6, MSX1, TBX22 gene variants) and environmental factors (maternal smoking, alcohol, anticonvulsants such as phenytoin, folate deficiency, retinoic acid). Cleft lip with or without cleft palate occurs in approximately 1 in 700 live births, with higher incidence in Asian and Native American populations. Isolated cleft palate is a separate entity occurring in approximately 1 in 2000 births and is more common in females. The RN plays a critical role in feeding support, pre/post-surgical care, and family education." },
    riskFactors: [
      "Genetic predisposition and family history of cleft lip/palate",
      "Maternal smoking during first trimester (2× increased risk)",
      "Maternal anticonvulsant use (phenytoin, valproic acid, carbamazepine)",
      "Folic acid deficiency during periconceptional period",
      "Maternal alcohol use during pregnancy",
      "Associated genetic syndromes: Pierre Robin sequence, Treacher Collins, velocardiofacial syndrome (22q11.2 deletion)"
    ],
    diagnostics: [
      "Prenatal ultrasound: Cleft lip may be detected as early as 18–20 weeks gestation; isolated cleft palate is more difficult to detect prenatally",
      "Physical examination at birth: Inspect lip and palate; palpate hard and soft palate with gloved finger to detect submucous cleft",
      "Hearing screening and serial audiologic evaluation (high risk for conductive hearing loss from chronic otitis media)",
      "Speech and language assessment beginning at 12–18 months with ongoing monitoring",
      "Dental evaluation for eruption patterns, missing teeth, and malocclusion"
    ],
    management: [
      "Cleft lip repair (cheiloplasty): Typically performed at 3 months of age (Rule of 10s: 10 weeks old, 10 lbs weight, hemoglobin 10 g/dL)",
      "Cleft palate repair (palatoplasty): Typically performed at 9–12 months of age (before speech development begins)",
      "Pre-surgical orthopedics: NAM (nasoalveolar molding) device to approximate cleft segments before lip repair",
      "Specialized feeding: Use specialized bottles (Haberman feeder, Pigeon nipple, squeezable bottles) that do not require suction; upright feeding position",
      "Myringotomy with PE (pressure equalization) tube placement for chronic otitis media with effusion",
      "Speech therapy beginning at 12–18 months for velopharyngeal insufficiency",
      "Alveolar bone grafting at 8–10 years; definitive orthodontics in adolescence; rhinoplasty/lip revision as needed"
    ],
    nursingActions: [
      "Assess airway, breathing, and feeding ability immediately after birth; cleft palate may cause airway difficulty in prone position (Pierre Robin sequence)",
      "Teach parents specialized feeding techniques: upright position (30–45°), use cleft-specific bottles, burp frequently (infants swallow excess air), feed slowly allowing rest periods",
      "Post-operative lip repair: Protect the suture line — use Logan bow or lip sling to minimize tension; avoid placing anything in the mouth (no pacifiers, straws, or spoons touching repair); elbow restraints to prevent infant from touching repair site",
      "Post-operative palate repair: No rigid utensils in mouth for 2–4 weeks; offer soft foods and liquids from a cup (no straws); maintain suture line cleanliness with gentle water rinse after feedings",
      "Monitor for post-operative complications: Bleeding, infection, dehiscence, airway obstruction from edema",
      "Provide emotional support to parents: Address concerns about appearance, feeding challenges, and long-term outcomes; connect with cleft team and support organizations"
    ],
    assessmentFindings: [
      "Visible cleft in the lip (unilateral or bilateral) noted at birth during initial newborn assessment",
      "Palpable defect in the palate (hard and/or soft palate) on oral examination",
      "Feeding difficulties: Poor suction, nasal regurgitation of milk, prolonged feeding times, excessive air swallowing, poor weight gain",
      "Recurrent otitis media with conductive hearing loss",
      "Hypernasal speech from velopharyngeal insufficiency (observed after speech development begins)"
    ],
    signs: {
      left: ["Unilateral incomplete cleft lip with good feeding using specialized bottle", "Age-appropriate weight gain with feeding modifications", "Post-surgical repair healing well with intact suture line", "Mild speech delay responding to speech therapy"],
      right: ["Pierre Robin sequence with cleft palate causing airway obstruction requiring prone positioning or surgical intervention", "Failure to thrive from severe feeding difficulties despite specialized techniques", "Post-surgical hemorrhage or wound dehiscence requiring return to OR", "Bilateral complete cleft lip and palate with associated genetic syndrome"]
    },
    medications: [
      { name: "Acetaminophen (Tylenol)", type: "Non-opioid analgesic/antipyretic", action: "Inhibits prostaglandin synthesis in the CNS, providing analgesia and antipyresis; does not have significant anti-inflammatory properties", sideEffects: "Hepatotoxicity with overdose (most common cause of acute liver failure in the US), allergic reactions (rare)", contra: "Severe hepatic impairment, known hypersensitivity, acute liver failure", pearl: "First-line post-operative pain management in infants after cleft repair: dose 10–15 mg/kg every 4–6 hours (max 75 mg/kg/day for infants); available as oral liquid; avoid combination products to prevent accidental overdose" }
    ],
    pearls: [
      "Rule of 10s for cleft lip repair timing: 10 weeks of age, 10 lbs body weight, hemoglobin ≥ 10 g/dL",
      "NEVER use a regular nipple with a cleft palate infant — they cannot generate adequate suction; use squeezable bottles or specialized cleft feeders that deliver milk with gentle compression",
      "Post-lip repair: Protect the suture line above all else — use elbow restraints (not hand restraints), avoid pacifiers, and prevent the infant from touching the repair",
      "Post-palate repair: Nothing hard in the mouth for 2–4 weeks — no rigid utensils, no straws, no pacifiers; offer soft foods from a cup with a soft spout",
      "Chronic otitis media is almost universal in cleft palate children due to eustachian tube dysfunction — hearing should be monitored regularly as hearing loss affects speech development"
    ],
    quiz: [
      { question: "A newborn with cleft lip and palate is having difficulty feeding. Which nursing intervention is MOST appropriate?", options: ["Use a standard nipple and allow the infant more time to feed", "Use a specialized cleft feeder (Haberman or Pigeon nipple) and feed in an upright position", "Insert a nasogastric tube for all feedings", "Wait until surgical repair before attempting oral feedings"], correct: 1, rationale: "Infants with cleft palate cannot generate adequate suction with a standard nipple. Specialized cleft feeders (Haberman, Pigeon, or squeezable bottles) deliver milk with compression rather than suction. Upright positioning (30–45°) prevents nasal regurgitation and reduces aspiration risk." },
      { question: "After cleft lip repair, which nursing action is MOST important to protect the surgical repair?", options: ["Apply ice packs directly to the lip for 24 hours", "Apply elbow restraints to prevent the infant from touching the suture line", "Offer a pacifier for comfort", "Position the infant prone to reduce swelling"], correct: 1, rationale: "Elbow restraints prevent the infant from reaching and disrupting the lip repair suture line. Pacifiers are contraindicated (pressure on the repair). The infant should be positioned on the back or side, not prone. A Logan bow or lip sling may also be used to minimize tension on the suture line." },
      { question: "Which finding should the RN report IMMEDIATELY after cleft palate repair?", options: ["Mild fussiness controlled with acetaminophen", "Refusal to eat for the first 4 hours post-operatively", "Bright red bleeding from the surgical site", "Mild facial swelling"], correct: 2, rationale: "Bright red bleeding from the palate repair site indicates active hemorrhage and requires immediate intervention. Mild fussiness, temporary feeding refusal, and facial swelling are expected post-operative findings. The RN must monitor closely for bleeding, airway compromise from edema, and signs of infection." }
    ]
  },
  "rn-maternal-newborn-advanced-edge-cases-rn": {
    title: "RN Maternal-Newborn Advanced Edge Cases",
    cellular: { title: "Pathophysiology of Maternal-Newborn Edge Cases", content: "Advanced edge cases in maternal-newborn nursing involve rare but critical clinical scenarios that challenge routine protocols and require rapid clinical judgment. These include shoulder dystocia (failure of the anterior shoulder to deliver after the fetal head, occurring in 0.2–3% of vaginal deliveries, caused by impaction of the anterior shoulder behind the maternal pubic symphysis), amniotic fluid embolism (AFE, a catastrophic event where amniotic fluid enters the maternal circulation causing anaphylactoid-like reaction with cardiovascular collapse, DIC, and respiratory failure — mortality 20–60%), uterine rupture (separation of the uterine wall during labor, most commonly at a prior cesarean scar, causing catastrophic hemorrhage and fetal distress), and umbilical cord prolapse (descent of the cord ahead of the presenting fetal part, compressing it and causing fetal hypoxia). Neonatal edge cases include neonatal abstinence syndrome (NAS, withdrawal symptoms in neonates exposed to opioids in utero, presenting 24–72 hours after birth with irritability, tremors, high-pitched cry, seizures, GI disturbances), hypoxic-ischemic encephalopathy (HIE, brain injury from perinatal asphyxia treated with therapeutic hypothermia), and meconium aspiration syndrome (MAS, aspiration of meconium-stained amniotic fluid causing airway obstruction and chemical pneumonitis). Each scenario demands immediate recognition and protocol-driven response. The RN must be prepared to act decisively in these rare but life-threatening situations." },
    riskFactors: [
      "Shoulder dystocia: fetal macrosomia (> 4000 g), gestational diabetes, post-term pregnancy, maternal obesity, prolonged second stage of labor",
      "Amniotic fluid embolism: labor induction, cesarean delivery, advanced maternal age, multiparous patients, placental abruption",
      "Uterine rupture: prior cesarean delivery (TOLAC/VBAC), prior uterine surgery, oxytocin augmentation, grand multiparity",
      "Cord prolapse: premature rupture of membranes with unengaged presenting part, polyhydramnios, malpresentation (transverse lie, footling breech)",
      "NAS: maternal opioid use disorder, methadone or buprenorphine maintenance therapy, prenatal opioid exposure",
      "HIE: prolonged labor, cord compression, placental abruption, uterine rupture, severe maternal hypotension"
    ],
    diagnostics: [
      "Shoulder dystocia: Recognized by 'turtle sign' (retraction of the fetal head against the perineum after delivery); no diagnostic test — immediate clinical recognition",
      "Amniotic fluid embolism: Clinical diagnosis — sudden cardiovascular collapse, respiratory distress, and DIC during labor or immediately postpartum; no confirmatory test exists",
      "Uterine rupture: Sudden fetal bradycardia, loss of uterine contraction pattern, sudden abdominal pain, vaginal bleeding, change in abdominal contour",
      "Cord prolapse: Palpation or visualization of cord in the vagina; sudden variable or prolonged deceleration on FHR monitor",
      "NAS: Finnegan Neonatal Abstinence Scoring System every 3–4 hours to quantify withdrawal severity",
      "HIE: Apgar scores, cord blood gas analysis (pH, base deficit), neurological examination, amplitude-integrated EEG, MRI at 5–7 days of life",
      "Meconium aspiration: Presence of meconium-stained amniotic fluid, respiratory distress at birth, chest X-ray showing bilateral patchy infiltrates"
    ],
    management: [
      "Shoulder dystocia: Call for help, McRoberts maneuver (hyperflexion of maternal thighs), suprapubic pressure (NOT fundal pressure), Rubin maneuver (rotation of anterior shoulder), delivery of posterior arm, Gaskin maneuver (all-fours position)",
      "Amniotic fluid embolism: Activate code team, intubation and mechanical ventilation, aggressive fluid resuscitation, vasopressors, blood product replacement for DIC, prepare for emergency cesarean if undelivered",
      "Uterine rupture: Emergent cesarean delivery, surgical repair of uterine defect or hysterectomy, massive transfusion protocol",
      "Cord prolapse: Elevate presenting part OFF the cord (examiner's hand in vagina lifting presenting part), fill bladder with 500–700 mL NS to elevate presenting part, knee-chest or Trendelenburg position, emergent cesarean delivery",
      "NAS: Non-pharmacologic first: swaddling, dim lighting, minimal stimulation, skin-to-skin, breastfeeding if appropriate; pharmacologic: morphine or methadone for severe withdrawal (Finnegan score ≥ 8 on 3 consecutive assessments)",
      "HIE: Therapeutic hypothermia (cooling to 33.5°C within 6 hours of birth, maintain for 72 hours) for moderate-to-severe HIE meeting criteria; supportive care for seizures, metabolic derangements"
    ],
    nursingActions: [
      "Shoulder dystocia: Note the time of head delivery, assist with McRoberts positioning, apply suprapubic pressure as directed (NEVER fundal pressure — increases shoulder impaction and risk of brachial plexus injury), prepare for neonatal resuscitation",
      "Cord prolapse: Do NOT remove hand from vagina — continuously elevate the presenting part off the cord until cesarean delivery; monitor FHR continuously; keep cord moist with warm saline-soaked gauze if prolapsed outside the vagina",
      "NAS: Perform Finnegan scoring every 3–4 hours; implement non-pharmacologic comfort measures (swaddling, rocking, dim environment, frequent small feeds); monitor for feeding difficulties, weight loss, and seizures",
      "HIE: Assist with initiation of therapeutic hypothermia protocol; monitor core temperature continuously; assess for complications (bradycardia, coagulopathy, skin breakdown from cooling); perform neurological assessments every 4 hours",
      "Amniotic fluid embolism: Assist with rapid intubation and CPR; prepare for massive transfusion; left lateral uterine displacement if undelivered; document events and interventions",
      "Post-event documentation: Document exact times, maneuvers performed, providers present, neonatal condition, and all interventions for all obstetric emergencies"
    ],
    assessmentFindings: [
      "Turtle sign in shoulder dystocia: Fetal head delivers then retracts tightly against the perineum",
      "Amniotic fluid embolism: Sudden dyspnea, hypotension, altered consciousness, seizures, DIC (bleeding from IV sites and surgical incisions) during or immediately after labor",
      "Uterine rupture: Sudden severe abdominal pain, cessation of contractions, vaginal bleeding, fetal bradycardia, palpable fetal parts through the abdominal wall",
      "Cord prolapse: Cord visible or palpable in the vagina, sudden prolonged fetal deceleration",
      "NAS: High-pitched cry, tremors, hypertonicity, excessive sucking, sneezing, nasal congestion, poor feeding, diarrhea, seizures in severe cases"
    ],
    signs: {
      left: ["Mild NAS with Finnegan scores < 8 managed with non-pharmacologic measures", "Shoulder dystocia resolved with McRoberts and suprapubic pressure alone", "Mild HIE with normal neurological exam at 24 hours", "Brief variable decelerations with cord repositioning resolving the issue"],
      right: ["Shoulder dystocia unresponsive to standard maneuvers requiring delivery of posterior arm", "Amniotic fluid embolism with cardiovascular collapse and DIC", "Complete uterine rupture with fetal extrusion into the abdomen", "Cord prolapse with sustained fetal bradycardia < 60 bpm", "Severe NAS with seizures requiring pharmacologic treatment and NICU admission"]
    },
    medications: [
      { name: "Morphine Sulfate (Neonatal)", type: "Opioid analgesic", action: "Binds to mu-opioid receptors, reducing withdrawal symptoms by partially replacing the opioid the neonate was exposed to in utero; suppresses CNS excitability and GI hyperactivity", sideEffects: "Respiratory depression (primary concern — monitor respiratory rate and SpO2), sedation, constipation, urinary retention, feeding difficulties", contra: "Respiratory depression, prematurity (increased sensitivity to respiratory effects), concurrent use of other CNS depressants", pearl: "Used for NAS when Finnegan scores ≥ 8 on 3 consecutive assessments unresponsive to non-pharmacologic measures; start with low dose (0.04–0.08 mg/kg/dose every 3–4 hours), titrate based on Finnegan scores; wean slowly over days to weeks; monitor respiratory rate (hold if RR < 25 in a neonate)" }
    ],
    pearls: [
      "NEVER apply fundal pressure during shoulder dystocia — it drives the shoulder further into the symphysis and increases risk of brachial plexus injury and uterine rupture",
      "Amniotic fluid embolism is a clinical diagnosis of exclusion — there is no confirmatory laboratory test; mortality is 20–60% and survivors have high rates of neurological morbidity",
      "In cord prolapse, the examiner's hand stays in the vagina elevating the presenting part until cesarean delivery — even in the OR; the priority is preventing cord compression",
      "Therapeutic hypothermia for HIE must be initiated within 6 hours of birth for maximum neuroprotective benefit",
      "NAS scoring with the Finnegan tool must be performed by trained nurses every 3–4 hours — scores ≥ 8 on 3 consecutive assessments trigger pharmacologic treatment",
      "Document the exact TIME of head delivery in shoulder dystocia — the head-to-body delivery interval is a critical medicolegal metric"
    ],
    quiz: [
      { question: "During vaginal delivery, the fetal head delivers but immediately retracts against the perineum. The RN recognizes this as the 'turtle sign.' What maneuver should be performed FIRST?", options: ["Apply fundal pressure to push the baby out", "McRoberts maneuver: hyperflexion of maternal hips with knees to chest", "Begin Zavanelli maneuver (cephalic replacement)", "Perform an immediate episiotomy"], correct: 1, rationale: "McRoberts maneuver is the FIRST intervention for shoulder dystocia. It straightens the sacrum relative to the lumbar spine and rotates the pubic symphysis cephalad, often releasing the impacted shoulder. Fundal pressure is NEVER applied as it worsens the impaction and risks brachial plexus injury." },
      { question: "A laboring patient at 36 weeks has spontaneous rupture of membranes, and the RN sees the umbilical cord protruding from the vagina. Fetal heart rate drops to 70 bpm. What is the PRIORITY nursing action?", options: ["Place the patient in Trendelenburg or knee-chest position and insert a gloved hand to elevate the presenting part off the cord", "Clamp and cut the cord immediately", "Attempt to push the cord back into the uterus", "Begin oxytocin augmentation to expedite delivery"], correct: 0, rationale: "In cord prolapse, the priority is to relieve pressure on the cord by elevating the presenting part. Position the patient in Trendelenburg or knee-chest position and use a gloved hand to lift the presenting part off the cord. Prepare for emergent cesarean delivery. Never attempt to reinsert the cord or clamp it." },
      { question: "A neonate born to a mother on methadone maintenance begins showing tremors, high-pitched crying, and excessive sucking at 36 hours of life. The Finnegan score is 10. What should the RN do?", options: ["Swaddle the neonate and place in a dark, quiet room — continue monitoring", "Report the Finnegan score of 10, continue serial scoring, and anticipate that pharmacologic treatment may be needed if scores remain ≥ 8 on 3 consecutive assessments", "Immediately administer morphine without waiting for additional scores", "Discharge the neonate since the mother is on medication-assisted treatment"], correct: 1, rationale: "A Finnegan score of 10 indicates moderate withdrawal. Per protocol, pharmacologic treatment (morphine) is initiated when scores are ≥ 8 on 3 CONSECUTIVE assessments. Non-pharmacologic measures should continue. The RN should report the score, continue serial scoring every 3–4 hours, and anticipate pharmacologic therapy if scores remain elevated." }
    ]
  },
  "major-depression": {
    title: "Major Depressive Disorder",
    cellular: { title: "Pathophysiology of Major Depressive Disorder", content: "Major depressive disorder (MDD) is a complex neuropsychiatric condition involving dysregulation of multiple neurotransmitter systems, neuroendocrine pathways, and neural circuits. The monoamine hypothesis proposes that depression results from deficits in serotonin (5-HT), norepinephrine (NE), and/or dopamine (DA) neurotransmission. Serotonin modulates mood, sleep, appetite, and impulse control; its deficiency is associated with depressed mood, insomnia, and suicidal ideation. Norepinephrine regulates alertness, energy, and concentration; deficiency produces fatigue, psychomotor retardation, and cognitive impairment. Dopamine drives motivation, pleasure, and reward; its deficiency causes anhedonia (loss of interest or pleasure). Beyond monoamines, neuroplasticity models implicate brain-derived neurotrophic factor (BDNF) deficiency, leading to hippocampal atrophy and impaired neurogenesis. The hypothalamic-pituitary-adrenal (HPA) axis is hyperactive in depression, with elevated cortisol contributing to hippocampal damage and immune dysfunction. Neuroinflammation with elevated proinflammatory cytokines (IL-1, IL-6, TNF-alpha) further disrupts neurotransmitter metabolism and neuroplasticity. Genetic factors account for approximately 40% of risk (polygenic inheritance). The DSM-5 criteria require ≥ 5 symptoms present for ≥ 2 weeks (including depressed mood or anhedonia) causing significant functional impairment: depressed mood, anhedonia, appetite/weight changes, sleep disturbances, psychomotor changes, fatigue, worthlessness/guilt, poor concentration, and recurrent thoughts of death or suicidal ideation. The RN screens for depression using validated tools, assesses suicide risk, provides therapeutic communication, monitors medication response and side effects, and facilitates psychotherapy referrals." },
    riskFactors: [
      "Family history of MDD or other mood disorders (40% heritability)",
      "Prior depressive episodes (strongest predictor of recurrence — 50% recurrence after first episode, 80% after second)",
      "Female sex (2:1 female-to-male ratio for lifetime prevalence)",
      "Adverse childhood experiences (abuse, neglect, parental loss)",
      "Chronic medical illness (cancer, stroke, MI, diabetes, chronic pain)",
      "Substance use disorders (alcohol and drugs — both cause and consequence of depression)",
      "Social isolation, lack of social support, major life stressors (divorce, bereavement, job loss)"
    ],
    diagnostics: [
      "PHQ-9 (Patient Health Questionnaire-9): Validated screening tool scoring 0–27; mild (5–9), moderate (10–14), moderately severe (15–19), severe (20–27)",
      "Clinical interview using DSM-5 criteria: ≥ 5 symptoms for ≥ 2 weeks including depressed mood or anhedonia",
      "Columbia Suicide Severity Rating Scale (C-SSRS) for structured suicide risk assessment",
      "Thyroid function tests (TSH, free T4) to rule out hypothyroidism mimicking depression",
      "CBC, CMP, vitamin B12, folate to rule out medical causes of depressive symptoms",
      "Substance use screening (alcohol, drugs) as comorbidity or causative factor",
      "Beck Depression Inventory (BDI-II) for severity assessment and treatment monitoring"
    ],
    management: [
      "Mild depression (PHQ-9 5–9): Psychotherapy alone (CBT or IPT); lifestyle modifications (exercise, sleep hygiene, social engagement)",
      "Moderate-severe depression (PHQ-9 ≥ 10): Combination of antidepressant medication AND psychotherapy (most effective approach)",
      "First-line medications: SSRIs (sertraline, escitalopram, fluoxetine) — 4–6 weeks for full therapeutic effect",
      "Treatment-resistant depression: Switch or augment medications; consider lithium or atypical antipsychotic augmentation; referral for TMS or ECT",
      "Electroconvulsive therapy (ECT): Most effective treatment for severe/treatment-resistant depression and depression with psychotic features or acute suicidality",
      "Cognitive behavioral therapy (CBT): Evidence-based psychotherapy addressing negative thought patterns and behavioral activation",
      "Safety planning for suicidal patients: Restriction of lethal means, crisis contacts, coping strategies, reasons for living, professional resources"
    ],
    nursingActions: [
      "Screen for depression using PHQ-9 and assess suicide risk using C-SSRS at every encounter; document scores and communicate results to the treatment team",
      "Establish therapeutic rapport using empathetic, nonjudgmental communication; use open-ended questions and active listening; avoid minimizing or dismissing the patient's feelings",
      "Monitor for suicidal ideation: Ask directly — 'Are you having thoughts of ending your life?' Direct questioning does NOT increase risk; assess plan, means, intent, and timeline",
      "Educate patient about antidepressant therapy: Therapeutic onset takes 4–6 weeks; do not stop abruptly (discontinuation syndrome); report worsening mood or new suicidal thoughts (especially in first 2–4 weeks — FDA Black Box Warning for ages < 25)",
      "Implement safety precautions for suicidal patients: 1:1 observation if indicated, remove hazardous items, maintain safe environment, communicate risk level during handoff",
      "Monitor medication side effects: SSRIs — GI upset, sexual dysfunction, insomnia, serotonin syndrome (agitation, hyperthermia, clonus, diaphoresis); MAOIs — hypertensive crisis with tyramine foods",
      "Encourage behavioral activation: Gradually increase activity and social engagement; reinforce self-care (sleep, nutrition, exercise, avoiding isolation)"
    ],
    assessmentFindings: [
      "Depressed mood: Persistent sadness, tearfulness, feeling empty or hopeless",
      "Anhedonia: Loss of interest or pleasure in previously enjoyed activities",
      "Sleep disturbances: Insomnia (early morning awakening is classic) or hypersomnia",
      "Appetite changes: Decreased appetite with weight loss or increased appetite with weight gain",
      "Psychomotor changes: Retardation (slowed speech, movement, thinking) or agitation",
      "Cognitive symptoms: Poor concentration, difficulty making decisions, memory complaints",
      "Suicidal ideation: Thoughts of death, passive wish to die, or active suicidal plan with intent"
    ],
    signs: {
      left: ["Mild depression with PHQ-9 score 5–9 responsive to psychotherapy", "Functional at work and in relationships with mild symptoms", "No suicidal ideation or plan", "Good medication adherence with improving symptoms"],
      right: ["Severe depression with psychotic features (delusions, hallucinations)", "Active suicidal ideation with plan and access to means", "Catatonic depression with refusal to eat or drink", "Treatment-resistant depression failing multiple medication trials", "Depression with psychomotor retardation leading to inability to perform ADLs"]
    },
    medications: [
      { name: "Sertraline (Zoloft)", type: "Selective serotonin reuptake inhibitor (SSRI)", action: "Selectively inhibits serotonin reuptake at the presynaptic neuron, increasing serotonin availability in the synaptic cleft; also weakly inhibits dopamine reuptake", sideEffects: "Nausea, diarrhea, insomnia, sexual dysfunction, headache, dizziness, dry mouth; FDA Black Box Warning: increased suicidality in children, adolescents, and young adults (< 25) during first weeks of treatment; serotonin syndrome with concurrent serotonergic medications", contra: "Concurrent MAOI use (14-day washout required), concurrent pimozide or thioridazine, hypersensitivity", pearl: "First-line SSRI with favorable safety profile; start 25–50 mg daily, increase by 25–50 mg every 1–2 weeks; therapeutic dose 50–200 mg; full effect takes 4–6 weeks; avoid abrupt discontinuation (serotonin discontinuation syndrome: dizziness, paresthesias, irritability); safe in pregnancy relative to other SSRIs" }
    ],
    pearls: [
      "Asking about suicidal ideation does NOT increase risk — it gives permission to discuss and allows for intervention; always ask directly when screening for depression",
      "The FDA Black Box Warning applies to antidepressants in patients under 25: Monitor closely for worsening depression and suicidal ideation during the first 4 weeks of treatment and after dose changes",
      "Antidepressants take 4–6 WEEKS for full therapeutic effect — educate patients to prevent premature discontinuation due to perceived ineffectiveness",
      "The most dangerous period for suicide attempt may be when the patient begins IMPROVING on antidepressants — they may now have enough energy to act on persistent suicidal thoughts before mood fully improves",
      "Serotonin syndrome is a life-threatening emergency: agitation, hyperthermia, clonus, diaphoresis, hyperreflexia — usually from combining serotonergic drugs; discontinue causative agents, provide supportive care, administer cyproheptadine",
      "Never combine MAOIs with SSRIs — at least 14 days washout between the two (5 weeks for fluoxetine due to long half-life)"
    ],
    quiz: [
      { question: "A patient started on sertraline 50 mg daily for MDD calls after 10 days saying the medication is not working and wants to stop. What is the BEST nursing response?", options: ["Advise the patient to stop the medication and try a different one", "Educate that SSRIs typically take 4–6 weeks for full therapeutic effect and encourage continuing the medication while monitoring symptoms", "Suggest doubling the dose to speed up the response", "Tell the patient the medication will never work for them"], correct: 1, rationale: "SSRIs require 4–6 weeks to reach full therapeutic effect due to the time needed for serotonin receptor downregulation and neuroplastic changes. The nurse should educate the patient about this expected timeline, encourage adherence, and schedule follow-up to monitor response and side effects." },
      { question: "A 22-year-old patient recently started on an SSRI reports increased agitation and new thoughts of self-harm during the second week of treatment. What should the RN do?", options: ["Reassure the patient that this is a normal response to the medication", "Immediately notify the prescriber — this may represent treatment-emergent suicidality covered by the FDA Black Box Warning", "Advise the patient to stop the medication immediately without medical guidance", "Schedule a routine follow-up appointment in 4 weeks"], correct: 1, rationale: "The FDA Black Box Warning for antidepressants alerts that patients under 25 may experience treatment-emergent suicidality (worsening mood, increased agitation, new suicidal ideation) during the first weeks of treatment. This requires immediate prescriber notification for dose adjustment, medication change, or closer monitoring/safety planning." },
      { question: "Which validated tool is commonly used for depression screening in primary care and clinical settings?", options: ["Glasgow Coma Scale", "PHQ-9 (Patient Health Questionnaire-9)", "Braden Scale", "CIWA-Ar"], correct: 1, rationale: "The PHQ-9 is a validated 9-item screening tool for depression that scores 0–27, corresponding to severity categories. It is widely used in primary care and inpatient settings for initial screening and treatment monitoring. GCS assesses consciousness level, Braden Scale assesses pressure injury risk, and CIWA-Ar assesses alcohol withdrawal severity." }
    ]
  },
  "conduct-disorder": {
    title: "Conduct Disorder",
    cellular: { title: "Pathophysiology of Conduct Disorder", content: "Conduct disorder (CD) is a psychiatric condition in children and adolescents characterized by a repetitive and persistent pattern of behavior that violates the basic rights of others or age-appropriate societal norms. The neurobiology involves dysfunction in the prefrontal cortex (responsible for impulse control, decision-making, and moral reasoning), the amygdala (emotion processing — particularly fear and empathy), and the reward system (ventral striatum). Neuroimaging studies demonstrate reduced gray matter volume in the prefrontal cortex and amygdala, decreased amygdala activation in response to fearful or distressed facial expressions (explaining reduced empathy), and altered connectivity between the amygdala and prefrontal cortex. Neurochemically, CD is associated with low cortisol levels (blunted stress response and reduced fear conditioning), low resting heart rate (sensation-seeking behavior), decreased serotonin activity (impulsive aggression), and altered dopamine signaling in reward pathways. Genetic factors contribute approximately 50% of variance, with candidate genes including MAOA (monoamine oxidase A) variants, particularly when combined with early adversity (gene-environment interaction). CD is classified by onset: childhood-onset (before age 10, poorer prognosis, more likely to develop antisocial personality disorder in adulthood) and adolescent-onset (after age 10, better prognosis). The DSM-5 specifies 'with limited prosocial emotions' (callous-unemotional traits) as a specifier indicating more severe pathology with lack of remorse, shallow affect, and disregard for others' feelings." },
    riskFactors: [
      "Adverse childhood experiences: physical/sexual abuse, neglect, parental substance abuse, domestic violence",
      "Parenting factors: harsh/inconsistent discipline, poor supervision, lack of parental involvement, parental criminality",
      "Family history of antisocial personality disorder, substance use disorders, or other psychiatric conditions",
      "Comorbid ADHD (present in 30–50% of CD cases — strongest predictor of persistent conduct problems)",
      "Low socioeconomic status, community violence exposure, deviant peer group association",
      "Male sex (3:1 male-to-female ratio in childhood onset; ratio narrows in adolescence)",
      "Prenatal exposure to tobacco, alcohol, or drugs; birth complications"
    ],
    diagnostics: [
      "Clinical interview and behavioral assessment using DSM-5 criteria: ≥ 3 of 15 behaviors in past 12 months (at least 1 in past 6 months) across 4 categories: aggression, destruction, deceitfulness/theft, rule violations",
      "Standardized rating scales: Child Behavior Checklist (CBCL), Conners Rating Scales, Strengths and Difficulties Questionnaire (SDQ)",
      "Assessment for comorbid conditions: ADHD, learning disabilities, substance use, depression, anxiety, PTSD",
      "Collateral information from multiple sources: parents/caregivers, teachers, school records, juvenile justice records",
      "Psychoeducational testing: Rule out intellectual disability or learning disorders contributing to behavioral problems",
      "Substance use screening (early substance use is common in CD)",
      "Safety assessment: Risk of harm to self or others, access to weapons, history of fire-setting, animal cruelty"
    ],
    management: [
      "Multisystemic therapy (MST): Evidence-based family and community-based intervention addressing all systems contributing to behavior (most effective treatment for CD)",
      "Parent management training (PMT): Teaches effective parenting strategies — consistent consequences, positive reinforcement, reduced coercive cycles",
      "Cognitive behavioral therapy (CBT): Anger management, social skills training, problem-solving skills, perspective-taking",
      "Functional family therapy (FFT): Addresses family dynamics contributing to antisocial behavior",
      "School-based interventions: Individualized education plan (IEP), behavioral intervention plan, social skills groups",
      "Pharmacotherapy for comorbidities: Stimulants for ADHD (reduces impulsivity), SSRIs for comorbid depression/anxiety, atypical antipsychotics (risperidone) for severe aggression as last resort",
      "Therapeutic foster care or residential treatment for severe cases unresponsive to community-based interventions"
    ],
    nursingActions: [
      "Establish clear, consistent behavioral expectations and consequences; use matter-of-fact, non-reactive communication",
      "Maintain personal safety and the safety of other patients: Be aware of escalation cues, have de-escalation plan, know emergency procedures",
      "Set firm, non-punitive limits on aggressive or destructive behavior; enforce consequences consistently without power struggles",
      "Build therapeutic rapport through non-judgmental approach; avoid lecturing, moralizing, or engaging in arguments",
      "Assess for underlying trauma, abuse, or neglect that may be driving behavior; mandatory reporting if abuse/neglect is suspected",
      "Monitor for medication side effects if pharmacotherapy is used: metabolic syndrome with antipsychotics (weight gain, glucose, lipids), tics or appetite suppression with stimulants",
      "Educate parents/caregivers on positive behavioral management strategies: positive reinforcement for desired behaviors, consistent consequences for violations, avoiding physical punishment"
    ],
    assessmentFindings: [
      "Aggression toward people or animals: bullying, fighting, cruelty, use of weapons, forced sexual activity",
      "Destruction of property: deliberate fire-setting, vandalism",
      "Deceitfulness or theft: breaking into others' property, lying, shoplifting",
      "Serious rule violations: truancy, running away from home, staying out past curfew (before age 13)",
      "Callous-unemotional traits: Lack of remorse, shallow/deficient affect, unconcerned about performance, lack of empathy",
      "Comorbid symptoms: ADHD (inattention, hyperactivity, impulsivity), substance use, depressive symptoms"
    ],
    signs: {
      left: ["Mild conduct problems responding to outpatient behavioral therapy", "Adolescent-onset CD with supportive family and no callous-unemotional traits", "Improving behavior with consistent parent management training", "Comorbid ADHD well-controlled with stimulant medication"],
      right: ["Childhood-onset CD with callous-unemotional traits and history of animal cruelty", "Fire-setting with escalating severity", "Severe aggression posing imminent danger to others", "CD with comorbid substance use disorder and juvenile justice involvement", "Homicidal ideation with plan and access to means"]
    },
    medications: [
      { name: "Risperidone", type: "Atypical antipsychotic (dopamine D2 and serotonin 5-HT2A antagonist)", action: "Blocks dopamine D2 receptors in the mesolimbic pathway reducing aggression and impulsivity; blocks serotonin 5-HT2A receptors contributing to mood stabilization", sideEffects: "Weight gain, metabolic syndrome (glucose intolerance, hyperlipidemia), extrapyramidal symptoms, prolactin elevation (gynecomastia, galactorrhea, amenorrhea), sedation, tardive dyskinesia (long-term)", contra: "Dementia-related psychosis in elderly (FDA Black Box Warning for increased mortality)", pearl: "FDA-approved for irritability/aggression in autism; used off-label for severe aggression in CD as last resort after behavioral interventions; start low (0.25–0.5 mg daily), titrate slowly; monitor weight, fasting glucose, and lipid panel every 3 months; monitor prolactin levels" }
    ],
    pearls: [
      "Conduct disorder with childhood onset AND callous-unemotional traits has the poorest prognosis and is the strongest predictor of adult antisocial personality disorder",
      "Multisystemic therapy (MST) is the MOST effective treatment for CD — it addresses all contributing systems (family, school, peer, community) in the youth's natural environment",
      "The nurse must avoid power struggles with CD patients — set limits calmly and enforce consequences consistently without engaging emotionally",
      "Always screen for underlying trauma/abuse in children presenting with conduct problems — trauma-informed care approaches may be more appropriate than purely behavioral interventions",
      "Comorbid ADHD is present in 30–50% of CD cases and worsens prognosis; treating ADHD with stimulants can significantly improve conduct-related behaviors by reducing impulsivity",
      "Pharmacotherapy alone is NOT effective for CD — it is only used as an adjunct for comorbid conditions or severe aggression unresponsive to psychosocial interventions"
    ],
    quiz: [
      { question: "Which intervention has the STRONGEST evidence base for treating conduct disorder?", options: ["Antipsychotic medication as monotherapy", "Long-term residential treatment", "Multisystemic therapy (MST) addressing family, school, peer, and community factors", "Strict punishment-based behavioral programs"], correct: 2, rationale: "MST is the most evidence-based treatment for CD. It addresses all systems contributing to antisocial behavior in the youth's natural environment. Medication alone is insufficient. Residential treatment removes the youth from the environment and has limited generalization. Punishment-based programs can worsen oppositional behavior." },
      { question: "A 14-year-old with conduct disorder becomes verbally aggressive during a group therapy session. What is the BEST nursing approach?", options: ["Argue with the adolescent to show authority", "Calmly set a clear limit on the behavior and offer a choice: stop the behavior or leave the group to de-escalate", "Ignore the behavior to avoid giving attention", "Immediately place the adolescent in physical restraints"], correct: 1, rationale: "The nurse should calmly set a firm, non-punitive limit and offer choices that give the adolescent a sense of control while maintaining safety. Avoid power struggles (arguing), which escalate aggression. Ignoring aggressive behavior risks harm to others. Restraints are a last resort for imminent danger only." },
      { question: "The RN is assessing a child referred for behavioral problems. Which finding is MOST concerning for severe conduct disorder?", options: ["Occasional arguments with parents about homework", "Cruelty to animals, fire-setting, and lack of remorse after hurting a peer", "Difficulty sitting still in class and calling out without raising hand", "Crying when separated from parents for school"], correct: 1, rationale: "Animal cruelty, fire-setting, and lack of remorse (callous-unemotional traits) are among the most serious findings in CD, associated with the worst prognosis and highest risk for developing antisocial personality disorder. The other options suggest typical parent-child conflict, ADHD, and separation anxiety, respectively." }
    ]
  },
  "delirium-screening-and-management-rn": {
    title: "Delirium Screening and Management",
    cellular: { title: "Pathophysiology of Delirium", content: "Delirium is an acute, fluctuating disturbance in attention, awareness, and cognition that develops over hours to days and is caused by a medical condition, substance, or combination of factors. The pathophysiology involves widespread cortical and subcortical dysfunction from a final common pathway of neurotransmitter imbalance: decreased acetylcholine activity (cholinergic deficiency) and increased dopaminergic activity. Additional mechanisms include neuroinflammation (elevated IL-1, IL-6, TNF-alpha crossing the blood-brain barrier), oxidative stress, disruption of the blood-brain barrier, and alterations in cerebral metabolism. Predisposing factors (baseline vulnerability) include advanced age, pre-existing dementia, sensory impairment, and functional dependence. Precipitating factors (acute triggers) include infection, medications (anticholinergics, benzodiazepines, opioids), metabolic derangements, surgery, pain, urinary retention, constipation, and sleep deprivation. Delirium is classified into three subtypes: hyperactive (agitation, hallucinations, combativeness — 25%), hypoactive (lethargy, decreased alertness, apathy — 50%, often unrecognized), and mixed (fluctuating between hyper and hypoactive — 25%). Delirium is associated with increased mortality (3–5× higher), prolonged hospitalization, accelerated cognitive decline, increased institutionalization, and higher healthcare costs. The CAM (Confusion Assessment Method) is the gold-standard screening tool." },
    riskFactors: [
      "Advanced age (> 65 years — strongest predisposing factor)",
      "Pre-existing dementia (2–5× increased risk for delirium)",
      "Acute infection (especially UTI, pneumonia — most common precipitant)",
      "Medications: anticholinergics (diphenhydramine, oxybutynin), benzodiazepines, opioids, corticosteroids",
      "Post-operative state (especially after hip fracture repair, cardiac surgery)",
      "ICU admission (ICU delirium affects 50–80% of mechanically ventilated patients)",
      "Sensory impairment (hearing loss, visual impairment), sleep deprivation, physical restraint use"
    ],
    diagnostics: [
      "Confusion Assessment Method (CAM): Gold standard — 4 features: (1) acute onset and fluctuating course, (2) inattention, (3) disorganized thinking, (4) altered level of consciousness; requires features 1 + 2 PLUS either 3 or 4",
      "CAM-ICU: Modified for intubated/nonverbal patients using RASS for consciousness and visual/auditory attention tests",
      "CBC, BMP, urinalysis, urine culture: Screen for infection and metabolic derangements",
      "Medication review: Identify delirium-causing medications (anticholinergics, benzodiazepines, opioids, H2 blockers)",
      "Chest X-ray: Rule out pneumonia as precipitating cause",
      "Blood glucose, thyroid function, liver function, ammonia level (hepatic encephalopathy)",
      "CT head (without contrast) if neurological cause suspected (stroke, subdural hematoma) or if no other cause identified"
    ],
    management: [
      "TREAT THE UNDERLYING CAUSE first: Antibiotics for infection, correct metabolic abnormalities, remove offending medications, relieve pain, address urinary retention/constipation",
      "Non-pharmacologic interventions (FIRST-LINE): Reorientation (clocks, calendars, familiar objects), maintain sleep-wake cycle, ensure glasses and hearing aids are in place, early mobilization, minimize tethers (restraints, catheters, lines)",
      "ABCDEF Bundle for ICU delirium: Assess pain, Both SAT and SBT, Choice of sedation (avoid benzodiazepines), Delirium monitoring, Early mobility, Family engagement",
      "Pharmacologic management (for severe agitation threatening patient safety ONLY): Haloperidol 0.5–1 mg IV/IM (first-line antipsychotic); avoid in QTc prolongation or Parkinson disease",
      "Avoid benzodiazepines (worsen delirium) EXCEPT for alcohol/benzodiazepine withdrawal delirium and delirium from seizures",
      "Avoid physical restraints if possible (restraints worsen delirium and increase agitation, fall risk, and mortality)",
      "Prevention: HELP protocol (Hospital Elder Life Program): orientation, therapeutic activities, sleep enhancement, early mobilization, vision/hearing optimization, hydration"
    ],
    nursingActions: [
      "Screen for delirium using CAM or CAM-ICU every shift and with any change in mental status",
      "Differentiate delirium from dementia: Delirium = ACUTE onset, FLUCTUATING course, INATTENTION; Dementia = CHRONIC, PROGRESSIVE, INTACT attention (initially)",
      "Implement non-pharmacologic prevention and management: Reorient frequently (time, place, person), provide clock and calendar, ensure familiar objects at bedside",
      "Optimize sensory input: Ensure patient has glasses and hearing aids in place; minimize sensory overload (reduce noise, dim lights at night)",
      "Promote sleep-wake cycle: Minimize nighttime interruptions, reduce noise and light at night, avoid caffeine after noon, provide daytime activities and natural light exposure",
      "Assess for and treat underlying causes: Check for urinary retention (bladder scan), constipation, uncontrolled pain, infection, metabolic abnormalities",
      "Ensure patient safety: Fall precautions, 1:1 sitter if needed, maintain therapeutic environment, avoid restraints (last resort only), de-escalate agitation verbally before pharmacologic intervention"
    ],
    assessmentFindings: [
      "Acute onset (hours to days) with fluctuating course — symptoms come and go, often worse at night ('sundowning')",
      "Inattention: Inability to maintain focus, easily distracted, difficulty following conversation or commands",
      "Disorganized thinking: Incoherent speech, illogical flow of ideas, difficulty with simple tasks",
      "Altered level of consciousness: Ranging from hyperalert and agitated (hyperactive) to lethargic and withdrawn (hypoactive)",
      "Perceptual disturbances: Visual hallucinations (most common in delirium), illusions, paranoia",
      "Psychomotor changes: Agitation, restlessness, picking at bedding (hyperactive) OR lethargy, decreased movement, apathy (hypoactive — often MISSED)"
    ],
    signs: {
      left: ["Mild inattention with identifiable and reversible cause (UTI, medication)", "Delirium resolving within 24–48 hours of treating underlying cause", "Patient oriented with intermittent confusion that clears with reorientation", "Responding well to non-pharmacologic interventions"],
      right: ["Severe hyperactive delirium with agitation threatening patient and staff safety", "Hypoactive delirium missed for days resulting in delayed treatment of underlying cause", "Delirium with severe hallucinations and paranoia requiring 1:1 observation", "Delirium superimposed on dementia with persistent cognitive decline", "Alcohol withdrawal delirium (delirium tremens) with autonomic instability and seizure risk"]
    },
    medications: [
      { name: "Haloperidol (Haldol)", type: "First-generation (typical) antipsychotic — butyrophenone", action: "Blocks dopamine D2 receptors in the mesolimbic pathway, reducing psychotic symptoms (hallucinations, agitation, disorganized thinking) associated with delirium", sideEffects: "QTc prolongation (monitor ECG — risk of Torsades de Pointes), extrapyramidal symptoms (dystonia, akathisia, parkinsonism), neuroleptic malignant syndrome (rare), sedation, orthostatic hypotension", contra: "Parkinson disease or Lewy body dementia (severe extrapyramidal sensitivity), QTc > 500 ms, concurrent Class IA/III antiarrhythmics, torsades de pointes", pearl: "Used for severe delirium-related agitation when non-pharmacologic measures fail; low dose 0.5–1 mg IV/PO every 4–6 hours PRN; obtain baseline ECG and QTc before administration; monitor QTc — hold if > 500 ms; does NOT treat the underlying cause of delirium — always seek and treat the cause" }
    ],
    pearls: [
      "Delirium is an ACUTE MEDICAL EMERGENCY — it is NOT normal aging or 'confusion'; it always has an underlying cause that must be identified and treated",
      "Hypoactive delirium is the most common subtype (50%) and the most often MISSED because patients are quiet and withdrawn rather than agitated",
      "The CAM requires BOTH acute onset/fluctuation AND inattention PLUS either disorganized thinking OR altered LOC — inattention is the cardinal feature",
      "Benzodiazepines CAUSE delirium in most situations — they should be AVOIDED except for alcohol/benzodiazepine withdrawal delirium",
      "The mnemonic THINK for reversible causes: Toxic (medications), Hypoxia, Infection, Nonpharmacologic interventions needed, K+ or other electrolyte abnormalities",
      "Physical restraints worsen delirium — they increase agitation, decrease mobility, increase fall injuries, and are associated with increased mortality; use only as an absolute last resort after all other interventions have failed"
    ],
    quiz: [
      { question: "An 82-year-old patient with no history of cognitive impairment was oriented at admission yesterday but today is agitated, unable to follow conversation, and is picking at invisible objects. Using the CAM criteria, which features of delirium are present?", options: ["Chronic onset and progressive course", "Acute onset, fluctuating course, inattention, and disorganized thinking", "Chronic memory loss with intact attention", "Intact attention with depressed mood"], correct: 1, rationale: "This patient has CAM-positive delirium: (1) Acute onset (change from baseline yesterday), (2) Inattention (unable to follow conversation), (3) Disorganized thinking (picking at invisible objects). The nurse should immediately investigate underlying causes (infection, medications, metabolic disturbances)." },
      { question: "Which medication class should be AVOIDED in delirious patients because it worsens delirium?", options: ["Acetaminophen", "Benzodiazepines", "Antibiotics", "IV saline"], correct: 1, rationale: "Benzodiazepines worsen delirium in most situations by impairing cholinergic transmission and disrupting sleep architecture. They should be avoided EXCEPT for delirium caused by alcohol or benzodiazepine withdrawal. Non-pharmacologic interventions are first-line for delirium management." },
      { question: "The RN is caring for a post-operative elderly patient who is quiet, lying in bed, not engaging in conversation, and staring blankly at the ceiling. The nurse suspects which subtype of delirium?", options: ["Hyperactive delirium", "Hypoactive delirium", "Dementia", "Normal post-operative recovery"], correct: 1, rationale: "This presentation describes hypoactive delirium: lethargy, decreased alertness, apathy, and reduced psychomotor activity. This is the most common (50%) and most frequently MISSED subtype because patients do not exhibit the dramatic agitation of hyperactive delirium. The RN must screen with CAM and investigate causes." }
    ]
  },
  "developmental-milestones-assessment-rn": {
    title: "Developmental Milestones Assessment",
    cellular: { title: "Pathophysiology of Developmental Assessment", content: "Developmental milestone assessment evaluates a child's progress across four primary domains: gross motor, fine motor, language/communication, and social/adaptive. Child development follows predictable patterns governed by cephalocaudal (head-to-toe) and proximodistal (center-to-periphery) principles. Neurological maturation progresses from primitive reflexes (present at birth and expected to disappear at specific ages) to voluntary, purposeful movement as myelination of neural pathways proceeds. The first 3 years of life represent the most critical period for brain development, with synaptogenesis producing approximately 1 million new synaptic connections per second. Synaptic pruning (elimination of unused connections) occurs throughout childhood and adolescence, shaped by environmental stimulation and experience. Key milestones serve as benchmarks: head control by 2–4 months, rolling by 4–6 months, sitting independently by 6–8 months, crawling by 8–10 months, walking by 12–15 months. Language progresses from cooing (2–4 months) to babbling (6–9 months) to first words (10–14 months) to two-word phrases (18–24 months). Social milestones include social smile (6–8 weeks), stranger anxiety (6–9 months), and parallel play (2–3 years). Red flags for developmental delay include no social smile by 3 months, not babbling by 12 months, no words by 16 months, no two-word phrases by 24 months, loss of previously acquired skills at any age (regression — suggests neurodegenerative condition and requires urgent evaluation). The RN uses validated screening tools (ASQ-3, PEDS, M-CHAT for autism) at recommended intervals to identify delays early for intervention referral." },
    riskFactors: [
      "Prematurity (developmental milestones adjusted for gestational age until age 2)",
      "Low birth weight (< 2500 g) and very low birth weight (< 1500 g)",
      "Perinatal complications: hypoxic-ischemic encephalopathy, intraventricular hemorrhage, neonatal seizures",
      "Genetic conditions: Down syndrome, Fragile X, Turner syndrome, Prader-Willi syndrome",
      "Prenatal substance exposure: fetal alcohol spectrum disorder, prenatal drug exposure",
      "Lead exposure (blood lead level ≥ 5 mcg/dL is concerning)",
      "Chronic illness, malnutrition, iron deficiency anemia, psychosocial deprivation"
    ],
    diagnostics: [
      "Ages and Stages Questionnaire (ASQ-3): Parent-completed screening at 2, 4, 6, 9, 12, 18, 24, 30, 36 months",
      "Modified Checklist for Autism in Toddlers (M-CHAT-R): Autism-specific screening at 18 and 24 months",
      "Denver Developmental Screening Test (Denver II): Provider-administered screening across 4 domains",
      "Parents' Evaluation of Developmental Status (PEDS): Surveillance tool using parent concerns",
      "Blood lead level screening at 12 and 24 months (universal or targeted based on risk)",
      "Hearing and vision screening at recommended intervals",
      "Referral for formal developmental evaluation by developmental pediatrician if screening is abnormal"
    ],
    management: [
      "Early intervention (EI) services for children 0–3 years with developmental delays (federally mandated under IDEA Part C)",
      "Special education services for children 3–21 years through the school system (IDEA Part B)",
      "Speech-language therapy for communication delays",
      "Occupational therapy for fine motor and adaptive skill delays",
      "Physical therapy for gross motor delays",
      "Behavioral therapy (ABA — Applied Behavior Analysis) for autism spectrum disorder",
      "Parent education on age-appropriate activities, play-based learning, reading aloud, and stimulating environment"
    ],
    nursingActions: [
      "Administer developmental screening tools at recommended ages during well-child visits: ASQ-3 at specified intervals, M-CHAT at 18 and 24 months",
      "Perform developmental surveillance at EVERY encounter: observe child's behavior, motor skills, language, and social interaction; ask parents about milestone achievement",
      "Assess for red flags requiring immediate referral: loss of previously acquired skills (regression), no babbling by 12 months, no words by 16 months, no two-word phrases by 24 months, no social smile by 3 months",
      "Educate parents on expected developmental milestones for their child's age and how to promote development through play, reading, and interaction",
      "Adjust milestone expectations for premature infants: Use corrected (adjusted) age until 24 months — subtract weeks of prematurity from chronological age",
      "Refer promptly for early intervention services when delays are identified — earlier intervention leads to better outcomes",
      "Document screening results, referrals made, and follow-up plans in the medical record"
    ],
    assessmentFindings: [
      "2 months: Social smile, coos, lifts head during tummy time, follows objects with eyes",
      "4 months: Laughs, reaches for objects, holds head steady, rolls front to back",
      "6 months: Babbles (consonant sounds), sits with support, transfers objects hand to hand",
      "9 months: Stranger anxiety, pincer grasp developing, pulls to stand, says 'mama/dada' nonspecifically",
      "12 months: First words (1–3 words), walks with assistance, waves 'bye-bye', understands 'no'",
      "18 months: 10–20 words, walks independently, stacks 2–4 blocks, points to body parts",
      "24 months: Two-word phrases, runs, kicks ball, parallel play, knows 50+ words"
    ],
    signs: {
      left: ["Child meeting all milestones within expected timeframes", "Mild speech delay responding to speech therapy", "Premature infant tracking appropriately on corrected age milestones", "Parent engaged in developmental promotion activities"],
      right: ["Regression of previously acquired skills (loss of words, loss of social engagement) — suggests autism or neurodegenerative condition", "No words by 16 months and no social engagement", "Persistent primitive reflexes beyond expected age (Moro beyond 6 months, Babinski beyond 12–24 months)", "Global developmental delay across all domains with failure to thrive", "Lead level ≥ 45 mcg/dL with neurodevelopmental symptoms"]
    },
    medications: [
      { name: "Succimer (Chemet)", type: "Chelating agent", action: "Binds to lead in blood and soft tissues forming water-soluble chelate complexes that are excreted by the kidneys, reducing blood lead levels", sideEffects: "GI symptoms (nausea, vomiting, diarrhea), elevated liver enzymes, rash, neutropenia, sulfurous odor to urine and breath", contra: "Allergy to succimer, concurrent chelation with EDTA (unless under specialist guidance), severe hepatic or renal impairment", pearl: "Indicated for blood lead levels ≥ 45 mcg/dL in children; oral capsules can be opened and mixed with soft food; dose 10 mg/kg every 8 hours for 5 days then every 12 hours for 14 days; monitor CBC, liver function, and lead levels during treatment; identify and remove the lead source to prevent re-exposure" }
    ],
    pearls: [
      "LOSS OF PREVIOUSLY ACQUIRED SKILLS (developmental regression) at ANY age is a RED FLAG requiring urgent evaluation — possible etiologies include autism spectrum disorder, neurodegenerative conditions, and metabolic disorders",
      "Correct for prematurity when assessing milestones until 24 months of age — a 3-month premature infant at 9 months chronological age should be assessed at 6-month milestones",
      "The M-CHAT-R is specifically designed for autism screening at 18 and 24 months — it is not a general developmental screening tool",
      "Social smile by 6–8 weeks is one of the earliest developmental milestones; its absence by 3 months warrants investigation",
      "Early intervention (0–3 years) capitalizes on the period of greatest brain plasticity — earlier referral leads to significantly better outcomes",
      "The well-child visit is the primary opportunity for developmental screening — developmental surveillance should occur at EVERY encounter, with formal screening at recommended intervals"
    ],
    quiz: [
      { question: "An 18-month-old child's parent reports that the child used to say 'mama' and 'dada' at 12 months but has stopped speaking and no longer makes eye contact. What is the RN's priority action?", options: ["Reassure the parent that this is a normal developmental variation", "Refer urgently for developmental evaluation — loss of previously acquired skills is a red flag", "Recommend waiting until age 2 to see if the child catches up", "Administer the ASQ-3 and schedule a follow-up in 6 months"], correct: 1, rationale: "Loss of previously acquired language and social skills (regression) is a RED FLAG requiring urgent developmental evaluation. This pattern is concerning for autism spectrum disorder or a neurodegenerative condition. The 'wait and see' approach is inappropriate when regression is present." },
      { question: "When assessing developmental milestones in a 6-month-old infant born at 28 weeks gestation, which adjusted age should the RN use?", options: ["6 months (chronological age)", "3 months (corrected for 3 months of prematurity)", "9 months (add prematurity weeks)", "12 months"], correct: 1, rationale: "For premature infants, use corrected (adjusted) age until 24 months: chronological age minus weeks of prematurity. Born at 28 weeks = 12 weeks premature. At 6 months chronological age: 6 months − 3 months = 3 months corrected age. Assess milestones expected at 3 months." },
      { question: "Which developmental finding would be expected in a typically developing 12-month-old child?", options: ["Speaking in two-word phrases", "Walking independently with good balance", "Saying 1–3 words (mama, dada, one other word) and walking with assistance", "Toilet trained during the day"], correct: 2, rationale: "At 12 months, typical development includes 1–3 words, walking with hand-held or furniture support, waving bye-bye, and understanding simple commands like 'no.' Two-word phrases appear at ~24 months. Independent walking typically begins at 12–15 months. Toilet training occurs at 2–3 years." }
    ]
  },
  "rn-advanced-medication-calculations-rn": {
    title: "RN Advanced Medication Calculations",
    cellular: { title: "Principles of Advanced Medication Calculations", content: "Advanced medication calculations in nursing require mastery of dimensional analysis, weight-based dosing, IV drip rate calculations, reconstitution, and critical drug titrations. The RN must accurately calculate doses to prevent medication errors — the most common type of preventable adverse events in healthcare. Weight-based dosing (mg/kg or mcg/kg) is used for many critical medications including vasoactive infusions, antibiotics, anticoagulants, and pediatric medications. The formula for IV drip rate in mL/hr is: (Desired dose × Patient weight × 60 min/hr) ÷ Drug concentration. For drip rate in drops per minute (gtt/min): (Volume × Drop factor) ÷ Time in minutes. Concentration calculations involve determining the amount of drug per unit volume: a standard norepinephrine concentration is 4 mg in 250 mL (16 mcg/mL). Titration calculations require the RN to adjust infusion rates based on clinical parameters (e.g., titrate norepinephrine to MAP > 65 mmHg, increasing by 0.1 mcg/kg/min every 5 minutes). Pediatric calculations demand extra precision due to small margin of error: doses are calculated per kg and verified against maximum adult doses. The RN must perform independent double-checks for high-alert medications (insulin, heparin, vasoactive drips, opioids, chemotherapy). Unit conversions (g to mg, mg to mcg, L to mL, lb to kg) must be automatic. The six rights of medication administration (right patient, right drug, right dose, right route, right time, right documentation) are verified at each step. Smart pump technology with drug libraries reduces calculation errors but does not replace the nurse's ability to verify calculations independently." },
    riskFactors: [
      "Pediatric patients (weight-based dosing with small margin of error, decimal point errors have catastrophic consequences)",
      "High-alert medications: insulin, anticoagulants, opioids, vasoactive infusions, chemotherapy, neuromuscular blockers",
      "Complex titration orders requiring frequent rate adjustments",
      "Non-standard drug concentrations or compounded medications",
      "Nursing fatigue, high patient acuity, frequent interruptions during medication administration",
      "Inadequate knowledge of medication pharmacokinetics, dosing parameters, and maximum dose limits",
      "Unit conversion errors (mcg vs mg, mL vs L, kg vs lb)"
    ],
    diagnostics: [
      "Verify prescriber's order: Check dose, route, frequency, and indication against evidence-based references",
      "Calculate weight-based dose independently: Weight (kg) × Dose (mg/kg) = Total dose",
      "Verify dose falls within safe therapeutic range using drug reference",
      "Check renal and hepatic function for dose adjustments (creatinine clearance, liver function tests)",
      "Verify drug-drug interactions and allergies in the medication administration record",
      "Use barcode medication administration (BCMA) for patient and medication verification",
      "Confirm IV compatibility before mixing or co-infusing medications"
    ],
    management: [
      "Weight-based dosing formula: Patient weight (kg) × Ordered dose (mg/kg or mcg/kg) = Total dose",
      "IV rate calculation: Dose (mcg/min) × 60 min/hr ÷ Concentration (mcg/mL) = mL/hr",
      "Drip rate for gravity infusion: (Volume (mL) × Drop factor (gtt/mL)) ÷ Time (minutes) = gtt/min",
      "Heparin dosing: Weight-based protocol (typical: 80 units/kg bolus, 18 units/kg/hr infusion); adjust based on aPTT per protocol",
      "Insulin infusion: Continuous IV regular insulin per sliding scale protocol; convert to subcutaneous when patient eating (overlap IV and SQ by 1–2 hours)",
      "Vasoactive drip titration: Calculate mL/hr from mcg/kg/min order; titrate per protocol to hemodynamic goals",
      "Independent double-check: Required for all high-alert medications — second RN independently verifies patient, drug, dose, route, rate, and pump settings"
    ],
    nursingActions: [
      "Weigh the patient in KILOGRAMS (not pounds) at admission and verify weight before initiating weight-based medications",
      "Calculate all doses independently before administering — do not rely solely on pharmacy or smart pump calculations",
      "Perform independent double-check with second RN for ALL high-alert medications: verify right patient, right drug, right dose, right route, right rate",
      "Use smart pump drug library with dose limits and alerts; investigate and resolve all alerts before overriding",
      "For vasoactive infusions: Document rate changes, hemodynamic parameters, and patient response at each titration",
      "Convert pounds to kilograms accurately: weight (lb) ÷ 2.2 = weight (kg); use actual body weight unless protocol specifies ideal body weight",
      "Report and document all medication errors through the institution's safety reporting system; participate in root cause analysis"
    ],
    assessmentFindings: [
      "Signs of medication overdose: specific to drug class — opioid overdose (RR < 8, pinpoint pupils, sedation), insulin overdose (hypoglycemia: diaphoresis, tremor, confusion), heparin overdose (bleeding)",
      "Signs of sub-therapeutic dosing: inadequate pain control, persistent fever with antibiotic underdosing, uncontrolled blood glucose, hemodynamic instability despite vasoactive infusion",
      "Adverse drug reactions: anaphylaxis, rash, GI symptoms, renal/hepatic dysfunction from drug toxicity",
      "Smart pump alerts indicating dose outside safe range (requires investigation before overriding)",
      "Patient weight discrepancy between medical record and actual weight (can cause systematic dosing errors)"
    ],
    signs: {
      left: ["Calculated dose within normal therapeutic range verified by two RNs", "Patient responding appropriately to prescribed medication dose", "Smart pump programmed correctly with no alerts", "Stable vital signs and laboratory values within target range"],
      right: ["10-fold dose error (decimal point miscalculation) in pediatric medication", "Heparin overdose with active hemorrhage and critically elevated aPTT", "Insulin overdose with severe hypoglycemia (BG < 40 mg/dL) and loss of consciousness", "Vasoactive medication rate error causing severe hypertension or hypotension", "Wrong patient receiving wrong medication (identification failure)"]
    },
    medications: [
      { name: "Heparin (Unfractionated)", type: "Anticoagulant (indirect thrombin inhibitor)", action: "Potentiates antithrombin III activity, which inactivates thrombin (factor IIa) and factor Xa, preventing thrombus formation and propagation", sideEffects: "Bleeding (most common — monitor for signs at all sites), heparin-induced thrombocytopenia (HIT — platelet drop > 50% from baseline, typically days 5–10), hyperkalemia, osteoporosis (long-term use)", contra: "Active uncontrolled bleeding, HIT, severe thrombocytopenia, recent CNS surgery or hemorrhagic stroke", pearl: "Weight-based dosing: typical DVT/PE protocol — bolus 80 units/kg IV, infusion 18 units/kg/hr; monitor aPTT every 6 hours and adjust per protocol (target 1.5–2.5× control); monitor platelet count every other day for HIT; antidote: protamine sulfate (1 mg per 100 units heparin given in last 2–3 hours); HIGH-ALERT medication requiring independent double-check" }
    ],
    pearls: [
      "Always weigh patients in KILOGRAMS for medication calculations — a kg/lb confusion causes a 2.2× dosing error that can be lethal",
      "The most common medication calculation error is a 10-fold (decimal point) error — always double-check decimal placement, especially in pediatric doses",
      "Independent double-check for high-alert medications must be truly INDEPENDENT — each nurse calculates separately, then compares results; watching someone else calculate provides false security",
      "Smart pump drug libraries with hard limits are a safety net but do NOT replace the nurse's independent calculation and clinical judgment",
      "For vasoactive drip titrations: mcg/kg/min × weight (kg) × 60 min/hr ÷ concentration (mcg/mL) = mL/hr — memorize this formula for titrating norepinephrine, dopamine, and dobutamine",
      "When converting a heparin infusion from units/hr to mL/hr, always verify the concentration first: 25,000 units in 250 mL = 100 units/mL; 25,000 units in 500 mL = 50 units/mL"
    ],
    quiz: [
      { question: "A physician orders norepinephrine at 0.1 mcg/kg/min for a 70 kg patient. The concentration is 4 mg in 250 mL (16 mcg/mL). What rate should the nurse set on the pump?", options: ["3.5 mL/hr", "26.3 mL/hr", "7.0 mL/hr", "16.8 mL/hr"], correct: 1, rationale: "Step 1: 0.1 mcg/kg/min × 70 kg = 7 mcg/min. Step 2: 7 mcg/min × 60 min/hr = 420 mcg/hr. Step 3: 420 mcg/hr ÷ 16 mcg/mL = 26.25 mL/hr ≈ 26.3 mL/hr." },
      { question: "A child weighing 22 lb needs amoxicillin 25 mg/kg/day divided every 8 hours. The concentration is 250 mg/5 mL. How much should the nurse administer per dose?", options: ["1.67 mL", "3.33 mL", "5.0 mL", "10.0 mL"], correct: 1, rationale: "Step 1: 22 lb ÷ 2.2 = 10 kg. Step 2: 25 mg/kg/day × 10 kg = 250 mg/day. Step 3: 250 mg/day ÷ 3 doses = 83.3 mg per dose. Step 4: 83.3 mg × (5 mL / 250 mg) = 1.67 mL per dose." },
      { question: "A patient weighing 80 kg is on a heparin protocol. The order reads: bolus 80 units/kg IV, then infusion at 18 units/kg/hr. The heparin concentration is 25,000 units in 500 mL. What is the initial infusion rate in mL/hr?", options: ["14.4 mL/hr", "28.8 mL/hr", "36.0 mL/hr", "72.0 mL/hr"], correct: 1, rationale: "Step 1: 18 units/kg/hr × 80 kg = 1,440 units/hr. Step 2: Concentration = 25,000 units/500 mL = 50 units/mL. Step 3: 1,440 units/hr ÷ 50 units/mL = 28.8 mL/hr." }
    ]
  }
};
