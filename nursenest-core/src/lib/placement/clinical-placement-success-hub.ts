export type PlacementProfession =
  | "RN"
  | "RPN_LPN"
  | "NP"
  | "RT"
  | "PARAMEDIC"
  | "OT"
  | "PT"
  | "MLT"
  | "PSW"
  | "SOCIAL_WORK"
  | "PSYCHOTHERAPY";

export type PlacementCompetencyStatus = "observed" | "assisted" | "performed" | "performed_independently" | "mastered";

export type PlacementMonetizationTier = "free" | "paid" | "institution";

export type PlacementCompetency = {
  id: string;
  label: string;
  domain: string;
  description: string;
  evidenceExamples: string[];
  requiredStatusForMastery: PlacementCompetencyStatus;
};

export type PlacementProfessionFramework = {
  profession: PlacementProfession;
  label: string;
  commonSettings: string[];
  commonSpecialties: string[];
  preparationTopics: string[];
  expectedSkills: string[];
  competencies: PlacementCompetency[];
};

export type PlacementProfile = {
  learnerId: string;
  profession: PlacementProfession;
  program: string;
  academicYear: string;
  placementSetting: string;
  placementSpecialty: string;
  startDate: string;
  endDate: string;
  requiredHours: number;
  preceptor: { name: string; role: string; contact?: string };
  instructor: { name: string; role: string; contact?: string };
  goals: string[];
  evaluationStatus: "not_started" | "midterm_pending" | "midterm_complete" | "final_pending" | "final_complete";
};

export type ClinicalHourLog = {
  date: string;
  hours: number;
  unit: string;
  patientPopulation: string;
  skillsPerformed: string[];
  competencyIds: string[];
  preceptorNotes: string;
};

export type CompetencyEvidence = {
  competencyId: string;
  status: PlacementCompetencyStatus;
  date: string;
  evidence: string;
  validatedBy?: string;
};

export type PlacementDashboard = {
  profile: PlacementProfile;
  hoursCompleted: number;
  hoursRemaining: number;
  weeklyHours: Array<{ weekStart: string; hours: number }>;
  programProgress: number;
  competenciesCompleted: number;
  competenciesOutstanding: number;
  competencyProgress: number;
  placementGoals: string[];
  evaluationStatus: PlacementProfile["evaluationStatus"];
};

export type PlacementPreparationCenter = {
  unitOrientationGuide: string[];
  commonDiagnoses: string[];
  commonMedications: string[];
  commonEquipment: string[];
  expectedSkills: string[];
  instructorExpectations: string[];
  frequentlyAskedQuestions: string[];
  professionalConductExpectations: string[];
};

export type ShiftPrepToolkit = {
  patientPreparationSheets: string[];
  clinicalWorksheets: string[];
  brainSheets: string[];
  instructorQuestionBanks: string[];
  medicationReviewSheets: string[];
  pathophysiologyReviewSheets: string[];
  labInterpretationReviewSheets: string[];
};

export type ReflectionTemplate = {
  prompts: string[];
  evidenceFields: string[];
  coachingFocus: string[];
};

export type FeedbackTrend = {
  strengths: string[];
  improvementAreas: string[];
  clinicalComments: string[];
  professionalComments: string[];
  skillEvaluations: Array<{ competencyId: string; status: PlacementCompetencyStatus; note: string }>;
};

export type EvaluationPrepSummary = {
  strengthSummary: string[];
  competencySummary: string[];
  achievementExamples: string[];
  clinicalGrowthExamples: string[];
  professionalDevelopmentGoals: string[];
  improvementAreas: string[];
};

export type InterprofessionalLearningLog = {
  disciplines: string[];
  reflectionPrompts: string[];
};

export type ProfessionalPortfolio = {
  clinicalAccomplishments: string[];
  competenciesAchieved: string[];
  placementSummaries: string[];
  professionalReflections: string[];
  leadershipExamples: string[];
  qualityImprovementExperiences: string[];
};

export type ResumeInterviewIntegration = {
  resumeBullets: string[];
  starExamples: string[];
  professionalSummary: string;
};

export type ClinicalCoachInsight = {
  focusArea: string;
  coaching: string;
  recommendedAction: string;
};

