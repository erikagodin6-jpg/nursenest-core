import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { getInventoryKeys } from "@/lib/education-images/inventory";
import {
  getCatalogPathwayLessonsSync,
  listCatalogPathwayIdsWithLessonsSync,
  sortAndFilterLessonsForPathwayContext,
} from "@/lib/lessons/pathway-lesson-catalog-sync";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { normalizeLessonImageBasename } from "@/lib/content/lesson-image-inventory-match";
import { resolveLessonImage } from "@/lib/content/resolve-lesson-image";
import { STYLE_GOVERNANCE } from "@/lib/content/lesson-image-audit/constants";
import { assignDuplicateGroupIds, buildDuplicateOpportunities } from "@/lib/content/lesson-image-audit/duplicate-opportunities";
import { buildSuggestedImagePrompt } from "@/lib/content/lesson-image-audit/build-image-prompt";
import {
  recommendLessonImageTypes,
  resolveProductionCluster,
} from "@/lib/content/lesson-image-audit/image-type-recommendation";
import { computePriorityScore } from "@/lib/content/lesson-image-audit/priority-scoring";
import {
  inventoryFilenameFromObjectKey,
  resolveLessonImageAuditStatus,
  scoreImageQuality,
} from "@/lib/content/lesson-image-audit/resolve-audit-status";
import type {
  DuplicateImageOpportunity,
  LessonImageAuditReport,
  LessonImageAuditRow,
  LessonImageAuditStatus,
  LessonImageAuditSummary,
  LessonImageProductionQueueItem,
} from "@/lib/content/lesson-image-audit/types";

export type BuildLessonImageAuditOptions = {
  pathwayIds?: string[];
  /** When true, include lessons that fail marketing render gate (default: marketing-renderable only). */
  includeNonRenderable?: boolean;
};

function auditRowForLesson(
  pathwayId: string,
  lesson: PathwayLessonRecord,
  inventoryKeys: readonly string[],
): LessonImageAuditRow {
  const pathway = getExamPathwayById(pathwayId);
  const resolution = resolveLessonImage({
    slug: lesson.slug,
    title: lesson.title,
    topicSlug: lesson.topicSlug,
    topic: lesson.topic,
    bodySystem: lesson.bodySystem,
  });

  const { status: baseStatus, inventoryFuzzy, fallbackSourceUsed } = resolveLessonImageAuditStatus({
    resolution,
    slug: lesson.slug,
    title: lesson.title,
    topicSlug: lesson.topicSlug,
    inventoryKeys,
  });

  const visualInput = {
    title: lesson.title,
    slug: lesson.slug,
    topic: lesson.topic,
    topicSlug: lesson.topicSlug,
    bodySystem: lesson.bodySystem,
  };

  const imageTypes = recommendLessonImageTypes(visualInput);
  const { cluster, label: clusterLabel } = resolveProductionCluster(visualInput, imageTypes);
  const priority = computePriorityScore(visualInput, baseStatus);

  const recommendedBasename = normalizeLessonImageBasename(lesson.title || lesson.slug);
  const recommendedFilename = `${recommendedBasename}${STYLE_GOVERNANCE.preferredExtension}`;

  const imageQualityScore = scoreImageQuality({
    source: resolution.source,
    objectKey: resolution.objectKey,
    inventoryFuzzy,
    status: baseStatus,
  });

  const needsArtwork =
    priority.shouldHaveImage &&
    (baseStatus === "no_image" ||
      baseStatus === "low_quality_image" ||
      baseStatus === "fuzzy_match" ||
      baseStatus === "fallback_match");
  const suggestedImagePrompt = needsArtwork
    ? buildSuggestedImagePrompt({
        lessonTitle: lesson.title,
        recommendedImageType: imageTypes.primary,
        productionNotes: imageTypes.productionNotes,
        clusterLabel,
      })
    : null;

  return {
    lessonTitle: lesson.title,
    lessonSlug: lesson.slug,
    pathwayId,
    pathwayLabel: pathway?.displayName ?? pathwayId,
    roleTrack: pathway?.roleTrack ?? "unknown",
    examFamily: pathway?.examFamily ?? "unknown",
    topic: lesson.topic,
    topicSlug: lesson.topicSlug,
    bodySystem: lesson.bodySystem,
    status: baseStatus,
    shouldHaveImage: priority.shouldHaveImage,
    imageSource: resolution.source,
    matchedInventoryFilename: inventoryFilenameFromObjectKey(resolution.objectKey),
    matchedObjectKey: resolution.objectKey,
    fallbackSourceUsed,
    inventoryFuzzy,
    imageQualityScore,
    recommendedImageType: imageTypes.primary,
    recommendedImageTypes: [imageTypes.primary, ...imageTypes.secondary],
    productionNotes: imageTypes.productionNotes,
    priorityScore: priority.priorityScore,
    priorityLevel: priority.priorityLevel,
    productionCluster: cluster,
    clusterLabel,
    seoImportance: priority.seoImportance,
    educationalValue: priority.educationalValue,
    visualNecessity: priority.visualNecessity,
    trafficPotential: priority.trafficPotential,
    conversionPotential: priority.conversionPotential,
    clinicalComplexity: priority.clinicalComplexity,
    recommendedFilename,
    preferredExtension: STYLE_GOVERNANCE.preferredExtension,
    suggestedAltText: `${lesson.title} — clinical illustration`,
    suggestedWidth: STYLE_GOVERNANCE.defaultWidth,
    suggestedHeight: STYLE_GOVERNANCE.defaultHeight,
    styleCategory: "blossom_clinical_vector",
    suggestedImagePrompt,
    sharedVisualSystemId: imageTypes.sharedVisualSystemId,
    duplicateGroupId: null,
    isMarketingRenderable: true,
  };
}

