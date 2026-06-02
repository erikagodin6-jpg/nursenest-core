/**
 * ECG Rhythm Progression Engine — Phase 2
 *
 * Models how rhythms deteriorate, what warning signs precede each transition,
 * what interventions interrupt the progression, and what the teaching value is
 * for each missed warning.
 *
 * Used by:
 *   - Simulation engine (which nodes connect to which)
 *   - Adaptive remediation (what did the learner miss?)
 *   - Lesson content (how are rhythms clinically connected?)
 *   - Clinical judgment cases (why did this happen?)
 *
 * ARCHITECTURE
 *   EcgProgressionMap is a directed graph:
 *     node  = a rhythm state
 *     edge  = a clinical deterioration or recovery transition
 *
 * INTEGRATION
 *   rhythmKey values match ECG_RHYTHM_TEMPLATES keys.
 *   interventionsThatInterrupt are verb phrases usable as question stems.
 *
 * CLINICAL ACCURACY NOTE
 *   Deterioration is not inevitable. Every edge has both a deterioration path
 *   and an intervention path. This models real clinical practice: timely
 *   intervention prevents the next step; delayed intervention allows it.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type EcgProgressionEdge = {
  /** Target rhythm state if deterioration continues uninterrupted */
  targetRhythmKey: string;
  /** Target rhythm human label */
  targetLabel: string;
  /**
   * Clinical trigger: what physiologic change drives this transition?
   * Used in debrief: "This happened because..."
   */
  clinicalTrigger: string;
  /**
   * Typical time window before this transition occurs without intervention.
   * Ranges are clinical estimates, not pharmacokinetic precision.
   */
  typicalOnsetWindow: string;
  /**
   * Warning signs visible in the preceding rhythm that, if acted on,
   * could prevent this transition.
   */
  missableWarnings: ReadonlyArray<string>;
  /**
   * Specific nursing/medical interventions that interrupt this progression.
   * Each is actionable: verb + specifics.
   */
  interventionsThatInterrupt: ReadonlyArray<string>;
  /**
   * What happens to the patient's hemodynamics during this transition.
   * Used in debrief and simulation scoring.
   */
  hemodynamicImpact: string;
  /** Teaching value: what is the clinical lesson from this specific edge? */
  teachingPoint: string;
  /** Whether this transition can be reversed with intervention (true) or is irreversible (false) */
  reversible: boolean;
};

export type EcgRhythmProgressionNode = {
  rhythmKey: string;
  rhythmLabel: string;
  /** Clinical risk at this state */
  riskLevel: "low" | "moderate" | "high" | "life_threatening";
  /** Clinical description of what this rhythm means for the patient at this state */
  clinicalStateDescription: string;
  /**
   * Possible deterioration edges from this rhythm.
   * Multiple edges represent branching deterioration paths (different causes).
   */
  deteriorationPaths: ReadonlyArray<EcgProgressionEdge>;
  /**
   * Recovery paths — how does this rhythm improve with intervention?
   * These represent successful management leading to a more stable state.
   */
  recoveryPaths: ReadonlyArray<{
    targetRhythmKey: string;
    targetLabel: string;
    intervention: string;
    prognosis: string;
  }>;
};

export type EcgProgressionMap = {
  id: string;
  title: string;
  /** The clinical context that drives this progression (e.g. "post-MI ischemia") */
  clinicalContext: string;
  /** Starting rhythm for this progression */
  startRhythmKey: string;
  /** Ordered nodes from most stable to most critical */
  nodes: ReadonlyArray<EcgRhythmProgressionNode>;
  /** Overall clinical lesson from this entire progression arc */
  overallTeachingTheme: string;
};

// ─── Progression maps ─────────────────────────────────────────────────────────