export type InstructorResourceCenter = {
  enabledForTier: "institution";
  features: string[];
};

export type PlacementFeatureAccess = {
  tier: PlacementMonetizationTier;
  features: string[];
};

export const PLACEMENT_COMPETENCY_STATUS_ORDER: PlacementCompetencyStatus[] = [
  "observed",
  "assisted",
  "performed",
  "performed_independently",
  "mastered",
];

function competency(
  id: string,
  label: string,
  domain: string,
  description: string,
  evidenceExamples: string[],
  requiredStatusForMastery: PlacementCompetencyStatus = "performed_independently",
): PlacementCompetency {
  return { id, label, domain, description, evidenceExamples, requiredStatusForMastery };
}

export const PLACEMENT_PROFESSION_FRAMEWORKS: Record<PlacementProfession, PlacementProfessionFramework> = {
  RN: {
    profession: "RN",
    label: "Registered Nursing",
    commonSettings: ["Medical-Surgical", "Emergency", "ICU", "Maternal-Child", "Mental Health", "Community"],
    commonSpecialties: ["Adult Health", "Pediatrics", "Maternity", "Mental Health", "Leadership"],
    preparationTopics: ["Common diagnoses", "Medication safety", "Focused assessment", "Documentation", "SBAR", "Patient teaching"],
    expectedSkills: ["Head-to-toe assessment", "Medication administration", "Wound care", "Patient education", "Documentation", "Clinical judgment"],
    competencies: [
      competency("rn-med-admin", "Medication Administration", "Medication Safety", "Administers medications safely using rights, checks, monitoring, and patient teaching.", ["MAR verification", "allergy check", "patient teaching", "response monitoring"]),
      competency("rn-assessment", "Focused And Comprehensive Assessments", "Assessment", "Collects relevant cues, recognizes changes, and prioritizes assessment findings.", ["vital signs", "focused assessment", "change from baseline"]),
      competency("rn-clinical-judgment", "Clinical Judgment", "Clinical Reasoning", "Recognizes cues, prioritizes risks, acts safely, and evaluates outcomes.", ["priority cue", "action taken", "reassessment"]),
      competency("rn-documentation", "Documentation", "Professional Practice", "Documents assessments, interventions, patient response, and communication accurately.", ["charting example", "handoff note"]),
      competency("rn-patient-education", "Patient Education", "Therapeutic Teaching", "Provides individualized teaching with teach-back and safety planning.", ["teach-back", "discharge teaching"]),
    ],
  },
  RPN_LPN: {
    profession: "RPN_LPN",
    label: "Practical Nursing",
    commonSettings: ["Medical-Surgical", "Long-Term Care", "Rehabilitation", "Community", "Mental Health"],
    commonSpecialties: ["Stable Adult Health", "Older Adult Care", "Medication Safety", "Rehabilitation"],
    preparationTopics: ["Scope awareness", "Medication safety", "Stable patient assessment", "Documentation", "Escalation"],
    expectedSkills: ["Vital signs", "Medication administration", "Wound care", "Mobility support", "Patient teaching", "Documentation"],
    competencies: [
      competency("pn-med-admin", "Medication Administration", "Medication Safety", "Safely administers medications within practical nursing scope and reports concerns.", ["rights of medication", "monitoring", "scope check"]),
      competency("pn-assessment", "Stable Patient Assessment", "Assessment", "Performs focused assessments and recognizes when patient status exceeds expected stability.", ["baseline assessment", "change recognition"]),
      competency("pn-escalation", "Escalation And Collaboration", "Clinical Judgment", "Reports deterioration, abnormal findings, and safety concerns promptly.", ["SBAR", "timely reporting"]),
      competency("pn-documentation", "Documentation", "Professional Practice", "Documents care, response, teaching, and escalation clearly.", ["progress note", "care plan update"]),
      competency("pn-patient-support", "Patient Support And Teaching", "Therapeutic Care", "Supports activities of daily living, comfort, and patient education.", ["ADL support", "teach-back"]),
    ],
  },
  NP: {
    profession: "NP",
    label: "Nurse Practitioner",
    commonSettings: ["Primary Care", "Urgent Care", "Specialty Clinic", "Long-Term Care", "Community"],
    commonSpecialties: ["Primary Care", "Diagnostics", "Prescribing", "Chronic Disease", "Health Promotion"],
    preparationTopics: ["Differential diagnosis", "Diagnostics", "Prescribing", "Follow-up planning", "Patient education"],
    expectedSkills: ["Advanced assessment", "Diagnostic reasoning", "Management planning", "Prescribing considerations", "Referral decisions"],
    competencies: [
      competency("np-assessment", "Advanced Assessment", "Assessment", "Performs advanced history and physical assessment linked to differential diagnoses.", ["advanced exam", "history synthesis"]),
      competency("np-diagnostics", "Diagnostic Reasoning", "Diagnostics", "Selects and interprets diagnostics based on presentation, risk, and management plan.", ["differential list", "test rationale"]),
      competency("np-prescribing", "Prescribing Safety", "Pharmacology", "Applies indication, contraindication, monitoring, interactions, and patient education.", ["medication plan", "monitoring plan"]),
      competency("np-management", "Management Planning", "Clinical Decision-Making", "Creates evidence-informed treatment, follow-up, and escalation plans.", ["care plan", "follow-up criteria"]),
      competency("np-professional", "Professional Accountability", "Professional Practice", "Practices within role, consultation needs, documentation, and ethical expectations.", ["consultation note", "documentation"]),
    ],
  },
  RT: {
    profession: "RT",
    label: "Respiratory Therapy",
    commonSettings: ["ICU", "Emergency", "Operating Room", "Neonatal", "Pulmonary Function", "General Medicine"],
    commonSpecialties: ["Airway", "Ventilation", "ABGs", "Oxygen Therapy", "Respiratory Assessment"],
    preparationTopics: ["ABGs", "Oxygen devices", "Ventilator basics", "Airway equipment", "Respiratory assessment"],
    expectedSkills: ["Airway management", "Ventilator checks", "ABG interpretation", "Oxygen therapy", "Aerosol therapy", "Respiratory assessment"],
    competencies: [
      competency("rt-airway", "Airway Management", "Airway", "Maintains airway safety, equipment readiness, suctioning, and escalation.", ["airway assessment", "equipment check"]),
      competency("rt-ventilator", "Ventilator Management", "Ventilation", "Assesses ventilator settings, patient synchrony, alarms, and response.", ["ventilator check", "alarm response"]),
      competency("rt-abg", "ABG Interpretation", "Gas Exchange", "Interprets ABGs in context of oxygenation, ventilation, and patient status.", ["ABG interpretation", "clinical action"]),
      competency("rt-oxygen", "Oxygen Therapy", "Oxygenation", "Selects and evaluates oxygen delivery devices and escalation needs.", ["device selection", "response assessment"]),
      competency("rt-communication", "Respiratory Handoff", "Professional Practice", "Communicates respiratory concerns, trends, and urgent changes clearly.", ["handoff", "urgent communication"]),
    ],
  },
  PARAMEDIC: {
    profession: "PARAMEDIC",
    label: "Paramedicine",
    commonSettings: ["Ambulance", "Emergency Scene", "Community Paramedicine", "Interfacility Transport"],
    commonSpecialties: ["Trauma", "Cardiac Emergencies", "Airway", "Medication Administration", "Scene Safety"],
    preparationTopics: ["Primary survey", "Secondary survey", "Trauma assessment", "ECG basics", "Emergency pharmacology"],
    expectedSkills: ["Primary survey", "Trauma assessment", "Airway support", "Cardiac monitoring", "Medication administration", "Handoff"],
    competencies: [
      competency("paramedic-scene", "Scene Safety", "Scene Management", "Assesses hazards, safety, resources, and scene control before patient care.", ["hazard assessment", "resource request"]),
      competency("paramedic-trauma", "Trauma Assessment", "Emergency Assessment", "Performs primary and secondary surveys with life-threat prioritization.", ["primary survey", "trauma findings"]),
      competency("paramedic-cardiac", "Cardiac Emergencies", "Emergency Cardiology", "Recognizes cardiac emergencies and initiates appropriate protocols.", ["ECG cue", "treatment rationale"]),
      competency("paramedic-meds", "Emergency Medication Administration", "Medication Safety", "Administers emergency medications safely with indication and reassessment.", ["dose check", "patient response"]),
      competency("paramedic-handoff", "Hospital Handoff", "Professional Communication", "Communicates concise, organized, clinically relevant transfer reports.", ["handoff report", "timeline"]),
    ],
  },
  OT: {
    profession: "OT",
    label: "Occupational Therapy",
    commonSettings: ["Rehabilitation", "Acute Care", "Community", "Mental Health", "Pediatrics", "Long-Term Care"],
    commonSpecialties: ["ADLs", "Home Safety", "Cognition", "Adaptive Equipment", "Functional Independence"],
    preparationTopics: ["ADL assessment", "Functional assessment", "Home safety", "Cognition", "Documentation"],
    expectedSkills: ["ADL assessment", "Functional assessment", "Home safety planning", "Adaptive equipment education", "Goal setting"],
    competencies: [
      competency("ot-adl", "ADL Assessment", "Functional Assessment", "Assesses self-care performance, barriers, supports, and independence goals.", ["ADL observation", "barrier analysis"]),
      competency("ot-home-safety", "Home Safety Assessment", "Safety", "Identifies risks and recommends modifications or supports.", ["risk finding", "recommendation"]),
      competency("ot-cognition", "Cognitive And Functional Screening", "Cognition", "Screens cognition as it affects safety, ADLs, and participation.", ["screen result", "functional implication"]),
      competency("ot-equipment", "Adaptive Equipment", "Intervention", "Selects and teaches equipment to support safe function.", ["equipment rationale", "teaching"]),
      competency("ot-goals", "Occupation-Based Goals", "Professional Practice", "Creates patient-centered goals tied to meaningful participation.", ["goal statement", "outcome measure"]),
    ],
  },
  PT: {
    profession: "PT",
    label: "Physiotherapy",
    commonSettings: ["Acute Care", "Rehabilitation", "Outpatient", "Community", "Long-Term Care"],
    commonSpecialties: ["Mobility", "Gait", "Musculoskeletal Assessment", "Transfers", "Rehabilitation Planning"],
    preparationTopics: ["Mobility assessment", "Gait assessment", "Transfers", "Fall prevention", "Exercise prescription"],
    expectedSkills: ["Mobility assessment", "Gait assessment", "Transfer training", "Range of motion", "Therapeutic exercise"],
    competencies: [
      competency("pt-mobility", "Mobility Assessment", "Functional Mobility", "Assesses bed mobility, transfers, ambulation, tolerance, and safety.", ["mobility level", "assist requirement"]),
      competency("pt-gait", "Gait Assessment", "Gait", "Assesses gait quality, device use, balance, and fall risk.", ["gait observation", "device recommendation"]),
      competency("pt-msk", "Musculoskeletal Evaluation", "Assessment", "Assesses strength, range, pain, movement pattern, and functional impact.", ["ROM finding", "strength finding"]),
      competency("pt-rehab-plan", "Rehabilitation Planning", "Intervention", "Creates progressive, safe rehabilitation plans tied to goals.", ["plan progression", "safety criteria"]),
      competency("pt-education", "Patient Education", "Therapeutic Teaching", "Teaches safe mobility, exercises, precautions, and self-management.", ["teach-back", "home program"]),
    ],
  },
  MLT: {
    profession: "MLT",
    label: "Medical Laboratory Technology",
    commonSettings: ["Core Lab", "Hematology", "Chemistry", "Microbiology", "Transfusion Medicine", "Specimen Collection"],
    commonSpecialties: ["Specimen Integrity", "CBC", "Quality Control", "Critical Values", "Laboratory Safety"],
    preparationTopics: ["Specimen collection", "CBC interpretation", "Quality control", "Critical values", "Lab safety"],
    expectedSkills: ["Specimen handling", "Quality control", "Analyzer workflow", "Critical value communication", "Lab documentation"],
    competencies: [
      competency("mlt-specimen", "Specimen Collection And Integrity", "Pre-Analytic", "Maintains specimen identity, quality, timing, and rejection criteria.", ["collection check", "rejection rationale"]),
      competency("mlt-cbc", "CBC Interpretation Workflow", "Hematology", "Connects CBC abnormalities to quality checks and clinical urgency.", ["CBC trend", "critical value"]),
      competency("mlt-qc", "Quality Control", "Quality Assurance", "Performs and responds to QC checks before reporting results.", ["QC result", "corrective action"]),
      competency("mlt-safety", "Laboratory Safety", "Safety", "Applies PPE, biosafety, sharps, chemical, and exposure protocols.", ["safety practice", "incident response"]),
      competency("mlt-critical", "Critical Value Communication", "Professional Practice", "Communicates critical results promptly and documents according to policy.", ["call documentation", "read-back"]),
    ],
  },
  PSW: {
    profession: "PSW",
    label: "Personal Support Worker",
    commonSettings: ["Long-Term Care", "Home Care", "Retirement Home", "Rehabilitation", "Complex Continuing Care"],
    commonSpecialties: ["ADLs", "Mobility Support", "Dementia Care", "Safety", "Communication"],
    preparationTopics: ["ADL support", "Infection prevention", "Falls", "Dementia communication", "Reporting changes"],
    expectedSkills: ["Personal care", "Transfers", "Feeding support", "Observation", "Reporting", "Communication"],
    competencies: [
      competency("psw-adl", "Activities Of Daily Living Support", "Personal Care", "Provides respectful, safe support for bathing, dressing, toileting, feeding, and comfort.", ["ADL support", "privacy"]),
      competency("psw-mobility", "Mobility And Transfer Support", "Safety", "Supports mobility within care plan and reports risks.", ["transfer assist", "fall risk"]),
      competency("psw-observation", "Observation And Reporting", "Communication", "Recognizes and reports changes in condition, behavior, intake, output, or safety.", ["change observed", "reported to staff"]),
      competency("psw-dementia", "Dementia-Informed Communication", "Therapeutic Communication", "Uses calm, person-centered communication and de-escalation.", ["communication example", "trigger reduction"]),
      competency("psw-infection", "Infection Prevention", "Safety", "Applies hand hygiene, PPE, cleaning, and isolation expectations.", ["PPE use", "hand hygiene"]),
    ],
  },
  SOCIAL_WORK: {
    profession: "SOCIAL_WORK",
    label: "Social Work",
    commonSettings: ["Hospital", "Community", "Mental Health", "Child And Family", "Long-Term Care"],
    commonSpecialties: ["Assessment", "Advocacy", "Discharge Planning", "Crisis Support", "Resource Navigation"],
    preparationTopics: ["Psychosocial assessment", "Documentation", "Ethics", "Resource navigation", "Interprofessional collaboration"],
    expectedSkills: ["Psychosocial assessment", "Care coordination", "Advocacy", "Crisis support", "Documentation"],
    competencies: [
      competency("sw-assessment", "Psychosocial Assessment", "Assessment", "Assesses social, emotional, financial, safety, and support needs.", ["assessment note", "risk factor"]),
      competency("sw-advocacy", "Patient Advocacy", "Advocacy", "Supports patient voice, rights, access, and equity.", ["advocacy action", "barrier addressed"]),
      competency("sw-discharge", "Discharge And Resource Planning", "Care Coordination", "Coordinates resources and transitions with patient goals and risks.", ["resource plan", "follow-up"]),
      competency("sw-crisis", "Crisis Support", "Mental Health", "Responds safely to crisis, risk, and urgent psychosocial needs.", ["risk screen", "safety plan"]),
      competency("sw-ethics", "Ethical Practice", "Professional Practice", "Applies consent, confidentiality, boundaries, and professional accountability.", ["ethical issue", "consultation"]),
    ],
  },
  PSYCHOTHERAPY: {
    profession: "PSYCHOTHERAPY",
    label: "Psychotherapy",
    commonSettings: ["Community Mental Health", "Private Practice", "Hospital", "Addictions", "Youth Services"],
    commonSpecialties: ["Therapeutic Alliance", "Assessment", "Risk", "Treatment Planning", "Documentation"],
    preparationTopics: ["Therapeutic communication", "Risk assessment", "Treatment planning", "Boundaries", "Documentation"],
    expectedSkills: ["Therapeutic interviewing", "Risk screening", "Goal setting", "Treatment planning", "Progress notes"],
    competencies: [
      competency("psych-alliance", "Therapeutic Alliance", "Therapeutic Relationship", "Builds trust, safety, empathy, and collaborative goals.", ["rapport example", "collaborative goal"]),
      competency("psych-risk", "Risk Assessment", "Safety", "Assesses risk, protective factors, and escalation requirements.", ["risk assessment", "safety action"]),
      competency("psych-treatment", "Treatment Planning", "Clinical Planning", "Creates patient-centered treatment goals and interventions.", ["treatment goal", "intervention rationale"]),
      competency("psych-boundaries", "Professional Boundaries", "Professional Practice", "Maintains ethical boundaries, consent, confidentiality, and scope.", ["boundary example", "consultation"]),
      competency("psych-documentation", "Therapy Documentation", "Documentation", "Documents sessions, goals, risk, progress, and plan clearly.", ["progress note", "plan update"]),
    ],
  },
};

