import { FlashcardWeakStudyClient } from "@/components/flashcards/flashcard-weak-study-client";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { auth } from "@/lib/auth";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { getServerPremiumProtectionFlags } from "@/lib/premium-protection/config";
import { maskUserLabelForWatermark } from "@/lib/premium-protection/mask-user-label";

export default async function FlashcardWeakAreasPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  const email = (session?.user as { email?: string | null })?.email ?? null;
  const protectionFlags = getServerPremiumProtectionFlags();
  const userLabel = maskUserLabelForWatermark(email, userId || "unknown");

  if (entitlement === "error") {
    return <p className="text-sm text-muted-foreground">Unable to verify access right now. Refresh and try again.</p>;
  }
  if (!entitlement.hasAccess) {
    return (
      <main className="space-y-4">
        <h1 className="text-2xl font-bold">Weak-area flashcards</h1>
        <SubscriptionPaywall context="dashboard" />
      </main>
    );
  }

  return <FlashcardWeakStudyClient userId={userId} userLabel={userLabel} protectionFlags={protectionFlags} />;
}
