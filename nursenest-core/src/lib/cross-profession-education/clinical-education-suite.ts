export type ClinicalEducationProfessionId =
  | "rn"
  | "rpn-lpn"
  | "np"
  | "respiratory-therapy"
  | "paramedicine"
  | "occupational-therapy"
  | "physiotherapy"
  | "medical-laboratory-technology"
  | "psw"
  | "social-work"
  | "psychotherapy";

export type ClinicalEducationToolId =
  | "clinical-prep-builder"
  | "documentation-academy"
  | "concept-map-generator"
  | "clinical-reasoning-builder"
  | "reflection-journal"
  | "patient-assignment-organizer"
  | "simulation-preparation"
  | "clinical-skills-companion"
  | "placement-success-tracker"
  | "competency-portfolio";

export type ProfessionProfile = {
  readonly id: ClinicalEducationProfessionId;
  readonly label: string;
  readonly learnerPositioning: string;
  readonly competencies: readonly string[];
  readonly scopeOfPractice: readonly string[];
  readonly documentationStandards: readonly string[];
  readonly assessmentFrameworks: readonly string[];
  readonly clinicalReasoningFrameworks: readonly string[];
  readonly placementRequirements: readonly string[];
  readonly licensingExamAlignment: readonly string[];
  readonly adaptations: readonly string[];
  readonly commonScenarios: readonly string[];
  readonly interprofessionalContribution: string;
};

export type SuiteTool = {
  readonly id: ClinicalEducationToolId;
  readonly title: string;
  readonly sharedPurpose: string;
  readonly professionAdaptation: string;
  readonly activities: readonly string[];
  readonly documentationOutput: string;
  readonly simulationHooks: readonly string[];
  readonly portfolioEvidence: readonly string[];
};

export type CompetencyPortfolio = {
  readonly skillTracking: readonly string[];
  readonly competencyAchievement: readonly string[];
  readonly placementLogs: readonly string[];
  readonly instructorFeedbackTracking: readonly string[];
  readonly learningReflections: readonly string[];
  readonly professionalDevelopmentPlans: readonly string[];
};

export type PlacementPreparation = {
  readonly preparationSheets: readonly string[];
  readonly instructorQuestions: readonly string[];
  readonly caseStudies: readonly string[];
  readonly skillsReviews: readonly string[];
  readonly commonScenarios: readonly string[];
};

export type DocumentationTraining = {
  readonly formats: readonly string[];
  readonly practiceTasks: readonly string[];
  readonly safetyChecks: readonly string[];
};

export type SimulationEcosystem = {
  readonly decisionMaking: readonly string[];
  readonly documentation: readonly string[];
  readonly communication: readonly string[];
  readonly clinicalReasoning: readonly string[];
  readonly safety: readonly string[];
  readonly escalation: readonly string[];
  readonly interprofessionalCollaboration: readonly string[];
};

export type InterprofessionalContribution = {
  readonly professionId: ClinicalEducationProfessionId;
  readonly professionLabel: string;
  readonly contribution: string;
  readonly handoffNeed: string;
};

export type ClinicalEducationSuite = {
  readonly selectedProfession: ProfessionProfile;
  readonly availableProfessions: readonly ProfessionProfile[];
  readonly tools: readonly SuiteTool[];
  readonly competencyPortfolio: CompetencyPortfolio;
  readonly placementPreparation: PlacementPreparation;
  readonly documentationTraining: DocumentationTraining;
  readonly simulationEcosystem: SimulationEcosystem;
  readonly interprofessionalCase: {
    readonly title: string;
    readonly patientSummary: string;
    readonly learningGoal: string;
    readonly contributions: readonly InterprofessionalContribution[];
  };
  readonly qualityGuards: readonly string[];
};

const CORE_TOOL_ORDER: readonly ClinicalEducationToolId[] = [
  "clinical-prep-builder",
  "documentation-academy",
  "concept-map-generator",
  "clinical-reasoning-builder",
  "reflection-journal",
  "patient-assignment-organizer",
  "simulation-preparation",
  "clinical-skills-companion",
  "placement-success-tracker",
  "competency-portfolio",
] as const;

