import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { BookX, Flame } from "lucide-react";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { appAccountBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { remediationTopicDrillHref } from "@/lib/learner/remediation-links";
import { MistakeNotebookClient } from "@/components/mistakes/mistake-notebook-client";
import { loadMistakeNotebookAction } from "./actions";
import { BROWSE_QUESTIONS_CTA, SIGN_IN_CTA } from "@/lib/copy/cta-copy";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      title: "Mistake Notebook — NurseNest",
      robots: { index: false, follow: false },
    }),
    { pathname: "/app/account/mistakes", routeGroup: "student.learner.account_mistakes" },
  );
}

export default async function MistakeNotebookPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const crumbs = appAccountBreadcrumbs("Mistake Notebook");

  // ── Auth guard ──────────────────────────────────────────────────────────────
  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline="Mistake Notebook"
          body="Sign in to track your missed questions and learn from your errors more effectively."
          primaryCta={{
            label: SIGN_IN_CTA,
            href: loginWithCallback("/app/account/mistakes"),
            variant: "primary",
          }}
          secondaryCtas={[{ label: BROWSE_QUESTIONS_CTA, href: "/app/questions", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </main>
    );
  }

  // ── Entitlement gate ────────────────────────────────────────────────────────
  const entitlement = await resolveEntitlementForPage(userId);
  if (entitlement === "error" || !entitlement.hasAccess) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <SubscriptionPaywall context="lessons" />
      </main>
    );
  }

  // ── Data load ───────────────────────────────────────────────────────────────
  const data = await loadMistakeNotebookAction(userId);

  return (
    <main className="space-y-8">
      <BreadcrumbTrail items={crumbs} />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <header
        className="relative overflow-hidden rounded-2xl px-6 py-8 sm:px-8"
        style={{
          background: "linear-gradient(135deg, color-mix(in srgb, var(--semantic-danger) 10%, var(--bg-card)) 0%, color-mix(in srgb, var(--semantic-warning) 8%, var(--bg-card)) 100%)",
          border: "1px solid color-mix(in srgb, var(--semantic-danger) 18%, var(--semantic-border-soft))",
        }}
      >
        {/* Background decorative icon */}
        <BookX
          className="absolute -right-4 -top-4 h-32 w-32 rotate-6 opacity-[0.05]"
          aria-hidden="true"
          style={{ color: "var(--semantic-danger)" }}
        />

        <div className="relative">
          <div className="flex items-center gap-2">
            <Flame
              className="h-5 w-5"
              style={{ color: "var(--semantic-danger)" }}
              aria-hidden="true"
            />
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--semantic-danger)" }}
            >
              Mistake Notebook
            </span>
          </div>
          <h1
            className="mt-2 text-2xl font-black sm:text-3xl"
            style={{ color: "var(--semantic-text-primary)" }}
          >
            Learn from your errors
          </h1>
          <p className="mt-2 max-w-lg text-sm" style={{ color: "var(--semantic-text-secondary)" }}>
            Every missed question is data. Tag your mistakes, spot your patterns, and target exactly
            what&apos;s holding you back — the way UWorld doesn&apos;t.
          </p>

          {data.hasHistoricalData && data.totalMisses > 0 ? (
            <p className="mt-4 text-xs font-medium" style={{ color: "var(--semantic-text-muted)" }}>
              {data.totalMisses} missed question{data.totalMisses !== 1 ? "s" : ""} across your recent sessions
              {data.taggedCount > 0
                ? ` · ${data.taggedCount} tagged`
                : " · Tag your mistakes to reveal patterns"}
            </p>
          ) : null}
        </div>
      </header>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <MistakeNotebookClient
        initialData={data}
        drillHrefForTopic={remediationTopicDrillHref}
      />
    </main>
  );
}
