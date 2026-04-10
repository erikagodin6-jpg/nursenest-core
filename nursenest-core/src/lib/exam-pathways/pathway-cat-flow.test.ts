import assert from "node:assert/strict";
import test from "node:test";
import {
  appCatWeakFocusPath,
  appPathwayCatSessionStartPath,
} from "@/lib/exam-pathways/pathway-cat-flow";

test("appPathwayCatSessionStartPath always encodes pathwayId for CAT start", () => {
  const href = appPathwayCatSessionStartPath("us-rn-nclex-rn");
  assert.ok(href.startsWith("/app/practice-tests/start?"));
  const q = new URLSearchParams(href.slice("/app/practice-tests/start?".length));
  assert.equal(q.get("pathwayId"), "us-rn-nclex-rn");
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