export const ECG_RHYTHM_PROGRESSION_MAPS: ReadonlyArray<EcgProgressionMap> = [

  // ══ MAP 1: PVC → VT → Pulseless VT → VF ══════════════════════════════════
  {
    id: "pvc-to-vf-cascade",
    title: "PVC → Bigeminy → VT → Pulseless VT → VF",
    clinicalContext:
      "Post-MI patient with reduced ejection fraction. Electrolyte derangement (hypokalemia, hypomagnesemia) or ischemia drives increasing ventricular ectopy.",
    startRhythmKey: "pvcs",
    overallTeachingTheme:
      "VF does not appear from nowhere. There is almost always a warning sequence: isolated PVCs → frequent PVCs → bigeminy → runs of VT → sustained VT → VF. " +
      "Each step is an intervention opportunity. Missing the early steps costs the patient the window for prevention.",
    nodes: [
      {
        rhythmKey: "pvcs",
        rhythmLabel: "Premature Ventricular Contractions",
        riskLevel: "moderate",
        clinicalStateDescription:
          "Occasional wide bizarre QRS beats interrupting a sinus rhythm. In a post-MI patient with EF < 40%, this is not benign — it is the beginning of a potential VT cascade.",
        deteriorationPaths: [
          {
            targetRhythmKey: "pvcs",
            targetLabel: "PVC Bigeminy / Couplets",
            clinicalTrigger: "Worsening hypokalemia, progressive ischemia, or catecholamine surge increases ectopic focus irritability",
            typicalOnsetWindow: "Minutes to hours without electrolyte correction or ischemia management",
            missableWarnings: [
              "Increasing PVC frequency (from 4/min to 12/min) — a trend, not a single snapshot",
              "R-on-T phenomenon: PVC falling on the T wave peak — the vulnerable period for VT induction",
              "K⁺ 3.4 mEq/L on recent labs — not replaced, contributing to ectopy",
              "PVCs now occurring in pairs (couplets) — 2 sequential wide beats",
            ],
            interventionsThatInterrupt: [
              "Potassium replacement: target K⁺ > 4.0 mEq/L in post-MI patients",
              "Magnesium replacement: target Mg²⁺ > 2.0 mg/dL",
              "Provider notification for PVC assessment and antiarrhythmic consideration",
              "12-lead ECG to assess for new ischemic changes",
            ],
            hemodynamicImpact:
              "Each PVC reduces cardiac output for that beat (no organized ventricular contraction). " +
              "With bigeminy, effective heart rate is halved — cardiac output may drop 20–30%.",
            teachingPoint:
              "A single isolated PVC in a healthy patient is benign. The same PVC in a post-MI patient with EF 30% and K⁺ 3.4 is a warning. Context determines urgency.",
            reversible: true,
          },
          {
            targetRhythmKey: "ventricular_tachycardia",
            targetLabel: "Sustained Ventricular Tachycardia",
            clinicalTrigger: "R-on-T phenomenon or consecutive ectopic beats trigger a re-entrant VT circuit within ischemic myocardium",
            typicalOnsetWindow: "Seconds from the triggering beat — VT onset is abrupt",
            missableWarnings: [
              "Runs of 3+ consecutive PVCs (non-sustained VT) before sustained VT",
              "Progressive HR increase in the 30 minutes before VT onset",
              "Patient reporting increasing palpitations or chest tightness",
            ],
            interventionsThatInterrupt: [
              "Early electrolyte correction (K⁺, Mg²⁺) before VT develops",
              "Antiarrhythmic therapy per provider order (amiodarone, lidocaine) for frequent PVCs in high-risk patients",
              "Ischemia management: antithrombotic therapy, rate control, reperfusion if indicated",
            ],
            hemodynamicImpact: "Sustained VT: cardiac output drops 50–90%. Patient becomes diaphoretic, hypotensive, or loses pulse.",
            teachingPoint:
              "Sustained VT requires immediate action. Unstable = cardioversion. Stable = amiodarone with standby cardioversion. Never 'watch and wait' on sustained VT.",
            reversible: true,
          },
        ],
        recoveryPaths: [
          {
            targetRhythmKey: "normal_sinus_rhythm",
            targetLabel: "Normal Sinus Rhythm",
            intervention: "Electrolyte correction (K⁺ and Mg²⁺ supplementation) and ischemia management",
            prognosis: "PVCs often resolve within 30–60 minutes of K⁺ > 4.0 mEq/L and Mg²⁺ > 2.0 mg/dL",
          },
        ],
      },
      {
        rhythmKey: "ventricular_tachycardia",
        rhythmLabel: "Sustained Ventricular Tachycardia",
        riskLevel: "high",
        clinicalStateDescription:
          "Regular wide-complex tachycardia at 120–250 BPM. The patient may be pulsatile (unstable-stable VT with pulse) or pulseless (cardiac arrest). The distinction drives every subsequent decision.",
        deteriorationPaths: [
          {
            targetRhythmKey: "ventricular_tachycardia",
            targetLabel: "Pulseless VT",
            clinicalTrigger: "Rapidly falling blood pressure from inadequate cardiac output; the ischemic myocardium cannot sustain mechanical contraction at the high rate",
            typicalOnsetWindow: "Seconds to minutes — pulsatile VT can become pulseless without warning",
            missableWarnings: [
              "BP trending down: 92/60 → 78/50 → non-palpable in 2 minutes",
              "Patient becoming increasingly confused or unresponsive",
              "Absent peripheral pulses despite QRS complexes on monitor",
            ],
            interventionsThatInterrupt: [
              "SYNCHRONIZED CARDIOVERSION immediately for unstable pulsatile VT — 100–200 J biphasic",
              "Amiodarone 150 mg IV over 10 minutes for stable pulsatile VT",
              "Correct underlying trigger: K⁺, Mg²⁺, ischemia",
            ],
            hemodynamicImpact: "Pulseless VT = cardiac arrest. Zero effective cardiac output. Brain injury begins within 4 minutes without CPR.",
            teachingPoint:
              "The difference between pulsatile and pulseless VT is a pulse check — a 10-second clinical assessment that determines CPR vs. cardioversion. Never skip the pulse check.",
            reversible: true,
          },
        ],
        recoveryPaths: [
          {
            targetRhythmKey: "normal_sinus_rhythm",
            targetLabel: "Normal Sinus Rhythm",
            intervention: "Synchronized cardioversion 100–200 J (unstable) or amiodarone 150 mg IV (stable)",
            prognosis: "Good if treated promptly. Underlying substrate (EF, K⁺, ischemia) must be corrected to prevent recurrence.",
          },
        ],
      },
      {
        rhythmKey: "ventricular_tachycardia",
        rhythmLabel: "Pulseless VT",
        riskLevel: "life_threatening",
        clinicalStateDescription:
          "Wide-complex tachycardia with NO palpable pulse. This is cardiac arrest. CPR and unsynchronized defibrillation are the interventions.",
        deteriorationPaths: [
          {
            targetRhythmKey: "ventricular_fibrillation",
            targetLabel: "Ventricular Fibrillation",
            clinicalTrigger: "Degeneration of organized VT wavefronts into multiple chaotic micro-reentrant circuits",
            typicalOnsetWindow: "30 seconds to 2 minutes without defibrillation",
            missableWarnings: [
              "Rhythm becoming irregular on the monitor (VT → VF transition)",
              "No defibrillation delivered for pulseless VT",
            ],
            interventionsThatInterrupt: [
              "UNSYNCHRONIZED DEFIBRILLATION 200 J biphasic — immediately upon recognizing pulseless VT",
              "High-quality CPR during charging to minimize pre-shock pause",
            ],
            hemodynamicImpact: "VF = complete loss of cardiac output. Every minute without defibrillation reduces survival by 7–10%.",
            teachingPoint:
              "Pulseless VT is treated identically to VF — UNSYNCHRONIZED defibrillation. Do not use synchronized cardioversion. The sync feature waits for a QRS it may not reliably detect in pulseless VT.",
            reversible: true,
          },
        ],
        recoveryPaths: [
          {
            targetRhythmKey: "normal_sinus_rhythm",
            targetLabel: "ROSC — Return of Spontaneous Circulation",
            intervention: "CPR + unsynchronized defibrillation 200 J → CPR 2 min → rhythm check → epinephrine 1 mg IV q3–5 min",
            prognosis: "ROSC achievable in ~50% of in-hospital pulseless VT with immediate CPR and defibrillation. Post-ROSC management critical.",
          },
        ],
      },
      {
        rhythmKey: "ventricular_fibrillation",
        rhythmLabel: "Ventricular Fibrillation",
        riskLevel: "life_threatening",
        clinicalStateDescription:
          "Chaotic electrical activity — no organized QRS, no cardiac output. ACLS cardiac arrest algorithm: CPR + defibrillation + epinephrine + amiodarone.",
        deteriorationPaths: [
          {
            targetRhythmKey: "asystole",
            targetLabel: "Asystole",
            clinicalTrigger: "Prolonged VF depletes myocardial energy stores; fibrillatory amplitude decreases ('fine VF') until electrical activity ceases",
            typicalOnsetWindow: "Fine VF appears after 4–8 minutes without defibrillation; asystole typically follows within 10–15 minutes",
            missableWarnings: [
              "Decreasing VF amplitude on the monitor (coarse → fine VF) — suggests cardiac energy depletion",
              "CPR quality declining (fatigue, compression depth decreasing)",
            ],
            interventionsThatInterrupt: [
              "DEFIBRILLATION — must occur before fine VF degenerates to asystole",
              "High-quality CPR (100–120/min, 5–6 cm depth, full recoil) maintains some coronary perfusion pressure",
              "Amiodarone 300 mg IV after ≥2 shocks for refractory VF",
              "Identify and treat 6Hs and 5Ts (reversible causes)",
            ],
            hemodynamicImpact: "Asystole has zero cardiac output and is not shockable. Survival from asystole < 5% without a reversible cause.",
            teachingPoint:
              "Time kills in VF. Every minute without defibrillation = 7–10% reduction in survival. Don't delay defibrillation for IV access, intubation, or medications.",
            reversible: false,
          },
        ],
        recoveryPaths: [
          {
            targetRhythmKey: "normal_sinus_rhythm",
            targetLabel: "ROSC",
            intervention: "Defibrillation 200 J → CPR 2 min → rhythm check. Epinephrine 1 mg q3–5 min. Amiodarone 300 mg after ≥2 shocks.",
            prognosis: "Best outcomes with defibrillation within 3 minutes of VF onset. Post-ROSC: 12-lead ECG for STEMI, TTM consideration, ICU transfer.",
          },
        ],
      },
    ],
  },

  // ══ MAP 2: Sinus Brady → Symptomatic Brady → CHB → Asystole ══════════════
  {
    id: "bradycardia-to-asystole",
    title: "Sinus Bradycardia → Symptomatic Brady → Complete Heart Block → Asystole",
    clinicalContext:
      "Inferior MI with RCA involvement, medication toxicity (beta-blocker overdose, digoxin), or intrinsic conduction disease. SA node or AV node fails progressively.",
    startRhythmKey: "sinus_bradycardia",
    overallTeachingTheme:
      "Bradycardia is a spectrum. Asymptomatic bradycardia in an athlete is physiologic. " +
      "The same rate in a post-MI patient with hypotension is a pacing emergency. " +
      "The clinical assessment — not the rate alone — determines the urgency.",
    nodes: [
      {
        rhythmKey: "sinus_bradycardia",
        rhythmLabel: "Sinus Bradycardia",
        riskLevel: "moderate",
        clinicalStateDescription:
          "Rate < 60 BPM with maintained sinus P-wave-to-QRS conduction. May be asymptomatic (athlete, vagal) or symptomatic (ischemia, drug toxicity, SA node disease).",
        deteriorationPaths: [
          {
            targetRhythmKey: "second_degree_type_ii_av_block",
            targetLabel: "Mobitz II AV Block",
            clinicalTrigger: "Ischemia or infiltration of the infranodal conduction system causes intermittent failure to conduct atrial impulses to the ventricles",
            typicalOnsetWindow: "Hours in progressive AV conduction disease; minutes in acute inferior MI",
            missableWarnings: [
              "Progressive first-degree AV block (lengthening PR) preceding Mobitz II in some cases",
              "Occasional dropped QRS beats on telemetry (non-conducted P waves)",
              "Patient reporting intermittent lightheadedness or near-syncope",
              "New inferior STEMI with bradycardia — high risk for AV block progression",
            ],
            interventionsThatInterrupt: [
              "Immediate cardiology notification for any new high-degree AV block",
              "External transcutaneous pacing pads applied and standby",
              "Reversal of AV-blocking medications (hold digoxin, beta-blocker)",
              "Reperfusion for inferior STEMI (PCI) — RCA reperfusion often reverses ischemic AV block",
            ],
            hemodynamicImpact: "Dropped QRS beats reduce effective heart rate. With 3:1 or 4:1 block, effective rate may be 20–30 BPM — insufficient for perfusion.",
            teachingPoint:
              "Mobitz II is not benign bradycardia. It is an infranodal block that can progress to complete heart block without warning — minutes, not hours.",
            reversible: true,
          },
        ],
        recoveryPaths: [
          {
            targetRhythmKey: "normal_sinus_rhythm",
            targetLabel: "Normal Sinus Rhythm",
            intervention: "Treat the underlying cause: hold offending medications, correct hypothyroidism, reperfuse ischemic RCA territory, address vagal tone",
            prognosis: "Sinus bradycardia from reversible causes (medications, vagal, hypothyroidism) resolves with cause treatment.",
          },
        ],
      },
      {
        rhythmKey: "third_degree_av_block",
        rhythmLabel: "Complete Heart Block",
        riskLevel: "life_threatening",
        clinicalStateDescription:
          "No atrial impulses conduct to the ventricles. SA node fires normally (P waves march at sinus rate); ventricles escape at 20–60 BPM from a junctional or ventricular pacemaker.",
        deteriorationPaths: [
          {
            targetRhythmKey: "asystole",
            targetLabel: "Asystole",
            clinicalTrigger: "The escape pacemaker (junctional or ventricular) fails or is suppressed — no reliable backup pacemaker remains active",
            typicalOnsetWindow: "Seconds to minutes when escape pacemaker suppressed or fatigued (Stokes-Adams attack)",
            missableWarnings: [
              "Escape rate slowing over time — 42 BPM → 35 BPM → 28 BPM suggests escape pacemaker failing",
              "Increasing ventricular pauses between escape beats",
              "Patient reporting near-syncope, worsening confusion, or Stokes-Adams episodes",
            ],
            interventionsThatInterrupt: [
              "TRANSCUTANEOUS PACING — set rate 60 BPM, increase mA until electrical capture, confirm mechanical capture with pulse check",
              "Dopamine or epinephrine infusion to support escape rate while preparing for pacing",
              "Transvenous temporary pacemaker placement for definitive rate support",
            ],
            hemodynamicImpact: "When escape pacemaker fails in CHB, effective heart rate becomes 0 — cardiac arrest (asystole).",
            teachingPoint:
              "CHB with ventricular escape is a pacing emergency. The escape pacemaker is unreliable and can fail without warning. Do not wait for symptoms to worsen before initiating pacing.",
            reversible: true,
          },
        ],
        recoveryPaths: [
          {
            targetRhythmKey: "sinus_bradycardia",
            targetLabel: "Sinus Rhythm with Restored Conduction",
            intervention: "Transcutaneous/transvenous pacing (definitive) + treat underlying cause (ischemia, medication, infiltrative disease)",
            prognosis: "Post-MI CHB resolves in 50% of inferior MI cases within 7 days with reperfusion. Persistent CHB > 7–10 days usually requires permanent pacemaker.",
          },
        ],
      },
    ],
  },

  // ══ MAP 3: AFib → RVR → Hemodynamic Instability ══════════════════════════
  {
    id: "afib-rvr-deterioration",
    title: "AFib → Rapid Ventricular Response → Hemodynamic Compromise → Cardiovascular Collapse",
    clinicalContext:
      "New-onset or uncontrolled chronic AFib in a patient with underlying cardiac disease " +
      "(HF, valvular disease, hypertrophic cardiomyopathy). Loss of atrial kick + rapid rate = falling cardiac output.",
    startRhythmKey: "atrial_fibrillation",
    overallTeachingTheme:
      "AFib's hemodynamic impact is determined by ventricular rate, duration, and underlying cardiac function. " +
      "The same AF rhythm can be well-tolerated in a healthy heart and immediately life-threatening in a failing heart.",
    nodes: [
      {
        rhythmKey: "atrial_fibrillation",
        rhythmLabel: "AFib — Controlled Rate",
        riskLevel: "moderate",
        clinicalStateDescription:
          "AFib with ventricular response 60–100 BPM. Hemodynamically stable, may be asymptomatic. Loss of atrial kick reduces CO by 10–20% but is usually compensated.",
        deteriorationPaths: [
          {
            targetRhythmKey: "atrial_fibrillation",
            targetLabel: "AFib with Rapid Ventricular Response (RVR)",
            clinicalTrigger:
              "Increased sympathetic tone (infection, pain, thyrotoxicosis, dehydration), loss of rate-controlling medication, or new AF onset without rate control",
            typicalOnsetWindow: "Rate can accelerate from controlled to RVR within minutes with a strong sympathetic stimulus",
            missableWarnings: [
              "Rate trending upward on telemetry: 88 → 98 → 112 → 128 BPM over 2 hours",
              "Patient reporting increased palpitations or dyspnea",
              "New fever — infection is a common AF accelerant",
              "Rate-controlling medication withheld or dose reduced",
            ],
            interventionsThatInterrupt: [
              "IV metoprolol 5 mg over 5 minutes (repeat up to 3 doses) for rate control — first-line in most patients",
              "IV diltiazem 0.25 mg/kg over 2 minutes for rate control (avoid in HFrEF)",
              "Treat precipitating cause: antibiotics for infection, thyroid management for thyrotoxicosis",
              "Do NOT use IV AV nodal agents if WPW suspected",
            ],
            hemodynamicImpact:
              "AF with RVR (HR > 100–110): diastolic filling time is critically reduced. " +
              "Stroke volume falls. In HF patients, pulmonary edema can develop within 30 minutes of sustained RVR.",
            teachingPoint:
              "Controlled AF rate does not mean no action needed — monitor trends. A rate of 94 that was 72 one hour ago is a clinical alert, not a normal finding.",
            reversible: true,
          },
        ],
        recoveryPaths: [
          {
            targetRhythmKey: "normal_sinus_rhythm",
            targetLabel: "Normal Sinus Rhythm",
            intervention: "Pharmacologic cardioversion (flecainide, amiodarone) or electrical cardioversion after anticoagulation assessment",
            prognosis: "Controlled AF is manageable long-term. Rate control target HR < 80 at rest, < 110 with activity.",
          },
        ],
      },
      {
        rhythmKey: "atrial_fibrillation",
        rhythmLabel: "AFib with RVR",
        riskLevel: "high",
        clinicalStateDescription:
          "AFib with ventricular rate > 100–110 BPM. Patient symptomatic: palpitations, dyspnea, chest discomfort. BP may be falling if underlying cardiac reserve is limited.",
        deteriorationPaths: [
          {
            targetRhythmKey: "atrial_fibrillation",
            targetLabel: "Hemodynamically Unstable AFib",
            clinicalTrigger:
              "Cardiac output falls below the threshold to maintain systemic perfusion. " +
              "This threshold is lower in patients with reduced EF, valvular disease, or hypertrophic cardiomyopathy.",
            typicalOnsetWindow: "Minutes to hours depending on cardiac reserve. Faster in patients with HF (minutes); slower in healthy hearts.",
            missableWarnings: [
              "BP dropping from baseline: 124/80 → 104/68 → 86/54",
              "SpO₂ declining — pulmonary edema from elevated LA pressure",
              "Patient becoming diaphoretic, confused, or obtunded",
              "Urine output dropping — renal hypoperfusion",
            ],
            interventionsThatInterrupt: [
              "IV rate control agents (metoprolol, diltiazem) to reduce HR — improve diastolic filling",
              "Supplemental oxygen for hypoxia",
              "Provider notification and rapid response activation",
            ],
            hemodynamicImpact:
              "Cardiac output insufficient to maintain end-organ perfusion. Patient in early cardiogenic shock.",
            teachingPoint:
              "Hemodynamic instability from AFib is an emergency. Rate control medications alone may not act fast enough — prepare for synchronized cardioversion.",
            reversible: true,
          },
        ],
        recoveryPaths: [
          {
            targetRhythmKey: "atrial_fibrillation",
            targetLabel: "AFib — Controlled Rate",
            intervention: "IV metoprolol or diltiazem titrated to HR < 100 BPM",
            prognosis: "Rate control restores hemodynamic stability in most patients within 30–60 minutes.",
          },
        ],
      },
    ],
  },

  // ══ MAP 4: STEMI → Ventricular Ectopy → VT → VF ═════════════════════════
  {
    id: "stemi-to-vf",
    title: "STEMI → Ventricular Ectopy → VT → VF — Ischemic VF",
    clinicalContext:
      "Acute coronary occlusion creates an ischemic zone of myocardium. This electrically unstable " +
      "tissue acts as a VT/VF substrate. Reperfusion (PCI) is the definitive intervention preventing VF.",
    startRhythmKey: "stemi_pattern",
    overallTeachingTheme:
      "STEMI is a VF risk until the coronary is opened. Every minute of delay increases the " +
      "ischemic area and the VF risk. Time to PCI is the most important determinant of outcome.",
    nodes: [
      {
        rhythmKey: "stemi_pattern",
        rhythmLabel: "STEMI — Active Ischemia",
        riskLevel: "life_threatening",
        clinicalStateDescription:
          "Complete coronary occlusion producing transmural ischemia. ST elevation visible in contiguous leads. " +
          "The ischemic myocardium is electrically unstable — VT and VF can occur at any time.",
        deteriorationPaths: [
          {
            targetRhythmKey: "pvcs",
            targetLabel: "PVCs — Ischemic Ectopy",
            clinicalTrigger: "Injured myocardial cells develop abnormal automaticity and triggered activity from the ischemic border zone",
            typicalOnsetWindow: "PVCs may appear within minutes of coronary occlusion",
            missableWarnings: ["PVCs in the setting of STEMI are HIGH risk for VT induction — do not reassure"],
            interventionsThatInterrupt: [
              "Emergent PCI — opening the culprit artery is the definitive intervention",
              "Anticoagulation and antiplatelet therapy to limit clot propagation",
              "Electrolyte correction — K⁺ > 4.0, Mg²⁺ > 2.0 in all STEMI patients",
            ],
            hemodynamicImpact: "PVCs reduce cardiac output and signal VT/VF vulnerability.",
            teachingPoint:
              "PVCs in STEMI are not 'just PVCs' — they are warnings that the ischemic substrate is ready to generate VT. Reperfusion is the treatment.",
            reversible: true,
          },
          {
            targetRhythmKey: "ventricular_fibrillation",
            targetLabel: "Primary VF — STEMI Complication",
            clinicalTrigger: "R-on-T phenomenon or rapid VT degeneration from an ischemic focus — can occur without preceding warning PVCs",
            typicalOnsetWindow: "Can occur within minutes of STEMI onset, peak risk in first 4 hours",
            missableWarnings: ["STEMI itself is the warning — VF is a complication of untreated ischemia"],
            interventionsThatInterrupt: [
              "Emergent PCI — every minute of delay increases primary VF risk",
              "Defibrillator pads applied to all STEMI patients immediately",
              "Crash cart at bedside in all STEMI patients",
            ],
            hemodynamicImpact: "Primary VF = cardiac arrest. Treated with ACLS protocol.",
            teachingPoint:
              "STEMI patients can go directly to VF without warning. Defibrillator pads must be applied at the time of STEMI diagnosis — before the catheterization lab.",
            reversible: true,
          },
        ],
        recoveryPaths: [
          {
            targetRhythmKey: "idioventricular_rhythm",
            targetLabel: "AIVR — Reperfusion Rhythm",
            intervention: "Successful PCI with coronary recanalization — AIVR is a sign of reperfusion (do not treat)",
            prognosis: "AIVR (accelerated idioventricular rhythm) at 40–100 BPM post-PCI = benign reperfusion arrhythmia. Self-terminates within 30 minutes.",
          },
          {
            targetRhythmKey: "normal_sinus_rhythm",
            targetLabel: "Normal Sinus Rhythm",
            intervention: "Successful emergent PCI with TIMI 3 flow restoration",
            prognosis: "ST resolution > 50% within 90 minutes of PCI is the primary marker of successful reperfusion.",
          },
        ],
      },
    ],
  },
];

