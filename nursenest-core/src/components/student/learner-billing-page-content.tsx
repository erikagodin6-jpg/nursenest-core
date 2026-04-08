import Link from "next/link";
import { SubscriptionStatus } from "@prisma/client";
import type { BillingPagePayload } from "@/lib/learner/load-billing-page-payload";
import { formatBillingTierLabel } from "@/lib/learner/load-billing-page-payload";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { LearnerBillingPortalButton } from "@/components/student/learner-billing-portal-button";
import { LearnerProfileAccountActions } from "@/components/student/learner-profile-account-actions";

function subscriptionStatusLabel(status: SubscriptionStatus, t: LearnerMarketingT): string {
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

function StatusBanner({ surface, t }: { surface: BillingPagePayload["surface"]; t: LearnerMarketingT }) {
  const styles: Record<BillingPagePayload["surface"], string> = {
    active_paid: "border-emerald-500/25 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100",
    grace: "border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-100",
    past_due: "border-rose-500/30 bg-rose-500/10 text-rose-950 dark:text-rose-100",
    cancelled: "border-border bg-muted/30 text-foreground",
    trial: "border-primary/25 bg-primary/10 text-foreground",
    trial_ending: "border-amber-500/35 bg-amber-500/15 text-amber-950 dark:text-amber-100",
    inactive: "border-border bg-muted/20 text-muted-foreground",
    admin: "border-violet-500/25 bg-violet-500/10 text-violet-950 dark:text-violet-100",
  };
  const titleKey = `learner.billingPage.surface.${surface}.title` as const;
  const bodyKey = `learner.billingPage.surface.${surface}.body` as const;
  return (
    <div className={`rounded-2xl border px-4 py-4 sm:px-5 ${styles[surface]}`}>
      <p className="text-sm font-semibold">{t(titleKey)}</p>
      <p className="mt-2 text-sm leading-relaxed opacity-95">{t(bodyKey)}</p>
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
  } = payload;

  const planLabel = formatBillingTierLabel(effectiveTier, effectiveCountry);
  const accessOk = entitlement !== "error" && entitlement.hasAccess;
  const verifyFailed = entitlement === "error";

  return (
    <div className="space-y-8">
      {verifyFailed ? (
        <div className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-900 dark:text-rose-100">
          {t("learner.billingPage.verifyFailed")}
        </div>
      ) : null}

      <StatusBanner surface={surface} t={t} />

      <section className="overflow-hidden rounded-2xl border border-border/60 bg-[var(--bg-card)] shadow-sm">
        <div className="border-b border-border/60 bg-gradient-to-r from-primary/[0.06] to-transparent px-5 py-4">
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

      <section className="overflow-hidden rounded-2xl border border-border/60 bg-[var(--bg-card)] shadow-sm">
        <div className="border-b border-border/60 px-5 py-4">
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
              <p className="mt-1 text-xs font-medium text-amber-800 dark:text-amber-200">{t("learner.billingPage.cancelAtPeriodEnd")}</p>
            ) : null}
            {!stripeRenewal?.currentPeriodEnd ? (
              <p className="mt-1 text-xs text-muted-foreground">{t("learner.billingPage.renewalHint")}</p>
            ) : null}
          </div>
          {subscription ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.billingPage.recordStatus")}</dt>
              <dd className="mt-1 text-sm font-medium text-foreground">{subscriptionStatusLabel(subscription.status, t)}</dd>
            </div>
          ) : (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.billingPage.recordStatus")}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{t("learner.billingPage.noSubscriptionRow")}</dd>
            </div>
          )}
        </dl>

        <div className="flex flex-col gap-3 border-t border-border/50 px-5 py-5 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href="/pricing"
            className="inline-flex w-full items-center justify-center rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted/80 sm:w-auto"
          >
            {t("learner.billingPage.ctaUpgrade")}
          </Link>
          {showBillingPortal ? (
            <LearnerBillingPortalButton
              label={t("learner.billingPage.ctaPortal")}
              busyLabel={t("learner.billingPage.ctaPortalBusy")}
              errorFallback={t("learner.billingPage.portalError")}
            />
          ) : (
            <p className="text-sm text-muted-foreground sm:max-w-md">{t("learner.billingPage.portalUnavailable")}</p>
          )}
        </div>
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
