import test from "node:test";
import assert from "node:assert/strict";
import { normalizeUniqueTopics } from "./blog-automation-engine";

test("normalizeUniqueTopics deduplicates case-insensitive repeats", () => {
  const topics = normalizeUniqueTopics([
    " Hyperkalemia nursing interventions ",
    "hyperkalemia nursing interventions",
    "ABG interpretation nursing",
  ]);

  assert.deepEqual(topics, ["Hyperkalemia nursing interventions", "ABG interpretation nursing"]);
});

test("normalizeUniqueTopics enforces max topic cap", () => {
  const topics = normalizeUniqueTopics(
    ["one", "two", "three", "four", "five"],
    3,
  );
  assert.deepEqual(topics, ["one", "two", "three"]);
});
