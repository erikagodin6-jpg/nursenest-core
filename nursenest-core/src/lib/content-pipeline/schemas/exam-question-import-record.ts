import { z } from "zod";

import {
  IMPORT_MAX_RATIONALE_CHARS,
  IMPORT_MAX_STEM_CHARS,
} from "@/lib/content-pipeline/import-safeguards";

/**
 * Bulk import / JSONL shape for exam questions.
 * Maps to `ExamQuestion` after transforms (admin API uses a different wire format).
 */
export const examQuestionImportRecordSchema = z.object({
  /** Omit to let DB generate UUID on insert */
  id: z.string().uuid().optional(),
  stem: z.string().min(10).max(IMPORT_MAX_STEM_CHARS),
  rationale: z.string().min(10).max(IMPORT_MAX_RATIONALE_CHARS),
  options: z.array(z.union([z.string(), z.number()])).min(1),
  correctAnswer: z.array(z.union([z.string(), z.number()])).min(1),
  questionType: z.string().min(1).max(64),
  tier: z.string().min(1).max(32),
  exam: z.string().min(1).max(64),
  countryCode: z.string().min(2).max(8),
  status: z.enum(["draft", "in_review", "published", "archived"]).default("draft"),
  tags: z.array(z.string()).optional(),
  topic: z.string().optional(),
  subtopic: z.string().optional(),
  difficulty: z.number().int().min(1).max(5).optional(),
  regionScope: z.enum(["US", "CA", "BOTH"]).optional(),
  careerType: z.string().max(32).optional(),
  /** If true, duplicate stemHash+scope checks should skip (e.g. intentional variant) */
  allowDuplicateStem: z.boolean().optional(),
});

export type ExamQuestionImportRecord = z.infer<typeof examQuestionImportRecordSchema>;
