export type ProfessionJourneyId =
  | "rn"
  | "rpn-lpn"
  | "np"
  | "respiratory-therapy"
  | "medical-laboratory-science"
  | "diagnostic-imaging"
  | "occupational-therapy"
  | "physiotherapy"
  | "speech-language-pathology"
  | "social-work"
  | "paramedicine"
  | "new-graduate-nurse"
  | "other-allied-health";

export type ProfessionGoalId =
  | "pass-licensing-exam"
  | "prepare-school-exams"
  | "improve-clinical-skills"
  | "prepare-orientation"
  | "build-medication-confidence"
  | "improve-clinical-judgment"
  | "prepare-certification"
  | "advance-career"
  | "maintain-competency";

export type ProfessionExperienceLevel =
  | "student"
  | "final-semester"
  | "graduate-awaiting-exam"
  | "new-graduate"
  | "practicing-professional"
  | "advanced-practitioner";

export type CompetencyStatus = "mastered" | "developing" | "needs-improvement" | "not-started";

export type CareerMilestoneId =
  | "student"
  | "graduate"
  | "licensed"
  | "orientation-complete"
  | "independent-practice"
  | "advanced-practice"
  | "certification"
  | "specialization";

export type ProfessionOnboardingOption = {
  id: ProfessionJourneyId;
  label: string;
  description: string;
  defaultExam: string | null;
};

export type GoalOption = {
  id: ProfessionGoalId;
  label: string;
  recommendationBias: ProfessionRecommendationKind[];
};

export type ExperienceLevelOption = {
  id: ProfessionExperienceLevel;
  label: string;
  milestone: CareerMilestoneId;
};

export type CompetencyDefinition = {
  id: string;
  label: string;
  description: string;
  readinessWeight: number;
  recommendedActivities: ProfessionRecommendationKind[];
};

export type CompetencySignal = {
  competencyId: string;
  performanceScore: number | null;
  confidenceScore: number | null;
  attempts: number;
  lastActivityDaysAgo: number | null;
};

export type CompetencyHeatMapCell = CompetencyDefinition & {
  score: number;
  status: CompetencyStatus;
  evidence: string;
};

export type ProfessionRecommendationKind =
  | "lesson"
  | "flashcards"
  | "questions"
  | "simulation"
  | "clinical-skills"
  | "pharmacology"
  | "ecg";

export type JourneyRecommendation = {
  kind: ProfessionRecommendationKind;
  title: string;
  reason: string;
  competencyId: string;
  href: string;
  priority: number;
};

export type StudyPlanTask = JourneyRecommendation & {
  quantity: number;
  estimatedMinutes: number;
};

export type AdaptiveStudyPlan = {
  daily: StudyPlanTask[];
  weekly: StudyPlanTask[];
  monthly: StudyPlanTask[];
  estimatedDailyMinutes: number;
  focusCompetencies: string[];
  planRationale: string;
};

export type ProfessionReadinessScore = {
  id: string;
  label: string;
  score: number;
  status: CompetencyStatus;
  supportingCompetencies: string[];
};

export type CareerMilestone = {
  id: CareerMilestoneId;
  label: string;
  status: "complete" | "current" | "upcoming";
};

export type ProfessionDashboardModel = {
  profession: ProfessionOnboardingOption;
  goals: GoalOption[];
  experienceLevel: ExperienceLevelOption;
  heatMap: CompetencyHeatMapCell[];
  readinessScores: ProfessionReadinessScore[];
  milestones: CareerMilestone[];
  studyPlan: AdaptiveStudyPlan;
  recommendations: JourneyRecommendation[];
  dashboardFocus: string[];
};

export type ProfessionJourneyInput = {
  professionId: ProfessionJourneyId;
  goalIds: ProfessionGoalId[];
  experienceLevel: ProfessionExperienceLevel;
  availableStudyMinutesPerDay: number;
  weakAreas: string[];
  confidenceByCompetency?: Record<string, number | null>;
  performanceByCompetency?: Record<string, number | null>;
  activitySignals?: CompetencySignal[];
};

