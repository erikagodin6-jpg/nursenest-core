export type AcademicProfessionId =
  | "rn"
  | "rpn-lpn"
  | "np"
  | "rt"
  | "paramedic"
  | "ot"
  | "pt"
  | "mlt"
  | "psw"
  | "social-work";

export type AssignmentBuilderId =
  | "care-plan"
  | "concept-map"
  | "medication-card"
  | "disease-process"
  | "clinical-reflection"
  | "patient-teaching-plan"
  | "health-promotion-project"
  | "case-study-analysis"
  | "evidence-based-practice"
  | "quality-improvement-project";

export type StudyToolId =
  | "study-guide"
  | "exam-review-sheet"
  | "quick-reference-sheet"
  | "flashcards"
  | "practice-questions"
  | "case-studies"
  | "learning-summary";

export type ResearchSupportId =
  | "pico-question"
  | "literature-review-framework"
  | "critical-appraisal-worksheet"
  | "research-proposal-outline"
  | "evidence-table"
  | "knowledge-translation-plan";

export type GroupProjectSupportId =
  | "project-timeline"
  | "task-assignments"
  | "meeting-agenda"
  | "presentation-outline"
  | "speaker-notes"
  | "peer-evaluation";

export type PresentationBuilderId =
  | "class-presentation"
  | "case-presentation"
  | "journal-club"
  | "research-presentation"
  | "clinical-teaching-presentation";

export type AcademicIntegrityGuard = {
  readonly principle: string;
  readonly enforcement: string;
};

export type AcademicProfessionProfile = {
  readonly id: AcademicProfessionId;
  readonly label: string;
  readonly academicFocus: readonly string[];
  readonly assignmentTemplates: readonly string[];
  readonly clinicalReasoningLens: readonly string[];
  readonly evidenceExpectations: readonly string[];
  readonly writingStandards: readonly string[];
  readonly professionSpecificTemplates: readonly string[];
};

export type AssignmentBuilderModule = {
  readonly id: AssignmentBuilderId;
  readonly title: string;
  readonly purpose: string;
  readonly reasoningPrompts: readonly string[];
  readonly scaffoldSections: readonly string[];
  readonly rationaleRequirements: readonly string[];
  readonly professionAdaptation: string;
  readonly integrityBoundary: string;
};

export type StudyToolModule = {
  readonly id: StudyToolId;
  readonly title: string;
  readonly output: string;
  readonly learnerAction: string;
  readonly professionAdaptation: string;
};

export type ResearchSupportModule = {
  readonly id: ResearchSupportId;
  readonly title: string;
  readonly output: string;
  readonly scholarlyStandard: readonly string[];
  readonly professionAdaptation: string;
};

export type GroupProjectModule = {
  readonly id: GroupProjectSupportId;
  readonly title: string;
  readonly output: string;
  readonly collaborationRules: readonly string[];
};

export type PresentationModule = {
  readonly id: PresentationBuilderId;
  readonly title: string;
  readonly output: string;
  readonly requiredElements: readonly string[];
};

export type WritingCoachReview = {
  readonly reviewAreas: readonly string[];
  readonly feedbackStyle: readonly string[];
  readonly prohibitedBehavior: readonly string[];
  readonly revisionPrompts: readonly string[];
};

export type AcademicSuccessToolkit = {
  readonly selectedProfession: AcademicProfessionProfile;
  readonly availableProfessions: readonly AcademicProfessionProfile[];
  readonly assignmentBuilderSuite: readonly AssignmentBuilderModule[];
  readonly studyTools: readonly StudyToolModule[];
  readonly researchSupport: readonly ResearchSupportModule[];
  readonly groupProjectSupport: readonly GroupProjectModule[];
  readonly presentationBuilder: readonly PresentationModule[];
  readonly academicWritingCoach: WritingCoachReview;
  readonly integrityGuards: readonly AcademicIntegrityGuard[];
  readonly qualityStandard: readonly string[];
};

