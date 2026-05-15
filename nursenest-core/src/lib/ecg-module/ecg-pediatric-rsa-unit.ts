/**
 * Respiratory Sinus Arrhythmia (RSA) — First-Class Pediatric Teaching Unit
 *
 * RSA is a NORMAL physiologic variation, not a pathologic arrhythmia.
 * The entire educational design of this unit is built around preventing
 * overcalling — the most common clinical error when encountering RSA.
 *
 * Core physiology:
 *   Inspiration → increased venous return → reflex inhibition of vagal tone
 *                → heart rate increases (R-R shortens)
 *   Expiration  → vagal tone increases → heart rate decreases (R-R lengthens)
 *
 * Teaching principle: RSA is evidence of a HEALTHY autonomic nervous system.
 * Its absence in a critically ill child may indicate autonomic dysfunction.
 *
 * Governance:
 *   RSA is classified as: physiologic_variation (NOT unstable_arrhythmia)
 *   RSA must NOT trigger arrhythmia-critical alerts.
 *   RSA must NOT negatively impact ACLS readiness scoring.
 *   RSA must appear in pediatric normal-rhythm libraries.
 */

// ─── Rhythm tag constant ────────────────────────────────────────────────────────

export const PEDIATRIC_RESPIRATORY_SINUS_ARRHYTHMIA =
  "Respiratory sinus arrhythmia" as const;

// ─── Physiologic classification ────────────────────────────────────────────────

export type RhythmPhysiologicClass =
  | "physiologic_variation"   // RSA, RSA in athletes — normal
  | "pathologic_arrhythmia"   // VT, AFib, AV blocks — requires intervention
  | "borderline"              // PACs, isolated PVCs — context-dependent
  | "arrest_rhythm";          // VF, asystole, PEA

export const RSA_PHYSIOLOGIC_CLASS: RhythmPhysiologicClass = "physiologic_variation";

// ─── Required ECG characteristics ──────────────────────────────────────────────

export type RsaEcgCharacteristics = {
  rhythmOrigin: "sinus";
  pWaveMorphology: "upright_before_every_qrs";
  prInterval: "normal_and_consistent";
  qrsWidth: "narrow";
  rrVariability: "cyclic_respiratory_synchronization";
  droppedBeats: false;
  chaoticAtrialActivity: false;
  ectopicMorphology: false;
  description: string;
};

export const RSA_ECG_CHARACTERISTICS: RsaEcgCharacteristics = {
  rhythmOrigin: "sinus",
  pWaveMorphology: "upright_before_every_qrs",
  prInterval: "normal_and_consistent",
  qrsWidth: "narrow",
  rrVariability: "cyclic_respiratory_synchronization",
  droppedBeats: false,
  chaoticAtrialActivity: false,
  ectopicMorphology: false,
  description:
    "Cyclic variation in R-R intervals synchronized to the respiratory cycle. " +
    "P-wave morphology is uniformly sinus (upright, consistent). PR interval is " +
    "constant across all beats. QRS is narrow. No dropped beats. No ectopy. " +
    "Rate increases during inspiration and slows during expiration.",
};

// ─── Full teaching content ──────────────────────────────────────────────────────

export type RsaTeachingContent = {
  /** Why the heart rate changes with breathing — mechanism explanation for learners. */
  whyRhythmChangesWithBreathing: string;
  /** Vagal tone explanation in learner-facing language. */
  vagalToneExplanation: string;
  /** How to distinguish normal RSA from pathologic irregular rhythms. */
  normalVsPathologicTeaching: string;
  /** What to say to families and patients when RSA is found. */
  reassuranceGuidance: string;
  /** When RSA DOES warrant escalation (very rare). */
  escalationTriggers: readonly string[];
  /** The most common incorrect interpretations of RSA on a monitor. */
  commonMisinterpretations: readonly string[];
  /** High-yield clinical pearls specifically for pediatric RSA. */
  pediatricClinicalPearls: readonly string[];
  /** How nurses assess RSA at the bedside. */
  nursingAssessment: readonly string[];
  /** How breathing pattern relates to the ECG finding. */
  respiratoryCorrelation: string;
  /** Competency objectives — what the learner must demonstrate. */
  competencyObjectives: readonly string[];
};