const TOOL_SHARED_PURPOSE: Record<ClinicalEducationToolId, { readonly title: string; readonly purpose: string }> = {
  "clinical-prep-builder": {
    title: "Clinical Prep Builder",
    purpose: "Turns a learner's assigned client, patient, or case into focused pre-placement preparation.",
  },
  "documentation-academy": {
    title: "Documentation Academy",
    purpose: "Teaches accurate, objective, legally aware professional documentation through active practice.",
  },
  "concept-map-generator": {
    title: "Concept Map Generator",
    purpose: "Connects findings, risks, priorities, interventions, and outcomes into a clinical reasoning map.",
  },
  "clinical-reasoning-builder": {
    title: "Clinical Reasoning Builder",
    purpose: "Guides learners through cue recognition, hypothesis generation, action planning, and evaluation.",
  },
  "reflection-journal": {
    title: "Reflection Journal",
    purpose: "Transforms placement experiences into structured learning, feedback, and professional growth.",
  },
  "patient-assignment-organizer": {
    title: "Patient Assignment Organizer",
    purpose: "Organizes case information, tasks, risks, notes, handoffs, and time-sensitive priorities.",
  },
  "simulation-preparation": {
    title: "Simulation Preparation",
    purpose: "Prepares learners for scenario-based decision making, communication, documentation, and safety.",
  },
  "clinical-skills-companion": {
    title: "Clinical Skills Companion",
    purpose: "Links skills practice to scope, safety checks, common errors, and competency evidence.",
  },
  "placement-success-tracker": {
    title: "Clinical Placement Success Tracker",
    purpose: "Tracks placement progress, competency evidence, feedback, weak areas, and readiness milestones.",
  },
  "competency-portfolio": {
    title: "Competency Portfolio",
    purpose: "Builds a longitudinal record of skills, reflections, feedback, and professional development.",
  },
} as const;

