import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { correlationIdFromRequest } from "@/lib/observability/request-correlation";
import { emitBillingAudit } from "@/lib/observability/billing-entitlement-audit";
import { emitStructuredLog } from "@/lib/observability/structured-log";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { getStripeClient } from "@/lib/stripe/stripe-client";
import { productEvent } from "@/lib/observability/product-events";
import { captureServerExceptionIfEnabled, captureServerMessageIfEnabled } from "@/lib/observability/sentry-if-enabled";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { recordStripeWebhookFailure } from "@/lib/observability/production-signal-metrics";
import { applyStripeWebhookEvent } from "@/lib/stripe/apply-stripe-webhook-event";
import { isStripeWebhookEventTypeHandled } from "@/lib/stripe/stripe-webhook-event-policy";
import {
  claimStripeWebhookEventOrDuplicate,
  releaseStripeWebhookEventClaim,
} from "@/lib/stripe/stripe-webhook-idempotency";
import { constructStripeWebhookEvent } from "@/lib/stripe/stripe-webhook-verify";

/** Reject oversized bodies before signature parse (DoS / accidental huge payloads). */
const MAX_STRIPE_WEBHOOK_BODY_BYTES = 512 * 1024;

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
 * Stripe webhooks: verify → **claim** `evt_` (insert) → apply side effects → claim kept on success.
 * Claim-first prevents duplicate concurrent workers from double-applying; `releaseStripeWebhookEventClaim` on failure
 * allows Stripe retries. Entitlements are read from DB elsewhere (`getUserAccess`).
 */
export async function POST(req: Request) {
  return runWithApiTelemetry(req, "POST /api/subscriptions/webhook", "webhook", async () => {
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
    emitBillingAudit("webhook_rejected", {
      correlationId: correlation || undefined,
      source: "webhook",
      reason: "configuration_or_signature_missing",
      severity: "warn",
    });
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const stripe = await getStripeClient();
  if (!stripe) {
    return NextResponse.json({ error: "Billing unavailable" }, { status: 503 });
  }

  const body = await req.text();
  if (body.length > MAX_STRIPE_WEBHOOK_BODY_BYTES) {
    safeServerLog("stripe_webhook", "payload_too_large", {
      length: body.length,
      correlation,
      severity: "warning",
    });
    emitBillingAudit("webhook_rejected", {
      correlationId: correlation || undefined,
      source: "webhook",
      reason: "payload_too_large",
      severity: "warn",
    });
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }
  let event: import("stripe").Stripe.Event;
  try {
    event = constructStripeWebhookEvent(stripe, body, signature, webhookSecret);
  } catch {
    safeServerLog("stripe_webhook", "signature_verification_failed", {
      correlation,
      severity: "warning",
    });
    emitBillingAudit("webhook_rejected", {
      correlationId: correlation || undefined,
      source: "webhook",
      reason: "signature_verification_failed",
      severity: "warn",
    });
    captureServerMessageIfEnabled("stripe_webhook_invalid_signature", {
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

  emitStructuredLog("webhook_received", "info", {
    correlationId: correlation || undefined,
    route: "/api/subscriptions/webhook",
    method: "POST",
    flow: "webhook",
    message: `stripe type=${event.type.slice(0, 64)} idPrefix=${event.id.slice(0, 12)}`,
  });
  emitBillingAudit("webhook_received", {
    correlationId: correlation || undefined,
    source: "webhook",
    stripeEventType: event.type,
    stripeEventIdPrefix: event.id.slice(0, 12),
    reason: `keyMode=${keyMode}`,
  });

  let claim: Awaited<ReturnType<typeof claimStripeWebhookEventOrDuplicate>>;
  try {
    claim = await claimStripeWebhookEventOrDuplicate(event.id);
  } catch (e) {
    recordStripeWebhookFailure("claim", event.type, req);
    emitBillingAudit("webhook_failed", {
      correlationId: correlation || undefined,
      source: "webhook",
      stripeEventType: event.type,
      stripeEventIdPrefix: event.id.slice(0, 12),
      reason: "idempotency_claim_failed",
      severity: "error",
    });
    safeServerLogCritical(
      "stripe_webhook",
      "claim_failed",
      { type: event.type, correlation, severity: "error" },
      e,
    );
    captureServerExceptionIfEnabled(e, {
      level: "error",
      tags: { flow: "stripe_webhook_claim", stripe_event_type: event.type },
      fingerprint: ["stripe_webhook_claim", event.id],
    });
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  if (claim === "duplicate") {
    safeServerLog("stripe_webhook", "duplicate_delivery_skipped", {
      eventIdPrefix: event.id.slice(0, 12),
      correlation,
      severity: "info",
    });
    return NextResponse.json({ ok: true, duplicate: true });
  }

  if (!isStripeWebhookEventTypeHandled(event.type)) {
    safeServerLog("stripe_webhook", "event_type_not_handled_acknowledged", {
      type: event.type,
      eventIdPrefix: event.id.slice(0, 12),
      correlation,
      severity: "info",
    });
    emitStructuredLog("webhook_ignored", "info", {
      correlationId: correlation || undefined,
      route: "/api/subscriptions/webhook",
      method: "POST",
      flow: "webhook",
      errorClass: "unhandled_event_type",
      message: `stripe ignored type=${event.type.slice(0, 64)} idPrefix=${event.id.slice(0, 12)}`,
    });
    return NextResponse.json({ ok: true, ignored: true, eventType: event.type });
  }

  try {
    await applyStripeWebhookEvent(stripe, event, { correlation });
  } catch (e) {
    await releaseStripeWebhookEventClaim(event.id);
    recordStripeWebhookFailure("handler", event.type, req);
    productEvent("stripe_webhook_failed", { eventType: event.type });
    emitBillingAudit("webhook_failed", {
      correlationId: correlation || undefined,
      source: "webhook",
      stripeEventType: event.type,
      stripeEventIdPrefix: event.id.slice(0, 12),
      reason: "handler_exception",
      severity: "error",
    });
    emitStructuredLog("webhook_failed", "error", {
      correlationId: correlation || undefined,
      route: "/api/subscriptions/webhook",
      method: "POST",
      flow: "webhook",
      message: `stripe handler failed type=${event.type.slice(0, 64)}`,
    });
    safeServerLogCritical(
      "stripe_webhook",
      "handler_failed",
      { type: event.type, correlation, severity: "error" },
      e,
    );
    captureServerExceptionIfEnabled(e, {
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

  return NextResponse.json({ ok: true });
  });
}
