import assert from "node:assert/strict";
import test from "node:test";

import { buildRuntimeVersionPayload } from "./runtime-version";

test("buildRuntimeVersionPayload preserves legacy version fields and adds public diagnostics", () => {
  const payload = buildRuntimeVersionPayload(
    {
      commit: "abc123",
      branch: "main",
      recordedAt: "2026-05-10T12:00:00.000Z",
      environment: "production",
      buildPlatform: "digitalocean",
      source: "env:DIGITALOCEAN_GIT_COMMIT_SHA",
    },
    {
      nodeEnv: "production",
      deploymentMode: "standalone",
    },
  );

  assert.deepEqual(payload, {
    ok: true,
    commit: "abc123",
    branch: "main",
    recordedAt: "2026-05-10T12:00:00.000Z",
    environment: "production",
    buildPlatform: "digitalocean",
    deploymentMode: "standalone",
    runtimeEnvironment: "production",
    source: "env:DIGITALOCEAN_GIT_COMMIT_SHA",
  });
});

test("buildRuntimeVersionPayload returns null-safe public fields for missing metadata", () => {
  const payload = buildRuntimeVersionPayload(null, {
    nodeEnv: "production",
    deploymentMode: null,
  });

  assert.deepEqual(payload, {
    ok: false,
    commit: null,
    branch: null,
    recordedAt: null,
    environment: null,
    buildPlatform: null,
    deploymentMode: null,
    runtimeEnvironment: "production",
    source: null,
    message: "nn-build-meta.json missing; run a production build (prebuild writes this file).",
  });
});
