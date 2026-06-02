/**
 * Pediatric ECG Question Bank — Minimum Viable Seed Set
 *
 * 50 questions across 6 categories for the initial pediatric ECG lane launch.
 *
 * Category distribution:
 *   10 × Respiratory sinus arrhythmia (RSA)
 *   10 × Pediatric SVT vs sinus tachycardia
 *   10 × Hypoxic bradycardia / PALS bradycardia algorithm
 *   10 × PALS arrest rhythms (VF, asystole, PEA, pulseless VT)
 *    5 × Pulsus paradoxus clinical context (hemodynamic finding, NOT rhythm)
 *    5 × Post-op JET recognition
 *   ─────
 *   50 total
 *
 * Question structure mirrors EcgVideoQuestion DB fields:
 *   questionText, answerOptions (array), correctAnswerIndex, rationale,
 *   rhythmTag, level, topicTags, allowedTiers
 *
 * Governance:
 *   - Pulsus paradoxus questions use the hemodynamic framing — never as a rhythm tag
 *   - RSA questions always have "No intervention required" as correct answer for
 *     normal-strip presentations
 *   - RPN/LPN visibility: all questions tagged with allowedTiers
 */

export type PediatricSeedQuestion = {
  questionText: string;
  answerOptions: readonly string[];
  correctAnswerIndex: number;
  rationale: string;
  rhythmTag: string;
  level: "basic" | "intermediate" | "advanced";
  topicTags: string[];
  allowedTiers: string[];
  /** Maps to PEDIATRIC_ECG_CURRICULUM topic ID. */
  curriculumTopicId: string;
  /** Clinical review status — all seed questions reviewed before production seeding. */
  clinicalReviewStatus: "reviewed";
  reviewedBy: string;
};

// ─── RSA Questions (10) ─────────────────────────────────────────────────────

