export type InternationalRecoveryClassification =
  | "GLOBAL_SHARED_CORE"
  | "COUNTRY_SPECIFIC"
  | "EXAM_SPECIFIC"
  | "ROLE_SPECIFIC"
  | "LANGUAGE_SPECIFIC"
  | "FUTURE_EXPANSION"
  | "ARCHIVE"
  | "REQUIRES_REVIEW";

export type InternationalInheritanceLayer =
  | "GLOBAL_SHARED_CORE"
  | "COUNTRY_OVERLAY"
  | "ROLE_OVERLAY"
  | "EXAM_OVERLAY"
  | "LANGUAGE_OVERLAY"
  | "ARCHIVE"
  | "REQUIRES_REVIEW";

export type InternationalRecoveredContentType =
  | "blog"
  | "lesson"
  | "question"
  | "flashcard"
  | "simulation"
  | "clinical_case"
  | "import_pipeline"
  | "draft_generation"
  | "localization"
  | "generated_batch";

export type InternationalRecoveredAsset = {
  readonly contentId: string;
  readonly sourceFile: string;
  readonly contentType: InternationalRecoveredContentType;
  readonly topic: string;
  readonly system: string;
  readonly role: string | null;
  readonly country: string | null;
  readonly exam: string | null;
  readonly language: string | null;
  readonly classification: InternationalRecoveryClassification;
  readonly inheritanceSource: string | null;
  readonly reviewStatus: "requires_review";
  readonly publicationStatus: "draft";
  readonly version: 1;
  readonly lastReviewed: null;
  readonly status: "draft";
  readonly published: false;
  readonly adminOnly: true;
  readonly visibleInNavigation: false;
  readonly learnerAccessible: false;
  readonly launchReady: false;
  readonly noindex: true;
};

export type DuplicateContentFinding = {
  readonly groupId: string;
  readonly duplicateType: "near_duplicate" | "partial_duplicate" | "localized_duplicate" | "translation_duplicate" | "inherited_duplicate";
  readonly contentTypes: readonly InternationalRecoveredContentType[];
  readonly representativeTopic: string;
  readonly evidence: readonly string[];
  readonly recommendedAction: "map_to_global_core" | "convert_to_overlay" | "merge_or_archive" | "manual_review";
};

export type InternationalInheritanceMapEntry = {
  readonly topic: string;
  readonly globalCoreAssets: readonly string[];
  readonly roleOverlayAssets: readonly string[];
  readonly countryOverlayAssets: readonly string[];
  readonly examOverlayAssets: readonly string[];
  readonly languageOverlayAssets: readonly string[];
  readonly requiresReviewAssets: readonly string[];
  readonly inheritancePath: "Global Core -> Role Overlay -> Country Overlay -> Exam Overlay -> Language Overlay";
};

export type InternationalReuseOpportunity = {
  readonly topic: string;
  readonly reusableAssetCount: number;
  readonly overlayAssetCount: number;
  readonly recommendedAction: "promote_to_global_core" | "attach_overlays" | "deduplicate_before_translation" | "manual_review";
  readonly rationale: string;
};

export const INTERNATIONAL_RECOVERY_PROTECTION = {
  status: "draft",
  published: false,
  adminOnly: true,
  visibleInNavigation: false,
  learnerAccessible: false,
  launchReady: false,
  noindex: true,
} as const;

export const INTERNATIONAL_RECOVERY_SOURCE_ROOTS = [
  "src/content/blog-static-longtail/",
  "src/content/pathway-lessons/",
  "src/content/questions/",
  "src/content/clinical-case-studies.json",
  "output/*",
  "data/blog-content/",
  "data/blog-manifest/",
  "tools/i18n/",
  "scripts/i18n/",
  "generated content batches",
  "draft import queues",
  "automation pipelines",
] as const;

export const GLOBAL_SHARED_CORE_DETECTION_TERMS = [
  "heart failure",
  "copd",
  "sepsis",
  "shock",
  "ecg",
  "telemetry",
  "abg",
  "arterial blood gas",
  "labs",
  "laboratory",
  "pharmacology",
  "clinical assessment",
] as const;

export const COUNTRY_OVERLAY_DETECTION_TERMS: Record<string, readonly string[]> = {
  UnitedKingdom: ["nhs", "news2", "duty of candour", "safeguarding", "nmc"],
  Australia: ["nmba", "ahpra", "rural healthcare", "aboriginal", "torres strait islander"],
  NewZealand: ["ncnz", "cultural safety", "te tiriti"],
  Canada: ["cno", "bccnm", "clpna", "crnnl", "provincial regulation"],
  UnitedStates: ["state boards", "nclex governance", "ncsbn", "pearson vue"],
} as const;

