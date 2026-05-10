import { examQuestionExamPublishAllowlist } from "@/lib/content-quality/exam-question-exam-normalization";
import {
  BOWTIE_SLOT_KEYS,
  type BowtieSlotKey,
  isBowtieQuestionType,
  parseBowtieCorrectMapping,
  tryNormalizeBowtiePayload,
} from "@/lib/questions/bowtie-adapter";

export type BowtieQuestionValidationInput = {
  questionType: string | null | undefined;
  stem?: string | null;
  options: unknown;
  correctAnswer: unknown;
  rationale?: string | null;
  topic?: string | null;
  bodySystem?: string | null;
  exam?: string | null;
  questionFormat?: string | null;
  tags?: string[] | null;
  publishMode?: boolean;
  requireRationale?: boolean;
};

export type BowtieQuestionValidationResult = { ok: true } | { ok: false; errors: string[] };

function trimNonEmpty(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function hasBowtieHint(options: unknown): boolean {
  if (!options || typeof options !== "object" || Array.isArray(options)) return false;
  const root = options as Record<string, unknown>;
  const nested =
    root.bowtie && typeof root.bowtie === "object" && !Array.isArray(root.bowtie)
      ? (root.bowtie as Record<string, unknown>)
      : null;
  return (
    trimNonEmpty(root.format)?.toLowerCase() === "bowtie" ||
    trimNonEmpty(nested?.format)?.toLowerCase() === "bowtie" ||
    Array.isArray(root.bank) ||
    Array.isArray(nested?.bank)
  );
}

function bankIds(options: unknown, stem: string | null | undefined, questionType: string | null | undefined): Set<string> {
  const normalized = tryNormalizeBowtiePayload(questionType, stem, options);
  return new Set(normalized?.bank.map((item) => item.id) ?? []);
}

export function isEcgTaggedOrFormatted(input: Pick<BowtieQuestionValidationInput, "questionFormat" | "tags">): boolean {
  const format = trimNonEmpty(input.questionFormat)?.toLowerCase();
  if (format && ["ecg", "ekg", "ecg_video", "video", "video_case", "media", "image_only"].includes(format)) {
    return true;
  }
  return (input.tags ?? []).some((tag) => trimNonEmpty(tag)?.toLowerCase() === "ecg-video");
}

export function validateBowtieQuestionPayload(input: BowtieQuestionValidationInput): BowtieQuestionValidationResult {
  const errors: string[] = [];
  const questionType = input.questionType ?? "";

  if (!isBowtieQuestionType(questionType)) {
    errors.push("Question type is not bowtie-compatible");
  }

  if (!hasBowtieHint(input.options)) {
    errors.push('Bowtie options must use format "bowtie" or include a bowtie bank');
  }

  const normalized = tryNormalizeBowtiePayload(questionType, input.stem, input.options);
  if (!normalized) {
    errors.push("Bowtie options must include a non-empty bank and usable scenario/stem");
  }

  const mapping = parseBowtieCorrectMapping(input.correctAnswer);
  if (!mapping) {
    errors.push("Bowtie correct_answer.correctMapping must include condition, intervention, and monitoring");
  }

  if (mapping) {
    const validIds = bankIds(input.options, input.stem, questionType);
    for (const key of BOWTIE_SLOT_KEYS) {
      validateMappedAnswer(key, mapping[key], validIds, errors);
    }
  }

  if (input.publishMode) {
    if (!trimNonEmpty(input.topic) && !trimNonEmpty(input.bodySystem)) {
      errors.push("Bowtie publish requires topic or body_system");
    }
    if (input.exam && !examQuestionExamPublishAllowlist().has(input.exam)) {
      errors.push("Bowtie publish exam is not in the exam allowlist");
    }
    if (input.requireRationale !== false && !trimNonEmpty(input.rationale)) {
      errors.push("Bowtie publish requires rationale");
    }
    if (isEcgTaggedOrFormatted(input)) {
      errors.push("ECG bowtie questions are excluded from regular publish/practice pools");
    }
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true };
}

function validateMappedAnswer(
  key: BowtieSlotKey,
  answerId: string,
  validIds: Set<string>,
  errors: string[],
): void {
  if (!trimNonEmpty(answerId)) {
    errors.push(`Bowtie ${key} mapping must not be empty`);
    return;
  }
  if (!validIds.has(answerId)) {
    errors.push(`Bowtie ${key} mapping "${answerId}" is not present in bowtie bank`);
  }
}
