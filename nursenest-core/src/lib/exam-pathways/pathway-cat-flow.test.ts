import assert from "node:assert/strict";
import test from "node:test";
import { appPathwayCatSessionStartPath } from "@/lib/exam-pathways/pathway-cat-flow";

test("appPathwayCatSessionStartPath always encodes pathwayId for CAT start", () => {
  const href = appPathwayCatSessionStartPath("us-rn-nclex-rn");
  assert.ok(href.startsWith("/app/practice-tests/start?"));
  const q = new URLSearchParams(href.slice("/app/practice-tests/start?".length));
  assert.equal(q.get("pathwayId"), "us-rn-nclex-rn");
});
