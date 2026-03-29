import { headers } from "next/headers";
import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import type Stripe from "stripe";
import { SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { productEvent } from "@/lib/observability/product-events";
import { setSentryServerContext } from "@/lib/observability/sentry-server-context";
import {
  syncUserFromCheckoutSessionMetadata,
  syncUserFromStripePriceId,
} from "@/lib/stripe/sync-user-from-stripe-subscription";

/** Dynamic import so Next build (collect page data) never loads Stripe without a key. */
async function getStripeClient(): Promise<Stripe | null> {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  const { default: Stripe } = await import("stripe");
  return new Stripe(key);
}

/**
 * Maps Stripe subscription status to DB. Returns `null` when we should **not** overwrite the row
 * (e.g. `incomplete` during Checkout can arrive after `checkout.session.completed` already set ACTIVE).
 */
function mapStripeSubscriptionStatus(status: Stripe.Subscription.Status): SubscriptionStatus | null {
  switch (status) {
    case "active":
    case "trialing":
      return SubscriptionStatus.ACTIVE;
    case "past_due":
    case "unpaid":
      return SubscriptionStatus.PAST_DUE;
    case "canceled":
    case "incomplete_expired":
      return SubscriptionStatus.CANCELLED;
    case "incomplete":
    case "paused":
      return null;
    default:
      return SubscriptionStatus.CANCELLED;
  }
}

function firstSubscriptionPriceId(sub: Stripe.Subscription): string | undefined {
  const item = sub.items?.data?.[0];
  if (!item?.price) return undefined;
  return typeof item.price === "string" ? item.price : item.price.id;
}

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

  setSentryServerContext({ route: "/api/subscriptions/webhook", feature: "payment" });

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId ?? session.client_reference_id ?? undefined;
      const subId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
      if (userId && subId) {
        await prisma.$transaction(async (tx) => {
          await tx.subscription.upsert({
            where: { stripeSubscriptionId: subId },
            update: { status: SubscriptionStatus.ACTIVE },
            create: {
              userId,
              status: SubscriptionStatus.ACTIVE,
              stripeSubscriptionId: subId,
              stripeCustomerId: typeof session.customer === "string" ? session.customer : session.customer?.id ?? "",
            },
          });
        });
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
      if (row?.userId && priceId) {
        await syncUserFromStripePriceId(row.userId, priceId);
      }
      if (status !== null) {
        await prisma.$transaction(async (tx) => {
          await tx.subscription.updateMany({
            where: { stripeSubscriptionId: sub.id },
            data: { status },
          });
        });
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      await prisma.$transaction(async (tx) => {
        await tx.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { status: SubscriptionStatus.CANCELLED },
        });
      });
    }

    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;
      const subRaw = (invoice as unknown as { subscription?: string | { id: string } | null }).subscription;
      const subId = typeof subRaw === "string" ? subRaw : subRaw?.id;
      if (subId) {
        await prisma.$transaction(async (tx) => {
          await tx.subscription.updateMany({
            where: { stripeSubscriptionId: subId },
            data: { status: SubscriptionStatus.ACTIVE },
          });
        });
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
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
