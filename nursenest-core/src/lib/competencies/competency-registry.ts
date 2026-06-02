export type CompetencyProfession =
  | "RN"
  | "PN"
  | "NP"
  | "NEW_GRAD"
  | "RESPIRATORY_THERAPY"
  | "PARAMEDICINE"
  | "MLT"
  | "PT"
  | "OT"
  | "SOCIAL_WORK"
  | "PSYCHOTHERAPY"
  | "PSW";

export type CompetencyDomain =
  | "clinical_judgment"
  | "patient_safety"
  | "medication_safety"
  | "assessment"
  | "diagnostics"
  | "documentation"
  | "communication"
  | "professional_practice"
  | "emergency_response"
  | "rehabilitation"
  | "psychosocial_care"
  | "laboratory_practice"
  | "respiratory_care"
  | "longitudinal_growth";

export type CompetencyAssessmentMethod =
  | "knowledge"
  | "reasoning"
  | "simulation"
  | "clinical_skill"
  | "documentation"
  | "communication";

export type CompetencyAssetType =
  | "lesson"
  | "question"
  | "flashcard"
  | "simulation"
  | "clinical_skill"
  | "lab"
  | "ecg"
  | "study_plan"
  | "readiness_report";

export type RelatedCompetencyContent = Readonly<{
  lessons: readonly string[];
  questions: readonly string[];
  flashcards: readonly string[];
  simulations: readonly string[];
  clinicalSkills: readonly string[];
  labs: readonly string[];
  ecg: readonly string[];
}>;

export type CompetencyDefinition = Readonly<{
  id: string;
  name: string;
  domain: CompetencyDomain;
  profession: CompetencyProfession;
  readinessWeight: number;
  assessmentMethods: readonly CompetencyAssessmentMethod[];
  relatedContent: RelatedCompetencyContent;
  globalCore?: boolean;
  countryScopes?: readonly string[];
  examScopes?: readonly string[];
}>;

export type CompetencyEvidence = Readonly<{
  competencyId: string;
  method: CompetencyAssessmentMethod;
  score: number;
  sourceType: CompetencyAssetType;
  sourceId: string;
  completedAt: string;
}>;

export type CompetencyPassportStatus =
  | "earned"
  | "in_progress"
  | "requires_attention";

export type CompetencyPassportItem = Readonly<{
  competency: CompetencyDefinition;
  status: CompetencyPassportStatus;
  masteryScore: number;
  readinessContribution: number;
  verifiedMethods: readonly CompetencyAssessmentMethod[];
  missingMethods: readonly CompetencyAssessmentMethod[];
  evidenceCount: number;
}>;

export type LearnerCompetencyPassport = Readonly<{
  profession: CompetencyProfession;
  competenciesEarned: readonly CompetencyPassportItem[];
  competenciesInProgress: readonly CompetencyPassportItem[];
  competenciesRequiringAttention: readonly CompetencyPassportItem[];
  readinessTrend: "improving" | "stable" | "declining" | "insufficient_data";
  masteryTrend: "improving" | "stable" | "declining" | "insufficient_data";
  overallReadiness: number;
}>;

export type DigitalBadgeDefinition = Readonly<{
  id: string;
  name: string;
  description: string;
  professionScopes: readonly CompetencyProfession[];
  competencyIds: readonly string[];
  requiredMethods: readonly CompetencyAssessmentMethod[];
  minimumMasteryScore: number;
  evidenceBased: true;
}>;

export type ReadinessCertificateDefinition = Readonly<{
  id: string;
  name: string;
  profession: CompetencyProfession;
  competencyIds: readonly string[];
  minimumOverallReadiness: number;
  disclaimer: string;
}>;

const emptyRelatedContent: RelatedCompetencyContent = {
  lessons: [],
  questions: [],
  flashcards: [],
  simulations: [],
  clinicalSkills: [],
  labs: [],
  ecg: [],
};

function related(overrides: Partial<RelatedCompetencyContent>): RelatedCompetencyContent {
  return { ...emptyRelatedContent, ...overrides };
}

