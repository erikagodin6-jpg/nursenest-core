import "server-only";

/**
 * Deterministic Stripe **idempotency key** for `checkout.sessions.create`.
 *
 * Within Stripe's 24h idempotency window, identical (userId, priceId) pairs collapse to
 * a single Checkout Session — collapsing double-clicks, retried 502s, and accidental
 * client-side fast retries into one Session and (at most) one Subscription. We do *not*
 * include a billing cycle / wall clock here: the active-subscription guard in
 * `POST /api/subscriptions/checkout` blocks legitimate "new sub" attempts when an old
 * one is still active, so the 24h window is the right granularity.
 *
 * Stripe enforces a max idempotency-key length of 255 chars; we hard-cap our output to
 * 255 so a pathological userId / priceId can never raise a Stripe error mid-checkout.
 * The `v1` prefix lets us bump the namespace without conflicting with cached Stripe
 * responses if we ever change the canonicalization.
 */
export function buildCheckoutSubscriptionIdempotencyKey(userId: string, priceId: string): string {
  const raw = `checkout-sub-v1:${userId}:${priceId}`;
  return raw.length <= 255 ? raw : raw.slice(0, 255);
}
