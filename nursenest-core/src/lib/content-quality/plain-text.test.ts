import assert from "node:assert/strict";
import test from "node:test";
import { countWords, stripToPlainText } from "./plain-text";

test("stripToPlainText preserves clinical less-than comparisons while removing tags", () => {
  const text = "Check K+ < 3.5 mEq/L before <strong>digoxin</strong> and notify if level > 2.0 ng/mL.";
  const plain = stripToPlainText(text);
  assert.match(plain, /K\+ < 3\.5 mEq\/L/);
  assert.match(plain, /digoxin/);
  assert.match(plain, /level > 2\.0 ng\/mL/);
  assert.equal(plain.includes("<strong>"), false);
  assert.ok(countWords(text) >= 13);
});