export const COMPETENCY_REGISTRY: readonly CompetencyDefinition[] = [
  {
    id: "rn_clinical_judgment_prioritization",
    name: "Clinical Judgment And Prioritization",
    domain: "clinical_judgment",
    profession: "RN",
    readinessWeight: 0.14,
    assessmentMethods: ["knowledge", "reasoning", "simulation"],
    relatedContent: related({
      lessons: ["prioritization", "clinical-judgment", "abc-priorities"],
      questions: ["prioritization", "ngn-case-study"],
      simulations: ["unstable-patient-prioritization"],
    }),
    globalCore: true,
    examScopes: ["NCLEX-RN"],
  },
  {
    id: "rn_medication_safety",
    name: "Medication Safety",
    domain: "medication_safety",
    profession: "RN",
    readinessWeight: 0.12,
    assessmentMethods: ["knowledge", "reasoning", "clinical_skill", "documentation"],
    relatedContent: related({
      lessons: ["medication-safety", "high-alert-medications"],
      flashcards: ["medication-safety"],
      clinicalSkills: ["medication-administration"],
    }),
    globalCore: true,
  },
  {
    id: "rn_ecg_foundations",
    name: "ECG Foundations",
    domain: "diagnostics",
    profession: "RN",
    readinessWeight: 0.08,
    assessmentMethods: ["knowledge", "reasoning", "simulation"],
    relatedContent: related({
      lessons: ["ecg-interpretation"],
      questions: ["ecg"],
      ecg: ["ecg-detective-mode", "telemetry-shift"],
    }),
    globalCore: true,
  },
  {
    id: "rn_abg_lab_interpretation",
    name: "ABG And Lab Interpretation",
    domain: "diagnostics",
    profession: "RN",
    readinessWeight: 0.08,
    assessmentMethods: ["knowledge", "reasoning", "simulation"],
    relatedContent: related({
      lessons: ["abg-interpretation", "lab-interpretation"],
      labs: ["clinical-lab-workstation"],
    }),
    globalCore: true,
  },
  {
    id: "rn_delegation_supervision",
    name: "Delegation And Supervision",
    domain: "professional_practice",
    profession: "RN",
    readinessWeight: 0.1,
    assessmentMethods: ["knowledge", "reasoning", "communication"],
    relatedContent: related({
      lessons: ["delegation", "scope-of-practice"],
      questions: ["delegation"],
      simulations: ["delegation-shift-scenario"],
    }),
    globalCore: true,
  },
  {
    id: "pn_stable_patient_monitoring",
    name: "Stable Patient Monitoring",
    domain: "assessment",
    profession: "PN",
    readinessWeight: 0.16,
    assessmentMethods: ["knowledge", "reasoning", "clinical_skill"],
    relatedContent: related({
      lessons: ["focused-assessment", "vital-signs"],
      clinicalSkills: ["vital-signs", "focused-assessment"],
    }),
    examScopes: ["REx-PN", "NCLEX-PN"],
  },
  {
    id: "pn_medication_administration",
    name: "Medication Administration",
    domain: "medication_safety",
    profession: "PN",
    readinessWeight: 0.14,
    assessmentMethods: ["knowledge", "clinical_skill", "documentation"],
    relatedContent: related({
      lessons: ["medication-administration", "medication-rights"],
      clinicalSkills: ["oral-medication-administration", "subcutaneous-injection"],
    }),
    examScopes: ["REx-PN", "NCLEX-PN"],
  },
  {
    id: "pn_documentation_reporting",
    name: "Documentation And Reporting",
    domain: "documentation",
    profession: "PN",
    readinessWeight: 0.1,
    assessmentMethods: ["documentation", "communication"],
    relatedContent: related({
      lessons: ["documentation", "reporting-changes"],
      simulations: ["change-in-condition-reporting"],
    }),
  },
  {
    id: "np_advanced_assessment",
    name: "Advanced Assessment",
    domain: "assessment",
    profession: "NP",
    readinessWeight: 0.14,
    assessmentMethods: ["knowledge", "reasoning", "clinical_skill", "documentation"],
    relatedContent: related({
      lessons: ["advanced-assessment"],
      clinicalSkills: ["advanced-history-physical"],
      simulations: ["np-diagnostic-visit"],
    }),
    globalCore: true,
    examScopes: ["FNP", "AGPCNP", "PMHNP", "WHNP", "PNP-PC", "CNPLE"],
  },
  {
    id: "np_diagnostic_reasoning",
    name: "Diagnostic Reasoning",
    domain: "diagnostics",
    profession: "NP",
    readinessWeight: 0.16,
    assessmentMethods: ["knowledge", "reasoning", "simulation"],
    relatedContent: related({
      lessons: ["differential-diagnosis"],
      questions: ["diagnostic-reasoning"],
      simulations: ["chest-pain-differential"],
    }),
    globalCore: true,
  },
  {
    id: "np_prescribing_safety",
    name: "Prescribing Safety",
    domain: "medication_safety",
    profession: "NP",
    readinessWeight: 0.14,
    assessmentMethods: ["knowledge", "reasoning", "documentation"],
    relatedContent: related({
      lessons: ["advanced-pharmacology", "prescribing-safety"],
      flashcards: ["advanced-pharmacology"],
      questions: ["np-pharmacology"],
    }),
    globalCore: true,
  },
  {
    id: "new_grad_shift_organization",
    name: "Shift Organization",
    domain: "professional_practice",
    profession: "NEW_GRAD",
    readinessWeight: 0.12,
    assessmentMethods: ["reasoning", "simulation", "documentation"],
    relatedContent: related({
      lessons: ["shift-organization", "time-management"],
      simulations: ["shift-management-simulator"],
    }),
  },
  {
    id: "new_grad_escalation_readiness",
    name: "Escalation Readiness",
    domain: "emergency_response",
    profession: "NEW_GRAD",
    readinessWeight: 0.16,
    assessmentMethods: ["reasoning", "simulation", "communication"],
    relatedContent: related({
      lessons: ["rapid-response", "provider-notification"],
      simulations: ["patient-deterioration"],
    }),
  },
  {
    id: "new_grad_documentation_excellence",
    name: "Documentation Excellence",
    domain: "documentation",
    profession: "NEW_GRAD",
    readinessWeight: 0.1,
    assessmentMethods: ["documentation", "communication"],
    relatedContent: related({
      lessons: ["documentation", "sbar"],
      simulations: ["documentation-exercise"],
    }),
  },
  {
    id: "rt_ventilator_foundations",
    name: "Ventilator Foundations",
    domain: "respiratory_care",
    profession: "RESPIRATORY_THERAPY",
    readinessWeight: 0.18,
    assessmentMethods: ["knowledge", "reasoning", "simulation", "clinical_skill"],
    relatedContent: related({
      lessons: ["ventilator-foundations"],
      simulations: ["ventilator-management"],
      clinicalSkills: ["ventilator-setup"],
    }),
  },
  {
    id: "rt_abg_interpretation",
    name: "ABG Interpretation",
    domain: "diagnostics",
    profession: "RESPIRATORY_THERAPY",
    readinessWeight: 0.14,
    assessmentMethods: ["knowledge", "reasoning"],
    relatedContent: related({
      lessons: ["abg-interpretation"],
      labs: ["abg-workstation"],
    }),
  },
  {
    id: "paramedic_scene_trauma_assessment",
    name: "Trauma Assessment",
    domain: "emergency_response",
    profession: "PARAMEDICINE",
    readinessWeight: 0.16,
    assessmentMethods: ["knowledge", "reasoning", "simulation", "communication"],
    relatedContent: related({
      lessons: ["trauma-assessment", "scene-safety"],
      simulations: ["trauma-call"],
    }),
  },
  {
    id: "paramedic_cardiac_emergency",
    name: "Cardiac Emergency Response",
    domain: "emergency_response",
    profession: "PARAMEDICINE",
    readinessWeight: 0.14,
    assessmentMethods: ["reasoning", "simulation", "communication"],
    relatedContent: related({
      lessons: ["cardiac-arrest", "acs"],
      ecg: ["prehospital-ecg"],
      simulations: ["cardiac-arrest-call"],
    }),
  },
  {
    id: "mlt_specimen_integrity",
    name: "Specimen Integrity",
    domain: "laboratory_practice",
    profession: "MLT",
    readinessWeight: 0.16,
    assessmentMethods: ["knowledge", "reasoning", "documentation"],
    relatedContent: related({
      lessons: ["specimen-integrity"],
      labs: ["specimen-rejection"],
    }),
  },
  {
    id: "mlt_critical_value_reporting",
    name: "Critical Value Reporting",
    domain: "communication",
    profession: "MLT",
    readinessWeight: 0.14,
    assessmentMethods: ["reasoning", "communication", "documentation"],
    relatedContent: related({
      lessons: ["critical-values"],
      simulations: ["critical-value-reporting"],
    }),
  },
  {
    id: "pt_mobility_assessment",
    name: "Mobility Assessment",
    domain: "rehabilitation",
    profession: "PT",
    readinessWeight: 0.16,
    assessmentMethods: ["knowledge", "clinical_skill", "documentation"],
    relatedContent: related({
      lessons: ["mobility-assessment"],
      clinicalSkills: ["gait-assessment", "transfer-assessment"],
    }),
  },
  {
    id: "pt_fall_prevention",
    name: "Fall Prevention",
    domain: "patient_safety",
    profession: "PT",
    readinessWeight: 0.12,
    assessmentMethods: ["reasoning", "clinical_skill", "communication"],
    relatedContent: related({
      lessons: ["fall-prevention"],
      simulations: ["fall-risk-plan"],
    }),
  },
  {
    id: "ot_adl_independence",
    name: "ADL Independence",
    domain: "rehabilitation",
    profession: "OT",
    readinessWeight: 0.16,
    assessmentMethods: ["knowledge", "clinical_skill", "communication"],
    relatedContent: related({
      lessons: ["activities-of-daily-living"],
      clinicalSkills: ["adl-assessment", "adaptive-equipment"],
    }),
  },
  {
    id: "ot_cognitive_function_screening",
    name: "Cognitive Function Screening",
    domain: "assessment",
    profession: "OT",
    readinessWeight: 0.12,
    assessmentMethods: ["knowledge", "clinical_skill", "documentation"],
    relatedContent: related({
      lessons: ["cognitive-screening"],
      simulations: ["home-safety-cognition"],
    }),
  },
  {
    id: "sw_psychosocial_assessment",
    name: "Psychosocial Assessment",
    domain: "psychosocial_care",
    profession: "SOCIAL_WORK",
    readinessWeight: 0.16,
    assessmentMethods: ["knowledge", "communication", "documentation"],
    relatedContent: related({
      lessons: ["psychosocial-assessment"],
      simulations: ["case-management-intake"],
    }),
  },
  {
    id: "sw_safeguarding_advocacy",
    name: "Safeguarding And Advocacy",
    domain: "patient_safety",
    profession: "SOCIAL_WORK",
    readinessWeight: 0.14,
    assessmentMethods: ["reasoning", "communication", "documentation"],
    relatedContent: related({
      lessons: ["safeguarding", "patient-advocacy"],
      simulations: ["mandatory-reporting"],
    }),
  },
  {
    id: "psychotherapy_therapeutic_alliance",
    name: "Therapeutic Alliance",
    domain: "communication",
    profession: "PSYCHOTHERAPY",
    readinessWeight: 0.16,
    assessmentMethods: ["communication", "simulation", "documentation"],
    relatedContent: related({
      lessons: ["therapeutic-alliance"],
      simulations: ["therapy-session-intake"],
    }),
  },
  {
    id: "psychotherapy_risk_assessment",
    name: "Risk Assessment",
    domain: "psychosocial_care",
    profession: "PSYCHOTHERAPY",
    readinessWeight: 0.16,
    assessmentMethods: ["reasoning", "communication", "documentation"],
    relatedContent: related({
      lessons: ["suicide-risk-assessment"],
      simulations: ["crisis-assessment"],
    }),
  },
  {
    id: "psw_personal_care_safety",
    name: "Personal Care Safety",
    domain: "patient_safety",
    profession: "PSW",
    readinessWeight: 0.16,
    assessmentMethods: ["knowledge", "clinical_skill", "communication"],
    relatedContent: related({
      lessons: ["personal-care", "infection-control"],
      clinicalSkills: ["safe-bathing", "infection-control"],
    }),
  },
  {
    id: "psw_reporting_change_condition",
    name: "Reporting Changes In Condition",
    domain: "communication",
    profession: "PSW",
    readinessWeight: 0.14,
    assessmentMethods: ["reasoning", "communication", "documentation"],
    relatedContent: related({
      lessons: ["reporting-changes"],
      simulations: ["resident-change-condition"],
    }),
  },
] as const;

