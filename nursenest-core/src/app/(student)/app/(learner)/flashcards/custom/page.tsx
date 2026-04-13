import { auth } from "@/lib/auth";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { FlashcardCustomStudyClient } from "@/components/flashcards/flashcard-custom-study-client";

export default async function FlashcardCustomPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  if (entitlement === "error") {
    return <p className="mx-auto max-w-3xl px-4 py-10 text-sm text-muted-foreground">Unable to verify access.</p>;
  }
  if (!entitlement.hasAccess) {
    return (
      <main className="space-y-4">
        <h1 className="text-2xl font-bold">Custom Flashcards Session</h1>
        <SubscriptionPaywall context="dashboard" />
      </main>
    );
  }
  return <FlashcardCustomStudyClient />;
}
