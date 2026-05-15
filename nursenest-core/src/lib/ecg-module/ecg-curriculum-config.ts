/**
 * ECG Curriculum Configuration — canonical governance contract.
 *
 * This file is the single source of truth for:
 *   - Curriculum sequencing (beginner 8-step + advanced topics)
 *   - Teaching requirement enforcement per topic
 *   - Prerequisite dependency graph
 *   - Clinical pitfall governance (minimum 2 per topic, enforced by contract tests)
 *   - Differential reasoning requirements
 *   - Progression metadata (time, question count, mastery thresholds)
 *   - Deep-link slugs for remediation routing
 *   - Related concept cross-linking for adaptive remediation
 *   - Clinical review governance (reviewer, guideline version, review date)
 *
 * Contract tests in ecg-curriculum-config.contract.test.ts enforce structural
 * integrity. Content authors must not modify this file without updating the tests.
 *
 * Hidden-answer-until-submission enforcement is the responsibility of the quiz
 * engine (src/lib/ecg-module/ecg-question-store.ts) — not this config. The config
 * governs WHAT must be taught; the engine governs HOW it is presented.
 *
 * Clinical Review Governance:
 *   Every topic must carry a clinicalReviewStatus. Advanced topics with
 *   clinicalReviewStatus="unreviewed" FAIL CI. A "stale" status (reviewedAt
 *   older than ECG_GUIDELINE_STALE_MONTHS) also FAILS CI.
 *   Guideline source: AHA/ACC ECG standards, ACLS 2020 guidelines.
 */

export type EcgCurriculumDepth = "foundational" | "intermediate" | "advanced" | "mastery";

/**
 * Required teaching elements — every topic lesson must demonstrate ALL of these.
 * Content reviews check coverage before a lesson is approved for publication.
 */
export type EcgTeachingRequirement =
  | "conduction_mechanism"     // How electrical conduction produces this finding
  | "pathophysiology"          // What disease process underlies this pattern
  | "hemodynamic_effects"      // What happens to cardiac output / BP / perfusion
  | "nursing_interventions"    // What the nurse does, in what order, and why
  | "differential_reasoning"   // Why this is NOT the other diagnosis
  | "telemetry_pitfalls"       // Common misidentification on continuous monitors
  | "strip_annotation"         // Annotated ECG strip demonstrating the finding
  | "pharmacology_integration" // How medications cause, worsen, or treat this
  | "acls_integration"         // Role in ACLS algorithm or arrest management
  | "icu_integration";         // Critical care monitoring and ICU-specific context

/**
 * Remediation priority — drives adaptive engine queue weight.
 *   "critical": appears in NCLEX/CNPLE life-threatening scenario questions
 *   "high": appears frequently and has major clinical consequence if missed
 *   "medium": important but less immediately life-threatening
 *   "low": supplementary / enrichment content
 */
export type EcgRemediationPriority = "critical" | "high" | "medium" | "low";

/**
 * Clinical review status for each topic.
 *   "reviewed"   — reviewed by a qualified clinician against current guidelines.
 *   "unreviewed" — content exists but has not been clinician-reviewed.
 *                  Advanced topics with this status FAIL CI.
 *   "stale"      — reviewed but the review date exceeds ECG_GUIDELINE_STALE_MONTHS.
 *                  Any topic with this status FAILS CI.
 */
export type EcgClinicalReviewStatus = "reviewed" | "unreviewed" | "stale";

/**
 * Number of months after which a clinical review is considered stale.
 * Aligned with ACLS guideline refresh cadence (every 5 years = 60 months,
 * but we use 24 months for continuous quality assurance).
 */
export const ECG_GUIDELINE_STALE_MONTHS = 24;

export type EcgCurriculumTopic = {
  id: string;
  label: string;
  stage: "beginner" | "advanced";
  depth: EcgCurriculumDepth;
  /** Ordered systematic step index within beginner stage (1–8). */
  step?: number;
  /**
   * Learner-scoped route inside /app/* or /modules/*.
   * Must never point to a marketing page — marketing pages are SEO surfaces, not UX destinations.
   */
  learnerRoute: string;
  /**
   * Optional direct lesson slug for remediation deep-linking.
   * When present, remediation routes to /modules/ecg/.../lessons/{lessonSlug}
   * instead of the generic hub.
   */
  lessonSlug?: string;
  /** Marketing SEO page for this topic (optional). */
  marketingRoute?: string;
  /** Required teaching elements — content review checklist. */
  teachingRequirements: readonly EcgTeachingRequirement[];
  /** IDs of topics that must be mastered before this one. */
  prerequisites: readonly string[];
  /** High-yield clinical pitfalls. Minimum 2 required — enforced by contract tests. */
  pitfalls: readonly string[];
  /** Explicit differential reasoning ("why this is NOT X"). Minimum 2 required. */
  differentials: readonly string[];
  /** Estimated time to complete core lesson (minutes). Required for progress calculation. */
  estimatedMinutes: number;
  /** Target question count in the module bank for this topic. */
  questionCount: number;
  /** Minimum correct fraction (0–1) to advance. 0.8 = 80% correct. */
  minimumPassScore: number;
  /** Fraction at which the topic is considered mastered and deprioritized in adaptive queue. */
  masteryThreshold: number;
  /** Adaptive queue weight. */
  remediationPriority: EcgRemediationPriority;
  /**
   * IDs of foundational curriculum topics to surface when a learner struggles.
   * Used by the adaptive remediation engine to cross-link prerequisite concepts
   * automatically — e.g. a learner missing VT questions is surfaced "qrs" and
   * "rhythm-diagnosis" without requiring explicit remediation configuration.
   * Topic IDs must reference existing entries in ECG_FULL_CURRICULUM.
   */
  relatedConceptUnitIds?: readonly string[];
  /**
   * Clinical review governance.
   * Advanced-stage topics with clinicalReviewStatus="unreviewed" fail CI.
   * Any topic with clinicalReviewStatus="stale" fails CI.
   * ISO-8601 date string (YYYY-MM-DD).
   */
  clinicalReviewStatus: EcgClinicalReviewStatus;
  reviewedAt?: string;
  reviewedBy?: string;
  /** AHA/ACC/ACLS guideline version this content was reviewed against. */
  guidelineVersion?: string;
};