export const RSA_TEACHING_CONTENT: RsaTeachingContent = {
  whyRhythmChangesWithBreathing:
    "During inspiration, the chest expands, intrathoracic pressure falls, and venous " +
    "return to the right heart increases. This stretch activates the Bainbridge reflex, " +
    "which inhibits vagal (parasympathetic) tone. Reduced vagal tone lets the SA node fire " +
    "faster → heart rate increases, R-R interval shortens.\n\n" +
    "During expiration, the opposite occurs: intrathoracic pressure rises, venous return " +
    "decreases, vagal tone is restored, and the SA node slows → heart rate decreases, " +
    "R-R interval lengthens.\n\n" +
    "The result on the ECG strip is a smooth, sinusoidal variation in R-R intervals that " +
    "cycles at the breathing rate (~15–20 cycles/min in children, ~12–16 in adolescents).",

  vagalToneExplanation:
    "Vagal tone refers to the baseline activity of the vagus nerve (cranial nerve X), " +
    "which is the main parasympathetic supply to the heart. High vagal tone means the " +
    "heart is under more parasympathetic influence — producing slower rates and greater " +
    "beat-to-beat variability.\n\n" +
    "Children and athletes have high vagal tone as a normal finding. RSA is the most " +
    "visible expression of this healthy high vagal tone during the respiratory cycle. " +
    "Think of RSA as the heart 'listening to the lungs.'",

  normalVsPathologicTeaching:
    "RSA looks irregular on the monitor, and that irregularity triggers alarms and nurse " +
    "concern — but it is fundamentally different from pathologic arrhythmias:\n\n" +
    "RSA is REGULAR in its irregularity: the variation is smooth and predictable, " +
    "synchronizing exactly with the breathing cycle. Watch the child breathe: " +
    "the rate speeds up as the chest rises and slows as the chest falls.\n\n" +
    "AFib is CHAOTIC: no organized P-waves, completely unpredictable R-R intervals, " +
    "no correlation with breathing.\n\n" +
    "PACs interrupt the rhythm with PREMATURE beats: an early beat with abnormal P-wave " +
    "morphology, followed by a compensatory pause.\n\n" +
    "Sinus pauses have a SUDDEN, prolonged gap — the R-R doesn't gradually lengthen, " +
    "it drops off abruptly.",

  reassuranceGuidance:
    "To the family: 'Your child's heart rhythm is changing slightly with each breath — " +
    "this is completely normal and is actually a sign of a healthy nervous system. " +
    "We call it respiratory sinus arrhythmia. It means the heart and breathing are " +
    "working well together. You don't need to worry about this.'\n\n" +
    "To an anxious adolescent: 'The variation in your heartbeat is your body doing " +
    "exactly what it should — healthy hearts naturally speed up a little when you breathe " +
    "in and slow down when you breathe out. Athletes often have this more than average.'",

  escalationTriggers: [
    "RSA is absent in a child who previously had it — possible autonomic dysfunction " +
    "(cardiac autonomic neuropathy in diabetics, post-viral autonomic dysfunction)",
    "Exaggerated RSA with longest pause > 2.5 seconds in any age group → document and report",
    "RSA + structural heart disease: even benign rhythms warrant additional monitoring context",
    "RSA in a NEONATE with apnea spells: may need cardiorespiratory monitoring to distinguish " +
    "from true pauses (though RSA itself is not pathologic)",
  ],

  commonMisinterpretations: [
    "Atrial fibrillation: RSA's R-R variation is smooth and respiratory-linked; AFib is chaotic",
    "Frequent PACs: PACs have premature beats with abnormal P-wave morphology; RSA has uniform P-waves",
    "Sinus node dysfunction: RSA has gradual variation; sinus node issues cause abrupt long pauses",
    "Wandering atrial pacemaker: WAP changes P-wave morphology with each beat; RSA never changes P-wave shape",
    "Second-degree AV block: AV block has dropped beats; RSA never drops a QRS",
    "'Irregular rhythm' on auto-alarm — RSA will trigger most arrhythmia alarms; verify clinically before escalating",
  ],

  pediatricClinicalPearls: [
    "RSA is most prominent in healthy, athletic children and adolescents with high vagal tone",
    "RSA decreases with fever, pain, anxiety, and any sympathetically driven state — if it disappears, the child may be compensating",
    "RSA is often most visible during sleep telemetry (lowest baseline sympathetic tone)",
    "In preterm neonates, RSA can be difficult to distinguish from apnea-bradycardia events — context is critical",
    "RSA amplitude (range of rate change) decreases with age — a teenager's RSA is subtler than a toddler's",
    "Absence of RSA in a child with heart failure carries prognostic significance (autonomic dysfunction marker)",
  ],

  nursingAssessment: [
    "Observe the child's breathing pattern while watching the cardiac monitor simultaneously",
    "Confirm P-wave is upright and consistent (sinus origin) — use the rhythm strip to measure P-P intervals",
    "Verify that rate increase matches inspiration and rate decrease matches expiration",
    "Measure longest R-R interval: if > 2.5 seconds, document and report to provider",
    "Document as 'respiratory sinus arrhythmia — normal physiologic variant' in nursing assessment",
    "No intervention required unless clinical concern for autonomic dysfunction or structural heart disease",
  ],

  respiratoryCorrelation:
    "On ECG: the R-R interval shortens during inspiration and lengthens during expiration. " +
    "The variation is smooth (sinusoidal) rather than abrupt. In educational strip view, " +
    "shaded bands indicate the inspiration phase (where R-R is shorter/rate faster) and " +
    "clear bands indicate expiration (rate slower). The breathing cycle period is " +
    "approximately 3–4 seconds in children (15–20 breaths/min).",

  competencyObjectives: [
    "Correctly identify sinus origin by confirming upright P-wave before every QRS",
    "Demonstrate preserved P-wave morphology across all beats (no ectopic beats)",
    "Verify R-R variability is synchronized with respiratory cycle (not random)",
    "Confirm absence of dropped beats or chaotic atrial activity",
    "Distinguish RSA from AFib using P-wave analysis and variability pattern",
    "Distinguish RSA from PACs using premature beat identification and P-wave morphology comparison",
    "Correctly apply reassurance: identify RSA as a normal variant requiring no intervention",
    "Identify the ONE clinical scenario requiring escalation: pause > 2.5 seconds",
  ],
};

