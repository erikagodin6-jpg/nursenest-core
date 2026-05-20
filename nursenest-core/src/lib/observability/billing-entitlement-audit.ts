/**
 * Strong audit trail for billing / entitlement changes (log drains, SIEM).
 * Uses {@link emitMonitoringRecord} — no secrets, no raw payment PANs, IDs are truncated.
 *
 * @see MONITORING_LOG_SCHEMA_V1 — `scope: billing_audit`, `event` = logical audit name.
 */
import type { SubscriptionStatus, TierCode } from "@prisma/client";
import { emitMonitoringRecord, type MonitoringSeverity } from "@/lib/observability/observability-record";
import {
  pastDueSubscriptionGrantsPremium,
  readPastDueEntitlementPolicy,
} from "@/lib/entitlements/past-due-policy";

export type BillingAuditSource = "checkout" | "webhook" | "reconciliation" | "admin" | "auth" | "system";

/** Canonical audit event names (stable for dashboards). */
export const BILLING_AUDIT_EVENTS = [
  "checkout_started",
  "checkout_failed",
  "checkout_completed",
  "webhook_received",
  "webhook_rejected",
  "webhook_failed",
  "subscription_state_changed",
  "entitlement_granted",
  "entitlement_revoked",
  "reconciliation_mismatch_found",
  "reconciliation_repaired",
  "refund_processed",
  "admin_override_applied",
  "admin_override_removed",
  /** Staff invoked POST `/api/admin/billing/stripe-reconcile` (dry-run or apply). */
  "admin_reconciliation_invoked",
  /** Non–super staff attempted `?apply=1` (blocked). */
  "admin_reconciliation_apply_blocked",
] as const;

export type BillingAuditEventName = (typeof BILLING_AUDIT_EVENTS)[number];

export type BillingAuditFields = {
  correlationId?: string;
  /** First 8 chars of internal user id — not full PII bucket, enough to correlate support tickets. */
  userIdPrefix?: string;
  subscriptionIdPrefix?: string;
  customerIdPrefix?: string;
  country?: string;
  tier?: string;
  priorState?: string;
  newState?: string;
  source?: BillingAuditSource;
  stripeEventType?: string;
  stripeEventIdPrefix?: string;
  /** Non-sensitive reason / phase (e.g. validation_failed, signature_invalid). */
  reason?: string;
  /** Staff RBAC tier for admin-only audit lines (`super` | `support` | `content`). */
  actorStaffTier?: string;
  mismatchKind?: string;
  operation?: string;
  refundChargeIdPrefix?: string;
  /** ISO currency code only (e.g. usd). */
  currency?: string;
  severity?: MonitoringSeverity;
};

export function prefixUserId(userId: string | null | undefined): string | undefined {
  const t = userId?.trim();
  if (!t) return undefined;
  return t.slice(0, 8);
}

export function prefixStripeId(id: string | null | undefined, len = 14): string | undefined {
  const t = id?.trim();
  if (!t) return undefined;
  return t.slice(0, len);
}

/** Single-row premium eligibility aligned with past-due grace policy (not full getUserAccess). */
export function inferPremiumEligibleFromSubscriptionRow(args: {
  status: SubscriptionStatus;
  updatedAt: Date;
  currentPeriodEnd: Date | null;
  pastDueSince: Date | null;
}): boolean {
  switch (args.status) {
    case "ACTIVE":
    case "GRACE":
      return true;
    case "CANCELLED":
      return false;
    case "PAST_DUE":
      return pastDueSubscriptionGrantsPremium(readPastDueEntitlementPolicy(), {
        updatedAt: args.updatedAt,
        currentPeriodEnd: args.currentPeriodEnd,
        pastDueSince: args.pastDueSince,
      });
    default:
      return false;
  }
}