export const PLACEMENT_BADGES = [
  "Assessment Foundations",
  "Medication Safety",
  "Airway Management",
  "Wound Care",
  "Patient Education",
  "Clinical Communication",
  "Professional Practice",
  "Emergency Response",
] as const;

export const PLACEMENT_FEATURE_ACCESS: Record<PlacementMonetizationTier, PlacementFeatureAccess> = {
  free: {
    tier: "free",
    features: ["Basic hour tracking", "Basic reflections"],
  },
  paid: {
    tier: "paid",
    features: [
      "Competency tracking",
      "Clinical skills passport",
      "Portfolio generation",
      "Evaluation preparation",
      "AI clinical coaching",
      "Professional development reports",
      "Resume and interview integration",
    ],
  },
  institution: {
    tier: "institution",
    features: [
      "Instructor dashboards",
      "Program analytics",
      "Competency reporting",
      "Placement tracking",
      "Evaluation summaries",
      "Cohort progress dashboards",
    ],
  },
};

export function getPlacementFramework(profession: PlacementProfession): PlacementProfessionFramework {
  return PLACEMENT_PROFESSION_FRAMEWORKS[profession];
}

export function calculatePlacementDashboard(
  profile: PlacementProfile,
  hourLogs: ClinicalHourLog[],
  evidence: CompetencyEvidence[],
): PlacementDashboard {
  const framework = getPlacementFramework(profile.profession);
  const hoursCompleted = Math.round(hourLogs.reduce((sum, log) => sum + log.hours, 0) * 100) / 100;
  const mastered = new Set(
    evidence
      .filter((item) => PLACEMENT_COMPETENCY_STATUS_ORDER.indexOf(item.status) >= PLACEMENT_COMPETENCY_STATUS_ORDER.indexOf("performed_independently"))
      .map((item) => item.competencyId),
  );
  const weekly = new Map<string, number>();
  for (const log of hourLogs) {
    const date = new Date(`${log.date}T00:00:00.000Z`);
    const day = date.getUTCDay();
    date.setUTCDate(date.getUTCDate() - day);
    const key = date.toISOString().slice(0, 10);
    weekly.set(key, Math.round(((weekly.get(key) ?? 0) + log.hours) * 100) / 100);
  }

  return {
    profile,
    hoursCompleted,
    hoursRemaining: Math.max(0, Math.round((profile.requiredHours - hoursCompleted) * 100) / 100),
    weeklyHours: [...weekly.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([weekStart, hours]) => ({ weekStart, hours })),
    programProgress: Math.min(100, Math.round((hoursCompleted / Math.max(1, profile.requiredHours)) * 100)),
    competenciesCompleted: mastered.size,
    competenciesOutstanding: Math.max(0, framework.competencies.length - mastered.size),
    competencyProgress: Math.round((mastered.size / Math.max(1, framework.competencies.length)) * 100),
    placementGoals: profile.goals,
    evaluationStatus: profile.evaluationStatus,
  };
}

