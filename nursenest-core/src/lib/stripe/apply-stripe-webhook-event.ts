import "server-only";
import type Stripe from "stripe";
import { Prisma, SubscriptionStatus, TierCode } from "@prisma/client";
import {
  canonicalProfessionKeyForAlliedCareer,
  isValidAlliedCareerKey,
} from "@/lib/allied/allied-billing-career-resolution";
import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  emitBillingAudit,
  emitEntitlementShiftFromRowTransition,
  emitSubscriptionStateChangedAudit,
  prefixStripeId,
  prefixUserId,
  tierToAuditString,
} from "@/lib/observability/billing-entitlement-audit";
import { analyticsDistinctId, captureServerEvent } from "@/lib/observability/posthog-server";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { productEvent } from "@/lib/observability/product-events";
import { findTierCountryByPriceId } from "@/lib/stripe/pricing-map";
import {
  billingLifecycleFields,
  firstSubscriptionPriceId,
  mapStripeSubscriptionStatus,
} from "@/lib/stripe/stripe-subscription-field-map";
import { planFromCheckoutMetadata } from "@/lib/stripe/checkout-plan-metadata";
import {
  syncUserFromCheckoutSessionMetadata,
  syncUserFromStripePriceId,
} from "@/lib/stripe/sync-user-from-stripe-subscription";
import {
  mergeSubscriptionCurrentPeriodEnds,
  subscriptionEntitlementEndMs,
} from "@/lib/entitlements/subscription-paid-access";
import { pastDueSinceForStatusTransition } from "@/lib/stripe/subscription-past-due-since";
import {
  scheduleOwnerPaidSubscriptionCheckoutNotificationsIfEligible,
  scheduleOwnerPaidSubscriptionInvoicePaymentSucceededNotification,
} from "@/lib/stripe/subscription-owner-notify";
import {
  adminPaidSubscriptionSmsInputFromSubscription,
  sendAdminPaidSubscriptionSms,
} from "@/lib/notifications/admin-paid-subscription-sms";
import {
  persistStripeSubscriptionMirrorForUser,
  resolveUserIdForOrphanStripeSubscription,
} from "@/lib/subscriptions/stripe-subscription-reconcile";
import { getStripeClient } from "@/lib/stripe/stripe-client";

type LifecycleData = ReturnType<typeof billingLifecycleFields>;

export type ApplyStripeWebhookContext = {
  correlation?: string;
};

async function resolveStripeCustomerEmail(stripe: Stripe, customerId: string | null | undefined): Promise<string | null> {
  const id = customerId?.trim();
  if (!id) return null;
  try {
    const customer = await stripe.customers.retrieve(id);
    if (customer.deleted || !("email" in customer)) return null;
    return typeof customer.email === "string" && customer.email.trim() ? customer.email.trim() : null;
  } catch {
    return null;
  }
}

async function notifyAdminPaidSubscriptionSms(args: {
  stripe: Stripe;
  event: Stripe.Event;
  userId: string | null | undefined;
  email: string | null | undefined;
  customerId: string | null | undefined;
  subscription: Stripe.Subscription | null | undefined;
  planName?: string | null;
  planTier?: TierCode | null;
}): Promise<void> {
  try {
    const input = adminPaidSubscriptionSmsInputFromSubscription(args);
    if (!input) {
      safeServerLog("stripe_webhook", "admin_paid_subscription_sms_skipped_no_input", {
        eventIdPrefix: args.event.id.slice(0, 12),
        stripeSubStatus: args.subscription?.status ?? "",
        hasEmail: Boolean(args.email?.trim()),
        hasCustomerId: Boolean(args.customerId?.trim()),
        severity: "info",
      });
      return;
    }
    const result = await sendAdminPaidSubscriptionSms(input);
    if (result.status === "failed") {
      safeServerLog("stripe_webhook", "admin_paid_subscription_sms_failed_non_blocking", {
        eventIdPrefix: args.event.id.slice(0, 12),
        reason: result.reason.slice(0, 160),
        severity: "warning",
      });
    } else {
      safeServerLog("stripe_webhook", "admin_paid_subscription_sms_outcome", {
        eventIdPrefix: args.event.id.slice(0, 12),
        outcome: result.status,
        reason: result.status === "skipped" ? result.reason.slice(0, 120) : undefined,
        severity: "info",
      });
    }
  } catch (e) {
    safeServerLog("stripe_webhook", "admin_paid_subscription_sms_exception_non_blocking", {
      eventIdPrefix: args.event.id.slice(0, 12),
      reason: e instanceof Error ? e.message.slice(0, 160) : "unknown",
      severity: "warning",
    });
  }
}

/**
 * **Source of truth (billing state)**
 *
 * - **Stripe** is authoritative for *whether money moved* and subscription lifecycle (`Subscription` on Stripe).
 * - **Our Postgres `Subscription` + `User` tier/country** are the **app mirror** used for entitlements (`getUserAccess`).
 * - **Entitlements** are computed **only** from DB via `getUserAccess` — never from client query params or redirect URLs.
 * - Webhooks + optional CLI reconcile apply Stripe → DB; checkout metadata must match server-created sessions.
 *
 * **Refunds / chargebacks:** `charge.refunded` is acknowledged for audit (`refund_processed`) only; subscription state
 * is still repaired by `customer.subscription.updated`, `customer.subscription.deleted`, and `invoice.*` plus reconciliation.
 * If Stripe cancels or ends a subscription after a refund, the subscription object update should arrive before
 * or after invoice events; `invoice.payment_succeeded` skips rows already marked `CANCELLED` in the database
 * to avoid briefly resurrecting access from a stale invoice webhook.
 */

