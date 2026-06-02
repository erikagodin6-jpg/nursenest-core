import type { LessonImageSource } from "@/lib/content/resolve-lesson-image";

/** Resolved image status for production planning. */
export type LessonImageAuditStatus =
  | "exact_match"
  | "fuzzy_match"
  | "fallback_match"
  | "no_image"
  | "low_quality_image"
  | "duplicate_image_candidate";

export type LessonImagePriorityLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type LessonImageProductionCluster =
  | "cardiac_ecg"
  | "cardiac_acls"
  | "cardiac_arrhythmias"
  | "cardiac_general"
  | "respiratory"
  | "pharmacology"
  | "labs"
  | "med_surg"
  | "emergency"
  | "anatomy"
  | "np_clinical"
  | "procedures"
  | "policy_study_skills"
  | "other";

export type RecommendedLessonImageType =
  | "infographic"
  | "anatomy_diagram"
  | "ecg_strip"
  | "medication_chart"
  | "nursing_workflow"
  | "comparison_table"
  | "lab_interpretation_chart"
  | "clinical_illustration"
  | "patient_scenario_visual"
  | "algorithm_flowchart";

export type LessonImageAuditRow = {
  lessonTitle: string;
  lessonSlug: string;
  pathwayId: string;
  pathwayLabel: string;
  roleTrack: string;
  examFamily: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  status: LessonImageAuditStatus;
  shouldHaveImage: boolean;
  imageSource: LessonImageSource;
  matchedInventoryFilename: string | null;
  matchedObjectKey: string | null;
  fallbackSourceUsed: string | null;
  inventoryFuzzy: boolean;
  imageQualityScore: number;
  recommendedImageType: RecommendedLessonImageType;
  recommendedImageTypes: RecommendedLessonImageType[];
  productionNotes: string;
  priorityScore: number;
  priorityLevel: LessonImagePriorityLevel;
  productionCluster: LessonImageProductionCluster;
  clusterLabel: string;
  seoImportance: number;
  educationalValue: number;
  visualNecessity: number;
  trafficPotential: number;
  conversionPotential: number;
  clinicalComplexity: number;
  recommendedFilename: string;
  preferredExtension: ".avif" | ".webp";
  suggestedAltText: string;
  suggestedWidth: number;
  suggestedHeight: number;
  styleCategory: "blossom_clinical_vector";
  suggestedImagePrompt: string | null;
  sharedVisualSystemId: string | null;
  duplicateGroupId: string | null;
  isMarketingRenderable: boolean;
};

export type LessonImageAuditSummary = {
  generatedAt: string;
  pathwayCount: number;
  lessonCount: number;
  marketingRenderableCount: number;
  withImageCount: number;
  missingImageCount: number;
  shouldHaveImageCount: number;
  missingAmongShouldHave: number;
  coveragePct: number;
  shouldHaveCoveragePct: number;
  byStatus: Record<LessonImageAuditStatus, number>;
  byPriority: Record<LessonImagePriorityLevel, number>;
  byCluster: Record<LessonImageProductionCluster, number>;
};

export type LessonImageAuditReport = {
  summary: LessonImageAuditSummary;
  rows: LessonImageAuditRow[];
};

export type LessonImageProductionQueueItem = Pick<
  LessonImageAuditRow,
  | "lessonTitle"
  | "lessonSlug"
  | "pathwayId"
  | "pathwayLabel"
  | "priorityLevel"
  | "priorityScore"
  | "productionCluster"
  | "recommendedImageType"
  | "recommendedFilename"
  | "preferredExtension"
  | "suggestedAltText"
  | "suggestedWidth"
  | "suggestedHeight"
  | "styleCategory"
  | "suggestedImagePrompt"
  | "productionNotes"
>;

export type DuplicateImageOpportunity = {
  duplicateGroupId: string;
  sharedVisualSystemId: string;
  matchedObjectKey: string | null;
  recommendedFilename: string;
  lessonCount: number;
  lessonSlugs: string[];
  pathwayIds: string[];
  titles: string[];
  recommendation: string;
};
