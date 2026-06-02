export type GlobalKnowledgeNodeType =
  | "Clinical Condition"
  | "Medication"
  | "Laboratory Test"
  | "ECG Concept"
  | "Clinical Skill"
  | "Assessment Finding"
  | "Symptom"
  | "Diagnostic Test"
  | "Safety Principle"
  | "Communication Principle"
  | "Leadership Concept"
  | "Documentation Concept"
  | "Professional Standard"
  | "Regulatory Requirement";

export type GlobalKnowledgeDifficulty = "foundation" | "intermediate" | "advanced" | "expert";
export type GlobalKnowledgeRole = "PN" | "RN" | "NP";
export type GlobalKnowledgeCountry = "Canada" | "United States" | "United Kingdom" | "Australia" | "New Zealand";
export type GlobalKnowledgeExam =
  | "NCLEX-RN"
  | "NCLEX-PN"
  | "REx-PN"
  | "CNPLE"
  | "FNP"
  | "AGPCNP"
  | "PMHNP"
  | "WHNP"
  | "PNP-PC"
  | "NMC CBT"
  | "NMBA RN"
  | "NCNZ RN";
export type GlobalKnowledgeLanguage = "en" | "fr" | "es";

export type GlobalKnowledgeReviewStatus =
  | "draft"
  | "clinical_review_required"
  | "clinical_approved"
  | "publication_approved";

export type GlobalKnowledgeInheritanceStatus =
  | "global_core"
  | "role_overlay_required"
  | "country_overlay_required"
  | "exam_overlay_required"
  | "language_overlay_required"
  | "asset_generation_ready";

export type GlobalKnowledgeAssetKind =
  | "Lesson"
  | "Question"
  | "Flashcard"
  | "Simulation"
  | "Case Study"
  | "Practice Exam Item"
  | "CAT Item"
  | "Daily Question"
  | "Blog Content";

export type GlobalKnowledgeNode = {
  readonly nodeId: string;
  readonly title: string;
  readonly nodeType: GlobalKnowledgeNodeType;
  readonly clinicalDomain: string;
  readonly difficulty: GlobalKnowledgeDifficulty;
  readonly roleApplicability: readonly GlobalKnowledgeRole[];
  readonly countryApplicability: readonly GlobalKnowledgeCountry[];
  readonly examApplicability: readonly GlobalKnowledgeExam[];
  readonly translationStatus: "not_started" | "ready_for_translation" | "translated" | "translation_review_required";
  readonly version: number;
  readonly reviewStatus: GlobalKnowledgeReviewStatus;
  readonly inheritanceStatus: GlobalKnowledgeInheritanceStatus;
  readonly clinicalAccuracyScore: number;
  readonly educationalValueScore: number;
  readonly translationReadinessScore: number;
  readonly examRelevanceScore: number;
  readonly publicationScore: number;
  readonly downstreamAssets: readonly GlobalKnowledgeAssetKind[];
};

export type GlobalKnowledgeLearningObjective = {
  readonly objectiveId: string;
  readonly nodeId: string;
  readonly statement: string;
  readonly role: GlobalKnowledgeRole;
  readonly derivedAssetKinds: readonly GlobalKnowledgeAssetKind[];
};

export type GlobalKnowledgeOverlayRule = {
  readonly overlayType: "role" | "country" | "exam" | "language";
  readonly overlayId: string;
  readonly appliesTo: readonly string[];
  readonly requiredConcepts: readonly string[];
  readonly mayDuplicateCoreNode: false;
};

export type GlobalKnowledgeGenerationRule = {
  readonly assetKind: GlobalKnowledgeAssetKind;
  readonly generatedFrom: "clinical_knowledge_node";
  readonly requiresApprovedClinicalCore: true;
  readonly requiresRoleOverlay: boolean;
  readonly requiresCountryOverlay: boolean;
  readonly requiresExamOverlay: boolean;
  readonly requiresLanguageOverlay: boolean;
};

