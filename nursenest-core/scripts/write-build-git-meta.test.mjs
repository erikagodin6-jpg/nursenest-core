import assert from "node:assert/strict";
import test from "node:test";

import { resolveBuildMeta } from "./write-build-git-meta.mjs";

const fixedNow = new Date("2026-05-10T12:00:00.000Z");

function gitFrom(values = {}) {
  return (args) => values[args.join(" ")] ?? null;
}

test("resolveBuildMeta prefers DigitalOcean commit and branch envs when git metadata is unavailable", () => {
  const meta = resolveBuildMeta({
    env: {
      NODE_ENV: "production",
      DIGITALOCEAN_APP_ID: "app-123",
      DIGITALOCEAN_GIT_COMMIT_SHA: "do-commit",
      DIGITALOCEAN_GIT_BRANCH: "main",
    },
    git: gitFrom(),
    now: fixedNow,
  });

  assert.deepEqual(meta, {
    commit: "do-commit",
    branch: "main",
    recordedAt: "2026-05-10T12:00:00.000Z",
    environment: "production",
    buildPlatform: "digitalocean",
    source: "env:DIGITALOCEAN_GIT_COMMIT_SHA",
  });
});

test("resolveBuildMeta handles GitHub Actions envs without local git", () => {
  const meta = resolveBuildMeta({
    env: {
      NODE_ENV: "production",
      GITHUB_ACTIONS: "true",
      GITHUB_SHA: "gh-commit",
      GITHUB_REF_NAME: "release/main",
    },
    git: gitFrom(),
    now: fixedNow,
  });

  assert.equal(meta.commit, "gh-commit");
  assert.equal(meta.branch, "release/main");
  assert.equal(meta.buildPlatform, "github-actions");
  assert.equal(meta.source, "env:GITHUB_SHA");
});

test("resolveBuildMeta falls back from detached HEAD to branch env", () => {
  const meta = resolveBuildMeta({
    env: {
      NODE_ENV: "production",
      SOURCE_BRANCH: "main",
    },
    git: gitFrom({
      "rev-parse HEAD": "git-commit",
      "rev-parse --abbrev-ref HEAD": "HEAD",
    }),
    now: fixedNow,
  });

  assert.equal(meta.commit, "git-commit");
  assert.equal(meta.branch, "main");
  assert.equal(meta.source, "git:rev-parse HEAD");
});

test("resolveBuildMeta exposes nulls without leaking arbitrary env values", () => {
  const meta = resolveBuildMeta({
    env: {
      NODE_ENV: "production",
      SECRET_TOKEN: "do-not-leak",
    },
    git: gitFrom(),
    now: fixedNow,
  });

  assert.deepEqual(meta, {
    commit: null,
    branch: null,
    recordedAt: "2026-05-10T12:00:00.000Z",
    environment: "production",
    buildPlatform: "local",
    source: null,
  });
});
