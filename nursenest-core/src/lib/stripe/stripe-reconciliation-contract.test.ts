/**
 * Static contracts for Stripe ↔ DB reconciliation (no Stripe HTTP).
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..", "..");

describe("stripe subscription reconciliation (static)", () => {
  it("core module logs repairs and emits drift signals", () => {
    const src = readFileSync(join(root, "src", "lib", "stripe", "stripe-subscription-reconciliation-run.ts"), "utf8");
    assert.match(src, /subscription_repaired/);
    assert.match(src, /emitReconciliationDriftSignals/);
    assert.match(src, /finalizeReconciliationRun/);
  });

  it("exposes admin on-demand route", () => {
    const route = readFileSync(join(root, "src", "app", "api", "admin", "billing", "stripe-reconcile", "route.ts"), "utf8");
    assert.match(route, /runStripeSubscriptionReconciliation/);
    assert.match(route, /requireAdmin/);
  });

  it("vercel cron schedules stripe-reconcile daily", () => {
    const v = readFileSync(join(root, "vercel.json"), "utf8");
    assert.match(v, /stripe-reconcile/);
  });
});
