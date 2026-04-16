import Link from "next/link";
import { CreditCard, FileText, RefreshCw, Settings } from "lucide-react";
import { SubscriptionStatus } from "@prisma/client";
import type { BillingPagePayload } from "@/lib/learner/load-billing-page-payload";
import { formatBillingTierLabel } from "@/lib/learner/load-billing-page-payload";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { LearnerBillingPortalButton } from "@/components/student/learner-billing-portal-button";
import { LearnerProfileAccountActions } from "@/components/student/learner-profile-account-actions";

function subscriptionStatusLabel(
  status: SubscriptionStatus,
  t: LearnerMarketingT,
  opts?: { pastDueGraceAccess: boolean },
): string {
  if (status === "PAST_DUE" && opts?.pastDueGraceAccess) {
    return t("learner.billingPage.stripeStatus.past_due_grace");
  }
  switch (status) {
    case "ACTIVE":
      return t("learner.billingPage.stripeStatus.active");
    case "GRACE":
      return t("learner.billingPage.stripeStatus.grace");
    case "PAST_DUE":
      return t("learner.billingPage.stripeStatus.past_due");
    case "CANCELLED":
      return t("learner.billingPage.stripeStatus.cancelled");
    default:
      return String(status);
  }
}

function billingAccessWhyLine(
  entitlement: BillingPagePayload["entitlement"],
  accessOk: boolean,
  t: LearnerMarketingT,
): string | null {
  if (!accessOk || entitlement === "error") return null;
  const r = entitlement.reason;
  if (r === "no_access") return null;
  switch (r) {
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
      return null;
  }
}

function billingIntervalLabel(
  interval: NonNullable<BillingPagePayload["stripeRenewal"]>["billingInterval"],
  t: LearnerMarketingT,
): string {
  switch (interval) {
    case "month":
      return t("learner.billingPage.interval.month");
    case "year":
      return t("learner.billingPage.interval.year");
    case "week":
      return t("learner.billingPage.interval.week");
    case "day":
      return t("learner.billingPage.interval.day");
    default:
      return t("learner.billingPage.interval.unknown");
  }
}

function includesListKeys(tier: BillingPagePayload["effectiveTier"]): string[] {
  switch (tier) {
    case "NP":
      return [
        "learner.billingPage.includes.np.1",
        "learner.billingPage.includes.np.2",
        "learner.billingPage.includes.np.3",
        "learner.billingPage.includes.common.1",
        "learner.billingPage.includes.common.2",
      ];
    case "ALLIED":
      return [
        "learner.billingPage.includes.allied.1",
        "learner.billingPage.includes.allied.2",
        "learner.billingPage.includes.common.1",
        "learner.billingPage.includes.common.2",
      ];
    default:
      return [
        "learner.billingPage.includes.nursing.1",
        "learner.billingPage.includes.nursing.2",
        "learner.billingPage.includes.nursing.3",
        "learner.billingPage.includes.common.1",
        "learner.billingPage.includes.common.2",
      ];
  }
}

