export type AuthorityDomain =
  | "ecg"
  | "pharmacology"
  | "pathophysiology"
  | "maternal_newborn"
  | "pediatrics"
  | "mental_health"
  | "adult_health"
  | "critical_care"
  | "prioritization"
  | "delegation"
  | "safety"
  | "clinical_judgment";

export type CognitiveSkill =
  | "recall"
  | "recognition"
  | "discrimination"
  | "prioritization"
  | "clinical_transfer"
  | "error_correction"
  | "metacognition"
  | "pattern_recognition";

export type AuthorityConcept = {
  id: string;
  domain: AuthorityDomain;
  title: string;
  description: string;
  requiredCognitiveSkills: readonly CognitiveSkill[];
  lookAlikes: readonly string[];
  highRiskMisconceptions: readonly string[];
  transferContexts: readonly string[];
  masteryEvidence: readonly string[];
};

export const AUTHORITY_CONCEPTS: readonly AuthorityConcept[] = [
  {
    id: "ecg-af-vs-flutter-vs-svt",
    domain: "ecg",
    title: "Differentiate AF, atrial flutter, and SVT",
    description: "Learner must use regularity, atrial activity, flutter-wave morphology, and onset pattern rather than rate alone.",
    requiredCognitiveSkills: ["pattern_recognition", "discrimination", "clinical_transfer", "metacognition"],
    lookAlikes: ["Atrial fibrillation", "Atrial flutter with 2:1 conduction", "SVT", "Sinus tachycardia"],
    highRiskMisconceptions: [
      "Any narrow tachycardia around 150 is SVT.",
      "Flutter waves are the same as P waves.",
      "Irregular tachycardia can be interpreted with the 300 method.",
    ],
    transferContexts: ["stable palpitations", "hypotensive tachycardia", "stroke-risk teaching", "telemetry alarm review"],
    masteryEvidence: [
      "Identifies irregularly irregular rhythm without P waves as AF.",
      "Recognizes sawtooth flutter waves and 2:1 conduction.",
      "Explains why sinus tachycardia has visible sinus P waves and gradual context-driven onset.",
    ],
  },
  {
    id: "ecg-av-blocks",
    domain: "ecg",
    title: "Differentiate first-degree, Mobitz I, Mobitz II, and third-degree AV block",
    description: "Learner must inspect PR behavior and P-QRS relationship rather than only noticing dropped beats.",
    requiredCognitiveSkills: ["discrimination", "pattern_recognition", "prioritization", "clinical_transfer"],
    lookAlikes: ["First-degree AV block", "Mobitz I", "Mobitz II", "Third-degree AV block", "nonconducted PACs"],
    highRiskMisconceptions: [
      "All dropped beats are Mobitz II.",
      "Complete heart block has no P waves.",
      "Mobitz I and Mobitz II have the same urgency.",
    ],
    transferContexts: ["inferior MI", "beta-blocker toxicity", "syncope", "pacing readiness"],
    masteryEvidence: [
      "Measures PR interval correctly.",
      "Identifies progressive PR lengthening in Mobitz I.",
      "Recognizes fixed PR with sudden dropped QRS as Mobitz II.",
      "Recognizes AV dissociation in third-degree block.",
    ],
  },
  {
    id: "ecg-wide-complex-tachycardia",
    domain: "ecg",
    title: "Treat uncertain wide-complex tachycardia as VT until proven otherwise",
    description: "Learner must prioritize patient safety and ACLS logic over overconfident rhythm labeling.",
    requiredCognitiveSkills: ["prioritization", "clinical_transfer", "discrimination", "metacognition"],
    lookAlikes: ["VT", "SVT with aberrancy", "paced rhythm", "hyperkalemia", "pre-excited AF"],
    highRiskMisconceptions: [
      "A stable patient cannot be in VT.",
      "A wide complex rhythm can be treated like ordinary SVT.",
      "Adenosine is always safe for tachycardia.",
    ],
    transferContexts: ["stable wide-complex tachycardia", "unstable tachycardia", "renal failure with hyperkalemia", "post-MI telemetry"],
    masteryEvidence: [
      "Checks pulse and stability first.",
      "Identifies regular wide-complex tachycardia as VT until proven otherwise.",
      "Avoids AV-nodal blockers in irregular wide-complex tachycardia or possible pre-excitation.",
    ],
  },
  {
    id: "pharm-beta-blocker-safety",
    domain: "pharmacology",
    title: "Beta-blocker safety and contraindication reasoning",
    description: "Learner must connect receptor effects, patient history, vital signs, and adverse-effect risk rather than memorizing a medication list.",
    requiredCognitiveSkills: ["clinical_transfer", "prioritization", "error_correction", "discrimination"],
    lookAlikes: ["beta blockers", "calcium-channel blockers", "digoxin", "bronchodilators"],
    highRiskMisconceptions: [
      "All heart-rate-lowering drugs are interchangeable.",
      "A medication is safe just because it is commonly prescribed.",
      "Respiratory history does not matter for cardiac medications.",
    ],
    transferContexts: ["asthma/COPD", "bradycardia", "heart failure", "post-MI discharge teaching"],
    masteryEvidence: [
      "Screens pulse and blood pressure before administration.",
      "Recognizes bronchospasm risk, especially with nonselective beta blockers.",
      "Differentiates beta blockers from calcium-channel blockers and digoxin by mechanism and nursing checks.",
    ],
  },
  {
    id: "priority-unstable-before-stable",
    domain: "prioritization",
    title: "Unstable before stable prioritization",
    description: "Learner must identify immediate physiologic threats instead of choosing the patient with the most familiar diagnosis.",
    requiredCognitiveSkills: ["prioritization", "clinical_transfer", "metacognition"],
    lookAlikes: ["acute instability", "chronic disease exacerbation", "expected finding", "psychosocial need"],
    highRiskMisconceptions: [
      "The scariest diagnosis is always the priority.",
      "Pain is always first even when airway/breathing/circulation are threatened.",
      "Stable abnormal findings outrank unstable normal-sounding complaints.",
    ],
    transferContexts: ["triage", "NCLEX priority item", "clinical judgment case", "rapid response escalation"],
    masteryEvidence: [
      "Uses airway, breathing, circulation, disability, exposure hierarchy.",
      "Prioritizes new/worsening/unstable findings over expected chronic findings.",
      "Explains why the tempting distractor is not first.",
    ],
  },
  {
    id: "maternal-late-decelerations",
    domain: "maternal_newborn",
    title: "Late decelerations and uteroplacental insufficiency",
    description: "Learner must connect fetal heart tracing patterns to oxygenation and maternal repositioning/resuscitative measures.",
    requiredCognitiveSkills: ["pattern_recognition", "prioritization", "clinical_transfer"],
    lookAlikes: ["early decelerations", "variable decelerations", "late decelerations", "prolonged decelerations"],
    highRiskMisconceptions: [
      "All decelerations are treated the same way.",
      "Late decelerations are reassuring if variability is present.",
      "The first action is to prepare delivery before intrauterine resuscitation.",
    ],
    transferContexts: ["labor monitoring", "oxytocin infusion", "maternal hypotension", "nonreassuring fetal status"],
    masteryEvidence: [
      "Identifies late decelerations by timing after contractions.",
      "Links pattern to uteroplacental insufficiency.",
      "Prioritizes repositioning, stopping oxytocin if applicable, fluids/oxygen per local policy, and escalation.",
    ],
  },
] as const;

export function getAuthorityConceptById(id: string): AuthorityConcept | undefined {
  return AUTHORITY_CONCEPTS.find((concept) => concept.id === id);
}

export function getAuthorityConceptsByDomain(domain: AuthorityDomain): readonly AuthorityConcept[] {
  return AUTHORITY_CONCEPTS.filter((concept) => concept.domain === domain);
}

export function getHighRiskMisconceptions(): readonly string[] {
  return AUTHORITY_CONCEPTS.flatMap((concept) => concept.highRiskMisconceptions);
}
