import type { CountryCode } from "@prisma/client";
import {
  buildLessonBankQuizItemsFromOrderedExamRows,
  examRowToLessonBankItem,
  type ExamQuestionMcqRow,
  type LessonBankQuizItem,
} from "@/lib/lessons/exam-question-to-lesson-quiz-item";
import { finalizeLessonBankQuizItemsForUi } from "@/lib/lessons/lesson-quiz-render-contract";

/** Drop reasons for explicit `ExamQuestion` id resolution (server-side diagnostics only). */
export type ExplicitIdDropReason =
  | "missing"
  | "malformed"
  | "inaccessible"
  | "wrong_region"
  | "non_mcq"
  | "duplicate"
  | "finalize_rejected";

export type ExplicitExamQuestionIdLoadDiagnostics = {
  orderedUniqRequestedIds: readonly string[];
  resolvedExamQuestionIds: readonly string[];
  dropped: ReadonlyArray<{ id: string; reason: ExplicitIdDropReason }>;
  /** Configured uniq ids, subscriber access, and zero items after filtering/finalization. */
  zeroResolvedWithSubscriberAccess: boolean;
};

export function regionScopeAllowedForLearnerCountry(
  regionScope: "BOTH" | "CA_ONLY" | "US_ONLY",
  country: CountryCode,
): boolean {
  if (regionScope === "BOTH") return true;
  if (country === "CA") return regionScope === "CA_ONLY";
  return regionScope === "US_ONLY";
}

export type BareIdResolution = "missing" | "wrong_region" | "inaccessible";

/**
 * Resolves ordered explicit ids to renderable lesson bank items using rows already fetched under
 * entitlement + region Prisma `where`. When `bareResolutionById` is supplied, ids missing from the
 * entitlement query are classified without duplicating MCQ mapping rules.
 */
export function resolveExplicitLessonBankQuizItemsWithDiagnostics(args: {
  orderedUniqIds: readonly string[];
  accessibleRowsById: ReadonlyMap<string, ExamQuestionMcqRow>;
  countryCode: CountryCode;
  /** For ids not present in `accessibleRowsById` — from a follow-up bare id+regionScope query (server) or test harness. */
  bareResolutionById?: ReadonlyMap<string, BareIdResolution>;
  duplicateDroppedIds?: readonly string[];
  /** Sanitization / input-shape drops applied before DB resolution (same path as the loader). */
  preResolveDropped?: ReadonlyArray<{ id: string; reason: ExplicitIdDropReason }>;
  hadSubscriberAccess: boolean;
}): { items: LessonBankQuizItem[]; diagnostics: ExplicitExamQuestionIdLoadDiagnostics } {
  const dropped: Array<{ id: string; reason: ExplicitIdDropReason }> = [];
  for (const id of args.duplicateDroppedIds ?? []) {
    dropped.push({ id, reason: "duplicate" });
  }
  for (const d of args.preResolveDropped ?? []) {
    dropped.push(d);
  }

  const built = buildLessonBankQuizItemsFromOrderedExamRows([...args.orderedUniqIds], args.accessibleRowsById);
  const finalized = finalizeLessonBankQuizItemsForUi(built);
  const finalIds = new Set(finalized.map((i) => i.examQuestionId));

  for (const id of args.orderedUniqIds) {
    const row = args.accessibleRowsById.get(id);
    if (!row) {
      const bare = args.bareResolutionById?.get(id);
      if (bare) {
        dropped.push({
          id,
          reason: bare === "missing" ? "missing" : bare === "wrong_region" ? "wrong_region" : "inaccessible",
        });
      }
      continue;
    }
    const mapped = examRowToLessonBankItem(row);
    if (!mapped) {
      dropped.push({ id, reason: "non_mcq" });
      continue;
    }
    if (!finalIds.has(id)) {
      dropped.push({ id, reason: "finalize_rejected" });
    }
  }

  const resolvedExamQuestionIds = finalized.map((i) => i.examQuestionId);
  const diagnostics: ExplicitExamQuestionIdLoadDiagnostics = {
    orderedUniqRequestedIds: args.orderedUniqIds,
    resolvedExamQuestionIds,
    dropped,
    zeroResolvedWithSubscriberAccess:
      args.hadSubscriberAccess && args.orderedUniqIds.length > 0 && finalized.length === 0,
  };

  return { items: finalized, diagnostics };
}
