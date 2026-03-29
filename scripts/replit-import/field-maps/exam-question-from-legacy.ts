/**
 * Typed transforms from legacy Replit / AI export shapes → exam_questions-compatible fields.
 * Source of truth for columns: shared/schema.ts examQuestions.
 */
import { createHash } from "crypto";

export type LegacyExamQuestionItem = {
  stem?: unknown;
  question?: unknown;
  topic?: unknown;
  options?: unknown;
  choices?: unknown;
  rationale?: unknown;
  bodySystem?: unknown;
  body_system?: unknown;
  difficulty?: unknown;
  correctAnswer?: unknown;
  correct_answer?: unknown;
  correct_answers?: unknown;
  questionType?: unknown;
  question_type?: unknown;
  tier?: unknown;
  exam?: unknown;
  careerType?: unknown;
  career_type?: unknown;
  status?: unknown;
};

/**
 * Normalize stem text before hashing so trivial whitespace differences dedupe consistently
 * (same logical question → same stem_hash).
 */
export function normalizeStemForDedupe(stem: string): string {
  return stem.trim().toLowerCase().replace(/\s+/g, " ");
}

export function stemHashHex(stem: string): string {
  return createHash("sha256").update(normalizeStemForDedupe(stem)).digest("hex");
}

function mapDifficulty(d: unknown): number {
  if (typeof d === "number" && Number.isFinite(d)) {
    const n = Math.round(d);
    if (n >= 1 && n <= 5) return n;
  }
  if (typeof d === "string") {
    const x = d.toLowerCase();
    if (x === "easy") return 1;
    if (x === "medium" || x === "moderate") return 3;
    if (x === "hard") return 5;
  }
  return 3;
}

/** Sort object keys so letter options go A→Z, then other keys lexically. */
function sortOptionObjectKeys(keys: string[]): string[] {
  return [...keys].sort((a, b) => {
    const ta = a.trim();
    const tb = b.trim();
    const ua = ta.toUpperCase();
    const ub = tb.toUpperCase();
    const letterA = /^[A-Z]$/.test(ua);
    const letterB = /^[A-Z]$/.test(ub);
    if (letterA && letterB) return ua.localeCompare(ub);
    if (letterA && !letterB) return -1;
    if (!letterA && letterB) return 1;
    return ua.localeCompare(ub);
  });
}

/** If text already begins with "A."-style prefix matching label, strip it (avoid "A. A. ..."). */
function stripDuplicateLabelPrefix(text: string, labelUpper: string): string {
  const t = text.trim();
  const re = new RegExp(`^\\s*${labelUpper.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\.\\s*`, "i");
  return t.replace(re, "").trim();
}

/**
 * Normalize options to JSON-serializable array for exam_questions.options jsonb.
 * Supports arrays (unchanged) and plain objects like { "A": "...", "B": "..." }.
 */
export function normalizeOptionsForExamQuestion(raw: unknown): { options: unknown[]; error?: string } {
  if (!raw) return { options: [], error: "missing_options" };
  if (Array.isArray(raw)) {
    const out = raw.map((o) => {
      if (typeof o === "string") return { label: "", text: o };
      if (o && typeof o === "object") return o;
      return { label: "", text: String(o) };
    });
    return { options: out };
  }
  if (typeof raw === "object" && raw !== null && !Array.isArray(raw)) {
    const rec = raw as Record<string, unknown>;
    const keys = Object.keys(rec).filter((k) => rec[k] !== undefined && rec[k] !== null);
    if (keys.length === 0) return { options: [], error: "missing_options" };
    const sorted = sortOptionObjectKeys(keys);
    const out: { label: string; text: string }[] = [];
    for (const k of sorted) {
      const label = k.trim().toUpperCase();
      const v = rec[k];
      let text =
        typeof v === "string" ? v.trim() : typeof v === "number" || typeof v === "boolean" ? String(v).trim() : "";
      if (text === "") continue;
      text = stripDuplicateLabelPrefix(text, label);
      out.push({ label, text });
    }
    if (out.length < 2) return { options: [], error: "need_at_least_two_options" };
    return { options: out };
  }
  return { options: [], error: "options_unsupported_shape" };
}

export function normalizeCorrectAnswer(raw: LegacyExamQuestionItem): unknown[] {
  const v = raw.correctAnswer ?? raw.correct_answer ?? raw.correct_answers;
  if (Array.isArray(v)) return v;
  if (v === undefined || v === null) return [];
  return [v];
}

export type MappedExamQuestion = {
  tier: string;
  exam: string;
  questionType: string;
  status: string;
  stem: string;
  options: unknown[];
  correctAnswer: unknown[];
  rationale: string | null;
  difficulty: number;
  bodySystem: string | null;
  topic: string | null;
  careerType: string;
  regionScope: string;
  stemHash: string;
  sourceVersion: number;
};

export function mapLegacyItemToExamQuestion(row: Record<string, unknown>): {
  ok: boolean;
  errors: string[];
  value?: MappedExamQuestion;
} {
  const errors: string[] = [];
  const L = row as unknown as LegacyExamQuestionItem;
  const stem = typeof L.stem === "string" ? L.stem : typeof L.question === "string" ? L.question : "";
  if (!stem || stem.length < 5) errors.push("stem_too_short_or_missing");

  const { options, error: optErr } = normalizeOptionsForExamQuestion(L.options ?? L.choices);
  if (optErr || options.length < 2) errors.push(optErr || "need_at_least_two_options");

  const tierRaw = typeof L.tier === "string" ? L.tier.trim() : "";
  if (!tierRaw) {
    errors.push("missing_tier");
  }

  const examRaw = typeof L.exam === "string" ? L.exam.trim() : "";
  if (!examRaw) {
    errors.push("missing_exam");
  }

  if (errors.length) return { ok: false, errors };

  const tier = tierRaw;
  const exam = examRaw;
  const questionType =
    typeof L.questionType === "string"
      ? L.questionType
      : typeof L.question_type === "string"
        ? L.question_type
        : "multiple_choice";
  const status = typeof L.status === "string" ? L.status : "draft";
  const rationale = typeof L.rationale === "string" ? L.rationale : null;
  const bodySystem =
    typeof L.bodySystem === "string"
      ? L.bodySystem
      : typeof L.body_system === "string"
        ? L.body_system
        : null;
  const topic = typeof L.topic === "string" ? L.topic : null;
  const careerType = typeof L.careerType === "string" ? L.careerType : typeof L.career_type === "string" ? L.career_type : "nursing";

  const value: MappedExamQuestion = {
    tier,
    exam,
    questionType,
    status,
    stem,
    options,
    correctAnswer: normalizeCorrectAnswer(L),
    rationale,
    difficulty: mapDifficulty(L.difficulty),
    bodySystem,
    topic,
    careerType,
    regionScope: "BOTH",
    stemHash: stemHashHex(stem),
    sourceVersion: 1,
  };

  return { ok: true, errors: [], value };
}

/**
 * Unpack ai_cache.output_json: may be a single object or an array of question objects.
 */
export function* iterateAiCacheOutputItems(outputJson: unknown): Generator<Record<string, unknown>> {
  if (outputJson === null || outputJson === undefined) return;
  if (Array.isArray(outputJson)) {
    for (const item of outputJson) {
      if (item && typeof item === "object" && !Array.isArray(item)) {
        yield item as Record<string, unknown>;
      }
    }
    return;
  }
  if (typeof outputJson === "object") {
    yield outputJson as Record<string, unknown>;
  }
}
