/**
 * ECG Pediatric Rhythm Registry
 *
 * Single source of truth for all pediatric rhythm tags used in
 * ECG questions, case simulations, differential drills, and mastery tracking.
 *
 * Architecture contract:
 *   - Pediatric rhythm tags are NAMESPACED with the "Pediatric" prefix so they
 *     cannot be mixed into adult ECG content without detection.
 *   - Age-group rate ranges are clinically accurate per AHA/PALS 2020 guidelines
 *     and PALS Provider Manual (6th ed). Adult normal-range overrides ARE NOT valid
 *     for pediatric rhythms.
 *   - Pulsus paradoxus is NOT in this registry. It is a hemodynamic assessment
 *     finding, not a cardiac rhythm. See HEMODYNAMIC_FINDINGS_REGISTRY below.
 *
 * Clinical rationale for separation:
 *   Pediatric ECG interpretation requires age-specific rate thresholds, different
 *   normal P-wave/PR/QRS ranges, and PALS-specific management algorithms.
 *   Scoring a pediatric learner's "SVT" performance against adult ACLS competency
 *   thresholds would produce clinically incorrect mastery assessments.
 *
 * Governance:
 *   Contract tests in ecg-pediatric-governance.contract.test.ts verify:
 *     - No pediatric rhythmTag appears in ECG_RHYTHM_TAG_REGISTRY (adult)
 *     - No adult rhythmTag appears in PEDIATRIC_ECG_RHYTHM_REGISTRY
 *     - Pulsus paradoxus is in HEMODYNAMIC_FINDINGS_REGISTRY only
 *     - All normalRateRange values are age-appropriate (no adult defaults)
 */

// ─── Age group taxonomy ─────────────────────────────────────────────────────────

/**
 * Pediatric age group taxonomy aligned with PALS and AHA developmental stages.
 * Rate ranges, normal vitals, and clinical thresholds differ meaningfully across these.
 */
export type PediatricAgeGroup =
  | "neonate"     // 0–30 days
  | "infant"      // 1–12 months
  | "toddler"     // 1–3 years
  | "child"       // 4–12 years (school-age)
  | "adolescent"; // 13–18 years

/** Human labels for display. */
export const PEDIATRIC_AGE_GROUP_LABELS: Record<PediatricAgeGroup, string> = {
  neonate:    "Neonate (0–30 days)",
  infant:     "Infant (1–12 months)",
  toddler:    "Toddler (1–3 years)",
  child:      "Child (4–12 years)",
  adolescent: "Adolescent (13–18 years)",
};

/**
 * Age-stratified normal resting heart rate ranges.
 * Source: AHA/PALS 2020, Harriet Lane Handbook, PALS Provider Manual 6th ed.
 */
export type PediatricNormalRateRange = {
  ageGroup: PediatricAgeGroup;
  restingMin: number;
  restingMax: number;
  /** Rate threshold below which symptomatic bradycardia is suspected in this group. */
  bradycardiaThreshold: number;
  /**
   * Rate threshold above which sinus tachycardia transitions to SVT territory.
   * Sinus tachycardia almost never exceeds this rate in a well child.
   * If rate exceeds this AND onset is abrupt → SVT until proven otherwise.
   */
  sinusTachMaxBeforeSvtSuspicion: number;
  /** Typical SVT rate range for this age group. */
  svtRateMin: number;
  svtRateMax: number;
};

export const PEDIATRIC_NORMAL_RATE_RANGES: ReadonlyArray<PediatricNormalRateRange> = [
  {
    ageGroup: "neonate",
    restingMin: 100,
    restingMax: 160,
    bradycardiaThreshold: 100,
    sinusTachMaxBeforeSvtSuspicion: 220,
    svtRateMin: 220,
    svtRateMax: 300,
  },
  {
    ageGroup: "infant",
    restingMin: 90,
    restingMax: 150,
    bradycardiaThreshold: 80,
    sinusTachMaxBeforeSvtSuspicion: 220,
    svtRateMin: 220,
    svtRateMax: 300,
  },
  {
    ageGroup: "toddler",
    restingMin: 70,
    restingMax: 120,
    bradycardiaThreshold: 70,
    sinusTachMaxBeforeSvtSuspicion: 200,
    svtRateMin: 180,
    svtRateMax: 270,
  },
  {
    ageGroup: "child",
    restingMin: 60,
    restingMax: 100,
    bradycardiaThreshold: 60,
    sinusTachMaxBeforeSvtSuspicion: 180,
    svtRateMin: 150,
    svtRateMax: 260,
  },
  {
    ageGroup: "adolescent",
    restingMin: 55,
    restingMax: 95,
    bradycardiaThreshold: 55,
    sinusTachMaxBeforeSvtSuspicion: 160,
    svtRateMin: 150,
    svtRateMax: 250,
  },
];