export const CLINICAL_EDUCATION_PROFESSIONS: readonly ProfessionProfile[] = [
  {
    id: "rn",
    label: "Registered Nurse",
    learnerPositioning: "For RN students and new graduates learning holistic assessment, prioritization, care planning, and clinical judgment.",
    competencies: ["comprehensive assessment", "clinical judgment", "care planning", "delegation", "patient education", "interprofessional collaboration"],
    scopeOfPractice: ["assess unstable or complex patients", "prioritize competing needs", "implement and evaluate nursing interventions", "coordinate care within RN scope"],
    documentationStandards: ["SOAP notes", "DAR charting", "SBAR handoff", "shift notes", "medication administration records", "care plan documentation"],
    assessmentFrameworks: ["head-to-toe assessment", "focused assessment", "ABCs", "Maslow", "clinical deterioration cues"],
    clinicalReasoningFrameworks: ["NCJMM", "priority frameworks", "nursing process", "safety-risk analysis"],
    placementRequirements: ["unit preparation", "medication review", "care plans", "nursing diagnosis links", "instructor questioning", "safe delegation awareness"],
    licensingExamAlignment: ["NCLEX-RN", "Canadian NCLEX-RN", "jurisdiction-specific RN professional standards"],
    adaptations: ["nursing diagnoses", "care plans", "NCLEX-style judgment", "REx-PN/CNPLE handoff context when comparing roles"],
    commonScenarios: ["deteriorating medical-surgical patient", "post-operative care", "medication safety", "discharge teaching"],
    interprofessionalContribution: "Synthesizes assessment findings, nursing priorities, medication safety, patient education, and escalation needs.",
  },
  {
    id: "rpn-lpn",
    label: "RPN/LPN",
    learnerPositioning: "For practical nursing learners building safe foundational care, monitoring, documentation, and timely escalation.",
    competencies: ["focused assessment", "stable patient care", "medication administration", "safety monitoring", "documentation", "scope-aware escalation"],
    scopeOfPractice: ["recognize changes from baseline", "monitor stable or predictable patients", "provide foundational interventions", "escalate concerns to RN/provider"],
    documentationStandards: ["focused nursing notes", "DAR charting", "SBAR escalation notes", "medication documentation", "personal care and safety documentation"],
    assessmentFrameworks: ["focused body-system checks", "baseline comparison", "risk screening", "vital sign trend review"],
    clinicalReasoningFrameworks: ["recognize-monitor-escalate", "safety-first prioritization", "scope-of-practice decision checks"],
    placementRequirements: ["basic care planning", "medication pass preparation", "focused assessments", "instructor questions on safety and escalation"],
    licensingExamAlignment: ["REx-PN", "NCLEX-PN", "practical nursing entry-to-practice competencies"],
    adaptations: ["practical nursing scope", "escalation triggers", "stable/common presentations", "REx-PN and NCLEX-PN readiness"],
    commonScenarios: ["falls risk", "diabetes monitoring", "COPD dyspnea", "post-op routine care"],
    interprofessionalContribution: "Monitors baseline changes, completes safe practical nursing interventions, documents clearly, and escalates concerns early.",
  },
  {
    id: "np",
    label: "Nurse Practitioner",
    learnerPositioning: "For NP learners practicing advanced assessment, diagnostics, management plans, prescribing considerations, and follow-up.",
    competencies: ["advanced health assessment", "diagnostic reasoning", "differential diagnosis", "guideline-informed management", "prescribing considerations", "follow-up planning"],
    scopeOfPractice: ["form diagnostic hypotheses", "order and interpret diagnostics where authorized", "develop treatment plans", "prescribe where authorized", "manage longitudinal care"],
    documentationStandards: ["advanced SOAP notes", "differential diagnosis documentation", "assessment and plan", "prescribing rationale", "follow-up and referral documentation"],
    assessmentFrameworks: ["advanced focused assessment", "risk stratification", "red-flag screening", "diagnostic workup planning"],
    clinicalReasoningFrameworks: ["diagnostic reasoning", "illness scripts", "hypothesis testing", "guideline-based management"],
    placementRequirements: ["case presentations", "differential lists", "diagnostic plans", "prescribing review", "follow-up and safety-netting"],
    licensingExamAlignment: ["CNPLE", "FNP", "AGPCNP", "PMHNP", "PNP-PC", "WHNP", "ENP"],
    adaptations: ["advanced diagnostics", "differential diagnosis", "prescribing relevance", "longitudinal management", "specialty certification alignment"],
    commonScenarios: ["chronic disease follow-up", "acute complaint triage", "medication adjustment discussion", "complex comorbidity management"],
    interprofessionalContribution: "Clarifies diagnosis, orders and interprets diagnostics within scope, creates management plans, and coordinates follow-up.",
  },
  {
    id: "respiratory-therapy",
    label: "Respiratory Therapy",
    learnerPositioning: "For RT learners managing oxygenation, ventilation, ABGs, airway concerns, and respiratory deterioration.",
    competencies: ["ventilator management", "oxygen therapy", "ABG interpretation", "airway management", "respiratory assessment", "waveform troubleshooting"],
    scopeOfPractice: ["assess respiratory status", "recommend oxygen and ventilation strategies within local scope", "troubleshoot airway and ventilator concerns", "escalate respiratory deterioration"],
    documentationStandards: ["respiratory assessments", "ventilator checks", "oxygen therapy notes", "ABG interpretation notes", "airway intervention documentation"],
    assessmentFrameworks: ["work of breathing", "oxygenation and ventilation assessment", "ABG analysis", "ventilator waveform review", "airway patency checks"],
    clinicalReasoningFrameworks: ["oxygenation-ventilation-acid-base reasoning", "airway risk analysis", "respiratory deterioration escalation"],
    placementRequirements: ["ventilator checks", "oxygen delivery review", "ABG practice", "airway equipment preparation", "RT instructor questioning"],
    licensingExamAlignment: ["respiratory therapy competency expectations", "local registration or certification readiness"],
    adaptations: ["ventilator management", "oxygen therapy", "ABG interpretation", "airway management", "respiratory assessments"],
    commonScenarios: ["COPD exacerbation", "ventilator alarm", "acute hypoxemia", "ABG compensation"],
    interprofessionalContribution: "Interprets respiratory status, manages airway and ventilation concerns, and guides oxygenation support.",
  },
  {
    id: "paramedicine",
    label: "Paramedicine",
    learnerPositioning: "For paramedicine learners practicing scene safety, rapid assessment, trauma, ECG interpretation, and prehospital priorities.",
    competencies: ["scene assessment", "prehospital care", "trauma management", "ECG interpretation", "emergency pharmacology", "transport decisions"],
    scopeOfPractice: ["perform rapid primary and secondary surveys", "stabilize time-sensitive emergencies", "administer emergency care within protocol", "select transport and destination priorities"],
    documentationStandards: ["patient care report documentation", "scene narrative", "treatment timeline", "handoff to receiving facility", "refusal and consent documentation"],
    assessmentFrameworks: ["scene size-up", "primary survey", "secondary survey", "GCS", "trauma and medical triage", "ECG and vital sign trend review"],
    clinicalReasoningFrameworks: ["life-threat-first reasoning", "transport decision frameworks", "protocol-based clinical judgment", "risk-benefit analysis"],
    placementRequirements: ["equipment readiness", "scenario debriefing", "PCR review", "trauma and cardiac questioning", "handoff practice"],
    licensingExamAlignment: ["paramedic certification and jurisdictional protocol readiness"],
    adaptations: ["scene assessment", "prehospital care", "trauma management", "ECG interpretation", "emergency pharmacology"],
    commonScenarios: ["chest pain call", "motor vehicle collision", "overdose airway risk", "sepsis recognition in the field"],
    interprofessionalContribution: "Recognizes prehospital threats, stabilizes the patient, documents the care timeline, and transfers critical information.",
  },
  {
    id: "occupational-therapy",
    label: "Occupational Therapy",
    learnerPositioning: "For OT learners planning functional assessment, ADL support, rehabilitation goals, and safe discharge environments.",
    competencies: ["functional assessments", "ADL evaluation", "rehabilitation planning", "home safety", "cognitive-functional screening", "adaptive equipment planning"],
    scopeOfPractice: ["assess function and participation", "recommend adaptive strategies", "support occupational performance", "identify environmental safety barriers"],
    documentationStandards: ["functional assessment notes", "ADL performance documentation", "goal progress notes", "home safety recommendations", "discharge planning documentation"],
    assessmentFrameworks: ["ADL/IADL assessment", "functional cognition", "environmental fit", "occupational performance analysis"],
    clinicalReasoningFrameworks: ["person-environment-occupation reasoning", "functional risk analysis", "rehabilitation goal progression"],
    placementRequirements: ["functional observation", "equipment rationale", "home safety review", "client-centred goal setting", "OT instructor questioning"],
    licensingExamAlignment: ["occupational therapy competency and registration readiness"],
    adaptations: ["functional assessments", "ADLs", "rehabilitation planning", "home safety"],
    commonScenarios: ["stroke ADL retraining", "post-hip-fracture home setup", "cognitive safety planning", "adaptive equipment selection"],
    interprofessionalContribution: "Assesses function, independence, cognition, home safety, and adaptive supports needed for meaningful daily life.",
  },
  {
    id: "physiotherapy",
    label: "Physiotherapy",
    learnerPositioning: "For PT learners developing mobility assessment, exercise prescription, rehabilitation progression, and safe function plans.",
    competencies: ["mobility assessments", "exercise prescription", "rehabilitation progression", "functional movement", "fall prevention", "gait analysis"],
    scopeOfPractice: ["assess mobility and movement impairments", "progress therapeutic exercise", "plan safe transfers and gait", "recommend mobility aids"],
    documentationStandards: ["mobility assessment notes", "exercise prescription records", "progression documentation", "functional outcome measures", "discharge mobility recommendations"],
    assessmentFrameworks: ["gait assessment", "strength and range-of-motion screening", "transfer assessment", "activity tolerance", "balance and fall-risk review"],
    clinicalReasoningFrameworks: ["movement-system reasoning", "load and progression decisions", "functional goal analysis", "risk-based mobilization"],
    placementRequirements: ["mobility safety review", "exercise rationale", "progress notes", "rehab goal setting", "PT instructor questioning"],
    licensingExamAlignment: ["physiotherapy competency and registration readiness"],
    adaptations: ["mobility assessments", "exercise prescription", "rehabilitation progression", "functional movement"],
    commonScenarios: ["post-operative mobilization", "stroke gait retraining", "falls prevention", "cardiorespiratory activity tolerance"],
    interprofessionalContribution: "Evaluates mobility, exercise tolerance, transfer safety, and functional progression toward discharge goals.",
  },
  {
    id: "medical-laboratory-technology",
    label: "Medical Laboratory Technology",
    learnerPositioning: "For MLT learners building specimen integrity, laboratory interpretation, quality assurance, and diagnostic reasoning habits.",
    competencies: ["specimen collection", "laboratory interpretation", "quality assurance", "diagnostic reasoning", "critical value reporting", "pre-analytic error recognition"],
    scopeOfPractice: ["collect and process specimens safely", "verify result integrity", "recognize critical and implausible values", "communicate results through approved channels"],
    documentationStandards: ["laboratory reporting", "specimen rejection documentation", "quality control records", "critical value notification records", "chain-of-custody documentation when applicable"],
    assessmentFrameworks: ["specimen quality assessment", "result validity checks", "reference interval review", "critical value recognition"],
    clinicalReasoningFrameworks: ["pre-analytic-analytic-post-analytic reasoning", "quality control decision-making", "diagnostic pattern recognition"],
    placementRequirements: ["specimen handling review", "QC case review", "critical result escalation", "laboratory safety checks", "MLT instructor questioning"],
    licensingExamAlignment: ["medical laboratory technology competency and certification readiness"],
    adaptations: ["specimen collection", "laboratory interpretation", "quality assurance", "diagnostic reasoning"],
    commonScenarios: ["hemolyzed potassium specimen", "critical troponin reporting", "CBC abnormality review", "quality control failure"],
    interprofessionalContribution: "Protects result integrity, identifies critical findings, and supports diagnostic decisions through accurate laboratory reporting.",
  },
  {
    id: "psw",
    label: "Personal Support Worker",
    learnerPositioning: "For PSW learners practicing safe personal care, mobility assistance, observation, communication, and supportive documentation.",
    competencies: ["personal care", "mobility assistance", "safety monitoring", "communication", "infection prevention", "dignity-preserving care"],
    scopeOfPractice: ["assist with activities of daily living", "observe changes and report concerns", "support mobility and comfort", "follow care plans within PSW role"],
    documentationStandards: ["personal care documentation", "mobility and transfer notes", "intake/output or routine observation records when assigned", "change-in-condition reporting"],
    assessmentFrameworks: ["baseline observation", "safety and fall-risk cues", "skin and comfort observations", "communication and behaviour changes"],
    clinicalReasoningFrameworks: ["observe-report-support reasoning", "safety cue recognition", "comfort and dignity decision-making"],
    placementRequirements: ["personal care routines", "safe transfers", "communication practice", "reporting concerns", "PSW instructor questioning"],
    licensingExamAlignment: ["PSW certificate, program placement, and employer competency expectations"],
    adaptations: ["personal care", "mobility assistance", "safety monitoring", "communication"],
    commonScenarios: ["fall-risk transfer", "skin breakdown concern", "refusal of care", "new confusion during morning care"],
    interprofessionalContribution: "Observes day-to-day changes, supports safe personal care, and communicates concerns to regulated team members.",
  },
  {
    id: "social-work",
    label: "Social Work",
    learnerPositioning: "For social work learners supporting psychosocial assessment, safety planning, advocacy, discharge resources, and systems navigation.",
    competencies: ["psychosocial assessment", "crisis intervention", "resource navigation", "advocacy", "safety planning", "family and systems work"],
    scopeOfPractice: ["assess psychosocial needs", "support care transitions", "connect clients to resources", "identify safeguarding and safety concerns", "advocate within care teams"],
    documentationStandards: ["psychosocial assessment notes", "case management notes", "safety plan documentation", "resource referral tracking", "family meeting summaries"],
    assessmentFrameworks: ["biopsychosocial assessment", "risk and protective factor review", "social determinants of health", "resource and discharge barrier analysis"],
    clinicalReasoningFrameworks: ["strengths-based reasoning", "systems thinking", "risk-needs-resources matching", "ethical decision-making"],
    placementRequirements: ["resource mapping", "case formulation", "supervision reflection", "family meeting prep", "social work instructor questioning"],
    licensingExamAlignment: ["social work registration and ASWB-style competency readiness where applicable"],
    adaptations: ["psychosocial assessment", "discharge planning", "community resources", "safety planning", "advocacy"],
    commonScenarios: ["unsafe discharge risk", "housing instability", "family conflict", "domestic violence safety planning"],
    interprofessionalContribution: "Identifies psychosocial barriers, coordinates resources, supports safety planning, and strengthens care transitions.",
  },
  {
    id: "psychotherapy",
    label: "Psychotherapy",
    learnerPositioning: "For psychotherapy learners practicing therapeutic assessment, risk screening, formulation, intervention planning, and session documentation.",
    competencies: ["therapeutic assessment", "risk screening", "case formulation", "treatment planning", "therapeutic communication", "professional boundaries"],
    scopeOfPractice: ["assess presenting concerns", "identify risk and protective factors", "plan therapeutic interventions", "document sessions professionally", "refer or escalate safety concerns"],
    documentationStandards: ["intake notes", "session notes", "risk assessment documentation", "treatment plan updates", "progress and outcome notes"],
    assessmentFrameworks: ["mental status observations", "risk assessment", "case formulation", "symptom and functioning review", "therapeutic alliance review"],
    clinicalReasoningFrameworks: ["formulation-based reasoning", "risk-protective factor analysis", "therapeutic goal alignment", "ethical boundary checks"],
    placementRequirements: ["supervision notes", "case formulation practice", "risk review", "session reflection", "psychotherapy instructor questioning"],
    licensingExamAlignment: ["psychotherapy registration, ethics, and competency readiness where applicable"],
    adaptations: ["therapeutic assessment", "risk screening", "session documentation", "treatment planning", "professional boundaries"],
    commonScenarios: ["initial intake", "suicide risk screening", "panic symptoms", "trauma-informed session planning"],
    interprofessionalContribution: "Supports mental health formulation, therapeutic goals, risk screening, and referral or escalation when safety concerns arise.",
  },
] as const;

