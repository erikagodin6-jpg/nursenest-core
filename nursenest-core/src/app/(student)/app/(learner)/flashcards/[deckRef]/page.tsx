import { FlashcardStudyClient } from "@/components/flashcards/flashcard-study-client";
import { auth } from "@/lib/auth";
import { getServerPremiumProtectionFlags } from "@/lib/premium-protection/config";
import { maskUserLabelForWatermark } from "@/lib/premium-protection/mask-user-label";

type Props = {
  params: Promise<{ deckRef: string }>;
  searchParams: Promise<{ shuffle?: string }>;
};

export default async function FlashcardDeckStudyPage({ params, searchParams }: Props) {
  const { deckRef } = await params;
  const sp = await searchParams;
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
      shuffleInitially={sp.shuffle === "1"}
    />
  );
}
