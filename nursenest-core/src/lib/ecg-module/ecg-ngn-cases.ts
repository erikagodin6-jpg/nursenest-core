/**
 * ECG NGN Clinical Judgment Cases — Phase 2
 *
 * Next-Generation NCLEX-style ECG clinical judgment items.
 * Supports all NGN question formats as applied to ECG interpretation scenarios.
 *
 * Integrates with:
 *   - simulation-clinical-judgment-engine.ts (NgNClinicalJudgmentFormat types)
 *   - ecg-clinical-reasoning-registry.ts (rhythm-specific clinical data)
 *   - ECG_RHYTHM_PROGRESSION_MAPS (deterioration context for trend questions)
 *
 * CLINICAL JUDGMENT DOMAINS TESTED
 *   Recognize cues → Analyze cues → Prioritize hypotheses →
 *   Generate solutions → Take actions → Evaluate outcomes
 *
 * NOT memorization. NOT label identification.
 * Tests: reasoning, prioritization, escalation, consequence prediction.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type EcgNgnQuestionFormat =
  | "mcq"
  | "sata"
  | "bowtie"
  | "matrix"
  | "trend_interpretation"
  | "prioritization"
  | "delegation"
  | "documentation"
  | "handoff";

export type EcgNgnClinicalJudgmentLayer =
  | "recognize_cues"
  | "analyze_cues"
  | "prioritize_hypotheses"
  | "generate_solutions"
  | "take_actions"
  | "evaluate_outcomes";

export type EcgNgnDistractor = {
  id: string;
  text: string;
  correct: boolean;
  /** Clinical rationale explaining why this option is correct or incorrect */
  rationale: string;
  /** If incorrect: what would happen if this option were chosen? */
  consequence?: string;
};

export type EcgNgnCase = {
  id: string;
  title: string;
  /** The clinical question format */
  format: EcgNgnQuestionFormat;
  /** Which NCJMM layer this item primarily tests */
  primaryJudgmentLayer: EcgNgnClinicalJudgmentLayer;
  /** Secondary layers also assessed */
  secondaryJudgmentLayers: ReadonlyArray<EcgNgnClinicalJudgmentLayer>;
  /** The rhythm(s) featured in this case */
  rhythmKeys: ReadonlyArray<string>;
  /** The clinical scenario stem */
  caseStem: string;
  /** The question stem (for non-case-study formats) */
  questionStem: string;
  options: ReadonlyArray<EcgNgnDistractor>;
  /** The correct answer IDs */
  correctIds: ReadonlyArray<string>;
  /** Overall rationale explaining the reasoning for the complete answer */
  rationale: string;
  /** Which trap this item is specifically designed to catch */
  targetedTrap?: string;
  /** Difficulty [1–5] */
  difficulty: 1 | 2 | 3 | 4 | 5;
  /** Applicable learner tiers */
  applicableTiers: ReadonlyArray<"RN" | "RPN" | "NP" | "new_grad">;
};

// ─── Case library ─────────────────────────────────────────────────────────────

