import { buildSuggestedImagePrompt } from "@/lib/content/lesson-image-audit/build-image-prompt";
import { HIGH_TRAFFIC_SLUG_HINTS } from "@/lib/content/lesson-image-audit/constants";
import { buildProductionRationales } from "@/lib/content/lesson-image-audit/production-rationale";
import type {
  DuplicateImageOpportunity,
  LessonImageAuditRow,
  LessonImagePriorityLevel,
  LessonImageProductionCluster,
} from "@/lib/content/lesson-image-audit/types";

export type ImageProductionBacklogReason =
  | "missing"
  | "upgrade_weak_match"
  | "upgrade_fallback"
  | "upgrade_low_quality";

export type ImageProductionRoadmapItem = {
  lessonTitle: string;
  pathway: string;
  pathwayId: string;
  slug: string;
  cluster: string;
  productionCluster: LessonImageProductionCluster;
  currentImageStatus: LessonImageAuditRow["status"];
  backlogReason: ImageProductionBacklogReason;
  whyImageryNeeded: string;
  recommendedImageType: LessonImageAuditRow["recommendedImageType"];
  recommendedFilename: string;
  suggestedAltText: string;
  educationalRationale: string;
  seoRationale: string;
  clinicalImportance: number;
  visualComplexity: number;
  productionPriority: LessonImagePriorityLevel;
  priorityScore: number;
  suggestedImagePrompt: string;
  productionNotes: string;
  matchedInventoryFilename: string | null;
  fallbackSourceUsed: string | null;
  sharedVisualSystemId: string | null;
  duplicateGroupId: string | null;
  seoImportance: number;
  educationalValue: number;
  visualNecessity: number;
  trafficPotential: number;
};

export type ClusterImageQueue = {
  cluster: LessonImageProductionCluster;
  clusterLabel: string;
  count: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  items: ImageProductionRoadmapItem[];
};

export type ImageProductionRoadmap = {
  generatedAt: string;
  summary: {
    totalBacklog: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowExcludedCount: number;
    missingCount: number;
    upgradeCount: number;
    top25Slugs: string[];
    quickestWinSystems: string[];
  };
  critical: ImageProductionRoadmapItem[];
  high: ImageProductionRoadmapItem[];
  medium: ImageProductionRoadmapItem[];
  all: ImageProductionRoadmapItem[];
  byCluster: ClusterImageQueue[];
  duplicateSystems: DuplicateImageOpportunity[];
  proposedVisualSystems: ProposedVisualSystemBatch[];
};

const VISUAL_SYSTEM_LABELS: Record<string, string> = {
  ecg_rhythm_family: "ECG strip systems",
  insulin_onset_peak_chart: "Insulin comparison charts",
  medication_safety_chart: "Medication comparison charts",
  lab_interpretation_panel: "Lab / ABG interpretation systems",
  ventilation_workflow: "Ventilator mode & workflow systems",
  procedure_workflow: "Procedure workflow systems",
  integumentary_clinical: "Burns & wound clinical systems",
  anatomy_diagram: "Anatomy diagram systems",
  emergency_algorithm: "ACLS / emergency algorithm systems",
  shock_comparison: "Shock comparison systems",
  electrolyte_ecg: "Electrolyte ECG systems",
  acid_base: "Acid/base interpretation systems",
  abg_interpretation: "ABG interpretation systems",
  acls_algorithm: "ACLS algorithm systems",
};

export type ProposedVisualSystemBatch = {
  sharedVisualSystemId: string;
  label: string;
  lessonCount: number;
  slugs: string[];
  titles: string[];
  recommendation: string;
};

export function buildProposedVisualSystemBatches(
  backlog: ImageProductionRoadmapItem[],
): ProposedVisualSystemBatch[] {
  const buckets = new Map<string, ImageProductionRoadmapItem[]>();
  for (const item of backlog) {
    if (!item.sharedVisualSystemId) continue;
    const list = buckets.get(item.sharedVisualSystemId) ?? [];
    list.push(item);
    buckets.set(item.sharedVisualSystemId, list);
  }

  return [...buckets.entries()]
    .filter(([, items]) => items.length >= 2)
    .map(([id, items]) => ({
      sharedVisualSystemId: id,
      label: visualSystemLabel(id),
      lessonCount: items.length,
      slugs: items.map((i) => i.slug),
      titles: items.map((i) => i.lessonTitle),
      recommendation: `Design one modular ${visualSystemLabel(id)} master asset, then variant labels for ${items.length} lessons.`,
    }))
    .sort((a, b) => b.lessonCount - a.lessonCount);
}

function matchesFlagshipCurriculum(row: LessonImageAuditRow): boolean {
  const h = [row.lessonSlug, row.topicSlug, row.lessonTitle, row.topic].join(" ").toLowerCase();
  return HIGH_TRAFFIC_SLUG_HINTS.some((hint) => h.includes(hint));
}

/** Lessons that need new art or upgraded art for production. */
export function rowNeedsProductionWork(row: LessonImageAuditRow): boolean {
  if (!row.shouldHaveImage) return false;
  if (
    row.status === "no_image" ||
    row.status === "low_quality_image" ||
    row.status === "fuzzy_match" ||
    row.status === "fallback_match"
  ) {
    return true;
  }
  if (row.status === "duplicate_image_candidate" && row.imageQualityScore < 55) {
    return true;
  }
  return false;
}

