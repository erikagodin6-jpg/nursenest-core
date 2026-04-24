import type { Prisma } from "@prisma/client";

import { stemHash } from "@/lib/content/stem-hash";
import { buildGlobalExamContext } from "@/lib/exam-context/exam-registry";
import { examQuestionPoolWhereForContext } from "@/lib/exam-context/query-scope";
import { assertPathwayAllowed } from "@/lib/legacy/legacy-public-content-merge";
import type { LegacyExamQuestionExportRow } from "@/lib/legacy/legacy-lessons-practice-types";
import { adminQuestionTypeToDb } from "@/lib/prisma/exam-question-maps";

export type ResolvedExamQuestionScope = {
  pathwayId: string;
  exam: string;
  tier: string;
  countryCode: string;
  regionScope: "BOTH" | "CA_ONLY" | "US_ONLY";
};

function normalizeExamKey(raw: string): string {
  return raw.trim();
}

function tierMatchesPool(poolTier: string): string {
  return poolTier.trim().toLowerCase();
}

/** Resolves `exam` + `tier` strings for `exam_questions` from pathway + optional legacy hints. */
export function resolveExamQuestionScope(
  pathwayId: string,
  legacyExam?: string,
  legacyTier?: string,
): ResolvedExamQuestionScope | { error: string } {
  try {
    assertPathwayAllowed(pathwayId);
  } catch (e) {
    return { error: String(e) };
  }
  const ctx = buildGlobalExamContext(pathwayId, "en");
  if (!ctx) return { error: `Unknown pathway: ${pathwayId}` };
  const pool = examQuestionPoolWhereForContext(ctx);
  const examCandidates = pool.examIn.length > 0 ? pool.examIn : [ctx.exam];
  const tierCandidates = pool.tierMatches.map((t) => t.toLowerCase());

  let exam = examCandidates[0]!;
  if (legacyExam?.trim()) {
    const want = normalizeExamKey(legacyExam);
    const hit = examCandidates.find((e) => e.toLowerCase() === want.toLowerCase());
    if (!hit) {
      return {
        error: `legacy_exam_not_in_pathway_pool:${pathwayId}:${want}:${examCandidates.join(",")}`,
      };
    }
    exam = hit;
  }

  let tier = tierCandidates[0] ?? "rn";
  if (legacyTier?.trim()) {
    const want = legacyTier.trim().toLowerCase();
    if (!tierCandidates.includes(want)) {
      return {
        error: `legacy_tier_not_in_pathway_pool:${pathwayId}:${want}:${tierCandidates.join(",")}`,
      };
    }
    tier = want;
  }

  const regionScope: ResolvedExamQuestionScope["regionScope"] =
    ctx.country === "CA" ? "CA_ONLY" : ctx.country === "US" ? "US_ONLY" : "BOTH";

  return {
    pathwayId,
    exam,
    tier: tierMatchesPool(tier),
    countryCode: ctx.country,
    regionScope,
  };
}

/** Returns true when an existing row's exam+tier is compatible with the pathway pool (prevents cross-pool hijacks). */
export function existingExamQuestionMatchesPathwayScope(
  pathwayId: string,
  rowExam: string,
  rowTier: string,
): boolean {
  const ctx = buildGlobalExamContext(pathwayId, "en");
  if (!ctx) return false;
  const pool = examQuestionPoolWhereForContext(ctx);
  const examOk = pool.examIn.length === 0 ? true : pool.examIn.some((e) => e.toLowerCase() === rowExam.toLowerCase());
  const tierOk = pool.tierMatches.some((t) => t.toLowerCase() === rowTier.toLowerCase());
  return examOk && tierOk;
}

export function normalizeOptionsArray(raw: unknown[]): string[] {
  const out: string[] = [];
  for (const o of raw) {
    if (typeof o === "string") out.push(o.trim());
    else if (typeof o === "number" && Number.isFinite(o)) out.push(String(o));
  }
  return out.filter(Boolean);
}

