import type { TierCode } from "@prisma/client";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { prismaTierCodesForProfileTier } from "@/lib/entitlements/accessible-tiers";

/**
 * Optional pathway narrowing for flashcard queries (custom study, weak queues, etc.).
 * Passed into {@link flashcardAccessWhere} as the second argument.
 */
export type FlashcardPathwayAccessOptions = {
  /** Intersect the subscriber tier ladder with this cap (exam catalog `stripeTier` ladder). */
  tierIntersectWith?: readonly TierCode[];
  /** Pre-nursing / foundational free track: allow `PRE_NURSING` cards even when the profile tier is RN/NP. */
  includePreNursingFoundation?: boolean;
  /** Unknown pathway id: only decks explicitly tagged with this `FlashcardDeck.pathwayId`. */
  deckPathwayId?: string;
};

/**
 * Map a learner or URL `pathwayId` to flashcard access narrowing.
 *
 * - Known {@link EXAM_PATHWAYS} ids → tier cap from `stripeTier` (fixes legacy string heuristics like
 *   `us-rn-new-grad-transition` being misclassified as RN-only heuristics).
 * - `pre-nursing` sentinel → foundational tier only (never RN/NP clinical pools).
 * - Any other non-empty string → treat as deck-level pathway tag (no global tier guess).
 */
export function flashcardPathwayAccessOptionsFromPathwayId(
  pathwayId: string | null | undefined,
): FlashcardPathwayAccessOptions | null {
  const raw = pathwayId?.trim();
  if (!raw) return null;
  const pathway = getExamPathwayById(raw);
  if (pathway) {
    return { tierIntersectWith: prismaTierCodesForProfileTier(pathway.stripeTier) };
  }
  const low = raw.toLowerCase();
  if (low === "pre-nursing" || low.startsWith("pre-nursing")) {
    return { includePreNursingFoundation: true };
  }
  return { deckPathwayId: raw };
}
