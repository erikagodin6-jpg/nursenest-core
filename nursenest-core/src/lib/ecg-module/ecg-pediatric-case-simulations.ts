/**
 * Pediatric ECG Case Simulations — PALS-oriented hemodynamic deterioration scenarios.
 *
 * These structured cases teach clinical reasoning, not just rhythm identification.
 * Each case has:
 *   - Age-specific presentation (vital signs, physical findings)
 *   - Escalating clinical deterioration with decision points
 *   - Explicit hemodynamic findings (including pulsus paradoxus where appropriate)
 *   - PALS-aligned management pathway
 *   - Common nursing error traps to teach against
 *
 * IMPORTANT: Pulsus paradoxus appears as a hemodynamic finding and clinical context
 * in cases 2 and 6. It is NOT presented as an ECG rhythm, waveform, or rhythm tag.
 * It is assessed by blood pressure measurement and pulse oximetry waveform pattern.
 *
 * Case design principles:
 *   - Each case begins with the "nurse's perspective" — what you see at the bedside
 *   - Rhythm information is one component of assessment, not the only signal
 *   - Each case has 3–4 clinical decision points with correct and incorrect pathways
 *   - Incorrect pathways show realistic consequence (delayed treatment, wrong drug)
 */

import type { PediatricAgeGroup } from "@/lib/ecg-module/ecg-pediatric-rhythm-registry";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type PediatricCaseVitals = {
  heartRate: number;
  respRate: number;
  spO2: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  capRefillSeconds?: number;
  temperature?: number;
  weight_kg?: number;
};

/**
 * A hemodynamic finding that appears as clinical context (not a rhythm).
 * Pulsus paradoxus is the primary example — it is described in BP/pulse-ox terms.
 */
export type HemodynamicFindingContext = {
  findingName: string;
  assessmentDescription: string;
  clinicalSignificance: string;
  /**
   * Explicitly documents that this is NOT an ECG rhythm.
   * Governance: case simulations display this field when teaching pulsus paradoxus
   * to reinforce that it is a hemodynamic finding.
   */
  isNotRhythm: boolean;
};

export type ClinicalDecisionPoint = {
  /** What the nurse sees and must decide. */
  scenario: string;
  options: ReadonlyArray<{
    action: string;
    isCorrect: boolean;
    consequence: string;
  }>;
  teachingPoint: string;
};

export type PediatricCaseSimulation = {
  id: string;
  title: string;
  /** Age and setting for the case. */
  ageGroup: PediatricAgeGroup;
  ageDescription: string;
  setting: string;
  chiefComplaint: string;
  /** Clinical presentation at triage or beginning of the nursing encounter. */
  presentingVitals: PediatricCaseVitals;
  presentingFindings: readonly string[];
  /** The primary rhythm seen on the cardiac monitor. Maps to a pediatric rhythm tag. */
  monitorRhythm: string;
  /**
   * Hemodynamic findings that are part of the clinical picture.
   * Pulsus paradoxus, when present, is documented here — NOT as a rhythm tag.
   */
  hemodynamicFindings: readonly HemodynamicFindingContext[];
  /** The deteriorating clinical course if treatment is delayed or wrong. */
  deteriorationCourse: readonly string[];
  decisionPoints: readonly ClinicalDecisionPoint[];
  /** Correct PALS algorithm pathway for this presentation. */
  palsBranch: string;
  /** Key nursing learning objectives for this case. */
  learningObjectives: readonly string[];
  /**
   * Common nursing errors this case is designed to teach against.
   * These become wrong-answer distractors in the question bank.
   */
  nursingErrorTraps: readonly string[];
  /** Curriculum topic IDs this case reinforces. */
  reinforcesCurriculumIds: readonly string[];
  rpnAccessLevel: "full" | "recognition_only" | "restricted";
  clinicalReviewStatus: "reviewed" | "unreviewed";
  reviewedAt?: string;
  reviewedBy?: string;
};

// ─── Six PALS deterioration case simulations ───────────────────────────────────