const ASSIGNMENT_BUILDERS: readonly AssignmentBuilderId[] = [
  "care-plan",
  "concept-map",
  "medication-card",
  "disease-process",
  "clinical-reflection",
  "patient-teaching-plan",
  "health-promotion-project",
  "case-study-analysis",
  "evidence-based-practice",
  "quality-improvement-project",
] as const;

const STUDY_TOOLS: readonly StudyToolId[] = [
  "study-guide",
  "exam-review-sheet",
  "quick-reference-sheet",
  "flashcards",
  "practice-questions",
  "case-studies",
  "learning-summary",
] as const;

const RESEARCH_SUPPORT: readonly ResearchSupportId[] = [
  "pico-question",
  "literature-review-framework",
  "critical-appraisal-worksheet",
  "research-proposal-outline",
  "evidence-table",
  "knowledge-translation-plan",
] as const;

const GROUP_PROJECT_SUPPORT: readonly GroupProjectSupportId[] = [
  "project-timeline",
  "task-assignments",
  "meeting-agenda",
  "presentation-outline",
  "speaker-notes",
  "peer-evaluation",
] as const;

const PRESENTATION_BUILDERS: readonly PresentationBuilderId[] = [
  "class-presentation",
  "case-presentation",
  "journal-club",
  "research-presentation",
  "clinical-teaching-presentation",
] as const;

const ASSIGNMENT_LABELS: Record<AssignmentBuilderId, string> = {
  "care-plan": "Care Plan Builder",
  "concept-map": "Concept Map Builder",
  "medication-card": "Medication Card Builder",
  "disease-process": "Disease Process Worksheet Builder",
  "clinical-reflection": "Clinical Reflection Builder",
  "patient-teaching-plan": "Patient Teaching Plan Builder",
  "health-promotion-project": "Health Promotion Project Builder",
  "case-study-analysis": "Case Study Analysis Builder",
  "evidence-based-practice": "Evidence-Based Practice Worksheet Builder",
  "quality-improvement-project": "Quality Improvement Project Builder",
};