function logBillingTransition(args: {
  kind: string;
  stripeSubscriptionId?: string;
  userId?: string;
  fromStatus?: SubscriptionStatus | null;
  toStatus?: SubscriptionStatus | null;
  stripeStatus?: string;
  eventIdPrefix: string;
  correlation: string;
  stripeEventType: string;
  stripeCustomerId?: string | null;
}): void {
  safeServerLog("billing_sync", "subscription_transition", {
    kind: args.kind,
    stripeSubscriptionIdPrefix: args.stripeSubscriptionId?.slice(0, 14),
    userIdPrefix: args.userId?.slice(0, 8),
    fromStatus: args.fromStatus ?? undefined,
    toStatus: args.toStatus ?? undefined,
    stripeStatus: args.stripeStatus,
    eventIdPrefix: args.eventIdPrefix,
    correlation: args.correlation,
    severity: "info",
  });
  emitSubscriptionStateChangedAudit({
    correlationId: args.correlation,
    userId: args.userId,
    stripeSubscriptionId: args.stripeSubscriptionId,
    stripeCustomerId: args.stripeCustomerId,
    priorStatus: args.fromStatus,
    newStatus: args.toStatus,
    source: "webhook",
    stripeEventType: args.stripeEventType,
    stripeEventIdPrefix: args.eventIdPrefix,
    transitionKind: args.kind,
  });
}

/**
 * Shared path for `customer.subscription.created` and `.updated` — same Stripe object shape.
 * Idempotent: upserts lifecycle + tier from price when row exists; creates nothing here (checkout creates row).
 */
