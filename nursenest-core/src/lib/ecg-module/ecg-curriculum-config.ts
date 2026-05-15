/**
 * ECG Curriculum Configuration
 *
 * Defines the progressive curriculum stages for the ECG mastery system.
 * This is the canonical source for curriculum ordering, prerequisites,
 * depth requirements, and teaching framework for each topic.
 *
 * Architecture:
 *   Beginner ECG (core module, included with RN/NP base) -- systematic
 *   approach to reading any ECG strip.
 *
 *   Advanced ECG (premium add-on) -- clinical interpretation, STEMI
 *   equivalents, electrolyte effects, critical care telemetry, and
 *   case-based simulations.
 *
 * Each topic must include: deep lesson, conduction explanation,
 * mechanism/pathophysiology, hemodynamic effects, nursing interventions,
 * differential reasoning ("why this is NOT X"), telemetry pitfalls,
 * annotated strip teaching.
 */

export type EcgCurriculumDepth = "foundational" | "intermediate" | "advanced" | "mastery";

export type EcgTeachingRequirement =
  | "conduction_mechanism"
  | "pathophysiology"
  | "hemodynamic_effects"
  | "nursing_interventions"
  | "differential_reasoning"
  | "telemetry_pitfalls"
  | "strip_annotation"
  | "pharmacology_integration"
  | "acls_integration"
  | "icu_integration";

export type EcgCurriculumTopic = {
  id: string;
  label: string;
  stage: "beginner" | "advanced";
  depth: EcgCurriculumDepth;
  /** Ordered systematic step index within beginner stage (1-8). */
  step?: number;
  /** Marketing page or learner route this topic maps to. */
  learnerRoute: string;
  marketingRoute?: string;
  /** Required teaching elements — every topic lesson must cover all of these. */
  teachingRequirements: readonly EcgTeachingRequirement[];
  /** IDs of topics that should be mastered before this one. */
  prerequisites: readonly string[];
  /** High-yield clinical pitfalls unique to this topic. */
  pitfalls: readonly string[];
  /** The "why NOT X" alternatives this topic must explicitly address. */
  differentials: readonly string[];
};

// ─── Beginner Stage: Systematic 8-Step Framework ──────────────────────────

/**
 * The beginner ECG stage teaches a systematic 8-step approach to reading
 * any rhythm strip. Answers must remain hidden until submission.
 * Every lesson includes mechanism + hemodynamic consequence, not just labels.
 */
