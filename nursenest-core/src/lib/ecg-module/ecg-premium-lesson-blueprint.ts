export type EcgPremiumCriterion = {
  label: string;
  finding: string;
  teachingPoint: string;
};

export type EcgPremiumDifferential = {
  comparedWith: string;
  whyItLooksSimilar: string;
  keyDistinguisher: string;
  nursingTrap: string;
};

export type EcgPremiumClinicalCase = {
  setting: string;
  patientPresentation: string;
  vitalSigns: string;
  learnerTask: string;
  priorityAction: string;
  rationale: string;
};

export type EcgPremiumLessonBlueprint = {
  rhythmTag: string;
  title: string;
  learnerLevel: "foundation" | "core" | "advanced";
  overview: string;
  electricalMechanism: string;
  stripAppearance: string;
  diagnosticCriteria: EcgPremiumCriterion[];
  signsAndSymptoms: string[];
  hemodynamicConsequences: string;
  commonCauses: string[];
  nursingPriorities: string[];
  managementFramework: {
    stable: string;
    unstable: string;
    pulseless?: string;
    escalation: string;
  };
  differentials: EcgPremiumDifferential[];
  examTraps: string[];
  clinicalCase: EcgPremiumClinicalCase;
  visualTeachingTargets: string[];
  internalLinks: { label: string; href: string }[];
};

const ECG_INTERNAL_LINKS = [
  { label: "ECG Interpretation", href: "/ecg-interpretation" },
  { label: "Advanced ECG for Nurses", href: "/advanced-ecg-nursing" },
  { label: "ECG Telemetry Mastery", href: "/ecg-telemetry-mastery" },
  { label: "ECG Practice Tests", href: "/app/practice-tests" },
  { label: "ECG Flashcards", href: "/app/flashcards" },
] as const;