function summarize(rows: LessonImageAuditRow[], pathwayCount: number): LessonImageAuditSummary {
  const byStatus = {} as Record<LessonImageAuditStatus, number>;
  const byPriority = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 } as LessonImageAuditSummary["byPriority"];
  const byCluster = {} as LessonImageAuditSummary["byCluster"];

  let withImageCount = 0;
  let shouldHaveImageCount = 0;
  let missingAmongShouldHave = 0;

  for (const row of rows) {
    byStatus[row.status] = (byStatus[row.status] ?? 0) + 1;
    byPriority[row.priorityLevel] = (byPriority[row.priorityLevel] ?? 0) + 1;
    byCluster[row.productionCluster] = (byCluster[row.productionCluster] ?? 0) + 1;
    if (row.status !== "no_image") withImageCount += 1;
    if (row.shouldHaveImage) {
      shouldHaveImageCount += 1;
      if (row.status === "no_image" || row.status === "low_quality_image") {
        missingAmongShouldHave += 1;
      }
    }
  }

  const lessonCount = rows.length;
  const coveragePct =
    lessonCount > 0 ? Math.round((withImageCount / lessonCount) * 1000) / 10 : 0;
  const shouldHaveCoveragePct =
    shouldHaveImageCount > 0
      ? Math.round(((shouldHaveImageCount - missingAmongShouldHave) / shouldHaveImageCount) * 1000) / 10
      : 0;

  return {
    generatedAt: new Date().toISOString(),
    pathwayCount,
    lessonCount,
    marketingRenderableCount: lessonCount,
    withImageCount,
    missingImageCount: lessonCount - withImageCount,
    shouldHaveImageCount,
    missingAmongShouldHave,
    coveragePct,
    shouldHaveCoveragePct,
    byStatus,
    byPriority,
    byCluster,
  };
}

export function buildLessonImageAuditReport(
  options: BuildLessonImageAuditOptions = {},
): LessonImageAuditReport {
  const pathwayIds =
    options.pathwayIds?.length ?
      [...options.pathwayIds].sort((a, b) => a.localeCompare(b))
    : listCatalogPathwayIdsWithLessonsSync();

  const inventoryKeys = getInventoryKeys();
  const rows: LessonImageAuditRow[] = [];

  for (const pathwayId of pathwayIds) {
    const normalized = getCatalogPathwayLessonsSync(pathwayId);
    const renderable = options.includeNonRenderable
      ? normalized
      : sortAndFilterLessonsForPathwayContext(pathwayId, normalized);
    const renderableSet = new Set(renderable.map((l) => l.slug.trim()));

    for (const lesson of normalized) {
      if (!options.includeNonRenderable && !renderableSet.has(lesson.slug.trim())) continue;
      rows.push(auditRowForLesson(pathwayId, lesson, inventoryKeys));
    }
  }

  const withDuplicates = assignDuplicateGroupIds(rows);
  withDuplicates.sort(
    (a, b) =>
      b.priorityScore - a.priorityScore ||
      a.pathwayId.localeCompare(b.pathwayId) ||
      a.lessonSlug.localeCompare(b.lessonSlug),
  );

  return {
    summary: summarize(withDuplicates, pathwayIds.length),
    rows: withDuplicates,
  };
}

export function selectMissingImageQueue(rows: LessonImageAuditRow[]): LessonImageProductionQueueItem[] {
  return rows
    .filter(
      (r) =>
        r.shouldHaveImage &&
        (r.status === "no_image" || r.status === "low_quality_image" || r.status === "fuzzy_match"),
    )
    .map(toQueueItem);
}

export function selectHighPriorityQueue(rows: LessonImageAuditRow[]): LessonImageProductionQueueItem[] {
  return rows
    .filter(
      (r) =>
        r.shouldHaveImage &&
        (r.priorityLevel === "CRITICAL" ||
          r.priorityLevel === "HIGH" ||
          (r.priorityLevel === "MEDIUM" &&
            r.status === "no_image" &&
            r.priorityScore >= 58)),
    )
    .map(toQueueItem)
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 250);
}

function toQueueItem(row: LessonImageAuditRow): LessonImageProductionQueueItem {
  return {
    lessonTitle: row.lessonTitle,
    lessonSlug: row.lessonSlug,
    pathwayId: row.pathwayId,
    pathwayLabel: row.pathwayLabel,
    priorityLevel: row.priorityLevel,
    priorityScore: row.priorityScore,
    productionCluster: row.productionCluster,
    recommendedImageType: row.recommendedImageType,
    recommendedFilename: row.recommendedFilename,
    preferredExtension: row.preferredExtension,
    suggestedAltText: row.suggestedAltText,
    suggestedWidth: row.suggestedWidth,
    suggestedHeight: row.suggestedHeight,
    styleCategory: row.styleCategory,
    suggestedImagePrompt: row.suggestedImagePrompt,
    productionNotes: row.productionNotes,
  };
}

export function getDuplicateOpportunitiesFromReport(
  report: LessonImageAuditReport,
): DuplicateImageOpportunity[] {
  return buildDuplicateOpportunities(report.rows);
}
