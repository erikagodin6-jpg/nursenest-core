/**
 * P0 billing-safety contract: prevent duplicate Stripe subscriptions / double charges.
 *
 * Static reads — no Stripe HTTP, no Prisma runtime — match the existing pattern in
 * `stripe-webhook-policy.test.ts`. These guards are the long-tail regression net for the
 * hotfix `hotfix/billing-prevent-duplicate-subscriptions`: if any of them fail, the
 * duplicate-charge protections have regressed and the next deploy MUST be blocked.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const nursenestCoreRoot = join(here, "..", "..", "..");
const checkoutRoutePath = join(
  nursenestCoreRoot,
  "src",
  "app",
  "api",
  "subscriptions",
  "checkout",
  "route.ts",
);
const diagnosticsPath = join(
  nursenestCoreRoot,
  "src",
  "lib",
  "stripe",
  "checkout-api-diagnostics.ts",
);

function readCheckoutRoute(): string {
  return readFileSync(checkoutRoutePath, "utf8");
}

describe("checkout duplicate-charge protection (static contract)", () => {
  it("imports SubscriptionStatus as a value (not just a type) for the active-sub guard", () => {
    const src = readCheckoutRoute();
    assert.match(
      src,
      /import\s*\{[^}]*\bSubscriptionStatus\b[^}]*\}\s*from\s*["']@prisma\/client["']/,
      "checkout route must import SubscriptionStatus as a value to enum-check existing rows",
    );
  });

  it("blocks billing-active subscribers from creating a brand-new Stripe Checkout session", () => {
    const src = readCheckoutRoute();
    assert.match(
      src,
      /ACTIVE_SUBSCRIPTION_STATES_BLOCKING_NEW_CHECKOUT/,
      "active-subscription state list must be defined and named",
    );
    assert.match(src, /SubscriptionStatus\.ACTIVE/);
    assert.match(src, /SubscriptionStatus\.PAST_DUE/);
    assert.match(src, /SubscriptionStatus\.GRACE/);
    assert.ok(
      !/SubscriptionStatus\.CANCELLED[\s\S]{0,200}ACTIVE_SUBSCRIPTION_STATES_BLOCKING_NEW_CHECKOUT/.test(src),
      "CANCELLED must not be in the blocking states list — cancelled users must be free to re-subscribe",
    );
    assert.match(
      src,
      /prisma\.subscription\.findFirst\(\{[\s\S]*?status:\s*\{\s*in:\s*\[\.\.\.ACTIVE_SUBSCRIPTION_STATES_BLOCKING_NEW_CHECKOUT\]/,
      "must query Subscription rows for the user against the blocking states",
    );
  });

  it("returns 409 with already_subscribed code and billingPortalRedirectPath when blocked", () => {
    const src = readCheckoutRoute();
    assert.match(src, /CHECKOUT_ALREADY_SUBSCRIBED_CODE/);
    assert.match(
      src,
      /billingPortalRedirectPath:\s*BILLING_PORTAL_REDIRECT_PATH/,
      "blocked response must surface the redirect target so the client can route to the portal",
    );
    assert.match(src, /BILLING_PORTAL_REDIRECT_PATH\s*=\s*["']\/app\/account\/billing["']/);
    assert.match(src, /\bstatus:\s*409\b/);
    assert.match(
      src,
      /recordCheckoutFailure\(\s*["']already_subscribed["']/,
      "must emit the metric so duplicate-checkout attempts show up in observability",
    );
    assert.match(
      src,
      /auditCheckoutFailed\(\{[^}]*reason:\s*["']already_subscribed["']/,
      "must emit billing-audit so duplicate-checkout attempts are traceable per user",
    );
  });

  it("places the active-subscription guard before stripe.checkout.sessions.create", () => {
    const src = readCheckoutRoute();
    const guardIdx = src.indexOf("CHECKOUT_ALREADY_SUBSCRIBED_CODE");
    const stripeCallIdx = src.indexOf("stripe.checkout.sessions.create");
    assert.ok(guardIdx > 0, "guard must exist in the route");
    assert.ok(stripeCallIdx > 0, "stripe.checkout.sessions.create must still exist");
    assert.ok(
      guardIdx < stripeCallIdx,
      "duplicate-subscription guard must run BEFORE the Stripe Checkout session create",
    );
  });

  it("passes a deterministic Stripe idempotency key to checkout.sessions.create", () => {
    const src = readCheckoutRoute();
    assert.match(
      src,
      /buildCheckoutSubscriptionIdempotencyKey\s*\(\s*userId\s*,\s*priceId\s*\)/,
      "idempotency key must be derived deterministically from userId + priceId",
    );
    assert.match(
      src,
      /["']checkout-sub-v1:\$\{userId\}:\$\{priceId\}["']/,
      "idempotency key format must be 'checkout-sub-v1:${userId}:${priceId}' (documented in audit)",
    );
    assert.match(src, /stripe\.checkout\.sessions\.create\(/);
    assert.match(
      src,
      /\{\s*idempotencyKey:\s*checkoutIdempotencyKey\s*\}/,
      "Stripe.RequestOptions { idempotencyKey } must be passed as the second argument",
    );
  });

  it("reuses the existing Stripe Customer with a null-safe Prisma filter", () => {
    const src = readCheckoutRoute();
    assert.ok(
      !/stripeCustomerId:\s*\{\s*not:\s*""\s*\}/.test(src),
      "the legacy `{ not: \"\" }` filter is broken on the nullable column; must be `{ not: null }`",
    );
    assert.match(
      src,
      /stripeCustomerId:\s*\{\s*not:\s*null\s*\}/,
      "customer reuse must use `{ not: null }` to match the portal route filter",
    );
    assert.match(
      src,
      /\bexistingCustomerId\s*\?\s*\{\s*customer:\s*existingCustomerId\s*\}\s*:/,
      "when an existing customer id is found, the Stripe session must reuse it (no duplicate Customer)",
    );
  });
});

describe("checkout-api-diagnostics: already_subscribed error code", () => {
  it("exports CHECKOUT_ALREADY_SUBSCRIBED_CODE with the canonical value", () => {
    const src = readFileSync(diagnosticsPath, "utf8");
    assert.match(
      src,
      /export\s+const\s+CHECKOUT_ALREADY_SUBSCRIBED_CODE\s*=\s*["']already_subscribed["']/,
      "diagnostic code must be exported as `already_subscribed` for client-side error matching",
    );
  });
});

describe("webhook idempotency + DB invariants (cross-check)", () => {
  it("StripeWebhookEvent claim row keeps webhook double-delivery from double-applying", () => {
    const idempotencySrc = readFileSync(
      join(nursenestCoreRoot, "src", "lib", "stripe", "stripe-webhook-idempotency.ts"),
      "utf8",
    );
    assert.match(idempotencySrc, /stripeWebhookEvent\.create/);
    assert.match(idempotencySrc, /P2002/);
    assert.match(idempotencySrc, /duplicate/);
  });

  it("Prisma schema keeps the unique constraint on Subscription.stripeSubscriptionId", () => {
    const schemaSrc = readFileSync(
      join(nursenestCoreRoot, "prisma", "schema.prisma"),
      "utf8",
    );
    assert.match(
      schemaSrc,
      /stripeSubscriptionId\s+String\s+@unique/,
      "Subscription.stripeSubscriptionId @unique is the DB-level guard against duplicate sub_… rows",
    );
  });
});
