export interface ClusterTopic {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  overview: string;
  sections: {
    id: string;
    title: string;
    level: number;
    content: string;
    bullets?: string[];
  }[];
  signsSymptoms?: string[];
  assessmentSteps?: string[];
  differentialConsiderations?: string[];
  blsInterventions?: string[];
  alsInterventions?: string[];
  transportDecisions?: string[];
  redFlags?: string[];
  examTips?: string[];
  indications?: string[];
  contraindications?: string[];
  dosageAdult?: string;
  dosagePediatric?: string;
  routes?: string[];
  sideEffects?: string[];
  clinicalScenarios?: string[];
  rhythmCharacteristics?: string[];
  identificationSteps?: string[];
  clinicalImplications?: string[];
  treatmentPriorities?: string[];
  faq: { question: string; answer: string }[];
  relatedTopicSlugs: string[];
  relatedClusterSlugs: string[];
}

export interface ContentCluster {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  description: string;
  icon: string;
  color: string;
  topics: ClusterTopic[];
}

export const PARAMEDIC_CLUSTERS: ContentCluster[] = [
  {
    slug: "emergency-conditions",
    title: "Emergency Conditions",
    metaTitle: "Emergency Conditions for Paramedics — Clinical Assessment & Management | NurseNest",
    metaDescription: "Master prehospital emergency conditions including chest pain, stroke, seizure, anaphylaxis, trauma, and shock. Signs, symptoms, assessment steps, and ALS interventions for paramedic certification.",
    keywords: "paramedic emergency conditions, prehospital emergencies, EMS clinical assessment, paramedic exam prep, NREMT emergency conditions",
    description: "Comprehensive clinical guides for the highest-acuity emergency conditions paramedics encounter. Each topic covers signs and symptoms, systematic assessment, differential diagnosis, BLS and ALS interventions, transport decisions, and red flags.",
    icon: "AlertTriangle",
    color: "#DC2626",
    topics: [
      {
        slug: "chest-pain",
        title: "Chest Pain",
        metaTitle: "Chest Pain Assessment for Paramedics — Prehospital Cardiac Emergency Guide | NurseNest",
        metaDescription: "Master prehospital chest pain assessment: OPQRST history, 12-lead ECG interpretation, STEMI recognition, ACS management, and differential diagnosis for paramedic certification.",
        keywords: "chest pain paramedic, prehospital chest pain assessment, ACS management EMS, STEMI recognition paramedic, cardiac emergency paramedic exam",
        overview: "Chest pain is one of the most common and potentially lethal complaints in EMS. Paramedics must rapidly differentiate cardiac from non-cardiac causes while initiating time-critical interventions. Acute coronary syndrome (ACS) encompasses unstable angina, NSTEMI, and STEMI — each requiring distinct management strategies.",
        sections: [
          { id: "pathophysiology", title: "Pathophysiology", level: 2, content: "Cardiac chest pain results from myocardial ischemia — an imbalance between oxygen supply and demand. Atherosclerotic plaque rupture triggers platelet aggregation and thrombus formation, partially or completely occluding a coronary artery. Complete occlusion produces ST-elevation myocardial infarction (STEMI), while partial occlusion or microembolization causes NSTEMI or unstable angina." },
          { id: "assessment", title: "Prehospital Assessment", level: 2, content: "Use OPQRST to characterize the pain. Obtain vital signs including SpO2. Acquire a 12-lead ECG within 10 minutes of patient contact. Assess for diaphoresis, pallor, JVD, and peripheral edema. Auscultate lung sounds for crackles suggesting pulmonary edema.", bullets: ["Onset: sudden vs gradual", "Provocation: exertion, rest, breathing, position", "Quality: crushing, sharp, tearing, burning", "Radiation: jaw, left arm, back, epigastric", "Severity: 0-10 scale", "Time: duration and pattern"] },
          { id: "differential", title: "Differential Diagnosis", level: 2, content: "Not all chest pain is cardiac. Paramedics must consider pulmonary embolism (sudden onset, pleuritic, tachycardia, hypoxia), tension pneumothorax (absent breath sounds, JVD, tracheal deviation), aortic dissection (tearing pain radiating to back, BP differential between arms), pericarditis (sharp, positional, friction rub), and musculoskeletal causes (reproducible with palpation)." },
          { id: "interventions", title: "BLS & ALS Interventions", level: 2, content: "Position of comfort. Supplemental oxygen if SpO2 < 94%. Aspirin 324 mg PO (chewed). Nitroglycerin 0.4 mg SL every 5 minutes x3 (if SBP > 90 and no phosphodiesterase inhibitor use). Morphine or fentanyl for pain not relieved by nitroglycerin. Establish IV access. Continuous cardiac monitoring. Serial 12-lead ECGs. If STEMI identified: activate cath lab, target door-to-balloon < 90 minutes." },
        ],
        signsSymptoms: ["Substernal pressure or heaviness", "Diaphoresis", "Dyspnea", "Nausea and vomiting", "Radiation to jaw, arm, or back", "Pallor", "Anxiety or sense of impending doom", "Atypical presentations in women, elderly, and diabetics"],
        assessmentSteps: ["Scene safety and BSI", "OPQRST pain history", "SAMPLE history", "12-lead ECG within 10 min", "Vital signs with SpO2", "Lung auscultation", "Assess JVD and peripheral edema", "Check bilateral arm BPs if dissection suspected"],
        differentialConsiderations: ["Acute Coronary Syndrome (STEMI/NSTEMI/UA)", "Pulmonary Embolism", "Tension Pneumothorax", "Aortic Dissection", "Pericarditis/Myocarditis", "Musculoskeletal", "GERD/Esophageal spasm"],
        blsInterventions: ["Position of comfort", "Aspirin 324 mg chewed", "Supplemental oxygen if SpO2 < 94%", "Assist with prescribed nitroglycerin"],
        alsInterventions: ["12-lead ECG acquisition and STEMI recognition", "Nitroglycerin 0.4 mg SL q5min x3", "IV access and fluid challenge if hypotensive", "Morphine 2-4 mg IV or Fentanyl 25-50 mcg IV for pain", "Heparin per protocol if ACS confirmed", "Cath lab activation for STEMI"],
        transportDecisions: ["STEMI: transport to PCI-capable facility, cath lab activation en route", "Unstable vitals: closest appropriate facility with lights and sirens", "Stable ACS: transport to cardiac-capable hospital"],
        redFlags: ["STEMI on 12-lead ECG", "Hypotension (SBP < 90)", "Cardiogenic shock (hypotension + pulmonary edema)", "New-onset arrhythmia", "Tearing pain with BP differential (aortic dissection)", "Sudden onset with pleuritic component (PE)"],
        examTips: ["Always check for phosphodiesterase inhibitor use before nitroglycerin", "STEMI equivalents: new LBBB, posterior MI (tall R-waves V1-V3, ST depression V1-V4)", "Right-sided MI: avoid nitroglycerin, fluid-dependent, obtain V4R", "Women and diabetics may present atypically without classic chest pain"],
        faq: [
          { question: "When should a paramedic withhold nitroglycerin for chest pain?", answer: "Withhold nitroglycerin if SBP < 90 mmHg, if the patient has used a phosphodiesterase inhibitor (sildenafil within 24 hours, tadalafil within 48 hours), or if right ventricular infarction is suspected (inferior STEMI with hypotension). In right-sided MI, patients are preload-dependent and nitroglycerin can cause severe hypotension." },
          { question: "How do you differentiate STEMI from other causes of ST elevation?", answer: "STEMI shows ST elevation in two or more contiguous leads with reciprocal changes. Early repolarization (benign) has a fish-hook pattern and is typically in young patients. Pericarditis shows diffuse ST elevation without reciprocal changes and PR depression. Left ventricular aneurysm shows persistent ST elevation without acute changes." },
          { question: "What is the significance of a new left bundle branch block?", answer: "A new LBBB in the setting of chest pain is treated as a STEMI equivalent. It suggests acute myocardial ischemia causing conduction system damage. Sgarbossa criteria can help identify acute MI in the presence of LBBB: concordant ST elevation > 1mm, concordant ST depression > 1mm in V1-V3, or discordant ST elevation > 5mm." },
        ],
        relatedTopicSlugs: ["shortness-of-breath", "shock-types", "stroke"],
        relatedClusterSlugs: ["ecg-cardiac", "ems-medications"],
      },
      {
        slug: "shortness-of-breath",
        title: "Shortness of Breath",
        metaTitle: "Shortness of Breath (Dyspnea) for Paramedics — Respiratory Emergency Guide | NurseNest",
        metaDescription: "Master prehospital dyspnea assessment: differentiating asthma, COPD, CHF, PE, and pneumothorax. BLS/ALS interventions and transport decisions for paramedic certification.",
        keywords: "shortness of breath paramedic, dyspnea prehospital, respiratory emergency EMS, COPD asthma paramedic, CHF pulmonary edema EMS",
        overview: "Dyspnea is the second most common reason for EMS activation. Paramedics must rapidly differentiate cardiac from pulmonary causes and initiate targeted treatment. The key challenge is distinguishing reversible bronchospasm from pulmonary edema, pneumothorax, or pulmonary embolism.",
        sections: [
          { id: "assessment", title: "Rapid Assessment Framework", level: 2, content: "Assess work of breathing immediately: accessory muscle use, tripod positioning, inability to speak full sentences. Measure SpO2 and apply waveform capnography. Auscultate all lung fields bilaterally. Key differentiators: wheezing (bronchospasm), crackles (pulmonary edema), absent sounds (pneumothorax), stridor (upper airway obstruction)." },
          { id: "cardiac-vs-pulmonary", title: "Cardiac vs Pulmonary Causes", level: 2, content: "CHF/pulmonary edema: bilateral crackles, JVD, peripheral edema, orthopnea, PND history. Asthma/COPD: diffuse wheezing, prolonged expiratory phase, history of inhaler use. PE: sudden onset, pleuritic pain, tachycardia, risk factors (immobility, recent surgery, DVT). Pneumothorax: unilateral absent breath sounds, chest trauma history." },
          { id: "management", title: "Management by Etiology", level: 2, content: "Pulmonary edema: CPAP 5-10 cmH2O, nitroglycerin, position upright. Bronchospasm: albuterol 2.5 mg nebulized, ipratropium 0.5 mg, consider epinephrine for severe cases. PE: supportive care, high-flow oxygen, rapid transport. Pneumothorax: needle decompression if tension (2nd ICS MCL or 5th ICS AAL)." },
        ],
        signsSymptoms: ["Tachypnea", "Accessory muscle use", "Tripod positioning", "Inability to speak full sentences", "Cyanosis", "Diaphoresis", "Wheezing or crackles", "Altered mental status (late sign)"],
        assessmentSteps: ["Assess work of breathing and mental status", "SpO2 and waveform capnography", "Bilateral lung auscultation", "OPQRST and SAMPLE history", "JVD and peripheral edema check", "Peak flow if available", "12-lead ECG to rule out cardiac cause"],
        differentialConsiderations: ["Asthma/Bronchospasm", "COPD exacerbation", "Congestive Heart Failure", "Pulmonary Embolism", "Tension Pneumothorax", "Anaphylaxis", "Upper airway obstruction", "Anxiety/Hyperventilation"],
        blsInterventions: ["Supplemental oxygen", "Position of comfort (upright)", "Assist with prescribed inhaler", "Suction as needed"],
        alsInterventions: ["CPAP 5-10 cmH2O for pulmonary edema", "Albuterol 2.5 mg + ipratropium 0.5 mg nebulized", "Epinephrine for severe bronchospasm/anaphylaxis", "Nitroglycerin for CHF-related dyspnea", "Needle decompression for tension pneumothorax", "Magnesium sulfate 2g IV for refractory bronchospasm"],
        transportDecisions: ["Tension pneumothorax: immediate transport after decompression", "Severe respiratory failure: closest facility, consider advanced airway", "Stable dyspnea: transport to appropriate facility"],
        redFlags: ["SpO2 < 90% despite supplemental O2", "Altered mental status", "Silent chest (severe asthma)", "Absent breath sounds unilaterally", "Paradoxical breathing", "Rising ETCO2 > 50 mmHg"],
        examTips: ["CPAP is contraindicated if GCS < 10, SBP < 90, or active vomiting", "Waveform capnography shows shark-fin pattern in bronchospasm", "Don't over-oxygenate COPD patients — target SpO2 88-92%", "Stridor = upper airway, wheezing = lower airway"],
        faq: [
          { question: "When should CPAP be applied for shortness of breath?", answer: "CPAP is indicated for acute pulmonary edema (CHF) and COPD exacerbation when the patient has adequate respiratory effort. Start at 5-10 cmH2O. Contraindications: GCS < 10, SBP < 90, active vomiting, facial trauma, pneumothorax, or inability to maintain mask seal." },
          { question: "How do you differentiate asthma from COPD in the field?", answer: "Both present with wheezing and dyspnea. Asthma: younger patients, acute onset, allergen/exercise trigger, reversible with bronchodilators. COPD: older patients (>40), smoking history, chronic symptoms with acute worsening, barrel chest, may have diminished rather than wheezing sounds. Treatment for acute exacerbation is similar." },
        ],
        relatedTopicSlugs: ["chest-pain", "anaphylaxis"],
        relatedClusterSlugs: ["ems-medications", "assessment-protocols"],
      },
      {
        slug: "stroke",
        title: "Stroke",
        metaTitle: "Stroke Assessment for Paramedics — Prehospital Stroke Recognition & Management | NurseNest",
        metaDescription: "Master prehospital stroke assessment: Cincinnati Stroke Scale, LAMS, FAST, large vessel occlusion screening, and time-critical transport decisions for paramedic certification.",
        keywords: "stroke paramedic, prehospital stroke assessment, FAST stroke, Cincinnati stroke scale, large vessel occlusion EMS",
        overview: "Stroke is a time-critical emergency where every minute of delayed treatment results in approximately 1.9 million neurons dying. Paramedics play a pivotal role in early recognition, prehospital notification, and rapid transport to stroke-capable facilities. The mantra 'time is brain' drives every decision.",
        sections: [
          { id: "types", title: "Types of Stroke", level: 2, content: "Ischemic stroke (87%): thrombus or embolus occludes a cerebral artery. Hemorrhagic stroke (13%): intracerebral hemorrhage or subarachnoid hemorrhage. Transient Ischemic Attack (TIA): symptoms resolve within 24 hours but signal high stroke risk." },
          { id: "assessment", title: "Prehospital Stroke Assessment", level: 2, content: "Use Cincinnati Stroke Scale or FAST (Face drooping, Arm drift, Speech difficulty, Time). For large vessel occlusion screening, use LAMS (Los Angeles Motor Scale): facial droop (0-1), arm drift (0-2), grip strength (0-2). LAMS ≥ 4 suggests LVO requiring thrombectomy-capable center.", bullets: ["Establish symptom onset time (last known well)", "Blood glucose measurement (rule out hypoglycemia)", "Cincinnati Stroke Scale / FAST assessment", "LAMS or similar LVO screen", "GCS assessment", "Vital signs with blood pressure"] },
          { id: "management", title: "Prehospital Management", level: 2, content: "Do NOT lower blood pressure in the field unless SBP > 220. Maintain SpO2 > 94%. Position head of bed at 30 degrees. Establish IV access — do NOT give dextrose-containing fluids. Protect airway if GCS declining. Transport to stroke center. Prehospital notification reduces door-to-needle time by 15-20 minutes." },
        ],
        signsSymptoms: ["Facial droop (unilateral)", "Arm drift or weakness", "Speech difficulty (slurred or absent)", "Sudden severe headache", "Vision changes", "Gait disturbance", "Confusion or altered mental status"],
        assessmentSteps: ["Establish last known well time", "Cincinnati Stroke Scale / FAST", "LAMS for LVO screening", "Blood glucose measurement", "GCS assessment", "Vital signs", "Neurological exam"],
        differentialConsiderations: ["Ischemic Stroke", "Hemorrhagic Stroke", "TIA", "Hypoglycemia", "Todd's paralysis (post-ictal)", "Bell's palsy", "Complex migraine", "Brain tumor"],
        blsInterventions: ["Position head elevated 30 degrees", "Supplemental oxygen if SpO2 < 94%", "Protect airway", "NPO — nothing by mouth"],
        alsInterventions: ["IV access (normal saline only)", "Blood glucose measurement and treatment", "Stroke scale assessment and documentation", "Prehospital stroke center notification", "Cardiac monitoring (atrial fibrillation is common)", "Airway management if GCS declining"],
        transportDecisions: ["LVO suspected (LAMS ≥ 4): comprehensive stroke center with thrombectomy", "Stroke within tPA window (< 4.5 hours): primary stroke center minimum", "Hemorrhagic stroke: comprehensive stroke center"],
        redFlags: ["Symptom onset < 4.5 hours (tPA window)", "LAMS ≥ 4 (large vessel occlusion)", "Rapidly declining GCS", "Seizure at onset", "Severe hypertension (SBP > 220)", "Anticoagulant use"],
        examTips: ["Do NOT treat hypertension in stroke unless SBP > 220", "Hypoglycemia can mimic stroke — always check glucose", "Last known well time is critical for treatment decisions", "Pre-hospital notification significantly reduces door-to-needle time"],
        faq: [
          { question: "What is the tPA window for stroke treatment?", answer: "Intravenous tPA (alteplase) can be administered within 4.5 hours of symptom onset for ischemic stroke. The earlier it is given, the better the outcome. Mechanical thrombectomy for large vessel occlusion can extend the treatment window to 24 hours in selected patients." },
          { question: "Why is blood pressure not lowered in prehospital stroke?", answer: "Elevated blood pressure in acute stroke is a compensatory mechanism to maintain perfusion to the ischemic penumbra (salvageable brain tissue). Lowering blood pressure can extend the infarct. Only treat if SBP > 220 mmHg or per specific protocol." },
        ],
        relatedTopicSlugs: ["seizure", "hypoglycemia-hyperglycemia"],
        relatedClusterSlugs: ["assessment-protocols", "ems-medications"],
      },
      {
        slug: "seizure",
        title: "Seizure",
        metaTitle: "Seizure Management for Paramedics — Prehospital Status Epilepticus Guide | NurseNest",
        metaDescription: "Master prehospital seizure assessment and management: benzodiazepine protocols, status epilepticus treatment, post-ictal care, and differential diagnosis for paramedic certification.",
        keywords: "seizure paramedic, status epilepticus EMS, prehospital seizure management, benzodiazepine seizure protocol, paramedic seizure exam",
        overview: "Seizures are a common EMS call ranging from self-limiting febrile seizures to life-threatening status epilepticus. Paramedics must protect the airway, terminate prolonged seizures pharmacologically, and identify reversible causes. Status epilepticus (continuous seizure > 5 minutes) is a medical emergency requiring immediate intervention.",
        sections: [
          { id: "classification", title: "Seizure Classification", level: 2, content: "Generalized tonic-clonic: loss of consciousness, tonic rigidity followed by clonic jerking. Absence: brief staring spells, mainly pediatric. Focal: localized motor or sensory symptoms, may progress to generalized. Status epilepticus: seizure lasting > 5 minutes or recurrent seizures without return to baseline." },
          { id: "management", title: "Prehospital Management", level: 2, content: "Active seizure: protect from injury, do NOT restrain or insert anything in the mouth. Suction secretions. Position recovery when seizure stops. For status epilepticus: midazolam 10 mg IM/IN (first-line prehospital), diazepam 5-10 mg IV, or lorazepam 4 mg IV. Establish IV access when possible. Monitor glucose — treat hypoglycemia." },
        ],
        signsSymptoms: ["Tonic-clonic movements", "Loss of consciousness", "Tongue biting", "Incontinence", "Cyanosis during seizure", "Post-ictal confusion", "Post-ictal Todd's paralysis"],
        assessmentSteps: ["Scene safety (remove hazards)", "Time the seizure duration", "Assess airway and breathing", "Blood glucose measurement", "Temperature assessment", "SAMPLE history from bystanders", "Post-ictal neurological assessment"],
        differentialConsiderations: ["Epilepsy breakthrough", "Febrile seizure (pediatric)", "Hypoglycemia", "Eclampsia", "Head trauma", "Drug withdrawal (alcohol, benzodiazepines)", "Toxin exposure", "CNS infection"],
        blsInterventions: ["Protect from injury", "Recovery position post-seizure", "Suction airway secretions", "Supplemental oxygen"],
        alsInterventions: ["Midazolam 10 mg IM/IN for status epilepticus", "Diazepam 5-10 mg IV or lorazepam 4 mg IV", "IV dextrose for hypoglycemia", "Temperature management for febrile seizures", "Advanced airway if prolonged seizure with apnea"],
        transportDecisions: ["First-time seizure: transport for evaluation", "Status epilepticus: immediate transport to ED", "Known epileptic with typical breakthrough: assess need for transport"],
        redFlags: ["Seizure > 5 minutes (status epilepticus)", "No return to baseline between seizures", "Pregnant patient (eclampsia)", "Post-traumatic seizure", "First-time seizure in adult", "Fever with seizure in child > 5 years"],
        examTips: ["Midazolam IM/IN is preferred first-line in prehospital setting — faster onset than establishing IV during active seizure", "Always check glucose — hypoglycemia is a common reversible cause", "Todd's paralysis can mimic stroke — resolves within 24 hours", "Do NOT give flumazenil to seizure patients — can precipitate refractory seizures"],
        faq: [
          { question: "What is the first-line prehospital medication for status epilepticus?", answer: "Midazolam 10 mg IM or intranasal is the preferred first-line prehospital treatment for status epilepticus based on the RAMPART trial. It has faster time-to-treatment than IV benzodiazepines because it doesn't require IV access during an active seizure. Alternative: diazepam 5-10 mg IV or lorazepam 4 mg IV if IV access is already established." },
          { question: "When is a seizure considered status epilepticus?", answer: "Status epilepticus is defined as continuous seizure activity lasting more than 5 minutes, or two or more seizures without return to baseline consciousness between them. It is a medical emergency with a mortality rate of 10-20% and requires immediate pharmacological intervention." },
        ],
        relatedTopicSlugs: ["stroke", "hypoglycemia-hyperglycemia"],
        relatedClusterSlugs: ["ems-medications", "assessment-protocols"],
      },
      {
        slug: "hypoglycemia-hyperglycemia",
        title: "Hypoglycemia & Hyperglycemia",
        metaTitle: "Diabetic Emergencies for Paramedics — Hypoglycemia & DKA Management | NurseNest",
        metaDescription: "Master prehospital diabetic emergency management: hypoglycemia treatment with dextrose/glucagon, DKA and HHS recognition, and blood glucose assessment for paramedic certification.",
        keywords: "hypoglycemia paramedic, diabetic emergency EMS, DKA prehospital, hyperglycemia management paramedic, dextrose glucagon EMS",
        overview: "Diabetic emergencies are among the most common medical calls in EMS. Hypoglycemia is rapidly reversible but can be fatal if missed. DKA and HHS present with dehydration, metabolic derangement, and altered mental status. Every patient with altered mental status should have a blood glucose measured.",
        sections: [
          { id: "hypoglycemia", title: "Hypoglycemia", level: 2, content: "Blood glucose < 60 mg/dL (3.3 mmol/L). Caused by insulin excess relative to glucose intake — missed meals, insulin dosing errors, exercise. Symptoms progress from sympathetic activation (diaphoresis, tachycardia, tremor) to neuroglycopenic symptoms (confusion, seizures, coma). Treatment: conscious patient — oral glucose. Altered mental status — dextrose IV or glucagon IM." },
          { id: "dka-hhs", title: "DKA vs HHS", level: 2, content: "DKA: Type 1 diabetes, glucose 300-800 mg/dL, Kussmaul respirations, fruity breath, rapid onset (hours). HHS: Type 2 diabetes, glucose often > 600 mg/dL, no Kussmaul breathing, gradual onset (days), more severe dehydration. Both require aggressive fluid resuscitation — NS 1-2L bolus." },
        ],
        signsSymptoms: ["Altered mental status", "Diaphoresis (hypoglycemia)", "Tachycardia", "Seizures (severe hypoglycemia)", "Kussmaul respirations (DKA)", "Fruity breath odor (DKA)", "Severe dehydration (DKA/HHS)", "Abdominal pain (DKA)"],
        assessmentSteps: ["Blood glucose measurement", "Assess level of consciousness", "SAMPLE history (insulin use, meals, illness)", "Vital signs", "Assess hydration status", "Capnography (Kussmaul pattern)", "12-lead ECG (electrolyte abnormalities)"],
        blsInterventions: ["Oral glucose if conscious and able to swallow", "Recovery position if unconscious", "Supplemental oxygen"],
        alsInterventions: ["Dextrose D10W 25g IV for hypoglycemia", "Glucagon 1 mg IM if no IV access", "Normal saline 1-2L bolus for DKA/HHS", "Cardiac monitoring for electrolyte issues", "Do NOT give insulin in the field"],
        redFlags: ["Blood glucose < 40 mg/dL", "Seizures from hypoglycemia", "Blood glucose > 500 mg/dL with AMS", "Kussmaul respirations with dehydration", "Hyperkalemia signs on ECG (peaked T waves)"],
        examTips: ["D10W is preferred over D50W — less risk of tissue necrosis if infiltration", "Always recheck glucose after treatment", "Glucagon may not work in malnourished or alcoholic patients (depleted glycogen stores)", "Do NOT give insulin in the prehospital setting"],
        faq: [
          { question: "What is the preferred prehospital dextrose concentration?", answer: "D10W (10% dextrose) is increasingly preferred over D50W (50% dextrose) because it has lower osmolarity, causes less tissue damage if IV infiltrates, and allows more gradual glucose correction. Typical dose: 250 mL of D10W (25g of dextrose). D50W 25g (50 mL) is still used in some systems." },
          { question: "When should glucagon be used instead of dextrose?", answer: "Glucagon 1 mg IM is used when IV/IO access cannot be established. It stimulates hepatic glycogenolysis to raise blood glucose. Onset: 10-15 minutes IM. Limitations: ineffective in patients with depleted glycogen stores (alcoholics, malnourished, liver failure) and may cause vomiting." },
        ],
        relatedTopicSlugs: ["seizure", "shock-types"],
        relatedClusterSlugs: ["ems-medications", "assessment-protocols"],
      },
      {
        slug: "trauma",
        title: "Trauma",
        metaTitle: "Trauma Assessment for Paramedics — XABCDE Primary Survey Guide | NurseNest",
        metaDescription: "Master prehospital trauma assessment: XABCDE primary survey, hemorrhage control, tourniquet application, spinal motion restriction, and field triage for paramedic certification.",
        keywords: "trauma paramedic, XABCDE primary survey, prehospital trauma assessment, hemorrhage control EMS, tourniquet paramedic, trauma triage",
        overview: "Trauma is the leading cause of death in people under 45. The modern XABCDE approach prioritizes massive hemorrhage control before airway management. Paramedics must balance thorough assessment with rapid scene times — the platinum 10 minutes for critical trauma patients.",
        sections: [
          { id: "primary-survey", title: "XABCDE Primary Survey", level: 2, content: "X — eXsanguinating hemorrhage: apply tourniquet or direct pressure to life-threatening bleeding. A — Airway with c-spine: jaw thrust, suction, consider advanced airway. B — Breathing: assess rate, depth, symmetry, auscultate. C — Circulation: pulse quality, skin signs, additional hemorrhage control. D — Disability: GCS, pupils, motor response. E — Exposure/Environment: remove clothing, prevent hypothermia." },
          { id: "hemorrhage", title: "Hemorrhage Control", level: 2, content: "Apply tourniquet high and tight for uncontrollable extremity bleeding. Wound packing with hemostatic gauze for junctional wounds. Direct pressure for compressible hemorrhage. Pelvic binder for suspected pelvic fractures. Permissive hypotension (SBP 80-90) in penetrating trauma — NOT for TBI." },
        ],
        signsSymptoms: ["Obvious external hemorrhage", "Deformity or instability", "Signs of shock (tachycardia, hypotension, pallor)", "Altered mental status", "Pain and tenderness", "Mechanism of injury indicators"],
        assessmentSteps: ["Scene safety and mechanism of injury", "XABCDE primary survey", "Rapid trauma assessment", "GCS calculation", "Vital signs", "Secondary survey en route", "Ongoing reassessment every 5 minutes"],
        blsInterventions: ["Direct pressure and tourniquet for hemorrhage", "Spinal motion restriction", "Splinting", "Supplemental oxygen"],
        alsInterventions: ["Advanced airway management", "Needle decompression for tension pneumothorax", "IV access and fluid resuscitation", "TXA 1g IV within 3 hours of injury", "Analgesic administration", "Blood product administration (where available)"],
        transportDecisions: ["Critical trauma: platinum 10 minutes, trauma center", "TBI: neurosurgical-capable center", "Penetrating torso trauma: immediate transport", "Mechanism-based triage criteria"],
        redFlags: ["Uncontrolled hemorrhage", "Tension pneumothorax", "GCS ≤ 8", "Penetrating torso/neck wounds", "Flail chest", "Pelvic instability", "Two or more proximal long bone fractures"],
        examTips: ["X before A — hemorrhage control is now the first priority", "Permissive hypotension is NOT used in traumatic brain injury", "TXA must be given within 3 hours — after that it may increase mortality", "Scene time < 10 minutes for critical trauma"],
        faq: [
          { question: "What is the platinum 10 minutes in trauma?", answer: "The platinum 10 minutes refers to the goal of keeping on-scene time under 10 minutes for critical trauma patients. Perform only life-saving interventions on scene (hemorrhage control, airway, needle decompression) and treat everything else en route. Prolonged scene times are associated with increased mortality." },
          { question: "When should a tourniquet be applied?", answer: "Apply a tourniquet immediately for life-threatening extremity hemorrhage that cannot be controlled with direct pressure. Apply high and tight, proximal to the wound. Tighten until bleeding stops. Note the time. Commercial tourniquets (CAT, SOFT-T) are preferred. Do not remove in the field." },
        ],
        relatedTopicSlugs: ["shock-types", "chest-pain"],
        relatedClusterSlugs: ["assessment-protocols", "ems-medications"],
      },
      {
        slug: "shock-types",
        title: "Shock Types",
        metaTitle: "Types of Shock for Paramedics — Recognition & Management Guide | NurseNest",
        metaDescription: "Master all shock types for paramedic certification: hypovolemic, cardiogenic, distributive (septic, anaphylactic, neurogenic), and obstructive shock. Assessment, interventions, and transport decisions.",
        keywords: "shock types paramedic, hypovolemic shock EMS, cardiogenic shock prehospital, septic shock paramedic, anaphylactic shock treatment",
        overview: "Shock is inadequate tissue perfusion resulting in cellular hypoxia. Paramedics must recognize shock early — before decompensation — and identify the type to guide treatment. The four categories are hypovolemic, cardiogenic, distributive, and obstructive. Treatment varies dramatically by type.",
        sections: [
          { id: "types", title: "Shock Classification", level: 2, content: "Hypovolemic: volume loss (hemorrhage, dehydration). Cardiogenic: pump failure (MI, dysrhythmia, valvular). Distributive: vasodilation (septic, anaphylactic, neurogenic). Obstructive: mechanical obstruction (tension pneumothorax, cardiac tamponade, massive PE)." },
          { id: "assessment", title: "Early Recognition", level: 2, content: "Compensated shock: tachycardia, narrowed pulse pressure, delayed capillary refill, anxiety, pale cool diaphoretic skin. Decompensated shock: hypotension, altered mental status, mottled skin, weak/absent peripheral pulses. Irreversible shock: multi-organ failure, profound hypotension unresponsive to treatment." },
          { id: "management", title: "Type-Specific Management", level: 2, content: "Hypovolemic: hemorrhage control, IV fluids, permissive hypotension in trauma. Cardiogenic: avoid excessive fluids, vasopressor support, treat underlying cause. Anaphylactic: epinephrine 0.3 mg IM, aggressive fluids, antihistamines. Septic: aggressive fluid resuscitation 30 mL/kg, vasopressors. Neurogenic: fluids + vasopressors for bradycardia/hypotension." },
        ],
        signsSymptoms: ["Tachycardia (early)", "Hypotension (late — decompensation)", "Altered mental status", "Pale, cool, diaphoretic skin", "Delayed capillary refill", "Weak peripheral pulses", "Tachypnea", "Decreased urine output"],
        assessmentSteps: ["Assess mental status", "Heart rate and blood pressure", "Skin assessment (color, temperature, moisture)", "Capillary refill time", "Pulse quality (central vs peripheral)", "Identify likely cause", "Trend vital signs"],
        blsInterventions: ["Control external bleeding", "Position supine (legs elevated if no spinal/chest injury)", "Prevent hypothermia", "Supplemental oxygen"],
        alsInterventions: ["IV/IO access with fluid resuscitation", "Epinephrine for anaphylaxis", "Vasopressors for refractory hypotension", "Needle decompression for tension pneumothorax", "Cardiac monitoring", "Blood products where available"],
        redFlags: ["SBP < 90 mmHg", "Heart rate > 120 or < 60", "Altered mental status with hemodynamic instability", "Absent peripheral pulses", "Mottled or cyanotic skin"],
        examTips: ["Tachycardia is the earliest sign of shock — don't wait for hypotension", "Neurogenic shock is the exception — bradycardia with hypotension (warm, dry skin below injury)", "Cardiogenic shock: avoid fluid overload", "Beck's triad for cardiac tamponade: hypotension, JVD, muffled heart sounds"],
        faq: [
          { question: "How do you differentiate types of shock in the field?", answer: "Hypovolemic: history of bleeding/fluid loss, cold/pale/diaphoretic. Cardiogenic: history of MI/CHF, JVD, pulmonary edema, cold/pale. Anaphylactic: allergen exposure, urticaria, bronchospasm, warm/flushed. Septic: fever/infection history, warm/flushed early, cold/mottled late. Neurogenic: spinal injury, warm/dry/flushed below injury level, bradycardia." },
        ],
        relatedTopicSlugs: ["trauma", "anaphylaxis", "chest-pain"],
        relatedClusterSlugs: ["ems-medications", "assessment-protocols"],
      },
      {
        slug: "anaphylaxis",
        title: "Anaphylaxis",
        metaTitle: "Anaphylaxis Management for Paramedics — Prehospital Epinephrine & Airway Guide | NurseNest",
        metaDescription: "Master prehospital anaphylaxis management: epinephrine dosing and routes, airway management, fluid resuscitation, and biphasic reaction recognition for paramedic certification.",
        keywords: "anaphylaxis paramedic, prehospital anaphylaxis treatment, epinephrine anaphylaxis EMS, allergic reaction paramedic, anaphylactic shock management",
        overview: "Anaphylaxis is a life-threatening systemic allergic reaction requiring immediate epinephrine administration. Delay in epinephrine is the primary cause of anaphylaxis-related death. Paramedics must recognize anaphylaxis rapidly, administer epinephrine, manage the airway, and provide aggressive fluid resuscitation for distributive shock.",
        sections: [
          { id: "recognition", title: "Recognition Criteria", level: 2, content: "Anaphylaxis is likely when ANY of the following occurs acutely: skin/mucosal involvement (urticaria, angioedema) PLUS respiratory compromise OR hypotension; OR exposure to known allergen with rapid onset of two or more systems: skin, respiratory, cardiovascular, GI." },
          { id: "management", title: "Prehospital Management", level: 2, content: "Epinephrine 0.3-0.5 mg IM anterolateral thigh (1:1000 concentration) — FIRST-LINE, do not delay. Repeat every 5-15 minutes. Remove allergen if possible. Aggressive IV fluid bolus for hypotension. Albuterol for bronchospasm. Diphenhydramine 25-50 mg IV/IM. Consider IV epinephrine drip for refractory shock." },
        ],
        signsSymptoms: ["Urticaria (hives) and flushing", "Angioedema (face, lips, tongue)", "Stridor and hoarseness", "Wheezing and bronchospasm", "Hypotension and tachycardia", "Abdominal pain, nausea, vomiting", "Sense of impending doom", "Loss of consciousness"],
        assessmentSteps: ["Identify allergen exposure", "Assess airway patency", "Assess breathing and wheezing", "Blood pressure and heart rate", "Skin assessment (urticaria, angioedema)", "GI symptoms", "Prior anaphylaxis history"],
        blsInterventions: ["Remove allergen", "Assist with patient's epinephrine auto-injector", "Supplemental high-flow oxygen", "Position supine with legs elevated (if no respiratory distress)"],
        alsInterventions: ["Epinephrine 0.3-0.5 mg IM (repeat q5-15min)", "IV/IO access with NS bolus 1-2L", "Albuterol nebulized for bronchospasm", "Diphenhydramine 25-50 mg IV/IM", "Methylprednisolone 125 mg IV", "IV epinephrine infusion for refractory cases", "Advanced airway if upper airway compromise"],
        transportDecisions: ["All anaphylaxis patients require ED evaluation", "Rapid transport for airway compromise or refractory hypotension", "Monitor for biphasic reaction (can recur up to 72 hours)"],
        redFlags: ["Stridor or voice changes (impending airway loss)", "Hypotension unresponsive to epinephrine", "Loss of consciousness", "Prior severe anaphylaxis history", "Beta-blocker use (may be refractory to epinephrine)"],
        examTips: ["Epinephrine IM is FIRST-LINE — never delay for IV access or antihistamines", "Epinephrine concentration: IM = 1:1,000 (1 mg/mL), IV = 1:10,000 (0.1 mg/mL)", "Glucagon for anaphylaxis in patients on beta-blockers", "Biphasic reaction occurs in up to 20% of cases — observe in ED"],
        faq: [
          { question: "What is the correct epinephrine dose for anaphylaxis?", answer: "Adult: Epinephrine 0.3-0.5 mg IM (1:1,000 concentration) in the anterolateral thigh. Pediatric: 0.01 mg/kg IM (max 0.3 mg). Auto-injector: adult 0.3 mg, pediatric 0.15 mg. Repeat every 5-15 minutes if symptoms persist. IM route in the thigh provides faster absorption than subcutaneous or deltoid." },
          { question: "Why is epinephrine given IM and not IV for anaphylaxis?", answer: "IM epinephrine in the anterolateral thigh provides rapid, reliable absorption with a safer therapeutic margin than IV bolus. IV epinephrine bolus carries risk of lethal dysrhythmias. IV epinephrine is reserved for cardiac arrest or refractory anaphylactic shock as a continuous infusion (1-10 mcg/min)." },
        ],
        relatedTopicSlugs: ["shortness-of-breath", "shock-types"],
        relatedClusterSlugs: ["ems-medications", "assessment-protocols"],
      },
    ],
  },
  {
    slug: "assessment-protocols",
    title: "Assessment & Protocols",
    metaTitle: "Paramedic Assessment & Protocols — Primary Survey, SAMPLE, OPQRST, Triage | NurseNest",
    metaDescription: "Master paramedic assessment frameworks: ABCDE primary survey, secondary assessment, SAMPLE history, OPQRST, triage systems, and scene safety protocols for certification exams.",
    keywords: "paramedic assessment, primary survey ABCDE, SAMPLE history EMS, OPQRST assessment, triage systems paramedic, scene safety EMS",
    description: "Systematic assessment frameworks form the foundation of competent prehospital care. Master the step-by-step protocols, prioritization logic, and decision-making frameworks tested on paramedic certification exams.",
    icon: "ClipboardCheck",
    color: "#2563EB",
    topics: [
      {
        slug: "primary-survey-abcde",
        title: "Primary Survey ABCDE",
        metaTitle: "Primary Survey ABCDE for Paramedics — Systematic Assessment Guide | NurseNest",
        metaDescription: "Master the ABCDE primary survey framework: airway, breathing, circulation, disability, exposure. Step-by-step prioritization for paramedic certification exams.",
        keywords: "primary survey ABCDE paramedic, ABCDE assessment EMS, systematic primary assessment, paramedic primary survey steps",
        overview: "The ABCDE primary survey is the universal framework for systematic patient assessment in emergency medicine. It ensures life-threatening conditions are identified and treated in order of priority. Every patient contact begins with a primary survey — medical or trauma.",
        sections: [
          { id: "framework", title: "ABCDE Framework", level: 2, content: "A — Airway: Is the airway patent? Look, listen, feel. Manage with positioning, suction, adjuncts, or advanced airway. B — Breathing: Rate, depth, symmetry, work of breathing. SpO2 and ETCO2. Treat with oxygen, ventilation, needle decompression. C — Circulation: Pulse rate and quality, blood pressure, skin signs. Control hemorrhage. IV access and fluids. D — Disability: GCS, pupils, blood glucose, focal deficits. E — Exposure: Undress patient, examine front and back, prevent hypothermia." },
          { id: "priorities", title: "Prioritization Logic", level: 2, content: "Treat life threats as you find them. Do not move to B until A is secured. If the patient deteriorates, restart from A. Trauma: add X (eXsanguinating hemorrhage) before A. Reassess primary survey every 5 minutes for unstable patients, 15 minutes for stable." },
        ],
        assessmentSteps: ["General impression and level of consciousness", "A — Airway assessment and management", "B — Breathing assessment and ventilation", "C — Circulation assessment and hemorrhage control", "D — Disability: GCS, pupils, glucose", "E — Exposure and environmental control"],
        examTips: ["Always start from A if patient deteriorates — don't skip steps", "GCS should be calculated after A and B are secured", "Trauma XABCDE adds hemorrhage control before airway", "Document primary survey findings clearly"],
        faq: [
          { question: "What is the difference between ABCDE and XABCDE?", answer: "XABCDE is the trauma modification of the primary survey. The X stands for eXsanguinating hemorrhage — massive external bleeding that must be controlled before airway management. This reflects evidence that hemorrhage kills faster than airway compromise in trauma patients." },
          { question: "How quickly should a primary survey be completed?", answer: "A primary survey should be completed in 60-90 seconds for critical patients. Findings are acted upon immediately — you treat life threats as you find them rather than completing the entire survey first. The primary survey is repeated at regular intervals." },
        ],
        relatedTopicSlugs: ["secondary-assessment", "sample-history", "triage-systems"],
        relatedClusterSlugs: ["emergency-conditions"],
      },
      {
        slug: "secondary-assessment",
        title: "Secondary Assessment",
        metaTitle: "Secondary Assessment for Paramedics — Head-to-Toe Exam Guide | NurseNest",
        metaDescription: "Master the prehospital secondary assessment: head-to-toe examination, vital sign interpretation, history taking, and ongoing reassessment for paramedic certification.",
        keywords: "secondary assessment paramedic, head to toe assessment EMS, prehospital physical exam, paramedic secondary survey",
        overview: "The secondary assessment follows the primary survey once life threats are addressed. For medical patients, it focuses on history and focused exam. For trauma patients, it is a rapid head-to-toe examination. The secondary assessment is typically performed en route to the hospital.",
        sections: [
          { id: "medical-vs-trauma", title: "Medical vs Trauma Approach", level: 2, content: "Medical patient: history first (OPQRST, SAMPLE), then focused physical exam based on chief complaint. Trauma patient: rapid head-to-toe exam, then focused history. The approach differs because trauma requires identifying injuries that may not be immediately apparent." },
          { id: "head-to-toe", title: "Head-to-Toe Examination", level: 2, content: "Head: DCAP-BTLS (Deformities, Contusions, Abrasions, Punctures, Burns, Tenderness, Lacerations, Swelling). Check pupils, ears, nose. Neck: JVD, tracheal position, crepitus. Chest: symmetry, breath sounds, tenderness. Abdomen: distension, rigidity, tenderness. Pelvis: stability. Extremities: pulses, motor, sensation. Back: log-roll assessment." },
        ],
        assessmentSteps: ["Complete OPQRST and SAMPLE history", "Head and face examination", "Neck assessment (JVD, trachea, c-spine)", "Chest auscultation and palpation", "Abdominal assessment", "Pelvic stability check", "Extremity assessment (PMS)", "Posterior examination", "Full vital signs with trending"],
        examTips: ["Medical patients: history before physical exam", "Trauma patients: physical exam before history", "DCAP-BTLS mnemonic for systematic examination", "Reassess every 5 minutes (unstable) or 15 minutes (stable)"],
        faq: [
          { question: "What does DCAP-BTLS stand for?", answer: "DCAP-BTLS is a systematic assessment mnemonic: Deformities, Contusions, Abrasions, Punctures/Penetrations, Burns, Tenderness, Lacerations, Swelling. It is applied to each body region during the secondary assessment to ensure thorough examination." },
        ],
        relatedTopicSlugs: ["primary-survey-abcde", "opqrst", "sample-history"],
        relatedClusterSlugs: ["emergency-conditions"],
      },
      {
        slug: "sample-history",
        title: "SAMPLE History",
        metaTitle: "SAMPLE History for Paramedics — Patient History Framework | NurseNest",
        metaDescription: "Master the SAMPLE history framework for prehospital patient assessment. Signs/symptoms, allergies, medications, past history, last oral intake, events — for paramedic certification.",
        keywords: "SAMPLE history paramedic, patient history EMS, prehospital history taking, SAMPLE mnemonic paramedic",
        overview: "The SAMPLE history is a standardized framework for gathering essential patient information. It ensures no critical information is missed and provides a structured handoff to receiving facilities. SAMPLE is used on every patient — medical and trauma.",
        sections: [
          { id: "components", title: "SAMPLE Components", level: 2, content: "S — Signs and Symptoms: What the patient is experiencing. Objective findings (signs) and subjective complaints (symptoms). A — Allergies: medications, foods, environmental allergens. Type of reaction. M — Medications: prescription, OTC, supplements, recreational drugs. Doses and compliance. P — Past medical/surgical history: chronic conditions, surgeries, hospitalizations. L — Last oral intake: time and type of last food/drink. Important for surgical decisions. E — Events leading to illness/injury: what happened, timeline, preceding activities." },
        ],
        assessmentSteps: ["Ask about current signs and symptoms", "Document all allergies and reaction types", "List all current medications", "Obtain pertinent past medical history", "Record last oral intake", "Determine events leading to current situation"],
        examTips: ["SAMPLE is used for EVERY patient — don't skip it", "Last oral intake is critical for patients who may need surgery", "Medications provide clues to underlying conditions", "Events help determine mechanism of injury or illness timeline"],
        faq: [
          { question: "Why is last oral intake important in SAMPLE?", answer: "Last oral intake is critical because it affects anesthesia decisions if the patient needs emergency surgery. Full stomach increases aspiration risk during intubation. It also provides clinical context — for example, a diabetic who hasn't eaten suggests hypoglycemia risk." },
        ],
        relatedTopicSlugs: ["opqrst", "primary-survey-abcde", "secondary-assessment"],
        relatedClusterSlugs: ["emergency-conditions"],
      },
      {
        slug: "opqrst",
        title: "OPQRST",
        metaTitle: "OPQRST Pain Assessment for Paramedics — History of Present Illness | NurseNest",
        metaDescription: "Master OPQRST pain assessment: onset, provocation, quality, radiation, severity, time. Structured history of present illness framework for paramedic certification exams.",
        keywords: "OPQRST paramedic, pain assessment EMS, history of present illness, OPQRST mnemonic paramedic, prehospital pain assessment",
        overview: "OPQRST is the structured framework for characterizing a patient's chief complaint, particularly pain. It guides differential diagnosis by systematically exploring the nature, location, and timeline of symptoms. Combined with SAMPLE, OPQRST provides a comprehensive patient history.",
        sections: [
          { id: "components", title: "OPQRST Components", level: 2, content: "O — Onset: When did it start? Sudden vs gradual? What were you doing? P — Provocation/Palliation: What makes it worse? What makes it better? Position changes? Q — Quality: How would you describe it? (crushing, sharp, tearing, burning, aching) R — Radiation: Does it go anywhere else? Point to where you feel it. S — Severity: Rate it 0-10. Compare to worst pain ever experienced. T — Time: How long has it lasted? Constant or intermittent? Getting better, worse, or the same?" },
        ],
        assessmentSteps: ["Ask about onset and circumstances", "Identify provoking and palliating factors", "Have patient describe the quality", "Assess radiation and exact location", "Rate severity on 0-10 scale", "Determine timeline and pattern"],
        examTips: ["Quality descriptors guide differential: crushing = cardiac, tearing = dissection, sharp pleuritic = PE/pneumothorax", "Radiation patterns: jaw/arm = cardiac, back = dissection/pancreatitis, shoulder = diaphragmatic irritation", "Severity changes guide treatment urgency", "Sudden onset is usually more concerning than gradual"],
        faq: [
          { question: "How does OPQRST quality help with diagnosis?", answer: "The quality descriptor narrows the differential diagnosis. Crushing or pressure suggests cardiac ischemia. Tearing or ripping pain radiating to the back suggests aortic dissection. Sharp, pleuritic (worse with breathing) suggests PE, pneumothorax, or pericarditis. Burning epigastric pain suggests GI cause. Colicky pain suggests renal or biliary pathology." },
        ],
        relatedTopicSlugs: ["sample-history", "primary-survey-abcde"],
        relatedClusterSlugs: ["emergency-conditions"],
      },
      {
        slug: "triage-systems",
        title: "Triage Systems",
        metaTitle: "Triage Systems for Paramedics — START, JumpSTART & MCI Management | NurseNest",
        metaDescription: "Master prehospital triage systems: START triage, JumpSTART (pediatric), SALT, and mass casualty incident management. Color coding, rapid assessment, and resource allocation for paramedic certification.",
        keywords: "triage systems paramedic, START triage EMS, JumpSTART pediatric triage, mass casualty incident, MCI triage paramedic",
        overview: "Triage is the process of sorting patients by severity to allocate limited resources during mass casualty incidents (MCIs). START (Simple Triage and Rapid Treatment) is the most widely used adult triage system. JumpSTART is the pediatric adaptation. Understanding triage categories and decision algorithms is essential for paramedic certification.",
        sections: [
          { id: "start", title: "START Triage", level: 2, content: "Assess in 30-60 seconds per patient. Walking? → GREEN (minor). Breathing? No → reposition airway → still no breathing → BLACK (deceased). Breathing > 30/min → RED (immediate). Radial pulse absent or cap refill > 2 sec → RED. Cannot follow commands → RED. All else → YELLOW (delayed)." },
          { id: "colors", title: "Triage Categories", level: 2, content: "RED (Immediate): life-threatening, treatable. YELLOW (Delayed): serious but can wait. GREEN (Minor): walking wounded. BLACK (Deceased/Expectant): dead or unsurvivable injuries. Priority of treatment: RED → YELLOW → GREEN." },
          { id: "jumpstart", title: "JumpSTART (Pediatric)", level: 2, content: "Modified START for children. Key difference: if not breathing after repositioning airway, give 5 rescue breaths. If spontaneous breathing resumes → RED. If no breathing → BLACK. Respiratory rate assessment: < 15 or > 45 → RED (different from adult thresholds)." },
        ],
        assessmentSteps: ["Establish incident command", "Direct walking wounded to GREEN area", "Systematically assess non-ambulatory patients", "30-60 seconds per patient using START algorithm", "Apply color-coded triage tags", "Perform only life-saving interventions during triage"],
        examTips: ["START triage only — do NOT provide treatment during initial triage pass", "Exception: open the airway and apply tourniquet only", "JumpSTART adds 5 rescue breaths before BLACK designation", "Know the respiratory rate cutoffs: adult > 30, pediatric < 15 or > 45"],
        faq: [
          { question: "What is the difference between START and JumpSTART?", answer: "JumpSTART is the pediatric modification of START triage. The key difference is that if a child is not breathing after airway repositioning, you give 5 rescue breaths before designating them BLACK. In START (adult), no breathing after repositioning = BLACK immediately. JumpSTART also uses different respiratory rate thresholds: < 15 or > 45 = RED." },
          { question: "What interventions are allowed during initial triage?", answer: "During the initial triage pass, only two interventions are permitted: repositioning the airway and applying a tourniquet for life-threatening hemorrhage. All other treatment is deferred until triage is complete and treatment areas are established. This ensures the greatest number of patients receive life-saving care." },
        ],
        relatedTopicSlugs: ["scene-safety", "primary-survey-abcde"],
        relatedClusterSlugs: ["emergency-conditions"],
      },
      {
        slug: "scene-safety",
        title: "Scene Safety",
        metaTitle: "Scene Safety for Paramedics — Hazard Assessment & BSI Precautions | NurseNest",
        metaDescription: "Master prehospital scene safety: hazard recognition, BSI/PPE selection, scene security, and dynamic risk assessment for paramedic certification exams.",
        keywords: "scene safety paramedic, BSI precautions EMS, prehospital scene assessment, hazard recognition paramedic, EMS scene safety",
        overview: "Scene safety is the first and most critical step in every EMS response. A paramedic who becomes a patient doubles the problem and halves the resources. Scene safety assessment is dynamic — conditions change, and threats may not be immediately apparent.",
        sections: [
          { id: "assessment", title: "Scene Safety Assessment", level: 2, content: "BSI/PPE: select appropriate equipment before patient contact. Scene safety: assess for hazards (traffic, fire, hazmat, violence, structural). Number of patients: request additional resources early. Mechanism of injury/nature of illness: guides assessment approach. Additional resources: fire, police, hazmat, additional ambulances." },
          { id: "hazards", title: "Common Hazard Categories", level: 2, content: "Traffic: park apparatus to create barrier, wear high-visibility vests. Violence: wait for law enforcement, plan exit route. Hazmat: identify placards, maintain safe distance, uphill/upwind. Electrical: downed power lines (100-foot danger zone). Fire/structural: wait for fire department clearance. Biohazard: appropriate PPE for blood/airborne pathogens." },
        ],
        assessmentSteps: ["BSI/PPE selection", "Survey for environmental hazards", "Assess for violence or security threats", "Determine number of patients", "Identify mechanism of injury or nature of illness", "Request additional resources if needed", "Establish safe approach route", "Continuous dynamic reassessment"],
        examTips: ["Scene safety is ALWAYS the first answer on exam questions", "If the scene is unsafe — do NOT enter, wait for appropriate resources", "BSI precautions include: gloves (always), mask/eye protection (splash risk), gown (significant blood)", "Scene safety is dynamic — reassess continuously"],
        faq: [
          { question: "What should a paramedic do if they arrive on scene and it is unsafe?", answer: "Do NOT enter an unsafe scene. Stage at a safe distance. Request appropriate resources (law enforcement for violence, fire for hazmat/fire, utility company for downed power lines). Provide dispatch with situation updates. Enter only when the scene has been declared safe by the appropriate authority." },
        ],
        relatedTopicSlugs: ["primary-survey-abcde", "triage-systems"],
        relatedClusterSlugs: ["emergency-conditions"],
      },
    ],
  },
  {
    slug: "ems-medications",
    title: "EMS Medications",
    metaTitle: "EMS Medications for Paramedics — Pharmacology Guide with Dosages | NurseNest",
    metaDescription: "Master prehospital pharmacology: epinephrine, nitroglycerin, albuterol, naloxone, aspirin, dextrose. Indications, contraindications, dosages, routes, and clinical scenarios for paramedic certification.",
    keywords: "EMS medications paramedic, prehospital pharmacology, paramedic drug guide, emergency medications EMS, paramedic medication dosages",
    description: "Complete pharmacology reference for the most critical prehospital medications. Each drug profile covers indications, contraindications, adult and pediatric dosing, routes, side effects, and clinical scenarios tested on paramedic certification exams.",
    icon: "Pill",
    color: "#059669",
    topics: [
      {
        slug: "epinephrine",
        title: "Epinephrine",
        metaTitle: "Epinephrine for Paramedics — Dosing, Indications & Clinical Scenarios | NurseNest",
        metaDescription: "Master prehospital epinephrine: cardiac arrest dosing (1mg IV), anaphylaxis dosing (0.3mg IM), concentrations, routes, and clinical decision-making for paramedic certification.",
        keywords: "epinephrine paramedic, epinephrine dosing EMS, epinephrine cardiac arrest, epinephrine anaphylaxis dose, adrenaline prehospital",
        overview: "Epinephrine is the most important emergency medication in the paramedic drug box. It is used in cardiac arrest, anaphylaxis, severe asthma, and symptomatic bradycardia. Understanding the different concentrations, doses, and routes for each indication is critical and a high-yield exam topic.",
        sections: [
          { id: "pharmacology", title: "Pharmacology", level: 2, content: "Classification: sympathomimetic (catecholamine). Mechanism: stimulates alpha-1 (vasoconstriction), beta-1 (increased heart rate and contractility), and beta-2 (bronchodilation) receptors. Onset: IV immediate, IM 5-10 minutes. Duration: 5-10 minutes." },
          { id: "clinical-use", title: "Clinical Applications", level: 2, content: "Cardiac arrest: 1 mg IV/IO every 3-5 minutes. Anaphylaxis: 0.3-0.5 mg IM (1:1,000). Severe asthma: 0.3 mg IM or nebulized. Symptomatic bradycardia: 2-10 mcg/min IV infusion. Croup: racemic epinephrine nebulized." },
        ],
        indications: ["Cardiac arrest (all rhythms)", "Anaphylaxis", "Severe bronchospasm", "Symptomatic bradycardia (infusion)", "Croup (racemic, nebulized)"],
        contraindications: ["No absolute contraindications in cardiac arrest or anaphylaxis", "Relative: hypertension, tachyarrhythmias, coronary artery disease"],
        dosageAdult: "Cardiac arrest: 1 mg IV/IO q3-5min. Anaphylaxis: 0.3-0.5 mg IM. Bradycardia: 2-10 mcg/min IV infusion.",
        dosagePediatric: "Cardiac arrest: 0.01 mg/kg IV/IO q3-5min (max 1 mg). Anaphylaxis: 0.01 mg/kg IM (max 0.3 mg). Auto-injector: < 30 kg = 0.15 mg, ≥ 30 kg = 0.3 mg.",
        routes: ["IV/IO (cardiac arrest)", "IM (anaphylaxis — anterolateral thigh)", "Nebulized (croup)", "IV infusion (bradycardia/shock)"],
        sideEffects: ["Tachycardia", "Hypertension", "Tremor", "Anxiety", "Dysrhythmias", "Myocardial ischemia"],
        clinicalScenarios: ["Cardiac arrest VF/VT: 1 mg IV after second shock, then q3-5min", "Anaphylaxis with stridor: 0.3 mg IM immediately, repeat in 5 min if no improvement", "Refractory anaphylactic shock: IV infusion 1-10 mcg/min"],
        examTips: ["Know the concentrations: 1:1,000 (1 mg/mL) for IM, 1:10,000 (0.1 mg/mL) for IV", "Cardiac arrest: give after second shock for shockable rhythms, immediately for non-shockable", "Anaphylaxis: IM in thigh is first-line — never delay for IV access", "No contraindications in true cardiac arrest or anaphylaxis"],
        faq: [
          { question: "What is the difference between 1:1,000 and 1:10,000 epinephrine?", answer: "1:1,000 = 1 mg/mL concentration, used for IM injection (anaphylaxis). 1:10,000 = 0.1 mg/mL concentration, used for IV/IO administration (cardiac arrest). The 10x dilution for IV use reduces the risk of adverse cardiovascular effects from a rapid IV bolus." },
        ],
        relatedTopicSlugs: ["naloxone", "nitroglycerin", "albuterol"],
        relatedClusterSlugs: ["emergency-conditions", "ecg-cardiac"],
      },
      {
        slug: "nitroglycerin",
        title: "Nitroglycerin",
        metaTitle: "Nitroglycerin for Paramedics — Dosing, Contraindications & Clinical Use | NurseNest",
        metaDescription: "Master prehospital nitroglycerin: sublingual dosing, contraindications (right-sided MI, PDE inhibitors), CHF management, and clinical decision-making for paramedic certification.",
        keywords: "nitroglycerin paramedic, nitroglycerin dosing EMS, NTG prehospital, nitroglycerin contraindications, sublingual nitroglycerin paramedic",
        overview: "Nitroglycerin is a potent vasodilator used for chest pain (ACS) and acute pulmonary edema (CHF). It reduces preload and afterload, decreasing myocardial oxygen demand. Understanding contraindications — particularly right-sided MI and PDE inhibitor use — is a high-yield exam topic.",
        sections: [
          { id: "pharmacology", title: "Pharmacology", level: 2, content: "Classification: nitrate vasodilator. Mechanism: releases nitric oxide, causing venous dilation (primarily) and arterial dilation. Reduces preload, afterload, and myocardial oxygen demand. Onset: SL 1-3 minutes. Duration: 25-30 minutes." },
          { id: "clinical-use", title: "Clinical Applications", level: 2, content: "Chest pain (ACS): 0.4 mg SL every 5 minutes x3 (if SBP > 90). Acute pulmonary edema: 0.4 mg SL, may repeat. Hypertensive emergency with pulmonary edema: SL or IV infusion. Always check blood pressure before each dose." },
        ],
        indications: ["Chest pain / Acute Coronary Syndrome", "Acute pulmonary edema (CHF)", "Hypertensive emergency with cardiac symptoms"],
        contraindications: ["SBP < 90 mmHg", "PDE inhibitor use (sildenafil within 24h, tadalafil within 48h)", "Right ventricular infarction", "Severe aortic stenosis", "Hypertrophic cardiomyopathy", "Increased intracranial pressure"],
        dosageAdult: "0.4 mg SL every 5 minutes, max 3 doses. Reassess BP before each dose.",
        dosagePediatric: "Generally not used in pediatric prehospital care.",
        routes: ["Sublingual tablet or spray", "IV infusion (hospital setting)"],
        sideEffects: ["Hypotension", "Headache", "Tachycardia (reflex)", "Dizziness", "Syncope"],
        clinicalScenarios: ["ACS with SBP 140: administer 0.4 mg SL, reassess pain and BP in 5 min", "Inferior STEMI: check for right-sided involvement before NTG — right-sided MI is preload-dependent", "CHF with crackles and SBP 180: NTG 0.4 mg SL for symptom relief"],
        examTips: ["Always ask about erectile dysfunction medications (PDE inhibitors) before NTG", "Right-sided MI (inferior STEMI): NTG can cause severe hypotension", "NTG is a venodilator primarily — reduces preload", "Headache is the most common side effect (vasodilation)"],
        faq: [
          { question: "Why is nitroglycerin contraindicated in right ventricular MI?", answer: "Right ventricular MI makes the heart preload-dependent — it needs adequate venous return to maintain cardiac output. Nitroglycerin is a potent venodilator that reduces preload, potentially causing severe hypotension and cardiogenic shock. Suspect right-sided MI in any inferior STEMI with hypotension. Obtain V4R lead for confirmation." },
        ],
        relatedTopicSlugs: ["epinephrine", "aspirin"],
        relatedClusterSlugs: ["emergency-conditions", "ecg-cardiac"],
      },
      {
        slug: "albuterol",
        title: "Albuterol",
        metaTitle: "Albuterol for Paramedics — Nebulizer Dosing & Bronchospasm Management | NurseNest",
        metaDescription: "Master prehospital albuterol: nebulizer dosing, MDI administration, combination therapy with ipratropium, and bronchospasm management for paramedic certification.",
        keywords: "albuterol paramedic, albuterol nebulizer EMS, bronchospasm treatment prehospital, salbutamol EMS, albuterol dosing paramedic",
        overview: "Albuterol (salbutamol) is the first-line bronchodilator for acute bronchospasm in the prehospital setting. It is a selective beta-2 agonist that relaxes bronchial smooth muscle. Used for asthma, COPD exacerbation, and anaphylaxis-related bronchospasm.",
        sections: [
          { id: "pharmacology", title: "Pharmacology", level: 2, content: "Classification: beta-2 adrenergic agonist (sympathomimetic bronchodilator). Mechanism: stimulates beta-2 receptors on bronchial smooth muscle causing relaxation and bronchodilation. Onset: 5-15 minutes inhaled. Duration: 3-6 hours." },
          { id: "clinical-use", title: "Clinical Applications", level: 2, content: "Asthma exacerbation: 2.5 mg nebulized, repeat every 15-20 min x3. COPD exacerbation: 2.5 mg nebulized + ipratropium 0.5 mg. Severe bronchospasm: continuous nebulization. Often combined with ipratropium bromide for synergistic effect." },
        ],
        indications: ["Acute bronchospasm (asthma, COPD)", "Wheezing associated with anaphylaxis", "Hyperkalemia (drives potassium intracellularly)"],
        contraindications: ["Known hypersensitivity", "Use with caution in cardiac patients (tachycardia risk)"],
        dosageAdult: "2.5 mg nebulized every 15-20 min x3, or continuous nebulization for severe bronchospasm.",
        dosagePediatric: "0.15 mg/kg (min 2.5 mg) nebulized every 20 min x3.",
        routes: ["Nebulizer (most common prehospital)", "Metered-dose inhaler (MDI) with spacer: 4-8 puffs"],
        sideEffects: ["Tachycardia", "Tremor", "Anxiety", "Palpitations", "Hypokalemia (with repeated doses)"],
        clinicalScenarios: ["Asthma with diffuse wheezing: 2.5 mg nebulized + ipratropium 0.5 mg first treatment", "COPD with increased work of breathing: albuterol + ipratropium + consider CPAP", "Hyperkalemia with peaked T waves: albuterol 10-20 mg nebulized (cardiac dose)"],
        examTips: ["Albuterol is also known as salbutamol (international name)", "Combine with ipratropium (Atrovent) for synergistic bronchodilation", "Tachycardia is the most common side effect — monitor cardiac patients", "High-dose nebulized albuterol can be used for hyperkalemia"],
        faq: [
          { question: "Why is albuterol combined with ipratropium?", answer: "Albuterol (beta-2 agonist) and ipratropium (anticholinergic) work through different mechanisms to produce synergistic bronchodilation. The combination provides faster onset, greater peak bronchodilation, and longer duration than either drug alone. The combination is standard of care for the first treatment of acute bronchospasm." },
        ],
        relatedTopicSlugs: ["epinephrine", "naloxone"],
        relatedClusterSlugs: ["emergency-conditions"],
      },
      {
        slug: "naloxone",
        title: "Naloxone",
        metaTitle: "Naloxone for Paramedics — Opioid Reversal Dosing & Clinical Guide | NurseNest",
        metaDescription: "Master prehospital naloxone: opioid overdose reversal, titration technique, intranasal administration, and re-sedation monitoring for paramedic certification.",
        keywords: "naloxone paramedic, narcan EMS, opioid overdose reversal, naloxone dosing prehospital, intranasal naloxone paramedic",
        overview: "Naloxone (Narcan) is a pure opioid antagonist that reverses respiratory depression from opioid overdose. It is a life-saving medication in the current opioid crisis. Paramedics must balance effective reversal of respiratory depression with avoiding precipitating severe withdrawal in opioid-dependent patients.",
        sections: [
          { id: "pharmacology", title: "Pharmacology", level: 2, content: "Classification: opioid antagonist. Mechanism: competitively binds opioid receptors (mu, kappa, delta), displacing opioid agonists. Onset: IV 1-2 min, IM 3-5 min, IN 3-5 min. Duration: 30-90 minutes (shorter than most opioids — risk of re-sedation)." },
          { id: "titration", title: "Titration Strategy", level: 2, content: "Goal: restore adequate respiratory drive, NOT full consciousness. Start low in suspected opioid-dependent patients: 0.04-0.1 mg IV, titrate to respiratory rate > 12. Full dose (0.4-2 mg) for non-dependent or respiratory arrest. Intranasal: 4 mg via atomizer (higher dose needed due to bioavailability)." },
        ],
        indications: ["Opioid overdose with respiratory depression", "Suspected opioid toxicity with altered mental status", "Diagnostic aid for altered mental status of unknown etiology"],
        contraindications: ["Known hypersensitivity", "Use with caution in opioid-dependent patients (precipitate withdrawal)"],
        dosageAdult: "0.4-2 mg IV/IO/IM/SC. IN: 4 mg. May repeat every 2-3 min. Titrate to respiratory effort.",
        dosagePediatric: "0.1 mg/kg IV/IO/IM (max 2 mg). May repeat every 2-3 min.",
        routes: ["IV/IO (fastest onset)", "IM/SC", "Intranasal (4 mg atomizer)", "Nebulized (off-label)"],
        sideEffects: ["Acute opioid withdrawal (nausea, vomiting, agitation, diaphoresis)", "Pulmonary edema (rare)", "Hypertension", "Tachycardia", "Seizures (in mixed overdose)"],
        clinicalScenarios: ["Pinpoint pupils, RR 4, needle track marks: start with 0.04-0.1 mg IV, titrate to RR > 12", "Apneic opioid overdose: 2 mg IV/IO, BVM ventilation while awaiting onset", "IN naloxone in field: 4 mg via MAD, may need to repeat (shorter acting than some synthetic opioids)"],
        examTips: ["Naloxone duration is SHORTER than most opioids — patient may re-sedate", "Titrate to respiratory effort, not full consciousness in opioid-dependent patients", "IN dose is HIGHER than IV (4 mg vs 0.4-2 mg) due to bioavailability", "Fentanyl analogs may require higher or repeated doses of naloxone"],
        faq: [
          { question: "Why do patients need monitoring after naloxone?", answer: "Naloxone has a shorter duration of action (30-90 minutes) than most opioids (2-6+ hours). As naloxone wears off, the opioid effect can return, causing re-sedation and respiratory depression. This is why all patients who receive naloxone must be transported and monitored, even if they appear to fully recover." },
        ],
        relatedTopicSlugs: ["epinephrine", "dextrose"],
        relatedClusterSlugs: ["emergency-conditions"],
      },
      {
        slug: "aspirin",
        title: "Aspirin",
        metaTitle: "Aspirin for Paramedics — ACS Treatment & Prehospital Use | NurseNest",
        metaDescription: "Master prehospital aspirin administration: ACS dosing, mechanism of antiplatelet action, contraindications, and clinical decision-making for paramedic certification.",
        keywords: "aspirin paramedic, aspirin ACS prehospital, aspirin chest pain EMS, antiplatelet therapy paramedic, aspirin dosing paramedic",
        overview: "Aspirin is one of the most impactful interventions in acute coronary syndrome, reducing mortality by up to 23%. It should be administered as early as possible to any patient with suspected ACS who has no contraindications. Chewing provides faster absorption than swallowing.",
        sections: [
          { id: "pharmacology", title: "Pharmacology", level: 2, content: "Classification: antiplatelet agent (NSAID). Mechanism: irreversibly inhibits cyclooxygenase (COX-1), preventing thromboxane A2 synthesis and platelet aggregation. Onset: chewed 5 min, swallowed 30 min. Duration: 7-10 days (lifespan of affected platelets)." },
          { id: "clinical-use", title: "Clinical Application", level: 2, content: "Suspected ACS: 324 mg (4 x 81 mg baby aspirin) chewed as early as possible. The patient should chew the tablets for faster absorption. One of the few medications with Level 1A evidence for reducing mortality in MI." },
        ],
        indications: ["Suspected acute coronary syndrome", "Chest pain of suspected cardiac origin", "STEMI"],
        contraindications: ["Known aspirin allergy", "Active GI bleeding", "Severe asthma exacerbated by aspirin", "Recent hemorrhagic stroke"],
        dosageAdult: "324 mg PO (chewed) for suspected ACS.",
        dosagePediatric: "Not typically used prehospital for pediatric patients.",
        routes: ["Oral (chewed for rapid absorption)"],
        sideEffects: ["GI upset", "Bleeding risk", "Tinnitus (toxicity)", "Bronchospasm (aspirin-sensitive asthma)"],
        examTips: ["CHEWED, not swallowed — chewing provides 5x faster absorption", "324 mg = 4 baby aspirin (81 mg each)", "One of the few prehospital medications with mortality reduction evidence", "Check for aspirin allergy — contraindication is absolute"],
        faq: [
          { question: "Why must aspirin be chewed rather than swallowed whole?", answer: "Chewing aspirin bypasses the enteric coating and allows direct absorption through the oral mucosa and faster GI absorption. Chewed aspirin achieves therapeutic antiplatelet levels in approximately 5 minutes versus 30+ minutes for swallowed tablets. In ACS, every minute of delayed antiplatelet therapy matters." },
        ],
        relatedTopicSlugs: ["nitroglycerin", "epinephrine"],
        relatedClusterSlugs: ["emergency-conditions", "ecg-cardiac"],
      },
      {
        slug: "dextrose",
        title: "Dextrose",
        metaTitle: "Dextrose for Paramedics — Hypoglycemia Treatment & IV Administration | NurseNest",
        metaDescription: "Master prehospital dextrose: D10W vs D50W dosing, IV administration, glucagon alternative, and hypoglycemia management for paramedic certification.",
        keywords: "dextrose paramedic, D10W prehospital, D50W dosing, hypoglycemia treatment EMS, dextrose IV paramedic",
        overview: "Dextrose is the definitive treatment for symptomatic hypoglycemia in the prehospital setting. D10W is increasingly preferred over D50W due to lower osmolarity and reduced tissue injury risk. Rapid glucose correction can be life-saving for patients with altered mental status from hypoglycemia.",
        sections: [
          { id: "pharmacology", title: "Pharmacology", level: 2, content: "Classification: simple carbohydrate (glucose supplement). Mechanism: directly provides glucose to raise blood sugar levels. Onset: IV immediate. Duration: depends on underlying cause of hypoglycemia." },
          { id: "clinical-use", title: "Clinical Applications", level: 2, content: "Hypoglycemia (BG < 60 mg/dL) with AMS: D10W 250 mL (25g) IV, or D50W 50 mL (25g) IV. Recheck glucose after administration. May repeat if blood glucose remains low. Alternative when no IV: glucagon 1 mg IM. Conscious patient: oral glucose." },
        ],
        indications: ["Symptomatic hypoglycemia", "Altered mental status with blood glucose < 60 mg/dL", "Seizures secondary to hypoglycemia", "Neonatal hypoglycemia (D10W only)"],
        contraindications: ["Hyperglycemia", "No IV access (use glucagon IM instead)"],
        dosageAdult: "D10W: 250 mL (25g) IV. D50W: 50 mL (25g) IV push.",
        dosagePediatric: "D10W: 5 mL/kg IV. Neonates: D10W 2 mL/kg IV. Never use D50W in pediatrics.",
        routes: ["IV (D10W preferred)", "IV push (D50W)"],
        sideEffects: ["Tissue necrosis if D50W infiltrates", "Hyperglycemia (if over-corrected)", "Phlebitis at injection site"],
        examTips: ["D10W is preferred over D50W — safer osmolarity, less tissue damage", "Never use D50W in pediatric or neonatal patients", "Always recheck glucose 5-10 minutes after administration", "Glucagon is the alternative when IV access is unavailable"],
        faq: [
          { question: "Why is D10W preferred over D50W?", answer: "D10W has lower osmolarity (505 mOsm/L vs 2,525 mOsm/L for D50W), which means less risk of tissue necrosis if the IV infiltrates. It also allows more controlled glucose correction and reduces the risk of rebound hyperglycemia. The total dextrose delivered is the same (25g), just in a larger volume (250 mL vs 50 mL)." },
        ],
        relatedTopicSlugs: ["naloxone", "epinephrine"],
        relatedClusterSlugs: ["emergency-conditions"],
      },
    ],
  },
  {
    slug: "ecg-cardiac",
    title: "ECG & Cardiac",
    metaTitle: "ECG & Cardiac Interpretation for Paramedics — Rhythm Recognition Guide | NurseNest",
    metaDescription: "Master paramedic ECG interpretation: basic ECG reading, sinus vs arrhythmias, STEMI recognition, tachycardia vs bradycardia management, and heart blocks for certification exams.",
    keywords: "ECG interpretation paramedic, cardiac rhythm recognition, STEMI paramedic, heart blocks EMS, tachycardia bradycardia paramedic, 12 lead ECG prehospital",
    description: "Comprehensive ECG interpretation and cardiac rhythm recognition guides for paramedic certification. Master rhythm identification, clinical implications, and treatment algorithms tested on NREMT and provincial exams.",
    icon: "Activity",
    color: "#7C3AED",
    topics: [
      {
        slug: "basic-ecg-interpretation",
        title: "Basic ECG Interpretation",
        metaTitle: "Basic ECG Interpretation for Paramedics — Reading ECGs Step by Step | NurseNest",
        metaDescription: "Master basic ECG interpretation: PQRST complex, rate calculation, rhythm analysis, axis determination, and systematic 12-lead reading for paramedic certification.",
        keywords: "basic ECG interpretation paramedic, reading ECG paramedic, PQRST complex, ECG rate calculation, 12 lead ECG basics",
        overview: "ECG interpretation is a foundational paramedic skill. Every cardiac patient requires rhythm assessment, and 12-lead ECGs are standard for chest pain evaluation. Systematic interpretation prevents missed findings.",
        sections: [
          { id: "pqrst", title: "PQRST Complex", level: 2, content: "P wave: atrial depolarization (should be upright in lead II, one P before each QRS). PR interval: 0.12-0.20 sec (conduction through AV node). QRS complex: ventricular depolarization (< 0.12 sec = narrow/normal). ST segment: between ventricular depolarization and repolarization (should be isoelectric). T wave: ventricular repolarization. QT interval: < 0.44 sec (rate-corrected)." },
          { id: "systematic-approach", title: "Systematic Interpretation", level: 2, content: "Rate → Rhythm → P waves → PR interval → QRS width → ST segment → T waves. Rate: 300 ÷ number of large boxes between R waves (for regular rhythms). Rhythm: regular or irregular? Regularly irregular or irregularly irregular? P waves: present? Upright in lead II? One P per QRS? PR interval: constant? Within normal range? QRS: narrow or wide?" },
        ],
        rhythmCharacteristics: ["Rate: 60-100 bpm normal sinus", "Regular R-R intervals", "Upright P waves in lead II", "PR interval 0.12-0.20 sec", "Narrow QRS < 0.12 sec", "Isoelectric ST segment", "Upright T waves"],
        identificationSteps: ["Calculate heart rate", "Assess rhythm regularity", "Identify P waves", "Measure PR interval", "Measure QRS duration", "Evaluate ST segment", "Assess T wave morphology"],
        examTips: ["300/150/100/75/60/50 — memorize the rate sequence for large boxes", "Irregularly irregular with no P waves = atrial fibrillation", "Wide QRS (> 0.12 sec) = either ventricular origin or bundle branch block", "Always compare to prior ECGs when available"],
        faq: [
          { question: "How do you quickly calculate heart rate from an ECG?", answer: "For regular rhythms: 300 ÷ (number of large boxes between two R waves). Sequence: 1 box = 300, 2 boxes = 150, 3 = 100, 4 = 75, 5 = 60, 6 = 50 bpm. For irregular rhythms: count the number of QRS complexes in a 6-second strip and multiply by 10." },
          { question: "What makes a QRS complex wide vs narrow?", answer: "Normal QRS is < 0.12 seconds (3 small boxes). Wide QRS (≥ 0.12 sec) indicates abnormal ventricular conduction — either the impulse originates in the ventricle (PVCs, ventricular tachycardia) or there is a bundle branch block delaying conduction through normal pathways." },
        ],
        relatedTopicSlugs: ["sinus-vs-arrhythmias", "stemi-recognition", "heart-blocks"],
        relatedClusterSlugs: ["emergency-conditions", "ems-medications"],
      },
      {
        slug: "sinus-vs-arrhythmias",
        title: "Sinus vs Arrhythmias",
        metaTitle: "Sinus Rhythms vs Arrhythmias for Paramedics — Rhythm Differentiation Guide | NurseNest",
        metaDescription: "Master differentiating sinus rhythms from arrhythmias: sinus bradycardia/tachycardia, atrial fibrillation/flutter, SVT, PVCs, ventricular tachycardia for paramedic certification.",
        keywords: "sinus rhythm vs arrhythmia paramedic, atrial fibrillation EMS, SVT paramedic, ventricular tachycardia recognition, cardiac arrhythmias prehospital",
        overview: "Rhythm recognition is a critical paramedic skill. You must differentiate normal sinus variants from potentially lethal arrhythmias within seconds. Treatment decisions — observation, medication, cardioversion, or defibrillation — depend entirely on accurate rhythm identification.",
        sections: [
          { id: "sinus-rhythms", title: "Sinus Rhythm Variants", level: 2, content: "Normal Sinus Rhythm: rate 60-100, regular, P before each QRS. Sinus Bradycardia: rate < 60, same morphology. Sinus Tachycardia: rate > 100, same morphology (physiologic response). Sinus Arrhythmia: irregular rate that varies with respiration (normal variant)." },
          { id: "atrial-arrhythmias", title: "Atrial Arrhythmias", level: 2, content: "Atrial Fibrillation: irregularly irregular, no discernible P waves, fibrillatory baseline. Atrial Flutter: sawtooth flutter waves (rate ~300), regular or irregular ventricular response. SVT (AVNRT/AVRT): narrow complex, rate 150-250, sudden onset and offset." },
          { id: "ventricular-arrhythmias", title: "Ventricular Arrhythmias", level: 2, content: "PVCs: wide, bizarre QRS without preceding P wave. Ventricular Tachycardia: wide complex tachycardia (> 3 consecutive PVCs). Ventricular Fibrillation: chaotic, no organized electrical activity. When in doubt about wide-complex tachycardia, treat as VT." },
        ],
        rhythmCharacteristics: ["Sinus: upright P in II, constant PR, narrow QRS", "A-fib: irregularly irregular, no P waves", "A-flutter: sawtooth waves at ~300/min", "SVT: narrow complex, rate 150-250", "VT: wide complex, rate > 100", "VF: chaotic, no organized pattern"],
        identificationSteps: ["Is it regular or irregular?", "Is the rate fast or slow?", "Are P waves present?", "Is the QRS narrow or wide?", "What is the relationship between P and QRS?"],
        clinicalImplications: ["Sinus brady: treat only if symptomatic (atropine, pacing)", "SVT: vagal maneuvers → adenosine 6 mg rapid IV push", "New A-fib with RVR: rate control (diltiazem)", "VT with pulse: amiodarone 150 mg IV, consider cardioversion", "VF/pulseless VT: immediate defibrillation"],
        treatmentPriorities: ["Identify rhythm", "Assess hemodynamic stability", "Treat per ACLS algorithm", "Continuous monitoring", "Reassess after intervention"],
        examTips: ["Wide and fast = assume VT until proven otherwise", "SVT at exactly 150 bpm → consider atrial flutter with 2:1 block", "Adenosine: must give rapid IV push with 20 mL NS flush — has 10-sec half-life", "Stable = medication, unstable = cardioversion/defibrillation"],
        faq: [
          { question: "How do you differentiate SVT from sinus tachycardia?", answer: "SVT typically has a rate > 150 bpm with sudden onset/offset, no visible P waves, and often a regular narrow-complex rhythm. Sinus tachycardia has a gradual onset/offset, visible P waves before each QRS, rate rarely exceeds 150 (unless in significant physiologic stress), and the rate changes with the underlying cause (pain, dehydration, etc.)." },
        ],
        relatedTopicSlugs: ["basic-ecg-interpretation", "stemi-recognition", "tachycardia-vs-bradycardia"],
        relatedClusterSlugs: ["emergency-conditions", "ems-medications"],
      },
      {
        slug: "stemi-recognition",
        title: "STEMI Recognition",
        metaTitle: "STEMI Recognition for Paramedics — 12-Lead ECG & Cath Lab Activation | NurseNest",
        metaDescription: "Master prehospital STEMI recognition: ST elevation criteria, reciprocal changes, STEMI equivalents, coronary artery localization, and cath lab activation for paramedic certification.",
        keywords: "STEMI recognition paramedic, 12 lead ECG STEMI, ST elevation myocardial infarction, cath lab activation EMS, prehospital STEMI",
        overview: "STEMI recognition is one of the most impactful skills a paramedic can master. Prehospital 12-lead ECG acquisition and STEMI identification reduces door-to-balloon time by 15-20 minutes. Early recognition triggers cath lab activation, directly improving patient survival.",
        sections: [
          { id: "criteria", title: "STEMI Criteria", level: 2, content: "ST elevation ≥ 1 mm in two or more contiguous limb leads, OR ≥ 2 mm in two or more contiguous precordial leads. Must have reciprocal ST depression in opposing leads (differentiates from benign early repolarization or pericarditis). New or presumably new findings." },
          { id: "localization", title: "Coronary Artery Localization", level: 2, content: "Anterior (LAD): V1-V4. Lateral (LCx): I, aVL, V5-V6. Inferior (RCA): II, III, aVF. Posterior: tall R waves V1-V3, ST depression V1-V4 (mirror image). Right Ventricle: V4R ST elevation > 1mm with inferior STEMI." },
          { id: "equivalents", title: "STEMI Equivalents", level: 2, content: "New LBBB in setting of chest pain (Sgarbossa criteria). De Winter T waves (upsloping ST depression with tall symmetric T waves in precordial leads = proximal LAD occlusion). Wellens syndrome (deep T-wave inversions V2-V3 = critical LAD stenosis). Posterior MI (ST depression V1-V4 with tall R waves)." },
        ],
        rhythmCharacteristics: ["ST elevation in contiguous leads", "Reciprocal ST depression", "Possible pathological Q waves", "T wave changes (hyperacute, inverted)", "Possible new arrhythmias"],
        identificationSteps: ["Acquire 12-lead ECG within 10 min of patient contact", "Systematic lead-by-lead ST segment analysis", "Look for ST elevation in contiguous leads", "Identify reciprocal changes", "Check for STEMI equivalents (LBBB, posterior, de Winter)", "If inferior STEMI: obtain V4R for right-sided involvement"],
        clinicalImplications: ["Activate cath lab via prehospital notification", "Target door-to-balloon < 90 minutes", "Administer aspirin, nitroglycerin (if no contraindications)", "Serial 12-lead ECGs every 15 minutes", "Prepare for potential cardiac arrest"],
        treatmentPriorities: ["Early 12-lead ECG acquisition", "Rapid STEMI identification", "Cath lab activation", "Antiplatelet therapy (aspirin)", "Pain management", "Continuous cardiac monitoring"],
        examTips: ["Contiguous leads: I-aVL, II-III-aVF, V1-V2-V3-V4, V5-V6", "Always look for reciprocal changes to confirm STEMI", "Inferior STEMI: always check V4R for right ventricular involvement", "Posterior MI: flip the ECG over (mirror image) — ST depression becomes elevation"],
        faq: [
          { question: "What are contiguous leads on a 12-lead ECG?", answer: "Contiguous leads look at the same area of the heart: Anterior (V1-V4), Lateral (I, aVL, V5-V6), Inferior (II, III, aVF). STEMI requires ST elevation in at least 2 contiguous leads. For example, ST elevation in leads II and III (both inferior) suggests inferior STEMI." },
          { question: "Why is prehospital STEMI recognition so important?", answer: "Prehospital STEMI identification allows early cath lab activation, reducing door-to-balloon time by 15-20 minutes. Every 30-minute delay in reperfusion increases 1-year mortality by 7.5%. The paramedic's 12-lead ECG can directly trigger cath lab team mobilization before the patient arrives at the hospital." },
        ],
        relatedTopicSlugs: ["basic-ecg-interpretation", "tachycardia-vs-bradycardia", "heart-blocks"],
        relatedClusterSlugs: ["emergency-conditions", "ems-medications"],
      },
      {
        slug: "tachycardia-vs-bradycardia",
        title: "Tachycardia vs Bradycardia",
        metaTitle: "Tachycardia vs Bradycardia for Paramedics — ACLS Algorithm Guide | NurseNest",
        metaDescription: "Master tachycardia and bradycardia management: ACLS algorithms, stable vs unstable assessment, adenosine/amiodarone/atropine dosing, cardioversion, and pacing for paramedic certification.",
        keywords: "tachycardia bradycardia paramedic, ACLS tachycardia algorithm, bradycardia atropine pacing, stable vs unstable tachycardia, paramedic cardiac management",
        overview: "Tachycardia (HR > 100) and bradycardia (HR < 60) are common prehospital findings. The critical question is always: is the patient stable or unstable? Unstable patients with tachycardia need cardioversion; unstable bradycardia needs atropine and pacing. Stable patients receive pharmacological management.",
        sections: [
          { id: "stability", title: "Assessing Hemodynamic Stability", level: 2, content: "Signs of instability: hypotension (SBP < 90), altered mental status, signs of shock, ischemic chest pain, acute heart failure. If ANY of these are present AND caused by the rhythm → the patient is unstable. Treat the rhythm emergently." },
          { id: "tachycardia", title: "Tachycardia Management", level: 2, content: "Narrow complex regular (SVT): vagal maneuvers → adenosine 6 mg rapid IV push → adenosine 12 mg → cardioversion. Narrow complex irregular (A-fib/flutter): rate control (diltiazem, beta-blocker). Wide complex regular (VT): amiodarone 150 mg IV over 10 min. Wide complex irregular: defibrillation (polymorphic VT/torsades). Unstable: immediate synchronized cardioversion." },
          { id: "bradycardia", title: "Bradycardia Management", level: 2, content: "Symptomatic bradycardia: atropine 0.5 mg IV every 3-5 min (max 3 mg). If atropine fails: transcutaneous pacing (start 60 bpm, increase mA until capture). Dopamine 5-20 mcg/kg/min or epinephrine 2-10 mcg/min infusion. Note: atropine is ineffective in heart transplant patients and complete heart block." },
        ],
        rhythmCharacteristics: ["Tachycardia: HR > 100", "Bradycardia: HR < 60", "Narrow vs wide QRS determines origin", "Regular vs irregular helps identify specific rhythm"],
        clinicalImplications: ["Stable tachycardia: medication management", "Unstable tachycardia: synchronized cardioversion", "Stable bradycardia: monitor, identify cause", "Unstable bradycardia: atropine → pacing"],
        treatmentPriorities: ["Assess stability first", "Identify narrow vs wide complex", "Follow ACLS algorithm", "Prepare for escalation", "Continuous monitoring"],
        examTips: ["Unstable = cardioversion (tachycardia) or pacing (bradycardia)", "Adenosine has a 10-second half-life — must give as rapid IV push with flush", "Atropine is ineffective in Mobitz Type II and complete heart block", "Synchronized cardioversion: start at 100J for narrow complex, 200J for wide"],
        faq: [
          { question: "What is the difference between cardioversion and defibrillation?", answer: "Synchronized cardioversion delivers the shock at the R wave to avoid the vulnerable period (T wave), used for tachycardia WITH a pulse. Defibrillation delivers an unsynchronized shock, used for pulseless VT/VF. Never use synchronized mode for VF — it may fail to fire if it can't identify an R wave." },
          { question: "When should transcutaneous pacing be used?", answer: "Transcutaneous pacing is indicated for symptomatic bradycardia unresponsive to atropine. Set rate to 60-80 bpm, start mA at minimum and increase until electrical capture (each pacing spike followed by a wide QRS). Verify mechanical capture (check pulse). Pacing is painful — sedate the conscious patient." },
        ],
        relatedTopicSlugs: ["sinus-vs-arrhythmias", "heart-blocks", "basic-ecg-interpretation"],
        relatedClusterSlugs: ["emergency-conditions", "ems-medications"],
      },
      {
        slug: "heart-blocks",
        title: "Heart Blocks",
        metaTitle: "Heart Blocks for Paramedics — 1st, 2nd, 3rd Degree AV Block Guide | NurseNest",
        metaDescription: "Master heart block recognition: first-degree, second-degree Type I (Wenckebach) and Type II (Mobitz), and third-degree (complete) AV block. ECG features and management for paramedic certification.",
        keywords: "heart blocks paramedic, AV block ECG, first degree heart block, Wenckebach Mobitz, complete heart block paramedic, 3rd degree AV block",
        overview: "Heart blocks represent impaired conduction through the AV node or His-Purkinje system. Recognition and differentiation of heart block types is essential because management ranges from simple monitoring (1st degree) to emergent transcutaneous pacing (complete heart block). Mobitz Type II and complete heart block are the highest-priority blocks in prehospital care.",
        sections: [
          { id: "first-degree", title: "First-Degree AV Block", level: 2, content: "PR interval > 0.20 seconds, constant, every P wave conducted. Not a true block — it's a delay. Usually benign. No treatment required unless symptomatic (rare)." },
          { id: "second-degree-type1", title: "Second-Degree Type I (Wenckebach)", level: 2, content: "Progressive PR prolongation until a P wave is not conducted (dropped QRS). Regular P-P intervals, irregular R-R intervals. Usually occurs at the AV node level. Generally benign. Treat only if symptomatic — atropine 0.5 mg IV." },
          { id: "second-degree-type2", title: "Second-Degree Type II (Mobitz)", level: 2, content: "Constant PR interval with intermittent dropped QRS complexes. No PR prolongation before dropped beat. Occurs below the AV node (His bundle or bundle branches). Often has wide QRS. HIGH risk of progressing to complete heart block. Pacing may be needed — atropine may be ineffective." },
          { id: "third-degree", title: "Third-Degree (Complete) Heart Block", level: 2, content: "Complete dissociation between atrial and ventricular activity. P waves march through at their own rate, QRS complexes at a slower escape rate. No P waves are conducted. P-P and R-R intervals are regular but independent. Requires transcutaneous pacing if symptomatic. Prepare for transvenous pacing." },
        ],
        rhythmCharacteristics: ["1st degree: prolonged PR > 0.20 sec, all P waves conducted", "2nd degree Type I: progressive PR lengthening, dropped QRS", "2nd degree Type II: constant PR, intermittent dropped QRS, often wide QRS", "3rd degree: P-P regular, R-R regular, no relationship between P and QRS"],
        identificationSteps: ["Measure PR interval", "Is PR constant or variable?", "Are all P waves followed by QRS?", "If P waves are dropped, is there PR prolongation beforehand?", "Is there AV dissociation?", "Is the QRS narrow or wide?"],
        clinicalImplications: ["1st degree: monitor, usually benign", "2nd degree Type I: atropine if symptomatic", "2nd degree Type II: prepare for pacing, atropine often ineffective", "3rd degree: transcutaneous pacing, prepare for transvenous pacing"],
        treatmentPriorities: ["Identify block type", "Assess hemodynamic stability", "Atropine for symptomatic AV nodal blocks", "Pacing for infranodal blocks (Type II, complete)", "Continuous monitoring"],
        examTips: ["Type I (Wenckebach): 'longer, longer, longer, drop — that's a Wenckebach!'", "Type II (Mobitz): constant PR then sudden drop — more dangerous than Type I", "Atropine works on AV node (Type I) but NOT on infranodal blocks (Type II, complete)", "Complete heart block: P waves and QRS complexes are completely independent"],
        faq: [
          { question: "How do you differentiate Type I from Type II second-degree AV block?", answer: "Type I (Wenckebach): the PR interval progressively lengthens before a dropped QRS. The P-P interval is regular. Usually narrow QRS. Occurs at the AV node. Type II (Mobitz): the PR interval remains CONSTANT, then a QRS is suddenly dropped with no warning. Often has wide QRS. Occurs below the AV node. Type II is more dangerous and more likely to progress to complete heart block." },
          { question: "Why is atropine ineffective in complete heart block?", answer: "Atropine increases conduction through the AV node by blocking vagal (parasympathetic) input. In complete heart block, the block is usually below the AV node (infranodal) in the His bundle or bundle branches. Since atropine only works at the AV node level, it cannot improve conduction through a structurally damaged infranodal pathway. Pacing is the definitive treatment." },
        ],
        relatedTopicSlugs: ["basic-ecg-interpretation", "tachycardia-vs-bradycardia", "sinus-vs-arrhythmias"],
        relatedClusterSlugs: ["emergency-conditions", "ems-medications"],
      },
    ],
  },
];