export type GlobalKnowledgeUpdateQueueItem = {
  readonly queueId: string;
  readonly changedNodeId: string;
  readonly changedNodeVersion: number;
  readonly affectedAssetKind: GlobalKnowledgeAssetKind;
  readonly affectedRoles: readonly GlobalKnowledgeRole[];
  readonly affectedCountries: readonly GlobalKnowledgeCountry[];
  readonly affectedExams: readonly GlobalKnowledgeExam[];
  readonly affectedLanguages: readonly GlobalKnowledgeLanguage[];
  readonly reason: string;
};

export const GLOBAL_KNOWLEDGE_NODE_TYPES: readonly GlobalKnowledgeNodeType[] = [
  "Clinical Condition",
  "Medication",
  "Laboratory Test",
  "ECG Concept",
  "Clinical Skill",
  "Assessment Finding",
  "Symptom",
  "Diagnostic Test",
  "Safety Principle",
  "Communication Principle",
  "Leadership Concept",
  "Documentation Concept",
  "Professional Standard",
  "Regulatory Requirement",
] as const;

export const GLOBAL_KNOWLEDGE_INHERITANCE_SEQUENCE = [
  "Clinical Concept",
  "Learning Objective",
  "Role Overlay",
  "Country Overlay",
  "Exam Overlay",
  "Language Overlay",
  "Educational Asset",
] as const;

export const GLOBAL_KNOWLEDGE_ROLE_OVERLAY_RULES: readonly GlobalKnowledgeOverlayRule[] = [
  {
    overlayType: "role",
    overlayId: "pn-role-overlay",
    appliesTo: ["PN", "RPN", "LPN"],
    requiredConcepts: ["Recognition", "Monitoring", "Escalation", "Safety"],
    mayDuplicateCoreNode: false,
  },
  {
    overlayType: "role",
    overlayId: "rn-role-overlay",
    appliesTo: ["RN"],
    requiredConcepts: ["Assessment", "Prioritization", "Clinical Judgment", "Care Planning"],
    mayDuplicateCoreNode: false,
  },
  {
    overlayType: "role",
    overlayId: "np-role-overlay",
    appliesTo: ["NP"],
    requiredConcepts: ["Diagnosis", "Differential Diagnosis", "Management", "Prescribing"],
    mayDuplicateCoreNode: false,
  },
] as const;

export const GLOBAL_KNOWLEDGE_COUNTRY_OVERLAY_RULES: readonly GlobalKnowledgeOverlayRule[] = [
  {
    overlayType: "country",
    overlayId: "uk-country-overlay",
    appliesTo: ["United Kingdom"],
    requiredConcepts: ["NHS", "NEWS2", "Duty of Candour", "Safeguarding"],
    mayDuplicateCoreNode: false,
  },
  {
    overlayType: "country",
    overlayId: "australia-country-overlay",
    appliesTo: ["Australia"],
    requiredConcepts: ["NMBA", "Ahpra", "Rural Health", "Aboriginal Health"],
    mayDuplicateCoreNode: false,
  },
  {
    overlayType: "country",
    overlayId: "new-zealand-country-overlay",
    appliesTo: ["New Zealand"],
    requiredConcepts: ["NCNZ", "Te Tiriti", "Cultural Safety"],
    mayDuplicateCoreNode: false,
  },
  {
    overlayType: "country",
    overlayId: "canada-country-overlay",
    appliesTo: ["Canada"],
    requiredConcepts: ["Provincial Regulation", "Professional Standards"],
    mayDuplicateCoreNode: false,
  },
  {
    overlayType: "country",
    overlayId: "united-states-country-overlay",
    appliesTo: ["United States"],
    requiredConcepts: ["State Boards", "NCLEX Requirements"],
    mayDuplicateCoreNode: false,
  },
] as const;