export const ACADEMIC_PROFESSION_PROFILES: readonly AcademicProfessionProfile[] = [
  {
    id: "rn",
    label: "RN",
    academicFocus: ["clinical judgment", "care planning", "patient education", "evidence-based nursing practice"],
    assignmentTemplates: ["nursing care plans", "clinical reflections", "case study analyses", "patient teaching plans"],
    clinicalReasoningLens: ["NCJMM", "ABCs", "nursing process", "priority and safety frameworks"],
    evidenceExpectations: ["peer-reviewed nursing sources", "clinical guidelines", "APA 7 references", "rationales linked to assessment data"],
    writingStandards: ["professional nursing language", "objective clinical wording", "clear care priorities", "APA 7 scholarly style"],
    professionSpecificTemplates: ["Care plans", "Clinical reflections", "Case studies"],
  },
  {
    id: "rpn-lpn",
    label: "RPN/LPN",
    academicFocus: ["focused assessment", "safe practical nursing care", "monitoring", "scope-aware escalation"],
    assignmentTemplates: ["focused care plans", "clinical reflections", "medication cards", "disease worksheets"],
    clinicalReasoningLens: ["recognize-monitor-escalate", "stable/common presentation analysis", "safety and scope checks"],
    evidenceExpectations: ["entry-to-practice standards", "medication safety sources", "APA 7 references", "rationales linked to patient safety"],
    writingStandards: ["concise practical nursing language", "objective observations", "clear escalation wording", "APA 7 scholarly style"],
    professionSpecificTemplates: ["Focused care plans", "Medication cards", "Clinical reflections"],
  },
  {
    id: "np",
    label: "NP",
    academicFocus: ["diagnostic reasoning", "differential diagnosis", "guideline-informed management", "advanced scholarly writing"],
    assignmentTemplates: ["SOAP notes", "case analyses", "EBP worksheets", "quality improvement plans"],
    clinicalReasoningLens: ["diagnostic hypothesis testing", "guideline-based management", "risk stratification", "follow-up planning"],
    evidenceExpectations: ["clinical practice guidelines", "systematic reviews", "pharmacotherapy references", "APA 7 advanced practice writing"],
    writingStandards: ["advanced clinical reasoning", "diagnostic clarity", "management rationale", "APA 7 scholarly style"],
    professionSpecificTemplates: ["Advanced case analyses", "SOAP plans", "EBP worksheets"],
  },
  {
    id: "rt",
    label: "Respiratory Therapy",
    academicFocus: ["ABG analysis", "ventilator reasoning", "oxygen therapy", "airway safety"],
    assignmentTemplates: ["ABG worksheets", "ventilator case reviews", "respiratory assessments", "case analyses"],
    clinicalReasoningLens: ["oxygenation-ventilation-acid-base reasoning", "airway risk", "ventilator troubleshooting"],
    evidenceExpectations: ["respiratory care references", "oxygen and ventilation guidance", "APA 7 references", "case data interpretation"],
    writingStandards: ["precise respiratory terminology", "objective respiratory assessment", "clear ABG interpretation", "APA 7 scholarly style"],
    professionSpecificTemplates: ["ABG analysis", "Ventilator case reviews"],
  },
  {
    id: "paramedic",
    label: "Paramedic",
    academicFocus: ["scene assessment", "prehospital reasoning", "trauma priorities", "emergency pharmacology"],
    assignmentTemplates: ["call reviews", "patient care report critiques", "trauma case analyses", "ECG case reviews"],
    clinicalReasoningLens: ["scene safety", "primary survey", "time-sensitive transport decisions", "protocol-aware judgment"],
    evidenceExpectations: ["prehospital protocols", "emergency care references", "APA 7 references", "timeline-based reasoning"],
    writingStandards: ["clear prehospital sequence", "objective PCR language", "time-stamped clinical reasoning", "APA 7 scholarly style"],
    professionSpecificTemplates: ["Call reviews", "Patient care reports"],
  },
  {
    id: "ot",
    label: "Occupational Therapy",
    academicFocus: ["functional assessment", "ADL participation", "home safety", "client-centred goals"],
    assignmentTemplates: ["functional assessments", "home safety plans", "case analyses", "health promotion projects"],
    clinicalReasoningLens: ["person-environment-occupation reasoning", "functional risk", "participation-focused goal setting"],
    evidenceExpectations: ["OT practice literature", "functional outcome measures", "APA 7 references", "client-centred evidence"],
    writingStandards: ["function-focused language", "occupation-centred reasoning", "measurable goals", "APA 7 scholarly style"],
    professionSpecificTemplates: ["Functional assessments"],
  },
  {
    id: "pt",
    label: "Physiotherapy",
    academicFocus: ["mobility assessment", "exercise prescription", "rehabilitation progression", "functional outcomes"],
    assignmentTemplates: ["treatment plans", "mobility case analyses", "exercise progressions", "case presentations"],
    clinicalReasoningLens: ["movement analysis", "load progression", "activity tolerance", "risk-based mobility planning"],
    evidenceExpectations: ["rehabilitation literature", "outcome measures", "exercise guidance", "APA 7 references"],
    writingStandards: ["movement-specific language", "measurable progression", "functional outcomes", "APA 7 scholarly style"],
    professionSpecificTemplates: ["Treatment plans"],
  },
  {
    id: "mlt",
    label: "MLT",
    academicFocus: ["laboratory interpretation", "specimen quality", "quality assurance", "diagnostic reasoning"],
    assignmentTemplates: ["laboratory case analyses", "quality control worksheets", "critical value reports", "evidence tables"],
    clinicalReasoningLens: ["pre-analytic, analytic, and post-analytic reasoning", "critical result interpretation", "quality control decision-making"],
    evidenceExpectations: ["laboratory standards", "diagnostic references", "APA 7 references", "validity and quality evidence"],
    writingStandards: ["precise laboratory terminology", "clear result interpretation", "quality-focused rationale", "APA 7 scholarly style"],
    professionSpecificTemplates: ["Laboratory case analyses"],
  },
  {
    id: "psw",
    label: "PSW",
    academicFocus: ["personal care", "safety observation", "communication", "resident dignity"],
    assignmentTemplates: ["reflection worksheets", "care support plans", "communication plans", "safety observation sheets"],
    clinicalReasoningLens: ["observe-report-support reasoning", "safety cue recognition", "dignity and comfort planning"],
    evidenceExpectations: ["program standards", "infection prevention resources", "safe mobility references", "clear observation evidence"],
    writingStandards: ["plain professional language", "objective observations", "respectful wording", "clear reporting structure"],
    professionSpecificTemplates: ["Personal care reflections", "Safety observation sheets"],
  },
  {
    id: "social-work",
    label: "Social Work",
    academicFocus: ["psychosocial assessment", "case formulation", "advocacy", "resource navigation"],
    assignmentTemplates: ["biopsychosocial assessments", "case study analyses", "community resource plans", "critical reflections"],
    clinicalReasoningLens: ["systems thinking", "strengths-based assessment", "risk and protective factor analysis", "ethical decision-making"],
    evidenceExpectations: ["social work literature", "policy references", "community data", "APA 7 references"],
    writingStandards: ["strengths-based language", "anti-oppressive framing", "clear ethical analysis", "APA 7 scholarly style"],
    professionSpecificTemplates: ["Psychosocial case analyses", "Community resource plans"],
  },
] as const;

