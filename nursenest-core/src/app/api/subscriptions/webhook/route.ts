import { headers } from "next/headers";
import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import type Stripe from "stripe";
import { Prisma, SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { getStripeClient } from "@/lib/stripe/stripe-client";
import { analyticsDistinctId, captureServerEvent } from "@/lib/observability/posthog-server";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { productEvent } from "@/lib/observability/product-events";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
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

type LifecycleData = ReturnType<typeof billingLifecycleFields>;

function warnIfStripeKeyModeMismatch(): void {
  const key = process.env.STRIPE_SECRET_KEY?.trim() ?? "";
  const isTest = key.startsWith("sk_test");
  const isLive = key.startsWith("sk_live");
  const prodLike =
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production" ||
    process.env.NURSE_NEST_STRIPE_ENFORCE_LIVE === "1";
  if (prodLike && isTest) {
    safeServerLog("stripe_webhook", "secret_key_is_test_in_prod_like_env", {});
  }
  if (!prodLike && isLive) {
    safeServerLog("stripe_webhook", "secret_key_is_live_in_non_prod", {});
  }
}

export async function POST(req: Request) {
  warnIfStripeKeyModeMismatch();

  const signature = (await headers()).get("stripe-signature");
  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const stripe = await getStripeClient();
  if (!stripe) {
    return NextResponse.json({ error: "Billing unavailable" }, { status: 503 });
  }

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    Sentry.captureMessage("stripe_webhook_invalid_signature", {
      level: "warning",
      tags: { flow: "stripe_webhook", kind: "signature" },
    });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  setSentryServerContext({ route: "/api/subscriptions/webhook", feature: SERVER_FEATURE.payment });

  let claimedEventId = false;
  try {
    await prisma.stripeWebhookEvent.create({ data: { id: event.id } });
    claimedEventId = true;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    throw e;
  }

  try {
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
      const status = mapStripeSubscriptionStatus(sub.status);
      const row = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: sub.id },
        select: { userId: true },
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
      const lifecycle = billingLifecycleFields(sub);
      const data: Prisma.SubscriptionUpdateManyMutationInput = {
        currentPeriodEnd: lifecycle.currentPeriodEnd ?? null,
        trialEnd: lifecycle.trialEnd ?? null,
        cancelAtPeriodEnd: lifecycle.cancelAtPeriodEnd,
      };
      if (status !== null) data.status = status;
      if (mapped) {
        data.planTier = mapped.tier;
        data.planCountry = mapped.country;
        if (mapped.alliedCareer) data.alliedCareer = mapped.alliedCareer;
      }
      await prisma.$transaction(async (tx) => {
        await tx.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data,
        });
      });
    }

    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;
      const lifecycle = billingLifecycleFields(sub);
      await prisma.$transaction(async (tx) => {
        await tx.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: {
            status: SubscriptionStatus.CANCELLED,
            cancelAtPeriodEnd: true,
            currentPeriodEnd: lifecycle.currentPeriodEnd ?? null,
            trialEnd: lifecycle.trialEnd ?? null,
          },
        });
      });
    }

    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;
      const billingReason = (invoice as Stripe.Invoice & { billing_reason?: string | null }).billing_reason;
      const subRaw = (invoice as unknown as { subscription?: string | { id: string } | null }).subscription;
      const subId = typeof subRaw === "string" ? subRaw : subRaw?.id;
      if (subId) {
        await prisma.$transaction(async (tx) => {
          await tx.subscription.updateMany({
            where: { stripeSubscriptionId: subId },
            data: { status: SubscriptionStatus.ACTIVE },
          });
        });
        if (billingReason === "subscription_cycle") {
          const row = await prisma.subscription.findUnique({
            where: { stripeSubscriptionId: subId },
            select: { userId: true },
          });
          if (row?.userId) {
            void captureServerEvent(analyticsDistinctId(row.userId), PH.funnelSubscriptionRenewed, {
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
        await prisma.$transaction(async (tx) => {
          await tx.subscription.updateMany({
            where: { stripeSubscriptionId: subId },
            data: { status: SubscriptionStatus.PAST_DUE },
          });
        });
      }
    }

    productEvent("stripe_webhook_ok", { eventType: event.type });
  } catch (e) {
    productEvent("stripe_webhook_failed", { eventType: event.type });
    safeServerLogCritical("stripe_webhook", "handler_failed", { type: event.type }, e);
    if (claimedEventId) {
      await prisma.stripeWebhookEvent.delete({ where: { id: event.id } }).catch(() => {});
    }
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