export type AdminProfessionJourneyInsights = {
  totalLearners: number;
  mostCommonGoals: Array<{ goalId: ProfessionGoalId; label: string; count: number }>;
  mostCommonWeakAreas: Array<{ competencyId: string; label: string; count: number }>;
  mostCommonCompetencyGaps: Array<{ competencyId: string; label: string; count: number }>;
  professionTrends: Array<{ professionId: ProfessionJourneyId; label: string; learners: number; averageReadiness: number }>;
  contentDemand: Array<{ activity: ProfessionRecommendationKind; learnerDemand: number }>;
  simulationDemand: Array<{ competencyId: string; label: string; count: number }>;
};

export const PROFESSION_ONBOARDING_OPTIONS: ProfessionOnboardingOption[] = [
  { id: "rn", label: "RN", description: "Registered nursing exam and clinical judgment pathway.", defaultExam: "NCLEX-RN" },
  { id: "rpn-lpn", label: "RPN/LPN", description: "Practical nursing entry-to-practice pathway.", defaultExam: "REx-PN / NCLEX-PN" },
  { id: "np", label: "NP", description: "Advanced assessment, diagnostics, prescribing, and CNPLE readiness.", defaultExam: "CNPLE" },
  { id: "respiratory-therapy", label: "Respiratory Therapy", description: "Ventilation, ABGs, airway, and respiratory care readiness.", defaultExam: "RT Exams" },
  { id: "medical-laboratory-science", label: "Medical Laboratory Science", description: "Specimen, quality control, hematology, and lab safety readiness.", defaultExam: null },
  { id: "diagnostic-imaging", label: "Diagnostic Imaging", description: "Imaging safety, positioning, and clinical workflow readiness.", defaultExam: null },
  { id: "occupational-therapy", label: "Occupational Therapy", description: "Functional assessment, ADLs, equipment, and care planning.", defaultExam: null },
  { id: "physiotherapy", label: "Physiotherapy", description: "Mobility, assessment, exercise therapy, and rehab planning.", defaultExam: null },
  { id: "speech-language-pathology", label: "Speech-Language Pathology", description: "Swallowing, communication, and cognitive rehab readiness.", defaultExam: null },
  { id: "social-work", label: "Social Work", description: "Crisis support, case planning, advocacy, and discharge coordination.", defaultExam: null },
  { id: "paramedicine", label: "Paramedicine", description: "Emergency assessment, scene management, trauma, and transport priorities.", defaultExam: null },
  { id: "new-graduate-nurse", label: "New Graduate Nurse", description: "First-year transition, orientation, medication safety, telemetry, and shift readiness.", defaultExam: null },
  { id: "other-allied-health", label: "Other Allied Health", description: "Profession-specific clinical learning and competency development.", defaultExam: null },
] as const;

export const PROFESSION_GOAL_OPTIONS: GoalOption[] = [
  { id: "pass-licensing-exam", label: "Pass my licensing exam", recommendationBias: ["questions", "flashcards", "lesson"] },
  { id: "prepare-school-exams", label: "Prepare for school exams", recommendationBias: ["lesson", "questions", "flashcards"] },
  { id: "improve-clinical-skills", label: "Improve clinical skills", recommendationBias: ["clinical-skills", "simulation", "lesson"] },
  { id: "prepare-orientation", label: "Prepare for orientation", recommendationBias: ["simulation", "clinical-skills", "lesson"] },
  { id: "build-medication-confidence", label: "Build medication confidence", recommendationBias: ["pharmacology", "questions", "flashcards"] },
  { id: "improve-clinical-judgment", label: "Improve clinical judgment", recommendationBias: ["questions", "simulation", "lesson"] },
  { id: "prepare-certification", label: "Prepare for certification", recommendationBias: ["questions", "lesson", "simulation"] },
  { id: "advance-career", label: "Advance my career", recommendationBias: ["lesson", "simulation", "clinical-skills"] },
  { id: "maintain-competency", label: "Maintain competency", recommendationBias: ["questions", "flashcards", "clinical-skills"] },
] as const;

