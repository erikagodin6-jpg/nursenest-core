/**
 * ECG Clinical Reasoning Units — Phase 2
 *
 * Provides mechanism-based clinical reasoning for every rhythm in the library.
 * Goes beyond recognition criteria to teach:
 *   - WHY the strip looks the way it does (conduction mechanism)
 *   - WHAT the patient experiences (hemodynamics → presentation)
 *   - WHAT to do, in what order (escalation tiers)
 *   - WHAT NOT to do (exam traps, intervention contraindications)
 *   - HOW to distinguish from look-alikes (compare & contrast)
 *
 * Consumed by: lesson workspace, workstation shell, simulation engine,
 *              profession-specific views, compare-contrast lab.
 */

// ─── Type system ──────────────────────────────────────────────────────────────

export type EcgHemodynamicImpact = {
  /** Qualitative cardiac output effect */
  cardiacOutput: "normal" | "mildly_reduced" | "moderately_reduced" | "severely_reduced" | "absent";
  /** One sentence explaining the CO mechanism */
  cardiacOutputRationale: string;
  /** Expected BP effect */
  bloodPressureEffect: "normal" | "mildly_reduced" | "hypotensive" | "severely_hypotensive" | "variable";
  /** Free-text perfusion status */
  perfusionStatus: string;
  /** Symptom list ordered by severity */
  expectedSymptoms: readonly string[];
  /** True when the same rhythm can present stably or unstably depending on context */
  hemodynamicallyStagable: boolean;
};

export type EcgClinicalPresentation = {
  /** Presentation when the patient is hemodynamically compensated */
  stable: readonly string[];
  /** Presentation when the patient is decompensating */
  unstable: readonly string[];
  /** Findings that require immediate escalation even if vitals appear OK */
  redFlags: readonly string[];
  /** Findings that trigger code blue or RRT call */
  emergencyTriggers: readonly string[];
};

export type EcgEscalationLevel =
  | "monitor"
  | "notify_provider"
  | "rapid_response"
  | "code_blue"
  | "varies_by_stability";

export type EcgEscalationCriteria = {
  defaultLevel: EcgEscalationLevel;
  monitoringFrequency: string;
  immediateAssessments: readonly string[];
  notifyProviderWhen: readonly string[];
  rapidResponseWhen: readonly string[];
  codeBlueWhen: readonly string[];
  /** Interventions that are explicitly contraindicated for this rhythm */
  interventionContraindications: readonly string[];
};

export type EcgExamTraps = {
  /** NCLEX-RN / NCLEX-PN style traps */
  nclex: readonly string[];
  /** REx-PN specific traps */
  rexPn?: readonly string[];
  /** NP board / clinical reasoning traps */
  np?: readonly string[];
  /** Telemetry-specific recognition errors */
  telemetry?: readonly string[];
  /** Wrong-intervention traps */
  interventionTraps?: readonly string[];
};

export type EcgProfessionContent = {
  /** Single sentence on what this profession prioritises for this rhythm */
  focus: string;
  /** Key assessment or interpretation priorities */
  priorities: readonly string[];
  /** Concrete actions this profession takes */
  keyActions: readonly string[];
  /** Board/certification exam focus note */
  examFocus?: string;
};

export type EcgProfessionViews = {
  rn: EcgProfessionContent;
  rpn: EcgProfessionContent;
  np: EcgProfessionContent;
  rt?: EcgProfessionContent;
  newGrad: EcgProfessionContent;
};

export type EcgCompareContrast = {
  compareWithRhythmKey: string;
  compareWithName: string;
  keyDifferences: readonly {
    feature: string;
    thisRhythm: string;
    otherRhythm: string;
  }[];
  /** Why distinguishing these two rhythms matters clinically */
  clinicalImplication: string;
};

export type EcgSimulationScenarioType =
  | "stable_monitoring"
  | "deterioration"
  | "emergency"
  | "medication_effect"
  | "post_intervention"
  | "diagnostic_challenge";

export type EcgSimulationHook = {
  scenarioType: EcgSimulationScenarioType;
  title: string;
  clinicalContext: string;
  patientPresentation: string;
  keyDecisionPoint: string;
  learnerObjective: string;
};

export type EcgClinicalReasoningUnit = {
  rhythmKey: string;
  rhythmName: string;
  recognition: {
    rate: string;
    regularity: string;
    pWaves: string;
    prInterval: string;
    qrsWidth: string;
    stSegment?: string;
    keyFeatures: readonly string[];
    pearls: readonly string[];
  };
  mechanism: string;
  conductionPath: string;
  whyStripLooksThisWay: string;
  hemodynamicImpact: EcgHemodynamicImpact;
  clinicalPresentation: EcgClinicalPresentation;
  escalation: EcgEscalationCriteria;
  examTraps: EcgExamTraps;
  professionViews: EcgProfessionViews;
  compareContrast: readonly EcgCompareContrast[];
  simulationHooks: readonly EcgSimulationHook[];
};

// ─── Rhythm content ───────────────────────────────────────────────────────────

