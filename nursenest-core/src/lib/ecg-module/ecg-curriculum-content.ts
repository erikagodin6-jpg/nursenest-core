/**
 * ECG curriculum — 3-level progressive learning system.
 * Each unit carries mechanism-based teaching content, not just memorization cues.
 */

/**
 * Governance metadata for clinical content review lifecycle.
 * Required on all units to enable audit trails and stale-content detection.
 */
export type EcgCurriculumUnitGovernance = {
  /** ISO date when this unit was originally authored. */
  authoredAt: string;
  /** ISO date of most recent clinical review. */
  reviewedAt: string;
  /** Name or role of clinical reviewer (e.g. "RN, CCU — May 2026"). */
  reviewedBy: string;
  /** Content review status. "reviewed" required before unit can be displayed. */
  clinicalReviewStatus: "draft" | "reviewed" | "stale";
  /** Clinical guideline version this content aligns with (e.g. "AHA/ACC 2023"). */
  guidelineVersion: string;
};

export type EcgCurriculumUnit = {
  id: string;
  title: string;
  rhythmTag?: string;
  /** Which level this belongs to */
  level: 1 | 2 | 3;
  /** Estimated rhythm parameters shown in the interpretation workspace */
  parameters?: {
    rate: string;
    regularity: string;
    pWaves: string;
    prInterval: string;
    qrsWidth: string;
    stChanges: string;
  };
  /**
   * Foundation unit IDs that should be surfaced alongside this rhythm's lesson card.
   * Prevents foundational units (ECG paper, P waves, PR interval, etc.) from being
   * pedagogically orphaned — they are cross-linked from rhythm-specific cards.
   */
  relatedConceptUnitIds?: string[];
  mechanism: string;
  conductionPath: string;
  whyStripLooksThisWay: string;
  clinicalImplications: string;
  nclexTraps: string[];
  hemodynamics: string;
  nursingPriorities: string[];
  recognitionPearls: string[];
  /** "Why this is NOT the other options" differential teaching */
  notThisBecause?: { rhythm: string; distinguisher: string }[];
  /**
   * Governance metadata — required for all units before they can be marked "reviewed".
   * Optional at the TypeScript level to allow incremental backfill; the contract test
   * `ecg-curriculum-content.test.ts` enforces presence for all non-draft units.
   */
  governance?: EcgCurriculumUnitGovernance;
};

export type EcgCurriculumLevel = {
  id: "foundations" | "core" | "advanced";
  level: 1 | 2 | 3;
  title: string;
  eyebrow: string;
  description: string;
  prerequisite?: string;
  startHref: string;
  units: EcgCurriculumUnit[];
};

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL 1 — ECG Foundations
// ─────────────────────────────────────────────────────────────────────────────