export const ECG_PREMIUM_LESSON_BLUEPRINTS: EcgPremiumLessonBlueprint[] = [
  {
    rhythmTag: "atrial_fibrillation",
    title: "Atrial Fibrillation: Mechanism, ECG Criteria, Stroke Risk, and Nursing Priorities",
    learnerLevel: "core",
    overview:
      "Atrial fibrillation is a supraventricular rhythm caused by chaotic atrial electrical activity with no organized atrial contraction. Learners must connect the ECG pattern to loss of atrial kick, variable ventricular filling, and thromboembolic risk.",
    electricalMechanism:
      "Multiple competing atrial wavelets fire across the atria. The AV node receives irregular impulses and conducts only some of them, producing an irregularly irregular ventricular response.",
    stripAppearance:
      "No discrete P waves are visible. The baseline may appear fibrillatory, and R-R intervals are irregularly irregular because ventricular conduction depends on AV nodal refractoriness beat-to-beat.",
    diagnosticCriteria: [
      { label: "Rhythm", finding: "Irregularly irregular", teachingPoint: "No repeating R-R pattern should be present." },
      { label: "P waves", finding: "Absent", teachingPoint: "Do not call fibrillatory baseline activity organized P waves." },
      { label: "PR interval", finding: "Not measurable", teachingPoint: "PR cannot be measured when no consistent P wave precedes QRS." },
      { label: "QRS", finding: "Usually narrow unless aberrancy or bundle branch block is present", teachingPoint: "Wide AF requires careful evaluation for aberrancy, pre-excitation, or ventricular rhythm." },
      { label: "Ventricular rate", finding: "Slow, controlled, or rapid ventricular response", teachingPoint: "Rate category changes urgency and treatment framing." },
    ],
    signsAndSymptoms: ["Palpitations", "fatigue", "dyspnea", "dizziness", "chest discomfort", "syncope if rapid or unstable", "may be asymptomatic"],
    hemodynamicConsequences:
      "Loss of atrial kick reduces ventricular filling, especially in older adults, heart failure, LVH, and diastolic dysfunction. Rapid ventricular response shortens diastolic filling time and increases myocardial oxygen demand.",
    commonCauses: ["Hypertension", "heart failure", "valvular disease", "post-operative stress", "sepsis", "hyperthyroidism", "alcohol use", "pulmonary disease"],
    nursingPriorities: [
      "Assess hemodynamic stability first: blood pressure, mentation, chest pain, dyspnea, perfusion.",
      "Obtain rhythm strip/12-lead ECG and compare to baseline.",
      "Monitor for rapid ventricular response and signs of poor perfusion.",
      "Anticipate rate control, rhythm control, anticoagulation evaluation, or cardioversion depending on stability and orders.",
      "Educate on stroke symptoms and anticoagulation safety when prescribed.",
    ],
    managementFramework: {
      stable: "Rate/rhythm control and anticoagulation risk assessment based on provider orders and patient context.",
      unstable: "Prepare for synchronized cardioversion when AF causes hypotension, ischemic chest discomfort, pulmonary edema, shock, or altered mental status.",
      escalation: "Escalate rapidly for AF with RVR plus hypotension, ischemia, acute heart failure, or syncope.",
    },
    differentials: [
      {
        comparedWith: "Atrial flutter with variable block",
        whyItLooksSimilar: "Both can produce irregular ventricular response.",
        keyDistinguisher: "Flutter usually has organized sawtooth atrial activity, especially in inferior leads or V1.",
        nursingTrap: "Do not call every irregular narrow tachycardia AF without looking for flutter waves.",
      },
      {
        comparedWith: "Multifocal atrial tachycardia",
        whyItLooksSimilar: "Both are irregular narrow-complex rhythms.",
        keyDistinguisher: "MAT has at least three different P-wave morphologies; AF has no true P waves.",
        nursingTrap: "COPD patients may have MAT; missing P-wave morphology leads to wrong rhythm labeling.",
      },
    ],
    examTraps: [
      "Assuming anticoagulation is optional because the patient feels fine.",
      "Treating the monitor number without assessing perfusion.",
      "Calling fibrillatory baseline P waves.",
    ],
    clinicalCase: {
      setting: "Telemetry unit",
      patientPresentation: "A 74-year-old with heart failure reports palpitations and new dyspnea.",
      vitalSigns: "HR 142 irregular, BP 92/58, SpO2 91%, cool extremities.",
      learnerTask: "Decide whether this is stable AF with RVR or unstable deterioration.",
      priorityAction: "Assess perfusion, apply oxygen per protocol, obtain ECG, notify provider/rapid response, and prepare for synchronized cardioversion if ordered.",
      rationale: "Hypotension, dyspnea, and poor perfusion suggest AF is contributing to hemodynamic instability.",
    },
    visualTeachingTargets: ["Highlight absent P waves", "march irregular R-R intervals", "compare flutter waves vs fibrillatory baseline", "show atrial kick loss animation"],
    internalLinks: [...ECG_INTERNAL_LINKS],
  },
  {
    rhythmTag: "mobitz_ii",
    title: "Mobitz II: Dangerous AV Block Recognition and Nursing Escalation",
    learnerLevel: "core",
    overview:
      "Mobitz II is an infranodal conduction block where some atrial impulses fail suddenly without progressive PR prolongation. It is clinically important because it can progress to complete heart block.",
    electricalMechanism:
      "The AV node may conduct normally, but the His-Purkinje system intermittently fails. Because the block is below the AV node, escape rhythms can be unreliable and slow.",
    stripAppearance:
      "P waves march through at a regular atrial rate. Conducted beats have a constant PR interval, then a QRS is unexpectedly dropped without PR lengthening.",
    diagnosticCriteria: [
      { label: "Atrial rhythm", finding: "Usually regular P-P intervals", teachingPoint: "P waves keep marching even when QRS drops." },
      { label: "PR interval", finding: "Constant before conducted beats", teachingPoint: "No progressive lengthening distinguishes Mobitz II from Wenckebach." },
      { label: "Dropped beats", finding: "Sudden non-conducted P waves", teachingPoint: "A P wave appears without a following QRS." },
      { label: "QRS", finding: "Often wide if infranodal disease", teachingPoint: "Wide QRS increases concern for His-Purkinje disease." },
    ],
    signsAndSymptoms: ["Dizziness", "syncope", "fatigue", "hypotension", "chest pain", "shortness of breath", "may be asymptomatic initially"],
    hemodynamicConsequences:
      "Intermittent dropped ventricular beats reduce cardiac output. Progression to complete heart block can cause severe bradycardia, syncope, shock, or cardiac arrest.",
    commonCauses: ["Anterior MI", "degenerative conduction disease", "post-cardiac procedure", "myocarditis", "medication effects superimposed on conduction disease"],
    nursingPriorities: [
      "Assess symptoms and perfusion immediately.",
      "Notify provider urgently; this is not benign Wenckebach.",
      "Prepare for transcutaneous pacing if unstable or ordered.",
      "Place pacing pads/defibrillator access when risk is high.",
      "Review AV nodal blockers and potassium/magnesium trends per orders.",
    ],
    managementFramework: {
      stable: "Continuous monitoring, provider notification, pacing readiness, and evaluation for permanent pacemaker depending on cause.",
      unstable: "Follow symptomatic bradycardia pathway and prepare for pacing; atropine may be less reliable for infranodal block.",
      escalation: "Escalate for syncope, hypotension, chest pain, acute heart failure, or increasing dropped beats.",
    },
    differentials: [
      {
        comparedWith: "Mobitz I/Wenckebach",
        whyItLooksSimilar: "Both have intermittent dropped QRS complexes.",
        keyDistinguisher: "Mobitz I has progressive PR lengthening before the drop; Mobitz II has fixed PR intervals.",
        nursingTrap: "Calling Mobitz II benign delays pacing readiness.",
      },
      {
        comparedWith: "Blocked PACs",
        whyItLooksSimilar: "A premature P wave may not conduct and can mimic a dropped beat.",
        keyDistinguisher: "Blocked PACs occur early and deform the preceding T wave; Mobitz II P waves march regularly.",
        nursingTrap: "Missing regular P-P marching can overcall or undercall true AV block.",
      },
    ],
    examTraps: ["Confusing fixed PR with progressive PR", "assuming all second-degree blocks are low risk", "forgetting pacing readiness"],
    clinicalCase: {
      setting: "Step-down cardiac unit",
      patientPresentation: "A post-MI patient reports lightheadedness. Telemetry shows regular P waves with intermittent dropped QRS complexes and fixed PR on conducted beats.",
      vitalSigns: "HR 38, BP 86/50, pale and diaphoretic.",
      learnerTask: "Identify whether this is Mobitz I or Mobitz II and choose the safest priority.",
      priorityAction: "Activate urgent provider/rapid response, apply pacing pads, and prepare for transcutaneous pacing per protocol/orders.",
      rationale: "Symptomatic Mobitz II can progress to complete heart block and requires urgent pacing readiness.",
    },
    visualTeachingTargets: ["March P waves through dropped beats", "compare fixed PR vs Wenckebach ladder", "highlight non-conducted P waves", "show infranodal block location"],
    internalLinks: [...ECG_INTERNAL_LINKS],
  },
  {
    rhythmTag: "fascicular_vt",
    title: "Fascicular VT: RBBB Morphology, Left Axis Deviation, and Verapamil Sensitivity",
    learnerLevel: "advanced",
    overview:
      "Fascicular VT is an idiopathic ventricular tachycardia often seen in younger patients with structurally normal hearts. It is advanced because learners must connect fascicular anatomy to morphology, axis, and treatment response.",
    electricalMechanism:
      "A re-entry circuit involves the left posterior fascicle/Purkinje network and calcium-dependent tissue. This explains why verapamil can terminate many stable cases.",
    stripAppearance:
      "Classically regular wide-complex tachycardia with relatively narrow VT morphology, right bundle branch block pattern, and left axis deviation for left posterior fascicular VT.",
    diagnosticCriteria: [
      { label: "Rhythm", finding: "Regular wide-complex tachycardia", teachingPoint: "Treat as VT until proven otherwise." },
      { label: "Morphology", finding: "RBBB pattern", teachingPoint: "Left ventricular origin depolarizes toward the right, producing RBBB-like morphology." },
      { label: "Axis", finding: "Left axis deviation", teachingPoint: "Left posterior fascicle involvement directs activation superiorly/leftward." },
      { label: "Patient context", finding: "Often young or structurally normal heart", teachingPoint: "Stability does not exclude VT." },
      { label: "Response", finding: "Often verapamil-sensitive when stable", teachingPoint: "Mechanism involves calcium-dependent fascicular tissue." },
    ],
    signsAndSymptoms: ["Palpitations", "dizziness", "presyncope", "chest discomfort", "exercise intolerance", "may remain hemodynamically stable"],
    hemodynamicConsequences:
      "Cardiac output depends on rate, ventricular filling, and baseline function. Even idiopathic VT can become unstable if sustained or very rapid.",
    commonCauses: ["Idiopathic fascicular re-entry", "exercise or catecholamine trigger", "Purkinje system re-entry", "rare structural disease mimic"],
    nursingPriorities: [
      "Do not dismiss VT because the patient is young or initially stable.",
      "Assess perfusion and obtain a 12-lead ECG.",
      "Notify provider/cardiology and prepare for escalation if unstable.",
      "Anticipate verapamil only in stable, appropriately diagnosed cases per provider order.",
      "Prepare synchronized cardioversion if unstable.",
    ],
    managementFramework: {
      stable: "Provider-directed therapy may include verapamil after appropriate diagnosis and exclusion of unstable VT mimics.",
      unstable: "Synchronized cardioversion is the emergency pathway for unstable tachycardia with a pulse.",
      pulseless: "Defibrillation/CPR per pulseless arrest algorithm.",
      escalation: "Escalate for hypotension, syncope, ischemic symptoms, altered mental status, or signs of shock.",
    },
    differentials: [
      {
        comparedWith: "RVOT VT",
        whyItLooksSimilar: "Both may occur in structurally normal hearts and present as idiopathic VT.",
        keyDistinguisher: "RVOT VT typically has LBBB morphology and inferior axis, not RBBB with left axis deviation.",
        nursingTrap: "Memorizing 'young stable VT' without morphology leads to wrong subtype recognition.",
      },
      {
        comparedWith: "SVT with aberrancy",
        whyItLooksSimilar: "Both can be regular wide-complex tachycardias.",
        keyDistinguisher: "Fascicular VT has characteristic RBBB/LAD pattern and ventricular origin; wide-complex tachycardia should be treated as VT until proven otherwise.",
        nursingTrap: "Assuming stability means SVT can delay cardioversion readiness.",
      },
    ],
    examTraps: ["Thinking all VT patients are old or pulseless", "missing RBBB + LAD clue", "choosing adenosine-first logic for every regular tachycardia"],
    clinicalCase: {
      setting: "Emergency department telemetry bay",
      patientPresentation: "A 28-year-old reports sudden palpitations after exercise. ECG shows regular wide-complex tachycardia with RBBB morphology and left axis deviation.",
      vitalSigns: "HR 158, BP 118/72, alert, mild chest tightness.",
      learnerTask: "Identify why this is consistent with fascicular VT and what changes if the patient becomes unstable.",
      priorityAction: "Maintain monitoring, obtain expert/provider review, prepare escalation equipment, and anticipate provider-directed verapamil if stable or synchronized cardioversion if unstable.",
      rationale: "The morphology and axis pattern suggest fascicular VT; stability guides urgency but does not erase VT risk.",
    },
    visualTeachingTargets: ["left posterior fascicle circuit map", "RBBB morphology overlay", "axis arrow overlay", "RVOT VT vs fascicular VT comparison"],
    internalLinks: [...ECG_INTERNAL_LINKS],
  },
];