export function listAcademicProfessionProfiles(): readonly AcademicProfessionProfile[] {
  return ACADEMIC_PROFESSION_PROFILES;
}

export function getAcademicProfessionProfile(id: AcademicProfessionId): AcademicProfessionProfile {
  const profile = ACADEMIC_PROFESSION_PROFILES.find((item) => item.id === id);
  if (!profile) throw new Error(`Unknown academic profession: ${id}`);
  return profile;
}

export function generateAcademicSuccessToolkit(professionId: AcademicProfessionId = "rn"): AcademicSuccessToolkit {
  const selectedProfession = getAcademicProfessionProfile(professionId);
  return {
    selectedProfession,
    availableProfessions: ACADEMIC_PROFESSION_PROFILES,
    assignmentBuilderSuite: ASSIGNMENT_BUILDERS.map((id) => buildAssignmentModule(id, selectedProfession)),
    studyTools: STUDY_TOOLS.map((id) => buildStudyTool(id, selectedProfession)),
    researchSupport: RESEARCH_SUPPORT.map((id) => buildResearchModule(id, selectedProfession)),
    groupProjectSupport: GROUP_PROJECT_SUPPORT.map(buildGroupProjectModule),
    presentationBuilder: PRESENTATION_BUILDERS.map(buildPresentationModule),
    academicWritingCoach: buildWritingCoach(selectedProfession),
    integrityGuards: [
      {
        principle: "Coach the learner instead of replacing the learner.",
        enforcement: "Outputs provide structure, prompts, criteria, and revision feedback rather than complete submission-ready answers.",
      },
      {
        principle: "Require visible clinical or scholarly reasoning.",
        enforcement: "Every assignment builder includes rationale prompts, evidence expectations, and profession-specific reasoning checks.",
      },
      {
        principle: "Preserve academic integrity.",
        enforcement: "The writing coach reviews clarity, organization, APA style, and professional tone without writing entire assignments.",
      },
    ],
    qualityStandard: [
      "Templates must feel designed by educators and clinicians, not generic productivity software.",
      "Profession-specific templates must use the correct clinical, academic, and documentation language.",
      "Research support must align with APA 7, scholarly writing, evidence-based practice, and critical appraisal expectations.",
      "Group and presentation tools must help students plan, explain, and teach rather than outsource thinking.",
    ],
  };
}

