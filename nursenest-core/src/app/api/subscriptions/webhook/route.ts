import { headers } from "next/headers";
import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { correlationIdFromRequest } from "@/lib/observability/request-correlation";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { getStripeClient } from "@/lib/stripe/stripe-client";
import { productEvent } from "@/lib/observability/product-events";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { applyStripeWebhookEvent } from "@/lib/stripe/apply-stripe-webhook-event";
import { recordStripeWebhookEventProcessed } from "@/lib/stripe/stripe-webhook-idempotency";
import { constructStripeWebhookEvent } from "@/lib/stripe/stripe-webhook-verify";

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

/**
 * Stripe webhooks: signature verification → apply billing side effects → **then** persist `evt_` id for deduplication.
 * Entitlements are read from DB elsewhere (`getUserAccess`); checkout success UI only calls `sync-session` to refresh JWT.
 */
export async function POST(req: Request) {
  warnIfStripeKeyModeMismatch();

  const correlation = correlationIdFromRequest(req) ?? "";

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const signature = (await headers()).get("stripe-signature");
  if (!signature || !webhookSecret) {
    safeServerLog("stripe_webhook", "configuration_or_signature_missing", {
      hasSignature: Boolean(signature),
      hasWebhookSecret: Boolean(webhookSecret),
      correlation,
      severity: "warning",
    });
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const stripe = await getStripeClient();
  if (!stripe) {
    return NextResponse.json({ error: "Billing unavailable" }, { status: 503 });
  }

  const body = await req.text();
  let event: import("stripe").Stripe.Event;
  try {
    event = constructStripeWebhookEvent(stripe, body, signature, webhookSecret);
  } catch {
    safeServerLog("stripe_webhook", "signature_verification_failed", {
      correlation,
      severity: "warning",
    });
    Sentry.captureMessage("stripe_webhook_invalid_signature", {
      level: "warning",
      tags: { flow: "stripe_webhook", kind: "signature" },
    });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  setSentryServerContext({ route: "/api/subscriptions/webhook", feature: SERVER_FEATURE.payment });

  const keyMode = process.env.STRIPE_SECRET_KEY?.trim().startsWith("sk_live") ? "live" : "test";
  safeServerLog("stripe_webhook", "event_received", {
    type: event.type,
    eventIdPrefix: event.id.slice(0, 12),
    keyMode,
    correlation,
    severity: "info",
  });

  try {
    await applyStripeWebhookEvent(stripe, event, { correlation });
  } catch (e) {
    productEvent("stripe_webhook_failed", { eventType: event.type });
    safeServerLogCritical(
      "stripe_webhook",
      "handler_failed",
      { type: event.type, correlation, severity: "error" },
      e,
    );
    Sentry.captureException(e, {
      level: "error",
      tags: {
        flow: "stripe_webhook",
        stripe_event_type: event.type,
        stripe_key_mode: keyMode,
      },
      fingerprint: ["stripe_webhook", event.type, event.id],
    });
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  try {
    const dedupe = await recordStripeWebhookEventProcessed(event.id);
    if (dedupe === "duplicate") {
      safeServerLog("stripe_webhook", "dedupe_after_success", {
        eventIdPrefix: event.id.slice(0, 12),
        correlation,
        severity: "info",
      });
      return NextResponse.json({ ok: true, duplicate: true });
    }
  } catch (e) {
    safeServerLogCritical(
      "stripe_webhook",
      "dedupe_record_failed",
      { type: event.type, correlation, severity: "error" },
      e,
    );
    Sentry.captureException(e, {
      level: "error",
      tags: { flow: "stripe_webhook_dedupe", stripe_event_type: event.type },
      fingerprint: ["stripe_webhook_dedupe", event.id],
    });
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