export function getEcgPremiumLessonBlueprint(rhythmTag: string): EcgPremiumLessonBlueprint | undefined {
  const normalized = rhythmTag.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return ECG_PREMIUM_LESSON_BLUEPRINTS.find((lesson) => lesson.rhythmTag === normalized || lesson.rhythmTag === rhythmTag);
}

export function assertEcgPremiumLessonBlueprintComplete(lesson: EcgPremiumLessonBlueprint): void {
  const failures: string[] = [];
  if (lesson.diagnosticCriteria.length < 4) failures.push("diagnosticCriteria must include at least 4 measurable criteria");
  if (lesson.signsAndSymptoms.length < 4) failures.push("signsAndSymptoms must include at least 4 patient findings");
  if (lesson.nursingPriorities.length < 4) failures.push("nursingPriorities must include at least 4 actions");
  if (lesson.commonCauses.length < 3) failures.push("commonCauses must include at least 3 etiologies");
  if (lesson.differentials.length < 2) failures.push("differentials must include at least 2 rhythm comparisons");
  if (lesson.examTraps.length < 3) failures.push("examTraps must include at least 3 traps");
  if (lesson.visualTeachingTargets.length < 3) failures.push("visualTeachingTargets must include at least 3 visual pedagogy targets");
  if (!lesson.clinicalCase.priorityAction || !lesson.clinicalCase.rationale) failures.push("clinicalCase must include priorityAction and rationale");
  if (!lesson.managementFramework.stable || !lesson.managementFramework.unstable || !lesson.managementFramework.escalation) {
    failures.push("managementFramework must include stable, unstable, and escalation framing");
  }
  if (failures.length > 0) {
    throw new Error(`${lesson.rhythmTag}: ${failures.join("; ")}`);
  }
}