// ─── Five differential comparison pairs ────────────────────────────────────────

export type RsaDifferentialPair = {
  vsRhythm: string;
  keyDiscriminator: string;
  waveformDifferences: string;
  pWaveAnalysis: string;
  rrVariabilityPattern: string;
  respiratorySynchronization: string;
  clinicalSignificance: string;
  escalationThreshold: string;
};

export const RSA_DIFFERENTIAL_PAIRS: ReadonlyArray<RsaDifferentialPair> = [
  {
    vsRhythm: "Atrial fibrillation",
    keyDiscriminator:
      "P-wave presence and R-R pattern. RSA has uniform upright P-waves before every QRS. " +
      "AFib has no organized P-waves (only chaotic fibrillatory baseline) and randomly " +
      "irregular R-R intervals that do NOT follow breathing.",
    waveformDifferences:
      "RSA: clean isoelectric baseline between QRS complexes, consistent P-wave height and morphology. " +
      "AFib: fine fibrillatory low-amplitude waves between QRS, no organized P-wave.",
    pWaveAnalysis:
      "RSA: upright P-wave of consistent morphology precedes every QRS with a stable PR interval. " +
      "AFib: no discrete P-waves — fibrillatory f-waves at 350–600/min visible as baseline irregularity.",
    rrVariabilityPattern:
      "RSA: smooth sinusoidal R-R variation, gradual shortening and lengthening. " +
      "AFib: chaotic R-R with no predictable pattern — randomly irregular.",
    respiratorySynchronization:
      "RSA: rate change correlates exactly with breathing — watch the child breathe. " +
      "AFib: rate has no correlation with respiratory cycle.",
    clinicalSignificance:
      "RSA: no clinical significance, no treatment required. " +
      "AFib: requires anticoagulation assessment, rate/rhythm management — pediatric AFib is uncommon and warrants investigation.",
    escalationThreshold:
      "RSA: no escalation unless pause > 2.5s. " +
      "AFib: always escalate — any pediatric AFib requires prompt cardiology evaluation.",
  },
  {
    vsRhythm: "PACs (premature atrial contractions)",
    keyDiscriminator:
      "Premature vs progressive variability. PACs introduce a SUDDEN early beat with " +
      "abnormal P-wave morphology followed by a compensatory pause. " +
      "RSA shows GRADUAL, progressive R-R shortening without any premature beats.",
    waveformDifferences:
      "RSA: all QRS complexes look identical, no early beats. " +
      "PACs: one QRS arrives earlier than expected, often with slightly different morphology " +
      "(depending on PR interval from ectopic P-wave).",
    pWaveAnalysis:
      "RSA: every P-wave is upright with identical morphology. " +
      "PACs: the premature beat has a P-wave that is DIFFERENT in shape (inverted, biphasic, or early) " +
      "from the sinus P-waves — the ectopic site fires before the SA node.",
    rrVariabilityPattern:
      "RSA: gradually shortening then lengthening R-R in a smooth wave pattern. " +
      "PACs: sudden short R-R (early beat) followed by a pause (incomplete compensatory), " +
      "then resumption of normal sinus rhythm.",
    respiratorySynchronization:
      "RSA: R-R changes follow breathing rhythm precisely. " +
      "PACs: early beats occur randomly, not at a predictable point in the respiratory cycle.",
    clinicalSignificance:
      "RSA: normal, no action. " +
      "PACs: usually benign in healthy children; frequent PACs (>1% of beats) in neonates " +
      "may predict SVT — notify provider.",
    escalationThreshold:
      "RSA: no escalation. " +
      "PACs: escalate if > 6 per minute, multiform morphology, or in a neonate with history of SVT.",
  },
  {
    vsRhythm: "Wandering atrial pacemaker (WAP)",
    keyDiscriminator:
      "P-wave consistency. RSA always fires from the SA node — P-waves are consistently " +
      "upright and morphologically identical. WAP shows at least 3 DIFFERENT P-wave " +
      "morphologies in the same strip as the pacemaker site wanders between SA node, " +
      "atrial tissue, and AV junction.",
    waveformDifferences:
      "RSA: uniform P-waves throughout. " +
      "WAP: P-waves change height, axis, and morphology — some may be inverted or biphasic " +
      "as the pacemaker migrates from SA node to lower atrial sites to AV junction.",
    pWaveAnalysis:
      "RSA: every P-wave has identical morphology (same axis, height, duration). " +
      "WAP: ≥ 3 different P-wave morphologies visible in the same strip, PR interval " +
      "may shorten as pacemaker approaches AV junction.",
    rrVariabilityPattern:
      "RSA: gradual sinusoidal variability. " +
      "WAP: irregular variability not specifically tied to breathing — more random shifts as " +
      "pacemaker migrates.",
    respiratorySynchronization:
      "RSA: directly respiratory-linked. " +
      "WAP: often NOT directly correlated with breathing.",
    clinicalSignificance:
      "RSA: normal. WAP: usually benign in healthy children with high vagal tone; " +
      "may be seen with digitalis toxicity in older patients.",
    escalationThreshold:
      "RSA: no escalation. " +
      "WAP: escalate if child has structural heart disease, is on digitalis, or WAP progresses to AFib.",
  },
  {
    vsRhythm: "Sinus pauses",
    keyDiscriminator:
      "Gradual vs abrupt R-R change. RSA shows smooth, gradual lengthening of R-R that " +
      "never causes an abrupt 'gap' in rhythm. A sinus pause is a sudden, unexpected " +
      "ABSENCE of a beat — the P-wave and QRS are simply missing for one or more cycles.",
    waveformDifferences:
      "RSA: smooth continuous rhythm with no gaps. " +
      "Sinus pause: a sudden long flat segment where a beat was expected but did not occur, " +
      "followed by resumption of sinus rhythm at the next expected SA node firing.",
    pWaveAnalysis:
      "RSA: every expected beat is present — no P-QRS complex is missing. " +
      "Sinus pause: the P-wave is absent for one or more cycles — the P-P interval is a " +
      "multiple of the normal P-P interval (if pause is a multiple), or irregular (if sinus arrest).",
    rrVariabilityPattern:
      "RSA: longest R-R is a smooth, gradual maximum before the cycle reverses. " +
      "Sinus pause: R-R suddenly exceeds 2× normal (> 2.5 seconds is significant in children).",
    respiratorySynchronization:
      "RSA: linked to respiratory cycle. " +
      "Sinus pauses: NOT correlated with respiration — occur at irregular times.",
    clinicalSignificance:
      "RSA: normal. " +
      "Sinus pauses > 2.5 seconds in children require provider notification — may indicate " +
      "sick sinus syndrome, vagal hypersensitivity, or SA node dysfunction.",
    escalationThreshold:
      "RSA: longest R-R > 2.5 seconds warrants investigation. " +
      "Sinus pauses: any pause > 2.5 sec → notify provider; any pause causing symptoms → urgent escalation.",
  },
  {
    vsRhythm: "Sick sinus syndrome (SSS)",
    keyDiscriminator:
      "Pattern and clinical context. RSA is smooth, reproducible, and asymptomatic. " +
      "SSS shows inappropriate sinus bradycardia, sinus arrests, tachycardia-bradycardia " +
      "alternation, and chronotropic incompetence — an inherently abnormal SA node.",
    waveformDifferences:
      "RSA: normal sinus rate range with smooth cyclic variation, no pauses. " +
      "SSS: inappropriately slow sinus rates, sudden long pauses, possible bursts of " +
      "atrial tachyarrhythmia alternating with pauses (tachy-brady pattern).",
    pWaveAnalysis:
      "RSA: consistent sinus P-waves throughout. " +
      "SSS: P-waves may be absent during pauses; during tachycardia phase may show " +
      "ectopic P-waves from atrial flutter or fibrillation.",
    rrVariabilityPattern:
      "RSA: smooth sinusoidal pattern, predictable. " +
      "SSS: erratic — long pauses not matching respiratory cycle, tachycardia bursts, " +
      "failure of rate to increase appropriately with exercise (chronotropic incompetence).",
    respiratorySynchronization:
      "RSA: tightly synchronized. " +
      "SSS: NOT synchronized — rate abnormalities occur independently of respiration.",
    clinicalSignificance:
      "RSA: no significance. " +
      "SSS in children: often post-operative (after Mustard/Senning repairs, Fontan, " +
      "septal surgery). May require pacemaker implantation.",
    escalationThreshold:
      "RSA: no escalation. " +
      "SSS: any child with unexplained syncope, near-syncope, or chronotropic incompetence → " +
      "cardiology evaluation with exercise testing and Holter monitor.",
  },
];

