/**
 * Contract: marketing lessons hub catches verify pipeline invariant at the page boundary
 * (retry UI — not a fake empty curriculum, not an unhandled 500).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("marketing lessons hub page catches HubVerifyPreparedPositiveZeroKeptError and logs invariant surface", () => {
  const pagePath = join(
    __dirname,
    "../../app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx",
  );
  const src = readFileSync(pagePath, "utf8");
  assert.ok(src.includes("HubVerifyPreparedPositiveZeroKeptError"), "must import invariant error class");
  assert.ok(src.includes("marketing_hub_verify_invariant_error_surface"), "must log invariant error surface");
  assert.ok(src.includes("MarketingLessonsHubRetryableErrorShell"), "must render retryable shell, not empty grid");
});
