import "server-only";

import type { CountryCode, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { questionAccessWhere } from "@/lib/entitlements/content-access-scope";
import type { ExamQuestionMcqRow, LessonBankQuizItem } from "@/lib/lessons/exam-question-to-lesson-quiz-item";
import type { ExplicitQuestionIdDrop } from "@/lib/lessons/lesson-explicit-exam-question-drops";
import {
  type BareIdResolution,
  type ExplicitExamQuestionIdLoadDiagnostics,
  type ExplicitIdDropReason,
  resolveExplicitLessonBankQuizItemsWithDiagnostics,
  regionScopeAllowedForLearnerCountry,
} from "@/lib/lessons/lesson-explicit-exam-question-resolution-pipeline";
const MAX_IDS = 40;

type ExamRow = {
  id: string;
  stem: string;
  options: Prisma.JsonValue;
  correctAnswer: Prisma.JsonValue;
  questionType: string;
  rationale: string | null;
  difficulty: number | null;
};

function regionWhereForCountry(country: CountryCode): Prisma.ExamQuestionWhereInput {
  return {
    OR: [{ regionScope: "BOTH" }, { regionScope: country === "CA" ? "CA_ONLY" : "US_ONLY" }],
  };
}

export type LoadLessonBankQuizItemsByExamIdsContext = {
  pathwayId?: string;
  lessonSlug?: string;
  phase?: "pre" | "post" | "study_loop_combined";
};

export type LessonBankQuizItemsByExamIdsResult = {
  items: LessonBankQuizItem[];
  diagnostics: ExplicitExamQuestionIdLoadDiagnostics;
};

async function resolveBareIdOutcomes(
  notInAccessible: string[],
  countryCode: CountryCode,
): Promise<Map<string, BareIdResolution>> {
  const out = new Map<string, BareIdResolution>();
  if (!notInAccessible.length) return out;

  const bareRows = await withDatabaseFallback(
    () =>
      prisma.examQuestion.findMany({
        where: { id: { in: notInAccessible } },
        select: { id: true, regionScope: true },
      }),
    [] as Array<{ id: string; regionScope: "BOTH" | "CA_ONLY" | "US_ONLY" }>,
  );

  const bareById = new Map(bareRows.map((r) => [r.id, r]));
  const regionScopeForBare = (v: string | null | undefined): "BOTH" | "CA_ONLY" | "US_ONLY" =>
    v === "CA_ONLY" || v === "US_ONLY" || v === "BOTH" ? v : "BOTH";

  for (const id of notInAccessible) {
    const br = bareById.get(id);
    if (!br) {
      out.set(id, "missing");
    } else if (!regionScopeAllowedForLearnerCountry(regionScopeForBare(br.regionScope), countryCode)) {
      out.set(id, "wrong_region");
    } else {
      out.set(id, "inaccessible");
    }
  }
  return out;
}

/**
 * Load MCQ-shaped bank items for explicit `ExamQuestion` ids (lesson pre/post / study loop).
 * Preserves caller order; skips ids the subscriber cannot access or that are not MCQ-mappable.
 * Returns diagnostics for internal logging only (never expose to learners).
 */
export async function loadLessonBankQuizItemsByExamIds(args: {
  entitlement: AccessScope;
  countryCode: CountryCode;
  ids: string[];
  context?: LoadLessonBankQuizItemsByExamIdsContext;
}): Promise<LessonBankQuizItemsByExamIdsResult> {
  const duplicateDroppedIds: string[] = [];
  const preResolveDropped: Array<{ id: string; reason: ExplicitIdDropReason }> = [];
  const uniq: string[] = [];
  const seen = new Set<string>();
  for (const raw of args.ids) {
    if (typeof raw !== "string") {
      if (raw !== undefined && raw !== null) {
        preResolveDropped.push({ id: "<non_string_input>", reason: "malformed" });
      }
      continue;
    }
    const trimmed = raw.trim();
    const id = trimmed;
    if (trimmed.length > 0 && (id.length < 8 || id.length > 80)) {
      preResolveDropped.push({ id: id.slice(0, 80), reason: "malformed" });
      continue;
    }
    if (id.length < 8 || id.length > 80) continue;
    if (seen.has(id)) {
      duplicateDroppedIds.push(id);
      continue;
    }
    seen.add(id);
    uniq.push(id);
    if (uniq.length >= MAX_IDS) break;
  }

  if (!args.entitlement.hasAccess) {
    return {
      items: [],
      diagnostics: {
        orderedUniqRequestedIds: uniq,
        resolvedExamQuestionIds: [],
        dropped: [...preResolveDropped],
        zeroResolvedWithSubscriberAccess: false,
      },
    };
  }

  if (!uniq.length) {
    const hadRaw = args.ids.some((x) => typeof x === "string" && x.trim().length > 0);
    const hadNonString = args.ids.some((x) => typeof x !== "string" && x !== undefined && x !== null);
    return {
      items: [],
      diagnostics: {
        orderedUniqRequestedIds: uniq,
        resolvedExamQuestionIds: [],
        dropped: [...preResolveDropped],
        zeroResolvedWithSubscriberAccess: hadRaw || hadNonString || preResolveDropped.length > 0,
      },
    };
  }

  const rows = await withDatabaseFallback(
    () =>
      prisma.examQuestion.findMany({
        where: {
          AND: [questionAccessWhere(args.entitlement), { id: { in: uniq } }, regionWhereForCountry(args.countryCode)],
        },
        select: {
          id: true,
          stem: true,
          options: true,
          correctAnswer: true,
          questionType: true,
          rationale: true,
          difficulty: true,
        },
      }),
    [] as ExamRow[],
  );

  const byId = new Map<string, ExamRow>(rows.map((r) => [r.id, r]));
  const notInAccessible = uniq.filter((id) => !byId.has(id));
  const bareResolutionById = await resolveBareIdOutcomes(notInAccessible, args.countryCode);

  const { items, diagnostics } = resolveExplicitLessonBankQuizItemsWithDiagnostics({
    orderedUniqIds: uniq,
    accessibleRowsById: byId as ReadonlyMap<string, ExamQuestionMcqRow>,
    countryCode: args.countryCode,
    bareResolutionById,
    duplicateDroppedIds,
    preResolveDropped,
    hadSubscriberAccess: true,
  });

  return { items, diagnostics };
}

export type LessonExplicitExamQuestionLoadDiagnostics = {
  drops: ExplicitQuestionIdDrop[];
  requestedOrderedIds: string[];
  resolvedIds: string[];
};

function mapDropReason(r: ExplicitIdDropReason): ExplicitQuestionIdDrop["reason"] {
  if (r === "finalize_rejected") return "finalize_drop";
  return r as ExplicitQuestionIdDrop["reason"];
}

export function toLessonExplicitDiagnostics(d: ExplicitExamQuestionIdLoadDiagnostics): LessonExplicitExamQuestionLoadDiagnostics {
  return {
    drops: d.dropped.map((x) => ({ id: x.id, reason: mapDropReason(x.reason) })),
    requestedOrderedIds: [...d.orderedUniqRequestedIds],
    resolvedIds: [...d.resolvedExamQuestionIds],
  };
}

/**
 * Same as {@link loadLessonBankQuizItemsByExamIds} with diagnostics shaped for assessment logging.
 */
export async function loadLessonBankQuizItemsByExamIdsWithDiagnostics(args: {
  entitlement: AccessScope;
  countryCode: CountryCode;
  ids: string[];
  logContext?: { pathwayId: string; lessonSlug: string; side: "pre" | "post" | "study_loop_combined" };
}): Promise<{ items: LessonBankQuizItem[]; diagnostics: LessonExplicitExamQuestionLoadDiagnostics }> {
  const res = await loadLessonBankQuizItemsByExamIds({
    entitlement: args.entitlement,
    countryCode: args.countryCode,
    ids: args.ids,
    context: args.logContext
      ? {
          pathwayId: args.logContext.pathwayId,
          lessonSlug: args.logContext.lessonSlug,
          phase: args.logContext.side,
        }
      : undefined,
  });
  return { items: res.items, diagnostics: toLessonExplicitDiagnostics(res.diagnostics) };
}

export {
  isExplicitQuestionIdsDebugLoggingEnabled,
  logExplicitExamQuestionLoadOutcome,
} from "@/lib/lessons/lesson-explicit-exam-question-observability";

/** Back-compat: assessment code references singular `Id` in the env helper name. */
export { isExplicitQuestionIdDebugLoggingEnabled } from "@/lib/lessons/lesson-explicit-exam-question-observability";