export function buildPreparationCenter(profile: PlacementProfile): PlacementPreparationCenter {
  const framework = getPlacementFramework(profile.profession);
  return {
    unitOrientationGuide: [
      `Review the ${profile.placementSetting} workflow, escalation chain, safety expectations, and documentation norms.`,
      `Clarify scope, supervision, and which skills require direct observation in ${profile.placementSpecialty}.`,
    ],
    commonDiagnoses: framework.commonSpecialties.map((specialty) => `${specialty} presentations commonly encountered in ${profile.placementSetting}`),
    commonMedications: ["Analgesics", "Antibiotics", "Anticoagulants", "Cardiovascular medications", "Respiratory therapies"],
    commonEquipment: framework.expectedSkills.map((skill) => `${skill} equipment or documentation tools`),
    expectedSkills: framework.expectedSkills,
    instructorExpectations: ["Arrive prepared", "Know patient safety priorities", "Ask before unfamiliar skills", "Document accurately", "Reflect after feedback"],
    frequentlyAskedQuestions: [
      "What should I review before the first shift?",
      "Which skills require direct supervision?",
      "How should I report a change in client status?",
      "What evidence should I collect for evaluation?",
    ],
    professionalConductExpectations: ["Confidentiality", "Punctuality", "Respectful communication", "Scope awareness", "Timely escalation"],
  };
}