export const DIGITAL_BADGES: readonly DigitalBadgeDefinition[] = [
  {
    id: "badge_medication_safety",
    name: "Medication Safety",
    description: "Evidence of safe medication reasoning, administration, monitoring, and documentation.",
    professionScopes: ["RN", "PN", "NP", "NEW_GRAD"],
    competencyIds: ["rn_medication_safety", "pn_medication_administration", "np_prescribing_safety"],
    requiredMethods: ["knowledge", "reasoning", "documentation"],
    minimumMasteryScore: 0.85,
    evidenceBased: true,
  },
  {
    id: "badge_clinical_judgment",
    name: "Clinical Judgment",
    description: "Evidence of recognizing cues, interpreting risk, prioritizing action, and evaluating outcomes.",
    professionScopes: ["RN", "PN", "NP", "NEW_GRAD"],
    competencyIds: ["rn_clinical_judgment_prioritization", "np_diagnostic_reasoning", "new_grad_escalation_readiness"],
    requiredMethods: ["reasoning", "simulation"],
    minimumMasteryScore: 0.85,
    evidenceBased: true,
  },
  {
    id: "badge_ecg_foundations",
    name: "ECG Foundations",
    description: "Evidence of ECG interpretation and rhythm-based clinical reasoning.",
    professionScopes: ["RN", "NP", "NEW_GRAD", "PARAMEDICINE"],
    competencyIds: ["rn_ecg_foundations", "paramedic_cardiac_emergency"],
    requiredMethods: ["knowledge", "reasoning"],
    minimumMasteryScore: 0.82,
    evidenceBased: true,
  },
  {
    id: "badge_abg_interpretation",
    name: "ABG Interpretation",
    description: "Evidence of acid-base and gas exchange interpretation.",
    professionScopes: ["RN", "RESPIRATORY_THERAPY"],
    competencyIds: ["rn_abg_lab_interpretation", "rt_abg_interpretation"],
    requiredMethods: ["knowledge", "reasoning"],
    minimumMasteryScore: 0.84,
    evidenceBased: true,
  },
  {
    id: "badge_documentation_excellence",
    name: "Documentation Excellence",
    description: "Evidence of accurate, timely, professional documentation.",
    professionScopes: ["RN", "PN", "NP", "NEW_GRAD", "MLT", "PT", "OT", "SOCIAL_WORK", "PSYCHOTHERAPY", "PSW"],
    competencyIds: ["pn_documentation_reporting", "new_grad_documentation_excellence", "mlt_critical_value_reporting"],
    requiredMethods: ["documentation"],
    minimumMasteryScore: 0.85,
    evidenceBased: true,
  },
  {
    id: "badge_delegation",
    name: "Delegation",
    description: "Evidence of scope-aware assignment, supervision, communication, and escalation.",
    professionScopes: ["RN", "NEW_GRAD"],
    competencyIds: ["rn_delegation_supervision", "new_grad_shift_organization"],
    requiredMethods: ["reasoning", "communication"],
    minimumMasteryScore: 0.85,
    evidenceBased: true,
  },
  {
    id: "badge_trauma_assessment",
    name: "Trauma Assessment",
    description: "Evidence of trauma assessment, scene decisions, and emergency prioritization.",
    professionScopes: ["PARAMEDICINE"],
    competencyIds: ["paramedic_scene_trauma_assessment"],
    requiredMethods: ["reasoning", "simulation"],
    minimumMasteryScore: 0.85,
    evidenceBased: true,
  },
  {
    id: "badge_ventilator_foundations",
    name: "Ventilator Foundations",
    description: "Evidence of ventilator setup, monitoring, troubleshooting, and escalation.",
    professionScopes: ["RESPIRATORY_THERAPY"],
    competencyIds: ["rt_ventilator_foundations"],
    requiredMethods: ["knowledge", "clinical_skill", "simulation"],
    minimumMasteryScore: 0.85,
    evidenceBased: true,
  },
];

