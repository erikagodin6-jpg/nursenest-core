import type { Metadata } from "next";
import { Bookmark } from "lucide-react";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { loadQuestionBookmarksPagePayload } from "./actions";
import { MyQuestionBookmarksClient } from "./my-question-bookmarks-client";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      title: "My Bookmarks — NurseNest",
      robots: { index: false, follow: false },
    }),
    { pathname: "/app/account/bookmarks", routeGroup: "student.learner.account_bookmarks" },
  );
}

export default async function AccountQuestionBookmarksPage() {
  const session = await getProtectedRouteSession("(student).app.(learner).account.bookmarks");
  const userId = (session?.user as { id?: string })?.id ?? "";

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <div className="space-y-6">
        <LearnerBreadcrumbTrail kind="account-leaf" leafLabel="My Bookmarks" pathname="/app/account/bookmarks" />
        <PremiumEmptyState
          headline="My Bookmarks"
          body="We are checking your learner session. Return to the study hub and try again if this does not refresh."
          primaryCta={{ label: "Return to study hub", href: "/app", variant: "primary" }}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </div>
    );
  }

  const entitlement = await resolveEntitlementForPage(userId);
  if (entitlement === "error") {
    return (
      <div className="space-y-6">
        <LearnerBreadcrumbTrail kind="account-leaf" leafLabel="My Bookmarks" pathname="/app/account/bookmarks" />
        <PremiumEmptyState
          headline="My Bookmarks"
          body="We could not verify your subscription. Please try again."
          primaryCta={{ label: "Refresh", href: "/app/account/bookmarks", variant: "primary" }}
          secondaryCtas={[{ label: "Go to dashboard", href: "/app", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </div>
    );
  }

  if (!entitlement.hasAccess) {
    return (
      <div className="space-y-6">
        <LearnerBreadcrumbTrail kind="account-leaf" leafLabel="My Bookmarks" pathname="/app/account/bookmarks" />
        <SubscriptionPaywall context="dashboard" />
      </div>
    );
  }

  const payload = await loadQuestionBookmarksPagePayload(userId);

  return (
    <div className="space-y-6">
      <LearnerBreadcrumbTrail kind="account-leaf" leafLabel="My Bookmarks" pathname="/app/account/bookmarks" />
      <section
        className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-7 shadow-[var(--semantic-shadow-soft)] sm:px-8"
        aria-labelledby="my-bookmarks-title"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-1 text-xs font-semibold text-[var(--semantic-text-secondary)]">
              <Bookmark className="h-3.5 w-3.5 text-[var(--semantic-brand)]" aria-hidden />
              Central review dashboard
            </div>
            <h1 id="my-bookmarks-title" className="text-2xl font-extrabold tracking-tight text-[var(--semantic-text-primary)] sm:text-3xl">
              My Bookmarks
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              Save important flashcards, practice questions, CAT items, ECG drills, pharmacology prompts, and clinical skills questions into one focused review queue.
            </p>
          </div>
          <div className="grid min-w-[min(100%,24rem)] grid-cols-3 gap-3">
            <StatCard label="Saved" value={payload.total} />
            <StatCard label="Weak-area" value={payload.weakAreaBookmarkCount} />
            <StatCard label="Topics" value={payload.mostBookmarkedTopics.length} />
          </div>
        </div>
      </section>

      <MyQuestionBookmarksClient payload={payload} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 text-center">
      <p className="text-xl font-extrabold tabular-nums text-[var(--semantic-text-primary)]">{value.toLocaleString()}</p>
      <p className="text-[11px] font-semibold text-[var(--semantic-text-muted)]">{label}</p>
    </div>
  );
}
