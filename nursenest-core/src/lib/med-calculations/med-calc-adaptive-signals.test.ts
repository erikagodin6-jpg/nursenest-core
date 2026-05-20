import assert from "node:assert/strict";
import test from "node:test";
import {
  anyWeakTopicsSuggestMedCalc,
  weakTopicSuggestsMedCalcFocus,
} from "@/lib/med-calculations/med-calc-adaptive-signals";

test("weakTopicSuggestsMedCalcFocus detects pharmacology / dosing weak areas", () => {
  assert.equal(weakTopicSuggestsMedCalcFocus("Pharmacology & dosage calculations"), true);
  assert.equal(weakTopicSuggestsMedCalcFocus("IV infusions and drip rates"), true);
  assert.equal(weakTopicSuggestsMedCalcFocus("Weight-based pediatric dosing"), true);
  assert.equal(weakTopicSuggestsMedCalcFocus("Fluid & electrolytes"), false);
});

test("anyWeakTopicsSuggestMedCalc aggregates lists", () => {
  assert.equal(anyWeakTopicsSuggestMedCalc(["Acid-base balance", "Medication math"]), true);
  assert.equal(anyWeakTopicsSuggestMedCalc(["Acid-base balance", "Renal failure"]), false);
});
