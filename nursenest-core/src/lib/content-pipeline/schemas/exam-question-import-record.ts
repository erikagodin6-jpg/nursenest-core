import { z } from "zod";

import {
  IMPORT_MAX_RATIONALE_CHARS,
  IMPORT_MAX_STEM_CHARS,
} from "@/lib/content-pipeline/import-safeguards";
import { isBowtieQuestionType } from "@/lib/questions/bowtie-adapter";
import { validateBowtieQuestionPayload } from "@/lib/questions/bowtie-question-schema";

const scalarAnswerSchema = z.union([z.string(), z.number()]);
const conventionalOptionsSchema = z.array(z.union([z.string(), z.number()])).min(1);
const conventionalCorrectAnswerSchema = z.array(scalarAnswerSchema).min(1);
const bowtieOptionsSchema = z.record(z.string(), z.unknown());
const bowtieCorrectAnswerSchema = z.object({
  correctMapping: z.object({
    condition: z.string().min(1),
    intervention: z.string().min(1),
    monitoring: z.string().min(1),
  }),
});

/**
 * Bulk import / JSONL shape for exam questions.
 * Maps to `ExamQuestion` after transforms (admin API uses a different wire format).
 */
export const examQuestionImportRecordSchema = z
  .object({
    /** Omit to let DB generate UUID on insert */
    id: z.string().uuid().optional(),
    stem: z.string().min(10).max(IMPORT_MAX_STEM_CHARS),
    rationale: z.string().min(10).max(IMPORT_MAX_RATIONALE_CHARS),
    options: z.union([conventionalOptionsSchema, bowtieOptionsSchema]),
    correctAnswer: z.union([conventionalCorrectAnswerSchema, bowtieCorrectAnswerSchema]),
    questionType: z.string().min(1).max(64),
    tier: z.string().min(1).max(32),
    exam: z.string().min(1).max(64),
    countryCode: z.string().min(2).max(8),
    status: z.enum(["draft", "in_review", "published", "archived"]).default("draft"),
    tags: z.array(z.string()).optional(),
    topic: z.string().optional(),
    subtopic: z.string().optional(),
    bodySystem: z.string().optional(),
    body_system: z.string().optional(),
    difficulty: z.number().int().min(1).max(5).optional(),
    regionScope: z.enum(["US", "CA", "BOTH"]).optional(),
    careerType: z.string().max(32).optional(),
    /** If true, duplicate stemHash+scope checks should skip (e.g. intentional variant) */
    allowDuplicateStem: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (isBowtieQuestionType(data.questionType)) {
      const result = validateBowtieQuestionPayload({
        questionType: data.questionType,
        stem: data.stem,
        options: data.options,
        correctAnswer: data.correctAnswer,
        rationale: data.rationale,
        topic: data.topic,
        bodySystem: data.bodySystem ?? data.body_system,
        exam: data.exam,
        tags: data.tags,
        publishMode: data.status === "published",
        requireRationale: true,
      });
      if (!result.ok) {
        for (const error of result.errors) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: error });
        }
      }
      return;
    }

    if (!Array.isArray(data.options)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["options"], message: "Non-bowtie options must be an array" });
    }
    if (!Array.isArray(data.correctAnswer)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["correctAnswer"],
        message: "Non-bowtie correctAnswer must be an array",
      });
    }
  });

export type ExamQuestionImportRecord = z.infer<typeof examQuestionImportRecordSchema>;
