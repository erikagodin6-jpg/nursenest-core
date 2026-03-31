import { FlashcardStudyClient } from "@/components/flashcards/flashcard-study-client";
import { auth } from "@/lib/auth";
import { getServerPremiumProtectionFlags } from "@/lib/premium-protection/config";
import { maskUserLabelForWatermark } from "@/lib/premium-protection/mask-user-label";

type Props = { params: Promise<{ deckRef: string }> };

export default async function FlashcardDeckStudyPage({ params }: Props) {
  const { deckRef } = await params;
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const email = (session?.user as { email?: string | null })?.email ?? null;
  const protectionFlags = getServerPremiumProtectionFlags();
  const userLabel = maskUserLabelForWatermark(email, userId || "unknown");

  return (
    <FlashcardStudyClient
      deckRef={deckRef}
      userId={userId}
      userLabel={userLabel}
      protectionFlags={protectionFlags}
    />
  );
}
