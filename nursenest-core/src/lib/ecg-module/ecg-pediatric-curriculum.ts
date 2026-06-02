/**
 * ECG Pediatric Curriculum
 *
 * Defines the curriculum lane for pediatric rhythm recognition and PALS-oriented
 * hemodynamic deterioration teaching. Separate from the adult ECG curriculum
 * (ecg-curriculum-config.ts) to prevent mastery score contamination.
 *
 * Tier access:
 *   - RN/NP: full curriculum access (recognition + management rationale)
 *   - RPN/LPN: recognition + escalation only (PALSManagementCategory exposed as
 *     "call for help" language rather than drug/energy dosing)
 *
 * Architecture:
 *   - PediatricEcgCurriculumTopic extends the adult type with pediatric-specific fields
 *   - All topics carry ageGroup coverage, normalRateRange, perfusionStatus, PALSPriority
 *   - Clinical review governance (reviewedAt, reviewedBy) is required for all advanced topics
 *
 * Clinical note: This curriculum teaches RECOGNITION and initial escalation, not
 * PALS provider certification. PALS certification requires a hands-on course.
 */

import type { PediatricAgeGroup } from "@/lib/ecg-module/ecg-pediatric-rhythm-registry";
import type { EcgRemediationPriority } from "@/lib/ecg-module/ecg-curriculum-config";

// ─── Extended topic type ────────────────────────────────────────────────────────

/**
 * Perfusion status at presentation — drives urgency framing in case scenarios.
 * "compensated"   — hemodynamically stable, monitoring required
 * "decompensating"— borderline: pallor, poor cap refill, decreased urine output
 * "unstable"      — shock: altered mental status, absent pulse, obtunded
 */
export type PediatricPerfusionStatus =
  | "compensated"
  | "decompensating"
  | "unstable";

export type PediatricRespiratoryStatus =
  | "normal"
  | "increased_work"
  | "respiratory_distress"
  | "failure_imminent";

/**
 * RPN/LPN access restriction level for a pediatric curriculum topic.
 *   "full"         — RPN sees full content (recognition + management overview)
 *   "recognition_only" — RPN sees only identification + "call rapid response/physician"
 *   "restricted"   — RPN should not be managing this patient without RN supervision
 */
export type PediatricRpnAccessLevel = "full" | "recognition_only" | "restricted";

export type PediatricEcgCurriculumTopic = {
  id: string;
  label: string;
  /** Maps to rhythm tag(s) in PEDIATRIC_ECG_RHYTHM_REGISTRY. May cover multiple rhythms. */
  primaryRhythmTag: string;
  /** Additional rhythm tags taught within this topic. */
  relatedRhythmTags?: readonly string[];
  /** Age groups this topic is clinically relevant for. */
  ageGroups: readonly PediatricAgeGroup[];
  depth: "foundational" | "intermediate" | "advanced";
  /** PALS algorithm priority — drives lesson ordering. */
  palsPriority: "life_threatening" | "urgent" | "monitor_and_report" | "educational";
  /**
   * Hemodynamic red flags learners must recognize in this rhythm.
   * These are the clinical triggers for escalation.
   */
  hemodynamicRedFlags: readonly string[];
  /**
   * Respiratory findings associated with this rhythm or deterioration pattern.
   */
  respiratoryFindings: readonly string[];
  /**
   * Immediate nursing actions in order — framed for bedside nurses, not PALS providers.
   */
  nursingActions: readonly string[];
  /**
   * Parent/caregiver education key points — relevant for outpatient or follow-up contexts.
   */
  parentEducation: readonly string[];
  /**
   * When to escalate: specific observable triggers for calling rapid response or code team.
   */
  escalationCriteria: readonly string[];
  /**
   * Cross-reference to adult ECG topic ID (if applicable).
   * Allows learners who have mastered the adult equivalent to fast-track certain concepts.
   */
  adultCurriculumTopicId?: string;
  /** Prerequisites within the PEDIATRIC curriculum. */
  prerequisites: readonly string[];
  /** High-yield pitfalls for pediatric ECG interpretation. */
  pitfalls: readonly string[];
  /** Explicit differentials to teach. */
  differentials: readonly string[];
  estimatedMinutes: number;
  questionCount: number;
  minimumPassScore: number;
  masteryThreshold: number;
  remediationPriority: EcgRemediationPriority;
  /** Whether PALS drug dosing / energy recommendations are included. RPN sees condensed version. */
  includesDosing: boolean;
  rpnAccessLevel: PediatricRpnAccessLevel;
  /** Clinical review governance. */
  clinicalReviewStatus: "reviewed" | "unreviewed";
  reviewedAt?: string;
  reviewedBy?: string;
  guidelineVersion?: string;
};

