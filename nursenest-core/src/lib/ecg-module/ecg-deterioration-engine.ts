/**
 * ECG Rhythm Deterioration Engine
 *
 * Defines clinical deterioration pathways and the decision-tree logic
 * that governs learner outcomes. Learner decisions change which stage
 * the patient reaches next.
 *
 * Design principles:
 *   - Physiologically accurate progression sequence
 *   - Correct decisions slow or prevent deterioration
 *   - Incorrect decisions (or inaction) accelerate progression
 *   - Outcome scoring rewards early recognition and timely escalation
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export type DeteriorationOutcomeType =
  | "prevented"   // Learner stopped the deterioration pathway
  | "delayed"     // Learner slowed progression (partial credit)
  | "unchanged"   // Learner action had no effect
  | "accelerated" // Learner action worsened the situation
  | "arrested";   // Cardiac arrest occurred

export type DeteriorationDecisionOption = {
  /** Display label for this option */
  action: string;
  /** Outcome of choosing this action */
  outcome: DeteriorationOutcomeType;
  /** ID of the next stage (null = pathway ends) */
  nextStageId: string | null;
  /** Clinical explanation of why this action had this outcome */
  feedback: string;
  /** Points earned for this decision */
  points: number;
};

export type DeteriorationStage = {
  id: string;
  /** Rhythm displayed at this stage */
  rhythmKey: string;
  /** Rate to render this rhythm's strip */
  displayRate?: number;
  /** Clinical context narration */
  clinicalContext: string;
  /** Warning signs visible at this stage */
  warningSignsPresent: string[];
  /** Vital signs at this stage */
  vitals: {
    hr: string;
    bp: string;
    spo2: string;
    rr?: string;
    loc?: string;
  };
  /** The question the learner must answer */
  decisionPrompt: string;
  /** Available choices (1 correct, 2–3 incorrect or suboptimal) */
  options: DeteriorationDecisionOption[];
  /** Time limit in seconds before auto-advancing to worst outcome (null = no limit) */
  timeLimitSeconds: number | null;
};

export type DeteriorationPathway = {
  id: string;
  title: string;
  description: string;
  difficulty: "basic" | "intermediate" | "advanced";
  /** Clinical tags for curriculum mapping */
  tags: string[];
  /** Rhythm key that starts the pathway */
  startRhythmKey: string;
  /** Ordered stage array — branching is handled within each stage's options */
  stages: DeteriorationStage[];
  /** Final outcome descriptions keyed by the terminal stage ID */
  outcomes: Record<string, { title: string; narrative: string; prevented: boolean }>;
  /** Maximum score possible (sum of all best-path points) */
  maxScore: number;
};

// ─── Pathways ─────────────────────────────────────────────────────────────────