export const ROLE_OVERLAY_DETECTION_TERMS: Record<string, readonly string[]> = {
  PN: ["recognition", "monitoring", "basic medications", "escalation"],
  RN: ["assessment", "prioritization", "care planning", "clinical judgment"],
  NP: ["diagnosis", "differential diagnosis", "management", "prescribing"],
} as const;

export const EXAM_OVERLAY_DETECTION_TERMS = [
  "nclex-rn",
  "nclex-pn",
  "rex-pn",
  "cnple",
  "fnp",
  "agpcnp",
  "pmhnp",
  "whnp",
  "pnp-pc",
  "nmc cbt",
  "ahpra rn",
  "ncnz rn",
] as const;

export const LANGUAGE_OVERLAY_DETECTION_TERMS = [
  "fr",
  "french",
  "es",
  "spanish",
  "hi",
  "hindi",
  "pt",
  "portuguese",
  "tl",
  "tagalog",
  "ar",
  "arabic",
  "de",
  "german",
  "ja",
  "japanese",
  "ko",
  "korean",
  "zh",
  "chinese",
] as const;

export const RECOVERED_INTERNATIONAL_CONTENT_REGISTRY: readonly InternationalRecoveredAsset[] = [
  {
    contentId: "recovered-global-heart-failure-core",
    sourceFile: "src/content/blog-static-longtail/",
    contentType: "blog",
    topic: "Heart Failure",
    system: "Cardiovascular",
    role: null,
    country: null,
    exam: null,
    language: null,
    classification: "GLOBAL_SHARED_CORE",
    inheritanceSource: "GLOBAL_SHARED_CORE",
    reviewStatus: "requires_review",
    publicationStatus: "draft",
    version: 1,
    lastReviewed: null,
    ...INTERNATIONAL_RECOVERY_PROTECTION,
  },
  {
    contentId: "recovered-global-copd-core",
    sourceFile: "src/content/blog-static-longtail/",
    contentType: "blog",
    topic: "COPD",
    system: "Respiratory",
    role: null,
    country: null,
    exam: null,
    language: null,
    classification: "GLOBAL_SHARED_CORE",
    inheritanceSource: "GLOBAL_SHARED_CORE",
    reviewStatus: "requires_review",
    publicationStatus: "draft",
    version: 1,
    lastReviewed: null,
    ...INTERNATIONAL_RECOVERY_PROTECTION,
  },
  {
    contentId: "recovered-global-sepsis-core",
    sourceFile: "src/content/clinical-case-studies.json",
    contentType: "clinical_case",
    topic: "Sepsis",
    system: "Infectious Disease",
    role: null,
    country: null,
    exam: null,
    language: null,
    classification: "GLOBAL_SHARED_CORE",
    inheritanceSource: "GLOBAL_SHARED_CORE",
    reviewStatus: "requires_review",
    publicationStatus: "draft",
    version: 1,
    lastReviewed: null,
    ...INTERNATIONAL_RECOVERY_PROTECTION,
  },
  {
    contentId: "recovered-uk-nmc-news2-overlay",
    sourceFile: "src/content/blog-static-longtail/",
    contentType: "blog",
    topic: "NEWS2 and Deterioration",
    system: "Adult Health",
    role: "RN",
    country: "United Kingdom",
    exam: "NMC CBT",
    language: "en",
    classification: "COUNTRY_SPECIFIC",
    inheritanceSource: "GLOBAL_SHARED_CORE:clinical-assessment",
    reviewStatus: "requires_review",
    publicationStatus: "draft",
    version: 1,
    lastReviewed: null,
    ...INTERNATIONAL_RECOVERY_PROTECTION,
  },
  {
    contentId: "recovered-au-rural-cultural-safety-overlay",
    sourceFile: "data/blog-content/australia-nursing/",
    contentType: "blog",
    topic: "Rural Healthcare and Cultural Safety",
    system: "Professional Practice",
    role: "RN",
    country: "Australia",
    exam: "NMBA RN / IQNM",
    language: "en",
    classification: "COUNTRY_SPECIFIC",
    inheritanceSource: "GLOBAL_SHARED_CORE:professional-practice",
    reviewStatus: "requires_review",
    publicationStatus: "draft",
    version: 1,
    lastReviewed: null,
    ...INTERNATIONAL_RECOVERY_PROTECTION,
  },
  {
    contentId: "recovered-nz-te-tiriti-overlay",
    sourceFile: "src/content/blog-static-longtail/",
    contentType: "blog",
    topic: "Te Tiriti and Cultural Safety",
    system: "Professional Practice",
    role: "RN",
    country: "New Zealand",
    exam: "NCNZ RN",
    language: "en",
    classification: "COUNTRY_SPECIFIC",
    inheritanceSource: "GLOBAL_SHARED_CORE:professional-practice",
    reviewStatus: "requires_review",
    publicationStatus: "draft",
    version: 1,
    lastReviewed: null,
    ...INTERNATIONAL_RECOVERY_PROTECTION,
  },
  {
    contentId: "recovered-us-nclex-ngn-overlay",
    sourceFile: "src/content/questions/",
    contentType: "question",
    topic: "NGN Clinical Judgment",
    system: "Clinical Judgment",
    role: "RN",
    country: "United States",
    exam: "NCLEX-RN",
    language: "en",
    classification: "EXAM_SPECIFIC",
    inheritanceSource: "GLOBAL_SHARED_CORE:clinical-judgment",
    reviewStatus: "requires_review",
    publicationStatus: "draft",
    version: 1,
    lastReviewed: null,
    ...INTERNATIONAL_RECOVERY_PROTECTION,
  },
  {
    contentId: "recovered-heart-failure-np-role-overlay",
    sourceFile: "src/content/pathway-lessons/",
    contentType: "lesson",
    topic: "Heart Failure",
    system: "Cardiovascular",
    role: "NP",
    country: null,
    exam: "FNP",
    language: "en",
    classification: "ROLE_SPECIFIC",
    inheritanceSource: "GLOBAL_SHARED_CORE:heart-failure",
    reviewStatus: "requires_review",
    publicationStatus: "draft",
    version: 1,
    lastReviewed: null,
    ...INTERNATIONAL_RECOVERY_PROTECTION,
  },
  {
    contentId: "recovered-fr-international-overlay",
    sourceFile: "tools/i18n/",
    contentType: "localization",
    topic: "French International Nursing Overlay",
    system: "Localization",
    role: null,
    country: null,
    exam: null,
    language: "fr",
    classification: "LANGUAGE_SPECIFIC",
    inheritanceSource: "GLOBAL_SHARED_CORE",
    reviewStatus: "requires_review",
    publicationStatus: "draft",
    version: 1,
    lastReviewed: null,
    ...INTERNATIONAL_RECOVERY_PROTECTION,
  },
  {
    contentId: "recovered-es-international-overlay",
    sourceFile: "tools/i18n/",
    contentType: "localization",
    topic: "Spanish International Nursing Overlay",
    system: "Localization",
    role: null,
    country: null,
    exam: null,
    language: "es",
    classification: "LANGUAGE_SPECIFIC",
    inheritanceSource: "GLOBAL_SHARED_CORE",
    reviewStatus: "requires_review",
    publicationStatus: "draft",
    version: 1,
    lastReviewed: null,
    ...INTERNATIONAL_RECOVERY_PROTECTION,
  },
] as const;