const DOCUMENTATION_PRACTICE_BY_PROFESSION = CLINICAL_EDUCATION_PROFESSIONS.reduce(
  (accumulator, profile) => {
    accumulator[profile.id] = [
      `Complete ${profile.documentationStandards[0]} using only objective, profession-appropriate language.`,
      `Identify one missing safety detail in a ${profile.label} documentation sample.`,
      `Convert a handoff into a concise ${profile.label} placement note.`,
    ];
    return accumulator;
  },
  {} as Record<ClinicalEducationProfessionId, readonly string[]>,
);

export function listClinicalEducationProfessions(): readonly ProfessionProfile[] {
  return CLINICAL_EDUCATION_PROFESSIONS;
}

export function getClinicalEducationProfession(id: ClinicalEducationProfessionId): ProfessionProfile {
  const profile = CLINICAL_EDUCATION_PROFESSIONS.find((item) => item.id === id);
  if (!profile) throw new Error(`Unknown clinical education profession: ${id}`);
  return profile;
}

export function generateClinicalEducationSuite(professionId: ClinicalEducationProfessionId = "rn"): ClinicalEducationSuite {
  const selectedProfession = getClinicalEducationProfession(professionId);
  return {
    selectedProfession,
    availableProfessions: CLINICAL_EDUCATION_PROFESSIONS,
    tools: CORE_TOOL_ORDER.map((toolId) => buildTool(toolId, selectedProfession)),
    competencyPortfolio: buildPortfolio(selectedProfession),
    placementPreparation: buildPlacementPreparation(selectedProfession),
    documentationTraining: buildDocumentationTraining(selectedProfession),
    simulationEcosystem: buildSimulationEcosystem(selectedProfession),
    interprofessionalCase: buildInterprofessionalCase(),
    qualityGuards: [
      "The shared engine provides common workflow primitives while every profession receives its own competencies, documentation outputs, reasoning frameworks, and placement expectations.",
      "Profession-specific adaptations must not be implemented as renamed nursing labels.",
      "Role scope boundaries are explicit, so PN/RPN, RN, NP, allied health, social work, and psychotherapy learners receive different decision expectations.",
      "Simulation and portfolio evidence is generated from the profession profile instead of hardcoded nursing-only assumptions.",
    ],
  };
}

