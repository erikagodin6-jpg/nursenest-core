import { z } from "zod";
import { QuestionType } from "@prisma/client";

export const mcqOptionsSchema = z.object({
  options: z.array(z.string().min(1)).min(2),
  answerKey: z.array(z.string()).min(1),
});

export const sataOptionsSchema = z.object({
  options: z.array(z.string().min(1)).min(2),
  answerKey: z.array(z.string()).min(1),
});

export const orderingSchema = z.object({
  options: z.array(z.string().min(1)).min(2),
  answerKey: z.array(z.string()).min(1),
});

export const fibNumericSchema = z.object({
  options: z.array(z.string()).min(1),
  answerKey: z.array(z.union([z.string(), z.number()])).min(1),
});

export const ngnCaseSchema = z.object({
  options: z.array(z.string()).min(2),
  answerKey: z.array(z.string()).min(1),
  vignette: z.string().optional(),
});

export function validateQuestionPayload(type: QuestionType, options: unknown, answerKey: unknown): string | null {
  const payload = { options, answerKey };
  try {
    switch (type) {
      case QuestionType.MCQ:
        mcqOptionsSchema.parse(payload);
        break;
      case QuestionType.SATA:
        sataOptionsSchema.parse(payload);
        break;
      case QuestionType.ORDERING:
        orderingSchema.parse(payload);
        break;
      case QuestionType.FIB_NUMERIC:
        fibNumericSchema.parse(payload);
        break;
      case QuestionType.NGN_CASE:
        ngnCaseSchema.parse(payload);
        break;
      default:
        return "Unsupported question type";
    }
  } catch (e) {
    return e instanceof z.ZodError ? e.errors.map((x) => x.message).join("; ") : "Invalid options/answer shape";
  }
  return null;
}
