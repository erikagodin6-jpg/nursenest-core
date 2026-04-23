/**
 * Contract: marketing lessons hub runs verify without throwing on all-row exclusion,
 * logs structured pipeline + soft verify outcomes, and keeps retry shell for true load failures only.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("marketing lessons hub page wires verify + staged pipeline logs (no verify-throw error shell)", () => {
  const pagePath = join(
    __dirname,
    "../../app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/page.tsx",
  );
  const src = readFileSync(pagePath, "utf8");
  assert.ok(src.includes("verifyMarketingHubLessonRowsResolve"), "must call hub verify");
  assert.ok(!src.includes("HubVerifyPreparedPositiveZeroKeptError"), "must not throw verify invariant class");
  assert.ok(src.includes("marketing_hub_pipeline_snapshot"), "must log staged pipeline snapshot");
  assert.ok(src.includes("loader_renderable_all_len"), "must log renderable-all length");
  assert.ok(src.includes("stage_1_raw_slug_safe_rows"), "must log numbered pipeline stages");
  assert.ok(src.includes("list_locale_effective"), "must log list warehouse locale for verify parity");
  assert.ok(src.includes("verify_exclusion_ranked_json"), "must log ranked verify exclusion reasons");
  assert.ok(src.includes("raw_after_slug_filter"), "must log slug-filter stage");
  assert.ok(src.includes("marketing_hub_verify_all_rows_excluded_soft"), "must log soft all-excluded verify");
  assert.ok(src.includes("MarketingLessonsHubRetryableErrorShell"), "must keep retry shell for load failures");
  assert.ok(src.includes("lessonsPageLoad.status"), "retry shell must remain tied to lesson list load status");
});
