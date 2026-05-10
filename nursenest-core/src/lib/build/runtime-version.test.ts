import assert from "node:assert/strict";
import test from "node:test";

import { buildRuntimeEnvMeta, buildRuntimeVersionPayload } from "./runtime-version";

test("buildRuntimeVersionPayload preserves legacy version fields and adds public diagnostics", () => {
  const payload = buildRuntimeVersionPayload(
    {
      commit: "abc123",
      branch: "main",
      recordedAt: "2026-05-10T12:00:00.000Z",
      environment: "production",
      buildPlatform: "digitalocean",
      source: "digitalocean",
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
    source: "digitalocean",
  });
});

test("buildRuntimeVersionPayload returns null-safe public fields for missing metadata", () => {
  const payload = buildRuntimeVersionPayload(null, {
    nodeEnv: "production",
    deploymentMode: null,
    env: {},
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

test("buildRuntimeEnvMeta derives commit diagnostics from deploy env when file metadata is absent", () => {
  const meta = buildRuntimeEnvMeta({
    NODE_ENV: "production",
    DIGITALOCEAN_APP_ID: "app-123",
    DIGITALOCEAN_GIT_COMMIT_SHA: "do-sha",
    DIGITALOCEAN_GIT_BRANCH: "origin/main",
  });

  assert.deepEqual(meta, {
    commit: "do-sha",
    branch: "main",
    recordedAt: null,
    environment: "production",
    buildPlatform: "digitalocean",
    source: "env:DIGITALOCEAN_GIT_COMMIT_SHA",
  });
});

test("buildRuntimeVersionPayload falls back to runtime deploy env metadata", () => {
  const payload = buildRuntimeVersionPayload(null, {
    nodeEnv: "production",
    deploymentMode: "digitalocean-app-platform",
    env: {
      NODE_ENV: "production",
      GITHUB_SHA: "gh-sha",
      GITHUB_REF_NAME: "refs/heads/main",
    },
  });

  assert.equal(payload.ok, true);
  assert.equal(payload.commit, "gh-sha");
  assert.equal(payload.branch, "main");
  assert.equal(payload.source, "env:GITHUB_SHA");
  assert.equal(payload.message, undefined);
});

test("buildRuntimeVersionPayload fills null file metadata fields from runtime deploy env", () => {
  const payload = buildRuntimeVersionPayload(
    {
      commit: null,
      branch: null,
      recordedAt: "2026-05-10T12:34:16.711Z",
      environment: "production",
      buildPlatform: "digitalocean",
      source: null,
    },
    {
      nodeEnv: "production",
      deploymentMode: "standalone",
      env: {
        NODE_ENV: "production",
        SOURCE_COMMIT: "source-sha",
        SOURCE_BRANCH: "main",
      },
    },
  );

  assert.equal(payload.ok, true);
  assert.equal(payload.commit, "source-sha");
  assert.equal(payload.branch, "main");
  assert.equal(payload.recordedAt, "2026-05-10T12:34:16.711Z");
  assert.equal(payload.source, "env:SOURCE_COMMIT");
});
