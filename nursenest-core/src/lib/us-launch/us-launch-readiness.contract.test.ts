import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { PH } from "@/lib/observability/posthog-conversion-events";
import { buildPricingOptionsPayload } from "@/lib/pricing/pricing-options-build-payload";
import { regionalStripePriceEnvKeyForPlan } from "@/lib/pricing/regional-pricing-map";
import { requiredUsLaunchRevenueEvents } from "@/lib/us-launch/us-launch-status";

const root = process.cwd();

function read(path: string): string {
  return readFileSync(join(root, path), "utf8");
}

test("US launch revenue funnel events are explicit PostHog events", () => {
  assert.deepEqual(requiredUsLaunchRevenueEvents(), [
    "signup_started",
    "signup_completed",
    "trial_started",
    "trial_converted",
    "subscription_purchased",
    "subscription_cancelled",
    "flashcards_started",
    "cat_started",
    "practice_started",
  ]);
  assert.equal(PH.subscriptionPurchased, "subscription_purchased");
  assert.equal(PH.flashcardsStarted, "flashcards_started");
});

test("US pricing payload renders USD rows for US RN launch", () => {
  const payload = buildPricingOptionsPayload();
  const rnMonthly = payload.plans.find((row) => row.country === "US" && row.tier === "RN" && row.duration === "monthly");
  const lpnMonthly = payload.plans.find((row) => row.country === "US" && row.tier === "LVN_LPN" && row.duration === "monthly");
  const alliedMonthly = payload.alliedPlans.find((row) => row.country === "US" && row.alliedCareer === "paramedic" && row.duration === "monthly");

  assert.equal(rnMonthly?.totalLabel, "$39.99 USD");
  assert.equal(rnMonthly?.monthlyEquivalentLabel, "$39.99 USD/mo");
  assert.equal(lpnMonthly?.totalLabel, "$24.99 USD");
  assert.equal(alliedMonthly?.totalLabel, "$24.99 USD");
});

test("US multi-currency Stripe env keys are tier-specific", () => {
  assert.equal(regionalStripePriceEnvKeyForPlan("us", "nursing", "monthly", "RN"), "STRIPE_PRICE_US_RN_MONTHLY");
  assert.equal(regionalStripePriceEnvKeyForPlan("us", "nursing", "monthly", "LVN_LPN"), "STRIPE_PRICE_US_LPN_MONTHLY");
  assert.equal(regionalStripePriceEnvKeyForPlan("us", "nursing", "monthly", "NP"), "STRIPE_PRICE_US_NP_MONTHLY");
  assert.equal(regionalStripePriceEnvKeyForPlan("us", "allied", "monthly"), "STRIPE_PRICE_US_ALLIED_MONTHLY");
});

test("checkout route has Stripe tax, retry, idempotency, and NA scope acknowledgement handling", () => {
  const source = read("src/app/api/subscriptions/checkout/route.ts");
  assert.match(source, /automatic_tax:\s*\{\s*enabled:\s*true\s*\}/);
  assert.match(source, /idempotencyKey/);
  assert.match(source, /checkout_session_retry/);
  assert.match(source, /CHECKOUT_NA_BILLING_SCOPE_ACK_REQUIRED_CODE/);
  assert.match(source, /lookupRegionalStripePriceIdForPlan/);
});

test("subscription lifecycle routes and webhook processing remain wired", () => {
  assert.match(read("src/app/api/billing/cancel-subscription/route.ts"), /POST/);
  assert.match(read("src/app/api/billing/reactivate-subscription/route.ts"), /POST/);
  assert.match(read("src/app/api/billing/portal/route.ts"), /billing portal|portal/i);
  const webhook = read("src/lib/stripe/apply-stripe-webhook-event.ts");
  assert.match(webhook, /customer\.subscription\.created/);
  assert.match(webhook, /customer\.subscription\.deleted/);
  assert.match(webhook, /invoice\.payment_succeeded/);
  assert.match(webhook, /PH\.trialStarted/);
  assert.match(webhook, /PH\.trialConverted/);
  assert.match(webhook, /PH\.subscriptionCancelled/);
});

test("critical revenue analytics are fired from production paths", () => {
  assert.match(read("src/components/auth/signup-form.tsx"), /PH\.signupStarted/);
  assert.match(read("src/components/auth/signup-form.tsx"), /PH\.signupCompleted/);
  assert.match(read("src/lib/stripe/apply-stripe-webhook-event.ts"), /PH\.trialStarted/);
  assert.match(read("src/lib/stripe/apply-stripe-webhook-event.ts"), /PH\.trialConverted/);
  assert.match(read("src/lib/stripe/apply-stripe-webhook-event.ts"), /PH\.subscriptionPurchased/);
  assert.match(read("src/components/flashcards/flashcard-deck-study-shell.tsx"), /PH\.flashcardsStarted/);
  assert.match(read("src/app/api/practice-tests/route.ts"), /PH\.catStarted/);
  assert.match(read("src/app/api/practice-tests/route.ts"), /PH\.practiceStarted/);
  assert.match(read("src/components/student/question-bank-practice-client.tsx"), /PH\.practiceStarted/);
});

test("US launch admin dashboard is server-side admin gated", () => {
  const source = read("src/app/(admin)/admin/us-launch-status/page.tsx");
  assert.match(source, /requireAdmin\(\)/);
  assert.match(source, /buildUsLaunchStatus/);
});
