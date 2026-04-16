/**
 * Stripe webhook security & idempotency contracts (static reads — no Stripe HTTP).
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const nursenestCoreRoot = join(here, "..", "..", "..");

describe("stripe webhook policy (static)", () => {
  it("route claims StripeWebhookEvent before applyStripeWebhookEvent (multi-instance safe)", () => {
    const route = readFileSync(
      join(nursenestCoreRoot, "src", "app", "api", "subscriptions", "webhook", "route.ts"),
      "utf8",
    );
    const idxClaim = route.indexOf("await claimStripeWebhookEventOrDuplicate");
    const idxApply = route.indexOf("await applyStripeWebhookEvent");
    assert.ok(idxClaim > 0 && idxApply > idxClaim, "claim insert must run before apply");
    assert.match(route, /releaseStripeWebhookEventClaim/);
  });

  it("signature verification uses constructStripeWebhookEvent helper", () => {
    const route = readFileSync(
      join(nursenestCoreRoot, "src", "app", "api", "subscriptions", "webhook", "route.ts"),
      "utf8",
    );
    assert.match(route, /constructStripeWebhookEvent/);
    assert.ok(!route.includes("constructEvent(body, signature"), "use shared verify helper");
  });

  it("handler module covers checkout, subscription created/updated/deleted, invoice succeeded/failed", () => {
    const src = readFileSync(join(nursenestCoreRoot, "src", "lib", "stripe", "apply-stripe-webhook-event.ts"), "utf8");
    for (const t of [
      "checkout.session.completed",
      "customer.subscription.created",
      "customer.subscription.updated",
      "customer.subscription.deleted",
      "invoice.payment_succeeded",
      "invoice.payment_failed",
    ]) {
      assert.match(src, new RegExp(`"${t}"`), `missing ${t}`);
    }
  });

  it("route returns 200 ignored for verified but unhandled event types (allowlist)", () => {
    const route = readFileSync(
      join(nursenestCoreRoot, "src", "app", "api", "subscriptions", "webhook", "route.ts"),
      "utf8",
    );
    assert.match(route, /isStripeWebhookEventTypeHandled/);
    assert.match(route, /ignored:\s*true/);
  });

  it("checkout API uses server session userId for metadata, not client-supplied user id alone", () => {
    const checkout = readFileSync(
      join(nursenestCoreRoot, "src", "app", "api", "subscriptions", "checkout", "route.ts"),
      "utf8",
    );
    assert.match(checkout, /sessionUserId\(session\)/);
    assert.match(checkout, /metadata/);
  });
});