export function getPediatricNormalRateRange(
  ageGroup: PediatricAgeGroup,
): PediatricNormalRateRange {
  return PEDIATRIC_NORMAL_RATE_RANGES.find((r) => r.ageGroup === ageGroup)!;
}

// ─── Hemodynamic findings (NOT rhythms) ────────────────────────────────────────

/**
 * Hemodynamic assessment findings that are frequently confused with rhythm diagnoses.
 * These must NEVER appear as rhythm tags in ECG question databases.
 *
 * CLINICAL GOVERNANCE RULE:
 *   Pulsus paradoxus is a hemodynamic finding assessed by BP cuff or pulse-ox
 *   waveform. It indicates exaggerated inspiratory decline in systolic pressure
 *   (> 10 mmHg). It appears in ECG/telemetry teaching only as CONTEXT for
 *   conditions that cause it (tamponade, severe asthma, obstructive shock),
 *   never as a rhythm identification task.
 *
 *   Contract test: assertPulsusPardoxusIsNotRhythmTag() verifies this is enforced.
 */
export type PediatricHemodynamicFinding = {
  /** Canonical finding name — never used as a rhythmTag in DB. */
  findingTag: string;
  clinicalDefinition: string;
  assessmentMethod: string;
  /** Conditions associated with this finding. */
  associatedConditions: ReadonlyArray<string>;
  /**
   * True = this finding CAN appear as clinical context in case scenarios.
   * False = this finding must never appear in any educational pathway.
   */
  usedInCaseScenarios: boolean;
  /**
   * Explicit prohibition against rhythm tag use.
   * If true, the governance validator actively rejects it as a rhythmTag.
   */
  prohibitedAsRhythmTag: boolean;
};

export const HEMODYNAMIC_FINDINGS_REGISTRY: ReadonlyArray<PediatricHemodynamicFinding> = [
  {
    findingTag: "Pulsus paradoxus",
    clinicalDefinition:
      "Inspiratory decrease in systolic blood pressure > 10 mmHg, reflecting " +
      "exaggerated interventricular interdependence during inspiration. Not visible " +
      "on the ECG as a rhythm; assessed by sphygmomanometry or pulse oximetry waveform variation.",
    assessmentMethod:
      "BP cuff: measure SBP during slow expiration and again during slow inspiration. " +
      "Difference > 10 mmHg = pulsus paradoxus. Pulse oximetry waveform will show " +
      "inspiratory amplitude reduction.",
    associatedConditions: [
      "Cardiac tamponade",
      "Severe asthma / status asthmaticus",
      "Tension pneumothorax",
      "Constrictive pericarditis",
      "COPD exacerbation",
      "Obstructive shock",
      "Large pleural effusion",
    ],
    usedInCaseScenarios: true,
    prohibitedAsRhythmTag: true,
  },
  {
    findingTag: "Pulseless electrical activity",
    clinicalDefinition:
      "Organized electrical activity on the ECG monitor in the absence of a detectable " +
      "pulse. PEA is a clinical diagnosis (no pulse), not solely an ECG pattern.",
    assessmentMethod: "Pulse check — the ECG alone never diagnoses PEA.",
    associatedConditions: [
      "Hypovolemia",
      "Hypoxia",
      "Hydrogen ion (acidosis)",
      "Hypo/hyperkalemia",
      "Hypothermia",
      "Tension pneumothorax",
      "Tamponade",
      "Toxins",
      "Pulmonary thromboembolism",
    ],
    usedInCaseScenarios: true,
    prohibitedAsRhythmTag: false, // PEA appears as a rhythm tag with clinical context requirement
  },
];

