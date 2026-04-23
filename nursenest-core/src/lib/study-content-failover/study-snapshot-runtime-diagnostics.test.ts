import "../../../scripts/stub-server-only.cjs";
import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";

import {
  probeStudyPublishedSnapshotDir,
  runStudyPublishedSnapshotHealthScan,
} from "@/lib/study-content-failover/study-snapshot-runtime-diagnostics";

test("probeStudyPublishedSnapshotDir reports unconfigured when env unset", async () => {
  const prev = process.env.STUDY_PUBLISHED_SNAPSHOT_DIR;
  const prevReq = process.env.STUDY_FAILOVER_REQUIRED;
  delete process.env.STUDY_PUBLISHED_SNAPSHOT_DIR;
  delete process.env.STUDY_FAILOVER_REQUIRED;
  try {
    const p = await probeStudyPublishedSnapshotDir();
    assert.equal(p.configured, false);
    assert.equal(p.path, null);
    assert.equal(p.readable, false);
    assert.equal(p.failoverRequired, false);
  } finally {
    if (prev === undefined) delete process.env.STUDY_PUBLISHED_SNAPSHOT_DIR;
    else process.env.STUDY_PUBLISHED_SNAPSHOT_DIR = prev;
    if (prevReq === undefined) delete process.env.STUDY_FAILOVER_REQUIRED;
    else process.env.STUDY_FAILOVER_REQUIRED = prevReq;
  }
});

test("runStudyPublishedSnapshotHealthScan finds json files under snapshot root", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "nn-study-health-"));
  const prev = process.env.STUDY_PUBLISHED_SNAPSHOT_DIR;
  process.env.STUDY_PUBLISHED_SNAPSHOT_DIR = dir;
  try {
    await mkdir(path.join(dir, "flashcards"), { recursive: true });
    await writeFile(
      path.join(dir, "flashcards", "subscriber-list-X-US-en.json"),
      JSON.stringify({
        schema: "nursenest.study_snapshot.v1",
        surface: "flashcards_subscriber_list",
        version: "t",
        capturedAt: new Date().toISOString(),
        payload: { page: 1, pageSize: 24, total: 0, pageCount: 1, flashcards: [] },
      }),
      "utf8",
    );
    const scan = await runStudyPublishedSnapshotHealthScan({ maxFiles: 50, maxDepth: 4 });
    assert.equal(scan.probe.configured, true);
    assert.equal(scan.probe.readable, true);
    assert.ok(scan.aggregate.jsonFileCount >= 1);
    assert.ok(scan.aggregate.topLevelDirs.includes("flashcards"));
  } finally {
    if (prev === undefined) delete process.env.STUDY_PUBLISHED_SNAPSHOT_DIR;
    else process.env.STUDY_PUBLISHED_SNAPSHOT_DIR = prev;
    await rm(dir, { recursive: true, force: true });
  }
});