// ─── Waveform behavior specification ───────────────────────────────────────────

/**
 * RSA waveform parameters for the generator.
 * See ecg-waveform-generator.ts: the rhythmKey "respiratory_sinus_arrhythmia"
 * triggers sinusoidal R-R modulation at the breathing cycle frequency.
 */
export type RsaWaveformBehavior = {
  /** Breathing cycle length in seconds. Default: 3.0s (~20 breaths/min for children). */
  breathingCycleSeconds: number;
  /** Maximum R-R deviation as a fraction of base cycle length [0–0.25]. */
  rrModulationDepth: number;
  /** Phase offset: 0 = inspiration starts at t=0. π/2 = expiration starts at t=0. */
  phaseOffset: number;
  description: string;
};

export const RSA_WAVEFORM_BEHAVIOR: RsaWaveformBehavior = {
  breathingCycleSeconds: 3.0,
  rrModulationDepth: 0.18,
  phaseOffset: 0,
  description:
    "Sinusoidal modulation of R-R interval at breathing rate (~3 second cycle). " +
    "During first half of cycle (inspiration): R-R shortens by up to 18% of base cycle. " +
    "During second half (expiration): R-R lengthens by up to 18%. " +
    "P-wave morphology is unchanged throughout. QRS is consistently narrow.",
};

