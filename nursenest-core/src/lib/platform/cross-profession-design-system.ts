export type CrossProfessionId =
  | "rn"
  | "rpn"
  | "np"
  | "rt"
  | "allied"
  | "new-grad"
  | "ecg"
  | "advanced-ecg";

export type AlliedProfessionId =
  | "respiratory-therapy"
  | "medical-laboratory"
  | "diagnostic-imaging"
  | "paramedicine"
  | "occupational-therapy"
  | "physiotherapy"
  | "speech-language-pathology"
  | "social-work"
  | "other-allied";

export type PremiumExperienceId =
  | "flashcards"
  | "practice-questions"
  | "analytics"
  | "pharmacology"
  | "clinical-skills"
  | "simulations";

export type PremiumCapabilityId =
  | "rationales"
  | "tutor-mode"
  | "hint-system"
  | "si-conv"
  | "community-performance"
  | "confidence-tracking"
  | "adaptive-remediation"
  | "theme-aware-visuals"
  | "mobile-optimization"
  | "mcq"
  | "sata"
  | "bowtie"
  | "matrix"
  | "prioritization"
  | "delegation"
  | "sequencing"
  | "case-studies"
  | "weak-areas"
  | "mastered-topics"
  | "confidence-trends"
  | "study-activity"
  | "performance-heat-maps"
  | "competency-tracking"
  | "learning-streaks"
  | "community-benchmarks"
  | "lesson"
  | "flashcards-link"
  | "questions-link"
  | "common-errors"
  | "clinical-reasoning"
  | "escalation-criteria"
  | "practice-scenarios"
  | "simulation-links";

export type ThemeContractId = "ocean" | "blossom" | "midnight" | "aurora" | "sunset";

export type PremiumExperienceContract = {
  readonly id: PremiumExperienceId;
  readonly sharedPrimitive: string;
  readonly requiredCapabilities: readonly PremiumCapabilityId[];
  readonly requiredProfessions: readonly CrossProfessionId[];
  readonly contentDiffersOnlyBy: readonly string[];
};

export type CrossProfessionProfile = {
  readonly id: CrossProfessionId;
  readonly label: string;
  readonly competencyDomains: readonly string[];
  readonly pharmacologyFocus: readonly string[];
  readonly clinicalSkillFocus: readonly string[];
  readonly simulationOpportunities: readonly string[];
  readonly analyticsDomains: readonly string[];
};

export type AlliedProfessionMap = {
  readonly id: AlliedProfessionId;
  readonly label: string;
  readonly competencies: readonly string[];
  readonly skills: readonly string[];
  readonly pharmacology: readonly string[];
  readonly clinicalJudgment: readonly string[];
  readonly simulationOpportunities: readonly string[];
  readonly analyticsDomains: readonly string[];
};

export type CrossProfessionQaRequirement = {
  readonly id: string;
  readonly label: string;
  readonly professions: readonly CrossProfessionId[];
  readonly themes: readonly ThemeContractId[];
  readonly artifacts: readonly string[];
};

export const CROSS_PROFESSION_IDS: readonly CrossProfessionId[] = [
  "rn",
  "rpn",
  "np",
  "rt",
  "allied",
  "new-grad",
  "ecg",
  "advanced-ecg",
] as const;

export const SHARED_THEME_CONTRACT: readonly ThemeContractId[] = [
  "ocean",
  "blossom",
  "midnight",
  "aurora",
  "sunset",
] as const;

const CORE_NON_ECG_PROFESSIONS: readonly CrossProfessionId[] = ["rn", "rpn", "np", "rt", "allied", "new-grad"] as const;

