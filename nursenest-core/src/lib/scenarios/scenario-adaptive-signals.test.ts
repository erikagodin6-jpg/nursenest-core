import assert from "node:assert/strict";
import test from "node:test";
import { anyWeakTopicsSuggestScenarios, weakTopicSuggestsScenarioFocus } from "@/lib/scenarios/scenario-adaptive-signals";

test("weakTopicSuggestsScenarioFocus detects judgment-style weak areas", () => {
  assert.equal(weakTopicSuggestsScenarioFocus("Prioritization & delegation"), true);
  assert.equal(weakTopicSuggestsScenarioFocus("Fluid & electrolytes"), false);
});

test("anyWeakTopicsSuggestScenarios aggregates lists", () => {
  assert.equal(anyWeakTopicsSuggestScenarios(["Safety & infection control", "Leadership"]), true);
  assert.equal(anyWeakTopicsSuggestScenarios(["Fluid & electrolytes", "Pharmacology"]), false);
});
