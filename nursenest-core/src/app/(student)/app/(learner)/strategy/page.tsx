import { Suspense } from "react";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { StrategyOverviewSection } from "@/components/study/strategy-overview-section";
import { StrategyPracticeCards } from "@/components/study/strategy-practice-cards";
import { loadStrategyCounts } from "@/app/(student)/app/(learner)/strategy/actions";

export default async function StrategyHubPage() {
  const session = await getProtectedRouteSession("(student).app.(learner).strategy");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return (
      <p className="text-sm text-muted-foreground">
        Unable to verify your access. Please try again.
      </p>
    );
  }

  if (!entitlement.hasAccess) {
    return (
      <div className="space-y-6">
        <div className="nn-learner-page-hero">
          <h1 className="text-3xl font-bold" style={{ color: "var(--semantic-text-primary)" }}>
            Strategy Trainer
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--semantic-text-secondary)" }}>
            Learn the seven thinking patterns that drive nursing exam success.
          </p>
        </div>
        <SubscriptionPaywall context="dashboard" />
      </div>
    );
  }

  // Load counts in parallel (graceful fallback to empty if DB unavailable)
  const counts = await loadStrategyCounts().catch(() => ({}));
  const totalQuestions = Object.values(counts).reduce<number>((s, n) => s + (n ?? 0), 0);

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-6">
      {/* Hero overview */}
      <Suspense fallback={null}>
        <StrategyOverviewSection
          counts={counts}
          totalQuestions={totalQuestions}
        />
      </Suspense>

      {/* Practice mode entry cards */}
      <section>
        <div className="mb-4">
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--theme-heading-text)" }}
          >
            Choose a strategy to practice
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--theme-muted-text)" }}>
            Start with a focused session on one strategy type, or run a mixed session
            across all seven.
          </p>
        </div>
        <StrategyPracticeCards counts={counts} />
      </section>
    </div>
  );
}