export const INTERNATIONAL_RECOVERY_DUPLICATE_FINDINGS: readonly DuplicateContentFinding[] = [
  {
    groupId: "duplicate-global-heart-failure",
    duplicateType: "inherited_duplicate",
    contentTypes: ["blog", "lesson", "question", "flashcard"],
    representativeTopic: "Heart Failure",
    evidence: ["984 files with Heart Failure / CHF matches in docs/global-content-reuse-map.md"],
    recommendedAction: "map_to_global_core",
  },
  {
    groupId: "duplicate-global-sepsis",
    duplicateType: "near_duplicate",
    contentTypes: ["blog", "clinical_case", "simulation", "question"],
    representativeTopic: "Sepsis",
    evidence: ["4,414 files with Sepsis matches in docs/global-content-reuse-map.md"],
    recommendedAction: "map_to_global_core",
  },
  {
    groupId: "localized-international-nmc-links",
    duplicateType: "localized_duplicate",
    contentTypes: ["blog", "localization"],
    representativeTopic: "NMC CBT international registration links",
    evidence: ["Localized longtail files include repeated NMC CBT internal-link blocks across fr, es, pt, ar, tl, ja, and zh variants"],
    recommendedAction: "convert_to_overlay",
  },
];

export const INTERNATIONAL_TRANSLATION_READY_QUEUE = RECOVERED_INTERNATIONAL_CONTENT_REGISTRY.filter(
  (asset) => asset.classification === "GLOBAL_SHARED_CORE" || asset.classification === "LANGUAGE_SPECIFIC",
);