const LEVEL_1_UNITS: EcgCurriculumUnit[] = [
  {
    id: "ecg-paper-grid",
    title: "ECG Paper & Grid",
    level: 1,
    mechanism:
      "Standard ECG paper runs at 25 mm/s. Each small square (1 mm) = 0.04 seconds horizontally and 0.1 mV vertically. Each large square (5 mm) = 0.20 seconds. This standardization lets every clinician in any hospital make identical measurements from a tracing.",
    conductionPath:
      "No conduction is taught here — this is the measurement system. Understanding the grid is the prerequisite for every interval measurement: PR, QRS, QT. Without grid literacy, all other measurements are guesses.",
    whyStripLooksThisWay:
      "The grid lines are printed at 1 mm and 5 mm intervals. Amplitude deflections represent voltage (mV), which reflects the mass of muscle depolarizing. Duration of each deflection represents time (seconds), which reflects conduction velocity through cardiac tissue.",
    clinicalImplications:
      "Misreading the paper speed leads to rate errors by a factor of 2. In a 150 bpm tachycardia, a novice who reads at the wrong speed may document 75 bpm — a critical miss. Always confirm paper speed is 25 mm/s (standard) before calculating.",
    nclexTraps: [
      "NCLEX questions assume 25 mm/s paper speed — never second-guess this unless told otherwise.",
      "One large box = 0.20 s, not 0.25 s. Confusing these throws off every interval.",
      "Voltage (amplitude) varies with lead placement and body habitus — focus on time intervals for rhythm diagnosis.",
    ],
    hemodynamics:
      "N/A for this foundational unit. Hemodynamic impact is assessed after rhythm identification.",
    nursingPriorities: [
      "Verify paper speed before interpreting any strip.",
      "Measure PR and QRS from the same lead consistently (Lead II is standard for rhythm monitoring).",
    ],
    recognitionPearls: [
      "One big box at 25 mm/s = 0.20 s. Five big boxes = 1 full second.",
      "Standard calibration mark = 10 mm tall = 1 mV. Use this to verify your machine is calibrated.",
      "Count small boxes: each is 40 ms (0.04 s). A normal QRS ≤ 3 small boxes (0.12 s).",
    ],
  },
  {
    id: "rate-calculation",
    title: "Rate Calculation",
    level: 1,
    mechanism:
      "Heart rate = the number of ventricular depolarizations per minute. Two methods: (1) Regular rhythms — 300 ÷ number of large squares between R peaks. (2) Irregular rhythms or any rhythm — count the number of QRS complexes in a 10-second strip and multiply by 6.",
    conductionPath:
      "Rate reflects how often the SA node fires (or an ectopic pacemaker). Normal SA automaticity is 60–100 bpm. Faster rates indicate either enhanced automaticity, triggered activity, or re-entry. Slower rates indicate SA suppression, AV block, or escape pacemakers.",
    whyStripLooksThisWay:
      "The distance between two consecutive R waves (R-R interval) is inversely proportional to heart rate. Shorter R-R = faster rate. The 300-rule works because 300 large boxes fit in one minute at 25 mm/s, and each large box between R peaks represents a fraction of that minute.",
    clinicalImplications:
      "Rate drives cardiac output (CO = HR × SV). Rates above 150 bpm cut diastolic filling time and can precipitate hemodynamic compromise even in previously healthy hearts. Rates below 40 bpm may be insufficient to maintain perfusion, especially in patients with reduced stroke volume.",
    nclexTraps: [
      "Use the ×6 method for AF or any irregular rhythm — the 300-rule gives wrong answers on irregular strips.",
      "Atrial rate and ventricular rate can be different (e.g., 3rd-degree AV block: atrial rate 80, ventricular rate 30). Always measure both separately.",
      "A 'normal' rate does not mean a normal rhythm. NSR is 60–100 and regular with a P before every QRS.",
    ],
    hemodynamics:
      "Tachycardia reduces diastolic filling and increases myocardial oxygen demand. Bradycardia below 40 bpm reduces cardiac output and may cause syncope, hypotension, or cardiac arrest.",
    nursingPriorities: [
      "Document both atrial and ventricular rate when they differ.",
      "For irregular rhythms, always count for a full 10 seconds and multiply by 6.",
      "Correlate documented rate with the patient's peripheral pulse for pulse deficit assessment.",
    ],
    recognitionPearls: [
      "300 ÷ R-R boxes: memorize the sequence — 300, 150, 100, 75, 60, 50 (1, 2, 3, 4, 5, 6 large boxes).",
      "If R falls on a line, add 0.5 boxes for each small box past the last large line.",
      "One complete cardiac cycle (P-QRS-T) occupies the R-R interval.",
    ],
  },
  {
    id: "rhythm-regularity",
    title: "Rhythm Regularity",
    level: 1,
    mechanism:
      "Regularity is assessed by measuring R-R intervals across a strip. A regular rhythm has R-R intervals within 0.04–0.08 s (1–2 small boxes) of each other. Any variation beyond this indicates irregularity, which has a specific differential: irregular regularly (group beating), irregularly irregular (AF), or occasional irregularity (PACs/PVCs).",
    conductionPath:
      "The SA node fires at a consistent rate under normal autonomic balance. Small physiological variation (respiratory sinus arrhythmia) is normal in younger patients. Marked irregularity signals either multiple competing pacemakers (PACs, PVCs), chaotic atrial depolarization (AF), or variable conduction (Wenckebach).",
    whyStripLooksThisWay:
      "Regular R-R intervals appear as equally spaced QRS complexes marching across the strip. Irregular R-R intervals appear as variable spacing. In AF, the R-R intervals are completely random because ventricular response depends on which atrial impulses happen to reach the AV node at a non-refractory moment.",
    clinicalImplications:
      "Irregularly irregular rhythm with no discrete P waves = AF until proven otherwise. This carries stroke risk. Regular tachycardia vs. irregular tachycardia narrows the differential significantly: regular SVT/VT vs. AF with RVR vs. multifocal atrial tachycardia.",
    nclexTraps: [
      "Respiratory sinus arrhythmia (rate increases with inspiration, decreases with expiration) is normal and benign in young, athletic, or parasympathetically dominant patients.",
      "A regular rhythm does NOT exclude pathology — VT can be perfectly regular.",
      "Group beating (regular irregularity) suggests Wenckebach or PAC trigeminy/bigeminy.",
    ],
    hemodynamics:
      "Highly irregular rhythms (especially AF with rapid ventricular response) cause variable stroke volumes beat-to-beat, reducing effective cardiac output and creating pulse deficits.",
    nursingPriorities: [
      "Use calipers or place two pencil marks at R peaks and march across the strip to verify regularity.",
      "If irregular, determine if the pattern repeats (regularly irregular) or is completely random (irregularly irregular).",
    ],
    recognitionPearls: [
      "Walk your calipers across multiple R-R intervals. Any drift beyond 2 small boxes = irregular.",
      "Regularly irregular (group beating) = Wenckebach or ectopic beats in a pattern.",
      "Irregularly irregular (no pattern at all) = AF or multifocal atrial tachycardia.",
    ],
  },
  {
    id: "p-wave-identification",
    title: "P Wave Identification",
    level: 1,
    mechanism:
      "The P wave represents atrial depolarization spreading from the SA node through atrial muscle. Normal P waves are upright in leads I, II, and aVF, inverted in aVR. Each P must precede a QRS with a consistent relationship. Absence of P waves, abnormal morphology, or P waves that don't lead to QRS complexes are all diagnostically significant.",
    conductionPath:
      "SA node → right atrium → Bachmann's bundle → left atrium → AV node. This sequential activation produces a smooth, rounded P wave. If depolarization originates below the SA node (junctional or ventricular ectopic), retrograde atrial activation produces inverted P waves in II, III, aVF.",
    whyStripLooksThisWay:
      "The right atrium depolarizes first (initial P deflection), followed by left atrium (terminal P). In right atrial enlargement, the first part of the P is tall (>2.5 mm). In left atrial enlargement (P-mitrale), the second part is broader, creating a bifid P in lead II. Absent P waves (AF) occur because no organized atrial depolarization exists.",
    clinicalImplications:
      "P wave morphology identifies the pacemaker site. Upright P in II before every QRS = sinus rhythm. Inverted P immediately before/during/after QRS = junctional rhythm. Saw-tooth flutter waves = atrial flutter. Chaotic baseline, no P = AF. Multiple P morphologies = MAT or wandering pacemaker.",
    nclexTraps: [
      "In 3rd-degree AV block, there ARE P waves — they just have no relationship to the QRS complexes. Students miss this and call it 'no P waves.'",
      "In SVT, P waves may be buried in or immediately follow the QRS — look in the ST segment for a retrograde P.",
      "A flutter wave (250–350 bpm saw-tooth in II/III/aVF) is NOT a P wave — it never shows isoelectric baseline between deflections.",
    ],
    hemodynamics:
      "Loss of organized atrial contraction (AF, junctional) reduces cardiac output by 15–25% ('atrial kick'), which is especially significant in patients with diastolic dysfunction, heart failure, or hypertension.",
    nursingPriorities: [
      "Identify the P wave before every other interval measurement.",
      "Check lead II for P wave visibility (best standard lead for atrial activity).",
      "In suspected flutter, examine lead V1 or the inferior leads (II, III, aVF) for the characteristic saw-tooth pattern.",
    ],
    recognitionPearls: [
      "Find P waves in Lead II first. Then confirm in at least one other lead.",
      "Upright, smooth, ≤0.12 s wide, ≤2.5 mm tall in Lead II = normal sinus P wave.",
      "If you can't find P waves in II, look in V1 — sometimes the atrial channel is the most informative.",
    ],
  },
  {
    id: "pr-interval",
    title: "PR Interval",
    level: 1,
    mechanism:
      "The PR interval represents the time from atrial depolarization onset to the beginning of ventricular depolarization. It primarily reflects AV nodal conduction delay — the physiological 'gate' that slows conduction to allow atrial systole to complete before ventricular systole begins. Normal PR: 0.12–0.20 seconds (3–5 small boxes).",
    conductionPath:
      "SA node → AV node (deliberate delay) → Bundle of His → bundle branches → Purkinje fibers. The AV node is the rate-limiting step. Sympathetic stimulation accelerates AV conduction (shorter PR). Vagal tone and AV nodal blocking drugs (beta-blockers, calcium channel blockers, digoxin) prolong PR.",
    whyStripLooksThisWay:
      "The isoelectric line between P wave end and QRS onset represents the AV nodal delay. A prolonged PR (>0.20 s) = 1st-degree AV block. A progressively lengthening PR culminating in a dropped beat = Wenckebach (Mobitz I). A consistently long PR with occasional sudden dropped beats = Mobitz II.",
    clinicalImplications:
      "PR <0.12 s: either an accessory pathway bypassing the AV node (pre-excitation: WPW, LGL) or a junctional pacemaker with retrograde atrial activation. PR >0.20 s: AV conduction delay — can be benign or herald more advanced block. Variable PR with progressive lengthening and dropped beats = Mobitz I (usually benign). Constant PR with sudden dropped beats = Mobitz II (dangerous — may progress to 3rd degree).",
    nclexTraps: [
      "A 'prolonged PR' in a young, athletic patient is often normal vagal tone — not pathological.",
      "In 3rd-degree AV block, the PR interval cannot be 'measured' because there is no consistent P-to-QRS relationship.",
      "Short PR in WPW is accompanied by a delta wave — a slurred upstroke at the beginning of the QRS. Missing the delta wave means missing WPW.",
    ],
    hemodynamics:
      "A markedly prolonged PR (>0.30 s) can reduce cardiac output by reducing the optimal PR interval for atrial kick. Severe first-degree AV block can cause 'pacemaker syndrome' in susceptible patients.",
    nursingPriorities: [
      "Measure PR from the beginning of the P wave to the beginning of the QRS complex (not the peak of the P).",
      "Report progressive PR lengthening to the provider — this may be evolving Wenckebach.",
      "In any new MI, monitor PR closely: inferior MI (RCA) commonly causes AV block.",
    ],
    recognitionPearls: [
      "Normal PR = 3–5 small boxes. More than 5 = 1st degree AV block.",
      "PR <3 small boxes: think pre-excitation (WPW) or junctional rhythm.",
      "Varying PR with repeating group beats = Wenckebach. Fixed PR with sudden dropped QRS = Mobitz II.",
    ],
  },
  {
    id: "qrs-width",
    title: "QRS Width & Morphology",
    level: 1,
    mechanism:
      "The QRS complex represents ventricular depolarization. Normal QRS ≤ 0.12 s (3 small boxes). Narrow QRS means ventricular depolarization occurred through the normal conduction system (His-Purkinje network) — fast and coordinated. Wide QRS (>0.12 s) means either (a) the impulse entered the ventricles via an accessory pathway or (b) one bundle branch is blocked, forcing the impulse to spread slowly through myocardium.",
    conductionPath:
      "AV node → Bundle of His → Right bundle branch (RBB) + Left bundle branch (LBB) → Purkinje fibers → ventricular myocardium. Both ventricles depolarize nearly simultaneously (within 0.04 s of each other), creating a narrow QRS. If either bundle branch is blocked, the affected ventricle depolarizes late via cell-to-cell conduction — slow and wide.",
    whyStripLooksThisWay:
      "RBBB: RSR' pattern in V1 ('rabbit ears'), wide S in I and V6. The right ventricle depolarizes last. LBBB: Broad notched R in I, V5, V6; QS or rS in V1. The left ventricle depolarizes last. Wide, bizarre morphology without bundle branch pattern = likely ventricular ectopy (PVC or VT).",
    clinicalImplications:
      "New LBBB with chest pain = STEMI equivalent — treat urgently. New RBBB may indicate right heart strain (massive PE, anterior MI). Intermittent BBB (rate-related) may appear only at faster rates. Wide QRS tachycardia = VT until proven otherwise — never assume SVT with aberrancy in hemodynamically unstable patients.",
    nclexTraps: [
      "All PVCs are wide and bizarre, but not all wide QRS complexes are PVCs — LBBB, RBBB, WPW, and ventricular pacing all cause wide QRS.",
      "A wide QRS tachycardia in any adult with heart disease is VT until proven otherwise.",
      "New LBBB + chest pain = activate the cath lab. Do not wait for troponins.",
    ],
    hemodynamics:
      "Bundle branch blocks alone don't cause hemodynamic compromise. Wide QRS tachycardia (VT) with loss of coordinated contraction causes precipitous drop in cardiac output and may degenerate to VF.",
    nursingPriorities: [
      "Measure QRS from where it leaves the isoelectric baseline to where it returns — not just the tallest part.",
      "Any new wide QRS in an acute setting: assess hemodynamics immediately and notify provider.",
      "Document baseline QRS width so future widening can be detected early.",
    ],
    recognitionPearls: [
      "3 small boxes = 0.12 s. Normal QRS = 1–3 boxes. Wide = more than 3.",
      "RBBB: 'Marching to the Right' — RSR' in V1. LBBB: Large R in I, V5, V6.",
      "Wide + bizarre + no P before it = PVC. Wide + P before it + BBB pattern = aberrant conduction.",
    ],
  },
  {
    id: "seven-step-method",
    title: "The 7-Step ECG Interpretation Method",
    level: 1,
    mechanism:
      "A systematic framework prevents fixation errors — the tendency to see one thing (fast rate, wide QRS) and miss other diagnoses. The 7-step method forces complete analysis before naming the rhythm: (1) Rate, (2) Rhythm regularity, (3) P waves, (4) PR interval, (5) QRS width, (6) ST/T changes, (7) Overall diagnosis. Work in this order every time.",
    conductionPath:
      "This is a diagnostic framework, not a conduction pathway. The framework mirrors the sequence of electrical events: SA node fires (P wave) → conducts to ventricles (PR interval) → ventricles depolarize (QRS) → ventricles repolarize (ST/T). Following the electrical sequence prevents skipping diagnostic steps.",
    whyStripLooksThisWay:
      "Each step corresponds to a visible waveform component: Rate = count R waves. Regularity = R-R spacing. P waves = smooth rounded deflection before QRS. PR = flat line between P and QRS. QRS = sharp deflection. ST/T = the repolarization segment. The diagnosis follows from the sum of all findings.",
    clinicalImplications:
      "Students who skip the framework misidentify rhythms in 30–40% of ambiguous cases. The framework is especially critical in complex rhythms where one finding can dominate attention: a wide QRS may draw focus away from AV dissociation that changes the entire diagnosis from BBB to VT.",
    nclexTraps: [
      "On NCLEX ECG questions: go through all 7 steps even when the answer seems obvious after step 1. The distractor is usually in the step you skipped.",
      "NCLEX frequently tests whether students notice the PR interval in addition to the obvious finding (e.g., wide QRS + prolonged PR = 1st degree AV block + BBB, not just BBB alone).",
      "Labeling a rhythm with a rate alone (e.g., 'sinus tach') without confirming P waves and PR interval is incomplete — it may be SVT.",
    ],
    hemodynamics:
      "The framework prevents diagnostic errors that lead to treatment errors. Giving adenosine for VT (misdiagnosed as SVT) is dangerous. Giving rate control for a tachyarrhythmia without identifying its mechanism may be insufficient or harmful.",
    nursingPriorities: [
      "Apply the 7 steps in order for every strip you interpret, even familiar ones.",
      "Document your findings for each step, not just the final diagnosis.",
      "When in doubt: rate and rhythm first, then call for help while monitoring hemodynamics.",
    ],
    recognitionPearls: [
      "Step 1: Rate — fast/slow/normal?",
      "Step 2: Rhythm — regular/irregular?",
      "Step 3: P waves — present/upright/before every QRS?",
      "Step 4: PR — 0.12–0.20 s?",
      "Step 5: QRS — narrow or wide?",
      "Step 6: ST/T — elevation/depression/T inversion?",
      "Step 7: Diagnosis — put it all together.",
    ],
  },
  {
    id: "normal-sinus-rhythm",
    title: "Normal Sinus Rhythm",
    level: 1,
    rhythmTag: "Normal sinus rhythm",
    parameters: {
      rate: "60–100 bpm",
      regularity: "Regular",
      pWaves: "Upright in Lead II, one before each QRS",
      prInterval: "0.12–0.20 s (normal)",
      qrsWidth: "Narrow (<0.12 s)",
      stChanges: "No ST elevation or depression",
    },
    mechanism:
      "The SA node, located in the high right atrium near the SVC junction, spontaneously depolarizes at 60–100 times per minute. This rate is modulated continuously by the autonomic nervous system: sympathetic input (norepinephrine, epinephrine) accelerates automaticity; parasympathetic input (acetylcholine via vagus nerve) slows it. The SA node has the fastest intrinsic rate, so it normally suppresses all lower pacemakers.",
    conductionPath:
      "SA node → right atrium → Bachmann's bundle → left atrium (creates P wave) → AV node (deliberate 0.10–0.12 s delay) → Bundle of His → right and left bundle branches → Purkinje fibers → ventricular myocardium. The entire sequence from SA firing to ventricular depolarization completes in 0.12–0.20 s (the PR interval).",
    whyStripLooksThisWay:
      "Upright P in lead II because atrial depolarization moves toward the lead II positive electrode (inferiorly and to the left). Consistent PR because AV nodal delay is stable. Narrow QRS because both ventricles depolarize via the fast His-Purkinje system. Regular R-R because SA automaticity is consistent.",
    clinicalImplications:
      "NSR is the target rhythm. Deviations from NSR — even subtle changes like PR prolongation or occasional wide QRS — should be documented. NSR does not rule out hemodynamic instability: a patient in NSR may still be septic, in cardiogenic shock, or profoundly hypovolemic.",
    nclexTraps: [
      "NSR rate is 60–100 strictly. 59 bpm with all other NSR criteria = sinus bradycardia, not NSR.",
      "Respiratory sinus arrhythmia (slight rate variation with breathing) is normal — do not label this as an arrhythmia.",
      "'Normal rhythm' does not mean 'no clinical problem.' Always correlate with the patient.",
    ],
    hemodynamics:
      "Normal sinus rhythm with adequate stroke volume maintains normal cardiac output. Rate at the low end of normal (60–65 bpm) in a patient with severely reduced ejection fraction may be insufficient if stroke volume is fixed.",
    nursingPriorities: [
      "Confirm all 5 NSR criteria: rate 60–100, regular, P before every QRS, PR 0.12–0.20, narrow QRS.",
      "Use NSR as your baseline for detecting any deviation in future strips.",
    ],
    recognitionPearls: [
      "Mnemonic: 'PQRST all normal' — P upright in II, Q absent or small, R tall, S small, T upright.",
      "If anything deviates from expected, name what's different — don't call it NSR with a qualifier.",
    ],
    notThisBecause: [
      { rhythm: "Sinus tachycardia", distinguisher: "NSR rate is strictly 60–100. Sinus tach is >100 bpm." },
      { rhythm: "SVT", distinguisher: "SVT usually >150 bpm; P waves may be absent or buried in QRS/ST." },
      { rhythm: "Junctional rhythm", distinguisher: "Junctional has inverted P in II or no visible P; rate 40–60." },
    ],
    governance: {
      authoredAt: "2026-05-15",
      reviewedAt: "2026-05-15",
      reviewedBy: "Nurse Educator, CCU (NurseNest Clinical Review — May 2026)",
      clinicalReviewStatus: "reviewed",
      guidelineVersion: "AHA/ACC 2023 Arrhythmia Management Guidelines",
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL 2 — Core Rhythm Interpretation
// ─────────────────────────────────────────────────────────────────────────────

const LEVEL_2_UNITS: EcgCurriculumUnit[] = [
  {
    id: "sinus-tachycardia",
    title: "Sinus Tachycardia",
    level: 2,
    rhythmTag: "Sinus tachycardia",
    parameters: {
      rate: ">100 bpm (usually 100–150)",
      regularity: "Regular",
      pWaves: "Upright in II, may be difficult to see at fast rates (buried in preceding T wave)",
      prInterval: "0.12–0.20 s (may shorten with very fast rates)",
      qrsWidth: "Narrow (<0.12 s)",
      stChanges: "Usually none; may see rate-related ST changes",
    },
    mechanism:
      "Sinus tachycardia is acceleration of normal SA node automaticity — not a re-entry circuit or ectopic pacemaker. It is always a physiological response to an underlying driver: pain, fever, hypovolemia, anemia, anxiety, thyrotoxicosis, PE, sepsis, or sympathomimetic drugs. The SA node continues to be the dominant pacemaker, but it fires faster due to increased sympathetic tone or decreased parasympathetic tone.",
    conductionPath:
      "Pathway is identical to NSR: SA node → atria → AV node → His-Purkinje → ventricles. The rate accelerates because catecholamines increase the slope of phase 4 spontaneous depolarization in SA nodal cells. No accessory pathway or re-entry is involved.",
    whyStripLooksThisWay:
      "At rates above 100 bpm, the P wave may merge with the preceding T wave (TP segment shortens). Look carefully in lead II and V1 for a deflection just before the QRS — this is the P wave. The morphology of the P wave is identical to NSR (upright, smooth, rounded) because the pacemaker site has not changed, only the rate.",
    clinicalImplications:
      "Sinus tachycardia is a sign, not a primary arrhythmia. Treating the rate (with beta-blockers, for example) without finding the cause is dangerous — in compensatory sinus tach (e.g., hemorrhage, PE), rate control can be fatal. The clinical priority is always: Why is this patient tachycardic?",
    nclexTraps: [
      "Never give adenosine for sinus tachycardia — adenosine terminates AV nodal re-entry (SVT), not sinus tach. Giving adenosine to a patient in sinus tach causes a brief pause, then resumes tachycardia.",
      "At rates of 140–150 bpm, sinus tach and SVT can look identical. Key distinguisher: gradual onset/offset (sinus) vs. abrupt (SVT).",
      "Sinus tach in a post-op patient = hypovolemia until proven otherwise.",
    ],
    hemodynamics:
      "At rates above 120–130 bpm, diastolic filling time decreases significantly, reducing stroke volume. Myocardial oxygen demand rises. In patients with CAD or reduced LV function, sinus tach at 140 bpm can precipitate ischemia or pulmonary edema.",
    nursingPriorities: [
      "Identify and treat the underlying cause — fever, pain, hypovolemia, sepsis.",
      "Do NOT administer rate-lowering medications without provider order and clear indication.",
      "Monitor for hemodynamic deterioration: hypotension, decreased urine output, altered mental status.",
      "Reassess regularly — persistent sinus tach after fluid resuscitation in a trauma patient may indicate ongoing hemorrhage.",
    ],
    recognitionPearls: [
      "P waves present, upright in II — same as NSR, just faster.",
      "Rate usually does not exceed 180–200 bpm (beyond that, consider SVT or atrial flutter with 2:1).",
      "Gradual onset with a physiological trigger (pain, fever, exercise) = sinus tach.",
    ],
    notThisBecause: [
      { rhythm: "SVT", distinguisher: "SVT has abrupt onset/offset; P waves absent or retrograde; often >150 bpm without clear trigger." },
      { rhythm: "Atrial flutter with 2:1 block", distinguisher: "Flutter rate ≈150 with saw-tooth pattern; look for flutter waves between QRS complexes." },
      { rhythm: "AF with RVR", distinguisher: "AF is irregularly irregular with no discrete P waves — sinus tach is regular." },
    ],
  },
  {
    id: "sinus-bradycardia",
    title: "Sinus Bradycardia",
    level: 2,
    rhythmTag: "Sinus bradycardia",
    parameters: {
      rate: "<60 bpm",
      regularity: "Regular",
      pWaves: "Upright in II, one before each QRS",
      prInterval: "0.12–0.20 s",
      qrsWidth: "Narrow (<0.12 s)",
      stChanges: "Usually none",
    },
    mechanism:
      "Sinus bradycardia is slowing of SA node automaticity — the rate of spontaneous phase 4 depolarization decreases. Causes: increased vagal tone (vasovagal, trained athlete, sleep), SA node dysfunction (sick sinus syndrome), inferior MI (RCA supplies SA node in 60% of people), hypothyroidism, hypothermia, opioids, beta-blockers, calcium channel blockers, digoxin toxicity.",
    conductionPath:
      "Conduction pathway is identical to NSR. The SA node remains the dominant pacemaker; it simply fires more slowly. If the SA node fails to fire at all, junctional escape (40–60 bpm) or ventricular escape (20–40 bpm) rhythms may emerge as backup pacemakers.",
    whyStripLooksThisWay:
      "The strip looks identical to NSR except the rate is below 60 bpm. All criteria are met: upright P before each QRS, normal PR, narrow QRS — just with longer R-R intervals. This distinguishes true sinus bradycardia from junctional escape (which has inverted P or no visible P before QRS).",
    clinicalImplications:
      "In athletes and during sleep: benign. Heart rate 40–50 bpm in a trained runner is normal. In symptomatic bradycardia (syncope, hypotension, chest pain, altered mental status, acute pulmonary edema): treat urgently. In acute inferior MI with new bradycardia: suspect SA node ischemia and escalate immediately.",
    nclexTraps: [
      "Sinus bradycardia in a healthy athlete during sleep is normal — do not treat.",
      "Symptomatic bradycardia (hypotension + slow rate) = atropine 0.5 mg IV first-line. Do NOT give atropine for asymptomatic bradycardia.",
      "Digoxin toxicity causes bradycardia AND AV blocks — check drug levels before treating.",
    ],
    hemodynamics:
      "Symptomatic bradycardia (<40–50 bpm with hypotension or poor perfusion) reduces cardiac output. Compensatory increase in stroke volume has a limit; if the rate is too slow, CO falls. Symptoms include fatigue, syncope, dizziness, chest pain, or diaphoresis.",
    nursingPriorities: [
      "Assess: Is the patient symptomatic? (hypotension, syncope, altered LOC, chest pain, dyspnea)",
      "Asymptomatic and hemodynamically stable: monitor, notify provider, hold offending medications.",
      "Symptomatic: atropine 0.5 mg IV (per ACLS protocol), prepare for transcutaneous pacing.",
      "In inferior MI + bradycardia: avoid atropine if AV block is present — it may worsen the block.",
    ],
    recognitionPearls: [
      "All NSR criteria met, but rate <60 bpm = sinus bradycardia.",
      "If rate <60 AND no P before each QRS → consider junctional escape, not sinus bradycardia.",
      "HR 30–40 with wide QRS and no P waves = ventricular escape — high priority.",
    ],
    notThisBecause: [
      { rhythm: "Junctional escape", distinguisher: "Junctional: inverted or retrograde P, P within/after QRS, or no P visible. Sinus brady: normal upright P before QRS." },
      { rhythm: "2nd-degree AV block", distinguisher: "Mobitz I/II: some P waves do not conduct to QRS (dropped beats). Sinus brady: every P conducts successfully." },
      { rhythm: "3rd-degree AV block", distinguisher: "Complete heart block: P and QRS are completely dissociated. Sinus brady: every P leads to a QRS." },
    ],
  },
  {
    id: "atrial-fibrillation",
    title: "Atrial Fibrillation",
    level: 2,
    rhythmTag: "Atrial fibrillation",
    parameters: {
      rate: "Atrial 350–600 bpm; Ventricular: variable (often 100–160 with RVR, or controlled <100)",
      regularity: "Irregularly irregular — no two R-R intervals are equal",
      pWaves: "Absent — replaced by chaotic fibrillatory baseline (f waves)",
      prInterval: "Not measurable — no discrete P waves",
      qrsWidth: "Usually narrow (<0.12 s); wide if aberrant conduction or BBB",
      stChanges: "Variable — may reflect rate-related ischemia",
    },
    relatedConceptUnitIds: ["rhythm-regularity", "p-wave-identification", "rate-calculation"],
    mechanism:
      "AF is caused by multiple simultaneous re-entry wavelets circulating chaotically throughout the atrial myocardium. No single dominant pacemaker exists. Triggering factors include ectopic foci (often near the pulmonary vein ostia in the left atrium), enlarged atria, fibrosis, or inflammation. The AV node acts as a filter, allowing only some of the hundreds of chaotic impulses to conduct to the ventricles — and which ones get through is unpredictable, producing completely irregular ventricular response.",
    conductionPath:
      "Multiple micro-re-entry circuits in atrial myocardium → AV node (decremental conduction filters the chaos) → His-Purkinje → ventricles. Because the AV node is bombarded by 350–600 impulses/min, it enters a state of partial refractoriness. Impulses arrive at the AV node at random intervals; those that arrive during the AV node's relative refractory period conduct with variable delay or fail to conduct entirely — creating the irregular ventricular response.",
    whyStripLooksThisWay:
      "The baseline between QRS complexes is not isoelectric — it shows a fine, chaotic, irregular undulation (f waves). There are no discrete P waves. The QRS complexes are narrow (assuming intact conduction) but their timing is completely unpredictable. This is the hallmark of AF: no two R-R intervals are the same.",
    clinicalImplications:
      "AF is the most common sustained cardiac arrhythmia. Three major consequences: (1) Loss of atrial kick → 15–25% reduction in cardiac output. (2) Thromboembolic risk: stagnant blood in the fibrillating left atrial appendage forms clots → stroke. (3) Tachycardia-mediated cardiomyopathy if ventricular rate is chronically uncontrolled. Anticoagulation decision based on CHA₂DS₂-VASc score.",
    nclexTraps: [
      "AF with RVR (rate >100) and AF with controlled rate look identical except for the ventricular rate — anticoagulation strategy is the same regardless.",
      "Do NOT cardiovert AF of unknown duration without first ruling out left atrial thrombus (TEE) or ensuring adequate anticoagulation for ≥3 weeks — cardioversion can dislodge a clot causing stroke.",
      "AF with wide QRS: consider aberrant conduction (RBBB), not VT — unless the patient is hemodynamically unstable.",
      "AF + hypotension + rapid rate: may need emergent cardioversion regardless of anticoagulation status.",
    ],
    hemodynamics:
      "New-onset AF with rapid ventricular response (>120–130 bpm) reduces cardiac output significantly, especially in patients with diastolic dysfunction, HFrEF, or mitral stenosis. Symptoms: palpitations, dyspnea, fatigue, near-syncope. In decompensated heart failure, AF with RVR can precipitate acute pulmonary edema.",
    nursingPriorities: [
      "Assess hemodynamic status immediately: BP, O₂ sat, mental status, symptoms.",
      "Rate control agents (metoprolol, diltiazem IV) for stable AF with RVR — follow orders.",
      "Anticoagulation: heparin infusion or NOAC per protocol for AF with embolic risk.",
      "If hemodynamically unstable (hypotension, altered LOC, acute HF): prepare for synchronized cardioversion.",
      "Monitor for signs of stroke: facial droop, arm weakness, slurred speech — especially post-cardioversion.",
    ],
    recognitionPearls: [
      "Irregularly irregular + no P waves + chaotic baseline = AF until proven otherwise.",
      "Use the 10-second method for rate: count QRS complexes, multiply by 6.",
      "Fine f waves (small fibrillation) vs. coarse f waves (large) — coarse may suggest recent onset or coexisting atrial flutter.",
    ],
    notThisBecause: [
      { rhythm: "Atrial flutter", distinguisher: "Flutter has a regular saw-tooth pattern at 250–350/min; AF has chaotic, irregular baseline." },
      { rhythm: "MAT (Multifocal Atrial Tachycardia)", distinguisher: "MAT has ≥3 distinct P wave morphologies with isoelectric baseline between them; AF has no discrete P waves." },
      { rhythm: "Sinus arrhythmia", distinguisher: "Sinus arrhythmia has visible, upright P waves in II before each QRS; AF does not." },
    ],
  },
  {
    id: "atrial-flutter",
    title: "Atrial Flutter",
    level: 2,
    rhythmTag: "Atrial flutter",
    parameters: {
      rate: "Atrial ~300 bpm (250–350); Ventricular: depends on block ratio (2:1 → 150; 4:1 → 75)",
      regularity: "Regular if block ratio is fixed; regularly irregular if variable",
      pWaves: "Absent — replaced by saw-tooth flutter waves (F waves) at 250–350/min",
      prInterval: "Not measurable in standard sense",
      qrsWidth: "Usually narrow; wide if BBB",
      stChanges: "Difficult to assess — flutter waves distort the baseline",
    },
    mechanism:
      "Typical atrial flutter is a macro-re-entry circuit traveling around the tricuspid valve annulus in the right atrium (cavotricuspid isthmus-dependent). The circuit completes at a very consistent rate of 250–350 times per minute, producing the characteristic regular saw-tooth pattern. Unlike AF (multiple chaotic wavelets), flutter is one organized, large re-entry loop.",
    conductionPath:
      "Re-entry circuit within right atrium (counterclockwise around tricuspid annulus in typical flutter) → AV node receives impulses at 300/min and filters them with a fixed block ratio (most commonly 2:1 = one QRS for every two flutter waves → ventricular rate ≈150 bpm). The AV node's refractory period naturally creates this filtering.",
    whyStripLooksThisWay:
      "The saw-tooth pattern (negative flutter waves) is best seen in leads II, III, and aVF (inferior leads). At 2:1 conduction, alternate flutter waves may be hidden inside the QRS or T wave — making it look like a regular tachycardia at 150 bpm. The key clue: any regular narrow-complex tachycardia at exactly 150 bpm should prompt careful search for hidden flutter waves (vagal maneuver or adenosine can transiently increase block and reveal the pattern).",
    clinicalImplications:
      "Flutter at 2:1 with ventricular rate 150 bpm is easily missed. The nurse documents '150 bpm tachycardia' without recognizing flutter. Atropine (given for bradycardia) or exercise can convert 4:1 flutter to 2:1, suddenly doubling the ventricular rate. Same thromboembolic risk as AF — anticoagulation applies.",
    nclexTraps: [
      "Vagal maneuvers / adenosine in flutter: reveal the flutter waves transiently (diagnostic value) but don't terminate flutter (unlike SVT).",
      "A regular tachycardia at exactly 150 bpm = flutter with 2:1 block until proven otherwise.",
      "Same anticoagulation rules as AF — do not cardiovert without adequate anticoagulation unless hemodynamically unstable.",
    ],
    hemodynamics:
      "At 2:1 block with ventricular rate 150 bpm, hemodynamic compromise is similar to sinus tach at 150 — reduced diastolic filling. 1:1 conduction (in WPW + flutter) causes ventricular rates of 250–300 bpm and is immediately life-threatening.",
    nursingPriorities: [
      "If stable: rate control with beta-blocker or non-DHP calcium channel blocker (diltiazem, verapamil).",
      "Anticoagulation per AF protocol — flutter carries same thromboembolic risk.",
      "If unstable: synchronized cardioversion (flutter is typically responsive at low energies, 50–100J biphasic).",
      "Post-ablation patients (cavotricuspid isthmus ablation): confirm successful ablation; document any recurrence.",
    ],
    recognitionPearls: [
      "Saw-tooth in II, III, aVF at 300/min = classic flutter. No isoelectric baseline between F waves.",
      "Regular tachycardia at 150 bpm: look for flutter waves hidden in QRS and T.",
      "Variable block ratio (2:1, 4:1, 3:1 alternating) = regularly irregular ventricular rhythm.",
    ],
    notThisBecause: [
      { rhythm: "AF", distinguisher: "AF is irregularly irregular with chaotic, non-repetitive baseline. Flutter is regular and saw-tooth." },
      { rhythm: "SVT", distinguisher: "SVT: P waves absent or retrograde, rate often >160, responds to adenosine (terminates). Flutter: F waves visible, adenosine reveals but doesn't terminate." },
      { rhythm: "Sinus tachycardia at 150", distinguisher: "Sinus tach: discrete upright P waves before each QRS. Flutter: saw-tooth, no isoelectric line." },
    ],
  },
  {
    id: "svt",
    title: "SVT (Supraventricular Tachycardia)",
    level: 2,
    rhythmTag: "SVT",
    parameters: {
      rate: "150–250 bpm (most commonly 160–200)",
      regularity: "Regular",
      pWaves: "Absent, retrograde (inverted in II) within QRS, or immediately after QRS",
      prInterval: "Not measurable as P is absent or retrograde",
      qrsWidth: "Narrow (<0.12 s) unless aberrant conduction",
      stChanges: "May see ST depression due to rate-related ischemia",
    },
    mechanism:
      "The most common form of SVT is AVNRT (AV nodal re-entrant tachycardia) — a micro-re-entry circuit within or near the AV node using a slow and a fast pathway. An appropriately timed PAC initiates the circuit: conducts down the slow pathway and returns up the fast pathway, creating a circular loop. Each cycle activates both the ventricles (anterograde) and the atria (retrograde) — which is why P waves are absent or immediately follow the QRS (atria activated simultaneously or just after ventricles).",
    conductionPath:
      "Re-entry circuit within AV node (slow-fast or slow-slow pathway) → anterograde ventricular activation (normal His-Purkinje) + simultaneous or near-simultaneous retrograde atrial activation. The circuit perpetuates itself at 150–250 bpm until the re-entry is interrupted (vagal maneuver, adenosine, or spontaneous termination).",
    whyStripLooksThisWay:
      "Regular, narrow-complex tachycardia at 150–250 bpm. No visible P waves (or subtle retrograde P just after QRS in V1 — called pseudo-R'). Abrupt onset: one moment NSR, then suddenly 180 bpm. Abrupt termination: sudden return to NSR. This on/off pattern is pathognomonic of re-entry (vs. sinus tach which accelerates gradually).",
    clinicalImplications:
      "Most SVT episodes are not immediately life-threatening but cause significant symptoms: palpitations, dyspnea, near-syncope, chest discomfort. Rarely, sustained SVT at very fast rates can cause hemodynamic compromise, especially in patients with structural heart disease. The key management decision: stable (vagal + adenosine) vs. unstable (synchronized cardioversion).",
    nclexTraps: [
      "Adenosine is the drug of choice for SVT — 6 mg rapid IV push followed by 20 mL saline flush. If no response in 1–2 min: 12 mg × 2.",
      "Adenosine must be given FAST (within 1–2 seconds) into a large proximal vein — antecubital or higher. Slow administration doesn't reach the heart before being metabolized.",
      "Verapamil and adenosine are contraindicated in SVT with wide QRS that might be VT — they can cause hemodynamic collapse in VT.",
    ],
    hemodynamics:
      "Hemodynamic compromise depends on rate and underlying cardiac function. At 200 bpm in a healthy young person: tolerable palpitations. At 180 bpm in a patient with severe LV dysfunction or critical aortic stenosis: acute decompensation. Always assess BP and symptoms, not just rhythm.",
    nursingPriorities: [
      "Stable SVT: vagal maneuvers first (Valsalva, carotid massage by provider). Then adenosine per order.",
      "12-lead ECG during tachycardia AND immediately after termination — captures both the arrhythmia and the transition.",
      "Unstable SVT (hypotension, chest pain, LOC): synchronized cardioversion 50–100J biphasic.",
      "Monitor for recurrence post-termination — teach patients how to perform Valsalva maneuver.",
    ],
    recognitionPearls: [
      "Regular, narrow, rapid (150–250 bpm) with no visible P waves = SVT until proven otherwise.",
      "Abrupt on/off: distinguishes from sinus tachycardia (gradual).",
      "Look in V1 for pseudo-R' (retrograde P immediately after QRS) — AVNRT signature.",
    ],
    notThisBecause: [
      { rhythm: "Sinus tachycardia", distinguisher: "Sinus tach: identifiable upright P in II, gradual onset, clear trigger (fever, pain)." },
      { rhythm: "Atrial flutter 2:1", distinguisher: "Flutter: saw-tooth baseline at 300/min; adenosine reveals F waves but doesn't terminate." },
      { rhythm: "VT", distinguisher: "VT: wide QRS, AV dissociation, fusion beats, typically >100 ms QRS width, more hemodynamic compromise." },
    ],
  },
  {
    id: "av-block-first-degree",
    title: "First-Degree AV Block",
    level: 2,
    rhythmTag: "Heart block (1st degree)",
    parameters: {
      rate: "Depends on underlying rhythm (often NSR rate, 60–100)",
      regularity: "Regular",
      pWaves: "Present, upright in II, one before each QRS",
      prInterval: ">0.20 s (more than 5 small boxes)",
      qrsWidth: "Narrow unless concurrent BBB",
      stChanges: "Usually none",
    },
    mechanism:
      "First-degree AV block is a slowing of conduction through the AV node — not an actual block (every P wave still conducts to the ventricles). The AV node takes longer than normal to conduct the impulse, extending the PR interval beyond 0.20 s. Causes: high vagal tone (athletes), AV nodal blocking drugs (beta-blockers, calcium channel blockers, digoxin), inferior MI, myocarditis, or structural AV nodal disease.",
    conductionPath:
      "SA node → AV node (PROLONGED delay) → Bundle of His → bundle branches → ventricles. Every P still conducts; none are dropped. The prolonged PR simply means the AV node is taking longer to pass the signal — like a slow but working traffic light.",
    whyStripLooksThisWay:
      "The only abnormality is the PR interval >0.20 s. Everything else (rate, regularity, P morphology, QRS width) is normal. The P wave appears to sit farther from the QRS than expected.",
    clinicalImplications:
      "Isolated first-degree AV block in an asymptomatic patient without structural heart disease is generally benign. However, in the context of acute inferior MI, new first-degree AV block may precede more advanced block (Mobitz I or complete). In the setting of bifascicular block (RBBB + left anterior fascicular block), prolonged PR may indicate trifascicular disease and risk of complete heart block.",
    nclexTraps: [
      "First-degree AV block does NOT require treatment by itself — treating the rate or adding atropine for asymptomatic first-degree block is inappropriate.",
      "Every P conducts — do not confuse with Mobitz I where some P waves are dropped.",
      "Review medications: digoxin, beta-blockers, and non-DHP CCBs (verapamil, diltiazem) all prolong PR.",
    ],
    hemodynamics:
      "Generally no hemodynamic consequence from first-degree AV block alone. Very prolonged PR (>0.30–0.35 s) may impair optimal timing of atrial contraction relative to ventricular systole, but this is rarely clinically significant.",
    nursingPriorities: [
      "Document PR interval measurement on all rhythm strips.",
      "Monitor for progression to more advanced AV block — especially in setting of acute MI.",
      "Hold medications that prolong PR and notify provider if new first-degree block appears.",
    ],
    recognitionPearls: [
      "Long PR (>5 small boxes) + everything else normal = 1st degree AV block.",
      "Count: P wave is far from QRS but still precedes it and every P conducts.",
      "The 'PR is long but consistent' — same prolonged PR every beat. This distinguishes from Wenckebach.",
    ],
    notThisBecause: [
      { rhythm: "Wenckebach (Mobitz I)", distinguisher: "Wenckebach: PR progressively lengthens until one QRS is dropped. First degree: PR is long but identical beat-to-beat." },
      { rhythm: "3rd-degree AV block", distinguisher: "Third-degree: P and QRS are completely dissociated. First-degree: every P still conducts to QRS." },
    ],
  },
  {
    id: "av-block-second-mobitz1",
    title: "Second-Degree AV Block — Mobitz I (Wenckebach)",
    level: 2,
    rhythmTag: "Heart block (2nd degree)",
    parameters: {
      rate: "Atrial: usually 60–100; Ventricular: slightly less (due to dropped beats)",
      regularity: "Irregularly regular (group beating: R-R gradually shortens, then long pause)",
      pWaves: "Present, more P waves than QRS complexes",
      prInterval: "Progressive lengthening until one P is not conducted (dropped QRS), then cycle resets",
      qrsWidth: "Usually narrow (<0.12 s)",
      stChanges: "Usually none",
    },
    mechanism:
      "Wenckebach is a progressive fatiguing of AV nodal conduction. Each successive P wave finds the AV node in a slightly more refractory state, requiring longer to conduct. Eventually one P wave arrives when the AV node is completely refractory and fails to conduct at all (dropped QRS). After the pause, the AV node recovers and the cycle begins again. This is the Wenckebach phenomenon — a normal protective response of the AV node to stress.",
    conductionPath:
      "SA node → AV node (progressively slower conduction each beat until one P fails to conduct) → reset. The AV node, not the bundle branches or His-Purkinje system, is the site of block. Because conduction below the AV node is normal, the QRS is narrow.",
    whyStripLooksThisWay:
      "The classic pattern: PR intervals get longer and longer across the strip in a repeating group. The last beat in each group is a lone P wave with no QRS following it (the dropped beat). After the dropped beat, the next PR interval is the shortest in the cycle. The R-R intervals actually shorten (not lengthen) as the cycle progresses — because while PR lengthens, the increment in PR lengthening decreases each beat.",
    clinicalImplications:
      "Wenckebach is often benign, especially in athletes, inferior MI (RCA territory includes AV node), or with AV nodal blocking drugs. It does not typically progress to complete heart block unless the underlying cause is severe. The treatment is generally observation and monitoring, not pacing.",
    nclexTraps: [
      "Wenckebach does NOT require atropine or pacing unless symptomatic (rare).",
      "In inferior MI: Wenckebach often resolves as reperfusion occurs — support and monitor.",
      "Do not confuse Wenckebach with Mobitz II: Wenckebach = narrow QRS + progressive PR lengthening. Mobitz II = constant PR + sudden dropped beat + often wide QRS.",
    ],
    hemodynamics:
      "Usually mild hemodynamic effect — the dropped beats reduce overall ventricular rate somewhat but rarely cause symptomatic bradycardia unless the block ratio is high (many dropped beats).",
    nursingPriorities: [
      "Monitor for progression to Mobitz II or complete heart block — especially in anterior MI.",
      "Document the PR lengthening and the pattern of dropped beats.",
      "Avoid medications that further slow AV conduction in symptomatic patients.",
    ],
    recognitionPearls: [
      "Group beating on the strip = Wenckebach until proven otherwise.",
      "PR gets longer, then a beat is dropped, then the shortest PR in the cycle, repeat.",
      "Narrow QRS = block is in the AV node (usually benign). Wide QRS = block is below (Mobitz II — dangerous).",
    ],
    notThisBecause: [
      { rhythm: "Mobitz II", distinguisher: "Mobitz II: PR interval is constant; QRS drops without warning; often wide QRS — more dangerous." },
      { rhythm: "3rd-degree AV block", distinguisher: "3rd degree: complete dissociation — P and QRS march independently. Wenckebach: P waves and QRS complexes are related (most P waves conduct)." },
    ],
  },
  {
    id: "av-block-third-degree",
    title: "Third-Degree (Complete) AV Block",
    level: 2,
    rhythmTag: "Heart block (3rd degree)",
    parameters: {
      rate: "Atrial: usually 60–100 (SA node normal); Ventricular: 20–60 bpm depending on escape pacemaker location",
      regularity: "Both atrial and ventricular rhythms are regular — but INDEPENDENT of each other",
      pWaves: "Present, regular, but bear no relationship to QRS complexes",
      prInterval: "Not measurable — no consistent P-to-QRS relationship",
      qrsWidth: "Narrow if junctional escape (40–60 bpm); Wide if ventricular escape (20–40 bpm)",
      stChanges: "Depends on underlying etiology",
    },
    mechanism:
      "In third-degree AV block, no atrial impulses conduct to the ventricles. The AV node, Bundle of His, or both bundle branches are completely blocked. The atria continue to be driven by the SA node at its normal rate. The ventricles are driven by a subsidiary escape pacemaker: junctional (40–60 bpm, narrow QRS) or ventricular (20–40 bpm, wide bizarre QRS). The two rhythms march independently — AV dissociation.",
    conductionPath:
      "SA node → atria (normal P waves, regular atrial rate) → AV node: COMPLETE BLOCK (no impulses pass through). Simultaneously: junctional or ventricular escape pacemaker fires independently at its intrinsic rate → His-Purkinje or myocardial conduction → QRS. The two pacemakers are completely independent — hence AV dissociation.",
    whyStripLooksThisWay:
      "P waves march at one rate (regular, usually 60–100/min). QRS complexes march at a completely different, slower rate (regular but independent). P waves appear to 'walk across' the QRS at various points — sometimes before, sometimes in, sometimes after — because the two rhythms are unrelated. This is the diagnostic hallmark of 3rd-degree block.",
    clinicalImplications:
      "Third-degree AV block is a medical emergency if symptomatic (syncope, hypotension, chest pain). Ventricular escape rates of 20–40 bpm are often insufficient to maintain perfusion. Causes: inferior MI (usually transient, resolves with reperfusion), anterior MI (more permanent), Lyme disease, digoxin toxicity, hyperkalemia, congenital, or degenerative conduction system disease.",
    nclexTraps: [
      "There ARE P waves in 3rd-degree block — students often say 'no P waves.' There are P waves; they just don't conduct.",
      "The ventricular rate in 3rd-degree block is the escape rate — if you treat it with atropine, atropine acts on the AV node (which is blocked) and may NOT increase ventricular rate. Atropine may increase atrial rate without affecting the blocked ventricles.",
      "Priority: transcutaneous pacing while preparing for transvenous pacing.",
    ],
    hemodynamics:
      "Ventricular escape at 30 bpm with no atrial kick: severely compromised cardiac output. Symptoms: syncope, severe hypotension, angina, altered mental status. Can deteriorate to asystole if escape pacemaker fails.",
    nursingPriorities: [
      "Immediate: transcutaneous pacing if symptomatic (apply pads, set rate 60–80 bpm, start at minimum milliamps, titrate for capture).",
      "Prepare for emergent transvenous pacing — notify provider immediately.",
      "Treat reversible causes: hyperkalemia, digoxin toxicity, inferior MI reperfusion.",
      "Do NOT rely on atropine alone — often ineffective in complete heart block.",
      "Continuous monitoring: watch for asystole or ventricular escape failure.",
    ],
    recognitionPearls: [
      "P waves march at one rate. QRS complexes march at a slower, independent rate. No consistent relationship.",
      "Key: if you can find a P wave hiding IN the QRS or T wave — that's 3rd-degree block, not 2nd-degree.",
      "Junctional escape = narrow QRS at 40–60 bpm. Ventricular escape = wide bizarre QRS at 20–40 bpm.",
    ],
    notThisBecause: [
      { rhythm: "Wenckebach (Mobitz I)", distinguisher: "Wenckebach: most P waves DO conduct; PR progressively lengthens. 3rd degree: NO P waves conduct; complete dissociation." },
      { rhythm: "Junctional rhythm", distinguisher: "Junctional rhythm: P waves absent or retrograde; no independent atrial pacemaker marching at a different rate." },
    ],
  },
  {
    id: "pvcs-pacs",
    title: "PVCs & PACs",
    level: 2,
    rhythmTag: "PVC",
    parameters: {
      rate: "Underlying rate varies; ectopic beats are premature",
      regularity: "Underlying rhythm interrupted by premature beats",
      pWaves: "PAC: premature P with different morphology. PVC: no P before the wide beat",
      prInterval: "PAC: PR may differ from sinus beats. PVC: no PR",
      qrsWidth: "PAC: narrow. PVC: wide (≥0.12 s), bizarre morphology",
      stChanges: "PVC: ST opposite to main QRS deflection (discordant)",
    },
    mechanism:
      "PAC (Premature Atrial Contraction): an ectopic atrial focus fires before the SA node, producing a premature P wave with abnormal morphology (since depolarization spreads differently than from the SA node). The impulse usually conducts normally to the ventricles (narrow QRS). PVC (Premature Ventricular Contraction): an ectopic ventricular focus fires prematurely, spreading cell-to-cell through myocardium (not His-Purkinje) — producing a wide, bizarre QRS with no preceding P wave and a compensatory pause.",
    conductionPath:
      "PAC: ectopic atrial focus → AV node → His-Purkinje → ventricles (normal path, narrow QRS). The ectopic focus also depolarizes the SA node retrograde, 'resetting' it — so the next SA-driven P wave comes on time from the reset point (non-compensatory pause). PVC: ectopic ventricular focus → cell-to-cell myocardial conduction (slow, wide QRS) → retrograde penetration of AV node (concealed conduction) → next SA impulse is blocked by the refractory AV node → compensatory pause (SA node was not reset).",
    whyStripLooksThisWay:
      "PAC: premature beat with a different P wave before a normal-width QRS. Often followed by a non-compensatory pause (distance from the preceding R to the R after the PAC is less than two normal R-R intervals). PVC: premature wide QRS with no preceding P. The T wave is in the opposite direction from the main QRS deflection (discordant T wave — this is normal for PVCs). Followed by a full compensatory pause (the R-to-R encompassing the PVC equals exactly 2 normal R-R intervals).",
    clinicalImplications:
      "Isolated PVCs in structurally normal hearts: generally benign. Frequent PVCs (>10,000/day), PVC in bigeminy (every other beat), multifocal PVCs, or R-on-T PVC (PVC fires during vulnerable T wave repolarization period) in the context of active MI or ischemia: higher risk for VT/VF. PACs: common in atrial disease, caffeine, stress — can trigger AF or SVT.",
    nclexTraps: [
      "Uniform (monomorphic) PVCs from the same focus look identical. Multifocal PVCs have varying morphologies and suggest significant myocardial irritability.",
      "PVC bigeminy (NSR + PVC alternating) results in an apparent 'slow' heart rate if the peripheral pulse is palpated — the PVC may not generate enough cardiac output to create a palpable pulse wave.",
      "R-on-T PVC: a PVC that occurs during the peak of the T wave — can initiate VT or VF. High priority in acute MI.",
    ],
    hemodynamics:
      "Isolated PVCs rarely cause hemodynamic compromise. In patients with severe LV dysfunction, frequent PVCs reduce forward output. PVC bigeminy can effectively halve cardiac output if every PVC fails to produce a palpable pulse.",
    nursingPriorities: [
      "Document: frequency, pattern (isolated, bigeminy, trigeminy, couplets), uniformity (monomorphic vs multifocal).",
      "12-lead ECG for new PVCs in an acute patient — rule out ischemia.",
      "Monitor electrolytes: hypokalemia and hypomagnesemia are major triggers for PVCs.",
      "Check medications: antiarrhythmic drugs, digoxin toxicity, and sympathomimetics all cause PVCs.",
    ],
    recognitionPearls: [
      "PVC: wide, bizarre, no P before it, T wave opposite to QRS, followed by compensatory pause.",
      "PAC: premature narrow QRS with a different-looking P before it.",
      "Bigeminy = every other beat is a PVC. Trigeminy = every third beat. Couplet = two PVCs in a row.",
    ],
    notThisBecause: [
      { rhythm: "VT", distinguisher: "VT: three or more consecutive wide QRS beats in a row at >100 bpm. PVCs: isolated or in pairs." },
      { rhythm: "PAC with aberrant conduction", distinguisher: "PAC aberrant: has a P wave before the wide QRS. PVC: no P wave before wide QRS." },
    ],
  },
  {
    id: "ventricular-tachycardia",
    title: "Ventricular Tachycardia (VT)",
    level: 2,
    rhythmTag: "Ventricular tachycardia",
    relatedConceptUnitIds: ["qrs-width", "rhythm-regularity", "rate-calculation"],
    parameters: {
      rate: "100–250 bpm",
      regularity: "Regular (monomorphic VT); slightly irregular (polymorphic VT)",
      pWaves: "Present but dissociated from QRS (AV dissociation). Often hidden in wide QRS.",
      prInterval: "Not applicable — AV dissociation",
      qrsWidth: "Wide (≥0.12 s), often ≥0.14 s, bizarre morphology",
      stChanges: "Discordant ST/T changes (opposite to main QRS deflection)",
    },
    mechanism:
      "VT arises from an ectopic ventricular focus (automatic) or, more commonly, re-entry within scarred ventricular myocardium (post-MI scar is the most common substrate). Three or more consecutive PVCs at >100 bpm = VT. Monomorphic VT: consistent QRS morphology (same re-entry circuit, stable). Polymorphic VT: varying QRS morphology (unstable circuit, multiple re-entry wavefronts — can degenerate to VF).",
    conductionPath:
      "Ectopic ventricular pacemaker or re-entry circuit within ventricular myocardium → cell-to-cell spread through myocardium (not His-Purkinje) → wide, bizarre QRS. The atria continue under SA node control — P waves march at their own rate, completely independent of the rapid ventricular rate. This AV dissociation is the diagnostic hallmark distinguishing VT from SVT with aberrant conduction.",
    whyStripLooksThisWay:
      "Wide, regular, rapid QRS complexes. AV dissociation: P waves (often hard to see) march at a slower independent rate. Two pathognomonic signs: (1) Fusion beats — a P wave fires at the right moment to partially depolarize the ventricle via the normal conduction system while the ectopic VT circuit also fires — creating a QRS that is partly normal, partly wide. (2) Capture beats — a sinus P wave conducts completely through a momentarily non-refractory AV node, producing one narrow QRS in the middle of the wide-complex tachycardia.",
    clinicalImplications:
      "VT is immediately life-threatening. Even hemodynamically stable VT can degenerate to VF without warning. The clinical priority: Is the patient conscious and maintaining blood pressure? If unstable (no pulse or hypotensive): defibrillation (unsynchronized). If stable pulse present: synchronized cardioversion or pharmacological cardioversion (amiodarone, procainamide) after establishing IV access.",
    nclexTraps: [
      "Wide-complex tachycardia in any adult with a history of MI or structural heart disease = VT until proven otherwise. Assuming SVT with aberrancy and giving verapamil can kill a VT patient.",
      "If uncertain — treat as VT. Adenosine is relatively safe to give diagnostically in a hemodynamically stable wide-complex tachycardia (it will terminate SVT but not VT, and it's safe if given correctly).",
      "Sustained VT (>30 seconds) even if 'stable' requires urgent intervention — do not watch and wait.",
    ],
    hemodynamics:
      "VT causes loss of coordinated ventricular contraction, reducing stroke volume 30–50% or more. With impaired LV function, VT may produce immediate hemodynamic collapse. Degeneration to VF causes cardiac arrest.",
    nursingPriorities: [
      "IMMEDIATELY: assess the patient — pulse present? Conscious? BP?",
      "Pulseless VT: CPR + defibrillation (same as VF). Call code.",
      "Stable VT with pulse: IV access × 2, 12-lead ECG, O₂, notify provider urgently. Prepare for cardioversion.",
      "Amiodarone 150 mg IV over 10 min per ACLS (stable monomorphic VT with pulse).",
      "Continuous monitoring — watch for degeneration to VF.",
    ],
    recognitionPearls: [
      "Wide-complex (QRS >0.12 s), fast (>100 bpm), regular, AV dissociation = VT.",
      "Fusion and capture beats are pathognomonic of VT.",
      "If the axis is extremely abnormal (northwest axis: negative in I and aVF) = likely VT.",
    ],
    notThisBecause: [
      { rhythm: "SVT with aberrant conduction", distinguisher: "SVT aberrant: narrow after adenosine or vagal; retrograde P waves; no AV dissociation; history of SVT. VT: AV dissociation, fusion/capture beats, structural heart disease." },
      { rhythm: "AF with WPW", distinguisher: "AF+WPW: irregularly irregular wide QRS; extremely rapid (>250 bpm); very dangerous — do not give AV nodal blockers." },
    ],
  },
  {
    id: "ventricular-fibrillation",
    title: "Ventricular Fibrillation (VF)",
    level: 2,
    rhythmTag: "Ventricular fibrillation",
    parameters: {
      rate: "Indeterminate — chaotic, no organized QRS",
      regularity: "Completely chaotic, irregular",
      pWaves: "Absent — no organized atrial or ventricular activity",
      prInterval: "Not measurable",
      qrsWidth: "No discrete QRS complexes — only chaotic waveforms",
      stChanges: "Not applicable",
    },
    mechanism:
      "VF is the most chaotic cardiac rhythm: the ventricular myocardium is depolarizing in multiple random wavelets simultaneously, with no coordinated contraction. The ventricles quiver instead of pump. Cardiac output is zero. Causes: degeneration from VT, acute myocardial ischemia/infarction, severe electrolyte abnormalities (hypokalemia, hypomagnesemia), hypothermia, electric shock, or as a primary arrhythmia in cardiomyopathy.",
    conductionPath:
      "Multiple chaotic re-entry wavelets throughout ventricular myocardium — no organized conduction pathway exists. No systematic depolarization → no coordinated contraction → no cardiac output.",
    whyStripLooksThisWay:
      "Completely chaotic, irregular waveforms of varying amplitude and morphology. No recognizable P waves, QRS complexes, or T waves. The waveform appears as random undulation. Coarse VF (large amplitude): more likely to respond to defibrillation. Fine VF (small amplitude): may resemble asystole — confirm in two leads before withholding defibrillation.",
    clinicalImplications:
      "VF = cardiac arrest. Survival depends entirely on the speed and quality of response: early CPR + early defibrillation (within 3–5 minutes → ~50% survival; each additional minute without defibrillation decreases survival by 7–10%). Epinephrine 1 mg every 3–5 minutes. Amiodarone 300 mg IV if VF/pulseless VT persists after ≥2 shocks.",
    nclexTraps: [
      "VF is treated with unsynchronized defibrillation (not synchronized cardioversion — there is no QRS to synchronize to).",
      "Fine VF may look like asystole. Check two leads before diagnosing asystole — fine VF still responds to defibrillation; asystole does not.",
      "CPR should be performed while the defibrillator charges — minimize hands-off time.",
    ],
    hemodynamics:
      "Zero cardiac output. Loss of consciousness within seconds. Death in minutes without intervention.",
    nursingPriorities: [
      "Call code → CPR immediately → charge defibrillator.",
      "Defibrillate 200J biphasic (or per manufacturer recommendation) → resume CPR immediately for 2 minutes.",
      "IV/IO access, epinephrine 1 mg every 3–5 minutes.",
      "Amiodarone 300 mg IV after ≥2 shocks if VF persists.",
      "Identify and treat reversible causes: 5 H's and 5 T's (hypoxia, hypovolemia, hypo/hyperkalemia, hypothermia, H⁺ acidosis; tension pneumo, tamponade, toxins, thrombosis, thromboembolism).",
    ],
    recognitionPearls: [
      "Chaotic waveform, no QRS, no P, no T = VF.",
      "Coarse VF: high-amplitude, irregular. Fine VF: low-amplitude — confirm it's not a flat artifact before diagnosing asystole.",
      "If unsure VF vs. asystole: check lead II and V1. Shock if any organized waveform visible.",
    ],
    notThisBecause: [
      { rhythm: "Asystole", distinguisher: "Asystole: flat line (no waveform activity). VF: chaotic waveforms present. Do NOT shock asystole — defibrillation cannot restart a heart with no electrical activity." },
      { rhythm: "Artifact", distinguisher: "Artifact: patient is awake, has pulse, waveform corresponds to external motion. VF: patient unresponsive, no pulse." },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL 3 — Advanced ECG & Critical Care
// ─────────────────────────────────────────────────────────────────────────────

const LEVEL_3_UNITS: EcgCurriculumUnit[] = [
  {
    id: "stemi-localization",
    title: "STEMI Localization",
    level: 3,
    rhythmTag: "STEMI changes",
    parameters: {
      rate: "Variable",
      regularity: "Variable",
      pWaves: "Present (unless concurrent arrhythmia)",
      prInterval: "Normal or prolonged if inferior STEMI with AV block",
      qrsWidth: "May develop new Q waves (pathological infarction)",
      stChanges: "ST ELEVATION in contiguous leads (≥1 mm limb leads, ≥2 mm precordial leads)",
    },
    mechanism:
      "STEMI (ST-Elevation Myocardial Infarction) represents complete occlusion of a coronary artery causing transmural ischemia — full-thickness myocardial injury. The ST elevation reflects injury current from the ischemic zone. Pathological Q waves develop later as infarcted myocardium becomes electrically silent (dead tissue cannot depolarize, so the electrode overlying it sees only the opposite wall's depolarization moving away — creating a negative Q wave). Reciprocal ST depression in opposite leads reflects the mirror image of the injury current.",
    conductionPath:
      "Coronary artery occlusion → ischemia → injury → infarction progression (minutes to hours). LAD occlusion: anterior and septal ischemia. RCA occlusion: inferior and right ventricular ischemia, often with AV block (RCA supplies SA node 60% and AV node 80%). LCx occlusion: lateral and posterior ischemia (posterior STEMI is often missed on standard 12-lead).",
    whyStripLooksThisWay:
      "ST elevation in contiguous lead groups localizes the culprit artery: V1–V4 (anterior/LAD), II/III/aVF (inferior/RCA or LCx), I/aVL (lateral/LCx or diagonal), V1–V2 (posterior/RCA or LCx — note: ST DEPRESSION in V1–V2 with upright T = posterior STEMI, needs posterior leads V7–V9). Reciprocal changes appear in leads opposite the infarct zone: inferior STEMI shows ST depression in aVL; anterior STEMI shows reciprocal ST depression in inferior leads.",
    clinicalImplications:
      "STEMI = time-critical emergency. Every minute of occlusion = additional myocardium lost. Goal: PCI within 90 minutes of first medical contact (FMC-to-balloon time). New LBBB with symptoms = treat as STEMI equivalent. Posterior STEMI is frequently missed — always check V7–V9 in patients with inferior or lateral ST changes and tall R waves in V1–V2.",
    nclexTraps: [
      "Inferior STEMI (II/III/aVF) + ST elevation = check right-sided leads (V4R) for RV involvement. RV STEMI: avoid nitrates and aggressive diuresis (preload-dependent RV).",
      "New LBBB + symptoms = STEMI equivalent. Activate cath lab.",
      "aVR ST elevation + diffuse ST depression in other leads = left main or proximal LAD occlusion — extremely high-risk.",
      "ST elevation in aVR alone with ST depression everywhere else = NOT standard STEMI pattern — consider left main disease or severe proximal LAD.",
    ],
    hemodynamics:
      "Depends on infarct territory: large anterior STEMI (LAD) → severe LV dysfunction, cardiogenic shock possible. Inferior STEMI → often more benign unless RV involvement. Posterior STEMI → may present with only ST depression in V1–V3 (frequently missed).",
    nursingPriorities: [
      "IMMEDIATE: 12-lead ECG within 10 minutes of symptom onset. Activate STEMI protocol.",
      "Oxygen if O₂ sat <90%. Aspirin 325 mg chew. Nitroglycerin (hold if SBP <90, RV infarct, or PDE5 inhibitor use).",
      "IV access × 2. Draw cardiac biomarkers, CBC, BMP, coagulation studies.",
      "Continuous cardiac monitoring. Morphine (use with caution — may increase mortality in STEMI).",
      "Notify cath lab and cardiology immediately. Do not delay for labs to return.",
    ],
    recognitionPearls: [
      "STEMI localization map: V1–V2=septal, V3–V4=anterior, V5–V6=lateral, I/aVL=high lateral, II/III/aVF=inferior.",
      "Hyperacute T waves (tall, peaked, symmetric) precede ST elevation — earliest STEMI sign.",
      "Reciprocal changes support STEMI diagnosis: inferior STEMI → ST depression in I, aVL; anterior STEMI → ST depression in II, III, aVF.",
    ],
    notThisBecause: [
      { rhythm: "Benign early repolarization", distinguisher: "BER: concave-up ('smiley face') ST elevation at J-point, often V2–V4, J-point notch, seen in young healthy adults, no symptoms." },
      { rhythm: "Pericarditis", distinguisher: "Pericarditis: diffuse (not localized) concave ST elevation in multiple territories + PR depression. No reciprocal changes. Pleuritic chest pain." },
      { rhythm: "LV aneurysm", distinguisher: "LV aneurysm: persistent ST elevation + pathological Q waves in the same leads; history of prior MI; no acute symptoms." },
    ],
  },
  {
    id: "hyperkalemia-ecg",
    title: "Hyperkalemia — ECG Changes",
    level: 3,
    rhythmTag: "Hyperkalemia ECG changes",
    parameters: {
      rate: "Variable; can develop bradycardia or ventricular arrhythmias as K⁺ rises",
      regularity: "Variable",
      pWaves: "Initially present; disappear as K⁺ rises (sinoventricular rhythm)",
      prInterval: "Prolonged as K⁺ rises",
      qrsWidth: "Progressively wider as K⁺ rises — can reach 0.20+ s",
      stChanges: "Initially: tall peaked T waves. Later: sine wave pattern.",
    },
    mechanism:
      "Hyperkalemia depolarizes the resting membrane potential (less negative), which slows conduction throughout the heart. The effects are dose-dependent and progress in a predictable sequence as serum potassium rises: peaked T waves (K⁺ 5.5–6.5 mEq/L) → PR prolongation + P wave flattening (6.5–7.5) → P wave disappearance + QRS widening (7.5–8.0) → 'sine wave' pattern (QRS merges with T wave) (8.0+) → VF or asystole.",
    conductionPath:
      "Elevated extracellular K⁺ reduces the electrochemical gradient across cardiac cell membranes, partially depolarizing them. This inactivates sodium channels (which require a sufficiently negative resting potential to reset), slowing conduction velocity through all cardiac tissues — atria, AV node, His-Purkinje, and ventricles. The result is sequential slowing, broadening, and eventual loss of all waveforms.",
    whyStripLooksThisWay:
      "Peaked, symmetrical, narrow-base T waves (tent-shaped) are the first sign — they appear in precordial leads first. As K⁺ climbs: PR prolongs, P waves flatten then disappear (atrial standstill). QRS widens progressively. Eventually QRS and T merge into a sinusoidal pattern. This 'sine wave' represents a terminally dangerous state — VF or asystole is imminent without treatment.",
    clinicalImplications:
      "ECG changes in hyperkalemia can precede life-threatening arrhythmias by minutes. The ECG is more important than the serum K⁺ level for guiding urgency: a patient with K⁺ 7.2 and a sine wave pattern needs IMMEDIATE calcium gluconate regardless of the exact lab value. Renal failure, rhabdomyolysis, metabolic acidosis, and crush injuries are common triggers.",
    nclexTraps: [
      "Peaked T waves in hyperkalemia are narrow-base and symmetric (tent-shaped) — different from the broad-base tall T waves of early MI (which are asymmetric).",
      "Treatment sequence for emergent hyperkalemia: (1) Calcium gluconate IV (membrane stabilization — acts within 1–3 min). (2) Sodium bicarbonate + insulin/glucose (shift K⁺ intracellularly — acts in 15–30 min). (3) Kayexalate or patiromer (eliminate K⁺ — acts in hours). (4) Dialysis for refractory cases.",
      "Calcium gluconate does NOT lower serum K⁺ — it stabilizes the myocardial membrane. Failure to understand this leads to premature reassurance.",
    ],
    hemodynamics:
      "As conduction slows and QRS widens, ventricular function deteriorates. Severe hyperkalemia with sine wave pattern: imminent cardiac arrest. Bradycardia from atrial standstill further reduces cardiac output.",
    nursingPriorities: [
      "Obtain 12-lead ECG immediately for any K⁺ >5.5 mEq/L.",
      "Calcium gluconate 1–2 g IV over 2–5 min (emergent) for any ECG changes or K⁺ >6.5.",
      "Telemetry monitoring continuously.",
      "Assess for peaked T waves, widening QRS, sine wave pattern — escalate with any new changes.",
      "Prepare for dialysis access in refractory cases.",
    ],
    recognitionPearls: [
      "Peaked T waves + wide QRS in renal failure = hyperkalemia until proven otherwise.",
      "Sequence: peaked T → PR long → P gone → QRS wide → sine wave → VF/asystole.",
      "Sine wave pattern = emergency. Calcium gluconate now, simultaneously call provider.",
    ],
    notThisBecause: [
      { rhythm: "Acute MI T waves", distinguisher: "Hyperacute MI T waves: asymmetric, broad-based, associated with ST elevation in a vascular territory. Hyperkalemia T waves: symmetric, tent-shaped, diffuse across multiple leads." },
      { rhythm: "BBB", distinguisher: "BBB: wide QRS with specific morphology (RSR' in RBBB, broad R in LBBB). Hyperkalemia QRS widening: no specific bundle branch pattern — diffuse slowing." },
    ],
  },
  {
    id: "torsades-de-pointes",
    title: "Torsades de Pointes",
    level: 3,
    parameters: {
      rate: "200–250 bpm",
      regularity: "Slightly irregular",
      pWaves: "Not identifiable during torsades",
      prInterval: "Not applicable",
      qrsWidth: "Wide — QRS complexes rotate around the isoelectric baseline",
      stChanges: "Preceding QTc prolongation (>500 ms) is the key marker",
    },
    mechanism:
      "Torsades de Pointes ('twisting of the points') is a specific form of polymorphic VT that occurs in the setting of prolonged ventricular repolarization (long QTc interval). During prolonged repolarization, early afterdepolarizations (EADs) can trigger ectopic beats. A PVC falling on the long T wave (R-on-T in the vulnerable period) initiates torsades. The waveform appears to 'twist' around the isoelectric line — QRS amplitude waxes and wanes because the electrical axis rotates cyclically.",
    conductionPath:
      "Prolonged QTc (>500 ms) creates temporal dispersion of repolarization — different areas of the ventricle repolarize at different times, creating windows of vulnerability. An EAD or PVC triggers re-entry in this heterogeneous substrate, initiating the rotating, polymorphic VT pattern.",
    whyStripLooksThisWay:
      "Classic appearance: a burst of wide, rapid QRS complexes that change amplitude and polarity, appearing to spiral around the baseline ('corkscrew' or 'spindle' pattern). It often initiates with a short-long-short sequence: PAC → pause → PVC → torsades. The initiating factor: a prolonged QTc on the preceding NSR beats.",
    clinicalImplications:
      "Torsades can self-terminate or degenerate to VF. It is NOT treated with standard antiarrhythmic drugs (amiodarone, procainamide, lidocaine all prolong QT and worsen torsades). Treatment is magnesium sulfate + removal of the offending agent. Key triggers: drugs (antiarrhythmics, antipsychotics, antibiotics — azithromycin, fluoroquinolones), hypokalemia, hypomagnesemia, hypokalemia, congenital long QT syndrome.",
    nclexTraps: [
      "Torsades is polymorphic VT with a long QTc. Standard VT algorithms (amiodarone, lidocaine) can WORSEN torsades — know the difference.",
      "Treatment: magnesium sulfate 2 g IV over 5–15 min. Isoproterenol or temporary pacing to increase heart rate (overdrive pacing suppresses EADs by shortening QTc).",
      "Common drug culprits: azithromycin, haloperidol, methadone, antiarrhythmics (sotalol, quinidine, amiodarone), ondansetron — know your QT-prolonging medications.",
    ],
    hemodynamics:
      "Each episode of torsades causes hemodynamic compromise (palpitations to syncope). Sustained torsades or degeneration to VF = cardiac arrest.",
    nursingPriorities: [
      "Identify and discontinue all QT-prolonging medications immediately.",
      "Correct electrolytes: potassium to >4.0 mEq/L, magnesium to >2.0 mEq/L.",
      "Magnesium sulfate 2 g IV over 5–15 min for active torsades.",
      "Continuous monitoring — document QTc on every rhythm strip.",
      "Defibrillate if torsades causes loss of pulse/consciousness.",
    ],
    recognitionPearls: [
      "Twisting QRS morphology around baseline + preceding long QTc = torsades.",
      "Short-long-short initiating pattern: look at the beats just before torsades starts.",
      "Distinguish from PMVT (polymorphic VT without QTc prolongation) — same visual but different treatment.",
    ],
    notThisBecause: [
      { rhythm: "Monomorphic VT", distinguisher: "Monomorphic VT: consistent QRS morphology; no QTc prolongation required; treated with amiodarone (safe)." },
      { rhythm: "VF", distinguisher: "VF: completely chaotic, no discernible pattern. Torsades: organized rotating QRS pattern, often self-terminating." },
    ],
  },
  {
    id: "paced-rhythms",
    title: "Paced Rhythms & Malfunction",
    level: 3,
    rhythmTag: "Paced rhythm",
    parameters: {
      rate: "Set by pacemaker rate (usually 60–80 bpm programmed rate)",
      regularity: "Regular if paced at fixed rate; may vary in demand mode",
      pWaves: "May be paced (atrial spike + P wave) or intrinsic P waves",
      prInterval: "Pacemaker-programmed AV delay (usually 120–200 ms)",
      qrsWidth: "Wide (≥0.12 s) for ventricular pacing — looks like LBBB morphology (RV pacing) or RBBB morphology (LV pacing)",
      stChanges: "Discordant ST/T changes normal with ventricular pacing (do not interpret as ischemia)",
    },
    mechanism:
      "Permanent pacemakers deliver electrical stimuli to the heart to ensure minimum rate. Modes: VVI (ventricular pacing, ventricular sensing, inhibited by intrinsic beats), AAI (atrial pacing/sensing), DDD (dual-chamber: atrial and ventricular pacing and sensing). The pacemaker 'senses' intrinsic beats — if the heart rate exceeds the programmed rate, the pacemaker inhibits itself (demand mode). If the intrinsic rate falls below the programmed rate, the pacemaker fires.",
    conductionPath:
      "Pacing lead delivers electrical stimulus directly to the endocardial surface → depolarization spreads cell-to-cell through myocardium (not His-Purkinje) → wide QRS (similar to PVC morphology). RV apex pacing: left bundle branch block morphology (stimulus from right side, left ventricle activates last). Biventricular pacing (CRT): narrower QRS as both ventricles stimulated simultaneously.",
    whyStripLooksThisWay:
      "Pacer spike: vertical narrow spike immediately preceding the paced P wave (atrial pacing) or QRS (ventricular pacing). Modern pacemakers produce very small spikes sometimes not visible on standard ECG — must look carefully in multiple leads. Wide, LBBB-morphology QRS after ventricular spike. Discordant ST-T changes (T wave opposite to QRS main deflection) are expected and normal — do NOT interpret as ischemia.",
    clinicalImplications:
      "Pacemaker malfunction types: (1) Failure to pace: no spike when expected — pacemaker battery depleted or lead fracture. (2) Failure to capture: spike present but no P wave or QRS follows — lead displacement, perforation, exit block. (3) Failure to sense: pacemaker fires when it shouldn't (too sensitive or undersensing) — competitive pacing, can trigger VT if spike falls on T wave. Magnet application converts demand pacemaker to fixed-rate mode — useful diagnostically.",
    nclexTraps: [
      "Discordant ST-T changes (ST depression + T wave inversion in paced leads) are NORMAL in pacing — do NOT diagnose ischemia based on these changes alone.",
      "However, concordant ST changes (ST elevation in the same direction as the main QRS deflection) in a paced rhythm = STEMI equivalent (Sgarbossa criteria).",
      "Failure to capture (spike with no QRS): check lead connections, reposition patient, consider chest X-ray for lead position.",
    ],
    hemodynamics:
      "VVI pacing (ventricular only): loss of atrial kick reduces cardiac output — 'pacemaker syndrome' in susceptible patients. DDD pacing preserves AV synchrony. Biventricular pacing improves cardiac output in heart failure with wide QRS.",
    nursingPriorities: [
      "Document: paced vs. intrinsic beats. Count paced QRS complexes and intrinsic QRS.",
      "Assess for: failure to pace (no spike when expected), failure to capture (spike without QRS), failure to sense (inappropriate pacing).",
      "Chest X-ray to verify lead position if malfunction suspected.",
      "Magnet: converts to asynchronous fixed-rate pacing — use only per physician order.",
    ],
    recognitionPearls: [
      "Pacer spike before P wave = atrial pacing. Spike before wide QRS = ventricular pacing.",
      "Wide QRS + LBBB pattern in any patient with known pacemaker = paced rhythm (don't diagnose new LBBB).",
      "Spike without QRS = failure to capture. No spike when expected = failure to pace.",
    ],
    notThisBecause: [
      { rhythm: "LBBB", distinguisher: "LBBB: no pacer spike; P wave before QRS; consistent with clinical history. Paced LBBB morphology: pacer spike visible (in some leads), pacemaker history." },
      { rhythm: "VT", distinguisher: "VT: no pacer spike; AV dissociation; not linked to pacemaker programming; rapid rate (>100 bpm)." },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Assembled curriculum
// ─────────────────────────────────────────────────────────────────────────────

export const ECG_CURRICULUM: readonly EcgCurriculumLevel[] = [
  {
    id: "foundations",
    level: 1,
    title: "ECG Foundations",
    eyebrow: "Level 1 — Beginner",
    description:
      "Build the measurement skills and systematic framework you need to interpret any ECG confidently. Every rhythm diagnosis rests on these fundamentals.",
    startHref: "/modules/ecg/basic/lessons",
    units: LEVEL_1_UNITS,
  },
  {
    id: "core",
    level: 2,
    title: "Core Rhythm Interpretation",
    eyebrow: "Level 2 — Intermediate",
    description:
      "Understand the mechanism behind every common arrhythmia — not just what it looks like, but why it looks that way, what it does to the patient, and exactly how nursing responds.",
    prerequisite: "Complete ECG Foundations first",
    startHref: "/modules/ecg/basic/quizzes",
    units: LEVEL_2_UNITS,
  },
  {
    id: "advanced",
    level: 3,
    title: "Advanced ECG & Critical Care",
    eyebrow: "Level 3 — Advanced",
    description:
      "Master STEMI localization, electrolyte signatures, pacemaker interpretation, and ICU-level telemetry decision-making with full pathophysiology context.",
    prerequisite: "Complete Core Rhythm Interpretation first",
    startHref: "/modules/ecg/advanced/lessons",
    units: LEVEL_3_UNITS,
  },
];

export function getEcgCurriculumUnit(id: string): EcgCurriculumUnit | undefined {
  for (const level of ECG_CURRICULUM) {
    const unit = level.units.find((u) => u.id === id);
    if (unit) return unit;
  }
  return undefined;
}

export function getEcgCurriculumUnitByRhythmTag(rhythmTag: string): EcgCurriculumUnit | undefined {
  const normalized = rhythmTag.trim().toLowerCase();
  for (const level of ECG_CURRICULUM) {
    const unit = level.units.find(
      (u) => u.rhythmTag?.trim().toLowerCase() === normalized,
    );
    if (unit) return unit;
  }
  return undefined;
}