export const PREMIUM_EXPERIENCE_CONTRACTS: readonly PremiumExperienceContract[] = [
  {
    id: "flashcards",
    sharedPrimitive: "premium-flashcard-study-shell",
    requiredProfessions: CORE_NON_ECG_PROFESSIONS,
    requiredCapabilities: [
      "rationales",
      "tutor-mode",
      "hint-system",
      "si-conv",
      "community-performance",
      "confidence-tracking",
      "adaptive-remediation",
      "theme-aware-visuals",
      "mobile-optimization",
    ],
    contentDiffersOnlyBy: ["profession scope", "exam blueprint", "competency map", "entitlement"],
  },
  {
    id: "practice-questions",
    sharedPrimitive: "premium-assessment-runner",
    requiredProfessions: CORE_NON_ECG_PROFESSIONS,
    requiredCapabilities: ["mcq", "sata", "bowtie", "matrix", "prioritization", "delegation", "sequencing", "case-studies"],
    contentDiffersOnlyBy: ["scope of practice", "competency", "acuity", "exam format"],
  },
  {
    id: "analytics",
    sharedPrimitive: "premium-learner-analytics-framework",
    requiredProfessions: CROSS_PROFESSION_IDS,
    requiredCapabilities: [
      "weak-areas",
      "mastered-topics",
      "confidence-trends",
      "study-activity",
      "performance-heat-maps",
      "competency-tracking",
      "learning-streaks",
      "community-benchmarks",
    ],
    contentDiffersOnlyBy: ["competency labels", "benchmark cohort", "pathway goals"],
  },
  {
    id: "pharmacology",
    sharedPrimitive: "premium-pharmacology-framework",
    requiredProfessions: ["rn", "rpn", "np", "rt", "allied", "new-grad"],
    requiredCapabilities: ["rationales", "clinical-reasoning", "adaptive-remediation", "theme-aware-visuals", "mobile-optimization"],
    contentDiffersOnlyBy: ["medication scope", "prescribing authority", "monitoring depth", "clinical setting"],
  },
  {
    id: "clinical-skills",
    sharedPrimitive: "premium-clinical-skills-architecture",
    requiredProfessions: ["rn", "rpn", "np", "rt", "allied", "new-grad"],
    requiredCapabilities: [
      "lesson",
      "flashcards-link",
      "questions-link",
      "common-errors",
      "clinical-reasoning",
      "escalation-criteria",
      "practice-scenarios",
      "simulation-links",
    ],
    contentDiffersOnlyBy: ["profession skill", "scope", "setting", "competency"],
  },
  {
    id: "simulations",
    sharedPrimitive: "premium-simulation-engine",
    requiredProfessions: ["rn", "rpn", "np", "rt", "allied", "new-grad"],
    requiredCapabilities: ["clinical-reasoning", "adaptive-remediation", "competency-tracking", "theme-aware-visuals", "mobile-optimization"],
    contentDiffersOnlyBy: ["scenario type", "clinical authority", "workflow", "acuity"],
  },
] as const;

