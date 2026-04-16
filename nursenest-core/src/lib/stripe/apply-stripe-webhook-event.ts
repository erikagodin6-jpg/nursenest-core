import "server-only";
import type Stripe from "stripe";
import { Prisma, SubscriptionStatus } from "@prisma/client";
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
import { pastDueSinceForStatusTransition } from "@/lib/stripe/subscription-past-due-since";

type LifecycleData = ReturnType<typeof billingLifecycleFields>;

export type ApplyStripeWebhookContext = {
  correlation?: string;
};

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
    },
  });
  const priceId = firstSubscriptionPriceId(sub);
  const mapped = priceId ? findTierCountryByPriceId(priceId) : undefined;
  if (priceId && !mapped) {
    safeServerLog("stripe_webhook", "unknown_subscription_price_id", {
      priceIdPrefix: priceId.slice(0, 28),
      eventIdPrefix,
      correlation: ctx.correlation ?? "",
    });
  }
  if (row?.userId && priceId) {
    await syncUserFromStripePriceId(row.userId, priceId);
  }
  if (!row) {
    safeServerLog("billing_sync", "subscription_webhook_no_local_row", {
      stripeSubscriptionIdPrefix: sub.id.slice(0, 14),
      stripeStatus: sub.status,
      eventIdPrefix,
      correlation: ctx.correlation ?? "",
      hint: "checkout.session.completed normally creates the row first",
    });
    return;
  }

  const lifecycle = billingLifecycleFields(sub);
  const data: Prisma.SubscriptionUpdateInput = {
    currentPeriodEnd: lifecycle.currentPeriodEnd ?? null,
    trialEnd: lifecycle.trialEnd ?? null,
    cancelAtPeriodEnd: lifecycle.cancelAtPeriodEnd,
  };
  if (mappedStatus !== null) {
    data.status = mappedStatus;
    const pastPatch = pastDueSinceForStatusTransition(mappedStatus, row.status);
    if (pastPatch) Object.assign(data, pastPatch);
  }
  if (mapped) {
    data.planTier = mapped.tier;
    data.planCountry = mapped.country;
    if (mapped.alliedCareer) data.alliedCareer = mapped.alliedCareer;
  }

  const updated = await prisma.subscription.update({
    where: { id: row.id },
    data,
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
      try {
        const stripeSub = await stripe.subscriptions.retrieve(subId);
        lifecycle = billingLifecycleFields(stripeSub);
        stripeSubStatus = stripeSub.status;
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
          country: plan?.country,
          tier: plan?.tier ? String(plan.tier) : undefined,
          source: "stripe_checkout_session_completed",
        });
      }
      await syncUserFromCheckoutSessionMetadata(userId, session.metadata ?? undefined);
    }
    productEvent("stripe_webhook_ok", { eventType: event.type });
    return;
  }

  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    await applyCustomerSubscriptionUpsert(sub, ctx ?? {}, eventIdPrefix, event.type);
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
        pastDueSince: true,
        planTier: true,
        planCountry: true,
        stripeCustomerId: true,
      },
    });
    if (existing) {
      const pastPatch = pastDueSinceForStatusTransition(SubscriptionStatus.CANCELLED, existing.status);
      const updated = await prisma.subscription.update({
        where: { id: existing.id },
        data: {
          status: SubscriptionStatus.CANCELLED,
          cancelAtPeriodEnd: lifecycle.cancelAtPeriodEnd,
          currentPeriodEnd: lifecycle.currentPeriodEnd ?? null,
          trialEnd: lifecycle.trialEnd ?? null,
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
      let invoiceSucceededSkippedCancelled = false;
      if (row) {
        if (row.status === SubscriptionStatus.CANCELLED) {
          invoiceSucceededSkippedCancelled = true;
          safeServerLog("billing_sync", "invoice_payment_succeeded_skipped_cancelled_row", {
            stripeSubscriptionIdPrefix: subId.slice(0, 14),
            userIdPrefix: row.userId.slice(0, 8),
            eventIdPrefix,
            correlation,
            severity: "info",
            hint: "Avoid resurrecting ACTIVE after refund/cancel; wait for subscription.updated or reconcile",
          });
        } else {
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