const certificateDisclaimer =
  "Internal NurseNest readiness indicator only. This does not imply licensure, certification, legal scope, or employer credentialing.";

export const READINESS_CERTIFICATES: readonly ReadinessCertificateDefinition[] = [
  {
    id: "certificate_nclex_rn_readiness",
    name: "NCLEX-RN Readiness",
    profession: "RN",
    competencyIds: ["rn_clinical_judgment_prioritization", "rn_medication_safety", "rn_delegation_supervision"],
    minimumOverallReadiness: 0.85,
    disclaimer: certificateDisclaimer,
  },
  {
    id: "certificate_rex_pn_readiness",
    name: "REx-PN Readiness",
    profession: "PN",
    competencyIds: ["pn_stable_patient_monitoring", "pn_medication_administration", "pn_documentation_reporting"],
    minimumOverallReadiness: 0.85,
    disclaimer: certificateDisclaimer,
  },
  {
    id: "certificate_cnple_readiness",
    name: "CNPLE Readiness",
    profession: "NP",
    competencyIds: ["np_advanced_assessment", "np_diagnostic_reasoning", "np_prescribing_safety"],
    minimumOverallReadiness: 0.85,
    disclaimer: certificateDisclaimer,
  },
  {
    id: "certificate_new_grad_readiness",
    name: "New Graduate Readiness",
    profession: "NEW_GRAD",
    competencyIds: ["new_grad_shift_organization", "new_grad_escalation_readiness", "new_grad_documentation_excellence"],
    minimumOverallReadiness: 0.85,
    disclaimer: certificateDisclaimer,
  },
  {
    id: "certificate_respiratory_therapy_readiness",
    name: "Respiratory Therapy Readiness",
    profession: "RESPIRATORY_THERAPY",
    competencyIds: ["rt_ventilator_foundations", "rt_abg_interpretation"],
    minimumOverallReadiness: 0.85,
    disclaimer: certificateDisclaimer,
  },
  {
    id: "certificate_paramedic_readiness",
    name: "Paramedic Readiness",
    profession: "PARAMEDICINE",
    competencyIds: ["paramedic_scene_trauma_assessment", "paramedic_cardiac_emergency"],
    minimumOverallReadiness: 0.85,
    disclaimer: certificateDisclaimer,
  },
];

