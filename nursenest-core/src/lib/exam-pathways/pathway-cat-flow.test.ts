import assert from "node:assert/strict";
import test from "node:test";
import {
  appCatWeakFocusPath,
  appPathwayCatFullSetupHref,
  appPathwayCatSessionStartPath,
  isForcedCatFullSetupReviewParam,
  resolveStudySurfaceCatHref,
} from "@/lib/exam-pathways/pathway-cat-flow";

test("appPathwayCatSessionStartPath encodes pathwayId on the shared setup launcher", () => {
  const href = appPathwayCatSessionStartPath("us-rn-nclex-rn");
  assert.ok(href.startsWith("/app/practice-tests?"));
  const q = new URLSearchParams(href.slice("/app/practice-tests?".length));
  assert.equal(q.get("pathwayId"), "us-rn-nclex-rn");
  assert.equal(q.get("catLaunch"), null);
});

test("appCatWeakFocusPath keeps cat mode and pathway context", () => {
  const href = appCatWeakFocusPath("ca-rpn-rex-pn", "Pharmacology");
  assert.ok(href.startsWith("/app/practice-tests?"));
  const q = new URLSearchParams(href.slice("/app/practice-tests?".length));
  assert.equal(q.get("cat"), "1");
  assert.equal(q.get("focus"), "weak");
  assert.equal(q.get("pathwayId"), "ca-rpn-rex-pn");
  assert.equal(q.get("topic"), "Pharmacology");
});

test("resolveStudySurfaceCatHref scopes CAT start when the pathway is unambiguous", () => {
  assert.equal(
    resolveStudySurfaceCatHref({
      availablePathwayIds: ["us-rn-nclex-rn"],
    }),
    "/app/practice-tests?pathwayId=us-rn-nclex-rn",
  );
});

test("resolveStudySurfaceCatHref keeps the explicit chooser when multiple pathways are available", () => {
  assert.equal(
    resolveStudySurfaceCatHref({
      availablePathwayIds: ["us-rn-nclex-rn", "us-np-fnp"],
    }),
    "/app/practice-tests",
  );
});

test("appPathwayCatFullSetupHref uses the unified practice setup surface", () => {
  const href = appPathwayCatFullSetupHref("us-rn-nclex-rn");
  assert.ok(href.startsWith("/app/practice-tests?"));
  const q = new URLSearchParams(href.slice("/app/practice-tests?".length));
  assert.equal(q.get("pathwayId"), "us-rn-nclex-rn");
  assert.equal(q.get("catLaunch"), null);
});

test("isForcedCatFullSetupReviewParam: only 1 and true (trimmed, case-insensitive)", () => {
  assert.equal(isForcedCatFullSetupReviewParam("1"), true);
  assert.equal(isForcedCatFullSetupReviewParam(" true "), true);
  assert.equal(isForcedCatFullSetupReviewParam("TRUE"), true);
  assert.equal(isForcedCatFullSetupReviewParam("0"), false);
  assert.equal(isForcedCatFullSetupReviewParam("yes"), false);
  assert.equal(isForcedCatFullSetupReviewParam(undefined), false);
});