const BEGINNER_TOPICS: readonly EcgCurriculumTopic[] = [
  {
    id: "rate",
    label: "Step 1 — Rate",
    stage: "beginner",
    depth: "foundational",
    step: 1,
    learnerRoute: "/modules/ecg/basic/lessons",
    teachingRequirements: ["conduction_mechanism", "pathophysiology", "nursing_interventions"],
    prerequisites: [],
    pitfalls: [
      "Irregular rhythms: use 6-second strip count, not fixed-interval method",
      "Rate is not the rhythm — a rate of 150 could be sinus tach, SVT, or flutter with 2:1",
      "Slow rate with wide complex is ventricular escape until proven otherwise",
    ],
    differentials: [
      "Sinus tachycardia vs SVT at rate 150-180",
      "Sinus bradycardia vs junctional rhythm",
    ],
  },
  {
    id: "rhythm",
    label: "Step 2 — Rhythm",
    stage: "beginner",
    depth: "foundational",
    step: 2,
    learnerRoute: "/modules/ecg/basic/lessons",
    teachingRequirements: ["conduction_mechanism", "strip_annotation", "telemetry_pitfalls"],
    prerequisites: ["rate"],
    pitfalls: [
      "Irregularly irregular vs regularly irregular — AFib vs Aflutter with variable block",
      "Group beating pattern (Wenckebach) appears irregular but follows a rule",
      "Artifact can mimic any rhythm — assess patient before treating the monitor",
    ],
    differentials: [
      "AFib vs AFib with frequent PVCs (both irregular)",
      "Wenckebach vs nonconducted PACs (both show dropped beats)",
    ],
  },
  {
    id: "p-waves",
    label: "Step 3 — P Waves",
    stage: "beginner",
    depth: "foundational",
    step: 3,
    learnerRoute: "/modules/ecg/basic/lessons",
    teachingRequirements: ["conduction_mechanism", "pathophysiology", "differential_reasoning"],
    prerequisites: ["rate", "rhythm"],
    pitfalls: [
      "Absent P waves: AFib (fine fibrillatory baseline) vs junctional (P buried in QRS)",
      "Retrograde P waves after QRS = junctional or SVT with retrograde conduction",
      "P waves before every QRS does NOT mean sinus rhythm -- check axis and morphology",
    ],
    differentials: [
      "Absent P: AFib vs junctional vs SA block vs sinoventricular conduction",
      "Abnormal P morphology: ectopic atrial vs PAC vs left atrial enlargement",
    ],
  },
  {
    id: "pr-interval",
    label: "Step 4 — PR Interval",
    stage: "beginner",
    depth: "foundational",
    step: 4,
    learnerRoute: "/modules/ecg/basic/lessons",
    teachingRequirements: ["conduction_mechanism", "pathophysiology", "nursing_interventions", "differential_reasoning"],
    prerequisites: ["rate", "rhythm", "p-waves"],
    pitfalls: [
      "Short PR with delta wave = pre-excitation (WPW) — AV blocking drugs contraindicated in AFib",
      "Progressively lengthening PR = Wenckebach, not just 'long PR'",
      "Constant PR with dropped QRS = Mobitz II — requires urgent pacing consult",
    ],
    differentials: [
      "Mobitz I vs Mobitz II: fixed vs variable PR before dropped beat",
      "Short PR: WPW vs LGL syndrome vs junctional escape with retrograde P",
    ],
  },
  {
    id: "qrs",
    label: "Step 5 — QRS Complex",
    stage: "beginner",
    depth: "intermediate",
    step: 5,
    learnerRoute: "/modules/ecg/basic/lessons",
    teachingRequirements: ["conduction_mechanism", "pathophysiology", "hemodynamic_effects", "differential_reasoning"],
    prerequisites: ["rate", "rhythm", "p-waves", "pr-interval"],
    pitfalls: [
      "Wide QRS + regular rhythm: default to VT until proven otherwise",
      "LBBB masks ischemia — cannot diagnose STEMI on standard criteria (use Sgarbossa)",
      "QRS width increases with hyperkalemia — measure carefully in renal patients",
    ],
    differentials: [
      "VT vs SVT with aberrancy: use Brugada algorithm",
      "RBBB vs LBBB vs nonspecific IVCD: direction of primary deflection in V1",
    ],
  },
  {
    id: "qt-qtc",
    label: "Step 6 — QT/QTc",
    stage: "beginner",
    depth: "intermediate",
    step: 6,
    learnerRoute: "/modules/ecg/basic/lessons",
    teachingRequirements: [
      "conduction_mechanism",
      "pathophysiology",
      "pharmacology_integration",
      "nursing_interventions",
      "differential_reasoning",
    ],
    prerequisites: ["qrs"],
    pitfalls: [
      "T-U fusion in hypokalemia falsely prolongs measured QTc",
      "QTc > 500ms requires immediate medication review and electrolyte check",
      "QTc drugs are additive -- two 'borderline' agents together can cause torsades",
    ],
    differentials: [
      "True QT prolongation vs T-U fusion vs biphasic T wave",
      "Drug-induced QT vs congenital LQTS: clinical context and trigger patterns",
    ],
  },
  {
    id: "st-t-changes",
    label: "Step 7 — ST/T Changes",
    stage: "beginner",
    depth: "intermediate",
    step: 7,
    learnerRoute: "/modules/ecg/basic/lessons",
    teachingRequirements: [
      "conduction_mechanism",
      "pathophysiology",
      "hemodynamic_effects",
      "nursing_interventions",
      "acls_integration",
      "differential_reasoning",
    ],
    prerequisites: ["qrs", "qt-qtc"],
    pitfalls: [
      "ST depression in V1-V3 may represent posterior STEMI -- request posterior leads",
      "LBBB secondary ST-T changes (discordant) are expected -- not ischemia",
      "Pericarditis: diffuse saddle-shaped elevation WITHOUT reciprocal depression",
    ],
    differentials: [
      "STEMI vs pericarditis vs Brugada vs early repolarization",
      "ST depression: ischemia vs LBBB secondary vs digoxin effect vs LVH strain",
    ],
  },
  {
    id: "rhythm-diagnosis",
    label: "Step 8 — Rhythm Diagnosis",
    stage: "beginner",
    depth: "intermediate",
    step: 8,
    learnerRoute: "/modules/ecg/basic/lessons",
    marketingRoute: "/advanced-ecg-nursing/rhythm-practice",
    teachingRequirements: [
      "conduction_mechanism",
      "pathophysiology",
      "hemodynamic_effects",
      "nursing_interventions",
      "acls_integration",
      "differential_reasoning",
      "strip_annotation",
      "telemetry_pitfalls",
    ],
    prerequisites: ["rate", "rhythm", "p-waves", "pr-interval", "qrs", "qt-qtc", "st-t-changes"],
    pitfalls: [
      "Apply all 8 steps systematically -- partial analysis causes most misdiagnoses",
      "Hemodynamic stability does not rule out VT -- some VT patients maintain BP",
      "Never treat the monitor -- confirm with clinical assessment before intervening",
    ],
    differentials: [
      "VT vs SVT with aberrancy vs antidromic AVRT",
      "Complete heart block vs AV dissociation from VT",
      "AFib vs multifocal atrial tachycardia",
    ],
  },
];

