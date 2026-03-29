import { CountryCode, ExamFamily, QuestionType, TierCode } from "@prisma/client";
import { z } from "zod";
import { stemHash } from "@/lib/content/stem-hash";
import { validateQuestionForPublish } from "@/lib/content/publish-validation";
import { validateQuestionPayload } from "@/lib/content/question-schema";

export type DraftValidationResult = {
  ok: boolean;
  errors: string[];
  warnings: string[];
  duplicateRisk: boolean;
};

const aiQuestionItemSchema = z.object({
  question: z.string().optional(),
  stem: z.string().optional(),
  type: z.string().optional(),
  options: z.array(z.string()).min(2).optional(),
  correctIndex: z.number().int().min(0).optional(),
  rationale: z.string().optional(),
  tags: z.array(z.string()).optional(),
  difficulty: z.string().optional(),
});

export type NormalizedQuestionDraft = {
  stem: string;
  rationale: string;
  options: string[];
  answerKey: string[];
  questionType: QuestionType;
  topicTag?: string;
};

export function normalizeAiQuestionItem(raw: unknown): { ok: true; value: NormalizedQuestionDraft } | { ok: false; error: string } {
  const p = aiQuestionItemSchema.safeParse(raw);
  if (!p.success) return { ok: false, error: "Invalid AI question shape" };
  const o = p.data;
  const stem = (o.stem ?? o.question ?? "").trim();
  if (stem.length < 10) return { ok: false, error: "Stem too short" };
  const options = o.options ?? [];
  if (options.length < 2) return { ok: false, error: "Need at least 2 options" };
  const idx = o.correctIndex ?? 0;
  if (idx < 0 || idx >= options.length) return { ok: false, error: "correctIndex out of range" };
  const correct = options[idx];
  if (!correct) return { ok: false, error: "Missing correct option" };
  const rationale = (o.rationale ?? "").trim();
  return {
    ok: true,
    value: {
      stem,
      rationale,
      options,
      answerKey: [correct],
      questionType: QuestionType.MCQ,
      topicTag: o.tags?.[0],
    },
  };
}

export function validateNormalizedQuestion(
  n: NormalizedQuestionDraft,
  opts: { duplicateStemHashes: Set<string> },
): DraftValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let duplicateRisk = false;

  const sh = stemHash(n.stem);
  if (opts.duplicateStemHashes.has(sh)) {
    duplicateRisk = true;
    warnings.push("Possible duplicate stem hash in this batch.");
  }
  opts.duplicateStemHashes.add(sh);

  const shape = validateQuestionPayload(n.questionType, n.options, n.answerKey);
  if (shape) errors.push(shape);

  const pub = validateQuestionForPublish({
    stem: n.stem,
    rationale: n.rationale,
    questionType: n.questionType,
    options: n.options,
    answerKey: n.answerKey,
  });
  if (!pub.ok) errors.push(...pub.reasons);

  if (n.rationale.length < 20) warnings.push("Rationale is short — expand before publish.");

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    duplicateRisk,
  };
}

const aiFlashItemSchema = z.object({
  front: z.string().optional(),
  back: z.string().optional(),
  tags: z.array(z.string()).optional(),
  difficulty: z.string().optional(),
});

export type NormalizedFlashcardDraft = {
  front: string;
  back: string;
  tags: string[];
};

export function normalizeAiFlashcardItem(raw: unknown): { ok: true; value: NormalizedFlashcardDraft } | { ok: false; error: string } {
  const p = aiFlashItemSchema.safeParse(raw);
  if (!p.success) return { ok: false, error: "Invalid AI flashcard shape" };
  const front = (p.data.front ?? "").trim();
  const back = (p.data.back ?? "").trim();
  if (front.length < 3) return { ok: false, error: "Front too short" };
  if (back.length < 3) return { ok: false, error: "Back too short" };
  return {
    ok: true,
    value: {
      front,
      back,
      tags: p.data.tags ?? [],
    },
  };
}

export function validateNormalizedFlashcard(n: NormalizedFlashcardDraft): DraftValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (n.front.length > 8000) errors.push("Front too long");
  if (n.back.length > 80000) errors.push("Back too long");
  return { ok: errors.length === 0, errors, warnings, duplicateRisk: false };
}

export function tierFromApi(t: string): TierCode {
  const u = t.toUpperCase();
  if (u === "FREE") return TierCode.RN;
  if (u === "RPN") return TierCode.RPN;
  if (u === "RN") return TierCode.RN;
  if (u === "NP") return TierCode.NP;
  return TierCode.RN;
}

export function examFamilyFromApi(s?: string): ExamFamily {
  if (!s) return ExamFamily.GENERIC;
  const u = s.toUpperCase().replace(/-/g, "_");
  if (u === "NCLEX_RN") return ExamFamily.NCLEX_RN;
  if (u === "NCLEX_PN") return ExamFamily.NCLEX_PN;
  if (u === "REX_PN") return ExamFamily.REX_PN;
  if (u === "NP") return ExamFamily.NP;
  if (u === "ALLIED") return ExamFamily.ALLIED;
  return ExamFamily.GENERIC;
}

export function countryFromApi(c: string): CountryCode {
  return c === "US" ? CountryCode.US : CountryCode.CA;
}