export function buildShiftPrepToolkit(profile: PlacementProfile): ShiftPrepToolkit {
  const framework = getPlacementFramework(profile.profession);
  return {
    patientPreparationSheets: ["Patient identifiers", "Reason for care", "Priority risks", "Questions for preceptor", "Safety checks"],
    clinicalWorksheets: ["Assessment cues", "Interventions", "Evaluation", "Documentation notes", "Learning evidence"],
    brainSheets: ["Shift priorities", "Time-sensitive tasks", "Escalation triggers", "Follow-up items"],
    instructorQuestionBanks: framework.preparationTopics.map((topic) => `Explain the placement relevance of ${topic}.`),
    medicationReviewSheets: ["Medication purpose", "Safety checks", "Monitoring", "Patient teaching", "When to hold or escalate"],
    pathophysiologyReviewSheets: framework.commonSpecialties.map((specialty) => `${specialty}: pathophysiology, cues, and priority actions`),
    labInterpretationReviewSheets: ["Critical values", "Trends", "Specimen issues", "Clinical meaning", "Who to notify"],
  };
}

export function buildReflectionTemplate(): ReflectionTemplate {
  return {
    prompts: [
      "What happened?",
      "What went well?",
      "What challenged me?",
      "What knowledge gaps were identified?",
      "How will I improve?",
      "What evidence supports my learning?",
    ],
    evidenceFields: ["Competency addressed", "Skill performed", "Feedback received", "Action plan"],
    coachingFocus: ["Professional growth", "Time management", "Communication", "Clinical reasoning", "Confidence building"],
  };
}

