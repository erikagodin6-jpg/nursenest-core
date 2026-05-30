/**
 * Subscription retention, upgrades, and chargeback protection contract.
 *
 * Run:
 *   node --import tsx --test tests/contracts/subscription-retention-upgrades-chargeback-protection.contract.test.ts
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import {
  CHARGEBACK_EVIDENCE_FIELDS,
  FEATURE_DISCOVERY_CAMPAIGNS,
  REFUND_POLICY_SURFACES,
  RENEWAL_REMINDER_OFFSETS_DAYS,
  REVENUE_ANALYTICS_METRICS,
  SUBSCRIPTION_SUMMARY_SURFACES,
  SUBSCRIPTION_TRANSPARENCY_FIELDS,
  UPGRADE_TRIGGER_SURFACES,
  buildAccomplishmentLines,
  buildRenewalReminderSchedule,
  evaluateSubscriptionHealth,
} from "@/lib/subscriptions/subscription-retention-policy";

const ROOT = process.cwd();
const read = (rel: string) => readFileSync(path.resolve(ROOT, rel), "utf8");

describe("subscription retention upgrades chargeback protection", () => {
  it("defines required billing transparency fields and surfaces", () => {
    for (const field of [
      "Current Plan",
      "Renewal Date",
      "Billing Amount",
      "Next Charge Date",
      "Subscription Status",
      "Payment Method",
    ]) {
      assert.ok(SUBSCRIPTION_TRANSPARENCY_FIELDS.includes(field as never), `${field} missing`);
    }
    assert.deepEqual([...SUBSCRIPTION_SUMMARY_SURFACES], ["Dashboard", "Account Settings", "Billing Page"]);

    const dashboardBand = read("src/components/student/learner-dashboard-user-panel-band.tsx");
    const settings = read("src/app/(app)/app/(learner)/account/settings/page.tsx");
    const billing = read("src/components/student/learner-billing-page-content.tsx");
    assert.match(dashboardBand, /data-nn-subscription-summary-surface="dashboard"/);
    assert.match(settings, /data-nn-subscription-summary-surface="settings"/);
    assert.match(billing, /data-nn-subscription-summary-surface="billing"/);
    for (const phrase of ["Renewal Date", "Next Charge", "Payment Method"]) {
      assert.match(settings + billing + dashboardBand, new RegExp(phrase), `${phrase} must be visible in subscription summary surfaces`);
    }
  });

  it("scores subscription health as engaged, at risk, or inactive", () => {
    assert.equal(
      evaluateSubscriptionHealth({
        activeDays30d: 18,
        daysSinceLastActivity: 1,
        readinessDeltaPct: 16,
        featureAdoptionPct: 80,
        failedPaymentCount: 0,
        cancelAtPeriodEnd: false,
      }).status,
      "Engaged",
    );
    assert.equal(
      evaluateSubscriptionHealth({
        activeDays30d: 4,
        daysSinceLastActivity: 8,
        readinessDeltaPct: 0,
        featureAdoptionPct: 40,
        failedPaymentCount: 0,
        cancelAtPeriodEnd: false,
      }).status,
      "At Risk",
    );
    assert.equal(
      evaluateSubscriptionHealth({
        activeDays30d: 0,
        daysSinceLastActivity: 21,
        readinessDeltaPct: null,
        featureAdoptionPct: 0,
        failedPaymentCount: 2,
        cancelAtPeriodEnd: true,
      }).status,
      "Inactive",
    );
  });

  it("keeps progress, feature discovery, renewal, and win-back mechanics explicit", () => {
    assert.deepEqual([...RENEWAL_REMINDER_OFFSETS_DAYS], [7, 3, 0]);
    assert.deepEqual(
      buildRenewalReminderSchedule(new Date("2026-06-15T00:00:00.000Z")).map((r) => r.sendAt.toISOString().slice(0, 10)),
      ["2026-06-08", "2026-06-12", "2026-06-15"],
    );
    assert.ok(FEATURE_DISCOVERY_CAMPAIGNS.some((c) => c.headline === "Try ECG Detective Mode"));
    assert.ok(FEATURE_DISCOVERY_CAMPAIGNS.some((c) => c.headline === "Explore Clinical Lab Workstation"));
    assert.ok(buildAccomplishmentLines({
      questionsCompleted: 1287,
      flashcardsReviewed: 421,
      lessonsCompleted: 14,
      catExamsCompleted: 3,
      readinessStartPct: 61,
      readinessCurrentPct: 84,
      studyStreakDays: 7,
    }).includes("Readiness Improved: 61% -> 84%"));

    const kinds = read("src/lib/retention/learner-engagement-email-kinds.ts");
    for (const kind of ["renewal_reminder_7d", "renewal_reminder_3d", "renewal_reminder_day_of", "win_back_new_features"]) {
      assert.match(kinds, new RegExp(kind), `${kind} email kind missing`);
    }
    const templates = read("src/lib/retention/retention-templates.ts");
    for (const fn of ["renewalReminderEmailHtml", "featureDiscoveryEmailHtml", "winBackNewFeaturesEmailHtml"]) {
      assert.match(templates, new RegExp(`export function ${fn}`), `${fn} missing`);
    }
  });

  it("guards upgrades, cancellation, refund visibility, referrals, and chargeback evidence", () => {
    assert.ok(UPGRADE_TRIGGER_SURFACES.includes("Locked ECG"));
    assert.ok(UPGRADE_TRIGGER_SURFACES.includes("Locked Analytics"));
    for (const metric of ["Trial Conversion %", "Monthly Retention %", "Upgrade Rate %", "Chargeback Rate %", "Referral Conversion %"]) {
      assert.ok(REVENUE_ANALYTICS_METRICS.includes(metric as never), `${metric} missing`);
    }
    for (const field of ["Account Creation", "Email Verification", "Trial Redemption", "Subscription Activation", "Invoice Delivery", "Terms Acceptance"]) {
      assert.ok(CHARGEBACK_EVIDENCE_FIELDS.includes(field as never), `${field} missing`);
    }
    for (const surface of ["Pricing", "Checkout", "Billing", "Receipts", "Account Settings"]) {
      assert.ok(REFUND_POLICY_SURFACES.includes(surface as never), `${surface} missing`);
    }

    const billingManagement = read("src/lib/billing/subscription-management.ts");
    assert.match(billingManagement, /invoices\.createPreview/, "upgrades must preview proration");
    assert.match(billingManagement, /proration_behavior:\s*"always_invoice"/, "immediate upgrades must prorate");
    assert.match(billingManagement, /subscriptionSchedules\.create/, "downgrades should schedule at period end");

    const cancel = read("src/components/student/learner-billing-cancel-subscription.tsx");
    assert.match(cancel, /data-nn-cancellation-save-flow/, "cancellation save flow missing");
    for (const phrase of ["Pause Instead", "Switch Plan", "Review Progress", "Ask Support"]) {
      assert.match(cancel, new RegExp(phrase), `${phrase} missing from cancellation save flow`);
    }

    const evidence = read("src/lib/admin/account-activity-evidence.ts");
    for (const phrase of ["Policy Acceptances", "Access Breakdown", "Recent Timeline", "Evidence Notes"]) {
      assert.match(evidence, new RegExp(phrase), `${phrase} missing from account evidence report`);
    }
    const referrals = read("src/components/referrals/referral-dashboard-card.tsx");
    assert.match(referrals, /Rewards require verified, active learners/);
    assert.match(referrals, /starts learning/);
  });

  it("documents the full retention and dispute-protection operating model", () => {
    const doc = read("docs/subscription-retention-upgrades-chargeback-protection.md");
    for (const phrase of [
      "Subscription Transparency",
      "Progress-Based Retention",
      "Subscription Health",
      "Feature Discovery",
      "Upgrade And Proration",
      "Cancellation Save Flow",
      "Chargeback Evidence",
      "Renewal Communications",
      "Refund Policy",
      "Win-Back",
      "Referral Guardrails",
      "Revenue Analytics",
    ]) {
      assert.match(doc, new RegExp(phrase), `${phrase} missing from retention doc`);
    }
  });
});
