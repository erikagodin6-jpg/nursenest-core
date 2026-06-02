/**
 * ECG Clinical Reasoning Units — Part 4
 * STEMI, NSTEMI, Hyperkalemia, Hypokalemia, Pacemaker Rhythm, Torsades de Pointes
 */

import type { EcgClinicalReasoningUnit } from "./ecg-clinical-reasoning";

export const ECG_CLINICAL_REASONING_UNITS_PART4: EcgClinicalReasoningUnit[] = [

  // ── STEMI ──────────────────────────────────────────────────────────────────
  {
    rhythmKey: "stemi_pattern",
    rhythmName: "STEMI Pattern",
    recognition: {
      rate: "50–130 BPM (varies with sympathetic activation)",
      regularity: "Regular",
      pWaves: "Present and normal",
      prInterval: "Normal",
      qrsWidth: "Narrow (unless concomitant BBB)",
      stSegment: "ST ELEVATION ≥ 1mm in ≥ 2 contiguous leads; reciprocal ST depression in opposite leads",
      keyFeatures: [
        "ST elevation ≥ 1mm in ≥ 2 contiguous leads",
        "Smooth J-point takeoff with curved ST plateau",
        "Reciprocal ST depression in opposing leads",
        "Evolving Q-waves (sign of myocardial necrosis — may appear within hours)",
        "Hyperacute T-waves (very early, peaked — may precede ST elevation)",
      ],
      pearls: [
        "TIME IS MUSCLE — every 30 minutes of delay = 10% more myocardial loss",
        "Door-to-balloon time goal: ≤ 90 minutes",
        "Lead groups identify infarct territory: II, III, aVF = inferior (RCA); I, aVL, V1-V4 = anterior/lateral (LAD); V1-V4 = anterior (LAD septal); I, aVL, V5-V6 = lateral (LCx)",
        "Right-sided leads (V4R) for right ventricular MI in inferior STEMI — CRITICAL: nitrates are contraindicated in RV MI",
        "Posterior STEMI: ST depression in V1-V3 with tall R waves — apply V7-V9 leads for confirmation",
      ],
    },
    mechanism:
      "Complete occlusion of a coronary artery causes transmural (full-thickness) myocardial ischaemia. The current-of-injury from the ischaemic zone elevates the ST segment above the isoelectric line. As ischaemia progresses to infarction (necrosis), Q-waves develop from the electrical silence of dead myocardium. Reciprocal ST depression in opposite leads reflects the same current-of-injury viewed from a different electrode angle.",
    conductionPath:
      "Coronary occlusion → transmural ischaemia → abnormal repolarisation → J-point elevation → curved ST elevation. Reciprocal depression in mirror leads.",
    whyStripLooksThisWay:
      "The smooth elevation from the J-point reflects the current of injury — the ischaemic cells maintain a higher-than-normal resting potential relative to normal cells, raising the baseline in those leads. T-wave is often tall and upright in early STEMI (hyperacute) as repolarisation is prolonged. Reciprocal depression is the mirror image viewed from the opposite wall.",
    hemodynamicImpact: {
      cardiacOutput: "moderately_reduced",
      cardiacOutputRationale:
        "Extent depends on the territory involved. LAD STEMI (anterior) may compromise 40–50% of LV mass — severe CO reduction. RCA inferior STEMI may be better tolerated unless RV is involved. Large LV infarcts cause cardiogenic shock.",
      bloodPressureEffect: "variable",
      perfusionStatus:
        "Highly variable — from stable anginal equivalent to cardiogenic shock depending on infarct size, vessel, and collateral circulation.",
      expectedSymptoms: [
        "Chest pain: severe, crushing, pressure, radiating to jaw, left arm, back (often, but atypical presentations are common)",
        "Diaphoresis",
        "Nausea and vomiting",
        "Dyspnoea",
        "Palpitations (from arrhythmias)",
        "Atypical: women, diabetics, elderly may present with fatigue, dyspnoea, or jaw pain WITHOUT chest pain",
      ],
      hemodynamicallyStagable: true,
    },
    clinicalPresentation: {
      stable: [
        "Chest pain but maintained BP and SpO2",
        "Killip Class I (no heart failure signs)",
        "Alert and haemodynamically compensated",
      ],
      unstable: [
        "Hypotension (cardiogenic shock: SBP < 90 despite adequate preload)",
        "Acute pulmonary oedema",
        "Severe arrhythmias (VT/VF from ischaemia)",
        "Altered consciousness from low CO",
      ],
      redFlags: [
        "STE in ≥ 2 contiguous leads = STEMI — activate cath lab NOW",
        "Any chest pain with new LBBB",
        "Inferior STEMI + hypotension (RV MI)",
        "Anterior STEMI with VT (reperfusion arrhythmia or ischaemic)",
        "STEMI + cardiogenic shock",
      ],
      emergencyTriggers: [
        "STEMI identification → immediate STEMI protocol activation (door-to-balloon ≤ 90 min)",
        "STEMI + cardiogenic shock → highest urgency",
        "STEMI + VF → immediate defibrillation",
      ],
    },
    escalation: {
      defaultLevel: "code_blue",
      monitoringFrequency: "Continuous with 12-lead ECG serial every 30 min or after symptoms change",
      immediateAssessments: [
        "12-lead ECG within 10 minutes of symptom onset or first medical contact",
        "Identify affected territory (leads) and vessel",
        "Right-sided leads (V4R) if inferior STEMI",
        "Vital signs including SpO2",
        "Assess for cardiogenic shock, heart failure, arrhythmias",
      ],
      notifyProviderWhen: ["STEMI identified — simultaneous notification and STEMI protocol activation"],
      rapidResponseWhen: ["STEMI with haemodynamic compromise"],
      codeBlueWhen: ["STEMI with cardiac arrest", "VF complicating STEMI"],
      interventionContraindications: [
        "Do NOT give nitrates to inferior STEMI with suspected RV involvement (causes catastrophic hypotension)",
        "Do NOT delay reperfusion for additional diagnostic workup",
        "Do NOT give NSAIDs or COX-2 inhibitors in acute MI",
        "Do NOT give thrombolytics if PCI is available within 120 minutes",
      ],
    },
    examTraps: {
      nclex: [
        "STEMI DOES NOT REQUIRE A POSITIVE TROPONIN TO TREAT — treat on the ECG findings",
        "Inferior STEMI + hypotension = RV MI — nitrates are contraindicated",
        "New LBBB + chest pain = STEMI equivalent — activate the protocol",
        "The immediate nursing priority is aspirin + IV access + ECG + notify provider — NOT pain management first",
        "Door-to-balloon goal is ≤ 90 minutes — every question about STEMI priority is about TIME",
      ],
      interventionTraps: [
        "Morphine in STEMI: previously recommended but now associated with worse outcomes in ACS — use fentanyl if opioid needed",
        "Do NOT delay STEMI protocol while waiting for lab results or additional imaging",
        "Right-sided ECG must be obtained BEFORE giving nitrates to inferior MI patients",
      ],
      telemetry: [
        "Hyperacute T-waves (tall, peaked) in precordial leads may be the EARLIEST sign of STEMI — before ST elevation appears",
        "T-wave inversions in the same leads hours later = evolving MI with reperfusion or infarct completion",
      ],
    },
    professionViews: {
      rn: {
        focus: "STEMI is a time-critical emergency — activate the protocol simultaneously with patient assessment.",
        priorities: [
          "12-lead ECG within 10 minutes",
          "Activate STEMI alert — do not wait for physician confirmation before calling",
          "IV access × 2 large bore",
          "Aspirin 162–325mg PO (unless allergy)",
          "Monitor for arrhythmias",
        ],
        keyActions: [
          "12-lead ECG → call STEMI alert",
          "Aspirin immediately",
          "IV access, continuous monitoring, SpO2",
          "Right-sided ECG for inferior STEMI",
          "Assess for nitrate contraindications (RV MI, PDE5 inhibitors in last 24–48h)",
          "Prepare for cath lab transfer",
        ],
        examFocus: "NCLEX STEMI: ECG → aspirin → IV → notify → cath lab. Never delay for labs. Never nitrates in RV MI.",
      },
      rpn: {
        focus: "Recognise ST elevation, escalate to RN immediately — time is critical.",
        priorities: ["Identify ST elevation on monitor", "Escalate to RN and provider immediately", "Stay with patient"],
        keyActions: ["Call RN NOW", "Do not leave patient", "Assist with IV access"],
      },
      np: {
        focus: "Confirm STEMI, determine territory, activate reperfusion pathway, manage complications.",
        priorities: [
          "Confirm STEMI on 12-lead: STE ≥ 1mm in ≥ 2 contiguous leads",
          "Identify territory and vessel",
          "Activate cath lab (primary PCI preferred if < 120 min)",
          "Antiplatelet dual therapy: aspirin + P2Y12 (ticagrelor, prasugrel, or clopidogrel)",
          "Anticoagulation: UFH or bivalirudin",
          "Manage complications: arrhythmias, HF, cardiogenic shock",
        ],
        keyActions: [
          "STEMI protocol activation",
          "P2Y12 inhibitor loading dose",
          "Anticoagulation per protocol",
          "Manage RV MI: fluids (not nitrates), early reperfusion",
          "Consider GP IIb/IIIa inhibitor for complex cases",
        ],
        examFocus: "NP boards: primary PCI vs thrombolysis criteria, antiplatelet therapy selection, RV MI management.",
      },
      rt: {
        focus: "Supplemental oxygen only if SpO2 < 90% — hyperoxia may be harmful in STEMI.",
        priorities: ["SpO2 monitoring", "Supplemental O2 ONLY if SpO2 < 90%"],
        keyActions: ["Notify team of SpO2 drops", "Support oxygenation if pulmonary oedema develops", "Prepare for possible intubation if cardiogenic shock"],
      },
      newGrad: {
        focus: "ST elevation = STEMI = emergency. Don't second-guess yourself — call it and escalate immediately.",
        priorities: ["Look for ST elevation in 2 or more leads that are next to each other (contiguous)", "Is it elevated above the flat baseline between QRS and T?"],
        keyActions: [
          "Call your charge nurse and provider IMMEDIATELY",
          "Do not wait for symptoms to worsen or for lab results",
          "Get IV access and aspirin ready to administer",
        ],
        examFocus: "ST elevation in ≥ 2 contiguous leads = STEMI. Aspirin first. No nitrates if inferior STEMI + hypotension.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "nstemi_pattern",
        compareWithName: "NSTEMI Pattern",
        keyDifferences: [
          { feature: "ST segment", thisRhythm: "ST ELEVATION ≥ 1mm in ≥ 2 leads", otherRhythm: "ST depression or T-wave inversion (no elevation)" },
          { feature: "Vessel occlusion", thisRhythm: "COMPLETE occlusion (culprit artery)", otherRhythm: "Partial occlusion or demand ischaemia" },
          { feature: "Transmurality", thisRhythm: "Transmural (full-thickness)", otherRhythm: "Subendocardial (inner layer)" },
          { feature: "Reperfusion urgency", thisRhythm: "Door-to-balloon ≤ 90 min", otherRhythm: "Risk stratification — may be < 24h or < 72h" },
          { feature: "Q-waves", thisRhythm: "Develop with full infarction", otherRhythm: "Usually absent (subendocardial)" },
        ],
        clinicalImplication: "STEMI has a fixed time window — the cath lab must be activated NOW. NSTEMI still requires urgent evaluation but the window is wider. Both require antiplatelet therapy and anticoagulation.",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "emergency",
        title: "Inferior STEMI + Hypotension: The Nitrate Trap",
        clinicalContext: "58-year-old with crushing chest pain. 12-lead shows ST elevation in II, III, aVF. BP 88/54.",
        patientPresentation: "Diaphoretic, pale. SpO2 94%. JVD present. Lung fields clear. Right-sided ECG shows V4R ST elevation.",
        keyDecisionPoint: "Team member suggests giving nitroglycerin for chest pain. What do you do?",
        learnerObjective: "Identify RV MI (inferior STEMI + hypotension + clear lungs + JVD + V4R elevation); recognise that nitrates are absolutely contraindicated; initiate IV fluid bolus; activate cath lab.",
      },
    ],
  },

  // ── NSTEMI ────────────────────────────────────────────────────────────────────
  {
    rhythmKey: "nstemi_pattern",
    rhythmName: "NSTEMI Pattern",
    recognition: {
      rate: "50–130 BPM",
      regularity: "Regular",
      pWaves: "Present and normal",
      prInterval: "Normal",
      qrsWidth: "Narrow (< 0.12s)",
      stSegment: "ST DEPRESSION ≥ 1mm in ≥ 2 contiguous leads; T-wave flattening or inversion; NO ST elevation",
      keyFeatures: [
        "Horizontal or downsloping ST depression ≥ 1mm in ≥ 2 contiguous leads",
        "T-wave flattening or inversion in ischaemic leads",
        "NO ST elevation in ischaemic territory",
        "Troponin elevation (usually required for diagnosis alongside symptoms)",
      ],
      pearls: [
        "NSTEMI = Subendocardial ischaemia — the inner third of the myocardium is ischaemic (no Q-waves expected)",
        "ECG may be NORMAL in 20–30% of NSTEMIs — troponin is the diagnostic anchor",
        "Diffuse ST depression in all leads except aVR (which shows elevation) = severe 3-vessel disease or left main occlusion",
        "NSTEMI in LBBB: standard criteria don't apply — use Sgarbossa criteria",
        "De Winter T-waves (upsloping ST depression with tall, symmetric T-waves in precordial leads) = LAD occlusion STEMI equivalent",
      ],
    },
    mechanism:
      "Partial coronary occlusion or a dynamic supply-demand mismatch causes subendocardial ischaemia (the inner layer of the myocardium is most vulnerable due to highest wall tension and least perfusion reserve). Unlike STEMI, the outer layers are not ischaemic, so ST does not elevate. Instead, the subendocardial current of injury produces ST depression and T-wave changes in the leads overlying the affected territory.",
    conductionPath:
      "Partially occluded coronary artery → subendocardial ischaemia → abnormal repolarisation in inner layers → ST depression in overlying leads.",
    whyStripLooksThisWay:
      "The J-point dips below the isoelectric line, reflecting subendocardial injury current. The ST depression may be horizontal (more specific for ischaemia) or downsloping. T-wave flattening reflects repolarisation abnormality. The depression is in the leads facing the ischaemic zone.",
    hemodynamicImpact: {
      cardiacOutput: "mildly_reduced",
      cardiacOutputRationale: "Degree of CO reduction depends on the extent of subendocardial ischaemia. Usually less severe than STEMI unless large territory or severe demand ischaemia with poor baseline function.",
      bloodPressureEffect: "variable",
      perfusionStatus: "Variable — ranges from minimal haemodynamic impact to significant compromise if large territory.",
      expectedSymptoms: [
        "Chest pain or pressure (may be less severe than STEMI)",
        "Dyspnoea",
        "Diaphoresis",
        "Nausea",
        "Fatigue (often the predominant symptom in women, elderly, diabetics)",
        "Silent — no symptoms in 20–30% (especially diabetics with autonomic neuropathy)",
      ],
      hemodynamicallyStagable: true,
    },
    clinicalPresentation: {
      stable: [
        "Chest discomfort, haemodynamically compensated",
        "Normal or mildly elevated troponin with mild ST changes",
        "TIMI or GRACE score low-to-intermediate risk",
      ],
      unstable: [
        "Recurrent chest pain at rest",
        "Haemodynamic compromise",
        "High GRACE/TIMI risk score",
        "ST depression > 2mm with ongoing pain",
      ],
      redFlags: [
        "ST depression at rest (not just with exertion)",
        "Elevated troponin with ST changes",
        "Ongoing pain despite nitrates",
        "Diffuse ST depression (possible left main or 3-vessel disease)",
        "De Winter T-wave pattern (LAD equivalent STEMI)",
      ],
      emergencyTriggers: [
        "Haemodynamic compromise with NSTEMI",
        "Ongoing ischaemia with elevated troponin and haemodynamic instability → urgent (< 2h) cath lab activation",
      ],
    },
    escalation: {
      defaultLevel: "notify_provider",
      monitoringFrequency: "Continuous with serial 12-lead ECGs every 30–60 minutes or with symptom change; serial troponins",
      immediateAssessments: [
        "12-lead ECG",
        "Serial troponins (0h, 1–3h depending on protocol)",
        "Vital signs and haemodynamic assessment",
        "Pain assessment with serial reassessment",
        "Risk stratification: TIMI or GRACE score",
        "Review medication list for QT-prolonging drugs",
      ],
      notifyProviderWhen: [
        "NSTEMI suspected (ST depression + symptoms)",
        "Troponin elevation",
        "Ongoing or recurrent chest pain despite initial treatment",
        "Haemodynamic change",
      ],
      rapidResponseWhen: [
        "NSTEMI with haemodynamic compromise",
        "Ongoing pain with progressive ST changes",
        "New VT/VF complicating NSTEMI",
      ],
      codeBlueWhen: ["Cardiac arrest from NSTEMI complications (VT/VF)"],
      interventionContraindications: [
        "Do NOT give NSAIDs or COX-2 inhibitors",
        "Do NOT use nitrates within 24–48h of PDE5 inhibitor use",
        "Do NOT delay troponin trending while managing pain",
        "Do NOT treat NSTEMI with the same door-to-balloon urgency as STEMI (unless very high risk: ongoing ischaemia + haemodynamic compromise)",
      ],
    },
    examTraps: {
      nclex: [
        "NSTEMI is confirmed by troponin + symptoms — the ECG change may be absent",
        "ST depression = subendocardial (NSTEMI); ST elevation = transmural (STEMI). Do not confuse them",
        "Serial troponins are mandatory — a single negative troponin does NOT rule out NSTEMI",
        "Aspirin + IV access + monitoring + provider notification = immediate nursing priorities for suspected NSTEMI",
      ],
      interventionTraps: [
        "Morphine: avoid — associated with worsening outcomes in ACS; fentanyl preferred if opioid needed",
        "Nitrates for NSTEMI: effective for pain relief unless contraindicated (PDE5 inhibitor use, hypotension)",
        "Anticoagulation (UFH or enoxaparin) is started for NSTEMI — not just antiplatelet therapy alone",
      ],
      telemetry: [
        "ST depression in recovery from exercise may be normal — context matters",
        "Tall symmetric precordial T-waves with upsloping ST depression = De Winter pattern = LAD STEMI equivalent",
        "Inverted T-waves without ST changes can represent Wellens syndrome (critical LAD stenosis) — report immediately",
      ],
    },
    professionViews: {
      rn: {
        focus: "ST depression + chest pain = potential NSTEMI — notify provider, start the ACS bundle, and monitor closely.",
        priorities: [
          "12-lead ECG with serial ECGs",
          "Serial troponins per protocol",
          "Aspirin 162–325mg PO",
          "IV access",
          "Continuous monitoring",
        ],
        keyActions: [
          "12-lead ECG and notify provider",
          "Aspirin (unless allergy)",
          "IV access and continuous monitoring",
          "Assess pain with NRS and reassess after nitrates",
          "Bed rest with comfort measures",
          "Serial troponins",
        ],
        examFocus: "NCLEX: NSTEMI vs STEMI — look at the ST direction. Depression = NSTEMI. Treatment: aspirin, IV access, monitoring, troponins.",
      },
      rpn: {
        focus: "Identify ST depression with symptoms, report to RN immediately.",
        priorities: ["Identify ST depression on monitor", "Assess patient for symptoms", "Escalate to RN"],
        keyActions: ["Notify RN immediately", "Obtain vital signs"],
      },
      np: {
        focus: "Risk stratify, initiate ACS bundle, determine timing of invasive strategy.",
        priorities: [
          "GRACE or TIMI score for risk stratification",
          "Dual antiplatelet therapy (aspirin + ticagrelor/clopidogrel)",
          "Anticoagulation (UFH or enoxaparin)",
          "Determine invasive strategy timing: very high risk < 2h, high risk < 24h, intermediate risk < 72h",
          "Beta-blocker if HR elevated and no cardiogenic shock",
        ],
        keyActions: [
          "Cardiology consultation for invasive strategy planning",
          "High-sensitivity troponin trending",
          "Echo for LV function assessment",
          "Statin therapy (high-intensity)",
        ],
        examFocus: "NP: NSTEMI risk stratification, timing of angiography, DAPT selection.",
      },
      rt: {
        focus: "Supplemental O2 only if SpO2 < 90%; monitor for acute decompensated heart failure as NSTEMI complication.",
        priorities: ["SpO2 monitoring", "Watch for pulmonary oedema from impaired LV function"],
        keyActions: ["Oxygenation support if needed", "Prepare for possible CPAP/BIPAP or intubation if acute HF develops"],
      },
      newGrad: {
        focus: "ST going DOWN + chest pain = NSTEMI territory. Call for help, get 12-lead, give aspirin, start IV.",
        priorities: ["Is the ST segment going below the flat baseline?", "Does the patient have chest pain or pressure?"],
        keyActions: [
          "Call your charge nurse",
          "12-lead ECG",
          "Aspirin 162mg (unless allergy — ask first)",
          "IV access",
        ],
        examFocus: "ST down = NSTEMI. ST up = STEMI. Both need urgent response. NSTEMI is not a 'lesser' emergency — troponins are needed.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "stemi_pattern",
        compareWithName: "STEMI Pattern",
        keyDifferences: [
          { feature: "ST segment", thisRhythm: "DEPRESSION (below baseline)", otherRhythm: "ELEVATION (above baseline)" },
          { feature: "Occlusion type", thisRhythm: "Partial — subendocardial", otherRhythm: "Complete — transmural" },
          { feature: "Time urgency", thisRhythm: "Hours (risk-stratified) — urgent but not 90-min goal", otherRhythm: "Minutes — door-to-balloon ≤ 90 min" },
          { feature: "Troponin timing", thisRhythm: "Serial troponins required for diagnosis", otherRhythm: "ECG diagnosis — treat without waiting for troponin" },
          { feature: "Q-waves", thisRhythm: "Usually absent", otherRhythm: "Develop with completed infarction" },
        ],
        clinicalImplication: "Both are life-threatening. STEMI is a time-seconds emergency. NSTEMI is a time-hours emergency. Neither should be dismissed. Misidentifying STEMI as NSTEMI (by calling elevation 'depression') costs lives.",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "diagnostic_challenge",
        title: "The Silent NSTEMI: Normal ECG, Rising Troponin",
        clinicalContext: "73-year-old diabetic woman presents with 12 hours of 'indigestion' and fatigue. Initial ECG: normal. SpO2 96%.",
        patientPresentation: "No chest pain. Troponin at 0h: 0.08 ng/mL (normal < 0.04). Repeat at 3h: 0.42 ng/mL.",
        keyDecisionPoint: "ECG is normal and patient denies chest pain. How do you proceed?",
        learnerObjective: "Recognise atypical NSTEMI presentation (elderly diabetic woman); identify rising troponin delta as NSTEMI criteria; initiate ACS bundle and cardiology notification despite absence of classic symptoms or ECG changes.",
      },
    ],
  },

  // ── Hyperkalemia ─────────────────────────────────────────────────────────────
  {
    rhythmKey: "hyperkalemia_pattern",
    rhythmName: "Hyperkalemia ECG Pattern",
    recognition: {
      rate: "40–120 BPM (bradycardia common with severe hyperkalemia)",
      regularity: "Regular (may become irregular with severe hyperkalemia)",
      pWaves: "Present early; then flattened/absent as K⁺ rises; then sine-wave pattern",
      prInterval: "Normal early; then prolonged; then unmeasurable (when P-wave disappears)",
      qrsWidth: "Widens progressively as K⁺ rises: < 0.12s early, > 0.12s in moderate–severe, sine-wave in severe",
      stSegment: "ST depression; T-wave changes are the dominant finding",
      keyFeatures: [
        "PEAKED, NARROW, SYMMETRIC T-waves (tent-shaped) — earliest sign",
        "Progressive QRS widening as K⁺ rises",
        "P-wave flattening and disappearance",
        "Sine-wave pattern (severe) = pre-VF emergency",
        "Changes are progressive with rising K⁺ levels",
      ],
      pearls: [
        "PROGRESSIVE ECG changes with K⁺: T-peak (K⁺ > 5.5) → P-flat/PR-long (K⁺ > 6.5) → QRS-wide (K⁺ > 7.0) → sine-wave (K⁺ > 8.0) → VF/asystole (K⁺ > 9.0)",
        "Peaked T-waves in precordial leads: narrow base + tall amplitude is classic hyperkalemia",
        "The sine-wave pattern is a cardiac emergency — K⁺ is critically elevated",
        "Calcium gluconate FIRST for cardiac symptoms — it stabilises the membrane without lowering K⁺",
        "Tall peaked T-waves can be confused with hyperacute T-waves of early STEMI — context and K⁺ level are key",
      ],
    },
    mechanism:
      "Elevated extracellular potassium reduces the resting membrane potential gradient (making it less negative), which decreases excitability but slows conduction. The early peaked T-wave reflects more rapid repolarisation (the T-wave becomes taller and narrower). As K⁺ rises further, depolarisation slows (widening QRS), the P-wave diminishes (sinoatrial block), and ultimately the distinction between depolarisation and repolarisation is lost (sine-wave), leading to VF.",
    conductionPath:
      "Elevated K⁺ → reduced membrane potential gradient → slower conduction velocity throughout → P-wave flattening → QRS widening → sine-wave → VF/asystole.",
    whyStripLooksThisWay:
      "Peaked narrow T-waves reflect faster uniform repolarisation. QRS widening reflects slower conduction through a partially depolarised conduction system. Loss of P-waves reflects SA node suppression or sinoatrial block. Sine-wave morphology represents fusion of widened QRS and T-wave as conduction becomes critically impaired.",
    hemodynamicImpact: {
      cardiacOutput: "variable",
      cardiacOutputRationale: "Mild hyperkalemia: minimal CO impact. Severe hyperkalemia: bradycardia + conduction disturbances → significantly reduced CO → haemodynamic compromise.",
      bloodPressureEffect: "variable",
      perfusionStatus: "Variable — deteriorates as ECG changes progress. Sine-wave = imminent cardiac arrest.",
      expectedSymptoms: [
        "Mild: asymptomatic or muscle weakness, paraesthesias",
        "Moderate: nausea, vomiting, weakness, palpitations",
        "Severe: ascending paralysis, dyspnoea, severe weakness, confusion",
        "Critical: cardiac arrest (VF or asystole)",
      ],
      hemodynamicallyStagable: true,
    },
    clinicalPresentation: {
      stable: ["Asymptomatic with K⁺ 5.5–6.5 mEq/L and minimal ECG changes"],
      unstable: [
        "Progressive muscle weakness with rising K⁺",
        "QRS widening + haemodynamic compromise",
        "Sine-wave pattern — imminent arrest",
      ],
      redFlags: [
        "K⁺ > 6.0 mEq/L with ANY ECG changes",
        "K⁺ > 7.0 mEq/L regardless of symptoms",
        "QRS widening > 0.12s",
        "Sine-wave morphology",
        "P-wave disappearance",
      ],
      emergencyTriggers: [
        "Sine-wave pattern → treat as pre-arrest emergency",
        "VF from hyperkalemia → ACLS + simultaneous K⁺ lowering",
      ],
    },
    escalation: {
      defaultLevel: "notify_provider",
      monitoringFrequency: "Continuous; serial K⁺ every 30–60 min during treatment",
      immediateAssessments: [
        "STAT K⁺ level and renal function (BUN/creatinine)",
        "12-lead ECG — identify current ECG stage",
        "Review medications: ACE inhibitors, ARBs, potassium-sparing diuretics, potassium supplements, digoxin",
        "Assess haemodynamic status",
        "Consider pseudohyperkalemia (haemolysed sample) if ECG doesn't match K⁺ level",
      ],
      notifyProviderWhen: [
        "K⁺ > 5.5 with ECG changes",
        "K⁺ > 6.0 regardless of ECG",
        "Any ECG progression toward QRS widening or sine-wave",
      ],
      rapidResponseWhen: [
        "K⁺ > 7.0 with cardiac symptoms",
        "QRS widening or sine-wave pattern",
        "Haemodynamic compromise",
      ],
      codeBlueWhen: [
        "VF or asystole from hyperkalemia",
        "Sine-wave with haemodynamic collapse",
      ],
      interventionContraindications: [
        "Do NOT give calcium chloride/gluconate peripherally via small IV (burns tissue) — use large bore or central line for calcium chloride",
        "Do NOT rely on dietary restriction alone for acute severe hyperkalemia",
        "Kayexalate (sodium polystyrene sulfonate) is for CHRONIC management — not acute stabilisation",
      ],
    },
    examTraps: {
      nclex: [
        "The FIRST and MOST IMPORTANT drug for cardiac manifestations of hyperkalemia is CALCIUM GLUCONATE — NOT insulin, NOT bicarb",
        "Calcium stabilises the cardiac membrane but does NOT lower the K⁺ level",
        "Insulin + dextrose shifts K⁺ INTO cells — temporary treatment",
        "Kayexalate is for chronic management — it is NOT given in an emergency",
        "Peaked T-waves + widening QRS is hyperkalemia until the K⁺ level is checked",
      ],
      interventionTraps: [
        "Treatment sequence: Calcium (cardiac stabilisation) → Insulin + dextrose (shift into cells) → Sodium bicarbonate (shift into cells, if acidosis) → Diuretics/dialysis (eliminate K⁺)",
        "Albuterol nebuliser can temporarily shift K⁺ into cells — useful adjunct",
        "Furosemide works only if renal function is adequate",
        "Dialysis is the DEFINITIVE treatment for life-threatening hyperkalemia",
      ],
      telemetry: [
        "Narrow-base tall T-waves = hyperkalemia; broad-base tall T-waves = hyperacute STEMI",
        "Sine-wave pattern = extreme emergency — do not wait for K⁺ result before treating",
      ],
    },
    professionViews: {
      rn: {
        focus: "Peaked T-waves on the monitor: check K⁺ STAT, notify provider, continuous monitoring.",
        priorities: ["STAT K⁺", "Continuous monitoring", "Identify ECG stage", "Calcium gluconate ready"],
        keyActions: [
          "Order (or facilitate) STAT K⁺ and ECG",
          "Notify provider immediately",
          "Calcium gluconate 10mL 10% IV if ordered and QRS widening present",
          "Insulin 10 units IV + dextrose 25g IV if ordered",
          "Continuous monitoring and repeat K⁺",
        ],
        examFocus: "Hyperkalemia: peaked T-waves → K⁺ level → cardiac stabilisation with calcium FIRST.",
      },
      rpn: {
        focus: "Tall peaked T-waves: obtain K⁺ level, escalate to RN.",
        priorities: ["Identify peaked T-waves", "Obtain K⁺ immediately", "Notify RN"],
        keyActions: ["Escalate to RN with K⁺ results", "Continuous monitoring"],
      },
      np: {
        focus: "Identify severity, initiate tiered treatment, arrange dialysis if renal failure is the cause.",
        priorities: [
          "Confirm K⁺ level and ECG stage",
          "Calcium gluconate for membrane stabilisation if ECG changes",
          "Insulin + dextrose → sodium bicarb → diuretics/kayexalate/dialysis",
          "Identify and reverse cause: AKI, medication, adrenal insufficiency",
        ],
        keyActions: [
          "Calcium gluconate 10mL IV over 10 min if ECG changes",
          "Insulin 10u IV + D50W 50mL IV",
          "Nephrology consultation for dialysis if K⁺ > 7 or dialysis-dependent",
          "Hold offending medications",
        ],
        examFocus: "NP boards: treatment sequence, calcium gluconate first for cardiac symptoms, dialysis as definitive.",
      },
      rt: {
        focus: "Severe hyperkalemia can cause respiratory muscle weakness — monitor for respiratory failure.",
        priorities: ["Assess respiratory muscle strength", "Monitor SpO2"],
        keyActions: ["Notify team if respiratory muscle weakness develops", "Prepare for possible ventilatory support"],
      },
      newGrad: {
        focus: "Tall narrow pointed T-waves: think hyperkalemia. Get K⁺ level and call your charge nurse.",
        priorities: ["Are the T-waves very tall and pointy (tent-shaped)?", "Get a K⁺ level ordered"],
        keyActions: ["Notify charge nurse", "Continuous monitoring"],
        examFocus: "Hyperkalemia: peaked T-waves → calcium first. NOT insulin first. Calcium protects the heart.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "hypokalemia_pattern",
        compareWithName: "Hypokalemia Pattern",
        keyDifferences: [
          { feature: "T-wave", thisRhythm: "PEAKED, tall, narrow (tent-shaped)", otherRhythm: "Flat or absent T-wave" },
          { feature: "U-wave", thisRhythm: "Absent", otherRhythm: "PROMINENT — may merge with T-wave" },
          { feature: "QRS", thisRhythm: "WIDENS as K⁺ rises", otherRhythm: "Usually unchanged initially" },
          { feature: "QT interval", thisRhythm: "Shortened or variable", otherRhythm: "PROLONGED (risk of torsades)" },
          { feature: "Treatment", thisRhythm: "Lower K⁺ (calcium, insulin, dialysis)", otherRhythm: "Replace K⁺ (+ Mg²⁺)" },
        ],
        clinicalImplication: "Opposite findings, opposite treatment. Hyperkalemia → peaked T → calcium + lower K⁺. Hypokalemia → flat T + U-wave → replace K⁺ + Mg²⁺. The QT and U-wave are the most important hypokalemia ECG findings for risk of torsades.",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "deterioration",
        title: "CKD Patient Sine-Wave on Telemetry",
        clinicalContext: "68-year-old with stage 4 CKD, missed dialysis yesterday. Monitor shows widening QRS with near-sine-wave morphology.",
        patientPresentation: "Confused, weak, BP 92/58. K⁺ result: 8.1 mEq/L. QRS 0.18s and widening.",
        keyDecisionPoint: "What is the single most important immediate intervention?",
        learnerObjective: "Administer calcium gluconate immediately to stabilise cardiac membrane; initiate emergent dialysis preparation; insulin + dextrose as bridge; continuous monitoring for VF.",
      },
    ],
  },

  // ── Hypokalemia ───────────────────────────────────────────────────────────────
  {
    rhythmKey: "hypokalemia_pattern",
    rhythmName: "Hypokalemia ECG Pattern",
    recognition: {
      rate: "50–120 BPM",
      regularity: "Regular",
      pWaves: "Present, normal",
      prInterval: "May be mildly prolonged",
      qrsWidth: "Narrow (initially)",
      stSegment: "ST depression; flat or inverted T-wave; prominent U-wave (key finding)",
      keyFeatures: [
        "FLAT or INVERTED T-wave",
        "PROMINENT U-wave (positive deflection after T-wave, best seen in V2–V3)",
        "T-U fusion (T and U waves merge — appears as a wide humped T-wave)",
        "Prolonged QTc (T-U fusion increases apparent QT)",
        "May progress to torsades de pointes",
      ],
      pearls: [
        "The U-wave is the most important hypokalemia ECG finding — look for it in V2–V3",
        "Normal U-wave is small and < 1mm; prominent U-wave (> 1mm in limb leads) = hypokalemia until proven otherwise",
        "T-U fusion makes the QT appear very long — risk of torsades",
        "Hypokalemia and hypomagnesemia frequently co-exist — always replace both",
        "Digoxin toxicity is markedly potentiated by hypokalemia",
      ],
    },
    mechanism:
      "Low extracellular potassium makes the resting membrane potential more negative (hyperpolarised), slowing repolarisation. This delays the T-wave and allows the U-wave (Purkinje fibre repolarisation) to become prominent relative to the diminished T-wave. The resulting prolonged repolarisation (apparent QTU prolongation) creates the substrate for torsades de pointes.",
    conductionPath:
      "Low K⁺ → prolonged repolarisation → delayed T-wave, prominent U-wave (Purkinje fibre afterdepolarisation) → T-U fusion → apparent QT prolongation → early afterdepolarisation (EAD) → torsades trigger.",
    whyStripLooksThisWay:
      "The T-wave is flat because repolarisation is slower and less organised. The U-wave (normally present but small) becomes large relative to the flat T-wave. In T-U fusion, the two waveforms merge into a single broad humped morphology that makes the QT interval appear very prolonged.",
    hemodynamicImpact: {
      cardiacOutput: "normal",
      cardiacOutputRationale: "Mild hypokalemia itself does not impair CO. Severe hypokalemia causing torsades or VF is the haemodynamic risk.",
      bloodPressureEffect: "normal",
      perfusionStatus: "Normal until torsades or VT occurs.",
      expectedSymptoms: [
        "Mild: muscle cramps, weakness, constipation",
        "Moderate: progressive muscle weakness, palpitations, polyuria",
        "Severe: paralysis, respiratory failure, rhabdomyolysis",
        "Cardiac: palpitations, syncope from torsades",
      ],
      hemodynamicallyStagable: true,
    },
    clinicalPresentation: {
      stable: [
        "Mild weakness and cramps with K⁺ 3.0–3.5 mEq/L",
        "ECG changes (flat T, prominent U) without arrhythmia",
      ],
      unstable: [
        "Torsades de pointes with syncope",
        "Haemodynamic compromise from sustained torsades or VF",
        "Severe muscle weakness with respiratory failure",
      ],
      redFlags: [
        "K⁺ < 3.0 mEq/L with ECG changes",
        "K⁺ < 2.5 mEq/L regardless of symptoms",
        "T-U fusion or QTU > 500ms",
        "Torsades de pointes",
        "Patient on digoxin with hypokalemia (toxicity dramatically potentiated)",
      ],
      emergencyTriggers: [
        "Torsades de pointes → magnesium 2g IV immediately",
        "VF from hypokalemia → ACLS + aggressive K⁺ and Mg²⁺ replacement",
      ],
    },
    escalation: {
      defaultLevel: "notify_provider",
      monitoringFrequency: "Continuous; serial K⁺ every 2–4h during replacement",
      immediateAssessments: [
        "STAT K⁺ and Mg²⁺",
        "12-lead ECG",
        "Review medications causing K⁺ loss: loop diuretics, thiazides, amphotericin B, corticosteroids",
        "Identify GI losses: vomiting, diarrhoea, NG suctioning",
        "Renal function (potassium-wasting nephropathy)",
      ],
      notifyProviderWhen: [
        "K⁺ < 3.5 mEq/L with ECG changes",
        "K⁺ < 3.0 mEq/L for IV replacement order",
        "Any torsades de pointes",
      ],
      rapidResponseWhen: [
        "Torsades de pointes",
        "Symptomatic hypokalemia with haemodynamic compromise",
      ],
      codeBlueWhen: ["VF from hypokalemia", "Pulseless torsades"],
      interventionContraindications: [
        "Do NOT give IV potassium via rapid bolus — fatal cardiac arrhythmias if given too fast",
        "IV K⁺ maximum rate: 10–20 mEq/hour peripheral; up to 40 mEq/hour central with continuous monitoring",
        "Do NOT administer IV K⁺ without verifying adequate urine output (risk of hyperkalemia if oliguric)",
      ],
    },
    examTraps: {
      nclex: [
        "Prominent U-wave after a flat T-wave = hypokalemia — this is the single most tested hypokalemia ECG finding",
        "IV potassium replacement requires CARDIAC MONITORING — never give IV K⁺ without a cardiac monitor",
        "IV K⁺ MAXIMUM RATE peripheral = 10 mEq/hour — exam frequently tests this safety limit",
        "Hypokalemia + hypomagnesemia are treated TOGETHER — Mg²⁺ must also be replaced",
        "Torsades de pointes from hypokalemia = magnesium 2g IV FIRST, then K⁺ replacement",
      ],
      interventionTraps: [
        "Verify urine output before IV K⁺ replacement — at least 0.5 mL/kg/h",
        "Oral K⁺ replacement for mild asymptomatic hypokalemia — IV only for symptomatic or < 3.0",
        "Replace Mg²⁺ simultaneously or K⁺ replacement will be ineffective (Mg²⁺ is required for K⁺ cellular uptake)",
      ],
      telemetry: [
        "Prominent U-wave + flat T = hypokalemia; peaked T + no U = hyperkalemia. These are opposites",
        "Long QTU interval in hypokalemia is the substrate for torsades — report immediately",
      ],
    },
    professionViews: {
      rn: {
        focus: "Flat T, prominent U, long QT = hypokalemia. Check K⁺ and Mg²⁺, initiate replacement safely.",
        priorities: ["Identify T-U pattern", "STAT K⁺ and Mg²⁺", "Verify urine output before IV replacement", "Cardiac monitoring during replacement"],
        keyActions: [
          "STAT K⁺ and Mg²⁺ levels",
          "Notify provider",
          "Verify urine output ≥ 0.5 mL/kg/h before IV K⁺",
          "IV K⁺ via pump — maximum 10 mEq/h peripheral",
          "Monitor for torsades during replacement",
        ],
        examFocus: "IV potassium: maximum 10 mEq/h peripheral, 40 mEq/h central with monitoring. This rate limit is a patient safety priority on NCLEX.",
      },
      rpn: {
        focus: "Flat T and prominent U on monitor: get K⁺ level and notify RN.",
        priorities: ["Identify U-wave prominence", "Obtain K⁺ and Mg²⁺", "Notify RN"],
        keyActions: ["Escalate to RN", "Continuous monitoring", "Do not administer potassium independently"],
      },
      np: {
        focus: "Identify cause, correct K⁺ and Mg²⁺, manage torsades risk.",
        priorities: [
          "K⁺ and Mg²⁺ levels",
          "Identify cause: diuretic use, vomiting, aldosteronism, RTA",
          "Oral replacement for mild, IV for < 3.0 or symptomatic",
          "Magnesium repletion simultaneously",
          "Review and modify offending medications",
        ],
        keyActions: [
          "K⁺ replacement protocol with cardiac monitoring",
          "Magnesium 2g IV if torsades occurs",
          "Aldosterone testing if unexplained hypokalemia",
          "Consider potassium-sparing diuretic if on loop/thiazide",
        ],
        examFocus: "NP: K⁺ replacement rate limits, Mg²⁺ co-replacement, torsades management with magnesium.",
      },
      rt: {
        focus: "Severe hypokalemia can cause respiratory muscle weakness — assess ventilatory capacity.",
        priorities: ["Monitor respiratory rate and depth", "Assess for signs of respiratory muscle weakness"],
        keyActions: ["Notify team if K⁺ < 2.5 with new respiratory symptoms", "Prepare for possible ventilatory support if severe"],
      },
      newGrad: {
        focus: "Flat T + prominent bump after it (U-wave) = hypokalemia. Get K⁺ level and call charge nurse.",
        priorities: ["Is the T-wave flat?", "Is there a small wave after the T-wave (U-wave)?"],
        keyActions: ["Notify charge nurse", "Get K⁺ and Mg²⁺ levels ordered", "Never give IV potassium without a monitor and a pump"],
        examFocus: "U-wave = hypokalemia. Never IV K⁺ without checking urine output. Max rate: 10 mEq/h peripheral.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "hyperkalemia_pattern",
        compareWithName: "Hyperkalemia Pattern",
        keyDifferences: [
          { feature: "T-wave", thisRhythm: "FLAT or inverted", otherRhythm: "PEAKED, tall, narrow (tent-shaped)" },
          { feature: "U-wave", thisRhythm: "PROMINENT (> 1mm)", otherRhythm: "Absent" },
          { feature: "QT interval", thisRhythm: "PROLONGED (T-U fusion)", otherRhythm: "Variable (may shorten or be unmeasurable)" },
          { feature: "Arrhythmia risk", thisRhythm: "Torsades de pointes (long QT)", otherRhythm: "VF/Asystole (QRS widening)" },
          { feature: "First-line treatment", thisRhythm: "K⁺ + Mg²⁺ replacement", otherRhythm: "Calcium gluconate (membrane stabilisation)" },
        ],
        clinicalImplication: "Opposite ECG findings, opposite treatments, opposite arrhythmia risks. The U-wave is the key hypokalemia marker. The peaked T and widening QRS are the key hyperkalemia markers.",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "deterioration",
        title: "Post-Diuresis Hypokalemia: Torsades on Telemetry",
        clinicalContext: "Patient received aggressive IV furosemide 80mg BID for acute HF. Day 2 telemetry shows flat T-waves and prominent U-waves. K⁺ returns at 2.8 mEq/L, Mg²⁺ 0.6 mmol/L.",
        patientPresentation: "Patient reports palpitations. Strip shows torsades de pointes lasting 8 seconds, self-terminating.",
        keyDecisionPoint: "What is the priority intervention before IV K⁺ replacement?",
        learnerObjective: "Administer magnesium 2g IV as priority for torsades; then initiate K⁺ replacement at ≤ 10 mEq/h with cardiac monitoring; identify furosemide as cause; consider potassium-sparing diuretic addition.",
      },
    ],
  },

  // ── Pacemaker Rhythm ─────────────────────────────────────────────────────────
  {
    rhythmKey: "paced_rhythm",
    rhythmName: "Pacemaker Rhythm",
    recognition: {
      rate: "Set pacing rate (typically 60–80 BPM programmed lower rate)",
      regularity: "Regular at paced rate (may be irregular if sensing intrinsic beats)",
      pWaves: "Pacemaker spikes visible (thin, vertical deflections) before P-wave (atrial) and/or QRS (ventricular)",
      prInterval: "Paced PR (AV delay): programmed (typically 120–200ms)",
      qrsWidth: "WIDE if ventricular pacing (LBBB morphology); narrow if atrial pacing only",
      keyFeatures: [
        "Pacemaker spikes (pacing artefact) — thin vertical lines before paced complexes",
        "Spike followed by wide QRS in ventricular pacing (capture)",
        "Discordant ST-T changes opposite to QRS direction (expected in paced rhythm)",
        "Rate at or above programmed lower rate limit",
      ],
      pearls: [
        "Capture = pacemaker spike followed by a P-wave or QRS complex",
        "Failure to capture = pacemaker spike WITHOUT following P-wave or QRS",
        "Failure to pace = expected spike does NOT appear (sensing problem or generator failure)",
        "Oversensing = pacemaker inhibited by noise/T-wave → pause",
        "Undersensing = pacemaker fires despite intrinsic activity → competitive pacing and risk of R-on-T",
        "Paced LBBB pattern is expected in ventricular pacing — do NOT interpret discordant ST as ischaemia",
      ],
    },
    mechanism:
      "An artificial pacemaker delivers electrical impulses at a programmed rate and energy level to the heart when the heart's intrinsic rate falls below the programmed lower rate limit. The pacemaker generator detects intrinsic activity (sensing) and withholds a spike if intrinsic activity is adequate. If no intrinsic activity is detected within the programmed escape interval, a spike is delivered to the atrium (atrial pacing), ventricle (ventricular pacing), or both (dual-chamber pacing).",
    conductionPath:
      "Pacemaker generator → lead tip (right ventricle for VVI, right atrium for AAI, both for DDD) → electrical impulse → myocardial depolarisation. Ventricular pacing bypasses the His-Purkinje system → wide QRS (LBBB morphology from RV apex pacing).",
    whyStripLooksThisWay:
      "The pacemaker spike appears as a very narrow vertical deflection before the paced complex. The wide QRS reflects RV apex pacing (slow cell-to-cell conduction similar to LBBB). Discordant ST-T waves are expected — they reflect abnormal repolarisation from abnormal activation, exactly as in LBBB.",
    hemodynamicImpact: {
      cardiacOutput: "normal",
      cardiacOutputRationale: "A properly functioning pacemaker maintains adequate heart rate and (in dual-chamber pacing) AV synchrony. Rate-responsive pacemakers can increase rate with activity for improved CO during exertion.",
      bloodPressureEffect: "normal",
      perfusionStatus: "Normal if pacemaker is capturing and pacing adequately.",
      expectedSymptoms: [
        "Functioning pacemaker: asymptomatic",
        "Pacemaker syndrome (VVI pacing without AV synchrony): fatigue, dizziness, cannon A-waves, reduced exercise tolerance",
        "Pacemaker malfunction: symptoms of underlying bradycardia or tachycardia",
      ],
      hemodynamicallyStagable: true,
    },
    clinicalPresentation: {
      stable: ["Pacemaker spikes visible, all spikes followed by capture, patient asymptomatic"],
      unstable: [
        "Pacemaker failure to capture: symptoms of bradycardia return",
        "Failure to pace with underlying bradycardia",
        "Pacemaker-mediated tachycardia (rare, device dependent)",
      ],
      redFlags: [
        "Pacemaker spikes without following QRS (failure to capture)",
        "Expected spikes absent when patient's HR is below programmed rate (failure to pace)",
        "Competitive pacing — pacemaker spike on or near T-wave (undersensing) — risk of R-on-T",
        "Rate changes outside programmed parameters",
      ],
      emergencyTriggers: [
        "Failure to capture + haemodynamically compromised patient → transcutaneous pacing as bridge",
        "Pacemaker-related cardiac arrest",
      ],
    },
    escalation: {
      defaultLevel: "notify_provider",
      monitoringFrequency: "Continuous; daily documentation of spike-to-capture ratio",
      immediateAssessments: [
        "Identify pacing mode (VVI, DDD, etc.) from device ID card or chart",
        "Count pacing spikes and confirm each is followed by capture",
        "Assess underlying intrinsic rate (what happens if pacemaker fails?)",
        "Check pacemaker interrogation if device available",
        "Chest X-ray to confirm lead position if failure suspected",
        "Check magnesium and electrolytes (hyper/hypokalemia can affect capture threshold)",
      ],
      notifyProviderWhen: [
        "Any failure to capture or failure to pace",
        "Rate change outside programmed parameters",
        "Symptomatic pacemaker dysfunction",
        "Patient with pacemaker reporting dizziness or near-syncope",
      ],
      rapidResponseWhen: [
        "Pacemaker failure with haemodynamic compromise",
        "Rate below programmed minimum with symptoms",
      ],
      codeBlueWhen: ["Pacemaker failure causing cardiac arrest"],
      interventionContraindications: [
        "Do NOT place a magnet over an ICD/pacemaker without physician order — can inhibit or asynchronously pace",
        "Do NOT perform MRI on patients with non-MRI-compatible pacemakers without device management",
        "Do NOT interpret pacemaker LBBB pattern as acute MI without specialist input (use modified Sgarbossa criteria)",
      ],
    },
    examTraps: {
      nclex: [
        "A pacemaker spike followed by a wide QRS = normal capture — do not call this VT",
        "Failure to capture = spike present but no complex follows",
        "Failure to pace = no spike when one should appear (patient's rate is below programmed rate)",
        "The pacing artefact (spike) is NOT a P-wave — do not count it as a P-wave",
        "Discordant ST changes in a paced patient are EXPECTED — do not call them acute ischaemia without evaluation",
      ],
      interventionTraps: [
        "Failure to capture in an emergency: increase pacemaker output (threshold exceeded) or apply transcutaneous pacing",
        "Oversensing (T-wave oversensed): rate drops below programmed rate — reduce sensitivity setting",
        "Undersensing (pacemaker fires despite intrinsic activity): increase sensitivity — risk of R-on-T if not corrected",
      ],
      telemetry: [
        "Look for the spike before every expected QRS — absence of spike = failure to pace",
        "Spike without following QRS = failure to capture",
        "Wide QRS in a pacemaker patient is EXPECTED — it is the paced beat, not VT",
      ],
    },
    professionViews: {
      rn: {
        focus: "Verify: spike present → QRS follows → rate appropriate → patient asymptomatic.",
        priorities: ["Confirm capture for every spike", "Confirm rate at or above programmed lower limit", "Assess patient symptoms"],
        keyActions: [
          "Document spike-to-capture ratio each assessment",
          "Notify provider for any failure to capture or pace",
          "Assess patient for symptoms of bradycardia or pacemaker syndrome",
          "Verify pacemaker programming information is in the chart",
        ],
        examFocus: "NCLEX pacemaker: know capture (spike + QRS), failure to capture (spike, no QRS), failure to pace (no spike). Discordant ST expected.",
      },
      rpn: {
        focus: "Identify pacemaker spikes and confirm capture; escalate any abnormality to RN.",
        priorities: ["Is every spike followed by a QRS?", "Is the rate appropriate?"],
        keyActions: ["Notify RN of any missing spike or uncaptured spike", "Assess patient symptoms"],
      },
      np: {
        focus: "Interpret pacemaker rhythm abnormalities, manage malfunctions, coordinate device follow-up.",
        priorities: [
          "Determine pacing mode from device records",
          "Distinguish failure to capture vs failure to pace vs oversensing vs undersensing",
          "Interrogate device with programmer if available",
          "Manage acute malfunctions: adjust output, rate, or sensitivity",
        ],
        keyActions: [
          "Device interrogation for programming issues",
          "Electrolyte correction for threshold elevation",
          "Chest X-ray for lead displacement",
          "Cardiology/EP referral for reprogramming or lead revision",
        ],
        examFocus: "NP boards: pacemaker malfunction types, emergency management, device programming principles.",
      },
      rt: {
        focus: "Pacemaker rhythm in a ventilated patient: ensure ventilator pacing artefacts are not misinterpreted as cardiac arrhythmias.",
        priorities: ["Identify pacemaker spikes to prevent confusion with ventilator-synchronised artefacts"],
        keyActions: ["Note pacemaker in patient history during respiratory assessments", "Alert team if monitor shows apparent pacemaker malfunction during ventilatory changes"],
      },
      newGrad: {
        focus: "Spike → QRS = captured. Spike only = failure to capture. No spike when rate drops = failure to pace.",
        priorities: ["Count spikes and check each has a following QRS", "Is the rate above the minimum?", "Is the patient symptomatic?"],
        keyActions: ["Report any uncaptured spike to charge nurse", "Wide QRS in a pacemaker patient is normal — do not alarm"],
        examFocus: "Three pacemaker malfunction types: failure to capture (spike, no QRS), failure to pace (no spike), over/undersensing. Know these.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "left_bundle_branch_block",
        compareWithName: "Left Bundle Branch Block (LBBB)",
        keyDifferences: [
          { feature: "Pacemaker spikes", thisRhythm: "PRESENT — visible thin vertical lines", otherRhythm: "ABSENT — no pacemaker spikes" },
          { feature: "QRS morphology", thisRhythm: "LBBB pattern from RV apex pacing", otherRhythm: "LBBB from intrinsic bundle block" },
          { feature: "Origin", thisRhythm: "Artificial pacemaker delivers the impulse", otherRhythm: "SA node delivers the impulse via blocked left bundle" },
          { feature: "ST/T interpretation", thisRhythm: "Discordant changes expected — same as LBBB", otherRhythm: "Discordant changes expected" },
        ],
        clinicalImplication: "Ventricular pacing produces an LBBB-like morphology. The pacemaker spike is the key distinguisher — if there is no spike, it is intrinsic LBBB. Both have similar challenges for STEMI interpretation.",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "stable_monitoring",
        title: "Pacemaker Patient: Dizzy Post-Shower",
        clinicalContext: "68-year-old with VVI pacemaker programmed at 60 BPM. Reports dizziness and near-syncope in the shower. Monitor shows occasional pacemaker spikes with no following QRS.",
        patientPresentation: "HR 42 BPM. Some spikes capture, some don't. BP 90/60. Mildly confused.",
        keyDecisionPoint: "Failure to capture vs failure to pace? What is the immediate action?",
        learnerObjective: "Identify failure to capture (spikes without QRS), recognise haemodynamic compromise, activate rapid response, prepare transcutaneous pacing, and notify physician for device interrogation.",
      },
    ],
  },

  // ── Torsades de Pointes ───────────────────────────────────────────────────────
  {
    rhythmKey: "torsades_de_pointes",
    rhythmName: "Torsades de Pointes",
    recognition: {
      rate: "150–250 BPM",
      regularity: "Regularly irregular — twisting pattern",
      pWaves: "Absent during tachycardia",
      prInterval: "Not measurable during tachycardia",
      qrsWidth: "> 0.12s — wide polymorphic complexes",
      stSegment: "Not applicable — prolonged QT visible on preceding sinus beats",
      keyFeatures: [
        "POLYMORPHIC ventricular tachycardia — QRS amplitude twists around the isoelectric baseline",
        "QRS axis rotates cyclically — appears to wind/unwind around the baseline",
        "Typically self-terminating (lasting seconds to minutes) — but recurs",
        "Triggered by long-short R-R sequence (long pause → short coupling interval → torsades onset)",
        "PRECEDED by prolonged QTc on sinus beats",
      ],
      pearls: [
        "Torsades = 'twisting of the points' (French) — the QRS amplitude twists around the isoelectric line",
        "SUBSTRATE: prolonged QT (from drugs, electrolytes, congenital LQTS)",
        "TRIGGER: long-short R-R sequence (long pause followed by early beat — PVC or PAC)",
        "KEY DISTINCTION from monomorphic VT: QRS amplitude VARIES (polymorphic) vs uniform (monomorphic)",
        "TREATMENT difference from VT: magnesium 2g IV (not amiodarone — amiodarone prolongs QT further)",
        "If pulseless: DEFIBRILLATE — same as VF",
      ],
    },
    mechanism:
      "Torsades occurs in the setting of a prolonged action potential duration (prolonged QT). When the QT is prolonged, the relative refractory period is extended, creating a vulnerable window. A premature beat (PVC or PAC) occurring during this window triggers early afterdepolarisations (EADs) in Purkinje fibres, leading to polymorphic re-entrant VT with the characteristic rotating axis (twisting QRS amplitude). The long-short R-R initiating sequence is the immediate trigger on the prolonged-QT substrate.",
    conductionPath:
      "Prolonged QT substrate → long-short R-R trigger → early afterdepolarisation (EAD) in Purkinje fibres → polymorphic re-entrant ventricular tachycardia with rotating electrical axis.",
    whyStripLooksThisWay:
      "The rotating axis means the QRS complex alternates between positive and negative dominance in each lead, producing the characteristic winding/unwinding appearance around the isoelectric line. On sinus beats, the QT interval is visibly prolonged. The initiation shows the classic long-short sequence (long pause from a blocked beat or sinus pause, then a PVC triggering torsades).",
    hemodynamicImpact: {
      cardiacOutput: "severely_reduced",
      cardiacOutputRationale: "Rapid polymorphic VT severely compromises CO due to rate and dyssynchrony. Self-terminating episodes cause syncope; sustained torsades causes cardiac arrest.",
      bloodPressureEffect: "severely_hypotensive",
      perfusionStatus: "Near zero during torsades episodes. Syncope is the expected clinical manifestation of self-terminating torsades.",
      expectedSymptoms: [
        "Sudden syncope or presyncope (self-terminating episode)",
        "Palpitations before onset",
        "Sudden cardiac death if sustained or degenerates to VF",
        "Cardiac arrest if pulseless",
      ],
      hemodynamicallyStagable: true,
    },
    clinicalPresentation: {
      stable: [
        "Self-terminating torsades: syncope that self-resolves, patient wakes up",
        "Preceding sinus beats show prolonged QTc",
        "Recurring episodes without haemodynamic collapse between them",
      ],
      unstable: [
        "Sustained torsades not self-terminating: haemodynamic collapse",
        "Torsades degenerating to VF: pulseless cardiac arrest",
        "Multiple syncopal episodes with prolonged QTc",
      ],
      redFlags: [
        "QTc > 500ms — very high risk of torsades",
        "QTc > 470ms (women) or > 460ms (men) with QT-prolonging drugs",
        "Hypokalemia + hypomagnesemia + QT-prolonging drug = triple threat",
        "Syncopal episode with long QT on ECG — torsades is the cause until proven otherwise",
        "Polymorphic VT self-terminating in a patient on QT-prolonging drugs",
      ],
      emergencyTriggers: [
        "Sustained torsades with haemodynamic collapse → cardioversion",
        "Pulseless torsades → defibrillation (treat as VF)",
      ],
    },
    escalation: {
      defaultLevel: "rapid_response",
      monitoringFrequency: "Continuous; QTc measurement with every 12-lead ECG",
      immediateAssessments: [
        "STAT K⁺ and Mg²⁺ — correct immediately",
        "12-lead ECG: measure QTc on sinus beats",
        "Review ALL medications — identify and STOP QT-prolonging drugs",
        "QTc database: CredibleMeds (crediblemeds.org) for drug risk classification",
        "Thyroid function, calcium levels (electrolyte causes of long QT)",
        "Family history of sudden cardiac death (congenital LQTS)",
      ],
      notifyProviderWhen: [
        "Any torsades identified",
        "QTc > 500ms on any monitoring",
        "QTc increase > 60ms from baseline on QT-prolonging drug",
        "New syncope with long QTc",
      ],
      rapidResponseWhen: [
        "Torsades with haemodynamic compromise",
        "Recurrent torsades episodes",
        "Pulseless torsades",
      ],
      codeBlueWhen: [
        "Pulseless torsades / torsades → VF",
        "Cardiac arrest from torsades",
      ],
      interventionContraindications: [
        "Do NOT give amiodarone for torsades — it PROLONGS QT and will WORSEN torsades",
        "Do NOT give procainamide or sotalol — both prolong QT",
        "Do NOT give lidocaine for polymorphic VT without first confirming it is NOT torsades",
        "For CONGENITAL LQTS: beta-blockers are protective; isoproterenol should NOT be used as overdrive pacing agent",
      ],
    },
    examTraps: {
      nclex: [
        "Torsades treatment is MAGNESIUM 2g IV STAT — NOT amiodarone (amiodarone prolongs QT)",
        "If pulseless torsades: DEFIBRILLATE — magnesium is for prevention/termination, not resuscitation",
        "The substrate is always prolonged QT — identify and remove the cause (stop the drug, correct the electrolyte)",
        "Polymorphic VT in a patient with normal QT = treat differently from torsades — may use amiodarone",
        "Key trap: 'polymorphic VT with prolonged QT' = torsades → MAGNESIUM. 'Polymorphic VT with normal QT' = ischaemic → amiodarone/cardioversion",
      ],
      interventionTraps: [
        "Magnesium 2g IV over 10–15 minutes for acute torsades (even if Mg²⁺ level is normal — it works via membrane stabilisation)",
        "Overdrive pacing (atrial or ventricular at 90–100 BPM) shortens the QT and prevents the long pause triggering the next episode",
        "Isoproterenol infusion can increase the rate and shorten QT as a bridge — useful in acquired (pause-dependent) torsades but CONTRAINDICATED in congenital LQTS",
      ],
      telemetry: [
        "Twisting QRS amplitude around the isoelectric line = torsades de pointes",
        "Confirm long QTc on the sinus beats BEFORE the torsades episode",
        "Self-terminating torsades can be missed if the episode is short — review full telemetry strip carefully",
      ],
    },
    professionViews: {
      rn: {
        focus: "Polymorphic twisting VT + prolonged QT + syncope = torsades. Magnesium FIRST. Stop the offending drug.",
        priorities: [
          "Confirm QTc on sinus beats",
          "Magnesium 2g IV if ordered for torsades",
          "Identify and hold QT-prolonging medications",
          "STAT K⁺ and Mg²⁺",
        ],
        keyActions: [
          "Notify provider STAT",
          "Magnesium 2g IV over 10–15 min",
          "K⁺ replacement if < 4.0 mEq/L",
          "Hold all QT-prolonging drugs — review with pharmacist",
          "If pulseless: defibrillate (code blue)",
          "Continuous monitoring for recurrence",
        ],
        examFocus: "Torsades = magnesium first. NOT amiodarone. If pulseless = defibrillate. Identify and remove QT-prolonging drug.",
      },
      rpn: {
        focus: "Twisting polymorphic VT with syncope: call RN immediately — do not leave patient.",
        priorities: ["Identify polymorphic twisting VT", "Is patient conscious? Pulse present?", "Escalate to RN immediately"],
        keyActions: ["Call RN NOW", "Stay with patient", "Prepare to start CPR if pulse is lost"],
      },
      np: {
        focus: "Identify torsades substrate, remove cause, manage acute episode with magnesium, and prevent recurrence.",
        priorities: [
          "Identify the QT-prolonging drug (CredibleMeds) and STOP it",
          "K⁺ target > 4.5 mEq/L, Mg²⁺ target > 0.85 mmol/L",
          "QTc monitoring every 6–12 hours on QT-prolonging medications",
          "Overdrive pacing if recurrent torsades despite magnesium",
          "Congenital LQTS: genetic testing, beta-blockers, ICD consideration",
        ],
        keyActions: [
          "Magnesium 2g IV bolus",
          "Electrolyte correction",
          "Drug reconciliation with pharmacist",
          "Overdrive pacing for pause-dependent torsades",
          "Cardiology/EP for congenital LQTS evaluation and ICD",
        ],
        examFocus: "NP boards: QTc monitoring thresholds, CredibleMeds risk classification, acquired vs congenital LQTS management, ICD indication.",
      },
      rt: {
        focus: "Torsades with haemodynamic compromise rapidly impairs oxygenation delivery — assist with airway during resuscitation.",
        priorities: ["Oxygenation support during and after torsades episodes", "Airway preparation for potential cardiac arrest"],
        keyActions: ["Supplemental oxygen", "Bag-valve mask preparation", "Support ventilation during resuscitation if pulseless episode occurs"],
      },
      newGrad: {
        focus: "Twisting winding QRS = torsades. Call your charge nurse. Do NOT give amiodarone (it makes it worse). Magnesium is the answer.",
        priorities: ["Is the QRS amplitude winding and unwinding?", "Did the patient black out (syncopal)?"],
        keyActions: [
          "Call charge nurse and provider NOW",
          "Do not leave the patient",
          "Check pulse if patient appears unconscious — code blue if pulseless",
        ],
        examFocus: "Torsades: twisting VT + long QT = magnesium. Amiodarone = WRONG answer. If pulseless = defibrillate.",
      },
    },
    compareContrast: [
      {
        compareWithRhythmKey: "ventricular_tachycardia",
        compareWithName: "Monomorphic VT",
        keyDifferences: [
          { feature: "QRS morphology", thisRhythm: "POLYMORPHIC — amplitude rotates (twisting)", otherRhythm: "MONOMORPHIC — same shape every beat" },
          { feature: "QT substrate", thisRhythm: "PROLONGED QTc on preceding sinus beats", otherRhythm: "Normal QTc usually" },
          { feature: "First-line drug", thisRhythm: "MAGNESIUM 2g IV", otherRhythm: "Amiodarone 150mg IV" },
          { feature: "Amiodarone", thisRhythm: "CONTRAINDICATED — prolongs QT", otherRhythm: "Appropriate treatment" },
          { feature: "Trigger", thisRhythm: "Long-short R-R sequence on prolonged QT substrate", otherRhythm: "Usually re-entrant circuit (scar, ischaemia)" },
        ],
        clinicalImplication: "This is the most critical VT management distinction. Giving amiodarone for torsades prolongs the QT further and worsens the arrhythmia. Magnesium is safe for both (no harm in monomorphic VT), but amiodarone is dangerous in torsades. When uncertain: give magnesium first.",
      },
    ],
    simulationHooks: [
      {
        scenarioType: "deterioration",
        title: "QTc 560ms on a New Antibiotic — Syncope at 0300",
        clinicalContext: "Patient started on azithromycin and fluconazole (both QT-prolonging). K⁺ 3.1 mEq/L. QTc on evening 12-lead: 560ms.",
        patientPresentation: "0300 — patient found unresponsive for 15 seconds by nursing, now awake and confused. Telemetry shows torsades de pointes self-terminating 12 seconds ago.",
        keyDecisionPoint: "What are the three simultaneous interventions?",
        learnerObjective: "Hold azithromycin and fluconazole; administer magnesium 2g IV; correct K⁺ to ≥ 4.5 mEq/L; notify provider; implement continuous QTc monitoring and telemetry.",
      },
    ],
  },

];