export function buildEvaluationPrepSummary(
  profile: PlacementProfile,
  evidence: CompetencyEvidence[],
  feedback: FeedbackTrend,
): EvaluationPrepSummary {
  const framework = getPlacementFramework(profile.profession);
  const achieved = framework.competencies.filter((competencyItem) =>
    evidence.some((item) => item.competencyId === competencyItem.id && item.status === "mastered"),
  );
  return {
    strengthSummary: feedback.strengths,
    competencySummary: achieved.map((item) => `${item.label}: evidence supports mastery or independent performance.`),
    achievementExamples: evidence.slice(0, 5).map((item) => item.evidence),
    clinicalGrowthExamples: feedback.clinicalComments,
    professionalDevelopmentGoals: profile.goals,
    improvementAreas: feedback.improvementAreas,
  };
}

export function buildInterprofessionalLearningLog(): InterprofessionalLearningLog {
  return {
    disciplines: ["Nurses", "Physicians", "RTs", "PTs", "OTs", "Pharmacists", "Social Workers", "Paramedics"],
    reflectionPrompts: [
      "What did this profession contribute to patient care?",
      "How did communication affect the outcome?",
      "What did I learn about role clarity and collaboration?",
      "How will this change my future practice?",
    ],
  };
}

export function buildProfessionalPortfolio(
  profile: PlacementProfile,
  evidence: CompetencyEvidence[],
  feedback: FeedbackTrend,
): ProfessionalPortfolio {
  const framework = getPlacementFramework(profile.profession);
  const evidenceByCompetency = new Map(evidence.map((item) => [item.competencyId, item]));
  return {
    clinicalAccomplishments: feedback.strengths,
    competenciesAchieved: framework.competencies
      .filter((item) => evidenceByCompetency.has(item.id))
      .map((item) => item.label),
    placementSummaries: [`${profile.program} placement in ${profile.placementSetting} focused on ${profile.placementSpecialty}.`],
    professionalReflections: feedback.professionalComments,
    leadershipExamples: evidence.filter((item) => item.evidence.toLowerCase().includes("led")).map((item) => item.evidence),
    qualityImprovementExperiences: evidence.filter((item) => item.evidence.toLowerCase().includes("improved")).map((item) => item.evidence),
  };
}