// ─── Governance classification ──────────────────────────────────────────────────

export type RsaGovernanceRules = {
  physiologicClass: RhythmPhysiologicClass;
  triggersArrhythmiaAlert: false;
  impactsAclsReadinessScore: false;
  impactsPalsReadinessScore: false;
  libraryClassification: "pediatric_normal_rhythms";
  falsePositiveEscalationTracking: true;
  clinicalAlertThreshold: string;
};

export const RSA_GOVERNANCE: RsaGovernanceRules = {
  physiologicClass: "physiologic_variation",
  triggersArrhythmiaAlert: false,
  impactsAclsReadinessScore: false,
  impactsPalsReadinessScore: false,
  libraryClassification: "pediatric_normal_rhythms",
  falsePositiveEscalationTracking: true,
  clinicalAlertThreshold:
    "RSA alone: no alert. " +
    "RSA with longest pause > 2.5 seconds: provider notification. " +
    "RSA newly absent in previously present patient: document and flag.",
};

// ─── Five simulation cases ──────────────────────────────────────────────────────

export type RsaSimulationCase = {
  id: string;
  title: string;
  scenario: string;
  monitorFinding: string;
  correctInterpretation: string;
  incorrectInterpretationToTeachAgainst: string;
  teachingPoint: string;
  isComparisonCase: boolean;
  comparedTo?: string;
};