function effectivePriorityLevel(row: LessonImageAuditRow): LessonImagePriorityLevel {
  let level = row.priorityLevel;
  if (!rowNeedsProductionWork(row)) return level;

  if (matchesFlagshipCurriculum(row)) {
    if (level === "LOW" || level === "MEDIUM") level = "HIGH";
    if (row.status === "no_image" && row.priorityScore >= 68) level = "CRITICAL";
    if (row.visualNecessity >= 58 && row.status === "no_image") {
      level = level === "HIGH" ? "CRITICAL" : level;
    }
  }
  return level;
}

export function rowToRoadmapItem(row: LessonImageAuditRow): ImageProductionRoadmapItem {
  const rationales = buildProductionRationales(row);
  const productionPriority = effectivePriorityLevel(row);
  const prompt =
    row.suggestedImagePrompt ??
    buildSuggestedImagePrompt({
      lessonTitle: row.lessonTitle,
      recommendedImageType: row.recommendedImageType,
      productionNotes: row.productionNotes,
      clusterLabel: row.clusterLabel,
    });

  return {
    lessonTitle: row.lessonTitle,
    pathway: row.pathwayLabel,
    pathwayId: row.pathwayId,
    slug: row.lessonSlug,
    cluster: row.clusterLabel,
    productionCluster: row.productionCluster,
    currentImageStatus: row.status,
    backlogReason: rationales.backlogReason,
    whyImageryNeeded: rationales.whyImageryNeeded,
    recommendedImageType: row.recommendedImageType,
    recommendedFilename: row.recommendedFilename,
    suggestedAltText: row.suggestedAltText,
    educationalRationale: rationales.educationalRationale,
    seoRationale: rationales.seoRationale,
    clinicalImportance: row.clinicalComplexity,
    visualComplexity: Math.round((row.visualNecessity + row.clinicalComplexity) / 2),
    productionPriority,
    priorityScore: row.priorityScore,
    suggestedImagePrompt: prompt,
    productionNotes: row.productionNotes,
    matchedInventoryFilename: row.matchedInventoryFilename,
    fallbackSourceUsed: row.fallbackSourceUsed,
    sharedVisualSystemId: row.sharedVisualSystemId,
    duplicateGroupId: row.duplicateGroupId,
    seoImportance: row.seoImportance,
    educationalValue: row.educationalValue,
    visualNecessity: row.visualNecessity,
    trafficPotential: row.trafficPotential,
  };
}

export function buildImageProductionRoadmap(
  rows: LessonImageAuditRow[],
  duplicateSystems: DuplicateImageOpportunity[],
  generatedAt: string,
): ImageProductionRoadmap {
  const backlog = rows
    .filter(rowNeedsProductionWork)
    .map(rowToRoadmapItem)
    .sort((a, b) => b.priorityScore - a.priorityScore || a.slug.localeCompare(b.slug));

  const critical = backlog.filter((i) => i.productionPriority === "CRITICAL");
  const high = backlog.filter((i) => i.productionPriority === "HIGH");
  const medium = backlog.filter((i) => i.productionPriority === "MEDIUM");

  const clusterMap = new Map<LessonImageProductionCluster, ImageProductionRoadmapItem[]>();
  for (const item of backlog) {
    const list = clusterMap.get(item.productionCluster) ?? [];
    list.push(item);
    clusterMap.set(item.productionCluster, list);
  }

  const byCluster: ClusterImageQueue[] = [...clusterMap.entries()]
    .map(([cluster, items]) => {
      const sorted = [...items].sort((a, b) => b.priorityScore - a.priorityScore);
      const label = sorted[0]?.cluster ?? cluster;
      return {
        cluster,
        clusterLabel: label,
        count: sorted.length,
        criticalCount: sorted.filter((i) => i.productionPriority === "CRITICAL").length,
        highCount: sorted.filter((i) => i.productionPriority === "HIGH").length,
        mediumCount: sorted.filter((i) => i.productionPriority === "MEDIUM").length,
        items: sorted,
      };
    })
    .sort((a, b) => b.count - a.count);

  const systemCounts = new Map<string, number>();
  for (const item of backlog) {
    if (!item.sharedVisualSystemId) continue;
    systemCounts.set(
      item.sharedVisualSystemId,
      (systemCounts.get(item.sharedVisualSystemId) ?? 0) + 1,
    );
  }
  const quickestWinSystems = [...systemCounts.entries()]
    .filter(([, n]) => n >= 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([id, n]) => `${VISUAL_SYSTEM_LABELS[id] ?? id} (${n} lessons)`);

  const missingCount = backlog.filter((i) => i.backlogReason === "missing").length;

  return {
    generatedAt,
    summary: {
      totalBacklog: backlog.length,
      criticalCount: critical.length,
      highCount: high.length,
      mediumCount: medium.length,
      lowExcludedCount: rows.filter((r) => r.shouldHaveImage && r.priorityLevel === "LOW").length,
      missingCount,
      upgradeCount: backlog.length - missingCount,
      top25Slugs: backlog.slice(0, 25).map((i) => i.slug),
      quickestWinSystems,
    },
    critical,
    high,
    medium,
    all: backlog,
    byCluster,
    duplicateSystems,
    proposedVisualSystems: buildProposedVisualSystemBatches(backlog),
  };
}

export function visualSystemLabel(systemId: string): string {
  return VISUAL_SYSTEM_LABELS[systemId] ?? systemId.replace(/_/g, " ");
}