export const GLOBAL_KNOWLEDGE_EXAM_OVERLAY_RULES: readonly GlobalKnowledgeOverlayRule[] = [
  {
    overlayType: "exam",
    overlayId: "rn-exam-overlay",
    appliesTo: ["NCLEX-RN", "REx-PN", "NMC CBT", "NMBA RN", "NCNZ RN"],
    requiredConcepts: ["Blueprint Mapping", "Clinical Judgment", "Practice Exam Eligibility", "CAT Eligibility"],
    mayDuplicateCoreNode: false,
  },
  {
    overlayType: "exam",
    overlayId: "np-exam-overlay",
    appliesTo: ["CNPLE", "FNP", "AGPCNP", "PMHNP", "WHNP", "PNP-PC"],
    requiredConcepts: ["Diagnostics", "Management", "Prescribing", "Longitudinal Care"],
    mayDuplicateCoreNode: false,
  },
] as const;

export const GLOBAL_KNOWLEDGE_LANGUAGE_OVERLAY_RULES: readonly GlobalKnowledgeOverlayRule[] = [
  {
    overlayType: "language",
    overlayId: "french-language-overlay",
    appliesTo: ["fr", "fr-CA"],
    requiredConcepts: ["Clinical terminology review", "Regulatory terminology review", "SEO review"],
    mayDuplicateCoreNode: false,
  },
  {
    overlayType: "language",
    overlayId: "spanish-language-overlay",
    appliesTo: ["es", "es-US", "es-MX"],
    requiredConcepts: ["Clinical terminology review", "Regional terminology review", "SEO review"],
    mayDuplicateCoreNode: false,
  },
] as const;

export const GLOBAL_KNOWLEDGE_GENERATION_RULES: readonly GlobalKnowledgeGenerationRule[] = [
  "Lesson",
  "Question",
  "Flashcard",
  "Simulation",
  "Case Study",
  "Practice Exam Item",
  "CAT Item",
  "Daily Question",
  "Blog Content",
].map((assetKind) => ({
  assetKind: assetKind as GlobalKnowledgeAssetKind,
  generatedFrom: "clinical_knowledge_node",
  requiresApprovedClinicalCore: true,
  requiresRoleOverlay: true,
  requiresCountryOverlay: true,
  requiresExamOverlay: true,
  requiresLanguageOverlay: assetKind !== "CAT Item" && assetKind !== "Practice Exam Item",
}));

export const GLOBAL_KNOWLEDGE_SAMPLE_NODES: readonly GlobalKnowledgeNode[] = [
  {
    nodeId: "clinical-condition-sepsis",
    title: "Sepsis",
    nodeType: "Clinical Condition",
    clinicalDomain: "Infectious Disease",
    difficulty: "advanced",
    roleApplicability: ["PN", "RN", "NP"],
    countryApplicability: ["Canada", "United States", "United Kingdom", "Australia", "New Zealand"],
    examApplicability: ["NCLEX-RN", "NCLEX-PN", "REx-PN", "CNPLE", "FNP", "NMC CBT", "NMBA RN", "NCNZ RN"],
    translationStatus: "ready_for_translation",
    version: 3,
    reviewStatus: "publication_approved",
    inheritanceStatus: "asset_generation_ready",
    clinicalAccuracyScore: 96,
    educationalValueScore: 94,
    translationReadinessScore: 92,
    examRelevanceScore: 95,
    publicationScore: 94,
    downstreamAssets: ["Lesson", "Question", "Flashcard", "Simulation", "Case Study", "Practice Exam Item", "CAT Item", "Daily Question", "Blog Content"],
  },
  {
    nodeId: "learning-objective-sepsis-early-deterioration",
    title: "Recognition of Early Deterioration",
    nodeType: "Assessment Finding",
    clinicalDomain: "Infectious Disease",
    difficulty: "advanced",
    roleApplicability: ["PN", "RN", "NP"],
    countryApplicability: ["Canada", "United States", "United Kingdom", "Australia", "New Zealand"],
    examApplicability: ["NCLEX-RN", "NCLEX-PN", "REx-PN", "NMC CBT", "NMBA RN", "NCNZ RN"],
    translationStatus: "ready_for_translation",
    version: 2,
    reviewStatus: "publication_approved",
    inheritanceStatus: "asset_generation_ready",
    clinicalAccuracyScore: 97,
    educationalValueScore: 96,
    translationReadinessScore: 93,
    examRelevanceScore: 96,
    publicationScore: 95,
    downstreamAssets: ["Lesson", "Question", "Flashcard", "Simulation", "Case Study", "Practice Exam Item", "CAT Item", "Daily Question"],
  },
  {
    nodeId: "medication-furosemide",
    title: "Furosemide",
    nodeType: "Medication",
    clinicalDomain: "Cardiovascular",
    difficulty: "intermediate",
    roleApplicability: ["PN", "RN", "NP"],
    countryApplicability: ["Canada", "United States", "United Kingdom", "Australia", "New Zealand"],
    examApplicability: ["NCLEX-RN", "NCLEX-PN", "REx-PN", "CNPLE", "FNP", "NMC CBT", "NMBA RN", "NCNZ RN"],
    translationStatus: "ready_for_translation",
    version: 1,
    reviewStatus: "clinical_approved",
    inheritanceStatus: "exam_overlay_required",
    clinicalAccuracyScore: 95,
    educationalValueScore: 91,
    translationReadinessScore: 90,
    examRelevanceScore: 92,
    publicationScore: 89,
    downstreamAssets: ["Lesson", "Question", "Flashcard", "Daily Question", "Blog Content"],
  },
] as const;