export const RSA_SIMULATION_CASES: ReadonlyArray<RsaSimulationCase> = [
  {
    id: "rsa-healthy-child-monitor",
    title: "6-Year-Old with 'Irregular Heartbeat' on Telemetry",
    scenario:
      "A 6-year-old is admitted for observation after a syncope episode. Cardiac monitor " +
      "alarm sounds: 'Irregular rhythm.' Parents are frightened. You review the strip.",
    monitorFinding:
      "HR 78–95 bpm cycling smoothly. Upright sinus P-wave before every QRS. " +
      "Constant PR interval. Narrow QRS. R-R shortens during inspiration, lengthens during expiration.",
    correctInterpretation:
      "Respiratory sinus arrhythmia — normal physiologic variant. No intervention required.",
    incorrectInterpretationToTeachAgainst:
      "Atrial fibrillation — calling the provider to cardiovert a healthy 6-year-old with RSA " +
      "would be dangerous and inappropriate.",
    teachingPoint:
      "Observe the child breathe: rate speeds up with inspiration, slows with expiration. " +
      "Uniform P-waves confirm sinus origin. This is RSA. Reassure the family.",
    isComparisonCase: false,
  },
  {
    id: "rsa-teen-athlete",
    title: "15-Year-Old Soccer Player with 'Bradycardia and Arrhythmia'",
    scenario:
      "A 15-year-old athlete has a sports physical ECG. Rate oscillates between 48 and 72 bpm. " +
      "The machine prints 'ABNORMAL: SINUS BRADYCARDIA + IRREGULAR RHYTHM.'",
    monitorFinding:
      "HR 48–72 bpm cycling with respiration. Consistent sinus P-waves. " +
      "Resting rate 48 bpm increases to 72 bpm during inspiration. " +
      "The RSA amplitude is pronounced — the athlete's high vagal tone amplifies the variation.",
    correctInterpretation:
      "Normal sinus rhythm with marked respiratory sinus arrhythmia — physiologic variant " +
      "consistent with high vagal tone in an athlete. Sinus bradycardia at rest is normal in " +
      "trained adolescent athletes.",
    incorrectInterpretationToTeachAgainst:
      "Pathologic arrhythmia requiring Holter monitor or cardiology referral — unnecessary " +
      "and costly in an asymptomatic athlete with normal exam.",
    teachingPoint:
      "Athletes have the highest vagal tone of any patient population. Marked RSA and resting " +
      "bradycardia in an asymptomatic, well-performing athlete is a sign of cardiovascular fitness, " +
      "not disease. Clear the athlete unless there is syncope, family history of SCD, or structural concern.",
    isComparisonCase: false,
  },
  {
    id: "rsa-anxiety-tachypnea",
    title: "10-Year-Old with Anxiety and Tachypnea — Exaggerated RSA",
    scenario:
      "A 10-year-old is anxious and hyperventilating during a procedure. " +
      "HR ranges from 115 to 145 bpm. Monitor shows irregular rhythm at high rate.",
    monitorFinding:
      "Rate cycling 115–145 bpm. Sinus P-waves before every QRS. " +
      "Fast breathing rate (respiratory rate 32/min, 2-second cycle) creates rapid RSA cycling. " +
      "RSA amplitude is smaller than at rest because high sympathetic tone competes with vagal modulation.",
    correctInterpretation:
      "Sinus tachycardia with respiratory sinus arrhythmia, exaggerated by rapid anxious breathing. " +
      "No arrhythmia.",
    incorrectInterpretationToTeachAgainst:
      "SVT — HR 145 with 'irregularity' could lead a novice to misdiagnose SVT and " +
      "inappropriately initiate vagal maneuver or adenosine workup.",
    teachingPoint:
      "Anxious tachypnea creates rapid RSA cycling that can look alarming. " +
      "Calm the child, reduce respiratory rate. If R-R becomes regular at the lower end after calming, " +
      "the 'irregularity' was RSA. SVT is fixed at its rate regardless of emotional state.",
    isComparisonCase: false,
  },
  {
    id: "rsa-vs-afib-comparison",
    title: "Comparison Strip: Respiratory Sinus Arrhythmia vs Atrial Fibrillation",
    scenario:
      "Educational side-by-side: two patients, both with 'irregular rhythms' on the monitor.",
    monitorFinding:
      "Strip A (RSA): Rate 70–90 bpm, smooth R-R cycling, uniform sinus P-waves before every QRS, " +
      "clean baseline between complexes, R-R matches breathing.\n" +
      "Strip B (AFib): Rate 85–130 bpm, chaotic R-R with no predictable pattern, " +
      "no organized P-waves, fine fibrillatory baseline, no respiratory correlation.",
    correctInterpretation:
      "Strip A = Respiratory sinus arrhythmia (normal). Strip B = Atrial fibrillation (treat).",
    incorrectInterpretationToTeachAgainst:
      "Diagnosing both as 'irregular rhythm — escalate' without P-wave analysis.",
    teachingPoint:
      "Two questions end the confusion: (1) Are there upright sinus P-waves before every QRS? " +
      "(2) Does the irregularity follow breathing? If YES to both → RSA. If NO to either → investigate further.",
    isComparisonCase: true,
    comparedTo: "Atrial fibrillation",
  },
  {
    id: "rsa-vs-pacs-comparison",
    title: "Comparison Strip: Respiratory Sinus Arrhythmia vs PACs",
    scenario:
      "Educational side-by-side: distinguish smooth RSA variability from PAC-induced irregularity.",
    monitorFinding:
      "Strip A (RSA): All beats arrive with smoothly varying R-R intervals; every P-wave looks identical; " +
      "no sudden early beats.\n" +
      "Strip B (PACs): Mostly regular sinus with one beat arriving EARLIER than expected, " +
      "with a slightly different P-wave morphology, followed by a short pause before the next sinus beat.",
    correctInterpretation:
      "Strip A = RSA (normal). Strip B = PACs (usually benign, monitor in neonates).",
    incorrectInterpretationToTeachAgainst:
      "Calling RSA 'PACs' because 'the rhythm is not perfectly regular.'",
    teachingPoint:
      "PACs interrupt with a PREMATURE beat — an early beat that arrives ahead of schedule. " +
      "RSA never produces premature beats — it only modulates the interval between normal sinus beats. " +
      "Premature P-wave different morphology = PAC. Uniform P-waves with variable spacing = RSA.",
    isComparisonCase: true,
    comparedTo: "PACs",
  },
];

