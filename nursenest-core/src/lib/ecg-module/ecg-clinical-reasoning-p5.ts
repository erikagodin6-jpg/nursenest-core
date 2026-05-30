/**
 * ECG Clinical Reasoning Units — Part 5
 * AIVR (Idioventricular Rhythm) and Ventricular Escape Rhythm
 * These were split into a separate file due to file write ordering constraints.
 */

import type { EcgClinicalReasoningUnit } from "./ecg-clinical-reasoning";

export const ECG_CLINICAL_REASONING_UNITS_PART5: EcgClinicalReasoningUnit[] = [

  {
    rhythmKey: "idioventricular_rhythm",
    rhythmName: "Idioventricular Rhythm (AIVR)",
    recognition: {
      rate: "41–100 BPM",
      regularity: "Regular",
      pWaves: "Absent — no sinus P-waves preceding QRS",
      prInterval: "Not measurable",
      qrsWidth: "Wide (> 0.12s)",
      keyFeatures: [
        "Wide bizarre QRS at 41–100 BPM",
        "No P-waves before QRS",
        "Rate between junctional escape and VT threshold",
        "Regular rhythm",
      ],
      pearls: [
        "Most common post-reperfusion rhythm — a positive sign after STEMI PCI or thrombolysis",
        "AIVR is benign and self-limiting — do NOT treat with antiarrhythmics",
        "Rate < 100 BPM is the critical distinction from VT",
        "Treating AIVR with lidocaine suppresses the ventricular pacemaker and can cause asystole",
      ],
    },
    mechanism:
      "An accelerated ventricular ectopic pacemaker fires at 41–100 BPM due to enhanced automaticity. Most common after myocardial reperfusion — restoration of blood flow transiently enhances automaticity of reperfused cells, causing them to fire at a rate that equals or exceeds the sinus rate.",
    conductionPath:
      "Enhanced ventricular ectopic focus → cell-to-cell myocardial conduction → wide QRS. SA node continues firing (P-waves march independently).",
    whyStripLooksThisWay:
      "Wide QRS because ventricular conduction bypasses His-Purkinje. Rate 41–100 because the ectopic focus is enhanced above escape rate but below VT threshold. No preceding P-waves as the ventricular focus captures the rhythm.",
    hemodynamicImpact: {
      cardiacOutput: "mildly_reduced",
      cardiacOutputRationale: "Rate 41–100 with wide QRS provides adequate CO in most patients. Self-limiting — usually resolves within minutes to hours.",
      bloodPressureEffect: "normal",
      perfusionStatus: "Usually adequate.",
      expectedSymptoms: ["Usually asymptomatic", "Mild palpitations occasionally"],
      hemodynamicallyStagable: false,
    },
    clinicalPresentation: {
      stable: ["Post-PCI patient with wide complex rhythm at 60–80 BPM — haemodynamically intact"],
      unstable: ["AIVR itself is not the cause — assess the underlying MI"],
      redFlags: ["Rate approaching 100 BPM — reassess for VT"],
      emergencyTriggers: ["Rate > 100 → reclassify as VT and treat accordingly"],
    },
    escalation: {
      defaultLevel: "monitor",
      monitoringFrequency: "Continuous; document onset and resolution",
      immediateAssessments: ["Confirm rate < 100 BPM", "Assess haemodynamics", "Confirm post-reperfusion context"],
      notifyProviderWhen: ["Rate approaching 100 BPM", "Any haemodynamic change", "AIVR outside expected post-reperfusion context"],
      rapidResponseWhen: ["Acceleration to VT territory with haemodynamic change"],
      codeBlueWhen: ["VT/VF transition"],
      interventionContraindications: [
        "Do NOT treat AIVR with antiarrhythmics — especially not lidocaine",
        "Do NOT cardiovert AIVR",
      ],
    },
    examTraps: {
      nclex: [
        "AIVR rate < 100 BPM — VT is > 100 BPM. Rate is the ONLY clinical distinction",
        "AIVR in post-MI reperfusion is a GOOD SIGN — do not treat it",
        "Giving lidocaine to AIVR is dangerous — can cause asystole",
      ],
      telemetry: ["Wide QRS at 75 BPM post-PCI = AIVR (benign). Wide QRS at 150 BPM = VT (treat)."],
    },
    professionViews: {
      rn: {
        focus: "Confirm rate < 100, confirm post-reperfusion context, monitor — no treatment.",
        priorities: ["Confirm rate", "Confirm clinical context", "Assess haemodynamics"],
        keyActions: ["Document onset and rate", "Notify provider (informational)", "Monitor for rate acceleration toward 100 BPM", "Do NOT initiate antiarrhythmic treatment"],
        examFocus: "AIVR = wide QRS + rate < 100 + post-reperfusion = observe only.",
      },
      rpn: {
        focus: "Wide QRS at near-normal rate — escalate to RN for context evaluation.",
        priorities: ["Note wide QRS and rate", "Report to RN"],
        keyActions: ["Notify RN", "Obtain vital signs"],
      },
      np: {
        focus: "Confirm AIVR vs VT by rate, reassure team, no intervention needed.",
        priorities: ["Rate < 100 confirms AIVR", "Monitor for acceleration", "No antiarrhythmic treatment"],
        keyActions: ["Document rhythm in context of reperfusion", "No medications", "Monitor for NSR restoration"],
        examFocus: "NP: AIVR is a reperfusion marker. Rate < 100 = AIVR = observe.",
      },
      rt: {
        focus: "AIVR does not significantly alter oxygenation delivery — monitor baseline.",
        priorities: ["Routine SpO2 monitoring"],
        keyActions: ["Escalate only if haemodynamics change"],
      },
      newGrad: {
        focus: "Wide QRS at 70–80 BPM post-stent = AIVR = reperfusion = good news. Observe.",
        priorities: ["Confirm rate < 100", "Confirm patient just had intervention"],
        keyActions: ["Report to charge nurse", "Do not give any medications"],
        examFocus: "Wide QRS < 100 BPM post-PCI = AIVR = monitor. Not VT.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "ventricular_tachycardia",
        compareWithName: "Ventricular Tachycardia",
        keyDifferences: [
          { feature: "Rate", thisRhythm: "41–100 BPM", otherRhythm: "> 100 BPM" },
          { feature: "Clinical urgency", thisRhythm: "Benign — monitor", otherRhythm: "Life-threatening — treat" },
          { feature: "Treatment", thisRhythm: "NO treatment (antiarrhythmics dangerous)", otherRhythm: "Amiodarone or cardioversion" },
          { feature: "Context", thisRhythm: "Post-reperfusion (expected)", otherRhythm: "Any context — always pathological" },
        ],
        clinicalImplication: "Rate is the single most important distinguisher. AIVR ≤ 100 = observe. VT > 100 = treat. Misidentifying AIVR as VT and treating it can cause asystole.",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "post_intervention",
        title: "Post-PCI Wide Complex Rhythm — AIVR or VT?",
        clinicalContext: "Patient returns from catheterisation with successful LAD stenting. 20 minutes later, telemetry shows wide QRS at 72 BPM. RN asks: 'Should I give amiodarone?'",
        patientPresentation: "Asymptomatic, HR 72, BP 128/80, no P-waves visible.",
        keyDecisionPoint: "Rate 72 BPM — AIVR vs VT?",
        learnerObjective: "Identify AIVR by rate < 100, recognise as reperfusion rhythm, advise monitoring only.",
      },
    ],
  },

  {
    rhythmKey: "ventricular_escape_rhythm",
    rhythmName: "Ventricular Escape Rhythm",
    recognition: {
      rate: "20–40 BPM",
      regularity: "Regular",
      pWaves: "Absent or dissociated",
      prInterval: "Not measurable",
      qrsWidth: "Wide (> 0.12s) and bizarre",
      keyFeatures: [
        "Very slow rate: 20–40 BPM",
        "Wide bizarre QRS",
        "No P-waves before QRS",
        "Last-resort pacemaker: SA and AV nodes have both failed",
      ],
      pearls: [
        "The last pacemaker in the hierarchy — if this fails, asystole follows",
        "Atropine is NOT effective — acts on SA/AV nodes, not ventricular pacemakers",
        "Transcutaneous pacing is the immediate priority",
        "Rate 20–40 is very poorly tolerated — haemodynamic compromise is expected",
      ],
    },
    mechanism:
      "When both the SA node and AV node fail, ventricular myocardial cells fire at their intrinsic rate of 20–40 BPM. Activation spreads via cell-to-cell conduction, producing a wide bizarre QRS. This is the lowest pacemaker in the hierarchy.",
    conductionPath:
      "SA node failed + AV node failed → ventricular myocardial cells (20–40 BPM) → cell-to-cell conduction → wide QRS",
    whyStripLooksThisWay:
      "Very slow wide bizarre QRS — the lowest pacemaker taking over with abnormal conduction. No P-waves because all higher pacemakers have failed.",
    hemodynamicImpact: {
      cardiacOutput: "severely_reduced",
      cardiacOutputRationale: "Rate 20–40 BPM severely reduces CO. Abnormal ventricular activation reduces contractile efficiency further.",
      bloodPressureEffect: "severely_hypotensive",
      perfusionStatus: "Critical — cerebral and coronary perfusion severely compromised.",
      expectedSymptoms: ["Syncope or unresponsiveness", "Profound hypotension", "Near-arrest or arrest state"],
      hemodynamicallyStagable: false,
    },
    clinicalPresentation: {
      stable: ["Not a stable rhythm — haemodynamic compromise is expected"],
      unstable: ["Haemodynamic collapse", "Altered LOC", "Near-arrest"],
      redFlags: ["Any ventricular escape rhythm is always a red flag"],
      emergencyTriggers: ["Always — requires immediate pacing or code activation"],
    },
    escalation: {
      defaultLevel: "rapid_response",
      monitoringFrequency: "Continuous — the patient is in extremis",
      immediateAssessments: [
        "Check pulse — pulseless = CPR + code blue immediately",
        "If pulse: BP, LOC, IV access",
        "Transcutaneous pacemaker immediately",
      ],
      notifyProviderWhen: ["STAT — always"],
      rapidResponseWhen: ["Always — any ventricular escape rhythm"],
      codeBlueWhen: ["Pulseless ventricular escape or progression to arrest"],
      interventionContraindications: [
        "Do NOT rely on atropine — ineffective for ventricular escape",
        "Do NOT delay pacing waiting for medications",
      ],
    },
    examTraps: {
      nclex: [
        "Atropine is NOT first-line for ventricular escape — pacing is",
        "Wide slow QRS without P-waves = ventricular escape = emergency pacing",
        "QRS width distinguishes junctional (narrow) from ventricular escape (wide)",
      ],
      telemetry: ["Widest, slowest rhythm on the monitor = ventricular escape = always an emergency"],
    },
    professionViews: {
      rn: {
        focus: "Check pulse, call for help, prepare to pace — always an emergency.",
        priorities: ["Pulse check", "IV access", "Transcutaneous pacing pads", "Emergency response"],
        keyActions: [
          "If absent pulse: code blue + CPR",
          "If pulse: notify provider STAT, apply transcutaneous pacing pads",
          "Prepare epinephrine infusion",
        ],
        examFocus: "Ventricular escape = pacing emergency. Narrow = junctional (better). Wide = ventricular (worse).",
      },
      rpn: {
        focus: "Call for help immediately.",
        priorities: ["Check responsiveness", "Activate emergency response"],
        keyActions: ["Call code or RRT", "Begin CPR if pulseless"],
      },
      np: {
        focus: "Immediate pacing, identify cause, advanced resuscitation.",
        priorities: ["Transcutaneous pacing immediately", "Identify reversible cause"],
        keyActions: ["Transcutaneous → transvenous pacing", "Epinephrine if pacing not achieving adequate rate"],
        examFocus: "NP: ventricular escape = transcutaneous pacing urgently + identify reversible cause.",
      },
      rt: {
        focus: "Profound low CO eliminates respiratory drive — prepare for respiratory arrest.",
        priorities: ["Airway assessment", "Bag-valve-mask ready"],
        keyActions: ["BVM ventilate if respiratory effort absent"],
      },
      newGrad: {
        focus: "Very slow wide QRS = emergency. Check pulse. Call for help. Do not leave.",
        priorities: ["Is the patient responsive?", "Do they have a pulse?"],
        keyActions: ["Pull the emergency call", "Begin CPR if no pulse"],
        examFocus: "Wide QRS + very slow rate = ventricular escape = emergency. Never treat as 'monitor only'.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "junctional_rhythm",
        compareWithName: "Junctional Rhythm",
        keyDifferences: [
          { feature: "QRS width", thisRhythm: "WIDE > 0.12s", otherRhythm: "NARROW < 0.12s" },
          { feature: "Rate", thisRhythm: "20–40 BPM", otherRhythm: "40–60 BPM" },
          { feature: "Urgency", thisRhythm: "Highest — immediate pacing always", otherRhythm: "Urgent — pacing if symptomatic" },
          { feature: "Atropine", thisRhythm: "Usually ineffective", otherRhythm: "May help" },
        ],
        clinicalImplication: "QRS width determines urgency. Narrow = AV node backup (better). Wide = ventricular backup only (worse, needs pacing urgently).",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "emergency",
        title: "Ventricular Escape Requiring Transcutaneous Pacing",
        clinicalContext: "Untreated complete heart block transferred from remote facility. HR 26 BPM, wide QRS.",
        patientPresentation: "HR 26, BP 64/40, confused.",
        keyDecisionPoint: "Transcutaneous pacing rate, energy, and verification.",
        learnerObjective: "Apply pacing at 60–70 BPM, increase mA until electrical capture, confirm mechanical capture by pulse palpation, arrange transvenous pacing.",
      },
    ],
  },

];

