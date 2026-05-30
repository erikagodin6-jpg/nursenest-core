/**
 * ECG Clinical Reasoning Units — Part 3
 * 3rd Degree AV Block, RBBB, LBBB, AIVR, Ventricular Escape,
 * VT, VF, PEA, Asystole, STEMI, NSTEMI
 */

import type { EcgClinicalReasoningUnit } from "./ecg-clinical-reasoning";

export const ECG_CLINICAL_REASONING_UNITS_PART3: EcgClinicalReasoningUnit[] = [

  // ── Third-Degree AV Block ─────────────────────────────────────────────────────
  {
    rhythmKey: "third_degree_av_block",
    rhythmName: "Third-Degree (Complete) AV Block",
    recognition: {
      rate: "Ventricular escape rate 20–60 BPM; atrial rate independent (usually 60–100)",
      regularity: "Regular P-waves; regular QRS — but completely INDEPENDENT of each other",
      pWaves: "Present and regular (SA node firing normally) — but NEVER conducting to QRS",
      prInterval: "Not measurable — PR relationship varies with every beat; no fixed relationship",
      qrsWidth: "Wide (> 0.12s) if ventricular escape; narrow (< 0.12s) if junctional escape",
      keyFeatures: [
        "P-waves and QRS complexes march at completely DIFFERENT rates",
        "P-waves NEVER capture the ventricles",
        "Slow regular ventricular escape rhythm (20–60 BPM)",
        "Regular atrial rate (faster) marching through the QRS complexes",
        "AV DISSOCIATION — the two chambers are electrically disconnected",
      ],
      pearls: [
        "The P-wave and QRS appear to 'walk through' each other on the strip — this is the visual hallmark",
        "Junctional escape (narrow QRS at 40–60) = block at AV node level — better prognosis",
        "Ventricular escape (wide QRS at 20–40) = infranodal block — worse prognosis, always requires pacing",
        "Cannon A-waves on neck vein examination occur when atria contract against closed AV valves",
        "Atropine is INEFFECTIVE for ventricular escape complete heart block — pacing is required",
      ],
    },
    mechanism:
      "No atrial impulse reaches the ventricles — the AV node or infranodal system is completely blocked. A subsidiary pacemaker below the block takes over: junctional escape (AV node, 40–60 BPM, narrow QRS) if the block is at the AV node, or ventricular escape (ventricular myocardium, 20–40 BPM, wide QRS) if the block is infranodal. The SA node continues firing normally but all its impulses are blocked. The atria and ventricles beat independently.",
    conductionPath:
      "SA node → atria (P-waves, regular) → COMPLETE BLOCK (no conduction to ventricles) || Subsidiary escape pacemaker → ventricles independently (slow escape rhythm). The two channels are completely disconnected.",
    whyStripLooksThisWay:
      "P-waves are regular and march at the sinus rate. QRS complexes are regular but at the escape rate (much slower). The two rhythms have no fixed relationship — PR intervals vary beat to beat because P-waves and QRS complexes are completely independent. The slow ventricular rate produces the haemodynamic compromise.",
    hemodynamicImpact: {
      cardiacOutput: "severely_reduced",
      cardiacOutputRationale:
        "Ventricular rate 20–40 BPM severely reduces CO. Loss of AV synchrony means atrial kick is completely lost (atria may contract against closed valves). Ventricular escape rhythm has wide aberrant QRS reducing contractile efficiency. CO can fall 50–70% in infranodal complete block.",
      bloodPressureEffect: "severely_hypotensive",
      perfusionStatus:
        "Cerebral, coronary, and renal perfusion critically impaired at escape rates < 40 BPM. Syncope, presyncope, and haemodynamic collapse are expected.",
      expectedSymptoms: [
        "Syncope or near-syncope (Adams-Stokes attacks)",
        "Severe dizziness",
        "Presyncope on standing",
        "Chest pain (demand ischaemia from bradycardia)",
        "Dyspnoea and pulmonary oedema",
        "Altered consciousness",
        "Sudden cardiac death (if escape rhythm fails)",
      ],
      hemodynamicallyStagable: true,
    },
    clinicalPresentation: {
      stable: [
        "Junctional escape at 45–60 BPM with maintained BP (rare and temporary — needs pacing)",
        "Chronic complete block with pacemaker already in situ",
      ],
      unstable: [
        "Ventricular escape at 20–35 BPM with hypotension",
        "Syncope with slow wide-complex escape",
        "Altered LOC from cerebral hypoperfusion",
        "Pulmonary oedema from severely compromised CO",
      ],
      redFlags: [
        "Any complete heart block — this is a pacing emergency",
        "Ventricular escape rate < 30 BPM",
        "Syncope or near-syncope with complete block",
        "Complete block in setting of anterior MI (most lethal combination)",
      ],
      emergencyTriggers: [
        "Complete heart block with haemodynamic compromise — transcutaneous pacing IMMEDIATELY",
        "Loss of escape rhythm → cardiac arrest",
        "Complete block in anterior MI → urgent transvenous pacing",
      ],
    },
    escalation: {
      defaultLevel: "rapid_response",
      monitoringFrequency: "Continuous; document atrial and ventricular rates separately",
      immediateAssessments: [
        "Confirm complete AV dissociation on 12-lead ECG",
        "Assess haemodynamic status: BP, LOC, symptoms",
        "Identify junctional vs ventricular escape (QRS width)",
        "Rule out inferior MI (RCA) and anterior MI (LAD/septal)",
        "Review medications: AV-nodal blockers that could cause complete block",
        "Check electrolytes: hyperkalaemia can cause complete block",
      ],
      notifyProviderWhen: ["Complete heart block — IMMEDIATELY; this is never a routine notification"],
      rapidResponseWhen: [
        "All complete heart block with haemodynamic compromise",
        "Ventricular escape at < 40 BPM",
      ],
      codeBlueWhen: [
        "Loss of escape rhythm",
        "Cardiac arrest from complete block",
        "Complete block with pulselessness",
      ],
      interventionContraindications: [
        "Do NOT give atropine as primary treatment for ventricular escape complete block — it increases atrial rate without improving ventricular response",
        "Do NOT add AV-nodal blockers (beta-blockers, CCBs, digoxin)",
        "Do NOT delay transcutaneous pacing while waiting for provider response",
        "Do NOT use atropine as sole treatment while deferring pacing in anterior MI with complete block",
      ],
    },
    examTraps: {
      nclex: [
        "Complete heart block ALWAYS requires pacing — there is no 'monitor and observe' answer",
        "Atropine may be ordered but will NOT convert ventricular escape complete block — pacing is the definitive treatment",
        "Distinguish from AV dissociation without block: in complete block NO P-waves conduct; in AV dissociation some may",
        "Complete block in anterior MI: pacemaker insertion urgency, not conservative management",
      ],
      interventionTraps: [
        "Isoproterenol infusion as a temporary bridge is sometimes used — but is not first-line and risks VT/VF",
        "Transcutaneous pacing is painful — consider sedation/analgesia",
        "Verify capture: each pacing spike must be followed by a wide QRS and the rate must match the set pacing rate",
      ],
      telemetry: [
        "P-waves and QRS walking through each other at different rates = complete heart block until proven otherwise",
        "Do not confuse with Wenckebach — in complete block, NO P-waves ever conduct (PR relationship never fixed)",
      ],
    },
    professionViews: {
      rn: {
        focus: "Complete heart block is always an emergency — initiate transcutaneous pacing immediately if unstable.",
        priorities: [
          "Confirm AV dissociation on 12-lead ECG",
          "Assess haemodynamic status immediately",
          "Activate rapid response if haemodynamically compromised",
          "Prepare transcutaneous pacemaker",
        ],
        keyActions: [
          "Place transcutaneous pacing pads immediately",
          "Notify provider STAT",
          "IV access x2 — large bore",
          "Atropine 0.5–1.0mg IV if ordered — know it may not work",
          "Initiate transcutaneous pacing at rate 60–80 BPM if haemodynamically unstable",
          "Verify pacing capture: spike + wide QRS + matching rate",
        ],
        examFocus: "Complete heart block = pacing emergency. NCLEX answer is NEVER 'monitor' for this rhythm.",
      },
      rpn: {
        focus: "Recognise AV dissociation pattern and escalate to RN as a cardiac emergency immediately.",
        priorities: ["P-waves and QRS at different rates = emergency escalation"],
        keyActions: ["Call RN immediately", "Stay with patient", "Do not leave patient unattended"],
      },
      np: {
        focus: "Determine block level, identify the cause, initiate pacing, and arrange urgent cardiology consultation.",
        priorities: [
          "Confirm complete block on 12-lead: atrial rate vs ventricular escape rate, no fixed PR",
          "Identify cause: inferior MI (transient, likely resolves), anterior MI (permanent pacing), medications, Lyme, infiltrative disease",
          "Initiate temporary pacing; arrange transvenous pacing",
          "Permanent pacemaker for all non-reversible causes",
        ],
        keyActions: [
          "Transcutaneous pacing as bridge",
          "Transvenous pacing insertion",
          "Urgent cardiology referral",
          "Permanent dual-chamber pacemaker (DDD) for persistent complete block",
        ],
        examFocus: "NP: complete block from inferior MI may be transient (resolves in 1–2 weeks); from anterior MI often requires permanent pacing.",
      },
      rt: {
        focus: "CO severely compromised — oxygenation delivery depends on restoring adequate heart rate.",
        priorities: ["Monitor SpO2 and work of breathing", "Prepare for haemodynamic support during pacing"],
        keyActions: ["Support oxygenation", "Assist with ventilatory management if pulmonary oedema develops during severe block"],
      },
      newGrad: {
        focus: "P-waves and QRS both regular but completely unrelated to each other — this is a 911-level rhythm. Call immediately.",
        priorities: ["Can you see P-waves and QRS at different rates?", "Is the patient conscious and responsive?"],
        keyActions: [
          "Call the charge nurse and provider NOW",
          "Do not leave the bedside",
          "Be ready to apply pacing pads",
        ],
        examFocus: "Two regular rhythms at different rates on the same strip = complete heart block. This requires immediate pacing, not medication.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "second_degree_type_ii_av_block",
        compareWithName: "Mobitz II",
        keyDifferences: [
          { feature: "AV conduction", thisRhythm: "ZERO — no P ever conducts", otherRhythm: "Some P-waves conduct (those with QRS)" },
          { feature: "PR relationship", thisRhythm: "Completely dissociated — varies randomly", otherRhythm: "Fixed PR on conducted beats" },
          { feature: "Urgency", thisRhythm: "Highest — always requires pacing", otherRhythm: "High — requires pacing" },
          { feature: "Escape rate", thisRhythm: "20–60 BPM (ventricular or junctional)", otherRhythm: "Depends on conducted rate" },
        ],
        clinicalImplication: "Mobitz II can progress to complete block at any time without warning. Both require pacing; complete block requires it immediately.",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "emergency",
        title: "Syncope in the Hallway — Complete Heart Block",
        clinicalContext: "78-year-old patient found unresponsive in the hallway. Monitor shows P-waves at 72 BPM, wide QRS at 28 BPM marching independently.",
        patientPresentation: "Unresponsive but has a pulse (weak, 28 BPM). BP 72/40. Gasping respirations.",
        keyDecisionPoint: "Do you initiate transcutaneous pacing before provider arrives?",
        learnerObjective: "Confirm pulseless vs pulse-present bradycardia, apply transcutaneous pacing at 60 BPM, verify electrical and mechanical capture, notify provider.",
      },
    ],
  },

  // ── RBBB ─────────────────────────────────────────────────────────────────────
  {
    rhythmKey: "right_bundle_branch_block",
    rhythmName: "Right Bundle Branch Block (RBBB)",
    recognition: {
      rate: "50–120 BPM (underlying rhythm rate)",
      regularity: "Regular (underlying rhythm)",
      pWaves: "Present, upright — atrial conduction is normal",
      prInterval: "Normal (0.12–0.20s)",
      qrsWidth: "≥ 0.12s (WIDE)",
      stSegment: "Secondary changes: ST depression + T-wave inversion in V1–V3 (discordant — normal in RBBB, NOT ischaemia)",
      keyFeatures: [
        "RSR' ('rabbit ears') in V1 or V2",
        "Wide slurred S wave in leads I and V6",
        "QRS ≥ 0.12s",
        "Secondary ST-T changes in right precordial leads (normal, not ischaemia)",
        "Normal P-wave and PR — atrial and AV node conduction intact",
      ],
      pearls: [
        "RSR' in V1 is the defining feature — the right ventricle activates LAST (slowly, cell-to-cell)",
        "Wide S in I and V6 reflects the delayed right-ward terminal forces of RV activation",
        "RBBB can be a normal variant (incomplete RBBB, QRS 0.10–0.12s)",
        "New RBBB in the context of acute PE: think S1Q3T3 + RBBB pattern",
        "RBBB does NOT invalidate STEMI diagnosis — ST changes in RBBB require careful Sgarbossa-type interpretation",
      ],
    },
    mechanism:
      "The right bundle branch fails to conduct the impulse from the Bundle of His to the right ventricle. The left ventricle activates normally via the left bundle branch (initial normal narrow QRS component). The right ventricle then activates SLOWLY via cell-to-cell spread from the left ventricle across the interventricular septum — this delayed, aberrant RV activation produces the R' wave (second positive deflection) in V1 and the wide terminal S wave in lateral leads.",
    conductionPath:
      "SA node → AV node → Bundle of His → LEFT bundle branch (normal, fast) → LV activates first (narrow initial QRS). Right bundle BLOCKED → RV activates via slow cell-to-cell spread from LV → late R' wave in V1, wide S in lateral leads.",
    whyStripLooksThisWay:
      "Initial QRS is normal (left ventricular activation). Then a second positive deflection (R') appears as the right ventricle activates slowly after the left. This produces the RSR' 'rabbit ears' in V1. The wide terminal S wave in I/V6 reflects the final rightward-upward activation vector. Secondary ST-T inversions in V1-V3 are expected in RBBB — they reflect abnormal repolarisation, not ischaemia.",
    hemodynamicImpact: {
      cardiacOutput: "normal",
      cardiacOutputRationale: "RBBB alone does not impair haemodynamics. The ventricles still contract in sequence with acceptable timing.",
      bloodPressureEffect: "normal",
      perfusionStatus: "Normal unless underlying cardiac disease is present.",
      expectedSymptoms: [
        "Asymptomatic in most cases (RBBB alone causes no symptoms)",
        "Symptoms from the underlying cause if present (PE, RV strain, cardiomyopathy)",
      ],
      hemodynamicallyStagable: false,
    },
    clinicalPresentation: {
      stable: [
        "Asymptomatic, incidental finding",
        "Long-standing RBBB on ECG without change",
      ],
      unstable: [
        "Unstable presentation is from the underlying cause (PE, RV MI, cardiomyopathy), not RBBB itself",
        "New RBBB + haemodynamic compromise in PE context",
      ],
      redFlags: [
        "NEW RBBB — always investigate for underlying cause",
        "RBBB + S1Q3T3 pattern — highly suspicious for PE",
        "RBBB in setting of anterior MI (bifascicular block indicates extensive conduction disease)",
        "RBBB + left anterior fascicular block (LAFB) = bifascicular block → risk of complete heart block",
      ],
      emergencyTriggers: [
        "Trifascicular block (RBBB + LAFB + prolonged PR) — pacing consultation",
        "Haemodynamic compromise from underlying PE or RV MI",
      ],
    },
    escalation: {
      defaultLevel: "notify_provider",
      monitoringFrequency: "Routine unless new onset; continuous if new RBBB",
      immediateAssessments: [
        "Determine if new or pre-existing (compare to previous ECGs)",
        "12-lead ECG with attention to V1, V6, I, III",
        "If new: assess for PE (SpO2, RR, pleuritic chest pain, risk factors) and acute MI",
        "Vital signs and clinical status",
      ],
      notifyProviderWhen: [
        "New RBBB identified",
        "RBBB in the context of chest pain, dyspnoea, or haemodynamic change",
        "RBBB in setting of possible PE",
      ],
      rapidResponseWhen: ["New RBBB with haemodynamic compromise (possible massive PE)"],
      codeBlueWhen: [],
      interventionContraindications: [
        "Do NOT interpret ST depression in V1–V3 as ischaemia — it is expected secondary change in RBBB",
        "Do not diagnose acute STEMI based solely on ST changes in RBBB without Sgarbossa criteria analysis",
      ],
    },
    examTraps: {
      nclex: [
        "RSR' in V1 = RBBB. This is the single most tested ECG pattern for BBB identification",
        "The ST-T changes in V1–V3 in RBBB are SECONDARY (expected) — NOT acute ischaemia",
        "RBBB alone does NOT require treatment — only if haemodynamically significant underlying cause",
        "New RBBB in a patient with dyspnoea and hypoxia — think PE first",
      ],
      telemetry: [
        "Wide QRS + RSR' in V1 is RBBB; wide QRS + broad notched R in V6 is LBBB",
        "Secondary ST changes in RBBB: downsloping in V1 and V2 — expected, not ischaemia",
      ],
    },
    professionViews: {
      rn: {
        focus: "Identify RBBB, determine if new, and assess for underlying cause (PE, RV MI).",
        priorities: ["Is this new or old?", "Assess for PE symptoms: dyspnoea, hypoxia, chest pain, tachycardia"],
        keyActions: [
          "Compare to prior ECGs if available",
          "Notify provider for new RBBB",
          "Assess SpO2, respiratory rate, and chest symptoms",
        ],
        examFocus: "NCLEX: RSR' in V1 = RBBB. ST changes in V1-V3 in RBBB are expected — do not call them ischaemia.",
      },
      rpn: {
        focus: "Recognise wide QRS with RSR' and escalate to RN for clinical interpretation.",
        priorities: ["Identify wide QRS", "Notify RN for any new wide QRS pattern"],
        keyActions: ["Report to RN", "Obtain vital signs"],
      },
      np: {
        focus: "Rule out acute cause for new RBBB and determine if further workup is needed.",
        priorities: [
          "Compare to prior ECGs — is RBBB new or chronic?",
          "PE workup if indicated: D-dimer, CT-PA, V/Q scan",
          "Evaluate for bifascicular or trifascicular block (pacing risk)",
        ],
        keyActions: [
          "CT pulmonary angiography if PE suspected",
          "Echocardiogram if structural RV disease suspected",
          "Cardiology referral for bifascicular block",
        ],
        examFocus: "NP: new RBBB + S1Q3T3 = PE until proven otherwise. Bifascicular block = pacing risk assessment.",
      },
      rt: {
        focus: "RBBB can be a sign of acute RV strain from hypoxia or PE — note correlation with respiratory changes.",
        priorities: ["Note if RBBB is new in hypoxic patient", "PE is a respiratory emergency with RBBB as an ECG sign"],
        keyActions: ["Notify team of SpO2 and RBBB correlation if new"],
      },
      newGrad: {
        focus: "Rabbit ears (RSR') in V1 = RBBB. Wide QRS. Don't confuse the ST changes in V1-V3 with a heart attack.",
        priorities: ["Look for RSR' in V1", "Is the QRS wide?", "Is this new?"],
        keyActions: ["Report new RBBB to charge nurse", "Assess SpO2 and respiratory status"],
        examFocus: "RSR' in V1 = RBBB. Not ischaemia. Report if new.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "left_bundle_branch_block",
        compareWithName: "Left Bundle Branch Block",
        keyDifferences: [
          { feature: "V1 morphology", thisRhythm: "RSR' (rabbit ears)", otherRhythm: "QS or rS (predominantly negative)" },
          { feature: "Lateral lead (I, V6)", thisRhythm: "Wide S wave", otherRhythm: "Broad notched R wave (no Q)" },
          { feature: "STEMI implications", thisRhythm: "Does not mask STEMI as much", otherRhythm: "Masks STEMI — use Sgarbossa criteria" },
          { feature: "Pathological significance", thisRhythm: "Can be normal variant", otherRhythm: "Almost always pathological" },
          { feature: "Discordant T-wave", thisRhythm: "V1–V3 (expected)", otherRhythm: "Lateral leads V5-V6 (expected)" },
        ],
        clinicalImplication: "LBBB is almost always pathological and masks ischaemia on ECG. New LBBB is a STEMI equivalent. RBBB can be benign but requires workup when new.",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "diagnostic_challenge",
        title: "New RBBB in the Post-Op Setting",
        clinicalContext: "Day 1 post-op total hip replacement. SpO2 drops to 91%. HR 108 regular. New RBBB on telemetry.",
        patientPresentation: "Patient reports sudden dyspnoea and right-sided pleuritic chest pain. Previous ECG was normal.",
        keyDecisionPoint: "What does new RBBB + tachycardia + hypoxia + pleuritic chest pain suggest?",
        learnerObjective: "Identify PE as likely cause; initiate PE workup (D-dimer, CT-PA); recognise RBBB as an ECG manifestation of acute RV strain.",
      },
    ],
  },

  // ── LBBB ─────────────────────────────────────────────────────────────────────
  {
    rhythmKey: "left_bundle_branch_block",
    rhythmName: "Left Bundle Branch Block (LBBB)",
    recognition: {
      rate: "50–120 BPM",
      regularity: "Regular (underlying rhythm)",
      pWaves: "Present and normal",
      prInterval: "Normal (0.12–0.20s)",
      qrsWidth: "≥ 0.12s (WIDE)",
      stSegment: "Discordant ST-T changes throughout — opposite to main QRS deflection (expected in LBBB)",
      keyFeatures: [
        "Broad notched R in leads I, aVL, V5, V6",
        "No Q-wave in lateral leads (I, V5, V6)",
        "QS or rS pattern in V1 (predominantly negative)",
        "Discordant T-waves (opposite to main QRS direction)",
        "QRS ≥ 0.12s",
      ],
      pearls: [
        "LBBB is almost ALWAYS pathological — unlike RBBB which can be normal",
        "NEW LBBB is considered a STEMI equivalent — activate the cath lab",
        "Standard STEMI criteria do NOT apply to LBBB — use Sgarbossa criteria for ischaemia identification",
        "Discordant ST-T changes in LBBB are EXPECTED — concordant ST elevation IS the sign of ischaemia",
        "LBBB can mask the ECG changes of MI, making diagnosis more difficult",
      ],
    },
    mechanism:
      "The left bundle branch fails to conduct. Both fascicles (anterior and posterior) of the left bundle are blocked. The left ventricle is now activated slowly via cell-to-cell spread from the right ventricle across the interventricular septum — the OPPOSITE direction from normal LV activation. This produces broad monophasic R waves in lateral leads (delayed LV activation from right to left) and QS in V1 (now records delayed activation travelling away). Loss of normal septal activation removes the septal Q-wave in lateral leads.",
    conductionPath:
      "SA node → AV node → Bundle of His → RIGHT bundle branch (normal) → RV activates normally. LEFT bundle BLOCKED → LV activates slowly by cell-to-cell spread from RV → broad notched R in lateral leads, QS in V1.",
    whyStripLooksThisWay:
      "The broad notched R wave in I/V6 reflects LV activating slowly and abnormally. The notch represents the interventricular sequential activation (right first, then left). No Q-wave in lateral leads because septal depolarisation is lost. V1 shows QS because LV activation now travels away from V1 entirely. Discordant T-waves are the expected repolarisation consequence of abnormal activation.",
    hemodynamicImpact: {
      cardiacOutput: "mildly_reduced",
      cardiacOutputRationale: "Abnormal LV activation sequence creates dyssynchronous ventricular contraction, reducing LV efficiency by 10–20%. In patients with cardiomyopathy, LBBB-induced dyssynchrony can significantly worsen heart failure.",
      bloodPressureEffect: "variable",
      perfusionStatus: "Dependent on underlying cardiac function. In patients with HF + LBBB, cardiac resynchronisation therapy (CRT) can improve CO by 15–25%.",
      expectedSymptoms: [
        "Often asymptomatic (LBBB itself)",
        "Symptoms from underlying cause (HF, ischaemia, cardiomyopathy)",
        "Heart failure symptoms if LBBB-induced dyssynchrony worsens existing HF",
      ],
      hemodynamicallyStagable: true,
    },
    clinicalPresentation: {
      stable: [
        "Chronic LBBB without haemodynamic change",
        "Known LBBB with compensated heart failure",
      ],
      unstable: [
        "NEW LBBB in chest pain context = STEMI until proven otherwise",
        "LBBB with haemodynamic compromise (from underlying MI or HF)",
      ],
      redFlags: [
        "NEW LBBB — always treat as STEMI equivalent in chest pain context",
        "LBBB + chest pain + elevated troponin",
        "LBBB + haemodynamic compromise",
        "New LBBB + cardiogenic shock",
      ],
      emergencyTriggers: [
        "New LBBB + chest pain → STEMI protocol activation",
        "New LBBB + haemodynamic instability → urgent cardiology",
      ],
    },
    escalation: {
      defaultLevel: "notify_provider",
      monitoringFrequency: "Continuous if new; routine if chronic",
      immediateAssessments: [
        "Determine if LBBB is new vs prior (mandatory — compare to all available previous ECGs)",
        "If new: 12-lead ECG + serial troponins + STEMI protocol consideration",
        "Assess for chest pain, dyspnoea, haemodynamic stability",
        "Sgarbossa criteria if ischaemia suspected",
      ],
      notifyProviderWhen: [
        "ANY new LBBB",
        "LBBB in setting of chest pain",
        "LBBB with haemodynamic change",
      ],
      rapidResponseWhen: [
        "New LBBB + haemodynamic instability",
        "New LBBB + ST changes meeting Sgarbossa criteria",
      ],
      codeBlueWhen: ["Cardiac arrest in setting of LBBB with likely MI"],
      interventionContraindications: [
        "Do NOT interpret discordant ST-T changes as ischaemia in LBBB — this is expected",
        "Do NOT apply standard STEMI criteria to LBBB — use Sgarbossa criteria",
        "Do NOT delay STEMI activation for a new LBBB + chest pain patient pending more 'proof'",
      ],
    },
    examTraps: {
      nclex: [
        "NEW LBBB + chest pain = STEMI equivalent — activate the cath lab protocol",
        "Discordant ST-T changes in LBBB are NORMAL — do not label as ischaemia",
        "CONCORDANT ST elevation in LBBB IS ischaemia (Sgarbossa criterion 1)",
        "LBBB masks the Q-wave changes of MI — serial troponins are essential",
      ],
      interventionTraps: [
        "Do not withhold aspirin/P2Y12 from chest pain patient because LBBB makes ECG interpretation difficult",
        "Time is still critical — new LBBB in the MI setting has the same door-to-balloon goal as STEMI",
      ],
      telemetry: [
        "Broad notched R in V6 + no Q wave = LBBB. RSR' in V1 = RBBB. Memorise this distinction",
        "V1 shows QS in LBBB vs RSR' in RBBB — this is the single most tested BBB ECG distinction",
      ],
    },
    professionViews: {
      rn: {
        focus: "New LBBB in a chest pain patient = potential STEMI — activate the protocol and notify immediately.",
        priorities: ["Confirm if new vs old (compare previous ECGs)", "Assess for chest pain, diaphoresis, dyspnoea", "Activate STEMI protocol if new LBBB + chest pain"],
        keyActions: [
          "Obtain 12-lead ECG",
          "Compare to previous ECG",
          "Notify provider STAT if new LBBB",
          "If new LBBB + chest pain: activate STEMI protocol",
          "12-lead → aspirin → IV access → oxygen → serial troponins",
        ],
        examFocus: "New LBBB + chest pain = STEMI equivalent. This is a high-priority NCLEX scenario.",
      },
      rpn: {
        focus: "Recognise wide QRS with notched R in V6, escalate immediately to RN.",
        priorities: ["Identify wide QRS + notched R pattern", "Report to RN immediately if new"],
        keyActions: ["Notify RN", "Obtain vital signs", "Assess patient for chest pain"],
      },
      np: {
        focus: "New LBBB + chest pain requires STEMI-equivalent management and Sgarbossa criteria analysis.",
        priorities: [
          "Apply Sgarbossa criteria (concordant STE ≥ 1mm in leads with upright QRS; STE ≥ 5mm discordant in leads with negative QRS)",
          "Activate cath lab for new LBBB + typical symptoms",
          "CRT candidacy for LBBB + HFrEF (EF ≤ 35%)",
        ],
        keyActions: [
          "STEMI protocol for new LBBB + symptoms",
          "Serial troponins every 3 hours",
          "Echo for LV function in persistent new LBBB",
          "CRT referral if LBBB + HFrEF + QRS ≥ 150ms",
        ],
        examFocus: "NP boards: Sgarbossa criteria for ischaemia in LBBB; CRT indications.",
      },
      rt: {
        focus: "LBBB in HF patients may indicate significant dyssynchrony affecting oxygenation delivery.",
        priorities: ["Monitor oxygenation in new LBBB", "Note if respiratory deterioration correlates with new LBBB"],
        keyActions: ["Support oxygenation", "Notify team of correlation between LBBB onset and respiratory decline"],
      },
      newGrad: {
        focus: "Broad notched R in V6, QS in V1, wide QRS = LBBB. New LBBB with chest pain = emergency.",
        priorities: ["Wide QRS + broad notched R (no rabbit ears) = LBBB", "Is this new? Is the patient in chest pain?"],
        keyActions: ["Get chart to compare to prior ECG", "Call charge nurse immediately if you find new LBBB in a chest pain patient"],
        examFocus: "LBBB + new + chest pain = STEMI alert. This will be on your exam.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "right_bundle_branch_block",
        compareWithName: "Right Bundle Branch Block (RBBB)",
        keyDifferences: [
          { feature: "V1 appearance", thisRhythm: "QS or rS (negative)", otherRhythm: "RSR' (positive, rabbit ears)" },
          { feature: "V6/I lateral leads", thisRhythm: "Broad notched R, NO Q-wave", otherRhythm: "Wide slurred S wave" },
          { feature: "Clinical significance", thisRhythm: "Almost always pathological", otherRhythm: "Can be normal variant" },
          { feature: "STEMI implications", thisRhythm: "New = STEMI equivalent; masks MI", otherRhythm: "Does not mask STEMI equally" },
          { feature: "CRT candidacy", thisRhythm: "LBBB + HFrEF = CRT indication", otherRhythm: "RBBB: less benefit from CRT" },
        ],
        clinicalImplication: "LBBB vs RBBB is tested on every ECG exam. The clinical implication is most important: new LBBB with chest pain = STEMI protocol. New RBBB with dyspnoea = PE protocol.",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "emergency",
        title: "New LBBB in Chest Pain Patient — STEMI or Not?",
        clinicalContext: "67-year-old presents to ED with crushing chest pain radiating to jaw. 12-lead shows new LBBB. Troponin pending.",
        patientPresentation: "Diaphoretic, BP 95/60, HR 96. Previous ECG 6 months ago showed normal QRS. Current LBBB is new.",
        keyDecisionPoint: "Do you activate the STEMI protocol based on new LBBB + symptoms before troponin result?",
        learnerObjective: "Recognise new LBBB + ischaemic symptoms as a STEMI equivalent; activate cath lab protocol without waiting for troponin; initiate STEMI care bundle.",
      },
    ],
  },

  // ── VT ───────────────────────────────────────────────────────────────────────
  {
    rhythmKey: "ventricular_tachycardia",
    rhythmName: "Ventricular Tachycardia",
    recognition: {
      rate: "120–250 BPM",
      regularity: "Regular",
      pWaves: "Absent or dissociated (AV dissociation — P-waves march independently at slower rate)",
      prInterval: "Not measurable",
      qrsWidth: "≥ 0.12s (WIDE and bizarre)",
      stSegment: "Discordant ST-T changes throughout",
      keyFeatures: [
        "Rapid (> 120 BPM) regular WIDE complex tachycardia",
        "QRS ≥ 0.12s",
        "No preceding P-waves (or dissociated P-waves)",
        "Fusion beats and capture beats (pathognomonic for VT)",
        "Concordance in precordial leads (all positive or all negative)",
      ],
      pearls: [
        "TREAT ANY WIDE COMPLEX TACHYCARDIA AS VT UNTIL PROVEN OTHERWISE",
        "Fusion beats (normal QRS + PVC hybrid) and capture beats (single narrow QRS in VT) are DIAGNOSTIC of VT",
        "Brugada and Vereckei algorithms help distinguish VT from SVT with aberrancy — but in practice, wide = VT until proven otherwise",
        "A haemodynamically stable patient can be in VT — stability does NOT rule out VT",
        "Run of ≥ 3 consecutive PVCs at > 100 BPM = VT by definition",
      ],
    },
    mechanism:
      "A re-entrant circuit in the ventricular myocardium (often around a scar from prior MI) or enhanced ventricular automaticity drives rapid, disorganised-appearing ventricular activation at 120–250 BPM. Because this bypasses the His-Purkinje system, each QRS is wide and bizarre. The SA node continues firing (producing P-waves at sinus rate) but these P-waves are dissociated from the ventricular activity — AV dissociation is a hallmark.",
    conductionPath:
      "Ventricular re-entrant circuit or ectopic focus → aberrant cell-to-cell ventricular conduction → wide bizarre QRS. SA node fires independently at its own rate (AV dissociation).",
    whyStripLooksThisWay:
      "Rapid regular wide QRS complexes with no visible P-wave relationship. The uniformity (monomorphic VT) reflects a single stable re-entrant circuit. If the patient is lucky enough to have a sinus beat break through (capture beat), it produces a single narrow QRS in the middle of the wide-complex tachycardia — this is pathognomonic for VT.",
    hemodynamicImpact: {
      cardiacOutput: "moderately_reduced",
      cardiacOutputRationale:
        "Rapid rate + abnormal activation sequence reduces ventricular filling time and contractile efficiency. Most patients with VT > 150 BPM have significantly reduced CO. However, some patients surprisingly tolerate sustained VT — haemodynamic stability does NOT exclude VT.",
      bloodPressureEffect: "variable",
      perfusionStatus: "Variable — some tolerate VT for minutes to hours; others collapse immediately. Always assess pulse and perfusion status.",
      expectedSymptoms: [
        "Palpitations",
        "Dizziness, presyncope, syncope",
        "Chest pain (from demand ischaemia)",
        "Dyspnoea",
        "Diaphoresis",
        "Cardiac arrest (if pulseless VT)",
      ],
      hemodynamicallyStagable: true,
    },
    clinicalPresentation: {
      stable: [
        "Alert, talking, tolerable BP (> 90 systolic)",
        "Rapid heart rate with maintained consciousness",
        "Palpitations and mild dizziness without syncope",
      ],
      unstable: [
        "Hypotension (SBP < 90)",
        "Altered or decreasing consciousness",
        "Chest pain with poor perfusion",
        "Pulmonary oedema",
        "Pulseless (cardiac arrest) — treat as VF",
      ],
      redFlags: [
        "ANY wide complex tachycardia at > 120 BPM",
        "VT in setting of acute MI (highest degeneration risk)",
        "VT with any haemodynamic compromise",
        "Polymorphic VT (multiple morphologies — may be torsades)",
        "Rate > 180 BPM (degeneration to VF risk increases)",
      ],
      emergencyTriggers: [
        "Pulseless VT → defibrillate IMMEDIATELY (treat as VF)",
        "VT with haemodynamic instability → synchronised cardioversion IMMEDIATELY",
        "VT degenerating to VF → defibrillate",
      ],
    },
    escalation: {
      defaultLevel: "rapid_response",
      monitoringFrequency: "Continuous; check pulse at onset of any wide complex tachycardia",
      immediateAssessments: [
        "CHECK PULSE FIRST — pulseless VT = VF protocol (defibrillate)",
        "Assess haemodynamic stability: BP, LOC, symptoms",
        "12-lead ECG during VT",
        "IV access × 2 large bore",
        "Prepare defibrillator/cardioverter",
        "Electrolytes: K⁺ and Mg²⁺ STAT",
      ],
      notifyProviderWhen: ["ANY VT identification — this is always a rapid response / emergency call"],
      rapidResponseWhen: ["All VT — minimum rapid response activation"],
      codeBlueWhen: [
        "Pulseless VT",
        "VT with cardiac arrest",
        "VT degenerating to VF",
      ],
      interventionContraindications: [
        "Do NOT give verapamil for wide complex tachycardia — lethal if VT",
        "Do NOT give adenosine to irregular wide complex tachycardia (possible AF with aberrancy/WPW)",
        "Do NOT synchronised-cardiovert if pulseless — use unsynchronised defibrillation (treat as VF)",
        "Do NOT delay cardioversion for stable VT while trying multiple medications without success",
      ],
    },
    examTraps: {
      nclex: [
        "ALWAYS CHECK PULSE on any wide complex tachycardia before anything else",
        "Haemodynamic stability does NOT mean it is SVT — VT can be haemodynamically stable",
        "Stable VT → amiodarone 150mg IV or synchronised cardioversion (never verapamil)",
        "Unstable VT with pulse → synchronised cardioversion IMMEDIATELY",
        "Pulseless VT → treat exactly like VF (defibrillate 200J biphasic, start CPR)",
        "Verapamil for VT = lethal — this is the most dangerous drug trap on telemetry exams",
      ],
      interventionTraps: [
        "Amiodarone 150mg IV over 10 minutes for stable VT (not bolus)",
        "Lidocaine 1–1.5 mg/kg IV is alternative first-line for VT in MI context",
        "Synchronised cardioversion: machine synchronises the shock to QRS to avoid R-on-T (which causes VF)",
      ],
      telemetry: [
        "Wide regular tachycardia = VT until proven otherwise",
        "AV dissociation visible on strip (P-waves marching through QRS at different rate) = diagnostic of VT",
        "Fusion beat = narrow-ish QRS in middle of wide complex tachycardia = pathognomonic VT",
      ],
    },
    professionViews: {
      rn: {
        focus: "Check pulse. Assess stability. Wide complex tachycardia = VT until proven otherwise. Act fast.",
        priorities: [
          "CHECK PULSE IMMEDIATELY",
          "Assess haemodynamic status: BP, LOC, symptoms",
          "Notify provider and activate rapid response NOW",
          "Prepare cardioverter — synchronised mode if stable, unsynchronised if pulseless",
        ],
        keyActions: [
          "Call rapid response or code immediately",
          "Pulse present + stable: notify provider; amiodarone protocol",
          "Pulse present + unstable: synchronised cardioversion",
          "Pulseless: CPR + unsynchronised defibrillation",
          "Correct K⁺ and Mg²⁺",
        ],
        examFocus: "NCLEX VT: Check pulse → unstable with pulse → cardiovert → pulseless → defibrillate. Verapamil = WRONG answer always.",
      },
      rpn: {
        focus: "Wide fast tachycardia: check pulse, call RN immediately, do not leave patient.",
        priorities: ["Check pulse", "Call RN NOW", "Stay with patient"],
        keyActions: ["Notify RN emergency", "Prepare to start CPR if patient loses pulse"],
      },
      np: {
        focus: "Rapid haemodynamic assessment, immediate treatment initiation, and post-VT workup.",
        priorities: [
          "Pulse present + stable: amiodarone 150mg IV over 10 min or procainamide or sotalol",
          "Pulse present + unstable: synchronised cardioversion 100J biphasic",
          "Pulseless: ACLS VF/pVT protocol",
          "Post-conversion: identify and treat cause (ischaemia, electrolytes, structural)",
        ],
        keyActions: [
          "Electrolytes STAT",
          "Troponin, 12-lead post-conversion",
          "ICD referral for sustained VT (especially post-MI or structural heart disease)",
          "EP study for VT morphology and ablation candidacy",
        ],
        examFocus: "NP boards: amiodarone for stable VT; cardioversion for unstable; ACLS protocol for pulseless. Post-event: ICD/EP referral.",
      },
      rt: {
        focus: "VT severely compromises CO and oxygenation delivery — provide respiratory support and assist with resuscitation.",
        priorities: ["Assess oxygenation immediately", "Prepare for possible CPR and ventilation support"],
        keyActions: ["Supplemental O2", "Bag-valve mask preparation", "Assist team during resuscitation"],
      },
      newGrad: {
        focus: "Wide fast rhythm: touch the patient. Is there a pulse? This is the most important question you will ever ask.",
        priorities: ["Feel for a radial or carotid pulse", "Is the patient awake and responsive?"],
        keyActions: [
          "If no pulse: start CPR and call code blue",
          "If pulse present: call your charge nurse and rapid response immediately",
          "Do not try to interpret the strip while the patient might be pulseless",
        ],
        examFocus: "Wide complex tachycardia: check pulse first. Then stability. Verapamil = wrong. Wide = VT until proven otherwise.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "svt",
        compareWithName: "SVT",
        keyDifferences: [
          { feature: "QRS width", thisRhythm: "WIDE ≥ 0.12s", otherRhythm: "Narrow < 0.12s" },
          { feature: "AV dissociation", thisRhythm: "Present (P-waves march independently)", otherRhythm: "Absent — retrograde P or hidden" },
          { feature: "Treatment if uncertain", thisRhythm: "Treat as VT — amiodarone or cardioversion", otherRhythm: "Vagal → adenosine" },
          { feature: "Verapamil", thisRhythm: "ABSOLUTELY CONTRAINDICATED", otherRhythm: "Acceptable if confirmed SVT" },
          { feature: "Response to adenosine", thisRhythm: "No effect or minimal", otherRhythm: "Converts to sinus" },
        ],
        clinicalImplication: "When uncertain: treat as VT. The consequence of treating SVT as VT is minimal. The consequence of treating VT with verapamil is cardiovascular collapse.",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "emergency",
        title: "Wide Complex Tachycardia — Stable or Not?",
        clinicalContext: "Post-MI patient, day 2. Monitor alarm at 3am shows rapid wide complex tachycardia at 190 BPM.",
        patientPresentation: "You arrive at bedside. Patient is pale, diaphoretic. BP 78/50. Responsive to voice but confused.",
        keyDecisionPoint: "Pulse is present. Patient is haemodynamically unstable. What is the immediate intervention?",
        learnerObjective: "Confirm VT with pulse + instability → synchronised cardioversion; notify provider; post-shock: amiodarone drip; correct K⁺/Mg²⁺.",
      },
    ],
  },

  // ── VF ───────────────────────────────────────────────────────────────────────
  {
    rhythmKey: "ventricular_fibrillation",
    rhythmName: "Ventricular Fibrillation",
    recognition: {
      rate: "Not measurable — chaotic",
      regularity: "Chaotic — no organised pattern",
      pWaves: "Absent",
      prInterval: "Not measurable",
      qrsWidth: "No identifiable QRS complexes",
      keyFeatures: [
        "Completely chaotic waveform — no organised complexes",
        "Varying amplitude and frequency",
        "No identifiable P, QRS, or T waves",
        "PULSELESS — always check pulse to confirm",
      ],
      pearls: [
        "VF = cardiac arrest. There is no cardiac output. CPR must start immediately",
        "Confirm in 2 leads before calling code — artefact (loose lead, patient movement) can look like VF",
        "Coarse VF (high amplitude) responds better to defibrillation than fine VF (low amplitude)",
        "Fine VF may be mistaken for asystole — check leads and gain before treating as asystole",
        "Every 2 minutes without defibrillation reduces survival by 10%",
      ],
    },
    mechanism:
      "Multiple chaotic re-entrant wavelets circulate simultaneously throughout the ventricular myocardium at hundreds of impulses per second. No coordinated ventricular contraction occurs — the ventricles quiver uselessly. There is zero cardiac output. The electrical chaos is driven by the same mechanisms as VT (scar, ischaemia, electrolyte instability, QT prolongation) but without any organised circuit.",
    conductionPath: "No organised conduction — multiple simultaneous chaotic re-entrant wavelets throughout ventricular myocardium.",
    whyStripLooksThisWay:
      "The completely chaotic waveform reflects hundreds of simultaneous wavefronts colliding and cancelling. No organised complex is visible because no part of the ventricle depolarises or repolarises in unison. Amplitude varies with the intensity and timing of competing wavefronts.",
    hemodynamicImpact: {
      cardiacOutput: "absent",
      cardiacOutputRationale: "Zero cardiac output — ventricular fibrillation produces no effective myocardial contraction.",
      bloodPressureEffect: "severely_hypotensive",
      perfusionStatus: "Zero perfusion — brain death begins within 4–6 minutes without CPR.",
      expectedSymptoms: [
        "Sudden collapse",
        "Loss of consciousness within seconds",
        "Absent pulse",
        "Absent respirations (agonal breathing may be present initially)",
        "Death within minutes without treatment",
      ],
      hemodynamicallyStagable: false,
    },
    clinicalPresentation: {
      stable: [],
      unstable: ["There is no stable VF — by definition it is cardiac arrest"],
      redFlags: ["VF is always a code blue"],
      emergencyTriggers: ["VF = CODE BLUE. No other category applies."],
    },
    escalation: {
      defaultLevel: "code_blue",
      monitoringFrequency: "Not applicable — resuscitation is in progress",
      immediateAssessments: [
        "Call code blue IMMEDIATELY",
        "Start CPR — high quality, push hard and fast (5–6 cm depth, 100–120/min)",
        "Charge defibrillator: 200J biphasic (unsynchronised)",
        "Defibrillate as soon as defibrillator is charged",
        "Immediately resume CPR after shock (2 minutes before rhythm check)",
        "IV/IO access for epinephrine 1mg q3–5min",
        "Amiodarone 300mg IV after 3rd shock",
      ],
      notifyProviderWhen: ["Code team is already called — notification is concurrent with resuscitation"],
      rapidResponseWhen: ["Code blue replaces rapid response for VF"],
      codeBlueWhen: ["ALWAYS for VF"],
      interventionContraindications: [
        "Do NOT synchronise the defibrillator for VF (no QRS to synchronise to) — use UNSYNCHRONISED",
        "Do NOT delay CPR while setting up defibrillator — CPR begins immediately",
        "Do NOT pause CPR for rhythm check more than 10 seconds",
        "Do NOT give atropine for VF — not in current ACLS guidelines",
      ],
    },
    examTraps: {
      nclex: [
        "VF requires UNSYNCHRONISED defibrillation — if you synchronise, the machine cannot trigger",
        "CPR starts BEFORE defibrillation if the defibrillator is not immediately available",
        "After defibrillation: immediately resume CPR — do NOT pause for pulse check",
        "Fine VF must be distinguished from asystole — check in 2 leads and adjust gain before treating as asystole",
        "Amiodarone 300mg IV after the 3rd shock (not the 1st or 2nd)",
      ],
      interventionTraps: [
        "SHOCK → CPR (2 min) → rhythm check → SHOCK if indicated → repeat",
        "Epinephrine 1mg IV/IO as soon as access established; repeat every 3–5 minutes",
        "Do NOT stop to confirm pulse between CPR cycles unless rhythm has changed to organised rhythm",
      ],
      telemetry: [
        "Verify VF in 2 leads and assess for artefact: ask if patient is moving, check lead connections",
        "Fine/low-amplitude VF may look like asystole — DO NOT give atropine; attempt defibrillation",
      ],
    },
    professionViews: {
      rn: {
        focus: "Call code blue, start CPR, defibrillate as soon as the machine is charged.",
        priorities: [
          "Call code: 'Code blue, (location)'",
          "Start CPR immediately",
          "Attach defibrillator",
          "Charge to 200J (biphasic) — defibrillate",
          "Resume CPR immediately after shock",
        ],
        keyActions: [
          "Delegate: one person CPR, one person airway/bag-valve-mask, one person defibrillator, one person IV access",
          "Epinephrine 1mg IV q3-5 min after IV access",
          "Amiodarone 300mg IV after 3rd shock",
          "Document rhythm, interventions, and times throughout",
        ],
        examFocus: "NCLEX VF: unsynchronised defibrillation first, CPR between shocks, epinephrine q3-5min.",
      },
      rpn: {
        focus: "Call code blue, start CPR, bring the crash cart.",
        priorities: ["Call code NOW", "Start CPR", "Bring defibrillator"],
        keyActions: ["Maintain CPR until code team arrives", "Switch compressor every 2 minutes to reduce fatigue"],
      },
      np: {
        focus: "Lead the ACLS algorithm, manage medications, identify reversible causes (Hs and Ts).",
        priorities: [
          "ACLS VF algorithm: CPR → shock → CPR → shock → epinephrine → shock → amiodarone",
          "Identify reversible causes: Hypovolaemia, Hypoxia, H⁺ (acidosis), Hypo/hyperkalaemia, Hypothermia, Tension pneumothorax, Tamponade, Thrombosis (PE/MI)",
          "Post-ROSC care: targeted temperature management, 12-lead ECG, cath lab if MI suspected",
        ],
        keyActions: [
          "Manage vasopressors post-ROSC",
          "Immediate PCI if STEMI identified post-resuscitation",
          "ICU admission for post-cardiac arrest care",
        ],
        examFocus: "NP boards: ACLS algorithm, post-ROSC care bundle, Hs and Ts, targeted temperature management.",
      },
      rt: {
        focus: "Airway and ventilation management during cardiac arrest.",
        priorities: ["Bag-valve-mask ventilation 1 breath per 6 seconds (with advanced airway)", "Intubation during ongoing CPR if trained"],
        keyActions: ["Maintain 30:2 ratio pre-intubation", "Post-intubation: 1 breath every 6 seconds asynchronously from compressions"],
      },
      newGrad: {
        focus: "Call CODE BLUE immediately. Start CPR. Attach the defibrillator. You have learned this — trust your training.",
        priorities: ["Call the code", "Start chest compressions", "Do not delay for any reason"],
        keyActions: [
          "Push hard (5–6cm), push fast (100–120/min), allow full recoil",
          "Yell for someone else to get the crash cart if you are alone",
          "When defibrillator arrives: apply pads, charge, shock, immediately resume CPR",
        ],
        examFocus: "VF = code blue + defibrillation. Unsynchronised. CPR before and after shock. Never synchronise for VF.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "torsades_de_pointes",
        compareWithName: "Torsades de Pointes",
        keyDifferences: [
          { feature: "Morphology", thisRhythm: "Completely chaotic, varying amplitude", otherRhythm: "Twisting polymorphic VT — amplitude cycles around baseline" },
          { feature: "May be self-terminating", thisRhythm: "No — always arrest", otherRhythm: "Yes — can spontaneously convert (but recurs)" },
          { feature: "Specific treatment", thisRhythm: "Defibrillate — no specific antidote", otherRhythm: "Magnesium 2g IV, stop QT-prolonging drugs" },
          { feature: "If pulseless", thisRhythm: "Defibrillate", otherRhythm: "Defibrillate (same as VF)" },
        ],
        clinicalImplication: "If pulseless, both are treated with defibrillation. But torsades has a specific cause (long QT) and specific treatment (magnesium). VF may not.",
      },
      {
        compareWithRhythmKey: "asystole",
        compareWithName: "Asystole",
        keyDifferences: [
          { feature: "Waveform", thisRhythm: "Chaotic, varying amplitude", otherRhythm: "Near-flat line" },
          { feature: "Treatment", thisRhythm: "DEFIBRILLATE + CPR", otherRhythm: "CPR + epinephrine only — NO shock" },
          { feature: "Prognosis", thisRhythm: "Better (shockable)", otherRhythm: "Worse (non-shockable)" },
          { feature: "Confusion risk", thisRhythm: "Fine VF may look like asystole", otherRhythm: "Asystole should never be shocked" },
        ],
        clinicalImplication: "Shocking asystole is ineffective and may prevent conversion to a shockable rhythm. Verify in 2 leads before treating as asystole.",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "emergency",
        title: "VF During 12-Lead ECG Acquisition",
        clinicalContext: "Patient having chest pain workup. Technician is running a 12-lead ECG. Monitor suddenly shows chaotic waveform.",
        patientPresentation: "Patient is unresponsive. No pulse palpable. Monitor shows coarse VF.",
        keyDecisionPoint: "No defibrillator immediately at bedside — crash cart is 30 seconds away. What happens first?",
        learnerObjective: "Initiate CPR immediately; do not delay for defibrillator; call code blue; defibrillate as soon as available; resume CPR immediately after shock.",
      },
    ],
  },

  // ── PEA ──────────────────────────────────────────────────────────────────────
  {
    rhythmKey: "pea",
    rhythmName: "Pulseless Electrical Activity (PEA)",
    recognition: {
      rate: "Variable — organised electrical activity at various rates",
      regularity: "Variable",
      pWaves: "Variable — may appear as any organised rhythm",
      prInterval: "Variable",
      qrsWidth: "Variable — may be narrow or wide",
      keyFeatures: [
        "ORGANISED electrical activity on the monitor",
        "NO pulse — the defining clinical feature",
        "Can mimic any rhythm: sinus, wide complex, narrow complex",
        "Diagnosis requires CLINICAL CONFIRMATION of pulselessness — NOT a rhythm diagnosis alone",
      ],
      pearls: [
        "PEA is a CLINICAL diagnosis — the rhythm alone never tells you it is PEA. You must confirm no pulse",
        "The most critical teaching: assume PEA has a reversible cause — always look for the Hs and Ts",
        "Most common causes: massive PE, tension pneumothorax, cardiac tamponade, severe hypovolaemia",
        "Narrow QRS PEA = usually obstructive or hypovolaemic — better prognosis",
        "Wide QRS PEA = usually from severe MI, acidosis, or hyperkalaemia — worse prognosis",
      ],
    },
    mechanism:
      "The heart's electrical system generates impulses that produce visible complexes on the monitor, but the mechanical contraction is insufficient to generate a palpable pulse. Causes are classified as the Hs and Ts: Hypovolaemia, Hypoxia, H⁺ (acidosis), Hypo/Hyperkalaemia, Hypothermia, Tension pneumothorax, Tamponade (cardiac), Toxins, Thrombosis (pulmonary), Thrombosis (coronary).",
    conductionPath:
      "Electrical conduction may be intact or partially intact — the failure is mechanical. The myocardium receives the electrical signal but cannot generate effective contraction (either due to obstruction of filling, severe acidosis, severe hypoxia, or severe electrolyte disturbance).",
    whyStripLooksThisWay:
      "The monitor shows organised electrical activity because the conduction system is generating impulses. The lack of pulse is a mechanical (not electrical) failure. This makes PEA one of the most deceptive rhythms in emergency care — the monitor appears to show a viable rhythm when the patient is in cardiac arrest.",
    hemodynamicImpact: {
      cardiacOutput: "absent",
      cardiacOutputRationale: "Zero effective cardiac output despite organised electrical activity. Cardiac arrest is present.",
      bloodPressureEffect: "severely_hypotensive",
      perfusionStatus: "Zero — cardiac arrest. Brain death begins within 4–6 minutes without CPR.",
      expectedSymptoms: ["Cardiac arrest", "Unresponsiveness", "Absent pulse", "Absent spontaneous respirations"],
      hemodynamicallyStagable: false,
    },
    clinicalPresentation: {
      stable: [],
      unstable: ["PEA IS CARDIAC ARREST — there is no stable presentation"],
      redFlags: ["Any patient with organised electrical activity and no pulse — call code blue"],
      emergencyTriggers: ["PEA = code blue"],
    },
    escalation: {
      defaultLevel: "code_blue",
      monitoringFrequency: "Not applicable — resuscitation in progress",
      immediateAssessments: [
        "CONFIRM PULSELESSNESS — check carotid or femoral pulse (max 10 seconds)",
        "Call code blue",
        "Start high-quality CPR IMMEDIATELY",
        "IV/IO access — epinephrine 1mg q3-5 min",
        "SIMULTANEOUSLY identify and treat reversible cause",
        "Hs: Hypovolaemia (bolus fluids), Hypoxia (100% O2, intubate), H⁺/acidosis (bicarb if indicated), Hyperkalaemia (calcium chloride), Hypothermia (warming)",
        "Ts: Tension pneumothorax (needle decompression), Tamponade (pericardiocentesis), Toxins (specific antidote), Thrombosis PE (thrombolytics), Thrombosis MI (cath lab)",
      ],
      notifyProviderWhen: ["Code team activation is concurrent with CPR"],
      rapidResponseWhen: [],
      codeBlueWhen: ["ALWAYS for PEA"],
      interventionContraindications: [
        "Do NOT defibrillate PEA — it is a non-shockable rhythm",
        "Do NOT stop CPR to administer medications through a peripheral IV — do not interrupt compressions",
        "Do NOT overlook treatable causes — PEA mortality is much higher without cause identification",
      ],
    },
    examTraps: {
      nclex: [
        "PEA is NON-SHOCKABLE — never defibrillate PEA",
        "The monitor may look 'fine' — always check the PULSE, not just the rhythm",
        "Epinephrine is given for PEA — not defibrillation",
        "Finding the reversible cause is the key to survival — CPR alone is not sufficient",
        "Tension pneumothorax PEA: needle decompression (2nd intercostal space, mid-clavicular line) saves lives",
      ],
      interventionTraps: [
        "IV fluid bolus for PEA from suspected hypovolaemia (haemorrhage, PE) — rapidly administered",
        "Calcium chloride for hyperkalaemia-induced PEA",
        "Sodium bicarbonate for documented severe acidosis causing PEA",
      ],
      telemetry: [
        "Organised rhythm + unresponsive patient = PEA until confirmed otherwise — check pulse before reassuring yourself",
        "Post-ROSC: PEA from tension pneumothorax resolves immediately after needle decompression",
      ],
    },
    professionViews: {
      rn: {
        focus: "PEA looks alive on the monitor but the patient is not — CPR + find the cause.",
        priorities: [
          "Confirm no pulse before calling code (10 seconds max)",
          "CPR immediately",
          "Epinephrine q3-5 min",
          "Actively communicate suspected cause to team",
        ],
        keyActions: [
          "Call code blue",
          "CPR",
          "IV access × 2",
          "Epinephrine 1mg IV q3-5 min",
          "Consider: is there a tension pneumo? Tamponade? Massive PE? Hypovolaemia?",
          "Prepare specific interventions: needle decompression kit, pericardiocentesis kit",
        ],
        examFocus: "NCLEX: PEA = CPR + epinephrine + find the Hs and Ts. Non-shockable — never defibrillate.",
      },
      rpn: {
        focus: "Organised rhythm but no pulse: call code, start CPR, escalate immediately.",
        priorities: ["Check pulse", "Call code", "CPR"],
        keyActions: ["Maintain CPR until code team arrives", "Assist with IV access"],
      },
      np: {
        focus: "Rapid systematic Hs and Ts workup while resuscitation is ongoing.",
        priorities: [
          "Clinically assess for most likely cause",
          "Bedside ultrasound (POCUS) if available: cardiac wall motion, pericardial effusion, lung sliding (rule out pneumo), IVC size (hypovolaemia)",
          "Immediate intervention for identified cause",
        ],
        keyActions: [
          "POCUS during CPR pause for rhythm check",
          "Needle decompression for tension pneumo — do not wait for imaging",
          "Pericardiocentesis for tamponade",
          "Thrombolytics for massive PE if CPR ongoing",
          "Massive transfusion protocol for haemorrhage",
        ],
        examFocus: "NP boards: POCUS in PEA, H&T identification, targeted intervention for each cause.",
      },
      rt: {
        focus: "Airway management is the RT's critical contribution — high-quality oxygenation may reverse hypoxic PEA.",
        priorities: ["100% O2 immediately", "Advanced airway if available", "Post-intubation: 1 breath/6s asynchronous"],
        keyActions: ["Bag-valve-mask 100% O2", "Intubation during CPR", "Confirm bilateral breath sounds — listen for tension pneumo"],
      },
      newGrad: {
        focus: "The monitor looks OK but the patient is unresponsive — always check the pulse. PEA is the most deceptive rhythm in nursing.",
        priorities: ["Check pulse NOW", "Call code blue", "Start CPR"],
        keyActions: [
          "Do not be reassured by the monitor — your hands on the patient tell the truth",
          "Call code blue and start compressions",
          "Let the charge nurse and code team manage medications",
        ],
        examFocus: "PEA = organised rhythm + no pulse = non-shockable = CPR + epinephrine + find the cause.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "asystole",
        compareWithName: "Asystole",
        keyDifferences: [
          { feature: "Monitor appearance", thisRhythm: "Organised rhythm — can look like any rhythm", otherRhythm: "Near-flat line — no electrical activity" },
          { feature: "Treatment", thisRhythm: "CPR + epinephrine + treat reversible cause", otherRhythm: "CPR + epinephrine — reversible cause less common" },
          { feature: "Prognosis", thisRhythm: "Better if reversible cause identified and treated", otherRhythm: "Generally worse (no electrical activity at all)" },
          { feature: "Defibrillation", thisRhythm: "NO — non-shockable", otherRhythm: "NO — non-shockable" },
        ],
        clinicalImplication: "Both are cardiac arrest without a shockable rhythm. PEA has better survival because reversible causes are often treatable. Asystole has the worst prognosis of all arrest rhythms.",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "emergency",
        title: "PEA Post-Op: Tension Pneumothorax",
        clinicalContext: "2 hours post right-sided thoracoscopy. Patient becomes unresponsive. Monitor shows sinus rhythm at 95 BPM.",
        patientPresentation: "No pulse. CPR in progress. Trachea shifted to left. Absent right-sided breath sounds. JVD present.",
        keyDecisionPoint: "What reversible cause is this? What intervention do you perform immediately?",
        learnerObjective: "Identify tension pneumothorax causing PEA; perform or prepare for needle decompression at 2nd intercostal space, MCL right side; confirm resolution with improved breath sounds and return of pulse.",
      },
    ],
  },

  // ── Asystole ─────────────────────────────────────────────────────────────────
  {
    rhythmKey: "asystole",
    rhythmName: "Asystole",
    recognition: {
      rate: "Zero — no electrical activity",
      regularity: "Absent",
      pWaves: "Absent — or occasional isolated P-waves (P-wave asystole: SA node firing, AV node not conducting)",
      prInterval: "Not measurable",
      qrsWidth: "No QRS complexes",
      keyFeatures: [
        "Near-flat baseline — no organised or disorganised electrical activity",
        "No QRS complexes",
        "Possible isolated P-waves in early asystole",
        "Confirms cardiac arrest when combined with no pulse",
      ],
      pearls: [
        "CONFIRM IN TWO LEADS before calling asystole — a loose lead can mimic asystole",
        "Increase ECG gain on the monitor before confirming — fine VF may look flat",
        "P-wave asystole (occasional P-waves, no QRS) — atropine may be attempted; pacing has low success",
        "Asystole has the WORST prognosis of all cardiac arrest rhythms",
        "Do NOT defibrillate asystole — it will not help and may prevent conversion to a shockable rhythm",
      ],
    },
    mechanism:
      "Complete failure of cardiac electrical activity — neither the SA node, AV node, nor ventricular escape pacemakers generate impulses sufficient to produce QRS complexes. This represents the terminal state of cardiac electrical failure, typically following prolonged ischaemia, irreversible damage, or following degenerating VF that was not defibrillated in time.",
    conductionPath: "No functional conduction — no pacemaker activity generating QRS complexes.",
    whyStripLooksThisWay:
      "The near-flat line reflects absent ventricular electrical activity. The tiny baseline wander reflects electrical noise and respiration artefact only. The absence of any identifiable waveform confirms no ventricular depolarisation is occurring.",
    hemodynamicImpact: {
      cardiacOutput: "absent",
      cardiacOutputRationale: "No electrical activity, no mechanical contraction, zero cardiac output.",
      bloodPressureEffect: "severely_hypotensive",
      perfusionStatus: "Zero — cardiac arrest.",
      expectedSymptoms: ["Cardiac arrest", "Unresponsive", "No pulse", "No respirations"],
      hemodynamicallyStagable: false,
    },
    clinicalPresentation: {
      stable: [],
      unstable: ["Asystole = cardiac arrest — there is no other category"],
      redFlags: ["Asystole = code blue — no exceptions"],
      emergencyTriggers: ["ALWAYS code blue"],
    },
    escalation: {
      defaultLevel: "code_blue",
      monitoringFrequency: "Not applicable",
      immediateAssessments: [
        "CONFIRM IN 2 LEADS — rule out loose lead, artefact, or fine VF",
        "Increase monitor gain to rule out fine VF",
        "Confirm no pulse (max 10 seconds)",
        "Call code blue",
        "High-quality CPR immediately",
        "Epinephrine 1mg IV/IO q3-5 min",
        "Identify and treat reversible causes (Hs and Ts)",
        "Verify: is this asystole or fine VF? If any doubt — shock once",
      ],
      notifyProviderWhen: ["Code team activation concurrent with CPR"],
      rapidResponseWhen: [],
      codeBlueWhen: ["ALWAYS"],
      interventionContraindications: [
        "Do NOT defibrillate confirmed asystole",
        "Atropine is no longer recommended in current ACLS guidelines for asystole (removed 2010)",
        "Do NOT delay CPR for any reason",
      ],
    },
    examTraps: {
      nclex: [
        "Asystole is NON-SHOCKABLE — do not defibrillate",
        "Atropine is NOT recommended for asystole in current ACLS (this has changed since older guidelines)",
        "Confirm in 2 leads before calling asystole — check gain, check leads",
        "Epinephrine is the only medication with an ACLS evidence base for asystole",
        "Asystole has the worst prognosis — this context affects family communication and end-of-life discussions",
      ],
      telemetry: [
        "Flat line on ONE lead = check your lead connection first before calling a code",
        "Increase gain to look for fine VF hidden in what appears flat",
        "If doubt: one shock — if it's fine VF, defibrillation helps; if it's asystole, no harm done",
      ],
    },
    professionViews: {
      rn: {
        focus: "Confirm in 2 leads, check gain, call code, CPR, epinephrine — no shocks.",
        priorities: ["Confirm asystole (not fine VF, not loose lead)", "CPR immediately", "Epinephrine q3-5 min"],
        keyActions: [
          "Check 2 leads + increase gain",
          "Call code blue",
          "CPR immediately",
          "IV access → epinephrine 1mg q3-5 min",
          "Identify Hs and Ts",
          "Document resuscitation timeline",
        ],
        examFocus: "Asystole: CPR + epinephrine. NO shock. Confirm in 2 leads. Atropine no longer ACLS standard.",
      },
      rpn: {
        focus: "Flat line: call code, start CPR, bring the crash cart.",
        priorities: ["Call code blue", "Begin CPR", "Bring crash cart"],
        keyActions: ["Maintain CPR quality until code team arrives"],
      },
      np: {
        focus: "Lead the team, verify the rhythm, manage medications, guide family communication.",
        priorities: [
          "Confirm asystole (rule out artefact)",
          "ACLS algorithm: CPR + epinephrine",
          "Hs and Ts workup during CPR",
          "Guide end-of-life decision if prolonged arrest with no reversible cause",
        ],
        keyActions: [
          "Epinephrine 1mg IV q3-5 min",
          "No atropine",
          "Family communication during prolonged resuscitation",
          "Consider termination of resuscitation criteria if no reversible cause and prolonged downtime",
        ],
        examFocus: "NP boards: asystole prognosis, ACLS updates (atropine removed), termination of resuscitation decision-making.",
      },
      rt: {
        focus: "Airway management and quality ventilation during asystole resuscitation.",
        priorities: ["Advanced airway", "Continuous ventilation during CPR"],
        keyActions: ["Intubate and ventilate", "Confirm bilateral breath sounds", "Capnography during CPR — ETCO2 rise signals ROSC"],
      },
      newGrad: {
        focus: "Flat line: check your leads, look in two leads, confirm with the gain up. If still flat — call code and start CPR.",
        priorities: ["Check the patient first (pulse)", "Check leads and gain", "Call code blue and start CPR"],
        keyActions: ["CPR immediately", "Call for help", "Do not defibrillate — asystole does not get shocked"],
        examFocus: "Asystole: no shock. Check two leads first. CPR + epinephrine.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "ventricular_fibrillation",
        compareWithName: "Ventricular Fibrillation",
        keyDifferences: [
          { feature: "Waveform", thisRhythm: "Near-flat — no activity", otherRhythm: "Chaotic — varying amplitude" },
          { feature: "Treatment", thisRhythm: "CPR + epinephrine — NO shock", otherRhythm: "Defibrillate + CPR" },
          { feature: "Prognosis", thisRhythm: "Worst of all arrest rhythms", otherRhythm: "Better — shockable rhythm" },
          { feature: "Confusion point", thisRhythm: "Fine VF may look like asystole — verify in 2 leads", otherRhythm: "Loose lead may look like VF" },
        ],
        clinicalImplication: "Shocking asystole will not help and may suppress spontaneous electrical activity. If in doubt between fine VF and asystole — defibrillate once (low risk of harm).",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "emergency",
        title: "Telemetry Alarm — Flat Line: Real or Lead Artefact?",
        clinicalContext: "Telemetry alarm at 0230. Monitor shows flat line for 12 seconds.",
        patientPresentation: "You arrive at bedside. Patient appears asleep.",
        keyDecisionPoint: "Is this asystole or a lead artefact? What do you do first?",
        learnerObjective: "Assess patient responsiveness before calling a code; if unresponsive → check pulse; if pulse absent → code blue. If responsive → check leads. Demonstrates why pulse check precedes rhythm interpretation.",
      },
    ],
  },

];
