import type {
  VerifiedStudyDeck,
  VerifiedStudyDeckShare,
  VerifiedStudyVerificationStatus,
  VerifiedStudyDeckVisibility,
} from "@prisma/client";

import { referencesJsonMeetsPublicationBar } from "@/lib/verified-study/study-card-reference";

export type DeckAccessContext = {
  viewerId: string;
  deck: Pick<VerifiedStudyDeck, "ownerId" | "visibility" | "moderationStatus" | "verificationStatus" | "unlistedSlug">;
  sharesForViewer: Pick<VerifiedStudyDeckShare, "targetUserId">[];
  /** When deck is UNLISTED, caller must pass the slug from the share link. */
  unlistedSlugFromRequest: string | null;
};

/**
 * Whether the viewer may load deck content (list/detail/study), excluding admin override.
 */
export function viewerCanAccessVerifiedStudyDeck(ctx: DeckAccessContext): boolean {
  const { viewerId, deck, sharesForViewer, unlistedSlugFromRequest } = ctx;
  if (deck.ownerId === viewerId) return true;

  switch (deck.visibility as VerifiedStudyDeckVisibility) {
    case "PRIVATE":
      return false;
    case "SHARED":
      return sharesForViewer.some((s) => s.targetUserId === viewerId);
    case "UNLISTED": {
      const slug = (unlistedSlugFromRequest ?? "").trim();
      return slug.length > 0 && deck.unlistedSlug != null && slug === deck.unlistedSlug;
    }
    case "PUBLIC":
      return deck.moderationStatus === "APPROVED" && deck.verificationStatus === "VERIFIED";
    default:
      return false;
  }
}

export type DeckForPublicationCheck = Pick<VerifiedStudyDeck, "visibility" | "moderationStatus">;

export type CardForPublicationCheck = {
  verificationStatus: VerifiedStudyVerificationStatus;
  referencesJson: unknown;
};

/**
 * Whether a **pending** public deck can be approved for the community catalog.
 * Caller should pass decks with `moderationStatus === PENDING` and `visibility === PUBLIC`.
 * Every card must already be staff-verified with auditable references.
 */
export function publicCommunityDeckIsPublishable(
  deck: DeckForPublicationCheck,
  cards: CardForPublicationCheck[],
): { ok: true } | { ok: false; reasons: string[] } {
  const reasons: string[] = [];
  if (deck.visibility !== "PUBLIC") reasons.push("visibility_not_public");
  if (deck.moderationStatus !== "PENDING") reasons.push("moderation_not_pending_review");
  if (cards.length === 0) reasons.push("no_cards");

  for (const c of cards) {
    if (c.verificationStatus !== "VERIFIED") {
      reasons.push("card_not_verified");
      break;
    }
    if (!referencesJsonMeetsPublicationBar(c.referencesJson)) {
      reasons.push("card_references_invalid_or_missing");
      break;
    }
  }

  if (reasons.length) return { ok: false, reasons };
  return { ok: true };
}