// ─── Curriculum topics ─────────────────────────────────────────────────────────

export const PEDIATRIC_ECG_CURRICULUM: readonly PediatricEcgCurriculumTopic[] = [

  // ── Tier 1: Foundational — rate/rhythm recognition in children ───────────────

  {
    id: "ped-rate-ranges",
    label: "Pediatric Normal Rate Ranges by Age Group",
    primaryRhythmTag: "Pediatric sinus tachycardia",
    relatedRhythmTags: ["Pediatric sinus bradycardia", "Respiratory sinus arrhythmia"],
    ageGroups: ["neonate", "infant", "toddler", "child", "adolescent"],
    depth: "foundational",
    palsPriority: "educational",
    hemodynamicRedFlags: [
      "HR > 220 bpm in an infant without obvious cause (fever, pain)",
      "HR < 60 bpm in any child with signs of poor perfusion",
    ],
    respiratoryFindings: ["Tachycardia often coexists with respiratory distress"],
    nursingActions: [
      "Apply cardiac monitor and pulse oximetry",
      "Assess clinical context: fever? crying? pain? respiratory distress?",
      "Document age-corrected HR normal range in assessment",
    ],
    parentEducation: [
      "Children's heart rates are normally faster than adults",
      "A fast heart rate during fever or distress is usually expected",
    ],
    escalationCriteria: [
      "HR > 220 in infant without identifiable cause",
      "HR < 60 with pallor, delayed cap refill, or altered responsiveness",
    ],
    adultCurriculumTopicId: "rate",
    prerequisites: [],
    pitfalls: [
      "Using adult normal ranges for pediatric rhythm interpretation leads to over- and under-treatment",
      "Neonates may have HR 200 during crying — assess clinical context",
    ],
    differentials: [
      "Sinus tachycardia vs SVT: rate threshold, onset character, clinical context",
      "Sinus bradycardia vs hypoxic bradycardia: SpO₂ and respiratory assessment",
    ],
    estimatedMinutes: 20,
    questionCount: 15,
    minimumPassScore: 0.75,
    masteryThreshold: 0.88,
    remediationPriority: "high",
    includesDosing: false,
    rpnAccessLevel: "full",
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-04-01",
    reviewedBy: "Pediatric Cardiology Content Team",
    guidelineVersion: "AHA PALS 2020; Harriet Lane Handbook 22nd ed",
  },

  {
    id: "ped-rsa",
    label: "Respiratory Sinus Arrhythmia — Normal Pediatric Variant",
    primaryRhythmTag: "Respiratory sinus arrhythmia",
    ageGroups: ["infant", "toddler", "child", "adolescent"],
    depth: "foundational",
    palsPriority: "educational",
    hemodynamicRedFlags: [],
    respiratoryFindings: ["Rate variation correlates with respiratory cycle"],
    nursingActions: [
      "Observe respiratory effort during monitor review",
      "Confirm P-wave morphology is consistently sinus throughout",
      "Reassure family — RSA is a normal finding",
    ],
    parentEducation: [
      "Your child's heart speeding up slightly when breathing in is normal and healthy",
      "It means the heart and nervous system are working well together",
    ],
    escalationCriteria: [
      "If RSA is absent in a previously present child: investigate autonomic dysfunction",
    ],
    adultCurriculumTopicId: "rhythm",
    prerequisites: ["ped-rate-ranges"],
    pitfalls: [
      "RSA can be mistaken for atrial arrhythmia if respiratory pattern not observed",
      "Absent RSA in critically ill children may indicate severe physiologic stress",
    ],
    differentials: [
      "RSA vs PAC: RSA shows consistent sinus P-wave; PAC shows premature P with different morphology",
      "RSA vs second-degree AV block: RSA rate varies continuously; AV block shows dropped beats",
    ],
    estimatedMinutes: 15,
    questionCount: 10,
    minimumPassScore: 0.75,
    masteryThreshold: 0.88,
    remediationPriority: "medium",
    includesDosing: false,
    rpnAccessLevel: "full",
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-04-01",
    reviewedBy: "Pediatric Cardiology Content Team",
    guidelineVersion: "AHA PALS 2020",
  },

  // ── Tier 2: Intermediate — SVT vs sinus tachycardia (PALS-critical) ─────────

  {
    id: "ped-svt-vs-sinus-tach",
    label: "SVT vs Sinus Tachycardia in Infants and Children",
    primaryRhythmTag: "Pediatric SVT",
    relatedRhythmTags: ["Pediatric sinus tachycardia"],
    ageGroups: ["neonate", "infant", "toddler", "child"],
    depth: "intermediate",
    palsPriority: "life_threatening",
    hemodynamicRedFlags: [
      "Pallor, grayish color in neonates/infants with SVT",
      "Poor feeding, lethargy in infant with heart rate > 220",
      "Weak or absent peripheral pulses despite high rate",
      "Decreased urine output, delayed capillary refill > 3 seconds",
      "Altered mental status, agitation, or decreased responsiveness",
    ],
    respiratoryFindings: [
      "Tachypnea may accompany SVT due to decreased cardiac output",
      "Grunting or increased work of breathing in infants",
    ],
    nursingActions: [
      "Apply cardiac monitor and pulse oximetry immediately",
      "Assess perfusion status: skin color, cap refill, pulses, mental status",
      "Notify provider immediately — distinguish adequate vs poor perfusion",
      "Establish IV/IO access while team assesses",
      "Position supine, provide supplemental O₂",
      "If adequate perfusion: prepare for vagal maneuvers per provider order",
      "If poor perfusion: prepare for synchronized cardioversion (0.5–1 J/kg)",
      "Document rhythm strip, onset time, and associated symptoms",
    ],
    parentEducation: [
      "SVT can feel like a very fast fluttering or pounding in the chest",
      "The treatment is very effective and the heart usually returns to normal quickly",
      "Vagal maneuvers (ice, Valsalva) are tried first if the child is not in distress",
    ],
    escalationCriteria: [
      "HR > 220 in infant with poor perfusion → immediate synchronized cardioversion",
      "Adenosine ineffective after two doses → escalate to cardiologist",
      "HR > 220 with deteriorating consciousness → activate code team",
    ],
    adultCurriculumTopicId: "rhythm-diagnosis",
    prerequisites: ["ped-rate-ranges"],
    pitfalls: [
      "SVT rate in infants (220–300) is narrow enough that it can be misidentified as sinus tach",
      "Ice-to-face vagal maneuver applies to infants — carotid massage is for adolescents only",
      "Adenosine must be given as rapid IV push (not infusion) closest to the heart",
      "Synchronized cardioversion requires sedation in a conscious child whenever possible",
      "WPW-related SVT: after termination, adenosine transiently blocks AV node and can reveal delta waves",
    ],
    differentials: [
      "Pediatric SVT vs sinus tachycardia: rate threshold by age, onset character, variability",
      "SVT vs VT with aberrancy: QRS morphology, clinical context, response to adenosine",
      "SVT vs junctional ectopic tachycardia (post-op): JET has subtle AV dissociation, does not respond to adenosine",
    ],
    estimatedMinutes: 35,
    questionCount: 25,
    minimumPassScore: 0.80,
    masteryThreshold: 0.90,
    remediationPriority: "critical",
    includesDosing: true,
    rpnAccessLevel: "recognition_only",
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-04-01",
    reviewedBy: "Pediatric Cardiology Content Team",
    guidelineVersion: "AHA PALS 2020",
  },

  // ── Tier 2: Bradycardia with poor perfusion ──────────────────────────────────

  {
    id: "ped-bradycardia-perfusion",
    label: "Bradycardia with Poor Perfusion and Hypoxic Bradycardia",
    primaryRhythmTag: "Pediatric hypoxic bradycardia",
    relatedRhythmTags: ["Pediatric sinus bradycardia", "Pediatric complete heart block"],
    ageGroups: ["neonate", "infant", "toddler", "child"],
    depth: "intermediate",
    palsPriority: "life_threatening",
    hemodynamicRedFlags: [
      "HR < 60 with absent or weak pulses",
      "Cyanosis or grayish skin color",
      "Decreased consciousness or unresponsiveness",
      "Slow or agonal breathing",
    ],
    respiratoryFindings: [
      "Hypoxic bradycardia: SpO₂ < 90%, bradypnea or apnea",
      "Increased work of breathing preceding cardiac slowing",
      "Chin-bobbing or see-saw breathing in infants",
    ],
    nursingActions: [
      "VENTILATE FIRST — bag-valve-mask with 100% O₂ immediately",
      "Apply monitor and pulse oximetry while ventilating",
      "Check pulse simultaneously with ventilation",
      "If HR < 60 with poor perfusion after 30 sec effective ventilation → begin CPR",
      "Establish IV/IO access for epinephrine if CPR required",
      "Notify provider and activate code response",
    ],
    parentEducation: [],
    escalationCriteria: [
      "HR < 60 in any age with poor perfusion not responding to 30 seconds of effective ventilation",
      "Apnea or agonal breathing at any heart rate",
      "Pulseless electrical activity → immediate CPR",
    ],
    adultCurriculumTopicId: "rhythm-diagnosis",
    prerequisites: ["ped-rate-ranges"],
    pitfalls: [
      "Atropine treats vagal bradycardia, NOT hypoxic bradycardia — giving atropine first delays CPR",
      "In children, respiratory failure precedes cardiac arrest — airway intervention is primary",
      "Pulse check in infants: brachial pulse (not carotid or radial)",
    ],
    differentials: [
      "Hypoxic bradycardia vs primary conduction disease: SpO₂, respiratory assessment, tempo of onset",
      "Hypoxic bradycardia vs vagal bradycardia: vagal is transient (post-intubation, defecation) with preserved SpO₂",
      "Complete heart block vs bradycardia from hypoxia: CHB shows AV dissociation; hypoxic brady shows normal P-QRS relationship",
    ],
    estimatedMinutes: 30,
    questionCount: 22,
    minimumPassScore: 0.80,
    masteryThreshold: 0.90,
    remediationPriority: "critical",
    includesDosing: true,
    rpnAccessLevel: "recognition_only",
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-04-01",
    reviewedBy: "Pediatric Cardiology Content Team",
    guidelineVersion: "AHA PALS 2020",
  },

  // ── Tier 2: PALS arrest rhythms ──────────────────────────────────────────────

  {
    id: "ped-pals-shockable",
    label: "PALS Shockable Rhythms — VF and Pulseless VT",
    primaryRhythmTag: "Pediatric VF",
    relatedRhythmTags: ["Pediatric VT"],
    ageGroups: ["neonate", "infant", "toddler", "child", "adolescent"],
    depth: "intermediate",
    palsPriority: "life_threatening",
    hemodynamicRedFlags: [
      "Pulseless state",
      "Unresponsiveness",
      "Absent breathing",
    ],
    respiratoryFindings: ["Absent or agonal breathing in arrest"],
    nursingActions: [
      "Confirm pulselessness — do not defibrillate based on monitor alone",
      "Begin high-quality CPR immediately",
      "Apply defibrillator pads: use infant paddles/pads for < 10 kg; adult pads for > 10 kg with minimum 3 cm separation",
      "Deliver defibrillation shock: 2 J/kg (first shock), increase to 4 J/kg if needed",
      "Resume CPR immediately after shock — do not pause to check rhythm",
      "Epinephrine 0.01 mg/kg IV/IO after 2nd or 3rd cycle",
      "Anticipate antiarrhythmic orders: amiodarone or lidocaine for refractory VF/VT",
    ],
    parentEducation: [],
    escalationCriteria: ["Pulselessness with VF or pVT → immediate defibrillation"],
    adultCurriculumTopicId: "rhythm-diagnosis",
    prerequisites: ["ped-rate-ranges"],
    pitfalls: [
      "Pediatric defibrillation energy: 2 J/kg initial (not 1 J/kg as in some older guidelines)",
      "Use pediatric-specific pads or paddles for infants — adult pads can bridge if peds unavailable with separation",
      "Resume CPR immediately after shock — do not pause for rhythm check",
      "VF/pVT is LESS common in children than in adults; primary cause is usually hypoxic respiratory failure",
    ],
    differentials: [
      "VF vs artifact: patient responsiveness and pulse check differentiate",
      "Pulseless VT vs VT with pulse: management diverges completely — pulse check is non-negotiable",
      "VF vs torsades: torsades has organized twisting morphology before decompensating; both treated with defibrillation",
    ],
    estimatedMinutes: 30,
    questionCount: 22,
    minimumPassScore: 0.80,
    masteryThreshold: 0.90,
    remediationPriority: "critical",
    includesDosing: true,
    rpnAccessLevel: "recognition_only",
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-04-01",
    reviewedBy: "Pediatric Cardiology Content Team",
    guidelineVersion: "AHA PALS 2020",
  },

  {
    id: "ped-pals-non-shockable",
    label: "PALS Non-Shockable Rhythms — Asystole and PEA",
    primaryRhythmTag: "Pediatric asystole",
    relatedRhythmTags: ["Pediatric PEA"],
    ageGroups: ["neonate", "infant", "toddler", "child", "adolescent"],
    depth: "intermediate",
    palsPriority: "life_threatening",
    hemodynamicRedFlags: ["Pulselessness", "Unresponsiveness"],
    respiratoryFindings: ["Absent or agonal breathing"],
    nursingActions: [
      "Confirm pulselessness AND confirm rhythm in two leads before declaring asystole",
      "Begin CPR immediately",
      "Establish IV/IO — epinephrine 0.01 mg/kg q3–5min",
      "Do NOT defibrillate asystole",
      "For PEA: aggressive 6H/5T reversible cause search while maintaining CPR",
      "Anticipate team calling for ECHO to evaluate tamponade or tension pneumothorax",
    ],
    parentEducation: [],
    escalationCriteria: ["Any pulseless rhythm → immediate CPR"],
    adultCurriculumTopicId: "rhythm-diagnosis",
    prerequisites: ["ped-pals-shockable"],
    pitfalls: [
      "Asystole: always confirm in two leads — fine VF can mimic asystole and IS shockable",
      "PEA is diagnosed by PULSE CHECK, not ECG alone",
      "Atropine is NOT indicated for asystole in PALS 2020",
      "Hypoxia is the most common reversible cause of pediatric PEA",
    ],
    differentials: [
      "Asystole vs fine VF: lead confirmation; fine VF is shockable",
      "PEA vs severe shock with palpable pulse: the pulse check determines algorithm",
      "PEA vs agonal rhythm with loss of pulse: agonal rhythm transitions to PEA/asystole",
    ],
    estimatedMinutes: 28,
    questionCount: 20,
    minimumPassScore: 0.80,
    masteryThreshold: 0.90,
    remediationPriority: "critical",
    includesDosing: true,
    rpnAccessLevel: "recognition_only",
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-04-01",
    reviewedBy: "Pediatric Cardiology Content Team",
    guidelineVersion: "AHA PALS 2020",
  },

  // ── Tier 3: Advanced — electroyte, congenital, LQTS ─────────────────────────

  {
    id: "ped-hyperkalemia-ecg",
    label: "Pediatric Hyperkalemia ECG Changes",
    primaryRhythmTag: "Pediatric PEA",
    relatedRhythmTags: ["Pediatric VF"],
    ageGroups: ["neonate", "infant", "child", "adolescent"],
    depth: "advanced",
    palsPriority: "urgent",
    hemodynamicRedFlags: [
      "QRS widening on telemetry in a child with renal disease or tumor lysis",
      "Peaked narrow-base T-waves in a child receiving blood transfusion",
      "Sine-wave QRS pattern — pre-arrest state",
    ],
    respiratoryFindings: [],
    nursingActions: [
      "Identify at-risk patients: renal failure, rhabdomyolysis, tumor lysis, large blood transfusion",
      "Notify provider immediately — check serum potassium stat",
      "If sine-wave QRS or hemodynamic instability: IV calcium (calcium gluconate 60–100 mg/kg IV) BEFORE electrical therapy",
      "Prepare for sodium bicarbonate and insulin/glucose per provider order",
      "Monitor rhythm continuously",
    ],
    parentEducation: [
      "Certain kidney conditions or treatments can affect how the heart's electrical signals work",
    ],
    escalationCriteria: [
      "Any evidence of QRS widening > 20% from baseline in at-risk patient",
      "Sine-wave QRS pattern → treat as pre-arrest",
    ],
    adultCurriculumTopicId: "electrolyte-ecg",
    prerequisites: ["ped-rate-ranges", "ped-pals-non-shockable"],
    pitfalls: [
      "Hyperkalemia sine wave: calcium FIRST before electrical therapy — same rule as adults",
      "Neonates are particularly vulnerable to hyperkalemia during large blood transfusions",
      "Tumor lysis syndrome produces acute hyperkalemia — anticipate ECG changes",
    ],
    differentials: [
      "Hyperkalemia peaked T vs hyperacute STEMI T: hyperkalemia T-waves are diffuse and symmetric",
      "Hyperkalemia VF vs primary VF: treat with calcium before defibrillation if hyperkalemia is suspected",
    ],
    estimatedMinutes: 25,
    questionCount: 18,
    minimumPassScore: 0.78,
    masteryThreshold: 0.88,
    remediationPriority: "critical",
    includesDosing: true,
    rpnAccessLevel: "recognition_only",
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-04-01",
    reviewedBy: "Pediatric Cardiology Content Team",
    guidelineVersion: "AHA PALS 2020; PALS Provider Manual 6th ed",
  },

  {
    id: "ped-lqt-torsades",
    label: "Pediatric Long QT Syndrome and Torsades Risk",
    primaryRhythmTag: "Pediatric long QT / torsades risk",
    ageGroups: ["neonate", "infant", "child", "adolescent"],
    depth: "advanced",
    palsPriority: "life_threatening",
    hemodynamicRedFlags: [
      "Syncope during exercise or emotional stress (LQT1: swimming, LQT2: startle)",
      "Seizure-like episodes without neurological cause in adolescents",
      "Family history of sudden unexplained death in a young person",
    ],
    respiratoryFindings: [],
    nursingActions: [
      "Measure QTc on ECG using age-appropriate normal values (QTc > 450 ms boys, > 460 ms girls is prolonged)",
      "Review medication list for QT-prolonging agents",
      "Notify provider immediately for symptomatic LQTS or QTc > 500 ms",
      "IV magnesium 25–50 mg/kg (max 2 g) for active torsades",
      "Prepare for defibrillation if torsades degenerates to VF",
      "Avoid QT-prolonging medications",
    ],
    parentEducation: [
      "Avoid QT-prolonging medications (azithromycin, ondansetron, antihistamines) without cardiology clearance",
      "Emergency action plan: if your child loses consciousness — call 911, begin CPR if unresponsive",
      "Medical alert bracelet for children with confirmed LQTS",
    ],
    escalationCriteria: [
      "QTc > 500 ms or any episode of syncope → cardiology referral",
      "Active torsades → magnesium IV + defibrillation readiness",
    ],
    adultCurriculumTopicId: "torsades",
    prerequisites: ["ped-rate-ranges"],
    pitfalls: [
      "QTc normal values differ from adults: use pediatric age-adjusted tables",
      "Many common medications used in children can prolong QTc (azithromycin, ondansetron)",
      "LQTS type 1: events with swimming or exercise; type 2: startle/auditory triggers; type 3: sleep",
    ],
    differentials: [
      "Torsades vs monomorphic VT: QTc on preceding sinus beats determines management",
      "LQTS vs seizure disorder: EEG vs ECG; both can present with collapse",
      "Drug-induced LQTS vs congenital: medication review + family history",
    ],
    estimatedMinutes: 30,
    questionCount: 20,
    minimumPassScore: 0.80,
    masteryThreshold: 0.90,
    remediationPriority: "critical",
    includesDosing: true,
    rpnAccessLevel: "recognition_only",
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-04-01",
    reviewedBy: "Pediatric Cardiology Content Team",
    guidelineVersion: "HRS/EHRA LQTS Expert Consensus 2013; AHA PALS 2020",
  },

  {
    id: "ped-wpw",
    label: "Pediatric WPW and Pre-excitation",
    primaryRhythmTag: "Pediatric WPW / pre-excitation",
    relatedRhythmTags: ["Pediatric SVT"],
    ageGroups: ["neonate", "infant", "toddler", "child", "adolescent"],
    depth: "advanced",
    palsPriority: "urgent",
    hemodynamicRedFlags: [
      "SVT rate > 240 in infant that does not terminate with adenosine",
      "AFib with very rapid ventricular response (> 200) in an adolescent",
    ],
    respiratoryFindings: [],
    nursingActions: [
      "Identify short PR interval and delta wave on baseline 12-lead ECG",
      "SVT with WPW and adequate perfusion: vagal maneuvers, then adenosine (same as SVT)",
      "AFib with WPW (pre-excited AF): do NOT give AV-nodal blocking agents for sustained rapid ventricular response — notify cardiologist immediately, prepare for cardioversion",
      "Document all ECG strips for cardiology review",
    ],
    parentEducation: [
      "WPW often resolves or becomes less symptomatic as children grow",
      "An electrophysiology study and ablation may be recommended for symptomatic children",
    ],
    escalationCriteria: [
      "AFib with pre-excited response > 200 bpm → cardioversion + cardiology emergency consult",
      "SVT not terminating with two doses of adenosine → escalate to cardiologist",
    ],
    adultCurriculumTopicId: "wpw",
    prerequisites: ["ped-svt-vs-sinus-tach"],
    pitfalls: [
      "Delta waves may be subtle in neonates and infants — short PR is the first clue",
      "About 40% of WPW in infants resolves spontaneously by school age",
      "Adenosine terminates most WPW SVT; it should NOT be used for sustained rapid AFib with WPW",
    ],
    differentials: [
      "WPW delta wave vs LBBB: delta slurs QRS upstroke; LBBB creates broad notched R",
      "Pre-excited AFib vs VT: pre-excited AF is irregular; VT is usually regular",
    ],
    estimatedMinutes: 28,
    questionCount: 18,
    minimumPassScore: 0.78,
    masteryThreshold: 0.88,
    remediationPriority: "high",
    includesDosing: true,
    rpnAccessLevel: "recognition_only",
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-04-01",
    reviewedBy: "Pediatric Cardiology Content Team",
    guidelineVersion: "AHA PALS 2020; HRS WPW Consensus 2012",
  },

  {
    id: "ped-postop-congenital",
    label: "Post-operative Congenital Heart Telemetry Patterns",
    primaryRhythmTag: "Post-op congenital heart telemetry pattern",
    relatedRhythmTags: [
      "Pediatric junctional rhythm",
      "Pediatric complete heart block",
      "Pediatric second-degree AV block",
    ],
    ageGroups: ["neonate", "infant", "toddler", "child"],
    depth: "advanced",
    palsPriority: "urgent",
    hemodynamicRedFlags: [
      "New onset junctional rate > 180 post-op → JET likely",
      "New AV block pattern on post-op day 1 → early CHB risk",
      "Failure to pace in pacemaker-dependent post-op patient",
    ],
    respiratoryFindings: [],
    nursingActions: [
      "Document baseline post-op rhythm strip at ICU admission",
      "Report ANY new rhythm change to cardiac surgery team immediately",
      "For JET: notify cardiac surgery team, avoid increasing catecholamines, prepare for cooling protocol",
      "For new AV block: confirm pacemaker lead position and thresholds",
      "For pacemaker-dependent patient: ensure capture threshold verified before any transport",
    ],
    parentEducation: [
      "Heart rhythm monitoring after surgery is continuous to detect any changes early",
      "Heart block after surgery often resolves in the first 7–10 days",
    ],
    escalationCriteria: [
      "Pacing spike without capture in pacemaker-dependent patient → URGENT call to cardiac surgery",
      "JET rate > 200 with hemodynamic compromise → emergency cardiology",
      "New Mobitz II or CHB post-op → immediate pacing consultation",
    ],
    adultCurriculumTopicId: "paced-rhythms",
    prerequisites: ["ped-svt-vs-sinus-tach", "ped-bradycardia-perfusion"],
    pitfalls: [
      "JET does NOT respond to synchronized cardioversion — adenosine will not terminate it",
      "Post-Fontan patients are at lifelong risk for atrial flutter — often at 2:1 with rate ~150",
      "Post-op CHB lasting > 7 days is unlikely to resolve without permanent pacemaker implantation",
    ],
    differentials: [
      "JET vs SVT: JET shows subtle AV dissociation, does not terminate with adenosine",
      "Post-op AV block vs vagal bradycardia: conduction block has fixed PR changes; vagal is transient",
    ],
    estimatedMinutes: 35,
    questionCount: 20,
    minimumPassScore: 0.80,
    masteryThreshold: 0.88,
    remediationPriority: "critical",
    includesDosing: false,
    rpnAccessLevel: "restricted",
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-04-01",
    reviewedBy: "Pediatric Cardiology Content Team",
    guidelineVersion: "AHA PALS 2020; PCICS Post-op Monitoring Guidelines",
  },
];

