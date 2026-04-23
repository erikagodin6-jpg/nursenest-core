import "../../../scripts/stub-server-only.cjs";
import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";

import { readStudyPublishedSnapshotFile, stableListOptsKey } from "@/lib/study-content-failover/study-published-snapshot-store";

test("stableListOptsKey is deterministic", () => {
  assert.equal(stableListOptsKey(undefined), "all");
  assert.equal(stableListOptsKey({ q: " A ", topicSlugsIn: ["b", "a"] }), stableListOptsKey({ q: "a", topicSlugsIn: ["a", "b"] }));
});

test("readStudyPublishedSnapshotFile returns envelope from disk", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "nn-study-snap-"));
  const prev = process.env.STUDY_PUBLISHED_SNAPSHOT_DIR;
  process.env.STUDY_PUBLISHED_SNAPSHOT_DIR = dir;
  try {
    await mkdir(path.join(dir, "demo"), { recursive: true });
    const env = {
      schema: "nursenest.study_snapshot.v1",
      surface: "demo_surface",
      version: "v-test-1",
      capturedAt: new Date().toISOString(),
      payload: { hello: 1 },
    };
    await writeFile(path.join(dir, "demo", "x.json"), JSON.stringify(env), "utf8");
    const got = await readStudyPublishedSnapshotFile<{ hello: number }>(["demo", "x.json"]);
    assert.ok(got);
    assert.equal(got!.surface, "demo_surface");
    assert.equal(got!.payload.hello, 1);
  } finally {
    if (prev === undefined) delete process.env.STUDY_PUBLISHED_SNAPSHOT_DIR;
    else process.env.STUDY_PUBLISHED_SNAPSHOT_DIR = prev;
    await rm(dir, { recursive: true, force: true });
  }
});