function buildAssignmentModule(id: AssignmentBuilderId, profile: AcademicProfessionProfile): AssignmentBuilderModule {
  const isProfessionSpecific = profile.professionSpecificTemplates.some((template) =>
    ASSIGNMENT_LABELS[id].toLowerCase().includes(template.toLowerCase().split(" ")[0] ?? ""),
  );

  return {
    id,
    title: ASSIGNMENT_LABELS[id],
    purpose: `Help ${profile.label} learners organize the assignment, identify what evidence is needed, and explain the reasoning behind each section.`,
    reasoningPrompts: [
      `What patient, client, system, or case data matters most for ${profile.clinicalReasoningLens[0]}?`,
      `Which ${profile.label} scope or competency expectation shapes the response?`,
      "What evidence supports the interpretation, plan, teaching, or recommendation?",
    ],
    scaffoldSections: buildAssignmentSections(id, profile),
    rationaleRequirements: [
      "Connect each recommendation to assessment data or scholarly evidence.",
      "Explain why alternatives were not chosen.",
      "Identify safety, ethical, or professional considerations.",
    ],
    professionAdaptation: isProfessionSpecific
      ? `${profile.label} priority template: ${profile.professionSpecificTemplates.join(", ")}.`
      : `${profile.label} adaptation uses ${profile.clinicalReasoningLens.join(", ")}.`,
    integrityBoundary: "Produces a scaffold, prompts, and feedback. Learners must enter their own case details, analysis, and final wording.",
  };
}

function buildAssignmentSections(id: AssignmentBuilderId, profile: AcademicProfessionProfile): readonly string[] {
  const common = ["Assignment purpose", "Key case details", "Reasoning prompts", "Evidence to cite", "Reflection or revision checklist"];
  const map: Record<AssignmentBuilderId, readonly string[]> = {
    "care-plan": ["Priority problem", "Assessment cues", "Goals", "Interventions", "Rationales", "Evaluation criteria"],
    "concept-map": ["Central concept", "Related findings", "Risk relationships", "Interventions", "Complications", "Evaluation"],
    "medication-card": ["Indication", "Mechanism", "Safety checks", "Monitoring", "Teaching", "Clinical pearl"],
    "disease-process": ["Pathophysiology", "Signs and symptoms", "Diagnostics", "Management", "Complications", "Learner traps"],
    "clinical-reflection": ["Situation", "Clinical reasoning", "Emotions and assumptions", "Feedback received", "Next action"],
    "patient-teaching-plan": ["Learning need", "Health literacy", "Teaching points", "Teach-back", "Barriers", "Evaluation"],
    "health-promotion-project": ["Population", "Need", "Determinants", "Intervention", "Evaluation", "Equity considerations"],
    "case-study-analysis": ["Problem representation", "Relevant cues", "Hypotheses", "Actions", "Evidence", "Lessons learned"],
    "evidence-based-practice": ["Clinical question", "Evidence search", "Appraisal", "Recommendation", "Implementation", "Evaluation"],
    "quality-improvement-project": ["Problem statement", "Aim", "Measures", "Change idea", "PDSA plan", "Sustainability"],
  };
  return [...map[id], `${profile.label} lens: ${profile.academicFocus[0]}`, ...common] as const;
}

function buildStudyTool(id: StudyToolId, profile: AcademicProfessionProfile): StudyToolModule {
  const titles: Record<StudyToolId, string> = {
    "study-guide": "Study Guide Generator",
    "exam-review-sheet": "Exam Review Sheet Generator",
    "quick-reference-sheet": "Quick-Reference Sheet Generator",
    flashcards: "Flashcard Generator",
    "practice-questions": "Practice Question Generator",
    "case-studies": "Case Study Generator",
    "learning-summary": "Learning Summary Generator",
  };
  return {
    id,
    title: titles[id],
    output: `${titles[id].replace(" Generator", "")} with ${profile.label} vocabulary, key concepts, and reasoning prompts.`,
    learnerAction: "Learner reviews, edits, answers, and explains the material before saving it.",
    professionAdaptation: `Uses ${profile.academicFocus.join(", ")} as the study emphasis.`,
  };
}