function StatusBanner({
  surface,
  pastDueGraceEndsAt,
  billingPeriodEndDisplay,
  localeTag,
  t,
}: {
  surface: BillingPagePayload["surface"];
  pastDueGraceEndsAt: Date | null;
  billingPeriodEndDisplay: Date | null;
  localeTag: string;
  t: LearnerMarketingT;
}) {
  const styles: Record<BillingPagePayload["surface"], string> = {
    active_scheduled_cancel:
      "border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[var(--semantic-panel-warm)] text-[var(--semantic-warning-contrast)]",
    active_paid:
      "border-[color-mix(in_srgb,var(--semantic-success)_28%,var(--semantic-border-soft))] bg-[var(--semantic-success-soft)] text-[var(--semantic-success-contrast)]",
    grace:
      "border-[color-mix(in_srgb,var(--semantic-warning)_30%,var(--semantic-border-soft))] bg-[var(--semantic-warning-soft)] text-[var(--semantic-warning-contrast)]",
    past_due_grace:
      "border-[color-mix(in_srgb,var(--semantic-warning)_32%,var(--semantic-border-soft))] bg-[var(--semantic-panel-warm)] text-[var(--semantic-warning-contrast)]",
    past_due:
      "border-[color-mix(in_srgb,var(--semantic-danger)_30%,var(--semantic-border-soft))] bg-[var(--semantic-danger-soft)] text-[var(--semantic-danger-contrast)]",
    cancelled: "border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] text-[var(--semantic-text-primary)]",
    trial: "border-[color-mix(in_srgb,var(--semantic-brand)_25%,var(--semantic-border-soft))] bg-[var(--semantic-panel-muted)] text-[var(--semantic-text-primary)]",
    trial_ending:
      "border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] bg-[var(--semantic-panel-warm)] text-[var(--semantic-warning-contrast)]",
    inactive: "border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] text-muted-foreground",
    admin:
      "border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))] bg-[var(--semantic-panel-cool)] text-[var(--semantic-info-contrast)]",
  };
  const titleKey = `learner.billingPage.surface.${surface}.title` as const;
  const bodyKey = `learner.billingPage.surface.${surface}.body` as const;
  const deadlineFmt =
    pastDueGraceEndsAt != null
      ? pastDueGraceEndsAt.toLocaleDateString(localeTag, { year: "numeric", month: "short", day: "numeric" })
      : null;
  const periodFmt =
    billingPeriodEndDisplay != null
      ? billingPeriodEndDisplay.toLocaleDateString(localeTag, { year: "numeric", month: "short", day: "numeric" })
      : null;
  return (
    <div className={`rounded-2xl border px-4 py-4 sm:px-5 ${styles[surface]}`}>
      <p className="text-sm font-semibold">{t(titleKey)}</p>
      <p className="mt-2 text-sm leading-relaxed opacity-95">{t(bodyKey)}</p>
      {surface === "past_due_grace" && deadlineFmt ? (
        <p className="mt-2 text-sm font-medium leading-relaxed opacity-95">
          {t("learner.billingPage.surface.past_due_grace.deadlineLine", { deadline: deadlineFmt })}
        </p>
      ) : null}
      {surface === "active_scheduled_cancel" && periodFmt ? (
        <p className="mt-2 text-sm font-medium leading-relaxed opacity-95">
          {t("learner.billingPage.surface.active_scheduled_cancel.periodEndLine", { date: periodFmt })}
        </p>
      ) : null}
      {surface === "cancelled" && periodFmt ? (
        <p className="mt-2 text-sm font-medium leading-relaxed opacity-95">
          {t("learner.billingPage.surface.cancelled.periodEndLine", { date: periodFmt })}
        </p>
      ) : null}
    </div>
  );
}