export const ECG_DETERIORATION_PATHWAYS: DeteriorationPathway[] = [

  // ── PVC → VT → VF ──────────────────────────────────────────────────────────
  {
    id: "pvc-to-vf",
    title: "PVC Burden → Ventricular Fibrillation",
    description: "A post-MI patient develops increasing PVC burden. Early recognition and electrolyte correction can prevent VF.",
    difficulty: "intermediate",
    tags: ["pvcs", "ventricular_tachycardia", "ventricular_fibrillation", "acls", "post-mi"],
    startRhythmKey: "pvcs",
    stages: [
      {
        id: "s1-pvcs-isolated",
        rhythmKey: "pvcs",
        displayRate: 85,
        clinicalContext: "Day 2 post-anterior STEMI. Telemetry shows isolated PVCs. K⁺ 3.2 mEq/L, Mg²⁺ 0.6 mmol/L.",
        warningSignsPresent: ["Isolated PVCs", "Electrolyte abnormalities", "Post-MI context"],
        vitals: { hr: "85 irregular", bp: "118/74", spo2: "97%" },
        decisionPrompt: "Telemetry shows isolated PVCs in a post-STEMI patient with low K⁺ and Mg²⁺. What is your priority action?",
        options: [
          {
            action: "Check electrolytes and replace K⁺ and Mg²⁺ per protocol; notify provider",
            outcome: "prevented",
            nextStageId: "s1-pvcs-corrected",
            feedback: "Correct. Hypokalemia and hypomagnesemia are common PVC triggers post-MI. Correcting these reduces ectopy significantly.",
            points: 25,
          },
          {
            action: "Document the PVCs and continue monitoring",
            outcome: "unchanged",
            nextStageId: "s2-pvcs-bigeminy",
            feedback: "Insufficient action. In a post-MI patient with electrolyte abnormalities, monitoring alone without correction allows PVC burden to increase.",
            points: 5,
          },
          {
            action: "Administer prophylactic lidocaine IV",
            outcome: "accelerated",
            nextStageId: "s2-pvcs-bigeminy",
            feedback: "Incorrect. Routine prophylactic lidocaine in post-MI PVCs increases mortality (CAST trial). Correct the electrolytes instead.",
            points: 0,
          },
          {
            action: "Notify the physician for amiodarone order",
            outcome: "delayed",
            nextStageId: "s2-pvcs-bigeminy",
            feedback: "Premature escalation. Amiodarone is not first-line for isolated PVCs. Electrolyte correction is the priority.",
            points: 10,
          },
        ],
        timeLimitSeconds: 120,
      },
      {
        id: "s2-pvcs-bigeminy",
        rhythmKey: "pvcs",
        displayRate: 90,
        clinicalContext: "30 minutes later. PVCs now every other beat (bigeminy). K⁺ has not been replaced yet. Patient reports palpitations.",
        warningSignsPresent: ["PVC bigeminy", "Worsening PVC burden", "Symptomatic"],
        vitals: { hr: "90 irregular", bp: "112/70", spo2: "96%" },
        decisionPrompt: "PVC bigeminy is now present with symptoms. What should you do?",
        options: [
          {
            action: "Urgently replace K⁺ and Mg²⁺; notify provider immediately; obtain 12-lead ECG",
            outcome: "delayed",
            nextStageId: "s3-couplets",
            feedback: "Correct escalation — but the delay in initial correction means PVC burden has progressed. Replacement and notification are both needed.",
            points: 20,
          },
          {
            action: "Continue monitoring — bigeminy is not dangerous",
            outcome: "accelerated",
            nextStageId: "s3-couplets",
            feedback: "Wrong. Bigeminy in post-MI with electrolyte deficits is a warning sign of impending VT. Action is required.",
            points: 0,
          },
        ],
        timeLimitSeconds: 90,
      },
      {
        id: "s3-couplets",
        rhythmKey: "pvcs",
        displayRate: 95,
        clinicalContext: "PVC couplets now visible. Patient is increasingly anxious. K⁺ replacement underway but incomplete.",
        warningSignsPresent: ["PVC couplets", "Escalating ectopy", "Incomplete electrolyte replacement"],
        vitals: { hr: "95 very irregular", bp: "105/68", spo2: "95%" },
        decisionPrompt: "PVC couplets are now occurring. Electrolyte replacement is underway. What is the next most important action?",
        options: [
          {
            action: "Increase monitoring to continuous print, notify provider, ensure IV access, have defibrillator at bedside",
            outcome: "delayed",
            nextStageId: "s4-vt-onset",
            feedback: "Good actions — defibrillator readiness is critical. The transition to VT may still occur, but your preparation improves safety.",
            points: 20,
          },
          {
            action: "Administer IV amiodarone 150mg",
            outcome: "unchanged",
            nextStageId: "s4-vt-onset",
            feedback: "Premature. Amiodarone is not first-line for PVC couplets. The electrolyte replacement needs to complete first.",
            points: 5,
          },
        ],
        timeLimitSeconds: 60,
      },
      {
        id: "s4-vt-onset",
        rhythmKey: "ventricular_tachycardia",
        displayRate: 160,
        clinicalContext: "Telemetry alarm: wide complex tachycardia at 160 BPM. Patient is pale, diaphoretic.",
        warningSignsPresent: ["Rapid wide-complex tachycardia", "Haemodynamic change", "Diaphoresis"],
        vitals: { hr: "160 wide complex", bp: "88/54", spo2: "93%", loc: "Alert but distressed" },
        decisionPrompt: "Wide complex tachycardia at 160 BPM with haemodynamic compromise. What is the immediate action?",
        options: [
          {
            action: "Check pulse; if present and unstable → synchronised cardioversion",
            outcome: "prevented",
            nextStageId: "s5-vt-converted",
            feedback: "Correct ACLS response. Unstable VT with pulse = synchronised cardioversion. This prevents VF.",
            points: 30,
          },
          {
            action: "Give adenosine 6mg IV — could be SVT",
            outcome: "accelerated",
            nextStageId: "s5-vf",
            feedback: "Dangerous error. Adenosine does not treat VT and in some cases can precipitate haemodynamic collapse in VT. Wide complex with instability = treat as VT.",
            points: 0,
          },
          {
            action: "Give IV amiodarone 150mg over 10 minutes",
            outcome: "delayed",
            nextStageId: "s4-vt-persists",
            feedback: "Amiodarone is appropriate for stable VT but this patient is unstable. The medication takes too long — cardioversion is needed now.",
            points: 10,
          },
        ],
        timeLimitSeconds: 45,
      },
      {
        id: "s4-vt-persists",
        rhythmKey: "ventricular_tachycardia",
        displayRate: 165,
        clinicalContext: "VT continues despite amiodarone infusion. BP 82/50 and falling. Patient losing consciousness.",
        warningSignsPresent: ["Haemodynamic deterioration", "Declining LOC"],
        vitals: { hr: "165", bp: "82/50", spo2: "90%", loc: "Confused" },
        decisionPrompt: "VT persists, patient deteriorating. What now?",
        options: [
          {
            action: "Immediate synchronised cardioversion 200J",
            outcome: "prevented",
            nextStageId: "s5-vt-converted",
            feedback: "Correct — cardioversion is the right treatment for haemodynamically unstable VT with pulse. This stops the deterioration.",
            points: 25,
          },
          {
            action: "Increase amiodarone infusion rate",
            outcome: "arrested",
            nextStageId: "s5-vf",
            feedback: "Fatal delay. The patient progressed to cardiac arrest while waiting for medication. Unstable VT requires cardioversion.",
            points: 0,
          },
        ],
        timeLimitSeconds: 30,
      },
      {
        id: "s5-vf",
        rhythmKey: "ventricular_fibrillation",
        displayRate: 0,
        clinicalContext: "CARDIAC ARREST. Monitor shows chaotic VF. Patient is pulseless and unresponsive.",
        warningSignsPresent: ["Cardiac arrest", "VF"],
        vitals: { hr: "VF", bp: "0/0", spo2: "Undetectable", loc: "Unresponsive" },
        decisionPrompt: "The patient is in VF and pulseless. What is the immediate action?",
        options: [
          {
            action: "Call code blue, start CPR, charge defibrillator to 200J biphasic and defibrillate",
            outcome: "delayed",
            nextStageId: "s6-post-arrest",
            feedback: "Correct ACLS response. The arrest was preventable but the correct response to VF is CPR + immediate defibrillation.",
            points: 15,
          },
          {
            action: "Apply synchronised cardioversion",
            outcome: "unchanged",
            nextStageId: "s6-post-arrest",
            feedback: "Wrong mode. VF requires UNSYNCHRONISED defibrillation. The sync mode cannot detect a QRS in VF and will not deliver a shock.",
            points: 0,
          },
        ],
        timeLimitSeconds: null,
      },
      {
        id: "s5-vt-converted",
        rhythmKey: "normal_sinus_rhythm",
        displayRate: 88,
        clinicalContext: "Cardioversion successful. Sinus rhythm restored at 88 BPM. Patient stabilising.",
        warningSignsPresent: [],
        vitals: { hr: "88 regular", bp: "105/68", spo2: "96%", loc: "Alert and improving" },
        decisionPrompt: "Patient has converted to sinus rhythm. What are the post-cardioversion priorities?",
        options: [
          {
            action: "Complete K⁺/Mg²⁺ replacement, continuous monitoring, notify cardiology, document events",
            outcome: "prevented",
            nextStageId: null,
            feedback: "Excellent. Post-cardioversion management includes electrolyte correction, continuous monitoring, and cardiology involvement.",
            points: 20,
          },
          {
            action: "Discontinue electrolyte replacement — rhythm is now normal",
            outcome: "accelerated",
            nextStageId: null,
            feedback: "Wrong. Electrolyte deficits remain and must be corrected to prevent VT recurrence.",
            points: 0,
          },
        ],
        timeLimitSeconds: null,
      },
      {
        id: "s6-post-arrest",
        rhythmKey: "normal_sinus_rhythm",
        displayRate: 78,
        clinicalContext: "Return of spontaneous circulation (ROSC) after 8 minutes of CPR and 2 defibrillation attempts.",
        warningSignsPresent: ["Post-arrest", "Hypoxic-ischaemic brain injury risk"],
        vitals: { hr: "78 post-arrest", bp: "96/58", spo2: "88%", loc: "Unconscious" },
        decisionPrompt: "ROSC achieved. What is the post-ROSC priority?",
        options: [
          {
            action: "Initiate targeted temperature management, ICU transfer, troponin, arrange coronary angiography",
            outcome: "prevented",
            nextStageId: null,
            feedback: "Correct post-ROSC care bundle. This pathway should have been prevented earlier — it now requires intensive post-arrest management.",
            points: 15,
          },
        ],
        timeLimitSeconds: null,
      },
    ],
    outcomes: {
      "s1-pvcs-corrected": {
        title: "Deterioration Prevented",
        narrative: "Excellent clinical judgment. Early electrolyte correction stopped the PVC escalation pathway before it progressed. The patient remained in stable sinus rhythm throughout.",
        prevented: true,
      },
      "s5-vt-converted": {
        title: "Arrest Prevented — VT Terminated",
        narrative: "Timely cardioversion prevented VF arrest. The pathway was not stopped at the earliest opportunity but the correct response to unstable VT was executed.",
        prevented: true,
      },
      "s6-post-arrest": {
        title: "Cardiac Arrest Occurred",
        narrative: "The patient arrested and required CPR and defibrillation. ROSC was achieved. The arrest was preventable with earlier electrolyte correction and more aggressive monitoring.",
        prevented: false,
      },
    },
    maxScore: 145,
  },

  // ── Mobitz II → Complete Heart Block ───────────────────────────────────────
  {
    id: "mobitz2-to-chb",
    title: "Mobitz II → Complete Heart Block",
    description: "A post-anterior MI patient develops Mobitz II. The learner must recognise the high risk of progression and initiate pacing before complete block occurs.",
    difficulty: "advanced",
    tags: ["second_degree_type_ii_av_block", "third_degree_av_block", "pacing", "anterior-mi"],
    startRhythmKey: "second_degree_type_ii_av_block",
    stages: [
      {
        id: "s1-mobitz2-identified",
        rhythmKey: "second_degree_type_ii_av_block",
        displayRate: 55,
        clinicalContext: "Anterior STEMI patient, Day 1 post-PCI. Telemetry shows wide QRS Mobitz II with 3:1 block at 55 BPM.",
        warningSignsPresent: ["Mobitz II", "Wide QRS", "Anterior MI context", "High risk of complete block"],
        vitals: { hr: "55 regularly irregular", bp: "102/64", spo2: "95%", loc: "Alert, mild dizziness" },
        decisionPrompt: "Wide QRS Mobitz II is identified in an anterior MI patient. What is the correct response?",
        options: [
          {
            action: "Notify provider immediately, prepare transcutaneous pacing pads, establish IV access, call cardiology for transvenous pacing",
            outcome: "prevented",
            nextStageId: "s2-pacing-active",
            feedback: "Correct. Mobitz II in anterior MI is a pacing emergency. Transcutaneous pacing while arranging transvenous pacing is the standard approach.",
            points: 30,
          },
          {
            action: "Administer atropine 0.5mg IV and monitor response",
            outcome: "accelerated",
            nextStageId: "s2-atropine-fails",
            feedback: "Dangerous. Atropine is usually ineffective for infranodal (Mobitz II) block. Worse, it may increase the atrial rate while NOT improving ventricular conduction — more P-waves attempting to conduct with an already-diseased bundle.",
            points: 0,
          },
          {
            action: "Notify provider and increase monitoring frequency",
            outcome: "delayed",
            nextStageId: "s2-block-progresses",
            feedback: "Insufficient. Monitoring without pacing preparation in Mobitz II is dangerous. The block can progress to complete block without warning.",
            points: 5,
          },
        ],
        timeLimitSeconds: 90,
      },
      {
        id: "s2-atropine-fails",
        rhythmKey: "second_degree_type_ii_av_block",
        displayRate: 38,
        clinicalContext: "After atropine, the sinus rate has increased to 95 but the ventricular rate has dropped to 38. The block is worse.",
        warningSignsPresent: ["Atropine paradox", "Worse block ratio", "Haemodynamic deterioration"],
        vitals: { hr: "38 wide QRS", bp: "88/52", spo2: "92%", loc: "Drowsy" },
        decisionPrompt: "Atropine has worsened the block. Patient is now symptomatic. What now?",
        options: [
          {
            action: "Apply transcutaneous pacing immediately — set rate 70 BPM, increase mA until capture",
            outcome: "prevented",
            nextStageId: "s3-pacing-rescue",
            feedback: "Correct emergency response. Transcutaneous pacing is the bridge to transvenous pacing.",
            points: 25,
          },
          {
            action: "Give a second dose of atropine 1mg",
            outcome: "arrested",
            nextStageId: "s3-cardiac-arrest",
            feedback: "Fatal error. Repeat atropine in worsening infranodal block is futile and delays definitive pacing. The patient deteriorated to arrest.",
            points: 0,
          },
        ],
        timeLimitSeconds: 45,
      },
      {
        id: "s2-block-progresses",
        rhythmKey: "third_degree_av_block",
        displayRate: 28,
        clinicalContext: "While you were monitoring without pacing preparation, the Mobitz II progressed suddenly to complete heart block at 28 BPM.",
        warningSignsPresent: ["Complete heart block", "Sudden progression", "Haemodynamic collapse"],
        vitals: { hr: "28 wide QRS", bp: "72/44", spo2: "88%", loc: "Confused" },
        decisionPrompt: "Complete heart block has now developed. Patient is haemodynamically compromised. What is the immediate priority?",
        options: [
          {
            action: "Apply transcutaneous pacing immediately; call rapid response",
            outcome: "delayed",
            nextStageId: "s3-pacing-rescue",
            feedback: "Correct action, but delayed. This deterioration was preventable with earlier pacing preparation.",
            points: 20,
          },
          {
            action: "Administer atropine 0.5mg IV",
            outcome: "arrested",
            nextStageId: "s3-cardiac-arrest",
            feedback: "Atropine has no effect on ventricular escape rhythms in complete heart block. The patient arrested while waiting for medication effect.",
            points: 0,
          },
        ],
        timeLimitSeconds: 30,
      },
      {
        id: "s2-pacing-active",
        rhythmKey: "paced_rhythm",
        displayRate: 70,
        clinicalContext: "Transcutaneous pacing established at 70 BPM. Electrical and mechanical capture confirmed. Patient symptoms improving.",
        warningSignsPresent: [],
        vitals: { hr: "70 paced", bp: "108/68", spo2: "96%", loc: "Alert and improving" },
        decisionPrompt: "Transcutaneous pacing is working. What is the next step?",
        options: [
          {
            action: "Arrange transvenous pacing with cardiology; maintain transcutaneous as bridge",
            outcome: "prevented",
            nextStageId: null,
            feedback: "Correct. Transcutaneous pacing is a temporary bridge — transvenous pacing is required for definitive management.",
            points: 20,
          },
          {
            action: "Discontinue pacing now that the rate is controlled",
            outcome: "accelerated",
            nextStageId: null,
            feedback: "Wrong. The underlying Mobitz II block remains. Discontinuing pacing without a transvenous system risks immediate return of haemodynamic compromise.",
            points: 0,
          },
        ],
        timeLimitSeconds: null,
      },
      {
        id: "s3-pacing-rescue",
        rhythmKey: "paced_rhythm",
        displayRate: 70,
        clinicalContext: "Transcutaneous pacing applied with capture. Patient partially stabilised.",
        warningSignsPresent: ["Delayed pacing", "Residual hypotension"],
        vitals: { hr: "70 paced", bp: "95/60", spo2: "93%", loc: "Alert but fatigued" },
        decisionPrompt: "Pacing has been applied. What is the next priority?",
        options: [
          {
            action: "Call cardiology for transvenous pacing; ICU transfer; supportive care",
            outcome: "delayed",
            nextStageId: null,
            feedback: "Appropriate rescue management. The outcome was delayed but the patient has been stabilised.",
            points: 15,
          },
        ],
        timeLimitSeconds: null,
      },
      {
        id: "s3-cardiac-arrest",
        rhythmKey: "asystole",
        displayRate: 0,
        clinicalContext: "Cardiac arrest. Monitor shows asystole.",
        warningSignsPresent: ["Cardiac arrest", "Asystole"],
        vitals: { hr: "0", bp: "0/0", spo2: "Absent", loc: "Unresponsive" },
        decisionPrompt: "Asystole — patient is in cardiac arrest. What is the correct response?",
        options: [
          {
            action: "Code blue, high-quality CPR, epinephrine 1mg IV q3-5min, transcutaneous pacing — do NOT defibrillate",
            outcome: "delayed",
            nextStageId: null,
            feedback: "Correct ACLS approach for asystole. Asystole is NOT shockable. This outcome was preventable with earlier pacing.",
            points: 10,
          },
          {
            action: "Defibrillate 200J immediately",
            outcome: "unchanged",
            nextStageId: null,
            feedback: "Asystole is not a shockable rhythm. Shocking a flatline is ineffective and wastes CPR time.",
            points: 0,
          },
        ],
        timeLimitSeconds: null,
      },
    ],
    outcomes: {
      "s2-pacing-active": {
        title: "Deterioration Prevented — Pacing Established Early",
        narrative: "Outstanding. Mobitz II in anterior MI was recognised as a pacing emergency. Transcutaneous pacing was established before haemodynamic compromise, and transvenous pacing was arranged. Best possible outcome.",
        prevented: true,
      },
      "s3-pacing-rescue": {
        title: "Stabilised After Deterioration",
        narrative: "The pathway progressed further than necessary, but correct rescue pacing was applied in time. The patient is now stable but the deterioration was preventable.",
        prevented: false,
      },
      "s3-cardiac-arrest": {
        title: "Cardiac Arrest Occurred",
        narrative: "Inadequate or delayed response to Mobitz II resulted in cardiac arrest. CPR and pacing were eventually applied. Review the Mobitz II clinical reasoning unit and the ACLS bradycardia algorithm.",
        prevented: false,
      },
    },
    maxScore: 100,
  },

  // ── Hyperkalemia → Escape → PEA ────────────────────────────────────────────
  {
    id: "hyperkalemia-to-pea",
    title: "Hyperkalemia → Ventricular Escape → PEA",
    description: "An ESRD patient with missed dialysis develops progressive hyperkalemia changes. ECG recognition and treatment can prevent cardiac arrest.",
    difficulty: "advanced",
    tags: ["hyperkalemia_pattern", "ventricular_escape_rhythm", "pea", "electrolytes", "renal"],
    startRhythmKey: "hyperkalemia_pattern",
    stages: [
      {
        id: "s1-peaked-t",
        rhythmKey: "hyperkalemia_pattern",
        displayRate: 72,
        clinicalContext: "ESRD patient, missed 2 dialysis sessions. Lab: K⁺ 6.8 mEq/L. 12-lead shows peaked narrow T-waves.",
        warningSignsPresent: ["Peaked T-waves", "K⁺ 6.8", "Missed dialysis"],
        vitals: { hr: "72 regular", bp: "148/90", spo2: "97%", loc: "Alert" },
        decisionPrompt: "Peaked T-waves in a dialysis patient with K⁺ 6.8. What is the immediate priority?",
        options: [
          {
            action: "Calcium gluconate 1g IV over 10 minutes; call nephrology; IV insulin + dextrose; arrange urgent dialysis",
            outcome: "prevented",
            nextStageId: "s2-treatment-success",
            feedback: "Excellent. Calcium gluconate stabilises the myocardial membrane. Insulin+dextrose shifts K⁺ intracellularly. Urgent dialysis definitively lowers K⁺.",
            points: 30,
          },
          {
            action: "Repeat the K⁺ level and wait for confirmed result before treating",
            outcome: "accelerated",
            nextStageId: "s2-qrs-widening",
            feedback: "Dangerous delay. With K⁺ 6.8 and ECG changes, treatment should not wait for repeat labs. ECG changes + elevated K⁺ = treat immediately.",
            points: 0,
          },
          {
            action: "Administer Kayexalate (sodium polystyrene) orally and monitor",
            outcome: "delayed",
            nextStageId: "s2-qrs-widening",
            feedback: "Kayexalate lowers K⁺ but takes hours. It is not appropriate as the primary treatment when ECG changes are already present.",
            points: 5,
          },
        ],
        timeLimitSeconds: 120,
      },
      {
        id: "s2-qrs-widening",
        rhythmKey: "hyperkalemia_pattern",
        displayRate: 58,
        clinicalContext: "K⁺ now 7.8 mEq/L. QRS has widened to 0.16s. P-waves are barely visible.",
        warningSignsPresent: ["QRS widening", "K⁺ 7.8", "P-wave flattening"],
        vitals: { hr: "58 slow wide QRS", bp: "128/84", spo2: "95%", loc: "Alert but weak" },
        decisionPrompt: "QRS widening and P-wave disappearance indicate severe hyperkalemia. What is the emergency treatment sequence?",
        options: [
          {
            action: "Calcium gluconate 1g IV STAT; insulin 10U IV + 50g dextrose IV; sodium bicarbonate 50mEq IV; activate dialysis emergently",
            outcome: "delayed",
            nextStageId: "s3-partial-correction",
            feedback: "Correct sequence. The treatment was delayed compared to stage 1 but the right medications have been initiated.",
            points: 20,
          },
          {
            action: "Give only Kayexalate and arrange dialysis for tomorrow",
            outcome: "arrested",
            nextStageId: "s3-pea-arrest",
            feedback: "Catastrophic error. With QRS widening, cardiac arrest is imminent without immediate membrane stabilisation and K⁺ reduction.",
            points: 0,
          },
        ],
        timeLimitSeconds: 60,
      },
      {
        id: "s2-treatment-success",
        rhythmKey: "normal_sinus_rhythm",
        displayRate: 76,
        clinicalContext: "After calcium gluconate and insulin+dextrose: K⁺ trending down to 6.2. QRS narrowing. Patient stable.",
        warningSignsPresent: [],
        vitals: { hr: "76 regular", bp: "140/88", spo2: "98%", loc: "Alert" },
        decisionPrompt: "Initial treatment is working. K⁺ is trending down. What are the next priorities?",
        options: [
          {
            action: "Serial K⁺ levels q1h, continuous monitoring, urgent dialysis to definitively lower K⁺, hold all K⁺-containing fluids",
            outcome: "prevented",
            nextStageId: null,
            feedback: "Excellent management. Insulin+dextrose provides a temporary K⁺ shift — dialysis is the only definitive treatment for this level of hyperkalemia.",
            points: 20,
          },
          {
            action: "K⁺ is coming down — can defer dialysis until tomorrow",
            outcome: "accelerated",
            nextStageId: null,
            feedback: "Wrong. The K⁺ shift from insulin is temporary (2–4 hours). Without dialysis, K⁺ will rise again — possibly to higher levels.",
            points: 0,
          },
        ],
        timeLimitSeconds: null,
      },
      {
        id: "s3-partial-correction",
        rhythmKey: "normal_sinus_rhythm",
        displayRate: 68,
        clinicalContext: "QRS is narrowing. K⁺ trending toward 6.8 from 7.8. Dialysis is being arranged.",
        warningSignsPresent: ["K⁺ still elevated", "Partial correction only"],
        vitals: { hr: "68 regular", bp: "132/82", spo2: "96%", loc: "Alert" },
        decisionPrompt: "Patient partially stabilised. What monitoring is required while awaiting dialysis?",
        options: [
          {
            action: "Continuous ECG monitoring, serial K⁺ q1h, repeat calcium gluconate if ECG changes recur",
            outcome: "delayed",
            nextStageId: null,
            feedback: "Correct monitoring plan. The delayed treatment led to more severe changes, but the patient has been stabilised pending dialysis.",
            points: 15,
          },
        ],
        timeLimitSeconds: null,
      },
      {
        id: "s3-pea-arrest",
        rhythmKey: "pea",
        displayRate: 42,
        clinicalContext: "Cardiac arrest. Monitor shows organised but slow rhythm. Patient is pulseless — PEA arrest.",
        warningSignsPresent: ["PEA cardiac arrest", "Hyperkalemia cause"],
        vitals: { hr: "42 organised QRS", bp: "0/0", spo2: "Absent", loc: "Unresponsive" },
        decisionPrompt: "PEA arrest from hyperkalemia. What is the ACLS approach?",
        options: [
          {
            action: "Code blue; CPR; calcium gluconate 1g IV rapid push; epinephrine 1mg q3-5min; identify hyperkalemia as the H (treat it); do NOT defibrillate",
            outcome: "delayed",
            nextStageId: null,
            feedback: "Correct PEA arrest approach. PEA is NOT shockable. Hyperkalemia is one of the Hs — calcium gluconate is the specific antidote.",
            points: 10,
          },
          {
            action: "Defibrillate 200J and CPR",
            outcome: "unchanged",
            nextStageId: null,
            feedback: "PEA is not a shockable rhythm. Defibrillation will not convert PEA. CPR + treat the cause is the correct approach.",
            points: 0,
          },
        ],
        timeLimitSeconds: null,
      },
    ],
    outcomes: {
      "s2-treatment-success": {
        title: "Hyperkalemia Arrest Prevented",
        narrative: "Outstanding clinical management. Early recognition of peaked T-waves led to immediate treatment initiation before QRS widening developed. Cardiac arrest was entirely prevented.",
        prevented: true,
      },
      "s3-partial-correction": {
        title: "Stabilised After Progression",
        narrative: "The ECG changes progressed to QRS widening before treatment began, but correct therapy was ultimately initiated. The patient has been stabilised pending dialysis.",
        prevented: false,
      },
      "s3-pea-arrest": {
        title: "PEA Arrest — Preventable",
        narrative: "The patient suffered a PEA arrest from untreated progressive hyperkalemia. This was entirely preventable with early calcium gluconate and K⁺-lowering treatment at stage 1.",
        prevented: false,
      },
    },
    maxScore: 95,
  },

  // ── PAC → AFib ─────────────────────────────────────────────────────────────
  {
    id: "pac-to-afib",
    title: "Frequent PACs → Atrial Fibrillation",
    description: "Increasing PAC burden triggers paroxysmal AFib. Electrolyte management and risk recognition can prevent or manage the transition.",
    difficulty: "basic",
    tags: ["pacs", "atrial_fibrillation", "electrolytes"],
    startRhythmKey: "pacs",
    stages: [
      {
        id: "s1-frequent-pacs",
        rhythmKey: "pacs",
        displayRate: 88,
        clinicalContext: "Day 2 post-cardiac surgery. K⁺ 3.4, Mg²⁺ 0.7 mmol/L. Frequent PACs visible — every 3rd beat.",
        warningSignsPresent: ["Frequent PACs", "Low Mg²⁺", "Post-cardiac surgery"],
        vitals: { hr: "88 irregular", bp: "122/74", spo2: "97%", loc: "Alert" },
        decisionPrompt: "Frequent PACs post-cardiac surgery with low electrolytes. What is the priority action?",
        options: [
          {
            action: "Replace Mg²⁺ and K⁺; document PAC frequency; notify provider; monitor continuously",
            outcome: "prevented",
            nextStageId: "s2-pacs-reduced",
            feedback: "Excellent. Magnesium and potassium deficiency are primary triggers for PACs post-surgery. Correction reduces AFib conversion risk.",
            points: 20,
          },
          {
            action: "Document PACs and continue routine monitoring",
            outcome: "accelerated",
            nextStageId: "s2-afib-onset",
            feedback: "Missed opportunity. Post-cardiac surgery PACs with low electrolytes are a well-recognised pre-AFib pattern. Correction should be prioritised.",
            points: 5,
          },
        ],
        timeLimitSeconds: 120,
      },
      {
        id: "s2-pacs-reduced",
        rhythmKey: "normal_sinus_rhythm",
        displayRate: 82,
        clinicalContext: "After electrolyte replacement: PAC frequency has decreased significantly. Mg²⁺ 1.0, K⁺ 3.9.",
        warningSignsPresent: [],
        vitals: { hr: "82 mostly regular", bp: "124/76", spo2: "97%", loc: "Alert" },
        decisionPrompt: "PACs have decreased after electrolyte correction. What ongoing monitoring is appropriate?",
        options: [
          {
            action: "Continue telemetry, serial electrolytes q12h, watch for recurrence of PAC burden",
            outcome: "prevented",
            nextStageId: null,
            feedback: "Correct. Electrolytes should be maintained above target (K⁺ > 4.0, Mg²⁺ > 0.9) to prevent post-operative AFib.",
            points: 15,
          },
        ],
        timeLimitSeconds: null,
      },
      {
        id: "s2-afib-onset",
        rhythmKey: "atrial_fibrillation",
        displayRate: 138,
        clinicalContext: "Telemetry alarm — irregularly irregular rhythm at 138 BPM. Patient reports palpitations and mild dyspnoea.",
        warningSignsPresent: ["New-onset AFib", "Rapid ventricular response", "Symptomatic"],
        vitals: { hr: "138 irregular", bp: "104/68", spo2: "94%", loc: "Alert but distressed" },
        decisionPrompt: "New-onset AFib with rapid ventricular response in a post-surgical patient. What is the priority?",
        options: [
          {
            action: "Notify provider STAT; assess haemodynamic stability; 12-lead ECG; rate control with IV metoprolol or diltiazem; check if anticoagulation is appropriate",
            outcome: "delayed",
            nextStageId: null,
            feedback: "Correct management. New post-operative AFib requires rate control and anticoagulation evaluation. This deterioration was preventable.",
            points: 15,
          },
          {
            action: "Prepare for immediate synchronised cardioversion",
            outcome: "unchanged",
            nextStageId: null,
            feedback: "Premature. Cardioversion may be needed but rate control and haemodynamic assessment come first for this duration of AFib. Duration since onset must be evaluated.",
            points: 5,
          },
        ],
        timeLimitSeconds: 60,
      },
    ],
    outcomes: {
      "s2-pacs-reduced": {
        title: "AFib Prevented",
        narrative: "PAC burden was recognised early and electrolyte correction prevented the progression to AFib. This represents optimal post-surgical arrhythmia management.",
        prevented: true,
      },
      "s2-afib-onset": {
        title: "AFib Developed — Managed Appropriately",
        narrative: "Post-operative AFib developed from unmanaged electrolyte deficiency. The AFib was managed correctly once it occurred, but was preventable.",
        prevented: false,
      },
    },
    maxScore: 65,
  },
];