export const INTERNATIONAL_COMPETENCY_SCOPES = {
  globalCore: ["clinical_judgment", "patient_safety", "assessment", "communication", "documentation"],
  countrySpecific: ["professional_practice"],
  examSpecific: ["diagnostics", "medication_safety"],
  professional: ["respiratory_care", "laboratory_practice", "rehabilitation", "psychosocial_care"],
} as const;

export type EducationalAssetCompetencyInput = Readonly<{
  id: string;
  type: CompetencyAssetType;
  profession?: CompetencyProfession;
  title?: string;
  topic?: string;
  tags?: readonly string[];
  competencyIds?: readonly string[];
}>;

function normalizeText(value: string | undefined): string {
  return value?.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim() ?? "";
}

function matchesAsset(competency: CompetencyDefinition, input: EducationalAssetCompetencyInput): boolean {
  if (input.profession && competency.profession !== input.profession) return false;
  const haystack = [
    normalizeText(input.title),
    normalizeText(input.topic),
    ...(input.tags ?? []).map(normalizeText),
  ].join(" ");
  if (!haystack) return false;
  const terms = [
    competency.name,
    competency.domain,
    ...competency.relatedContent.lessons,
    ...competency.relatedContent.questions,
    ...competency.relatedContent.flashcards,
    ...competency.relatedContent.simulations,
    ...competency.relatedContent.clinicalSkills,
    ...competency.relatedContent.labs,
    ...competency.relatedContent.ecg,
  ].map(normalizeText);
  return terms.some((term) => term.length > 2 && haystack.includes(term));
}