export const EXPERIENCE_LEVEL_OPTIONS: ExperienceLevelOption[] = [
  { id: "student", label: "Student", milestone: "student" },
  { id: "final-semester", label: "Final Semester", milestone: "student" },
  { id: "graduate-awaiting-exam", label: "Graduate Awaiting Exam", milestone: "graduate" },
  { id: "new-graduate", label: "New Graduate", milestone: "orientation-complete" },
  { id: "practicing-professional", label: "Practicing Professional", milestone: "independent-practice" },
  { id: "advanced-practitioner", label: "Advanced Practitioner", milestone: "advanced-practice" },
] as const;

const COMPETENCY_MAPS: Record<ProfessionJourneyId, CompetencyDefinition[]> = {
  rn: [
    competency("medical-surgical", "Medical Surgical", "Adult health, assessment, deterioration, and nursing interventions.", 1, ["questions", "lesson", "simulation"]),
    competency("maternal-child", "Maternal Child", "Pregnancy, postpartum, pediatrics, family care, and safety.", 0.85, ["lesson", "questions", "flashcards"]),
    competency("mental-health", "Mental Health", "Therapeutic communication, safety, crisis, and psychiatric nursing.", 0.8, ["questions", "simulation", "lesson"]),
    competency("pharmacology", "Pharmacology", "Medication safety, monitoring, adverse effects, and patient teaching.", 1, ["pharmacology", "flashcards", "questions"]),
    competency("leadership", "Leadership", "Delegation, prioritization, assignment, and professional accountability.", 0.85, ["questions", "simulation", "lesson"]),
    competency("clinical-judgment", "Clinical Judgment", "Cue recognition, hypothesis prioritization, action, and outcome evaluation.", 1, ["questions", "simulation", "lesson"]),
  ],
  "rpn-lpn": [
    competency("entry-practice", "Entry-to-Practice Competencies", "Foundational stable/common care within practical nursing scope.", 1, ["lesson", "questions", "clinical-skills"]),
    competency("medication-administration", "Medication Administration", "Safe administration, monitoring, documentation, and consultation triggers.", 1, ["pharmacology", "flashcards", "questions"]),
    competency("communication", "Communication", "Therapeutic communication, reporting, and team collaboration.", 0.8, ["simulation", "lesson", "questions"]),
    competency("documentation", "Documentation", "Clear, timely, factual documentation and reporting of changes.", 0.75, ["clinical-skills", "lesson", "simulation"]),
    competency("foundational-assessment", "Foundational Assessment", "Baseline assessment, changes from baseline, and escalation.", 0.9, ["clinical-skills", "questions", "lesson"]),
  ],
  np: [
    competency("assessment", "Assessment", "Advanced history, physical exam, and risk stratification.", 1, ["lesson", "simulation", "questions"]),
    competency("diagnostics", "Diagnostics", "Differential diagnosis, investigations, and interpretation.", 1, ["questions", "simulation", "lesson"]),
    competency("prescribing", "Prescribing", "Medication selection, monitoring, contraindications, and follow-up.", 1, ["pharmacology", "questions", "simulation"]),
    competency("clinical-reasoning", "Clinical Reasoning", "Advanced synthesis, management planning, and escalation.", 1, ["simulation", "questions", "lesson"]),
  ],
  "respiratory-therapy": [
    competency("ventilation", "Ventilation", "Ventilator modes, alarms, synchrony, and troubleshooting.", 1, ["simulation", "questions", "lesson"]),
    competency("abgs", "ABGs", "Acid-base interpretation and respiratory response.", 1, ["questions", "flashcards", "lesson"]),
    competency("airway-management", "Airway Management", "Oxygen delivery, airway clearance, escalation, and emergencies.", 1, ["clinical-skills", "simulation", "questions"]),
  ],
  "medical-laboratory-science": [
    competency("specimen-integrity", "Specimen Integrity", "Collection, labeling, handling, rejection criteria, and safety.", 1, ["clinical-skills", "questions", "lesson"]),
    competency("quality-control", "Quality Control", "Controls, calibration, error detection, and result reliability.", 0.9, ["lesson", "questions", "simulation"]),
    competency("hematology", "Hematology", "CBC interpretation, abnormal flags, and critical reporting.", 0.85, ["questions", "lesson", "flashcards"]),
  ],
  "diagnostic-imaging": [
    competency("imaging-safety", "Imaging Safety", "Radiation safety, screening, contrast precautions, and patient protection.", 1, ["lesson", "questions", "clinical-skills"]),
    competency("positioning", "Positioning", "Anatomy, positioning, image quality, and repeat prevention.", 0.85, ["clinical-skills", "flashcards", "questions"]),
    competency("workflow", "Clinical Workflow", "Orders, patient preparation, communication, and escalation.", 0.8, ["simulation", "lesson", "questions"]),
  ],
  "occupational-therapy": [
    competency("functional-assessment", "Functional Assessment", "ADLs, cognition, safety, and participation barriers.", 1, ["clinical-skills", "simulation", "lesson"]),
    competency("adl-training", "ADL Training", "Adaptive strategies, graded activity, and independence planning.", 0.9, ["clinical-skills", "lesson", "questions"]),
    competency("adaptive-equipment", "Adaptive Equipment", "Equipment selection, fit, education, and safety.", 0.8, ["flashcards", "clinical-skills", "questions"]),
  ],
  physiotherapy: [
    competency("mobility", "Mobility", "Gait, transfers, balance, and progression planning.", 1, ["clinical-skills", "simulation", "lesson"]),
    competency("assessment", "Assessment", "Strength, range, function, pain, and risk assessment.", 0.95, ["clinical-skills", "questions", "lesson"]),
    competency("exercise-therapy", "Exercise Therapy", "Exercise prescription, monitoring, and safe progression.", 0.9, ["lesson", "clinical-skills", "questions"]),
  ],
  "speech-language-pathology": [
    competency("swallowing", "Swallowing Assessment", "Dysphagia screening, aspiration risk, and recommendations.", 1, ["clinical-skills", "simulation", "lesson"]),
    competency("communication", "Communication Disorders", "Assessment, treatment planning, and communication supports.", 0.9, ["lesson", "questions", "flashcards"]),
    competency("cognitive-rehab", "Cognitive Rehabilitation", "Functional cognition, compensation, and family education.", 0.8, ["simulation", "lesson", "questions"]),
  ],
  "social-work": [
    competency("crisis-intervention", "Crisis Intervention", "Risk, safety planning, de-escalation, and supports.", 1, ["simulation", "lesson", "questions"]),
    competency("case-management", "Case Management", "Resources, discharge coordination, and continuity planning.", 0.9, ["simulation", "lesson", "clinical-skills"]),
    competency("mental-health-support", "Mental Health Support", "Assessment, advocacy, therapeutic communication, and referrals.", 0.85, ["lesson", "simulation", "questions"]),
  ],
  paramedicine: [
    competency("emergency-assessment", "Emergency Assessment", "Scene size-up, primary assessment, and critical decisions.", 1, ["simulation", "questions", "clinical-skills"]),
    competency("trauma-care", "Trauma Care", "Mechanism, hemorrhage, immobilization, and transport priorities.", 1, ["simulation", "questions", "lesson"]),
    competency("airway-management", "Airway Management", "Oxygenation, ventilation, airway adjuncts, and escalation.", 1, ["clinical-skills", "simulation", "questions"]),
    competency("cardiac-emergencies", "Cardiac Emergencies", "Chest pain, dysrhythmias, arrest, and rapid transport decisions.", 0.95, ["ecg", "simulation", "questions"]),
  ],
  "new-graduate-nurse": [
    competency("clinical-confidence", "Clinical Confidence", "First-year decision-making, escalation, and safe independence.", 1, ["simulation", "lesson", "clinical-skills"]),
    competency("shift-management", "Shift Management", "Assignments, interruptions, priorities, and handoff.", 1, ["simulation", "questions", "lesson"]),
    competency("medication-safety", "Medication Safety", "High-alert medications, common errors, monitoring, and clarification.", 1, ["pharmacology", "simulation", "flashcards"]),
    competency("telemetry-readiness", "Telemetry Readiness", "Rhythm recognition, clinical implications, and escalation.", 0.9, ["ecg", "questions", "lesson"]),
  ],
  "other-allied-health": [
    competency("professional-foundations", "Professional Foundations", "Scope, communication, documentation, and safety.", 1, ["lesson", "questions", "clinical-skills"]),
    competency("clinical-reasoning", "Clinical Reasoning", "Cue recognition, decision-making, and escalation.", 0.9, ["simulation", "questions", "lesson"]),
    competency("competency-maintenance", "Competency Maintenance", "Ongoing practice, reflection, and quality improvement.", 0.8, ["flashcards", "lesson", "questions"]),
  ],
};