async function applyCustomerSubscriptionUpsert(
  sub: Stripe.Subscription,
  ctx: ApplyStripeWebhookContext,
  eventIdPrefix: string,
  stripeEventType: string,
  stripeEventId: string,
): Promise<void> {
  const mappedStatus = mapStripeSubscriptionStatus(sub.status);
  const row = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: sub.id },
    select: {
      id: true,
      userId: true,
      status: true,
      updatedAt: true,
      currentPeriodEnd: true,
      pastDueSince: true,
      planTier: true,
      planCountry: true,
      stripeCustomerId: true,
      user: { select: { email: true } },
    },
  });
  const priceId = firstSubscriptionPriceId(sub);
  const mapped = priceId ? findTierCountryByPriceId(priceId) : undefined;
  const stripeSubMeta = (sub.metadata && typeof sub.metadata === "object" ? sub.metadata : {}) as Record<string, string>;
  const metadataPlan = planFromCheckoutMetadata(stripeSubMeta);
  if (priceId && !mapped) {
    safeServerLog("stripe_webhook", "unknown_subscription_price_id", {
      priceIdPrefix: priceId.slice(0, 28),
      eventIdPrefix,
      correlation: ctx.correlation ?? "",
    });
  }
  if (row?.userId && priceId) {
    await syncUserFromStripePriceId(row.userId, priceId, metadataPlan ?? row.planCountry ?? null);
  }
  if (!row) {
    const resolvedUserId = await resolveUserIdForOrphanStripeSubscription(sub);
    if (!resolvedUserId) {
      safeServerLog("billing_sync", "subscription_webhook_no_local_row", {
        stripeSubscriptionIdPrefix: sub.id.slice(0, 14),
        stripeStatus: sub.status,
        eventIdPrefix,
        correlation: ctx.correlation ?? "",
        hint: "No metadata userId or customer-linked Subscription row to attach this Stripe subscription",
      });
      return;
    }
    const persisted = await persistStripeSubscriptionMirrorForUser(resolvedUserId, sub);
    if (!persisted) {
      safeServerLog("billing_sync", "subscription_webhook_orphan_persist_skipped", {
        stripeSubscriptionIdPrefix: sub.id.slice(0, 14),
        resolvedUserIdPrefix: resolvedUserId.slice(0, 8),
        stripeStatus: sub.status,
        eventIdPrefix,
        correlation: ctx.correlation ?? "",
        severity: "info",
      });
      return;
    }
    const fresh = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: sub.id },
      select: {
        id: true,
        userId: true,
        status: true,
        updatedAt: true,
        currentPeriodEnd: true,
        pastDueSince: true,
        planTier: true,
        planCountry: true,
        stripeCustomerId: true,
        user: { select: { email: true } },
      },
    });
    if (!fresh) return;
    logBillingTransition({
      kind: "customer_subscription_upsert_orphan",
      stripeSubscriptionId: sub.id,
      userId: fresh.userId,
      fromStatus: undefined,
      toStatus: fresh.status,
      stripeStatus: sub.status,
      eventIdPrefix,
      correlation: ctx.correlation ?? "",
      stripeEventType,
      stripeCustomerId: fresh.stripeCustomerId ?? undefined,
    });
    emitEntitlementShiftFromRowTransition({
      correlationId: ctx.correlation,
      userId: fresh.userId,
      stripeSubscriptionId: sub.id,
      country: fresh.planCountry != null ? String(fresh.planCountry) : undefined,
      tier: tierToAuditString(fresh.planTier),
      before: {
        status: SubscriptionStatus.CANCELLED,
        updatedAt: new Date(0),
        currentPeriodEnd: null,
        pastDueSince: null,
      },
      after: {
        status: fresh.status,
        updatedAt: fresh.updatedAt,
        currentPeriodEnd: fresh.currentPeriodEnd,
        pastDueSince: fresh.pastDueSince,
      },
      source: "webhook",
      stripeEventType,
      stripeEventIdPrefix: eventIdPrefix,
    });
    const customerIdFromFresh =
      fresh.stripeCustomerId ??
      (typeof sub.customer === "string" ? sub.customer : sub.customer && "id" in sub.customer ? sub.customer.id : null);
    /** Same SDK instance as the rest of webhook handling; `getStripeClient` returns null when billing is not configured. */
    const stripeForNotify = await getStripeClient();
    if (stripeForNotify) {
      await notifyAdminPaidSubscriptionSms({
        stripe: stripeForNotify,
        event: {
          id: stripeEventId,
          type: stripeEventType,
          created: Math.floor(Date.now() / 1000),
        } as Stripe.Event,
        userId: fresh.userId,
        email:
          fresh.user.email ?? (await resolveStripeCustomerEmail(stripeForNotify, customerIdFromFresh)),
        customerId: customerIdFromFresh,
        subscription: sub,
        planName: fresh.planTier != null ? String(fresh.planTier) : null,
        planTier: fresh.planTier,
      });
    }
    return;
  }

  const lifecycle = billingLifecycleFields(sub);
  const customerIdFromSub =
    typeof sub.customer === "string" ? sub.customer : sub.customer && "id" in sub.customer ? sub.customer.id : null;
  const data: Prisma.SubscriptionUpdateInput = {
    cancelAtPeriodEnd: lifecycle.cancelAtPeriodEnd,
    ...(customerIdFromSub?.trim() ? { stripeCustomerId: customerIdFromSub.trim() } : {}),
  };
  if (lifecycle.currentPeriodEnd != null) {
    data.currentPeriodEnd = lifecycle.currentPeriodEnd;
  }
  if (lifecycle.trialEnd != null) {
    data.trialEnd = lifecycle.trialEnd;
  }
  if (mappedStatus !== null) {
    data.status = mappedStatus;
    const pastPatch = pastDueSinceForStatusTransition(mappedStatus, row.status);
    if (pastPatch) Object.assign(data, pastPatch);
  }
  const metaCareerRaw = stripeSubMeta.alliedCareer?.trim();

  const resolvedPlanTier = metadataPlan?.tier ?? mapped?.tier;
  const resolvedPlanCountry = metadataPlan?.country ?? mapped?.country;

  if (resolvedPlanTier) {
    data.planTier = resolvedPlanTier;
  }
  if (resolvedPlanCountry != null) {
    data.planCountry = resolvedPlanCountry;
  }
  if (mapped?.tier === TierCode.ALLIED || Boolean(metaCareerRaw)) {
    if (metaCareerRaw && isValidAlliedCareerKey(metaCareerRaw)) {
      data.alliedCareer = metaCareerRaw;
    } else if (mapped?.alliedCareer) {
      data.alliedCareer = mapped.alliedCareer;
    }
  }

  const updated = await prisma.subscription.update({
    where: { id: row.id },
    data,
    select: {
      status: true,
      updatedAt: true,
      currentPeriodEnd: true,
      trialEnd: true,
      pastDueSince: true,
      planTier: true,
      planCountry: true,
      alliedCareer: true,
    },
  });

  if (
    updated.planTier === TierCode.ALLIED &&
    row.userId &&
    updated.alliedCareer &&
    isValidAlliedCareerKey(updated.alliedCareer)
  ) {
    await prisma.user.update({
      where: { id: row.userId },
      data: {
        tier: TierCode.ALLIED,
        alliedProfessionKey: canonicalProfessionKeyForAlliedCareer(updated.alliedCareer),
      },
    });
  }

  const entitlementEndMs = subscriptionEntitlementEndMs({
    currentPeriodEnd: updated.currentPeriodEnd,
    trialEnd: updated.trialEnd,
  });
  const nowMs = Date.now();
  safeServerLog("billing_sync", "customer_subscription_upsert_entitlement_snapshot", {
    stripeCustomerIdPrefix: row.stripeCustomerId?.trim().slice(0, 12) ?? "",
    stripeSubscriptionIdPrefix: sub.id.slice(0, 14),
    stripeStatus: sub.status,
    cancelAtPeriodEnd: lifecycle.cancelAtPeriodEnd ? 1 : 0,
    currentPeriodEndIso: updated.currentPeriodEnd?.toISOString() ?? "",
    trialEndIso: updated.trialEnd?.toISOString() ?? "",
    dbStatus: String(updated.status),
    entitlementEndIso: entitlementEndMs != null ? new Date(entitlementEndMs).toISOString() : "",
    paidAccessWindowOpen: entitlementEndMs == null ? 1 : entitlementEndMs > nowMs ? 1 : 0,
    correlation: ctx.correlation ?? "",
    eventIdPrefix,
  });

  logBillingTransition({
    kind: "customer_subscription_upsert",
    stripeSubscriptionId: sub.id,
    userId: row.userId,
    fromStatus: row.status,
    toStatus: mappedStatus !== null ? mappedStatus : row.status,
    stripeStatus: sub.status,
    eventIdPrefix,
    correlation: ctx.correlation ?? "",
    stripeEventType,
    stripeCustomerId: row.stripeCustomerId ?? undefined,
  });

  emitEntitlementShiftFromRowTransition({
    correlationId: ctx.correlation,
    userId: row.userId,
    stripeSubscriptionId: sub.id,
    country: updated.planCountry != null ? String(updated.planCountry) : undefined,
    tier: tierToAuditString(updated.planTier),
    before: {
      status: row.status,
      updatedAt: row.updatedAt,
      currentPeriodEnd: row.currentPeriodEnd,
      pastDueSince: row.pastDueSince,
    },
    after: {
      status: updated.status,
      updatedAt: updated.updatedAt,
      currentPeriodEnd: updated.currentPeriodEnd,
      pastDueSince: updated.pastDueSince,
    },
    source: "webhook",
    stripeEventType,
    stripeEventIdPrefix: eventIdPrefix,
  });
}