export const GLOBAL_KNOWLEDGE_SAMPLE_LEARNING_OBJECTIVES: readonly GlobalKnowledgeLearningObjective[] = [
  {
    objectiveId: "lo-sepsis-rn-early-deterioration",
    nodeId: "clinical-condition-sepsis",
    statement: "Recognize early deterioration patterns in sepsis and prioritize escalation before perfusion failure progresses.",
    role: "RN",
    derivedAssetKinds: ["Lesson", "Question", "Flashcard", "Simulation", "Case Study", "CAT Item", "Daily Question"],
  },
  {
    objectiveId: "lo-sepsis-pn-monitoring-escalation",
    nodeId: "clinical-condition-sepsis",
    statement: "Monitor sepsis warning signs, report worsening findings, and escalate according to role scope and local policy.",
    role: "PN",
    derivedAssetKinds: ["Lesson", "Question", "Flashcard", "Daily Question"],
  },
  {
    objectiveId: "lo-sepsis-np-differential-management",
    nodeId: "clinical-condition-sepsis",
    statement: "Differentiate sepsis from competing causes of deterioration and select evidence-aligned management priorities.",
    role: "NP",
    derivedAssetKinds: ["Lesson", "Question", "Flashcard", "Case Study", "Practice Exam Item"],
  },
] as const;

export function isKnowledgeNodeApprovedForGeneration(node: GlobalKnowledgeNode): boolean {
  return (
    node.reviewStatus === "publication_approved" &&
    node.inheritanceStatus === "asset_generation_ready" &&
    node.clinicalAccuracyScore >= 95 &&
    node.educationalValueScore >= 90 &&
    node.translationReadinessScore >= 90 &&
    node.examRelevanceScore >= 90 &&
    node.publicationScore >= 90
  );
}