/**
 * Normalizes legacy correct answers to DB shape: array of option strings present in `options`.
 * Accepts legacy array of strings, single string, or numeric indices (0-based).
 */
export function normalizeCorrectAnswerStrings(
  raw: unknown,
  options: string[],
  questionTypeUpper: string,
): { ok: true; value: string[] } | { ok: false; error: string } {
  const isSata = questionTypeUpper === "SATA" || questionTypeUpper.includes("SELECT_ALL");
  const pick: string[] = [];

  const pushIfOption = (s: string) => {
    const idx = options.findIndex((o) => o === s);
    if (idx >= 0) pick.push(options[idx]!);
  };

  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (typeof item === "string") pushIfOption(item.trim());
      else if (typeof item === "number" && Number.isInteger(item) && item >= 0 && item < options.length) {
        pick.push(options[item]!);
      }
    }
  } else if (typeof raw === "string") {
    pushIfOption(raw.trim());
  } else if (typeof raw === "number" && Number.isInteger(raw) && raw >= 0 && raw < options.length) {
    pick.push(options[raw]!);
  }

  const uniq = [...new Set(pick)];
  if (uniq.length === 0) return { ok: false, error: "correct_answer_empty" };
  if (!isSata && uniq.length !== 1) return { ok: false, error: "mcq_requires_single_correct_answer" };
  return { ok: true, value: uniq };
}

export function legacyQuestionStemHash(row: LegacyExamQuestionExportRow): string {
  return stemHash(row.stem);
}

export function statusForLegacyQuestion(row: LegacyExamQuestionExportRow): string {
  const s = row.status?.trim().toLowerCase();
  if (s === "published" || s === "live") return "published";
  if (row.access === "public" || row.access === "demo") return "published";
  if (row.access === "subscriber") return "draft";
  return s && s.length > 0 ? s : "draft";
}

export type ExamQuestionPatch = {
  stem?: string;
  options?: Prisma.InputJsonValue;
  correctAnswer?: Prisma.InputJsonValue;
  questionType?: string;
  rationale?: string | null;
  topic?: string | null;
  bodySystem?: string | null;
  difficulty?: number | null;
  status?: string | null;
  stemHash?: string;
  exam?: string;
  tier?: string;
  regionScope?: string;
  publishedAt?: Date | null;
};

