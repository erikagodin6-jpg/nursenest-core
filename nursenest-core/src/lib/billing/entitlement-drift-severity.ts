/**
 * Pure severity rules for DB-only entitlement drift signals (no Stripe calls).
 * Used by admin diagnostics; thresholds favor signal over noise on small tenants.
 */
export type DriftCountInput = {
  activeLikeMissingStripeCustomer: number;
  activeLikeTierMismatchUser: number;
};

export function computeDriftSeverity(input: DriftCountInput): "ok" | "warn" | "critical" {
  const missing = Math.max(0, input.activeLikeMissingStripeCustomer);
  const tier = Math.max(0, input.activeLikeTierMismatchUser);
  if (missing === 0 && tier === 0) return "ok";
  if (missing >= 100 || tier >= 300) return "critical";
  return "warn";
}

export function driftHints(input: DriftCountInput): string[] {
  const hints: string[] = [];
  if (input.activeLikeMissingStripeCustomer > 0) {
    hints.push(
      "Some ACTIVE/GRACE/PAST_DUE subscription rows lack stripeCustomerId — webhook/checkout linkage may be incomplete.",
    );
  }
  if (input.activeLikeTierMismatchUser > 0) {
    hints.push(
      "Some paid-like rows have planTier differing from User.tier — verify price sync and reconcile dry-run.",
    );
  }
  return hints;
}