// ─── Competency validation spec ────────────────────────────────────────────────

export type RsaCompetencyCheck = {
  criterion: string;
  assessmentMethod: string;
  passingThreshold: string;
};

export const RSA_COMPETENCY_CHECKS: ReadonlyArray<RsaCompetencyCheck> = [
  {
    criterion: "Sinus origin identification",
    assessmentMethod: "Learner correctly identifies upright P-wave before every QRS in RSA strip",
    passingThreshold: "4 out of 5 RSA strips correctly identified as sinus origin",
  },
  {
    criterion: "P-wave morphology preservation",
    assessmentMethod: "Learner correctly reports P-wave morphology is consistent across all beats",
    passingThreshold: "Correct identification of uniform vs non-uniform P-waves",
  },
  {
    criterion: "Respiratory synchronization recognition",
    assessmentMethod: "Learner correctly identifies that R-R variability correlates with breathing",
    passingThreshold: "Correct identification in 4 out of 5 cases",
  },
  {
    criterion: "AFib discrimination",
    assessmentMethod: "Learner correctly distinguishes RSA from AFib using P-wave and R-R pattern",
    passingThreshold: "< 10% misclassification rate across RSA/AFib paired strips",
  },
  {
    criterion: "Correct reassurance application",
    assessmentMethod: "Learner correctly selects 'RSA — no intervention' over false-escalation options",
    passingThreshold: "Correct in 100% of RSA-only strips",
  },
  {
    criterion: "Escalation threshold knowledge",
    assessmentMethod: "Learner correctly identifies pause > 2.5 seconds as the escalation trigger",
    passingThreshold: "Correct identification in test questions",
  },
];
