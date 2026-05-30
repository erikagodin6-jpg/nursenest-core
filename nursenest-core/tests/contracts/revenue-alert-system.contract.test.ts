import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import {
  buildRevenueAlertSubject,
  revenueAlertHealthStatus,
} from "@/lib/revenue-alerts/revenue-alerts";
import { STRIPE_WEBHOOK_HANDLED_EVENT_TYPES } from "@/lib/stripe/stripe-webhook-event-policy";

const ROOT = process.cwd();

function readSource(relativePath: string): string {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

describe("critical revenue notification and alert system", () => {
  it("declares all financially important revenue alert event types", () => {
    const src = readSource("src/lib/revenue-alerts/revenue-alerts.ts");
    for (const event of [
      "new_subscription",
      "trial_started",
      "trial_converted",
      "subscription_renewal",
      "failed_payment",
      "payment_method_expiring",
      "subscription_cancelled",
      "refund_issued",
      "chargeback_initiated",
      "chargeback_won",
      "chargeback_lost",
      "institutional_inquiry",
      "enterprise_inquiry",
      "affiliate_conversion",
      "coupon_redemption",
      "high_value_purchase",
    ]) {
      assert.match(src, new RegExp(`"${event}"`), `missing revenue event ${event}`);
    }
  });

  it("uses required owner-facing subjects for critical alerts", () => {
    assert.equal(buildRevenueAlertSubject("new_subscription"), "🎉 New NurseNest Subscription");
    assert.equal(buildRevenueAlertSubject("failed_payment"), "⚠️ Failed Payment");
    assert.equal(buildRevenueAlertSubject("trial_converted"), "🚀 Trial Converted To Paid");
    assert.equal(buildRevenueAlertSubject("subscription_cancelled"), "⚠️ Subscription Cancelled");
  });

  it("tracks email, SMS, admin dashboard, Discord, and Slack channel status in the audit log", () => {
    const src = readSource("src/lib/revenue-alerts/revenue-alerts.ts");
    assert.match(src, /emailStatus/);
    assert.match(src, /smsStatus/);
    assert.match(src, /adminDashboardStatus/);
    assert.match(src, /discordStatus/);
    assert.match(src, /slackStatus/);
    assert.match(src, /retryStatus/);
    assert.match(src, /errorMessages/);
    assert.match(src, /REVENUE_ALERT_LOG_KIND/);
  });

  it("handles Stripe refund, chargeback, payment failure, renewal, and expiring payment method events", () => {
    for (const event of [
      "checkout.session.completed",
      "customer.subscription.created",
      "customer.subscription.updated",
      "customer.subscription.deleted",
      "invoice.payment_succeeded",
      "invoice.payment_failed",
      "charge.refunded",
      "charge.dispute.created",
      "charge.dispute.closed",
      "customer.source.expiring",
    ]) {
      assert.ok(STRIPE_WEBHOOK_HANDLED_EVENT_TYPES.includes(event as never), `Stripe event not handled: ${event}`);
    }

    const apply = readSource("src/lib/stripe/apply-stripe-webhook-event.ts");
    assert.match(apply, /eventType:\s*"new_subscription"/);
    assert.match(apply, /eventType:\s*"trial_started"/);
    assert.match(apply, /eventType:\s*"trial_converted"/);
    assert.match(apply, /eventType:\s*"subscription_renewal"/);
    assert.match(apply, /eventType:\s*"failed_payment"/);
    assert.match(apply, /eventType:\s*"subscription_cancelled"/);
    assert.match(apply, /eventType:\s*"refund_issued"/);
    assert.match(apply, /chargeback_initiated/);
    assert.match(apply, /payment_method_expiring/);
  });

  it("adds a Revenue Alerts Center with required counters, health checks, and test buttons", () => {
    const page = readSource("src/app/(admin)/admin/revenue-alerts/page.tsx");
    const loader = readSource("src/lib/revenue-alerts/revenue-alerts-center.server.ts");
    const route = readSource("src/app/api/admin/revenue-alerts/test/route.ts");

    for (const label of ["Today", "This week", "This month", "Unread alerts", "Resolved alerts", "Revenue events"]) {
      assert.match(page, new RegExp(label));
    }
    for (const label of ["Stripe webhooks", "Email delivery", "SMS delivery", "Notification queues", "Background jobs"]) {
      assert.match(page, new RegExp(label));
    }
    for (const label of [
      "Send Test Email",
      "Send Test SMS",
      "Simulate Subscription",
      "Simulate Renewal",
      "Simulate Failed Payment",
      "Simulate Cancellation",
    ]) {
      assert.match(page, new RegExp(label));
    }
    assert.match(loader, /loadRevenueAlertsCenterDashboard/);
    assert.match(route, /sendRevenueAlert/);
  });

  it("reports missing critical notification configuration", () => {
    const status = revenueAlertHealthStatus({});
    assert.equal(status.stripeWebhookConfigured, false);
    assert.equal(status.emailConfigured, false);
    assert.ok(status.missingCritical.includes("STRIPE_WEBHOOK_SECRET"));
  });
});