function buildTool(id: ClinicalEducationToolId, profile: ProfessionProfile): SuiteTool {
  const shared = TOOL_SHARED_PURPOSE[id];
  const primaryCompetency = profile.competencies[0];
  const primaryScenario = profile.commonScenarios[0];
  const primaryDocumentation = profile.documentationStandards[0];
  const primaryReasoning = profile.clinicalReasoningFrameworks[0];

  return {
    id,
    title: shared.title,
    sharedPurpose: shared.purpose,
    professionAdaptation: `${profile.label} version emphasizes ${profile.adaptations.join(", ")}.`,
    activities: [
      `Review ${primaryScenario} through ${primaryReasoning}.`,
      `Identify scope-appropriate actions for ${primaryCompetency}.`,
      `Practice one handoff, one documentation entry, and one safety decision aligned to ${profile.label} expectations.`,
    ],
    documentationOutput: primaryDocumentation,
    simulationHooks: [
      `${profile.label} decision point: what cue changes the priority?`,
      `${profile.label} documentation task: record the relevant finding and action.`,
      `${profile.label} team communication: clarify what must be shared with the next professional.`,
    ],
    portfolioEvidence: [
      `${profile.label} competency reflection`,
      `${profile.label} instructor feedback item`,
      `${profile.label} placement evidence artifact`,
    ],
  };
}