export const CROSS_PROFESSION_PROFILES: readonly CrossProfessionProfile[] = [
  {
    id: "rn",
    label: "RN",
    competencyDomains: ["clinical judgment", "medical-surgical", "maternal-child", "mental health", "leadership", "pharmacology"],
    pharmacologyFocus: ["medical-surgical medications", "high-alert safety", "patient teaching", "monitoring"],
    clinicalSkillFocus: ["assessment", "medication administration", "procedures", "delegation", "escalation"],
    simulationOpportunities: ["patient assignment management", "deterioration recognition", "prioritization", "handoff"],
    analyticsDomains: ["readiness", "weak areas", "confidence", "clinical judgment", "competency coverage"],
  },
  {
    id: "rpn",
    label: "RPN/LPN",
    competencyDomains: ["entry-to-practice care", "stable/common presentations", "medication administration", "communication", "documentation"],
    pharmacologyFocus: ["entry-to-practice medication administration", "common adverse effects", "safe monitoring", "when to consult"],
    clinicalSkillFocus: ["foundational care", "routine procedures", "stable patient assessment", "documentation"],
    simulationOpportunities: ["foundational patient care", "changes from baseline", "scope-aware escalation"],
    analyticsDomains: ["entry-level readiness", "safety", "communication", "foundational skills"],
  },
  {
    id: "np",
    label: "NP",
    competencyDomains: ["advanced assessment", "diagnostics", "prescribing", "management", "clinical reasoning"],
    pharmacologyFocus: ["advanced prescribing and therapeutics", "contraindications", "monitoring", "follow-up planning"],
    clinicalSkillFocus: ["advanced assessment", "diagnostic workup", "management decisions", "referral"],
    simulationOpportunities: ["advanced assessment and diagnosis", "management planning", "prescribing decisions"],
    analyticsDomains: ["diagnostic reasoning", "prescribing readiness", "case performance", "advanced clinical judgment"],
  },
  {
    id: "rt",
    label: "Respiratory Therapy",
    competencyDomains: ["airway management", "ventilation", "ABGs", "oxygen delivery", "respiratory emergencies"],
    pharmacologyFocus: ["bronchodilators", "steroids", "ventilation medications", "respiratory rescue therapies"],
    clinicalSkillFocus: ["ventilator management", "ABG interpretation", "oxygen delivery", "airway troubleshooting"],
    simulationOpportunities: ["ventilation and respiratory emergencies", "ABG deterioration", "waveform interpretation"],
    analyticsDomains: ["ventilation readiness", "ABG mastery", "airway management", "respiratory deterioration"],
  },
  {
    id: "allied",
    label: "Allied Health",
    competencyDomains: ["profession-specific competencies", "technical accuracy", "communication", "clinical decision-making"],
    pharmacologyFocus: ["profession-specific medications where applicable", "contraindication awareness", "handoff implications"],
    clinicalSkillFocus: ["profession-specific workflows", "documentation", "safety checks", "interprofessional communication"],
    simulationOpportunities: ["profession-specific workflows", "critical findings", "handoff and escalation"],
    analyticsDomains: ["competency tracking", "readiness", "technical accuracy", "workflow safety"],
  },
  {
    id: "new-grad",
    label: "New Graduate",
    competencyDomains: ["clinical confidence", "shift management", "medication safety", "telemetry", "communication", "prioritization"],
    pharmacologyFocus: ["medication confidence curriculum", "high-alert medications", "common first-year medications", "dosage calculations"],
    clinicalSkillFocus: ["first-year skills", "common mistakes", "escalation criteria", "documentation"],
    simulationOpportunities: ["transition-to-practice scenarios", "full patient assignments", "interruptions", "deterioration events"],
    analyticsDomains: ["orientation progress", "skill readiness", "medication readiness", "simulation readiness", "clinical confidence"],
  },
  {
    id: "ecg",
    label: "ECG Programs",
    competencyDomains: ["rhythm recognition", "clinical implications", "nursing actions", "monitoring"],
    pharmacologyFocus: ["ECG-relevant medication effects", "electrolytes", "rate/rhythm safety"],
    clinicalSkillFocus: ["lead placement", "strip interpretation", "artifact recognition", "escalation"],
    simulationOpportunities: ["rhythm recognition drills", "telemetry escalation", "ECG rationale review"],
    analyticsDomains: ["rhythm mastery", "interpretation confidence", "ECG progress", "weak rhythms"],
  },
  {
    id: "advanced-ecg",
    label: "Advanced ECG Programs",
    competencyDomains: ["complex rhythms", "blocks", "pacemakers", "telemetry", "advanced interpretation"],
    pharmacologyFocus: ["advanced ECG medication effects", "antiarrhythmics", "electrolyte-risk interpretation"],
    clinicalSkillFocus: ["complex strip interpretation", "paced rhythms", "12-lead review", "telemetry decisions"],
    simulationOpportunities: ["complex rhythm cases", "pacemaker failure", "telemetry deterioration", "advanced interpretation"],
    analyticsDomains: ["advanced rhythm mastery", "telemetry readiness", "complex rhythm confidence", "case performance"],
  },
] as const;

