/**
 * ECG Telemetry Interpretation Layer — Phase 2
 *
 * Teaches artifact recognition, lead placement issues, monitor malfunctions,
 * pacemaker interpretation (sensing and capture), and the distinction between
 * what the monitor SHOWS and what the rhythm ACTUALLY IS.
 *
 * Clinical framing: "What does this look like?" vs. "What is it really?"
 * This is the most common source of inappropriate code activations and
 * dangerous alarm fatigue in clinical practice.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type EcgTelemetryArtifactType =
  | "lead_displacement"    // Electrode fell off or poor contact
  | "motion_artifact"      // Patient movement — walking, tremor, CPR
  | "60_hz_interference"   // Electrical interference from equipment
  | "baseline_wander"      // Respiratory or movement baseline shift
  | "pacemaker_artifact"   // Pacemaker spike causing visual noise
  | "oversensing"          // Pacemaker seeing non-cardiac signals as QRS
  | "undersensing"         // Pacemaker failing to see native QRS complexes
  | "failure_to_capture"   // Pacemaker fires but doesn't capture myocardium
  | "failure_to_pace"      // Pacemaker fails to fire when it should
  | "runaway_pacemaker";   // Pacemaker fires uncontrollably at high rate

export type EcgTelemetryLeadIssue =
  | "right_left_arm_reversal"  // Limb leads RA/LA swapped
  | "lead_dextrocardia"        // Mirror-image reversal
  | "v_lead_misplacement"      // Precordial leads in wrong position
  | "poor_skin_prep"           // Greasy/hairy skin causing poor contact
  | "electrode_dried_gel"      // Old gel causing high impedance
  | "tangled_leads"            // Cable artifact from twisting
  | "patient_on_leads";        // Patient lying on lead wires

export type EcgTelemetryScenario = {
  id: string;
  title: string;
  category: "artifact" | "lead_issue" | "pacemaker" | "monitor_malfunction";
  artifactType?: EcgTelemetryArtifactType;
  leadIssue?: EcgTelemetryLeadIssue;
  /**
   * What the monitor appears to show — the visual "what it looks like"
   * This is what might trigger an inappropriate alarm or code
   */
  appearsToShow: string;
  /**
   * What is actually happening — the true clinical picture
   */
  actualRhythm: string;
  /** How to distinguish the artifact from the real rhythm */
  howToDistinguish: ReadonlyArray<string>;
  /** Required action when this is identified */
  requiredAction: string;
  /** Consequences of treating the artifact as a real rhythm */
  consequenceIfMistaken: string;
  /** Clinical safety level of the consequence */
  safetyRisk: "low" | "moderate" | "high" | "life_threatening";
  /** Teaching pearl for this scenario */
  teachingPearl: string;
};

// ─── Artifact and telemetry scenario library ──────────────────────────────────

