import type { PrismaClient } from "@prisma/client";

/**
 * `metadata.userId` must look like a Prisma `cuid` / normal id — reject obvious garbage
 * so `--apply` cannot attach a Stripe subscription to an arbitrary string.
 */
export function isTrustedStripeReconciliationUserId(raw: string | null | undefined): boolean {
  if (raw == null || typeof raw !== "string") return false;
  const id = raw.trim();
  if (id.length < 20 || id.length > 36) return false;
  if (!/^[a-z0-9]+$/i.test(id)) return false;
  return true;
}

export type SubscriptionCreateGuardResult = { allow: true } | { allow: false; reason: string };

/**
 * If the user already has subscription rows tied to a **different** Stripe customer id,
 * do not auto-create a new row from reconciliation (possible metadata mix-up).
 * Allows first subscription or matching customer id.
 */
export async function guardSubscriptionCreateCustomerConsistency(
  prisma: PrismaClient,
  userId: string,
  newStripeCustomerId: string | null,
): Promise<SubscriptionCreateGuardResult> {
  const rows = await prisma.subscription.findMany({
    where: { userId },
    select: { stripeCustomerId: true },
  });
  if (rows.length === 0) return { allow: true };
  const existingCustomers = new Set(
    rows.map((r) => r.stripeCustomerId).filter((c): c is string => Boolean(c?.trim())),
  );
  if (existingCustomers.size === 0) return { allow: true };
  if (!newStripeCustomerId?.trim()) {
    return {
      allow: false,
      reason: "Stripe customer id missing on subscription — cannot verify against existing user subscriptions",
    };
  }
  if (existingCustomers.has(newStripeCustomerId)) return { allow: true };
  return {
    allow: false,
    reason: "user already has subscription row(s) for a different Stripe customer id",
  };
}