/** Set of finding tags that are explicitly prohibited as ECG rhythm tags. */
export const PROHIBITED_AS_RHYTHM_TAGS: ReadonlySet<string> = new Set(
  HEMODYNAMIC_FINDINGS_REGISTRY
    .filter((f) => f.prohibitedAsRhythmTag)
    .map((f) => f.findingTag),
);

export function isPulsusPardoxusRhythmTag(tag: string): boolean {
  return PROHIBITED_AS_RHYTHM_TAGS.has(tag);
}

// ─── Pediatric rhythm registry ─────────────────────────────────────────────────

/**
 * PALS algorithm classification for rhythm management.
 *
 *   "shockable"          — VF, pulseless VT → defibrillation first
 *   "non_shockable"      — PEA, asystole → CPR + epinephrine + reversible cause search
 *   "adenosine_first"    — SVT with perfusion → vagal maneuvers → adenosine
 *   "synchronized_cardio" — SVT with poor perfusion, rapid AFib → synchronized cardioversion
 *   "pacing_indicated"   — CHB with poor perfusion, bradycardia unresponsive to epinephrine
 *   "supportive"         — Recognition + reassurance + monitoring; no immediate intervention
 *   "ventilate_first"    — Hypoxic bradycardia → ventilation/oxygenation is FIRST-LINE before drugs
 */
export type PalsManagementCategory =
  | "shockable"
  | "non_shockable"
  | "adenosine_first"
  | "synchronized_cardio"
  | "pacing_indicated"
  | "supportive"
  | "ventilate_first";

/**
 * Coverage level for pediatric curriculum content.
 *   "full"      — dedicated curriculum unit, case simulations, drills
 *   "partial"   — covered within a broader unit; no standalone drill
 *   "fallback"  — no dedicated unit; learner routed to parent topic
 */
export type PediatricCurriculumCoverage = "full" | "partial" | "fallback";

export type PediatricEcgRhythmEntry = {
  /** Namespaced pediatric rhythm tag — always starts with "Pediatric ". */
  tag: string;
  /**
   * Adult analog rhythm tag (may be null for rhythms with no adult equivalent,
   * e.g. respiratory sinus arrhythmia is more pronounced in children).
   */
  adultAnalogTag: string | null;
  /** Which age groups this rhythm is clinically relevant for. */
  applicableAgeGroups: ReadonlyArray<PediatricAgeGroup>;
  /** Age-group-specific expected rate ranges for this rhythm. */
  rateRangesByAgeGroup: Partial<Record<PediatricAgeGroup, { min: number; max: number }>>;
  /** PALS management category — drives algorithm selection. */
  palsCategory: PalsManagementCategory;
  /**
   * Whether this rhythm should be in PALS-readiness scoring, not ACLS-readiness.
   * Prevents contamination of adult ACLS mastery scores with pediatric content.
   */
  palsOnlyScoring: boolean;
  curriculumCoverage: PediatricCurriculumCoverage;
  fallbackTag?: string;
  /** The single most important teaching point for nurses caring for pediatric patients. */
  keyNursingPearl: string;
  /** True if this rhythm is a PALS cardiac arrest algorithm rhythm. */
  isPalsArrestRhythm: boolean;
  /** Age-specific pitfalls frequently seen in learner errors. */
  pitfalls: ReadonlyArray<string>;
};

