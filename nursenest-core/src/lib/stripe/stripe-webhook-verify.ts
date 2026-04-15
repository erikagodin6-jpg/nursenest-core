import "server-only";
import type Stripe from "stripe";

/** Default Stripe SDK tolerance for clock skew (seconds). */
const DEFAULT_TOLERANCE_SEC = 300;

/**
 * Verifies `Stripe-Signature` and parses the event. Uses optional `STRIPE_WEBHOOK_TOLERANCE_SECONDS`
 * (default 300). Throws if signature is invalid — do not log the thrown message if it could echo secrets.
 */
export function constructStripeWebhookEvent(
  stripe: Stripe,
  rawBody: string,
  stripeSignatureHeader: string | null,
  webhookSecret: string,
): Stripe.Event {
  if (!stripeSignatureHeader) {
    throw new Error("missing_stripe_signature");
  }
  const rawTolerance = process.env.STRIPE_WEBHOOK_TOLERANCE_SECONDS?.trim();
  const toleranceSec =
    rawTolerance && rawTolerance.length > 0 ? Number.parseInt(rawTolerance, 10) : DEFAULT_TOLERANCE_SEC;
  const tolerance =
    Number.isFinite(toleranceSec) && toleranceSec > 0 && toleranceSec <= 600 ? toleranceSec : DEFAULT_TOLERANCE_SEC;

  return stripe.webhooks.constructEvent(rawBody, stripeSignatureHeader, webhookSecret, tolerance);
}