export function buildResumeInterviewIntegration(profile: PlacementProfile, portfolio: ProfessionalPortfolio): ResumeInterviewIntegration {
  const competencyText = portfolio.competenciesAchieved.slice(0, 3).join(", ") || "clinical care";
  return {
    resumeBullets: [
      `Completed ${profile.placementSpecialty} placement in ${profile.placementSetting}, building experience in ${competencyText}.`,
      "Documented clinical learning evidence, reflected on feedback, and developed targeted professional goals.",
    ],
    starExamples: portfolio.clinicalAccomplishments.slice(0, 3).map((item) => `Situation/Task: clinical placement challenge. Action: ${item}. Result: improved patient care or professional growth.`),
    professionalSummary: `${profile.profession} learner with placement experience in ${profile.placementSpecialty}, focused on safe practice, communication, and competency growth.`,
  };
}

export function buildClinicalCoachInsights(dashboard: PlacementDashboard, feedback: FeedbackTrend): ClinicalCoachInsight[] {
  const insights: ClinicalCoachInsight[] = [];
  if (dashboard.programProgress < 50) {
    insights.push({
      focusArea: "Placement Momentum",
      coaching: "You are still building hours. Use each shift to gather specific competency evidence instead of only logging time.",
      recommendedAction: "Pick one competency goal before the next shift and ask your preceptor to observe it.",
    });
  }
  if (dashboard.competencyProgress < 60) {
    insights.push({
      focusArea: "Competency Progress",
      coaching: "Several competencies still need stronger evidence. Focus on observed or assisted skills progressing toward independent performance.",
      recommendedAction: "Review outstanding competencies and connect each one to a shift goal.",
    });
  }
  if (feedback.improvementAreas.length > 0) {
    insights.push({
      focusArea: "Feedback Follow-Up",
      coaching: `Your feedback highlights ${feedback.improvementAreas[0]}. Treat this as a focused growth target, not a failure.`,
      recommendedAction: "Write one measurable action you will take next shift and what evidence will show improvement.",
    });
  }
  return insights.length ? insights : [{
    focusArea: "Professional Growth",
    coaching: "Your placement evidence shows steady progress. Continue collecting specific examples for evaluation and interviews.",
    recommendedAction: "Convert one recent clinical experience into a STAR interview example.",
  }];
}