export const PEDIATRIC_ECG_RHYTHM_REGISTRY: ReadonlyArray<PediatricEcgRhythmEntry> = [
  // ─── Sinus rhythms ─────────────────────────────────────────────────────────
  {
    tag: "Pediatric sinus tachycardia",
    adultAnalogTag: "Sinus tachycardia",
    applicableAgeGroups: ["neonate", "infant", "toddler", "child", "adolescent"],
    rateRangesByAgeGroup: {
      neonate:    { min: 161, max: 220 },
      infant:     { min: 151, max: 220 },
      toddler:    { min: 121, max: 200 },
      child:      { min: 101, max: 180 },
      adolescent: { min: 96,  max: 160 },
    },
    palsCategory: "supportive",
    palsOnlyScoring: true,
    curriculumCoverage: "full",
    keyNursingPearl:
      "Pediatric sinus tachycardia is almost always a response to fever, pain, fear, " +
      "dehydration, or hypoxia. Treat the cause — do not attempt rate control. " +
      "In infants, tachycardia > 220 with abrupt onset is SVT until proven otherwise.",
    isPalsArrestRhythm: false,
    pitfalls: [
      "Rate alone cannot distinguish sinus tachycardia from SVT in infants — onset character matters",
      "Fever can produce sinus tachycardia > 200 in neonates — do not cardiovert",
      "Sinus tachycardia rate varies with activity, crying, and stimulation; SVT rate is fixed",
    ],
  },
  {
    tag: "Pediatric sinus bradycardia",
    adultAnalogTag: "Sinus bradycardia",
    applicableAgeGroups: ["neonate", "infant", "toddler", "child", "adolescent"],
    rateRangesByAgeGroup: {
      neonate:    { min: 60,  max: 99 },
      infant:     { min: 60,  max: 79 },
      toddler:    { min: 50,  max: 69 },
      child:      { min: 50,  max: 59 },
      adolescent: { min: 40,  max: 54 },
    },
    palsCategory: "ventilate_first",
    palsOnlyScoring: true,
    curriculumCoverage: "full",
    keyNursingPearl:
      "In children, bradycardia is most often caused by hypoxia — ventilate before medicating. " +
      "HR < 60 with poor perfusion not responding to ventilation requires CPR per PALS.",
    isPalsArrestRhythm: false,
    pitfalls: [
      "Giving atropine before ventilating a hypoxic child delays the correct intervention",
      "Athlete bradycardia is normal in fit adolescents; clinical context is essential",
      "Junctional bradycardia after cardiac surgery has a different management path than hypoxic brady",
    ],
  },
  {
    tag: "Respiratory sinus arrhythmia",
    adultAnalogTag: "Normal sinus rhythm",
    applicableAgeGroups: ["infant", "toddler", "child", "adolescent"],
    rateRangesByAgeGroup: {
      infant:     { min: 80, max: 150 },
      toddler:    { min: 70, max: 120 },
      child:      { min: 60, max: 100 },
      adolescent: { min: 55, max: 95 },
    },
    palsCategory: "supportive",
    palsOnlyScoring: true,
    curriculumCoverage: "full",
    keyNursingPearl:
      "Respiratory sinus arrhythmia — HR increases with inspiration and decreases with expiration — " +
      "is NORMAL and prominent in children. It reflects healthy vagal tone. Do not treat.",
    isPalsArrestRhythm: false,
    pitfalls: [
      "RSA mimics irregular atrial rhythm; P-wave morphology is consistently sinus throughout",
      "RSA may look alarming on telemetry during sleep; confirm with respiratory observation",
      "Absence of RSA in a sick child may indicate autonomic dysfunction — do not dismiss it",
    ],
  },

  // ─── Ectopic rhythms ────────────────────────────────────────────────────────
  {
    tag: "Pediatric PAC",
    adultAnalogTag: "PAC",
    applicableAgeGroups: ["neonate", "infant", "toddler", "child", "adolescent"],
    rateRangesByAgeGroup: {
      neonate: { min: 100, max: 180 }, // underlying rate; PAC is a premature beat on any rhythm
      infant:  { min: 90, max: 150 },
      child:   { min: 60, max: 110 },
    },
    palsCategory: "supportive",
    palsOnlyScoring: true,
    curriculumCoverage: "full",
    keyNursingPearl:
      "Isolated PACs in children are almost always benign. Frequent PACs in a neonate may " +
      "trigger SVT — inform the team and increase monitoring frequency.",
    isPalsArrestRhythm: false,
    pitfalls: [
      "Frequent PACs in neonates can degenerate into SVT; do not reassure parents without follow-up",
      "Blocked PACs (non-conducted) can masquerade as 2nd-degree AV block — look for premature P-wave",
    ],
  },
  {
    tag: "Pediatric PVC",
    adultAnalogTag: "PVC",
    applicableAgeGroups: ["toddler", "child", "adolescent"],
    rateRangesByAgeGroup: {
      child:      { min: 60, max: 120 },
      adolescent: { min: 55, max: 100 },
    },
    palsCategory: "supportive",
    palsOnlyScoring: true,
    curriculumCoverage: "full",
    keyNursingPearl:
      "Isolated uniform PVCs in an otherwise healthy child are usually benign. " +
      "Multiform PVCs, salvos, or PVCs in a child with structural heart disease require cardiology notification.",
    isPalsArrestRhythm: false,
    pitfalls: [
      "PVCs that disappear with exercise in a structurally normal heart are reassuring",
      "PVCs that increase with exercise or in children with structural disease require workup",
      "R-on-T phenomenon is more dangerous in the setting of prolonged QTc",
    ],
  },

  // ─── Tachyarrhythmias ───────────────────────────────────────────────────────
  {
    tag: "Pediatric SVT",
    adultAnalogTag: "SVT",
    applicableAgeGroups: ["neonate", "infant", "toddler", "child", "adolescent"],
    rateRangesByAgeGroup: {
      neonate:    { min: 220, max: 300 },
      infant:     { min: 220, max: 300 },
      toddler:    { min: 180, max: 270 },
      child:      { min: 150, max: 260 },
      adolescent: { min: 150, max: 250 },
    },
    palsCategory: "adenosine_first",
    palsOnlyScoring: true,
    curriculumCoverage: "full",
    keyNursingPearl:
      "In infants: HR > 220 with abrupt onset and no identifiable cause = SVT. " +
      "Signs of poor perfusion (pale, weak pulse, altered responsiveness) = synchronized " +
      "cardioversion (0.5–1 J/kg). Signs of adequate perfusion = vagal maneuvers first " +
      "(ice to face in infants), then adenosine 0.1 mg/kg IV rapid push.",
    isPalsArrestRhythm: false,
    pitfalls: [
      "Ice water to the face is vagal maneuver for infants — carotid massage is for older children",
      "Adenosine must be given rapid IV push, not slow infusion — slow push will not terminate SVT",
      "SVT with hemodynamic compromise → synchronized cardioversion at 0.5 J/kg, may increase to 1 J/kg",
      "Valsalva (bearing down) is the vagal maneuver for school-age children and adolescents",
      "WPW-related SVT in infants may be bidirectional — adenosine is still first-line",
    ],
  },
  {
    tag: "Pediatric VT",
    adultAnalogTag: "Ventricular tachycardia",
    applicableAgeGroups: ["neonate", "infant", "toddler", "child", "adolescent"],
    rateRangesByAgeGroup: {
      neonate:    { min: 150, max: 300 },
      infant:     { min: 120, max: 280 },
      child:      { min: 120, max: 260 },
      adolescent: { min: 100, max: 250 },
    },
    palsCategory: "shockable",
    palsOnlyScoring: true,
    curriculumCoverage: "full",
    keyNursingPearl:
      "Pulseless VT in a child = DEFIBRILLATION at 2 J/kg (may increase to 4 J/kg). " +
      "VT with pulse and adequate perfusion = synchronized cardioversion 0.5–1 J/kg " +
      "or antiarrhythmic (amiodarone, lidocaine) per team decision.",
    isPalsArrestRhythm: true,
    pitfalls: [
      "Wide-complex tachycardia in a child is VT until proven otherwise — Brugada algorithm still applies",
      "Pediatric VT energy: start 2 J/kg (vs 1–2 J/kg adult recommendations per AHA PALS)",
      "Lidocaine is acceptable pediatric antiarrhythmic for VT; amiodarone is preferred for refractory VT",
    ],
  },

  // ─── Arrest rhythms ─────────────────────────────────────────────────────────
  {
    tag: "Pediatric VF",
    adultAnalogTag: "Ventricular fibrillation",
    applicableAgeGroups: ["neonate", "infant", "toddler", "child", "adolescent"],
    rateRangesByAgeGroup: {},
    palsCategory: "shockable",
    palsOnlyScoring: true,
    curriculumCoverage: "full",
    keyNursingPearl:
      "VF in children: immediate defibrillation at 2 J/kg → CPR 2 min → rhythm check → " +
      "if persistent VF, 4 J/kg → epinephrine 0.01 mg/kg IV/IO → continue PALS loop.",
    isPalsArrestRhythm: true,
    pitfalls: [
      "VF in children is less common than in adults; primary cause is usually hypoxia or respiratory failure",
      "Use pediatric pads/paddles (< 10 kg use infant paddles) or adult pads with minimum 3 cm separation",
      "After ROSC, target SpO₂ 94–99% — avoid hyperoxia in post-cardiac arrest care",
    ],
  },
  {
    tag: "Pediatric asystole",
    adultAnalogTag: "Asystole",
    applicableAgeGroups: ["neonate", "infant", "toddler", "child", "adolescent"],
    rateRangesByAgeGroup: {},
    palsCategory: "non_shockable",
    palsOnlyScoring: true,
    curriculumCoverage: "full",
    keyNursingPearl:
      "Pediatric asystole: CPR + epinephrine (0.01 mg/kg IV/IO q3–5min). " +
      "Search for and treat reversible causes (6 Hs and 5 Ts). " +
      "Confirm in two leads before declaring asystole — do not defibrillate asystole.",
    isPalsArrestRhythm: true,
    pitfalls: [
      "Fine VF can mimic asystole — confirm in a second lead before withholding defibrillation",
      "Atropine is NOT indicated in pulseless asystole (PALS 2020 update)",
      "Epinephrine is the primary drug for pediatric asystole; vasopressin is not recommended in PALS",
    ],
  },
  {
    tag: "Pediatric PEA",
    adultAnalogTag: "Pulseless electrical activity",
    applicableAgeGroups: ["neonate", "infant", "toddler", "child", "adolescent"],
    rateRangesByAgeGroup: {},
    palsCategory: "non_shockable",
    palsOnlyScoring: true,
    curriculumCoverage: "full",
    keyNursingPearl:
      "PEA is a clinical diagnosis — requires confirming NO pulse with organized ECG activity. " +
      "Management: CPR + epinephrine + aggressive 6H/5T reversible cause search. " +
      "Hypoxia is the most common reversible cause in children.",
    isPalsArrestRhythm: true,
    pitfalls: [
      "Never diagnose PEA from the monitor alone — always check pulse",
      "In pediatric PEA, hypoxia and hypovolemia account for most reversible causes",
      "Profound bradycardia without pulse is functionally PEA, not just bradycardia",
    ],
  },
  {
    tag: "Pediatric hypoxic bradycardia",
    adultAnalogTag: null,
    applicableAgeGroups: ["neonate", "infant", "toddler", "child"],
    rateRangesByAgeGroup: {
      neonate: { min: 0, max: 99 },
      infant:  { min: 0, max: 79 },
      toddler: { min: 0, max: 69 },
      child:   { min: 0, max: 59 },
    },
    palsCategory: "ventilate_first",
    palsOnlyScoring: true,
    curriculumCoverage: "full",
    keyNursingPearl:
      "Hypoxic bradycardia is the final pathway before pediatric cardiac arrest. " +
      "Ventilate immediately — bag-valve-mask ventilation with 100% O₂ will usually " +
      "reverse hypoxic bradycardia within 30 seconds. Atropine is for bradycardia " +
      "from vagal tone (e.g. intubation), not hypoxia.",
    isPalsArrestRhythm: false,
    pitfalls: [
      "Atropine does NOT address hypoxia — ventilate before medicating",
      "If HR < 60 with poor perfusion after 30 seconds of effective ventilation → CPR",
      "Hypoxic bradycardia can progress to asystole within minutes in infants",
    ],
  },

  // ─── Conduction disorders ───────────────────────────────────────────────────
  {
    tag: "Pediatric first-degree AV block",
    adultAnalogTag: "Heart block (1st degree)",
    applicableAgeGroups: ["child", "adolescent"],
    rateRangesByAgeGroup: {
      child:      { min: 60, max: 100 },
      adolescent: { min: 55, max: 95 },
    },
    palsCategory: "supportive",
    palsOnlyScoring: true,
    curriculumCoverage: "partial",
    fallbackTag: "Pediatric sinus bradycardia",
    keyNursingPearl:
      "Isolated first-degree AV block in children is often benign (post-viral, athletic). " +
      "New first-degree AV block after cardiac surgery warrants monitoring for progression.",
    isPalsArrestRhythm: false,
    pitfalls: [
      "PR > 0.20s in adults but age-specific norms apply in children — use pediatric ECG reference tables",
      "New first-degree AV block after Fontan or VSD repair may herald complete heart block progression",
    ],
  },
  {
    tag: "Pediatric second-degree AV block",
    adultAnalogTag: "Heart block (2nd degree)",
    applicableAgeGroups: ["child", "adolescent"],
    rateRangesByAgeGroup: {
      child:      { min: 40, max: 80 },
      adolescent: { min: 35, max: 70 },
    },
    palsCategory: "pacing_indicated",
    palsOnlyScoring: true,
    curriculumCoverage: "partial",
    fallbackTag: "Pediatric sinus bradycardia",
    keyNursingPearl:
      "Mobitz II in children is infranodal and can progress to complete heart block — " +
      "the same urgency applies as in adults. Symptomatic Mobitz II requires pacing.",
    isPalsArrestRhythm: false,
    pitfalls: [
      "Wenckebach (Mobitz I) is more common in children and may be vagally mediated during sleep",
      "Post-op second-degree AV block after tetralogy repair or AV canal repair can progress rapidly",
    ],
  },
  {
    tag: "Pediatric complete heart block",
    adultAnalogTag: "Heart block (3rd degree)",
    applicableAgeGroups: ["neonate", "infant", "child", "adolescent"],
    rateRangesByAgeGroup: {
      neonate: { min: 40, max: 80 },
      infant:  { min: 40, max: 80 },
      child:   { min: 30, max: 60 },
    },
    palsCategory: "pacing_indicated",
    palsOnlyScoring: true,
    curriculumCoverage: "full",
    keyNursingPearl:
      "Congenital complete heart block (anti-Ro/La antibody mediated) in the neonate " +
      "may present with hydrops or fetal bradycardia. Acquired CHB post-cardiac surgery " +
      "requires immediate pacing consultation. Atropine has limited effect on CHB.",
    isPalsArrestRhythm: false,
    pitfalls: [
      "Congenital CHB: escape rate may be sufficient to maintain hemodynamics for months but carries risk",
      "Post-op CHB after cardiac surgery that lasts > 7–10 days is unlikely to resolve without pacing",
      "Neonatal CHB: always assess maternal anti-Ro/La antibodies (neonatal lupus etiology)",
    ],
  },
  {
    tag: "Pediatric junctional rhythm",
    adultAnalogTag: null,
    applicableAgeGroups: ["neonate", "infant", "child"],
    rateRangesByAgeGroup: {
      neonate: { min: 80, max: 140 },
      infant:  { min: 70, max: 120 },
      child:   { min: 50, max: 100 },
    },
    palsCategory: "supportive",
    palsOnlyScoring: true,
    curriculumCoverage: "partial",
    fallbackTag: "Pediatric sinus bradycardia",
    keyNursingPearl:
      "Junctional ectopic tachycardia (JET) is a common post-op arrhythmia after " +
      "repair of congenital heart defects. Managed with cooling (therapeutic hypothermia " +
      "to 34–35°C), reducing catecholamines, and antiarrhythmics. NOT shockable.",
    isPalsArrestRhythm: false,
    pitfalls: [
      "JET is a narrow or near-narrow complex tachycardia — AV dissociation may be subtle",
      "JET is NOT responsive to cardioversion — recognize it before attempting synchronized shock",
      "JET rate slows with sedation and cooling — hemodynamic support may be needed during transition",
    ],
  },

  // ─── QT / channelopathies ────────────────────────────────────────────────────
  {
    tag: "Pediatric long QT / torsades risk",
    adultAnalogTag: "Torsades de Pointes",
    applicableAgeGroups: ["neonate", "infant", "child", "adolescent"],
    rateRangesByAgeGroup: {},
    palsCategory: "shockable",
    palsOnlyScoring: true,
    curriculumCoverage: "full",
    keyNursingPearl:
      "Long QT syndrome (LQTS) in children presents as syncope, seizure-like episodes, or " +
      "sudden death in a young athlete or child. IV magnesium 25–50 mg/kg (max 2g) is first-line " +
      "for pediatric torsades. Congenital LQTS is genotype-specific — beta-blockers are mainstay therapy.",
    isPalsArrestRhythm: true,
    pitfalls: [
      "QTc > 450 ms in boys and > 460 ms in girls is prolonged by pediatric standards",
      "QTc is rate-dependent — always use Bazett or Fridericia correction",
      "Many common medications (azithromycin, ondansetron, antihistamines) can prolong QTc",
      "Swimming-triggered syncope in a child: consider LQT1 (associated with exercise/swimming)",
    ],
  },
  {
    tag: "Pediatric WPW / pre-excitation",
    adultAnalogTag: "SVT", // WPW maps to SVT in adult tag; kept separate for pediatric teaching
    applicableAgeGroups: ["neonate", "infant", "toddler", "child", "adolescent"],
    rateRangesByAgeGroup: {
      infant:     { min: 220, max: 300 },
      child:      { min: 150, max: 280 },
      adolescent: { min: 150, max: 260 },
    },
    palsCategory: "adenosine_first",
    palsOnlyScoring: true,
    curriculumCoverage: "full",
    keyNursingPearl:
      "WPW is the most common cause of SVT in infants. Delta waves may disappear after infancy " +
      "as the accessory pathway becomes less conductive with age. AFib in WPW: " +
      "AV-nodal blocking agents (adenosine in this context only short-term) contraindicated — " +
      "use procainamide or synchronized cardioversion.",
    isPalsArrestRhythm: false,
    pitfalls: [
      "WPW delta waves may be subtle in infants — short PR + slurred upstroke in V1 is the clue",
      "About 40% of WPW children have spontaneous resolution of accessory pathway by mid-childhood",
      "AFib with WPW + rapid preexcited response → treat as antidromic AVRT — do not use adenosine for sustained rapid AFib",
    ],
  },

  // ─── Post-operative congenital heart ────────────────────────────────────────
  {
    tag: "Post-op congenital heart telemetry pattern",
    adultAnalogTag: null,
    applicableAgeGroups: ["neonate", "infant", "toddler", "child"],
    rateRangesByAgeGroup: {},
    palsCategory: "supportive",
    palsOnlyScoring: true,
    curriculumCoverage: "partial",
    fallbackTag: "Pediatric junctional rhythm",
    keyNursingPearl:
      "Post-cardiac surgery rhythms require specialized cardiology/cardiac surgery input. " +
      "Key patterns to recognize: JET (junctional ectopic tachycardia), early AV block, " +
      "sinus node dysfunction, and pacemaker-dependence. Report any new rhythm abnormality.",
    isPalsArrestRhythm: false,
    pitfalls: [
      "Post-op JET: rate typically > 180–200 in neonates/infants — looks like SVT but does not terminate with adenosine",
      "Post-Fontan atrial flutter is a common late complication — 2:1 block at 150 bpm may hide flutter waves",
      "Post-VSD repair CHB: always confirm pacemaker threshold before ICU transport",
    ],
  },
] as const;