export function emitBillingAudit(event: BillingAuditEventName, fields: BillingAuditFields): void {
  const severity = fields.severity ?? "info";
  emitMonitoringRecord({
    scope: "billing_audit",
    event,
    severity,
    correlationId: fields.correlationId,
    flow: "billing",
    meta: {
      schema: "nn.billing_audit.v1",
      userIdPrefix: fields.userIdPrefix,
      subscriptionIdPrefix: fields.subscriptionIdPrefix,
      customerIdPrefix: fields.customerIdPrefix,
      country: fields.country,
      tier: fields.tier,
      priorState: fields.priorState,
      newState: fields.newState,
      source: fields.source,
      stripeEventType: fields.stripeEventType,
      stripeEventIdPrefix: fields.stripeEventIdPrefix,
      reason: fields.reason?.slice(0, 240),
      actorStaffTier: fields.actorStaffTier,
      mismatchKind: fields.mismatchKind,
      operation: fields.operation,
      refundChargeIdPrefix: fields.refundChargeIdPrefix,
      currency: fields.currency,
    },
  });
}

export function emitSubscriptionStateChangedAudit(args: {
  correlationId?: string;
  userId?: string | null;
  stripeSubscriptionId?: string | null;
  stripeCustomerId?: string | null;
  country?: string | null;
  tier?: string | null;
  priorStatus: SubscriptionStatus | null | undefined;
  newStatus: SubscriptionStatus | null | undefined;
  source: BillingAuditSource;
  stripeEventType?: string;
  stripeEventIdPrefix?: string;
  transitionKind?: string;
}): void {
  emitBillingAudit("subscription_state_changed", {
    correlationId: args.correlationId,
    userIdPrefix: prefixUserId(args.userId ?? undefined),
    subscriptionIdPrefix: prefixStripeId(args.stripeSubscriptionId ?? undefined),
    customerIdPrefix: prefixStripeId(args.stripeCustomerId ?? undefined, 12),
    country: args.country ?? undefined,
    tier: args.tier ?? undefined,
    priorState: args.priorStatus != null ? String(args.priorStatus) : undefined,
    newState: args.newStatus != null ? String(args.newStatus) : undefined,
    source: args.source,
    stripeEventType: args.stripeEventType,
    stripeEventIdPrefix: args.stripeEventIdPrefix,
    reason: args.transitionKind,
  });
}

export function emitEntitlementShiftFromRowTransition(args: {
  correlationId?: string;
  userId?: string | null;
  stripeSubscriptionId?: string | null;
  country?: string | null;
  tier?: string | null;
  before: {
    status: SubscriptionStatus;
    updatedAt: Date;
    currentPeriodEnd: Date | null;
    pastDueSince: Date | null;
  };
  after: {
    status: SubscriptionStatus;
    updatedAt: Date;
    currentPeriodEnd: Date | null;
    pastDueSince: Date | null;
  };
  source: BillingAuditSource;
  stripeEventType?: string;
  stripeEventIdPrefix?: string;
}): void {
  const had = inferPremiumEligibleFromSubscriptionRow(args.before);
  const has = inferPremiumEligibleFromSubscriptionRow(args.after);
  if (had === has) return;
  const base = {
    correlationId: args.correlationId,
    userIdPrefix: prefixUserId(args.userId ?? undefined),
    subscriptionIdPrefix: prefixStripeId(args.stripeSubscriptionId ?? undefined),
    country: args.country ?? undefined,
    tier: args.tier ?? undefined,
    priorState: had ? "premium_eligible" : "premium_ineligible",
    newState: has ? "premium_eligible" : "premium_ineligible",
    source: args.source,
    stripeEventType: args.stripeEventType,
    stripeEventIdPrefix: args.stripeEventIdPrefix,
  };
  if (has && !had) {
    emitBillingAudit("entitlement_granted", base);
  } else if (!has && had) {
    emitBillingAudit("entitlement_revoked", base);
  }
}

export function tierToAuditString(tier: TierCode | null | undefined): string | undefined {
  return tier != null ? String(tier) : undefined;
}