export const ECG_TELEMETRY_SCENARIOS: ReadonlyArray<EcgTelemetryScenario> = [

  // ── Artifact scenarios ────────────────────────────────────────────────────

  {
    id: "telem-lead-off-vf",
    title: "Lead Displacement Mimicking VF",
    category: "artifact",
    artifactType: "lead_displacement",
    appearsToShow: "Ventricular fibrillation — chaotic high-amplitude waveform on the monitor",
    actualRhythm: "Lead displacement artifact — one or more electrodes have become disconnected",
    howToDistinguish: [
      "Check the patient BEFORE calling a code — are they alert, responsive, and talking?",
      "Look for a 'Leads Off' or 'Lead Fail' indicator on the monitor display",
      "The artifact disappears instantly when the lead is reconnected",
      "Check the other leads — all may show flat lines if the reference electrode is off",
      "True VF: patient is unresponsive with no pulse; artifact: patient is fine",
    ],
    requiredAction:
      "Go to the patient immediately. Assess responsiveness and check the pulse. " +
      "If the patient is alert and the pulse is present — check lead placement and reconnect the electrode. " +
      "NEVER call a code based on the monitor alone without assessing the patient.",
    consequenceIfMistaken:
      "Calling a code blue for a conscious patient. CPR attempted on a patient with a normal rhythm. " +
      "Inappropriate defibrillation of a patient in NSR. Patient harm and loss of institutional trust.",
    safetyRisk: "high",
    teachingPearl:
      "The most dangerous two words in telemetry monitoring are 'that looks like VF.' " +
      "They are only safe if followed by 'let me check the patient.' " +
      "Lead displacement is the number one cause of inappropriate code calls in hospitals.",
  },

  {
    id: "telem-motion-artifact-vt",
    title: "Motion Artifact Mimicking VT",
    category: "artifact",
    artifactType: "motion_artifact",
    appearsToShow: "Wide-complex tachycardia resembling ventricular tachycardia",
    actualRhythm:
      "Motion artifact — patient is moving (getting out of bed, showering, being repositioned, during CPR)",
    howToDistinguish: [
      "Underlying sinus rhythm 'peeks through' the artifact at regular intervals",
      "The rate of the 'QRS complexes' is much faster than a physiologic ventricular rate",
      "Patient is alert and can speak — true pulsatile VT patients show signs of compromise",
      "Artifact stops when the patient stops moving",
      "12-lead ECG shows normal morphology if obtained while artifact is absent",
    ],
    requiredAction:
      "Ask the patient to lie still briefly. Observe whether the 'rhythm' resolves. " +
      "Check the patient's clinical status (responsiveness, pulse, BP). " +
      "If the patient is asymptomatic and the artifact resolves with stillness — artifact confirmed.",
    consequenceIfMistaken:
      "Administering adenosine or antiarrhythmic medications to a patient in NSR. " +
      "Activating rapid response unnecessarily. Creating alarm fatigue for future real events.",
    safetyRisk: "moderate",
    teachingPearl:
      "Motion artifact produces irregular 'wide complexes' at rates that would be inconsistent with life " +
      "in a talking, ambulatory patient. If the patient is eating lunch, they are not in VT.",
  },

  {
    id: "telem-baseline-wander-st",
    title: "Baseline Wander Mimicking ST Elevation",
    category: "artifact",
    artifactType: "baseline_wander",
    appearsToShow: "ST elevation across multiple leads — could trigger STEMI concern",
    actualRhythm:
      "Baseline wander artifact from breathing, movement, or poor electrode contact creating an undulating baseline",
    howToDistinguish: [
      "The 'ST elevation' oscillates with respiratory rate — rises and falls with breathing",
      "The waveform morphology is sinusoidal, not the coved STEMI pattern",
      "Elevation affects ALL leads uniformly — not in an anatomically contiguous pattern",
      "PR segment (the true baseline) also appears elevated when the baseline is wandering",
      "The finding resolves with improved electrode contact or patient stillness",
    ],
    requiredAction:
      "Obtain a repeat ECG with improved electrode placement (proper skin prep, replacing old electrodes). " +
      "Compare with prior ECGs. If clinical concern persists, evaluate the patient and escalate.",
    consequenceIfMistaken:
      "Activating a STEMI alert for artifact. Unnecessary cath lab activation, aspirin, anticoagulation. " +
      "Financial, logistical, and patient-safety consequences.",
    safetyRisk: "high",
    teachingPearl:
      "Baseline wander: the entire baseline oscillates, including the PR segment. " +
      "True ST elevation: the PR segment (your reference) stays flat; only the ST segment is elevated.",
  },

  {
    id: "telem-60hz-interference",
    title: "60 Hz Electrical Interference",
    category: "artifact",
    artifactType: "60_hz_interference",
    appearsToShow: "Thick, fuzzy-looking QRS complexes with a constant high-frequency oscillation overlying the baseline",
    actualRhythm: "Normal sinus rhythm with electrical interference from nearby equipment (infusion pumps, electric beds, phones)",
    howToDistinguish: [
      "The oscillation frequency is exactly 60 cycles per second — very fast and regular",
      "The QRS complexes are still visible within the interference — look for the underlying rhythm",
      "The interference disappears when the offending electrical equipment is unplugged or moved",
      "The patient is clinically well",
      "The 60 Hz artifact is typically uniform across the entire strip",
    ],
    requiredAction:
      "Identify and remove/move the electrical equipment causing interference. " +
      "Check electrode impedance — high-impedance electrodes (old gel, poor skin contact) amplify 60 Hz interference. " +
      "Replace electrodes and repeat the ECG after equipment isolation.",
    consequenceIfMistaken: "Treating artifact as a rhythm abnormality. Inappropriate treatment delay while investigating a normal finding.",
    safetyRisk: "low",
    teachingPearl:
      "60 Hz interference is a consistent, regular, very-high-frequency noise. " +
      "It's caused by the electrical environment, not the patient. Check the equipment before treating the patient.",
  },

  // ── Pacemaker interpretation ───────────────────────────────────────────────

  {
    id: "telem-failure-to-capture",
    title: "Pacemaker Failure to Capture",
    category: "pacemaker",
    artifactType: "failure_to_capture",
    appearsToShow:
      "Pacemaker spikes visible on the rhythm strip without a QRS complex following each spike. " +
      "The heart rate appears to be the underlying (slow) escape rate, not the paced rate.",
    actualRhythm:
      "Pacemaker failure to capture — the pacemaker is firing (visible spikes) but the electrical stimulus " +
      "is not generating a ventricular depolarization. The myocardium is not responding to the pacemaker.",
    howToDistinguish: [
      "Pacemaker spikes ARE visible — the pacemaker is firing (this is not failure to pace)",
      "Each spike is NOT followed by a QRS complex — no ventricular capture",
      "The underlying (native) escape rate may be very slow or absent",
      "Compare with prior rhythm strips showing previous capture",
    ],
    requiredAction:
      "Notify the provider IMMEDIATELY — this is a pacing emergency in a pacemaker-dependent patient. " +
      "Assess the patient for hemodynamic stability. " +
      "Prepare transcutaneous external pacing as a bridge. " +
      "Check threshold settings and lead position (CXR). " +
      "This may require transvenous pacing or device revision.",
    consequenceIfMistaken:
      "Missing failure to capture in a pacemaker-dependent patient results in inadequate heart rate and potential cardiac arrest.",
    safetyRisk: "life_threatening",
    teachingPearl:
      "In pacemaker interpretation: see spike + see QRS = normal capture. " +
      "See spike + NO QRS = failure to capture = EMERGENCY in a pacemaker-dependent patient.",
  },

  {
    id: "telem-failure-to-sense",
    title: "Pacemaker Oversensing — Failure to Pace When Needed",
    category: "pacemaker",
    artifactType: "oversensing",
    appearsToShow:
      "Prolonged pauses on the rhythm strip without pacemaker spikes, despite the native rate being slow " +
      "and the pacemaker rate being set higher. The pacemaker appears to not be firing.",
    actualRhythm:
      "Pacemaker oversensing — the pacemaker is detecting non-cardiac electrical signals " +
      "(T waves, muscle artifact, external electromagnetic interference) as QRS complexes " +
      "and incorrectly inhibiting itself.",
    howToDistinguish: [
      "Native QRS complexes are present but pacemaker is not firing despite rate below pacemaker rate",
      "Pauses occur at irregular intervals — not a consistent pattern",
      "The non-sensed signals may be visible: T waves interpreted as QRS, or external signals",
      "Applying a pacemaker magnet converts the pacemaker to asynchronous mode (fixed-rate pacing without sensing) — if pacing then occurs, oversensing confirmed",
    ],
    requiredAction:
      "Assess patient hemodynamics. Notify provider. " +
      "The device may need programming adjustment (sensitivity threshold). " +
      "EMI sources (electric blankets, MRI, electrosurgical equipment) should be removed if suspected cause.",
    consequenceIfMistaken:
      "Missing oversensing allows bradycardia or asystole to continue undetected " +
      "in a pacemaker-dependent patient.",
    safetyRisk: "high",
    teachingPearl:
      "Oversensing: pacemaker sees too much (T waves, interference) and thinks the heart is beating. " +
      "Undersensing: pacemaker sees too little (low-amplitude QRS) and paces into native beats. " +
      "Both require device reassessment.",
  },

  {
    id: "telem-undersensing",
    title: "Pacemaker Undersensing — Pacing During Native Rhythm",
    category: "pacemaker",
    artifactType: "undersensing",
    appearsToShow:
      "Pacemaker spikes appearing DURING the T wave or immediately after a native QRS — " +
      "'spike on T wave' pattern. The pacemaker is not detecting the native beats.",
    actualRhythm:
      "Pacemaker undersensing — the pacemaker is not detecting (sensing) the native QRS complexes " +
      "because they are too low in amplitude. It is pacing blindly, regardless of native rhythm.",
    howToDistinguish: [
      "Native QRS complexes are present AND pacemaker spikes occur — sometimes simultaneously",
      "Spikes fall after native beats at the pacemaker's set interval, without resetting",
      "The native QRS amplitude may be low on the ECG",
      "Fusion beats may be visible (native + paced beat overlap)",
    ],
    requiredAction:
      "Notify provider — undersensing risk of pacing on T wave (R-on-T) exists in some contexts. " +
      "Device sensitivity threshold may need adjustment. " +
      "If pacing on T wave occurs in a patient with prolonged QTc, monitor closely for torsades.",
    consequenceIfMistaken:
      "Pacing on T wave (R-on-T) can theoretically induce VT/VF in vulnerable myocardium.",
    safetyRisk: "high",
    teachingPearl:
      "Undersensing: the pacemaker is 'blind' to native beats and fires at its set interval regardless. " +
      "Look for spikes that don't respect the native QRS — they fire on schedule without resetting.",
  },

  // ── Lead placement issues ──────────────────────────────────────────────────

  {
    id: "telem-ra-la-reversal",
    title: "Right Arm / Left Arm Lead Reversal",
    category: "lead_issue",
    leadIssue: "right_left_arm_reversal",
    appearsToShow:
      "Negative QRS complex in lead I (which should almost always be positive). " +
      "Lead aVR appears 'positive' (normally always negative in adults). " +
      "P wave appears inverted in leads I and aVL.",
    actualRhythm:
      "Normal sinus rhythm with RA/LA lead reversal — the right and left arm electrodes are swapped.",
    howToDistinguish: [
      "Lead I normally shows a positive QRS in sinus rhythm — negative lead I = suspect reversal",
      "Lead aVR is normally the only lead that is consistently negatively deflected — positive aVR = reversal",
      "P wave is inverted in lead I — shouldn't be unless sinus rhythm with ectopic atrial origin",
      "Leads II and III appear to be switched (II looks like III and vice versa)",
      "Clinical exam confirms normal NSR — the ECG finding is the artifact",
    ],
    requiredAction:
      "Recheck electrode placement. Confirm RA electrode on right arm, LA electrode on left arm. " +
      "Repeat ECG after correcting the placement. Document the corrected ECG in the chart.",
    consequenceIfMistaken:
      "RA/LA reversal can mimic left axis deviation, dextrocardia, or lateral STEMI if misinterpreted. " +
      "An unnecessary STEMI workup may be initiated based on a lead placement error.",
    safetyRisk: "high",
    teachingPearl:
      "The two rules that catch most lead reversals: (1) Lead I should be positive in NSR. " +
      "(2) Lead aVR should always be negative in adults. If either violates these rules — check leads before treating.",
  },

  {
    id: "telem-precordial-misplacement",
    title: "Precordial Lead Misplacement — V Lead Errors",
    category: "lead_issue",
    leadIssue: "v_lead_misplacement",
    appearsToShow:
      "Poor R-wave progression across V leads, ST changes that don't fit a recognizable STEMI territory, " +
      "or unexplained T-wave inversions in the precordial leads.",
    actualRhythm:
      "Normal QRS morphology misrepresented due to precordial electrode placement in the wrong intercostal space or position.",
    howToDistinguish: [
      "R-wave progression should increase from V1 to V5/V6 (V1: rS pattern; V5/V6: qR pattern)",
      "V1 should be at the 4th intercostal space, right sternal border — frequently placed too high",
      "In women, V3–V5 electrodes are often incorrectly placed under the breast instead of at the proper ICS",
      "Repeat ECG with correct landmark-based placement resolves the abnormality",
    ],
    requiredAction:
      "Reapply precordial electrodes using anatomic landmarks. " +
      "V1: 4th ICS, right sternal border; V2: 4th ICS, left sternal border; V3: between V2 and V4; " +
      "V4: 5th ICS, midclavicular line; V5: anterior axillary line, same horizontal level as V4; " +
      "V6: midaxillary line, same level as V4–V5.",
    consequenceIfMistaken:
      "Misplaced precordial leads can create apparent ST changes, Q waves, or R-wave regression " +
      "that mimics anterior MI, causing unnecessary STEMI workup.",
    safetyRisk: "high",
    teachingPearl:
      "The most commonly misplaced lead is V1 — placed too high (3rd ICS instead of 4th ICS). " +
      "This creates false Q waves and apparent ST elevation in V1 that can trigger STEMI alerts.",
  },
];

