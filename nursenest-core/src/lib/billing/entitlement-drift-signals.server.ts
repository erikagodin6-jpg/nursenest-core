import "server-only";

import { Prisma, SubscriptionStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { isRuntimeSafeMode } from "@/lib/runtime/safe-mode";
import { computeDriftSeverity, driftHints, type DriftCountInput } from "@/lib/billing/entitlement-drift-severity";

const ACTIVE_LIKE: SubscriptionStatus[] = [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.GRACE,
  SubscriptionStatus.PAST_DUE,
];

export type EntitlementDriftSignals = {
  generatedAt: string;
  severity: "ok" | "warn" | "critical";
  signals: DriftCountInput & {
    recentWebhookEvents24h: number | null;
    latestSubscriptionUpdatedAt: string | null;
  };
  hints: string[];
};

/**
 * Bounded, read-only aggregates for admin/support — **report only**, no writes.
 * Does not call Stripe; cannot prove Stripe-vs-DB mismatch without reconciliation.
 */
export async function loadEntitlementDriftSignals(): Promise<EntitlementDriftSignals> {
  const generatedAt = new Date().toISOString();
  const empty: EntitlementDriftSignals = {
    generatedAt,
    severity: "ok",
    signals: {
      activeLikeMissingStripeCustomer: 0,
      activeLikeTierMismatchUser: 0,
      recentWebhookEvents24h: null,
      latestSubscriptionUpdatedAt: null,
    },
    hints: [],
  };

  if (!isDatabaseUrlConfigured() || isRuntimeSafeMode()) {
    return empty;
  }

  try {
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [missingCustomer, tierMismatchRow, webhookCount, maxUpdated] = await Promise.all([
      prisma.subscription.count({
        where: {
          status: { in: ACTIVE_LIKE },
          OR: [{ stripeCustomerId: null }, { stripeCustomerId: "" }],
        },
      }),
      prisma.$queryRaw<[{ c: bigint }]>`
        SELECT COUNT(*)::bigint AS c
        FROM "Subscription" s
        INNER JOIN "User" u ON u.id = s."userId"
        WHERE s.status IN (${Prisma.join(ACTIVE_LIKE)})
          AND s."planTier" IS NOT NULL
          AND s."planTier" IS DISTINCT FROM u.tier
      `,
      prisma.stripeWebhookEvent.count({ where: { createdAt: { gte: since24h } } }).catch(() => null),
      prisma.subscription.aggregate({ _max: { updatedAt: true } }).catch(() => ({ _max: { updatedAt: null as Date | null } })),
    ]);

    const activeLikeTierMismatchUser = Number(tierMismatchRow[0]?.c ?? 0n);
    const counts: DriftCountInput = {
      activeLikeMissingStripeCustomer: missingCustomer,
      activeLikeTierMismatchUser,
    };
    const severity = computeDriftSeverity(counts);

    return {
      generatedAt,
      severity,
      signals: {
        ...counts,
        recentWebhookEvents24h: webhookCount,
        latestSubscriptionUpdatedAt: maxUpdated._max.updatedAt?.toISOString() ?? null,
      },
      hints: driftHints(counts),
    };
  } catch (err) {
    return {
      generatedAt,
      severity: "warn",
      signals: {
        activeLikeMissingStripeCustomer: 0,
        activeLikeTierMismatchUser: 0,
        recentWebhookEvents24h: null,
        latestSubscriptionUpdatedAt: null,
      },
      hints: [`Drift query failed (non-fatal): ${err instanceof Error ? err.name : "unknown"}`],
    };
  }
}