function jsonStable(a: unknown, b: unknown): boolean {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

export function buildExamQuestionPatchFromLegacy(
  row: LegacyExamQuestionExportRow,
  scope: ResolvedExamQuestionScope,
  existing: {
    stem: string;
    exam: string;
    tier: string;
    regionScope: string | null;
    rationale: string | null;
    options: Prisma.JsonValue | null;
    correctAnswer: Prisma.JsonValue | null;
    questionType: string;
    difficulty: number | null;
    topic: string | null;
    bodySystem: string | null;
    status: string | null;
  },
  opts: { overwriteRationale: boolean },
): { data: Prisma.ExamQuestionUpdateInput; notes: string[] } | { skip: true; reason: string } {
  const notes: string[] = [];
  const qTypeUpper = row.questionType?.trim().toUpperCase() || "MCQ";
  const options = normalizeOptionsArray(Array.isArray(row.options) ? row.options : []);
  if (options.length < 2) return { skip: true, reason: "options_too_few" };

  const ca = normalizeCorrectAnswerStrings(row.correctAnswer, options, qTypeUpper);
  if (!ca.ok) return { skip: true, reason: ca.error };

  const data: Prisma.ExamQuestionUpdateInput = {};
  const nextStem = row.stem.trim();
  if (nextStem && nextStem !== existing.stem) {
    data.stem = nextStem;
    data.stemHash = stemHash(nextStem);
    notes.push("stem_updated");
  }
  const optJson = options as Prisma.InputJsonValue;
  if (!jsonStable(optJson, existing.options)) {
    data.options = optJson;
    notes.push("options_updated");
  }
  const caJson = ca.value as Prisma.InputJsonValue;
  if (!jsonStable(caJson, existing.correctAnswer)) {
    data.correctAnswer = caJson;
    notes.push("correct_answer_updated");
  }
  const dbQType = adminQuestionTypeToDb(qTypeUpper);
  if (dbQType !== existing.questionType) {
    data.questionType = dbQType;
    notes.push("question_type_updated");
  }

  const nextRat = row.rationale?.trim() ?? "";
  if (opts.overwriteRationale) {
    if (nextRat && nextRat !== (existing.rationale ?? "")) {
      data.rationale = nextRat;
      notes.push("rationale_updated");
    }
  } else if (!(existing.rationale && existing.rationale.trim().length > 0) && nextRat) {
    data.rationale = nextRat;
    notes.push("rationale_filled_empty_only");
  }

  if (row.topic?.trim() && row.topic.trim() !== (existing.topic ?? "")) {
    data.topic = row.topic.trim();
    notes.push("topic_updated");
  }
  if (row.bodySystem?.trim() && row.bodySystem.trim() !== (existing.bodySystem ?? "")) {
    data.bodySystem = row.bodySystem.trim();
    notes.push("body_system_updated");
  }
  if (typeof row.difficulty === "number" && Number.isFinite(row.difficulty) && row.difficulty !== existing.difficulty) {
    data.difficulty = row.difficulty;
    notes.push("difficulty_updated");
  }

  const nextStatus = statusForLegacyQuestion(row);
  const curStatus = (existing.status ?? "").toLowerCase();
  if (nextStatus !== curStatus) {
    data.status = nextStatus;
    notes.push("status_updated");
    data.publishedAt = nextStatus === "published" ? new Date() : null;
  }

  if (scope.exam.toLowerCase() !== existing.exam.toLowerCase()) {
    data.exam = scope.exam;
    notes.push("exam_aligned_to_pathway");
  }
  if (scope.tier.toLowerCase() !== existing.tier.toLowerCase()) {
    data.tier = scope.tier;
    notes.push("tier_aligned_to_pathway");
  }
  if ((existing.regionScope ?? "BOTH") !== scope.regionScope) {
    data.regionScope = scope.regionScope;
    notes.push("region_scope_aligned");
  }

  if (Object.keys(data).length === 0) return { skip: true, reason: "no_changes" };
  return { data, notes };
}

export function buildExamQuestionCreateData(
  row: LegacyExamQuestionExportRow,
  scope: ResolvedExamQuestionScope,
  id: string,
): { data: Prisma.ExamQuestionCreateInput } | { error: string } {
  const qTypeUpper = row.questionType?.trim().toUpperCase() || "MCQ";
  const options = normalizeOptionsArray(Array.isArray(row.options) ? row.options : []);
  if (options.length < 2) return { error: "options_too_few" };
  const ca = normalizeCorrectAnswerStrings(row.correctAnswer, options, qTypeUpper);
  if (!ca.ok) return { error: ca.error };
  const stem = row.stem.trim();
  if (!stem) return { error: "empty_stem" };

  const status = statusForLegacyQuestion(row);
  return {
    data: {
      id,
      tier: scope.tier,
      exam: scope.exam,
      questionType: adminQuestionTypeToDb(qTypeUpper),
      status,
      stem,
      options: options as Prisma.InputJsonValue,
      correctAnswer: ca.value as Prisma.InputJsonValue,
      rationale: row.rationale?.trim() || "Legacy import — rationale pending editorial pass.",
      difficulty: typeof row.difficulty === "number" && Number.isFinite(row.difficulty) ? row.difficulty : 3,
      topic: row.topic?.trim() || null,
      bodySystem: row.bodySystem?.trim() || null,
      stemHash: stemHash(stem),
      regionScope: scope.regionScope,
      countryCode: scope.countryCode,
      publishedAt: status === "published" ? new Date() : null,
    },
  };
}