export const ALLIED_PROFESSION_MAPS: readonly AlliedProfessionMap[] = [
  {
    id: "respiratory-therapy",
    label: "Respiratory Therapy",
    competencies: ["ventilator management", "ABGs", "oxygen delivery", "airway management"],
    skills: ["ventilator troubleshooting", "ABG interpretation", "airway setup", "oxygen titration"],
    pharmacology: ["bronchodilators", "steroids", "nebulized medications"],
    clinicalJudgment: ["respiratory deterioration", "waveform interpretation", "escalation thresholds"],
    simulationOpportunities: ["ventilator emergency", "ABG trend", "airway obstruction"],
    analyticsDomains: ["ventilation readiness", "ABG mastery", "airway management"],
  },
  {
    id: "medical-laboratory",
    label: "Medical Laboratory Science",
    competencies: ["specimen collection", "quality control", "laboratory safety", "hematology"],
    skills: ["specimen integrity", "critical result reporting", "quality control review"],
    pharmacology: ["specimen-impacting medications", "anticoagulant tube implications"],
    clinicalJudgment: ["critical value recognition", "pre-analytic error detection", "result validity"],
    simulationOpportunities: ["critical result reporting", "hemolyzed specimen workflow", "QC failure response"],
    analyticsDomains: ["specimen quality", "critical results", "lab safety"],
  },
  {
    id: "diagnostic-imaging",
    label: "Diagnostic Imaging",
    competencies: ["patient positioning", "radiation safety", "contrast safety", "image quality"],
    skills: ["positioning", "contrast screening", "equipment safety", "patient preparation"],
    pharmacology: ["contrast reactions", "renal-risk screening", "sedation awareness"],
    clinicalJudgment: ["contrast contraindications", "urgent finding escalation", "patient instability"],
    simulationOpportunities: ["contrast reaction", "urgent imaging escalation", "unsafe transfer"],
    analyticsDomains: ["image workflow", "safety screening", "contrast readiness"],
  },
  {
    id: "paramedicine",
    label: "Paramedicine",
    competencies: ["scene safety", "triage", "airway", "cardiac emergencies", "trauma"],
    skills: ["scene assessment", "airway management", "transport decision", "trauma care"],
    pharmacology: ["emergency medications", "ACLS medications", "analgesia safety"],
    clinicalJudgment: ["scene risk", "transport priority", "time-sensitive pathways"],
    simulationOpportunities: ["prehospital emergency", "trauma scene", "overdose airway"],
    analyticsDomains: ["scene safety", "cardiac readiness", "transport decisions"],
  },
  {
    id: "occupational-therapy",
    label: "Occupational Therapy",
    competencies: ["functional assessment", "ADL training", "adaptive equipment", "discharge planning"],
    skills: ["ADL assessment", "equipment selection", "home safety review"],
    pharmacology: ["medication effects on function", "sedation/fall-risk awareness"],
    clinicalJudgment: ["functional risk", "safe discharge", "cognitive support"],
    simulationOpportunities: ["home safety planning", "adaptive equipment decision", "functional independence plan"],
    analyticsDomains: ["functional assessment", "ADL planning", "discharge readiness"],
  },
  {
    id: "physiotherapy",
    label: "Physiotherapy",
    competencies: ["mobility assessment", "exercise prescription", "rehabilitation planning", "falls prevention"],
    skills: ["gait assessment", "mobility progression", "exercise instruction"],
    pharmacology: ["medication effects on mobility", "orthostasis and fall-risk awareness"],
    clinicalJudgment: ["mobility safety", "activity tolerance", "rehab progression"],
    simulationOpportunities: ["mobility progression", "post-op ambulation", "discharge readiness"],
    analyticsDomains: ["mobility competency", "exercise prescription", "rehab planning"],
  },
  {
    id: "speech-language-pathology",
    label: "Speech-Language Pathology",
    competencies: ["swallowing assessment", "communication disorders", "cognitive rehabilitation"],
    skills: ["swallow screen interpretation", "communication support", "cognitive strategy planning"],
    pharmacology: ["medication effects on cognition/swallowing", "sedation awareness"],
    clinicalJudgment: ["aspiration risk", "communication barrier", "cognitive safety"],
    simulationOpportunities: ["swallowing assessment", "communication support", "cognitive rehab planning"],
    analyticsDomains: ["swallowing readiness", "communication planning", "cognitive support"],
  },
  {
    id: "social-work",
    label: "Social Work",
    competencies: ["crisis intervention", "case management", "mental health support", "discharge coordination"],
    skills: ["risk assessment", "resource navigation", "family meeting support"],
    pharmacology: ["medication adherence barriers", "substance-use considerations"],
    clinicalJudgment: ["crisis risk", "safety planning", "resource fit"],
    simulationOpportunities: ["crisis intervention", "discharge barrier", "family conflict"],
    analyticsDomains: ["crisis management", "case planning", "resource coordination"],
  },
  {
    id: "other-allied",
    label: "Other Supported Allied Professions",
    competencies: ["profession-specific competencies", "interprofessional communication", "safety", "documentation"],
    skills: ["workflow safety", "handoff", "competency documentation"],
    pharmacology: ["role-relevant medication awareness"],
    clinicalJudgment: ["scope-appropriate escalation", "safety cue recognition"],
    simulationOpportunities: ["profession-specific workflow", "critical finding escalation"],
    analyticsDomains: ["competency readiness", "workflow safety", "professional communication"],
  },
] as const;

