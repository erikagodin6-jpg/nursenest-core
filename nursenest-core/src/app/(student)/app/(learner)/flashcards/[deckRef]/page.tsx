import { FlashcardStudyClient } from "@/components/flashcards/flashcard-study-client";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { getServerPremiumProtectionFlags } from "@/lib/premium-protection/config";
import { maskUserLabelForWatermark } from "@/lib/premium-protection/mask-user-label";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";

type Props = {
  params: Promise<{ deckRef: string }>;
  searchParams: Promise<{ shuffle?: string; mode?: string }>;
};

export default async function FlashcardDeckStudyPage({ params, searchParams }: Props) {
  const { deckRef } = await params;
  const sp = await searchParams;
  const studyMode = sp.mode === "test" ? "test" : "learn";
  const session = await getProtectedRouteSession("(student).app.(learner).flashcards.[deckRef]");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  const email = (session?.user as { email?: string | null })?.email ?? null;
  const protectionFlags = getServerPremiumProtectionFlags();
  const userLabel = maskUserLabelForWatermark(email, userId || "unknown");
  const { t } = await getLearnerMarketingBundle();

  if (entitlement === "error") {
    return <p className="text-sm text-muted-foreground">{t("learner.entitlement.verifyFailedShort")}</p>;
  }
  if (!entitlement.hasAccess) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{t("learner.flashcards.study.heading")}</h1>
        <SubscriptionPaywall context="dashboard" />
      </div>
    );
  }

  return (
    <FlashcardStudyClient
      deckRef={deckRef}
      userId={userId}
      userLabel={userLabel}
      protectionFlags={protectionFlags}
      shuffleInitially={sp.shuffle === "1"}
      studyMode={studyMode}
    />
  );
}
