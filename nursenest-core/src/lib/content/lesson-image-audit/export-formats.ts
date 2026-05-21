import type {
  DuplicateImageOpportunity,
  LessonImageAuditReport,
  LessonImageAuditRow,
  LessonImageProductionQueueItem,
} from "@/lib/content/lesson-image-audit/types";

function csvEscape(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const CSV_COLUMNS: (keyof LessonImageAuditRow)[] = [
  "lessonTitle",
  "lessonSlug",
  "pathwayId",
  "pathwayLabel",
  "roleTrack",
  "examFamily",
  "topic",
  "topicSlug",
  "bodySystem",
  "status",
  "shouldHaveImage",
  "imageSource",
  "matchedInventoryFilename",
  "matchedObjectKey",
  "fallbackSourceUsed",
  "inventoryFuzzy",
  "imageQualityScore",
  "recommendedImageType",
  "priorityScore",
  "priorityLevel",
  "productionCluster",
  "clusterLabel",
  "seoImportance",
  "educationalValue",
  "visualNecessity",
  "trafficPotential",
  "conversionPotential",
  "clinicalComplexity",
  "recommendedFilename",
  "preferredExtension",
  "suggestedAltText",
  "suggestedWidth",
  "suggestedHeight",
  "styleCategory",
  "sharedVisualSystemId",
  "duplicateGroupId",
  "productionNotes",
];

export function lessonImageAuditToCsv(report: LessonImageAuditReport): string {
  const header = CSV_COLUMNS.join(",");
  const lines = report.rows.map((row) =>
    CSV_COLUMNS.map((col) => csvEscape(row[col] as string | number | boolean | null)).join(","),
  );
  return [header, ...lines].join("\n") + "\n";
}

export function writeAuditJsonArtifacts(args: {
  report: LessonImageAuditReport;
  missingQueue: LessonImageProductionQueueItem[];
  highPriorityQueue: LessonImageProductionQueueItem[];
  duplicateOpportunities: DuplicateImageOpportunity[];
}): {
  fullReport: LessonImageAuditReport;
  missingImages: { generatedAt: string; count: number; items: LessonImageProductionQueueItem[] };
  highPriorityImages: { generatedAt: string; count: number; items: LessonImageProductionQueueItem[] };
  duplicateOpportunities: { generatedAt: string; count: number; items: DuplicateImageOpportunity[] };
} {
  const generatedAt = args.report.summary.generatedAt;
  return {
    fullReport: args.report,
    missingImages: {
      generatedAt,
      count: args.missingQueue.length,
      items: args.missingQueue,
    },
    highPriorityImages: {
      generatedAt,
      count: args.highPriorityQueue.length,
      items: args.highPriorityQueue,
    },
    duplicateOpportunities: {
      generatedAt,
      count: args.duplicateOpportunities.length,
      items: args.duplicateOpportunities,
    },
  };
}
