/**
 * Entitlement & billing state matrix — **documentation for audits** (support, compliance, incident review).
 *
 * **Runtime resolution**: {@link getUserAccess} (Prisma `Subscription` + `User`).
 * **Stripe → DB mirror**: {@link applyStripeWebhookEvent}, {@link mapStripeSubscriptionStatus}.
 *
 * Access is never granted from browser query params or checkout redirects alone — only DB-backed `getUserAccess`
 * after webhooks / server checkout handlers persist state.
 */
/** Stripe `subscription.status` values we explicitly map in `mapStripeSubscriptionStatus` (see implementation for null/default cases). */
export const STRIPE_STATUS_DB_MAPPING_NOTES: ReadonlyArray<{
  stripe: string;
  db: string;
  note: string;
}> = [
  { stripe: "active", db: "ACTIVE", note: "Paid access period." },
  { stripe: "trialing", db: "ACTIVE", note: "Trial billed through Stripe." },
  { stripe: "past_due", db: "PAST_DUE", note: "Entitlement may still grant via past-due policy." },
  { stripe: "unpaid", db: "PAST_DUE", note: "Mapped to same DB bucket as past_due." },
  { stripe: "canceled", db: "CANCELLED", note: "Stripe ended; access stops unless User trial still active." },
  { stripe: "incomplete_expired", db: "CANCELLED", note: "Checkout abandoned / expired." },
  {
    stripe: "incomplete",
    db: "null_skip_overwrite",
    note: "Do not blindly overwrite — checkout handler may have set ACTIVE.",
  },
  { stripe: "paused", db: "null_skip_overwrite", note: "Collection paused — reconcile carefully." },
  {
    stripe: "(unknown)",
    db: "CANCELLED_default_unknown",
    note: "Defensive default in mapper — should be rare.",
  },
];

/** DB statuses that can participate in `ACTIVE_LIKE` selection in `getUserAccess`. */
export const DB_ACTIVE_LIKE_LABELS = ["ACTIVE", "GRACE", "PAST_DUE"] as const;

/**
 * `UserAccess.reason` → premium outcome for learners (staff bypass uses `admin_override` — full access, not a “paid” row).
 */
export const GET_USER_ACCESS_REASON_PREMIUM: ReadonlyArray<{
  reason: string;
  typicallyPremium: boolean;
  note: string;
}> = [
  { reason: "active_subscription", typicallyPremium: true, note: "Stripe-backed ACTIVE row." },
  { reason: "grace_period", typicallyPremium: true, note: "DB GRACE period." },
  {
    reason: "past_due_grace",
    typicallyPremium: true,
    note: "PAST_DUE + ENTITLEMENT_PAST_DUE_* policy grants continued access.",
  },
  { reason: "active_trial", typicallyPremium: true, note: "App trial on User." },
  { reason: "admin_override", typicallyPremium: true, note: "Staff — not Stripe subscription emulation." },
  { reason: "no_access", typicallyPremium: false, note: "CANCELLED, denied past_due, expired trial, etc." },
];

/** DB / Prisma read failures**: `getUserAccess` **throws**; API gates return **503** (`access_verify_failed`), RSC returns `"error"` — never silent `no_access`. */
export const ENTITLEMENT_FAILURE_MODES = {
  apiSubscriberGate: "503 + access_verify_failed",
  pageRsc: 'resolveEntitlementForPage → "error"',
} as const;