export function listCompetenciesForProfession(profession: CompetencyProfession): readonly CompetencyDefinition[] {
  return COMPETENCY_REGISTRY.filter((competency) => competency.profession === profession);
}

export function getCompetencyById(id: string): CompetencyDefinition | null {
  return COMPETENCY_REGISTRY.find((competency) => competency.id === id) ?? null;
}

export function resolveCompetenciesForEducationalAsset(
  input: EducationalAssetCompetencyInput,
): readonly CompetencyDefinition[] {
  const explicit = (input.competencyIds ?? [])
    .map(getCompetencyById)
    .filter((competency): competency is CompetencyDefinition => Boolean(competency));
  if (explicit.length > 0) return explicit;

  const matches = COMPETENCY_REGISTRY.filter((competency) => matchesAsset(competency, input));
  if (matches.length > 0) return matches;

  if (input.profession) {
    return listCompetenciesForProfession(input.profession).slice(0, 1);
  }

  return [];
}

function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clampScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(1, score));
}

export function buildLearnerCompetencyPassport(args: {
  profession: CompetencyProfession;
  evidence: readonly CompetencyEvidence[];
  previousOverallReadiness?: number | null;
  previousMasteryScore?: number | null;
}): LearnerCompetencyPassport {
  const competencies = listCompetenciesForProfession(args.profession);
  const items = competencies.map((competency): CompetencyPassportItem => {
    const evidence = args.evidence.filter((entry) => entry.competencyId === competency.id);
    const verifiedMethods = Array.from(new Set(evidence.map((entry) => entry.method)));
    const missingMethods = competency.assessmentMethods.filter((method) => !verifiedMethods.includes(method));
    const masteryScore = clampScore(average(evidence.map((entry) => clampScore(entry.score))));
    const readinessContribution = masteryScore * competency.readinessWeight;
    const status: CompetencyPassportStatus =
      masteryScore >= 0.85 && missingMethods.length === 0
        ? "earned"
        : masteryScore >= 0.65 || evidence.length > 0
          ? "in_progress"
          : "requires_attention";

    return {
      competency,
      status,
      masteryScore,
      readinessContribution,
      verifiedMethods,
      missingMethods,
      evidenceCount: evidence.length,
    };
  });
  const maxWeight = competencies.reduce((sum, competency) => sum + competency.readinessWeight, 0);
  const overallReadiness = maxWeight > 0
    ? clampScore(items.reduce((sum, item) => sum + item.readinessContribution, 0) / maxWeight)
    : 0;
  const masteryScore = average(items.map((item) => item.masteryScore));
  const readinessTrend = args.previousOverallReadiness == null
    ? "insufficient_data"
    : overallReadiness > args.previousOverallReadiness + 0.02
      ? "improving"
      : overallReadiness < args.previousOverallReadiness - 0.02
        ? "declining"
        : "stable";
  const masteryTrend = args.previousMasteryScore == null
    ? "insufficient_data"
    : masteryScore > args.previousMasteryScore + 0.02
      ? "improving"
      : masteryScore < args.previousMasteryScore - 0.02
        ? "declining"
        : "stable";

  return {
    profession: args.profession,
    competenciesEarned: items.filter((item) => item.status === "earned"),
    competenciesInProgress: items.filter((item) => item.status === "in_progress"),
    competenciesRequiringAttention: items.filter((item) => item.status === "requires_attention"),
    readinessTrend,
    masteryTrend,
    overallReadiness,
  };
}