export function buildKnowledgeNodeUpdateQueue(node: GlobalKnowledgeNode): readonly GlobalKnowledgeUpdateQueueItem[] {
  if (!isKnowledgeNodeApprovedForGeneration(node)) return [];

  return node.downstreamAssets.map((affectedAssetKind) => ({
    queueId: `update-${node.nodeId}-${node.version}-${affectedAssetKind.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    changedNodeId: node.nodeId,
    changedNodeVersion: node.version,
    affectedAssetKind,
    affectedRoles: node.roleApplicability,
    affectedCountries: node.countryApplicability,
    affectedExams: node.examApplicability,
    affectedLanguages: node.translationStatus === "ready_for_translation" || node.translationStatus === "translated" ? ["en", "fr", "es"] : ["en"],
    reason: "Clinical knowledge node changed; regenerate downstream inherited educational assets and translation overlays.",
  }));
}

export function buildGlobalKnowledgeGraphDashboard() {
  const approvedNodes = GLOBAL_KNOWLEDGE_SAMPLE_NODES.filter(isKnowledgeNodeApprovedForGeneration);
  const updateQueue = GLOBAL_KNOWLEDGE_SAMPLE_NODES.flatMap((node) => buildKnowledgeNodeUpdateQueue(node));

  return {
    nodeTypeCount: GLOBAL_KNOWLEDGE_NODE_TYPES.length,
    nodeCount: GLOBAL_KNOWLEDGE_SAMPLE_NODES.length,
    approvedGenerationNodeCount: approvedNodes.length,
    blockedGenerationNodeCount: GLOBAL_KNOWLEDGE_SAMPLE_NODES.length - approvedNodes.length,
    roleOverlayCount: GLOBAL_KNOWLEDGE_ROLE_OVERLAY_RULES.length,
    countryOverlayCount: GLOBAL_KNOWLEDGE_COUNTRY_OVERLAY_RULES.length,
    examOverlayCount: GLOBAL_KNOWLEDGE_EXAM_OVERLAY_RULES.length,
    languageOverlayCount: GLOBAL_KNOWLEDGE_LANGUAGE_OVERLAY_RULES.length,
    generationRuleCount: GLOBAL_KNOWLEDGE_GENERATION_RULES.length,
    updateQueueCount: updateQueue.length,
  } as const;
}

export function validateGlobalKnowledgeGraphInheritanceEngine(): readonly string[] {
  const issues: string[] = [];

  for (const requiredType of [
    "Clinical Condition",
    "Medication",
    "Laboratory Test",
    "ECG Concept",
    "Clinical Skill",
    "Assessment Finding",
    "Symptom",
    "Diagnostic Test",
    "Safety Principle",
    "Communication Principle",
    "Leadership Concept",
    "Documentation Concept",
    "Professional Standard",
    "Regulatory Requirement",
  ] as const) {
    if (!GLOBAL_KNOWLEDGE_NODE_TYPES.includes(requiredType)) {
      issues.push(`Missing knowledge node type: ${requiredType}`);
    }
  }

  if (GLOBAL_KNOWLEDGE_INHERITANCE_SEQUENCE.join(" > ") !== "Clinical Concept > Learning Objective > Role Overlay > Country Overlay > Exam Overlay > Language Overlay > Educational Asset") {
    issues.push("Inheritance sequence must match the approved knowledge graph structure");
  }

  for (const rule of [
    ...GLOBAL_KNOWLEDGE_ROLE_OVERLAY_RULES,
    ...GLOBAL_KNOWLEDGE_COUNTRY_OVERLAY_RULES,
    ...GLOBAL_KNOWLEDGE_EXAM_OVERLAY_RULES,
    ...GLOBAL_KNOWLEDGE_LANGUAGE_OVERLAY_RULES,
  ]) {
    if (rule.mayDuplicateCoreNode !== false) {
      issues.push(`${rule.overlayId} must not duplicate core nodes`);
    }
    if (rule.requiredConcepts.length === 0) {
      issues.push(`${rule.overlayId} must define required concepts`);
    }
  }

  for (const rule of GLOBAL_KNOWLEDGE_GENERATION_RULES) {
    if (rule.generatedFrom !== "clinical_knowledge_node") {
      issues.push(`${rule.assetKind} must be generated from clinical knowledge nodes`);
    }
    if (!rule.requiresApprovedClinicalCore) {
      issues.push(`${rule.assetKind} must require approved clinical core`);
    }
  }

  for (const node of GLOBAL_KNOWLEDGE_SAMPLE_NODES) {
    if (node.version < 1) issues.push(`${node.nodeId} must have a positive version`);
    if (node.roleApplicability.length === 0) issues.push(`${node.nodeId} must define role applicability`);
    if (node.countryApplicability.length === 0) issues.push(`${node.nodeId} must define country applicability`);
    if (node.examApplicability.length === 0) issues.push(`${node.nodeId} must define exam applicability`);
  }

  return issues;
}