// RSA appended to Part 5
ECG_CLINICAL_REASONING_UNITS_PART5.push({
  rhythmKey: "respiratory_sinus_arrhythmia",
  rhythmName: "Sinus Arrhythmia (RSA)",
  recognition: {
    rate: "55–120 BPM; rate increases with inspiration, decreases with expiration",
    regularity: "Regularly irregular — varies with respiratory cycle",
    pWaves: "Present, upright, uniform — identical to NSR",
    prInterval: "Normal (0.12–0.20s); constant",
    qrsWidth: "Narrow (< 0.12s)",
    keyFeatures: [
      "P-QRS-T identical to NSR in morphology",
      "R-R intervals LENGTHEN during expiration (heart rate slows)",
      "R-R intervals SHORTEN during inspiration (heart rate speeds up)",
      "Cyclic variation synchronised with breathing",
    ],
    pearls: [
      "RSA is a NORMAL physiologic variant — most prominent in children and young adults",
      "Reflects normal vagal modulation of the SA node by the respiratory cycle",
      "RSA can cause R-R variation up to 120ms — do not call it 'irregular rhythm' or AF",
      "Diminished RSA in adults may indicate autonomic neuropathy (e.g. diabetic)",
    ],
  },
  mechanism:
    "During inspiration, intrathoracic pressure decreases and venous return to the right heart increases. Reflex vagal inhibition (Bainbridge reflex and direct inhibition of vagal tone) causes the SA node to fire faster. During expiration, vagal tone increases and SA node rate decreases. The result is a rhythmic oscillation in heart rate synchronised to the breathing cycle.",
  conductionPath:
    "SA node (rate modulated by vagal/respiratory input) → normal atria → AV node → His-Purkinje → ventricles. All conduction is normal.",
  whyStripLooksThisWay:
    "The P-QRS-T morphology is completely normal — this is sinus node activity, just at varying rates. The R-R intervals lengthen during expiration and shorten during inspiration, producing the characteristic regularly irregular pattern that follows the respiratory rhythm.",
  hemodynamicImpact: {
    cardiacOutput: "normal",
    cardiacOutputRationale: "Normal physiologic variant with no adverse haemodynamic effect.",
    bloodPressureEffect: "normal",
    perfusionStatus: "Normal.",
    expectedSymptoms: ["Asymptomatic — physiologic finding"],
    hemodynamicallyStagable: false,
  },
  clinicalPresentation: {
    stable: ["Asymptomatic — incidental finding on telemetry", "Normal physical exam"],
    unstable: ["RSA does not cause instability"],
    redFlags: ["RSA does not produce red flags in isolation"],
    emergencyTriggers: [],
  },
  escalation: {
    defaultLevel: "monitor",
    monitoringFrequency: "Routine",
    immediateAssessments: ["Confirm morphology is identical to NSR", "Confirm variation correlates with breathing"],
    notifyProviderWhen: ["No notification needed for isolated RSA"],
    rapidResponseWhen: [],
    codeBlueWhen: [],
    interventionContraindications: ["Do NOT treat RSA — it is a normal physiologic variant"],
  },
  examTraps: {
    nclex: [
      "RSA is NORMAL — do not label it as a pathologic arrhythmia",
      "RSA is distinguished from AFib: RSA has upright P-waves before every QRS and the variation is periodic (respiratory), not random",
      "Do NOT notify the provider for isolated RSA in a young patient",
    ],
    telemetry: [
      "Varying R-R intervals with upright P-waves = RSA (normal) not AFib",
      "If you cannot see P-waves clearly — get a 12-lead ECG before labelling as AF",
    ],
  },
  professionViews: {
    rn: {
      focus: "Recognise RSA as a normal variant — the key is that P-wave morphology is identical to NSR.",
      priorities: ["Confirm upright P before every QRS", "Confirm variation is respiratory"],
      keyActions: ["Document as RSA", "No intervention needed"],
      examFocus: "RSA = normal, cyclic R-R variation with consistent P-wave morphology. No treatment.",
    },
    rpn: {
      focus: "Recognise irregular rhythm with normal P-waves and report to RN for verification.",
      priorities: ["Identify cyclic R-R variation with normal P-waves", "Escalate to RN if uncertain"],
      keyActions: ["Notify RN to confirm RSA vs other arrhythmia"],
    },
    np: {
      focus: "Confirm RSA as benign, note diminished RSA as a potential marker of autonomic dysfunction in diabetic patients.",
      priorities: ["Confirm physiologic nature of RSA", "Document as normal variant"],
      keyActions: ["If RSA unexpectedly absent in a young patient — screen for autonomic neuropathy"],
      examFocus: "NP: diminished RSA is an early marker of cardiac autonomic neuropathy in diabetes.",
    },
    rt: {
      focus: "RSA confirms normal respiratory-cardiac coupling — a positive indicator.",
      priorities: ["Note RSA as evidence of intact vagal-respiratory coupling"],
      keyActions: ["Document as normal finding"],
    },
    newGrad: {
      focus: "Varying R-R intervals with normal P-waves that change with breathing = RSA = do not panic.",
      priorities: ["Confirm P-waves are there and upright", "Does the rate change with breathing?"],
      keyActions: ["Document as sinus arrhythmia", "Notify charge nurse if you are uncertain"],
      examFocus: "RSA = normal. Irregular rhythm with normal P-waves = NOT AFib. Breathing causes the variation.",
    },
  },
  compareContrast: [
    {
      compareWithRhythmKey: "atrial_fibrillation",
      compareWithName: "Atrial Fibrillation",
      keyDifferences: [
        { feature: "P-waves", thisRhythm: "Present, upright, uniform", otherRhythm: "ABSENT — fibrillatory baseline" },
        { feature: "R-R variation pattern", thisRhythm: "Cyclic — follows respiratory cycle", otherRhythm: "Random — no pattern" },
        { feature: "Clinical significance", thisRhythm: "Normal variant — no treatment", otherRhythm: "Pathological — anticoagulation + rate/rhythm control" },
        { feature: "Age", thisRhythm: "Most prominent in young adults and children", otherRhythm: "Increases with age and cardiac disease" },
      ],
      clinicalImplication: "P-wave presence and pattern regularity are the keys. RSA has organised P-waves and a predictable pattern. AFib has no P-waves and completely random variation.",
    },
  ],
  simulationHooks: [
    {
      scenarioType: "diagnostic_challenge",
      title: "Irregular Rhythm in a Paediatric Patient — RSA or AF?",
      clinicalContext: "14-year-old on telemetry following minor cardiac surgery. Telemetry alarms for 'irregular rhythm'. R-R varies from 0.72s to 0.98s rhythmically.",
      patientPresentation: "Asymptomatic, HR 68–88 BPM varying. P-waves upright before every QRS. Rate increases with inspiration.",
      keyDecisionPoint: "Is this AFib requiring treatment or RSA requiring reassurance?",
      learnerObjective: "Confirm RSA by identifying: P-waves before every QRS, variation correlates with respiratory cycle, no fibrillatory baseline. Diagnose as normal variant. No intervention.",
    },
  ],
});