export function LearnerBillingPageContent({
  payload,
  t,
  localeTag,
}: {
  payload: BillingPagePayload;
  t: LearnerMarketingT;
  localeTag: string;
}) {
  const {
    user,
    subscription,
    entitlement,
    pathwayLabels,
    stripeRenewal,
    surface,
    showBillingPortal,
    effectiveTier,
    effectiveCountry,
    showTrialEndCallout,
    pastDueGraceEndsAt,
    billingPeriodEndDisplay,
  } = payload;

  const planLabel = formatBillingTierLabel(effectiveTier, effectiveCountry);
  const accessOk = entitlement !== "error" && entitlement.hasAccess;
  const verifyFailed = entitlement === "error";
  const accessWhy = billingAccessWhyLine(entitlement, accessOk, t);
  const pastDueGraceAccess =
    accessOk &&
    entitlement !== "error" &&
    entitlement.reason === "past_due_grace" &&
    subscription?.status === SubscriptionStatus.PAST_DUE;

  return (
    <div className="space-y-8">
      {verifyFailed ? (
        <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-danger)_28%,var(--semantic-border-soft))] bg-[var(--semantic-danger-soft)] px-4 py-3 text-sm text-[var(--semantic-danger-contrast)]">
          {t("learner.billingPage.verifyFailed")}
        </div>
      ) : null}

      <StatusBanner
        surface={surface}
        pastDueGraceEndsAt={pastDueGraceEndsAt}
        billingPeriodEndDisplay={billingPeriodEndDisplay}
        localeTag={localeTag}
        t={t}
      />

      <section className="overflow-hidden rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] shadow-sm">
        <div className="border-b border-[var(--semantic-border-soft)] bg-gradient-to-r from-primary/[0.06] to-transparent px-5 py-4">
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.billingPage.planTitle")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("learner.billingPage.planSub")}</p>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.billingPage.currentPlan")}</p>
            <p className="mt-1 text-xl font-bold text-[var(--theme-heading-text)]">{planLabel}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {accessOk ? t("learner.billingPage.accessActive") : t("learner.billingPage.accessInactive")}
            </p>
            {accessWhy ? (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{accessWhy}</p>
            ) : null}
            {showTrialEndCallout && user.trialEndsAt ? (
              <p className="mt-2 text-sm font-medium text-primary">
                {t("learner.billingPage.trialEndsLine", {
                  date: user.trialEndsAt.toLocaleDateString(localeTag, { year: "numeric", month: "short", day: "numeric" }),
                })}
              </p>
            ) : null}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.billingPage.pathwaysTitle")}</p>
            {pathwayLabels.length > 0 ? (
              <ul className="mt-2 list-inside list-disc text-sm text-foreground">
                {pathwayLabels.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">{t("learner.billingPage.pathwaysEmpty")}</p>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.billingPage.includesTitle")}</p>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              {includesListKeys(effectiveTier).map((key) => (
                <li key={key} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] shadow-sm">
        <div className="border-b border-[var(--semantic-border-soft)] px-5 py-4">
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.billingPage.billingTitle")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("learner.billingPage.billingSub")}</p>
        </div>
        <dl className="grid gap-4 p-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.billingPage.billingInterval")}</dt>
            <dd className="mt-1 text-sm font-medium text-foreground">
              {stripeRenewal?.billingInterval
                ? billingIntervalLabel(stripeRenewal.billingInterval, t)
                : t("learner.billingPage.billingIntervalUnknown")}
            </dd>
            {!stripeRenewal?.billingInterval ? (
              <p className="mt-1 text-xs text-muted-foreground">{t("learner.billingPage.billingIntervalHint")}</p>
            ) : null}
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.billingPage.renewalTitle")}</dt>
            <dd className="mt-1 text-sm font-medium text-foreground">
              {stripeRenewal?.currentPeriodEnd
                ? t("learner.billingPage.renewalDate", {
                    date: stripeRenewal.currentPeriodEnd.toLocaleDateString(localeTag, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }),
                  })
                : t("learner.billingPage.renewalUnknown")}
            </dd>
            {stripeRenewal?.cancelAtPeriodEnd ? (
              <p className="mt-1 text-xs font-medium text-[var(--semantic-warning-contrast)]">
                {t("learner.billingPage.cancelAtPeriodEnd")}
              </p>
            ) : null}
            {!stripeRenewal?.currentPeriodEnd ? (
              <p className="mt-1 text-xs text-muted-foreground">{t("learner.billingPage.renewalHint")}</p>
            ) : null}
          </div>
          {subscription ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.billingPage.recordStatus")}</dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {subscriptionStatusLabel(subscription.status, t, { pastDueGraceAccess })}
              </dd>
            </div>
          ) : (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.billingPage.recordStatus")}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{t("learner.billingPage.noSubscriptionRow")}</dd>
            </div>
          )}
        </dl>

        <div
          id="account-billing-manage"
          className="flex scroll-mt-24 flex-col gap-3 border-t border-border/50 px-5 py-5 sm:flex-row sm:flex-wrap sm:items-center"
        >
          <Link
            href="/pricing"
            className="inline-flex w-full items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted/80 sm:w-auto"
          >
            {t("learner.billingPage.ctaUpgrade")}
          </Link>
        </div>
      </section>

      <section
        id="billing-portal"
        className="scroll-mt-24 overflow-hidden rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--bg-card)] shadow-sm"
      >
        <div className="border-b border-[var(--semantic-border-soft)] bg-gradient-to-r from-[var(--semantic-panel-cool)] to-transparent px-5 py-4">
          <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.billingPage.managePortalSectionTitle")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("learner.billingPage.managePortalSectionSub")}</p>
        </div>

        {showBillingPortal ? (
          <div className="space-y-5 p-5">
            <ul className="grid gap-3 sm:grid-cols-2">
              <li className="flex items-start gap-3">
                <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <div>
                  <p className="text-sm font-medium text-foreground">{t("learner.billingPage.managePortalFeature.paymentTitle")}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t("learner.billingPage.managePortalFeature.paymentSub")}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <div>
                  <p className="text-sm font-medium text-foreground">{t("learner.billingPage.managePortalFeature.invoicesTitle")}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t("learner.billingPage.managePortalFeature.invoicesSub")}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <div>
                  <p className="text-sm font-medium text-foreground">{t("learner.billingPage.managePortalFeature.subscriptionTitle")}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t("learner.billingPage.managePortalFeature.subscriptionSub")}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Settings className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <div>
                  <p className="text-sm font-medium text-foreground">{t("learner.billingPage.managePortalFeature.detailsTitle")}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t("learner.billingPage.managePortalFeature.detailsSub")}</p>
                </div>
              </li>
            </ul>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <LearnerBillingPortalButton
                label={t("learner.billingPage.ctaPortal")}
                busyLabel={t("learner.billingPage.ctaPortalBusy")}
                errorFallback={t("learner.billingPage.portalError")}
              />
              <p className="text-xs text-muted-foreground">{t("learner.billingPage.managePortalReturnBlurb")}</p>
            </div>
          </div>
        ) : (
          <div className="p-5">
            <p className="text-sm text-muted-foreground">{t("learner.billingPage.portalUnavailable")}</p>
            <Link
              href="/pricing"
              className="mt-3 inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/80"
            >
              {t("learner.billingPage.ctaUpgrade")}
            </Link>
          </div>
        )}
      </section>

      {subscription ? (
        <details className="rounded-xl border border-border/60 bg-muted/10 px-4 py-3 text-sm">
          <summary className="cursor-pointer font-medium text-foreground">{t("learner.billingPage.supportReference")}</summary>
          <p className="mt-2 break-all font-mono text-xs text-muted-foreground">
            {t("learner.billingPage.refSubscription", { id: subscription.stripeSubscriptionId })}
          </p>
        </details>
      ) : null}

      <section className="nn-card p-6">
        <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">{t("learner.billingPage.accountToolsTitle")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("learner.billingPage.accountToolsSub")}</p>
        <div className="mt-4">
          <LearnerProfileAccountActions hasPassword={Boolean(user.passwordHash)} showBillingPortal={false} variant="passwordOnly" />
        </div>
        <div className="mt-8 border-t border-border/60 pt-6">
          <h3 className="text-sm font-semibold text-[var(--theme-heading-text)]">{t("learner.billingPage.policiesTitle")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t("learner.billingPage.policiesSub")}</p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <li>
              <Link className="font-medium text-primary underline" href="/terms">
                {t("learner.billingPage.policyTerms")}
              </Link>
            </li>
            <li>
              <Link className="font-medium text-primary underline" href="/privacy">
                {t("learner.billingPage.policyPrivacy")}
              </Link>
            </li>
            <li>
              <Link className="font-medium text-primary underline" href="/refund-policy">
                {t("learner.billingPage.policyRefunds")}
              </Link>
            </li>
            <li>
              <Link className="font-medium text-primary underline" href="/acceptable-use">
                {t("learner.billingPage.policyAcceptableUse")}
              </Link>
            </li>
            <li>
              <Link className="font-medium text-primary underline" href="/contact">
                {t("learner.billingPage.policyContact")}
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
