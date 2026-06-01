import "server-only";

import { collectMergedLessonVirtualFlashcardsForPathway } from "@/lib/flashcards/lesson-linked-virtual-flashcards-aggregator";
import type {
  BuildFlashcardCustomSessionSuccess,
  CustomSessionSerializedCard,
} from "@/lib/flashcards/build-flashcard-custom-session";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const MAX_CATALOG_FALLBACK_CARDS = 40;

/**
 * Builds a minimal valid flashcard session from catalog JSON alone — no DB required.
 * Virtual cards are derived from lesson section content already present on disk.
 * Used as the tertiary fallback when both primary DB and secondary session cache fail.
 *
 * Progress-based filters (weakOnly, incorrectOnly) are silently dropped: the user gets
 * all-cards view rather than an error.
 */
export function buildFlashcardCatalogFallbackSession(params: {
  pathwayId: string;
  limit: number;
  mode: string;
  includeCards: boolean;
  tier: string;
  country: string;
}): BuildFlashcardCustomSessionSuccess | null {
  try {
    const { virtuals, diagnostics } = collectMergedLessonVirtualFlashcardsForPathway(
      params.pathwayId,
    );

    if (virtuals.length === 0) return null;

    const matchingCards = virtuals.length;
    const returnLimit = Math.min(params.limit, MAX_CATALOG_FALLBACK_CARDS);

    const cards: CustomSessionSerializedCard[] = [];
    if (params.includeCards) {
      for (const v of virtuals) {
        if (cards.length >= returnLimit) break;
        const front = v.row.front?.trim() ?? "";
        const back = v.row.back?.trim() ?? "";
        if (front.length < 2 || back.length < 2) continue;
        cards.push({
          id: v.id,
          front,
          back,
          fullBackAvailable: true,
          topic: v.row.category?.name ?? "",
          subtopic: v.row.category?.topicCode ?? null,
          sourceKey: v.row.sourceKey ?? null,
          pathwayId: params.pathwayId,
          lessonHref: v.lessonHref,
          lessonTitle: v.lessonTitle,
          lessonSlug: v.lessonSlug,
        } as unknown as CustomSessionSerializedCard);
      }
    }

    if (params.includeCards && cards.length === 0) return null;

    safeServerLog("study_delivery", "self_healing_fallback", {
      surface: "flashcard_custom_session",
      from_tier: "secondary",
      to_tier: "tertiary",
      pathway_id: params.pathwayId,
      tier: params.tier,
      country: params.country,
      reason: "db_error_and_cache_miss",
      cards_served: cards.length,
      source: "catalog_virtual",
    });

    return {
      ok: true,
      queryRelaxation: "none",
      summary: {
        pathwayId: params.pathwayId,
        topicCode: null,
        lessonId: null,
        selectedCategories: [],
        matchingCards,
        returnedCards: cards.length,
        mode: params.mode,
        shuffle: false,
        weakOnly: false,
        incorrectOnly: false,
        starredOnly: false,
        revisitOnly: false,
        notStudiedOnly: false,
        cardLimit: String(returnLimit),
        sessionShuffleSalt: "",
        offset: 0,
        sourceKind: "lesson",
        lessonVirtualDiagnostics: {
          pathwayId: params.pathwayId,
          catalogLessonCount: diagnostics.catalogLessonCount,
          lessonsWithDerivedCards: diagnostics.lessonsWithVirtualCards,
          totalGeneratedVirtualCards: diagnostics.totalVirtualCards,
          recallVirtualCount: diagnostics.recallVirtualCount,
          sectionDerivedVirtualCount: diagnostics.sectionDerivedVirtualCount,
          genericFillerSectionCardHits: diagnostics.genericFillerSourcedSectionCards,
          selectedCategoryIds: [],
          filterModeLabel: "all cards (catalog fallback)",
        },
        poolInventoryDiagnostics: null,
      },
      categoryOptions: [],
      cards,
    };
  } catch (err) {
    safeServerLog("study_delivery", "catalog_fallback_error", {
      surface: "flashcard_custom_session",
      pathway_id: params.pathwayId,
      error: err instanceof Error ? err.message.slice(0, 200) : "unknown",
    });
    return null;
  }
}