export function listEarnedBadges(passport: LearnerCompetencyPassport): readonly DigitalBadgeDefinition[] {
  const earnedCompetencyIds = new Set(passport.competenciesEarned.map((item) => item.competency.id));
  return DIGITAL_BADGES.filter((badge) => {
    if (!badge.professionScopes.includes(passport.profession)) return false;
    const scopedCompetencyIds = badge.competencyIds.filter((id) => {
      const competency = getCompetencyById(id);
      return competency?.profession === passport.profession;
    });
    return scopedCompetencyIds.length > 0 && scopedCompetencyIds.every((id) => earnedCompetencyIds.has(id));
  });
}

export function listAvailableReadinessCertificates(
  passport: LearnerCompetencyPassport,
): readonly ReadinessCertificateDefinition[] {
  const earnedCompetencyIds = new Set(passport.competenciesEarned.map((item) => item.competency.id));
  return READINESS_CERTIFICATES.filter((certificate) => {
    return certificate.profession === passport.profession &&
      passport.overallReadiness >= certificate.minimumOverallReadiness &&
      certificate.competencyIds.every((id) => earnedCompetencyIds.has(id));
  });
}

export function buildCompetencyFrameworkDashboard() {
  const professions = Array.from(new Set(COMPETENCY_REGISTRY.map((competency) => competency.profession)));
  const professionReadiness = professions.map((profession) => {
    const competencies = listCompetenciesForProfession(profession);
    const badges = DIGITAL_BADGES.filter((badge) => badge.professionScopes.includes(profession));
    const certificates = READINESS_CERTIFICATES.filter((certificate) => certificate.profession === profession);
    return {
      profession,
      competencyCount: competencies.length,
      averageReadinessWeight: average(competencies.map((competency) => competency.readinessWeight)),
      badgeCount: badges.length,
      certificateCount: certificates.length,
      institutionalReady: competencies.length >= 2 && badges.length >= 1,
      launchReady: competencies.length >= 2 && badges.length >= 1 && certificates.length >= 0,
    };
  });
  const mappedContentSlots = COMPETENCY_REGISTRY.reduce((sum, competency) => {
    const relatedContent = competency.relatedContent;
    return sum +
      relatedContent.lessons.length +
      relatedContent.questions.length +
      relatedContent.flashcards.length +
      relatedContent.simulations.length +
      relatedContent.clinicalSkills.length +
      relatedContent.labs.length +
      relatedContent.ecg.length;
  }, 0);

  return {
    professionReadiness,
    competencyCoverage: {
      totalCompetencies: COMPETENCY_REGISTRY.length,
      professionsCovered: professionReadiness.length,
      mappedContentSlots,
      globalCoreCompetencies: COMPETENCY_REGISTRY.filter((competency) => competency.globalCore).length,
    },
    badgeCoverage: {
      totalBadges: DIGITAL_BADGES.length,
      evidenceBasedBadges: DIGITAL_BADGES.filter((badge) => badge.evidenceBased).length,
    },
    institutionalReadiness: {
      professionsReadyForReporting: professionReadiness.filter((row) => row.institutionalReady).length,
      supportedReports: ["Competency Growth", "Weak Areas", "Mastery Areas", "Cohort Trends"],
    },
    launchReadiness: {
      professionsWithLaunchCoverage: professionReadiness.filter((row) => row.launchReady).length,
      internalCertificateDisclaimer: certificateDisclaimer,
    },
  } as const;
}