export const PEDIATRIC_CASE_SIMULATIONS: readonly PediatricCaseSimulation[] = [

  // ─ Case 1: Infant SVT with poor feeding ──────────────────────────────────────
  {
    id: "case-infant-svt-poor-feeding",
    title: "4-Month-Old with Poor Feeding and Tachypnea",
    ageGroup: "infant",
    ageDescription: "4-month-old male, 6.2 kg",
    setting: "Emergency department — brought in by parents for 'not eating well for 8 hours, seems tired'",
    chiefComplaint: "Poor feeding, fussiness, fast breathing for 8 hours",
    presentingVitals: {
      heartRate: 250,
      respRate: 62,
      spO2: 94,
      bpSystolic: 68,
      bpDiastolic: 45,
      capRefillSeconds: 3.5,
      temperature: 37.1,
      weight_kg: 6.2,
    },
    presentingFindings: [
      "Pale, slightly mottled skin",
      "Weak peripheral pulses",
      "Mild subcostal retractions",
      "Liver edge palpable 3 cm below costal margin (hepatomegaly from venous congestion)",
      "No fever",
      "No murmur auscultated",
    ],
    monitorRhythm: "Pediatric SVT",
    hemodynamicFindings: [
      {
        findingName: "Decreased cardiac output signs",
        assessmentDescription:
          "HR 250, BP 68/45 (low for age), cap refill 3.5 sec, weak peripheral pulses, " +
          "pallor, mild hepatomegaly",
        clinicalSignificance:
          "This infant is in compensated/early decompensated shock from SVT. " +
          "Prolonged SVT (> 12–24 hours in infants) causes dilated cardiomyopathy " +
          "and heart failure. Prompt termination is essential.",
        isNotRhythm: false,
      },
    ],
    deteriorationCourse: [
      "Without treatment: HR remains 250, cardiac output continues to fall",
      "At 2–4 hours: BP drops to 58/30, cap refill 5 sec, obtunded",
      "At 6+ hours untreated: cardiovascular collapse, cardiomyopathy, arrest",
    ],
    decisionPoints: [
      {
        scenario:
          "HR 250 on monitor. You apply cardiac monitor. Rate is constant at 250 with no P-waves identifiable before QRS. Parent says rate has been this way for hours.",
        options: [
          {
            action: "Notify provider immediately, assess perfusion, prepare for adenosine or cardioversion",
            isCorrect: true,
            consequence: "Correct. This is SVT. Prompt identification and provider notification leads to timely treatment.",
          },
          {
            action: "Re-assess vitals in 30 minutes — infant is crying",
            isCorrect: false,
            consequence: "Dangerous delay. HR 250 constant without crying-related variation is NOT sinus tachycardia. This infant needs assessment now.",
          },
          {
            action: "Administer acetaminophen for possible fever-related tachycardia",
            isCorrect: false,
            consequence: "Temperature is 37.1°C — no fever. Fixed HR 250 in a 4-month-old is SVT, not sinus tach. Treating fever delays SVT management.",
          },
        ],
        teachingPoint:
          "SVT in infants: HR > 220 that is fixed (does not vary with state changes) = SVT until proven otherwise. " +
          "Sinus tachycardia in a 4-month-old would be < 220 and would vary with crying/settling.",
      },
      {
        scenario:
          "Provider orders vagal maneuver. For this 4-month-old infant, which vagal maneuver is appropriate?",
        options: [
          {
            action: "Apply ice-water to face (diving reflex maneuver) for 10–15 seconds",
            isCorrect: true,
            consequence: "Correct. Diving reflex (ice to face) is the vagal maneuver of choice for infants. It stimulates the trigeminal nerve and increases vagal tone.",
          },
          {
            action: "Carotid sinus massage",
            isCorrect: false,
            consequence: "Carotid sinus massage is used in older children and adults, not infants. Risk of carotid injury in small infants.",
          },
          {
            action: "Ask the infant to bear down (Valsalva)",
            isCorrect: false,
            consequence: "Valsalva maneuver requires cooperation — not applicable in a 4-month-old infant.",
          },
        ],
        teachingPoint:
          "Vagal maneuver selection by age: Infants → ice-water/diving reflex; Older children → Valsalva; Adolescents → carotid massage or Valsalva.",
      },
      {
        scenario:
          "Vagal maneuver unsuccessful. Provider orders adenosine 0.1 mg/kg IV rapid push. You prepare to administer.",
        options: [
          {
            action: "Give as rapid IV push (bolus) as close to the heart as possible, flush immediately with 5–10 mL NS",
            isCorrect: true,
            consequence: "Correct. Adenosine has a half-life of < 10 seconds. Slow infusion will not reach the SA/AV node in sufficient concentration to terminate SVT.",
          },
          {
            action: "Give as a slow IV infusion over 5 minutes",
            isCorrect: false,
            consequence: "Slow adenosine will be metabolized before reaching the heart. SVT will not terminate. Rapid push is essential.",
          },
        ],
        teachingPoint:
          "Adenosine administration: ALWAYS rapid IV push + immediate flush. Use the most proximal available IV site.",
      },
    ],
    palsBranch: "PALS Tachycardia Algorithm — SVT with hemodynamic compromise → vagal maneuvers → adenosine → synchronized cardioversion 0.5–1 J/kg",
    learningObjectives: [
      "Distinguish SVT from sinus tachycardia in an infant using rate, onset character, and variability",
      "Identify signs of hemodynamic compromise from SVT in an infant",
      "Correctly select and perform vagal maneuver by age group",
      "Administer adenosine correctly: rapid push + flush",
    ],
    nursingErrorTraps: [
      "Assuming HR 250 is fever-related sinus tach without assessing temperature",
      "Using carotid massage in an infant",
      "Giving adenosine as a slow infusion",
      "Delaying notification because the infant was not unconscious",
    ],
    reinforcesCurriculumIds: ["ped-svt-vs-sinus-tach"],
    rpnAccessLevel: "recognition_only",
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-04-15",
    reviewedBy: "Pediatric Emergency Cardiology Content Team",
  },

  // ─ Case 2: Child with severe asthma and pulsus paradoxus ─────────────────────
  {
    id: "case-asthma-pulsus-paradoxus",
    title: "8-Year-Old with Severe Asthma and Pulsus Paradoxus",
    ageGroup: "child",
    ageDescription: "8-year-old female, 26 kg",
    setting: "Emergency department — acute asthma exacerbation, unresponsive to two nebulizer treatments",
    chiefComplaint: "Worsening shortness of breath, wheezing, unable to complete sentences",
    presentingVitals: {
      heartRate: 148,
      respRate: 36,
      spO2: 89,
      bpSystolic: 95,
      bpDiastolic: 62,
      capRefillSeconds: 2,
      temperature: 37.3,
      weight_kg: 26,
    },
    presentingFindings: [
      "Severe intercostal and subcostal retractions",
      "Tripod positioning",
      "Audible wheeze on expiration and inspiration (bilateral)",
      "Prolonged expiratory phase",
      "Nasal flaring",
      "Anxious, agitated",
    ],
    monitorRhythm: "Pediatric sinus tachycardia",
    hemodynamicFindings: [
      {
        findingName: "Pulsus paradoxus",
        assessmentDescription:
          "Blood pressure measurement technique: inflate cuff above systolic, deflate slowly. " +
          "Korotkoff sounds first heard during EXPIRATION at 95 mmHg. " +
          "Sounds first heard during BOTH inspiration and expiration at 72 mmHg. " +
          "Pulsus paradoxus = 95 − 72 = 23 mmHg. Normal is < 10 mmHg.",
        clinicalSignificance:
          "Pulsus paradoxus > 20 mmHg indicates severe airway obstruction. " +
          "The exaggerated inspiratory fall in intrathoracic pressure (due to air trapping) " +
          "reduces left ventricular filling during inspiration, causing a drop in SBP > 10 mmHg. " +
          "This is NOT an ECG rhythm or waveform — it is a hemodynamic pressure finding. " +
          "It indicates that asthma is severe and poorly reversing.",
        isNotRhythm: true,
      },
      {
        findingName: "Pulse oximetry waveform variation",
        assessmentDescription:
          "Pulse oximetry plethysmographic waveform shows visible amplitude reduction on inspiration. " +
          "This is the non-invasive surrogate for pulsus paradoxus at the bedside. " +
          "Not a rhythm — do not code it as an ECG finding.",
        clinicalSignificance:
          "Prominent respiratory variation in pulse ox waveform correlates with pulsus paradoxus. " +
          "Use as a bedside indicator to trigger formal BP measurement.",
        isNotRhythm: true,
      },
    ],
    deteriorationCourse: [
      "Without effective bronchodilation: SpO₂ falls below 85%, tachycardia worsens",
      "Silent chest (no wheeze) → near-fatal asthma — impending respiratory failure",
      "Tiring respiratory muscles → respiratory acidosis → bradycardia → arrest",
      "The cardiac monitor will show sinus tachycardia throughout — the rhythm is a SIGN, not the primary problem",
    ],
    decisionPoints: [
      {
        scenario:
          "SpO₂ is 89%. Monitor shows sinus tachycardia at 148 bpm. You consider whether to focus on the cardiac monitor or the breathing.",
        options: [
          {
            action: "Prioritize respiratory assessment and oxygen delivery — HR is expected in severe asthma",
            isCorrect: true,
            consequence: "Correct. Sinus tachycardia in severe asthma is a physiologic response. The primary problem is airway obstruction and hypoxia. Treat the asthma.",
          },
          {
            action: "Investigate the sinus tachycardia — HR 148 may be SVT",
            isCorrect: false,
            consequence: "HR 148 in an 8-year-old is sinus tachycardia in the context of respiratory distress. This is expected. Spending time on rhythm investigation delays airway intervention.",
          },
        ],
        teachingPoint:
          "In pediatric deterioration: respiratory failure precedes cardiac arrest. " +
          "Tachycardia in a child with respiratory distress is almost always sinus tachycardia — treat the underlying cause.",
      },
      {
        scenario:
          "Provider asks you to assess for pulsus paradoxus. What does this mean and how do you measure it?",
        options: [
          {
            action: "Measure BP by inflating cuff above systolic, deflating slowly — note the difference between when Korotkoff sounds are first heard only in expiration vs in both phases",
            isCorrect: true,
            consequence: "Correct. Pulsus paradoxus > 10 mmHg is abnormal; > 20 mmHg indicates severe obstruction in asthma. This is a blood pressure finding, not an ECG finding.",
          },
          {
            action: "Look at the ECG for waveform changes associated with pulsus paradoxus",
            isCorrect: false,
            consequence: "Pulsus paradoxus is NOT visible on ECG. It is a hemodynamic finding assessed by blood pressure cuff. ECG will show sinus tachycardia — not pulsus paradoxus.",
          },
          {
            action: "Check the rhythm strip for alternating QRS amplitude (electrical alternans)",
            isCorrect: false,
            consequence: "Electrical alternans is associated with cardiac tamponade (pericardial effusion), not asthma-related pulsus paradoxus. These are different clinical scenarios with different findings on ECG.",
          },
        ],
        teachingPoint:
          "Pulsus paradoxus is a BLOOD PRESSURE finding assessed by sphygmomanometry or pulse oximetry waveform — never by ECG. " +
          "Electrical alternans (on ECG) is a separate finding associated with tamponade, not asthma.",
      },
      {
        scenario:
          "Despite bronchodilators, the child becomes quieter. Wheezing decreases. SpO₂ drops to 80%. What does a 'silent chest' indicate?",
        options: [
          {
            action: "Alert the team immediately — silent chest in asthma indicates near-fatal obstruction, not improvement",
            isCorrect: true,
            consequence: "Correct. Decreased wheezing = decreased air entry, not improvement. This child may need intubation or magnesium sulfate. Activate team now.",
          },
          {
            action: "The wheezing resolved — bronchodilators are working",
            isCorrect: false,
            consequence: "Dangerous misinterpretation. Silent chest = so little airflow that wheezing is no longer audible. This is pre-arrest.",
          },
        ],
        teachingPoint:
          "Silent chest in asthma is a red flag, not reassurance. If wheezing disappears but SpO₂ and work of breathing worsen, air entry has stopped.",
      },
    ],
    palsBranch: "Respiratory distress → supplemental O₂, bronchodilators (albuterol, ipratropium), magnesium sulfate for severe asthma → PALS respiratory failure algorithm if deteriorating",
    learningObjectives: [
      "Recognize sinus tachycardia as expected in severe asthma — do not focus rhythm workup over respiratory treatment",
      "Understand pulsus paradoxus as a hemodynamic BP finding, not an ECG or rhythm finding",
      "Recognize that decreased wheezing without SpO₂ improvement = silent chest = pre-arrest",
      "Correctly measure pulsus paradoxus using BP cuff technique",
    ],
    nursingErrorTraps: [
      "Treating sinus tachycardia in asthma instead of the airway",
      "Looking for pulsus paradoxus on the ECG strip",
      "Interpreting silent chest as improvement",
      "Confusing electrical alternans (tamponade ECG finding) with pulsus paradoxus",
    ],
    reinforcesCurriculumIds: ["ped-rate-ranges", "ped-bradycardia-perfusion"],
    rpnAccessLevel: "recognition_only",
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-04-15",
    reviewedBy: "Pediatric Emergency Cardiology Content Team",
  },

  // ─ Case 3: Post-op congenital heart / JET ─────────────────────────────────────
  {
    id: "case-postop-jet",
    title: "Post-op Tetralogy of Fallot Repair — Junctional Ectopic Tachycardia",
    ageGroup: "neonate",
    ageDescription: "6-week-old male, 3.8 kg — post-op day 1 after tetralogy of Fallot repair",
    setting: "Pediatric cardiac ICU, post-operative day 1",
    chiefComplaint: "New tachycardia on continuous telemetry",
    presentingVitals: {
      heartRate: 205,
      respRate: 42,
      spO2: 95,
      bpSystolic: 60,
      bpDiastolic: 38,
      capRefillSeconds: 3,
      temperature: 38.2,
      weight_kg: 3.8,
    },
    presentingFindings: [
      "Tachycardia at 205 bpm that appears near-narrow complex on monitor",
      "AV dissociation subtle — P-waves march at 165 bpm, QRS at 205 bpm",
      "Cardiac output slightly decreased from post-op baseline",
      "Mild chest tube drainage",
      "Low-grade fever 38.2°C (common post-cardiac surgery)",
    ],
    monitorRhythm: "Pediatric junctional rhythm",
    hemodynamicFindings: [
      {
        findingName: "Mild hemodynamic compromise from tachycardia-induced cardiac output reduction",
        assessmentDescription: "BP 60/38 (borderline for post-op neonate), cap refill 3 sec, mild oliguria",
        clinicalSignificance:
          "JET reduces cardiac output due to loss of AV synchrony (P-wave no longer coordinated with QRS). " +
          "Hemodynamic support (fluid, inotropes) may be needed.",
        isNotRhythm: false,
      },
    ],
    deteriorationCourse: [
      "Without intervention: JET persists, cardiac output continues to fall",
      "Increasing inotropes will worsen JET (catecholamines accelerate the junctional rate)",
      "Therapeutic hypothermia (34–35°C core) is the primary treatment",
    ],
    decisionPoints: [
      {
        scenario:
          "Near-narrow complex tachycardia at 205 bpm, post-op day 1. You identify P-waves marching at 165 bpm dissociated from QRS. What is the MOST likely rhythm?",
        options: [
          {
            action: "Junctional ectopic tachycardia (JET) — notify cardiac surgery team immediately",
            isCorrect: true,
            consequence: "Correct. JET is the most common post-op arrhythmia after tetralogy repair. Near-narrow complex + AV dissociation (QRS faster than P-waves) in a post-op cardiac neonate = JET.",
          },
          {
            action: "SVT — prepare adenosine 0.1 mg/kg rapid push",
            isCorrect: false,
            consequence: "Adenosine will NOT terminate JET. JET originates from enhanced automaticity of the His bundle, not re-entry. Administering adenosine causes brief asystole without fixing the problem — and delays the correct management.",
          },
          {
            action: "Sinus tachycardia from post-op fever — administer acetaminophen",
            isCorrect: false,
            consequence: "Fever may worsen JET but is not the primary cause. AV dissociation confirms this is not sinus tach. Management is cooling and reducing catecholamines, not simply treating fever.",
          },
        ],
        teachingPoint:
          "Post-op JET: near-narrow QRS faster than P-wave rate with AV dissociation. Does NOT terminate with adenosine or cardioversion. Primary treatment: therapeutic hypothermia, reduce catecholamines, amiodarone or procainamide per cardiac surgery team.",
      },
      {
        scenario:
          "The intensivist considers increasing dopamine to support BP. As the nurse, what do you know about catecholamines and JET?",
        options: [
          {
            action: "Caution the team: catecholamines accelerate JET rate and worsen cardiac output",
            isCorrect: true,
            consequence: "Correct. Catecholamines accelerate junctional automaticity, making JET faster. Cooling and minimizing stimulation are preferred. Discuss dexmedetomidine or procainamide with the team.",
          },
          {
            action: "Increase dopamine as ordered — hemodynamic support is the priority",
            isCorrect: false,
            consequence: "Increasing dopamine in JET will accelerate the junctional rate, worsening AV dyssynchrony and further reducing cardiac output. Raise this concern with the team.",
          },
        ],
        teachingPoint:
          "JET management principles: (1) therapeutic hypothermia 34–35°C, (2) minimize catecholamines, (3) maximize sedation, (4) antiarrhythmics (amiodarone or procainamide) per team. Temperature management is first-line.",
      },
    ],
    palsBranch: "Post-op JET: cooling protocol, reduce catecholamines, antiarrhythmic — NOT cardioversion/defibrillation pathway",
    learningObjectives: [
      "Identify JET from AV dissociation pattern: QRS rate > P-wave rate",
      "Distinguish JET from SVT in a post-op cardiac patient",
      "Understand why adenosine and cardioversion are ineffective for JET",
      "Know first-line management: cooling, minimize catecholamines",
    ],
    nursingErrorTraps: [
      "Administering adenosine for JET",
      "Increasing catecholamines for hypotension without recognizing this will worsen JET",
      "Confusing JET (post-op normal variant for some surgeries) with life-threatening VT",
    ],
    reinforcesCurriculumIds: ["ped-postop-congenital", "ped-svt-vs-sinus-tach"],
    rpnAccessLevel: "restricted",
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-04-15",
    reviewedBy: "Pediatric Cardiac ICU Content Team",
  },

  // ─ Case 4: Adolescent syncope with long QT risk ───────────────────────────────
  {
    id: "case-adolescent-lqt-syncope",
    title: "14-Year-Old with Exertional Syncope and Long QT",
    ageGroup: "adolescent",
    ageDescription: "14-year-old female, 55 kg — brought to ED after collapsing during swim practice",
    setting: "Emergency department after witnessed syncope during swimming",
    chiefComplaint: "Sudden loss of consciousness during swimming, now awake and confused",
    presentingVitals: {
      heartRate: 78,
      respRate: 16,
      spO2: 98,
      bpSystolic: 112,
      bpDiastolic: 68,
      capRefillSeconds: 1.5,
      temperature: 36.8,
      weight_kg: 55,
    },
    presentingFindings: [
      "Currently awake and anxious but confused about what happened",
      "12-lead ECG shows QTc 520 ms (normal < 460 ms in adolescent females)",
      "No murmur, normal S1/S2",
      "Family history: maternal uncle died suddenly at age 26",
      "No prodrome — collapse was without warning",
      "Currently taking azithromycin for strep throat (prescribed 3 days ago)",
    ],
    monitorRhythm: "Pediatric long QT / torsades risk",
    hemodynamicFindings: [],
    deteriorationCourse: [
      "Active torsades: polymorphic VT with axis twisting, may degenerate to VF",
      "Without IV magnesium and drug discontinuation: recurrent torsades and VF risk",
    ],
    decisionPoints: [
      {
        scenario:
          "QTc 520 ms on 12-lead ECG. Patient is currently in sinus rhythm at 78 bpm. She just had syncope during swimming. What is your priority?",
        options: [
          {
            action: "Notify provider immediately — QTc 520 ms with swimming-triggered syncope = high risk for LQTS type 1 / torsades",
            isCorrect: true,
            consequence: "Correct. QTc 520 ms is markedly prolonged (normal < 460 ms in adolescent female). Swimming-triggered syncope is classic for LQT1. Cardiology emergency consult, continuous monitoring, and medication review are needed.",
          },
          {
            action: "Patient is in sinus rhythm — reassess in 1 hour",
            isCorrect: false,
            consequence: "Dangerous. QTc 520 ms with a prior episode of syncope during swimming represents high imminent torsades/VF risk. Sinus rhythm now does not mean safe.",
          },
        ],
        teachingPoint:
          "QTc > 500 ms = high risk for torsades. Swimming-triggered syncope is the classic presentation of LQT1. Do not wait for another torsades episode to escalate.",
      },
      {
        scenario:
          "You review the medication list and see azithromycin prescribed 3 days ago. What is the significance?",
        options: [
          {
            action: "Azithromycin is a QT-prolonging antibiotic — notify provider to discontinue and review for other QT-prolonging medications",
            isCorrect: true,
            consequence: "Correct. Azithromycin prolongs QTc. In a patient with probable underlying LQTS, it significantly increases torsades risk. Discontinue and assess for drug-induced contribution to QTc prolongation.",
          },
          {
            action: "Complete the azithromycin course — do not stop antibiotics without consulting prescriber",
            isCorrect: false,
            consequence: "In the context of QTc 520 ms and syncope, continuing azithromycin poses active patient safety risk. Discuss with provider immediately.",
          },
        ],
        teachingPoint:
          "QT-prolonging medications in LQTS: azithromycin, fluoroquinolones, ondansetron, many antihistamines, antifungals. Always review medication list when QTc is prolonged.",
      },
    ],
    palsBranch: "PALS Tachycardia/Arrest Algorithm — active torsades → IV magnesium 25–50 mg/kg (max 2g) → defibrillation if torsades degenerates to VF arrest; confirmed LQTS → beta-blocker therapy + ICD evaluation",
    learningObjectives: [
      "Calculate and interpret QTc in an adolescent using age/gender-specific norms",
      "Connect swimming-triggered syncope with LQT1 genotype",
      "Identify QT-prolonging medications in the context of LQTS",
      "Know that IV magnesium is first-line for active pediatric torsades",
    ],
    nursingErrorTraps: [
      "Assuming sinus rhythm now means no risk",
      "Not reviewing medication list for QT-prolonging drugs",
      "Using amiodarone as first-line (worsens QT prolongation) instead of magnesium",
    ],
    reinforcesCurriculumIds: ["ped-lqt-torsades"],
    rpnAccessLevel: "recognition_only",
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-04-15",
    reviewedBy: "Pediatric Emergency Cardiology Content Team",
  },

  // ─ Case 5: Child with hyperkalemia and widening QRS ─────────────────────────
  {
    id: "case-hyperkalemia-widening-qrs",
    title: "7-Year-Old with Tumor Lysis Syndrome and Widening QRS",
    ageGroup: "child",
    ageDescription: "7-year-old male, 24 kg — ALL (acute lymphoblastic leukemia) day 2 of induction chemotherapy",
    setting: "Pediatric oncology inpatient unit — routine telemetry monitoring",
    chiefComplaint: "Nurse notes QRS widening on bedside telemetry during morning monitoring round",
    presentingVitals: {
      heartRate: 88,
      respRate: 22,
      spO2: 97,
      bpSystolic: 95,
      bpDiastolic: 60,
      capRefillSeconds: 2,
      temperature: 37.5,
      weight_kg: 24,
    },
    presentingFindings: [
      "QRS widening from baseline 0.08s to 0.13s",
      "Peaked narrow-base T-waves in precordial leads",
      "Child appears comfortable, no complaints",
      "Last serum K+ 2 hours ago: 6.8 mEq/L (normal 3.5–5.0)",
      "Creatinine rising — developing tumor lysis nephropathy",
    ],
    monitorRhythm: "Pediatric PEA",
    hemodynamicFindings: [],
    deteriorationCourse: [
      "Without calcium: QRS continues to widen → sine-wave → VF → arrest",
      "IV calcium gluconate stabilizes the membrane within minutes",
      "Sine-wave QRS pattern is a pre-arrest emergency",
    ],
    decisionPoints: [
      {
        scenario:
          "Telemetry shows QRS widening from 0.08s to 0.13s and peaked T-waves. Child is comfortable, K+ = 6.8. What is your immediate action?",
        options: [
          {
            action: "Notify provider STAT — hyperkalemia with QRS widening is a cardiac emergency requiring immediate calcium",
            isCorrect: true,
            consequence: "Correct. QRS widening in hyperkalemia indicates dangerous myocardial conduction impairment. IV calcium stabilizes the cardiac membrane. This cannot wait.",
          },
          {
            action: "Child is comfortable — reassess potassium in 4 hours per routine protocol",
            isCorrect: false,
            consequence: "QRS widening on ECG in a patient with K+ 6.8 is a cardiac emergency regardless of symptoms. Hyperkalemia can cause sudden cardiac arrest without warning.",
          },
        ],
        teachingPoint:
          "Hyperkalemia ECG changes in sequence: peaked T-waves → PR prolongation → QRS widening → sine wave → VF. " +
          "QRS widening means imminent cardiac arrest risk. Calcium gluconate is the first treatment, stabilizes the cardiac membrane.",
      },
      {
        scenario:
          "Provider orders calcium gluconate 60 mg/kg IV. Is IV calcium the correct first treatment for hyperkalemia with QRS widening?",
        options: [
          {
            action: "Yes — calcium stabilizes the cardiac membrane immediately; sodium bicarbonate and insulin/glucose treat the potassium shift but take longer",
            isCorrect: true,
            consequence: "Correct. IV calcium is the membrane-stabilizing first step. It does not lower potassium but protects the heart while potassium-lowering treatments take effect.",
          },
          {
            action: "No — give sodium bicarbonate first to shift potassium into cells",
            isCorrect: false,
            consequence: "Sodium bicarbonate is a secondary treatment that shifts K+ intracellularly but takes 15–30 minutes. Cardiac membrane stabilization with calcium is the immediate first priority.",
          },
        ],
        teachingPoint:
          "Hyperkalemia cardiac emergency treatment order: (1) IV calcium (membrane stabilization — immediate effect), (2) insulin + dextrose (K+ shift — 15–30 min), (3) sodium bicarbonate, (4) kayexalate/resonium for elimination.",
      },
    ],
    palsBranch: "PALS Pulseless/Pre-Arrest Algorithm — hyperkalemia with cardiac toxicity (sine-wave QRS = pre-arrest) → IV calcium gluconate first (membrane stabilization) → sodium bicarbonate → insulin/glucose → potassium elimination; if arrest: CPR + defibrillation + epinephrine with concurrent calcium",
    learningObjectives: [
      "Recognize hyperkalemia ECG progression: peaked T → QRS widening → sine wave",
      "Know that IV calcium is first-line for cardiac hyperkalemia toxicity (not potassium elimination)",
      "Identify tumor lysis syndrome as a high-risk scenario for hyperkalemia in pediatric oncology",
    ],
    nursingErrorTraps: [
      "Waiting for symptoms before treating ECG evidence of hyperkalemia",
      "Starting sodium bicarbonate instead of calcium for QRS widening",
      "Not connecting K+ 6.8 with the QRS changes on telemetry",
    ],
    reinforcesCurriculumIds: ["ped-hyperkalemia-ecg"],
    rpnAccessLevel: "recognition_only",
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-04-15",
    reviewedBy: "Pediatric Oncology Cardiology Content Team",
  },

  // ─ Case 6: Hypoxic bradycardia progressing toward arrest ────────────────────
  {
    id: "case-hypoxic-bradycardia-arrest",
    title: "2-Year-Old: Hypoxic Bradycardia Progressing Toward Arrest",
    ageGroup: "toddler",
    ageDescription: "2-year-old male, 12 kg — acute respiratory syncytial virus (RSV) bronchiolitis",
    setting: "Pediatric general ward — escalating respiratory distress",
    chiefComplaint: "Overnight nurse notes increasing work of breathing and now dropping HR",
    presentingVitals: {
      heartRate: 58,
      respRate: 56,
      spO2: 82,
      bpSystolic: 75,
      bpDiastolic: 48,
      capRefillSeconds: 4,
      temperature: 38.1,
      weight_kg: 12,
    },
    presentingFindings: [
      "HR 58 (was 140 two hours ago)",
      "SpO₂ 82% on 2L nasal cannula",
      "Severe intercostal and subcostal retractions",
      "Head bobbing with each breath",
      "Grunting on expiration",
      "Pale and mottled",
      "Decreased responsiveness to name-calling",
    ],
    monitorRhythm: "Pediatric hypoxic bradycardia",
    hemodynamicFindings: [
      {
        findingName: "Impending respiratory arrest with secondary cardiac decompensation",
        assessmentDescription:
          "HR fallen from 140 → 58 over 2 hours. SpO₂ 82%. Mottled skin. Decreased responsiveness. " +
          "Classic pattern of impending pediatric cardiorespiratory arrest.",
        clinicalSignificance:
          "In children, the typical arrest sequence is: respiratory distress → respiratory failure " +
          "→ hypoxic bradycardia → cardiac arrest. This child is at the critical transition point. " +
          "Without immediate airway intervention, arrest will follow.",
        isNotRhythm: false,
      },
    ],
    deteriorationCourse: [
      "HR 58 with SpO₂ 82% — impending arrest",
      "Without BVM ventilation within 2–3 minutes → HR will fall to < 30 → cardiac arrest",
      "If arrest occurs: pediatric resuscitation success rates are significantly lower than with prevention",
    ],
    decisionPoints: [
      {
        scenario:
          "You enter the room and find HR 58, SpO₂ 82%, toddler unresponsive to your voice. What is the FIRST action?",
        options: [
          {
            action: "Call for help and begin bag-valve-mask ventilation with 100% O₂ immediately",
            isCorrect: true,
            consequence: "Correct. Hypoxic bradycardia: ventilate first. Oxygenation will reverse the bradycardia if done within the next 60–90 seconds. Calling for help simultaneously is essential.",
          },
          {
            action: "Give atropine 0.02 mg/kg IV for the bradycardia",
            isCorrect: false,
            consequence: "Atropine treats vagal bradycardia, not hypoxic bradycardia. Giving atropine without ventilating does not address the hypoxia causing the bradycardia.",
          },
          {
            action: "Check the monitor and print a rhythm strip for the provider",
            isCorrect: false,
            consequence: "The clinical picture is clear: the child is hypoxic and bradycardic. Documenting a rhythm strip before ventilating delays the critical intervention.",
          },
        ],
        teachingPoint:
          "Pediatric hypoxic bradycardia: the sequence is respiratory failure → hypoxia → bradycardia → arrest. " +
          "VENTILATE FIRST. If HR does not rise to > 60 within 30 seconds of effective BVM ventilation, begin CPR.",
      },
      {
        scenario:
          "After 30 seconds of BVM with 100% O₂, HR is 55 and SpO₂ is 78%. Child remains unresponsive. What is the next action?",
        options: [
          {
            action: "Begin CPR — HR < 60 with poor perfusion not responding to ventilation = CPR per PALS",
            isCorrect: true,
            consequence: "Correct. PALS 2020: HR < 60 with poor perfusion that does not respond to effective ventilation → CPR. Continue BVM ventilation during CPR.",
          },
          {
            action: "Continue BVM for another 2 minutes before starting CPR",
            isCorrect: false,
            consequence: "30 seconds of effective ventilation is the PALS threshold. If HR does not improve to > 60 after effective ventilation, CPR should begin. Delay risks additional hypoxic injury.",
          },
        ],
        teachingPoint:
          "PALS threshold for CPR: HR < 60 with poor perfusion (not just bradycardia alone) that does not improve after 30 seconds of effective assisted ventilation with O₂.",
      },
    ],
    palsBranch: "PALS Bradycardia/Pre-Arrest Algorithm → HR < 60 with poor perfusion → BVM ventilation with 100% O₂ (primary intervention) → if no improvement in 30 sec: CPR + epinephrine 0.01 mg/kg IV/IO → identify and treat reversible cause (hypoxia first); untreated hypoxic bradycardia progresses to pulseless cardiac arrest within minutes",
    learningObjectives: [
      "Recognize hypoxic bradycardia as the clinical emergency immediately preceding pediatric arrest",
      "Know that ventilation precedes all other interventions for hypoxic bradycardia",
      "Know the PALS CPR threshold: HR < 60 with poor perfusion not responding to 30 seconds effective ventilation",
      "Distinguish hypoxic bradycardia management from vagal bradycardia (atropine) management",
    ],
    nursingErrorTraps: [
      "Giving atropine before ventilating",
      "Waiting for pulse check before beginning BVM",
      "Treating bradycardia pharmacologically without addressing the primary cause (hypoxia)",
      "Normalizing the tachycardia of 140 two hours ago as reassuring — failed to escalate earlier",
    ],
    reinforcesCurriculumIds: ["ped-bradycardia-perfusion", "ped-pals-non-shockable"],
    rpnAccessLevel: "recognition_only",
    clinicalReviewStatus: "reviewed",
    reviewedAt: "2026-04-15",
    reviewedBy: "Pediatric Emergency Cardiology Content Team",
  },
];

// ─── Public API ────────────────────────────────────────────────────────────────

export function getPediatricCaseSimulation(id: string): PediatricCaseSimulation | undefined {
  return PEDIATRIC_CASE_SIMULATIONS.find((c) => c.id === id);
}

/**
 * All cases where pulsus paradoxus appears as a hemodynamic finding context.
 * Used by governance tests to confirm pulsus paradoxus is never classified as a rhythm.
 */
export const CASES_WITH_PULSUS_PARADOXUS: ReadonlyArray<PediatricCaseSimulation> =
  PEDIATRIC_CASE_SIMULATIONS.filter((c) =>
    c.hemodynamicFindings.some(
      (f) => f.findingName.toLowerCase().includes("pulsus"),
    ),
  );

/** All cases involving PALS arrest algorithm pathways. */
export const PALS_ARREST_CASES: ReadonlyArray<PediatricCaseSimulation> = PEDIATRIC_CASE_SIMULATIONS.filter(
  (c) => c.palsBranch.toLowerCase().includes("arrest"),
);
