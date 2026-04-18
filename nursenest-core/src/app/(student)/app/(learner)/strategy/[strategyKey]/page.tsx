import { notFound, redirect } from "next/navigation";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { StrategySessionClient } from "@/components/study/strategy-session-client";
import {
  loadStrategySession,
  loadStrategyCounts,
} from "@/app/(student)/app/(learner)/strategy/actions";
import { getStrategy, isStrategyKey, MIXED_STRATEGY_KEY } from "@/lib/study/strategy-taxonomy";
import Link from "next/link";

type Props = {
  params: Promise<{ strategyKey: string }>;
};

export default async function StrategySessionPage({ params }: Props) {
  const { strategyKey } = await params;

  // Validate the strategy key
  const isMixed = strategyKey === MIXED_STRATEGY_KEY;
  if (!isMixed && !isStrategyKey(strategyKey)) {
    notFound();
  }

  const session = await getProtectedRouteSession("(student).app.(learner).strategy.[strategyKey]");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    redirect("/app/strategy");
  }

  if (!entitlement.hasAccess) {
    return (
      <div className="space-y-6">
        <div className="nn-learner-page-hero">
          <h1 className="text-3xl font-bold" style={{ color: "var(--semantic-text-primary)" }}>
            Strategy Practice
          </h1>
        </div>
        <SubscriptionPaywall context="dashboard" />
      </div>
    );
  }

  const strategyEntry = isMixed ? null : getStrategy(strategyKey);
  const sessionLabel = strategyEntry
    ? `${strategyEntry.label} Questions`
    : "Mixed Strategy Session";
  const accentVar = strategyEntry?.accentVar ?? "var(--surface-emphasis, var(--theme-primary))";

  // Load the initial batch + counts in parallel
  const [initialBatch, counts] = await Promise.all([
    loadStrategySession(strategyKey).catch(() => ({
      questions: [],
      nextCursor: null,
      total: 0,
      strategyKey,
    })),
    loadStrategyCounts().catch(() => ({})),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Session header */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <Link
            href="/app/strategy"
            className="text-xs font-medium transition hover:opacity-70"
            style={{ color: "var(--theme-muted-text)" }}
          >
            ← Strategy Trainer
          </Link>
        </div>
        <div className="flex flex-wrap items-baseline gap-3">
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--theme-heading-text)" }}
          >
            {sessionLabel}
          </h1>
          {initialBatch.total > 0 ? (
            <span
              className="rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{
                background: `color-mix(in srgb, ${accentVar} 12%, transparent)`,
                color: accentVar,
              }}
            >
              {initialBatch.total} questions
            </span>
          ) : null}
        </div>
        {strategyEntry ? (
          <p
            className="mt-1.5 max-w-2xl text-sm"
            style={{ color: "var(--theme-muted-text)" }}
          >
            {strategyEntry.description}
          </p>
        ) : (
          <p
            className="mt-1.5 max-w-2xl text-sm"
            style={{ color: "var(--theme-muted-text)" }}
          >
            Randomized questions across all seven strategy types — simulating the variety of the
            real exam.
          </p>
        )}
      </div>

      {/* Empty state */}
      {initialBatch.questions.length === 0 ? (
        <div
          className="rounded-2xl px-8 py-12 text-center"
          style={{
            background:
              "color-mix(in srgb, var(--surface-soft-a, var(--theme-primary)) 6%, var(--bg-card, var(--theme-card-bg)))",
            border: "1px solid var(--border-subtle, var(--theme-card-border))",
          }}
        >
          <p
            className="text-lg font-semibold"
            style={{ color: "var(--theme-heading-text)" }}
          >
            No questions available yet
          </p>
          <p className="mt-2 text-sm" style={{ color: "var(--theme-muted-text)" }}>
            Questions tagged with this strategy will appear here as the question bank grows.
          </p>
          <Link
            href="/app/strategy"
            className="mt-6 inline-flex rounded-full px-5 py-2 text-sm font-semibold transition"
            style={{
              background: "var(--role-cta, var(--theme-primary))",
              color: "var(--role-cta-foreground, #fff)",
            }}
          >
            ← Try another strategy
          </Link>
        </div>
      ) : (
        <StrategySessionClient initialBatch={initialBatch} counts={counts} />
      )}
    </div>
  );
}