export function validateCompetencyRegistry(): readonly string[] {
  const issues: string[] = [];
  const ids = new Set<string>();
  const requiredProfessions: readonly CompetencyProfession[] = [
    "RN",
    "PN",
    "NP",
    "NEW_GRAD",
    "RESPIRATORY_THERAPY",
    "PARAMEDICINE",
    "MLT",
    "PT",
    "OT",
    "SOCIAL_WORK",
    "PSYCHOTHERAPY",
    "PSW",
  ];

  for (const competency of COMPETENCY_REGISTRY) {
    if (ids.has(competency.id)) issues.push(`Duplicate competency id: ${competency.id}`);
    ids.add(competency.id);
    if (!competency.name.trim()) issues.push(`${competency.id} is missing a name`);
    if (competency.readinessWeight <= 0 || competency.readinessWeight > 1) {
      issues.push(`${competency.id} has invalid readinessWeight`);
    }
    if (competency.assessmentMethods.length === 0) issues.push(`${competency.id} has no assessment methods`);
    const relatedCount = Object.values(competency.relatedContent).reduce((sum, entries) => sum + entries.length, 0);
    if (relatedCount === 0) issues.push(`${competency.id} has no related content`);
  }

  for (const profession of requiredProfessions) {
    if (listCompetenciesForProfession(profession).length === 0) {
      issues.push(`Missing competency coverage for ${profession}`);
    }
  }

  for (const badge of DIGITAL_BADGES) {
    for (const competencyId of badge.competencyIds) {
      if (!ids.has(competencyId)) issues.push(`${badge.id} references missing competency ${competencyId}`);
    }
    if (badge.requiredMethods.length === 0) issues.push(`${badge.id} has no required methods`);
    if (badge.minimumMasteryScore < 0.7 || badge.minimumMasteryScore > 1) {
      issues.push(`${badge.id} has invalid minimumMasteryScore`);
    }
  }

  for (const certificate of READINESS_CERTIFICATES) {
    if (!certificate.disclaimer.includes("does not imply licensure")) {
      issues.push(`${certificate.id} must include internal readiness disclaimer`);
    }
    for (const competencyId of certificate.competencyIds) {
      if (!ids.has(competencyId)) issues.push(`${certificate.id} references missing competency ${competencyId}`);
    }
  }

  return issues;
}
