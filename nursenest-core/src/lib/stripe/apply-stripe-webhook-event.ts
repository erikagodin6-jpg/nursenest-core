import "server-only";
import type Stripe from "stripe";
import { Prisma, SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { analyticsDistinctId, captureServerEvent } from "@/lib/observability/posthog-server";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { productEvent } from "@/lib/observability/product-events";
import { findTierCountryByPriceId } from "@/lib/stripe/pricing-map";
import {
  billingLifecycleFields,
  firstSubscriptionPriceId,
  mapStripeSubscriptionStatus,
} from "@/lib/stripe/stripe-subscription-field-map";
import {
  planFromCheckoutMetadata,
  syncUserFromCheckoutSessionMetadata,
  syncUserFromStripePriceId,
} from "@/lib/stripe/sync-user-from-stripe-subscription";
import { pastDueSinceForStatusTransition } from "@/lib/stripe/subscription-past-due-since";

type LifecycleData = ReturnType<typeof billingLifecycleFields>;

export type ApplyStripeWebhookContext = {
  /** From {@link correlationIdFromRequest} — ties handler logs to platform request ids. */
  correlation?: string;
};

/**
 * Applies Stripe webhook side effects (subscription + user rows). Idempotent where Prisma upserts allow.
 * **Does not** record `StripeWebhookEvent` — the route persists the event id only after this succeeds
 * so crashes mid-handler do not block Stripe retries (claim-before-process would leave a stuck `evt_` row).
 */
export async function applyStripeWebhookEvent(
  stripe: Stripe,
  event: Stripe.Event,
  ctx?: ApplyStripeWebhookContext,
): Promise<void> {
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
        });
      }

      let lifecycle: LifecycleData = { cancelAtPeriodEnd: false };
      try {
        const stripeSub = await stripe.subscriptions.retrieve(subId);
        lifecycle = billingLifecycleFields(stripeSub);
      } catch {
        safeServerLog("stripe_webhook", "lifecycle_fetch_failed_checkout", {});
      }

      const activeBefore = await prisma.subscription.count({
        where: { userId, status: SubscriptionStatus.ACTIVE },
      });
      const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? "";
      const planCodeMeta = session.metadata?.planCode?.trim() || undefined;
      const billingRegionMeta = session.metadata?.region?.trim() || undefined;
      await prisma.$transaction(async (tx) => {
        await tx.subscription.upsert({
          where: { stripeSubscriptionId: subId },
          update: {
            status: SubscriptionStatus.ACTIVE,
            pastDueSince: null,
            ...(plan ? { planTier: plan.tier, planCountry: plan.country } : {}),
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
            status: SubscriptionStatus.ACTIVE,
            pastDueSince: null,
            stripeSubscriptionId: subId,
            stripeCustomerId: customerId,
            planTier: plan?.tier,
            planCountry: plan?.country,
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
      if (activeBefore === 0) {
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
  }

  if (event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    const mappedStatus = mapStripeSubscriptionStatus(sub.status);
    const row = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: sub.id },
      select: { id: true, userId: true, status: true },
    });
    const priceId = firstSubscriptionPriceId(sub);
    const mapped = priceId ? findTierCountryByPriceId(priceId) : undefined;
    if (priceId && !mapped) {
      safeServerLog("stripe_webhook", "unknown_subscription_price_id", {
        priceIdPrefix: priceId.slice(0, 28),
      });
    }
    if (row?.userId && priceId) {
      await syncUserFromStripePriceId(row.userId, priceId);
    }
    if (row) {
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
      await prisma.subscription.update({
        where: { id: row.id },
        data,
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    const lifecycle = billingLifecycleFields(sub);
    const existing = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId: sub.id },
      select: { id: true, status: true },
    });
    if (existing) {
      const pastPatch = pastDueSinceForStatusTransition(SubscriptionStatus.CANCELLED, existing.status);
      await prisma.subscription.update({
        where: { id: existing.id },
        data: {
          status: SubscriptionStatus.CANCELLED,
          cancelAtPeriodEnd: true,
          currentPeriodEnd: lifecycle.currentPeriodEnd ?? null,
          trialEnd: lifecycle.trialEnd ?? null,
          ...(pastPatch ?? {}),
        },
      });
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
    const billingReason = (invoice as Stripe.Invoice & { billing_reason?: string | null }).billing_reason;
    const subRaw = (invoice as unknown as { subscription?: string | { id: string } | null }).subscription;
    const subId = typeof subRaw === "string" ? subRaw : subRaw?.id;
    if (subId) {
      const row = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: subId },
        select: { id: true, status: true },
      });
      if (row) {
        const pastPatch = pastDueSinceForStatusTransition(SubscriptionStatus.ACTIVE, row.status);
        await prisma.subscription.update({
          where: { id: row.id },
          data: {
            status: SubscriptionStatus.ACTIVE,
            ...(pastPatch ?? {}),
          },
        });
      }
      if (billingReason === "subscription_cycle") {
        const rowUser = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subId },
          select: { userId: true },
        });
        if (rowUser?.userId) {
          void captureServerEvent(analyticsDistinctId(rowUser.userId), PH.funnelSubscriptionRenewed, {
            source: "stripe_invoice_payment_succeeded",
            billing_reason: billingReason,
          });
        }
      }
    }
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const subRaw = (invoice as unknown as { subscription?: string | { id: string } | null }).subscription;
    const subId = typeof subRaw === "string" ? subRaw : subRaw?.id;
    if (subId) {
      const row = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: subId },
        select: { id: true, status: true },
      });
      if (row) {
        const pastPatch = pastDueSinceForStatusTransition(SubscriptionStatus.PAST_DUE, row.status);
        await prisma.subscription.update({
          where: { id: row.id },
          data: {
            status: SubscriptionStatus.PAST_DUE,
            ...(pastPatch ?? {}),
          },
        });
      }
    }
  }

  productEvent("stripe_webhook_ok", { eventType: event.type });
  safeServerLog("billing_sync", "webhook_event_applied", {
    type: event.type,
    eventIdPrefix: event.id.slice(0, 12),
    correlation: ctx?.correlation ?? "",
    severity: "info",
  });
}
