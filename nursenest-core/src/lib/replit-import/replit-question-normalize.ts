import { randomUUID } from "crypto";
import type { Prisma } from "@prisma/client";
import { stemHash } from "@/lib/content/stem-hash";
import { canonicalExamQuestionExamForDbWrite } from "@/lib/content-quality/exam-question-exam-normalization";
import { adminQuestionTypeToDb } from "@/lib/prisma/exam-question-maps";
import { isBowtieQuestionType } from "@/lib/questions/bowtie-adapter";
import { validateBowtieQuestionPayload } from "@/lib/questions/bowtie-question-schema";
import { scoreHintQuality } from "@/lib/questions/hint-quality-score";
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

function objectJsonFrom(raw: unknown): Prisma.InputJsonValue | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  return raw as Prisma.InputJsonValue;
}

function optionsFrom(raw: Record<string, unknown>, questionType: string): Prisma.InputJsonValue | null {
  if (isBowtieQuestionType(questionType)) {
    const direct = objectJsonFrom(raw.options);
    if (direct) return direct;
    const nested = objectJsonFrom(raw.bowtie);
    if (nested) return { bowtie: nested } as unknown as Prisma.InputJsonValue;
  }
  const direct = asStringArray(raw.options ?? raw.choices ?? raw.answers ?? raw.answerChoices);
  if (direct) return direct;
  const alts = raw.alternatives;
  if (Array.isArray(alts)) return asStringArray(alts);
  return null;
}

function correctAnswerFrom(
  raw: Record<string, unknown>,
  options: Prisma.InputJsonValue,
  questionType: string,
): Prisma.InputJsonValue | null {
  const caRaw = raw.correctAnswer ?? raw.correctAnswers ?? raw.correct_answer;
  if (isBowtieQuestionType(questionType)) {
    const direct = objectJsonFrom(caRaw);
    if (direct) return direct;
    const mapping = objectJsonFrom(raw.correctMapping);
    if (mapping) return { correctMapping: mapping } as unknown as Prisma.InputJsonValue;
  }
  if (caRaw !== undefined) {
    if (Array.isArray(caRaw) && caRaw.length > 0) {
      const allNums = caRaw.every((x) => typeof x === "number" && Number.isInteger(x));
      if (allNums) {
        const texts: string[] = [];
        if (!Array.isArray(options)) return null;
        const optionList = options as unknown[];
        for (const idx of caRaw as number[]) {
          if (idx < 0 || idx >= optionList.length) return null;
          texts.push(String(optionList[idx]));
        }
        return texts as unknown as Prisma.InputJsonValue;
      }
      const arr = asStringArray(caRaw);
      if (arr) return arr as unknown as Prisma.InputJsonValue;
    }
    if (typeof caRaw === "string" || typeof caRaw === "number") {
      return [String(caRaw)] as unknown as Prisma.InputJsonValue;
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
  if (!Array.isArray(options)) return null;
  const optionList = options as unknown[];
  if (typeof idx === "number" && Number.isInteger(idx) && idx >= 0 && idx < optionList.length) {
    return [optionList[idx]] as unknown as Prisma.InputJsonValue;
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

function hintFrom(raw: Record<string, unknown>): string | null {
  const keys = ["hint", "hints", "teachingHint", "teaching_hint"] as const;
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (Array.isArray(value)) {
      const first = value.find((item) => typeof item === "string" && item.trim());
      if (typeof first === "string") return first.trim();
    }
  }
  return null;
}

function textListForHint(value: unknown): string[] {
  if (value == null) return [];
  if (typeof value === "string" || typeof value === "number") return [String(value)];
  if (Array.isArray(value)) return value.flatMap(textListForHint);
  if (typeof value === "object") return Object.values(value as Record<string, unknown>).flatMap(textListForHint);
  return [];
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

  const questionType = questionTypeFrom(o);
  const options = optionsFrom(o, questionType);
  if (!options) return { ok: false, message: "options_invalid" };
  if (!isBowtieQuestionType(questionType) && (!Array.isArray(options) || options.length < 2)) {
    return { ok: false, message: "options_invalid" };
  }

  const correctAnswer = correctAnswerFrom(o, options, questionType);
  if (!correctAnswer) return { ok: false, message: "missing_correct_answer" };

  const allowShortRationale = !ctx.statusPublished;
  const rationale = rationaleFrom(o, allowShortRationale);
  if (!rationale) return { ok: false, message: "missing_rationale" };
  if (ctx.statusPublished && rationale.length < 10) return { ok: false, message: "rationale_too_short_for_publish" };

  const topic = typeof o.topic === "string" ? o.topic.trim() : typeof o.category === "string" ? o.category.trim() : null;
  const bodySystem =
    typeof o.bodySystem === "string"
      ? o.bodySystem.trim()
      : typeof o.body_system === "string"
        ? o.body_system.trim()
        : null;
  const hint = hintFrom(o);
  if (hint) {
    const hintQuality = scoreHintQuality({
      hint,
      stem,
      options: Array.isArray(options) ? options.map(String) : [],
      correctAnswer: textListForHint(correctAnswer),
      pathway: typeof o.exam === "string" ? o.exam : ctx.defaultTrack,
      topic: topic ?? bodySystem,
      questionType,
    });
    if (hintQuality.gate === "hard_fail") {
      return { ok: false, message: `hint_quality_failed:${hintQuality.issues.join(",")}` };
    }
  }

  if (isBowtieQuestionType(questionType)) {
    const bowtie = validateBowtieQuestionPayload({
      questionType,
      stem,
      options,
      correctAnswer,
      rationale,
      topic,
      bodySystem,
      exam: typeof o.exam === "string" ? o.exam : undefined,
      tags: Array.isArray(o.tags) && o.tags.every((x) => typeof x === "string") ? (o.tags as string[]) : [],
      publishMode: ctx.statusPublished,
      requireRationale: true,
    });
    if (!bowtie.ok) return { ok: false, message: bowtie.errors.join("; ") };
  }

  const country = inferCountryFromRaw(o, ctx.defaultCountry);
  const track = inferTrackFromRaw(o, ctx.defaultTrack);
  const mapped = mapTrackAndCountryToExamFields(track, country);

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
    questionType,
    tier: mapped.tier,
    exam: mapped.exam,
    regionScope: mapped.regionScope,
    countryCode: mapped.countryCode,
    careerType: mapped.careerType,
    rationale,
    topic,
    bodySystem,
    tags,
    hint,
    difficulty,
    stemHash: stemHash(stem),
  };

  return { ok: true, row };
}

export function toPrismaCreateInput(
  row: NormalizedExamQuestion,
  statusDb: "draft" | "published",
): Prisma.ExamQuestionCreateManyInput {
  const exam = canonicalExamQuestionExamForDbWrite(row.exam);
  return {
    id: randomUUID(),
    stem: row.stem,
    options: row.options,
    correctAnswer: row.correctAnswer,
    questionType: row.questionType,
    tier: row.tier,
    exam,
    status: statusDb,
    regionScope: row.regionScope,
    stemHash: row.stemHash,
    careerType: row.careerType,
    rationale: row.rationale,
    topic: row.topic ?? undefined,
    bodySystem: row.bodySystem ?? undefined,
    tags: row.hint ? [...row.tags, `hint:${row.hint}`] : row.tags,
    difficulty: row.difficulty,
    countryCode: row.countryCode ?? undefined,
  };
}