export function buildInstructorResourceCenter(): InstructorResourceCenter {
  return {
    enabledForTier: "institution",
    features: [
      "Competency review",
      "Progress dashboards",
      "Student analytics",
      "Evaluation summaries",
      "Placement tracking",
      "Cohort competency reporting",
    ],
  };
}

export function buildPlacementSuccessHubSnapshot(profile: PlacementProfile, hourLogs: ClinicalHourLog[], evidence: CompetencyEvidence[], feedback: FeedbackTrend) {
  const dashboard = calculatePlacementDashboard(profile, hourLogs, evidence);
  const portfolio = buildProfessionalPortfolio(profile, evidence, feedback);
  return {
    dashboard,
    preparationCenter: buildPreparationCenter(profile),
    shiftPrepToolkit: buildShiftPrepToolkit(profile),
    reflectionTemplate: buildReflectionTemplate(),
    evaluationPrep: buildEvaluationPrepSummary(profile, evidence, feedback),
    interprofessionalLog: buildInterprofessionalLearningLog(),
    portfolio,
    resumeInterview: buildResumeInterviewIntegration(profile, portfolio),
    coachInsights: buildClinicalCoachInsights(dashboard, feedback),
    instructorResourceCenter: buildInstructorResourceCenter(),
    monetization: PLACEMENT_FEATURE_ACCESS,
    mobileCapabilities: ["Log hours", "Record reflections", "Track competencies", "Upload notes", "Review goals"],
  };
}
