import { Suspense } from "react";
import { FlashcardsHubClient } from "@/components/flashcards/flashcards-hub-client";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { listPublishedExamPathwaysForPublicSite } from "@/lib/navigation/country-exam-launch-readiness";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";

export default async function FlashcardsPage() {
  const { t } = await getLearnerMarketingBundle();
  const session = await getProtectedRouteSession("(student).app.(learner).flashcards");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);
  if (entitlement === "error") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 text-sm text-[var(--theme-muted-text)]">
        {t("learner.entitlement.flashcardsShort")}
      </div>
    );
  }
  if (!entitlement.hasAccess) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{t("learner.flashcards.page.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("learner.flashcards.page.subtitle.locked")}</p>
        <SubscriptionPaywall context="dashboard" />
      </div>
    );
  }
  const pathwayOptions = listPublishedExamPathwaysForPublicSite().map((p) => ({ id: p.id, label: p.displayName }));
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-8 text-sm">{t("learner.loading.flashcards")}</div>}>
      <FlashcardsHubClient pathwayOptions={pathwayOptions} />
    </Suspense>
  );
}