export const ECG_NGN_CASES: ReadonlyArray<EcgNgnCase> = [

  // ══ MCQ — Recognition + Prioritization ════════════════════════════════════
  {
    id: "ngn-mcq-vt-pulse-check",
    title: "Wide-Complex Tachycardia — Pulse Check Decision",
    format: "mcq",
    primaryJudgmentLayer: "take_actions",
    secondaryJudgmentLayers: ["recognize_cues", "analyze_cues"],
    rhythmKeys: ["ventricular_tachycardia"],
    caseStem:
      "A nurse is monitoring a 64-year-old client who is post-myocardial infarction day 2. " +
      "The monitor suddenly alarms with a wide-complex tachycardia at 172 BPM. The nurse goes to the bedside. " +
      "The client's eyes are open and he is trying to speak but is confused and diaphoretic. " +
      "Blood pressure reads 72/46 mmHg. The peripheral pulse is barely palpable.",
    questionStem: "Which action by the nurse is MOST appropriate at this time?",
    options: [
      { id: "a", text: "Administer adenosine 6 mg IV rapid push to terminate the tachycardia", correct: false, rationale: "Adenosine targets the AV node and is ineffective for ventricular tachycardia. This delays the appropriate intervention (cardioversion) and risks hemodynamic collapse.", consequence: "VT continues, BP falls further, patient loses pulse" },
      { id: "b", text: "Call for immediate synchronized cardioversion and apply supplemental oxygen", correct: true, rationale: "Pulsatile VT with hemodynamic instability (BP 72/46, confusion, diaphoresis) = ACLS indication for immediate synchronized cardioversion. This is the correct action per ACLS protocol." },
      { id: "c", text: "Administer amiodarone 150 mg IV over 10 minutes", correct: false, rationale: "Amiodarone is appropriate for stable VT. This patient is hemodynamically unstable. A 10-minute infusion delays the definitive intervention (cardioversion) and risks loss of pulse.", consequence: "While amiodarone infuses, VT may degenerate to pulseless VT" },
      { id: "d", text: "Increase oxygen to 15 L/min via non-rebreather mask and reassess in 5 minutes", correct: false, rationale: "Oxygen does not treat VT. A 5-minute reassessment in hemodynamically unstable VT risks degeneration to pulseless VT and cardiac arrest.", consequence: "5-minute delay allows VT to degenerate to pulseless VT — cardiac arrest" },
    ],
    correctIds: ["b"],
    rationale:
      "Pulsatile VT with hypotension, altered mental status, and diaphoresis constitutes hemodynamic instability. Per ACLS protocol, hemodynamically unstable VT with a pulse requires immediate synchronized cardioversion — not pharmacologic therapy. " +
      "Adenosine targets the AV node and is ineffective for VT. Amiodarone requires 10 minutes to infuse and is for STABLE VT. The definitive, immediate treatment is synchronized cardioversion at 100–200 J biphasic.",
    targetedTrap: "Confusing adenosine (SVT drug) with VT management; delaying cardioversion for pharmacology",
    difficulty: 3,
    applicableTiers: ["RN", "new_grad"],
  },

  // ══ SATA — AFib Management ════════════════════════════════════════════════
  {
    id: "ngn-sata-afib-management",
    title: "New-Onset AFib — Priority Nursing Actions",
    format: "sata",
    primaryJudgmentLayer: "generate_solutions",
    secondaryJudgmentLayers: ["analyze_cues", "take_actions"],
    rhythmKeys: ["atrial_fibrillation"],
    caseStem:
      "A nurse is caring for a 68-year-old client who is post-operative day 2 following abdominal surgery. " +
      "The monitor alarm sounds. The nurse assesses the client and notes an irregularly irregular heart rate at 134 BPM. " +
      "Blood pressure is 108/72 mmHg (down from 122/80 earlier). SpO₂ is 94% on 2L nasal cannula. " +
      "The client reports palpitations and mild shortness of breath. A 12-lead ECG confirms new-onset atrial fibrillation.",
    questionStem: "Which nursing actions are appropriate at this time? Select all that apply.",
    options: [
      { id: "a", text: "Assess for hemodynamic stability (BP, mental status, peripheral perfusion)", correct: true, rationale: "Hemodynamic assessment determines the management pathway: stable = rate control; unstable = immediate cardioversion. This is the first clinical priority." },
      { id: "b", text: "Perform immediate synchronized cardioversion at 200 J biphasic", correct: false, rationale: "Cardioversion without hemodynamic assessment is premature. Additionally, for AF of unknown or >48-hour duration, anticoagulation must be assessed before elective cardioversion.", consequence: "Cardioverting AF without anticoagulation assessment risks embolic stroke" },
      { id: "c", text: "Notify the provider immediately and report the current vital signs", correct: true, rationale: "New-onset AFib requires provider notification. The client's declining BP and tachycardia require clinical assessment and order clarification." },
      { id: "d", text: "Assess for signs of stroke (facial droop, arm weakness, speech changes)", correct: true, rationale: "AFib is the leading preventable cause of ischemic stroke. New AFib increases stroke risk acutely and requires neurological assessment." },
      { id: "e", text: "Administer diltiazem IV bolus without a provider order", correct: false, rationale: "Administering IV cardiac medications without a provider order is outside the scope of practice. A provider order is required before initiating rate control therapy.", consequence: "Administering diltiazem without order = scope of practice violation" },
      { id: "f", text: "Apply supplemental oxygen to target SpO₂ ≥ 95%", correct: true, rationale: "SpO₂ 94% in a post-op patient with new tachycardia is below target. Supplemental oxygen improves oxygenation while the rhythm is managed." },
      { id: "g", text: "Review the medication administration record for rate-controlling agents that were held", correct: true, rationale: "Post-operative beta-blocker withholding is a common precipitant of post-op AFib. Identifying held rate-controlling medications informs the provider call." },
    ],
    correctIds: ["a", "c", "d", "f", "g"],
    rationale:
      "For new-onset AFib, the priority actions are: (1) hemodynamic stability assessment, (2) provider notification with complete clinical picture, (3) stroke assessment (AFib = embolic risk), (4) oxygen for borderline SpO₂, and (5) medication review for held rate-controlling agents. " +
      "Cardioversion requires provider order and anticoagulation assessment. IV medications require an order. These are not independent nursing actions.",
    difficulty: 3,
    applicableTiers: ["RN", "new_grad", "NP"],
  },

  // ══ BOWTIE — Complete Heart Block ══════════════════════════════════════════
  {
    id: "ngn-bowtie-chb-management",
    title: "Complete Heart Block — Clinical Judgment Bowtie",
    format: "bowtie",
    primaryJudgmentLayer: "prioritize_hypotheses",
    secondaryJudgmentLayers: ["analyze_cues", "take_actions"],
    rhythmKeys: ["third_degree_av_block"],
    caseStem:
      "A nurse is caring for a 74-year-old client who presented with syncope. The 12-lead ECG shows " +
      "P waves marching at 72 BPM with QRS complexes marching at 34 BPM — the two rhythms are unrelated. " +
      "Blood pressure is 78/50 mmHg. The client is confused and pale, with cold clammy extremities.",
    questionStem:
      "Complete the clinical judgment diagram for this client with complete heart block and hemodynamic compromise.",
    options: [
      // Condition options
      { id: "cond-chb", text: "Complete (third-degree) AV block", correct: true, rationale: "Independent P and QRS march-outs confirm complete AV dissociation." },
      { id: "cond-mobitz2", text: "Second-degree type II AV block (Mobitz II)", correct: false, rationale: "Mobitz II has some conducted beats with constant PR. This client has NO conducted beats." },
      { id: "cond-svt", text: "Supraventricular tachycardia", correct: false, rationale: "SVT is a tachycardia. This client has a ventricular rate of 34 BPM — bradycardia." },
      // Nursing action options
      { id: "action-tcp", text: "Apply transcutaneous pacing pads and initiate pacing", correct: true, rationale: "Hemodynamically unstable CHB (BP 78/50, altered mentation) requires immediate transcutaneous pacing." },
      { id: "action-atropine", text: "Administer atropine 0.5 mg IV", correct: false, rationale: "Atropine is largely ineffective for infranodal CHB. It speeds SA node firing but not ventricular escape rate.", consequence: "Atropine wastes time without improving ventricular rate in CHB" },
      { id: "action-monitor", text: "Increase monitoring frequency and reassess in 30 minutes", correct: false, rationale: "Watchful waiting in hemodynamically unstable CHB (BP 78/50) will result in further deterioration and cardiac arrest.", consequence: "30-minute delay in hemodynamically unstable CHB risks asystole" },
      // Monitoring options
      { id: "mon-bp", text: "Continuous blood pressure monitoring every 5 minutes until pacing achieves capture", correct: true, rationale: "Hemodynamic response to pacing must be confirmed immediately. BP q5min during pacing initiation." },
      { id: "mon-pulse", text: "Pulse oximetry as the only monitoring required", correct: false, rationale: "Pulse oximetry alone is insufficient. BP is the critical hemodynamic indicator — it shows whether pacing is producing mechanical capture." },
      { id: "mon-ecg-only", text: "Monitor ECG only for paced QRS complexes", correct: false, rationale: "Electrical capture (paced QRS on ECG) does not guarantee mechanical capture (ventricular contraction + pulse). Always confirm with pulse check and BP." },
    ],
    correctIds: ["cond-chb", "action-tcp", "mon-bp"],
    rationale:
      "This client has complete heart block (AV dissociation: P at 72, QRS at 34 BPM) with hemodynamic instability " +
      "(BP 78/50, confusion, cold clammy skin). The action is transcutaneous pacing — not atropine, which is ineffective for " +
      "infranodal block. After initiating pacing, both electrical capture (paced QRS on ECG) and mechanical capture " +
      "(pulse and BP improvement) must be confirmed. BP monitoring every 5 minutes is the appropriate hemodynamic assessment.",
    targetedTrap: "Giving atropine for CHB (ineffective for infranodal block); confusing electrical with mechanical capture",
    difficulty: 4,
    applicableTiers: ["RN", "NP"],
  },

  // ══ MATRIX — Rhythm Classification ════════════════════════════════════════
  {
    id: "ngn-matrix-rhythm-action",
    title: "Rhythm Classification Matrix — Action Required vs. Monitor Only",
    format: "matrix",
    primaryJudgmentLayer: "analyze_cues",
    secondaryJudgmentLayers: ["prioritize_hypotheses", "take_actions"],
    rhythmKeys: ["normal_sinus_rhythm", "pvcs", "ventricular_tachycardia", "atrial_fibrillation", "third_degree_av_block"],
    caseStem:
      "A nurse is monitoring five clients on a cardiac telemetry unit. Each client is described below with their current rhythm and clinical status.",
    questionStem: "For each client, indicate whether the rhythm requires immediate action or monitoring only.",
    options: [
      { id: "r1-act", text: "Client A — Sinus rhythm at 72 BPM, BP 124/78, alert: IMMEDIATE ACTION", correct: false, rationale: "NSR with normal hemodynamics requires monitoring only." },
      { id: "r1-mon", text: "Client A — Sinus rhythm at 72 BPM, BP 124/78, alert: MONITOR ONLY", correct: true, rationale: "NSR with normal vital signs is the baseline normal state — routine monitoring." },
      { id: "r2-act", text: "Client B — Wide-complex tachycardia at 168 BPM, BP 82/50, diaphoretic: IMMEDIATE ACTION", correct: true, rationale: "Wide-complex tachycardia with hemodynamic compromise = unstable VT → immediate rapid response and cardioversion preparation." },
      { id: "r2-mon", text: "Client B — Wide-complex tachycardia at 168 BPM, BP 82/50, diaphoretic: MONITOR ONLY", correct: false, rationale: "Hemodynamically unstable VT requires immediate intervention, not monitoring.", consequence: "Monitoring-only of unstable VT allows progression to pulseless VT" },
      { id: "r3-act", text: "Client C — Occasional PVCs in a healthy 35-year-old, asymptomatic: IMMEDIATE ACTION", correct: false, rationale: "Isolated PVCs in a structurally normal heart of a healthy young adult are benign — monitoring, not immediate action." },
      { id: "r3-mon", text: "Client C — Occasional PVCs in a healthy 35-year-old, asymptomatic: MONITOR ONLY", correct: true, rationale: "Benign PVCs in a healthy heart do not require immediate intervention." },
      { id: "r4-act", text: "Client D — AFib at 148 BPM, BP 86/52, altered mental status: IMMEDIATE ACTION", correct: true, rationale: "Hemodynamically unstable AFib (RVR + hypotension + AMS) requires immediate rapid response and cardioversion preparation." },
      { id: "r4-mon", text: "Client D — AFib at 148 BPM, BP 86/52, altered mental status: MONITOR ONLY", correct: false, rationale: "Hemodynamically unstable AFib with altered mentation is a medical emergency.", consequence: "Monitoring unstable AFib allows progression to cardiogenic shock" },
      { id: "r5-act", text: "Client E — Complete heart block, HR 38, BP 80/48, syncopal: IMMEDIATE ACTION", correct: true, rationale: "Hemodynamically unstable CHB (HR 38, BP 80/48, syncope) requires immediate pacing preparation and rapid response." },
      { id: "r5-mon", text: "Client E — Complete heart block, HR 38, BP 80/48, syncopal: MONITOR ONLY", correct: false, rationale: "Hemodynamically unstable CHB with syncope is a pacing emergency.", consequence: "Monitoring-only CHB with BP 80/48 will progress to asystole" },
    ],
    correctIds: ["r1-mon", "r2-act", "r3-mon", "r4-act", "r5-act"],
    rationale:
      "The clinical principle underlying this matrix: rhythm alone does not determine urgency — hemodynamic status determines urgency. " +
      "A patient with NSR and BP 124/78 needs monitoring. A patient with wide-complex tachycardia and BP 82/50 needs immediate action. " +
      "PVCs in a healthy young adult are benign; the same PVCs in a post-MI patient with EF 30% are not. Context is everything.",
    difficulty: 3,
    applicableTiers: ["RN", "new_grad", "NP"],
  },

  // ══ TREND INTERPRETATION ══════════════════════════════════════════════════
  {
    id: "ngn-trend-pvcs-deterioration",
    title: "Trend Interpretation — PVC Frequency Escalation",
    format: "trend_interpretation",
    primaryJudgmentLayer: "recognize_cues",
    secondaryJudgmentLayers: ["analyze_cues", "prioritize_hypotheses"],
    rhythmKeys: ["pvcs", "ventricular_tachycardia"],
    caseStem:
      "A nurse reviews telemetry trend data for a 58-year-old client who is post-MI day 1 (EF 32%). " +
      "The telemetry system shows the following PVC frequency trend over the past 4 hours:\n\n" +
      "2200: 2 PVCs/min — Nurse notes in chart, continues monitoring\n" +
      "2300: 4 PVCs/min — Nurse silent alarms the finding\n" +
      "0000: 8 PVCs/min — Nurse paged provider, no return call yet\n" +
      "0100: 14 PVCs/min — Nurse reviews chart: K⁺ from 1800 = 3.3 mEq/L, unreplaced",
    questionStem: "Which finding from the trend data is MOST concerning and should have prompted immediate provider notification?",
    options: [
      { id: "a", text: "2 PVCs/min at 2200", correct: false, rationale: "2 PVCs/min in isolation could be monitored in a new post-MI patient, though context (EF 32%) adds risk. However, this is not the most concerning finding." },
      { id: "b", text: "4 PVCs/min at 2300", correct: false, rationale: "PVC frequency doubling over 1 hour is a trend worth noting, but the most actionable finding was identified later." },
      { id: "c", text: "K⁺ 3.3 mEq/L unreplaced in a post-MI patient with increasing PVCs", correct: true, rationale: "Hypokalemia (K⁺ < 3.5 mEq/L) is a significant, correctable VT risk factor in post-MI patients. An unreplaced K⁺ 3.3 in a patient with an increasing PVC burden and EF 32% should have prompted immediate provider notification and replacement when first identified at 1800." },
      { id: "d", text: "14 PVCs/min at 0100", correct: false, rationale: "14 PVCs/min is the most recent and alarming number, but the opportunity for early intervention was the unreplaced electrolyte abnormality identified hours earlier." },
    ],
    correctIds: ["c"],
    rationale:
      "The most preventable factor in this case is the unreplaced K⁺ 3.3 mEq/L. In a post-MI patient with EF 32%, hypokalemia is a potent arrhythmia trigger. " +
      "The ideal intervention window was at 1800 — when the lab value was noted — not at 0100 when PVC frequency was 14/min. " +
      "Trend analysis is not just about the current value; it's about identifying the earliest actionable abnormality. " +
      "This case teaches 'treat the substrate, not just the rhythm.'",
    targetedTrap: "Focusing on the most recent number (14 PVCs) without identifying the earlier actionable opportunity (K⁺ replacement)",
    difficulty: 4,
    applicableTiers: ["RN", "new_grad", "NP"],
  },

  // ══ PRIORITIZATION ════════════════════════════════════════════════════════
  {
    id: "ngn-prioritization-4-patients",
    title: "Prioritization — 4 Telemetry Patients, Which First?",
    format: "prioritization",
    primaryJudgmentLayer: "prioritize_hypotheses",
    secondaryJudgmentLayers: ["recognize_cues", "take_actions"],
    rhythmKeys: ["ventricular_tachycardia", "atrial_fibrillation", "sinus_bradycardia", "normal_sinus_rhythm"],
    caseStem:
      "A nurse is beginning the shift and receives an overview of four assigned clients on a cardiac telemetry unit.",
    questionStem: "Which client should the nurse assess FIRST?",
    options: [
      { id: "a", text: "Client 1: AFib at 94 BPM, BP 118/74, asymptomatic — prescribed rate control medications due at 0900", correct: false, rationale: "Controlled AFib with normal hemodynamics is not urgent. Medications can wait until the immediate crisis is addressed." },
      { id: "b", text: "Client 2: Wide-complex tachycardia at 158 BPM — monitor alarm currently sounding", correct: true, rationale: "An active monitor alarm for wide-complex tachycardia is the highest immediate priority. Wide-complex tachycardia = VT until proven otherwise. Pulse check must occur within 30 seconds." },
      { id: "c", text: "Client 3: Sinus bradycardia at 48 BPM on beta-blockers, alert, BP 114/72, asymptomatic", correct: false, rationale: "Asymptomatic bradycardia in a patient on beta-blockers with normal BP is expected and not the highest priority." },
      { id: "d", text: "Client 4: NSR at 76 BPM, BP 128/82 — reports 'feeling tired' this morning", correct: false, rationale: "Fatigue in a hemodynamically stable patient with NSR is the lowest priority among these four clients." },
    ],
    correctIds: ["b"],
    rationale:
      "A currently alarming wide-complex tachycardia requires immediate assessment above all other clients. " +
      "Wide-complex tachycardia = VT until proven otherwise. A pulse check within seconds determines whether this is pulsatile VT (rapid response/cardioversion) or pulseless VT (code blue/CPR/defibrillation). " +
      "The consequences of delay are catastrophic. Controlled AFib, asymptomatic beta-blocker bradycardia, and a tired NSR patient are all lower priority.",
    targetedTrap: "Choosing the AFib patient because AFib is familiar vs. prioritizing an active alarm for an unfamiliar wide-complex rhythm",
    difficulty: 2,
    applicableTiers: ["RN", "new_grad"],
  },

  // ══ DELEGATION ════════════════════════════════════════════════════════════
  {
    id: "ngn-delegation-telemetry",
    title: "Delegation — What Can the Nurse Delegate in Cardiac Emergency?",
    format: "delegation",
    primaryJudgmentLayer: "generate_solutions",
    secondaryJudgmentLayers: ["take_actions"],
    rhythmKeys: ["ventricular_fibrillation"],
    caseStem:
      "A nurse finds a client unresponsive with VF on the monitor. The nurse calls for help. Two nursing assistants (PCAs) and a unit clerk respond. " +
      "A second RN is available but currently managing another client.",
    questionStem: "Which task(s) is it appropriate for the nurse to delegate to unlicensed assistive personnel (UAP) during this emergency? Select all that apply.",
    options: [
      { id: "a", text: "Call a code blue via the emergency system", correct: true, rationale: "Calling the code is a task that UAP can perform. The nurse should remain at the bedside with the patient and direct others to call." },
      { id: "b", text: "Retrieve the crash cart from the hallway and bring it to the room", correct: true, rationale: "Retrieving equipment is an appropriate delegated task for UAP in an emergency. The nurse directs; UAP retrieves." },
      { id: "c", text: "Begin chest compressions", correct: true, rationale: "CPR chest compressions can be delegated to UAP who have been trained in basic life support. The RN retains responsibility for directing the resuscitation." },
      { id: "d", text: "Interpret the cardiac rhythm and decide whether to defibrillate", correct: false, rationale: "Rhythm interpretation and defibrillation decision-making are registered nurse clinical judgment responsibilities that cannot be delegated to UAP." },
      { id: "e", text: "Administer epinephrine from the crash cart", correct: false, rationale: "Medication administration is a licensed nursing or physician responsibility that cannot be delegated to UAP." },
      { id: "f", text: "Clear family members from the room and manage the environment", correct: true, rationale: "Family management and crowd control are appropriate tasks for UAP during a code, freeing the clinical team to focus on resuscitation." },
    ],
    correctIds: ["a", "b", "c", "f"],
    rationale:
      "In a cardiac arrest, the RN directs the resuscitation and retains clinical judgment responsibilities: rhythm interpretation, defibrillation decisions, medication administration. " +
      "UAP can perform tasks that require BLS skills (compressions, AED application if trained), logistics (equipment retrieval), and environmental management (family, crowd). " +
      "These delegation principles apply across jurisdictions — always follow local policy and scope of practice regulations.",
    difficulty: 3,
    applicableTiers: ["RN", "new_grad"],
  },

  // ══ DOCUMENTATION ═════════════════════════════════════════════════════════
  {
    id: "ngn-documentation-stemi",
    title: "Documentation — STEMI Event Record",
    format: "documentation",
    primaryJudgmentLayer: "evaluate_outcomes",
    secondaryJudgmentLayers: ["take_actions"],
    rhythmKeys: ["stemi_pattern"],
    caseStem:
      "A nurse identified inferior STEMI at 1342. The following events occurred:\n" +
      "1342: 12-lead obtained, STEMI alert activated\n" +
      "1344: Aspirin 325 mg given, IV access × 2\n" +
      "1345: Nitroglycerin ordered but withheld — right-sided leads showed V4R ST elevation (RV MI)\n" +
      "1348: Patient transferred to cath lab\n" +
      "1432: TIMI 3 flow restored via PCI, RCA stented",
    questionStem: "Which elements are REQUIRED in the nursing documentation for this STEMI event? Select all that apply.",
    options: [
      { id: "a", text: "Time of STEMI recognition and 12-lead ECG interpretation", correct: true, rationale: "Time of ECG and STEMI recognition is mandatory — it establishes the door-to-balloon time calculation baseline." },
      { id: "b", text: "Rationale for withholding nitroglycerin (RV MI confirmed on V4R)", correct: true, rationale: "Deviations from expected treatment (withholding a standard medication) require documentation of clinical rationale for medicolegal and quality purposes." },
      { id: "c", text: "Patient's subjective description of chest pain using their exact words", correct: false, rationale: "While pain documentation is important in general, in the context of STEMI documentation, the priority elements are time-based and intervention-based rather than subjective narrative." },
      { id: "d", text: "STEMI alert activation time and provider/cath lab notification time", correct: true, rationale: "Alert activation and notification times are core STEMI protocol metrics tracked by hospital quality improvement. D2B time calculation depends on accurate timestamps." },
      { id: "e", text: "Medications administered (aspirin, anticoagulant) with dose, route, time, and patient response", correct: true, rationale: "Medication administration documentation is a nursing standard regardless of the clinical scenario — STEMI is no exception." },
      { id: "f", text: "The nurse's opinion about whether PCI was performed correctly", correct: false, rationale: "Nursing documentation does not include evaluation of physician procedural performance. This is outside the nursing documentation scope." },
    ],
    correctIds: ["a", "b", "d", "e"],
    rationale:
      "STEMI documentation must capture: time-based metrics for D2B calculation (ECG time, alert activation, transfer time), clinical decisions and their rationale (especially deviations from standard such as withholding nitrates), and medication administration. " +
      "These elements support quality improvement, medicolegal documentation, and continuity of care. Subjective pain narratives and physician procedure evaluations are not priority STEMI documentation elements.",
    difficulty: 3,
    applicableTiers: ["RN", "new_grad"],
  },

  // ══ HANDOFF — SBAR for Post-VF ROSC ══════════════════════════════════════
  {
    id: "ngn-handoff-rosc-sbar",
    title: "Handoff — SBAR for Post-Cardiac Arrest Transfer to ICU",
    format: "handoff",
    primaryJudgmentLayer: "evaluate_outcomes",
    secondaryJudgmentLayers: ["take_actions"],
    rhythmKeys: ["ventricular_fibrillation", "normal_sinus_rhythm"],
    caseStem:
      "A nurse managed a VF cardiac arrest at 0218. ROSC was achieved at 0221 after one shock + 2 cycles of CPR. " +
      "The client is now in sinus tachycardia at 106 BPM, BP 96/62, SpO₂ 95% on 100% NRB, GCS 8 (E2V2M4), " +
      "temperature 36.9°C. The client is being transferred to the ICU for post-arrest care. " +
      "The nurse is preparing the SBAR handoff to the ICU nurse.",
    questionStem: "Which elements must the SBAR handoff include? Select all that apply.",
    options: [
      { id: "a", text: "S: 'This client had a VF cardiac arrest at 0218 and ROSC was achieved at 0221'", correct: true, rationale: "The Situation opens with the most important clinical fact — type of arrest, time, and ROSC time." },
      { id: "b", text: "B: Pre-arrest baseline vitals, cardiac history, current medications", correct: true, rationale: "Background provides the ICU team the context needed for post-arrest management (cause of arrest, baseline function, relevant history)." },
      { id: "c", text: "A: Current vital signs, GCS, rhythm, and post-arrest status", correct: true, rationale: "Assessment communicates the current clinical picture the ICU team is receiving." },
      { id: "d", text: "R: Post-arrest care priorities — STEMI workup, TTM consideration, continuous monitoring", correct: true, rationale: "Recommendation frames the handoff with explicit next steps, reducing cognitive load for the receiving team." },
      { id: "e", text: "A detailed description of CPR quality during the code", correct: false, rationale: "While CPR quality matters for debriefing, the SBAR handoff focuses on the current patient status and next actions, not procedural retrospective." },
      { id: "f", text: "The names of every provider who responded to the code", correct: false, rationale: "Provider attendance lists belong in the code documentation, not the SBAR transfer handoff. The receiving team needs clinical information, not administrative lists." },
    ],
    correctIds: ["a", "b", "c", "d"],
    rationale:
      "The post-arrest SBAR must efficiently transfer the essential clinical picture: what happened (S), why and the baseline context (B), current status (A), and priority next steps (R). " +
      "Post-arrest priorities include: 12-lead ECG for STEMI, TTM eligibility assessment (target 33–36°C for 24h in comatose post-arrest patients), continuous neurological monitoring, and hemodynamic support. " +
      "The handoff is NOT a code retrospective — it is forward-looking clinical communication.",
    difficulty: 3,
    applicableTiers: ["RN", "new_grad", "NP"],
  },

  // ══ ADDITIONAL MCQ — Electrolyte + Rhythm ═════════════════════════════════
  {
    id: "ngn-mcq-hyperkalemia-ecg",
    title: "Hyperkalemia ECG Changes — Clinical Correlation",
    format: "mcq",
    primaryJudgmentLayer: "analyze_cues",
    secondaryJudgmentLayers: ["recognize_cues", "generate_solutions"],
    rhythmKeys: ["hyperkalemia_pattern"],
    caseStem:
      "A nurse is caring for a 55-year-old client with end-stage renal disease who missed three dialysis sessions. " +
      "The morning laboratory results show K⁺ 7.2 mEq/L. The telemetry strip shows: peaked T waves, " +
      "prolonged PR interval, and widening QRS complexes (0.14s). The client is drowsy but arousable.",
    questionStem: "Which is the MOST important nursing action at this time?",
    options: [
      { id: "a", text: "Administer potassium chloride 40 mEq PO to correct the electrolyte deficit", correct: false, rationale: "Potassium chloride is prescribed for HYPOKALEMIA, not hyperkalemia. Administering KCl to a patient with K⁺ 7.2 would be immediately life-threatening.", consequence: "Administering KCl for hyperkalemia = fatal cardiac arrhythmia" },
      { id: "b", text: "Notify the provider immediately and prepare for emergent calcium gluconate administration", correct: true, rationale: "Severe hyperkalemia (K⁺ 7.2) with ECG changes (peaked T, wide QRS) requires immediate treatment. Calcium gluconate 1g IV stabilizes the cardiac membrane within 1–3 minutes and is the first emergent intervention." },
      { id: "c", text: "Encourage oral fluid intake and reassess potassium level in 4 hours", correct: false, rationale: "K⁺ 7.2 with ECG changes is a cardiac emergency. A 4-hour delay risks VF.", consequence: "4-hour delay with K⁺ 7.2 and QRS widening risks cardiac arrest" },
      { id: "d", text: "Obtain a 12-lead ECG and wait for the provider to assess before initiating treatment", correct: false, rationale: "A 12-lead ECG is indicated, but waiting for provider assessment before any action is unsafe. Prepare calcium gluconate while calling the provider.", consequence: "Passive waiting with K⁺ 7.2 and wide QRS delays cardiac membrane protection" },
    ],
    correctIds: ["b"],
    rationale:
      "Severe hyperkalemia (K⁺ ≥ 6.5) with ECG changes (peaked T waves, prolonged PR, widened QRS) is a cardiac emergency. " +
      "The priority intervention is calcium gluconate 1g IV — it does not lower potassium but immediately stabilizes the cardiac membrane, preventing VF. " +
      "This must be followed by potassium-lowering therapy: insulin + dextrose, sodium bicarbonate (if acidotic), and emergent dialysis. " +
      "The critical trap: administering KCl (potassium chloride) thinking you're treating an 'electrolyte imbalance' — this error is immediately fatal.",
    targetedTrap: "Administering KCl for hyperkalemia (confusion with hypokalemia treatment)",
    difficulty: 3,
    applicableTiers: ["RN", "NP", "new_grad"],
  },

  // ══ SATA — STEMI Protocol ════════════════════════════════════════════════
  {
    id: "ngn-sata-stemi-protocol",
    title: "Inferior STEMI — Protocol Actions SATA",
    format: "sata",
    primaryJudgmentLayer: "take_actions",
    secondaryJudgmentLayers: ["recognize_cues", "generate_solutions"],
    rhythmKeys: ["stemi_pattern"],
    caseStem:
      "A nurse working in the emergency department is caring for a 62-year-old male with chest pressure, diaphoresis, " +
      "and nausea. The 12-lead ECG shows: ST elevation of 3 mm in leads II, III, aVF; " +
      "reciprocal ST depression in leads I and aVL; heart rate 56 BPM. Blood pressure 138/88 mmHg.",
    questionStem: "Which actions should the nurse take at this time? Select all that apply.",
    options: [
      { id: "a", text: "Activate the STEMI alert and notify interventional cardiology immediately", correct: true, rationale: "STEMI alert activation is the highest priority action — every minute of delay costs cardiomyocytes. Do not wait for troponin results." },
      { id: "b", text: "Administer aspirin 325 mg chewed if no contraindication", correct: true, rationale: "Aspirin is Class I for STEMI. It should be given immediately and is a key time-sensitive intervention." },
      { id: "c", text: "Administer sublingual nitroglycerin 0.4 mg immediately for chest pain relief", correct: false, rationale: "Nitroglycerin is CONTRAINDICATED before right-sided leads are obtained in inferior STEMI. RV MI (a common inferior STEMI complication) is preload-dependent — nitrates cause fatal hypotension.", consequence: "Nitrates in RV MI → severe hypotension → hemodynamic collapse" },
      { id: "d", text: "Obtain right-sided ECG leads (V4R) to rule out right ventricular MI", correct: true, rationale: "Inferior STEMI + bradycardia (HR 56) suggests RCA involvement of both the inferior wall and SA node. V4R identifies RV MI, which contraindicates nitrates." },
      { id: "e", text: "Administer supplemental oxygen via nasal cannula at 2–4 L/min routinely", correct: false, rationale: "Routine oxygen in a normoxic STEMI patient (SpO₂ 97%) causes coronary vasoconstriction and worsens outcomes. Use oxygen ONLY if SpO₂ < 94%." },
      { id: "f", text: "Establish two large-bore IV lines and draw blood for troponin, CBC, BMP, and coagulation", correct: true, rationale: "IV access and labs are standard STEMI protocol actions. Labs run in parallel — not before cath lab activation." },
      { id: "g", text: "Wait for troponin results before activating the cath lab to confirm MI", correct: false, rationale: "STEMI is an ECG and clinical diagnosis. Troponins may be negative in early STEMI (< 6 hours from onset). Waiting for results delays PCI and increases infarct size.", consequence: "Troponin wait = delayed cath lab activation = larger infarct size" },
    ],
    correctIds: ["a", "b", "d", "f"],
    rationale:
      "Inferior STEMI protocol: (1) Activate STEMI alert NOW, (2) Aspirin 325 mg chewed, (3) RIGHT-SIDED LEADS before any nitrates — inferior STEMI + bradycardia suggests RCA involvement and RV MI, (4) IV access × 2 + labs running in parallel. " +
      "Do NOT give nitrates without V4R confirmation. Do NOT give routine O₂ in a normoxic patient. Do NOT wait for troponin before cath lab activation. These are the three most tested STEMI traps in NCLEX-style ECG items.",
    difficulty: 4,
    applicableTiers: ["RN", "NP", "new_grad"],
  },
];

// ─── Accessor functions ────────────────────────────────────────────────────────

export function getEcgNgnCase(id: string): EcgNgnCase | undefined {
  return ECG_NGN_CASES.find((c) => c.id === id);
}

export function getCasesByFormat(format: EcgNgnQuestionFormat): ReadonlyArray<EcgNgnCase> {
  return ECG_NGN_CASES.filter((c) => c.format === format);
}

export function getCasesByRhythm(rhythmKey: string): ReadonlyArray<EcgNgnCase> {
  return ECG_NGN_CASES.filter((c) => c.rhythmKeys.includes(rhythmKey));
}

export function getCasesByJudgmentLayer(
  layer: EcgNgnClinicalJudgmentLayer,
): ReadonlyArray<EcgNgnCase> {
  return ECG_NGN_CASES.filter(
    (c) => c.primaryJudgmentLayer === layer || c.secondaryJudgmentLayers.includes(layer),
  );
}

export const NGN_CASE_IDS: ReadonlyArray<string> = ECG_NGN_CASES.map((c) => c.id);

export const NGN_FORMATS_COVERED: ReadonlyArray<EcgNgnQuestionFormat> = [
  ...new Set(ECG_NGN_CASES.map((c) => c.format)),
];
