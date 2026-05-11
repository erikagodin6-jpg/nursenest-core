import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();
const portalRoute = readFileSync(path.join(ROOT, "src/app/api/billing/portal/route.ts"), "utf8");
const cancelRoute = readFileSync(path.join(ROOT, "src/app/api/billing/cancel-subscription/route.ts"), "utf8");

describe("billing route contracts", () => {
  it("billing portal reconciles Stripe first and returns an explicit NO_CUSTOMER state", () => {
    assert.match(portalRoute, /reconcileUserSubscriptionFromStripe\(userId,\s*\{\s*surface:\s*"billing_portal"\s*\}\)/);
    assert.match(portalRoute, /code:\s*"NO_CUSTOMER"/);
    assert.match(portalRoute, /billingPortal\.sessions\.create/);
    assert.match(portalRoute, /return_url:\s*`\$\{appUrl\}\/app\/account\/billing\?portal=return`/);
  });

  it("cancel subscription reconciles Stripe, enforces eligibility, and mirrors cancel_at_period_end locally", () => {
    assert.match(cancelRoute, /reconcileUserSubscriptionFromStripe\(userId,[\s\S]*surface:\s*"cancel_subscription_api"/);
    assert.match(cancelRoute, /canUserCancelStripeSubscription\(stripeSubscription\)/);
    assert.match(cancelRoute, /stripe\.subscriptions\.update\(stripeSubscription\.id,\s*\{\s*cancel_at_period_end:\s*true\s*\}\)/);
    assert.match(cancelRoute, /persistStripeSubscriptionMirrorForUser\(userId,\s*updated\)/);
    assert.match(cancelRoute, /code:\s*"NO_ACTIVE_SUBSCRIPTION"/);
  });
});