function competency(
  id: string,
  label: string,
  description: string,
  readinessWeight: number,
  recommendedActivities: ProfessionRecommendationKind[],
): CompetencyDefinition {
  return { id, label, description, readinessWeight, recommendedActivities };
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function statusForScore(score: number, attempts: number): CompetencyStatus {
  if (attempts === 0) return "not-started";
  if (score >= 82) return "mastered";
  if (score >= 65) return "developing";
  return "needs-improvement";
}

function optionById<T extends { id: string }>(items: readonly T[], id: string): T {
  const item = items.find((candidate) => candidate.id === id);
  if (!item) throw new Error(`Unknown profession journey option: ${id}`);
  return item;
}

function signalFor(definition: CompetencyDefinition, input: ProfessionJourneyInput): CompetencySignal {
  const explicit = input.activitySignals?.find((signal) => signal.competencyId === definition.id);
  if (explicit) return explicit;
  const performance = input.performanceByCompetency?.[definition.id] ?? null;
  const confidence = input.confidenceByCompetency?.[definition.id] ?? null;
  const weakMatch = input.weakAreas.some((area) => area.toLowerCase().includes(definition.label.toLowerCase()) || definition.label.toLowerCase().includes(area.toLowerCase()));
  return {
    competencyId: definition.id,
    performanceScore: performance ?? (weakMatch ? 48 : null),
    confidenceScore: confidence,
    attempts: weakMatch || performance != null || confidence != null ? 1 : 0,
    lastActivityDaysAgo: null,
  };
}

export function listProfessionOnboardingOptions(): ProfessionOnboardingOption[] {
  return [...PROFESSION_ONBOARDING_OPTIONS];
}

export function listGoalOptions(): GoalOption[] {
  return [...PROFESSION_GOAL_OPTIONS];
}

export function listExperienceLevelOptions(): ExperienceLevelOption[] {
  return [...EXPERIENCE_LEVEL_OPTIONS];
}

export function getProfessionCompetencyMap(professionId: ProfessionJourneyId): CompetencyDefinition[] {
  return [...COMPETENCY_MAPS[professionId]];
}

export function buildCompetencyHeatMap(input: ProfessionJourneyInput): CompetencyHeatMapCell[] {
  return getProfessionCompetencyMap(input.professionId).map((definition) => {
    const signal = signalFor(definition, input);
    const performance = signal.performanceScore ?? 50;
    const confidence = signal.confidenceScore ?? performance;
    const recencyPenalty = signal.lastActivityDaysAgo != null && signal.lastActivityDaysAgo > 30 ? 8 : 0;
    const score = clampScore(performance * 0.72 + confidence * 0.28 - recencyPenalty);
    const status = statusForScore(score, signal.attempts);
    return {
      ...definition,
      score,
      status,
      evidence:
        signal.attempts === 0
          ? "No recent activity yet; include this competency in the starter plan."
          : `Based on ${signal.attempts} recent learning signal${signal.attempts === 1 ? "" : "s"}.`,
    };
  });
}

export function buildProfessionReadinessScores(heatMap: CompetencyHeatMapCell[]): ProfessionReadinessScore[] {
  const overall = weightedAverage(heatMap);
  const medication = averageByPattern(heatMap, /pharm|medicat|prescribing|drug/i);
  const clinicalSkills = averageByPattern(heatMap, /skill|assessment|mobility|airway|positioning|specimen|functional/i);
  const simulation = averageByPattern(heatMap, /judgment|management|emergency|shift|crisis|workflow|reasoning|trauma/i);
  const ecg = averageByPattern(heatMap, /ecg|telemetry|cardiac|ventilation|abg/i);

  return [
    readinessScore("profession-readiness", "Profession Readiness", overall, heatMap),
    readinessScore("medication-readiness", "Medication Readiness", medication ?? overall, heatMap),
    readinessScore("clinical-skills-readiness", "Clinical Skills Readiness", clinicalSkills ?? overall, heatMap),
    readinessScore("simulation-readiness", "Simulation Readiness", simulation ?? overall, heatMap),
    readinessScore("ecg-readiness", "ECG Readiness", ecg ?? overall, heatMap),
  ];
}

function readinessScore(id: string, label: string, score: number, heatMap: CompetencyHeatMapCell[]): ProfessionReadinessScore {
  return {
    id,
    label,
    score: clampScore(score),
    status: statusForScore(score, heatMap.some((cell) => cell.status !== "not-started") ? 1 : 0),
    supportingCompetencies: heatMap
      .filter((cell) => cell.status === "needs-improvement" || cell.status === "developing")
      .slice(0, 3)
      .map((cell) => cell.label),
  };
}

function weightedAverage(cells: CompetencyHeatMapCell[]): number {
  const totalWeight = cells.reduce((sum, cell) => sum + cell.readinessWeight, 0) || 1;
  return cells.reduce((sum, cell) => sum + cell.score * cell.readinessWeight, 0) / totalWeight;
}

function averageByPattern(cells: CompetencyHeatMapCell[], pattern: RegExp): number | null {
  const matched = cells.filter((cell) => pattern.test(`${cell.id} ${cell.label} ${cell.description}`));
  if (!matched.length) return null;
  return matched.reduce((sum, cell) => sum + cell.score, 0) / matched.length;
}

export function buildCareerMilestones(experienceLevel: ProfessionExperienceLevel): CareerMilestone[] {
  const current = optionById(EXPERIENCE_LEVEL_OPTIONS, experienceLevel).milestone;
  const order: CareerMilestoneId[] = [
    "student",
    "graduate",
    "licensed",
    "orientation-complete",
    "independent-practice",
    "advanced-practice",
    "certification",
    "specialization",
  ];
  const labels: Record<CareerMilestoneId, string> = {
    student: "Student",
    graduate: "Graduate",
    licensed: "Licensed",
    "orientation-complete": "Orientation Complete",
    "independent-practice": "Independent Practice",
    "advanced-practice": "Advanced Practice",
    certification: "Certification",
    specialization: "Specialization",
  };
  const currentIndex = order.indexOf(current);
  return order.map((id, index) => ({
    id,
    label: labels[id],
    status: index < currentIndex ? "complete" : index === currentIndex ? "current" : "upcoming",
  }));
}

export function buildJourneyRecommendations(input: ProfessionJourneyInput, heatMap = buildCompetencyHeatMap(input)): JourneyRecommendation[] {
  const goals = input.goalIds.map((id) => optionById(PROFESSION_GOAL_OPTIONS, id));
  const goalBias = goals.flatMap((goal) => goal.recommendationBias);
  const priorityCells = [...heatMap].sort((a, b) => {
    const statusWeight = (cell: CompetencyHeatMapCell) => cell.status === "needs-improvement" ? 0 : cell.status === "not-started" ? 1 : cell.status === "developing" ? 2 : 3;
    return statusWeight(a) - statusWeight(b) || a.score - b.score;
  });

  const recommendations: JourneyRecommendation[] = [];
  for (const cell of priorityCells.slice(0, 5)) {
    const activity = cell.recommendedActivities.find((kind) => goalBias.includes(kind)) ?? cell.recommendedActivities[0];
    recommendations.push({
      kind: activity,
      title: recommendationTitle(activity, cell.label),
      reason: recommendationReason(activity, cell.label, goals[0]?.label ?? "your goal"),
      competencyId: cell.id,
      href: recommendationHref(activity, cell.id),
      priority: recommendations.length + 1,
    });
  }

  return recommendations;
}

function recommendationTitle(kind: ProfessionRecommendationKind, competency: string): string {
  const verbs: Record<ProfessionRecommendationKind, string> = {
    lesson: "Review",
    flashcards: "Practice flashcards for",
    questions: "Answer questions on",
    simulation: "Run a scenario for",
    "clinical-skills": "Practice the skill set for",
    pharmacology: "Review medication safety for",
    ecg: "Interpret ECG cases for",
  };
  return `${verbs[kind]} ${competency}`;
}

function recommendationReason(kind: ProfessionRecommendationKind, competency: string, goal: string): string {
  const context: Record<ProfessionRecommendationKind, string> = {
    lesson: "A focused lesson rebuilds the concept before practice.",
    flashcards: "Spaced recall strengthens retention without adding overload.",
    questions: "Question practice shows whether the concept transfers into judgment.",
    simulation: "Simulation connects the concept to real workflow decisions.",
    "clinical-skills": "Skill practice turns knowledge into safe performance.",
    pharmacology: "Medication review targets safety, monitoring, and teaching.",
    ecg: "ECG interpretation improves when rhythm recognition is linked to action.",
  };
  return `${context[kind]} This supports: ${goal.toLowerCase()} in ${competency}.`;
}

function recommendationHref(kind: ProfessionRecommendationKind, competencyId: string): string {
  const base: Record<ProfessionRecommendationKind, string> = {
    lesson: "/app/lessons",
    flashcards: "/app/flashcards",
    questions: "/app/questions",
    simulation: "/app/simulation-center",
    "clinical-skills": "/app/clinical-skills",
    pharmacology: "/app/pharmacology",
    ecg: "/app/ecg-video-quiz",
  };
  return `${base[kind]}?competency=${encodeURIComponent(competencyId)}`;
}

export function buildAdaptiveStudyPlan(input: ProfessionJourneyInput): AdaptiveStudyPlan {
  const heatMap = buildCompetencyHeatMap(input);
  const recommendations = buildJourneyRecommendations(input, heatMap);
  const dailyCapacity = Math.max(10, input.availableStudyMinutesPerDay);
  const taskMinutes = dailyCapacity < 30 ? 8 : dailyCapacity < 60 ? 12 : 18;
  const daily = recommendations.slice(0, dailyCapacity < 40 ? 3 : 5).map((rec, index) => ({
    ...rec,
    quantity: quantityFor(rec.kind, index, "daily"),
    estimatedMinutes: taskMinutes,
  }));
  const weekly = recommendations.slice(0, 6).map((rec, index) => ({
    ...rec,
    quantity: quantityFor(rec.kind, index, "weekly"),
    estimatedMinutes: taskMinutes * 2,
  }));
  const monthly = recommendations.map((rec, index) => ({
    ...rec,
    quantity: quantityFor(rec.kind, index, "monthly"),
    estimatedMinutes: taskMinutes * 4,
  }));

  return {
    daily,
    weekly,
    monthly,
    estimatedDailyMinutes: daily.reduce((sum, task) => sum + task.estimatedMinutes, 0),
    focusCompetencies: daily.map((task) => task.competencyId),
    planRationale:
      input.weakAreas.length > 0
        ? "Built from profession, goals, available time, weak areas, confidence, and performance history."
        : "Built from profession, goals, available time, and competencies not yet started.",
  };
}

function quantityFor(kind: ProfessionRecommendationKind, index: number, range: "daily" | "weekly" | "monthly"): number {
  const multiplier = range === "monthly" ? 4 : range === "weekly" ? 2 : 1;
  const base: Record<ProfessionRecommendationKind, number> = {
    lesson: 1,
    flashcards: 10,
    questions: index === 0 ? 15 : 10,
    simulation: 1,
    "clinical-skills": 1,
    pharmacology: 1,
    ecg: 5,
  };
  return base[kind] * multiplier;
}

export function buildProfessionDashboardModel(input: ProfessionJourneyInput): ProfessionDashboardModel {
  const profession = optionById(PROFESSION_ONBOARDING_OPTIONS, input.professionId);
  const goals = input.goalIds.map((id) => optionById(PROFESSION_GOAL_OPTIONS, id));
  const experienceLevel = optionById(EXPERIENCE_LEVEL_OPTIONS, input.experienceLevel);
  const heatMap = buildCompetencyHeatMap(input);
  const readinessScores = buildProfessionReadinessScores(heatMap);
  const recommendations = buildJourneyRecommendations(input, heatMap);
  const studyPlan = buildAdaptiveStudyPlan(input);

  return {
    profession,
    goals,
    experienceLevel,
    heatMap,
    readinessScores,
    milestones: buildCareerMilestones(input.experienceLevel),
    studyPlan,
    recommendations,
    dashboardFocus: [
      readinessScores[0]?.label ?? "Profession Readiness",
      ...heatMap.filter((cell) => cell.status === "needs-improvement").slice(0, 3).map((cell) => cell.label),
    ],
  };
}

export function buildAdminProfessionJourneyInsights(models: ProfessionDashboardModel[]): AdminProfessionJourneyInsights {
  const goalCounts = new Map<ProfessionGoalId, number>();
  const weakCounts = new Map<string, { label: string; count: number }>();
  const gapCounts = new Map<string, { label: string; count: number }>();
  const professionCounts = new Map<ProfessionJourneyId, { label: string; scores: number[] }>();
  const contentDemand = new Map<ProfessionRecommendationKind, number>();
  const simulationDemand = new Map<string, { label: string; count: number }>();

  for (const model of models) {
    const professionId = model.profession.id;
    const current = professionCounts.get(professionId) ?? { label: model.profession.label, scores: [] };
    current.scores.push(model.readinessScores[0]?.score ?? 0);
    professionCounts.set(professionId, current);

    for (const goal of model.goals) goalCounts.set(goal.id, (goalCounts.get(goal.id) ?? 0) + 1);
    for (const cell of model.heatMap) {
      if (cell.status === "needs-improvement") incrementLabelMap(weakCounts, cell.id, cell.label);
      if (cell.status === "not-started" || cell.status === "needs-improvement") incrementLabelMap(gapCounts, cell.id, cell.label);
    }
    for (const recommendation of model.recommendations) {
      contentDemand.set(recommendation.kind, (contentDemand.get(recommendation.kind) ?? 0) + 1);
      if (recommendation.kind === "simulation") incrementLabelMap(simulationDemand, recommendation.competencyId, recommendation.title);
    }
  }

  const goalById = new Map(PROFESSION_GOAL_OPTIONS.map((goal) => [goal.id, goal]));
  return {
    totalLearners: models.length,
    mostCommonGoals: [...goalCounts.entries()]
      .map(([goalId, count]) => ({ goalId, label: goalById.get(goalId)?.label ?? goalId, count }))
      .sort((a, b) => b.count - a.count),
    mostCommonWeakAreas: sortedLabelCounts(weakCounts),
    mostCommonCompetencyGaps: sortedLabelCounts(gapCounts),
    professionTrends: [...professionCounts.entries()]
      .map(([professionId, data]) => ({
        professionId,
        label: data.label,
        learners: data.scores.length,
        averageReadiness: clampScore(data.scores.reduce((sum, score) => sum + score, 0) / (data.scores.length || 1)),
      }))
      .sort((a, b) => b.learners - a.learners),
    contentDemand: [...contentDemand.entries()]
      .map(([activity, learnerDemand]) => ({ activity, learnerDemand }))
      .sort((a, b) => b.learnerDemand - a.learnerDemand),
    simulationDemand: sortedLabelCounts(simulationDemand).map((row) => ({ competencyId: row.competencyId, label: row.label, count: row.count })),
  };
}

function incrementLabelMap(map: Map<string, { label: string; count: number }>, id: string, label: string): void {
  const current = map.get(id) ?? { label, count: 0 };
  current.count += 1;
  map.set(id, current);
}

function sortedLabelCounts(map: Map<string, { label: string; count: number }>): Array<{ competencyId: string; label: string; count: number }> {
  return [...map.entries()]
    .map(([competencyId, value]) => ({ competencyId, ...value }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
