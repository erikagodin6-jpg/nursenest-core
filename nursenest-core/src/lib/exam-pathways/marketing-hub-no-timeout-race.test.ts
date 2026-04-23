/**
 * Hub marketing loaders must not use Promise.race timeouts that turn slow dependencies into fake empty payloads.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("marketing-hub-optional-data has no runHubOptionalTask / hub_optional_task_timeout race", () => {
  const src = readFileSync(join(__dirname, "marketing-hub-optional-data.ts"), "utf8");
  assert.ok(!src.includes("runHubOptionalTask"), "timeout wrapper must be removed");
  assert.ok(!src.includes("hub_optional_task_timeout"), "timeout error token must be gone from this module");
  assert.ok(
    src.includes("Promise.allSettled(tasks.map((t) => t.run()))"),
    "aggregates must await real task completion (no artificial race)",
  );
});

test("PathwayLessonsHubAggregates exposes per-task rejection flags for UI + logs", () => {
  const src = readFileSync(join(__dirname, "marketing-hub-optional-data.ts"), "utf8");
  assert.ok(src.includes("lessonsPageLoadRejected"));
  assert.ok(src.includes("questionSnapshotLoadRejected"));
  assert.ok(src.includes("pathwayLessonCountLoadRejected"));
  assert.ok(src.includes("topicClustersLoadRejected"));
});