export async function applyStripeWebhookEvent(
  stripe: Stripe,
  event: Stripe.Event,
  ctx?: ApplyStripeWebhookContext,
): Promise<void> {
  const eventIdPrefix = event.id.slice(0, 12);
  const correlation = ctx?.correlation ?? "";

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId ?? session.client_reference_id ?? undefined;
    const subId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
    if (userId && subId) {
      const plan = planFromCheckoutMetadata(session.metadata ?? undefined);
      const durationMeta = session.metadata?.duration ?? undefined;
      const alliedCareerMeta = plan?.alliedCareer ?? session.metadata?.alliedCareer ?? undefined;
      if (!plan) {
        safeServerLog("stripe_webhook", "checkout_missing_plan_metadata", {
          hasMetadata: session.metadata && Object.keys(session.metadata).length > 0 ? 1 : 0,
          eventIdPrefix,
          correlation,
        });
      }

      let lifecycle: LifecycleData = { cancelAtPeriodEnd: false };
      let stripeSubStatus: Stripe.Subscription.Status | null = null;
      let stripeSubscription: Stripe.Subscription | null = null;
      try {
        stripeSubscription = await stripe.subscriptions.retrieve(subId);
        lifecycle = billingLifecycleFields(stripeSubscription);
        stripeSubStatus = stripeSubscription.status;
      } catch {
        safeServerLog("stripe_webhook", "lifecycle_fetch_failed_checkout", {
          eventIdPrefix,
          correlation,
          severity: "warning",
        });
      }

      /**
       * Stripe subscription status is authoritative once retrieved. `mapStripeSubscriptionStatus`:
       * trialing/active → ACTIVE; past_due/unpaid → PAST_DUE; canceled/incomplete_expired → CANCELLED;
       * incomplete/paused → `null` (subscription.updated avoids clobbering; checkout must pick a concrete row status).
       * If retrieve fails, do **not** assume ACTIVE — row is created CANCELLED until a later webhook/reconcile.
       */
      let statusForDb: SubscriptionStatus;
      let mappedFromStripe: SubscriptionStatus | null = null;
      if (stripeSubStatus === null) {
        statusForDb = SubscriptionStatus.CANCELLED;
        safeServerLog("stripe_webhook", "checkout_subscription_status_unknown_after_retrieve_failure", {
          eventIdPrefix,
          correlation,
          severity: "warning",
        });
      } else {
        mappedFromStripe = mapStripeSubscriptionStatus(stripeSubStatus);
        statusForDb =
          mappedFromStripe ??
          (stripeSubStatus === "incomplete" || stripeSubStatus === "paused"
            ? SubscriptionStatus.CANCELLED
            : SubscriptionStatus.ACTIVE);

        if (mappedFromStripe === null) {
          safeServerLog("stripe_webhook", "checkout_status_mapped_fallback", {
            stripeStatus: stripeSubStatus,
            statusForDb,
            eventIdPrefix,
            correlation,
          });
        }
      }

      const activeBefore = await prisma.subscription.count({
        where: { userId, status: SubscriptionStatus.ACTIVE },
      });
      const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? "";
      const planCodeMeta = session.metadata?.planCode?.trim() || undefined;
      const billingRegionMeta = session.metadata?.region?.trim() || undefined;

      if (plan?.tier === TierCode.ALLIED && !alliedCareerMeta) {
        safeServerLog("stripe_webhook", "allied_checkout_missing_occupation_metadata", {
          userIdPrefix: userId.slice(0, 8),
          stripeSessionIdPrefix: session.id.slice(0, 14),
          eventIdPrefix,
          correlation,
          severity: "warning",
        });
      }

      const priorCheckoutRow = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: subId },
        select: {
          status: true,
          updatedAt: true,
          currentPeriodEnd: true,
          pastDueSince: true,
          planTier: true,
          planCountry: true,
        },
      });

      await prisma.$transaction(async (tx) => {
        await tx.subscription.upsert({
          where: { stripeSubscriptionId: subId },
          update: {
            status: statusForDb,
            pastDueSince: null,
            ...(customerId.trim() ? { stripeCustomerId: customerId.trim() } : {}),
            ...(plan?.tier ? { planTier: plan.tier } : {}),
            ...(plan?.country != null ? { planCountry: plan.country } : {}),
            ...(durationMeta ? { planDuration: durationMeta } : {}),
            ...(alliedCareerMeta ? { alliedCareer: alliedCareerMeta } : {}),
            ...(planCodeMeta ? { planCode: planCodeMeta } : {}),
            ...(billingRegionMeta ? { billingRegionSlug: billingRegionMeta } : {}),
            currentPeriodEnd: lifecycle.currentPeriodEnd ?? null,
            trialEnd: lifecycle.trialEnd ?? null,
            cancelAtPeriodEnd: lifecycle.cancelAtPeriodEnd,
          },
          create: {
            userId,
            status: statusForDb,
            pastDueSince: null,
            stripeSubscriptionId: subId,
            stripeCustomerId: customerId,
            planTier: plan?.tier,
            planCountry: plan ? plan.country : undefined,
            planDuration: durationMeta,
            planCode: planCodeMeta,
            billingRegionSlug: billingRegionMeta,
            alliedCareer: alliedCareerMeta,
            currentPeriodEnd: lifecycle.currentPeriodEnd,
            trialEnd: lifecycle.trialEnd,
            cancelAtPeriodEnd: lifecycle.cancelAtPeriodEnd,
          },
        });
      });

      const afterCheckoutRow = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: subId },
        select: {
          status: true,
          updatedAt: true,
          currentPeriodEnd: true,
          pastDueSince: true,
          planTier: true,
          planCountry: true,
        },
      });

      emitBillingAudit("checkout_completed", {
        correlationId: correlation,
        userIdPrefix: prefixUserId(userId),
        subscriptionIdPrefix: prefixStripeId(subId),
        customerIdPrefix: prefixStripeId(customerId, 12),
        country: plan?.country != null ? String(plan.country) : undefined,
        tier: plan?.tier != null ? String(plan.tier) : undefined,
        newState: String(statusForDb),
        priorState: priorCheckoutRow ? String(priorCheckoutRow.status) : "none",
        source: "webhook",
        stripeEventType: event.type,
        stripeEventIdPrefix: eventIdPrefix,
      });

      logBillingTransition({
        kind: "checkout_session_completed",
        stripeSubscriptionId: subId,
        userId,
        fromStatus: priorCheckoutRow?.status,
        toStatus: statusForDb,
        stripeStatus: stripeSubStatus ?? "unknown_after_retrieve_failure",
        eventIdPrefix,
        correlation,
        stripeEventType: event.type,
        stripeCustomerId: customerId || undefined,
      });

      if (afterCheckoutRow) {
        const beforeSnap = priorCheckoutRow ?? {
          status: SubscriptionStatus.CANCELLED,
          updatedAt: new Date(0),
          currentPeriodEnd: null,
          pastDueSince: null,
        };
        emitEntitlementShiftFromRowTransition({
          correlationId: correlation,
          userId,
          stripeSubscriptionId: subId,
          country: afterCheckoutRow.planCountry != null ? String(afterCheckoutRow.planCountry) : undefined,
          tier: tierToAuditString(afterCheckoutRow.planTier),
          before: {
            status: beforeSnap.status,
            updatedAt: beforeSnap.updatedAt,
            currentPeriodEnd: beforeSnap.currentPeriodEnd,
            pastDueSince: beforeSnap.pastDueSince,
          },
          after: {
            status: afterCheckoutRow.status,
            updatedAt: afterCheckoutRow.updatedAt,
            currentPeriodEnd: afterCheckoutRow.currentPeriodEnd,
            pastDueSince: afterCheckoutRow.pastDueSince,
          },
          source: "webhook",
          stripeEventType: event.type,
          stripeEventIdPrefix: eventIdPrefix,
        });
      }

      if (activeBefore === 0 && statusForDb === SubscriptionStatus.ACTIVE) {
        void captureServerEvent(analyticsDistinctId(userId), PH.learnerConversionSubscribed, {
          actor: "authenticated",
          funnel_step: "paid_subscription_active",
          country: plan?.country != null ? String(plan.country) : undefined,
          tier: plan?.tier ? String(plan.tier) : undefined,
          source: "stripe_checkout_session_completed",
        });
      }
      await syncUserFromCheckoutSessionMetadata(userId, session.metadata ?? undefined);

      scheduleOwnerPaidSubscriptionCheckoutNotificationsIfEligible({
        stripe,
        event,
        session,
        userId,
        subscriptionId: subId,
        customerId,
        stripeSubscription,
        stripeSubStatus,
        statusForDb,
        planTier: plan?.tier,
        planTierLabel: plan?.tier != null ? String(plan.tier) : null,
        planCountryLabel: plan?.country != null ? String(plan.country) : null,
        billingRegionSlug: billingRegionMeta,
        correlation,
      });

      const checkoutEmail =
        session.customer_email ??
        (session.customer_details && typeof session.customer_details === "object"
          ? (session.customer_details as { email?: string | null }).email
          : null) ??
        (customerId ? await resolveStripeCustomerEmail(stripe, customerId) : null);
      await notifyAdminPaidSubscriptionSms({
        stripe,
        event,
        userId,
        email: checkoutEmail,
        customerId,
        subscription: stripeSubscription,
        planName: plan?.tier != null ? String(plan.tier) : null,
        planTier: plan?.tier,
      });
    }
    productEvent("stripe_webhook_ok", { eventType: event.type });
    return;
  }

  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    await applyCustomerSubscriptionUpsert(sub, ctx ?? {}, eventIdPrefix, event.type, event.id);
    productEvent("stripe_webhook_ok", { eventType: event.type });
    return;
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const lifecycle = billingLifecycleFields(sub);
    const existing = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: sub.id },
      select: {
        id: true,
        status: true,
        userId: true,
        updatedAt: true,
        currentPeriodEnd: true,
        trialEnd: true,
        pastDueSince: true,
        planTier: true,
        planCountry: true,
        stripeCustomerId: true,
      },
    });
    if (existing) {
      const pastPatch = pastDueSinceForStatusTransition(SubscriptionStatus.CANCELLED, existing.status);
      const mergedPeriodEnd = mergeSubscriptionCurrentPeriodEnds(lifecycle.currentPeriodEnd, existing.currentPeriodEnd);
      const deletedUpdate: Prisma.SubscriptionUpdateInput = {
        status: SubscriptionStatus.CANCELLED,
        cancelAtPeriodEnd: lifecycle.cancelAtPeriodEnd,
        currentPeriodEnd: mergedPeriodEnd,
        ...(pastPatch ?? {}),
      };
      if (lifecycle.trialEnd != null) {
        deletedUpdate.trialEnd = lifecycle.trialEnd;
      }
      const updated = await prisma.subscription.update({
        where: { id: existing.id },
        data: deletedUpdate,
        select: {
          status: true,
          updatedAt: true,
          currentPeriodEnd: true,
          trialEnd: true,
          pastDueSince: true,
          planTier: true,
          planCountry: true,
        },
      });
      const delEntitlementEndMs = subscriptionEntitlementEndMs({
        currentPeriodEnd: updated.currentPeriodEnd,
        trialEnd: updated.trialEnd,
      });
      const delNow = Date.now();
      safeServerLog("billing_sync", "customer_subscription_deleted_entitlement_snapshot", {
        stripeCustomerIdPrefix: existing.stripeCustomerId?.trim().slice(0, 12) ?? "",
        stripeSubscriptionIdPrefix: sub.id.slice(0, 14),
        stripeStatus: sub.status,
        cancelAtPeriodEnd: lifecycle.cancelAtPeriodEnd ? 1 : 0,
        currentPeriodEndIso: updated.currentPeriodEnd?.toISOString() ?? "",
        trialEndIso: updated.trialEnd?.toISOString() ?? "",
        dbStatus: String(updated.status),
        entitlementEndIso: delEntitlementEndMs != null ? new Date(delEntitlementEndMs).toISOString() : "",
        paidAccessWindowOpen: delEntitlementEndMs == null ? 0 : delEntitlementEndMs > delNow ? 1 : 0,
        correlation,
        eventIdPrefix,
      });
      logBillingTransition({
        kind: "customer_subscription_deleted",
        stripeSubscriptionId: sub.id,
        userId: existing.userId,
        fromStatus: existing.status,
        toStatus: SubscriptionStatus.CANCELLED,
        stripeStatus: sub.status,
        eventIdPrefix,
        correlation,
        stripeEventType: event.type,
        stripeCustomerId: existing.stripeCustomerId,
      });
      emitEntitlementShiftFromRowTransition({
        correlationId: correlation,
        userId: existing.userId,
        stripeSubscriptionId: sub.id,
        country: updated.planCountry != null ? String(updated.planCountry) : undefined,
        tier: tierToAuditString(updated.planTier),
        before: {
          status: existing.status,
          updatedAt: existing.updatedAt,
          currentPeriodEnd: existing.currentPeriodEnd,
          pastDueSince: existing.pastDueSince,
        },
        after: {
          status: updated.status,
          updatedAt: updated.updatedAt,
          currentPeriodEnd: updated.currentPeriodEnd,
          pastDueSince: updated.pastDueSince,
        },
        source: "webhook",
        stripeEventType: event.type,
        stripeEventIdPrefix: eventIdPrefix,
      });
    }
    productEvent("stripe_webhook_ok", { eventType: event.type });
    return;
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
    const billingReason = (invoice as Stripe.Invoice & { billing_reason?: string | null }).billing_reason;
    const subRaw = (invoice as unknown as { subscription?: string | { id: string } | null }).subscription;
    const subId = typeof subRaw === "string" ? subRaw : subRaw?.id;
    if (subId) {
      let invoiceStripeSubscription: Stripe.Subscription | null = null;
      const row = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: subId },
        select: {
          id: true,
          status: true,
          userId: true,
          updatedAt: true,
          currentPeriodEnd: true,
          pastDueSince: true,
          planTier: true,
          planCountry: true,
          billingRegionSlug: true,
          stripeCustomerId: true,
        },
      });
      let invoiceSucceededSkippedCancelled = false;
      if (row) {
        if (row.status === SubscriptionStatus.CANCELLED) {
          try {
            invoiceStripeSubscription = await stripe.subscriptions.retrieve(subId);
          } catch (e) {
            safeServerLog("billing_sync", "invoice_payment_succeeded_stripe_retrieve_failed", {
              stripeSubscriptionIdPrefix: subId.slice(0, 14),
              userIdPrefix: row.userId.slice(0, 8),
              eventIdPrefix,
              correlation,
              severity: "warning",
              message: e instanceof Error ? e.message.slice(0, 160) : "unknown",
            });
          }
          const mappedFromStripe = invoiceStripeSubscription ? mapStripeSubscriptionStatus(invoiceStripeSubscription.status) : null;
          const canResurrect =
            Boolean(invoiceStripeSubscription) &&
            mappedFromStripe !== null &&
            mappedFromStripe !== SubscriptionStatus.CANCELLED;

          if (!canResurrect) {
            invoiceSucceededSkippedCancelled = true;
            safeServerLog("billing_sync", "invoice_payment_succeeded_skipped_cancelled_row", {
              stripeSubscriptionIdPrefix: subId.slice(0, 14),
              userIdPrefix: row.userId.slice(0, 8),
              eventIdPrefix,
              correlation,
              severity: "info",
              stripeStatus: invoiceStripeSubscription?.status,
              hint: "DB row was cancelled and Stripe subscription is not in a paying/active state",
            });
          } else {
            const lifecycle = billingLifecycleFields(invoiceStripeSubscription!);
            const pastPatch = pastDueSinceForStatusTransition(mappedFromStripe!, row.status);
            const updated = await prisma.subscription.update({
              where: { id: row.id },
              data: {
                status: mappedFromStripe!,
                currentPeriodEnd: lifecycle.currentPeriodEnd ?? undefined,
                trialEnd: lifecycle.trialEnd ?? null,
                cancelAtPeriodEnd: lifecycle.cancelAtPeriodEnd,
                ...(pastPatch ?? {}),
              },
              select: {
                status: true,
                updatedAt: true,
                currentPeriodEnd: true,
                pastDueSince: true,
                planTier: true,
                planCountry: true,
              },
            });
            logBillingTransition({
              kind: "invoice_payment_succeeded_resurrect",
              stripeSubscriptionId: subId,
              userId: row.userId,
              fromStatus: row.status,
              toStatus: mappedFromStripe!,
              stripeStatus: invoiceStripeSubscription!.status,
              eventIdPrefix,
              correlation,
              stripeEventType: event.type,
              stripeCustomerId: row.stripeCustomerId,
            });
            emitEntitlementShiftFromRowTransition({
              correlationId: correlation,
              userId: row.userId,
              stripeSubscriptionId: subId,
              country: updated.planCountry != null ? String(updated.planCountry) : undefined,
              tier: tierToAuditString(updated.planTier),
              before: {
                status: row.status,
                updatedAt: row.updatedAt,
                currentPeriodEnd: row.currentPeriodEnd,
                pastDueSince: row.pastDueSince,
              },
              after: {
                status: updated.status,
                updatedAt: updated.updatedAt,
                currentPeriodEnd: updated.currentPeriodEnd,
                pastDueSince: updated.pastDueSince,
              },
              source: "webhook",
              stripeEventType: event.type,
              stripeEventIdPrefix: eventIdPrefix,
            });
          }
        } else {
          try {
            invoiceStripeSubscription = await stripe.subscriptions.retrieve(subId);
          } catch (e) {
            safeServerLog("billing_sync", "invoice_payment_succeeded_stripe_retrieve_failed", {
              stripeSubscriptionIdPrefix: subId.slice(0, 14),
              userIdPrefix: row.userId.slice(0, 8),
              eventIdPrefix,
              correlation,
              severity: "warning",
              message: e instanceof Error ? e.message.slice(0, 160) : "unknown",
            });
          }
          const pastPatch = pastDueSinceForStatusTransition(SubscriptionStatus.ACTIVE, row.status);
          const updated = await prisma.subscription.update({
            where: { id: row.id },
            data: {
              status: SubscriptionStatus.ACTIVE,
              ...(pastPatch ?? {}),
            },
            select: {
              status: true,
              updatedAt: true,
              currentPeriodEnd: true,
              pastDueSince: true,
              planTier: true,
              planCountry: true,
            },
          });
          logBillingTransition({
            kind: "invoice_payment_succeeded",
            stripeSubscriptionId: subId,
            userId: row.userId,
            fromStatus: row.status,
            toStatus: SubscriptionStatus.ACTIVE,
            eventIdPrefix,
            correlation,
            stripeEventType: event.type,
            stripeCustomerId: row.stripeCustomerId,
          });
          emitEntitlementShiftFromRowTransition({
            correlationId: correlation,
            userId: row.userId,
            stripeSubscriptionId: subId,
            country: updated.planCountry != null ? String(updated.planCountry) : undefined,
            tier: tierToAuditString(updated.planTier),
            before: {
              status: row.status,
              updatedAt: row.updatedAt,
              currentPeriodEnd: row.currentPeriodEnd,
              pastDueSince: row.pastDueSince,
            },
            after: {
              status: updated.status,
              updatedAt: updated.updatedAt,
              currentPeriodEnd: updated.currentPeriodEnd,
              pastDueSince: updated.pastDueSince,
            },
            source: "webhook",
            stripeEventType: event.type,
            stripeEventIdPrefix: eventIdPrefix,
          });
        }
      }
      const invoiceCustomerId =
        typeof invoice.customer === "string"
          ? invoice.customer
          : invoice.customer && typeof invoice.customer === "object" && "id" in invoice.customer
            ? invoice.customer.id
            : row?.stripeCustomerId ?? null;
      if (billingReason === "subscription_create" && !invoiceSucceededSkippedCancelled) {
        if (!invoiceStripeSubscription) {
          try {
            invoiceStripeSubscription = await stripe.subscriptions.retrieve(subId);
          } catch (e) {
            safeServerLog("billing_sync", "invoice_payment_succeeded_notification_subscription_fetch_failed", {
              stripeSubscriptionIdPrefix: subId.slice(0, 14),
              eventIdPrefix,
              correlation,
              severity: "warning",
              message: e instanceof Error ? e.message.slice(0, 160) : "unknown",
            });
          }
        }
        scheduleOwnerPaidSubscriptionInvoicePaymentSucceededNotification({
          stripe,
          event,
          invoice,
          billingReason,
          userId: row?.userId ?? null,
          subscriptionId: subId,
          customerId: invoiceCustomerId,
          stripeSubscription: invoiceStripeSubscription,
          subscriptionStatus: invoiceStripeSubscription?.status ?? (row ? String(row.status) : null),
          planTierLabel: row?.planTier != null ? String(row.planTier) : null,
          planCountryLabel: row?.planCountry != null ? String(row.planCountry) : null,
          billingRegionSlug: row?.billingRegionSlug ?? null,
          correlation,
          paymentKind: "first_payment",
        });
      } else if (billingReason === "subscription_cycle") {
        safeServerLog("stripe_owner_subscription_notify", "invoice_notification_skipped", {
          reason: "renewal_invoice",
          eventIdPrefix,
          customerEmail: "unknown",
          severity: "info",
        });
      }
      if (billingReason === "subscription_cycle" && !invoiceSucceededSkippedCancelled && row?.userId) {
        void captureServerEvent(analyticsDistinctId(row.userId), PH.funnelSubscriptionRenewed, {
          source: "stripe_invoice_payment_succeeded",
          billing_reason: billingReason,
        });
      }
    }
    productEvent("stripe_webhook_ok", { eventType: event.type });
    return;
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const subRaw = (invoice as unknown as { subscription?: string | { id: string } | null }).subscription;
    const subId = typeof subRaw === "string" ? subRaw : subRaw?.id;
    if (subId) {
      const row = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: subId },
        select: {
          id: true,
          status: true,
          userId: true,
          updatedAt: true,
          currentPeriodEnd: true,
          pastDueSince: true,
          planTier: true,
          planCountry: true,
          stripeCustomerId: true,
        },
      });
      if (row) {
        const pastPatch = pastDueSinceForStatusTransition(SubscriptionStatus.PAST_DUE, row.status);
        const updated = await prisma.subscription.update({
          where: { id: row.id },
          data: {
            status: SubscriptionStatus.PAST_DUE,
            ...(pastPatch ?? {}),
          },
          select: {
            status: true,
            updatedAt: true,
            currentPeriodEnd: true,
            pastDueSince: true,
            planTier: true,
            planCountry: true,
          },
        });
        logBillingTransition({
          kind: "invoice_payment_failed",
          stripeSubscriptionId: subId,
          userId: row.userId,
          fromStatus: row.status,
          toStatus: SubscriptionStatus.PAST_DUE,
          eventIdPrefix,
          correlation,
          stripeEventType: event.type,
          stripeCustomerId: row.stripeCustomerId,
        });
        emitEntitlementShiftFromRowTransition({
          correlationId: correlation,
          userId: row.userId,
          stripeSubscriptionId: subId,
          country: updated.planCountry != null ? String(updated.planCountry) : undefined,
          tier: tierToAuditString(updated.planTier),
          before: {
            status: row.status,
            updatedAt: row.updatedAt,
            currentPeriodEnd: row.currentPeriodEnd,
            pastDueSince: row.pastDueSince,
          },
          after: {
            status: updated.status,
            updatedAt: updated.updatedAt,
            currentPeriodEnd: updated.currentPeriodEnd,
            pastDueSince: updated.pastDueSince,
          },
          source: "webhook",
          stripeEventType: event.type,
          stripeEventIdPrefix: eventIdPrefix,
        });
      }
    }
    productEvent("stripe_webhook_ok", { eventType: event.type });
    return;
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    const chId = charge.id;
    const currency = charge.currency ?? undefined;
    const customerRaw = charge.customer;
    const customerStr =
      typeof customerRaw === "string" ? customerRaw : customerRaw && typeof customerRaw === "object" && "id" in customerRaw
        ? String((customerRaw as { id: string }).id)
        : undefined;
    emitBillingAudit("refund_processed", {
      correlationId: correlation,
      customerIdPrefix: prefixStripeId(customerStr, 12),
      subscriptionIdPrefix: undefined,
      reason: charge.refunded ? "charge_refunded" : "charge_partial_event",
      source: "webhook",
      stripeEventType: event.type,
      stripeEventIdPrefix: eventIdPrefix,
      refundChargeIdPrefix: prefixStripeId(chId, 14),
      currency,
      severity: "info",
    });
    productEvent("stripe_webhook_ok", { eventType: event.type });
    return;
  }
}