function buildResearchModule(id: ResearchSupportId, profile: AcademicProfessionProfile): ResearchSupportModule {
  const titles: Record<ResearchSupportId, string> = {
    "pico-question": "PICO Question Builder",
    "literature-review-framework": "Literature Review Framework",
    "critical-appraisal-worksheet": "Critical Appraisal Worksheet",
    "research-proposal-outline": "Research Proposal Outline",
    "evidence-table": "Evidence Table Builder",
    "knowledge-translation-plan": "Knowledge Translation Plan",
  };
  return {
    id,
    title: titles[id],
    output: `${titles[id]} scaffold with topic, population, evidence, appraisal, and implementation prompts.`,
    scholarlyStandard: ["APA 7", "scholarly writing", "evidence-based practice", "source quality checks"],
    professionAdaptation: `${profile.label} research support emphasizes ${profile.evidenceExpectations.join(", ")}.`,
  };
}

function buildGroupProjectModule(id: GroupProjectSupportId): GroupProjectModule {
  const titles: Record<GroupProjectSupportId, string> = {
    "project-timeline": "Project Timeline",
    "task-assignments": "Task Assignments",
    "meeting-agenda": "Meeting Agenda",
    "presentation-outline": "Presentation Outline",
    "speaker-notes": "Speaker Notes",
    "peer-evaluation": "Peer Evaluation Form",
  };
  return {
    id,
    title: titles[id],
    output: `${titles[id]} template for planning, accountability, and team communication.`,
    collaborationRules: [
      "Define who owns each section and when drafts are due.",
      "Track sources and decisions transparently.",
      "Use peer evaluation to document contribution and professionalism.",
    ],
  };
}

function buildPresentationModule(id: PresentationBuilderId): PresentationModule {
  const titles: Record<PresentationBuilderId, string> = {
    "class-presentation": "Class Presentation Builder",
    "case-presentation": "Case Presentation Builder",
    "journal-club": "Journal Club Builder",
    "research-presentation": "Research Presentation Builder",
    "clinical-teaching-presentation": "Clinical Teaching Presentation Builder",
  };
  return {
    id,
    title: titles[id],
    output: `${titles[id]} with learning objectives, slide outline, speaker notes, and discussion questions.`,
    requiredElements: ["learning objectives", "structured slide outline", "speaker notes", "discussion questions", "reference slide"],
  };
}

function buildWritingCoach(profile: AcademicProfessionProfile): WritingCoachReview {
  return {
    reviewAreas: ["clarity", "structure", "organization", "grammar", "APA formatting", "professional tone"],
    feedbackStyle: [
      `Point out where ${profile.label} reasoning needs clearer explanation.`,
      "Highlight unclear transitions and unsupported claims.",
      "Ask revision questions instead of replacing the learner's writing.",
    ],
    prohibitedBehavior: [
      "Do not write an entire assignment for the learner.",
      "Do not fabricate citations.",
      "Do not remove the learner's responsibility for analysis, reflection, or source evaluation.",
    ],
    revisionPrompts: [
      `Where can you connect this sentence to ${profile.evidenceExpectations[0]}?`,
      `Which ${profile.clinicalReasoningLens[0]} step needs more explanation?`,
      "What source, guideline, or course material supports this claim?",
    ],
  };
}

export function summarizeAcademicToolkitForCopy(toolkit: AcademicSuccessToolkit): string {
  return [
    `Academic Success Toolkit: ${toolkit.selectedProfession.label}`,
    "",
    "Academic Focus",
    toolkit.selectedProfession.academicFocus.join(", "),
    "",
    "Assignment Builder Suite",
    ...toolkit.assignmentBuilderSuite.map((module) => `- ${module.title}: ${module.professionAdaptation}`),
    "",
    "Research Support",
    ...toolkit.researchSupport.map((module) => `- ${module.title}: ${module.scholarlyStandard.join(", ")}`),
    "",
    "Academic Integrity",
    ...toolkit.integrityGuards.map((guard) => `- ${guard.principle}: ${guard.enforcement}`),
  ].join("\n");
}