function buildPortfolio(profile: ProfessionProfile): CompetencyPortfolio {
  return {
    skillTracking: profile.competencies.map((competency) => `${profile.label}: track demonstrated ${competency}.`),
    competencyAchievement: profile.scopeOfPractice.map((scope) => `Evidence that learner can ${scope}.`),
    placementLogs: profile.placementRequirements.map((requirement) => `Placement log: ${requirement}.`),
    instructorFeedbackTracking: [
      `Instructor rating for ${profile.clinicalReasoningFrameworks[0]}.`,
      `Feedback on ${profile.documentationStandards[0]}.`,
      `Action plan for the learner's weakest ${profile.label} competency.`,
    ],
    learningReflections: [
      `What cue changed your priority during a ${profile.commonScenarios[0]} scenario?`,
      `Which ${profile.label} scope boundary affected your decision?`,
      "What will you review before the next placement day?",
    ],
    professionalDevelopmentPlans: [
      `Set a two-week goal for ${profile.competencies[0]}.`,
      `Build a review plan for ${profile.licensingExamAlignment[0]}.`,
      `Collect one artifact that proves growth in ${profile.documentationStandards[0]}.`,
    ],
  };
}

function buildPlacementPreparation(profile: ProfessionProfile): PlacementPreparation {
  return {
    preparationSheets: profile.commonScenarios.map((scenario) => `${profile.label} preparation sheet for ${scenario}.`),
    instructorQuestions: profile.competencies.map((competency) => `How would a ${profile.label} learner demonstrate ${competency} safely?`),
    caseStudies: profile.commonScenarios.map((scenario) => `Case study: ${scenario} with ${profile.label} decisions and documentation.`),
    skillsReviews: profile.assessmentFrameworks.map((framework) => `Skills review: ${framework}.`),
    commonScenarios: profile.commonScenarios,
  };
}

