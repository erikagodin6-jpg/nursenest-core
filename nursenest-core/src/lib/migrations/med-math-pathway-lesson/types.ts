import type { ContentStatus, TierCode } from "@prisma/client";
import type { PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";

/**
 * Prisma `pathway_lessons` create shape for med-math legacy imports (no second store).
 * `sections` is the sole narrative + checkpoint quiz payload.
 */
export type MedMathPathwayLessonCreatePayload = {
  pathwayId: string;
  slug: string;
  locale: string;
  title: string;
  topic: string;
  topicSlug: string;
  bodySystem: string;
  previewSectionCount: number;
  seoTitle: string;
  seoDescription: string;
  sections: PathwayLessonSection[];
  status: ContentStatus;
  tierCode: TierCode | null;
  sortOrder: number;
  exams: string[];
  countries: string[];
  priority: string;
  examMeta: unknown[];
};

export type MedMathMigrationPlanRow = {
  legacySlug: string;
  newSlug: string;
  pathwayId: string;
  title: string;
  marketingLessonUrl: string;
  adminEditUrl: string;
  learnerDetailUrlAfterWrite: string;
  wordCountEstimate: number;
  validationErrors: string[];
  structuralIssues: string[];
  structuralPublicComplete: boolean;
};