// ─── Pathway registry ─────────────────────────────────────────────────────────

export function getDeteriorationPathway(id: string): DeteriorationPathway | undefined {
  return ECG_DETERIORATION_PATHWAYS.find((p) => p.id === id);
}

export function getDeteriorationPathwaysForRhythm(rhythmKey: string): DeteriorationPathway[] {
  return ECG_DETERIORATION_PATHWAYS.filter((p) =>
    p.tags.includes(rhythmKey) || p.startRhythmKey === rhythmKey,
  );
}

// ─── Session state ────────────────────────────────────────────────────────────

export type DeteriorationDecisionRecord = {
  stageId: string;
  rhythmKey: string;
  selectedAction: string;
  outcomeType: DeteriorationOutcomeType;
  pointsEarned: number;
  feedback: string;
  timestamp: string;
};

export type DeteriorationSession = {
  sessionId: string;
  pathwayId: string;
  currentStageId: string;
  decisions: DeteriorationDecisionRecord[];
  totalScore: number;
  phase: "active" | "complete";
  preventionAchieved: boolean;
  startedAt: string;
  completedAt: string | null;
};

export function createDeteriorationSession(pathwayId: string): DeteriorationSession {
  const pathway = getDeteriorationPathway(pathwayId);
  if (!pathway) throw new Error(`Unknown pathway: ${pathwayId}`);
  return {
    sessionId: `det-path-${pathwayId}-${Date.now()}`,
    pathwayId,
    currentStageId: pathway.stages[0]?.id ?? "",
    decisions: [],
    totalScore: 0,
    phase: "active",
    preventionAchieved: false,
    startedAt: new Date().toISOString(),
    completedAt: null,
  };
}

