import "server-only";

import type Stripe from "stripe";
import { SubscriptionStatus, TierCode, TrialStatus, type CountryCode } from "@prisma/client";
import { isValidAlliedCareerKey } from "@/lib/allied/allied-billing-career-resolution";
import { getAlliedProfessionLockState } from "@/lib/allied/allied-profession-lock.server";
import { listAlliedProfessionsSorted } from "@/lib/allied/allied-professions-registry";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { listPathwaysCompatibleWithSubscription } from "@/lib/exam-pathways/pathway-entitlements";
import type { AccessScope } from "@/lib/entitlements/user-access-types";
import { deriveBillingSurface, type BillingStatusSurface } from "@/lib/learner/derive-billing-page-surface";
import type { BillingSubscriptionRow, BillingUserRow } from "@/lib/learner/billing-page-payload-types";
import { resolveEntitlementForPage, type PageEntitlementResult } from "@/lib/entitlements/resolve-entitlement-for-page";
import {
  pastDueGraceWindowEndMs,
  readPastDueEntitlementPolicy,
  readPastDueGraceDays,
} from "@/lib/entitlements/past-due-policy";
import { effectiveTierCountryForAccess } from "@/lib/entitlements/subscription-plan";
import { getVerifiedAdminLearnerQaSimulation } from "@/lib/admin/admin-learner-qa-simulation";
import { isLearnerEntitlementStaffBypassRole } from "@/lib/auth/staff-roles";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { getStripeClient } from "@/lib/stripe/stripe-client";
import {
  billingSubscriptionRowFromStripeSubscription,
  mergeBillingSubscriptionRowWithStripe,
} from "@/lib/subscriptions/stripe-subscription-billing-display";
import {
  canUserCancelStripeSubscription,
  reconcileUserSubscriptionFromStripe,
} from "@/lib/subscriptions/stripe-subscription-reconcile";
import { ALLIED_CAREER_DISPLAY_NAMES, type AlliedCareerKey } from "@/lib/pricing/display-catalog";

export type { BillingStatusSurface, BillingSubscriptionRow, BillingUserRow };

/** Stripe subscription fields when live API read succeeds — never guessed from DB alone. */
export type StripeRenewalSnapshot = {
  billingInterval: "day" | "week" | "month" | "year" | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
};

export type BillingPagePayload = {
  user: BillingUserRow;
  subscription: BillingSubscriptionRow | null;
  entitlement: PageEntitlementResult;
  /** Pathways unlocked by current entitlement (empty if no access). */
  pathwayLabels: string[];
  /** Stripe-backed renewal/interval; null when API unavailable or missing id. */
  stripeRenewal: StripeRenewalSnapshot | null;
  surface: BillingStatusSurface;
  showBillingPortal: boolean;
  /** End-of-period cancel from Account/Billing when Stripe shows an active manageable subscription. */
  showCancelSubscription: boolean;
  effectiveTier: TierCode;
  effectiveCountry: CountryCode | null;
  /** Trial end callout when trial is active, not expired, and no paid ACTIVE row. */
  showTrialEndCallout: boolean;
  /** When `surface` is `past_due_grace`, when premium access ends if payment is not fixed (min of grace anchor+days and period end). */
  pastDueGraceEndsAt: Date | null;
  /** Best-effort current period end (Stripe API, else DB) for “access until” copy. */
  billingPeriodEndDisplay: Date | null;
  /** Allied Health only — selected profession display + lock after subscription (support overrides excluded). */
  alliedProfessionSummary: {
    displayLabel: string | null;
    lockedAfterPurchase: boolean;
  } | null;
};

function tierHuman(tier: TierCode): string {
  switch (tier) {
    case "RN":
      return "RN (NCLEX-RN)";
    case "RPN":
      return "RPN";
    case "LVN_LPN":
      return "LPN / LVN";
    case "NP":
      return "NP";
    case "ALLIED":
      return "Allied health";
    default:
      return String(tier).replace(/_/g, " ");
  }
}