// ─── Advanced Stage: Clinical ECG Interpretation ──────────────────────────

const ADVANCED_TOPICS: readonly EcgCurriculumTopic[] = [
  {
    id: "stemi-localization",
    label: "STEMI Localization",
    stage: "advanced",
    depth: "advanced",
    learnerRoute: "/modules/ecg-advanced",
    marketingRoute: "/advanced-ecg-nursing/12-lead-stemi",
    teachingRequirements: [
      "conduction_mechanism",
      "pathophysiology",
      "hemodynamic_effects",
      "nursing_interventions",
      "acls_integration",
      "differential_reasoning",
      "strip_annotation",
    ],
    prerequisites: ["st-t-changes", "rhythm-diagnosis"],
    pitfalls: [
      "Posterior STEMI: ST depression V1-V3 = elevation seen from opposite side",
      "Inferior STEMI: always check V4R for RV involvement before giving nitrates",
      "De Winter T-waves: no ST elevation but still proximal LAD occlusion",
    ],
    differentials: [
      "STEMI vs pericarditis vs LBBB vs Brugada vs early repolarization",
      "De Winter T-waves vs hyperkalemia vs RBBB with lateral ischemia",
    ],
  },
  {
    id: "ischemia-injury-infarction",
    label: "Ischemia / Injury / Infarction Progression",
    stage: "advanced",
    depth: "advanced",
    learnerRoute: "/modules/ecg-advanced",
    marketingRoute: "/advanced-ecg-nursing/12-lead-stemi",
    teachingRequirements: ["pathophysiology", "hemodynamic_effects", "strip_annotation", "differential_reasoning"],
    prerequisites: ["stemi-localization"],
    pitfalls: [
      "Hyperacute T-waves precede ST elevation -- early recognition saves myocardium",
      "Q-waves can appear within 30 min of occlusion in some cases",
      "Wellens syndrome: biphasic or inverted T-waves in V2-V3 in pain-free patient",
    ],
    differentials: [
      "Hyperacute T vs normal variant vs LBBB secondary changes",
      "Wellens Type A (biphasic) vs Type B (deep inversion)",
    ],
  },
  {
    id: "electrolyte-ecg",
    label: "Electrolyte ECG Effects",
    stage: "advanced",
    depth: "advanced",
    learnerRoute: "/modules/ecg-advanced",
    marketingRoute: "/advanced-ecg-nursing/electrolyte-ecg-changes",
    teachingRequirements: [
      "pathophysiology",
      "pharmacology_integration",
      "nursing_interventions",
      "differential_reasoning",
      "strip_annotation",
    ],
    prerequisites: ["qt-qtc", "rhythm-diagnosis"],
    pitfalls: [
      "Hyperkalemia sine wave: do not defibrillate first -- give calcium to stabilize membrane",
      "Hypokalemia T-U fusion: measured QTc is QU interval, torsades risk is real",
      "Hypocalcemia prolongs flat ST segment; hypercalcemia shortens it",
    ],
    differentials: [
      "Hyperkalemia peaked T vs hyperacute STEMI T waves",
      "Hypokalemia QU prolongation vs true QTc prolongation",
    ],
  },
  {
    id: "av-blocks-advanced",
    label: "Advanced AV Block Analysis",
    stage: "advanced",
    depth: "advanced",
    learnerRoute: "/modules/ecg-advanced",
    marketingRoute: "/advanced-ecg-nursing/rhythm-practice",
    teachingRequirements: [
      "conduction_mechanism",
      "pathophysiology",
      "hemodynamic_effects",
      "nursing_interventions",
      "acls_integration",
      "differential_reasoning",
    ],
    prerequisites: ["pr-interval", "rhythm-diagnosis"],
    pitfalls: [
      "2:1 block: cannot determine Mobitz I vs II without conducting consecutive beats",
      "Mobitz II is infranodal -- atropine has limited/unpredictable effect",
      "Complete heart block with narrow escape = nodal (more stable); wide = ventricular (less stable)",
    ],
    differentials: [
      "Mobitz I vs nonconducted PACs (both show pauses)",
      "2:1 block: narrow QRS suggests nodal (Mobitz I more likely); wide QRS suggests infranodal",
    ],
  },
  {
    id: "bundle-branch-blocks",
    label: "Bundle Branch Blocks",
    stage: "advanced",
    depth: "advanced",
    learnerRoute: "/modules/ecg-advanced",
    marketingRoute: "/advanced-ecg-nursing/critical-care-ecg",
    teachingRequirements: [
      "conduction_mechanism",
      "pathophysiology",
      "nursing_interventions",
      "differential_reasoning",
      "strip_annotation",
      "icu_integration",
    ],
    prerequisites: ["qrs", "rhythm-diagnosis"],
    pitfalls: [
      "LBBB: Sgarbossa concordant ST elevation is always abnormal -- it is never expected",
      "Rate-related aberrancy: BBB morphology at fast rates that resolves with slowing",
      "New RBBB in inferior MI suggests involvement of right bundle (septal perforator ischemia)",
    ],
    differentials: [
      "RBBB vs LBBB vs nonspecific IVCD: V1 primary deflection direction",
      "LBBB ischemia: Sgarbossa concordant vs expected discordant changes",
    ],
  },
  {
    id: "wpw",
    label: "Wolff-Parkinson-White (Pre-excitation)",
    stage: "advanced",
    depth: "advanced",
    learnerRoute: "/modules/ecg-advanced",
    marketingRoute: "/advanced-ecg-nursing/pediatric-ecg",
    teachingRequirements: [
      "conduction_mechanism",
      "pathophysiology",
      "hemodynamic_effects",
      "pharmacology_integration",
      "nursing_interventions",
      "acls_integration",
      "differential_reasoning",
    ],
    prerequisites: ["pr-interval", "rhythm-diagnosis"],
    pitfalls: [
      "AFib in WPW: AV-blocking agents (adenosine, digoxin, verapamil, diltiazem) are CONTRAINDICATED",
      "Antidromic AVRT: wide-complex regular tachycardia that mimics VT",
      "Intermittent pre-excitation: delta wave may not appear on every beat",
    ],
    differentials: [
      "WPW resting ECG vs LBBB vs LVH (all can have Q-wave in V1-V2)",
      "Antidromic AVRT vs VT: both wide and regular -- cannot distinguish without history",
    ],
  },
  {
    id: "brugada",
    label: "Brugada Pattern/Syndrome",
    stage: "advanced",
    depth: "mastery",
    learnerRoute: "/modules/ecg-advanced",
    marketingRoute: "/advanced-ecg-nursing/pediatric-ecg",
    teachingRequirements: [
      "conduction_mechanism",
      "pathophysiology",
      "nursing_interventions",
      "differential_reasoning",
      "strip_annotation",
    ],
    prerequisites: ["qrs", "st-t-changes"],
    pitfalls: [
      "Type 1 (coved pattern) is diagnostic; Types 2/3 require provocation testing",
      "Fever can unmask Brugada pattern and trigger VF -- febrile Brugada patients need monitoring",
      "Brugada pattern vs RBBB with early repolarization vs STEMI in V1-V2: shape of ST matters",
    ],
    differentials: [
      "Brugada Type 1 vs anterior STEMI vs RBBB with early repolarization",
      "Acquired Brugada pattern (drugs, fever, ischemia) vs congenital",
    ],
  },
  {
    id: "torsades",
    label: "Torsades de Pointes",
    stage: "advanced",
    depth: "advanced",
    learnerRoute: "/modules/ecg-advanced",
    marketingRoute: "/advanced-ecg-nursing/medication-induced-ecg-changes",
    teachingRequirements: [
      "conduction_mechanism",
      "pathophysiology",
      "pharmacology_integration",
      "nursing_interventions",
      "acls_integration",
      "differential_reasoning",
    ],
    prerequisites: ["qt-qtc", "st-t-changes"],
    pitfalls: [
      "Magnesium is first-line even with normal serum Mg -- mechanism is direct membrane stabilization",
      "Short-long-short initiating sequence: PVC pause then another PVC triggers torsades",
      "Torsades vs polymorphic VT without QT prolongation: treatment differs (amiodarone vs Mg)",
    ],
    differentials: [
      "Torsades vs polymorphic VT (with vs without prolonged QT)",
      "Torsades vs VF (organized twisting vs chaotic)",
    ],
  },
  {
    id: "paced-rhythms",
    label: "Paced Rhythms + Malfunction",
    stage: "advanced",
    depth: "advanced",
    learnerRoute: "/modules/ecg-advanced",
    marketingRoute: "/advanced-ecg-nursing/critical-care-ecg",
    teachingRequirements: [
      "conduction_mechanism",
      "pathophysiology",
      "hemodynamic_effects",
      "nursing_interventions",
      "icu_integration",
      "differential_reasoning",
      "strip_annotation",
    ],
    prerequisites: ["qrs", "rhythm-diagnosis"],
    pitfalls: [
      "Failure to capture: spikes without QRS = hemodynamic emergency in pacemaker-dependent patients",
      "R-on-T from undersensing: competitive pacing can trigger VF especially with prolonged QT",
      "PMT: pacemaker at its upper rate limit = artifact that looks like regular tachycardia, terminates with magnet",
    ],
    differentials: [
      "Failure to capture vs failure to sense vs failure to pace",
      "PMT vs intrinsic tachycardia vs lead fracture artifact",
    ],
  },
  {
    id: "axis-deviation",
    label: "Axis Deviation",
    stage: "advanced",
    depth: "intermediate",
    learnerRoute: "/modules/ecg-advanced",
    teachingRequirements: ["conduction_mechanism", "pathophysiology", "differential_reasoning"],
    prerequisites: ["qrs"],
    pitfalls: [
      "Left axis deviation alone does not equal LAFB -- check QRS duration and morphology",
      "Right axis deviation in young patient: pulmonary hypertension, RV hypertrophy, dextrocardia",
      "Extreme axis deviation (no man's land): consider lead reversal or ventricular tachycardia",
    ],
    differentials: [
      "LAD: left anterior fascicular block vs inferior MI vs pre-excitation",
      "RAD: RVH vs LPHB vs lateral MI vs normal variant in tall/thin patient",
    ],
  },
  {
    id: "icu-telemetry",
    label: "ICU Telemetry + Critical Care ECG",
    stage: "advanced",
    depth: "mastery",
    learnerRoute: "/modules/ecg-advanced",
    marketingRoute: "/advanced-ecg-nursing/critical-care-ecg",
    teachingRequirements: [
      "pathophysiology",
      "hemodynamic_effects",
      "nursing_interventions",
      "acls_integration",
      "icu_integration",
      "telemetry_pitfalls",
      "pharmacology_integration",
    ],
    prerequisites: ["bundle-branch-blocks", "paced-rhythms", "st-t-changes"],
    pitfalls: [
      "Artifact mimic VF: assess patient first -- motion artifact during CPR or washing shows preserved QRS",
      "PEA: organized electrical activity with no pulse -- treat the cause (Hs and Ts), not the rhythm",
      "Silent ischemia in intubated/sedated patients: ST monitoring required, symptoms unreliable",
    ],
    differentials: [
      "Motion artifact vs VF: look for underlying QRS complexes within the waveform",
      "PEA vs organized rhythm with pulse: never skip pulse check",
    ],
  },
];

