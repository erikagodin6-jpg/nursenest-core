/** Phase-1 English ECG long-tail topics (canonical). First 10 share `nn-ecg-p1-01`…`nn-ecg-p1-10` with localized siblings. */

export type EcgPhase1Topic = {
  slug: string;
  translationGroupId: string;
  title: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  category: string;
};

export const ECG_PHASE1_EN_TOPICS: EcgPhase1Topic[] = [
  {
    slug: "ecg-p1-read-twelve-lead-systematic-rn-paramedic",
    translationGroupId: "nn-ecg-p1-01",
    title: "How to Read a 12-Lead ECG: A Systematic, Exam-Ready Framework for Nurses and Paramedics",
    excerpt:
      "Build a repeatable sequence for rate, rhythm, axis, intervals, and ischemia patterns so STEMI mimics, blocks, and electrolyte emergencies are less likely to hide in plain sight.",
    seoTitle: "How to Read a 12-Lead ECG: Systematic Framework | NurseNest",
    seoDescription:
      "Stepwise 12-lead ECG interpretation for RN, PN, NP, paramedic, and RT learners: axis, blocks, ischemia, mimics, and escalation cues aligned with acute care practice.",
    tags: ["ECG", "12-lead", "STEMI", "NCLEX", "Paramedic", "Clinical judgment"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-atrial-fibrillation-stroke-prevention-nursing",
    translationGroupId: "nn-ecg-p1-02",
    title: "Atrial Fibrillation on ECG: Rate Control, Rhythm Clues, and Stroke-Prevention Thinking for Clinicians",
    excerpt:
      "Translate irregular RR intervals and absent P waves into a structured risk narrative that connects anticoagulation concepts, hemodynamic instability, and time-sensitive escalation.",
    seoTitle: "Atrial Fibrillation ECG: Nursing & Paramedic Guide | NurseNest",
    seoDescription:
      "AFib ECG recognition, fast vs slow presentations, accessory-pathway red flags, and exam-style prioritization for nurses, advanced practice learners, and EMS clinicians.",
    tags: ["ECG", "Atrial fibrillation", "Stroke", "Anticoagulation", "Emergency nursing"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-hyperkalemia-progression-peaked-t-wide-qrs",
    translationGroupId: "nn-ecg-p1-03",
    title: "Hyperkalemia ECG Progression: Peaked T Waves, PR Widening, and Sine-Wave Teaching for Acute Teams",
    excerpt:
      "Trace potassium-mediated changes from subtle T-wave peaking through conduction failure so dialysis, calcium therapy, and insulin protocols are framed with correct urgency.",
    seoTitle: "Hyperkalemia ECG Changes: Progression & Emergencies | NurseNest",
    seoDescription:
      "High-yield hyperkalemia ECG patterns for ICU, ED, and dialysis contexts: peaked T waves, QRS widening, sine morphology, pacing risks, and stabilizing priorities.",
    tags: ["ECG", "Hyperkalemia", "Electrolytes", "Emergency", "Dialysis"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-ventricular-tachycardia-monomorphic-polymorphic-storm",
    translationGroupId: "nn-ecg-p1-04",
    title: "Ventricular Tachycardia on ECG: Monomorphic vs Polymorphic Patterns, Storm Context, and Stabilization",
    excerpt:
      "Differentiate VT from SVT with aberrancy using bundle context, capture beats, and clinical instability while linking polymorphic VT to ischemia, QT syndromes, and electrolytes.",
    seoTitle: "Ventricular Tachycardia ECG: VT vs Wide SVT | NurseNest",
    seoDescription:
      "Wide-complex tachycardia teaching for paramedics and nurses: VT criteria, polymorphic VT, torsades overlap, synchronized cardioversion framing, and post-ROSC care hooks.",
    tags: ["ECG", "Ventricular tachycardia", "ACLS", "Paramedic", "Cardiology"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-anterior-stemi-patterns-v2-v6-reciprocal-changes",
    translationGroupId: "nn-ecg-p1-05",
    title: "Anterior STEMI ECG Patterns: V2–V6 ST Elevation, Reciprocal Depression, and High-Lateral Extension",
    excerpt:
      "Anchor occlusion teaching to precordial lead groups, septal involvement, and reciprocal changes in inferior leads so cath lab activation language matches what the tracing shows.",
    seoTitle: "Anterior STEMI ECG: V2–V6 & Reciprocal Changes | NurseNest",
    seoDescription:
      "Anterior MI ECG essentials for acute care: lead clustering, hyperacute T waves, Wellens overlap cautions, and documentation phrases that support time-sensitive care.",
    tags: ["ECG", "STEMI", "Acute coronary syndrome", "Critical care", "Paramedic"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-inferior-stemi-rv-involvement-right-sided-leads",
    translationGroupId: "nn-ecg-p1-06",
    title: "Inferior STEMI and RV Involvement: ECG Clues, Right-Sided Leads, and Preload-Sensitive Management",
    excerpt:
      "Pair ST elevation in II/III/aVF with hypotension, clear lungs, and ST elevation in V4R teaching so nitrate contraindications and fluid resuscitation reasoning stay exam-correct.",
    seoTitle: "Inferior STEMI ECG & RV Infarction Clues | NurseNest",
    seoDescription:
      "Inferior MI recognition, reciprocal lateral change, RV extension patterns, and EMS-to-ICU pearls for nurses, NPs, and paramedics preparing for high-stakes scenarios.",
    tags: ["ECG", "STEMI", "Right ventricle", "Preload", "Emergency"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-posterior-mi-st-depression-v1-v3-rvq",
    translationGroupId: "nn-ecg-p1-07",
    title: "Posterior MI ECG Recognition: Horizontal ST Depression in V1–V3, Tall R Waves, and Posterior Leads",
    excerpt:
      "Reframe “nonspecific ST changes” into posterior occlusion suspicion using precordial ST/T vector patterns and optional V7–V9 acquisition for cath lab communication.",
    seoTitle: "Posterior MI ECG: V1–V3 Patterns & V7–V9 | NurseNest",
    seoDescription:
      "Posterior STEMI equivalents for ED and telemetry nurses: reciprocal change logic, tall R in V2, acquisition tips, and escalation language without overcalling benign repolarization.",
    tags: ["ECG", "STEMI", "Posterior MI", "Telemetry", "Critical care"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-lbbb-ischemia-sgarbossa-modified-criteria-teaching",
    translationGroupId: "nn-ecg-p1-08",
    title: "Left Bundle Branch Block and Ischemia: Sgarbossa and Modified Criteria for Acute Occlusion Suspicion",
    excerpt:
      "Use concordant ST deviation, excessive discordance, and rhythm stability anchors to decide when serial ECGs, echo, and invasive strategies belong in the same teaching story.",
    seoTitle: "LBBB ECG & Sgarbossa Ischemia Criteria | NurseNest",
    seoDescription:
      "LBBB STEMI diagnosis support for advanced learners: original and modified Sgarbossa rules, pacing caveats, and documentation that preserves safety without false certainty.",
    tags: ["ECG", "LBBB", "STEMI", "Sgarbossa", "Cardiology"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-pericarditis-diffuse-st-pr-depression-concave",
    translationGroupId: "nn-ecg-p1-09",
    title: "Pericarditis ECG: Diffuse ST Elevation, PR Depression, and Spodick Sign Teaching vs Early Repolarization",
    excerpt:
      "Contrast concave ST morphology with widespread involvement and PR segments against regional STEMI patterns so learners avoid anchoring on troponin alone in inflammatory pain.",
    seoTitle: "Pericarditis ECG vs STEMI: Diffuse ST & PR | NurseNest",
    seoDescription:
      "Pericarditis pattern recognition for nurses and RT learners: PR depression, reciprocal aVR, rhythm overlap, tamponade progression cues, and safe ED communication habits.",
    tags: ["ECG", "Pericarditis", "STEMI mimic", "Emergency nursing", "Pain"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-early-repolarization-vs-stemi-j-point-notching",
    translationGroupId: "nn-ecg-p1-10",
    title: "Early Repolarization vs STEMI: J-Point Notching, Concavity, and Clinical Risk Features That Change Management",
    excerpt:
      "Separate benign repolarization from occlusion using symptom quality, regional clustering, reciprocal change, and serial acquisition habits that hold up under QA review.",
    seoTitle: "Early Repolarization vs STEMI on ECG | NurseNest",
    seoDescription:
      "High-yield STEMI mimic teaching: early repolarization morphology, young athlete contexts, serial ECG discipline, and escalation thresholds for nurses and paramedics.",
    tags: ["ECG", "STEMI", "Early repolarization", "Mimics", "Emergency"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-second-degree-av-block-type1-type2-risk-teaching",
    translationGroupId: "nn-ecg-p1-11",
    title: "Second-Degree AV Block: Type I vs Type II Patterns, Pacing Risk, and Telemetry Monitoring Priorities",
    excerpt:
      "Map Wenckebach grouping to benign contexts when appropriate while isolating Mobitz II as a high-risk conduction emergency that demands escalation foresight on exams and wards.",
    seoTitle: "2nd-Degree AV Block Type I vs II ECG | NurseNest",
    seoDescription:
      "AV block teaching for telemetry nurses: grouped beating, PR behavior, escape rhythms, drug toxicity overlap, and when to prioritize transcutaneous pacing readiness.",
    tags: ["ECG", "AV block", "Telemetry", "Cardiology", "NCLEX"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-wpw-afib-preexcitation-danger-acls-pearls",
    translationGroupId: "nn-ecg-p1-12",
    title: "WPW with Atrial Fibrillation: Preexcitation, Rapid Conduction, and ACLS-Style Medication Hazards on Exams",
    excerpt:
      "Connect delta waves with irregular wide-complex AF and explain why AV nodal blockers can destabilize patients, pairing pathway physiology with synchronized cardioversion framing.",
    seoTitle: "WPW + AFib ECG Danger: Preexcitation ACLS | NurseNest",
    seoDescription:
      "WPW atrial fibrillation teaching for acute clinicians: delta wave review, AV nodal blocker risks, procainamide teaching points, and exam-safe stabilization language.",
    tags: ["ECG", "WPW", "Atrial fibrillation", "ACLS", "Paramedic"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-qt-prolongation-drug-induced-torsades-risk-nursing",
    translationGroupId: "nn-ecg-p1-13",
    title: "QT Prolongation and Drug-Induced Arrhythmia Risk: ECG Measurement, TdP Triggers, and Monitoring Bundles",
    excerpt:
      "Turn Bazett-corrected QT teaching into medication safety workflows that include electrolyte repletion, interaction checks, and escalation when polymorphic VT appears on telemetry.",
    seoTitle: "QT Prolongation ECG & Torsades Risk | NurseNest",
    seoDescription:
      "QT interval teaching for nurses and pharmacists-in-training: measurement pitfalls, female sex hormone context, antiarrhythmic overlap, and magnesium-first stabilization cues.",
    tags: ["ECG", "QT interval", "Torsades", "Medication safety", "Telemetry"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-axis-deviation-rbbb-lafb-hyperkalemia-mimics",
    translationGroupId: "nn-ecg-p1-14",
    title: "Electrical Axis Deviation: LAFB, RVH, LBBB, and Hyperkalemia Mimics That Confuse Beginner ECG Readers",
    excerpt:
      "Use lead I and aVF dominance patterns to anchor physiology while linking extreme axis shifts to electrolyte catastrophe, lateral MI, and paced morphologies seen in practice.",
    seoTitle: "ECG Axis Deviation: Causes & Mimics | NurseNest",
    seoDescription:
      "Axis teaching for nursing and allied learners: RAD/LAD criteria, bifascicular block language, vertical axis in WPW, and exam traps that pair axis with conduction disease.",
    tags: ["ECG", "Axis", "Conduction", "Electrolytes", "NCLEX"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-avnrt-vs-avrt-narrow-complex-tachycardia-clues",
    translationGroupId: "nn-ecg-p1-15",
    title: "AVNRT vs AVRT: Narrow-Complex Tachycardia Clues, Pseudo R Prime, and Valsalva Teaching for Bedside Teams",
    excerpt:
      "Differentiate short-RP tachycardias using retrograde P timing, RP intervals, and response to vagal maneuvers while keeping aberrancy and antidromic WPW in the differential.",
    seoTitle: "AVNRT vs AVRT ECG Clues | NurseNest",
    seoDescription:
      "SVT mechanism teaching for nurses and paramedics: RP intervals, pseudo r′ in V1, concealed accessory pathways, and stable vs unstable vagal and adenosine framing.",
    tags: ["ECG", "SVT", "AVNRT", "Paramedic", "Telemetry"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-paced-rhythm-ischemia-st-t-interpretation-cautions",
    translationGroupId: "nn-ecg-p1-16",
    title: "Paced Rhythms and Ischemia: ECG Interpretation Limits, Capture, Fusion, and Serial Comparison Discipline",
    excerpt:
      "Explain why paced ST segments distort STEMI criteria and how serial tracings, clinical correlation, and pacing spikes help teams avoid both missed occlusion and false activation.",
    seoTitle: "Paced Rhythm ECG & Ischemia Clues | NurseNest",
    seoDescription:
      "Paced ECG teaching for ICU and telemetry nurses: capture/fusion, appropriate discordance, Sgarbossa pacing cautions, and escalation communication without overconfidence.",
    tags: ["ECG", "Pacing", "STEMI", "ICU", "Telemetry"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-hypokalemia-u-waves-qt-st-flattening-teaching",
    translationGroupId: "nn-ecg-p1-17",
    title: "Hypokalemia ECG: U Waves, QT Stretching, ST Flattening, and Arrhythmia Vulnerability in Medical Wards",
    excerpt:
      "Link gastrointestinal losses and diuretics to repolarization instability so learners anticipate digitalis toxicity overlap and repletion priorities before torsades risk rises.",
    seoTitle: "Hypokalemia ECG Changes: U Waves & QT | NurseNest",
    seoDescription:
      "Hypokalemia pattern recognition for nurses: U waves, ST changes, arrhythmia risk, repletion teaching, and exam items that pair electrolytes with medication effects.",
    tags: ["ECG", "Hypokalemia", "Electrolytes", "Telemetry", "NCLEX"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-digitalis-effect-st-scooping-tachy-brady-arrhythmias",
    translationGroupId: "nn-ecg-p1-18",
    title: "Digitalis Effect on ECG: ST Scooping, Tachy-Brady Syndromes, and Toxicity Overlap With Hyperkalemia",
    excerpt:
      "Separate therapeutic repolarization changes from toxicity using rhythm instability, GI symptoms, and renal failure context while reinforcing drug level and pacing caveats.",
    seoTitle: "Digitalis Effect ECG & Toxicity Clues | NurseNest",
    seoDescription:
      "Digoxin-related ECG teaching for acute care nurses: scooped ST depression, paroxysmal arrhythmias, AV block overlap, and exam-style prioritization with safety language.",
    tags: ["ECG", "Digoxin", "Toxicology", "Telemetry", "Pharmacology"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-rv-strain-pe-s1q3t3-t-wave-inversions-v1-v4",
    translationGroupId: "nn-ecg-p1-19",
    title: "RV Strain and Pulmonary Embolism: S1Q3T3 Teaching, T Inversions V1–V4, and Bedside Correlation Limits",
    excerpt:
      "Position PE ECG findings as supportive rather than diagnostic while pairing sinus tachycardia, incomplete RBBB patterns, and clinical pretest probability language for teams.",
    seoTitle: "Pulmonary Embolism ECG: RV Strain Patterns | NurseNest",
    seoDescription:
      "PE ECG teaching for nurses and RT learners: S1Q3T3 nuance, T inversion progression, Brugada mimic cautions, and escalation without anchoring on a single finding.",
    tags: ["ECG", "Pulmonary embolism", "Critical care", "Telemetry"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-wellens-syndrome-t-wave-precursors-anterior-ischemia",
    translationGroupId: "nn-ecg-p1-20",
    title: "Wellens Syndrome: Biphasic and Deeply Inverted T Waves in V2–V3 as Precursors to Anterior Occlusion",
    excerpt:
      "Teach pain-free ischemia windows, serial acquisition expectations, and cath lab communication that distinguishes Wellens mimicry from benign T-wave variants on telemetry.",
    seoTitle: "Wellens Syndrome ECG Patterns | NurseNest",
    seoDescription:
      "Wellens teaching for ED and progressive care nurses: T-wave evolution, troponin dynamics language, false reassurance traps, and escalation documentation habits.",
    tags: ["ECG", "Wellens", "STEMI", "Telemetry", "Cardiology"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-de-winter-t-waves-stemi-equivalent-anterior-occlusion",
    translationGroupId: "nn-ecg-p1-21",
    title: "de Winter T Waves: STEMI-Equivalent Anterior Occlusion Pattern Without Classic ST Elevation",
    excerpt:
      "Highlight upsloping ST depression with tall symmetrical T waves in precordial leads so learners activate occlusion pathways when traditional STE criteria are absent.",
    seoTitle: "de Winter T Waves: STEMI Equivalent ECG | NurseNest",
    seoDescription:
      "de Winter pattern teaching for paramedics and nurses: precordial lead clustering, cath lab activation language, and mimic differentiation from hyperkalemia and LVH.",
    tags: ["ECG", "STEMI equivalent", "Acute coronary syndrome", "Paramedic"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-brugada-pattern-type1-risk-stratification-basics",
    translationGroupId: "nn-ecg-p1-22",
    title: "Brugada Pattern on ECG: Type 1 Coved ST Elevation, Fever Triggers, and Risk-Stratification Teaching Basics",
    excerpt:
      "Connect J-point elevation in V1–V2 with sodium channel physiology and syncope triggers while keeping diagnosis boundaries clear for exam questions about unstable ventricular arrhythmias.",
    seoTitle: "Brugada Pattern ECG Basics | NurseNest",
    seoDescription:
      "Brugada ECG overview for advanced learners: type patterns, fever and drug triggers, syncope correlation, and ED observation language without overstepping electrophysiology scope.",
    tags: ["ECG", "Brugada", "Syncope", "Emergency", "Cardiology"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-epsilon-wave-arrhythmogenic-cardiomyopathy-teaching",
    translationGroupId: "nn-ecg-p1-23",
    title: "Epsilon Waves and ARVC Teaching: Low-Amplitude Potentials, Epsilon in V1, and VT Storm Context",
    excerpt:
      "Place epsilon waves into channelopathy teaching for boards while emphasizing low sensitivity and the need for imaging, genetics, and specialist referral framing in documentation.",
    seoTitle: "Epsilon Wave ECG & ARVC Teaching | NurseNest",
    seoDescription:
      "ARVC-related ECG pearls for cardiology-curious nurses: epsilon waves, T inversion in V1–V3, VT mechanisms, and exam-safe referral language.",
    tags: ["ECG", "ARVC", "Cardiomyopathy", "Telemetry", "Advanced"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-osborn-j-waves-hypothermia-staging-rewarming-hooks",
    translationGroupId: "nn-ecg-p1-24",
    title: "Osborn J Waves and Hypothermia: ECG Staging Hooks, Shivering Limits, and Arrhythmia Vulnerability in ED Care",
    excerpt:
      "Link J-point notching to core temperature trends and rewarming strategies while pairing bradydysrhythmias with gentle handling teaching for EMS and resuscitation courses.",
    seoTitle: "Hypothermia ECG: Osborn J Waves | NurseNest",
    seoDescription:
      "Hypothermia ECG teaching for paramedics and nurses: Osborne waves, VF risk, pacing considerations, and exam-style rewarming priorities with trauma overlap cautions.",
    tags: ["ECG", "Hypothermia", "EMS", "Emergency", "Resuscitation"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-sodium-channel-blocker-overdose-wide-qrs-terminal-r",
    translationGroupId: "nn-ecg-p1-25",
    title: "Sodium Channel Blocker Toxicity: Wide QRS, Terminal R Wave in aVR, and Alkalinization Teaching for Tox Teams",
    excerpt:
      "Map tricyclic and class IA exposure patterns to axis shifts and terminal R prominence so learners connect sodium channel blockade with bicarbonate therapy and seizure precautions.",
    seoTitle: "TCA Overdose ECG: Wide QRS & aVR | NurseNest",
    seoDescription:
      "Sodium channel blocker ECG teaching for ED nurses: terminal R in aVR, right axis shift, seizure risk, bicarbonate strategy language, and exam prioritization.",
    tags: ["ECG", "Toxicology", "Wide QRS", "Emergency", "Pharmacology"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-cardiac-tamponade-low-voltage-alternans-teaching",
    translationGroupId: "nn-ecg-p1-26",
    title: "Cardiac Tamponade ECG Teaching: Electrical Alternans, Low Voltage, and Clinical Exam Correlation Limits",
    excerpt:
      "Pair sinus tachycardia with QRS alternans and pericardial effusion physiology while reinforcing that ECG sensitivity is imperfect and echo-first thinking belongs in escalation teaching.",
    seoTitle: "Tamponade ECG: Alternans & Low Voltage | NurseNest",
    seoDescription:
      "Tamponade ECG pearls for ICU and ED nurses: electrical alternans, QRS alternans nuance, RA collapse echo hooks, and exam traps about pulsus paradoxus documentation.",
    tags: ["ECG", "Tamponade", "Critical care", "Emergency", "ICU"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-acls-tachycardia-algorithms-stable-unstable-pearls",
    translationGroupId: "nn-ecg-p1-27",
    title: "ACLS Tachycardia Algorithms: Stable vs Unstable Branching, Pulse Checks, and ECG-Gated Therapy Decisions",
    excerpt:
      "Translate wide versus narrow algorithms into synchronized cardioversion thresholds, adenosine cautions, and post-conversion monitoring priorities that match AHA-style exam stems.",
    seoTitle: "ACLS Tachycardia & ECG Branching | NurseNest",
    seoDescription:
      "ACLS tachycardia teaching for nurses and paramedics: pulse assessment, unstable VT framing, WPW drug hazards, and documentation that supports team coordination.",
    tags: ["ECG", "ACLS", "Paramedic", "Telemetry", "Resuscitation"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-narrow-complex-tachycardia-avnrt-junctional-differentials",
    translationGroupId: "nn-ecg-p1-28",
    title: "Narrow-Complex Tachycardia: AVNRT, Junctional Tachycardia, and Atrial Tachycardia Differentiation for Telemetry",
    excerpt:
      "Use RP intervals, P-wave axis in inferior leads, and response to maneuvers to separate mechanisms while keeping rate-related ischemia and sepsis tachycardia in the differential.",
    seoTitle: "Narrow-Complex Tachycardia ECG | NurseNest",
    seoDescription:
      "Narrow QRS tachycardia teaching for progressive care nurses: AVNRT vs atrial tach, junctional rhythms, MAT overlap cautions, and exam-safe vagal maneuver sequencing.",
    tags: ["ECG", "SVT", "Telemetry", "NCLEX", "Cardiology"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-wide-complex-tachycardia-vt-vs-svt-aberrancy-algorithm",
    translationGroupId: "nn-ecg-p1-29",
    title: "Wide-Complex Tachycardia: VT vs SVT with Aberrancy Using Brugada-Style Exam Algorithms and Instability Rules",
    excerpt:
      "Anchor unstable presentations to cardioversion while teaching Brugada lead-based steps only as a memory scaffold that never replaces defibrillation readiness in real care.",
    seoTitle: "Wide QRS Tachycardia: VT vs Aberrancy | NurseNest",
    seoDescription:
      "Wide-complex tachycardia teaching for paramedics: VT score memory aids, capture beats, fusion beats, and exam language about unstable VT management priorities.",
    tags: ["ECG", "VT", "ACLS", "Paramedic", "Telemetry"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-magnesium-torsades-ems-repletion-drip-teaching",
    translationGroupId: "nn-ecg-p1-30",
    title: "Magnesium for Torsades and Polymorphic VT: EMS and ICU Repletion Teaching, Drip Safety, and Post-Conversion Monitoring",
    excerpt:
      "Connect prolonged QT substrates with isoproterenol and pacing hooks in refractory cases while keeping magnesium bolus dosing language aligned with protocol-first education.",
    seoTitle: "Magnesium & Torsades ECG Teaching | NurseNest",
    seoDescription:
      "Torsades management teaching for nurses and paramedics: magnesium bolus, overdrive pacing concepts, electrolyte repletion, and exam traps about unsynchronized shocks.",
    tags: ["ECG", "Torsades", "Magnesium", "ACLS", "ICU"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-prehospital-12-lead-transmission-stemi-systems-of-care",
    translationGroupId: "nn-ecg-p1-31",
    title: "Prehospital 12-Lead Transmission: STEMI Systems of Care, Activation Documentation, and False-Positive Reduction",
    excerpt:
      "Frame field acquisition quality, transmission artifacts, and receiving hospital feedback loops so EMS learners understand how ECG decisions integrate with regional STEMI metrics.",
    seoTitle: "EMS 12-Lead ECG Transmission & STEMI | NurseNest",
    seoDescription:
      "Prehospital ECG systems teaching for paramedics: transmission quality, activation criteria, false activation reduction, and interfacility communication habits for acute MI care.",
    tags: ["ECG", "STEMI", "EMS", "Paramedic", "Systems of care"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-rt-cardiac-monitoring-lead-placement-noise-artifact-control",
    translationGroupId: "nn-ecg-p1-32",
    title: "Respiratory Therapist Cardiac Monitoring: Lead Placement Discipline, Noise Reduction, and Alarm Fatigue Ethics",
    excerpt:
      "Connect skin preparation, lead selection for arrhythmia surveillance, and artifact recognition with escalation pathways so RT learners support nursing telemetry teams safely.",
    seoTitle: "RT Cardiac Monitoring & ECG Artifact | NurseNest",
    seoDescription:
      "RT-focused ECG monitoring teaching: lead placement, muscle artifact, baseline wander, and escalation communication for acute care environments and licensing exam prep.",
    tags: ["ECG", "Respiratory therapy", "Telemetry", "Patient safety"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-np-outpatient-ecg-chest-pain-risk-stratification-basics",
    translationGroupId: "nn-ecg-p1-33",
    title: "NP Outpatient ECG Skills: Chest Pain Risk Stratification Basics, Serial ECG Windows, and Referral Language",
    excerpt:
      "Pair primary care access with conservative escalation teaching so advanced practice learners know when ED referral, stress testing discussion, and occlusion suspicion belong in documentation.",
    seoTitle: "NP Outpatient ECG & Chest Pain Risk | NurseNest",
    seoDescription:
      "NP-oriented ECG teaching: stable chest pain frameworks, Wellens caution language, troponin pathway hooks, and exam-safe referral thresholds without overpromising diagnosis.",
    tags: ["ECG", "Nurse practitioner", "Primary care", "Chest pain"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-allied-health-telemetry-basics-ecg-vocabulary-for-handoffs",
    translationGroupId: "nn-ecg-p1-34",
    title: "Allied Health Telemetry Basics: ECG Vocabulary for Handoffs, Rate-Rhythm Reporting, and Escalation Scripts",
    excerpt:
      "Give PT, OT, and other allied partners a concise rhythm lexicon and escalation script so interdisciplinary teams communicate ischemia suspicion without overstepping scope boundaries.",
    seoTitle: "Allied Health ECG Telemetry Basics | NurseNest",
    seoDescription:
      "Allied health ECG vocabulary for safe handoffs: rate reporting, artifact suspicion language, escalation triggers, and interprofessional respect for nursing and provider roles.",
    tags: ["ECG", "Allied health", "Telemetry", "Communication"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-nclex-style-ecg-strip-questions-prioritization-discipline",
    translationGroupId: "nn-ecg-p1-35",
    title: "NCLEX-Style ECG Questions: Prioritization Discipline, Safety-First Answer Patterns, and Strip-Reading Rituals",
    excerpt:
      "Train elimination rules that favor airway, lethal arrhythmias, and time-sensitive MI activation over interesting but lower-yield distractors on nursing licensure style items.",
    seoTitle: "NCLEX ECG Questions: Prioritization | NurseNest",
    seoDescription:
      "NCLEX-oriented ECG teaching: strip reading order, unstable tachycardia choices, hyperkalemia vs STEMI distractors, and safety-first rationale writing for exams.",
    tags: ["ECG", "NCLEX", "Test strategy", "Clinical judgment"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-cat-style-adaptive-ecg-practice-momentum-for-rn-learners",
    translationGroupId: "nn-ecg-p1-36",
    title: "CAT-Style Adaptive ECG Practice: Building Momentum for RN Learners With Weak-Area Targeting and Confidence Loops",
    excerpt:
      "Connect spaced repetition, rationale review, and premium module drills to a study cadence that reduces cognitive overload while improving recognition speed under time pressure.",
    seoTitle: "Adaptive ECG Practice for RN Momentum | NurseNest",
    seoDescription:
      "CAT-style study habits for ECG learners: adaptive question loops, error review discipline, premium ECG module integration, and confidence-building schedules for exam preparation.",
    tags: ["ECG", "CAT", "Adaptive learning", "NCLEX", "Study skills"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-artifact-muscle-tremor-poor-contact-vs-vf-misidentification",
    translationGroupId: "nn-ecg-p1-37",
    title: "ECG Artifact: Muscle Tremor, Poor Contact, and VF Misidentification Risks in Monitored Environments",
    excerpt:
      "Teach signal processing basics, lead checks, and pause-for-rhythm strips so learners avoid inappropriate shocks and false code activations during artifact-heavy bedside situations.",
    seoTitle: "ECG Artifact vs VF: Safety Teaching | NurseNest",
    seoDescription:
      "Artifact recognition for telemetry nurses: muscle tremor, Parkinsonian oscillation, loose leads, and exam scenarios about verifying rhythm before defibrillation decisions.",
    tags: ["ECG", "Artifact", "Telemetry", "Patient safety"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-pediatric-ecg-rate-corrected-qt-bazett-teaching-limits",
    translationGroupId: "nn-ecg-p1-38",
    title: "Pediatric ECG Basics: Rate Norms, Corrected QT (Bazett) Teaching Limits, and Age-Adjusted Interpretation Cautions",
    excerpt:
      "Contrast adult STEMI criteria with pediatric repolarization norms while emphasizing specialist referral boundaries and parental communication ethics in educational scenarios.",
    seoTitle: "Pediatric ECG Rate & QT Teaching | NurseNest",
    seoDescription:
      "Pediatric ECG orientation for nurses: sinus tachycardia norms, QT correction caveats, congenital heart disease referral language, and exam traps about adult criteria misuse.",
    tags: ["ECG", "Pediatrics", "QT interval", "NCLEX"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-electrolyte-ecg-synthesis-panel-teaching-for-telemetry",
    translationGroupId: "nn-ecg-p1-39",
    title: "Electrolyte ECG Synthesis: Potassium, Calcium, and Magnesium Patterns on One Telemetry Teaching Panel",
    excerpt:
      "Integrate peaked T waves, QT shortening, and prolonged QT substrates into a single teaching schematic that supports progressive care nurses managing multi-electrolyte derangements.",
    seoTitle: "Electrolyte ECG Panel Teaching | NurseNest",
    seoDescription:
      "Combined electrolyte ECG teaching for nurses: K, Ca, Mg effects, digoxin overlap, repletion sequencing language, and exam prioritization for unstable arrhythmia prevention.",
    tags: ["ECG", "Electrolytes", "Telemetry", "Critical care"],
    category: "ECG interpretation",
  },
  {
    slug: "ecg-p1-long-qt-congenital-cascade-family-screening-teaching-hooks",
    translationGroupId: "nn-ecg-p1-40",
    title: "Congenital Long QT on ECG: Family Screening Hooks, Torsades Risk, and Sports Clearance Teaching for Clinicians",
    excerpt:
      "Position inherited channelopathy suspicion within syncope and drowning-in-the-bathtub history prompts while keeping diagnosis and sports clearance firmly in electrophysiology scope.",
    seoTitle: "Congenital Long QT ECG Teaching | NurseNest",
    seoDescription:
      "Long QT syndrome teaching for advanced learners: QTc screening cautions, gene testing referral language, medication avoidance education, and exam-safe patient counseling boundaries.",
    tags: ["ECG", "Long QT", "Genetics", "Sports medicine", "Telemetry"],
    category: "ECG interpretation",
  },
];