const UNITS: EcgClinicalReasoningUnit[] = [

  // ── Normal Sinus Rhythm ──────────────────────────────────────────────────────
  {
    rhythmKey: "normal_sinus_rhythm",
    rhythmName: "Normal Sinus Rhythm",
    recognition: {
      rate: "60–100 BPM",
      regularity: "Regular (R-R intervals vary ≤ 0.06s)",
      pWaves: "Upright, uniform; one P before every QRS",
      prInterval: "0.12–0.20s; constant throughout",
      qrsWidth: "< 0.12s (narrow)",
      stSegment: "Isoelectric; T-waves upright in most leads",
      keyFeatures: [
        "Upright P before every QRS",
        "Constant PR interval",
        "Narrow QRS",
        "Rate 60–100 BPM",
        "Regular rhythm",
      ],
      pearls: [
        "NSR is the baseline against which every other rhythm is compared",
        "Minor R-R variation is normal — the AV node naturally modulates",
        "A 'perfect' flat regular NSR trace at exactly 60 BPM is more likely a pacemaker than genuine NSR",
      ],
    },
    mechanism:
      "The sinoatrial (SA) node in the right atrial wall spontaneously depolarises at its intrinsic rate of 60–100 BPM. This impulse propagates through both atria (producing the P-wave), is delayed at the AV node (PR interval), and then travels rapidly through the His bundle, bundle branches, and Purkinje fibres to simultaneously activate the ventricles (narrow QRS).",
    conductionPath:
      "SA node → internodal pathways → AV node (delay) → Bundle of His → left and right bundle branches → Purkinje fibres → ventricular myocardium",
    whyStripLooksThisWay:
      "The regular upright P-wave reflects organised left-to-right atrial depolarisation from the SA node. The fixed PR interval reflects the predictable AV nodal delay. The narrow QRS reflects synchronous ventricular activation via the intact His-Purkinje system. Isoelectric ST indicates uniform repolarisation.",
    hemodynamicImpact: {
      cardiacOutput: "normal",
      cardiacOutputRationale:
        "Normal rate with preserved AV synchrony delivers optimal cardiac output; atrial kick contributes 15–25% of ventricular filling.",
      bloodPressureEffect: "normal",
      perfusionStatus: "Full systemic and cerebral perfusion maintained.",
      expectedSymptoms: ["Asymptomatic — normal physiologic state"],
      hemodynamicallyStagable: false,
    },
    clinicalPresentation: {
      stable: ["Asymptomatic", "Normal vital signs", "Alert and oriented"],
      unstable: ["NSR itself does not cause instability — look for the underlying condition"],
      redFlags: ["Any symptom change in a patient IN NSR requires assessment of the underlying cause, not the rhythm"],
      emergencyTriggers: [],
    },
    escalation: {
      defaultLevel: "monitor",
      monitoringFrequency: "Routine per unit standard",
      immediateAssessments: ["Confirm clinical correlation with patient status"],
      notifyProviderWhen: ["Patient reports new symptoms despite NSR on monitor"],
      rapidResponseWhen: [],
      codeBlueWhen: [],
      interventionContraindications: ["Do not initiate antiarrhythmic therapy for NSR"],
    },
    examTraps: {
      nclex: [
        "NSR does NOT need intervention — the most common trap is selecting 'notify physician' when the question shows NSR with no clinical change",
        "A rate of 59 BPM with sinus P-waves is sinus bradycardia, not NSR",
        "NSR in a symptomatic patient means the symptoms are NOT from the rhythm — assess for another cause",
      ],
      telemetry: [
        "Slight R-R variability in NSR is normal — do not call it irregular AF",
        "In younger patients, rate variation with breathing (RSA) is normal NSR, not a pathologic arrhythmia",
      ],
    },
    professionViews: {
      rn: {
        focus: "Confirm clinical correlation — NSR on the monitor does not mean the patient is well.",
        priorities: ["Assess patient at the bedside", "Correlate rhythm with clinical status", "Routine monitoring"],
        keyActions: ["Document rhythm every shift", "Correlate vital signs with rhythm", "Note any deviation from patient's baseline"],
        examFocus: "NCLEX will not ask you to intervene for NSR — the answer is always observation/monitoring unless a symptom change is described.",
      },
      rpn: {
        focus: "Confirm that what looks like NSR truly matches the patient's expected rhythm and presentation.",
        priorities: ["Baseline rhythm documentation", "Recognise normal vs patient's personal baseline"],
        keyActions: ["Document rhythm per unit protocol", "Report any change from baseline to RN"],
        examFocus: "REx-PN: NSR requires monitoring, not intervention.",
      },
      np: {
        focus: "NSR in the context of a symptomatic patient demands workup of the underlying condition, not rhythm management.",
        priorities: ["Evaluate why the patient is symptomatic if NSR is documented", "Review trend over time"],
        keyActions: ["If NSR during symptoms — broaden differential (pulmonary, metabolic, structural)", "Review medication list for rate-altering agents"],
        examFocus: "NP board: interpreting NSR alongside abnormal biomarkers or symptoms is a frequent clinical reasoning item.",
      },
      rt: {
        focus: "NSR correlates with adequate cardiac output and oxygenation delivery — use as a respiratory baseline.",
        priorities: ["Confirm SpO2 and respiratory rate are consistent with NSR (no compensatory tachycardia)"],
        keyActions: ["Note sinus tachycardia as a warning of hypoxia before SpO2 drops"],
      },
      newGrad: {
        focus: "NSR is your normal — learn it well so everything else stands out.",
        priorities: ["Memorise the 5 features: rate 60-100, regular, upright P, normal PR, narrow QRS"],
        keyActions: ["Look at NSR strips daily until recognition is automatic", "Ask: does this patient LOOK like they are in NSR?"],
        examFocus: "If the answer choices include 'notify physician' and the rhythm is NSR with no symptom change — do NOT select that answer.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "sinus_bradycardia",
        compareWithName: "Sinus Bradycardia",
        keyDifferences: [
          { feature: "Rate", thisRhythm: "60–100 BPM", otherRhythm: "< 60 BPM" },
          { feature: "Intervention", thisRhythm: "None", otherRhythm: "Only if symptomatic" },
          { feature: "P-wave morphology", thisRhythm: "Identical", otherRhythm: "Identical — same SA node origin" },
        ],
        clinicalImplication: "Same conduction pathway, different rate. Treatment decision is entirely symptom-driven, not rate-driven alone.",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "stable_monitoring",
        title: "NSR in Post-Op Patient With New Diaphoresis",
        clinicalContext: "Day 1 post-op cholecystectomy, monitor shows NSR at 78 BPM.",
        patientPresentation: "Patient reports new diaphoresis and mild epigastric discomfort.",
        keyDecisionPoint: "The rhythm is NSR — so the symptoms are NOT from the rhythm. What do you assess next?",
        learnerObjective: "Recognise that NSR does not explain symptoms and initiates a non-rhythm workup (troponin, BP, O2 sat).",
      },
    ],
  },

  // ── Sinus Bradycardia ────────────────────────────────────────────────────────
  {
    rhythmKey: "sinus_bradycardia",
    rhythmName: "Sinus Bradycardia",
    recognition: {
      rate: "< 60 BPM",
      regularity: "Regular",
      pWaves: "Upright, uniform; one P before every QRS — identical to NSR",
      prInterval: "0.12–0.20s; normal",
      qrsWidth: "< 0.12s (narrow)",
      keyFeatures: ["All NSR features present", "Rate < 60 BPM", "Identical morphology to NSR"],
      pearls: [
        "Morphology is identical to NSR — only the rate distinguishes them",
        "Rate < 40 BPM is often poorly tolerated and requires immediate assessment",
        "Athletes may have physiologic resting HR in the 40s — always assess symptoms",
      ],
    },
    mechanism:
      "The SA node is firing at a rate below 60 BPM. Causes include: high vagal tone (athletes, sleep, vasovagal), medications (beta-blockers, calcium channel blockers, digoxin, opioids), hypothyroidism, hypothermia, inferior MI (right coronary artery supplies the SA node in 60% of patients), sick sinus syndrome, or electrolyte abnormalities.",
    conductionPath:
      "SA node (slow) → atria → AV node → Bundle of His → bundle branches → ventricles. Conduction pathway is intact; only the rate of SA node firing is reduced.",
    whyStripLooksThisWay:
      "P-QRS-T morphology is identical to NSR because the conduction system is normal — only the SA node firing frequency is reduced. Wide R-R intervals (long pauses between beats) are the only visual difference from NSR.",
    hemodynamicImpact: {
      cardiacOutput: "mildly_reduced",
      cardiacOutputRationale:
        "CO = HR × SV. At lower heart rates, stroke volume partially compensates via Starling's law, but below ~40 BPM, compensation fails and CO falls significantly.",
      bloodPressureEffect: "variable",
      perfusionStatus:
        "Often adequate at rates 40–59 BPM if compensated. Below 40 BPM or with co-existing heart disease, cerebral and coronary perfusion may be compromised.",
      expectedSymptoms: [
        "Asymptomatic (athletes, sleep, medications — most common)",
        "Fatigue, dyspnoea on exertion",
        "Dizziness, lightheadedness",
        "Near-syncope or syncope",
        "Chest pain or pressure (if cardiac ischaemia)",
        "Presyncope, syncope (severe)",
      ],
      hemodynamicallyStagable: true,
    },
    clinicalPresentation: {
      stable: [
        "Asymptomatic, BP maintained, alert, tolerating rate well",
        "Rate 40–59 with maintained perfusion",
        "Common in athletes, sleeping patients, patients on beta-blockers",
      ],
      unstable: [
        "Hypotension (SBP < 90 mmHg)",
        "Altered level of consciousness",
        "Chest pain or acute pulmonary oedema",
        "Signs of poor perfusion: cool clammy skin, mottling",
      ],
      redFlags: [
        "Rate < 40 BPM",
        "New onset bradycardia (not chronic)",
        "Bradycardia with chest pain (inferior MI until proven otherwise)",
        "Rate < 60 with hypotension",
      ],
      emergencyTriggers: [
        "Haemodynamic instability with bradycardia",
        "Bradycardia with altered consciousness",
        "Rate < 30 BPM",
      ],
    },
    escalation: {
      defaultLevel: "varies_by_stability",
      monitoringFrequency: "Continuous if rate < 50 or symptomatic; routine if asymptomatic and rate 50–59",
      immediateAssessments: [
        "Assess symptoms: dizziness, chest pain, dyspnoea, near-syncope",
        "Check BP and LOC",
        "12-lead ECG — rule out inferior MI",
        "Review medication list (beta-blockers, CCBs, digoxin, opioids)",
        "Check SpO2, glucose, temperature (hypothyroidism, hypothermia)",
      ],
      notifyProviderWhen: [
        "Rate < 50 BPM in non-athlete",
        "Any symptoms associated with bradycardia",
        "New onset bradycardia not explained by medications",
        "Rate < 60 with hypotension",
      ],
      rapidResponseWhen: [
        "Symptomatic bradycardia with haemodynamic compromise",
        "Rate < 40 with any symptoms",
        "Sudden drop in rate with altered mentation",
      ],
      codeBlueWhen: [
        "Pulseless bradycardia progressing to cardiac arrest",
        "Bradycardia → asystole",
      ],
      interventionContraindications: [
        "Do NOT treat asymptomatic bradycardia — rate alone is not a treatment indication",
        "Do NOT give atropine to a patient with a heart transplant (denervated heart — atropine is ineffective and can paradoxically worsen block)",
        "Atropine is less effective in infranodal blocks (Mobitz II, 3rd degree) — pacing is preferred",
      ],
    },
    examTraps: {
      nclex: [
        "The priority action is NOT atropine — it is ASSESSING THE PATIENT for symptoms first",
        "Asymptomatic sinus bradycardia does NOT require treatment — choosing 'administer atropine' for a rate of 52 BPM with no symptoms is WRONG",
        "A rate of 55 BPM in a marathon runner during sleep is NORMAL — do not treat",
      ],
      interventionTraps: [
        "Atropine 0.5mg IV is first-line for SYMPTOMATIC bradycardia — but only if the patient IS symptomatic",
        "Transcutaneous pacing is used if atropine fails or is contraindicated",
        "Do not give calcium channel blockers or beta-blockers to treat bradycardia",
      ],
      telemetry: [
        "Rate of 58 BPM is sinus bradycardia, not NSR — verify but assess for symptoms before acting",
        "Do not confuse the long R-R intervals of sinus bradycardia with a pause or AV block — check that P-waves are present and conducting",
      ],
    },
    professionViews: {
      rn: {
        focus: "Assess symptoms first — rate alone does not determine intervention.",
        priorities: ["Immediate bedside assessment for symptoms", "BP check", "Review medication list", "12-lead ECG if new onset"],
        keyActions: [
          "Assess: dizziness, chest pain, dyspnoea, syncope",
          "Obtain BP and SpO2",
          "Notify provider if symptomatic or rate < 50 in non-athlete",
          "Prepare atropine 0.5mg IV if ordered for symptomatic bradycardia",
        ],
        examFocus: "NCLEX priority is assessment before intervention — always assess symptoms before giving atropine.",
      },
      rpn: {
        focus: "Recognise sinus bradycardia, identify symptoms, and escalate to RN immediately if symptomatic.",
        priorities: ["Identify rate < 60", "Assess for symptoms", "Escalate to RN if rate < 50 or any symptoms present"],
        keyActions: ["Check patient at bedside", "Report findings to RN", "Do not administer medications independently for bradycardia"],
      },
      np: {
        focus: "Identify the underlying cause and treat it — bradycardia is almost always secondary.",
        priorities: [
          "Exclude inferior MI (12-lead, troponin)",
          "Review medications causing bradycardia",
          "Assess for thyroid disease, hypothermia",
          "Determine if pacing is needed (symptomatic, rate < 40, or failing atropine)",
        ],
        keyActions: [
          "Order 12-lead ECG, troponin, TSH",
          "Consider holding/reversing offending medications",
          "Initiate atropine protocol for symptomatic bradycardia",
          "Arrange transcutaneous pacing if atropine fails",
        ],
        examFocus: "NP boards: distinguish symptomatic from asymptomatic bradycardia and know the ACLS algorithm for unstable bradycardia.",
      },
      rt: {
        focus: "Bradycardia in a ventilated patient may indicate vagal stimulation from suctioning, hypoxia, or increased intrathoracic pressure.",
        priorities: ["SpO2 monitoring", "Note if bradycardia correlates with ventilator changes or suctioning"],
        keyActions: ["Assess oxygenation during bradycardia", "Notify team if bradycardia follows respiratory intervention"],
      },
      newGrad: {
        focus: "Look at your patient, not just the number. A rate of 50 BPM in a sleeping athlete is fine. The same rate in a diaphoretic post-op patient is an emergency.",
        priorities: ["Go to the bedside", "Ask about dizziness, chest pain, shortness of breath", "Check BP"],
        keyActions: ["If the patient feels fine and BP is normal — document and notify the charge nurse", "If the patient is dizzy or hypotensive — escalate immediately"],
        examFocus: "The question will give you a rate and a patient description. The rate alone never determines the answer — always read for symptoms.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "normal_sinus_rhythm",
        compareWithName: "Normal Sinus Rhythm",
        keyDifferences: [
          { feature: "Rate", thisRhythm: "< 60 BPM", otherRhythm: "60–100 BPM" },
          { feature: "P-wave morphology", thisRhythm: "Identical — same SA node", otherRhythm: "Identical" },
          { feature: "PR interval", thisRhythm: "Normal", otherRhythm: "Normal" },
          { feature: "Intervention needed", thisRhythm: "Only if symptomatic", otherRhythm: "None" },
        ],
        clinicalImplication: "Morphology is identical — the only difference is rate. Never treat the number; treat the patient.",
      },
      {
        compareWithRhythmKey: "third_degree_av_block",
        compareWithName: "Third-Degree AV Block",
        keyDifferences: [
          { feature: "Rate", thisRhythm: "40–59 BPM", otherRhythm: "20–40 BPM (escape)" },
          { feature: "P-wave to QRS relationship", thisRhythm: "Every P conducts — fixed PR", otherRhythm: "P-waves and QRS march independently" },
          { feature: "QRS width", thisRhythm: "Narrow", otherRhythm: "Wide (ventricular escape)" },
          { feature: "Urgency", thisRhythm: "Treat if symptomatic", otherRhythm: "Always requires pacing" },
        ],
        clinicalImplication: "Both are slow, but 3rd degree AV block is always pathological and almost always requires pacing regardless of symptoms.",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "medication_effect",
        title: "Post-Op Day 1 Bradycardia: Medications vs Ischaemia",
        clinicalContext: "Rate drops to 48 BPM on telemetry, 6h after cardiac catheterisation. Patient is on metoprolol and diltiazem.",
        patientPresentation: "Patient is mildly dizzy when standing. BP 102/68. SpO2 96%. ECG shows sinus bradycardia.",
        keyDecisionPoint: "Is this medication effect, reperfusion response, or inferior MI? What do you do first?",
        learnerObjective: "Initiate 12-lead ECG, obtain troponin, review medication timing, and notify provider — distinguishing iatrogenic bradycardia from ischaemic cause.",
      },
    ],
  },

  // ── Sinus Tachycardia ────────────────────────────────────────────────────────
  {
    rhythmKey: "sinus_tachycardia",
    rhythmName: "Sinus Tachycardia",
    recognition: {
      rate: "101–160 BPM (may reach 220 in extremes)",
      regularity: "Regular",
      pWaves: "Upright, uniform — may merge with preceding T-wave at high rates",
      prInterval: "Normal (may shorten slightly at high rates)",
      qrsWidth: "< 0.12s",
      keyFeatures: [
        "All NSR criteria met",
        "Rate > 100 BPM",
        "P-wave may be buried in T-wave at rates > 150",
        "Gradual onset and offset (not abrupt)",
      ],
      pearls: [
        "Sinus tachycardia is ALWAYS a response — there is always a cause; find it",
        "It does NOT convert with adenosine (important contrast to SVT)",
        "Gradual onset/offset distinguishes it from paroxysmal SVT",
        "At rates > 150, P-waves may be hidden — this is where sinus tachy mimics SVT",
      ],
    },
    mechanism:
      "The SA node is firing faster than 100 BPM in response to a physiologic demand signal. The most common triggers are: pain, anxiety, fever, hypovolaemia, anaemia, hypoxia, pulmonary embolism, sepsis, hyperthyroidism, sympathomimetic drugs (epinephrine, cocaine, salbutamol), or heart failure with compensatory tachycardia. The conduction pathway is entirely normal — only the firing rate is elevated.",
    conductionPath:
      "SA node (accelerated) → normal atrial conduction → AV node → His-Purkinje → ventricles. Identical to NSR, faster.",
    whyStripLooksThisWay:
      "P-QRS-T morphology is identical to NSR because conduction is normal — only rate increases. At very high rates (> 140–150 BPM), the P-wave merges into or rides on top of the preceding T-wave, making it appear absent. This is the most common point of confusion with SVT.",
    hemodynamicImpact: {
      cardiacOutput: "variable",
      cardiacOutputRationale:
        "Tachycardia initially increases CO (HR × SV). However, at rates > 140–150 BPM, diastolic filling time is severely shortened, SV falls, and CO may paradoxically decrease. In patients with heart disease, any rate > 100 may worsen ischaemia.",
      bloodPressureEffect: "variable",
      perfusionStatus:
        "Dependent on the underlying cause. Septic shock causes tachycardia with poor perfusion. Pain causes tachycardia with maintained perfusion. Haemorrhage causes tachycardia with progressively worsening perfusion.",
      expectedSymptoms: [
        "Palpitations (awareness of fast heartbeat)",
        "Anxiety",
        "Dyspnoea (if hypoxia is the cause)",
        "Chest pain (if demand ischaemia or PE is the cause)",
        "Dizziness (if rate is very fast with poor filling)",
      ],
      hemodynamicallyStagable: true,
    },
    clinicalPresentation: {
      stable: [
        "Patient is aware of fast HR but haemodynamically maintained",
        "BP normal or mildly elevated",
        "Identifiable benign cause (pain, anxiety, fever)",
      ],
      unstable: [
        "Tachycardia is the compensatory mechanism for the instability — the underlying cause is the emergency",
        "Hypotension + tachycardia = haemorrhage, sepsis, or PE until proven otherwise",
      ],
      redFlags: [
        "Tachycardia with hypotension (shock state)",
        "Tachycardia with hypoxia (PE, pneumothorax, heart failure)",
        "Rate > 150 BPM with chest pain (demand ischaemia)",
        "New-onset tachycardia post-operatively (PE, bleeding, sepsis)",
      ],
      emergencyTriggers: [
        "Tachycardia + SBP < 90 mmHg",
        "Tachycardia + SpO2 < 88% not responding to oxygen",
        "Tachycardia + altered consciousness",
      ],
    },
    escalation: {
      defaultLevel: "varies_by_stability",
      monitoringFrequency: "Continuous; reassess every 15–30 minutes until cause is identified",
      immediateAssessments: [
        "Identify and treat the cause — NOT the rhythm",
        "Assess vital signs: BP, SpO2, temperature, respiratory rate",
        "Pain assessment",
        "Fluid status (urine output, mucous membranes, skin turgor)",
        "Check recent labs: CBC, troponin, D-dimer if PE suspected",
      ],
      notifyProviderWhen: [
        "Rate > 130 BPM without identifiable benign cause",
        "Tachycardia not resolving after treating presumed cause",
        "Rate > 100 BPM with hypotension",
        "New post-operative tachycardia",
      ],
      rapidResponseWhen: [
        "Tachycardia with haemodynamic compromise",
        "Tachycardia with altered consciousness",
        "Suspected PE with tachycardia and hypoxia",
      ],
      codeBlueWhen: ["Cardiac arrest develops"],
      interventionContraindications: [
        "Do NOT cardiovert sinus tachycardia — it is not a shockable rhythm",
        "Do NOT administer adenosine for sinus tachycardia — it will cause a brief block but the rate will resume immediately",
        "Do NOT suppress the tachycardia with beta-blockers if the cause is haemorrhage — this masks the compensatory response",
      ],
    },
    examTraps: {
      nclex: [
        "NEVER cardiovert sinus tachycardia — this is the most dangerous intervention trap",
        "Sinus tachycardia should NEVER be treated with adenosine — adenosine is for SVT",
        "The correct priority action is identifying the CAUSE, not treating the heart rate",
        "A post-op patient with HR 118 BPM — first priority is assessment, not medication",
      ],
      interventionTraps: [
        "Beta-blockers for sinus tachycardia can be harmful if the tachycardia is compensatory (haemorrhage, sepsis)",
        "Do not confuse with SVT at rates > 150 — check for gradual onset and identifiable cause",
      ],
      telemetry: [
        "At rates > 150 BPM, P-waves may appear absent — this mimics SVT; look for gradual onset and treat-the-cause approach",
      ],
    },
    professionViews: {
      rn: {
        focus: "Sinus tachycardia always has a cause — find it and treat it.",
        priorities: ["Identify the cause", "Assess haemodynamic status", "Relieve pain, fever, hypoxia, anxiety if present"],
        keyActions: [
          "Full head-to-toe assessment: pain, bleeding, breathing, temperature",
          "Check VS trend: is the rate rising or falling?",
          "IV access and fluids if hypovolaemia suspected",
          "Never cardiovert — document and escalate if cause unclear",
        ],
        examFocus: "NCLEX will ask you to identify the priority action — it is ALWAYS to assess the cause, not treat the rate.",
      },
      rpn: {
        focus: "Recognise, assess, and escalate — do not attempt to treat the rate independently.",
        priorities: ["Recognise rate > 100", "Assess for pain, fever, dyspnoea", "Escalate to RN"],
        keyActions: ["Notify RN of new onset tachycardia", "Obtain vital signs", "Assist with assessment"],
      },
      np: {
        focus: "Systematic workup of the underlying cause — sinus tachycardia is a symptom, not a diagnosis.",
        priorities: [
          "Rapid clinical assessment: haemodynamics, oxygenation, temperature, fluid status",
          "Targeted diagnostics: CBC (anaemia), troponin, D-dimer (PE), blood cultures (sepsis)",
          "Treat the cause: fluids, analgesia, antipyretics, supplemental O2",
        ],
        keyActions: [
          "Order 12-lead ECG to confirm sinus mechanism vs SVT",
          "Consider PE if post-operative or immobilised patient with tachycardia + hypoxia",
          "Initiate sepsis bundle if fever + tachycardia + hypotension",
        ],
        examFocus: "NP boards: distinguish sinus tachycardia from SVT, and name the correct workup steps for common causes.",
      },
      rt: {
        focus: "Tachycardia is frequently a respiratory compensation — SpO2, PaO2, and work of breathing are your first assessments.",
        priorities: ["Assess respiratory status immediately if tachycardia develops", "Check for hypoxia as the cause"],
        keyActions: ["Optimise oxygen delivery", "Notify team if tachycardia correlates with ventilatory changes"],
      },
      newGrad: {
        focus: "Your job is to find out WHY the heart rate is fast — the monitor answer is never 'sinus tachycardia needs treatment'.",
        priorities: ["Go to the bedside immediately", "Ask: pain? anxiety? fever? bleeding?", "Get vital signs including temperature"],
        keyActions: ["Do a quick head-to-toe look: are they pale? diaphoretic? in pain?", "Call your charge nurse if you cannot find a cause"],
        examFocus: "The exam will tell you the patient has a HR of 118 — they want to know if you know to ASSESS first, not medicate.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "svt",
        compareWithName: "SVT",
        keyDifferences: [
          { feature: "Onset", thisRhythm: "Gradual", otherRhythm: "Abrupt (paroxysmal)" },
          { feature: "Rate", thisRhythm: "100–160 BPM", otherRhythm: "150–220 BPM" },
          { feature: "P-waves", thisRhythm: "Present (may merge at high rates)", otherRhythm: "Absent or retrograde" },
          { feature: "Response to adenosine", thisRhythm: "Transient slowing only — resumes", otherRhythm: "Converts to sinus rhythm" },
          { feature: "Has underlying cause", thisRhythm: "Always", otherRhythm: "Usually paroxysmal without obvious cause" },
        ],
        clinicalImplication: "Do not cardiovert or give adenosine for sinus tachycardia. If uncertain and rate > 150 with no obvious cause, treat as SVT and reassess.",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "diagnostic_challenge",
        title: "Post-Op Tachycardia: Pain, PE, or Haemorrhage?",
        clinicalContext: "Day 2 post-op hemicolectomy. HR rises from 88 to 118 BPM over 4 hours.",
        patientPresentation: "Patient reports increasing abdominal pain, HR 118, RR 22, BP 105/70, SpO2 94% on 2L NC.",
        keyDecisionPoint: "Multiple causes are possible simultaneously — how do you prioritise your assessment?",
        learnerObjective: "Initiate simultaneous workup: pain assessment, wound check (bleeding), SpO2/respiratory assessment (PE), temperature (sepsis).",
      },
    ],
  },

  // ── PAC ──────────────────────────────────────────────────────────────────────
  {
    rhythmKey: "pacs",
    rhythmName: "PAC — Premature Atrial Contractions",
    recognition: {
      rate: "Underlying rate 60–120 BPM; PAC beats arrive early",
      regularity: "Irregular — underlying rhythm interrupted by premature beats",
      pWaves: "Normal P for sinus beats; INVERTED or clearly different P for PAC beats",
      prInterval: "Variable — PAC PR may be shorter or longer than sinus PR",
      qrsWidth: "Narrow (< 0.12s) on both sinus and PAC beats; PAC conducts normally through the ventricles",
      keyFeatures: [
        "Premature beat arrives early (before next expected sinus beat)",
        "P-wave before the premature QRS is morphologically DIFFERENT from sinus P",
        "QRS is narrow on the premature beat",
        "Non-compensatory pause follows (less than 2 × R-R interval)",
      ],
      pearls: [
        "The KEY differentiator from PVCs: PACs have a narrow QRS; PVCs have a wide bizarre QRS",
        "Non-compensatory pause: the SA node is reset by the PAC, so the next sinus beat comes earlier than expected",
        "Frequent PACs can trigger AFib in susceptible patients",
        "If PAC is very early (falls on T-wave), conduction may be aberrant → wide QRS, mimicking PVC",
      ],
    },
    mechanism:
      "An ectopic focus in the atrial muscle depolarises before the SA node fires. This depolarisation travels through the atria (producing an abnormal-morphology P-wave that may be inverted, biphasic, or small, depending on the ectopic focus location) and then conducts normally through the AV node and His-Purkinje system, producing a narrow QRS identical to sinus beats. The early depolarisation also resets the SA node, causing a non-compensatory pause.",
    conductionPath:
      "Ectopic atrial focus → aberrant atrial conduction path (abnormal P-wave) → AV node → His-Purkinje (normal) → ventricles (normal, narrow QRS)",
    whyStripLooksThisWay:
      "Sinus beats are normal. On the PAC beat, the P-wave appears with different morphology (inverted or small/biphasic) because atrial depolarisation travels from an abnormal direction. The QRS is narrow because ventricular conduction is unaffected. A shorter-than-normal pause follows because the SA node is reset earlier.",
    hemodynamicImpact: {
      cardiacOutput: "normal",
      cardiacOutputRationale:
        "Isolated PACs have minimal haemodynamic effect. The early beat may have slightly reduced SV due to shortened diastolic filling time, but overall CO is maintained.",
      bloodPressureEffect: "normal",
      perfusionStatus: "Normal perfusion maintained.",
      expectedSymptoms: [
        "Usually asymptomatic",
        "Palpitations — sensation of a 'skipped beat' or 'flip-flop' in the chest",
        "Brief pause awareness",
      ],
      hemodynamicallyStagable: false,
    },
    clinicalPresentation: {
      stable: [
        "Asymptomatic — incidental finding on telemetry",
        "Palpitations — benign, not haemodynamically significant",
      ],
      unstable: ["PACs themselves do not cause instability"],
      redFlags: [
        "Increasing frequency of PACs (may progress to AFib)",
        "PACs in a patient with known AFib history (may trigger AFib recurrence)",
        "PAC very close to T-wave (may trigger AFib)",
      ],
      emergencyTriggers: [],
    },
    escalation: {
      defaultLevel: "monitor",
      monitoringFrequency: "Routine; document frequency if increasing",
      immediateAssessments: [
        "Assess for symptoms (palpitations, dizziness)",
        "Review electrolytes: hypomagnesaemia and hypokalaemia increase PAC frequency",
        "Review stimulant intake: caffeine, decongestants",
        "Check for triggers: fatigue, stress, alcohol",
      ],
      notifyProviderWhen: [
        "Increasing PAC frequency (> 6/min or runs of PACs)",
        "PACs triggering runs of SVT or initiating AFib",
        "Symptomatic PACs affecting quality of life",
      ],
      rapidResponseWhen: [],
      codeBlueWhen: [],
      interventionContraindications: [
        "Do NOT treat isolated asymptomatic PACs with antiarrhythmics",
        "Avoid using amiodarone or antiarrhythmic agents for benign PACs",
      ],
    },
    examTraps: {
      nclex: [
        "PACs do NOT require intervention unless they are symptomatic or triggering sustained tachyarrhythmia",
        "The differentiating feature from PVCs is QRS width — PAC = narrow; PVC = wide",
        "The non-compensatory pause after a PAC is shorter than the compensatory pause after a PVC",
        "PACs always have a P-wave before the premature beat — PVCs do NOT",
      ],
      telemetry: [
        "A narrow premature beat with a different P-wave is a PAC, not a PVC",
        "If the P-wave before the premature beat looks identical to sinus P-waves, it may be a sinus beat arriving slightly early (e.g., due to RSA) — compare morphology carefully",
      ],
    },
    professionViews: {
      rn: {
        focus: "Identify PACs, confirm they are benign and isolated, check electrolytes.",
        priorities: ["Distinguish PACs from PVCs (narrow vs wide QRS)", "Assess frequency and symptoms", "Check electrolytes"],
        keyActions: [
          "Confirm QRS is narrow on the premature beat",
          "Count frequency: isolated vs frequent vs runs",
          "Check Mg²⁺ and K⁺ levels",
          "Document and notify provider if frequency increasing",
        ],
        examFocus: "NCLEX: PACs = narrow QRS, different P-wave. PVCs = wide QRS, no P-wave. Know this distinction.",
      },
      rpn: {
        focus: "Recognise as PAC (narrow premature beat), document, report if frequent or symptomatic.",
        priorities: ["Confirm narrow QRS", "Assess patient for symptoms"],
        keyActions: ["Report to RN if PAC frequency increasing or patient is symptomatic"],
      },
      np: {
        focus: "Evaluate PAC burden, identify triggers, and determine if treatment (electrolyte correction, beta-blocker) is warranted.",
        priorities: [
          "Holter monitor if palpitations are frequent or bothersome",
          "Echocardiogram if frequent PACs (> 10,000/day) as structural heart disease is a risk factor",
          "Correct hypomagnesaemia and hypokalaemia",
        ],
        keyActions: [
          "Address reversible triggers: caffeine, stress, sleep deprivation, alcohol",
          "Low-dose beta-blocker if symptomatic and affecting quality of life",
          "Rule out AFib if PAC triggers runs of irregular tachycardia",
        ],
        examFocus: "NP boards: PAC management is conservative; know when to order Holter and when to treat.",
      },
      rt: {
        focus: "PACs in a ventilated patient may correlate with hypoxia or excessive positive pressure — note timing.",
        priorities: ["If PAC frequency increases, check oxygenation and ventilator settings"],
        keyActions: ["Notify team if PACs increase during suctioning or ventilator changes"],
      },
      newGrad: {
        focus: "PAC = premature narrow beat with a funny-looking P-wave. Not dangerous on its own — document and observe.",
        priorities: ["Confirm: is the premature QRS narrow?", "Is there a P-wave before it that looks different?"],
        keyActions: ["If yes → PAC → document and report frequency to charge nurse", "If the premature beat is wide → think PVC, escalate more quickly"],
        examFocus: "The exam key: narrow premature = atrial (PAC). Wide premature = ventricular (PVC).",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "pvcs",
        compareWithName: "PVC — Premature Ventricular Contractions",
        keyDifferences: [
          { feature: "QRS width", thisRhythm: "NARROW (< 0.12s)", otherRhythm: "WIDE and bizarre (> 0.12s)" },
          { feature: "P-wave before premature beat", thisRhythm: "Present but different morphology", otherRhythm: "Absent" },
          { feature: "T-wave on premature beat", thisRhythm: "Same direction as QRS", otherRhythm: "OPPOSITE direction to QRS (discordant)" },
          { feature: "Pause after premature beat", thisRhythm: "Non-compensatory (SA node reset)", otherRhythm: "Compensatory (SA node NOT reset)" },
          { feature: "Clinical urgency", thisRhythm: "Generally benign", otherRhythm: "Requires more urgent assessment" },
        ],
        clinicalImplication: "QRS width is the single most important distinguisher. Narrow = atrial origin (PAC). Wide = ventricular origin (PVC). This determines the level of concern and the response.",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "diagnostic_challenge",
        title: "Palpitations on Post-Cardiac Surgery Telemetry",
        clinicalContext: "Day 2 post-CABG. Telemetry shows irregular rhythm with premature beats every 4–5 cycles.",
        patientPresentation: "Patient reports fluttering sensations in chest. HR 80 BPM average. BP 122/78. Mg 0.6 mmol/L.",
        keyDecisionPoint: "Narrow premature beats with different P-waves — PAC or PVC? What is the priority intervention?",
        learnerObjective: "Identify PACs by narrow QRS, prioritise electrolyte correction (Mg²⁺ replacement), and monitor for progression to AFib.",
      },
    ],
  },

  // ── PVC ──────────────────────────────────────────────────────────────────────
  {
    rhythmKey: "pvcs",
    rhythmName: "PVC — Premature Ventricular Contractions",
    recognition: {
      rate: "Underlying rate 60–120 BPM; PVC beats are premature",
      regularity: "Irregular — underlying rhythm interrupted by wide bizarre premature beats",
      pWaves: "Normal P on sinus beats; NO P-wave before the PVC beat",
      prInterval: "Normal on sinus beats; NONE on PVC",
      qrsWidth: "> 0.12s on PVC beats; normal on sinus beats",
      keyFeatures: [
        "Wide bizarre QRS (> 0.12s) on the premature beat",
        "NO preceding P-wave on the PVC",
        "T-wave opposite polarity to the QRS (discordant T-wave)",
        "Full compensatory pause follows",
        "Sinus beats surrounding the PVC are normal and narrow",
      ],
      pearls: [
        "Compensatory pause: SA node is NOT reset; next sinus beat comes at the expected time after the PVC",
        "Bigeminy = every other beat is a PVC; trigeminy = every 3rd beat",
        "Couplets = 2 consecutive PVCs; a run of ≥ 3 = ventricular tachycardia",
        "R-on-T PVC (PVC falls on the T-wave of previous beat) can trigger VF",
        "In the setting of MI, PVCs are significantly more dangerous",
      ],
    },
    mechanism:
      "An ectopic focus in the ventricular myocardium or Purkinje system fires prematurely, before the SA node's next impulse. Because depolarisation starts in the ventricle rather than the His-Purkinje system, it travels abnormally through the myocardium (cell-to-cell), producing a wide, bizarre-looking QRS. Repolarisation is also abnormal, causing the T-wave to deflect in the opposite direction. The SA node continues firing at its intrinsic rate, unaffected by the PVC, so the next sinus beat comes right on schedule after the compensatory pause.",
    conductionPath:
      "Ectopic ventricular focus → abnormal cell-to-cell ventricular myocardial conduction (bypasses His-Purkinje) → wide bizarre QRS. SA node simultaneously continues firing — next sinus beat arrives at expected interval (compensatory pause).",
    whyStripLooksThisWay:
      "The wide bizarre QRS reflects abnormal ventricular conduction. The discordant T-wave reflects abnormal repolarisation sequence. The absence of a P-wave reflects the fact that no atrial activity preceded this ventricular beat. The compensatory pause reflects the SA node continuing its cycle undisturbed — unlike PACs which reset the SA node.",
    hemodynamicImpact: {
      cardiacOutput: "mildly_reduced",
      cardiacOutputRationale:
        "Isolated PVCs have minimal haemodynamic effect in healthy hearts. However, frequent PVCs (> 10,000/day or > 10% of beats) can reduce CO by reducing effective ventricular filling and synchrony. In patients with impaired LV function, PVC burden worsens haemodynamics.",
      bloodPressureEffect: "normal",
      perfusionStatus: "Maintained with isolated PVCs; may be impaired with very frequent PVCs or in setting of structural heart disease.",
      expectedSymptoms: [
        "Often asymptomatic",
        "Palpitations — 'strong thump' or 'skipped beat' sensation",
        "Awareness of the compensatory pause",
        "Lightheadedness with very frequent PVCs",
      ],
      hemodynamicallyStagable: true,
    },
    clinicalPresentation: {
      stable: [
        "Asymptomatic with isolated PVCs",
        "Mild palpitations, haemodynamically intact",
        "No structural heart disease — often benign",
      ],
      unstable: [
        "Frequent PVCs with haemodynamic compromise",
        "PVCs in context of acute MI, HF, electrolyte crisis",
        "Couplets or short runs with symptoms",
      ],
      redFlags: [
        "PVCs in setting of acute MI",
        "R-on-T PVCs (early PVC falling on T-wave)",
        "Increasing frequency: bigeminy progressing to couplets or runs",
        "Runs of PVCs (≥ 3 in a row = VT)",
        "PVCs with hypotension or symptoms",
        "New PVCs in a patient with severe hypokalaemia or hypomagnesaemia",
      ],
      emergencyTriggers: [
        "R-on-T PVC triggering VF or VT",
        "PVCs degenerating into VT or VF",
        "PVCs with acute haemodynamic compromise",
      ],
    },
    escalation: {
      defaultLevel: "varies_by_stability",
      monitoringFrequency: "Continuous; document type (isolated, bigeminy, couplets, runs) and frequency",
      immediateAssessments: [
        "Assess for symptoms: palpitations, chest pain, dizziness, syncope",
        "Check electrolytes STAT: K⁺ (target > 4.0 mEq/L), Mg²⁺ (target > 0.9 mmol/L)",
        "12-lead ECG — morphology helps localise origin; check for ischaemia",
        "Review medications: digoxin toxicity, QT-prolonging drugs, sympathomimetics",
        "Check SpO2 — hypoxia is a potent PVC trigger",
      ],
      notifyProviderWhen: [
        "Couplets (2 consecutive PVCs) or salvos",
        "Bigeminy or trigeminy persisting > 30 minutes",
        "PVCs in setting of suspected MI",
        "Symptomatic PVCs (chest pain, syncope, haemodynamic changes)",
        "R-on-T morphology identified",
        "Electrolyte abnormalities found",
      ],
      rapidResponseWhen: [
        "PVCs degenerating into sustained VT",
        "PVCs with haemodynamic instability",
        "Run of ≥ 3 PVCs (= VT threshold)",
      ],
      codeBlueWhen: [
        "VF triggered by PVCs",
        "Pulseless VT triggered by PVCs",
      ],
      interventionContraindications: [
        "Do NOT suppress isolated asymptomatic PVCs with antiarrhythmics without cardiology guidance",
        "Do NOT use Class IC antiarrhythmics (flecainide, propafenone) in post-MI patients — CAST trial showed increased mortality",
        "Avoid hypokalaemia — target K⁺ > 4.0 in cardiac patients to minimise PVC risk",
      ],
    },
    examTraps: {
      nclex: [
        "PVC = WIDE bizarre QRS + NO preceding P-wave. PAC = narrow QRS + different P-wave. Know this distinction",
        "The priority action for PVCs in an MI patient is to notify the provider — not observe",
        "R-on-T PVCs require immediate notification — they can trigger VF",
        "Couplets and runs are more urgent than isolated PVCs",
      ],
      interventionTraps: [
        "Do NOT give lidocaine prophylactically for PVCs in post-MI patients — current guidelines do not support this",
        "The priority is correcting electrolytes, not giving antiarrhythmics",
        "Treating isolated PVCs in a haemodynamically stable patient with no structural heart disease is NOT appropriate",
      ],
      telemetry: [
        "A wide premature beat = PVC until proven otherwise",
        "If the wide premature beat has a different morphology from other wide beats — suspect aberrant conduction of a PAC",
      ],
    },
    professionViews: {
      rn: {
        focus: "Assess the context: same PVC in a healthy young person vs. in an acute MI patient means completely different urgency.",
        priorities: [
          "Identify PVC type: isolated, bigeminy, couplets, runs",
          "Assess patient symptoms and haemodynamics",
          "Check electrolytes (K⁺, Mg²⁺) urgently",
          "Identify clinical context (MI? HF? Electrolyte crisis?)",
        ],
        keyActions: [
          "Obtain 12-lead ECG",
          "Check and correct electrolytes: K⁺ > 4.0, Mg²⁺ > 0.9",
          "Notify provider for couplets, runs, R-on-T, or MI context",
          "Ensure IV access is patent — may need rapid medication administration",
        ],
        examFocus: "NCLEX: PVC context determines urgency. Isolated PVC in healthy patient = monitor. PVC in MI patient = notify immediately.",
      },
      rpn: {
        focus: "Recognise the wide bizarre premature beat, identify it as PVC, assess symptoms, and escalate.",
        priorities: ["Confirm wide QRS on premature beat", "Assess for symptoms", "Check if in MI or high-risk context"],
        keyActions: ["Notify RN immediately if couplets, runs, or haemodynamic changes", "Document type and frequency"],
      },
      np: {
        focus: "Determine PVC burden, clinical context, and need for further workup or intervention.",
        priorities: [
          "Holter or event monitor for symptomatic PVCs",
          "Echo if PVC burden > 10% (risk of PVC-induced cardiomyopathy)",
          "Correct electrolyte abnormalities",
          "Consider beta-blocker if symptomatic and no contraindication",
        ],
        keyActions: [
          "Urgent 12-lead ECG and troponin if new PVCs in context of possible MI",
          "Correct K⁺ and Mg²⁺",
          "Cardiology referral if frequent, symptomatic, or post-MI PVCs",
          "Avoid Class IC antiarrhythmics in structural heart disease",
        ],
        examFocus: "NP boards: Know CAST trial implications — routine antiarrhythmic suppression of PVCs in post-MI patients increases mortality.",
      },
      rt: {
        focus: "PVCs may increase during suctioning, hypoxia, or acid-base disturbances — note temporal relationship.",
        priorities: ["Assess oxygenation when PVCs occur", "Note if PVCs correlate with ventilator interventions"],
        keyActions: ["Pre-oxygenate before suctioning", "Notify team of PVC increase during respiratory interventions"],
      },
      newGrad: {
        focus: "Wide premature beat + no P-wave = PVC. Your first question is always: what is the clinical context?",
        priorities: ["Confirm wide QRS", "Go to the bedside", "Ask: is the patient symptomatic? Do they have heart disease?"],
        keyActions: [
          "Isolated PVC in a stable patient with normal electrolytes → document, monitor, report to charge",
          "PVCs in a post-MI patient or with couplets/runs → notify provider immediately",
        ],
        examFocus: "Wide + no P-wave = PVC. Narrow + different P = PAC. Width is the key.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "pacs",
        compareWithName: "PAC",
        keyDifferences: [
          { feature: "QRS width", thisRhythm: "WIDE > 0.12s", otherRhythm: "Narrow < 0.12s" },
          { feature: "Preceding P-wave", thisRhythm: "Absent", otherRhythm: "Present — different morphology" },
          { feature: "T-wave", thisRhythm: "Discordant (opposite to QRS)", otherRhythm: "Concordant (same direction as QRS)" },
          { feature: "Pause after beat", thisRhythm: "Compensatory (full 2× R-R)", otherRhythm: "Non-compensatory (< 2× R-R)" },
          { feature: "Origin", thisRhythm: "Ventricle", otherRhythm: "Atrium" },
        ],
        clinicalImplication: "PVCs carry significantly more clinical risk in cardiac patients. The wide QRS is the key discriminator — always measure it on a premature beat.",
      },
      {
        compareWithRhythmKey: "ventricular_tachycardia",
        compareWithName: "Ventricular Tachycardia",
        keyDifferences: [
          { feature: "Number of consecutive beats", thisRhythm: "1–2 (isolated or couplet)", otherRhythm: "≥ 3 consecutive wide beats" },
          { feature: "Rate during ectopic", thisRhythm: "Single premature beat", otherRhythm: "120–250 BPM sustained" },
          { feature: "Haemodynamic urgency", thisRhythm: "Usually stable", otherRhythm: "Potentially life-threatening" },
        ],
        clinicalImplication: "Three or more consecutive PVCs = VT. This is the threshold that changes the management from monitoring to emergency intervention.",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "deterioration",
        title: "Post-MI Bigeminy Progressing to Couplets",
        clinicalContext: "Day 1 post-STEMI (anterior). Telemetry shows increasing PVC frequency — isolated → bigeminy → couplets over 20 minutes.",
        patientPresentation: "HR 90 irregular, BP 105/72, patient reports increasing chest tightness. Mg 0.7 mmol/L, K 3.3 mEq/L.",
        keyDecisionPoint: "When do you escalate from monitoring to notifying the provider? What interventions are priority?",
        learnerObjective: "Identify electrolyte triggers, prioritise Mg²⁺ and K⁺ replacement, call provider for couplets in post-MI context, monitor for progression to VT.",
      },
    ],
  },

];

// ─── Continue in part 2 ───────────────────────────────────────────────────────
// AFib, Flutter, SVT, Junctional, AJR, 1st degree, Wenckebach, Mobitz II,
// 3rd degree, RBBB, LBBB, AIVR, Ventricular escape, VT, VF, PEA, Asystole,
// STEMI, NSTEMI, Hyperkalemia, Hypokalemia, Pacemaker, Torsades

export const ECG_CLINICAL_REASONING_UNITS_PART1 = UNITS;