export function applyDeteriorationDecision(
  session: DeteriorationSession,
  selectedAction: string,
): { updatedSession: DeteriorationSession; nextStage: DeteriorationStage | null; outcomeIfTerminal: string | null } {
  const pathway = getDeteriorationPathway(session.pathwayId);
  if (!pathway) throw new Error("Pathway not found");

  const stage = pathway.stages.find((s) => s.id === session.currentStageId);
  if (!stage) throw new Error("Stage not found");

  const option = stage.options.find((o) => o.action === selectedAction);
  if (!option) throw new Error("Option not found");

  const decision: DeteriorationDecisionRecord = {
    stageId: stage.id,
    rhythmKey: stage.rhythmKey,
    selectedAction,
    outcomeType: option.outcome,
    pointsEarned: option.points,
    feedback: option.feedback,
    timestamp: new Date().toISOString(),
  };

  const nextStageId = option.nextStageId;
  const nextStage = nextStageId ? (pathway.stages.find((s) => s.id === nextStageId) ?? null) : null;
  const isTerminal = !nextStageId;

  const terminalOutcome = isTerminal ? pathway.outcomes[stage.id] : null;
  const preventionAchieved = session.preventionAchieved || option.outcome === "prevented";

  const updatedSession: DeteriorationSession = {
    ...session,
    currentStageId: nextStageId ?? session.currentStageId,
    decisions: [...session.decisions, decision],
    totalScore: session.totalScore + option.points,
    phase: isTerminal ? "complete" : "active",
    preventionAchieved,
    completedAt: isTerminal ? new Date().toISOString() : null,
  };

  return {
    updatedSession,
    nextStage,
    outcomeIfTerminal: terminalOutcome?.narrative ?? null,
  };
}

export function scoreDeteriorationSession(session: DeteriorationSession): {
  totalScore: number;
  maxScore: number;
  percentScore: number;
  preventionAchieved: boolean;
  grade: "A" | "B" | "C" | "F";
  stagesReached: number;
  keyMistakes: string[];
} {
  const pathway = getDeteriorationPathway(session.pathwayId);
  const maxScore = pathway?.maxScore ?? 100;
  const percent = Math.round((session.totalScore / maxScore) * 100);

  const keyMistakes = session.decisions
    .filter((d) => d.outcomeType === "accelerated" || d.outcomeType === "arrested")
    .map((d) => d.feedback);

  return {
    totalScore: session.totalScore,
    maxScore,
    percentScore: percent,
    preventionAchieved: session.preventionAchieved,
    grade: percent >= 90 ? "A" : percent >= 75 ? "B" : percent >= 60 ? "C" : "F",
    stagesReached: session.decisions.length,
    keyMistakes,
  };
}
