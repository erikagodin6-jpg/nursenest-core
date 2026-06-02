import "../../../scripts/stub-server-only.cjs";
import test from "node:test";
import assert from "node:assert/strict";
import { mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";

import { readPracticeTestsHubBootstrapSnapshot } from "@/lib/study-content-failover/practice-tests-hub-bootstrap-snapshot-read";
import { readFlashcardsHubPathwayBootstrapSnapshot } from "@/lib/study-content-failover/flashcards-hub-bootstrap-snapshot-read";

test("practice_tests_hub_bootstrap rejects wrong surface", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "nn-hub-snap-"));
  const prev = process.env.STUDY_PUBLISHED_SNAPSHOT_DIR;
  process.env.STUDY_PUBLISHED_SNAPSHOT_DIR = dir;
  try {
    await mkdir(path.join(dir, "practice-tests"), { recursive: true });
    const filePath = path.join(dir, "practice-tests", "hub-bootstrap-US-RN_STANDARD.json");
    await writeFile(
      filePath,
      JSON.stringify({
        schema: "nursenest.study_snapshot.v1",
        surface: "wrong_surface",
        version: "v",
        capturedAt: new Date().toISOString(),
        payload: {
          pathwayOptions: [{ id: "x", label: "y", examFamily: "NCLEX_RN", examCodeLabel: "RN" }],
          defaultPathwayId: "x",
          catEligiblePathwayIds: [],
        },
      }),
      "utf8",
    );
    const got = await readPracticeTestsHubBootstrapSnapshot({ tier: "RN_STANDARD", country: "US" });
    assert.equal(got, null);
  } finally {
    if (prev === undefined) delete process.env.STUDY_PUBLISHED_SNAPSHOT_DIR;
    else process.env.STUDY_PUBLISHED_SNAPSHOT_DIR = prev;
    await rm(dir, { recursive: true, force: true });
  }
});

test("flashcards_hub_pathway_bootstrap rejects invalid compatibleRows", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "nn-fc-hub-snap-"));
  const prev = process.env.STUDY_PUBLISHED_SNAPSHOT_DIR;
  process.env.STUDY_PUBLISHED_SNAPSHOT_DIR = dir;
  try {
    await mkdir(path.join(dir, "flashcards"), { recursive: true });
    const filePath = path.join(dir, "flashcards", "hub-bootstrap-US-RN_STANDARD.json");
    await writeFile(
      filePath,
      JSON.stringify({
        schema: "nursenest.study_snapshot.v1",
        surface: "flashcards_hub_pathway_bootstrap",
        version: "v",
        capturedAt: new Date().toISOString(),
        payload: {
          pathwayOptions: [{ id: "x", label: "y" }],
          compatibleRows: [{ id: "x" }],
        },
      }),
      "utf8",
    );
    const got = await readFlashcardsHubPathwayBootstrapSnapshot({ tier: "RN_STANDARD", country: "US" });
    assert.equal(got, null);
  } finally {
    if (prev === undefined) delete process.env.STUDY_PUBLISHED_SNAPSHOT_DIR;
    else process.env.STUDY_PUBLISHED_SNAPSHOT_DIR = prev;
    await rm(dir, { recursive: true, force: true });
  }
});
