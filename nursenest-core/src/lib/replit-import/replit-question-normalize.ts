import { randomUUID } from "crypto";
import type { Prisma } from "@prisma/client";
import { stemHash } from "@/lib/content/stem-hash";
import { adminQuestionTypeToDb } from "@/lib/prisma/exam-question-maps";
import { inferCountryFromRaw, inferTrackFromRaw, mapTrackAndCountryToExamFields } from "./replit-exam-country-map";
import type { ImportCountry, NormalizedExamQuestion, ProductTrack } from "./replit-question-types";

function asStringArray(v: unknown): string[] | null {
  if (!Array.isArray(v)) return null;
  const out: string[] = [];
  for (const x of v) {
    if (typeof x === "string") out.push(x.trim());
    else if (typeof x === "number" && Number.isFinite(x)) out.push(String(x));
    else return null;
  }
  return out.length > 0 ? out : null;
}

function stemFrom(raw: Record<string, unknown>): string | null {
  const keys = ["stem", "question", "questionText", "prompt", "stemText", "body"] as const;
  for (const k of keys) {
    const v = raw[k];
    if (typeof v === "string" && v.trim().length >= 5) return v.trim();
  }
  return null;
}

function optionsFrom(raw: Record<string, unknown>): string[] | null {
  const direct = asStringArray(raw.options ?? raw.choices ?? raw.answers ?? raw.answerChoices);
  if (direct) return direct;
  const alts = raw.alternatives;
  if (Array.isArray(alts)) return asStringArray(alts);
  return null;
}

function correctAnswerFrom(raw: Record<string, unknown>, options: string[]): Prisma.InputJsonValue | null {
  if (raw.correctAnswer !== undefined || raw.correctAnswers !== undefined) {
    const ca = raw.correctAnswer ?? raw.correctAnswers;
    if (Array.isArray(ca)) {
      const arr = asStringArray(ca);
      if (arr) return arr as unknown as Prisma.InputJsonValue;
    }
    if (typeof ca === "string" || typeof ca === "number") {
      return [String(ca)] as unknown as Prisma.InputJsonValue;
    }
  }
  if (typeof raw.answerKey === "string" || typeof raw.answerKey === "number") {
    return [String(raw.answerKey)] as unknown as Prisma.InputJsonValue;
  }
  if (Array.isArray(raw.answerKey)) {
    const arr = asStringArray(raw.answerKey);
    if (arr) return arr as unknown as Prisma.InputJsonValue;
  }
  const idx = raw.correctIndex ?? raw.correct_index ?? raw.answerIndex;
  if (typeof idx === "number" && Number.isInteger(idx) && idx >= 0 && idx < options.length) {
    return [options[idx]] as unknown as Prisma.InputJsonValue;
  }
  return null;
}

function questionTypeFrom(raw: Record<string, unknown>): string {
  const t = raw.questionType ?? raw.type ?? raw.question_type;
  if (typeof t !== "string" || !t.trim()) return "multiple_choice";
  return adminQuestionTypeToDb(t);
}

function rationaleFrom(raw: Record<string, unknown>, allowPlaceholder: boolean): string | null {
  const keys = ["rationale", "explanation", "answerRationale", "answer_rationale", "discussion"] as const;
  for (const k of keys) {
    const v = raw[k];
    if (typeof v === "string" && v.trim().length >= 3) return v.trim();
  }
  if (allowPlaceholder) {
    return "Imported from Replit export; rationale pending editorial review.";
  }
  return null;
}

export type NormalizeOk = { ok: true; row: NormalizedExamQuestion };
export type NormalizeErr = { ok: false; message: string };

export function normalizeRawQuestionRecord(
  raw: unknown,
  ctx: {
    defaultCountry: ImportCountry;
    defaultTrack: ProductTrack;
    statusPublished: boolean;
  },
): NormalizeOk | NormalizeErr {
  if (!raw || typeof raw !== "object") return { ok: false, message: "not_an_object" };
  const o = raw as Record<string, unknown>;

  const stem = stemFrom(o);
  if (!stem) return { ok: false, message: "missing_stem" };

  const options = optionsFrom(o);
  if (!options || options.length < 2) return { ok: false, message: "options_invalid" };

  const correctAnswer = correctAnswerFrom(o, options);
  if (!correctAnswer) return { ok: false, message: "missing_correct_answer" };

  const allowShortRationale = !ctx.statusPublished;
  const rationale = rationaleFrom(o, allowShortRationale);
  if (!rationale) return { ok: false, message: "missing_rationale" };
  if (ctx.statusPublished && rationale.length < 10) return { ok: false, message: "rationale_too_short_for_publish" };

  const country = inferCountryFromRaw(o, ctx.defaultCountry);
  const track = inferTrackFromRaw(o, ctx.defaultTrack);
  const mapped = mapTrackAndCountryToExamFields(track, country);

  const topic = typeof o.topic === "string" ? o.topic.trim() : typeof o.category === "string" ? o.category.trim() : null;
  const bodySystem =
    typeof o.bodySystem === "string"
      ? o.bodySystem.trim()
      : typeof o.body_system === "string"
        ? o.body_system.trim()
        : null;

  const tagsRaw = o.tags;
  const tags =
    Array.isArray(tagsRaw) && tagsRaw.every((x) => typeof x === "string")
      ? (tagsRaw as string[]).map((t) => t.trim()).filter(Boolean)
      : [];

  let difficulty = 3;
  const d = o.difficulty;
  if (typeof d === "number" && Number.isFinite(d)) {
    difficulty = Math.min(5, Math.max(1, Math.round(d)));
  }

  const row: NormalizedExamQuestion = {
    stem,
    options: options as unknown as Prisma.InputJsonValue,
    correctAnswer,
    questionType: questionTypeFrom(o),
    tier: mapped.tier,
    exam: mapped.exam,
    regionScope: mapped.regionScope,
    countryCode: mapped.countryCode,
    careerType: mapped.careerType,
    rationale,
    topic,
    bodySystem,
    tags,
    difficulty,
    stemHash: stemHash(stem),
  };

  return { ok: true, row };
}

export function toPrismaCreateInput(
  row: NormalizedExamQuestion,
  statusDb: "draft" | "published",
): Prisma.ExamQuestionCreateManyInput {
  return {
    id: randomUUID(),
    stem: row.stem,
    options: row.options,
    correctAnswer: row.correctAnswer,
    questionType: row.questionType,
    tier: row.tier,
    exam: row.exam,
    status: statusDb,
    regionScope: row.regionScope,
    stemHash: row.stemHash,
    careerType: row.careerType,
    rationale: row.rationale,
    topic: row.topic ?? undefined,
    bodySystem: row.bodySystem ?? undefined,
    tags: row.tags,
    difficulty: row.difficulty,
    countryCode: row.countryCode ?? undefined,
  };
}
