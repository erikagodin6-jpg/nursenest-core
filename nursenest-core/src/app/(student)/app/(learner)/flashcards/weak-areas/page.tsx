import { FlashcardWeakStudyClient } from "@/components/flashcards/flashcard-weak-study-client";
import { auth } from "@/lib/auth";
import { getServerPremiumProtectionFlags } from "@/lib/premium-protection/config";
import { maskUserLabelForWatermark } from "@/lib/premium-protection/mask-user-label";

export default async function FlashcardWeakAreasPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const email = (session?.user as { email?: string | null })?.email ?? null;
  const protectionFlags = getServerPremiumProtectionFlags();
  const userLabel = maskUserLabelForWatermark(email, userId || "unknown");

  return <FlashcardWeakStudyClient userId={userId} userLabel={userLabel} protectionFlags={protectionFlags} />;
}
