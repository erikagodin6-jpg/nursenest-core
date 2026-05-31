import {
  GLOBAL_CLINICAL_CORE_REGISTRY,
  ROLE_SCOPE_PROTECTION_FINDINGS,
} from "@/lib/international-content/global-inheritance-reuse-enforcement-system";
import {
  RECOVERED_INTERNATIONAL_CONTENT_REGISTRY,
  toInternationalInheritanceLayer,
  type InternationalRecoveredAsset,
  type InternationalRecoveredContentType,
} from "@/lib/international-content/international-content-recovery-classification-engine";

export type GlobalContentMigrationV2Layer =
  | "Global Core"
  | "Role Supplement"
  | "Country Supplement"
  | "Exam Supplement"
  | "Language Supplement";

export type GlobalContentMigrationAssetKind = Extract<
  InternationalRecoveredContentType,
  "lesson" | "question" | "flashcard" | "simulation" | "clinical_case" | "blog"
>;

export type GlobalContentMigrationRole = "PN" | "RN" | "NP";

export type GlobalContentMigrationV2Request = {
  readonly contentId: string;
  readonly topic: string;
  readonly assetKind: GlobalContentMigrationAssetKind;
  readonly role: GlobalContentMigrationRole;
  readonly country: string | null;
  readonly exam: string | null;
  readonly language: string | null;
  readonly sharedContentPercent: number;
  readonly globalCoreExists: boolean;
  readonly roleSupplementExists: boolean;
  readonly countrySupplementExists: boolean;
  readonly examSupplementExists: boolean;
  readonly languageSupplementExists: boolean;
  readonly clinicalStandardsDiffer?: boolean;
  readonly regulatoryRequirementsDiffer?: boolean;
  readonly documentationRequirementsDiffer?: boolean;
  readonly examBlueprintRequirementsDiffer?: boolean;
  readonly scopeOfPracticeDiffers?: boolean;
  readonly terminologyDifferenceCreatesLearnerRisk?: boolean;
};

export type GlobalContentMigrationV2Decision =
  | {
      readonly status: "INHERITANCE_REQUIRED";
      readonly reason: "shared_content_exceeds_threshold";
      readonly requiredLayers: readonly GlobalContentMigrationV2Layer[];
      readonly duplicationAllowed: false;
    }
  | {
      readonly status: "MIGRATION_BLOCKED";
      readonly reason:
        | "global_core_missing"
        | "role_supplement_missing"
        | "country_supplement_missing"
        | "exam_supplement_missing"
        | "role_scope_violation";
      readonly requiredLayers: readonly GlobalContentMigrationV2Layer[];
      readonly duplicationAllowed: false;
    }
  | {
      readonly status: "SUPPLEMENT_ONLY_MIGRATION";
      readonly reason: "difference_solved_by_supplements";
      readonly requiredLayers: readonly GlobalContentMigrationV2Layer[];
      readonly duplicationAllowed: false;
    }
  | {
      readonly status: "SEPARATE_ASSET_REVIEW_REQUIRED";
      readonly reason: "shared_content_below_threshold_and_material_difference_exists";
      readonly requiredLayers: readonly GlobalContentMigrationV2Layer[];
      readonly duplicationAllowed: true;
    };

export type GlobalContentMigrationV2AuditRow = {
  readonly contentId: string;
  readonly topic: string;
  readonly assetKind: GlobalContentMigrationAssetKind;
  readonly inheritedFrom: "recovered_asset" | "manual_request";
  readonly targetRole: GlobalContentMigrationRole;
  readonly targetCountry: string | null;
  readonly targetExam: string | null;
  readonly targetLanguage: string | null;
  readonly sharedContentPercent: number;
  readonly decision: GlobalContentMigrationV2Decision;
};

export type GlobalContentMigrationV2Dashboard = {
  readonly generatedAt: string;
  readonly canonicalArchitecture: readonly GlobalContentMigrationV2Layer[];
  readonly duplicationThresholdPercent: 80;
  readonly totalAudited: number;
  readonly inheritanceRequired: number;
  readonly supplementOnlyMigrations: number;
  readonly blockedMigrations: number;
  readonly separateAssetReviewRequired: number;
  readonly globalCoreTopics: readonly string[];
  readonly auditRows: readonly GlobalContentMigrationV2AuditRow[];
  readonly governanceRule: "no_new_international_pathway_until_core_role_country_exam_migration_analysis_complete";
};

export const GLOBAL_CONTENT_MIGRATION_V2_SEQUENCE: readonly GlobalContentMigrationV2Layer[] = [
  "Global Core",
  "Role Supplement",
  "Country Supplement",
  "Exam Supplement",
  "Language Supplement",
] as const;

export const GLOBAL_CONTENT_MIGRATION_V2_DUPLICATION_THRESHOLD_PERCENT = 80 as const;

