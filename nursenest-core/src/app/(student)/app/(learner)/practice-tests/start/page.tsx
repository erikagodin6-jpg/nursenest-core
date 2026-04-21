import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { PathwayCatSessionStartClient } from "@/components/student/pathway-cat-session-start-client";
import { FreemiumPreviewExhaustedSurface } from "@/components/student/freemium-preview-exhausted-surface";
import { SubscriptionPaywall } from "@/components/student/subscription-paywall";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { getFreemiumSnapshot } from "@/lib/entitlements/freemium";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";
import { pathwayAllowsCatAdaptiveStart } from "@/lib/exam-pathways/pathway-entitlements-policy";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { getPathwayLessonsPage } from "@/lib/lessons/pathway-lesson-loader";
import type { PracticeTestPathwayClientShell } from "@/lib/practice-tests/types";
import { appShellBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import type { Metadata } from "next";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => ({
      robots: { index: false, follow: false },
      title: "Start CAT practice | NurseNest",
    }),
    { pathname: "/app/practice-tests/start", routeGroup: "student.learner.practice_test_start" },
  );
}

type Props = { searchParams: Promise<{ pathwayId?: string }> };

export default async function PathwayCatStartPage({ searchParams }: Props) {
  const { t } = await getLearnerMarketingBundle();
  const sp = await searchParams;
  const requestedPathwayId = typeof sp.pathwayId === "string" && sp.pathwayId.trim().length > 2 ? sp.pathwayId.trim() : null;

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
        <h1 className="text-3xl font-bold">Pathway Readiness Exam</h1>
        <p className="mt-2 text-sm text-muted">Subscribe to run adaptive sessions matched to your exam track.</p>
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
  const initialPathwayId =
    requestedPathwayId && catEligiblePathways.some((p) => p.id === requestedPathwayId)
      ? requestedPathwayId
      : catEligiblePathways.length === 1
        ? catEligiblePathways[0]!.id
        : null;

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
  const lessonsByPathway = Object.fromEntries(
    await Promise.all(
      catEligiblePathways.map(async (pathway) => {
        let page;
        try {
          page = await getPathwayLessonsPage(pathway.id, 1, 5);
        } catch {
          page = { items: [] as Array<{ slug: string; title: string }> };
        }
        return [
          pathway.id,
          page.items.map((item) => ({
            slug: item.slug,
            title: item.title,
          })),
        ] as const;
      }),
    ),
  );

  return (
    <div>
      <div className="mb-4">
        <BreadcrumbTrail items={appShellBreadcrumbs("practice-tests")} />
      </div>
      <h1 className="text-3xl font-bold">Pathway Readiness Exam</h1>
      <p className="mt-2 text-sm text-muted">
        Confirm the pathway and start your readiness exam. Exam constraints are applied automatically per pathway.
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
