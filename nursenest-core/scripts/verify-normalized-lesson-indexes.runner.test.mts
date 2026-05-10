import assert from "node:assert/strict";
import test from "node:test";

import {
  getLessonVerifyMode,
  shouldDeepVerifyPathway,
} from "./verify-normalized-lesson-indexes.runner.mts";

test("getLessonVerifyMode defaults to deep verification", () => {
  assert.equal(getLessonVerifyMode({}), "deep");
});

test("getLessonVerifyMode honors explicit lightweight skip env", () => {
  assert.equal(getLessonVerifyMode({ NN_SKIP_HEAVY_LESSON_VERIFY: "1" }), "light");
});

test("getLessonVerifyMode lets deep verification override lightweight flags", () => {
  assert.equal(
    getLessonVerifyMode({
      NN_SKIP_HEAVY_LESSON_VERIFY: "1",
      NN_DEEP_LESSON_VERIFY: "true",
    }),
    "deep",
  );
});

test("shouldDeepVerifyPathway verifies only changed pathways in changed-only mode", () => {
  const changed = new Set(["us-rn-nclex-rn"]);

  assert.equal(shouldDeepVerifyPathway("us-rn-nclex-rn", "changed-only", changed), true);
  assert.equal(shouldDeepVerifyPathway("ca-rpn-rex-pn", "changed-only", changed), false);
});

test("shouldDeepVerifyPathway treats changed-only without a changed set as deep-safe", () => {
  assert.equal(shouldDeepVerifyPathway("us-rn-nclex-rn", "changed-only", new Set()), true);
});
