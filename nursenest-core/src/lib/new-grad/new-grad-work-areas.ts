/**
 * New Grad transition-to-practice work areas — stable marketing slugs + hub copy.
 * (Clinical bullets are educational framing, not individualized medical advice.)
 */

export type NewGradWorkAreaMedsLabsEquipment = {
  readonly medications: readonly string[];
  readonly labs: readonly string[];
  readonly equipment: readonly string[];
};

export type NewGradWorkAreaDefinition = {
  readonly slug: string;
  readonly title: string;
  readonly tagline: string;
  /** Key for {@link getLessonHubSystemVisual} card accents */
  readonly lessonVisualKey: string;
  readonly needToKnow: readonly string[];
  readonly commonPresentations: readonly string[];
  readonly priorityAssessments: readonly string[];
  readonly safetyRisks: readonly string[];
  readonly medsLabsEquipment: NewGradWorkAreaMedsLabsEquipment;
  readonly communicationReporting: readonly string[];
};

const DEFS: readonly NewGradWorkAreaDefinition[] = [
  {
    slug: "med-surg",
    title: "Medical–Surgical",
    tagline: "First-year flow for higher-acuity general medicine and surgical recovery.",
    lessonVisualKey: "fundamentals",
    needToKnow: [
      "Shift priorities rotate quickly — anchor on nurse–patient ratios, team huddles, and safe handoffs.",
      "Delegation and escalation are daily skills: know scope, verify competence, and loop charge early.",
      "Recognizing deterioration beats completing the task list — use structured early-warning cues.",
    ],
    commonPresentations: [
      "Post-op ileus, pain, and fluid shifts after abdominal or orthopedic surgery.",
      "Acute infection with sepsis risk — fever, tachypnea, altered cognition, or subtle hypoperfusion.",
      "Decompensated heart failure or COPD with oxygen needs and medication titration.",
    ],
    priorityAssessments: [
      "Airway, work of breathing, oxygenation, and perfusion on every post-op or med admit.",
      "Neuro checks after any neuro-active meds, epidural, or head injury history.",
      "Wound / drain output, bowel sounds, and mobility tolerance before advancing diet or activity.",
    ],
    safetyRisks: [
      "Venous thromboembolism after surgery or prolonged bedrest.",
      "Medication reconciliation errors at admission, transfer, and discharge.",
      "Falls and line pulls when patients are weak, sedated, or confused.",
    ],
    medsLabsEquipment: {
      medications: [
        "Opioids and multimodal pain plans — monitor sedation, respiratory rate, and bowel function.",
        "Anticoagulants around procedures — timing with holds and bridging per protocol.",
        "Insulin and steroids — glucose surveillance when nutrition or stress changes.",
      ],
      labs: [
        "CBC for infection or bleeding; BMP / magnesium when diuresis or GI losses.",
        "Lactate and cultures when sepsis is on the differential.",
        "Coagulation studies when bleeding risk or anticoagulation changes.",
      ],
      equipment: [
        "Telemetry leads and alarm limits when arrhythmia risk is present.",
        "Sequential compression devices and early ambulation aids.",
        "Bladder scanner and strict intake/output tools when fluid balance is tight.",
      ],
    },
    communicationReporting: [
      "SBAR updates to providers with focused assessment, recent vitals, and explicit ask.",
      "Escalate early for sustained tachycardia, new hypoxia, or acute confusion.",
      "Document trends, not single points — deterioration is a story across assessments.",
    ],
  },
  {
    slug: "emergency-department",
    title: "Emergency Department",
    tagline: "Triage mindset, rapid stabilization, and safe throughput for new grads.",
    lessonVisualKey: "acute_episodic_care",
    needToKnow: [
      "Undifferentiated patients require parallel assessment — airway first, then focused secondary survey.",
      "Time-sensitive pathways (stroke, STEMI, sepsis) reward early recognition and team activation.",
      "Crowding increases risk — keep reassessment cadence honest when boarding.",
    ],
    commonPresentations: [
      "Chest pain with ischemic vs non-ischemic workups.",
      "Shortness of breath from asthma/COPD, PE, heart failure, or infection.",
      "Abdominal pain spanning appendicitis, obstruction, and vascular emergencies.",
    ],
    priorityAssessments: [
      "Primary survey (A–E) before deep chart dives.",
      "Pain, perfusion, and neuro status tied to reassessment intervals.",
      "Pregnancy status and high-risk medications before imaging or sedation.",
    ],
    safetyRisks: [
      "Diagnostic momentum — anchor bias after an early label.",
      "Restraint and agitation management without trauma to staff or patient.",
      "Line and medication errors in high-stimulus environments.",
    ],
    medsLabsEquipment: {
      medications: [
        "Analgesics and antiemetics with attention to sedation stacking.",
        "Vasoactive infusions only with monitoring capability and escalation plans.",
        "Antimicrobials timed to sepsis bundles when indicated.",
      ],
      labs: [
        "Troponins, D-dimer, lactate, and pregnancy testing as pathways dictate.",
        "Type and screen before blood product pathways.",
        "Venous blood gas or electrolytes when renal or metabolic shifts are suspected.",
      ],
      equipment: [
        "Cardiac monitor, defibrillator readiness, and suction at bedside.",
        "Ultrasound support when available for IV access or focused exams.",
        "Splints, wound care trays, and hemorrhage-control supplies staged early.",
      ],
    },
    communicationReporting: [
      "Clear closed-loop orders during resuscitation — who owns reassessment and timers.",
      "Bedside sign-out that names pending studies, unstable vitals, and family contact status.",
      "Consult requests with one-paragraph summary plus explicit question.",
    ],
  },
  {
    slug: "icu",
    title: "ICU",
    tagline: "Hemodynamic literacy, organ support, and disciplined safety in critical care.",
    lessonVisualKey: "cardiovascular",
    needToKnow: [
      "Waveforms and trends beat single numbers — pair vitals with perfusion and urine output.",
      "Sedation, delirium, and mobility bundles compete — sequence care deliberately.",
      "Family meetings and goals-of-care touchpoints belong in routine workflow, not only crises.",
    ],
    commonPresentations: [
      "Shock states requiring fluid responsiveness assessment and vasoactive titration.",
      "Respiratory failure on high-flow, non-invasive, or invasive ventilation.",
      "Acute kidney injury with electrolyte derangements and fluid stewardship.",
    ],
    priorityAssessments: [
      "Line patency, dressing integrity, and daily necessity for central access.",
      "Neuro checks when sedation changes or intracranial processes are suspected.",
      "Skin and pressure injury prevention on prolonged immobility.",
    ],
    safetyRisks: [
      "Central-line bloodstream infection prevention bundles.",
      "Ventilator-associated events and aspiration around enteral feeds.",
      "Medication double-stacks — high-alert drips and syringe pump safety.",
    ],
    medsLabsEquipment: {
      medications: [
        "Vasoactive titration with explicit blood pressure / perfusion targets.",
        "Sedation holidays paired with delirium screening when safe.",
        "Renally adjusted antimicrobials and antiepileptics as labs shift.",
      ],
      labs: [
        "ABG / VBG for ventilation and acid–base interpretation.",
        "Lactate trends in shock resuscitation.",
        "Electrolytes, calcium, magnesium, and phosphate in renal or refeeding risk.",
      ],
      equipment: [
        "Ventilator modes, alarms, and suction readiness.",
        "Arterial lines for beat-to-beat monitoring when indicated.",
        "CRRT or dialysis interfaces when nephrology support is active.",
      ],
    },
    communicationReporting: [
      "Structured multidisciplinary rounds with ownership for each organ system.",
      "Proactive updates to families after meaningful changes or procedures.",
      "Escalation to rapid response or attending when trajectory crosses guardrails.",
    ],
  },
  {
    slug: "pediatric-icu",
    title: "Pediatric ICU",
    tagline: "Weight-based care, family partnership, and developmental safety.",
    lessonVisualKey: "pediatrics",
    needToKnow: [
      "Dosing, equipment, and monitoring are weight- and age-scoped — verify in pairs.",
      "Parents are part of the care team — explain monitors, alarms, and visiting expectations.",
      "Pediatric deterioration can be rapid and subtle — track feeding, activity, and interaction.",
    ],
    commonPresentations: [
      "Respiratory failure from bronchiolitis, asthma, or pneumonia.",
      "Post-operative congenital heart or neurosurgical recovery.",
      "Shock or sepsis with different baseline vitals than adults.",
    ],
    priorityAssessments: [
      "Airway size and adjunct readiness; suction and positioning.",
      "Pain and sedation scales appropriate to developmental stage.",
      "Fluid balance and glucose in infants and stressed adolescents.",
    ],
    safetyRisks: [
      "Mis-programmed pumps and tenfold dosing errors.",
      "Unsecured lines in agitated or developmentally normal children.",
      "Heat loss and pressure injury in smallest patients.",
    ],
    medsLabsEquipment: {
      medications: [
        "Weight-based infusions with independent double-checks for high-alert drugs.",
        "Antipyretics and fluids aligned to pediatric pathways.",
        "Electrolyte replacement with narrow therapeutic windows in neonates/infants.",
      ],
      labs: [
        "CBC, CRP / procalcitonin context per facility sepsis guidance.",
        "Electrolytes and glucose with tight surveillance during diuresis or TPN transitions.",
        "Coagulation when ECMO or invasive devices are present.",
      ],
      equipment: [
        "Pediatric ventilator circuits and humidification.",
        "Appropriate cuffless airway setups and suction catheters.",
        "Developmentally supportive positioning and sensory modulation tools.",
      ],
    },
    communicationReporting: [
      "Family-centered updates after rounds or major interventions.",
      "Child-life and school coordination when length of stay extends.",
      "Clear handoffs naming caregivers present and consent nuances.",
    ],
  },
  {
    slug: "neonatal-icu",
    title: "Neonatal ICU",
    tagline: "Thermoregulation, nutrition, and gentle handling at the start of life.",
    lessonVisualKey: "reproductive_maternal_newborn",
    needToKnow: [
      "Gestational age drives almost every protocol — verify before acting.",
      "Thermoregulation and glucose stability are bedside priorities in small babies.",
      "Infection control and cohorting policies protect the most vulnerable patients.",
    ],
    commonPresentations: [
      "Prematurity with respiratory distress syndrome or apnea of prematurity.",
      "Hypoglycemia or hyperbilirubinemia surveillance pathways.",
      "Congenital anomalies needing staged surgical planning.",
    ],
    priorityAssessments: [
      "Thermal neutral environment and incubator humidity.",
      "Feeding tolerance, residuals, and growth curves when applicable.",
      "Neurologic tone, seizure mimics, and safe positioning.",
    ],
    safetyRisks: [
      "CLABSI and NEC prevention bundles.",
      "Retinopathy of prematurity screening timing.",
      "Medication errors from decimal placement in micro-doses.",
    ],
    medsLabsEquipment: {
      medications: [
        "Caffeine, surfactant, or pulmonary vasodilators per neonatal protocols.",
        "Antibiotics with narrow windows — culture-first discipline.",
        "TPN components reconciled daily with labs.",
      ],
      labs: [
        "Blood gas and electrolytes with attention to iatrogenic blood loss.",
        "Bilirubin trends and albumin context per unit policy.",
        "Cultures interpreted alongside clinical sepsis scores.",
      ],
      equipment: [
        "Blenders for oxygen delivery; CPAP interfaces fitted carefully.",
        "Isolette alarms and humidity maintenance.",
        "Breast pumps and human-milk handling workflows.",
      ],
    },
    communicationReporting: [
      "Sensitive language with families experiencing long NICU stays.",
      "Multidisciplinary updates that include lactation and developmental goals.",
      "Transport handoffs with clear lines, fluids, and ventilation snapshots.",
    ],
  },
  {
    slug: "cardiac-icu",
    title: "Cardiac ICU",
    tagline: "Rhythm, perfusion, and post-intervention vigilance for complex hearts.",
    lessonVisualKey: "cardiovascular",
    needToKnow: [
      "Know your unit’s anticoagulation and antiplatelet targets after PCI or surgery.",
      "Arrhythmia recognition is a team sport — treat unstable rhythms first.",
      "Fluid shifts after bypass or valvular surgery change inotrope needs quickly.",
    ],
    commonPresentations: [
      "Low cardiac output states and vasoplegia after surgery.",
      "Atrial fibrillation with rapid ventricular response.",
      "Acute coronary syndromes under invasive monitoring.",
    ],
    priorityAssessments: [
      "Chest tube output trends and mediastinal widening concerns.",
      "Peripheral perfusion, lactate, and mixed venous saturation when available.",
      "Pain and sternal stability affecting cough and pulmonary toilet.",
    ],
    safetyRisks: [
      "Bleeding on dual antiplatelet therapy or anticoagulation.",
      "Electrolyte-driven arrhythmias — especially potassium and magnesium.",
      "Delirium and immobility after long runs of sedation.",
    ],
    medsLabsEquipment: {
      medications: [
        "Inotropes and vasodilators titrated to explicit endpoints.",
        "Antiarrhythmics with ECG monitoring and interaction awareness.",
        "Diuretics with renal perfusion context.",
      ],
      labs: [
        "Troponins and CK-MB trends per protocol.",
        "Coagulation panels around procedures or bleeding.",
        "ABG for oxygenation, ventilation, and lactate.",
      ],
      equipment: [
        "Temporary pacing wires and pacemaker settings.",
        "IABP or mechanical support interfaces when present.",
        "Continuous telemetry with alarm fatigue management.",
      ],
    },
    communicationReporting: [
      "Cardiac surgery sign-out including drains, wires, and echo plans.",
      "Rapid escalation for tamponade physiology or sudden hypotension.",
      "Family updates after cath lab or OR milestones.",
    ],
  },
  {
    slug: "neuro-icu",
    title: "Neuro ICU",
    tagline: "ICP dynamics, neuro checks, and immobility complications.",
    lessonVisualKey: "neurology",
    needToKnow: [
      "Neurologic exams must be serial — compare pupils, strength, and language over time.",
      "CPP and ICP targets are protocolized — know where to read them before titrating.",
      "Seizure mimics and sedation confounders are common — document triggers.",
    ],
    commonPresentations: [
      "Traumatic brain injury with tiered ICP management.",
      "Hemorrhagic or ischemic stroke with blood pressure goals.",
      "Status epilepticus pathways and burst-suppression targets when used.",
    ],
    priorityAssessments: [
      "GCS components, pupils, and lateralizing signs.",
      "Airway protection with depressed consciousness.",
      "DVT prophylaxis when immobility extends.",
    ],
    safetyRisks: [
      "Unnoticed herniation patterns — escalate when exam crosses thresholds.",
      "Hyperglycemia and fever worsening secondary injury.",
      "Aspiration with altered swallow — coordinate speech when stable.",
    ],
    medsLabsEquipment: {
      medications: [
        "Osmotherapy with renal and volume monitoring.",
        "Antiepileptics loaded and maintained per EEG guidance.",
        "Sedation choices that balance exam vs comfort.",
      ],
      labs: [
        "Sodium trends and osmolar gaps when hyperosmolar therapy runs.",
        "ABG for ventilation targets in intubated patients.",
        "Coagulation around reversal or surgical planning.",
      ],
      equipment: [
        "ICP monitors and external ventricular drains with strict sterile technique.",
        "EEG leads and camera monitoring for seizure detection.",
        "Cooling devices when therapeutic hypothermia is indicated.",
      ],
    },
    communicationReporting: [
      "Neurosurgery updates with imaging availability and exam deltas.",
      "Family communication for prognostic uncertainty — use team support.",
      "Therapy milestones documented for safe mobilization when cleared.",
    ],
  },
  {
    slug: "trauma",
    title: "Trauma",
    tagline: "Primary survey discipline, damage-control teamwork, and secondary survey completeness.",
    lessonVisualKey: "acute_episodic_care",
    needToKnow: [
      "ABCDE every time — do not skip steps because the mechanism sounds minor.",
      "Massive transfusion and activation protocols are time-stamped team events.",
      "Occult injuries surface in secondary survey — log roll, spine precautions, and skin checks.",
    ],
    commonPresentations: [
      "Polytrauma with chest, abdomen, pelvis, and long-bone involvement.",
      "Head injury with cervical spine precautions until cleared.",
      "Penetrating vs blunt pathways with different imaging priorities.",
    ],
    priorityAssessments: [
      "FAST or eFAST when indicated; repeat when physiology changes.",
      "Pelvic binder placement and neurovascular checks for limb injuries.",
      "Temperature, coagulation, and calcium in resuscitation.",
    ],
    safetyRisks: [
      "Missed injuries when distractions pull you from structured exam.",
      "Radiation safety in pan-scan decisions for stable patients.",
      "Occupational exposure during high-acuity procedures.",
    ],
    medsLabsEquipment: {
      medications: [
        "Tranexamic acid timing in eligible bleeding trauma.",
        "Analgesia balanced with exam needs — document rationale.",
        "Tetanus and infection prophylaxis per mechanism.",
      ],
      labs: [
        "Hemoglobin serials during active resuscitation.",
        "Coagulation and fibrinogen when massive transfusion activates.",
        "Lactate clearance as a resuscitation gauge when used locally.",
      ],
      equipment: [
        "Warmers, level-1 infusers, and cell-saver setups per policy.",
        "Cervical collars and backboards removed promptly when safe.",
        "Damage-control OR readiness lists communicated aloud.",
      ],
    },
    communicationReporting: [
      "Trauma activation huddles with roles, timers, and anticipated needs.",
      "Clear injury pattern communication to receiving teams.",
      "Forensic-sensitive documentation when interpersonal violence suspected.",
    ],
  },
  {
    slug: "long-term-care",
    title: "Long-Term Care",
    tagline: "Geriatric syndromes, dignity, and regulatory rigor at slower pace but persistent risk.",
    lessonVisualKey: "older_adults",
    needToKnow: [
      "Function and cognition are outcomes — not only vitals on a sticker.",
      "Infection control in congregate settings requires relentless basics.",
      "Advance care plans and surrogate decision makers should be one click away in the chart.",
    ],
    commonPresentations: [
      "Pneumonia or UTI with atypical presentations in older adults.",
      "Delirium superimposed on dementia with medication and environment triggers.",
      "Skin injury prevention around immobility and contractures.",
    ],
    priorityAssessments: [
      "Swallow screens and aspiration precautions during acute changes.",
      "Bowel and bladder patterns — retention can mimic delirium.",
      "Pain in nonverbal residents using validated tools.",
    ],
    safetyRisks: [
      "Falls with injury when mobility plans lag changing status.",
      "Polypharmacy and anticholinergic burden.",
      "Elopement risk in confused residents.",
    ],
    medsLabsEquipment: {
      medications: [
        "Hypoglycemia risk with tight diabetic goals — individualize.",
        "Psychotropic use tied to consent, monitoring, and gradual changes.",
        "Anticoagulation decisions with fall risk explicitly discussed.",
      ],
      labs: [
        "CBC and renal panel when acute change occurs.",
        "Urinalysis interpreted with asymptomatic bacteriuria caution.",
        "Vitamin B12 or thyroid when cognition shifts gradually.",
      ],
      equipment: [
        "Lift teams and gait belts with updated mobility orders.",
        "Low-air-loss mattresses and turning schedules.",
        "Wheelchairs and splints fitted to prevent skin shear.",
      ],
    },
    communicationReporting: [
      "Family updates that center quality of life and preferences.",
      "Interdisciplinary care conferences for recurrent hospitalizations.",
      "Clear documentation for capacity and surrogate hierarchy.",
    ],
  },
  {
    slug: "rehabilitation",
    title: "Rehabilitation",
    tagline: "Therapy-heavy units where tolerance, goals, and safety intersect.",
    lessonVisualKey: "musculoskeletal",
    needToKnow: [
      "Therapy tolerance is data — pain, vitals, and orthostasis guide progression.",
      "Bowel and bladder programs are dignity issues and readmission risks.",
      "Equipment and home plans start early, not on discharge morning.",
    ],
    commonPresentations: [
      "Stroke recovery with hemiparesis and speech therapy needs.",
      "Spinal cord or orthopedic rehab with bracing and neuro checks.",
      "Deconditioning after prolonged ICU stays.",
    ],
    priorityAssessments: [
      "Orthostatic vitals before advancing mobility.",
      "Skin under braces and splints each shift.",
      "Aspiration risk during meals — observe first bites.",
    ],
    safetyRisks: [
      "Falls during independence pushes without guardrails.",
      "Autonomic dysreflexia in spinal cord injury.",
      "DVT during immobility windows.",
    ],
    medsLabsEquipment: {
      medications: [
        "Spasticity agents with sedation and liver monitoring.",
        "Anticoagulation aligned to mobility milestones.",
        "Pain regimens that enable therapy participation without oversedation.",
      ],
      labs: [
        "INR when anticoagulated; CBC if bleeding or infection suspected.",
        "Renal panel with nephrotoxic meds.",
        "HbA1c or glucose patterns when diabetes complicates healing.",
      ],
      equipment: [
        "Walkers, wheelchairs, and brakes checked before every transfer.",
        "Parallel bars and harness systems used per therapist co-sign.",
        "Speech devices charged and within reach.",
      ],
    },
    communicationReporting: [
      "Daily therapy communication on barriers and wins.",
      "Case management handoffs for equipment vendors and payor authorizations.",
      "Patient education in plain language with teach-back.",
    ],
  },
  {
    slug: "mental-health",
    title: "Mental Health",
    tagline: "Therapeutic communication, safety planning, and trauma-informed presence.",
    lessonVisualKey: "mental_health",
    needToKnow: [
      "Your calm pace and predictable structure are interventions.",
      "Legal holds and capacity documentation are non-negotiable — know state/province rules.",
      "Trauma-informed care changes how you approach searches, touch, and tone.",
    ],
    commonPresentations: [
      "Suicidal ideation with or without a plan or recent attempt.",
      "Psychosis with agitation or catatonic features.",
      "Substance intoxication or withdrawal overlapping psychiatric illness.",
    ],
    priorityAssessments: [
      "Suicide risk screening on every shift change when policy dictates.",
      "Nutrition, hydration, and sleep as modulators of distress.",
      "Medication adherence and depot schedules on admission.",
    ],
    safetyRisks: [
      "Violence to self or others — maintain egress and backup plans.",
      "Seclusion or restraint only as last resort with continuous monitoring.",
      "Contraband and ligature risks in the milieu.",
    ],
    medsLabsEquipment: {
      medications: [
        "PRN anxiolytics or antipsychotics with monitoring orders and time locks.",
        "Lithium, valproate, or clozapine with lab surveillance per protocol.",
        "Withdrawal scales driving benzodiazepine titration when indicated.",
      ],
      labs: [
        "Electrolytes and renal function with lithium or dehydration.",
        "CBC and liver enzymes with valproate or clozapine.",
        "Pregnancy testing before certain medications or procedures.",
      ],
      equipment: [
        "Continuous observation assignments staffed intentionally.",
        "Weighted blankets or sensory tools only per policy.",
        "Sharp counts and room sweeps on protocol.",
      ],
    },
    communicationReporting: [
      "De-escalation language that is simple, choice-based, and respectful.",
      "Safety contracts documented with team awareness — not secret promises.",
      "Handoffs that name triggers, coping strategies, and visitor dynamics.",
    ],
  },
  {
    slug: "pediatrics",
    title: "Pediatrics",
    tagline: "Family-centered general pediatrics with growth, development, and safety lenses.",
    lessonVisualKey: "pediatrics",
    needToKnow: [
      "Parents often know baseline behavior — invite their expertise early.",
      "Developmental stages change distraction techniques and education depth.",
      "Immunization status and school requirements are social determinants, not footnotes.",
    ],
    commonPresentations: [
      "Asthma exacerbations and bronchiolitis seasonal surges.",
      "Dehydration from gastroenteritis with careful oral rehydration plans.",
      "Fever in infants with different thresholds than older children.",
    ],
    priorityAssessments: [
      "Work of breathing, retractions, and feeding tolerance.",
      "Hydration status — diapers, tears, fontanelle when applicable.",
      "Pain using age-appropriate scales and parent coaching.",
    ],
    safetyRisks: [
      "Tenfold dosing errors with liquid medications.",
      "Choking and small-battery ingestions in toddlers.",
      "Unsupervised falls from cribs or stretchers.",
    ],
    medsLabsEquipment: {
      medications: [
        "Weight-based dosing with pharmacy verification on high-alert drugs.",
        "Antipyretics with clear caregiver education on red flags.",
        "Asthma pathways with spacer teaching at bedside.",
      ],
      labs: [
        "Viral panels when indicated; avoid unnecessary sticks.",
        "Electrolytes when dehydration or DKA is considered.",
        "Blood cultures when serious bacterial infection is suspected.",
      ],
      equipment: [
        "High-flow setups sized for pediatric nares.",
        "Pulse ox probes sized for digits or ears.",
        "Child-appropriate BP cuffs — wrong size skews readings.",
      ],
    },
    communicationReporting: [
      "Teach-back with caregivers before discharge on meds and return precautions.",
      "School or daycare notes when contagious illness is diagnosed.",
      "Child-life referrals for procedures when available.",
    ],
  },
  {
    slug: "maternal-newborn",
    title: "Maternal–Newborn",
    tagline: "Two-patient thinking — postpartum recovery and newborn transition together.",
    lessonVisualKey: "reproductive_maternal_newborn",
    needToKnow: [
      "Hemorrhage, hypertension, and infection are leading maternal morbidities — know unit thresholds.",
      "Newborn transition includes tone, feeding, and bilirubin surveillance.",
      "Trauma-informed care matters after difficult births or losses.",
    ],
    commonPresentations: [
      "Postpartum hemorrhage and uterine atony management.",
      "Preeclampsia with severe features after delivery.",
      "Latch issues, weight loss, and jaundice in the first week.",
    ],
    priorityAssessments: [
      "Fundus, lochia, and pain on regular postpartum vitals.",
      "Breast or bottle feeding observations with output tracking.",
      "Neonatal vital signs and screening tests per policy.",
    ],
    safetyRisks: [
      "Infant falls or drops during skin-to-skin when tired parents are unsupervised.",
      "Medication errors between mother and baby orders.",
      "Delayed recognition of sepsis in febrile postpartum patients.",
    ],
    medsLabsEquipment: {
      medications: [
        "Uterotonics with blood pressure and nausea monitoring.",
        "Magnesium sulfate safety checks when eclampsia risk is present.",
        "Hepatitis B and erythromycin eye prophylaxis per newborn policy.",
      ],
      labs: [
        "CBC and coags during hemorrhage protocols.",
        "Renal panel and uric acid context in preeclampsia.",
        "Bilirubin levels timed to feeding status and risk factors.",
      ],
      equipment: [
        "Infant warmers and phototherapy lights maintained per spec.",
        "Breast pumps with cleaning education.",
        "Infant security bands verified each shift.",
      ],
    },
    communicationReporting: [
      "Shared decision-making on feeding plans and supplementation.",
      "Sensitive language after stillbirth or NICU transfer.",
      "Pediatrician handoffs with weight trends and pending screens.",
    ],
  },
  {
    slug: "labour-delivery",
    title: "Labour & Delivery",
    tagline: "High-stakes teamwork, fetal tracing literacy, and calm in rapid change.",
    lessonVisualKey: "reproductive_obstetrics",
    needToKnow: [
      "FHR category systems reward pattern recognition — pair with clinical context.",
      "Hemorrhage carts and massive transfusion triggers should be muscle memory.",
      "Consent and capacity conversations belong before emergent procedures when possible.",
    ],
    commonPresentations: [
      "Inductions with cervical ripening and titrated oxytocin.",
      "Preeclampsia with seizure precautions.",
      "Shoulder dystocia and emergency drills.",
    ],
    priorityAssessments: [
      "Maternal vitals and urine protein when hypertension complicates labor.",
      "Bleeding estimates with quantified blood loss discipline.",
      "Neonatal transition at warmer with APGAR-focused teamwork.",
    ],
    safetyRisks: [
      "Umbilical line mislabeling between twins or multiples.",
      "Medication errors between mother and baby in fast-paced rooms.",
      "Occupational slips on wet floors during emergencies.",
    ],
    medsLabsEquipment: {
      medications: [
        "Oxytocin titration per protocol with uterine tone checks.",
        "Magnesium for neuroprotection or seizure prophylaxis with reflex checks.",
        "Antibiotics timed for GBS-positive or risk-factor pathways.",
      ],
      labs: [
        "Type and screen readiness before cesarean.",
        "CBC and coags when hemorrhage risk rises.",
        "Lactate or gas analysis when maternal instability appears.",
      ],
      equipment: [
        "Fetal monitor tracing storage and strip review etiquette.",
        "Ultrasound for presentation or emergent procedures.",
        "Warmer, suction, and airway setups checked each shift.",
      ],
    },
    communicationReporting: [
      "Closed-loop communication during shoulder dystocia or postpartum hemorrhage.",
      "Updates to family during long inductions with expected ebbs and flows.",
      "Clear neonatal team briefings on risk factors before delivery.",
    ],
  },
  {
    slug: "oncology-hematology",
    title: "Oncology / Hematology",
    tagline: "Immunosuppression literacy, symptom clusters, and compassionate pacing.",
    lessonVisualKey: "hematology_oncology",
    needToKnow: [
      "Neutropenic precautions are environmental and procedural — not a poster.",
      "Chemo timelines and cycle day dictate expected toxicities.",
      "Goals of care may evolve visit to visit — document sensitively.",
    ],
    commonPresentations: [
      "Febrile neutropenia as an emergency until proven otherwise.",
      "Tumor lysis risk with bulky disease or rapid cell turnover.",
      "Pain, nausea, and constipation clusters during active treatment.",
    ],
    priorityAssessments: [
      "Oral mucosa, skin, and IV sites daily for infection.",
      "Bleeding signs when platelets are low.",
      "Fluid balance with nephrotoxic chemo agents.",
    ],
    safetyRisks: [
      "Extravasation from vesicant infusions.",
      "Transfusion reactions and massive transfusion protocols in hematology.",
      "Clostridioides difficile in broad-spectrum courses.",
    ],
    medsLabsEquipment: {
      medications: [
        "Antiemetic and bowel regimens tailored to regimen emetogenicity.",
        "Growth factors only when indicated — watch for bone pain.",
        "TLS prophylaxis when protocols trigger.",
      ],
      labs: [
        "CBC differentials trending neutrophils and platelets.",
        "Renal function with nephrotoxic drugs.",
        "Electrolytes during TLS risk windows.",
      ],
      equipment: [
        "Pumps programmed by credentialed staff with double-checks.",
        "Filtered masks and visitor policies during neutropenia.",
        "PCA pumps with respiratory monitoring when opioids escalate.",
      ],
    },
    communicationReporting: [
      "Oncology team updates that pair symptoms with cycle day.",
      "Palliative care introductions as extra support, not abandonment.",
      "Clinical trial consent clarity — who answers questions after hours.",
    ],
  },
  {
    slug: "renal-dialysis",
    title: "Renal / Dialysis",
    tagline: "Fluid, electrolytes, and access protection as daily craft.",
    lessonVisualKey: "renal_genitourinary",
    needToKnow: [
      "Dry weight is a moving target — integrate diet, missed runs, and edema.",
      "Access infections end careers for fistulas — sterile technique is personal.",
      "Transplant recipients live in immunosuppression balance — small symptoms matter.",
    ],
    commonPresentations: [
      "Hyperkalemia with ECG changes.",
      "Hypotension intradialytically with cramping.",
      "Uremic symptoms affecting cognition and appetite.",
    ],
    priorityAssessments: [
      "Access thrill and infection signs each treatment.",
      "Interdialytic weight gains with frank edema checks.",
      "Fluid overload with pulmonary congestion symptoms.",
    ],
    safetyRisks: [
      "Air embolism and blood exposure during line care.",
      "Heparin errors with dialysis circuits.",
      "Missed transplants or isolation flags on boarders.",
    ],
    medsLabsEquipment: {
      medications: [
        "ESA and IV iron policies with hemoglobin targets.",
        "Phosphate binders with meal coaching.",
        "Antihypertensives timed around treatment to reduce intradialytic hypotension.",
      ],
      labs: [
        "Potassium, calcium, phosphorus, and hemoglobin per schedule.",
        "PTH trends in chronic management.",
        "Hepatitis serologies when exposure occurs.",
      ],
      equipment: [
        "Dialysis machines with alarm limits explained to patients.",
        "Water treatment alarms escalated immediately per facility policy.",
        "Scales calibrated and used consistently pre/post treatment.",
      ],
    },
    communicationReporting: [
      "Nephrology sign-out with last-run complications and access plans.",
      "Patient education on fluid and diet budgets with teach-back.",
      "Transplant center communication for rejection concerns.",
    ],
  },
  {
    slug: "operating-room",
    title: "Operating Room",
    tagline: "Sterile discipline, counts, and advocacy for the unconscious patient.",
    lessonVisualKey: "fundamentals",
    needToKnow: [
      "Time-outs are safety culture — speak up if something does not match.",
      "Sterile field integrity is everyone's job, including traffic control.",
      "The patient cannot advocate — you chart what happened while they were asleep.",
    ],
    commonPresentations: [
      "Elective arthroplasty with tourniquet and blood-loss considerations.",
      "Laparoscopic cases with insufflation-related physiology shifts.",
      "Emergency cases where speed competes with completeness.",
    ],
    priorityAssessments: [
      "Positioning and padding before prep — nerves and skin take the hit later.",
      "Foley and warming devices placed and labeled correctly.",
      "Specimen labeling at bedside with two identifiers.",
    ],
    safetyRisks: [
      "Wrong-site, wrong-procedure, wrong-patient events — verify visibly.",
      "Retained surgical items when counts or imaging discipline slips.",
      "Fire risk with supplemental oxygen and cautery.",
    ],
    medsLabsEquipment: {
      medications: [
        "Antibiotic redosing tied to procedure length and blood loss.",
        "Vasoactive boluses only with anesthesia awareness.",
        "Local anesthetic toxicity awareness for regional blocks.",
      ],
      labs: [
        "Type and screen or crossmatch readiness for blood on field.",
        "Point-of-care glucose for insulin or steroid cases.",
        "Hemoglobin when blood loss exceeds estimates.",
      ],
      equipment: [
        "Electrosurgical unit settings and grounding pads inspected.",
        "Tourniquet times announced and logged.",
        "Implant logs completed for recalls and consents.",
      ],
    },
    communicationReporting: [
      "Closed-loop during sponge/instrument counts.",
      "Briefings that surface equipment quirks or allergy concerns.",
      "Handoff to PACU with fluids, blood products, and positioning notes.",
    ],
  },
  {
    slug: "pacu",
    title: "PACU",
    tagline: "Emergence, airway vigilance, and pain control in the immediate post-op window.",
    lessonVisualKey: "pain_sedation",
    needToKnow: [
      "Airway reflexes return unevenly — phase I is not the place for rushed extubation decisions you do not own.",
      "Nausea, shivering, and pain cluster — treat holistically.",
      "Aldrete or equivalent scores should drive discharge readiness, not hallway pressure.",
    ],
    commonPresentations: [
      "Residual neuromuscular blockade with weak cough or shallow breathing.",
      "PONV after volatile anesthetics or opioid-heavy cases.",
      "Hypothermia and pain amplifying each other.",
    ],
    priorityAssessments: [
      "Oxygenation, respiratory rate, and effort at rest and with stimulation.",
      "Surgical site checks aligned to procedure type.",
      "Urinary retention after spinal or epidural cases.",
    ],
    safetyRisks: [
      "Unrecognized hemorrhage when vitals are masked by warming or beta-blockade.",
      "Opioid-induced respiratory depression stacked with sedatives.",
      "Falls when patients are still groggy but mobile.",
    ],
    medsLabsEquipment: {
      medications: [
        "Multimodal antiemetics with QT or sedation awareness per agent.",
        "Reversal agents only when indicated and monitored.",
        "PCA education before transfer to floor teams.",
      ],
      labs: [
        "Hemoglobin if bleeding suspected.",
        "Glucose for steroid or diabetes management.",
        "ABG when ventilation concerns arise.",
      ],
      equipment: [
        "Wall suction and oral airways at head of bed.",
        "Forced-air warming with skin checks.",
        "Capnography when policy requires for certain patients.",
      ],
    },
    communicationReporting: [
      "OR to PACU handoff with airway events, fluids, and antibiotics given.",
      "Floor report that names unresolved pain or oxygen needs.",
      "Family updates when emergence agitation or confusion appears.",
    ],
  },
  {
    slug: "community-public-health",
    title: "Community / Public Health",
    tagline: "Population lenses, prevention, and upstream drivers of health.",
    lessonVisualKey: "primary_care",
    needToKnow: [
      "Social determinants show up as “non-adherence” — investigate barriers first.",
      "Outbreak response is logistics plus messaging — clarity reduces panic.",
      "Immunization registries and school laws are operational tools, not trivia.",
    ],
    commonPresentations: [
      "Immunization catch-up schedules across ages.",
      "TB contact investigations and latent treatment pathways.",
      "Maternal–child home visiting for high-risk families.",
    ],
    priorityAssessments: [
      "Growth charts and developmental screens in pediatric outreach.",
      "Blood pressure and A1c in adult screening fairs.",
      "Housing, food, and transportation needs on every intake when relevant.",
    ],
    safetyRisks: [
      "Cold chain breaks for vaccines in field settings.",
      "Privacy breaches when charting in public spaces.",
      "Personal safety during home visits — trust your instincts and policy.",
    ],
    medsLabsEquipment: {
      medications: [
        "Depot injections with standing orders verified against allergies.",
        "Narcan distribution education with community partners.",
        "Antibiotic stewardship in mass prophylaxis scenarios when rare.",
      ],
      labs: [
        "Point-of-care HIV or HCV screens with confirmatory pathways.",
        "Lead levels in pediatric environmental exposures.",
        "Strep throat testing with antibiotic criteria clarity.",
      ],
      equipment: [
        "Sharps containers secured in mobile units.",
        "Refrigerator logs for vaccines.",
        "PPE appropriate to outbreak agent when applicable.",
      ],
    },
    communicationReporting: [
      "Plain-language messaging for diverse literacy levels.",
      "Coordination with schools, shelters, and faith groups when programs scale.",
      "Escalation to public health authority when reportable conditions appear.",
    ],
  },
  {
    slug: "primary-care-clinics",
    title: "Primary Care / Clinics",
    tagline: "Time-boxed visits with longitudinality — prevention, chronic disease, and coordination.",
    lessonVisualKey: "primary_care",
    needToKnow: [
      "Agenda setting in the first minute saves the last ten.",
      "Screening overdue flags are opportunities — prioritize by risk, not convenience.",
      "Inbox and refill workflows are patient safety surfaces — treat them like meds administration.",
    ],
    commonPresentations: [
      "Hypertension and diabetes follow-up with medication titration.",
      "Mental health visits embedded in primary care.",
      "URI vs early pneumonia risk stratification.",
    ],
    priorityAssessments: [
      "Preventive cancer screens aligned to age and risk.",
      "Foot and retinal intervals for diabetes when applicable.",
      "Safety cues for intimate partner violence using scripted screens.",
    ],
    safetyRisks: [
      "Missed follow-up on abnormal labs placed in wrong pools.",
      "Antibiotic overuse for viral illnesses.",
      "Diagnostic delay when visit compression skips red flags.",
    ],
    medsLabsEquipment: {
      medications: [
        "Renally dosed meds with updated creatinine in chart.",
        "Drug interactions when new psychotropics layer on chronic meds.",
        "Deprescribing conversations for fall-prone elders.",
      ],
      labs: [
        "A1c, lipids, and microalbumin cadences per guidelines.",
        "Age-appropriate cancer screening tests tracked to completion.",
        "Point-of-care INR with bridging education when needed.",
      ],
      equipment: [
        "ECG machine readiness for chest pain walk-ins per policy.",
        "Spirometry cleaning and calibration discipline.",
        "Exam tables and lifts that protect your body mechanics.",
      ],
    },
    communicationReporting: [
      "After-visit summaries that list new meds and return precautions.",
      "Closed-loop referrals with expected turnaround times.",
      "Care team messages that avoid blame — focus on patient goal.",
    ],
  },
  {
    slug: "home-care",
    title: "Home Care",
    tagline: "Autonomous visits, environmental hazards, and teaching in real kitchens and stairwells.",
    lessonVisualKey: "chronic_disease_management",
    needToKnow: [
      "Your phone is a lifeline — keep charge, GPS, and panic protocols clear.",
      "Infection control includes pets, mold, and crowded multigenerational homes.",
      "Scope boundaries blur — know what requires MD notification vs ED referral.",
    ],
    commonPresentations: [
      "Wound vac changes with contamination risks in non-ideal settings.",
      "CHF diuretic titration with daily weights by phone or visit.",
      "Post-hospital IV antibiotics with lab coordination logistics.",
    ],
    priorityAssessments: [
      "Home oxygen safety, smoking materials, and egress.",
      "Caregiver strain and respite resources.",
      "Medication storage, refrigeration needs, and literacy-appropriate teaching.",
    ],
    safetyRisks: [
      "Violence in unfamiliar neighborhoods — follow agency safety policies.",
      "Needle sticks with home sharps containers.",
      "Missed visits when communication fails — escalate early.",
    ],
    medsLabsEquipment: {
      medications: [
        "Insulin and warfarin teaching with home monitoring plans.",
        "High-risk injectables with cold chain in patient fridges.",
        "Disposal instructions for opioids and sharps.",
      ],
      labs: [
        "Home draw schedules aligned with agency contracts.",
        "INR point-of-care with escalation parameters documented.",
        "BMP when diuretics change in hot weather.",
      ],
      equipment: [
        "Backup batteries for pumps and concentrators.",
        "Proper PPE bags left in the car trunk, not the porch.",
        "Telehealth kits tested before relying on remote visits.",
      ],
    },
    communicationReporting: [
      "Sandwich technique for sensitive home observations.",
      "Case manager alerts for hoarding, neglect, or self-neglect concerns.",
      "Physician summaries that name next visit owner and triggers.",
    ],
  },
  {
    slug: "hospice-palliative-care",
    title: "Hospice / Palliative Care",
    tagline: "Symptom mastery, sacred pauses, and family systems under strain.",
    lessonVisualKey: "ethics",
    needToKnow: [
      "Comfort is the outcome — titrate meds to effect, not arbitrary ceilings.",
      "Grief starts before death — document family supports and faith traditions.",
      "Ethical distress is common — debrief without judgment.",
    ],
    commonPresentations: [
      "Dyspnea and air hunger at end of life.",
      "Pain crises with opioid rotation or adjuvants.",
      "Terminal delirium with caregiver education.",
    ],
    priorityAssessments: [
      "Nonverbal pain cues when patients cannot self-report.",
      "Secretions and positioning for noisy breathing perceptions.",
      "Skin integrity and mouth care as dignity interventions.",
    ],
    safetyRisks: [
      "Medication errors when switching between continuous and bolus schedules.",
      "Caregiver exhaustion leading to unsafe transfers.",
      "Moral distress when goals are unclear — escalate ethics early.",
    ],
    medsLabsEquipment: {
      medications: [
        "Opioid and benzodiazepine synergy with explicit monitoring plans.",
        "Anticholinergics for secretions with paradoxical agitation awareness.",
        "Laxatives alongside opioids — constipation is a symptom patients remember.",
      ],
      labs: [
        "Labs often de-escalate — know what still informs comfort decisions.",
        "Renal dosing when oral absorption is unpredictable.",
        "Infrequent glucose checks if steroids are used for comfort.",
      ],
      equipment: [
        "Hospital beds and overlays for safe turning in the home.",
        "Suction and oxygen concentrators staged before crisis.",
        "Backup medication kits when geographic distance delays pharmacy.",
      ],
    },
    communicationReporting: [
      "Family meetings with silence tolerance — answer questions, then stop talking.",
      "Children and adolescents need age-specific explanations.",
      "After-death care expectations and mementos handled respectfully.",
    ],
  },
] as const;

const SLUG_SET = new Set(DEFS.map((d) => d.slug));

export function listNewGradWorkAreas(): readonly NewGradWorkAreaDefinition[] {
  return DEFS;
}

export function getNewGradWorkAreaBySlug(slug: string): NewGradWorkAreaDefinition | null {
  const key = slug.trim().toLowerCase();
  const hit = DEFS.find((d) => d.slug === key);
  return hit ?? null;
}

export function isNewGradWorkAreaSlug(slug: string): boolean {
  return SLUG_SET.has(slug.trim().toLowerCase());
}

export function listNewGradWorkAreaSlugs(): readonly string[] {
  return DEFS.map((d) => d.slug);
}
