import "server-only";

import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { getStudyCountsByCategoryFromBuilder, getStudyCountsByCategoryFromDiscovery } from "@/lib/study/study-category-hub";
import { buildGlobalExamContext } from "@/lib/exam-context/exam-registry";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { subscriptionCoversPathwayBase } from "@/lib/exam-pathways/pathway-entitlements";
import { buildFlashcardCustomSession } from "@/lib/flashcards/build-flashcard-custom-session";
import { builderCategoryOptionsForPathway } from "@/lib/flashcards/flashcard-builder-taxonomy";
import { parseCustomSessionSourceKind } from "@/lib/flashcards/custom-session-card-filters";
import { loadSubscriberDiscoveryAggregates } from "@/lib/questions/subscriber-discovery-aggregates";
import { CANONICAL_STUDY_CATEGORIES, type CanonicalStudyCategoryId } from "@/lib/study/normalize-study-category";

export type StudyToolsInventoryOk = {
  ok: true;
  pathwayId: string;
  countsByCanonical: Record<CanonicalStudyCategoryId, number>;
};

export type StudyToolsInventoryFail = {
  ok: false;
  code: "invalid_pathway" | "pathway_not_covered";
  message: string;
};

/**
 * Canonical category counts for the study-tool hub: exam-bank discovery + flashcard builder (same model as flashcards hub).
 */
export async function buildStudyToolsInventory(
  userId: string,
  entitlement: AccessScope,
  pathwayId: string,
): Promise<StudyToolsInventoryOk | StudyToolsInventoryFail> {
  const pathway = getExamPathwayById(pathwayId.trim());
  if (!pathway) {
    return { ok: false, code: "invalid_pathway", message: "Unknown pathwayId." };
  }
  if (!subscriptionCoversPathwayBase(entitlement, pathway)) {
    return { ok: false, code: "pathway_not_covered", message: "Pathway is not covered by this account." };
  }

  const examContext = buildGlobalExamContext(pathway.id, "en");
  const { topicRows } = await loadSubscriberDiscoveryAggregates(entitlement, examContext);
  const buckets = topicRows.map((r) => ({ topic: r.topic ?? "Unknown", count: Number(r.cnt) }));
  const qCounts = getStudyCountsByCategoryFromDiscovery(pathway.id, buckets);

  const zeroBuilder = builderCategoryOptionsForPathway(pathway.id).map((c) => ({ id: c.id, title: c.title, count: 0 }));
  let fCounts = getStudyCountsByCategoryFromBuilder(pathway.id, zeroBuilder);
  try {
    const inv = await buildFlashcardCustomSession({
      userId,
      entitlement,
      pathwayId: pathway.id,
      selectedCategories: [],
      stateIds: [],
      weakOnly: false,
      incorrectOnly: false,
      starredOnly: false,
      savedOnly: false,
      notesOnly: false,
      revisitOnly: false,
      notStudiedOnly: false,
      recentStudiedOnly: false,
      recentDays: 7,
      shuffle: false,
      mode: "mixed",
      limit: 12,
      includeCards: false,
      sourceKind: parseCustomSessionSourceKind("all"),
      sessionSeed: null,
      cardLimitRaw: "12",
    });
    if (inv.ok) {
      fCounts = getStudyCountsByCategoryFromBuilder(
        pathway.id,
        inv.categoryOptions.map((c) => ({ id: c.id, title: c.title, count: c.count })),
      );
    }
  } catch {
    /* flashcard inventory is optional — question discovery still powers tools */
  }

  const merged = Object.fromEntries(CANONICAL_STUDY_CATEGORIES.map((c) => [c.id, 0])) as Record<
    CanonicalStudyCategoryId,
    number
  >;
  for (const c of CANONICAL_STUDY_CATEGORIES) {
    merged[c.id] = (qCounts[c.id] ?? 0) + (fCounts[c.id] ?? 0);
  }

  return { ok: true, pathwayId: pathway.id, countsByCanonical: merged };
}