export const ROLE_SUPPLEMENT_SCOPE = {
  PN: {
    include: ["Recognition", "Monitoring", "Escalation", "Medication administration", "Safety"],
    exclude: ["Prescribing", "Differential diagnosis", "Advanced management"],
  },
  RN: {
    include: ["Clinical assessment", "Prioritization", "Care planning", "Interprofessional communication", "Deterioration recognition"],
    exclude: ["Independent prescribing", "Independent diagnosis"],
  },
  NP: {
    include: ["Diagnostics", "Differential diagnosis", "Guideline-directed therapy", "Prescribing", "Longitudinal management"],
    exclude: [],
  },
} as const;

export const ASSET_MIGRATION_RULES = {
  question: {
    inherits: ["Clinical Concept", "Role Supplement", "Country Supplement", "Exam Supplement", "Language Supplement"],
    mayVary: ["Stem", "Options", "Rationale", "Clinical depth"],
  },
  flashcard: {
    inherits: ["Global Concept", "Role Supplement", "Country Supplement"],
    scopeGuard: "Do not expose NP content to RN learners or RN content to PN learners when scope differs.",
  },
  simulation: {
    shared: ["Patient physiology", "Deterioration engine", "Assessment findings"],
    roleSpecific: ["Expected decisions", "Scope", "Escalation", "Interventions"],
    countrySpecific: ["Documentation", "Escalation language", "Professional standards"],
  },
} as const;

function requiredMissingLayers(request: GlobalContentMigrationV2Request): GlobalContentMigrationV2Layer[] {
  const missing: GlobalContentMigrationV2Layer[] = [];
  if (!request.globalCoreExists) missing.push("Global Core");
  if (!request.roleSupplementExists) missing.push("Role Supplement");
  if (!request.countrySupplementExists) missing.push("Country Supplement");
  if (!request.examSupplementExists) missing.push("Exam Supplement");
  if (!request.languageSupplementExists && request.language) missing.push("Language Supplement");
  return missing;
}

function hasMaterialDifference(request: GlobalContentMigrationV2Request): boolean {
  return Boolean(
    request.clinicalStandardsDiffer ||
      request.regulatoryRequirementsDiffer ||
      request.documentationRequirementsDiffer ||
      request.examBlueprintRequirementsDiffer ||
      request.scopeOfPracticeDiffers ||
      request.terminologyDifferenceCreatesLearnerRisk,
  );
}

function hasRoleScopeViolation(request: GlobalContentMigrationV2Request): boolean {
  const normalizedTopic = request.topic.toLowerCase();
  const protection = ROLE_SCOPE_PROTECTION_FINDINGS.find((finding) => finding.role === request.role);
  return Boolean(protection?.blockedConcepts.some((concept) => normalizedTopic.includes(concept.toLowerCase())));
}

export function evaluateGlobalContentMigrationV2Request(
  request: GlobalContentMigrationV2Request,
): GlobalContentMigrationV2Decision {
  const requiredLayers = requiredMissingLayers(request);

  if (hasRoleScopeViolation(request)) {
    return { status: "MIGRATION_BLOCKED", reason: "role_scope_violation", requiredLayers, duplicationAllowed: false };
  }

  if (!request.globalCoreExists) {
    return { status: "MIGRATION_BLOCKED", reason: "global_core_missing", requiredLayers, duplicationAllowed: false };
  }

  if (!request.roleSupplementExists) {
    return { status: "MIGRATION_BLOCKED", reason: "role_supplement_missing", requiredLayers, duplicationAllowed: false };
  }

  if (!request.countrySupplementExists && request.country) {
    return { status: "MIGRATION_BLOCKED", reason: "country_supplement_missing", requiredLayers, duplicationAllowed: false };
  }

  if (!request.examSupplementExists && request.exam) {
    return { status: "MIGRATION_BLOCKED", reason: "exam_supplement_missing", requiredLayers, duplicationAllowed: false };
  }

  if (request.sharedContentPercent > GLOBAL_CONTENT_MIGRATION_V2_DUPLICATION_THRESHOLD_PERCENT) {
    return { status: "INHERITANCE_REQUIRED", reason: "shared_content_exceeds_threshold", requiredLayers, duplicationAllowed: false };
  }

  if (hasMaterialDifference(request)) {
    return {
      status: "SEPARATE_ASSET_REVIEW_REQUIRED",
      reason: "shared_content_below_threshold_and_material_difference_exists",
      requiredLayers,
      duplicationAllowed: true,
    };
  }

  return { status: "SUPPLEMENT_ONLY_MIGRATION", reason: "difference_solved_by_supplements", requiredLayers, duplicationAllowed: false };
}

function roleFromAsset(asset: InternationalRecoveredAsset): GlobalContentMigrationRole {
  const role = String(asset.role ?? "").toUpperCase();
  if (role.includes("NP")) return "NP";
  if (role.includes("PN") || role.includes("RPN") || role.includes("LPN")) return "PN";
  return "RN";
}

