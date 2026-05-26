import Link from "next/link";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import type { LearnerActivityBootstrapFail } from "@/lib/learner/activity-lifecycle";

export function LearnerActivityState({
  state,
  paywallContext = "dashboard",
}: {
  state: LearnerActivityBootstrapFail;
  paywallContext?: "dashboard" | "questions" | "lessons" | "exams";
}) {
  if (state.reason === "subscription_required") {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-10">
        <h1 className="text-2xl font-bold text-[var(--semantic-text-primary)]">{state.title}</h1>
        <p className="text-sm text-[var(--semantic-text-secondary)]">{state.message}</p>
        <SubscriptionPaywall context={paywallContext} />
      </div>
    );
  }

  const retryHref = state.reason === "auth_unavailable" ? undefined : state.homeHref;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-[var(--semantic-shadow-soft)]">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
          {state.phase}
        </p>
        <h1 className="mt-2 text-lg font-semibold text-[var(--semantic-text-primary)]">{state.title}</h1>
        <p className="mt-2 text-sm leading-6 text-[var(--semantic-text-secondary)]">{state.message}</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href={retryHref ?? state.homeHref}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--semantic-brand)] px-5 py-2.5 text-sm font-semibold text-white"
          >
            {retryHref ? state.homeLabel : "Retry"}
          </Link>
          {retryHref ? null : (
            <Link
              href={state.homeHref}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] px-5 py-2.5 text-sm font-semibold text-[var(--semantic-brand)]"
            >
              {state.homeLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
