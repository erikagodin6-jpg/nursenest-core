import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import { userCanAccessDeckForStudy } from "@/lib/flashcards/flashcard-access";
import { findPublishedDeckByRef } from "@/lib/flashcards/resolve-deck";
import { logFlashcardAccessDenied } from "@/lib/observability/flashcard-log";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";

const NO_ACCESS: AccessScope = {
  hasAccess: false,
  reason: "no_access",
  tier: null,
  country: null,
};

type Props = { params: Promise<{ deckRef: string }> };

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: Props) {
  const { deckRef } = await params;
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  setSentryServerContext({ route: "/api/flashcards/decks/[deckRef]", feature: SERVER_FEATURE.flashcard, userId: userId ?? "" });

  const deck = await findPublishedDeckByRef(deckRef);
  if (!deck) {
    return NextResponse.json({ error: "Deck not found" }, { status: 404 });
  }

  let entitlement: AccessScope = NO_ACCESS;
  if (userId) {
    try {
      entitlement = await resolveEntitlement(userId);
    } catch {
      return NextResponse.json({ error: "Unable to verify access" }, { status: 503 });
    }
  }

  if (!userCanAccessDeckForStudy(deck, entitlement)) {
    logFlashcardAccessDenied({ deckId: deck.id.slice(0, 12), reason: "deck_meta" });
    return NextResponse.json({ error: "Access denied", code: "flashcard_access_denied" }, { status: 403 });
  }

  return NextResponse.json({
    deck: {
      id: deck.id,
      slug: deck.slug,
      title: deck.title,
      description: deck.description,
      country: deck.country,
      tier: deck.tier,
      examFamily: deck.examFamily,
      pathwayId: deck.pathwayId,
      visibility: deck.visibility,
      cardCount: deck.cardCount,
    },
    access: {
      fullStudy: Boolean(entitlement.hasAccess || deck.visibility === "PUBLIC_PREVIEW"),
      subscriber: Boolean(entitlement.hasAccess),
    },
  });
}
