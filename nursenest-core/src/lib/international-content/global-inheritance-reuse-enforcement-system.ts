import type {
  GlobalKnowledgeAssetKind,
  GlobalKnowledgeCountry,
  GlobalKnowledgeExam,
  GlobalKnowledgeLanguage,
  GlobalKnowledgeRole,
} from "./global-knowledge-graph-content-inheritance-engine";

export type ReuseEnforcedAssetCategory =
  | "Lessons"
  | "Flashcards"
  | "Simulations"
  | "Clinical Cases"
  | "Labs"
  | "ECG"
  | "Pharmacology";

export type NewContentApprovalReason =
  | "clinical_standards_differ"
  | "regulatory_requirements_differ"
  | "documentation_requirements_differ"
  | "exam_blueprint_requirements_differ"
  | "scope_of_practice_differs"
  | "terminology_difference_creates_learner_risk";

export type InheritanceLayer =
  | "Global Core"
  | "Role Overlay"
  | "Country Overlay"
  | "Exam Overlay"
  | "Language Overlay"
  | "Educational Asset";

export type GenerationRequest = {
  readonly topic: string;
  readonly assetKind: Extract<GlobalKnowledgeAssetKind, "Lesson" | "Question" | "Flashcard" | "Simulation" | "Case Study" | "Blog Content">;
  readonly role: GlobalKnowledgeRole;
  readonly country: GlobalKnowledgeCountry;
  readonly exam: GlobalKnowledgeExam;
  readonly language: GlobalKnowledgeLanguage;
  readonly similarityPercent: number;
  readonly existingGlobalCore: boolean;
  readonly existingRoleOverlay: boolean;
  readonly existingCountryOverlay: boolean;
  readonly existingExamOverlay: boolean;
  readonly existingLanguageOverlay: boolean;
  readonly equivalentClinicalObjectiveExists: boolean;
  readonly equivalentLearningObjectiveExists: boolean;
  readonly requestedNewContentReason?: NewContentApprovalReason;
};

export type GenerationDecision =
  | {
      readonly status: "GENERATION_BLOCKED";
      readonly reason:
        | "similarity_exceeds_threshold"
        | "existing_inherited_content_satisfies_requirements"
        | "equivalent_clinical_objective_exists"
        | "equivalent_learning_objective_exists"
        | "role_scope_violation"
        | "new_content_reason_required";
      readonly missingLayers: readonly InheritanceLayer[];
    }
  | {
      readonly status: "GENERATE_MISSING_LAYERS_ONLY";
      readonly approvedReason: NewContentApprovalReason;
      readonly missingLayers: readonly InheritanceLayer[];
    };

export type ScopeProtectionFinding = {
  readonly role: GlobalKnowledgeRole;
  readonly blockedConcepts: readonly string[];
};

export type MaintenanceSavingsMetric = {
  readonly build: string;
  readonly reusePercent: number;
  readonly duplicatePreventionPercent: number;
  readonly translationSavingsPercent: number;
  readonly maintenanceReductionPercent: number;
  readonly estimatedHoursSaved: number;
  readonly estimatedContentAvoided: number;
};

export const GLOBAL_REUSE_TARGETS: Record<ReuseEnforcedAssetCategory, number> = {
  Lessons: 85,
  Flashcards: 90,
  Simulations: 95,
  "Clinical Cases": 90,
  Labs: 95,
  ECG: 95,
  Pharmacology: 90,
} as const;

export const APPROVED_NEW_CONTENT_REASONS: readonly NewContentApprovalReason[] = [
  "clinical_standards_differ",
  "regulatory_requirements_differ",
  "documentation_requirements_differ",
  "exam_blueprint_requirements_differ",
  "scope_of_practice_differs",
  "terminology_difference_creates_learner_risk",
] as const;

export const GLOBAL_CLINICAL_CORE_REGISTRY = [
  "Heart Failure",
  "COPD",
  "Sepsis",
  "Shock",
  "ECG",
  "ABGs",
  "Labs",
  "Pharmacology",
  "Clinical Assessment",
] as const;

export const GLOBAL_INHERITANCE_REQUIRED_SEQUENCE: readonly InheritanceLayer[] = [
  "Global Core",
  "Role Overlay",
  "Country Overlay",
  "Exam Overlay",
  "Language Overlay",
  "Educational Asset",
] as const;

export const INTERNATIONAL_EXPANSION_OVERLAY_PRIORITY = [
  "Ireland",
  "UAE",
  "Saudi Arabia",
  "Singapore",
  "India",
  "Philippines",
] as const;

export const INTERNATIONAL_EXPANSION_REQUIRED_STEPS = [
  "Recovery",
  "Classification",
  "Inheritance",
  "Localization",
  "New content generation only for missing layers",
] as const;

export const ROLE_SCOPE_PROTECTION_FINDINGS: readonly ScopeProtectionFinding[] = [
  {
    role: "PN",
    blockedConcepts: ["NP prescribing", "advanced diagnostics", "independent differential diagnosis", "longitudinal management"],
  },
  {
    role: "RN",
    blockedConcepts: ["NP prescribing", "independent diagnosis", "advanced independent management"],
  },
  {
    role: "NP",
    blockedConcepts: [],
  },
] as const;

export const MAINTENANCE_SAVINGS_SEED_METRICS: readonly MaintenanceSavingsMetric[] = [
  {
    build: "Ireland RN overlay",
    reusePercent: 88,
    duplicatePreventionPercent: 91,
    translationSavingsPercent: 84,
    maintenanceReductionPercent: 79,
    estimatedHoursSaved: 420,
    estimatedContentAvoided: 620,
  },
  {
    build: "UAE RN overlays",
    reusePercent: 86,
    duplicatePreventionPercent: 89,
    translationSavingsPercent: 82,
    maintenanceReductionPercent: 76,
    estimatedHoursSaved: 690,
    estimatedContentAvoided: 980,
  },
] as const;

