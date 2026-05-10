import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  createBuildMetricsRun,
  finishBuildMetricsRun,
  persistBuildMetricsRun,
  recordBuildPhase,
} from "./build-runtime-metrics.mjs";

test("build runtime metrics helper records phases and persists bounded run history", () => {
  const tempDir = mkdtempSync(path.join(os.tmpdir(), "nn-build-metrics-"));
  const metricsPath = path.join(tempDir, "build-runtime-metrics.json");
  try {
    const run = createBuildMetricsRun({
      kind: "lesson-indexes",
      env: {
        NODE_ENV: "production",
        NN_LOW_MEMORY_BUILD: "1",
        SECRET_TOKEN: "must-not-leak",
      },
      startedAt: new Date("2026-05-10T12:00:00.000Z"),
    });

    recordBuildPhase(run, "verify_lesson_indexes", 1234, { heapUsedMb: 42 });
    finishBuildMetricsRun(run, {
      counts: {
        lessonCount: 99,
      },
      memory: {
        peakRssMb: 512,
        peakProcessCount: 3,
      },
    });
    persistBuildMetricsRun(run, { metricsPath });

    const persisted = JSON.parse(readFileSync(metricsPath, "utf8"));
    assert.equal(persisted.schemaVersion, 1);
    assert.equal(persisted.runs.length, 1);
    assert.equal(persisted.runs[0].kind, "lesson-indexes");
    assert.deepEqual(persisted.runs[0].phases[0], {
      name: "verify_lesson_indexes",
      durationMs: 1234,
      heapUsedMb: 42,
    });
    assert.equal(persisted.runs[0].counts.lessonCount, 99);
    assert.equal(persisted.runs[0].memory.peakRssMb, 512);
    assert.equal(JSON.stringify(persisted).includes("must-not-leak"), false);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
});

test("build runtime metrics helper includes latest question inventory diagnostics when present", () => {
  const tempDir = mkdtempSync(path.join(os.tmpdir(), "nn-build-metrics-cwd-"));
  const previousCwd = process.cwd();
  try {
    process.chdir(tempDir);
    mkdirSync("reports", { recursive: true });
    writeFileSync(
      "reports/question-inventory-us-rn-nclex-rn.json",
      JSON.stringify({
        generatedAt: "2026-05-10T12:00:00.000Z",
        pathwayId: "us-rn-nclex-rn",
        buckets: {
          publishedInventory: 127,
          linearPracticeReadyInventory: 121,
          catReadyInventory: 6,
        },
        exclusions: {
          ecgRows: 3,
        },
      }),
      "utf8",
    );

    const metricsPath = path.join(tempDir, "reports", "build-runtime-metrics.json");
    const run = finishBuildMetricsRun(
      createBuildMetricsRun({
        kind: "next-prod-build",
        startedAt: new Date("2026-05-10T12:01:00.000Z"),
      }),
    );
    persistBuildMetricsRun(run, { metricsPath });

    const persisted = JSON.parse(readFileSync(metricsPath, "utf8"));
    assert.deepEqual(persisted.runs[0].inventoryDiagnostics.buckets, {
      publishedInventory: 127,
      linearPracticeReadyInventory: 121,
      catReadyInventory: 6,
    });
  } finally {
    process.chdir(previousCwd);
    rmSync(tempDir, { recursive: true, force: true });
  }
});