function buildDocumentationTraining(profile: ProfessionProfile): DocumentationTraining {
  return {
    formats: profile.documentationStandards,
    practiceTasks: DOCUMENTATION_PRACTICE_BY_PROFESSION[profile.id],
    safetyChecks: [
      "Use objective wording and avoid unsupported conclusions.",
      `Include the ${profile.label} action, response, and escalation or referral when applicable.`,
      `Keep documentation inside ${profile.label} scope and placement expectations.`,
    ],
  };
}

function buildSimulationEcosystem(profile: ProfessionProfile): SimulationEcosystem {
  return {
    decisionMaking: profile.clinicalReasoningFrameworks.map((framework) => `${framework} decision checkpoint.`),
    documentation: profile.documentationStandards.map((standard) => `${standard} simulation submission.`),
    communication: [
      `Explain the ${profile.label} concern to the next team member.`,
      "Clarify what is known, what is uncertain, and what must happen next.",
    ],
    clinicalReasoning: profile.assessmentFrameworks.map((framework) => `Use ${framework} to decide what matters most.`),
    safety: profile.scopeOfPractice.map((scope) => `Safety boundary: ${scope}.`),
    escalation: [
      `Escalate when findings exceed ${profile.label} scope or indicate immediate risk.`,
      "Document who was notified, what was communicated, and the response.",
    ],
    interprofessionalCollaboration: [
      `Define what ${profile.label} contributes to the shared care plan.`,
      "Identify what information another profession needs before acting.",
    ],
  };
}

