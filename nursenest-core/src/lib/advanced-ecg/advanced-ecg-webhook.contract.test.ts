import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

test("Stripe checkout completion persists payment-mode Advanced ECG purchases with a lifetime payment reference", () => {
  const applySrc = readFileSync(
    path.join(process.cwd(), "src/lib/stripe/apply-stripe-webhook-event.ts"),
    "utf8",
  );

  assert.match(applySrc, /session\.mode === "payment"/);
  assert.match(applySrc, /session\.payment_intent/);
  assert.match(applySrc, /advancedEcgLifetimeStripeReference/);
});
