import { z } from "zod";

/**
 * Minimal bulk-import shape for pathway lessons (DB upsert).
 * Full `PathwayLessonRecord` normalization stays in pathway-lesson-catalog-sync / loader.
 */
export const pathwayLessonImportRecordSchema = z.object({
  pathwayId: z.string().min(1).max(128),
  slug: z.string().min(1).max(256),
  locale: z.string().min(2).max(32).default("en"),
  title: z.string().min(1).max(500),
  topic: z.string().min(1).max(300),
  topicSlug: z.string().min(1).max(200),
  bodySystem: z.string().min(1).max(200),
  previewSectionCount: z.number().int().min(0).max(20),
  seoTitle: z.string().min(1).max(500),
  seoDescription: z.string().min(1).max(2000),
  /** Normalized sections — structural validation at publish uses pathway-lesson-premium gates */
  sections: z.array(z.any()).min(1),
  status: z.enum(["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  sortOrder: z.number().int().optional(),
  countries: z.array(z.string()).optional(),
  exams: z.array(z.string()).optional(),
  examMeta: z.array(z.any()).optional(),
});

export type PathwayLessonImportRecord = z.infer<typeof pathwayLessonImportRecordSchema>;
