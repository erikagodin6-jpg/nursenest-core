import Link from "next/link";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { LearnerCoreStudyShortcuts } from "@/components/student/learner-core-study-shortcuts";
import { LearnerStudySurfaceSection } from "@/components/learner-ui";

function accessSummaryLine(
  entitlement: AccessScope | "error",
  t: LearnerMarketingT,
): string {
  if (entitlement === "error") {
    return t("learner.entitlement.verifyFailed");
  }
  if (!entitlement.hasAccess) {
    return t("learner.dashboard.subtitle.locked");
  }
  switch (entitlement.reason) {
    case "active_subscription":
      return t("learner.billingPage.accessDetail.active_subscription");
    case "past_due_grace":
      return t("learner.billingPage.accessDetail.past_due_grace");
    case "grace_period":
      return t("learner.billingPage.accessDetail.grace_period");
    case "active_trial":
      return t("learner.billingPage.accessDetail.active_trial");
    case "admin_override":
      return t("learner.billingPage.accessDetail.admin_override");
    default:
      return t("learner.billingPage.accessDetail.active_subscription");
  }
}

const linkClass =
  "inline-flex min-h-[44px] items-center rounded-lg border border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-brand)_12%)] bg-[color-mix(in_srgb,var(--semantic-surface)_92%,var(--semantic-panel-cool)_8%)] px-3.5 py-2 text-sm font-semibold text-[var(--semantic-text-primary)] shadow-sm transition-[background-color,box-shadow] hover:bg-[color-mix(in_srgb,var(--semantic-panel-cool)_22%,var(--semantic-surface))] hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_35%,transparent)]";

const mutedLinkClass =
  "inline-flex min-h-[44px] items-center text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline";

/**
 * Legacy `client/src/pages/dashboard.tsx`-style “user panel” affordances: plan context, billing/account/help,
 * then the same canonical study shortcuts as shell nav (`LearnerCoreStudyShortcuts`).
 */
export function LearnerDashboardUserPanelBand({
  t,
  locale,
  pathwayId,
  examsNavLabel,
  entitlement,
  includeStudyShortcuts,
}: {
  t: LearnerMarketingT;
  locale: string;
  pathwayId: string | null;
  examsNavLabel: "CAT Exams" | "Exams";
  entitlement: AccessScope | "error";
  includeStudyShortcuts: boolean;
}) {
  const summary = accessSummaryLine(entitlement, t);
  const hasSubscriberUi =
    entitlement !== "error" && entitlement.hasAccess && entitlement.reason !== "no_access";

  return (
    <LearnerStudySurfaceSection
      id="user-panel-band"
      eyebrow={t("learner.studyHome.pageEyebrow")}
      title={`${t("learner.account.nav.groupAccount")} · ${t("learner.studyHome.shortcutsNavLabel")}`}
      intro={null}
      tone="secondary"
      surfacePadding="md"
      className="nn-dash-band nn-dash-band--user-panel"
    >
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{summary}</p>

        <nav aria-label={t("learner.account.nav.aria")} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {hasSubscriberUi ? (
            <Link href="/app/account/billing" className={linkClass}>
              {t("learner.userBar.link.subscription")}
            </Link>
          ) : (
            <>
              <Link href="/pricing" className={linkClass}>
                {t("nav.pricing")}
              </Link>
              <Link href="/app/account/billing" className={linkClass}>
                {t("learner.userBar.link.subscription")}
              </Link>
            </>
          )}
          <Link href="/app/account/overview" className={linkClass}>
            {t("learner.userBar.link.accountOverview")}
          </Link>
          {hasSubscriberUi ? (
            <Link href="/app/study-plan" className={linkClass}>
              {t("learner.studyHome.linkStudyPlan")}
            </Link>
          ) : null}
          <Link href="/contact" className={linkClass}>
            {t("learner.account.personal.contactLink")}
          </Link>
          <Link href="/refund-policy" className={mutedLinkClass}>
            {t("learner.billingPage.policyRefunds")}
          </Link>
        </nav>

        {includeStudyShortcuts ? (
          <div className="border-t border-[var(--semantic-border-soft)] pt-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
              {t("learner.studyHome.shortcutsNavLabel")}
            </p>
            <LearnerCoreStudyShortcuts pathwayId={pathwayId} examsLabel={examsNavLabel} t={t} locale={locale} />
          </div>
        ) : null}
      </div>
    </LearnerStudySurfaceSection>
  );
}
