export type StrategicRoadmapPhaseKey =
  | "adaptive_learning_command_center"
  | "exam_success_forecasting"
  | "ai_tutor_system"
  | "clinical_skills_ecosystem_expansion"
  | "pharmacology_learning_ecosystem"
  | "exam_blueprint_compliance_engine"
  | "question_quality_intelligence"
  | "ai_content_auditor"
  | "institutional_licensing_platform"
  | "new_grad_residency_platform"
  | "clinical_placement_companion"
  | "nursenest_academy"
  | "executive_business_command_center"
  | "reliability_first_architecture";

export type StrategicRoadmapStatus =
  | "implemented_foundation"
  | "partial_foundation"
  | "planned"
  | "requires_schema"
  | "requires_content_scale";

export type StrategicRoadmapTheme =
  | "theme_aware"
  | "mobile_first"
  | "accessible"
  | "premium"
  | "fully_integrated"
  | "adaptive"
  | "measurable";

export type StrategicRoadmapPhase = {
  key: StrategicRoadmapPhaseKey;
  phaseNumber: number;
  title: string;
  objective: string;
  status: StrategicRoadmapStatus;
  strategicThemes: readonly StrategicRoadmapTheme[];
  requiredCapabilities: readonly string[];
  sharedSurfaces: readonly string[];
  analyticsEvents: readonly string[];
  dataModels: readonly string[];
  validationGates: readonly string[];
  evidenceRequired: readonly string[];
  mustRemainUnified: boolean;
};

export const UNIVERSAL_STRATEGIC_THEMES: readonly StrategicRoadmapTheme[] = [
  "theme_aware",
  "mobile_first",
  "accessible",
  "premium",
  "fully_integrated",
  "adaptive",
  "measurable",
] as const;