export function formatBillingTierLabel(tier: TierCode, country: CountryCode | string | null | undefined): string {
  const t = tierHuman(tier);
  const c = country != null && String(country).trim() !== "" ? String(country) : null;
  return c ? `${t} · ${c}` : t;
}

function stripeRenewalSnapshotFromSubscription(sub: Stripe.Subscription): StripeRenewalSnapshot {
  const item = sub.items.data[0];
  const rawInterval = item?.price?.recurring?.interval ?? (item?.plan as { interval?: string } | undefined)?.interval;
  const billingInterval =
    rawInterval === "day" || rawInterval === "week" || rawInterval === "month" || rawInterval === "year"
      ? rawInterval
      : null;
  const endSec = item?.current_period_end;
  const currentPeriodEnd = typeof endSec === "number" && endSec > 0 ? new Date(endSec * 1000) : null;
  return {
    billingInterval,
    currentPeriodEnd,
    cancelAtPeriodEnd: Boolean(sub.cancel_at_period_end),
  };
}

async function loadStripeRenewalSnapshot(stripeSubscriptionId: string | null | undefined): Promise<StripeRenewalSnapshot | null> {
  const sid = stripeSubscriptionId?.trim();
  if (!sid) return null;
  try {
    const stripe = await getStripeClient();
    if (!stripe) return null;
    const sub = await stripe.subscriptions.retrieve(sid);
    return stripeRenewalSnapshotFromSubscription(sub);
  } catch {
    return null;
  }
}

const SUBSCRIPTION_SELECT = {
  status: true,
  stripeSubscriptionId: true,
  stripeCustomerId: true,
  planTier: true,
  planCountry: true,
  alliedCareer: true,
  planDuration: true,
  currentPeriodEnd: true,
  trialEnd: true,
  cancelAtPeriodEnd: true,
  createdAt: true,
  updatedAt: true,
  pastDueSince: true,
} as const;