export function getClusterBySlug(slug: string): ContentCluster | undefined {
  return PARAMEDIC_CLUSTERS.find(c => c.slug === slug);
}

export function getTopicBySlug(clusterSlug: string, topicSlug: string): { cluster: ContentCluster; topic: ClusterTopic } | undefined {
  const cluster = getClusterBySlug(clusterSlug);
  if (!cluster) return undefined;
  const topic = cluster.topics.find(t => t.slug === topicSlug);
  if (!topic) return undefined;
  return { cluster, topic };
}

export function getAllTopics(): { cluster: ContentCluster; topic: ClusterTopic }[] {
  const result: { cluster: ContentCluster; topic: ClusterTopic }[] = [];
  for (const cluster of PARAMEDIC_CLUSTERS) {
    for (const topic of cluster.topics) {
      result.push({ cluster, topic });
    }
  }
  return result;
}

export function getRelatedTopics(topicSlug: string, limit = 5): { cluster: ContentCluster; topic: ClusterTopic }[] {
  const all = getAllTopics();
  const current = all.find(t => t.topic.slug === topicSlug);
  if (!current) return [];
  const related = current.topic.relatedTopicSlugs
    .map(slug => all.find(t => t.topic.slug === slug))
    .filter(Boolean) as { cluster: ContentCluster; topic: ClusterTopic }[];
  return related.slice(0, limit);
}