export const STRATEGIC_ROADMAP_PHASES: readonly StrategicRoadmapPhase[] = [
  {
    key: "adaptive_learning_command_center",
    phaseNumber: 1,
    title: "Adaptive Learning Command Center",
    objective: "Make the logged-in learner dashboard a decision-free study plan with readiness, goals, weak areas, strong areas, and one-click session launch.",
    status: "partial_foundation",
    strategicThemes: UNIVERSAL_STRATEGIC_THEMES,
    requiredCapabilities: [
      "today's study plan",
      "current readiness",
      "exam goal",
      "study streak",
      "estimated study time",
      "predicted pass probability display",
      "weak area summary",
      "strong area summary",
      "recommended activities",
      "Start My Session orchestration",
    ],
    sharedSurfaces: ["/app/dashboard", "/app/study-coach", "/app/account/readiness"],
    analyticsEvents: ["command_center_viewed", "recommended_session_started", "study_plan_generated"],
    dataModels: ["learner_readiness_snapshot", "learner_study_plan", "learner_topic_mastery"],
    validationGates: ["desktop and mobile learner screenshots", "keyboard accessible Start My Session", "recommendation links resolve", "no duplicated profession dashboards"],
    evidenceRequired: ["Figma frames", "Playwright learner journey", "analytics event persistence", "readiness calculation report"],
    mustRemainUnified: true,
  },
  {
    key: "exam_success_forecasting",
    phaseNumber: 2,
    title: "Exam Success Forecasting",
    objective: "Convert activity history into educational forecasting: pass probability, projected readiness date, study hours remaining, trend, and confidence interval.",
    status: "requires_schema",
    strategicThemes: UNIVERSAL_STRATEGIC_THEMES,
    requiredCapabilities: [
      "CAT performance inputs",
      "question performance inputs",
      "flashcard performance inputs",
      "lesson completion inputs",
      "clinical skills inputs",
      "pharmacology inputs",
      "ECG inputs",
      "confidence interval output",
      "recommended next actions",
    ],
    sharedSurfaces: ["/app/account/readiness", "/app/dashboard", "/app/study-coach"],
    analyticsEvents: ["forecast_generated", "forecast_viewed", "forecast_recommendation_clicked"],
    dataModels: ["exam_forecast_snapshot", "forecast_input_rollup", "forecast_confidence_band"],
    validationGates: ["no guaranteed exam outcome copy", "forecast explains inputs", "trend math contract tests", "mobile readiness card visual regression"],
    evidenceRequired: ["model documentation", "calibration report", "learner screenshots", "Playwright readiness journey"],
    mustRemainUnified: true,
  },
  {
    key: "ai_tutor_system",
    phaseNumber: 3,
    title: "AI Tutor System",
    objective: "Attach question-specific tutoring to learning moments without creating a generic chat product.",
    status: "requires_schema",
    strategicThemes: UNIVERSAL_STRATEGIC_THEMES,
    requiredCapabilities: [
      "why correct",
      "distractor reasoning",
      "clinical significance",
      "exam trap",
      "memory aid",
      "related lesson links",
      "related flashcard links",
      "related clinical skill links",
      "related pharmacology links",
      "related ECG concept links",
    ],
    sharedSurfaces: ["/app/flashcards", "/app/practice-tests", "/app/cases/cnple", "/app/clinical-scenarios"],
    analyticsEvents: ["tutor_opened", "tutor_feedback_used", "remediation_link_clicked"],
    dataModels: ["tutor_interaction", "content_remediation_link", "question_teaching_profile"],
    validationGates: ["question-specific content checks", "scope alignment checks", "no generic chat entry point", "all links resolve"],
    evidenceRequired: ["content QA report", "Playwright rationale journey", "analytics report", "SME review queue sample"],
    mustRemainUnified: true,
  },
  {
    key: "clinical_skills_ecosystem_expansion",
    phaseNumber: 4,
    title: "Clinical Skills Ecosystem Expansion",
    objective: "Expand clinical skills into pathway-specific competency ecosystems connected to lessons, simulations, questions, flashcards, documentation, and readiness tracking.",
    status: "requires_content_scale",
    strategicThemes: UNIVERSAL_STRATEGIC_THEMES,
    requiredCapabilities: [
      "100+ skills per learner pathway",
      "lesson linkage",
      "simulation linkage",
      "question linkage",
      "flashcard linkage",
      "documentation practice",
      "delegation scenarios",
      "prioritization scenarios",
      "safety scenarios",
      "competency tracking",
    ],
    sharedSurfaces: ["/app/clinical-skills", "/app/lessons", "/app/flashcards", "/app/practice-tests"],
    analyticsEvents: ["clinical_skill_started", "clinical_skill_completed", "clinical_skill_remediation_started"],
    dataModels: ["clinical_skill_competency_map", "skill_activity_link", "skill_readiness_snapshot"],
    validationGates: ["minimum inventory audit", "profession scope audit", "mobile skill page screenshots", "remediation links resolve"],
    evidenceRequired: ["content inventory report", "skill competency map", "Playwright skill journey", "accessibility screenshots"],
    mustRemainUnified: true,
  },
  {
    key: "pharmacology_learning_ecosystem",
    phaseNumber: 5,
    title: "Pharmacology Learning Ecosystem",
    objective: "Turn medication content into a full safety, monitoring, teaching, case, question, flashcard, simulation, and readiness platform.",
    status: "requires_content_scale",
    strategicThemes: UNIVERSAL_STRATEGIC_THEMES,
    requiredCapabilities: [
      "mechanism",
      "indications",
      "contraindications",
      "side effects",
      "monitoring",
      "labs",
      "patient teaching",
      "exam relevance",
      "drug interactions",
      "natural supplements",
      "safety alerts",
      "pharmacology readiness score",
    ],
    sharedSurfaces: ["/app/pharmacology", "/app/lessons", "/app/flashcards", "/app/practice-tests"],
    analyticsEvents: ["pharmacology_topic_started", "medication_safety_item_completed", "pharmacology_readiness_updated"],
    dataModels: ["drug_class_profile", "medication_safety_map", "pharmacology_readiness_snapshot"],
    validationGates: ["high-risk medication currency review", "profession scope checks", "reference validation", "mobile pharmacology journey"],
    evidenceRequired: ["pharmacology inventory report", "reference quality report", "Playwright pharmacology journey", "readiness scoring tests"],
    mustRemainUnified: true,
  },
  {
    key: "exam_blueprint_compliance_engine",
    phaseNumber: 6,
    title: "Exam Blueprint Compliance Engine",
    objective: "Measure blueprint coverage, objective coverage, and modality distribution across questions, flashcards, lessons, and simulations.",
    status: "partial_foundation",
    strategicThemes: UNIVERSAL_STRATEGIC_THEMES,
    requiredCapabilities: [
      "NCLEX-RN coverage",
      "NCLEX-PN coverage",
      "REx-PN coverage",
      "CNPLE coverage",
      "RT coverage",
      "Allied coverage",
      "target versus actual variance",
      "gap detection",
      "overrepresentation detection",
    ],
    sharedSurfaces: ["/admin/content-audit", "/admin/content-blueprints", "/app/account/readiness"],
    analyticsEvents: ["blueprint_audit_generated", "blueprint_gap_reviewed", "blueprint_content_priority_created"],
    dataModels: ["blueprint_domain", "content_blueprint_mapping", "blueprint_variance_snapshot"],
    validationGates: ["blueprint mappings exist", "variance math tests", "admin dashboard filters", "content creation priorities generated"],
    evidenceRequired: ["coverage heatmap", "admin screenshots", "contract tests", "priority report"],
    mustRemainUnified: true,
  },
  {
    key: "question_quality_intelligence",
    phaseNumber: 7,
    title: "Question Quality Intelligence",
    objective: "Continuously flag ambiguous, stale, too easy, too hard, poorly discriminating, or reported questions.",
    status: "partial_foundation",
    strategicThemes: UNIVERSAL_STRATEGIC_THEMES,
    requiredCapabilities: [
      "difficulty index",
      "discrimination index",
      "response time",
      "most selected distractor",
      "report frequency",
      "success rate",
      "review queue",
      "quality dashboard",
    ],
    sharedSurfaces: ["/admin/content-audit", "/admin/question-quality", "/app/practice-tests", "/app/flashcards"],
    analyticsEvents: ["question_quality_score_generated", "question_flag_created", "question_review_completed"],
    dataModels: ["question_quality_snapshot", "distractor_performance_rollup", "content_review_queue_item"],
    validationGates: ["quality score tests", "review queue admin access", "flag severity rules", "no learner route blocking"],
    evidenceRequired: ["flagged question report", "admin screenshots", "analytics persistence test", "review workflow sample"],
    mustRemainUnified: true,
  },
  {
    key: "ai_content_auditor",
    phaseNumber: 8,
    title: "AI Content Auditor",
    objective: "Audit content for scope leakage, country mismatches, exam mismatches, stale guidance, and missing references.",
    status: "partial_foundation",
    strategicThemes: UNIVERSAL_STRATEGIC_THEMES,
    requiredCapabilities: [
      "RN scope leakage detection",
      "RT leakage detection",
      "NP in RPN mismatch detection",
      "country mismatch detection",
      "exam mismatch detection",
      "outdated guideline detection",
      "missing reference detection",
      "remediation task generation",
    ],
    sharedSurfaces: ["/admin/content-audit", "/admin/content-scope", "/admin/references"],
    analyticsEvents: ["content_scope_audit_generated", "content_currency_flag_created", "content_remediation_task_created"],
    dataModels: ["content_scope_classification", "reference_quality_snapshot", "content_remediation_task"],
    validationGates: ["scope classifier tests", "reference queue tests", "admin-only access", "no automatic learner content mutation without review"],
    evidenceRequired: ["scope alignment report", "reference validation report", "admin screenshots", "review queue export"],
    mustRemainUnified: true,
  },
  {
    key: "institutional_licensing_platform",
    phaseNumber: 9,
    title: "Institutional Licensing Platform",
    objective: "Support schools, hospitals, residency programs, and healthcare organizations with seats, cohorts, faculty dashboards, readiness, completion, and reporting.",
    status: "partial_foundation",
    strategicThemes: UNIVERSAL_STRATEGIC_THEMES,
    requiredCapabilities: [
      "seat management",
      "faculty dashboard",
      "readiness tracking",
      "completion tracking",
      "competency tracking",
      "class analytics",
      "cohort analytics",
      "student success tracking",
      "institution reporting",
    ],
    sharedSurfaces: ["/admin/institutions", "/app/dashboard", "/app/account/readiness"],
    analyticsEvents: ["institution_seat_assigned", "cohort_report_generated", "faculty_readiness_viewed"],
    dataModels: ["institution", "institution_seat", "institution_cohort", "faculty_dashboard_snapshot"],
    validationGates: ["server-side role enforcement", "cohort privacy checks", "mobile faculty dashboard", "seat entitlement tests"],
    evidenceRequired: ["institution workflow screenshots", "Playwright seat assignment", "privacy review", "billing integration report"],
    mustRemainUnified: true,
  },
  {
    key: "new_grad_residency_platform",
    phaseNumber: 10,
    title: "New Grad Residency Platform",
    objective: "Make New Grad a transition-to-practice product with orientation, competencies, specialty readiness, documentation, and clinical judgment reports.",
    status: "requires_content_scale",
    strategicThemes: UNIVERSAL_STRATEGIC_THEMES,
    requiredCapabilities: [
      "orientation readiness",
      "competency tracking",
      "telemetry readiness",
      "ICU readiness",
      "ER readiness",
      "med-surg readiness",
      "specialty readiness",
      "documentation skills",
      "clinical judgment tracking",
      "prioritization reports",
    ],
    sharedSurfaces: ["/app/new-grad", "/app/clinical-skills", "/app/clinical-scenarios", "/app/account/readiness"],
    analyticsEvents: ["new_grad_competency_started", "new_grad_simulation_completed", "new_grad_readiness_report_viewed"],
    dataModels: ["new_grad_competency_map", "residency_roadmap", "specialty_readiness_snapshot"],
    validationGates: ["no duplicated RN entry-to-practice content", "specialty scope audit", "mobile roadmap screenshots", "simulation links resolve"],
    evidenceRequired: ["residency inventory report", "competency heatmap screenshots", "simulation journey", "content scope report"],
    mustRemainUnified: true,
  },
  {
    key: "clinical_placement_companion",
    phaseNumber: 11,
    title: "Clinical Placement Companion",
    objective: "Generate placement-specific preparation plans based on unit, week, shift type, medications, skills, simulations, and daily goals.",
    status: "planned",
    strategicThemes: UNIVERSAL_STRATEGIC_THEMES,
    requiredCapabilities: [
      "placement profile",
      "unit-specific preparation plan",
      "week-specific goals",
      "shift-type preparation",
      "medication review",
      "skill review",
      "question recommendations",
      "flashcard recommendations",
      "simulation activities",
      "documentation activities",
    ],
    sharedSurfaces: ["/app/study-coach", "/app/clinical-skills", "/app/pharmacology", "/app/clinical-scenarios"],
    analyticsEvents: ["placement_plan_created", "placement_goal_completed", "placement_recommendation_started"],
    dataModels: ["placement_profile", "placement_study_plan", "placement_goal_completion"],
    validationGates: ["student privacy review", "recommendations use existing canonical content", "mobile plan screenshots", "no disconnected placement app"],
    evidenceRequired: ["workflow Figma", "Playwright placement plan", "recommendation link report", "analytics report"],
    mustRemainUnified: true,
  },
  {
    key: "nursenest_academy",
    phaseNumber: 12,
    title: "NurseNest Academy",
    objective: "Create professional learning tracks with certificates, transcripts, and completion records using existing content engines.",
    status: "planned",
    strategicThemes: UNIVERSAL_STRATEGIC_THEMES,
    requiredCapabilities: [
      "ECG Mastery track",
      "Advanced ECG track",
      "Clinical Skills Mastery track",
      "Pharmacology Mastery track",
      "Telemetry Readiness track",
      "New Grad Readiness track",
      "specialty nursing tracks",
      "certificates",
      "transcripts",
      "completion records",
    ],
    sharedSurfaces: ["/app/academy", "/app/lessons", "/app/clinical-skills", "/app/account/progress"],
    analyticsEvents: ["academy_track_started", "academy_track_completed", "certificate_generated"],
    dataModels: ["academy_track", "academy_completion_record", "learner_transcript"],
    validationGates: ["completion criteria tests", "certificate accessibility", "transcript export", "entitlement rules"],
    evidenceRequired: ["academy screenshots", "certificate sample", "Playwright completion journey", "admin track report"],
    mustRemainUnified: true,
  },
  {
    key: "executive_business_command_center",
    phaseNumber: 13,
    title: "Executive Business Command Center",
    objective: "Give the owner a daily view of revenue, subscriptions, institutions, chargebacks, refunds, usage, conversion, referral revenue, and system health.",
    status: "implemented_foundation",
    strategicThemes: UNIVERSAL_STRATEGIC_THEMES,
    requiredCapabilities: [
      "MRR",
      "ARR",
      "revenue",
      "subscribers",
      "institutions",
      "chargebacks",
      "refunds",
      "uptime",
      "CAT usage",
      "question usage",
      "flashcard usage",
      "conversion rates",
      "referral revenue",
      "institution revenue",
      "system health",
    ],
    sharedSurfaces: ["/admin/business-command-center", "/admin/operations-center", "/admin/business-protection"],
    analyticsEvents: ["executive_command_center_viewed", "business_metric_loaded", "business_health_status_changed"],
    dataModels: ["business_command_snapshot", "subscription_revenue_rollup", "activity_usage_rollup"],
    validationGates: ["admin-only server authorization", "mobile admin screenshots", "Stripe source-of-truth notes", "operational metric fallbacks"],
    evidenceRequired: ["admin screenshots", "loader tests", "TypeScript verification", "metric source documentation"],
    mustRemainUnified: true,
  },
  {
    key: "reliability_first_architecture",
    phaseNumber: 14,
    title: "Reliability First Architecture",
    objective: "Guarantee learners can study by protecting flashcards, CAT, practice, and lessons with deployment gates, rollback, emergency mode, backup environment, replicas, and synthetic monitoring.",
    status: "partial_foundation",
    strategicThemes: UNIVERSAL_STRATEGIC_THEMES,
    requiredCapabilities: [
      "deployment blocking tests",
      "automatic rollbacks",
      "Emergency Study Mode",
      "backup environment",
      "read replicas",
      "synthetic monitoring",
      "continuous activity verification",
      "flashcard launch gate",
      "CAT launch gate",
      "practice launch gate",
      "lesson launch gate",
    ],
    sharedSurfaces: ["/healthz", "/readyz", "/admin/operations-center", "/app/flashcards", "/app/practice-tests", "/app/lessons"],
    analyticsEvents: ["synthetic_monitor_run", "activity_startup_failed", "emergency_study_mode_enabled"],
    dataModels: ["synthetic_monitor_result", "activity_startup_health", "deployment_health_gate"],
    validationGates: ["pre-deploy learner suite", "activity screenshot guards", "rollback runbook", "non-essential dependency failure tests"],
    evidenceRequired: ["synthetic monitor report", "deployment gate logs", "runbook", "Playwright learner launch evidence"],
    mustRemainUnified: true,
  },
] as const;