export function getMissingInheritanceLayers(request: GenerationRequest): readonly InheritanceLayer[] {
  const missing: InheritanceLayer[] = [];
  if (!request.existingGlobalCore) missing.push("Global Core");
  if (!request.existingRoleOverlay) missing.push("Role Overlay");
  if (!request.existingCountryOverlay) missing.push("Country Overlay");
  if (!request.existingExamOverlay) missing.push("Exam Overlay");
  if (!request.existingLanguageOverlay) missing.push("Language Overlay");
  return missing;
}

export function hasRoleScopeViolation(request: Pick<GenerationRequest, "role" | "topic">): boolean {
  const normalizedTopic = request.topic.toLowerCase();
  const protection = ROLE_SCOPE_PROTECTION_FINDINGS.find((finding) => finding.role === request.role);
  return Boolean(protection?.blockedConcepts.some((concept) => normalizedTopic.includes(concept.toLowerCase())));
}

export function evaluateGenerationRequest(request: GenerationRequest): GenerationDecision {
  const missingLayers = getMissingInheritanceLayers(request);

  if (request.similarityPercent > 85) {
    return { status: "GENERATION_BLOCKED", reason: "similarity_exceeds_threshold", missingLayers };
  }

  if (request.equivalentClinicalObjectiveExists) {
    return { status: "GENERATION_BLOCKED", reason: "equivalent_clinical_objective_exists", missingLayers };
  }

  if (request.equivalentLearningObjectiveExists) {
    return { status: "GENERATION_BLOCKED", reason: "equivalent_learning_objective_exists", missingLayers };
  }

  if (hasRoleScopeViolation(request)) {
    return { status: "GENERATION_BLOCKED", reason: "role_scope_violation", missingLayers };
  }

  if (missingLayers.length === 0) {
    return { status: "GENERATION_BLOCKED", reason: "existing_inherited_content_satisfies_requirements", missingLayers };
  }

  if (!request.requestedNewContentReason) {
    return { status: "GENERATION_BLOCKED", reason: "new_content_reason_required", missingLayers };
  }

  return {
    status: "GENERATE_MISSING_LAYERS_ONLY",
    approvedReason: request.requestedNewContentReason,
    missingLayers,
  };
}

export function buildGlobalInheritanceReuseDashboard() {
  const averageReuseRate = Math.round(
    Object.values(GLOBAL_REUSE_TARGETS).reduce((total, value) => total + value, 0) / Object.values(GLOBAL_REUSE_TARGETS).length,
  );

  const averageDuplicatePrevention = Math.round(
    MAINTENANCE_SAVINGS_SEED_METRICS.reduce((total, metric) => total + metric.duplicatePreventionPercent, 0) / MAINTENANCE_SAVINGS_SEED_METRICS.length,
  );

  return {
    globalCoreInventory: GLOBAL_CLINICAL_CORE_REGISTRY.length,
    roleOverlayInventory: ROLE_SCOPE_PROTECTION_FINDINGS.length,
    countryOverlayInventory: INTERNATIONAL_EXPANSION_OVERLAY_PRIORITY.length,
    examOverlayInventory: 12,
    languageOverlayInventory: 3,
    requiredReuseTargetAverage: averageReuseRate,
    duplicatePreventionPercent: averageDuplicatePrevention,
    localizationProgress: "overlay-first",
    internationalReadiness: "recovery-classification-inheritance-required-before-generation",
    estimatedHoursSaved: MAINTENANCE_SAVINGS_SEED_METRICS.reduce((total, metric) => total + metric.estimatedHoursSaved, 0),
    estimatedContentAvoided: MAINTENANCE_SAVINGS_SEED_METRICS.reduce((total, metric) => total + metric.estimatedContentAvoided, 0),
  } as const;
}

export function validateGlobalInheritanceReuseEnforcementSystem(): readonly string[] {
  const issues: string[] = [];

  for (const [category, target] of Object.entries(GLOBAL_REUSE_TARGETS)) {
    if (target < 85) issues.push(`${category} reuse target must be at least 85%`);
  }

  for (const category of ["Labs", "ECG", "Simulations"] as const) {
    if (GLOBAL_REUSE_TARGETS[category] < 95) issues.push(`${category} reuse target must be at least 95%`);
  }

  for (const requiredTopic of ["Heart Failure", "COPD", "Sepsis", "Shock", "ECG", "ABGs", "Labs", "Pharmacology", "Clinical Assessment"] as const) {
    if (!GLOBAL_CLINICAL_CORE_REGISTRY.includes(requiredTopic)) {
      issues.push(`${requiredTopic} must be assigned to GLOBAL_SHARED_CORE`);
    }
  }

  if (GLOBAL_INHERITANCE_REQUIRED_SEQUENCE.join(" > ") !== "Global Core > Role Overlay > Country Overlay > Exam Overlay > Language Overlay > Educational Asset") {
    issues.push("Inheritance sequence must remain Global Core -> Role -> Country -> Exam -> Language -> Asset");
  }

  for (const step of ["Recovery", "Classification", "Inheritance", "Localization"] as const) {
    if (!INTERNATIONAL_EXPANSION_REQUIRED_STEPS.includes(step)) {
      issues.push(`International expansion must include ${step} before generation`);
    }
  }

  return issues;
}
