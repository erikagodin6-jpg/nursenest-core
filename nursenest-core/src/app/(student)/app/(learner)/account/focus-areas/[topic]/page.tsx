import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { LearnerBreadcrumbTrail } from "@/components/navigation/learner-breadcrumb-trail";
import { focusAreaDetailPathname, resolveFocusAreaGraphRoute } from "@/lib/breadcrumbs/focus-area-graph-route";
import { buildReasoningChainNavigation } from "@/lib/breadcrumbs/reasoning-chain-navigation";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { normalizeTopicKey } from "@/lib/linking/link-resolver";
import { remediationTopicDrillHref, remediationWeakModeTestHref } from "@/lib/learner/remediation-links";
import { loadUnifiedTopicPerformance } from "@/lib/learner/topic-performance";
import { getLearnerMarketingBundle } from "@/lib/learner/learner-marketing-server";
import { loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = { params: Promise<{ topic: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const slug = normalizeTopicKey(topic) ?? topic;
  return safeGenerateMetadata(
    async () => ({
      title: `Focus: ${slug.replace(/-/g, " ")} | NurseNest`,
      robots: { index: false, follow: false },
    }),
    { pathname: focusAreaDetailPathname(slug), routeGroup: "student.learner.account_focus_area_detail" },
  );
}

export default async function AccountFocusAreaDetailPage({ params }: Props) {
  const { topic } = await params;
  const topicSlug = normalizeTopicKey(topic);
  if (!topicSlug) notFound();

  const { t } = await getLearnerMarketingBundle();
  const session = await getProtectedRouteSession("(student).app.(learner).account.focus-areas.topic");
  const userId = (session?.user as { id?: string })?.id ?? "";
  const pathname = focusAreaDetailPathname(topicSlug);

  if (!userId || !isDatabaseUrlConfigured()) {
    return (
      <div className="space-y-6">
        <LearnerBreadcrumbTrail kind="account-leaf" leafLabel="Focus areas" pathname={pathname} />
        <p className="text-sm text-muted-foreground">{t("learner.profile.signedOutHint")}</p>
        <Link href={loginWithCallback(pathname)} className="text-sm font-semibold text-primary underline">
          {t("learner.gate.signIn")}
        </Link>
      </div>
    );
  }

  const entitlement = await resolveEntitlementForPage(userId);
  if (entitlement === "error" || !entitlement.hasAccess) {
    notFound();
  }

  const topicPerf = await loadUnifiedTopicPerformance(userId, entitlement, 24);
  const weakRow = topicPerf.weakTopics.find((w) => normalizeTopicKey(w.topic) === topicSlug);
  const missRate = weakRow?.missRate ?? 0.35;

  const graph = resolveFocusAreaGraphRoute({
    topicSlug,
    topicLabel: weakRow?.topic ?? topicSlug.replace(/-/g, " "),
    pathwayId: "ca-rn-nclex-rn",
    userId,
    weakTopics: topicPerf.weakTopics,
    missRate,
  });

  const reasoning = buildReasoningChainNavigation({
    topicSlug,
    topicLabel: graph.topicLabel,
    pathwayId: "ca-rn-nclex-rn",
    pathname,
    sourceSurface: "dashboard_feed",
  });

  return (
    <div className="space-y-6">
      <LearnerBreadcrumbTrail
        kind="focus-area-detail"
        topicSlug={topicSlug}
        topicLabel={graph.topicLabel}
        pathwayId="ca-rn-nclex-rn"
        persistentWeakTopics={topicPerf.weakTopics.map((w) => w.topic)}
        currentStepHref={graph.currentStepHref}
        pathname={pathname}
        competencyId={graph.competencyId ?? undefined}
        remediationPathwayId={graph.remediationPathwayId}
        ontologyNamespace={graph.ontologyNamespace}
        learnerStateReason={graph.learnerStateReason}
        graphDepth={graph.graphDepth}
        educationalIntent="competency"
      />

      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          {graph.weakAreaSeverity === "high" ? "Priority review" : "Focus area"}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[var(--theme-heading-text)]">{graph.topicLabel}</h1>
        {graph.learnerStateReason ? (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{graph.learnerStateReason}</p>
        ) : null}
      </header>

      {reasoning.valid && reasoning.steps.length > 0 ? (
        <section className="nn-card p-6">
          <h2 className="text-lg font-bold text-[var(--theme-heading-text)]">Clinical reasoning pathway</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm text-[var(--theme-body-text)]">
            {reasoning.steps.map((step) => (
              <li key={step.id}>
                {step.href ? (
                  <Link href={step.href} className="font-semibold text-primary hover:underline">
                    {step.label}
                  </Link>
                ) : (
                  step.label
                )}
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Link
          href={remediationTopicDrillHref(topicSlug)}
          className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          {t("learner.profile.topics.remediateQbank")}
        </Link>
        <Link
          href={remediationWeakModeTestHref(topicSlug)}
          className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted/80"
        >
          {t("learner.profile.topics.weakMode")}
        </Link>
        <Link
          href="/app/account/focus-areas"
          className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted/80"
        >
          {t("learner.account.nav.focusAreas")}
        </Link>
      </div>
    </div>
  );
}
