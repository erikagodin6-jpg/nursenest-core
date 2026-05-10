import assert from "node:assert/strict";
import test from "node:test";
import { anyWeakTopicsSuggestLabs, weakTopicSuggestsLabsFocus } from "@/lib/labs/labs-adaptive-signals";

test("weakTopicSuggestsLabsFocus detects lab-adjacent weak areas", () => {
  assert.equal(weakTopicSuggestsLabsFocus("Fluid & electrolytes"), true);
  assert.equal(weakTopicSuggestsLabsFocus("Potassium management"), true);
  assert.equal(weakTopicSuggestsLabsFocus("Delegation basics"), false);
});

test("anyWeakTopicsSuggestLabs aggregates lists", () => {
  assert.equal(anyWeakTopicsSuggestLabs(["Acid-base balance", "Leadership"]), true);
  assert.equal(anyWeakTopicsSuggestLabs(["Delegation", "Leadership"]), false);
});