export function phaseForStrategicRoadmapKey(key: StrategicRoadmapPhaseKey): StrategicRoadmapPhase {
  const phase = STRATEGIC_ROADMAP_PHASES.find((item) => item.key === key);
  if (!phase) throw new Error(`Missing strategic differentiation roadmap phase: ${key}`);
  return phase;
}

export function summarizeStrategicRoadmapStatus(): Record<StrategicRoadmapStatus, number> {
  const summary: Record<StrategicRoadmapStatus, number> = {
    implemented_foundation: 0,
    partial_foundation: 0,
    planned: 0,
    requires_schema: 0,
    requires_content_scale: 0,
  };

  for (const phase of STRATEGIC_ROADMAP_PHASES) {
    summary[phase.status] += 1;
  }

  return summary;
}

export function auditStrategicDifferentiationRoadmap(): string[] {
  const issues: string[] = [];
  const keys = new Set<StrategicRoadmapPhaseKey>();
  const phaseNumbers = new Set<number>();

  for (const phase of STRATEGIC_ROADMAP_PHASES) {
    if (keys.has(phase.key)) issues.push(`duplicate roadmap phase key: ${phase.key}`);
    keys.add(phase.key);

    if (phaseNumbers.has(phase.phaseNumber)) issues.push(`duplicate roadmap phase number: ${phase.phaseNumber}`);
    phaseNumbers.add(phase.phaseNumber);

    if (!phase.mustRemainUnified) issues.push(`${phase.key} must remain part of the unified NurseNest ecosystem`);
    for (const theme of UNIVERSAL_STRATEGIC_THEMES) {
      if (!phase.strategicThemes.includes(theme)) issues.push(`${phase.key} is missing strategic theme: ${theme}`);
    }
    if (phase.requiredCapabilities.length < 5) issues.push(`${phase.key} needs at least five implementation capabilities`);
    if (phase.sharedSurfaces.length < 2) issues.push(`${phase.key} needs at least two shared platform surfaces`);
    if (phase.analyticsEvents.length < 2) issues.push(`${phase.key} needs measurable analytics events`);
    if (phase.dataModels.length < 2) issues.push(`${phase.key} needs explicit data model planning`);
    if (phase.validationGates.length < 3) issues.push(`${phase.key} needs concrete validation gates`);
    if (phase.evidenceRequired.length < 3) issues.push(`${phase.key} needs completion evidence requirements`);
  }

  for (let phaseNumber = 1; phaseNumber <= 14; phaseNumber += 1) {
    if (!phaseNumbers.has(phaseNumber)) issues.push(`missing roadmap phase number: ${phaseNumber}`);
  }

  return issues;
}
