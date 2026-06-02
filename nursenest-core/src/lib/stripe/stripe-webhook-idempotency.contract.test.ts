import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const nursenestCoreRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

describe("stripe webhook idempotency (static contract)", () => {
  it("claim uses create + P2002 duplicate path for concurrent dedupe", () => {
    const src = readFileSync(join(nursenestCoreRoot, "src", "lib", "stripe", "stripe-webhook-idempotency.ts"), "utf8");
    assert.match(src, /stripeWebhookEvent\.create/);
    assert.match(src, /P2002/);
    assert.match(src, /duplicate/);
  });

  it("webhook route returns 200 with duplicate flag on replay", () => {
    const src = readFileSync(
      join(nursenestCoreRoot, "src", "app", "api", "subscriptions", "webhook", "route.ts"),
      "utf8",
    );
    assert.match(src, /claim === "duplicate"/);
    assert.match(src, /duplicate:\s*true/);
    assert.match(src, /releaseStripeWebhookEventClaim/);
  });
});