// ─── Accessor functions ────────────────────────────────────────────────────────

export function getProgressionMap(id: string): EcgProgressionMap | undefined {
  return ECG_RHYTHM_PROGRESSION_MAPS.find((m) => m.id === id);
}

/**
 * Returns all deterioration edges from a given rhythm across all progression maps.
 * Used by the adaptive remediation engine to surface relevant warning content.
 */
export function getDeteriorationPathsFrom(rhythmKey: string): ReadonlyArray<EcgProgressionEdge> {
  const paths: EcgProgressionEdge[] = [];
  for (const map of ECG_RHYTHM_PROGRESSION_MAPS) {
    for (const node of map.nodes) {
      if (node.rhythmKey === rhythmKey) {
        paths.push(...node.deteriorationPaths);
      }
    }
  }
  return paths;
}

/**
 * Returns all missable warnings for a given rhythm across all progression maps.
 * Used in simulation debrief: "Here is what you could have caught earlier."
 */
export function getMissableWarningsForRhythm(rhythmKey: string): ReadonlyArray<string> {
  const warnings: string[] = [];
  for (const map of ECG_RHYTHM_PROGRESSION_MAPS) {
    for (const node of map.nodes) {
      for (const edge of node.deteriorationPaths) {
        if (node.rhythmKey === rhythmKey) {
          warnings.push(...edge.missableWarnings);
        }
      }
    }
  }
  return [...new Set(warnings)];
}

/**
 * Returns all interventions that interrupt deterioration for a given target rhythm.
 * Used to generate "what would have helped" content in debrief and remediation.
 */
export function getInterventionsThatPrevent(
  fromRhythmKey: string,
  toRhythmKey: string,
): ReadonlyArray<string> {
  for (const map of ECG_RHYTHM_PROGRESSION_MAPS) {
    for (const node of map.nodes) {
      if (node.rhythmKey === fromRhythmKey) {
        const edge = node.deteriorationPaths.find((e) => e.targetRhythmKey === toRhythmKey);
        if (edge) return edge.interventionsThatInterrupt;
      }
    }
  }
  return [];
}

export const ALL_PROGRESSION_MAP_IDS: ReadonlyArray<string> =
  ECG_RHYTHM_PROGRESSION_MAPS.map((m) => m.id);
