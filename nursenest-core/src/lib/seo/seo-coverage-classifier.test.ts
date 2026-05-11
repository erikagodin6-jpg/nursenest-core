import assert from "node:assert/strict";
import test from "node:test";
import { classifySeoAuditText } from "./seo-coverage-classifier";

test("classifies canonical conflict issues", () => {
  assert.ok(classifySeoAuditText("Non-canonical URL in sitemap").includes("canonical_conflicts"));
});

test("dedupes generic hreflang when blocked variant present", () => {
  const buckets = classifySeoAuditText("hreflang not reciprocal — invalid hreflang pair");
  assert.ok(buckets.includes("blocked_hreflang"));
  assert.ok(!buckets.includes("invalid_hreflang"));
});

test("unknown noise stays unclassified", () => {
  assert.deepEqual(classifySeoAuditText(""), ["unclassified"]);
  assert.deepEqual(classifySeoAuditText("zzz foo bar ???"), ["unclassified"]);
});