export function classifyInternationalContentCandidate(input: string): InternationalRecoveryClassification {
  const normalized = input.toLowerCase();

  if (GLOBAL_SHARED_CORE_DETECTION_TERMS.some((term) => normalized.includes(term))) return "GLOBAL_SHARED_CORE";
  if (Object.values(COUNTRY_OVERLAY_DETECTION_TERMS).some((terms) => terms.some((term) => normalized.includes(term)))) {
    return "COUNTRY_SPECIFIC";
  }
  if (EXAM_OVERLAY_DETECTION_TERMS.some((term) => normalized.includes(term))) return "EXAM_SPECIFIC";
  if (Object.values(ROLE_OVERLAY_DETECTION_TERMS).some((terms) => terms.some((term) => normalized.includes(term)))) {
    return "ROLE_SPECIFIC";
  }
  if (LANGUAGE_OVERLAY_DETECTION_TERMS.some((term) => normalized.includes(term))) return "LANGUAGE_SPECIFIC";
  return "REQUIRES_REVIEW";
}

export function toInternationalInheritanceLayer(classification: InternationalRecoveryClassification): InternationalInheritanceLayer {
  switch (classification) {
    case "COUNTRY_SPECIFIC":
      return "COUNTRY_OVERLAY";
    case "ROLE_SPECIFIC":
      return "ROLE_OVERLAY";
    case "EXAM_SPECIFIC":
      return "EXAM_OVERLAY";
    case "LANGUAGE_SPECIFIC":
      return "LANGUAGE_OVERLAY";
    case "GLOBAL_SHARED_CORE":
    case "ARCHIVE":
    case "REQUIRES_REVIEW":
    case "FUTURE_EXPANSION":
      return classification === "FUTURE_EXPANSION" ? "REQUIRES_REVIEW" : classification;
  }
}

export function classifyInternationalContentCandidateForInheritance(input: string): InternationalInheritanceLayer {
  return toInternationalInheritanceLayer(classifyInternationalContentCandidate(input));
}

export function buildInternationalInheritanceMap(
  assets: readonly InternationalRecoveredAsset[] = RECOVERED_INTERNATIONAL_CONTENT_REGISTRY,
): readonly InternationalInheritanceMapEntry[] {
  const topics = [...new Set(assets.map((asset) => asset.topic))].sort((a, b) => a.localeCompare(b));
  return topics.map((topic) => {
    const topicAssets = assets.filter((asset) => asset.topic === topic);
    const byLayer = (layer: InternationalInheritanceLayer) =>
      topicAssets
        .filter((asset) => toInternationalInheritanceLayer(asset.classification) === layer)
        .map((asset) => asset.contentId);
    return {
      topic,
      globalCoreAssets: byLayer("GLOBAL_SHARED_CORE"),
      roleOverlayAssets: byLayer("ROLE_OVERLAY"),
      countryOverlayAssets: byLayer("COUNTRY_OVERLAY"),
      examOverlayAssets: byLayer("EXAM_OVERLAY"),
      languageOverlayAssets: byLayer("LANGUAGE_OVERLAY"),
      requiresReviewAssets: byLayer("REQUIRES_REVIEW"),
      inheritancePath: "Global Core -> Role Overlay -> Country Overlay -> Exam Overlay -> Language Overlay",
    };
  });
}

