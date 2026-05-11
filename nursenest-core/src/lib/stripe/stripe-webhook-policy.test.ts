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

  it("apply-stripe-webhook-event uses shared getStripeClient (no stale notification-only helper)", () => {
    const applySrc = readFileSync(join(nursenestCoreRoot, "src", "lib", "stripe", "apply-stripe-webhook-event.ts"), "utf8");
    assert.match(applySrc, /import\s*\{\s*getStripeClient\s*\}\s*from\s*["']@\/lib\/stripe\/stripe-client["']/);
    assert.ok(
      !applySrc.includes("getStripeClientForNotification"),
      "removed/renamed helper must not reappear — use getStripeClient() for SMS/email notify paths",
    );
  });

  it("subscription upsert passes real Stripe event id into admin SMS (idempotency + logs)", () => {
    const applySrc = readFileSync(join(nursenestCoreRoot, "src", "lib", "stripe", "apply-stripe-webhook-event.ts"), "utf8");
    assert.match(applySrc, /async function applyCustomerSubscriptionUpsert\([\s\S]*stripeEventId: string/);
    assert.match(applySrc, /applyCustomerSubscriptionUpsert\(sub, ctx \?\? \{\}, eventIdPrefix, event\.type, event\.id\)/);
    assert.ok(!applySrc.includes("id: \"\""), "fake Stripe event must not use empty id (breaks notify dedupe)");
  });

  it("handler module covers allowlisted event types (keep in sync with stripe-webhook-event-policy)", () => {
    const applySrc = readFileSync(join(nursenestCoreRoot, "src", "lib", "stripe", "apply-stripe-webhook-event.ts"), "utf8");
    const policy = readFileSync(
      join(nursenestCoreRoot, "src", "lib", "stripe", "stripe-webhook-event-policy.ts"),
      "utf8",
    );
    const block = policy.slice(policy.indexOf("STRIPE_WEBHOOK_HANDLED_EVENT_TYPES"));
    const end = block.indexOf("] as const");
    const arr = block.slice(0, end > 0 ? end : 400);
    const handled = [...arr.matchAll(/"([^"]+)"/g)]
      .map((m) => m[1])
      .filter((t) => t.includes(".") || t.includes("_"));
    const unique = [...new Set(handled)];
    assert.equal(unique.length, 7, `expected 7 handled types, got ${unique.join(",")}`);
    for (const t of unique) {
      assert.match(applySrc, new RegExp(`"${t}"`), `missing ${t}`);
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

  it("checkout rejects undeclared JSON fields and binds Stripe price from server resolution only", () => {
    const checkout = readFileSync(
      join(nursenestCoreRoot, "src", "app", "api", "subscriptions", "checkout", "route.ts"),
      "utf8",
    );
    assert.match(checkout, /\.strict\(\)/);
    assert.match(checkout, /line_items:\s*\[\{\s*price:\s*priceId/);
    assert.ok(!/req\.json\(\)/.test(checkout), "use size-limited JSON parse");
  });

  it("checkout writes plan country metadata onto subscription_data for later webhook/reconcile sync", () => {
    const checkout = readFileSync(
      join(nursenestCoreRoot, "src", "app", "api", "subscriptions", "checkout", "route.ts"),
      "utf8",
    );
    assert.match(checkout, /const subscriptionMetadata: Record<string, string>/);
    assert.match(checkout, /subscriptionMetadata\.country = metadata\.country/);
    assert.match(checkout, /metadata: subscriptionMetadata/);
  });

  it("webhook and reconcile sync user country from subscription metadata or preserved row context, not raw price id alone", () => {
    const applySrc = readFileSync(join(nursenestCoreRoot, "src", "lib", "stripe", "apply-stripe-webhook-event.ts"), "utf8");
    const reconcileSrc = readFileSync(
      join(nursenestCoreRoot, "src", "lib", "subscriptions", "stripe-subscription-reconcile.ts"),
      "utf8",
    );
    const runSrc = readFileSync(
      join(nursenestCoreRoot, "src", "lib", "stripe", "stripe-subscription-reconciliation-run.ts"),
      "utf8",
    );

    assert.match(applySrc, /const metadataPlan = planFromCheckoutMetadata\(stripeSubMeta\)/);
    assert.match(applySrc, /syncUserFromStripePriceId\(row\.userId, priceId, metadataPlan\?\.country \?\? row\.planCountry \?\? null\)/);

    assert.match(reconcileSrc, /const metadataPlan = planFromCheckoutMetadata\(stripeMeta\)/);
    assert.match(reconcileSrc, /syncUserFromStripePriceId\(rowForSync\.userId, priceId, rowForSync\.planCountry \?\? null\)/);

    assert.match(runSrc, /const metadataPlan = planFromCheckoutMetadata\(stripeMeta\)/);
    assert.match(runSrc, /syncUserFromStripePriceId\(metadataUserId, priceId, resolvedPlanCountry\)/);
    assert.match(runSrc, /syncUserFromStripePriceId\(row\.userId, priceId, resolvedPlanCountry \?\? row\.planCountry \?\? null\)/);
  });
});