export async function loadBillingPagePayload(userId: string): Promise<BillingPagePayload | null> {
  if (!userId || !isDatabaseUrlConfigured()) return null;

  const [userRow, subscriptionRowBefore, qaSim] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        tier: true,
        country: true,
        role: true,
        trialStatus: true,
        trialEndsAt: true,
        trialStartedAt: true,
        learnerPath: true,
        passwordHash: true,
        alliedProfessionKey: true,
      },
    }),
    prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: SUBSCRIPTION_SELECT,
    }),
    getVerifiedAdminLearnerQaSimulation(userId),
  ]);

  if (!userRow) return null;

  const qaStaffSim = Boolean(qaSim && isLearnerEntitlementStaffBypassRole(userRow.role));

  let subscriptionRow = subscriptionRowBefore;
  let reconcileLiveSub: Stripe.Subscription | null = null;

  if (!qaStaffSim) {
    const stripe = await getStripeClient();
    /** Reconcile whenever Stripe is configured so stale/missing DB ids still resolve via customer list. */
    if (stripe) {
      const localSample = subscriptionRowBefore
        ? {
            stripeSubscriptionIdPrefix: subscriptionRowBefore.stripeSubscriptionId.slice(0, 12),
            stripeCustomerIdPrefix: subscriptionRowBefore.stripeCustomerId?.trim().slice(0, 10) ?? "",
            status: subscriptionRowBefore.status,
            cancelAtPeriodEnd: subscriptionRowBefore.cancelAtPeriodEnd,
          }
        : null;
      safeServerLog("subscription_reconcile", "billing_page_reconcile_enter", {
        userIdPrefix: userId.slice(0, 8),
        localBeforeJson: localSample ? JSON.stringify(localSample).slice(0, 400) : "no_local_row",
        severity: "info",
      });
      const r = await reconcileUserSubscriptionFromStripe(userId, { surface: "billing_page" });
      reconcileLiveSub = r.stripeSubscription;
      if (r.dbUpdated) {
        subscriptionRow = await prisma.subscription.findFirst({
          where: { userId },
          orderBy: { createdAt: "desc" },
          select: SUBSCRIPTION_SELECT,
        });
      }
    }
  }

  const entitlement = await resolveEntitlementForPage(userId);
  const hasAccess = entitlement !== "error" && entitlement.hasAccess;
  const entitlementReason: AccessScope["reason"] | "error" =
    entitlement === "error" ? "error" : entitlement.reason;

  const user: BillingUserRow = {
    tier: userRow.tier,
    country: String(userRow.country),
    role: userRow.role,
    trialStatus: userRow.trialStatus,
    trialEndsAt: userRow.trialEndsAt,
    trialStartedAt: userRow.trialStartedAt,
    learnerPath: userRow.learnerPath,
    passwordHash: userRow.passwordHash,
    alliedProfessionKey: userRow.alliedProfessionKey ?? null,
  };

  let subscription: BillingSubscriptionRow | null = subscriptionRow
    ? {
        status: subscriptionRow.status,
        stripeSubscriptionId: subscriptionRow.stripeSubscriptionId,
        stripeCustomerId: subscriptionRow.stripeCustomerId,
        planTier: subscriptionRow.planTier,
        planCountry: subscriptionRow.planCountry,
        alliedCareer: subscriptionRow.alliedCareer ?? null,
        cancelAtPeriodEnd: subscriptionRow.cancelAtPeriodEnd ?? false,
        createdAt: subscriptionRow.createdAt,
        updatedAt: subscriptionRow.updatedAt,
      }
    : null;

  if (reconcileLiveSub) {
    if (subscription) {
      const beforeStatus = subscription.status;
      const beforeCancel = subscription.cancelAtPeriodEnd;
      subscription = mergeBillingSubscriptionRowWithStripe(subscription, reconcileLiveSub);
      if (
        beforeStatus !== subscription.status ||
        beforeCancel !== subscription.cancelAtPeriodEnd ||
        (subscriptionRowBefore &&
          subscriptionRowBefore.stripeCustomerId?.trim() !== subscription.stripeCustomerId?.trim())
      ) {
        safeServerLog("subscription_reconcile", "billing_page_subscription_display_merged_from_stripe", {
          userIdPrefix: userId.slice(0, 8),
          dbStatus: subscriptionRowBefore?.status,
          displayStatus: subscription.status,
          cancelAtPeriodEndStripe: reconcileLiveSub.cancel_at_period_end ? 1 : 0,
          severity: "info",
        });
      }
    } else {
      const synthetic = billingSubscriptionRowFromStripeSubscription(reconcileLiveSub);
      if (synthetic) {
        subscription = synthetic;
        safeServerLog("subscription_reconcile", "billing_page_subscription_synthetic_from_stripe", {
          userIdPrefix: userId.slice(0, 8),
          displayStatus: synthetic.status,
          stripeSubscriptionIdPrefix: synthetic.stripeSubscriptionId.slice(0, 14),
          severity: "info",
        });
      }
    }
  }

  const subForEffective =
    subscription &&
    (subscription.status === SubscriptionStatus.ACTIVE ||
      subscription.status === SubscriptionStatus.GRACE ||
      (subscription.status === SubscriptionStatus.CANCELLED &&
        hasAccess &&
        entitlementReason === "canceled_paid_through"))
      ? {
          planTier: subscription.planTier,
          planCountry: subscription.planCountry,
        }
      : null;

  const tierCountry = effectiveTierCountryForAccess({ tier: user.tier, country: userRow.country }, subForEffective);
  let effectiveTier = tierCountry.tier;
  let effectiveCountry = tierCountry.country;

  if (qaStaffSim && entitlement !== "error") {
    if (entitlement.tier) effectiveTier = entitlement.tier;
    if (entitlement.country) effectiveCountry = entitlement.country;
  }

  const pathwayLabels =
    entitlement !== "error" && entitlement.hasAccess
      ? (await listPathwaysCompatibleWithSubscription(entitlement)).map((p) => p.shortName || p.displayName)
      : [];

  let stripeRenewal: StripeRenewalSnapshot | null = reconcileLiveSub
    ? stripeRenewalSnapshotFromSubscription(reconcileLiveSub)
    : await loadStripeRenewalSnapshot(subscription?.stripeSubscriptionId);
  if (!stripeRenewal && subscriptionRow?.currentPeriodEnd) {
    stripeRenewal = {
      billingInterval: null,
      currentPeriodEnd: subscriptionRow.currentPeriodEnd,
      cancelAtPeriodEnd: subscriptionRow.cancelAtPeriodEnd ?? false,
    };
  }
  if (qaStaffSim) {
    stripeRenewal = null;
  }

  const billingPeriodEndDisplay =
    stripeRenewal?.currentPeriodEnd ?? subscriptionRow?.currentPeriodEnd ?? null;

  const surface = deriveBillingSurface({
    user,
    subscription,
    hasAccess,
    entitlementReason,
    trialEndsAt: user.trialEndsAt,
    skipStaffAdminSurface: qaStaffSim,
    effectiveTier,
  });

  let pastDueGraceEndsAt: Date | null = null;
  if (
    subscription?.status === SubscriptionStatus.PAST_DUE &&
    hasAccess &&
    entitlementReason === "past_due_grace" &&
    subscriptionRow &&
    readPastDueEntitlementPolicy() === "grace"
  ) {
    const endMs = pastDueGraceWindowEndMs(
      {
        updatedAt: subscriptionRow.updatedAt,
        currentPeriodEnd: subscriptionRow.currentPeriodEnd,
        pastDueSince: subscriptionRow.pastDueSince,
      },
      readPastDueGraceDays(),
    );
    pastDueGraceEndsAt = new Date(endMs);
  }

  const portalEligibleSub =
    subscription &&
    (subscription.status === SubscriptionStatus.ACTIVE ||
      subscription.status === SubscriptionStatus.GRACE ||
      subscription.status === SubscriptionStatus.PAST_DUE ||
      subscription.status === SubscriptionStatus.CANCELLED);
  let showBillingPortal = Boolean(portalEligibleSub && subscription?.stripeCustomerId?.trim());
  if (qaStaffSim) {
    showBillingPortal = false;
  }

  const showCancelSubscription = Boolean(
    !qaStaffSim && reconcileLiveSub && canUserCancelStripeSubscription(reconcileLiveSub),
  );

  const now = Date.now();
  let showTrialEndCallout =
    user.trialStatus === TrialStatus.ACTIVE &&
    Boolean(user.trialEndsAt && user.trialEndsAt.getTime() > now) &&
    subscription?.status !== SubscriptionStatus.ACTIVE;
  if (qaStaffSim) {
    showTrialEndCallout = entitlement !== "error" && entitlement.reason === "active_trial";
  }

  let alliedProfessionSummary: BillingPagePayload["alliedProfessionSummary"] = null;
  if (effectiveTier === TierCode.ALLIED) {
    const lockState = await getAlliedProfessionLockState(userId);
    let displayLabel: string | null = null;
    const careerRaw = subscription?.alliedCareer?.trim();
    if (careerRaw && isValidAlliedCareerKey(careerRaw)) {
      displayLabel = ALLIED_CAREER_DISPLAY_NAMES[careerRaw as AlliedCareerKey];
    } else if (userRow.alliedProfessionKey?.trim()) {
      const pk = userRow.alliedProfessionKey.trim().toLowerCase();
      displayLabel = listAlliedProfessionsSorted().find((p) => p.professionKey === pk)?.h1 ?? pk;
    }
    alliedProfessionSummary = {
      displayLabel,
      lockedAfterPurchase: lockState.locked,
    };
  }

  return {
    user,
    subscription,
    entitlement,
    pathwayLabels,
    stripeRenewal,
    surface,
    showBillingPortal,
    showCancelSubscription,
    effectiveTier,
    effectiveCountry,
    showTrialEndCallout,
    pastDueGraceEndsAt,
    billingPeriodEndDisplay,
    alliedProfessionSummary,
  };
}
