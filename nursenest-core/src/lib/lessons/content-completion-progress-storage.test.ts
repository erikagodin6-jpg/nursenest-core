import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  CONTENT_COMPLETION_MAX_RUNS,
  emptyProgressFile,
  loadProgressFromPath,
  saveProgressToPath,
} from "./content-completion-progress-storage";
import type { LessonCompletionBatchReport } from "./lesson-batch-completion";

function minimalReport(pathwayId: string): LessonCompletionBatchReport {
  return {
    pathwayId,
    batchSize: 0,
    write: false,
    selectedAt: "fixed",
    lessonsCompleted: 0,
    lessonsSkippedAlreadyComplete: 0,
    lessonsUpdated: 0,
    lessonsStillPartial: 0,
    majorGapsRemaining: [],
    items: [],
  };
}

test("loadProgressFromPath returns empty file when missing", () => {
  const p = path.join(os.tmpdir(), `nn-progress-${Date.now()}.json`);
  const t0 = "2026-04-14T12:00:00.000Z";
  const f = loadProgressFromPath(p, t0);
  assert.equal(f.schemaVersion, 1);
  assert.equal(f.runs.length, 0);
});

test("save then load round-trips; append preserves prior runs deterministically for fixed timestamps", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "nn-audit-"));
  const p = path.join(dir, "content-completion-progress.json");
  const iso = "2026-04-14T12:00:00.000Z";
  let file = emptyProgressFile(iso);
  file.runs.push({
    at: iso,
    pathwayId: "us-rn-nclex-rn",
    batchSize: 10,
    offset: 0,
    write: false,
    mode: "complete",
    onlyNotComplete: true,
    completenessApproxPctBefore: 1,
    completenessApproxPctAfter: 2,
    report: minimalReport("us-rn-nclex-rn"),
    notes: [],
  });
  saveProgressToPath(p, file, iso);
  const again = loadProgressFromPath(p, iso);
  assert.equal(again.runs.length, 1);
  assert.equal(again.runs[0]?.pathwayId, "us-rn-nclex-rn");
  const raw = fs.readFileSync(p, "utf8");
  assert.ok(raw.endsWith("\n"));
});

test("corrupt JSON yields fresh file (runs reset)", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "nn-audit-"));
  const p = path.join(dir, "bad.json");
  fs.writeFileSync(p, "{ not json", "utf8");
  const t = "2026-04-14T12:00:00.000Z";
  const f = loadProgressFromPath(p, t);
  assert.equal(f.runs.length, 0);
});

test("save caps runs to CONTENT_COMPLETION_MAX_RUNS keeping newest", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "nn-audit-"));
  const p = path.join(dir, "cap.json");
  const iso = "2026-04-14T12:00:00.000Z";
  let file = emptyProgressFile(iso);
  for (let i = 0; i < CONTENT_COMPLETION_MAX_RUNS + 5; i += 1) {
    file.runs.push({
      at: `${iso}${i}`,
      pathwayId: "x",
      batchSize: 1,
      offset: i,
      write: false,
      mode: "complete",
      onlyNotComplete: true,
      completenessApproxPctBefore: 0,
      completenessApproxPctAfter: 0,
      report: minimalReport("x"),
      notes: [],
    });
  }
  saveProgressToPath(p, file, iso);
  const loaded = loadProgressFromPath(p, iso);
  assert.equal(loaded.runs.length, CONTENT_COMPLETION_MAX_RUNS);
  assert.equal(loaded.runs[0]?.offset, 5);
  assert.equal(loaded.runs[loaded.runs.length - 1]?.offset, CONTENT_COMPLETION_MAX_RUNS + 4);
});