export function buildInternationalReuseOpportunities(
  assets: readonly InternationalRecoveredAsset[] = RECOVERED_INTERNATIONAL_CONTENT_REGISTRY,
): readonly InternationalReuseOpportunity[] {
  return buildInternationalInheritanceMap(assets)
    .map((entry) => {
      const reusableAssetCount = entry.globalCoreAssets.length;
      const overlayAssetCount =
        entry.roleOverlayAssets.length +
        entry.countryOverlayAssets.length +
        entry.examOverlayAssets.length +
        entry.languageOverlayAssets.length;
      const duplicateRisk = INTERNATIONAL_RECOVERY_DUPLICATE_FINDINGS.some((finding) =>
        finding.representativeTopic.toLowerCase().includes(entry.topic.toLowerCase()) ||
        entry.topic.toLowerCase().includes(finding.representativeTopic.toLowerCase()),
      );
      const recommendedAction: InternationalReuseOpportunity["recommendedAction"] =
        duplicateRisk ? "deduplicate_before_translation" :
        reusableAssetCount > 0 && overlayAssetCount > 0 ? "attach_overlays" :
        reusableAssetCount > 0 ? "promote_to_global_core" :
        "manual_review";
      return {
        topic: entry.topic,
        reusableAssetCount,
        overlayAssetCount,
        recommendedAction,
        rationale:
          recommendedAction === "deduplicate_before_translation"
            ? `${entry.topic} has duplicate or localized duplicate evidence; map one canonical core before overlays or translations.`
            : recommendedAction === "attach_overlays"
              ? `${entry.topic} has reusable core and overlay assets; preserve inheritance instead of creating country copies.`
              : recommendedAction === "promote_to_global_core"
                ? `${entry.topic} is reusable clinical content and should be governed as shared core.`
                : `${entry.topic} needs manual review before inheritance can be trusted.`,
      };
    })
    .sort((a, b) => b.reusableAssetCount + b.overlayAssetCount - (a.reusableAssetCount + a.overlayAssetCount));
}

export function buildInternationalRecoveryDashboard() {
  const count = (classification: InternationalRecoveryClassification) =>
    RECOVERED_INTERNATIONAL_CONTENT_REGISTRY.filter((asset) => asset.classification === classification).length;
  const duplicateCount = INTERNATIONAL_RECOVERY_DUPLICATE_FINDINGS.length;
  const recoveryCount = RECOVERED_INTERNATIONAL_CONTENT_REGISTRY.length;
  const reviewQueueCount = RECOVERED_INTERNATIONAL_CONTENT_REGISTRY.filter((asset) => asset.reviewStatus === "requires_review").length;
  const reusableCount = count("GLOBAL_SHARED_CORE") + count("COUNTRY_SPECIFIC") + count("ROLE_SPECIFIC") + count("EXAM_SPECIFIC");

  return {
    globalCoreCount: count("GLOBAL_SHARED_CORE"),
    countryOverlayCount: count("COUNTRY_SPECIFIC"),
    roleOverlayCount: count("ROLE_SPECIFIC"),
    examOverlayCount: count("EXAM_SPECIFIC"),
    languageOverlayCount: count("LANGUAGE_SPECIFIC"),
    duplicateCount,
    recoveryCount,
    reviewQueueCount,
    draftInventoryCount: RECOVERED_INTERNATIONAL_CONTENT_REGISTRY.filter((asset) => asset.publicationStatus === "draft").length,
    estimatedReusableAssets: reusableCount,
    estimatedDuplicateAssets: duplicateCount,
    translationReadyCount: INTERNATIONAL_TRANSLATION_READY_QUEUE.length,
    inheritanceMapCount: buildInternationalInheritanceMap().length,
    reuseOpportunityCount: buildInternationalReuseOpportunities().length,
    readinessState: "recovery_classification_required_before_generation",
  } as const;
}

export function validateInternationalRecoveryEngine(): readonly string[] {
  const issues: string[] = [];
  const ids = new Set<string>();

  for (const root of INTERNATIONAL_RECOVERY_SOURCE_ROOTS) {
    if (!root) issues.push("Recovery source root must not be empty");
  }

  for (const asset of RECOVERED_INTERNATIONAL_CONTENT_REGISTRY) {
    if (ids.has(asset.contentId)) issues.push(`Duplicate recovered content id: ${asset.contentId}`);
    ids.add(asset.contentId);

    if (
      asset.status !== "draft" ||
      asset.published ||
      !asset.adminOnly ||
      asset.visibleInNavigation ||
      asset.learnerAccessible ||
      asset.launchReady ||
      !asset.noindex ||
      asset.reviewStatus !== "requires_review" ||
      asset.publicationStatus !== "draft"
    ) {
      issues.push(`${asset.contentId} must remain draft, admin-only, noindex, hidden, and review-gated`);
    }

    if (!asset.sourceFile || !asset.topic || !asset.system) {
      issues.push(`${asset.contentId} is missing registry metadata`);
    }
  }

  const dashboard = buildInternationalRecoveryDashboard();
  if (dashboard.recoveryCount === 0) issues.push("Recovery registry must contain recovered candidates");
  if (dashboard.reviewQueueCount !== dashboard.recoveryCount) issues.push("All recovered candidates must remain in review queue");
  if (dashboard.draftInventoryCount !== dashboard.recoveryCount) issues.push("All recovered candidates must remain draft");

  return issues;
}
