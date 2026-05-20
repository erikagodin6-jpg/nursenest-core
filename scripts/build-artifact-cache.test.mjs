import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  computeArtifactFingerprint,
  prepareArtifactCacheDecision,
  writeArtifactCache,
} from "./build-artifact-cache.mjs";

function withTempDir(fn) {
  const dir = mkdtempSync(path.join(os.tmpdir(), "nn-build-artifact-cache-"));
  try {
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test("computeArtifactFingerprint changes when an input file changes", () =>
  withTempDir((dir) => {
    const sourceDir = path.join(dir, "src");
    mkdirSync(sourceDir, { recursive: true });
    const sourcePath = path.join(sourceDir, "input.ts");
    writeFileSync(sourcePath, "export const value = 1;\n", "utf8");

    const before = computeArtifactFingerprint({
      cwd: dir,
      inputs: [{ path: "src", extensions: [".ts"] }],
    }).fingerprint;

    writeFileSync(sourcePath, "export const value = 2;\n", "utf8");

    const after = computeArtifactFingerprint({
      cwd: dir,
      inputs: [{ path: "src", extensions: [".ts"] }],
    }).fingerprint;

    assert.notEqual(before, after);
  }));

test("prepareArtifactCacheDecision reuses artifacts when cache fingerprint matches and outputs exist", () =>
  withTempDir((dir) => {
    mkdirSync(path.join(dir, "src"), { recursive: true });
    mkdirSync(path.join(dir, "out"), { recursive: true });
    writeFileSync(path.join(dir, "src", "input.ts"), "export const value = 1;\n", "utf8");
    writeFileSync(path.join(dir, "out", "artifact.json"), '{"ok":true}\n', "utf8");

    const cachePath = path.join(dir, "reports", "build-artifact-cache", "fixture.json");
    const fingerprintState = computeArtifactFingerprint({
      cwd: dir,
      inputs: [{ path: "src", extensions: [".ts"] }],
    });
    writeArtifactCache({
      cachePath,
      stepName: "fixture",
      fingerprint: fingerprintState.fingerprint,
      files: fingerprintState.files,
      outputs: [path.join(dir, "out", "artifact.json")],
    });

    const decision = prepareArtifactCacheDecision({
      stepName: "fixture",
      cwd: dir,
      cachePath,
      inputs: [{ path: "src", extensions: [".ts"] }],
      outputs: ["out/artifact.json"],
    });

    assert.equal(decision.action, "reuse");
    assert.equal(decision.reason, "fingerprint_match");
  }));

test("prepareArtifactCacheDecision rebuilds when outputs are missing or cache is corrupt", () =>
  withTempDir((dir) => {
    mkdirSync(path.join(dir, "src"), { recursive: true });
    writeFileSync(path.join(dir, "src", "input.ts"), "export const value = 1;\n", "utf8");

    const cachePath = path.join(dir, "reports", "build-artifact-cache", "fixture.json");
    mkdirSync(path.dirname(cachePath), { recursive: true });
    writeFileSync(cachePath, "{not-json}\n", "utf8");

    const corruptCacheDecision = prepareArtifactCacheDecision({
      stepName: "fixture",
      cwd: dir,
      cachePath,
      inputs: [{ path: "src", extensions: [".ts"] }],
      outputs: ["out/artifact.json"],
    });

    assert.equal(corruptCacheDecision.action, "rebuild");
    assert.equal(corruptCacheDecision.reason, "output_missing");

    mkdirSync(path.join(dir, "out"), { recursive: true });
    writeFileSync(path.join(dir, "out", "artifact.json"), '{"ok":true}\n', "utf8");

    const missingCacheDecision = prepareArtifactCacheDecision({
      stepName: "fixture",
      cwd: dir,
      cachePath,
      inputs: [{ path: "src", extensions: [".ts"] }],
      outputs: ["out/artifact.json"],
    });

    assert.equal(missingCacheDecision.action, "rebuild");
    assert.equal(missingCacheDecision.reason, "cache_corrupt");
  }));

test("prepareArtifactCacheDecision honors CI_FORCE_REBUILD", () =>
  withTempDir((dir) => {
    mkdirSync(path.join(dir, "src"), { recursive: true });
    mkdirSync(path.join(dir, "out"), { recursive: true });
    writeFileSync(path.join(dir, "src", "input.ts"), "export const value = 1;\n", "utf8");
    writeFileSync(path.join(dir, "out", "artifact.json"), '{"ok":true}\n', "utf8");

    const cachePath = path.join(dir, "reports", "build-artifact-cache", "fixture.json");
    const fingerprintState = computeArtifactFingerprint({
      cwd: dir,
      inputs: [{ path: "src", extensions: [".ts"] }],
    });
    writeArtifactCache({
      cachePath,
      stepName: "fixture",
      fingerprint: fingerprintState.fingerprint,
      files: fingerprintState.files,
      outputs: [path.join(dir, "out", "artifact.json")],
    });

    const decision = prepareArtifactCacheDecision({
      stepName: "fixture",
      cwd: dir,
      cachePath,
      inputs: [{ path: "src", extensions: [".ts"] }],
      outputs: ["out/artifact.json"],
      env: { ...process.env, CI_FORCE_REBUILD: "1" },
    });

    assert.equal(decision.action, "rebuild");
    assert.equal(decision.reason, "CI_FORCE_REBUILD");
  }));
