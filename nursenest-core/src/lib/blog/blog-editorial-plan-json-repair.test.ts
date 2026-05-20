import assert from "node:assert/strict";
import test from "node:test";
import {
  extractTopicTitleHintsFromRawModelOutput,
  parseEditorialPlanJsonFromModel,
  repairCommonJsonModelDefects,
  sliceBalancedJsonObject,
} from "@/lib/blog/blog-editorial-plan-json-repair";

test("sliceBalancedJsonObject ignores trailing prose after the first complete object", () => {
  const raw = `Here is the plan:\n{"h1":"Diabetes nursing review","x":1}\n\nHope this helps!`;
  const slice = sliceBalancedJsonObject(raw);
  assert.equal(slice, '{"h1":"Diabetes nursing review","x":1}');
});

test("parseEditorialPlanJsonFromModel: smart quotes repaired on second pass", () => {
  const raw = "```json\n{\n  \"h1\": \u201cType 2 diabetes overview\u201d,\n  \"n\": 1\n}\n```";
  const r = parseEditorialPlanJsonFromModel(raw);
  assert.equal(r.ok, true);
  if (!r.ok) return;
  assert.equal((r.value as { h1?: string }).h1, "Type 2 diabetes overview");
  assert.ok(r.warnings.some((w) => w.includes("pass2")));
});

test("parseEditorialPlanJsonFromModel: trailing comma after last property", () => {
  const raw = '{"a":1,}';
  const r = parseEditorialPlanJsonFromModel(raw);
  assert.equal(r.ok, true);
  if (!r.ok) return;
  assert.deepEqual(r.value, { a: 1 });
});

test("extractTopicTitleHintsFromRawModelOutput reads h1 from broken JSON", () => {
  const raw = 'prefix {"h1":"Gestational diabetes nursing care", broken';
  const h = extractTopicTitleHintsFromRawModelOutput(raw);
  assert.equal(h.h1, "Gestational diabetes nursing care");
});

test("repairCommonJsonModelDefects normalizes smart quotes", () => {
  const t = repairCommonJsonModelDefects(`{\u201cok\u201d:1}`);
  assert.ok(t.includes('"ok"'));
});

test("parseEditorialPlanJsonFromModel fails gracefully on non-JSON", () => {
  const r = parseEditorialPlanJsonFromModel("no json here");
  assert.equal(r.ok, false);
  if (r.ok) return;
  assert.ok(r.warnings.length >= 1);
});
