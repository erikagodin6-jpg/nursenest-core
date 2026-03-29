import type { LessonContent } from "./types";

export const generatedBatch112Lessons: Record<string, LessonContent> = {
  "vaginal-hematoma-np": {
    title: "Vaginal Hematoma: Surgical Management & Embolization",
    cellular: {
      title: "Pathophysiology of Vaginal Hematoma",
      content: "Vaginal hematomas arise from disruption of blood vessels within the highly vascularized vaginal and paravaginal tissues, most commonly following vaginal delivery, episiotomy, or operative vaginal birth (forceps or vacuum-assisted). The rich arterial supply from branches of the internal iliac artery — specifically the vaginal artery, inferior vesical artery, and pudendal artery — creates a venous plexus that is vulnerable to shearing forces during delivery. Hematomas are classified by anatomical location: vulvar hematomas (below the pelvic diaphragm, most common), vaginal hematomas (within the paravaginal space extending into the ischiorectal fossa), and supralevator or retroperitoneal hematomas (above the levator ani, extending into the broad ligament — the most dangerous due to occult blood loss). The pathogenesis involves vascular injury with extravasation of blood into the loose connective tissue of the vaginal submucosa and paravaginal space. Tissue distensibility allows accumulation of significant blood volumes (500–1500 mL) before clinical detection, particularly in supralevator hematomas where the retroperitoneal space provides minimal tamponade effect. Hemostatic failure may result from obstetric coagulopathy (DIC from placental abruption, amniotic fluid embolism), pre-existing coagulation disorders (von Willebrand disease, factor deficiencies), or iatrogenic anticoagulation. The expanding hematoma compresses surrounding structures — the urethra, bladder, and rectum — producing acute urinary retention, tenesmus, and severe perineal or rectal pressure pain disproportionate to visible trauma. Hemodynamic instability occurs when blood loss exceeds compensatory mechanisms, manifesting as tachycardia, hypotension, and signs of hemorrhagic shock."
    },
    riskFactors: [
      "Operative vaginal delivery (forceps-assisted delivery increases risk 3–4 fold compared to spontaneous vaginal delivery)",
      "Episiotomy (mediolateral > midline), especially with extension into deep paravaginal tissue",
      "Primiparity with prolonged second stage of labor exceeding 2 hours",
      "Precipitous labor causing rapid descent and uncontrolled delivery",
      "Pre-existing coagulopathy (von Willebrand disease, thrombocytopenia, factor deficiencies)",
      "Anticoagulant therapy (heparin, LMWH) or severe preeclampsia with HELLP syndrome",
      "Vulvovaginal varicosities in pregnancy and macrosomic infant (birth weight > 4000 g)"
    ],
    diagnostics: [
      "Focused pelvic examination under adequate analgesia to identify hematoma size, location, and expansion rate",
      "Serial hemoglobin and hematocrit every 4–6 hours (acute drop > 2 g/dL suggests ongoing hemorrhage)",
      "Coagulation panel (PT, INR, aPTT, fibrinogen, D-dimer) to evaluate for consumptive coagulopathy",
      "Type and crossmatch with blood bank notification for potential massive transfusion protocol activation",
      "Pelvic ultrasound (bedside or formal) to characterize hematoma size and location when clinical exam is equivocal",
      "CT angiography of the pelvis for supralevator hematomas to identify active arterial extravasation and guide interventional radiology planning",
      "Urinary catheterization to assess for urethral compression and monitor urine output as a perfusion indicator"
    ],
    management: [
      "Small stable hematomas (< 5 cm, non-expanding): conservative management with ice packs, compression, analgesics, and serial monitoring",
      "Large or expanding hematomas (> 5 cm or hemodynamically significant): surgical exploration, evacuation of clot, ligation of bleeding vessels, and layered closure with absorbable suture",
      "Activate massive transfusion protocol if estimated blood loss exceeds 1500 mL or patient shows signs of Class III hemorrhagic shock",
      "Interventional radiology for selective arterial embolization when surgical hemostasis fails or for supralevator hematomas with CT-confirmed active extravasation",
      "Correct coagulopathy with cryoprecipitate (fibrinogen < 200 mg/dL), fresh frozen plasma, and platelet transfusion as indicated",
      "Foley catheter insertion for urinary retention secondary to urethral compression",
      "Broad-spectrum antibiotic prophylaxis (ampicillin-sulbactam or cefazolin + metronidazole) if surgical evacuation is performed to prevent abscess formation"
    ],
    nursingActions: [
      "Perform systematic postpartum assessment with focused perineal and vaginal inspection every 15 minutes in the first hour, then every 30 minutes for 2 hours",
      "Assess for disproportionate perineal pain unresponsive to standard analgesics — a hallmark presentation of vaginal hematoma",
      "Monitor vital signs for early hemorrhagic shock (tachycardia preceding hypotension) and trend hemoglobin serially",
      "Maintain two large-bore IV accesses (18-gauge or larger) and initiate crystalloid resuscitation while awaiting blood products",
      "Coordinate with obstetric surgeon and interventional radiology for timely escalation when conservative management fails",
      "Document hematoma size, characteristics, vital sign trends, fluid resuscitation volumes, and blood product administration",
      "Assess bladder function and insert Foley catheter if urinary retention develops from hematoma compression"
    ],
    assessmentFindings: [
      "Severe unilateral perineal, vaginal, or rectal pressure pain disproportionate to visible perineal trauma",
      "Palpable tense, fluctuant mass on vaginal or rectal examination",
      "Acute urinary retention from urethral or bladder neck compression",
      "Tachycardia with or without hypotension indicating concealed hemorrhage",
      "Perineal ecchymosis extending to the buttocks and medial thighs",
      "Difficulty sitting or ambulating due to perineal swelling and pain",
      "Signs of hemorrhagic shock: altered mental status, pallor, diaphoresis, delayed capillary refill"
    ],
    signs: {
      left: [
        "Small vulvar hematoma (< 5 cm) with stable vital signs and mild pain controlled with oral analgesics",
        "Localized perineal swelling without rapid expansion on serial assessments",
        "Hemoglobin stable on serial checks (decrease < 1 g/dL over 4 hours)",
        "Patient able to void spontaneously without urinary retention",
        "Pain managed with ice packs and oral NSAIDs or acetaminophen"
      ],
      right: [
        "Rapidly expanding hematoma with hemoglobin drop > 2 g/dL in 4 hours",
        "Supralevator hematoma with concealed retroperitoneal hemorrhage and hemodynamic instability",
        "Hemorrhagic shock (HR > 120, SBP < 90, altered consciousness) requiring massive transfusion",
        "Coagulopathy with fibrinogen < 150 mg/dL and clinical DIC",
        "Failed surgical hemostasis requiring emergent selective arterial embolization"
      ]
    },
    medications: [
      {
        name: "Tranexamic Acid (TXA)",
        type: "Antifibrinolytic",
        action: "Competitively inhibits plasminogen activation to plasmin, preventing fibrin clot degradation and reducing hemorrhage",
        sideEffects: "Nausea, vomiting, diarrhea, thromboembolic events (DVT, PE) at high doses, visual disturbances, seizures (rare, dose-related)",
        contra: "Active intravascular clotting (DIC with predominant thrombotic features), subarachnoid hemorrhage, severe renal impairment (dose adjustment required)",
        pearl: "Administer 1 g IV over 10 minutes within 3 hours of delivery for postpartum hemorrhage (WOMAN trial evidence); can repeat once; most effective when given early"
      },
      {
        name: "Oxytocin",
        type: "Uterotonic agent",
        action: "Stimulates uterine smooth muscle contraction via oxytocin receptors, promoting uterine involution and reducing blood loss from the placental site",
        sideEffects: "Water intoxication and hyponatremia at high doses (ADH-like effect), uterine hyperstimulation, hypotension with rapid IV bolus, nausea",
        contra: "Do not administer as rapid IV push (risk of severe hypotension and cardiac arrhythmia); caution in patients with cardiovascular disease",
        pearl: "Standard postpartum dose: 10–40 units in 1L crystalloid at 125–250 mL/hr; used concurrently with hematoma management to minimize ongoing uterine bleeding contribution"
      }
    ],
    pearls: [
      "The classic presentation of vaginal hematoma is severe perineal pain disproportionate to visible trauma — always perform a careful vaginal and rectal exam when postpartum pain is unexplained",
      "Supralevator hematomas are the most dangerous because they expand into the retroperitoneal space with minimal external signs; monitor for concealed hemorrhage with serial hemoglobin and vital signs",
      "CT angiography is the imaging modality of choice for suspected supralevator hematoma and can guide interventional radiology embolization",
      "Selective internal iliac artery embolization has a success rate exceeding 90% for obstetric hemorrhage refractory to surgical management",
      "Do not delay surgical exploration for large or expanding hematomas — waiting for spontaneous resolution risks hypovolemic shock and tissue necrosis",
      "Vaginal packing after evacuation should use a balloon catheter or gauze packing with systematic removal in 12–24 hours to prevent reaccumulation",
      "Risk of recurrence is highest in the first 24–48 hours postpartum; maintain close surveillance with frequent vital sign checks and perineal assessments"
    ],
    quiz: [
      {
        question: "A postpartum patient reports severe rectal pressure and perineal pain 2 hours after a forceps-assisted delivery. Vital signs show HR 118, BP 95/60. Examination reveals a tense 8 cm vaginal mass. What is the priority NP action?",
        options: [
          "Apply ice packs and administer oral ibuprofen for pain management",
          "Prepare for surgical evacuation, establish large-bore IV access, and activate massive transfusion protocol",
          "Order a pelvic CT scan and await results before intervening",
          "Reassure the patient and recheck in 2 hours"
        ],
        correct: 1,
        rationale: "A large (8 cm) vaginal hematoma with tachycardia and hypotension indicates hemorrhagic shock from concealed blood loss. Immediate priorities include surgical evacuation to achieve hemostasis, large-bore IV access for volume resuscitation, and massive transfusion protocol activation. Conservative management with ice and oral analgesics is inappropriate for hemodynamically significant hematomas."
      },
      {
        question: "A patient develops a supralevator hematoma that fails initial surgical exploration. CT angiography shows active extravasation from a branch of the internal iliac artery. What is the most appropriate next intervention?",
        options: [
          "Repeat surgical exploration with uterine artery ligation",
          "Selective arterial embolization by interventional radiology",
          "Apply vaginal packing and observe for 24 hours",
          "Administer recombinant factor VIIa and monitor conservatively"
        ],
        correct: 1,
        rationale: "Selective arterial embolization via interventional radiology is the standard of care for obstetric hemorrhage refractory to surgical management, with success rates exceeding 90%. Supralevator hematomas are difficult to access surgically, and embolization provides targeted hemostasis of the bleeding vessel identified on CT angiography."
      },
      {
        question: "Which risk factor most significantly increases the likelihood of vaginal hematoma following vaginal delivery?",
        options: [
          "Gestational diabetes mellitus",
          "Forceps-assisted delivery",
          "Epidural analgesia",
          "Premature rupture of membranes"
        ],
        correct: 1,
        rationale: "Forceps-assisted delivery increases the risk of vaginal hematoma 3–4 fold compared to spontaneous vaginal delivery due to the mechanical forces applied to the vaginal and paravaginal tissues, which can shear blood vessels and disrupt the venous plexus. While epidural analgesia may mask pain symptoms, it does not independently increase hematoma formation risk."
      }
    ]
  },

  "12-lead-ecg-advanced-interpretation-np-level-np": {
    title: "12-Lead ECG: Advanced Interpretation (NP Level)",
    cellular: {
      title: "Electrophysiology and Advanced ECG Interpretation",
      content: "Advanced 12-lead ECG interpretation requires understanding of cardiac electrophysiology at the cellular level. The cardiac action potential progresses through five phases: Phase 0 (rapid depolarization via fast sodium channels), Phase 1 (early repolarization via transient outward potassium currents), Phase 2 (plateau phase maintained by L-type calcium channel influx balanced by delayed rectifier potassium efflux), Phase 3 (rapid repolarization via inward rectifier potassium channels), and Phase 4 (resting membrane potential maintained at approximately -90 mV by the inward rectifier potassium current IK1). The ECG represents the summation of all cardiac cellular electrical activity projected onto the body surface. P waves reflect atrial depolarization (SA node conduction through Bachmann's bundle to the left atrium and internodal pathways). The PR interval (120–200 ms) represents atrioventricular conduction including AV nodal delay. The QRS complex (< 120 ms normally) reflects ventricular depolarization through the His-Purkinje system. ST segment analysis is critical: ST elevation indicates transmural myocardial injury (current of injury from intracellular potassium leak in ischemic cells), while ST depression indicates subendocardial ischemia. Reciprocal changes in contiguous lead groups confirm acute MI localization. T wave morphology reflects ventricular repolarization — hyperacute T waves (peaked, symmetric, broad-based) are the earliest ECG finding in STEMI, preceding ST elevation. QT interval prolongation (corrected QTc > 470 ms in women, > 450 ms in men) increases risk of torsades de pointes, a polymorphic ventricular tachycardia. The NP must systematically evaluate rate, rhythm, axis, intervals, ST-T wave changes, and QRS morphology to identify acute coronary syndromes, conduction abnormalities, chamber enlargement, electrolyte disturbances, and drug effects."
    },
    riskFactors: [
      "Acute coronary syndrome (STEMI, NSTEMI) requiring immediate ECG interpretation for reperfusion decision-making",
      "Pre-existing bundle branch block (LBBB or RBBB) complicating ST segment interpretation in suspected ACS",
      "Electrolyte abnormalities (hyperkalemia, hypokalemia, hypercalcemia, hypomagnesemia) causing characteristic ECG changes",
      "QT-prolonging medications (antiarrhythmics, fluoroquinolones, antipsychotics, methadone) increasing torsades de pointes risk",
      "Structural heart disease (LVH, RVH, dilated cardiomyopathy) altering baseline ECG morphology",
      "Pacemaker or ICD with ventricular-paced rhythm obscuring native conduction patterns",
      "Wolff-Parkinson-White syndrome with delta waves and short PR interval complicating arrhythmia management"
    ],
    diagnostics: [
      "Standard 12-lead ECG with systematic interpretation: rate, rhythm, axis, intervals (PR, QRS, QT/QTc), P wave morphology, QRS morphology, ST-T wave analysis",
      "Serial 12-lead ECGs every 15–30 minutes in suspected ACS to detect dynamic ST-T wave changes",
      "Right-sided ECG leads (V4R) when inferior STEMI is identified to evaluate for right ventricular infarction",
      "Posterior leads (V7–V9) when posterior MI is suspected (ST depression in V1–V3 with dominant R wave)",
      "Continuous telemetry monitoring for arrhythmia detection and ST segment trending",
      "Serum troponin I or T (high-sensitivity preferred) with serial measurements at 0, 3, and 6 hours for ACS rule-out",
      "Basic metabolic panel with calcium, magnesium, and phosphorus to correlate electrolyte abnormalities with ECG findings"
    ],
    management: [
      "Activate cardiac catheterization lab within 10 minutes of STEMI identification (door-to-balloon goal < 90 minutes)",
      "Administer aspirin 325 mg chewed, P2Y12 inhibitor (ticagrelor 180 mg or clopidogrel 600 mg), and unfractionated heparin for confirmed ACS",
      "Apply Sgarbossa criteria (≥ 3 points) or modified Sgarbossa criteria for STEMI diagnosis in the presence of LBBB or ventricular paced rhythm",
      "Discontinue QT-prolonging medications and correct electrolyte abnormalities when QTc exceeds 500 ms",
      "Treat hyperkalemia-related ECG changes (peaked T waves, widened QRS, sine wave) emergently with IV calcium gluconate, insulin-dextrose, and sodium bicarbonate",
      "Initiate antiarrhythmic therapy for sustained ventricular tachycardia (amiodarone 150 mg IV over 10 minutes) or synchronized cardioversion for hemodynamic instability",
      "Refer for electrophysiology study when Wolff-Parkinson-White with rapid atrial fibrillation or recurrent symptomatic arrhythmias are identified"
    ],
    nursingActions: [
      "Perform systematic 12-lead ECG interpretation using a standardized approach: rate, rhythm, axis, intervals, hypertrophy, ischemia/infarction pattern",
      "Identify STEMI criteria (≥ 1 mm ST elevation in 2 contiguous limb leads or ≥ 2 mm in precordial leads) and activate emergent reperfusion pathway",
      "Calculate corrected QT interval using Bazett formula (QTc = QT / √RR) and identify prolongation requiring intervention",
      "Compare current ECG to prior tracings to distinguish acute changes from chronic findings (old LBBB, LVH with strain pattern)",
      "Recognize ECG mimics of STEMI: early repolarization, LVH strain pattern, Brugada pattern, pericarditis (diffuse ST elevation with PR depression)",
      "Order right-sided and posterior leads when clinical scenario warrants (inferior STEMI, isolated posterior MI)",
      "Document ECG interpretation with clinical correlation and communicate critical findings to the care team immediately"
    ],
    assessmentFindings: [
      "ST elevation in contiguous lead groups indicating acute transmural myocardial injury with reciprocal ST depression",
      "Hyperacute T waves (tall, peaked, symmetric, broad-based) as the earliest sign of acute MI preceding ST elevation",
      "New-onset left bundle branch block in the setting of chest pain (treated as STEMI equivalent)",
      "Peaked T waves with shortened QT, widened QRS, and sine wave pattern indicating progressive hyperkalemia",
      "Prolonged QTc > 500 ms with U waves suggesting risk for torsades de pointes",
      "Delta waves with short PR interval (< 120 ms) indicating ventricular pre-excitation (WPW syndrome)",
      "Diffuse ST elevation with PR segment depression in multiple lead groups suggesting acute pericarditis"
    ],
    signs: {
      left: [
        "Sinus bradycardia (HR 50–60) in an asymptomatic athlete without hemodynamic compromise",
        "Isolated T wave flattening in lateral leads without chest pain or troponin elevation",
        "First-degree AV block (PR > 200 ms) without symptoms or progression",
        "Nonspecific ST-T wave changes in the setting of LVH strain pattern",
        "Premature ventricular contractions (PVCs) < 10% burden on telemetry without symptoms"
      ],
      right: [
        "Acute anterior STEMI with ST elevation in V1–V4 and reciprocal inferior ST depression",
        "Third-degree (complete) heart block with wide QRS escape rhythm and hemodynamic instability",
        "Torsades de pointes on telemetry with QTc > 550 ms",
        "Massive hyperkalemia with sine wave pattern progressing toward asystole",
        "Ventricular fibrillation requiring immediate defibrillation"
      ]
    },
    medications: [
      {
        name: "Amiodarone",
        type: "Class III antiarrhythmic (multichannel blocker)",
        action: "Blocks potassium channels (prolonging repolarization and refractory period), sodium channels, calcium channels, and beta-adrenergic receptors — broad-spectrum antiarrhythmic effect",
        sideEffects: "Pulmonary toxicity (pneumonitis/fibrosis), thyroid dysfunction (hypo- or hyperthyroidism from iodine content), hepatotoxicity, corneal microdeposits, photosensitivity, peripheral neuropathy",
        contra: "Severe sinus node dysfunction without pacemaker, second/third-degree AV block, cardiogenic shock, iodine hypersensitivity, baseline QTc > 500 ms",
        pearl: "IV loading: 150 mg over 10 min for VT/VF; requires baseline and serial monitoring of TFTs, LFTs, PFTs, and ophthalmologic exam; half-life 40–55 days complicates dose adjustments"
      },
      {
        name: "Calcium Gluconate 10%",
        type: "Cardiac membrane stabilizer",
        action: "Raises the threshold potential of cardiac myocytes, stabilizing the cell membrane against hyperkalemia-induced depolarization without lowering serum potassium",
        sideEffects: "Bradycardia with rapid administration, hypercalcemia, tissue necrosis with extravasation, nausea",
        contra: "Digoxin toxicity (calcium potentiates digitalis effect and may precipitate fatal arrhythmias); hypercalcemia",
        pearl: "First-line emergent treatment for hyperkalemia with ECG changes; administer 10 mL of 10% solution IV over 2–3 minutes; effect within 1–3 minutes, duration 30–60 minutes; must follow with potassium-lowering therapies"
      }
    ],
    pearls: [
      "Use a systematic approach to every ECG: rate → rhythm → axis → intervals (PR, QRS, QTc) → P wave → QRS morphology → ST-T wave → overall impression with clinical correlation",
      "Sgarbossa criteria for STEMI in LBBB: concordant ST elevation ≥ 1 mm (5 points), concordant ST depression ≥ 1 mm in V1–V3 (3 points), discordant ST elevation ≥ 5 mm (2 points); ≥ 3 points = STEMI",
      "Always obtain V4R in inferior STEMI — RV infarction is present in 30–50% of inferior MIs and contraindicates nitrates and aggressive diuresis",
      "Hyperacute T waves are the earliest ECG finding in STEMI and may be present before ST elevation develops — serial ECGs are essential",
      "QTc > 500 ms is the threshold for significant torsades de pointes risk — review all medications and correct magnesium and potassium immediately",
      "Wellens syndrome (biphasic or deeply inverted T waves in V2–V3 in pain-free intervals) indicates critical LAD stenosis requiring urgent catheterization, not stress testing",
      "De Winter T waves (upsloping ST depression with tall symmetric T waves in precordial leads) are a STEMI equivalent indicating proximal LAD occlusion"
    ],
    quiz: [
      {
        question: "A patient presents with chest pain and an ECG showing ST elevation in leads II, III, and aVF with reciprocal ST depression in I and aVL. Which additional leads should the NP order?",
        options: [
          "Repeat standard 12-lead in 24 hours",
          "Right-sided leads (V4R) and posterior leads (V7–V9)",
          "Left lateral leads only (V5–V6)",
          "No additional leads are needed"
        ],
        correct: 1,
        rationale: "Inferior STEMI (ST elevation in II, III, aVF) requires right-sided leads (V4R) to evaluate for right ventricular infarction (present in 30–50% of inferior MIs) and posterior leads (V7–V9) to evaluate for concurrent posterior infarction. RV infarction changes management significantly — nitrates and aggressive diuresis are contraindicated."
      },
      {
        question: "A patient on methadone and haloperidol has a QTc of 540 ms and episodes of presyncope. What is the priority NP intervention?",
        options: [
          "Continue current medications and monitor with telemetry",
          "Discontinue QT-prolonging medications, administer IV magnesium sulfate 2 g, and correct potassium to > 4.0 mEq/L",
          "Start amiodarone for rhythm control",
          "Order an echocardiogram before making medication changes"
        ],
        correct: 1,
        rationale: "QTc > 500 ms with presyncope indicates significant risk for torsades de pointes. Priority actions include discontinuing all QT-prolonging medications (methadone and haloperidol), administering IV magnesium sulfate (stabilizes cardiac membrane and reduces TdP risk), and correcting potassium to > 4.0 mEq/L. Adding amiodarone would further prolong the QT interval."
      },
      {
        question: "An ECG in a patient with new LBBB and acute chest pain shows concordant ST elevation of 2 mm in leads V4–V5. Using Sgarbossa criteria, what does this finding indicate?",
        options: [
          "Normal finding in the setting of LBBB — no further workup needed",
          "STEMI equivalent requiring emergent cardiac catheterization activation",
          "Benign early repolarization pattern",
          "Artifact requiring repeat ECG"
        ],
        correct: 1,
        rationale: "Concordant ST elevation ≥ 1 mm in LBBB scores 5 points on the Sgarbossa criteria (≥ 3 points = STEMI). Concordant ST elevation means ST elevation in the same direction as the QRS complex, which is always abnormal in LBBB and indicates acute transmural injury requiring emergent reperfusion therapy."
      }
    ]
  },

  "asthma-pathophysiology-np-level-np": {
    title: "Asthma Pathophysiology - NP Level",
    cellular: {
      title: "Advanced Asthma Pathophysiology",
      content: "Asthma is a chronic inflammatory airway disease characterized by reversible airflow obstruction, bronchial hyperresponsiveness, and airway remodeling. At the cellular level, the pathogenesis involves a complex interplay between innate and adaptive immune responses. In allergic (Type 2-high) asthma, inhaled allergens are processed by dendritic cells, which present antigens to naive T helper cells, driving Th2 polarization. Th2 cells secrete signature cytokines: IL-4 (promotes IgE class switching in B cells), IL-5 (recruits and activates eosinophils via the IL-5 receptor), and IL-13 (induces goblet cell metaplasia, mucus hypersecretion, and smooth muscle hypercontractility). IgE binds high-affinity FcεRI receptors on mast cells; upon re-exposure, allergen cross-linking of IgE triggers mast cell degranulation releasing preformed mediators (histamine, tryptase, prostaglandin D2) and newly synthesized lipid mediators (leukotrienes C4/D4/E4 — potent bronchoconstrictors 1000x more potent than histamine). The late-phase response (4–8 hours post-exposure) involves eosinophil infiltration with release of major basic protein (MBP) and eosinophil cationic protein (ECP), causing epithelial damage and sustained inflammation. Airway remodeling — subepithelial fibrosis from myofibroblast collagen deposition, smooth muscle hypertrophy/hyperplasia, angiogenesis, and goblet cell hyperplasia — leads to progressive fixed airflow obstruction. Non-Type 2 asthma involves neutrophilic inflammation driven by Th17 cells (IL-17), often associated with obesity, smoking, and corticosteroid resistance. The NP must understand these endotypes to guide targeted biologic therapy selection: anti-IgE (omalizumab), anti-IL-5/IL-5R (mepolizumab, benralizumab), and anti-IL-4Rα (dupilumab)."
    },
    riskFactors: [
      "Atopic triad (asthma, allergic rhinitis, eczema) with elevated serum total IgE and positive allergen-specific IgE testing",
      "Family history of asthma in first-degree relatives (heritability estimated at 60–70%)",
      "Environmental allergen sensitization (dust mites, cockroach, mold, pet dander) with ongoing exposure",
      "Occupational exposures (isocyanates, flour dust, wood dust, latex) causing occupational asthma",
      "Tobacco smoke exposure (active or secondhand) accelerating airway inflammation and corticosteroid resistance",
      "Obesity (BMI > 30) associated with non-Type 2 neutrophilic asthma phenotype and reduced corticosteroid responsiveness",
      "Viral respiratory infections in early childhood (RSV, rhinovirus) associated with asthma development via epithelial barrier disruption"
    ],
    diagnostics: [
      "Spirometry with bronchodilator reversibility testing (≥ 12% and ≥ 200 mL increase in FEV1 post-bronchodilator confirms reversible obstruction)",
      "Fractional exhaled nitric oxide (FeNO) measurement (≥ 25 ppb in adults indicates eosinophilic airway inflammation and steroid responsiveness)",
      "Complete blood count with differential (peripheral eosinophilia ≥ 300 cells/μL supports Type 2-high endotype)",
      "Serum total IgE level (elevated supports allergic phenotype; required for omalizumab dosing calculation)",
      "Allergen-specific IgE testing or skin prick testing to identify sensitization triggers",
      "Methacholine challenge test for diagnosis when spirometry is normal but asthma is clinically suspected (PC20 < 4 mg/mL is positive)",
      "Peak expiratory flow (PEF) variability monitoring (> 20% diurnal variation over 2 weeks supports asthma diagnosis)"
    ],
    management: [
      "Stepwise pharmacotherapy per GINA guidelines: Step 1-2 (low-dose ICS-formoterol PRN); Step 3 (low-dose ICS-LABA maintenance); Step 4 (medium-dose ICS-LABA); Step 5 (high-dose ICS-LABA + add-on biologic)",
      "Prescribe ICS-formoterol as maintenance and reliever therapy (MART strategy) to reduce severe exacerbation risk versus SABA-only rescue",
      "Initiate biologic therapy for severe uncontrolled asthma: omalizumab (allergic, IgE-mediated), mepolizumab/benralizumab (eosinophilic, IL-5 pathway), dupilumab (eosinophilic and/or elevated FeNO)",
      "Develop individualized written asthma action plan with green (well-controlled), yellow (worsening), and red (emergency) zones",
      "Assess and address modifiable factors: inhaler technique (most patients use incorrectly), medication adherence, allergen avoidance, smoking cessation",
      "Prescribe short-course oral corticosteroids (prednisone 40–50 mg daily for 5–7 days) for acute exacerbations without taper for courses ≤ 7 days",
      "Refer to allergist/immunologist for allergen immunotherapy consideration and pulmonologist for bronchial thermoplasty evaluation in refractory cases"
    ],
    nursingActions: [
      "Classify asthma severity (intermittent, mild persistent, moderate persistent, severe persistent) and control level (well-controlled, not well-controlled, very poorly controlled) using GINA/NAEPP criteria",
      "Assess and correct inhaler technique at every visit — demonstrate proper use of MDI with spacer, DPI, and soft mist inhaler devices",
      "Order and interpret spirometry with bronchodilator response to confirm diagnosis and monitor treatment response over time",
      "Prescribe controller medications based on stepwise approach and step up or down therapy based on symptom control and exacerbation history",
      "Evaluate for biologic therapy eligibility by phenotyping: obtain blood eosinophil count, serum IgE, and FeNO before initiating biologics",
      "Screen for comorbidities that worsen asthma control: GERD, allergic rhinitis, obesity, obstructive sleep apnea, vocal cord dysfunction",
      "Provide smoking cessation counseling and prescribe pharmacotherapy (varenicline or NRT) for patients who smoke, as smoking reduces ICS efficacy"
    ],
    assessmentFindings: [
      "Expiratory wheezing (polyphonic, diffuse) that worsens with exertion, allergen exposure, or cold air",
      "Prolonged expiratory phase with use of accessory muscles (sternocleidomastoid, intercostals) during exacerbation",
      "Reduced FEV1/FVC ratio (< 0.70) on spirometry with significant bronchodilator reversibility",
      "Elevated FeNO (≥ 25 ppb) indicating eosinophilic airway inflammation",
      "Nocturnal cough and early morning chest tightness (diurnal variation in airway caliber)",
      "Silent chest (absence of wheezing) in severe exacerbation indicating critically reduced airflow — an ominous sign",
      "Pulsus paradoxus > 12 mmHg during severe exacerbation reflecting large intrathoracic pressure swings"
    ],
    signs: {
      left: [
        "Mild intermittent wheezing with normal oxygen saturation and peak flow > 80% personal best",
        "Well-controlled asthma on low-dose ICS with rescue inhaler use < 2 times/week",
        "FEV1 > 80% predicted with positive bronchodilator response",
        "Mild exercise-induced symptoms controlled with pre-exercise SABA or ICS-formoterol",
        "Stable symptom control with current step therapy and no recent exacerbations"
      ],
      right: [
        "Status asthmaticus: severe bronchospasm unresponsive to initial bronchodilator therapy with SpO2 < 90%",
        "Silent chest with impending respiratory failure requiring intubation and mechanical ventilation",
        "Respiratory acidosis (pH < 7.30, PaCO2 > 50 mmHg) on arterial blood gas during exacerbation",
        "Near-fatal asthma episode with loss of consciousness or ICU admission history",
        "Frequent exacerbations (≥ 2 requiring oral corticosteroids in 12 months) despite high-dose ICS-LABA therapy"
      ]
    },
    medications: [
      {
        name: "Budesonide-Formoterol (Symbicort)",
        type: "ICS-LABA combination (maintenance and reliever therapy)",
        action: "Budesonide suppresses airway inflammation by inhibiting NF-κB transcription of pro-inflammatory cytokines; formoterol provides rapid-onset and long-acting β2-agonist bronchodilation via cAMP-mediated smooth muscle relaxation",
        sideEffects: "Oral candidiasis, dysphonia, adrenal suppression at high doses (budesonide); tachycardia, tremor, hypokalemia (formoterol)",
        contra: "Monotherapy with LABA without ICS (black box warning — increased asthma mortality); severe milk protein allergy (DPI formulation contains lactose)",
        pearl: "FDA-approved for MART (maintenance and reliever therapy) strategy in moderate-severe asthma; single inhaler for both maintenance and rescue reduces exacerbation risk by 30% compared to fixed-dose ICS-LABA plus SABA rescue"
      },
      {
        name: "Dupilumab (Dupixent)",
        type: "Anti-IL-4 receptor alpha monoclonal antibody (biologic)",
        action: "Blocks IL-4 and IL-13 signaling by binding the shared IL-4Rα subunit, inhibiting Type 2 inflammation, reducing eosinophil recruitment, IgE production, mucus hypersecretion, and airway remodeling",
        sideEffects: "Injection site reactions, conjunctivitis (especially in atopic dermatitis patients), eosinophilia (transient), arthralgia",
        contra: "Hypersensitivity to dupilumab; do not use for acute bronchospasm or status asthmaticus; helminth infections should be treated before initiation",
        pearl: "Effective for both eosinophilic and Type 2-high phenotypes (elevated FeNO); unique advantage in patients with concurrent atopic dermatitis and nasal polyposis; reduces oral corticosteroid dependence by 70% in severe asthma"
      }
    ],
    pearls: [
      "Asthma endotyping is essential for biologic selection: Type 2-high (eosinophilic, high FeNO, high IgE) responds to biologics; non-Type 2 (neutrophilic, normal FeNO) requires alternative approaches",
      "FeNO ≥ 25 ppb predicts corticosteroid responsiveness and identifies patients likely to benefit from anti-IL-4/IL-13 therapy (dupilumab)",
      "MART (maintenance and reliever therapy) with ICS-formoterol is now recommended by GINA as the preferred approach for Steps 1–5, replacing SABA-only rescue",
      "A silent chest during an asthma exacerbation is an ominous sign indicating critically reduced airflow — absence of wheezing does not mean improvement",
      "Blood eosinophils ≥ 300 cells/μL strongly predict response to anti-IL-5 biologics (mepolizumab, benralizumab) in severe eosinophilic asthma",
      "Spirometry should be performed at diagnosis, 3–6 months after initiating treatment, and periodically thereafter to monitor airway remodeling progression",
      "Incorrect inhaler technique is the most common cause of apparent treatment failure — assess technique before escalating therapy"
    ],
    quiz: [
      {
        question: "A patient with severe asthma has blood eosinophils of 450 cells/μL, FeNO of 55 ppb, and serum IgE of 850 IU/mL. They continue to exacerbate on high-dose ICS-LABA. Which biologic is the most appropriate first-line addition?",
        options: [
          "Omalizumab (anti-IgE)",
          "Mepolizumab (anti-IL-5)",
          "Dupilumab (anti-IL-4Rα)",
          "Benralizumab (anti-IL-5 receptor)"
        ],
        correct: 2,
        rationale: "Dupilumab (anti-IL-4Rα) blocks both IL-4 and IL-13 signaling and is effective for patients with elevated eosinophils and/or elevated FeNO. In this patient with elevated eosinophils, high FeNO, and high IgE, dupilumab addresses the broadest range of Type 2 inflammatory pathways. While omalizumab and mepolizumab are also options, dupilumab provides the most comprehensive Type 2 suppression."
      },
      {
        question: "During an acute asthma exacerbation, a patient's wheezing suddenly disappears and they become drowsy with SpO2 85%. ABG shows pH 7.28, PaCO2 58 mmHg. What does this clinical picture indicate?",
        options: [
          "Improvement in bronchospasm with resolution of wheezing",
          "Impending respiratory failure with inadequate airflow to generate wheezing — prepare for intubation",
          "Anxiety-related hyperventilation requiring reassurance",
          "Pneumothorax requiring chest tube insertion"
        ],
        correct: 1,
        rationale: "A silent chest (loss of wheezing) with drowsiness, hypoxemia, and hypercapnic respiratory acidosis indicates critically reduced airflow and impending respiratory failure. The absence of wheezing in this context is ominous — not a sign of improvement. Immediate preparation for endotracheal intubation and mechanical ventilation is required."
      },
      {
        question: "What is the most common reason for apparent treatment failure in a patient prescribed an ICS for asthma control?",
        options: [
          "Corticosteroid resistance at the cellular level",
          "Incorrect inhaler technique leading to inadequate drug delivery",
          "Development of anti-drug antibodies to the ICS",
          "Tachyphylaxis from chronic ICS use"
        ],
        correct: 1,
        rationale: "Incorrect inhaler technique is the most common cause of apparent ICS treatment failure. Studies show that up to 70–80% of patients use their inhalers incorrectly, resulting in inadequate drug delivery to the lower airways. The NP should assess and demonstrate proper technique at every visit before escalating therapy."
      }
    ]
  },

  "copd-pathophysiology-np-level-np": {
    title: "COPD Pathophysiology - NP Level",
    cellular: {
      title: "Advanced COPD Pathophysiology",
      content: "Chronic obstructive pulmonary disease (COPD) is characterized by persistent airflow limitation that is not fully reversible, resulting from chronic inflammatory responses to noxious particles and gases, predominantly cigarette smoke. At the cellular level, COPD pathogenesis involves two interconnected processes: small airway disease (obstructive bronchiolitis) and parenchymal destruction (emphysema). Cigarette smoke activates alveolar macrophages and epithelial cells, releasing chemotactic factors (IL-8, LTB4, TNF-α) that recruit neutrophils and CD8+ cytotoxic T lymphocytes. Neutrophil-derived serine proteases (neutrophil elastase, proteinase 3, cathepsin G) and matrix metalloproteinases (MMP-9, MMP-12) degrade elastin and collagen in the alveolar walls, overwhelming antiprotease defenses (α1-antitrypsin, tissue inhibitors of metalloproteinases). This protease-antiprotease imbalance is the central mechanism of emphysematous destruction. Oxidative stress from cigarette smoke and activated inflammatory cells generates reactive oxygen species that inactivate α1-antitrypsin (methionine oxidation), impair mucociliary clearance, and activate NF-κB pro-inflammatory signaling. In the small airways, chronic inflammation causes goblet cell metaplasia, mucus hypersecretion, peribronchiolar fibrosis, and smooth muscle hypertrophy, leading to progressive narrowing. Emphysema destroys alveolar attachments (tethering) that normally hold small airways open during expiration, contributing to dynamic airway collapse and air trapping. The resulting hyperinflation increases the work of breathing and causes diaphragmatic flattening, reducing its mechanical efficiency. Pulmonary vascular remodeling from chronic hypoxia (hypoxic pulmonary vasoconstriction becoming fixed) leads to pulmonary hypertension and cor pulmonale. The GOLD classification stratifies severity using post-bronchodilator FEV1 and symptom burden (mMRC dyspnea scale, CAT score) to guide pharmacotherapy."
    },
    riskFactors: [
      "Cigarette smoking (≥ 20 pack-year history) — accounts for 80–90% of COPD cases in developed countries",
      "Alpha-1 antitrypsin deficiency (genetic — PiZZ phenotype with serum AAT < 11 μmol/L), causing panlobular emphysema in young non-smokers",
      "Occupational exposure to dusts, chemicals, and fumes (coal mining, grain handling, cadmium exposure)",
      "Indoor biomass fuel exposure (wood, crop residue, dung) for cooking and heating in developing countries",
      "Childhood respiratory infections and impaired lung growth leading to reduced maximum attained FEV1",
      "Chronic asthma with airway remodeling (asthma-COPD overlap syndrome)",
      "Aging (progressive decline in FEV1 of approximately 25–30 mL/year accelerated to 50–60 mL/year in susceptible smokers)"
    ],
    diagnostics: [
      "Post-bronchodilator spirometry confirming persistent airflow limitation: FEV1/FVC ratio < 0.70 (GOLD criterion)",
      "GOLD severity classification by post-bronchodilator FEV1: GOLD 1 (≥ 80%), GOLD 2 (50–79%), GOLD 3 (30–49%), GOLD 4 (< 30%)",
      "ABG analysis in GOLD 3–4: assess for chronic respiratory acidosis (compensated hypercapnia) and calculate A-a gradient",
      "Alpha-1 antitrypsin serum level in all patients diagnosed with COPD under age 45 or with family history (WHO recommendation)",
      "Chest CT (high-resolution) to characterize emphysema distribution (centrilobular vs panlobular vs paraseptal) and evaluate for bronchiectasis",
      "6-minute walk test to assess functional exercise capacity and oxygen desaturation (SpO2 < 88% qualifies for supplemental O2)",
      "Echocardiography to evaluate for pulmonary hypertension and right ventricular dysfunction in patients with severe COPD"
    ],
    management: [
      "Smoking cessation (most important intervention to slow FEV1 decline): prescribe pharmacotherapy (varenicline, combination NRT, or bupropion) with behavioral counseling",
      "Stepwise inhaler therapy per GOLD ABE groups: Group A (bronchodilator PRN); Group B (LAMA or LABA maintenance); Group E (LAMA + LABA ± ICS if eosinophils ≥ 300)",
      "Prescribe long-term supplemental oxygen (≥ 15 hours/day) for PaO2 ≤ 55 mmHg or SpO2 ≤ 88% at rest (improves survival in LOTT/NOTT trials)",
      "Initiate pulmonary rehabilitation (minimum 6-week program) for all symptomatic patients GOLD B and E — improves exercise tolerance, dyspnea, and quality of life",
      "Prescribe azithromycin 250 mg daily for exacerbation-prone patients (reduces exacerbation frequency by 30%) — monitor QTc and hearing",
      "Administer annual influenza vaccine, pneumococcal vaccine (PCV20 or PCV15 + PPSV23), COVID-19 vaccine, and Tdap to reduce infection-related exacerbations",
      "Evaluate for lung volume reduction surgery or bronchoscopic valve placement in select patients with upper-lobe-predominant emphysema and low exercise capacity"
    ],
    nursingActions: [
      "Classify COPD using GOLD ABE assessment: combine spirometric severity (FEV1), symptom burden (mMRC/CAT), and exacerbation history to guide therapy",
      "Prescribe and titrate inhaler therapy based on GOLD group classification and escalate to triple therapy (LAMA + LABA + ICS) when eosinophils ≥ 300 and exacerbations persist",
      "Assess inhaler technique at every visit and select device type based on patient inspiratory flow capacity (DPI requires adequate inspiratory effort; consider nebulizer for severe disease)",
      "Order alpha-1 antitrypsin level for all COPD patients under 45 or those with lower-lobe-predominant emphysema or family clustering",
      "Manage acute exacerbations with short-course systemic corticosteroids (prednisone 40 mg × 5 days), antibiotics if purulent sputum is present, and bronchodilator intensification",
      "Coordinate pulmonary rehabilitation referral and ensure program completion — demonstrate to patients that benefits include reduced hospitalizations and improved functional status",
      "Monitor for and manage comorbidities that worsen outcomes: cardiovascular disease, osteoporosis (chronic steroid use), depression, lung cancer screening (annual low-dose CT if criteria met)"
    ],
    assessmentFindings: [
      "Progressive exertional dyspnea with reduced exercise tolerance (mMRC ≥ 2 indicates significant limitation)",
      "Barrel chest (increased AP diameter) from chronic hyperinflation with reduced diaphragmatic excursion",
      "Prolonged expiratory phase with pursed-lip breathing (auto-PEEP generation to prevent small airway collapse)",
      "Diminished breath sounds with scattered expiratory wheezes and rhonchi",
      "Digital clubbing — uncommon in simple COPD; if present, evaluate for lung cancer or bronchiectasis",
      "Signs of cor pulmonale: JVD, peripheral edema, hepatomegaly, loud P2 (indicating pulmonary hypertension)",
      "Cachexia and muscle wasting in advanced COPD (systemic inflammatory effects and increased work of breathing)"
    ],
    signs: {
      left: [
        "GOLD 1–2 COPD with mild dyspnea on exertion and FEV1 > 50% predicted",
        "Stable COPD maintained on LAMA monotherapy with CAT score < 10",
        "SpO2 ≥ 92% on room air at rest with no desaturation on 6-minute walk test",
        "Fewer than 1 moderate exacerbation per year requiring oral corticosteroids",
        "Productive cough without purulent sputum and stable exercise tolerance"
      ],
      right: [
        "Acute COPD exacerbation with respiratory acidosis (pH < 7.30, PaCO2 > 60 mmHg) requiring NIV",
        "GOLD 4 COPD (FEV1 < 30%) with resting hypoxemia and hypercapnia on home oxygen",
        "Cor pulmonale with progressive right heart failure (rising BNP, worsening peripheral edema)",
        "Frequent exacerbations (≥ 3 per year) despite maximized triple therapy and azithromycin prophylaxis",
        "Acute exacerbation with pneumonia requiring ICU admission and mechanical ventilation"
      ]
    },
    medications: [
      {
        name: "Tiotropium (Spiriva)",
        type: "Long-acting muscarinic antagonist (LAMA)",
        action: "Competitively blocks M3 muscarinic receptors on airway smooth muscle, producing sustained bronchodilation (24-hour duration); reduces mucus secretion and prevents acetylcholine-mediated bronchoconstriction",
        sideEffects: "Dry mouth, urinary retention (caution in BPH), constipation, blurred vision if powder contacts eyes, paradoxical bronchospasm (rare)",
        contra: "Severe hypersensitivity to tiotropium or ipratropium; narrow-angle glaucoma (avoid HandiHaler powder near eyes); severe renal impairment (Respimat dose adjustment)",
        pearl: "First-line maintenance bronchodilator for COPD across all GOLD groups; UPLIFT trial showed reduced exacerbations and improved quality of life; once-daily dosing enhances adherence"
      },
      {
        name: "Roflumilast (Daliresp)",
        type: "Phosphodiesterase-4 (PDE4) inhibitor",
        action: "Selectively inhibits PDE4, increasing intracellular cAMP in inflammatory cells (neutrophils, macrophages), reducing release of TNF-α, IL-8, and neutrophil elastase — targets the inflammatory component of COPD",
        sideEffects: "Diarrhea (most common, often dose-limiting), nausea, weight loss (5–10%), headache, insomnia, depression and suicidal ideation (monitor psychiatric symptoms)",
        contra: "Moderate-to-severe hepatic impairment (Child-Pugh B or C); concurrent use with strong CYP3A4 inhibitors; active depression or suicidal ideation",
        pearl: "Add-on therapy for severe COPD (FEV1 < 50%) with chronic bronchitis phenotype and frequent exacerbations despite maximal inhaler therapy; monitor weight and psychiatric status; not a bronchodilator — anti-inflammatory mechanism"
      }
    ],
    pearls: [
      "Smoking cessation is the only intervention proven to slow the accelerated decline in FEV1 in COPD — it should be addressed at every encounter with pharmacotherapy offered",
      "Alpha-1 antitrypsin deficiency should be tested in every COPD patient under 45 and in those with lower-lobe-predominant panlobular emphysema — it is the most common lethal genetic disorder in Caucasians",
      "ICS should only be added to LAMA + LABA in COPD patients with eosinophils ≥ 300 cells/μL or history of asthma overlap; indiscriminate ICS use increases pneumonia risk without mortality benefit",
      "Oxygen therapy (≥ 15 hr/day) is one of only three interventions proven to reduce mortality in COPD (along with smoking cessation and lung volume reduction surgery in select patients)",
      "The BODE index (BMI, Obstruction, Dyspnea, Exercise capacity) is a better predictor of mortality than FEV1 alone and should be used for prognostic discussions",
      "Pursed-lip breathing is a physiologic response to air trapping — it generates auto-PEEP that stents open collapsing small airways during expiration",
      "Azithromycin prophylaxis (250 mg daily) reduces COPD exacerbations by ~30% but requires monitoring for QTc prolongation and hearing loss"
    ],
    quiz: [
      {
        question: "A 52-year-old non-smoker presents with COPD and lower-lobe-predominant emphysema on CT. Which additional test should the NP order?",
        options: [
          "Sputum culture and sensitivity",
          "Alpha-1 antitrypsin serum level",
          "Serum ACE level for sarcoidosis",
          "D-dimer for pulmonary embolism"
        ],
        correct: 1,
        rationale: "COPD in a young non-smoker with lower-lobe-predominant panlobular emphysema is the classic presentation of alpha-1 antitrypsin (AAT) deficiency. WHO recommends AAT testing in all COPD patients under 45, those with family history, and those with lower-lobe emphysema. PiZZ phenotype has AAT levels < 11 μmol/L and qualifies for augmentation therapy."
      },
      {
        question: "A COPD patient on LAMA + LABA continues to have 3 exacerbations per year. Blood eosinophils are 85 cells/μL. What is the most appropriate therapy adjustment?",
        options: [
          "Add an ICS to create triple therapy",
          "Add azithromycin 250 mg daily for exacerbation prevention",
          "Switch to ICS monotherapy",
          "Discontinue LABA and continue LAMA only"
        ],
        correct: 1,
        rationale: "With low eosinophils (< 100 cells/μL), adding ICS provides minimal benefit and increases pneumonia risk. Azithromycin prophylaxis (250 mg daily) is the appropriate add-on for frequent exacerbators with low eosinophils, reducing exacerbation frequency by approximately 30%. ICS is indicated when eosinophils are ≥ 300 cells/μL."
      },
      {
        question: "Which is the most important single intervention to slow FEV1 decline in a patient with COPD?",
        options: [
          "Initiation of LAMA maintenance therapy",
          "Annual influenza vaccination",
          "Smoking cessation with pharmacotherapy support",
          "Pulmonary rehabilitation enrollment"
        ],
        correct: 2,
        rationale: "Smoking cessation is the only intervention proven to slow the accelerated decline in FEV1 in susceptible smokers (from ~60 mL/year back to the normal age-related decline of ~25–30 mL/year). The Lung Health Study demonstrated sustained FEV1 benefit with sustained smoking cessation. All other interventions improve symptoms and reduce exacerbations but do not alter the rate of lung function decline."
      }
    ]
  },

  "comprehensive-history-and-physical-np-level-np": {
    title: "Comprehensive History and Physical (NP Level)",
    cellular: {
      title: "Clinical Reasoning in Comprehensive History and Physical Examination",
      content: "The comprehensive history and physical examination (H&P) is the foundational clinical skill for nurse practitioner practice, integrating systematic data collection with advanced clinical reasoning to generate differential diagnoses and evidence-based management plans. The NP approach to H&P differs from task-oriented assessment by incorporating autonomous diagnostic reasoning, prescriptive authority considerations, and independent clinical decision-making. The history component follows a structured framework: chief complaint (CC), history of present illness (HPI) using OLDCARTS or OPQRST mnemonics with attention to pertinent positives and negatives, past medical history (PMH), past surgical history (PSH), family history (FH) with three-generation genogram for hereditary conditions, social history (SH) including HEADSS assessment for adolescents and substance use screening with validated tools (AUDIT-C, CAGE, PHQ-9), current medications with OTC and supplements, allergies with reaction type (true allergy vs. intolerance vs. adverse effect), and review of systems (ROS) — a 14-system screening tool that identifies symptoms the patient may not have spontaneously reported. The physical examination proceeds through inspection, palpation, percussion, and auscultation across all body systems, with the NP performing focused maneuvers based on clinical hypotheses generated during the history. Clinical reasoning employs both System 1 (pattern recognition/intuition for experienced clinicians) and System 2 (analytical/hypothetico-deductive reasoning) processing. The NP synthesizes history and physical findings to create a problem list, prioritized differential diagnoses using Bayesian reasoning (pre-test probability modified by clinical findings), and an assessment and plan (A&P) addressing each problem with diagnostic workup, therapeutic interventions, patient education, and follow-up."
    },
    riskFactors: [
      "Incomplete or inaccurate history due to patient communication barriers (language, cognitive impairment, hearing deficit, health literacy)",
      "Anchoring bias — premature closure on an initial diagnosis without considering the full differential",
      "Confirmation bias — selectively seeking information that supports the initial hypothesis while ignoring contradictory data",
      "Availability bias — overweighting diagnoses that are easily recalled (recent cases, dramatic presentations) over statistically likely diagnoses",
      "Time pressure in clinical encounters leading to abbreviated ROS and targeted rather than comprehensive examination",
      "Medically complex patients with multiple active problems obscuring new presentations (diagnostic overshadowing)",
      "Failure to perform age-appropriate and sex-appropriate screening during comprehensive encounters (missed preventive opportunities)"
    ],
    diagnostics: [
      "Age-appropriate preventive screening based on USPSTF guidelines: cervical cancer (Pap/HPV), breast cancer (mammography), colorectal cancer (colonoscopy or stool-based), lung cancer (low-dose CT), AAA (ultrasound)",
      "Baseline laboratory panel for comprehensive assessment: CBC with differential, CMP, lipid panel, TSH, HbA1c, urinalysis",
      "Cardiovascular risk assessment using the ACC/AHA Pooled Cohort Equations (10-year ASCVD risk score) to guide statin therapy decisions",
      "Depression screening with PHQ-2/PHQ-9 and anxiety screening with GAD-7 at initial comprehensive encounter",
      "Substance use screening with AUDIT-C for alcohol and single-question screening for illicit drug use",
      "Immunization status review per ACIP schedule with documentation and administration of needed vaccines",
      "Sexual health screening: HIV, syphilis (RPR), chlamydia/gonorrhea NAAT based on risk factors and USPSTF recommendations"
    ],
    management: [
      "Generate prioritized problem list from H&P findings with differential diagnoses ranked by probability, severity, and treatability",
      "Apply clinical decision rules and validated scoring tools to guide diagnostic workup (Wells criteria, HEART score, CHA₂DS₂-VASc, CURB-65)",
      "Prescribe evidence-based pharmacotherapy within NP scope of practice, documenting indication, dose rationale, and monitoring parameters",
      "Develop patient-centered management plan using shared decision-making, incorporating patient values, preferences, and health literacy level",
      "Address health maintenance and preventive care at every comprehensive visit: immunizations, cancer screening, chronic disease monitoring",
      "Coordinate referrals to specialists when clinical findings exceed NP scope or require procedural intervention, with clear referral questions and relevant data",
      "Document using a standardized SOAP or H&P format that supports medical decision-making complexity for appropriate billing (99213-99215, 99203-99205)"
    ],
    nursingActions: [
      "Conduct complete 14-system review of systems using structured format to identify symptoms requiring further evaluation",
      "Perform systematic head-to-toe physical examination including cardiac auscultation (S1, S2, murmurs, gallops), lung auscultation (adventitious sounds), abdominal exam (organomegaly, masses), neurological screening (cranial nerves, DTRs, sensation, cerebellar function)",
      "Elicit HPI using OLDCARTS framework: Onset, Location, Duration, Character, Aggravating factors, Relieving factors, Timing, Severity — with pertinent positives and negatives for each differential",
      "Identify red flag symptoms requiring urgent workup: unexplained weight loss > 10% in 6 months, new neurological deficits, chest pain with exertion, hemoptysis, persistent fever of unknown origin",
      "Apply clinical reasoning frameworks to avoid cognitive biases: consider differential breadth using the VINDICATE mnemonic (Vascular, Infectious, Neoplastic, Degenerative, Iatrogenic, Congenital, Autoimmune, Trauma, Endocrine)",
      "Perform motivational interviewing for health behavior modification: smoking cessation, physical activity, dietary changes, medication adherence",
      "Document medical decision-making complexity level for coding compliance: number of diagnoses, data reviewed, and risk of management decisions"
    ],
    assessmentFindings: [
      "Vital sign abnormalities requiring immediate investigation: hypertension (≥ 180/120 with end-organ damage), tachycardia (HR > 100 at rest), tachypnea, fever",
      "New cardiac murmur on auscultation requiring echocardiographic evaluation (systolic murmur graded ≥ 3/6 or any diastolic murmur)",
      "Lymphadenopathy — characterize by location, size, consistency, tenderness, and fixation to guide differential (reactive vs. malignant)",
      "Abdominal mass or organomegaly on palpation requiring imaging workup",
      "Neurological deficits on screening exam: asymmetric reflexes, focal weakness, sensory loss, abnormal cerebellar testing",
      "Skin findings: new or changing moles requiring ABCDE evaluation, suspicious rashes, non-healing wounds",
      "Musculoskeletal abnormalities: joint effusion, reduced range of motion, deformity, instability"
    ],
    signs: {
      left: [
        "Well-appearing patient with normal vital signs and unremarkable comprehensive physical examination",
        "Isolated mild systolic murmur (grade 1–2/6) at left sternal border without radiation or symptoms — likely innocent flow murmur",
        "Mildly elevated BMI (25–29.9) without metabolic complications requiring lifestyle counseling",
        "Stable chronic conditions (well-controlled hypertension, diabetes at A1C goal) requiring medication refills and monitoring",
        "Age-appropriate health maintenance needs identified (screening tests due, immunization updates)"
      ],
      right: [
        "Unexplained weight loss > 10% in 6 months with lymphadenopathy and night sweats requiring urgent malignancy workup",
        "New-onset focal neurological deficits requiring emergent imaging (CT/MRI) to rule out stroke or mass lesion",
        "Severe hypertension (≥ 180/120) with headache, visual changes, and proteinuria indicating hypertensive emergency",
        "Acute abdomen with peritoneal signs (guarding, rigidity, rebound tenderness) requiring surgical consultation",
        "New diastolic murmur with signs of heart failure (JVD, crackles, peripheral edema) requiring echocardiography"
      ]
    },
    medications: [
      {
        name: "Lisinopril",
        type: "ACE inhibitor (antihypertensive)",
        action: "Inhibits angiotensin-converting enzyme, preventing conversion of angiotensin I to angiotensin II, reducing systemic vascular resistance, aldosterone secretion, and cardiac remodeling",
        sideEffects: "Dry cough (bradykinin accumulation — 10–15% incidence), angioedema (rare but life-threatening), hyperkalemia, acute kidney injury (especially with NSAID or dehydration), teratogenicity",
        contra: "Pregnancy (category D — fetal renal dysgenesis), bilateral renal artery stenosis, history of ACE inhibitor-related angioedema, serum potassium > 5.5 mEq/L",
        pearl: "First-line for hypertension with diabetes, CKD with proteinuria, or HFrEF; start 5–10 mg daily and titrate to target; check BMP at 1–2 weeks after initiation (monitor creatinine rise ≤ 30% is acceptable)"
      },
      {
        name: "Atorvastatin",
        type: "HMG-CoA reductase inhibitor (statin)",
        action: "Competitively inhibits HMG-CoA reductase, the rate-limiting enzyme in hepatic cholesterol synthesis, upregulating LDL receptor expression and increasing LDL-C clearance from circulation",
        sideEffects: "Myalgias (5–10%), elevated transaminases, rhabdomyolysis (rare), new-onset diabetes (slight increase, especially high-intensity dosing), cognitive complaints (reversible)",
        contra: "Active liver disease or unexplained persistent transaminase elevation > 3× ULN, pregnancy (category X), concurrent use of strong CYP3A4 inhibitors at high statin doses",
        pearl: "High-intensity statin (40–80 mg) for established ASCVD or 10-year ASCVD risk ≥ 20%; moderate-intensity (10–20 mg) for primary prevention with risk 7.5–20%; check lipid panel 4–12 weeks after initiation"
      }
    ],
    pearls: [
      "The comprehensive H&P generates 80% of diagnoses — diagnostic testing confirms or refines hypotheses generated from the history and physical examination",
      "Pertinent negatives are as diagnostically important as pertinent positives — documenting the absence of expected findings narrows the differential and demonstrates thorough evaluation",
      "The VINDICATE mnemonic ensures differential breadth: Vascular, Infectious, Neoplastic, Degenerative, Iatrogenic, Congenital, Autoimmune, Trauma, Endocrine",
      "Red flags requiring urgent workup: unexplained weight loss > 10%, new focal neurological deficits, worst headache of life, chest pain with exertional syncope, hemoptysis",
      "Shared decision-making tools (Ottawa Decision Aids, AHRQ) improve patient understanding and satisfaction for preference-sensitive decisions (cancer screening, statin initiation)",
      "Every comprehensive visit is an opportunity for preventive care — review immunizations, cancer screening status, and chronic disease monitoring regardless of the presenting complaint",
      "Medical decision-making documentation should clearly support the E&M coding level — number and complexity of problems, data reviewed, and risk of management decisions"
    ],
    quiz: [
      {
        question: "During a comprehensive H&P, the NP finds a new grade 3/6 holosystolic murmur radiating to the axilla. The patient denies symptoms. What is the most appropriate next step?",
        options: [
          "Document as an incidental finding and recheck at the annual visit",
          "Order a transthoracic echocardiogram to evaluate valvular structure and function",
          "Start empiric antibiotic prophylaxis for endocarditis",
          "Immediately refer to cardiothoracic surgery"
        ],
        correct: 1,
        rationale: "A grade 3/6 holosystolic murmur radiating to the axilla is consistent with mitral regurgitation and warrants echocardiographic evaluation to assess valve structure, regurgitation severity, and ventricular function. Even in asymptomatic patients, significant valvular disease requires monitoring. Antibiotic prophylaxis for endocarditis is no longer recommended for most valvular lesions."
      },
      {
        question: "An NP is evaluating a 55-year-old patient at a comprehensive visit and notices they have not had colorectal cancer screening. The patient is average-risk. Which screening option should the NP recommend?",
        options: [
          "Annual fecal occult blood test as the only option",
          "Colonoscopy beginning at age 60 for average-risk patients",
          "Colonoscopy every 10 years or stool-based testing (FIT annually or Cologuard every 3 years) starting at age 45",
          "CT colonography annually beginning at age 50"
        ],
        correct: 2,
        rationale: "USPSTF recommends colorectal cancer screening for average-risk adults beginning at age 45 (updated from 50 in 2021). Options include colonoscopy every 10 years, annual high-sensitivity FIT, or multi-target stool DNA (Cologuard) every 3 years. Shared decision-making should guide the choice based on patient preference and access."
      },
      {
        question: "Which cognitive bias most commonly leads to diagnostic error when an NP forms an initial impression early in the patient encounter and fails to adjust despite contradictory findings?",
        options: [
          "Availability bias",
          "Anchoring bias",
          "Confirmation bias",
          "Hindsight bias"
        ],
        correct: 1,
        rationale: "Anchoring bias occurs when clinicians fixate on an initial diagnosis formed early in the encounter and fail to adequately adjust their thinking when new information becomes available. This leads to premature diagnostic closure. Strategies to mitigate anchoring include maintaining a broad differential, actively seeking disconfirming evidence, and using diagnostic timeouts."
      }
    ]
  },

  "differential-diagnosis-formulation-np-level-np": {
    title: "Differential Diagnosis Formulation (NP Level)",
    cellular: {
      title: "Clinical Reasoning and Differential Diagnosis Construction",
      content: "Differential diagnosis formulation is the systematic process of generating, prioritizing, and refining a list of possible diagnoses based on clinical data. For the nurse practitioner, this skill represents the core of autonomous clinical decision-making, distinguishing advanced practice from task-oriented care. The cognitive process employs dual-process theory: System 1 (intuitive pattern recognition) rapidly generates diagnostic hypotheses based on illness scripts stored in clinical memory, while System 2 (analytical reasoning) systematically evaluates each hypothesis against clinical data using hypothetico-deductive reasoning. Expert clinicians seamlessly integrate both systems — recognizing common patterns quickly while engaging analytical reasoning for atypical or complex presentations. The differential diagnosis process begins with problem representation: distilling the clinical presentation into a concise semantic statement that captures the key features (e.g., 'acute-onset severe headache in a 45-year-old hypertensive female with neck stiffness'). Effective problem representation activates relevant illness scripts and narrows the differential before systematic analysis. Bayesian reasoning underlies differential prioritization: pre-test probability (disease prevalence in the patient's demographic) is modified by the sensitivity and specificity of clinical findings (likelihood ratios) to generate post-test probability. The NP must also apply the concept of diagnostic parsimony (Occam's razor — seeking a single unifying diagnosis) balanced against Hickam's dictum (patients can have multiple concurrent diagnoses, especially elderly patients with comorbidities). Diagnostic error — the failure to establish an accurate and timely diagnosis — occurs in approximately 10–15% of clinical encounters, with cognitive errors (particularly premature closure, anchoring, and availability bias) accounting for the majority. Structured approaches to differential generation (anatomic, pathophysiologic, VINDICATE mnemonic) reduce cognitive error rates."
    },
    riskFactors: [
      "Premature closure — the most common cognitive error in diagnosis, where the clinician stops considering alternatives after reaching an initial diagnosis",
      "Anchoring bias — over-reliance on a single piece of clinical information (usually the first) when generating the differential",
      "Atypical disease presentations — elderly patients, immunocompromised hosts, and patients on corticosteroids may present without classic findings",
      "Diagnostic momentum — accepting a prior clinician's diagnosis without independent verification (transferred diagnosis bias)",
      "High cognitive load — managing multiple patients simultaneously, fatigue, and time pressure reduce analytical reasoning capacity",
      "Low base-rate conditions — rare diseases may not appear on the clinician's differential despite matching the clinical presentation",
      "Comorbidity masking — existing chronic conditions (COPD, heart failure, diabetes) producing symptoms that overlap with new acute pathology"
    ],
    diagnostics: [
      "Structured problem representation: synthesize key clinical features into a one-sentence semantic qualifier statement before generating differentials",
      "Apply VINDICATE mnemonic for systematic differential generation: Vascular, Infectious, Neoplastic, Degenerative, Iatrogenic, Congenital, Autoimmune, Trauma, Endocrine",
      "Use validated clinical prediction rules to refine probability: Wells criteria (DVT/PE), HEART score (ACS), Centor criteria (streptococcal pharyngitis), Ottawa ankle/knee rules",
      "Order targeted diagnostic testing based on the differential — each test should aim to confirm or exclude a specific diagnosis on the list",
      "Calculate pre-test probability using disease prevalence and patient demographics before ordering tests to improve diagnostic yield",
      "Apply likelihood ratios (positive and negative) to clinical findings and test results to quantify diagnostic probability shifts",
      "Implement diagnostic timeout: deliberately pause before finalizing diagnosis to review the differential and consider overlooked possibilities"
    ],
    management: [
      "Prioritize differential diagnoses by three criteria: probability (most likely), severity (most dangerous if missed), and treatability (most responsive to early intervention)",
      "Address 'cannot miss' diagnoses first — life-threatening conditions that require immediate rule-out regardless of probability (PE in dyspnea, ACS in chest pain, SAH in thunderclap headache)",
      "Apply test-treatment thresholds: below the testing threshold (probability too low to warrant testing), between thresholds (order diagnostic tests), above treatment threshold (treat empirically without further testing)",
      "Use time as a diagnostic tool — serial examinations and scheduled reassessment for undifferentiated presentations where the diagnosis is not yet clear",
      "Implement structured handoff communication (I-PASS, SBAR) ensuring the current differential and planned diagnostic steps are clearly communicated to covering providers",
      "Document the differential diagnosis list with clinical reasoning in the medical record — this supports continuity, medicolegal protection, and demonstrates medical decision-making complexity",
      "Reassess and refine the differential as new data becomes available — actively practice diagnostic revision rather than anchoring to the initial impression"
    ],
    nursingActions: [
      "Generate a minimum 3–5 item differential diagnosis for every undifferentiated patient encounter, prioritized by probability and severity",
      "Perform systematic history and physical examination guided by the evolving differential — actively seek pertinent positives AND pertinent negatives for each diagnosis under consideration",
      "Apply clinical decision rules appropriately: understand their derivation population, validation status, and limitations before applying to individual patients",
      "Identify and mitigate cognitive biases through deliberate practice: consider the opposite, use diagnostic checklists, and perform diagnostic timeouts",
      "Order diagnostic workup strategically — sequence tests from least invasive and most informative to most invasive, using pre-test probability to guide selection",
      "Communicate diagnostic uncertainty transparently to patients using plain language, explaining the differential and the rationale for each diagnostic step",
      "Engage in reflective practice: review diagnostic outcomes, conduct case reviews, and maintain illness script libraries to improve pattern recognition over time"
    ],
    assessmentFindings: [
      "Symptom clusters that suggest specific organ system involvement and narrow the differential",
      "Pertinent negatives that help exclude diagnoses from the differential (e.g., absence of fever makes infection less likely)",
      "Red flag findings that mandate immediate workup regardless of clinical probability (worst headache of life, saddle anesthesia, weight loss with lymphadenopathy)",
      "Temporal patterns that differentiate diagnoses: hyperacute (seconds-minutes: vascular), acute (hours-days: infectious, inflammatory), subacute (days-weeks: autoimmune, neoplastic), chronic (weeks-months: degenerative, neoplastic)",
      "Epidemiological clues from demographics, occupation, travel history, exposures, and contacts that modify pre-test probabilities",
      "Response to empiric therapy as diagnostic information (e.g., improvement with PPI suggests GERD, response to corticosteroids supports inflammatory etiology)",
      "Physical examination findings with high positive likelihood ratios: shifting dullness for ascites (LR+ 2.7), pulsus paradoxus for tamponade (LR+ 3.3), egophony for consolidation (LR+ 4.1)"
    ],
    signs: {
      left: [
        "Undifferentiated chief complaint with stable vital signs allowing systematic workup without time pressure",
        "Presentation consistent with common diagnoses (viral URI, musculoskeletal strain, GERD) with reassuring examination",
        "Diagnostic workup results progressively narrowing the differential to a single likely diagnosis",
        "Patient with clear follow-up plan and safety-net instructions for re-evaluation if symptoms worsen",
        "Chronic stable condition requiring differential refinement at scheduled follow-up visit"
      ],
      right: [
        "Undifferentiated chest pain with multiple dangerous diagnoses on the differential (ACS, PE, aortic dissection, tension pneumothorax)",
        "Thunderclap headache requiring immediate CT and lumbar puncture to rule out subarachnoid hemorrhage",
        "Acute neurological deficit within thrombolytic window requiring emergent stroke protocol activation",
        "Diagnostic uncertainty persisting despite standard workup, requiring escalation to specialist consultation or advanced imaging",
        "Deteriorating patient where the current differential and treatment plan are not explaining the clinical trajectory"
      ]
    },
    medications: [
      {
        name: "Empiric Antibiotic Therapy (Concept)",
        type: "Targeted empiric coverage based on differential diagnosis",
        action: "Initiated when infectious etiology is on the differential and clinical severity warrants treatment before culture results are available — selected based on most likely organisms, local resistance patterns, and patient risk factors",
        sideEffects: "Antibiotic-associated diarrhea, C. difficile infection, allergic reactions, selection for resistant organisms, masking of culture results if obtained after initiation",
        contra: "Low clinical suspicion for infection (pre-test probability below treatment threshold); clear non-infectious diagnosis established; known severe allergy without desensitization plan",
        pearl: "Always obtain cultures BEFORE starting empiric antibiotics when possible; reassess and narrow therapy at 48–72 hours based on culture results and clinical response (antibiotic stewardship)"
      },
      {
        name: "Nitroglycerin (Diagnostic and Therapeutic)",
        type: "Nitric oxide donor / vasodilator",
        action: "Releases nitric oxide in vascular smooth muscle, activating guanylate cyclase and increasing cGMP, causing venodilation (reduces preload) and coronary vasodilation; diagnostic use: relief of chest pain helps differentiate anginal from non-cardiac pain (though not specific)",
        sideEffects: "Headache (most common), hypotension, reflex tachycardia, syncope, tolerance with continuous use",
        contra: "Concurrent PDE5 inhibitor use within 24–48 hours (sildenafil, tadalafil — severe hypotension), severe aortic stenosis, right ventricular infarction (preload-dependent), SBP < 90 mmHg",
        pearl: "Response to nitroglycerin does NOT reliably confirm cardiac chest pain — esophageal spasm also responds; however, failure to respond reduces the post-test probability of angina; always check recent PDE5 inhibitor use"
      }
    ],
    pearls: [
      "The problem representation is the single most powerful tool for differential diagnosis — a well-crafted summary statement activates relevant illness scripts and focuses the workup",
      "Always ask: 'What is the most dangerous diagnosis I cannot afford to miss?' before considering the most likely diagnosis — rule out life threats first",
      "Premature closure is the number one cognitive error in clinical diagnosis — counter it by forcing yourself to generate at least 3 differential diagnoses before proceeding",
      "Likelihood ratios quantify how much a clinical finding changes diagnostic probability: LR+ > 10 or LR- < 0.1 are strong; LR+ 5–10 or LR- 0.1–0.2 are moderate",
      "Time is a diagnostic tool — for undifferentiated presentations that do not require immediate intervention, serial examinations over hours to days can clarify the diagnosis",
      "Document your differential diagnosis and clinical reasoning in the medical record — it demonstrates thorough evaluation, supports medical decision-making complexity for coding, and provides medicolegal protection",
      "Illness scripts (mental models of diseases incorporating demographics, pathophysiology, presentation, timeline, and key features) are built through clinical experience and deliberate study — continuously expand your library"
    ],
    quiz: [
      {
        question: "A 65-year-old patient presents with acute onset of the 'worst headache of my life.' CT head is negative. What should the NP do next?",
        options: [
          "Diagnose tension headache and prescribe acetaminophen",
          "Perform lumbar puncture to evaluate for subarachnoid hemorrhage",
          "Order an MRI of the brain and discharge with follow-up",
          "Prescribe a triptan for presumed migraine"
        ],
        correct: 1,
        rationale: "Thunderclap headache ('worst headache of life') mandates evaluation for subarachnoid hemorrhage (SAH). CT sensitivity for SAH decreases with time — a negative CT does not rule out SAH, especially beyond 6 hours from onset. Lumbar puncture is required to evaluate for xanthochromia (bilirubin in CSF from RBC breakdown), which indicates SAH. This is a 'cannot miss' diagnosis on the differential."
      },
      {
        question: "An NP evaluating a patient with acute chest pain orders a troponin, which returns normal. The NP determines the patient likely has GERD and discharges them. What cognitive error is most likely occurring?",
        options: [
          "Anchoring bias",
          "Premature closure",
          "Availability bias",
          "Framing effect"
        ],
        correct: 1,
        rationale: "Premature closure is the failure to consider alternative diagnoses after reaching an initial conclusion. A single normal troponin does not rule out ACS — serial troponins at 3 and 6 hours are required. The NP has closed the diagnostic process prematurely without completing the appropriate workup or considering other dangerous differentials (PE, aortic dissection)."
      },
      {
        question: "Which structured approach helps the NP ensure a broad differential diagnosis that covers all major pathological categories?",
        options: [
          "SOAP documentation format",
          "VINDICATE mnemonic (Vascular, Infectious, Neoplastic, Degenerative, Iatrogenic, Congenital, Autoimmune, Trauma, Endocrine)",
          "Maslow's hierarchy of needs",
          "Gordon's functional health patterns"
        ],
        correct: 1,
        rationale: "The VINDICATE mnemonic systematically covers all major pathological categories (Vascular, Infectious, Neoplastic, Degenerative, Iatrogenic, Congenital, Autoimmune, Trauma, Endocrine), ensuring the clinician considers diagnoses across all etiological categories. This structured approach reduces the risk of premature closure and anchoring bias by forcing consideration of uncommon but important diagnoses."
      }
    ]
  },

  "sofa-and-apache-ii-scoring-np-level-np": {
    title: "SOFA and APACHE II Scoring (NP Level)",
    cellular: {
      title: "Critical Care Severity Scoring: SOFA and APACHE II",
      content: "The Sequential Organ Failure Assessment (SOFA) score and Acute Physiology and Chronic Health Evaluation II (APACHE II) score are validated clinical scoring systems used in critical care to quantify illness severity, predict mortality, guide treatment intensity, and facilitate clinical communication. The SOFA score evaluates six organ systems — respiratory (PaO2/FiO2 ratio), coagulation (platelet count), hepatic (bilirubin), cardiovascular (mean arterial pressure and vasopressor requirements), central nervous system (Glasgow Coma Scale), and renal (creatinine or urine output) — each scored 0–4 for a maximum score of 24. In the Sepsis-3 definition, an acute increase in SOFA score ≥ 2 from baseline defines organ dysfunction attributable to sepsis, with associated mortality increasing from 10% (SOFA 0–6) to > 50% (SOFA ≥ 15). The qSOFA (quick SOFA) serves as a bedside screening tool outside the ICU: altered mental status (GCS < 15), systolic blood pressure ≤ 100 mmHg, and respiratory rate ≥ 22 breaths/minute — 2 or more positive criteria prompt full SOFA assessment and sepsis evaluation. APACHE II uses 12 acute physiologic variables (temperature, MAP, heart rate, respiratory rate, oxygenation, arterial pH, sodium, potassium, creatinine, hematocrit, WBC, GCS), age points (0–6), and chronic health points (for severe organ dysfunction or immunocompromise) to generate a score from 0–71, with predicted mortality calculated from a logistic regression equation incorporating the APACHE II score and the patient's primary diagnosis. An APACHE II score > 25 corresponds to approximately 50% predicted mortality, and > 35 approaches 80%. The NP uses these scores for objective severity quantification, prognostic communication with families, ICU triage and resource allocation decisions, quality benchmarking (observed vs. expected mortality), and research stratification. Serial SOFA trending (delta-SOFA) is particularly valuable: an increasing SOFA score over 48–72 hours indicates deterioration and prompts reassessment of the diagnostic and therapeutic approach, while a decreasing SOFA suggests treatment response."
    },
    riskFactors: [
      "Sepsis and septic shock as defined by Sepsis-3 criteria (SOFA ≥ 2 with suspected infection; vasopressor-dependent MAP ≥ 65 and lactate > 2 despite fluid resuscitation)",
      "Multi-organ dysfunction syndrome (MODS) with failure of two or more organ systems (mortality increases exponentially with each additional organ failure)",
      "Delayed recognition of clinical deterioration — failure to calculate and trend severity scores leads to delayed escalation",
      "Advanced age (APACHE II awards 0–6 points for age; patients > 75 years receive maximum age points, increasing predicted mortality)",
      "Pre-existing chronic organ dysfunction (APACHE II awards chronic health points for hepatic failure, cardiovascular class IV, renal failure, immunocompromise)",
      "Inappropriate ICU triage — patients with high severity scores may benefit from early aggressive intervention while those with very high scores may warrant goals-of-care discussions",
      "Scoring tool misapplication — using APACHE II beyond 24 hours of ICU admission or calculating SOFA without baseline values reduces predictive accuracy"
    ],
    diagnostics: [
      "Calculate SOFA score on ICU admission and every 24 hours using worst values in each 24-hour period for six organ systems",
      "Calculate qSOFA at the bedside for any patient with suspected infection outside the ICU: altered mentation, SBP ≤ 100, RR ≥ 22",
      "Calculate APACHE II score within the first 24 hours of ICU admission using the worst values for 12 physiologic variables plus age and chronic health status",
      "Obtain arterial blood gas for PaO2 (respiratory SOFA component) and arterial pH (APACHE II acute physiology score component)",
      "Monitor serum lactate every 4–6 hours in sepsis — lactate > 2 mmol/L with vasopressor requirement defines septic shock per Sepsis-3",
      "Track delta-SOFA (change in SOFA score over time) every 24–48 hours to assess trajectory: rising delta-SOFA indicates clinical deterioration",
      "Document vasopressor doses (dopamine, dobutamine, norepinephrine, epinephrine) accurately for cardiovascular SOFA scoring — specific thresholds determine score assignment"
    ],
    management: [
      "Initiate Surviving Sepsis Campaign hour-1 bundle for patients meeting sepsis criteria (SOFA ≥ 2 with infection): measure lactate, obtain blood cultures, administer broad-spectrum antibiotics, begin 30 mL/kg crystalloid for hypotension or lactate ≥ 4",
      "Escalate care intensity based on SOFA trajectory: rising SOFA at 48 hours predicts mortality and should trigger reassessment of antimicrobials (source control, resistance patterns), hemodynamic support, and diagnostic workup",
      "Use APACHE II predicted mortality for prognostic communication with families and shared decision-making about goals of care, especially when predicted mortality exceeds 50%",
      "Titrate vasopressors to maintain MAP ≥ 65 mmHg, documenting exact doses for accurate cardiovascular SOFA scoring (norepinephrine ≤ 0.1 μg/kg/min = SOFA 3; > 0.1 = SOFA 4)",
      "Optimize organ-specific support based on individual SOFA component scores: lung-protective ventilation for respiratory failure, renal replacement therapy for AKI, correction of coagulopathy",
      "Calculate standardized mortality ratio (SMR = observed deaths / APACHE II predicted deaths) for ICU quality benchmarking — SMR < 1.0 indicates better-than-predicted performance",
      "Initiate palliative care consultation for patients with APACHE II > 35 or persistently rising SOFA scores despite maximal therapy to ensure alignment of treatment with patient goals"
    ],
    nursingActions: [
      "Calculate SOFA score using standardized assessment: PaO2/FiO2 ratio (respiratory), platelet count (coagulation), bilirubin (hepatic), MAP and vasopressor dose (cardiovascular), GCS (CNS), creatinine or urine output (renal)",
      "Apply qSOFA screening to all patients on medical-surgical units with suspected infection: GCS < 15, SBP ≤ 100, RR ≥ 22 — escalate if 2 or more criteria are met",
      "Document APACHE II score within the first 24 hours of ICU admission using the worst physiologic values for each of the 12 variables",
      "Trend SOFA scores daily and calculate delta-SOFA to identify patients who are deteriorating or improving — communicate trajectories to the multidisciplinary team during rounds",
      "Ensure accurate vasopressor documentation including drug, concentration, rate, and calculated dose (μg/kg/min) for precise cardiovascular SOFA scoring",
      "Use severity scores to frame prognostic conversations with families: translate APACHE II predicted mortality into understandable terms while acknowledging uncertainty in individual predictions",
      "Participate in ICU quality improvement by tracking and reporting observed vs. expected mortality (SMR) and identifying cases where scoring systems suggest potential for improvement"
    ],
    assessmentFindings: [
      "Acute increase in SOFA score ≥ 2 from baseline in the setting of suspected infection (defines sepsis per Sepsis-3)",
      "qSOFA ≥ 2 at the bedside (altered mentation, SBP ≤ 100, RR ≥ 22) in a patient with suspected infection outside the ICU",
      "Rising SOFA score over serial measurements indicating multi-organ deterioration despite current management",
      "PaO2/FiO2 ratio < 100 (SOFA respiratory score = 4) indicating severe ARDS requiring advanced ventilator support",
      "Vasopressor-dependent MAP ≥ 65 mmHg with serum lactate > 2 mmol/L (meeting septic shock criteria)",
      "GCS declining (SOFA CNS component worsening) indicating neurological deterioration requiring urgent evaluation",
      "APACHE II score > 25 at ICU admission indicating predicted mortality approaching 50% — triggering goals-of-care discussion"
    ],
    signs: {
      left: [
        "SOFA score 0–2 with no acute organ dysfunction — patient stable for medical-surgical unit level of care",
        "qSOFA score of 0–1 in a patient being evaluated for infection — low risk for sepsis-related poor outcomes",
        "APACHE II score < 10 with predicted mortality < 10% — favorable prognosis with standard ICU management",
        "Delta-SOFA trending downward over 48–72 hours indicating response to therapy",
        "Single organ dysfunction (SOFA = 3 in one system, 0 in others) with clear etiology being addressed"
      ],
      right: [
        "SOFA score ≥ 15 with multi-organ failure (3+ organ systems with SOFA ≥ 3 each) — mortality exceeding 50%",
        "qSOFA ≥ 2 with subsequent SOFA increase ≥ 2 — sepsis confirmed with rapid clinical deterioration",
        "Rising delta-SOFA over 72 hours despite maximal therapy indicating refractory multi-organ dysfunction",
        "APACHE II > 35 at ICU admission — predicted mortality approaching 80%, warranting immediate goals-of-care discussion",
        "Septic shock (vasopressor-dependent MAP ≥ 65, lactate > 4 mmol/L) with SOFA cardiovascular score = 4"
      ]
    },
    medications: [
      {
        name: "Norepinephrine (Levophed)",
        type: "First-line vasopressor for septic shock",
        action: "Potent α1-adrenergic agonist (vasoconstriction increasing SVR) with moderate β1 activity (increases contractility and heart rate); restores MAP in distributive shock",
        sideEffects: "Peripheral ischemia (digital gangrene with prolonged high-dose use), arrhythmias, tissue necrosis with extravasation, mesenteric ischemia at high doses",
        contra: "Hypovolemia (must correct volume deficit before or concurrent with vasopressor initiation); mesenteric or peripheral vascular thrombosis (relative); pheochromocytoma (unopposed adrenergic stimulation)",
        pearl: "First-line vasopressor per Surviving Sepsis Campaign guidelines; initial dose 0.1–0.5 μg/kg/min titrated to MAP ≥ 65; SOFA cardiovascular scoring thresholds: ≤ 0.1 μg/kg/min = SOFA 3, > 0.1 μg/kg/min = SOFA 4; must be administered via central line"
      },
      {
        name: "Vasopressin (ADH)",
        type: "Non-catecholamine vasopressor (V1 receptor agonist)",
        action: "Activates V1 receptors on vascular smooth muscle causing vasoconstriction independent of catecholamine pathways; restores vascular tone in vasodilatory shock where endogenous vasopressin is depleted",
        sideEffects: "Digital ischemia, mesenteric ischemia, hyponatremia (V2-mediated water retention), cardiac ischemia in patients with coronary artery disease",
        contra: "Responsive septic shock adequately managed with norepinephrine alone; hypersensitivity; acute coronary syndrome (relative)",
        pearl: "Added as second-line vasopressor to norepinephrine in septic shock (VASST trial); fixed dose 0.03–0.04 units/min (not titrated); allows reduction in norepinephrine dose (catecholamine-sparing effect); particularly useful in patients with tachyarrhythmias on high-dose norepinephrine"
      }
    ],
    pearls: [
      "Sepsis-3 definition: organ dysfunction (SOFA ≥ 2 from baseline) caused by a dysregulated host response to infection; septic shock adds vasopressor requirement for MAP ≥ 65 AND lactate > 2 mmol/L",
      "qSOFA is a screening tool, not a diagnostic criterion — sensitivity is only ~50% for sepsis, so clinical judgment must supplement scoring in ambiguous presentations",
      "Delta-SOFA (change in SOFA over time) is more predictive of mortality than a single SOFA score — a rising trajectory over 48–72 hours should trigger comprehensive reassessment",
      "APACHE II must be calculated within the first 24 hours of ICU admission using the WORST physiologic values — calculating it later or using average values reduces predictive accuracy",
      "Each additional organ failure in MODS increases mortality by approximately 15–20% — patients with ≥ 3 organ failures have mortality rates exceeding 50%",
      "Severity scores are population-based predictions — they should inform but not dictate individual clinical decisions; always integrate scoring with clinical assessment and patient goals",
      "Standardized mortality ratio (observed / expected mortality from APACHE II) is a key ICU quality metric — SMR < 1.0 indicates superior performance compared to predicted outcomes"
    ],
    quiz: [
      {
        question: "A patient in the ICU has a SOFA score of 8 on day 1 and 14 on day 3. The delta-SOFA is +6. What does this trajectory indicate?",
        options: [
          "The patient is improving and can be transferred to a step-down unit",
          "The scoring system is inaccurate and should be recalculated",
          "The patient has significant multi-organ deterioration requiring reassessment of the treatment plan and consideration of goals-of-care discussion",
          "The score increase is expected and requires no change in management"
        ],
        correct: 2,
        rationale: "A delta-SOFA of +6 over 48 hours indicates significant multi-organ deterioration despite current management. This trajectory predicts high mortality and should trigger comprehensive reassessment: review antimicrobial coverage, evaluate for undrained source of infection, reassess hemodynamic support, and initiate a goals-of-care conversation with the patient's family."
      },
      {
        question: "A nurse on a medical floor has a patient with suspected UTI who has a respiratory rate of 24, GCS of 13, and blood pressure of 98/62. The qSOFA score is 3. What is the appropriate next action?",
        options: [
          "Continue current care and recheck vitals in 4 hours",
          "Administer oral antibiotics and discharge home",
          "Immediately obtain blood cultures, serum lactate, calculate full SOFA score, and initiate the Surviving Sepsis Campaign hour-1 bundle",
          "Transfer to the ICU without further assessment"
        ],
        correct: 2,
        rationale: "A qSOFA score of 3 (altered mentation, tachypnea, hypotension) in a patient with suspected infection indicates high risk for sepsis-related poor outcomes. The NP should immediately initiate the Surviving Sepsis Campaign hour-1 bundle: obtain blood cultures, measure serum lactate, start broad-spectrum antibiotics, administer 30 mL/kg crystalloid if hypotensive or lactate ≥ 4, and calculate the full SOFA score to assess for organ dysfunction."
      },
      {
        question: "Which component is NOT part of the SOFA score calculation?",
        options: [
          "PaO2/FiO2 ratio (respiratory)",
          "Serum lactate level",
          "Glasgow Coma Scale (neurological)",
          "Platelet count (coagulation)"
        ],
        correct: 1,
        rationale: "Serum lactate is NOT a component of the SOFA score. The six SOFA components are: respiratory (PaO2/FiO2 ratio), coagulation (platelet count), hepatic (bilirubin), cardiovascular (MAP and vasopressor dose), CNS (Glasgow Coma Scale), and renal (creatinine or urine output). Lactate is used in the Sepsis-3 definition of septic shock (lactate > 2 mmol/L with vasopressor requirement) but is separate from the SOFA scoring system."
      }
    ]
  },
  "heart-sounds-2-rpn": {
    title: "Heart Sounds",
    cellular: {
      title: "Heart Sounds: Pathophysiology and Clinical Foundations",
      content: "Heart sounds are produced by the closure of cardiac valves and turbulent blood flow. S1 (lub) occurs with mitral and tricuspid valve closure at the onset of systole, while S2 (dub) occurs with aortic and pulmonic valve closure at the onset of diastole. S3 is a low-pitched sound heard in early diastole, often associated with heart failure in adults due to rapid ventricular filling against a non-compliant ventricle. S4 occurs in late diastole and is associated with a stiff, hypertrophied ventricle, commonly heard in hypertension and aortic stenosis.\n\nCardiovascular complications can rapidly progress to hemodynamic instability and organ failure. The RPN/LVN must monitor vital signs frequently, recognize early signs of decompensation such as changes in heart rate, blood pressure, and peripheral perfusion, and escalate concerns promptly. Electrocardiographic changes may provide early warning of cardiac compromise before clinical symptoms become apparent.\n\nWithin the RPN/LVN scope of practice, nursing care for heart sounds includes systematic assessment, implementation of established care protocols, accurate documentation, and timely communication with the interprofessional team. The practical nurse contributes to patient safety through ongoing monitoring, patient education reinforcement, and adherence to evidence-based practice standards. Understanding the underlying pathophysiology enables the practical nurse to anticipate potential complications and respond appropriately within their scope."
    },
    riskFactors: [
      "Hypertension and uncontrolled blood pressure elevating cardiac workload",
      "Coronary artery disease and history of previous cardiac events",
      "Diabetes mellitus contributing to accelerated atherosclerosis",
      "Dyslipidemia with elevated LDL and reduced HDL cholesterol",
      "Obesity (BMI >30) increasing cardiovascular strain and metabolic demands"
    ],
    diagnostics: [
      "12-lead ECG and continuous cardiac monitoring for rhythm and ST-segment changes",
      "Troponin I/T levels (serial measurements at 0, 3, and 6 hours)",
      "Echocardiography assessing chamber size, wall motion, and valve function",
      "BNP/NT-proBNP levels for heart failure evaluation"
    ],
    management: [
      "Hemodynamic monitoring and optimization of cardiac output",
      "Pharmacological management with cardioprotective medications as ordered",
      "Activity restriction and progressive mobilization based on cardiac status",
      "Dietary modifications including sodium and fluid restrictions as indicated"
    ],
    nursingActions: [
      "Perform systematic assessment specific to heart sounds with accurate documentation of all findings",
      "Monitor vital signs and condition-specific parameters at prescribed intervals, reporting changes to the registered nurse or physician",
      "Implement prescribed interventions within RPN/LVN scope of practice and evaluate patient response",
      "Provide patient and family education reinforcement regarding condition management, medications, and when to seek medical attention",
      "Maintain accurate intake and output records and document all nursing interventions and patient responses"
    ],
    assessmentFindings: [
      "Altered heart rate or rhythm detected on auscultation or cardiac monitoring",
      "Blood pressure changes including hypertension, hypotension, or orthostatic changes",
      "Peripheral edema, jugular venous distension, or signs of fluid overload",
      "Chest pain or discomfort with associated diaphoresis or dyspnea"
    ],
    signs: {
      left: [
        "Tachycardia or bradycardia with irregular pulse",
        "Hypotension or hypertension with orthostatic changes",
        "Peripheral edema and jugular venous distension",
        "Chest pain, dyspnea on exertion, and fatigue"
      ],
      right: [
        "Elevated troponin or BNP/NT-proBNP levels",
        "ECG changes (ST elevation/depression, arrhythmias)",
        "Abnormal echocardiographic findings",
        "Elevated creatinine kinase (CK-MB)"
      ]
    },
    medications: [{
      name: "Metoprolol",
      type: "Beta-1 selective adrenergic blocker",
      action: "Reduces heart rate, blood pressure, and myocardial oxygen demand by blocking beta-1 receptors",
      sideEffects: "Bradycardia, hypotension, fatigue, bronchospasm in susceptible patients",
      contra: "Severe bradycardia, heart block greater than first degree, cardiogenic shock, decompensated HF",
      pearl: "Hold if HR <60 or SBP <100; do not abruptly discontinue — taper gradually to avoid rebound tachycardia"
    }],
    pearls: [
      "Early recognition and timely reporting of changes in patient condition are fundamental RPN/LVN responsibilities that directly impact patient outcomes",
      "Accurate documentation of assessment findings, interventions, and patient responses provides essential continuity of care information",
      "Patient and family education should be reinforced at every opportunity using teach-back method to verify understanding"
    ],
    quiz: [
      {
        question: "The RPN/LVN is monitoring a patient with heart sounds. Which finding should be reported to the registered nurse immediately?",
        options: ["Stable vital signs within normal range","Sudden onset of chest pain with diaphoresis","Patient requesting a meal tray","Scheduled medication due in 30 minutes"],
        correct: 1,
        rationale: "Sudden onset of chest pain with diaphoresis suggests acute cardiac compromise and requires immediate escalation. This finding indicates potential myocardial ischemia or other cardiac emergency requiring urgent evaluation and intervention."
      },
      {
        question: "When caring for a patient with heart sounds, which nursing intervention is within the RPN/LVN scope of practice?",
        options: ["Independent medication dose adjustment","Monitoring vital signs and documenting findings","Interpreting ECG rhythms independently","Ordering diagnostic tests"],
        correct: 1,
        rationale: "Monitoring vital signs and documenting findings is within the RPN/LVN scope. Medication dose adjustments, independent ECG interpretation, and ordering diagnostic tests are outside the practical nurse's scope and require delegation from an RN or physician."
      }
    ]
  },
  "hyperkalemia-vs-hypokalemia-ecg-changes-and-rpn": {
    title: "Hyperkalemia vs Hypokalemia - ECG Changes & Cellular Physiology",
    cellular: {
      title: "Hyperkalemia vs Hypokalemia - ECG Changes & Cellular Physiology: Pathophysiology and Clinical Foundations",
      content: "Potassium is the primary intracellular cation critical for maintaining cardiac electrical stability. Normal serum potassium ranges from 3.5-5.0 mEq/L. Hyperkalemia (>5.0 mEq/L) causes decreased resting membrane potential, leading to initial increased excitability followed by decreased conduction velocity. ECG changes progress from peaked T waves to widened QRS to sine wave pattern and cardiac arrest. Hypokalemia (<3.5 mEq/L) hyperpolarizes the cell membrane, causing flattened T waves, U wave appearance, ST depression, and increased risk of torsades de pointes.\n\nCardiovascular complications can rapidly progress to hemodynamic instability and organ failure. The RPN/LVN must monitor vital signs frequently, recognize early signs of decompensation such as changes in heart rate, blood pressure, and peripheral perfusion, and escalate concerns promptly. Electrocardiographic changes may provide early warning of cardiac compromise before clinical symptoms become apparent.\n\nWithin the RPN/LVN scope of practice, nursing care for hyperkalemia vs hypokalemia - ecg changes & cellular physiology includes systematic assessment, implementation of established care protocols, accurate documentation, and timely communication with the interprofessional team. The practical nurse contributes to patient safety through ongoing monitoring, patient education reinforcement, and adherence to evidence-based practice standards. Understanding the underlying pathophysiology enables the practical nurse to anticipate potential complications and respond appropriately within their scope."
    },
    riskFactors: [
      "Hypertension and uncontrolled blood pressure elevating cardiac workload",
      "Coronary artery disease and history of previous cardiac events",
      "Diabetes mellitus contributing to accelerated atherosclerosis",
      "Dyslipidemia with elevated LDL and reduced HDL cholesterol",
      "Obesity (BMI >30) increasing cardiovascular strain and metabolic demands"
    ],
    diagnostics: [
      "12-lead ECG and continuous cardiac monitoring for rhythm and ST-segment changes",
      "Troponin I/T levels (serial measurements at 0, 3, and 6 hours)",
      "Echocardiography assessing chamber size, wall motion, and valve function",
      "BNP/NT-proBNP levels for heart failure evaluation"
    ],
    management: [
      "Hemodynamic monitoring and optimization of cardiac output",
      "Pharmacological management with cardioprotective medications as ordered",
      "Activity restriction and progressive mobilization based on cardiac status",
      "Dietary modifications including sodium and fluid restrictions as indicated"
    ],
    nursingActions: [
      "Perform systematic assessment specific to hyperkalemia vs hypokalemia - ecg changes & cellular physiology with accurate documentation of all findings",
      "Monitor vital signs and condition-specific parameters at prescribed intervals, reporting changes to the registered nurse or physician",
      "Implement prescribed interventions within RPN/LVN scope of practice and evaluate patient response",
      "Provide patient and family education reinforcement regarding condition management, medications, and when to seek medical attention",
      "Maintain accurate intake and output records and document all nursing interventions and patient responses"
    ],
    assessmentFindings: [
      "Altered heart rate or rhythm detected on auscultation or cardiac monitoring",
      "Blood pressure changes including hypertension, hypotension, or orthostatic changes",
      "Peripheral edema, jugular venous distension, or signs of fluid overload",
      "Chest pain or discomfort with associated diaphoresis or dyspnea"
    ],
    signs: {
      left: [
        "Tachycardia or bradycardia with irregular pulse",
        "Hypotension or hypertension with orthostatic changes",
        "Peripheral edema and jugular venous distension",
        "Chest pain, dyspnea on exertion, and fatigue"
      ],
      right: [
        "Elevated troponin or BNP/NT-proBNP levels",
        "ECG changes (ST elevation/depression, arrhythmias)",
        "Abnormal echocardiographic findings",
        "Elevated creatinine kinase (CK-MB)"
      ]
    },
    medications: [{
      name: "Metoprolol",
      type: "Beta-1 selective adrenergic blocker",
      action: "Reduces heart rate, blood pressure, and myocardial oxygen demand by blocking beta-1 receptors",
      sideEffects: "Bradycardia, hypotension, fatigue, bronchospasm in susceptible patients",
      contra: "Severe bradycardia, heart block greater than first degree, cardiogenic shock, decompensated HF",
      pearl: "Hold if HR <60 or SBP <100; do not abruptly discontinue — taper gradually to avoid rebound tachycardia"
    }],
    pearls: [
      "Early recognition and timely reporting of changes in patient condition are fundamental RPN/LVN responsibilities that directly impact patient outcomes",
      "Accurate documentation of assessment findings, interventions, and patient responses provides essential continuity of care information",
      "Patient and family education should be reinforced at every opportunity using teach-back method to verify understanding"
    ],
    quiz: [
      {
        question: "The RPN/LVN is monitoring a patient with hyperkalemia vs hypokalemia - ecg changes & cellular physiology. Which finding should be reported to the registered nurse immediately?",
        options: ["Stable vital signs within normal range","Sudden onset of chest pain with diaphoresis","Patient requesting a meal tray","Scheduled medication due in 30 minutes"],
        correct: 1,
        rationale: "Sudden onset of chest pain with diaphoresis suggests acute cardiac compromise and requires immediate escalation. This finding indicates potential myocardial ischemia or other cardiac emergency requiring urgent evaluation and intervention."
      },
      {
        question: "When caring for a patient with hyperkalemia vs hypokalemia - ecg changes & cellular physiology, which nursing intervention is within the RPN/LVN scope of practice?",
        options: ["Independent medication dose adjustment","Monitoring vital signs and documenting findings","Interpreting ECG rhythms independently","Ordering diagnostic tests"],
        correct: 1,
        rationale: "Monitoring vital signs and documenting findings is within the RPN/LVN scope. Medication dose adjustments, independent ECG interpretation, and ordering diagnostic tests are outside the practical nurse's scope and require delegation from an RN or physician."
      }
    ]
  },
  "cardiovascular-system-basics-rpn-rpn": {
    title: "Cardiovascular System Basics (RPN)",
    cellular: {
      title: "Cardiovascular System Basics: Pathophysiology and Clinical Foundations",
      content: "The cardiovascular system consists of the heart, blood vessels, and blood, functioning as a closed-loop transport system. The heart is a four-chambered muscular pump divided into right and left sides. The right side receives deoxygenated blood from systemic circulation and pumps it to the lungs via the pulmonary artery. The left side receives oxygenated blood from the lungs and pumps it to systemic circulation via the aorta. Cardiac output (CO = HR × SV) is determined by heart rate, preload, afterload, and contractility. The coronary arteries supply the myocardium with oxygenated blood, with the left anterior descending artery being the most commonly occluded vessel in myocardial infarction.\n\nCardiovascular complications can rapidly progress to hemodynamic instability and organ failure. The RPN/LVN must monitor vital signs frequently, recognize early signs of decompensation such as changes in heart rate, blood pressure, and peripheral perfusion, and escalate concerns promptly. Electrocardiographic changes may provide early warning of cardiac compromise before clinical symptoms become apparent.\n\nWithin the RPN/LVN scope of practice, nursing care for cardiovascular system basics includes systematic assessment, implementation of established care protocols, accurate documentation, and timely communication with the interprofessional team. The practical nurse contributes to patient safety through ongoing monitoring, patient education reinforcement, and adherence to evidence-based practice standards. Understanding the underlying pathophysiology enables the practical nurse to anticipate potential complications and respond appropriately within their scope."
    },
    riskFactors: [
      "Hypertension and uncontrolled blood pressure elevating cardiac workload",
      "Coronary artery disease and history of previous cardiac events",
      "Diabetes mellitus contributing to accelerated atherosclerosis",
      "Dyslipidemia with elevated LDL and reduced HDL cholesterol",
      "Obesity (BMI >30) increasing cardiovascular strain and metabolic demands"
    ],
    diagnostics: [
      "12-lead ECG and continuous cardiac monitoring for rhythm and ST-segment changes",
      "Troponin I/T levels (serial measurements at 0, 3, and 6 hours)",
      "Echocardiography assessing chamber size, wall motion, and valve function",
      "BNP/NT-proBNP levels for heart failure evaluation"
    ],
    management: [
      "Hemodynamic monitoring and optimization of cardiac output",
      "Pharmacological management with cardioprotective medications as ordered",
      "Activity restriction and progressive mobilization based on cardiac status",
      "Dietary modifications including sodium and fluid restrictions as indicated"
    ],
    nursingActions: [
      "Perform systematic assessment specific to cardiovascular system basics with accurate documentation of all findings",
      "Monitor vital signs and condition-specific parameters at prescribed intervals, reporting changes to the registered nurse or physician",
      "Implement prescribed interventions within RPN/LVN scope of practice and evaluate patient response",
      "Provide patient and family education reinforcement regarding condition management, medications, and when to seek medical attention",
      "Maintain accurate intake and output records and document all nursing interventions and patient responses"
    ],
    assessmentFindings: [
      "Altered heart rate or rhythm detected on auscultation or cardiac monitoring",
      "Blood pressure changes including hypertension, hypotension, or orthostatic changes",
      "Peripheral edema, jugular venous distension, or signs of fluid overload",
      "Chest pain or discomfort with associated diaphoresis or dyspnea"
    ],
    signs: {
      left: [
        "Tachycardia or bradycardia with irregular pulse",
        "Hypotension or hypertension with orthostatic changes",
        "Peripheral edema and jugular venous distension",
        "Chest pain, dyspnea on exertion, and fatigue"
      ],
      right: [
        "Elevated troponin or BNP/NT-proBNP levels",
        "ECG changes (ST elevation/depression, arrhythmias)",
        "Abnormal echocardiographic findings",
        "Elevated creatinine kinase (CK-MB)"
      ]
    },
    medications: [{
      name: "Metoprolol",
      type: "Beta-1 selective adrenergic blocker",
      action: "Reduces heart rate, blood pressure, and myocardial oxygen demand by blocking beta-1 receptors",
      sideEffects: "Bradycardia, hypotension, fatigue, bronchospasm in susceptible patients",
      contra: "Severe bradycardia, heart block greater than first degree, cardiogenic shock, decompensated HF",
      pearl: "Hold if HR <60 or SBP <100; do not abruptly discontinue — taper gradually to avoid rebound tachycardia"
    }],
    pearls: [
      "Early recognition and timely reporting of changes in patient condition are fundamental RPN/LVN responsibilities that directly impact patient outcomes",
      "Accurate documentation of assessment findings, interventions, and patient responses provides essential continuity of care information",
      "Patient and family education should be reinforced at every opportunity using teach-back method to verify understanding"
    ],
    quiz: [
      {
        question: "The RPN/LVN is monitoring a patient with cardiovascular system basics. Which finding should be reported to the registered nurse immediately?",
        options: ["Stable vital signs within normal range","Sudden onset of chest pain with diaphoresis","Patient requesting a meal tray","Scheduled medication due in 30 minutes"],
        correct: 1,
        rationale: "Sudden onset of chest pain with diaphoresis suggests acute cardiac compromise and requires immediate escalation. This finding indicates potential myocardial ischemia or other cardiac emergency requiring urgent evaluation and intervention."
      },
      {
        question: "When caring for a patient with cardiovascular system basics, which nursing intervention is within the RPN/LVN scope of practice?",
        options: ["Independent medication dose adjustment","Monitoring vital signs and documenting findings","Interpreting ECG rhythms independently","Ordering diagnostic tests"],
        correct: 1,
        rationale: "Monitoring vital signs and documenting findings is within the RPN/LVN scope. Medication dose adjustments, independent ECG interpretation, and ordering diagnostic tests are outside the practical nurse's scope and require delegation from an RN or physician."
      }
    ]
  },
  "hypovolemic-shock-basics-for-practical-nurses-rpn": {
    title: "Hypovolemic Shock Basics for Practical Nurses",
    cellular: {
      title: "Hypovolemic Shock Basics: Pathophysiology and Clinical Foundations",
      content: "Hypovolemic shock results from a significant reduction in intravascular volume (typically >15-20% blood volume loss), leading to inadequate tissue perfusion and cellular hypoxia. The body compensates through sympathetic nervous system activation, causing tachycardia, peripheral vasoconstriction, and increased contractility. As compensation fails, cellular metabolism shifts from aerobic to anaerobic, producing lactic acid. Stage progression includes compensated (tachycardia, normal BP), progressive (hypotension, oliguria, altered mentation), and irreversible (multiorgan failure) stages. Common causes include hemorrhage, severe dehydration, burns, and third-spacing of fluids.\n\nClinical significance for the RPN/LVN includes early recognition of abnormal findings through systematic assessment, understanding normal versus abnormal parameters, and knowing when to escalate concerns to the registered nurse or physician. The practical nurse plays a vital role in ongoing monitoring, data collection, and implementing delegated care activities. Timely recognition of changes in patient condition directly impacts outcomes and patient safety.\n\nWithin the RPN/LVN scope of practice, nursing care for hypovolemic shock basics includes systematic assessment, implementation of established care protocols, accurate documentation, and timely communication with the interprofessional team. The practical nurse contributes to patient safety through ongoing monitoring, patient education reinforcement, and adherence to evidence-based practice standards. Understanding the underlying pathophysiology enables the practical nurse to anticipate potential complications and respond appropriately within their scope."
    },
    riskFactors: [
      "Hypertension and uncontrolled blood pressure elevating cardiac workload",
      "Coronary artery disease and history of previous cardiac events",
      "Diabetes mellitus contributing to accelerated atherosclerosis",
      "Dyslipidemia with elevated LDL and reduced HDL cholesterol",
      "Obesity (BMI >30) increasing cardiovascular strain and metabolic demands"
    ],
    diagnostics: [
      "12-lead ECG and continuous cardiac monitoring for rhythm and ST-segment changes",
      "Troponin I/T levels (serial measurements at 0, 3, and 6 hours)",
      "Echocardiography assessing chamber size, wall motion, and valve function",
      "BNP/NT-proBNP levels for heart failure evaluation"
    ],
    management: [
      "Hemodynamic monitoring and optimization of cardiac output",
      "Pharmacological management with cardioprotective medications as ordered",
      "Activity restriction and progressive mobilization based on cardiac status",
      "Dietary modifications including sodium and fluid restrictions as indicated"
    ],
    nursingActions: [
      "Perform systematic assessment specific to hypovolemic shock basics with accurate documentation of all findings",
      "Monitor vital signs and condition-specific parameters at prescribed intervals, reporting changes to the registered nurse or physician",
      "Implement prescribed interventions within RPN/LVN scope of practice and evaluate patient response",
      "Provide patient and family education reinforcement regarding condition management, medications, and when to seek medical attention",
      "Maintain accurate intake and output records and document all nursing interventions and patient responses"
    ],
    assessmentFindings: [
      "Altered heart rate or rhythm detected on auscultation or cardiac monitoring",
      "Blood pressure changes including hypertension, hypotension, or orthostatic changes",
      "Peripheral edema, jugular venous distension, or signs of fluid overload",
      "Chest pain or discomfort with associated diaphoresis or dyspnea"
    ],
    signs: {
      left: [
        "Tachycardia or bradycardia with irregular pulse",
        "Hypotension or hypertension with orthostatic changes",
        "Peripheral edema and jugular venous distension",
        "Chest pain, dyspnea on exertion, and fatigue"
      ],
      right: [
        "Elevated troponin or BNP/NT-proBNP levels",
        "ECG changes (ST elevation/depression, arrhythmias)",
        "Abnormal echocardiographic findings",
        "Elevated creatinine kinase (CK-MB)"
      ]
    },
    medications: [{
      name: "Metoprolol",
      type: "Beta-1 selective adrenergic blocker",
      action: "Reduces heart rate, blood pressure, and myocardial oxygen demand by blocking beta-1 receptors",
      sideEffects: "Bradycardia, hypotension, fatigue, bronchospasm in susceptible patients",
      contra: "Severe bradycardia, heart block greater than first degree, cardiogenic shock, decompensated HF",
      pearl: "Hold if HR <60 or SBP <100; do not abruptly discontinue — taper gradually to avoid rebound tachycardia"
    }],
    pearls: [
      "Early recognition and timely reporting of changes in patient condition are fundamental RPN/LVN responsibilities that directly impact patient outcomes",
      "Accurate documentation of assessment findings, interventions, and patient responses provides essential continuity of care information",
      "Patient and family education should be reinforced at every opportunity using teach-back method to verify understanding"
    ],
    quiz: [
      {
        question: "The RPN/LVN is monitoring a patient with hypovolemic shock basics. Which finding should be reported to the registered nurse immediately?",
        options: ["Stable vital signs within normal range","Sudden onset of chest pain with diaphoresis","Patient requesting a meal tray","Scheduled medication due in 30 minutes"],
        correct: 1,
        rationale: "Sudden onset of chest pain with diaphoresis suggests acute cardiac compromise and requires immediate escalation. This finding indicates potential myocardial ischemia or other cardiac emergency requiring urgent evaluation and intervention."
      },
      {
        question: "When caring for a patient with hypovolemic shock basics, which nursing intervention is within the RPN/LVN scope of practice?",
        options: ["Independent medication dose adjustment","Monitoring vital signs and documenting findings","Interpreting ECG rhythms independently","Ordering diagnostic tests"],
        correct: 1,
        rationale: "Monitoring vital signs and documenting findings is within the RPN/LVN scope. Medication dose adjustments, independent ECG interpretation, and ordering diagnostic tests are outside the practical nurse's scope and require delegation from an RN or physician."
      }
    ]
  },
  "marfan-syndrome-2-rpn": {
    title: "Marfan Syndrome",
    cellular: {
      title: "Marfan Syndrome: Pathophysiology and Clinical Foundations",
      content: "Marfan syndrome is an autosomal dominant connective tissue disorder caused by mutations in the FBN1 gene encoding fibrillin-1, a glycoprotein essential for elastic fiber formation. Defective fibrillin-1 leads to weakened connective tissue throughout the body, particularly affecting the cardiovascular system (aortic root dilation, mitral valve prolapse), skeletal system (tall stature, arachnodactyly, pectus deformities), and ocular system (lens subluxation). The most life-threatening complication is aortic root aneurysm and dissection due to cystic medial necrosis of the aortic wall. Regular echocardiographic monitoring is essential for early detection of aortic dilation.\n\nCardiovascular complications can rapidly progress to hemodynamic instability and organ failure. The RPN/LVN must monitor vital signs frequently, recognize early signs of decompensation such as changes in heart rate, blood pressure, and peripheral perfusion, and escalate concerns promptly. Electrocardiographic changes may provide early warning of cardiac compromise before clinical symptoms become apparent.\n\nWithin the RPN/LVN scope of practice, nursing care for marfan syndrome includes systematic assessment, implementation of established care protocols, accurate documentation, and timely communication with the interprofessional team. The practical nurse contributes to patient safety through ongoing monitoring, patient education reinforcement, and adherence to evidence-based practice standards. Understanding the underlying pathophysiology enables the practical nurse to anticipate potential complications and respond appropriately within their scope."
    },
    riskFactors: [
      "Hypertension and uncontrolled blood pressure elevating cardiac workload",
      "Coronary artery disease and history of previous cardiac events",
      "Diabetes mellitus contributing to accelerated atherosclerosis",
      "Dyslipidemia with elevated LDL and reduced HDL cholesterol",
      "Obesity (BMI >30) increasing cardiovascular strain and metabolic demands"
    ],
    diagnostics: [
      "12-lead ECG and continuous cardiac monitoring for rhythm and ST-segment changes",
      "Troponin I/T levels (serial measurements at 0, 3, and 6 hours)",
      "Echocardiography assessing chamber size, wall motion, and valve function",
      "BNP/NT-proBNP levels for heart failure evaluation"
    ],
    management: [
      "Hemodynamic monitoring and optimization of cardiac output",
      "Pharmacological management with cardioprotective medications as ordered",
      "Activity restriction and progressive mobilization based on cardiac status",
      "Dietary modifications including sodium and fluid restrictions as indicated"
    ],
    nursingActions: [
      "Perform systematic assessment specific to marfan syndrome with accurate documentation of all findings",
      "Monitor vital signs and condition-specific parameters at prescribed intervals, reporting changes to the registered nurse or physician",
      "Implement prescribed interventions within RPN/LVN scope of practice and evaluate patient response",
      "Provide patient and family education reinforcement regarding condition management, medications, and when to seek medical attention",
      "Maintain accurate intake and output records and document all nursing interventions and patient responses"
    ],
    assessmentFindings: [
      "Altered heart rate or rhythm detected on auscultation or cardiac monitoring",
      "Blood pressure changes including hypertension, hypotension, or orthostatic changes",
      "Peripheral edema, jugular venous distension, or signs of fluid overload",
      "Chest pain or discomfort with associated diaphoresis or dyspnea"
    ],
    signs: {
      left: [
        "Tachycardia or bradycardia with irregular pulse",
        "Hypotension or hypertension with orthostatic changes",
        "Peripheral edema and jugular venous distension",
        "Chest pain, dyspnea on exertion, and fatigue"
      ],
      right: [
        "Elevated troponin or BNP/NT-proBNP levels",
        "ECG changes (ST elevation/depression, arrhythmias)",
        "Abnormal echocardiographic findings",
        "Elevated creatinine kinase (CK-MB)"
      ]
    },
    medications: [{
      name: "Metoprolol",
      type: "Beta-1 selective adrenergic blocker",
      action: "Reduces heart rate, blood pressure, and myocardial oxygen demand by blocking beta-1 receptors",
      sideEffects: "Bradycardia, hypotension, fatigue, bronchospasm in susceptible patients",
      contra: "Severe bradycardia, heart block greater than first degree, cardiogenic shock, decompensated HF",
      pearl: "Hold if HR <60 or SBP <100; do not abruptly discontinue — taper gradually to avoid rebound tachycardia"
    }],
    pearls: [
      "Early recognition and timely reporting of changes in patient condition are fundamental RPN/LVN responsibilities that directly impact patient outcomes",
      "Accurate documentation of assessment findings, interventions, and patient responses provides essential continuity of care information",
      "Patient and family education should be reinforced at every opportunity using teach-back method to verify understanding"
    ],
    quiz: [
      {
        question: "The RPN/LVN is monitoring a patient with marfan syndrome. Which finding should be reported to the registered nurse immediately?",
        options: ["Stable vital signs within normal range","Sudden onset of chest pain with diaphoresis","Patient requesting a meal tray","Scheduled medication due in 30 minutes"],
        correct: 1,
        rationale: "Sudden onset of chest pain with diaphoresis suggests acute cardiac compromise and requires immediate escalation. This finding indicates potential myocardial ischemia or other cardiac emergency requiring urgent evaluation and intervention."
      },
      {
        question: "When caring for a patient with marfan syndrome, which nursing intervention is within the RPN/LVN scope of practice?",
        options: ["Independent medication dose adjustment","Monitoring vital signs and documenting findings","Interpreting ECG rhythms independently","Ordering diagnostic tests"],
        correct: 1,
        rationale: "Monitoring vital signs and documenting findings is within the RPN/LVN scope. Medication dose adjustments, independent ECG interpretation, and ordering diagnostic tests are outside the practical nurse's scope and require delegation from an RN or physician."
      }
    ]
  },
  "bronchopulmonary-dysplasia-rpnlvn-rpn": {
    title: "Bronchopulmonary Dysplasia (RPN/LVN)",
    cellular: {
      title: "Bronchopulmonary Dysplasia: Pathophysiology and Clinical Foundations",
      content: "Bronchopulmonary Dysplasia involves pathological changes at the cellular and tissue level that produce characteristic clinical manifestations. The underlying pathophysiology includes disruption of normal physiological processes, leading to altered cellular function, inflammatory responses, and potential tissue damage. Understanding these mechanisms is essential for the RPN/LVN to recognize early signs of deterioration, implement timely nursing interventions, and communicate findings effectively to the healthcare team. The condition may progress through predictable stages, each with distinct clinical features that guide assessment priorities and nursing care planning.\n\nRespiratory compromise can deteriorate rapidly, making timely assessment and intervention critical. The RPN/LVN monitors respiratory rate, depth, pattern, oxygen saturation, and breath sounds. Early recognition of respiratory distress signs—accessory muscle use, nasal flaring, intercostal retractions, and declining SpO2—enables prompt escalation and intervention to prevent respiratory failure.\n\nWithin the RPN/LVN scope of practice, nursing care for bronchopulmonary dysplasia includes systematic assessment, implementation of established care protocols, accurate documentation, and timely communication with the interprofessional team. The practical nurse contributes to patient safety through ongoing monitoring, patient education reinforcement, and adherence to evidence-based practice standards. Understanding the underlying pathophysiology enables the practical nurse to anticipate potential complications and respond appropriately within their scope."
    },
    riskFactors: [
      "Current or former tobacco smoking causing airway damage and inflammation",
      "Occupational exposure to respiratory irritants, dust, or chemical fumes",
      "History of chronic respiratory conditions such as asthma or COPD",
      "Immunosuppression from disease or medication increasing infection susceptibility",
      "Advanced age with decreased respiratory reserve and mucociliary clearance"
    ],
    diagnostics: [
      "Chest X-ray (PA and lateral) for pulmonary infiltrates and effusions",
      "Arterial blood gas (ABG) analysis for oxygenation and acid-base status",
      "Pulse oximetry for continuous SpO2 monitoring",
      "Pulmonary function tests (PFTs) including FEV1 and FVC measurements"
    ],
    management: [
      "Oxygen therapy titrated to maintain target SpO2 (typically 92-96%)",
      "Bronchodilator therapy and airway clearance techniques as prescribed",
      "Positioning (high Fowler's or tripod) to optimize respiratory mechanics",
      "Infection control measures and antimicrobial therapy when indicated"
    ],
    nursingActions: [
      "Perform systematic assessment specific to bronchopulmonary dysplasia with accurate documentation of all findings",
      "Monitor vital signs and condition-specific parameters at prescribed intervals, reporting changes to the registered nurse or physician",
      "Implement prescribed interventions within RPN/LVN scope of practice and evaluate patient response",
      "Provide patient and family education reinforcement regarding condition management, medications, and when to seek medical attention",
      "Maintain accurate intake and output records and document all nursing interventions and patient responses"
    ],
    assessmentFindings: [
      "Abnormal breath sounds including crackles, wheezes, rhonchi, or diminished sounds",
      "Altered respiratory rate, depth, or pattern with accessory muscle use",
      "Decreased oxygen saturation (SpO2) below target range",
      "Cough characteristics including frequency, productivity, and sputum description"
    ],
    signs: {
      left: [
        "Dyspnea, tachypnea, and use of accessory muscles",
        "Cyanosis or decreased SpO2 (<92%)",
        "Abnormal breath sounds on auscultation",
        "Productive or nonproductive cough"
      ],
      right: [
        "Abnormal chest X-ray findings (infiltrates, effusion)",
        "ABG showing hypoxemia or hypercarbia",
        "Elevated WBC count suggesting infection",
        "Abnormal pulmonary function test results"
      ]
    },
    medications: [{
      name: "Albuterol (Salbutamol)",
      type: "Short-acting beta-2 agonist bronchodilator",
      action: "Relaxes bronchial smooth muscle via beta-2 receptor stimulation, relieving bronchospasm",
      sideEffects: "Tachycardia, tremor, hypokalemia, nervousness, palpitations",
      contra: "Known hypersensitivity; use caution in patients with cardiac arrhythmias or hypokalemia",
      pearl: "Shake MDI well before use; wait 1 minute between puffs; rinse mouth after corticosteroid inhalers to prevent thrush"
    }],
    pearls: [
      "Early recognition and timely reporting of changes in patient condition are fundamental RPN/LVN responsibilities that directly impact patient outcomes",
      "Accurate documentation of assessment findings, interventions, and patient responses provides essential continuity of care information",
      "Patient and family education should be reinforced at every opportunity using teach-back method to verify understanding"
    ],
    quiz: [
      {
        question: "A patient with bronchopulmonary dysplasia develops increased respiratory distress. What should the RPN/LVN do first?",
        options: ["Administer a bronchodilator independently","Assess SpO2 and respiratory rate, then notify the RN","Transfer the patient to ICU","Increase the oxygen flow rate to maximum"],
        correct: 1,
        rationale: "The RPN/LVN should first assess the patient's current status (SpO2, respiratory rate, breath sounds) and then notify the registered nurse with objective findings. Administering medications independently or making transfer decisions are outside the RPN/LVN scope."
      },
      {
        question: "Which assessment finding in a patient with bronchopulmonary dysplasia indicates effective treatment?",
        options: ["Respiratory rate decreasing from 28 to 16 breaths/minute","Increasing use of accessory muscles","SpO2 declining from 96% to 89%","New onset of cyanosis around the lips"],
        correct: 0,
        rationale: "A respiratory rate normalizing from 28 to 16 indicates improved respiratory function and effective treatment. Increased accessory muscle use, declining SpO2, and cyanosis all indicate worsening respiratory status requiring escalation."
      }
    ]
  },
  "chest-tube-basics-rpnlvn-rpn": {
    title: "Chest Tube Basics (RPN/LVN)",
    cellular: {
      title: "Chest Tube Basics: Pathophysiology and Clinical Foundations",
      content: "Chest Tube Basics encompasses the fundamental anatomical, physiological, and pathological principles essential for practical nursing assessment and care delivery. Understanding the underlying mechanisms of disease within this system enables the RPN/LVN to recognize early clinical changes, anticipate complications, and implement appropriate nursing interventions within their scope of practice. The cellular and tissue-level changes that occur in pathological states directly influence the signs and symptoms that nurses observe at the bedside, making foundational knowledge critical for safe patient care.\n\nRespiratory compromise can deteriorate rapidly, making timely assessment and intervention critical. The RPN/LVN monitors respiratory rate, depth, pattern, oxygen saturation, and breath sounds. Early recognition of respiratory distress signs—accessory muscle use, nasal flaring, intercostal retractions, and declining SpO2—enables prompt escalation and intervention to prevent respiratory failure.\n\nWithin the RPN/LVN scope of practice, nursing care for chest tube basics includes systematic assessment, implementation of established care protocols, accurate documentation, and timely communication with the interprofessional team. The practical nurse contributes to patient safety through ongoing monitoring, patient education reinforcement, and adherence to evidence-based practice standards. Understanding the underlying pathophysiology enables the practical nurse to anticipate potential complications and respond appropriately within their scope."
    },
    riskFactors: [
      "Current or former tobacco smoking causing airway damage and inflammation",
      "Occupational exposure to respiratory irritants, dust, or chemical fumes",
      "History of chronic respiratory conditions such as asthma or COPD",
      "Immunosuppression from disease or medication increasing infection susceptibility",
      "Advanced age with decreased respiratory reserve and mucociliary clearance"
    ],
    diagnostics: [
      "Chest X-ray (PA and lateral) for pulmonary infiltrates and effusions",
      "Arterial blood gas (ABG) analysis for oxygenation and acid-base status",
      "Pulse oximetry for continuous SpO2 monitoring",
      "Pulmonary function tests (PFTs) including FEV1 and FVC measurements"
    ],
    management: [
      "Oxygen therapy titrated to maintain target SpO2 (typically 92-96%)",
      "Bronchodilator therapy and airway clearance techniques as prescribed",
      "Positioning (high Fowler's or tripod) to optimize respiratory mechanics",
      "Infection control measures and antimicrobial therapy when indicated"
    ],
    nursingActions: [
      "Perform systematic assessment specific to chest tube basics with accurate documentation of all findings",
      "Monitor vital signs and condition-specific parameters at prescribed intervals, reporting changes to the registered nurse or physician",
      "Implement prescribed interventions within RPN/LVN scope of practice and evaluate patient response",
      "Provide patient and family education reinforcement regarding condition management, medications, and when to seek medical attention",
      "Maintain accurate intake and output records and document all nursing interventions and patient responses"
    ],
    assessmentFindings: [
      "Abnormal breath sounds including crackles, wheezes, rhonchi, or diminished sounds",
      "Altered respiratory rate, depth, or pattern with accessory muscle use",
      "Decreased oxygen saturation (SpO2) below target range",
      "Cough characteristics including frequency, productivity, and sputum description"
    ],
    signs: {
      left: [
        "Dyspnea, tachypnea, and use of accessory muscles",
        "Cyanosis or decreased SpO2 (<92%)",
        "Abnormal breath sounds on auscultation",
        "Productive or nonproductive cough"
      ],
      right: [
        "Abnormal chest X-ray findings (infiltrates, effusion)",
        "ABG showing hypoxemia or hypercarbia",
        "Elevated WBC count suggesting infection",
        "Abnormal pulmonary function test results"
      ]
    },
    medications: [{
      name: "Albuterol (Salbutamol)",
      type: "Short-acting beta-2 agonist bronchodilator",
      action: "Relaxes bronchial smooth muscle via beta-2 receptor stimulation, relieving bronchospasm",
      sideEffects: "Tachycardia, tremor, hypokalemia, nervousness, palpitations",
      contra: "Known hypersensitivity; use caution in patients with cardiac arrhythmias or hypokalemia",
      pearl: "Shake MDI well before use; wait 1 minute between puffs; rinse mouth after corticosteroid inhalers to prevent thrush"
    }],
    pearls: [
      "Early recognition and timely reporting of changes in patient condition are fundamental RPN/LVN responsibilities that directly impact patient outcomes",
      "Accurate documentation of assessment findings, interventions, and patient responses provides essential continuity of care information",
      "Patient and family education should be reinforced at every opportunity using teach-back method to verify understanding"
    ],
    quiz: [
      {
        question: "A patient with chest tube basics develops increased respiratory distress. What should the RPN/LVN do first?",
        options: ["Administer a bronchodilator independently","Assess SpO2 and respiratory rate, then notify the RN","Transfer the patient to ICU","Increase the oxygen flow rate to maximum"],
        correct: 1,
        rationale: "The RPN/LVN should first assess the patient's current status (SpO2, respiratory rate, breath sounds) and then notify the registered nurse with objective findings. Administering medications independently or making transfer decisions are outside the RPN/LVN scope."
      },
      {
        question: "Which assessment finding in a patient with chest tube basics indicates effective treatment?",
        options: ["Respiratory rate decreasing from 28 to 16 breaths/minute","Increasing use of accessory muscles","SpO2 declining from 96% to 89%","New onset of cyanosis around the lips"],
        correct: 0,
        rationale: "A respiratory rate normalizing from 28 to 16 indicates improved respiratory function and effective treatment. Increased accessory muscle use, declining SpO2, and cyanosis all indicate worsening respiratory status requiring escalation."
      }
    ]
  },
  "tracheostomy-care-rpnlvn-rpn": {
    title: "Tracheostomy Care (RPN/LVN)",
    cellular: {
      title: "Tracheostomy Care: Pathophysiology and Clinical Foundations",
      content: "Tracheostomy Care involves pathological changes at the cellular and tissue level that produce characteristic clinical manifestations. The underlying pathophysiology includes disruption of normal physiological processes, leading to altered cellular function, inflammatory responses, and potential tissue damage. Understanding these mechanisms is essential for the RPN/LVN to recognize early signs of deterioration, implement timely nursing interventions, and communicate findings effectively to the healthcare team. The condition may progress through predictable stages, each with distinct clinical features that guide assessment priorities and nursing care planning.\n\nRespiratory compromise can deteriorate rapidly, making timely assessment and intervention critical. The RPN/LVN monitors respiratory rate, depth, pattern, oxygen saturation, and breath sounds. Early recognition of respiratory distress signs—accessory muscle use, nasal flaring, intercostal retractions, and declining SpO2—enables prompt escalation and intervention to prevent respiratory failure.\n\nWithin the RPN/LVN scope of practice, nursing care for tracheostomy care includes systematic assessment, implementation of established care protocols, accurate documentation, and timely communication with the interprofessional team. The practical nurse contributes to patient safety through ongoing monitoring, patient education reinforcement, and adherence to evidence-based practice standards. Understanding the underlying pathophysiology enables the practical nurse to anticipate potential complications and respond appropriately within their scope."
    },
    riskFactors: [
      "Current or former tobacco smoking causing airway damage and inflammation",
      "Occupational exposure to respiratory irritants, dust, or chemical fumes",
      "History of chronic respiratory conditions such as asthma or COPD",
      "Immunosuppression from disease or medication increasing infection susceptibility",
      "Advanced age with decreased respiratory reserve and mucociliary clearance"
    ],
    diagnostics: [
      "Chest X-ray (PA and lateral) for pulmonary infiltrates and effusions",
      "Arterial blood gas (ABG) analysis for oxygenation and acid-base status",
      "Pulse oximetry for continuous SpO2 monitoring",
      "Pulmonary function tests (PFTs) including FEV1 and FVC measurements"
    ],
    management: [
      "Oxygen therapy titrated to maintain target SpO2 (typically 92-96%)",
      "Bronchodilator therapy and airway clearance techniques as prescribed",
      "Positioning (high Fowler's or tripod) to optimize respiratory mechanics",
      "Infection control measures and antimicrobial therapy when indicated"
    ],
    nursingActions: [
      "Perform systematic assessment specific to tracheostomy care with accurate documentation of all findings",
      "Monitor vital signs and condition-specific parameters at prescribed intervals, reporting changes to the registered nurse or physician",
      "Implement prescribed interventions within RPN/LVN scope of practice and evaluate patient response",
      "Provide patient and family education reinforcement regarding condition management, medications, and when to seek medical attention",
      "Maintain accurate intake and output records and document all nursing interventions and patient responses"
    ],
    assessmentFindings: [
      "Abnormal breath sounds including crackles, wheezes, rhonchi, or diminished sounds",
      "Altered respiratory rate, depth, or pattern with accessory muscle use",
      "Decreased oxygen saturation (SpO2) below target range",
      "Cough characteristics including frequency, productivity, and sputum description"
    ],
    signs: {
      left: [
        "Dyspnea, tachypnea, and use of accessory muscles",
        "Cyanosis or decreased SpO2 (<92%)",
        "Abnormal breath sounds on auscultation",
        "Productive or nonproductive cough"
      ],
      right: [
        "Abnormal chest X-ray findings (infiltrates, effusion)",
        "ABG showing hypoxemia or hypercarbia",
        "Elevated WBC count suggesting infection",
        "Abnormal pulmonary function test results"
      ]
    },
    medications: [{
      name: "Albuterol (Salbutamol)",
      type: "Short-acting beta-2 agonist bronchodilator",
      action: "Relaxes bronchial smooth muscle via beta-2 receptor stimulation, relieving bronchospasm",
      sideEffects: "Tachycardia, tremor, hypokalemia, nervousness, palpitations",
      contra: "Known hypersensitivity; use caution in patients with cardiac arrhythmias or hypokalemia",
      pearl: "Shake MDI well before use; wait 1 minute between puffs; rinse mouth after corticosteroid inhalers to prevent thrush"
    }],
    pearls: [
      "Early recognition and timely reporting of changes in patient condition are fundamental RPN/LVN responsibilities that directly impact patient outcomes",
      "Accurate documentation of assessment findings, interventions, and patient responses provides essential continuity of care information",
      "Patient and family education should be reinforced at every opportunity using teach-back method to verify understanding"
    ],
    quiz: [
      {
        question: "A patient with tracheostomy care develops increased respiratory distress. What should the RPN/LVN do first?",
        options: ["Administer a bronchodilator independently","Assess SpO2 and respiratory rate, then notify the RN","Transfer the patient to ICU","Increase the oxygen flow rate to maximum"],
        correct: 1,
        rationale: "The RPN/LVN should first assess the patient's current status (SpO2, respiratory rate, breath sounds) and then notify the registered nurse with objective findings. Administering medications independently or making transfer decisions are outside the RPN/LVN scope."
      },
      {
        question: "Which assessment finding in a patient with tracheostomy care indicates effective treatment?",
        options: ["Respiratory rate decreasing from 28 to 16 breaths/minute","Increasing use of accessory muscles","SpO2 declining from 96% to 89%","New onset of cyanosis around the lips"],
        correct: 0,
        rationale: "A respiratory rate normalizing from 28 to 16 indicates improved respiratory function and effective treatment. Increased accessory muscle use, declining SpO2, and cyanosis all indicate worsening respiratory status requiring escalation."
      }
    ]
  },
  "airway-suctioning-for-practical-nurses-rpn": {
    title: "Airway Suctioning for Practical Nurses",
    cellular: {
      title: "Airway Suctioning: Pathophysiology and Clinical Foundations",
      content: "Airway Suctioning involves pathological changes at the cellular and tissue level that produce characteristic clinical manifestations. The underlying pathophysiology includes disruption of normal physiological processes, leading to altered cellular function, inflammatory responses, and potential tissue damage. Understanding these mechanisms is essential for the RPN/LVN to recognize early signs of deterioration, implement timely nursing interventions, and communicate findings effectively to the healthcare team. The condition may progress through predictable stages, each with distinct clinical features that guide assessment priorities and nursing care planning.\n\nRespiratory compromise can deteriorate rapidly, making timely assessment and intervention critical. The RPN/LVN monitors respiratory rate, depth, pattern, oxygen saturation, and breath sounds. Early recognition of respiratory distress signs—accessory muscle use, nasal flaring, intercostal retractions, and declining SpO2—enables prompt escalation and intervention to prevent respiratory failure.\n\nWithin the RPN/LVN scope of practice, nursing care for airway suctioning includes systematic assessment, implementation of established care protocols, accurate documentation, and timely communication with the interprofessional team. The practical nurse contributes to patient safety through ongoing monitoring, patient education reinforcement, and adherence to evidence-based practice standards. Understanding the underlying pathophysiology enables the practical nurse to anticipate potential complications and respond appropriately within their scope."
    },
    riskFactors: [
      "Current or former tobacco smoking causing airway damage and inflammation",
      "Occupational exposure to respiratory irritants, dust, or chemical fumes",
      "History of chronic respiratory conditions such as asthma or COPD",
      "Immunosuppression from disease or medication increasing infection susceptibility",
      "Advanced age with decreased respiratory reserve and mucociliary clearance"
    ],
    diagnostics: [
      "Chest X-ray (PA and lateral) for pulmonary infiltrates and effusions",
      "Arterial blood gas (ABG) analysis for oxygenation and acid-base status",
      "Pulse oximetry for continuous SpO2 monitoring",
      "Pulmonary function tests (PFTs) including FEV1 and FVC measurements"
    ],
    management: [
      "Oxygen therapy titrated to maintain target SpO2 (typically 92-96%)",
      "Bronchodilator therapy and airway clearance techniques as prescribed",
      "Positioning (high Fowler's or tripod) to optimize respiratory mechanics",
      "Infection control measures and antimicrobial therapy when indicated"
    ],
    nursingActions: [
      "Perform systematic assessment specific to airway suctioning with accurate documentation of all findings",
      "Monitor vital signs and condition-specific parameters at prescribed intervals, reporting changes to the registered nurse or physician",
      "Implement prescribed interventions within RPN/LVN scope of practice and evaluate patient response",
      "Provide patient and family education reinforcement regarding condition management, medications, and when to seek medical attention",
      "Maintain accurate intake and output records and document all nursing interventions and patient responses"
    ],
    assessmentFindings: [
      "Abnormal breath sounds including crackles, wheezes, rhonchi, or diminished sounds",
      "Altered respiratory rate, depth, or pattern with accessory muscle use",
      "Decreased oxygen saturation (SpO2) below target range",
      "Cough characteristics including frequency, productivity, and sputum description"
    ],
    signs: {
      left: [
        "Dyspnea, tachypnea, and use of accessory muscles",
        "Cyanosis or decreased SpO2 (<92%)",
        "Abnormal breath sounds on auscultation",
        "Productive or nonproductive cough"
      ],
      right: [
        "Abnormal chest X-ray findings (infiltrates, effusion)",
        "ABG showing hypoxemia or hypercarbia",
        "Elevated WBC count suggesting infection",
        "Abnormal pulmonary function test results"
      ]
    },
    medications: [{
      name: "Albuterol (Salbutamol)",
      type: "Short-acting beta-2 agonist bronchodilator",
      action: "Relaxes bronchial smooth muscle via beta-2 receptor stimulation, relieving bronchospasm",
      sideEffects: "Tachycardia, tremor, hypokalemia, nervousness, palpitations",
      contra: "Known hypersensitivity; use caution in patients with cardiac arrhythmias or hypokalemia",
      pearl: "Shake MDI well before use; wait 1 minute between puffs; rinse mouth after corticosteroid inhalers to prevent thrush"
    }],
    pearls: [
      "Early recognition and timely reporting of changes in patient condition are fundamental RPN/LVN responsibilities that directly impact patient outcomes",
      "Accurate documentation of assessment findings, interventions, and patient responses provides essential continuity of care information",
      "Patient and family education should be reinforced at every opportunity using teach-back method to verify understanding"
    ],
    quiz: [
      {
        question: "A patient with airway suctioning develops increased respiratory distress. What should the RPN/LVN do first?",
        options: ["Administer a bronchodilator independently","Assess SpO2 and respiratory rate, then notify the RN","Transfer the patient to ICU","Increase the oxygen flow rate to maximum"],
        correct: 1,
        rationale: "The RPN/LVN should first assess the patient's current status (SpO2, respiratory rate, breath sounds) and then notify the registered nurse with objective findings. Administering medications independently or making transfer decisions are outside the RPN/LVN scope."
      },
      {
        question: "Which assessment finding in a patient with airway suctioning indicates effective treatment?",
        options: ["Respiratory rate decreasing from 28 to 16 breaths/minute","Increasing use of accessory muscles","SpO2 declining from 96% to 89%","New onset of cyanosis around the lips"],
        correct: 0,
        rationale: "A respiratory rate normalizing from 28 to 16 indicates improved respiratory function and effective treatment. Increased accessory muscle use, declining SpO2, and cyanosis all indicate worsening respiratory status requiring escalation."
      }
    ]
  },
  "lung-cancer-basics-rpnlvn-rpn": {
    title: "Lung Cancer Basics (RPN/LVN)",
    cellular: {
      title: "Lung Cancer Basics: Pathophysiology and Clinical Foundations",
      content: "Lung Cancer Basics encompasses the fundamental anatomical, physiological, and pathological principles essential for practical nursing assessment and care delivery. Understanding the underlying mechanisms of disease within this system enables the RPN/LVN to recognize early clinical changes, anticipate complications, and implement appropriate nursing interventions within their scope of practice. The cellular and tissue-level changes that occur in pathological states directly influence the signs and symptoms that nurses observe at the bedside, making foundational knowledge critical for safe patient care.\n\nRespiratory compromise can deteriorate rapidly, making timely assessment and intervention critical. The RPN/LVN monitors respiratory rate, depth, pattern, oxygen saturation, and breath sounds. Early recognition of respiratory distress signs—accessory muscle use, nasal flaring, intercostal retractions, and declining SpO2—enables prompt escalation and intervention to prevent respiratory failure.\n\nWithin the RPN/LVN scope of practice, nursing care for lung cancer basics includes systematic assessment, implementation of established care protocols, accurate documentation, and timely communication with the interprofessional team. The practical nurse contributes to patient safety through ongoing monitoring, patient education reinforcement, and adherence to evidence-based practice standards. Understanding the underlying pathophysiology enables the practical nurse to anticipate potential complications and respond appropriately within their scope."
    },
    riskFactors: [
      "Current or former tobacco smoking causing airway damage and inflammation",
      "Occupational exposure to respiratory irritants, dust, or chemical fumes",
      "History of chronic respiratory conditions such as asthma or COPD",
      "Immunosuppression from disease or medication increasing infection susceptibility",
      "Advanced age with decreased respiratory reserve and mucociliary clearance"
    ],
    diagnostics: [
      "Chest X-ray (PA and lateral) for pulmonary infiltrates and effusions",
      "Arterial blood gas (ABG) analysis for oxygenation and acid-base status",
      "Pulse oximetry for continuous SpO2 monitoring",
      "Pulmonary function tests (PFTs) including FEV1 and FVC measurements"
    ],
    management: [
      "Oxygen therapy titrated to maintain target SpO2 (typically 92-96%)",
      "Bronchodilator therapy and airway clearance techniques as prescribed",
      "Positioning (high Fowler's or tripod) to optimize respiratory mechanics",
      "Infection control measures and antimicrobial therapy when indicated"
    ],
    nursingActions: [
      "Perform systematic assessment specific to lung cancer basics with accurate documentation of all findings",
      "Monitor vital signs and condition-specific parameters at prescribed intervals, reporting changes to the registered nurse or physician",
      "Implement prescribed interventions within RPN/LVN scope of practice and evaluate patient response",
      "Provide patient and family education reinforcement regarding condition management, medications, and when to seek medical attention",
      "Maintain accurate intake and output records and document all nursing interventions and patient responses"
    ],
    assessmentFindings: [
      "Abnormal breath sounds including crackles, wheezes, rhonchi, or diminished sounds",
      "Altered respiratory rate, depth, or pattern with accessory muscle use",
      "Decreased oxygen saturation (SpO2) below target range",
      "Cough characteristics including frequency, productivity, and sputum description"
    ],
    signs: {
      left: [
        "Dyspnea, tachypnea, and use of accessory muscles",
        "Cyanosis or decreased SpO2 (<92%)",
        "Abnormal breath sounds on auscultation",
        "Productive or nonproductive cough"
      ],
      right: [
        "Abnormal chest X-ray findings (infiltrates, effusion)",
        "ABG showing hypoxemia or hypercarbia",
        "Elevated WBC count suggesting infection",
        "Abnormal pulmonary function test results"
      ]
    },
    medications: [{
      name: "Albuterol (Salbutamol)",
      type: "Short-acting beta-2 agonist bronchodilator",
      action: "Relaxes bronchial smooth muscle via beta-2 receptor stimulation, relieving bronchospasm",
      sideEffects: "Tachycardia, tremor, hypokalemia, nervousness, palpitations",
      contra: "Known hypersensitivity; use caution in patients with cardiac arrhythmias or hypokalemia",
      pearl: "Shake MDI well before use; wait 1 minute between puffs; rinse mouth after corticosteroid inhalers to prevent thrush"
    }],
    pearls: [
      "Early recognition and timely reporting of changes in patient condition are fundamental RPN/LVN responsibilities that directly impact patient outcomes",
      "Accurate documentation of assessment findings, interventions, and patient responses provides essential continuity of care information",
      "Patient and family education should be reinforced at every opportunity using teach-back method to verify understanding"
    ],
    quiz: [
      {
        question: "A patient with lung cancer basics develops increased respiratory distress. What should the RPN/LVN do first?",
        options: ["Administer a bronchodilator independently","Assess SpO2 and respiratory rate, then notify the RN","Transfer the patient to ICU","Increase the oxygen flow rate to maximum"],
        correct: 1,
        rationale: "The RPN/LVN should first assess the patient's current status (SpO2, respiratory rate, breath sounds) and then notify the registered nurse with objective findings. Administering medications independently or making transfer decisions are outside the RPN/LVN scope."
      },
      {
        question: "Which assessment finding in a patient with lung cancer basics indicates effective treatment?",
        options: ["Respiratory rate decreasing from 28 to 16 breaths/minute","Increasing use of accessory muscles","SpO2 declining from 96% to 89%","New onset of cyanosis around the lips"],
        correct: 0,
        rationale: "A respiratory rate normalizing from 28 to 16 indicates improved respiratory function and effective treatment. Increased accessory muscle use, declining SpO2, and cyanosis all indicate worsening respiratory status requiring escalation."
      }
    ]
  }
};