// ─── Public API ────────────────────────────────────────────────────────────

/** All beginner ECG curriculum topics in their systematic 8-step order. */
export const ECG_BEGINNER_CURRICULUM: readonly EcgCurriculumTopic[] = BEGINNER_TOPICS;

/** All advanced ECG curriculum topics. */
export const ECG_ADVANCED_CURRICULUM: readonly EcgCurriculumTopic[] = ADVANCED_TOPICS;

/** Full ECG curriculum: beginner then advanced. */
export const ECG_FULL_CURRICULUM: readonly EcgCurriculumTopic[] = [
  ...ECG_BEGINNER_CURRICULUM,
  ...ECG_ADVANCED_CURRICULUM,
];

/** Look up a topic by ID. */
export function getEcgCurriculumTopic(id: string): EcgCurriculumTopic | undefined {
  return ECG_FULL_CURRICULUM.find((t) => t.id === id);
}

/** All topics at a given depth. */
export function getEcgTopicsByDepth(depth: EcgCurriculumDepth): EcgCurriculumTopic[] {
  return ECG_FULL_CURRICULUM.filter((t) => t.depth === depth);
}

/** Topics that require a specific teaching element. */
export function getEcgTopicsRequiring(req: EcgTeachingRequirement): EcgCurriculumTopic[] {
  return ECG_FULL_CURRICULUM.filter((t) => t.teachingRequirements.includes(req));
}

/**
 * Marketing routes covered by the ECG curriculum.
 * Used to validate that all curriculum marketing pages exist.
 */
export const ECG_CURRICULUM_MARKETING_ROUTES = [
  ...new Set(
    ECG_FULL_CURRICULUM
      .map((t) => t.marketingRoute)
      .filter((r): r is string => Boolean(r)),
  ),
] as const;
