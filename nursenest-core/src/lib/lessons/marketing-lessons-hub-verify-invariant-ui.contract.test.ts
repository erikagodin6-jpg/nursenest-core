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
  assert.ok(src.includes(`errorTitle={"We're having trouble loading lessons"}`), "must use user-facing error title");
  assert.ok(
    src.includes(`errorBody={"This isn't your fault. Something went wrong on our side."}`),
    "must use user-facing error body",
  );
  assert.ok(src.includes("pathway: pathway.id"), "log must include pathway key");
  assert.ok(src.includes("prepared_count: String(e.preparedCount)"), "log must include prepared_count");
  assert.ok(src.includes('verify_kept_count: "0"'), "log must include verify_kept_count");
  assert.ok(src.includes("reasons_json: e.reasonsJson"), "log must include reasons_json");
  assert.ok(src.includes("supportHref={`/${countrySlug}/contact`}"), "must offer support link on invariant path");
  const invBlock = src.slice(src.indexOf("if (e instanceof HubVerifyPreparedPositiveZeroKeptError)"));
  const returnIdx = invBlock.indexOf("return (");
  const shellProps = invBlock.slice(0, returnIdx > 0 ? returnIdx : 8000);
  assert.doesNotMatch(shellProps, /errorDetail=/, "invariant branch must not expose technical errorDetail to users");
  assert.doesNotMatch(shellProps, /totalCount=\{0\}/, "invariant toolbar must not show zero-lesson count strip");
});
