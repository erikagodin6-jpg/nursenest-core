import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { appShellBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { loadGuidedStudyPayload } from "@/lib/study/guided-study-data";
import { GuidedStudyHero } from "@/components/study/guided-study-hero";
import { GuidedNextStepCard } from "@/components/study/guided-next-step-card";
import {
  GuidedStudyStack,
  GuidedReviewLaterCard,
  GuidedRetestCard,
} from "@/components/study/guided-study-stack";
import type { BreadcrumbCrumb } from "@/lib/seo/breadcrumb-types";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { BROWSE_LESSONS_CTA, SIGN_IN_CTA } from "@/lib/copy/cta-copy";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      title: "Guided Study Mode — NurseNest",
      description:
        "A calm, personalized study flow telling you exactly what to do next based on your weak areas and readiness.",
      robots: { index: false, follow: false },
    }),
    { pathname: "/app/guided", routeGroup: "student.learner.guided_study" },
  );
}

export default async function GuidedStudyPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string })?.id ?? "";

  const crumbs: BreadcrumbCrumb[] = [
    ...appShellBreadcrumbs("dashboard"),
    { name: "Guided Study", href: "/app/guided" },
  ];

  // ── Auth guard ──────────────────────────────────────────────────────────────
  if (!userId) {
    redirect(loginWithCallback("/app/guided"));
  }

  if (!isDatabaseUrlConfigured()) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline="Guided Study Mode"
          body="Sign in to access your personalized study guide."
          primaryCta={{
            label: SIGN_IN_CTA,
            href: loginWithCallback("/app/guided"),
            variant: "primary",
          }}
          secondaryCtas={[{ label: BROWSE_LESSONS_CTA, href: "/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </main>
    );
  }

  // ── Entitlement gate ────────────────────────────────────────────────────────
  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <PremiumEmptyState
          headline="Guided Study Mode"
          body="We could not verify your subscription. Please try again."
          tone="default"
          primaryCta={{ label: "Refresh", href: "/app/guided", variant: "primary" }}
          secondaryCtas={[{ label: "Go to dashboard", href: "/app", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </main>
    );
  }

  if (!entitlement.hasAccess) {
    return (
      <main className="space-y-6">
        <BreadcrumbTrail items={crumbs} />
        <SubscriptionPaywall context="dashboard" />
      </main>
    );
  }

  // ── Load recommendation payload (server-side, bounded queries) ───────────────
  const payload = await loadGuidedStudyPayload(userId);

  return (
    <main className="space-y-8">
      <BreadcrumbTrail items={crumbs} />

      {/* 1. Hero — surface-emphasis */}
      <GuidedStudyHero
        readinessScore={payload.readinessScore}
        readinessBand={payload.readinessBand}
        streakDays={payload.streakDays}
        overallAccuracyPct={payload.overallAccuracyPct}
        examFocus={payload.examFocus}
        studyGoal={payload.studyGoal}
        dailyStudyMinutes={payload.dailyStudyMinutes}
        nextStep={payload.nextStep}
        hasEnoughData={payload.hasEnoughData}
      />

      {/* 2. Today's best next step — surface-soft-c / -a / -b (by urgency) */}
      <GuidedNextStepCard step={payload.nextStep} />

      {/* 3. Study block stack — alternating surface-soft-a / -b */}
      {payload.studyStack.length > 0 && (
        <GuidedStudyStack steps={payload.studyStack} />
      )}

      {/* 4. Review later block — soft neutral */}
      <GuidedReviewLaterCard
        count={payload.reviewLaterCount}
        topics={payload.reviewLaterTopics}
      />

      {/* 5. Retest recommendation — soft accent keyed to band */}
      <GuidedRetestCard rec={payload.retestRec} />

      {/* 6. Optional: weak area context (if data exists) */}
      {payload.weakAreas.length > 0 && (
        <WeakAreaContext weakAreas={payload.weakAreas} />
      )}
    </main>
  );
}

// ── WeakAreaContext (server-rendered, no client JS) ───────────────────────────

function WeakAreaContext({
  weakAreas,
}: {
  weakAreas: Array<{ topic: string; accuracyPct: number; wrongStreak: number; totalAttempts: number }>;
}) {
  return (
    <section aria-label="Your weak areas">
      <div className="mb-3 flex items-center gap-2">
        <div className="h-px flex-1" style={{ background: "var(--semantic-border-soft)" }} />
        <span
          className="shrink-0 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          Your focus areas
        </span>
        <div className="h-px flex-1" style={{ background: "var(--semantic-border-soft)" }} />
      </div>

      <div
        className="overflow-hidden rounded-2xl px-5 py-4"
        style={{
          background: "var(--semantic-surface)",
          border: "1px solid var(--semantic-border-soft)",
        }}
      >
        <div className="space-y-3">
          {weakAreas.map((area, i) => {
            const total = area.totalAttempts;
            const pct = area.accuracyPct;
            const isMajorGap = pct < 45;
            const isModerate = pct < 65;
            const accentColor = isMajorGap
              ? "var(--semantic-danger)"
              : isModerate
                ? "var(--semantic-warning)"
                : "var(--semantic-success)";

            return (
              <div key={area.topic} className="flex items-center gap-3">
                {/* Rank */}
                <span
                  className="w-4 shrink-0 text-center text-[10px] font-bold"
                  style={{ color: "var(--semantic-text-muted)" }}
                >
                  {i + 1}
                </span>

                {/* Topic name */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span
                      className="truncate text-sm font-semibold"
                      style={{ color: "var(--semantic-text-primary)" }}
                    >
                      {area.topic}
                    </span>
                    {area.wrongStreak >= 2 && (
                      <span
                        className="shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider"
                        style={{
                          background: "color-mix(in srgb, var(--semantic-danger) 10%, var(--semantic-surface))",
                          color: "var(--semantic-danger)",
                        }}
                      >
                        {area.wrongStreak} streak
                      </span>
                    )}
                  </div>
                  {/* Progress bar */}
                  <div
                    className="mt-1 h-1.5 overflow-hidden rounded-full"
                    style={{ background: "var(--semantic-border-soft)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: accentColor,
                      }}
                      role="progressbar"
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${area.topic}: ${pct}% accuracy`}
                    />
                  </div>
                </div>

                {/* Accuracy % */}
                <span
                  className="shrink-0 text-sm font-bold tabular-nums"
                  style={{ color: accentColor }}
                >
                  {pct}%
                </span>

                {/* Attempts */}
                <span
                  className="hidden shrink-0 text-[10px] sm:block"
                  style={{ color: "var(--semantic-text-muted)" }}
                >
                  {total} attempts
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 border-t pt-3" style={{ borderColor: "var(--semantic-border-soft)" }}>
          <a
            href="/app/account/analytics"
            className="text-xs font-medium transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 rounded"
            style={{ color: "var(--semantic-brand)" }}
          >
            See full analytics →
          </a>
        </div>
      </div>
    </section>
  );
}