function assetKindFrom(asset: InternationalRecoveredAsset): GlobalContentMigrationAssetKind {
  if (asset.contentType === "generated_batch" || asset.contentType === "draft_generation" || asset.contentType === "import_pipeline" || asset.contentType === "localization") {
    return "blog";
  }
  return asset.contentType;
}

function requestFromRecoveredAsset(asset: InternationalRecoveredAsset): GlobalContentMigrationV2Request {
  const layer = toInternationalInheritanceLayer(asset.classification);
  const topicIsGlobal = GLOBAL_CLINICAL_CORE_REGISTRY.some((topic) => topic.toLowerCase() === asset.topic.toLowerCase()) || layer === "GLOBAL_SHARED_CORE";
  return {
    contentId: asset.contentId,
    topic: asset.topic,
    assetKind: assetKindFrom(asset),
    role: roleFromAsset(asset),
    country: asset.country,
    exam: asset.exam,
    language: asset.language,
    sharedContentPercent: topicIsGlobal ? 92 : layer === "COUNTRY_OVERLAY" || layer === "EXAM_OVERLAY" ? 84 : 72,
    globalCoreExists: topicIsGlobal || Boolean(asset.inheritanceSource?.includes("GLOBAL_SHARED_CORE")),
    roleSupplementExists: Boolean(asset.role) || layer === "GLOBAL_SHARED_CORE",
    countrySupplementExists: !asset.country || layer === "COUNTRY_OVERLAY",
    examSupplementExists: !asset.exam || layer === "EXAM_OVERLAY" || layer === "COUNTRY_OVERLAY",
    languageSupplementExists: !asset.language || layer === "LANGUAGE_OVERLAY",
    regulatoryRequirementsDiffer: layer === "COUNTRY_OVERLAY",
    examBlueprintRequirementsDiffer: layer === "EXAM_OVERLAY",
    scopeOfPracticeDiffers: layer === "ROLE_OVERLAY",
    terminologyDifferenceCreatesLearnerRisk: layer === "LANGUAGE_OVERLAY",
  };
}

export function buildGlobalContentMigrationV2Dashboard(
  assets: readonly InternationalRecoveredAsset[] = RECOVERED_INTERNATIONAL_CONTENT_REGISTRY,
): GlobalContentMigrationV2Dashboard {
  const auditRows = assets.map((asset): GlobalContentMigrationV2AuditRow => {
    const request = requestFromRecoveredAsset(asset);
    return {
      contentId: asset.contentId,
      topic: asset.topic,
      assetKind: request.assetKind,
      inheritedFrom: "recovered_asset",
      targetRole: request.role,
      targetCountry: request.country,
      targetExam: request.exam,
      targetLanguage: request.language,
      sharedContentPercent: request.sharedContentPercent,
      decision: evaluateGlobalContentMigrationV2Request(request),
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    canonicalArchitecture: GLOBAL_CONTENT_MIGRATION_V2_SEQUENCE,
    duplicationThresholdPercent: GLOBAL_CONTENT_MIGRATION_V2_DUPLICATION_THRESHOLD_PERCENT,
    totalAudited: auditRows.length,
    inheritanceRequired: auditRows.filter((row) => row.decision.status === "INHERITANCE_REQUIRED").length,
    supplementOnlyMigrations: auditRows.filter((row) => row.decision.status === "SUPPLEMENT_ONLY_MIGRATION").length,
    blockedMigrations: auditRows.filter((row) => row.decision.status === "MIGRATION_BLOCKED").length,
    separateAssetReviewRequired: auditRows.filter((row) => row.decision.status === "SEPARATE_ASSET_REVIEW_REQUIRED").length,
    globalCoreTopics: GLOBAL_CLINICAL_CORE_REGISTRY,
    auditRows,
    governanceRule: "no_new_international_pathway_until_core_role_country_exam_migration_analysis_complete",
  };
}

export function validateGlobalContentMigrationV2Dashboard(dashboard: GlobalContentMigrationV2Dashboard): readonly string[] {
  const issues: string[] = [];
  if (dashboard.canonicalArchitecture.join(" > ") !== "Global Core > Role Supplement > Country Supplement > Exam Supplement > Language Supplement") {
    issues.push("Canonical migration architecture must remain Global Core -> Role Supplement -> Country Supplement -> Exam Supplement -> Language Supplement.");
  }
  if (dashboard.duplicationThresholdPercent !== 80) {
    issues.push("Duplication threshold must remain 80%.");
  }
  for (const row of dashboard.auditRows) {
    if (row.sharedContentPercent > 80 && row.decision.duplicationAllowed) {
      issues.push(`${row.contentId} shares more than 80% content and cannot allow duplication.`);
    }
  }
  return issues;
}
