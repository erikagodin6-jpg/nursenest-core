import { redirect } from "next/navigation";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { PathwayCatSessionStartClient } from "@/components/student/pathway-cat-session-start-client";
import { FreemiumPreviewExhaustedSurface } from "@/components/student/freemium-preview-exhausted-surface";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";
import { pathwayAllowsCatAdaptiveStart } from "@/lib/exam-pathways/pathway-entitlements-policy";
import { isForcedCatFullSetupReviewParam } from "@/lib/exam-pathways/pathway-cat-flow";
import { catLaunchPathwayIdForLearnerStartPage } from "@/lib/practice-tests/resolve-cat-pathway-for-post";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { getPathwayLessonsPage } from "@/lib/lessons/pathway-lesson-loader";
import type { PracticeTestPathwayClientShell } from "@/lib/practice-tests/types";
import { appShellBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import type { Metadata } from "next";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      robots: { index: false, follow: false },
      title: "Adaptive exam simulation | NurseNest",
    }),
    { pathname: "/app/practice-tests/start", routeGroup: "student.learner.practice_test_start" },
  );
}

type Props = { searchParams: Promise<{ pathwayId?: string; review?: string }> };

export default async function PathwayCatStartPage({ searchParams }: Props) {
  const { t } = await getLearnerMarketingBundle();
  const sp = await searchParams;
  const requestedPathwayId = typeof sp.pathwayId === "string" && sp.pathwayId.trim().length > 2 ? sp.pathwayId.trim() : null;
  /** When set, show the full briefing UI (avoids redirect loop from cat-launch error “Full setup” link). */
  const forceFullSetup = isForcedCatFullSetupReviewParam(sp.review);

  const session = await getProtectedRouteSession("(student).app.(learner).practice-tests.start");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const entitlement = await resolveEntitlementForPage(userId);

  if (entitlement === "error") {
    return (
      <div>
        <div className="mb-4">
          <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
        </div>
        <p className="nn-card p-6 text-sm text-muted">{t("learner.entitlement.verifyFailed")}</p>
      </div>
    );
  }

  if (!entitlement.hasAccess) {
    const snap = userId ? await getFreemiumSnapshot(userId) : null;
    return (
      <div>
        <div className="mb-4">
          <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
        </div>
        <h1 className="sr-only">Adaptive exam simulation</h1>
        <p className="mt-2 text-sm text-muted">
          Subscribe for timed, one-question-at-a-time adaptive exam simulation matched to your exam track.
        </p>
        <div className="mt-6">
          <SubscriptionPaywall
            context="questions"
            freemiumRemainingQuestions={snap != null ? snap.questionRemaining : undefined}
            freemiumRemainingLessons={snap != null ? snap.lessonRemaining : undefined}
          />
        </div>
        <FreemiumPreviewExhaustedSurface kind="cat" />
      </div>
    );
  }

  const compatiblePathways = await listPathwaysCompatibleWithSubscription(entitlement);
  const catEligiblePathways = compatiblePathways.filter(pathwayAllowsCatAdaptiveStart);
  const waitlistOnlyPathways = compatiblePathways.filter((p) => !pathwayAllowsCatAdaptiveStart(p));

  if (
    requestedPathwayId &&
    !catEligiblePathways.some((p) => p.id === requestedPathwayId)
  ) {
    return (
      <div>
        <div className="mb-4">
          <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
        </div>
        <PremiumEmptyState
          headline="Adaptive CAT"
          body="This exam track is not available for adaptive sessions on your current plan, or CAT is not enabled for that track yet. Open practice questions from your pathway hub, or pick an eligible track in study preferences."
          tone="default"
          primaryCta={{
            label: t("learner.dashboard.openAccountHub"),
            href: "/app/account/study-preferences",
            variant: "primary",
          }}
          secondaryCtas={[{ label: t("nav.lessons"), href: "/app/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      </div>
    );
  }

  /** When several CAT-eligible tracks exist, require an explicit choice (URL or dropdown) — no silent default. */
  const initialPathwayId = catLaunchPathwayIdForLearnerStartPage(requestedPathwayId, catEligiblePathways);

  /** Pathway is known → go straight to session bridge unless learner explicitly opened the full briefing. */
  if (initialPathwayId && !forceFullSetup) {
    redirect(`/app/practice-tests/cat-launch?pathwayId=${encodeURIComponent(initialPathwayId)}`);
  }

  const pathwayOptions = catEligiblePathways.map((p) => ({
    id: p.id,
    label: `${p.shortName} — ${p.displayName}`,
    examFamily: String(p.examFamily),
    examCodeLabel: p.shortName.trim(),
  }));
  const pathwayShellById: Record<string, PracticeTestPathwayClientShell> = Object.fromEntries(
    catEligiblePathways.map((p) => {
      const shell: PracticeTestPathwayClientShell = {
        id: p.id,
        countrySlug: p.countrySlug,
        roleTrack: p.roleTrack,
        examCode: p.examCode,
        shortName: p.shortName,
        examFamily: p.examFamily,
      };
      return [p.id, shell] as const;
    }),
  );
  const lessonPreviewSettled = await Promise.allSettled(
    catEligiblePathways.map((pathway) => getPathwayLessonsPage(pathway.id, 1, 5)),
  );
  const lessonsByPathway: Record<string, Array<{ slug: string; title: string }> | null> = Object.fromEntries(
    catEligiblePathways.map((pathway, i) => {
      const r = lessonPreviewSettled[i]!;
      if (r.status === "fulfilled") {
        return [
          pathway.id,
          r.value.items.map((item) => ({
            slug: item.slug,
            title: item.title,
          })),
        ] as const;
      }
      const msg = r.reason instanceof Error ? r.reason.message.slice(0, 400) : String(r.reason).slice(0, 400);
      safeServerLog("cat_start_page", "lesson_preview_segment_failed", {
        operation: "cat_start_lesson_preview",
        feature_surface: "practice_tests_cat_start",
        pathway_id_prefix: pathway.id.slice(0, 12),
        outcome: "error",
        reason: msg,
      });
      return [pathway.id, null] as const;
    }),
  );

  return (
    <div>
      <div className="mb-4">
        <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
      </div>
      <p className="mt-2 max-w-3xl text-sm text-[var(--semantic-text-secondary)]">
        Select your exam pathway, review conditions, then start. Timing, navigation, and min/max item rules follow the pathway
        configuration below — not generic quiz defaults.
      </p>
      {catEligiblePathways.length > 1 ? (
        <p className="mt-3 text-sm text-[var(--semantic-text-secondary)]">
          Your plan includes more than one adaptive exam track —{" "}
          <span className="font-medium text-[var(--semantic-text-primary)]">pick which pathway this CAT session is for</span>{" "}
          before starting so items stay exam-scoped.
        </p>
      ) : null}
      {waitlistOnlyPathways.length > 0 && catEligiblePathways.length === 0 ? (
        <aside className="nn-card mt-6 border-amber-200/80 bg-amber-50/70 p-4 text-sm text-foreground dark:border-amber-900/40 dark:bg-amber-950/30">
          <p className="font-semibold">Adaptive (CAT) is not open for your current pathway yet</p>
          <p className="mt-1 text-muted-foreground">
            Your plan matches one or more tracks that are still on waitlist or ramp-up. Use{" "}
            <strong>lessons</strong> and the <strong>question bank</strong> from each pathway hub, join a waitlist from
            marketing pages if available, or switch to an active exam track (e.g. US RN/PN) if your subscription includes
            it.
          </p>
        </aside>
      ) : null}
      <div className="mt-6">
        <PathwayCatSessionStartClient
          initialPathwayId={initialPathwayId}
          pathwayOptions={pathwayOptions}
          pathwayShellById={pathwayShellById}
          fallbackLessonsByPathway={lessonsByPathway}
        />
      </div>
    </div>
  );
}