// ─── Public API ────────────────────────────────────────────────────────────────

export function getPediatricCurriculumTopic(
  id: string,
): PediatricEcgCurriculumTopic | undefined {
  return PEDIATRIC_ECG_CURRICULUM.find((t) => t.id === id);
}

export const PEDIATRIC_CRITICAL_TOPICS = PEDIATRIC_ECG_CURRICULUM.filter(
  (t) => t.remediationPriority === "critical",
);

export const PALS_LIFE_THREATENING_TOPICS = PEDIATRIC_ECG_CURRICULUM.filter(
  (t) => t.palsPriority === "life_threatening",
);

export const RPN_RESTRICTED_TOPICS = PEDIATRIC_ECG_CURRICULUM.filter(
  (t) => t.rpnAccessLevel === "restricted",
);

/** All pediatric curriculum topics that include drug dosing. RPN receives condensed version. */
export const DOSING_TOPICS = PEDIATRIC_ECG_CURRICULUM.filter((t) => t.includesDosing);

/**
 * Unreviewed advanced topics. CI gate: must be empty before pediatric lane ships.
 */
export function getUnreviewedPediatricAdvancedTopics(): PediatricEcgCurriculumTopic[] {
  return PEDIATRIC_ECG_CURRICULUM.filter(
    (t) => t.depth === "advanced" && t.clinicalReviewStatus !== "reviewed",
  );
}