/** Set of all valid pediatric ECG rhythm tag strings. */
export const VALID_PEDIATRIC_RHYTHM_TAGS: ReadonlySet<string> = new Set(
  PEDIATRIC_ECG_RHYTHM_REGISTRY.map((e) => e.tag),
);

/** All PALS arrest rhythms. */
export const PALS_ARREST_RHYTHMS: ReadonlyArray<string> = PEDIATRIC_ECG_RHYTHM_REGISTRY
  .filter((e) => e.isPalsArrestRhythm)
  .map((e) => e.tag);

/** Rhythms requiring synchronized cardioversion (hemodynamically unstable with pulse). */
export const PALS_SYNCHRONIZED_CARDIO_RHYTHMS: ReadonlyArray<string> = PEDIATRIC_ECG_RHYTHM_REGISTRY
  .filter((e) => e.palsCategory === "synchronized_cardio")
  .map((e) => e.tag);

/** Rhythms where ventilation is the first-line intervention before any drug. */
export const VENTILATE_FIRST_RHYTHMS: ReadonlyArray<string> = PEDIATRIC_ECG_RHYTHM_REGISTRY
  .filter((e) => e.palsCategory === "ventilate_first")
  .map((e) => e.tag);

export function getPediatricRhythmEntry(tag: string): PediatricEcgRhythmEntry | undefined {
  return PEDIATRIC_ECG_RHYTHM_REGISTRY.find((e) => e.tag === tag);
}

export function isValidPediatricRhythmTag(tag: string): boolean {
  return VALID_PEDIATRIC_RHYTHM_TAGS.has(tag);
}

/**
 * Governance guard: verify a proposed rhythm tag is NOT a hemodynamic finding.
 * Call before inserting any rhythm tag into the database.
 */
export function assertTagIsNotHemodynamicFinding(tag: string): void {
  if (PROHIBITED_AS_RHYTHM_TAGS.has(tag)) {
    throw new Error(
      `"${tag}" is a hemodynamic assessment finding and must not be used as a rhythm tag. ` +
      "Use it only as clinical context in case scenarios.",
    );
  }
}
