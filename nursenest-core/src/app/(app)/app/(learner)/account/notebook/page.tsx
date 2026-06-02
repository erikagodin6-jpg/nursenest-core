import type { Metadata } from "next";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { BROWSE_LESSONS_CTA, OPEN_STUDY_HUB_CTA } from "@/lib/copy/cta-copy";
import { loadPersonalStudyNotebook } from "./actions";
import { PersonalStudyNotebookClient } from "./personal-study-notebook-client";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      title: "My Study Notebook | NurseNest",
      robots: { index: false, follow: false },
    }),
    { pathname: "/app/account/notebook", routeGroup: "student.learner.account_notebook" },
  );
}

export default async function PersonalStudyNotebookPage() {
  const session = await getProtectedRouteSession("(student).app.(learner).account.notebook");
  const userId = (session?.user as { id?: string })?.id ?? "";

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <div className="space-y-6">
        <LearnerBreadcrumbTrail kind="account-leaf" leafLabel="My Study Notebook" pathname="/app/account" />
        <PremiumEmptyState
          headline="My Study Notebook"
          body="We are checking your learner session. Return to the study hub and try again if this does not refresh."
          primaryCta={{ label: OPEN_STUDY_HUB_CTA, href: "/app", variant: "primary" }}
          secondaryCtas={[{ label: BROWSE_LESSONS_CTA, href: "/lessons", variant: "secondary" }]}
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
        <LearnerBreadcrumbTrail kind="account-leaf" leafLabel="My Study Notebook" pathname="/app/account" />
        <PremiumEmptyState
          headline="My Study Notebook"
          body="We could not verify your subscription. Please try again."
          primaryCta={{ label: "Refresh", href: "/app/account/notebook", variant: "primary" }}
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
        <LearnerBreadcrumbTrail kind="account-leaf" leafLabel="My Study Notebook" pathname="/app/account" />
        <SubscriptionPaywall context="dashboard" />
      </div>
    );
  }

  const payload = await loadPersonalStudyNotebook(userId);

  return (
    <div className="space-y-6">
      <LearnerBreadcrumbTrail kind="account-leaf" leafLabel="My Study Notebook" pathname="/app/account" />
      <section
        className="rounded-2xl px-6 py-7 sm:px-8"
        style={{
          background: "var(--surface-emphasis, var(--semantic-panel-cool))",
          border: "1px solid var(--semantic-border-soft)",
          boxShadow: "var(--semantic-shadow-soft)",
        }}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--semantic-text-muted)" }}>
              Dashboard
            </p>
            <h1 className="text-2xl font-extrabold sm:text-3xl" style={{ color: "var(--semantic-text-primary)" }}>
              My Study Notebook
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: "var(--semantic-text-secondary)" }}>
              A permanent personalized study resource for notes, rationales, pearls, memory hooks, ECG interpretations,
              lab notes, pharmacology takeaways, and saved learning moments from across NurseNest.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center sm:min-w-[360px]">
            <StatPill label="Entries" value={payload.total} color="var(--semantic-brand)" />
            <StatPill label="Favorites" value={payload.favoriteCount} color="var(--semantic-warning)" />
            <StatPill label="Recent" value={payload.recentCount} color="var(--semantic-success)" />
          </div>
        </div>
      </section>
      <PersonalStudyNotebookClient payload={payload} />
    </div>
  );
}

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <p className="text-xl font-extrabold tabular-nums" style={{ color }}>
        {value.toLocaleString()}
      </p>
      <p className="text-[10px] font-medium" style={{ color: "var(--semantic-text-muted)" }}>
        {label}
      </p>
    </div>
  );
}