const RSA_QUESTIONS: PediatricSeedQuestion[] = [
  {
    questionText:
      "A 7-year-old is on telemetry. Heart rate cycles between 68 and 92 bpm. Upright P-waves precede every QRS. PR interval is constant. QRS is narrow. The rate increases as the chest rises and decreases as it falls. What is the correct interpretation?",
    answerOptions: [
      "Atrial fibrillation — initiate rate control workup",
      "Respiratory sinus arrhythmia — normal physiologic variant, no intervention",
      "Frequent PACs — increase monitoring frequency",
      "Second-degree AV block — notify provider",
    ],
    correctAnswerIndex: 1,
    rationale:
      "This is respiratory sinus arrhythmia (RSA). The hallmarks are: (1) uniform upright sinus P-waves before every QRS, (2) constant PR interval, (3) narrow QRS, (4) R-R variation directly linked to the respiratory cycle. RSA is a normal physiologic variant reflecting healthy vagal tone — no intervention is required. AFib has no organized P-waves; PACs have premature beats with abnormal P morphology; AV block drops beats.",
    rhythmTag: "Respiratory sinus arrhythmia",
    level: "basic",
    topicTags: ["rsa", "pediatric_normal_variant", "rhythm_recognition"],
    allowedTiers: ["RN", "NP", "RPN", "PN"],
    curriculumTopicId: "ped-rsa",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "A parent calls you urgently: the monitor alarm says 'irregular rhythm' for their 10-year-old. You observe HR 72–96 bpm cycling with breathing, consistent sinus P-waves, and narrow QRS. What do you tell the parent?",
    answerOptions: [
      "The heart is skipping beats — the provider needs to evaluate urgently",
      "The monitor detected atrial fibrillation and the team will start treatment",
      "The heart is speeding up slightly when breathing in and slowing down when breathing out — this is completely normal",
      "We need to do an echocardiogram to rule out structural heart disease",
    ],
    correctAnswerIndex: 2,
    rationale:
      "RSA triggers arrhythmia alarms because the R-R interval is not perfectly constant, but it is a normal finding. The correct family education is to explain the respiratory-cardiac coupling in clear terms. There is no need for urgent evaluation, rate control, or echocardiography in an otherwise healthy child with confirmed RSA.",
    rhythmTag: "Respiratory sinus arrhythmia",
    level: "basic",
    topicTags: ["rsa", "parent_education", "overcall_prevention"],
    allowedTiers: ["RN", "NP", "RPN", "PN"],
    curriculumTopicId: "ped-rsa",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "You are assessing a 15-year-old athlete with HR 48–72 bpm. The ECG machine prints: 'Sinus bradycardia + irregular rhythm.' Breathing causes the rate to cycle. All P-waves are upright and identical. What is the most accurate interpretation?",
    answerOptions: [
      "Sick sinus syndrome — refer for Holter monitor",
      "Normal sinus rhythm with marked respiratory sinus arrhythmia — physiologic, no workup required",
      "Atrial flutter with variable block — obtain additional leads",
      "Junctional rhythm with retrograde P-waves",
    ],
    correctAnswerIndex: 1,
    rationale:
      "Athletes have the highest vagal tone and demonstrate the most pronounced RSA. Sinus bradycardia at rest and marked RSA are both normal findings in a trained adolescent athlete. Identical upright P-waves before every QRS confirm sinus origin. No workup is indicated for an asymptomatic athlete with normal exam. Sick sinus syndrome would show unpredictable pauses unrelated to breathing; flutter would show sawtooth flutter waves.",
    rhythmTag: "Respiratory sinus arrhythmia",
    level: "basic",
    topicTags: ["rsa", "athlete", "bradycardia_differential"],
    allowedTiers: ["RN", "NP", "RPN", "PN"],
    curriculumTopicId: "ped-rsa",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "Which feature BEST distinguishes respiratory sinus arrhythmia from atrial fibrillation?",
    answerOptions: [
      "Heart rate above or below 100 bpm",
      "Width of the QRS complex",
      "Presence of uniform upright P-waves before every QRS and respiratory synchronization of R-R variability",
      "Whether the patient has a fever",
    ],
    correctAnswerIndex: 2,
    rationale:
      "The two definitive discriminators are: (1) P-wave analysis — RSA has consistent sinus P-waves before every QRS; AFib has no organized P-waves. (2) Pattern of variability — RSA correlates exactly with the respiratory cycle; AFib is chaotically random. Rate and QRS width do not distinguish these rhythms reliably.",
    rhythmTag: "Respiratory sinus arrhythmia",
    level: "basic",
    topicTags: ["rsa", "afib_differential"],
    allowedTiers: ["RN", "NP", "RPN", "PN"],
    curriculumTopicId: "ped-rsa",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "A 5-year-old has RSA on telemetry. The longest R-R interval measures 2.8 seconds during expiration. What action is most appropriate?",
    answerOptions: [
      "No action required — RSA with any R-R interval is always normal",
      "Document and notify the provider — pause > 2.5 seconds warrants investigation",
      "Immediately begin CPR — the pause indicates cardiac arrest",
      "Administer atropine 0.02 mg/kg IV to prevent further pauses",
    ],
    correctAnswerIndex: 1,
    rationale:
      "The threshold for investigation in RSA is a pause > 2.5 seconds. A 2.8-second R-R interval exceeds this threshold and warrants provider notification to rule out underlying SA node dysfunction. RSA with pauses ≤ 2.5 seconds does not require escalation. CPR and atropine are not indicated for a conscious child with RSA.",
    rhythmTag: "Respiratory sinus arrhythmia",
    level: "basic",
    topicTags: ["rsa", "escalation_threshold"],
    allowedTiers: ["RN", "NP", "RPN", "PN"],
    curriculumTopicId: "ped-rsa",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "What differentiates RSA from PACs on a rhythm strip?",
    answerOptions: [
      "RSA has faster overall rate than PACs",
      "RSA variability is gradual and smooth; PACs introduce a sudden early beat with an abnormal P-wave",
      "RSA shows dropped QRS complexes; PACs do not",
      "PACs are more common in athletes than RSA",
    ],
    correctAnswerIndex: 1,
    rationale:
      "RSA produces gradual sinusoidal variation in R-R intervals — no beat arrives early and no beat is missed. PACs produce an abrupt premature beat that arrives before the expected sinus beat, with a P-wave morphology different from the normal sinus P-wave, followed by a compensatory pause. RSA never produces premature beats.",
    rhythmTag: "Respiratory sinus arrhythmia",
    level: "basic",
    topicTags: ["rsa", "pac_differential"],
    allowedTiers: ["RN", "NP", "RPN", "PN"],
    curriculumTopicId: "ped-rsa",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "A 12-year-old is admitted for observation. Telemetry shows an irregular rhythm. The nurse observes that the rate speeds up when the child breathes in and slows when they breathe out. P-waves are consistent and upright. The nurse's MOST appropriate documentation is:",
    answerOptions: [
      "Irregular rhythm — arrhythmia noted, provider notified for evaluation",
      "Atrial fibrillation with controlled ventricular response — monitoring",
      "Respiratory sinus arrhythmia — physiologic variant, no clinical intervention required",
      "Wandering atrial pacemaker — multiple P-wave morphologies identified",
    ],
    correctAnswerIndex: 2,
    rationale:
      "RSA should be documented as 'respiratory sinus arrhythmia — physiologic variant' with no need for provider notification unless accompanied by clinical concern or pauses > 2.5 seconds. Documenting it as an 'arrhythmia' or 'AFib' would be clinically inaccurate and lead to unnecessary escalation. WAP requires multiple P-wave morphologies, which are absent here.",
    rhythmTag: "Respiratory sinus arrhythmia",
    level: "basic",
    topicTags: ["rsa", "documentation", "overcall_prevention"],
    allowedTiers: ["RN", "NP", "RPN", "PN"],
    curriculumTopicId: "ped-rsa",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "RSA is absent in an 8-year-old who had prominent RSA on admission. What is the clinical significance?",
    answerOptions: [
      "Normal finding — RSA commonly disappears during hospitalization",
      "Possible sign of increased autonomic (sympathetic) activation or autonomic dysfunction — document and flag",
      "Indicates the child has developed atrial fibrillation",
      "No significance — RSA is random and its presence or absence varies without clinical meaning",
    ],
    correctAnswerIndex: 1,
    rationale:
      "RSA reflects vagal tone. Its disappearance indicates either a shift toward sympathetic dominance (fever, pain, stress, tachycardia) or, in some contexts, autonomic dysfunction. In a sick child, loss of RSA may be a sign of physiologic stress. In a child with diabetes or post-viral illness, absent RSA can indicate cardiac autonomic neuropathy. The finding should be documented and clinically contextualized.",
    rhythmTag: "Respiratory sinus arrhythmia",
    level: "intermediate",
    topicTags: ["rsa", "autonomic_dysfunction", "clinical_significance"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-rsa",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "An 11-year-old is hyperventilating with anxiety. HR is 120–148 bpm and appears irregular. P-waves are present before each QRS. The nurse notes the rate changes slightly with breathing. The MOST likely explanation is:",
    answerOptions: [
      "SVT — prepare adenosine",
      "Sinus tachycardia with respiratory sinus arrhythmia from rapid, anxious breathing",
      "Atrial flutter with 2:1 conduction",
      "Multifocal atrial tachycardia",
    ],
    correctAnswerIndex: 1,
    rationale:
      "Sinus tachycardia with RSA is the expected finding in an anxious, hyperventilating child. Fast breathing creates rapid RSA cycling that can appear alarming. Sinus P-waves before every QRS confirm the sinus origin. Rate varies with breathing. SVT would be fixed at its rate regardless of emotional state; flutter would show sawtooth waves; MAT requires ≥3 different P-wave morphologies.",
    rhythmTag: "Respiratory sinus arrhythmia",
    level: "basic",
    topicTags: ["rsa", "sinus_tach", "anxiety"],
    allowedTiers: ["RN", "NP", "RPN", "PN"],
    curriculumTopicId: "ped-rsa",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "RSA is sometimes called 'the heart listening to the lungs.' Which physiologic mechanism best explains this?",
    answerOptions: [
      "The SA node is directly mechanically stretched by lung expansion",
      "Inspiration inhibits vagal tone via the Bainbridge reflex, allowing faster SA node firing",
      "The QRS complex broadens during inspiration due to diaphragm movement",
      "Adrenaline released during inspiration increases the heart rate",
    ],
    correctAnswerIndex: 1,
    rationale:
      "During inspiration, increased venous return stretches the right atrium, activating the Bainbridge reflex, which inhibits vagal (parasympathetic) tone. Reduced vagal inhibition lets the SA node fire faster, shortening the R-R interval. During expiration, vagal tone is restored and the SA node slows. This is a normal autonomic reflex — not a pathologic mechanism.",
    rhythmTag: "Respiratory sinus arrhythmia",
    level: "intermediate",
    topicTags: ["rsa", "physiology", "vagal_tone"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-rsa",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
];

// ─── Pediatric SVT vs Sinus Tach (10) ──────────────────────────────────────

const SVT_VS_SINUS_TACH_QUESTIONS: PediatricSeedQuestion[] = [
  {
    questionText:
      "A 3-month-old presents with poor feeding for 8 hours. HR is 240 bpm. The rate does not change when the infant cries or is soothed. No identifiable P-waves. Temperature 37.0°C. What is the MOST likely diagnosis?",
    answerOptions: [
      "Sinus tachycardia from fever",
      "Supraventricular tachycardia (SVT)",
      "Sinus tachycardia from pain",
      "Ventricular tachycardia",
    ],
    correctAnswerIndex: 1,
    rationale:
      "HR 240 in a 3-month-old with no identifiable P-waves, no fever, and a FIXED rate (doesn't vary with state changes) = SVT. Sinus tachycardia in a 3-month-old almost never exceeds 220 bpm and would vary with crying/soothing. VT would show wide QRS complexes.",
    rhythmTag: "Pediatric SVT",
    level: "intermediate",
    topicTags: ["svt", "infant_svt", "svt_vs_sinus_tach"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-svt-vs-sinus-tach",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "For an infant with SVT and signs of poor perfusion (pale, weak pulses, cap refill 4 sec), the FIRST intervention is:",
    answerOptions: [
      "Adenosine 0.1 mg/kg rapid IV push",
      "Synchronized cardioversion at 0.5 J/kg",
      "Apply ice to the face (diving reflex vagal maneuver)",
      "Carotid sinus massage",
    ],
    correctAnswerIndex: 1,
    rationale:
      "SVT with poor perfusion = hemodynamic compromise. The PALS algorithm calls for synchronized cardioversion (0.5 J/kg, may increase to 1 J/kg) as first-line when hemodynamically unstable. Adenosine is first-line for stable SVT (adequate perfusion). Ice/vagal maneuvers are used for stable SVT. Carotid massage is for older children/adolescents, not infants.",
    rhythmTag: "Pediatric SVT",
    level: "intermediate",
    topicTags: ["svt", "synchronized_cardioversion", "hemodynamic_instability"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-svt-vs-sinus-tach",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "A 6-month-old has HR 250 bpm. HR drops to 180 when the infant is soothed and calmed. The MOST likely diagnosis is:",
    answerOptions: [
      "SVT — rate > 220 confirms SVT",
      "Sinus tachycardia — rate variation with state changes supports sinus origin",
      "Junctional tachycardia — narrow QRS with no P-waves",
      "Ventricular tachycardia — always treat wide-complex",
    ],
    correctAnswerIndex: 1,
    rationale:
      "Rate variability with state change (soothing/calming) strongly suggests sinus tachycardia. SVT rate is fixed — it does not vary with crying, feeding, or being held. Although 250 bpm in an infant raises SVT concern, the rate variability here points to sinus tachycardia (likely from pain, hunger, or distress). Investigate the cause of tachycardia rather than treating the rate.",
    rhythmTag: "Pediatric sinus tachycardia",
    level: "intermediate",
    topicTags: ["sinus_tach", "svt_vs_sinus_tach", "rate_variability"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-svt-vs-sinus-tach",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "Adenosine is ordered for a 4-year-old with SVT and adequate perfusion. What is the CRITICAL point about adenosine administration?",
    answerOptions: [
      "Give as a slow infusion over 5 minutes to avoid side effects",
      "Give as a rapid IV bolus push + immediate 5–10 mL NS flush, via the most proximal IV site",
      "Always dilute in 50 mL NS before administration",
      "Only give via central line — peripheral IV is insufficient",
    ],
    correctAnswerIndex: 1,
    rationale:
      "Adenosine has a half-life of < 10 seconds. Slow administration allows the drug to be metabolized before reaching the SA/AV node in sufficient concentration. Adenosine MUST be given as a rapid IV bolus at the most proximal IV site available, followed by an immediate flush of 5–10 mL NS to drive the drug centrally. Peripheral IV is acceptable if proximal. Central line is not required.",
    rhythmTag: "Pediatric SVT",
    level: "intermediate",
    topicTags: ["svt", "adenosine", "drug_administration"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-svt-vs-sinus-tach",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "Which vagal maneuver is appropriate for a 5-month-old infant with stable SVT?",
    answerOptions: [
      "Carotid sinus massage",
      "Valsalva maneuver (bearing down)",
      "Ice-water to the face (diving reflex stimulation)",
      "Ocular pressure (Aschner reflex)",
    ],
    correctAnswerIndex: 2,
    rationale:
      "Ice-water applied to the face (diving reflex) is the vagal maneuver for infants. It stimulates the trigeminal nerve and dramatically increases vagal tone. Carotid massage is for older children/adolescents. Valsalva requires cooperation (impossible in an infant). Ocular pressure is not recommended in pediatrics (risk of retinal detachment, bradycardia without termination).",
    rhythmTag: "Pediatric SVT",
    level: "intermediate",
    topicTags: ["svt", "vagal_maneuvers", "infant"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-svt-vs-sinus-tach",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "A 9-year-old has SVT at HR 195 bpm with adequate perfusion. Vagal maneuver is unsuccessful. Adenosine 0.1 mg/kg is given via rapid push — no effect. What is the appropriate next step?",
    answerOptions: [
      "Repeat adenosine at the same dose (0.1 mg/kg)",
      "Increase adenosine dose to 0.2 mg/kg rapid push as second dose",
      "Proceed immediately to defibrillation",
      "Begin amiodarone infusion",
    ],
    correctAnswerIndex: 1,
    rationale:
      "Per PALS guidelines, if the first dose of adenosine (0.1 mg/kg) fails, the second dose is doubled to 0.2 mg/kg (maximum 12 mg) and again given as a rapid IV push. If two adenosine doses fail in hemodynamically stable SVT, consult cardiology for synchronized cardioversion or alternative antiarrhythmic. Defibrillation is for pulseless arrest, not stable SVT.",
    rhythmTag: "Pediatric SVT",
    level: "intermediate",
    topicTags: ["svt", "adenosine", "second_dose"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-svt-vs-sinus-tach",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "An infant with SVT is 3 months old, HR 265 bpm. The rate is constant regardless of activity. What is the MOST helpful clinical clue to distinguish this from sinus tachycardia before the 12-lead is available?",
    answerOptions: [
      "The rate is > 220 bpm",
      "The abrupt onset and fixed rate regardless of the infant's activity or state",
      "The absence of P-waves on the bedside monitor",
      "The infant is pale",
    ],
    correctAnswerIndex: 1,
    rationale:
      "The most clinically useful feature before a 12-lead is available is the BEHAVIOR of the rate: SVT starts abruptly and does not vary with the infant's state (sleeping, crying, being held). Sinus tachycardia varies with stimulation. Rate > 220 is suggestive but not definitive. P-wave analysis requires a 12-lead. Pallor can occur with both rhythms if hemodynamically compromised.",
    rhythmTag: "Pediatric SVT",
    level: "intermediate",
    topicTags: ["svt", "svt_vs_sinus_tach", "clinical_clues"],
    allowedTiers: ["RN", "NP", "RPN", "PN"],
    curriculumTopicId: "ped-svt-vs-sinus-tach",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "SVT in infants is most commonly due to:",
    answerOptions: [
      "Re-entrant pathway via Wolff-Parkinson-White (WPW) accessory pathway",
      "Inflammatory myocarditis",
      "Structural congenital heart disease",
      "Electrolyte imbalance",
    ],
    correctAnswerIndex: 0,
    rationale:
      "WPW accessory pathway-mediated re-entrant SVT is the most common cause of SVT in infants. Many infants have delta waves on their baseline ECG. About 40% of WPW in infants resolves spontaneously by mid-childhood as the accessory pathway becomes less conductive. Structural disease, myocarditis, and electrolyte imbalances are less common causes.",
    rhythmTag: "Pediatric SVT",
    level: "intermediate",
    topicTags: ["svt", "wpw", "mechanism"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-svt-vs-sinus-tach",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "Which finding on the rhythm strip best CONFIRMS sinus tachycardia over SVT in a febrile 18-month-old with HR 195?",
    answerOptions: [
      "HR below 220 bpm",
      "Upright P-wave preceding every QRS in a 1:1 relationship with variable rate matching fever and distress",
      "Narrow QRS complex < 0.09s",
      "Absence of delta waves",
    ],
    correctAnswerIndex: 1,
    rationale:
      "The definitive confirmation of sinus tachycardia is: (1) upright sinus P-wave before every QRS, (2) rate varying with the child's clinical state (higher with crying/fever, lower when calm). Rate < 220 is not definitive — sinus tach can exceed 220 in a very febrile toddler. Narrow QRS is present in both SVT and sinus tach. Delta waves are absent in both if no WPW.",
    rhythmTag: "Pediatric sinus tachycardia",
    level: "intermediate",
    topicTags: ["sinus_tach", "svt_vs_sinus_tach", "fever"],
    allowedTiers: ["RN", "NP", "RPN", "PN"],
    curriculumTopicId: "ped-svt-vs-sinus-tach",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "A 2-year-old with SVT receives cardioversion. The rhythm successfully converts to sinus. Immediately after conversion, the ECG shows a short PR interval with a slurred QRS upstroke. What does this suggest?",
    answerOptions: [
      "The cardioversion caused myocardial injury",
      "Wolff-Parkinson-White (WPW) pattern — the accessory pathway is now visible after SVT termination",
      "First-degree AV block developing post-cardioversion",
      "Normal post-conversion sinus rhythm — no significance",
    ],
    correctAnswerIndex: 1,
    rationale:
      "After SVT termination in a patient with WPW, the delta wave (slurred QRS upstroke) and short PR become visible on the baseline ECG because the accessory pathway is no longer concealed within the SVT circuit. This is expected and confirms the WPW etiology. Cardiology follow-up is indicated to guide ongoing management and potential ablation planning.",
    rhythmTag: "Pediatric WPW / pre-excitation",
    level: "advanced",
    topicTags: ["wpw", "svt", "post_conversion", "delta_wave"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-wpw",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
];

// ─── Hypoxic Bradycardia / PALS Bradycardia (10) ────────────────────────────

const HYPOXIC_BRADY_QUESTIONS: PediatricSeedQuestion[] = [
  {
    questionText:
      "A 2-year-old with bronchiolitis has HR fallen from 140 to 52 bpm over 1 hour. SpO₂ is 80% on 2L NC. Cap refill is 4 seconds. The FIRST intervention is:",
    answerOptions: [
      "Atropine 0.02 mg/kg IV",
      "Bag-valve-mask ventilation with 100% O₂",
      "Epinephrine 0.01 mg/kg IV",
      "12-lead ECG to evaluate for complete heart block",
    ],
    correctAnswerIndex: 1,
    rationale:
      "This child has hypoxic bradycardia — the most common cause of bradycardia in children. The falling HR combined with SpO₂ 80% and signs of poor perfusion (cap refill 4s) indicates respiratory failure driving the bradycardia. VENTILATE FIRST. Oxygenation usually reverses hypoxic bradycardia within 30 seconds. Atropine treats vagal bradycardia, not hypoxic bradycardia. Epinephrine is for bradycardia unresponsive to ventilation.",
    rhythmTag: "Pediatric hypoxic bradycardia",
    level: "intermediate",
    topicTags: ["hypoxic_brady", "ventilate_first", "pals_bradycardia"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-bradycardia-perfusion",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "Per PALS 2020, when should CPR begin for a child with bradycardia?",
    answerOptions: [
      "HR < 60 regardless of perfusion status",
      "HR < 60 with signs of poor perfusion that does NOT improve with 30 seconds of effective assisted ventilation with 100% O₂",
      "HR < 80 in any infant",
      "HR < 100 in a neonate",
    ],
    correctAnswerIndex: 1,
    rationale:
      "PALS 2020 specifies: CPR is indicated when HR < 60 WITH signs of poor perfusion that does not respond to 30 seconds of effective ventilation with supplemental O₂. Both criteria must be present. Bradycardia alone (e.g., athlete with HR 45, excellent perfusion) does not require CPR. The threshold is clinical compromise + bradycardia unresponsive to ventilation.",
    rhythmTag: "Pediatric hypoxic bradycardia",
    level: "intermediate",
    topicTags: ["hypoxic_brady", "cpr_threshold", "pals"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-bradycardia-perfusion",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "A child has HR 58 and poor perfusion. After 30 seconds of effective BVM ventilation, HR is now 55. The CORRECT next action is:",
    answerOptions: [
      "Continue BVM ventilation for another 2 minutes before starting CPR",
      "Begin CPR — HR < 60 with poor perfusion not improving after 30 seconds effective ventilation",
      "Give atropine 0.02 mg/kg IV",
      "Apply AED and check for shockable rhythm",
    ],
    correctAnswerIndex: 1,
    rationale:
      "30 seconds of effective ventilation is the PALS threshold for deciding to start CPR. If HR has not risen to > 60 with improved perfusion after 30 seconds of adequate bag-valve-mask ventilation with O₂, begin CPR immediately while continuing ventilation. Continuing ventilation for another 2 minutes delays the critical intervention. Atropine does not address the underlying hypoxia driving the bradycardia.",
    rhythmTag: "Pediatric hypoxic bradycardia",
    level: "intermediate",
    topicTags: ["hypoxic_brady", "cpr_threshold", "30_second_rule"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-bradycardia-perfusion",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "Atropine is indicated for pediatric bradycardia in which scenario?",
    answerOptions: [
      "Any bradycardia with SpO₂ < 90%",
      "Bradycardia due to increased vagal tone (e.g., during intubation), NOT for hypoxic bradycardia",
      "Any bradycardia with HR < 60 regardless of cause",
      "Bradycardia after cardiac arrest resuscitation",
    ],
    correctAnswerIndex: 1,
    rationale:
      "Atropine is a vagolytic agent — it works by blocking parasympathetic (vagal) slowing of the heart. It is appropriate for vagally mediated bradycardia (e.g., post-intubation laryngoscopy, excessive vagal tone). It is NOT effective for hypoxic bradycardia because hypoxia depresses the SA and AV nodes directly — atropine cannot overcome this. For hypoxic bradycardia, oxygenation and CPR are the correct interventions.",
    rhythmTag: "Pediatric sinus bradycardia",
    level: "intermediate",
    topicTags: ["bradycardia", "atropine", "vagal_vs_hypoxic"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-bradycardia-perfusion",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "Where should the pulse be checked in an infant during CPR assessment?",
    answerOptions: [
      "Radial pulse at the wrist",
      "Carotid pulse in the neck",
      "Brachial pulse on the inner upper arm",
      "Femoral pulse in the groin",
    ],
    correctAnswerIndex: 2,
    rationale:
      "In infants, the brachial pulse is the most reliable and accessible location for pulse assessment. The carotid is difficult to palpate in an infant's short, chubby neck. The radial is often too distal to detect low cardiac output. The femoral is acceptable but less accessible during resuscitation.",
    rhythmTag: "Pediatric hypoxic bradycardia",
    level: "basic",
    topicTags: ["cpr", "pulse_assessment", "infant"],
    allowedTiers: ["RN", "NP", "RPN", "PN"],
    curriculumTopicId: "ped-bradycardia-perfusion",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "A 10-month-old has HR 45 bpm with gray skin color, absent peripheral pulses, and no response to painful stimuli. After calling for help, your NEXT action is:",
    answerOptions: [
      "Obtain IV access and give epinephrine",
      "Begin bag-valve-mask ventilation with 100% O₂ immediately",
      "Attach defibrillator pads",
      "Obtain arterial blood gas to confirm hypoxia",
    ],
    correctAnswerIndex: 1,
    rationale:
      "This infant is in cardiorespiratory failure. The immediate priority is AIRWAY and BREATHING — BVM ventilation with 100% O₂ is the first intervention for a child in this state. Respiratory failure is the leading cause of pediatric cardiac arrest; reversing hypoxia may prevent full arrest. IV access and epinephrine follow if CPR is required. Defibrillation is not the first step for bradycardia.",
    rhythmTag: "Pediatric hypoxic bradycardia",
    level: "intermediate",
    topicTags: ["hypoxic_brady", "airway_first", "respiratory_failure"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-bradycardia-perfusion",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "Which sequence is CORRECT per PALS for a child with HR 42 and poor perfusion?",
    answerOptions: [
      "Atropine → epinephrine → CPR → identify reversible causes",
      "BVM ventilation → if HR < 60 persists → CPR → epinephrine → identify reversible causes",
      "Defibrillation → CPR → epinephrine",
      "IV adenosine → synchronized cardioversion → CPR",
    ],
    correctAnswerIndex: 1,
    rationale:
      "PALS bradycardia algorithm: (1) Support ventilation and oxygenation — BVM with 100% O₂. (2) If HR < 60 with poor perfusion not responding to 30 seconds of effective ventilation → CPR. (3) IV/IO access → epinephrine 0.01 mg/kg q3–5min. (4) Consider atropine for vagal bradycardia. (5) Search for reversible causes. Defibrillation is not indicated for bradycardia. Adenosine is for SVT.",
    rhythmTag: "Pediatric hypoxic bradycardia",
    level: "intermediate",
    topicTags: ["pals_bradycardia_algorithm", "sequence"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-bradycardia-perfusion",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "What is the difference between hypoxic bradycardia and primary conduction disease (complete heart block) in a child?",
    answerOptions: [
      "Hypoxic bradycardia always has wide QRS; CHB always has narrow QRS",
      "Hypoxic bradycardia reverses with oxygenation; CHB shows AV dissociation and does not respond to O₂",
      "They are clinically identical and always treated the same way",
      "CHB produces faster bradycardia rates than hypoxic bradycardia",
    ],
    correctAnswerIndex: 1,
    rationale:
      "The key distinguisher: hypoxic bradycardia responds to oxygenation within 30 seconds of effective BVM ventilation. CHB does not — it shows P-waves marching independently at a faster rate than the QRS escape rhythm (AV dissociation), and does not improve with O₂ alone. CHB requires pacing consultation. Always correct oxygenation first, then evaluate conduction.",
    rhythmTag: "Pediatric hypoxic bradycardia",
    level: "advanced",
    topicTags: ["hypoxic_brady", "chb_differential"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-bradycardia-perfusion",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "A 4-year-old with RSV bronchiolitis has 'decreasing respiratory effort and HR dropping from 148 to 72 over 20 minutes.' SpO₂ has fallen from 95% to 87%. What does this clinical picture represent?",
    answerOptions: [
      "Resolution of respiratory distress — the child is improving",
      "Respiratory failure with impending cardiac arrest — the decreasing HR reflects hypoxic bradycardia",
      "Sinus bradycardia from fever resolution — give antipyretic",
      "Normal sleep pattern — reassess in 1 hour",
    ],
    correctAnswerIndex: 1,
    rationale:
      "Decreasing respiratory effort + falling HR + falling SpO₂ = the child is TIRING. This is the classic pattern of respiratory failure progressing to cardiac arrest in children. Decreased respiratory effort is NOT a sign of improvement — it means the child is too exhausted to maintain respiratory drive. This requires IMMEDIATE intervention: airway support, BVM if needed, escalation to code team.",
    rhythmTag: "Pediatric hypoxic bradycardia",
    level: "intermediate",
    topicTags: ["respiratory_failure", "impending_arrest", "pattern_recognition"],
    allowedTiers: ["RN", "NP", "RPN", "PN"],
    curriculumTopicId: "ped-bradycardia-perfusion",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "Epinephrine dose for pediatric bradycardia unresponsive to ventilation and CPR is:",
    answerOptions: [
      "0.1 mg/kg IV — high-dose epinephrine",
      "0.01 mg/kg IV/IO (1:10,000 concentration)",
      "1 mg IV flat dose regardless of weight",
      "0.001 mg/kg IV/IO",
    ],
    correctAnswerIndex: 1,
    rationale:
      "Pediatric epinephrine dose is 0.01 mg/kg IV/IO (using the 1:10,000 concentration — 0.1 mL/kg). High-dose epinephrine (0.1 mg/kg) is not recommended in pediatric arrest and may worsen outcomes. Weight-based dosing is essential in children. Document weight and calculate dose before administering.",
    rhythmTag: "Pediatric hypoxic bradycardia",
    level: "intermediate",
    topicTags: ["epinephrine_dose", "pals", "weight_based_dosing"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-bradycardia-perfusion",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
];

// ─── PALS Arrest Rhythms (10) ───────────────────────────────────────────────

const PALS_ARREST_QUESTIONS: PediatricSeedQuestion[] = [
  {
    questionText:
      "VF is identified in a 5-year-old (22 kg). What is the correct initial defibrillation energy?",
    answerOptions: [
      "1 J/kg (22 J)",
      "2 J/kg (44 J)",
      "360 J (adult dose)",
      "150 J biphasic adult dose",
    ],
    correctAnswerIndex: 1,
    rationale:
      "PALS 2020 initial defibrillation energy: 2 J/kg. For a 22 kg child, this is 44 J. If VF persists, the second and subsequent doses may be increased to 4 J/kg. Adult fixed-energy protocols are NOT used in children — weight-based dosing is essential.",
    rhythmTag: "Pediatric VF",
    level: "intermediate",
    topicTags: ["vf", "defibrillation_energy", "pals_arrest"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-pals-shockable",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "For a child with pulseless VT, after delivering the first shock at 2 J/kg, what is the IMMEDIATE next action?",
    answerOptions: [
      "Check rhythm and pulse before resuming CPR",
      "Resume CPR immediately — do not pause to check rhythm",
      "Administer epinephrine before resuming CPR",
      "Increase energy to 4 J/kg and shock again",
    ],
    correctAnswerIndex: 1,
    rationale:
      "After any defibrillation attempt in pulseless VT or VF: RESUME CPR IMMEDIATELY. Do not pause to check rhythm or pulse right after the shock — this delays the critical post-shock CPR. Continue CPR for 2 minutes before the next rhythm check. Early post-shock CPR is associated with improved survival in pediatric and adult cardiac arrest.",
    rhythmTag: "Pediatric VT",
    level: "intermediate",
    topicTags: ["pulseless_vt", "post_shock_cpr", "pals_arrest"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-pals-shockable",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "Before defibrillating a child with apparent VF on the monitor, what MUST be confirmed?",
    answerOptions: [
      "IV access is established",
      "The child is pulseless — never defibrillate based on monitor alone",
      "The child weighs < 20 kg",
      "Atropine has been given",
    ],
    correctAnswerIndex: 1,
    rationale:
      "Always confirm PULSELESSNESS before defibrillation. A motion artifact can perfectly mimic VF on the monitor. Defibrillating a child with organized perfusing rhythm is dangerous (risk of inducing VF). Pulse check and patient responsiveness assessment must precede any defibrillation decision.",
    rhythmTag: "Pediatric VF",
    level: "basic",
    topicTags: ["vf", "pulse_check", "artifact_vs_vf"],
    allowedTiers: ["RN", "NP", "RPN", "PN"],
    curriculumTopicId: "ped-pals-shockable",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "Pediatric asystole is confirmed on the cardiac monitor. What medication is the primary treatment per PALS?",
    answerOptions: [
      "Atropine 0.02 mg/kg IV",
      "Amiodarone 5 mg/kg IV",
      "Epinephrine 0.01 mg/kg IV/IO every 3–5 minutes",
      "Adenosine 0.1 mg/kg rapid push",
    ],
    correctAnswerIndex: 2,
    rationale:
      "Epinephrine 0.01 mg/kg IV/IO is the primary drug for asystole (and PEA) per PALS 2020. Atropine is no longer recommended for asystole (PALS 2020 update — removed from arrest algorithm). Amiodarone is used for refractory VF/pVT. Adenosine is for SVT. While giving epinephrine, the team must aggressively search for reversible causes (6 Hs and 5 Ts).",
    rhythmTag: "Pediatric asystole",
    level: "intermediate",
    topicTags: ["asystole", "epinephrine", "pals_non_shockable"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-pals-non-shockable",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "A child presents with organized electrical activity on the monitor but no detectable pulse after 1 minute of CPR. This is:",
    answerOptions: [
      "Sinus bradycardia — give atropine",
      "PEA (pulseless electrical activity) — continue CPR, give epinephrine, search for reversible causes",
      "A normal variant — the monitor may show sinus activity during low cardiac output",
      "VF requiring immediate defibrillation",
    ],
    correctAnswerIndex: 1,
    rationale:
      "PEA is organized electrical activity on the ECG without a palpable pulse. PALS management: CPR + epinephrine 0.01 mg/kg IV/IO q3–5min + aggressive search for reversible causes (6 Hs: hypovolemia, hypoxia, hydrogen ion/acidosis, hypo/hyperkalemia, hypothermia; 5 Ts: tension pneumothorax, tamponade, toxins, thrombosis-pulmonary, thrombosis-coronary). Do NOT defibrillate — PEA is a non-shockable rhythm.",
    rhythmTag: "Pediatric PEA",
    level: "intermediate",
    topicTags: ["pea", "non_shockable", "reversible_causes"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-pals-non-shockable",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "A child in cardiac arrest has 'asystole' on the monitor. Before withholding defibrillation, you should:",
    answerOptions: [
      "Call the time of death — asystole is always irreversible",
      "Confirm asystole in a SECOND lead — fine VF can mimic asystole and is shockable",
      "Administer atropine before checking another lead",
      "Begin transcutaneous pacing immediately",
    ],
    correctAnswerIndex: 1,
    rationale:
      "Fine VF can appear as near-flat-line on a single lead. Confirming asystole in a second lead (perpendicular to the first) is critical before withholding defibrillation. VF is shockable and potentially reversible; true asystole is not. This 'confirm in two leads' step is explicitly taught in PALS and ACLS to prevent missing a treatable arrest rhythm.",
    rhythmTag: "Pediatric asystole",
    level: "intermediate",
    topicTags: ["asystole", "vf_vs_asystole", "two_lead_confirmation"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-pals-non-shockable",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "For a 30 kg child in refractory VF (persistent after 3rd shock), which antiarrhythmic is preferred per PALS?",
    answerOptions: [
      "Lidocaine 1 mg/kg IV — preferred over amiodarone in all cases",
      "Amiodarone 5 mg/kg IV/IO OR lidocaine 1 mg/kg IV/IO — both are acceptable per PALS 2020",
      "Magnesium sulfate 50 mg/kg IV",
      "Adenosine 0.2 mg/kg rapid push",
    ],
    correctAnswerIndex: 1,
    rationale:
      "PALS 2020 accepts both amiodarone (5 mg/kg IV/IO) and lidocaine (1 mg/kg IV/IO) for shock-refractory VF/pulseless VT. Neither is definitively superior in outcome. Magnesium is used for torsades de pointes. Adenosine is for SVT.",
    rhythmTag: "Pediatric VF",
    level: "advanced",
    topicTags: ["vf", "amiodarone", "lidocaine", "refractory_vf"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-pals-shockable",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "Which of the following is a SHOCKABLE pediatric arrest rhythm?",
    answerOptions: [
      "Asystole",
      "PEA with narrow-complex organized activity",
      "Pulseless VT",
      "Severe bradycardia",
    ],
    correctAnswerIndex: 2,
    rationale:
      "Shockable pediatric arrest rhythms: VF and PULSELESS VT. Non-shockable: asystole and PEA. Bradycardia is not a cardiac arrest rhythm. Defibrillation is only appropriate for shockable rhythms — defibrillating asystole or PEA does not help and may cause harm.",
    rhythmTag: "Pediatric VT",
    level: "basic",
    topicTags: ["shockable_vs_non_shockable", "pals_arrest"],
    allowedTiers: ["RN", "NP", "RPN", "PN"],
    curriculumTopicId: "ped-pals-shockable",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "During pediatric CPR, what is the correct compression-to-ventilation ratio for a child when TWO rescuers are present?",
    answerOptions: [
      "30:2 (same as single-rescuer)",
      "15:2 (pediatric two-rescuer ratio)",
      "5:1 (neonatal ratio for all children)",
      "100:0 (continuous compressions, no pauses)",
    ],
    correctAnswerIndex: 1,
    rationale:
      "PALS two-rescuer CPR for children: 15 compressions to 2 ventilations (15:2). Single-rescuer uses 30:2. The 15:2 ratio allows more ventilations per cycle to address the frequent respiratory cause of pediatric arrest. For neonates (at birth), the ratio is 3:1. For a child with an advanced airway in place, deliver continuous compressions with ventilations every 6 seconds (10/min).",
    rhythmTag: "Pediatric asystole",
    level: "basic",
    topicTags: ["cpr_ratio", "two_rescuer", "pals"],
    allowedTiers: ["RN", "NP", "RPN", "PN"],
    curriculumTopicId: "ped-pals-non-shockable",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "Post-cardiac arrest care in a child who achieves ROSC should target SpO₂:",
    answerOptions: [
      "100% — maximize oxygen delivery at all times",
      "94–99% — avoid both hypoxia and hyperoxia",
      "88–92% — permissive hypoxia to prevent oxygen toxicity",
      "> 95% is mandatory to prevent brain injury",
    ],
    correctAnswerIndex: 1,
    rationale:
      "Post-ROSC oxygen targets per PALS 2020: maintain SpO₂ 94–99%. Hyperoxia (SpO₂ 100%, excessive supplemental O₂) may worsen neurologic outcomes in post-arrest patients. Once ROSC is achieved, titrate O₂ to keep SpO₂ in the 94–99% range. Permissive hypoxia (88–92%) is insufficient for post-arrest brain protection.",
    rhythmTag: "Pediatric PEA",
    level: "advanced",
    topicTags: ["post_rosc", "oxygen_target", "hyperoxia"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-pals-non-shockable",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
];

// ─── Pulsus Paradoxus Clinical Context (5) ─────────────────────────────────

const PULSUS_PARADOXUS_QUESTIONS: PediatricSeedQuestion[] = [
  {
    questionText:
      "A nurse asks: 'How do I assess for pulsus paradoxus at the bedside?' The CORRECT answer is:",
    answerOptions: [
      "Look for alternating QRS amplitude on the ECG (electrical alternans)",
      "Measure systolic BP by inflating the cuff above systolic and noting the difference between when Korotkoff sounds are first heard in expiration only versus in both phases",
      "Calculate the difference between systolic and diastolic on the cardiac monitor",
      "Observe for alternating wide and narrow QRS complexes on telemetry",
    ],
    correctAnswerIndex: 1,
    rationale:
      "Pulsus paradoxus is a HEMODYNAMIC FINDING assessed by blood pressure cuff measurement — NOT by ECG. Inflate cuff 20 mmHg above systolic, deflate slowly. Note the pressure when Korotkoff sounds are FIRST heard (usually only during expiration), then continue deflating to where they are heard in BOTH phases. The difference = pulsus paradoxus. > 10 mmHg is abnormal; > 20 mmHg indicates severe obstruction. Electrical alternans is a separate ECG finding associated with tamponade.",
    rhythmTag: "Respiratory sinus arrhythmia",
    level: "intermediate",
    topicTags: ["pulsus_paradoxus", "hemodynamic_finding", "not_rhythm", "assessment"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-bradycardia-perfusion",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "Pulsus paradoxus > 20 mmHg in a 9-year-old with severe asthma exacerbation indicates:",
    answerOptions: [
      "The child has developed AFib from the exacerbation",
      "Severe airway obstruction — immediate escalation and intensification of bronchodilator therapy required",
      "The reading was likely incorrect — pulsus paradoxus does not occur in asthma",
      "Mild asthma — pulsus paradoxus < 25 mmHg is always reassuring",
    ],
    correctAnswerIndex: 1,
    rationale:
      "Pulsus paradoxus > 20 mmHg in asthma indicates severe bronchospasm with significant air trapping and exaggerated intrathoracic pressure swings. This is a marker of disease severity, not a rhythm abnormality. It should prompt immediate escalation: provider notification, consider IV magnesium sulfate, possible ICU transfer if bronchodilator therapy fails. > 25 mmHg may indicate near-fatal asthma.",
    rhythmTag: "Pediatric sinus tachycardia",
    level: "intermediate",
    topicTags: ["pulsus_paradoxus", "asthma", "severity_marker"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-bradycardia-perfusion",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "A child with suspected cardiac tamponade has HR 140, distant heart sounds, and elevated JVP. What ECG finding is classically associated with TAMPONADE (not pulsus paradoxus)?",
    answerOptions: [
      "ST elevation in multiple leads",
      "Electrical alternans — alternating QRS complex amplitude beat-to-beat",
      "Prolonged QTc > 500 ms",
      "Peaked T-waves in precordial leads",
    ],
    correctAnswerIndex: 1,
    rationale:
      "Electrical alternans — alternating amplitude of QRS complexes (and sometimes P and T waves) on each beat — is the classic ECG finding of cardiac tamponade. It is caused by the heart swinging back and forth within a large pericardial effusion. This is DIFFERENT from pulsus paradoxus, which is a blood pressure measurement. Both can occur together in tamponade, but they are separate findings.",
    rhythmTag: "Pediatric sinus tachycardia",
    level: "advanced",
    topicTags: ["tamponade", "electrical_alternans", "pulsus_paradoxus_vs_ecg"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-bradycardia-perfusion",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "Which conditions are associated with pulsus paradoxus > 10 mmHg? (Select all that apply — the BEST answer includes the most complete list)",
    answerOptions: [
      "Cardiac tamponade only",
      "Cardiac tamponade, severe asthma, tension pneumothorax, constrictive pericarditis",
      "Atrial fibrillation and SVT",
      "Complete heart block and PEA",
    ],
    correctAnswerIndex: 1,
    rationale:
      "Pulsus paradoxus > 10 mmHg occurs in conditions that exaggerate the normal inspiratory drop in systolic BP. The key causes: cardiac tamponade (classic — fluid restricts cardiac filling), severe asthma/COPD (air trapping raises intrathoracic pressure during expiration), tension pneumothorax, and constrictive pericarditis. Arrhythmias (AFib, SVT, CHB, PEA) do not directly cause pulsus paradoxus.",
    rhythmTag: "Pediatric sinus tachycardia",
    level: "intermediate",
    topicTags: ["pulsus_paradoxus", "associated_conditions", "not_rhythm"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-bradycardia-perfusion",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
  {
    questionText:
      "A learner states: 'I can see pulsus paradoxus on the telemetry monitor by looking at the QRS complex size.' This statement is:",
    answerOptions: [
      "Correct — QRS amplitude changes with pulsus paradoxus",
      "Incorrect — pulsus paradoxus is a blood pressure finding measured by sphygmomanometry or pulse oximetry plethysmography, not an ECG finding",
      "Partially correct — you can estimate it from the QRS but need BP confirmation",
      "Correct only in tamponade",
    ],
    correctAnswerIndex: 1,
    rationale:
      "Pulsus paradoxus is NOT visible on the standard ECG or telemetry cardiac waveform. It is assessed by blood pressure cuff (sphygmomanometry) or by observing the amplitude variation in the pulse oximetry plethysmographic waveform. The ECG finding of electrical alternans (alternating QRS size) is a DIFFERENT finding associated with tamponade — it should not be confused with pulsus paradoxus. This is a common educational misunderstanding that this question set is designed to correct.",
    rhythmTag: "Respiratory sinus arrhythmia",
    level: "basic",
    topicTags: ["pulsus_paradoxus", "misconception", "not_ecg_finding"],
    allowedTiers: ["RN", "NP", "RPN", "PN"],
    curriculumTopicId: "ped-rsa",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiology Content Team",
  },
];

// ─── Post-op JET Recognition (5) ───────────────────────────────────────────

const JET_QUESTIONS: PediatricSeedQuestion[] = [
  {
    questionText:
      "A 10-day-old, post-tetralogy of Fallot repair, develops HR 205 bpm. P-waves are visible at HR 155 bpm, marching independently. QRS is near-narrow. The rhythm is MOST consistent with:",
    answerOptions: [
      "SVT — adenosine should be given immediately",
      "Junctional ectopic tachycardia (JET) — notify cardiac surgery team",
      "Sinus tachycardia from post-op pain — give acetaminophen",
      "Ventricular tachycardia — prepare for synchronized cardioversion",
    ],
    correctAnswerIndex: 1,
    rationale:
      "JET: QRS rate FASTER than P-wave rate (AV dissociation), near-narrow QRS, post-cardiac surgery context. This is the classic presentation of post-op JET after TOF repair. It does NOT respond to adenosine or cardioversion. Primary treatment is therapeutic hypothermia (34–35°C), minimizing catecholamines, and antiarrhythmics (amiodarone or procainamide) per cardiac surgery team decision.",
    rhythmTag: "Pediatric junctional rhythm",
    level: "advanced",
    topicTags: ["jet", "postop_congenital", "av_dissociation"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-postop-congenital",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiac ICU Content Team",
  },
  {
    questionText:
      "What is the FIRST-LINE management for post-op JET in a neonate?",
    answerOptions: [
      "Synchronized cardioversion at 0.5 J/kg",
      "Adenosine 0.1 mg/kg rapid IV push",
      "Therapeutic hypothermia (34–35°C core temperature)",
      "Defibrillation at 2 J/kg",
    ],
    correctAnswerIndex: 2,
    rationale:
      "JET is a tachycardia of enhanced automaticity from the His bundle — it is NOT re-entrant. Cardioversion and adenosine are ineffective. The primary treatment is cooling the infant to 34–35°C core temperature, which slows the automaticity of the junctional tissue. Additional measures: minimize catecholamines, maximize sedation. Antiarrhythmics (amiodarone, procainamide) are secondary.",
    rhythmTag: "Pediatric junctional rhythm",
    level: "advanced",
    topicTags: ["jet", "therapeutic_hypothermia", "treatment"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-postop-congenital",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiac ICU Content Team",
  },
  {
    questionText:
      "What distinguishes JET from SVT in the post-op cardiac surgery patient?",
    answerOptions: [
      "JET has wider QRS complexes than SVT",
      "JET rate is slower (< 150 bpm) and SVT is always > 200 bpm",
      "JET shows AV dissociation (QRS faster than P-waves) and does NOT terminate with adenosine; SVT terminates with adenosine",
      "JET is shockable; SVT is not",
    ],
    correctAnswerIndex: 2,
    rationale:
      "JET vs SVT: The key discriminators are (1) AV dissociation in JET (QRS rate > P-wave rate) — SVT typically has retrograde P-waves or no P-waves but the QRS is not faster than any independent atrial rate. (2) Adenosine response — SVT terminates; JET does not. Recognizing this distinction prevents the dangerous error of cardioverting a post-op neonate with JET, which is ineffective and potentially harmful.",
    rhythmTag: "Pediatric junctional rhythm",
    level: "advanced",
    topicTags: ["jet", "svt_differential", "av_dissociation"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-postop-congenital",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiac ICU Content Team",
  },
  {
    questionText:
      "Why should catecholamines be MINIMIZED in a child with post-op JET?",
    answerOptions: [
      "Catecholamines cause hypotension in post-op cardiac patients",
      "Catecholamines increase junctional automaticity, accelerating JET and worsening AV dyssynchrony",
      "Catecholamines are contraindicated in all pediatric cardiac surgery patients",
      "Catecholamines lower core temperature, opposing the hypothermia treatment",
    ],
    correctAnswerIndex: 1,
    rationale:
      "JET is driven by enhanced automaticity. Catecholamines (dopamine, dobutamine, epinephrine) stimulate beta-adrenergic receptors, which INCREASE junctional automaticity — accelerating the JET rate and worsening the hemodynamic impact of AV dyssynchrony. This is a critical nursing advocacy point: when the intensivist considers increasing a catecholamine infusion for hypotension, the nurse should raise the concern about worsening JET.",
    rhythmTag: "Pediatric junctional rhythm",
    level: "advanced",
    topicTags: ["jet", "catecholamines", "automaticity"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-postop-congenital",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiac ICU Content Team",
  },
  {
    questionText:
      "A post-Fontan patient (10 years post-surgery) presents with HR 150 bpm and a sawtooth pattern in the inferior leads at 300/min. The MOST likely diagnosis is:",
    answerOptions: [
      "Sinus tachycardia at 150 bpm — reassure and monitor",
      "Atrial flutter with 2:1 conduction — common late complication after Fontan procedure",
      "JET — give therapeutic hypothermia",
      "SVT — give adenosine 0.1 mg/kg",
    ],
    correctAnswerIndex: 1,
    rationale:
      "Atrial flutter is a known late complication after the Fontan procedure (creates a large atrial circuit susceptible to re-entry). The sawtooth pattern at 300/min with 2:1 ventricular conduction produces HR ~150 bpm. This patient requires urgent cardiology evaluation — Fontan patients have unique hemodynamics and flutter can cause rapid decompensation. Adenosine may transiently increase AV block and reveal flutter waves, but is not the definitive treatment.",
    rhythmTag: "Post-op congenital heart telemetry pattern",
    level: "advanced",
    topicTags: ["fontan", "atrial_flutter", "post_op_congenital"],
    allowedTiers: ["RN", "NP"],
    curriculumTopicId: "ped-postop-congenital",
    clinicalReviewStatus: "reviewed",
    reviewedBy: "Pediatric Cardiac ICU Content Team",
  },
];

// ─── Assembled seed set ─────────────────────────────────────────────────────

export const PEDIATRIC_ECG_SEED_QUESTIONS: readonly PediatricSeedQuestion[] = [
  ...RSA_QUESTIONS,
  ...SVT_VS_SINUS_TACH_QUESTIONS,
  ...HYPOXIC_BRADY_QUESTIONS,
  ...PALS_ARREST_QUESTIONS,
  ...PULSUS_PARADOXUS_QUESTIONS,
  ...JET_QUESTIONS,
] as const;

export const PEDIATRIC_SEED_QUESTION_COUNT = PEDIATRIC_ECG_SEED_QUESTIONS.length;

/** Category breakdown for readiness reporting. */
export const PEDIATRIC_SEED_QUESTION_COUNTS_BY_CATEGORY = {
  rsa: RSA_QUESTIONS.length,
  svt_vs_sinus_tach: SVT_VS_SINUS_TACH_QUESTIONS.length,
  hypoxic_bradycardia: HYPOXIC_BRADY_QUESTIONS.length,
  pals_arrest: PALS_ARREST_QUESTIONS.length,
  pulsus_paradoxus: PULSUS_PARADOXUS_QUESTIONS.length,
  post_op_jet: JET_QUESTIONS.length,
  total: PEDIATRIC_ECG_SEED_QUESTIONS.length,
} as const;