// ─── Beginner Stage: Systematic 8-Step Framework ──────────────────────────

const BEGINNER_TOPICS: readonly EcgCurriculumTopic[] = [
  {
    id: "rate",
    label: "Step 1 — Rate",
    stage: "beginner",
    depth: "foundational",
    step: 1,
    learnerRoute: "/modules/ecg/basic/lessons",
    lessonSlug: "ecg-rate-calculation",
    teachingRequirements: [
      "conduction_mechanism",
      "pathophysiology",
      "nursing_interventions",
      "differential_reasoning",
      "telemetry_pitfalls",
      "strip_annotation",
    ],
    prerequisites: [],
    pitfalls: [
      "Irregular rhythms: use 6-second strip count or R-R sequence, not fixed-interval calculation",
      "Rate is not the rhythm — rate 150 could be sinus tachycardia, SVT, or 2:1 flutter",
      "Slow rate with wide QRS = ventricular escape until proven otherwise; never assume bradycardia is benign",
    ],
    differentials: [
      "Sinus tachycardia vs SVT at rate 150–180: onset abruptness, P-wave morphology",
      "Sinus bradycardia vs junctional rhythm: P-wave presence and axis",
    ],
    estimatedMinutes: 20,
    questionCount: 18,
    minimumPassScore: 0.75,
    masteryThreshold: 0.90,
    remediationPriority: "high",
    relatedConceptUnitIds: [],
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-01-15",
    reviewedBy: "ECG Clinical Content Team",
    guidelineVersion: "AHA/ACC 2019 ECG Standards",
  },
  {
    id: "rhythm",
    label: "Step 2 — Rhythm",
    stage: "beginner",
    depth: "foundational",
    step: 2,
    learnerRoute: "/modules/ecg/basic/lessons",
    lessonSlug: "ecg-rhythm-regularity",
    teachingRequirements: [
      "conduction_mechanism",
      "pathophysiology",
      "strip_annotation",
      "telemetry_pitfalls",
      "differential_reasoning",
    ],
    prerequisites: ["rate"],
    pitfalls: [
      "Irregularly irregular vs regularly irregular — AFib vs Aflutter with variable block require different management",
      "Group beating (Wenckebach) appears irregular but follows a predictable repeating pattern",
      "Artifact mimics any rhythm — assess the patient before treating the monitor",
    ],
    differentials: [
      "AFib vs AFib with frequent PVCs (both irregularly irregular, but PVC morphology is discrete)",
      "Wenckebach groups vs nonconducted PACs (both show dropped beats but PR behavior differs)",
    ],
    estimatedMinutes: 20,
    questionCount: 20,
    minimumPassScore: 0.75,
    masteryThreshold: 0.90,
    remediationPriority: "high",
    relatedConceptUnitIds: ["rate"],
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-01-15",
    reviewedBy: "ECG Clinical Content Team",
    guidelineVersion: "AHA/ACC 2019 ECG Standards",
  },
  {
    id: "p-waves",
    label: "Step 3 — P Waves",
    stage: "beginner",
    depth: "foundational",
    step: 3,
    learnerRoute: "/modules/ecg/basic/lessons",
    lessonSlug: "ecg-p-wave-analysis",
    teachingRequirements: [
      "conduction_mechanism",
      "pathophysiology",
      "differential_reasoning",
      "strip_annotation",
      "telemetry_pitfalls",
    ],
    prerequisites: ["rate", "rhythm"],
    pitfalls: [
      "Absent P waves: AFib shows fine fibrillatory baseline; junctional rhythms bury or invert the P near QRS",
      "Retrograde P waves after QRS = junctional or SVT with retrograde conduction — not sinus",
      "P wave before every QRS does NOT confirm sinus rhythm — check P-wave axis and morphology",
    ],
    differentials: [
      "Absent P: AFib vs junctional vs SA exit block vs sinoventricular conduction in severe hyperkalemia",
      "Abnormal P morphology: ectopic atrial vs PAC vs left atrial enlargement vs retrograde conduction",
    ],
    estimatedMinutes: 20,
    questionCount: 18,
    minimumPassScore: 0.75,
    masteryThreshold: 0.90,
    remediationPriority: "high",
    relatedConceptUnitIds: ["rate", "rhythm"],
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-01-15",
    reviewedBy: "ECG Clinical Content Team",
    guidelineVersion: "AHA/ACC 2019 ECG Standards",
  },
  {
    id: "pr-interval",
    label: "Step 4 — PR Interval",
    stage: "beginner",
    depth: "foundational",
    step: 4,
    learnerRoute: "/modules/ecg/basic/lessons",
    lessonSlug: "ecg-pr-interval",
    teachingRequirements: [
      "conduction_mechanism",
      "pathophysiology",
      "nursing_interventions",
      "differential_reasoning",
      "strip_annotation",
      "telemetry_pitfalls",
    ],
    prerequisites: ["rate", "rhythm", "p-waves"],
    pitfalls: [
      "Short PR with delta wave = pre-excitation (WPW) — AV-blocking agents are contraindicated in AFib with WPW",
      "Progressively lengthening PR culminating in a dropped QRS = Wenckebach, not just 'long PR'",
      "Constant PR interval with sudden dropped QRS = Mobitz II — requires urgent pacing consultation even when asymptomatic",
    ],
    differentials: [
      "Mobitz I vs Mobitz II: variable vs fixed PR before the dropped beat — the most clinically consequential AV block distinction",
      "Short PR: WPW vs LGL syndrome vs accelerated AV conduction vs junctional escape with retrograde P",
    ],
    estimatedMinutes: 25,
    questionCount: 22,
    minimumPassScore: 0.80,
    masteryThreshold: 0.90,
    remediationPriority: "critical",
    relatedConceptUnitIds: ["rate", "rhythm", "p-waves"],
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-01-15",
    reviewedBy: "ECG Clinical Content Team",
    guidelineVersion: "AHA/ACC 2019 ECG Standards",
  },
  {
    id: "qrs",
    label: "Step 5 — QRS Complex",
    stage: "beginner",
    depth: "intermediate",
    step: 5,
    learnerRoute: "/modules/ecg/basic/lessons",
    lessonSlug: "ecg-qrs-complex",
    teachingRequirements: [
      "conduction_mechanism",
      "pathophysiology",
      "hemodynamic_effects",
      "differential_reasoning",
      "strip_annotation",
      "telemetry_pitfalls",
    ],
    prerequisites: ["rate", "rhythm", "p-waves", "pr-interval"],
    pitfalls: [
      "Wide QRS + regular rhythm = ventricular tachycardia until proven otherwise by Brugada algorithm — never assume SVT with aberrancy as the first diagnosis",
      "LBBB masks ischemia — ST-T changes expected; use Sgarbossa criteria to identify superimposed MI",
      "QRS width increases progressively with hyperkalemia — measure carefully in every renal or metabolic patient",
    ],
    differentials: [
      "VT vs SVT with aberrancy: apply Brugada 4-step algorithm; default to VT when uncertain",
      "RBBB vs LBBB vs nonspecific IVCD: primary deflection direction in V1 is the first discriminator",
    ],
    estimatedMinutes: 25,
    questionCount: 22,
    minimumPassScore: 0.80,
    masteryThreshold: 0.90,
    remediationPriority: "critical",
    relatedConceptUnitIds: ["rate", "rhythm", "p-waves", "pr-interval"],
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-01-15",
    reviewedBy: "ECG Clinical Content Team",
    guidelineVersion: "AHA/ACC 2019 ECG Standards",
  },
  {
    id: "qt-qtc",
    label: "Step 6 — QT/QTc",
    stage: "beginner",
    depth: "intermediate",
    step: 6,
    learnerRoute: "/modules/ecg/basic/lessons",
    lessonSlug: "ecg-qt-interval",
    teachingRequirements: [
      "conduction_mechanism",
      "pathophysiology",
      "pharmacology_integration",
      "nursing_interventions",
      "differential_reasoning",
      "strip_annotation",
      "telemetry_pitfalls",
    ],
    prerequisites: ["qrs"],
    pitfalls: [
      "T-U fusion in hypokalemia creates an apparent QU interval that falsely prolongs measured QTc",
      "QTc > 500ms requires immediate medication reconciliation and electrolyte correction — threshold is not optional",
      "QT-prolonging drugs are additive: two agents with borderline individual effects can combine to cause torsades",
    ],
    differentials: [
      "True QT prolongation vs T-U fusion vs biphasic T wave: T-wave endpoint identification is the key skill",
      "Drug-induced long QT vs congenital LQTS: acquired responds to drug removal; congenital has genotype-specific triggers",
    ],
    estimatedMinutes: 25,
    questionCount: 20,
    minimumPassScore: 0.80,
    masteryThreshold: 0.90,
    remediationPriority: "critical",
    relatedConceptUnitIds: ["qrs"],
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-01-15",
    reviewedBy: "ECG Clinical Content Team",
    guidelineVersion: "AHA/ACC 2019 ECG Standards",
  },
  {
    id: "st-t-changes",
    label: "Step 7 — ST/T Changes",
    stage: "beginner",
    depth: "intermediate",
    step: 7,
    learnerRoute: "/modules/ecg/basic/lessons",
    lessonSlug: "ecg-st-segment",
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
    prerequisites: ["qrs", "qt-qtc"],
    pitfalls: [
      "ST depression in V1–V3 in a chest pain patient may represent posterior STEMI — always request posterior leads (V7–V9) before excluding occlusion MI",
      "LBBB secondary ST-T changes (discordant from QRS) are expected and do not indicate ischemia — concordant changes do",
      "Pericarditis: diffuse saddle-shaped elevation WITHOUT reciprocal depression distinguishes it from STEMI",
    ],
    differentials: [
      "STEMI vs pericarditis vs Brugada vs early repolarization: distribution, reciprocal changes, and ST shape",
      "ST depression: subendocardial ischemia vs LBBB secondary vs digoxin scooping vs LVH strain pattern",
    ],
    estimatedMinutes: 30,
    questionCount: 25,
    minimumPassScore: 0.80,
    masteryThreshold: 0.90,
    remediationPriority: "critical",
    relatedConceptUnitIds: ["qrs", "qt-qtc"],
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-01-15",
    reviewedBy: "ECG Clinical Content Team",
    guidelineVersion: "AHA/ACC 2019 ECG Standards; ACLS 2020",
  },
  {
    id: "rhythm-diagnosis",
    label: "Step 8 — Rhythm Diagnosis",
    stage: "beginner",
    depth: "intermediate",
    step: 8,
    learnerRoute: "/modules/ecg/basic/lessons",
    lessonSlug: "ecg-rhythm-diagnosis",
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
      "Apply all 8 steps systematically — partial analysis is the source of most telemetry misdiagnoses",
      "Hemodynamic stability does not rule out VT — some patients with VT maintain adequate perfusion for minutes",
      "Never treat the monitor: confirm the rhythm correlates with the patient's clinical presentation before intervening",
    ],
    differentials: [
      "VT vs SVT with aberrancy vs antidromic AVRT: Brugada algorithm, clinical history, AV dissociation",
      "Complete heart block vs AV dissociation from accelerated junctional: escape rate and P-wave relationship",
      "AFib vs multifocal atrial tachycardia: both irregular but MAT has identifiable P waves of ≥3 morphologies",
    ],
    estimatedMinutes: 35,
    questionCount: 30,
    minimumPassScore: 0.80,
    masteryThreshold: 0.90,
    remediationPriority: "critical",
    relatedConceptUnitIds: ["rate", "rhythm", "p-waves", "pr-interval", "qrs", "qt-qtc", "st-t-changes"],
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-01-15",
    reviewedBy: "ECG Clinical Content Team",
    guidelineVersion: "AHA/ACC 2019 ECG Standards; ACLS 2020",
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
    lessonSlug: "stemi-territory-localization",
    marketingRoute: "/advanced-ecg-nursing/12-lead-stemi",
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
    prerequisites: ["st-t-changes", "rhythm-diagnosis"],
    pitfalls: [
      "Posterior STEMI: ST depression in V1–V3 represents the electrically opposite view of posterior elevation — always request posterior leads V7–V9",
      "Inferior STEMI: always obtain right-sided leads (V4R) before administering nitrates — RV MI is contraindicated for nitrates",
      "De Winter T-waves: J-point depression + tall symmetric precordial T-waves = proximal LAD occlusion without classic ST elevation",
    ],
    differentials: [
      "STEMI vs pericarditis: distribution (coronary territory vs diffuse), reciprocal changes (STEMI has them, pericarditis does not), ST shape",
      "De Winter T-waves vs hyperkalemia peaked T-waves: J-point depression distinguishes De Winter; context and QRS width distinguish hyperkalemia",
    ],
    estimatedMinutes: 40,
    questionCount: 35,
    minimumPassScore: 0.80,
    masteryThreshold: 0.90,
    remediationPriority: "critical",
    relatedConceptUnitIds: ["st-t-changes", "qrs", "rhythm-diagnosis"],
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-02-10",
    reviewedBy: "ECG Clinical Content Team",
    guidelineVersion: "AHA/ACC STEMI Guidelines 2013/2022 Update",
  },
  {
    id: "ischemia-injury-infarction",
    label: "Ischemia / Injury / Infarction Progression",
    stage: "advanced",
    depth: "advanced",
    learnerRoute: "/modules/ecg-advanced",
    lessonSlug: "ischemia-progression-timeline",
    marketingRoute: "/advanced-ecg-nursing/12-lead-stemi",
    teachingRequirements: [
      "pathophysiology",
      "hemodynamic_effects",
      "strip_annotation",
      "differential_reasoning",
      "telemetry_pitfalls",
      "acls_integration",
    ],
    prerequisites: ["stemi-localization"],
    pitfalls: [
      "Hyperacute T-waves precede ST elevation by minutes — recognizing them before ST changes develops saves myocardium",
      "Wellens syndrome: biphasic (Type A) or deeply inverted (Type B) T-waves in V2–V3 in a pain-free patient = critical proximal LAD stenosis, NOT resolved ischemia",
      "Q-wave development can begin within 30 minutes of occlusion — new Q-waves in chest pain are never incidental",
    ],
    differentials: [
      "Hyperacute T-waves vs normal variant tall T vs LBBB secondary changes: symmetric narrow base and precordial distribution favor hyperacute",
      "Wellens Type A (biphasic) vs Type B (deep symmetric inversion): both require same urgency, different morphology",
    ],
    estimatedMinutes: 35,
    questionCount: 30,
    minimumPassScore: 0.80,
    masteryThreshold: 0.90,
    remediationPriority: "critical",
    relatedConceptUnitIds: ["st-t-changes", "qrs", "stemi-localization"],
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-02-10",
    reviewedBy: "ECG Clinical Content Team",
    guidelineVersion: "AHA/ACC STEMI Guidelines 2013/2022 Update",
  },
  {
    id: "electrolyte-ecg",
    label: "Electrolyte ECG Effects",
    stage: "advanced",
    depth: "advanced",
    learnerRoute: "/modules/ecg-advanced",
    lessonSlug: "electrolyte-ecg-patterns",
    marketingRoute: "/advanced-ecg-nursing/electrolyte-ecg-changes",
    teachingRequirements: [
      "pathophysiology",
      "pharmacology_integration",
      "nursing_interventions",
      "differential_reasoning",
      "strip_annotation",
      "telemetry_pitfalls",
    ],
    prerequisites: ["qt-qtc", "rhythm-diagnosis"],
    pitfalls: [
      "Hyperkalemia sine wave: do NOT defibrillate first — administer IV calcium to stabilize the membrane before electrical therapy",
      "Hypokalemia T-U fusion: the measured interval is QU not QT, but torsades risk is real — treat K+ and Mg2+ regardless of measured QTc",
      "Hypocalcemia prolongs the flat ST segment (not the T wave) — hypercalcemia shortens it: the shape, not just the length, identifies the electrolyte",
    ],
    differentials: [
      "Hyperkalemia peaked T vs hyperacute STEMI T: STEMI T-waves are asymmetric and focal; hyperkalemia T-waves are symmetric and diffuse",
      "Hypokalemia QU prolongation vs true drug-induced QTc prolongation: T-wave endpoint identification and concurrent medications",
    ],
    estimatedMinutes: 35,
    questionCount: 28,
    minimumPassScore: 0.80,
    masteryThreshold: 0.90,
    remediationPriority: "critical",
    relatedConceptUnitIds: ["qt-qtc", "qrs", "rhythm-diagnosis"],
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-02-10",
    reviewedBy: "ECG Clinical Content Team",
    guidelineVersion: "AHA/ACC 2019 ECG Standards",
  },
  {
    id: "av-blocks-advanced",
    label: "Advanced AV Block Analysis",
    stage: "advanced",
    depth: "advanced",
    learnerRoute: "/modules/ecg-advanced",
    lessonSlug: "av-block-advanced-analysis",
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
    prerequisites: ["pr-interval", "rhythm-diagnosis"],
    pitfalls: [
      "2:1 block: with only alternating conducted and dropped beats, PR progression cannot be assessed — QRS width is the key discriminator (narrow = nodal, wide = infranodal)",
      "Mobitz II is infranodal: atropine has limited and unpredictable effect; prepare transcutaneous pacing immediately regardless of symptom status",
      "Complete heart block with wide escape: the ventricular escape rate is unreliable and can abruptly stop — never observe without pacing capability at bedside",
    ],
    differentials: [
      "Mobitz I vs nonconducted PACs: Wenckebach shows PR lengthening before the pause; nonconducted PACs show a premature P without PR lengthening",
      "2:1 block Mobitz I vs Mobitz II: narrow QRS suggests nodal (Mobitz I more likely); wide QRS or bundle branch block suggests infranodal (Mobitz II)",
    ],
    estimatedMinutes: 35,
    questionCount: 28,
    minimumPassScore: 0.80,
    masteryThreshold: 0.90,
    remediationPriority: "critical",
    relatedConceptUnitIds: ["pr-interval", "rhythm", "rhythm-diagnosis"],
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-02-10",
    reviewedBy: "ECG Clinical Content Team",
    guidelineVersion: "AHA/ACC 2019 ECG Standards; ACLS 2020",
  },
  {
    id: "bundle-branch-blocks",
    label: "Bundle Branch Blocks",
    stage: "advanced",
    depth: "advanced",
    learnerRoute: "/modules/ecg-advanced",
    lessonSlug: "bundle-branch-block-interpretation",
    marketingRoute: "/advanced-ecg-nursing/critical-care-ecg",
    teachingRequirements: [
      "conduction_mechanism",
      "pathophysiology",
      "nursing_interventions",
      "differential_reasoning",
      "strip_annotation",
      "telemetry_pitfalls",
      "icu_integration",
    ],
    prerequisites: ["qrs", "rhythm-diagnosis"],
    pitfalls: [
      "LBBB: any concordant ST elevation (ST and QRS in same direction) is always abnormal — Sgarbossa criterion, not expected LBBB secondary change",
      "Rate-related aberrancy: BBB morphology appearing at faster rates that resolves as heart rate decreases — not a fixed conduction defect",
      "New RBBB in an inferior or anterior MI patient suggests involvement of the septal perforators supplying the right bundle",
    ],
    differentials: [
      "RBBB vs LBBB vs nonspecific IVCD: direction of primary deflection in V1 is the first discriminator (positive = RBBB-like, negative = LBBB-like)",
      "LBBB with superimposed ischemia vs expected LBBB secondary ST-T: concordant ST elevation vs discordant — Sgarbossa distinguishes them",
    ],
    estimatedMinutes: 35,
    questionCount: 28,
    minimumPassScore: 0.80,
    masteryThreshold: 0.88,
    remediationPriority: "high",
    relatedConceptUnitIds: ["qrs", "st-t-changes", "rhythm-diagnosis"],
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-02-10",
    reviewedBy: "ECG Clinical Content Team",
    guidelineVersion: "AHA/ACC 2019 ECG Standards",
  },
  {
    id: "wpw",
    label: "Wolff-Parkinson-White (Pre-excitation)",
    stage: "advanced",
    depth: "advanced",
    learnerRoute: "/modules/ecg-advanced",
    lessonSlug: "wpw-pre-excitation",
    marketingRoute: "/advanced-ecg-nursing/rhythm-practice",
    teachingRequirements: [
      "conduction_mechanism",
      "pathophysiology",
      "hemodynamic_effects",
      "pharmacology_integration",
      "nursing_interventions",
      "acls_integration",
      "differential_reasoning",
      "strip_annotation",
      "telemetry_pitfalls",
    ],
    prerequisites: ["pr-interval", "rhythm-diagnosis"],
    pitfalls: [
      "AFib in WPW: adenosine, digoxin, verapamil, and diltiazem are CONTRAINDICATED — they block the AV node and force rapid conduction through the accessory pathway",
      "Antidromic AVRT: wide-complex regular tachycardia that is clinically indistinguishable from VT on morphology alone — manage as VT",
      "Intermittent pre-excitation: delta wave absent on some beats; a normal PR on one beat does not exclude WPW",
    ],
    differentials: [
      "WPW resting ECG vs LBBB vs LVH: delta wave slurs the QRS upstroke; LBBB and LVH do not",
      "Antidromic AVRT vs VT: both wide and regular; cannot reliably distinguish without clinical history and electrophysiology",
    ],
    estimatedMinutes: 35,
    questionCount: 25,
    minimumPassScore: 0.80,
    masteryThreshold: 0.88,
    remediationPriority: "critical",
    relatedConceptUnitIds: ["pr-interval", "rhythm", "rhythm-diagnosis"],
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-02-10",
    reviewedBy: "ECG Clinical Content Team",
    guidelineVersion: "AHA/ACC SVT Guidelines 2015; ACLS 2020",
  },
  {
    id: "brugada",
    label: "Brugada Pattern / Channelopathies",
    stage: "advanced",
    depth: "mastery",
    learnerRoute: "/modules/ecg-advanced",
    lessonSlug: "brugada-channelopathy",
    // Brugada is a predominantly adult channelopathy (mean diagnosis age 30–40).
    // Mapped to ACLS rhythms page because VF is the primary clinical consequence.
    marketingRoute: "/advanced-ecg-nursing/acls-rhythms",
    teachingRequirements: [
      "conduction_mechanism",
      "pathophysiology",
      "nursing_interventions",
      "differential_reasoning",
      "strip_annotation",
      "telemetry_pitfalls",
      "acls_integration",
    ],
    prerequisites: ["qrs", "st-t-changes"],
    pitfalls: [
      "Type 1 (coved pattern) is diagnostic; Types 2/3 (saddle-back) require sodium channel blocker provocation testing for diagnosis",
      "Fever unmasks Brugada pattern and can trigger VF — febrile patients with known Brugada require continuous cardiac monitoring and aggressive antipyresis",
      "Brugada pattern vs anterior STEMI vs RBBB with early repolarization: the coved ST shape (descending convex ST) distinguishes Type 1 Brugada",
    ],
    differentials: [
      "Brugada Type 1 vs anterior STEMI with RBBB vs RBBB with early repolarization: ST morphology in V1–V2 is the key — coved vs saddle-back vs J-point notch",
      "Acquired Brugada pattern (drugs, fever, ischemia) vs congenital SCN5A mutation: clinical context and provocation testing distinguish them",
    ],
    estimatedMinutes: 30,
    questionCount: 22,
    minimumPassScore: 0.78,
    masteryThreshold: 0.88,
    remediationPriority: "high",
    relatedConceptUnitIds: ["qrs", "st-t-changes", "rhythm-diagnosis"],
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-02-10",
    reviewedBy: "ECG Clinical Content Team",
    guidelineVersion: "HRS/EHRA/ESC Brugada Syndrome Expert Consensus 2013",
  },
  {
    id: "torsades",
    label: "Torsades de Pointes",
    stage: "advanced",
    depth: "advanced",
    learnerRoute: "/modules/ecg-advanced",
    lessonSlug: "torsades-de-pointes",
    marketingRoute: "/advanced-ecg-nursing/medication-induced-ecg-changes",
    teachingRequirements: [
      "conduction_mechanism",
      "pathophysiology",
      "pharmacology_integration",
      "nursing_interventions",
      "acls_integration",
      "differential_reasoning",
      "strip_annotation",
      "telemetry_pitfalls",
    ],
    prerequisites: ["qt-qtc", "st-t-changes"],
    pitfalls: [
      "IV magnesium 2g is first-line regardless of serum magnesium level — mechanism is direct membrane stabilization, not magnesium replacement",
      "The short-long-short initiating sequence: a PVC causes a pause, then another PVC triggers torsades in the prolonged vulnerable window",
      "Torsades vs polymorphic VT without QT prolongation: the former responds to magnesium; the latter may respond to amiodarone — measuring QTc on the preceding sinus beats determines management",
    ],
    differentials: [
      "Torsades vs polymorphic VT without QT prolongation: QTc on preceding sinus beats is the discriminator",
      "Torsades vs VF: torsades has organized axis-twisting morphology; VF is chaotic without discernible complexes",
    ],
    estimatedMinutes: 30,
    questionCount: 25,
    minimumPassScore: 0.80,
    masteryThreshold: 0.90,
    remediationPriority: "critical",
    relatedConceptUnitIds: ["qt-qtc", "qrs", "rhythm-diagnosis"],
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-02-10",
    reviewedBy: "ECG Clinical Content Team",
    guidelineVersion: "AHA/ACC 2019 ECG Standards; ACLS 2020",
  },
  {
    id: "paced-rhythms",
    label: "Paced Rhythms + Malfunction",
    stage: "advanced",
    depth: "advanced",
    learnerRoute: "/modules/ecg-advanced",
    lessonSlug: "paced-rhythm-malfunction",
    marketingRoute: "/advanced-ecg-nursing/critical-care-ecg",
    teachingRequirements: [
      "conduction_mechanism",
      "pathophysiology",
      "hemodynamic_effects",
      "nursing_interventions",
      "acls_integration",
      "icu_integration",
      "differential_reasoning",
      "strip_annotation",
      "telemetry_pitfalls",
    ],
    prerequisites: ["qrs", "rhythm-diagnosis"],
    pitfalls: [
      "Failure to capture: pacer spikes without following QRS are a hemodynamic emergency in a pacemaker-dependent patient — transcutaneous pacing is the immediate intervention",
      "R-on-T from undersensing: competitive pacing spikes on the T-wave can trigger VF, particularly with concurrent QT prolongation or ischemia",
      "PMT (pacemaker-mediated tachycardia): tachycardia exactly at the programmed upper rate limit — terminates with magnet application, not antiarrhythmics",
    ],
    differentials: [
      "Failure to capture vs failure to sense vs failure to pace: the timing and presence/absence of spikes and captured beats distinguish each malfunction type",
      "PMT vs intrinsic tachycardia vs lead fracture artifact: rate at upper limit, AV relationship, and magnet response",
    ],
    estimatedMinutes: 35,
    questionCount: 28,
    minimumPassScore: 0.80,
    masteryThreshold: 0.90,
    remediationPriority: "critical",
    relatedConceptUnitIds: ["qrs", "rhythm-diagnosis"],
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-02-10",
    reviewedBy: "ECG Clinical Content Team",
    guidelineVersion: "HRS/ACC Pacemaker Follow-up Guidelines 2012",
  },
  {
    id: "axis-deviation",
    label: "Axis Deviation",
    stage: "advanced",
    depth: "intermediate",
    learnerRoute: "/modules/ecg-advanced",
    lessonSlug: "ecg-axis-deviation",
    teachingRequirements: [
      "conduction_mechanism",
      "pathophysiology",
      "differential_reasoning",
      "strip_annotation",
      "telemetry_pitfalls",
    ],
    prerequisites: ["qrs"],
    pitfalls: [
      "Left axis deviation alone does not confirm LAFB — QRS duration, morphology, and clinical context are required",
      "Right axis deviation in a young patient without obvious cause warrants echocardiography to rule out pulmonary hypertension or right heart structural abnormality",
      "Extreme axis (northwest, -90° to ±180°): consider lead reversal as the first explanation before diagnosing a rhythm origin problem",
    ],
    differentials: [
      "LAD: left anterior fascicular block vs inferior MI vs pre-excitation vs emphysema",
      "RAD: RVH vs left posterior fascicular block vs lateral MI vs normal variant in tall thin patients",
    ],
    estimatedMinutes: 25,
    questionCount: 18,
    minimumPassScore: 0.75,
    masteryThreshold: 0.88,
    remediationPriority: "medium",
    relatedConceptUnitIds: ["qrs", "rhythm"],
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-02-10",
    reviewedBy: "ECG Clinical Content Team",
    guidelineVersion: "AHA/ACC 2019 ECG Standards",
  },
  {
    id: "icu-telemetry",
    label: "ICU Telemetry + Critical Care ECG",
    stage: "advanced",
    depth: "mastery",
    learnerRoute: "/modules/ecg-advanced",
    lessonSlug: "icu-telemetry-critical-care",
    marketingRoute: "/advanced-ecg-nursing/critical-care-ecg",
    teachingRequirements: [
      "pathophysiology",
      "hemodynamic_effects",
      "nursing_interventions",
      "acls_integration",
      "icu_integration",
      "differential_reasoning",
      "telemetry_pitfalls",
      "strip_annotation",
      "pharmacology_integration",
      "differential_reasoning",
    ],
    prerequisites: ["bundle-branch-blocks", "paced-rhythms", "st-t-changes"],
    pitfalls: [
      "Motion artifact can perfectly mimic VF — the first assessment is always the patient, not the monitor; confirm loss of pulse before beginning CPR for an apparent VF alarm",
      "PEA: organized electrical activity with no pulse — treatment targets reversible causes (Hs and Ts), not the ECG pattern",
      "Silent ischemia in intubated or sedated patients: continuous ST-segment monitoring is required; symptoms are unreliable in this population",
    ],
    differentials: [
      "Motion artifact vs VF: preserved QRS complexes within the artifact waveform and patient responsiveness confirm artifact",
      "PEA vs organized rhythm with pulse: the pulse check is non-negotiable — the ECG alone never diagnoses PEA",
    ],
    estimatedMinutes: 45,
    questionCount: 35,
    minimumPassScore: 0.80,
    masteryThreshold: 0.90,
    remediationPriority: "critical",
    relatedConceptUnitIds: ["bundle-branch-blocks", "paced-rhythms", "st-t-changes", "rhythm-diagnosis"],
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-02-10",
    reviewedBy: "ECG Clinical Content Team",
    guidelineVersion: "AHA/ACC ICU Monitoring Guidelines; ACLS 2020",
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
 * All marketing routes covered by the ECG curriculum.
 * Used to validate that all curriculum marketing pages exist.
 */
export const ECG_CURRICULUM_MARKETING_ROUTES = [
  ...new Set(
    ECG_FULL_CURRICULUM
      .map((t) => t.marketingRoute)
      .filter((r): r is string => Boolean(r)),
  ),
] as const;

/**
 * Total estimated learning time for the full curriculum in minutes.
 * Used for progress estimation and learner scheduling.
 */
export const ECG_CURRICULUM_TOTAL_MINUTES = ECG_FULL_CURRICULUM.reduce(
  (sum, t) => sum + t.estimatedMinutes,
  0,
);

/**
 * Topics flagged as critical remediation priority.
 * These appear first in the adaptive queue for learners who are weak in ECG.
 */
export const ECG_CRITICAL_TOPICS = ECG_FULL_CURRICULUM.filter(
  (t) => t.remediationPriority === "critical",
);

// ─── Clinical Review Governance Utilities ─────────────────────────────────

/**
 * Returns topics with stale clinical reviews.
 * Stale = reviewedAt is older than ECG_GUIDELINE_STALE_MONTHS months ago.
 * Call in CI to fail the build when stale content is found.
 */
export function getStaleEcgTopics(referenceDate: Date = new Date()): EcgCurriculumTopic[] {
  return ECG_FULL_CURRICULUM.filter((t) => {
    if (!t.reviewedAt) return false;
    const reviewed = new Date(t.reviewedAt);
    const monthsDiff =
      (referenceDate.getFullYear() - reviewed.getFullYear()) * 12 +
      (referenceDate.getMonth() - reviewed.getMonth());
    return monthsDiff > ECG_GUIDELINE_STALE_MONTHS;
  });
}

/**
 * Returns advanced-stage topics that have not been clinician-reviewed.
 * These MUST NOT reach production. Call in CI.
 */
export function getUnreviewedAdvancedEcgTopics(): EcgCurriculumTopic[] {
  return ECG_ADVANCED_CURRICULUM.filter(
    (t) => t.clinicalReviewStatus === "unreviewed" || !t.reviewedAt,
  );
}

/**
 * Returns related curriculum unit IDs for a given topic ID.
 * Used by the adaptive remediation engine to cross-link prerequisite concepts.
 */
export function getRelatedEcgConceptUnitIds(topicId: string): readonly string[] {
  const topic = getEcgCurriculumTopic(topicId);
  return topic?.relatedConceptUnitIds ?? [];
}

/**
 * Returns all topics that cross-reference a given concept unit ID.
 * Used to determine which topics will surface a concept in remediation.
 */
export function getEcgTopicsReferencingConcept(conceptId: string): EcgCurriculumTopic[] {
  return ECG_FULL_CURRICULUM.filter((t) =>
    t.relatedConceptUnitIds?.includes(conceptId) ||
    t.prerequisites.includes(conceptId),
  );
}
