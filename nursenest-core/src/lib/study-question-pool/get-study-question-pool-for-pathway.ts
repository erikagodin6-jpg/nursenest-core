import { ContentStatus } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { flashcardAccessWhere } from "@/lib/entitlements/content-access-scope";
import { prisma } from "@/lib/db";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { questionAccessWhereWithPathway } from "@/lib/exam-pathways/pathway-content-scope";
import { flashcardPathwayAccessOptionsFromPathwayId } from "@/lib/flashcards/flashcard-pathway-scope";
import { NON_ECG_PRACTICE_EXAM_WHERE } from "@/lib/practice-tests/cat-pool";
import { generalStudyBankModuleSurfaceWhere } from "@/lib/study-question-pool/study-question-pool-gates";
import { rtVentilatorPremiumBankGateWhere } from "@/lib/rt-ventilator/rt-ventilator-bank-pool-gate";
import { normalizePathwayIdForStudySurfaces } from "@/lib/study-question-pool/study-pathway-normalize";

export type StudyQuestionPoolMode = "cat" | "practice" | "flashcards";

export type StudyQuestionPoolDiagnostics = {
  pathwayId: string;
  normalizedPathwayId: string;
  tier: string;
  mode: StudyQuestionPoolMode;
  dedicatedFlashcardCount: number;
  derivedQuestionCount: number;
  finalAvailableCount: number;
  filtersApplied: string[];
};

/**
 * Source-of-truth snapshot for learner study surfaces: dedicated flashcards plus exam-question
 * bank rows scoped like CAT / practice (pathway exam keys, tier, region, non-ECG, module gates).
 */
export async function getStudyQuestionPoolForPathway(args: {
  entitlement: AccessScope;
  pathwayId: string;
  country: string | null | undefined;
  mode: StudyQuestionPoolMode;
}): Promise<StudyQuestionPoolDiagnostics> {
  const normalizedPathwayId = normalizePathwayIdForStudySurfaces(args.pathwayId, args.country);
  const pathway = getExamPathwayById(normalizedPathwayId) ?? null;
  const filtersApplied = [
    "published_entitlement_scope",
    pathway ? "pathway_exam_keys+tier" : "tier_region_only",
    "non_ecg_general_bank",
    "module_surface_gate",
  ];

  const bankWhere = pathway
    ? {
        AND: [
          questionAccessWhereWithPathway(args.entitlement, pathway),
          NON_ECG_PRACTICE_EXAM_WHERE,
          generalStudyBankModuleSurfaceWhere(),
          rtVentilatorPremiumBankGateWhere(args.entitlement),
        ],
      }
    : null;

  const derivedQuestionCount = bankWhere
    ? await prisma.examQuestion.count({ where: bankWhere })
    : 0;

  const pathwayOpts = flashcardPathwayAccessOptionsFromPathwayId(normalizedPathwayId);
  const dedicatedFlashcardCount = await prisma.flashcard.count({
    where: {
      status: ContentStatus.PUBLISHED,
      AND: [
        flashcardAccessWhere(args.entitlement, pathwayOpts),
        { deck: { pathwayId: normalizedPathwayId } },
      ],
    },
  });

  const finalAvailableCount =
    args.mode === "flashcards" ? dedicatedFlashcardCount + derivedQuestionCount : derivedQuestionCount;

  return {
    pathwayId: args.pathwayId.trim(),
    normalizedPathwayId,
    tier: String(args.entitlement.tier ?? ""),
    mode: args.mode,
    dedicatedFlashcardCount,
    derivedQuestionCount,
    finalAvailableCount,
    filtersApplied,
  };
}