export const CROSS_PROFESSION_QA_REQUIREMENTS: readonly CrossProfessionQaRequirement[] = [
  {
    id: "feature-release-matrix",
    label: "Every major feature release validates all first-class professions",
    professions: ["rn", "rpn", "np", "rt", "allied", "new-grad"],
    themes: SHARED_THEME_CONTRACT,
    artifacts: ["contract tests", "desktop screenshots", "mobile screenshots", "visual regression report"],
  },
  {
    id: "premium-experience-parity",
    label: "Premium study experiences use shared shells and semantic tokens",
    professions: CROSS_PROFESSION_IDS,
    themes: SHARED_THEME_CONTRACT,
    artifacts: ["shared primitive reference", "semantic token audit", "route screenshots"],
  },
] as const;

export function listPremiumExperienceContracts(): readonly PremiumExperienceContract[] {
  return PREMIUM_EXPERIENCE_CONTRACTS;
}

export function getCrossProfessionProfile(id: CrossProfessionId): CrossProfessionProfile {
  const profile = CROSS_PROFESSION_PROFILES.find((item) => item.id === id);
  if (!profile) throw new Error(`Unknown cross-profession profile: ${id}`);
  return profile;
}

export function listAlliedProfessionMaps(): readonly AlliedProfessionMap[] {
  return ALLIED_PROFESSION_MAPS;
}

export function professionsMissingExperience(experienceId: PremiumExperienceId): readonly CrossProfessionId[] {
  const contract = PREMIUM_EXPERIENCE_CONTRACTS.find((item) => item.id === experienceId);
  if (!contract) return CROSS_PROFESSION_IDS;
  return CROSS_PROFESSION_IDS.filter((profession) => !contract.requiredProfessions.includes(profession));
}

export function assertNoRnOnlyPremiumExperience(experienceId: PremiumExperienceId): boolean {
  const contract = PREMIUM_EXPERIENCE_CONTRACTS.find((item) => item.id === experienceId);
  if (!contract) return false;
  return contract.requiredProfessions.length > 1 && !contract.requiredProfessions.every((profession) => profession === "rn");
}