// ─── Pacemaker function assessment framework ──────────────────────────────────

export type PacemakerFunctionAssessment = {
  /** Pacemaker mode (e.g. VVI, DDD) */
  mode: string;
  modeDescription: string;
  /** Is the pacemaker sensing correctly? */
  sensingAssessment: {
    status: "sensing" | "oversensing" | "undersensing";
    ecgFindings: string;
    clinicalImplication: string;
    nursingAction: string;
  };
  /** Is the pacemaker capturing correctly? */
  captureAssessment: {
    status: "capturing" | "failure_to_capture" | "intermittent_capture";
    ecgFindings: string;
    clinicalImplication: string;
    nursingAction: string;
  };
  /** Overall pacemaker function */
  overallFunction: "functioning_normally" | "malfunction_detected" | "needs_evaluation";
};

export function assessPacemakerFunction(
  spikesVisible: boolean,
  qrsAfterEachSpike: boolean,
  nativeQrsPresent: boolean,
  spikesDuringNativeQrs: boolean,
): PacemakerFunctionAssessment {
  const captureStatus =
    !spikesVisible ? "failure_to_pace" as const :
    qrsAfterEachSpike ? "capturing" as const : "failure_to_capture" as const;

  const sensingStatus =
    spikesDuringNativeQrs ? "undersensing" as const :
    !spikesVisible && nativeQrsPresent && !spikesDuringNativeQrs ? "oversensing" as const :
    "sensing" as const;

  const isNormal = captureStatus === "capturing" && sensingStatus === "sensing";

  return {
    mode: "VVI",
    modeDescription: "Ventricular-paced, ventricular-sensed, inhibited",
    sensingAssessment: {
      status: sensingStatus,
      ecgFindings:
        sensingStatus === "undersensing" ? "Spikes visible during native QRS complexes" :
        sensingStatus === "oversensing" ? "Absent spikes despite slow native rate — pacemaker inappropriately inhibited" :
        "Pacemaker appropriately inhibited by native QRS complexes",
      clinicalImplication:
        sensingStatus === "undersensing" ? "R-on-T risk in patients with prolonged QTc" :
        sensingStatus === "oversensing" ? "Bradycardia from pacemaker not providing backup pacing" :
        "Normal function",
      nursingAction:
        sensingStatus !== "sensing" ? "Notify provider — pacemaker sensitivity threshold adjustment may be needed" :
        "Continue monitoring",
    },
    captureAssessment: {
      status: captureStatus as "capturing" | "failure_to_capture" | "intermittent_capture",
      ecgFindings:
        captureStatus === "failure_to_capture" ? "Spikes visible without following QRS complexes" :
        captureStatus === "capturing" ? "Each spike followed by wide paced QRS" :
        "Intermittent spikes without QRS",
      clinicalImplication:
        captureStatus === "failure_to_capture" ? "PACING EMERGENCY — no ventricular response to pacing stimulus" :
        captureStatus === "capturing" ? "Pacemaker providing reliable ventricular rate support" :
        "Intermittent loss of pacing — monitor closely",
      nursingAction:
        captureStatus === "failure_to_capture" ?
          "IMMEDIATE provider notification. Assess hemodynamics. Prepare transcutaneous pacing as bridge." :
        captureStatus === "capturing" ? "Continue monitoring" :
        "Notify provider for threshold adjustment",
    },
    overallFunction: isNormal ? "functioning_normally" : "malfunction_detected",
  };
}

// ─── Accessor functions ────────────────────────────────────────────────────────

export function getTelemetryScenario(id: string): EcgTelemetryScenario | undefined {
  return ECG_TELEMETRY_SCENARIOS.find((s) => s.id === id);
}

export function getTelemetryScenariosByCategory(
  category: EcgTelemetryScenario["category"],
): ReadonlyArray<EcgTelemetryScenario> {
  return ECG_TELEMETRY_SCENARIOS.filter((s) => s.category === category);
}

export function getHighRiskTelemetryScenarios(): ReadonlyArray<EcgTelemetryScenario> {
  return ECG_TELEMETRY_SCENARIOS.filter(
    (s) => s.safetyRisk === "high" || s.safetyRisk === "life_threatening",
  );
}

export const TELEMETRY_SCENARIO_IDS: ReadonlyArray<string> =
  ECG_TELEMETRY_SCENARIOS.map((s) => s.id);
