/** Pure types for E-E-A-T editorial dashboard — safe to import from client bundles (no Node APIs). */

export type EeatEditorialPriority = "critical" | "high" | "medium" | "low";

export type EeatEditorialRow = {
  id: string;
  pathwayKey: string;
  pathwayLabel: string;
  contentType: string;
  urlPattern: string;
  eeatScore: number;
  sectionCompleteness: number;
  internalLinksCount: number;
  wordCount: number;
  authorPresent: boolean;
  lastUpdated: string | null;
  flags: string[];
  lossReasons: string[];
  recommendedActions: string[];
  priority: EeatEditorialPriority;
  staleContent: boolean;
  thinProgrammatic: boolean;
  missingAttribution: boolean;
  missingInternalLinks: boolean;
  structureIncomplete: boolean;
  recommendedFixesCopy: string;
};

export type PathwayEeatRollup = {
  pathwayKey: string;
  pathwayLabel: string;
  pageCount: number;
  averageScore: number;
  minScore: number;
};

export type EeatEditorialDashboardVm = {
  generatedAtPageScores: string | null;
  generatedAtFinalStatus: string | null;
  thresholds: { minimumPassingEeatScore: number; minimumInternalLinks: number } | null;
  finalStatusSummary: Record<string, unknown> | null;
  overview: {
    totalPages: number;
    averageScore: number;
    belowThreshold: number;
    internalLinkGaps: number;
    thinProgrammaticCount: number;
    staleFlaggedCount: number;
    missingAttributionCount: number;
    structureIncompleteCount: number;
  };
  rows: EeatEditorialRow[];
  pathwayRollups: PathwayEeatRollup[];
  thinProgrammaticRows: EeatEditorialRow[];
  staleQueueRows: EeatEditorialRow[];
  attributionQueueRows: EeatEditorialRow[];
  topicalClusterCount: number;
  freshnessMeta: {
    catalogBundleMtime: string | null;
    staleBlogPostsSample: { slug: string; updatedAt: string }[];
    policy: { staleDaysBlog: number; staleDaysLessonCatalog: number } | null;
  };
  loadWarnings: string[];
  completionQueuePreview: Array<{ id: string; score: number; flags: string[] }>;
};

export type EeatRawPage = {
  id: string;
  urlPattern: string;
  contentType: string;
  wordCount: number;
  sectionCompleteness: number;
  internalLinksCount: number;
  lastUpdated: string | null;
  authorPresent: boolean;
  schemaPresent: boolean;
  eeatScore: number;
  flags: string[];
};