function buildInterprofessionalCase(): ClinicalEducationSuite["interprofessionalCase"] {
  return {
    title: "Shared Case: Older Adult With Heart Failure, Dyspnea, Functional Decline, and Discharge Barriers",
    patientSummary:
      "A 76-year-old patient has worsening shortness of breath, new weakness after hospitalization, abnormal BNP and potassium, complex medications, home safety concerns, and anxiety about returning home.",
    learningGoal:
      "Show how each profession reasons from the same patient information while contributing different, scope-appropriate decisions.",
    contributions: CLINICAL_EDUCATION_PROFESSIONS.map((profile) => ({
      professionId: profile.id,
      professionLabel: profile.label,
      contribution: profile.interprofessionalContribution,
      handoffNeed: `The team needs ${profile.label} input on ${profile.competencies.slice(0, 2).join(" and ")}.`,
    })),
  };
}

export function summarizeClinicalEducationSuiteForCopy(suite: ClinicalEducationSuite): string {
  const lines = [
    `Clinical Education Suite: ${suite.selectedProfession.label}`,
    suite.selectedProfession.learnerPositioning,
    "",
    "Profession Profile",
    `Competencies: ${suite.selectedProfession.competencies.join(", ")}`,
    `Scope: ${suite.selectedProfession.scopeOfPractice.join("; ")}`,
    `Documentation: ${suite.selectedProfession.documentationStandards.join(", ")}`,
    "",
    "Core Tools",
    ...suite.tools.map((tool) => `- ${tool.title}: ${tool.professionAdaptation}`),
    "",
    "Interprofessional Case",
    suite.interprofessionalCase.patientSummary,
    ...suite.interprofessionalCase.contributions.map((item) => `- ${item.professionLabel}: ${item.contribution}`),
  ];
  return lines.join("\n");
}
