export interface ClusterPage {
  slug: string;
  parentSlug: string;
  parentTitle: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  color: string;
  colorAccent: string;
  introduction: string;
  sections: { id: string; title: string; content: string }[];
  faqs: { question: string; answer: string }[];
  relatedClusterSlugs: string[];
  ctaPreviewSlug: string;
  ctaLessonsSlug: string;
}

export const ICU_CLUSTER_PAGES: ClusterPage[] = [
  {
    slug: "icu-ventilator-management",
    parentSlug: "icu-nursing-ultimate-guide",
    parentTitle: "ICU Nursing Ultimate Guide",
    title: "Ventilator Management for ICU Nurses",
    metaTitle: "Ventilator Management for ICU Nurses | Mechanical Ventilation Guide | NurseNest",
    metaDescription: "Complete ventilator management guide for ICU nurses covering ventilator modes, waveform interpretation, alarm troubleshooting, weaning protocols, and lung-protective ventilation strategies.",
    keywords: "ventilator management, mechanical ventilation, ICU nursing, ventilator modes, ventilator waveforms, weaning protocols, lung-protective ventilation, ARDS ventilation",
    color: "#DC2626",
    colorAccent: "#FEE2E2",
    introduction: "Mechanical ventilation is one of the most critical competencies for ICU nurses. Understanding ventilator modes, interpreting waveforms, troubleshooting alarms, and guiding the weaning process are essential for safe, effective patient care in the intensive care unit. This guide covers everything you need to know about ventilator management in the ICU setting.",
    sections: [
      {
        id: "ventilator-modes",
        title: "Understanding Ventilator Modes",
        content: "ICU nurses must be proficient in the major ventilator modes used in critical care. Volume-controlled ventilation (AC/VC) delivers a set tidal volume with each breath, making it ideal for patients who need guaranteed minute ventilation. Pressure-controlled ventilation (AC/PC) delivers breaths at a set pressure, offering the advantage of limiting peak airway pressures but with variable tidal volumes. SIMV (Synchronized Intermittent Mandatory Ventilation) allows spontaneous breathing between mandatory breaths and is sometimes used as a weaning mode. Pressure Support Ventilation (PSV) augments the patient's own spontaneous breaths with a set level of pressure support, commonly used during weaning trials. APRV (Airway Pressure Release Ventilation) maintains a sustained high pressure with brief releases, used in severe ARDS to improve oxygenation through sustained alveolar recruitment.\n\nMode selection depends on the clinical scenario: AC/VC is the default for most patients, AC/PC may be preferred when peak pressures are a concern, and PSV is the standard for spontaneous breathing trials. Understanding the relationship between set parameters and delivered breaths is fundamental to safe ventilator management."
      },
      {
        id: "waveform-interpretation",
        title: "Ventilator Waveform Interpretation",
        content: "Ventilator waveforms provide real-time visual feedback about patient-ventilator interaction and respiratory mechanics. The three primary waveforms are pressure-time, flow-time, and volume-time scalars. In volume-controlled ventilation, the flow waveform is typically square (constant flow), while the pressure waveform rises progressively. In pressure-controlled ventilation, the pressure waveform is square and the flow waveform has a decelerating pattern.\n\nKey findings on waveform analysis include: auto-PEEP (expiratory flow does not return to baseline before the next breath), patient-ventilator asynchrony (trigger asynchrony, flow asynchrony, or cycle asynchrony), and changes in respiratory mechanics (increased peak pressure with unchanged plateau pressure suggests airway resistance; increased plateau pressure suggests decreased compliance). Nurses should monitor waveforms continuously and report significant changes to the respiratory therapy team and physician."
      },
      {
        id: "alarm-troubleshooting",
        title: "Ventilator Alarm Troubleshooting",
        content: "High-pressure alarms are among the most common and potentially dangerous ventilator alarms. Causes include kinked or obstructed tubing, mucus plugging requiring suctioning, bronchospasm, patient biting the ETT, pneumothorax, or worsening compliance (ARDS, pulmonary edema). The nursing response follows a systematic approach: first assess the patient (not the machine), auscultate breath sounds, check ETT position and patency, suction if needed, and assess for pneumothorax.\n\nLow-pressure alarms indicate a circuit disconnection, cuff leak, or significant air leak. Apnea alarms trigger when no breath is detected within the set apnea interval. Volume alarms (high or low exhaled tidal volume) can indicate leak, circuit disconnection, or changes in patient effort. FiO2 alarms indicate oxygen blender malfunction. For any alarm that cannot be quickly resolved with the patient desaturating, disconnect the patient from the ventilator and provide manual bag-valve ventilation while troubleshooting."
      },
      {
        id: "lung-protective-ventilation",
        title: "Lung-Protective Ventilation Strategies",
        content: "Lung-protective ventilation is the evidence-based standard of care for mechanically ventilated patients, particularly those with ARDS. The ARDSNet protocol established the landmark principles: low tidal volume ventilation at 6 mL/kg ideal body weight (calculated from height, not actual weight), plateau pressure maintained below 30 cmH2O, and appropriate PEEP titration using the PEEP-FiO2 table.\n\nPEEP (Positive End-Expiratory Pressure) prevents alveolar collapse at end-expiration, improving oxygenation and preventing atelectrauma. Higher PEEP levels may be needed in severe ARDS but must be balanced against hemodynamic effects. Prone positioning for 12-16 hours per day in moderate-to-severe ARDS (PaO2/FiO2 < 150) has been shown to significantly reduce mortality. Nurses play a critical role in safe prone positioning, including securing the airway, protecting pressure points, and monitoring hemodynamics during turns."
      },
      {
        id: "weaning-protocols",
        title: "Weaning and Extubation Readiness",
        content: "Weaning from mechanical ventilation should be considered as early as clinically appropriate. Daily assessment of weaning readiness includes: improvement or resolution of the underlying cause of respiratory failure, adequate oxygenation (PaO2/FiO2 > 150 on PEEP ≤ 8 and FiO2 ≤ 50%), hemodynamic stability without high-dose vasopressors, ability to initiate spontaneous breaths, and adequate level of consciousness.\n\nThe Spontaneous Breathing Trial (SBT) is the gold standard for assessing extubation readiness. Common SBT methods include T-piece trial or low-level pressure support (PS 5-8 cmH2O with PEEP 5). The Rapid Shallow Breathing Index (RSBI = respiratory rate / tidal volume in liters) is calculated during the SBT, with values < 105 predicting successful extubation. SBT failure criteria include tachypnea, tachycardia, diaphoresis, use of accessory muscles, SpO2 < 90%, or patient distress. Post-extubation, nurses monitor for stridor, increased work of breathing, and reintubation within 48 hours."
      },
    ],
    faqs: [
      { question: "What are the most common ventilator modes used in the ICU?", answer: "The most common modes are Assist-Control Volume (AC/VC) for full support, Assist-Control Pressure (AC/PC) for pressure-limited ventilation, and Pressure Support Ventilation (PSV) for weaning. SIMV and APRV are used in specific clinical situations." },
      { question: "How do ICU nurses troubleshoot high-pressure ventilator alarms?", answer: "Nurses follow a systematic approach: assess the patient first (auscultate, check SpO2), check ETT patency and position, suction if secretions are suspected, assess for pneumothorax, and evaluate for bronchospasm or decreased lung compliance. If the alarm cannot be resolved quickly, provide manual bag ventilation." },
      { question: "What is the RSBI and how is it used in ventilator weaning?", answer: "The Rapid Shallow Breathing Index (RSBI) is calculated as respiratory rate divided by tidal volume in liters during a spontaneous breathing trial. An RSBI below 105 predicts successful extubation. It helps nurses and physicians determine readiness for ventilator liberation." },
      { question: "What is lung-protective ventilation?", answer: "Lung-protective ventilation uses low tidal volumes (6 mL/kg ideal body weight), maintains plateau pressures below 30 cmH2O, and applies appropriate PEEP to prevent alveolar collapse. This strategy reduces ventilator-induced lung injury and mortality in ARDS patients." },
    ],
    relatedClusterSlugs: ["icu-sepsis-nursing-interventions", "icu-hemodynamic-monitoring", "icu-medications-guide"],
    ctaPreviewSlug: "icu",
    ctaLessonsSlug: "icu",
  },
  {
    slug: "icu-sepsis-nursing-interventions",
    parentSlug: "icu-nursing-ultimate-guide",
    parentTitle: "ICU Nursing Ultimate Guide",
    title: "Sepsis Nursing Interventions in the ICU",
    metaTitle: "Sepsis Nursing Interventions in the ICU | Sepsis Management Guide | NurseNest",
    metaDescription: "Evidence-based sepsis nursing interventions for ICU nurses covering the Surviving Sepsis Campaign Hour-1 Bundle, vasopressor management, lactate monitoring, and septic shock care.",
    keywords: "sepsis nursing interventions, septic shock management, surviving sepsis campaign, sepsis bundle, ICU sepsis, vasopressor therapy, lactate monitoring, sepsis recognition",
    color: "#DC2626",
    colorAccent: "#FEE2E2",
    introduction: "Sepsis remains one of the leading causes of mortality in the ICU, making early recognition and aggressive intervention critical nursing priorities. This guide covers evidence-based sepsis nursing interventions, from initial recognition through the Surviving Sepsis Campaign Hour-1 Bundle to ongoing management of septic shock in the intensive care unit.",
    sections: [
      {
        id: "sepsis-recognition",
        title: "Early Sepsis Recognition and Screening",
        content: "Early sepsis recognition is the single most impactful nursing intervention for improving sepsis outcomes. Nurses should screen for sepsis using validated tools: the qSOFA score (altered mentation, systolic BP ≤ 100 mmHg, respiratory rate ≥ 22) for bedside screening and the SOFA score for definitive organ dysfunction assessment. SIRS criteria (temperature > 38°C or < 36°C, HR > 90, RR > 20 or PaCO2 < 32, WBC > 12,000 or < 4,000) remain useful for initial suspicion.\n\nNursing assessment triggers for sepsis screening include: new-onset confusion or altered mental status, fever or hypothermia with suspected infection source, unexplained tachycardia or hypotension, elevated lactate levels, decreased urine output, and new or worsening organ dysfunction. Time is tissue in sepsis — every hour of delay in antibiotic administration increases mortality by approximately 7.6%."
      },
      {
        id: "hour-1-bundle",
        title: "The Hour-1 Sepsis Bundle",
        content: "The Surviving Sepsis Campaign Hour-1 Bundle is designed to be initiated within 1 hour of sepsis recognition. Nursing responsibilities include: measuring serum lactate (remeasure within 2-4 hours if initial lactate > 2 mmol/L), obtaining blood cultures from at least two separate sites before antibiotic administration, administering broad-spectrum antibiotics within 1 hour of recognition, initiating rapid fluid resuscitation with 30 mL/kg crystalloid for hypotension or lactate ≥ 4 mmol/L, and applying vasopressors if hypotension persists during or after fluid resuscitation to maintain MAP ≥ 65 mmHg.\n\nNursing coordination is essential: simultaneously drawing blood cultures while hanging the first antibiotic, initiating a fluid bolus through a second IV access, and alerting the provider about the need for vasopressor access (central line placement). Documentation of bundle completion times is critical for quality metrics and patient outcomes."
      },
      {
        id: "vasopressor-management",
        title: "Vasopressor Management in Septic Shock",
        content: "When fluid resuscitation fails to restore adequate perfusion (MAP < 65 mmHg), vasopressor therapy is initiated. Norepinephrine is the first-line vasopressor in septic shock, titrated to achieve MAP ≥ 65 mmHg. Central venous access is strongly preferred for vasopressor administration to prevent tissue necrosis from extravasation, though peripheral administration of dilute norepinephrine through a large-bore proximal vein is acceptable as a bridge.\n\nVasopressin (0.03-0.04 units/min, fixed dose) is commonly added as a second agent to reduce norepinephrine requirements. Epinephrine may be added as a third-line agent when MAP targets are not met. Nursing responsibilities include continuous hemodynamic monitoring, frequent MAP assessment, monitoring for signs of end-organ perfusion (skin color, capillary refill, urine output, mental status), and titrating drips per institutional protocol. Document vasopressor doses, MAP trends, and clinical response at regular intervals."
      },
      {
        id: "lactate-monitoring",
        title: "Lactate-Guided Resuscitation",
        content: "Serial lactate measurement is a cornerstone of sepsis resuscitation monitoring. Elevated lactate (> 2 mmol/L) indicates tissue hypoperfusion and is associated with increased mortality. Lactate clearance (decrease of ≥ 20% over 2 hours) serves as a marker of adequate resuscitation and improving tissue perfusion.\n\nNursing responsibilities include: obtaining initial lactate at the time of sepsis recognition, remeasuring lactate every 2-4 hours until normalized, correlating lactate trends with clinical assessment (urine output, mental status, skin perfusion), and reporting failure to clear lactate (which may indicate ongoing tissue hypoperfusion requiring escalation of care). A rising lactate despite aggressive fluid and vasopressor therapy is an ominous sign requiring immediate provider notification and consideration of additional interventions such as stress-dose steroids or source control."
      },
      {
        id: "ongoing-assessment",
        title: "Ongoing Sepsis Nursing Assessment",
        content: "After initial resuscitation, ICU nurses continue vigilant monitoring for complications and response to therapy. Key ongoing assessments include: hourly urine output monitoring (target ≥ 0.5 mL/kg/hr), continuous hemodynamic monitoring with attention to MAP trends and vasopressor requirements, serial organ function labs (renal function, liver enzymes, coagulation studies, CBC), neurological assessment for septic encephalopathy, skin assessment for mottling and peripheral perfusion, and glucose monitoring (target 140-180 mg/dL in critically ill patients).\n\nAntibiotic stewardship is also a nursing consideration: ensuring timely re-dosing, monitoring drug levels (vancomycin troughs), and advocating for culture-directed de-escalation when sensitivities are available. Source control assessment — whether surgical drainage, device removal, or wound debridement is needed — should be an ongoing conversation with the medical team."
      },
    ],
    faqs: [
      { question: "What is the Hour-1 Sepsis Bundle?", answer: "The Hour-1 Bundle includes measuring serum lactate, obtaining blood cultures before antibiotics, administering broad-spectrum antibiotics within 1 hour, giving 30 mL/kg crystalloid for hypotension or lactate ≥ 4, and starting vasopressors if hypotension persists after fluids. All elements should be initiated within 1 hour of sepsis recognition." },
      { question: "What is the first-line vasopressor for septic shock?", answer: "Norepinephrine is the first-line vasopressor for septic shock, titrated to achieve a mean arterial pressure (MAP) of 65 mmHg or greater. Vasopressin is commonly added as a second agent, and epinephrine as a third-line option." },
      { question: "How often should lactate be monitored in sepsis?", answer: "Initial lactate should be measured at sepsis recognition. If the initial lactate is elevated (> 2 mmol/L), it should be remeasured every 2-4 hours until it normalizes. Lactate clearance of 20% or more over 2 hours indicates improving tissue perfusion." },
      { question: "What are the early signs of sepsis that nurses should recognize?", answer: "Early signs include altered mental status, fever or hypothermia, tachycardia, tachypnea, hypotension, decreased urine output, elevated lactate, and new or worsening organ dysfunction. Using screening tools like qSOFA helps with systematic early detection." },
    ],
    relatedClusterSlugs: ["icu-ventilator-management", "icu-hemodynamic-monitoring", "icu-medications-guide"],
    ctaPreviewSlug: "icu",
    ctaLessonsSlug: "icu",
  },
  {
    slug: "icu-hemodynamic-monitoring",
    parentSlug: "icu-nursing-ultimate-guide",
    parentTitle: "ICU Nursing Ultimate Guide",
    title: "Hemodynamic Monitoring for ICU Nurses",
    metaTitle: "Hemodynamic Monitoring for ICU Nurses | Arterial Lines, CVP & PA Catheters | NurseNest",
    metaDescription: "Comprehensive hemodynamic monitoring guide for ICU nurses covering arterial line management, CVP interpretation, pulmonary artery catheters, cardiac output monitoring, and clinical decision-making.",
    keywords: "hemodynamic monitoring, arterial line, CVP, pulmonary artery catheter, cardiac output, ICU nursing, hemodynamic parameters, waveform interpretation",
    color: "#DC2626",
    colorAccent: "#FEE2E2",
    introduction: "Hemodynamic monitoring is a foundational ICU nursing skill that enables assessment of cardiovascular function and guides treatment decisions for critically ill patients. From arterial line waveform interpretation to advanced cardiac output monitoring, this guide covers the hemodynamic assessment skills every ICU nurse needs.",
    sections: [
      {
        id: "arterial-lines",
        title: "Arterial Line Management and Interpretation",
        content: "Arterial lines provide continuous blood pressure monitoring and easy access for arterial blood gas sampling. The radial artery is the most common insertion site, with femoral and dorsalis pedis as alternatives. Nursing responsibilities include zeroing and leveling the transducer at the phlebostatic axis (4th intercostal space, mid-axillary line) at the start of each shift and whenever the patient's position changes.\n\nArterial waveform interpretation provides valuable clinical information. The normal arterial waveform has a rapid upstroke (systolic phase), a dicrotic notch (aortic valve closure), and a diastolic runoff. A dampened waveform (loss of dicrotic notch, decreased pulse pressure) may indicate air in the line, kinking, clot formation, or the catheter tip against the vessel wall. An overdampened waveform can falsely lower systolic and falsely elevate diastolic readings. Troubleshooting includes fast-flush testing (square wave test): a normal response shows 1-2 oscillations before returning to the waveform."
      },
      {
        id: "cvp-monitoring",
        title: "Central Venous Pressure Monitoring",
        content: "Central venous pressure (CVP) reflects right atrial pressure and is used to assess intravascular volume status and right heart function, though its utility as a sole indicator of fluid responsiveness is limited. Normal CVP ranges from 2-8 mmHg. Elevated CVP may indicate fluid overload, right heart failure, cardiac tamponade, or tension pneumothorax. Low CVP suggests hypovolemia.\n\nNursing considerations include: measuring CVP at end-expiration for consistency, ensuring the transducer is zeroed and leveled, and trending values rather than relying on single measurements. CVP waveform components include a-wave (atrial contraction), c-wave (tricuspid valve closure), and v-wave (venous filling during ventricular systole). Prominent cannon a-waves suggest AV dissociation or junctional rhythm. Large v-waves may indicate tricuspid regurgitation."
      },
      {
        id: "pa-catheters",
        title: "Pulmonary Artery Catheter Monitoring",
        content: "Pulmonary artery (Swan-Ganz) catheters provide comprehensive hemodynamic data including pulmonary artery pressure (PAP), pulmonary artery wedge pressure (PAWP), cardiac output, and mixed venous oxygen saturation. Normal PA systolic pressure is 15-30 mmHg, PA diastolic is 4-12 mmHg, and PAWP (reflecting left atrial pressure) is 4-12 mmHg.\n\nNursing responsibilities include: maintaining catheter patency with continuous flush, monitoring for catheter migration (spontaneous wedging), recognizing RV waveform patterns during insertion, and obtaining accurate wedge pressure readings at end-expiration. Complications to watch for include pulmonary artery rupture (hemoptysis), pulmonary infarction from prolonged wedging, catheter-related bloodstream infection, and dysrhythmias (PVCs during insertion or migration). PA catheters are used selectively in complex cases such as cardiogenic shock, severe heart failure, or when non-invasive monitoring is insufficient."
      },
      {
        id: "cardiac-output",
        title: "Cardiac Output and Derived Parameters",
        content: "Cardiac output (CO) is the volume of blood pumped by the heart per minute (normal 4-8 L/min). Cardiac index (CI = CO / body surface area, normal 2.5-4.0 L/min/m²) accounts for body size. Stroke volume (SV = CO / HR, normal 60-100 mL/beat) and stroke volume index (SVI) are important derived parameters.\n\nSystemic vascular resistance (SVR, normal 800-1200 dynes·sec/cm⁵) reflects afterload and helps differentiate shock types: low SVR in distributive shock (sepsis), high SVR in cardiogenic and hypovolemic shock. Mixed venous oxygen saturation (SvO2, normal 60-80%) from the PA catheter reflects the balance between oxygen delivery and consumption. An SvO2 below 60% indicates inadequate oxygen delivery or excessive consumption, while values above 80% may indicate impaired tissue extraction (as in septic shock). These parameters guide vasopressor, inotrope, and fluid therapy decisions."
      },
      {
        id: "clinical-decision-making",
        title: "Integrating Hemodynamic Data into Clinical Decisions",
        content: "Effective hemodynamic monitoring requires integrating multiple data points with clinical assessment rather than relying on any single parameter. The hemodynamic profile approach evaluates patients as warm or cold (tissue perfusion) and wet or dry (volume status). A warm and wet patient (adequate perfusion, fluid overloaded) may need diuresis. A cold and dry patient (poor perfusion, hypovolemic) needs fluid resuscitation. A cold and wet patient (poor perfusion, fluid overloaded) typically needs inotropic support.\n\nDynamic measures of fluid responsiveness — such as pulse pressure variation (PPV), stroke volume variation (SVV), and passive leg raise (PLR) testing — are more reliable than static measures (CVP alone) for predicting whether a patient will respond to a fluid bolus. Nurses should anticipate and advocate for appropriate hemodynamic interventions based on trending data, clinical trajectory, and the overall patient picture."
      },
    ],
    faqs: [
      { question: "How often should an arterial line transducer be zeroed and leveled?", answer: "The arterial line transducer should be zeroed and leveled at the phlebostatic axis at the start of each shift, whenever the patient's position changes significantly, and whenever readings seem inconsistent with the clinical picture." },
      { question: "What does a dampened arterial waveform indicate?", answer: "A dampened arterial waveform (loss of dicrotic notch, decreased pulse pressure) can indicate air bubbles in the line, catheter kinking, clot formation, or the catheter tip resting against the vessel wall. Perform a square wave test to assess the system's dynamic response." },
      { question: "What is the normal range for CVP?", answer: "Normal central venous pressure ranges from 2-8 mmHg. However, CVP should be trended over time and correlated with clinical assessment rather than used in isolation to guide fluid management decisions." },
      { question: "How do hemodynamic parameters help differentiate shock types?", answer: "Septic shock typically shows low SVR with high cardiac output initially. Cardiogenic shock shows high SVR with low cardiac output. Hypovolemic shock shows high SVR with low filling pressures. These parameters guide vasopressor, inotrope, and fluid therapy decisions." },
    ],
    relatedClusterSlugs: ["icu-ventilator-management", "icu-sepsis-nursing-interventions", "icu-medications-guide", "icu-nursing-skills"],
    ctaPreviewSlug: "icu",
    ctaLessonsSlug: "icu",
  },
  {
    slug: "icu-medications-guide",
    parentSlug: "icu-nursing-ultimate-guide",
    parentTitle: "ICU Nursing Ultimate Guide",
    title: "ICU Medications: Drips, Titrations & High-Alert Drugs",
    metaTitle: "ICU Medications Guide | Vasopressors, Sedation Drips & High-Alert Drugs | NurseNest",
    metaDescription: "Complete ICU medications guide covering vasopressor titration, sedation drips, neuromuscular blockers, anticoagulants, insulin infusions, and high-alert medication safety for critical care nurses.",
    keywords: "ICU medications, vasopressor titration, sedation drips, propofol, norepinephrine, high-alert medications, ICU pharmacology, critical care medications",
    color: "#DC2626",
    colorAccent: "#FEE2E2",
    introduction: "ICU medication management requires specialized knowledge of continuous infusion titration protocols, high-alert medication safety practices, and drug interaction awareness. This guide covers the essential ICU medications that critical care nurses manage daily, from vasoactive drips to sedation protocols.",
    sections: [
      {
        id: "vasopressors-inotropes",
        title: "Vasopressors and Inotropes",
        content: "Vasopressors and inotropes are the cornerstone of hemodynamic support in the ICU. Norepinephrine (Levophed) is the first-line vasopressor for most types of shock, acting primarily on alpha-1 receptors to increase SVR with some beta-1 activity for inotropy. Typical dosing ranges from 0.01-3 mcg/kg/min, titrated to MAP ≥ 65 mmHg. Vasopressin (0.01-0.04 units/min) acts on V1 receptors and is often added as a second agent in septic shock to spare norepinephrine requirements.\n\nEpinephrine provides both alpha and beta stimulation and is used for anaphylaxis, cardiac arrest, and refractory shock. Phenylephrine is a pure alpha agonist used when tachycardia limits norepinephrine use. Dobutamine (2-20 mcg/kg/min) is a primarily beta-1 inotrope used for cardiogenic shock to increase contractility and cardiac output. Milrinone is a phosphodiesterase inhibitor with both inotropic and vasodilatory effects. Nurses must understand that each agent has distinct receptor profiles, hemodynamic effects, and monitoring requirements."
      },
      {
        id: "sedation-analgesia",
        title: "Sedation and Analgesia Protocols",
        content: "ICU sedation follows the analgesia-first approach: optimize pain management before adding sedatives. Fentanyl (25-200 mcg/hr) is the most common ICU analgesic, with rapid onset and short duration. Hydromorphone is an alternative for opioid-tolerant patients. For sedation, propofol (5-80 mcg/kg/min) provides rapid onset and offset, facilitating daily neurological assessments, but requires monitoring for propofol infusion syndrome (PRIS) with prolonged high-dose use — watch for metabolic acidosis, rhabdomyolysis, and cardiac failure.\n\nDexmedetomidine (Precedex, 0.2-1.5 mcg/kg/hr) provides sedation without significant respiratory depression, making it useful for spontaneous breathing trials and during weaning. Midazolam (0.5-5 mg/hr) is reserved for refractory cases due to accumulation risk and association with delirium. Sedation is guided by the Richmond Agitation-Sedation Scale (RASS), with a typical target of RASS 0 to -2. Daily sedation interruptions and spontaneous awakening trials (SATs) are recommended unless contraindicated."
      },
      {
        id: "neuromuscular-blockers",
        title: "Neuromuscular Blocking Agents",
        content: "Neuromuscular blocking agents (NMBAs) paralyze skeletal muscles and are used in select ICU situations: facilitating mechanical ventilation in severe ARDS with refractory dyssynchrony, reducing oxygen consumption, and managing elevated intracranial pressure. Cisatracurium is preferred due to organ-independent Hofmann elimination, making it suitable for patients with renal or hepatic dysfunction. Rocuronium and vecuronium are alternatives.\n\nCritical nursing considerations: adequate sedation and analgesia MUST be ensured before and during paralysis — paralyzed patients can be fully aware but unable to communicate. Train-of-four (TOF) monitoring assesses neuromuscular blockade depth, with a target of 1-2/4 twitches. Eye care (artificial tears, taping), skin assessment, DVT prophylaxis, and repositioning are essential for paralyzed patients who cannot protect themselves. NMBAs should be discontinued daily when possible to reassess the need for continued paralysis."
      },
      {
        id: "anticoagulants",
        title: "Anticoagulation in the ICU",
        content: "Anticoagulation management in the ICU includes both prophylactic and therapeutic dosing regimens. Unfractionated heparin (UFH) is the most common ICU anticoagulant for therapeutic use, with dosing guided by aPTT (target varies by indication, typically 1.5-2.5x control) or anti-Xa levels. Nursing responsibilities include precise infusion rate calculations, timely lab draws, and dose adjustments per protocol.\n\nEnoxaparin (Lovenox) is used for DVT prophylaxis (30-40 mg daily or BID) and therapeutic dosing (1 mg/kg BID). Monitor anti-Xa levels in renal insufficiency and obese patients. Argatroban is the anticoagulant of choice for heparin-induced thrombocytopenia (HIT), monitored by aPTT. Bivalirudin is used in HIT patients requiring procedures. For all anticoagulants, nurses must assess for bleeding complications: monitor hemoglobin trends, check for bruising, test stool for occult blood, and assess access sites. Platelet monitoring every 2-3 days during heparin therapy screens for HIT."
      },
      {
        id: "high-alert-safety",
        title: "High-Alert Medication Safety",
        content: "High-alert medications in the ICU pose the highest risk of harm when errors occur. These require independent double verification by two nurses before administration. Key high-alert categories include: insulin infusions (blood glucose checks every 1-2 hours, target 140-180 mg/dL), heparin drips (aPTT-guided dosing adjustments), potassium chloride infusions (never bolus IV potassium, maximum rate 10-20 mEq/hr via central line with cardiac monitoring), concentrated electrolyte solutions, and neuromuscular blocking agents.\n\nSmart pump technology with drug libraries and dose-limit alerts serves as an additional safety layer. Nurses must verify drug concentration, infusion rate, correct line and lumen, compatibility with co-infused medications, and patient identification before initiating or adjusting any high-alert medication. Standardized order sets and concentration protocols reduce variability-related errors. Near-miss reporting and a culture of safety are essential for continuous improvement in medication safety."
      },
    ],
    faqs: [
      { question: "What is the first-line vasopressor used in the ICU?", answer: "Norepinephrine (Levophed) is the first-line vasopressor for most types of shock in the ICU. It acts primarily on alpha-1 receptors to increase systemic vascular resistance, with some beta-1 activity for cardiac contractility, and is titrated to achieve a target MAP of 65 mmHg or greater." },
      { question: "What is propofol infusion syndrome (PRIS)?", answer: "PRIS is a rare but life-threatening complication of prolonged, high-dose propofol use (> 48 hours at > 5 mg/kg/hr). Signs include metabolic acidosis, rhabdomyolysis, hyperkalemia, renal failure, and cardiac failure. Nurses should monitor triglycerides, CK levels, and metabolic panels during propofol infusions." },
      { question: "Why is train-of-four monitoring important during neuromuscular blockade?", answer: "Train-of-four monitoring ensures appropriate depth of neuromuscular blockade (target 1-2/4 twitches) to prevent over-paralysis while maintaining therapeutic effect. It is essential because clinical assessment is impossible in paralyzed patients." },
      { question: "Which ICU medications require independent double checks?", answer: "High-alert medications requiring independent double verification include insulin infusions, heparin drips, potassium chloride infusions, concentrated electrolytes, neuromuscular blocking agents, and vasopressor/inotrope drips at many institutions. This practice reduces the risk of medication errors in critical care." },
    ],
    relatedClusterSlugs: ["icu-ventilator-management", "icu-sepsis-nursing-interventions", "icu-hemodynamic-monitoring", "icu-nursing-skills"],
    ctaPreviewSlug: "icu",
    ctaLessonsSlug: "icu",
  },
  {
    slug: "icu-nursing-skills",
    parentSlug: "icu-nursing-ultimate-guide",
    parentTitle: "ICU Nursing Ultimate Guide",
    title: "Essential ICU Nursing Skills",
    metaTitle: "Essential ICU Nursing Skills | Critical Care Competencies Guide | NurseNest",
    metaDescription: "Complete guide to essential ICU nursing skills covering rapid patient assessment, ABCDE approach, sedation management with RASS and CAM-ICU, central line care, and critical thinking in intensive care.",
    keywords: "ICU nursing skills, critical care competencies, ABCDE assessment, RASS scale, CAM-ICU, central line care, ICU assessment, critical thinking nursing",
    color: "#DC2626",
    colorAccent: "#FEE2E2",
    introduction: "ICU nursing demands a unique skill set that combines advanced clinical assessment, rapid decision-making, technical proficiency, and compassionate patient care. This guide covers the essential skills every ICU nurse needs to develop, from systematic patient assessment to complex device management.",
    sections: [
      {
        id: "rapid-assessment",
        title: "Rapid Patient Assessment: The ABCDE Approach",
        content: "The ABCDE approach provides a systematic framework for rapid ICU patient assessment. Airway: assess patency, ETT position (cm mark at lip), cuff pressure, and secretion management. Breathing: respiratory rate, depth, pattern, SpO2, ventilator settings and compliance, breath sounds bilaterally. Circulation: heart rate, rhythm, blood pressure (arterial line and cuff correlation), MAP, skin color and temperature, capillary refill, peripheral pulses, and urine output. Disability: neurological status using GCS, pupil size and reactivity, RASS score, and focal deficits. Exposure: complete skin assessment, temperature, all lines and tubes, and dressings.\n\nThis systematic approach ensures no critical finding is missed during handoff, hourly assessments, or rapid response situations. ICU nurses should be able to complete a focused ABCDE assessment within 2-3 minutes and identify life-threatening issues requiring immediate intervention."
      },
      {
        id: "sedation-delirium-assessment",
        title: "Sedation and Delirium Assessment",
        content: "The Richmond Agitation-Sedation Scale (RASS) is the standard tool for ICU sedation assessment. It ranges from +4 (combative) to -5 (unarousable), with 0 representing alert and calm. The target RASS for most mechanically ventilated patients is -2 to 0 (light sedation). Nurses assess RASS by observing the patient, calling their name, and if needed, providing physical stimulation.\n\nThe Confusion Assessment Method for the ICU (CAM-ICU) screens for delirium, which affects up to 80% of mechanically ventilated patients and is associated with increased mortality and cognitive decline. CAM-ICU assesses four features: acute mental status change or fluctuation, inattention (using letter recognition or picture tasks), altered level of consciousness (RASS ≠ 0), and disorganized thinking. A positive CAM-ICU requires features 1 AND 2, plus either 3 OR 4. Nonpharmacological delirium prevention includes sleep hygiene, early mobilization, reorientation, cognitive stimulation, and minimizing deliriogenic medications."
      },
      {
        id: "central-line-management",
        title: "Central Line Care and CLABSI Prevention",
        content: "Central venous catheters (CVCs) are essential for ICU patients requiring vasopressors, TPN, or multiple infusions. Nurses are responsible for daily line assessment, dressing changes, and adherence to the CLABSI (Central Line-Associated Bloodstream Infection) prevention bundle. Key elements include: hand hygiene before any line manipulation, chlorhexidine-impregnated dressings, transparent occlusive dressings changed every 7 days (or 48 hours for gauze), scrubbing catheter hubs with alcohol for 15 seconds before access, daily assessment of line necessity with prompt removal when no longer needed.\n\nLine assessment includes: inspecting the insertion site for redness, swelling, drainage, or tenderness; verifying catheter length at the insertion site; checking all lumen connections for security; and flushing each lumen to verify patency. Blood cultures should be drawn from both the central line and a peripheral site when CLABSI is suspected. Nurses should advocate for line removal when the clinical indication has resolved."
      },
      {
        id: "critical-thinking",
        title: "Critical Thinking and Clinical Judgment",
        content: "ICU nursing requires advanced critical thinking skills to synthesize complex data streams and make rapid clinical decisions. Key components include: pattern recognition (identifying subtle changes in vital sign trends before overt deterioration), anticipatory care (predicting complications based on diagnosis and treatment trajectory), and clinical reasoning (connecting assessment findings to pathophysiology to determine appropriate interventions).\n\nEffective ICU nurses develop situational awareness — understanding the current patient status, predicting what may happen next, and having contingency plans ready. This includes knowing when to call the physician, what interventions to initiate independently within nursing scope (such as repositioning, suctioning, or applying oxygen), and how to prioritize when managing multiple critically ill patients. Simulation training, case studies, and reflective practice help develop these essential cognitive skills."
      },
      {
        id: "communication-teamwork",
        title: "Communication and Interdisciplinary Teamwork",
        content: "Effective communication is a critical ICU nursing skill that directly impacts patient safety. SBAR (Situation, Background, Assessment, Recommendation) provides a structured framework for communicating with physicians and the interdisciplinary team. During ICU rounds, nurses present comprehensive patient updates including overnight events, current assessment, trending data, and care plan questions.\n\nClosed-loop communication during emergencies ensures orders are heard, repeated back, and confirmed when completed. Handoff communication between shifts should follow a standardized format covering all active drips, pending labs, anticipated changes, and family updates. Family communication is equally important: ICU nurses often serve as the primary contact for families, explaining complex medical concepts in accessible terms, providing emotional support, and facilitating shared decision-making. Conflict resolution skills and the ability to advocate for patients across professional hierarchies are essential."
      },
    ],
    faqs: [
      { question: "What is the ABCDE approach in ICU nursing?", answer: "The ABCDE approach is a systematic assessment framework: Airway (patency, ETT), Breathing (respiratory status, ventilator), Circulation (hemodynamics, perfusion), Disability (neurological status, GCS), and Exposure (skin, lines, tubes, temperature). It ensures comprehensive assessment in 2-3 minutes." },
      { question: "What is the RASS scale and how is it used?", answer: "The Richmond Agitation-Sedation Scale (RASS) ranges from +4 (combative) to -5 (unarousable), with 0 being alert and calm. ICU nurses use it to assess and titrate sedation to a target level, typically -2 to 0 for most mechanically ventilated patients." },
      { question: "What is the CLABSI prevention bundle?", answer: "The CLABSI prevention bundle includes hand hygiene, chlorhexidine dressings, transparent dressing changes every 7 days, hub scrubbing for 15 seconds before access, daily assessment of line necessity, and prompt removal when no longer needed. These evidence-based practices significantly reduce central line infections." },
      { question: "How do ICU nurses screen for delirium?", answer: "ICU nurses use the CAM-ICU (Confusion Assessment Method for the ICU) to screen for delirium. It assesses four features: acute mental status change, inattention, altered consciousness, and disorganized thinking. Delirium affects up to 80% of ventilated patients and is associated with worse outcomes." },
    ],
    relatedClusterSlugs: ["icu-hemodynamic-monitoring", "icu-medications-guide", "icu-ventilator-management"],
    ctaPreviewSlug: "icu",
    ctaLessonsSlug: "icu",
  },
  {
    slug: "icu-nurse-salary",
    parentSlug: "icu-nursing-ultimate-guide",
    parentTitle: "ICU Nursing Ultimate Guide",
    title: "ICU Nurse Salary Guide: Compensation & Career Growth",
    metaTitle: "ICU Nurse Salary Guide 2025 | Compensation, Benefits & Career Growth | NurseNest",
    metaDescription: "Comprehensive ICU nurse salary guide covering average pay by experience and region, travel ICU nursing rates, certification pay bumps, shift differentials, and career advancement pathways.",
    keywords: "ICU nurse salary, critical care nurse pay, ICU nursing salary, travel ICU nurse salary, CCRN certification pay, ICU nurse career, critical care nursing compensation",
    color: "#DC2626",
    colorAccent: "#FEE2E2",
    introduction: "ICU nursing is among the highest-paying nursing specialties, reflecting the advanced skills, critical thinking, and high-acuity patient care required. This guide covers ICU nurse compensation across experience levels, geographic regions, and career pathways to help you understand your earning potential in critical care.",
    sections: [
      {
        id: "salary-overview",
        title: "ICU Nurse Salary Overview",
        content: "ICU nurses earn significantly more than the average registered nurse due to the specialized nature of critical care. Entry-level ICU nurses (0-2 years) typically earn $60,000-$80,000 annually, depending on location and facility type. Mid-career ICU nurses (3-7 years) earn $75,000-$100,000, while experienced ICU nurses (8+ years) with certifications can earn $90,000-$130,000+. Major academic medical centers and urban hospitals generally offer higher base salaries than rural or community hospitals.\n\nIn addition to base salary, total compensation includes shift differentials (evening, night, weekend, holiday), overtime opportunities, charge nurse pay, preceptor pay, and benefits packages including health insurance, retirement contributions, tuition reimbursement, and continuing education allowances. Many hospitals offer sign-on bonuses for experienced ICU nurses, ranging from $5,000 to $20,000."
      },
      {
        id: "geographic-variation",
        title: "Salary by Geographic Region",
        content: "ICU nurse salaries vary significantly by region and are influenced by cost of living, state regulations, union presence, and local demand. The highest-paying states for ICU nurses include California ($95,000-$140,000+), New York ($85,000-$120,000), Massachusetts ($80,000-$115,000), and Washington ($80,000-$110,000). These states often have higher costs of living that offset the higher salaries.\n\nIn Canada, ICU nurses earn CAD $75,000-$110,000 depending on province, with Ontario, Alberta, and British Columbia offering the highest compensation. Canadian nurses benefit from universal healthcare, pension plans, and strong union protections. When evaluating salary offers, consider the total compensation package including benefits, cost of living, state/provincial tax rates, and quality of life factors."
      },
      {
        id: "certification-impact",
        title: "Certification Pay and Professional Development",
        content: "Specialty certifications significantly boost ICU nurse compensation and career advancement. The CCRN (Critical Care Registered Nurse) certification from AACN is the gold standard, with many hospitals offering $1,500-$5,000 annual certification differentials. Additional certifications such as CMC (Cardiac Medicine Certification), CSC (Cardiac Surgery Certification), and ACLS/PALS instructor status can further increase earning potential.\n\nProfessional development investments with high return include: BSN completion (many Magnet hospitals require it and offer higher pay for BSN-prepared nurses), MSN or DNP for advancement to nurse practitioner or clinical nurse specialist roles, leadership training for charge nurse or management positions, and specialty course completions (ECMO, hemodynamic monitoring, or organ procurement). Many hospitals offer tuition reimbursement of $3,000-$10,000 annually for degree advancement."
      },
      {
        id: "travel-icu",
        title: "Travel ICU Nursing Compensation",
        content: "Travel ICU nursing offers significantly higher compensation than permanent staff positions, with experienced ICU nurses earning $2,500-$4,500+ per week during standard market conditions. Crisis rates during surges have reached $5,000-$10,000+ per week. Travel assignments typically last 13 weeks and include tax-free housing stipends, travel reimbursement, and health insurance.\n\nTo qualify for travel ICU nursing, most agencies require a minimum of 2 years of ICU experience, active RN license (compact or state-specific), current ACLS and BLS certifications, and strong clinical competency across ICU patient populations. Travel nursing offers the opportunity to experience different hospital systems, build a diverse clinical skill set, and accelerate debt repayment or savings goals. However, it requires adaptability, self-motivation, and comfort with rapid orientation to new environments."
      },
      {
        id: "career-advancement",
        title: "Career Advancement Pathways",
        content: "ICU nursing opens numerous career advancement pathways, each with increasing compensation. Clinical advancement includes charge nurse ($2-5/hr differential), preceptor roles, and clinical nurse specialist positions. Management tracks include ICU unit manager ($85,000-$120,000), director of critical care services ($100,000-$150,000), and chief nursing officer.\n\nAdvanced practice pathways include Acute Care Nurse Practitioner (ACNP, $100,000-$140,000), which is a natural progression for experienced ICU nurses who want to manage patients independently. Certified Registered Nurse Anesthetist (CRNA, $180,000-$250,000+) is the highest-paid nursing specialty and benefits greatly from ICU experience. Clinical education roles include ICU educator ($75,000-$100,000) and simulation center director. Industry roles in medical device companies, pharmaceutical firms, and healthcare consulting also value ICU clinical experience."
      },
    ],
    faqs: [
      { question: "How much do ICU nurses make per year?", answer: "ICU nurses earn $60,000-$130,000+ annually depending on experience, location, certifications, and facility type. Entry-level ICU nurses (0-2 years) start around $60,000-$80,000, while experienced, certified ICU nurses can earn $90,000-$130,000+." },
      { question: "Do ICU nurses earn more than regular nurses?", answer: "Yes, ICU nurses typically earn 10-20% more than general medical-surgical nurses due to the specialized skills required, higher patient acuity, and additional certifications. Shift differentials, overtime, and certification bonuses further increase the pay gap." },
      { question: "How much do travel ICU nurses make?", answer: "Travel ICU nurses earn $2,500-$4,500+ per week during standard market conditions, with assignments typically lasting 13 weeks. This includes tax-free housing stipends and travel reimbursement. Crisis rates during surges can reach $5,000-$10,000+ per week." },
      { question: "Does CCRN certification increase salary?", answer: "Yes, CCRN certification typically provides a $1,500-$5,000 annual pay differential and is increasingly expected for ICU nurses seeking advancement. It also opens doors to charge nurse, preceptor, and leadership roles with additional compensation." },
    ],
    relatedClusterSlugs: ["icu-nursing-skills", "icu-hemodynamic-monitoring", "icu-ventilator-management"],
    ctaPreviewSlug: "icu",
    ctaLessonsSlug: "icu",
  },
];

const ALL_CLUSTER_PAGES: ClusterPage[] = [
  ...ICU_CLUSTER_PAGES,
];

export function getClusterPage(parentSlug: string, clusterSlug: string): ClusterPage | undefined {
  return ALL_CLUSTER_PAGES.find(p => p.slug === clusterSlug && p.parentSlug === parentSlug);
}

export function getClusterPageBySlug(slug: string): ClusterPage | undefined {
  return ALL_CLUSTER_PAGES.find(p => p.slug === slug);
}

export function getClusterPagesForParent(parentSlug: string): ClusterPage[] {
  return ALL_CLUSTER_PAGES.filter(p => p.parentSlug === parentSlug);
}
