import "server-only";

/**
 * Event types we **intentionally** process in {@link applyStripeWebhookEvent}.
 * All others: verify signature → claim idempotency row → **200 ignored** (no DB writes).
 * Stripe must still get 2xx to stop retries; idempotency prevents duplicate work if they resend.
 */
export const STRIPE_WEBHOOK_HANDLED_EVENT_TYPES = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
  /** Audit-only: subscription updates still come from other events; no DB entitlement mutation here. */
  "charge.refunded",
] as const;

export type StripeWebhookHandledEventType = (typeof STRIPE_WEBHOOK_HANDLED_EVENT_TYPES)[number];

const HANDLED = new Set<string>(STRIPE_WEBHOOK_HANDLED_EVENT_TYPES);

export function isStripeWebhookEventTypeHandled(type: string): type is StripeWebhookHandledEventType {
  return HANDLED.has(type);
}
